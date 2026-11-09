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
      ad_orders: {
        Row: {
          amount_rwf: number
          created_at: string
          details: Json
          id: string
          idempotency_key: string | null
          is_test: boolean
          paid_at: string | null
          service_type: string
          status: string
          user_id: string
        }
        Insert: {
          amount_rwf: number
          created_at?: string
          details?: Json
          id?: string
          idempotency_key?: string | null
          is_test?: boolean
          paid_at?: string | null
          service_type: string
          status?: string
          user_id: string
        }
        Update: {
          amount_rwf?: number
          created_at?: string
          details?: Json
          id?: string
          idempotency_key?: string | null
          is_test?: boolean
          paid_at?: string | null
          service_type?: string
          status?: string
          user_id?: string
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
          amount_rwf: number
          completed_at: string | null
          created_at: string
          currency: string
          environment: string
          external_id: string
          failure_reason: string | null
          fee_rwf: number
          finalized_at: string | null
          financial_transaction_id: string | null
          id: string
          idempotency_key: string | null
          is_test: boolean
          kind: string
          mtn_amount: number
          mtn_status: string | null
          order_id: string | null
          phone: string
          reference_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_rwf: number
          completed_at?: string | null
          created_at?: string
          currency: string
          environment: string
          external_id: string
          failure_reason?: string | null
          fee_rwf?: number
          finalized_at?: string | null
          financial_transaction_id?: string | null
          id?: string
          idempotency_key?: string | null
          is_test?: boolean
          kind: string
          mtn_amount: number
          mtn_status?: string | null
          order_id?: string | null
          phone: string
          reference_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_rwf?: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          environment?: string
          external_id?: string
          failure_reason?: string | null
          fee_rwf?: number
          finalized_at?: string | null
          financial_transaction_id?: string | null
          id?: string
          idempotency_key?: string | null
          is_test?: boolean
          kind?: string
          mtn_amount?: number
          mtn_status?: string | null
          order_id?: string | null
          phone?: string
          reference_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "momo_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "ad_orders"
            referencedColumns: ["id"]
          },
        ]
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
      wallet_accounts: {
        Row: {
          balance_rwf: number
          created_at: string
          sandbox_balance_rwf: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_rwf?: number
          created_at?: string
          sandbox_balance_rwf?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_rwf?: number
          created_at?: string
          sandbox_balance_rwf?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount_rwf: number
          balance_after_rwf: number | null
          created_at: string
          description: string
          id: string
          is_test: boolean
          order_id: string | null
          payment_id: string | null
          sandbox_balance_after_rwf: number | null
          user_id: string
        }
        Insert: {
          amount_rwf: number
          balance_after_rwf?: number | null
          created_at?: string
          description: string
          id?: string
          is_test?: boolean
          order_id?: string | null
          payment_id?: string | null
          sandbox_balance_after_rwf?: number | null
          user_id: string
        }
        Update: {
          amount_rwf?: number
          balance_after_rwf?: number | null
          created_at?: string
          description?: string
          id?: string
          is_test?: boolean
          order_id?: string | null
          payment_id?: string | null
          sandbox_balance_after_rwf?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "ad_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: true
            referencedRelation: "momo_payments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_agency_settings: { Args: never; Returns: Json }
      agency_contacts: { Args: never; Returns: Json }
      calculate_video_quote: {
        Args: { ad_type: string; seconds: number; sound?: boolean }
        Returns: Json
      }
      debit_wallet_for_order: {
        Args: { p_order_id: string; p_user_id: string }
        Returns: Json
      }
      default_agency_settings: { Args: never; Returns: Json }
      finalize_momo_payment: {
        Args: {
          p_financial_transaction_id?: string
          p_mtn_status: string
          p_reference_id: string
        }
        Returns: Json
      }
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
      submit_professional_request: {
        Args: {
          p_assets?: Json
          p_brief: Json
          p_campaign?: Json
          p_honeypot?: string
          p_job_id?: string
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
