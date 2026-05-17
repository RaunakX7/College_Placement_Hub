"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  FileText,
  ClipboardList,
  CheckCircle,
  XCircle,
  Bookmark,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Building2,
} from "lucide-react";

interface Application {
  id: number;
  status: string;
  internship: {
    id: number;
    companyName: string;
    title: string;
    type: string;
  };
}

interface Internship {
  id: number;
  companyName: string;
  title: string;
  type: string;
  location: string;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [matchingJobs, setMatchingJobs] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [appsRes, savedRes, jobsRes] = await Promise.all([
          fetch("/api/applications"),
          fetch("/api/student/saved-jobs"),
          fetch("/api/internships?type=all"),
        ]);

        if (appsRes.ok) setApplications(await appsRes.json());
        if (savedRes.ok) setSavedJobs(await savedRes.json());
        if (jobsRes.ok) {
          const allJobs = await jobsRes.json();
          setMatchingJobs(allJobs.slice(0, 3)); // show top 3 recommendations
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-slate-200 rounded-2xl w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-3xl"></div>
          ))}
        </div>
        <div className="h-64 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  // Aggregate stats
  const totalApps = applications.length;
  const pendingApps = applications.filter((a) => a.status === "Pending" || a.status === "Admin Review").length;
  const selectedApps = applications.filter((a) => a.status === "Selected").length;
  const rejectedApps = applications.filter((a) => a.status === "Rejected").length;
  const savedCount = savedJobs.length;

  const isProfileIncomplete = !user?.cgpa || !user?.resume || !user?.phone;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">
          Track your placement performance and apply to upcoming selection drives.
        </p>
      </div>

      {/* Alert Callout for Profile Completion */}
      {isProfileIncomplete && (
        <div className="rounded-3xl border border-amber-100 bg-amber-50/50 p-6 flex flex-col sm:flex-row items-start gap-4">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-100">
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-amber-800">Complete Your Placement Profile</h4>
            <p className="text-sm text-amber-700 leading-relaxed">
              Your profile is missing crucial details like your CGPA, resume URL/path, or phone number. Corporate recruiters review these metrics for initial shortlist eligibility.
            </p>
            <div className="pt-2">
              <Link
                href="/student/profile"
                className="text-xs font-bold text-amber-800 bg-amber-500/10 border border-amber-200/50 hover:bg-amber-500/20 py-1.5 px-3.5 rounded-lg transition-all"
              >
                Complete Profile →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Numerical Metric Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Applications</span>
            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <ClipboardList size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900">{totalApps}</h3>
            <p className="text-xs text-slate-400 mt-1">Submitted in total</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Review</span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900">{pendingApps}</h3>
            <p className="text-xs text-slate-400 mt-1">Awaiting status change</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected / Placed</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900">{selectedApps}</h3>
            <p className="text-xs text-slate-400 mt-1">Offers received</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Bookmarked</span>
            <div className="h-8 w-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <Bookmark size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900">{savedCount}</h3>
            <p className="text-xs text-slate-400 mt-1">Saved opportunities</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Active Applications Timeline Panel */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-50">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Active Applications</h3>
              <p className="text-xs text-slate-400 mt-0.5">Your progress in ongoing recruitment rounds.</p>
            </div>
            <Link
              href="/student/applications"
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              See All <ArrowRight size={14} />
            </Link>
          </div>

          {applications.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {applications.slice(0, 4).map((app) => (
                <div key={app.id} className="py-4 flex justify-between items-center gap-4 first:pt-0 last:pb-0">
                  <div className="overflow-hidden">
                    <p className="font-bold text-slate-950 text-sm truncate">{app.internship.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{app.internship.companyName}</p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full border ${
                      app.status === "Selected"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : app.status === "Rejected"
                        ? "bg-rose-50 text-rose-700 border-rose-100"
                        : app.status === "Shortlisted"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                        : app.status === "Interview"
                        ? "bg-purple-50 text-purple-700 border-purple-100"
                        : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <ClipboardList className="mx-auto text-slate-300 mb-2" size={36} />
              <p className="text-sm text-slate-500">You haven&apos;t applied to any drives yet.</p>
              <Link
                href="/student/job-board"
                className="mt-3 inline-block text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-1.5 px-4 rounded-xl transition-all"
              >
                Browse Job Board
              </Link>
            </div>
          )}
        </div>

        {/* Recommended Job Leads Panel */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">New Matches</h3>
            <p className="text-xs text-slate-400 mt-0.5">Based on latest campus uploads.</p>
          </div>

          {matchingJobs.length > 0 ? (
            <div className="space-y-4">
              {matchingJobs.map((job) => (
                <Link
                  key={job.id}
                  href="/student/job-board"
                  className="block p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm line-clamp-1">
                      {job.title}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        job.type === "Placement"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                      }`}
                    >
                      {job.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Building2 size={12} /> {job.companyName}
                  </p>
                  {job.location && (
                    <p className="text-[11px] text-slate-400 mt-1">📍 {job.location}</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-slate-400 text-sm">
              No recommended openings available right now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
