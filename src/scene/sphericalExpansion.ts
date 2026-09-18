import type {StoneCellInfo} from './types';
/** Presentation-only Fibonacci shell; not a physical arrangement or a stone inventory. */
export function sphericalCellPosition(cell:StoneCellInfo,index:number,count:number,amount:number,radius=240):[number,number,number]{
  if(!Number.isInteger(index)||!Number.isInteger(count)||count<1||index<0||index>=count||!Number.isFinite(amount)||!Number.isFinite(radius)||radius<=0)throw new Error('Invalid spherical presentation inputs');
  const t=Math.min(1,Math.max(0,amount)),z=1-2*(index+.5)/count,radial=Math.sqrt(1-z*z),angle=index*Math.PI*(3-Math.sqrt(5));
  const target=[radius*radial*Math.cos(angle),radius*radial*Math.sin(angle),70+radius*z];
  return cell.center_m.map((v,i)=>v+(target[i]-v)*t) as [number,number,number];
}
