"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function Dashboard() {
  const [status, setStatus] = useState("Loading...");
  const [data, setData] = useState(null);

  useEffect(() => {
    async function run() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/me`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: "include",
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || json?.message || "Unauthorized");
        setData(json);
        setStatus("You’re logged in ✅");
      } catch (e) {
        setStatus(`Not logged in: ${e.message}`);
      }
    }
    run();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Dashboard</h1>
      <p>{status}</p>
      {data ? <pre style={{ marginTop: 12 }}>{JSON.stringify(data, null, 2)}</pre> : null}
    </div>
  );
}
