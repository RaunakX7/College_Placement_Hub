"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  FileText,
  Plus,
  Trash2,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Internship {
  id: number;
  companyName: string;
  title: string;
  type: string;
  location?: string | null;
  eligibility?: string | null;
  description?: string | null;
  lastDate?: string | null;
}

const jobSchema = z.object({
  title: z.string().min(2, "Job title must be at least 2 characters"),
  companyName: z.string().min(2, "Company name is required"),
  type: z.enum(["Internship", "Placement"]),
  location: z.string().min(1, "Location is required"),
  eligibility: z.string().min(1, "Eligibility criteria is required"),
  description: z.string().min(10, "Description should be at least 10 characters"),
  lastDate: z.string().min(1, "Closing application date is required"),
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function AdminInternships() {
  const [jobs, setJobs] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      type: "Internship",
    },
  });

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/internships?type=all");
      if (res.ok) {
        setJobs(await res.json());
      }
    } catch (err) {
      console.error("Error loading jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (values: JobFormValues) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: "Placement/Internship posted successfully!", type: "success" });
        setIsModalOpen(false);
        reset();
        await fetchJobs();
      } else {
        setMessage({ text: data.error || "Failed to create posting.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "A network error occurred. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job posting? This will delete all student applications associated with it.")) {
      return;
    }

    try {
      const res = await fetch(`/api/internships/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage({ text: "Job posting deleted successfully.", type: "success" });
        await fetchJobs();
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Failed to delete posting.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred while deleting.", type: "error" });
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Jobs</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Configure placement and internship opportunities for students.
          </p>
        </div>

        <button
          onClick={() => {
            reset();
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] self-start sm:self-center"
        >
          <Plus size={16} /> Create Opportunity
        </button>
      </div>

      {/* Message callout */}
      {message && (
        <div
          className={`rounded-2xl border p-4 text-sm flex items-start gap-3 animate-fade-in ${
            message.type === "success"
              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border-rose-100 bg-rose-50 text-rose-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="shrink-0 mt-0.5" size={16} />
          ) : (
            <AlertCircle className="shrink-0 mt-0.5" size={16} />
          )}
          <div className="flex-1 font-semibold">{message.text}</div>
          <button onClick={() => setMessage(null)} className="hover:opacity-75">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Jobs Table Panel */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-12 bg-slate-200 rounded-2xl w-full"></div>
          <div className="h-48 bg-slate-200 rounded-3xl w-full"></div>
        </div>
      ) : jobs.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-5">Opportunity Details</th>
                  <th className="p-5">Location</th>
                  <th className="p-5">Eligibility</th>
                  <th className="p-5">Deadline</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/30 transition-all group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                          <Building2 size={18} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {job.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-semibold text-slate-500 truncate">{job.companyName}</span>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                job.type === "Placement"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                  : "bg-indigo-50 text-indigo-700 border-indigo-100"
                              }`}
                            >
                              {job.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 font-semibold text-slate-600">{job.location || "Remote"}</td>
                    <td className="p-5 font-semibold text-slate-600 max-w-xs truncate">
                      {job.eligibility || "Open to all"}
                    </td>
                    <td className="p-5 text-xs font-semibold text-slate-500">
                      {job.lastDate ? new Date(job.lastDate).toLocaleDateString() : "No deadline"}
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2.5 rounded-xl border border-slate-200 text-rose-500 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all inline-flex items-center justify-center"
                        title="Delete posting"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 text-center py-20">
          <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">No opportunities posted yet</h3>
          <p className="text-sm text-slate-400 max-w-xs mx-auto mt-1">
            Click Create Opportunity above to add internships or full-time placement drives.
          </p>
        </div>
      )}

      {/* Reactive Post Job Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Create Placement / Internship</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full border hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleCreateJob)} className="space-y-4 mt-6">
              {/* Job Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Opportunity Title</label>
                <input
                  type="text"
                  {...register("title")}
                  placeholder="e.g. Associate Software Engineer"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.title ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                  }`}
                />
                {errors.title && <p className="text-xs text-rose-600 font-semibold">{errors.title.message}</p>}
              </div>

              {/* Company Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Company Name</label>
                <input
                  type="text"
                  {...register("companyName")}
                  placeholder="e.g. Google LLC"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.companyName ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                  }`}
                />
                {errors.companyName && <p className="text-xs text-rose-600 font-semibold">{errors.companyName.message}</p>}
              </div>

              {/* Grid (Type & Location) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Position Type</label>
                  <select
                    {...register("type")}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Placement">Placement</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Location</label>
                  <input
                    type="text"
                    {...register("location")}
                    placeholder="e.g. San Jose, CA"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.location ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                    }`}
                  />
                  {errors.location && <p className="text-xs text-rose-600 font-semibold">{errors.location.message}</p>}
                </div>
              </div>

              {/* Eligibility */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Eligibility Criteria</label>
                <input
                  type="text"
                  {...register("eligibility")}
                  placeholder="e.g. CSE/IT/ECE branch, CGPA > 8.00"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.eligibility ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                  }`}
                />
                {errors.eligibility && <p className="text-xs text-rose-600 font-semibold">{errors.eligibility.message}</p>}
              </div>

              {/* Deadline */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Closing Date</label>
                <input
                  type="date"
                  {...register("lastDate")}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.lastDate ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                  }`}
                />
                {errors.lastDate && <p className="text-xs text-rose-600 font-semibold">{errors.lastDate.message}</p>}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Description</label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Provide brief outline of responsibilities, requirements, and package details..."
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.description ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                  }`}
                />
                {errors.description && <p className="text-xs text-rose-600 font-semibold">{errors.description.message}</p>}
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 text-slate-600 font-bold py-3 text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 text-sm rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Posting...
                    </>
                  ) : (
                    "Post Opportunity"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
