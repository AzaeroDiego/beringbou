import { config } from '../config.js';
import { rpc } from './api.js';
import { limaDate, newId, nextSaturday } from './core.js';
import qrcode from './vendor/qrcode-generator-2.0.4.mjs';

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

function drawQr(payload, date) {
  const qr = qrcode(0, 'M');
  qr.addData(payload);
  qr.make();
  const canvas = $('code');
  const modules = qr.getModuleCount();
  const cell = 10;
  const border = 4;
  const size = (modules + 2 * border) * cell;
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  context.fillStyle = '#fff';
  context.fillRect(0, 0, size, size);
  context.fillStyle = '#000';
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (qr.isDark(row, col)) context.fillRect((col + border) * cell, (row + border) * cell, cell, cell);
    }
  }
  $('download').href = canvas.toDataURL('image/png');
  $('download').download = 'BeringBou-QR-' + date + '.png';
}

$('demo-note').hidden = !config.demo;
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
  const details = { p_name: name, p_birth_date: birth, p_phone: fields.get('phone'), p_expected_date: date, p_consent: fields.has('privacy') };
  const fingerprint = JSON.stringify(details);
  if (pending?.fingerprint !== fingerprint) pending = { fingerprint, id: newId() };
  $('submit').disabled = true;
  status.textContent = 'Generando tu QR…';
  try {
    const result = config.demo
      ? { code: 'BB-DEMO:' + pending.id, event_date: date }
      : await rpc('bering_create_guest_qr', { ...details, p_request_id: pending.id });
    drawQr(result.code, result.event_date);
    $('result-date').textContent = format(result.event_date);
    $('result').hidden = false;
    form.hidden = true;
    form.reset();
    status.textContent = '';
    $('result-title').focus();
  } catch (error) {
    showDate(nextSaturday());
    status.textContent = error.message;
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
  $('birth').max = limaDate();
  showDate(nextSaturday());
  $('name').focus();
});
