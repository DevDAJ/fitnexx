import { useCallback, useEffect, useState } from "react";
import { ScrollView, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAuth, useSignIn, useSignUp, useUser } from "@clerk/clerk-expo";
import type { ScanQuota } from "@fitnexx/shared";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text, MutedText } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { isClerkConfigured } from "@/lib/clerk";
import { getQuota, redeemAd } from "@/lib/scanApi";
import { watchRewardedAd } from "@/lib/rewardedAd";

function AuthForm() {
  const { signIn, setActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setActiveUp, isLoaded: signUpLoaded } = useSignUp();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoaded = mode === "sign-in" ? signInLoaded : signUpLoaded;

  const submit = async () => {
    if (!signIn || !signUp) return;
    setBusy(true);
    setError(null);
    try {
      if (mode === "sign-in") {
        const result = await signIn.create({ identifier: email, password });
        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
        } else {
          setError("Additional verification is required.");
        }
      } else {
        const result = await signUp.create({ emailAddress: email, password });
        if (result.status === "complete") {
          await setActiveUp({ session: result.createdSessionId });
        } else {
          await signUp.prepareEmailAddressVerification();
          setVerifying(true);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    if (!signUp) return;
    setBusy(true);
    setError(null);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActiveUp({ session: result.createdSessionId });
      } else {
        setError("Verification failed. Try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setBusy(false);
    }
  };

  if (verifying) {
    return (
      <CardContent className="gap-3">
        <MutedText>Check your email for a verification code.</MutedText>
        <Input
          placeholder="Verification code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
        />
        {error && <MutedText className="text-red-500">{error}</MutedText>}
        <Button onPress={verify} disabled={busy || !code}>
          <Text className="text-primary-foreground font-medium">Verify email</Text>
        </Button>
      </CardContent>
    );
  }

  return (
    <CardContent className="gap-3">
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
      />
      {error && <MutedText className="text-red-500">{error}</MutedText>}
      <Button onPress={submit} disabled={busy || !isLoaded || !email || !password}>
        <Text className="text-primary-foreground font-medium">
          {mode === "sign-in" ? "Sign in" : "Create account"}
        </Text>
      </Button>
      <Pressable onPress={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}>
        <Text className="text-center text-sm text-primary">
          {mode === "sign-in"
            ? "No account? Create one"
            : "Already have an account? Sign in"}
        </Text>
      </Pressable>
    </CardContent>
  );
}

export default function AccountScreen() {
  const router = useRouter();
  const { isSignedIn, getToken, signOut } = useAuth();
  const { user } = useUser();
  const [quota, setQuota] = useState<ScanQuota | null>(null);
  const [quotaError, setQuotaError] = useState<string | null>(null);
  const [rewardBusy, setRewardBusy] = useState(false);

  const refreshQuota = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      const token = await getToken();
      if (!token) return;
      setQuota(await getQuota(token));
      setQuotaError(null);
    } catch (err) {
      setQuotaError(err instanceof Error ? err.message : "Failed to load quota");
    }
  }, [isSignedIn, getToken]);

  useEffect(() => {
    refreshQuota();
  }, [refreshQuota]);

  const watchAdForScan = async () => {
    setRewardBusy(true);
    try {
      const token = await getToken();
      if (!token) return;
      const earned = await watchRewardedAd();
      if (earned) {
        setQuota(await redeemAd(token));
      }
    } catch (err) {
      setQuotaError(err instanceof Error ? err.message : "Failed to redeem ad reward");
    } finally {
      setRewardBusy(false);
    }
  };

  if (!isClerkConfigured) {
    return (
      <ScrollView className="flex-1 bg-background p-4">
        <Header title="Account" description="Sign in for managed food scans." />
        <Card>
          <CardContent>
            <MutedText>Accounts are not configured on this build.</MutedText>
          </CardContent>
        </Card>
      </ScrollView>
    );
  }

  if (!isSignedIn) {
    return (
      <ScrollView className="flex-1 bg-background p-4">
        <Header
          title="Sign in"
          description="Sign in to get free AI food scans every day."
        />
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <AuthForm />
        </Card>
      </ScrollView>
    );
  }

  const email = user?.primaryEmailAddress?.emailAddress;

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Header title="Account" description="Your managed scan quota." />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Signed in</CardTitle>
        </CardHeader>
        <CardContent className="gap-2">
          <Text>{email ?? user?.username ?? user?.fullName ?? "Fitnexx user"}</Text>
          {quota && (
            <MutedText>
              {quota.remaining} of {quota.base + quota.adsWatched} scans left today
              ({quota.used} used, {quota.adsWatched} from ads)
            </MutedText>
          )}
          {quotaError && <MutedText className="text-red-500">{quotaError}</MutedText>}
        </CardContent>
      </Card>

      <View className="gap-3">
        <Button onPress={watchAdForScan} disabled={rewardBusy}>
          <Text className="text-primary-foreground font-medium">
            {rewardBusy ? "Watching ad..." : "Watch ad for +1 scan"}
          </Text>
        </Button>
        <Button variant="outline" onPress={() => router.back()}>
          <Text className="text-foreground font-medium">Back</Text>
        </Button>
        <Button variant="outline" onPress={() => signOut()}>
          <Text className="text-destructive font-medium">Sign out</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
