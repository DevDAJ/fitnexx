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
        width: "100%",
        maxWidth: 360,
      }}
    >
      <label
        htmlFor="admin-password"
        style={{ color: "#e5e5e5", fontSize: 13, fontWeight: 600 }}
      >
        Password
      </label>
      <input
        id="admin-password"
        type="password"
        name="password"
        placeholder="Admin password"
        required
        style={{
          padding: "13px 14px",
          borderRadius: 8,
          border: "1px solid #343434",
          background: "#0b0b0b",
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
          padding: "13px 14px",
          borderRadius: 8,
          border: "none",
          background: "#3b82f6",
          color: "#fff",
          fontSize: 15,
          fontWeight: 700,
          cursor: pending ? "not-allowed" : "pointer",
          opacity: pending ? 0.65 : 1,
        }}
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
