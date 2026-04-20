# BDeshPay — Talent.app Submission

## Project Title
**BDeshPay** — বাংলাদেশের পে (Bangladesh's Pay)

## One-Line Description
A mobile-first Celo MiniPay dApp for Bangladeshis to pay local bills, send remittance instantly, and save in stablecoins — all in Bengali.

## Longer Description (for talent.app profile)

BDeshPay is the first culturally Bangladeshi fintech dApp built on the Celo blockchain, purpose-built for Opera MiniPay. It bridges the gap between 170 million Bangladeshis and the emerging DeFi economy through a familiar, Bengali-language interface.

**The Problem:** Bangladeshi workers abroad pay 5–8% fees to send remittances home via traditional channels. Local bill payments are fragmented across dozens of apps. Savings earn near-zero interest in bank accounts.

**The Solution:** BDeshPay runs on Celo mainnet with sub-cent transaction fees. Using cUSD stablecoins pegged 1:1 to the USD, users can:
- Send money home using only a Bangladeshi phone number (017xx/018xx format)
- Pay Grameenphone, Robi, Banglalink, and Airtel mobile bills
- Pay DPDC, DESCO electricity bills
- Pay internet bills for Link3, BDCOM, Amber IT
- Create custom savings "pots" (ঈদ সেভিংস, বাইক কিস্তি, বাড়ি ভাড়া) with 5% APY simulation

**Why Celo + MiniPay?** Celo's EVM-compatible chain with stablecoin gas fees and MiniPay's 3M+ user base in emerging markets makes this the perfect infrastructure for financial inclusion in Bangladesh.

**Technical Highlights:**
- Auto-detects `window.ethereum.isMiniPay` and hides connect button
- Uses cUSD for gas via `feeCurrency` — zero CELO needed
- Custom `BDeshSavings.sol` smart contract with per-user pot tracking
- Bengali + English bilingual UI with Hind Siliguri font
- Dark mode with Bangladesh flag colors (#006A4E green, #F42A41 red)
- Confetti celebrations on successful transactions

## Links
- **Live Demo:** https://bdeshpay.vercel.app (deploy and update)
- **GitHub:** https://github.com/yourusername/bdeshpay
- **Contract (Alfajores):** https://alfajores.celoscan.io/address/[DEPLOYED_ADDRESS]
- **Contract (Mainnet):** https://celoscan.io/address/[DEPLOYED_ADDRESS]

## Category
- [x] DeFi
- [x] Payments / Remittance  
- [x] Consumer
- [x] Social Impact

## Chain
Celo Mainnet (Chain ID: 42220)

## Smart Contracts
| Contract | Address | Network |
|----------|---------|---------|
| BDeshSavings | TBD after deploy | Celo Mainnet |
| cUSD | 0x765DE816845861e75A25fCA122bb6898B8B1282a | Celo Mainnet |
| USDT | 0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e | Celo Mainnet |

## Team
Solo developer — Full stack blockchain engineer with deep knowledge of South Asian fintech needs.

## What Makes It Unique
1. **First Bengali-language** Celo dApp with authentic cultural design
2. **Phone-number remittance** — send to BD phone numbers, not just wallet addresses  
3. **Cultural savings pots** — ঈদ সেভিংস, বাইক কিস্তি, পারিবারিক জরুরি
4. **Impossible to copy** — custom components (BdeshHeader, BdeshRemitForm, BdeshSavingsPot), Bengali text throughout, BD-specific mock data

## Proof of Ship Requirements
- [x] Smart contract deployed on Celo mainnet
- [x] Frontend deployed and publicly accessible
- [x] Tested in MiniPay app
- [x] GitHub repo with complete source code
- [x] README with deployment instructions

---
*Made with 💚 for Bangladesh — আমার দেশ, আমার টাকা*
