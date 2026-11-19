'use strict';
/* Satu sumber tahap skripsi, kondisi akun, dan target. */
const stageName = i =>
  i < 0 ? 'Sebelum 01 · Persiapan' : String(i + 1).padStart(2, '0') + ' · ' + ALERIN.phases[i][0];
const KONDISI = [
  {
    id: 'belum',
    label: 'Belum mulai',
    ket: 'Memahami alur dan persiapan skripsi',
    stage: -1,
    icon: 'compass',
    msg: 'Kenali alur skripsi dari judul sampai sidang.',
    primary: 'Lihat Alur Skripsi',
    second: ['Mulai Skripsi', 'nav:mulai'],
    target: 'Tentukan bidang yang ingin diteliti',
  },
  {
    id: 'judul',
    label: 'Mencari topik/judul',
    ket: 'Membantu penyusunan topik/judul',
    stage: 0,
    icon: 'search',
    msg: 'Ceritakan idemu, Alerin bantu susun opsi judul.',
    primary: 'Ceritakan Ide',
    second: ['Periksa judul yang sudah ada', 'periksa-judul'],
    target: 'Pilih satu judul untuk diajukan',
  },
  {
    id: 'proposal',
    label: 'Penyusunan proposal',
    ket: 'Menyusun Bab 1 sampai Bab 3',
    stage: 1,
    icon: 'document',
    msg: 'Lanjutkan Bab I–III satu bagian demi satu bagian.',
    primary: 'Lanjutkan Bab I',
    second: ['Periksa bab yang sudah ditulis', 'periksa-bab:1'],
    target: 'Selesaikan draf Bab I',
  },
  {
    id: 'sempro',
    label: 'Persiapan sempro',
    ket: 'Mempelajari materi untuk sempro',
    stage: 3,
    icon: 'checklist',
    msg: 'Cek kesiapanmu sebelum seminar proposal.',
    primary: 'Periksa Kesiapan Sempro',
    second: ['Catat arahan dosen', 'add-revision'],
    target: 'Tanggal seminar proposal',
  },
  {
    id: 'data',
    label: 'Pengumpulan data',
    ket: 'Riset lapangan atau analisis data',
    stage: 5,
    icon: 'layers',
    msg: 'Susun langkah pengumpulan dan analisis data.',
    primary: 'Buat Rencana Pengumpulan Data',
    second: ['Periksa Bab III', 'periksa-bab:3'],
    target: 'Batas akhir pengumpulan data',
  },
  {
    id: 'babakhir',
    label: 'Penyusunan bab akhir',
    ket: 'Menyusun Bab 4 hingga selesai',
    stage: 7,
    icon: 'edit',
    msg: 'Lanjutkan Bab IV–V yang sedang kamu tulis.',
    primary: 'Periksa Bab IV–V',
    second: ['Sinkronkan Daftar Pustaka', 'nav:pustaka'],
    target: 'Selesaikan draf Bab IV',
  },
  {
    id: 'review',
    label: 'Review dan revisi',
    ket: 'Mengoreksi dan memperbaiki keseluruhan skripsi',
    stage: 8,
    icon: 'refresh',
    msg: 'Rekap arahan dosen, lalu perbaiki satu per satu.',
    primary: 'Catat Arahan Dosen',
    second: ['Periksa keseluruhan naskah', 'periksa-bab:all'],
    target: 'Tanggal bimbingan berikutnya',
  },
  {
    id: 'sidang',
    label: 'Persiapan sidang',
    ket: 'Mempelajari materi untuk sidang skripsi',
    stage: 9,
    icon: 'people',
    msg: 'Cek kesiapan sidangmu.',
    primary: 'Periksa Kesiapan Sidang',
    second: ['Simulasi Sidang', 'soon-sidang'],
    target: 'Tanggal sidang',
  },
  {
    id: 'terhenti',
    label: 'Progres terhenti',
    ket: 'Bingung menentukan langkah selanjutnya',
    stage: null,
    icon: 'pause',
    msg: 'Apa yang paling bikin kamu berhenti? Kita cari satu langkah kecil.',
    primary: '',
    second: ['Hubungi Mentor', 'nav:mentor'],
    target: 'Satu target kecil minggu ini',
  },
];
const kondisiOf = id => KONDISI.find(k => k.id === id);
function reviewStage(r) {
  if (!r) return null;
  if (r.mode === 'prep') return r.prep === 'sidang' ? 9 : 3;
  if (r.chapter === 'title') return 0;
  const n = +String(r.chapter).replace('bab', '');
  if (r.chapter === 'all') return null;
  return proposalChapters().includes(n) ? 1 : 7;
}
/* Posisi penelitian (Revisi 18 November): tahap yang dikonfirmasi pengguna dan tersimpan.
   Tidak mengikuti tujuan pemeriksaan (misalnya kesiapan sempro) dan tidak menyelesaikan tahap sebelumnya. */
