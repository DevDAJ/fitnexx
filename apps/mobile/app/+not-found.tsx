import { View } from "react-native";
import { Link } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background p-4">
      <Text className="text-xl font-bold mb-2">404</Text>
      <Text className="text-muted-foreground mb-4">Page not found</Text>
      <Link href="/(tabs)" asChild>
        <Button>
          <Text className="text-primary-foreground font-medium">Go Home</Text>
        </Button>
      </Link>
    </View>
  );
}
