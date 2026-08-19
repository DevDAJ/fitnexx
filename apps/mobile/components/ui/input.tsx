import { TextInput, type TextInputProps } from "react-native";
import { cn } from "@/lib/cn";
import { useThemeColors } from "@/lib/theme";

export function Input({ className, ...props }: TextInputProps) {
  const c = useThemeColors();
  return (
    <TextInput
      className={cn(
        "h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground",
        className,
      )}
      placeholderTextColor={c.mutedForeground}
      {...props}
    />
  );
}
