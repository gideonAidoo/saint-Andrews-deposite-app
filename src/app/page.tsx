
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

import AuthGuard from "@/components/AuthGuard";
import DashboardOverview from "@/components/DashboardOverview";
import NewDepositForm from "@/components/NewDepositForm";

import {
  LayoutDashboard,
  Wallet,
  Users,
  Search,
  FileText,
  Settings,
  LogOut,
  Bell,
  Plus,
  Menu,
  X,
  Landmark,
  ChevronRight,
  CalendarDays,
  CircleCheck,
  ReceiptText,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "New Deposit", icon: Wallet },
  { label: "Search Customer", icon: Search },
  { label: "Daily Summary", icon: ReceiptText },
  { label: "Reports", icon: FileText },
  { label: "Settings", icon: Settings },
];

export default function DashboardPage() {
  const router = useRouter();

  const [activePage, setActivePage] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());

    setToday(formattedDate);
  }, []);

  function selectPage(page: string) {
    setActivePage(page);
    setMobileMenuOpen(false);
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {/* Mobile navigation overlay */}
        {mobileMenuOpen && (
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#102D52] text-white transition-transform duration-200 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#102D52]">
              <Landmark size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-wide">SACU</h1>
              <p className="text-[10px] tracking-widest text-blue-200">
                DEPOSIT MANAGEMENT
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="ml-auto rounded-lg p-2 hover:bg-white/10 lg:hidden"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-4 pt-7">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-blue-300">
              Main Menu
            </p>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.label;

                return (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => selectPage(item.label)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-[#102D52] shadow-sm"
                        : "text-blue-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={19} />
                    <span>{item.label}</span>

                    {isActive && (
                      <ChevronRight size={16} className="ml-auto" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <CircleCheck size={18} className="text-emerald-300" />
                <span className="text-sm font-semibold">
                  System Overview
                </span>
              </div>

              <p className="text-xs leading-5 text-blue-200">
                Access customer deposit records and review transaction
                activity through the dashboard.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-blue-100 hover:bg-white/10"
            >
              <LogOut size={19} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main application area */}
        <div className="min-h-screen lg:pl-64">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              <div>
                <h2 className="text-lg font-bold sm:text-xl">
                  {activePage}
                </h2>

                <p className="hidden text-xs text-slate-500 sm:block">
                  Saint Andrews Cooperative Credit Union
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <div className="hidden items-center gap-2 text-sm text-slate-500 md:flex">
                <CalendarDays size={17} />
                <span>{today || "Loading date..."}</span>
              </div>

              <button
                type="button"
                aria-label="Notifications"
                className="relative rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50"
              >
                <Bell size={19} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-[#102D52]">
                SA
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="mx-auto max-w-7xl space-y-7 p-4 sm:p-8">
            {/* Welcome section */}
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="mb-1 text-sm font-medium text-blue-700">
                  Financial operations
                </p>

                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Welcome to SACU
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Manage customer deposits and review daily activity.
                </p>
              </div>

              <button
                type="button"
                onClick={() => selectPage("New Deposit")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#174A83] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102D52]"
              >
                <Plus size={19} />
                Record New Deposit
              </button>
            </section>

            {/* Only one page-content conditional */}
            {activePage === "Dashboard" ? (
              <DashboardOverview />
            ) : activePage === "New Deposit" ? (
              <NewDepositForm />
            ) : (
              <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mx-auto flex max-w-lg flex-col items-center py-10 text-center">
                  <h3 className="text-xl font-bold text-slate-900">
                    {activePage}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    This section is planned for a future stage of the
                    SACU Deposit Management System.
                  </p>

                  <button
                    type="button"
                    onClick={() => selectPage("Dashboard")}
                    className="mt-6 rounded-xl bg-[#174A83] px-5 py-3 text-sm font-semibold text-white hover:bg-[#102D52]"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </section>
            )}

            {/* Footer */}
            <footer className="border-t border-slate-200 py-5 text-center text-xs text-slate-500">
              SACU Deposit Management System · Development Preview
            </footer>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
