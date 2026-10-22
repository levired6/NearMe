export type MembershipTier = 'free' | 'pro';

export interface UserCollection {
  id: string;
  title: string;
  eventIds: string[];
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  tier: MembershipTier;
  savedEventIds: string[];
  collections: UserCollection[];
  taggedFriends: string[];
}