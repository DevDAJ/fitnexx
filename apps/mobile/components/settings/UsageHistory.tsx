import { summarizeUsage, type UsageRecord } from "@fitnexx/ai";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

import { storage } from "../../lib/storage";

const number = new Intl.NumberFormat();

export function UsageHistory() {
  const [records, setRecords] = useState<UsageRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void storage.getAIUsage().then((saved) => {
        if (active) setRecords(saved);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const summary = summarizeUsage(records);
  const clear = () =>
    Alert.alert(
      "Clear AI usage",
      "Delete the local AI usage history on this device?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await storage.saveAIUsage([]);
            setRecords([]);
          },
        },
      ],
    );

  return (
    <View
      style={{
        backgroundColor: "#161616",
        borderColor: "#222",
        borderRadius: 14,
        borderWidth: 1,
        gap: 12,
        padding: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              color: "#888",
              fontSize: 12,
              fontWeight: "600",
              letterSpacing: 0.5,
            }}
          >
            AI USAGE
          </Text>
          <Text style={{ color: "#666", fontSize: 12, marginTop: 3 }}>
            Stored only on this device
          </Text>
        </View>
        {records.length ? (
          <TouchableOpacity accessibilityRole="button" onPress={clear}>
            <Text style={{ color: "#f87171", fontSize: 12, fontWeight: "600" }}>
              Clear
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <Stat label="Calls" value={number.format(summary.calls)} />
        <Stat label="Tokens" value={number.format(summary.totalTokens)} />
      </View>

      {records.slice(0, 10).map((record) => (
        <View
          key={record.id}
          style={{
            borderTopColor: "#222",
            borderTopWidth: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: 10,
          }}
        >
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text
              numberOfLines={1}
              style={{ color: "#e5e5e5", fontSize: 13, fontWeight: "600" }}
            >
              {record.model}
            </Text>
            <Text style={{ color: "#666", fontSize: 11, marginTop: 2 }}>
              {record.provider} ·{" "}
              {new Date(record.timestamp).toLocaleDateString()}
            </Text>
          </View>
          <Text style={{ color: "#888", fontSize: 12 }}>
            {number.format(record.totalTokens)} tokens
          </Text>
        </View>
      ))}
      {!records.length ? (
        <Text style={{ color: "#666", fontSize: 13 }}>
          Usage appears after your first AI suggestion.
        </Text>
      ) : null}
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        backgroundColor: "#101010",
        borderRadius: 10,
        flex: 1,
        padding: 12,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 19, fontWeight: "700" }}>
        {value}
      </Text>
      <Text style={{ color: "#666", fontSize: 11, marginTop: 2 }}>{label}</Text>
    </View>
  );
}
