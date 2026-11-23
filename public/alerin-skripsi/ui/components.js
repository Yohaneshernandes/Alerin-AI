'use strict';
/* Komponen antarmuka: tombol, kolom, modal, toast, badge, dan pesan galat. */
const B = (text, action, cls = '', icon = '', extra = '') =>
  `<button type="button" class="btn ${cls}" data-action="${e(action)}" ${extra}>${icon ? I(icon) : ''}${text}</button>`;
const badge = (text, cls = '') => `<span class="pill ${cls}">${e(text)}</span>`;
const note = (text, cls = '') =>
  `<div class="note ${cls}">${I(cls === 'amber' ? 'warning' : 'info')}<span>${text}</span></div>`;
function selectField(id, label, options, value, bind = '') {
  return `<div class="field"><label for="${e(id)}">${e(label)}</label><select id="${e(id)}" ${bind ? `data-bind="${e(bind)}"` : ''}>${options
    .map((o, i) => {
      const v = Array.isArray(o) ? o[0] : o,
        n = Array.isArray(o) ? o[1] : o;
      return `<option value="${e(v)}" ${String(v) === String(value) ? 'selected' : ''}>${e(n)}</option>`;
    })
    .join('')}</select></div>`;
}
function outputRows(rows, short = true) {
  return rows
    .map(
      ([h, p]) =>
        `<div class="component"><h4>${e(h)}</h4><p>${e(short && p.length > 300 ? p.slice(0, 297) + '…' : p)}</p></div>`,
    )
    .join('');
}
function modal(title, body, footer = '', wide = false, drawer = false) {
  lastFocus = document.activeElement;
  modalDirty = false;
  $('#overlay-root').innerHTML =
    `<div class="overlay ${drawer ? 'drawer-overlay' : ''}" data-overlay="true"><section class="modal ${wide ? (wide === true ? 'wide' : wide) : ''} ${drawer ? 'drawer' : ''}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="modal-head"><h2 id="modal-title">${title}</h2><button class="icon-btn" data-action="close-modal" aria-label="Tutup jendela">${I('close')}</button></header><div class="modal-body">${body}</div>${footer ? `<footer class="modal-footer">${footer}</footer>` : ''}</section></div>`;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    const first = drawer
      ? $('#overlay-root .modal-head button')
      : $('#overlay-root input:not([type=file]),#overlay-root textarea,#overlay-root select') ||
        $('#overlay-root button');
    first?.focus({ preventScroll: true });
  });
}
function closeModal(force = false) {
  if (modalDirty && !force) {
    suspendedOverlay = $('#overlay-root').firstElementChild;
    suspendedOverlay?.remove();
    modal(
      'Tutup tanpa menyimpan?',
      '<p>Perubahan dalam jendela ini belum disimpan. Kamu bisa kembali mengedit atau menutupnya.</p>',
      B('Kembali mengedit', 'resume-modal', 'primary') + B('Tutup tanpa menyimpan', 'discard-modal', 'danger'),
    );
    return;
  }
  $('#overlay-root').innerHTML = '';
  document.body.style.overflow = '';
  modalDirty = false;
  modalBusy = false;
  lastFocus?.focus?.();
}
async function processing(title, action) {
  if (modalBusy) return;
  modalBusy = true;
  modal(
    'Menyiapkan pratinjau',
    `<div class="process-state"><img src="assets/alerin.svg" alt=""><h3>${e(title)}</h3><p>Menata informasi yang tersedia di perangkatmu.</p><div class="process-progress"><i></i></div><p class="process-note">Pratinjau lokal. Tidak menjalankan analisis AI.</p></div>`,
  );
  await new Promise(r => setTimeout(r, 450));
  try {
    await action();
  } catch (error) {
    closeModal(true);
    throw error;
  } finally {
    modalBusy = false;
  }
}
const OUTPUT_MAX = 1500;
function boundedRows(rows, max = OUTPUT_MAX) {
  const clean = rows.filter(x => x && x[0]).map(([h, p]) => [String(h), String(p || 'Belum diisi.')]);
  let budget = Math.max(0, max - clean.reduce((n, [h]) => n + h.length + 2, 0));
  const out = clean.map(([h, p]) => [h, '']);
  const remaining = new Set(clean.map((_, i) => i));
  while (remaining.size && budget > 0) {
    const share = Math.floor(budget / remaining.size);
    let shortened = false;
    for (const i of [...remaining])
      if (clean[i][1].length <= share) {
        out[i][1] = clean[i][1];
        budget -= clean[i][1].length;
        remaining.delete(i);
        shortened = true;
      }
    if (!shortened) {
      for (const i of remaining) {
        const n = Math.floor(budget / remaining.size);
        out[i][1] = n > 1 ? clean[i][1].slice(0, n - 1).trimEnd() + '…' : '';
        budget -= out[i][1].length;
        remaining.delete(i);
      }
      break;
    }
  }
  return out;
}
function rowText(rows) {
  return rows.map(x => x.join('\n')).join('\n');
}
function parseAlerinToast(rawMsg) {
  if (typeof rawMsg === 'object' && rawMsg !== null) {
    return {
      title: rawMsg.title || 'Pemberitahuan',
      description: rawMsg.description
        ? rawMsg.description.endsWith('.') || rawMsg.description.endsWith('!')
          ? rawMsg.description
          : `${rawMsg.description}.`
        : '',
    };
  }
  const raw = String(rawMsg || '').trim();
  const lower = raw.toLowerCase();
  const cleanDesc = raw.endsWith('.') || raw.endsWith('!') ? raw : `${raw}.`;

  if (lower.includes('siap dikerjakan') || lower.includes('arahan'))
    return { title: 'Pemberitahuan', description: cleanDesc };
  if (lower.includes('paket dipilih') || lower.includes('paket'))
    return { title: 'Paket Berhasil Dipilih', description: cleanDesc };
  if (lower.includes('voucher') && lower.includes('berhasil'))
    return { title: 'Voucher Diterapkan', description: cleanDesc };
  if (lower.includes('lapor'))
    return { title: 'Laporan Respon Diterima', description: cleanDesc };
  if (lower.includes('disalin') || lower.includes('salin'))
    return { title: 'Berhasil Disalin', description: cleanDesc };
  if (lower.includes('dihapus') || lower.includes('hapus'))
    return { title: 'Berhasil Dihapus', description: cleanDesc };
  if (lower.includes('disimpan') || lower.includes('simpan') || lower.includes('tersimpan'))
    return { title: 'Berhasil Disimpan', description: cleanDesc };
  if (lower.includes('dibuat') || lower.includes('buat'))
    return { title: 'Berhasil Dibuat', description: cleanDesc };
  if (lower.includes('ditambahkan') || lower.includes('tambah'))
    return { title: 'Berhasil Ditambahkan', description: cleanDesc };
  if (lower.includes('tersinkron'))
    return { title: 'Berhasil Disinkronkan', description: cleanDesc };
  if (lower.includes('berhasil'))
    return { title: 'Berhasil', description: cleanDesc };
  if (lower.includes('gagal') || lower.includes('belum') || lower.includes('tidak'))
    return { title: 'Perhatian', description: cleanDesc };
  return { title: 'Pemberitahuan', description: cleanDesc };
}

