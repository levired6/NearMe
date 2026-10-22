import React, { useState } from 'react';
import { Search, Navigation, Mic, User, Star, Sparkles } from 'lucide-react';
import { UserProfile } from '../types/user';

interface NavbarProps {
  currentUser: UserProfile | null;
  onSearchZip: (zip: string) => void;
  onOpenVoice: () => void;
  onUseCurrentLocation: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSearchZip,
  onOpenVoice,
  onUseCurrentLocation,
  onOpenAuth,
}) => {
  const [zipInput, setZipInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipInput.trim()) {
      onSearchZip(zipInput.trim());
    }
  };

  return (
    <header className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 text-white px-4 py-3 flex items-center justify-between z-30 shadow-lg">
      
      {/* Brand Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md border border-indigo-400/30">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-extrabold text-base tracking-tight hidden sm:inline text-white">NearMe</span>
      </div>

      {/* ZIP Code & City Search Form */}
      <form onSubmit={handleSearch} className="flex-1 max-w-sm mx-3 flex items-center space-x-1.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ZIP or City (e.g., 62298, 11211, Austin)..."
            value={zipInput}
            onChange={(e) => setZipInput(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-full text-xs font-semibold shadow transition"
        >
          Go
        </button>
      </form>

      {/* Controls: GPS, Voice Assistant & User Auth */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onUseCurrentLocation}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700/60 transition"
          title="Use my current GPS position"
        >
          <Navigation className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenVoice}
          className="px-3 py-1.5 rounded-full bg-indigo-950 hover:bg-indigo-900 border border-indigo-800/60 text-indigo-200 text-xs font-medium flex items-center space-x-1 transition shadow"
        >
          <Mic className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden md:inline">Ask AI</span>
        </button>

        {/* User Auth Profile Button */}
        <button
          onClick={onOpenAuth}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition border ${
            currentUser
              ? currentUser.tier === 'pro'
                ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-lg'
                : 'bg-gray-800 border-gray-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400/30'
          }`}
        >
          {currentUser ? (
            <>
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt={currentUser.displayName} className="w-4 h-4 rounded-full object-cover" />
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
              <span className="max-w-[80px] truncate">{currentUser.displayName}</span>
              {currentUser.tier === 'pro' && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
            </>
          ) : (
            <>
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </div>

    </header>
  );
};