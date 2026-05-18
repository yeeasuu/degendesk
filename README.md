# DegenDesk

**AI command center for airdrops, mints, wallets, and on-chain ops.**

DegenDesk is a Web3 operator console for people who move between mint pages, explorers, token feeds, wallets, and Telegram commands all day. The goal is to collapse that workflow into one AI-assisted desk that can inspect first, simulate next, and execute only when it makes sense.

This repository is an MVP built with Next.js and Tailwind. It already includes a polished dark operator dashboard and a live Contract / Mint Scanner powered by Sourcify ABI lookup.

## Why it exists

Web3 operators often need to answer fast questions before acting:

- Is this NFT mint actually gas-only?
- Does this contract expose `freemint`, `mint`, `claim`, or hidden admin controls?
- Is a transaction asking for an approval or a native-token payment?
- Which functions are relevant before I click a wallet popup?
- What should be simulated before broadcast?

DegenDesk turns those checks into a structured operator workflow:

```text
Detect → Analyze → Simulate → Execute → Report
```

## Current MVP

### Landing page

- Dark neon Web3/AI landing page
- Agent-console hero
- Safety pipeline
- Module cards for mint, airdrop, wallet, gas, scanner, and Telegram operations

### Dashboard

- Operator console at `/dashboard`
- Sidebar navigation
- Safety rules panel
- Ops queue
- Module status
- Execution gates
- Vera Ops Agent mock terminal

### Live Contract / Mint Scanner

The scanner is the first real tool in the MVP.

Input:

- Contract address or URL containing a `0x...` address
- Chain: Ethereum, Base, Polygon, Arbitrum, Optimism

Output:

- Contract name
- Source match from Sourcify
- Write function count
- Interesting write functions
- Useful read functions
- Risk notes

Function categories:

- `freemint`
- `mint/claim`
- `approval`
- `admin/risk`
- `other`

Example detection from a real ERC-721 contract:

```text
freemint()                         → FREEMINT
mint(uint256)                      → MINT/CLAIM
approve(address,uint256)           → APPROVAL
setApprovalForAll(address,bool)    → APPROVAL
transferOwnership(address)         → ADMIN/RISK
withdraw()                         → ADMIN/RISK
```

## Tech stack

- Next.js 15 App Router
- React 19
- Tailwind CSS
- TypeScript
- lucide-react icons
- Sourcify verified contract metadata / ABI repository

## Project structure

```text
app/
  api/scan-contract/route.ts      # Sourcify ABI scanner API
  dashboard/page.tsx              # Operator dashboard
  globals.css                     # Tailwind/global styles
  layout.tsx                      # Metadata/root layout
  page.tsx                        # Landing page
components/
  contract-scanner.tsx            # Client scanner UI
```

## Local development

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:3000
http://127.0.0.1:3000/dashboard
```

## Verification

```bash
npm run typecheck
npm run build
```

Current build output includes:

```text
/                      static
/dashboard             static
/api/scan-contract     dynamic
```

## Roadmap

### Near term

- Add Etherscan API fallback when Sourcify ABI is missing
- Add direct read calls for `totalSupply`, `maxSupply`, `price`, `owner`, `paused`, and freemint counters
- Add gas estimation using RPC provider
- Add mint-link inspection for frontend/API clues
- Add token search via DexScreener
- Add Telegram alert hooks

### Later

- Wallet read-only balances and approvals
- Safe transaction simulation
- Agent-wallet execution layer
- AI terminal powered by a MiMo-compatible model router
- Multi-chain watchers for mints, airdrops, and whale movements

## Xiaomi MiMo 100T angle

DegenDesk is designed as an AI-native Web3 operations platform. MiMo can power the reasoning layer that turns raw scanner data, contract metadata, token feeds, and wallet context into concise operator decisions.

Ideal MiMo-powered surfaces:

- Contract explanation
- Mint risk summary
- Airdrop task planner
- Transaction pre-flight reasoning
- Telegram command responses
- Daily Web3 ops briefings
- Multi-agent planner/executor/verifier workflow

## Status

MVP visual + first live scanner tool complete.

Not production financial software. Always verify contract data, simulate transactions, and review wallet prompts before signing.