function toast(msg, type = '', ms = 4800) {
  clearTimeout(toastTimer);
  const parsed = parseAlerinToast(msg);
  let title = parsed.title;
  const description = parsed.description;
  const isErr = type === 'error';
  const isWarn = type === 'warn' || type === 'warning';
  if (isErr && title === 'Pemberitahuan') title = 'Perhatian';

  const iconSvg = isErr
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
    : isWarn
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

  const iconClass = isErr ? 'error' : isWarn ? 'warn' : '';

  $('#toast-root').innerHTML = `
    <div class="toast ${type}" role="status" aria-live="polite">
      <div class="alerin-toast-main">
        <div class="alerin-toast-icon ${iconClass}">
          ${iconSvg}
        </div>
        <div class="alerin-toast-content">
          <h4 class="alerin-toast-title">${e(title)}</h4>
          ${description ? `<p class="alerin-toast-desc">${e(description)}</p>` : ''}
        </div>
      </div>
      <button type="button" class="alerin-toast-close" data-action="close-toast" aria-label="Tutup notifikasi">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `;

  toastTimer = setTimeout(() => {
    const t = $('#toast-root .toast');
    if (t) {
      t.classList.add('toast-out');
      setTimeout(() => {
        if ($('#toast-root .toast.toast-out')) $('#toast-root').innerHTML = '';
      }, 200);
    } else {
      $('#toast-root').innerHTML = '';
    }
  }, ms);
}
function fieldError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return false;
  const wrap = el.closest('.field') || el.parentElement;
  wrap?.classList.add('invalid');
  el.setAttribute('aria-invalid', 'true');
  let m = wrap?.querySelector('.field-error');
  if (!m) {
    m = document.createElement('p');
    m.className = 'field-error';
    m.id = id + '-err';
    (wrap || el).appendChild(m);
  }
  m.textContent = msg;
  el.setAttribute('aria-describedby', m.id);
  return false;
}
function clearErrors(scope = document) {
  scope.querySelectorAll('.field.invalid').forEach(f => f.classList.remove('invalid'));
  scope.querySelectorAll('.field-error').forEach(x => x.remove());
  scope.querySelectorAll('[aria-invalid]').forEach(x => x.removeAttribute('aria-invalid'));
}
function focusFirstError() {
  const el = document.querySelector('.field.invalid input,.field.invalid textarea,.field.invalid select');
  el?.focus({ preventScroll: false });
  el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
function checkRequired(id, { min = 0, asal = true, label = '' } = {}) {
  const el = document.getElementById(id);
  if (!el) return true;
  const v = el.value.trim();
  if (!v) return fieldError(id, 'Kolom ini perlu diisi dulu.');
  if (asal && isAsal(v)) return fieldError(id, 'Isiannya belum bisa Alerin pahami. Coba tulis dengan kalimat biasa.');
  if (min && v.length < min)
    return fieldError(id, `Tuliskan minimal ${min} karakter${label ? ' untuk ' + label : ''}.`);
  return true;
}
/* Batas atas kolom tanggal, supaya tahun di pemilih tanggal hanya 4 angka. */
const DATE_MAX = '9999-12-31';
/* Masalah pada nilai tanggal (YYYY-MM-DD). Kosong kalau tanggalnya wajar. */
function dateProblem(v, { future = false } = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || isNaN(new Date(v + 'T12:00:00Z')))
    return 'Tulis tanggal lengkap dengan tahun 4 angka, misalnya 20/12/2026.';
  const year = +v.slice(0, 4),
    now = +isoToday().slice(0, 4);
  if (year < 2000) return 'Tahunnya terlalu lampau. Periksa lagi, ya.';
  if (year > now + 8) return 'Tahunnya terlalu jauh. Periksa lagi, ya.';
  if (future && v < isoToday()) return 'Tanggal ini sudah lewat. Periksa lagi, ya.';
  return '';
}
/* Periksa kolom tanggal: belum lengkap, tahun bukan 4 angka, terlalu jauh, atau (bila diminta) sudah lewat. */
function checkDate(id, { required = false, future = true } = {}) {
  const el = document.getElementById(id);
  if (!el) return true;
  const v = el.value;
  if (!v) {
    if (el.validity?.badInput) return fieldError(id, 'Tanggalnya belum lengkap. Isi tanggal, bulan, dan tahun 4 angka.');
    return required ? fieldError(id, 'Kolom ini perlu diisi dulu.') : true;
  }
  const p = dateProblem(v, { future });
  return p ? fieldError(id, p) : true;
}
const checkFutureDate = (id, opt = {}) => checkDate(id, { ...opt, future: true });
function field(id, label, value, placeholder = '', max = 0, type = 'textarea', bind = '', optional = true) {
  const attrs = `id="${e(id)}" name="${e(id)}" ${optional ? '' : 'data-required="true" aria-required="true"'} ${max ? `maxlength="${max}"` : ''} ${bind ? `data-bind="${e(bind)}"` : ''}`;
  const input =
    type === 'textarea'
      ? `<textarea ${attrs} placeholder="${e(placeholder)}" rows="3">${e(value)}</textarea>`
      : `<input ${attrs} type="${e(type)}" value="${e(value)}" placeholder="${e(placeholder)}">`;
  return `<div class="field"><label for="${e(id)}">${e(label)}${optional ? ' <span>Opsional</span>' : ' <span class="required-label">Wajib</span>'}</label>${input}${max ? `<div class="field-meta"><span>${optional ? 'Boleh dilengkapi kemudian.' : ''}</span><span data-count="${e(id)}">${String(value || '').length}/${max}</span></div>` : ''}</div>`;
}
/* Label kolom: penanda Wajib/Opsional seperti site GPT. */
const REQ = ' <span class="required-label">Wajib</span>',
  OPT = ' <span>Opsional</span>';
