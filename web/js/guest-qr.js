import { config } from '../config.js';
import { rpc } from './api.js';
import { limaDate, newId, nextSaturday } from './core.js';
import { drawQr } from './qr-image.js';

const $ = id => document.getElementById(id);
const form = $('guest-form');
const status = $('status');
const formatter = new Intl.DateTimeFormat('es-PE', { dateStyle: 'full', timeZone: 'UTC' });
let pending;
const format = date => formatter.format(new Date(date + 'T12:00:00Z'));

function showDate(date) {
  $('event-date').dateTime = date;
  $('event-date').textContent = format(date);
}

const receiptKey = 'bering.guest.receipt';
let receipt;
const demoRegistrations = [];
try { receipt = JSON.parse(localStorage.getItem(receiptKey)); } catch {}

function showResult(result) {
  const waiting = result.status === 'pending';
  $('download').href = drawQr($('code'), result.code);
  $('download').download = 'BeringBou-QR-' + result.event_date + '.png';
  $('result-date').textContent = format(result.event_date);
  $('qr-state').textContent = waiting ? 'Pendiente de confirmación · Aún no habilitado para ingresar.'
    : result.status === 'confirmed' ? 'Asistencia confirmada.' : 'QR activo · Este evento permite ingreso directo.';
  const message = 'Hola, quiero confirmar mi asistencia para el ' + format(result.event_date) + '. Mi referencia es ' + result.reference + '.';
  $('confirm-chat').href = 'https://wa.me/' + config.whatsapp + '?text=' + encodeURIComponent(message);
  $('confirm-chat').hidden = !waiting || config.demo;
  $('refresh-qr').hidden = !waiting || config.demo;
  $('demo-chat').hidden = !waiting || !config.demo;
  $('demo-chat').textContent = 'Vista previa de WhatsApp: ' + message;
  $('demo-confirm').hidden = !waiting || !config.demo;
  $('recover-qr').hidden = true;
  $('recover-chat').hidden = true;
  $('result').hidden = false;
  form.hidden = true;
  status.textContent = '';
  $('result-title').focus();
}

async function recover() {
  try {
    if (!receipt) return;
    const result = config.demo ? demoRegistrations.find(entry => entry.id === receipt.id)?.result
      : await rpc('bering_recover_guest_qr', { p_receipt: receipt.id });
    if (result) showResult(result);
  } catch (error) {
    status.textContent = error.message;
  }
}

$('recover-qr').hidden = !receipt || config.demo;
$('recover-qr').addEventListener('click', recover);
$('refresh-qr').addEventListener('click', recover);
$('demo-confirm').addEventListener('click', () => {
  const entry = demoRegistrations.find(entry => entry.id === receipt?.id);
  if (config.demo && entry) {
    entry.result.status = 'confirmed';
    showResult(entry.result);
  }
});

$('demo-note').hidden = !config.demo;
$('recover-chat').href = 'https://wa.me/' + config.whatsapp + '?text=' + encodeURIComponent('Hola, quiero recuperar mi QR de invitado para el sábado.');

$('birth').max = limaDate();
showDate(nextSaturday());
$('submit').disabled = false;

form.addEventListener('submit', async event => {
  event.preventDefault();
  const fields = new FormData(form);
  const name = fields.get('name').trim();
  if (!name) {
    status.textContent = 'Escribe tus nombres y apellidos.';
    return;
  }
  const date = nextSaturday();
  if ($('event-date').dateTime !== date) {
    showDate(date);
    status.textContent = 'Cambió el sábado de registro. Revisa la fecha y vuelve a pulsar Generar mi QR.';
    return;
  }
  const birth = fields.get('birth');
  const today = limaDate();
  const [year, month, day] = today.split('-');
  if (birth > [String(Number(year) - 18), month, day].join('-')) {
    status.textContent = 'Debes tener al menos 18 años para generar el QR.';
    return;
  }
  const details = { p_name: name, p_birth_date: birth, p_phone: fields.get('phone'), p_dni: fields.get('dni'), p_expected_date: date, p_consent: fields.has('privacy') };
  const fingerprint = JSON.stringify(details);
  if (pending?.fingerprint !== fingerprint) pending = { fingerprint, id: newId() };
  $('submit').disabled = true;
  status.textContent = 'Generando tu QR…';
  try {
    let result;
    if (config.demo) {
      const existing = demoRegistrations.find(entry => entry.result.event_date === date &&
        (entry.dni === details.p_dni || entry.phone === details.p_phone));
      if (existing) {
        pending.id = existing.id;
        result = existing.result;
      } else {
        result = { code: 'BB-DEMO:' + pending.id, event_date: date, reference: 'BB-DEMO', status: 'pending' };
        demoRegistrations.push({ id: pending.id, dni: details.p_dni, phone: details.p_phone, result });
      }
    } else {
      result = await rpc('bering_register_guest_qr', { ...details, p_request_id: pending.id });
    }
    receipt = { id: pending.id, date: result.event_date };
    if (!config.demo) try { localStorage.setItem(receiptKey, JSON.stringify(receipt)); } catch {}
    showResult(result);
    form.reset();
  } catch (error) {
    showDate(nextSaturday());
    status.textContent = error.message;
    if (error.code === 'guest_duplicate') {
      if (receipt?.date === date) await recover();
      else $('recover-chat').hidden = false;
    }
  } finally {
    $('submit').disabled = false;
  }
});

$('reset').addEventListener('click', () => {
  pending = undefined;
  $('result').hidden = true;
  $('download').removeAttribute('href');
  $('code').width = 0;
  form.hidden = false;
  $('recover-qr').hidden = !receipt;
  $('birth').max = limaDate();
  showDate(nextSaturday());
  $('name').focus();
});
