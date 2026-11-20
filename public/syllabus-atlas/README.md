# Syllabus Atlas — ten-direction reading workbench (v4)

**As of 2026-11-20.** The current reading workbench is available at [reading-lists/](https://huwenbo-lab.github.io/huwenbo-academic-homepage/syllabus-atlas/reading-lists/). It extends the curated source shelf without replacing its original source records or historical audit.

## Current reading deliverable

The reviewed canonical bibliography is `reading-lists/downloads/reading_library.json`; `reading-lists/library-data.js` exposes the same data to the standalone web interface. It contains **287 unique works**, **316 direction–work uses**, **330 topic-specific reading purposes**, and **84 topics** across ten directions. **266 works have verified DOI identifiers**; the remainder use publisher or institutional records. A total of **56 retained source records** provide selected reading provenance. The resulting workbench is a curated selection, not an exhaustive transcription of every reference in all 119 retained sources.

The `reading-lists/lists/T01.md` through `T10.md` files provide coherent reading paths, full citations, source locations, original required/optional status, purpose-specific priority, and version notes. Downloads include one five-sheet Excel workbench, the complete reading package, and deduplicated RIS/BibTeX/CSL-JSON. Personal priorities (`第一轮`, `深化`, `方法工具`) are separate from the original course requirements. A single canonical work can serve several directions, each with its own reason for reading.

Eight works are explicit curator supplements and two bibliographies are reconstructed from the methods taught by a course; they are not mislabeled as course-assigned articles. Three Stanford method readings retain prior-transcription provenance because the original page could not be reread. Limited bibliography qualifications and 9 pending sources remain visible. Publication metadata verification is distinct from full-text scholarly review.

The public package contains bibliographic metadata and original reading guidance. It excludes source PDFs, journal-article full texts, private Zotero inventory/keys, and intermediate search caches. Original Zotero metadata is not the canonical public dataset.

## Source shelf retained from v3

The **final workbench** `Syllabus_Atlas_个人阅读工作台.xlsx` and its companion final archive `Syllabus_Atlas_归档与工作包_20261118.zip` remain the source data for the v3 source shelf. The archive contains `99_审计记录/有效来源_结构化备份.json` and `99_审计记录/来源元数据与233条历史决定.json`; the 10 direction titles, study stage, recommended source IDs and starting tasks are extracted from the workbook. Do **not** silently roll data back to the older 92-entry web collection or mix the two editions.

| Kind | Count | Meaning |
| --- | ---: | --- |
| Full syllabus/source edition records | 89 | 59 prior `核心主干` and 30 prior `专题补充` that survived the final whole-source selection. Not 89 independent courses. |
| Selected syllabus modules | 30 | Only topical parts retained when the rest of a source is peripheral. |
| Source-linked reading clues | 88 | Partial transcriptions, **not** a fully verified or deduplicated literature database; some were not rechecked against the originals this round. |
| Pending source records | 9 | Closely related sources but reading text remains unavailable/incomplete. |
| Historic decision records | 233 | Audit ledger, including removals, mergers and partial extraction decisions. Not part of the daily reading shelf. |
| Independent reading directions | 10 | T01–T10. A source may support multiple directions. |

## Files and maintenance

`index.html`, `assets/app.js`, `assets/styles.css`, `assets/data.js`, `assets/reading-data.js`, and the historical audit files continue to serve the original source shelf. `reading-lists/index.html`, `app.js`, and `styles.css` provide direction/topic/priority filters, search, first-round routes, provenance details, and downloads. The reading interface is framework-free and uses the same GitHub Pages deployment as the rest of the site.

`atlas_manifest.json` records the current reading edition separately from the original source-shelf counts. Keep the old 88 source-linked clues distinct from the 287 verified canonical works. Do not combine the two as if they were homogeneous records. The original `scripts/build_data.py` regenerates only the source shelf; it does not construct or validate the new reading bibliography.

To update the reading edition, review the canonical JSON, regenerate its web data and exports, check unique DOI/work identities and the direction/topic counts, then publish the complete set together. Do not hard-code counts that disagree with the underlying records. Existing GitHub Pages automation deploys pushes to `main`.

## Version history

v2 (2026-11-15): 92 early sources, 9 broad subject categories, 62 preliminary units, 76 initial links.

v3 (2026-11-18): 89 whole-source records + 30 selected modules + 88 preliminary reading clues + 9 pending records, plus the 233-entry historical audit ledger.

v4 (2026-11-20): the ten-direction reading workbench, with 84 topics and 287 canonical works, linked to the preserved v3 source shelf.

## Reading interface additions (2026-11-20)

The [field guide](reading-lists/guide.html) and [Markdown edition](reading-lists/KNOWLEDGE_MAP.md) describe research questions, debates and evidence boundaries across all ten reading directions, without claiming full-text review. A browser-local reader status tracker supports filtering and JSON export/import. Reader statuses are **not** saved to GitHub or Zotero and do not change the canonical bibliography.

## Syllabus-led selection criteria (2026-11-20)

[Selection methodology and provenance](reading-lists/methodology.html) and [the Markdown documentation](reading-lists/METHODOLOGY.md) explain the syllabus-led curation workflow, original source counts, bibliography checks, priority conventions and field-specific inclusion and exclusion considerations. Source concentration and remaining coverage gaps are explicitly disclosed; the reading bibliography is neither a systematic nor an exhaustive literature search.
