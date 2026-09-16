import { Card, Heading, Text, View, YStack } from "@fitnexx/ui";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";
import { AdminLogin } from "./admin-login";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = (await cookies()).get("fitnexx_admin")?.value === "1";

  if (!authed) {
    return (
      <View
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(59,130,246,0.12), transparent 34%)",
        }}
        backgroundColor="$background"
      >
        <View flex={1} alignItems="center" justifyContent="center" padding={16}>
          <Card
            className="route-card"
            width="100%"
            maxWidth={440}
            gap={24}
            alignItems="stretch"
            backgroundColor="rgba(14,21,34,0.94)"
            borderColor="rgba(59,130,246,0.3)"
            padding={36}
            $sm={{ padding: 24 }}
          >
            <YStack gap={8}>
              <Text
                color="$primary"
                fontSize={12}
                fontWeight="700"
                letterSpacing={0.8}
              >
                FITNEXX OPERATIONS
              </Text>
              <Heading
                fontSize={28}
                lineHeight={32}
                fontWeight="800"
                color="$color"
              >
                Admin access
              </Heading>
              <Text color="$muted" fontSize={14} lineHeight={22}>
                Enter the admin password to view interest-list signups.
              </Text>
            </YStack>
            <AdminLogin />
          </Card>
        </View>
      </View>
    );
  }

  const { data: entries, error: findError } = await getSupabaseAdmin()
    .from("interest_list_entry")
    .select("*")
    .order("createdAt", { ascending: false })
    .limit(200);
  if (findError) throw findError;

  return (
    <View
      style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
      backgroundColor="$background"
    >
      <View
        flex={1}
        paddingVertical={56}
        paddingHorizontal={16}
        $sm={{ paddingVertical: 32 }}
      >
        <YStack
          maxWidth={1120}
          width="100%"
          marginLeft="auto"
          marginRight="auto"
          gap={28}
        >
          <View
            flexDirection="row"
            alignItems="flex-end"
            justifyContent="space-between"
            gap={24}
            paddingBottom={24}
            borderBottomWidth={1}
            borderColor="$borderColor"
            $sm={{ flexDirection: "column", alignItems: "flex-start", gap: 12 }}
          >
            <YStack gap={6}>
              <Text
                color="$primary"
                fontSize={12}
                fontWeight="700"
                letterSpacing={0.8}
              >
                EARLY ACCESS
              </Text>
              <Heading
                fontSize={36}
                lineHeight={40}
                fontWeight="800"
                color="$color"
              >
                Interest list
              </Heading>
            </YStack>
            <YStack
              gap={2}
              alignItems="flex-end"
              $sm={{ alignItems: "flex-start" }}
            >
              <Text color="$color" fontSize={28} fontWeight="800">
                {(entries ?? []).length}
              </Text>
              <Text color="$subtle" fontSize={13}>
                signup{(entries ?? []).length === 1 ? "" : "s"} so far
              </Text>
            </YStack>
          </View>

          <Card
            gap={8}
            backgroundColor="$card"
            borderColor="$borderColor"
            padding={0}
            overflow="hidden"
          >
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  minWidth: 640,
                  borderCollapse: "collapse",
                  fontSize: 14,
                  color: "#e5e5e5",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <thead>
                  <tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Signed up</Th>
                  </tr>
                </thead>
                <tbody>
                  {(entries ?? []).map((e) => (
                    <tr key={e.id} style={{ borderTop: "1px solid #252525" }}>
                      <Td>{e.name}</Td>
                      <Td>
                        {e.email ?? (
                          <span style={{ color: "#777" }}>Not provided</span>
                        )}
                      </Td>
                      <Td>{new Date(e.createdAt).toLocaleString()}</Td>
                    </tr>
                  ))}
                  {(entries ?? []).length === 0 && (
                    <tr style={{ borderTop: "1px solid #252525" }}>
                      <td colSpan={3} style={{ padding: 32, color: "#888" }}>
                        No signups yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </YStack>
      </View>
    </View>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "14px 18px",
        fontSize: 12,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        color: "#9ca3af",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "14px 18px" }}>{children}</td>;
}
