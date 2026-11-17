import Link from 'next/link';
import type {Metadata} from 'next';
import {Arrow} from '@/components/Visuals';
export const metadata:Metadata={title:'Página no encontrada',description:'Este plan no está en la programación. Vuelve al inicio de Bering Bou y encuentra la agenda, las reservas y la ubicación del local en Huaycán.'};
export default function NotFound(){return <section className="wrap not-found"><span className="tag">404 / Fuera de señal</span><h1>ESTE PLAN<br/>NO <span className="outline-type">SUENA.</span></h1><p>Esta página no está en la programación.<br/>Vuelve a Bering y encuentra tu próxima salida.</p><Link className="button" href="/">Volver al inicio <Arrow/></Link></section>}
