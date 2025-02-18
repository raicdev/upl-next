/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.kuku.lu'
      },
    ],
  },
}

export default nextConfig
