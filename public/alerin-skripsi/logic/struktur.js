'use strict';
/* Lihat Saran Alerin: struktur poin pembahasan per subbagian. Metode mengikuti Konteks; variabel dibaca dari judul. */
const ANGKA_KE = ['', 'satu', 'kedua', 'ketiga', 'keempat', 'kelima'];
const Y_CORES = [
  'keputusan pembelian',
  'minat beli ulang',
  'minat beli',
  'niat beli',
  'loyalitas pelanggan',
  'loyalitas konsumen',
  'kepuasan pelanggan',
  'kepuasan konsumen',
  'kepuasan kerja',
  'kinerja karyawan',
  'kinerja pegawai',
  'prestasi belajar',
  'hasil belajar',
  'motivasi belajar',
  'minat belajar',
  'kualitas layanan',
];
/* Huruf kecil untuk kalimat, kecuali singkatan seperti UMKM atau SPSS. */
const joinDan = arr => (arr.length === 2 ? arr.join(' dan ') : joinList(arr, ', ', ', dan '));
const lowWords = s =>
  String(s || '')
    .split(' ')
    .map(w => (/^[A-Z0-9]{2,}$/.test(w) ? w : w.toLowerCase()))
    .join(' ');
function strukturKind() {
  const m = (ensureKonteks().method || S.profile.method || '').toLowerCase();
  if (/r&d|pengembangan/.test(m)) return 'rnd';
  return methodKind();
}
function researchCtx() {
  const title = trimDot(S.title || ensureKonteks().title || ''),
    d = S.draft || {};
  let xs = [],
    y = '',
    obj = '';
  const m = title.match(
    /^(?:analisis\s+)?(?:pengaruh|hubungan|dampak|kontribusi)\s+(.+?)\s+(?:terhadap|dengan)\s+(.+?)(?:\s+(?:pada|di|dalam|bagi|studi)\s+(.+))?$/i,
  );
  if (m) {
    xs = m[1]
      .split(/\s*,\s*(?:dan\s+)?|\s+dan\s+|\s+serta\s+/i)
      .map(x => x.trim())
      .filter(Boolean);
    y = m[2].trim();
    obj = (m[3] || '').trim();
    if (xs.length > 5) xs = [];
  }
  const yl = lowWords(y);
  const core = Y_CORES.find(c => yl.startsWith(c));
  let yCore = y,
    ranah = '';
  if (core) {
    yCore = y.split(' ').slice(0, core.split(' ').length).join(' ');
    ranah = y
      .split(' ')
      .slice(core.split(' ').length)
      .join(' ')
      .replace(/^produk\s+/i, '');
  } else {
    const pm = y.match(/^(.+?)\s+produk\s+(.+)$/i);
    if (pm) {
      yCore = pm[1];
      ranah = pm[2];
    }
  }
  const all = (title + ' ' + (d.topic || '') + ' ' + (d.location || '')).toLowerCase();
  const subj = /konsumen|pembelian|pelanggan|merek|brand|produk|\bbeli\b/.test(all)
    ? 'konsumen'
    : /mahasiswa/.test(all)
      ? 'mahasiswa'
      : /siswa|belajar|sekolah/.test(all)
        ? 'siswa'
        : /karyawan|pegawai|kinerja/.test(all)
          ? 'karyawan'
          : /guru/.test(all)
            ? 'guru'
            : /umkm|pelaku usaha/.test(all)
              ? 'pelaku usaha'
              : /masyarakat|warga/.test(all)
                ? 'masyarakat'
                : 'responden';
  /* Ranah yang sama dengan subjek (mis. "Prestasi Belajar Siswa") tidak diulang. Nama lembaga (PT, SMA, CV) tetap kapital. */
  if (/^(siswa|mahasiswa|karyawan|pegawai|konsumen|pelanggan|guru|masyarakat)$/i.test(ranah.trim())) ranah = '';
  const proper = /\b(PT|CV|UD|SMA|SMK|SMP|SD|MTs|MA|RS|RSUD|UMKM|Universitas|Kota|Kabupaten)\b/.test(ranah) || ranah.split(' ').length > 2;
  const ranahL = proper ? ranah : lowWords(ranah);
  const partyNouns = {
    konsumen: [`pelaku usaha${ranahL ? ' ' + ranahL : ''}`, 'pengelola pemasaran'],
    siswa: ['sekolah dan guru', 'siswa'],
    mahasiswa: ['perguruan tinggi', 'mahasiswa'],
    karyawan: ['organisasi atau perusahaan', 'pengelola sumber daya manusia'],
    guru: ['sekolah', 'guru'],
  }[subj] || ['pihak terkait', 'pengambil kebijakan'];
  const parties = partyNouns.map(x => 'Bagi ' + x);
  const fokus = lowWords(trimDot(d.topic || '')) || (title ? lowWords(title) : 'fokus penelitian');
  return {
    title,
    xs,
    y,
    yL: (lowWords(yCore) || 'variabel terikat') + (ranahL ? ' ' + ranahL : ''),
    yCore: yCore || 'Variabel Terikat',
    yCoreL: lowWords(yCore) || 'variabel terikat',
    obj,
    ranahL,
    subj,
    subjFull: subj + (ranahL ? ' ' + ranahL : ''),
    konsumen: subj === 'konsumen',
    parties,
    partyNouns,
    fokus,
    n: xs.length,
    nKe: ANGKA_KE[xs.length] || 'seluruh',
    joinX: xs.length ? joinDan(xs) : 'variabel bebas',
    labels: xs.length ? [...xs.map((x, i) => 'X' + (xs.length > 1 ? i + 1 : '')), 'Y'] : ['X', 'Y'],
    labelsXY: xs.length ? joinDan([...xs.map((x, i) => 'X' + (xs.length > 1 ? i + 1 : '')), 'Y']) : 'X dan Y',
  };
}
/* Label variabel bebas: (X1), (X2) bila lebih dari satu. */
const xTag = (c, i) => (c.n > 1 ? 'X' + (i + 1) : 'X');
const biblioCount = () => (S.biblio?.items || []).length;
const partHasText = id =>
  Object.values(S.guide?.fields?.[id] || {}).some(v => String(v || '').replace(/\s/g, '').length >= 5);
