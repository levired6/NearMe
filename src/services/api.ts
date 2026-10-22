import { NearMeEvent, EventCategory, Review } from '../types/event';

const GOOGLE_PLACES_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
const TICKETMASTER_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;

/**
 * Fetch local spots with high density and expanded rural radius from Google Places API
 */
export async function fetchGooglePlaces(lat: number, lng: number, category: string = 'food'): Promise<NearMeEvent[]> {
  if (!GOOGLE_PLACES_KEY) return [];

  const isFarmCategory = category === 'farms';
  const radiusMeters = isFarmCategory ? 25000.0 : 8000.0; // 15.5 miles for farms to catch rural stands

  const typeBatches: Record<string, string[][]> = {
    food: [
      ['restaurant', 'cafe', 'bakery'],
      ['fast_food_restaurant', 'coffee_shop', 'ice_cream_shop'],
      ['supermarket', 'grocery_store', 'sandwich_shop']
    ],
    drinks: [
      ['bar', 'pub', 'night_club'],
      ['cocktail_bar', 'wine_bar', 'brewery']
    ],
    farms: [
      ['farmers_market', 'produce_market', 'grocery_store', 'market'],
      ['fruit_and_vegetable_store', 'garden_center', 'florist']
    ],
    music: [
      ['performing_arts_theater', 'event_venue', 'concert_hall']
    ],
    sports: [
      ['stadium', 'sports_complex', 'gym', 'bowling_alley']
    ],
    theatre: [
      ['movie_theater', 'performing_arts_theater']
    ],
    transit: [
      ['subway_station', 'train_station', 'transit_station'],
      ['bus_station', 'bus_stop', 'ferry_terminal'],
      ['taxi_stand', 'car_rental', 'ev_charging_station']
    ],
    stays: [
      ['hotel', 'lodging', 'bed_and_breakfast', 'hostel']
    ],
    parks: [
      ['park', 'national_park', 'zoo', 'aquarium', 'botanical_garden']
    ],
    medical: [
      ['hospital', 'medical_clinic', 'pharmacy', 'drugstore']
    ],
    services: [
      ['electrician', 'plumber', 'roofing_contractor', 'painter']
    ]
  };

  const selectedBatches = typeBatches[category] || typeBatches['food'];

  try {
    // Search Nearby Call
    const nearbyRequests = selectedBatches.map((types) =>
      fetch('https://places.googleapis.com/v1/places:searchNearby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_KEY,
          'X-Goog-FieldMask': [
            'places.id',
            'places.displayName',
            'places.formattedAddress',
            'places.location',
            'places.primaryType',
            'places.rating',
            'places.userRatingCount',
            'places.photos',
            'places.priceLevel',
            'places.nationalPhoneNumber',
            'places.regularOpeningHours',
            'places.editorialSummary',
            'places.reviews',
            'places.goodForGroups',
            'places.goodForChildren',
            'places.allowsDogs'
          ].join(',')
        },
        body: JSON.stringify({
          includedTypes: types,
          maxResultCount: 20,
          locationRestriction: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: radiusMeters
            }
          }
        })
      }).then((res) => (res.ok ? res.json() : { places: [] }))
    );

    // If searching for farms, also execute Text Search to pick up named orchards and roadside stands
    let textSearchPromise = Promise.resolve({ places: [] });
    if (isFarmCategory) {
      textSearchPromise = fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_KEY,
          'X-Goog-FieldMask': [
            'places.id',
            'places.displayName',
            'places.formattedAddress',
            'places.location',
            'places.primaryType',
            'places.rating',
            'places.userRatingCount',
            'places.photos',
            'places.priceLevel',
            'places.nationalPhoneNumber',
            'places.regularOpeningHours',
            'places.editorialSummary',
            'places.reviews',
            'places.goodForGroups',
            'places.goodForChildren',
            'places.allowsDogs'
          ].join(',')
        },
        body: JSON.stringify({
          textQuery: 'farm stand farmers market orchard produce market pumpkin patch',
          maxResultCount: 20,
          locationBias: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: radiusMeters
            }
          }
        })
      }).then((res) => (res.ok ? res.json() : { places: [] }));
    }

    const responses = await Promise.all([...nearbyRequests, textSearchPromise]);
    const rawPlaces = responses.flatMap((r) => r.places || []);

    // Deduplicate by Place ID
    const uniqueMap = new Map<string, any>();
    rawPlaces.forEach((p) => {
      if (p.id && p.location?.latitude && p.location?.longitude) {
        uniqueMap.set(p.id, p);
      }
    });

    let places = Array.from(uniqueMap.values());

    return places.map((place: any): NearMeEvent => {
      let priceStr = '';
      if (place.priceLevel === 'PRICE_LEVEL_INEXPENSIVE') priceStr = '$';
      else if (place.priceLevel === 'PRICE_LEVEL_MODERATE') priceStr = '$$';
      else if (place.priceLevel === 'PRICE_LEVEL_EXPENSIVE') priceStr = '$$$';
      else if (place.priceLevel === 'PRICE_LEVEL_VERY_EXPENSIVE') priceStr = '$$$$';

      const reviews: Review[] = place.reviews?.map((r: any) => ({
        authorName: r.authorAttribution?.displayName || 'Visitor',
        rating: r.rating || 5,
        text: r.originalText?.text || r.text?.text || '',
        relativePublishTimeDescription: r.relativePublishTimeDescription || 'Recently'
      })) || [];

      const isFarm = category === 'farms' || place.primaryType?.includes('farm') || place.displayName?.text?.toLowerCase().includes('farm');

      return {
        id: `google-${place.id}`,
        title: place.displayName?.text || 'Local Spot',
        category: (category as EventCategory) || 'food',
        imageUrl: place.photos?.[0] 
          ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxHeightPx=400&maxWidthPx=400&key=${GOOGLE_PLACES_KEY}`
          : isFarm 
            ? 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500'
            : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500',
        eventUrl: `https://www.google.com/maps/place/?q=place_id:${place.id}`,
        startDateTime: place.regularOpeningHours?.openNow ? 'Open Today' : 'Seasonal Hours',
        venueName: place.displayName?.text || 'Local Venue',
        location: {
          address: place.formattedAddress || 'Nearby Roadside Stand',
          city: 'Local Area',
          postalCode: '',
          latitude: Number(place.location.latitude),
          longitude: Number(place.location.longitude)
        },
        rating: place.rating || 4.7,
        userRatingCount: place.userRatingCount || 18,
        priceLevel: priceStr || '$',
        phoneNumber: place.nationalPhoneNumber,
        isOpenNow: place.regularOpeningHours?.openNow ?? true,
        weekdayHours: place.regularOpeningHours?.weekdayDescriptions,
        editorialSummary: place.editorialSummary?.text || (isFarm ? 'Local family-operated farm stand offering fresh seasonal produce, baked goods, and local products.' : undefined),
        reviews,
        farmDetails: isFarm ? {
          freshProduce: ['Fresh Sweet Corn', 'Heirloom Tomatoes', 'Farm Eggs', 'Local Honey', 'Seasonal Fruit'],
          seasonalActivities: ['Farm Tour', 'Produce Picking', 'Pumpkin Patch'],
          isRoadsideStand: true,
          paymentTypesAccepted: ['Cash', 'Venmo', 'Card']
        } : undefined,
        atmosphere: {
          goodForGroups: place.goodForGroups ?? true,
          goodForChildren: place.goodForChildren ?? true,
          allowsDogs: place.allowsDogs ?? true,
        }
      };
    });
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