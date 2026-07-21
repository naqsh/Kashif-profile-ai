import type { NextConfig } from "next";

/**
 * Baseline Content-Security-Policy.
 *
 * `'unsafe-inline'` is required for the inline JSON-LD and Microsoft Clarity
 * snippets in `layout.tsx`, and `'unsafe-eval'` for the Sanity Studio bundle at
 * `/studio`. Tightening this to nonces/hashes would require middleware and is a
 * good follow-up, but this still meaningfully reduces the attack surface.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.clarity.ms https://*.clarity.ms",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.clarity.ms",
  "font-src 'self' data:",
  "connect-src 'self' https://openrouter.ai https://*.api.sanity.io https://*.clarity.ms wss:",
  "frame-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
]
  .join("; ")
  .concat(process.env.NODE_ENV === "production" ? "; upgrade-insecure-requests" : "");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=(self)",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
