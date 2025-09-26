// LLM Service for Ollama Integration
// Handles communication with local Ollama instance

export interface LLMResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface TipGenerationRequest {
  userPriorities: Array<{
    category: string;
    rank: number;
  }>;
  userResponses?: string[];
  currentGoals?: string[];
  emotionalState?: string;
}

export interface PriorityAnalysisRequest {
  userResponses: string[];
  currentPriorities: Array<{
    category: string;
    rank: number;
  }>;
}

class LLMService {
  private baseUrl: string;
  private model: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    this.model = process.env.OLLAMA_MODEL || "llama3";
  }

  private async makeRequest(prompt: string): Promise<LLMResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Ollama API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      return {
        content: data.response,
        model: this.model,
        usage: {
          prompt_tokens: data.prompt_eval_count || 0,
          completion_tokens: data.eval_count || 0,
          total_tokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
        },
      };
    } catch (error) {
      console.error("LLM Service Error:", error);
      throw new Error(
        `Failed to communicate with LLM: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Generate personalized tips based on user priorities and emotional state
   */
  async generatePersonalizedTips(
    request: TipGenerationRequest
  ): Promise<LLMResponse> {
    const prioritiesText = request.userPriorities
      .sort((a, b) => a.rank - b.rank)
      .map((p) => `${p.rank}. ${p.category}`)
      .join("\n");

    const responsesText = request.userResponses?.join("\n") || "";
    const goalsText = request.currentGoals?.join(", ") || "";
    const emotionalText = request.emotionalState || "";

    const prompt = `You are a compassionate life coach and productivity expert. Generate 3 personalized, actionable tips for someone based on their priorities and current state.

      USER'S PRIORITIES (ranked by importance):
      ${prioritiesText}

      USER'S CURRENT GOALS: ${goalsText}

      USER'S RESPONSES TO QUESTIONS: ${responsesText}

      CURRENT EMOTIONAL STATE: ${emotionalText}

      Please generate 3 specific, actionable tips that:
      1. Are directly related to their top priorities
      2. Consider their emotional state and goals
      3. Are practical and achievable (5-30 minutes each)
      4. Provide emotional support and motivation
      5. Are personalized to their specific situation

      Format each tip as:
      **Tip [Number]: [Title]**
      - [Brief description]
      - [Specific action to take]
      - [Why this helps with their priorities]

      Make the tips feel personal, supportive, and directly connected to what matters most to them right now.`;

    return this.makeRequest(prompt);
  }

  /**
   * Analyze user responses to provide insights about their priorities
   */
  async analyzePriorities(
    request: PriorityAnalysisRequest
  ): Promise<LLMResponse> {
    const responsesText = request.userResponses.join("\n");
    const prioritiesText = request.currentPriorities
      .sort((a, b) => a.rank - b.rank)
      .map((p) => `${p.rank}. ${p.category}`)
      .join("\n");

    const prompt = `You are an expert life coach and psychologist. Analyze the user's responses and current priorities to provide deep insights.

      USER'S CURRENT PRIORITY RANKINGS:
      ${prioritiesText}

      USER'S RESPONSES TO LIFE QUESTIONS:
      ${responsesText}

      Please provide a thoughtful analysis that includes:

      1. **Emotional Insights**: What emotions and values are driving their priorities?
      2. **Pattern Recognition**: What patterns do you see in their responses?
      3. **Potential Misalignments**: Are there any conflicts between stated priorities and responses?
      4. **Growth Opportunities**: What areas might they want to explore or develop?
      5. **Motivation Factors**: What seems to truly motivate and energize them?
      6. **Recommendations**: 2-3 specific suggestions for better alignment or growth

      Be compassionate, insightful, and focus on helping them understand themselves better. Use their own words and feelings to guide the analysis.`;

    return this.makeRequest(prompt);
  }

  /**
   * Generate daily motivation and reflection prompts
   */
  async generateDailyReflection(
    userPriorities: Array<{ category: string; rank: number }>
  ): Promise<LLMResponse> {
    const prioritiesText = userPriorities
      .sort((a, b) => a.rank - b.rank)
      .map((p) => `${p.rank}. ${p.category}`)
      .join("\n");

    const prompt = `You are a wise mentor providing daily guidance. Create a personalized daily reflection and motivation message.

      USER'S TOP PRIORITIES:
      ${prioritiesText}

      Generate:
      1. **Today's Focus**: A specific area to focus on today based on their priorities
      2. **Reflection Question**: A thoughtful question to help them connect with their values
      3. **Motivational Message**: Encouraging words that acknowledge their journey
      4. **Small Action**: One tiny step they can take today (2-5 minutes)
      5. **Gratitude Prompt**: Something to appreciate about their current situation

      Make it feel personal, warm, and directly connected to what matters most to them. Keep it concise but meaningful.`;

    return this.makeRequest(prompt);
  }

  /**
   * Test the LLM connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest(
        "Hello! Please respond with 'LLM service is working correctly.'"
      );
      return response.content.toLowerCase().includes("working");
    } catch (error) {
      console.error("LLM connection test failed:", error);
      return false;
    }
  }
}

// Export singleton instance
export const llmService = new LLMService();
