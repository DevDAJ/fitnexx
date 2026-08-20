import { View, Text } from "react-native";
import type { PlateauInfo } from "../../lib/types";
import { Badge } from "../shared/Badge";

export function PlateauCard({ plateaus }: { plateaus: PlateauInfo[] }) {
  if (plateaus.length === 0) {
    return (
      <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
        <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 }}>
          Plateaus
        </Text>
        <Text style={{ color: "#22c55e", fontSize: 15, marginTop: 10 }}>
          No plateaus detected. Keep progressing!
        </Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
      <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
        Plateaus
      </Text>
      {plateaus.slice(0, 5).map((p, i) => (
        <View
          key={p.exerciseName}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 10,
            borderTopWidth: i > 0 ? 1 : 0,
            borderTopColor: "#222",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#e5e5e5", fontSize: 14, fontWeight: "600" }}>
              {p.exerciseName}
            </Text>
            <Text style={{ color: "#666", fontSize: 12, marginTop: 2 }}>
              Stuck for {p.sessionsSinceProgress} sessions
            </Text>
          </View>
          <Badge
            label={p.status === "static" ? "Static" : "Plateau"}
            variant="plateau"
          />
        </View>
      ))}
    </View>
  );
}
