/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsExternalPackages: ["pdf-parse","tiktoken"],
  appDir: true,
},
reactStrictMode: false,
webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });
    return config;
  }
};

export default nextConfig;
