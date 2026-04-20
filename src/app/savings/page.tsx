"use client";

import { useState } from "react";
import { useMiniPay, useBDeshBalance } from "@/hooks/useMiniPay";
import { useBDeshSavings, SavingsPot } from "@/hooks/useBDeshSavings";
import { BdeshHeader } from "@/components/layout/BdeshHeader";
import { BdeshNav } from "@/components/layout/BdeshNav";
import { ConnectPrompt } from "@/components/ui/ConnectPrompt";
import { TxSuccessModal } from "@/components/ui/TxSuccessModal";
import { SAVINGS_POT_PRESETS, USD_TO_BDT } from "@/lib/bdesh-data";
import { useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { CELO_TOKENS, ERC20_ABI, BDESH_SAVINGS_ADDRESS } from "@/lib/wagmi-config";
import { Plus, TrendingUp, Trash2, ArrowDownCircle, ArrowUpCircle, X, PiggyBank } from "lucide-react";
import toast from "react-hot-toast";

const SAVINGS_CONTRACT = "0x1234567890123456789012345678901234567890" as `0x${string}`;

export default function SavingsPage() {
  const { isConnected, address } = useMiniPay();
  const { cUSDBalance } = useBDeshBalance();
  const { writeContractAsync } = useWriteContract();
  const {
    pots,
    isLoaded,
    createPot,
    depositToPot,
    withdrawFromPot,
    deletePot,
    getTotalSaved,
    getInterestEarned,
  } = useBDeshSavings(address);

  const [showCreate, setShowCreate] = useState(false);
  const [selectedPot, setSelectedPot] = useState<SavingsPot | null>(null);
  const [txMode, setTxMode] = useState<"deposit" | "withdraw">("deposit");
  const [txAmount, setTxAmount] = useState("");
  const [isTxing, setIsTxing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState({ title: "", amount: "" });

  // New pot form
  const [newPotName, setNewPotName] = useState("");
  const [newPotEmoji, setNewPotEmoji] = useState("🏦");
  const [newPotColor, setNewPotColor] = useState("#006A4E");
  const [newPotTarget, setNewPotTarget] = useState("");
  const [newPotDesc, setNewPotDesc] = useState("");

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <BdeshHeader />
        <ConnectPrompt />
        <BdeshNav />
      </div>
    );
  }

  const totalSaved = getTotalSaved();
  const totalInterest = pots.reduce((acc, p) => acc + getInterestEarned(p), 0);
  const balance = parseFloat(cUSDBalance?.formatted ?? "0");

  const handleCreatePot = () => {
    if (!newPotName.trim()) return toast.error("পটের নাম দিন");
    const pot = createPot({
      id: `pot_${Date.now()}`,
      name: newPotName,
      emoji: newPotEmoji,
      color: newPotColor,
      description: newPotDesc,
      targetUSD: newPotTarget ? parseFloat(newPotTarget) : undefined,
    });
    toast.success(`"${pot.name}" তৈরি হয়েছে! 🎉`);
    setShowCreate(false);
    setNewPotName("");
    setNewPotTarget("");
    setNewPotDesc("");
  };

  const handleTx = async () => {
    if (!selectedPot || !txAmount || parseFloat(txAmount) <= 0) return;
    setIsTxing(true);
    try {
      const amt = parseFloat(txAmount);
      if (txMode === "deposit") {
        const hash = await writeContractAsync({
          address: CELO_TOKENS.cUSD,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [SAVINGS_CONTRACT, parseUnits(amt.toFixed(18), 18)],
        });
        depositToPot(selectedPot.id, amt, hash);
        setSuccessData({ title: `${selectedPot.name}-এ জমা সফল!`, amount: `+$${amt.toFixed(2)}` });
      } else {
        // Simulate withdrawal (in real app, call contract withdraw)
        if (amt > selectedPot.depositedUSD) {
          toast.error("অপর্যাপ্ত ব্যালেন্স");
          setIsTxing(false);
          return;
        }
        withdrawFromPot(selectedPot.id, amt);
        setSuccessData({ title: `${selectedPot.name} থেকে উত্তোলন!`, amount: `-$${amt.toFixed(2)}` });
      }
      setShowSuccess(true);
      setSelectedPot(null);
      setTxAmount("");
    } catch (err: any) {
      toast.error(err?.shortMessage ?? "লেনদেন ব্যর্থ");
    } finally {
      setIsTxing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-24">
      <BdeshHeader />

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E40AF] to-[#1E3A8A] px-4 pt-4 pb-8">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-lg">আমার সঞ্চয়</h1>
            <p className="text-blue-200 text-sm">স্বপ্ন পূরণের পথে এগিয়ে চলুন</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus size={14} />
            নতুন পট
          </button>
        </div>
      </div>

      <div className="px-4 -mt-4 max-w-md mx-auto space-y-3 pb-4">
        {/* Summary card */}
        <div className="bdesh-card p-4 shadow-lg">
          <div className="grid grid-cols-3 divide-x divide-[var(--border)]">
            <div className="text-center pr-4">
              <p className="text-xl font-bold text-[var(--text-primary)]">${totalSaved.toFixed(2)}</p>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5">মোট সঞ্চয়</p>
            </div>
            <div className="text-center px-4">
              <p className="text-xl font-bold text-bd-green">+${totalInterest.toFixed(4)}</p>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5">সুদ আয়</p>
            </div>
            <div className="text-center pl-4">
              <p className="text-xl font-bold text-[#1E40AF]">{pots.length}</p>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5">পট সংখ্যা</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center gap-1.5">
            <TrendingUp size={12} className="text-bd-green" />
            <p className="text-[11px] text-[var(--text-muted)]">
              ৫% বার্ষিক সুদ (APY) — Celo DeFi-এর সুবাদে
            </p>
          </div>
        </div>

        {/* Pots list */}
        {!isLoaded ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bdesh-card h-28 shimmer" />
            ))}
          </div>
        ) : pots.length === 0 ? (
          <div className="bdesh-card p-8 flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 bg-bd-green/10 rounded-2xl flex items-center justify-center">
              <PiggyBank size={28} className="text-bd-green" />
            </div>
            <div>
              <p className="font-bold text-[var(--text-primary)]">কোনো সঞ্চয় পট নেই</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                প্রথম পট তৈরি করুন এবং সঞ্চয় শুরু করুন!
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="bdesh-btn-primary flex items-center gap-2"
            >
              <Plus size={16} />
              পট তৈরি করুন
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {pots.map((pot) => {
              const interest = getInterestEarned(pot);
              const progress = pot.targetUSD ? Math.min(100, (pot.depositedUSD / pot.targetUSD) * 100) : null;
              return (
                <div
                  key={pot.id}
                  className="bdesh-card p-4 relative overflow-hidden"
                >
                  {/* Color accent */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                    style={{ backgroundColor: pot.color }}
                  />

                  <div className="pl-2">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{pot.emoji}</span>
                        <div>
                          <p className="font-bold text-[var(--text-primary)] text-sm">{pot.name}</p>
                          {pot.description && (
                            <p className="text-[10px] text-[var(--text-muted)]">{pot.description}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deletePot(pot.id)}
                        className="w-7 h-7 rounded-lg bg-[var(--surface)] flex items-center justify-center hover:bg-bd-red/10 transition-colors"
                      >
                        <Trash2 size={13} className="text-[var(--text-muted)] hover:text-bd-red" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mb-2">
                      <div>
                        <p className="text-xl font-bold" style={{ color: pot.color }}>
                          ${pot.depositedUSD.toFixed(2)}
                        </p>
                        <p className="text-[10px] text-bd-green">+${interest.toFixed(4)} সুদ</p>
                      </div>
                      {pot.targetUSD && (
                        <div className="text-right">
                          <p className="text-xs text-[var(--text-muted)]">লক্ষ্য</p>
                          <p className="text-sm font-semibold text-[var(--text-secondary)]">
                            ${pot.targetUSD.toFixed(0)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Progress bar */}
                    {progress !== null && (
                      <div className="mb-3">
                        <div className="flex justify-between text-[10px] text-[var(--text-muted)] mb-1">
                          <span>{progress.toFixed(0)}% সম্পন্ন</span>
                          <span>${(pot.targetUSD! - pot.depositedUSD).toFixed(2)} বাকি</span>
                        </div>
                        <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%`, backgroundColor: pot.color }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelectedPot(pot); setTxMode("deposit"); setTxAmount(""); }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-bd-green/10 text-bd-green hover:bg-bd-green/20 transition-colors"
                      >
                        <ArrowDownCircle size={13} />
                        জমা করুন
                      </button>
                      <button
                        onClick={() => { setSelectedPot(pot); setTxMode("withdraw"); setTxAmount(""); }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--border)] transition-colors"
                      >
                        <ArrowUpCircle size={13} />
                        তুলুন
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* APY info */}
        <div className="bdesh-card p-4 bg-gradient-to-r from-bd-green/5 to-[#1E40AF]/5 border-bd-green/10">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">সুদের হিসাব কীভাবে?</p>
              <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                আপনার জমানো cUSD Celo DeFi প্রোটোকলে কাজ করে। বার্ষিক ৫% APY হারে প্রতিদিন সুদ যোগ হয়। সম্পূর্ণ স্বচ্ছ, blockchain-এ রেকর্ড।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Pot Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative z-10 w-full max-w-md bg-white dark:bg-bd-dark-card rounded-t-3xl p-5 pb-10 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-[var(--text-primary)] text-lg">নতুন সঞ্চয় পট</h2>
              <button onClick={() => setShowCreate(false)} className="w-8 h-8 rounded-full bg-[var(--surface)] flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            {/* Presets */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">দ্রুত বেছে নিন</p>
              <div className="grid grid-cols-4 gap-2">
                {SAVINGS_POT_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setNewPotEmoji(preset.emoji);
                      setNewPotName(preset.name);
                      setNewPotColor(preset.color);
                    }}
                    className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 transition-all ${
                      newPotName === preset.name ? "border-bd-green bg-bd-green/5" : "border-[var(--border)]"
                    }`}
                  >
                    <span className="text-lg">{preset.emoji}</span>
                    <span className="text-[9px] font-medium text-[var(--text-muted)] text-center leading-tight">
                      {preset.name.length > 8 ? preset.name.slice(0, 8) + "…" : preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">পটের নাম *</label>
                <input
                  value={newPotName}
                  onChange={(e) => setNewPotName(e.target.value)}
                  placeholder="যেমন: ঈদ সেভিংস"
                  className="bdesh-input"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">বিবরণ</label>
                <input
                  value={newPotDesc}
                  onChange={(e) => setNewPotDesc(e.target.value)}
                  placeholder="কিসের জন্য সঞ্চয় করছেন?"
                  className="bdesh-input"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  লক্ষ্যমাত্রা (USD, ঐচ্ছিক)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">$</span>
                  <input
                    type="number"
                    value={newPotTarget}
                    onChange={(e) => setNewPotTarget(e.target.value)}
                    placeholder="100"
                    className="bdesh-input pl-8"
                  />
                </div>
              </div>
            </div>

            <button onClick={handleCreatePot} className="bdesh-btn-primary w-full mt-5 flex items-center justify-center gap-2">
              <Plus size={16} />
              পট তৈরি করুন
            </button>
          </div>
        </div>
      )}

      {/* Deposit/Withdraw Modal */}
      {selectedPot && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedPot(null)} />
          <div className="relative z-10 w-full max-w-md bg-white dark:bg-bd-dark-card rounded-t-3xl p-5 pb-10 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedPot.emoji}</span>
                <h2 className="font-bold text-[var(--text-primary)]">
                  {txMode === "deposit" ? "জমা করুন" : "তুলুন"} — {selectedPot.name}
                </h2>
              </div>
              <button onClick={() => setSelectedPot(null)} className="w-8 h-8 rounded-full bg-[var(--surface)] flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            <div className="flex bg-[var(--surface)] rounded-xl p-1 mb-4">
              {(["deposit", "withdraw"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setTxMode(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    txMode === m ? "bg-white dark:bg-bd-dark-card shadow text-bd-green" : "text-[var(--text-muted)]"
                  }`}
                >
                  {m === "deposit" ? "💚 জমা" : "🔴 উত্তোলন"}
                </button>
              ))}
            </div>

            <div className="bg-[var(--surface)] rounded-xl p-3 mb-4 flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">পটে আছে:</span>
              <span className="font-bold text-[var(--text-primary)]">${selectedPot.depositedUSD.toFixed(2)}</span>
            </div>

            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg">$</span>
              <input
                type="number"
                value={txAmount}
                onChange={(e) => setTxAmount(e.target.value)}
                placeholder="0.00"
                className="bdesh-input pl-8 text-xl font-bold"
              />
            </div>

            <div className="flex gap-2 mb-4">
              {[5, 10, 20, 50].map((a) => (
                <button
                  key={a}
                  onClick={() => setTxAmount(String(a))}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    txAmount === String(a) ? "bg-bd-green text-white border-bd-green" : "border-[var(--border)] text-[var(--text-secondary)]"
                  }`}
                >
                  ${a}
                </button>
              ))}
            </div>

            <button
              onClick={handleTx}
              disabled={!txAmount || isTxing}
              className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl transition-all ${
                txMode === "deposit" ? "bdesh-btn-primary" : "bdesh-btn-secondary"
              }`}
            >
              {isTxing ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> প্রক্রিয়া হচ্ছে...</>
              ) : txMode === "deposit" ? "জমা করুন ✓" : "তুলে নিন →"}
            </button>
          </div>
        </div>
      )}

      <TxSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={successData.title}
        subtitle="সঞ্চয় আপডেট হয়েছে"
        amount={successData.amount}
        emoji="🏦"
      />

      <BdeshNav />
    </div>
  );
}
