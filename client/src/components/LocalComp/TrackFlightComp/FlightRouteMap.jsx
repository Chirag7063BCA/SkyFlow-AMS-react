import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import airportsData from '../../../dummydata/airports.json';
import { evaluateAirborneFlight } from './flightScanner';

// Calculate straight-line distance (km) between two airports using Haversine formula
function getDistanceKm(airportA, airportB) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(airportB.latitude - airportA.latitude);
  const dLon = toRad(airportB.longitude - airportA.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(airportA.latitude)) *
      Math.cos(toRad(airportB.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return Math.round(earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// Create 101 points (0% to 100%) along a curved flight arc from origin to destination
function buildArcPoints(origin, destination) {
  const lat1 = origin.latitude;
  const lon1 = origin.longitude;
  const lat2 = destination.latitude;
  const lon2 = destination.longitude;

  // Lift the midpoint northward to draw a realistic curved flight path
  const span = Math.hypot(lat2 - lat1, lon2 - lon1) || 1;
  const lift = Math.min(Math.max(span * 0.14, 1.2), 10);
  const midLat = (lat1 + lat2) / 2 + lift;
  const midLon = (lon1 + lon2) / 2;

  const points = [];
  for (let step = 0; step <= 100; step += 1) {
    const t = step / 100;
    const oneMinusT = 1 - t;
    const lat =
      oneMinusT * oneMinusT * lat1 + 2 * oneMinusT * t * midLat + t * t * lat2;
    const lon =
      oneMinusT * oneMinusT * lon1 + 2 * oneMinusT * t * midLon + t * t * lon2;
    points.push([lat, lon]);
  }
  return points;
}

export default function FlightRouteMap({ flight, liveNow }) {
  const mapBoxRef = useRef(null);
  const mapRef = useRef(null);
  const routeLayerRef = useRef(null);
  const lastRouteRef = useRef('');

  // Find origin & destination coordinates from airports.json
  const origin = airportsData.find(
    (airport) => airport.iata === flight?.fromAirportCode,
  );
  const destination = airportsData.find(
    (airport) => airport.iata === flight?.toAirportCode,
  );

  // Calculate live progress (0% to 100%)
  const liveFlight = evaluateAirborneFlight(flight, liveNow);
  const rawPercent = liveFlight.isAirborne
    ? Math.round(liveFlight.airborneProgress * 100)
    : 0;
  const progressPercent = Math.min(Math.max(rawPercent || 0, 0), 100);

  const lastSyncedLabel = liveNow
    ? liveNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Now';

  // Step 1: Create the Google Maps-themed Leaflet map once when component mounts
  useEffect(() => {
    if (!mapBoxRef.current || mapRef.current) return undefined;

    const map = L.map(mapBoxRef.current, {
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: false,
    });

    const googleTiles = L.tileLayer(
      'https://mt{s}.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
      { subdomains: ['0', '1', '2', '3'], maxZoom: 18 },
    ).addTo(map);

    // Fallback to Esri Street Map if Google tiles fail to load
    let usedFallback = false;
    googleTiles.on('tileerror', () => {
      if (usedFallback) return;
      usedFallback = true;
      googleTiles.setUrl(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      );
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      routeLayerRef.current = null;
      lastRouteRef.current = '';
    };
  }, []);

  // Step 2: Draw solid covered line, dotted remaining line, pins, and jetliner
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !origin || !destination) return undefined;

    const layerGroup = L.layerGroup().addTo(map);
    routeLayerRef.current = layerGroup;

    const arcPoints = buildArcPoints(origin, destination);

    // Zoom map to fit route when first loading or when switching to a different route
    const routeKey = `${origin.iata}-${destination.iata}`;
    if (!map._loaded || lastRouteRef.current !== routeKey) {
      map.invalidateSize();
      map.fitBounds(L.latLngBounds(arcPoints), { padding: [48, 48], animate: false });
      lastRouteRef.current = routeKey;
    }

    // Split 0..100 points at current progressPercent
    const coveredPoints = arcPoints.slice(0, progressPercent + 1);
    const remainingPoints = arcPoints.slice(progressPercent);

    // Dotted line for remaining distance
    L.polyline(remainingPoints, {
      color: '#475569',
      weight: 3,
      opacity: 0.78,
      dashArray: '2, 9',
      lineCap: 'round',
    }).addTo(layerGroup);

    // Solid blue line (with white outline) for distance already covered
    L.polyline(coveredPoints, {
      color: '#ffffff',
      weight: 7,
      opacity: 0.9,
      lineCap: 'round',
    }).addTo(layerGroup);

    L.polyline(coveredPoints, {
      color: '#1a73e8',
      weight: 4,
      opacity: 1,
      lineCap: 'round',
    }).addTo(layerGroup);

    // Origin & Destination IATA pins
    const originPin = L.divIcon({
      className: 'gmap-airport-marker',
      html: `<div class="gmap-pin gmap-pin-origin"><span class="gmap-pin-dot"></span><span class="gmap-pin-label">${origin.iata}</span></div>`,
      iconSize: [60, 28],
      iconAnchor: [10, 14],
    });

    const destPin = L.divIcon({
      className: 'gmap-airport-marker',
      html: `<div class="gmap-pin gmap-pin-dest"><span class="gmap-pin-dot"></span><span class="gmap-pin-label">${destination.iata}</span></div>`,
      iconSize: [60, 28],
      iconAnchor: [10, 14],
    });

    L.marker([origin.latitude, origin.longitude], {
      icon: originPin,
      interactive: false,
    }).addTo(layerGroup);

    L.marker([destination.latitude, destination.longitude], {
      icon: destPin,
      interactive: false,
    }).addTo(layerGroup);

    // Calculate airplane heading angle from current point toward next point
    const currentPos = arcPoints[progressPercent];
    const nextPos = arcPoints[Math.min(progressPercent + 1, 100)];
    const prevPos = arcPoints[Math.max(progressPercent - 1, 0)];
    const p1 = map.latLngToLayerPoint(progressPercent < 100 ? currentPos : prevPos);
    const p2 = map.latLngToLayerPoint(progressPercent < 100 ? nextPos : currentPos);
    const angleDeg = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI + 90;

    // Animated commercial jetliner symbol rotated along flight path
    const jetIcon = L.divIcon({
      className: 'gmap-plane-marker',
      html: `
        <div class="gmap-jet-wrap">
          <span class="gmap-jet-pulse"></span>
          <svg class="gmap-jet-svg" style="transform: rotate(${angleDeg.toFixed(1)}deg)" width="38" height="38" viewBox="0 0 64 64" aria-hidden="true">
            <path
              d="M32 4 C34.2 4 35.6 7.5 35.8 14 L36 24 L57 37.5 L57 42.5 L36 35.5 L35.5 49 L43.5 54.5 L43.5 58 L32 55 L20.5 58 L20.5 54.5 L28.5 49 L28 35.5 L7 42.5 L7 37.5 L28 24 L28.2 14 C28.4 7.5 29.8 4 32 4 Z"
              fill="#facc15"
              stroke="#0f172a"
              stroke-width="2.2"
              stroke-linejoin="round"
            />
            <path
              d="M32 8 C33.1 8 33.8 10.5 33.9 15 L34 25 L32 24 L30 25 L30.1 15 C30.2 10.5 30.9 8 32 8 Z"
              fill="#fef08a"
            />
          </svg>
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 21],
    });

    L.marker(currentPos, {
      icon: jetIcon,
      interactive: false,
      zIndexOffset: 1000,
    }).addTo(layerGroup);

    return () => {
      layerGroup.remove();
      if (routeLayerRef.current === layerGroup) {
        routeLayerRef.current = null;
      }
    };
  }, [origin, destination, progressPercent]);

  if (!origin || !destination) return null;

  const distanceKm = getDistanceKm(origin, destination);

  return (
    <div className="gmap-pane">
      <div className="gmap-hud-top">
        <span className="gmap-pill-badge">
          <span
            className={`gmap-live-dot${liveFlight.isAirborne ? ' is-airborne' : ''}`}
            aria-hidden="true"
          ></span>
          {liveFlight.isAirborne ? 'IN SKY NOW' : 'ROUTE'} &middot; {origin.iata} &rarr;{' '}
          {destination.iata} &middot; {distanceKm.toLocaleString()} km
        </span>

        <span className="gmap-pill-badge">Live @ {lastSyncedLabel}</span>
      </div>

      <div ref={mapBoxRef} className="gmap-canvas" />

      <div className="gmap-legend">
        <span className="gmap-legend-item">
          <span className="gmap-line-solid"></span>
          Covered ({progressPercent}%)
        </span>
        <span className="gmap-legend-item">
          <span className="gmap-line-dotted"></span>
          Remaining ({100 - progressPercent}%)
        </span>
      </div>
    </div>
  );
}
