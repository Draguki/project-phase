import { useState, useEffect, useCallback } from 'react';

export type TransactionCategory = 'fees' | 'print' | 'food';

export interface Transaction {
  id: string;
  category: TransactionCategory;
  merchant: string;
  amount: number;
  points: number;
  timestamp: string;
}

export interface WalletState {
  isAuthenticated: boolean;
  username: string | null;
  balance: number;
  points: number;
  transactions: Transaction[];
}

const DEFAULT_STATE: WalletState = {
  isAuthenticated: false,
  username: null,
  balance: 1500,
  points: 50,
  transactions: [
    {
      id: 'txn-1',
      category: 'food',
      merchant: 'Campus Cafeteria',
      amount: 120,
      points: 6,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 'txn-2',
      category: 'print',
      merchant: 'Library Print Lab',
      amount: 15,
      points: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: 'txn-3',
      category: 'fees',
      merchant: 'Library Fine',
      amount: 50,
      points: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    }
  ]
};

const STORAGE_KEY = 'campuspay_wallet_state';

export function useWallet() {
  const [state, setState] = useState<WalletState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load wallet state', e);
    }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save wallet state', e);
    }
  }, [state]);

  const login = useCallback((username: string) => {
    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      username,
    }));
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({
      ...prev,
      isAuthenticated: false,
      username: null,
    }));
  }, []);

  const transact = useCallback((amount: number, pointsEarned: number, category: TransactionCategory, merchant: string) => {
    setState(prev => {
      if (prev.balance < amount) {
        throw new Error('Insufficient balance');
      }
      return {
        ...prev,
        balance: prev.balance - amount,
        points: prev.points + pointsEarned,
        transactions: [
          {
            id: `txn-${Date.now()}`,
            category,
            merchant,
            amount,
            points: pointsEarned,
            timestamp: new Date().toISOString(),
          },
          ...prev.transactions
        ]
      };
    });
  }, []);

  return {
    ...state,
    login,
    logout,
    transact
  };
}
