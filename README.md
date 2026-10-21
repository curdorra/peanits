# peanits

Free sight-reading practice for pianists, by Yirschen. Play the note shown; peanits listens through your
microphone or a MIDI keyboard. Graded units, guides, and history. No account, no paywall; progress stays in
your browser.

## Structure

Today (`/`, starts `/session`) · Practise (`/practice`) · My grade (`/grades/…`, the grade saved in Settings) · Library (`/learn`) · Settings.
"Grade" always means an exam grade; the note-reading course is in Parts I–III.

## Develop

```bash
npm run dev     # http://localhost:3000
npm run build
```

- `src/lib/` — notes, keys/scales, sight-reading generator, curriculum (note-reading stages), progress store, mic pitch detection, Web MIDI, synth
- `src/components/` — Drill (note reading), SightReader + Score (melodies), Keyboard (on-screen keys), Quiz, learn/* widgets
- `src/content/boards.ts` — ABRSM (2027 & 2028) and Trinity (from 2023) grade data, summarised from the official syllabuses
- `src/content/lessons.tsx`, `composers.ts`, `glossary.ts`, `articles.ts` — Learn content (check facts before publishing changes)
- `design/style-board-v3.html` — the visual reference (cream paper, one ink, pencil illustrations)
- `scripts/gen-art.ts` — regenerates the metronome drawing (`node scripts/gen-art.ts`)
- `scripts/gen-icons.mjs` — regenerates the app icons in `public/` (`node scripts/gen-icons.mjs`)
- `src/app/manifest.ts`, `public/sw.js` — installable app and offline cache (the service worker only registers in production builds)
- `scripts/resolve-scores.ts` — looks up each piece's IMSLP page into `src/content/scores.json` (`node scripts/resolve-scores.ts`); rerun after adding pieces
