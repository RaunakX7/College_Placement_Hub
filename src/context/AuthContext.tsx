"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: number;
  role: "student" | "admin";
  name: string;
  emailOrUsername: string;
  phone?: string | null;
  location?: string | null;
  cgpa?: number | null;
  skills?: string | null;
  bio?: string | null;
  department?: string | null;
  graduationYear?: string | null;
  resume?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { role: "student" | "admin"; email?: string; username?: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: { role: "student" | "admin"; email?: string; username?: string; password: string }) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok) {
        await refreshUser();
        
        // Redirect based on role
        if (data.user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/student/dashboard");
        }
        return { success: true };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (err: any) {
      return { success: false, error: "An unexpected error occurred." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
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
