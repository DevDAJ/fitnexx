import { TextInput, type TextInputProps } from "react-native";
import { cn } from "@/lib/cn";

export function Input({ className, ...props }: TextInputProps) {
  return (
    <TextInput
      className={cn(
        "h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground",
        className,
      )}
      placeholderTextColor="hsl(240, 3.8%, 46.1%)"
      {...props}
    />
  );
}
