// Display reconstruction only. These regions are NOT separate ancient bedrock pieces.
export type Vec3=[number,number,number];
export const SPHINX_SOURCES=[
  {title:'Egyptian State Information Service · overall size',url:'https://sis.gov.eg/en/egypt/tourism/famous-cities/giza/',note:'Published summary: approximately 73.5 m long and 20 m high. Not a point-cloud calibration.'},
  {title:'AERA · geology of the Sphinx',url:'https://aeraweb.org/geology-of-the-sphinx/',note:'Members I, II and III and the history of repairs. Display colors and layer boundaries are schematic.'},
  {title:'Ministry of Tourism and Antiquities · monument',url:'https://egymonuments.gov.eg/monuments/the-great-sphinx/',note:'Bedrock-carved lion and royal head; Dream Stela between the paws. No image or mesh redistribution claimed.'},
  {title:'AERA / ARCE · survey and photo archive',url:'https://aeraweb.org/publications/data/',note:'Plans, elevations, restoration drawings and photographs. Not yet registered to this reconstruction.'},
];
export const SPHINX_REGIONS=[
  {id:'core',name:'Bedrock body',color:'#c9a574',offset:[-8,0,3],target:[-8,0,5],radius:28,note:'Continuous carved limestone core. Erosion bands are procedural, not measured tool marks.'},
  {id:'chest',name:'Chest & neck',color:'#d4b786',offset:[7,0,7],target:[14,0,9],radius:12,note:'Sculpted transition into the head. Local proportions remain interpretation, not a registered elevation.'},
  {id:'head',name:'Head & face',color:'#ddbf8d',offset:[8,0,17],target:[19.3,0,16.9],radius:4.2,note:'Photo-informed brow, eye recesses, lips, jaw and broken nasal region. Local shape is interpretive; no intact nose or beard is asserted.'},
  {id:'nemes',name:'Nemes headdress',color:'#ceb17c',offset:[0,0,24],target:[17,0,16],radius:5.3,note:'Curved headdress lappets and shallow bands. Local silhouette is photo-informed, not a facsimile or registered survey.'},
  {id:'north-paw',name:'North foreleg & paw',color:'#d8bc8c',offset:[12,12,0],target:[28,5,2],radius:16,note:'Paw and foreleg envelope; toes and repair courses are illustrative.'},
  {id:'south-paw',name:'South foreleg & paw',color:'#d8bc8c',offset:[12,-12,0],target:[28,-5,2],radius:16,note:'Independent inspection region, not a separable original bedrock assembly.'},
  {id:'haunches',name:'Hindquarters',color:'#c2a072',offset:[-14,0,5],target:[-22,0,4],radius:15,note:'Rounded hind legs and rear anatomy. No per-stone survey alignment.'},
  {id:'tail',name:'Curved tail',color:'#b89968',offset:[-10,-12,3],target:[-23,-7,2],radius:13,note:'Simplified curved relief around the hindquarters; exact profile unmeasured here.'},
  {id:'stela',name:'Dream Stela',color:'#a5775c',offset:[22,0,4],target:[23,0,1.75],radius:3,note:'Height constrained to ARCE’s reported 3.5 m. Width, thickness and placement are illustrative. Open Hieroglyphs for original photographs, reading tools and clearly labeled predictions.'},
  {id:'repairs',name:'Repair masonry study',color:'#e1c897',offset:[0,0,0],target:[-5,0,3],radius:35,note:'Instanced synthetic blocks illustrate a repair skin. Not a historical stone inventory or dated restoration map.'},
] as const;
export type RegionId=typeof SPHINX_REGIONS[number]['id'];
export function regionOffset(id:RegionId,explosion:number):Vec3 {
  const r=SPHINX_REGIONS.find(r=>r.id===id)!;
  const t=Number.isFinite(explosion)?Math.max(0,Math.min(2,explosion)):0;
  return r.offset.map(v=>v*t) as Vec3;
}
export function repairBlocks(){
  const blocks:{position:Vec3;size:Vec3;side:number;course:number}[]=[];
  for(const side of [-1,1])for(let course=0;course<5;course++)for(let i=0;i<25;i++){
    const x=-29+i*1.85+(course%2)*.65;
    const width=6.0+1.6*Math.sin((x+29)/46*Math.PI);
    blocks.push({position:[x,side*(width+.12),.42+course*.72],size:[1.74,.55,.64],side,course});
  }
  return blocks;
}
