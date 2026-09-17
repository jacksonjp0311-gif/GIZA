import type { IntentSynthesisRow } from '../lib/model';
import type { ActionGraphMapData, RoomGraphMapData, VisibilityLabMapData, MetricReadinessMapData, AtlasLayerKey, GeologyMapData, HistoryMapData, IntentMapData, PhotoCoverageMapData, PlateauMapData, RitualMapData, SurveyMapData } from './types';

const enabled=(layers:Record<AtlasLayerKey,boolean>, key:AtlasLayerKey)=>layers[key];

function MapGrid(){
  return <g className="mapGrid">{Array.from({length:11},(_,i)=><g key={i}><line x1={50+i*90} y1="35" x2={50+i*90} y2="585"/><line x1="50" y1={35+i*55} x2="950" y2={35+i*55}/></g>)}</g>;
}
function CornerTicks(){return <g className="mapCornerTicks"><path d="M55 70V45H80 M920 45h25v25 M55 550v25h25 M920 575h25v-25"/></g>}
function SourceGlyph({x,y}:{x:number;y:number}){return <g className="sourceGlyph" transform={`translate(${x} ${y})`}><circle r="6"/><path d="M-2-2L2 2M2-2L-2 2"/></g>}

export function PlateauMasterMap({data,layers,onSelectPart}:{data:PlateauMapData;layers:Record<AtlasLayerKey,boolean>;onSelectPart:(id:string)=>void}){
  const points=Object.fromEntries(data.features.map(f=>[f.id,{x:75+f.x*8.3,y:48+f.y*5.15}]));
  return <svg className="nexusMapSvg" viewBox="0 0 1000 620" role="img" aria-label="Giza plateau schematic map">
    <defs><radialGradient id="plateauGlow"><stop offset="0" stopColor="#0b3043"/><stop offset="1" stopColor="#031018"/></radialGradient><filter id="cyanGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <rect width="1000" height="620" fill="url(#plateauGlow)"/><MapGrid/><CornerTicks/>
    {enabled(layers,'geology') && <g className="contours"><ellipse cx="470" cy="315" rx="355" ry="230"/><ellipse cx="470" cy="315" rx="300" ry="190"/><ellipse cx="470" cy="315" rx="240" ry="150"/><path d="M80 475 C230 435 315 470 430 448 S700 390 930 420"/></g>}
    {enabled(layers,'ritual') && data.connections.map((c,i)=>{const a=points[c.from],b=points[c.to];return a&&b?<g key={i} className="mapConnection"><line x1={a.x} y1={a.y} x2={b.x} y2={b.y}/><text x={(a.x+b.x)/2} y={(a.y+b.y)/2-8}>{c.label}</text></g>:null})}
    {enabled(layers,'monuments') && data.features.map(f=>{const p=points[f.id]; const active=f.id==='khafre';return <g key={f.id} className={`mapFeature ${f.kind} ${active?'active':''}`} transform={`translate(${p.x} ${p.y})`} onClick={()=>f.part_id&&onSelectPart(f.part_id)}>
      {f.kind==='pyramid'?<><polygon points={`0,${-f.size*2.6} ${f.size*2.2},${f.size*1.7} ${-f.size*2.2},${f.size*1.7}`}/><polygon className="mapInner" points={`0,${-f.size*1.8} ${f.size*1.5},${f.size*1.2} ${-f.size*1.5},${f.size*1.2}`}/></>:f.kind==='sphinx'?<><ellipse rx={f.size*2.1} ry={f.size*.8}/><circle cx={f.size*2.0} cy={-f.size*.15} r={f.size*.55}/></>:<rect x={-f.size*2} y={-f.size} width={f.size*4} height={f.size*2} rx="2"/>}
      <text y={f.kind==='pyramid'?f.size*3.2:f.size*2.5}>{f.label}</text><text className="mapSmall" y={f.kind==='pyramid'?f.size*3.2+14:f.size*2.5+14}>{f.status}</text>
      {enabled(layers,'sources')&&<SourceGlyph x={f.size*2.3} y={-f.size*1.6}/>}</g>})}
    <g className="northArrow" transform="translate(900 92)"><path d="M0 34L0-24M0-24L-10-4M0-24L10-4"/><text x="0" y="-36">N</text></g>
    <text className="mapWatermark" x="75" y="560">SCHEMATIC CONTEXT · NOT SURVEY GEOMETRY</text>
  </svg>
}

export function RitualRouteMap({data,layers,onSelectPart}:{data:RitualMapData;layers:Record<AtlasLayerKey,boolean>;onSelectPart:(id:string)=>void}){
  const pts=data.stages.map(s=>({s,x:80+s.x*8.4,y:45+s.y*5.25}));
  const path=pts.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.y}`).join(' ');
  return <svg className="nexusMapSvg ritualSvg" viewBox="0 0 1000 620"><rect width="1000" height="620" className="mapBase"/><MapGrid/><CornerTicks/>
    {enabled(layers,'ritual')&&<><path className="ritualRouteShadow" d={path}/><path className="ritualRoute" d={path}/></>}
    {pts.map(({s,x,y},i)=><g key={s.id} className={`ritualStage stage${i+1}`} transform={`translate(${x} ${y})`} onClick={()=>s.part_id&&onSelectPart(s.part_id)}>
      <circle className="stageRing" r="28"/><circle className="stageCore" r="8"/><text className="stageNo" x="0" y="4">{s.order}</text><text className="stageLabel" x="38" y="-5">{s.label}</text><text className="stageRole" x="38" y="12">{s.role}</text><text className="stageEvidence" x="38" y="28">{s.evidence}</text>
      {enabled(layers,'sources')&&<SourceGlyph x={-22} y={-23}/>}</g>)}
    <g className="ritualAxis"><text x="95" y="535">LOWER THRESHOLD</text><line x1="95" y1="545" x2="855" y2="545"/><path d="M855 545l-16-8v16z"/><text x="790" y="530">ASCENT / TRANSITION / CULT</text></g>
    <text className="mapWatermark" x="75" y="585">EVIDENCE-LINKED PROCESSIONAL RECONSTRUCTION · NOT RECOVERED TESTIMONY</text>
  </svg>
}


export function ActionGraphMap({data,layers}:{data:ActionGraphMapData;layers:Record<AtlasLayerKey,boolean>}){
  const point=Object.fromEntries(data.nodes.map(n=>[n.id,{x:70+n.x*8.7,y:50+n.y*6.45,n}]));
  return <svg className="nexusMapSvg actionGraphSvg" viewBox="0 0 1000 620" role="img" aria-label="Khafre place action graph">
    <rect width="1000" height="620" className="mapBase"/><MapGrid/><CornerTicks/>
    <defs><marker id="actionArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" className="actionArrowHead"/></marker></defs>
    {enabled(layers,'action')&&data.edges.map((e,i)=>{const a=point[e.from],b=point[e.to];if(!a||!b)return null;return <g key={`${e.from}-${e.to}-${i}`} className={`actionEdge ${e.status.toLowerCase().replaceAll('_','-')}`}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} markerEnd="url(#actionArrow)"/><text x={(a.x+b.x)/2} y={(a.y+b.y)/2-8}>{e.relation}</text></g>})}
    {data.nodes.map(n=>{const p=point[n.id];const action=n.kind==='ACTION';return <g key={n.id} className={`actionNode ${action?'action':'place'} ${n.epistemic_status.toLowerCase().replaceAll('_','-')}`} transform={`translate(${p.x} ${p.y})`}>
      {action?<polygon points="0,-28 42,0 0,28 -42,0"/>:<rect x="-52" y="-25" width="104" height="50" rx="7"/>}
      <text className="actionNodeLabel" y="-3">{n.label}</text><text className="mapSmall" y="13">{n.epistemic_status}</text>
      {enabled(layers,'sources')&&<SourceGlyph x={action?34:45} y={-20}/>} {enabled(layers,'uncertainty')&&<circle className="actionStrengthRing" r={action?34:42} strokeDasharray={`${Math.round(n.evidence_strength_index*100)} 100`}/>} 
    </g>})}
    <g className="actionLegend" transform="translate(75 540)"><text>PLACE</text><rect x="52" y="-15" width="44" height="22" rx="4"/><text x="125">ACTION</text><polygon points="190,-16 210,-4 190,8 170,-4"/><text x="235">EVIDENCE STRENGTH RING = TRIAGE, NOT PROBABILITY</text></g>
    <text className="mapWatermark" x="75" y="585">SOURCE-ADDRESSED BEHAVIORAL RECONSTRUCTION · NOT A RECOVERED RITUAL SCRIPT</text>
  </svg>
}


export function RoomGraphMap({data,layers}:{data:RoomGraphMapData;layers:Record<AtlasLayerKey,boolean>}){
  const pts=Object.fromEntries(data.spaces.map(s=>[s.id,{x:65+s.x*8.7,y:35+s.y*5.55,s}]));
  const complexLabel:Record<string,string>={VALLEY_TEMPLE:'VALLEY TEMPLE',CAUSEWAY:'CAUSEWAY',PYRAMID_TEMPLE:'PYRAMID TEMPLE',PYRAMID_INTERIOR:'PYRAMID INTERIOR'};
  return <svg className="nexusMapSvg roomGraphSvg" viewBox="0 0 1000 620" role="img" aria-label="Khafre source addressed room graph">
    <rect width="1000" height="620" className="mapBase"/><MapGrid/><CornerTicks/>
    <defs><marker id="roomArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" className="roomArrowHead"/></marker></defs>
    {enabled(layers,'rooms')&&data.thresholds.map((t,i)=>{const a=pts[t.from],b=pts[t.to];if(!a||!b)return null;return <g key={t.id} className={`roomThreshold ${t.status.toLowerCase().replaceAll('_','-')}`}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} markerEnd="url(#roomArrow)"/><text x={(a.x+b.x)/2} y={(a.y+b.y)/2-6}>{t.kind}</text></g>})}
    {enabled(layers,'monuments')&&['VALLEY_TEMPLE','CAUSEWAY','PYRAMID_TEMPLE','PYRAMID_INTERIOR'].map((c,i)=><text key={c} className="roomComplexLabel" x={90+i*230} y="65">{complexLabel[c]}</text>)}
    {data.spaces.map(s=>{const p=pts[s.id];return <g key={s.id} className={`roomNode ${s.complex.toLowerCase().replaceAll('_','-')} ${s.kind.toLowerCase()}`} transform={`translate(${p.x} ${p.y})`}>
      <rect x="-48" y="-18" width="96" height="36" rx="5"/><text className="roomNodeLabel" y="-2">{s.label}</text><text className="mapSmall" y="11">{s.kind}</text>
      {enabled(layers,'sources')&&<SourceGlyph x={40} y={-14}/>}{enabled(layers,'uncertainty')&&String(s.status).includes('RECON')&&<circle className="roomUncertainty" r="29"/>}
    </g>})}
    <g className="roomLegend" transform="translate(72 542)"><text>CYAN = SOURCE-BACKED / TOPOLOGICAL</text><text x="290">AMBER RING = RECONSTRUCTION / UNCERTAINTY</text><text x="655">ARROWS = THRESHOLDS, NOT RITUAL COMMANDS</text></g>
    <text className="mapWatermark" x="72" y="585">SCHEMATIC ROOM TOPOLOGY · NOT A SURVEY PLAN · SOURCE-BYTE PARSE PENDING</text>
  </svg>
}

export function VisibilityLabMap({data,layers}:{data:VisibilityLabMapData;layers:Record<AtlasLayerKey,boolean>}){
  const pts=Object.fromEntries(data.spaces.map(s=>[s.id,{x:65+s.x*8.7,y:35+s.y*5.55,s}]));
  const maxDepth=Math.max(1,...data.spaces.map(s=>s.topological_depth??0));
  return <svg className="nexusMapSvg visibilityLabSvg" viewBox="0 0 1000 620" role="img" aria-label="Khafre premetric visibility and access lab">
    <rect width="1000" height="620" className="mapBase"/><MapGrid/><CornerTicks/>
    <defs><marker id="visibilityArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" className="visibilityArrowHead"/></marker></defs>
    {enabled(layers,'visibility')&&data.thresholds.map(t=>{const a=pts[t.from],b=pts[t.to];if(!a||!b)return null;const tr=data.transitions.find(x=>x.threshold_id===t.id);return <g key={t.id} className={`visibilityEdge contrast-${(tr?.contrast_class??'LOW').toLowerCase()}`}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} markerEnd="url(#visibilityArrow)"/><text x={(a.x+b.x)/2} y={(a.y+b.y)/2-6}>{tr?.contrast_class??'LOW'} Δ</text></g>})}
    {data.spaces.map(s=>{const p=pts[s.id],depth=s.topological_depth??0;const r=18+Math.min(18,depth/maxDepth*18);return <g key={s.id} className={`visibilityNode ${s.is_articulation?'chokepoint':''} ${s.environment.toLowerCase().replaceAll(' ','-').replaceAll('/','-')}`} transform={`translate(${p.x} ${p.y})`}>
      <circle className="visibilityDepthRing" r={r}/><circle className="visibilityCore" r="12"/><text className="visibilityLabel" y="-20">{s.label}</text><text className="mapSmall" y="3">D{s.topological_depth??'?'}</text><text className="visibilityState" y="26">{s.visibility_state}</text>
      {s.is_branch&&<path className="branchGlyph" d="M-7-8L0-14L7-8"/>}{s.is_articulation&&<circle className="chokeRing" r={r+6}/>} {enabled(layers,'sources')&&<SourceGlyph x={r-2} y={-r+2}/>} 
    </g>})}
    <g className="visibilityLegend" transform="translate(70 532)"><text>RING SIZE = TOPOLOGICAL DEPTH</text><text x="235">AMBER HALO = ARTICULATION / CHOKEPOINT</text><text x="570">EDGE Δ = QUALITATIVE ENVIRONMENT CHANGE</text></g>
    <text className="mapWatermark" x="70" y="585">PREMETRIC VISIBILITY / ACCESS LAB · 0 METRIC RAYS · NO ANCIENT EXPERIENCE CLAIM</text>
  </svg>
}


export function MetricReadinessMap({data,layers}:{data:MetricReadinessMapData;layers:Record<AtlasLayerKey,boolean>}){
  const stateClass=(s:string)=>s.toLowerCase().replaceAll('_','-');
  return <svg className="nexusMapSvg metricReadinessSvg" viewBox="0 0 1000 620" role="img" aria-label="Metric plan registration readiness">
    <rect width="1000" height="620" className="mapBase"/><MapGrid/><CornerTicks/>
    <text x="78" y="82" className="timelineTitle">SOURCE BYTES → REGISTRATION → METRIC VIEW</text>
    <text x="78" y="105" className="mapSmall">WORKFLOW READINESS ONLY · NOT EVIDENCE CONFIDENCE</text>
    {enabled(layers,'metric')&&data.targets.map((t,i)=>{const y=155+i*92;const w=520;return <g key={t.id} className={`metricTarget ${stateClass(t.state)}`}>
      <text x="82" y={y} className="metricTargetLabel">{t.target}</text>
      <rect x="82" y={y+16} width={w} height="16" rx="3" className="metricTrack"/>
      <rect x="82" y={y+16} width={w*Math.max(0,Math.min(1,t.progress))} height="16" rx="3" className="metricFill"/>
      <text x="620" y={y+29} className="metricPercent">{Math.round(t.progress*100)}%</text>
      <text x="82" y={y+51} className="mapSmall">{t.state}</text>
      {enabled(layers,'uncertainty')&&<text x="360" y={y+51} className="metricBlockers">BLOCK: {t.blocking.join(' · ')}</text>}
    </g>})}
    <g className="metricZeroGate" transform="translate(755 172)"><rect x="-5" y="-30" width="185" height="250" rx="7"/><text x="15" y="2">METRIC GATE</text><text x="15" y="42" className="metricBig">{data.registered_plan_count}</text><text x="15" y="60">REGISTERED PLANS</text><text x="15" y="112" className="metricBig">{data.metric_ray_count}</text><text x="15" y="130">VISIBILITY RAYS</text><line x1="15" y1="157" x2="155" y2="157"/><text x="15" y="185">NO SOURCE BYTES</text><text x="15" y="202">NO METRIC CLAIM</text></g>
    <text className="mapWatermark" x="78" y="585">REGISTRATION READINESS · ZERO METRIC RAYS UNTIL BYTE + FRAME + RESIDUAL GATES PASS</text>
  </svg>
}

export function SurveyControlMap({data,layers}:{data:SurveyMapData;layers:Record<AtlasLayerKey,boolean>}){
  const es=data.points.map(p=>p.e), ns=data.points.map(p=>p.n); const minE=Math.min(...es),maxE=Math.max(...es),minN=Math.min(...ns),maxN=Math.max(...ns);
  const px=(e:number)=>95+(e-minE)/(maxE-minE)*650; const py=(n:number)=>510-(n-minN)/(maxN-minN)*410;
  return <svg className="nexusMapSvg surveySvg" viewBox="0 0 1000 620"><rect width="1000" height="620" className="mapBase"/><MapGrid/><CornerTicks/>
    <g className="surveyAxes"><line x1="95" y1="510" x2="775" y2="510"/><line x1="95" y1="510" x2="95" y2="75"/><text x="690" y="540">EASTING · GPMP NATIVE</text><text transform="translate(65 250) rotate(-90)">NORTHING · GPMP NATIVE</text></g>
    {enabled(layers,'survey')&&data.points.map((p,i)=><g key={p.id} className={`surveyPoint ${p.kind==='PUBLISHED_VARIANT'?'variant':''}`} transform={`translate(${px(p.e)} ${py(p.n)})`}><circle r={p.kind==='FRAME_ORIGIN'?10:7}/><line x1="-14" y1="0" x2="14" y2="0"/><line x1="0" y1="-14" x2="0" y2="14"/><text x="16" y={i%2?18:-12}>{p.label}</text><text className="mapSmall" x="16" y={i%2?32:2}>{p.e.toFixed(3)} E · {p.n.toFixed(3)} N</text></g>)}
    <g className="orientationInset" transform="translate(850 180)"><circle r="86"/><circle r="58"/><line x1="0" y1="75" x2="0" y2="-75"/><line x1="-75" y1="0" x2="75" y2="0"/><g transform={`rotate(${data.orientation_prior.yaw_deg})`}><line className="orientationPrior" x1="0" y1="70" x2="0" y2="-70"/><path className="orientationPrior" d="M0-70l-7 14h14z"/></g><text y="-100">KHAFRE ORIENTATION PRIOR</text><text className="orientationValue" y="112">{data.orientation_prior.yaw_arcmin.toFixed(2)}′</text><text y="130">RMS {data.orientation_prior.rms_side_residual_arcmin.toFixed(3)}′ · N={data.orientation_prior.measured_point_count}</text></g>
    {enabled(layers,'uncertainty')&&<g className="unresolvedBanner"><rect x="800" y="350" width="160" height="105" rx="5"/><text x="815" y="375">TRANSFORM GATE</text><text x="815" y="397">TRANSLATION</text><text className="mapStrong" x="815" y="416">UNRESOLVED</text><text x="815" y="440">VERTICAL DATUM</text><text className="mapStrong" x="815" y="459">UNRESOLVED</text></g>}
    <text className="mapWatermark" x="95" y="585">METRIC CONTROL · SOURCE FRAME PRESERVED · KHAFRE LOCAL TRANSLATION NOT SOLVED</text>
  </svg>
}

export function GeologyQuarryMap({data,layers}:{data:GeologyMapData;layers:Record<AtlasLayerKey,boolean>}){
  return <svg className="nexusMapSvg geologySvg" viewBox="0 0 1000 620"><rect width="1000" height="620" className="mapBase"/><MapGrid/><CornerTicks/>
    {enabled(layers,'geology')&&data.bands.map((b,i)=>{const y=75+b.y*4.7,h=b.thickness*3;return <g key={b.id} className={`geoBand band${i}`}><path d={`M70 ${y} C260 ${y-22} 410 ${y+18} 590 ${y-6} S850 ${y-16} 930 ${y} L930 ${y+h} C720 ${y+h+14} 570 ${y+h-8} 370 ${y+h+8} S150 ${y+h+8} 70 ${y+h}Z`}/><text x="95" y={y+h/2+4}>{b.label}</text><text className="mapSmall" x="710" y={y+h/2+4}>{b.truth}</text></g>})}
    {enabled(layers,'monuments')&&<g className="geoMonuments"><polygon points="370,260 490,70 610,260"/><rect x="696" y="402" width="88" height="44"/><ellipse cx="640" cy="400" rx="55" ry="23"/><text x="408" y="285">KHAFRE</text><text x="692" y="465">LOWER TEMPLES</text><text x="602" y="438">SPHINX</text></g>}
    {data.sequence.map((s,i)=><g key={i} className="sequenceCallout"><path d="M210 305 C365 350 480 370 620 386"/><circle cx="210" cy="305" r="6"/><circle cx="620" cy="386" r="6"/><text x="190" y="330">CAUSEWAY FOUNDATION</text><text x="515" y="366">PRECEDES QUARRY CUT</text></g>)}
    <text className="mapWatermark" x="75" y="585">GEOARCHAEOLOGICAL RELATIONSHIP MAP · NOT A METRIC STRATIGRAPHIC MODEL</text>
  </svg>
}

export function HistoricalMap({data,layers}:{data:HistoryMapData;layers:Record<AtlasLayerKey,boolean>}){
  const min=1810,max=2030; const x=(y:number)=>100+(y-min)/(max-min)*800;
  return <svg className="nexusMapSvg historySvg" viewBox="0 0 1000 620"><rect width="1000" height="620" className="mapBase"/><MapGrid/><CornerTicks/><line className="timeAxis" x1="100" y1="310" x2="900" y2="310"/>
    {enabled(layers,'sources')&&data.events.map((e,i)=>{const xx=x(e.year), top=i%2===0; return <g key={`${e.year}-${e.label}`} className="timeEvent"><line x1={xx} y1="310" x2={xx} y2={top?155:465}/><circle cx={xx} cy="310" r="8"/><text className="eventYear" x={xx} y={top?135:500}>{e.year}</text><text className="eventLabel" transform={`translate(${xx+(top?-8:8)} ${top?155:465}) rotate(${top?-42:42})`}>{e.label}</text><text className="mapSmall" x={xx+(top?-8:8)} y={top?178:442}>{e.status}</text></g>})}
    <text x="100" y="90" className="timelineTitle">OBSERVATION / SURVEY / RECORDING STACK</text><text className="mapWatermark" x="100" y="565">HISTORY OF DOCUMENTATION · NOT A CONSTRUCTION CHRONOLOGY</text>
  </svg>
}

export function IntentEvidenceMap({data,layers,synthesis}:{data:IntentMapData;layers:Record<AtlasLayerKey,boolean>;synthesis:IntentSynthesisRow[]}){
  const rows=data.hypothesis_ids.map(id=>synthesis.find(s=>s.hypothesis_id===id)).filter(Boolean) as IntentSynthesisRow[];
  const coords=[[500,105],[740,170],[825,350],[700,505],[300,505],[175,350],[260,170],[500,530]];
  return <svg className="nexusMapSvg intentSvg" viewBox="0 0 1000 620"><rect width="1000" height="620" className="mapBase"/><MapGrid/><CornerTicks/>
    {enabled(layers,'intent')&&<><g className="intentCenter"><circle cx="500" cy="315" r="84"/><circle cx="500" cy="315" r="62"/><text x="500" y="305">KHAFRE</text><text x="500" y="326">COMPLEX</text><text className="mapSmall" x="500" y="348">WHAT INTENTION BEST EXPLAINS THE WHOLE?</text></g>
    {rows.map((r,i)=>{const [x,y]=coords[i];const bal=Math.max(0,Math.min(1,r.evidence_balance_index)); const statusClass=r.prior_status.toLowerCase().replaceAll('_','-');return <g key={r.hypothesis_id} className={`intentNode ${statusClass}`}><line x1="500" y1="315" x2={x} y2={y}/><circle cx={x} cy={y} r={38+18*r.coverage_index}/><text x={x} y={y-5}>{r.label.toUpperCase()}</text><text className="mapSmall" x={x} y={y+12}>{r.prior_status}</text><rect x={x-42} y={y+27} width="84" height="5" rx="2"/><rect className="intentBalance" x={x-42} y={y+27} width={84*bal} height="5" rx="2"/></g>})}</>}
    <text className="mapWatermark" x="75" y="585">EVIDENCE-BALANCE TRIAGE · SCORES ARE NOT PROBABILITIES</text>
  </svg>
}

export function PhotoCoverageMap({data,layers}:{data:PhotoCoverageMapData;layers:Record<AtlasLayerKey,boolean>}){
  const max=Math.max(...data.coverage.map(c=>c.reviewed_assets));
  return <svg className="nexusMapSvg photoSvg" viewBox="0 0 1000 620"><rect width="1000" height="620" className="mapBase"/><MapGrid/><CornerTicks/>
    <text x="90" y="90" className="timelineTitle">OPEN-MEDIA COVERAGE / REGISTRATION READINESS</text>
    {enabled(layers,'photos')&&data.coverage.map((c,i)=>{const y=145+i*80;return <g key={c.target} className="coverageRow"><text x="90" y={y}>{c.target}</text><rect x="330" y={y-17} width="360" height="22" rx="3"/><rect className="coverageFill" x="330" y={y-17} width={360*c.reviewed_assets/max} height="22" rx="3"/><text x="705" y={y}>{c.reviewed_assets} REVIEWED</text><text className="mapSmall" x="90" y={y+24}>{c.registration_state}</text></g>})}
    {enabled(layers,'uncertainty')&&<g className="photoGuard"><rect x="720" y="165" width="205" height="190" rx="6"/><text x="740" y="195">POSITION AUTHORITY</text><text className="mapStrong" x="740" y="225">0 SOLVED POSES</text><text x="740" y="250">PHOTO → GEOMETRY</text><text className="mapStrong" x="740" y="280">0 PROMOTIONS</text><text x="740" y="315">STATUS</text><text className="mapStrong" x="740" y="340">REGISTRATION PENDING</text></g>}
    <text className="mapWatermark" x="90" y="565">COVERAGE ≠ GEOREFERENCE · IMAGE AVAILABILITY DOES NOT CREATE CAMERA POSE</text>
  </svg>
}
