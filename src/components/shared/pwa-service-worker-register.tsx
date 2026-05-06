"use client";

import { useEffect } from "react";

/**
 * Registers the PWA service worker using the same options as the Next.js guide:
 * https://nextjs.org/docs/app/guides/progressive-web-apps#2-implementing-web-push-notifications
 */
export function PwaServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      })
      .catch(() => {});
  }, []);

  return null;
}
