'use client';
import {useState} from 'react';
import {Lightbox} from './Interactions';

const photos=[
 {src:'/media/gallery/grupo-en-bering.webp',alt:'Un grupo junto a una mesa bajo la iluminación de colores del local',caption:'El plan es con tu gente.'},
 {src:'/media/gallery/junto-a-la-cabina.webp',alt:'Celebración junto a la cabina, bajo luces rosas',caption:'Cerca de la música.'},
 {src:'/media/gallery/celebracion.webp',alt:'Un grupo celebra con una torta y un micrófono en Bering Bou',caption:'Un recuerdo para llevarse.'},
];

export function Gallery(){
 const [filter,setFilter]=useState('Fotografías');
 return <><div className="gallery-filters" role="group" aria-label="Tipo de galería">{['Fotografías','Videos','Carteles'].map(item=><button key={item} type="button" aria-pressed={filter===item} onClick={()=>setFilter(item)}>{item}<span aria-hidden="true">↗</span></button>)}</div><div className="gallery-body" aria-live="polite">
 {filter==='Fotografías'?<><div className="photo-grid">{photos.map((photo,i)=><figure key={photo.src} className={i===0?'photo-wide':''}><Lightbox src={photo.src} alt={photo.alt} label={`Ampliar fotografía: ${photo.caption}`}/><figcaption>{photo.caption}</figcaption></figure>)}</div><p className="fine gallery-credit">Fotografías compartidas por Bering Bou para esta propuesta.</p></>:filter==='Videos'?<div className="real-video-grid"><figure><video width="720" height="1280" controls playsInline muted preload="none" poster="/media/gallery/ambiente-poster.webp" aria-label="Ambiente de Bering Bou, clip de unos segundos sin audio"><source src="/media/gallery/ambiente.mp4" type="video/mp4"/>Tu navegador no puede reproducir este video.</video><figcaption>Un vistazo a la noche. Clip de ambiente, sin audio.</figcaption></figure><div><span className="tag">Dentro de Bering</span><h3>La noche,<br/>en movimiento.</h3><p>Luces, música y tu gente en un mismo lugar.</p><p className="fine">Video facilitado para esta propuesta. El archivo completo se conserva fuera de la web.</p></div></div>:<div className="archive-grid"><Lightbox src="/media/halloween.webp" alt="Flyer histórico de El Chombo, Halloween del 31 de octubre de 2026. Sus precios y promociones ya no aplican" label="Ver flyer histórico de Halloween"/><div className="archive-copy"><span className="tag">Archivo · Evento finalizado</span><h3>Los cuentos<br/>de la cripta.</h3><p>Halloween con El Chombo.<br/><time dateTime="2026-10-31">31 de octubre de 2026</time>.</p><p className="fine">Este cartel pertenece al archivo. Sus precios, entradas y promociones no están vigentes.</p><span className="archive-sign" aria-hidden="true">BOU<br/>MEMORIES.</span></div></div>}
 </div></>;
}
