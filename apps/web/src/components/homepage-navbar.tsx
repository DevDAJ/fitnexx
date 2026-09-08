"use client";

import { Button, Text, View, XStack, YStack } from "@fitnexx/ui";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/link";

const links = [
  { href: "/features", label: "Features" },
  { href: "/mission", label: "Mission" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

const NAVBAR_CSS = `
.homepage-navbar {
  box-shadow: 0 1px 0 rgba(255,255,255,0.02), 0 12px 40px rgba(0,0,0,0.18);
  transition: transform 180ms ease;
}
@media (prefers-reduced-motion: reduce) {
  .homepage-navbar { transition: none; }
}
`;

export function HomepageNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let previousY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setHidden(!open && currentY > 56 && currentY > previousY);
      previousY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <View
      tag="header"
      className="homepage-navbar"
      top={0}
      zIndex={50}
      borderBottomWidth={1}
      borderColor="$borderColor"
      backgroundColor="rgba(10,10,10,0.85)"
      style={{
        position: "sticky",
        backdropFilter: "blur(10px)",
        transform: hidden && !open ? "translateY(-100%)" : "translateY(0)",
      }}
    >
      <style>{NAVBAR_CSS}</style>
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
        <Link href="/" aria-label="Fitnexx home">
          <XStack alignItems="center" gap={9}>
            <View
              width={28}
              height={28}
              borderRadius={9}
              alignItems="center"
              justifyContent="center"
              style={{
                background: "linear-gradient(145deg, #60a5fa, #2563eb)",
                boxShadow: "0 8px 22px rgba(59,130,246,0.3)",
              }}
              $sm={{ display: "none" }}
            >
              <Text color="#fff" fontSize={12} fontWeight="800">
                F
              </Text>
            </View>
            <Text
              fontSize={16}
              fontWeight="800"
              color="$color"
              letterSpacing={-0.02}
            >
              Fitnexx
            </Text>
          </XStack>
        </Link>

        <XStack
          tag="nav"
          aria-label="Primary"
          display="flex"
          $sm={{ display: "none" }}
          alignItems="center"
          gap={8}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              <Text
                color={pathname === link.href ? "$color" : "$muted"}
                backgroundColor={
                  pathname === link.href
                    ? "rgba(59,130,246,0.12)"
                    : "transparent"
                }
                hoverStyle={{ color: "$color", backgroundColor: "$card" }}
                paddingHorizontal={10}
                paddingVertical={7}
                borderRadius={9}
                fontSize={14}
                fontWeight={pathname === link.href ? "600" : "500"}
              >
                {link.label}
              </Text>
            </Link>
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
            onPress={() => {
              setHidden(false);
              setOpen((current) => !current);
            }}
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
          backgroundColor="rgba(10,10,10,0.96)"
          padding={12}
          gap={6}
          display="none"
          $sm={{ display: "flex" }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={() => setOpen(false)}
              style={{ display: "block" }}
            >
              <View
                backgroundColor={
                  pathname === link.href
                    ? "rgba(59,130,246,0.12)"
                    : "transparent"
                }
                paddingHorizontal={12}
                paddingVertical={10}
                borderLeftWidth={pathname === link.href ? 2 : 0}
                borderColor="$primary"
              >
                <Text
                  color={pathname === link.href ? "$color" : "$muted"}
                  fontSize={15}
                  lineHeight={20}
                  fontWeight="600"
                >
                  {link.label}
                </Text>
              </View>
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
