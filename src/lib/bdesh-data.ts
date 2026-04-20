// BDeshPay — Bangladesh-specific data & mock utilities

export const BD_MOBILE_OPERATORS = [
  {
    id: "gp",
    name: "Grameenphone",
    shortName: "GP",
    color: "#E2001A",
    bgColor: "#FFF0F0",
    darkBg: "#3A0A0A",
    emoji: "📱",
    logo: "GP",
    plans: [
      { id: "gp-1", name: "30 দিন ৫GB", amount: 1.2, bdt: 129 },
      { id: "gp-2", name: "30 দিন ১৫GB", amount: 2.5, bdt: 269 },
      { id: "gp-3", name: "60 দিন ৩০GB", amount: 4.6, bdt: 499 },
    ],
  },
  {
    id: "robi",
    name: "Robi",
    shortName: "Robi",
    color: "#E4002B",
    bgColor: "#FFF5F5",
    darkBg: "#3A0A15",
    emoji: "📶",
    logo: "Robi",
    plans: [
      { id: "robi-1", name: "৭ দিন ৩GB", amount: 0.65, bdt: 69 },
      { id: "robi-2", name: "৩০ দিন ১২GB", amount: 2.22, bdt: 239 },
      { id: "robi-3", name: "৩০ দিন ২৫GB", amount: 4.17, bdt: 449 },
    ],
  },
  {
    id: "bl",
    name: "Banglalink",
    shortName: "BL",
    color: "#F7941D",
    bgColor: "#FFF8F0",
    darkBg: "#3A2A0A",
    emoji: "🔶",
    logo: "BL",
    plans: [
      { id: "bl-1", name: "৭ দিন ২GB", amount: 0.55, bdt: 59 },
      { id: "bl-2", name: "৩০ দিন ১০GB", amount: 1.95, bdt: 209 },
      { id: "bl-3", name: "৩০ দিন ২০GB", amount: 3.70, bdt: 399 },
    ],
  },
  {
    id: "airtel",
    name: "Airtel BD",
    shortName: "Airtel",
    color: "#E40000",
    bgColor: "#FFF0F0",
    darkBg: "#3A0505",
    emoji: "🌐",
    logo: "Airtel",
    plans: [
      { id: "air-1", name: "৭ দিন ৪GB", amount: 0.74, bdt: 79 },
      { id: "air-2", name: "৩০ দিন ১৫GB", amount: 2.59, bdt: 279 },
      { id: "air-3", name: "৩০ দিন ৩৫GB", amount: 5.28, bdt: 569 },
    ],
  },
];

export const BD_ELECTRICITY_PROVIDERS = [
  {
    id: "dpdc",
    name: "DPDC",
    fullName: "Dhaka Power Distribution Co.",
    region: "ঢাকা উত্তর",
    emoji: "⚡",
  },
  {
    id: "desco",
    name: "DESCO",
    fullName: "Dhaka Electric Supply Co.",
    region: "ঢাকা উত্তর-পশ্চিম",
    emoji: "💡",
  },
  {
    id: "rpcl",
    name: "RPCL",
    fullName: "Rural Power Company Ltd.",
    region: "গ্রামাঞ্চল",
    emoji: "🔌",
  },
  {
    id: "nesco",
    name: "NESCO",
    fullName: "Northern Electric Supply Co.",
    region: "উত্তরাঞ্চল",
    emoji: "⚡",
  },
];

export const BD_INTERNET_PROVIDERS = [
  { id: "link3", name: "Link3 Technologies", emoji: "🌐", monthlyUSD: 5.56, monthlyBDT: 599 },
  { id: "bdcom", name: "BDCOM Online", emoji: "📡", monthlyUSD: 4.63, monthlyBDT: 499 },
  { id: "amber", name: "Amber IT", emoji: "💎", monthlyUSD: 6.48, monthlyBDT: 699 },
  { id: "carnival", name: "Carnival Internet", emoji: "🎪", monthlyUSD: 3.70, monthlyBDT: 399 },
];

