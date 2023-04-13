/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript:{
    ignoreBuildErrors:true
  }, 
  images:{
    domains:['oaidalleapiprodscus.blob.core.windows.net']
  }
}

module.exports = nextConfig
