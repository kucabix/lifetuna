import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
  validateRequiredFields,
} from "@/lib/api-utils";
import { CreateTipRequest, TipResponse } from "@/types/api";

// GET /api/tips - Get tips with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const limit = searchParams.get("limit");

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    const tips = await prisma.tip.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit) : undefined,
    });

    const tipResponses: TipResponse[] = tips.map((tip) => ({
      id: tip.id,
      title: tip.title,
      description: tip.description,
      category: tip.category,
      difficulty: tip.difficulty,
      duration: tip.duration,
      createdAt: tip.createdAt.toISOString(),
    }));

    return createApiResponse(tipResponses);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/tips - Create new tip
export async function POST(request: NextRequest) {
  try {
    const body: CreateTipRequest = await request.json();

    const validationError = validateRequiredFields(body, [
      "title",
      "description",
      "category",
      "difficulty",
      "duration",
      "llmPrompt",
      "llmResponse",
    ]);
    if (validationError) {
      return createErrorResponse(validationError, 400);
    }

    // Validate difficulty
    if (!["easy", "medium", "hard"].includes(body.difficulty)) {
      return createErrorResponse(
        "Difficulty must be easy, medium, or hard",
        400
      );
    }

    // Validate duration
    if (body.duration <= 0) {
      return createErrorResponse("Duration must be greater than 0", 400);
    }

    const tip = await prisma.tip.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        difficulty: body.difficulty,
        duration: body.duration,
        llmPrompt: body.llmPrompt,
        llmResponse: body.llmResponse,
      },
    });

    const tipResponse: TipResponse = {
      id: tip.id,
      title: tip.title,
      description: tip.description,
      category: tip.category,
      difficulty: tip.difficulty,
      duration: tip.duration,
      createdAt: tip.createdAt.toISOString(),
    };

    return createApiResponse(tipResponse, true, "Tip created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
