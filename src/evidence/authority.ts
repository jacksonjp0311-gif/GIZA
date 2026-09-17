import type {Part} from '../lib/model';
import type {RealityAuthority} from './types';

export interface EvidenceObjectAuthority {
  schemaVersion:'giza.evidence-object-authority.v1';objectId:string;authority:RealityAuthority;
  geometryAuthority:'ILLUSTRATIVE_RECONSTRUCTION'|'HYPOTHETICAL_GEOMETRY';
  coordinateFrame:string;positionUncertainty:'UNKNOWN';surfaceSurvey:'NOT_ESTABLISHED';
  observationIds:string[];evidenceIds:string[];reason:string;
}
export type RealityLayers=Record<RealityAuthority,boolean>;
/** Old scalar/provenance labels cannot turn generated display meshes into observed surfaces. */
export function legacyObjectAuthority(part:Part):EvidenceObjectAuthority {
  const speculative=['UNVERIFIED','ASSUMED','SIMULATED'].includes(part.provenance.class);
  return {schemaVersion:'giza.evidence-object-authority.v1',objectId:part.id,authority:speculative?'HYPOTHESIS':'RECONSTRUCTED',
    geometryAuthority:speculative?'HYPOTHETICAL_GEOMETRY':'ILLUSTRATIVE_RECONSTRUCTION',coordinateFrame:'frame.khafre.monument.legacy',positionUncertainty:'UNKNOWN',surfaceSurvey:'NOT_ESTABLISHED',observationIds:[],evidenceIds:[...(part.provenance.evidence_ids??[])],
    reason:speculative?'Legacy speculative / assumed geometry retains hypothesis authority.':'Existing display geometry is derived even when its dimensions carry measured provenance. No registered survey surface is established.'};
}
export function sphinxObjectAuthority(regionId:string):EvidenceObjectAuthority {
  const synthetic=regionId==='repairs';
  return {schemaVersion:'giza.evidence-object-authority.v1',objectId:`sphinx.${regionId}`,authority:synthetic?'HYPOTHESIS':'RECONSTRUCTED',geometryAuthority:synthetic?'HYPOTHETICAL_GEOMETRY':'ILLUSTRATIVE_RECONSTRUCTION',coordinateFrame:'frame.sphinx.illustrative.local',positionUncertainty:'UNKNOWN',surfaceSurvey:'NOT_ESTABLISHED',observationIds:[],evidenceIds:[],
    reason:synthetic?'Synthetic repair-block arrangement is not a historical stone inventory or a measured restoration phase.':'Manually photo-informed/procedural display geometry; published overall dimensions do not register local faces or establish metric surface authority.'};
}
export function objectVisibleInRealityLayer(object:EvidenceObjectAuthority,layers:Readonly<RealityLayers>):boolean {return layers[object.authority]===true;}
export const DEFAULT_REALITY_LAYERS:Readonly<RealityLayers>={OBSERVED:true,RECONSTRUCTED:true,HYPOTHESIS:false};
