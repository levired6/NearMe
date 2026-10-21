import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MapView } from './components/MapView';
import { BottomSheet } from './components/BottomSheet';
import { VoiceAssistant } from './components/VoiceAssistant';
import { fetchAllNearMeData } from './services/api';
import { NearMeEvent } from './types/event';

export function App() {
  // Default to Austin, TX coordinates as fallback
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 30.2672, lng: -97.7431 });
  const [events, setEvents] = useState<NearMeEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<NearMeEvent | null>(null);
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Request browser GPS position on launch
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error: GeolocationPositionError) => {
          console.warn('Geolocation error:', error);
        }
      );
    }
  };

  useEffect(() => {
    handleUseCurrentLocation();
  }, []);

  // Fetch events whenever location or category changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchAllNearMeData(coords.lat, coords.lng, selectedCategory === 'all' ? undefined : selectedCategory)
      .then((data: NearMeEvent[]) => {
        if (isMounted) {
          setEvents(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        console.error('Fetch error:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [coords, selectedCategory]);

  // Convert ZIP or City string into Lat/Lng via Nominatim geocoding
  const handleSearchZip = async (zipOrCity: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(zipOrCity)}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setCoords({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        });
      } else {
        alert('Could not find location. Please try another ZIP code or city!');
      }
    } catch (err: unknown) {
      console.error('Geocoding error:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-950 font-sans text-gray-100">
      {/* Header Bar */}
      <Navbar
        onSearchZip={handleSearchZip}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onUseCurrentLocation={handleUseCurrentLocation}
      />

      {/* Main Map Canvas Area */}
      <main className="flex-1 relative w-full h-full">
        {loading && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-gray-900/90 text-indigo-400 text-xs px-4 py-2 rounded-full border border-gray-800 shadow-xl flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span>Loading nearby events & places...</span>
          </div>
        )}

        <MapView
          centerLat={coords.lat}
          centerLng={coords.lng}
          events={events}
          selectedEventId={selectedEvent?.id}
          highlightedIds={highlightedIds}
          onSelectEvent={(event: NearMeEvent) => setSelectedEvent(event)}
        />
      </main>

      {/* Mobile Drawer */}
      <BottomSheet
        events={events}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedEvent={selectedEvent}
        onSelectEvent={(event: NearMeEvent) => setSelectedEvent(event)}
      />

      {/* Voice Assistant Overlay */}
      <VoiceAssistant
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        userLat={coords.lat}
        userLng={coords.lng}
        availableEvents={events}
        onSelectEvents={(ids: string[]) => setHighlightedIds(ids)}
      />
    </div>
  );
}

export default App;