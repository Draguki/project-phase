import { useSyncExternalStore, useCallback } from 'react';

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
  redeemedRewards: string[];
}

const DEFAULT_STATE: WalletState = {
  isAuthenticated: false,
  username: null,
  balance: 1500,
  points: 50,
  redeemedRewards: [],
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

function loadInitialState(): WalletState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load wallet state', e);
  }
  return DEFAULT_STATE;
}

let currentState: WalletState = loadInitialState();
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist(state: WalletState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save wallet state', e);
  }
}

function setState(updater: (prev: WalletState) => WalletState) {
  currentState = updater(currentState);
  persist(currentState);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return currentState;
}

export function useWallet() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

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

  const transact = useCallback(
    (amount: number, pointsEarned: number, category: TransactionCategory, merchant: string) => {
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
            ...prev.transactions,
          ],
        };
      });
    },
    []
  );

  const claimReward = useCallback((rewardId: string, cost: number) => {
    setState(prev => {
      if (prev.redeemedRewards.includes(rewardId)) {
        throw new Error('This reward has already been claimed');
      }
      if (prev.points < cost) {
        throw new Error(`You need ${cost - prev.points} more points to claim this reward`);
      }
      return {
        ...prev,
        points: prev.points - cost,
        redeemedRewards: [...prev.redeemedRewards, rewardId],
      };
    });
  }, []);

  return {
    ...state,
    login,
    logout,
    transact,
    claimReward,
  };
}
