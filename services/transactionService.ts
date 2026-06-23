import { supabase } from '@/lib/supabase';
import type { Database, TransactionType } from '@/lib/database.types';

export type Transaction = Database['public']['Tables']['transactions']['Row'];

export type NewTransactionInput = {
  name: string;
  category: string;
  amount: number;
  type: TransactionType;
  occurredAt: Date;
};

export type UpdateTransactionInput = Partial<NewTransactionInput>;

const toRowInsert = (
  userId: string,
  input: NewTransactionInput
): Database['public']['Tables']['transactions']['Insert'] => ({
  user_id: userId,
  name: input.name,
  category: input.category,
  amount: input.amount,
  type: input.type,
  occurred_at: input.occurredAt.toISOString(),
});

const toRowUpdate = (
  input: UpdateTransactionInput
): Database['public']['Tables']['transactions']['Update'] => {
  const update: Database['public']['Tables']['transactions']['Update'] = {};
  if (input.name !== undefined) update.name = input.name;
  if (input.category !== undefined) update.category = input.category;
  if (input.amount !== undefined) update.amount = input.amount;
  if (input.type !== undefined) update.type = input.type;
  if (input.occurredAt !== undefined)
    update.occurred_at = input.occurredAt.toISOString();
  return update;
};

export const transactionService = {
  async list(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('occurred_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async create(userId: string, input: NewTransactionInput): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert(toRowInsert(userId, input))
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update(toRowUpdate(input))
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw error;
  },
};
