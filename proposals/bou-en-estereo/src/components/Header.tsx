/* eslint-disable @next/next/no-img-element -- Local SVG identity, no raster optimization needed. */
'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useRef} from 'react';
import {Arrow} from './Visuals';
const items=[['Agenda','/#agenda'],['Boxes','/#boxes'],['La barra','/#barra'],['Galería','/#galeria'],['Ubicación','/#ubicacion']];
export function Header(){
  const path=usePathname();
  const menu=useRef<HTMLDialogElement>(null);
  const toggle=useRef<HTMLButtonElement>(null);
  return <><header className="site-header wrap"><Link href="/" className="logo"><img src="/media/monogram.svg" width="42" height="32" alt=""/><span>BERING BOU<small>HUAYCÁN · LIMA</small></span></Link><nav className="desktop-nav" aria-label="Principal">{items.map(([name,url])=><Link key={url} href={url}>{name}</Link>)}<Link href="/entradas" aria-current={path==='/entradas'?'page':undefined}>Entradas <span className="nav-demo">Demo</span></Link><a href="/qr/" data-no-transition>Mi QR</a></nav><Link className="header-reserve button" href="/#boxes">Separar box <Arrow/></Link><button type="button" className="menu-toggle" ref={toggle} onClick={()=>menu.current?.showModal()} aria-haspopup="dialog">Menú <span aria-hidden="true">☰</span></button></header><dialog className="mobile-menu" ref={menu} onClose={()=>toggle.current?.focus()} aria-label="Menú de navegación"><div className="menu-top"><span>BERING BOU</span><button className="close-button" type="button" aria-label="Cerrar menú" onClick={()=>menu.current?.close()}>×</button></div><nav aria-label="Menú móvil">{[...items,['Entradas · Demo','/entradas'],['Separar box','/#boxes']].map(([name,url])=><Link key={url} href={url} onClick={()=>menu.current?.close()}>{name}<Arrow/></Link>)}<a href="/qr/" data-no-transition>Mi entrada QR <Arrow/></a><a href="/cumple/" data-no-transition>Mi cumpleaños <Arrow/></a></nav><p>Nos vemos en Huaycán.</p></dialog><div className="mobile-reserve"><Link href="/#boxes">Separa tu box<small>Reservas por WhatsApp</small><Arrow/></Link></div></>;
}
