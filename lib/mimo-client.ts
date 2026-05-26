import type { MimoCompletionRequest, MimoCompletionResponse } from './mimo-types';

const MIMO_API_BASE = process.env.MIMO_API_BASE || 'https://api.mimo.xiaomi.com/v1';
const MIMO_API_KEY = process.env.MIMO_API_KEY || '';

export async function mimoComplete(
  messages: MimoCompletionRequest['messages'],
  options?: { model?: string; temperature?: number; max_tokens?: number }
): Promise<MimoCompletionResponse> {
  if (!MIMO_API_KEY) {
    throw new Error('MIMO_API_KEY not configured. Add it to .env.local');
  }

  const body: MimoCompletionRequest = {
    model: options?.model || 'mimo-v2.5-pro',
    messages,
    temperature: options?.temperature ?? 0.3,
    max_tokens: options?.max_tokens ?? 4096,
    stream: false,
  };

  const res = await fetch(`${MIMO_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MIMO_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`MiMo API error ${res.status}: ${err}`);
  }

  return res.json();
}
