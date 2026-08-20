import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">🏁 Race Eventi</span>
        </Link>
        <p className="text-sm text-black/50 dark:text-white/50 hidden sm:block">
          Motosport i biciklizam u Hrvatskoj
        </p>
      </div>
    </header>
  );
}
