import React, { useState } from 'react';
import { NearMeEvent } from '../types/event';
import { X, ExternalLink, ShieldCheck, ShoppingBag, Plus, Minus, ShoppingCart, CheckCircle, Clock, Utensils } from 'lucide-react';

interface OrderDeliveryModalProps {
  event: NearMeEvent | null;
  platform: 'doordash' | 'ubereats';
  onClose: () => void;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

export const OrderDeliveryModal: React.FC<OrderDeliveryModalProps> = ({ event, platform, onClose }) => {
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!event) return null;

  const isDoorDash = platform === 'doordash';
  const platformName = isDoorDash ? 'DoorDash' : 'UberEats';

  // Sample menu items tailored to venue category
  const menuItems: MenuItem[] = [
    { id: 'm1', name: 'Signature BBQ Platter', description: 'Chopped brisket, pulled pork, sausage & 2 sides', price: 24.99 },
    { id: 'm2', name: 'Smoked Brisket Sandwich', description: 'Slow-smoked beef brisket on a toasted brioche bun', price: 14.50 },
    { id: 'm3', name: 'Pork Ribs (Half Rack)', description: 'St. Louis style ribs with house sweet & spicy sauce', price: 18.99 },
    { id: 'm4', name: 'Mac & Cheese Side', description: 'Creamy three-cheese blend baked to perfection', price: 5.50 },
    { id: 'm5', name: 'Craft Beverage / Soda', description: 'Ice-cold fountain drink or artisan iced tea', price: 3.25 },
  ];

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: updated };
    });
  };

  const totalItems = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const subtotal = menuItems.reduce((sum, item) => sum + (cart[item.id] || 0) * item.price, 0);
  const deliveryFee = 3.99;
  const grandTotal = subtotal > 0 ? subtotal + deliveryFee : 0;

  const targetUrl = isDoorDash
    ? `https://www.doordash.com/search/store/${encodeURIComponent(event.title)}/`
    : `https://www.ubereats.com/search?q=${encodeURIComponent(event.title)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 transition-opacity">
      
      {/* Modal Container */}
      <div className="bg-gray-900 border border-gray-800 text-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-gray-950 px-5 py-4 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <ShoppingBag className={`w-5 h-5 ${isDoorDash ? 'text-red-400' : 'text-emerald-400'}`} />
            <span className="font-semibold text-sm text-gray-200">In-App Delivery Menu • {platformName}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Store Info Banner */}
          <div className="flex items-center space-x-3 bg-gray-800/50 p-3 rounded-2xl border border-gray-800">
            <img src={event.imageUrl} alt={event.title} className="w-14 h-14 rounded-xl object-cover bg-gray-700 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-sm text-white truncate">{event.title}</h3>
              <p className="text-xs text-gray-400 truncate">{event.location.address || 'Local Venue'}</p>
              <div className="flex items-center space-x-3 text-[11px] text-green-400 mt-0.5">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 25-35 min delivery</span>
              </div>
            </div>
          </div>

          {orderPlaced ? (
            /* Order Confirmation View */
            <div className="py-8 text-center space-y-3 bg-gray-800/30 p-6 rounded-2xl border border-gray-800 animate-in fade-in">
              <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto border border-green-500/40">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Cart Prepared for Dispatch!</h4>
              <p className="text-xs text-gray-300 max-w-xs mx-auto leading-relaxed">
                Your order ({totalItems} items, ${grandTotal.toFixed(2)}) is formatted and ready to submit on {platformName}.
              </p>
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center space-x-2 font-semibold py-3 px-6 rounded-xl text-xs shadow-lg transition mt-2 ${
                  isDoorDash
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                }`}
              >
                <span>Complete Order on {platformName}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : (
            /* Menu Selector */
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center space-x-1.5">
                <Utensils className="w-3.5 h-3.5 text-indigo-400" />
                <span>Popular Items</span>
              </h4>

              <div className="space-y-2">
                {menuItems.map((item) => {
                  const qty = cart[item.id] || 0;
                  return (
                    <div key={item.id} className="bg-gray-800/40 p-3 rounded-2xl border border-gray-800 flex items-center justify-between text-xs gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-100">{item.name}</div>
                        <div className="text-[11px] text-gray-400 truncate mt-0.5">{item.description}</div>
                        <div className="text-indigo-400 font-bold mt-1">${item.price.toFixed(2)}</div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-2 bg-gray-900 p-1 rounded-xl border border-gray-700/60 flex-shrink-0">
                        {qty > 0 && (
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        )}
                        {qty > 0 && <span className="font-bold text-xs px-1 text-white">{qty}</span>}
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white shadow"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer Cart Checkout Summary */}
        {!orderPlaced && (
          <div className="p-4 bg-gray-950 border-t border-gray-800 space-y-3 flex-shrink-0">
            {totalItems > 0 && (
              <div className="space-y-1 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-[11px]">
                  <span>Est. Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-white pt-1 border-t border-gray-800">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            <button
              disabled={totalItems === 0}
              onClick={() => setOrderPlaced(true)}
              className={`w-full font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs shadow-lg transition ${
                totalItems > 0
                  ? isDoorDash
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{totalItems > 0 ? `Checkout Cart ($${grandTotal.toFixed(2)})` : 'Add Items to Cart'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};