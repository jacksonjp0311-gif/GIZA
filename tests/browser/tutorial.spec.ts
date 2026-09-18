import {test,expect} from '@playwright/test';
const target=(id:string)=>'[data-tutorial-id="'+id+'"]';
for(const viewport of [{width:1280,height:800},{width:390,height:844},{width:844,height:390}])test('tutorial real target, navigation, reflow and persistence '+viewport.width,async({page},testInfo)=>{
  await page.setViewportSize(viewport);await page.goto('/');
  await page.getByRole('button',{name:'Tutorial / ?',exact:true}).click();
  const guide=page.getByRole('region',{name:'GIZA tutorial'});
  await expect(guide).toContainText('A spatial research workstation');
  await expect(page.locator('.tutorialShade').first()).toBeVisible();
  await expect(page.getByTestId('tutorial-cutout')).toBeVisible();
  const inBounds=async()=>{const b=await guide.boundingBox();return !!b&&b.x>=0&&b.y>=0&&b.x+b.width<=viewport.width+1&&b.y+b.height<=viewport.height+1;};
  await expect.poll(inBounds).toBe(true);
  await page.screenshot({path:testInfo.outputPath('tutorial-'+viewport.width+'.png')});
  await guide.getByRole('button',{name:'Next',exact:true}).click();
  await guide.getByRole('button',{name:'Back',exact:true}).click();await expect(guide).toContainText('A spatial research workstation');
  await guide.getByText('Chapters & restart',{exact:true}).click();await guide.getByLabel('Tutorial chapter').selectOption('5');
  await expect(guide).toContainText('Open the Atlas');
  await page.locator(target('surface-atlas')).click();
  await expect(guide).toContainText('Read maps without mistaking their scope');
  await page.reload();await expect(guide).toContainText('Read maps without mistaking their scope');
  // Surface is not silently changed to satisfy restored tutorial state.
  await expect(guide).toContainText('not currently available');
  await page.keyboard.press('Escape');await expect(guide).toHaveCount(0);
  await page.getByRole('button',{name:'Tutorial / ?',exact:true}).click();
  await expect(guide).toContainText('A spatial research workstation');
});

