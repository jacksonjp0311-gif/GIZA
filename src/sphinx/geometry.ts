import * as THREE from 'three';

// Hand-shaped profiles informed by photographs, NOT sampled survey coordinates.
type Profile=number[][];
const signedPower=(v:number,p:number)=>Math.sign(v)*Math.pow(Math.abs(v),p);
const gaussian=(v:number,c:number,s:number)=>Math.exp(-(((v-c)/s)**2));
function sample(profile:Profile,value:number){
  let i=0;while(i<profile.length-2&&profile[i+1][0]<value)i++;
  const a=profile[i],b=profile[i+1],t=THREE.MathUtils.clamp((value-a[0])/(b[0]-a[0]),0,1);
  return a.map((_,j)=>{
    if(j===0)return value;
    const before=profile[Math.max(0,i-1)],after=profile[Math.min(profile.length-1,i+2)];
    const m0=(b[j]-before[j])/(b[0]-before[0])*(b[0]-a[0]);
    const m1=(after[j]-a[j])/(after[0]-a[0])*(b[0]-a[0]);
    return THREE.MathUtils.clamp((2*t**3-3*t*t+1)*a[j]+(t**3-2*t*t+t)*m0+(-2*t**3+3*t*t)*b[j]+(t**3-t*t)*m1,Math.min(a[j],b[j]),Math.max(a[j],b[j]));
  });
}
// Wrapped, shared-index rings avoid a lighting seam. Every loft is capped.
function surface(rings:number,sides:number,point:(t:number,a:number)=>number[]){
  const vertices:number[]=[],indices:number[]=[];
  for(let i=0;i<=rings;i++)for(let k=0;k<sides;k++){
    vertices.push(...point(i/rings,k/sides*Math.PI*2));
    if(i<rings){const p=i*sides+k,q=i*sides+(k+1)%sides;indices.push(p,q,p+sides,q,q+sides,p+sides);}
  }
  for(const end of [0,rings]){
    const center=[0,0,0],ci=vertices.length/3;
    for(let k=0;k<sides;k++)for(let j=0;j<3;j++)center[j]+=vertices[(end*sides+k)*3+j]/sides;
    vertices.push(...center);
    for(let k=0;k<sides;k++){const p=end*sides+k,q=end*sides+(k+1)%sides;indices.push(...(end===0?[ci,q,p]:[ci,p,q]));}
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();g.computeBoundingBox();return g;
}
function erosion(x:number,z:number,amount:number){
  // Broad weathered beds with subordinate irregularity; no per-stone assertion.
  return amount*(.58*Math.sin(z*3.8+.12*Math.sin(x*.3))+.24*Math.sin(z*7.3+x*.07)+.18*Math.sin(x*1.4+z*2.1));
}
export function bodyGeometry(){
  const profile=[[-33,1.6,.1,1.4],[-31,3.6,4.4,3.4],[-25,4.4,7.0,4.2],[-16,4.6,6.5,4.4],[-4,4.7,5.65,4.5],[7,5.0,5.4,4.8],[14,4.5,4.9,4.3],[19,3.2,1.4,3.0]];
  return surface(160,96,(t,a)=>{
    const [x,z,w,h]=sample(profile,-33+52*t),zz=z+h*signedPower(Math.sin(a),.76);
    const y=Math.max(.04,w+erosion(x,zz,.32))*signedPower(Math.cos(a),.72);
    return [x,y,Math.max(.12,zz+.065*Math.sin(x*.65)*Math.max(0,Math.sin(a)))];
  });
}
export function chestGeometry(){
  // Broad sloping shoulders narrowing into the surviving neck, not stacked spheres.
  const profile=[[.15,12.3,7.0,5.0],[2,13.1,7.0,5.3],[5,13.6,6.2,5.2],[8,13.5,5.6,4.5],[10,14.0,4.7,3.4],[12,15.9,3.25,2.65],[13.8,17.3,2.65,2.35],[15,18.1,2.0,2.1]];
  return surface(128,96,(t,a)=>{
    const [z,cx,rx,ry]=sample(profile,.15+14.85*t),wear=erosion(cx+Math.cos(a)*rx,z,.22)*(1-.7*t);
    return [cx+(rx+wear)*signedPower(Math.cos(a),.66),(ry+wear)*signedPower(Math.sin(a),.8),z];
  });
}
export function pawGeometry(side:number){
  const profile=[[9.5,2.6,1.6,2.45],[15,2.15,2.05,2.0],[24,1.9,2.15,1.75],[34,1.75,2.3,1.6],[38.8,1.65,2.35,1.5],[40,1.35,2.15,1.2],[40.5,1.0,1.85,.85]];
  return surface(120,80,(t,a)=>{
    const [x,cz,w,h]=sample(profile,9.5+31*t),y=w*signedPower(Math.cos(a),.48);
    let z=cz+h*signedPower(Math.sin(a),.55);
    // Recessed toe separations in one broad paw, not four floating ellipsoids.
    if(Math.sin(a)>0)for(const slot of [-1.15,0,1.15])z-=.16*gaussian(y,slot,.10)*gaussian(x,39.3,2.0);
    return [x,side*5+y,Math.max(.12,z)];
  });
}
export function nemesGeometry(side:number){
  const profile=[[12.35,17.5,2.0,3.45,4.7],[13.5,19.15,2.2,4.7,6.4],[15.5,19.65,2.45,4.45,5.6],[17.5,19.8,2.45,3.6,4.3],[19,19.6,1.8,2.7,2.9],[19.95,19.2,.45,1.7,2.0]];
  return surface(128,64,(t,angle)=>{
    const a=angle*side,[z,front,inner,outer,depth]=sample(profile,12.35+7.6*t);
    const u=(signedPower(Math.sin(a),.5)+1)/2,y=inner+(outer-inner)*u;
    const frontMask=Math.max(0,Math.cos(a));
    // Curving lappet surfaces and shallow bands are interpretive, not copied carving.
    const bands=.025*Math.sin(z*15.5+u*.3)*frontMask;
    const x=front-depth/2+depth/2*signedPower(Math.cos(a),.4)-.45*u*u+bands;
    return [x,side*y,z];
  });
}
export function tailGeometry(){return new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
  [-28,-3,2],[-31,-6,1.7],[-28,-8.4,1.3],[-22,-8.6,1.1],[-17,-7.7,1.2],[-15,-6.8,1.6],
].map(p=>new THREE.Vector3(...p))),64,.5,12,false);}

