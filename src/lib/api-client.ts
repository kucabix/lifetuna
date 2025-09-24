import {
  ApiResponse,
  CreateUserRequest,
  UpdateUserRequest,
  LoginRequest,
  UserResponse,
  CreatePriorityRequest,
  UpdatePriorityRequest,
  BulkUpdatePrioritiesRequest,
  PriorityCategoryResponse,
  PriorityResponse,
  CreateTipRequest,
  TipResponse,
  CreateTipCompletionRequest,
  UpdateTipCompletionRequest,
  TipCompletionResponse,
  TipViewResponse,
} from "@/types/api";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    return response.json();
  }

  // Auth endpoints
  async login(loginData: LoginRequest): Promise<ApiResponse<UserResponse>> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<UserResponse>> {
    return this.request("/auth/me");
  }

  async logout(): Promise<ApiResponse<null>> {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  // User endpoints
  async getUserByEmail(email: string): Promise<ApiResponse<UserResponse>> {
    return this.request(`/users?email=${encodeURIComponent(email)}`);
  }

  async createUser(
    userData: CreateUserRequest
  ): Promise<ApiResponse<UserResponse>> {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getUser(userId: string): Promise<ApiResponse<UserResponse>> {
    return this.request(`/users/${userId}`);
  }

  async updateUser(
    userId: string,
    userData: UpdateUserRequest
  ): Promise<ApiResponse<UserResponse>> {
    return this.request(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string): Promise<ApiResponse> {
    return this.request(`/users/${userId}`, {
      method: "DELETE",
    });
  }

  // Priority endpoints
  async getPriorityCategories(): Promise<
    ApiResponse<PriorityCategoryResponse[]>
  > {
    return this.request("/priority-categories");
  }

  async getUserPriorities(
    userId: string
  ): Promise<ApiResponse<PriorityResponse[]>> {
    return this.request(`/users/${userId}/priorities`);
  }

  async createPriority(
    userId: string,
    priorityData: CreatePriorityRequest
  ): Promise<ApiResponse<PriorityResponse>> {
    return this.request(`/users/${userId}/priorities`, {
      method: "POST",
      body: JSON.stringify(priorityData),
    });
  }

  async bulkUpdatePriorities(
    userId: string,
    prioritiesData: BulkUpdatePrioritiesRequest
  ): Promise<ApiResponse<PriorityResponse[]>> {
    return this.request(`/users/${userId}/priorities`, {
      method: "PUT",
      body: JSON.stringify(prioritiesData),
    });
  }

  async getPriority(
    userId: string,
    priorityId: string
  ): Promise<ApiResponse<PriorityResponse>> {
    return this.request(`/users/${userId}/priorities/${priorityId}`);
  }

  async updatePriority(
    userId: string,
    priorityId: string,
    priorityData: UpdatePriorityRequest
  ): Promise<ApiResponse<PriorityResponse>> {
    return this.request(`/users/${userId}/priorities/${priorityId}`, {
      method: "PUT",
      body: JSON.stringify(priorityData),
    });
  }

  async deletePriority(
    userId: string,
    priorityId: string
  ): Promise<ApiResponse> {
    return this.request(`/users/${userId}/priorities/${priorityId}`, {
      method: "DELETE",
    });
  }

  // Tip endpoints
  async getTips(filters?: {
    category?: string;
    difficulty?: string;
    limit?: number;
  }): Promise<ApiResponse<TipResponse[]>> {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.difficulty) params.append("difficulty", filters.difficulty);
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const queryString = params.toString();
    return this.request(`/tips${queryString ? `?${queryString}` : ""}`);
  }

  async getTip(tipId: string): Promise<ApiResponse<TipResponse>> {
    return this.request(`/tips/${tipId}`);
  }

  async createTip(
    tipData: CreateTipRequest
  ): Promise<ApiResponse<TipResponse>> {
    return this.request("/tips", {
      method: "POST",
      body: JSON.stringify(tipData),
    });
  }

  // Tip completion endpoints
  async getUserTipCompletions(
    userId: string
  ): Promise<ApiResponse<TipCompletionResponse[]>> {
    return this.request(`/users/${userId}/tip-completions`);
  }

  async createTipCompletion(
    userId: string,
    completionData: CreateTipCompletionRequest
  ): Promise<ApiResponse<TipCompletionResponse>> {
    return this.request(`/users/${userId}/tip-completions`, {
      method: "POST",
      body: JSON.stringify(completionData),
    });
  }

  async getTipCompletion(
    userId: string,
    completionId: string
  ): Promise<ApiResponse<TipCompletionResponse>> {
    return this.request(`/users/${userId}/tip-completions/${completionId}`);
  }

  async updateTipCompletion(
    userId: string,
    completionId: string,
    completionData: UpdateTipCompletionRequest
  ): Promise<ApiResponse<TipCompletionResponse>> {
    return this.request(`/users/${userId}/tip-completions/${completionId}`, {
      method: "PUT",
      body: JSON.stringify(completionData),
    });
  }

  async deleteTipCompletion(
    userId: string,
    completionId: string
  ): Promise<ApiResponse> {
    return this.request(`/users/${userId}/tip-completions/${completionId}`, {
      method: "DELETE",
    });
  }

  // Tip view endpoints
  async getUserTipViews(
    userId: string
  ): Promise<ApiResponse<TipViewResponse[]>> {
    return this.request(`/users/${userId}/tip-views`);
  }

  async recordTipView(
    userId: string,
    tipId: string
  ): Promise<ApiResponse<TipViewResponse>> {
    return this.request(`/users/${userId}/tip-views`, {
      method: "POST",
      body: JSON.stringify({ tipId }),
    });
  }
}

// Export a default instance
export const apiClient = new ApiClient();

// Export the class for custom instances
export { ApiClient };
