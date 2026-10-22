import React, { useState } from 'react';
import { NearMeEvent } from '../types/event';
import { X, Ticket, Calendar, MapPin, DollarSign, ExternalLink, ShieldCheck, Tag } from 'lucide-react';

interface TicketPreviewModalProps {
  event: NearMeEvent | null;
  onClose: () => void;
}

export const TicketPreviewModal: React.FC<TicketPreviewModalProps> = ({ event, onClose }) => {
  const [selectedQuantity, setSelectedQuantity] = useState<number>(2);

  if (!event) return null;

  const isTicketmaster = event.id.startsWith('tm-');
  const minPrice = event.priceRange?.min || 45;
  const maxPrice = event.priceRange?.max || 250;
  const currency = event.priceRange?.currency || 'USD';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 transition-opacity">
      
      {/* Modal Container */}
      <div className="bg-gray-900 border border-gray-800 text-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Header Bar */}
        <div className="bg-gray-950 p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Ticket className="w-5 h-5 text-indigo-400" />
            <span className="font-semibold text-sm text-gray-200">Live Ticket Availability</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Event Banner */}
        <div className="relative h-44 w-full bg-gray-800 flex-shrink-0">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/30" />
          
          <div className="absolute bottom-3 left-4 right-4">
            <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-indigo-600 text-white shadow">
              {event.category}
            </span>
            <h3 className="text-xl font-bold text-white mt-1 truncate">{event.title}</h3>
            <p className="text-xs text-indigo-300">{event.venueName}</p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Official Partner Badge */}
          <div className="bg-indigo-950/40 border border-indigo-800/50 p-3 rounded-xl flex items-center space-x-3 text-xs text-indigo-200">
            <ShieldCheck className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <span>Official Verified Tickets via Ticketmaster & Live Nation Partner Catalog</span>
          </div>

          {/* Pricing & Ticket Selection Grid */}
          <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-800 space-y-3 text-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-700/60">
              <span className="text-gray-400">Price Range</span>
              <span className="text-base font-bold text-green-400">
                ${minPrice} - ${maxPrice} <span className="text-xs text-gray-400 font-normal">{currency}</span>
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-gray-400">Select Quantity</span>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => setSelectedQuantity(qty)}
                    className={`w-8 h-8 rounded-lg font-bold text-xs transition ${
                      selectedQuantity === qty
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400/40'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Estimate Calculation */}
            <div className="pt-3 border-t border-gray-700/60 flex items-center justify-between font-semibold text-sm">
              <span className="text-gray-300">Estimated Total ({selectedQuantity} tickets):</span>
              <span className="text-white">${minPrice * selectedQuantity} - ${maxPrice * selectedQuantity}</span>
            </div>
          </div>

          {/* Location & Time Summary */}
          <div className="space-y-2 text-xs text-gray-300 bg-gray-800/30 p-3.5 rounded-xl border border-gray-800">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Date: {event.startDateTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>{event.location.address || event.venueName}</span>
            </div>
          </div>

          {/* Action CTA Button */}
          <a
            href={event.eventUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 text-sm shadow-xl transition"
          >
            <span>Reserve {selectedQuantity} Seats on Ticketmaster</span>
            <ExternalLink className="w-4 h-4" />
          </a>

        </div>

      </div>
    </div>
  );
};