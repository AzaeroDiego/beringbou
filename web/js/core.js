export const money = value => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(value);
export const boxType = id => [1, 2, 6, 7].includes(Number(id)) ? 'black' : 'red';
export function limaDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}
export function sourceFrom(referrer = '', search = '') {
  const utm = new URLSearchParams(search).get('utm_source')?.toLowerCase();
  const known = { fb: 'facebook', facebook: 'facebook', ig: 'instagram', instagram: 'instagram', wa: 'whatsapp', whatsapp: 'whatsapp', google: 'google' };
  if (known[utm]) return known[utm];
  let host; try { host = new URL(referrer).hostname.toLowerCase(); } catch { return 'direct'; }
  for (const domain of ['facebook.com', 'instagram.com', 'whatsapp.com', 'google.com']) {
    if (host === domain || host.endsWith('.' + domain)) return domain.split('.')[0];
  }
  return 'other';
}
export function campaignFrom(search) {
  const value = new URLSearchParams(search).get('utm_campaign') || '';
  return /^[a-zA-Z0-9_-]{1,64}$/.test(value) ? value : null;
}
export function validPublicConfig(url, key) {
  try { if (!/^https:$/.test(new URL(url).protocol)) return false; } catch { return false; }
  if (key.startsWith('sb_publishable_')) return key.length > 25;
  try { return JSON.parse(atob(key.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).role === 'anon'; } catch { return false; }
}
export function validateRequest(data, today = limaDate()) {
  if (!data.name?.trim() || data.name.trim().length > 80) return 'Escribe tu nombre (máximo 80 caracteres).';
  if (!/^9\d{8}$/.test(data.phone || '')) return 'Escribe un celular peruano de 9 dígitos que comience con 9.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date || '') || Number.isNaN(Date.parse(data.date + 'T12:00:00Z')) || data.date < today) return 'Elige una fecha válida desde hoy.';
  if (!Number.isInteger(data.guests) || data.guests < 1 || data.guests > 100) return 'Indica entre 1 y 100 personas.';
  if (!data.privacy) return 'Acepta el uso de tus datos para atender esta solicitud.';
  return null;
}
export function csvCell(value) {
  let text = String(value ?? '');
  if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
export function funnel(events) {
  const get = name => Number(events.find(row => row.name === name)?.sessions || 0);
  return ['page_view', 'box_select', 'form_start', 'request_submitted'].map(name => ({ name, sessions: get(name) }));
}

export function newId(provider = globalThis.crypto) {
  if (typeof provider?.randomUUID === 'function') return provider.randomUUID();
  const bytes = provider.getRandomValues(new Uint8Array(16));
  bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
  const hex=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
  return hex.slice(0,8)+'-'+hex.slice(8,12)+'-'+hex.slice(12,16)+'-'+hex.slice(16,20)+'-'+hex.slice(20);
}
