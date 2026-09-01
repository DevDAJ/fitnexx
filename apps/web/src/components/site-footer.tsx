import { Text, View, YStack } from "@fitnexx/ui";
import { TextLink } from "@/components/ui/link";

const primaryLinks = [
  { href: "/mission", label: "Mission & vision" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/cookie-policy", label: "Cookie Policy" },
];

export function SiteFooter() {
  return (
    <View
      tag="footer"
      borderTopWidth={1}
      borderColor="$borderColor"
      paddingVertical={40}
      paddingHorizontal={16}
    >
      <YStack
        maxWidth={1024}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        gap={24}
      >
        <View
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="center"
          gap={24}
          $sm={{ justifyContent: "flex-start" }}
        >
          {primaryLinks.map(({ href, label }) => (
            <TextLink key={href} href={href}>
              {label}
            </TextLink>
          ))}
        </View>
        <Text
          color="$subtle"
          fontSize={12}
          textAlign="center"
          $sm={{ textAlign: "left" }}
        >
          © {new Date().getFullYear()} Fitnexx. Built with privacy in mind.
        </Text>
      </YStack>
    </View>
  );
}
