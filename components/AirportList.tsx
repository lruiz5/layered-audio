"use client";

import { Airport } from "@/data/airports";
import ATCStatusIndicator, { ConnectionStatus } from "./ATCStatusIndicator";

interface AirportListProps {
  airports: Airport[];
  selectedAirport: Airport | null;
  onSelectAirport: (airport: Airport) => void;
  airportStatuses: Record<string, ConnectionStatus>;
}

export default function AirportList({
  airports,
  selectedAirport,
  onSelectAirport,
  airportStatuses,
}: AirportListProps) {
  if (airports.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No airports found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
      {airports.map((airport) => {
        const isSelected = selectedAirport?.code === airport.code;
        const status = airportStatuses[airport.code] || "idle";

        return (
          <button
            key={airport.code}
            onClick={() => onSelectAirport(airport)}
            className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
              isSelected
                ? "bg-blue-600/20 border border-blue-500"
                : "bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600"
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Airport Code */}
              <div
                className={`text-lg font-bold ${
                  isSelected ? "text-blue-400" : "text-white"
                }`}
              >
                {airport.code}
              </div>

              {/* Airport Details */}
              <div className="text-left">
                <div className="text-sm text-gray-300">{airport.name}</div>
                <div className="text-xs text-gray-500">
                  {airport.city}, {airport.state}
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <ATCStatusIndicator status={status} size="md" />
          </button>
        );
      })}
    </div>
  );
}
