import { useState, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storage } from "../../lib/storage";
import type { WeightUnit } from "../../lib/types";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [weightUnit, setWeightUnitState] = useState<WeightUnit>("kg");

  useEffect(() => {
    storage.getWeightUnit().then(setWeightUnitState);
  }, []);

  const setWeightUnit = async (unit: WeightUnit) => {
    await storage.setWeightUnit(unit);
    setWeightUnitState(unit);
  };

  const clearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all workouts, templates, and settings. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert("Done", "All data cleared.");
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0a0a0a" }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 16,
        paddingBottom: 100,
        gap: 12,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>Settings</Text>

      <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
        <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
          Weight Unit
        </Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(["kg", "lbs"] as WeightUnit[]).map((unit) => (
            <TouchableOpacity
              key={unit}
              onPress={() => setWeightUnit(unit)}
              style={{
                flex: 1,
                backgroundColor: weightUnit === unit ? "#3b82f6" : "#1a1a1a",
                borderRadius: 10,
                padding: 14,
                alignItems: "center",
                borderWidth: 1,
                borderColor: weightUnit === unit ? "#3b82f6" : "#2a2a2a",
              }}
            >
              <Text
                style={{
                  color: weightUnit === unit ? "#fff" : "#888",
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                {unit.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
        <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
          Data
        </Text>
        <TouchableOpacity
          onPress={clearAllData}
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 10,
            padding: 14,
            borderWidth: 1,
            borderColor: "#ef4444",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#ef4444", fontSize: 15, fontWeight: "600" }}>
            Clear All Data
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
        <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
          About
        </Text>
        <Text style={{ color: "#e5e5e5", fontSize: 15, fontWeight: "700" }}>Fitnexx</Text>
        <Text style={{ color: "#666", fontSize: 13, marginTop: 2 }}>
          Privacy-first gym performance tracker.
        </Text>
        <Text style={{ color: "#555", fontSize: 12, marginTop: 8 }}>
          All data is stored locally on your device. Nothing is sent to any server.
        </Text>
      </View>
    </ScrollView>
  );
}
