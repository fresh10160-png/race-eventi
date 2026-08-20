import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { events, formatDateRange } from "@/lib/events";

const disciplineLabel = {
  motorsport: "Motosport",
  cycling: "Biciklizam",
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

  return (
    <>
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-8">
        <Link href="/" className="text-sm text-black/50 dark:text-white/50 hover:underline">
          ← Natrag na sve utrke
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-black/5 dark:bg-white/10 px-2.5 py-1 text-xs font-medium">
            {disciplineLabel[event.discipline]}
          </span>
          <span className="inline-flex items-center rounded-full bg-black/5 dark:bg-white/10 px-2.5 py-1 text-xs font-medium">
            {event.category}
          </span>
          {event.status === "tentative" && (
            <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-600/20">
              okvirni datum — provjerite kod organizatora
            </span>
          )}
        </div>

        <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">{event.name}</h1>

        <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-black/50 dark:text-white/50">Datum</dt>
            <dd className="font-medium">{formatDateRange(event.date_start, event.date_end)}</dd>
          </div>
          <div>
            <dt className="text-black/50 dark:text-white/50">Lokacija</dt>
            <dd className="font-medium">
              {event.location}, {event.region}
            </dd>
          </div>
          <div>
            <dt className="text-black/50 dark:text-white/50">Organizator</dt>
            <dd className="font-medium">{event.organizer}</dd>
          </div>
          {event.website && (
            <div>
              <dt className="text-black/50 dark:text-white/50">Web stranica</dt>
              <dd className="font-medium">
                <a href={event.website} target="_blank" rel="noopener noreferrer" className="underline decoration-1 underline-offset-2">
                  {event.website.replace(/^https?:\/\//, "")}
                </a>
              </dd>
            </div>
          )}
        </dl>

        {event.description && (
          <p className="mt-6 text-black/80 dark:text-white/80 leading-relaxed">{event.description}</p>
        )}

        {event.source && (
          <p className="mt-8 text-xs text-black/40 dark:text-white/40">
            Izvor podataka:{" "}
            <a href={event.source} target="_blank" rel="noopener noreferrer" className="underline">
              {event.source}
            </a>
          </p>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
