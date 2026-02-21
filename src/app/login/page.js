"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const endpoint = mode === "signup" ? "/auth/signup" : "/auth/login";
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed");
      // if your API returns token, store it:
      if (data?.token) localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
        <h1 style={{ fontSize: 22, marginBottom: 12 }}>
          {mode === "signup" ? "Create account" : "Log in"}
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
          />

          <button
            disabled={loading}
            style={{ padding: 10, borderRadius: 8, border: "none", cursor: "pointer" }}
          >
            {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Log in"}
          </button>

          {msg ? <p style={{ color: "crimson" }}>{msg}</p> : null}
        </form>

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            style={{ background: "transparent", border: "none", textDecoration: "underline", cursor: "pointer" }}
          >
            {mode === "login" ? "Need an account? Sign up" : "Have an account? Log in"}
          </button>
        </div>

        <p style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
          API: {API_BASE}
        </p>
      </div>
    </div>
  );
}

