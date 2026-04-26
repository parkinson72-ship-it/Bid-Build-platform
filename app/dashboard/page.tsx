"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/app/utils/auth";

export default function DashboardPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function loadJobs() {
      const res = await fetch("/api/jobs/list");
      const data = await res.json();
      setJobs(data.jobs || []);
    }

    loadJobs();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <h2 className="text-xl font-semibold mb-4">Available Jobs</h2>

      <div className="space-y-4">
        {jobs.map((job: any) => (
          <div key={job.id} className="border p-4 rounded">
            <h3 className="text-lg font-bold">{job.title}</h3>
            <p className="text-gray-700">{job.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Posted by: {job.user.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

