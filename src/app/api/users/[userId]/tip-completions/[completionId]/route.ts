import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
} from "@/lib/api-utils";
import { UpdateTipCompletionRequest, TipCompletionResponse } from "@/types/api";

interface RouteParams {
  params: {
    userId: string;
    completionId: string;
  };
}

// GET /api/users/[userId]/tip-completions/[completionId] - Get specific completion
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId, completionId } = params;

    const completion = await prisma.tipCompletion.findFirst({
      where: {
        id: completionId,
        userId,
      },
    });

    if (!completion) {
      return createErrorResponse("Tip completion not found", 404);
    }

    const completionResponse: TipCompletionResponse = {
      id: completion.id,
      completedAt: completion.completedAt.toISOString(),
      rating: completion.rating,
      notes: completion.notes,
    };

    return createApiResponse(completionResponse);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/users/[userId]/tip-completions/[completionId] - Update completion
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId, completionId } = params;
    const body: UpdateTipCompletionRequest = await request.json();

    const completion = await prisma.tipCompletion.findFirst({
      where: {
        id: completionId,
        userId,
      },
    });

    if (!completion) {
      return createErrorResponse("Tip completion not found", 404);
    }

    // Validate rating if provided
    if (body.rating && (body.rating < 1 || body.rating > 5)) {
      return createErrorResponse("Rating must be between 1 and 5", 400);
    }

    const updatedCompletion = await prisma.tipCompletion.update({
      where: { id: completionId },
      data: {
        rating: body.rating,
        notes: body.notes,
      },
    });

    const completionResponse: TipCompletionResponse = {
      id: updatedCompletion.id,
      completedAt: updatedCompletion.completedAt.toISOString(),
      rating: updatedCompletion.rating,
      notes: updatedCompletion.notes,
    };

    return createApiResponse(
      completionResponse,
      true,
      "Tip completion updated successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/users/[userId]/tip-completions/[completionId] - Delete completion
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId, completionId } = params;

    const completion = await prisma.tipCompletion.findFirst({
      where: {
        id: completionId,
        userId,
      },
    });

    if (!completion) {
      return createErrorResponse("Tip completion not found", 404);
    }

    await prisma.tipCompletion.delete({
      where: { id: completionId },
    });

    return createApiResponse(null, true, "Tip completion deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
