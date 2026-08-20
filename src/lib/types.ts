export type Discipline = "motorsport" | "cycling";

export type EventStatus = "confirmed" | "tentative";

export interface RaceEvent {
  id: string;
  name: string;
  discipline: Discipline;
  category: string;
  date_start: string;
  date_end: string;
  location: string;
  region: string;
  organizer: string;
  description: string;
  website: string;
  source: string;
  status: EventStatus;
}
