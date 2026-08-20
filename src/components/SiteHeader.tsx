import Link from "next/link";
import ChequeredMark from "@/components/ChequeredMark";

export default function SiteHeader() {
  return (
    <header className="border-b border-(--border)">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <ChequeredMark size={30} />
          <span className="font-display text-2xl leading-none">
            RACE <span className="text-(--red)">EVENTI</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-(--text-mute) hidden sm:block">
            Motosport &amp; Biciklizam u Hrvatskoj
          </p>
          <Link
            href="/prijavi"
            className="rounded-sm bg-(--red) px-3.5 py-2 text-xs font-extrabold uppercase tracking-wide text-white hover:opacity-90"
          >
            Prijavi utrku
          </Link>
        </div>
      </div>
    </header>
  );
}
