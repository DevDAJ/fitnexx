"use client";

import { useActionState } from "react";
import { login } from "./admin-actions";

export function AdminLogin() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <form
      action={formAction}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxWidth: 320,
      }}
    >
      <input
        type="password"
        name="password"
        placeholder="Admin password"
        required
        autoFocus
        style={{
          padding: "12px 14px",
          borderRadius: 10,
          border: "1px solid #333",
          background: "#111",
          color: "#fff",
          fontSize: 15,
        }}
      />
      {state?.error && (
        <p style={{ color: "#ef4444", fontSize: 14, margin: 0 }}>
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        style={{
          padding: "12px 14px",
          borderRadius: 10,
          border: "none",
          background: "#3b82f6",
          color: "#fff",
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}