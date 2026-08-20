import type { Discipline } from "./types";

export const CATEGORIES_BY_DISCIPLINE: Record<Discipline, string[]> = {
  motorsport: ["Rally", "Hillclimb", "Karting", "Drag racing", "Autocross", "Drift", "Circuit racing"],
  cycling: ["Road race", "Gran Fondo", "MTB", "Track cycling"],
};

export const OTHER_CATEGORY = "Ostalo";
