"use client";

import { useState, useEffect } from "react";
import { useMiniPay, useBDeshBalance } from "@/hooks/useMiniPay";
import { useBDeshSavings } from "@/hooks/useBDeshSavings";
import { ConnectPrompt } from "@/components/ui/ConnectPrompt";
import { BdeshHeader } from "@/components/layout/BdeshHeader";
import { BdeshNav } from "@/components/layout/BdeshNav";
import { TrendingUp, Send, FileText, PiggyBank, Eye, EyeOff, RefreshCw, Copy, CheckCircle } from "lucide-react";
import Link from "next/link";
import { USD_TO_BDT, BD_INSPIRATIONAL_QUOTES } from "@/lib/bdesh-data";
import toast from "react-hot-toast";

const RECENT_TXS = [
  { id: 1, type: "send", label: "আব্বুকে পাঠানো", amount: -15.0, emoji: "💸", time: "২ ঘণ্টা আগে", status: "success" },
  { id: 2, type: "bill", label: "GP রিচার্জ", amount: -2.5, emoji: "📱", time: "গতকাল", status: "success" },
  { id: 3, type: "savings", label: "ঈদ সঞ্চয়", amount: -20.0, emoji: "🌙", time: "৩ দিন আগে", status: "success" },
  { id: 4, type: "receive", label: "Karim Bhai থেকে", amount: +50.0, emoji: "📥", time: "১ সপ্তাহ আগে", status: "success" },
];

export default function DashboardPage() {
  const { isConnected, address } = useMiniPay();
  const { cUSDBalance, usdtBalance, totalStableUSD, isLoading } = useBDeshBalance();
  const { pots, getTotalSaved } = useBDeshSavings(address);
  const [hideBalance, setHideBalance] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((i) => (i + 1) % BD_INSPIRATIONAL_QUOTES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("ঠিকানা কপি হয়েছে!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <BdeshHeader />
        <ConnectPrompt />
        <BdeshNav />
      </div>
    );
  }

  const totalSavedUSD = getTotalSaved();

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-24">
      <BdeshHeader />

      <div className="px-4 py-4 space-y-4 max-w-md mx-auto">
        {/* Hero Balance Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-bd-green via-bd-green-light to-[#005A40] p-5 shadow-xl shadow-bd-green/25">
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-bd-red/10 rounded-full" />

          {/* BD Flag stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-bd-green via-bd-red to-bd-green opacity-40 rounded-t-3xl" />

          <div className="relative">
            {/* Top row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-sm">মোট ব্যালেন্স</span>
                <button onClick={() => setHideBalance(!hideBalance)} className="text-white/50 hover:text-white transition-colors">
                  {hideBalance ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <RefreshCw size={13} className="text-white" />
              </button>
            </div>

            {/* Balance */}
            <div className="mb-1">
              {isLoading ? (
                <div className="h-10 w-36 bg-white/10 rounded-xl shimmer" />
              ) : (
                <div className="flex items-end gap-2">
                  <span className="text-white text-4xl font-bold tracking-tight">
                    {hideBalance ? "••••" : `$${totalStableUSD.toFixed(2)}`}
                  </span>
                </div>
              )}
            </div>
            <p className="text-green-200 text-sm mb-4">
              ≈ ৳{hideBalance ? "••••" : (totalStableUSD * USD_TO_BDT).toLocaleString()} টাকা
            </p>

            {/* Token pills */}
            <div className="flex gap-2 mb-4">
              <div className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-1.5">
                <div className="w-5 h-5 bg-[#5EA2EF] rounded-full flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">cUSD</span>
                </div>
                <span className="text-white text-sm font-medium">
                  {hideBalance ? "••" : `$${parseFloat(cUSDBalance?.formatted ?? "0").toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-1.5">
                <div className="w-5 h-5 bg-[#26A17B] rounded-full flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">USDT</span>
                </div>
                <span className="text-white text-sm font-medium">
                  {hideBalance ? "••" : `$${parseFloat(usdtBalance?.formatted ?? "0").toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Address */}
            <button
              onClick={copyAddress}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 rounded-lg px-2.5 py-1.5 transition-colors"
            >
              <span className="text-green-200 text-[11px] font-mono">
                {address?.slice(0, 10)}...{address?.slice(-6)}
              </span>
              {copied ? (
                <CheckCircle size={11} className="text-green-300" />
              ) : (
                <Copy size={11} className="text-green-300" />
              )}
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { href: "/remittance", emoji: "💸", label: "পাঠান" },
            { href: "/bills?tab=mobile", emoji: "📱", label: "রিচার্জ" },
            { href: "/bills?tab=electricity", emoji: "⚡", label: "বিদ্যুৎ" },
            { href: "/savings", emoji: "🏦", label: "সঞ্চয়" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-1.5 bg-white dark:bg-bd-dark-card border border-[var(--border)] rounded-2xl py-3.5 px-2 hover:border-bd-green/30 hover:bg-bd-green/5 transition-all duration-200 active:scale-95"
            >
              <span className="text-2xl">{action.emoji}</span>
              <span className="text-[11px] font-semibold text-[var(--text-secondary)]">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bdesh-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-bd-green/10 rounded-xl flex items-center justify-center">
                <PiggyBank size={16} className="text-bd-green" />
              </div>
              <span className="text-xs text-[var(--text-muted)]">মোট সঞ্চয়</span>
            </div>
            <p className="text-xl font-bold text-[var(--text-primary)]">
              ${totalSavedUSD.toFixed(2)}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
              {pots.length} টি পট
            </p>
          </div>

          <div className="bdesh-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-bd-red/10 rounded-xl flex items-center justify-center">
                <TrendingUp size={16} className="text-bd-red" />
              </div>
              <span className="text-xs text-[var(--text-muted)]">এই মাসে</span>
            </div>
            <p className="text-xl font-bold text-[var(--text-primary)]">$87.50</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">৫টি লেনদেন</p>
          </div>
        </div>

        {/* Inspirational quote */}
        <div className="bg-gradient-to-r from-bd-green/5 to-bd-red/5 dark:from-bd-green/10 dark:to-bd-red/10 border border-bd-green/10 rounded-2xl p-3.5">
          <p className="text-sm text-bd-green dark:text-green-400 font-medium text-center animate-fade-in" key={quoteIdx}>
            💚 {BD_INSPIRATIONAL_QUOTES[quoteIdx]}
          </p>
        </div>

        {/* Recent transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[var(--text-primary)]">সাম্প্রতিক লেনদেন</h2>
            <button className="text-xs text-bd-green font-medium">সব দেখুন →</button>
          </div>
          <div className="space-y-2">
            {RECENT_TXS.map((tx) => (
              <div key={tx.id} className="bdesh-card flex items-center gap-3 p-3.5">
                <div className="w-10 h-10 rounded-xl bg-[var(--surface)] flex items-center justify-center flex-shrink-0 text-xl">
                  {tx.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{tx.label}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">{tx.time}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.amount > 0 ? "text-bd-green" : "text-[var(--text-primary)]"}`}>
                    {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-bd-green rounded-full" />
                    <span className="text-[10px] text-[var(--text-muted)]">সম্পন্ন</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BD Cultural Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-bd-red/5 dark:bg-bd-red/10 border border-bd-red/10 p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🇧🇩</span>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">আমার দেশ, আমার টাকা</p>
              <p className="text-xs text-[var(--text-muted)]">Blockchain-এ বাংলাদেশের অর্থনীতি</p>
            </div>
            <span className="text-2xl ml-auto">🚀</span>
          </div>
        </div>
      </div>
    </div>
  );
}
