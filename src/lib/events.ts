import rawEvents from "../../data/events.json";
import type { Discipline, RaceEvent } from "./types";

export const events: RaceEvent[] = rawEvents as RaceEvent[];

export const CROATIAN_MONTHS = [
  "Siječanj",
  "Veljača",
  "Ožujak",
  "Travanj",
  "Svibanj",
  "Lipanj",
  "Srpanj",
  "Kolovoz",
  "Rujan",
  "Listopad",
  "Studeni",
  "Prosinac",
];

export function formatDateRange(dateStart: string, dateEnd: string): string {
  const start = new Date(dateStart + "T00:00:00");
  const end = new Date(dateEnd + "T00:00:00");
  const fmt = (d: Date) => d.toLocaleDateString("hr-HR", { day: "numeric", month: "long", year: "numeric" });
  if (dateStart === dateEnd) return fmt(start);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    return `${start.getDate()}. – ${fmt(end)}`;
  }
  return `${fmt(start)} – ${fmt(end)}`;
}

export function isUpcoming(event: RaceEvent, today: Date = new Date()): boolean {
  const end = new Date(event.date_end + "T23:59:59");
  return end.getTime() >= today.getTime();
}

export function getRegions(list: RaceEvent[] = events): string[] {
  return Array.from(new Set(list.map((e) => e.region))).sort((a, b) => a.localeCompare(b, "hr"));
}

export function getCategories(list: RaceEvent[] = events, discipline?: Discipline): string[] {
  const filtered = discipline ? list.filter((e) => e.discipline === discipline) : list;
  return Array.from(new Set(filtered.map((e) => e.category))).sort((a, b) => a.localeCompare(b, "hr"));
}

export function sortByDate(list: RaceEvent[]): RaceEvent[] {
  return [...list].sort((a, b) => a.date_start.localeCompare(b.date_start));
}

export function getEventById(id: string): RaceEvent | undefined {
  return events.find((e) => e.id === id);
}
