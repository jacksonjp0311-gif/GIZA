import {test,expect} from '@playwright/test';
test('viewport drawers collapse after pointer use and support keyboard',async({page})=>{
  await page.goto('/');
  const inspection=page.getByRole('button',{name:'Inspect / layers',exact:true}),explosion=page.getByRole('button',{name:'Explode',exact:true});
  await expect(inspection).toHaveAttribute('aria-expanded','false');await expect(explosion).toHaveAttribute('aria-expanded','false');
  await inspection.hover();await page.getByText('Reality layers',{exact:true}).click();await expect(page.getByRole('checkbox',{name:'HYPOTHESIS',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'3D MODEL',exact:true}).hover();await expect(inspection).toHaveAttribute('aria-expanded','false');
  await expect(page.getByRole('button',{name:'Remove shell / inspect inside'})).toBeHidden();
  await explosion.hover();
  const slider=page.getByRole('slider',{name:'Explosion distance',exact:true}),box=(await slider.boundingBox())!;
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(15,20);await expect(explosion).toHaveAttribute('aria-expanded','true');await page.mouse.up();await expect(explosion).toHaveAttribute('aria-expanded','false');
  await explosion.hover();await page.getByRole('slider',{name:'Explosion distance',exact:true}).fill('1');await page.getByRole('button',{name:'ASSEMBLE',exact:true}).click();
  await page.getByRole('button',{name:'3D MODEL',exact:true}).hover();await expect(explosion).toHaveAttribute('aria-expanded','false');
  await explosion.focus();await page.keyboard.press('Enter');await expect(explosion).toHaveAttribute('aria-expanded','true');await page.keyboard.press('Escape');await expect(explosion).toHaveAttribute('aria-expanded','false');
});
test('touch drawers open and close explicitly',async({browser})=>{
  const context=await browser.newContext({baseURL:test.info().project.use.baseURL,hasTouch:true,viewport:{width:390,height:844}}),page=await context.newPage();await page.goto('/');
  await page.getByRole('button',{name:'Explode',exact:true}).tap();await expect(page.getByRole('slider',{name:'Explosion distance',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Close explode',exact:true}).tap();await expect(page.getByRole('slider',{name:'Explosion distance',exact:true})).toBeHidden();await context.close();
});