export function stelaGeometry(){
  // ARCE reports 3.5 m height; 2.4 m width / .65 m depth are display assumptions.
  const shape=new THREE.Shape();shape.moveTo(-1.2,0);shape.lineTo(1.2,0);shape.lineTo(1.2,2.3);shape.absarc(0,2.3,1.2,0,Math.PI,false);shape.lineTo(-1.2,0);
  const g=new THREE.ExtrudeGeometry(shape,{depth:.65,bevelEnabled:false,curveSegments:48});
  g.applyMatrix4(new THREE.Matrix4().set(0,0,1,22.675,1,0,0,0,0,1,0,0,0,0,0,1));g.computeBoundingBox();return g;
}

export function headGeometry(){
  const profile=[[13.8,19.15,1.45,1.45],[14.3,19.4,2.05,1.8],[15.2,19.35,2.3,2.05],[16.3,19.2,2.4,2.35],[17.5,19.0,2.55,2.4],[18.8,18.75,2.65,2.3],[19.65,18.5,2.35,2.0],[20,18.35,1.8,1.65]];
  return surface(144,128,(t,a)=>{
    const [z,cx,rx,ry]=sample(profile,13.8+6.2*t),c=Math.cos(a),y=ry*Math.sin(a);
    let x=cx+rx*signedPower(c,.42);
    const bump=(cy:number,cz:number,sy:number,sz:number)=>gaussian(y,cy,sy)*gaussian(z,cz,sz);
    if(c>0){let relief=0;
      for(const s of [-1,1]){
        relief-=.34*bump(s*1.08,17.65,.72,.31);
        relief+=.19*bump(s*1.08,17.98,.82,.15);
        relief+=.15*bump(s*1.08,17.64,.48,.105);
        relief+=.16*bump(s*1.37,16.7,.60,.5);
        relief-=.075*bump(s*.85,15.7,.16,.50);
      }
      relief+=.24*bump(0,17.5,.32,.45); // bridge remnant
      relief-=.33*bump(0,16.85,.44,.56); // broken nasal area, no restored tip
      relief+=.20*bump(0,15.55,1.05,.20);
      relief-=.15*bump(0,15.30,1.05,.07);
      relief+=.17*bump(0,15.08,.96,.18);
      relief+=.14*bump(0,14.50,.95,.22);
      x+=relief*Math.pow(c,3);
    }
    return [x,y,z];
  });
}
