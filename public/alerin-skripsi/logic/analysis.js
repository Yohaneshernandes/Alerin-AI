'use strict';
/* Pembacaan arahan dosen dan aturan pemeriksaan naskah (contoh, belum AI). */
const ARAHAN_MAP = [
  [/rumusan/i, 'questions'],
  [/latar/i, 'background'],
  [/tujuan/i, 'objectives'],
  [/manfaat/i, 'benefits'],
  [/batasan/i, 'boundaries'],
  [/terdahulu|jurnal|artikel|studi lain/i, 'prior'],
  [/kerangka/i, 'framework'],
  [/hipotesis/i, 'hypothesis'],
  [/teori|konsep|kajian|pustaka(?! daftar)/i, 'theory'],
  [/pendekatan|desain|metode/i, 'design'],
  [/lokasi|waktu penelitian/i, 'location'],
  [/sampel|populasi|responden/i, 'population'],
  [/informan|partisipan/i, 'participants'],
  [/reliabilitas|validitas|keabsahan|etika|izin/i, 'quality'],
  [/instrumen|kuesioner|angket|wawancara|observasi/i, 'collection'],
  [/analisis|olah data|regresi|statistik/i, 'analysis'],
  [/gambaran data|karakteristik/i, 'data'],
  [/hasil/i, 'results'],
  [/pembahasan/i, 'discussion'],
  [/kesimpulan|simpulan/i, 'conclusion'],
  [/keterbatasan/i, 'limitations'],
  [/saran/i, 'recommendations'],
];
function analyzeArahan(text) {
  const t = String(text || '').trim(),
    parts = [];
  for (const [re, id] of ARAHAN_MAP) if (re.test(t) && !parts.includes(id)) parts.push(id);
  if (!parts.length) parts.push('background');
  const first = t.split(/(?<=[.!?])\s+/)[0].replace(/[.!?]+$/, '');
  const inti = first.length > 150 ? first.slice(0, 147) + '…' : first;
  const bagian = parts.slice(0, 3).map(partLabel).join(' dan ');
  let langkah =
    parts.length >= 2 && parts.includes('questions') && parts.includes('conclusion')
      ? 'Cocokkan tiap rumusan masalah dengan satu poin kesimpulan, dengan urutan yang sama.'
      : parts
          .slice(0, 2)
          .map(p => STEP_BY_PART[p])
          .join(' ');
  return { part: parts[0], parts, bagian, maksud: maksudArahan(inti, bagian), langkah };
}
/* Kata perintah yang sering dipakai dosen, beserta bentuk aktifnya. */
const KATA_PERINTAH = {
  samakan: 'menyamakan', perbaiki: 'memperbaiki', tambahkan: 'menambahkan', tambah: 'menambah', ganti: 'mengganti',
  hapus: 'menghapus', jelaskan: 'menjelaskan', pisahkan: 'memisahkan', cek: 'mengecek', periksa: 'memeriksa',
  revisi: 'merevisi', lengkapi: 'melengkapi', gunakan: 'menggunakan', pakai: 'memakai', buat: 'membuat',
  perjelas: 'memperjelas', tulis: 'menulis', cantumkan: 'mencantumkan', ubah: 'mengubah', sesuaikan: 'menyesuaikan',
  kurangi: 'mengurangi', rapikan: 'merapikan', pastikan: 'memastikan', baca: 'membaca', tinjau: 'meninjau',
  susun: 'menyusun', batasi: 'membatasi', fokuskan: 'memfokuskan', uraikan: 'menguraikan', perdalam: 'memperdalam',
  persempit: 'mempersempit', perluas: 'memperluas', sertakan: 'menyertakan', bandingkan: 'membandingkan',
  cocokkan: 'mencocokkan', tegaskan: 'menegaskan', jabarkan: 'menjabarkan', kutip: 'mengutip', rujuk: 'merujuk',
  perbarui: 'memperbarui', lampirkan: 'melampirkan', hilangkan: 'menghilangkan', buang: 'membuang',
  masukkan: 'memasukkan', pindahkan: 'memindahkan', ringkas: 'meringkas', analisis: 'menganalisis',
  tafsirkan: 'menafsirkan', bahas: 'membahas', tunjukkan: 'menunjukkan', sebutkan: 'menyebutkan', ikuti: 'mengikuti',
  cari: 'mencari', tentukan: 'menentukan', pilih: 'memilih', rumuskan: 'merumuskan', lakukan: 'melakukan',
  selesaikan: 'menyelesaikan', siapkan: 'menyiapkan', hitung: 'menghitung', uji: 'menguji', ulangi: 'mengulangi',
  koreksi: 'mengoreksi', sederhanakan: 'menyederhanakan', kaitkan: 'mengaitkan', hubungkan: 'menghubungkan',
  konsistenkan: 'membuat konsisten', perkuat: 'memperkuat', tampilkan: 'menampilkan', laporkan: 'melaporkan',
};
/* Pemahaman awal: perintah dosen diubah menjadi kalimat "Dosen meminta kamu …". Contoh, belum analisis AI. */
function maksudArahan(inti, bagian) {
  const clean = inti.replace(/^(tolong|mohon|coba|harap|silakan|sebaiknya)\s+/i, '').trim();
  const [w, ...rest] = clean.split(/\s+/);
  const verb = KATA_PERINTAH[(w || '').toLowerCase().replace(/[^a-z]/g, '')];
  const sebutBab = /\b(di|pada|dalam)\s+(bab|bagian|sub)/i.test(clean);
  const tempat = sebutBab ? '' : `, terutama di bagian ${bagian}`;
  const lanjut = rest
    .join(' ')
    .replace(/\b(dan|lalu|kemudian|serta|juga)\s+([a-z]+)\b/gi, (m, kata, v) => (KATA_PERINTAH[v.toLowerCase()] ? `${kata} ${KATA_PERINTAH[v.toLowerCase()]}` : m));
  if (verb) return `Dosen meminta kamu ${verb}${lanjut ? ' ' + lanjut : ''}${tempat}.`;
  const kecil = clean.charAt(0).toLowerCase() + clean.slice(1);
  return `Dosen memberi catatan bahwa ${kecil}. Alerin membacanya sebagai permintaan untuk memperbaiki ${bagian}.`;
}
const SECTION_RE = {
  background: /latar belakang/i,
  questions: /rumusan masalah/i,
  objectives: /tujuan penelitian/i,
  benefits: /manfaat penelitian/i,
  boundaries: /batasan (penelitian|masalah)|ruang lingkup/i,
  theory: /landasan teori|kajian teori|tinjauan teori|kajian pustaka/i,
  prior: /penelitian terdahulu|kajian terdahulu/i,
  framework: /kerangka (berpikir|pemikiran|konseptual)/i,
  hypothesis: /hipotesis/i,
  design: /pendekatan|desain penelitian|jenis penelitian/i,
  location: /lokasi|tempat dan waktu/i,
  population: /populasi|sampel/i,
  participants: /informan|subjek penelitian|partisipan/i,
  collection: /teknik pengumpulan data|instrumen/i,
  quality: /keabsahan|validitas|reliabilitas|triangulasi/i,
  analysis: /teknik analisis|analisis data/i,
  data: /gambaran (umum|data)|karakteristik (informan|responden)/i,
  results: /hasil penelitian/i,
  discussion: /pembahasan/i,
  conclusion: /kesimpulan|simpulan/i,
  limitations: /keterbatasan/i,
  recommendations: /saran/i,
};
function snippet(text, idx, len = 90) {
  const s = Math.max(0, idx - 30);
  return (
    '“…' +
    text
      .slice(s, s + len)
      .replace(/\s+/g, ' ')
      .trim() +
    '…”'
  );
}
function findIssues(text, ctx) {
  const out = [],
    add = o => out.push({ id: 'f-' + Math.random().toString(36).slice(2, 9), severity: 'perlu', ...o });
  const t = text || '',
    low = t.toLowerCase(),
    year = new Date().getFullYear(),
    chapters = ctx.chapters;
  if (t.trim()) {
    if (t.length >= 1500)
      for (const n of chapters) {
        const c = CHAPTERS[n - 1];
        for (const [id, name] of c[2]) {
          if (!partApplies(id) || ['boundaries', 'hypothesis', 'limitations'].includes(id)) continue;
          if (!SECTION_RE[id].test(t))
            add({
              title: `Bagian ${name} belum ditemukan`,
              location: `Bab ${c[0]} · ${c[1]}`,
              why: `Bab ${c[0]} umumnya memuat ${name.toLowerCase()}. Alerin tidak menemukan judul bagian ini di naskahmu.`,
              fix: `Tambahkan subbagian ${name}, atau abaikan temuan ini bila pedoman kampusmu memakai nama lain.`,
              part: id,
            });
        }
      }
    const fy = [...t.matchAll(/\b(20\d\d)\b/g)].find(m => +m[1] > year);
    if (fy)
      add({
        title: `Periksa sumber data: tahun ${fy[1]} belum terjadi`,
        location: snippet(t, fy.index),
        why: `Tahun ${fy[1]} lebih besar dari tahun berjalan. Data atau kutipan dengan tahun ini tidak mungkin sudah terbit.`,
        fix: 'Periksa ulang tahun sumber. Bila salah ketik, perbaiki. Bila itu proyeksi, tulis jelas sebagai proyeksi beserta sumbernya.',
        part: 'background',
        severity: 'kritis',
      });
    const kualNaskah = /kualitatif/i.test(t),
      kual = kualNaskah || ctx.method === 'kualitatif',
      quan = /regresi|uji t\b|anova|korelasi pearson|uji f\b|statistik inferensial/i.exec(t);
    if (kual && quan && !/campuran|mixed method/i.test(t))
      add({
        title: 'Metode tidak konsisten',
        location: snippet(t, quan.index),
        why: `${kualNaskah ? 'Naskah menyebut pendekatan kualitatif' : 'Konteks skripsimu memakai metode kualitatif'}, tetapi naskah juga memakai ${quan[0].toLowerCase()} yang lazim untuk data kuantitatif.`,
        fix: 'Pilih satu pendekatan yang menjawab rumusan masalah, lalu samakan teknik analisis di Bab III. Bila memang metode campuran, sebutkan dan jelaskan urutannya.',
        part: 'analysis',
        severity: 'kritis',
      });
    const rm = /rumusan masalah/i.exec(t);
    const umum = /\b(bagaimana|apakah|apa|mengapa)\s+(?:[^\s?.]+\s+){0,3}(tersebut|itu|ini)\s*\?/i.exec(t);
    if (umum && !(rm && /bagaimana (gambaran|pengaruh) .{0,25}\?|apa saja .{0,20}\?/i.test(t.slice(rm.index, rm.index + 700))))
      add({
        title: 'Rumusan masalah masih terlalu umum',
        location: snippet(t, umum.index),
        why: `Pertanyaan “${umum[0].trim()}” belum menyebut subjek, lokasi, atau fokus yang diteliti.`,
        fix: 'Ganti kata penunjuk seperti “tersebut” dengan subjek dan fokus yang jelas, lalu pastikan tiap pertanyaan punya satu tujuan penelitian.',
        part: 'questions',
      });
    else if (rm) {
      const seg = t.slice(rm.index, rm.index + 700),
        qs = seg.split('?').length - 1;
      if (qs === 0)
        add({
          title: 'Rumusan masalah belum berbentuk pertanyaan',
          location: 'Bab I · Rumusan Masalah',
          why: 'Alerin tidak menemukan kalimat tanya setelah judul Rumusan Masalah.',
          fix: 'Tulis rumusan masalah sebagai pertanyaan yang menyebut subjek, fenomena, dan fokus penelitian.',
          part: 'questions',
        });
      else if (/bagaimana (gambaran|pengaruh) .{0,25}\?/i.test(seg) || /apa saja .{0,20}\?/i.test(seg))
        add({
          title: 'Rumusan masalah masih terlalu umum',
          location: snippet(seg, seg.search(/bagaimana|apa saja/i)),
          why: 'Pertanyaan belum menyebut subjek, lokasi, atau fokus yang membatasi penelitian.',
          fix: 'Tambahkan subjek dan fokus yang diteliti, lalu pastikan tiap pertanyaan punya satu tujuan penelitian.',
          part: 'questions',
        });
    }
    const claim =
      /(data menunjukkan|sebanyak \d+[.,]?\d*\s?%|\d+[.,]?\d*\s?persen|menurut (survei|data|laporan))/i.exec(t);
    if (claim) {
      const near = t.slice(claim.index, claim.index + 260);
      if (!/\([A-Z][^()]{1,60},? ?\d{4}[a-z]?\)|\[\d+\]/.test(near))
        add({
          title: 'Klaim belum disertai sumber',
          location: snippet(t, claim.index),
          why: 'Kalimat ini memuat data atau angka, tetapi Alerin tidak menemukan sitasi di dekatnya.',
          fix: 'Tambahkan sumber yang bisa ditelusuri (nama penulis dan tahun), lalu masukkan ke Daftar Pustaka.',
          part: 'background',
        });
    }
    if (/0[,.]852/.test(t) && /0[,.]098|r tabel/i.test(t))
      add({
        title: 'Penafsiran reliabilitas perlu ditinjau',
        location: snippet(t, t.search(/0[,.]852/)),
        why: 'Nilai alpha 0,852 dibandingkan dengan r tabel 0,098. Keduanya dasar penilaian yang berbeda, dan alpha tidak menunjukkan validitas.',
        fix: 'Gunakan kriteria interpretasi alpha dari rujukan yang jelas, pisahkan penjelasan validitas dan reliabilitas, lalu cocokkan dengan output pengujian.',
        part: 'quality',
        severity: 'kritis',
      });
    if (ctx.title && t.length >= 1500) {
      const words = ctx.title
        .toLowerCase()
        .split(/\W+/)
        .filter(w => w.length > 4 && !LOWER_WORDS.has(w));
      const miss = words.filter(w => !low.includes(w));
      if (words.length >= 3 && miss.length / words.length > 0.5)
        add({
          title: 'Judul dan isi naskah belum selaras',
          location: 'Judul · ' + ctx.title,
          why: `Beberapa kata kunci judul (${miss.slice(0, 3).join(', ')}) tidak muncul di naskah yang diperiksa.`,
          fix: 'Samakan istilah di judul dengan istilah di naskah, atau sesuaikan judul dengan fokus yang benar-benar kamu teliti.',
          part: 'background',
        });
    }
    if (ctx.prep && !/daftar pustaka/i.test(t))
      add({
        title: 'Daftar pustaka belum ditemukan',
        location: 'Akhir naskah',
        why: 'Naskah untuk seminar atau sidang perlu memuat daftar pustaka.',
        fix: 'Tambahkan daftar pustaka dan pastikan semua kutipan di naskah tercantum di sana.',
        part: 'theory',
      });
  }
  if (ctx.titleOnly || (!t.trim() && ctx.title)) {
    const w = ctx.title.split(/\s+/);
    if (w.length > 20)
      add({
        title: 'Judul terlalu panjang',
        location: 'Judul',
        why: `Judul terdiri dari ${w.length} kata, sehingga fokusnya sulit ditangkap.`,
        fix: 'Ringkas judul menjadi 12–20 kata dengan tetap menyebut fokus, subjek, dan lokasi.',
        part: 'background',
      });
    if (!/(di|pada|bagi|terhadap) [A-Z]|mahasiswa|siswa|masyarakat|pegawai|guru|remaja|kota|kabupaten/i.test(ctx.title))
      add({
        title: 'Subjek atau lokasi belum tampak di judul',
        location: 'Judul',
        why: 'Judul belum menyebut siapa atau di mana penelitian dilakukan.',
        fix: 'Tambahkan subjek atau lokasi penelitian, misalnya “pada mahasiswa di Kota Malang”.',
        part: 'background',
      });
    if (/\b(\w+) \1\b/i.test(ctx.title))
      add({
        title: 'Ada kata yang ditulis dua kali',
        location: 'Judul',
        why: 'Pengulangan kata membuat judul terlihat belum rapi.',
        fix: 'Hapus kata yang berulang.',
        part: 'background',
      });
  }
  return out.sort((a, b) => (a.severity === 'kritis' ? 0 : 1) - (b.severity === 'kritis' ? 0 : 1));
}
/* Hal yang sudah kuat menurut aturan contoh. Dipakai di hasil pemeriksaan, berdampingan dengan temuan. */
function findStrengths(text, ctx, findings) {
  const out = [],
    t = text || '',
    has = title => findings.some(f => f.title.startsWith(title));
  if (ctx.titleOnly || (!t.trim() && ctx.title)) {
    const n = (ctx.title || '').split(/\s+/).filter(Boolean).length;
    if (n >= 8 && n <= 20) out.push(['Panjang judul sudah wajar', `Judul terdiri dari ${n} kata.`]);
    if (!has('Subjek atau lokasi')) out.push(['Judul menyebut subjek atau lokasi', 'Pembaca langsung tahu siapa atau di mana penelitian dilakukan.']);
    return out;
  }
  if (!t.trim()) return out;
  const bagian = Object.entries(SECTION_RE)
    .filter(([id, re]) => PARTS[id] && re.test(t))
    .map(([id]) => PARTS[id].name);
  if (bagian.length) out.push(['Subbagian sudah terbaca', bagian.slice(0, 6).join(', ') + (bagian.length > 6 ? ', dan lainnya' : '') + '.']);
  const sitasi = (t.match(/\([A-Z][^()]{1,60},? ?\d{4}[a-z]?\)|\[\d+\]/g) || []).length;
  if (sitasi) out.push(['Ada sitasi yang bisa ditelusuri', `${sitasi} sitasi ditemukan di naskah.`]);
  if (/rumusan masalah/i.test(t) && /\?/.test(t) && !has('Rumusan masalah'))
    out.push(['Rumusan masalah berbentuk pertanyaan', 'Pertanyaan penelitian sudah ditulis sebagai kalimat tanya.']);
  if (/kualitatif|kuantitatif|campuran/i.test(t) && !has('Metode tidak konsisten'))
    out.push(['Pendekatan penelitian disebut jelas', 'Naskah menyebut pendekatan yang dipakai dan tidak bertentangan dengan teknik analisisnya.']);
  if (!has('Periksa sumber data') && /\b(19|20)\d\d\b/.test(t))
    out.push(['Tahun data masuk akal', 'Tidak ada tahun yang melebihi tahun berjalan.']);
  return out;
}
