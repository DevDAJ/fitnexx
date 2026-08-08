"use client";

import { setPersistenceStorage } from "@fitnexx/shared";
import { useRef } from "react";
import { createIndexedDbStorage } from "@/lib/web-persistence";

export function PersistenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialized = useRef(false);
  if (!initialized.current) {
    setPersistenceStorage(createIndexedDbStorage());
    initialized.current = true;
  }
  return <>{children}</>;
}
