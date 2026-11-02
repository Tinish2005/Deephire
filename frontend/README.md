# DeepHire frontend

React 19, Vite, React Router and Recharts. Talks to the FastAPI backend at `http://127.0.0.1:8000` (see `src/lib/signals.js` and `src/services/`).

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
```

## Structure

- `src/styles/theme.css`: design system (tokens, layout, components). One colour per signal: resume, interview, voice, vision.
- `src/pages/`: `Home`, `InterviewFlow` (the assessment), `Dashboard`, `History`.
- `src/components/flow/steps.jsx`: the five assessment steps.
- `src/components/ui.jsx`: `ScoreRing`, `Meter`, `Spinner`.
- `src/services/`: API calls (unchanged).
