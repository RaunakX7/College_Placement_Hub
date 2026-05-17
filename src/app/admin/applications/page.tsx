"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  Building2,
  User,
  GraduationCap,
  FileText,
  Clock,
  Plus,
  Trash2,
  X,
  ExternalLink,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Edit2,
  Calendar,
} from "lucide-react";

interface Student {
  id: number;
  name: string;
  email: string;
  rollNumber: string;
  department?: string | null;
  cgpa?: number | null;
  resume?: string | null;
}

interface Internship {
  id: number;
  companyName: string;
  title: string;
  type: string;
}

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
  student: Student;
  internship: Internship;
}

export default function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Sidebar state for interview rounds
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [rounds, setRounds] = useState<InterviewRound[]>([]);
  const [roundsLoading, setRoundsLoading] = useState(false);

  // Form states for creating a new round
  const [roundNumber, setRoundNumber] = useState(1);
  const [roundTitle, setRoundTitle] = useState("");
  const [roundStatus, setRoundStatus] = useState("Scheduled");
  const [scheduledAt, setScheduledAt] = useState("");
  const [remarks, setRemarks] = useState("");
  const [roundSubmitting, setRoundSubmitting] = useState(false);

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchApplications = async () => {
    try {
      const res = await fetch(`/api/applications?status=${statusFilter}`);
      if (res.ok) {
        setApplications(await res.json());
      }
    } catch (err) {
      console.error("Error fetching admin applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleUpdateStatus = async (appId: number, newStatus: string) => {
    setMessage(null);
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setMessage({ text: "Application status updated successfully.", type: "success" });
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
        );
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Failed to update status", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "An error occurred while updating status.", type: "error" });
    }
  };

  const handleOpenRounds = async (app: Application) => {
    setSelectedApp(app);
    setRoundsLoading(true);
    setRounds([]);
    
    // Reset round fields
    setRoundNumber(1);
    setRoundTitle("");
    setRoundStatus("Scheduled");
    setScheduledAt("");
    setRemarks("");

    try {
      const res = await fetch(`/api/applications/${app.id}/rounds`);
      if (res.ok) {
        const data = await res.json();
        setRounds(data);
        // Pre-fill next round number
        if (data.length > 0) {
          const maxRound = Math.max(...data.map((r: any) => r.roundNumber));
          setRoundNumber(maxRound + 1);
        }
      }
    } catch (error) {
      console.error("Error fetching rounds:", error);
    } finally {
      setRoundsLoading(false);
    }
  };

  const handleSaveRound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    if (!roundTitle.trim()) {
      alert("Round title is required.");
      return;
    }

    setRoundSubmitting(true);
    try {
      const res = await fetch(`/api/applications/${selectedApp.id}/rounds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roundNumber,
          roundTitle,
          roundStatus,
          scheduledAt: scheduledAt || null,
          remarks: remarks || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Refetch rounds list
        const roundsRes = await fetch(`/api/applications/${selectedApp.id}/rounds`);
        if (roundsRes.ok) {
          const freshRounds = await roundsRes.json();
          setRounds(freshRounds);
          const maxRound = Math.max(...freshRounds.map((r: any) => r.roundNumber));
          setRoundNumber(maxRound + 1);
        }

        // Reset inputs
        setRoundTitle("");
        setScheduledAt("");
        setRemarks("");

        // Trigger master list refresh to update application status backing behind sidebar
        await fetchApplications();
        setMessage({ text: "Interview round saved. Application status synchronized successfully.", type: "success" });
      } else {
        alert(data.error || "Failed to save interview round.");
      }
    } catch (error) {
      console.error("Error saving round:", error);
    } finally {
      setRoundSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Applications Manager</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">
          Review candidate eligibility, alter statuses, and timeline selection round details.
        </p>
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
          <CheckCircle className="shrink-0 mt-0.5" size={16} />
          <div className="flex-1 font-semibold">{message.text}</div>
          <button onClick={() => setMessage(null)} className="hover:opacity-75">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filters bar */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Filter By Status:</span>
        <div className="p-1 bg-slate-100 rounded-2xl flex gap-1 flex-wrap justify-center">
          {[
            { value: "all", label: "All Candidates" },
            { value: "Pending", label: "Pending" },
            { value: "Interview", label: "Interviewing" },
            { value: "Shortlisted", label: "Shortlisted" },
            { value: "Selected", label: "Selected" },
            { value: "Rejected", label: "Rejected" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setStatusFilter(item.value)}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all duration-200 ${
                statusFilter === item.value
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Master applications table */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-12 bg-slate-200 rounded-2xl w-full"></div>
          <div className="h-48 bg-slate-200 rounded-3xl w-full"></div>
        </div>
      ) : applications.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-5">Student / Roll No</th>
                  <th className="p-5">Department & CGPA</th>
                  <th className="p-5">Job Details</th>
                  <th className="p-5">Resume</th>
                  <th className="p-5">Status Controller</th>
                  <th className="p-5 text-right">Rounds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/30 transition-all group">
                    <td className="p-5">
                      <div>
                        <p className="font-extrabold text-slate-900">{app.student.name}</p>
                        <p className="text-xs text-slate-400 font-semibold">{app.student.rollNumber}</p>
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="font-semibold text-slate-600">{app.student.department || "General"}</p>
                      {app.student.cgpa !== undefined && app.student.cgpa !== null ? (
                        <p className="text-xs font-extrabold text-indigo-600 mt-0.5">
                          CGPA: {app.student.cgpa.toFixed(2)}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 italic">CGPA not set</p>
                      )}
                    </td>
                    <td className="p-5">
                      <p className="font-extrabold text-slate-800 line-clamp-1">{app.internship.title}</p>
                      <p className="text-xs text-slate-500 font-semibold">{app.internship.companyName}</p>
                    </td>
                    <td className="p-5">
                      {app.student.resume ? (
                        <a
                          href={app.student.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          Portfolio <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No resume</span>
                      )}
                    </td>
                    <td className="p-5">
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                        className={`text-xs font-bold border rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                          app.status === "Selected"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : app.status === "Rejected"
                            ? "bg-rose-50 border-rose-200 text-rose-700"
                            : app.status === "Shortlisted"
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                            : app.status === "Interview"
                            ? "bg-purple-50 border-purple-200 text-purple-700"
                            : "bg-amber-50 border-amber-200 text-amber-700"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Interview">Interview</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => handleOpenRounds(app)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 inline-flex"
                      >
                        Timeline <ChevronRight size={14} />
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
          <ClipboardList className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">No applications found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1">
            Student submissions will display here once they apply to posted drives.
          </p>
        </div>
      )}

      {/* Slide-out Interview rounds manager sidebar panel */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedApp(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          />

          {/* Sidebar Drawer container */}
          <div className="relative bg-white w-full max-w-2xl h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-slide-in">
            <div className="space-y-6">
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                      Interview Rounds: {selectedApp.student.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-500">
                      {selectedApp.internship.title} at {selectedApp.internship.companyName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="h-8 w-8 rounded-full border hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Save/Add Round Inline Form */}
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Add or Edit Stage</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Use this to log student progression rounds.</p>
                  </div>

                  <form onSubmit={handleSaveRound} className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block font-bold text-slate-600 uppercase">Round No</label>
                        <input
                          type="number"
                          min="1"
                          value={roundNumber}
                          onChange={(e) => setRoundNumber(parseInt(e.target.value))}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-bold text-slate-600 uppercase">Round Status</label>
                        <select
                          value={roundStatus}
                          onChange={(e) => setRoundStatus(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white font-bold"
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Completed">Completed</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block font-bold text-slate-600 uppercase">Round Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Round 1 Technical Interview"
                        value={roundTitle}
                        onChange={(e) => setRoundTitle(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-bold text-slate-600 uppercase">Scheduled At</label>
                      <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-bold text-slate-600 uppercase">Interviewer Remarks</label>
                      <textarea
                        rows={3}
                        placeholder="Excellent programming skills, selected for round 2."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={roundSubmitting}
                      className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      {roundSubmitting ? (
                        <>
                          <Loader2 size={12} className="animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Plus size={14} /> Save Round
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Visual Rounds Timeline list */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Recorded Selection Timeline</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Active progress visible to candidate.</p>
                  </div>

                  {roundsLoading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="animate-spin text-indigo-500" size={24} />
                    </div>
                  ) : rounds.length > 0 ? (
                    <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
                      {rounds.map((round) => (
                        <div
                          key={round.id}
                          className="rounded-2xl border border-slate-100 p-4 bg-slate-50/20 text-xs shadow-sm flex flex-col justify-between"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className="font-extrabold text-slate-900">
                                Rd {round.roundNumber} : {round.roundTitle}
                              </p>
                              {round.scheduledAt && (
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
                                  <Calendar size={10} />
                                  {new Date(round.scheduledAt).toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                  })}
                                </p>
                              )}
                            </div>
                            <span
                              className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full border ${
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
                          {round.remarks && (
                            <p className="mt-2.5 bg-white border border-slate-100/50 p-2.5 rounded-xl text-slate-600 leading-relaxed">
                              {round.remarks}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6 text-center text-xs text-slate-500">
                      No interview rounds added yet. Student is currently in the initial Pending review stage.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedApp(null)}
                className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
