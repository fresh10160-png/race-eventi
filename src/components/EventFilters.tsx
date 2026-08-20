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

  const fieldClass =
    "rounded-sm border border-(--border) bg-(--bg-elevated-2) px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-(--red)/40";

  const pillBase =
    "rounded-sm px-4 py-2.5 text-sm font-extrabold uppercase tracking-wide transition border";

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-(--border) bg-(--bg-elevated) px-4 sm:px-6 py-5 -mx-4 sm:-mx-6">
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
            className={`${pillBase} ${
              discipline === value
                ? "bg-(--red) border-(--red) text-white"
                : "border-(--border) text-(--text-dim) hover:border-(--red)/60 hover:text-(--foreground)"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 bg-(--bg-elevated) px-4 sm:px-6 py-5 -mx-4 sm:-mx-6 border-b border-(--border) mb-6">
        <input
          type="text"
          placeholder="Pretraži utrke, mjesta, klubove…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${fieldClass} w-full sm:w-64 placeholder:text-(--text-mute) placeholder:font-normal`}
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className={`${fieldClass} max-w-[46%] sm:max-w-56 truncate`}
        >
          <option value="all">Sve regije</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`${fieldClass} max-w-[46%] sm:max-w-48 truncate`}
        >
          <option value="all">Sve kategorije</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={month} onChange={(e) => setMonth(e.target.value)} className={`${fieldClass} max-w-[46%] sm:max-w-40 truncate`}>
          <option value="all">Svi mjeseci</option>
          {CROATIAN_MONTHS.map((m, i) => (
            <option key={m} value={i}>
              {m}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm font-semibold px-1 select-none cursor-pointer text-(--text-dim)">
          <input type="checkbox" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} className="size-4 accent-(--red)" />
          Prikaži prošle utrke
        </label>
      </div>

      <p className="font-display text-base tracking-wide text-(--text-mute) mb-3">
        <span className="text-(--red) text-lg">{filtered.length}</span> {filtered.length === 1 ? "utrka" : "utrka pronađeno"}
      </p>

      <div className="grid gap-3">
        {filtered.map((event, i) => (
          <EventCard key={event.id} event={event} past={!isUpcoming(event)} index={i} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-(--text-mute) py-12">
            Nema utrka koje odgovaraju odabranim filterima.
          </p>
        )}
      </div>
    </div>
  );
}
