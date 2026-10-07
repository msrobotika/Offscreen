# Validation record — 7 October 2026

## Automated constraint regression

Command: `node --test tests/ranking.test.mjs` — passed.
216 scenarios across 18 preferred missions, three time budgets and four locations. Every result contains three distinct missions, three observation types, a compatible location and a duration no greater than the selected budget. This test uses synthetic scores and does not validate embedding quality.

TypeScript: `node node_modules/typescript/bin/tsc --noEmit` — passed after correcting a JSX fragment.

## Actual browser inference

Chrome in the supervised preview, actual Transformers.js 3.8.1, MiniLM q8, WASM, no mocked inference.

### Quiet reset, park, 10-minute budget

Prompt: `I need a quiet reset. I like birds and noticing small things.`

Observed cards:
- Listen for a bird conversation — 3 min
- Watch one minute of movement — 3 min
- Find a tiny world — 2 min

UI explicitly reported `Ready. Chosen on your device.` and `OPEN MODEL · ON DEVICE`. Total 8 minutes.

### Family imagination, park, 6-minute budget

Prompt: `A playful outdoor story game with children and imagination.`

Observed cards:
- Give a cloud a story — 2 min
- Collect a colour palette — 2 min
- Draw a sound map — 2 min

UI explicitly reported model success. Total 6 minutes. Different input and tighter time budget produced a different feasible plan.

## Limits

These are two smoke tests, not a representative semantic-quality benchmark. Desktop presentation visually inspected. Mobile and Safari/Firefox have not been independently tested. No outdoor use, user satisfaction, clinical benefits or prize result is claimed. The separate Node inference dependency installation failed while downloading an optional ONNX runtime binary; the browser/WASM path above succeeded.
