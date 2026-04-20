"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, CheckCircle, RefreshCw } from "lucide-react";
import { USD_TO_BDT } from "@/lib/bdesh-data";
import toast from "react-hot-toast";
import type { GetBalanceReturnType } from "wagmi/actions";

interface BdeshBalanceCardProps {
  address?: `0x${string}`;
  cUSDBalance?: GetBalanceReturnType;
  usdtBalance?: GetBalanceReturnType;
  totalUSD: number;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function BdeshBalanceCard({
  address,
  cUSDBalance,
  usdtBalance,
  totalUSD,
  isLoading,
  onRefresh,
}: BdeshBalanceCardProps) {
  const [hide, setHide] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success("ঠিকানা কপি হয়েছে!");
    setTimeout(() => setCopied(false), 2000);
  };

  const cusd = parseFloat(cUSDBalance?.formatted ?? "0");
  const usdt = parseFloat(usdtBalance?.formatted ?? "0");

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-bd-green via-bd-green-light to-[#005A40] p-5 shadow-2xl shadow-bd-green/30">
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-bd-red/10 rounded-full" />
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* BD map watermark */}
      <div className="absolute right-4 bottom-4 opacity-5 text-7xl select-none pointer-events-none">
        🇧🇩
      </div>

      <div className="relative">
        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm font-medium">মোট স্থিতি</span>
            <button
              onClick={() => setHide(!hide)}
              className="text-white/40 hover:text-white/80 transition-colors"
            >
              {hide ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
            >
              <RefreshCw size={13} className="text-white" />
            </button>
          )}
        </div>

        {/* Main balance */}
        <div className="mb-1">
          {isLoading ? (
            <div className="h-11 w-40 bg-white/10 rounded-xl shimmer" />
          ) : (
            <p className="text-white text-4xl font-bold tracking-tight">
              {hide ? "$ ••••••" : `$${totalUSD.toFixed(2)}`}
            </p>
          )}
        </div>
        <p className="text-green-200 text-sm mb-5">
          ≈ ৳{hide ? "••••" : (totalUSD * USD_TO_BDT).toLocaleString("bn-BD")} বাংলাদেশি টাকা
        </p>

        {/* Token breakdown */}
        <div className="flex gap-2 mb-5">
          <div className="flex items-center gap-2 bg-white/10 rounded-2xl px-3 py-2">
            <div className="w-6 h-6 bg-[#5EA2EF] rounded-full flex items-center justify-center">
              <span className="text-[8px] font-extrabold text-white">cUSD</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-none">
                {hide ? "••••" : `$${cusd.toFixed(2)}`}
              </p>
              <p className="text-green-300 text-[10px] leading-none mt-0.5">Celo Dollar</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-2xl px-3 py-2">
            <div className="w-6 h-6 bg-[#26A17B] rounded-full flex items-center justify-center">
              <span className="text-[8px] font-extrabold text-white">USDT</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-none">
                {hide ? "••••" : `$${usdt.toFixed(2)}`}
              </p>
              <p className="text-green-300 text-[10px] leading-none mt-0.5">Tether USD</p>
            </div>
          </div>
        </div>

        {/* Address */}
        {address && (
          <button
            onClick={copyAddress}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 transition-colors"
          >
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
            <span className="text-green-100 text-xs font-mono">
              {address.slice(0, 8)}...{address.slice(-6)}
            </span>
            {copied ? (
              <CheckCircle size={12} className="text-green-300" />
            ) : (
              <Copy size={12} className="text-green-300/60" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
