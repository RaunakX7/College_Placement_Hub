"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ClipboardList,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-slate-500">Authenticating administrative session...</p>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Manage Jobs", href: "/admin/internships", icon: Briefcase },
    { name: "Manage Students", href: "/admin/students", icon: Users },
    { name: "Applications", href: "/admin/applications", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      {/* Mobile Header */}
      <header className="lg:hidden bg-slate-950 text-white p-4 flex justify-between items-center z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white">
            P
          </div>
          <span className="font-extrabold tracking-wide">PlaceHub Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 hover:bg-slate-900 rounded-lg text-slate-300 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 bg-slate-950 text-slate-300 w-64 p-6 flex flex-col justify-between z-40 transform transition-transform duration-300 border-r border-slate-900 shadow-xl ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } lg:relative lg:translate-x-0`}
      >
        <div className="space-y-8">
          {/* Logo */}
          <div className="hidden lg:flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-md shadow-indigo-600/30">
              P
            </div>
            <span className="text-xl font-black text-white tracking-tight">PlaceHub <span className="text-[10px] bg-slate-800 text-indigo-400 font-bold px-2 py-0.5 rounded-full ml-1">Admin</span></span>
          </div>

          {/* Admin Info Badge */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck size={18} />
            </div>
            <div className="overflow-hidden">
              <p className="font-extrabold text-sm text-white truncate">Administrator</p>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase truncate">Root Controller</p>
            </div>
          </div>

          {/* Sidebar Menu Links */}
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
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-bold scale-[1.01]"
                      : "hover:bg-slate-900 hover:text-white"
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

        {/* Sign Out Area */}
        <div className="pt-6 border-t border-slate-900">
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

      {/* Content Container */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-8 lg:p-10">
        {children}
      </main>

      {/* Overlay backdrop for mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </div>
  );
}
