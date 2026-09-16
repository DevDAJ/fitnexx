"use client";

import { Button, Card, Text, View, YStack } from "@fitnexx/ui";
import { X } from "lucide-react";
import { useActionState, useState } from "react";
import { submitBugReport } from "@/actions/bug-report";
import { SubmitButton, TextAreaField } from "@/components/ui/field";

const initialState = { status: "idle" as const };

function BugReportFormBody({ meta }: { meta: { ua: string; url: string } }) {
  const [state, formAction, isPending] = useActionState(
    submitBugReport,
    initialState,
  );

  if (state.status === "success") {
    return (
      <Text
        color="$color"
        backgroundColor="$card"
        borderWidth={1}
        borderColor="$borderColor"
        borderRadius={14}
        padding={16}
        textAlign="center"
        fontSize={14}
      >
        Thanks, your report is in. We&apos;ll take a look.
      </Text>
    );
  }

  return (
    <form action={formAction}>
      <YStack gap={16}>
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
            border: 0,
          }}
        />
        <input type="hidden" name="platform" value="web" />
        <input type="hidden" name="user_agent" value={meta.ua} />
        <input type="hidden" name="url" value={meta.url} />

        <YStack gap={8}>
          <label
            htmlFor="bug-description"
            style={{ color: "#e5e5e5", fontSize: 14, fontWeight: 600 }}
          >
            What went wrong?
          </label>
          <TextAreaField
            id="bug-description"
            name="description"
            required
            minLength={10}
            maxLength={8000}
            placeholder="What happened, and what did you expect instead?"
          />
          <Text color="$subtle" fontSize={12}>
            10 to 8,000 characters. Your browser and this page are attached
            automatically.
          </Text>
        </YStack>

        {state.status === "error" ? (
          <Text color="$negative" fontSize={14} role="alert">
            {state.message}
          </Text>
        ) : null}

        <SubmitButton type="submit" disabled={isPending}>
          {isPending ? "Sending…" : "Send report"}
        </SubmitButton>
      </YStack>
    </form>
  );
}

export function BugReportTrigger() {
  const [open, setOpen] = useState(false);
  const [meta, setMeta] = useState({ ua: "", url: "" });

  const handleOpen = () => {
    setMeta({ ua: navigator.userAgent, url: window.location.href });
    setOpen(true);
  };

  return (
    <>
      <Text
        color="$muted"
        hoverStyle={{ color: "$color" }}
        cursor="pointer"
        fontSize={14}
        fontWeight="500"
        onPress={handleOpen}
      >
        Report a bug
      </Text>

      {open ? (
        <View
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={100}
          backgroundColor="rgba(0,0,0,0.6)"
          alignItems="center"
          justifyContent="center"
          padding={16}
          onPress={() => setOpen(false)}
          style={{ position: "fixed" }}
        >
          <Card
            width="100%"
            maxWidth={420}
            gap={12}
            onPress={(e) => e.stopPropagation()}
            style={{ maxHeight: "calc(100dvh - 32px)", overflowY: "auto" }}
          >
            <View
              flexDirection="row"
              alignItems="flex-start"
              justifyContent="space-between"
              gap={8}
            >
              <YStack gap={4} flex={1} minWidth={0}>
                <Text color="$color" fontSize={18} fontWeight="700">
                  Report a bug
                </Text>
                <Text color="$muted" fontSize={13} lineHeight={20}>
                  Tell us what broke. Straight to the team, no account needed.
                </Text>
              </YStack>
              <Button
                size="sm"
                variant="ghost"
                icon={<X size={16} color="#e5e5e5" />}
                onPress={() => setOpen(false)}
                aria-label="Close"
              />
            </View>

            <BugReportFormBody meta={meta} />
          </Card>
        </View>
      ) : null}
    </>
  );
}
