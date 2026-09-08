import { CameraView, useCameraPermissions } from "expo-camera";
import {
  type ComponentType,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  adoptPairingCode,
  createNewSyncGroup,
  getAppToken,
  getPairingCode,
  getSyncPeer,
  getSyncStatus,
  startSyncServer,
  subscribeSyncStatus,
  syncWithPeer,
} from "../../lib/sync";
import type { SyncPeer } from "../../lib/syncProtocol";

const QRCodeView = QRCode as unknown as ComponentType<{
  value: string;
  size: number;
  quietZone: number;
}>;

export function SyncSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const status = useSyncExternalStore(
    subscribeSyncStatus,
    getSyncStatus,
    getSyncStatus,
  );
  const [mode, setMode] = useState<"pair" | "scan">("pair");
  const [token, setToken] = useState("");
  const [pairingCode, setPairingCode] = useState("");
  const [peer, setPeer] = useState<SyncPeer | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!visible) return;
    let active = true;
    const load = async () => {
      try {
        await startSyncServer();
        const [nextToken, nextPeer, nextCode] = await Promise.all([
          getAppToken(),
          getSyncPeer(),
          getPairingCode(),
        ]);
        if (!active) return;
        setToken(nextToken);
        setPeer(nextPeer);
        setPairingCode(nextCode);
      } catch (error) {
        if (active) {
          Alert.alert(
            "Local sync unavailable",
            error instanceof Error ? error.message : "Could not start sync.",
          );
        }
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [visible]);

  const scanCode = async (data: string) => {
    if (scanning) return;
    setScanning(true);
    let nextPeer: SyncPeer;
    try {
      nextPeer = await adoptPairingCode(data);
      setPeer(nextPeer);
      setToken(await getAppToken());
      setPairingCode(await getPairingCode());
      setMode("pair");
    } catch (error) {
      Alert.alert(
        "Pairing failed",
        error instanceof Error ? error.message : "Could not pair these apps.",
      );
      setScanning(false);
      return;
    }
    try {
      await syncWithPeer(nextPeer);
    } catch (error) {
      Alert.alert(
        "Paired, but sync failed",
        error instanceof Error
          ? error.message
          : "Could not reach the other app.",
      );
    } finally {
      setScanning(false);
    }
  };

  const syncNow = async () => {
    try {
      await syncWithPeer(peer);
    } catch (error) {
      Alert.alert(
        "Sync failed",
        error instanceof Error
          ? error.message
          : "Could not reach the other app.",
      );
    }
  };

  const confirmNewGroup = () => {
    Alert.alert(
      "Create a new sync group?",
      "Apps using the current token will stop syncing with this app.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Create",
          style: "destructive",
          onPress: async () => {
            const nextToken = await createNewSyncGroup();
            setToken(nextToken);
            setPeer(null);
            setPairingCode(await getPairingCode());
          },
        },
      ],
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#0a0a0a",
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 16,
        }}
      >
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={mode === "scan" ? () => setMode("pair") : onClose}
          >
            <Text style={{ color: "#888", fontSize: 15 }}>
              {mode === "scan" ? "Back" : "Close"}
            </Text>
          </TouchableOpacity>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>
            Local Sync
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {mode === "scan" ? (
          cameraPermission?.granted ? (
            <View style={{ flex: 1 }}>
              <CameraView
                style={{ flex: 1 }}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={
                  scanning ? undefined : ({ data }) => void scanCode(data)
                }
              />
              <Text
                style={{
                  color: "#fff",
                  backgroundColor: "#000",
                  textAlign: "center",
                  padding: 16,
                }}
              >
                Scan the QR shown by another Fitnexx app.
              </Text>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: 24,
              }}
            >
              <Text style={{ color: "#888", textAlign: "center" }}>
                Camera access is needed to scan a Fitnexx sync code.
              </Text>
              <TouchableOpacity
                onPress={requestCameraPermission}
                style={{
                  backgroundColor: "#3b82f6",
                  borderRadius: 10,
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  Grant access
                </Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              paddingHorizontal: 20,
              gap: 16,
            }}
          >
            <Text style={{ color: "#888", textAlign: "center" }}>
              Apps on the same network sync only when their app tokens match.
            </Text>

            {pairingCode ? (
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 14,
                  borderRadius: 16,
                }}
              >
                <QRCodeView value={pairingCode} size={220} quietZone={4} />
              </View>
            ) : (
              <View
                style={{
                  width: 248,
                  height: 248,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#161616",
                  borderRadius: 16,
                }}
              >
                <Text style={{ color: "#666" }}>Waiting for Wi-Fi...</Text>
              </View>
            )}

            <View style={{ alignItems: "center", gap: 4 }}>
              <Text style={{ color: "#666", fontSize: 12 }}>APP TOKEN</Text>
              <Text
                selectable
                style={{ color: "#e5e5e5", fontSize: 14, fontWeight: "700" }}
              >
                {token
                  ? `${token.slice(0, 8)}...${token.slice(-4)}`
                  : "Loading"}
              </Text>
            </View>

            <Text
              style={{
                color: status.phase === "error" ? "#ef4444" : "#22c55e",
                fontSize: 13,
              }}
            >
              {status.message}
            </Text>

            {peer && (
              <Text style={{ color: "#666", fontSize: 12 }}>
                Paired with {peer.host}:{peer.port}
              </Text>
            )}

            <TouchableOpacity
              onPress={() => setMode("scan")}
              disabled={status.phase === "syncing"}
              style={{
                width: "100%",
                backgroundColor: "#3b82f6",
                borderRadius: 12,
                padding: 15,
                alignItems: "center",
                opacity: status.phase === "syncing" ? 0.5 : 1,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800" }}>
                Scan another app
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => void syncNow()}
              disabled={!peer || status.phase === "syncing"}
              style={{
                width: "100%",
                backgroundColor: "#1a1a1a",
                borderRadius: 12,
                padding: 15,
                alignItems: "center",
                borderWidth: 1,
                borderColor: peer ? "#3b82f6" : "#2a2a2a",
                opacity: !peer || status.phase === "syncing" ? 0.5 : 1,
              }}
            >
              <Text style={{ color: "#e5e5e5", fontWeight: "700" }}>
                Sync now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={confirmNewGroup}>
              <Text style={{ color: "#ef4444", fontSize: 13 }}>
                Create a new app token
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}
