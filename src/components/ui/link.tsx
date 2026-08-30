"use client";

import { Button, Text } from "@fitnexx/ui";
import Link from "next/link";

type LinkButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg";
  onPress?: () => void;
};

export function LinkButton({
  href,
  children,
  variant = "primary",
  size = "md",
  onPress,
}: LinkButtonProps) {
  return (
    <Link href={href} passHref legacyBehavior>
      <Button tag="a" variant={variant} size={size} onPress={onPress}>
        {children}
      </Button>
    </Link>
  );
}

export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <Text
        color="$muted"
        hoverStyle={{ color: "$color" }}
        cursor="pointer"
        fontSize={14}
        fontWeight="500"
      >
        {children}
      </Text>
    </Link>
  );
}
