'use strict';
/* Subbagian skripsi dan susunan babnya (Umum 5 bab atau templat 6 bab dari Konteks Skripsi). */
function detectMethod(text) {
  const t = String(text || '').toLowerCase();
  if (/campuran|mixed|kombinasi|sequential/.test(t)) return 'Metode campuran';
  if (/kuantitatif|survei|survey|kuesioner|regresi|korelasi|eksperimen|statistik/.test(t)) return 'Kuantitatif';
  if (/kualitatif|wawancara|fenomenologi|etnografi|studi kasus|naratif|observasi/.test(t)) return 'Kualitatif';
  if (/r ?& ?d|research and development|pengembangan/.test(t)) return 'Lainnya';
  return 'Belum ditentukan';
}
const CHAPTERS = [
  [
    'I',
    'Pendahuluan',
    [
      ['background', 'Latar Belakang', ['Topik dan objek', 'Fenomena', 'Masalah', 'Data atau referensi|optional']],
      [
        'questions',
        'Rumusan Masalah',
        ['Fokus atau variabel yang ditanyakan', 'Pertanyaan penelitian', 'Batasan pertanyaan|optional'],
      ],
      ['objectives', 'Tujuan Penelitian', ['Rumusan masalah yang dijawab', 'Tujuan untuk tiap rumusan']],
      [
        'benefits',
        'Manfaat Penelitian',
        ['Pihak yang memanfaatkan hasil', 'Manfaat teoretis', 'Manfaat praktis|optional'],
      ],
      ['boundaries', 'Batasan Penelitian', ['Cakupan penelitian', 'Hal di luar cakupan|optional']],
    ],
  ],
  [
    'II',
    'Tinjauan Pustaka',
    [
      ['theory', 'Landasan Teori', ['Konsep atau variabel', 'Teori atau definisi', 'Sumber']],
      [
        'prior',
        'Penelitian Terdahulu',
        ['Artikel yang digunakan', 'Temuan yang dibandingkan', 'Perbedaan dengan penelitianmu|optional'],
      ],
      ['framework', 'Kerangka Berpikir', ['Konsep yang dihubungkan', 'Alur hubungan', 'Dasar teori atau sumber']],
      ['hypothesis', 'Hipotesis', ['Hubungan yang diuji', 'Arah dugaan', 'Dasar dugaan|optional']],
    ],
  ],
  [
    'III',
    'Metode Penelitian',
    [
      ['design', 'Pendekatan dan Desain', ['Pendekatan', 'Desain', 'Alasan memilih pendekatan']],
      ['location', 'Lokasi dan Waktu', ['Lokasi atau kanal', 'Periode', 'Alasan pemilihan|optional']],
      [
        'population',
        'Populasi dan Sampel',
        ['Populasi sasaran', 'Kriteria dan cara memilih responden', 'Jumlah sampel dan dasarnya|optional'],
      ],
      ['participants', 'Informan atau Partisipan', ['Pihak yang dilibatkan', 'Kriteria informan', 'Cara merekrut']],
      [
        'collection',
        'Pengumpulan Data dan Instrumen',
        ['Data yang diperlukan', 'Teknik pengumpulan', 'Instrumen atau panduan'],
      ],
      [
        'quality',
        'Keabsahan Data dan Etika',
        ['Cara memeriksa kualitas data', 'Persetujuan atau izin', 'Perlindungan kerahasiaan'],
      ],
      ['analysis', 'Teknik Analisis', ['Pertanyaan yang dijawab', 'Bentuk data', 'Teknik analisis']],
    ],
  ],
  [
    'IV',
    'Hasil dan Pembahasan',
    [
      [
        'data',
        'Gambaran Data',
        ['Sumber dan periode aktual', 'Jumlah data yang dianalisis', 'Karakteristik informan atau responden'],
      ],
      ['results', 'Hasil', ['Pertanyaan yang dijawab', 'Temuan atau hasil analisis', 'Lokasi bukti']],
      [
        'discussion',
        'Pembahasan',
        ['Temuan yang dibahas', 'Teori atau penelitian pembanding', 'Makna temuan|optional'],
      ],
    ],
  ],
  [
    'V',
    'Penutup',
    [
      ['conclusion', 'Kesimpulan', ['Rumusan masalah yang dijawab', 'Temuan hasil penelitian yang menjawabnya']],
      ['limitations', 'Keterbatasan', ['Keterbatasan yang dialami', 'Dampak terhadap penafsiran']],
      ['recommendations', 'Saran', ['Pihak yang dituju', 'Dasar saran', 'Tindakan yang disarankan|optional']],
    ],
  ],
];
const PARTS = Object.fromEntries(
  CHAPTERS.flatMap((c, i) =>
    c[2].map(p => [p[0], { id: p[0], name: p[1], fields: p[2], chapter: i + 1, roman: c[0], chapterName: c[1] }]),
  ),
);
/* Nama Keabsahan Data dipakai untuk kualitatif; kuantitatif memakai Kualitas Data. */
Object.defineProperty(PARTS.quality, 'name', {
  get: () => (methodKind() === 'kuantitatif' ? 'Kualitas Data dan Etika' : 'Keabsahan Data dan Etika'),
  enumerable: true,
});
const PART_ORDER = CHAPTERS.flatMap(c => c[2].map(p => p[0]));
/* Subbagian proposal (sampai Teknik Analisis) tidak bergantung pada nomor bab. */
const PROPOSAL_PARTS = new Set(CHAPTERS.slice(0, 3).flatMap(c => c[2].map(p => p[0])));
const PART_DEF = Object.fromEntries(CHAPTERS.flatMap(c => c[2].map(p => [p[0], p])));
/* Susunan bab kampus (QC 17 November). Isi subbagian tetap; yang berubah hanya letak babnya. */
const SUSUNAN = {
  umum: {
    label: 'Umum · 5 bab',
    bab: [
      ['Pendahuluan', ['background', 'questions', 'objectives', 'benefits', 'boundaries']],
      ['Tinjauan Pustaka', ['theory', 'prior', 'framework', 'hypothesis']],
      ['Metode Penelitian', ['design', 'location', 'population', 'participants', 'collection', 'quality', 'analysis']],
      ['Hasil dan Pembahasan', ['data', 'results', 'discussion']],
      ['Penutup', ['conclusion', 'limitations', 'recommendations']],
    ],
  },
  hasil6: {
    label: '6 bab · Hasil dan Pembahasan terpisah',
    bab: [
      ['Pendahuluan', ['background', 'questions', 'objectives', 'benefits', 'boundaries']],
      ['Tinjauan Pustaka', ['theory', 'prior', 'framework', 'hypothesis']],
      ['Metode Penelitian', ['design', 'location', 'population', 'participants', 'collection', 'quality', 'analysis']],
      ['Hasil Penelitian', ['data', 'results']],
      ['Pembahasan', ['discussion']],
      ['Penutup', ['conclusion', 'limitations', 'recommendations']],
    ],
  },
  konsep6: {
    label: '6 bab · Kerangka Konseptual terpisah',
    bab: [
      ['Pendahuluan', ['background', 'questions', 'objectives', 'benefits', 'boundaries']],
      ['Tinjauan Pustaka', ['theory', 'prior']],
      ['Kerangka Konseptual dan Hipotesis', ['framework', 'hypothesis']],
      ['Metode Penelitian', ['design', 'location', 'population', 'participants', 'collection', 'quality', 'analysis']],
      ['Hasil dan Pembahasan', ['data', 'results', 'discussion']],
      ['Penutup', ['conclusion', 'limitations', 'recommendations']],
    ],
  },
};
const ROMAWI = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const susunanId = () => (SUSUNAN[S?.konteks?.susunan] ? S.konteks.susunan : 'umum');
/* Menata ulang CHAPTERS dan nomor bab setiap subbagian sesuai susunan yang dipilih. Dipanggil setiap render. */
function applySusunan() {
  const sus = SUSUNAN[susunanId()],
    noHyp = typeof S !== 'undefined' && methodKind() === 'kualitatif';
  const next = sus.bab.map(([name, ids], i) => [
    ROMAWI[i],
    name === 'Kerangka Konseptual dan Hipotesis' && noHyp ? 'Kerangka Konseptual' : name,
    ids.map(id => PART_DEF[id]),
  ]);
  CHAPTERS.length = 0;
  CHAPTERS.push(...next);
  CHAPTERS.forEach((c, i) =>
    c[2].forEach(d => Object.assign(PARTS[d[0]], { chapter: i + 1, roman: c[0], chapterName: c[1] })),
  );
}
/* Bab yang termasuk proposal (seluruh subbagiannya subbagian proposal). */
const proposalChapters = () => CHAPTERS.map((c, i) => i + 1).filter(n => CHAPTERS[n - 1][2].every(d => PROPOSAL_PARTS.has(d[0])));
const lastRoman = () => CHAPTERS[CHAPTERS.length - 1][0];
const proposalRoman = () => CHAPTERS[proposalChapters().slice(-1)[0] - 1][0];
const partLabel = id => (PARTS[id] ? `Bab ${PARTS[id].roman} · ${PARTS[id].name}` : '');
const partPhase = id => (PARTS[id] ? (PROPOSAL_PARTS.has(id) ? 1 : 7) : 1);
function methodKind() {
  const m = (S.profile.method || S.review?.method || detectMethod(S.draft?.idea || '') || '').toLowerCase();
  return /campuran|mixed/.test(m)
    ? 'campuran'
    : /kuantitatif/.test(m)
      ? 'kuantitatif'
      : /kualitatif/.test(m)
        ? 'kualitatif'
        : '';
}
/* Metode dari Konteks menjadi acuan rancangan, outline, dan opsi judul. Isian ide hanya cadangan. */
function konteksMethodLabel() {
  const m = (S.konteks?.method || S.profile?.method || '').toLowerCase();
  if (/r&d|pengembangan/.test(m)) return 'R&D';
  if (/campuran|mixed/.test(m)) return 'Metode campuran';
  if (/kuantitatif/.test(m)) return 'Kuantitatif';
  if (/kualitatif/.test(m)) return 'Kualitatif';
  return detectMethod(S.draft?.idea || '') === 'Lainnya' ? 'R&D' : detectMethod(S.draft?.idea || '');
}
function partApplies(id) {
  const k = methodKind();
  if (id === 'hypothesis') return k === 'kuantitatif' || k === 'campuran';
  if (id === 'population') return k !== 'kualitatif';
  if (id === 'participants') return k !== 'kuantitatif';
  return true;
}
const STEP_BY_PART = {
  questions: 'Tulis ulang rumusan masalah agar menyebut subjek, fenomena, dan fokus yang diteliti.',
  background: 'Susun ulang latar belakang: fenomena, data pendukung, lalu masalah yang diteliti.',
  objectives: 'Buat satu tujuan untuk setiap rumusan masalah.',
  benefits: 'Pisahkan manfaat teoretis dan praktis, lalu sebut pihak yang memakai hasilnya.',
  boundaries: 'Tuliskan cakupan penelitian dan hal yang tidak dibahas.',
  theory: 'Lengkapi definisi konsep dengan sumber yang bisa ditelusuri.',
  prior: 'Tambahkan penelitian terdahulu yang relevan, lalu jelaskan perbedaannya.',
  framework: 'Gambarkan alur hubungan konsep dengan dasar teorinya.',
  hypothesis: 'Tuliskan hipotesis dari kerangka berpikir dan arah dugaannya.',
  design: 'Jelaskan pendekatan dan desain, serta alasan memilihnya.',
  location: 'Tuliskan lokasi, periode, dan alasan pemilihannya.',
  population: 'Jelaskan populasi, kriteria, dan cara memilih sampel.',
  participants: 'Jelaskan kriteria informan dan cara merekrutnya.',
  quality: 'Jelaskan cara menjaga kualitas data dan izin penelitian.',
  collection: 'Cocokkan instrumen dengan data yang dibutuhkan setiap rumusan masalah.',
  analysis: 'Cocokkan teknik analisis dengan pertanyaan dan bentuk data.',
  data: 'Tuliskan sumber, periode, dan jumlah data yang benar-benar dianalisis.',
  results: 'Petakan setiap hasil ke pertanyaan penelitian dan lokasi buktinya.',
  discussion: 'Hubungkan temuan dengan teori dan penelitian terdahulu.',
  conclusion: 'Jawab setiap rumusan masalah dengan satu poin kesimpulan.',
  limitations: 'Tuliskan keterbatasan yang benar-benar terjadi dan dampaknya.',
  recommendations: 'Turunkan saran dari temuan dan keterbatasan.',
};
function splitTheoryMethod(text) {
  const parts = String(text || '')
      .split(/[;,\n]+/)
      .map(x => x.trim())
      .filter(Boolean),
    re =
      /kualitatif|kuantitatif|campuran|mixed|r&d|wawancara|kuesioner|angket|observasi|regresi|survei|eksperimen|studi kasus|etnografi|fenomenologi/i;
  return { method: parts.filter(p => re.test(p)).join('; '), theory: parts.filter(p => !re.test(p)).join('; ') };
}
function partStatus(id) {
  const t = S.tasks.find(x => x.part === id);
  if (t?.status === 'done') return ['done', 'Selesai'];
  if (t) return ['work', 'Di Progres Aktif'];
  if (S.guide.saved[id]) return ['saved', 'Tersimpan'];
  return ['', ''];
}
function nextPart(id) {
  const list = PART_ORDER.filter(partApplies);
  const i = list.indexOf(id);
  return list[i + 1] || null;
}
function partFilled(id) {
  const p = PARTS[id],
    v = S.guide?.fields?.[id] || {};
  const req = p.fields.map((f, i) => [f, i]).filter(([f]) => !f.includes('|optional'));
  const kosong = req.filter(([, i]) => !String(v['f' + i] || '').trim());
  const empty = kosong.map(([f]) => f.split('|')[0]);
  const text = req.map(([, i]) => v['f' + i] || '').join(' ');
  return {
    empty,
    emptyIdx: kosong.map(([, i]) => i),
    ok: !empty.length && text.replace(/\s/g, '').length >= 20 && !isAsal(text),
  };
}
