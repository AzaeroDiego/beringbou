import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../dist',import.meta.url)));
const port=Number(process.argv[2]||4402);
const rules=[];for(const line of fs.readFileSync(path.join(root,'_headers'),'utf8').split(/\r?\n/)){if(!line.trim())continue;if(!line.startsWith(' '))rules.push({pattern:line.trim(),headers:{}});else{const colon=line.indexOf(':');rules.at(-1).headers[line.slice(0,colon).trim()]=line.slice(colon+1).trim();}}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml','.ico':'image/x-icon','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.mp4':'video/mp4','.woff2':'font/woff2','.xml':'application/xml'};
http.createServer((req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1');let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{res.writeHead(400);res.end();return;}
 const file=path.resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 const headers={};for(const rule of rules){if(rule.pattern==='/*'||rule.pattern.endsWith('*')&&pathname.startsWith(rule.pattern.slice(0,-1))||pathname===rule.pattern)Object.assign(headers,rule.headers);}
 let target=file;let status=200;
 if(fs.existsSync(target)&&fs.statSync(target).isDirectory()){if(!pathname.endsWith('/')){res.writeHead(308,{...headers,Location:pathname+'/'+url.search});res.end();return;}target=path.join(target,'index.html');}
 if(!fs.existsSync(target)||!fs.statSync(target).isFile()){target=path.join(root,'404.html');status=404;}
 const stat=fs.statSync(target);headers['Content-Type']=mime[path.extname(target)]||'application/octet-stream';headers['Accept-Ranges']='bytes';
 const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);if(range&&status===200){const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),stat.size-1):stat.size-1;if(start> end){res.writeHead(416);res.end();return;}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});fs.createReadStream(target,{start,end}).pipe(res);return;}
 res.writeHead(status,{...headers,'Content-Length':stat.size});if(req.method==='HEAD')res.end();else fs.createReadStream(target).pipe(res);
}).listen(port,'0.0.0.0',()=>console.log(`Production artifact with CSP headers: http://127.0.0.1:${port}/`));
