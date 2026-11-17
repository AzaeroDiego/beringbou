// No invented commercial facts. Missing media/catalogue and future sales are explicitly marked.
export const site = {
  name: 'Bering Bou', url: process.env.NEXT_PUBLIC_SITE_URL || 'http://127.0.0.1:4400',
  production: process.env.NEXT_PUBLIC_SITE_MODE === 'production',
  description: 'La noche empieza con tu gente. Descubre Bering Bou en Huaycán, consulta su agenda y coordina tu próxima salida por WhatsApp.',
  whatsapp: '51930776652',
  address: 'Av. 15 de Julio · Zona A · Lote 29',
  reference: 'Segundo piso del Banco Confianza. Huaycán, Ate, Lima.',
  maps: 'https://www.google.com/maps/search/?api=1&query=Av.+15+de+Julio+Zona+A+Lote+29+Huaycan+Ate',
  source: 'https://www.beringbou.com/',
  checked: '16 de noviembre de 2026',
};
export function wa(message = 'Hola, quiero información para organizar mi próxima salida a Bering Bou.') {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
export const event = {
  title: 'ERROR', role: 'TikToker invitado', date: '2026-11-21', day: '21', month: 'NOV',
  label: 'Sábado 21 de noviembre de 2026', image: '/media/error-2026-11-21.webp',
  text: 'Dile a tu gati gati gatito. El invitado anunciado para este sábado en Bering Bou.',
  source: 'https://www.beringbou.com/assets/error-2026-11-21-cuadrado.webp',
};
export const gallerySource = { suppliedByOwner: true, originalArchive: "Photos-1-001.zip", photos: 3, videoClips: 1, generatedVideoUsed: false };
export const concepts = [
  { id: 'stereo', name: 'Bou en estéreo', territory: 'La identidad', sentence: 'Dos B. Dos canales de luz. Una misma noche.', emotion: 'Energía compartida', signature: 'Las dos B se abren como canales de luz.', shot: 'La marca monumental frente a dos arcos iluminados.', anchor: 'Las dos iniciales B de Bering Bou.', scores: [4,5,5,2], total: 12, selected: true },
  { id: 'route', name: 'Huaycán de noche', territory: 'El lugar', sentence: 'El plan empieza en tu celular y termina en la pista.', emotion: 'Cercanía y descubrimiento', signature: 'Una ruta conecta el plan con la avenida y el local.', shot: 'HUAYCÁN monumental atravesado por una ruta de luz.', anchor: 'Av. 15 de Julio, segundo piso del Banco Confianza.', scores: [4,5,4,3], total: 10, selected: false },
  { id: 'console', name: 'En primera fila', territory: 'El sonido', sentence: 'Cada plan es un canal. Elige el que va contigo.', emotion: 'Curiosidad y control', signature: 'Un canal se amplifica al seleccionarlo.', shot: 'Tres canales gráficos de distintas alturas.', anchor: 'La experiencia musical de una discoteca.', scores: [3,4,5,5], total: 7, selected: false },
];
