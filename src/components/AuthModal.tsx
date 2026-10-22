import React, { useState } from 'react';
import { UserProfile, MembershipTier } from '../types/user';
import { 
  X, 
  Sparkles, 
  Bookmark, 
  Users, 
  Zap, 
  Check, 
  Mail, 
  Lock, 
  User, 
  Star,
  ArrowRight
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  currentUser: UserProfile | null;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  onUpgradeTier: (newTier: MembershipTier) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onLogin,
  onUpgradeTier,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'tiers'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  // Google OAuth Login
  const handleGoogleAuth = () => {
    const googleUser: UserProfile = {
      uid: 'google-user-123',
      displayName: name || 'User',
      email: email || 'user@domain.com',
      tier: 'free',
      savedEventIds: [],
      collections: [
        { id: 'c1', title: 'Weekend Ideas', eventIds: [] }
      ],
      taggedFriends: []
    };
    onLogin(googleUser);
    onClose();
  };

  // Email Sign In / Sign Up
  const handleSubmitEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const newUser: UserProfile = {
      uid: `user-${Date.now()}`,
      displayName: name || 'User',
      email: email,
      tier: 'free',
      savedEventIds: [],
      collections: [
        { id: 'c1', title: 'Weekend Ideas', eventIds: [] }
      ],
      taggedFriends: []
    };
    onLogin(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 transition-opacity">
      
      {/* Modal Container */}
      <div className="bg-gray-900 border border-gray-800 text-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-gray-950 px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm text-white">NearMe Account & Membership</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-800 bg-gray-950/60 p-1.5 gap-1">
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === 'signin' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === 'signup' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => setActiveTab('tiers')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-center space-x-1 ${
              activeTab === 'tiers' ? 'bg-amber-600 text-white shadow' : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>Pro Perks</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-5">
          
          {(activeTab === 'signin' || activeTab === 'signup') && (
            <div className="space-y-4">
              
              {/* Google OAuth Button */}
              <button
                onClick={handleGoogleAuth}
                className="w-full bg-gray-800 hover:bg-gray-750 border border-gray-700 text-gray-100 font-medium py-3 px-4 rounded-xl flex items-center justify-center space-x-3 text-xs shadow transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-gray-800" />
                <span className="px-3 text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Or email password</span>
                <div className="flex-1 border-t border-gray-800" />
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmitEmailAuth} className="space-y-3">
                {activeTab === 'signup' && (
                  <div>
                    <label className="text-[11px] font-semibold text-gray-400 block mb-1">Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-semibold text-gray-400 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-400 block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl text-xs shadow-lg transition mt-2"
                >
                  {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              </form>
            </div>
          )}

          {/* PRO MEMBERSHIP TIER SELECTION */}
          {activeTab === 'tiers' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800/50">
                  Demo Upgrade (Free Activation)
                </span>
                <h3 className="text-xl font-extrabold text-white">Unlock NearMe Pro Tier</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Access friend tagging, custom collections, early ticket alerts, and exclusive local deals.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                
                {/* Free Tier Card */}
                <div className={`p-4 rounded-2xl border transition ${
                  currentUser?.tier === 'free' || !currentUser
                    ? 'bg-gray-800/40 border-gray-700'
                    : 'bg-gray-900 border-gray-800'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-white">🆓 Explorer (Free)</h4>
                      <p className="text-[11px] text-gray-400">Essential map discovery</p>
                    </div>
                    <span className="text-xs font-bold text-gray-300">$0 / mo</span>
                  </div>

                  <ul className="space-y-1.5 text-[11px] text-gray-300 mt-3">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400" /> Unlimited local map searches</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400" /> Uber/Lyft fare estimator & DoorDash ordering</li>
                  </ul>
                </div>

                {/* Pro Tier Card ($1.99/mo - Free in Demo) */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-gray-900 to-amber-950/40 border-2 border-amber-500/60 shadow-xl relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Demo Free Upgrade
                  </div>

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-1">
                        ⭐ Pro Member
                      </h4>
                      <p className="text-[11px] text-amber-300/80">Social & VIP Local Discovery</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-amber-400">$1.99</span>
                      <span className="text-[10px] text-gray-400 block">/ month</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-[11px] text-gray-200 mt-3 pt-2 border-t border-gray-800">
                    <li className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-amber-400" /> 
                      <span><strong>Meta/Friend Tagging:</strong> Tag friends at local spots</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Bookmark className="w-3.5 h-3.5 text-amber-400" /> 
                      <span><strong>Custom Collections:</strong> Save favorite spots & share lists</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> 
                      <span><strong>VIP Ticket Access:</strong> Priority concert & venue alerts</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => {
                      onUpgradeTier('pro');
                      onClose();
                    }}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold py-3 px-4 rounded-xl text-xs shadow-lg transition mt-4 flex items-center justify-center space-x-1.5"
                  >
                    <span>{currentUser?.tier === 'pro' ? 'Active Pro Member' : 'Activate Pro Member (Demo Free)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};