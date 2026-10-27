import { config } from '../config.js';
import { validPublicConfig } from './core.js';
export const configured = !config.demo && validPublicConfig(config.supabaseUrl, config.supabasePublishableKey);
const sessionKey = 'bering.admin.session';
let session = null;
try { session = JSON.parse(sessionStorage.getItem(sessionKey) || 'null'); } catch { /* Storage no disponible. */ }
function saveSession(value) { session = value; try { if (value) sessionStorage.setItem(sessionKey, JSON.stringify(value)); else sessionStorage.removeItem(sessionKey); } catch {} }
export function hasSession() { return Boolean(session?.access_token); }
async function request(path, { method = 'POST', body, token } = {}) {
  if (!configured) throw new Error('Supabase aún no está conectado. La solicitud no se ha enviado.');
  const headers = { apikey: config.supabasePublishableKey, 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(config.supabaseUrl.replace(/\/$/, '') + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: controller.signal });
    const text = await response.text(); let result; try { result = text ? JSON.parse(text) : null; } catch { result = null; }
    if (!response.ok) {
      const code = result?.code;
      if (code === '23505') throw new Error('Ese box ya tiene una reserva confirmada para el evento.');
      if (result?.message === 'rate_limit') throw new Error('Has enviado varias solicitudes. Inténtalo más tarde.');
      if (response.status === 401 || response.status === 403 || result?.message === 'not_authorized') throw new Error('No tienes acceso o tu sesión venció. Vuelve a iniciar sesión.');
      if (result?.message === 'box_unavailable') throw new Error('Ese box ya no está disponible. Elige otro.');
      if (result?.message === 'event_closed') throw new Error('El evento ya no acepta solicitudes.');
      throw new Error('No se pudo completar la operación. Revisa la conexión y la configuración de Supabase.');
    }
    return result;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Se agotó el tiempo de conexión. Puedes reintentar sin duplicar la solicitud.');
    throw error;
  } finally { clearTimeout(timer); }
}
export async function rpc(name, args = {}, authenticated = false) {
  let token;
  if (authenticated) {
    if (!session?.access_token) throw new Error('Inicia sesión para continuar.');
    if (session.expires_at < Date.now() / 1000 + 60) {
      try { const result = await request('/auth/v1/token?grant_type=refresh_token', { body: { refresh_token: session.refresh_token } }); saveSession({ ...result, expires_at: Date.now() / 1000 + result.expires_in }); }
      catch (error) { saveSession(null); throw error; }
    }
    token = session.access_token;
  }
  return request('/rest/v1/rpc/' + name, { body: args, token });
}
export async function signIn(email, password) {
  const result = await request('/auth/v1/token?grant_type=password', { body: { email, password } });
  saveSession({ ...result, expires_at: Date.now() / 1000 + result.expires_in });
}
export async function signOut() {
  try { if (session?.access_token) await request('/auth/v1/logout', { token: session.access_token }); }
  finally { saveSession(null); }
}

/** Operaciones editoriales autenticadas; reutilizan el refresco de sesión de rpc(). */
export async function adminRest(method, path, body) {
  if (!session?.access_token) throw new Error('Inicia sesión para continuar.');
  if (session.expires_at < Date.now()/1000 + 60) {
    const result=await request('/auth/v1/token?grant_type=refresh_token',{body:{refresh_token:session.refresh_token}});
    saveSession({...result,expires_at:Date.now()/1000+result.expires_in});
  }
  return request('/rest/v1/'+path,{method,body,token:session.access_token});
}
