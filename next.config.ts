/** @type {import('next').NextConfig} */
const isAndroidBuild = process.env.BUILD_TARGET === 'android';

const nextConfig = {
  output: 'export',
  basePath: isAndroidBuild ? '/assets' : '',
  assetPrefix: isAndroidBuild ? '/assets' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;