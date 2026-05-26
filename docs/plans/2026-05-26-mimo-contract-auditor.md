# MiMo Contract Auditor — Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build an AI-powered Smart Contract Auditor using Xiaomi MiMo models — users paste a contract address or Solidity source code, MiMo analyzes for vulnerabilities, gas optimization, and best practices, producing a detailed audit report.

**Architecture:** Next.js 15 app (extends DegenDesk). Sourcify fetches verified source code → MiMo-v2.5-Pro analyzes Solidity code → structured audit report with severity scores. MiMo-v2-Omni handles contract diagram/visual explanations.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS, Xiaomi MiMo API (v2.5-Pro + v2-Omni), Sourcify, Etherscan API (fallback)

---

## Phase 1: MiMo API Integration (Foundation)

### Task 1: Set up MiMo API client

**Objective:** Create a reusable MiMo API client with proper error handling and rate limiting.

**Files:**
- Create: `lib/mimo-client.ts`
- Create: `lib/mimo-types.ts`

**Step 1:** Create `lib/mimo-types.ts`

```typescript
export type MimoMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type MimoCompletionRequest = {
  model: string;
  messages: MimoMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
};

export type MimoCompletionResponse = {
  id: string;
  choices: {
    index: number;
    message: { role: string; content: string };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type AuditSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type AuditFinding = {
  severity: AuditSeverity;
  title: string;
  description: string;
  location: string;
  recommendation: string;
};

export type AuditReport = {
  contractName: string;
  overallRisk: AuditSeverity;
  score: number; // 0-100, higher = safer
  findings: AuditFinding[];
  gasOptimizations: string[];
  summary: string;
};
```

**Step 2:** Create `lib/mimo-client.ts`

```typescript
import type { MimoCompletionRequest, MimoCompletionResponse } from './mimo-types';

const MIMO_API_BASE = process.env.MIMO_API_BASE || 'https://api.mimo.xiaomi.com/v1';
const MIMO_API_KEY = process.env.MIMO_API_KEY || '';

export async function mimoComplete(
  messages: MimoCompletionRequest['messages'],
  options?: { model?: string; temperature?: number; max_tokens?: number }
): Promise<MimoCompletionResponse> {
  const body: MimoCompletionRequest = {
    model: options?.model || 'mimo-v2.5-pro',
    messages,
    temperature: options?.temperature ?? 0.3,
    max_tokens: options?.max_tokens ?? 4096,
  };

  const res = await fetch(`${MIMO_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MIMO_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`MiMo API error ${res.status}: ${err}`);
  }

  return res.json();
}
```

**Step 3:** Create `.env.local` entry

```bash
# Add to .env.local
MIMO_API_BASE=https://api.mimo.xiaomi.com/v1
MIMO_API_KEY=your_mimo_api_key_here
```

**Step 4:** Commit

```bash
git add lib/mimo-client.ts lib/mimo-types.ts
git commit -m "feat: add MiMo API client and types"
```

---

## Phase 2: Source Code Fetcher

### Task 2: Fetch verified Solidity source code

**Objective:** Fetch contract source code from Sourcify (with Etherscan fallback) for AI analysis.

**Files:**
- Create: `lib/source-fetcher.ts`
- Modify: `app/api/scan-contract/route.ts` (add source code to response)

**Step 1:** Create `lib/source-fetcher.ts`

```typescript
export type SourceResult = {
  source: string;
  contractName: string;
  compiler: string;
  chainId: number;
  address: string;
};

