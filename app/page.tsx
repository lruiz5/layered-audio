"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import AirportSearch from "@/components/AirportSearch";
import AirportList from "@/components/AirportList";
import ATCPlayer from "@/components/ATCPlayer";
import MusicPlayer from "@/components/MusicPlayer";
import PlexAuth from "@/components/PlexAuth";
import PlexBrowser from "@/components/PlexBrowser";
import PlexPlayer from "@/components/PlexPlayer";
import { ConnectionStatus } from "@/components/ATCStatusIndicator";
import { airports, searchAirports, Airport } from "@/data/airports";
import { PlexUser, PlexTrack } from "@/lib/plex/types";
import { clearAuthToken } from "@/lib/plex/auth";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [airportStatuses, setAirportStatuses] = useState<
    Record<string, ConnectionStatus>
  >({});

  // Plex state
  const [plexUser, setPlexUser] = useState<PlexUser | null>(null);
  const [plexToken, setPlexToken] = useState<string | null>(null);

  const filteredAirports = searchAirports(searchQuery);

  const handleStatusChange = useCallback(
    (code: string, status: ConnectionStatus) => {
      setAirportStatuses((prev) => ({
        ...prev,
        [code]: status,
      }));
    },
    [],
  );

  const handlePlexAuthChange = useCallback(
    (user: PlexUser | null, token: string | null) => {
      setPlexUser(user);
      setPlexToken(token);
    },
    [],
  );

  const handlePlexTrackSelect = useCallback(
    (track: PlexTrack, serverUrl: string) => {
      if (typeof window !== "undefined" && (window as any).plexPlayer) {
        (window as any).plexPlayer.playTrack(track, serverUrl);
      }
    },
    [],
  );

  const handlePlexTracksSelect = useCallback(
    (tracks: PlexTrack[], serverUrl: string) => {
      if (typeof window !== "undefined" && (window as any).plexPlayer) {
        (window as any).plexPlayer.playTracks(tracks, serverUrl);
      }
    },
    [],
  );

  // Determine global status based on selected airport
  const globalStatus: ConnectionStatus = selectedAirport
    ? airportStatuses[selectedAirport.code] || "idle"
    : "idle";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <Header globalStatus={globalStatus} />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Airport Selection - Half Width */}
          <div className="space-y-4">
            {/* Search */}
            <AirportSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Airport List */}
            <AirportList
              airports={filteredAirports}
              selectedAirport={selectedAirport}
              onSelectAirport={setSelectedAirport}
              airportStatuses={airportStatuses}
            />
          </div>

          {/* Players - Narrower */}
          <div className="space-y-4">
            {/* ATC Player */}
            <ATCPlayer
              airport={selectedAirport}
              onStatusChange={handleStatusChange}
            />

            {/* Music Player - Show Plex or Local */}
            {plexUser && plexToken ? (
              <>
                {/* Plex Browser */}
                <PlexBrowser
                  authToken={plexToken}
                  user={plexUser}
                  onTrackSelect={handlePlexTrackSelect}
                  onTracksSelect={handlePlexTracksSelect}
                  onDisconnect={async () => {
                    // Call logout API (optional, but good practice)
                    await fetch("/api/plex/logout", { method: "POST" }).catch(
                      console.error,
                    );
                    // Clear local data
                    clearAuthToken();
                    handlePlexAuthChange(null, null);
                  }}
                />

                {/* Plex Player */}
                <PlexPlayer authToken={plexToken} />
              </>
            ) : (
              <>
                {/* Plex Auth Button */}
                <PlexAuth onAuthChange={handlePlexAuthChange} />

                {/* Local Music Player */}
                <MusicPlayer />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
