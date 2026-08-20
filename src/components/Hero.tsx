export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-(--border) bg-(--bg-elevated)">
      <div
        className="pointer-events-none absolute -top-1/2 -right-[8%] w-[620px] h-[220%] opacity-[0.14] -skew-x-8"
        style={{
          background:
            "repeating-linear-gradient(16deg, var(--red) 0px, var(--red) 46px, transparent 46px, transparent 92px)",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-(--red) mb-4">
          <span className="w-6 h-[3px] bg-(--red)" />
          Sezona 2026
        </div>
        <h1 className="font-display text-5xl sm:text-6xl leading-[0.94] uppercase max-w-2xl">
          Utrke koje pokreću <span className="text-(--red)">Hrvatsku</span>
        </h1>
        <p className="mt-4 text-lg text-(--text-dim) max-w-xl leading-relaxed">
          Rally, brdske utrke, karting i drift — cestovne i MTB biciklističke utrke. Sve staze, svi datumi, jedna
          startna crta.
        </p>
      </div>
    </section>
  );
}
