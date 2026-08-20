import Link from "next/link";
import type { RaceEvent } from "@/lib/types";
import { formatDateRange } from "@/lib/events";

const disciplineLabel: Record<RaceEvent["discipline"], string> = {
  motorsport: "Motosport",
  cycling: "Biciklizam",
};

const disciplineStyle: Record<RaceEvent["discipline"], string> = {
  motorsport: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-400/20",
  cycling: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-400/20",
};

export default function EventCard({ event, past = false }: { event: RaceEvent; past?: boolean }) {
  return (
    <Link
      href={`/eventi/${event.id}`}
      className={`group block rounded-xl border border-black/10 dark:border-white/10 p-4 sm:p-5 transition hover:border-black/20 dark:hover:border-white/20 hover:shadow-sm ${
        past ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${disciplineStyle[event.discipline]}`}
            >
              {disciplineLabel[event.discipline]}
            </span>
            <span className="inline-flex items-center rounded-full bg-black/5 dark:bg-white/10 px-2 py-0.5 text-xs font-medium text-black/70 dark:text-white/70">
              {event.category}
            </span>
            {event.status === "tentative" && (
              <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-600/20">
                okvirni datum
              </span>
            )}
          </div>
          <h3 className="font-semibold text-base sm:text-lg leading-snug group-hover:underline decoration-1 underline-offset-2">
            {event.name}
          </h3>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            {event.location} · {event.region}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-medium whitespace-nowrap">{formatDateRange(event.date_start, event.date_end)}</p>
        </div>
      </div>
    </Link>
  );
}
