"use server";

import { getSupabaseAdmin } from "@/lib/supabase";

export type BugReportState =
  | { status: "idle" | "success" }
  | { status: "error"; message: string };

// ponytail: naive UA parse, good enough for triage. Use a real parser if routing by browser ever matters.
function parseUserAgent(ua: string): {
  browser: string | null;
  os: string | null;
} {
  if (!ua) return { browser: null, os: null };
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /Chrome\//.test(ua)
      ? "Chrome"
      : /Firefox\//.test(ua)
        ? "Firefox"
        : /Safari\//.test(ua)
          ? "Safari"
          : null;
  const os = /Android/.test(ua)
    ? "Android"
    : /iPhone|iPad|iPod/.test(ua)
      ? "iOS"
      : /Windows/.test(ua)
        ? "Windows"
        : /Mac OS X/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : null;
  return { browser, os };
}

/**
 * Records user-reported bugs in Supabase.
 */
export async function submitBugReport(
  _prev: BugReportState,
  formData: FormData,
): Promise<BugReportState> {
  const honey = String(formData.get("company_website") ?? "").trim();
  if (honey.length > 0) {
    return { status: "success" };
  }

  const description = String(formData.get("description") ?? "").trim();
  const platform = String(formData.get("platform") ?? "").trim();
  const userAgent = String(formData.get("user_agent") ?? "").slice(0, 500);
  const url = String(formData.get("url") ?? "").slice(0, 500);

  if (description.length < 10 || description.length > 8000) {
    return {
      status: "error",
      message: "Please describe the bug (10 to 8,000 characters).",
    };
  }
  if (platform !== "web" && platform !== "mobile") {
    return { status: "error", message: "Invalid platform." };
  }

  const { browser, os } = parseUserAgent(userAgent);

  try {
    const { error } = await getSupabaseAdmin()
      .from("bug_report")
      .insert({
        description,
        platform,
        browser,
        os,
        url: url.length > 0 ? url : null,
      });
    if (error) throw error;
  } catch (err) {
    console.error("[bug-report]", err);
    return {
      status: "error",
      message: "Could not send your report. Please try again later.",
    };
  }

  return { status: "success" };
}
