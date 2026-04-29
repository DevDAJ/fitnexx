"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { submitInterestList } from "@/actions/interest-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const initialState = { status: "idle" as const };

function InterestListFormBody() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    submitInterestList,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [state.status, router]);

  if (state.status === "success") {
    return (
      <p className="text-foreground rounded-lg border bg-muted/40 px-4 py-4 text-center text-sm">
        You&apos;re on the list. Thanks for your interest.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -m-px size-px overflow-hidden whitespace-nowrap border-0 p-0"
        aria-hidden
      />

      <div className="space-y-2">
        <label htmlFor="interest-name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="interest-name"
          name="name"
          required
          maxLength={200}
          autoComplete="name"
          aria-invalid={state.status === "error"}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="interest-email" className="text-sm font-medium">
          Email{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Input
          id="interest-email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={state.status === "error"}
        />
      </div>

      {state.status === "error" ? (
        <p className="text-destructive text-sm" role="alert">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
        {isPending ? "Saving…" : "Add me to the list"}
      </Button>
    </form>
  );
}

export function InterestListSignup() {
  const [formKey, setFormKey] = useState(0);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setFormKey((k) => k + 1);
      }}
    >
      <DialogTrigger asChild>
        <Button size="lg">Add my name to the interest list</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Interest list</DialogTitle>
          <DialogDescription>
            We&apos;ll keep your name on file for Fitnexx launch updates. Email
            is optional but helps us reach you.
          </DialogDescription>
        </DialogHeader>

        <InterestListFormBody key={formKey} />
      </DialogContent>
    </Dialog>
  );
}
