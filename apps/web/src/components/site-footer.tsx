import { Text, View, XStack, YStack } from "@fitnexx/ui";
import { TextLink } from "@/components/ui/link";

const productLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/mission", label: "Mission" },
  { href: "/coming-soon", label: "Get started" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <View
      tag="footer"
      borderTopWidth={1}
      borderColor="$borderColor"
      backgroundColor="$surface"
      paddingVertical={56}
      paddingHorizontal={16}
      $sm={{ paddingVertical: 40 }}
    >
      <YStack
        maxWidth={1024}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        gap={36}
      >
        <XStack
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={40}
          $sm={{ flexDirection: "column" }}
        >
          <YStack gap={10} maxWidth={320}>
            <XStack alignItems="center" gap={9}>
              <View
                width={30}
                height={30}
                borderRadius={10}
                alignItems="center"
                justifyContent="center"
                style={{
                  background: "linear-gradient(145deg, #60a5fa, #2563eb)",
                }}
              >
                <Text color="#fff" fontSize={12} fontWeight="800">
                  F
                </Text>
              </View>
              <Text color="$color" fontSize={18} fontWeight="800">
                Fitnexx
              </Text>
            </XStack>
            <Text color="$muted" fontSize={14} lineHeight={22}>
              Private workout, nutrition, and body tracking built around your
              data, not advertising profiles.
            </Text>
          </YStack>

          <XStack gap={56} flexWrap="wrap" $sm={{ gap: 40 }}>
            <FooterGroup title="Product" links={productLinks} />
            <FooterGroup title="Company & legal" links={legalLinks} />
          </XStack>
        </XStack>

        <XStack
          borderTopWidth={1}
          borderColor="$borderColor"
          paddingTop={20}
          justifyContent="space-between"
          flexWrap="wrap"
          gap={12}
        >
          <Text color="$subtle" fontSize={12}>
            © {new Date().getFullYear()} Fitnexx. Built with privacy in mind.
          </Text>
          <Text color="$subtle" fontSize={12}>
            Local by default. AI only when requested.
          </Text>
        </XStack>
      </YStack>
    </View>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <YStack gap={10} minWidth={130}>
      <Text
        color="$color"
        fontSize={12}
        fontWeight="700"
        textTransform="uppercase"
        letterSpacing={0.7}
      >
        {title}
      </Text>
      {links.map(({ href, label }) => (
        <TextLink key={href} href={href}>
          {label}
        </TextLink>
      ))}
    </YStack>
  );
}
