import React, { useState } from 'react';
import { NearMeEvent } from '../types/event';
import { X, Train, Bus, Clock, ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react';

interface TransitScheduleModalProps {
  event: NearMeEvent | null;
  onClose: () => void;
}

interface TransitLine {
  route: string;
  destination: string;
  arrivals: number[]; // Minutes
  color: string;
}

export const TransitScheduleModal: React.FC<TransitScheduleModalProps> = ({ event, onClose }) => {
  const [refreshing, setRefreshing] = useState(false);

  if (!event) return null;

  // Mock live transit schedules for local stations
  const transitLines: TransitLine[] = [
    { route: 'L Train', destination: '8 Av - Manhattan', arrivals: [2, 7, 14], color: 'bg-gray-600 text-white' },
    { route: 'G Train', destination: 'Court Sq - Queens', arrivals: [4, 11, 19], color: 'bg-emerald-600 text-white' },
    { route: 'B62 Bus', destination: 'Downtown Brooklyn', arrivals: [3, 15], color: 'bg-blue-600 text-white' },
    { route: 'NYC Ferry', destination: 'Wall St / Pier 11', arrivals: [12, 32], color: 'bg-cyan-600 text-white' },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 transition-opacity">
      
      <div className="bg-gray-900 border border-gray-800 text-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gray-950 px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Train className="w-5 h-5 text-indigo-400" />
            <span className="font-semibold text-sm text-gray-200">Live Station Board</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition"
              title="Refresh departures"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Station Title */}
        <div className="p-4 bg-gray-800/40 border-b border-gray-800">
          <h3 className="font-bold text-base text-white">{event.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{event.location.address || 'Central Transit Corridor'}</p>
        </div>

        {/* Live Line Departures */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
            <span>Route / Line</span>
            <span>Upcoming Departures</span>
          </div>

          {transitLines.map((line, idx) => (
            <div key={idx} className="bg-gray-800/50 p-3.5 rounded-2xl border border-gray-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3 min-w-0 pr-2">
                <span className={`px-2.5 py-1 rounded-lg font-bold text-xs flex-shrink-0 ${line.color}`}>
                  {line.route}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-200 truncate">{line.destination}</p>
                  <p className="text-[10px] text-gray-400">On-time service</p>
                </div>
              </div>

              {/* Arrival Minutes Badges */}
              <div className="flex items-center space-x-1.5 flex-shrink-0">
                {line.arrivals.map((min, i) => (
                  <span
                    key={i}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                      i === 0
                        ? 'bg-green-950 text-green-300 border border-green-800/60 animate-pulse'
                        : 'bg-gray-800 text-gray-300 border border-gray-700/60'
                    }`}
                  >
                    {min} min
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Security Banner */}
        <div className="p-4 bg-gray-950 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>GTFS Realtime Schedule Telemetry</span>
          </div>
          <span className="text-indigo-400 font-medium">Updated just now</span>
        </div>

      </div>
    </div>
  );
};