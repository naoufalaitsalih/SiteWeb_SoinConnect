const BLOCKED_KEY_PATTERN =
  /password|passwd|pwd|secret|token|card|cvv|cvc|iban|description|fullName|fullname|phone|email|address|medical|diagnosis|symptom/i;

const MAX_METADATA_BYTES = 2048;

function isBlockedKey(key: string): boolean {
  return BLOCKED_KEY_PATTERN.test(key);
}

function sanitizeValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;

  if (typeof value === "string") {
    return value.length > 200 ? `${value.slice(0, 200)}…` : value;
  }

  if (Array.isArray(value)) {
    return value.slice(0, 20).map(sanitizeValue);
  }

  if (typeof value === "object") {
    return sanitizeMetadata(value as Record<string, unknown>);
  }

  return value;
}

export function sanitizeMetadata(
  metadata?: Record<string, unknown> | null
): Record<string, unknown> | undefined {
  if (!metadata || typeof metadata !== "object") return undefined;

  const clean: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (isBlockedKey(key)) continue;
    clean[key] = sanitizeValue(value);
  }

  const serialized = JSON.stringify(clean);
  if (serialized.length > MAX_METADATA_BYTES) {
    return { truncated: true, size: serialized.length };
  }

  return Object.keys(clean).length > 0 ? clean : undefined;
}
