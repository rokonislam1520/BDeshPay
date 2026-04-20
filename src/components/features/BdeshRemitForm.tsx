"use client";

import { useState } from "react";
import { BD_MOCK_CONTACTS, isBDPhoneNumber, mockPhoneToWallet, USD_TO_BDT } from "@/lib/bdesh-data";
import { Phone, Wallet, User, ChevronDown, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

type SendMode = "phone" | "address";
type Token = "cUSD" | "USDT";

interface BdeshRemitFormProps {
  balance: number;
  token: Token;
  onTokenChange: (t: Token) => void;
  onSubmit: (recipient: `0x${string}`, amount: string, recipientName: string | null) => void;
  isSending: boolean;
}

export function BdeshRemitForm({
  balance,
  token,
  onTokenChange,
  onSubmit,
  isSending,
}: BdeshRemitFormProps) {
  const [mode, setMode] = useState<SendMode>("phone");
  const [phone, setPhone] = useState("");
  const [walletAddr, setWalletAddr] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [resolvedWallet, setResolvedWallet] = useState<string | null>(null);
  const [resolvedName, setResolvedName] = useState<string | null>(null);
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
        setResolvedName(contact?.name ?? "ব্যবহারকারী");
        toast.success(`${contact?.name ?? "Wallet"} পাওয়া গেছে!`);
      } else {
        toast.error("এই নম্বর নিবন্ধিত নয়");
      }
    }
  };

  const recipient = mode === "phone" ? resolvedWallet : walletAddr;
  const isValid =
    recipient &&
    recipient.startsWith("0x") &&
    recipient.length === 42 &&
    parseFloat(amount) > 0 &&
    parseFloat(amount) <= balance;

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex bg-[var(--surface)] rounded-xl p-1">
        {(["phone", "address"] as SendMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === m
                ? "bg-white dark:bg-bd-dark-card shadow text-bd-green"
                : "text-[var(--text-muted)]"
            }`}
          >
            {m === "phone" ? <Phone size={14} /> : <Wallet size={14} />}
            {m === "phone" ? "ফোন নম্বর" : "Wallet"}
          </button>
        ))}
      </div>

      {mode === "phone" && (
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-sm text-[var(--text-secondary)] border-r border-[var(--border)] pr-2.5 z-10">
              🇧🇩 +880
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="017XXXXXXXX"
              className="bdesh-input pl-20 pr-10"
              maxLength={11}
            />
            <button
              onClick={() => setShowContacts(!showContacts)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-bd-green"
            >
              <User size={16} />
            </button>
          </div>

          {showContacts && (
            <div className="border border-[var(--border)] rounded-xl overflow-hidden shadow-lg">
              {BD_MOCK_CONTACTS.map((c) => (
                <button
                  key={c.phone}
                  onClick={() => {
                    handlePhoneChange(c.phone);
                    setShowContacts(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bd-green/5 border-b border-[var(--border)] last:border-0 transition-colors"
                >
                  <span className="text-xl">{c.avatar}</span>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{c.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{c.phone}</p>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] bg-[var(--surface)] px-2 py-0.5 rounded-full">
                    {c.relation}
                  </span>
                </button>
              ))}
            </div>
          )}

          {resolvedWallet && (
            <div className="flex items-center gap-2 bg-bd-green/5 border border-bd-green/20 rounded-xl px-3 py-2.5">
              <CheckCircle size={14} className="text-bd-green flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-bd-green">{resolvedName}</p>
                <p className="text-[10px] font-mono text-[var(--text-muted)]">
                  {resolvedWallet.slice(0, 12)}...{resolvedWallet.slice(-8)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "address" && (
        <input
          type="text"
          value={walletAddr}
          onChange={(e) => setWalletAddr(e.target.value)}
          placeholder="0x..."
          className="bdesh-input font-mono text-sm"
        />
      )}

      {/* Amount row */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="bdesh-input pl-7 text-xl font-bold"
          />
        </div>
        <button
          onClick={() => onTokenChange(token === "cUSD" ? "USDT" : "cUSD")}
          className="flex items-center gap-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 hover:border-bd-green/30 transition-colors"
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${token === "cUSD" ? "bg-[#5EA2EF]" : "bg-[#26A17B]"}`}>
            <span className="text-[7px] font-bold text-white">{token.slice(0,3)}</span>
          </div>
          <span className="text-sm font-semibold text-[var(--text-primary)]">{token}</span>
          <ChevronDown size={12} className="text-[var(--text-muted)]" />
        </button>
      </div>

      {amount && parseFloat(amount) > 0 && (
        <div className="flex justify-between text-xs px-1">
          <span className="text-[var(--text-muted)]">≈ ৳{(parseFloat(amount) * USD_TO_BDT).toLocaleString()}</span>
          <button onClick={() => setAmount(balance.toFixed(2))} className="text-bd-green font-medium">
            সর্বোচ্চ ${balance.toFixed(2)}
          </button>
        </div>
      )}

      <div className="flex gap-2">
        {[5, 10, 25, 50].map((a) => (
          <button
            key={a}
            onClick={() => setAmount(String(a))}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              amount === String(a) ? "bg-bd-green text-white border-bd-green" : "border-[var(--border)] text-[var(--text-secondary)]"
            }`}
          >
            ${a}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="নোট (ঐচ্ছিক)"
        className="bdesh-input text-sm"
        maxLength={80}
      />

      <button
        onClick={() => isValid && onSubmit(recipient as `0x${string}`, amount, resolvedName)}
        disabled={!isValid || isSending}
        className="bdesh-btn-primary w-full flex items-center justify-center gap-2"
      >
        {isSending ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />পাঠানো হচ্ছে...</>
        ) : (
          "💸 পাঠান"
        )}
      </button>
    </div>
  );
}
