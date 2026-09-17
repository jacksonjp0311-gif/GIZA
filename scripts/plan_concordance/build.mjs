import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>{fs.mkdirSync(p.split('/').slice(0,-1).join('/'),{recursive:true});fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n')};
const V='0.10.7';
const facts=read('public/model/plan_concordance/facts.json');
const obs=read('public/model/observatory/observations.json').observations;
const obsMap=new Map(obs.map(o=>[o.id,o]));
const sources=read('public/model/evidence/source_registry.json').sources;
const sourceMap=new Map(sources.map(s=>[s.id,s]));
const rows=[];
for(const f of facts.facts){
  const support=f.support.map(id=>{const o=obsMap.get(id);if(!o)throw new Error(`${f.id}: missing observation ${id}`);if(!sourceMap.has(o.source_id))throw new Error(`${f.id}: unknown source ${o.source_id}`);return {observation_id:id,source_id:o.source_id,source_title:sourceMap.get(o.source_id).title,truth_class:o.truth_class,locator:o.source_locator};});
  const sourceIds=[...new Set(support.map(s=>s.source_id))];
  const independence=[...new Set(f.independence_groups??[])];
  rows.push({...f,support_count:support.length,source_count:sourceIds.length,independence_group_count:independence.length,support_detail:support,geometry_write_authority:'NONE'});
}
const statusCounts={};for(const r of rows)statusCounts[r.agreement]=(statusCounts[r.agreement]??0)+1;
const matrix={schema_version:'1.0.0',version:V,row_count:rows.length,policy:'Agreement is descriptive evidence concordance, not probability. Independent source families are counted separately; derivative reconstructions are flagged as dependence rather than confirmations.',rows};
const manifest={schema_version:'1.0.0',version:V,codename:'PLAN CONCORDANCE',purpose:'Track which Khafre plan/room facts converge across independent source families and which remain disputed, interpretive, derivative, or byte-pending.',counts:{facts:rows.length,strong:rows.filter(r=>r.agreement==='STRONG'||r.agreement==='STRONG_TOPOLOGY').length,conflict_or_interpretive:rows.filter(r=>/DISPUTED|INTERPRETIVE|CONFLICT/.test(r.agreement)).length,source_families:[...new Set(rows.flatMap(r=>r.independence_groups??[]))].length},agreement_counts:statusCounts,truth_rules:['agreement is not metric registration','source dependence does not count as independent replication','cataloged plan existence is not parsed wall geometry','architecture/function/reconstruction remain separate','concordance cannot write canonical geometry'],generated_at:new Date().toISOString()};
write('public/model/plan_concordance/matrix.json',matrix);write('public/model/plan_concordance/manifest.json',manifest);
console.log(`PLAN CONCORDANCE facts=${rows.length} strong=${manifest.counts.strong} families=${manifest.counts.source_families}`);
