import { config } from '../config.js';
import { money, boxType, limaDate, validateRequest, newId } from './core.js';
import { configured, rpc } from './api.js';
import { initAnalytics, track, functionalSession } from './analytics.js';
let selected = 1; let availability = null; let availabilityError = false;
const $ = selector => document.querySelector(selector);
const eventOpenByDate = config.event.date >= limaDate();
const positions = { 1:'IZQUIERDA / CERCA DEL ESCENARIO',2:'IZQUIERDA / SEGUNDA FILA',3:'IZQUIERDA / TERCERA FILA',4:'IZQUIERDA / CUARTA FILA',5:'IZQUIERDA / CERCA DE BARRA VIP',6:'DERECHA / CERCA DEL ESCENARIO',7:'DERECHA / SEGUNDA FILA',8:'DERECHA / TERCERA FILA',9:'DERECHA / CUARTA FILA',10:'DERECHA / CERCA DE BARRA VIP' };
for (let id=1; id<=10; id++) {
  const button = document.createElement('button'); button.type = 'button'; button.className = 'floor-box ' + boxType(id); button.dataset.box=String(id); button.setAttribute('aria-pressed',String(id===selected));
  const number=document.createElement('span'); number.textContent=String(id).padStart(2,'0'); const label=document.createElement('small');label.textContent=boxType(id).toUpperCase();button.append(number,label);
  button.setAttribute('aria-label','Box '+id+' '+boxType(id));
  button.addEventListener('click',()=>{ selectBox(id); track('box_select',{box_id:id}); });
  $(id<=5?'#boxes-left':'#boxes-right').append(button);
}
function selectBox(id) {
  selected=id; const pkg=config.event.packages[boxType(id)];
  $('#box-position').textContent=positions[id]; $('#box-label').replaceChildren(document.createTextNode('BOX '));
  const em=document.createElement('em');em.textContent=String(id).padStart(2,'0');$('#box-label').append(em);
  if(config.boxInquiryOnly){
    $('#package-name').textContent='ZONA '+boxType(id).toUpperCase();
    $('#package-price').textContent='Por consultar';
    document.querySelectorAll('[data-box]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.box)===selected)));
    updateBoxInquiry();return;
  }
  $('#package-name').textContent=pkg.name.toUpperCase();$('#package-price').textContent=money(pkg.price);
  $('#package-includes').replaceChildren(...['1 botella '+pkg.bottle,'2 guaranás','Hielo ilimitado','4 pulseras VIP'].map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  document.querySelectorAll('[data-box]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.box)===selected)));
  const taken=availability?.taken?.includes(selected);const open=eventOpenByDate && availability?.active;
  $('#request-box').disabled=!open || taken || availabilityError;
  if (document.getElementById('booking-options')) renderBookingOptions();
  $('#request-box').firstChild.textContent=taken?'Box confirmado ': 'Solicitar este box ';
  $('#box-notice').textContent=taken?'Este box ya tiene una reserva confirmada. Elige otro.':(config.demo?'Demostración interactiva: no envía datos ni separa espacios.':!configured?'Conectando próximamente las solicitudes. Puedes explorar los paquetes.':availabilityError?'No pudimos verificar disponibilidad. Pulsa Actualizar para reintentar.':!open?'El evento no acepta solicitudes en este momento.':'Tu solicitud será atendida antes de confirmar la reserva.');
}
async function refreshAvailability() {
  if(config.boxInquiryOnly){selectBox(selected);return;}
  const status=$('#availability-status');availabilityError=false;$('#refresh-boxes').disabled=true;$('#request-box').disabled=true;
  status.textContent='Consultando disponibilidad…';
  try {
    if(config.demo){availability={active:eventOpenByDate,taken:[]};status.textContent='Plano de demostración. No indica disponibilidad real.';}
    else if(!configured){availability=null;status.textContent='Vista de paquetes. Supabase aún no está configurado.';}
    else { availability=await rpc('bering_availability',{p_event_slug:config.event.slug});status.textContent=availability.active?'Disponibilidad consultada. Solo se marcan las reservas confirmadas.':'El evento está cerrado para solicitudes.'; }
    document.querySelectorAll('[data-box]').forEach(button=>{ const taken=availability?.taken?.includes(Number(button.dataset.box));button.classList.toggle('taken',Boolean(taken));button.disabled=Boolean(taken);button.querySelector('small').textContent=taken?'CONFIRMADO':boxType(button.dataset.box).toUpperCase(); });
  } catch { availabilityError=true;availability=null;status.textContent='Sin conexión. No podemos asegurar la disponibilidad actual.'; }
  finally { $('#refresh-boxes').disabled=false;selectBox(selected); }
}
$('#refresh-boxes').addEventListener('click',refreshAvailability);
const dialogs=document.querySelectorAll('dialog');
for(const dialog of dialogs){dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});}
$('.privacy-open');document.querySelectorAll('.privacy-open').forEach(b=>b.addEventListener('click',()=>$('#privacy-dialog').showModal()));
function setBookingStep(step) {
  $('#booking-zone').hidden=step!==1;$('#box-form').hidden=step!==2;$('#booking-success').hidden=step!==3;
  document.querySelectorAll('[data-step-label]').forEach(label=>{label.classList.toggle('active',Number(label.dataset.stepLabel)===step);if(Number(label.dataset.stepLabel)===step)label.setAttribute('aria-current','step');else label.removeAttribute('aria-current');});
}
function renderBookingOptions() {
  const container=$('#booking-options');if(!container)return;
  container.replaceChildren(...Array.from({length:10},(_,i)=>i+1).map(id=>{
    const button=document.createElement('button');button.type='button';button.className=boxType(id);button.setAttribute('aria-label','Elegir box '+id);button.setAttribute('aria-pressed',String(id===selected));button.textContent=String(id).padStart(2,'0');
    const label=document.createElement('small');const taken=availability?.taken?.includes(id);label.textContent=taken?'OCUPADO':boxType(id).toUpperCase();button.disabled=Boolean(taken);button.append(label);
    button.addEventListener('click',()=>{selectBox(id);track('box_select',{box_id:id});});return button;
  }));
  const pkg=config.event.packages[boxType(selected)];const selection=$('#booking-selection');selection.replaceChildren(document.createTextNode('Box '+String(selected).padStart(2,'0')+' · '+pkg.name));const price=document.createElement('strong');price.textContent=money(pkg.price);selection.append(price);
  $('#booking-next').disabled=!eventOpenByDate||!availability?.active||availabilityError||availability?.taken?.includes(selected);
}
function openBooking() {
  if(config.boxInquiryOnly){$('#boxes').scrollIntoView({behavior:'smooth'});$('#box-date').focus({preventScroll:true});return;}
  renderBookingOptions();setBookingStep(1);$('#box-form-title').textContent='Reserva tu box';$('#box-form .form-message').textContent='';$('#box-dialog').showModal();
}
if(!config.boxInquiryOnly)$('#request-box').addEventListener('click',openBooking);
$('#hero-book')?.addEventListener('click',openBooking);
$('#event-book')?.addEventListener('click',openBooking);
$('#booking-next').addEventListener('click',()=>{
  const pkg=config.event.packages[boxType(selected)];$('#box-form-package').textContent='Box '+String(selected).padStart(2,'0')+' · '+pkg.name+' · '+money(pkg.price);setBookingStep(2);$('#box-name').focus();track('form_start',{box_id:selected,section:'boxes'});
});
$('#booking-back').addEventListener('click',()=>setBookingStep(1));
$('#booking-done').addEventListener('click',()=>$('#box-dialog').close());
// Calendario local: conserva viernes/sábado visibles sin anunciar un artista no confirmado.
function nextWeekday(day) {
  const date=new Date(limaDate()+'T12:00:00Z');
  date.setUTCDate(date.getUTCDate()+(day-date.getUTCDay()+7)%7);
  return date;
}
for(const [id,day] of [['friday-date',5]]) {
  const date=nextWeekday(day);
  $('#'+id).textContent=new Intl.DateTimeFormat('es-PE',{timeZone:'America/Lima',weekday:'long',day:'2-digit',month:'short'}).format(date).toUpperCase();
}
if(limaDate()>'2026-11-07') {
  $('#saturday-date').textContent='FINALIZADO · SÁBADO, 07 NOV. 2026';
  $('#saturday-announcement').textContent='Este evento ya finalizó. Consulta las próximas fechas.';
  $('.saturday-card [data-whatsapp]').textContent='Consultar próximas fechas ↗';
}
const boxDate=$('#box-date');boxDate.min=limaDate();boxDate.value=limaDate(nextWeekday(5));
function updateBoxInquiry() {
  const link=$('#request-box');
  const valid=boxDate.checkValidity() && boxDate.value>=limaDate() && /^519\d{8}$/.test(config.whatsapp);
  link.setAttribute('aria-disabled',String(!valid));
  if(!valid){link.removeAttribute('href');$('#box-notice').textContent='Elige una fecha desde hoy para consultar este box.';return;}
  const date=new Intl.DateTimeFormat('es-PE',{timeZone:'America/Lima',day:'numeric',month:'long',year:'numeric'}).format(new Date(boxDate.value+'T12:00:00Z'));
  link.href='https://wa.me/'+config.whatsapp+'?text='+encodeURIComponent('Hola, vi los boxes en la web de Bering Bou. Quiero consultar el box '+String(selected).padStart(2,'0')+' para el '+date+'. ¿Cuál es el precio, capacidad y qué incluye el paquete?');
  $('#box-notice').textContent='Consulta para el '+date+'. No separa el box; el local debe confirmar disponibilidad y condiciones.';
}
boxDate.addEventListener('input',updateBoxInquiry);
$('#request-box').addEventListener('click',event=>{if(config.boxInquiryOnly){updateBoxInquiry();if($('#request-box').getAttribute('aria-disabled')==='true')event.preventDefault();else track('whatsapp_click',{section:'boxes',box_id:selected});}});
const dateInput=$('#birthday-date');dateInput.min=limaDate(); const maxDate=new Date(limaDate()+'T12:00:00Z');maxDate.setUTCDate(maxDate.getUTCDate()+366);dateInput.max=limaDate(maxDate);
let birthdayStarted=false;$('#birthday-form').addEventListener('focusin',event=>{if(event.target.matches('input:not([type=checkbox])')&&!birthdayStarted){birthdayStarted=true;track('form_start',{section:'cumple'});}});
function setupForm(form,kind) {
  let pendingId=null;let pendingPayload=null;let lastFingerprint=null;let sending=false;
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(sending)return;const values=new FormData(form);const message=form.querySelector('.form-message');message.classList.remove('error');
    if(values.get('website'))return;
    const data={kind,name:String(values.get('name')||'').trim(),phone:String(values.get('phone')||'').trim(),date:kind==='box'?config.event.date:String(values.get('date')),guests:Number(values.get('guests')),privacy:values.get('privacy')==='on',box_id:kind==='box'?selected:null,event_slug:kind==='box'?config.event.slug:null};
    if(kind==='box' && config.boxInquiryOnly){message.textContent='Consulta el paquete vigente por WhatsApp desde el plano de boxes.';return;}
    const invalid=validateRequest(data);if(invalid){message.textContent=invalid;message.classList.add('error');return;}
    if(config.demo){
      if(kind==='box'){$('#booking-success-code').textContent='Vista previa: no se enviaron datos ni se guardó una reserva.';$('#booking-success h3').textContent='Así se verá tu solicitud';setBookingStep(3);}
      else message.textContent='Vista previa completada. No se enviaron datos ni se guardó una solicitud.';
      return;
    }
    if(!configured){message.textContent='La conexión de solicitudes aún no está configurada. Tus datos no se han enviado.';message.classList.add('error');return;}
    // En un error de red, el reintento conserva el ID y la carga original para no duplicar.
    const fingerprint=JSON.stringify(data);
    if(pendingId && fingerprint!==lastFingerprint){message.textContent='Hay un envío sin confirmar. Reintenta con los datos originales antes de crear otra solicitud.';message.classList.add('error');return;}
    if(!pendingId){pendingId=newId();pendingPayload={...data,id:pendingId,session_id:functionalSession()};lastFingerprint=fingerprint;}
    const button=form.querySelector('button[type=submit]');sending=true;button.disabled=true;message.textContent='Guardando tu solicitud…';
    try {
      const id=await rpc('bering_create_request',{p_request:pendingPayload});
      message.textContent='Solicitud recibida. Código: '+id+'\nEl local debe confirmar disponibilidad y condiciones. Este envío no separa el box.';
      track('request_submitted',{section:kind==='box'?'boxes':'cumple',box_id:data.box_id});
      if(/^519\d{8}$/.test(config.whatsapp)){
        const link=document.createElement('a');link.className='inline-link';link.textContent=' Continuar por WhatsApp ↗';link.target='_blank';link.rel='noopener';
        link.href='https://wa.me/'+config.whatsapp+'?text='+encodeURIComponent('Hola, envié la solicitud '+id+' en la web de Bering Bou. Quiero coordinar mi '+(kind==='box'?'box.':'cumpleaños.'));
        link.addEventListener('click',()=>track('whatsapp_click',{section:kind==='box'?'boxes':'cumple'}));message.append(link);
      }
      pendingId=null;pendingPayload=null;lastFingerprint=null;form.reset();if(kind==='box'){$('#booking-success-code').textContent='Tu código de solicitud: '+id;setBookingStep(3);await refreshAvailability();}
    }catch(error){message.textContent=error.message+' Si el envío quedó sin confirmar, vuelve a pulsar Enviar con los mismos datos.';message.classList.add('error');}
    finally{sending=false;button.disabled=false;}
  });
}
setupForm($('#birthday-form'),'birthday');setupForm($('#box-form'),'box');
if(!eventOpenByDate && $('#event-state'))$('#event-state').textContent='Este evento ya pasó. Consulta próximas fechas y celebra tu cumpleaños con nosotros.';
if(config.demo){
  $('#consent-banner').hidden=true;$('#privacy-settings').hidden=true;
  const notice=document.createElement('div');notice.className='demo-notice';notice.textContent='VISTA PREVIA DE DISEÑO · No recibe reservas ni registra datos';document.body.prepend(notice);
  document.querySelector('a[href$="admin/"]').hidden=true;
}else initAnalytics();
refreshAvailability();
if(location.pathname.includes('/cumple'))requestAnimationFrame(()=>$('#cumple').scrollIntoView());

