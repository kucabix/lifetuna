import { NextRequest } from "next/server";
import { llmService } from "@/lib/llm-service";
import { createApiResponse, handleApiError } from "@/lib/api-utils";

// GET /api/llm/test - Test LLM connection
export async function GET(request: NextRequest) {
  try {
    const isConnected = await llmService.testConnection();

    if (isConnected) {
      return createApiResponse(
        { connected: true, message: "LLM service is working correctly" },
        true,
        "LLM connection successful"
      );
    } else {
      return createApiResponse(
        { connected: false, message: "LLM service is not responding" },
        false,
        "LLM connection failed"
      );
    }
  } catch (error) {
    return handleApiError(error);
  }
}
