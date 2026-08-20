import { useState, useCallback, createContext, useContext, useRef, useEffect } from "react";
import { View, Text, Animated, Dimensions } from "react-native";

interface Toast {
  id: number;
  message: string;
  type: "info" | "success" | "pr" | "error";
}

interface ToastContextValue {
  showToast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const TOAST_COLORS: Record<Toast["type"], string> = {
  info: "#3b82f6",
  success: "#22c55e",
  pr: "#fbbf24",
  error: "#ef4444",
};

const TOAST_ICONS: Record<Toast["type"], string> = {
  info: "ℹ️",
  success: "✅",
  pr: "🏆",
  error: "❌",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = counter.current++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 60,
          left: 16,
          right: 16,
          zIndex: 9999,
          gap: 8,
        }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -20, duration: 200, useNativeDriver: true }),
      ]).start();
    }, 2600);

    return () => clearTimeout(timer);
  }, [opacity, translateY]);

  const bgColor = TOAST_COLORS[toast.type];
  const icon = TOAST_ICONS[toast.type];

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
        backgroundColor: "#161616",
        borderLeftWidth: 3,
        borderColor: bgColor,
        borderRadius: 10,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      <Text style={{ fontSize: 14 }}>{icon}</Text>
      <Text style={{ color: "#e5e5e5", fontSize: 13, fontWeight: "500", flex: 1 }}>
        {toast.message}
      </Text>
    </Animated.View>
  );
}
