"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  FolderHeart,
  User,
  LogOut,
  ChevronRight,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-slate-500">Securing your student session...</p>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { name: "Job Board", href: "/student/job-board", icon: Briefcase },
    { name: "My Applications", href: "/student/applications", icon: ClipboardList },
    { name: "Bookmarks", href: "/student/saved-jobs", icon: FolderHeart },
    { name: "My Profile", href: "/student/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Mobile Topbar */}
      <header className="lg:hidden bg-slate-900 text-white p-4 flex justify-between items-center z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white">
            P
          </div>
          <span className="font-extrabold tracking-wide">PlaceHub</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Navigation Sidebar (Desktop & Mobile Panel) */}
      <aside
        className={`fixed inset-y-0 left-0 bg-slate-900 text-slate-300 w-64 p-6 flex flex-col justify-between z-40 transform transition-transform duration-300 border-r border-slate-800/50 shadow-xl ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } lg:relative lg:translate-x-0`}
      >
        <div className="space-y-8">
          {/* Logo */}
          <div className="hidden lg:flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-md shadow-indigo-600/30">
              P
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">PlaceHub</span>
          </div>

          {/* User profile brief card */}
          <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-white truncate">{user.name}</p>
              <p className="text-xs text-indigo-400 font-semibold truncate">{user.emailOrUsername}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 font-bold scale-[1.01]"
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? "text-white" : "text-slate-400 group-hover:text-white transition-colors"} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-indigo-200" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="pt-6 border-t border-slate-800/80">
          <button
            onClick={() => {
              logout();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 text-slate-400"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Page Content Panel */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-8 lg:p-10 pt-8">
        {children}
      </main>

      {/* Overlay for mobile drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </div>
  );
}
