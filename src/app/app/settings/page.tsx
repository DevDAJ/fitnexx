"use client";
import { useState } from "react";
import { Header } from "@/components/app/Header";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
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
