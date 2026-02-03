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
- ✅ Enhanced music player with 32 lofi tracks
- ✅ Shuffle, repeat modes, progress bar, keyboard shortcuts
- ✅ Status indicators (green/yellow/red)
- ✅ Auto-retry on connection failure
- ✅ **Plex Integration** - Full OAuth authentication and music playback

### Pending Features

- ⏳ Plex server/library selection UI
- ⏳ Queue management UI
- ⏳ More airports
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
├── MusicPlayer.tsx (Local lofi music controls)
├── PlexAuth.tsx (Plex OAuth login/logout)
├── PlexBrowser.tsx (Browse Plex playlists/artists/albums)
└── PlexPlayer.tsx (Plex music play back controls)
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

| Purpose           | File                                |
| ----------------- | ----------------------------------- |
| Main page         | `app/page.tsx`                      |
| Airport data      | `data/airports.ts`                  |
| ATC player        | `components/ATCPlayer.tsx`          |
| Music player      | `components/MusicPlayer.tsx`        |
| Plex auth         | `components/PlexAuth.tsx`           |
| Plex browser      | `components/PlexBrowser.tsx`        |
| Plex player       | `components/PlexPlayer.tsx`         |
| Plex types        | `lib/plex/types.ts`                 |
| Plex auth utils   | `lib/plex/auth.ts`                  |
| Plex API client   | `lib/plex/client.ts`                |
| Plex OAuth routes | `app/api/plex/auth/route.ts`        |
|                   | `app/api/plex/callback/route.ts`    |
|                   | `app/api/plex/logout/route.ts`      |
| Plex proxy        | `app/api/plex/proxy/route.ts`       |
| Status indicator  | `components/ATCStatusIndicator.tsx` |
| Local audio       | `public/audio/`                     |

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

## Plex Integration

### OAuth Flow

1. User clicks "Connect to Plex"
2. App creates auth pin via `/api/plex/auth`
3. Opens `https://app.plex.tv/auth` in popup window
4. User authorizes the app
5. App polls `/api/plex/callback` for auth token
6. Stores token in localStorage
7. Fetches user info and servers
8. Auto-selects first owned server
9. Loads music libraries and playlists

### API Routes

- `POST /api/plex/auth` - Create auth pin
- `GET /api/plex/callback?pinId=X` - Poll for auth token
- `POST /api/plex/logout` - Clear auth token
- `GET /api/plex/proxy?url=X&token=Y` - Proxy Plex server requests (CORS bypass)

### Key Features

- Browse playlists, artists, albums
- Search music library
- Full playback controls (play/pause/skip/shuffle/repeat)
- Queue management
- Progress bar with scrubbing
- Volume control

### Connection Selection

The client prefers non-local connections (public/Tailscale/relay) for server-side proxy compatibility. This ensures the Next.js server can reach Plex servers behind private networks.

## Known Issues

1. LiveATC streams may fail due to CORS in some browsers
2. Some airports may have intermittent stream availability
3. Volume slider styling varies by browser
4. Plex OAuth requires popup window (may be blocked)
5. Plex servers behind private networks need public/Tailscale access for proxy

## Next Steps for AI Sessions

When continuing development:

1. **Plex Enhancements**
   - Server selection UI (if multiple servers)
   - Library selection UI (if multiple music libraries)
   - Queue management UI
   - Album artwork display
   - Better error handling

2. **Additional Airports** - Can add more by following the pattern in `data/airports.ts`

3. **Testing** - No automated tests yet; consider adding Jest/React Testing Library

## Recent Changes (Latest Session)

### Plex Integration Implementation

**Files Created:**

- `lib/plex/types.ts` - TypeScript interfaces for Plex API
- `lib/plex/auth.ts` - OAuth utilities (pin creation, token management)
- `lib/plex/client.ts` - Plex API client with proxy support
- `components/PlexAuth.tsx` - OAuth login/logout UI
- `components/PlexBrowser.tsx` - Browse playlists/artists/albums
- `components/PlexPlayer.tsx` - Full playback controls
- `app/api/plex/auth/route.ts` - Create auth pin endpoint
- `app/api/plex/callback/route.ts` - OAuth callback polling
- `app/api/plex/logout/route.ts` - Logout endpoint
- `app/api/plex/proxy/route.ts` - CORS bypass proxy

**Files Modified:**

- `app/page.tsx` - Integrated Plex components
- `app/globals.css` - Added custom scrollbar styles
- `package.json` - Added uuid dependency

**Key Fixes:**

1. Fixed OAuth URL from `plex.tv/auth` to `app.plex.tv/auth`
2. Fixed server detection to handle direct array response (not MediaContainer)
3. Removed `navigator.userAgent` for server-side compatibility
4. Added server-side API routes to bypass CORS
5. Implemented connection selection preferring public/Tailscale URLs
6. Created proxy endpoint for Plex server requests

**Dependencies Added:**

- `uuid` - For generating unique client identifiers
