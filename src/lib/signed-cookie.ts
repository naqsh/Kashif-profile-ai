import { createHmac, timingSafeEqual } from "crypto";

/**
 * Shared HMAC-signed cookie helpers used by the quota and chatbase-mirror
 * modules. Centralising this logic keeps the signing scheme (and its secret)
 * in a single place so security fixes cannot drift between call sites.
 */

const DEV_FALLBACK_SECRET = "digital-twin-quota-dev-secret";

/**
 * Returns the HMAC secret for signing cookies.
 *
 * A dedicated `DIGITAL_TWIN_QUOTA_SECRET` is required. In production a missing
 * secret is a hard error (throwing rather than silently signing with a public
 * constant, which would make forgery trivial). Outside production we fall back
 * to a clearly-labelled dev secret and warn, so local/test runs stay friction
 * free.
 */
export function getCookieSigningSecret(): string {
  const secret = process.env.DIGITAL_TWIN_QUOTA_SECRET?.trim();
  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "DIGITAL_TWIN_QUOTA_SECRET is not set. Refusing to sign cookies with an insecure fallback in production.",
    );
  }

  return DEV_FALLBACK_SECRET;
}

export function signPayload(encoded: string): string {
  return createHmac("sha256", getCookieSigningSecret())
    .update(encoded)
    .digest("base64url");
}

export function encodeSignedCookie(payload: unknown): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(encoded);
  return `${encoded}.${signature}`;
}

export function decodeSignedCookie<T>(value: string | undefined): T | null {
  if (!value) return null;

  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;

  const expected = signPayload(encoded);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}
