import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exportación estática para Cloudflare Pages: `npm run build` genera `out/`.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
