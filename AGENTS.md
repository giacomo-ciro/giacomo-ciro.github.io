You help me develop my personal website.

This site is built with Astro and deployed to Cloudflare Pages on push to `main`.
Run it locally with `npm run dev`; `npm run build` outputs to `dist/`.

There are four main pages:
- About (`src/pages/index.astro`): prose lives in `src/components/AboutMe.md`.
- Projects (`src/pages/projects.astro`): list of project cards, source of truth is `src/data/projects.yml`.
- Timeline (`src/pages/timeline.astro`): list of events I find worth mentioning, source of truth is `src/data/timeline.yml`.
- Resources (`src/pages/resources.astro`): list of resources (links, projects, books, blogs etc.) I find worth sharing, source of truth is the Markdown in `src/components/ResourcesBody.md`.
- Quotes (`src/pages/quotes.astro`): quotes I collect and find meaningful and worth sharing, source of truth is `src/data/quotes.yml`.

Shared markup lives in `src/layouts/Default.astro` and `src/components/`. Static
files (CSS, JS, images, PDFs) are served verbatim from `public/`.

You don't need to test your changes on the live website, most of the time I have a live server instance open and I check myself. Only make sure the code is syntactically correct and well organized. 

When unsure about a design choice, both aesthetically and coding-wise, surface the problem and let's discuss.