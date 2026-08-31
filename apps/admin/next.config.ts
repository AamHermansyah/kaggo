import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  poweredByHeader: false,
  transpilePackages: ["@kaggo/ui", "@kaggo/api", "@kaggo/validation", "@kaggo/types"],
}

export default nextConfig
