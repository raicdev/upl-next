/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.kuku.lu'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      }
    ],
  },
  redirects: async () => {
    return [
      {
        source: '/@:username',
        destination: '/user/:username',
        permanent: true,
      },
    ]
  }
}

export default nextConfig
