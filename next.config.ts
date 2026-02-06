import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include .index and data folders in serverless function bundle
  outputFileTracingIncludes: {
    '/api/chat': ['./data/**/*', './.index/**/*'],
  },
};

export default nextConfig;
