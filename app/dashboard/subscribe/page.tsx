"use client";

import { useState } from "react";
import { getToken } from "@/app/utils/auth";

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startSubscription() {
    setLoading(true);
    setError("");

    const token = getToken();

    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to start subscription");
      setLoading(false);
      return;
    }

    // Redirect to Stripe Checkout
    window.location.href = data.url;
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Upgrade Your Account</h1>

      <p className="mb-6 text-gray-700">
        Subscribe to unlock full access to Bid‑Build, including unlimited job
        posting, bidding, messaging, and file uploads.
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={startSubscription}
        disabled={loading}
        className="w-full bg-purple-600 text-white p-3 rounded"
      >
        {loading ? "Redirecting..." : "Subscribe Now"}
      </button>
    </div>
  );
}
