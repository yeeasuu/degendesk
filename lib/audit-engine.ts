import { mimoComplete } from './mimo-client';
import type { AuditReport, AuditSeverity } from './mimo-types';

const AUDIT_SYSTEM_PROMPT = `You are a senior smart contract security auditor. Analyze the provided Solidity code for:

1. SECURITY VULNERABILITIES (reentrancy, overflow, access control, frontrunning, flash loan attacks, etc.)
2. GAS OPTIMIZATIONS (storage packing, loop optimization, calldata vs memory, etc.)
3. BEST PRACTICES (OpenZeppelin usage, events, NatSpec, etc.)
4. LOGIC ERRORS (edge cases, failed transfers, incorrect math, etc.)

Respond ONLY with valid JSON (no markdown, no code blocks):
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

function validateSeverity(s: string): AuditSeverity {
  const valid: AuditSeverity[] = ['critical', 'high', 'medium', 'low', 'info'];
  return valid.includes(s as AuditSeverity) ? (s as AuditSeverity) : 'info';
}

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

  // Parse JSON — handle both raw JSON and markdown code blocks
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content);
  } catch {
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[1].trim());
    } else {
      // Try to find JSON object in the text
      const braceMatch = content.match(/\{[\s\S]*\}/);
      if (braceMatch) {
        parsed = JSON.parse(braceMatch[0]);
      } else {
        throw new Error('Failed to parse MiMo audit response as JSON');
      }
    }
  }

  return {
    contractName,
    overallRisk: validateSeverity(String(parsed.overallRisk || 'info')),
    score: Math.min(100, Math.max(0, Number(parsed.score) || 0)),
    findings: Array.isArray(parsed.findings)
      ? parsed.findings.map((f: Record<string, string>) => ({
          severity: validateSeverity(String(f.severity || 'info')),
          title: String(f.title || 'Unknown'),
          description: String(f.description || ''),
          location: String(f.location || 'unknown'),
          recommendation: String(f.recommendation || ''),
        }))
      : [],
    gasOptimizations: Array.isArray(parsed.gasOptimizations)
      ? parsed.gasOptimizations.map(String)
      : [],
    summary: String(parsed.summary || 'No summary provided.'),
  };
}
