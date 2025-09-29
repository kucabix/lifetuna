import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
  validateRequiredFields,
} from "@/lib/api-utils";
import { SaveUserAnswersRequest, UserAnswerResponse } from "@/types/api";

interface RouteParams {
  params: {
    userId: string;
  };
}

// GET /api/users/[userId]/answers - Get user answers
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

    const answers = await prisma.userAnswer.findMany({
      where: { userId },
      orderBy: { questionIndex: "asc" },
    });

    const answerResponses: UserAnswerResponse[] = answers.map((answer) => ({
      id: answer.id,
      question: answer.question,
      answer: answer.answer,
      questionIndex: answer.questionIndex,
      createdAt: answer.createdAt.toISOString(),
    }));

    return createApiResponse(answerResponses);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/users/[userId]/answers - Save user answers
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = params;
    const body: SaveUserAnswersRequest = await request.json();

    const validationError = validateRequiredFields(body, ["answers"]);
    if (validationError) {
      return createErrorResponse(validationError, 400);
    }

    if (!Array.isArray(body.answers) || body.answers.length === 0) {
      return createErrorResponse("Answers must be a non-empty array", 400);
    }

    // Validate each answer
    for (const answer of body.answers) {
      if (
        !answer.question ||
        !answer.answer ||
        typeof answer.questionIndex !== "number"
      ) {
        return createErrorResponse(
          "Each answer must have question (string), answer (string), and questionIndex (number)",
          400
        );
      }
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    // Create new answers
    const answers = await prisma.userAnswer.createMany({
      data: body.answers.map((answer) => ({
        userId,
        question: answer.question,
        answer: answer.answer,
        questionIndex: answer.questionIndex,
      })),
    });

    return createApiResponse(
      { count: answers.count },
      true,
      "User answers saved successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
