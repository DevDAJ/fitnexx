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
import { colors, spacing } from "../../lib/theme";
import { AppButton, ScreenTitle, SectionLabel } from "../shared/ui";

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
          backgroundColor: colors.background,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 16,
        }}
      >
        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingBottom: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={mode === "scan" ? () => setMode("pair") : onClose}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 15 }}>
              {mode === "scan" ? "Back" : "Close"}
            </Text>
          </TouchableOpacity>
          <ScreenTitle style={{ fontSize: 18 }}>Local Sync</ScreenTitle>
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
                  color: colors.text,
                  backgroundColor: colors.shadow,
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
              <Text
                style={{ color: colors.textSecondary, textAlign: "center" }}
              >
                Camera access is needed to scan a Fitnexx sync code.
              </Text>
              <AppButton onPress={requestCameraPermission}>
                Grant access
              </AppButton>
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
            <Text style={{ color: colors.textSecondary, textAlign: "center" }}>
              Apps on the same network sync only when their app tokens match.
            </Text>

            {pairingCode ? (
              <View
                style={{
                  backgroundColor: colors.text,
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
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                }}
              >
                <Text style={{ color: colors.textMuted }}>
                  Waiting for Wi-Fi...
                </Text>
              </View>
            )}

            <View style={{ alignItems: "center", gap: 4 }}>
              <SectionLabel>App token</SectionLabel>
              <Text
                selectable
                style={{ color: colors.text, fontSize: 14, fontWeight: "700" }}
              >
                {token
                  ? `${token.slice(0, 8)}...${token.slice(-4)}`
                  : "Loading"}
              </Text>
            </View>

            <Text
              style={{
                color:
                  status.phase === "error" ? colors.danger : colors.success,
                fontSize: 13,
              }}
            >
              {status.message}
            </Text>

            {peer && (
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                Paired with {peer.host}:{peer.port}
              </Text>
            )}

            <AppButton
              onPress={() => setMode("scan")}
              disabled={status.phase === "syncing"}
              style={{ width: "100%" }}
            >
              Scan another app
            </AppButton>

            <TouchableOpacity
              onPress={() => void syncNow()}
              disabled={!peer || status.phase === "syncing"}
              style={{
                width: "100%",
                backgroundColor: colors.surfaceRaised,
                borderRadius: 12,
                padding: 15,
                alignItems: "center",
                borderWidth: 1,
                borderColor: peer ? colors.brand : colors.border,
                opacity: !peer || status.phase === "syncing" ? 0.5 : 1,
              }}
            >
              <Text style={{ color: colors.text, fontWeight: "700" }}>
                Sync now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={confirmNewGroup}>
              <Text style={{ color: colors.danger, fontSize: 13 }}>
                Create a new app token
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}
