import { View } from "react-native";
import { Text } from "@/components/ui/text";

export function Header({ title, description }: { title: string; description?: string }) {
  return (
    <View className="mb-4">
      <Text className="text-2xl font-bold text-foreground">{title}</Text>
      {description && <Text className="mt-1 text-sm text-muted-foreground">{description}</Text>}
    </View>
  );
}
