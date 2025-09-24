import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
  validateRequiredFields,
} from "@/lib/api-utils";
import {
  CreatePriorityRequest,
  PriorityResponse,
  BulkUpdatePrioritiesRequest,
} from "@/types/api";

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
      include: {
        category: true,
      },
      orderBy: { rank: "asc" },
    });

    const priorityResponses: PriorityResponse[] = priorities.map(
      (priority) => ({
        id: priority.id,
        category: priority.category.name,
        categoryId: priority.categoryId,
        categoryTitle: priority.category.title,
        categoryDescription: priority.category.description,
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

    const validationError = validateRequiredFields(body, [
      "categoryId",
      "rank",
    ]);
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

    // Check if priority category exists
    const category = await prisma.priorityCategory.findUnique({
      where: { id: body.categoryId },
    });

    if (!category) {
      return createErrorResponse("Priority category not found", 404);
    }

    // Check if priority already exists for this category
    const existingPriority = await prisma.userPriority.findUnique({
      where: {
        userId_categoryId: {
          userId,
          categoryId: body.categoryId,
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
        categoryId: body.categoryId,
        rank: body.rank,
      },
      include: {
        category: true,
      },
    });

    const priorityResponse: PriorityResponse = {
      id: priority.id,
      category: priority.category.name,
      categoryId: priority.categoryId,
      categoryTitle: priority.category.title,
      categoryDescription: priority.category.description,
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

// PUT /api/users/[userId]/priorities - Bulk update user priorities
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = params;
    const body: BulkUpdatePrioritiesRequest = await request.json();

    const validationError = validateRequiredFields(body, ["priorities"]);
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

    // Validate all category IDs exist
    const categoryIds = body.priorities.map((p) => p.categoryId);
    const categories = await prisma.priorityCategory.findMany({
      where: { id: { in: categoryIds } },
    });

    if (categories.length !== categoryIds.length) {
      return createErrorResponse(
        "One or more priority categories not found",
        404
      );
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Delete all existing priorities for this user
      await tx.userPriority.deleteMany({
        where: { userId },
      });

      // Create new priorities
      await tx.userPriority.createMany({
        data: body.priorities.map((priority) => ({
          userId,
          categoryId: priority.categoryId,
          rank: priority.rank,
        })),
      });

      // Return the created priorities with category details
      const priorities = await tx.userPriority.findMany({
        where: { userId },
        include: {
          category: true,
        },
        orderBy: { rank: "asc" },
      });

      return priorities;
    });

    const priorityResponses: PriorityResponse[] = result.map((priority) => ({
      id: priority.id,
      category: priority.category.name,
      categoryId: priority.categoryId,
      categoryTitle: priority.category.title,
      categoryDescription: priority.category.description,
      rank: priority.rank,
      createdAt: priority.createdAt.toISOString(),
    }));

    return createApiResponse(
      priorityResponses,
      true,
      "Priorities updated successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
