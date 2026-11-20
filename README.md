# Academic homepage and Syllabus Atlas

This repository hosts an academic homepage and a research reading workspace.

- [Academic homepage](https://huwenbo-lab.github.io/huwenbo-academic-homepage/)
- [Syllabus Atlas — course source shelf](https://huwenbo-lab.github.io/huwenbo-academic-homepage/syllabus-atlas/)
- [Reading library — 287 works in 10 fields](https://huwenbo-lab.github.io/huwenbo-academic-homepage/syllabus-atlas/reading-lists/)
- [Knowledge map — questions, debates and reading routes](https://huwenbo-lab.github.io/huwenbo-academic-homepage/syllabus-atlas/reading-lists/guide.html)
- [Selection methodology and original course sources](https://huwenbo-lab.github.io/huwenbo-academic-homepage/syllabus-atlas/reading-lists/methodology.html)

## Research reading workspace

The reading library covers 10 directions and 84 topics, with 287 deduplicated works, bibliographic provenance, reading purposes and priority sequences. It also offers a downloadable workbook and source audit. The knowledge guide is an editorial research map, **not a completed full-text literature review**. Optional reading progress is saved **only in your browser**; export/import JSON to preserve it. No Zotero import is required.

For sources, bibliography qualifications and maintenance, consult [Syllabus Atlas documentation](public/syllabus-atlas/README.md) and [the reading workbench guide](public/syllabus-atlas/reading-lists/README.md).

## Development

The homepage is built with React, TypeScript and Vite; the Syllabus Atlas is static HTML/CSS/JavaScript under `public/syllabus-atlas/`.

```bash
npm ci
npm run dev
npm run build
```

The GitHub Pages deployment publishes changes to `main`.
