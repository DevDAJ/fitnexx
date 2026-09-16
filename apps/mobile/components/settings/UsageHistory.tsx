import { summarizeUsage, type UsageRecord } from "@fitnexx/ai";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

import { storage } from "../../lib/storage";
import { colors } from "../../lib/theme";
import { Card, SectionLabel } from "../shared/ui";

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
    <Card
      style={{
        gap: 12,
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
          <SectionLabel>AI Usage</SectionLabel>
          <Text
            style={{ color: colors.textSecondary, fontSize: 12, marginTop: 3 }}
          >
            Stored only on this device
          </Text>
        </View>
        {records.length ? (
          <TouchableOpacity accessibilityRole="button" onPress={clear}>
            <Text
              style={{ color: colors.danger, fontSize: 12, fontWeight: "600" }}
            >
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
            borderTopColor: colors.border,
            borderTopWidth: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: 10,
          }}
        >
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text
              numberOfLines={1}
              style={{ color: colors.text, fontSize: 13, fontWeight: "600" }}
            >
              {record.model}
            </Text>
            <Text
              style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}
            >
              {record.provider} ·{" "}
              {new Date(record.timestamp).toLocaleDateString()}
            </Text>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
            {number.format(record.totalTokens)} tokens
          </Text>
        </View>
      ))}
      {!records.length ? (
        <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
          Usage appears after your first AI suggestion.
        </Text>
      ) : null}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        backgroundColor: colors.surfaceRaised,
        borderRadius: 10,
        flex: 1,
        padding: 12,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 19, fontWeight: "700" }}>
        {value}
      </Text>
      <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}
