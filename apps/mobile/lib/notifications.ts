import * as Notifications from "expo-notifications";
import type { HabitReminders, MetricsReminder, Schedule } from "./types";

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
  if (existing.granted || existing.status === "granted") return true;
  if (existing.canAskAgain) {
    const result = await Notifications.requestPermissionsAsync();
    return result.granted;
  }
  return existing.granted;
}

type Trigger = Notifications.NotificationTriggerInput;

function dailyTrigger(hour: number, minute: number): Trigger {
  return {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour,
    minute,
  };
}

function weeklyTrigger(weekday: number, hour: number, minute: number): Trigger {
  return {
    type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
    weekday,
    hour,
    minute,
  };
}

export interface ReminderState {
  metricsReminder: MetricsReminder | null;
  habitReminders: HabitReminders;
  schedule: Schedule | null;
}

/**
 * Cancels every scheduled notification, then re-schedules whatever is
 * currently enabled. Runs synchronously so the store can call it after
 * any settings change.
 */
export async function rescheduleAll(state: ReminderState): Promise<void> {
  const perms = await Notifications.getPermissionsAsync();
  if (!perms.granted) return;
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (state.metricsReminder?.enabled) {
    const trigger: Trigger =
      state.metricsReminder.frequency === "weekly"
        ? weeklyTrigger(
            state.metricsReminder.weekday ?? 1,
            state.metricsReminder.hour,
            state.metricsReminder.minute,
          )
        : dailyTrigger(
            state.metricsReminder.hour,
            state.metricsReminder.minute,
          );
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Fitnexx",
        body: "Time to log your body metrics. Step on the scale and track your progress.",
      },
      trigger,
    });
  }

  if (state.habitReminders.training.enabled) {
    const { hour, minute } = state.habitReminders.training;
    const days = state.schedule?.days.map((d) => d.dayOfWeek) ?? [];
    const triggers =
      days.length > 0
        ? days.map((d) => weeklyTrigger(d + 1, hour, minute))
        : [dailyTrigger(hour, minute)];
    for (const trigger of triggers) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Fitnexx",
          body: "Training day - time to log your workout.",
        },
        trigger,
      });
    }
  }

  if (state.habitReminders.mealLog.enabled) {
    const { hour, minute } = state.habitReminders.mealLog;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Fitnexx",
        body: "Did you log today's meals? Finish the day strong.",
      },
      trigger: dailyTrigger(hour, minute),
    });
  }
}
