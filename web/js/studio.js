import {configured,hasSession,signIn,signOut,adminRest,uploadMedia,mediaSignedUrl} from './api.js';
const $=id=>document.getElementById(id);
let items=[];let selectedMediaPath=null;let view='list';
function note(t){$('notice').textContent=t}
function state(ok){$('auth').hidden=ok;$('app').hidden=!ok;$('logout').hidden=!ok}
function clear(){ $('editor').reset();$('postId').value='';$('editorTitle').textContent='Nuevo contenido';selectedMediaPath=null;$('mediaInfo').textContent='Sin archivo adjunto';}
function dateLocal(iso){if(!iso)return '';const d=new Date(iso);return new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Lima',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(d).replace(' ','T')}
function toUTC(local){return local?new Date(local+':00-05:00').toISOString():null}
async function load(){note('Actualizando estudio…');try{items=await adminRest('GET','bering_content_posts?select=*&order=planned_at.asc.nullslast,created_at.desc&limit=500');state(true);render();note('Contenido actualizado.')}catch(e){note(e.message);if(/acceso|sesión|autoriz/i.test(e.message))state(false)}}
function render(){const ch=$('filterChannel').value,st=$('filterStatus').value;const rows=items.filter(p=>(!ch||p.channel===ch)&&(!st||p.status===st));$('count').textContent=items.length;$('plannedCount').textContent=items.filter(p=>p.status==='planned').length;$('readyCount').textContent=items.filter(p=>p.status==='ready').length;const root=$('posts');root.replaceChildren();if(!rows.length){const p=document.createElement('p');p.textContent='Sin contenidos en esta selección.';root.append(p)}for(const item of rows){const article=document.createElement('article');article.className='post';const left=document.createElement('div');const tag=document.createElement('span');tag.className='badge';tag.textContent=item.channel+' · '+item.format+' · '+item.status;const title=document.createElement('h3');title.textContent=item.title;const date=document.createElement('div');date.className='muted';date.textContent=item.planned_at?'Previsto: '+new Date(item.planned_at).toLocaleString('es-PE',{timeZone:'America/Lima'}):'Sin fecha asignada';const description=document.createElement('p');description.textContent=item.caption.slice(0,240);left.append(tag,title,date,description);const buttons=document.createElement('div');const edit=document.createElement('button');edit.className='ghost';edit.textContent='Editar';edit.addEventListener('click',()=>{for(const f of ['title','caption','channel','format','status'])$(f).value=item[f];$('media').value=item.media_url||'';$('planned').value=dateLocal(item.planned_at);selectedMediaPath=item.media_path||null;$('mediaInfo').textContent=selectedMediaPath?'Archivo guardado: '+selectedMediaPath:'Sin archivo adjunto';$('postId').value=item.id;$('editorTitle').textContent='Editar contenido';window.scrollTo({top:0,behavior:'smooth'})});buttons.append(edit);if(item.media_path){const open=document.createElement('button');open.className='ghost';open.textContent='Ver medio';open.addEventListener('click',async()=>{try{const url=await mediaSignedUrl(item.media_path);window.open(url,'_blank','noopener,noreferrer')}catch(e){note(e.message)}});buttons.append(open)}article.append(left,buttons);root.append(article)}if(view==='calendar')renderCalendar()}
$('login').addEventListener('submit',async e=>{e.preventDefault();try{await signIn($('email').value.trim(),$('password').value);$('password').value='';await load()}catch(err){note(err.message)}});
$('logout').addEventListener('click',async()=>{await signOut();state(false);items=[];note('Sesión cerrada')});
$('clear').addEventListener('click',clear);$('refresh').addEventListener('click',load);
$('filterChannel').addEventListener('change',render);$('filterStatus').addEventListener('change',render);
$('editor').addEventListener('submit',async e=>{e.preventDefault();const button=$('save');const id=$('postId').value;const planned_at=toUTC($('planned').value);const status=$('status').value;if(status==='planned'&&!planned_at){note('Asigna una fecha para planificar.');return;}if($('media').value&&!$('media').value.startsWith('https://')){note('El enlace debe comenzar por https://');return;}const file=$('file').files[0];if(file){try{note('Subiendo archivo privado…');selectedMediaPath=await uploadMedia(file);}catch(err){note(err.message);button.disabled=false;return;}}const data={title:$('title').value.trim(),caption:$('caption').value,channel:$('channel').value,format:$('format').value,media_url:$('media').value||null,media_path:selectedMediaPath,planned_at,status};button.disabled=true;try{await adminRest(id?'PATCH':'POST','bering_content_posts'+(id?'?id=eq.'+encodeURIComponent(id):''),data);clear();await load();note('Contenido guardado correctamente.')}catch(err){note(err.message)}finally{button.disabled=false}});
if(!configured)note('Supabase no está configurado.');else if(hasSession())load();
$('showList').addEventListener('click',()=>{view='list';$('calendar').hidden=true;$('posts').hidden=false});
$('showCalendar').addEventListener('click',()=>{view='calendar';$('calendar').hidden=false;$('posts').hidden=true;renderCalendar()});
function renderCalendar(){
 const root=$('calendar');root.replaceChildren();
 const month=$('month').value||new Date().toISOString().slice(0,7);
 const [year,m]=month.split('-').map(Number);const days=new Date(year,m,0).getDate();
 const grid=document.createElement('div');grid.className='calendar-grid';
 for(let day=1;day<=days;day++){
   const key=month+'-'+String(day).padStart(2,'0');
   const cell=document.createElement('div');cell.className='calendar-cell';
   const label=document.createElement('strong');label.textContent=String(day);cell.append(label);
   const matches=items.filter(p=>p.planned_at&&dateLocal(p.planned_at).startsWith(key));
   for(const item of matches){const tag=document.createElement('div');tag.className='calendar-entry';tag.textContent=item.channel+' · '+item.title;tag.title=item.status+' · '+item.format;cell.append(tag)}
   grid.append(cell);
 }
 root.append(grid);
}
$('month').value=new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Lima',year:'numeric',month:'2-digit'}).format(new Date());
$('month').addEventListener('change',renderCalendar);
