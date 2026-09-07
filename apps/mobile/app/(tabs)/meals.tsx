import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { type ReactNode, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Modal,
  PanResponder,
  ScrollView,
  type StyleProp,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SegmentedControl } from "../../components/shared/SegmentedControl";
import { calcTDEE, fmtWeight } from "../../lib/bodyMetrics";
import { macrosForServing } from "../../lib/foodDb";
import { classifyFood } from "../../lib/foodScan";
import { useAppStore } from "../../lib/store";
import type { BodyMetrics, Meal, MealTemplate } from "../../lib/types";

function estimateTimeToTarget(
  meals: Meal[],
  metrics: BodyMetrics,
): string | null {
  if (!metrics.targetWeight || metrics.targetWeight === metrics.weight)
    return null;

  const now = Date.now();
  const TEN_DAYS = 10 * 24 * 60 * 60 * 1000;
  const recentMeals = meals.filter(
    (m) => now - new Date(m.date).getTime() <= TEN_DAYS,
  );

  if (recentMeals.length < 5) return null;

  const totalCals = recentMeals.reduce((a, m) => a + m.calories, 0);
  const firstDate = new Date(
    recentMeals[recentMeals.length - 1].date,
  ).getTime();
  const lastDate = new Date(recentMeals[0].date).getTime();
  const daySpan = Math.max(1, (lastDate - firstDate) / (24 * 60 * 60 * 1000));
  const avgDailyCals = totalCals / daySpan;

  const tdee = calcTDEE(metrics);
  const dailyDeficit = tdee - avgDailyCals;
  const weightDiff = Math.abs(metrics.targetWeight - metrics.weight);
  const calPerKg = 7700;

  if (dailyDeficit > 0 && metrics.targetWeight < metrics.weight) {
    const days = (weightDiff * calPerKg) / dailyDeficit;
    return `${Math.ceil(days)} days to lose ${weightDiff.toFixed(1)}kg`;
  }
  if (dailyDeficit < 0 && metrics.targetWeight > metrics.weight) {
    const days = (weightDiff * calPerKg) / Math.abs(dailyDeficit);
    return `${Math.ceil(days)} days to gain ${weightDiff.toFixed(1)}kg`;
  }

  return null;
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function dayLabel(d: Date): string {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const key = dayKey(d);
  if (key === dayKey(today)) return "Today";
  if (key === dayKey(yesterday)) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const REVEAL_WIDTH = 88;
const FLING_OFF = -500;

function SwipeableRow({
  onDelete,
  onPress,
  children,
  style,
}: {
  onDelete: () => void;
  onPress?: () => void;
  children: ReactNode;
  style: StyleProp<ViewStyle>;
}) {
  const translateX = useRef(new Animated.Value(0)).current;

  const close = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_e, g) =>
        Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_e, g) => {
        translateX.setValue(Math.max(FLING_OFF, Math.min(0, g.dx)));
      },
      onPanResponderRelease: (_e, g) => {
        const fullSwipe = g.dx < -REVEAL_WIDTH * 1.2 || g.vx < -0.7;
        Animated.spring(translateX, {
          toValue: fullSwipe ? FLING_OFF : g.dx < -44 ? -REVEAL_WIDTH : 0,
          useNativeDriver: true,
          bounciness: 0,
        }).start(() => {
          if (!fullSwipe) return;
          onDelete();
          setTimeout(() => {
            Animated.spring(translateX, {
              toValue: -REVEAL_WIDTH,
              useNativeDriver: true,
              bounciness: 0,
            }).start();
          }, 300);
        });
      },
    }),
  ).current;

  return (
    <View style={{ overflow: "hidden", borderRadius: 10 }}>
      <View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#ef4444",
        }}
      >
        <TouchableOpacity
          onPress={onDelete}
          activeOpacity={0.8}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: REVEAL_WIDTH,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="trash" size={22} color="#fff" />
          <Text
            style={{
              color: "#fff",
              fontSize: 11,
              fontWeight: "600",
              marginTop: 2,
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>
      <Animated.View
        {...panResponder.panHandlers}
        style={{ transform: [{ translateX }] }}
      >
        <TouchableOpacity
          onPress={() => {
            close();
            onPress?.();
          }}
          activeOpacity={0.7}
          style={style}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export default function MealsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const meals = useAppStore((s) => s.meals);
  const mealTemplates = useAppStore((s) => s.mealTemplates);
  const bodyMetrics = useAppStore((s) => s.bodyMetrics);
  const weightUnit = useAppStore((s) => s.weightUnit);
  const dailyCalorieGoal = useAppStore((s) => s.dailyCalorieGoal);
  const setDailyCalorieGoal = useAppStore((s) => s.setDailyCalorieGoal);
  const addMeal = useAppStore((s) => s.addMeal);
  const deleteMeal = useAppStore((s) => s.deleteMeal);
  const updateMeal = useAppStore((s) => s.updateMeal);
  const addMealTemplate = useAppStore((s) => s.addMealTemplate);
  const deleteMealTemplate = useAppStore((s) => s.deleteMealTemplate);

  const [view, setView] = useState<"log" | "history">("log");

  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [isScanning, setIsScanning] = useState(false);
  const [servingPer100, setServingPer100] = useState<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null>(null);
  const [servingG, setServingG] = useState("");
  const [showBarcodeScan, setShowBarcodeScan] = useState(false);
  const [camPermission, requestCamPermission] = useCameraPermissions();
  const [scanningLock, setScanningLock] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState("");

  const [editMeal, setEditMeal] = useState<Meal | null>(null);
  const [eName, setEName] = useState("");
  const [eCals, setECals] = useState("");
  const [eProtein, setEProtein] = useState("");
  const [eCarbs, setECarbs] = useState("");
  const [eFat, setEFat] = useState("");
  const [eImageUri, setEImageUri] = useState<string | undefined>();

  const latestMetrics = bodyMetrics[0] ?? null;
  const isLbs = weightUnit === "lbs";

  const timeEstimate = useMemo(
    () => (latestMetrics ? estimateTimeToTarget(meals, latestMetrics) : null),
    [meals, latestMetrics],
  );

  const tdee = latestMetrics ? Math.round(calcTDEE(latestMetrics)) : null;

  const today = dayKey(new Date());
  const todayMeals = useMemo(
    () => meals.filter((m) => dayKey(new Date(m.date)) === today),
    [meals, today],
  );
  const todayCals = todayMeals.reduce((a, m) => a + m.calories, 0);
  const todayMacros = todayMeals.reduce(
    (a, m) => ({
      p: a.p + m.protein,
      c: a.c + m.carbs,
      f: a.f + m.fat,
    }),
    { p: 0, c: 0, f: 0 },
  );

  const groupedDays = useMemo(() => {
    const map = new Map<string, Meal[]>();
    for (const m of meals) {
      const key = dayKey(new Date(m.date));
      const list = map.get(key) ?? [];
      list.push(m);
      map.set(key, list);
    }
    return [...map.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, list]) => ({
        date: new Date(`${key}T12:00:00`),
        meals: list,
      }));
  }, [meals]);

  const pickImageInto = async (
    set: (uri: string) => void,
    onAsset?: (uri: string, width: number, height: number) => void,
  ) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      set(asset.uri);
      if (onAsset && asset.width && asset.height)
        onAsset(asset.uri, asset.width, asset.height);
    }
  };

  const takePhotoInto = async (
    set: (uri: string) => void,
    onAsset?: (uri: string, width: number, height: number) => void,
  ) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera access is required to take photos.",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      set(asset.uri);
      if (onAsset && asset.width && asset.height)
        onAsset(asset.uri, asset.width, asset.height);
    }
  };

  const scanAndFill = async (uri: string, width: number, height: number) => {
    setIsScanning(true);
    try {
      const result = await classifyFood(uri, width, height);
      if (result) {
        const { info, confidence } = result;
        const macros = macrosForServing(info.label, info.defaultServingG);
        setName(info.name);
        setCalories(String(macros.calories));
        setProtein(String(macros.protein));
        setCarbs(String(macros.carbs));
        setFat(String(macros.fat));
        setServingPer100(macrosForServing(info.label, 100));
        setServingG(String(info.defaultServingG));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert(
          `Detected ${info.name}`,
          `Confidence ${Math.round(confidence * 100)}%. Values are per ${
            info.defaultServingG
          }g; edit if needed.`,
        );
      } else {
        Alert.alert(
          "No match",
          "Couldn't confidently identify that photo as a known food. You can still log it manually.",
        );
      }
    } catch (err) {
      Alert.alert(
        "Scan failed",
        err instanceof Error
          ? err.message
          : "Something went wrong while scanning.",
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleServingChange = (t: string) => {
    setServingG(t);
    if (!servingPer100) return;
    const g = parseFloat(t);
    if (g > 0) {
      const scale = g / 100;
      setCalories(String(Math.round(servingPer100.calories * scale)));
      setProtein(String(Math.round(servingPer100.protein * scale)));
      setCarbs(String(Math.round(servingPer100.carbs * scale)));
      setFat(String(Math.round(servingPer100.fat * scale)));
    } else {
      setServingPer100(null);
    }
  };

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanningLock || !data) return;
    setScanningLock(true);
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${data}.json`,
      );
      const json = await res.json();
      if (json?.status !== 1 || !json.product?.product_name) {
        Alert.alert(
          "Not found",
          `No product for barcode ${data} in Open Food Facts.`,
        );
        return;
      }
      const n = json.product.nutriments ?? {};
      const serving = json.product.serving_quantity ?? 100;
      const per100 = {
        calories: Math.round(n["energy-kcal_100g"] ?? 0),
        protein: Math.round(n.proteins_100g ?? 0),
        carbs: Math.round(n.carbohydrates_100g ?? 0),
        fat: Math.round(n.fat_100g ?? 0),
      };
      const scale = serving / 100;
      setName(json.product.product_name || `Product ${data}`);
      setCalories(String(Math.round(per100.calories * scale)));
      setProtein(String(Math.round(per100.protein * scale)));
      setCarbs(String(Math.round(per100.carbs * scale)));
      setFat(String(Math.round(per100.fat * scale)));
      setServingPer100(per100);
      setServingG(String(serving));
      setShowBarcodeScan(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      Alert.alert("Lookup failed", "Could not reach Open Food Facts.");
    } finally {
      setScanningLock(false);
    }
  };

  const saveMealEntry = async () => {
    const cals = parseInt(calories, 10) || 0;
    if (cals <= 0) {
      Alert.alert("Missing calories", "Enter at least calories.");
      return;
    }
    const meal: Meal = {
      id: `m_${Date.now()}`,
      date: new Date().toISOString(),
      name: name || `Meal ${new Date().toLocaleDateString()}`,
      calories: cals,
      protein: parseInt(protein, 10) || 0,
      carbs: parseInt(carbs, 10) || 0,
      fat: parseInt(fat, 10) || 0,
      imageUri,
    };
    await addMeal(meal);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setImageUri(undefined);
    setServingPer100(null);
    setServingG("");
  };

  const manualSet = (setter: (v: string) => void) => (v: string) => {
    setServingPer100(null);
    setter(v);
  };

  const saveAsTemplate = async () => {
    const cals = parseInt(calories, 10) || 0;
    if (cals <= 0) {
      Alert.alert("Missing calories", "Enter at least calories.");
      return;
    }
    const template: MealTemplate = {
      id: `mt_${Date.now()}`,
      name: name || "Untitled Meal",
      calories: cals,
      protein: parseInt(protein, 10) || 0,
      carbs: parseInt(carbs, 10) || 0,
      fat: parseInt(fat, 10) || 0,
    };
    await addMealTemplate(template);
    Alert.alert("Saved", "Saved for later!");
  };

  const loadTemplate = (t: MealTemplate) => {
    setName(t.name);
    setCalories(String(t.calories));
    setProtein(String(t.protein));
    setCarbs(String(t.carbs));
    setFat(String(t.fat));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const relogMeal = async (m: Meal) => {
    await addMeal({
      ...m,
      id: `m_${Date.now()}`,
      date: new Date().toISOString(),
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const openEdit = (m: Meal) => {
    setEName(m.name);
    setECals(String(m.calories));
    setEProtein(String(m.protein));
    setECarbs(String(m.carbs));
    setEFat(String(m.fat));
    setEImageUri(m.imageUri);
    setEditMeal(m);
  };

  const saveEdit = async () => {
    if (!editMeal) return;
    const cals = parseInt(eCals, 10) || 0;
    if (cals <= 0) {
      Alert.alert("Missing calories", "Enter at least calories.");
      return;
    }
    await updateMeal(editMeal.id, {
      name: eName || editMeal.name,
      calories: cals,
      protein: parseInt(eProtein, 10) || 0,
      carbs: parseInt(eCarbs, 10) || 0,
      fat: parseInt(eFat, 10) || 0,
      imageUri: eImageUri,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditMeal(null);
  };

  const confirmDeleteMeal = (m: Meal) => {
    Alert.alert("Delete meal?", m.name, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMeal(m.id),
      },
    ]);
  };

  const confirmDeleteTemplate = (t: MealTemplate) => {
    Alert.alert("Delete saved meal?", t.name, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMealTemplate(t.id),
      },
    ]);
  };

  const saveGoal = async () => {
    const g = parseInt(goalDraft, 10);
    await setDailyCalorieGoal(g > 0 ? g : null);
    setEditingGoal(false);
  };

  const progressPct = dailyCalorieGoal
    ? Math.min(100, (todayCals / dailyCalorieGoal) * 100)
    : 0;
  const barColor =
    !dailyCalorieGoal || todayCals <= dailyCalorieGoal
      ? "#22c55e"
      : todayCals <= dailyCalorieGoal * 1.1
        ? "#f59e0b"
        : "#ef4444";

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#0a0a0a" }}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 16,
          paddingBottom: 100,
          gap: 12,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>
          Meals
        </Text>

        <SegmentedControl
          options={[
            { label: "Log", value: "log" },
            { label: "History", value: "history" },
          ]}
          value={view}
          onChange={setView}
        />

        {view === "log" ? (
          <>
            {/* Today's progress */}
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
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}
                >
                  {todayCals}
                  <Text
                    style={{ color: "#888", fontSize: 14, fontWeight: "500" }}
                  >
                    {" "}
                    / {dailyCalorieGoal ?? "–"} kcal
                  </Text>
                </Text>
                {editingGoal ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <TextInput
                      value={goalDraft}
                      onChangeText={setGoalDraft}
                      keyboardType="numeric"
                      autoFocus
                      placeholder={tdee != null ? `e.g. ${tdee}` : "e.g. 2500"}
                      placeholderTextColor="#444"
                      style={{
                        backgroundColor: "#1a1a1a",
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        color: "#fff",
                        fontSize: 14,
                        minWidth: 90,
                        borderWidth: 1,
                        borderColor: "#2a2a2a",
                        textAlign: "center",
                      }}
                    />
                    <TouchableOpacity onPress={saveGoal}>
                      <Text
                        style={{
                          color: "#3b82f6",
                          fontSize: 13,
                          fontWeight: "700",
                        }}
                      >
                        OK
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setGoalDraft(
                        dailyCalorieGoal ? String(dailyCalorieGoal) : "",
                      );
                      setEditingGoal(true);
                    }}
                  >
                    <Text
                      style={{
                        color: "#3b82f6",
                        fontSize: 13,
                        fontWeight: "700",
                      }}
                    >
                      {dailyCalorieGoal ? "Edit goal" : "Set goal"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {dailyCalorieGoal ? (
                <>
                  <View
                    style={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#222",
                      marginTop: 12,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        width: `${progressPct}%`,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: barColor,
                      }}
                    />
                  </View>
                  <Text style={{ color: "#666", fontSize: 12, marginTop: 6 }}>
                    Today: P{todayMacros.p}g C{todayMacros.c}g F{todayMacros.f}g
                  </Text>
                </>
              ) : (
                <Text style={{ color: "#666", fontSize: 12, marginTop: 8 }}>
                  Set a daily calorie goal to track today's progress.
                </Text>
              )}
            </View>

            {/* Weight snapshot */}
            {latestMetrics ? (
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
                  }}
                >
                  <View>
                    <Text style={{ color: "#888", fontSize: 12 }}>Current</Text>
                    <Text
                      style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}
                    >
                      {fmtWeight(latestMetrics.weight, isLbs)}
                    </Text>
                  </View>
                  {latestMetrics.targetWeight != null && (
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ color: "#888", fontSize: 12 }}>
                        Target
                      </Text>
                      <Text
                        style={{
                          color: "#22c55e",
                          fontSize: 20,
                          fontWeight: "700",
                        }}
                      >
                        {fmtWeight(latestMetrics.targetWeight, isLbs)}
                      </Text>
                    </View>
                  )}
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ color: "#888", fontSize: 12 }}>TDEE</Text>
                    <Text
                      style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}
                    >
                      {tdee}
                    </Text>
                  </View>
                </View>
                {timeEstimate && (
                  <Text
                    style={{
                      color: "#3b82f6",
                      fontSize: 13,
                      fontWeight: "600",
                      marginTop: 8,
                      textAlign: "center",
                    }}
                  >
                    {timeEstimate}
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => router.navigate("/settings")}
                  style={{ marginTop: 10, alignItems: "center" }}
                >
                  <Text
                    style={{
                      color: "#3b82f6",
                      fontSize: 13,
                      fontWeight: "600",
                    }}
                  >
                    Update in Settings
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => router.navigate("/settings")}
                style={{
                  backgroundColor: "#161616",
                  borderRadius: 14,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#3b82f6",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#3b82f6", fontSize: 15, fontWeight: "700" }}
                >
                  Set up body metrics for calorie estimates
                </Text>
              </TouchableOpacity>
            )}

            {/* Meal form */}
            <Text
              style={{
                color: "#888",
                fontSize: 12,
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Log Meal
            </Text>

            <TextInput
              placeholder="Meal name (optional)"
              placeholderTextColor="#555"
              value={name}
              onChangeText={setName}
              style={{
                backgroundColor: "#161616",
                borderRadius: 10,
                padding: 14,
                color: "#fff",
                fontSize: 16,
                borderWidth: 1,
                borderColor: "#2a2a2a",
              }}
            />

            {servingPer100 && (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Text style={{ color: "#666", fontSize: 13, flex: 1 }}>
                  Serving
                </Text>
                <TextInput
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor="#444"
                  value={servingG}
                  onChangeText={handleServingChange}
                  style={{
                    backgroundColor: "#161616",
                    borderRadius: 10,
                    padding: 10,
                    color: "#fff",
                    fontSize: 15,
                    borderWidth: 1,
                    borderColor: "#2a2a2a",
                    width: 72,
                    textAlign: "center",
                  }}
                />
                <Text style={{ color: "#666", fontSize: 13 }}>g</Text>
              </View>
            )}

            <View style={{ flexDirection: "row", gap: 8 }}>
              {[
                {
                  label: "Cal",
                  value: calories,
                  set: manualSet(setCalories),
                  placeholder: "0",
                },
                {
                  label: "Protein",
                  value: protein,
                  set: manualSet(setProtein),
                  placeholder: "0g",
                },
                {
                  label: "Carbs",
                  value: carbs,
                  set: manualSet(setCarbs),
                  placeholder: "0g",
                },
                {
                  label: "Fat",
                  value: fat,
                  set: manualSet(setFat),
                  placeholder: "0g",
                },
              ].map((f) => (
                <View key={f.label} style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#666",
                      fontSize: 11,
                      marginBottom: 4,
                      textAlign: "center",
                    }}
                  >
                    {f.label}
                  </Text>
                  <TextInput
                    placeholder={f.placeholder}
                    placeholderTextColor="#444"
                    keyboardType="numeric"
                    value={f.value}
                    onChangeText={f.set}
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
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                onPress={() => takePhotoInto(setImageUri, scanAndFill)}
                style={{
                  flex: 1,
                  backgroundColor: "#161616",
                  borderRadius: 10,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: "#2a2a2a",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#8b5cf6", fontSize: 14, fontWeight: "600" }}
                >
                  {imageUri ? "Retake Photo" : "Take Photo"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => pickImageInto(setImageUri, scanAndFill)}
                style={{
                  flex: 1,
                  backgroundColor: "#161616",
                  borderRadius: 10,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: "#2a2a2a",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#8b5cf6", fontSize: 14, fontWeight: "600" }}
                >
                  {imageUri ? "Change Photo" : "Pick from Gallery"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setShowBarcodeScan(true)}
              style={{
                backgroundColor: "#161616",
                borderRadius: 10,
                padding: 14,
                borderWidth: 1,
                borderColor: "#2a2a2a",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#22c55e", fontSize: 14, fontWeight: "600" }}
              >
                Scan Barcode (Open Food Facts)
              </Text>
            </TouchableOpacity>

            {isScanning && (
              <Text
                style={{ color: "#8b5cf6", fontSize: 13, textAlign: "center" }}
              >
                Scanning... this happens on your device.
              </Text>
            )}

            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                style={{ width: "100%", height: 180, borderRadius: 10 }}
                resizeMode="cover"
              />
            )}

            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                onPress={saveMealEntry}
                style={{
                  flex: 2,
                  backgroundColor: "#22c55e",
                  borderRadius: 14,
                  padding: 16,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}
                >
                  Save Meal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveAsTemplate}
                style={{
                  flex: 1,
                  backgroundColor: "#161616",
                  borderRadius: 14,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#f59e0b",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#f59e0b", fontSize: 14, fontWeight: "700" }}
                >
                  Save for later
                </Text>
              </TouchableOpacity>
            </View>

            {/* Saved Meals */}
            {mealTemplates.length > 0 && (
              <>
                <Text
                  style={{
                    color: "#888",
                    fontSize: 12,
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginTop: 4,
                  }}
                >
                  Saved Meals
                </Text>
                <Text
                  style={{
                    color: "#666",
                    fontSize: 12,
                    marginBottom: 6,
                  }}
                >
                  Swipe left to reveal Delete; swipe all the way to delete.
                </Text>
                {mealTemplates.map((t) => (
                  <SwipeableRow
                    key={t.id}
                    onDelete={() => confirmDeleteTemplate(t)}
                    onPress={() => loadTemplate(t)}
                    style={{
                      backgroundColor: "#161616",
                      borderRadius: 10,
                      padding: 14,
                      borderWidth: 1,
                      borderColor: "#2a2a2a",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          color: "#e5e5e5",
                          fontSize: 15,
                          fontWeight: "600",
                        }}
                      >
                        {t.name}
                      </Text>
                      <Text
                        style={{
                          color: "#666",
                          fontSize: 12,
                          marginTop: 2,
                        }}
                      >
                        {t.calories} cal | P{t.protein} C{t.carbs} F{t.fat}
                      </Text>
                    </View>
                    <Text style={{ color: "#3b82f6", fontSize: 12 }}>Use</Text>
                  </SwipeableRow>
                ))}
              </>
            )}

            {/* Meal history */}
          </>
        ) : (
          groupedDays.length > 0 && (
            <>
              <Text
                style={{
                  color: "#888",
                  fontSize: 12,
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginTop: 4,
                }}
              >
                History
              </Text>
              <Text
                style={{
                  color: "#666",
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                Swipe left to reveal Delete; swipe all the way to delete.
              </Text>
              {groupedDays.map((day) => (
                <View key={dayKey(day.date)}>
                  <Text
                    style={{
                      color: "#999",
                      fontSize: 13,
                      fontWeight: "700",
                      marginBottom: 6,
                      marginTop: 4,
                    }}
                  >
                    {dayLabel(day.date)}
                  </Text>
                  <View style={{ gap: 6 }}>
                    {day.meals.map((m) => (
                      <SwipeableRow
                        key={m.id}
                        onDelete={() => confirmDeleteMeal(m)}
                        onPress={() => openEdit(m)}
                        style={{
                          backgroundColor: "#161616",
                          borderRadius: 10,
                          padding: 12,
                          borderWidth: 1,
                          borderColor: "#222",
                          flexDirection: "row",
                          gap: 12,
                          alignItems: "center",
                        }}
                      >
                        {m.imageUri ? (
                          <Image
                            source={{ uri: m.imageUri }}
                            style={{ width: 40, height: 40, borderRadius: 8 }}
                          />
                        ) : (
                          <View
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 8,
                              backgroundColor: "#1f1f1f",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text style={{ color: "#444", fontSize: 16 }}>
                              +
                            </Text>
                          </View>
                        )}
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              color: "#e5e5e5",
                              fontSize: 14,
                              fontWeight: "600",
                            }}
                          >
                            {m.name}
                          </Text>
                          <Text style={{ color: "#666", fontSize: 12 }}>
                            P{m.protein}g C{m.carbs}g F{m.fat}g
                          </Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 16,
                              fontWeight: "700",
                            }}
                          >
                            {m.calories}
                          </Text>
                          <Text
                            style={{
                              color: "#3b82f6",
                              fontSize: 11,
                              fontWeight: "600",
                            }}
                          >
                            tap to edit
                          </Text>
                        </View>
                      </SwipeableRow>
                    ))}
                  </View>
                </View>
              ))}
            </>
          )
        )}
      </ScrollView>

      <Modal
        visible={editMeal != null}
        animationType="slide"
        transparent
        onRequestClose={() => setEditMeal(null)}
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
              Edit Meal
            </Text>

            <TextInput
              placeholder="Meal name"
              placeholderTextColor="#555"
              value={eName}
              onChangeText={setEName}
              style={{
                backgroundColor: "#161616",
                borderRadius: 10,
                padding: 14,
                color: "#fff",
                fontSize: 16,
                borderWidth: 1,
                borderColor: "#2a2a2a",
              }}
            />

            <View style={{ flexDirection: "row", gap: 8 }}>
              {[
                { label: "Cal", value: eCals, set: setECals, placeholder: "0" },
                {
                  label: "Protein",
                  value: eProtein,
                  set: setEProtein,
                  placeholder: "0g",
                },
                {
                  label: "Carbs",
                  value: eCarbs,
                  set: setECarbs,
                  placeholder: "0g",
                },
                {
                  label: "Fat",
                  value: eFat,
                  set: setEFat,
                  placeholder: "0g",
                },
              ].map((f) => (
                <View key={f.label} style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#666",
                      fontSize: 11,
                      marginBottom: 4,
                      textAlign: "center",
                    }}
                  >
                    {f.label}
                  </Text>
                  <TextInput
                    placeholder={f.placeholder}
                    placeholderTextColor="#444"
                    keyboardType="numeric"
                    value={f.value}
                    onChangeText={f.set}
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
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                onPress={() => takePhotoInto(setEImageUri)}
                style={{
                  flex: 1,
                  backgroundColor: "#161616",
                  borderRadius: 10,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: "#2a2a2a",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#8b5cf6", fontSize: 14, fontWeight: "600" }}
                >
                  {eImageUri ? "Retake Photo" : "Take Photo"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => pickImageInto(setEImageUri)}
                style={{
                  flex: 1,
                  backgroundColor: "#161616",
                  borderRadius: 10,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: "#2a2a2a",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#8b5cf6", fontSize: 14, fontWeight: "600" }}
                >
                  {eImageUri ? "Change Photo" : "Pick from Gallery"}
                </Text>
              </TouchableOpacity>
            </View>

            {eImageUri && (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <Image
                  source={{ uri: eImageUri }}
                  style={{ width: 56, height: 56, borderRadius: 8 }}
                  resizeMode="cover"
                />
                <TouchableOpacity onPress={() => setEImageUri(undefined)}>
                  <Text
                    style={{
                      color: "#ef4444",
                      fontSize: 14,
                      fontWeight: "600",
                    }}
                  >
                    Remove photo
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
              <TouchableOpacity
                onPress={() => {
                  if (editMeal) relogMeal(editMeal);
                  setEditMeal(null);
                }}
                disabled={!editMeal}
                style={{
                  flex: 1,
                  backgroundColor: "#161616",
                  borderRadius: 14,
                  padding: 16,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#f59e0b",
                }}
              >
                <Text
                  style={{ color: "#f59e0b", fontSize: 14, fontWeight: "700" }}
                >
                  Re-log today
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveEdit}
                style={{
                  flex: 1,
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

      {/* Barcode scanner */}
      <Modal
        visible={showBarcodeScan}
        animationType="slide"
        onRequestClose={() => setShowBarcodeScan(false)}
      >
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <View
            style={{
              padding: 16,
              paddingTop: insets.top + 8,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
              Scan a barcode
            </Text>
            <TouchableOpacity onPress={() => setShowBarcodeScan(false)}>
              <Text style={{ color: "#888", fontSize: 15 }}>Close</Text>
            </TouchableOpacity>
          </View>

          {camPermission?.granted ? (
            <CameraView
              style={{ flex: 1 }}
              barcodeScannerSettings={{
                barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128"],
              }}
              onBarcodeScanned={handleBarcodeScanned}
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <Text style={{ color: "#888", fontSize: 14 }}>
                Camera access is needed to scan barcodes.
              </Text>
              <TouchableOpacity
                onPress={requestCamPermission}
                style={{
                  backgroundColor: "#3b82f6",
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Grant access
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {scanningLock && (
            <Text style={{ color: "#888", textAlign: "center", padding: 12 }}>
              Looking up product...
            </Text>
          )}
        </View>
      </Modal>
    </>
  );
}
