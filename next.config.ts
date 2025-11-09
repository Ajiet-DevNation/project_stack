/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allows all HTTPS image sources
      },
      {
        protocol: "http",
        hostname: "**", // optional: allows all HTTP sources too
      },
    ],
  },
};

export default nextConfig;
