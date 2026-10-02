# Revision · GCSE & A-level Science

One AQA science revision app combining the original `gcse-course` and `alevel-course` repositories. The dashboard covers six courses and 44 specification topics (43 in Combined Science mode, which excludes Separate Physics Space Physics).

## Run and validate

Requires Node.js 24 or later. All five tools are bundled as ordinary files; no separate tool hosting or Git submodule downloads are needed.

```sh
npm ci
npm run dev
# Open http://localhost:3000
npm test
npm run test:marking
npm run build
npm start
```

`npm run build` prepares the course assets in `public/` and builds one Next.js application. `vercel.json` selects the Next.js framework and `.next` output for the existing Revision deployment. Deploy this repository at its root. `dist/` contains the static course assets only; the exam screens and marking endpoints require the complete Next.js deployment.

## Five tools in the same deployment

- A-level required practicals: `/courses/alevel/tools/practicals/index.html` (all 12 practicals and the original lab book).
- GCSE exam questions: `/tools/gcse-exam` (the complete original question bank and practice tools).
- A-level exam marking: `/tools/alevel-marking` (the complete original Physics marking and exam workflows).
- Practical simulator: `/tools/practical-sim/index.html` (the complete original simulator).
- Science graph practice: `/tools/graph-practice/index.html` (the supplied six-activity masterclass, improved with checked best fits, uncertainty bars, keyboard plotting, tangent practice, decimal area calculations and worked test review).

The dashboard has a Practice tools section. Existing course launchers point to local routes, and all five tools provide Revision navigation. Embedded course views still work on the same origin. GCSE and A-level handlers are isolated under `/api/gcse/*` and `/api/alevel/*`, with the original Physics Coach retained at `/api/physics-coach`.

Graph practice runs entirely in the browser without an AI key. Its utility styles are compiled locally during the build. Skill completion, latest test score and best score are saved on the device under `revision-graph-skills-v1`; in-progress datasets and unfinished tests restart on reload. It retains graph PNG export and all six activities. `tools/graph-practice/source.json` records the supplied file's checksum. This records practice completion, rather than certifying mastery or assigning official exam marks.

Set `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) on the Revision deployment for live AI marking and question generation. Typed-answer offline marking works without these keys. Image answers and other AI-only workflows still need a key. Keys configured on previous separate projects must also be configured on Revision; browser progress from another hostname does not migrate automatically.

The separate GCSE practical repository is not included. Source revisions are recorded in `sources.json`. Runtime sources are in `src/modules/gcse/`, `src/modules/alevel/`, `src/app/tools/` and `src/app/api/`; all tool data and handlers are bundled at build time.

## What's combined

- A shared responsive dashboard, GCSE / A-level filters, subject filters, topic and lesson search, and device progress summary.
- Consistent Revision branding and navigation on study pages. Embedded simulations keep their focused interface.
- All GCSE Biology, Chemistry and Physics content, with Combined / Separate Science selection.
- All A-level Physics, Biology and Chemistry content, including Physics topic apps, required practicals, Paper 3 options, and the original study tools.
- Direct links select the correct course, subject, topic and GCSE pathway. GCSE topic navigation supports browser Back / Forward.
- The latest study page is available through Continue studying.
- A shared Practise page with lesson-linked retrieval, missing-word and accuracy activities, plus 44 topic data challenges with worked solutions. Written answers are self-assessed; numeric and missing-word answers are checked automatically.
- A cloud Teacher workspace and My Work area with assignable topic quizzes, exam practice and guided revision. Students complete activities in the app with saved drafts, server-marked choice/numerical questions, worked feedback and attempt history. Teachers preview and customise questions, set deadlines/retries, review optional written answers, see class gaps and export results. See [ASSIGNED-ACTIVITIES.md](ASSIGNED-ACTIVITIES.md) for marking controls, database setup and verification.
- Original course storage keys are retained. Progress and notes already on the same origin remain readable; browser storage from a different deployed domain does not transfer automatically.

## Project layout

`index.html`, `dashboard.js`, `dashboard.css`: the combined entry point.

`shared/`: consistent navigation and theme for both courses.

`courses/gcse/` and `courses/alevel/`: complete local copies of both apps. A-level's ten pinned submodule repositories are bundled as ordinary files, with the upstream compatibility patches and Materials vendor assets applied.

`catalog.js` is generated from the bundled course data by `node scripts/catalog.cjs` (also regenerated by the build).

`practice-data.js` is generated from the lesson content by `node scripts/practice-catalog.cjs`. Regenerate it after changing lesson explanations or answers. The build also regenerates it. See [CONTENT-REVIEW.md](CONTENT-REVIEW.md) for review coverage, corrections, sources and validation limits.

`sources.json` records the exact upstream commit IDs. Original repository references are retained for attribution; the combined repository is [Revision-](https://github.com/markstevengray95-star/Revision-).

## Existing connected services

The existing account, subscription, teacher and cloud-sync integrations are preserved. Their original course entitlements still apply; this merge does not combine paid subscriptions or migrate backend databases. Register a new deployment's sign-in redirect URL with the existing authentication provider before testing login there.

Live Physics Coach requests require `AI_GATEWAY_API_KEY` in Vercel. Without it, the original client uses its offline tutor. Backend-connected account and payment workflows require their existing configured services. The root Teacher/My Work activity workflow was verified with temporary accounts against the connected Supabase project; its additive schema is in `supabase/topic-activities.sql`.

## Runtime fixes

GCSE lesson extensions now share a content-mount scheduler, instead of observing and repeatedly rewriting their own DOM. Mastery panels only rebuild when the lesson or mastery plan changes. Student and teacher panels update on slide changes without a class-attribute feedback loop.

## Sources

- [GCSE course](https://github.com/markstevengray95-star/gcse-course)
- [A-level course](https://github.com/markstevengray95-star/alevel-course)
- All topic and practical repositories listed in `sources.json`.
