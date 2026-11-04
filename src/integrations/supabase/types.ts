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
      debit_wallet_for_order: {
        Args: { p_order_id: string; p_user_id: string }
        Returns: Json
      }
      finalize_momo_payment: {
        Args: {
          p_financial_transaction_id?: string
          p_mtn_status: string
          p_reference_id: string
        }
        Returns: Json
      }
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
    Enums: {},
  },
} as const
