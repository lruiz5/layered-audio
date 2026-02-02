# Lofi ATC Player 🎧✈️

A relaxing web application that combines live Air Traffic Control (ATC) radio streams with lofi music for a unique ambient experience.

## Features

- **Live ATC Streams** - Listen to real-time air traffic control communications from major US airports
- **Connection Status Indicators** - Visual feedback showing stream health (green/yellow/red)
- **Searchable Airport List** - Find airports by code, name, city, or state
- **Lofi Music Player** - Background music with volume control
- **Responsive Design** - Works on desktop and mobile devices

## Supported Airports (West to East)

| Code | ICAO | Airport Name                     | City              |
| ---- | ---- | -------------------------------- | ----------------- |
| LAX  | KLAX | Los Angeles International        | Los Angeles, CA   |
| SFO  | KSFO | San Francisco International      | San Francisco, CA |
| SEA  | KSEA | Seattle-Tacoma International     | Seattle, WA       |
| PHX  | KPHX | Phoenix Sky Harbor               | Phoenix, AZ       |
| DEN  | KDEN | Denver International             | Denver, CO        |
| ORD  | KORD | O'Hare International             | Chicago, IL       |
| ATL  | KATL | Hartsfield-Jackson International | Atlanta, GA       |
| JFK  | KJFK | John F. Kennedy International    | New York, NY      |
| BOS  | KBOS | Logan International              | Boston, MA        |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Audio**: HTML5 Audio API
- **ATC Streams**: LiveATC.net

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd project-baharat

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
project-baharat/
├── app/
│   ├── page.tsx          # Main page component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── Header.tsx        # App header with branding
│   ├── ATCStatusIndicator.tsx  # Connection status dot
│   ├── AirportSearch.tsx # Search input component
│   ├── AirportList.tsx   # Scrollable airport list
│   ├── ATCPlayer.tsx     # ATC audio controls
│   └── MusicPlayer.tsx   # Lofi music controls
├── data/
│   └── airports.ts       # Airport data and search helper
└── public/
    └── audio/            # Local MP3 files
```

## Status Indicators

- 🟢 **Green** - Connected and playing
- 🟡 **Yellow** - Connecting or buffering
- 🔴 **Red** - Connection error (auto-retry enabled)

## Scripts

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

## License

MIT

## Acknowledgments

- [LiveATC.net](https://www.liveatc.net/) for ATC streams
- Lofi music community for ambient tracks
