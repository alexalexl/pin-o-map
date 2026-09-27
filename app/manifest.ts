import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pin-o-map',
    short_name: 'Pin-o-map',
    description: 'Mark the cities and countries you have visited.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',

    icons: [
      {
        src: '/icons/pinomap_icon_192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/pinomap_icon_512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}