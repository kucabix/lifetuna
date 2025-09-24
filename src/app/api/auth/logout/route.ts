import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createApiResponse } from "@/lib/api-utils";

// POST /api/auth/logout - Logout user
export async function POST(request: NextRequest) {
  try {
    // Clear session cookie
    const cookieStore = await cookies();
    cookieStore.delete("session");

    return createApiResponse(null, true, "Logout successful");
  } catch (error) {
    return createApiResponse(null, false, "Logout failed");
  }
}
