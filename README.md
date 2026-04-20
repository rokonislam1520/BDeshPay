# 🚀 BDeshPay — বাংলাদেশের পে

> **Bill Pay | Remittance | Savings** — বাংলাদেশের প্রথম Celo MiniPay dApp

[![Celo](https://img.shields.io/badge/Celo-Mainnet-FCFF52?style=flat&logo=celo)](https://celo.org)
[![MiniPay](https://img.shields.io/badge/MiniPay-Optimized-00D395)](https://minipay.opera.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

```
██████╗ ██████╗ ███████╗███████╗██╗  ██╗██████╗  █████╗ ██╗   ██╗
██╔══██╗██╔══██╗██╔════╝██╔════╝██║  ██║██╔══██╗██╔══██╗╚██╗ ██╔╝
██████╔╝██║  ██║█████╗  ███████╗███████║██████╔╝███████║ ╚████╔╝ 
██╔══██╗██║  ██║██╔══╝  ╚════██║██╔══██║██╔═══╝ ██╔══██║  ╚██╔╝  
██████╔╝██████╔╝███████╗███████║██║  ██║██║     ██║  ██║   ██║   
╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝   ╚═╝   
                        বাংলাদেশের পে 🇧🇩
```

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
```bash
# Clone this repo
git clone https://github.com/yourusername/bdeshpay.git
# Copy all src files into the created project
cp -r bdeshpay/src/* your-minipay-project/src/
```

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
│   │   ├── page.tsx                        # Dashboard
│   │   ├── remittance/page.tsx             # Send money
│   │   ├── bills/page.tsx                  # Bill payments
│   │   ├── savings/page.tsx                # Savings pots
│   │   ├── layout.tsx                      # Root layout
│   │   └── globals.css                     # BD-themed styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BdeshHeader.tsx             # Top navigation bar
│   │   │   ├── BdeshNav.tsx                # Bottom tab bar
│   │   │   └── Providers.tsx               # Wagmi + RQ providers
│   │   ├── features/
│   │   │   ├── BdeshBalanceCard.tsx        # Wallet balance card
│   │   │   ├── BdeshRemitForm.tsx          # Remittance form
│   │   │   └── BdeshSavingsPot.tsx         # Savings pot card
│   │   └── ui/
│   │       ├── ConnectPrompt.tsx           # Wallet connect screen
│   │       └── TxSuccessModal.tsx          # Success + confetti modal
│   ├── hooks/
│   │   ├── useMiniPay.ts                   # MiniPay detection + balance
│   │   ├── useBDeshSavings.ts              # Savings state (localStorage)
│   │   └── useConfetti.ts                  # Celebration animations
│   ├── lib/
│   │   ├── wagmi-config.ts                 # Wagmi + Celo token addresses
│   │   └── bdesh-data.ts                   # BD operators, presets, helpers
│   └── types/
│       └── global.d.ts                     # Window.ethereum type extension
├── contracts/
│   ├── contracts/
│   │   ├── BDeshSavings.sol                # Main savings smart contract
│   │   └── MockERC20.sol                   # Mock token for local testing
│   ├── scripts/
│   │   └── deploy.js                       # Hardhat deployment script
│   ├── test/
│   │   └── BDeshSavings.test.js            # Contract unit tests
│   ├── hardhat.config.js
│   └── package.json
├── public/
│   └── manifest.json                       # PWA manifest
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
# Fill in your PRIVATE_KEY and CELOSCAN_API_KEY
```

### Deploy to Alfajores (testnet — always do this first!)
```bash
npm run deploy:testnet
# Output: ✅ BDeshSavings deployed at: 0x...
```

### Deploy to Celo Mainnet
```bash
npm run deploy:mainnet
```

### After deployment — update the frontend
Open `src/lib/wagmi-config.ts` and update:
```typescript
export const BDESH_SAVINGS_ADDRESS = "0xYOUR_DEPLOYED_ADDRESS" as `0x${string}`;
```

### Run contract tests
```bash
cd contracts
npx hardhat test
```

---

## 📱 Testing in MiniPay

### Option 1: Opera MiniPay App (recommended)
1. Download **Opera Mini** on Android
2. Enable MiniPay wallet in settings
3. Open MiniPay → Discover → Mini Apps
4. Tap the URL bar and enter your deployed URL
5. MiniPay auto-detects `window.ethereum.isMiniPay = true` and connects wallet

### Option 2: ngrok tunnel for local dev
```bash
# Terminal 1
npm run dev

# Terminal 2
ngrok http 3000
# Copy the https://xxxx.ngrok.io URL → paste into MiniPay
```

### Option 3: Browser with injected wallet
1. Install MetaMask browser extension
2. Add Celo Mainnet:
   - Network Name: `Celo`
   - RPC URL: `https://forno.celo.org`
   - Chain ID: `42220`
   - Symbol: `CELO`
   - Explorer: `https://celoscan.io`
3. Open `http://localhost:3000` and connect

### MiniPay-specific behavior
| Feature | Behavior |
|---------|----------|
| `window.ethereum.isMiniPay` | `true` → connect button hidden, auto-connects |
| Gas fees | Paid in `cUSD` via `feeCurrency` — no CELO needed |
| Transaction speed | ~2–5 seconds on Celo mainnet |
| Viewport | Mobile-first, 390px max-width |

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `bd-green` | `#006A4E` | Primary actions, header, savings |
| `bd-red` | `#F42A41` | Bills tab, destructive actions |
| `bd-gold` | `#F5C842` | Beta badge, target reached |
| `bd-dark-bg` | `#0A1628` | Dark mode page background |
| `bd-dark-card` | `#111F3A` | Dark mode card background |
| Font | Hind Siliguri | Bengali + English text |

### Color usage by feature
```
Dashboard   → bd-green  (trust, money, growth)
Remittance  → bd-green  (send = positive action)
Bills       → bd-red    (payment = attention)
Savings     → #1E40AF   (blue = calm, stable)
```

---

## 🌐 Production Deployment

### Deploy frontend to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Environment variables — set in Vercel dashboard
```env
NEXT_PUBLIC_CHAIN_ID=42220
NEXT_PUBLIC_BDESH_SAVINGS_ADDRESS=0x...
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_id_here
```

---

## ⛓️ Smart Contract — BDeshSavings.sol

The `BDeshSavings` contract tracks user savings on-chain with these features:

```
User A ──▶ createPot("ঈদ সেভিংস", "🌙")
         ──▶ deposit(potId, 20 cUSD)
         ──▶ withdraw(potId, 10 cUSD)
         ──▶ deletePot(potId)  ← auto-withdraws remaining balance
```

**Events emitted (indexed for subgraph/frontend sync):**
- `PotCreated(user, potId, name, emoji)`
- `Deposited(user, potId, amount, newBalance)`
- `Withdrawn(user, potId, amount, newBalance)`
- `PotDeleted(user, potId)`

**Security:** `ReentrancyGuard` on all state-changing functions. `Ownable` for admin. Custom errors (gas-efficient).

---

## 🏆 Proof of Ship Submission

**Project Name:** BDeshPay  
**Category:** DeFi / Payments / Consumer / Social Impact  
**Chain:** Celo Mainnet (chainId: 42220)  
**Contract:** `BDeshSavings.sol`  

### What makes BDeshPay unique

1. **First Bengali-language** Celo MiniPay dApp — full বাংলা UI
2. **Phone-number remittance** — send to BD mobile numbers (017xx/018xx), not just wallet addresses
3. **Cultural savings pots** — ঈদ সেভিংস, বাইক কিস্তি, পারিবারিক জরুরি, বিয়ে ফান্ড
4. **BD-flag design system** — #006A4E (green) + #F42A41 (red), Hind Siliguri font
5. **MiniPay-native** — auto-connect, cUSD gas fees, mobile-first 390px layout
6. **Dark mode** — full dark theme with `#0A1628` background

### Deployed contracts
| Network | Address |
|---------|---------|
| Celo Mainnet | *Deploy and add here* |
| Alfajores Testnet | *Deploy and add here* |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

```bash
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
```

---

## 📄 License

MIT — বাংলাদেশের জন্য তৈরি 🇧🇩

---

<div align="center">

**Made with 💚 for Bangladesh**

*আমার দেশ, আমার টাকা — Powered by Celo*

[Website](https://bdeshpay.vercel.app) · [CeloScan](https://celoscan.io) · [MiniPay](https://minipay.opera.com)

</div>
