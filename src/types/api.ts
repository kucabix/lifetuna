// API Request/Response Types

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name?: string;
}

export interface UpdateUserRequest {
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreatePriorityRequest {
  category: string;
  rank: number;
}

export interface UpdatePriorityRequest {
  rank: number;
}

export interface CreateTipRequest {
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  duration: number;
  llmPrompt: string;
  llmResponse: unknown;
}

export interface CreateTipCompletionRequest {
  tipId: string;
  rating?: number;
  notes?: string;
}

export interface UpdateTipCompletionRequest {
  rating?: number;
  notes?: string;
}

// User API responses
export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithPrioritiesResponse extends UserResponse {
  priorities: PriorityResponse[];
}

// Priority API responses
export interface PriorityResponse {
  id: string;
  category: string;
  rank: number;
  createdAt: string;
}

// Tip API responses
export interface TipResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  createdAt: string;
}

export interface TipWithCompletionResponse extends TipResponse {
  isCompleted: boolean;
  completion?: TipCompletionResponse;
}

// Tip completion API responses
export interface TipCompletionResponse {
  id: string;
  completedAt: string;
  rating: number | null;
  notes: string | null;
}

// Tip view API responses
export interface TipViewResponse {
  id: string;
  tipId: string;
  viewedAt: string;
}
