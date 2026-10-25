import { cp, mkdir, rm, readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
await mkdir(root+'dist',{recursive:true});
for(const name of await readdir(root+'dist'))await rm(root+'dist/'+name,{recursive:true,force:true});
await cp(root+'web',root+'dist',{recursive:true});
if(process.argv.includes('--demo')){
 let source=await readFile(root+'dist/config.js','utf8');
 source=source.replace('demo: false','demo: true').replace(/supabaseUrl: '[^']*'/,"supabaseUrl: ''").replace(/supabasePublishableKey: '[^']*'/,"supabasePublishableKey: ''");
 await writeFile(root+'dist/config.js',source);
}
await writeFile(root+'dist/.nojekyll','');
console.log(process.argv.includes('--demo')?'Vista previa sin envíos ni analítica lista en dist/.':'Web funcional lista en dist/.');