// El visitante abre el chat y decide si envía el mensaje. No se envía desde la web.
for (const link of document.querySelectorAll('[data-whatsapp]')) {
  if (!/^519\d{8}$/.test(config.whatsapp)) { link.hidden = true; continue; }
  const subject = link.dataset.whatsapp;
  const texts = {
    viernes: 'Hola, vi Viernes Chelero en la web de Bering Bou: 2 Pilsen por S/15 hasta medianoche. Quiero consultar las condiciones para este viernes.',
    cumple: 'Hola, vi los cumpleaños en la web de Bering Bou. Quiero celebrar el [fecha] con [cantidad] personas. ¿Qué beneficios y condiciones aplican?',
    evento: limaDate()<='2026-11-07' ? 'Hola, vi en la web de Bering Bou el evento de Kike Mouse: Halloween, Los cuentos de la cripta parte 2, del sábado 7 de noviembre de 2026. Quiero consultar condiciones de ingreso, boxes y premio al mejor disfraz.' : 'Hola, vi en la web de Bering Bou el evento pasado de Kike Mouse. Quiero conocer las próximas fechas y condiciones de ingreso.'
  };
  link.href = 'https://wa.me/' + config.whatsapp + '?text=' + encodeURIComponent(texts[subject]);
  link.addEventListener('click', () => track('whatsapp_click', {section: subject === 'viernes' ? null : subject}));
}
