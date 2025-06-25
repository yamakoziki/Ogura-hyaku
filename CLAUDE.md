# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a complete Ogura Hyakunin Isshu (小倉百人一首) competition system - a traditional Japanese classical poetry web application. It's designed as an interactive karuta (card game) training system with authentic Japanese aesthetics, featuring speech synthesis, timing functions, and educational content for practicing traditional Japanese poetry.

## Technology Stack

- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (ES6 classes, no frameworks)
- **Audio**: Web Speech API for Japanese text-to-speech with pronunciation controls
- **Styling**: Traditional Japanese design with CSS Grid/Flexbox and seasonal themes
- **Data**: Complete 100-poem dataset with season categorization
- **Typography**: Noto Serif CJK JP (Japanese serif fonts)
- **Development**: Live Server via npm for local development
- **Features**: PWA support, dark mode, practice history, advanced speech controls

## Development Commands

```bash
# Start development server with live reload (preferred)
npm run dev                # Port 8000

# Alternative development servers
npm start                  # Live server default port
npm run serve             # HTTP server on port 3000

# Simple Python server (fallback)
python3 -m http.server 8000
```

### Testing and Validation
- No automated testing framework - manual testing in browser
- Test text-to-speech functionality requires browser with Web Speech API support
- Verify responsive design on multiple screen sizes
- Test PWA installation on mobile devices

## Architecture

### Application Structure
- **KarutaSystem Class** (`script.js`): Main application controller managing all functionality
- **Component-based DOM Management**: Elements cached and managed through centralized object
- **Event-driven Architecture**: All interactions handled through event listeners
- **State Management**: Internal state tracking for poems, timers, speech synthesis, and user preferences

### Core Components

1. **KarutaSystem Class** (`script.js`): Main application controller
   - Manages poem selection, audio playback, timer functionality
   - Handles all user interactions and DOM manipulation
   - Integrates with Web Speech API for text-to-speech
   - Advanced features: pronunciation control, intonation patterns, practice history

2. **Poem Data** (`karuta-data.js`): Complete 100-poem dataset
   - Full Ogura Hyakunin Isshu collection with season categorization
   - Each poem includes: number, author, upper/lower verses, reading, meaning, season
   - Sortable by number, author, verse text, or season

3. **Advanced Features**:
   - Multiple speech modes (upper verse only, complete poem, lower verse only)
   - Pronunciation control for authentic Japanese reading
   - Intonation patterns mimicking traditional poetry recitation
   - Practice history with local storage
   - Dark mode with persistent settings
   - PWA support for mobile installation

### Data Structure

Poems follow this format in `karuta-data.js`:
```javascript
{
    number: 1,
    author: "天智天皇",
    kamiNoKu: "秋の田の かりほの庵の 苫をあらみ",
    shimoNoKu: "わが衣手は 露にぬれつつ", 
    reading: "あきのたの かりほのいほの とまをあらみ わがころもでは つゆにぬれつつ",
    meaning: "秋の田のそばの仮小屋の屋根を葺いた苫が粗いので、私の袖は露に濡れてしまう",
    season: "秋"
}
```

## Key Features

- **Random Selection**: Competitive practice mode with full 100-poem collection
- **Progressive Display**: Traditional competition format (upper verse first)
- **Advanced Speech Synthesis**: Multi-mode reading with pronunciation and intonation controls
- **Timer System**: Competition timing with pause/resume
- **Search & Sort**: Find poems by author, content, or season with multiple sort options
- **Practice History**: Track previously studied poems with timestamps
- **Traditional Design**: Authentic Japanese karuta card styling with seasonal color coding
- **PWA Support**: Installable web app for mobile devices
- **Dark Mode**: Eye-friendly alternative theme with persistent settings

## Speech System Features

### Pronunciation Control
- Automatic correction of は/わ particles for authentic Japanese reading
- Syllable-by-syllable parsing with natural pauses
- Configurable pause duration between verses

### Intonation Patterns
- Traditional poetry recitation patterns with pitch variation
- Speed and volume modulation per verse segment
- Mimics authentic karuta competition reading style

### Reading Modes
- **Standard**: Upper verse with natural progression
- **Complete**: Full poem reading with appropriate pauses
- **Lower verse only**: Practice mode for competitive play
- **Repeat mode**: Continuous practice with same poem

## Design System

- **Typography**: Noto Serif CJK JP (Japanese serif font)
- **Color Palette**: Traditional brown/gold Japanese colors with seasonal accents
- **Layout**: Card-based design mimicking physical karuta cards
- **Responsive**: CSS Grid and Flexbox for all screen sizes
- **Seasonal Themes**: Color-coded by season (春夏秋冬恋雑)

## Development Environment

- **Codespaces Optimized**: Uses default image for free tier efficiency
- **Ports**: 3000, 5000, 8000, 8080 forwarded for development
- **Extensions**: Live Server, Japanese language pack, auto-formatting
- **No Dependencies**: Pure web technologies, no build process required
- **PWA Manifest**: Progressive web app configuration included

## Performance Considerations

- No external dependencies or build process required
- Minimal JavaScript footprint with vanilla implementation
- CSS-only animations and transitions
- Efficient DOM manipulation through element caching
- Local storage for user preferences and practice history

## Browser Compatibility

- **Chrome/Edge**: Full functionality including high-quality Japanese TTS (recommended)
- **Safari**: Complete support with good Japanese voice quality  
- **Firefox**: Basic functionality, limited TTS quality
- **Mobile browsers**: Responsive design optimized for iOS Safari and Android Chrome
- **PWA Support**: Installation available on compatible browsers
- **Web Speech API**: Required for text-to-speech functionality