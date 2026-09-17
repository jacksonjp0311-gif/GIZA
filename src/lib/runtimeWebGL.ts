/** Context restoration is renderer-owned; this adapter reports loss without mutating research state. */
export function watchWebGLContext(canvas:EventTarget,onState:(lost:boolean)=>void):()=>void {
  const lost=(event:Event)=>{event.preventDefault();onState(true);};
  const restored=()=>onState(false);
  canvas.addEventListener('webglcontextlost',lost);
  canvas.addEventListener('webglcontextrestored',restored);
  return()=>{canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored);};
}
