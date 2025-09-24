import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
} from "@/lib/api-utils";
import { cookies } from "next/headers";
import { UserResponse } from "@/types/api";

// GET /api/auth/me - Get current user
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;

    if (!sessionId) {
      return createErrorResponse("Not authenticated", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionId },
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

    return createApiResponse(userResponse, true, "User retrieved successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
