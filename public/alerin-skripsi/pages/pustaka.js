'use strict';
/* Halaman pustaka. */
let openFolderMenuId = null;

function folderPopoverHtml(it) {
  const currentFolder = it.folder || '';
  const folders = S.biblio?.folders || ['Bab I', 'Bab II', 'Bab III', 'Bab IV'];
  const folderSvg = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>';
  const plusSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#125AB5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';

  let html = '<div class="pustaka-folder-popover" role="menu">';
  
  // 1. Belum masuk folder
  const isNoneActive = !currentFolder;
  html += `<button type="button" class="pustaka-folder-item ${isNoneActive ? 'active' : ''}" data-action="dp-folder-select:${it.id}:" role="menuitem">
    ${folderSvg}
    <span>Belum masuk folder</span>
  </button>`;

  // 2. Folder list
  folders.forEach(fd => {
    const isActive = currentFolder === fd;
    html += `<button type="button" class="pustaka-folder-item ${isActive ? 'active' : ''}" data-action="dp-folder-select:${it.id}:${e(fd)}" role="menuitem">
      ${folderSvg}
      <span>${e(fd)}</span>
    </button>`;
  });

  // 3. Divider
  html += '<div class="pustaka-folder-divider"></div>';

  // 4. Buat Folder Baru
  html += `<button type="button" class="pustaka-folder-new-btn" data-action="dp-folder-new-modal:${it.id}" role="menuitem">
    ${plusSvg}
    <span>Buat Folder Baru</span>
  </button>`;

  html += '</div>';
  return html;
}

