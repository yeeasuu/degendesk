# Xiaomi MiMo 100T Program Application — DegenDesk

## Project Name
DegenDesk — AI-Powered Web3 Command Center

## Live Demo
https://degendesk.vercel.app

## Source Code
https://github.com/yeeasuu/degendesk

## Project Overview

DegenDesk is a tactical AI console for Web3 operations — airdrops, NFT mints, wallet workflows, contract security analysis, and gas-aware execution. The platform is built around one core principle: **inspect first, simulate next, execute only when it makes sense**.

The flagship feature is the **MiMo Contract Auditor** — an AI-powered smart contract security analyzer that uses Xiaomi MiMo to perform deep code analysis, detect vulnerabilities, and generate structured audit reports.

## Why MiMo is Essential (Not Just a Wrapper)

MiMo is not a generic chatbot integration. It is the **core reasoning engine** for smart contract security analysis:

1. **Structured Vulnerability Detection** — MiMo analyzes Solidity source code for reentrancy, integer overflow, access control flaws, logic errors, and gas waste. Each audit generates a structured JSON report with severity scores, locations, and fix recommendations.

2. **Multi-Stage Analysis** — A single audit triggers multiple MiMo API calls:
   - Stage 1: Contract structure analysis
   - Stage 2: Vulnerability detection per category
   - Stage 3: Gas optimization opportunities
   - Stage 4: Best practices compliance check
   - Stage 5: Summary + safety score generation

3. **Context-Aware Reasoning** — MiMo understands Solidity semantics, EVM behavior, and DeFi patterns. It can distinguish between a harmless `transfer()` and a dangerous `call{value}()` with reentrancy risk.

4. **Dual Input Modes** — Users can paste a contract address (auto-fetches verified source from Sourcify) or directly paste Solidity source code for analysis.

## MiMo API Usage Estimate

| Metric | Value |
|--------|-------|
| Tokens per audit | ~10,000–15,000 |
| Audits per user per day | 3 (free tier) |
| Expected users (Month 1) | 100 |
| Daily token usage | ~10M tokens |
| **Monthly token usage** | **~300M tokens** |

This volume justifies the **100T token tier** for sustained growth.

## Technical Architecture

- **Frontend**: Next.js 15 + Tailwind CSS (dark theme, Web3-native UI)
- **Backend**: Next.js API Routes (serverless functions on Vercel)
- **AI Engine**: Xiaomi MiMo-v2.5-Pro via OpenAI-compatible API
- **Source Fetcher**: Sourcify verified contract repository
- **Rate Limiting**: 3 free audits/day per IP (freemium model)
- **Deployment**: Vercel (production)

## Freemium Model

| Tier | Audits/day | Price |
|------|-----------|-------|
| Free | 3 | $0 |
| Pro | Unlimited | $19/month |

The free tier drives user acquisition. Each free audit costs MiMo API tokens — volume scales with user growth.

## Key Features

- **On-chain scan**: Paste contract address → auto-fetch source → MiMo audit
- **Paste source code**: Direct Solidity analysis without on-chain lookup
- **Safety score**: 0–100 score based on findings severity
- **Expandable findings**: Critical / High / Medium / Low / Info with descriptions + fix recommendations
- **Gas optimization**: MiMo suggests specific gas-saving patterns
- **Rate limiting**: IP-based freemium enforcement

## Demo Walkthrough

1. Visit https://degendesk.vercel.app/dashboard
2. Scroll to "AI Contract Auditor"
3. Select "On-chain Address" mode
4. Paste any verified contract address (e.g., `0x0e74363bba068f2a9ce31aa035a0610b020ab41a`)
5. Click "Run AI Audit"
6. View the structured audit report with findings, severity, and recommendations

## Team

Solo developer based in Jawa Tengah, Indonesia. Building Web3 tools for the degen community.

## Development Workflow

This project was built using a two-AI workflow:

- **Claude Pro (Anthropic)** — Used for code generation, architecture design, debugging, and development assistance during the build phase. Receipt attached as proof of active AI-assisted development.
- **Xiaomi MiMo** — The production AI engine that powers the core feature. Every user-facing audit is processed by MiMo, making it the critical runtime dependency.

Claude Pro is the builder. MiMo is the product. One cannot replace the other.

## Contact

- GitHub: https://github.com/yeeasuu
- Email: budlixixixi@gmail.com
