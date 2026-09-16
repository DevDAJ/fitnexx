import { Text, View, XStack, YStack } from "@fitnexx/ui";
import { BrandLogo } from "@/components/brand-logo";
import { LinkButton, TextLink } from "@/components/ui/link";

const productLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#mission", label: "Mission" },
  { href: "/early-access", label: "Early access" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/#contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <View
      tag="footer"
      borderTopWidth={1}
      borderColor="$borderColor"
      backgroundColor="$background"
      paddingHorizontal={20}
      paddingBottom={48}
      $sm={{ paddingHorizontal: 16, paddingBottom: 32 }}
    >
      <YStack
        maxWidth={1180}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        gap={48}
      >
        <XStack
          marginTop={80}
          marginBottom={32}
          padding={40}
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius={24}
          backgroundColor="$card"
          alignItems="center"
          justifyContent="space-between"
          gap={28}
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 15%, rgba(59,130,246,.18), transparent 38%)",
          }}
          $sm={{
            flexDirection: "column",
            alignItems: "flex-start",
            padding: 28,
            marginTop: 56,
          }}
        >
          <YStack gap={10} maxWidth={610}>
            <Text
              color="$color"
              fontSize={32}
              lineHeight={36}
              fontWeight="800"
              letterSpacing={-1.1}
            >
              Build a training history worth keeping.
            </Text>
            <Text color="$muted" fontSize={15} lineHeight={23}>
              Track the work, understand the trend, and keep control of the
              record.
            </Text>
          </YStack>
          <LinkButton href="/early-access" size="lg">
            Get early access
          </LinkButton>
        </XStack>

        <XStack
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={40}
          $sm={{ flexDirection: "column" }}
        >
          <YStack gap={12} maxWidth={360}>
            <BrandLogo size="md" />
            <Text color="$muted" fontSize={14} lineHeight={22}>
              Private training, nutrition, and body tracking that turns your own
              history into better decisions.
            </Text>
          </YStack>

          <XStack gap={72} flexWrap="wrap" $sm={{ gap: 40 }}>
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
            © {new Date().getFullYear()} Fitnexx. Your history stays yours.
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
