# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ogura Hyakunin Isshu (小倉百人一首) competition system — an interactive karuta card game trainer with speech synthesis, competitive timing, and educational content. Deployable as a PWA, GitHub Pages site, or Electron desktop app.

## Development Commands

```bash
# Web development (preferred)
npm run dev        # Live server with reload on port 8000
npm start          # Live server default port
npm run serve      # http-server on port 3000

# Fallback
python3 -m http.server 8000
```

No automated tests — verify manually in browser. Web Speech API requires Chrome/Edge for best Japanese TTS quality.

## Architecture

### Files
- `index.html` — single-page app layout; all UI structure defined here with IDs matching `initializeElements()`
- `style.css` — all styling; dark mode via `.dark-mode` class on `<body>`
- `script.js` — `KarutaSystem` class, instantiated once at page load as global `karutaSystem`
- `karuta-data.js` — `HYAKUNIN_ISSHU` array (100 poems), imported as global before `script.js`
- `sw.js` — service worker for PWA offline caching; update `CACHE_NAME` constant when assets change
- `manifest.json` — PWA manifest
- `main.js` — Electron entry point (not used in web mode)
- `package-electron.json` — separate package.json for Electron builds (see below)

### KarutaSystem class (`script.js`)

Single class managing all state and behavior. `karutaSystem` is a `let` global initialized inside `DOMContentLoaded`.

- **`initializeElements()`** — caches all DOM elements by ID into `this.elements`
- **`bindEvents()`** — wires all event listeners against `this.elements`
- **Speech system** — splits `poem.reading` on whitespace into 5 segments (空白区切りの5句); calls `window.speechSynthesis` with per-segment pitch/rate/volume from `this.intonationPatterns[]`; `pronunciationControlEnabled` corrects は/わ particles before reading via `processPronunciation()`
- **Three read modes** (important differences in button state):
  - `readPoem()` — calls `readPoemWithPauses()` → `updateReadingButtons(true)`, which disables ALL read buttons and shows the pause/resume button
  - `readCompletePoem()` and `readShimoOnly()` — only disable their own button; the pause/resume button is NOT shown for these modes
  - `readShimoOnly()` reads `segments.slice(3)` — segments at indices 3–4 (the 下の句、七・七)
- **Pause/resume**: stores `currentSegmentIndex` so resume continues from the interrupted segment; only functional when reading was started via `readPoem()`
- **State**: `currentPoem`, `isReading`, `isPaused`, `isRepeating`, `isDarkMode`
- **`localStorage` keys**: `'karutaHistory'` (JSON array, max 100; de-duplicated by poem number — re-selecting a poem moves it to the top) and `'karutaDarkMode'` ('true'/'false' string)
- **Sort**: `sortedPoems` array reordered by `currentSortOrder` ('number' | 'author' | 'kami' | 'shimo' | 'season'); season order: 春→夏→秋→冬→恋→雑

### Global variable and inline handlers

`karutaSystem` is a module-level `let` global. The `showHistory()` method generates HTML with inline `onclick="karutaSystem.selectPoemFromHistory(...)"`. If renaming the global, update that method too.

`selectPoem(index)` takes an index into `sortedPoems[]` (not a poem number), so the same index refers to different poems when the sort order changes.

### Poem data structure (`karuta-data.js`)
```javascript
{
    number: 1,           // 1–100
    author: "天智天皇",
    kamiNoKu: "秋の田の かりほの庵の 苫をあらみ",   // upper verse (displayed first)
    shimoNoKu: "わが衣手は 露にぬれつつ",            // lower verse (hidden until revealed)
    reading: "あきのたの かりほのいほの とまをあらみ わがころもでは つゆにぬれつつ",  // 5 whitespace-delimited phrases
    meaning: "...",            // modern Japanese meaning
    season: "秋"               // 春|夏|秋|冬|恋|雑
}
```

> **Note**: `karuta-data.js` has a `season` field per poem, but `script.js` also maintains a separate `this.seasonData` object (poem number → season) that the display code actually uses. When adding poems, update **both**.

## Electron Desktop App

A separate Electron configuration exists alongside the web app:

```bash
# Swap in the Electron package.json, then install and run
cp package-electron.json package.json
npm install
npm start          # launches Electron window

# Build distributable (outputs to dist/)
npm run build
```

The GitHub Actions workflow (`.github/workflows/build.yml`) triggers on `v*` tags and builds for macOS, Linux, and Windows using this same swap. It uses `GH_TOKEN` secret for release uploads.

## PWA / Service Worker

`sw.js` caches all static assets under a versioned `CACHE_NAME` (currently `ogura-hyaku-v3`). When modifying assets, increment this version string to force cache invalidation on next visit.

## Design System

- Font: Noto Serif CJK JP (Japanese serif)
- Theme: brown/gold (`#8b4513`) with seasonal accent colors per `season` field (defined in `applySeasonColor()`)
- Dark mode: toggled via `isDarkMode` state, applies `.dark-mode` to `document.body`, persisted in `localStorage`; initialized from `localStorage` in `initializeDarkMode()` called from constructor
