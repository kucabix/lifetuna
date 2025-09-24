import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api";

export function createApiResponse<T>(
  data?: T,
  success: boolean = true,
  message?: string,
  error?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success,
    data,
    message,
    error,
  });
}

export function createErrorResponse(
  error: string,
  status: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}

export function createSuccessResponse<T>(
  data: T,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  });
}

export async function handleApiError(
  error: unknown
): Promise<NextResponse<ApiResponse>> {
  console.error("API Error:", error);

  if (error instanceof Error) {
    return createErrorResponse(error.message, 500);
  }

  return createErrorResponse("Internal server error", 500);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateRequiredFields<T extends object>(
  data: T,
  requiredFields: (keyof T)[]
): string | null {
  for (const field of requiredFields) {
    const value = data[field] as unknown;
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return `Field '${String(field)}' is required`;
    }
  }
  return null;
}

export function getUserIdFromRequest(request: NextRequest): string | null {
  // For now, we'll use a simple header approach
  // In a real app, you'd validate JWT tokens or session cookies
  const userId = request.headers.get("x-user-id");
  return userId;
}

export function requireAuth(request: NextRequest): string {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    throw new Error("Authentication required");
  }
  return userId;
}
