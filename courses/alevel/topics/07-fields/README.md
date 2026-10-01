# A-Level Physics Fields Learning Lab

Interactive teaching and self-study app for **AQA A-level Physics 7408, Section 3.7: Fields and their consequences**.

## What is included

- 18 sequenced lessons covering the complete Fields topic
- 12 interactive field, orbit, capacitor, magnetic, induction, AC and transformer models
- 30 calculation tools in the Formula Coach
- Required Practical 9: capacitor charge/discharge
- Required Practical 10: force on a current-carrying wire
- Required Practical 11: magnetic flux linkage and coil angle
- Retrieval starters, worked examples, application tasks, quick checks and exit tickets
- Mastery Hub for exam language, common misconceptions and mixed diagnostic questions
- AQA specification map
- Local progress tracking
- Responsive phone/tablet/desktop layout
- Installable PWA/offline cache

## Design

The interface deliberately follows the same learning-lab layout and visual system as the existing **Further Mechanics** app, while using an independent Fields lesson sequence, simulations, formula bank and practical activities.

## Run locally

This is a static web app. Open `index.html` through any static web server, or deploy the repository directly to Vercel/Netlify/GitHub Pages.

## Main files

- `index.html` — application shell and views
- `data.js` — lesson, simulation, formula and specification data
- `app.js` — navigation, progress, simulations, Formula Coach and practical interactions
- `styles.css` / `further.css` — shared Further Mechanics visual base
- `fields.css` — Fields-specific UI
- `manifest.webmanifest` / `sw.js` — installable/offline app support
