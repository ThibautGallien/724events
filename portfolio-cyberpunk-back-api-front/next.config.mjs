/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    appDir: true, // obligatoire pour indiquer /src/app
  },
};

export default nextConfig;
