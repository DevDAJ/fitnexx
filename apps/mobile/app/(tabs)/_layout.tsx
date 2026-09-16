import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radii, spacing } from "../../lib/theme";

function TabIcon({
  name,
  focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
}) {
  return (
    <View style={{ alignItems: "center", opacity: focused ? 1 : 0.72 }}>
      <Ionicons
        name={name}
        size={22}
        color={focused ? colors.brand : colors.textMuted}
      />
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surfaceRaised,
          borderColor: colors.border,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderTopLeftRadius: radii.xl,
          borderTopRightRadius: radii.xl,
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: spacing.sm,
          paddingHorizontal: spacing.xs,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.24,
          shadowRadius: 18,
          elevation: 12,
        },
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="stats-chart-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="logging"
        options={{
          title: "Workouts",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="barbell-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: "Meals",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="restaurant-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="muscle-analysis"
        options={{
          title: "Muscles",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="body-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="settings-outline" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
