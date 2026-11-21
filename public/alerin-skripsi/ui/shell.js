'use strict';
/* Kerangka halaman: sidebar, kepala halaman, pencarian, notifikasi, pintasan Alerin Chat, dan panel uji. */
function searchModal() {
  modal(
    'Cari di ruang skripsimu',
    `<div class="search-modal"><input id="command-search" data-nocap="1" aria-label="Cari halaman atau fitur" placeholder="Cari halaman atau fitur…" autocomplete="off"><div class="search-results" id="command-results">${searchResults('')}</div></div>`,
    '',
  );
}
function searchResults(q) {
  return (
    Object.entries(pageNames)
      .filter(([k, n]) => n.toLowerCase().includes(q.toLowerCase()))
      .map(
        ([r, n]) =>
          `<button data-action="nav:${r}">${I([...NAV, ...NAV_HELP].find(x => x[0] === r)?.[2] || 'document')}<span>${n}</span>${I('arrow')}</button>`,
      )
      .join('') +
        ('kalender alerin agenda'.includes(q.toLowerCase().trim()) || /kalend|agenda|jadwal/i.test(q)
          ? `<button data-action="calendar">${I('calendar')}<span>Kalender Alerin</span>${I('arrow')}</button>`
          : '') || '<p class="small muted">Halaman belum ditemukan. Coba “progres”, “pedoman”, atau “revisi”.</p>'
  );
}
const NAV = [
  ['beranda', 'Beranda', 'home'],
  ['mulai', 'Mulai Skripsi', 'compass'],
  ['periksa', 'Periksa Skripsi', 'document'],
  ['progres', 'Progres Aktif', 'checklist'],
  ['peta', 'Peta Skripsi', 'map'],
  ['revisi', 'Revisi Dosen', 'edit'],
];
const NAV_HELP = [
  ['pustaka', 'Daftar Pustaka', 'book'],
  ['mentor', 'Dukungan Mentor', 'people'],
];
function shell(content) {
  const pending = pendingRevisions().length,
    unread = notifUnread();
  const isActive = r =>
    route === r ||
    (r === 'progres' && route === 'ditunda') ||
    (r === 'mulai' && route === 'hasil-awal') ||
    (r === 'periksa' && route === 'hasil-periksa');
  const navButton = ([r, label, ico]) =>
    `<button class="nav-btn ${isActive(r) ? 'active' : ''}" data-action="nav:${r}" ${isActive(r) ? 'aria-current="page"' : ''} aria-label="${label}">${I(ico)}<span>${label}</span>${r === 'revisi' && pending ? `<span class="nav-count" aria-label="${pending} arahan belum ditindaklanjuti">${pending}</span>` : ''}<span class="sidebar-tooltip">${label}</span></button>`;
  return `<button class="sidebar-scrim" data-action="sidebar" aria-label="Tutup navigasi"></button>
    <aside class="sidebar" aria-label="Navigasi penelitian"><div class="brand"><button type="button" class="brand-icon-box" data-action="brand-toggle" aria-label="Alerin Skripsi"><span class="brand-icon-default"><img src="assets/alerin-skripsi-icon.png?v=20261120p14" alt="Alerin Skripsi" width="36" height="36" class="brand-icon-img"></span><span class="brand-icon-hover">${I('sidebar')}</span><span class="sidebar-tooltip">Buka sidebar</span></button><div class="brand-name" data-action="nav:beranda" role="button" tabindex="0" title="Alerin Skripsi · Beranda">Alerin Skripsi</div><div class="brand-actions"><button class="brand-action-btn" data-action="search" aria-label="Cari halaman atau fitur" title="Cari · Ctrl K">${I('search')}</button><button class="brand-action-btn sidebar-toggle" data-action="sidebar" aria-label="Tutup sidebar" title="Tutup atau ringkas sidebar">${I('sidebar')}</button></div></div><nav class="nav-group" aria-label="Navigasi utama">${NAV.map(navButton).join('')}</nav><div class="nav-sep"></div><div class="nav-label">BANTUAN TERHUBUNG</div><nav class="nav-group" aria-label="Bantuan terhubung">${NAV_HELP.map(navButton).join('')}</nav><div class="sidebar-bottom"><div class="plan-box"><div class="plan-subtitle">Paket saat ini</div><div class="plan-title">Alerin Skripsi ${e(S.plan || 'Pro')}</div><button class="plan-btn" data-action="open-plan-modal" title="Ubah Paket">${I('layers')}<span>Ubah Paket</span></button></div></div></aside>
    <div class="app-body"><header class="topbar"><button class="icon-btn mobile-menu" data-action="sidebar" aria-label="Buka sidebar" aria-expanded="false">${I('menu')}</button><div class="mobile-brand"><img src="assets/alerin-skripsi-icon.png?v=20261120p15" alt=""><strong>Alerin</strong><small>Skripsi</small></div><a class="btn qc14-back-home" href="/" onclick="if(window.parent && window.parent !== window){window.parent.postMessage('backToAlerin','*');event.preventDefault();}else{window.location.href='/';event.preventDefault();}"><div class="back-icon-circle">${I('back')}</div><span>Kembali ke Beranda</span></a><div class="header-actions"><button type="button" class="btn notification-button" data-action="notifs" aria-label="Buka notifikasi${unread ? ': ' + unread + ' baru' : ''}">${I('bell')}<span>Notifikasi</span>${unread ? `<span class="notif-dot"></span>` : ''}</button><div class="header-divider"></div><button class="profile-button" data-action="profile-menu" aria-label="Buka menu profil" aria-expanded="${menuOpen}"><span class="avatar">${e((S.profile.name || 'N').slice(0, 1).toUpperCase())}</span><span class="profile-info"><span class="profile-name-row"><span class="profile-name">${e(S.profile.name || 'Naya')}</span><span class="profile-badge">${e((S.plan || 'PRO').toUpperCase())}</span></span><span class="profile-sub">${e(S.profile.major || 'Manajemen')}</span></span><span class="profile-chevron">${I('down')}</span></button></div></header><main id="main" class="main" tabindex="-1">${content}</main></div><button class="chat-fab" data-action="chat" aria-label="${chatOpen ? 'Tutup' : 'Buka'} pintasan Alerin Chat" aria-expanded="${chatOpen}" title="Alerin Chat">${I(chatOpen ? 'close' : 'chat')}</button>${chatOpen ? chatPanel() : ''}${menuOpen ? profileMenu() : ''}${ujiPanel()}`;
}
function aboutModal() {
  modal(
    'Tentang Alerin Skripsi',
    `<div class="flex mb"><img src="assets/alerin.svg" alt="" width="36" height="40"><div><h3>Ruang penelitian yang terhubung.</h3><p class="small">Revisi QC · 15 November 2026</p></div></div><p>Beranda, Mulai Skripsi, Periksa Skripsi, Progres Aktif, Peta Skripsi, Revisi Dosen, Daftar Pustaka, dan Dukungan Mentor memakai satu data penelitian yang sama di perangkat ini.</p><h3 class="mt">Yang dapat dicoba</h3><p>Konfirmasi posisi penelitian, perbarui kondisi, susun opsi judul, periksa bab atau kesiapan sempro dan sidang, ubah temuan menjadi pekerjaan, catat arahan dosen, atur target, dan rapikan daftar pustaka.</p><h3 class="mt">Cakupan prototipe</h3><p>Analisis AI, transkripsi, pembayaran, sinkronisasi antarperangkat, Kalender Alerin Induk, dan pengiriman otomatis ke mentor belum terhubung. Hasil yang ditandai Contoh adalah contoh, bukan analisis naskahmu.</p><div class="mt">${note('Situs publik tidak membagikan isian atau unggahan antarpengunjung. Tiap peramban menyimpan datanya sendiri.')}</div>`,
    B('Mengerti', 'close-modal', 'primary'),
  );
}
function profileMenu() {
  return `<div class="profile-menu" role="menu"><div class="menu-title">Ruang penelitian ${e(S.profile.name || 'Kawan')}</div>${[
    ['profil', 'Data akun & personalisasi', 'user'],
    ['pedoman', 'Pedoman kampus', 'shield'],
    ['riwayat', 'Riwayat penelitian', 'history'],
    ['pengaturan', 'Pengaturan', 'settings'],
    ['batasan', 'Batasan Alerin', 'info'],
  ]
    .map(([r, t, i]) => `<button role="menuitem" data-action="nav:${r}">${I(i)}${t}</button>`)
    .join('')}</div>`;
}
const UJI = /uji=1/.test(location.search + location.hash);
function ujiPanel() {
  if (!UJI) return '';
  return `<details class="uji-panel"><summary>Panel uji</summary><div class="uji-body"><label>Kondisi<select data-uji="kondisi"><option value="">(kosong)</option>${KONDISI.map(k => `<option value="${k.id}" ${S.profile.kondisi === k.id ? 'selected' : ''}>${k.label}</option>`).join('')}</select></label>${[
    ['arahan', 'Arahan dosen tertunda'],
    ['temuan', 'Temuan kritis'],
    ['prioritas', 'Kartu Prioritas Utama'],
    ['target3', 'Target tinggal 3 hari'],
    ['selisih', 'Selisih tahap'],
    ['gagal', 'Progres Aktif gagal dimuat'],
    ['baru', 'Pengguna baru dari personalisasi'],
  ]
    .map(([k, l]) => `<button class="btn small" data-action="uji:${k}">${l}</button>`)
    .join(
      '',
    )}<button class="btn small" data-action="uji:kosong">Data akun kosong</button><button class="btn small" data-action="uji:contoh">Isi Ceritakan dengan contoh</button><button class="btn small" data-action="uji:naskah">Muat naskah contoh di Periksa</button><button class="btn small danger" data-action="uji:reset">Hapus semua data uji</button></div></details>`;
}
/* Notifikasi: disamakan dengan desain Notifikasi Alerin Chat */
let notifTab = 'umum';
let notifSimulatedEmpty = false;

