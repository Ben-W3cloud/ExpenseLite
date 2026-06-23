import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { transactionService } from '@/services/transactionService';
import type { Transaction, NewTransactionInput, UpdateTransactionInput } from '@/services/transactionService';

type UseTransactionsReturn = {
  transactions: Transaction[];
  loading: boolean;
  totals: { income: number; expenses: number; balance: number };
  add: (input: NewTransactionInput) => Promise<Transaction>;
  update: (id: string, input: UpdateTransactionInput) => Promise<Transaction>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

export function useTransactions(): UseTransactionsReturn {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await transactionService.list(user.id);
      setTransactions(data);
    } catch {
      // silently fail, keep stale data
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + Number(t.amount), 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + Number(t.amount), 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const add = useCallback(
    async (input: NewTransactionInput) => {
      if (!user) throw new Error('Not authenticated');
      const tx = await transactionService.create(user.id, input);
      setTransactions((prev) => [tx, ...prev]);
      return tx;
    },
    [user],
  );

  const update = useCallback(async (id: string, input: UpdateTransactionInput) => {
    const tx = await transactionService.update(id, input);
    setTransactions((prev) => prev.map((t) => (t.id === id ? tx : t)));
    return tx;
  }, []);

  const remove = useCallback(async (id: string) => {
    await transactionService.remove(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { transactions, loading, totals, add, update, remove, refresh };
}