document.addEventListener('click', ev => {
  const dd = document.querySelector('.pustaka-custom-dropdown.open');
  if (dd && !ev.target.closest('.pustaka-custom-dropdown')) {
    dd.classList.remove('open');
    const trigger = dd.querySelector('.pustaka-dropdown-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }
  if (openFolderMenuId && !ev.target.closest('.pustaka-item-folder-wrapper')) {
    openFolderMenuId = null;
    const pop = document.querySelector('.pustaka-folder-popover');
    if (pop) pop.remove();
    document.querySelectorAll('.pustaka-item-btn-folder.open').forEach(b => {
      b.classList.remove('open');
      b.setAttribute('aria-expanded', 'false');
    });
  }
});
function previewHtml() {
  const p = previewSource();
  if (!p) return '<span class="pustaka-preview-placeholder">Lengkapi identitas sumber untuk melihat pratinjau.</span>';
  const notes = [p.label];
  if (['IEEE', 'Vancouver'].includes(S.biblio.style) && p.src.type === 'Jurnal')
    notes.push('Singkatan nama jurnal dibuat dari daftar kata umum. Cocokkan dengan singkatan resmi jurnalnya.');
  return `<div class="pustaka-preview-text">${formatCitation(p.src, S.biblio.style, p.no).html}</div>${notes
    .filter(Boolean)
    .map(n => `<p class="small muted mt prev-note">${e(n)}</p>`)
    .join('')}`;
}
function syncReport() {
  const n = S.biblio.naskah;
  if (!n) return null;
  const rows = n.citations.map(c => ({
    c,
    item: S.biblio.items.find(it => firstSurname(it.authors) === c.surname && String(it.year) === String(c.year)),
  }));
  const used = new Set(rows.filter(r => r.item).map(r => r.item.id));
  return {
    rows,
    matched: rows.filter(r => r.item).length,
    total: rows.length,
    unused: S.biblio.items.filter(it => !used.has(it.id)),
  };
}
/* Metadata terverifikasi untuk satu kutipan naskah, kalau ada di katalog contoh. */
function catalogFor(c) {
  const k = knownSources();
  return (c.suggest && k.find(x => x.key === c.suggest)) || k.find(x => firstSurname(x.authors) === c.surname && String(x.year) === String(c.year)) || null;
}
function dpListHtml() {
  const b = S.biblio,
    q = norm(b.query || '');
  const match = it => !q || norm(`${it.title} ${it.authors} ${it.container} ${it.year} ${it.doi} ${it.folder}`).includes(q);
  let items = b.items.filter(match);
  if (b.folder === '__none') items = items.filter(it => !it.folder);
  else if (b.folder) items = items.filter(it => (it.folder || '') === b.folder);
  if (b.tab === 'folder' && !b.folder && !q) {
    const groups = ['', ...b.folders];
    return `
      <div class="pustaka-folders-grid pustaka-folder-grid" data-folder-grid>
        ${groups
          .map(fd => {
            const n = b.items.filter(it => (it.folder || '') === fd).length;
            const title = fd || 'Belum masuk folder';
            return `
              <button type="button" class="pustaka-folder-card" data-action="dp-folder:${e(fd || '__none')}" aria-label="Buka folder ${e(title)} (${n} sumber)">
                <div class="pustaka-folder-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#125AB5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <div class="pustaka-folder-info">
                  <span class="pustaka-folder-title">${e(title)}</span>
                  <span class="pustaka-folder-count">${n} sumber</span>
                </div>
              </button>
            `;
          })
          .join('')}
        <button type="button" class="pustaka-folder-card pustaka-folder-card-new" data-action="dp-new-folder" aria-label="Buat Folder">
          <div class="pustaka-folder-icon-box new">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          <div class="pustaka-folder-info">
            <span class="pustaka-folder-title">Buat Folder</span>
            <span class="pustaka-folder-count">Kelompokkan per bab</span>
          </div>
        </button>
      </div>
    `;
  }
  const head = b.folder
    ? `
      <div class="pustaka-folder-detail-head">
        <button type="button" class="pustaka-folder-back-btn" data-action="dp-folder:" aria-label="Kembali ke semua folder">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          <span>Kembali ke Folder</span>
        </button>
        <div class="pustaka-folder-detail-meta">
          <h3>${e(b.folder === '__none' ? 'Belum masuk folder' : b.folder)}</h3>
          <span class="pustaka-folder-detail-count">${items.length} sumber</span>
        </div>
      </div>
    `
    : '';
  const found = q
    ? `<p class="dp-found small muted mt" style="margin-bottom:12px;">${items.length ? `${items.length} sumber cocok dengan “${e(b.query.trim())}”.` : ''} <button class="inline-link" data-action="dp-search-clear">Hapus pencarian</button></p>`
    : '';
  return (
    head +
    found +
    (items.length
      ? `<div class="pustaka-saved-list">${items
          .map(
            it =>
              `<div class="pustaka-item-row">
                <div class="pustaka-item-left">
                  <div class="pustaka-item-icon-box">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div class="pustaka-item-meta">
                    <h3 class="pustaka-item-title" data-action="dp-detail:${it.id}" role="button" tabindex="0">${e(it.title)}</h3>
                    <div class="pustaka-item-authors">${e(it.authors || 'Penulis belum diisi')}</div>
                  </div>
                </div>
                <div class="pustaka-item-right">
                  <div class="pustaka-item-type-badge">${e(['Buku', 'Bab Buku'].includes(it.type) ? 'Buku' : it.type || 'Jurnal')}</div>
                  <div class="pustaka-item-folder-wrapper">
                    <button type="button" class="pustaka-item-btn-folder ${openFolderMenuId === it.id ? 'open' : ''}" data-action="dp-folder-toggle:${it.id}" aria-haspopup="true" aria-expanded="${openFolderMenuId === it.id ? 'true' : 'false'}">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#125AB5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span>${e(it.folder || 'Pilih Folder')}</span>
                    </button>
                    ${openFolderMenuId === it.id ? folderPopoverHtml(it) : ''}
                  </div>
                  <div class="pustaka-item-actions">
                    <button type="button" class="pustaka-item-action-btn edit" data-action="dp-edit:${it.id}">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button type="button" class="pustaka-item-action-btn delete" data-action="dp-delete:${it.id}">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>`,
          )
          .join('')}</div>`
      : `<p class="pustaka-empty-msg">${q ? 'Tidak ada sumber yang cocok. Coba kata lain, misalnya nama penulis atau tahun.' : b.folder ? 'Folder ini belum berisi sumber.' : 'Belum ada sumber pada daftar ini. Isi Input Sumber lalu simpan ke daftar.'}</p>`)
  );
}
async function readNaskah(file) {
  if (file.size > limit().mb * 1048576) {
    toast(`Ukuran naskah melebihi batas ${limit().mb} MB untuk paket ${S.plan}.`, 'error');
    return;
  }
  modal(
    'Membaca naskah',
    '<div class="process-state"><h3>Mencari kutipan dalam naskah</h3><p>Dokumen diproses di perangkat ini.</p></div>',
  );
  modalBusy = true;
  try {
    const { text } = await extractDocument(file);
    const citations = extractCitations(text);
    modalBusy = false;
    closeModal(true);
    if (!citations.length) {
      modal(
        'Kutipan belum ditemukan',
        '<p>Ups! Alerin belum menemukan kutipan berformat penulis–tahun pada naskah ini. PDF hasil pindai memerlukan teks yang dapat disalin. Coba tempel bagian naskahnya.</p>',
        B('Tutup', 'close-modal') + B('Tempel teks naskah', 'dp-naskah-paste', 'primary', 'edit'),
      );
      return;
    }
    S.biblio.naskah = { source: file.name, citations, time: new Date().toISOString(), sample: false };
    record('Naskah disinkronkan', `${file.name} · ${citations.length} kutipan`);
    persist();
    render();
    const r = syncReport();
    toast(`${r.matched}/${r.total} kutipan sudah tercatat di Daftar Pustaka.`);
  } catch (error) {
    modalBusy = false;
    closeModal(true);
    modal(
      'Naskah belum dapat dibaca',
      `<p>${e(error.message || 'Teks dokumen belum dapat diproses.')} Coba kamu proses ulang, ya!</p>`,
      B('Tutup', 'close-modal') + B('Tempel teks naskah', 'dp-naskah-paste', 'primary', 'edit'),
    );
  }
}
/* Tahun terbit: 4 angka, tidak melebihi tahun berjalan. */
function yearProblem(v) {
  const y = String(v || '').trim(),
    now = +isoToday().slice(0, 4);
  if (!/^\d{4}$/.test(y)) return 'Tulis tahun terbit dengan 4 angka, misalnya 2017.';
  if (+y > now) return `Tahun terbit tidak boleh melebihi ${now}.`;
  if (+y < 1500) return 'Tahun terbit terlalu lampau. Periksa lagi, ya.';
  return '';
}
/* Periksa form sumber. Pesan galat muncul di bawah kolom yang bermasalah. */
function dpValidate(f) {
  clearErrors();
  let ok = true;
  for (const k of ['title', 'authors', 'year', 'container'])
    if (!String(f[k] || '').trim()) ok = fieldError('dp-' + k, 'Kolom ini perlu diisi dulu.');
  if (String(f.year || '').trim() && yearProblem(f.year)) ok = fieldError('dp-year', yearProblem(f.year));
  if (String(f.title || '').trim() && isAsalShort(f.title))
    ok = fieldError('dp-title', 'Isiannya belum bisa Alerin pahami. Tulis judul sumber yang sebenarnya.');
  if (String(f.authors || '').trim() && !parseAuthors(f.authors).length) ok = fieldError('dp-authors', 'Tulis nama penulis.');
  if (f.type === 'Situs Web' && f.url && !/^https?:\/\/\S+\.\S+/.test(f.url.trim()))
    ok = fieldError('dp-url', 'Tulis alamat lengkap yang diawali https://');
  if (!ok) focusFirstError();
  return ok;
}
function pustakaPage() {
  const b = S.biblio,
    f = b.form,
    typeOpts = ['Jurnal', 'Buku', 'Bab Buku', 'Prosiding', 'Skripsi/Tesis', 'Situs Web'];
  const containerLabel =
    f.type === 'Jurnal'
      ? 'Nama Jurnal/Buku/Penerbit'
      : f.type === 'Situs Web'
        ? 'Nama Situs'
        : f.type === 'Prosiding'
          ? 'Nama Prosiding'
          : 'Penerbit';
  const journal = f.type === 'Jurnal',
    web = f.type === 'Situs Web',
    pagesOnly = ['Bab Buku', 'Prosiding'].includes(f.type),
    withCity = !journal && !web;

  /* Left Column: Input Sumber */
  const inputCard = `
    <section class="pustaka-card pustaka-source-card">
      <div class="pustaka-card-header between">
        <div>
          <h2>Input Sumber</h2>
          <p>Lengkapi identitas sumber pustaka untuk menambahkannya ke daftar.</p>
        </div>
        <button type="button" class="btn-cari-jurnal" data-action="dp-cari-jurnal">
          ${I('search')}
          <span>Alerin Cari Jurnal</span>
        </button>
      </div>
      ${b.editing ? `<div class="pustaka-edit-note">${note('Kamu sedang mengedit sumber tersimpan. Simpan untuk memperbarui daftar.')} <button class="inline-link" data-action="dp-reset">Batal edit</button></div>` : ''}

      <div class="field pustaka-field-row">
        <label for="dp-type">Jenis Sumber <span class="req">*</span></label>
        <div class="pustaka-custom-dropdown">
          <button type="button" class="pustaka-dropdown-trigger" data-action="dp-type-toggle" aria-haspopup="listbox" aria-expanded="false">
            <span class="pustaka-dropdown-val">${e(f.type || 'Jurnal')}</span>
            <span class="pustaka-dropdown-arrow">${I('down')}</span>
          </button>
          <input type="hidden" id="dp-type" data-dp="type" value="${e(f.type || 'Jurnal')}">
          <div class="pustaka-dropdown-menu" role="listbox" aria-label="Pilih Jenis Sumber">
            ${typeOpts.map(o => `
              <button type="button" class="pustaka-dropdown-item ${f.type === o ? 'active' : ''}" data-action="dp-type-select:${e(o)}" role="option" aria-selected="${f.type === o}">
                ${e(o)}
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="field pustaka-field-row">
        <label for="dp-title">Judul Sumber <span class="req">*</span></label>
        <div class="pustaka-input-wrap">
          <input id="dp-title" data-dp="title" data-nocap="1" type="text" value="${e(f.title ?? '')}" placeholder="Masukkan judul sumber" maxlength="300" aria-required="true" class="pustaka-input">
          <div id="dp-case">${caseHint()}</div>
        </div>
      </div>

      <div class="field pustaka-field-row">
        <label for="dp-authors">Penulis</label>
        <input id="dp-authors" data-dp="authors" data-nocap="1" type="text" value="${e(f.authors ?? '')}" placeholder="Mis. Putra, Adi; Sari, Bunga" maxlength="300" class="pustaka-input">
      </div>

      <div class="pustaka-two-fields">
        <div class="field pustaka-col-field">
          <label for="dp-year">Tahun <span class="req">*</span></label>
          <input id="dp-year" data-dp="year" data-nocap="1" type="text" value="${e(f.year ?? '')}" placeholder="2026" maxlength="4" aria-required="true" class="pustaka-input">
        </div>
        <div class="field pustaka-col-field">
          <label for="dp-container">${containerLabel} <span class="req">*</span></label>
          <input id="dp-container" data-dp="container" data-nocap="1" type="text" value="${e(f.container ?? '')}" placeholder="${journal ? 'Nama publikasi' : 'Nama penerbit'}" maxlength="300" aria-required="true" class="pustaka-input">
        </div>
      </div>

      ${journal ? `
      <div class="pustaka-three-fields">
        <div class="field pustaka-col-field">
          <label for="dp-volume">Volume <span class="opt">Opsional</span></label>
          <input id="dp-volume" data-dp="volume" data-nocap="1" type="text" value="${e(f.volume ?? '')}" maxlength="20" class="pustaka-input">
        </div>
        <div class="field pustaka-col-field">
          <label for="dp-issue">Nomor <span class="opt">Opsional</span></label>
          <input id="dp-issue" data-dp="issue" data-nocap="1" type="text" value="${e(f.issue ?? '')}" maxlength="20" class="pustaka-input">
        </div>
        <div class="field pustaka-col-field">
          <label for="dp-pages">Halaman <span class="opt">Opsional</span></label>
          <input id="dp-pages" data-dp="pages" data-nocap="1" type="text" value="${e(f.pages ?? '')}" placeholder="12–24" maxlength="30" class="pustaka-input">
        </div>
      </div>
      ` : pagesOnly ? `
      <div class="field pustaka-col-field" style="margin-top:14px;">
        <label for="dp-pages">Halaman <span class="opt">Opsional</span></label>
        <input id="dp-pages" data-dp="pages" data-nocap="1" type="text" value="${e(f.pages ?? '')}" placeholder="101–120" maxlength="30" class="pustaka-input">
      </div>
      ` : withCity ? `
      <div class="field pustaka-col-field" style="margin-top:14px;">
        <label for="dp-city">Kota terbit <span class="opt">Opsional</span></label>
        <input id="dp-city" data-dp="city" data-nocap="1" type="text" value="${e(f.city ?? '')}" placeholder="Mis. Yogyakarta" maxlength="80" class="pustaka-input">
      </div>
      ` : ''}

      ${web ? `
      <div class="field pustaka-doi-group">
        <div class="pustaka-doi-label-row">
          <label for="dp-url">Tautan Sumber</label>
          <span class="opt">Opsional</span>
        </div>
        <input id="dp-url" data-dp="url" data-nocap="1" type="url" value="${e(f.url ?? '')}" placeholder="https://…" maxlength="400" class="pustaka-input">
      </div>
      ` : `
      <div class="field pustaka-doi-group">
        <div class="pustaka-doi-label-row">
          <label for="dp-doi" class="pustaka-doi-label">DOI</label>
          <span class="opt">Opsional</span>
        </div>
        <div class="pustaka-doi-box">
          <input id="dp-doi" data-dp="doi" data-nocap="1" type="text" value="${e(f.doi ?? '')}" placeholder="10.xxxx/xxxxx" maxlength="200">
          <button type="button" class="pustaka-btn-cari-doi" data-action="dp-doi">
            ${I('search')}
            <span>Cari DOI</span>
          </button>
        </div>
      </div>
      `}
    </section>
  `;

  /* Right Stack: Format Output + Pratinjau */
  const styleCard = `
    <section class="pustaka-card pustaka-format-card">
      <div class="pustaka-card-header">
        <h2>Format Output</h2>
        <p>Pilih gaya sitasi untuk memformat daftar pustaka.</p>
      </div>
      <div class="pustaka-styles-grid" role="group" aria-label="Gaya sitasi">
        ${['APA 7', 'IEEE', 'MLA', 'Chicago', 'Harvard', 'Vancouver'].map(st => `
          <button type="button" class="pustaka-style-btn ${b.style === st ? 'active' : ''}" data-action="dp-style:${st}" aria-pressed="${b.style === st}">
            ${st}
          </button>
        `).join('')}
      </div>
    </section>
  `;

  const previewCard = `
    <section class="pustaka-card pustaka-preview-card">
      <div class="pustaka-card-header">
        <h2>Pratinjau Daftar Pustaka</h2>
        <p>Redaksi mengikuti format output yang dipilih.</p>
      </div>
      <div class="pustaka-preview-banner">
        Periksa nama penulis, tanda baca, dan kelengkapan sesuai pedoman kampus.
      </div>
      <div id="dp-preview" class="pustaka-preview-box">
        ${previewHtml()}
      </div>
      <div class="pustaka-preview-actions">
        <button type="button" class="pustaka-btn-salin" data-action="dp-copy">
          ${I('copy')}
          <span>Salin</span>
        </button>
        <button type="button" class="pustaka-btn-simpan" data-action="dp-save">
          ${I('save')}
          <span>${b.editing ? 'Perbarui Daftar' : 'Simpan ke Daftar'}</span>
        </button>
      </div>
    </section>
  `;

  /* Bottom Card: Daftar Pustaka Tersimpan */
  const listCard = `
    <section class="pustaka-card pustaka-saved-card">
      <div class="pustaka-saved-head">
        <div class="pustaka-saved-title-group">
          <h2>Daftar Pustaka Tersimpan</h2>
          <p>Kelola sumber dan kelompokkan sesuai kebutuhan.</p>
        </div>
        <div class="pustaka-saved-controls">
          <div class="pustaka-tabs">
            <button type="button" class="pustaka-tab-btn ${b.tab === 'all' || !b.tab ? 'active' : ''}" data-action="dp-tab:all">
              Semua Daftar Pustaka
            </button>
            <button type="button" class="pustaka-tab-btn ${b.tab === 'folder' ? 'active' : ''}" data-action="dp-tab:folder">
              Folder
            </button>
          </div>
          <label class="pustaka-search-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#98A6BA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input id="dp-search" data-nocap="1" placeholder="Cari sumber…" aria-label="Cari daftar pustaka tersimpan" value="${e(b.query || '')}">
          </label>
        </div>
      </div>
      <div id="dp-list" class="pustaka-saved-body">
        ${dpListHtml()}
      </div>
    </section>
  `;

  return `
    <div class="pustaka-page-head">
      <h1>Daftar Pustaka</h1>
      <p>Buat, kelola, dan format daftar pustaka sesuai gaya sitasi yang kamu pilih.</p>
    </div>
    <div class="pustaka-top-grid">
      ${inputCard}
      <div class="pustaka-right-stack">
        ${styleCard}
        ${previewCard}
      </div>
    </div>
    ${listCard}
  `;
}
/* Saran huruf kalimat bila judul ditulis dengan huruf kapital di banyak kata. */
function caseHint() {
  const t = S.biblio.form.title || '';
  if (!looksTitleCase(t)) return '';
  return `<div class="note amber case-hint">${I('warning')}<span>Judul ini memakai huruf kapital di banyak kata. APA 7, Harvard, dan Vancouver hanya memakai huruf kapital di awal judul, setelah titik dua, dan pada nama diri. <button class="inline-link" data-action="dp-sentence">Ubah ke huruf kalimat</button></span></div>`;
}
function onSourceInput(el) {
  S.biblio.form[el.dataset.dp] = el.value;
  unsaved = true;
  const preview = $('#dp-preview');
  if (preview) preview.innerHTML = previewHtml();
  if (el.dataset.dp === 'title' && $('#dp-case')) $('#dp-case').innerHTML = caseHint();
  if (el.dataset.dp === 'type') {
    persist();
    render();
    $('#dp-type')?.focus();
  }
}

Object.assign(ACTIONS, {
  'dp-type-toggle': (_arg, btn) => {
    const wrap = btn?.closest('.pustaka-custom-dropdown') || document.querySelector('.pustaka-custom-dropdown');
    if (!wrap) return;
    const isOpen = wrap.classList.toggle('open');
    const trigger = wrap.querySelector('.pustaka-dropdown-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  },
  'dp-type-select': arg => {
    S.biblio.form.type = arg;
    persist();
    render();
  },
  'dp-style': arg => {
    S.biblio.style = arg;
    persist();
    render();
  },
  'dp-reset': () => {
    S.biblio.form = blankSource();
    S.biblio.editing = null;
    persist();
    render();
  },
  'dp-doi': (arg, button, key) => {
    const raw = String(S.biblio.form.doi || '')
      .trim()
      .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '');
    clearErrors();
    if (!raw) {
      fieldError('dp-doi', 'Masukkan DOI terlebih dahulu.');
      return focusFirstError();
    }
    if (!/^10\.\d{4,9}\/\S+$/.test(raw)) {
      fieldError('dp-doi', 'Format DOI belum sesuai. Contoh: 10.1371/journal.pone.0209969');
      return focusFirstError();
    }
    const hit = knownSources().find(k => k.doi && k.doi.toLowerCase() === raw.toLowerCase());
    if (hit) {
      const { key: _k, ...src } = hit;
      S.biblio.form = { ...blankSource(), ...src };
      persist();
      render();
      toast('Metadata DOI ditemukan dan terverifikasi. Tinjau sebelum menyimpan.');
    } else {
      S.biblio.form.doi = raw;
      persist();
      toast(
        'Metadata DOI ini belum dapat diambil pada prototipe. Lengkapi data secara manual; statusnya tercatat sebagai ditambahkan pengguna.',
        '',
        7000,
      );
    }
  },
  'dp-copy': async () => {
    const p = previewSource();
    if (!p) {
      toast('Belum ada sumber untuk disalin.', 'error');
      return;
    }
    await copyText(formatCitation(p.src, S.biblio.style, p.no).text);
  },
  'dp-copy-all': async () => {
    const st = S.biblio.style,
      items = [...S.biblio.items];
    const list = ['IEEE', 'Vancouver'].includes(st)
      ? items.reverse().map((it, i) => (st === 'Vancouver' ? `${i + 1}. ` : '') + formatCitation(it, st, i + 1).text)
      : items
          .map(it => formatCitation(it, st).text)
          .sort((a, b) => a.localeCompare(b, 'id', { sensitivity: 'base' }));
    if (await copyText(list.join('\n'))) toast(`${list.length} sumber disalin dalam format ${st}.`);
  },
  'dp-sentence': () => {
    S.biblio.form.title = toSentenceCase(S.biblio.form.title);
    persist();
    render();
    $('#dp-title')?.focus();
    toast('Judul diubah ke huruf kalimat. Kembalikan huruf kapital pada nama diri bila ada.', '', 6500);
  },
  'dp-search-clear': () => {
    S.biblio.query = '';
    persist();
    render();
    $('#dp-search')?.focus();
  },
  'dp-save': () => {
    const f = S.biblio.form;
    if (!dpValidate(f)) return;
    f.year = String(f.year).trim();
    f.pages = dash(f.pages);
    const verified = knownSources().some(k => (k.doi && k.doi === f.doi) || norm(k.title) === norm(f.title));
    if (S.biblio.editing) {
      const it = S.biblio.items.find(x => x.id === S.biblio.editing);
      if (it) Object.assign(it, { ...f, verified });
      record('Daftar pustaka diperbarui', f.title);
      toast('Sumber diperbarui di Daftar Pustaka Tersimpan.');
    } else {
      if (S.biblio.items.length >= limit().refs) {
        toast(`Kapasitas ${limit().refs} sumber untuk paket ${S.plan} sudah penuh.`, 'error');
        return;
      }
      if (S.biblio.items.some(x => (f.doi && x.doi === f.doi) || norm(x.title) === norm(f.title))) {
        fieldError('dp-title', 'Sumber ini sudah ada di Daftar Pustaka Tersimpan.');
        return focusFirstError();
      }
      S.biblio.items.unshift({
        ...f,
        id: uid(),
        folder: S.biblio.folder && S.biblio.folder !== '__none' ? S.biblio.folder : '',
        verified,
        addedAt: new Date().toISOString(),
      });
      record(
        'Sumber ditambahkan ke Daftar Pustaka',
        f.title + (verified ? ' · metadata terverifikasi' : ' · ditambahkan pengguna'),
      );
      toast('Sumber tersimpan dan ikut disinkronkan dengan naskah.');
    }
    S.biblio.form = blankSource();
    S.biblio.editing = null;
    persist();
    render();
  },
  'dp-edit': arg => {
    const it = S.biblio.items.find(x => x.id === arg);
    if (!it) return;
    const { id, folder, verified, addedAt, sample, ...src } = it;
    S.biblio.form = { ...blankSource(), ...src };
    S.biblio.editing = arg;
    persist();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  'dp-delete': arg => {
    const it = S.biblio.items.find(x => x.id === arg);
    modal(
      'Hapus dari Daftar Pustaka?',
      `<p><strong>${e(it?.title)}</strong> akan dihapus dari Daftar Pustaka Tersimpan. Kutipan di naskah yang memakai sumber ini akan ditandai belum ada di daftar.</p>`,
      B('Batal', 'close-modal') + B('Hapus', 'dp-confirm-delete:' + arg, 'danger', 'trash'),
    );
  },
  'dp-confirm-delete': arg => {
    const it = S.biblio.items.find(x => x.id === arg);
    S.biblio.items = S.biblio.items.filter(x => x.id !== arg);
    if (S.biblio.editing === arg) {
      S.biblio.editing = null;
      S.biblio.form = blankSource();
    }
    if (it) record('Sumber dihapus dari Daftar Pustaka', it.title);
    persist();
    closeModal(true);
    render();
    toast('Sumber dihapus dari Daftar Pustaka Tersimpan.');
  },
  'dp-tab': arg => {
    S.biblio.tab = arg;
    S.biblio.folder = '';
    persist();
    render();
  },
  'dp-folder': arg => {
    S.biblio.folder = arg;
    if (arg) S.biblio.tab = 'folder';
    persist();
    render();
  },
  'dp-new-folder': () => {
    modal(
      'Buat folder',
      `
        <div class="folder-modal-field">
          <div class="folder-modal-label-row">
            <label for="folder-name" class="folder-modal-label">Nama folder<span class="required-star">*</span></label>
            <span class="folder-modal-counter" data-count="folder-name">0/40</span>
          </div>
          <input id="folder-name" type="text" maxlength="40" placeholder="Contoh: Bab V" class="folder-modal-input" autocomplete="off" autofocus>
        </div>
      `,
      `<button type="button" class="btn folder-modal-btn-cancel" data-action="close-modal">Batal</button>
       <button type="button" class="btn primary folder-modal-btn-submit" data-action="dp-create-folder">Buat folder</button>`,
    );
  },
  'dp-create-folder': () => {
    const input = $('#folder-name');
    const n = (input?.value || '').trim();
    clearErrors();
    if (!n) {
      toast('Nama folder tidak boleh kosong.', 'error');
      input?.focus();
      return;
    }
    if (S.biblio.folders.includes(n)) {
      toast('Folder sudah ada.', 'error');
      input?.focus();
      return;
    }
    S.biblio.folders.push(n);
    persist();
    closeModal(true);
    render();
    toast(`Folder "${n}" berhasil dibuat.`);
  },
  'dp-folder-toggle': (arg, btn) => {
    const wrapper = btn?.closest('.pustaka-item-folder-wrapper');
    if (!wrapper) {
      openFolderMenuId = openFolderMenuId === arg ? null : arg;
      render();
      return;
    }
    const existing = wrapper.querySelector('.pustaka-folder-popover');
    document.querySelectorAll('.pustaka-folder-popover').forEach(el => el.remove());
    document.querySelectorAll('.pustaka-item-btn-folder.open').forEach(b => {
      b.classList.remove('open');
      b.setAttribute('aria-expanded', 'false');
    });

    if (existing) {
      openFolderMenuId = null;
      return;
    }

    openFolderMenuId = arg;
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    const it = S.biblio.items.find(x => x.id === arg);
    if (!it) return;
    wrapper.insertAdjacentHTML('beforeend', folderPopoverHtml(it));
  },
  'dp-folder-assign': (arg, btn) => {
    ACTIONS['dp-folder-toggle'](arg, btn);
  },
  'dp-folder-select': arg => {
    const colonIdx = arg.indexOf(':');
    const itemId = colonIdx === -1 ? arg : arg.slice(0, colonIdx);
    const folderName = colonIdx === -1 ? '' : arg.slice(colonIdx + 1);
    const it = S.biblio.items.find(x => x.id === itemId);
    if (it) {
      it.folder = folderName;
      persist();
    }
    openFolderMenuId = null;
    render();
    toast(folderName ? `Dipindahkan ke ${folderName}.` : 'Dikeluarkan dari folder.');
  },
  'dp-folder-new-modal': arg => {
    openFolderMenuId = null;
    document.querySelectorAll('.pustaka-folder-popover').forEach(el => el.remove());
    document.querySelectorAll('.pustaka-item-btn-folder.open').forEach(b => {
      b.classList.remove('open');
      b.setAttribute('aria-expanded', 'false');
    });
    modal(
      'Buat folder',
      `
        <div class="folder-modal-field">
          <div class="folder-modal-label-row">
            <label for="folder-new-name" class="folder-modal-label">Nama folder<span class="required-star">*</span></label>
            <span class="folder-modal-counter" data-count="folder-new-name">0/40</span>
          </div>
          <input id="folder-new-name" type="text" maxlength="40" placeholder="Contoh: Bab V" class="folder-modal-input" autocomplete="off" autofocus>
        </div>
      `,
      `<button type="button" class="btn folder-modal-btn-cancel" data-action="close-modal">Batal</button>
       <button type="button" class="btn primary folder-modal-btn-submit" data-action="dp-folder-create-assign:${arg}">Buat folder</button>`,
    );
  },
  'dp-folder-create-assign': arg => {
    const input = $('#folder-new-name');
    const nw = (input?.value || '').trim();
    if (!nw) {
      toast('Nama folder tidak boleh kosong.', 'error');
      input?.focus();
      return;
    }
    if (!S.biblio.folders.includes(nw)) {
      S.biblio.folders.push(nw);
    }
    const it = S.biblio.items.find(x => x.id === arg);
    if (it) {
      it.folder = nw;
    }
    persist();
    closeModal(true);
    render();
    toast(`Folder "${nw}" dibuat dan sumber dipindahkan.`);
  },
  'dp-save-folder': arg => {
    const it = S.biblio.items.find(x => x.id === arg),
      nw = $('#folder-new').value.trim(),
      pick = nw || $('#folder-pick').value;
    if (nw && !S.biblio.folders.includes(nw)) S.biblio.folders.push(nw);
    if (it) it.folder = pick;
    persist();
    closeModal(true);
    render();
    toast(pick ? `Dipindahkan ke ${pick}.` : 'Dikeluarkan dari folder.');
  },
  'dp-detail': arg => {
    const it = S.biblio.items.find(x => x.id === arg);
    if (!it) return;
    const c = formatCitation(it, S.biblio.style, citeNo(it.id)),
      rep = syncReport(),
      cited = rep?.rows.filter(r => r.item?.id === it.id).map(r => r.c.loc) || [];
    modal(
      'Informasi sumber',
      `<div class="candidate-context"><span class="eyebrow">${e(it.type)} · ${e(it.folder || 'Belum masuk folder')}</span><h3>${e(it.title)}</h3>${badge(it.verified ? 'Metadata terverifikasi' : 'Ditambahkan pengguna · belum terverifikasi', it.verified ? 'green' : 'amber')}</div>${outputRows(
        [
          ['Penulis', it.authors],
          ['Tahun', it.year],
          [it.type === 'Jurnal' ? 'Jurnal' : 'Penerbit', it.container],
          ...(it.city ? [['Kota terbit', it.city]] : []),
          ['Volume / Nomor / Halaman', [it.volume, it.issue, it.pages].filter(Boolean).join(' / ') || 'Belum diisi'],
          ['DOI atau tautan', it.doi || it.url || 'Belum diisi'],
          ['Dikutip di naskah', cited.length ? cited.join('; ') : 'Belum ditemukan pada naskah yang dimuat'],
        ],
        false,
      )}<div class="v6-preview-caption mt">Preview (${e(S.biblio.style)})</div><div class="v6-citation-preview">${c.html}</div>`,
      B('Tutup', 'close-modal') +
        B('Salin', 'dp-copy-item:' + arg, '', 'copy') +
        B('Edit', 'dp-edit:' + arg, 'primary', 'edit'),
      true,
    );
  },
  'dp-copy-item': async arg => {
    const it = S.biblio.items.find(x => x.id === arg);
    if (it) await copyText(formatCitation(it, S.biblio.style, citeNo(it.id)).text);
  },
  'dp-cari-jurnal': () => {
    modal(
      'Lanjut ke Alerin Cari Jurnal',
      '<p>Pencarian referensi baru dimulai tanpa membawa judul atau data penelitian. Simpan artikel yang kamu temukan, lalu tambahkan melalui Input Sumber agar ikut disinkronkan dengan naskah.</p><p class="small">Pencarian di Alerin Jurnal mengikuti jatah Alerin Jurnal, bukan jatah Alerin Skripsi.</p>',
      B('Kembali', 'close-modal') +
        `<a class="btn primary" href="https://alerin.id/features/journal" target="_blank" rel="noopener noreferrer">${I('external')}Buka Alerin Cari Jurnal</a>`,
    );
  },
  'dp-sync-review': () => {
    const rep = syncReport();
    if (!rep) {
      toast('Muat naskah terlebih dahulu.', 'error');
      return;
    }
    const missing = rep.rows.filter(r => !r.item);
    modal(
      'Saran Sinkronisasi',
      `<p>${rep.matched} dari ${rep.total} kutipan pada naskah sudah tercatat di Daftar Pustaka.</p><h3 class="mt">Kutipan belum ada di Daftar Pustaka (${missing.length})</h3>${
        missing.length
          ? missing
              .map(({ c }) => {
                const k = catalogFor(c);
                return `<article class="literature-item"><div class="between"><h3>${e(c.label)}</h3>${badge('Belum ada di daftar', 'amber')}</div><p>${e(c.loc)}${k ? ' · metadata tersedia dari katalog terverifikasi' : ' · lengkapi metadata dari sumber aslinya'}</p><div class="actions">${B('Isi ke Input Sumber', 'dp-use-citation:' + rep.rows.findIndex(r => r.c === c), '', 'plus')}</div></article>`;
              })
              .join('')
          : '<p class="small">Semua kutipan sudah tercatat.</p>'
      }<h3 class="mt">Tersimpan tetapi belum dikutip (${rep.unused.length})</h3>${rep.unused.length ? rep.unused.map(it => `<div class="component"><h4>${e(it.title)}</h4><p>${e(it.authors)} · ${e(it.year)}. Pertahankan bila akan dikutip, atau hapus bila tidak digunakan.</p></div>`).join('') : '<p class="small">Tidak ada.</p>'}<p class="small muted mt">Kecocokan dinilai dari nama penulis pertama dan tahun. Ketepatan isi sitasi tetap perlu ditinjau.</p>`,
      B('Tutup', 'close-modal'),
      true,
    );
  },
  'dp-use-citation': (arg, button, key) => {
    const rep = syncReport(),
      row = rep?.rows[+arg];
    if (!row) return;
    const k = catalogFor(row.c);
    if (k) {
      const { key: _k, ...src } = k;
      S.biblio.form = { ...blankSource(), ...src };
    } else {
      S.biblio.form = {
        ...blankSource(),
        authors: row.c.label.replace(/\s*\(\d{4}\)$/, '').replace(' dkk.', ', dkk.'),
        year: row.c.year,
      };
    }
    S.biblio.editing = null;
    persist();
    closeModal(true);
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast(
      k
        ? 'Metadata dimasukkan ke Input Sumber. Tinjau, lalu Simpan ke Daftar.'
        : 'Penulis dan tahun dimasukkan. Lengkapi judul dan sumbernya, lalu Simpan ke Daftar.',
      '',
      6500,
    );
  },
  'dp-sync-all': () => {
    const rep = syncReport();
    if (!rep) {
      toast('Muat naskah terlebih dahulu.', 'error');
      return;
    }
    const missing = rep.rows.filter(r => !r.item),
      katalog = missing.map(r => catalogFor(r.c)).filter(Boolean);
    if (katalog.length) {
      modal(
        'Sinkronkan semua kutipan',
        `<p>${rep.matched} dari ${rep.total} kutipan sudah tercatat. ${katalog.length} kutipan lain punya metadata dari katalog terverifikasi dan bisa langsung ditambahkan:</p><ul class="plain-list">${katalog.map(k => `<li><strong>${e(k.title)}</strong><small>${e(k.authors)} · ${e(k.year)}</small></li>`).join('')}</ul>${missing.length > katalog.length ? `<p class="small muted mt">${missing.length - katalog.length} kutipan lain perlu kamu lengkapi sendiri lewat Tinjau Saran Sinkronisasi.</p>` : ''}`,
        B('Batal', 'close-modal') + B(`Tambahkan ${katalog.length} sumber`, 'dp-sync-add', 'primary', 'plus'),
      );
      return;
    }
    S.biblio.naskah.time = new Date().toISOString();
    record('Sinkronisasi naskah diperbarui', `${rep.matched}/${rep.total} kutipan cocok`);
    persist();
    render();
    toast(
      `Sinkronisasi diperbarui: ${rep.matched}/${rep.total} kutipan tercatat.` +
        (missing.length ? ` ${missing.length} kutipan perlu dilengkapi lewat Tinjau Saran Sinkronisasi.` : ''),
      '',
      6500,
    );
  },
  'dp-sync-add': () => {
    const rep = syncReport();
    if (!rep) return closeModal(true);
    let n = 0;
    for (const r of rep.rows.filter(x => !x.item)) {
      const k = catalogFor(r.c);
      if (!k || S.biblio.items.length >= limit().refs) continue;
      if (S.biblio.items.some(x => norm(x.title) === norm(k.title))) continue;
      const { key: _k, ...src } = k;
      S.biblio.items.unshift({ ...blankSource(), ...src, id: uid(), folder: '', verified: true, addedAt: new Date().toISOString() });
      n++;
    }
    S.biblio.naskah.time = new Date().toISOString();
    record('Sinkronisasi naskah', `${n} sumber dari katalog ditambahkan`);
    persist();
    closeModal(true);
    render();
    const after = syncReport();
    toast(`${n} sumber ditambahkan. Sekarang ${after.matched}/${after.total} kutipan tercatat.`);
  },
  'dp-naskah-latest': async () => {
    const f = S.files.filter(f => f.context === 'research' && /\.(pdf|docx)$/i.test(f.name)).at(-1);
    const pasted = (S.periksa?.text || '').trim();
    if (!f && pasted) {
      const citations = extractCitations(pasted);
      if (!citations.length) {
        toast('Teks di Periksa Skripsi belum memuat kutipan penulis–tahun.', 'error');
        return;
      }
      S.biblio.naskah = { source: 'Teks dari Periksa Skripsi', citations, time: new Date().toISOString(), sample: false };
      record('Naskah disinkronkan', citations.length + ' kutipan dari Periksa Skripsi');
      persist();
      render();
      const r = syncReport();
      toast(`${r.matched}/${r.total} kutipan sudah tercatat di Daftar Pustaka.`);
      return;
    }
    if (!f) {
      modal(
        'Naskah belum ditambahkan',
        '<p>Unggah naskah melalui Periksa Skripsi atau langsung di kartu Sinkronisasi Naskah. Kamu juga dapat menempel teks naskah.</p>',
        B('Tutup', 'close-modal') + B('Tempel teks naskah', 'dp-naskah-paste', 'primary', 'edit'),
      );
      return;
    }
    const blob = await fileStore('get', f.id);
    if (!blob) {
      toast('Berkas belum tersedia di perangkat ini. Unggah kembali naskahnya.', 'error');
      return;
    }
    await readNaskah(new File([blob], f.name, { type: blob.type }));
  },
  'dp-naskah-paste': () => {
    modal(
      'Tempel teks naskah',
      field(
        'naskah-text',
        'Teks naskah',
        '',
        'Tempel bab atau seluruh naskah yang memuat kutipan, misalnya (Piaget, 1952).',
        60000,
        'textarea',
        '',
        false,
      ),
      B('Batal', 'close-modal') + B('Sinkronkan', 'dp-naskah-save', 'primary', 'refresh'),
      true,
    );
  },
  'dp-naskah-save': () => {
    const text = $('#naskah-text').value.trim();
    clearErrors();
    if (!text) {
      fieldError('naskah-text', 'Tempel teks naskah terlebih dahulu.');
      return focusFirstError();
    }
    const citations = extractCitations(text);
    if (!citations.length) {
      fieldError('naskah-text', 'Kutipan penulis–tahun, misalnya (Piaget, 1952), belum ditemukan pada teks ini.');
      return focusFirstError();
    }
    S.biblio.naskah = { source: 'Teks naskah yang ditempel', citations, time: new Date().toISOString(), sample: false };
    record('Naskah disinkronkan', citations.length + ' kutipan dari teks');
    persist();
    closeModal(true);
    render();
    const r = syncReport();
    toast(`${r.matched}/${r.total} kutipan sudah tercatat di Daftar Pustaka.`);
  },
});

document.addEventListener('keydown', ev => {
  if (ev.key === 'Enter') {
    if (ev.target?.id === 'folder-name') {
      ev.preventDefault();
      ACTIONS['dp-create-folder']?.();
    } else if (ev.target?.id === 'folder-new-name') {
      ev.preventDefault();
      const submitBtn = document.querySelector('.folder-modal-btn-submit');
      if (submitBtn) submitBtn.click();
    }
  }
});
