"use client";

import { Button, Text, View, XStack, YStack } from "@fitnexx/ui";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { LinkButton } from "@/components/ui/link";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#mission", label: "Mission" },
  { href: "/#contact", label: "Contact" },
];

const NAVBAR_CSS = `
.homepage-navbar {
  box-shadow: 0 1px 0 rgba(255,255,255,0.035), 0 18px 50px rgba(1,5,12,0.24);
  will-change: transform;
}
.homepage-navbar::after {
  position: absolute;
  inset: auto 0 -1px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(96,165,250,.55), transparent);
  content: "";
}
`;

export function HomepageNavbar() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      if (open || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;
      const header = ref.current;
      if (!header) return;
      ScrollTrigger.create({
        start: 72,
        end: "max",
        onUpdate: (self) => {
          gsap.to(header, {
            yPercent: self.direction === 1 ? -110 : 0,
            duration: 0.28,
            ease: "power3.out",
            overwrite: true,
          });
        },
        onLeaveBack: () => gsap.to(header, { yPercent: 0, duration: 0.2 }),
      });
    },
    { dependencies: [open], scope: ref, revertOnUpdate: true },
  );

  return (
    <View
      ref={ref}
      tag="header"
      className="homepage-navbar"
      top={0}
      zIndex={50}
      borderBottomWidth={1}
      borderColor="$borderColor"
      backgroundColor="rgba(8,11,16,0.82)"
      style={{
        position: "sticky",
        backdropFilter: "blur(18px) saturate(140%)",
      }}
    >
      <style>{NAVBAR_CSS}</style>
      <XStack
        maxWidth={1180}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        height={64}
        paddingHorizontal={20}
        alignItems="center"
        justifyContent="space-between"
        gap={12}
      >
        <Link href="/" aria-label="Fitnexx home">
          <BrandLogo />
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
            <Link key={link.href} href={link.href}>
              <Text
                color="$muted"
                backgroundColor="transparent"
                hoverStyle={{ color: "$color", backgroundColor: "$card" }}
                paddingHorizontal={10}
                paddingVertical={7}
                borderRadius={999}
                fontSize={14}
                fontWeight="500"
              >
                {link.label}
              </Text>
            </Link>
          ))}
          <LinkButton href="/early-access" size="sm">
            Early access
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
          backgroundColor="rgba(8,11,16,0.98)"
          padding={16}
          gap={6}
          display="none"
          $sm={{ display: "flex" }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ display: "block" }}
            >
              <View
                backgroundColor="transparent"
                paddingHorizontal={12}
                paddingVertical={10}
              >
                <Text
                  color="$muted"
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
            href="/early-access"
            size="sm"
            onPress={() => setOpen(false)}
          >
            Early access
          </LinkButton>
        </YStack>
      ) : null}
    </View>
  );
}
