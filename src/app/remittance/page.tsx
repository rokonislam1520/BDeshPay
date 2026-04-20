"use client";

import { useState } from "react";
import { useMiniPay, useBDeshBalance } from "@/hooks/useMiniPay";
import { BdeshHeader } from "@/components/layout/BdeshHeader";
import { BdeshNav } from "@/components/layout/BdeshNav";
import { ConnectPrompt } from "@/components/ui/ConnectPrompt";
import { TxSuccessModal } from "@/components/ui/TxSuccessModal";
import {
  BD_MOCK_CONTACTS,
  isBDPhoneNumber,
  mockPhoneToWallet,
  USD_TO_BDT,
} from "@/lib/bdesh-data";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { CELO_TOKENS, ERC20_ABI } from "@/lib/wagmi-config";
import { Send, Phone, Wallet, ChevronDown, ArrowRight, User } from "lucide-react";
import toast from "react-hot-toast";

type SendMode = "phone" | "address";
type Token = "cUSD" | "USDT";

export default function RemittancePage() {
  const { isConnected, address } = useMiniPay();
  const { cUSDBalance, usdtBalance } = useBDeshBalance();
  const { writeContractAsync } = useWriteContract();

  const [mode, setMode] = useState<SendMode>("phone");
  const [phone, setPhone] = useState("");
  const [walletAddr, setWalletAddr] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<Token>("cUSD");
  const [note, setNote] = useState("");
  const [resolvedWallet, setResolvedWallet] = useState<string | null>(null);
  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [txHash, setTxHash] = useState<string | undefined>();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showContacts, setShowContacts] = useState(false);

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    setResolvedWallet(null);
    setResolvedName(null);
    if (isBDPhoneNumber(val)) {
      const wallet = mockPhoneToWallet(val);
      const contact = BD_MOCK_CONTACTS.find((c) => c.phone === val);
      if (wallet) {
        setResolvedWallet(wallet);
        setResolvedName(contact?.name ?? "পরিচিত ব্যবহারকারী");
        toast.success(`${contact?.name ?? "Wallet"} খুঁজে পাওয়া গেছে!`);
      } else {
        toast.error("এই নম্বর নিবন্ধিত নয়");
      }
    }
  };

  const selectContact = (contact: (typeof BD_MOCK_CONTACTS)[0]) => {
    setPhone(contact.phone);
    const wallet = mockPhoneToWallet(contact.phone);
    setResolvedWallet(wallet);
    setResolvedName(contact.name);
    setShowContacts(false);
  };

  const getBalance = () =>
    token === "cUSD"
      ? parseFloat(cUSDBalance?.formatted ?? "0")
      : parseFloat(usdtBalance?.formatted ?? "0");

  const getTokenAddress = () =>
    token === "cUSD" ? CELO_TOKENS.cUSD : CELO_TOKENS.USDT;

  const recipient =
    mode === "phone"
      ? (resolvedWallet as `0x${string}` | null)
      : (walletAddr as `0x${string}`);

  const isValid =
    recipient &&
    recipient.startsWith("0x") &&
    recipient.length === 42 &&
    parseFloat(amount) > 0 &&
    parseFloat(amount) <= getBalance();

  const handleSend = async () => {
    if (!isValid || !recipient) return;
    setIsSending(true);
    try {
      const amountParsed = parseUnits(amount, 18);
      const hash = await writeContractAsync({
        address: getTokenAddress(),
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [recipient as `0x${string}`, amountParsed],
      });
      setTxHash(hash);
      setShowSuccess(true);
    } catch (err: any) {
      toast.error(err?.shortMessage ?? "লেনদেন ব্যর্থ হয়েছে");
    } finally {
      setIsSending(false);
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

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-24">
      <BdeshHeader />

      {/* Hero */}
      <div className="bg-gradient-to-br from-bd-green to-bd-green-dark px-4 pt-4 pb-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <Send size={18} className="text-green-300" />
            <h1 className="text-white font-bold text-lg">রেমিট্যান্স পাঠান</h1>
          </div>
          <p className="text-green-200 text-sm">বাংলাদেশে তাৎক্ষণিক টাকা পাঠান</p>
        </div>
      </div>

      <div className="px-4 -mt-4 max-w-md mx-auto space-y-3 pb-4">
        {/* Card */}
        <div className="bdesh-card p-5 shadow-lg">
          {/* Mode switcher */}
          <div className="flex bg-[var(--surface)] rounded-xl p-1 mb-5">
            {(["phone", "address"] as SendMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === m
                    ? "bg-white dark:bg-bd-dark-card shadow text-bd-green"
                    : "text-[var(--text-muted)]"
                }`}
              >
                {m === "phone" ? <Phone size={14} /> : <Wallet size={14} />}
                {m === "phone" ? "ফোন নম্বর" : "Wallet ঠিকানা"}
              </button>
            ))}
          </div>

          {/* Phone input */}
          {mode === "phone" && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  বাংলাদেশী মোবাইল নম্বর
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-sm text-[var(--text-secondary)] border-r border-[var(--border)] pr-2.5">
                    <span>🇧🇩</span>
                    <span>+880</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="bdesh-input pl-20"
                    maxLength={11}
                  />
                  <button
                    onClick={() => setShowContacts(!showContacts)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-bd-green transition-colors"
                  >
                    <User size={16} />
                  </button>
                </div>
              </div>

              {/* Contacts dropdown */}
              {showContacts && (
                <div className="border border-[var(--border)] rounded-xl overflow-hidden">
                  {BD_MOCK_CONTACTS.map((c) => (
                    <button
                      key={c.phone}
                      onClick={() => selectContact(c)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bd-green/5 transition-colors border-b border-[var(--border)] last:border-0"
                    >
                      <span className="text-xl">{c.avatar}</span>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{c.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{c.phone} · {c.relation}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Resolved wallet badge */}
              {resolvedWallet && (
                <div className="flex items-center gap-2 bg-bd-green/5 dark:bg-bd-green/10 border border-bd-green/20 rounded-xl px-3 py-2.5">
                  <div className="w-2 h-2 bg-bd-green rounded-full animate-pulse" />
                  <div>
                    <p className="text-xs font-semibold text-bd-green">{resolvedName}</p>
                    <p className="text-[10px] font-mono text-[var(--text-muted)]">
                      {resolvedWallet.slice(0, 12)}...{resolvedWallet.slice(-8)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Wallet address input */}
          {mode === "address" && (
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                Celo Wallet ঠিকানা
              </label>
              <input
                type="text"
                value={walletAddr}
                onChange={(e) => setWalletAddr(e.target.value)}
                placeholder="0x..."
                className="bdesh-input font-mono text-sm"
              />
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-[10px] text-[var(--text-muted)] font-medium">পরিমাণ</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          {/* Amount + Token */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg font-medium">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="bdesh-input pl-8 text-xl font-bold"
                  min="0"
                  step="0.01"
                />
              </div>
              <button
                onClick={() => setToken(token === "cUSD" ? "USDT" : "cUSD")}
                className="flex items-center gap-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 min-w-[80px] hover:border-bd-green/30 transition-colors"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${token === "cUSD" ? "bg-[#5EA2EF]" : "bg-[#26A17B]"}`}>
                  <span className="text-[7px] font-bold text-white">{token.slice(0, 3)}</span>
                </div>
                <span className="text-sm font-semibold text-[var(--text-primary)]">{token}</span>
                <ChevronDown size={12} className="text-[var(--text-muted)]" />
              </button>
            </div>

            {amount && (
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1">
                <span>≈ ৳{(parseFloat(amount || "0") * USD_TO_BDT).toLocaleString()} টাকা</span>
                <button
                  onClick={() => setAmount(getBalance().toFixed(2))}
                  className="text-bd-green font-medium"
                >
                  সর্বোচ্চ: ${getBalance().toFixed(2)}
                </button>
              </div>
            )}

            {/* Quick amounts */}
            <div className="flex gap-2">
              {[5, 10, 25, 50].map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(String(a))}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    amount === String(a)
                      ? "bg-bd-green text-white border-bd-green"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:border-bd-green/30"
                  }`}
                >
                  ${a}
                </button>
              ))}
            </div>

            {/* Note */}
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="নোট (ঐচ্ছিক) — যেমন: বাড়ি ভাড়া, খরচ..."
              className="bdesh-input text-sm"
              maxLength={80}
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!isValid || isSending}
            className="bdesh-btn-primary w-full mt-5 flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                পাঠানো হচ্ছে...
              </>
            ) : (
              <>
                পাঠান
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { emoji: "⚡", label: "তাৎক্ষণিক", sub: "~5 সেকেন্ড" },
            { emoji: "💚", label: "সাশ্রয়ী", sub: "<$0.01 ফি" },
            { emoji: "🔒", label: "নিরাপদ", sub: "Blockchain" },
          ].map((info) => (
            <div key={info.label} className="bdesh-card p-3 text-center">
              <span className="text-xl block mb-1">{info.emoji}</span>
              <p className="text-xs font-bold text-[var(--text-primary)]">{info.label}</p>
              <p className="text-[10px] text-[var(--text-muted)]">{info.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <TxSuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          setAmount("");
          setPhone("");
          setWalletAddr("");
          setResolvedWallet(null);
          setResolvedName(null);
        }}
        title="টাকা পাঠানো সফল! 🎉"
        subtitle="রিসিভার এখনই পাবেন"
        amount={`$${parseFloat(amount || "0").toFixed(2)} ${token}`}
        txHash={txHash}
        recipientName={resolvedName ?? undefined}
        emoji="💸"
      />

      <BdeshNav />
    </div>
  );
}
