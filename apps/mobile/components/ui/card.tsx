import type React from "react";
import { Text, View } from "react-native";
import { cn } from "@/lib/cn";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <View className={cn("rounded-xl border border-border bg-card p-4 shadow-sm", className)}>
      {children}
    </View>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <View className={cn("mb-3", className)}>{children}</View>;
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Text className={cn("text-lg font-semibold text-card-foreground", className)}>{children}</Text>;
}

export function CardDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Text className={cn("text-sm text-muted-foreground", className)}>{children}</Text>;
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <View className={cn("", className)}>{children}</View>;
}
