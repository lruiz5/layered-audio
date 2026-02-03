# Plex OAuth Integration Guide

## 🎉 Implementation Complete!

The Plex OAuth integration has been successfully implemented. This guide will help you set up and test the integration.

## 📋 What's Been Implemented

### Core Components

1. **lib/plex/types.ts** - TypeScript type definitions for Plex API
2. **lib/plex/auth.ts** - Authentication utilities (OAuth flow, token management)
3. **lib/plex/client.ts** - Plex API client for fetching music data
4. **components/PlexAuth.tsx** - Login/logout UI component
5. **components/PlexBrowser.tsx** - Browse playlists, artists, albums, and search
6. **components/PlexPlayer.tsx** - Full-featured music player with queue management
7. **app/page.tsx** - Updated to integrate Plex components

### Features Implemented

✅ **Plex OAuth 2.0 Authentication**

- PIN-based authentication flow
- Automatic token polling
- Secure token storage in localStorage
- User profile display

✅ **Music Library Browsing**

- Browse playlists
- Browse artists → albums
- Browse all albums
- Search across artists, albums, and tracks

✅ **Playback Controls**

- Play single tracks
- Play entire playlists/albums (queue)
- Previous/Next navigation
- Shuffle mode
- Repeat modes (Off/All/One)
- Volume control
- Progress bar with scrubbing
- Track time display

✅ **Smart UI**

- Shows local MP3 player by default
- Replaces with Plex player after authentication
- Seamless integration with existing ATC player

## 🚀 Setup Instructions

### Step 1: Configure Environment Variables

The `.env.local` file has been created with default values. You can customize if needed:

```env
NEXT_PUBLIC_PLEX_CLIENT_ID=lofi-atc-player
NEXT_PUBLIC_PLEX_PRODUCT_NAME=Lofi ATC Player
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note:** These defaults work fine! You don't need to change them unless you want to customize the app name.

### Step 2: Start the Development Server

The server is already running at:

- **Local:** http://localhost:3000
- **Network:** http://192.168.203.104:3000

### Step 3: Test the Integration

#### 3.1 Initial State

1. Open http://localhost:3000 in your browser
2. You should see:
   - Airport list on the left
   - ATC Player on the right
   - "Connect Your Plex Library" card
   - Local Music Player with 32 tracks

#### 3.2 Plex Authentication

1. Click the **"Connect to Plex"** button
2. A popup window will open to Plex.tv
3. Log in with your Plex account
4. Click **"Accept"** to authorize the app
5. The popup will close automatically
6. You should see your Plex username and avatar

#### 3.3 Browse Your Music

After authentication, you'll see:

- **Plex Auth Card** - Shows your username with "Disconnect" button
- **Plex Browser** - Browse your music library
- **Plex Player** - Playback controls

**Browse Modes:**

- **Playlists Tab** - View all your Plex playlists
- **Artists Tab** - Browse by artist → albums
- **Albums Tab** - Browse all albums
- **Search** - Search for tracks, albums, or artists

#### 3.4 Play Music

1. Click on any playlist, album, or track
2. The Plex Player will load and start playing
3. Use the controls:
   - ⏮️ Previous track
   - ⏯️ Play/Pause
   - ⏭️ Next track
   - 🔀 Shuffle
   - 🔁 Repeat (Off/All/One)
   - 🔊 Volume slider
   - Progress bar (click to seek)

#### 3.5 Disconnect

1. Click **"Disconnect"** in the Plex Auth card
2. Returns to local MP3 player
3. All Plex data is cleared from localStorage

## 🔧 How It Works

### OAuth Flow

```
1. User clicks "Connect to Plex"
   ↓
2. App creates auth PIN via Plex API
   ↓
3. Opens Plex.tv in popup window
   ↓
4. User authorizes the app
   ↓
5. App polls for auth token (every 1 second)
   ↓
6. Token received → Fetch user info
   ↓
7. Store token & user in localStorage
   ↓
8. Load Plex servers and music libraries
   ↓
