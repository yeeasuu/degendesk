# Xiaomi MiMo Orbit 100T Submission Draft

## Project name

DegenDesk

## Short description

DegenDesk is an AI command center for airdrops, NFT mints, wallets, gas strategy, and on-chain operations. It helps Web3 operators inspect contracts and mint flows before signing transactions.

## Longer description

DegenDesk is a Web3 operator console built around a safety-first workflow:

```text
Detect → Analyze → Simulate → Execute → Report
```

The MVP includes a polished dark dashboard and a live Contract / Mint Scanner. Users can paste a contract address or explorer/mint URL, select a chain, and scan verified ABI data from Sourcify. DegenDesk then highlights functions such as `freemint`, `mint`, `claim`, approvals, and admin-risk controls.

This gives operators a fast pre-flight view before interacting with wallet popups or mint pages. The next layer is to connect these scanner results to an AI reasoning model so the system can produce concise risk summaries, recommended checks, gas guidance, and Telegram-ready action reports.

## What is already built

- Next.js + Tailwind landing page
- `/dashboard` operator console
- Safety Rules panel
- Ops Queue and Execution Gates
- Vera Ops Agent mock terminal
- Live Contract / Mint Scanner API
- Sourcify ABI lookup
- Function classification:
  - freemint
  - mint/claim
  - approval
  - admin/risk
  - other
- Risk notes for freemint/payment/approval/admin functions
- Verified local build and smoke test

## Example scanner result

Input contract:

```text
0x0e74363bba068f2a9ce31aa035a0610b020ab41a
```

Detected:

```text
freemint()                         → FREEMINT
mint(uint256)                      → MINT/CLAIM
approve(address,uint256)           → APPROVAL
setApprovalForAll(address,bool)    → APPROVAL
transferOwnership(address)         → ADMIN/RISK
withdraw()                         → ADMIN/RISK
```

Useful reads detected:

```text
COST()
MAX_FREE()
balanceOf(address)
owner()
totalSupply()
```

## Why MiMo is relevant

DegenDesk needs a reasoning model that can turn low-level Web3 data into operator-grade decisions. Xiaomi MiMo can power:

- Contract explanation from ABI/source metadata
- Mint risk summaries
- Airdrop task planning
- Wallet pre-flight analysis
- Gas strategy reasoning
- Telegram command responses
- Multi-agent workflows with planner, executor, and verifier roles

The intended MiMo-powered workflow:

```text
User intent
→ scanner/API/RPC tools
→ MiMo reasoning summary
→ safety gates
→ optional execution after operator confirmation
→ concise report
```

## Current tech stack

- Next.js 15 App Router
- React 19
- Tailwind CSS
- TypeScript
- Sourcify metadata/ABI lookup
- Web3-oriented safety workflow

## Roadmap

### Phase 1 — MVP proof

- Landing page
- Dashboard
- Contract / Mint Scanner
- README and deployment proof

### Phase 2 — Better scanner

- Etherscan API fallback
- Direct read calls for supply, price, owner, paused status, freemint counters
- RPC gas estimation
- Mint-link frontend/API inspection

### Phase 3 — MiMo AI layer

- MiMo-powered scanner explanation
- AI terminal command parser
- Risk summary and recommended next steps
- Telegram-friendly reports

### Phase 4 — Web3 operator tools

- Wallet read-only balances
- Approval scanning
- Airdrop tracker
- DexScreener token search
- Watchlist and alerting

### Phase 5 — Safe execution

- Transaction simulation
- Operator confirmation gates
- Agent-wallet execution for approved actions
- Broadcast and confirmation reporting

## Proof assets

Suggested screenshots:

- Landing page showing DegenDesk positioning
- Dashboard operator console
- Contract scanner result panel

## Application answer suggestion

DegenDesk is an AI-native Web3 operations console. It helps crypto operators inspect NFT mint contracts, airdrops, wallet actions, gas context, and contract risks before signing transactions. The MVP already includes a live contract/mint scanner that fetches verified ABI data from Sourcify and classifies functions like freemint, mint/claim, approvals, and admin-risk controls. The next step is to use Xiaomi MiMo as the reasoning layer that converts raw scanner output and on-chain data into concise operator guidance, risk summaries, and Telegram-ready action reports.
