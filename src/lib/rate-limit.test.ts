import { describe, expect, it, beforeEach } from "vitest";
import {
  __resetRateLimitStore,
  checkAndConsumeRateLimit,
  getUtcDayKey,
} from "@/lib/rate-limit";

const today = "2026-07-22";

describe("checkAndConsumeRateLimit", () => {
  beforeEach(() => {
    __resetRateLimitStore();
  });

  it("allows requests under the per-IP ceiling", () => {
    const config = { perIpPerDay: 3, globalPerDay: 0 };

    expect(checkAndConsumeRateLimit("1.1.1.1", config, today)).toEqual({
      allowed: true,
    });
    expect(checkAndConsumeRateLimit("1.1.1.1", config, today)).toEqual({
      allowed: true,
    });
  });

  it("blocks once the per-IP ceiling is reached", () => {
    const config = { perIpPerDay: 2, globalPerDay: 0 };

    checkAndConsumeRateLimit("2.2.2.2", config, today);
    checkAndConsumeRateLimit("2.2.2.2", config, today);

    expect(checkAndConsumeRateLimit("2.2.2.2", config, today)).toEqual({
      allowed: false,
      scope: "ip",
    });
  });

  it("tracks IPs independently", () => {
    const config = { perIpPerDay: 1, globalPerDay: 0 };

    expect(checkAndConsumeRateLimit("a", config, today).allowed).toBe(true);
    expect(checkAndConsumeRateLimit("b", config, today).allowed).toBe(true);
    expect(checkAndConsumeRateLimit("a", config, today).allowed).toBe(false);
  });

  it("enforces the global ceiling across IPs", () => {
    const config = { perIpPerDay: 0, globalPerDay: 2 };

    expect(checkAndConsumeRateLimit("a", config, today).allowed).toBe(true);
    expect(checkAndConsumeRateLimit("b", config, today).allowed).toBe(true);
    expect(checkAndConsumeRateLimit("c", config, today)).toEqual({
      allowed: false,
      scope: "global",
    });
  });

  it("resets counters when the day rolls over", () => {
    const config = { perIpPerDay: 1, globalPerDay: 0 };

    expect(checkAndConsumeRateLimit("x", config, "2026-07-22").allowed).toBe(true);
    expect(checkAndConsumeRateLimit("x", config, "2026-07-22").allowed).toBe(false);
    expect(checkAndConsumeRateLimit("x", config, "2026-07-23").allowed).toBe(true);
  });

  it("treats a ceiling of 0 as disabled", () => {
    const config = { perIpPerDay: 0, globalPerDay: 0 };

    for (let i = 0; i < 100; i += 1) {
      expect(checkAndConsumeRateLimit("z", config, today).allowed).toBe(true);
    }
  });
});

describe("getUtcDayKey", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(getUtcDayKey(new Date("2026-07-22T15:30:00Z"))).toBe("2026-07-22");
  });
});
