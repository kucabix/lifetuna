"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserResponse } from "@/types/api";
import { apiClient } from "@/lib/api-client";

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  login: (userData: UserResponse) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by making a request to get current user
    const checkAuth = async () => {
      try {
        const response = await apiClient.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: UserResponse) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
