"use client";

import { useTheme } from "next-themes";
import { Header } from "@/components/app/Header";
import { SettingsAccountSection } from "@/components/app/settings/settings-account-section";
import { SettingsRow } from "@/components/app/settings/settings-row";
import { ModeToggle } from "@/components/shared/mode-toggle";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:px-6">
      <Header
        title="Settings"
        description="Manage your account and preferences."
      />
      <section aria-label="Settings" className="divide-y divide-border">
        <SettingsRow
          title="Dark mode"
          description="Easier on the eyes in low light."
          mobileActionLabel="Toggle dark mode"
          mobileTrailing="control"
          onMobileClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
        >
          <ModeToggle className="shrink-0" />
        </SettingsRow>
        <SettingsAccountSection />
      </section>
    </div>
  );
}
