import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SubmitEventForm from "@/components/SubmitEventForm";

export const metadata: Metadata = {
  title: "Prijavi utrku — Race Eventi",
  description: "Prijavite motosport ili biciklističku utrku koja nedostaje na Race Eventi kalendaru.",
};

export default function SubmitEventPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 sm:px-6 py-10">
        <h1 className="font-display text-4xl uppercase mb-2">Prijavi utrku</h1>
        <p className="text-(--text-dim) mb-8">
          Znate za motosport ili biciklističku utrku koja nedostaje na popisu — pa i posve amatersku, klupsku?
          Prijavite je ovdje. Pregledat ćemo prijavu i dodati je na stranicu.
        </p>
        <SubmitEventForm />
      </main>
      <SiteFooter />
    </>
  );
}
