import { useState } from "react";
import { ScrollView, View, Pressable } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { useProgrammingStore } from "@fitnexx/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text, MutedText } from "@/components/ui/text";

export default function ProgrammingScreen() {
  const { templates, sessions } = useProgrammingStore(
    useShallow((s) => ({ templates: s.templates, sessions: s.sessions })),
  );
  const addTemplate = useProgrammingStore((s) => s.addTemplate);
  const addSession = useProgrammingStore((s) => s.addSession);
  const completeSession = useProgrammingStore((s) => s.completeSession);
  const generateTemplateId = useProgrammingStore((s) => s.generateTemplateId);
  const generateSessionId = useProgrammingStore((s) => s.generateSessionId);

  const [newName, setNewName] = useState("");

  const createTemplate = () => {
    if (!newName.trim()) return;
    addTemplate({
      id: generateTemplateId(),
      name: newName.trim(),
      exercises: [],
      createdAt: new Date().toISOString(),
    });
    setNewName("");
  };

  const startSession = (templateId: string, name: string) => {
    addSession({
      id: generateSessionId(),
      templateId,
      name,
      date: new Date().toISOString().slice(0, 10),
      startedAt: new Date().toISOString(),
    });
  };

  const activeSessions = sessions.filter((s) => !s.completedAt);

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Header title="Programming" description="Workout templates and sessions." />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>New Template</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          <Input placeholder="Template name" value={newName} onChangeText={setNewName} />
          <Button onPress={createTemplate} disabled={!newName.trim()}>
            <Text className="text-primary-foreground font-medium">Create</Text>
          </Button>
        </CardContent>
      </Card>

      {activeSessions.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {activeSessions.map((s) => (
              <View key={s.id} className="flex-row justify-between items-center py-2 border-b border-border last:border-0">
                <View className="flex-1">
                  <Text className="font-medium">{s.name}</Text>
                  <MutedText>{s.date}</MutedText>
                </View>
                <Button variant="outline" onPress={() => completeSession(s.id)}>
                  <Text className="text-foreground text-sm">Complete</Text>
                </Button>
              </View>
            ))}
          </CardContent>
        </Card>
      )}

      {templates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
          </CardHeader>
          <CardContent>
            {templates.map((t) => (
              <View key={t.id} className="flex-row justify-between items-center py-2 border-b border-border last:border-0">
                <View className="flex-1">
                  <Text className="font-medium">{t.name}</Text>
                  <MutedText>{t.exercises.length} exercises</MutedText>
                </View>
                <Button variant="default" onPress={() => startSession(t.id, t.name)}>
                  <Text className="text-primary-foreground text-sm">Start</Text>
                </Button>
              </View>
            ))}
          </CardContent>
        </Card>
      )}
    </ScrollView>
  );
}
