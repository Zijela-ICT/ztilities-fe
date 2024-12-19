import type { NextConfig } from "next";
const allowedImageHosts = ["updc-dev.zijela.com"];

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: allowedImageHosts.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

export default nextConfig;
