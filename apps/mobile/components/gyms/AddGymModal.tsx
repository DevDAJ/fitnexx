import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getEquipmentOptions } from "../../lib/exerciseDatabase";
import type { Gym } from "../../lib/types";
import { Toggle } from "../shared/Toggle";

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
      <View style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
        <ScrollView
          contentContainerStyle={{
            paddingTop: 60,
            paddingHorizontal: 16,
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
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>
              {initial ? "Edit Gym" : "Add Gym"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: "#3b82f6", fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Gym name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
            style={inputStyle}
          />

          <Text style={labelStyle}>DETECTION RADIUS (METERS)</Text>
          <TextInput
            placeholder="150"
            placeholderTextColor="#666"
            value={radius}
            onChangeText={setRadius}
            keyboardType="number-pad"
            style={inputStyle}
          />

          <Text style={labelStyle}>LOCATION</Text>
          <TouchableOpacity
            onPress={captureLocation}
            disabled={capturing}
            style={{
              backgroundColor: "#3b82f6",
              borderRadius: 10,
              padding: 14,
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>
              {capturing ? "Locating..." : "Save My Current Location"}
            </Text>
          </TouchableOpacity>
          {locError && (
            <Text style={{ color: "#ef4444", fontSize: 12, marginBottom: 8 }}>
              {locError}
            </Text>
          )}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              placeholder="Latitude"
              placeholderTextColor="#666"
              value={latitude}
              onChangeText={setLatitude}
              keyboardType="numbers-and-punctuation"
              style={{ ...inputStyle, flex: 1 }}
            />
            <TextInput
              placeholder="Longitude"
              placeholderTextColor="#666"
              value={longitude}
              onChangeText={setLongitude}
              keyboardType="numbers-and-punctuation"
              style={{ ...inputStyle, flex: 1 }}
            />
          </View>

          <Text style={labelStyle}>EQUIPMENT AVAILABLE</Text>
          <TextInput
            placeholder="Filter equipment..."
            placeholderTextColor="#666"
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

          <TouchableOpacity
            onPress={save}
            disabled={!canSave}
            style={{
              backgroundColor: canSave ? "#3b82f6" : "#222",
              borderRadius: 10,
              padding: 16,
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                color: canSave ? "#fff" : "#666",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              Save Gym
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const inputStyle = {
  backgroundColor: "#161616",
  borderRadius: 10,
  padding: 12,
  color: "#fff",
  fontSize: 15,
  borderWidth: 1,
  borderColor: "#2a2a2a",
  marginBottom: 12,
};

const labelStyle = {
  color: "#888",
  fontSize: 12,
  fontWeight: "600" as const,
  textTransform: "uppercase" as const,
  letterSpacing: 0.5,
  marginBottom: 8,
  marginTop: 8,
};
