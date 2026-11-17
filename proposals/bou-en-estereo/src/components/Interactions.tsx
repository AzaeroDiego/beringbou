/* eslint-disable @next/next/no-img-element -- Official flyers are precompressed local assets with explicit dimensions. */
'use client';
import { useRef, useState } from 'react';
import { Arrow, Pass } from './Visuals';
import { wa } from '@/data/site';

export function Lightbox({src, alt, label}: {src: string; alt: string; label: string}) {
  const ref = useRef<HTMLDialogElement>(null);
  return <><button type="button" className="media-button" aria-label={src.includes("halloween") ? "Archivo · Evento finalizado. " + label : label} onClick={()=>ref.current?.showModal()}><img src={src} alt={alt} width="1080" height={src.includes("halloween") || src.includes("cumple") ? 1350 : 1080} loading="lazy"/>{src.includes("halloween") && <span className="archive-image-badge">Archivo · Evento finalizado</span>}<span className="media-expand" aria-hidden="true">↗</span></button><dialog className="lightbox" ref={ref} onClick={e=>{if(e.target===e.currentTarget)ref.current?.close();}}><div className="lightbox-top"><p>{label}</p><button type="button" className="close-button" onClick={()=>ref.current?.close()} aria-label="Cerrar imagen">×</button></div><img src={src} alt={alt} width="1080" height={src.includes("halloween") || src.includes("cumple") ? 1350 : 1080}/><p className="fine">{src.includes("halloween") ? "Flyer histórico. Los precios, promociones y entradas de esta fecha han caducado." : "Flyer oficial. Consulta vigencia y condiciones con el local antes de asistir."}</p></dialog></>;
}
export function Reservation() {
  const [message,setMessage] = useState('');
  function prepare(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = `Hola Bering Bou, soy ${data.get('name')}. Quiero consultar ${data.get('plan')} para el ${data.get('date')}, somos ${data.get('guests')} personas. ¿Me confirman disponibilidad y condiciones?`;
    setMessage(text);
  }
  return <form className="reservation-form" onSubmit={prepare} onChange={()=>setMessage('')}><h3>¿Cuál es el plan?</h3><div className="field"><label htmlFor="plan">Quiero organizar</label><select id="plan" name="plan" defaultValue="un box"><option value="un box">Un box con mi gente</option><option value="mi cumpleaños">Mi cumpleaños</option><option value="una salida en grupo">Una salida en grupo</option></select></div><div className="field"><label htmlFor="name">Tu nombre</label><input id="name" name="name" required maxLength={60} autoComplete="given-name" placeholder="¿Cómo te llamas?"/></div><div className="form-row"><div className="field"><label htmlFor="date">Fecha</label><input id="date" name="date" type="date" onFocus={e=>{e.currentTarget.min=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Lima'}).format(new Date());}} required/></div><div className="field"><label htmlFor="guests">Personas</label><input id="guests" name="guests" type="number" min="1" max="100" required placeholder="Tu grupo"/></div></div><button className="button" type="submit">Preparar mi consulta <Arrow/></button><p className="fine">No se guarda información aquí. Prepararemos un mensaje para que lo envíes por WhatsApp. La consulta no confirma una reserva.</p>{message && <div className="prepared-message" role="status"><p>{message}</p><a className="button" href={wa(message)} target="_blank" rel="noopener noreferrer">Continuar en WhatsApp <Arrow/></a></div>}</form>;
}
export function TicketDemo() {
  const [mode,setMode] = useState<'general'|'vip'>('general');
  const [step,setStep] = useState(0);
  return <div className="ticket-demo"><div className="ticket-preview"><Pass vip={mode==='vip'}/></div><div className="ticket-controls"><span className="tag">Prototipo interactivo</span><h2>Tu noche.<br/>Tu acceso.</h2><div className="ticket-types" role="group" aria-label="Tipo de pase de demostración">{(['general','vip'] as const).map(type=><button type="button" key={type} aria-pressed={mode===type} onClick={()=>{setMode(type);setStep(0);}}>{type==='general'?'General':'VIP'}<Arrow/></button>)}</div><p>{mode==='general'?'Una propuesta de entrada digital con los detalles del evento y su acceso reunidos en un pase.':'Una propuesta que reúne el acceso digital y la coordinación de tu experiencia VIP.'}</p><ol className="ticket-steps">{['Elige tu evento','Revisa las condiciones','Recibe tu pase'].map((label,i)=><li key={label} className={step===i?'step-current':''}><span>{i+1}</span>{label}</li>)}</ol><button type="button" className="button" onClick={()=>setStep((step+1)%3)}>Ver siguiente paso <Arrow/></button><p className="demo-feedback" role="status">{['En el sistema futuro elegirías un evento con venta habilitada.','Aquí aparecerían precio, condiciones y disponibilidad confirmados.','El pase válido se emitiría después de confirmar la compra. Esta demo no emite accesos.'][step]}</p><p className="fine">No hay venta, cobro, QR válido ni asignación de box en esta demostración.</p></div></div>;
}
