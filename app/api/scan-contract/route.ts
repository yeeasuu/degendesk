import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const CHAINS: Record<string, { id: number; label: string }> = {
  ethereum: { id: 1, label: 'Ethereum' },
  eth: { id: 1, label: 'Ethereum' },
  '1': { id: 1, label: 'Ethereum' },
  base: { id: 8453, label: 'Base' },
  '8453': { id: 8453, label: 'Base' },
  polygon: { id: 137, label: 'Polygon' },
  '137': { id: 137, label: 'Polygon' },
  arbitrum: { id: 42161, label: 'Arbitrum' },
  '42161': { id: 42161, label: 'Arbitrum' },
  optimism: { id: 10, label: 'Optimism' },
  '10': { id: 10, label: 'Optimism' },
};

type AbiInput = { name?: string; type?: string; internalType?: string };
type AbiItem = {
  type: string;
  name?: string;
  stateMutability?: string;
  payable?: boolean;
  inputs?: AbiInput[];
  outputs?: AbiInput[];
};

function extractAddress(raw: string) {
  const match = raw.match(/0x[a-fA-F0-9]{40}/);
  return match?.[0] ?? '';
}

function normalizeChain(raw: string | null) {
  const key = (raw || 'ethereum').toLowerCase().trim();
  return CHAINS[key] || CHAINS.ethereum;
}

function signature(fn: AbiItem) {
  const args = (fn.inputs || []).map((i) => i.type || 'unknown').join(',');
  return `${fn.name || 'anonymous'}(${args})`;
}

function classifyFunction(fn: AbiItem) {
  const name = (fn.name || '').toLowerCase();
  const sig = signature(fn).toLowerCase();
  if (/free.?mint|mintfree/.test(name) || /free.?mint/.test(sig)) return 'freemint';
  if (/mint|claim|redeem|forge|open|buy|purchase/.test(name)) return 'mint/claim';
  if (/approve|setapprovalforall|permit/.test(name)) return 'approval';
  if (/withdraw|sweep|setowner|transferownership|pause|unpause|setbaseuri|setprice|setcost|setmax|setmerkle|setroot/.test(name)) return 'admin/risk';
  return 'other';
}

function riskNotes(functions: AbiItem[]) {
  const notes: string[] = [];
  const hasFreeMint = functions.some((fn) => classifyFunction(fn) === 'freemint');
  const payableMint = functions.some((fn) => classifyFunction(fn) === 'mint/claim' && (fn.stateMutability === 'payable' || fn.payable));
  const approvals = functions.filter((fn) => classifyFunction(fn) === 'approval');
  const admin = functions.filter((fn) => classifyFunction(fn) === 'admin/risk');

  if (hasFreeMint) notes.push('Free mint-like function detected. Treat as gas-only unless simulation shows payment/value required.');
  if (payableMint) notes.push('Payable mint/claim function detected. Check price/value before sending any transaction.');
  if (approvals.length) notes.push('Approval/permit function exists. Avoid signing approvals unless target/spender/value is verified.');
  if (admin.length) notes.push('Admin/risk functions exist. Review owner controls, pause, pricing, withdraw, and metadata controls.');
  if (!hasFreeMint && !payableMint) notes.push('No obvious public mint/freeMint function found in verified ABI. It may be hidden behind backend calldata or another contract.');
  return notes;
}

async function fetchSourcifyAbi(chainId: number, address: string) {
  const bases = ['full_match', 'partial_match'];
  for (const matchType of bases) {
    const url = `https://repo.sourcify.dev/contracts/${matchType}/${chainId}/${address}/metadata.json`;
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) continue;
    const metadata = await res.json();
    const abi = metadata?.output?.abi;
    if (Array.isArray(abi)) {
      return { abi: abi as AbiItem[], source: `Sourcify ${matchType}`, contractName: metadata?.settings?.compilationTarget ? Object.values(metadata.settings.compilationTarget)[0] : metadata?.contractName };
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const target = String(body.target || '');
    const address = extractAddress(target);
    const chain = normalizeChain(String(body.chain || 'ethereum'));

    if (!ADDRESS_RE.test(address)) {
      return NextResponse.json({ ok: false, error: 'Enter a valid contract address or URL containing 0x address.' }, { status: 400 });
    }

    const found = await fetchSourcifyAbi(chain.id, address);
    if (!found) {
      return NextResponse.json({
        ok: false,
        address,
        chain,
        error: 'Verified ABI not found on Sourcify for this chain/address. Try another chain or add Etherscan API fallback later.',
      }, { status: 404 });
    }

    const writeFunctions = found.abi
      .filter((item) => item.type === 'function' && item.stateMutability !== 'view' && item.stateMutability !== 'pure')
      .map((fn) => ({
        name: fn.name || 'anonymous',
        signature: signature(fn),
        stateMutability: fn.stateMutability || (fn.payable ? 'payable' : 'nonpayable'),
        category: classifyFunction(fn),
        inputs: fn.inputs || [],
      }))
      .sort((a, b) => {
        const order: Record<string, number> = { freemint: 0, 'mint/claim': 1, approval: 2, 'admin/risk': 3, other: 4 };
        return order[a.category] - order[b.category] || a.signature.localeCompare(b.signature);
      });

    const readFunctions = found.abi
      .filter((item) => item.type === 'function' && (item.stateMutability === 'view' || item.stateMutability === 'pure'))
      .map((fn) => signature(fn))
      .filter((sig) => /supply|price|cost|max|mint|sale|owner|paused|balance|allowlist|merkle|free/i.test(sig))
      .slice(0, 16);

    return NextResponse.json({
      ok: true,
      address,
      chain,
      source: found.source,
      contractName: found.contractName || 'Unknown contract',
      counts: {
        totalAbiItems: found.abi.length,
        writeFunctions: writeFunctions.length,
        interestingReads: readFunctions.length,
      },
      writeFunctions,
      interestingReads: readFunctions,
      riskNotes: riskNotes(found.abi.filter((item) => item.type === 'function')),
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Unknown scanner error' }, { status: 500 });
  }
}
