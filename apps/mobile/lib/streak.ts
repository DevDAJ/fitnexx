export interface Streak {
  days: number;
  activeToday: boolean;
}

export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function computeStreak(
  workoutDates: string[],
  now = new Date(),
): Streak {
  const active = new Set(workoutDates.map((d) => dayKey(new Date(d))));
  const today = dayKey(now);
  const activeToday = active.has(today);

  let cursor = activeToday ? now : new Date(now.getTime() - 86400000);
  let days = 0;
  while (active.has(dayKey(cursor))) {
    days += 1;
    cursor = new Date(cursor.getTime() - 86400000);
  }
  return { days, activeToday };
}