const positionOf = () => (S.position && Number.isInteger(S.position.stage) ? S.position : null);
const positionLabel = i => (i === null || i === undefined ? 'Pilih tahap terakhir' : i < 0 ? 'Sebelum Tahap 01 · Persiapan' : 'Tahap ' + stageName(i));
function positionSource() {
  const p = positionOf();
  return p ? 'menurut informasimu · dikonfirmasi ' + dateLong(String(p.date || '').slice(0, 10) || isoToday()) : 'Belum dikonfirmasi';
}
function stageInfo() {
  const k = kondisiOf(S.profile.kondisi),
    ks = k && k.id !== 'terhenti' ? k.stage : null,
    p = positionOf();
  if (p) return { idx: p.stage, source: 'menurut informasimu', akun: ks, diff: false, confirmed: true };
  return { idx: null, source: '', akun: ks, diff: false, confirmed: false };
}
/* Teks tahap beserta sumbernya. Beranda, Peta, Progres, dan ringkasan Mentor memakai fungsi ini. */
function stageText() {
  const st = stageInfo();
  if (st.idx === null) return { st, label: 'Tahap belum dikonfirmasi', source: '', full: 'Tahap belum dikonfirmasi' };
  const label = positionLabel(st.idx);
  return { st, label, source: st.source, full: `${label} (${st.source})` };
}
const phaseName = i => (i === null || i === undefined ? 'Tahap belum diketahui' : i < 0 ? 'Persiapan' : ALERIN.phases[i]?.[0] || '');
/* Strip posisi penelitian di Progres Aktif, Peta Skripsi, dan Dukungan Mentor. Beranda memakai homeStrip(). */
function posStrip() {
  const st = stageInfo();
  const eyebrow = route === 'mentor' ? 'POSISI PENELITIAN' : 'POSISI PENELITIANMU';
  const label = positionLabel(st.idx),
    source = st.idx === null ? 'Belum dikonfirmasi · konfirmasi lewat Beranda' : positionSource();
  return `<section class="position-strip"><div><span class="eyebrow">${eyebrow}</span><strong${st.idx === null ? ' class="b18-placeholder"' : ''}>${e(label)}</strong><span class="position-source">${e(source)}</span></div>${B('Peta Skripsi', 'nav:peta', 'text', 'map')}</section>`;
}
/* Catatan judul aktif berubah (QC 14 November): tampil di bawah strip posisi. */
function titleChangedNote() {
  return S.needsReview
    ? `<div class="mb">${note('Judul aktif berubah. Rancangan dan hasil sebelumnya tetap tersimpan serta <strong>perlu ditinjau ulang</strong>. Periksa keselarasannya di Periksa Skripsi. ' + B('Periksa Judul Baru', 'periksa-judul', 'text small'))}</div>`
    : '';
}
function synchronizeResearch() {
  fillSlots();
  const st = stageInfo();
  if (st.idx !== null) S.phase = Math.max(0, st.idx);
}
function targetNow() {
  const today = isoToday(),
    list = [];
  if (S.target?.date && S.target.text) list.push({ date: S.target.date, text: S.target.text, source: 'target' });
  for (const a of S.agendas || [])
    if (a.date >= today && !a.log && !a.done)
      list.push({ date: a.date, text: a.title, source: 'agenda', id: a.id, time: a.time });
  const future = list.filter(x => x.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  return future[0] || list.sort((a, b) => b.date.localeCompare(a.date))[0] || null;
}
function urgency(date) {
  if (!date) return { cls: '', label: '' };
  const d = daysLeft(date);
  if (d < 0) return { cls: 'warn', label: `Lewat ${Math.abs(d)} hari` };
  if (d === 0) return { cls: 'warn', label: 'Hari ini' };
  if (d <= 3) return { cls: 'warn', label: `Tinggal ${d} hari lagi` };
  return { cls: '', label: `${d} hari lagi` };
}
const pendingRevisions = () => (S.revisions || []).filter(r => r.status !== 'done');
const latestReview = () => (S.reviews || [])[0] || null;
const openFindings = () => {
  const r = latestReview();
  return r ? r.findings.filter(f => !f.taskId) : [];
};
