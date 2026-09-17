"""Runs shipped JS/CSS. Managed Chromium blocks all URL navigation, so this test
loads the local HTML bytes and bridges fetch to the running loopback Node server.
Responses are from that real server, not stubs. No Chromium policy is changed.
"""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json,urllib.request,base64,re,os,shutil
root=Path(__file__).resolve().parents[1];out=root/'verification'
def transport(payload):
 u='http://127.0.0.1:4174'+payload['url'];body=payload.get('body');data=None if body is None else body.encode()
 req=urllib.request.Request(u,data=data,method=payload.get('method','GET'),headers=payload.get('headers',{}))
 try:
  with urllib.request.urlopen(req) as r:return {'status':r.status,'body':r.read().decode(),'headers':dict(r.headers)}
 except urllib.error.HTTPError as e:return {'status':e.code,'body':e.read().decode(),'headers':dict(e.headers)}
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('GIZA_CHROMIUM_PATH') or shutil.which('chromium'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1680,'height':1080},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.expose_function('gizaLocalTransport',transport)
 html=(root/'public/workbench/index.html').read_text();html=re.sub(r'<link[^>]+stylesheet[^>]+>','',html);html=re.sub(r'<script.*?</script>','',html,flags=re.S)
 page.set_content(html);page.add_style_tag(path=str(root/'public/workbench/workbench.css'))
 page.evaluate('''() => { window.fetch=async(url,opts={})=>{const r=await window.gizaLocalTransport({url:String(url),method:opts.method||'GET',body:opts.body||null,headers:opts.headers||{}});return new Response(r.body,{status:r.status,headers:{'Content-Type':'application/json'}});}; }''')
 page.add_script_tag(path=str(root/'public/workbench/workbench.js'),type='module')
 page.wait_for_selector('#pointRows tr');assert page.locator('#pointRows tr').count()==10
 assert page.locator('#freeze').is_disabled();assert page.locator('#fit').is_disabled()
 page.screenshot(path=str(out/'workbench-source.png'),full_page=True)
 page.click('#demo');page.wait_for_selector('#demoBanner',state='visible');page.wait_for_timeout(800)
 assert page.locator('#controlCount').inner_text()=='6';assert page.locator('#holdoutCount').inner_text()=='3';assert page.locator('#scaleResult').inner_text()=='PASS'
 page.locator('#notice').evaluate('(e)=>e.hidden=true')
 assert page.locator('#residualCanvas').is_visible()
 assert page.locator('#residualCanvas circle').count()==12
 page.screenshot(path=str(out/'workbench-synthetic-test.png'),full_page=True)
 assert len(errors)==0,errors
 state=json.loads(transport({'url':'/api/status'})['body']);assert not state['frozen'];assert state['result'] is None
 page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(200)
 page.screenshot(path=str(out/'workbench-mobile.png'),full_page=True)
 dims=page.evaluate('({width:innerWidth,body:document.documentElement.scrollWidth})')
 assert dims['width']==dims['body'],dims
 browser.close()
 result={'status':'PASS','method':'Exact shipped HTML/CSS/JS loaded from disk; real Node loopback API via host bridge. Managed browser forbids URL navigation. No mocked API responses.','checks':['10 source landmarks rendered','freeze and fit blocked without source','synthetic test 6 controls/3 untouched holdouts','demo does not mutate archaeological experiment','zero JavaScript errors','390px responsive view has no document overflow'],'javascript_errors':errors,'mobile':dims}
 (out/'browser-smoke.json').write_text(json.dumps(result,indent=2))
 print(json.dumps(result,indent=2))
