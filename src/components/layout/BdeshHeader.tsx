"use client";

import { useState, useEffect } from "react";
import { useMiniPay } from "@/hooks/useMiniPay";
import { Bell, Moon, Sun } from "lucide-react";

export function BdeshHeader() {
  const { address, isMiniPay } = useMiniPay();
  const [isDark, setIsDark] = useState(false);
  const [notifications] = useState(2);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("bdesh-theme", newDark ? "dark" : "light");
  };

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <header className="sticky top-0 z-50 bg-bd-green dark:bg-bd-dark-card safe-top">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="text-2xl">🚀</span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-white font-bold text-lg leading-none tracking-tight">
                BDeshPay
              </span>
              <span className="text-[10px] bg-bd-gold text-bd-green-dark font-bold px-1.5 py-0.5 rounded-full leading-none">
                BETA
              </span>
            </div>
            <div className="text-green-200 dark:text-green-400 text-[10px] leading-none mt-0.5">
              🇧🇩 বাংলাদেশের পে
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode (hide in MiniPay to save space) */}
          {!isMiniPay && (
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              {isDark ? (
                <Sun size={15} className="text-white" />
              ) : (
                <Moon size={15} className="text-white" />
              )}
            </button>
          )}

          {/* Notification bell */}
          <button className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center relative transition-colors">
            <Bell size={15} className="text-white" />
            {notifications > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-bd-red rounded-full flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">{notifications}</span>
              </span>
            )}
          </button>

          {/* Wallet badge */}
          {address && (
            <div className="flex items-center gap-1.5 bg-white/15 rounded-lg px-2.5 py-1.5">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-white text-xs font-medium">{shortAddress}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
