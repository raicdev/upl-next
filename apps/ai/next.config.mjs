import path from 'path'

const __dirname = path.resolve()

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  outputFileTracingRoot: path.join(__dirname, '../../'),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.ufs.sh",
        port: "",
        pathname: "/**",
      },
    ]
  }
}

export default nextConfig
