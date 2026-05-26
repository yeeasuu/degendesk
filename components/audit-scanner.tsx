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
      const body =
        mode === 'address'
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

  const canSubmit =
    !loading && (mode === 'address' ? address.trim().length > 0 : sourceCode.trim().length > 0);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#080d1c]/80 p-5 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-full border border-acid/20 bg-acid/10 p-2">
          <Shield className="h-5 w-5 text-acid" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">
            AI Contract Auditor
          </h2>
          <p className="text-sm text-slate-400">
            MiMo-powered deep analysis — vulnerabilities, gas, best practices
          </p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setMode('address')}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
            mode === 'address'
              ? 'bg-cyan/20 text-cyan'
              : 'bg-white/5 text-slate-500 hover:bg-white/10'
          }`}
        >
          <Link2 className="h-4 w-4" /> On-chain Address
        </button>
        <button
          onClick={() => setMode('source')}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
            mode === 'source'
              ? 'bg-violet/20 text-violet'
              : 'bg-white/5 text-slate-500 hover:bg-white/10'
          }`}
        >
          <Upload className="h-4 w-4" /> Paste Source Code
        </button>
      </div>

      {/* Input */}
      {mode === 'address' ? (
        <div className="grid gap-3 md:grid-cols-[1fr_160px]">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x... contract address"
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan/40"
          />
          <select
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            className="rounded-2xl border border-white/10 bg-[#10172a] px-4 py-3 text-sm text-white outline-none focus:border-cyan/40"
          >
            <option value="ethereum">Ethereum</option>
            <option value="base">Base</option>
            <option value="polygon">Polygon</option>
            <option value="arbitrum">Arbitrum</option>
            <option value="optimism">Optimism</option>
          </select>
        </div>
      ) : (
        <textarea
          value={sourceCode}
          onChange={(e) => setSourceCode(e.target.value)}
          placeholder="// Paste Solidity source code here..."
          rows={12}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet/40"
        />
      )}

      {/* Submit */}
      <button
        onClick={runAudit}
        disabled={!canSubmit}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-acid via-cyan to-violet px-6 py-3 text-sm font-black text-void shadow-neon disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Analyzing with
            MiMo...
          </>
        ) : (
          <>
            <Shield className="h-4 w-4" /> Run AI Audit
          </>
        )}
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
