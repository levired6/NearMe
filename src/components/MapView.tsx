import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { NearMeEvent } from '../types/event';

interface MapViewProps {
  centerLat: number;
  centerLng: number;
  events: NearMeEvent[];
  selectedEventId?: string | null;
  highlightedIds?: string[];
  onSelectEvent: (event: NearMeEvent) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  centerLat,
  centerLng,
  events,
  selectedEventId,
  highlightedIds = [],
  onSelectEvent,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [centerLng, centerLat],
      zoom: 13,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Update map center when coordinates change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [centerLng, centerLat],
        zoom: 13,
        essential: true,
      });
    }
  }, [centerLat, centerLng]);

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    events.forEach((event) => {
      const isSelected = event.id === selectedEventId;
      const isHighlighted = highlightedIds.includes(event.id);

      // Create custom marker element
      const el = document.createElement('div');
      el.className = `cursor-pointer transition-transform duration-200 transform hover:scale-125 ${
        isSelected ? 'scale-125 z-30' : 'z-10'
      }`;

      const color =
        event.category === 'food'
          ? '#f59e0b'
          : event.category === 'music'
          ? '#8b5cf6'
          : event.category === 'sports'
          ? '#ef4444'
          : '#10b981';

      el.innerHTML = `
        <div style="background-color: ${color};" class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 ${
          isHighlighted ? 'border-yellow-300 ring-4 ring-yellow-400/50 animate-bounce' : 'border-white'
        }">
          📍
        </div>
      `;

      el.addEventListener('click', () => {
        onSelectEvent(event);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([event.location.longitude, event.location.latitude])
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [events, selectedEventId, highlightedIds]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};