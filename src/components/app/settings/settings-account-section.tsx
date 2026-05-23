"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

import { SettingsRow } from "./settings-row";

export function SettingsAccountSection() {
  const { openUserProfile, signOut } = useClerk();

  return (
    <>
      <SettingsRow
        title="Manage profile"
        description="Update your name, email, and security settings."
        mobileActionLabel="Manage profile"
        onMobileClick={() => openUserProfile()}
      >
        <Button variant="outline" onClick={() => openUserProfile()}>
          Manage profile
        </Button>
      </SettingsRow>
      <SettingsRow
        title="Sign out"
        description="Sign out of Fitnexx on this device."
        mobileActionLabel="Sign out"
        onMobileClick={() => signOut()}
      >
        <Button variant="outline" onClick={() => signOut()}>
          Sign out
        </Button>
      </SettingsRow>
    </>
  );
}
