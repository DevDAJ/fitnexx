import { Text, View } from "react-native";
import { colors, radii } from "../../lib/theme";
import { Card, SectionLabel } from "../shared/ui";

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  ok: { bg: colors.surfaceRaised, fg: colors.success },
  watch: { bg: colors.surfaceRaised, fg: colors.warning },
  flag: { bg: colors.surfaceRaised, fg: colors.danger },
};

const TREND_ARROW: Record<string, string> = {
  closing: "↘",
  widening: "↗",
  stable: "→",
};

export default function StrengthBalanceCard({
  findings,
}: {
  findings: {
    pair: { name: string };
    ratio: number;
    status: "ok" | "watch" | "flag";
    trend: "closing" | "widening" | "stable";
  }[];
}) {
  return (
    <Card>
      <SectionLabel style={{ marginBottom: 10 }}>Strength Balance</SectionLabel>

      {findings.length === 0 ? (
        <Text style={{ color: colors.textMuted, fontSize: 13 }}>
          Not enough data (need 3+ sessions with both exercises)
        </Text>
      ) : (
        findings.slice(0, 3).map((f, i) => {
          const st = STATUS_STYLE[f.status];
          return (
            <View
              key={f.pair.name}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 10,
                borderTopWidth: i > 0 ? 1 : 0,
                borderTopColor: colors.border,
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 13,
                  fontWeight: "600",
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {f.pair.name}
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 13,
                  fontWeight: "700",
                  marginHorizontal: 8,
                }}
              >
                {f.ratio.toFixed(2)}x
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Text style={{ color: colors.textMuted, fontSize: 14 }}>
                  {TREND_ARROW[f.trend]}
                </Text>
                <View
                  style={{
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: radii.sm,
                    backgroundColor: st.bg,
                  }}
                >
                  <Text
                    style={{
                      color: st.fg,
                      fontSize: 11,
                      fontWeight: "700",
                      textTransform: "uppercase",
                    }}
                  >
                    {f.status}
                  </Text>
                </View>
              </View>
            </View>
          );
        })
      )}
    </Card>
  );
}
