import { NextRequest, NextResponse } from 'next/server';
import { fetchSourceCode } from '@/lib/source-fetcher';
import { auditContract } from '@/lib/audit-engine';
import { checkRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 120; // MiMo analysis can take time

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

const CHAINS: Record<string, number> = {
  ethereum: 1,
  eth: 1,
  '1': 1,
  base: 8453,
  '8453': 8453,
  polygon: 137,
  '137': 137,
  arbitrum: 42161,
  '42161': 42161,
  optimism: 10,
  '10': 10,
};

export async function POST(req: NextRequest) {
  try {
    // Rate limiting (3 free audits/day per IP)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { ok: false, error: 'Free limit reached (3/day). Upgrade for unlimited audits.' },
        { status: 429, headers: { 'X-RateLimit-Remaining': '0', 'X-RateLimit-Reset': String(rateCheck.resetAt) } }
      );
    }

    const body = await req.json();
    const { source: rawSource, address: rawAddress, chain: rawChain } = body;

    // Mode 1: Direct source code upload
    if (rawSource && typeof rawSource === 'string' && rawSource.trim().length > 0) {
      const report = await auditContract(rawSource, body.contractName || 'Uploaded Contract');
      return NextResponse.json({ ok: true, report, mode: 'source' });
    }

    // Mode 2: On-chain address
    const address = String(rawAddress || '').match(ADDRESS_RE)?.[0];
    const chainId = CHAINS[String(rawChain || 'ethereum').toLowerCase()] || 1;

    if (!address) {
      return NextResponse.json(
        { ok: false, error: 'Provide a valid contract address or Solidity source code.' },
        { status: 400 }
      );
    }

    const sourceResult = await fetchSourceCode(chainId, address);
    if (!sourceResult) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Verified source not found on Sourcify. Contract may not be verified on this chain.',
        },
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
    console.error('[AUDIT ERROR]', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Audit failed' },
      { status: 500 }
    );
  }
}
