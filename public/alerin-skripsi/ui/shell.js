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
    `<button class="nav-btn ${isActive(r) ? 'active' : ''}" data-action="nav:${r}" ${isActive(r) ? 'aria-current="page"' : ''} title="${label}">${I(ico)}<span>${label}</span>${r === 'revisi' && pending ? `<span class="nav-count" aria-label="${pending} arahan belum ditindaklanjuti">${pending}</span>` : ''}</button>`;
  return `<button class="sidebar-scrim" data-action="sidebar" aria-label="Tutup navigasi"></button>
    <aside class="sidebar" aria-label="Navigasi penelitian"><div class="brand"><img src="assets/alerin.svg" alt=""><div class="brand-copy"><div class="brand-name">Alerin</div><div class="brand-sub"><i class="dot"></i>Asisten kampusmu</div></div><button class="sidebar-toggle" data-action="sidebar" aria-label="Tutup sidebar" title="Tutup atau ringkas sidebar">${I('chevronLeft')}</button></div><nav class="nav-group" aria-label="Navigasi utama">${NAV.map(navButton).join('')}</nav><div class="nav-sep"></div><div class="nav-label">BANTUAN TERHUBUNG</div><nav class="nav-group" aria-label="Bantuan terhubung">${NAV_HELP.map(navButton).join('')}</nav><div class="sidebar-bottom"><div class="plan-box"><div class="plan-line"><span class="small muted">Paket saat ini</span>${badge(S.plan, 'blue')}</div><strong>Alerin Skripsi ${e(S.plan)}</strong><p>Ruang untuk setiap langkah penelitianmu.</p>${B('Ubah Paket', 'nav:paket', '', 'layers')}</div><div class="side-foot"><span>Pendamping, bukan joki.</span><button data-action="nav:batasan">Batasan ${I('chevronRight')}</button></div></div></aside>
    <div class="app-body"><header class="topbar"><button class="icon-btn mobile-menu" data-action="sidebar" aria-label="Buka sidebar" aria-expanded="false">${I('chevronRight')}</button><div class="mobile-brand"><img src="assets/alerin.svg" alt=""><strong>Alerin</strong><small>Skripsi</small></div><a class="btn qc14-back-home" href="/" onclick="if(window.parent && window.parent !== window){window.parent.postMessage('backToAlerin','*');event.preventDefault();}else{window.location.href='/';event.preventDefault();}">${I('back')}<span>Kembali ke Beranda</span></a><div class="header-actions"><button type="button" class="btn notification-button" data-action="notifs" aria-label="Buka notifikasi${unread ? ': ' + unread + ' baru' : ''}">${I('bell')}Notifikasi</button><button class="icon-btn header-search" data-action="search" aria-label="Cari halaman atau fitur" title="Cari · Ctrl K">${I('search')}</button><div class="header-divider"></div><button class="profile-button" data-action="profile-menu" aria-label="Buka menu profil" aria-expanded="${menuOpen}"><span class="avatar">${e((S.profile.name || 'K').slice(0, 1).toUpperCase())}</span><span class="profile-info"><strong>${e(S.profile.name || 'Kawan')}</strong><small>Mahasiswa · ${e(S.plan)}</small></span>${I('down')}</button></div></header><main id="main" class="main" tabindex="-1">${content}<footer class="global-footer"><span>Data penelitian tersimpan di perangkat ini.</span><button data-action="about">Tentang Alerin ${I('external')}</button></footer></main></div><button class="chat-fab" data-action="chat" aria-label="${chatOpen ? 'Tutup' : 'Buka'} pintasan Alerin Chat" aria-expanded="${chatOpen}" title="Alerin Chat">${I(chatOpen ? 'close' : 'chat')}</button>${chatOpen ? chatPanel() : ''}${menuOpen ? profileMenu() : ''}${ujiPanel()}`;
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
/* Notifikasi: pratinjau integrasi dengan Notifikasi Alerin Induk. Tab Umum (agenda dan arahan dosen) dan Sistem. */
let notifTab = 'umum';
function notifItems() {
  const cutoff = addDaysIso(7),
    items = [];
  for (const a of (S.agendas || []).filter(a => a.remind !== false && !a.done && !a.log && a.date >= isoToday() && a.date <= cutoff))
    items.push({
      id: 'agenda:' + a.id + ':' + a.date + ':' + (a.time || ''),
      tab: 'umum',
      title: a.title,
      detail: dateLong(a.date) + (a.time ? ' · ' + a.time + ' WIB' : ''),
      action: 'cal-edit:' + a.id,
      label: 'Lihat Agenda',
    });
  for (const r of pendingRevisions())
    items.push({
      id: 'direction:' + r.id + ':' + (r.updatedAt || r.date || ''),
      tab: 'umum',
      title: 'Arahan dosen perlu ditindaklanjuti',
      detail: r.topic || r.text,
      action: 'nav:revisi',
      label: 'Lihat Arahan',
    });
  const rv = latestReview();
  if (rv && S.files.some(f => f.context === 'periksa' && f.time > rv.date))
    items.push({
      id: 'review:' + rv.id,
      tab: 'sistem',
      title: 'Bahan pemeriksaan telah diperbarui',
      detail: 'Periksa ulang bahan terbaru agar temuan mengikuti naskah yang digunakan.',
      action: 'nav:periksa',
      label: 'Periksa Ulang',
    });
  return items;
}
const notifUnread = () => notifItems().filter(n => !(S.notificationReads || []).includes(n.id)).length;
function notifsModal() {
  const all = notifItems(),
    read = S.notificationReads || [],
    items = all.filter(n => n.tab === notifTab);
  modal(
    'Notifikasi',
    `<div class="qc14-notification-top"><span class="small muted">Alerin Induk · pratinjau integrasi</span>${B('Tandai dibaca', 'notif-read', 'text small', '', 'aria-label="Tandai notifikasi dibaca" ' + (all.every(n => read.includes(n.id)) ? 'disabled' : ''))}</div><div class="tabs qc14-notification-tabs">${[
      ['umum', 'Umum'],
      ['sistem', 'Sistem'],
    ]
      .map(([id, label]) =>
        `<button type="button" class="btn ${notifTab === id ? 'primary' : 'text'}" data-action="notif-tab:${id}" aria-pressed="${notifTab === id}">${label} ${badge(all.filter(n => n.tab === id && !read.includes(n.id)).length, 'blue')}</button>`,
      )
      .join('')}</div>${
      items.length
        ? items
            .map(
              n =>
                `<article class="qc14-notification-item ${read.includes(n.id) ? 'read' : ''}"><div class="between"><h3>${e(n.title)}</h3>${read.includes(n.id) ? badge('Dibaca') : badge('Baru', 'blue')}</div><p>${e(n.detail)}</p>${B(n.label, n.action, 'text', 'arrow')}</article>`,
            )
            .join('')
        : `<div class="qc14-notification-empty">${I('bell')}<h3>Tidak ada notifikasi</h3><p>Belum ada pembaruan ${notifTab === 'umum' ? 'tugas, deadline, atau aktivitas penelitian' : 'sistem'} untukmu saat ini.</p></div>`
    }<p class="small muted mt">Notifikasi di sini mengikuti data penelitian di perangkat ini. Sinkronisasi akun Alerin Induk belum terhubung.</p>`,
    B('Tutup', 'close-modal'),
  );
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
    if (arg === 'progres' && progressTab === 'revisi') progressTab = 'aktif';
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
