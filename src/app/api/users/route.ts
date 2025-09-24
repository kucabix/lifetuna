import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
  validateEmail,
  validateRequiredFields,
} from "@/lib/api-utils";
import { hashPassword, validatePassword } from "@/lib/auth-utils";
import { CreateUserRequest, UserResponse } from "@/types/api";

// GET /api/users - Get user by email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return createErrorResponse("Email parameter is required", 400);
    }

    if (!validateEmail(email)) {
      return createErrorResponse("Invalid email format", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
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

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body: CreateUserRequest = await request.json();

    const validationError = validateRequiredFields(body, ["email", "password"]);
    if (validationError) {
      return createErrorResponse(validationError, 400);
    }

    if (!validateEmail(body.email)) {
      return createErrorResponse("Invalid email format", 400);
    }

    const passwordError = validatePassword(body.password);
    if (passwordError) {
      return createErrorResponse(passwordError, 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return createErrorResponse("User with this email already exists", 409);
    }

    const hashedPassword = await hashPassword(body.password);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
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

    return createApiResponse(userResponse, true, "User created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
