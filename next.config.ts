import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      // Import .svg as React components (works in `next dev --turbo`)
      "*.svg": {
        loaders: [
          { loader: "@svgr/webpack", options: { icon: true, svgo: true } },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
