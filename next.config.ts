import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include .index folder in serverless function bundle
  outputFileTracingIncludes: {
    '/api/chat': ['./.index/**/*'],
  },
  // Ensure data folder is also included
  experimental: {
    outputFileTracingIncludes: {
      '/api/chat': ['./data/**/*', './.index/**/*'],
    },
  },
};

export default nextConfig;
