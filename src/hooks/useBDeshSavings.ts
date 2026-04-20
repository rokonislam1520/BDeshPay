"use client";

import { useState, useEffect, useCallback } from "react";
import { calcFakeInterest } from "@/lib/bdesh-data";

export interface SavingsPot {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description?: string;
  targetUSD?: number;
  depositedUSD: number;
  createdAt: number; // timestamp
  txHash?: string;
}

const STORAGE_KEY = "bdeshpay_savings_v1";

export function useBDeshSavings(address?: string) {
  const [pots, setPots] = useState<SavingsPot[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const storageKey = address ? `${STORAGE_KEY}_${address.toLowerCase()}` : STORAGE_KEY;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          setPots(JSON.parse(stored));
        } catch {
          setPots([]);
        }
      }
      setIsLoaded(true);
    }
  }, [storageKey]);

  const savePots = useCallback(
    (newPots: SavingsPot[]) => {
      setPots(newPots);
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(newPots));
      }
    },
    [storageKey]
  );

  const createPot = useCallback(
    (pot: Omit<SavingsPot, "depositedUSD" | "createdAt">) => {
      const newPot: SavingsPot = {
        ...pot,
        depositedUSD: 0,
        createdAt: Date.now(),
      };
      savePots([...pots, newPot]);
      return newPot;
    },
    [pots, savePots]
  );

  const depositToPot = useCallback(
    (potId: string, amount: number, txHash?: string) => {
      const updated = pots.map((p) =>
        p.id === potId
          ? { ...p, depositedUSD: p.depositedUSD + amount, txHash }
          : p
      );
      savePots(updated);
    },
    [pots, savePots]
  );

  const withdrawFromPot = useCallback(
    (potId: string, amount: number) => {
      const updated = pots.map((p) =>
        p.id === potId
          ? { ...p, depositedUSD: Math.max(0, p.depositedUSD - amount) }
          : p
      );
      savePots(updated);
    },
    [pots, savePots]
  );

  const deletePot = useCallback(
    (potId: string) => {
      savePots(pots.filter((p) => p.id !== potId));
    },
    [pots, savePots]
  );

  const getTotalSaved = () =>
    pots.reduce((acc, p) => acc + p.depositedUSD, 0);

  const getInterestEarned = (pot: SavingsPot): number => {
    const daysAgo = (Date.now() - pot.createdAt) / (1000 * 60 * 60 * 24);
    return calcFakeInterest(pot.depositedUSD, daysAgo);
  };

  return {
    pots,
    isLoaded,
    createPot,
    depositToPot,
    withdrawFromPot,
    deletePot,
    getTotalSaved,
    getInterestEarned,
  };
}
