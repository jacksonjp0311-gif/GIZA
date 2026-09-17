from pathlib import Path
import tempfile,shutil,subprocess,json,os,time,urllib.request,urllib.error
from reportlab.pdfgen import canvas
from PIL import Image
repo=Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='giza-e2e-') as td:
 root=Path(td)
 for sub in ['source_byte_registration','plate_registration','evidence']:
  shutil.copytree(repo/'public/model'/sub,root/'public/model'/sub)
 # Isolated, visibly labelled software test. No historical plan is being registered.
 pdf=root/'synthetic_315.pdf';c=canvas.Canvas(str(pdf),pagesize=(720,720),pageCompression=0)
 for n in range(315):
  c.setFont('Helvetica',11)
  for i in range(150):c.drawString(30,690-i%55*12,f'SYNTHETIC SOFTWARE FIXTURE / NOT ARCHAEOLOGY / PAGE {n+1} / line {i}')
  if n==304:
   c.setFillColorRGB(1,1,1);c.rect(0,0,720,720,fill=1,stroke=0);c.setFillColorRGB(0,0,0);c.setFont('Helvetica-Bold',20);c.drawString(45,660,'SYNTHETIC REGISTRATION TEST')
   c.setFont('Helvetica',12);c.drawString(45,635,'Not Petrie. Not Giza. Isolated pipeline test.');c.rect(80,150,520,400);c.line(80,330,600,330);c.line(300,150,300,550)
  c.showPage()
 c.save()
 env={**os.environ,'GIZA_ROOT':str(root),'GIZA_PORT':'4175'}
 proc=subprocess.Popen(['node',str(repo/'scripts/workbench/server.mjs')],env=env,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
 def call(p,body=None,token=None,raw=False):
  h={};data=None
  if body is not None:data=body if raw else json.dumps(body).encode();h={'X-Giza-Token':token,'Content-Type':'application/pdf' if raw else 'application/json'}
  req=urllib.request.Request('http://127.0.0.1:4175/api/'+p,data=data,headers=h)
  try:
   with urllib.request.urlopen(req,timeout=65) as r:return r.status,json.loads(r.read())
  except urllib.error.HTTPError as e:return e.code,json.loads(e.read())
 try:
  for _ in range(30):
   try:code,s=call('status');break
   except:time.sleep(.1)
  token=s['token'];assert not s['source']['present']
  code,s=call('import',pdf.read_bytes(),token,True);assert code==200,s;assert s['source']['present'] and s['render']['present']
  h=json.loads((root/'public/model/plate_registration/custody_handoff.json').read_text())
  image=root/h['local_custody']['plate_vi_render_path'];im=Image.open(image);im.thumbnail((900,900));im.save(repo/'verification/synthetic-render-test.png')
  code,s=call('confirm',{'confirm':True},token);assert code==200 and s['confirmed'],s
  pts=[[100,100],[200,500],[600,200],[800,600],[150,650],[450,820],[650,700],[850,300],[780,850],[400,400]]
  prov={'source_id':'src.petrie1883','locator':'SYNTHETIC FIXTURE TARGETS FOR SOFTWARE TEST ONLY','independent_of_fit':True}
  doc={'source_sha256':s['source']['sha256'],'render_sha256':s['render']['sha256'],'threshold_profile_id':s['profiles'][0]['id'],'pixel_axis':'Y_DOWN','scale_expectation':{'meters_per_pixel':.02,**prov},'landmarks':[{'id':p['id'],'role':'CONTROL' if i in [0,2,4,7] else 'HOLDOUT','source_px':{'x':pts[i][0],'y':pts[i][1]},'target_m':{'x':pts[i][0]*.02+5,'y':-pts[i][1]*.02+4},'target_source':prov} for i,p in enumerate(s['landmarks'])]}
  code,res=call('freeze',doc,token);assert code==200,res
  code,res=call('fit',{},token);assert code==200 and res['passed'],res
  code,repeat=call('fit',{},token);assert code==409 and repeat['error']=='FIT_RESULT_ALREADY_EXISTS',repeat
  code,repeat=call('freeze',doc,token);assert code==409 and repeat['error']=='EXPERIMENT_ALREADY_FROZEN',repeat
  code,res=call('status');assert res['frozen'] and res['result']['passed']
  code,reject=call('confirm',{},'wrong-token');assert code==409 and reject['error']=='TOKEN_REQUIRED'
  report={'status':'PASS','scope':'Isolated synthetic 315-page PDF; no Giza measurements and no release-state mutation','checks':['PDF import validates local PDF/page count and hashes bytes','Page 305 renders from imported PDF with source/render linkage','Explicit confirmation accepted','Profile-specific freeze with source provenance and independent scale','Fit result persisted with all holdouts','Repeat fit rejected','Refreeze rejected','Mutation without valid session token rejected'],'holdout_rms':res['result']['holdout_summary']['rms']}
  (repo/'verification/api-end-to-end.json').write_text(json.dumps(report,indent=2))
  print(json.dumps(report,indent=2))
 finally:proc.terminate();proc.wait(timeout=5)
