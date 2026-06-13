/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.symlinks = false
    config.cache = false
    config.snapshot = {
      managedPaths: [],
      immutablePaths: [],
    }
    return config
  },
  images: {
    // Allow our own SVG brand logos (e.g. /tcl.svg) through next/image.
    // Safe here: sources are our /public files + the Supabase bucket only.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
