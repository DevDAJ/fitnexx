"use client";

import { Button, Heading, Text, View, XStack, YStack } from "@fitnexx/ui";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useState } from "react";
import { AppShowcase } from "@/components/home/app-showcase";
import { FeatureGrid } from "@/components/home/feature-grid";

type ViewMode = "live" | "cards";

export function FeaturesShowcase() {
  const [mode, setMode] = useState<ViewMode>("live");

  const selectMode = (nextMode: ViewMode) => {
    setMode(nextMode);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => ScrollTrigger.refresh()),
    );
  };

  return (
    <View
      id="features"
      tag="section"
      backgroundColor="$surface"
      borderBottomWidth={1}
      borderColor="$borderColor"
      paddingTop={112}
      $sm={{ paddingTop: 72 }}
    >
      <YStack
        maxWidth={1180}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        paddingHorizontal={20}
        alignItems="center"
        gap={28}
        $sm={{ paddingHorizontal: 16 }}
      >
        <YStack maxWidth={720} alignItems="center" gap={14}>
          <Text
            className="mono-label"
            color="$primary"
            fontSize={11}
            fontWeight="700"
          >
            Explore the product
          </Text>
          <Heading
            className="text-balance"
            tag="h2"
            color="$color"
            fontSize={48}
            lineHeight={51}
            fontWeight="800"
            textAlign="center"
            $sm={{ fontSize: 36, lineHeight: 40 }}
          >
            See the workflow or scan every feature.
          </Heading>
          <Text
            color="$muted"
            fontSize={16}
            lineHeight={25}
            maxWidth={620}
            textAlign="center"
          >
            Walk through the real interface, or switch to a concise overview of
            what Fitnexx tracks and explains.
          </Text>
        </YStack>

        <XStack
          role="tablist"
          aria-label="Feature display"
          padding={4}
          gap={4}
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius={999}
          backgroundColor="$background"
        >
          <Button
            role="tab"
            aria-selected={mode === "live"}
            size="sm"
            variant={mode === "live" ? "primary" : "ghost"}
            onPress={() => selectMode("live")}
          >
            Live mockup
          </Button>
          <Button
            role="tab"
            aria-selected={mode === "cards"}
            size="sm"
            variant={mode === "cards" ? "primary" : "ghost"}
            onPress={() => selectMode("cards")}
          >
            Feature cards
          </Button>
        </XStack>
      </YStack>

      <div
        role="tabpanel"
        aria-label={mode === "live" ? "Live mockup" : "Feature cards"}
      >
        {mode === "live" ? (
          <AppShowcase embedded />
        ) : (
          <View
            paddingHorizontal={20}
            paddingVertical={72}
            $sm={{ padding: 16 }}
          >
            <FeatureGrid />
          </View>
        )}
      </div>
    </View>
  );
}
