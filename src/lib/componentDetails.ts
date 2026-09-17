import type { ModelBundle, Part, PhotoRecord } from './model';

export type DetailContext = 'OBJECT' | 'ROOM';
export function researchValue(model: ModelBundle, id: string) {
  const value=model.componentResearch.observations.find(o=>o.id===id)?.si_value;
  if(typeof value!=='number'||!Number.isFinite(value)||value<=0)throw new Error(`Missing placement observation: ${id}`);
  return value;
}
export function uniquePhotos(photos: PhotoRecord[]) {
  const seen=new Set<string>();
  return photos.filter(p=>{
    const key=decodeURIComponent(p.page_url).replaceAll('_',' ').replace(/[?#].*$/,'');
    if(seen.has(key))return false;
    seen.add(key);return true;
  });
}
export function pinMarkers(model: ModelBundle) {
  const d=burialDimensions(model),v=(id:string)=>researchValue(model,id);
  return [
    {label:'N pin',x:-d.outerWidth/2+v('coffer.pin_n.from_w_outer'),y:d.innerLength/2-v('coffer.pin_n.from_n_inner'),diameter:v('coffer.pin_diameter')},
    {label:'S pin',x:-d.outerWidth/2+v('coffer.pin_s.from_w_outer'),y:-d.innerLength/2+v('coffer.pin_s.from_s_inner'),diameter:v('coffer.pin_diameter')},
  ];
}
export function lowerDimensions(model: ModelBundle) {
  const m=(id:string)=>measurementValue(model,id);
  const width=m('m.lower.east_width'),doorWidth=m('m.lower.door_width');
  const doorEnd=width/2-researchValue(model,'lower.door.from_north');
  return {length:(m('m.lower.north_length')+m('m.lower.south_length'))/2,width,doorStart:doorEnd-doorWidth,doorEnd,doorWidth};
}
export const isBurialDetail = (id: string) => id.startsWith('part.burial.') || id.startsWith('part.sarcophagus.');

export function measurementValue(model: ModelBundle, id: string) {
  const row = model.measurements.find(m => m.id === id);
  if (!row || typeof row.si_value !== 'number' || !Number.isFinite(row.si_value)) {
    throw new Error(`Missing measured dimension: ${id}`);
  }
  return row.si_value;
}

export function burialDimensions(model: ModelBundle) {
  const m = (id: string) => measurementValue(model, id);
  const observation = (id: string) => {
    const value = model.componentResearch.observations.find(o => o.id === id)?.si_value;
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) throw new Error(`Missing placement observation: ${id}`);
    return value;
  };
  return {
    length: (m('m.burial.length_n') + m('m.burial.length_s')) / 2,
    width: (m('m.burial.width_e') + m('m.burial.width_w')) / 2,
    wallHeight: m('m.burial.wall_height'), rise: m('m.burial.gable_rise.vyse'),
    outerLength: m('m.coffer.outer_length'), outerWidth: m('m.coffer.outer_width'),
    outerHeight: m('m.coffer.outer_height'), innerLength: m('m.coffer.inner_length'),
    innerWidth: m('m.coffer.inner_width'), innerDepth: m('m.coffer.inner_depth'),
    lidLength: m('m.coffer.lid_length'), lidWidth: m('m.coffer.lid_width'),
    lidThickness: (m('m.coffer.lid_thickness_min') + m('m.coffer.lid_thickness_max')) / 2,
    westClearance: observation('coffer.west_clearance'),
    northClearance: observation('coffer.north_clearance'),
    doorStart: m('m.burial.door_from_e.start'), doorEnd: m('m.burial.door_from_e.end'),
  };
}

export function detailParts(model: ModelBundle, focus: Part, context: DetailContext): Part[] {
  if (context === 'OBJECT') return [focus];
  return model.parts.filter(p => p.id === focus.id || (!!focus.parent && p.parent === focus.parent));
}

export function detailCoverage(model: ModelBundle, part: Part) {
  const components = model.atlasObjects[part.id]?.measurement_components ?? [];
  const associated = model.measurements.filter(m => components.includes(m.component));
  const isCoffer = part.id.startsWith('part.sarcophagus.');
  const measurements = isCoffer ? associated.filter(m => m.id.startsWith('m.coffer.') &&
    (part.id.endsWith('.lid') === m.id.startsWith('m.coffer.lid_'))) : associated;
  return {
    measurements,
    contextMeasurements: associated.filter(m => !measurements.includes(m)),
    photos: uniquePhotos(model.photos.filter(p => p.bind.includes(part.id))),
    quality: part.provenance.class === 'UNVERIFIED' ? 'UNVERIFIED GEOMETRY'
      : isBurialDetail(part.id) ? 'SURVEY-BASED RECONSTRUCTION'
      : part.spatial.cad ? 'DIMENSIONED CAD PREVIEW' : 'SIMPLIFIED ENVELOPE',
  };
}
