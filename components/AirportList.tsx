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
      <div className="empty-state">
        <p className="empty-state-text">
          No airports found matching your search.
        </p>
      </div>
    );
  }

  // Group airports by category
  const internationalAirports = airports.filter(
    (airport) => airport.category === "International",
  );
  const regionalAirports = airports.filter(
    (airport) => airport.category === "Regional",
  );

  const renderAirportButton = (airport: Airport) => {
    const isSelected = selectedAirport?.code === airport.code;
    const status = airportStatuses[airport.code] || "idle";

    return (
      <button
        key={airport.code}
        onClick={() => onSelectAirport(airport)}
        className={`airport-btn ${isSelected ? "selected" : ""}`}
      >
        <div className="airport-btn-content">
          {/* Airport Code */}
          <div className="airport-code">{airport.code}</div>

          {/* Airport Name */}
          <div className="airport-name">{airport.name}</div>

          {/* Airport Location */}
          <div className="airport-location">
            {airport.city}, {airport.state}
          </div>
        </div>

        {/* Status Indicator */}
        <ATCStatusIndicator status={status} size="md" />
      </button>
    );
  };

  return (
    <div className="airport-list-container custom-scrollbar">
      {/* International Airports Section */}
      {internationalAirports.length > 0 && (
        <div className="airport-section">
          <h3 className="section-header">✈️ International Airports</h3>
          <div className="airport-grid">
            {internationalAirports.map(renderAirportButton)}
          </div>
        </div>
      )}

      {/* Regional Airports Section */}
      {regionalAirports.length > 0 && (
        <div className="airport-section">
          <h3 className="section-header">🛩️ Regional Airports</h3>
          <div className="airport-grid">
            {regionalAirports.map(renderAirportButton)}
          </div>
        </div>
      )}
    </div>
  );
}