export async function fetchSourceCode(
  chainId: number,
  address: string
): Promise<SourceResult | null> {
  // Try Sourcify first
  const bases = ['full_match', 'partial_match'];
  for (const matchType of bases) {
    const url = `https://repo.sourcify.dev/contracts/${matchType}/${chainId}/${address}/metadata.json`;
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) continue;
    const metadata = await res.json();
    const sources = metadata?.sources || metadata?.settings?.compilationTarget;
    if (metadata?.output?.abi) {
      // Extract source from metadata
      const sourceEntries = Object.entries(metadata.sources || {});
      const mainSource = sourceEntries.length > 0
        ? (sourceEntries[0][1] as { content?: string }).content || ''
        : '';
      return {
        source: mainSource,
        contractName: metadata?.contractName || Object.values(metadata?.settings?.compilationTarget || {})[0] || 'Unknown',
        compiler: metadata?.compiler?.version || 'unknown',
        chainId,
        address,
      };
    }
  }
  return null;
}
```

**Step 2:** Commit

```bash
git add lib/source-fetcher.ts
git commit -m "feat: add Sourcify source code fetcher"
```

---

## Phase 3: AI Audit Engine

### Task 3: Build the MiMo audit prompt and parser

**Objective:** Create the core audit engine that sends Solidity code to MiMo and parses structured findings.

**Files:**
- Create: `lib/audit-engine.ts`

**Step 1:** Create `lib/audit-engine.ts`

```typescript
import { mimoComplete } from './mimo-client';
import type { AuditReport, AuditFinding, AuditSeverity } from './mimo-types';

const AUDIT_SYSTEM_PROMPT = `You are a senior smart contract security auditor. Analyze the provided Solidity code for:

1. SECURITY VULNERABILITIES (reentrancy, overflow, access control, frontrunning, flash loan attacks, etc.)
2. GAS OPTIMIZATIONS (storage packing, loop optimization, calldata vs memory, etc.)
3. BEST PRACTICES (OpenZeppelin usage, events, NatSpec, etc.)
4. LOGIC ERRORS (edge cases, failed transfers, incorrect math, etc.)

Respond in JSON format:
{
  "overallRisk": "critical|high|medium|low|info",
  "score": 0-100,
  "findings": [
    {
      "severity": "critical|high|medium|low|info",
      "title": "Short title",
      "description": "Detailed explanation",
      "location": "function name or line reference",
      "recommendation": "How to fix"
    }
  ],
  "gasOptimizations": ["optimization 1", "optimization 2"],
  "summary": "Brief overall assessment"
}

Be thorough. Check every function. Real exploits start with "it's probably fine."`;

export async function auditContract(
  sourceCode: string,
  contractName: string
): Promise<AuditReport> {
  const response = await mimoComplete(
    [
      { role: 'system', content: AUDIT_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Audit this Solidity contract:\n\nContract: ${contractName}\n\n\`\`\`solidity\n${sourceCode}\n\`\`\``,
      },
    ],
    { model: 'mimo-v2.5-pro', temperature: 0.2, max_tokens: 8192 }
  );

  const content = response.choices[0]?.message?.content || '';

  // Parse JSON from response (handle markdown code blocks)
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
  const raw = JSON.parse(jsonMatch[1] || content);

  return {
    contractName,
    overallRisk: validateSeverity(raw.overallRisk),
    score: Math.min(100, Math.max(0, Number(raw.score) || 0)),
    findings: (raw.findings || []).map((f: Record<string, string>) => ({
      severity: validateSeverity(f.severity),
      title: f.title || 'Unknown',
      description: f.description || '',
      location: f.location || 'unknown',
      recommendation: f.recommendation || '',
    })),
    gasOptimizations: raw.gasOptimizations || [],
    summary: raw.summary || 'No summary provided.',
  };
}

function validateSeverity(s: string): AuditSeverity {
  const valid: AuditSeverity[] = ['critical', 'high', 'medium', 'low', 'info'];
  return valid.includes(s as AuditSeverity) ? (s as AuditSeverity) : 'info';
}
```

**Step 2:** Commit

```bash
git add lib/audit-engine.ts
git commit -m "feat: add MiMo-powered audit engine with structured output"
```

---

## Phase 4: Audit API Route

### Task 4: Create the /api/audit endpoint

**Objective:** API route that combines source fetching + MiMo audit into a single endpoint.

**Files:**
- Create: `app/api/audit/route.ts`

**Step 1:** Create `app/api/audit/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { fetchSourceCode } from '@/lib/source-fetcher';
import { auditContract } from '@/lib/audit-engine';