function pageHead(title, desc, action = '', label = '', ico = 'plus', eyebrow = '', cls = 'primary') {
  return `<div class="page-head"><div class="eyebrow">${eyebrow}</div><div class="between"><div><h1>${title}</h1><p>${desc}</p></div>${action ? B(label, action, cls, ico) : ''}</div></div>`;
}
function pageEmpty(title, desc, action, label, ico = 'document') {
  return `<div class="card empty">${I(ico)}<h3>${title}</h3><p>${desc}</p>${action ? B(label, action, 'primary', 'arrow') : ''}</div>`;
}
function uploadZone(context, label = 'Tambahkan dokumen', formats = '', size = limit().mb) {
  const ok = uploadAllowed(context),
    fm =
      formats ||
      ok
        .filter(x => x !== 'jpeg')
        .map(x => x.toUpperCase())
        .join(', ');
  return `<label class="upload-zone" for="upload-${e(context)}">${I('upload')}<strong>${e(label)}</strong><small>${e(fm)} · maksimal ${size} MB per berkas</small><small>Klik untuk memilih atau letakkan berkas di sini.</small><input class="native-input" id="upload-${e(context)}" type="file" data-file-context="${e(context)}" accept="${ok.map(x => '.' + x).join(',')}" multiple></label>`;
}
function fileList(context) {
  const list = S.files.filter(f => f.context === context);
  return `<div class="file-list" data-file-list="${e(context)}">${list.map(f => `<div class="file-row">${I('file')}<div class="file-copy"><strong>${e(f.name)}</strong><small>${fileSize(f.size)} · ${e(localTime(f.time))} · Tersimpan, belum dianalisis</small></div>${B('Buka', 'open-file:' + f.id, 'small')}<button class="icon-btn" data-action="file-del:${f.id}" aria-label="Hapus ${e(f.name)}">${I('close')}</button></div>`).join('')}</div>`;
}
