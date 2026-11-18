/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [{ source: "/projects", destination: "/#work", permanent: true }];
  },
};

module.exports = nextConfig;
