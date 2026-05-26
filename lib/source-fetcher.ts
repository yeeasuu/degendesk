export type SourceResult = {
  source: string;
  contractName: string;
  compiler: string;
  chainId: number;
  address: string;
};

type SourcifyFile = {
  name: string;
  path: string;
  content: string;
};

export async function fetchSourceCode(
  chainId: number,
  address: string
): Promise<SourceResult | null> {
  // Get metadata first (for contract name + compiler)
  const metaUrl = `https://repo.sourcify.dev/contracts/full_match/${chainId}/${address}/metadata.json`;
  const metaRes = await fetch(metaUrl, { redirect: 'follow' });

  if (!metaRes.ok) {
    // Try partial match
    const partialUrl = `https://repo.sourcify.dev/contracts/partial_match/${chainId}/${address}/metadata.json`;
    const partialRes = await fetch(partialUrl, { redirect: 'follow' });
    if (!partialRes.ok) return null;
  }

  // Get source files
  const filesUrl = `https://sourcify.dev/server/files/${chainId}/${address}`;
  const filesRes = await fetch(filesUrl, { redirect: 'follow' });

  if (!filesRes.ok) return null;

  const files: SourcifyFile[] = await filesRes.json();

  // Find the main contract (longest .sol file is usually the main one,
  // or the one matching compilationTarget)
  const solFiles = files.filter((f) => f.name.endsWith('.sol') && f.content);

  if (solFiles.length === 0) return null;

  // Get metadata for contract name
  let contractName = 'Unknown';
  let compiler = 'unknown';

  if (metaRes.ok) {
    try {
      const meta = await metaRes.json();
      const target = meta?.settings?.compilationTarget;
      if (target) {
        contractName = Object.values(target)[0] as string;
      }
      compiler = meta?.compiler?.version || 'unknown';
    } catch {
      // ignore metadata parse errors
    }
  }

  // Find main contract file by matching compilationTarget path
  let mainFile: SourcifyFile | undefined;

  if (metaRes.ok) {
    try {
      const meta = await metaRes.json();
      const targetPath = Object.keys(meta?.settings?.compilationTarget || {})[0];
      if (targetPath) {
        mainFile = solFiles.find((f) => f.path?.includes(targetPath) || f.name === targetPath.split('/').pop());
      }
    } catch {
      // ignore
    }
  }

  // Fallback: longest file (usually the main contract)
  if (!mainFile) {
    mainFile = solFiles.reduce((a, b) => (a.content.length > b.content.length ? a : b));
  }

  return {
    source: mainFile.content,
    contractName,
    compiler,
    chainId,
    address,
  };
}
