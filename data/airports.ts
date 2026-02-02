export interface Airport {
  code: string; // IATA code (display)
  icao: string; // ICAO code (for streams)
  name: string;
  city: string;
  state: string;
  streamUrl: string;
}

// Airports ordered from West to East
// Using ICAO codes (K + IATA) for LiveATC streams
export const airports: Airport[] = [
  {
    code: "LAX",
    icao: "KLAX",
    name: "Los Angeles International",
    city: "Los Angeles",
    state: "CA",
    streamUrl: "http://d.liveatc.net/klax_twr",
  },
  {
    code: "SFO",
    icao: "KSFO",
    name: "San Francisco International",
    city: "San Francisco",
    state: "CA",
    streamUrl: "http://d.liveatc.net/ksfo_twr",
  },
  {
    code: "SEA",
    icao: "KSEA",
    name: "Seattle-Tacoma International",
    city: "Seattle",
    state: "WA",
    streamUrl: "http://d.liveatc.net/ksea_twr",
  },
  {
    code: "PHX",
    icao: "KPHX",
    name: "Phoenix Sky Harbor",
    city: "Phoenix",
    state: "AZ",
    streamUrl: "http://d.liveatc.net/kphx_twr",
  },
  {
    code: "DEN",
    icao: "KDEN",
    name: "Denver International",
    city: "Denver",
    state: "CO",
    streamUrl: "http://d.liveatc.net/kden_twr",
  },
  {
    code: "ORD",
    icao: "KORD",
    name: "O'Hare International",
    city: "Chicago",
    state: "IL",
    streamUrl: "http://d.liveatc.net/kord_twr",
  },
  {
    code: "ATL",
    icao: "KATL",
    name: "Hartsfield-Jackson International",
    city: "Atlanta",
    state: "GA",
    streamUrl: "http://d.liveatc.net/katl_twr",
  },
  {
    code: "JFK",
    icao: "KJFK",
    name: "John F. Kennedy International",
    city: "New York",
    state: "NY",
    streamUrl: "http://d.liveatc.net/kjfk_twr",
  },
  {
    code: "BOS",
    icao: "KBOS",
    name: "Logan International",
    city: "Boston",
    state: "MA",
    streamUrl: "http://d.liveatc.net/kbos_twr",
  },
];

// Helper function to search airports
export function searchAirports(query: string): Airport[] {
  if (!query.trim()) return airports;

  const lowerQuery = query.toLowerCase();
  return airports.filter(
    (airport) =>
      airport.code.toLowerCase().includes(lowerQuery) ||
      airport.icao.toLowerCase().includes(lowerQuery) ||
      airport.name.toLowerCase().includes(lowerQuery) ||
      airport.city.toLowerCase().includes(lowerQuery) ||
      airport.state.toLowerCase().includes(lowerQuery),
  );
}
