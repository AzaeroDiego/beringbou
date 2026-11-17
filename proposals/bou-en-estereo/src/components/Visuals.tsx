export function Arrow() { return <span className="arrow" aria-hidden="true">↗</span>; }
export function Stereo() {
  return <div className="stereo" aria-hidden="true"><svg className="stereo-svg" viewBox="0 0 540 580" fill="none"><defs><filter id="softglow"><feGaussianBlur stdDeviation="11"/></filter><linearGradient id="bou-light" x1="0" y1="0" x2="540" y2="580" gradientUnits="userSpaceOnUse"><stop stopColor="#f9e547"/><stop offset=".62" stopColor="#f9e547"/><stop offset="1" stopColor="#f491cd"/></linearGradient></defs>
    <g className="stereo-left"><path d="M78 70H187C310 70 318 244 205 263C344 281 320 486 180 486H78V70Z" stroke="#f9e547" strokeWidth="14" opacity=".55" filter="url(#softglow)"/><path d="M78 70H187C310 70 318 244 205 263C344 281 320 486 180 486H78V70Z" stroke="url(#bou-light)" strokeWidth="3"/></g>
    <g className="stereo-right"><path d="M238 114H347C470 114 478 288 365 307C504 325 480 530 340 530H238V114Z" stroke="#f491cd" strokeWidth="14" opacity=".5" filter="url(#softglow)"/><path d="M238 114H347C470 114 478 288 365 307C504 325 480 530 340 530H238V114Z" stroke="#f491cd" strokeWidth="3"/></g>
  </svg><div className="scene-axis"/><span className="scene-coordinate">B / B</span></div>;
}
export function Pass({ vip = false }: { vip?: boolean }) {
  return <div className={`digital-pass ${vip ? 'vip-pass' : ''}`}><div className="pass-top"><strong>BERING BOU</strong><span>DEMO</span></div><div className="pass-art" aria-hidden="true"><span>B</span><span>B</span></div><div className="pass-bottom"><span>HUAYCÁN / LIMA</span><strong>{vip ? 'VIP' : 'TU PASE.'}</strong><span>CONCEPTO DE ACCESO DIGITAL</span></div><div className="pass-tear"/><div className="pass-code"><div className="barcode" aria-hidden="true"/><span>DEMO · SIN VALIDEZ PARA INGRESAR</span></div></div>;
}
