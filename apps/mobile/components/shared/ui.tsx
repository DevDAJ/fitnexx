import type { ReactNode } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
  type TextProps,
  type TouchableOpacityProps,
  type ViewProps,
} from "react-native";
import { colors, fontSizes, radii, spacing } from "../../lib/theme";

export function Screen({ style, ...props }: ViewProps) {
  return (
    <View
      style={[
        { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.screen },
        style,
      ]}
      {...props}
    />
  );
}

export function ScreenTitle({ style, ...props }: TextProps) {
  return (
    <Text
      accessibilityRole="header"
      style={[{ color: colors.text, fontSize: fontSizes.xl, fontWeight: "800" }, style]}
      {...props}
    />
  );
}

export function Card({ style, ...props }: ViewProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.lg,
          borderWidth: 1,
          padding: spacing.lg,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function SectionLabel({ style, ...props }: TextProps) {
  return (
    <Text
      style={[
        {
          color: colors.textMuted,
          fontSize: fontSizes.xs,
          fontWeight: "700",
          letterSpacing: 0.8,
          textTransform: "uppercase",
        },
        style,
      ]}
      {...props}
    />
  );
}

type AppButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export function AppButton({
  children,
  variant = "primary",
  disabled,
  style,
  ...props
}: TouchableOpacityProps & {
  children: ReactNode;
  variant?: AppButtonVariant;
}) {
  const variantStyle = {
    primary: { backgroundColor: colors.brand, borderColor: colors.brand },
    secondary: { backgroundColor: colors.surfaceRaised, borderColor: colors.borderStrong },
    ghost: { backgroundColor: colors.transparent, borderColor: colors.transparent },
    danger: { backgroundColor: colors.dangerSolid, borderColor: colors.dangerSolid },
  }[variant];
  const textColor = variant === "primary" ? colors.onBrand : colors.text;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.8}
      disabled={disabled}
      style={[
        {
          minHeight: 48,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: radii.md,
          borderWidth: 1,
          paddingHorizontal: spacing.lg,
          opacity: disabled ? 0.5 : 1,
        },
        variantStyle,
        style,
      ]}
      {...props}
    >
      {typeof children === "string" ? (
        <Text style={{ color: textColor, fontSize: fontSizes.sm, fontWeight: "700" }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

export function AppTextInput({ style, ...props }: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.textMuted}
      selectionColor={colors.brand}
      style={[
        {
          minHeight: 48,
          color: colors.text,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.md,
          borderWidth: 1,
          fontSize: fontSizes.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <View style={{ alignItems: "center", paddingHorizontal: spacing.xl, paddingVertical: spacing.xxl }}>
      <Text style={{ color: colors.text, fontSize: fontSizes.lg, fontWeight: "700", textAlign: "center" }}>
        {title}
      </Text>
      {description ? (
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: fontSizes.sm,
            lineHeight: 21,
            marginTop: spacing.sm,
            textAlign: "center",
          }}
        >
          {description}
        </Text>
      ) : null}
      {action ? <View style={{ marginTop: spacing.lg }}>{action}</View> : null}
    </View>
  );
}
