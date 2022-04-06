/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    L1_VAULT_ADDRESS: process.env.L1_VAULT_ADDRESS,
    L2_BRIDGE_ADDRESS: process.env.L2_BRIDGE_ADDRESS,
    L1_TOKEN_ADDRESS: process.env.L1_TOKEN_ADDRESS,
    L2_TOKEN_ADDRESS: process.env.L2_TOKEN_ADDRESS,
  }
}


module.exports = nextConfig
