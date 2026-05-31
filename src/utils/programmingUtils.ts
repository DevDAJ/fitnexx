export function formatSessionDuration(
  startedAt: string,
  completedAt: string,
): string {
  const diffMs = new Date(completedAt).getTime() - new Date(startedAt).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "<1 min";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
