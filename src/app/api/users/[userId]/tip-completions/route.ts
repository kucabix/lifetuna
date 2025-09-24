import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
  validateRequiredFields,
} from "@/lib/api-utils";
import { CreateTipCompletionRequest, TipCompletionResponse } from "@/types/api";

interface RouteParams {
  params: {
    userId: string;
  };
}

// GET /api/users/[userId]/tip-completions - Get user's tip completions
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

    const completions = await prisma.tipCompletion.findMany({
      where: { userId },
      include: {
        tip: true,
      },
      orderBy: { completedAt: "desc" },
    });

    const completionResponses: TipCompletionResponse[] = completions.map(
      (completion) => ({
        id: completion.id,
        completedAt: completion.completedAt.toISOString(),
        rating: completion.rating,
        notes: completion.notes,
      })
    );

    return createApiResponse(completionResponses);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/users/[userId]/tip-completions - Create tip completion
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = params;
    const body: CreateTipCompletionRequest = await request.json();

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
      where: { id: body.tipId },
    });

    if (!tip) {
      return createErrorResponse("Tip not found", 404);
    }

    // Check if completion already exists
    const existingCompletion = await prisma.tipCompletion.findUnique({
      where: {
        userId_tipId: {
          userId,
          tipId: body.tipId,
        },
      },
    });

    if (existingCompletion) {
      return createErrorResponse("Tip completion already exists", 409);
    }

    // Validate rating if provided
    if (body.rating && (body.rating < 1 || body.rating > 5)) {
      return createErrorResponse("Rating must be between 1 and 5", 400);
    }

    const completion = await prisma.tipCompletion.create({
      data: {
        userId,
        tipId: body.tipId,
        rating: body.rating,
        notes: body.notes,
      },
    });

    const completionResponse: TipCompletionResponse = {
      id: completion.id,
      completedAt: completion.completedAt.toISOString(),
      rating: completion.rating,
      notes: completion.notes,
    };

    return createApiResponse(
      completionResponse,
      true,
      "Tip completion created successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
