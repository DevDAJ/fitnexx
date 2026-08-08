import { randomUUID } from "expo-crypto";

export function randomId(prefix: string): string {
  return `${prefix}-${randomUUID()}`;
}
