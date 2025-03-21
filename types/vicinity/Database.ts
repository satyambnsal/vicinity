export type Json =
  | string
  | number
  | boolean
  | null
  | {[key: string]: Json | undefined}
  | Json[];

export interface VicinityDatabase {
  public: {
    Tables: {
      venues: {
        Row: {
          id: string;
          name: string;
          coordinates: [number, number];
          radius: number;
          created_at: string;
          address: string | null;
          category: string | null;
          description: string | null;
          image_url: string | null;
        };
        Insert: Omit<
          VicinityDatabase['public']['Tables']['venues']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<
          Omit<
            VicinityDatabase['public']['Tables']['venues']['Row'],
            'id' | 'created_at'
          >
        >;
      };
      reviews: {
        Row: {
          id: string;
          venue_id: string;
          content: string;
          rating: number;
          proof_data: string;
          upvotes: number;
          downvotes: number;
          created_at: string;
          user_id: string | null;
        };
        Insert: Omit<
          VicinityDatabase['public']['Tables']['reviews']['Row'],
          'id' | 'created_at' | 'upvotes' | 'downvotes'
        >;
        Update: Partial<
          Omit<
            VicinityDatabase['public']['Tables']['reviews']['Row'],
            'id' | 'created_at'
          >
        >;
      };
      users: {
        Row: {
          id: string;
          created_at: string;
          anonymous_id: string;
          total_reviews: number;
          helpful_reviews: number;
        };
        Insert: Omit<
          VicinityDatabase['public']['Tables']['users']['Row'],
          'id' | 'created_at' | 'total_reviews' | 'helpful_reviews'
        >;
        Update: Partial<
          Omit<
            VicinityDatabase['public']['Tables']['users']['Row'],
            'id' | 'created_at'
          >
        >;
      };
    };
  };
}

// Export type aliases for easier use
export type Venue = VicinityDatabase['public']['Tables']['venues']['Row'];
export type Review = VicinityDatabase['public']['Tables']['reviews']['Row'];
export type User = VicinityDatabase['public']['Tables']['users']['Row'];

// Insert types
export type VenueInsert =
  VicinityDatabase['public']['Tables']['venues']['Insert'];
export type ReviewInsert =
  VicinityDatabase['public']['Tables']['reviews']['Insert'];
export type UserInsert =
  VicinityDatabase['public']['Tables']['users']['Insert'];

// Update types
export type VenueUpdate =
  VicinityDatabase['public']['Tables']['venues']['Update'];
export type ReviewUpdate =
  VicinityDatabase['public']['Tables']['reviews']['Update'];
export type UserUpdate =
  VicinityDatabase['public']['Tables']['users']['Update'];
