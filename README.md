# Offscreen

Three small outdoor missions, selected by an open embedding model on your device. Built by MS ROBOTIKA for the Hacktoberfest Open-Source AI Challenge, Week 1 (Touch Grass), starting 6 October 2026.

## Try it

Write an idea in English, choose your time and surroundings, and click **Make my pocket card**. The first run downloads the model and WebAssembly runtime (tens of MB). After selection, print the card or download its plain-text version, then put your phone away.

The initial card is explicitly a **sample**, not an AI result. A failed model load never quietly falls back to a fake AI output. No account, paid inference service, location permission or API key is needed by the application.

## How it works

1. A module Web Worker loads Transformers.js 3.8.1 and the quantized `Xenova/all-MiniLM-L6-v2` model, pinned to revision `751bff37182d3f1213fa05d7196b954e230abad9`.
2. Mean-pooled, normalized 384-dimensional embeddings represent the user's idea and 18 curated mission descriptions.
3. Dot products of normalized vectors give cosine similarity.
4. An exhaustive search over feasible triples maximizes total similarity while enforcing the time limit, compatible surroundings and three different observation types.
5. The UI receives only the selected cards. The user can print, download or mark them complete.

The model reads meaning; deterministic constraints decide what fits. The runtime runs in the browser using WASM, one thread, with no GPU requirement. The catalogue embeddings are reused within the session. Browser caching of model assets is best effort; a fully offline web application is **not** claimed. A downloaded or printed card is usable offline.

## Privacy and boundaries

Your idea is not sent to an inference API. Model files are fetched from Hugging Face and runtime files from jsDelivr; those providers receive normal network metadata. There is no analytics SDK or application prompt log. The hosting service handles normal website requests. Loading third-party executable code has the usual dependency trust implications; runtime version and model revision are pinned.

Offscreen does not identify species, recommend foraging, generate routes, check weather, or know whether a place is safe or accessible. Activities are intended to be observed from a safe stationary spot, adapted to what is visible. Local conditions and individual needs take priority. Mission durations are estimates, not timers.

## Run locally

Node >=22.13 and pnpm are required. This repository uses the Vinext/React starter.

```sh
pnpm install
pnpm dev
```

For a production build:

```sh
pnpm build
```

The application source is `app/page.tsx`, `app/globals.css`, `public/missions.json` and `public/ai/`. The rest includes framework and deployment scaffolding. Browser model inference requires access to Hugging Face and jsDelivr. Do not add API keys.

## Validation

```sh
node --test tests/ranking.test.mjs
pnpm exec tsc --noEmit
```

The constraint regression evaluates 216 combinations (18 preferred cards × 3 budgets × 4 settings). It checks exactly three distinct missions, three types, the budget and the location constraint. These are algorithm tests with synthetic similarities, not a measure of model quality.

Actual Chrome/WASM inference was also exercised on 7 October 2026. See `docs/VALIDATION.md` for prompts and observed results. No outdoor user study or cross-browser claim is made.

## License and credits

Original product code and catalogue: MIT, see LICENSE. Model and Transformers.js: Apache-2.0. The bundled starter and dependencies retain their own licenses. Photograph by Daniel Gomez on Unsplash, under the Unsplash License. See `public/ATTRIBUTION.txt`.

AI-assisted development: the assistant generated and revised code, copy and tests under the project owner's direction. No human outdoor testing is claimed.
