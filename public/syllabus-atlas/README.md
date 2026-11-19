# Syllabus Atlas — curated reading source library (v3)

**As-of date: 2026-11-18.** This standalone static site is deployed from `public/syllabus-atlas/` inside [`huwenbo-lab/huwenbo-academic-homepage`](https://github.com/huwenbo-lab/huwenbo-academic-homepage), using the existing Vite/GitHub Pages workflow. Public URL: <https://huwenbo-lab.github.io/huwenbo-academic-homepage/syllabus-atlas/>.

## Canonical source

The **final workbench** `Syllabus_Atlas_个人阅读工作台.xlsx` and its companion final archive `Syllabus_Atlas_归档与工作包_20261118.zip` are the sole source data. The archive contains `99_审计记录/有效来源_结构化备份.json` and `99_审计记录/来源元数据与233条历史决定.json`; the 10 direction titles, study stage, recommended source IDs and starting tasks are extracted from the workbook. Do **not** silently roll data back to the older 92-entry web collection or mix the two editions.

| Kind | Count | Meaning |
| --- | ---: | --- |
| Full syllabus/source edition records | 89 | 59 prior `核心主干` and 30 prior `专题补充` that survived the final whole-source selection. Not 89 independent courses. |
| Selected syllabus modules | 30 | Only topical parts retained when the rest of a source is peripheral. |
| Source-linked reading clues | 88 | Partial transcriptions, **not** a fully verified or deduplicated literature database; some were not rechecked against the originals this round. |
| Pending source records | 9 | Closely related sources but reading text remains unavailable/incomplete. |
| Historic decision records | 233 | Audit ledger, including removals, mergers and partial extraction decisions. Not part of the daily reading shelf. |
| Independent reading directions | 10 | T01–T10. A source may support multiple directions. |

## Web files

- `index.html`, `assets/styles.css`, `assets/app.js`: responsive, framework-free interface.
- `assets/data.js`: final direction definitions and 89 whole-source records.
- `assets/reading-data.js`: 30 selected modules, 88 source-tagged readings and 9 pending sources.
- `assets/audit-data.js`: 233 historic screening decisions. For audit/provenance only.
- `assets/audit.csv`: CSV export of the 233 decisions.
- `atlas_manifest.json`: data counts, direction metadata and migration status for future maintenance.
- `scripts/build_data.py`: standard-library reconstruction script using the final archive and reviewed direction manifest; the Excel workbench remains the editable master.

## Data provenance and limits

Original syllabus titles, readings, instructor names, source URLs, course years, and prior extraction status are retained as recorded in the final source package. No new bibliographic entries or DOI values have been invented. Reading grades (`A/B/C`) are access/visibility observations, not a course quality assessment. `原核心主干/原专题补充` is a **previous prioritization**; **all 89** rows are ultimately `整份保留` under the current workbench. All recorded URLs point back to the original external site and have not been comprehensively revalidated as of this site migration.

The public site does not reproduce restricted syllabus PDFs or journal-article full texts. Files from the intermediate search stages have not been republished. Browser-only “favorites” are stored locally via `localStorage` and are not synchronized to GitHub or the user's master Excel workbook.

## Using the atlas

1. Open one of the ten independent reading directions. Follow its `first_step` and `starter_ids` rather than reading all sources at once.
2. Use the 89 whole-source records to understand how multiple seminars/qualifying lists organize a field.
3. Use the 30 extracted modules as *partial* topics, read their 88 citation clues, and verify original reading requirements and citation metadata.
4. Build an independent Reading List for each direction. Supplement the verified core with other relevant literature; never present automatically extracted source snippets as fully checked bibliographic facts.

To update, edit the final workbench and canonical archive (or use another reviewed source-of-truth dataset), run `python scripts/build_data.py --archive FINAL.zip --manifest atlas_manifest.json --output .` off-line, verify counts and references, and publish the regenerated assets in a new GitHub commit. Do not manually change hard-coded counts without updating the data. Existing GitHub Pages automation deploys pushes to `main`.

## Version migration

v2 (2026-11-15): 92 early sources, 9 broad subject categories, 62 preliminary units, 76 initial links.

v3 (2026-11-18): **89 + 30 + 88 + 9** final curation, ten user research lines, plus 233-entry audit ledger. This is a curated syllabus **source library**, not yet ten finished doctoral reading lists.