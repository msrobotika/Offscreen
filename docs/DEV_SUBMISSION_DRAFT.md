---
title: "Offscreen: an open model that helps you put your phone away"
published: false
tags: devchallenge, hf26challenge
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05).*

## What I Built

I built **Offscreen**, a small outdoor mission planner. You tell it what kind of break you want, choose a time budget and your surroundings, and receive three things to notice outside.

A quiet reset might become a bird conversation, the movement of leaves, and a tiny patch of moss. A family game might begin with a cloud that needs a story. You can print the resulting pocket card or download it as text. The useful part of the experience happens after you close the app.

The scope is deliberately small: 18 curated missions, no feed, no streak, no required photo, no location permission. There is no species identification or foraging advice. The activities are designed around observation from a safe stationary spot, with the user adapting them to their actual surroundings.

## Demo

**Public live demo:** https://offscreen-field.msarobotika.chatgpt.site

To try the AI: leave the default English prompt, choose a park and 10 minutes, and press **Make my pocket card**. The first run downloads an open model and its runtime. A label distinguishes the initial sample card from an actual model result.

In an actual Chrome test, “I need a quiet reset. I like birds and noticing small things.” selected a bird-listening card, a movement-observation card and a tiny-details card, totalling eight minutes. A family-story prompt with a six-minute budget produced a different set: a cloud story, a colour palette and a sound map.

These are browser smoke tests. I have not yet taken this version outside or measured whether people spend less time on their phones.

## Code

**Public repository:** https://github.com/msrobotika/Offscreen

Original app code and mission catalogue are MIT licensed. Credits and model licenses are documented in the repository.

## How I Built It

Offscreen uses **Transformers.js 3.8.1** with the quantized **Xenova/all-MiniLM-L6-v2** embedding model. The model revision is pinned, and inference runs in a Web Worker with WebAssembly on the visitor's device.

The model embeds the user's idea and each mission description. Mean pooling and normalization let us compare them with cosine similarity. The planner then searches the feasible three-card combinations, choosing the highest total similarity subject to three rules: stay within the time budget, match the surroundings, and include three different observation types.

A greedy first version could choose one long card and leave too little time for the remaining two. I replaced that with exact constrained selection. With only 18 missions, checking all triples is straightforward. A regression test now checks 216 combinations of preferred card, time budget and surroundings.

The model does semantic matching; it does not generate safety instructions. If loading fails, the UI says so and leaves the sample visibly labelled. It never presents a predetermined fallback as a successful AI result.

The frontend uses React and Vinext. AI assistance was used to build and revise the implementation, copy and tests. The validation record separates actual browser inference from synthetic algorithm tests.

## Why Does Open Innovation Matter?

An open model makes a useful, bounded feature possible without an inference bill or sending each person's idea to a hosted model API. Its weights, runtime, catalogue and ranking logic can be inspected or replaced independently.

That does not make the application completely offline: the first run downloads model/runtime files, and the website itself needs to load. Third-party hosts receive normal request metadata. The offline deliverable is the printed or downloaded pocket card. I wanted that distinction to be explicit.

For this project, openness also makes the limitations easier to see. MiniLM is an English text embedding model, not an expert on a person's local environment. A small inspectable catalogue and deterministic constraints fit that capability better than asking a model to invent an outdoor itinerary.

## Prize Categories

Overall challenge. This version does not claim a partner-specific integration.
