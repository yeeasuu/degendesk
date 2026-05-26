'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Shield,
  Zap,
  Bug,
  Info,
} from 'lucide-react';
import type { AuditReport as AuditReportType, AuditSeverity } from '@/lib/mimo-types';

const SEVERITY_CONFIG: Record<
  AuditSeverity,
  { color: string; bg: string; border: string; icon: typeof Bug }
> = {
  critical: {
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: Bug,
  },
  high: {
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    icon: AlertTriangle,
  },
  medium: {
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: AlertTriangle,
  },
  low: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: Info,
  },
  info: {
    color: 'text-slate-400',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    icon: Info,
  },
};

function ScoreGauge({ score }: { score: number }) {
  const color =
    score >= 80
      ? '#22c55e'
      : score >= 60
        ? '#eab308'
        : score >= 40
          ? '#f97316'
          : '#ef4444';
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${(score / 100) * 251.3} 251.3`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-black text-white">{score}</span>
        </div>
      </div>
      <span className="text-xs uppercase tracking-widest text-slate-500">
        Safety Score
      </span>
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
    (acc, f) => {
      acc[f.severity] = (acc[f.severity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:flex-row md:items-start">
        <ScoreGauge score={report.score} />
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-black text-white">
            {report.contractName}
          </h3>
          <p className="mt-1 text-sm text-slate-400">{report.summary}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
            {(
              ['critical', 'high', 'medium', 'low', 'info'] as AuditSeverity[]
            ).map((sev) =>
              severityCounts[sev] ? (
                <span
                  key={sev}
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${SEVERITY_CONFIG[sev].color} ${SEVERITY_CONFIG[sev].border} ${SEVERITY_CONFIG[sev].bg}`}
                >
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
            <div
              key={i}
              className={`overflow-hidden rounded-xl border ${cfg.border} ${cfg.bg}`}
            >
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${cfg.color}`} />
                <div className="flex-1">
                  <span className={`font-bold ${cfg.color}`}>
                    [{finding.severity.toUpperCase()}]
                  </span>
                  <span className="ml-2 text-white">{finding.title}</span>
                </div>
                <span className="text-xs text-slate-500">
                  {finding.location}
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                )}
              </button>
              {isOpen && (
                <div className="border-t border-white/5 px-4 pb-4 pt-3">
                  <p className="text-sm text-slate-300">
                    {finding.description}
                  </p>
                  <div className="mt-3 rounded-lg bg-black/20 p-3">
                    <span className="text-xs font-bold text-acid">
                      Recommendation:
                    </span>
                    <p className="mt-1 text-sm text-slate-300">
                      {finding.recommendation}
                    </p>
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
          <h4 className="mb-3 flex items-center gap-2 font-bold text-violet">
            <Zap className="h-4 w-4" /> Gas Optimizations
          </h4>
          <ul className="space-y-2 text-sm text-slate-300">
            {report.gasOptimizations.map((opt, i) => (
              <li key={i}>• {opt}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Powered by badge */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <Shield className="h-3.5 w-3.5 text-cyan" />
        <span className="text-xs text-slate-500">
          Audited by MiMo AI • Powered by Xiaomi
        </span>
      </div>
    </div>
  );
}
