import type { NextConfig } from "next";

const wordpressHostname = process.env.WORDPRESS_HOSTNAME;
const wordpressUrl = process.env.WORDPRESS_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // /vehicles/volkswagen/golf → /vehicles?make=volkswagen&model=golf
      {
        source: "/vehicles/:make((?![0-9]{4})[a-z][a-z0-9-]*)/:model([a-z][a-z0-9-]*)",
        destination: "/vehicles?make=:make&model=:model",
      },
      // /vehicles/volkswagen → /vehicles?make=volkswagen
      {
        source: "/vehicles/:make((?![0-9]{4})[a-z][a-z0-9-]*)",
        destination: "/vehicles?make=:make",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: wordpressHostname || "wp.carimporters.co.uk",
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
        source: "/posts/:slug*",
        destination: "/import-news/:slug*",
        permanent: true,
      },
      {
        source: "/cars",
        destination: "/vehicles",
        permanent: true,
      },
      {
        source: "/cars/:slug*",
        destination: "/vehicles/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
