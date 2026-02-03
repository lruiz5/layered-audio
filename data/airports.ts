export interface Airport {
  code: string; // IATA code (display)
  icao: string; // ICAO code (for streams)
  name: string;
  city: string;
  state: string;
  streamUrl: string;
  category: "International" | "Regional";
}

// Major International Airports (ordered West to East)
const internationalAirports: Airport[] = [
  {
    code: "LAX",
    icao: "KLAX",
    name: "Los Angeles International",
    city: "Los Angeles",
    state: "CA",
    streamUrl: "http://d.liveatc.net/klax_twr",
    category: "International",
  },
  {
    code: "SFO",
    icao: "KSFO",
    name: "San Francisco International",
    city: "San Francisco",
    state: "CA",
    streamUrl: "http://d.liveatc.net/ksfo_twr",
    category: "International",
  },
  {
    code: "SEA",
    icao: "KSEA",
    name: "Seattle-Tacoma International",
    city: "Seattle",
    state: "WA",
    streamUrl: "http://d.liveatc.net/ksea_twr",
    category: "International",
  },
  {
    code: "PHX",
    icao: "KPHX",
    name: "Phoenix Sky Harbor International",
    city: "Phoenix",
    state: "AZ",
    streamUrl: "http://d.liveatc.net/kphx_twr",
    category: "International",
  },
  {
    code: "DEN",
    icao: "KDEN",
    name: "Denver International",
    city: "Denver",
    state: "CO",
    streamUrl: "http://d.liveatc.net/kden_twr",
    category: "International",
  },
  {
    code: "ORD",
    icao: "KORD",
    name: "O'Hare International",
    city: "Chicago",
    state: "IL",
    streamUrl: "http://d.liveatc.net/kord_twr",
    category: "International",
  },
  {
    code: "ATL",
    icao: "KATL",
    name: "Hartsfield-Jackson International",
    city: "Atlanta",
    state: "GA",
    streamUrl: "http://d.liveatc.net/katl_twr",
    category: "International",
  },
  {
    code: "JFK",
    icao: "KJFK",
    name: "John F. Kennedy International",
    city: "New York",
    state: "NY",
    streamUrl: "http://d.liveatc.net/kjfk_twr",
    category: "International",
  },
  {
    code: "BOS",
    icao: "KBOS",
    name: "Logan International",
    city: "Boston",
    state: "MA",
    streamUrl: "http://d.liveatc.net/kbos_twr",
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
    streamUrl: "http://d.liveatc.net/ksba_twr",
    category: "Regional",
  },
  {
    code: "BUR",
    icao: "KBUR",
    name: "Hollywood Burbank",
    city: "Burbank",
    state: "CA",
    streamUrl: "http://d.liveatc.net/kbur_twr",
    category: "Regional",
  },
  {
    code: "OAK",
    icao: "KOAK",
    name: "Oakland International",
    city: "Oakland",
    state: "CA",
    streamUrl: "http://d.liveatc.net/koak_twr",
    category: "Regional",
  },
  {
    code: "SMX",
    icao: "KSMX",
    name: "Santa Maria Public",
    city: "Santa Maria",
    state: "CA",
    streamUrl: "http://d.liveatc.net/ksmx_twr",
    category: "Regional",
  },
  {
    code: "PSP",
    icao: "KPSP",
    name: "Palm Springs International",
    city: "Palm Springs",
    state: "CA",
    streamUrl: "http://d.liveatc.net/kpsp_twr",
    category: "Regional",
  },
  {
    code: "RDD",
    icao: "KRDD",
    name: "Redding Municipal",
    city: "Redding",
    state: "CA",
    streamUrl: "http://d.liveatc.net/krdd_twr",
    category: "Regional",
  },
  {
    code: "ACV",
    icao: "KACV",
    name: "Arcata-Eureka",
    city: "Arcata",
    state: "CA",
    streamUrl: "http://d.liveatc.net/kacv_twr",
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
