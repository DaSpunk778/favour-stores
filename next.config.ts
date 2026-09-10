import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
    ],
  },

  experimental: {
    serverActions: {
      // Product photos routinely exceed the 1MB default. This covers a large
      // main image or a few gallery photos in one request (the limit includes
      // multipart overhead). The client also guards per-file/total size.
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
