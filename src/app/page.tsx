
"use client";

import { useState } from "react";
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
  ArrowDownToLine,
  TrendingUp,
  Clock,
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

const sampleDeposits = [
  {
    name: "Ama Mensah",
    account: "•••• 4821",
    amount: 250,
    time: "09:15 AM",
    status: "Recorded",
  },
  {
    name: "Kwame Asare",
    account: "•••• 1936",
    amount: 100,
    time: "10:30 AM",
    status: "Recorded",
  },
  {
    name: "Abena Owusu",
    account: "•••• 7042",
    amount: 500,
    time: "11:05 AM",
    status: "Recorded",
  },
  {
    name: "Kofi Boateng",
    account: "•••• 6218",
    amount: 150,
    time: "12:20 PM",
    status: "Recorded",
  },
];

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(amount);

export default function DashboardPage() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const today = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const stats = [
    {
      title: "Today's Deposits",
      value: formatMoney(4850),
      note: "Total amount recorded",
      icon: Wallet,
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Transactions",
      value: "24",
      note: "Deposits recorded today",
      icon: ReceiptText,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Customers Served",
      value: "18",
      note: "Customers assisted today",
      icon: Users,
      color: "bg-violet-50 text-violet-700",
    },
    {
      title: "Pending Deposits",
      value: "0",
      note: "Awaiting confirmation",
      icon: Clock,
      color: "bg-amber-50 text-amber-700",
    },
  ];

  function selectPage(page: string) {
    setActivePage(page);
    setMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {mobileMenuOpen && (
        <button
          aria-label="Close navigation overlay"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

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
              const active = activePage === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => selectPage(item.label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-white text-[#102D52] shadow-sm"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                  {active && (
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
              <span className="text-sm font-semibold">System Overview</span>
            </div>
            <p className="text-xs leading-5 text-blue-200">
              Dashboard preview mode. Connect Firebase to load verified
              transaction records.
            </p>
          </div>

          <button
            onClick={() => selectPage("Logout")}
            className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-blue-100 hover:bg-white/10"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <h2 className="text-lg font-bold sm:text-xl">
                {activePage === "Logout"
                  ? "Logout"
                  : activePage}
              </h2>
              <p className="hidden text-xs text-slate-500 sm:block">
                Saint Andrews Cooperative Credit Union
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden items-center gap-2 text-sm text-slate-500 md:flex">
              <CalendarDays size={17} />
              <span>{today}</span>
            </div>

            <button
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

        <main className="mx-auto max-w-375 space-y-7 p-4 sm:p-8">
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
              onClick={() => selectPage("New Deposit")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#174A83] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102D52]"
            >
              <Plus size={19} />
              Record New Deposit
            </button>
          </section>

          {activePage === "Dashboard" ? (
            <>
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.title}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-500">
                            {stat.title}
                          </p>
                          <p className="mt-3 text-2xl font-bold tracking-tight">
                            {stat.value}
                          </p>
                        </div>

                        <div className={`rounded-xl p-3 ${stat.color}`}>
                          <Icon size={22} />
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-slate-500">
                        {stat.note}
                      </p>
                    </div>
                  );
                })}
              </section>

              <section className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h4 className="text-lg font-bold">
                        Recent Deposits
                      </h4>
                      <p className="mt-1 text-sm text-slate-500">
                        Latest transactions in this demo
                      </p>
                    </div>

                    <button
                      onClick={() => selectPage("Daily Summary")}
                      className="self-start text-sm font-semibold text-blue-700 hover:text-blue-900"
                    >
                      View daily summary →
                    </button>
                  </div>

                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-142.5 text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                          <th className="pb-3 pr-4 font-medium">Customer</th>
                          <th className="pb-3 pr-4 font-medium">Time</th>
                          <th className="pb-3 pr-4 font-medium">Amount</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleDeposits.map((deposit) => (
                          <tr
                            key={deposit.account}
                            className="border-b border-slate-100 last:border-0"
                          >
                            <td className="py-4 pr-4">
                              <div className="font-semibold text-slate-800">
                                {deposit.name}
                              </div>
                              <div className="mt-1 text-xs text-slate-500">
                                {deposit.account}
                              </div>
                            </td>
                            <td className="py-4 pr-4 text-slate-500">
                              {deposit.time}
                            </td>
                            <td className="py-4 pr-4 font-semibold">
                              {formatMoney(deposit.amount)}
                            </td>
                            <td className="py-4">
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                <CircleCheck size={13} />
                                {deposit.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="mt-4 text-xs text-amber-700">
                    Demo data only — no real transactions have been saved.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h4 className="text-lg font-bold">Quick Actions</h4>
                  <p className="mt-1 text-sm text-slate-500">
                    Common tasks for sales marketers
                  </p>

                  <div className="mt-5 space-y-3">
                    <button
                      onClick={() => selectPage("New Deposit")}
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      <span className="rounded-lg bg-blue-100 p-2.5 text-blue-700">
                        <ArrowDownToLine size={20} />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold">
                          New Deposit
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          Record customer payment
                        </span>
                      </span>
                      <ChevronRight size={17} className="text-slate-400" />
                    </button>

                    <button
                      onClick={() => selectPage("Search Customer")}
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      <span className="rounded-lg bg-violet-100 p-2.5 text-violet-700">
                        <Search size={20} />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold">
                          Find Customer
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          Verify account details
                        </span>
                      </span>
                      <ChevronRight size={17} className="text-slate-400" />
                    </button>

                    <button
                      onClick={() => selectPage("Reports")}
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      <span className="rounded-lg bg-emerald-100 p-2.5 text-emerald-700">
                        <TrendingUp size={20} />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold">
                          View Reports
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          Review deposit activity
                        </span>
                      </span>
                      <ChevronRight size={17} className="text-slate-400" />
                    </button>
                  </div>

                  <div className="mt-6 rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold">
                      Accuracy first
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Always verify the customer and account number before
                      processing a deposit.
                    </p>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mx-auto flex max-w-lg flex-col items-center py-10 text-center">
                <div className="rounded-2xl bg-blue-50 p-4 text-blue-700">
                  {activePage === "New Deposit" ? (
                    <Wallet size={30} />
                  ) : activePage === "Search Customer" ? (
                    <Search size={30} />
                  ) : activePage === "Daily Summary" ? (
                    <ReceiptText size={30} />
                  ) : activePage === "Reports" ? (
                    <FileText size={30} />
                  ) : (
                    <Settings size={30} />
                  )}
                </div>

                <h3 className="mt-5 text-xl font-bold">{activePage}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This section is part of the SACU development plan. We will
                  implement its functionality in the next development stages.
                </p>

                <button
                  onClick={() => selectPage("Dashboard")}
                  className="mt-6 rounded-xl bg-[#174A83] px-5 py-3 text-sm font-semibold text-white hover:bg-[#102D52]"
                >
                  Return to Dashboard
                </button>
              </div>
            </section>
          )}

          <footer className="border-t border-slate-200 py-5 text-center text-xs text-slate-500">
            SACU Deposit Management System · Development Preview
          </footer>
        </main>
      </div>
    </div>
  );
}
