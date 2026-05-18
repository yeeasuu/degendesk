'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, ScanSearch } from 'lucide-react';

type ScanFunction = {
  name: string;
  signature: string;
  stateMutability: string;
  category: string;
};

type ScanResult = {
  ok: boolean;
  error?: string;
  address?: string;
  chain?: { id: number; label: string };
  source?: string;
  contractName?: string;
  counts?: { totalAbiItems: number; writeFunctions: number; interestingReads: number };
  writeFunctions?: ScanFunction[];
  interestingReads?: string[];
  riskNotes?: string[];
};

const CATEGORY_STYLES: Record<string, string> = {
  freemint: 'border-acid/30 bg-acid/10 text-acid',
  'mint/claim': 'border-cyan/30 bg-cyan/10 text-cyan',
  approval: 'border-violet/30 bg-violet/10 text-violet',
  'admin/risk': 'border-red-300/30 bg-red-400/10 text-red-200',
  other: 'border-white/10 bg-white/[0.04] text-slate-300',
};

export function ContractScanner() {
  const [target, setTarget] = useState('0x0e74363bba068f2a9ce31aa035a0610b020ab41a');
  const [chain, setChain] = useState('ethereum');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const topFunctions = useMemo(() => result?.writeFunctions?.slice(0, 10) || [], [result]);

  async function scan() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/scan-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, chain }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ ok: false, error: error instanceof Error ? error.message : 'Unknown request error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#080d1c]/80 p-5 backdrop-blur-xl">
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-cyan">
            <ScanSearch className="h-3.5 w-3.5" /> Live Tool
          </div>
          <h2 className="text-2xl font-black text-white">Contract / Mint Scanner</h2>
          <p className="mt-1 text-sm text-slate-400">Sourcify ABI lookup for mint, freemint, approval, and admin-risk functions.</p>
        </div>
        <button onClick={scan} disabled={loading || !target.trim()} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-acid via-cyan to-violet px-5 py-3 text-sm font-black text-void shadow-neon disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />}
          {loading ? 'Scanning...' : 'Run Scanner'}
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_180px]">
        <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Paste contract address or Etherscan/OpenSea/mint URL" className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan/40" />
        <select value={chain} onChange={(e) => setChain(e.target.value)} className="rounded-2xl border border-white/10 bg-[#10172a] px-4 py-3 text-sm text-white outline-none focus:border-cyan/40">
          <option value="ethereum">Ethereum</option>
          <option value="base">Base</option>
          <option value="polygon">Polygon</option>
          <option value="arbitrum">Arbitrum</option>
          <option value="optimism">Optimism</option>
        </select>
      </div>

      {result && (
        <div className="mt-5 space-y-4">
          {!result.ok ? (
            <div className="rounded-2xl border border-red-300/20 bg-red-400/10 p-4 text-sm text-red-100">
              <div className="mb-1 flex items-center gap-2 font-black"><AlertTriangle className="h-4 w-4" /> Scanner error</div>
              {result.error}
            </div>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-4">
                {[
                  ['Contract', result.contractName || 'Unknown'],
                  ['Chain', result.chain?.label || chain],
                  ['Source', result.source || 'Sourcify'],
                  ['Write funcs', String(result.counts?.writeFunctions ?? 0)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
                    <div className="mt-2 truncate font-black text-white" title={value}>{value}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="mb-3 flex items-center gap-2 font-black text-white"><CheckCircle2 className="h-4 w-4 text-acid" /> Risk Notes</div>
                <ul className="space-y-2 text-sm leading-6 text-slate-300">
                  {result.riskNotes?.map((note) => <li key={note}>• {note}</li>)}
                </ul>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <h3 className="mb-3 font-black text-white">Interesting Write Functions</h3>
                  <div className="space-y-2">
                    {topFunctions.map((fn) => (
                      <div key={fn.signature} className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#050712]/60 p-3 md:flex-row md:items-center md:justify-between">
                        <code className="text-xs text-slate-200">{fn.signature}</code>
                        <span className={`w-fit rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${CATEGORY_STYLES[fn.category] || CATEGORY_STYLES.other}`}>{fn.category}</span>
                      </div>
                    ))}
                    {!topFunctions.length && <div className="text-sm text-slate-500">No write functions found in ABI.</div>}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <h3 className="mb-3 font-black text-white">Useful Read Functions</h3>
                  <div className="space-y-2">
                    {result.interestingReads?.slice(0, 10).map((sig) => <code key={sig} className="block rounded-xl bg-[#050712]/60 px-3 py-2 text-xs text-slate-300">{sig}</code>)}
                    {!result.interestingReads?.length && <div className="text-sm text-slate-500">No obvious supply/price/owner read functions found.</div>}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
