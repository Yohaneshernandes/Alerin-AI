'use strict';
/* Halaman pengaturan. */
function pengaturanPage() {
  const dark = S.settings.theme === 'dark';
  const row = (label, desc, ctl) => `<div class="settings-row"><div><strong>${label}</strong><p>${desc}</p></div>${ctl}</div>`;
  return (
    pageHead('Pengaturan', 'Atur kenyamanan membaca dan kelola salinan data penelitian.', '', '', '', 'PROFIL') +
    `<section class="card" style="max-width:850px"><h3>Kenyamanan tampilan</h3>${row('Mode tampilan', dark ? 'Mode gelap' : 'Mode terang', `<input type="checkbox" class="switch" role="switch" aria-label="Mode gelap" data-theme-toggle="1" ${dark ? 'checked' : ''}>`)}${row('Animasi antarmuka', 'Matikan gerakan peralihan jika kamu lebih nyaman dengan tampilan yang tenang.', `<input class="switch" type="checkbox" role="switch" aria-label="Animasi antarmuka" data-setting="motion" ${S.settings.motion ? 'checked' : ''}>`)}${row('Ukuran tulisan', 'Perbesar teks isi agar lebih nyaman dibaca.', `<select aria-label="Ukuran tulisan" data-setting="reading"><option value="normal" ${S.settings.reading !== 'large' ? 'selected' : ''}>Standar</option><option value="large" ${S.settings.reading === 'large' ? 'selected' : ''}>Lebih besar</option></select>`)}${row('Panduan Progres Aktif', S.settings.hideProgresGuide ? 'Panduan disembunyikan.' : 'Panduan Cara membaca Progres Aktif ditampilkan di Progres Aktif.', S.settings.hideProgresGuide ? B('Tampilkan Panduan', 'show-progres-guide', 'primary', 'eye') : B('Sembunyikan', 'dismiss-progres-guide', 'text'))}<hr class="rule"><h3>Data di perangkat ini</h3>${row('Unduh salinan data', 'Mencakup isian, pekerjaan, arahan dosen, dan daftar lampiran. Isi berkas asli diunduh terpisah.', B('Unduh data', 'export-all', '', 'download'))}${row('Mulai dengan ruang kosong', 'Arsipkan kondisi saat ini lalu mulai penelitian baru. Salinan lokal dapat dipulihkan.', B('Mulai baru', 'reset-empty', 'danger', 'refresh'))}${row('Pulihkan data sebelumnya', hasArchive() ? 'Kembalikan arsip yang dibuat saat memilih mulai baru atau mengisi contoh.' : 'Belum ada arsip. Arsip dibuat saat kamu memilih mulai baru atau mengisi contoh.', hasArchive() ? B('Pulihkan', 'restore-backup', '', 'history') : `<button type="button" class="btn locked" data-action="restore-backup" aria-disabled="true">${I('history')}Pulihkan</button>`)}${row('Isi contoh penelitian', 'Isi semua halaman, termasuk Konteks Skripsi, dengan contoh penelitian tentang film. Data sekarang diarsipkan dulu.', B('Isi Contoh', 'isi-contoh', '', 'document'))}</section>`
  );
}

const hasArchive = () => !!localStorage.getItem(ARSIP);
const isEmptyState = () =>
  !S.title && !S.tasks.length && !S.revisions.length && (!S.profile.kondisi || S.profile.personalisasi?.contoh) && !S.position && !(S.reviews || []).length && !S.draftReady;
/* Arsipkan data aktif. Contoh dan data kosong tidak menimpa arsip data pengguna yang sudah ada. */
function archiveCurrent() {
  if ((S.sample || isEmptyState()) && hasArchive()) return;
  if (isEmptyState()) return;
  localStorage.setItem(ARSIP, JSON.stringify(S));
}
function replaceState(next) {
  const { settings, collapsed } = S;
  S = next;
  S.settings = settings;
  S.collapsed = collapsed;
  synchronizeResearch();
  persist();
  closeModal(true);
  go('beranda');
  render();
}

Object.assign(ACTIONS, {
  'isi-contoh': () => {
    try {
      archiveCurrent();
    } catch {
      toast('Arsip belum tersimpan. Data aktif tidak diubah.', 'error');
      return;
    }
    replaceState(initialState(false));
    toast('Contoh penelitian dimuat. Data sebelumnya bisa dipulihkan di Pengaturan.', '', 6000);
  },
  'export-all': () => {
    download('Data_Penelitian_Alerin.json', JSON.stringify(S, null, 2), 'application/json');
    toast('Salinan data siap diunduh; berkas asli diunduh terpisah.');
  },
  'reset-empty': () => {
    modal(
      'Mulai baru?',
      `<p>Data sekarang diarsipkan dulu. Setelah itu kamu mulai lagi tanpa judul dan pekerjaan.</p><p class="small muted">Arsip bisa dikembalikan lewat Pulihkan data sebelumnya.</p>`,
      B('Batal', 'close-modal') + B('Arsipkan dan Mulai Baru', 'confirm-reset', 'primary'),
    );
  },
  'restore-backup': () => {
    let backup;
    try {
      backup = JSON.parse(localStorage.getItem(ARSIP));
    } catch {}
    if (!backup) {
      toast('Belum ada arsip. Arsip dibuat saat kamu menekan Mulai Baru atau Isi Contoh.', 'error');
      return;
    }
    modal(
      'Pulihkan data sebelumnya?',
      `<p>Data berjudul <strong>${e(backup.title || 'Tanpa judul')}</strong> akan dikembalikan. Data yang sekarang tampil disimpan sebagai arsip.</p>`,
      B('Batal', 'close-modal') + B('Pulihkan', 'confirm-backup', 'primary'),
    );
  },
  'confirm-backup': () => {
    const old = readStored(ARSIP);
    if (!old) return;
    try {
      localStorage.setItem(ARSIP, JSON.stringify(S));
    } catch {
      toast('Data belum dapat dipulihkan. Ruang penyimpanan perangkat penuh.', 'error');
      return;
    }
    S = { ...old, settings: S.settings, collapsed: S.collapsed };
    normalizeState();
    synchronizeResearch();
    persist();
    closeModal(true);
    go('beranda');
    render();
    toast('Data sebelumnya sudah dipulihkan.');
  },
  'confirm-reset': () => {
    try {
      archiveCurrent();
    } catch {
      toast('Arsip belum tersimpan. Data aktif tidak dihapus.', 'error');
      return;
    }
    replaceState(initialState(true));
    toast('Data lama diarsipkan. Kamu mulai dari kosong.');
  },
});
