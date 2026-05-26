import { ContractScanner } from '@/components/contract-scanner';
import { AuditScanner } from '@/components/audit-scanner';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock3,
  Flame,
  Gauge,
  Home,
  RadioTower,
  ScanSearch,
  Send,
  ShieldCheck,
  Terminal,
  Wallet,
  Zap,
} from 'lucide-react';

const modules = [
  { name: 'Mint Hunter', status: 'armed', icon: Flame, color: 'text-acid' },
  { name: 'Contract Scanner', status: 'ready', icon: ScanSearch, color: 'text-cyan' },
  { name: 'Wallet Ops', status: 'safe mode', icon: Wallet, color: 'text-violet' },
  { name: 'Gas Strategy', status: 'fast', icon: Gauge, color: 'text-acid' },
  { name: 'Telegram Commander', status: 'linked', icon: RadioTower, color: 'text-cyan' },
];

const queue = [
  ['Free mint watch', 'Cappuccino-style ERC721 monitor', 'waiting for live signal', 'medium'],
  ['Base gas check', 'Ping when priority fee cools down', 'running every 2m', 'low'],
  ['Approval sweep', 'Find unlimited approvals on burner', 'read-only', 'high'],
  ['Airdrop route', 'Daily claim / mission board', 'draft', 'low'],
];

const logs = [
  'agent booted · profile: degen operator',
  'loaded policy · freemint = gas-only unless approved',
  'gas strategy · network-aware default',
  'wallet mode · local agent wallet protected',
  'next action · wire live contract scanner',
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-grid-glow text-slate-100">
      <div className="mx-auto grid max-w-[1500px] gap-5 px-5 py-5 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-[2rem] border border-white/10 bg-[#080d1c]/90 p-5 backdrop-blur-xl lg:min-h-[calc(100vh-40px)]">
          <a href="/" className="mb-8 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-acid/30 bg-acid/10 shadow-acid">
              <Terminal className="h-5 w-5 text-acid" />
            </span>
            <div>
              <div className="font-black tracking-tight text-white">DegenDesk</div>
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">operator console</div>
            </div>
          </a>

          <nav className="space-y-2 text-sm">
            {[
              ['Command Center', Home],
              ['Mint Hunter', Flame],
              ['Contract Scanner', ScanSearch],
              ['AI Auditor', ShieldCheck],
              ['Wallet Ops', Wallet],
              ['Gas Strategy', Gauge],
              ['Telegram Commander', RadioTower],
            ].map(([label, Icon]) => (
              <a key={label as string} href="#" className="flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-slate-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-white">
                <Icon className="h-4 w-4" /> {label as string}
              </a>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl border border-acid/20 bg-acid/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-black text-acid"><ShieldCheck className="h-4 w-4" /> Safety Rules</div>
            <ul className="space-y-2 text-xs leading-5 text-slate-400">
              <li>• Inspect source/API/ABI first</li>
              <li>• Simulate before transaction</li>
              <li>• Freemint means gas-only</li>
              <li>• Gas follows network context</li>
            </ul>
          </div>
        </aside>

        <section className="space-y-5">
          <header className="flex flex-col justify-between gap-4 rounded-[2rem] border border-white/10 bg-[#080d1c]/80 p-5 backdrop-blur-xl md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.22em] text-cyan">
                <span>LIVE MVP</span><span>·</span><span>Vera Core</span><span>·</span><span>Web3 Ops</span>
              </div>
              <h1 className="text-3xl font-black tracking-[-0.04em] text-white md:text-5xl">Command Center</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white hover:bg-white/[0.08]">Import Mint Link</button>
              <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-acid via-cyan to-violet px-5 py-3 text-sm font-black text-void shadow-neon">
                Run Scan <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  ['Active modules', '5', Activity, 'text-cyan'],
                  ['Gas mode', 'fast', Zap, 'text-acid'],
                  ['Risk queue', '1 high', AlertTriangle, 'text-violet'],
                  ['Wallet status', 'safe', Wallet, 'text-acid'],
                ].map(([label, value, Icon, color]) => (
                  <div key={label as string} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                    <div className={`mb-5 ${color as string}`}><Icon className="h-5 w-5" /></div>
                    <div className="text-2xl font-black text-white">{value as string}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{label as string}</div>
                  </div>
                ))}
              </div>

              <ContractScanner />

              <AuditScanner />

              <div className="rounded-[2rem] border border-white/10 bg-[#080d1c]/80 p-5 backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white">Ops Queue</h2>
                    <p className="text-sm text-slate-400">Planned actions before live integrations.</p>
                  </div>
                  <span className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs font-bold text-cyan">read-only MVP</span>
                </div>
                <div className="space-y-3">
                  {queue.map(([title, desc, status, risk]) => (
                    <div key={title} className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                      <div>
                        <div className="font-black text-white">{title}</div>
                        <div className="mt-1 text-sm text-slate-400">{desc}</div>
                      </div>
                      <div className="inline-flex items-center gap-2 text-sm text-slate-300"><Clock3 className="h-4 w-4 text-cyan" /> {status}</div>
                      <div className={`rounded-full px-3 py-1 text-xs font-black ${risk === 'high' ? 'bg-violet/15 text-violet' : risk === 'medium' ? 'bg-cyan/10 text-cyan' : 'bg-acid/10 text-acid'}`}>{risk}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-[2rem] border border-white/10 bg-[#080d1c]/80 p-5 backdrop-blur-xl">
                  <h2 className="mb-5 text-2xl font-black text-white">Module Status</h2>
                  <div className="space-y-3">
                    {modules.map(({ name, status, icon: Icon, color }) => (
                      <div key={name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
                        <div className="flex items-center gap-3"><Icon className={`h-4 w-4 ${color}`} /><span className="font-bold text-white">{name}</span></div>
                        <span className="text-xs uppercase tracking-[0.16em] text-slate-500">{status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-[#080d1c]/80 p-5 backdrop-blur-xl">
                  <h2 className="mb-5 text-2xl font-black text-white">Execution Gates</h2>
                  <div className="space-y-4">
                    {['Verify target', 'Simulate tx', 'Estimate gas', 'Operator intent', 'Broadcast + confirm'].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                        <CheckCircle2 className="h-5 w-5 text-acid" /> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-[2rem] border border-white/10 bg-[#080d1c]/90 p-5 shadow-2xl backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-acid/10"><Bot className="h-5 w-5 text-acid" /></span>
                  <div>
                    <div className="font-black text-white">Vera Ops Agent</div>
                    <div className="text-xs text-slate-500">mock terminal · next: live tools</div>
                  </div>
                </div>
                <div className="rounded-2xl border border-cyan/20 bg-cyan/5 p-4 font-mono text-xs leading-6 text-slate-300">
                  {logs.map((log) => <div key={log}><span className="text-acid">›</span> {log}</div>)}
                </div>
                <div className="mt-4 flex gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
                  <input className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-600" placeholder="Ask Vera to inspect a link..." />
                  <button className="grid h-10 w-10 place-items-center rounded-xl bg-acid text-void"><Send className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-[#080d1c]/80 p-5 backdrop-blur-xl">
                <h2 className="text-2xl font-black text-white">Next Build Steps</h2>
                <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
                  <li><span className="text-cyan">01.</span> DexScreener token search</li>
                  <li><span className="text-cyan">02.</span> Contract ABI/Sourcify scanner</li>
                  <li><span className="text-cyan">03.</span> Wallet read-only balances</li>
                  <li><span className="text-cyan">04.</span> Telegram alert hooks</li>
                  <li><span className="text-cyan">05.</span> Agent-wallet execution layer</li>
                </ol>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
