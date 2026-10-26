
"use client";

import { useState, type FormEvent } from "react";
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(amount);

export default function NewDepositForm() {
  const [customerName, setCustomerName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [newBalance, setNewBalance] = useState<number | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setNewBalance(null);

    const name = customerName.trim();
    const account = accountNumber.trim();
    const depositAmount = Number(amount);

    if (!name || !account || !amount) {
      setError("Please complete all fields.");
      return;
    }

    if (!/^[a-zA-Z0-9-]+$/.test(account)) {
      setError("Use only letters, numbers, and hyphens in the account number.");
      return;
    }

    if (!Number.isFinite(depositAmount) || depositAmount <= 0) {
      setError("Enter a valid deposit amount greater than zero.");
      return;
    }

    if (Math.round(depositAmount * 100) !== depositAmount * 100) {
      setError("The deposit amount cannot have more than two decimal places.");
      return;
    }

    setSaving(true);

    try {
      const customerRef = doc(db, "customers", account);
      const depositRef = doc(collection(db, "deposits"));

      const result = await runTransaction(db, async (transaction) => {
        const customerSnapshot = await transaction.get(customerRef);

        let previousBalance = 0;

        if (customerSnapshot.exists()) {
          const customer = customerSnapshot.data();

          if (
            typeof customer.balance !== "number" ||
            !Number.isFinite(customer.balance) ||
            customer.balance < 0
          ) {
            throw new Error(
              "The saved customer balance is invalid. Please contact an administrator."
            );
          }

          previousBalance = customer.balance;
        }

        const updatedBalance =
          Math.round((previousBalance + depositAmount) * 100) / 100;

        transaction.set(
          customerRef,
          {
            name,
            accountNumber: account,
            balance: updatedBalance,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        transaction.set(depositRef, {
          customerName: name,
          accountNumber: account,
          amount: depositAmount,
          previousBalance,
          newBalance: updatedBalance,
          createdAt: serverTimestamp(),
        });

        return updatedBalance;
      });

      setNewBalance(result);
      setMessage("Deposit saved successfully.");
      setCustomerName("");
      setAccountNumber("");
      setAmount("");
    } catch (err) {
      console.error("Deposit save failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the deposit. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">
          Record a Customer Deposit
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Enter the customer details and amount received. The system
          calculates the updated balance automatically.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Customer Name
          </label>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            placeholder="Enter customer's full name"
            required
            disabled={saving}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Account Number
          </label>
          <input
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            placeholder="Enter account number"
            required
            disabled={saving}
          />
          <p className="mt-1 text-xs text-slate-500">
            Account numbers must contain only letters, numbers, and hyphens.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Deposit Amount (GHS)
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            placeholder="0.00"
            required
            disabled={saving}
          />
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">
            Previous balance is retrieved from the saved customer record.
            A new customer starts at GHS 0.00.
          </p>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {message && (
          <div role="status" className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
            <p className="font-semibold">{message}</p>
            {newBalance !== null && (
              <p className="mt-1">
                Updated customer balance: {formatMoney(newBalance)}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-[#174A83] px-5 py-3 font-semibold text-white hover:bg-[#102D52] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving Deposit..." : "Save Deposit"}
        </button>
      </form>
    </section>
  );
}
