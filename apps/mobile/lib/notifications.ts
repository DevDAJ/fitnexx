import * as Notifications from "expo-notifications";
import type { MetricsReminder } from "./types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationPermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  const result = await Notifications.requestPermissionsAsync();
  return result.granted;
}

export async function scheduleMetricsReminder(
  reminder: MetricsReminder,
): Promise<void> {
  if (!reminder.enabled) return;
  const granted = await ensureNotificationPermission();
  if (!granted) {
    throw new Error("Notifications are disabled in system settings.");
  }
  await Notifications.cancelAllScheduledNotificationsAsync();
  const trigger: Notifications.NotificationTriggerInput =
    reminder.frequency === "weekly"
      ? {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: reminder.weekday ?? 1,
          hour: reminder.hour,
          minute: reminder.minute,
        }
      : {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: reminder.hour,
          minute: reminder.minute,
        };
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Fitnexx",
      body: "Time to log your body metrics. Step on the scale and track your progress.",
    },
    trigger,
  });
}

export async function cancelMetricsReminder(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function rescheduleMetricsReminderIfGranted(
  reminder: MetricsReminder,
): Promise<void> {
  const perms = await Notifications.getPermissionsAsync();
  if (!perms.granted) return;
  await scheduleMetricsReminder(reminder).catch(() => {});
}
