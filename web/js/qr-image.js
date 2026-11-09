import qrcode from './vendor/qrcode-generator-2.0.4.mjs';

export function drawQr(canvas, payload) {
  const qr = qrcode(0, 'M');
  qr.addData(payload);
  qr.make();
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
  return canvas.toDataURL('image/png');
}
