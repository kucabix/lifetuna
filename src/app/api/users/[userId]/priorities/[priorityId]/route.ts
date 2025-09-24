import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
} from "@/lib/api-utils";
import { UpdatePriorityRequest, PriorityResponse } from "@/types/api";

interface RouteParams {
  params: {
    userId: string;
    priorityId: string;
  };
}

// GET /api/users/[userId]/priorities/[priorityId] - Get specific priority
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId, priorityId } = params;

    const priority = await prisma.userPriority.findFirst({
      where: {
        id: priorityId,
        userId,
      },
    });

    if (!priority) {
      return createErrorResponse("Priority not found", 404);
    }

    const priorityResponse: PriorityResponse = {
      id: priority.id,
      category: priority.category,
      rank: priority.rank,
      createdAt: priority.createdAt.toISOString(),
    };

    return createApiResponse(priorityResponse);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/users/[userId]/priorities/[priorityId] - Update priority
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId, priorityId } = params;
    const body: UpdatePriorityRequest = await request.json();

    const priority = await prisma.userPriority.findFirst({
      where: {
        id: priorityId,
        userId,
      },
    });

    if (!priority) {
      return createErrorResponse("Priority not found", 404);
    }

    const updatedPriority = await prisma.userPriority.update({
      where: { id: priorityId },
      data: {
        rank: body.rank,
      },
    });

    const priorityResponse: PriorityResponse = {
      id: updatedPriority.id,
      category: updatedPriority.category,
      rank: updatedPriority.rank,
      createdAt: updatedPriority.createdAt.toISOString(),
    };

    return createApiResponse(
      priorityResponse,
      true,
      "Priority updated successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/users/[userId]/priorities/[priorityId] - Delete priority
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId, priorityId } = params;

    const priority = await prisma.userPriority.findFirst({
      where: {
        id: priorityId,
        userId,
      },
    });

    if (!priority) {
      return createErrorResponse("Priority not found", 404);
    }

    await prisma.userPriority.delete({
      where: { id: priorityId },
    });

    return createApiResponse(null, true, "Priority deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
