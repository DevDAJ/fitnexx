import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { getEquipmentOptions } from "../../lib/exerciseDatabase";
import { colors, spacing } from "../../lib/theme";
import type { Gym } from "../../lib/types";
import { Toggle } from "../shared/Toggle";
import {
  AppButton,
  AppTextInput,
  ScreenTitle,
  SectionLabel,
} from "../shared/ui";

export function AddGymModal({
  visible,
  initial,
  onSave,
  onClose,
}: {
  visible: boolean;
  initial?: Gym | null;
  onSave: (gym: Gym) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [radius, setRadius] = useState("150");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [capturing, setCapturing] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<Set<string>>(new Set());
  const [options, setOptions] = useState<string[]>([]);
  const [equipQuery, setEquipQuery] = useState("");

  useEffect(() => {
    if (!visible) return;
    setName(initial?.name ?? "");
    setRadius(initial ? String(initial.radius) : "150");
    setLatitude(initial ? String(initial.latitude) : "");
    setLongitude(initial ? String(initial.longitude) : "");
    setEquipment(new Set(initial?.equipment ?? []));
    setEquipQuery("");
    setLocError(null);
    getEquipmentOptions()
      .then(setOptions)
      .catch(() => setOptions([]));
  }, [visible, initial]);

  const captureLocation = async () => {
    setCapturing(true);
    setLocError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocError("Location permission denied. Enter coordinates manually.");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLatitude(pos.coords.latitude.toFixed(6));
      setLongitude(pos.coords.longitude.toFixed(6));
    } catch {
      setLocError("Could not get your location. Enter coordinates manually.");
    } finally {
      setCapturing(false);
    }
  };

  const canSave =
    name.trim().length > 0 &&
    Number.isFinite(Number(radius)) &&
    Number(radius) > 0 &&
    Number.isFinite(Number(latitude)) &&
    Number.isFinite(Number(longitude));

  const save = () => {
    if (!canSave) return;
    onSave({
      id: initial?.id ?? `gym_${Date.now()}`,
      name: name.trim(),
      radius: Number(radius),
      latitude: Number(latitude),
      longitude: Number(longitude),
      equipment: Array.from(equipment),
    });
    onClose();
  };

  const filteredOptions = options.filter((o) =>
    o.toLowerCase().includes(equipQuery.toLowerCase()),
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          contentContainerStyle={{
            paddingTop: 60,
            paddingHorizontal: spacing.screen,
            paddingBottom: 40,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <ScreenTitle style={{ fontSize: 20 }}>
              {initial ? "Edit Gym" : "Add Gym"}
            </ScreenTitle>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: colors.brand, fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <AppTextInput
            placeholder="Gym name"
            value={name}
            onChangeText={setName}
            style={inputStyle}
          />

          <SectionLabel style={labelStyle}>
            Detection radius (meters)
          </SectionLabel>
          <AppTextInput
            placeholder="150"
            value={radius}
            onChangeText={setRadius}
            keyboardType="number-pad"
            style={inputStyle}
          />

          <SectionLabel style={labelStyle}>Location</SectionLabel>
          <AppButton
            onPress={captureLocation}
            disabled={capturing}
            style={{ marginBottom: 8 }}
          >
            {capturing ? "Locating..." : "Save My Current Location"}
          </AppButton>
          {locError && (
            <Text
              style={{ color: colors.danger, fontSize: 12, marginBottom: 8 }}
            >
              {locError}
            </Text>
          )}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <AppTextInput
              placeholder="Latitude"
              value={latitude}
              onChangeText={setLatitude}
              keyboardType="numbers-and-punctuation"
              style={{ ...inputStyle, flex: 1 }}
            />
            <AppTextInput
              placeholder="Longitude"
              value={longitude}
              onChangeText={setLongitude}
              keyboardType="numbers-and-punctuation"
              style={{ ...inputStyle, flex: 1 }}
            />
          </View>

          <SectionLabel style={labelStyle}>Equipment available</SectionLabel>
          <AppTextInput
            placeholder="Filter equipment..."
            value={equipQuery}
            onChangeText={setEquipQuery}
            style={inputStyle}
          />
          {filteredOptions.map((item) => {
            const selected = equipment.has(item);
            return (
              <Toggle
                key={item}
                label={item}
                value={selected}
                onValueChange={(v) => {
                  const next = new Set(equipment);
                  if (v) next.add(item);
                  else next.delete(item);
                  setEquipment(next);
                }}
              />
            );
          })}

          <AppButton
            onPress={save}
            disabled={!canSave}
            style={{ marginTop: 20 }}
          >
            Save Gym
          </AppButton>
        </ScrollView>
      </View>
    </Modal>
  );
}

const inputStyle = {
  backgroundColor: colors.surface,
  borderRadius: 10,
  padding: 12,
  color: colors.text,
  fontSize: 15,
  borderWidth: 1,
  borderColor: colors.border,
  marginBottom: 12,
};

const labelStyle = {
  marginBottom: 8,
  marginTop: 8,
};
