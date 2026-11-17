import type {Metadata} from 'next';
import Link from 'next/link';
import {TicketDemo} from '@/components/Interactions';
import {Arrow} from '@/components/Visuals';
export const metadata:Metadata={title:'El futuro del acceso digital',description:'Explora la propuesta visual de entradas digitales y experiencia VIP de Bering Bou. Una demostración interactiva sin venta ni emisión de accesos.'};
export default function Tickets(){return <div className="wrap inner-page"><div className="inner-top"><Link className="text-link" href="/">← Volver a la noche</Link><span>Concepto futuro / Sin venta habilitada</span></div><h1 className="inner-title">LA NOCHE,<br/><span className="outline-type">EN TU MANO.</span></h1><TicketDemo/><section className="ticket-note"><h2>Hoy, lo coordinamos<br/>por WhatsApp.</h2><p>Mientras esta propuesta toma forma, las reservas, condiciones y disponibilidad se confirman directamente con el local.</p><Link className="button" href="/#reservas">Consultar una reserva <Arrow/></Link></section></div>}
