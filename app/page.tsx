import {
  Activity,
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Flame,
  Gauge,
  GitBranch,
  LineChart,
  Radar,
  RadioTower,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Terminal,
  Wallet,
  Zap,
} from 'lucide-react';

const features = [
  { tag: 'AI AUDIT', title: 'MiMo Contract Auditor', copy: 'AI-powered deep smart contract analysis. Detects reentrancy, overflow, access control flaws, gas waste, and logic errors — powered by Xiaomi MiMo.', icon: ShieldCheck },
  { tag: 'MINT', title: 'Mint Hunter', copy: 'Track live drops, decode mint functions, simulate calls, and choose gas by network pressure.', icon: Flame },
  { tag: 'AIRDROP', title: 'Airdrop Tracker', copy: 'Watch quests, claims, eligibility windows, and recurring wallet actions from one board.', icon: Radar },
  { tag: 'WALLET', title: 'Wallet Ops', copy: 'Balances, approvals, tx history, safe sends, and agent-wallet execution with gas sanity checks.', icon: Wallet },
  { tag: 'SCAN', title: 'Contract Scanner', copy: 'ABI/source lookup, risky approvals, freemint checks, owner controls, and revert previews.', icon: ScanSearch },
  { tag: 'GAS', title: 'Gas Strategy', copy: 'Normal for routine ops, aggressive for FCFS mints, and warnings when costs stop making sense.', icon: Gauge },
  { tag: 'TELEGRAM', title: 'Telegram Commander', copy: 'Run checks, receive tx recaps, and control automation from chat without opening ten tabs.', icon: RadioTower },
];

const pipeline = [
  ['01 / DETECT', 'Find opportunity', 'Signals from links, watchlists, mint pages, token feeds, or Telegram commands.'],
  ['02 / ANALYZE', 'Read the system', 'Inspect frontend, API, ABI, supply, eligibility, price, approvals, and network state.'],
  ['03 / SIMULATE', 'Dry-run first', 'Estimate gas, preview revert reasons, separate freemint gas from unexpected payment.'],
  ['04 / EXECUTE', 'Send with intent', 'Use direct contract/RPC when possible; MetaMask-style UI only when forced.'],
  ['05 / REPORT', 'Recap cleanly', 'Return tx hash, gas used, status, risk notes, and next action.'],
];

