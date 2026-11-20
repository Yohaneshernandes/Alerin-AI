'use strict';
/* Halaman & Modal paket Alerin Skripsi. */

function planModal() {
  lastFocus = document.activeElement;
  modalDirty = false;
  $('#overlay-root').innerHTML = `
    <div class="overlay b18-plan-overlay" data-overlay="true">
      <div class="b18-plan-dialog" role="dialog" aria-modal="true" aria-labelledby="plan-modal-title">
        <button type="button" class="b18-plan-close-btn" data-action="close-modal" aria-label="Tutup jendela">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="b18-plan-content">
          <header class="b18-plan-header">
            <span class="b18-plan-eyebrow">PAKET ALERIN SKRIPSI</span>
            <h2 id="plan-modal-title" class="b18-plan-title">Ruang yang sesuai dengan kebutuhanmu.</h2>
            <p class="b18-plan-subtitle">
              Semua paket membuka alur utama. Kedalaman penjelasan, kapasitas, dan jatah<br>penggunaan menyesuaikan kebutuhan penelitian.
            </p>
          </header>

          <div class="b18-plan-grid">
            <!-- Card 1: Gratis -->
            <div class="b18-plan-card b18-plan-card-gratis">
              <div class="b18-plan-card-top">
                <span class="b18-plan-card-eyebrow">LANGKAH PERTAMA</span>
                <h3 class="b18-plan-card-name">Gratis</h3>
                <p class="b18-plan-card-desc">Kenali arah dan cara kerja Alerin.</p>
              </div>

              <div class="b18-plan-divider"></div>

              <ul class="b18-plan-features">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>3 opsi judul</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Ringkasan dasar</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Pemeriksaan utama: 1/hari · 2/minggu</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Pembaruan AI: 1/hari · 2/minggu</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Pemrosesan berkas: 1/hari · 3/minggu</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Berkas hingga 5 MB</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Koleksi 5 sumber</span>
                </li>
              </ul>

              <div class="b18-plan-card-action">
                <div class="b18-plan-btn-current">
                  <span>Paket Anda Saat Ini</span>
                </div>
              </div>
            </div>

            <!-- Card 2: Plus -->
            <div class="b18-plan-card b18-plan-card-plus">
              <div class="b18-plan-card-top">
                <span class="b18-plan-card-eyebrow">PROGRES RUTIN</span>
                <h3 class="b18-plan-card-name">Plus</h3>
                <p class="b18-plan-card-desc">Lebih leluasa untuk pemeriksaan berkala.</p>
              </div>

              <div class="b18-plan-divider"></div>

              <ul class="b18-plan-features">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>3 opsi judul</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Penjelasan keterkaitan</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Pemeriksaan utama: 2/hari · 6/minggu</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Pembaruan AI: 2/hari · 8/minggu</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Pemrosesan berkas: 6/hari · 10/minggu</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Berkas hingga 15 MB</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Koleksi 20 sumber</span>
                </li>
              </ul>

              <div class="b18-plan-card-action">
                <button type="button" class="b18-plan-btn-upgrade" data-action="upgrade-plan:Plus">
                  <span>Upgrade Paket</span>
                </button>
              </div>
            </div>

            <!-- Card 3: Pro -->
            <div class="b18-plan-card b18-plan-card-pro">
              <div class="b18-plan-card-top">
                <span class="b18-plan-card-eyebrow b18-plan-card-eyebrow-pro">RISET LEBIH INTENSIF</span>
                <h3 class="b18-plan-card-name">Pro</h3>
                <p class="b18-plan-card-desc">Cakupan lebih dalam untuk revisi dan<br>hubungan antarbab.</p>
              </div>

              <div class="b18-plan-divider b18-plan-divider-pro"></div>

              <ul class="b18-plan-features">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>5 opsi judul</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Analisis risiko dan konsekuensi</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Pemeriksaan utama: 3/hari · 10/minggu</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Pembaruan AI: 4/hari · 16/minggu</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Pemrosesan berkas: 10/hari · 18/minggu</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Berkas hingga 30 MB</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Koleksi 50 sumber</span>
                </li>
              </ul>

              <div class="b18-plan-card-action">
                <button type="button" class="b18-plan-btn-upgrade" data-action="upgrade-plan:Pro">
                  <span>Upgrade Paket</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    $('#overlay-root .b18-plan-close-btn')?.focus({ preventScroll: true });
  });
}

function paketPage() {
  requestAnimationFrame(() => planModal());
  return berandaPage();
}

Object.assign(ACTIONS, {
  'open-plan-modal': () => planModal(),
  'plan-modal': () => planModal(),
  'upgrade-plan': arg => {
    if (!ALERIN.planLimits[arg]) return;
    S.plan = arg;
    record('Paket diubah', arg + ' · pratinjau tanpa transaksi');
    persist();
    closeModal(true);
    render();
    toast('Paket berhasil diubah ke ' + arg + '!');
  },
  'set-plan': arg => {
    modal(
      'Pratinjau paket ' + e(arg),
      `<p>Paket ${e(arg)} menampilkan ${ALERIN.planLimits[arg].titles} opsi judul, batas berkas ${ALERIN.planLimits[arg].mb} MB, dan kapasitas ${ALERIN.planLimits[arg].refs} sumber.</p><div class="mt">${note('Ini hanya perubahan tampilan referensi. Tidak ada transaksi, perubahan langganan asli, atau penghapusan data.')}</div>`,
      B('Batal', 'close-modal') + B('Terapkan pratinjau ' + arg, 'confirm-plan:' + arg, 'primary', 'check'),
    );
  },
  'confirm-plan': arg => {
    if (!ALERIN.planLimits[arg]) return;
    S.plan = arg;
    record('Tampilan paket diubah', arg + ' · pratinjau tanpa transaksi');
    persist();
    closeModal(true);
    render();
    toast('Pratinjau paket ' + arg + ' diterapkan.');
  },
});
