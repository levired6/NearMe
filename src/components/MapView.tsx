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

  // Update map center when searching location/zip
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
      if (!event.location?.longitude || !event.location?.latitude) return;

      const isSelected = event.id === selectedEventId;
      const isHighlighted = highlightedIds.includes(event.id);

      // Simple, fixed-size marker element
      const el = document.createElement('div');
      el.style.width = '28px';
      el.style.height = '28px';
      el.style.borderRadius = '50%';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.cursor = 'pointer';
      el.style.fontSize = '12px';
      el.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)';

      const color =
        event.category === 'food'
          ? '#f59e0b'
          : event.category === 'music'
          ? '#8b5cf6'
          : event.category === 'sports'
          ? '#ef4444'
          : '#10b981';

      el.style.backgroundColor = color;
      el.style.border = isSelected
        ? '3px solid #ffffff'
        : isHighlighted
        ? '3px solid #fde047'
        : '2px solid #ffffff';

      el.innerText = '📍';

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectEvent(event);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([event.location.longitude, event.location.latitude])
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [events, selectedEventId, highlightedIds, onSelectEvent]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};