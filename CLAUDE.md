# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a complete Ogura Hyakunin Isshu (小倉百人一首) competition system - a traditional Japanese classical poetry web application. It's designed as an interactive karuta (card game) training system with authentic Japanese aesthetics, featuring speech synthesis, timing functions, and educational content.

## Technology Stack

- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Audio**: Web Speech API for Japanese text-to-speech
- **Styling**: Traditional Japanese design with CSS Grid/Flexbox
- **Data**: Static JSON structure in karuta-data.js
- **Typography**: Noto Serif CJK JP (Japanese serif fonts)
- **Development**: Live Server via npm for local development

## Development Commands

```bash
# Start development server with live reload (preferred)
npm run dev                # Port 8000

# Alternative development servers
npm start                  # Live server default port
npm run serve             # HTTP server on port 3000

# Direct file access (works but limited functionality)
# Simply open index.html in browser
```

## Core Architecture

### Application Structure
- **KarutaSystem Class** (`script.js`): Main application controller managing all functionality
- **Component-based DOM Management**: Elements cached and managed through centralized object
- **Event-driven Architecture**: All interactions handled through event listeners
- **State Management**: Internal state tracking for poems, timers, speech synthesis

### Key Components
1. **Poem Selection System**: Random selection and manual browsing of 100 classical poems
2. **Speech Synthesis Engine**: Japanese text-to-speech with configurable speed (0.3-2.0x)
3. **Competition Timer**: Precision timing for karuta competition practice
4. **Progressive Display**: Staged revelation (upper verse → lower verse → reading → meaning)
5. **Search/Filter System**: Real-time filtering of poem collection
6. **Responsive UI**: Mobile-optimized traditional Japanese card design

### Data Structure (`karuta-data.js`)
Each poem contains:
- `number`: Position in the classical 100-poem sequence
- `author`: Historical poet name
- `kamiNoKu`: Upper verse (first part)
- `shimoNoKu`: Lower verse (second part) 
- `reading`: Phonetic reading in hiragana
- `meaning`: Modern Japanese interpretation

## Core Functionality

### Speech System
- Utilizes Web Speech API with Japanese language support
- Real-time speed adjustment during playback
- Automatic voice selection for Japanese content
- Cross-platform compatibility (quality varies by OS)

### Competition Features
- Random poem selection mimicking actual competition
- Precision timer for practice sessions
- Progressive answer revelation for learning
- Traditional karuta card visual presentation

### User Interface
- Authentic Japanese aesthetic with traditional colors
- Responsive design for mobile karuta practice
- Intuitive controls optimized for quick competition use
- Search functionality for specific poem lookup

## File Organization

```
├── index.html           # Main application HTML structure
├── script.js           # Core application logic (KarutaSystem class)
├── style.css           # Traditional Japanese styling and responsive design
├── karuta-data.js      # Classical poetry data (currently 10 poems, expandable to 100)
├── package.json        # Development server configuration
└── README.md          # Japanese documentation and usage guide
```

## Development Notes

### Adding New Poems
Extend `HYAKUNIN_ISSHU` array in `karuta-data.js`:
```javascript
{
    number: 11,
    author: "参議篁", 
    kamiNoKu: "わたの原 八十島かけて 漕ぎ出でぬと",
    shimoNoKu: "人には告げよ 海人の釣舟",
    reading: "わたのはら やそしまかけて こぎいでぬと ひとにはつげよ あまのつりぶね",
    meaning: "広い海原の多くの島々を目指して漕ぎ出したと、人には告げてくれ、海人の釣舟よ"
}
```

### Customizing Speech
Modify speech parameters in `readPoem()` method:
- `utterance.rate`: Speech speed (0.1-10.0)
- `utterance.pitch`: Voice pitch (0.0-2.0)  
- `utterance.volume`: Audio volume (0.0-1.0)

### Styling Modifications
Key CSS classes for visual customization:
- `.poem-card`: Main poem display styling
- `.container`: Overall application container
- `.btn`: Button styling and colors
- Traditional color variables defined at top of CSS file

## Browser Compatibility

- **Chrome/Edge**: Full functionality including high-quality Japanese TTS
- **Safari**: Complete support with good Japanese voice quality  
- **Firefox**: Basic functionality, limited TTS quality
- **Mobile browsers**: Responsive design optimized for iOS Safari and Android Chrome

## Performance Considerations

- No external dependencies or build process required
- Minimal JavaScript footprint with vanilla implementation
- CSS-only animations and transitions
- Efficient DOM manipulation through element caching
- Local storage not implemented (stateless design for competition use)