"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Briefcase,
  Search,
  MapPin,
  Building2,
  Calendar,
  Bookmark,
  CheckCircle,
  X,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Loader2,
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
  isSaved?: boolean;
  isApplied?: boolean;
  applicationStatus?: string | null;
}

export default function JobBoard() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedJob, setSelectedJob] = useState<Internship | null>(null);
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchOpportunities = async () => {
    try {
      const typeFilter = selectedType !== "all" ? `&type=${selectedType}` : "";
      const res = await fetch(`/api/internships?search=${searchQuery}${typeFilter}`);
      if (res.ok) {
        setOpportunities(await res.json());
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOpportunities();
    }, 300); // Debounce search query
    return () => clearTimeout(timer);
  }, [searchQuery, selectedType]);

  const handleToggleSave = async (id: number) => {
    try {
      const res = await fetch("/api/student/save-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internshipId: id }),
      });

      if (res.ok) {
        const data = await res.json();
        setOpportunities((prev) =>
          prev.map((opp) => (opp.id === id ? { ...opp, isSaved: data.saved } : opp))
        );
        if (selectedJob && selectedJob.id === id) {
          setSelectedJob((prev) => prev ? { ...prev, isSaved: data.saved } : null);
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleApply = async (id: number) => {
    // Basic eligibility check - student must have a resume
    if (!user?.resume) {
      setMessage({
        text: "Please upload your resume URL in your Profile before applying to corporate drives.",
        type: "error",
      });
      return;
    }

    setApplyingId(id);
    setMessage(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internshipId: id }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: "Application submitted successfully! Track your rounds in My Applications.", type: "success" });
        setOpportunities((prev) =>
          prev.map((opp) =>
            opp.id === id ? { ...opp, isApplied: true, applicationStatus: "Pending" } : opp
          )
        );
        if (selectedJob && selectedJob.id === id) {
          setSelectedJob((prev) => prev ? { ...prev, isApplied: true, applicationStatus: "Pending" } : null);
        }
      } else {
        setMessage({ text: data.error || "Failed to submit application", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An unexpected network error occurred.", type: "error" });
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Job Board</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Explore corporate placements and internships available on campus.
          </p>
        </div>
      </div>

      {/* Message Banner */}
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

      {/* Filters & Search Row */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by job title, company, location, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Custom Segmented Type Toggles */}
        <div className="p-1 bg-slate-100 rounded-2xl flex gap-1 w-full md:w-auto">
          {[
            { value: "all", label: "All Drives" },
            { value: "Internship", label: "Internships" },
            { value: "Placement", label: "Placements" },
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`flex-1 md:flex-initial py-2 px-4 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                selectedType === type.value
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of opportunities */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-3xl"></div>
          ))}
        </div>
      ) : opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <Building2 size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {opp.title}
                      </h3>
                      <p className="text-sm font-semibold text-slate-500 truncate">{opp.companyName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleSave(opp.id)}
                      className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all ${
                        opp.isSaved
                          ? "bg-rose-50 border-rose-200 text-rose-500"
                          : "border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Bookmark size={16} fill={opp.isSaved ? "currentColor" : "none"} />
                    </button>
                    <span
                      className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                        opp.type === "Placement"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-indigo-50 text-indigo-700 border-indigo-100"
                      }`}
                    >
                      {opp.type}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mt-4 text-xs sm:text-sm text-slate-500 border-t border-slate-50 pt-4">
                  {opp.location && (
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      <span>{opp.location}</span>
                    </p>
                  )}
                  {opp.eligibility && (
                    <p className="flex items-center gap-2 font-semibold text-slate-600">
                      <FileText size={14} className="text-slate-400" />
                      <span className="truncate">Eligibility: {opp.eligibility}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center border-t border-slate-50 pt-4">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar size={12} />
                  {opp.lastDate
                    ? `DeadLine: ${new Date(opp.lastDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}`
                    : "No deadline"}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedJob(opp)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 bg-white py-2 px-3 rounded-xl transition-all"
                  >
                    Details
                  </button>

                  {opp.isApplied ? (
                    <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1 shadow-sm">
                      <CheckCircle size={14} /> Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(opp.id)}
                      disabled={applyingId === opp.id}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center gap-1.5"
                    >
                      {applyingId === opp.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 text-center py-20">
          <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">No active job listings found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1">
            Try adjusting your search query or filters. Drives are updated as corporate partners schedule placement dates.
          </p>
        </div>
      )}

      {/* Slide-out detail sidebar drawer */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedJob(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          />

          {/* Slide container */}
          <div className="relative bg-white w-full max-w-lg h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-slide-in">
            <div>
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{selectedJob.title}</h3>
                    <p className="text-sm text-slate-500 font-semibold">{selectedJob.companyName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="h-8 w-8 rounded-full border hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-6 mt-6">
                {/* Meta details cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Job Type</span>
                    <p className="font-bold text-slate-800 mt-0.5 text-sm">{selectedJob.type}</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Location</span>
                    <p className="font-bold text-slate-800 mt-0.5 text-sm truncate">
                      {selectedJob.location || "Remote / Anywhere"}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Eligibility Criteria</span>
                  <p className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl font-bold text-slate-700 text-sm leading-relaxed">
                    {selectedJob.eligibility || "No specific CGPA or branch filtering stated. Open to all students."}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Job Description</span>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
                    {selectedJob.description || "No full description uploaded yet. Contact the campus placement admin for complete drive details."}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex gap-4">
              <button
                onClick={() => handleToggleSave(selectedJob.id)}
                className={`flex-1 py-3 px-4 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  selectedJob.isSaved
                    ? "bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Bookmark size={16} fill={selectedJob.isSaved ? "currentColor" : "none"} />
                {selectedJob.isSaved ? "Saved" : "Save Job"}
              </button>

              {selectedJob.isApplied ? (
                <span className="flex-1 bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10">
                  <CheckCircle size={16} /> Applied
                </span>
              ) : (
                <button
                  onClick={() => handleApply(selectedJob.id)}
                  disabled={applyingId === selectedJob.id}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  {applyingId === selectedJob.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Apply to Drive"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
