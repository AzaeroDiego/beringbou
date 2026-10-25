import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('web');
for(const file of ['index.html','cumple/index.html','admin/index.html'])test('recursos relativos de '+file,async()=>{
 const html=await readFile(path.join(root,file),'utf8');
 for(const match of html.matchAll(/(?:src|href)="(\.[^"#?]+)"/g))await access(path.resolve(root,path.dirname(file),match[1]));
 assert.match(html,/name="viewport"/);
});
test('todas las rutas públicas comparten el recorrido de reserva',async()=>{
 for(const file of ['index.html','cumple/index.html']){const html=await readFile(path.join(root,file),'utf8');for(const id of ['booking-zone','box-form','booking-success','consent-banner'])assert.ok(html.includes('id="'+id+'"'));}
});

test('el build de Pages no incluye configuración de Supabase',async()=>{
 const {execFileSync}=await import('node:child_process');
 execFileSync(process.execPath,['scripts/build.mjs','--demo']);
 const conf=await readFile('dist/config.js','utf8');
 assert.match(conf,/demo: true/);
 assert.match(conf,/supabaseUrl: ''/);
 assert.match(conf,/supabasePublishableKey: ''/);
});
