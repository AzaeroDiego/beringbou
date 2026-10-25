import test from 'node:test';
import assert from 'node:assert/strict';
import { boxType, sourceFrom, campaignFrom, validPublicConfig, validateRequest, csvCell, limaDate } from '../web/js/core.js';

test('el plano respeta los cuatro Black y seis Red del flyer',()=>{
 assert.deepEqual(Array.from({length:10},(_,i)=>i+1).filter(id=>boxType(id)==='black'),[1,2,6,7]);
});
test('el origen no acepta dominios parecidos a Facebook',()=>{
 assert.equal(sourceFrom('https://facebook.com.evil.test/'), 'other');
 assert.equal(sourceFrom('https://l.facebook.com/'), 'facebook');
 assert.equal(sourceFrom('', '?utm_source=wa'), 'whatsapp');
 assert.equal(sourceFrom(''), 'direct');
});
test('la campaña no conserva correos ni URL arbitrarias',()=>{
 assert.equal(campaignFrom('?utm_campaign=halloween-2026'),'halloween-2026');
 assert.equal(campaignFrom('?utm_campaign=diego%40example.com'),null);
});
test('se rechazan claves secretas y JWT service_role',()=>{
 const jwt=role=>'eyJ.'+btoa(JSON.stringify({role}))+'.sig';
 assert.equal(validPublicConfig('https://example.supabase.co','sb_secret_bad'),false);
 assert.equal(validPublicConfig('https://example.supabase.co',jwt('service_role')),false);
 assert.equal(validPublicConfig('https://example.supabase.co',jwt('anon')),true);
 assert.equal(validPublicConfig('http://example.supabase.co',jwt('anon')),false);
});
test('validación de formularios y consentimiento',()=>{
 const data={name:'Diego',phone:'999999999',date:'2026-10-31',guests:4,privacy:true};
 assert.equal(validateRequest(data,'2026-10-25'),null);
 assert.ok(validateRequest({...data,phone:'123'},'2026-10-25'));
 assert.ok(validateRequest({...data,date:'2026-10-24'},'2026-10-25'));
 assert.ok(validateRequest({...data,privacy:false},'2026-10-25'));
 assert.ok(validateRequest({...data,guests:0},'2026-10-25'));
 assert.ok(validateRequest({...data,name:'  '},'2026-10-25'));
});
test('el CSV neutraliza fórmulas y conserva comillas',()=>{
 assert.equal(csvCell('=HYPERLINK("x")'),'"\'=HYPERLINK(""x"")"');
 assert.equal(csvCell('Facebook'),'"Facebook"');
});
test('el día operativo usa Lima y no UTC',()=>{
 assert.equal(limaDate(new Date('2026-10-25T02:00:00Z')),'2026-10-24');
});

test('UUID compatible con vistas HTTP conserva versión y variante',async()=>{
 const {newId}=await import('../web/js/core.js');
 const id=newId({getRandomValues:array=>array.fill(255)});
 assert.match(id,/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});
