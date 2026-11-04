import { expect, test, type Page } from '@playwright/test';

async function signIn(page: Page, owner: boolean) {
  const user = {id:'a6099bd7-6045-4dfa-bc87-f5216c273972',email:'test@example.com',app_metadata:{portfolio_owner:owner},user_metadata:{},aud:'authenticated'};
  const encode = (obj: object) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const expires_at = Math.floor(Date.now()/1000)+3600;
  const token = [encode({alg:'HS256'}),encode({sub:user.id,exp:expires_at,role:'authenticated'}),'dGVzdA'].join('.');
  await page.addInitScript(session=>localStorage.setItem('sb-fixture-auth-token',JSON.stringify(session)),
    {access_token:token,refresh_token:'fixture',expires_at,expires_in:3600,token_type:'bearer',user});
}

test('public data, project navigation, contact failure and retry', async ({ page }) => {
  let reads = 0;
  let attempts = 0;
  const projects = Array.from({length: 4}, (_, i) => ({ id: String(i), title: 'Project ' + i, description: 'Sample', tags: [] }));
  await page.route('https://fixture.invalid/**', async route => {
    const table = new URL(route.request().url()).pathname.split('/').pop();
    if (table === 'inquiries') {
      expect(route.request().postDataJSON()).toEqual({name:'Visitor',email:'visitor@example.com',message:'Hello'});
      attempts++;
      return route.fulfill(attempts === 1 ? {status:403,json:{message:'denied'}} : {status:201,body:''});
    }
    if (table === 'site_settings') { reads++; return route.fulfill({json:{name:'Portfolio Owner',role:'Engineer',tagline:'Sample'}}); }
    return route.fulfill({json:table === 'projects' ? projects : []});
  });
  await page.goto('/');
  await expect(page.getByRole('heading', {name:'Portfolio Owner'})).toBeVisible();
  await page.locator('#projects h2').scrollIntoViewIfNeeded();
  await expect(page.locator('#projects h2').locator('..')).toHaveCSS('opacity','1');
  await page.getByRole('button',{name:'View all projects'}).click();
  await expect(page.getByRole('heading',{name:'Project 3'})).toBeVisible();
  await expect(page.getByText('No skills published yet.')).toBeAttached();
  await expect(page.getByText('San Francisco, CA')).toHaveCount(0);
  await page.getByLabel('Name',{exact:true}).fill('Visitor');
  await page.getByLabel('Email',{exact:true}).fill('visitor@example.com');
  await page.getByLabel('Message',{exact:true}).fill('Hello');
  const submit = page.getByRole('button',{name:'Initiate transmission'});
  await submit.click();
  await expect(page.getByText(/could not be sent/)).toBeVisible();
  await expect(page.getByLabel('Message',{exact:true})).toHaveValue('Hello');
  await submit.click();
  await expect(page.getByText(/message was received/)).toBeVisible();
  expect(reads).toBe(1);
});

test('empty and failed collections retain their navigation targets',async ({page}) => {
  await page.route('https://fixture.invalid/**',r=>r.fulfill({json:[]}));
  await page.goto('/');
  await expect(page.locator('#projects')).toContainText('No projects published yet.');
  await page.route('**/rest/v1/projects*',r=>r.fulfill({status:403,json:{message:'denied'}}));
  await page.reload();
  await expect(page.locator('#projects')).toContainText('temporarily unavailable');
  await page.goto('/missing');
  await expect(page.getByRole('link',{name:'Return to portfolio'})).toBeVisible();
  await page.goto('/admin/dashboard');
  await expect(page).toHaveURL(/\/admin$/);
});

for (const owner of [false,true]) {
  test(owner ? 'owner can review inquiries and keep failed skill edits' : 'ordinary accounts cannot enter the dashboard',async ({page})=>{
    await signIn(page, owner);
    await page.route('https://fixture.invalid/**',r=>{
      if (r.request().method()==='POST') return r.fulfill({status:403,json:{message:'Write denied'}});
      const data = r.request().url().includes('/inquiries') ? [{id:'1',name:'Visitor',email:'visitor@example.com',message:'Inbox test',created_at:'2026-01-01'}] : [];
      return r.fulfill({json:data});
    });
    await page.goto('/admin/dashboard');
    if (!owner) {await expect(page).toHaveURL(/\/admin$/); return;}
    await page.getByRole('button',{name:'Inquiries'}).click();
    await expect(page.getByText('Inbox test')).toBeVisible();
    await page.getByRole('button',{name:'Skills',exact:true}).click();
    await page.getByRole('button',{name:/add skill/i}).click();
    await page.getByLabel('Category Name').fill('Tools');
    await page.getByLabel('Skills (comma separated)').fill('Git');
    await Promise.all([
      page.waitForEvent('dialog').then(async dialog => {
        expect(dialog.message()).toContain('Write denied');
        await dialog.accept();
      }),
      page.getByRole('button',{name:/save/i}).click(),
    ]);
    await expect(page.getByLabel('Category Name')).toHaveValue('Tools');
  });
}

test('résumé changes publish on save and remove the previous managed object', async ({page}) => {
  await signIn(page, true);
  const bucket = 'https://fixture.invalid/storage/v1/object/public/resumes/';
  let published = bucket + 'old.pdf';
  const operations: string[] = [];
  await page.route('https://fixture.invalid/**', async route => {
    const req = route.request();
    if (req.url().includes('/storage/v1/object/')) {
      operations.push(req.method() === 'POST' ? 'upload' : 'remove');
      if (req.method() === 'DELETE') expect(req.postDataJSON().prefixes).toEqual(['old.pdf']);
      return route.fulfill({json: req.method() === 'POST' ? {Key:'resumes/new.pdf'} : []});
    }
    if (req.method() === 'PATCH') {
      operations.push('publish');
      published = req.postDataJSON().resume_url;
      return route.fulfill({json:{id:'1'}});
    }
    return route.fulfill({json:{name:'Owner',role:'Developer',tagline:'Projects',resume_url:published}});
  });
  await page.goto('/admin/dashboard');
  await page.getByLabel('Resume (PDF)').setInputFiles({name:'new.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.7\n')});
  expect(operations).toEqual([]);
  await Promise.all([
    page.waitForEvent('dialog').then(async dialog => {
      expect(dialog.message()).toBe('Settings saved successfully!');
      await dialog.accept();
    }),
    page.getByRole('button',{name:'Save Settings'}).click(),
  ]);
  expect(operations).toEqual(['upload','publish','remove']);
  expect(published).toMatch(/resumes\/[a-f0-9-]+\.pdf$/);
});
