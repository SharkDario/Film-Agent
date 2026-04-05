import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "i.blogs.es",
      },
      {
        protocol: "https",
        hostname: "www.espinof.com",
      },
    ],
  },
};

export default nextConfig;
