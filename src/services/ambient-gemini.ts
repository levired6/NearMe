import { GoogleGenerativeAI } from '@google/generative-ai';
import { NearMeEvent } from '../types/event';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

export interface AmbientRecommendation {
  hudText: string;        // Short summary for wearable/smartwatch HUD screens
  voiceResponse: string;  // Natural spoken text for earbuds or speaker playback
  topEventIds: string[];   // Specific matching event IDs to highlight
}

/**
 * Sends real event data and user voice prompts to Gemini AI for smart device recommendations
 */
export async function getAmbientRecommendation(
  userPrompt: string,
  userLat: number,
  userLng: number,
  nearbyEvents: NearMeEvent[]
): Promise<AmbientRecommendation> {
  if (!apiKey) {
    return {
      hudText: 'Gemini API key missing in .env.local',
      voiceResponse: 'Please make sure your Gemini API key is configured in .env.local.',
      topEventIds: []
    };
  }

  // Pick top 10 nearby events for prompt context
  const conciseEvents = nearbyEvents.slice(0, 10).map(e => ({
    id: e.id,
    title: e.title,
    category: e.category,
    venue: e.venueName,
    city: e.location.city,
    time: e.startDateTime
  }));

  const systemPrompt = `
    You are NearMe Voice & Ambient Concierge for mobile and wearable devices (smart glasses, earbuds, smartwatches).
    User Query: "${userPrompt}"
    Current Location Coordinates: (${userLat}, ${userLng})
    Available Nearby Options: ${JSON.stringify(conciseEvents)}

    Respond ONLY with valid raw JSON (no markdown block formatting, no extra explanation) using these exact keys:
    {
      "hudText": "Max 12 words summary ideal for a wearable HUD screen or smartwatch face.",
      "voiceResponse": "A natural, friendly 2-sentence conversational recommendation.",
      "topEventIds": ["array", "of", "matching", "event", "ids"]
    }
  `;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text().trim();

    // Clean up markdown block quotes if present
    const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    return JSON.parse(cleanJson) as AmbientRecommendation;
  } catch (error) {
    console.error('Ambient Gemini Error:', error);
    return {
      hudText: 'Found nearby spots on map.',
      voiceResponse: 'I found a few spots matching your request nearby. Check out the pins on your map!',
      topEventIds: []
    };
  }
}