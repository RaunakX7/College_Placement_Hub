"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  ClipboardList,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  Building2,
  Clock,
  User,
} from "lucide-react";

interface Metric {
  totalStudents: number;
  totalJobs: number;
  totalApplications: number;
  placedStudents: number;
}

interface Application {
  id: number;
  status: string;
  student: {
    name: string;
    email: string;
    rollNumber: string;
  };
  internship: {
    companyName: string;
    title: string;
    type: string;
  };
}

interface StatusBreakdown {
  status: string;
  count: number;
}

interface StatsData {
  metrics: Metric;
  statusBreakdown: StatusBreakdown[];
  recentApplications: Application[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          setStats(await res.json());
        }
      } catch (error) {
        console.error("Error loading admin stats:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-2xl w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-3xl"></div>
          ))}
        </div>
        <div className="h-80 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  const { metrics, statusBreakdown, recentApplications } = stats;

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Oversee campus placement metrics, jobs listings, and student selection rounds.
          </p>
        </div>

        <Link
          href="/admin/internships"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] self-start sm:self-center"
        >
          <PlusCircle size={16} /> Create Job Post
        </Link>
      </div>

      {/* Metrics Card Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Students</span>
            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900">{metrics.totalStudents}</h3>
            <p className="text-xs text-slate-400 mt-1">Enrolled on portal</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Opportunities</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Briefcase size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900">{metrics.totalJobs}</h3>
            <p className="text-xs text-slate-400 mt-1">Drives posted</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Applications</span>
            <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <ClipboardList size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900">{metrics.totalApplications}</h3>
            <p className="text-xs text-slate-400 mt-1">Student submissions</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Placed Students</span>
            <div className="h-8 w-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900">{metrics.placedStudents}</h3>
            <p className="text-xs text-slate-400 mt-1">Status set to Selected</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Applications Table */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-50">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Applications</h3>
              <p className="text-xs text-slate-400 mt-0.5">Chronological student job application logs.</p>
            </div>
            <Link
              href="/admin/applications"
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              Manage All <ArrowRight size={14} />
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Candidate</th>
                    <th className="pb-3">Opportunity</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="group">
                      <td className="py-3.5 pr-3">
                        <p className="font-bold text-slate-900">{app.student.name}</p>
                        <p className="text-xs text-slate-400 font-semibold">{app.student.rollNumber}</p>
                      </td>
                      <td className="py-3.5 pr-3">
                        <p className="font-bold text-slate-800 line-clamp-1">{app.internship.title}</p>
                        <p className="text-xs text-slate-500 font-semibold">{app.internship.companyName}</p>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">No applications recorded in this cycle.</div>
          )}
        </div>

        {/* Status breakdown charts card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Application Funnel</h3>
            <p className="text-xs text-slate-400 mt-0.5">Submissions distribution by workflow state.</p>
          </div>

          <div className="space-y-4">
            {statusBreakdown.length > 0 ? (
              statusBreakdown.map((item) => {
                const percentage =
                  metrics.totalApplications > 0
                    ? Math.round((item.count / metrics.totalApplications) * 100)
                    : 0;
                return (
                  <div key={item.status} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-600">{item.status}</span>
                      <span className="text-slate-400">
                        {item.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.status === "Selected"
                            ? "bg-emerald-500"
                            : item.status === "Rejected"
                            ? "bg-rose-500"
                            : item.status === "Interview"
                            ? "bg-purple-500"
                            : item.status === "Shortlisted"
                            ? "bg-indigo-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">No status analytics available yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
