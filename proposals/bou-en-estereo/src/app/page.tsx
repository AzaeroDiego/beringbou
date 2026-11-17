import {Gallery} from '@/components/RealGallery';
import Link from 'next/link';
import { Arrow, Stereo, Pass } from '@/components/Visuals';
import { Reservation, Lightbox } from '@/components/Interactions';
import { site, event, wa } from '@/data/site';

export default function Home() {
  return <>
    <section className="hero wrap" aria-labelledby="home-title">
      <div className="hero-top"><span>Discoteca · Huaycán, Lima</span><span className="tiny-status"><i/> Tu próxima gran noche</span></div>
      <div className="hero-grid">
        <div className="hero-copy"><h1 id="home-title" className="brand-display" data-intro>BERING<br/><span>BOU</span></h1>
          <p className="hero-line">La noche suena mejor<br/>con tu gente.</p>
          <div className="hero-actions"><a className="button" href="#agenda">Encuentra tu plan <Arrow/></a><a className="text-link" href="#reservas">Reservar un box <Arrow/></a></div>
        </div>
        <div className="hero-scene"><div className="scene-photo"/><Stereo/><span className="scene-mark">BB / EN ESTÉREO</span><span className="scene-caption">Composición visual conceptual</span></div>
      </div>
      <div className="hero-bottom"><span>Tu mancha. Tu música. Tu lugar.</span><a href="#agenda" className="scroll-link">Sigue el ritmo <span aria-hidden="true">↓</span></a><span>Solo +18 · Vive la noche con responsabilidad</span></div>
    </section>
    <section id="agenda" className="section wrap agenda">
      <div className="section-head"><h2>El próximo<br/><span className="outline-type">encuentro.</span></h2><p>Deja el chat un rato. <br/>Nos vemos en Bering.</p></div>
      <article className="featured-event">
        <Lightbox src={event.image} alt="Flyer oficial: ERROR, TikToker invitado, sábado 21 de noviembre en Bering Bou" label="Ampliar flyer de ERROR"/>
        <div className="event-copy"><div className="event-meta"><time dateTime={event.date}>SÁBADO / 21 NOV 2026</time><span className="tag">Próximo evento</span></div>
          <p className="event-role">{event.role}</p><h3>{event.title}<span className="pink" aria-hidden="true">.</span></h3><p>{event.text}</p>
          <a className="button" href={wa('Hola, quiero consultar por ERROR, TikToker invitado del sábado 21 de noviembre de 2026 en Bering Bou.')} target="_blank" rel="noopener noreferrer">Consultar el evento <Arrow/></a>
          <p className="fine">Horario, ingreso y condiciones por confirmar con el local.</p>
          <div className="event-footer"><span>Huaycán, Lima</span><a className="utility" href={event.source} target="_blank" rel="noopener noreferrer">Ver publicación original ↗</a></div>
        </div>
      </article>
      <div className="agenda-note"><span className="mini-dot"/><p>La siguiente fecha se anuncia aquí. Sin artistas ni fechas por confirmar en cartelera.</p></div>
    </section>
    <section id="reservas" className="reservation-section"><div className="wrap reservation-grid"><div><span className="section-label">Tú pones la fecha</span><h2>Junta a<br/>tu <span className="yellow">mancha.</span></h2><p>¿Box, cumpleaños o una salida entre causas? Cuéntanos el plan y coordínalo por WhatsApp.</p><a className="text-link" href={wa()} target="_blank" rel="noopener noreferrer">Prefiero escribir directamente <Arrow/></a><span className="reservation-symbol" aria-hidden="true">↗</span></div><Reservation/></div></section>
    <section id="barra" className="section wrap bar-section">
      <div className="section-head"><h2>Brindemos<br/>por el plan.</h2><p>Promociones publicadas. <br/>Condiciones con el local.</p></div>
      <div className="bar-grid"><Lightbox src="/media/viernes.webp" alt="Flyer oficial Viernes Chelero: dos Pilsen por S/15 hasta medianoche; consultar vigencia" label="Ver flyer de Viernes Chelero"/>
        <div className="bar-copy"><span className="section-label">Los viernes tienen su punto</span><h3>Viernes<br/>Chelero.</h3><p>El flyer oficial está aquí. Consulta su vigencia, horario y condiciones antes de armar tu salida.</p><a className="text-link" href={wa('Hola, ¿está vigente Viernes Chelero? Quiero conocer el horario y las condiciones de la promoción publicada.')} target="_blank" rel="noopener noreferrer">Consultar promoción <Arrow/></a>
          <details className="birthday-details"><summary>¿Se viene tu cumpleaños? <span aria-hidden="true">+</span></summary><p>Coordina los beneficios publicados, la fecha y las condiciones para tu grupo.</p><Lightbox src="/media/cumple.webp" alt="Flyer oficial de cumpleaños en Bering Bou; beneficios sujetos a consulta con el local" label="Ampliar flyer de cumpleaños"/><a className="text-link" href={wa('Hola, quiero consultar los beneficios de cumpleaños y las condiciones para mi grupo.')} target="_blank" rel="noopener noreferrer">Organizar cumpleaños <Arrow/></a></details>
        </div>
        <aside className="drinks-note"><span aria-hidden="true">✳</span><h3>¿Qué va<br/>a la mesa?</h3><p>Cervezas y beneficios de cumpleaños figuran en los flyers oficiales. La carta completa de bebidas y sus precios se consultan por WhatsApp.</p><a className="text-link" href={wa('Hola, ¿me comparten la carta de bebidas actualizada y sus precios?')} target="_blank" rel="noopener noreferrer">Pedir la carta <Arrow/></a></aside>
      </div><p className="fine alcohol-note">Solo mayores de 18 años. Tomar bebidas alcohólicas en exceso es dañino. Consulta siempre la vigencia de los flyers.</p>
    </section>
    <section id="galeria" className="section wrap gallery-section"><div className="section-head"><h2>La noche pasa.<br/><span className="outline-type">La historia queda.</span></h2><p>Carteles del archivo. <br/>Recuerdos de tu gente.</p></div><Gallery/></section>
    <section className="future-section wrap"><div className="future-art"><Pass/></div><div className="future-copy"><span className="tag">Concepto futuro · Demo</span><h2>Menos espera.<br/>Más <span className="yellow">noche.</span></h2><p>Así podría sentirse tu próximo acceso: entradas digitales y experiencia VIP en un mismo lugar.</p><Link className="button" href="/entradas">Explorar el pase digital <Arrow/></Link><p className="fine">Propuesta visual. No vende entradas ni genera accesos válidos.</p></div></section>
    <section id="ubicacion" className="section wrap location-section"><div className="location-top"><span>Nos vemos en la pista</span><span>HUAYCÁN / ATE / LIMA</span></div><div className="location-grid"><h2>LA NOCHE<br/>TIENE <span className="outline-type">LUGAR.</span></h2><div><p className="address">{site.address}</p><p>{site.reference}</p><a className="button" href={site.maps} target="_blank" rel="noopener noreferrer">Cómo llegar <Arrow/></a><p className="fine">Abre una búsqueda de la dirección. Confirma el punto con el local antes de viajar.</p></div></div></section>
  </>;
}
