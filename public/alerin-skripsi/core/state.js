'use strict';
/* Data aplikasi: bentuk awal, simpan, muat, dan migrasi dari kunci lama. */
const KEY = 'alerin-skripsi-v2';
const KEY_LAMA = 'alerin-skripsi-claude-v1';
const ARSIP = KEY + '-arsip';
function readStored(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}
/* Muat data. Data dari kunci lama dipindahkan sekali ke kunci baru supaya tidak hilang. */
function loadState() {
  let data = readStored(KEY);
  if (!data && !localStorage.getItem(KEY + '-pindah')) {
    data = readStored(KEY_LAMA);
    const arsipLama = localStorage.getItem(KEY_LAMA + '-backup');
    try {
      if (arsipLama && !localStorage.getItem(ARSIP)) localStorage.setItem(ARSIP, arsipLama);
      localStorage.setItem(KEY + '-pindah', '1');
    } catch {}
  }
  if (!data || data.version !== 1 || !Array.isArray(data.tasks)) return initialState();
  return data;
}
/* Lengkapi data lama supaya cocok dengan bentuk data sekarang. Aman dijalankan berulang. */
function normalizeState() {
  if (!S.v6 && S.sample) {
    S = initialState(true);
    return;
  }
  S.profile.kondisi ??= '';
  S.profile.deadline ??= addDaysIso(110);
  S.settings.theme ??= 'light';
  S.researchBundles ??= {};
  S.agendas ??= [];
  S.mentorNote ??= '';
  S.reviews ??= [];
  S.stageLog ??= [];
  S.home ??= { step: 'card', ans: {} };
  S.konteks ??= { chapter: '', method: '', deadline: '', kendala: '', title: '', savedAt: '' };
  S.biblio ??= sampleBiblio(!S.sample);
  S.biblio.form ??= blankSource();
  S.biblio.items ??= [];
  S.biblio.folders ??= ['Bab I', 'Bab II', 'Bab III'];
  ensureGuide();
  for (const k of ['_pastAgenda', '_pendingOrder', 'refs', 'updates', 'removedFiles', 'draftStep', 'selectedTitle', 'lastResearchUpdate'])
    delete S[k];
  if (S.v6) return;
  S.revisions = (S.revisions || []).map(r => {
    const a = analyzeArahan(r.text);
    const understanding =
      typeof r.understanding === 'object'
        ? r.understanding
        : { maksud: a.maksud, bagian: a.bagian, langkah: a.langkah };
    const done = r.status === 'done' || /sudah|selesai/i.test(r.status || '');
    return { ...r, topic: r.topic || 'Arahan dosen', status: done ? 'done' : 'open', understanding };
  });
  S.v6 = true;
}
/* Keadaan tampilan yang tidak ikut disimpan. */
let route = '',
  outputTab = 'design',
  progressTab = 'aktif',
  menuOpen = false,
  chatOpen = false,
  lastFocus = null,
  toastTimer,
  modalBusy = false,
  unsaved = false;
const ACTIONS = {};

let S;
let chats = [];
let modalDirty = false,
  suspendedOverlay = null;
