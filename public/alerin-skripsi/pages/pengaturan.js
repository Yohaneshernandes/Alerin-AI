'use strict';
/* Halaman pengaturan. */
function pengaturanPage() {
  const dark = S.settings.theme === 'dark';
  return `
    <div class="cfg-page">
      <div class="cfg-head">
        <h1 class="cfg-title">Pengaturan</h1>
        <p class="cfg-desc">Atur kenyamanan membaca dan kelola salinan data penelitian.</p>
      </div>

      <!-- Kartu 1: Kenyamanan tampilan -->
      <section class="cfg-card">
        <h2 class="cfg-card-title">Kenyamanan tampilan</h2>
        <div class="cfg-rows">
          <!-- Mode tampilan -->
          <div class="cfg-row">
            <div class="cfg-row-info">
              <div class="cfg-row-label">Mode tampilan</div>
              <div class="cfg-row-desc">${dark ? 'Mode gelap' : 'Mode terang'}</div>
            </div>
            <div class="cfg-row-ctrl">
              <input type="checkbox" class="cfg-switch" role="switch" aria-label="Mode gelap" data-theme-toggle="1" ${dark ? 'checked' : ''}>
            </div>
          </div>

          <div class="cfg-divider"></div>

          <!-- Animasi antarmuka -->
          <div class="cfg-row">
            <div class="cfg-row-info">
              <div class="cfg-row-label">Animasi antarmuka</div>
              <div class="cfg-row-desc">Matikan gerakan peralihan jika kamu lebih nyaman dengan tampilan yang tenang.</div>
            </div>
            <div class="cfg-row-ctrl">
              <input type="checkbox" class="cfg-switch" role="switch" aria-label="Animasi antarmuka" data-setting="motion" ${S.settings.motion ? 'checked' : ''}>
            </div>
          </div>

          <div class="cfg-divider"></div>

          <!-- Ukuran tulisan -->
          <div class="cfg-row">
            <div class="cfg-row-info">
              <div class="cfg-row-label">Ukuran tulisan</div>
              <div class="cfg-row-desc cfg-reading-desc-desktop">Perbesar teks isi agar lebih nyaman dibaca.</div>
              <div class="cfg-row-desc cfg-reading-desc-mobile">Perbesar agar lebih nyaman dibaca.</div>
            </div>
            <div class="cfg-row-ctrl">
              <div class="cfg-select-wrap">
                <select class="cfg-select" aria-label="Ukuran tulisan" data-setting="reading">
                  <option value="normal" ${S.settings.reading !== 'large' ? 'selected' : ''}>Standar</option>
                  <option value="large" ${S.settings.reading === 'large' ? 'selected' : ''}>Lebih besar</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Kartu 2: Data di perangkat ini -->
      <section class="cfg-card">
        <h2 class="cfg-card-title">Data di perangkat ini</h2>
        <div class="cfg-rows">
          <!-- Unduh salinan data -->
          <div class="cfg-row cfg-row-stack-mobile">
            <div class="cfg-row-info">
              <div class="cfg-row-label">Unduh salinan data</div>
              <div class="cfg-row-desc">Mencakup isian, pekerjaan, arahan dosen, dan daftar lampiran. Isi berkas asli diunduh terpisah.</div>
            </div>
            <div class="cfg-row-ctrl">
              <button type="button" class="cfg-btn cfg-btn-default" data-action="export-all">
                ${I('download')}
                <span>Unduh data</span>
              </button>
            </div>
          </div>

          <div class="cfg-divider"></div>

          <!-- Mulai dengan ruang kosong -->
          <div class="cfg-row cfg-row-stack-mobile">
            <div class="cfg-row-info">
              <div class="cfg-row-label">Mulai dengan ruang kosong</div>
              <div class="cfg-row-desc">Arsipkan kondisi saat ini lalu mulai penelitian baru. Salinan lokal dapat dipulihkan.</div>
            </div>
            <div class="cfg-row-ctrl">
              <button type="button" class="cfg-btn cfg-btn-danger" data-action="reset-empty">
                ${I('refresh')}
                <span>Mulai baru</span>
              </button>
            </div>
          </div>

          <div class="cfg-divider"></div>

          <!-- Pulihkan data sebelumnya -->
          <div class="cfg-row cfg-row-stack-mobile">
            <div class="cfg-row-info">
              <div class="cfg-row-label">Pulihkan data sebelumnya</div>
              <div class="cfg-row-desc ${hasArchive() ? '' : 'cfg-desc-muted'}">
                ${
                  hasArchive()
                    ? 'Kembalikan arsip yang dibuat saat memilih mulai baru atau mengisi contoh.'
                    : 'Belum ada arsip. Arsip dibuat saat kamu memilih mulai baru atau mengisi contoh.'
                }
              </div>
            </div>
            <div class="cfg-row-ctrl">
              ${
                hasArchive()
                  ? `<button type="button" class="cfg-btn cfg-btn-default" data-action="restore-backup">
                      ${I('history')}
                      <span>Pulihkan</span>
                    </button>`
                  : `<button type="button" class="cfg-btn cfg-btn-disabled" data-action="restore-backup" aria-disabled="true">
                      ${I('history')}
                      <span>Pulihkan</span>
                    </button>`
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
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
