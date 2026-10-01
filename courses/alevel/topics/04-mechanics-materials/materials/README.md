# AQA A-level Physics Materials Learning Lab

Netlify-ready interactive teaching app for AQA A-level Physics 7408 section 3.4.2 Materials.

## Included
- 8 sequenced lessons with retrieval, teaching, worked examples, simulation missions and auto-marked checks
- 7-chapter textbook with clickable equation breakdowns
- 6 interactive simulations: density, Hooke's law, loading/unloading, elastic energy, stress-strain and Young modulus
- Formula Coach for the main Materials equations
- Required Practical 4 virtual Young modulus experiment with data table, graph, best-fit Young modulus and CSV export
- 16-question Mastery Hub
- Extended-response formative auto-marking
- AQA specification map
- Local lesson progress saving plus JSON export/import backup
- Responsive desktop/mobile layout
- Installable PWA with offline app-shell caching after the first visit

## Deploy to Netlify

### Fastest: drag and drop
1. Unzip this folder.
2. In Netlify, use **Add new project → Deploy manually** (or drag the folder into Netlify Drop).
3. Upload the folder that contains `index.html`.
4. Netlify will publish it as a static site. No API keys, server or database are required.

### Git-based deployment
The included `netlify.toml` uses the repository root as the publish directory and runs `npm run check` before deployment.

- Build command: `npm run check`
- Publish directory: `.`
- Node version: `20`

## Local check
- `npm run check` validates JavaScript syntax, app sections, Netlify files and service-worker cache references.
- `npm run serve` serves the project locally on port 4173.

## Storage
Student progress is stored in the browser with `localStorage`. The app also supports progress export/import, which is useful because a static Netlify deployment has no user database by default.
