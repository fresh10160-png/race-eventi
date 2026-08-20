import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Hero from "@/components/Hero";
import EventFilters from "@/components/EventFilters";
import { events } from "@/lib/events";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8">
        <EventFilters events={events} />
      </main>
      <SiteFooter />
    </>
  );
}
