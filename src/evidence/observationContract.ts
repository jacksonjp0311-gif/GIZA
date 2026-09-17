import type {EvidenceObservation,RealityAuthority,Uncertainty} from './types';

/** Explicit vocabulary: adding a new source status requires a policy decision. */
const statuses:Record<string,RealityAuthority>={MEASURED:'OBSERVED',REPORTED_MEASUREMENT:'OBSERVED',REPORTED_DESCRIPTION:'OBSERVED',HISTORICAL_REPORTED:'OBSERVED',PUBLISHED_SUMMARY:'OBSERVED',DERIVED_MEAN:'RECONSTRUCTED',DERIVED_SUM:'RECONSTRUCTED',DERIVED_MIDPOINT:'RECONSTRUCTED',DERIVED_FROM_MEASUREMENT:'RECONSTRUCTED',DERIVED_FROM_SURVEY:'RECONSTRUCTED',MEASURED_OR_RECONSTRUCTED:'RECONSTRUCTED',COMPUTED_POSITION:'RECONSTRUCTED',MISSING:'RECONSTRUCTED',UNVERIFIED:'HYPOTHESIS',HYPOTHESIS:'HYPOTHESIS',ASSUMED:'HYPOTHESIS',SIMULATED:'HYPOTHESIS'};
export function observationAuthority(status:unknown):RealityAuthority {
  if(typeof status!=='string'||!Object.hasOwn(statuses,status))throw new Error(`Unsupported observation status ${String(status)}; add an explicit reviewed status policy, not a default authority.`);
  return statuses[status];
}
export function assertSafeDocument(value:unknown,maxBytes=8_000_000):void {
  let count=0,size=0;
  const visit=(v:unknown,depth:number)=>{
    if(depth>40||++count>200000)throw new Error('Document nesting/collection limit exceeded');
    if(v===null||typeof v==='boolean')return;
    if(typeof v==='number'){if(!Number.isFinite(v))throw new Error('Nonfinite document number');return;}
    if(typeof v==='string'){size+=new TextEncoder().encode(v).length;if(size>maxBytes)throw new Error('Document size limit exceeded');return;}
    if(Array.isArray(v)){if(v.length>100000)throw new Error('Collection limit exceeded');v.forEach(x=>visit(x,depth+1));return;}
    if(!v||typeof v!=='object'||Object.getPrototypeOf(v)!==Object.prototype)throw new Error('Expected finite plain JSON');
    for(const [key,child] of Object.entries(v)){if(['__proto__','constructor','prototype'].includes(key))throw new Error('Unsafe document key');size+=key.length;visit(child,depth+1);}
  };visit(value,0);
  if(new TextEncoder().encode(JSON.stringify(value)).length>maxBytes)throw new Error('Document size limit exceeded');
}
export function scalar(value:unknown):asserts value is number|string|null {
  if(value!==null&&typeof value!=='string'&&(typeof value!=='number'||!Number.isFinite(value)))throw new Error('Observation value must be number, string or null');
}
export function validateUncertainty(u:Uncertainty):void {
  if(!u||!['KNOWN','UNKNOWN'].includes(u.status)||typeof u.unit!=='string'||typeof u.note!=='string'||(u.status==='UNKNOWN'?u.value!==null:typeof u.value!=='number'||!Number.isFinite(u.value)||u.value<0))throw new Error('Invalid uncertainty');
  if(u.interpretation!==undefined&&!['UNSPECIFIED_MAGNITUDE','BOUND','STANDARD_UNCERTAINTY','ROUNDING','UNKNOWN'].includes(u.interpretation))throw new Error('Unsupported uncertainty interpretation');
}
const units:Record<string,{dimension:string;unit:string;factor:number}>={m:{dimension:'LENGTH',unit:'m',factor:1},cm:{dimension:'LENGTH',unit:'m',factor:.01},mm:{dimension:'LENGTH',unit:'m',factor:.001},in:{dimension:'LENGTH',unit:'m',factor:.0254},deg:{dimension:'ANGLE',unit:'deg',factor:1},rad:{dimension:'ANGLE',unit:'deg',factor:180/Math.PI},arcmin:{dimension:'ANGLE',unit:'deg',factor:1/60},m2:{dimension:'AREA',unit:'m2',factor:1},m3:{dimension:'VOLUME',unit:'m3',factor:1},ratio:{dimension:'RATIO',unit:'ratio',factor:1}};
export interface ValidatedQuantity {schema:'giza.quantity.v1';dimension:string;native:{value:number|string|null;unit:string|null};normalized:{value:number;unit:string};conversion:{from:string;factor:number;rule:'explicit-unit-table.v1'};uncertaintyInterpretation:string}
export function normalizeQuantity(value:number,unit:string,nativeValue:number|string|null,nativeUnit:string|null):ValidatedQuantity {
  const spec=units[unit];if(!spec||!Number.isFinite(value))throw new Error(`Unsupported quantity unit ${unit}`);
  if(typeof nativeValue==='number'&&nativeUnit&&units[nativeUnit]){
    const source=units[nativeUnit];if(source.dimension!==spec.dimension)throw new Error('Native/normalized quantity dimension mismatch');
    // Preserve supplied rounding; inconsistent conversions cannot enter geometry.
    if(Math.abs(nativeValue*source.factor-value*spec.factor)>1e-8*Math.max(1,Math.abs(value*spec.factor)))throw new Error('Observation input differs: quantity conversion disagrees with native value');
  }
  return {schema:'giza.quantity.v1',dimension:spec.dimension,native:{value:nativeValue,unit:nativeUnit},normalized:{value:value*spec.factor,unit:spec.unit},conversion:{from:unit,factor:spec.factor,rule:'explicit-unit-table.v1'},uncertaintyInterpretation:'UNSPECIFIED_MAGNITUDE'};
}
export function validateObservation(input:unknown,sourceIds?:Set<string>):asserts input is EvidenceObservation {
  if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Invalid observation');
  const o=input as EvidenceObservation;
  for(const key of ['id','sourceId','locator','status','derivation'] as const)if(typeof o[key]!=='string'||!o[key].trim())throw new Error(`Observation requires ${key}`);
  scalar(o.value);scalar(o.nativeValue);
  for(const u of [o.unit,o.nativeUnit])if(u!==null&&(typeof u!=='string'||!u.trim()))throw new Error('Invalid observation unit');
  validateUncertainty(o.uncertainty);
  if(observationAuthority(o.status)!==o.authority)throw new Error('Observation authority disagrees with source status');
  if(sourceIds&&!sourceIds.has(o.sourceId))throw new Error(`Unbound observation source ${o.sourceId}`);
  if(o.authority==='OBSERVED'&&(o.locator==='UNKNOWN'||o.sourceId==='source.unknown'))throw new Error('Observed record needs an identified source and locator');
  if(o.status==='MISSING'&&(o.value!==null||o.sourceId!=='source.unknown'))throw new Error('MISSING observation cannot assert a value/source');
  if(typeof o.value==='number'){
    if(o.unit===null)throw new Error('Numeric observation requires unit');
    const quantity=normalizeQuantity(o.value,o.unit,o.nativeValue,o.nativeUnit);
    if(o.quantity!==undefined){
      const q=o.quantity;
      if(q.schema!=='giza.quantity.v1'||q.dimension!==quantity.dimension||q.normalized.value!==o.value||q.normalized.unit!==o.unit||q.native.value!==o.nativeValue||q.native.unit!==o.nativeUnit||q.conversion.rule!=='explicit-unit-table.v1'||!units[q.conversion.from]||q.conversion.factor!==units[q.conversion.from].factor)throw new Error('Quantity metadata inconsistent with observation');
    }
  }else if(o.quantity!==undefined)throw new Error('Non-numeric observation cannot carry numeric quantity');
}
export function lengthValue(o:EvidenceObservation|undefined):number|null {
  if(!o||o.authority==='HYPOTHESIS'||typeof o.value!=='number')return null;
  validateObservation(o);const q=normalizeQuantity(o.value,o.unit!,o.nativeValue,o.nativeUnit);
  if(q.dimension!=='LENGTH')throw new Error(`${o.id}: length geometry requires LENGTH, received ${q.dimension}`);
  return q.normalized.value;
}
/** Source objects remain unchanged; only the derived adapter is normalized. */
export function adaptObservation(row:Record<string,unknown>,supplemental=false):EvidenceObservation {
  const nativeValue=supplemental?row.value:row.native_value;scalar(nativeValue);
  const nativeUnit=(supplemental?row.unit:row.native_unit)??null;
  if(nativeUnit!==null&&typeof nativeUnit!=='string')throw new Error('Invalid native unit');
  const rawValue=supplemental?(row.si_value===undefined?nativeValue:row.si_value):row.si_value;scalar(rawValue);
  if(typeof nativeValue==='number'&&rawValue!==null&&typeof rawValue!=='number')throw new Error('Numeric observation requires numeric normalized value');
  let unit=(supplemental?(row.si_unit??(typeof rawValue==='number'&&typeof nativeUnit==='string'?units[nativeUnit]?.unit:null)):row.si_unit)??null;
  let value=rawValue;
  let quantity:ValidatedQuantity|undefined;
  if(typeof value==='number'){
    if(typeof unit!=='string')throw new Error('Numeric source record has unknown unit');
    // Supplemental SI values use the normalized unit derived from their declared native unit, never a blanket metre default.
    if(supplemental&&row.si_value===undefined)unit=nativeUnit;
    if(typeof unit!=='string')throw new Error('Numeric source record has unknown unit');
    quantity=normalizeQuantity(value,unit,nativeValue,nativeUnit);value=quantity.normalized.value;unit=quantity.normalized.unit;
  }
  const reported=row.uncertainty_si??null;
  if(reported!==null&&(typeof reported!=='number'||!Number.isFinite(reported)||reported<0))throw new Error('Invalid source uncertainty');
  const status=row.status,authority=observationAuthority(status);
  const o:EvidenceObservation={id:row.id as string,sourceId:(supplemental?row.source:row.source_id) as string,locator:(supplemental?row.locator:row.source_locator) as string,value,unit:unit as string|null,nativeValue,nativeUnit,authority,status:status as string,derivation:(supplemental?row.note:row.notes) as string||'Source-reported record; no surveyed endpoints or authenticated review implied.',uncertainty:{status:reported===null?'UNKNOWN':'KNOWN',value:reported===null?null:reported*(quantity?.conversion.factor??1),unit:unit as string??'UNKNOWN',note:'Source magnitude; statistical meaning unspecified.',interpretation:reported===null?'UNKNOWN':'UNSPECIFIED_MAGNITUDE'},...(quantity?{quantity}:{} )};
  validateObservation(o);return o;
}
