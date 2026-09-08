import { type ReactNode, useEffect } from "react";

import { configurePayments } from "../../lib/payments";
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
    void configurePayments(user.id)
      .then(setIsPro)
      .catch(() => setIsPro(false));
  }, [setIsPro, user]);

  return children;
}
