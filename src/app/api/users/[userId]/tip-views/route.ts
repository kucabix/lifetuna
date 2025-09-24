import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
  validateRequiredFields,
} from "@/lib/api-utils";
import { TipViewResponse } from "@/types/api";

interface RouteParams {
  params: {
    userId: string;
  };
}

// GET /api/users/[userId]/tip-views - Get user's tip views
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    const views = await prisma.tipView.findMany({
      where: { userId },
      include: {
        tip: true,
      },
      orderBy: { viewedAt: "desc" },
    });

    const viewResponses: TipViewResponse[] = views.map((view) => ({
      id: view.id,
      tipId: view.tipId,
      viewedAt: view.viewedAt.toISOString(),
    }));

    return createApiResponse(viewResponses);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/users/[userId]/tip-views - Record tip view
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = params;
    const body = await request.json();
    const { tipId } = body;

    const validationError = validateRequiredFields(body, ["tipId"]);
    if (validationError) {
      return createErrorResponse(validationError, 400);
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    // Check if tip exists
    const tip = await prisma.tip.findUnique({
      where: { id: tipId },
    });

    if (!tip) {
      return createErrorResponse("Tip not found", 404);
    }

    // Check if view already exists
    const existingView = await prisma.tipView.findUnique({
      where: {
        userId_tipId: {
          userId,
          tipId,
        },
      },
    });

    if (existingView) {
      return createErrorResponse("Tip view already exists", 409);
    }

    const view = await prisma.tipView.create({
      data: {
        userId,
        tipId,
      },
    });

    const viewResponse: TipViewResponse = {
      id: view.id,
      tipId: view.tipId,
      viewedAt: view.viewedAt.toISOString(),
    };

    return createApiResponse(
      viewResponse,
      true,
      "Tip view recorded successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
