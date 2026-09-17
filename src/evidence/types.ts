/** Serializable Evidence Object contract. Presentation poses deliberately have no place in it. */
export type RealityAuthority = 'OBSERVED' | 'RECONSTRUCTED' | 'HYPOTHESIS';
export type Vec3 = [number, number, number];
/** Row-major affine matrix, applied to column vectors. Translation is indices 3, 7, 11. */
export type Matrix4 = [number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number];
export interface Uncertainty { status: 'KNOWN' | 'UNKNOWN'; value: number | null; unit: string; note: string; interpretation?:'UNSPECIFIED_MAGNITUDE'|'BOUND'|'STANDARD_UNCERTAINTY'|'ROUNDING'|'UNKNOWN' }
export interface SpatialFrame {
  id: string; label: string; units: 'm'; axes: {x:string;y:string;z:string}; handedness: 'RIGHT_HANDED';
  datum: string; authority: RealityAuthority; status: 'DEFINED' | 'UNRESOLVED';
}
export interface SpatialTransform {
  id: string; from: string; to: string; status: 'RESOLVED' | 'UNRESOLVED';
  scope: 'AUTHORITATIVE_RECONSTRUCTION' | 'COMPARISON_ONLY'; matrix: Matrix4 | null;
  authority: RealityAuthority; observationIds: string[]; uncertainty: Uncertainty; derivation: string;
}
export interface EvidenceObservation {
  quantity?:import('./observationContract').ValidatedQuantity;
  id: string; sourceId: string; locator: string; value: number | string | null; unit: string | null;
  nativeValue: number | string | null; nativeUnit: string | null;
  uncertainty: Uncertainty; authority: RealityAuthority; derivation: string; status: string;
}
export interface EvidenceSource { id:string;title:string;url:string;authority:string;byteStatus:'UNKNOWN'; }
export interface BoxGeometry {kind:'box';min:Vec3;max:Vec3}
export type FeatureGeometry = BoxGeometry | {kind:'surface';vertices:Vec3[]} | {kind:'segment';a:Vec3;b:Vec3}
  | {kind:'point';point:Vec3} | {kind:'unknown';reason:string};
export interface EvidenceFeature {
  id:string;objectId:string;label:string;authority:RealityAuthority;frameId:string;
  observationIds:string[];geometry:FeatureGeometry;uncertainty:Uncertainty;derivation:string;unknowns:string[];
  /** Numeric source/derived readout; never infer zero from null. */
  value:number|null;unit:string|null;coordinateAuthority:'RECONSTRUCTED'|'UNKNOWN';
}
export interface AssemblyConstraint {
  id:string;kind:string;featureIds:string[];observationIds:string[];
  status:'SATISFIED'|'VIOLATED'|'UNKNOWN';value:number|null;unit:string|null;note:string;
}
export interface TransformAudit {
  id:string;label:string;status:'DISAGREEMENT'|'UNRESOLVED'|'AGREEMENT';
  legacyValue:number|null;detailValue:number|null;difference:number|null;unit:string;
  observationIds:string[];note:string;
}
export interface EvidenceAssembly {
  schemaVersion:'giza.evidence-assembly.v1';id:string;title:string;authoritativeFrameId:string;
  frames:SpatialFrame[];transforms:SpatialTransform[];sources:EvidenceSource[];
  observations:EvidenceObservation[];features:EvidenceFeature[];constraints:AssemblyConstraint[];
  audit:TransformAudit[];limitations:string[];
}
export interface CanonicalPoint {frameId:string;position:Vec3;featureId?:string;origin?:{kind:'COMPUTED_SECTION';section:SectionPlane;surfaceAuthority:'RECONSTRUCTED'}}
export interface SpatialResult {status:'KNOWN'|'UNKNOWN';value:number|null;unit:'m'|'deg';frameId:string;reason:string;uncertainty:Uncertainty}
/** Rendering state cannot be accepted by measurement/section/export APIs. No scale is allowed. */
export interface PresentationPose {kind:'PRESENTATION_ONLY';objectId:string;translation:Vec3;rotationRad:Vec3;purpose:'EXPLODE'|'INSPECTION'|'FOCUS'}
export interface SectionPlane {frameId:string;normal:Vec3;offset:number}
