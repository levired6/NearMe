export type EventCategory = 
  | 'food' 
  | 'drinks'
  | 'farms'
  | 'music' 
  | 'sports' 
  | 'theatre' 
  | 'festivals' 
  | 'transit'
  | 'stays'
  | 'parks'
  | 'medical'
  | 'services';

export interface Location {
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

export interface Review {
  authorName: string;
  rating: number;
  text: string;
  relativePublishTimeDescription: string;
}

export interface FarmDetails {
  freshProduce?: string[];
  seasonalActivities?: string[];
  isRoadsideStand?: boolean;
  paymentTypesAccepted?: string[]; // e.g. "Cash Only", "Venmo", "Cards"
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
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  phoneNumber?: string;
  isOpenNow?: boolean;
  weekdayHours?: string[];
  editorialSummary?: string;
  reviews?: Review[];
  farmDetails?: FarmDetails;
  atmosphere?: {
    goodForGroups?: boolean;
    goodForChildren?: boolean;
    allowsDogs?: boolean;
    restroom?: boolean;
  };
  evCharging?: {
    connectorCount?: number;
  };
  amenities?: {
    dineIn?: boolean;
    takeout?: boolean;
    delivery?: boolean;
    outdoorSeating?: boolean;
    servesCocktails?: boolean;
    servesBeer?: boolean;
    liveMusic?: boolean;
  };
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
}