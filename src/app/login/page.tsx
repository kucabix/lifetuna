"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Tuna from "@/assets/tuna.svg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    console.log("Login attempt:", { email, password });
  };

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
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Sign In
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
