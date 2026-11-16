'use strict';
/* Satu sumber tahap skripsi, kondisi akun, target, dan pengingat. */
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
  return n <= 3 ? 1 : 7;
}
function stageInfo() {
  const r = latestReview(),
    rs = reviewStage(r);
  const k = kondisiOf(S.profile.kondisi),
    ks = k ? (k.id === 'terhenti' ? (S.profile.lastStage ?? null) : k.stage) : null;
  const t = activeTasks()[0];
  if (rs !== null && rs !== undefined)
    return { idx: rs, source: 'berdasarkan pemeriksaan', akun: ks, diff: ks !== null && ks !== rs };
  if (t) return { idx: +t.phase, source: 'dari pekerjaan aktif', akun: ks, diff: false };
  if (ks !== null && ks !== undefined) return { idx: ks, source: 'menurut personalisasi', akun: ks, diff: false };
  return { idx: null, source: '', akun: null, diff: false };
}
/* Teks tahap beserta sumbernya. Beranda, Peta, Progres, dan ringkasan Mentor memakai fungsi ini. */
function stageText() {
  const st = stageInfo();
  if (st.idx === null) return { st, label: 'Tahap belum diketahui', source: '', full: 'Tahap belum diketahui' };
  const label = 'Tahap ' + stageName(st.idx);
  return { st, label, source: st.source, full: `${label} (${st.source})` };
}
const phaseName = i => (i === null || i === undefined ? 'Tahap belum diketahui' : i < 0 ? 'Persiapan' : ALERIN.phases[i]?.[0] || '');
/* Strip posisi penelitian: Beranda, Progres Aktif, Peta Skripsi, dan Dukungan Mentor. */
function posStrip() {
  const k = kondisiOf(S.profile.kondisi),
    st = stageInfo();
  const eyebrow = route === 'mentor' ? 'POSISI PENELITIAN' : 'POSISI PENELITIANMU';
  let label, source;
  if (st.idx === null) {
    label = 'Tahap belum diketahui';
    source = k?.id === 'terhenti' ? 'Pilih tahap terakhirmu' : 'Pilih kondisimu terlebih dahulu';
  } else {
    label = st.idx < 0 ? 'Sebelum Tahap 01 · Persiapan' : 'Tahap ' + stageName(st.idx);
    source = st.source;
  }
  const ask =
    k?.id === 'terhenti' && S.profile.lastStage === undefined
      ? `<div class="position-ask"><label for="last-stage">Kamu terakhir sampai di tahap mana?</label><select id="last-stage">${ALERIN.phases.map((p, i) => `<option value="${i}">${String(i + 1).padStart(2, '0')} · ${e(p[0])}</option>`).join('')}</select>${B('Simpan', 'last-stage-save', '')}</div>`
      : '';
  const conflict = st.diff
    ? `<p class="position-conflict">Menurut akunmu: ${e(phaseName(st.akun))} · Berdasarkan pemeriksaan: ${e(phaseName(st.idx))} · ${B('Perbarui?', 'kondisi-sync', 'text')}</p>`
    : '';
  return `<section class="position-strip"><div><span class="eyebrow">${eyebrow}</span><strong>${e(label)}</strong><span class="position-source">${e(source)}</span></div>${B('Peta Skripsi', 'nav:peta', 'text', 'map')}${ask}${conflict}</section>`;
}
/* Catatan judul aktif berubah (QC 14 November): tampil di bawah strip posisi. */
function titleChangedNote() {
  return S.needsReview
    ? `<div class="mb">${note('Judul aktif berubah. Rancangan dan hasil sebelumnya tetap tersimpan serta <strong>perlu ditinjau ulang</strong>. ' + B('Tinjau konsistensi', 'consistency', 'text small'))}</div>`
    : '';
}
function kondisiForStage(i) {
  if (i === null || i < 0) return 'belum';
  if (i === 0) return 'judul';
  if (i <= 2) return 'proposal';
  if (i <= 4) return 'sempro';
  if (i <= 6) return 'data';
  if (i === 7) return 'babakhir';
  if (i === 8) return 'review';
  return 'sidang';
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
function reminders() {
  const today = isoToday();
  return (S.agendas || [])
    .filter(a => !a.log && !a.done && a.remind !== false && a.date >= today && daysLeft(a.date) <= 3)
    .sort((a, b) => a.date.localeCompare(b.date));
}
function pushChatReminder(a) {
  chats.push({
    who: 'assistant',
    text: `Pengingat dari Kalender Alerin\n${a.title}\n${dateLong(a.date)}${a.time ? ' · ' + a.time + ' WIB' : ''}\n\nKamu akan diingatkan lagi H-1 dan pada hari yang sama.`,
  });
  S.chatUnread = (S.chatUnread || 0) + 1;
}
const pendingRevisions = () => (S.revisions || []).filter(r => r.status !== 'done');
const latestReview = () => (S.reviews || [])[0] || null;
const openFindings = () => {
  const r = latestReview();
  return r ? r.findings.filter(f => !f.taskId) : [];
};
function pushDueReminders() {
  let n = 0;
  for (const a of reminders()) {
    const d = daysLeft(a.date),
      key = a.date + ':' + (d >= 3 ? 3 : d >= 1 ? 1 : 0);
    if (a.pushedKey === key) continue;
    a.pushedKey = key;
    pushChatReminder(a);
    n++;
  }
  return n;
}