/* Gambaran tiap variabel bebas untuk kalimat poin (contoh Output Alerin Skripsi). Variabel lain memakai kalimat umum. */
const VAR_HINTS = [
  [/social media marketing|pemasaran media sosial|media sosial/, { peran: 'Peran konten pemasaran, promosi digital, dan interaksi merek dengan konsumen.', indo: 'pemasaran media sosial', bidang: 'pemasaran digital', alur: 'pemasaran melalui media sosial', evaluasi: ['konten', 'interaksi media sosial'], aspek: 'konten', digital: true, media: true }],
  [/brand image|citra merek/, { peran: 'Peran citra merek, reputasi, dan persepsi konsumen terhadap produk {ranah}.', indo: 'citra merek', bidang: 'citra merek', teori: 'serta kaitannya dengan persepsi konsumen terhadap merek {ranah}', alur: 'persepsi terhadap merek', konteks: 'persepsi konsumen terhadap merek {ranah}', aspek: 'interaksi merek' }],
  [/electronic word of mouth|e-?wom|word of mouth|online customer review|ulasan/, { peran: 'Peran ulasan online, komentar, pengalaman pengguna, dan rekomendasi digital.', indo: 'komunikasi dari mulut ke mulut secara elektronik', bidang: 'komunikasi konsumen', teori: 'dalam konteks informasi atau pengalaman konsumen secara daring', alur: 'informasi dan pengalaman konsumen secara daring', konteks: 'informasi, ulasan, atau pengalaman konsumen secara daring', evaluasi: ['pengelolaan ulasan konsumen'], aspek: 'pengelolaan ulasan', digital: true }],
  [/kualitas produk|product quality/, { peran: 'Peran mutu, fungsi, dan daya tahan produk menurut konsumen.', indo: 'kualitas produk', bidang: 'kualitas produk', alur: 'mutu produk yang dirasakan', konteks: 'mutu produk yang dirasakan konsumen', evaluasi: ['mutu produk'], aspek: 'mutu produk' }],
  [/harga|price/, { peran: 'Peran kesesuaian harga dengan manfaat dan daya beli konsumen.', indo: 'harga', bidang: 'penetapan harga', alur: 'persepsi harga', konteks: 'persepsi harga dan nilai yang diterima konsumen', evaluasi: ['kebijakan harga'], aspek: 'harga' }],
  [/promosi|promotion/, { peran: 'Peran kegiatan promosi dalam menarik perhatian dan minat konsumen.', indo: 'promosi', bidang: 'komunikasi pemasaran', alur: 'kegiatan promosi', konteks: 'kegiatan promosi yang diterima konsumen', evaluasi: ['program promosi'], aspek: 'promosi' }],
  [/kualitas pelayanan|kualitas layanan|service quality/, { peran: 'Peran keandalan, ketanggapan, dan sikap petugas dalam melayani.', indo: 'kualitas pelayanan', bidang: 'kualitas layanan', alur: 'pengalaman pelayanan', konteks: 'pengalaman pelayanan yang diterima', evaluasi: ['standar pelayanan'], aspek: 'pelayanan' }],
  [/kepercayaan|trust/, { peran: 'Peran keyakinan konsumen terhadap kejujuran dan kemampuan penyedia.', indo: 'kepercayaan', bidang: 'kepercayaan konsumen', alur: 'kepercayaan konsumen', konteks: 'kepercayaan konsumen terhadap penyedia', evaluasi: ['upaya membangun kepercayaan'], aspek: 'kepercayaan' }],
  [/influencer|endorser|selebgram/, { peran: 'Peran tokoh yang dipercaya dalam memperkenalkan dan merekomendasikan produk.', indo: 'pemasaran melalui influencer', bidang: 'pemasaran influencer', alur: 'rekomendasi influencer', konteks: 'rekomendasi tokoh yang diikuti konsumen', evaluasi: ['kerja sama influencer'], aspek: 'kerja sama influencer', digital: true, media: true }],
  [/lingkungan kerja/, { peran: 'Peran kondisi fisik dan hubungan kerja di tempat kerja.', indo: 'lingkungan kerja', bidang: 'lingkungan kerja', alur: 'kondisi lingkungan kerja', konteks: 'kondisi tempat kerja yang dirasakan karyawan', evaluasi: ['kondisi tempat kerja'], aspek: 'lingkungan kerja' }],
  [/motivasi/, { peran: 'Peran dorongan dari dalam dan luar diri dalam menjalankan kegiatan.', indo: 'motivasi', bidang: 'motivasi', alur: 'dorongan atau motivasi', konteks: 'dorongan yang dirasakan responden', evaluasi: ['program penguatan motivasi'], aspek: 'motivasi' }],
  [/disiplin/, { peran: 'Peran ketaatan terhadap aturan dan jadwal yang berlaku.', indo: 'disiplin', bidang: 'disiplin', alur: 'ketaatan terhadap aturan', konteks: 'ketaatan responden terhadap aturan', evaluasi: ['penegakan disiplin'], aspek: 'disiplin' }],
  [/kompensasi|gaji|insentif/, { peran: 'Peran imbalan finansial dan nonfinansial yang diterima.', indo: 'kompensasi', bidang: 'pengelolaan kompensasi', alur: 'imbalan yang diterima', konteks: 'imbalan yang dirasakan adil atau tidak', evaluasi: ['sistem kompensasi'], aspek: 'kompensasi' }],
  [/kepemimpinan|leadership/, { peran: 'Peran cara pemimpin mengarahkan dan mendukung anggota.', indo: 'gaya kepemimpinan', bidang: 'kepemimpinan', alur: 'cara pemimpin mengarahkan', konteks: 'cara pemimpin mengarahkan anggota', evaluasi: ['praktik kepemimpinan'], aspek: 'kepemimpinan' }],
];
function varHint(x, c) {
  const xl = lowWords(x),
    f = (VAR_HINTS.find(([re]) => re.test(xl)) || [null, {}])[1];
  const r = s => (s || '').replace(/\{ranah\}/g, c.ranahL || 'yang diteliti').replace(/\s+yang diteliti\b/, ' yang diteliti');
  return {
    peran: r(f.peran) || `Peran ${x} dalam kaitannya dengan ${c.yCoreL}.`,
    indo: f.indo || xl,
    bidang: f.bidang || xl,
    teori: r(f.teori),
    alur: f.alur || xl,
    konteks: r(f.konteks),
    evaluasi: f.evaluasi || [],
    aspek: f.aspek || xl,
    digital: !!f.digital,
    media: !!f.media,
  };
}
const joinAtau = arr => (arr.length <= 1 ? arr[0] || '' : arr.length === 2 ? arr.join(' atau ') : arr.slice(0, -1).join(', ') + ', atau ' + arr[arr.length - 1]);
/* Aturan di bawah tabel Bab IV (contoh Output Alerin Skripsi). */
const BAB4_FOOT = 'Contoh struktur dapat dilihat sebelum data tersedia, tetapi isi hasil penelitian hanya dikembangkan dari data atau keluaran analisis yang <strong>benar-benar ditambahkan</strong>.';
/* Template kuantitatif mengikuti dokumen "Output Alerin Skripsi" (contoh skincare, 20 subbagian). */
function strukturKuantitatif(id, c) {
  const X = c.xs.length ? c.xs : [];
  const perX = fn => (X.length ? X.map((x, i) => fn(x, i, varHint(x, c))) : [fn('Variabel bebas', 0, varHint('variabel bebas', c))]);
  const multi = c.n > 1,
    hints = X.map(x => varHint(x, c)),
    tags = X.length ? X.map((x, i) => xTag(c, i)) : ['X'],
    tagList = joinDan(tags),
    yObj = c.yL || c.yCoreL,
    nVar = multi ? `${c.nKe} variabel` : X[0] || 'variabel bebas',
    pemasar = hints.some(h => h.digital) ? 'pengelola pemasaran digital' : 'pengelola pemasaran',
    party = c.konsumen ? [`pelaku usaha${c.ranahL ? ' ' + c.ranahL : c.obj ? ' ' + c.obj : ''}`, pemasar] : c.partyNouns,
    tempat = c.konsumen && c.ranahL ? ` konsumen ${c.ranahL}` : c.ranahL ? ` di ${c.ranahL}` : c.obj ? ` pada ${c.obj}` : '',
    hasilPraktis = c.konsumen ? 'penjualan' : c.subj === 'siswa' || c.subj === 'mahasiswa' ? 'hasil belajar' : c.subj === 'karyawan' ? 'kinerja' : 'hasil di lapangan';
  const tempatAwal = c.ranahL || c.obj;
  const awal = c.konsumen
    ? [
        c.ranahL
          ? [`Kondisi industri ${c.ranahL} di Indonesia`, `Perkembangan pasar ${c.ranahL}, persaingan merek, dan perubahan kebutuhan konsumen.`]
          : c.obj
            ? [`Kondisi ${c.obj}`, `Perkembangan usaha, persaingan, dan perubahan kebutuhan konsumen pada ${c.obj}.`]
            : ['Kondisi pasar yang diteliti', 'Perkembangan pasar, persaingan merek, dan perubahan kebutuhan konsumen.'],
        [`Perilaku konsumen${c.ranahL ? ' ' + c.ranahL : ''}`, 'Bagaimana konsumen mencari informasi, membandingkan produk, dan mempertimbangkan pembelian.'],
      ]
    : [
        [
          c.subj === 'karyawan' ? 'Kondisi organisasi' : c.subj === 'siswa' || c.subj === 'mahasiswa' ? 'Kondisi pembelajaran' : 'Kondisi objek penelitian',
          `Gambaran ${c.yCoreL}${tempatAwal ? ' di ' + tempatAwal : ` pada ${c.subj} yang diteliti`} beserta data atau laporan yang dapat ditelusuri.`,
        ],
        [`Karakteristik ${c.subj}`, `Kebiasaan dan kondisi ${c.subj} yang berkaitan dengan ${c.yCoreL}.`],
      ];
  const T = {
    background: {
      sub: 'Kembangkan latar belakangmu mengikuti urutan pembahasan berikut.',
      info: partHasText('background') ? '' : 'Fenomena dan data pendukung belum lengkap. Lengkapi sumber agar alasan penelitian dapat ditelusuri.',
      rows: [
        ...awal,
        ...perX((x, i, h) => [`${x} (${xTag(c, i)})`, h.peran]),
        ['Permasalahan penelitian', `Belum diketahuinya besaran pengaruh ${tagList} terhadap ${c.yCoreL} pada populasi yang akan diteliti.`],
        ['Penelitian terdahulu dan research gap', 'Perbandingan hasil penelitian sebelumnya untuk mengidentifikasi celah yang benar-benar dapat dibuktikan.'],
        ['Urgensi penelitian', `Alasan pentingnya menguji hubungan ${nVar} dengan ${c.yCoreL}${tempat}.`],
      ],
    },
    questions: {
      sub: 'Kembangkan rumusan masalah berdasarkan fokus penelitian dan hubungan antarvariabel berikut.',
      rows: [
        ['Fokus permasalahan', `Tegaskan bahwa penelitian membahas keterkaitan ${X.length ? joinDan(hints.map(h => h.indo)) : 'variabel bebas'} dengan ${yObj}.`],
        ...perX(x => [`${x} terhadap ${c.yCoreL}`, `Susun pertanyaan mengenai pengaruh ${x} terhadap ${c.yCoreL} pada ${c.subj} yang menjadi sasaran penelitian.`]),
        ...(multi ? [[`${capitalize(c.nKe)} variabel secara bersama-sama`, `Jika termasuk tujuan penelitian, susun pertanyaan mengenai pengaruh ${c.nKe} variabel secara bersama-sama terhadap ${c.yCoreL}.`]] : []),
        ['Batas pertanyaan penelitian', `Pastikan seluruh pertanyaan mengacu pada ${c.konsumen ? 'produk, kelompok konsumen' : `objek, kelompok ${c.subj}`}, wilayah, dan periode yang sama.`],
      ],
    },
    objectives: {
      sub: 'Kembangkan tujuan penelitian dengan mengikuti rumusan masalah yang telah kamu tetapkan.',
      foot: 'Tujuan tidak boleh menambahkan pengujian yang belum tercantum dalam rumusan masalah.',
      rows: [
        ['Tujuan umum', `Jelaskan tujuan penelitian untuk menganalisis hubungan ${nVar} dengan ${c.yCoreL}${c.konsumen && c.ranahL ? ' produk ' + c.ranahL : ''}.`],
        ...perX(x => [`Tujuan terkait ${x}`, `Rumuskan tujuan untuk menganalisis pengaruh ${x} terhadap ${c.yCoreL}.`]),
        ...(multi ? [['Tujuan pengujian bersama', `Jika terdapat rumusan masalah mengenai ${c.nKe} variabel secara bersama-sama, tambahkan tujuan yang menjawab pertanyaan tersebut.`]] : []),
      ],
    },
    benefits: {
      sub: 'Kembangkan manfaat yang diharapkan dari penelitian sesuai kontribusi dan pihak yang berkepentingan.',
      foot: `Manfaat ditulis sebagai <strong>kontribusi yang diharapkan</strong>, bukan jaminan bahwa penelitian pasti meningkatkan ${hasilPraktis}.`,
      rows: [
        ['Manfaat teoretis', `Jelaskan kontribusi yang diharapkan bagi pemahaman tentang ${joinDan([...(X.length ? hints.map(h => h.bidang) : ['variabel bebas']), yObj])}.`],
        [`Manfaat bagi ${party[0]}`, c.konsumen ? 'Jelaskan bagaimana hasil penelitian diharapkan menjadi bahan pertimbangan dalam menyusun strategi pemasaran dan komunikasi merek.' : 'Jelaskan bagaimana hasil penelitian diharapkan menjadi bahan pertimbangan dalam menyusun kebijakan atau praktik yang relevan.'],
        [`Manfaat bagi ${party[1]}`, hints.some(h => h.evaluasi.length) ? `Jelaskan kegunaan hasil penelitian sebagai bahan evaluasi ${joinDan(hints.flatMap(h => h.evaluasi))}.` : 'Jelaskan kegunaan hasil penelitian sebagai bahan evaluasi dan perbaikan yang relevan.'],
        ['Manfaat bagi peneliti selanjutnya', 'Jelaskan bagaimana penelitian dapat menjadi bahan pembanding atau dasar pengembangan penelitian dengan konteks dan variabel berbeda.'],
      ],
    },
    boundaries: {
      sub: 'Tentukan ruang lingkup agar pembahasan tetap terarah dan sesuai kemampuan penelitian.',
      info: partHasText('population') && partHasText('location') ? '' : 'Populasi, wilayah, dan periode belum ditetapkan. Lengkapi sesuai rencana penelitian.',
      rows: [
        ['Variabel yang diteliti', `Batasi penelitian pada ${X.length ? joinDan([...X, c.yCore]) : 'variabel yang tercantum di judul'}.`],
        c.konsumen
          ? ['Produk atau merek yang dikaji', `Tentukan apakah penelitian mencakup kategori ${c.ranahL || 'produk'} secara umum, jenis produk tertentu, atau merek tertentu.`]
          : ['Objek yang dikaji', `Tentukan objek penelitian secara spesifik${c.obj ? ', yaitu ' + c.obj : ''}.`],
        [`Kelompok ${c.subj}`, `Tetapkan karakteristik ${c.subj} yang menjadi sasaran, termasuk pengalaman${c.konsumen ? ' pembelian' : ''} yang relevan.`],
        ['Wilayah penelitian', 'Tentukan cakupan wilayah sesuai sasaran dan akses pengumpulan data. Hindari menganggap sampel lokal mewakili seluruh Indonesia.'],
        ['Periode penelitian', `Jelaskan periode pengumpulan data dan rentang pengalaman${c.konsumen ? ' pembelian' : ''} yang ditanyakan kepada responden.`],
        ['Aspek di luar pembahasan', `Nyatakan faktor yang tidak dianalisis, misalnya ${c.konsumen ? 'harga atau kualitas produk' : 'faktor lain di luar variabel penelitian'}, jika memang berada di luar model penelitian.`],
      ],
    },
    theory: {
      sub: 'Kembangkan landasan teori dengan menjelaskan konsep, dimensi, dan dasar hubungan antarvariabel.',
      info: biblioCount()
        ? `${biblioCount()} sumber tersedia di Daftar Pustaka. Pastikan setiap konsep punya rujukan yang sesuai.`
        : 'Sumber teori belum ditambahkan. Lengkapi rujukan untuk mendukung definisi, indikator, dan hubungan antarvariabel.',
      rows: [
        ['Teori yang mendasari penelitian', `Jelaskan teori yang dipilih untuk membantu memahami ${c.konsumen ? 'perilaku konsumen' : c.yCoreL} dan hubungan antarvariabel. Terangkan relevansinya dengan penelitian.`],
        ...perX((x, i, h) => [`${x} (${xTag(c, i)})`, `Uraikan definisi, dimensi, dan indikator ${x} ${h.teori || 'berdasarkan sumber yang digunakan'}.`]),
        [`${c.yCore} (Y)`, `Jelaskan definisi dan indikator ${c.yCoreL}. ${/keputusan pembelian/.test(c.yCoreL) ? 'Bedakan dengan minat beli' : 'Bedakan dengan konsep yang mirip'} agar konsep yang diukur tetap konsisten.`],
        ['Dasar hubungan antarvariabel', `Jelaskan alasan teoretis yang menghubungkan setiap variabel bebas dengan ${c.yCoreL} menggunakan sumber yang relevan.`],
      ],
    },
    framework: {
      sub: 'Kembangkan alur pemikiran yang menghubungkan masalah, teori, dan model penelitian.',
      foot: 'Panah dalam model menunjukkan <strong>hubungan yang direncanakan untuk diuji</strong>, bukan hasil yang sudah terbukti.',
      rows: [
        ['Titik awal pemikiran', `Ringkas masalah ${yObj} yang ingin dipahami melalui penelitian.`],
        ...perX((x, i, h) => [`Alur ${x} → ${c.yCore}`, `Jelaskan alasan ${h.alur} diperkirakan berkaitan dengan ${c.yCoreL}${i === 0 ? ', berdasarkan teori dan penelitian pendukung' : ''}.`]),
        ['Model penelitian', `Gambarkan ${tagList} sebagai variabel bebas yang diarahkan kepada Y sebagai variabel terikat.`],
        ['Penjelasan model', 'Terangkan arti setiap hubungan dalam diagram dan kaitannya dengan rumusan masalah.'],
      ],
    },
    hypothesis: {
      sub: 'Susun dugaan sementara berdasarkan teori, penelitian terdahulu, dan model penelitian.',
      info: partHasText('theory') && partHasText('prior') ? '' : 'Dasar hipotesis belum lengkap. Tambahkan sumber sebelum menetapkan arah dugaan.',
      foot: 'Arah positif atau negatif tidak ditetapkan hanya berdasarkan perkiraan Alerin.',
      rows: [
        ['Dasar penyusunan hipotesis', 'Ringkas teori dan temuan terdahulu yang menjadi alasan pengajuan hipotesis.'],
        ...perX(x => [`Hipotesis ${x}`, `Rumuskan dugaan mengenai pengaruh ${x} terhadap ${c.yCoreL} sesuai dasar yang tersedia.`]),
        ...(multi ? [['Hipotesis pengujian bersama', `Jika direncanakan, rumuskan hipotesis pengaruh ${c.nKe} variabel secara bersama-sama terhadap ${c.yCoreL}.`]] : []),
        ['Arah dan bentuk hipotesis', 'Tentukan apakah hipotesis berarah atau tidak berarah. Gunakan penomoran yang konsisten dengan rumusan masalah dan model penelitian.'],
      ],
    },
    design: {
      sub: 'Jelaskan rancangan penelitian dan alasan kesesuaiannya dengan tujuan yang ingin dicapai.',
      info: 'Contoh ini memakai rencana survei kuantitatif. Sesuaikan desain dengan penelitianmu.',
      rows: [
        ['Pendekatan penelitian', 'Jelaskan penggunaan pendekatan kuantitatif untuk mengukur variabel dan menganalisis hubungan secara statistik.'],
        ['Desain penelitian', 'Uraikan desain survei non-eksperimental yang direncanakan dan karakteristik pelaksanaannya.'],
        ['Waktu pengamatan', 'Tentukan apakah data dikumpulkan pada satu periode atau beberapa waktu pengamatan sesuai rancangan penelitian.'],
        ['Unit analisis', `Jelaskan bahwa unit yang dianalisis adalah ${c.subj} individu yang memenuhi kriteria penelitian.`],
        ['Alasan pemilihan desain', 'Hubungkan pilihan desain dengan rumusan masalah, jenis data, akses responden, dan sumber daya yang tersedia.'],
        ['Batas penafsiran', 'Jelaskan batas kemampuan desain dalam mendukung kesimpulan. Penggunaan istilah “pengaruh” tidak dengan sendirinya membuktikan sebab-akibat.'],
      ],
    },
    location: {
      sub: 'Jelaskan tempat, sarana, dan jadwal pelaksanaan penelitian secara spesifik.',
      info: partHasText('location') ? '' : 'Lokasi dan jadwal belum ditetapkan. Lengkapi sesuai akses serta rencana pengumpulan data.',
      rows: [
        ['Wilayah penelitian', `Sebutkan wilayah sasaran ${c.subj} yang diteliti sesuai cakupan yang telah ditetapkan.`],
        ['Tempat atau platform pengumpulan data', 'Jelaskan lokasi atau platform yang digunakan untuk menjangkau responden dan menyebarkan kuesioner.'],
        ['Alasan pemilihan lokasi', 'Terangkan relevansi lokasi dengan sasaran penelitian dan kelayakan akses pengumpulan data.'],
        ['Jadwal pelaksanaan', 'Susun waktu persiapan instrumen, pengumpulan data, pengolahan, analisis, dan penyusunan laporan.'],
        [c.konsumen ? 'Periode pengalaman pembelian' : 'Periode pengalaman', `Tentukan rentang pengalaman${c.konsumen ? ' pembelian' : ''} yang ditanyakan agar jawaban responden mengacu pada periode yang jelas.`],
      ],
    },
    population: {
      sub: 'Jelaskan siapa yang menjadi sasaran penelitian dan bagaimana sampel akan ditentukan.',
      foot: 'Jumlah sampel belum boleh diisi dengan angka tertentu sebelum dasar penentuannya tersedia.',
      rows: [
        ['Populasi sasaran', `Definisikan ${c.subjFull} yang menjadi sasaran berdasarkan wilayah, ${c.konsumen ? 'produk, ' : ''}dan karakteristik yang relevan.`],
        ['Kriteria responden', `Tetapkan syarat keikutsertaan yang selaras dengan variabel penelitian dan pengalaman${c.konsumen ? ' pembelian' : ''} yang diperlukan.`],
        ['Cara menjangkau responden', 'Jelaskan sumber atau saluran perekrutan, termasuk ketersediaan daftar anggota populasi jika ada.'],
        ['Teknik pemilihan sampel', 'Tentukan teknik yang sesuai dengan kondisi populasi dan akses responden, disertai alasan pemilihannya.'],
        ['Rencana jumlah sampel', 'Jelaskan jumlah sampel yang direncanakan dan dasar penentuannya sesuai desain serta kebutuhan analisis.'],
        ['Batas keterwakilan', 'Jelaskan kelompok yang dapat dijangkau dan batas penerapan hasil berdasarkan cara pemilihan sampel.'],
      ],
    },
    collection: {
      sub: 'Jelaskan data yang dibutuhkan, cara memperolehnya, dan instrumen yang akan digunakan.',
      info: partHasText('collection') ? '' : 'Indikator dan instrumen belum ditambahkan. Lengkapi sumber sebelum menyusun butir pengukuran.',
      rows: [
        ['Kebutuhan data', `Petakan informasi yang diperlukan untuk mengukur ${c.labelsXY} serta karakteristik responden yang relevan.`],
        ['Definisi operasional variabel', 'Jelaskan bagaimana setiap variabel diterjemahkan menjadi aspek yang dapat diukur dalam penelitian.'],
        ['Indikator dan sumber instrumen', 'Tentukan indikator berdasarkan rujukan yang dipilih. Jelaskan apakah instrumen diadaptasi atau dikembangkan sendiri.'],
        ['Bentuk instrumen dan pilihan jawaban', 'Uraikan bentuk kuesioner, skala jawaban, serta aturan pemberian skor sesuai kebutuhan pengukuran.'],
        ['Penyusunan dan uji coba', 'Jelaskan penyusunan butir, pemeriksaan kejelasan pertanyaan, dan rencana uji coba sebelum pengumpulan utama.'],
        ['Prosedur pengumpulan data', 'Uraikan penyaringan responden, pemberian informasi penelitian, pengisian kuesioner, dan pemeriksaan kelengkapan jawaban.'],
      ],
    },
    quality: {
      sub: 'Jelaskan cara menjaga kualitas pengukuran dan melindungi pihak yang terlibat dalam penelitian.',
      foot: 'Untuk proposal, uraikan sebagai <strong>rencana</strong>. Status “sudah memperoleh izin” hanya ditampilkan jika memang telah dikonfirmasi.',
      rows: [
        ['Ketepatan pengukuran', 'Jelaskan cara menilai kesesuaian butir dan indikator dengan konsep yang ingin diukur.'],
        ['Konsistensi pengukuran', 'Jelaskan pemeriksaan reliabilitas yang sesuai dengan karakteristik instrumen dan bentuk skor.'],
        ['Kualitas jawaban responden', 'Tetapkan cara memeriksa kelengkapan, duplikasi, dan jawaban yang tidak memenuhi kriteria, beserta aturan penanganannya.'],
        ['Persetujuan partisipan', 'Jelaskan pemberian informasi tujuan, penggunaan data, kesukarelaan, dan hak partisipan sebelum pengisian.'],
        ['Perlindungan identitas dan data', 'Uraikan pembatasan pengumpulan identitas, penyimpanan, akses, serta penyajian data secara aman.'],
        ['Izin dan persetujuan yang relevan', 'Jelaskan kebutuhan izin lokasi, akses data, atau persetujuan etik sesuai ketentuan yang berlaku pada penelitian.'],
      ],
    },
    analysis: {
      sub: 'Susun tahapan analisis yang sesuai dengan rumusan masalah, bentuk data, dan model penelitian.',
      info: 'Teknik analisis masih berupa rencana. Konfirmasi kesesuaiannya dengan data dan pengukuran.',
      foot: 'Teknik analisis tidak ditetapkan hanya berdasarkan jumlah variabel.',
      rows: [
        ['Pemetaan pertanyaan dan analisis', 'Hubungkan setiap rumusan masalah dengan data serta analisis yang diperlukan untuk menjawabnya.'],
        ['Persiapan data', 'Jelaskan pengodean jawaban, perhitungan skor, penanganan data hilang, dan pemeriksaan data yang tidak memenuhi kriteria.'],
        ['Analisis deskriptif', 'Rencanakan penyajian karakteristik responden dan distribusi skor setiap variabel.'],
        ['Pemilihan model analisis', `Pertimbangkan regresi linear ${multi ? 'berganda' : 'sederhana'} apabila bentuk skor, rancangan pengukuran, dan asumsi analisis mendukung penggunaannya.`],
        ['Pemeriksaan kelayakan model', 'Jelaskan pemeriksaan asumsi dan masalah data yang relevan dengan teknik terpilih serta rencana penanganannya.'],
        ['Pengujian dan penafsiran', 'Jelaskan cara membaca arah, besar hubungan, ketidakpastian hasil, dan dukungan terhadap hipotesis sesuai metode yang digunakan.'],
      ],
    },
    data: {
      sub: 'Sajikan gambaran data yang benar-benar digunakan dalam analisis.',
      info: partHasText('data') ? '' : 'Data penelitian belum ditambahkan. Lengkapi data aktual untuk mengembangkan bagian ini.',
      foot: BAB4_FOOT,
      rows: [
        ['Pelaksanaan pengumpulan data', 'Jelaskan sumber, saluran, dan waktu pengumpulan data yang benar-benar dilaksanakan.'],
        ['Jumlah data terkumpul', 'Sajikan jumlah respons yang masuk berdasarkan catatan pengumpulan data.'],
        ['Penyaringan data', 'Jelaskan respons yang dikeluarkan dan alasannya berdasarkan aturan pemeriksaan yang digunakan.'],
        ['Jumlah data yang dianalisis', 'Nyatakan jumlah akhir data yang digunakan dan kesesuaiannya dengan kebutuhan analisis.'],
        ['Karakteristik responden', `Sajikan karakteristik yang relevan${c.konsumen ? `, misalnya pengalaman pembelian${hints.some(h => h.media) ? ' atau penggunaan media sosial' : ''},` : ''} berdasarkan data yang tersedia.`],
        ['Gambaran skor variabel', `Sajikan ringkasan skor ${c.labelsXY} dengan ukuran serta kategori yang memiliki dasar jelas.`],
      ],
    },
    results: {
      sub: 'Sajikan hasil analisis secara berurutan dan hubungkan dengan pertanyaan penelitian.',
      info: partHasText('results') ? '' : 'Hasil analisis belum ditambahkan. Lengkapi tabel atau keluaran analisis sebelum menyusun uraian hasil.',
      foot: BAB4_FOOT,
      rows: [
        ['Hasil pemeriksaan pengukuran', 'Laporkan hasil pemeriksaan kualitas instrumen yang benar-benar dilakukan dan dampaknya terhadap data yang digunakan.'],
        ['Hasil pemeriksaan model', 'Sajikan hasil pemeriksaan kelayakan atau asumsi analisis serta penanganan masalah yang ditemukan.'],
        ...perX((x, i) => [
          `Hasil ${x}`,
          i === 0
            ? `Sajikan hasil analisis ${xTag(c, i)} terhadap Y sesuai keluaran yang tersedia, termasuk arah dan besar estimasi serta ukuran ketidakpastiannya.`
            : `Sajikan hasil analisis ${xTag(c, i)} terhadap Y dengan format pelaporan yang konsisten.`,
        ]),
        ...(multi ? [['Hasil model secara keseluruhan', `Jika dianalisis, laporkan hasil pengujian bersama dan kemampuan model menjelaskan variasi ${c.yCoreL}.`]] : []),
        ['Ringkasan jawaban penelitian', 'Petakan hasil utama kepada setiap rumusan masalah dan tautkan bukti tabel atau keluaran analisisnya.'],
      ],
    },
    discussion: {
      sub: 'Jelaskan makna temuan dengan menghubungkannya pada teori, penelitian terdahulu, dan konteks penelitian.',
      info: partHasText('results') ? '' : 'Hasil penelitian belum ditambahkan. Pembahasan dikembangkan setelah hasil tersedia.',
      foot: BAB4_FOOT,
      rows: [
        ...perX((x, i, h) => [
          `Pembahasan ${x}`,
          h.konteks ? `Jelaskan arti hasil ${xTag(c, i)} dalam konteks ${h.konteks}.` : `Jelaskan arti hasil ${xTag(c, i)} terhadap ${c.yCoreL}, termasuk kemungkinan penjelasan yang memiliki dasar.`,
        ]),
        ['Perbandingan dengan teori dan penelitian', 'Bahas kesesuaian atau perbedaan temuan dengan sumber yang ditinjau. Jangan hanya menyebut “sejalan” tanpa menjelaskan aspek yang dibandingkan.'],
        ['Temuan yang berbeda dari dugaan', 'Bahas hasil yang tidak mendukung hipotesis atau sulit dijelaskan tanpa menyembunyikan hasil tersebut.'],
        ['Implikasi temuan', `Jelaskan arti temuan bagi pemahaman akademik dan praktik ${c.konsumen ? 'pemasaran' : 'di lapangan'} sesuai cakupan penelitian.`],
        ['Batas penafsiran', 'Bedakan penjelasan yang didukung data dengan kemungkinan penjelasan lain yang masih perlu diuji.'],
      ],
    },
    conclusion: {
      sub: 'Susun kesimpulan sebagai jawaban ringkas atas rumusan masalah berdasarkan hasil penelitian.',
      info: partHasText('results') ? '' : `Temuan Bab ${PARTS.results.roman} belum ditambahkan. Kesimpulan dikembangkan setelah hasil penelitian tersedia.`,
      foot: 'Kesimpulan tidak memuat data baru dan tidak sekadar mengulang daftar hasil uji statistik.',
      rows: [
        ...perX((x, i) => [
          `Jawaban tentang ${x}`,
          [
            `Ringkas jawaban rumusan masalah ${xTag(c, i)} berdasarkan hasil analisis, termasuk arah dan besar hubungan jika relevan.`,
            `Ringkas jawaban rumusan masalah ${xTag(c, i)} tanpa menambahkan informasi yang tidak dibahas dalam hasil.`,
            `Ringkas jawaban rumusan masalah ${xTag(c, i)} berdasarkan temuan yang tersedia.`,
          ][Math.min(i, 2)],
        ]),
        ...(multi ? [['Jawaban pengujian bersama', `Jika menjadi rumusan masalah, simpulkan hasil analisis ${c.nKe} variabel secara bersama-sama.`]] : []),
        ['Makna keseluruhan penelitian', 'Tegaskan pemahaman utama yang diperoleh sesuai populasi, data, dan batas desain penelitian.'],
      ],
    },
  };
  return T[id];
}
/* Template kualitatif: menggali makna dan proses, bukan menguji pengaruh. */
function strukturKualitatif(id, c) {
  const T = {
    background: {
      sub: 'Kembangkan latar belakangmu mengikuti urutan pembahasan berikut.',
      info: partHasText('background')
        ? ''
        : 'Fenomena dan data pendukung belum lengkap. Lengkapi sumber agar alasan penelitian dapat ditelusuri.',
      rows: [
        ['Fenomena', `Uraikan kondisi terkait ${c.fokus} yang diamati pada ${c.subj} beserta sumbernya.`],
        ['Data atau catatan awal', 'Sajikan data, laporan, atau pengamatan awal yang menunjukkan fenomena ini nyata.'],
        ['Masalah yang perlu dipahami', 'Jelaskan bagian fenomena yang belum dipahami dan perlu digali secara mendalam.'],
        ['Penelitian terdahulu', 'Tunjukkan temuan sebelumnya dan sisi yang belum dijelaskan.'],
        ['Alasan pendekatan', 'Jelaskan mengapa fenomena ini perlu dipahami dari pengalaman atau sudut pandang subjek.'],
        ['Urgensi penelitian', 'Tegaskan alasan penelitian perlu dilakukan pada konteks ini, lalu arahkan ke rumusan masalah.'],
      ],
    },
    questions: {
      sub: 'Kembangkan rumusan masalah berdasarkan fokus penelitian berikut.',
      foot: 'Pertanyaan kualitatif menggali <strong>makna dan proses</strong>, bukan menguji pengaruh antarvariabel.',
      rows: [
        ['Fokus penelitian', `Tegaskan fokus pada ${c.fokus} yang dialami ${c.subj}.`],
        ['Pertanyaan utama', 'Rumuskan pertanyaan tentang bagaimana pengalaman, proses, atau pemaknaan terjadi.'],
        ['Pertanyaan pendukung', 'Turunkan dua atau tiga pertanyaan yang menjelaskan aspek fokus secara lebih rinci.'],
        ['Batas pertanyaan', 'Hindari pertanyaan yang memaksakan hubungan variabel atau menuntut pengukuran.'],
      ],
    },
    objectives: {
      sub: 'Kembangkan tujuan penelitian dengan mengikuti rumusan masalah yang telah kamu tetapkan.',
      foot: 'Tujuan tidak boleh menambahkan fokus yang belum tercantum dalam rumusan masalah.',
      rows: [
        ['Tujuan umum', `Jelaskan tujuan untuk memahami ${c.fokus} secara mendalam.`],
        ['Tujuan untuk setiap pertanyaan', 'Buat satu tujuan untuk setiap rumusan masalah dengan kata kerja seperti mendeskripsikan atau memahami.'],
        ['Batas tujuan', 'Hindari kata menguji atau membuktikan pengaruh.'],
      ],
    },
    benefits: {
      sub: 'Kembangkan manfaat yang diharapkan dari penelitian sesuai kontribusi dan pihak yang berkepentingan.',
      foot: 'Manfaat ditulis sebagai <strong>kontribusi yang diharapkan</strong>, bukan jaminan perubahan di lapangan.',
      rows: [
        ['Manfaat teoretis', `Jelaskan kontribusi bagi pemahaman tentang ${c.fokus}.`],
        ['Manfaat bagi ' + c.partyNouns[0], 'Jelaskan bagaimana temuan diharapkan menjadi bahan pertimbangan kebijakan atau praktik.'],
        ['Manfaat bagi ' + c.partyNouns[1], 'Jelaskan kegunaan temuan untuk refleksi dan perbaikan yang relevan.'],
        ['Manfaat bagi peneliti selanjutnya', 'Jelaskan bagaimana penelitian dapat menjadi bahan pembanding atau dasar pengembangan penelitian pada konteks berbeda.'],
      ],
    },
    boundaries: {
      sub: 'Tentukan ruang lingkup agar pembahasan tetap terarah dan sesuai kemampuan penelitian.',
      foot: 'Batasan kualitatif menjaga fokus, bukan membatasi temuan yang muncul.',
      rows: [
        ['Fokus kajian', `Batasi pembahasan pada ${c.fokus}.`],
        ['Informan', `Tetapkan ${c.subj} yang menjadi sumber informasi utama.`],
        ['Lokasi dan periode', 'Tentukan tempat dan waktu penggalian data.'],
        ['Aspek di luar cakupan', 'Nyatakan aspek yang tidak digali agar pembahasan tetap fokus.'],
      ],
    },
    theory: {
      sub: 'Kembangkan konsep dan teori yang menjadi lensa memahami data.',
      info: biblioCount()
        ? `${biblioCount()} sumber tersedia di Daftar Pustaka. Pastikan setiap konsep punya rujukan yang sesuai.`
        : 'Sumber teori belum ditambahkan. Lengkapi rujukan untuk mendukung pembahasan.',
      rows: [
        ['Konsep utama', `Jelaskan konsep ${c.fokus} berdasarkan sumber yang dapat ditelusuri.`],
        ['Teori pendukung', 'Jelaskan teori yang dipakai sebagai lensa memahami data, bukan untuk diuji.'],
        ['Definisi kunci', 'Tetapkan arti istilah penting agar penafsiran konsisten.'],
        ['Posisi teori', 'Jelaskan bagian teori yang membantu menyusun panduan wawancara dan pembahasan.'],
      ],
    },
    framework: {
      sub: 'Hubungkan fenomena, konsep, dan fokus yang digali.',
      foot: 'Kerangka menjadi <strong>panduan awal</strong> dan dapat berkembang mengikuti data.',
      rows: [
        ['Alur pemikiran', 'Jelaskan alur dari fenomena, konsep, sampai fokus yang digali.'],
        ['Konsep yang dihubungkan', 'Sebutkan konsep yang saling berkaitan beserta sumbernya.'],
        ['Lensa teori', 'Jelaskan cara teori membantu membaca pengalaman atau proses subjek.'],
        ['Bagan alur', 'Gambarkan bagan sederhana yang menunjukkan alur pemikiran.'],
        ['Batas penafsiran', 'Tegaskan bahwa kerangka tidak menyatakan hubungan sebab-akibat.'],
      ],
    },
    design: {
      sub: 'Jelaskan rancangan dan alasan kesesuaiannya dengan tujuan penelitian.',
      info: 'Contoh ini memakai pendekatan kualitatif. Sesuaikan desain dengan penelitianmu.',
      rows: [
        ['Pendekatan penelitian', 'Jelaskan pendekatan kualitatif untuk memahami pengalaman, proses, atau makna secara mendalam.'],
        ['Jenis desain', 'Tentukan desain seperti studi kasus, fenomenologi, atau etnografi, lalu jelaskan karakteristiknya.'],
        ['Kehadiran peneliti', 'Jelaskan peran peneliti saat mengumpulkan data di lapangan.'],
        ['Unit analisis', `Jelaskan pengalaman atau proses ${c.subj} yang dianalisis.`],
        ['Alasan pemilihan', 'Hubungkan desain dengan rumusan masalah, jenis data, dan akses informan.'],
        ['Batas penafsiran', 'Hasil menggambarkan konteks yang diteliti, bukan generalisasi ke populasi luas.'],
      ],
    },
    location: {
      sub: 'Jelaskan tempat, sarana, dan jadwal pelaksanaan penelitian.',
      info: partHasText('location')
        ? 'Pastikan lokasi dan jadwal sesuai akses serta rencana pengumpulan data.'
        : 'Lokasi dan jadwal belum ditetapkan. Lengkapi sesuai akses serta rencana pengumpulan data.',
      rows: [
        ['Lokasi penelitian', 'Sebutkan tempat atau komunitas tempat data digali.'],
        ['Tempat atau platform', 'Jelaskan tempat atau platform untuk bertemu informan dan melakukan wawancara atau observasi.'],
        ['Alasan pemilihan lokasi', 'Terangkan relevansi lokasi dengan fokus penelitian serta kelayakan akses.'],
        ['Jadwal pelaksanaan', 'Susun waktu persiapan, penggalian data, analisis, dan pelaporan.'],
      ],
    },
    participants: {
      sub: 'Jelaskan pihak yang dilibatkan dan cara memilihnya.',
      foot: 'Jumlah informan mengikuti <strong>kecukupan informasi</strong>, bukan target angka tertentu.',
      rows: [
        ['Pihak yang dilibatkan', `Sebutkan ${c.subj} atau pihak yang paling memahami fokus penelitian.`],
        ['Kriteria informan', 'Tetapkan syarat pengalaman atau peran yang membuat informan relevan.'],
        ['Teknik pemilihan', 'Jelaskan teknik seperti purposive atau snowball beserta alasannya.'],
        ['Cara merekrut', 'Uraikan cara menghubungi informan dan memperoleh persetujuan.'],
        ['Kecukupan informasi', 'Jelaskan kapan penggalian dianggap cukup, misalnya saat informasi mulai berulang.'],
      ],
    },
    collection: {
      sub: 'Jelaskan data yang dibutuhkan dan cara memperolehnya.',
      info: partHasText('collection')
        ? 'Pastikan setiap pokok pertanyaan terhubung dengan fokus penelitian.'
        : 'Panduan wawancara belum ditambahkan. Turunkan dari fokus penelitian sebelum turun lapangan.',
      rows: [
        ['Kebutuhan data', 'Petakan informasi yang diperlukan untuk menjawab setiap rumusan masalah.'],
        ['Teknik pengumpulan', 'Jelaskan wawancara, observasi, atau dokumentasi yang dipakai beserta alasannya.'],
        ['Panduan wawancara', 'Uraikan pokok pertanyaan yang diturunkan dari fokus penelitian.'],
        ['Observasi dan dokumen', 'Jelaskan hal yang diamati dan dokumen yang dikumpulkan.'],
        ['Perekaman dan catatan', 'Uraikan cara merekam, mencatat, dan menyimpan data lapangan.'],
        ['Prosedur pengumpulan', 'Jelaskan urutan dari perizinan, pertemuan informan, sampai pengecekan data.'],
      ],
    },
    quality: {
      sub: 'Jelaskan cara menjaga keabsahan data dan melindungi pihak yang terlibat dalam penelitian.',
      foot: 'Untuk proposal, uraikan sebagai <strong>rencana</strong>. Status “sudah memperoleh izin” hanya ditampilkan jika memang telah dikonfirmasi.',
      rows: [
        ['Kredibilitas', 'Jelaskan triangulasi sumber atau teknik serta pengecekan kepada informan.'],
        ['Jejak proses', 'Uraikan catatan proses yang memungkinkan pemeriksaan ulang.'],
        ['Pemisahan data dan tafsir', 'Jelaskan cara memisahkan data dari penafsiran peneliti.'],
        ['Persetujuan partisipan', 'Jelaskan informasi tujuan, penggunaan data, kesukarelaan, dan hak partisipan.'],
        ['Perlindungan identitas', 'Uraikan penyamaran identitas, penyimpanan, dan penyajian kutipan secara aman.'],
        ['Izin yang relevan', 'Jelaskan kebutuhan izin lokasi, akses data, atau persetujuan etik sesuai ketentuan.'],
      ],
    },
    analysis: {
      sub: 'Susun tahapan analisis sesuai pertanyaan dan bentuk data.',
      info: 'Teknik analisis masih berupa rencana. Konfirmasi kesesuaiannya dengan data yang dikumpulkan.',
      rows: [
        ['Persiapan data', 'Jelaskan transkripsi dan pengorganisasian data.'],
        ['Pengodean', 'Uraikan cara memberi kode awal pada data.'],
        ['Pengelompokan tema', 'Jelaskan cara kode dikelompokkan menjadi kategori atau tema.'],
        ['Penyajian data', 'Rencanakan penyajian tema dengan kutipan pendukung.'],
        ['Penarikan kesimpulan', 'Jelaskan cara tema dihubungkan kembali ke rumusan masalah.'],
        ['Pengecekan temuan', 'Uraikan pengecekan temuan dengan sumber atau teknik lain.'],
      ],
    },
    data: {
      sub: 'Sajikan gambaran data yang benar-benar digunakan dalam analisis.',
      info: partHasText('data')
        ? ''
        : 'Data penelitian belum ditambahkan. Lengkapi data aktual untuk mengembangkan bagian ini.',
      foot: BAB4_FOOT,
      rows: [
        ['Pelaksanaan pengumpulan', 'Jelaskan waktu, tempat, dan cara penggalian data yang benar-benar dilaksanakan.'],
        ['Informan yang terlibat', 'Sajikan jumlah dan peran informan dengan identitas disamarkan.'],
        ['Data yang dianalisis', 'Nyatakan jumlah wawancara, observasi, atau dokumen yang benar-benar digunakan.'],
        ['Karakteristik informan', 'Sajikan latar informan yang relevan dengan fokus penelitian.'],
      ],
    },
    results: {
      sub: 'Sajikan temuan secara berurutan sesuai pertanyaan penelitian.',
      info: partHasText('results')
        ? ''
        : 'Temuan belum ditambahkan. Lengkapi hasil analisis data sebelum menyusun uraian hasil.',
      foot: BAB4_FOOT,
      rows: [
        ['Gambaran tema', 'Ringkas tema utama yang muncul dari analisis.'],
        ['Tema per pertanyaan', 'Sajikan tema yang menjawab setiap rumusan masalah.'],
        ['Kutipan pendukung', 'Sertakan kutipan informan secukupnya dengan identitas disamarkan.'],
        ['Temuan yang berbeda', 'Sajikan pengalaman yang berbeda dari pola umum tanpa menghilangkannya.'],
        ['Ringkasan dan bukti', 'Petakan temuan ke rumusan masalah dan tunjukkan sumber datanya.'],
      ],
    },
    discussion: {
      sub: 'Jelaskan makna temuan melalui teori, penelitian terdahulu, dan konteks.',
      info: partHasText('results') ? '' : 'Temuan belum ditambahkan. Pembahasan dikembangkan setelah hasil tersedia.',
      foot: BAB4_FOOT,
      rows: [
        ['Makna tema', 'Jelaskan arti setiap tema dalam konteks penelitian.'],
        ['Perbandingan teori', 'Bahas kesesuaian atau perbedaan temuan dengan teori yang dipakai.'],
        ['Perbandingan penelitian terdahulu', 'Bandingkan temuan dengan penelitian sebelumnya secara spesifik.'],
        ['Temuan baru', 'Jelaskan hal yang belum dibahas penelitian sebelumnya, bila ada.'],
        ['Implikasi dan batas penafsiran', 'Jelaskan arti akademik dan praktis sesuai konteks yang diteliti.'],
      ],
    },
    conclusion: {
      sub: 'Susun kesimpulan sebagai jawaban ringkas atas rumusan masalah berdasarkan temuan penelitian.',
      info: partHasText('results') ? '' : `Temuan Bab ${PARTS.results.roman} belum ditambahkan. Kesimpulan dikembangkan setelah hasil penelitian tersedia.`,
      foot: 'Kesimpulan tidak memuat data baru dan tidak sekadar mengulang kutipan informan.',
      rows: [
        ['Jawaban setiap pertanyaan', 'Ringkas jawaban untuk setiap rumusan masalah berdasarkan tema.'],
        ['Hubungan dengan tujuan', 'Pastikan setiap tujuan penelitian terjawab.'],
        ['Makna keseluruhan', 'Tegaskan pemahaman utama sesuai konteks penelitian. Jangan menambahkan temuan baru.'],
      ],
    },
  };
  return T[id];
}
/* Bab V dan Penelitian Terdahulu berlaku untuk semua metode. */
function strukturUmum(id, c) {
  const hints = c.xs.map(x => varHint(x, c)),
    pemasar = hints.some(h => h.digital) ? 'pengelola pemasaran digital' : 'pengelola pemasaran',
    party = c.konsumen ? [`pelaku usaha${c.ranahL ? ' ' + c.ranahL : c.obj ? ' ' + c.obj : ''}`, pemasar] : c.partyNouns,
    aspek = hints.map(h => h.aspek).filter(Boolean);
  const T = {
    prior: {
      sub: 'Tinjau penelitian yang relevan untuk menemukan persamaan, perbedaan, dan posisi penelitianmu.',
      info: biblioCount()
        ? `${biblioCount()} sumber tersedia di Daftar Pustaka. Pilih yang relevan untuk dibandingkan.`
        : 'Artikel penelitian belum ditambahkan. Pilih atau unggah artikel agar perbandingan dapat disusun berdasarkan sumber.',
      rows: [
        ['Identitas penelitian', 'Cantumkan penulis, tahun, judul, dan sumber publikasi dari setiap artikel yang ditinjau.'],
        c.xs.length
          ? ['Tujuan dan variabel penelitian', 'Jelaskan fokus penelitian sebelumnya, termasuk variabel atau hubungan yang dikaji.']
          : ['Tujuan dan fokus penelitian', 'Jelaskan fokus penelitian sebelumnya, termasuk konsep atau pengalaman yang dikaji.'],
        ['Metode dan konteks penelitian', 'Ringkas desain, karakteristik sampel, objek, lokasi, dan teknik analisis berdasarkan informasi yang tersedia dalam artikel.'],
        ['Temuan utama', 'Uraikan hasil yang relevan dengan penelitianmu tanpa mengubah makna temuan penulis.'],
        ['Persamaan dan perbedaan', `Bandingkan ${c.xs.length ? 'variabel' : 'fokus'}, objek, populasi, metode, atau konteks penelitian sebelumnya dengan rencana penelitianmu.`],
        ['Celah dan posisi penelitian', 'Jelaskan hal yang masih perlu dikaji berdasarkan perbandingan tersebut. Bedakan perbedaan konteks dengan celah pengetahuan yang dapat dibuktikan.'],
      ],
    },
    limitations: {
      sub: 'Jelaskan keterbatasan penelitian dan pengaruhnya terhadap penggunaan hasil.',
      foot: 'Poin di atas merupakan <strong>aspek untuk diperiksa</strong>. Hanya keterbatasan yang benar-benar relevan dan dapat dikonfirmasi yang dimasukkan ke tulisan.',
      rows: [
        ['Keterbatasan cakupan dan sampel', 'Jika relevan, jelaskan keterbatasan jangkauan responden, wilayah, atau cara pemilihan sampel.'],
        ['Keterbatasan pengukuran', 'Jika ditemukan, jelaskan keterbatasan kuesioner atau indikator dalam merepresentasikan konsep yang diteliti.'],
        ['Keterbatasan desain dan waktu', 'Jelaskan batas rancangan penelitian, misalnya keterbatasan pengamatan pada satu periode untuk memahami perubahan dari waktu ke waktu.'],
        ['Keterbatasan model', 'Jelaskan faktor di luar model yang belum dianalisis dan alasan penelitian belum mencakupnya.'],
        ['Dampak terhadap kesimpulan', 'Terangkan bagaimana setiap keterbatasan memengaruhi penafsiran, ketepatan estimasi, atau penerapan hasil pada kelompok lain.'],
      ],
    },
    recommendations: {
      sub: 'Kembangkan saran yang dapat ditindaklanjuti berdasarkan temuan dan keterbatasan penelitian.',
      foot: 'Setiap saran harus memiliki dasar temuan atau keterbatasan. Hindari rekomendasi yang tidak didukung hasil.',
      rows: [
        ['Dasar penyusunan saran', 'Tentukan temuan atau keterbatasan yang menjadi dasar setiap saran.'],
        [`Saran bagi ${party[0]}`, `Rumuskan tindakan yang relevan dengan temuan, lingkup ${c.konsumen ? 'usaha ' : ''}yang diteliti, dan sumber daya yang diperlukan.`],
        [
          `Saran bagi ${party[1]}`,
          aspek.length
            ? `Jika didukung hasil, jelaskan aspek ${joinAtau(aspek)} yang perlu dievaluasi.`
            : 'Jika didukung hasil, jelaskan aspek yang perlu dievaluasi atau diperbaiki.',
        ],
        ['Saran bagi peneliti selanjutnya', 'Usulkan perbaikan desain, cakupan sampel, pengukuran, atau variabel berdasarkan keterbatasan yang teridentifikasi.'],
        ['Prioritas dan batas penerapan', 'Jelaskan saran yang paling relevan untuk didahulukan serta kondisi yang perlu diperhatikan sebelum menerapkannya.'],
      ],
    },
  };
  if (strukturKind() === 'kualitatif' && id === 'limitations')
    return {
      ...T.limitations,
      rows: [
        ['Keterbatasan informan dan konteks', 'Jika relevan, jelaskan keterbatasan jumlah, keragaman, atau akses informan.'],
        ['Keterbatasan pengumpulan data', 'Jelaskan kendala wawancara, observasi, atau dokumen yang memengaruhi kedalaman data.'],
        ['Posisi peneliti', 'Uraikan kemungkinan pengaruh sudut pandang peneliti dan cara mengendalikannya.'],
        ['Dampak terhadap kesimpulan', 'Terangkan bagaimana setiap keterbatasan memengaruhi penafsiran dan penerapan pada konteks lain.'],
      ],
    };
  return T[id];
}
/* Metode campuran: dua jalur data dan titik pertemuannya. */
function strukturCampuran(id, c) {
  const k = strukturKuantitatif(id, c),
    q = strukturKualitatif(id, c);
  const T = {
    questions: k && {
      ...k,
      info: 'Susun pertanyaan kuantitatif dan kualitatif, lalu tentukan pertanyaan yang mempertemukan keduanya.',
      rows: [
        ...k.rows,
        ['Pertanyaan kualitatif', 'Tambahkan pertanyaan tentang pengalaman atau proses yang menjelaskan hasil pengukuran.'],
        ['Pertanyaan integrasi', 'Rumuskan pertanyaan tentang cara temuan kedua jenis data saling menjelaskan.'],
      ],
    },
    design: {
      sub: 'Jelaskan rancangan metode campuran dan alasan kesesuaiannya.',
      info: 'Contoh ini memakai metode campuran. Sesuaikan urutan dan bobot data dengan penelitianmu.',
      rows: [
        ['Pendekatan penelitian', 'Jelaskan alasan memadukan data kuantitatif dan kualitatif untuk menjawab rumusan masalah.'],
        ['Urutan desain', 'Tentukan urutan: kuantitatif dahulu (explanatory), kualitatif dahulu (exploratory), atau bersamaan (convergent).'],
        ['Bobot setiap data', 'Jelaskan jenis data yang menjadi utama dan yang menjadi pendukung.'],
        ['Titik integrasi', 'Jelaskan kapan dan bagaimana kedua jenis data dipertemukan.'],
        ['Alasan pemilihan', 'Hubungkan desain dengan rumusan masalah, akses responden dan informan, serta sumber daya.'],
        ['Batas penafsiran', 'Jelaskan batas desain dan cara menghindari klaim sebab-akibat yang belum didukung.'],
      ],
    },
    collection: {
      sub: 'Jelaskan data kuantitatif dan kualitatif yang dibutuhkan serta cara memperolehnya.',
      info: 'Instrumen dan panduan wawancara belum lengkap. Susun keduanya dari rumusan masalah yang sama.',
      rows: [
        ['Kebutuhan data', 'Petakan data kuantitatif dan kualitatif untuk setiap rumusan masalah.'],
        ['Instrumen dan skala', 'Uraikan kuesioner, indikator, dan aturan pemberian skor.'],
        ['Panduan wawancara', 'Uraikan pokok pertanyaan yang menjelaskan atau menggali hasil pengukuran.'],
        ['Urutan pengumpulan', 'Jelaskan tahap pengumpulan sesuai urutan desain.'],
        ['Prosedur pengumpulan', 'Uraikan perekrutan, pemberian informasi penelitian, dan pemeriksaan data.'],
      ],
    },
    quality: {
      sub: 'Jelaskan cara menjaga kualitas kedua jenis data dan melindungi partisipan.',
      info: 'Tuliskan sebagai rencana. Nyatakan izin telah diperoleh hanya jika sudah dikonfirmasi.',
      rows: [
        ['Kualitas pengukuran', 'Jelaskan pemeriksaan validitas dan reliabilitas instrumen.'],
        ['Keabsahan data kualitatif', 'Jelaskan triangulasi dan pengecekan kepada informan.'],
        ['Kesesuaian dua jalur', 'Uraikan cara memastikan kedua jenis data membahas fokus yang sama.'],
        ['Persetujuan partisipan', 'Jelaskan informasi tujuan, penggunaan data, kesukarelaan, dan hak partisipan.'],
        ['Perlindungan identitas', 'Uraikan penyamaran identitas, penyimpanan, dan penyajian data secara aman.'],
        ['Izin yang relevan', 'Jelaskan kebutuhan izin lokasi, akses data, atau persetujuan etik.'],
      ],
    },
    analysis: {
      sub: 'Susun analisis setiap jalur data dan cara mempertemukannya.',
      info: 'Teknik analisis masih berupa rencana. Konfirmasi kesesuaiannya dengan data dan pengukuran.',
      rows: [
        ['Analisis kuantitatif', 'Jelaskan statistik deskriptif atau inferensial sesuai rumusan masalah.'],
        ['Analisis kualitatif', 'Jelaskan pengodean, pengelompokan tema, dan penarikan kesimpulan.'],
        ['Integrasi hasil', 'Jelaskan cara membandingkan, menghubungkan, atau menjelaskan hasil dari kedua jalur.'],
        ['Penafsiran bersama', 'Uraikan cara menyikapi hasil yang saling mendukung atau berbeda.'],
      ],
    },
    results: {
      sub: 'Sajikan hasil kedua jalur data secara berurutan sesuai pertanyaan penelitian.',
      info: partHasText('results')
        ? ''
        : 'Hasil belum ditambahkan. Lengkapi keluaran analisis dan temuan lapangan sebelum menyusun uraian.',
      foot: BAB4_FOOT,
      rows: [
        ['Hasil kuantitatif', 'Sajikan hasil pengukuran sesuai keluaran analisis.'],
        ['Temuan kualitatif', 'Sajikan tema dengan kutipan pendukung yang disamarkan.'],
        ['Integrasi hasil', 'Jelaskan bagian yang saling menguatkan atau berbeda.'],
        ['Ringkasan dan bukti', 'Petakan hasil ke rumusan masalah dan tunjukkan sumber datanya.'],
      ],
    },
  };
  return T[id] || (c.xs.length ? k : q);
}
/* Penelitian dan pengembangan (R&D): produk, validasi, uji coba. */
function strukturRnd(id, c) {
  const T = {
    questions: {
      sub: 'Kembangkan pertanyaan tentang produk, kelayakan, dan penggunaannya.',
      info: 'Sesuaikan pertanyaan dengan model pengembangan dan subjek uji coba.',
      rows: [
        ['Produk yang dikembangkan', 'Rumuskan pertanyaan tentang proses pengembangan produk.'],
        ['Kelayakan', 'Susun pertanyaan tentang kelayakan produk menurut validator ahli.'],
        ['Kepraktisan', 'Susun pertanyaan tentang kemudahan penggunaan menurut pengguna.'],
        ['Keefektifan', 'Jika direncanakan, susun pertanyaan tentang keefektifan produk.'],
      ],
    },
    objectives: {
      sub: 'Kembangkan tujuan yang menjawab setiap rumusan masalah.',
      info: 'Gunakan rumusan masalah yang telah ditetapkan agar tujuan tetap selaras.',
      rows: [
        ['Tujuan pengembangan', 'Jelaskan produk yang dihasilkan dan proses pengembangannya.'],
        ['Tujuan kelayakan', 'Rumuskan tujuan menilai kelayakan produk.'],
        ['Tujuan kepraktisan dan keefektifan', 'Rumuskan tujuan sesuai uji coba yang direncanakan.'],
      ],
    },
    design: {
      sub: 'Jelaskan model pengembangan dan alasan pemilihannya.',
      info: 'Contoh ini memakai penelitian dan pengembangan. Sesuaikan model dengan pedoman kampusmu.',
      rows: [
        ['Model pengembangan', 'Sebutkan model seperti ADDIE, 4D, atau Borg & Gall, lalu jelaskan alasannya.'],
        ['Tahapan pengembangan', 'Uraikan kegiatan dan keluaran setiap tahap.'],
        ['Produk yang dikembangkan', 'Jelaskan bentuk, isi, dan sasaran pengguna produk.'],
        ['Validasi ahli', 'Jelaskan ahli yang dilibatkan dan aspek yang dinilai.'],
        ['Uji coba', 'Jelaskan uji coba terbatas dan lapangan bila direncanakan.'],
        ['Batas penafsiran', 'Jelaskan batas klaim kelayakan dan keefektifan produk.'],
      ],
    },
    population: {
      sub: 'Jelaskan subjek uji coba dan cara memilihnya.',
      info: 'Jumlah subjek mengikuti tahap uji coba yang direncanakan.',
      rows: [
        ['Validator ahli', 'Tetapkan kriteria keahlian validator.'],
        ['Subjek uji coba', `Definisikan ${c.subj} yang menjadi pengguna produk.`],
        ['Teknik pemilihan', 'Tentukan teknik pemilihan subjek beserta alasannya.'],
        ['Jumlah per tahap', 'Uraikan jumlah subjek untuk uji coba terbatas dan lapangan.'],
      ],
    },
    collection: {
      sub: 'Jelaskan instrumen untuk menilai produk.',
      info: 'Instrumen belum ditambahkan. Susun lembar validasi dan angket sebelum uji coba.',
      rows: [
        ['Analisis kebutuhan', 'Jelaskan data awal untuk menentukan kebutuhan produk.'],
        ['Lembar validasi', 'Uraikan aspek dan skala penilaian ahli.'],
        ['Angket respons pengguna', 'Jelaskan aspek kepraktisan yang ditanyakan.'],
        ['Tes atau pengukuran', 'Jika direncanakan, jelaskan instrumen keefektifan.'],
        ['Prosedur pengumpulan', 'Uraikan urutan pengumpulan sesuai tahap pengembangan.'],
      ],
    },
    analysis: {
      sub: 'Susun analisis kelayakan, kepraktisan, dan keefektifan produk.',
      info: 'Teknik analisis masih berupa rencana. Konfirmasi kriteria penilaian dengan pembimbing.',
      rows: [
        ['Analisis kelayakan', 'Jelaskan cara mengolah skor validasi dan kriteria layak.'],
        ['Analisis kepraktisan', 'Jelaskan cara mengolah angket respons pengguna.'],
        ['Analisis keefektifan', 'Jika direncanakan, jelaskan uji yang dipakai.'],
        ['Revisi produk', 'Jelaskan cara saran validator dan pengguna dipakai untuk revisi.'],
      ],
    },
    results: {
      sub: 'Sajikan hasil setiap tahap pengembangan.',
      info: partHasText('results')
        ? ''
        : 'Hasil belum ditambahkan. Lengkapi data validasi dan uji coba sebelum menyusun uraian.',
      foot: BAB4_FOOT,
      rows: [
        ['Hasil analisis kebutuhan', 'Sajikan temuan awal yang mendasari produk.'],
        ['Hasil desain', 'Tampilkan rancangan produk.'],
        ['Hasil validasi', 'Sajikan skor dan saran validator.'],
        ['Hasil uji coba', 'Sajikan respons pengguna dan hasil pengukuran.'],
        ['Revisi produk', 'Jelaskan perubahan produk berdasarkan masukan.'],
      ],
    },
  };
  return T[id] || strukturKualitatif(id, c);
}
/* Nama subbagian di Struktur. Kualitas data dipakai untuk kuantitatif, keabsahan untuk lainnya. */
function strukturTitle(id) {
  return PARTS[id]?.name || '';
}
function strukturFor(id) {
  const c = researchCtx(),
    k = strukturKind();
  let s = strukturUmum(id, c);
  if (!s) {
    if (k === 'kuantitatif') s = strukturKuantitatif(id, c);
    else if (k === 'kualitatif') s = strukturKualitatif(id, c);
    else if (k === 'campuran') s = strukturCampuran(id, c);
    else if (k === 'rnd') s = strukturRnd(id, c);
    else s = c.xs.length ? strukturKuantitatif(id, c) : strukturKualitatif(id, c);
  }
  s ||= strukturKualitatif(id, c) || strukturKuantitatif(id, c);
  const undetermined = !k;
  return {
    id,
    title: strukturTitle(id),
    sub: s.sub,
    info: undetermined && id === 'design' ? 'Metode belum ditentukan. Pilih metode di Konteks agar poin menyesuaikan.' : s.info || '',
    foot: s.foot || '',
    rows: s.rows,
  };
}
/* Kendala dari Konteks dipetakan ke subbagian yang paling dekat. */
const KENDALA_MAP = [
  [/rumusan masalah|merumuskan masalah|rumusan|pertanyaan penelitian/, 'questions'],
  [/latar belakang|fenomena|urgensi/, 'background'],
  [/tujuan penelitian|\btujuan\b/, 'objectives'],
  [/manfaat/, 'benefits'],
  [/batasan|ruang lingkup|cakupan/, 'boundaries'],
  [/kerangka/, 'framework'],
  [/hipotesis/, 'hypothesis'],
  [/penelitian terdahulu|jurnal|artikel|referensi|literatur/, 'prior'],
  [/teori|konsep|definisi/, 'theory'],
  [/informan|partisipan|narasumber/, 'participants'],
  [/populasi|sampel|responden/, 'population'],
  [/kuesioner|angket|instrumen|wawancara|indikator|skala/, 'collection'],
  [/validitas|reliabilitas|keabsahan|etika|izin/, 'quality'],
  [/analisis|regresi|spss|statistik|olah data|mengolah|uji asumsi/, 'analysis'],
  [/lokasi|tempat penelitian|jadwal/, 'location'],
  [/metode|pendekatan|desain/, 'design'],
  [/gambaran data|data terkumpul/, 'data'],
  [/pembahasan/, 'discussion'],
  [/\bhasil\b/, 'results'],
  [/kesimpulan/, 'conclusion'],
  [/keterbatasan/, 'limitations'],
  [/\bsaran\b/, 'recommendations'],
];
function kendalaPart(text) {
  const t = String(text || '').toLowerCase();
  for (const [re, id] of KENDALA_MAP)
    if (re.test(t)) {
      if (partApplies(id)) return id;
      const alt = { population: 'participants', participants: 'population' }[id];
      return alt && partApplies(alt) ? alt : null;
    }
  return null;
}
const KENDALA_STOP = new Set(
  'yang dengan untuk dalam belum masih bagaimana cara saya aku bingung yakin tidak bisa sudah akan atau dari pada juga karena harus bagian penelitian skripsi masalah sangat agar supaya kurang paham memahami tentang'.split(
    ' ',
  ),
);
function kataDasar(w) {
  let s = w.replace(/(kan|an|nya|i)$/, '');
  if (s.length < 4) s = w;
  const p = s.replace(/^(meng|meny|mem|men|me|peng|peny|pem|pen|per|pe|ber|di|ter)/, '');
  return p.length >= 4 ? p : s;
}
const kendalaTokens = t =>
  String(t || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(w => w.length >= 4 && !KENDALA_STOP.has(w))
    .map(kataDasar);
/* Blok "Kendalamu" diletakkan tepat di atas tabel poin yang perlu dikerjakan. */
function kendalaBlock(id, rows) {
  const k = String(ensureKonteks().kendala || '').trim();
  if (!k)
    return `<div class="struktur-kendala empty" data-kendala="empty"><span class="eyebrow">KENDALAMU</span><p class="small">Belum ada kendala yang dicatat. Tuliskan di Konteks agar saran menyesuaikan kendalamu. ${B('Tulis Kendala', 'guide-view:konteks', 'text small')}</p></div>`;
  const target = kendalaPart(k),
    words = new Set(kendalaTokens(k));
  let best = -1,
    score = 0;
  rows.forEach((r, i) => {
    const s = kendalaTokens(r[0] + ' ' + r[1]).filter(w => words.has(w)).length;
    if (s > score) {
      score = s;
      best = i;
    }
  });
  let saran;
  if (target && target !== id)
    saran = `Kendalamu paling dekat dengan <strong>${e(PARTS[target].name)}</strong> (Bab ${PARTS[target].roman}). Selesaikan bagian ini mengikuti poin di bawah, lalu buka saran untuk bagian tersebut. ${B('Lihat Saran ' + e(PARTS[target].name), 'struktur:' + target, 'text small')}`;
  else if (best >= 0)
    saran = `Mulai dari poin <strong>${best + 1} · ${e(rows[best][0])}</strong>: ${e(rows[best][1])}`;
  else if (target === id)
    saran = 'Kendalamu ada di bagian ini. Kerjakan poin secara berurutan mulai dari poin 1, lalu bawa poin yang masih membingungkan ke pembimbing atau Mentor.';
  else
    saran = 'Kendalamu belum terkait langsung dengan bagian ini. Kerjakan poin secara berurutan, lalu bahas kendala tersebut bersama pembimbing atau Mentor.';
  return `<div class="struktur-kendala" data-kendala="${target && target !== id ? 'other' : target === id || best >= 0 ? 'match' : 'none'}"><span class="eyebrow">KENDALAMU · DARI KONTEKS</span><p class="struktur-kendala-text">“${e(k)}”</p><p class="small">${saran}</p></div>`;
}
/* Catatan aturan di bawah tabel boleh memuat <strong>; selebihnya di-escape. */
const strongOnly = t => e(t).replace(/&lt;(\/?)strong&gt;/g, '<$1strong>');
/* Tampilan Struktur (Saran Alerin) setelah Kerjakan: mengikuti contoh Revisi 16 November dan Output Alerin Skripsi. */
function strukturView() {
  ensureGuide();
  const id = PARTS[S.guide.part] && partApplies(S.guide.part) ? S.guide.part : 'background',
    p = PARTS[id],
    s = strukturFor(id),
    nx = nextPart(id);
  S.guide.part = id;
  /* Satu tombol utama: Jadikan Progres Aktif, atau Lihat di Progres Aktif bila pekerjaannya sudah ada (QC 17 November). */
  const open = S.tasks.find(x => x.part === id && x.status !== 'done'),
    done = !open && S.tasks.find(x => x.part === id && x.status === 'done'),
    has = open || done;
  const main = has
    ? B('Lihat di Progres Aktif <span aria-hidden="true">→</span>', 'lihat-pekerjaan:' + has.id, 'primary')
    : B('Jadikan Progres Aktif <span aria-hidden="true">→</span>', 'struktur-jadikan:' + id, 'primary');
  const status = has
    ? `<p class="struktur-status small">${done ? 'Bagian ini sudah dicatat selesai di Progres Aktif.' : 'Bagian ini sudah ada di Progres Aktif.'}</p>`
    : '';
  const rows = s.rows
    .map(
      (r, i) =>
        `<tr><td class="struktur-no-cell"><span class="struktur-no">${i + 1}</span></td><th scope="row">${e(r[0])}</th><td>${e(r[1])}</td></tr>`,
    )
    .join('');
  return `<div class="page-head struktur-head"><h1>Mulai Skripsi</h1><p>Kerjakan skripsimu satu tahap demi satu tahap.</p><button type="button" class="struktur-back" data-action="guide-view:guide">${I('back')}Kembali ke Input</button></div><section class="card struktur-card" aria-labelledby="struktur-title" data-struktur="${id}"><span class="pill blue">Bab ${p.roman} · ${e(p.chapterName)}</span><h2 id="struktur-title">Struktur ${e(s.title)}</h2><p class="struktur-sub">${e(s.sub)}</p>${s.info ? note(e(s.info)) : ''}${kendalaBlock(id, s.rows)}<div class="struktur-table-wrap"><table class="struktur-table"><thead><tr><th scope="col">No.</th><th scope="col">Poin Pembahasan</th><th scope="col">Isi yang Perlu Dikembangkan</th></tr></thead><tbody>${rows}</tbody></table></div>${s.foot ? `<p class="struktur-rule">${strongOnly(s.foot)}</p>` : ''}<p class="struktur-note small muted">Saran berbasis judul, metode, dan isianmu, belum analisis AI. Tulis bagian ini dengan kalimatmu sendiri.</p><div class="struktur-foot">${status}<p class="struktur-next">Berikutnya: ${e(nx ? strukturTitle(nx) : 'Tinjau Progres Penelitian')}</p><div class="struktur-actions">${B('Unduh', 'struktur-unduh:' + id, '', 'download')}${main}</div></div></section>`;
}
/* DOCX struktur: disiapkan dulu, lalu diunduh lewat tombol kedua agar izin unduhan tetap berlaku. */
let strukturFile = null;
async function exportStruktur(id) {
  const p = PARTS[id];
  if (!p) return;
  const s = strukturFor(id),
    k = String(ensureKonteks().kendala || '').trim();
  modal('Menyiapkan Struktur', '<div class="process-state"><h3>Menyusun DOCX</h3><p>Poin pembahasan sedang disatukan.</p></div>');
  modalBusy = true;
  try {
    await loadScript('vendor/docx.js');
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, ShadingType } = docx;
    const cell = (text, opts = {}) =>
      new TableCell({
        width: { size: opts.w, type: WidthType.PERCENTAGE },
        shading: opts.head ? { type: ShadingType.CLEAR, color: 'auto', fill: 'EAF2FF' } : undefined,
        children: [new Paragraph({ children: [new TextRun({ text, bold: !!opts.bold })] })],
      });
    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            cell('No.', { w: 8, head: true, bold: true }),
            cell('Poin Pembahasan', { w: 30, head: true, bold: true }),
            cell('Isi yang Perlu Dikembangkan', { w: 62, head: true, bold: true }),
          ],
        }),
        ...s.rows.map(
          (r, i) => new TableRow({ children: [cell(String(i + 1), { w: 8 }), cell(r[0], { w: 30, bold: true }), cell(r[1], { w: 62 })] }),
        ),
      ],
    });
    const P = (t, opts = {}) => new Paragraph({ children: [new TextRun({ text: t, ...opts })], spacing: { after: 140 } });
    const nx = nextPart(id);
    const children = [
      P(`Bab ${p.roman} · ${p.chapterName}`, { color: '1F6FE0', bold: true }),
      new Paragraph({ text: 'Struktur ' + s.title, heading: HeadingLevel.HEADING_1 }),
      P(s.sub),
      S.title ? P('Judul: ' + S.title, { italics: true }) : null,
      s.info ? P('Catatan: ' + s.info) : null,
      k ? P('Kendalamu: ' + k) : null,
      table,
      s.foot ? P(s.foot.replace(/<\/?strong>/g, ''), { italics: true }) : null,
      P(''),
      P('Berikutnya: ' + (nx ? strukturTitle(nx) : 'Tinjau Progres Penelitian'), { color: '637087' }),
      P('Saran berbasis judul, metode, dan isianmu, belum analisis AI. Tulis bagian ini dengan kalimatmu sendiri.', { color: '637087' }),
    ].filter(Boolean);
    const blob = await Packer.toBlob(
      new Document({
        creator: 'Alerin Skripsi',
        title: 'Struktur ' + s.title,
        sections: [{ properties: { page: { margin: { top: 960, right: 1000, bottom: 960, left: 1000 } } }, children }],
      }),
    );
    strukturFile = { blob, filename: 'Struktur_' + s.title.replace(/[^a-z0-9]+/gi, '_') + '.docx' };
    modalBusy = false;
    closeModal(true);
    modal(
      'Struktur Siap Diunduh',
      `<div class="candidate-context"><span class="eyebrow">BAB ${p.roman} · ${e(p.chapterName.toUpperCase())}</span><h3>Struktur ${e(s.title)}</h3></div><p>Isi DOCX sama dengan yang tampil di situs: ${s.rows.length} poin pembahasan${k ? ' dan kendala dari Konteks' : ''}.</p><p class="small muted">DOCX · ${Math.ceil(blob.size / 1024)} KB</p>`,
      B('Tutup', 'close-modal') + B('Unduh DOCX', 'struktur-simpan', 'primary', 'download'),
    );
  } catch (error) {
    modalBusy = false;
    closeModal(true);
    modal('Struktur belum dapat disiapkan', `<p>${e(error.message || 'Coba unduh kembali.')}</p>`, B('Tutup', 'close-modal'));
  }
}

