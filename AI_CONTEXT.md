# AI Context - Lofi ATC Player

This document provides context for AI assistants working on this project.

## Project Overview

**Lofi ATC Player** is a Next.js web application that combines live Air Traffic Control (ATC) radio streams with lofi background music. Users can select from major US airports to listen to real-time ATC communications while enjoying ambient music.

## Current State (as of last session)

### Completed Features

- ✅ Page restructure with modular components
- ✅ Header with global ATC status indicator
- ✅ Searchable airport list (9 major US airports)
- ✅ ATC player with connection status monitoring
- ✅ Lofi music player with local MP3 support
- ✅ Status indicators (green/yellow/red)
- ✅ Auto-retry on connection failure

### Pending Features

- ⏳ Spotify integration for user playlists
- ⏳ More airports
- ⏳ User preferences/settings persistence
- ⏳ Dark/light theme toggle

## Architecture

### Component Hierarchy

```
app/page.tsx (Main Page)
├── Header.tsx (App branding + global status)
├── AirportSearch.tsx (Search input)
├── AirportList.tsx (Airport selection)
│   └── ATCStatusIndicator.tsx (Per-airport status)
├── ATCPlayer.tsx (ATC audio controls)
│   └── ATCStatusIndicator.tsx (Current stream status)
└── MusicPlayer.tsx (Lofi music controls)
```

### State Management

- Uses React `useState` and `useCallback` hooks
- Airport statuses stored in `Record<string, ConnectionStatus>`
- No external state management library

### Key Types

```typescript
// Connection status for ATC streams
type ConnectionStatus = "connected" | "connecting" | "error" | "idle";

// Airport data structure
interface Airport {
  code: string; // IATA code (e.g., "LAX")
  icao: string; // ICAO code (e.g., "KLAX")
  name: string; // Full airport name
  city: string; // City name
  state: string; // State abbreviation
  streamUrl: string; // LiveATC stream URL
}
```

## LiveATC Integration

### Stream URL Format

```
http://d.liveatc.net/{icao_lowercase}_twr
```

Example: `http://d.liveatc.net/klax_twr` for LAX Tower

### Important Notes

- LiveATC uses ICAO codes (K + IATA for US airports)
- Streams are MP3 format over HTTP
- May have CORS restrictions in some browsers
- Connection can be spotty; auto-retry is implemented

## File Locations

| Purpose          | File                                |
| ---------------- | ----------------------------------- |
| Main page        | `app/page.tsx`                      |
| Airport data     | `data/airports.ts`                  |
| ATC player       | `components/ATCPlayer.tsx`          |
| Music player     | `components/MusicPlayer.tsx`        |
| Status indicator | `components/ATCStatusIndicator.tsx` |
| Local audio      | `public/audio/`                     |

## Styling

- Uses Tailwind CSS 4
- Dark theme by default (gray-900 background)
- Glassmorphism effects (backdrop-blur, semi-transparent backgrounds)
- Custom scrollbar styling

## Development Commands

```bash
npm run dev    # Start dev server (http://localhost:3000)
npm run build  # Production build
npm run lint   # ESLint check
```

## Known Issues

1. LiveATC streams may fail due to CORS in some browsers
2. Some airports may have intermittent stream availability
3. Volume slider styling varies by browser

## Next Steps for AI Sessions

When continuing development:

1. **Spotify Integration** - User requested OAuth authentication to play their own playlists
   - Will need Spotify Developer credentials
   - Implement OAuth 2.0 PKCE flow
   - Use Spotify Web Playback SDK

2. **Additional Airports** - Can add more by following the pattern in `data/airports.ts`

3. **Testing** - No automated tests yet; consider adding Jest/React Testing Library

## Conversation History Summary

1. Initial setup: Next.js project with basic audio player
2. Removed yt-dlp and ffmpeg files (handled externally)
3. Restructured page with new component architecture
4. Fixed LiveATC stream URLs (ICAO codes)
5. User requested Spotify integration (pending)
6. Created documentation for version control
