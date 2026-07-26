// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import yaml from '@rollup/plugin-yaml';
import rehypeSlug from 'rehype-slug';
import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
  site: 'https://www.giacomociro.com',
  trailingSlash: 'always',
  integrations: [mdx()],
  markdown: {
    // rehype-slug adds the heading id slugs that Kramdown used to generate.
    rehypePlugins: [
      rehypeSlug,
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
  vite: {
    plugins: [yaml()],
  },
  build: {
    format: 'directory',
  },
});
