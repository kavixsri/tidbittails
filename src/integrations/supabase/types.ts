export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cafe_reservations: {
        Row: {
          created_at: string
          guest_email: string
          guest_name: string
          guest_phone: string
          id: string
          ngo_id: string | null
          party_size: number
          reservation_date: string
          reservation_time: string
          special_requests: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          guest_email: string
          guest_name: string
          guest_phone: string
          id?: string
          ngo_id?: string | null
          party_size?: number
          reservation_date: string
          reservation_time: string
          special_requests?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          guest_email?: string
          guest_name?: string
          guest_phone?: string
          id?: string
          ngo_id?: string | null
          party_size?: number
          reservation_date?: string
          reservation_time?: string
          special_requests?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cafe_reservations_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
        ]
      }
      emergencies: {
        Row: {
          animal_type: string
          assigned_ngo_id: string | null
          assigned_node_id: string | null
          created_at: string
          description: string
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          notes: string | null
          reporter_email: string | null
          reporter_name: string
          reporter_phone: string
          resolved_at: string | null
          status: string | null
          updated_at: string
          urgency: string | null
        }
        Insert: {
          animal_type: string
          assigned_ngo_id?: string | null
          assigned_node_id?: string | null
          created_at?: string
          description: string
          id?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          notes?: string | null
          reporter_email?: string | null
          reporter_name: string
          reporter_phone: string
          resolved_at?: string | null
          status?: string | null
          updated_at?: string
          urgency?: string | null
        }
        Update: {
          animal_type?: string
          assigned_ngo_id?: string | null
          assigned_node_id?: string | null
          created_at?: string
          description?: string
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          notes?: string | null
          reporter_email?: string | null
          reporter_name?: string
          reporter_phone?: string
          resolved_at?: string | null
          status?: string | null
          updated_at?: string
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergencies_assigned_ngo_id_fkey"
            columns: ["assigned_ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergencies_assigned_node_id_fkey"
            columns: ["assigned_node_id"]
            isOneToOne: false
            referencedRelation: "regional_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          created_at: string
          email: string
          event_id: string
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          event_id: string
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          event_id?: string
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          current_attendees: number | null
          date: string
          description: string | null
          end_time: string | null
          event_type: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          location: string
          max_attendees: number | null
          node_id: string | null
          registration_required: boolean | null
          start_time: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_attendees?: number | null
          date: string
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          location: string
          max_attendees?: number | null
          node_id?: string | null
          registration_required?: boolean | null
          start_time?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_attendees?: number | null
          date?: string
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          location?: string
          max_attendees?: number | null
          node_id?: string | null
          registration_required?: boolean | null
          start_time?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "regional_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      network_stats: {
        Row: {
          id: string
          total_animals_rescued: number | null
          total_animals_under_care: number | null
          total_ngos: number | null
          total_nodes: number | null
          total_volunteers: number | null
          updated_at: string
        }
        Insert: {
          id?: string
          total_animals_rescued?: number | null
          total_animals_under_care?: number | null
          total_ngos?: number | null
          total_nodes?: number | null
          total_volunteers?: number | null
          updated_at?: string
        }
        Update: {
          id?: string
          total_animals_rescued?: number | null
          total_animals_under_care?: number | null
          total_ngos?: number | null
          total_nodes?: number | null
          total_volunteers?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      ngos: {
        Row: {
          address: string
          animals_rescued: number | null
          created_at: string
          description: string | null
          email: string | null
          established_year: number | null
          id: string
          is_verified: boolean | null
          logo_url: string | null
          name: string
          node_id: string | null
          phone: string | null
          region: string
          services: string[] | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address: string
          animals_rescued?: number | null
          created_at?: string
          description?: string | null
          email?: string | null
          established_year?: number | null
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          name: string
          node_id?: string | null
          phone?: string | null
          region: string
          services?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string
          animals_rescued?: number | null
          created_at?: string
          description?: string | null
          email?: string | null
          established_year?: number | null
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          name?: string
          node_id?: string | null
          phone?: string | null
          region?: string
          services?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ngos_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "regional_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      regional_nodes: {
        Row: {
          address: string
          animals_under_care: number | null
          created_at: string
          email: string | null
          facilities: Json | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          region: string
          status: string | null
          updated_at: string
          volunteers_count: number | null
        }
        Insert: {
          address: string
          animals_under_care?: number | null
          created_at?: string
          email?: string | null
          facilities?: Json | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          region: string
          status?: string | null
          updated_at?: string
          volunteers_count?: number | null
        }
        Update: {
          address?: string
          animals_under_care?: number | null
          created_at?: string
          email?: string | null
          facilities?: Json | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          region?: string
          status?: string | null
          updated_at?: string
          volunteers_count?: number | null
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          availability: string | null
          created_at: string
          email: string
          experience: string | null
          id: string
          motivation: string | null
          name: string
          node_id: string | null
          phone: string
          preferred_region: string | null
          skills: string[] | null
          status: string | null
          updated_at: string
        }
        Insert: {
          availability?: string | null
          created_at?: string
          email: string
          experience?: string | null
          id?: string
          motivation?: string | null
          name: string
          node_id?: string | null
          phone: string
          preferred_region?: string | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          availability?: string | null
          created_at?: string
          email?: string
          experience?: string | null
          id?: string
          motivation?: string | null
          name?: string
          node_id?: string | null
          phone?: string
          preferred_region?: string | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteers_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "regional_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
