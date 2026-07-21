import type { NextRequest } from "next/server";

/**
 * Server-side abuse throttle for the paid `/api/chat` endpoint.
 *
 * The cookie quota is a friendly per-browser UX layer only — it is trivially
 * bypassable (clear cookies -> counters reset). This module adds a *hard* cap
 * that lives on the server and cannot be reset by the client: a per-IP daily
 * ceiling plus a global daily ceiling that short-circuits before we ever call
 * OpenRouter.
 *
 * Storage is in-memory, so on a multi-instance/serverless deployment each
 * instance keeps its own counters (best-effort). For a strict global cap, swap
 * `store` for a shared backend (Upstash Redis / Vercel KV) — the public API of
 * this module is intentionally store-agnostic.
 */

const DEFAULT_IP_PER_DAY = 30;
const DEFAULT_GLOBAL_PER_DAY = 500;
const MAX_TRACKED_IPS = 10_000;

type Bucket = { day: string; count: number };

const ipBuckets = new Map<string, Bucket>();
let globalBucket: Bucket = { day: "", count: 0 };

export type RateLimitConfig = {
  perIpPerDay: number;
  globalPerDay: number;
};

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; scope: "ip" | "global" };

function parseEnvInt(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

export function getRateLimitConfig(): RateLimitConfig {
  return {
    perIpPerDay: parseEnvInt("DIGITAL_TWIN_IP_MAX_PER_DAY", DEFAULT_IP_PER_DAY),
    globalPerDay: parseEnvInt(
      "DIGITAL_TWIN_GLOBAL_MAX_PER_DAY",
      DEFAULT_GLOBAL_PER_DAY,
    ),
  };
}

export function getUtcDayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** Best-effort client IP from proxy headers, falling back to a shared bucket. */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function readBucket(bucket: Bucket | undefined, today: string): Bucket {
  if (!bucket || bucket.day !== today) {
    return { day: today, count: 0 };
  }
  return bucket;
}

function pruneStaleIps(today: string): void {
  if (ipBuckets.size <= MAX_TRACKED_IPS) return;
  for (const [ip, bucket] of ipBuckets) {
    if (bucket.day !== today) {
      ipBuckets.delete(ip);
    }
  }
}

/**
 * Checks the per-IP and global daily ceilings and, when allowed, atomically
 * consumes one unit from each. A ceiling of 0 disables that dimension.
 */
export function checkAndConsumeRateLimit(
  ip: string,
  config: RateLimitConfig = getRateLimitConfig(),
  today: string = getUtcDayKey(),
): RateLimitResult {
  const global = readBucket(globalBucket, today);
  if (config.globalPerDay > 0 && global.count >= config.globalPerDay) {
    globalBucket = global;
    return { allowed: false, scope: "global" };
  }

  const ipBucket = readBucket(ipBuckets.get(ip), today);
  if (config.perIpPerDay > 0 && ipBucket.count >= config.perIpPerDay) {
    ipBuckets.set(ip, ipBucket);
    return { allowed: false, scope: "ip" };
  }

  globalBucket = { day: today, count: global.count + 1 };
  ipBuckets.set(ip, { day: today, count: ipBucket.count + 1 });
  pruneStaleIps(today);

  return { allowed: true };
}

/** Test helper — clears all in-memory counters. */
export function __resetRateLimitStore(): void {
  ipBuckets.clear();
  globalBucket = { day: "", count: 0 };
}
