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
- `script.js` — `KarutaSystem` class, instantiated once at page load
- `karuta-data.js` — `HYAKUNIN_ISSHU` array (100 poems), imported as global before `script.js`
- `sw.js` — service worker for PWA offline caching; update `CACHE_NAME` constant when assets change
- `manifest.json` — PWA manifest
- `main.js` — Electron entry point (not used in web mode)
- `package-electron.json` — separate package.json for Electron builds (see below)

### KarutaSystem class (`script.js`)

Single class managing all state and behavior:
- **`initializeElements()`** — caches all DOM elements by ID into `this.elements`
- **`bindEvents()`** — wires all event listeners against `this.elements`
- **Speech system** — segments each poem into 5 phrases (5-7-5-7-7); calls `window.speechSynthesis` with per-segment pitch/rate/volume from `this.intonationPatterns[]`; `pronunciationControlEnabled` corrects は/わ particles before reading
- **State**: `currentPoem`, `isReading`, `isPaused`, `isRepeating`, `isDarkMode`, `practiceHistory` (persisted to `localStorage` as `'karutaHistory'`)
- **Sort**: `sortedPoems` array reordered by `currentSortOrder` ('number' | 'author' | 'kami' | 'shimo' | 'season'); season order: 春→夏→秋→冬→恋→雑

### Poem data structure (`karuta-data.js`)
```javascript
{
    number: 1,           // 1–100
    author: "天智天皇",
    kamiNoKu: "秋の田の かりほの庵の 苫をあらみ",   // upper verse (displayed first)
    shimoNoKu: "わが衣手は 露にぬれつつ",            // lower verse (hidden until revealed)
    reading: "あきのたの...",  // full kana reading
    meaning: "...",            // modern Japanese meaning
    season: "秋"               // 春|夏|秋|冬|恋|雑
}
```

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

`sw.js` caches all static assets under `CACHE_NAME = 'ogura-hyaku-v1'`. When modifying assets, increment this version string to force cache invalidation on next visit.

## Design System

- Font: Noto Serif CJK JP (Japanese serif)
- Theme: brown/gold (`#8b4513`) with seasonal accent colors per `season` field
- Dark mode: toggled via `isDarkMode` state, applies `.dark-mode` to `document.body`, persisted in `localStorage`