test('tutorial cutout tracks resize, keyboard click and chapter skipping',async({page})=>{
  await page.setViewportSize({width:1280,height:800});await page.goto('/?tutorialDiagnostics=1');
  await page.getByRole('button',{name:'Tutorial / ?',exact:true}).click();
  const guide=page.getByRole('region',{name:'GIZA tutorial'});
  const aligned=()=>page.evaluate(()=>{
    const a=document.querySelector('[data-tutorial-id="surface-switch"]')!.getBoundingClientRect();
    const b=document.querySelector('[data-testid="tutorial-cutout"]')!.getBoundingClientRect();
    return Math.abs(b.left-Math.max(0,a.left-10))<2&&Math.abs(b.right-Math.min(innerWidth,a.right+10))<2;
  });
  await expect.poll(aligned).toBe(true);await page.setViewportSize({width:390,height:844});await expect.poll(aligned).toBe(true);
  await guide.getByText('Chapters & restart',{exact:true}).click();
  await guide.getByRole('button',{name:'Skip chapter',exact:true}).click();await expect(guide).toContainText('Three ways to work');
  await guide.getByLabel('Tutorial chapter').selectOption('5');
  await page.locator(target('surface-atlas')).focus();await page.keyboard.press('Enter');
  await expect(guide).toContainText('Read maps without mistaking their scope');
  await guide.getByRole('button',{name:'Restart tutorial',exact:true}).click();await expect(guide).toContainText('A spatial research workstation');
  expect(await page.evaluate(()=>performance.getEntriesByName('giza.tutorial.layout').length)).toBeGreaterThan(0);
});
test('tutorial respects global unsaved research and does not lose a draft',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'Explore on my own',exact:true}).click();
  await page.getByRole('button',{name:'Sarcophagus',exact:true}).click();
  await page.getByRole('button',{name:'Measure',exact:true}).click();await page.getByRole('button',{name:'Anchor 1',exact:true}).click();
  await page.getByRole('button',{name:'Tutorial / ?',exact:true}).click();
  const guide=page.getByRole('region',{name:'GIZA tutorial'});
  await guide.getByText('Chapters & restart',{exact:true}).click();await guide.getByLabel('Tutorial chapter').selectOption('5');
  page.once('dialog',async dialog=>{expect(dialog.message()).toContain('unsaved research');await dialog.dismiss();});
  await page.locator(target('surface-atlas')).click();await expect(guide).toContainText('Open the Atlas');
  await page.keyboard.press('Escape');await expect(page.locator('.evidenceReadout').first()).toContainText('1/2 POINTS');
});
test('reduced motion and high DPI tutorial do not mutate physical exports',async({browser},testInfo)=>{
  const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2,reducedMotion:'reduce'}),page=await context.newPage();
  await page.goto('http://127.0.0.1:4197/');await page.getByRole('button',{name:'Explore on my own',exact:true}).click();
  await page.getByRole('button',{name:'Sarcophagus',exact:true}).click();await page.getByRole('button',{name:'Views',exact:true}).click();
  const exportContract=async(button='Export physical contract')=>{const d=page.waitForEvent('download');await page.getByRole('button',{name:button,exact:true}).click();const file=await d,stream=await file.createReadStream();const chunks=[];for await(const chunk of stream!)chunks.push(chunk);return Buffer.concat(chunks).toString();};
  const before=await exportContract();
  await page.getByRole('button',{name:'Measure',exact:true}).click();await page.getByRole('button',{name:'Anchor 1',exact:true}).click();await page.getByRole('button',{name:'Anchor 2',exact:true}).click();
  await page.getByRole('button',{name:'Investigate',exact:true}).click();const original=JSON.parse(await exportContract('Export investigation'));
  await page.getByRole('button',{name:'Tutorial / ?',exact:true}).click();
  await expect(page.getByRole('region',{name:'GIZA tutorial'})).toBeVisible();await page.screenshot({path:testInfo.outputPath('tutorial-high-dpi.png')});await page.keyboard.press('Escape');
  const after=JSON.parse(await exportContract('Export investigation'));expect(after.payload.dependencyFingerprint).toBe(original.payload.dependencyFingerprint);expect(after.payload.result).toEqual(original.payload.result);
  await page.getByRole('button',{name:'Views',exact:true}).click();expect(await exportContract()).toBe(before);await context.close();
});

test('tutorial scrolls a real quick-view target into its spotlight',async({page})=>{
  await page.setViewportSize({width:1280,height:800});await page.goto('/');
  await page.getByRole('button',{name:'Tutorial / ?',exact:true}).click();
  const guide=page.getByRole('region',{name:'GIZA tutorial'});
  await guide.getByText('Chapters & restart',{exact:true}).click();await guide.getByLabel('Tutorial chapter').selectOption('4');
  await expect.poll(()=>page.evaluate(()=>{
    const a=document.querySelector('[data-tutorial-id="quick-upper-passage"]')!.getBoundingClientRect();
    const b=document.querySelector('[data-testid="tutorial-cutout"]')?.getBoundingClientRect();
    return !!b&&a.left>=0&&a.right<=innerWidth&&Math.abs(b.left-Math.max(0,a.left-10))<2;
  })).toBe(true);
  await page.locator(target('quick-upper-passage')).click();await expect(guide).toContainText('Dimensions and references');
});

test('unavailable optional workspace leaves tutorial recoverable',async({page})=>{
  await page.route('**/model/maps/manifest.json',route=>route.fulfill({status:404,body:'{}'}));
  await page.goto('/');await page.getByRole('button',{name:'Tutorial / ?',exact:true}).click();
  const guide=page.getByRole('region',{name:'GIZA tutorial'});
  await guide.getByText('Chapters & restart',{exact:true}).click();await guide.getByLabel('Tutorial chapter').selectOption('5');
  await page.locator(target('surface-atlas')).click();
  await guide.getByRole('button',{name:'Skip chapter',exact:true}).click();
  await expect(guide).toContainText('Return to the model');await page.keyboard.press('Escape');
  await expect(page.getByRole('button',{name:'3D MODEL',exact:true})).toBeVisible();
});
