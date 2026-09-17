import type { Part } from './model';
export function searchParts(parts:Part[],query:string) {
  const words=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if(!words.length)return [];
  return parts.filter(p=>words.every(w=>(p.name+' '+p.id+' '+p.provenance.class).toLowerCase().includes(w)))
    .sort((a,b)=>Number(a.provenance.class==='UNVERIFIED')-Number(b.provenance.class==='UNVERIFIED')||a.name.localeCompare(b.name));
}
