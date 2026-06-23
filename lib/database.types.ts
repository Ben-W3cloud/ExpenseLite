// Minimal hand-rolled types for the ExpenseLite schema.
// Regenerate with `supabase gen types typescript` if/when the schema grows.

export type TransactionType = 'expense' | 'income';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          currency: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          email: string;
          currency?: string;
          avatar_url?: string | null;
        };
        Update: {
          full_name?: string;
          email?: string;
          currency?: string;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          amount: number;
          type: TransactionType;
          occurred_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category: string;
          amount: number;
          type: TransactionType;
          occurred_at?: string;
        };
        Update: {
          name?: string;
          category?: string;
          amount?: number;
          type?: TransactionType;
          occurred_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      transaction_type: TransactionType;
    };
    CompositeTypes: Record<string, never>;
  };
};
