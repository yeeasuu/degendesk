const limits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  ip: string,
  maxPerDay = 3
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = limits.get(ip);

  if (!entry || now > entry.resetAt) {
    limits.set(ip, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
    return {
      allowed: true,
      remaining: maxPerDay - 1,
      resetAt: now + 24 * 60 * 60 * 1000,
    };
  }

  if (entry.count >= maxPerDay) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: maxPerDay - entry.count, resetAt: entry.resetAt };
}
