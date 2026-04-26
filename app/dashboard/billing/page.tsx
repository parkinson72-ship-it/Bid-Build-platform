"use client";

import { useState } from "react";
import { getToken } from "@/app/utils/auth";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function openPortal() {
    setLoading(true);
    setError("");

    const token = getToken();

    const res = await fetch("/api/stripe/billing-portal", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to open billing portal");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Billing & Subscription</h1>

      <p className="mb-6 text-gray-700">
        Manage your subscription, payment methods, and invoices.
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={openPortal}
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded"
      >
        {loading ? "Opening..." : "Open Billing Portal"}
      </button>
    </div>
  );
}