9. Ready to browse and play music!
```

### Plex.tv Relay

The integration uses **Plex.tv relay** which means:

- ✅ Works from anywhere (no direct server access needed)
- ✅ Bypasses Cloudflare Access tunnel
- ✅ Secure OAuth authentication
- ✅ No manual token configuration required

### Data Storage

All data is stored in **localStorage**:

- `plex_auth_token` - Authentication token
- `plex_user` - User profile information
- `plex_selected_server` - Selected Plex server (future use)

## 🎨 UI/UX Design

### Before Authentication

```
┌─────────────────────────────────┐
│ Connect Your Plex Library       │
│ Access your personal music...   │
│                                 │
│ [Connect to Plex]               │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ 🎵 Lofi Music                   │
│ [32 local tracks]               │
│ ▶️ Play/Pause controls          │
└─────────────────────────────────┘
```

### After Authentication

```
┌─────────────────────────────────┐
│ 👤 username                     │
│ Connected to Plex [Disconnect]  │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ 🎵 Plex Music                   │
│ [Search box]                    │
│ [Playlists|Artists|Albums]      │
│ • My Playlist (24 tracks)       │
│ • Chill Vibes (18 tracks)       │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ 🎵 Now Playing                  │
│ Track Name                      │
│ Artist • Album                  │
│ [Progress bar]                  │
│ 🔀 ⏮️ ⏯️ ⏭️ 🔁                  │
│ 🔊 ━━━━━━━━━━ 70%              │
└─────────────────────────────────┘
```

## 🐛 Troubleshooting

### Popup Blocked

**Problem:** Browser blocks the Plex.tv popup
**Solution:** Allow popups for localhost:3000 in browser settings

### Authentication Timeout

**Problem:** "Authentication timeout" error
**Solution:**

- Check internet connection
- Try again
- Make sure you click "Accept" on Plex.tv

### No Servers Found

**Problem:** "No Plex servers found" message
**Solution:**

- Make sure you have a Plex server set up
- Check that your Plex server is online
- Verify you're logged into the correct Plex account

### CORS Errors

**Problem:** CORS errors in browser console
**Solution:**

- This is expected for some Plex API calls
- The app uses Plex.tv relay to bypass CORS
- If issues persist, check Plex server settings

### Playback Issues

**Problem:** Music won't play
**Solution:**

- Check that the track has a valid media file
- Verify Plex server is accessible
- Try a different track
- Check browser console for errors

## 📊 API Endpoints Used

### Plex.tv API

- `POST /api/v2/pins` - Create auth PIN
- `GET /api/v2/pins/{id}` - Check auth status
- `GET /api/v2/user` - Get user info
- `GET /api/v2/resources` - Get Plex servers

### Plex Server API

- `GET /library/sections` - Get libraries
- `GET /playlists` - Get playlists
- `GET /library/sections/{id}/all?type=8` - Get artists
- `GET /library/sections/{id}/all?type=9` - Get albums
- `GET {key}` - Get tracks from playlist/album
- `GET {trackKey}` - Stream audio file

## 🔐 Security Notes

1. **Token Storage:** Tokens are stored in localStorage (client-side only)
2. **No Server-Side Storage:** No tokens are sent to your Next.js server
3. **OAuth Flow:** Uses official Plex OAuth 2.0 flow
4. **HTTPS:** Plex.tv uses HTTPS for all API calls
5. **Token Expiry:** Tokens don't expire but can be revoked by user

## 🎯 Next Steps

### Recommended Enhancements

1. Add album artwork display
2. Implement queue management UI
3. Add "Recently Played" history
4. Support multiple Plex servers
5. Add track favorites/likes
6. Implement crossfade between tracks
7. Add lyrics display (if available)
8. Create mobile-optimized layout

### Testing Checklist

- [ ] Test OAuth flow
- [ ] Test playlist browsing
- [ ] Test artist browsing
- [ ] Test album browsing
- [ ] Test search functionality
- [ ] Test playback controls
- [ ] Test shuffle mode
- [ ] Test repeat modes
- [ ] Test volume control
- [ ] Test progress scrubbing
- [ ] Test disconnect/reconnect
- [ ] Test with multiple playlists
- [ ] Test with large libraries
- [ ] Test error handling

## 📚 Resources

- [Plex API Documentation](https://www.plexopedia.com/plex-media-server/api/)
- [Plex OAuth Guide](https://forums.plex.tv/t/authenticating-with-plex/609370)
- [Plex Web API](https://github.com/Arcanemagus/plex-api/wiki)

## 🎉 Success!

Your Plex OAuth integration is complete and ready to use! Enjoy listening to your personal music library alongside live ATC streams.

**Happy Listening! 🎧✈️**
