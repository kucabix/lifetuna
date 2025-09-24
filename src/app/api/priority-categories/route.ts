import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { createApiResponse, handleApiError } from "@/lib/api-utils";

// GET /api/priority-categories - Get all available priority categories
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.priorityCategory.findMany({
      orderBy: { name: "asc" },
    });

    const categoryResponses = categories.map((category) => ({
      id: category.id,
      name: category.name,
      title: category.title,
      description: category.description,
      createdAt: category.createdAt.toISOString(),
    }));

    return createApiResponse(categoryResponses);
  } catch (error) {
    return handleApiError(error);
  }
}
