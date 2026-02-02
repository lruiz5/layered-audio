# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Spotify integration for user playlists
- More airport options
- User preferences persistence

## [0.2.0] - 2024-XX-XX

### Added

- New modular component architecture
- Header component with global ATC status indicator
- Searchable airport list (search by code, name, city, state)
- ATCStatusIndicator component with animated status dots
- ATCPlayer component with connection monitoring
- MusicPlayer component for lofi music
- 9 major US airports (LAX, SFO, SEA, PHX, DEN, ORD, ATL, JFK, BOS)
- Auto-retry on ATC connection failure
- ICAO code support for LiveATC streams
- Comprehensive documentation (README, AI_CONTEXT, TODO, CHANGELOG)

### Changed

- Restructured page layout with two-column design
- Updated LiveATC stream URLs to use direct format
- Improved status indicator with three states (connected, connecting, error)

### Removed

- Old AudioPlayer.tsx component (replaced with ATCPlayer + MusicPlayer)
- yt-dlp.exe and ffmpeg files (handled externally)

## [0.1.0] - 2024-XX-XX

### Added

- Initial Next.js 16 project setup
- TypeScript configuration
- Tailwind CSS 4 styling
- Basic AudioPlayer component
- Live ATC stream playback (KJFK, KLAX, KSFO)
- MP3 track playback with looping
- Independent volume controls
- Dark theme UI

---

## Version History Summary

| Version | Description                              |
| ------- | ---------------------------------------- |
| 0.2.0   | Page restructure with modular components |
| 0.1.0   | Initial release with basic functionality |
