import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Briefcase, MapPin, Building2, Bookmark, CheckCircle, GraduationCap } from "lucide-react";

export const revalidate = 0; // Fresh data on every load

export default async function LandingPage() {
  // Server-side database query via Prisma Client!
  let latestOpportunities: any[] = [];
  try {
    latestOpportunities = await prisma.internship.findMany({
      take: 4,
      orderBy: { id: "desc" },
    });
  } catch (error) {
    console.error("Failed to load initial internships in server component:", error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Premium Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-100 px-6 py-4 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-md shadow-indigo-600/30">
            P
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">PlaceHub</span>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            href="/about"
            className="text-slate-600 hover:text-indigo-600 text-sm font-bold transition-colors py-2 px-3 rounded-lg hover:bg-slate-100/50"
          >
            About Project
          </Link>
          <Link
            href="/login"
            className="text-slate-600 hover:text-indigo-600 text-sm font-bold transition-colors py-2 px-3 rounded-lg hover:bg-slate-100/50"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all duration-300 py-2 px-5 rounded-xl shadow-lg shadow-indigo-600/20 hover:scale-[1.02]"
          >
            Register
          </Link>
        </nav>
      </header>

      {/* Modern Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white py-24 sm:py-32 px-6 text-center">
        {/* Subtle grid mesh overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        
        <div className="relative max-w-4xl mx-auto space-y-6 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 backdrop-blur-sm">
            <GraduationCap size={14} /> Comprehensive College Placement Portal
          </span>
          <h2 className="text-4xl sm:text-6xl font-black leading-none tracking-tight">
            Find Your Dream <span className="bg-gradient-to-r from-indigo-400 via-indigo-200 to-indigo-400 bg-clip-text text-transparent">Internship & Job</span>
          </h2>
          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed">
            Apply to elite corporate opportunities, track multi-round hiring schedules, and take control of your recruitment milestones in one dashboard.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
            <Link
              href="/login"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-xl shadow-indigo-600/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight size={18} />
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-indigo-200 font-bold py-3.5 px-8 rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300"
            >
              Student Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Opportunities Section */}
      <section className="flex-1 max-w-7xl mx-auto w-full py-16 px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Active Selection Drives
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top corporate internships and job postings available on campus.
            </p>
          </div>
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center gap-1.5 group transition-all"
          >
            View Job Board <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {latestOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-500 font-bold group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <Building2 size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {opp.title}
                        </h3>
                        <p className="text-sm font-semibold text-slate-500 flex items-center gap-1">
                          {opp.companyName}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        opp.type === "Placement"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                      }`}
                    >
                      {opp.type}
                    </span>
                  </div>

                  <div className="space-y-2 mt-4 text-sm text-slate-500 border-t border-slate-50 pt-4">
                    {opp.location && (
                      <p className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400" />
                        <span>{opp.location}</span>
                      </p>
                    )}
                    {opp.eligibility && (
                      <p className="flex items-center gap-2">
                        <Bookmark size={14} className="text-slate-400" />
                        <span className="line-clamp-1">Eligible: {opp.eligibility}</span>
                      </p>
                    )}
                    {opp.description && (
                      <p className="text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                        {opp.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center border-t border-slate-50 pt-4">
                  <span className="text-xs text-slate-400">
                    {opp.lastDate
                      ? `Apply by: ${new Date(opp.lastDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}`
                      : "Open Application"}
                  </span>
                  <Link
                    href="/login"
                    className="bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white text-sm font-bold py-2 px-4 rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow-sm shadow-indigo-600/5"
                  >
                    Apply Now <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 text-center py-16 px-6">
            <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-slate-800">No active placement drives found</h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto mt-1">
              Check back soon! Drives are uploaded by the campus administrator as companies schedule recruitment sessions.
            </p>
          </div>
        )}
      </section>

      {/* Stats / Highlights Section */}
      <section className="bg-slate-900 text-white py-16 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <p className="text-4xl sm:text-5xl font-black text-indigo-400">100%</p>
            <p className="text-sm font-bold text-slate-300">Secure Database & ORM</p>
            <p className="text-xs text-slate-500">PostgreSQL architecture utilizing Prisma ORM to guarantee type safety.</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl sm:text-5xl font-black text-emerald-400">RBAC</p>
            <p className="text-sm font-bold text-slate-300">Role-Based Access Control</p>
            <p className="text-xs text-slate-500">Strict Student/Admin segmentation protected via secure JWT tokens.</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl sm:text-5xl font-black text-indigo-300">NextJS 16</p>
            <p className="text-sm font-bold text-slate-300">Strict TypeScript Engine</p>
            <p className="text-xs text-slate-500">Engineered with server-side caching, secure routing, and high-performance loads.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-center border-t border-slate-900 py-8 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 PlaceHub College Placement Portal | Senior Full-Stack Migration</p>
          <div className="flex gap-4 text-xs font-semibold">
            <Link href="/about" className="hover:text-indigo-400">About Project</Link>
            <span>•</span>
            <Link href="/login" className="hover:text-indigo-400">Admin Area</Link>
            <span>•</span>
            <Link href="/register" className="hover:text-indigo-400">Student Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
