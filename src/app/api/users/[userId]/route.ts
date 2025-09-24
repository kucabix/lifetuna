import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
  requireAuth,
} from "@/lib/api-utils";
import { UpdateUserRequest, UserResponse } from "@/types/api";

interface RouteParams {
  params: {
    userId: string;
  };
}

// GET /api/users/[userId] - Get user by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        priorities: {
          orderBy: { rank: "asc" },
        },
      },
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return createApiResponse(userResponse);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/users/[userId] - Update user
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = params;
    const body: UpdateUserRequest = await request.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return createErrorResponse("User not found", 404);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name,
      },
    });

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return createApiResponse(userResponse, true, "User updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/users/[userId] - Delete user
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return createErrorResponse("User not found", 404);
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return createApiResponse(null, true, "User deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
