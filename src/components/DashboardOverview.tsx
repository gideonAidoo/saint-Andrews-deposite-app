
"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Customer = {
  balance?: number;
};

type Deposit = {
  customerName?: string;
  accountNumber?: string;
  amount?: number;
  previousBalance?: number;
  newBalance?: number;
  createdAt?: {
    toDate: () => Date;
  } | null;
};

export default function DashboardOverview() {
  const [totalBalance, setTotalBalance] = useState(0);
  const [todayDeposits, setTodayDeposits] = useState(0);
  const [depositCount, setDepositCount] = useState(0);
  const [recentDeposits, setRecentDeposits] =
    useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let customersLoaded = false;
    let depositsLoaded = false;

    const unsubscribeCustomers = onSnapshot(
      collection(db, "customers"),
      (snapshot) => {
        const total = snapshot.docs.reduce((sum, doc) => {
          const customer = doc.data() as Customer;
          return sum + (Number(customer.balance) || 0);
        }, 0);

        setTotalBalance(total);
        customersLoaded = true;

        if (depositsLoaded) setLoading(false);
      },
      () => {
        setError("Could not load customer balances.");
        setLoading(false);
      }
    );

    const unsubscribeDeposits = onSnapshot(
      collection(db, "deposits"),
      (snapshot) => {
        const deposits = snapshot.docs.map(
          (doc) => doc.data() as Deposit
        );

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const today = deposits.filter((deposit) => {
          if (!deposit.createdAt) return false;

          return (
            deposit.createdAt.toDate().getTime() >=
            startOfDay.getTime()
          );
        });

        const sorted = [...deposits].sort((a, b) => {
          const dateA = a.createdAt?.toDate().getTime() ?? 0;
          const dateB = b.createdAt?.toDate().getTime() ?? 0;
          return dateB - dateA;
        });

        setTodayDeposits(
          today.reduce(
            (sum, deposit) => sum + (Number(deposit.amount) || 0),
            0
          )
        );
        setDepositCount(today.length);
        setRecentDeposits(sorted.slice(0, 5));

        depositsLoaded = true;
        if (customersLoaded) setLoading(false);
      },
      () => {
        setError("Could not load deposit records.");
        setLoading(false);
      }
    );

    return () => {
      unsubscribeCustomers();
      unsubscribeDeposits();
    };
  }, []);

  const money = (amount: number) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(amount);

  if (loading) {
    return <p className="p-6">Loading dashboard data...</p>;
  }

  if (error) {
    return (
      <p className="p-6 text-red-600" role="alert">
        {error}
      </p>
    );
  }

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Customer Balances
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            {money(totalBalance)}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Deposits Today
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            {money(todayDeposits)}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Transactions Today
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            {depositCount}
          </h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">
            Recent Deposits
          </h2>
        </div>

        {recentDeposits.length === 0 ? (
          <p className="p-5 text-gray-500">
            No deposits recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Account Number</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">New Balance</th>
                  <th className="p-4">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {recentDeposits.map((deposit, index) => (
                  <tr
                    key={`${deposit.accountNumber}-${index}`}
                    className="border-t"
                  >
                    <td className="p-4">
                      {deposit.customerName || "Unknown"}
                    </td>
                    <td className="p-4">
                      {deposit.accountNumber || "—"}
                    </td>
                    <td className="p-4">
                      {money(Number(deposit.amount) || 0)}
                    </td>
                    <td className="p-4">
                      {money(Number(deposit.newBalance) || 0)}
                    </td>
                    <td className="p-4">
                      {deposit.createdAt
                        ? deposit.createdAt
                            .toDate()
                            .toLocaleString()
                        : "Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
