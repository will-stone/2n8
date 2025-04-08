import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    starlight({
      customCss: ['./website/tailwind.css'],
      editLink: {
        baseUrl: 'https://github.com/will-stone/2n8/edit/main/',
      },
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
        {
          attrs: {
            content: '2n8 - state management',
            property: 'og:title',
          },
          tag: 'meta',
        },
        {
          attrs: {
            content: 'Minimal state boilerplate.',
            property: 'og:description',
          },
          tag: 'meta',
        },
        {
          attrs: {
            content: 'website',
            property: 'og:type',
          },
          tag: 'meta',
        },
        {
          attrs: {
            content: '/web-app-manifest-512x512.png',
            property: 'og:image',
          },
          tag: 'meta',
        },
        {
          attrs: {
            'data-domains': '2n8.wstone.uk',
            'data-website-id': '36524414-8144-452a-88e1-69e1b31c722d',
            defer: true,
            src: 'https://celadon-seriema.pikapod.net/script.js',
          },
          tag: 'script',
        },
      ],
      logo: {
        src: './website/assets/logo.png',
      },
      sidebar: [
        'index',
        'getting-started',
        {
          items: [
            'state-and-actions',
            'async-actions',
            'derived-state',
            'reset-state',
          ],
          label: 'Guides',
        },
        'comparison',
        'api',
      ],
      social: [
        {
          href: 'https://github.com/will-stone/2n8',
          icon: 'github',
          label: 'GitHub',
        },
      ],
      title: '2n8',
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  markdown: {
    rehypePlugins: [[rehypeExternalLinks, { target: '_blank' }]],
  },
  outDir: './dist-website',
  publicDir: './website/public',
  srcDir: './website',
})
