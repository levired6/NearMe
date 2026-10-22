import React, { useEffect, useState } from 'react';
import { NearMeEvent } from '../types/event';
import { 
  Utensils, 
  Wine, 
  Sprout, 
  Music, 
  Trophy, 
  Theater, 
  Bus, 
  Bed, 
  Trees, 
  Stethoscope, 
  Wrench, 
  Sparkles, 
  Info, 
  Star,
  Search
} from 'lucide-react';

interface BottomSheetProps {
  events: NearMeEvent[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedEvent: NearMeEvent | null;
  onSelectEvent: (event: NearMeEvent) => void;
  onOpenDetail: (event: NearMeEvent) => void;
}

const CATEGORIES: { id: string; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'all', label: 'All Places', icon: Sparkles },
  { id: 'food', label: 'Food & Dining', icon: Utensils },
  { id: 'drinks', label: 'Bars & Nightlife', icon: Wine },
  { id: 'farms', label: 'Farms & Markets', icon: Sprout },
  { id: 'music', label: 'Live Music', icon: Music },
  { id: 'sports', label: 'Sports', icon: Trophy },
  { id: 'theatre', label: 'Arts & Shows', icon: Theater },
  { id: 'transit', label: 'Transit & Travel', icon: Bus },
  { id: 'stays', label: 'Stays & Lodging', icon: Bed },
  { id: 'parks', label: 'Parks & Outdoors', icon: Trees },
  { id: 'medical', label: 'Medical & Health', icon: Stethoscope },
  { id: 'services', label: 'Local Contractors', icon: Wrench },
];

export const BottomSheet: React.FC<BottomSheetProps> = ({
  events,
  selectedCategory,
  onSelectCategory,
  selectedEvent,
  onSelectEvent,
  onOpenDetail,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    if (selectedEvent) {
      const targetCard = document.getElementById(`card-${selectedEvent.id}`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedEvent]);

  // Filter events by category AND keyword search input
  const filteredEvents = events.filter((e) => {
    const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
    const matchesKeyword = !filterQuery.trim() || 
      e.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      e.venueName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      e.location.address.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCategory && matchesKeyword;
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 text-white rounded-t-3xl shadow-2xl p-4 h-[42vh] max-h-[460px] flex flex-col">
      
      {/* Category Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2.5 flex-shrink-0 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/30'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Specific Keyword Search Filter */}
      <div className="relative mb-3 flex-shrink-0">
        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Filter nearby places (e.g., barbecue, sushi, subway, market)..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-xs">
            No matching spots found. Try clearing your search filter or selecting another category!
          </div>
        ) : (
          filteredEvents.map((event) => {
            const isSelected = selectedEvent?.id === event.id;
            return (
              <div
                id={`card-${event.id}`}
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className={`p-3 rounded-2xl bg-gray-800/80 hover:bg-gray-800 border transition cursor-pointer flex gap-3 ${
                  isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-gray-800' : 'border-gray-700/50'
                }`}
              >
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-gray-700"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                        {event.category}
                      </span>
                      {event.rating && (
                        <div className="flex items-center text-xs text-yellow-400 font-medium">
                          <Star className="w-3 h-3 fill-yellow-400 mr-1" />
                          {event.rating}
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm text-white truncate mt-1">{event.title}</h4>
                    <p className="text-xs text-gray-400 truncate">
                      {event.venueName} • {event.location.address}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-700/40 text-xs">
                    <span className="text-indigo-400 font-medium">{event.startDateTime}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetail(event);
                      }}
                      className="text-gray-300 hover:text-indigo-300 bg-gray-700/60 hover:bg-gray-700 px-2.5 py-1 rounded-lg flex items-center space-x-1 text-[11px] transition"
                    >
                      <Info className="w-3 h-3" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};