import React, { useState } from 'react';
import { NearMeEvent } from '../types/event';
import { X, Car, Navigation, ShieldCheck, DollarSign, Clock, ExternalLink } from 'lucide-react';

interface RideshareModalProps {
  event: NearMeEvent | null;
  userLat: number;
  userLng: number;
  onClose: () => void;
}

// Haversine formula to compute distance in miles between user and venue
function calculateDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const RideshareModal: React.FC<RideshareModalProps> = ({ event, userLat, userLng, onClose }) => {
  const [provider, setProvider] = useState<'uber' | 'lyft'>('uber');

  if (!event) return null;

  const destLat = event.location.latitude;
  const destLng = event.location.longitude;
  const distanceMiles = calculateDistanceMiles(userLat, userLng, destLat, destLng);
  const estMinutes = Math.max(5, Math.round(distanceMiles * 2.5 + 4));

  // Dynamic fare calculations based on distance
  const baseFare = 3.50;
  const perMileRate = 2.10;
  const uberXPrice = Math.max(8.50, Math.round(baseFare + distanceMiles * perMileRate));
  const uberXLPrice = Math.round(uberXPrice * 1.6);
  const uberBlackPrice = Math.round(uberXPrice * 2.4);

  const lyftPrice = Math.max(8.00, Math.round(baseFare + distanceMiles * 2.05));
  const lyftXLPrice = Math.round(lyftPrice * 1.55);
  const lyftExtraPrice = Math.round(lyftPrice * 2.2);

  // Deeplinks
  const uberDeeplink = `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${userLat}&pickup[longitude]=${userLng}&dropoff[latitude]=${destLat}&dropoff[longitude]=${destLng}&dropoff[nickname]=${encodeURIComponent(event.title)}`;
  const lyftDeeplink = `https://lyft.com/ride?id=lyft&pickup[latitude]=${userLat}&pickup[longitude]=${userLng}&destination[latitude]=${destLat}&destination[longitude]=${destLng}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 transition-opacity">
      
      {/* Modal Container */}
      <div className="bg-gray-900 border border-gray-800 text-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Header Bar */}
        <div className="bg-gray-950 p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Car className="w-5 h-5 text-indigo-400" />
            <span className="font-semibold text-sm text-gray-200">Instant Ride & Fare Estimates</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Destination Info Header */}
        <div className="p-4 bg-gray-800/40 border-b border-gray-800 flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-2">
            <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Destination</p>
            <h4 className="font-bold text-sm text-white truncate">{event.title}</h4>
            <p className="text-xs text-indigo-300 truncate">{event.venueName}</p>
          </div>
          <div className="text-right flex-shrink-0 bg-gray-800/80 px-3 py-1.5 rounded-xl border border-gray-700/60">
            <div className="text-xs font-bold text-gray-200">{distanceMiles.toFixed(1)} mi</div>
            <div className="text-[10px] text-indigo-400 flex items-center justify-end space-x-1">
              <Clock className="w-3 h-3 mr-0.5" />
              <span>~{estMinutes} min</span>
            </div>
          </div>
        </div>

        {/* Provider Switcher Tabs */}
        <div className="p-4 pb-2">
          <div className="grid grid-cols-2 gap-2 bg-gray-950 p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setProvider('uber')}
              className={`py-2 rounded-lg font-bold text-xs transition flex items-center justify-center space-x-1.5 ${
                provider === 'uber'
                  ? 'bg-black text-white ring-1 ring-gray-700 shadow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span className="text-sm">Uber</span>
            </button>
            <button
              onClick={() => setProvider('lyft')}
              className={`py-2 rounded-lg font-bold text-xs transition flex items-center justify-center space-x-1.5 ${
                provider === 'lyft'
                  ? 'bg-pink-600 text-white ring-1 ring-pink-400/40 shadow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span className="text-sm">Lyft</span>
            </button>
          </div>
        </div>

        {/* Fare Tier List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {provider === 'uber' ? (
            <>
              {/* UberX */}
              <a
                href={uberDeeplink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-gray-800/60 hover:bg-gray-800 border border-gray-700/60 flex items-center justify-between transition cursor-pointer group"
              >
                <div>
                  <div className="font-semibold text-sm text-white flex items-center space-x-2">
                    <span>UberX</span>
                    <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-800/40">Popular</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Affordable, everyday rides • 4 seats</p>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-white">${uberXPrice} - ${uberXPrice + 4}</div>
                  <div className="text-[10px] text-gray-400">Est. total</div>
                </div>
              </a>

              {/* UberXL */}
              <a
                href={uberDeeplink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-gray-800/60 hover:bg-gray-800 border border-gray-700/60 flex items-center justify-between transition cursor-pointer group"
              >
                <div>
                  <div className="font-semibold text-sm text-white">UberXL</div>
                  <p className="text-xs text-gray-400 mt-0.5">Spacious SUVs for group travel • 6 seats</p>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-white">${uberXLPrice} - ${uberXLPrice + 6}</div>
                  <div className="text-[10px] text-gray-400">Est. total</div>
                </div>
              </a>

              {/* Uber Black */}
              <a
                href={uberDeeplink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-gray-800/60 hover:bg-gray-800 border border-gray-700/60 flex items-center justify-between transition cursor-pointer group"
              >
                <div>
                  <div className="font-semibold text-sm text-white">Uber Black</div>
                  <p className="text-xs text-gray-400 mt-0.5">Premium rides with professional drivers</p>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-white">${uberBlackPrice} - ${uberBlackPrice + 10}</div>
                  <div className="text-[10px] text-gray-400">Est. total</div>
                </div>
              </a>
            </>
          ) : (
            <>
              {/* Lyft Standard */}
              <a
                href={lyftDeeplink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-gray-800/60 hover:bg-gray-800 border border-pink-900/40 flex items-center justify-between transition cursor-pointer group"
              >
                <div>
                  <div className="font-semibold text-sm text-white flex items-center space-x-2">
                    <span>Lyft Standard</span>
                    <span className="text-[10px] bg-pink-950 text-pink-300 px-2 py-0.5 rounded-full border border-pink-800/40">Popular</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Fast, convenient rides • 4 seats</p>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-white">${lyftPrice} - ${lyftPrice + 4}</div>
                  <div className="text-[10px] text-gray-400">Est. total</div>
                </div>
              </a>

              {/* Lyft XL */}
              <a
                href={lyftDeeplink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-gray-800/60 hover:bg-gray-800 border border-gray-700/60 flex items-center justify-between transition cursor-pointer group"
              >
                <div>
                  <div className="font-semibold text-sm text-white">Lyft XL</div>
                  <p className="text-xs text-gray-400 mt-0.5">Extra seats for friends & gear • 6 seats</p>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-white">${lyftXLPrice} - ${lyftXLPrice + 6}</div>
                  <div className="text-[10px] text-gray-400">Est. total</div>
                </div>
              </a>

              {/* Lyft Extra Comfort */}
              <a
                href={lyftDeeplink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-gray-800/60 hover:bg-gray-800 border border-gray-700/60 flex items-center justify-between transition cursor-pointer group"
              >
                <div>
                  <div className="font-semibold text-sm text-white">Extra Comfort</div>
                  <p className="text-xs text-gray-400 mt-0.5">Newer cars with extra legroom</p>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-white">${lyftExtraPrice} - ${lyftExtraPrice + 8}</div>
                  <div className="text-[10px] text-gray-400">Est. total</div>
                </div>
              </a>
            </>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-gray-950 border-t border-gray-800">
          <a
            href={provider === 'uber' ? uberDeeplink : lyftDeeplink}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs shadow-lg transition ${
              provider === 'uber'
                ? 'bg-black hover:bg-gray-900 text-white border border-gray-700'
                : 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-900/30'
            }`}
          >
            <span>Open {provider === 'uber' ? 'Uber' : 'Lyft'} App with Pre-Set Route</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};