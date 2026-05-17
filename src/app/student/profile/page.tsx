"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Phone,
  MapPin,
  GraduationCap,
  FileText,
  Linkedin,
  Github,
  Award,
  BookOpen,
  CheckCircle,
  Loader2,
  AlertCircle,
  Calendar,
} from "lucide-react";

const profileSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  cgpa: z.string().refine((val) => {
    const parsed = parseFloat(val);
    return !isNaN(parsed) && parsed >= 0 && parsed <= 10;
  }, { message: "CGPA must be a valid number between 0.00 and 10.00" }),
  department: z.string().min(1, "Department is required"),
  graduationYear: z.string().min(4, "Enter valid year (e.g. 2026)"),
  resume: z.string().url("Must be a valid URL link to your Google Drive/Dropbox resume").or(z.string().min(1, "Resume URL/Path is required")),
  linkedinUrl: z.string().url("Must be a valid URL").or(z.string().optional().nullable().or(z.literal(""))),
  githubUrl: z.string().url("Must be a valid URL").or(z.string().optional().nullable().or(z.literal(""))),
  skills: z.string().min(1, "Please list at least a few skills"),
  bio: z.string().min(10, "Bio should be at least 10 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function StudentProfile() {
  const { user, refreshUser } = useAuth();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        phone: user.phone || "",
        location: user.location || "",
        cgpa: user.cgpa ? user.cgpa.toString() : "",
        department: user.department || "",
        graduationYear: user.graduationYear || "",
        resume: user.resume || "",
        linkedinUrl: user.linkedinUrl || "",
        githubUrl: user.githubUrl || "",
        skills: user.skills || "",
        bio: user.bio || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        await refreshUser(); // Re-sync global auth user context
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(data.error || "Failed to update profile details.");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit Profile</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">
          Maintain accurate metrics, contact points, resume access, and professional social handles.
        </p>
      </div>

      {success && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700 flex items-center gap-3 animate-fade-in">
          <CheckCircle className="shrink-0" size={16} />
          <span className="font-bold">Profile credentials and metrics synchronized successfully!</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 flex items-center gap-3 animate-shake">
          <AlertCircle className="shrink-0" size={16} />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Phone size={14} className="text-slate-400" /> Phone Number
              </label>
              <input
                type="text"
                {...register("phone")}
                placeholder="+1 555-0199"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.phone ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                }`}
              />
              {errors.phone && <p className="text-xs text-rose-600 font-semibold">{errors.phone.message}</p>}
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <MapPin size={14} className="text-slate-400" /> Location
              </label>
              <input
                type="text"
                {...register("location")}
                placeholder="New York, NY"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.location ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                }`}
              />
              {errors.location && <p className="text-xs text-rose-600 font-semibold">{errors.location.message}</p>}
            </div>

            {/* CGPA */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <GraduationCap size={14} className="text-slate-400" /> Current CGPA
              </label>
              <input
                type="text"
                {...register("cgpa")}
                placeholder="8.75"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.cgpa ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                }`}
              />
              {errors.cgpa && <p className="text-xs text-rose-600 font-semibold">{errors.cgpa.message}</p>}
            </div>

            {/* Department */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <BookOpen size={14} className="text-slate-400" /> Academic Department
              </label>
              <input
                type="text"
                {...register("department")}
                placeholder="Computer Science & Engineering"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.department ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                }`}
              />
              {errors.department && <p className="text-xs text-rose-600 font-semibold">{errors.department.message}</p>}
            </div>

            {/* Graduation Year */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-400" /> Graduation Year
              </label>
              <input
                type="text"
                {...register("graduationYear")}
                placeholder="2026"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.graduationYear ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                }`}
              />
              {errors.graduationYear && <p className="text-xs text-rose-600 font-semibold">{errors.graduationYear.message}</p>}
            </div>

            {/* Resume Link */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <FileText size={14} className="text-slate-400" /> Resume Drive URL
              </label>
              <input
                type="text"
                {...register("resume")}
                placeholder="https://drive.google.com/file/d/..."
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.resume ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                }`}
              />
              {errors.resume && <p className="text-xs text-rose-600 font-semibold">{errors.resume.message}</p>}
            </div>

            {/* LinkedIn URL */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Linkedin size={14} className="text-slate-400" /> LinkedIn Profile Link
              </label>
              <input
                type="text"
                {...register("linkedinUrl")}
                placeholder="https://linkedin.com/in/username"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.linkedinUrl ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                }`}
              />
              {errors.linkedinUrl && <p className="text-xs text-rose-600 font-semibold">{errors.linkedinUrl.message}</p>}
            </div>

            {/* GitHub URL */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Github size={14} className="text-slate-400" /> GitHub Profile Link
              </label>
              <input
                type="text"
                {...register("githubUrl")}
                placeholder="https://github.com/username"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.githubUrl ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                }`}
              />
              {errors.githubUrl && <p className="text-xs text-rose-600 font-semibold">{errors.githubUrl.message}</p>}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <Award size={14} className="text-slate-400" /> Professional Skills
            </label>
            <input
              type="text"
              {...register("skills")}
              placeholder="React, Next.js, TypeScript, PostgreSQL, Node.js, Python"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.skills ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
              }`}
            />
            {errors.skills && <p className="text-xs text-rose-600 font-semibold">{errors.skills.message}</p>}
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <User size={14} className="text-slate-400" /> Professional Summary / Bio
            </label>
            <textarea
              {...register("bio")}
              rows={4}
              placeholder="Full stack engineer passionate about scaling web infrastructure and cloud technologies..."
              className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.bio ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
              }`}
            />
            {errors.bio && <p className="text-xs text-rose-600 font-semibold">{errors.bio.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Synchronizing...
              </>
            ) : (
              "Save Profile Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
