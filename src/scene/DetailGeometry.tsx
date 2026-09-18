import { useEffect, useMemo } from 'react';
import { Edges, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { ModelBundle } from '../lib/model';
import { burialDimensions, lowerDimensions, pinMarkers } from '../lib/componentDetails';
import { GraniteMaterial } from './DetailMaterial';

type V3 = [number, number, number];
export function Dimension({ a, b, label }: { a: V3; b: V3; label: string }) {
  return <group>
    <Line points={[a, b]} color="#ebc16f" lineWidth={1} />
    {[a,b].map((p,i) => <mesh key={i} position={p}><sphereGeometry args={[.025,8,8]}/><meshBasicMaterial color="#ebc16f"/></mesh>)}
    <Html center position={a.map((v,i)=>(v+b[i])/2) as V3}><span className="detailDimension">{label}</span></Html>
  </group>;
}

function Block({ size, at, color = '#bba276', onClick }: { size: V3; at: V3; color?: string; onClick?: () => void }) {
  return <mesh position={at} onClick={e=>{if(onClick){e.stopPropagation();onClick();}}} receiveShadow>
    <boxGeometry args={size}/><meshStandardMaterial color={color} roughness={.86}/>
    <Edges color="#766347" threshold={30}/>
  </mesh>;
}

export function BurialDetail({ model, room, lidLift, dimensions, roof, survey, focusId, onSelect,explosion=0 }: {
  explosion?:number;model: ModelBundle; room: boolean; lidLift: number; dimensions: boolean; roof: boolean; survey:boolean; focusId: string; onSelect: (id:string)=>void;
}) {
  const d = useMemo(()=>burialDimensions(model),[model]);
  const x = room ? -d.length/2+d.westClearance+d.outerWidth/2 : 0;
  const y = room ? d.width/2-d.northClearance-d.outerLength/2 : 0;
  // Local Z=0 is the reconstructed floor / coffer rim, not the overview's legacy datum.
  const body = useMemo(()=>{
    const s = new THREE.Shape();
    const w=d.outerWidth/2,l=d.outerLength/2,iw=d.innerWidth/2,il=d.innerLength/2;
    s.moveTo(-w,-l);s.lineTo(w,-l);s.lineTo(w,l);s.lineTo(-w,l);s.closePath();
    const h = new THREE.Path();h.moveTo(-iw,-il);h.lineTo(-iw,il);h.lineTo(iw,il);h.lineTo(iw,-il);h.closePath();
    s.holes.push(h);
    return new THREE.ExtrudeGeometry(s,{depth:d.innerDepth,bevelEnabled:false,steps:1});
  },[d]);
  useEffect(()=>()=>body.dispose(),[body]);
  const onlyLid = !room && focusId === 'part.sarcophagus.lid';
  const select = (id:string) => (e: {stopPropagation:()=>void}) => {e.stopPropagation();onSelect(id);};
  const lidZ = onlyLid ? .15 : lidLift * 1.3 + d.lidThickness / 2 + .025;
  const labelLength=onlyLid?d.lidLength:d.outerLength,labelWidth=onlyLid?d.lidWidth:d.outerWidth;
  const labelZ=onlyLid?lidZ+d.lidThickness/2+.12:.12;
  return <group>
    {room && <RoomShell explosion={explosion} length={d.length} width={d.width} height={d.wallHeight} rise={d.rise} roof={roof}
      hole={{x,y,width:d.outerWidth+.035,length:d.outerLength+.035}}
      door={{start:d.length/2-d.doorEnd,end:d.length/2-d.doorStart}} onSelect={onSelect}/>}
    <group position={[x,y,0]}>
      {survey&&!onlyLid&&pinMarkers(model).map(p=><group key={p.label} position={[p.x,p.y,.012]}>
        <mesh><ringGeometry args={[p.diameter/2,p.diameter/2+.004,32]}/><meshBasicMaterial color="#ffbe58" side={THREE.DoubleSide}/></mesh>
        <Line points={[[0,0,.01],[-.72,0,.05]]} color="#ffbe58" lineWidth={1}/>
        <Html position={[-1.1,0,.05]} center><span className="detailDimension pinSurveyNote">{p.label} · Ø {(p.diameter*1000).toFixed(2)} mm<br/>Transcript marker · depth unknown</span></Html>
      </group>)}
      {!onlyLid && <group onClick={select('part.sarcophagus.body')}>
        <mesh geometry={body} position={[0,0,-d.innerDepth]}><GraniteMaterial/><Edges color="#a08c68" threshold={35}/></mesh>
        <mesh position={[0,0,-d.innerDepth-(d.outerHeight-d.innerDepth)/2]}>
          <boxGeometry args={[d.outerWidth,d.outerLength,d.outerHeight-d.innerDepth]}/>
          {[0,1,2,3,4,5].map(face=><GraniteMaterial key={face} attach={`material-${face}`} rough={face===5}/>)}
        </mesh>
      </group>}
      {(onlyLid || lidLift>0) && <mesh position={[onlyLid?0:lidLift*.7,0,lidZ]} onClick={select('part.sarcophagus.lid')}>
        <boxGeometry args={[d.lidWidth,d.lidLength,d.lidThickness]}/><GraniteMaterial/><Edges color="#a08c68"/>
      </mesh>}
      {dimensions && <>
        <Dimension a={[-labelWidth/2-.3,-labelLength/2,labelZ]} b={[-labelWidth/2-.3,labelLength/2,labelZ]} label={`${labelLength.toFixed(3)} m · ${onlyLid?'lid':'outer'} length`}/>
        <Dimension a={[-labelWidth/2,-labelLength/2-.3,labelZ]} b={[labelWidth/2,-labelLength/2-.3,labelZ]} label={`${labelWidth.toFixed(3)} m`}/>
        {!room&&!onlyLid && <Dimension a={[d.outerWidth/2+.28,d.outerLength/2,-d.outerHeight]} b={[d.outerWidth/2+.28,d.outerLength/2,0]} label={`${d.outerHeight.toFixed(3)} m`}/>}
      </>}
    </group>
    {room && dimensions && <Dimension a={[-d.length/2,-d.width/2-.6,0]} b={[d.length/2,-d.width/2-.6,0]} label={`${d.length.toFixed(3)} m · room length (mean)`}/>}
  </group>;
}

export function LowerChamberDetail({model,height,dimensions,explosion=0}:{model:ModelBundle;height:number;dimensions:boolean;explosion?:number}) {
  const d=lowerDimensions(model);
  return <>
    <RoomShell length={d.length} width={d.width} height={height} eastDoor={{start:d.doorStart,end:d.doorEnd}}/>
    {dimensions&&<>
      <Dimension a={[-d.length/2,-d.width/2-.4,0]} b={[d.length/2,-d.width/2-.4,0]} label={`${d.length.toFixed(3)} m · mean length`}/>
      <Dimension a={[d.length/2+.3,d.doorStart,.08]} b={[d.length/2+.3,d.doorEnd,.08]} label={`${d.doorWidth.toFixed(3)} m · doorway plan`}/>
    </>}
  </>;
}

export function RoomShell({length:L,width:W,height:H,rise=0,roof=false,hole,door,eastDoor,onSelect,explosion=0}:{
  explosion?:number;length:number;width:number;height:number;rise?:number;roof?:boolean;
  hole?:{x:number;y:number;width:number;length:number};door?:{start:number;end:number};eastDoor?:{start:number;end:number};onSelect?:(id:string)=>void;
}) {
  const floor = useMemo(()=>{
    const s=new THREE.Shape();s.moveTo(-L/2,-W/2);s.lineTo(L/2,-W/2);s.lineTo(L/2,W/2);s.lineTo(-L/2,W/2);s.closePath();
    if(hole){const h=new THREE.Path(),x=hole.x,y=hole.y,w=hole.width/2,l=hole.length/2;
      h.moveTo(x-w,y-l);h.lineTo(x-w,y+l);h.lineTo(x+w,y+l);h.lineTo(x+w,y-l);h.closePath();s.holes.push(h);}
    return new THREE.ShapeGeometry(s);
  },[L,W,hole?.x,hole?.y,hole?.width,hole?.length]);
  useEffect(()=>()=>floor.dispose(),[floor]);
  return <group>
    <mesh position={[0,0,-explosion]} geometry={floor} onClick={e=>{e.stopPropagation();onSelect?.('part.burial.floor_paving');}}>
      <meshStandardMaterial color="#aa9270" roughness={.96} side={THREE.DoubleSide}/>
    </mesh>
    {eastDoor ? <>
      <Block size={[.16,eastDoor.start+W/2,H]} at={[L/2+.08+explosion,(eastDoor.start-W/2)/2,H/2]}/>
      <Block size={[.16,W/2-eastDoor.end,H]} at={[L/2+.08+explosion,(eastDoor.end+W/2)/2,H/2]}/>
    </> : <Block size={[.16,W,H]} at={[L/2+.08+explosion,0,H/2]} onClick={()=>onSelect?.('part.burial.chamber')}/>}
    <Block size={[.16,W,H]} at={[-L/2-.08-explosion,0,H/2]} onClick={()=>onSelect?.('part.burial.chamber')}/>
    {door ? <>
      <Block size={[door.start+L/2,.16,H]} at={[(door.start-L/2)/2,W/2+.08+explosion,H/2]}/>
      <Block size={[L/2-door.end,.16,H]} at={[(door.end+L/2)/2,W/2+.08+explosion,H/2]}/>
      <Block size={[door.end-door.start,.16,H-1.805]} at={[(door.start+door.end)/2,W/2+.08+explosion,(H+1.805)/2]}/>
    </> : <Block size={[L,.16,H]} at={[0,W/2+.08+explosion,H/2]}/>}
    {/* South wall omitted for a readable cutaway; no invented beam joints. */}
    <Line points={[[-L/2,-W/2,0],[L/2,-W/2,0],[L/2,W/2,0],[-L/2,W/2,0],[-L/2,-W/2,0]]} color="#ebc16f"/>
    {rise>0 && <>
      {[-L/2,L/2].map((x,i)=><Line key={i} points={[[x,-W/2,H],[x,0,H+rise],[x,W/2,H]]} color="#ccab70" dashed dashSize={.16} gapSize={.1}/>)}
      {roof && [-1,1].map(side=><mesh key={side} position={[0,side*W/4,H+rise/2+explosion]} rotation={[side===1?-Math.atan2(rise,W/2):Math.atan2(rise,W/2),0,0]} onClick={e=>{e.stopPropagation();onSelect?.('part.burial.gable_envelope');}}>
        <planeGeometry args={[L,Math.hypot(W/2,rise)]}/><meshStandardMaterial color="#d9c297" side={THREE.DoubleSide} transparent opacity={.45} depthWrite={false}/>
      </mesh>)}
    </>}
  </group>;
}
