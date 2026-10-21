import React, { useState } from 'react';
import { Mic, Sparkles, X, Volume2 } from 'lucide-react';
import { listenToVoiceInput } from '../services/speech';
import { getAmbientRecommendation, AmbientRecommendation } from '../services/ambient-gemini';
import { NearMeEvent } from '../types/event';

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  userLat: number;
  userLng: number;
  availableEvents: NearMeEvent[];
  onSelectEvents: (eventIds: string[]) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  isOpen,
  onClose,
  userLat,
  userLng,
  availableEvents,
  onSelectEvents,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AmbientRecommendation | null>(null);

  if (!isOpen) return null;

  const handleStartListening = () => {
    setIsListening(true);
    setTranscript('Listening for your voice...');
    setResult(null);

    listenToVoiceInput(
      async (spokenText) => {
        setIsListening(false);
        setTranscript(spokenText);
        setLoading(true);

        // Fetch AI recommendation from Gemini
        const recommendation = await getAmbientRecommendation(
          spokenText,
          userLat,
          userLng,
          availableEvents
        );

        setResult(recommendation);
        setLoading(false);

        if (recommendation.topEventIds.length > 0) {
          onSelectEvents(recommendation.topEventIds);
        }
      },
      (error) => {
        setIsListening(false);
        setTranscript(`Voice error: ${error}`);
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-gray-900 text-white p-6 shadow-2xl border border-gray-800 animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-semibold text-lg text-white">Ask NearMe AI</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Wearable / Smart Device HUD Card */}
        {result && (
          <div className="my-4 p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-100">
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
              <Volume2 className="w-4 h-4" />
              <span>Smart Device HUD View</span>
            </div>
            <p className="font-bold text-base text-white mb-2">{result.hudText}</p>
            <p className="text-sm text-indigo-200 leading-relaxed">{result.voiceResponse}</p>
          </div>
        )}

        {/* Voice Transcript Display */}
        {transcript && !result && (
          <div className="my-4 p-4 rounded-xl bg-gray-800/80 text-gray-200 text-sm">
            <p className="italic">"{transcript}"</p>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 flex flex-col items-center justify-center">
          <button
            onClick={handleStartListening}
            disabled={isListening || loading}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-lg ${
              isListening
                ? 'bg-red-500 animate-pulse ring-8 ring-red-500/30'
                : loading
                ? 'bg-indigo-600 animate-spin'
                : 'bg-indigo-600 hover:bg-indigo-500 ring-4 ring-indigo-600/30'
            }`}
          >
            <Mic className="w-8 h-8 text-white" />
          </button>
          
          <p className="mt-3 text-xs text-gray-400 text-center">
            {isListening
              ? 'Speak now... (e.g. "Find food trucks and live music")'
              : loading
              ? 'NearMe AI is finding best matches...'
              : 'Tap mic and speak'}
          </p>
        </div>

      </div>
    </div>
  );
};