import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";

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
    <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
      <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
        Rest Timer
      </Text>

      {running ? (
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: remaining <= 10 ? "#f59e0b" : "#fff", fontSize: 48, fontWeight: "800", fontVariant: ["tabular-nums"] }}>
            {minutes}:{seconds.toString().padStart(2, "0")}
          </Text>
          <TouchableOpacity
            onPress={stop}
            style={{ marginTop: 12, backgroundColor: "#ef4444", borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10 }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Stop</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ alignItems: "center" }}>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
            {PRESETS.map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setTarget(p)}
                style={{
                  backgroundColor: target === p ? "#3b82f6" : "#1a1a1a",
                  borderRadius: 8,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: target === p ? "#3b82f6" : "#2a2a2a",
                }}
              >
                <Text style={{ color: target === p ? "#fff" : "#888", fontSize: 13, fontWeight: "600" }}>
                  {p}s
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            onPress={start}
            style={{ backgroundColor: "#22c55e", borderRadius: 10, paddingHorizontal: 32, paddingVertical: 12 }}
          >
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>Start</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
