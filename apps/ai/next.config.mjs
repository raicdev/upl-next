/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s.kuku.lu",
        port: "",
        pathname: "/**",
      },
    ]
  }
}

export default nextConfig
