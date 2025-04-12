export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      api_keys: {
        Row: {
          id: string
          user_id: string
          name: string
          exchange: string
          api_key: string
          api_secret: string
          passphrase: string | null
          memo: string | null
          test_mode: boolean | null
          enabled: boolean | null
          created_at: string | null
          last_used: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          exchange: string
          api_key: string
          api_secret: string
          passphrase?: string | null
          memo?: string | null
          test_mode?: boolean | null
          enabled?: boolean | null
          created_at?: string | null
          last_used?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          exchange?: string
          api_key?: string
          api_secret?: string
          passphrase?: string | null
          memo?: string | null
          test_mode?: boolean | null
          enabled?: boolean | null
          created_at?: string | null
          last_used?: string | null
        }
      }
    }
    Views: {
      [_ in string]: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
    }
    Functions: {
      [_ in string]: {
        Args: Record<string, unknown>
        Returns: unknown
      }
    }
    Enums: {
      [_ in string]: {
        [_ in string]: string
      }
    }
    CompositeTypes: {
      [_ in string]: {
        [_ in string]: unknown
      }
    }
  }
}
