/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsExternalPackages: ["pdf-parse"],
  appDir: true,
},
reactStrictMode: false

};

export default nextConfig;
