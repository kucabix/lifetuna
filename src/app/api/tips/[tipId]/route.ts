import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
} from "@/lib/api-utils";
import { TipResponse } from "@/types/api";

interface RouteParams {
  params: {
    tipId: string;
  };
}

// GET /api/tips/[tipId] - Get specific tip
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { tipId } = params;

    const tip = await prisma.tip.findUnique({
      where: { id: tipId },
    });

    if (!tip) {
      return createErrorResponse("Tip not found", 404);
    }

    const tipResponse: TipResponse = {
      id: tip.id,
      title: tip.title,
      description: tip.description,
      category: tip.category,
      difficulty: tip.difficulty,
      duration: tip.duration,
      createdAt: tip.createdAt.toISOString(),
    };

    return createApiResponse(tipResponse);
  } catch (error) {
    return handleApiError(error);
  }
}
