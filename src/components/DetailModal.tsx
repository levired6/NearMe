import React, { useState } from 'react';
import { NearMeEvent } from '../types/event';
import { UserProfile } from '../types/user';
import { TicketPreviewModal } from './TicketPreviewModal';
import { RideshareModal } from './RideshareModal';
import { OrderDeliveryModal } from './OrderDeliveryModal';
import { TransitScheduleModal } from './TransitScheduleModal';
import { 
  X, 
  MapPin, 
  Calendar, 
  Star, 
  ExternalLink, 
  Share2, 
  Navigation, 
  DollarSign, 
  Clock, 
  Phone, 
  Car, 
  MessageSquare, 
  Ticket,
  ShoppingBag,
  Bus,
  Train,
  Sprout,
  Apple,
  CreditCard,
  Bookmark,
  Users,
  Check,
  Plus,
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

interface DetailModalProps {
  event: NearMeEvent | null;
  currentUser: UserProfile | null;
  userLat?: number;
  userLng?: number;
  onClose: () => void;
  onOpenAuth: () => void;
  onSaveToCollection?: (eventId: string, collectionTitle: string) => void;
  onTagFriend?: (eventId: string, friendHandle: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ 
  event, 
  currentUser,
  userLat = 30.2672, 
  userLng = -97.7431, 
  onClose,
  onOpenAuth,
  onSaveToCollection,
  onTagFriend
}) => {
  const [showHours, setShowHours] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isRideshareModalOpen, setIsRideshareModalOpen] = useState(false);
  const [isTransitScheduleOpen, setIsTransitScheduleOpen] = useState(false);
  const [activeDeliveryPlatform, setActiveDeliveryPlatform] = useState<'doordash' | 'ubereats' | null>(null);

  // Pro Feature States
  const [friendInput, setFriendInput] = useState('');
  const [taggedList, setTaggedList] = useState<string[]>([]);
  const [savedCollection, setSavedCollection] = useState<string | null>(null);

  if (!event) return null;

  const isPro = currentUser?.tier === 'pro';
  const isTicketmasterEvent = event.id.startsWith('tm-');
  const isFoodOrDining = event.category === 'food' || event.category === 'drinks';
  const isTransit = event.category === 'transit';
  const isFarm = event.category === 'farms' || !!event.farmDetails;

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${event.location.latitude},${event.location.longitude}`;

  const handleAddFriendTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendInput.trim()) return;
    const handle = friendInput.startsWith('@') ? friendInput.trim() : `@${friendInput.trim()}`;
    setTaggedList([...taggedList, handle]);
    if (onTagFriend) onTagFriend(event.id, handle);
    setFriendInput('');
  };

  const handleSaveCollection = (collectionTitle: string) => {
    setSavedCollection(collectionTitle);
    if (onSaveToCollection) onSaveToCollection(event.id, collectionTitle);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out ${event.title} on NearMe!`,
          url: event.eventUrl,
        });
      } catch (err) {
        console.log('Share canceled:', err);
      }
    } else {
      navigator.clipboard.writeText(event.eventUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 transition-opacity">
        
        {/* Modal Container */}
        <div className="bg-gray-900 border border-gray-800 text-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[88vh] flex flex-col animate-in slide-in-from-bottom duration-300">
          
          {/* Banner Image & Controls */}
          <div className="relative h-56 w-full bg-gray-800 flex-shrink-0">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/40" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-gray-900/80 hover:bg-gray-800 text-white p-2 rounded-full backdrop-blur-md border border-gray-700/60 transition shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={handleShare}
              className="absolute top-4 left-4 bg-gray-900/80 hover:bg-gray-800 text-white p-2 rounded-full backdrop-blur-md border border-gray-700/60 transition shadow-lg"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-4 flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-indigo-600/90 text-white backdrop-blur-md border border-indigo-400/40 shadow-md">
                {event.category}
              </span>
              {event.priceLevel && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-950/90 text-green-300 backdrop-blur-md border border-green-800/50">
                  {event.priceLevel}
                </span>
              )}
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            <div>
              <h2 className="text-2xl font-bold text-white leading-tight">{event.title}</h2>
              <p className="text-sm text-indigo-400 font-medium mt-1">{event.venueName}</p>
            </div>

            {/* PRO TIER FEATURE 1: SAVED COLLECTIONS */}
            <div className="bg-gray-800/40 p-3.5 rounded-2xl border border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>Save to Collections</span>
                </span>
                {!isPro && (
                  <button onClick={onOpenAuth} className="text-[10px] font-bold uppercase text-amber-400 hover:underline">
                    Upgrade to Pro
                  </button>
                )}
              </div>

              {isPro ? (
                <div className="flex items-center gap-2 pt-1">
                  {['Weekend Ideas', 'Favorites', 'Date Night'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleSaveCollection(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border flex items-center gap-1 ${
                        savedCollection === cat
                          ? 'bg-amber-500 text-black border-amber-400 font-bold'
                          : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      {savedCollection === cat ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-gray-400 italic">
                  Pro Members can organize places into custom collections like "Weekend Ideas".
                </p>
              )}
            </div>

            {/* PRO TIER FEATURE 2: META / FRIEND TAGGING */}
            <div className="bg-gray-800/40 p-3.5 rounded-2xl border border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Meta / Friend Tagging</span>
                </span>
                {!isPro && (
                  <button onClick={onOpenAuth} className="text-[10px] font-bold uppercase text-indigo-400 hover:underline">
                    Unlock Feature
                  </button>
                )}
              </div>

              {isPro ? (
                <div className="space-y-2 pt-1">
                  <form onSubmit={handleAddFriendTag} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Tag a friend (e.g. @friend_handle)..."
                      value={friendInput}
                      onChange={(e) => setFriendInput(e.target.value)}
                      className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-xl text-xs font-semibold text-white">
                      Tag
                    </button>
                  </form>

                  {taggedList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {taggedList.map((tag, idx) => (
                        <span key={idx} className="bg-indigo-950 text-indigo-300 border border-indigo-800/60 px-2.5 py-0.5 rounded-lg text-[11px] font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-gray-400 italic">
                  Tag friends at local spots to coordinate hangouts.
                </p>
              )}
            </div>

            {/* Ticketmaster Ticket Button */}
            {isTicketmasterEvent && (
              <button
                onClick={() => setIsTicketModalOpen(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs shadow-lg transition border border-indigo-400/30"
              >
                <Ticket className="w-4 h-4" />
                <span>Check Live Ticket Availability & Prices</span>
              </button>
            )}

            {/* Editorial Summary */}
            {event.editorialSummary && (
              <div className="bg-gray-800/40 p-3.5 rounded-xl border border-gray-800 text-xs text-gray-300 italic leading-relaxed">
                "{event.editorialSummary}"
              </div>
            )}

            {/* Farm Stand Details Card */}
            {isFarm && event.farmDetails && (
              <div className="bg-emerald-950/30 border border-emerald-800/50 p-4 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <Sprout className="w-4 h-4" />
                  <span>Fresh Farm & Market Offerings</span>
                </div>

                {event.farmDetails.freshProduce && (
                  <div>
                    <span className="text-gray-400 font-medium block mb-1.5">Fresh Harvested Produce:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {event.farmDetails.freshProduce.map((item, idx) => (
                        <span key={idx} className="bg-emerald-900/60 text-emerald-200 border border-emerald-700/50 px-2.5 py-0.5 rounded-lg text-[11px]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {event.farmDetails.seasonalActivities && (
                  <div>
                    <span className="text-gray-400 font-medium block mb-1.5">Farm Experiences & Activities:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {event.farmDetails.seasonalActivities.map((act, idx) => (
                        <span key={idx} className="bg-amber-950/60 text-amber-200 border border-amber-800/50 px-2.5 py-0.5 rounded-lg text-[11px] flex items-center gap-1">
                          <Apple className="w-3 h-3 text-amber-400" /> {act}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {event.farmDetails.paymentTypesAccepted && (
                  <div className="pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[11px] text-gray-300">
                    <span className="flex items-center gap-1 text-gray-400"><CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Payment Accepted:</span>
                    <span className="font-semibold text-emerald-300">{event.farmDetails.paymentTypesAccepted.join(', ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 gap-3 bg-gray-800/50 p-4 rounded-2xl border border-gray-800 text-xs">
              <div className="flex items-start space-x-3 text-gray-300">
                <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>{event.location.address || 'Address available on directions map'}</span>
              </div>

              {event.weekdayHours ? (
                <div>
                  <button
                    onClick={() => setShowHours(!showHours)}
                    className="flex items-center justify-between w-full text-left text-gray-300 hover:text-white"
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <span className="font-semibold">
                        {event.isOpenNow ? (
                          <span className="text-green-400">Open Now</span>
                        ) : (
                          <span className="text-red-400">Closed</span>
                        )}
                      </span>
                    </div>
                    {showHours ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showHours && (
                    <div className="mt-2 pl-7 space-y-1 text-[11px] text-gray-400 border-l border-gray-700 ml-2 pt-1">
                      {event.weekdayHours.map((day, idx) => (
                        <div key={idx}>{day}</div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3 text-gray-300">
                  <Calendar className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>{event.startDateTime}</span>
                </div>
              )}

              {event.phoneNumber && (
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <a href={`tel:${event.phoneNumber}`} className="text-indigo-400 hover:underline">
                    {event.phoneNumber}
                  </a>
                </div>
              )}

              {event.rating && (
                <div className="flex items-center space-x-3 text-gray-300">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                  <span className="font-semibold text-yellow-400">
                    {event.rating} / 5 ({event.userRatingCount || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Native Transit Hub */}
            {isTransit && (
              <div className="bg-gray-800/40 p-3.5 rounded-2xl border border-gray-800 space-y-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Train className="w-3.5 h-3.5 text-indigo-400" />
                  <span>In-App Station Board</span>
                </span>
                <button
                  onClick={() => setIsTransitScheduleOpen(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 text-xs transition shadow border border-indigo-400/30"
                >
                  <Bus className="w-4 h-4 text-white" />
                  <span>View Live Station Departures & Routes</span>
                </button>
              </div>
            )}

            {/* Food Delivery Quick Order Buttons */}
            {isFoodOrDining && (
              <div className="bg-gray-800/40 p-3 rounded-2xl border border-gray-800 space-y-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-red-400" />
                  <span>Order In-App Delivery</span>
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveDeliveryPlatform('doordash')}
                    className="bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-800/50 py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 text-xs transition"
                  >
                    <span>DoorDash In-App</span>
                  </button>
                  <button
                    onClick={() => setActiveDeliveryPlatform('ubereats')}
                    className="bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-800/50 py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 text-xs transition"
                  >
                    <span>UberEats In-App</span>
                  </button>
                </div>
              </div>
            )}

            {/* Visitor Reviews */}
            {event.reviews && event.reviews.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-gray-800">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center space-x-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Visitor Reviews</span>
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {event.reviews.slice(0, 3).map((review, i) => (
                    <div key={i} className="bg-gray-800/40 p-3 rounded-xl border border-gray-800 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-200">{review.authorName}</span>
                        <div className="flex items-center text-yellow-400 text-[11px]">
                          <Star className="w-3 h-3 fill-yellow-400 mr-0.5" />
                          <span>{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-[11px] leading-relaxed line-clamp-3">"{review.text}"</p>
                      <span className="text-[10px] text-gray-500 mt-1 block">{review.relativePublishTimeDescription}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action & Transport Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-3 rounded-xl flex items-center justify-center space-x-2 text-xs shadow-lg transition"
              >
                <Navigation className="w-4 h-4" />
                <span>Directions</span>
              </a>

              <button
                onClick={() => setIsRideshareModalOpen(true)}
                className="bg-black hover:bg-gray-950 text-white border border-gray-700 font-medium py-3 px-3 rounded-xl flex items-center justify-center space-x-2 text-xs transition"
              >
                <Car className="w-4 h-4 text-indigo-400" />
                <span>Estimate Ride Fare</span>
              </button>

              {event.eventUrl && (
                <a
                  href={event.eventUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 font-medium py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 text-xs transition"
                >
                  <span>Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

          </div>

        </div>
      </div>

      {isTicketModalOpen && (
        <TicketPreviewModal
          event={event}
          onClose={() => setIsTicketModalOpen(false)}
        />
      )}

      {isRideshareModalOpen && (
        <RideshareModal
          event={event}
          userLat={userLat}
          userLng={userLng}
          onClose={() => setIsRideshareModalOpen(false)}
        />
      )}

      {activeDeliveryPlatform && (
        <OrderDeliveryModal
          event={event}
          platform={activeDeliveryPlatform}
          onClose={() => setActiveDeliveryPlatform(null)}
        />
      )}

      {isTransitScheduleOpen && (
        <TransitScheduleModal
          event={event}
          onClose={() => setIsTransitScheduleOpen(false)}
        />
      )}
    </>
  );
};