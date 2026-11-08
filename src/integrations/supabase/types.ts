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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      ad_comments: {
        Row: {
          ad_id: string
          body: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          ad_id: string
          body: string
          created_at?: string
          id?: string
          name?: string
        }
        Update: {
          ad_id?: string
          body?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      agency_settings: {
        Row: {
          config: Json
          id: boolean
          updated_at: string
        }
        Insert: {
          config?: Json
          id?: boolean
          updated_at?: string
        }
        Update: {
          config?: Json
          id?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      momo_payments: {
        Row: {
          amount: number
          created_at: string
          fee: number
          id: string
          phone: string
          purpose: string | null
          reference_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          fee?: number
          id?: string
          phone: string
          purpose?: string | null
          reference_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          fee?: number
          id?: string
          phone?: string
          purpose?: string | null
          reference_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      professional_request_notes: {
        Row: {
          assignee: string | null
          author_id: string
          body: string
          contacted_at: string | null
          created_at: string
          id: string
          quoted_rwf: number | null
          request_id: string
        }
        Insert: {
          assignee?: string | null
          author_id?: string
          body: string
          contacted_at?: string | null
          created_at?: string
          id?: string
          quoted_rwf?: number | null
          request_id: string
        }
        Update: {
          assignee?: string | null
          author_id?: string
          body?: string
          contacted_at?: string | null
          created_at?: string
          id?: string
          quoted_rwf?: number | null
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_request_notes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "professional_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_request_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          request_id: string
          status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          request_id: string
          status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          request_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_request_status_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "professional_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_requests: {
        Row: {
          ad_type: string
          answers: Json
          assets: Json
          campaign: Json
          contact_detail: string
          contact_method: string
          created_at: string
          creative_brief: string
          customer_name: string
          duration: number
          id: string
          reference: string
          related_job_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ad_type: string
          answers: Json
          assets?: Json
          campaign?: Json
          contact_detail: string
          contact_method: string
          created_at?: string
          creative_brief: string
          customer_name: string
          duration: number
          id?: string
          reference?: string
          related_job_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          ad_type?: string
          answers?: Json
          assets?: Json
          campaign?: Json
          contact_detail?: string
          contact_method?: string
          created_at?: string
          creative_brief?: string
          customer_name?: string
          duration?: number
          id?: string
          reference?: string
          related_job_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_requests_related_job_id_fkey"
            columns: ["related_job_id"]
            isOneToOne: false
            referencedRelation: "video_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_jobs: {
        Row: {
          ad_type: string
          charged_rwf: number
          cost_snapshot: Json
          created_at: string
          duration: number
          endpoint: string
          id: string
          model: string
          output_path: string | null
          provider_reference: string | null
          quote_id: string
          quoted_rwf: number
          resolution: string
          sound: boolean
          status: string
          user_id: string
        }
        Insert: {
          ad_type: string
          charged_rwf?: number
          cost_snapshot: Json
          created_at?: string
          duration: number
          endpoint: string
          id?: string
          model: string
          output_path?: string | null
          provider_reference?: string | null
          quote_id: string
          quoted_rwf: number
          resolution: string
          sound: boolean
          status?: string
          user_id: string
        }
        Update: {
          ad_type?: string
          charged_rwf?: number
          cost_snapshot?: Json
          created_at?: string
          duration?: number
          endpoint?: string
          id?: string
          model?: string
          output_path?: string | null
          provider_reference?: string | null
          quote_id?: string
          quoted_rwf?: number
          resolution?: string
          sound?: boolean
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_jobs_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: true
            referencedRelation: "video_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      video_quotes: {
        Row: {
          ad_type: string
          campaign: Json
          cost_snapshot: Json
          created_at: string
          duration: number
          expires_at: string
          id: string
          sound: boolean
          total_rwf: number
          user_id: string
        }
        Insert: {
          ad_type: string
          campaign?: Json
          cost_snapshot: Json
          created_at?: string
          duration: number
          expires_at?: string
          id?: string
          sound: boolean
          total_rwf: number
          user_id: string
        }
        Update: {
          ad_type?: string
          campaign?: Json
          cost_snapshot?: Json
          created_at?: string
          duration?: number
          expires_at?: string
          id?: string
          sound?: boolean
          total_rwf?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      agency_contacts: { Args: never; Returns: Json }
      calculate_video_quote: {
        Args: { ad_type: string; seconds: number; sound?: boolean }
        Returns: Json
      }
      default_agency_settings: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      reserve_video_quote: {
        Args: {
          ad_type: string
          campaign: Json
          seconds: number
          sound: boolean
        }
        Returns: Json
      }
      video_price: {
        Args: { ad_type: string; seconds: number; sound?: boolean }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
