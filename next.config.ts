import type { NextConfig } from "next";

const wordpressHostname = process.env.WORDPRESS_HOSTNAME;
const wordpressUrl = process.env.WORDPRESS_URL;

const nextConfig: NextConfig = {
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
