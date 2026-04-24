import type { NextConfig } from "next";

const wordpressHostname = process.env.WORDPRESS_HOSTNAME;
const wordpressUrl = process.env.WORDPRESS_URL;

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: wordpressHostname || "carimporters.co.uk",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    if (!wordpressUrl) {
      return [];
    }
    return [
      {
        source: "/admin",
        destination: `${wordpressUrl}/wp-admin`,
        permanent: true,
      },
      {
        source: "/posts",
        destination: "/import-news",
        permanent: true,
      },
      {
        source: "/posts/:path*",
        destination: "/import-news/:path*",
        permanent: true,
      },
      {
        source: "/cars",
        destination: "/vehicles",
        permanent: true,
      },
      {
        source: "/cars/:path*",
        destination: "/vehicles/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
