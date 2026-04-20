"use client";

import { useCallback } from "react";

export function useConfetti() {
  const fire = useCallback(async () => {
    if (typeof window === "undefined") return;
    const confetti = (await import("canvas-confetti")).default;

    const colors = ["#006A4E", "#F42A41", "#F5C842", "#FFFFFF"];

    // Burst from both sides
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { x: 0.2, y: 0.6 },
      colors,
    });
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { x: 0.8, y: 0.6 },
      colors,
    });

    // Delayed center burst
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { x: 0.5, y: 0.5 },
        colors,
        startVelocity: 30,
        gravity: 0.8,
      });
    }, 300);
  }, []);

  return { fire };
}
