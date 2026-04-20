"use client";

import { SavingsPot } from "@/hooks/useBDeshSavings";
import { ArrowDownCircle, ArrowUpCircle, Trash2 } from "lucide-react";

interface BdeshSavingsPotProps {
  pot: SavingsPot;
  interestEarned: number;
  onDeposit: () => void;
  onWithdraw: () => void;
  onDelete: () => void;
}

export function BdeshSavingsPot({
  pot,
  interestEarned,
  onDeposit,
  onWithdraw,
  onDelete,
}: BdeshSavingsPotProps) {
  const progress = pot.targetUSD
    ? Math.min(100, (pot.depositedUSD / pot.targetUSD) * 100)
    : null;

  const daysOld = Math.floor((Date.now() - pot.createdAt) / (1000 * 60 * 60 * 24));

  return (
    <div className="bdesh-card p-4 relative overflow-hidden animate-fade-in">
      {/* Left color stripe */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ backgroundColor: pot.color }}
      />

      <div className="pl-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: pot.color + "20" }}
            >
              {pot.emoji}
            </div>
            <div>
              <p className="font-bold text-[var(--text-primary)] text-sm leading-tight">{pot.name}</p>
              {pot.description && (
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{pot.description}</p>
              )}
              <p className="text-[10px] text-[var(--text-muted)]">{daysOld} দিন আগে তৈরি</p>
            </div>
          </div>
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-lg bg-[var(--surface)] flex items-center justify-center hover:bg-bd-red/10 transition-colors group"
          >
            <Trash2 size={13} className="text-[var(--text-muted)] group-hover:text-bd-red transition-colors" />
          </button>
        </div>

        {/* Balance */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-2xl font-bold" style={{ color: pot.color }}>
              ${pot.depositedUSD.toFixed(2)}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px] text-bd-green font-medium">
                +${interestEarned.toFixed(6)} সুদ
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">অর্জিত</span>
            </div>
          </div>
          {pot.targetUSD && (
            <div className="text-right">
              <p className="text-xs font-bold text-[var(--text-secondary)]">
                ${pot.depositedUSD.toFixed(0)} / ${pot.targetUSD}
              </p>
              <p className="text-[10px] text-[var(--text-muted)]">
                ${(pot.targetUSD - pot.depositedUSD).toFixed(2)} বাকি
              </p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {progress !== null && (
          <div className="mb-3">
            <div className="flex justify-between text-[10px] text-[var(--text-muted)] mb-1">
              <span>{progress.toFixed(0)}% সম্পন্ন</span>
              {progress >= 100 && <span className="text-bd-gold font-bold">🎉 লক্ষ্য পূরণ!</span>}
            </div>
            <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  backgroundColor: progress >= 100 ? "#F5C842" : pot.color,
                }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onDeposit}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
            style={{ backgroundColor: pot.color + "15", color: pot.color }}
          >
            <ArrowDownCircle size={13} />
            জমা করুন
          </button>
          <button
            onClick={onWithdraw}
            disabled={pot.depositedUSD <= 0}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--border)] transition-all active:scale-95 disabled:opacity-40"
          >
            <ArrowUpCircle size={13} />
            তুলুন
          </button>
        </div>
      </div>
    </div>
  );
}
