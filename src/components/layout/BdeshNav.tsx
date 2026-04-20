"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "হোম", emoji: "🏠", labelEn: "Home" },
  { href: "/remittance", label: "পাঠান", emoji: "💸", labelEn: "Send" },
  { href: "/bills", label: "বিল", emoji: "📋", labelEn: "Bills" },
  { href: "/savings", label: "সঞ্চয়", emoji: "🏦", labelEn: "Save" },
];

export function BdeshNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="bg-white dark:bg-bd-dark-card border-t border-[#E5F0EC] dark:border-bd-dark-border px-2 py-1">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-xl transition-all duration-200 min-w-[64px] ${
                  isActive
                    ? "bg-bd-green/10 dark:bg-bd-green/20"
                    : "hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                <span
                  className={`text-xl transition-transform duration-200 ${
                    isActive ? "scale-110" : ""
                  }`}
                >
                  {item.emoji}
                </span>
                <span
                  className={`text-[10px] font-semibold leading-none ${
                    isActive
                      ? "text-bd-green dark:text-green-400"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 bg-bd-green rounded-full mt-0.5" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
