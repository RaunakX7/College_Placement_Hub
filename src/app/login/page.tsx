"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, User, Lock, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  role: z.enum(["student", "admin"]),
  email: z.string().optional(),
  username: z.string().optional(),
  password: z.string().min(1, "Password is required"),
}).superRefine((data, ctx) => {
  if (data.role === "student") {
    if (!data.email || data.email.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Student email is required",
        path: ["email"],
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid email address",
        path: ["email"],
      });
    }
  }
  if (data.role === "admin") {
    if (!data.username || data.username.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Admin username is required",
        path: ["username"],
      });
    }
  }
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [role, setRole] = useState<"student" | "admin">("student");
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: "student",
      password: "",
    },
  });

  const handleRoleChange = (selectedRole: "student" | "admin") => {
    setRole(selectedRole);
    setValue("role", selectedRole);
    clearErrors();
    setApiError(null);
  };

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    setApiError(null);
    const result = await login({
      role: values.role,
      password: values.password,
      email: values.role === "student" ? values.email : undefined,
      username: values.role === "admin" ? values.username : undefined,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setApiError(result.error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-12 min-h-[600px]">
        {/* Brand Sidebar Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-8 sm:p-12 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
                P
              </div>
              <span className="text-xl font-bold tracking-wide">PlaceHub</span>
            </div>
            <h1 className="mt-12 text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
              One Unified Portal for Streamlined Careers
            </h1>
            <p className="mt-4 text-slate-300 leading-relaxed text-sm sm:text-base">
              Choose your profile, authenticate, and step directly into your personalized dashboard. No manual URL switching required.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
              <p className="font-semibold text-indigo-300 flex items-center gap-2 text-sm sm:text-base">
                <User size={16} /> Student Access
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Log in to apply for active drives, track interview rounds in real-time, and manage your placement profile.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
              <p className="font-semibold text-emerald-400 flex items-center gap-2 text-sm sm:text-base">
                <ShieldCheck size={16} /> Admin Access
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Control placement drives, schedule selection rounds, review student metrics, and manage jobs.
              </p>
            </div>
          </div>
        </div>

        {/* Login Form Panel */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign In</h2>
            <p className="mt-2 text-sm text-slate-500">
              Select your role and provide your account credentials.
            </p>
          </div>

          {/* Role Selection Switch */}
          <div className="mb-6 p-1 bg-slate-100 rounded-2xl flex gap-1">
            <button
              type="button"
              onClick={() => handleRoleChange("student")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                role === "student"
                  ? "bg-white text-indigo-600 shadow-sm font-bold scale-[1.02]"
                  : "text-slate-600 hover:bg-white/50"
              }`}
            >
              <User size={16} />
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("admin")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                role === "admin"
                  ? "bg-white text-indigo-600 shadow-sm font-bold scale-[1.02]"
                  : "text-slate-600 hover:bg-white/50"
              }`}
            >
              <ShieldCheck size={16} />
              Administrator
            </button>
          </div>

          {apiError && (
            <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 flex items-start gap-3 animate-shake">
              <AlertCircle className="shrink-0 mt-0.5" size={16} />
              <div>{apiError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {role === "student" ? (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Student Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    {...register("email")}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
                        : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                    placeholder="student@college.edu"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.email.message}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Admin Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register("username")}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.username
                        ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
                        : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                    placeholder="Enter admin username"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.username.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  {...register("password")}
                  className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
                      : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 shadow-lg shadow-indigo-600/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Signing In...
                </>
              ) : (
                <>
                  <Lock size={16} /> Sign In
                </>
              )}
            </button>
          </form>

          {role === "student" && (
            <div className="mt-8 rounded-2xl bg-indigo-50/50 border border-indigo-100 p-4 text-center">
              <span className="text-sm text-slate-600">Need a student account? </span>
              <Link
                href="/register"
                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-all"
              >
                Create Account
              </Link>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
