"use client";

import { Button, Text, View, XStack, YStack } from "@fitnexx/ui";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LinkButton, TextLink } from "@/components/ui/link";

const links = [
  { href: "/features", label: "Features" },
  { href: "/mission", label: "Mission" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function HomepageNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <View
      tag="header"
      top={0}
      zIndex={50}
      borderBottomWidth={1}
      borderColor="$borderColor"
      backgroundColor="rgba(10,10,10,0.85)"
      style={{ position: "sticky", backdropFilter: "blur(10px)" }}
    >
      <XStack
        maxWidth={1024}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        height={56}
        paddingHorizontal={16}
        alignItems="center"
        justifyContent="space-between"
        gap={12}
      >
        <Link href="/">
          <Text
            fontSize={16}
            fontWeight="800"
            color="$color"
            letterSpacing={-0.02}
          >
            Fitnexx
          </Text>
        </Link>

        <XStack
          tag="nav"
          aria-label="Primary"
          display="flex"
          $sm={{ display: "none" }}
          alignItems="center"
          gap={8}
        >
          {links.map((l) => (
            <TextLink key={l.href} href={l.href}>
              {l.label}
            </TextLink>
          ))}
          <LinkButton href="/coming-soon" size="sm">
            Get started
          </LinkButton>
        </XStack>

        <XStack display="none" $sm={{ display: "flex" }} alignItems="center">
          <Button
            size="sm"
            variant="ghost"
            icon={
              open ? (
                <X size={18} color="#e5e5e5" />
              ) : (
                <Menu size={18} color="#e5e5e5" />
              )
            }
            onPress={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          />
        </XStack>
      </XStack>

      {open ? (
        <YStack
          tag="nav"
          aria-label="Primary mobile"
          borderTopWidth={1}
          borderColor="$borderColor"
          padding={12}
          gap={4}
          display="none"
          $sm={{ display: "flex" }}
        >
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              <Text
                color="$color"
                fontSize={15}
                fontWeight="600"
                paddingVertical={8}
              >
                {l.label}
              </Text>
            </Link>
          ))}
          <LinkButton
            href="/coming-soon"
            size="sm"
            onPress={() => setOpen(false)}
          >
            Get started
          </LinkButton>
        </YStack>
      ) : null}
    </View>
  );
}
