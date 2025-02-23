/** @type {import('next').NextConfig} */

export default {
  output: "standalone",
  reactStrictMode: false, // did not help in solving the issue of two client joining from different pages
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      }
    ]
  }
};
