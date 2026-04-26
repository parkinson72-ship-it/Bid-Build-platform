"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getToken } from "@/app/utils/auth";

export default function MessageThreadPage() {
  const { jobId } = useParams();

  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [job, setJob] = useState<any>(null);

  async function loadMessages() {
    const res = await fetch("/api/messages/thread", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });

    const data = await res.json();
    setMessages(data.messages || []);
  }

  async function loadJob() {
    const res = await fetch("/api/jobs/list");
    const data = await res.json();
    const found = data.jobs.find((j: any) => j.id === jobId);
    setJob(found || null);
  }

  async function sendMessage() {
    if (!message.trim()) return;

    const token = getToken();

    const res = await fetch("/api/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        jobId,
        message,
      }),
    });

    if (res.ok) {
      setMessage("");
      loadMessages();
    }
  }

  useEffect(() => {
    loadJob();
    loadMessages();
  }, []);

  if (!job) return <p className="mt-10 text-center">Loading messages...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">
        Messages for: {job.title}
      </h1>

      <div className="border rounded p-4 h-[500px] overflow-y-auto bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-500">No messages yet.</p>
        )}

        {messages.map((msg: any) => (
          <div key={msg.id} className="mb-4">
            <p className="font-semibold">{msg.user.name}</p>
            <p className="bg-white p-3 rounded shadow-sm">{msg.content}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(msg.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-3 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
