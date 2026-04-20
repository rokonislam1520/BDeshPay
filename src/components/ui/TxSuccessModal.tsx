"use client";

import { useEffect } from "react";
import { useConfetti } from "@/hooks/useConfetti";
import { CheckCircle, ExternalLink, X } from "lucide-react";

interface TxSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  amount?: string;
  txHash?: string;
  recipientName?: string;
  emoji?: string;
}

export function TxSuccessModal({
  isOpen,
  onClose,
  title,
  subtitle,
  amount,
  txHash,
  recipientName,
  emoji = "🎉",
}: TxSuccessProps) {
  const { fire } = useConfetti();

  useEffect(() => {
    if (isOpen) {
      fire();
    }
  }, [isOpen, fire]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-bd-dark-card rounded-t-3xl p-6 pb-10 animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-bd-dark-border flex items-center justify-center"
        >
          <X size={16} className="text-[var(--text-secondary)]" />
        </button>

        {/* Success icon */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 bg-bd-green/10 dark:bg-bd-green/20 rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-bd-green" />
            </div>
            <span className="absolute -top-1 -right-1 text-2xl">{emoji}</span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">{title}</h2>
            <p className="text-[var(--text-secondary)] text-sm mt-1">{subtitle}</p>
          </div>

          {amount && (
            <div className="w-full bg-bd-green/5 dark:bg-bd-green/10 rounded-2xl p-4">
              <p className="text-3xl font-bold text-bd-green">{amount}</p>
              {recipientName && (
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  → {recipientName}
                </p>
              )}
            </div>
          )}

          {txHash && (
            <a
              href={`https://celoscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-bd-green hover:underline"
            >
              <span className="font-mono">{txHash.slice(0, 16)}...</span>
              <ExternalLink size={12} />
            </a>
          )}

          <div className="w-full flex flex-col gap-2 mt-2">
            <button onClick={onClose} className="bdesh-btn-primary w-full">
              চালিয়ে যান ✓
            </button>
          </div>

          <p className="text-[var(--text-muted)] text-xs">
            Celo blockchain-এ সফলভাবে রেকর্ড হয়েছে 🔒
          </p>
        </div>
      </div>
    </div>
  );
}
