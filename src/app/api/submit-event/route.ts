import { NextResponse } from "next/server";
import { CROATIAN_REGIONS } from "@/lib/regions";

const REPO = "fresh10160-png/race-eventi";
const MAX_SHORT = 200;
const MAX_LONG = 2000;

type Payload = {
  name: string;
  discipline: string;
  category: string;
  date_start: string;
  date_end: string;
  location: string;
  region: string;
  organizer: string;
  website: string;
  description: string;
  submitter_contact: string;
  website_hp: string; // honeypot
};

function clean(value: unknown, maxLen: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLen) : "";
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(request: Request) {
  let body: Partial<Payload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Neispravan zahtjev." }, { status: 400 });
  }

  // Honeypot: bots fill every field, real users never see or fill this one.
  if (clean(body.website_hp, MAX_SHORT) !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, MAX_SHORT);
  const discipline = clean(body.discipline, 20);
  const category = clean(body.category, MAX_SHORT);
  const date_start = clean(body.date_start, 10);
  const date_end = clean(body.date_end, 10) || date_start;
  const location = clean(body.location, MAX_SHORT);
  const region = clean(body.region, MAX_SHORT);
  const organizer = clean(body.organizer, MAX_SHORT);
  const website = clean(body.website, MAX_SHORT);
  const description = clean(body.description, MAX_LONG);
  const submitter_contact = clean(body.submitter_contact, MAX_SHORT);

  const errors: string[] = [];
  if (!name) errors.push("Naziv utrke je obavezan.");
  if (discipline !== "motorsport" && discipline !== "cycling") errors.push("Odaberite disciplinu.");
  if (!category) errors.push("Kategorija je obavezna.");
  if (!DATE_RE.test(date_start)) errors.push("Datum početka nije ispravan.");
  if (!DATE_RE.test(date_end)) errors.push("Datum završetka nije ispravan.");
  if (DATE_RE.test(date_start) && DATE_RE.test(date_end) && date_end < date_start) {
    errors.push("Datum završetka ne može biti prije datuma početka.");
  }
  if (!location) errors.push("Lokacija je obavezna.");
  if (!CROATIAN_REGIONS.includes(region)) errors.push("Odaberite regiju s popisa.");
  if (!organizer) errors.push("Organizator je obavezan.");
  if (website && !/^https?:\/\//.test(website)) errors.push("Web stranica mora početi s http:// ili https://.");

  if (errors.length > 0) {
    return NextResponse.json({ ok: false, error: errors.join(" ") }, { status: 400 });
  }

  const token = process.env.GITHUB_ISSUE_TOKEN;
  if (!token) {
    console.error("submit-event: GITHUB_ISSUE_TOKEN is not configured");
    return NextResponse.json(
      { ok: false, error: "Prijave trenutno nisu dostupne. Pokušajte kasnije." },
      { status: 500 }
    );
  }

  const submission = {
    name,
    discipline,
    category,
    date_start,
    date_end,
    location,
    region,
    organizer,
    website,
    description,
  };

  const bodyMarkdown = `Nova prijava utrke poslana putem javnog formulara na web stranici. Molimo provjeriti podatke prije dodavanja u \`data/events.json\`.

| Polje | Vrijednost |
|---|---|
| Naziv | ${name} |
| Disciplina | ${discipline} |
| Kategorija | ${category} |
| Datum | ${date_start}${date_end !== date_start ? ` – ${date_end}` : ""} |
| Lokacija | ${location} |
| Regija | ${region} |
| Organizator | ${organizer} |
| Web stranica | ${website || "(nije navedena)"} |

**Opis:**
${description || "(nije naveden)"}

${submitter_contact ? `**Kontakt prijavitelja (za eventualna pitanja):** ${submitter_contact}\n` : ""}
<!-- submission-json
${JSON.stringify(submission, null, 2)}
-->`;

  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `[Prijava] ${name} — ${date_start}`,
        body: bodyMarkdown,
        labels: ["utrka-prijava"],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("submit-event: GitHub API error", res.status, detail);
      return NextResponse.json(
        { ok: false, error: "Prijava nije uspjela. Pokušajte kasnije." },
        { status: 502 }
      );
    }

    const issue = await res.json();
    return NextResponse.json({ ok: true, issueUrl: issue.html_url as string });
  } catch (err) {
    console.error("submit-event: request failed", err);
    return NextResponse.json({ ok: false, error: "Prijava nije uspjela. Pokušajte kasnije." }, { status: 502 });
  }
}