const prompts = [
  'check if this NFT mint is gas-only',
  'scan 0x contract for risky approvals',
  'watch Base gas and ping when cheap',
  'prepare wallet for FCFS mint',
  'summarize today\'s airdrop tasks',
  'decode calldata before signing',
];

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan">{children}</span>;
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-grid-glow text-slate-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl border border-acid/30 bg-acid/10 shadow-acid">
            <Terminal className="h-5 w-5 text-acid" />
          </span>
          <span className="text-lg font-black tracking-tight">DegenDesk</span>
          <span className="rounded-full border border-violet/30 bg-violet/10 px-2 py-0.5 text-xs text-violet">MVP</span>
        </a>
        <div className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
          <a href="#pipeline" className="hover:text-white">Pipeline</a>
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#dashboard" className="hover:text-white">Console</a>
          <a href="/dashboard" className="rounded-full bg-white px-4 py-2 font-bold text-void hover:bg-acid">Launch Desk</a>
        </div>
      </nav>

      <section id="top" className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
        <div>
          <div className="mb-8 flex flex-wrap gap-3">
            <Badge>AI WEB3 OPS</Badge>
            <Badge>AGENT READY</Badge>
            <Badge>POWERED BY XIAOMI MIMO</Badge>
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.055em] text-white md:text-7xl lg:text-[5.7rem]">
            The degen command desk for mints, wallets, and on-chain ops.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            DegenDesk is a tactical AI console for airdrops, NFT mints, wallet workflows, contract checks, and gas-aware execution. Built around one rule: inspect first, simulate next, execute only when it makes sense.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="/dashboard" className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-acid via-cyan to-violet px-6 py-4 font-black text-void shadow-neon">
              Open Console <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a href="#features" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-4 font-bold text-white hover:bg-white/[0.08]">
              See Features
            </a>
          </div>
          <div className="mt-10 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ['6', 'Core modules'],
              ['5', 'Safety stages'],
              ['3+', 'Chains ready'],
              ['24/7', 'Telegram ops'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                <div className="text-3xl font-black text-white">{value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div id="dashboard" className="relative">
          <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-acid/20 via-cyan/10 to-violet/20 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-[#080d1c]/90 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-acid/10"><Bot className="h-5 w-5 text-acid" /></span>
                <div>
                  <div className="text-sm font-black">VERA · OPS AGENT</div>
                  <div className="text-xs text-slate-400">network-aware · gas-aware · wallet-safe</div>
                </div>
              </div>
              <span className="flex items-center gap-2 rounded-full border border-acid/30 px-3 py-1 text-xs font-bold text-acid"><span className="h-2 w-2 rounded-full bg-acid" />LIVE</span>
            </div>

            <div className="space-y-3">
              {prompts.slice(0, 4).map((prompt) => (
                <button key={prompt} className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-left text-sm text-slate-300 hover:border-cyan/40 hover:text-white">
                  <span className="text-cyan">›</span> {prompt}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-cyan/20 bg-cyan/5 p-4 font-mono text-xs leading-6 text-slate-300">
              <div className="text-acid">$ degendesk inspect mint-link --wallet agent</div>
              <div>→ source: frontend + ABI + RPC</div>
              <div>→ freemint: gas-only expected</div>
              <div>→ network: congested · priority gas recommended</div>
              <div className="text-violet">→ status: ready for operator instruction</div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                ['Gas', 'fast'],
                ['Risk', 'medium'],
                ['Mode', 'direct RPC'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="text-xs text-slate-500">{k}</div>
                  <div className="mt-1 font-black text-white">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-y border-white/10 bg-white/[0.03] py-4 text-sm text-slate-300">
        <div className="mx-auto flex max-w-7xl gap-8 overflow-hidden px-6 font-mono">
          {[...prompts, ...prompts].map((p, i) => <span key={`${p}-${i}`} className="shrink-0"><span className="text-acid">›</span> {p}</span>)}
        </div>
      </div>

      <section id="pipeline" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 max-w-3xl">
          <Badge>OPERATING LOOP</Badge>
          <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white md:text-6xl">Detect → Analyze → Simulate → Execute → Report.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">Same shape for every wallet action, mint, airdrop task, scanner request, and Telegram command.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-5">
          {pipeline.map(([step, title, copy]) => (
            <div key={step} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur hover:border-cyan/30">
              <div className="mb-8 flex items-center justify-between text-xs font-black tracking-[0.18em] text-cyan">
                {step}
                <CheckCircle2 className="h-4 w-4 text-acid" />
              </div>
              <h3 className="text-xl font-black text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Badge>MODULES</Badge>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white md:text-6xl">Six surfaces. One Vera core.</h2>
          </div>
          <p className="max-w-xl text-slate-300">The MVP starts visual-first. Then each card becomes a live tool: RPC reads, API scans, gas estimates, notifications, and agent-wallet execution.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ tag, title, copy, icon: Icon }) => (
            <article key={title} className="group rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-acid/40 hover:bg-white/[0.06]">
              <div className="mb-8 flex items-center justify-between">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black tracking-[0.18em] text-slate-400">{tag}</span>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan/10 text-cyan group-hover:bg-acid/10 group-hover:text-acid"><Icon className="h-5 w-5" /></span>
              </div>
              <h3 className="text-2xl font-black text-white">{title}</h3>
              <p className="mt-3 leading-7 text-slate-400">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="mimo" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[2.5rem] border border-cyan/20 bg-gradient-to-br from-cyan/5 to-violet/5 p-8 md:p-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge>NEW · AI POWERED</Badge>
              <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">Smart Contract Auditing, Powered by MiMo</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">Paste any contract address or Solidity source code. MiMo AI analyzes for vulnerabilities, gas optimization opportunities, and security best practices — then generates a detailed audit report with severity scores.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {['Reentrancy detection', 'Access control', 'Gas optimization', 'Logic errors', 'Best practices'].map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-slate-300">{tag}</span>
                ))}
              </div>
              <a href="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan to-violet px-6 py-3 font-black text-void shadow-neon">
                Try Free Audit <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#080d1c]/90 p-6 font-mono text-sm">
              <div className="mb-4 text-xs text-slate-500">audit-report.sol</div>
              <div className="space-y-2 text-slate-300">
                <div><span className="text-acid font-bold">Score:</span> <span className="text-white font-black">72/100</span></div>
                <div><span className="text-red-400 font-bold">[CRITICAL]</span> Reentrancy in withdraw()</div>
                <div><span className="text-orange-400 font-bold">[HIGH]</span> Missing access control on setPrice()</div>
                <div><span className="text-yellow-400 font-bold">[MEDIUM]</span> Unchecked return value</div>
                <div><span className="text-blue-400 font-bold">[LOW]</span> Solidity version outdated</div>
                <div className="border-t border-white/10 pt-3 mt-3">
                  <span className="text-violet font-bold">⚡ Gas:</span> Use calldata instead of memory for read-only params
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan" />
                Powered by Xiaomi MiMo
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="launch" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-8 text-center shadow-neon md:p-14">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-3xl bg-acid/10 text-acid"><Sparkles className="h-8 w-8" /></div>
          <h2 className="text-4xl font-black tracking-[-0.04em] text-white md:text-6xl">DegenDesk starts as a console. Then it becomes the operator.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">Next step: wire live token data, contract explainers, wallet read-only checks, and Telegram alerts — one module at a time.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-bold text-slate-300">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-acid" /> freemint safety</span>
            <span className="inline-flex items-center gap-2"><Zap className="h-4 w-4 text-cyan" /> aggressive gas when needed</span>
            <span className="inline-flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-violet" /> AI-assisted ops</span>
            <span className="inline-flex items-center gap-2"><LineChart className="h-4 w-4 text-acid" /> live alpha feeds</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-sm text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-acid" /> DegenDesk MVP · built with Vera</div>
          <div className="flex gap-5"><span>Next.js</span><span>Tailwind</span><span>Web3 Ops</span><GitBranch className="h-4 w-4" /></div>
        </div>
      </footer>
    </main>
  );
}
