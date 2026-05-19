# 📊 LiquidityIQ

AI-Powered DLMM Liquidity Management Platform for [Meteora](https://www.meteora.ag/) on Solana.

Intelligent pool discovery, risk assessment, and strategy building — powered by MiMo AI.

---

## 🧠 Architecture

LiquidityIQ is a full-stack DeFi intelligence platform that combines **real-time on-chain data** with **AI-powered analysis** to help users navigate Meteora DLMM pools.

```
┌─────────────────────────────────────────────────────┐
│                   LiquidityIQ UI                     │
│         Next.js 14 · TypeScript · Tailwind           │
├──────────┬──────────┬──────────┬──────────┬──────────┤
│Dashboard │  Pool    │   AI     │  Risk    │ Strategy │
│  Wallet  │ Explorer │ Advisor  │ Analysis │ Builder  │
│ Connect  │  30+     │ Budget + │ 5-Factor │ Goal +   │
│  SOL +   │  Live    │ Risk →   │ Score    │ Capital  │
│ Tokens   │  Pools   │ Pools    │ 0-100    │ → Plan   │
├──────────┴──────────┴──────────┴──────────┴──────────┤
│                    API Layer                          │
│  /api/wallet · /api/pools · /api/advisor · /api/risk  │
│  /api/strategy · /api/chat                            │
├──────────────────────┬───────────────────────────────┤
│   Meteora DLMM API   │       MiMo AI (via 9Router)   │
│   Pool data, TVL,    │   xmtp/mimo-v2.5-pro          │
│   Volume, Holders    │   Long-chain reasoning        │
└──────────────────────┴───────────────────────────────┘
```

### AI Agents

| Agent | Endpoint | Function |
|-------|----------|----------|
| **Pool Advisor** | `POST /api/advisor` | Budget + risk tolerance → 3-5 pool recommendations |
| **Risk Analyzer** | `POST /api/risk` | Pool address → 5-factor risk score (0-100) |
| **Strategy Builder** | `POST /api/strategy` | Goal + capital + experience → custom DLMM strategy |
| **AI Chat** | `POST /api/chat` | Conversational DeFi assistant |

---

## ⛽ Token Consumption Model

Each AI call uses MiMo-V2.5-Pro via 9Router gateway. Estimated token usage per interaction:

| Feature | Prompt Tokens | Completion Tokens | Total/Call | Calls/User/Session | Total/Session |
|---------|--------------|-------------------|------------|--------------------|---------------|
| **AI Advisor** | ~800 | ~1,200 | ~2,000 | 3-5 | ~6K-10K |
| **Risk Analysis** | ~900 | ~1,500 | ~2,400 | 5-10 | ~12K-24K |
| **Strategy Builder** | ~700 | ~1,000 | ~1,700 | 2-3 | ~3.4K-5.1K |
| **AI Chat** | ~500 + history | ~600 | ~1,100/msg | 10-20 | ~11K-22K |

**Per active user session:** ~32K-61K tokens

**Scaling estimates:**
- 100 users/day → ~3.2M-6.1M tokens/day → ~96M-183M tokens/month
- 1,000 users/day → ~32M-61M tokens/day → ~960M-1.8B tokens/month

> All AI features route through 9Router gateway with automatic key rotation for rate limit management.

---

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS Variables
- **Font:** VT323 (Google Fonts)
- **AI Model:** MiMo-V2.5-Pro (via 9Router proxy)
- **Blockchain:** Solana Mainnet (RPC)
- **DLMM Data:** Meteora DLMM API
- **Deployment:** VPS (Node.js production server)

---

## 🚀 Features

### 📊 Dashboard
- Connect Solana wallet (address-based, no signing required)
- View SOL balance + all SPL token holdings
- Portfolio value tracking

### 🏊 Pool Explorer
- 30+ live DLMM pools from Meteora
- Real-time data: TVL, Volume 24h, Fee, Organic Score, Holders
- Sort by: AI Score, TVL, Volume, Organic Score
- Filter by risk level: Low, Medium, High
- Pool detail panel with full metrics

### 🤖 AI Pool Advisor
- Input: Budget (USD) + Risk Tolerance (Conservative/Moderate/Aggressive)
- Output: 3-5 AI-scored pool recommendations with reasoning
- Powered by MiMo long-chain reasoning

### 🛡️ Risk Analysis
- Input: Pool name or address
- Output: 5-factor risk assessment (0-100 score each)
  - Liquidity Depth
  - Smart Contract Risk
  - Impermanent Loss Risk
  - Counterparty Risk
  - Market Volatility
- Overall weighted score + recommendation

### ⚙️ Strategy Builder
- Input: Investment goal, Capital amount, Experience level
- Output: Custom DLMM strategy with steps, expected APY, risk level
- Tailored to user's capital and experience

### 💬 AI Chat
- Conversational DeFi assistant
- Context-aware (maintains chat history)
- Expert on Meteora DLMM, Solana DeFi, liquidity management

---

## 📁 Project Structure

```
liquidity-iq/
├── app/
│   ├── api/
│   │   ├── advisor/route.ts    # AI pool recommendations
│   │   ├── chat/route.ts       # AI chat endpoint
│   │   ├── pools/route.ts      # Meteora pool data
│   │   ├── risk/route.ts       # Risk analysis
│   │   ├── strategy/route.ts   # Strategy builder
│   │   └── wallet/route.ts     # Wallet data (SOL + tokens)
│   ├── advisor/page.tsx        # AI Advisor UI
│   ├── chat/page.tsx           # AI Chat UI
│   ├── pools/page.tsx          # Pool Explorer UI
│   ├── risk/page.tsx           # Risk Analysis UI
│   ├── strategy/page.tsx       # Strategy Builder UI
│   ├── page.tsx                # Dashboard
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles + theme
├── components/
│   └── Sidebar.tsx             # Navigation sidebar
├── lib/
│   └── ai.ts                   # AI API wrapper (9Router → MiMo)
├── .env                        # AI API config
├── tailwind.config.js          # Tailwind + color palette
├── package.json
└── README.md
```

---

## 🛠️ Getting Started

```bash
# Clone
git clone https://github.com/moonaskyou/liquidity-iq.git
cd liquidity-iq

# Install
npm install

# Configure environment
cp .env.example .env
# Edit .env with your AI API credentials

# Development
npm run dev

# Production
npm run build
npm start
```

### Environment Variables

```env
AI_BASE_URL=http://localhost:20128/v1    # 9Router gateway
AI_API_KEY=your_api_key_here             # API key
AI_MODEL=xmtp/mimo-v2.5-pro             # Model identifier
```

---

## 📊 Data Sources

- **Pool Data:** [Meteora DLMM API](https://www.meteora.ag/) — real-time pool metrics, TVL, volume, organic scores
- **Wallet Data:** Solana RPC — SOL balance, SPL token accounts
- **AI Analysis:** MiMo-V2.5-Pro via 9Router — long-chain reasoning for DeFi

---

## 📜 License

MIT

---

## 🔗 Links

- **App:** [LiquidityIQ](http://194.233.83.169:3001)
- **GitHub:** [github.com/moonaskyou](https://github.com/moonaskyou/)
- **Powered by:** [Meteora](https://www.meteora.ag/)
