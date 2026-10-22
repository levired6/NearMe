import { NearMeEvent, EventCategory } from '../types/event';

const GOOGLE_PLACES_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
const TICKETMASTER_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;

/**
 * Fetch local spots from Google Places API
 */
export async function fetchGooglePlaces(lat: number, lng: number, category: string = 'food'): Promise<NearMeEvent[]> {
  if (!GOOGLE_PLACES_KEY) return [];

  const endpoint = 'https://places.googleapis.com/v1/places:searchNearby';
  
  // Table A supported place types mapping for each NearMe category
  const typeMap: Record<string, string[]> = {
    food: [
      'restaurant', 'cafe', 'bakery', 'fast_food_restaurant', 
      'coffee_shop', 'ice_cream_shop', 'meal_delivery', 
      'meal_takeaway', 'supermarket', 'grocery_store'
    ],
    drinks: ['bar', 'night_club', 'pub'],
    music: ['performing_arts_theater', 'event_venue'],
    sports: ['stadium', 'sports_complex', 'gym'],
    theatre: ['movie_theater', 'performing_arts_theater'],
    transit: ['bus_station', 'train_station', 'subway_station', 'taxi_stand', 'car_rental'],
    stays: ['hotel', 'lodging', 'bed_and_breakfast'],
    parks: ['park', 'national_park', 'zoo', 'aquarium'],
    medical: ['hospital', 'medical_clinic', 'pharmacy', 'drugstore'],
    services: ['electrician', 'plumber', 'roofing_contractor']
  };

  const includedTypes = typeMap[category] || typeMap['food'];

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.primaryType,places.rating,places.photos'
      },
      body: JSON.stringify({
        includedTypes,
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: 8000.0 // 8km (~5 miles) radius
          }
        }
      })
    });

    if (!response.ok) throw new Error(`Google Places Error: ${response.statusText}`);

    const data = await response.json();
    if (!data.places) return [];

    return data.places
      .filter((place: any) => place.location?.latitude && place.location?.longitude)
      .map((place: any): NearMeEvent => ({
        id: `google-${place.id}`,
        title: place.displayName?.text || 'Local Spot',
        category: (category as EventCategory) || 'food',
        imageUrl: place.photos?.[0] 
          ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxHeightPx=400&maxWidthPx=400&key=${GOOGLE_PLACES_KEY}`
          : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500',
        eventUrl: `https://www.google.com/maps/place/?q=place_id:${place.id}`,
        startDateTime: 'Open Today',
        venueName: place.displayName?.text || 'Local Venue',
        location: {
          address: place.formattedAddress || 'Nearby',
          city: 'Local Area',
          postalCode: '',
          latitude: Number(place.location.latitude),
          longitude: Number(place.location.longitude)
        },
        rating: place.rating
      }));
  } catch (error) {
    console.error('Error fetching Google Places:', error);
    return [];
  }
}

/**
 * Fetch live events from Ticketmaster API
 */
export async function fetchTicketmasterEvents(lat: number, lng: number): Promise<NearMeEvent[]> {
  if (!TICKETMASTER_KEY) return [];

  const geoPoint = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_KEY}&geoPoint=${geoPoint}&radius=25&unit=miles&size=20&sort=date,asc`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Ticketmaster Error: ${response.statusText}`);

    const data = await response.json();
    const events = data._embedded?.events || [];

    return events
      .filter((event: any) => {
        const venue = event._embedded?.venues?.[0];
        return venue?.location?.latitude && venue?.location?.longitude;
      })
      .map((event: any): NearMeEvent => {
        const venue = event._embedded?.venues?.[0];
        const segment = event.classifications?.[0]?.segment?.name?.toLowerCase() || '';

        let category: EventCategory = 'music';
        if (segment.includes('sport')) category = 'sports';
        if (segment.includes('arts') || segment.includes('theatre')) category = 'theatre';

        return {
          id: `tm-${event.id}`,
          title: event.name,
          category,
          imageUrl: event.images?.[0]?.url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500',
          eventUrl: event.url,
          startDateTime: event.dates?.start?.localDate || 'Upcoming',
          venueName: venue?.name || 'Local Venue',
          location: {
            address: venue?.address?.line1 || '',
            city: venue?.city?.name || '',
            postalCode: venue?.postalCode || '',
            latitude: parseFloat(venue.location.latitude),
            longitude: parseFloat(venue.location.longitude)
          },
          priceRange: event.priceRanges?.[0] ? {
            min: event.priceRanges[0].min,
            max: event.priceRanges[0].max,
            currency: event.priceRanges[0].currency || 'USD'
          } : undefined
        };
      });
  } catch (error) {
    console.error('Error fetching Ticketmaster events:', error);
    return [];
  }
}

/**
 * Unified fetcher that combines Google Places and Ticketmaster results
 */
export async function fetchAllNearMeData(lat: number, lng: number, categoryFilter?: string): Promise<NearMeEvent[]> {
  const [places, tmEvents] = await Promise.all([
    fetchGooglePlaces(lat, lng, categoryFilter || 'food'),
    fetchTicketmasterEvents(lat, lng)
  ]);

  const combined = [...places, ...tmEvents];
  return combined.filter(item => !isNaN(item.location.latitude) && !isNaN(item.location.longitude) && item.location.latitude !== 0);
}