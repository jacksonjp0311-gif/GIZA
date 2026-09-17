export type ImageExtent={width:number;height:number};
export type NormalizedZone=readonly [number,number,number,number];
export type ZoneView={zoom:number;baseWidth:number;scrollLeft:number;scrollTop:number};
const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
const extent=(value:number)=>Number.isFinite(value)&&value>0?clamp(value,1,10_000_000):1;

/** Display-only framing. Never changes the source image or normalized zone. */
export function fitZoneToViewport(zone:NormalizedZone,image:ImageExtent,viewport:ImageExtent,padding=24):ZoneView {
  const width=extent(viewport.width),height=extent(viewport.height);
  const imageWidth=extent(image.width),imageHeight=extent(image.height);
  const baseWidth=Math.min(width,height*imageWidth/imageHeight),baseHeight=baseWidth*imageHeight/imageWidth;
  const finite=(value:number,fallback:number)=>Number.isFinite(value)?value:fallback;
  const x=clamp(finite(zone[0],0),0,1),y=clamp(finite(zone[1],0),0,1);
  const zoneWidth=clamp(finite(zone[2],1),.000001,Math.max(.000001,1-x));
  const zoneHeight=clamp(finite(zone[3],1),.000001,Math.max(.000001,1-y));
  const inset=clamp(finite(padding,24),0,Math.max(0,(Math.min(width,height)-1)/2));
  const zoom=clamp(Math.floor(100*Math.min((width-inset*2)/(baseWidth*zoneWidth),(height-inset*2)/(baseHeight*zoneHeight))),100,400);
  const renderedWidth=baseWidth*zoom/100,renderedHeight=baseHeight*zoom/100;
  const horizontalInset=Math.max(0,(width-renderedWidth)/2);
  return {zoom,baseWidth,
    scrollLeft:clamp(horizontalInset+(x+zoneWidth/2)*renderedWidth-width/2,0,Math.max(0,renderedWidth-width)),
    scrollTop:clamp((y+zoneHeight/2)*renderedHeight-height/2,0,Math.max(0,renderedHeight-height))};
}
