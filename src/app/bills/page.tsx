"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useMiniPay, useBDeshBalance } from "@/hooks/useMiniPay";
import { BdeshHeader } from "@/components/layout/BdeshHeader";
import { BdeshNav } from "@/components/layout/BdeshNav";
import { ConnectPrompt } from "@/components/ui/ConnectPrompt";
import { TxSuccessModal } from "@/components/ui/TxSuccessModal";
import {
  BD_MOBILE_OPERATORS,
  BD_ELECTRICITY_PROVIDERS,
  BD_INTERNET_PROVIDERS,
  USD_TO_BDT,
} from "@/lib/bdesh-data";
import { useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { CELO_TOKENS, ERC20_ABI } from "@/lib/wagmi-config";
import { Smartphone, Zap, Wifi, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

// Dummy merchant wallet for bill payments
const MERCHANT_WALLET = "0x1234567890123456789012345678901234567890" as `0x${string}`;

type Tab = "mobile" | "electricity" | "internet";

function BillsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) || "mobile";
  const { isConnected } = useMiniPay();
  const { cUSDBalance } = useBDeshBalance();
  const { writeContractAsync } = useWriteContract();

  const [tab, setTab] = useState<Tab>(initialTab);
  const [selectedOp, setSelectedOp] = useState(BD_MOBILE_OPERATORS[0].id);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [mobileNum, setMobileNum] = useState("");
  const [electricProvider, setElectricProvider] = useState(BD_ELECTRICITY_PROVIDERS[0].id);
  const [billAccount, setBillAccount] = useState("");
  const [electricAmount, setElectricAmount] = useState("");
  const [selectedISP, setSelectedISP] = useState(BD_INTERNET_PROVIDERS[0].id);
  const [ispAccount, setIspAccount] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState({ title: "", amount: "", emoji: "" });

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <BdeshHeader />
        <ConnectPrompt />
        <BdeshNav />
      </div>
    );
  }

  const operator = BD_MOBILE_OPERATORS.find((o) => o.id === selectedOp)!;
  const plan = operator.plans.find((p) => p.id === selectedPlan);
  const isp = BD_INTERNET_PROVIDERS.find((i) => i.id === selectedISP)!;

  const pay = async (amount: number, desc: string, emoji: string) => {
    setIsPaying(true);
    try {
      const hash = await writeContractAsync({
        address: CELO_TOKENS.cUSD,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [MERCHANT_WALLET, parseUnits(amount.toFixed(18), 18)],
      });
      setSuccessData({ title: `${desc} সফল!`, amount: `$${amount.toFixed(2)}`, emoji });
      setShowSuccess(true);
    } catch (err: any) {
      toast.error(err?.shortMessage ?? "পেমেন্ট ব্যর্থ হয়েছে");
    } finally {
      setIsPaying(false);
    }
  };

  const tabs = [
    { id: "mobile" as Tab, label: "মোবাইল", icon: <Smartphone size={14} /> },
    { id: "electricity" as Tab, label: "বিদ্যুৎ", icon: <Zap size={14} /> },
    { id: "internet" as Tab, label: "ইন্টারনেট", icon: <Wifi size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-24">
      <BdeshHeader />

      {/* Header */}
      <div className="bg-gradient-to-br from-bd-red to-[#C41F33] px-4 pt-4 pb-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-white font-bold text-lg">বিল পেমেন্ট</h1>
          <p className="text-red-200 text-sm">মোবাইল, বিদ্যুৎ ও ইন্টারনেট বিল</p>
        </div>
      </div>

      <div className="px-4 -mt-4 max-w-md mx-auto space-y-3">
        {/* Tabs */}
        <div className="bdesh-card p-1.5 flex gap-1 shadow-lg">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.id
                  ? "bg-bd-red text-white shadow-md"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Mobile Recharge */}
        {tab === "mobile" && (
          <div className="space-y-3">
            {/* Operator selection */}
            <div className="bdesh-card p-4">
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-3">অপারেটর বেছে নিন</p>
              <div className="grid grid-cols-4 gap-2">
                {BD_MOBILE_OPERATORS.map((op) => (
                  <button
                    key={op.id}
                    onClick={() => { setSelectedOp(op.id); setSelectedPlan(null); }}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                      selectedOp === op.id
                        ? "border-bd-red bg-bd-red/5 dark:bg-bd-red/10"
                        : "border-[var(--border)] hover:border-bd-red/30"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: op.color }}
                    >
                      {op.shortName.slice(0, 2)}
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--text-secondary)]">{op.shortName}</span>
                    {selectedOp === op.id && <CheckCircle size={10} className="text-bd-red" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone number */}
            <div className="bdesh-card p-4">
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-2">
                মোবাইল নম্বর
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-3.5 text-sm text-[var(--text-secondary)]">
                  <span>🇧🇩</span>
                  <span>+880</span>
                </div>
                <input
                  type="tel"
                  value={mobileNum}
                  onChange={(e) => setMobileNum(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="bdesh-input flex-1"
                  maxLength={11}
                />
              </div>
            </div>

            {/* Plans */}
            <div className="bdesh-card p-4">
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-3">
                {operator.name} — ইন্টারনেট প্যাকেজ
              </p>
              <div className="space-y-2">
                {operator.plans.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                      selectedPlan === p.id
                        ? "border-bd-red bg-bd-red/5 dark:bg-bd-red/10"
                        : "border-[var(--border)] hover:border-bd-red/20"
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{p.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">৳{p.bdt} টাকা</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-bd-red">${p.amount.toFixed(2)}</p>
                      {selectedPlan === p.id && <CheckCircle size={14} className="text-bd-red ml-auto mt-0.5" />}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => plan && mobileNum && pay(plan.amount, `${operator.name} রিচার্জ`, "📱")}
                disabled={!plan || !mobileNum || isPaying}
                className="bdesh-btn-secondary w-full mt-4 flex items-center justify-center gap-2"
              >
                {isPaying ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> পেমেন্ট হচ্ছে...</>
                ) : (
                  `${plan ? `$${plan.amount}` : ""} রিচার্জ করুন ⚡`
                )}
              </button>
            </div>
          </div>
        )}

        {/* Electricity */}
        {tab === "electricity" && (
          <div className="space-y-3">
            <div className="bdesh-card p-4">
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-3">বিতরণ কোম্পানি</p>
              <div className="grid grid-cols-2 gap-2">
                {BD_ELECTRICITY_PROVIDERS.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => setElectricProvider(ep.id)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 transition-all ${
                      electricProvider === ep.id
                        ? "border-bd-red bg-bd-red/5"
                        : "border-[var(--border)]"
                    }`}
                  >
                    <span className="text-xl">{ep.emoji}</span>
                    <div className="text-left">
                      <p className="text-xs font-bold text-[var(--text-primary)]">{ep.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">{ep.region}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bdesh-card p-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  অ্যাকাউন্ট নম্বর / মিটার নম্বর
                </label>
                <input
                  value={billAccount}
                  onChange={(e) => setBillAccount(e.target.value)}
                  placeholder="মিটার নম্বর লিখুন"
                  className="bdesh-input"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  পরিমাণ (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">$</span>
                  <input
                    type="number"
                    value={electricAmount}
                    onChange={(e) => setElectricAmount(e.target.value)}
                    placeholder="0.00"
                    className="bdesh-input pl-8"
                  />
                </div>
                {electricAmount && (
                  <p className="text-xs text-[var(--text-muted)] mt-1 px-1">
                    ≈ ৳{(parseFloat(electricAmount || "0") * USD_TO_BDT).toLocaleString()} টাকা
                  </p>
                )}
              </div>

              {/* Quick bill amounts */}
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-2">সাধারণ বিলের পরিমাণ</p>
                <div className="flex gap-2 flex-wrap">
                  {[0.9, 1.8, 2.75, 4.6].map((a) => (
                    <button
                      key={a}
                      onClick={() => setElectricAmount(String(a))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        electricAmount === String(a)
                          ? "bg-bd-red text-white border-bd-red"
                          : "border-[var(--border)] text-[var(--text-secondary)]"
                      }`}
                    >
                      ${a} <span className="text-[10px]">(৳{Math.round(a * USD_TO_BDT)})</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => electricAmount && billAccount && pay(parseFloat(electricAmount), "বিদ্যুৎ বিল", "⚡")}
                disabled={!electricAmount || !billAccount || isPaying}
                className="bdesh-btn-secondary w-full flex items-center justify-center gap-2"
              >
                {isPaying ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> পেমেন্ট হচ্ছে...</>
                ) : "বিল পরিশোধ করুন ⚡"}
              </button>
            </div>
          </div>
        )}

        {/* Internet */}
        {tab === "internet" && (
          <div className="space-y-3">
            <div className="bdesh-card p-4">
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-3">ইন্টারনেট সেবা প্রদানকারী</p>
              <div className="space-y-2">
                {BD_INTERNET_PROVIDERS.map((isp) => (
                  <button
                    key={isp.id}
                    onClick={() => setSelectedISP(isp.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                      selectedISP === isp.id
                        ? "border-bd-red bg-bd-red/5"
                        : "border-[var(--border)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{isp.emoji}</span>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{isp.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">মাসিক প্যাকেজ</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-bd-red">${isp.monthlyUSD.toFixed(2)}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">৳{isp.monthlyBDT}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bdesh-card p-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  গ্রাহক আইডি / ইউজারনেম
                </label>
                <input
                  value={ispAccount}
                  onChange={(e) => setIspAccount(e.target.value)}
                  placeholder="আপনার গ্রাহক আইডি"
                  className="bdesh-input"
                />
              </div>
              <button
                onClick={() => ispAccount && pay(isp.monthlyUSD, `${isp.name} বিল`, "🌐")}
                disabled={!ispAccount || isPaying}
                className="bdesh-btn-secondary w-full flex items-center justify-center gap-2"
              >
                {isPaying ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> পেমেন্ট হচ্ছে...</>
                ) : `$${isp.monthlyUSD.toFixed(2)} বিল দিন 🌐`}
              </button>
            </div>
          </div>
        )}
      </div>

      <TxSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={successData.title}
        subtitle="বিল সফলভাবে পরিশোধ হয়েছে"
        amount={successData.amount}
        emoji={successData.emoji}
      />

      <BdeshNav />
    </div>
  );
}

export default function BillsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]"><BdeshHeader /><BdeshNav /></div>}>
      <BillsContent />
    </Suspense>
  );
}
