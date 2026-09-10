// @ts-check
import { defineConfig } from 'astro/config';
import yaml from '@rollup/plugin-yaml';
import rehypeSlug from 'rehype-slug';
import rehypeExternalLinks from 'rehype-external-links';

import { unified } from '@astrojs/markdown-remark';

export default defineConfig({
  site: 'https://www.giacomociro.com',
  trailingSlash: 'ignore',
  markdown: {
    // rehype-slug adds the heading id slugs that Kramdown used to generate.
    processor: unified({
      rehypePlugins: [
        rehypeSlug,
        [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
      ],
    }),
  },
  vite: {
    plugins: [yaml()],
  },
  build: {
    format: 'directory',
  },
});
