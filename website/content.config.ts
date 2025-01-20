import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema } from '@astrojs/starlight/schema'
import { defineCollection, z } from 'astro:content'

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        banner: z.object({ content: z.string() }).default({
          content:
            'This library is still in its infancy. Please <a href="https://github.com/will-stone/2n8/issues" target="_blank">log any issues</a> you may find.',
        }),
      }),
    }),
  }),
}
