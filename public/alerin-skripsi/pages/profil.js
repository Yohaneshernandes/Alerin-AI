'use strict';
/* Halaman profil. */
function profilPage() {
  const p = S.profile,
    k = kondisiOf(p.kondisi),
    akun = stageInfo().akun;
  const item = (l, v) => `<div><span class="small muted">${l}</span><strong>${e(v || '–')}</strong></div>`;
  return (
    pageHead('Personalisasi', 'Profil utama dikelola melalui Profil di Alerin Induk. Semester dapat diperbarui di sini.') +
    `<section class="card profile-summary"><div class="identity-grid">${item('Nama', p.name)}${item('Kampus', p.campus || 'Belum diisi di akun')}${item('Jurusan', p.major)}${item('Jenjang', p.level)}<div><span class="small muted">Kondisi skripsi</span><strong>${e(k?.label || 'Belum dipilih')}</strong> ${B(k ? 'Ubah Kondisi' : 'Pilih Kondisi', 'kondisi-pick', 'text')}</div>${item('Tahap menurut akun', akun === null || akun === undefined ? 'Belum diketahui' : 'Tahap ' + stageName(akun))}</div><div class="field"><label for="profile-semester">Semester</label><select id="profile-semester">${Array.from({ length: 14 }, (_, i) => `<option ${String(i + 1) === String(p.semester) ? 'selected' : ''}>${i + 1}</option>`).join('')}</select></div><div class="actions mt">${B('Simpan Semester', 'save-semester', 'primary', 'save')}${B('Pedoman Kampus', 'nav:pedoman', 'text', 'shield')}</div><p class="small muted mt">Nama, kampus, jenjang, dan jurusan diubah lewat Profil di Alerin Induk. Kondisi skripsi juga bisa dipilih di Beranda.</p></section>`
  );
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
