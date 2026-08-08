import { cva, type VariantProps } from "class-variance-authority";
import { Pressable, Text } from "react-native";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "flex-row items-center justify-center rounded-lg px-4 py-2 active:opacity-80",
  {
    variants: {
      variant: {
        default: "bg-primary",
        secondary: "bg-secondary",
        outline: "border border-border bg-background",
        ghost: "",
        destructive: "bg-destructive",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

const textVariants = cva("font-medium", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      outline: "text-foreground",
      ghost: "text-foreground",
      destructive: "text-destructive-foreground",
    },
    size: {
      default: "text-sm",
      sm: "text-sm",
      lg: "text-base",
      icon: "text-sm",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});

type ButtonProps = VariantProps<typeof buttonVariants> & {
  onPress?: () => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export function Button({
  variant,
  size,
  onPress,
  title,
  children,
  className,
  disabled,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(buttonVariants({ variant, size }), disabled && "opacity-50", className)}
    >
      {children ? (
        children
      ) : (
        <Text className={textVariants({ variant, size })}>{title}</Text>
      )}
    </Pressable>
  );
}
