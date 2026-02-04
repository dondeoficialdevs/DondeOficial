export interface BusinessImage {
  id: number;
  image_url: string;
  is_primary: boolean;
  created_at?: string;
}

export interface Business {
  id: number;
  name: string;
  description: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  category_id?: number;
  category_name?: string;
  opening_hours?: string;
  latitude?: number;
  longitude?: number;
  images?: BusinessImage[];
  facebook_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  youtube_url?: string;
  whatsapp_url?: string;
  status?: 'pending' | 'approved' | 'rejected';
  total_reviews?: number;
  average_rating?: number;
  price?: number;
  offer_price?: number;
  has_offer?: boolean | string | number;
  offer_description?: string;
  level?: 1 | 2 | 3;
  membership_id?: number;
  created_at: string;
  updated_at: string;
}

export interface MembershipPlan {
  id: number;
  name: string;
  level: 1 | 2 | 3;
  monthly_price: number;
  yearly_price: number;
  description: string;
  features: string[];
  badge_text?: string;
  is_popular?: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MembershipRequest {
  id: string;
  business_name: string;
  client_email: string;
  client_phone?: string;
  plan_id: number;
  billing_cycle: 'monthly' | 'yearly';
  total_price: number;
  status: 'pending' | 'completed' | 'cancelled';
  business_id?: number;
  transaction_id?: string;
  payment_method?: string;
  created_at: string;
  updated_at: string;
  plan?: MembershipPlan;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface BusinessFilters {
  search?: string;
  category?: string;
  location?: string;
  limit?: number;
  offset?: number;
}

export interface Lead {
  id: number;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  subscribed_at: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Review {
  id: number;
  business_id: number;
  rating: number;
  comment?: string;
  user_name?: string;
  user_email?: string;
  created_at: string;
  updated_at?: string;
}

export interface ReviewRating {
  averageRating: number;
  totalReviews: number;
}

export interface Promotion {
  id: number;
  title: string;
  description: string;
  image_url: string;
  button_text?: string;
  button_link?: string;
  badge_text?: string;
  is_discount?: boolean;
  is_popup?: boolean;
  business_id?: number | null;
  active: boolean;
  priority: number;
  created_at: string;
}


export interface SiteSettings {
  id: number;
  logo_url: string;
  footer_logo_url?: string;
  site_name: string;
  primary_color: string;
  secondary_color: string;
  header_color: string;
  footer_color: string;
  bg_color: string;
  gradient_direction: 'horizontal' | 'vertical';
  footer_description?: string;
  footer_phone?: string;
  footer_email?: string;
  footer_address?: string;
  facebook_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  youtube_url?: string;
  use_favorite_favicon?: boolean;
  updated_at?: string;
}

export interface ActionCard {
  id: number;
  type: 'whatsapp' | 'directory';
  title: string;
  description: string;
  badge_text: string;
  image_url: string;
  button_link: string;
  icon_type: string;
  updated_at?: string;
}
