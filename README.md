     1|# 📊 LiquidityIQ
     2|
     3|AI-Powered DLMM Liquidity Management Platform for [Meteora](https://www.meteora.ag/) on Solana.
     4|
     5|Intelligent pool discovery, risk assessment, and strategy building — powered by AI.
     6|
     7|---
     8|
     9|## 🧠 Architecture
    10|
    11|LiquidityIQ is a full-stack DeFi intelligence platform that combines **real-time on-chain data** with **AI-powered analysis** to help users navigate Meteora DLMM pools.
    12|
    13|```
    14|┌─────────────────────────────────────────────────────┐
    15|│                   LiquidityIQ UI                     │
    16|│         Next.js 14 · TypeScript · Tailwind           │
    17|├──────────┬──────────┬──────────┬──────────┬──────────┤
    18|│Dashboard │  Pool    │   AI     │  Risk    │ Strategy │
    19|│  Wallet  │ Explorer │ Advisor  │ Analysis │ Builder  │
    20|│ Connect  │  30+     │ Budget + │ 5-Factor │ Goal +   │
    21|│  SOL +   │  Live    │ Risk →   │ Score    │ Capital  │
    22|│ Tokens   │  Pools   │ Pools    │ 0-100    │ → Plan   │
    23|├──────────┴──────────┴──────────┴──────────┴──────────┤
    24|│                    API Layer                          │
    25|│  /api/wallet · /api/pools · /api/advisor · /api/risk  │
    26|│  /api/strategy · /api/chat                            │
    27|├──────────────────────┬───────────────────────────────┤
    28|│   Meteora DLMM API   │         AI (via 9Router)       │
    29|│   Pool data, TVL,    │   xmtp/ai-v2.5-pro             │
    30|│   Volume, Holders    │   Long-chain reasoning        │
    31|└──────────────────────┴───────────────────────────────┘
    32|```
    33|
    34|### AI Agents
    35|
    36|| Agent | Endpoint | Function |
    37||-------|----------|----------|
    38|| **Pool Advisor** | `POST /api/advisor` | Budget + risk tolerance → 3-5 pool recommendations |
    39|| **Risk Analyzer** | `POST /api/risk` | Pool address → 5-factor risk score (0-100) |
    40|| **Strategy Builder** | `POST /api/strategy` | Goal + capital + experience → custom DLMM strategy |
    41|| **AI Chat** | `POST /api/chat` | Conversational DeFi assistant |
    42|
    43|---
    44|
    45|## ⛽ Token Consumption Model
    46|
    47|Each AI call uses the configured model via 9Router gateway. Estimated token usage per interaction:
    48|
    49|| Feature | Prompt Tokens | Completion Tokens | Total/Call | Calls/User/Session | Total/Session |
    50||---------|--------------|-------------------|------------|--------------------|---------------|
    51|| **AI Advisor** | ~800 | ~1,200 | ~2,000 | 3-5 | ~6K-10K |
    52|| **Risk Analysis** | ~900 | ~1,500 | ~2,400 | 5-10 | ~12K-24K |
    53|| **Strategy Builder** | ~700 | ~1,000 | ~1,700 | 2-3 | ~3.4K-5.1K |
    54|| **AI Chat** | ~500 + history | ~600 | ~1,100/msg | 10-20 | ~11K-22K |
    55|
    56|**Per active user session:** ~32K-61K tokens
    57|
    58|**Scaling estimates:**
    59|- 100 users/day → ~3.2M-6.1M tokens/day → ~96M-183M tokens/month
    60|- 1,000 users/day → ~32M-61M tokens/day → ~960M-1.8B tokens/month
    61|
    62|> All AI features route through 9Router gateway with automatic key rotation for rate limit management.
    63|
    64|---
    65|
    66|## 🏗️ Tech Stack
    67|
    68|- **Framework:** Next.js 14 (App Router)
    69|- **Language:** TypeScript
    70|- **Styling:** Tailwind CSS + Custom CSS Variables
    71|- **Font:** VT323 (Google Fonts)
    72|- **AI Model:** Configured LLM (via 9Router proxy)
    73|- **Blockchain:** Solana Mainnet (RPC)
    74|- **DLMM Data:** Meteora DLMM API
    75|- **Deployment:** VPS (Node.js production server)
    76|
    77|---
    78|
    79|## 🚀 Features
    80|
    81|### 📊 Dashboard
    82|- Connect Solana wallet (address-based, no signing required)
    83|- View SOL balance + all SPL token holdings
    84|- Portfolio value tracking
    85|
    86|### 🏊 Pool Explorer
    87|- 30+ live DLMM pools from Meteora
    88|- Real-time data: TVL, Volume 24h, Fee, Organic Score, Holders
    89|- Sort by: AI Score, TVL, Volume, Organic Score
    90|- Filter by risk level: Low, Medium, High
    91|- Pool detail panel with full metrics
    92|
    93|### 🤖 AI Pool Advisor
    94|- Input: Budget (USD) + Risk Tolerance (Conservative/Moderate/Aggressive)
    95|- Output: 3-5 AI-scored pool recommendations with reasoning
    96|- Powered by long-chain reasoning
    97|
    98|### 🛡️ Risk Analysis
    99|- Input: Pool name or address
   100|- Output: 5-factor risk assessment (0-100 score each)
   101|  - Liquidity Depth
   102|  - Smart Contract Risk
   103|  - Impermanent Loss Risk
   104|  - Counterparty Risk
   105|  - Market Volatility
   106|- Overall weighted score + recommendation
   107|
   108|### ⚙️ Strategy Builder
   109|- Input: Investment goal, Capital amount, Experience level
   110|- Output: Custom DLMM strategy with steps, expected APY, risk level
   111|- Tailored to user's capital and experience
   112|
   113|### 💬 AI Chat
   114|- Conversational DeFi assistant
   115|- Context-aware (maintains chat history)
   116|- Expert on Meteora DLMM, Solana DeFi, liquidity management
   117|
   118|---
   119|
   120|## 📁 Project Structure
   121|
   122|```
   123|liquidity-iq/
   124|├── app/
   125|│   ├── api/
   126|│   │   ├── advisor/route.ts    # AI pool recommendations
   127|│   │   ├── chat/route.ts       # AI chat endpoint
   128|│   │   ├── pools/route.ts      # Meteora pool data
   129|│   │   ├── risk/route.ts       # Risk analysis
   130|│   │   ├── strategy/route.ts   # Strategy builder
   131|│   │   └── wallet/route.ts     # Wallet data (SOL + tokens)
   132|│   ├── advisor/page.tsx        # AI Advisor UI
   133|│   ├── chat/page.tsx           # AI Chat UI
   134|│   ├── pools/page.tsx          # Pool Explorer UI
   135|│   ├── risk/page.tsx           # Risk Analysis UI
   136|│   ├── strategy/page.tsx       # Strategy Builder UI
   137|│   ├── page.tsx                # Dashboard
   138|│   ├── layout.tsx              # Root layout
   139|│   └── globals.css             # Global styles + theme
   140|├── components/
   141|│   └── Sidebar.tsx             # Navigation sidebar
   142|├── lib/
   143|│   └── ai.ts                   # AI API wrapper (9Router → LLM)
   144|├── .env                        # AI API config
   145|├── tailwind.config.js          # Tailwind + color palette
   146|├── package.json
   147|└── README.md
   148|```
   149|
   150|---
   151|
   152|## 🛠️ Getting Started
   153|
   154|```bash
   155|# Clone
   156|git clone https://github.com/nov1talia/liquidity-iq.git
   157|cd liquidity-iq
   158|
   159|# Install
   160|npm install
   161|
   162|# Configure environment
   163|cp .env.example .env
   164|# Edit .env with your AI API credentials
   165|
   166|# Development
   167|npm run dev
   168|
   169|# Production
   170|npm run build
   171|npm start
   172|```
   173|
   174|### Environment Variables
   175|
   176|```env
   177|AI_BASE_URL=http://localhost:20128/v1    # 9Router gateway
   178|AI_API_KEY=your_api_key_here             # API key
   179|AI_MODEL=your_model_here                   # Model identifier
   180|```
   181|
   182|---
   183|
   184|## 📊 Data Sources
   185|
   186|- **Pool Data:** [Meteora DLMM API](https://www.meteora.ag/) — real-time pool metrics, TVL, volume, organic scores
   187|- **Wallet Data:** Solana RPC — SOL balance, SPL token accounts
   188|- **AI Analysis:** LLM via 9Router — long-chain reasoning for DeFi
   189|
   190|---
   191|
   192|## 📜 License
   193|
   194|MIT
   195|
   196|---
   197|
   198|## 🔗 Links
   199|
   200|- **App:** [LiquidityIQ](http://194.233.83.169:3001)
   201|- **GitHub:** [github.com/nov1talia](https://github.com/nov1talia/)
   202|- **Powered by:** [Meteora](https://www.meteora.ag/)
   203|