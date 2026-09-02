import type { NextConfig } from "next";

// When ADMIN_PROXY_TARGET is set, the public site forwards /admin/* to the
// separate admin deployment, so both of these work:
//   https://portfolio.aavrit/admin  →  https://admin.portfolio.aavrit/admin
const adminTarget = process.env.ADMIN_PROXY_TARGET ?? "";

const nextConfig: NextConfig = {
  transpilePackages: ["@aavrit/core"],
  // The workspace preview proxies this app under *.e2b.app — allow dev-server
  // requests from those origins (production is unaffected).
  allowedDevOrigins: ["*.e2b.app", "localhost", "127.0.0.1"],
  images: {
    // media uploaded through the admin panel may resolve to these hosts
    remotePatterns: [
      { protocol: "https", hostname: "*.firebasestorage.app" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async rewrites() {
    if (!adminTarget) return [];
    return [
      { source: "/admin", destination: `${adminTarget}/admin` },
      { source: "/admin/:path*", destination: `${adminTarget}/admin/:path*` },
    ];
  },
  async redirects() {
    // No proxy configured: send /admin to the standalone admin deployment
    // (or home) instead of a 404.
    if (adminTarget || !process.env.NEXT_PUBLIC_ADMIN_URL) return [];
    return [
      {
        source: "/admin",
        destination: process.env.NEXT_PUBLIC_ADMIN_URL,
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
