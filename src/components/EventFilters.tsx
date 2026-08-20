"use client";

import { useMemo, useState } from "react";
import type { RaceEvent } from "@/lib/types";
import { CROATIAN_MONTHS, getCategories, getRegions, isUpcoming, sortByDate } from "@/lib/events";
import EventCard from "@/components/EventCard";

type DisciplineFilter = "all" | RaceEvent["discipline"];

export default function EventFilters({ events }: { events: RaceEvent[] }) {
  const [discipline, setDiscipline] = useState<DisciplineFilter>("all");
  const [region, setRegion] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [month, setMonth] = useState<string>("all");
  const [query, setQuery] = useState<string>("");
  const [showPast, setShowPast] = useState(false);

  const regions = useMemo(() => getRegions(events), [events]);
  const categories = useMemo(
    () => getCategories(events, discipline === "all" ? undefined : discipline),
    [events, discipline]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortByDate(
      events.filter((e) => {
        if (discipline !== "all" && e.discipline !== discipline) return false;
        if (region !== "all" && e.region !== region) return false;
        if (category !== "all" && e.category !== category) return false;
        if (month !== "all" && new Date(e.date_start + "T00:00:00").getMonth() !== Number(month)) return false;
        if (!showPast && !isUpcoming(e)) return false;
        if (q) {
          const haystack = `${e.name} ${e.location} ${e.region} ${e.organizer} ${e.category}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
    );
  }, [events, discipline, region, category, month, query, showPast]);

  const selectClass =
    "rounded-lg border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30";

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {(
          [
            ["all", "Sve"],
            ["motorsport", "Motosport"],
            ["cycling", "Biciklizam"],
          ] as [DisciplineFilter, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => {
              setDiscipline(value);
              setCategory("all");
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              discipline === value
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/15"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <input
          type="text"
          placeholder="Pretraži utrke, mjesta, klubove…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${selectClass} w-full sm:w-64`}
        />
        <select value={region} onChange={(e) => setRegion(e.target.value)} className={selectClass}>
          <option value="all">Sve regije</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
          <option value="all">Sve kategorije</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={month} onChange={(e) => setMonth(e.target.value)} className={selectClass}>
          <option value="all">Svi mjeseci</option>
          {CROATIAN_MONTHS.map((m, i) => (
            <option key={m} value={i}>
              {m}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm px-1 select-none cursor-pointer">
          <input type="checkbox" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} className="size-4" />
          Prikaži prošle utrke
        </label>
      </div>

      <p className="text-sm text-black/50 dark:text-white/50 mb-3">
        {filtered.length} {filtered.length === 1 ? "utrka" : "utrka pronađeno"}
      </p>

      <div className="grid gap-3">
        {filtered.map((event) => (
          <EventCard key={event.id} event={event} past={!isUpcoming(event)} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-black/50 dark:text-white/50 py-12">
            Nema utrka koje odgovaraju odabranim filterima.
          </p>
        )}
      </div>
    </div>
  );
}
