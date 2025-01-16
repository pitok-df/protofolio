/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["https://protofolio-git-main-pitok-dfs-projects.vercel.app/"]
  },
  experimental: {
    metadataBase: new URL('https://protofolio-git-main-pitok-dfs-projects.vercel.app/'), // Ganti dengan URL domain utama kamu
  },
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
