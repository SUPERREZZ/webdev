/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.google.com", "ssl.gstatic.com", "drive.google.com"],
  },
};

module.exports = nextConfig;
