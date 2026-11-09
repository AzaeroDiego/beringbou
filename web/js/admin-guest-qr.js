import { rpc } from './api.js';
import { nextSaturday } from './core.js';
import { drawQr } from './qr-image.js';

const $ = id => document.getElementById(id);
const form = $('qr-admin-form');
const rows = $('qr-guests');
const status = $('qr-admin-status');
const labels = { pending: 'Pendiente', confirmed: 'Confirmado', active: 'Ingreso directo' };
let guests = [];
let loadedDate;
let busy = false;
$('qr-admin-date').value = nextSaturday();

function render() {
  const query = $('qr-admin-search').value.trim().toLowerCase();
  rows.replaceChildren();
  for (const guest of guests) {
    if (query && ![guest.reference, guest.name, guest.phone].some(value => value.toLowerCase().includes(query))) continue;
    const tr = document.createElement('tr');
    for (const value of [guest.reference, guest.name, guest.phone, labels[guest.status]]) {
      const cell = document.createElement('td');
      cell.textContent = value;
      tr.append(cell);
    }
    const actions = document.createElement('td');
    actions.className = 'table-actions';
    if (guest.status === 'pending') {
      const confirm = document.createElement('button');
      confirm.type = 'button';
      confirm.textContent = 'Confirmar asistencia';
      confirm.onclick = () => loadGuestQrs({ confirm: guest.id, date: loadedDate });
      actions.append(confirm);
    }
    const download = document.createElement('button');
    download.type = 'button';
    download.textContent = 'Descargar QR';
    download.onclick = () => {
      const link = document.createElement('a');
      link.href = drawQr(document.createElement('canvas'), guest.code);
      link.download = 'BeringBou-' + guest.reference + '.png';
      link.click();
    };
    actions.append(download);
    tr.append(actions);
    rows.append(tr);
  }
}

export async function loadGuestQrs({ required = null, confirm = null, date = $('qr-admin-date').value } = {}) {
  if (busy || !date) return;
  busy = true;
  $('qr-admin-controls').disabled = true;
  status.textContent = 'Consultando lista de invitados…';
  try {
    const data = await rpc('bering_admin_guest_qrs', { p_date: date, p_required: required, p_confirm: confirm }, true);
    loadedDate = date;
    guests = data.guests;
    $('qr-required').checked = data.required;
    render();
    const pending = guests.filter(guest => guest.status === 'pending').length;
    status.textContent = (confirm ? 'Asistencia confirmada. ' : '') + guests.length + ' registrados · ' + pending + ' pendientes.';
  } catch (error) {
    guests = [];
    loadedDate = undefined;
    render();
    status.textContent = error.message;
  } finally {
    busy = false;
    $('qr-admin-controls').disabled = false;
    $('qr-save-mode').disabled = !loadedDate;
  }
}

export function clearGuestQrs() {
  guests = [];
  loadedDate = undefined;
  $('qr-admin-search').value = '';
  $('qr-save-mode').disabled = true;
  rows.replaceChildren();
  status.textContent = '';
}

form.addEventListener('submit', event => { event.preventDefault(); loadGuestQrs(); });
$('qr-admin-date').addEventListener('change', clearGuestQrs);
$('qr-admin-search').addEventListener('input', render);
$('qr-save-mode').addEventListener('click', () => {
  if (loadedDate) loadGuestQrs({ required: $('qr-required').checked, date: loadedDate });
});
