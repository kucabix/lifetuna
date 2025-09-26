import { NextRequest } from "next/server";
import { llmService, PriorityAnalysisRequest } from "@/lib/llm-service";
import {
  createApiResponse,
  handleApiError,
  validateRequiredFields,
} from "@/lib/api-utils";

// POST /api/llm/analyze-priorities - Analyze user priorities and responses
export async function POST(request: NextRequest) {
  try {
    const body: PriorityAnalysisRequest = await request.json();

    const validationError = validateRequiredFields(body, [
      "userResponses",
      "currentPriorities",
    ]);
    if (validationError) {
      return createApiResponse(
        { error: validationError },
        false,
        validationError
      );
    }

    // Validate userResponses
    if (!Array.isArray(body.userResponses) || body.userResponses.length === 0) {
      return createApiResponse(
        { error: "userResponses must be a non-empty array" },
        false,
        "Invalid userResponses format"
      );
    }

    // Validate currentPriorities
    if (
      !Array.isArray(body.currentPriorities) ||
      body.currentPriorities.length === 0
    ) {
      return createApiResponse(
        { error: "currentPriorities must be a non-empty array" },
        false,
        "Invalid currentPriorities format"
      );
    }

    for (const priority of body.currentPriorities) {
      if (!priority.category || typeof priority.rank !== "number") {
        return createApiResponse(
          {
            error:
              "Each priority must have category (string) and rank (number)",
          },
          false,
          "Invalid priority format"
        );
      }
    }

    const llmResponse = await llmService.analyzePriorities(body);

    return createApiResponse(
      {
        analysis: llmResponse.content,
        model: llmResponse.model,
        usage: llmResponse.usage,
      },
      true,
      "Priority analysis completed successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
