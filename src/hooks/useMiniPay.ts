"use client";

import { useEffect, useState, useCallback } from "react";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { injected } from "wagmi/connectors";
import { celo } from "wagmi/chains";
import { CELO_TOKENS } from "@/lib/wagmi-config";

export function useMiniPay() {
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { address, isConnected, chain } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  // Detect MiniPay
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mp =
        (window as any).ethereum?.isMiniPay ||
        (window as any).ethereum?.isCelo ||
        false;
      setIsMiniPay(mp);
    }
  }, []);

  // Auto-connect in MiniPay
  useEffect(() => {
    if (isMiniPay && !isConnected) {
      setIsConnecting(true);
      connect(
        { connector: injected(), chainId: celo.id },
        {
          onSettled: () => setIsConnecting(false),
        }
      );
    }
  }, [isMiniPay, isConnected, connect]);

  const connectWallet = useCallback(() => {
    setIsConnecting(true);
    connect(
      { connector: injected(), chainId: celo.id },
      { onSettled: () => setIsConnecting(false) }
    );
  }, [connect]);

  return {
    isMiniPay,
    address,
    isConnected,
    chain,
    isConnecting,
    connectWallet,
    disconnect,
  };
}

export function useBDeshBalance() {
  const { address } = useAccount();

  const { data: celoBalance } = useBalance({
    address,
    chainId: celo.id,
  });

  const { data: cUSDBalance } = useBalance({
    address,
    token: CELO_TOKENS.cUSD,
    chainId: celo.id,
  });

  const { data: usdtBalance } = useBalance({
    address,
    token: CELO_TOKENS.USDT,
    chainId: celo.id,
  });

  const totalStableUSD =
    parseFloat(cUSDBalance?.formatted ?? "0") +
    parseFloat(usdtBalance?.formatted ?? "0");

  return {
    celoBalance,
    cUSDBalance,
    usdtBalance,
    totalStableUSD,
    isLoading: !cUSDBalance && !usdtBalance,
  };
}
