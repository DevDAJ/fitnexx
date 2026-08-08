import { Text as RNText, type TextProps } from "react-native";
import { cn } from "@/lib/cn";

export function Text({ className, ...props }: TextProps) {
  return <RNText className={cn("text-foreground", className)} {...props} />;
}

export function MutedText({ className, ...props }: TextProps) {
  return <RNText className={cn("text-sm text-muted-foreground", className)} {...props} />;
}
