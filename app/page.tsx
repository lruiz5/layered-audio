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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <Header globalStatus={globalStatus} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Airport Selection */}
          <div className="lg:col-span-2 space-y-4">
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

          {/* Right Column - Players */}
          <div className="space-y-4">
            {/* ATC Player */}
            <ATCPlayer
              airport={selectedAirport}
              onStatusChange={handleStatusChange}
            />

            {/* Music Player - Show Plex or Local */}
            {plexUser && plexToken ? (
              <>
                {/* Plex Auth Status */}
                <PlexAuth onAuthChange={handlePlexAuthChange} />

                {/* Plex Browser */}
                <PlexBrowser
                  authToken={plexToken}
                  onTrackSelect={handlePlexTrackSelect}
                  onTracksSelect={handlePlexTracksSelect}
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
