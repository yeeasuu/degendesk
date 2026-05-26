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
  const bases = ['full_match', 'partial_match'];

  for (const matchType of bases) {
    const url = `https://repo.sourcify.dev/contracts/${matchType}/${chainId}/${address}/metadata.json`;
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) continue;

    const metadata = await res.json();
    if (!metadata?.output?.abi) continue;

    // Extract source code from metadata.sources
    const sourceEntries = Object.entries(metadata.sources || {});
    const mainSource =
      sourceEntries.length > 0
        ? (sourceEntries[0][1] as { content?: string }).content || ''
        : '';

    const contractName =
      metadata?.contractName ||
      (metadata?.settings?.compilationTarget
        ? Object.values(metadata.settings.compilationTarget)[0]
        : 'Unknown');

    return {
      source: mainSource,
      contractName: String(contractName),
      compiler: metadata?.compiler?.version || 'unknown',
      chainId,
      address,
    };
  }

  return null;
}
