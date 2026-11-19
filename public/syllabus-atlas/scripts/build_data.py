#!/usr/bin/env python3
"""Rebuild Syllabus Atlas static data from the final exported archive and manifest.

Usage:
  python scripts/build_data.py --archive /path/to/final-workbench-archive.zip \
    --manifest atlas_manifest.json --output .

The final Excel workbench is the editor's master copy. Direction display labels,
study phases and starting recommendations must be exported to manifest before
running; this script does not silently infer them from arbitrary filenames.
"""
import argparse
import csv
import json
import zipfile
from pathlib import Path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--archive', required=True, help='Final 2026-11-18 archive ZIP or its reviewed successor')
    ap.add_argument('--manifest', required=True, help='Reviewed atlas_manifest.json')
    ap.add_argument('--output', default='.', help='Website root (directory containing index.html)')
    args = ap.parse_args()
    destination = Path(args.output) / 'assets'
    destination.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(args.archive) as z:
        d = json.loads(z.read('99_审计记录/有效来源_结构化备份.json'))
        ledger = json.loads(z.read('99_审计记录/来源元数据与233条历史决定.json'))
    with open(args.manifest, encoding='utf-8') as f:
        metadata = json.load(f)
    dirs = metadata['direction_index']
    labels = {d['id'] for d in dirs}
    assert labels == set(d['directions']), 'Direction IDs differ from curated source'
    assert len({x['id'] for x in d['full_syllabi']}) == len(d['full_syllabi']), 'Duplicate syllabus IDs'
    mids = {x['module_id'] for x in d['modules']}
    assert len(mids) == len(d['modules'])
    assert all(x['module_id'] in mids for x in d['reading_excerpts'])
    assert sum(x['excerpt_readings'] for x in d['modules']) == len(d['reading_excerpts'])
    counts = {
        'syllabi': len(d['full_syllabi']),
        'modules': len(d['modules']),
        'readings': len(d['reading_excerpts']),
        'pending': len(d['pending_sources']),
        'audit': len(ledger['original_decisions']),
        'core': sum(x.get('action') == '核心主干' for x in d['full_syllabi']),
        'supplement': sum(x.get('action') == '专题补充' for x in d['full_syllabi']),
    }
    meta = dict(metadata['meta'])
    meta['counts'] = counts
    payloads = {
        'data.js': ('ATLAS_DATA', {'meta': meta, 'directions': dirs, 'syllabi': d['full_syllabi']}),
        'reading-data.js': ('ATLAS_READING', {'modules': d['modules'], 'readings': d['reading_excerpts'], 'pending': d['pending_sources']}),
        'audit-data.js': ('ATLAS_AUDIT', {'decisions': ledger['original_decisions']}),
    }
    for filename, (variable, contents) in payloads.items():
        out = '/* Source: final review archive; see README.md for limitations. */\nwindow.' + variable + '=' + json.dumps(contents, ensure_ascii=False, separators=(',', ':')).replace('<', r'\u003c') + ';\n'
        (destination / filename).write_text(out, encoding='utf-8')
        print('Updated', filename)
    fields = ['source_id', 'old_action', 'new_action', 'title', 'main_direction', 'reason', 'source_round', 'url']
    with (destination / 'audit.csv').open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(ledger['original_decisions'])
    print('Verified records:', counts)


if __name__ == '__main__':
    main()