"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  Info,
} from "lucide-react";

interface InterviewRound {
  id: number;
  roundNumber: number;
  roundTitle: string;
  roundStatus: string;
  scheduledAt?: string | null;
  remarks?: string | null;
}

interface Application {
  id: number;
  status: string;
  createdAt: string;
  internship: {
    id: number;
    companyName: string;
    title: string;
    type: string;
    location?: string | null;
  };
  rounds: InterviewRound[];
}

export default function StudentApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAppId, setExpandedAppId] = useState<number | null>(null);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/applications");
      if (res.ok) {
        setApplications(await res.json());
      }
    } catch (error) {
      console.error("Error loading student applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedAppId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-2xl w-1/4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Applications</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">
          Track recruitment progression, timeline milestones, and round remarks.
        </p>
      </div>

      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => {
            const isExpanded = expandedAppId === app.id;
            const hasRounds = app.rounds && app.rounds.length > 0;

            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Application Header Card */}
                <div
                  onClick={() => toggleExpand(app.id)}
                  className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 leading-tight">{app.internship.title}</h3>
                      <p className="text-sm font-semibold text-slate-500 mt-0.5">{app.internship.companyName}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> Applied: {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                        {app.internship.location && (
                          <span>📍 {app.internship.location}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-full border ${
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
                    <button className="h-9 w-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Timeline Panel */}
                {isExpanded && (
                  <div className="border-t border-slate-50 bg-slate-50/20 p-6 sm:p-8 space-y-6">
                    <div>
                      <h4 className="font-extrabold text-slate-950 text-sm">Recruitment Progress</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Track live round updates scheduled by the administrator.
                      </p>
                    </div>

                    {hasRounds ? (
                      <div className="relative border-l-2 border-indigo-100 pl-6 ml-3 space-y-6">
                        {app.rounds.map((round) => (
                          <div key={round.id} className="relative">
                            {/* Dot indicator */}
                            <div
                              className={`absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 bg-white ${
                                round.roundStatus === "Selected"
                                  ? "border-emerald-500 bg-emerald-50"
                                  : round.roundStatus === "Rejected"
                                  ? "border-rose-500 bg-rose-50"
                                  : round.roundStatus === "Completed"
                                  ? "border-indigo-500 bg-indigo-50"
                                  : "border-amber-500 bg-amber-50"
                              }`}
                            />

                            <div>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <h5 className="font-bold text-slate-900 text-sm">
                                  Round {round.roundNumber} : {round.roundTitle}
                                </h5>
                                <span
                                  className={`self-start sm:self-center text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                                    round.roundStatus === "Selected"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                      : round.roundStatus === "Rejected"
                                      ? "bg-rose-50 text-rose-700 border-rose-100"
                                      : round.roundStatus === "Completed"
                                      ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                                      : "bg-amber-50 text-amber-700 border-amber-100"
                                  }`}
                                >
                                  {round.roundStatus}
                                </span>
                              </div>

                              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 font-semibold">
                                <Clock size={12} />
                                {round.scheduledAt
                                  ? new Date(round.scheduledAt).toLocaleString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "Not scheduled yet"}
                              </p>

                              {round.remarks && (
                                <div className="mt-2.5 rounded-2xl bg-white border border-slate-100/50 p-3.5 text-xs text-slate-600 leading-relaxed shadow-sm">
                                  <span className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                                    <Info size={12} className="text-indigo-500" /> Interviewer Remarks
                                  </span>
                                  {round.remarks}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6 text-center text-sm text-slate-500">
                        No interview stages have been scheduled yet. Your profile is currently under initial review.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 text-center py-20">
          <ClipboardList className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">You haven&apos;t applied to any drives</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1">
            Browse the active job board and submit your profile for available internships and placements.
          </p>
        </div>
      )}
    </div>
  );
}
