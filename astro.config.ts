import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    starlight({
      favicon: '/favicon.svg',
      head: [
        {
          attrs: {
            href: '/favicon-96x96.png',
            rel: 'icon',
            sizes: '96x96',
            type: 'image/png',
          },
          tag: 'link',
        },
        {
          attrs: {
            href: '/favicon.svg',
            rel: 'icon',
            type: 'image/svg+xml',
          },
          tag: 'link',
        },
        {
          attrs: {
            href: '/favicon.ico',
            rel: 'shortcut icon',
          },
          tag: 'link',
        },
        {
          attrs: {
            href: '/apple-touch-icon.png',
            rel: 'apple-touch-icon',
            sizes: '180x180',
          },
          tag: 'link',
        },
        {
          attrs: {
            content: '2n8',
            name: 'apple-mobile-web-app-title',
          },
          tag: 'meta',
        },
        {
          attrs: {
            href: '/site.webmanifest',
            rel: 'manifest',
          },
          tag: 'link',
        },
      ],
      logo: {
        src: './website/assets/logo.png',
      },
      social: {
        github: 'https://github.com/will-stone/2n8',
      },
      title: '2n8',
    }),
  ],
  markdown: {
    rehypePlugins: [[rehypeExternalLinks, { target: '_blank' }]],
  },
  outDir: './dist-website',
  publicDir: './website/public',
  srcDir: './website',
})
