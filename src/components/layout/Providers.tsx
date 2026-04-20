"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { wagmiConfig } from "@/lib/wagmi-config";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference
    const stored = localStorage.getItem("bdesh-theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: isDark ? "#111F3A" : "#FFFFFF",
              color: isDark ? "#F0F7F5" : "#0D1F1A",
              border: `1px solid ${isDark ? "#1E3050" : "#E5F0EC"}`,
              borderRadius: "12px",
              fontFamily: "'Hind Siliguri', sans-serif",
              fontSize: "14px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: { primary: "#006A4E", secondary: "#FFFFFF" },
            },
            error: {
              iconTheme: { primary: "#F42A41", secondary: "#FFFFFF" },
            },
          }}
        />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
