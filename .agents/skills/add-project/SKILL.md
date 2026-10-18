---
name: add-project
description: how to add a new project to the website by modifying src/data/projects.yml
---

Modify `src/data/projects.yml` to add a new project entry. Specify each project attribute; ask if anything is unclear.

Most likely, you will be given a link to a GitHub repo or another public resource to understand the project's content and scope. Read it, understand the project, and summarize it in one sentence in the concise, direct style used for the other project descriptions. If the provided resource is public and a link is available, include it in the project entry.

A thumbnail must be provided. It can be a local path, a remote URL, or an image in a remote repo. In any case, fetch it and save it locally under `src/assets/thumbnails` with the correct name.

The project date is its unique identifier. If no date is provided, use the current date. This date is also used as the thumbnail's unique ID.