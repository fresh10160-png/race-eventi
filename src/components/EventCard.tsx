import Link from "next/link";
import type { RaceEvent } from "@/lib/types";
import { formatDateRange } from "@/lib/events";

const disciplineLabel: Record<RaceEvent["discipline"], string> = {
  motorsport: "Motosport",
  cycling: "Biciklizam",
};

const disciplineColor: Record<RaceEvent["discipline"], string> = {
  motorsport: "var(--red)",
  cycling: "var(--blue)",
};

export default function EventCard({ event, past = false, index }: { event: RaceEvent; past?: boolean; index: number }) {
  const accent = disciplineColor[event.discipline];
  return (
    <Link
      href={`/eventi/${event.id}`}
      style={{ borderLeftColor: accent }}
      className={`group relative block overflow-hidden rounded-sm border border-(--border-soft) border-l-4 bg-(--bg-elevated) px-6 py-5 transition hover:border-(--border) hover:bg-(--bg-elevated-2) ${
        past ? "opacity-55" : ""
      }`}
    >
      <span className="font-display absolute -top-1.5 right-3 text-7xl leading-none text-(--foreground) opacity-[0.06] select-none">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span
              style={{ background: accent }}
              className="inline-flex items-center rounded-sm px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white"
            >
              {disciplineLabel[event.discipline]}
            </span>
            <span className="inline-flex items-center rounded-sm border border-(--border) px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-(--text-dim)">
              {event.category}
            </span>
            {event.status === "tentative" && (
              <span className="inline-flex items-center rounded-sm bg-(--amber) px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-black/80">
                okvirni datum
              </span>
            )}
          </div>
          <h3 className="font-display text-2xl leading-[1.03] uppercase group-hover:text-(--red) transition-colors">
            {event.name}
          </h3>
          <p className="mt-2 text-sm text-(--text-dim)">
            <span className="font-semibold text-(--foreground)">{event.location}</span> · {event.region}
          </p>
        </div>
        <div className="shrink-0">
          <span className="font-display inline-block whitespace-nowrap rounded-sm bg-(--bg-elevated-2) px-3 py-1.5 text-base tracking-wide">
            {formatDateRange(event.date_start, event.date_end)}
          </span>
        </div>
      </div>
    </Link>
  );
}
