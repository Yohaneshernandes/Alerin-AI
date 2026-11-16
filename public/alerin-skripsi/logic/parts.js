'use strict';
/* Struktur Bab I–V dan subbagiannya. */
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
      ['conclusion', 'Kesimpulan', ['Rumusan masalah yang dijawab', 'Temuan Bab IV yang menjawabnya']],
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
const PART_ORDER = CHAPTERS.flatMap(c => c[2].map(p => p[0]));
const partLabel = id => (PARTS[id] ? `Bab ${PARTS[id].roman} · ${PARTS[id].name}` : '');
const partPhase = id => (PARTS[id] ? (PARTS[id].chapter <= 3 ? 1 : 7) : 1);
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
