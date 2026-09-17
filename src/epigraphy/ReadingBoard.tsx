import {useState} from 'react';
import {SIGN_PALETTE} from './signs';
import {parseProposal,reviewReading,updateReading,type Region} from './model';
export function ReadingBoard({region,onChange,onPacket}:{region:Region;onChange:(r:Region)=>void;onPacket:()=>void}){
  const [proposalText,setProposalText]=useState(''),[notice,setNotice]=useState('');
  const [signSearch,setSignSearch]=useState(''),[signPage,setSignPage]=useState(0);
  const matches=SIGN_PALETTE.filter(s=>s.code.toLowerCase().includes(signSearch.trim().toLowerCase()));
  const favorites=['A1','D21','D36','G1','G17','M17','N35','O1','S34','X1'];
  const palette=signSearch?matches.slice(signPage*30,signPage*30+30):SIGN_PALETTE.filter(s=>favorites.includes(s.code));
  const edit=(patch:Partial<Region>)=>{onChange(updateReading(region,patch));setNotice('');};
  const glyphs=region.signs.map(s=>String.fromCodePoint(SIGN_PALETTE.find(p=>p.code===s)!.unicode)).join(' ');
  return <section className="epiBoard" aria-label="Translation board">
    <div className="epiBoardTitle"><div><small>03 / RECONSTRUCT &amp; READ</small><h2>Translation board</h2></div><span className="epiStatus">{region.status==='HUMAN_REVIEWED'?'OPERATOR REVIEWED':'DRAFT · UNVERIFIED'}</span></div>
    <label>Zone name<input maxLength={120} value={region.label} onChange={e=>edit({label:e.target.value})}/></label>
    <label>Visible marks / damage<textarea maxLength={4000} placeholder="What is actually visible? Record breaks and uncertain marks before proposing a reading." value={region.observation} onChange={e=>edit({observation:e.target.value})}/></label>
    <div className="epiReconstruction"><b>Proposed sign reconstruction</b><p className="epiMicro">1,072 Unicode sign identities; not OCR or an Egyptian alphabet translator. Empty means no reading has been proposed.</p><div className="epiGlyphLine" style={{direction:region.direction==='rtl'?'rtl':'ltr',writingMode:region.direction==='vertical'?'vertical-rl':undefined}} aria-label="Proposed hieroglyphic signs">{glyphs||'—'}</div><code>{region.signs.join(' · ')||'No signs assigned'}</code>
      <label>Find a sign<input aria-label="Find Gardiner sign" placeholder="Code or category: N35, G, AA…" value={signSearch} onChange={e=>{setSignSearch(e.target.value);setSignPage(0);}}/></label>
      <p className="epiMicro">{signSearch?`${matches.length} matches · page ${signPage+1} of ${Math.max(1,Math.ceil(matches.length/30))}`:'Common starting signs · search for more'}</p>
      <div className="epiSignPalette">{palette.map(s=><button key={s.code} disabled={region.signs.length>=200} title={`Add Gardiner ${s.code}`} aria-label={`Add sign ${s.code}`} onClick={()=>edit({signs:[...region.signs,s.code]})}><span>{String.fromCodePoint(s.unicode)}</span><small>{s.code}</small></button>)}</div>
      {signSearch&&<div className="epiSourceTools"><button disabled={signPage===0} onClick={()=>setSignPage(p=>p-1)}>Previous signs</button><button disabled={(signPage+1)*30>=matches.length} onClick={()=>setSignPage(p=>p+1)}>More signs</button></div>}
      <div className="epiSourceTools"><button disabled={!region.signs.length} onClick={()=>edit({signs:region.signs.slice(0,-1)})}>Undo sign</button><label>Reading direction<select value={region.direction} onChange={e=>edit({direction:e.target.value as Region['direction']})}><option value="unknown">Not established</option><option value="ltr">Left to right</option><option value="rtl">Right to left</option><option value="vertical">Vertical</option></select></label></div>
      <p className="epiMicro">Base block U+13000–1342F; excludes Extended-A. Linear display only; quadrat grouping and sign orientation need specialist editing. <a href="/epigraphy/UNICODE-LICENSE.txt" target="_blank" rel="noreferrer">Unicode license</a>.</p>
    </div>
    <label>Transliteration<textarea maxLength={4000} placeholder="Egyptological transliteration; retain uncertainty and lacunae." value={region.transliteration} onChange={e=>edit({transliteration:e.target.value})}/></label>
    <label>Translation<textarea maxLength={4000} placeholder="Cited translation or your working reading. No default translation is invented." value={region.translation} onChange={e=>edit({translation:e.target.value})}/></label>
    <label>Interpretation / alternatives<textarea maxLength={4000} placeholder="Separate interpretation and restored text from the literal reading." value={region.interpretation} onChange={e=>edit({interpretation:e.target.value})}/></label>
    <label>Translation source &amp; exact locator<textarea maxLength={4000} placeholder="Publication / URL, page, line, edition, and attribution. The photo credit alone is not a translation source." value={region.citation} onChange={e=>edit({citation:e.target.value})}/></label>
    <label>Reviewer<input maxLength={120} placeholder="Name or initials" value={region.reviewer} onChange={e=>edit({reviewer:e.target.value})}/></label>
    <button onClick={()=>{try{onChange(reviewReading(region));setNotice('Review attested by the operator—not independently authenticated. Further edits return this reading to draft.');}catch(e){setNotice(String(e));}}}>Attest human review</button>
    {region.reviewedAt&&<p className="epiMicro">Operator attestation: {region.reviewer} · {new Date(region.reviewedAt).toLocaleString()}. Not institutional validation.</p>}
    {notice&&<p role="status">{notice}</p>}
    <details className="epiAi"><summary>AI-assisted research bridge · manual handoff</summary><p>No AI provider or OCR is connected. Export a source-linked packet for your chosen tool, then paste its JSON proposal below. Nothing is uploaded automatically.</p><button onClick={onPacket}>Export AI review packet</button><label>External / AI proposal JSON<textarea maxLength={20000} value={proposalText} placeholder={'{"transliteration":"", "translation":"", "reasoning":""}'} onChange={e=>setProposalText(e.target.value)}/></label><button onClick={()=>{try{edit({proposal:parseProposal(JSON.parse(proposalText))});setProposalText('');setNotice('External proposal imported as unreviewed. Your working translation is unchanged.');}catch(e){setNotice(`Could not import: ${String(e)}`);}}}>Import as unreviewed proposal</button>
      {region.proposal&&<div className="epiProposal"><b>EXTERNAL PROPOSAL · UNREVIEWED</b><p>{region.proposal.transliteration}</p><p>{region.proposal.translation}</p><p>{region.proposal.reasoning}</p><button onClick={()=>edit({transliteration:region.proposal!.transliteration,translation:region.proposal!.translation,interpretation:region.proposal!.reasoning})}>Copy proposal into working draft</button><p className="epiMicro">Copying replaces the working reading, not the source image or observation. It does not count as review.</p></div>}
    </details>
  </section>;
}
