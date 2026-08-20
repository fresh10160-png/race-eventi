import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ChequeredMark from "@/components/ChequeredMark";
import { events, formatDateRange } from "@/lib/events";

const disciplineLabel = {
  motorsport: "Motosport",
  cycling: "Biciklizam",
} as const;

const disciplineColor = {
  motorsport: "var(--red)",
  cycling: "var(--blue)",
} as const;

export function generateStaticParams() {
  return events.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = events.find((e) => e.id === id);
  if (!event) return {};
  return {
    title: `${event.name} — Race Eventi`,
    description: event.description,
  };
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = events.find((e) => e.id === id);
  if (!event) notFound();
  const accent = disciplineColor[event.discipline];

  return (
    <>
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 py-6">
        <Link href="/" className="text-sm font-semibold text-(--text-mute) hover:text-(--foreground)">
          ← Natrag na sve utrke
        </Link>

        <section
          className="relative overflow-hidden rounded-md border border-(--border) mt-4 px-6 sm:px-10 py-10 sm:py-12"
          style={{ background: "linear-gradient(120deg, var(--bg-elevated) 0%, var(--background) 65%)" }}
        >
          <div
            className="pointer-events-none absolute -top-3/5 -right-[6%] w-[460px] h-[260%] opacity-[0.16] -skew-x-8"
            style={{
              background:
                "repeating-linear-gradient(16deg, var(--red) 0px, var(--red) 40px, transparent 40px, transparent 80px)",
            }}
          />
          <ChequeredMark size={40} className="absolute top-7 right-7 sm:right-9" />

          <div className="relative flex flex-wrap items-center gap-2 mb-4">
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
                okvirni datum — provjerite kod organizatora
              </span>
            )}
          </div>

          <h1 className="relative font-display text-4xl sm:text-5xl leading-[0.98] uppercase max-w-2xl">
            {event.name}
          </h1>
        </section>

        <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <dt className="text-xs font-bold uppercase tracking-widest text-(--text-mute) mb-1.5">Datum</dt>
            <dd className="font-semibold text-base">{formatDateRange(event.date_start, event.date_end)}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-widest text-(--text-mute) mb-1.5">Lokacija</dt>
            <dd className="font-semibold text-base">
              {event.location}, {event.region}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-widest text-(--text-mute) mb-1.5">Organizator</dt>
            <dd className="font-semibold text-base">{event.organizer}</dd>
          </div>
          {event.website && (
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-(--text-mute) mb-1.5">Web stranica</dt>
              <dd className="font-semibold text-base">
                <a
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--blue) hover:underline decoration-1 underline-offset-2"
                >
                  {event.website.replace(/^https?:\/\//, "")}
                </a>
              </dd>
            </div>
          )}
        </dl>

        {event.description && (
          <p className="mt-8 text-(--text-dim) leading-relaxed max-w-2xl">{event.description}</p>
        )}

        {event.source && (
          <p className="mt-10 text-xs text-(--text-mute)">
            Izvor podataka:{" "}
            <a href={event.source} target="_blank" rel="noopener noreferrer" className="underline decoration-1 underline-offset-2">
              {event.source}
            </a>
          </p>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
