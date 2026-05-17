import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Users,
  Settings,
  ShieldCheck,
  Cpu,
  History,
  Sparkles,
  GraduationCap,
  Terminal,
  Database,
  Code2,
  HeartHandshake
} from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Rohitash Gar",
      role: "Project Developer",
      enrollment: "JNU-jpr-2023/00169",
      initials: "RG",
      color: "from-blue-500 to-indigo-600"
    },
    {
      name: "Raunak Kumar",
      role: "Project Developer & Team Lead",
      enrollment: "JNU-jpr-2023/01882",
      initials: "RK",
      color: "from-indigo-500 to-purple-600"
    },
    {
      name: "Rishabh Parashar",
      role: "Project Developer",
      enrollment: "JNU-jpr-2023/01934",
      initials: "RP",
      color: "from-pink-500 to-rose-600"
    }
  ];

  const objectives = [
    "Digitalize and centralize campus recruitment workflows, eliminating scattered manual paper trials.",
    "Deliver a robust multi-stage recruitment pipeline supporting real-time status updates.",
    "Implement granular Role-Based Access Control (RBAC) separating administrative controls and student views.",
    "Establish instant resume linking and academic record management via secure cloud paths.",
    "Provide a highly scalable architecture capable of supporting historical data filtering by academic year.",
    "Enable dynamic internship and placement categorization to suit various corporate structures."
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      {/* Decorative Blur Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-md shadow-indigo-600/30">
            P
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">PlaceHub</span>
        </div>

        <Link
          href="/"
          className="text-slate-600 hover:text-indigo-600 text-sm font-bold flex items-center gap-1.5 transition-colors py-2 px-3 rounded-lg hover:bg-slate-100/50"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto w-full px-6 py-12 flex-1 space-y-16">
        
        {/* Page Hero Title */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Sparkles size={12} className="animate-pulse" /> System Synopsis Report
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            College Placement & Internship Management System
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-sm sm:text-base leading-relaxed">
            A comprehensive final year project designed for the degree award of Bachelor of Computer Application (BCA).
          </p>
        </div>

        {/* Executive Summary & Abstract */}
        <section className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-50/50 rounded-full blur-2xl" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <BookOpen className="text-indigo-600" size={24} /> Executive Summary / Abstract
            </h2>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                The transition from academic life to professional industry is critically dependent on effective campus placement and internship programs. In many educational institutions, particularly in developing regions, the management of these activities remains a largely manual, fragmented, and inefficient process.
              </p>
              <p>
                Currently, training and placement cells frequently rely on a combination of spreadsheets, physical notice boards, email chains, and paper-based application forms. This traditional methodology introduces significant operational challenges, including data redundancy, susceptibility to clerical errors, lack of real-time transparency, and logistical burden.
              </p>
              <p>
                To address these critical shortcomings, this project proposes the development of a <strong>College Placement & Internship Management System</strong>—a robust web-based application designed to fully digitalize and automate the entire placement lifecycle. It serves as a unified corporate gateway connecting students, placement coordinators, and active selectors seamlessly.
              </p>
            </div>
          </div>
        </section>

        {/* Existing vs Proposed Architecture */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Legacy Challenges */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <History className="text-slate-400" size={20} /> The Legacy Bottlenecks
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>Notice-board notifications often get missed, leading to critical deadline slip-ups.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>Heavy reliance on offline spreadsheets leading to file fragmentation and duplicate entries.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>Lack of progress tracking where students are unaware of their multi-stage status.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>Clerical overhead of manually evaluating student cgpa eligibilities for specific roles.</span>
              </li>
            </ul>
          </div>

          {/* Modern Solution */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-indigo-950 flex items-center gap-2.5">
              <Sparkles className="text-indigo-600" size={20} /> The Proposed Modernization
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Centralized dashboard where new job and internship listings are updated in real-time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Instant single-click online application submissions with cloud-synced profile metrics.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Transparent live interview tracking for rounds (Scheduled, Shortlisted, Selected, Rejected).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Unified admin panels to easily filter students, list drives, and update results.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Project Objectives */}
        <section className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-sm space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Settings className="text-indigo-600" size={24} /> System Core Objectives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {objectives.map((obj, index) => (
              <div key={index} className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{obj}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack Showcase */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-slate-800 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold flex items-center gap-2.5">
              <Cpu className="text-indigo-400" size={24} /> Architectural Tech Stack
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Comparison between the original legacy requirements vs our newly engineered high-performance modern web architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Legacy Stack */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
              <h3 className="text-sm font-extrabold tracking-widest text-rose-400 uppercase flex items-center gap-2">
                <History size={16} /> Legacy PHP Stack
              </h3>
              <div className="space-y-3.5">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-sm">
                  <span className="text-slate-400 flex items-center gap-1.5"><Code2 size={14} /> Frontend UI</span>
                  <span className="font-semibold text-slate-300">HTML5, Vanilla CSS3, Javascript</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-sm">
                  <span className="text-slate-400 flex items-center gap-1.5"><Terminal size={14} /> Server Engine</span>
                  <span className="font-semibold text-slate-300">PHP Procedural Logic</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-sm">
                  <span className="text-slate-400 flex items-center gap-1.5"><Database size={14} /> Database Engine</span>
                  <span className="font-semibold text-slate-300">MySQL Server via XAMPP</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 flex items-center gap-1.5"><ShieldCheck size={14} /> Access Layer</span>
                  <span className="font-semibold text-slate-300">Session Cookie Files</span>
                </div>
              </div>
            </div>

            {/* Modern Stack */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-950 to-indigo-900 border border-indigo-500/20 p-6 shadow-indigo-950/50 shadow-2xl space-y-4">
              <h3 className="text-sm font-extrabold tracking-widest text-emerald-400 uppercase flex items-center gap-2">
                <Sparkles size={16} /> Modernized NextJS Stack
              </h3>
              <div className="space-y-3.5">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-sm">
                  <span className="text-indigo-300 flex items-center gap-1.5"><Code2 size={14} /> Frontend UI</span>
                  <span className="font-bold text-white">Next.js 14+ / React 19 (App Router)</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-sm">
                  <span className="text-indigo-300 flex items-center gap-1.5"><Terminal size={14} /> Server Engine</span>
                  <span className="font-bold text-white">TypeScript (Type-Safe APIs)</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-sm">
                  <span className="text-indigo-300 flex items-center gap-1.5"><Database size={14} /> Database Engine</span>
                  <span className="font-bold text-white">SQLite (dev.db) via Prisma ORM</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-indigo-300 flex items-center gap-1.5"><ShieldCheck size={14} /> Access Layer</span>
                  <span className="font-bold text-white">JWT Cookie + BCrypt Hashing</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Creator Information */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2.5">
              <Users className="text-indigo-600" size={24} /> Project Creator Information
            </h2>
            <p className="text-sm text-slate-500">
              Developed by the students of School of Computer and System Sciences, Jaipur National University.
            </p>
          </div>

          {/* Creators Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-all duration-300 group"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-indigo-600/10 group-hover:scale-[1.05] transition-transform duration-300`}>
                  {member.initials}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{member.name}</h4>
                  <p className="text-xs font-bold text-indigo-600">{member.role}</p>
                </div>
                <div className="w-full border-t border-slate-50 pt-3 text-xs text-slate-500 space-y-1">
                  <p className="font-mono">Enrollment No.</p>
                  <p className="font-bold text-slate-700 bg-slate-50 rounded-lg py-1">{member.enrollment}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Supervisors Card */}
          <div className="max-w-xl mx-auto bg-indigo-50/50 border border-indigo-100/80 rounded-3xl p-6 sm:p-8 text-center space-y-4">
            <div className="inline-flex h-12 w-12 rounded-xl bg-indigo-600 text-white items-center justify-center font-bold shadow-md shadow-indigo-600/25">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-xs font-extrabold text-indigo-700 tracking-wider uppercase">Project Mentor & Guide</p>
              <h4 className="text-lg font-black text-slate-900 mt-1">Ms. Diksha Verma</h4>
              <p className="text-sm font-semibold text-slate-500">Assistant Professor</p>
            </div>
            <div className="border-t border-indigo-100/50 pt-3 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-indigo-950">School of Computer and System Sciences</p>
              <p className="font-bold text-slate-500">JAIPUR NATIONAL UNIVERSITY, JAGATPURA, JAIPUR</p>
            </div>
          </div>
        </section>

        {/* Academic Certificate Signoff */}
        <section className="bg-white rounded-3xl border border-dashed border-slate-200 p-8 text-center max-w-2xl mx-auto space-y-4">
          <HeartHandshake className="text-indigo-500 mx-auto" size={32} />
          <h3 className="font-bold text-slate-900 text-lg">Academic Certificate & Approval</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            This project is verified and approved as a record of a bonafide piece of software development work, undertaken in partial fulfillment of the award of Bachelor of Computer Application (BCA), Jaipur National University during the academic session 2025-26.
          </p>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-center border-t border-slate-900 py-8 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 PlaceHub College Placement Portal | Senior Full-Stack Migration</p>
          <div className="flex gap-4 text-xs font-semibold">
            <Link href="/" className="hover:text-indigo-400">Home Page</Link>
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
