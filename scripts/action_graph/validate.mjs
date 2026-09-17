import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const errors=[];const need=(x,m)=>{if(!x)errors.push(m)};
const graph=read('public/model/action_graph/graph.json'); const parsed=read('public/model/source_parser/parsed_records.json').records;const map=read('public/model/maps/layers/action_graph.json');
const pids=new Set(parsed.map(r=>r.record_id)); const ids=new Set(graph.nodes.map(n=>n.id));
need(graph.version==='0.10.7','action graph version drift'); need(graph.canonical_geometry_mutation===false,'action graph must not mutate geometry');
need(graph.nodes.filter(n=>n.kind==='ACTION').length>=7,'expected at least 7 action nodes'); need(graph.nodes.filter(n=>n.kind==='PLACE').length>=7,'expected at least 7 place nodes');
for(const n of graph.nodes){need(['PLACE','ACTION'].includes(n.kind),`${n.id}: invalid kind`);need(n.evidence_record_ids?.length>0,`${n.id}: no evidence records`);for(const id of n.evidence_record_ids??[])need(pids.has(id),`${n.id}: missing parsed evidence ${id}`);need(n.geometry_write_authority==='NONE',`${n.id}: graph node geometry authority drift`);if(n.kind==='ACTION')need(n.actor,`${n.id}: action actor class missing`)}
for(const e of graph.edges){need(ids.has(e.from)&&ids.has(e.to),`bad edge ${e.from}->${e.to}`);need(e.status!=='CONFIRMED_RITUAL_SCRIPT',`edge ${e.from}->${e.to}: prohibited certainty state`)}
need(map.metric===false,'action map must remain nonmetric'); need(map.nodes.length===graph.nodes.length,'action map/graph node drift');
if(errors.length){console.error('ACTION GRAPH validation FAILED');errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log(`ACTION GRAPH validation PASS nodes=${graph.nodes.length} edges=${graph.edges.length} geometry_write=NONE ritual_script=NOT_CLAIMED`);
