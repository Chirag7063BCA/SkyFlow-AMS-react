const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

let cachedAirports = null;
let cachedFlights = null;

// Reusable GET helper that returns parsed JSON or null on failure
async function getJson(endpoint) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

// Synchronous getters reading memory cache
export function getAirportsSync() {
  return cachedAirports || [];
}

export function getFlightsSync() {
  return cachedFlights || [];
}

// Find airport by IATA code synchronously from cache
export function findAirportSync(iata) {
  if (!iata) return null;
  const code = iata.trim().toUpperCase();
  return (
    getAirportsSync().find((a) => a.iata?.toUpperCase() === code) || null
  );
}

// Fetch all airports from MySQL or search by query (?query=del)
export async function getAirports(query = '') {
  const q = query.trim();
  const endpoint = q
    ? `/airports?query=${encodeURIComponent(q)}`
    : '/airports';

  const data = await getJson(endpoint);
  if (Array.isArray(data)) {
    if (!q) cachedAirports = data;
    return data;
  }
  return cachedAirports || [];
}

// Fetch a single airport by its IATA code
export async function getAirportByIata(iata) {
  if (!iata) return null;
  const data = await getJson(`/airports/${encodeURIComponent(iata.trim())}`);
  return data || findAirportSync(iata);
}

// Fetch flights from MySQL with optional filters (?from=DEL&to=BOM)
export async function getFlights(filters = {}) {
  const params = new URLSearchParams();
  if (filters.from) params.set('from', filters.from.trim());
  if (filters.to) params.set('to', filters.to.trim());
  if (filters.airline) params.set('airline', filters.airline.trim());
  if (filters.status) params.set('status', filters.status.trim());

  const qs = params.toString();
  const endpoint = qs ? `/flights?${qs}` : '/flights';

  const data = await getJson(endpoint);
  if (Array.isArray(data)) {
    if (!qs) cachedFlights = data;
    return data;
  }
  return cachedFlights || [];
}

// Fetch a single flight by flight number
export async function getFlightByNumber(flightNumber) {
  if (!flightNumber) return null;
  const num = flightNumber.trim();
  const data = await getJson(`/flights/${encodeURIComponent(num)}`);
  if (data) return data;

  const target = num.toUpperCase();
  return (
    getFlightsSync().find((f) => f.flightNumber?.toUpperCase() === target) ||
    null
  );
}
