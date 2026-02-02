"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import AirportSearch from "@/components/AirportSearch";
import AirportList from "@/components/AirportList";
import ATCPlayer from "@/components/ATCPlayer";
import MusicPlayer from "@/components/MusicPlayer";
import { ConnectionStatus } from "@/components/ATCStatusIndicator";
import { airports, searchAirports, Airport } from "@/data/airports";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [airportStatuses, setAirportStatuses] = useState<
    Record<string, ConnectionStatus>
  >({});

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

            {/* Music Player */}
            <MusicPlayer />
          </div>
        </div>
      </main>
    </div>
  );
}
