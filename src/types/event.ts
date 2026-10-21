export type EventCategory = 
  | 'food' 
  | 'music' 
  | 'theatre' 
  | 'sports' 
  | 'festivals' 
  | 'nightlife' 
  | 'recreation';

export interface Location {
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

export interface NearMeEvent {
  id: string;
  title: string;
  description?: string;
  category: EventCategory;
  imageUrl: string;
  eventUrl: string;
  startDateTime: string;
  venueName: string;
  location: Location;
  rating?: number; // <-- Added this
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
}