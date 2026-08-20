"use client";

import { useMemo, useState } from "react";
import type { Discipline } from "@/lib/types";
import { CATEGORIES_BY_DISCIPLINE, OTHER_CATEGORY } from "@/lib/categories";
import { CROATIAN_REGIONS } from "@/lib/regions";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "w-full rounded-sm border border-(--border) bg-(--bg-elevated-2) px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-(--red)/40 placeholder:text-(--text-mute) placeholder:font-normal";
const labelClass = "block text-xs font-bold uppercase tracking-widest text-(--text-mute) mb-1.5";

export default function SubmitEventForm() {
  const [discipline, setDiscipline] = useState<Discipline>("motorsport");
  const [category, setCategory] = useState<string>("");
  const [customCategory, setCustomCategory] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [issueUrl, setIssueUrl] = useState("");

  const categories = useMemo(() => CATEGORIES_BY_DISCIPLINE[discipline], [discipline]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const finalCategory = category === OTHER_CATEGORY ? customCategory.trim() : category;

    const payload = {
      name: form.get("name"),
      discipline,
      category: finalCategory,
      date_start: form.get("date_start"),
      date_end: form.get("date_end"),
      location: form.get("location"),
      region: form.get("region"),
      organizer: form.get("organizer"),
      website: form.get("website"),
      description: form.get("description"),
      submitter_contact: form.get("submitter_contact"),
      website_hp: form.get("website_hp"), // honeypot, left empty by real users
    };

    try {
      const res = await fetch("/api/submit-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Prijava nije uspjela. Pokušajte kasnije.");
        return;
      }
      setStatus("success");
      setIssueUrl(data.issueUrl || "");
    } catch {
      setStatus("error");
      setErrorMsg("Prijava nije uspjela — provjerite internetsku vezu i pokušajte ponovno.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-md border border-(--border) bg-(--bg-elevated) px-6 py-8 text-center">
        <p className="font-display text-2xl uppercase mb-2">Hvala na prijavi!</p>
        <p className="text-(--text-dim)">
          Utrku smo zaprimili i pregledat ćemo je prije dodavanja na stranicu.
        </p>
        {issueUrl && (
          <a
            href={issueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-sm text-(--blue) underline decoration-1 underline-offset-2"
          >
            Pogledaj status prijave
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot — hidden from real users, bots tend to fill every field they find in the DOM. */}
      <div className="h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website_hp">Ne popunjavajte ovo polje</label>
        <input type="text" id="website_hp" name="website_hp" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className={labelClass}>Disciplina</label>
        <div className="flex gap-2">
          {(["motorsport", "cycling"] as Discipline[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setDiscipline(d);
                setCategory("");
              }}
              className={`rounded-sm px-4 py-2.5 text-sm font-extrabold uppercase tracking-wide border transition ${
                discipline === d
                  ? "bg-(--red) border-(--red) text-white"
                  : "border-(--border) text-(--text-dim) hover:border-(--red)/60 hover:text-(--foreground)"
              }`}
            >
              {d === "motorsport" ? "Motosport" : "Biciklizam"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="name">
          Naziv utrke *
        </label>
        <input id="name" name="name" required maxLength={200} className={fieldClass} placeholder="npr. 46. Buzetski dani" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="category">
            Kategorija *
          </label>
          <select
            id="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={fieldClass}
          >
            <option value="" disabled>
              Odaberite kategoriju
            </option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value={OTHER_CATEGORY}>{OTHER_CATEGORY}</option>
          </select>
          {category === OTHER_CATEGORY && (
            <input
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              required
              maxLength={100}
              placeholder="Upišite kategoriju"
              className={`${fieldClass} mt-2`}
            />
          )}
        </div>
        <div>
          <label className={labelClass} htmlFor="region">
            Regija *
          </label>
          <select id="region" name="region" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Odaberite regiju
            </option>
            {CROATIAN_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="date_start">
            Datum početka *
          </label>
          <input id="date_start" name="date_start" type="date" required className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="date_end">
            Datum završetka
          </label>
          <input id="date_end" name="date_end" type="date" className={fieldClass} />
          <p className="text-xs text-(--text-mute) mt-1">Ostavite prazno ako je jednodnevna utrka.</p>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="location">
          Lokacija (grad/mjesto) *
        </label>
        <input id="location" name="location" required maxLength={200} className={fieldClass} placeholder="npr. Buzet" />
      </div>

      <div>
        <label className={labelClass} htmlFor="organizer">
          Organizator *
        </label>
        <input id="organizer" name="organizer" required maxLength={200} className={fieldClass} placeholder="npr. AK Buzet" />
      </div>

      <div>
        <label className={labelClass} htmlFor="website">
          Web stranica utrke
        </label>
        <input id="website" name="website" type="url" maxLength={200} className={fieldClass} placeholder="https://…" />
      </div>

      <div>
        <label className={labelClass} htmlFor="description">
          Opis
        </label>
        <textarea id="description" name="description" rows={3} maxLength={2000} className={fieldClass} placeholder="Kratak opis utrke…" />
      </div>

      <div>
        <label className={labelClass} htmlFor="submitter_contact">
          Vaš kontakt (nije javno, samo ako trebamo provjeriti nešto)
        </label>
        <input id="submitter_contact" name="submitter_contact" maxLength={200} className={fieldClass} placeholder="e-mail ili telefon (neobavezno)" />
      </div>

      {status === "error" && (
        <p className="rounded-sm bg-(--amber)/10 border border-(--amber)/40 text-(--amber) text-sm px-4 py-3">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto rounded-sm bg-(--red) px-8 py-3 text-sm font-extrabold uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {status === "submitting" ? "Šaljem…" : "Pošalji prijavu"}
      </button>
    </form>
  );
}
