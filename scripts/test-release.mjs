import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const repo=fileURLToPath(new URL('../',import.meta.url));
const req=createRequire(path.join(repo,'proposals/bou-en-estereo/package.json'));
const {chromium,webkit}=req('playwright');
const axe=fs.readFileSync(req.resolve('axe-core/axe.min.js'),'utf8');
const base=process.argv[2]||'http://127.0.0.1:4402';
const output=path.join(repo,'.release-checks');fs.mkdirSync(output,{recursive:true});
const results=[];
for(const [name,engine,options]of [['chromium',chromium,{channel:'msedge'}],['webkit',webkit,{}]]){
 const browser=await engine.launch(options);const context=await browser.newContext({viewport:{width:390,height:844},timezoneId:'America/Lima',reducedMotion:'reduce'});
 const requests=[],errors=[],blocked=[],badResources=[];
 await context.route('https://*.supabase.co/**',async route=>{
  const request=route.request();const body=request.postDataJSON();requests.push({url:request.url(),body});
  if(request.url().includes('bering_register_guest_qr'))return route.fulfill({contentType:'application/json',body:JSON.stringify({code:'BB-TEST-ONLY-NOT-VALID',reference:'LOCAL-TEST',event_date:'2026-11-21',status:'pending'})});
  if(request.url().includes('bering_create_request'))return route.fulfill({contentType:'application/json',body:JSON.stringify('local-test-not-a-real-reservation')});
  if(request.url().includes('/auth/v1/token'))return route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({message:'invalid_credentials'})});
  return route.fulfill({contentType:'application/json',body:'null'});
 });
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(/content.security.policy|refused to (execute|load|evaluate)|blocked.*script/i.test(m.text()))blocked.push(m.text());});page.on('response',r=>{if(r.status()>=400&&['script','stylesheet','font','image','media'].includes(r.request().resourceType()))badResources.push(r.url());});
 const response=await page.goto(base+'/');assert.equal(response.status(),200);const csp=response.headers()['content-security-policy'];assert.ok(csp?.includes("'sha256-"));assert.ok(!csp.split('script-src')[1].split(';')[0].includes('unsafe-inline'));
 await page.locator('#consent-banner').waitFor({state:'visible'});
 assert.equal(requests.length,0,'No measurement before consent');
 await page.getByRole('button',{name:'Solo lo necesario',exact:true}).click();
 await page.locator('#privacy-settings').click();await page.getByRole('button',{name:'Aceptar medición',exact:true}).click();
 await page.waitForFunction(()=>localStorage.getItem('bering.analytics.consent.v1')==='accepted');
 await page.getByRole('button',{name:/Elegir box 03/}).click();assert.equal(await page.locator('[data-box-price]').innerText(),'S/270');
 let message=decodeURIComponent(await page.locator('.box-inquiry').getAttribute('href'));assert.match(message,/box 03 \(Box Red\)/);assert.match(message,/2026-11-21/);assert.match(message,/S\/270/);
 for(const width of [320,360,375,390,414,540,600,768,1024,1440,1920]){
  await page.setViewportSize({width,height:900});
  const bounds=await page.evaluate(()=>{const date=document.querySelector('#date').getBoundingClientRect(),guests=document.querySelector('#guests').getBoundingClientRect(),form=document.querySelector('.reservation-form').getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth,overlap:date.left<guests.right&&date.right>guests.left&&date.top<guests.bottom&&date.bottom>guests.top,dateOutside:date.left<form.left-1||date.right>form.right+1};});
  assert.equal(bounds.overflow,false,name+' overflow at '+width);assert.equal(bounds.overlap,false,name+' overlapping controls at '+width);assert.equal(bounds.dateOutside,false,name+' date outside form at '+width);
 }
 await page.setViewportSize({width:390,height:844});
 await page.locator('.box-map').screenshot({path:path.join(output,name+'-map.png')});await page.locator('.box-choice').screenshot({path:path.join(output,name+'-special-red.png')});
 await page.locator('#box-date').fill('2026-11-28');assert.equal(await page.locator('[data-box-price]').innerText(),'Precios a consultar');message=decodeURIComponent(await page.locator('.box-inquiry').getAttribute('href'));assert.match(message,/2026-11-28/);assert.doesNotMatch(message,/270|320|ERROR/);await page.locator('.box-choice').screenshot({path:path.join(output,name+'-ordinary.png')});
 await page.locator('#box-date').fill('');assert.ok(await page.getByRole('button',{name:'Elige una fecha para continuar'}).isDisabled());
 await page.locator('#box-date').fill('2026-11-15');assert.ok(await page.getByRole('button',{name:'Elige una fecha para continuar'}).isDisabled());
 await page.locator('#box-date').fill('2026-11-21');for(const id of [1,2,3,4,5,6,7,8,9,10]){await page.getByRole('button',{name:new RegExp('Elegir box '+String(id).padStart(2,'0'))}).click();assert.equal(await page.locator('[data-box-price]').innerText(),[1,2,6,7].includes(id)?'S/320':'S/270');}
 await page.locator('#reservas').screenshot({path:path.join(output,name+'-group-form.png')});
 await page.locator('#name').fill('Prueba local');await page.locator('#date').fill('2026-11-21');await page.locator('#guests').fill('8');await page.getByRole('button',{name:'Preparar mi consulta'}).click();assert.match(decodeURIComponent(await page.getByRole('link',{name:'Continuar en WhatsApp'}).getAttribute('href')),/Prueba local/);
 await page.getByRole('button',{name:'Menú',exact:true}).click();await page.keyboard.press('Escape');await page.waitForFunction(()=>document.activeElement?.classList.contains('menu-toggle'));
 await page.getByRole('button',{name:'Fotografías',exact:true}).click();await page.locator('.photo-grid .media-button').first().click();assert.ok(await page.locator('dialog.lightbox[open]').isVisible());await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Videos',exact:true}).click();assert.equal(await page.locator('video').getAttribute('preload'),'none');
 await page.addScriptTag({content:axe}).catch(()=>{}); // CSP intentionally blocks inline injection: load the checked source from a local route instead.
 await context.route(base+'/__axe-check.js',route=>route.fulfill({contentType:'text/javascript',body:axe}));await page.addScriptTag({url:base+'/__axe-check.js'});
 const a11y=await page.evaluate(()=>window.axe.run());const serious=a11y.violations.filter(v=>['serious','critical'].includes(v.impact));
 await page.getByRole('link',{name:'Explorar el pase digital'}).click();await page.waitForURL('**/entradas/');await page.getByRole('button',{name:'VIP',exact:true}).click();assert.ok(await page.locator('.vip-pass').isVisible());
 await page.goto(base+'/qr/');await page.locator('#submit').waitFor({state:'visible'});await page.locator('#name').fill('Prueba local sin registro real');await page.locator('#birth').fill('1990-01-01');await page.locator('#dni').fill('00000000');await page.locator('#phone').fill('999999999');await page.locator('#submit').click();await page.locator('#result').waitFor({state:'visible'});assert.match(await page.locator('#qr-state').innerText(),/Pendiente/);assert.ok((await page.locator('#download').getAttribute('href')).startsWith('data:image/png'));
 await page.goto(base+'/cumple/');await page.locator('#birthday-name').fill('Prueba local sin envío real');await page.locator('#birthday-date').fill('2026-11-21');await page.locator('#birthday-guests').fill('4');await page.locator('#birthday-phone').fill('999999999');const privacy=page.locator('#birthday-form input[name=privacy]');if(await privacy.count())await privacy.check();await page.locator('#birthday-form button[type=submit]').click();await page.waitForFunction(()=>document.querySelector('#birthday-form .form-message').textContent.includes('Solicitud recibida'));
 await page.goto(base+'/admin/');assert.ok(await page.locator('#login-form').isVisible());assert.ok(await page.locator('#dashboard').isHidden());
 await page.goto(base+'/missing-test');assert.match(await page.title(),/Página no encontrada/);
 const measurements=requests.filter(r=>r.url.includes('bering_track_event'));assert.ok(measurements.length>0,'Consented measurements should be wired');for(const m of measurements){assert.equal(m.body.p_event.event_slug,null);assert.ok(!JSON.stringify(m.body).includes('Prueba local'));assert.ok(!JSON.stringify(m.body).includes('999999999'));}
 // The host injects an optional telemetry beacon. Keep it blocked by the existing consent policy.
 const expectedProbe=blocked.filter(s=>/script.*inline|inline.*script/i.test(s)||s.includes('https://static.cloudflareinsights.com/beacon.min.js/'));
 assert.deepEqual(errors,[],name+' runtime errors');assert.deepEqual(badResources,[],name+' missing resources');
 assert.deepEqual(serious,[],name+' serious accessibility findings');assert.deepEqual(blocked.filter(s=>!expectedProbe.includes(s)),[],name+' unexpected CSP blocks');
 results.push({engine:name,viewports:11,fieldsOverlap:false,allBoxPrices:true,ordinaryPriceIsNull:true,invalidDateBlocked:true,whatsappSelection:true,menuEscape:true,lightbox:true,qrFlow:'mocked-no-real-write',birthdayFlow:'mocked-no-real-write',adminGate:true,nextNavigation:true,a11ySerious:serious.length,runtimeErrors:errors,missingResources:badResources,cspBlocked:blocked.filter(s=>!expectedProbe.includes(s)),blockedHostTelemetry:blocked.filter(s=>s.includes('https://static.cloudflareinsights.com/beacon.min.js/')).length,consentedAnalytics:measurements.length});
 await browser.close();console.log(name,'passed');
}
fs.writeFileSync(path.join(output,'functional-report.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
