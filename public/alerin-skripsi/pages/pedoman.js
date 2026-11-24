'use strict';
/* Halaman pedoman. */
function pedomanPage() {
  const hasFiles = S.files.some(f => f.context === 'pedoman');
  const uploadLabel = hasFiles ? 'Update Pedoman' : 'Unggah pedoman kampus';

  return `
    <div class="pdm-page">
      <div class="pdm-head">
        <h1 class="pdm-title">Pedoman kampus</h1>
        <p class="pdm-desc">Tambahkan pedoman terbaru program studimu sebagai acuan format dan ketentuan akademik.</p>
      </div>

      <div class="pdm-layout">
        <!-- Kartu Kiri: Pedoman Penelitian -->
        <section class="pdm-card-main">
          <div class="pdm-card-header">
            <h2 class="pdm-card-title">Pedoman penelitian</h2>
            <span class="pdm-badge">Sangat disarankan</span>
          </div>

          <label class="upload-zone pdm-upload-zone" for="upload-pedoman">
            <div class="pdm-upload-icon-circle">
              ${I('upload')}
            </div>
            <p class="pdm-upload-title">${e(uploadLabel)}</p>
            <p class="pdm-upload-format">PDF, DOCX · maksimal 30 MB per berkas</p>
            <p class="pdm-upload-hint">Klik untuk memilih atau letakkan berkas di sini.</p>
            <input class="native-input" id="upload-pedoman" type="file" data-file-context="pedoman" accept=".pdf,.docx,.doc" multiple>
          </label>

          ${fileList('pedoman')}

          <p class="pdm-note">
            Berkas dapat dibuka kembali dari perangkat yang sama. Pada referensi ini, isi pedoman belum dianalisis atau diterapkan otomatis.
          </p>
        </section>

        <!-- Kartu Kanan: Gunakan acuan yang sesuai -->
        <aside class="pdm-card-side">
          <div class="pdm-side-header">
            <div class="pdm-side-icon-square">
              ${I('book')}
            </div>
            <h3 class="pdm-side-title">Gunakan acuan yang sesuai</h3>
          </div>

          <div class="pdm-bullets">
            <div class="pdm-bullet-item">
              <span class="pdm-bullet-dot"></span>
              <div class="pdm-bullet-text">Pastikan versi dan tahun pedoman terbaru.</div>
            </div>
            <div class="pdm-bullet-item">
              <span class="pdm-bullet-dot"></span>
              <div class="pdm-bullet-text">Utamakan ketentuan program studi.</div>
            </div>
            <div class="pdm-bullet-item">
              <span class="pdm-bullet-dot"></span>
              <div class="pdm-bullet-text">Klarifikasi perbedaan aturan bersama pembimbing.</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;
}
