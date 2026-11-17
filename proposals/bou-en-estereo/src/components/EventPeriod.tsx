'use client';
import {useSyncExternalStore} from 'react';
import {wa} from '@/data/site';
const subscribe=(update:()=>void)=>{const timer=setInterval(update,60000);return()=>clearInterval(timer);};
const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Lima',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const server=()=>'';
export function EventPeriod({date,children}:{date:string;children:React.ReactNode}){
 const current=useSyncExternalStore(subscribe,today,server);
 if(current&&current>date)return <div className="event-expired"><span className="tag">Programación por anunciar</span><h3>La próxima noche<br/>empieza contigo.</h3><p>La fecha anterior ya finalizó. Consulta la nueva programación y las condiciones para tu grupo.</p><a className="button" href={wa('Hola, quiero conocer la próxima programación de Bering Bou y consultar por mi grupo.')} target="_blank" rel="noopener noreferrer">Consultar próximas fechas ↗</a></div>;
 return children;
}
