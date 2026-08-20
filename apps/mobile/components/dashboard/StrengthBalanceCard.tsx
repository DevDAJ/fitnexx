import { View, Text } from "react-native";

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  ok: { bg: "#22c55e22", fg: "#22c55e" },
  watch: { bg: "#f59e0b22", fg: "#f59e0b" },
  flag: { bg: "#ef444422", fg: "#ef4444" },
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
    <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
      <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
        Strength Balance
      </Text>

      {findings.length === 0 ? (
        <Text style={{ color: "#666", fontSize: 13 }}>Not enough data (need 3+ sessions with both exercises)</Text>
      ) : (
        findings.slice(0, 3).map((f, i) => {
          const st = STATUS_STYLE[f.status];
          return (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 10,
                borderTopWidth: i > 0 ? 1 : 0,
                borderTopColor: "#222",
              }}
            >
              <Text style={{ color: "#e5e5e5", fontSize: 13, fontWeight: "600", flex: 1 }} numberOfLines={1}>{f.pair.name}</Text>
              <Text style={{ color: "#e5e5e5", fontSize: 13, fontWeight: "700", marginHorizontal: 8 }}>{f.ratio.toFixed(2)}x</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={{ color: "#666", fontSize: 14 }}>{TREND_ARROW[f.trend]}</Text>
                <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: st.bg }}>
                  <Text style={{ color: st.fg, fontSize: 11, fontWeight: "700", textTransform: "uppercase" }}>{f.status}</Text>
                </View>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}