const NOTIF_ICONS = {
  target: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>',
  alarm: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M5 3 2 6" /><path d="m22 6-3-3" /><path d="M6.38 18.7 4 21" /><path d="M17.64 18.67 20 21" /></svg>',
  quiz: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>',
  book: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" /><path d="M6 6h10" /><path d="M6 10h10" /></svg>',
  bulb: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>',
  trending: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>',
  shield: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>',
  check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>'
};

function notifItems() {
  const read = S.notificationReads || [];
  const cutoff = addDaysIso(7),
    items = [];
  for (const a of (S.agendas || []).filter(a => a.remind !== false && !a.done && !a.log && a.date >= isoToday() && a.date <= cutoff))
    items.push({
      id: 'agenda:' + a.id + ':' + a.date + ':' + (a.time || ''),
      tab: 'umum',
      title: a.title,
      detail: dateLong(a.date) + (a.time ? ' · ' + a.time + ' WIB' : ''),
      time: 'Agenda dekat',
      icon: NOTIF_ICONS.alarm,
      action: 'cal-edit:' + a.id,
      unread: !read.includes('agenda:' + a.id + ':' + a.date + ':' + (a.time || ''))
    });
  for (const r of pendingRevisions()) {
    const id = 'direction:' + r.id + ':' + (r.updatedAt || r.date || '');
    items.push({
      id,
      tab: 'umum',
      title: 'Arahan dosen perlu ditindaklanjuti',
      detail: r.topic || r.text,
      time: 'Hari ini',
      icon: NOTIF_ICONS.target,
      action: 'nav:revisi',
      unread: !read.includes(id)
    });
  }
  const rv = latestReview();
  if (rv && S.files.some(f => f.context === 'periksa' && f.time > rv.date)) {
    const id = 'review:' + rv.id;
    items.push({
      id,
      tab: 'sistem',
      icon: NOTIF_ICONS.shield,
      title: 'Bahan pemeriksaan telah diperbarui',
      detail: 'Periksa ulang bahan terbaru agar temuan mengikuti naskah yang digunakan.',
      time: 'Hari ini',
      action: 'nav:periksa',
      unread: !read.includes(id)
    });
  }
  return items;
}

