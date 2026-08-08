import "../global.css";
import "@/lib/persistence";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider } from "@clerk/clerk-expo";
import { useColorScheme } from "nativewind";
import { clerkPublishableKey, isClerkConfigured, tokenCache } from "@/lib/clerk";
import { initializeAds } from "@/lib/rewardedAd";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    initializeAds();
  }, []);

  const stack = (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      {isClerkConfigured ? (
        <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
          {stack}
        </ClerkProvider>
      ) : (
        stack
      )}
    </>
  );
}
