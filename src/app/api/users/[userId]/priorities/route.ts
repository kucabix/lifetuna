import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
  validateRequiredFields,
} from "@/lib/api-utils";
import { CreatePriorityRequest, PriorityResponse } from "@/types/api";

interface RouteParams {
  params: {
    userId: string;
  };
}

// GET /api/users/[userId]/priorities - Get user priorities
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

    const priorities = await prisma.userPriority.findMany({
      where: { userId },
      orderBy: { rank: "asc" },
    });

    const priorityResponses: PriorityResponse[] = priorities.map(
      (priority) => ({
        id: priority.id,
        category: priority.category,
        rank: priority.rank,
        createdAt: priority.createdAt.toISOString(),
      })
    );

    return createApiResponse(priorityResponses);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/users/[userId]/priorities - Create user priority
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = params;
    const body: CreatePriorityRequest = await request.json();

    const validationError = validateRequiredFields(body, ["category", "rank"]);
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

    // Check if priority already exists for this category
    const existingPriority = await prisma.userPriority.findUnique({
      where: {
        userId_category: {
          userId,
          category: body.category,
        },
      },
    });

    if (existingPriority) {
      return createErrorResponse(
        "Priority for this category already exists",
        409
      );
    }

    const priority = await prisma.userPriority.create({
      data: {
        userId,
        category: body.category,
        rank: body.rank,
      },
    });

    const priorityResponse: PriorityResponse = {
      id: priority.id,
      category: priority.category,
      rank: priority.rank,
      createdAt: priority.createdAt.toISOString(),
    };

    return createApiResponse(
      priorityResponse,
      true,
      "Priority created successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
