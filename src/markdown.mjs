import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import rehypeExternalLinks from 'rehype-external-links';

// Timeline descriptions are Markdown strings inside a .yml file, so they are
// rendered here rather than by Astro's file-level Markdown pipeline. The
// external-link options are kept in sync with astro.config.mjs.
const processor = await createMarkdownProcessor({
  rehypePlugins: [
    [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
  ],
});

export async function renderMarkdown(source) {
  const { code } = await processor.render(source);
  return code;
}
