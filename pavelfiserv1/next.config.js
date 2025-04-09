/** @type {import('next').NextConfig} */
const nextConfig = {
  // Odstraňte output: 'export', pokud nechcete statický export
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vercel.com', // Přidejte domény, ze kterých načítáte obrázky
      },
    ],
  },
};

module.exports = nextConfig;