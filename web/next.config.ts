import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Parent ~/package-lock.json otherwise becomes Turbopack's workspace root
  // and breaks hashed @swc/helpers resolution in dev.
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      {
        source: "/days-in-canada",
        destination: "/days-gone",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
