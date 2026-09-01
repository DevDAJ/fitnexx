"use client";

import { config, TamaguiProvider as TamaguiRootProvider } from "@fitnexx/ui";
import { useServerInsertedHTML } from "next/navigation";
import type { ReactNode } from "react";

export function TamaguiProvider({ children }: { children: ReactNode }) {
  useServerInsertedHTML(() => {
    return (
      <style
        dangerouslySetInnerHTML={{ __html: config.getNewCSS() }}
        data-tamagui
      />
    );
  });

  return (
    <TamaguiRootProvider config={config} defaultTheme="dark">
      {children}
    </TamaguiRootProvider>
  );
}
