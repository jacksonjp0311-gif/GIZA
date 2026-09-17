import fs from 'node:fs';

const [cellId, evidenceId] = process.argv.slice(2);
if (!cellId || !evidenceId) {
  console.error('Usage: node scripts/field/new-stone-candidate.mjs <analysis_cell_id> <evidence_item_id>');
  process.exit(2);
}
if (!/^cell\.c\d{3}\.[NESW]\.\d{3}$/.test(cellId)) {
  console.error(`Invalid FORGE cell id: ${cellId}`);
  process.exit(2);
}
const evidence = JSON.parse(fs.readFileSync('public/model/evidence/evidence_items.json','utf8')).items ?? [];
const item = evidence.find(x => x.id === evidenceId);
if (!item) {
  console.error(`Unknown evidence item: ${evidenceId}`);
  process.exit(2);
}
const rank = {E0:0,E1:1,E2:2,E3:3,E4:4,E5:5}[item.maturity] ?? -1;
const path = 'public/model/field/mapped_stone_candidates.json';
const doc = JSON.parse(fs.readFileSync(path,'utf8'));
const id = `stone_candidate.${cellId}.${Date.now()}`;
const record = {
  id,
  analysis_cell_id: cellId,
  evidence_item_id: evidenceId,
  evidence_maturity: item.maturity,
  status: rank >= 4 ? 'REVIEW_REQUIRED' : 'BLOCKED_EVIDENCE_LT_E4',
  canonical_mutation: false,
  required_before_promotion: [
    'stone-specific geometry or segmented boundary',
    'coordinate-frame receipt',
    'review receipt',
    'difference against replaced analysis cell',
    'explicit provenance assignment'
  ]
};
doc.candidates.push(record);
fs.writeFileSync(path,JSON.stringify(doc,null,2)+'\n');
console.log(JSON.stringify(record,null,2));
