"use client";

import config from "@fitnexx/ui/config";
import { useServerInsertedHTML } from "next/navigation";
import type { ReactNode } from "react";
import { TamaguiProvider as TamaguiRootProvider } from "tamagui";

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
