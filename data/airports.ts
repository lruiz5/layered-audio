export interface Airport {
  code: string; // IATA code (display)
  icao: string; // ICAO code (for streams)
  name: string;
  city: string;
  state: string;
  streamUrl: string;
  category: "International" | "Regional";
}

// Major International Airports (ordered West to East, then International)
const internationalAirports: Airport[] = [
  {
    code: "LAX",
    icao: "KLAX",
    name: "Los Angeles International",
    city: "Los Angeles",
    state: "CA",
    streamUrl: "https://d.liveatc.net/klax_twr",
    category: "International",
  },
  {
    code: "SFO",
    icao: "KSFO",
    name: "San Francisco International",
    city: "San Francisco",
    state: "CA",
    streamUrl: "https://d.liveatc.net/ksfo_twr",
    category: "International",
  },
  {
    code: "DFW",
    icao: "KDFW",
    name: "Dallas/Fort Worth International",
    city: "Dallas",
    state: "TX",
    streamUrl: "https://d.liveatc.net/kdfw1_twr1_e",
    category: "International",
  },
  {
    code: "ATL",
    icao: "KATL",
    name: "Hartsfield-Jackson International",
    city: "Atlanta",
    state: "GA",
    streamUrl: "https://d.liveatc.net/katl_twr",
    category: "International",
  },
  {
    code: "JFK",
    icao: "KJFK",
    name: "John F. Kennedy International",
    city: "New York",
    state: "NY",
    streamUrl: "https://d.liveatc.net/kjfk_twr",
    category: "International",
  },
  {
    code: "BOS",
    icao: "KBOS",
    name: "Logan International",
    city: "Boston",
    state: "MA",
    streamUrl: "https://d.liveatc.net/kbos_twr",
    category: "International",
  },
  {
    code: "HNL",
    icao: "PHNL",
    name: "Daniel K. Inouye International",
    city: "Honolulu",
    state: "HI",
    streamUrl: "https://d.liveatc.net/phnl_twr",
    category: "International",
  },
  {
    code: "HND",
    icao: "RJTT",
    name: "Tokyo Haneda International",
    city: "Tokyo",
    state: "Japan",
    streamUrl: "https://d.liveatc.net/rjtt_twr",
    category: "International",
  },
];

// Regional Airports (ordered West to East)
const regionalAirports: Airport[] = [
  {
    code: "SBA",
    icao: "KSBA",
    name: "Santa Barbara Municipal",
    city: "Santa Barbara",
    state: "CA",
    streamUrl: "https://d.liveatc.net/ksba_app",
    category: "Regional",
  },
  {
    code: "BUR",
    icao: "KBUR",
    name: "Hollywood Burbank",
    city: "Burbank",
    state: "CA",
    streamUrl: "https://d.liveatc.net/kbur3_gnd_twr_134_2",
    category: "Regional",
  },
];

// Combined airports list (International first, then Regional)
export const airports: Airport[] = [
  ...internationalAirports,
  ...regionalAirports,
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
      airport.state.toLowerCase().includes(lowerQuery) ||
      airport.category.toLowerCase().includes(lowerQuery),
  );
}

// Helper function to get airports by category
export function getAirportsByCategory(
  category: "International" | "Regional",
): Airport[] {
  return airports.filter((airport) => airport.category === category);
}
