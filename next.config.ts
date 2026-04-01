import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    '@temporalio/client',
    '@temporalio/worker',
    'claude-tempo',
    'claude-tempo/config',
    'claude-tempo/spawn',
    'claude-tempo/signals',
  ],
};

export default nextConfig;
