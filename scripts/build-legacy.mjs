import { cp, mkdir, rm, readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
await mkdir(root+'dist',{recursive:true});
for(const name of await readdir(root+'dist'))await rm(root+'dist/'+name,{recursive:true,force:true});
await cp(root+'web',root+'dist',{recursive:true});
if(process.argv.includes('--demo')){
 let source=await readFile(root+'dist/config.js','utf8');
 source=source.replace('demo: false','demo: true').replace(/supabaseUrl: '[^']*'/,"supabaseUrl: ''").replace(/supabasePublishableKey: '[^']*'/,"supabasePublishableKey: ''");
 await writeFile(root+'dist/config.js',source);
}
// Un identificador por publicación evita mezclar HTML nuevo con módulos en caché.
async function sourceFiles(directory) {
 const files=[];
 for(const entry of await readdir(directory,{withFileTypes:true})) {
  const target=directory+'/'+entry.name;
  if(entry.isDirectory())files.push(...await sourceFiles(target));
  else if(/\.(html|js|css)$/.test(entry.name))files.push(target);
 }
 return files.sort();
}
const files=await sourceFiles(root+'dist');
const hash=createHash('sha256');
for(const file of files){hash.update(file.slice((root+'dist').length));hash.update(await readFile(file));}
const version=hash.digest('hex').slice(0,12);
for(const file of files) {
 const content=await readFile(file,'utf8');
 await writeFile(file,content.replace(/((?:\.{1,2}\/)[^'"\s<>?]+?\.(?:js|css))(?=['"])/g,'$1?v='+version));
}
await writeFile(root+'dist/.nojekyll','');
console.log(process.argv.includes('--demo')?'Vista previa sin envíos ni analítica lista en dist/.':'Web funcional lista en dist/.');
