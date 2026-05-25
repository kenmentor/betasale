import { v4 as uuidv4 } from "uuid";

export function generateId(): string {
  return uuidv4();
}

export function now(): string {
  return new Date().toISOString();
}

export function addHours(date: string, hours: number): string {
  const d = new Date(date);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}
