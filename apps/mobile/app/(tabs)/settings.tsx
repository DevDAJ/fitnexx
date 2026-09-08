import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AISettingsCard } from "../../components/settings/AISettingsCard";
import { ProCard } from "../../components/settings/ProCard";
import { UsageHistory } from "../../components/settings/UsageHistory";
import { LineChart } from "../../components/shared/Sparkline";
import { SyncSheet } from "../../components/sync/SyncSheet";
import { clearAIKeys } from "../../lib/ai";
import { ACTIVITY_LEVELS, fmtWeight } from "../../lib/bodyMetrics";
import { clearCache } from "../../lib/computationCache";
import { exportData, importData } from "../../lib/export";
import { useAppStore } from "../../lib/store";
import { createNewSyncGroup } from "../../lib/sync";
import type {
  BodyMetrics,
  HabitReminder,
  MetricsReminder,
  WeightUnit,
} from "../../lib/types";

const DEFAULT_REMINDER: MetricsReminder = {
  enabled: false,
  frequency: "daily",
  weekday: 1,
  hour: 8,
  minute: 0,
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function fmtTime(hour: number, minute: number): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? "AM" : "PM";
  return `${h12}:${String(minute).padStart(2, "0")} ${ampm}`;
}

function StepButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#1a1a1a",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#2a2a2a",
      }}
    >
      <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function TimeStepper({
  hour,
  minute,
  onChange,
}: {
  hour: number;
  minute: number;
  onChange: (hour: number, minute: number) => void;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <StepButton
        label="-"
        onPress={() => onChange((hour + 23) % 24, minute)}
      />
      <Text
        style={{
          color: "#fff",
          fontSize: 22,
          fontWeight: "700",
          flex: 1,
          textAlign: "center",
        }}
      >
        {fmtTime(hour, minute)}
      </Text>
      <StepButton label="+" onPress={() => onChange((hour + 1) % 24, minute)} />
      <View style={{ width: 2, height: 26, backgroundColor: "#222" }} />
      <StepButton
        label="-"
        onPress={() => onChange(hour, (minute + 55) % 60)}
      />
      <Text
        style={{
          color: "#fff",
          fontSize: 22,
          fontWeight: "700",
          flex: 1,
          textAlign: "center",
        }}
      >
        {String(minute).padStart(2, "0")}
      </Text>
      <StepButton label="+" onPress={() => onChange(hour, (minute + 5) % 60)} />
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const weightUnit = useAppStore((s) => s.weightUnit);
  const setWeightUnit = useAppStore((s) => s.setWeightUnit);
  const bodyMetrics = useAppStore((s) => s.bodyMetrics);
  const addBodyMetrics = useAppStore((s) => s.addBodyMetrics);
  const metricsReminder = useAppStore((s) => s.metricsReminder);
  const setMetricsReminder = useAppStore((s) => s.setMetricsReminder);
  const habitReminders = useAppStore((s) => s.habitReminders);
  const setHabitReminders = useAppStore((s) => s.setHabitReminders);

  const isLbs = weightUnit === "lbs";
  const latest = bodyMetrics[0] ?? null;

  const [showMetrics, setShowMetrics] = useState(false);
  const [mWeight, setMWeight] = useState("");
  const [mHeight, setMHeight] = useState("");
  const [mBodyFat, setMBodyFat] = useState("");
  const [mAge, setMAge] = useState("");
  const [mSex, setMSex] = useState<"male" | "female">("male");
  const [mActivity, setMActivity] =
    useState<BodyMetrics["activityLevel"]>("moderate");
  const [mTarget, setMTarget] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSync, setShowSync] = useState(false);

  const reminder = metricsReminder ?? DEFAULT_REMINDER;

  const openMetricsSheet = () => {
    const base = latest;
    setMWeight(
      base ? String(Math.round(base.weight * (isLbs ? 2.20462 : 1))) : "",
    );
    setMHeight(base ? String(base.height) : "");
    setMBodyFat(base?.bodyFat != null ? String(base.bodyFat) : "");
    setMAge(base ? String(base.age) : "");
    setMSex(base?.sex ?? "male");
    setMActivity(base?.activityLevel ?? "moderate");
    setMTarget(base?.targetWeight != null ? String(base.targetWeight) : "");
    setShowMetrics(true);
  };

  const saveBodyMetricsEntry = async () => {
    const w = parseFloat(mWeight);
    const h = parseFloat(mHeight);
    const age = parseInt(mAge, 10);
    if (!w || !h || !age) {
      Alert.alert("Missing data", "Enter weight, height, and age.");
      return;
    }
    const kg = isLbs ? w / 2.20462 : w;
    const metrics: BodyMetrics = {
      date: new Date().toISOString(),
      weight: kg,
      height: h,
      bodyFat: parseFloat(mBodyFat) || undefined,
      age,
      sex: mSex,
      targetWeight: parseFloat(mTarget) || undefined,
      activityLevel: mActivity,
    };
    await addBodyMetrics(metrics);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowMetrics(false);
  };

  const updateReminder = async (next: MetricsReminder, announce: boolean) => {
    setSaving(true);
    try {
      await setMetricsReminder(next);
      if (announce) {
        if (next.enabled) {
          Alert.alert(
            "Reminder set",
            `Fitnexx will remind you ${next.frequency}ly at ${fmtTime(next.hour, next.minute)}.`,
          );
        } else {
          Alert.alert("Reminder off", "Your metrics reminder is turned off.");
        }
      }
    } catch {
      Alert.alert(
        "Notifications disabled",
        "Enable notifications for Fitnexx in your system settings to use reminders.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSetWeightUnit = async (unit: WeightUnit) => {
    await setWeightUnit(unit);
    clearCache();
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
            await clearAIKeys();
            await createNewSyncGroup();
            clearCache();
            useAppStore.getState().loadAll();
            Alert.alert("Done", "All data cleared.");
          },
        },
      ],
    );
  };

  const handleExport = async () => {
    try {
      await exportData();
    } catch (err) {
      Alert.alert(
        "Export failed",
        err instanceof Error ? err.message : "Could not create the export.",
      );
    }
  };

  const confirmImport = () => {
    Alert.alert(
      "Import Data",
      "This replaces all data on this device with the contents of the backup file.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Import",
          style: "destructive",
          onPress: async () => {
            try {
              await importData();
              Alert.alert("Done", "Data restored from backup.");
            } catch (err) {
              Alert.alert(
                "Import failed",
                err instanceof Error
                  ? err.message
                  : "The file could not be read.",
              );
            }
          },
        },
      ],
    );
  };

  const weightSeries = useMemo(
    () =>
      [...bodyMetrics]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((m) => m.weight),
    [bodyMetrics],
  );

  const updateHabit = async (
    key: "training" | "mealLog",
    next: HabitReminder,
    announce: boolean,
  ) => {
    setSaving(true);
    try {
      await setHabitReminders({ ...habitReminders, [key]: next });
      if (announce) {
        if (next.enabled) {
          Alert.alert(
            "Reminder set",
            `Fitnexx will remind you to ${
              key === "training" ? "log workouts on training days" : "log meals"
            } at ${fmtTime(next.hour, next.minute)}.`,
          );
        } else {
          Alert.alert("Reminder off", "That reminder is turned off.");
        }
      }
    } catch {
      Alert.alert(
        "Notifications disabled",
        "Enable notifications for Fitnexx in your system settings to use reminders.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1, backgroundColor: "#0a0a0a" }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 16,
        paddingBottom: 100,
        gap: 12,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>
        Settings
      </Text>

      {/* Profile & Body Metrics */}
      <View
        style={{
          backgroundColor: "#161616",
          borderRadius: 14,
          padding: 16,
          borderWidth: 1,
          borderColor: "#222",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              color: "#888",
              fontSize: 12,
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Profile & Body Metrics
          </Text>
          <TouchableOpacity onPress={openMetricsSheet} disabled={saving}>
            <Text style={{ color: "#3b82f6", fontSize: 13, fontWeight: "700" }}>
              {latest ? "Update" : "+ Add"}
            </Text>
          </TouchableOpacity>
        </View>
        {latest ? (
          <View style={{ gap: 8 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <Text style={{ color: "#888", fontSize: 11 }}>Current</Text>
                <Text
                  style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}
                >
                  {fmtWeight(latest.weight, isLbs)}
                </Text>
              </View>
              {latest.targetWeight != null && (
                <View style={{ alignItems: "center" }}>
                  <Text style={{ color: "#888", fontSize: 11 }}>Goal</Text>
                  <Text
                    style={{
                      color: "#22c55e",
                      fontSize: 20,
                      fontWeight: "700",
                    }}
                  >
                    {fmtWeight(latest.targetWeight, isLbs)}
                  </Text>
                </View>
              )}
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ color: "#888", fontSize: 11 }}>Height</Text>
                <Text
                  style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}
                >
                  {latest.height}cm
                </Text>
              </View>
            </View>
            <Text style={{ color: "#666", fontSize: 12 }}>
              {latest.bodyFat != null && `${latest.bodyFat}% BF | `}
              {latest.age} yrs | {latest.sex === "male" ? "Male" : "Female"} |{" "}
              {
                ACTIVITY_LEVELS.find((l) => l.key === latest.activityLevel)
                  ?.label
              }
            </Text>
          </View>
        ) : (
          <Text style={{ color: "#666", fontSize: 13 }}>
            Add your weight, height, and activity level to get BMR & calorie
            estimates on Meals.
          </Text>
        )}

        {bodyMetrics.length > 0 && (
          <>
            <Text
              style={{
                color: "#888",
                fontSize: 11,
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginTop: 14,
                marginBottom: 6,
              }}
            >
              Weight History
            </Text>
            {weightSeries.length >= 2 && (
              <View style={{ alignItems: "center", marginVertical: 8 }}>
                <LineChart
                  data={weightSeries}
                  color="#22c55e"
                  width={300}
                  height={80}
                />
              </View>
            )}
            {bodyMetrics.slice(0, 6).map((m, i) => (
              <View
                key={`${m.date}-${i}`}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 6,
                  borderTopWidth: i > 0 ? 1 : 0,
                  borderTopColor: "#222",
                }}
              >
                <Text
                  style={{ color: "#e5e5e5", fontSize: 14, fontWeight: "600" }}
                >
                  {fmtWeight(m.weight, isLbs)}
                </Text>
                <Text style={{ color: "#888", fontSize: 12 }}>
                  {new Date(m.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>
            ))}
          </>
        )}
      </View>

      {/* Metrics Reminder */}
      <View
        style={{
          backgroundColor: "#161616",
          borderRadius: 14,
          padding: 16,
          borderWidth: 1,
          borderColor: "#222",
        }}
      >
        <Text
          style={{
            color: "#888",
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 10,
          }}
        >
          Metrics Reminder
        </Text>
        <TouchableOpacity
          onPress={() =>
            updateReminder({ ...reminder, enabled: !reminder.enabled }, true)
          }
          disabled={saving}
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 10,
            padding: 14,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderWidth: 1,
            borderColor: reminder.enabled ? "#3b82f6" : "#2a2a2a",
          }}
        >
          <Text style={{ color: "#e5e5e5", fontSize: 15, fontWeight: "600" }}>
            {reminder.enabled ? "Reminder on" : "Reminder off"}
          </Text>
          <View
            style={{
              width: 44,
              height: 26,
              borderRadius: 13,
              backgroundColor: reminder.enabled ? "#3b82f6" : "#333",
              justifyContent: "center",
              paddingHorizontal: 4,
            }}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: "#fff",
                alignSelf: reminder.enabled ? "flex-end" : "flex-start",
              }}
            />
          </View>
        </TouchableOpacity>

        {reminder.enabled && (
          <>
            <Text
              style={{
                color: "#888",
                fontSize: 11,
                marginTop: 12,
                marginBottom: 6,
              }}
            >
              FREQUENCY
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {(["daily", "weekly"] as const).map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() =>
                    updateReminder({ ...reminder, frequency: f }, false)
                  }
                  disabled={saving}
                  style={{
                    flex: 1,
                    backgroundColor:
                      reminder.frequency === f ? "#3b82f6" : "#1a1a1a",
                    borderRadius: 10,
                    padding: 12,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor:
                      reminder.frequency === f ? "#3b82f6" : "#2a2a2a",
                  }}
                >
                  <Text
                    style={{
                      color: reminder.frequency === f ? "#fff" : "#888",
                      fontSize: 14,
                      fontWeight: "600",
                    }}
                  >
                    {f === "daily" ? "Daily" : "Weekly"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {reminder.frequency === "weekly" && (
              <>
                <Text
                  style={{
                    color: "#888",
                    fontSize: 11,
                    marginTop: 12,
                    marginBottom: 6,
                  }}
                >
                  DAY
                </Text>
                <View style={{ flexDirection: "row", gap: 6 }}>
                  {WEEKDAYS.map((label, i) => (
                    <TouchableOpacity
                      key={label}
                      onPress={() =>
                        updateReminder({ ...reminder, weekday: i + 1 }, false)
                      }
                      disabled={saving}
                      style={{
                        flex: 1,
                        backgroundColor:
                          reminder.weekday === i + 1 ? "#3b82f6" : "#1a1a1a",
                        borderRadius: 8,
                        paddingVertical: 8,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor:
                          reminder.weekday === i + 1 ? "#3b82f6" : "#2a2a2a",
                      }}
                    >
                      <Text
                        style={{
                          color: reminder.weekday === i + 1 ? "#fff" : "#888",
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <Text
              style={{
                color: "#888",
                fontSize: 11,
                marginTop: 12,
                marginBottom: 6,
              }}
            >
              TIME
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <TouchableOpacity
                onPress={() => {
                  const h = (reminder.hour + 23) % 24;
                  updateReminder({ ...reminder, hour: h }, false);
                }}
                disabled={saving}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: "#1a1a1a",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "#2a2a2a",
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}
                >
                  -
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 22,
                  fontWeight: "700",
                  flex: 1,
                  textAlign: "center",
                }}
              >
                {fmtTime(reminder.hour, reminder.minute)}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  const h = (reminder.hour + 1) % 24;
                  updateReminder({ ...reminder, hour: h }, false);
                }}
                disabled={saving}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: "#1a1a1a",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "#2a2a2a",
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}
                >
                  +
                </Text>
              </TouchableOpacity>
              <View style={{ width: 2, height: 26, backgroundColor: "#222" }} />
              <TouchableOpacity
                onPress={() => {
                  const m = (reminder.minute + 55) % 60;
                  updateReminder({ ...reminder, minute: m }, false);
                }}
                disabled={saving}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: "#1a1a1a",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "#2a2a2a",
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}
                >
                  -
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 22,
                  fontWeight: "700",
                  flex: 1,
                  textAlign: "center",
                }}
              >
                {String(reminder.minute).padStart(2, "0")}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  const m = (reminder.minute + 5) % 60;
                  updateReminder({ ...reminder, minute: m }, false);
                }}
                disabled={saving}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: "#1a1a1a",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "#2a2a2a",
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Habit Reminders */}
      <View
        style={{
          backgroundColor: "#161616",
          borderRadius: 14,
          padding: 16,
          borderWidth: 1,
          borderColor: "#222",
        }}
      >
        <Text
          style={{
            color: "#888",
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 12,
          }}
        >
          Reminders
        </Text>

        {(["training", "mealLog"] as const).map((key, i) => {
          const hr = habitReminders[key];
          return (
            <View
              key={key}
              style={{
                marginBottom: i === 0 ? 14 : 0,
                paddingBottom: i === 0 ? 14 : 0,
                borderBottomWidth: i === 0 ? 1 : 0,
                borderBottomColor: "#222",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  updateHabit(key, { ...hr, enabled: !hr.enabled }, true)
                }
                disabled={saving}
                style={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: 10,
                  padding: 14,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: hr.enabled ? "#3b82f6" : "#2a2a2a",
                }}
              >
                <Text
                  style={{ color: "#e5e5e5", fontSize: 15, fontWeight: "600" }}
                >
                  {key === "training"
                    ? "Training day reminder"
                    : "Evening meal log"}
                </Text>
                <View
                  style={{
                    width: 44,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: hr.enabled ? "#3b82f6" : "#333",
                    justifyContent: "center",
                    paddingHorizontal: 4,
                  }}
                >
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      backgroundColor: "#fff",
                      alignSelf: hr.enabled ? "flex-end" : "flex-start",
                    }}
                  />
                </View>
              </TouchableOpacity>

              {hr.enabled && (
                <>
                  <Text
                    style={{
                      color: "#888",
                      fontSize: 11,
                      marginTop: 12,
                      marginBottom: 6,
                    }}
                  >
                    {key === "training"
                      ? "FIRES ON YOUR SCHEDULE DAYS, OR DAILY IF NO SCHEDULE"
                      : "TIME"}
                  </Text>
                  <TimeStepper
                    hour={hr.hour}
                    minute={hr.minute}
                    onChange={(hour, minute) =>
                      updateHabit(key, { ...hr, hour, minute }, false)
                    }
                  />
                </>
              )}
            </View>
          );
        })}
      </View>

      <View
        style={{
          backgroundColor: "#161616",
          borderRadius: 14,
          padding: 16,
          borderWidth: 1,
          borderColor: "#222",
        }}
      >
        <Text
          style={{
            color: "#888",
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 4,
          }}
        >
          Local Sync
        </Text>
        <Text style={{ color: "#666", fontSize: 13, marginBottom: 12 }}>
          Sync directly with Fitnexx apps using the same token on your Wi-Fi.
        </Text>
        <TouchableOpacity
          onPress={() => setShowSync(true)}
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 10,
            padding: 14,
            borderWidth: 1,
            borderColor: "#3b82f6",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#3b82f6", fontSize: 15, fontWeight: "700" }}>
            Pair or sync apps
          </Text>
        </TouchableOpacity>
      </View>

      <AISettingsCard />
      <UsageHistory />

      <ProCard />

      <View
        style={{
          backgroundColor: "#161616",
          borderRadius: 14,
          padding: 16,
          borderWidth: 1,
          borderColor: "#222",
        }}
      >
        <Text
          style={{
            color: "#888",
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 12,
          }}
        >
          Weight Unit
        </Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(["kg", "lbs"] as WeightUnit[]).map((unit) => (
            <TouchableOpacity
              key={unit}
              onPress={() => handleSetWeightUnit(unit)}
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

      <View
        style={{
          backgroundColor: "#161616",
          borderRadius: 14,
          padding: 16,
          borderWidth: 1,
          borderColor: "#222",
        }}
      >
        <Text
          style={{
            color: "#888",
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 12,
          }}
        >
          Data
        </Text>
        <TouchableOpacity
          onPress={handleExport}
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 10,
            padding: 14,
            borderWidth: 1,
            borderColor: "#2a2a2a",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "#3b82f6", fontSize: 15, fontWeight: "600" }}>
            Export Data (JSON)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={confirmImport}
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 10,
            padding: 14,
            borderWidth: 1,
            borderColor: "#2a2a2a",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ color: "#3b82f6", fontSize: 15, fontWeight: "600" }}>
            Import Data
          </Text>
        </TouchableOpacity>
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

      <View
        style={{
          backgroundColor: "#161616",
          borderRadius: 14,
          padding: 16,
          borderWidth: 1,
          borderColor: "#222",
        }}
      >
        <Text
          style={{
            color: "#888",
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 8,
          }}
        >
          About
        </Text>
        <Text style={{ color: "#e5e5e5", fontSize: 15, fontWeight: "700" }}>
          Fitnexx
        </Text>
        <Text style={{ color: "#666", fontSize: 13, marginTop: 2 }}>
          Privacy-first gym performance tracker.
        </Text>
        <Text style={{ color: "#555", fontSize: 12, marginTop: 8 }}>
          Fitness data stays local. AI sends only the context you choose to your
          selected provider.
        </Text>
      </View>

      {/* Body metrics modal */}
      <Modal
        visible={showMetrics}
        animationType="slide"
        transparent
        onRequestClose={() => setShowMetrics(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000cc",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#111",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              paddingBottom: insets.bottom + 20,
              gap: 12,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }}>
              Body Metrics
            </Text>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#666", fontSize: 11, marginBottom: 4 }}>
                  Weight ({isLbs ? "lbs" : "kg"})
                </Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder={isLbs ? "154" : "70"}
                  placeholderTextColor="#444"
                  value={mWeight}
                  onChangeText={setMWeight}
                  style={{
                    backgroundColor: "#161616",
                    borderRadius: 10,
                    padding: 12,
                    color: "#fff",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#2a2a2a",
                    textAlign: "center",
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#666", fontSize: 11, marginBottom: 4 }}>
                  Height (cm)
                </Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="175"
                  placeholderTextColor="#444"
                  value={mHeight}
                  onChangeText={setMHeight}
                  style={{
                    backgroundColor: "#161616",
                    borderRadius: 10,
                    padding: 12,
                    color: "#fff",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#2a2a2a",
                    textAlign: "center",
                  }}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#666", fontSize: 11, marginBottom: 4 }}>
                  Body Fat %
                </Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="optional"
                  placeholderTextColor="#444"
                  value={mBodyFat}
                  onChangeText={setMBodyFat}
                  style={{
                    backgroundColor: "#161616",
                    borderRadius: 10,
                    padding: 12,
                    color: "#fff",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#2a2a2a",
                    textAlign: "center",
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#666", fontSize: 11, marginBottom: 4 }}>
                  Age
                </Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="25"
                  placeholderTextColor="#444"
                  value={mAge}
                  onChangeText={setMAge}
                  style={{
                    backgroundColor: "#161616",
                    borderRadius: 10,
                    padding: 12,
                    color: "#fff",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#2a2a2a",
                    textAlign: "center",
                  }}
                />
              </View>
            </View>

            <View>
              <Text style={{ color: "#666", fontSize: 11, marginBottom: 6 }}>
                Sex
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {(["male", "female"] as const).map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setMSex(s)}
                    style={{
                      flex: 1,
                      backgroundColor: mSex === s ? "#3b82f6" : "#161616",
                      borderRadius: 10,
                      padding: 12,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: mSex === s ? "#3b82f6" : "#2a2a2a",
                    }}
                  >
                    <Text
                      style={{
                        color: mSex === s ? "#fff" : "#888",
                        fontSize: 14,
                        fontWeight: "600",
                      }}
                    >
                      {s === "male" ? "Male" : "Female"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text style={{ color: "#666", fontSize: 11, marginBottom: 6 }}>
                Activity Level
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {ACTIVITY_LEVELS.map((l) => (
                  <TouchableOpacity
                    key={l.key}
                    onPress={() => setMActivity(l.key)}
                    style={{
                      backgroundColor:
                        mActivity === l.key ? "#3b82f6" : "#161616",
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderWidth: 1,
                      borderColor: mActivity === l.key ? "#3b82f6" : "#2a2a2a",
                    }}
                  >
                    <Text
                      style={{
                        color: mActivity === l.key ? "#fff" : "#888",
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      {l.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text style={{ color: "#666", fontSize: 11, marginBottom: 4 }}>
                Target Weight ({isLbs ? "lbs" : "kg"})
              </Text>
              <TextInput
                keyboardType="numeric"
                placeholder="optional"
                placeholderTextColor="#444"
                value={mTarget}
                onChangeText={setMTarget}
                style={{
                  backgroundColor: "#161616",
                  borderRadius: 10,
                  padding: 12,
                  color: "#fff",
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: "#2a2a2a",
                }}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
              <TouchableOpacity
                onPress={() => setShowMetrics(false)}
                disabled={saving}
                style={{
                  flex: 1,
                  backgroundColor: "#222",
                  borderRadius: 14,
                  padding: 16,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#888", fontSize: 16, fontWeight: "600" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveBodyMetricsEntry}
                disabled={saving}
                style={{
                  flex: 2,
                  backgroundColor: "#3b82f6",
                  borderRadius: 14,
                  padding: 16,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <SyncSheet visible={showSync} onClose={() => setShowSync(false)} />
    </ScrollView>
  );
}
