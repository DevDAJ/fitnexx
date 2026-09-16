import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "../../components/shared/Badge";
import { Card, ScreenTitle, SectionLabel } from "../../components/shared/ui";
import { analyzeExerciseTrend } from "../../lib/analysis/exerciseTrend";
import { detectPlateaus } from "../../lib/analysis/plateauDetection";
import { detectPrematurePrs } from "../../lib/analysis/prematurePr";
import {
  getPlateauAdvice,
  getSetCommentary,
} from "../../lib/analysis/setCommentary";
import { getRemoteExerciseByName } from "../../lib/exerciseDatabase";
import { useAppStore } from "../../lib/store";
import { colors, radii, spacing } from "../../lib/theme";
import type { ExerciseAsset } from "../../lib/types";

const TREND_COLORS: Record<string, string> = {
  overload: colors.success,
  stagnant: colors.warning,
  regression: colors.danger,
  new: colors.brand,
};

export default function ExerciseDetailScreen() {
  const insets = useSafeAreaInsets();
  const { name } = useLocalSearchParams<{ name: string }>();
  const workouts = useAppStore((s) => s.workouts);
  const exerciseName = decodeURIComponent(name ?? "");

  const trend = useMemo(
    () => analyzeExerciseTrend(exerciseName, workouts),
    [exerciseName, workouts],
  );

  const commentaries = useMemo(
    () => getSetCommentary(workouts, exerciseName),
    [workouts, exerciseName],
  );

  const plateaus = useMemo(
    () =>
      detectPlateaus(workouts).filter((p) => p.exerciseName === exerciseName),
    [workouts, exerciseName],
  );

  const [asset, setAsset] = useState<ExerciseAsset | undefined>(undefined);

  useEffect(() => {
    let active = true;
    if (!exerciseName) return;
    getRemoteExerciseByName(exerciseName).then((a) => {
      if (active) setAsset(a);
    });
    return () => {
      active = false;
    };
  }, [exerciseName]);

  const premature = useMemo(
    () =>
      detectPrematurePrs(workouts).find((p) => p.exerciseName === exerciseName),
    [workouts, exerciseName],
  );

  const sessionHistory = useMemo(() => {
    const sorted = [...workouts].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return sorted
      .map((w) => {
        const ex = w.exercises.find((e) => e.exerciseName === exerciseName);
        if (!ex) return null;
        const working = ex.sets.filter((s) => s.setType !== "warmup");
        if (working.length === 0) return null;

        const totalVolume = working.reduce((a, s) => a + s.weight * s.reps, 0);
        const maxWeight = Math.max(...working.map((s) => s.weight));
        const prCount = working.filter((s) => s.isPr).length;

        return {
          id: w.id,
          date: w.date,
          sets: working.length,
          totalVolume,
          maxWeight,
          prCount,
          sets_detail: working,
        };
      })
      .filter(Boolean)
      .reverse();
  }, [workouts, exerciseName]);

  const trendColor = TREND_COLORS[trend.status] ?? colors.textMuted;
  const trendLabel =
    trend.status.charAt(0).toUpperCase() + trend.status.slice(1);
  const plateau = plateaus[0];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: spacing.screen,
        paddingBottom: 100,
        gap: 12,
      }}
    >
      <ScreenTitle style={{ fontSize: 22 }}>{exerciseName}</ScreenTitle>

      {asset?.gifUrl ? (
        <Image
          source={{ uri: asset.gifUrl }}
          style={{
            width: "100%",
            height: 200,
            borderRadius: radii.lg,
            backgroundColor: colors.surface,
          }}
          resizeMode="cover"
        />
      ) : null}

      {/* Premature PR Alert */}
      {premature && (
        <Card style={{ borderColor: colors.danger }}>
          <SectionLabel style={{ color: colors.danger }}>
            POSSIBLE PREMATURE PR
          </SectionLabel>
          <Text
            style={{
              color: colors.text,
              fontSize: 14,
              fontWeight: "600",
              marginTop: 8,
            }}
          >
            Hit a spike of {premature.spikeWeight}kg, then dropped{" "}
            {premature.dropPercent}% on the next session
          </Text>
          <Text
            style={{ color: colors.textSecondary, fontSize: 13, marginTop: 6 }}
          >
            Could be form breakdown, fatigue, or a misrecorded set. Re-check the
            working weight next week before pulling back.
          </Text>
        </Card>
      )}

      {/* Trend Card */}
      <Card>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SectionLabel>TREND</SectionLabel>
          <Badge
            label={trendLabel}
            variant={
              trend.status === "overload"
                ? "improving"
                : trend.status === "regression"
                  ? "regression"
                  : trend.status === "stagnant"
                    ? "plateau"
                    : "new"
            }
          />
        </View>
        <View style={{ flexDirection: "row", gap: 16, marginTop: 12 }}>
          <View>
            <Text style={{ color: colors.textMuted, fontSize: 11 }}>
              Confidence
            </Text>
            <Text
              style={{
                color: trendColor,
                fontSize: 15,
                fontWeight: "700",
                marginTop: 2,
              }}
            >
              {trend.confidence.charAt(0).toUpperCase() +
                trend.confidence.slice(1)}
            </Text>
          </View>
          <View>
            <Text style={{ color: colors.textMuted, fontSize: 11 }}>
              Sessions Since Progress
            </Text>
            <Text
              style={{
                color:
                  trend.sessionsSinceProgress > 3 ? colors.danger : colors.text,
                fontSize: 15,
                fontWeight: "700",
                marginTop: 2,
              }}
            >
              {trend.sessionsSinceProgress}
            </Text>
          </View>
          <View>
            <Text style={{ color: colors.textMuted, fontSize: 11 }}>
              Change
            </Text>
            <Text
              style={{
                color:
                  trend.diffPercent > 0
                    ? colors.success
                    : trend.diffPercent < 0
                      ? colors.danger
                      : colors.textSecondary,
                fontSize: 15,
                fontWeight: "700",
                marginTop: 2,
              }}
            >
              {trend.diffPercent > 0 ? "+" : ""}
              {trend.diffPercent.toFixed(1)}%
            </Text>
          </View>
        </View>
      </Card>

      {/* Plateau Alert */}
      {plateau && (
        <Card style={{ borderColor: colors.warning }}>
          <SectionLabel>PLATEAU DETECTED</SectionLabel>
          <Text
            style={{
              color: colors.warning,
              fontSize: 14,
              fontWeight: "600",
              marginTop: 8,
            }}
          >
            {plateau.status === "static" ? "Static" : "General"} plateau -{" "}
            {plateau.sessionsSinceProgress} sessions
          </Text>
          <Text
            style={{ color: colors.textSecondary, fontSize: 13, marginTop: 6 }}
          >
            {getPlateauAdvice(plateau.status, plateau.sessionsSinceProgress)}
          </Text>
        </Card>
      )}

      {/* Set Commentary */}
      {commentaries.length > 0 && (
        <Card>
          <SectionLabel>LAST SESSION BREAKDOWN</SectionLabel>
          {commentaries.map((c) => (
            <View
              key={c.setIndex}
              style={{
                marginTop: 10,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  Set {c.setIndex + 1}: {c.weight > 0 ? `${c.weight}kg` : "BW"}{" "}
                  x {c.reps}
                </Text>
                <Text
                  style={{
                    color: c.classification.color,
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  {c.classification.message}
                </Text>
              </View>
              {c.classification.tooltip ? (
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  {c.classification.tooltip}
                </Text>
              ) : null}
              {c.classification.improve ? (
                <Text
                  style={{ color: colors.brand, fontSize: 12, marginTop: 2 }}
                >
                  Tip: {c.classification.improve}
                </Text>
              ) : null}
            </View>
          ))}
        </Card>
      )}

      {/* Session History */}
      <Card>
        <SectionLabel>HISTORY ({sessionHistory.length} sessions)</SectionLabel>
        {sessionHistory.length === 0 && (
          <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 8 }}>
            No sessions found for this exercise.
          </Text>
        )}
        {sessionHistory.map((session) => {
          if (!session) return null;
          const date = new Date(session.date);
          const dateStr = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          return (
            <View
              key={session.id}
              style={{
                marginTop: 10,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {dateStr}
                </Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                    {session.sets} sets
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                    {session.maxWeight}kg max
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                    {formatVolume(session.totalVolume)} vol
                  </Text>
                </View>
              </View>
              {session.prCount > 0 && (
                <Badge label={`${session.prCount} PR`} variant="pr" />
              )}
            </View>
          );
        })}
      </Card>
    </ScrollView>
  );
}

function formatVolume(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return `${v}`;
}
