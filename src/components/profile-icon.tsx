"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export function ProfileIcon() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full p-0"
      >
        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
          {user.name?.charAt(0).toUpperCase() ||
            user.email.charAt(0).toUpperCase()}
        </div>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-48 bg-background border border-border rounded-md shadow-lg z-50">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-medium">{user.name || "User"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-sm"
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
