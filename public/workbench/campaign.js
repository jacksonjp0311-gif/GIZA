const el=id=>document.getElementById(id);let token=null;
const status=await fetch('/api/status').then(r=>r.json());token=status.token;
async function file(id){const f=el(id).files[0];if(!f||f.size>100_000_000)throw new Error('Choose a JSON file below 100 MB');return JSON.parse(await f.text());}
async function run(action){
  const buttons=[...document.querySelectorAll('button')];buttons.forEach(b=>b.disabled=true);el('status').textContent='Validating governed inputs…';
  try{
    let input;if(action==='acquire'||action==='replay')input=await file('packet');if(action==='freeze')input=await file('landmarks');if(action==='review')input={reviewer:el('reviewer').value,note:el('note').value,acceptPlanScope:el('scope').checked};if(action==='rollback')input={reason:el('note').value};
    const response=await fetch('/api/evidence-campaign',{method:'POST',headers:{'Content-Type':'application/json','X-Giza-Token':token},body:JSON.stringify({action,id:el('campaignId').value,input})}),result=await response.json();if(!response.ok)throw new Error(result.message??result.error);
    el('result').textContent=JSON.stringify(result,null,2);el('status').textContent=`${action} completed. Inspect classification, scope and gates; canonical 3-D geometry is unchanged.`;
    if(action==='export'){const url=URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='GIZA-source-campaign-packet.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  }catch(e){el('status').textContent=`BLOCKED: ${e.message}. Existing records remain preserved.`;}finally{buttons.forEach(b=>b.disabled=false);}
}
for(const action of ['acquire','replay','freeze','fit','export','review','rollback'])el(action).addEventListener('click',()=>run(action));