function persist(message) {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
    unsaved = false;
    if (message) toast(message);
    return true;
  } catch {
    toast(
      'Data belum tersimpan. Ruang penyimpanan perangkat tidak tersedia. Unduh salinan sebelum melanjutkan.',
      'error',
    );
    return false;
  }
}
function record(title, detail = '') {
  S.history.unshift({ id: uid(), title, detail, time: new Date().toISOString() });
}
const activeTasks = () => S.tasks.filter(t => !['deferred', 'done', 'queued'].includes(t.status)).slice(0, 3);
const limit = () => ALERIN.planLimits[S.plan];
function ensureGuide() {
  S.guide ??= { view: '', part: 'background', fields: {}, guidance: {}, saved: {} };
  S.guide.fields ??= {};
  S.guide.guidance ??= {};
  S.guide.saved ??= {};
}
function ensurePeriksa() {
  S.periksa ??= { mode: 'bab', chapter: '1', part: '', prep: 'sempro', text: '', focus: '', title: '' };
  if (!S.periksa.title && S.title) S.periksa.title = S.title;
  return S.periksa;
}
function initialState(empty = true) {
  const base = {
    version: 1,
    profile: {
      name: 'Naya',
      major: 'Ilmu Komunikasi',
      level: 'S1',
      semester: '7',
      campus: '',
      deadline: addDaysIso(150),
      kondisi: '',
    },
    plan: 'Pro',
    title: '',
    sample: false,
    phase: 0,
    target: {},
    draft: {},
    draftSample: false,
    draftReady: false,
    review: { title: '', phase: 0, method: '', condition: '' },
    reviewReady: false,
    reviews: [],
    tasks: [],
    revisions: [],
    files: [],
    history: [],
    settings: { motion: true, reading: 'normal', theme: 'light' },
    collapsed: false,
    agendas: [],
    biblio: sampleBiblio(true),
    mentorNote: '',
    guide: { view: '', part: 'background', fields: {}, guidance: {}, saved: {} },
    home: { step: 'card', ans: {} },
    konteks: { chapter: '', method: '', deadline: '', kendala: '', title: '', savedAt: '' },
    stageLog: [],
    v6: true,
  };
  if (empty) return base;
  const s = clone(base);
  s.sample = true;
  s.title = ALERIN.title;
  s.profile.kondisi = 'babakhir';
  s.profile.method = 'Metode campuran';
  s.phase = 6;
  s.draftSample = true;
  s.draftReady = true;
  s.draft = clone(ALERIN.draft || {});
  s.activeResearch = { index: 0, title: ALERIN.title };
  s.biblio = sampleBiblio(false);
  s.review = { title: ALERIN.title, phase: 6, method: 'Metode campuran', condition: '' };
  s.tasks = clone(ALERIN.tasks).map(t => ({
    ...t,
    findingIds: [],
    discussion: [],
    doing: t.reason,
    criteria: t.criteria || [],
  }));
  s.revisions = [
    {
      id: 'rev-sample',
      date: addDaysIso(-3),
      topic: 'Pelaporan reliabilitas',
      stageText: '07 · Pengolahan dan Analisis Data',
      text: ALERIN.revision,
      understanding: {
        maksud:
          'Dosen meminta kamu meninjau ulang penafsiran reliabilitas: alpha 0,852 tidak dibandingkan dengan r tabel dan tidak menunjukkan validitas.',
        bagian: 'Bab III · Keabsahan Data dan Etika dan Bab IV · Hasil',
        langkah:
          'Gunakan kriteria interpretasi alpha dari rujukan yang jelas, pisahkan penjelasan validitas dan reliabilitas, lalu cocokkan dengan output pengujian.',
      },
      part: 'quality',
      status: 'open',
      understood: true,
      taskId: s.tasks[0]?.id,
      sample: true,
    },
  ];
  s.stageLog = [{ stage: 0, text: 'Judul dipilih', by: 'menurut pengguna', date: addDaysIso(-120) }];
  /* Contoh pemeriksaan Bab IV, supaya Hasil Pemeriksaan, Progres, dan ringkasan Mentor ikut terisi. */
  const naskah =
    'BAB IV HASIL DAN PEMBAHASAN\nHasil Penelitian\nUji reliabilitas instrumen menghasilkan nilai Cronbach’s Alpha 0,852. Nilai ini lebih besar dari r tabel 0,098 sehingga seluruh butir dinyatakan valid dan reliabel.\nData menunjukkan sebanyak 72% mahasiswa pernah menonton film bertema pendidikan seksual dalam enam bulan terakhir.\nPembahasan\nTemuan wawancara memperlihatkan film membantu mahasiswa memulai percakapan tentang kesehatan reproduksi.';
  const findings = findIssues(naskah, { chapters: [], title: '' }).map((f, i) => ({ ...f, id: 'f-contoh-' + (i + 1) }));
  const reliab = findings.find(f => f.part === 'quality');
  if (reliab && s.tasks[0]) {
    reliab.taskId = s.tasks[0].id;
    s.tasks[0].findingIds = [reliab.id];
  }
  s.reviews = [
    {
      id: 'rv-contoh',
      date: new Date(Date.now() - 2 * 864e5).toISOString(),
      mode: 'bab',
      prep: '',
      chapter: '4',
      part: '',
      title: ALERIN.title,
      focus: 'Apakah pelaporan reliabilitas sudah tepat?',
      scope: 'Bab IV · Hasil dan Pembahasan',
      files: [],
      pasted: naskah.length,
      sections: ['Hasil', 'Pembahasan'],
      findings,
      strengths: findStrengths(naskah, { title: ALERIN.title }, findings),
      textLen: naskah.length,
      sample: true,
    },
  ];
  s.reviewReady = true;
  s.periksa = { mode: 'bab', chapter: '4', part: '', prep: 'sidang', text: naskah, focus: '', title: ALERIN.title };
  s.guide = {
    view: 'guide',
    part: 'background',
    fields: {
      background: {
        f0: 'Film sebagai media pendidikan seksual pada mahasiswa di Kota Malang',
        f1: 'Mahasiswa banyak mencari informasi kesehatan reproduksi dari film karena topik ini jarang dibahas di rumah.',
        f2: 'Belum diketahui bagaimana mahasiswa memaknai film sebagai sumber pendidikan seksual.',
        f3: '',
      },
    },
    guidance: { background: true },
    saved: { background: addDaysIso(-90) + 'T09:00:00+07:00' },
  };
  s.konteks = {
    chapter: '4',
    method: 'Metode campuran',
    deadline: addDaysIso(150),
    kendala: 'Belum yakin cara melaporkan uji reliabilitas instrumen.',
    title: '',
    savedAt: addDaysIso(-100) + 'T08:30:00+07:00',
  };
  s.target = { date: addDaysIso(10), text: 'Kirim revisi Bab IV ke pembimbing' };
  s.mentorNote = 'Saya masih ragu cara melaporkan hasil uji reliabilitas di Bab IV. Mohon arahan mentor.';
  s.agendas = [
    {
      id: 'ag-sample',
      title: 'Bimbingan: bahas pelaporan reliabilitas',
      date: addDaysIso(4),
      time: '10.00',
      kind: 'user',
      remind: true,
      sample: true,
    },
  ];
  return s;
}
function setHome(patch) {
  S.home = { ...(S.home || {}), ...patch };
}
