import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../lib/theme";
import { AppButton, Card, SectionLabel } from "../shared/ui";

const PRESETS = [60, 90, 120, 180];

export function RestTimer() {
  const [target, setTarget] = useState(90);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remaining]);

  const start = () => {
    setRemaining(target);
    setRunning(true);
  };

  const stop = () => {
    setRunning(false);
    setRemaining(0);
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <Card>
      <SectionLabel style={{ marginBottom: 10 }}>Rest Timer</SectionLabel>

      {running ? (
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: remaining <= 10 ? colors.warning : colors.text,
              fontSize: 48,
              fontWeight: "800",
              fontVariant: ["tabular-nums"],
            }}
          >
            {minutes}:{seconds.toString().padStart(2, "0")}
          </Text>
          <AppButton
            onPress={stop}
            variant="danger"
            style={{ marginTop: 12, minHeight: 42 }}
          >
            Stop
          </AppButton>
        </View>
      ) : (
        <View style={{ alignItems: "center" }}>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
            {PRESETS.map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setTarget(p)}
                style={{
                  backgroundColor:
                    target === p ? colors.brand : colors.surfaceRaised,
                  borderRadius: 8,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: target === p ? colors.brand : colors.border,
                }}
              >
                <Text
                  style={{
                    color: target === p ? colors.onBrand : colors.textSecondary,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {p}s
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <AppButton
            onPress={start}
            style={{
              backgroundColor: colors.success,
              borderColor: colors.success,
              minHeight: 44,
            }}
          >
            Start
          </AppButton>
        </View>
      )}
    </Card>
  );
}
