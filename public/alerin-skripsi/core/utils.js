'use strict';
/* Utilitas kecil: pemilih elemen, teks, dan tanggal. */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const e = value =>
  String(value ?? '').replace(
    /[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const clone = value => JSON.parse(JSON.stringify(value));
const uid = () =>
  crypto.randomUUID
    ? crypto.randomUUID()
    : 'local-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 11);
function dateLong(date) {
  if (!date) return 'Belum ditentukan';
  return new Date(date + 'T12:00:00').toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
}
function localTime(date) {
  return new Date(date).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });
}
function daysLeft(date) {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return Math.ceil((new Date(date + 'T00:00:00+07:00') - new Date(today + 'T00:00:00+07:00')) / 86400000);
}
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast('Teks berhasil disalin.');
    return true;
  } catch {
    modal(
      'Salin teks ini',
      field('copy-fallback', 'Pilih dan salin secara manual', text, '', 0),
      B('Tutup', 'close-modal'),
    );
    $('#copy-fallback')?.select();
    return false;
  }
}
const norm = v =>
  String(v || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
const hashKey = v => {
  let h = 2166136261;
  for (const c of String(v)) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
};
function isoToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}
function addDaysIso(n, from) {
  const d = new Date((from || isoToday()) + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
const capitalize = v => {
  const t = String(v || '').trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : '';
};
const trimDot = v =>
  String(v || '')
    .trim()
    .replace(/[.\s]+$/, '');
const joinList = (arr, sep, last) => (arr.length <= 1 ? arr.join('') : arr.slice(0, -1).join(sep) + last + arr.at(-1));
/* Ukuran berkas dalam satuan yang mudah dibaca. */
function fileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
  return (bytes / 1048576).toFixed(1).replace('.', ',') + ' MB';
}
function savedStamp(iso) {
  return iso
    ? new Date(iso)
        .toLocaleString('id-ID', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Jakarta',
        })
        .replace(/\./g, '.') + ' WIB'
    : '';
}
