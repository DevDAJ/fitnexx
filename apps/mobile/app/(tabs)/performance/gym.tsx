import { useState } from "react";
import { ScrollView, View, Pressable } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { useGymStore } from "@fitnexx/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text, MutedText } from "@/components/ui/text";

export default function GymScreen() {
  const { equipmentCatalog, myEquipmentIds } = useGymStore(
    useShallow((s) => ({ equipmentCatalog: s.equipmentCatalog, myEquipmentIds: s.myEquipmentIds })),
  );
  const addMyEquipment = useGymStore((s) => s.addMyEquipment);
  const removeMyEquipment = useGymStore((s) => s.removeMyEquipment);
  const [search, setSearch] = useState("");

  const categories = [...new Set(equipmentCatalog.map((e) => e.category))];
  const filtered = search
    ? equipmentCatalog.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
    : equipmentCatalog;

  const toggleEquipment = (id: string) => {
    if (myEquipmentIds.includes(id)) {
      removeMyEquipment(id);
    } else {
      addMyEquipment(id);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Header title="Gym Equipment" description="Select equipment you have access to." />

      <Input
        placeholder="Search equipment..."
        value={search}
        onChangeText={setSearch}
        className="mb-4"
      />

      {categories.map((cat) => {
        const items = filtered.filter((e) => e.category === cat);
        if (items.length === 0) return null;
        return (
          <Card key={cat} className="mb-3">
            <CardHeader>
              <CardTitle className="capitalize">{cat}</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="flex-row flex-wrap gap-2">
                {items.map((eq) => (
                  <Pressable
                    key={eq.id}
                    onPress={() => toggleEquipment(eq.id)}
                    className={`px-3 py-2 rounded-lg border ${
                      myEquipmentIds.includes(eq.id)
                        ? "bg-primary border-primary"
                        : "border-border"
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        myEquipmentIds.includes(eq.id)
                          ? "text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {eq.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </CardContent>
          </Card>
        );
      })}
    </ScrollView>
  );
}
