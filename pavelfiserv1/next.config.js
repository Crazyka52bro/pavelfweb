/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Pokud používáte obrázky z next/image, přidejte toto:
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig