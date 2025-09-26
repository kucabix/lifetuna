import { NextRequest } from "next/server";
import { llmService, TipGenerationRequest } from "@/lib/llm-service";
import {
  createApiResponse,
  handleApiError,
  validateRequiredFields,
} from "@/lib/api-utils";

// POST /api/llm/generate-tips - Generate personalized tips
export async function POST(request: NextRequest) {
  try {
    const body: TipGenerationRequest = await request.json();

    const validationError = validateRequiredFields(body, ["userPriorities"]);
    if (validationError) {
      return createApiResponse(
        { error: validationError },
        false,
        validationError
      );
    }

    // Validate userPriorities structure
    if (
      !Array.isArray(body.userPriorities) ||
      body.userPriorities.length === 0
    ) {
      return createApiResponse(
        { error: "userPriorities must be a non-empty array" },
        false,
        "Invalid userPriorities format"
      );
    }

    for (const priority of body.userPriorities) {
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

    const llmResponse = await llmService.generatePersonalizedTips(body);

    return createApiResponse(
      {
        tips: llmResponse.content,
        model: llmResponse.model,
        usage: llmResponse.usage,
      },
      true,
      "Personalized tips generated successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
