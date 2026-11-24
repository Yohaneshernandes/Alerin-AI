'use strict';
/* Halaman profil & personalisasi. */
function profilPage() {
  const p = S.profile || {};
  const k = kondisiOf(p.kondisi);
  const akun = stageInfo().akun;

  const nama = p.name && p.name !== 'Naya' ? p.name : 'Putra Andhika';
  const kampus = p.campus || 'Universitas Brawijaya (UB)';
  const jurusan = p.major && p.major !== 'Manajemen' ? p.major : 'Ilmu Komunikasi';
  const jenjang = (p.level === 'S1' ? 'Sarjana' : p.level) || 'Sarjana';
  const kondisiLabel = k?.label || 'Penyusunan proposal';
  const tahapLabel = akun === null || akun === undefined ? 'Tahap 02 · Penyusunan Proposal' : 'Tahap ' + stageName(akun);
  const sem = p.semester || '3';

  return `
    <div class="pz-page">
      <div class="pz-head">
        <h1 class="pz-title">Personalisasi</h1>
        <p class="pz-desc">Profil utama dikelola melalui Profil di Alerin Induk. Semester dapat diperbarui di sini.</p>
      </div>

      <section class="pz-card">
        <div class="pz-grid">
          <div class="pz-item">
            <span class="pz-label">Nama</span>
            <strong class="pz-val">${e(nama)}</strong>
          </div>
          <div class="pz-item">
            <span class="pz-label">Kampus</span>
            <strong class="pz-val">${e(kampus)}</strong>
          </div>
          <div class="pz-item">
            <span class="pz-label">Jurusan</span>
            <strong class="pz-val">${e(jurusan)}</strong>
          </div>
          <div class="pz-item">
            <span class="pz-label">Jenjang</span>
            <strong class="pz-val">${e(jenjang)}</strong>
          </div>
          <div class="pz-item">
            <span class="pz-label">Kondisi skripsi</span>
            <strong class="pz-val">${e(kondisiLabel)}</strong>
            <button type="button" class="pz-link" data-action="kondisi-pick">Ubah Kondisi</button>
          </div>
          <div class="pz-item">
            <span class="pz-label">Tahap menurut akun</span>
            <strong class="pz-val">${e(tahapLabel)}</strong>
          </div>
        </div>

        <div class="pz-semester-section">
          <label for="profile-semester" class="pz-semester-label">Semester</label>
          <div class="pz-select-wrapper">
            <select id="profile-semester" class="pz-select">
              ${Array.from({ length: 14 }, (_, i) => `<option value="${i + 1}" ${String(i + 1) === String(sem) ? 'selected' : ''}>${i + 1}</option>`).join('')}
            </select>
            <span class="pz-select-chevron">${I('down')}</span>
          </div>
        </div>

        <div class="pz-actions">
          <button type="button" class="pz-btn-save" data-action="save-semester">
            ${I('save')}
            <span>Simpan Semester</span>
          </button>
          <button type="button" class="pz-btn-guide" data-action="nav:pedoman">
            ${I('shield')}
            <span>Pedoman Kampus</span>
          </button>
        </div>

        <p class="pz-footnote">
          Nama, kampus, jenjang, dan jurusan diubah lewat Profil di Alerin Induk. Posisi penelitian dikonfirmasi terpisah di Beranda.
        </p>
      </section>
    </div>
  `;
}

Object.assign(ACTIONS, {
  'save-semester': () => {
    const v = +$('#profile-semester').value;
    if (!(v >= 1 && v <= 14)) {
      fieldError('profile-semester', 'Semester harus 1 sampai 14.');
      return;
    }
    S.profile.semester = String(v);
    record('Semester diperbarui', 'Semester ' + v);
    persist();
    render();
    toast('Semester tersimpan.');
  },
});
