import { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Svg, { Rect, Ellipse, Line, Circle } from "react-native-svg";
import { MUSCLES, MUSCLE_COLORS, type Muscle } from "../../constants/muscles";

const SCREEN_WIDTH = Dimensions.get("window").width;
const MAP_WIDTH = SCREEN_WIDTH - 64;
const MAP_HEIGHT = 420;

interface MuscleRegion {
  muscle: Muscle;
  front: { cx: number; cy: number; rx: number; ry: number } | null;
  back: { cx: number; cy: number; rx: number; ry: number } | null;
}

const REGIONS: MuscleRegion[] = [
  { muscle: "Chest", front: { cx: 0.5, cy: 0.22, rx: 0.18, ry: 0.06 }, back: null },
  { muscle: "Shoulders", front: { cx: 0.32, cy: 0.17, rx: 0.07, ry: 0.04 }, back: { cx: 0.32, cy: 0.15, rx: 0.06, ry: 0.04 } },
  { muscle: "Biceps", front: { cx: 0.30, cy: 0.30, rx: 0.04, ry: 0.07 }, back: null },
  { muscle: "Triceps", front: null, back: { cx: 0.30, cy: 0.28, rx: 0.04, ry: 0.07 } },
  { muscle: "Forearms", front: { cx: 0.28, cy: 0.42, rx: 0.035, ry: 0.06 }, back: { cx: 0.28, cy: 0.42, rx: 0.035, ry: 0.06 } },
  { muscle: "Abs", front: { cx: 0.5, cy: 0.32, rx: 0.09, ry: 0.08 }, back: null },
  { muscle: "Obliques", front: { cx: 0.39, cy: 0.33, rx: 0.04, ry: 0.07 }, back: { cx: 0.39, cy: 0.33, rx: 0.04, ry: 0.07 } },
  { muscle: "Back", front: null, back: { cx: 0.5, cy: 0.25, rx: 0.14, ry: 0.10 } },
  { muscle: "Traps", front: null, back: { cx: 0.5, cy: 0.13, rx: 0.10, ry: 0.04 } },
  { muscle: "Rear Delts", front: null, back: { cx: 0.36, cy: 0.15, rx: 0.05, ry: 0.03 } },
  { muscle: "Glutes", front: null, back: { cx: 0.5, cy: 0.42, rx: 0.13, ry: 0.06 } },
  { muscle: "Quads", front: { cx: 0.44, cy: 0.53, rx: 0.06, ry: 0.12 }, back: null },
  { muscle: "Hamstrings", front: null, back: { cx: 0.5, cy: 0.53, rx: 0.09, ry: 0.10 } },
  { muscle: "Calves", front: { cx: 0.44, cy: 0.72, rx: 0.045, ry: 0.09 }, back: { cx: 0.5, cy: 0.72, rx: 0.07, ry: 0.09 } },
];

interface BodyMapProps {
  muscleData: Map<string, { weeklySets: number; hypertrophyScore: number }>;
  onSelectMuscle: (muscle: Muscle) => void;
  selectedMuscle: Muscle | null;
}

export function BodyMap({ muscleData, onSelectMuscle, selectedMuscle }: BodyMapProps) {
  const [view, setView] = useState<"front" | "back">("front");

  return (
    <View style={{ alignItems: "center" }}>
      {/* View Toggle */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
        {(["front", "back"] as const).map((v) => (
          <TouchableOpacity
            key={v}
            onPress={() => setView(v)}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: view === v ? "#3b82f6" : "#161616",
              borderWidth: 1,
              borderColor: view === v ? "#3b82f6" : "#2a2a2a",
            }}
          >
            <Text style={{ color: view === v ? "#fff" : "#888", fontSize: 13, fontWeight: "600", textTransform: "capitalize" }}>
              {v}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Body SVG */}
      <Svg width={MAP_WIDTH} height={MAP_HEIGHT} viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}>
        {/* Body outline */}
        <BodyOutline view={view} width={MAP_WIDTH} height={MAP_HEIGHT} />

        {/* Muscle regions */}
        {REGIONS.map((region) => {
          const pos = view === "front" ? region.front : region.back;
          if (!pos) return null;

          const data = muscleData.get(region.muscle);
          const intensity = data ? Math.min(data.hypertrophyScore / 100, 1) : 0;
          const baseColor = MUSCLE_COLORS[region.muscle] || "#666";
          const isSelected = selectedMuscle === region.muscle;

          return (
            <Ellipse
              key={region.muscle}
              cx={pos.cx * MAP_WIDTH}
              cy={pos.cy * MAP_HEIGHT}
              rx={pos.rx * MAP_WIDTH}
              ry={pos.ry * MAP_HEIGHT}
              fill={baseColor}
              opacity={isSelected ? 0.9 : 0.2 + intensity * 0.6}
              stroke={isSelected ? "#fff" : "transparent"}
              strokeWidth={isSelected ? 2 : 0}
              onPress={() => onSelectMuscle(region.muscle)}
            />
          );
        })}
      </Svg>
    </View>
  );
}

function BodyOutline({ view, width, height }: { view: "front" | "back"; width: number; height: number }) {
  const cx = width / 2;
  const stroke = "#333";
  const sw = 1.5;

  // Simplified body outline
  return (
    <>
      {/* Head */}
      <Circle cx={cx} cy={30} r={22} fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Neck */}
      <Line x1={cx} y1={52} x2={cx} y2={65} stroke={stroke} strokeWidth={sw} />
      {/* Torso */}
      <Rect x={cx - 45} y={65} width={90} height={120} rx={15} fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Arms */}
      <Line x1={cx - 45} y1={70} x2={cx - 65} y2={180} stroke={stroke} strokeWidth={sw} />
      <Line x1={cx + 45} y1={70} x2={cx + 65} y2={180} stroke={stroke} strokeWidth={sw} />
      {/* Hips */}
      <Rect x={cx - 35} y={185} width={70} height={30} rx={10} fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Legs */}
      <Line x1={cx - 15} y1={215} x2={cx - 20} y2={380} stroke={stroke} strokeWidth={sw} />
      <Line x1={cx + 15} y1={215} x2={cx + 20} y2={380} stroke={stroke} strokeWidth={sw} />
    </>
  );
}
