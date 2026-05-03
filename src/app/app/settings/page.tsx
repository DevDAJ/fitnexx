"use client";
import { Header } from "@/components/app/Header";
import { ModeToggle } from "@/components/shared/mode-toggle";

export default function SettingsPage() {
  return (
    <div className="flex-1 p-4 sm:px-6">
      <Header
        title="Settings"
        description="Manage your account and preferences."
      />
      <ModeToggle />
    </div>
  );
}
