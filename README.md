# peanits

Free sight-reading practice for pianists, by Yirschen. Play the note shown; peanits listens through your
microphone or a MIDI keyboard. Graded units, guides, and history. No account, no paywall; progress stays in
your browser.

## Develop

```bash
npm run dev     # http://localhost:3000
npm run build
```

- `src/lib/` — notes, curriculum (grades/units), progress store, pitch detection (mic) and Web MIDI
- `src/components/Drill.tsx` — the practice round
- `src/content/articles.ts` — the guides (check facts before publishing changes)
- `design/style-board-v3.html` — the visual reference (cream paper, one ink, pencil illustrations)
- `scripts/gen-art.ts` — regenerates the metronome drawing (`node scripts/gen-art.ts`)