const notifUnread = () => notifSimulatedEmpty ? 0 : notifItems().filter(n => !(S.notificationReads || []).includes(n.id)).length;

function notifsModal() {
  lastFocus = document.activeElement;
  modalDirty = false;
  document.body.style.overflow = 'hidden';
  const all = notifSimulatedEmpty ? [] : notifItems();
  const read = S.notificationReads || [];
  const displayUmum = all.filter(n => n.tab === 'umum');
  const displaySistem = all.filter(n => n.tab === 'sistem');
  const currentList = notifTab === 'umum' ? displayUmum : displaySistem;
  const unreadCount = all.filter(n => !read.includes(n.id)).length;

  $('#overlay-root').innerHTML = `
    <div class="overlay notif-overlay" data-overlay="true">
      <div class="notif-modal-card">
        <div class="notif-modal-header">
          <div class="notif-header-left">
            <button type="button" class="notif-bell-btn ${notifSimulatedEmpty ? 'simulated-empty' : ''}" data-action="notif-toggle-empty" title="${notifSimulatedEmpty ? 'Tampilkan notifikasi' : 'Simulasikan tidak ada notifikasi'}">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <h3 class="notif-modal-title">Notifikasi</h3>
          </div>
          <div class="notif-header-right">
            <button type="button" class="notif-mark-read-btn" data-action="notif-read" ${unreadCount === 0 || notifSimulatedEmpty || currentList.length === 0 ? 'disabled' : ''}>
              Tandai dibaca
            </button>
            <button type="button" class="notif-close-icon-btn" data-action="close-modal" aria-label="Tutup notifikasi">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div class="notif-tabs-row">
          <button type="button" class="notif-tab-item ${notifTab === 'umum' ? 'active' : ''}" data-action="notif-tab:umum">
            <span>Umum</span>
            <span class="notif-tab-badge ${notifTab === 'umum' ? 'active' : ''}">${displayUmum.length}</span>
            ${notifTab === 'umum' ? '<span class="notif-tab-indicator"></span>' : ''}
          </button>
          <button type="button" class="notif-tab-item ${notifTab === 'sistem' ? 'active' : ''}" data-action="notif-tab:sistem">
            <span>Sistem</span>
            <span class="notif-tab-badge ${notifTab === 'sistem' ? 'active' : ''}">${displaySistem.length}</span>
            ${notifTab === 'sistem' ? '<span class="notif-tab-indicator"></span>' : ''}
          </button>
        </div>

        <div class="notif-modal-body">
          ${currentList.length === 0 ? `
            <div class="notif-empty-state">
              <div class="notif-empty-icon">
                ${notifTab === 'umum' ? `
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    <line x1="4" y1="4" x2="20" y2="20" />
                  </svg>
                ` : `
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                `}
              </div>
              <h4 class="notif-empty-title">
                ${notifTab === 'umum' ? 'Tidak ada notifikasi' : 'Tidak ada notifikasi sistem'}
              </h4>
              <p class="notif-empty-desc">
                ${notifTab === 'umum'
                  ? 'Belum ada pembaruan tugas, deadline, atau aktivitas penelitian baru untukmu saat ini.'
                  : 'Semua sistem sinkronisasi data dan server berjalan normal tanpa kendala.'}
              </p>
            </div>
          ` : `
            <div class="notif-items-grid">
              ${currentList.map(n => `
                <button type="button" class="notif-item-card" data-action="${n.action || 'close-modal'}">
                  <div class="notif-item-icon">
                    ${n.icon}
                  </div>
                  <div class="notif-item-content">
                    <div class="notif-item-head">
                      <h4 class="notif-item-title">${e(n.title)}</h4>
                      ${!read.includes(n.id) ? '<span class="notif-unread-dot"></span>' : ''}
                    </div>
                    <p class="notif-item-desc">${e(n.detail || n.desc || '')}</p>
                    <span class="notif-item-time">${e(n.time || 'Baru saja')}</span>
                  </div>
                  <div class="notif-item-arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                </button>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}
/* Alerin Chat di Alerin Skripsi hanya pintasan ke Alerin Chat utama. Tidak ada percakapan di halaman ini. */
const ALERIN_CHAT_URL = 'https://alerin.id/';
function chatPanel() {
  const judul = S.title ? `<strong>“${e(S.title)}”</strong>` : 'belum dipilih';
  return `<aside class="chat-panel chat-shortcut" aria-label="Pintasan Alerin Chat"><div class="chat-head"><img src="assets/alerin.svg" alt=""><div><strong>Alerin Chat</strong></div><button class="icon-btn" data-action="chat" aria-label="Tutup pintasan Alerin Chat">${I('close')}</button></div><div class="chat-shortcut-body"><p>Kamu sedang di fitur <strong>${e(pageNames[route])}</strong>, judul penelitianmu ${judul}. Diskusikan kendalamu bersama Alerin Chat.</p><a class="btn primary chat-shortcut-link" href="${ALERIN_CHAT_URL}" onclick="if(window.parent && window.parent !== window){window.parent.postMessage('backToAlerin','*');event.preventDefault();}" target="_blank" rel="noopener">${I('external')}Buka Alerin Chat</a></div></aside>`;
}
function ujiAction(k) {
  const sample = initialState(false);
  if (k === 'arahan') {
    S.revisions.unshift({
      ...sample.revisions[0],
      id: 'rv-uji' + Date.now().toString(36),
      taskId: null,
      date: isoToday(),
    });
  }
  if (k === 'temuan') {
    S.reviews.unshift({
      id: 'rv-uji',
      date: new Date().toISOString(),
      mode: 'bab',
      chapter: '3',
      scope: 'Bab III · Metode Penelitian',
      title: S.title || ALERIN.title,
      files: [],
      pasted: 600,
      sections: ['Pendekatan dan Desain', 'Teknik Analisis'],
      textLen: 600,
      findings: findIssues(
        'Penelitian ini memakai pendekatan kualitatif. Data dianalisis dengan regresi linear berganda. Data tahun 2030 menunjukkan sebanyak 72% mahasiswa menonton film.',
        { chapters: [], title: '' },
      ),
    });
  }
  if (k === 'prioritas') {
    partTask('questions', { title: 'Perjelas rumusan masalah' });
    reorderTasks(false);
  }
  if (k === 'target3') {
    S.target = { date: addDaysIso(3), text: 'Kirim draf Bab I ke pembimbing' };
  }
  if (k === 'selisih') {
    S.profile.kondisi = 'proposal';
    S.reviews.unshift({
      id: 'rv-sel',
      date: new Date().toISOString(),
      mode: 'bab',
      chapter: '4',
      scope: 'Bab IV · Hasil dan Pembahasan',
      title: S.title,
      files: [],
      pasted: 300,
      sections: [],
      textLen: 300,
      findings: [],
    });
  }
  if (k === 'kosong') {
    const keep = S.settings;
    S = initialState(true);
    S.settings = keep;
    S.profile.kondisi = '';
    delete S.profile.personalisasi;
  }
  if (k === 'baru') {
    const keep = S.settings;
    S = initialState(true);
    S.settings = keep;
  }
  if (k === 'gagal') ujiProgresGagal = !ujiProgresGagal;
  if (k === 'contoh') {
    const kk = kondisiOf(S.profile.kondisi) || kondisiOf('judul');
    S.profile.kondisi = kk.id;
    S.home = {
      k: kk.id,
      step: 'tell',
      ans: {
        minat: 'Film dan pendidikan kesehatan remaja',
        topic: 'Film sebagai media pendidikan kesehatan',
        location: 'Mahasiswa di Kota Malang',
        phenomenon:
          'Banyak mahasiswa mencari informasi kesehatan reproduksi dari film karena topik ini jarang dibahas di rumah.',
        idea: 'Teori konstruktivisme; kualitatif dengan wawancara mendalam',
        title: ALERIN.title,
        written: 'Latar belakang sudah ada. Rumusan masalah masih kasar.',
        method: 'Kualitatif, wawancara mendalam',
        source: 'Mahasiswa dari empat kampus di Kota Malang',
        part: 'Bab IV, bagian pembahasan',
        text: 'Samakan rumusan masalah di Bab I dengan kesimpulan di Bab V.',
        focus: 'Menjelaskan alasan memilih metode kualitatif.',
      },
    };
  }
  if (k === 'naskah') {
    ensurePeriksa();
    S.periksa.mode = 'bab';
    S.periksa.chapter = '3';
    S.periksa.text =
      'BAB III METODE PENELITIAN\nPendekatan Penelitian\nPenelitian ini menggunakan pendekatan kualitatif dengan wawancara mendalam kepada mahasiswa di Kota Malang. Data tahun 2030 menunjukkan sebanyak 72% mahasiswa menonton film edukasi.\nTeknik Analisis Data\nData dianalisis menggunakan regresi linear berganda untuk melihat pengaruh film terhadap pengetahuan mahasiswa. Uji reliabilitas menghasilkan alpha 0,852 yang lebih besar dari r tabel 0,098.';
    go('periksa');
  }
  if (k === 'reset') {
    localStorage.removeItem(KEY);
    localStorage.removeItem(ARSIP);
    S = initialState(true);
  }
  synchronizeResearch();
  persist();
  render();
  toast('Panel uji: ' + k);
}

Object.assign(ACTIONS, {
  about: () => aboutModal(),
  'brand-toggle': () => {
    if (document.body.classList.contains('collapsed')) {
      ACTIONS.sidebar();
    } else {
      ACTIONS.nav('beranda');
    }
  },
  sidebar: () => {
    if (matchMedia('(max-width:760px)').matches) {
      const open = document.body.classList.toggle('sidebar-open');
      $('.mobile-menu')?.setAttribute('aria-expanded', String(open));
      if (open) $('.sidebar-toggle')?.focus();
      else $('.mobile-menu')?.focus();
    } else {
      S.collapsed = !S.collapsed;
      persist();
      document.body.classList.toggle('collapsed', S.collapsed);
    }
  },
  'profile-menu': () => {
    menuOpen = !menuOpen;
    render();
  },
  'close-modal': () => {
    if (!modalBusy) closeModal();
  },
  'resume-modal': () => {
    if (suspendedOverlay) {
      $('#overlay-root').replaceChildren(suspendedOverlay);
      suspendedOverlay = null;
      modalDirty = true;
    }
  },
  'discard-modal': () => {
    suspendedOverlay = null;
    closeModal(true);
  },
  search: () => {
    searchModal();
  },
  'open-file': async arg => {
    const f = S.files.find(x => x.id === arg);
    if (!f) return;
    try {
      const blob = await fileStore('get', arg);
      if (!blob) {
        toast('Isi berkas tidak tersedia di peramban ini. Unggah ulang berkasnya.', 'error');
        return;
      }
      const url = URL.createObjectURL(blob);
      modal(
        'Lampiran tersimpan',
        `<h3>${e(f.name)}</h3><p class="mt">${fileSize(f.size)} · ditambahkan ${e(localTime(f.time))} WIB</p><div class="mt">${note('Berkas asli dapat dibuka atau diunduh. Isi belum dianalisis AI.')}</div>`,
        B('Tutup', 'close-modal') +
          `<a class="btn" href="${url}" download="${e(f.name)}">${I('download')}Unduh berkas</a><a class="btn primary" href="${url}" target="_blank" rel="noopener">${I('external')}Buka berkas</a>`,
      );
    } catch {
      toast('Berkas belum dapat dibuka. Coba unggah ulang.', 'error');
    }
  },
  chat: () => {
    chatOpen = !chatOpen;
    render();
    if (chatOpen) $('.chat-shortcut-link')?.focus();
  },
  nav: arg => {
    if (unsaved) persist();
    menuOpen = false;
    if (arg === 'paket') {
      planModal();
      return;
    }
    if (arg === 'progres' && progressTab === 'revisi') progressTab = 'aktif';
    if (arg === 'mulai') {
      ensureGuide();
      S.guide.view = 'konteks';
    }
    go(safeRoute(arg));
    if (matchMedia('(max-width:760px)').matches) document.body.classList.remove('sidebar-open');
  },
  notifs: () => {
    notifsModal();
  },
  'notif-tab': arg => {
    notifTab = arg === 'sistem' ? 'sistem' : 'umum';
    notifsModal();
  },
  'notif-toggle-empty': () => {
    notifSimulatedEmpty = !notifSimulatedEmpty;
    notifsModal();
    render();
  },
  'notif-read': () => {
    S.notificationReads = [...new Set([...(S.notificationReads || []), ...notifItems().map(n => n.id)])];
    persist();
    notifsModal();
    render();
    toast('Notifikasi ditandai dibaca.');
  },
  'copy-field': arg => {
    copyText($('#' + arg)?.value || '');
  },
  'file-del': arg => {
    const f = S.files.find(x => x.id === arg);
    if (!f) return;
    S.files = S.files.filter(x => x.id !== arg);
    persist();
    refreshFileLists(f.context);
    toast('Berkas dihapus dari daftar.');
  },
  'soon-sidang': () => {
    toast('Simulasi Sidang segera hadir untuk paket Premium.');
  },
  uji: arg => {
    ujiAction(arg);
  },
});
