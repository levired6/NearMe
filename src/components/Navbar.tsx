import React, { useState } from 'react';
import { MapPin, Navigation, Mic, User, Star, Sparkles, Search } from 'lucide-react';
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
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [zipInput, setZipInput] = useState('');

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipInput.trim()) {
      onSearchZip(zipInput.trim());
      setZipInput('');
      setIsPromptOpen(false);
    }
  };

  return (
    <header className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 text-white px-4 py-3 flex items-center justify-between z-30 shadow-lg relative">
      
      {/* Brand Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md border border-indigo-400/30">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-extrabold text-base tracking-tight hidden sm:inline text-white">NearMe</span>
      </div>

      {/* Center Location Control (Clean interactive button + toggleable search popup) */}
      <div className="relative flex items-center justify-center flex-1 mx-2">
        {!isPromptOpen ? (
          <button
            onClick={() => setIsPromptOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gray-950 border border-gray-800 hover:border-indigo-500 text-xs text-gray-200 transition shadow-inner"
            title="Click to search another location or ZIP"
          >
            <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 animate-bounce" />
            <span className="truncate max-w-[140px] sm:max-w-[200px]">Search ZIP or City...</span>
          </button>
        ) : (
          <form onSubmit={handleManualSearch} className="flex items-center space-x-1 w-full max-w-xs animate-fadeIn">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-indigo-400 absolute left-2.5 top-2" />
              <input
                type="text"
                autoFocus
                placeholder="Enter ZIP, city, or country..."
                value={zipInput}
                onChange={(e) => setZipInput(e.target.value)}
                onBlur={() => {
                  // Slight delay so click events on submit register first
                  setTimeout(() => setIsPromptOpen(false), 200);
                }}
                className="w-full bg-gray-950 border border-indigo-500 rounded-full pl-8 pr-3 py-1 text-xs text-white placeholder-gray-500 focus:outline-none shadow-lg"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow"
            >
              Go
            </button>
          </form>
        )}
      </div>

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