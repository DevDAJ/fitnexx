import { type ReactNode, useEffect } from "react";
import { AppState } from "react-native";

import {
  configurePayments,
  listenForProStatus,
  refreshProStatus,
} from "../../lib/payments";
import { useAppStore } from "../../lib/store";
import { useAuth } from "./AuthProvider";

export function ProProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const setIsPro = useAppStore((state) => state.setIsPro);

  useEffect(() => {
    if (!user) {
      void setIsPro(false);
      return;
    }
    let active = true;
    let stopListening: (() => void) | undefined;
    void configurePayments(user.id)
      .then((pro) => {
        if (!active) return;
        void setIsPro(pro);
        stopListening = listenForProStatus((next) => void setIsPro(next));
      })
      .catch(() => setIsPro(false));
    const appState = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void refreshProStatus()
          .then(setIsPro)
          .catch(() => undefined);
      }
    });
    return () => {
      active = false;
      stopListening?.();
      appState.remove();
    };
  }, [setIsPro, user]);

  return children;
}
