import { Tabs } from "expo-router";
import { Home, Activity, UtensilsCrossed, BarChart3, Settings } from "lucide-react-native";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "hsl(189, 65%, 36%)",
        tabBarInactiveTintColor: "hsl(240, 3.8%, 46.1%)",
        tabBarStyle: {
          backgroundColor: "hsl(0, 0%, 100%)",
          borderTopColor: "hsl(240, 5.9%, 90%)",
        },
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="performance"
        options={{
          title: "Performance",
          tabBarIcon: ({ color, size }) => <Activity color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="macros"
        options={{
          title: "Macros",
          tabBarIcon: ({ color, size }) => <UtensilsCrossed color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="metrics"
        options={{
          title: "Metrics",
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
