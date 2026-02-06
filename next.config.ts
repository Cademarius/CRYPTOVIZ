import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://64.23.190.226/api/:path*",
      },
    ];
  },
};

export default nextConfig;
