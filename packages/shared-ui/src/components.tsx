"use client";

import {
  ScrollView,
  Separator,
  styled,
  Button as TButton,
  Text,
  Theme,
  Input as TInput,
  View,
  XStack,
  YStack,
} from "tamagui";

import { colors } from "./tokens";

export { View, Text, XStack, YStack, ScrollView, Theme, Separator };

export const Container = styled(View, {
  name: "Container",
  maxWidth: 1024,
  width: "100%",
  marginLeft: "auto",
  marginRight: "auto",
  paddingHorizontal: 16,
});

export const Section = styled(YStack, {
  name: "Section",
  paddingVertical: 48,
  paddingHorizontal: 16,
});

export const Card = styled(View, {
  name: "Card",
  backgroundColor: "$card",
  borderWidth: 1,
  borderColor: "$borderColor",
  borderRadius: 14,
  padding: 16,
});

export const Heading = styled(Text, {
  name: "Heading",
  color: "$color",
  fontWeight: "800",
  letterSpacing: -0.02,
});

export const CardTitle = styled(Text, {
  name: "CardTitle",
  color: "$color",
  fontSize: 18,
  fontWeight: "700",
});

export const Muted = styled(Text, {
  name: "Muted",
  color: "$muted",
});

export const BaseButton = styled(TButton, {
  name: "Button",
  borderRadius: 10,
  backgroundColor: "$primary",
  hoverStyle: { backgroundColor: "$primaryHover" },
  pressStyle: { backgroundColor: "$primaryHover" },
  color: "#ffffff",
  paddingHorizontal: 16,
  height: 40,
  fontWeight: "600",
  cursor: "pointer",
  variants: {
    variant: {
      primary: { backgroundColor: "$primary", color: "#ffffff" },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "$borderColor",
        color: "$color",
      },
      ghost: { backgroundColor: "transparent", color: "$color" },
      secondary: { backgroundColor: "$surface", color: "$color" },
    },
    siz: {
      sm: { height: 32, paddingHorizontal: 12, fontSize: 14 },
      md: { height: 40, paddingHorizontal: 16, fontSize: 15 },
      lg: { height: 48, paddingHorizontal: 22, fontSize: 16 },
    },
  } as const,
  defaultVariants: { variant: "primary", siz: "md" },
});

export const Button = BaseButton.styleable<{ size?: "sm" | "md" | "lg" }>(
  ({ size = "md", ...props }, ref) => (
    // siz is an internal variant name so `size` never reaches the TButton
    // font-size resolver (avoids "No font size found" warnings).
    <BaseButton ref={ref} siz={size} {...props} />
  ),
);

export const Input = styled(TInput, {
  name: "Input",
  backgroundColor: "$surface",
  borderWidth: 1,
  borderColor: "$borderColor",
  borderRadius: 10,
  height: 44,
  paddingHorizontal: 12,
  color: "$color",
  fontSize: 15,
  placeholderTextColor: "$subtle",
});

export const TextArea = styled(Input, {
  name: "TextArea",
  height: 140,
  paddingVertical: 10,
  textAlignVertical: "top",
});

export type BadgeVariant =
  | "pr"
  | "improving"
  | "plateau"
  | "regression"
  | "new"
  | "neutral"
  | "primary";

const badgeColors: Record<BadgeVariant, { bg: string; text: string }> = {
  pr: { bg: colors.amber, text: "#000000" },
  improving: { bg: colors.positive, text: "#000000" },
  plateau: { bg: colors.warning, text: "#000000" },
  regression: { bg: colors.negative, text: "#ffffff" },
  new: { bg: colors.primary, text: "#ffffff" },
  primary: { bg: colors.primary, text: "#ffffff" },
  neutral: { bg: "#333333", text: "#aaaaaa" },
};

export function Badge({
  label,
  variant = "neutral",
}: {
  label: string;
  variant?: BadgeVariant;
}) {
  const s = badgeColors[variant];
  return (
    <View
      style={{
        backgroundColor: s.bg,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color: s.text, fontSize: 11, fontWeight: "700" }}>
        {label}
      </Text>
    </View>
  );
}
