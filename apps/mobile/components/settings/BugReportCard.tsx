import { useState } from "react";
import { Alert, Modal, Platform, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { requireSupabase } from "../../lib/supabase";
import { colors, spacing } from "../../lib/theme";
import { AppButton, AppTextInput, Card, SectionLabel } from "../shared/ui";

export function BugReportCard() {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    const trimmed = description.trim();
    if (trimmed.length < 10 || trimmed.length > 8000) {
      Alert.alert(
        "Describe the bug",
        "Please describe the bug (10 to 8,000 characters).",
      );
      return;
    }
    setSending(true);
    try {
      const { error } = await requireSupabase()
        .from("bug_report")
        .insert({
          description: trimmed,
          platform: "mobile",
          browser: null,
          os: `${Platform.OS} ${String(Platform.Version)}`,
          url: null,
        });
      if (error) throw error;
      setDescription("");
      setOpen(false);
      Alert.alert("Thanks", "Your report is in. We'll take a look.");
    } catch (err) {
      Alert.alert(
        "Could not send",
        err instanceof Error ? err.message : "Please try again later.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Card>
        <SectionLabel style={{ marginBottom: 4 }}>Support</SectionLabel>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 13,
            marginBottom: 12,
          }}
        >
          Found something broken? Tell us and we&apos;ll take a look.
        </Text>
        <AppButton variant="secondary" onPress={() => setOpen(true)}>
          Report a Bug
        </AppButton>
      </Card>

      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={() => setOpen(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.overlay,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: colors.surfaceRaised,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              paddingBottom: insets.bottom + 20,
              gap: spacing.md,
            }}
          >
            <Text
              style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}
            >
              Report a Bug
            </Text>
            <AppTextInput
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholder="What happened, and what did you expect instead?"
              value={description}
              onChangeText={setDescription}
              maxLength={8000}
              style={{ minHeight: 120 }}
            />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <AppButton
                variant="secondary"
                onPress={() => setOpen(false)}
                disabled={sending}
                style={{ flex: 1 }}
              >
                Cancel
              </AppButton>
              <AppButton
                onPress={submit}
                disabled={sending}
                style={{ flex: 2 }}
              >
                {sending ? "Sending…" : "Send report"}
              </AppButton>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
