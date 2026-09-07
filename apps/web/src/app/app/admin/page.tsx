import { cookies } from "next/headers";
import { getPrisma } from "@/lib/prisma";
import { Card, Heading, Text, View, YStack } from "@fitnexx/ui";
import { AdminLogin } from "./admin-login";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = (await cookies()).get("fitnexx_admin")?.value === "1";

  if (!authed) {
    return (
      <View
        style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
        backgroundColor="$background"
      >
        <View flex={1} alignItems="center" justifyContent="center" padding={16}>
          <Card gap={16} alignItems="center" backgroundColor="$card" paddingHorizontal={28} paddingVertical={28}>
            <Heading fontSize={20} fontWeight="800" color="$color">
              Admin access
            </Heading>
            <Text color="$muted" fontSize={14} textAlign="center">
              Enter the admin password to view interest-list signups.
            </Text>
            <AdminLogin />
          </Card>
        </View>
      </View>
    );
  }

  const entries = await getPrisma().interestListEntry.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <View
      style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
      backgroundColor="$background"
    >
      <View flex={1} paddingVertical={24} paddingHorizontal={16}>
        <YStack maxWidth={1024} width="100%" marginLeft="auto" marginRight="auto" gap={16}>
          <YStack gap={4}>
            <Heading fontSize={28} fontWeight="800" color="$color">
              Interest list
            </Heading>
            <Text color="$muted" fontSize={15}>
              {entries.length} signup{entries.length === 1 ? "" : "s"} so far.
            </Text>
          </YStack>

          <Card gap={8} backgroundColor="$card" padding={0} overflow="hidden">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
                color: "#e5e5e5",
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
                {entries.map((e) => (
                  <tr
                    key={e.id}
                    style={{ borderTop: "1px solid #222" }}
                  >
                    <Td>{e.name}</Td>
                    <Td>{e.email ?? <span style={{ color: "#666" }}>—</span>}</Td>
                    <Td>{new Date(e.createdAt).toLocaleString()}</Td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr style={{ borderTop: "1px solid #222" }}>
                    <td colSpan={3} style={{ padding: 16, color: "#888" }}>
                      No signups yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
        padding: "12px 16px",
        fontSize: 12,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        color: "#888",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "10px 16px" }}>{children}</td>;
}