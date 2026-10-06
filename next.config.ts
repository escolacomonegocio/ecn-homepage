import type { NextConfig } from "next";

// Página estática: CSP sem nonce (nonce força render dinâmico). 'unsafe-inline' em script
// é necessário para o bootstrap inline do Next em página estática.
const csp = [
  "default-src 'self'",
  // Pixel da Meta e UTMify (mesmo rastreamento do site atual); o UTMify puxa sha256 do jsdelivr,
  // geolocalização por IP e, quando configurado, o pixel do TikTok.
  "script-src 'self' 'unsafe-inline' https://vercel.live https://connect.facebook.net https://cdn.utmify.com.br https://cdn.jsdelivr.net https://analytics.tiktok.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://vercel.live https://vercel.com https://www.facebook.com",
  "font-src 'self' https://vercel.live",
  "connect-src 'self' https://vercel.live wss://ws-us3.pusher.com https://www.facebook.com https://connect.facebook.net https://tracking.utmify.com.br https://api.ipify.org https://api6.ipify.org https://ipapi.co https://analytics.tiktok.com",
  "frame-src https://vercel.live",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 768, 1080, 1440, 1920, 2560],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // O endereço *.vercel.app fica fora do Google; só o domínio oficial é indexado.
      {
        source: "/(.*)",
        has: [{ type: "host", value: "(?<sub>.*)\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