export const runtime = 'nodejs';
export const maxDuration = 120; // MiMo analysis can take time

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

const CHAINS: Record<string, number> = {
  ethereum: 1, eth: 1, '1': 1,
  base: 8453, '8453': 8453,
  polygon: 137, '137': 137,
  arbitrum: 42161, '42161': 42161,
  optimism: 10, '10': 10,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { source: rawSource, address: rawAddress, chain: rawChain } = body;

    // Mode 1: Direct source code upload
    if (rawSource && typeof rawSource === 'string') {
      const report = await auditContract(rawSource, body.contractName || 'Uploaded Contract');
      return NextResponse.json({ ok: true, report, mode: 'source' });
    }

    // Mode 2: On-chain address
    const address = (rawAddress || '').match(ADDRESS_RE)?.[0];
    const chainId = CHAINS[(rawChain || 'ethereum').toLowerCase()] || 1;

    if (!address) {
      return NextResponse.json(
        { ok: false, error: 'Provide valid contract address or Solidity source code.' },
        { status: 400 }
      );
    }

    const sourceResult = await fetchSourceCode(chainId, address);
    if (!sourceResult) {
      return NextResponse.json(
        { ok: false, error: 'Verified source not found on Sourcify. Contract may not be verified.' },
        { status: 404 }
      );
    }

    const report = await auditContract(sourceResult.source, sourceResult.contractName);

    return NextResponse.json({
      ok: true,
      report,
      mode: 'onchain',
      meta: { address, chainId, compiler: sourceResult.compiler },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Audit failed' },
      { status: 500 }
    );
  }
}
```

**Step 2:** Commit

```bash
git add app/api/audit/route.ts
git commit -m "feat: add /api/audit endpoint with dual mode (source + on-chain)"
```

---

## Phase 5: Frontend — Audit UI

### Task 5: Build the AuditReport component

**Objective:** Beautiful, detailed audit report UI with severity colors, score gauge, and expandable findings.

**Files:**
- Create: `components/audit-report.tsx`
- Create: `components/audit-scanner.tsx`
- Modify: `app/dashboard/page.tsx` (add audit tab)

**Step 1:** Create `components/audit-report.tsx`

```tsx
'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Shield, Zap, Bug, Info } from 'lucide-react';
import type { AuditReport as AuditReportType, AuditSeverity } from '@/lib/mimo-types';

const SEVERITY_CONFIG: Record<AuditSeverity, { color: string; bg: string; border: string; icon: typeof Bug }> = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: Bug },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: AlertTriangle },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: AlertTriangle },
  low: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: Info },
  info: { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', icon: Info },
};

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : score >= 40 ? '#f97316' : '#ef4444';
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="40" fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={`${(score / 100) * 251.3} 251.3`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-black text-white">{score}</span>
        </div>
      </div>
      <span className="text-xs uppercase tracking-widest text-slate-500">Safety Score</span>
    </div>
  );
}

