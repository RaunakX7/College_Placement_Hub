"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { UserPlus, User, Mail, ShieldAlert, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").endsWith(".edu", {
    message: "Must be a college .edu email address",
  }).or(z.string().email("Invalid email address")), // Accept fallback standard emails
  rollNumber: z.string().min(1, "Roll number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        // Registration success, redirect to login
        router.push("/login?registered=true");
      } else {
        setApiError(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setApiError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-12 min-h-[600px]">
        {/* Branding Sidebar */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-8 sm:p-12 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
                P
              </div>
              <span className="text-xl font-bold tracking-wide">PlaceHub</span>
            </div>
            <h1 className="mt-12 text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
              Create Your Student Profile Today
            </h1>
            <p className="mt-4 text-indigo-200 leading-relaxed text-sm">
              Join your campus placement ecosystem. Upload your credentials, unlock tailored corporate drives, and track selection rounds seamlessly.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="font-semibold text-indigo-300 text-sm">Verify Academics</p>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Roll number and graduation parameters will map directly to your recruitment database.
              </p>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Registration</h2>
            <p className="mt-2 text-sm text-slate-500">
              Only verified students can register. Admins must log in using root credentials.
            </p>
          </div>

          {apiError && (
            <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 flex items-start gap-3 animate-shake">
              <AlertCircle className="shrink-0 mt-0.5" size={16} />
              <div>{apiError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                {...register("name")}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
                    : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                {...register("email")}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
                    : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                }`}
                placeholder="john.doe@college.edu"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Roll Number</label>
              <input
                type="text"
                {...register("rollNumber")}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.rollNumber
                    ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
                    : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                }`}
                placeholder="CS2023004"
              />
              {errors.rollNumber && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.rollNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                {...register("password")}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
                    : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 shadow-lg shadow-indigo-600/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Creating Profile...
                </>
              ) : (
                <>
                  <UserPlus size={16} /> Register
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-center text-sm">
            <span className="text-slate-600">Already registered? </span>
            <Link
              href="/login"
              className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-all"
            >
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
