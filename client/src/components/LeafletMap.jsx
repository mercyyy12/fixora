import React, { useEffect, useRef } from 'react';
import { HiLocationMarker } from 'react-icons/hi';

/**
 * LeafletMap — Interactive map powered by Leaflet.js + OpenStreetMap.
 * ✅ Free. No API key. No usage limits for personal/dev use.
 *
 * Props:
 *   lat, lng       — coordinates to display
 *   address        — label shown in the badge
 *   height         — map height in px (default 220)
 *   interactive    — if true, clicking the map calls onLocationPick(lat, lng)
 *   onLocationPick — callback when user clicks map to pick a location
 */

const loadLeaflet = () =>
  new Promise((resolve) => {
    if (window.L) return resolve(window.L);

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => resolve(window.L);
      document.head.appendChild(script);
    } else {
      const check = setInterval(() => {
        if (window.L) { clearInterval(check); resolve(window.L); }
      }, 50);
    }
  });

const makeIcon = (L) =>
  L.divIcon({
    html: `<div style="
      width:28px;height:28px;
      background:linear-gradient(135deg,#f97316,#ea580c);
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
    "></div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -32],
  });

const LeafletMap = ({
  lat = 27.7172,
  lng = 85.324,
  address = 'Location',
  height = 220,
  interactive = false,
  onLocationPick,
}) => {
  const containerRef = useRef(null);
  const mapRef      = useRef(null);
  const markerRef   = useRef(null);
  const circleRef   = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const L = await loadLeaflet();
      if (cancelled || !containerRef.current) return;

      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: true,
        scrollWheelZoom: false,
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const icon = makeIcon(L);

      const marker = L.marker([lat, lng], {
        icon,
        draggable: interactive, // draggable when in pick mode
      })
        .addTo(map)
        .bindPopup(
          interactive
            ? '<b>Drag me</b> or click the map to set location'
            : `<b>${address}</b><br><small>${lat.toFixed(5)}, ${lng.toFixed(5)}</small>`
        )
        .openPopup();

      markerRef.current = marker;

      // Drag end — update coordinates
      if (interactive) {
        marker.on('dragend', async (e) => {
          const { lat: newLat, lng: newLng } = e.target.getLatLng();
          onLocationPick && onLocationPick(newLat, newLng);
        });

        // Click on map to move pin
        map.on('click', (e) => {
          const { lat: newLat, lng: newLng } = e.latlng;
          marker.setLatLng([newLat, newLng]);
          map.panTo([newLat, newLng]);
          onLocationPick && onLocationPick(newLat, newLng);
        });

        // Cursor hint
        map.getContainer().style.cursor = 'crosshair';
      }
    };

    init();
    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, interactive]);

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-outline"
      style={{ height }}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Address badge */}
      <div className="absolute top-2 left-2 z-[1000] bg-surface rounded-lg px-2.5 py-1.5 shadow-md flex items-center gap-1.5 text-xs font-medium text-ink-2 max-w-[calc(100%-16px)]">
        <HiLocationMarker className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
        <span className="truncate">{address}</span>
      </div>

      {/* Click hint for interactive mode */}
      {interactive && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[1000] bg-black/60 text-white text-[11px] px-3 py-1 rounded-full whitespace-nowrap">
          Click map or drag pin to correct location
        </div>
      )}
    </div>
  );
};

export default LeafletMap;
