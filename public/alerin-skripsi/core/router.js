'use strict';
/* Nama halaman, rute, dan penggambar halaman. */
const pageNames = {
  beranda: 'Beranda',
  mulai: 'Mulai Skripsi',
  periksa: 'Periksa Skripsi',
  progres: 'Progres Aktif',
  peta: 'Peta Skripsi',
  revisi: 'Revisi Dosen',
  pustaka: 'Daftar Pustaka',
  mentor: 'Dukungan Mentor',
  profil: 'Data akun & personalisasi',
  pedoman: 'Pedoman kampus',
  riwayat: 'Riwayat penelitian',
  pengaturan: 'Pengaturan',
  paket: 'Paket Alerin Skripsi',
  batasan: 'Batasan Alerin',
  'hasil-awal': 'Arah penelitian awal',
  'hasil-periksa': 'Hasil pemeriksaan',
  ditunda: 'Pekerjaan ditunda',
};
function go(r) {
  closeModal(true);
  menuOpen = false;
  document.body.classList.remove('sidebar-open');
  if (location.hash === '#' + r) render();
  else location.hash = r;
}
function safeRoute(r) {
  r = String(r || '').split('?')[0];
  if (r === 'referensi') r = 'pustaka';
  if (r === 'uji') r = 'beranda';
  return Object.hasOwn(pageNames, r) ? r : 'beranda';
}
function render() {
  route = safeRoute(location.hash.slice(1));
  const pages = {
    beranda: berandaPage,
    mulai: mulaiPage,
    periksa: periksaPage,
    'hasil-awal': hasilAwalPage,
    'hasil-periksa': hasilPeriksaPage,
    progres: progresPage,
    ditunda: ditundaPage,
    peta: petaPage,
    revisi: revisiPage,
    pustaka: pustakaPage,
    mentor: mentorPage,
    profil: profilPage,
    pedoman: pedomanPage,
    riwayat: riwayatPage,
    pengaturan: pengaturanPage,
    paket: paketPage,
    batasan: batasanPage,
  };
  document.body.classList.toggle('collapsed', !!S.collapsed);
  document.body.classList.toggle('no-motion', !S.settings.motion);
  document.body.classList.toggle('reading-large', S.settings.reading === 'large');
  document.body.classList.toggle('dark', S.settings.theme === 'dark');
  applySusunan();
  syncQueue();
  let content = pages[route]();
  /* Seperti site GPT: strip posisi di atas Progres, Peta, dan Mentor; catatan judul berubah di bawahnya. */
  const changed = ['hasil-awal', 'hasil-periksa', 'peta', 'progres'].includes(route) ? titleChangedNote() : '';
  if (['peta'].includes(route)) content = posStrip() + changed + content;
  else if (route === 'progres') content = changed + content;
  else if (route !== 'beranda') content = changed + content;
  $('#app').innerHTML = shell(content);
  document.title = `${pageNames[route]} · Alerin Skripsi`;
}
