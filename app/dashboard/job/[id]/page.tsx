"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [timeline, setTimeline] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadJob() {
    const res = await fetch("/api/jobs/list");
    const data = await res.json();

    const found = data.jobs.find((j: any) => j.id === id);
    setJob(found || null);
  }

  async function loadBids() {
    const res = await fetch("/api/bids/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: id }),
    });

    const data = await res.json();
    setBids(data.bids || []);
  }

  async function submitBid() {
    setLoading(true);
    setError("");

