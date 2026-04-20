# 🚀 BDeshPay — বাংলাদেশের পে

> **Bill Pay | Remittance | Savings** — A mobile-first MiniPay dApp for Bangladeshi users on Celo blockchain.

[![Celo](https://img.shields.io/badge/Celo-Mainnet-FCFF52?style=flat&logo=celo)](https://celo.org)
[![MiniPay](https://img.shields.io/badge/MiniPay-Optimized-00D395)](https://minipay.opera.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)

---

## 📱 What is BDeshPay?

BDeshPay is a culturally Bangladeshi fintech dApp built on the Celo blockchain, designed to run natively inside **Opera MiniPay**. It allows Bangladeshi users worldwide to:

- 💸 **Send remittances** instantly via phone number or wallet address
- 📱 **Pay mobile bills** (Grameenphone, Robi, Banglalink, Airtel)
- ⚡ **Pay electricity bills** (DPDC, DESCO, RPCL, NESCO)
- 🌐 **Pay internet bills** (Link3, BDCOM, Amber IT, Carnival)
- 🏦 **Save in stablecoins** with custom named pots & simulated APY

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript |
| Blockchain | Celo Mainnet (chainId: 42220) |
| Wallet | Wagmi v2, Viem, MiniPay injected provider |
| Styling | Tailwind CSS (BD colors: #006A4E, #F42A41) |
| Smart Contract | Solidity 0.8.20, OpenZeppelin |
| Deployment | Hardhat, Vercel |

---

## 🚀 Quick Start

### 1. Create base project (official Celo template)
```bash
npx @celo/celo-composer@latest create -t minipay
# Choose: Next.js, no subgraph
# Project name: bdeshpay
```

### 2. Replace with BDeshPay files
Copy all files from this repo into the created project directory.

### 3. Install dependencies
```bash
cd bdeshpay
npm install
```

### 4. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📁 Folder Structure

```
bdeshpay/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Dashboard
│   │   ├── remittance/page.tsx   # Send money
│   │   ├── bills/page.tsx        # Bill payments
│   │   ├── savings/page.tsx      # Savings pots
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # BD-themed styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BdeshHeader.tsx   # Top navigation
│   │   │   ├── BdeshNav.tsx      # Bottom tab bar
│   │   │   └── Providers.tsx     # Wagmi + RQ providers
│   │   └── ui/
│   │       ├── ConnectPrompt.tsx # Wallet connect screen
│   │       └── TxSuccessModal.tsx # Success + confetti
│   ├── hooks/
│   │   ├── useMiniPay.ts         # MiniPay detection + balance
│   │   ├── useBDeshSavings.ts    # Savings state management
│   │   └── useConfetti.ts        # Celebration animations
│   ├── lib/
│   │   ├── wagmi-config.ts       # Wagmi + token addresses
│   │   └── bdesh-data.ts         # BD-specific mock data
│   └── types/
│       └── global.d.ts           # Window.ethereum types
├── contracts/
│   ├── contracts/
│   │   └── BDeshSavings.sol      # Savings smart contract
│   ├── scripts/
│   │   └── deploy.js             # Deployment script
│   ├── hardhat.config.js
│   └── package.json
├── public/
│   └── manifest.json             # PWA manifest
├── tailwind.config.ts
├── next.config.mjs
└── README.md
```

---

## 🔗 Smart Contract Deployment

### Prerequisites
```bash
cd contracts
npm install
cp .env.example .env
# Fill in PRIVATE_KEY and CELOSCAN_API_KEY
```

### Deploy to Alfajores (testnet, recommended first)
```bash
npm run deploy:testnet
```

### Deploy to Celo Mainnet
```bash
npm run deploy:mainnet
```

### After deployment
Update `src/lib/wagmi-config.ts`:
```typescript
export const BDESH_SAVINGS_ADDRESS = "0xYOUR_DEPLOYED_ADDRESS" as `0x${string}`;
```

---

## 📱 Testing in MiniPay

### Option 1: Opera MiniPay App
1. Download **Opera Mini** on Android
2. Enable MiniPay in settings
3. Open MiniPay → Mini Apps
4. Enter your deployed URL or `ngrok` tunnel URL
5. Connect — MiniPay auto-detects and connects wallet

### Option 2: ngrok for local testing
```bash
npm run dev &
ngrok http 3000
# Paste the https URL into MiniPay
```

### Option 3: Test on browser with injected wallet
1. Install MetaMask
2. Add Celo network (chainId: 42220, RPC: https://forno.celo.org)
3. Open `http://localhost:3000`
4. Connect MetaMask

### MiniPay-specific features
- `window.ethereum.isMiniPay` is `true` → connect button hidden
- Auto-connects wallet on load
- `feeCurrency` set to cUSD for gas-free experience

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `bd-green` | `#006A4E` | Primary actions, header |
| `bd-red` | `#F42A41` | Bills tab, accent |
| `bd-gold` | `#F5C842` | Beta badge, highlights |
| Font | Hind Siliguri | Bengali + English text |

---

## 🌐 Production Deployment

### Deploy frontend to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Environment variables (Vercel dashboard)
```
NEXT_PUBLIC_CHAIN_ID=42220
NEXT_PUBLIC_BDESH_SAVINGS_ADDRESS=0x...
```

---

## 🏆 Proof of Ship Submission

**Project Name:** BDeshPay  
**Category:** DeFi / Payments / Consumer  
**Chain:** Celo Mainnet  
**Contract:** BDeshSavings.sol  

**What makes it unique:**
- First Bangladeshi-language fintech dApp on Celo
- Cultural design with BD flag colors (#006A4E, #F42A41)
- Phone-number based remittance (BD format: 017xx/018xx)
- Savings "pots" with Bengali names and cultural presets (ঈদ সেভিংস, বাইক কিস্তি)
- Full Bengali UI with English technical terms
- Dark mode + MiniPay optimized

**Smart contract features:**
- Per-user, per-pot balance tracking
- Deposit/withdraw events for frontend sync
- OpenZeppelin security (ReentrancyGuard, Ownable)
- Deployed with cUSD as savings token

---

## 📞 BD Mock Phone Numbers (for testing)

| Name | Phone | 
|------|-------|
| আব্বু | 01712345678 |
| আম্মু | 01812345679 |
| ভাইয়া | 01912345680 |
| আপু | 01612345681 |
| Karim Bhai | 01712398765 |

---

## 📄 License

MIT — বাংলাদেশের জন্য তৈরি 🇧🇩

---

*Made with 💚 for Bangladesh — Powered by Celo*
