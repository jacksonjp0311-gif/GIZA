import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>{fs.mkdirSync(p.split('/').slice(0,-1).join('/'),{recursive:true});fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n')};
const seeds=read('public/model/action_graph/seeds.json');
const parsed=read('public/model/source_parser/parsed_records.json').records;
const pmap=new Map(parsed.map(r=>[r.record_id,r]));
const strength={
 DIRECT_ARCHITECTURE:.95,DIRECT_BURIAL_ARCHITECTURE:.98,FIND_PROVENANCE:.9,ARCHAEOLOGICAL_CONTEXT:.82,
 EVIDENCE_SUPPORTED_ACTION:.78,ARCHITECTURE_PLUS_FUNCTION_INFERENCE:.72,THRESHOLD_INFERENCE:.7,
 CONTEXTUAL_RITUAL_FUNCTION:.66,FUNCTIONAL_CONTEXT:.65,FUNCTIONAL_INFERENCE:.6,SCHOLARLY_FUNCTIONAL_SYNTHESIS:.68,CONTEXTUAL:.5
};
const nodes=seeds.nodes.map(n=>{
 const evidence=n.evidence_record_ids.map(id=>{const r=pmap.get(id);if(!r)throw new Error(`missing parsed evidence ${id}`);return {record_id:id,source_id:r.source_id,truth_class:r.truth_class,source_locator:r.source_locator};});
 return {...n,evidence_strength_index:strength[n.epistemic_status]??.5,evidence,geometry_write_authority:'NONE'};
});
const ids=new Set(nodes.map(n=>n.id));
for(const e of seeds.edges){if(!ids.has(e.from)||!ids.has(e.to))throw new Error(`bad edge ${e.from}->${e.to}`)}
const traversal=['place.lower_approach','action.enter_valley_complex','place.valley_temple','action.encounter_royal_images','place.valley_statuary_field','action.traverse_causeway','place.causeway','action.cross_royal_threshold','place.pyramid_temple_court','action.move_to_burial','place.burial_chamber','action.maintain_cult','place.upper_cult_zone'];
const graph={schema_version:'1.0.0',version:'0.10.7',graph_id:'giza.khafre.action_graph',guard:seeds.guard,node_count:nodes.length,edge_count:seeds.edges.length,nodes,edges:seeds.edges,canonical_geometry_mutation:false};
write('public/model/action_graph/graph.json',graph);
write('public/model/action_graph/traversal.json',{schema_version:'1.0.0',version:'0.10.7',primary_sequence:traversal,alternative_or_cyclic_actions:[{from:'place.burial_chamber',via:'action.maintain_cult',to:'place.upper_cult_zone',meaning:'post-burial cult continues after interment; this is functional synthesis, not a literal one-time procession route'}],unresolved:['exact Valley Temple statue positions','exact funerary actors and choreography','exact offering room(s) for Khafre','timing/frequency of rites','spoken liturgy','visibility and access restrictions by role']});
const map={id:'action',version:'0.10.7',title:'Place → Action → Place',coordinate_mode:'SCHEMATIC_BEHAVIORAL_GRAPH',metric:false,guard:'Behavioral nodes are source-addressed research reconstructions. Direct architecture, object provenance, contextual function and inference remain visibly distinct; no node or edge writes geometry.',source_ids:[...new Set(nodes.flatMap(n=>n.evidence.map(e=>e.source_id)))],nodes:nodes.map(n=>({id:n.id,kind:n.kind,label:n.label,x:n.x,y:n.y,epistemic_status:n.epistemic_status,evidence_strength_index:n.evidence_strength_index,evidence_record_ids:n.evidence_record_ids})),edges:seeds.edges,layers:['monuments','ritual','action','sources','uncertainty','intent']};
write('public/model/maps/layers/action_graph.json',map);
const m=read('public/model/action_graph/manifest.json');m.counts={nodes:nodes.length,actions:nodes.filter(n=>n.kind==='ACTION').length,places:nodes.filter(n=>n.kind==='PLACE').length,edges:seeds.edges.length,parsed_evidence_records_used:new Set(nodes.flatMap(n=>n.evidence_record_ids)).size};m.generated_at='2026-09-13T08:22:00Z';write('public/model/action_graph/manifest.json',m);
console.log(`ACTION GRAPH nodes=${nodes.length} actions=${nodes.filter(n=>n.kind==='ACTION').length} edges=${seeds.edges.length}`);
