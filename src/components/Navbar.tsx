import React, { useState } from 'react';
import { Search, Mic, MapPin, Compass } from 'lucide-react';

interface NavbarProps {
  onSearchZip: (zipOrCity: string) => void;
  onOpenVoice: () => void;
  onUseCurrentLocation: () => void;
  currentLocationName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchZip,
  onOpenVoice,
  onUseCurrentLocation,
  currentLocationName = 'Current Location',
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchZip(searchInput.trim());
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden xs:inline bg-gradient-to-r from-white via-gray-200 to-indigo-300 bg-clip-text text-transparent">
            NearMe
          </span>
        </div>

        {/* Search Bar for ZIP / City */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-md relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter ZIP code or city (e.g. 78701 or Austin)..."
            className="w-full bg-gray-800 text-white placeholder-gray-400 text-xs sm:text-sm rounded-full pl-9 pr-8 py-2 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {searchInput && (
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-0.5 rounded-full transition"
            >
              Go
            </button>
          )}
        </form>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Geolocation Button */}
          <button
            onClick={onUseCurrentLocation}
            title="Use current GPS location"
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-indigo-400 transition flex items-center justify-center"
          >
            <MapPin className="w-4 h-4" />
          </button>

          {/* Voice & AI Assistant Button */}
          <button
            onClick={onOpenVoice}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-medium px-3 py-2 rounded-full shadow-lg transition transform active:scale-95"
          >
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </div>

      </div>
    </header>
  );
};