export function AuditReportDisplay({ report }: { report: AuditReportType }) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    const next = new Set(expanded);
    next.has(i) ? next.delete(i) : next.add(i);
    setExpanded(next);
  };

  const severityCounts = report.findings.reduce(
    (acc, f) => { acc[f.severity] = (acc[f.severity] || 0) + 1; return acc; },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:flex-row md:items-start">
        <ScoreGauge score={report.score} />
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-black text-white">{report.contractName}</h3>
          <p className="mt-1 text-sm text-slate-400">{report.summary}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
            {(['critical', 'high', 'medium', 'low', 'info'] as AuditSeverity[]).map((sev) =>
              severityCounts[sev] ? (
                <span key={sev} className={`rounded-full border px-3 py-1 text-xs font-bold ${SEVERITY_CONFIG[sev].color} ${SEVERITY_CONFIG[sev].border} ${SEVERITY_CONFIG[sev].bg}`}>
                  {severityCounts[sev]} {sev}
                </span>
              ) : null
            )}
          </div>
        </div>
      </div>

      {/* Findings */}
      <div className="space-y-3">
        {report.findings.map((finding, i) => {
          const cfg = SEVERITY_CONFIG[finding.severity];
          const Icon = cfg.icon;
          const isOpen = expanded.has(i);
          return (
            <div key={i} className={`rounded-xl border ${cfg.border} ${cfg.bg} overflow-hidden`}>
              <button onClick={() => toggle(i)} className="flex w-full items-center gap-3 p-4 text-left">
                <Icon className={`h-5 w-5 flex-shrink-0 ${cfg.color}`} />
                <div className="flex-1">
                  <span className={`font-bold ${cfg.color}`}>[{finding.severity.toUpperCase()}]</span>
                  <span className="ml-2 text-white">{finding.title}</span>
                </div>
                <span className="text-xs text-slate-500">{finding.location}</span>
                {isOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
              </button>
              {isOpen && (
                <div className="border-t border-white/5 px-4 pb-4 pt-3">
                  <p className="text-sm text-slate-300">{finding.description}</p>
                  <div className="mt-3 rounded-lg bg-black/20 p-3">
                    <span className="text-xs font-bold text-acid">Recommendation:</span>
                    <p className="mt-1 text-sm text-slate-300">{finding.recommendation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Gas Optimizations */}
      {report.gasOptimizations.length > 0 && (
        <div className="rounded-xl border border-violet/20 bg-violet/5 p-4">
          <h4 className="mb-3 flex items-center gap-2 font-bold text-violet"><Zap className="h-4 w-4" /> Gas Optimizations</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            {report.gasOptimizations.map((opt, i) => <li key={i}>• {opt}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
```

**Step 2:** Create `components/audit-scanner.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Loader2, Shield, Upload, Link2 } from 'lucide-react';
import { AuditReportDisplay } from './audit-report';
import type { AuditReport } from '@/lib/mimo-types';

export function AuditScanner() {
  const [mode, setMode] = useState<'address' | 'source'>('address');
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('ethereum');
  const [sourceCode, setSourceCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState('');

  async function runAudit() {
    setLoading(true);
    setError('');
    setReport(null);
    try {
      const body = mode === 'address'
        ? { address, chain }
        : { source: sourceCode, contractName: 'Uploaded Contract' };

      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setReport(data.report);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Audit failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#080d1c]/80 p-5 backdrop-blur-xl">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-full border border-acid/20 bg-acid/10 p-2">
          <Shield className="h-5 w-5 text-acid" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">AI Contract Auditor</h2>
          <p className="text-sm text-slate-400">MiMo-powered deep analysis — vulnerabilities, gas, best practices</p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="mb-4 flex gap-2">
        <button onClick={() => setMode('address')} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${mode === 'address' ? 'bg-cyan/20 text-cyan' : 'bg-white/5 text-slate-500'}`}>
          <Link2 className="h-4 w-4" /> On-chain Address
        </button>
        <button onClick={() => setMode('source')} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${mode === 'source' ? 'bg-violet/20 text-violet' : 'bg-white/5 text-slate-500'}`}>
          <Upload className="h-4 w-4" /> Paste Source Code
        </button>
      </div>

      {/* Input */}
      {mode === 'address' ? (
        <div className="grid gap-3 md:grid-cols-[1fr_160px]">
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="0x... contract address" className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan/40" />
          <select value={chain} onChange={(e) => setChain(e.target.value)} className="rounded-2xl border border-white/10 bg-[#10172a] px-4 py-3 text-sm text-white outline-none focus:border-cyan/40">
            <option value="ethereum">Ethereum</option>
            <option value="base">Base</option>
            <option value="polygon">Polygon</option>
            <option value="arbitrum">Arbitrum</option>
            <option value="optimism">Optimism</option>
          </select>
        </div>
      ) : (
        <textarea value={sourceCode} onChange={(e) => setSourceCode(e.target.value)} placeholder="// Paste Solidity source code here..." rows={12} className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet/40" />
      )}

      <button onClick={runAudit} disabled={loading || (mode === 'address' ? !address.trim() : !sourceCode.trim())} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-acid via-cyan to-violet px-6 py-3 text-sm font-black text-void shadow-neon disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing with MiMo...</> : <><Shield className="h-4 w-4" /> Run AI Audit</>}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-2xl border border-red-300/20 bg-red-400/10 p-4 text-sm text-red-100">
          {error}
        </div>
      )}

      {/* Report */}
      {report && (
        <div className="mt-6">
          <AuditReportDisplay report={report} />
        </div>
      )}
    </section>
  );
}
```

**Step 3:** Update `app/dashboard/page.tsx` to include AuditScanner

```tsx
// Add import
import { AuditScanner } from '@/components/audit-scanner';

// Add to dashboard layout (alongside ContractScanner)
```

**Step 4:** Commit

```bash
git add components/audit-report.tsx components/audit-scanner.tsx app/dashboard/page.tsx
git commit -m "feat: add AI audit UI with score gauge, findings, and gas optimization display"
```

---

## Phase 6: Landing Page & Polish

### Task 6: Update landing page with Auditor hero

**Objective:** Promote the AI Auditor as the main feature on the landing page.

**Files:**
- Modify: `app/page.tsx`

**Step 1:** Add audit CTA section to landing page with:
- "Powered by Xiaomi MiMo" badge
- Demo audit screenshot/preview
- "Try Free Audit" button → dashboard

**Step 2:** Commit

```bash
git add app/page.tsx
git commit -m "feat: add MiMo Auditor hero section to landing page"
```

---

## Phase 7: Freemium Limits

### Task 7: Add rate limiting for free tier

**Objective:** Free users get 3 audits/day, paid users unlimited. Uses simple in-memory rate limit (upgrade to Redis later).

**Files:**
- Create: `lib/rate-limit.ts`
- Modify: `app/api/audit/route.ts` (add rate check)

**Step 1:** Create `lib/rate-limit.ts`

```typescript
const limits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, maxPerDay = 3): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const key = ip;
  const entry = limits.get(key);

  if (!entry || now > entry.resetAt) {
    limits.set(key, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
    return { allowed: true, remaining: maxPerDay - 1, resetAt: now + 24 * 60 * 60 * 1000 };
  }

  if (entry.count >= maxPerDay) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: maxPerDay - entry.count, resetAt: entry.resetAt };
}
```

**Step 2:** Add to audit route:

```typescript
import { checkRateLimit } from '@/lib/rate-limit';

// In POST handler, before audit:
const ip = req.headers.get('x-forwarded-for') || 'unknown';
const rateCheck = checkRateLimit(ip);
if (!rateCheck.allowed) {
  return NextResponse.json(
    { ok: false, error: 'Free limit reached (3/day). Upgrade for unlimited audits.' },
    { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
  );
}
```

**Step 3:** Commit

```bash
git add lib/rate-limit.ts app/api/audit/route.ts
git commit -m "feat: add freemium rate limiting (3 free audits/day)"
```

---

## Deployment Checklist

- [ ] Set `MIMO_API_KEY` in Vercel env vars
- [ ] Test with real MiMo API key
- [ ] Deploy to Vercel
- [ ] Test audit flow end-to-end
- [ ] Submit to Xiaomi MiMo 100T program with:
  - Live URL
  - Receipt (already done)
  - Project description emphasizing MiMo usage volume

---

## Token Usage Estimate (for MiMo application)

| Action | Est. Tokens | Per User/Day |
|--------|-------------|-------------|
| Single audit | ~8K-15K | 3-10 audits |
| Free tier (3/day) | ~24K-45K | 3 audits |
| Power user | ~80K-150K | 10 audits |
| 100 users avg | ~3M-5M/day | Mixed usage |

**100T tier justified:** 100 active users × 10 audits × 10K tokens = 10M tokens/day = 300M/month
