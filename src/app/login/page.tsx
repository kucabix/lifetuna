"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Tuna from "@/assets/tuna.svg";
import { apiClient } from "@/lib/api-client";

interface LoginState {
  success: boolean;
  error: string | null;
  fieldErrors: {
    email?: string;
    password?: string;
  };
}

async function loginAction(
  _: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Client-side validation
  const fieldErrors: { email?: string; password?: string } = {};

  if (!email?.trim()) {
    fieldErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Please enter a valid email address";
  }

  if (!password?.trim()) {
    fieldErrors.password = "Password is required";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: null,
      fieldErrors,
    };
  }

  try {
    const response = await apiClient.login({ email, password });

    if (response.success) {
      // Success - redirect to home
      window.location.href = "/";
      return {
        success: true,
        error: null,
        fieldErrors: {},
      };
    } else {
      // Handle different error types
      let errorMessage = "Login failed. Please try again.";

      if (response.error?.includes("Invalid email or password")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (response.error?.includes("Invalid email format")) {
        errorMessage = "Please check your input and try again.";
      } else if (response.error?.includes("Server error")) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage = response.error || errorMessage;
      }

      return {
        success: false,
        error: errorMessage,
        fieldErrors: {},
      };
    }
  } catch (error) {
    console.error("Login failed:", error);
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
      fieldErrors: {},
    };
  }
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, {
    success: false,
    error: null,
    fieldErrors: {},
  });

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Tuna
            width={60}
            height={60}
            className="text-foreground mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold uppercase tracking-wider">
            Life Tuna
          </h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            {state.error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 m-0">{state.error}</p>
              </div>
            )}

            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className={state.fieldErrors.email ? "border-red-500" : ""}
                  required
                />
                {state.fieldErrors.email && (
                  <p className="text-sm text-red-600">
                    {state.fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className={state.fieldErrors.password ? "border-red-500" : ""}
                  required
                />
                {state.fieldErrors.password && (
                  <p className="text-sm text-red-600">
                    {state.fieldErrors.password}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={handleBackToHome}
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
