import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
  validateEmail,
  validateRequiredFields,
} from "@/lib/api-utils";
import { verifyPassword } from "@/lib/auth-utils";
import { LoginRequest, UserResponse } from "@/types/api";
import { cookies } from "next/headers";

// POST /api/auth/login - Login user
export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    const validationError = validateRequiredFields(body, ["email", "password"]);
    if (validationError) {
      return createErrorResponse(validationError, 400);
    }

    if (!validateEmail(body.email)) {
      return createErrorResponse("Invalid email format", 400);
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return createErrorResponse("Invalid email or password", 401);
    }

    // Verify password
    const isValidPassword = await verifyPassword(body.password, user.password);
    if (!isValidPassword) {
      return createErrorResponse("Invalid email or password", 401);
    }

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return createApiResponse(userResponse, true, "Login successful");
  } catch (error) {
    return handleApiError(error);
  }
}
