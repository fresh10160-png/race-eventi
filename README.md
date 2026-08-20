# Race Eventi

Web aplikacija koja prikazuje motosport i biciklističke utrke u Hrvatskoj — rally, brdske utrke, kartinzi, kružne staze, cestovne i MTB utrke.

## Razvoj

```bash
npm install
npm run dev
```

Otvorite [http://localhost:3000](http://localhost:3000).

## Podaci

Popis utrka nalazi se u [`data/events.json`](./data/events.json). Svaki događaj ima naziv, disciplinu (`motorsport` ili `cycling`), kategoriju, datum, lokaciju, organizatora i link na službenu stranicu. Za dodavanje ili ažuriranje utrka, uredite taj JSON.

## Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
