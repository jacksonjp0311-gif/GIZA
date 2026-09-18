import {test,expect} from '@playwright/test';
for(const viewport of [{width:1280,height:800},{width:390,height:844},{width:844,height:390}])test('full-page atlas readable controls '+viewport.width,async({page})=>{
  await page.setViewportSize(viewport);await page.goto('/');await page.getByRole('button',{name:'MAP ATLAS',exact:true}).click();
  const atlas=page.locator('.mapAtlasRoot');await expect(atlas).toBeVisible();
  await expect(page.locator('.leftRail')).toBeHidden();await expect(page.locator('.rightRail')).toBeHidden();await expect(page.locator('.quickViewsBar')).toBeHidden();
  expect((await page.locator('.atlasMapFrame').first().boundingBox())!.height).toBeGreaterThan(300);
  const rect=await atlas.boundingBox();expect(rect!.width).toBeGreaterThan(viewport.width*.94);
  const drawing=page.locator('.atlasDrawing').first();await expect(drawing).toHaveAttribute('data-labels-ready','true');
  const overlap=await drawing.locator('text').evaluateAll(nodes=>{
    const boxes=nodes.filter(n=>getComputedStyle(n).opacity!=='0').map(n=>n.getBoundingClientRect()).filter(b=>b.width&&b.height);
    return boxes.some((a,i)=>boxes.slice(i+1).some(b=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top));
  });expect(overlap).toBe(false);
  await page.screenshot({path:test.info().outputPath('atlas-drawing.png')});
  await page.getByText(/Complete map text/).first().click();await expect(page.locator('.atlasLabelIndex').first().locator('li').first()).toBeVisible();
  await page.getByRole('slider',{name:'Map zoom',exact:true}).first().fill('150');await expect(drawing).toHaveAttribute('style','width: 150%;');
  await page.screenshot({path:test.info().outputPath('atlas.png')});
  await page.getByRole('button',{name:'3D MODEL',exact:true}).click();await expect(page.locator('.leftRail')).toBeVisible();
});
test('spherical stones and contextual assembly explosion are reversible',async({page})=>{
  await page.goto('/?layerDiagnostics=1');await page.getByRole('button',{name:'Explode',exact:true}).hover();await page.getByLabel('Stone arrangement').selectOption('SPHERE');
  await page.getByRole('slider',{name:'Explosion distance',exact:true}).fill('2.75');
  const canvas=page.locator('canvas').first();
  const expansion=async()=>JSON.parse(await canvas.getAttribute('data-layer-diagnostics')??'{}').expansions?.[0];
  await expect.poll(async()=>(await expansion())?.amount).toBe(2.75);expect((await expansion()).mode).toBe('SPHERE');expect((await expansion()).count).toBeGreaterThan(100);
  await page.screenshot({path:test.info().outputPath('sphere.png')});
  await page.getByRole('button',{name:'ASSEMBLE',exact:true}).click();await expect.poll(async()=>(await expansion())?.amount).toBe(0);
  await page.getByRole('button',{name:'Sarcophagus',exact:true}).click();await page.locator('.evidenceViewbar').getByText('Explode / restore',{exact:true}).click();
  await page.getByLabel('Assembly explosion distance').fill('2');await page.getByRole('button',{name:'Restore inspection stand'}).click();await expect(page.getByLabel('Assembly explosion distance')).toHaveValue('0');
  await page.getByRole('button',{name:'← Workstation',exact:true}).click();await page.getByRole('button',{name:'Upper Passage',exact:true}).click();
  await page.locator('.componentControls').getByText('Explode / restore',{exact:true}).click();await page.getByLabel('Component explosion distance').fill('2');await page.getByRole('button',{name:'Restore assembly',exact:true}).click();await expect(page.getByLabel('Component explosion distance')).toHaveValue('0');
});
