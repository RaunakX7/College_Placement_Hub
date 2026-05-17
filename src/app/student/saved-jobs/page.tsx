"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  FolderHeart,
  MapPin,
  Building2,
  Trash2,
  ArrowRight,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface SavedJob {
  id: number;
  internship: {
    id: number;
    companyName: string;
    title: string;
    type: string;
    location?: string | null;
    eligibility?: string | null;
  };
}

export default function SavedJobs() {
  const [savedList, setSavedList] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch("/api/student/saved-jobs");
      if (res.ok) {
        setSavedList(await res.json());
      }
    } catch (error) {
      console.error("Error loading saved jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleUnsave = async (internshipId: number, saveId: number) => {
    setRemovingId(saveId);
    try {
      const res = await fetch("/api/student/save-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internshipId }),
      });

      if (res.ok) {
        setSavedList((prev) => prev.filter((item) => item.id !== saveId));
      }
    } catch (error) {
      console.error("Error unsaving job:", error);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-2xl w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-44 bg-slate-200 rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Saved Jobs</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">
          Manage your bookmarked opportunities and apply when ready.
        </p>
      </div>

      {savedList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm sm:text-base truncate max-w-[180px] sm:max-w-xs">
                        {item.internship.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 truncate">{item.internship.companyName}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-3 py-1 rounded-full border shrink-0 ${
                      item.internship.type === "Placement"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-indigo-50 text-indigo-700 border-indigo-100"
                    }`}
                  >
                    {item.internship.type}
                  </span>
                </div>

                <div className="space-y-2 mt-4 text-xs sm:text-sm text-slate-500 border-t border-slate-50 pt-4">
                  {item.internship.location && (
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      <span>{item.internship.location}</span>
                    </p>
                  )}
                  {item.internship.eligibility && (
                    <p className="text-xs font-semibold text-slate-500 truncate">
                      🎓 Eligibility: {item.internship.eligibility}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center border-t border-slate-50 pt-4">
                <button
                  onClick={() => handleUnsave(item.internship.id, item.id)}
                  disabled={removingId === item.id}
                  className="text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 py-2 px-3 rounded-xl transition-all flex items-center gap-1"
                >
                  {removingId === item.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Unsave
                </button>

                <Link
                  href="/student/job-board"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center gap-1"
                >
                  Apply Drive <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 text-center py-20">
          <FolderHeart className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">Your bookmark folder is empty</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1">
            Browse corporate recruitment drives on the job board and bookmark opportunities to track them later.
          </p>
          <Link
            href="/student/job-board"
            className="mt-6 inline-block text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 px-5 rounded-xl transition-all"
          >
            Explore Job Board
          </Link>
        </div>
      )}
    </div>
  );
}
