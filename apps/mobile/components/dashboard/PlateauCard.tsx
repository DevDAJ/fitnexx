import { Text, View } from "react-native";
import { colors } from "../../lib/theme";
import type { PlateauInfo } from "../../lib/types";
import { Badge } from "../shared/Badge";
import { Card, SectionLabel } from "../shared/ui";

export function PlateauCard({ plateaus }: { plateaus: PlateauInfo[] }) {
  if (plateaus.length === 0) {
    return (
      <Card>
        <SectionLabel>Plateaus</SectionLabel>
        <Text style={{ color: colors.success, fontSize: 15, marginTop: 10 }}>
          No plateaus detected. Keep progressing!
        </Text>
      </Card>
    );
  }

  return (
    <Card>
      <SectionLabel style={{ marginBottom: 12 }}>Plateaus</SectionLabel>
      {plateaus.slice(0, 5).map((p, i) => (
        <View
          key={p.exerciseName}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 10,
            borderTopWidth: i > 0 ? 1 : 0,
            borderTopColor: colors.border,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{ color: colors.text, fontSize: 14, fontWeight: "600" }}
            >
              {p.exerciseName}
            </Text>
            <Text
              style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}
            >
              Stuck for {p.sessionsSinceProgress} sessions
            </Text>
          </View>
          <Badge
            label={p.status === "static" ? "Static" : "Plateau"}
            variant="plateau"
          />
        </View>
      ))}
    </Card>
  );
}
