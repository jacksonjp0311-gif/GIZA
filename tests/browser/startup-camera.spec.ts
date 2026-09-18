import {test,expect} from '@playwright/test';
for(const viewport of [{width:1280,height:800},{width:390,height:844},{width:844,height:390}])test('startup centers assembled pyramid despite prior inspection '+viewport.width,async({page})=>{
  await page.setViewportSize(viewport);
  await page.addInitScript(()=>{
    localStorage.setItem('giza.nexus.workspace.v1',JSON.stringify({version:1,selectedId:'part.shaft.alpha.1',explode:2.75,sectionAxis:'Z',sectionPos:22,viewPreset:'UNDERGROUND',layers:{exterior:false,subsurface:true,xray:true,simulation:true}}));
    localStorage.setItem('giza.qa.research-preservation','untouched research sentinel');
  });
  await page.goto('/?layerDiagnostics=1');const canvas=page.locator('canvas').first();
  await page.getByRole('button',{name:'Explode',exact:true}).hover();await expect(page.getByRole('slider',{name:'Explosion distance',exact:true})).toHaveValue('0');
  await expect(page.getByRole('checkbox',{name:'Exterior (Current)',exact:true})).toBeChecked();
  await expect(page.getByRole('checkbox',{name:'Subterranean (Unverified)',exact:true})).not.toBeChecked();
  const centered=async()=>{const p=JSON.parse(await canvas.getAttribute('data-layer-diagnostics')??'{}').pyramid;return !!p&&Math.abs(p.minX+p.maxX)<.015&&Math.abs(p.minY+p.maxY)<.015&&p.minX>-.82&&p.maxX<.82&&p.minY>-.82&&p.maxY<.82;};
  await expect.poll(centered).toBe(true);
  await page.screenshot({path:test.info().outputPath('centered-startup.png')});
  await page.getByRole('button',{name:'Explode',exact:true}).hover();await page.getByRole('slider',{name:'Explosion distance',exact:true}).fill('2');await page.reload();
  await page.getByRole('button',{name:'Explode',exact:true}).hover();await expect(page.getByRole('slider',{name:'Explosion distance',exact:true})).toHaveValue('0');await expect.poll(centered).toBe(true);
  expect(await page.evaluate(()=>localStorage.getItem('giza.qa.research-preservation'))).toBe('untouched research sentinel');
});
