import {useLayoutEffect,useRef,useState,type ReactNode} from 'react';

/** Screen-space label decluttering never moves map geometry or source coordinates. */
export function ReadableMap({children}:{children:ReactNode}){
  const root=useRef<HTMLDivElement>(null);
  const [zoom,setZoom]=useState(100),[all,setAll]=useState(false),[labels,setLabels]=useState<string[]>([]),[hidden,setHidden]=useState(0);
  useLayoutEffect(()=>{
    const node=root.current;if(!node)return;
    const layout=()=>{
      const texts=Array.from(node.querySelectorAll<SVGTextElement>('svg text'));
      setLabels(texts.map(t=>t.textContent?.trim()??'').filter(Boolean));
      const occupied:DOMRect[]=[];let omitted=0;
      // Labels are prioritized in authored order; complete text remains in the index.
      for(const text of texts){
        text.style.opacity='1';const box=text.getBoundingClientRect();
        if(!box.width||!box.height)continue;
        const collision=occupied.some(b=>box.left<b.right+4&&box.right>b.left-4&&box.top<b.bottom+3&&box.bottom>b.top-3);
        if(!all&&collision){text.style.opacity='0';omitted++;}else occupied.push(box);
      }
      node.dataset.labelsReady='true';setHidden(omitted);
    };
    layout();const observer=new ResizeObserver(layout);observer.observe(node);
    void document.fonts.ready.then(()=>{if(root.current===node)layout();});
    return()=>observer.disconnect();
  },[children,all,zoom]);
  return <>
    <div className="atlasReadingTools"><label>Map zoom <input aria-label="Map zoom" type="range" min="100" max="250" step="10" value={zoom} onChange={e=>setZoom(Number(e.target.value))}/>{zoom}%</label><button onClick={()=>setZoom(100)}>Reset map zoom</button><label><input type="checkbox" checked={all} onChange={e=>setAll(e.target.checked)}/>Show overlapping labels</label><span>{hidden} crowded labels moved to text index · scroll to pan</span></div>
    <div className="atlasMapFrame" tabIndex={0} aria-label="Scrollable map drawing"><div ref={root} className="atlasDrawing" style={{width:zoom+'%'}}>{children}</div></div>
    <details className="atlasLabelIndex"><summary>Complete map text ({labels.length})</summary><ul>{labels.map((label,i)=><li key={i}>{label}</li>)}</ul></details>
  </>;
}
