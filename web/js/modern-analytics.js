// Existing consent-based analytics, without assigning new visits to the expired Halloween event.
import {config} from '../config.js';
import {initAnalytics,track} from './analytics.js';
if(!config.demo){
 initAnalytics({eventSlug:null});
 document.addEventListener('click',event=>{
  const target=event.target instanceof Element?event.target:null;
  const box=target?.closest('[data-box-id]');
  if(box)track('box_select',{section:'boxes',box_id:Number(box.dataset.boxId)});
  const link=target?.closest('a[href^="https://wa.me/"]');
  if(link)track('whatsapp_click',{section:link.closest('#boxes')?'boxes':null});
 });
 const started=new WeakSet();
 document.addEventListener('focusin',event=>{
  const form=event.target instanceof Element?event.target.closest('#reservas form'):null;
  if(form&&!started.has(form)){started.add(form);track('form_start',{section:'boxes'});}
 });
}
