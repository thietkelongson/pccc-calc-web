# -*- coding: utf-8 -*-
"""Parse all 42 BDC + generate new modules/bdc/data/index.js"""
import os, json, sys
sys.path.insert(0, os.path.dirname(__file__))
from parse_docx import parse

ROOT = os.path.dirname(__file__)
DATA = os.path.join(ROOT, 'data')

with open(os.path.join(ROOT, 'mapping.json'), 'r', encoding='utf-8') as f:
    mapping = json.load(f)

results = []
total_sec = total_sub = total_item = total_img = 0
for group_key in ('congTrinh', 'heThong'):
    for m in mapping[group_key]:
        fid = m['id']
        try:
            data, nimg = parse(fid)
            out_path = os.path.join(DATA, f'checklist_{fid}.js')
            js = 'window.BDC_CHECKLIST_' + fid.upper() + ' = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';\n'
            with open(out_path, 'w', encoding='utf-8') as f:
                f.write(js)
            nsec = len(data); nsub = sum(len(s['subs']) for s in data); nitem = sum(len(sub['items']) for s in data for sub in s['subs'])
            results.append((fid, nsec, nsub, nitem, nimg))
            total_sec += nsec; total_sub += nsub; total_item += nitem; total_img += nimg
            print(f'  OK: {fid:30s} sec={nsec:2d}  sub={nsub:3d}  item={nitem:3d}  img={nimg:3d}')
        except Exception as e:
            print(f'  ERR: {fid:30s} {e}')

# Generate new index.js with proper structure
index_js = '// BDC index — auto-generated from mapping.json + parser stats\n'
index_js += 'window.BDC_INDEX = {\n  congTrinh: [\n'
for m in mapping['congTrinh']:
    index_js += f'    {{ id: "{m["id"]}", ma: "{m["ma"]}", ten: {json.dumps(m["ten"], ensure_ascii=False)}, icon: "{m["icon"]}", file: "{m["id"]}.docx" }},\n'
index_js += '  ],\n  heThong: [\n'
for m in mapping['heThong']:
    index_js += f'    {{ id: "{m["id"]}", ma: "{m["ma"]}", ten: {json.dumps(m["ten"], ensure_ascii=False)}, icon: "{m["icon"]}", file: "{m["id"]}.docx" }},\n'
index_js += '  ],\n  // mapping công trình -> hệ thống đề xuất kèm BDC (rút gọn, user override được)\n  mapping: {}\n};\n'

with open(os.path.join(DATA, 'index.js'), 'w', encoding='utf-8') as f:
    f.write(index_js)

# Generate HTML script tags for bdc-lookup.html
tags = []
for group_key in ('congTrinh', 'heThong'):
    for m in mapping[group_key]:
        tags.append(f'<script src="modules/bdc/data/checklist_{m["id"]}.js"></script>')
with open(os.path.join(ROOT, '_script_tags.txt'), 'w', encoding='utf-8') as f:
    f.write('\n'.join(tags))

print()
print(f'=== Total: {len(results)} BDC · {total_sec} sections · {total_sub} sub · {total_item} items · {total_img} images ===')
