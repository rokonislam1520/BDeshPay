"use client";

import { useMiniPay } from "@/hooks/useMiniPay";

export function ConnectPrompt() {
  const { connectWallet, isConnecting, isMiniPay } = useMiniPay();

  if (isMiniPay) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-6">
        <div className="w-16 h-16 rounded-2xl bg-bd-green/10 flex items-center justify-center">
          <span className="text-3xl">🔗</span>
        </div>
        <p className="text-[var(--text-secondary)] text-sm text-center">
          MiniPay wallet সংযোগ হচ্ছে...
        </p>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-bd-green rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6 text-center">
      {/* BD Map + Rocket SVG */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-bd-green/10 dark:bg-bd-green/20 flex items-center justify-center">
          <span className="text-5xl">🚀</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-bd-red/10 flex items-center justify-center">
          <span className="text-2xl">🇧🇩</span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
          BDeshPay-তে স্বাগতম!
        </h1>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          বিল দিন, টাকা পাঠান, সঞ্চয় করুন
          <br />
          <span className="text-bd-green font-medium">Celo blockchain</span>-এর উপর
        </p>
      </div>

      <div className="w-full max-w-xs">
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bdesh-btn-primary w-full flex items-center justify-center gap-2"
        >
          {isConnecting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              সংযোগ হচ্ছে...
            </>
          ) : (
            <>
              <span>🔗</span>
              Wallet সংযোগ করুন
            </>
          )}
        </button>

        <p className="text-[var(--text-muted)] text-xs mt-3">
          MiniPay, MetaMask বা যেকোনো Celo wallet
        </p>
      </div>

      <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
        <span>⚡ তাৎক্ষণিক লেনদেন</span>
        <span>🔒 নিরাপদ ও বিশ্বস্ত</span>
        <span>💰 কম খরচ</span>
      </div>
    </div>
  );
}