export const BD_MOCK_CONTACTS = [
  { name: "আব্বু", phone: "01712345678", avatar: "👨‍💼", relation: "বাবা" },
  { name: "আম্মু", phone: "01812345679", avatar: "👩‍🦱", relation: "মা" },
  { name: "ভাইয়া", phone: "01912345680", avatar: "👦", relation: "ভাই" },
  { name: "আপু", phone: "01612345681", avatar: "👧", relation: "বোন" },
  { name: "Karim Bhai", phone: "01712398765", avatar: "👨", relation: "বন্ধু" },
  { name: "Rina Apa", phone: "01812398766", avatar: "👩", relation: "বন্ধু" },
];

export const DEFAULT_SAVINGS_POTS = [
  {
    id: "eid",
    name: "ঈদ সেভিংস",
    emoji: "🌙",
    targetUSD: 200,
    color: "#006A4E",
    description: "ঈদের কেনাকাটার জন্য",
  },
  {
    id: "emergency",
    name: "পারিবারিক জরুরি",
    emoji: "🏠",
    targetUSD: 500,
    color: "#F42A41",
    description: "পরিবারের জরুরি খরচের জন্য",
  },
];

export const SAVINGS_POT_PRESETS = [
  { emoji: "🌙", name: "ঈদ সেভিংস", color: "#006A4E" },
  { emoji: "🏠", name: "বাড়ি ভাড়া", color: "#2563EB" },
  { emoji: "🎓", name: "শিক্ষা ফান্ড", color: "#7C3AED" },
  { emoji: "🚑", name: "চিকিৎসা ফান্ড", color: "#F42A41" },
  { emoji: "✈️", name: "ভ্রমণ", color: "#F5C842" },
  { emoji: "🏍️", name: "বাইক কিস্তি", color: "#EA580C" },
  { emoji: "💒", name: "বিয়ে ফান্ড", color: "#DB2777" },
  { emoji: "📱", name: "ফোন কিনবো", color: "#0891B2" },
];

// USD/BDT exchange rate (mock, updated in real app via oracle)
export const USD_TO_BDT = 110;

export const formatBDT = (usd: number): string => {
  return `৳${(usd * USD_TO_BDT).toLocaleString("bn-BD")}`;
};

export const formatUSD = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// Validate Bangladeshi phone number
export const isBDPhoneNumber = (phone: string): boolean => {
  return /^(013|014|015|016|017|018|019)[0-9]{8}$/.test(phone.replace(/\s|-/g, ""));
};

// Mock phone-to-wallet lookup (in production, use a real registry)
export const mockPhoneToWallet = (phone: string): `0x${string}` | null => {
  const mockMap: Record<string, `0x${string}`> = {
    "01712345678": "0x1234567890123456789012345678901234567890",
    "01812345679": "0x2345678901234567890123456789012345678901",
    "01912345680": "0x3456789012345678901234567890123456789012",
    "01612345681": "0x4567890123456789012345678901234567890123",
    "01712398765": "0x5678901234567890123456789012345678901234",
    "01812398766": "0x6789012345678901234567890123456789012345",
  };
  const clean = phone.replace(/\s|-/g, "");
  return mockMap[clean] || null;
};

export const BD_INSPIRATIONAL_QUOTES = [
  "আপনার সঞ্চয় আপনার ভবিষ্যৎ",
  "ছোট ছোট সঞ্চয়ে বড় স্বপ্ন পূরণ",
  "BDeshPay — আপনার বিশ্বস্ত পার্টনার",
  "সহজে পাঠান, নিরাপদে সঞ্চয় করুন",
];

// Simulate fake interest earned (0.5% monthly APY simulation)
export const calcFakeInterest = (depositedUSD: number, daysAgo: number): number => {
  const dailyRate = 0.05 / 365; // 5% APY
  return depositedUSD * dailyRate * daysAgo;
};
