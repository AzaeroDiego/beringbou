import {cp,mkdir,rm,readdir,readFile,writeFile,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
const app=path.join(root,'proposals/bou-en-estereo');
function npm(args){const cli=process.env.npm_execpath;const command=cli?process.execPath:(process.platform==='win32'?'npm.cmd':'npm');const argv=cli?[cli,...args]:args;const r=spawnSync(command,argv,{cwd:root,env:{...process.env,NEXT_PUBLIC_SITE_MODE:'production',NEXT_PUBLIC_SITE_URL:'https://www.beringbou.com'},stdio:'inherit',shell:!cli&&process.platform==='win32',windowsHide:true});if(r.status!==0)throw Error('Build step failed: npm '+args.join(' '));}
let installed=true;try{await access(path.join(app,'node_modules/next/package.json'));}catch{installed=false;}
if(process.env.CI||!installed)npm(['ci','--prefix',app,'--no-audit','--no-fund']);
npm(['run','test','--prefix',app]);
npm(['run','build','--prefix',app]);
const dist=path.resolve(root,'dist');
// Delete only the resolved build output inside this repository.
if(dist!==path.join(path.resolve(root),'dist'))throw Error('Unexpected output path');
await mkdir(dist,{recursive:true});
for(const name of await readdir(dist))await rm(path.join(dist,name),{recursive:true,force:true});
await cp(path.join(root,'web'),dist,{recursive:true});
await cp(path.join(app,'out'),dist,{recursive:true});
await rm(path.join(dist,'conceptos'),{recursive:true,force:true});
await writeFile(path.join(dist,'.nojekyll'),'');
// Keep the existing birthday submission flow, focused on its real form.
const birthday=path.join(dist,'cumple/index.html');
let birthdayHtml=await readFile(birthday,'utf8');
birthdayHtml=birthdayHtml.replace('<body>','<body class="birthday-standalone">').replace('</head>',`<style>.birthday-standalone main>section:not(#cumple){display:none}.birthday-standalone .header nav,.birthday-standalone .header>a.button{display:none}.birthday-standalone #cumple{padding-top:40px}.birthday-standalone .logo{pointer-events:auto}@media(max-width:600px){.birthday-standalone .form-row{grid-template-columns:minmax(0,1fr)!important}.birthday-standalone input{min-width:0!important;max-width:100%;box-sizing:border-box}}</style></head>`);
birthdayHtml=birthdayHtml.replace(/<title>[^<]*<\/title>/,'<title>Tu cumpleaños · Bering Bou</title>').replace('<h1>BERING <em>BOU</em></h1>','<div aria-hidden="true">BERING BOU</div>').replace('<h2>Tu cumpleaños.<br><em>Que se sienta<br>inolvidable.</em></h2>','<h1 style="font-size:clamp(44px,6vw,84px);line-height:1.05;letter-spacing:-2px">Tu cumpleaños.<br>Que se sienta<br>inolvidable.</h1>').replaceAll('href="#inicio"','href="/"');
await writeFile(birthday,birthdayHtml);
const qr=path.join(dist,'qr/index.html');let qrHtml=await readFile(qr,'utf8');if(!/name=["']robots/.test(qrHtml))qrHtml=qrHtml.replace('</head>','<meta name="robots" content="noindex,nofollow"></head>');await writeFile(qr,qrHtml);
// Retain security headers while allowing only exact hashes for Next's inline bootstrap scripts.
async function htmlFiles(dir){const files=[];for(const e of await readdir(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())files.push(...await htmlFiles(f));else if(e.name.endsWith('.html'))files.push(f);}return files;}
const hashes=new Set();
for(const file of await htmlFiles(dist)){const html=await readFile(file,'utf8');for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(/\bsrc\s*=/.test(match[1])||!match[2].trim())continue;hashes.add(`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`);}}
const policy=`default-src 'self'; script-src 'self' ${[...hashes].join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; media-src 'self' blob:; connect-src 'self' https://gowitycgqmywvtxzdrdu.supabase.co; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`;
// Cloudflare accepts header lines up to 2,000 characters. Fail before deployment if exceeded.
if(('  Content-Security-Policy: '+policy).length>2000)throw Error('CSP hash line exceeds hosting limit; split policies before release');
const original=await readFile(path.join(root,'web/_headers'),'utf8');
const headers=original.replace(/^  Content-Security-Policy:.*$/m,'  Content-Security-Policy: '+policy)+"\n/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable\n/qr/*\n  Cache-Control: no-store\n";
await writeFile(path.join(dist,'_headers'),headers);
const buildId=createHash('sha256').update(await readFile(path.join(dist,'index.html'))).digest('hex').slice(0,16);
await writeFile(path.join(dist,'release.json'),JSON.stringify({design:'bou-en-estereo',buildId,boxPricing:'2026-11-21-owner-confirmed',operationalRoutes:['/qr/','/admin/','/cumple/']})+'\n');
console.log(`Production artifact ready: ${buildId}, ${hashes.size} inline script hashes. Legacy QR/admin/birthday routes retained.`);
