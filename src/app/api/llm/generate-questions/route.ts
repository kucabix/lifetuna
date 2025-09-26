import { NextRequest } from "next/server";
import { createApiResponse, handleApiError } from "@/lib/api-utils";
import { prisma } from "@/lib/db";

// POST /api/llm/generate-questions - Generate personalized questions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get user context and priorities
    const userId = body.userId;

    // Fetch user priorities if userId is provided
    let userPriorities: Array<{
      rank: number;
      category: string;
      title: string;
      description: string;
    }> = [];

    if (userId) {
      try {
        const priorities = await prisma.userPriority.findMany({
          where: { userId },
          include: {
            category: true,
          },
          orderBy: { rank: "asc" },
        });

        userPriorities = priorities.map((p) => ({
          rank: p.rank,
          category: p.category.name,
          title: p.category.title,
          description: p.category.description,
        }));
      } catch (error) {
        console.error("Error fetching user priorities:", error);
        // Continue without priorities if fetch fails
      }
    }

    const prompt = `You are a compassionate life coach and psychologist. Generate between 3 and 5 personalized, thought-provoking questions to help someone understand their priorities, values, and goals.

USER'S CURRENT PRIORITIES (ranked by importance):
${
  userPriorities.length > 0
    ? userPriorities
        .map((p) => `${p.rank}. ${p.title} (${p.description})`)
        .join("\n")
    : "No priorities set yet - this is their first time using the app"
}

Generate between 3 and 5 questions that:
1. Are directly related to their current priorities (if they have any)
2. Help them discover their true priorities and values
3. Explore their current life situation and challenges
4. Understand their goals and aspirations
5. Reveal their emotional state and motivations
6. Are open-ended and encourage deep reflection
7. Are personalized and relevant to their specific priority areas

CRITICAL: Your response must ONLY contain the questions, nothing else. No introductory text, no explanations, no "Here are" statements. Just the questions.

Format your response as a simple list of questions, one per line, starting with "1." for the first question, "2." for the second, etc.

Example format:
1. What is one thing you're doing right now that you won't regret in a year?
2. What area of your life feels most stuck or unsatisfied?
3. If you could give advice to your younger self, what would it be?

Make the questions:
- Personal and engaging
- Thought-provoking but not overwhelming
- Directly related to their priority areas (career, health, relationships, etc.)
- Encouraging and supportive in tone
- Designed to reveal important insights about their values and motivations

Focus on questions that will help them understand what truly matters to them and what they want to prioritize in their life.`;

    // Create a custom method for this specific use case
    const response = await fetch(
      `${process.env.OLLAMA_BASE_URL || "http://localhost:11434"}/api/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL || "llama3",
          prompt: prompt,
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Ollama API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const llmResponse = {
      content: data.response,
      model: process.env.OLLAMA_MODEL || "llama3",
      usage: {
        prompt_tokens: data.prompt_eval_count || 0,
        completion_tokens: data.eval_count || 0,
        total_tokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
      },
    };

    const questions = llmResponse.content
      .split("\n")
      .map((q: string) => q.trim());

    return createApiResponse(
      {
        questions: questions,
        model: llmResponse.model,
        usage: llmResponse.usage,
      },
      true,
      "Personalized questions generated successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
