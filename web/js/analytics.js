import { config } from '../config.js';
import { configured, rpc } from './api.js';
import { sourceFrom, campaignFrom, newId } from './core.js';
let enabled = false; let sessionId; let attribution; let observer; let pageTracked = false;
const seen = new Set(); const pending = new Map(); let flushing = false;
const consentKey = 'bering.analytics.consent.v1';
export const consent = () => { try { return localStorage.getItem(consentKey); } catch { return null; } };
export function functionalSession() {
  try { let id = sessionStorage.getItem('bering.request.session'); if (!id) { id = newId(); sessionStorage.setItem('bering.request.session', id); } return id; } catch { return newId(); }
}
export async function track(name, detail = {}) {
  if (!enabled || !configured || !sessionId) return;
  const allowed = ['page_view','section_view','box_select','form_start','request_submitted','whatsapp_click','scroll_depth'];
  if (!allowed.includes(name)) return;
  const item = { id: newId(), session_id: sessionId, name, page: location.pathname.includes('/cumple') ? '/cumple/' : '/', source: attribution.source, campaign: attribution.campaign, event_slug: config.event.slug, section: detail.section || null, box_id: detail.box_id || null, depth: detail.depth || null };
  if (pending.size < 100) pending.set(item.id, item);
  await flush();
}
async function flush() {
  if (flushing || !enabled || !pending.size) return; flushing = true;
  try { for (const [id,item] of pending) { if (!enabled) break; await rpc('bering_track_event', { p_event: item }); pending.delete(id); } } catch { /* Reintento idempotente al recuperar conexión; no bloquear al visitante. */ }
  finally { flushing = false; }
}
function start() {
  if (enabled) return; enabled = true;
  try { sessionId = sessionStorage.getItem('bering.analytics.session'); if (!sessionId) { sessionId = newId(); sessionStorage.setItem('bering.analytics.session',sessionId); } } catch { sessionId = newId(); }
  try { attribution = JSON.parse(sessionStorage.getItem('bering.analytics.attribution') || 'null'); } catch {}
  if (!attribution) { attribution = {source:sourceFrom(document.referrer,location.search),campaign:campaignFrom(location.search)}; try { sessionStorage.setItem('bering.analytics.attribution',JSON.stringify(attribution)); } catch {} }
  if (!pageTracked) { pageTracked = true; track('page_view'); }
  observer = new IntersectionObserver(entries => entries.forEach(entry => {
    const id = entry.target.id; if (!['inicio','evento','boxes','cumple','visitanos'].includes(id)) return; if (entry.isIntersecting && !seen.has(id)) { seen.add(id); track('section_view', { section: id }); }
  }), { threshold: 0.2 });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
function stop() { enabled = false; observer?.disconnect(); pending.clear(); sessionId = null; attribution = null; pageTracked = false; seen.clear(); try { sessionStorage.removeItem('bering.analytics.session'); sessionStorage.removeItem('bering.analytics.attribution'); } catch {} }
export function setConsent(value) { try { localStorage.setItem(consentKey, value); } catch {} if (value === 'accepted') start(); else stop(); }
export function initAnalytics() {
  if (consent() === 'accepted') start();
  const banner = document.getElementById('consent-banner'); banner.hidden = consent() !== null;
  document.querySelectorAll('[data-consent]').forEach(button => button.addEventListener('click', () => { setConsent(button.dataset.consent); banner.hidden = true; }));
  document.getElementById('privacy-settings').addEventListener('click', () => { banner.hidden = false; banner.querySelector('button').focus(); });
  window.addEventListener('online', flush);
  let scrollFrame = false;
  window.addEventListener('scroll', () => { if (!enabled || scrollFrame) return; scrollFrame = true; requestAnimationFrame(() => { scrollFrame = false; const total = document.documentElement.scrollHeight - innerHeight; if (total <= 0) return; const depth = Math.floor(scrollY / total * 100); for (const mark of [25,50,75,100]) if (depth >= mark - (mark===100 ? 1 : 0) && !seen.has('scroll'+mark)) { seen.add('scroll'+mark); track('scroll_depth',{ depth: mark }); } }); }, { passive: true });
}
