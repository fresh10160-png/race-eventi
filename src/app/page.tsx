import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import EventFilters from "@/components/EventFilters";
import { events } from "@/lib/events";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Motosport i biciklističke utrke u Hrvatskoj
        </h1>
        <p className="text-black/60 dark:text-white/60 mb-8">
          Rally, brdske utrke, kartinzi, kružne staze, cestovne i MTB utrke — sve na jednom mjestu.
        </p>
        <EventFilters events={events} />
      </main>
      <SiteFooter />
    </>
  );
}
