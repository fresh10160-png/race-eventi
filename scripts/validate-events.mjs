#!/usr/bin/env node
// Validates data/events.json against the schema the app expects.
// Exits 1 with a description of every problem found; exits 0 with a summary on success.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, "..", "data", "events.json");

const REQUIRED_FIELDS = [
  "id",
  "name",
  "discipline",
  "category",
  "date_start",
  "date_end",
  "location",
  "region",
  "organizer",
  "description",
  "website",
  "source",
  "status",
];
const DISCIPLINES = new Set(["motorsport", "cycling"]);
const STATUSES = new Set(["confirmed", "tentative"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

let raw;
try {
  raw = readFileSync(dataPath, "utf8");
} catch (err) {
  console.error(`Cannot read ${dataPath}: ${err.message}`);
  process.exit(1);
}

let events;
try {
  events = JSON.parse(raw);
} catch (err) {
  console.error(`Invalid JSON in ${dataPath}: ${err.message}`);
  process.exit(1);
}

const errors = [];

if (!Array.isArray(events)) {
  console.error("events.json must be a JSON array at the top level.");
  process.exit(1);
}

const seenIds = new Set();

events.forEach((e, i) => {
  const tag = `[${i}] ${e && e.id ? e.id : "(no id)"}`;

  if (typeof e !== "object" || e === null) {
    errors.push(`${tag}: entry is not an object`);
    return;
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in e)) {
      errors.push(`${tag}: missing field "${field}"`);
    }
  }

  if (typeof e.id === "string") {
    if (!ID_RE.test(e.id)) {
      errors.push(`${tag}: id "${e.id}" is not kebab-case (lowercase letters, digits, single hyphens)`);
    }
    if (seenIds.has(e.id)) {
      errors.push(`${tag}: duplicate id "${e.id}"`);
    }
    seenIds.add(e.id);
  }

  if (e.discipline !== undefined && !DISCIPLINES.has(e.discipline)) {
    errors.push(`${tag}: discipline "${e.discipline}" must be "motorsport" or "cycling"`);
  }

  if (e.status !== undefined && !STATUSES.has(e.status)) {
    errors.push(`${tag}: status "${e.status}" must be "confirmed" or "tentative"`);
  }

  for (const dateField of ["date_start", "date_end"]) {
    if (e[dateField] !== undefined) {
      if (!DATE_RE.test(e[dateField])) {
        errors.push(`${tag}: ${dateField} "${e[dateField]}" is not YYYY-MM-DD`);
      } else if (Number.isNaN(new Date(`${e[dateField]}T00:00:00Z`).getTime())) {
        errors.push(`${tag}: ${dateField} "${e[dateField]}" is not a real calendar date`);
      }
    }
  }

  if (
    typeof e.date_start === "string" &&
    typeof e.date_end === "string" &&
    DATE_RE.test(e.date_start) &&
    DATE_RE.test(e.date_end) &&
    e.date_end < e.date_start
  ) {
    errors.push(`${tag}: date_end (${e.date_end}) is before date_start (${e.date_start})`);
  }

  for (const urlField of ["website", "source"]) {
    const v = e[urlField];
    if (typeof v === "string" && v !== "" && !/^https?:\/\//.test(v)) {
      errors.push(`${tag}: ${urlField} "${v}" is not empty and not a valid http(s) URL`);
    }
  }

  for (const strField of ["name", "category", "location", "region", "organizer", "description"]) {
    if (typeof e[strField] === "string" && e[strField].trim() === "") {
      errors.push(`${tag}: ${strField} is empty`);
    }
  }
});

if (errors.length > 0) {
  console.error(`events.json failed validation with ${errors.length} problem(s):\n`);
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

const motorsport = events.filter((e) => e.discipline === "motorsport").length;
const cycling = events.filter((e) => e.discipline === "cycling").length;
console.log(`OK: ${events.length} events valid (${motorsport} motorsport, ${cycling} cycling).`);
