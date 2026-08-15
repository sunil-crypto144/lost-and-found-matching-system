export type UserRole = 'USER' | 'ADMIN';
export type ItemType = 'LOST' | 'FOUND';
export type ItemStatus = 'OPEN' | 'MATCHED' | 'RESOLVED';
export type MatchStatus = 'SUGGESTED' | 'ACCEPTED' | 'REJECTED' | 'RESOLVED';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Item {
  id: number;
  user_id?: number;
  reporter_name: string;
  reporter_contact: string;
  type: ItemType;
  name: string;
  category: string;
  brand?: string;
  color?: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  event_date: string;
  event_time?: string;
  image_url?: string;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
  owner_name?: string;
}

export interface MatchFactors {
  category_score: number;
  item_score: number;
  brand_score: number;
  color_score: number;
  location_score: number;
  time_score: number;
  description_score: number;
  image_score?: number;
}

export interface Match {
  id: number;
  lost_item_id: number;
  found_item_id: number;
  match_score: number;
  status: MatchStatus;
  confirmed_by?: number;
  confirmed_at?: string;
  created_at: string;
  lost_item: Item;
  found_item: Item;
  factors: MatchFactors;
  reasons: string[];
}

export interface ReportSubmissionResult {
  item: Item;
  matches: Match[];
}

export interface AdminStats {
  total_users: number;
  total_lost_reports: number;
  total_found_reports: number;
  total_potential_matches: number;
  total_confirmed_matches: number;
  total_rejected_matches: number;
  total_resolved_items: number;
}
