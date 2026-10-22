import React from 'react';
import { NearMeEvent } from '../types/event';
import { X, MapPin, Calendar, Star, ExternalLink, Share2, Navigation, DollarSign } from 'lucide-react';

interface DetailModalProps {
  event: NearMeEvent | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${event.location.latitude},${event.location.longitude}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out ${event.title} on NearMe!`,
          url: event.eventUrl,
        });
      } catch (err) {
        console.log('Share canceled or failed:', err);
      }
    } else {
      navigator.clipboard.writeText(event.eventUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 transition-opacity">
      
      {/* Modal Container */}
      <div className="bg-gray-900 border border-gray-800 text-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Banner Image & Top Controls */}
        <div className="relative h-56 w-full bg-gray-800 flex-shrink-0">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/40" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-900/80 hover:bg-gray-800 text-white p-2 rounded-full backdrop-blur-md border border-gray-700/60 transition shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="absolute top-4 left-4 bg-gray-900/80 hover:bg-gray-800 text-white p-2 rounded-full backdrop-blur-md border border-gray-700/60 transition shadow-lg"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Category Pill */}
          <div className="absolute bottom-4 left-4">
            <span className="text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-indigo-600/90 text-white backdrop-blur-md border border-indigo-400/40 shadow-md">
              {event.category}
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div>
            <h2 className="text-2xl font-bold text-white leading-tight">{event.title}</h2>
            <p className="text-sm text-indigo-400 font-medium mt-1">{event.venueName}</p>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 gap-3 bg-gray-800/50 p-4 rounded-2xl border border-gray-800 text-xs">
            
            {/* Address */}
            <div className="flex items-start space-x-3 text-gray-300">
              <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>{event.location.address || 'Address available on directions map'}</span>
            </div>

            {/* DateTime */}
            <div className="flex items-center space-x-3 text-gray-300">
              <Calendar className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>{event.startDateTime}</span>
            </div>

            {/* Rating */}
            {event.rating && (
              <div className="flex items-center space-x-3 text-gray-300">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                <span className="font-semibold text-yellow-400">{event.rating} / 5 Rating</span>
              </div>
            )}

            {/* Price Range */}
            {event.priceRange && (
              <div className="flex items-center space-x-3 text-gray-300">
                <DollarSign className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>
                  ${event.priceRange.min} - ${event.priceRange.max} ({event.priceRange.currency})
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            
            {/* Get Directions */}
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-sm shadow-lg transition"
            >
              <Navigation className="w-4 h-4" />
              <span>Directions</span>
            </a>

            {/* External Booking/Info Link */}
            {event.eventUrl && (
              <a
                href={event.eventUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 font-medium py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-sm transition"
              >
                <span>Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};