Object.assign(ACTIONS, {
  struktur: arg => {
    if (!PARTS[arg]) return;
    ensureGuide();
    S.guide.part = arg;
    S.guide.view = 'saran';
    persist();
    closeModal(true);
    if (route !== 'mulai') go('mulai');
    else render();
    window.scrollTo({ top: 0 });
  },
  /* Jadikan Progres Aktif: buat pekerjaan untuk subbagian ini lalu antar ke halaman Progres Aktif, tanpa membuka pop up. */
  'struktur-jadikan': arg => {
    if (!PARTS[arg]) return;
    ensureGuide();
    if (!partInputOk(arg)) {
      S.guide.part = arg;
      S.guide.view = 'guide';
      persist();
      if (route !== 'mulai') go('mulai');
      else render();
      validatePart(arg);
      toast(`Lengkapi isian ${PARTS[arg].name} dulu, lalu klik Kerjakan.`);
      return;
    }
    const exist = S.tasks.find(x => x.part === arg && x.status !== 'done');
    const t = exist || partTask(arg, { source: 'mulai' });
    if (!exist) {
      reorderTasks(false);
      fillSlots();
      record('Dijadikan Progres Aktif', t.title);
    }
    S.guide.view = 'guide';
    persist();
    const i = activeTasks().indexOf(t);
    toast(
      exist
        ? 'Bagian ini sudah ada di Progres Aktif.'
        : i >= 0
          ? `“${t.title}” masuk ke Progres Aktif sebagai ${slotName(t)}.`
          : `“${t.title}” masuk ke antrean Progres Aktif.`,
    );
    focusTaskInProgres(t.id);
  },
  'struktur-unduh': async arg => {
    await exportStruktur(arg);
  },
  'struktur-simpan': async () => {
    if (strukturFile) await saveFile(strukturFile.filename, strukturFile.blob);
  },
});
