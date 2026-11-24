'use strict';
/* Halaman hasil-awal. */
function lastDraftResult() {
  if (S.draftReady) {
    go('hasil-awal');
    return;
  }
  modal(
    'Hasil Pemeriksaan Terakhir',
    `<div class="empty-mini">${I('info')}<p>Maaf, kami tidak memiliki data apapun di sini.</p></div>`,
    B('Tutup', 'close-modal', 'primary'),
  );
}
function rangkumanRows() {
  const d = S.draft;
  return [
    ['Topik atau bidang yang ingin diteliti', d.topic],
    ['Fenomena atau masalah yang dilihat', d.phenomenon],
    ['Objek, subjek, atau lokasi penelitian', d.location],
    ['Teori, jurnal, atau metode yang sudah terpikirkan', d.idea],
    ['Target waktu awal', S.target.date ? dateLong(S.target.date) : ''],
  ].map(([h, v]) => [h, String(v || '').trim() || 'Belum diisi.']);
}
const SAMPLE_DESIGN = [
  [
    'Fokus dan tujuan',
    'Mendeskripsikan hambatan mahasiswa memperoleh pendidikan seksual, menganalisis pemanfaatan film sebagai media edukasi seksual, dan menjelaskan tindakan pengendalian diri. Ketiga fokus menjadi dasar pemilihan informan, penyusunan instrumen, dan arah pembahasan.',
  ],
  [
    'Pendekatan dan urutan pelaksanaan',
    'Metode campuran exploratory sequential: wawancara dan observasi lebih dahulu untuk menggali pengalaman mahasiswa, lalu kuesioner memberi dukungan deskriptif. Pada akhir analisis, kedua jenis data dipertemukan menurut rumusan masalah.',
  ],
  [
    'Instrumen dan pengumpulan data',
    'Wawancara semi terstruktur dan observasi melibatkan 16 informan dari empat kampus. Kuesioner daring 17 butir skala 1–5 direncanakan untuk 400 responden; penyajian contoh memakai kode informan.',
  ],
  [
    'Rencana analisis dan integrasi',
    'Analisis kualitatif mengacu pada Miles dan Huberman dengan triangulasi sumber. Data kuantitatif disajikan sebagai distribusi frekuensi dan persentase (SPSS 25); validitas dan reliabilitas dilaporkan terpisah. Konstruktivisme Jean Piaget dipakai untuk menafsirkan pembentukan pengetahuan.',
  ],
  [
    'Hasil yang diharapkan',
    'Arah penelitian yang dapat ditinjau pembimbing: masalah, tujuan, dan sumber bukti selaras serta batas penafsiran jelas. Rancangan tidak memuat hasil survei, kutipan wawancara, atau simpulan akhir sebagai fakta.',
  ],
];
const chosenTitle = () => selectedBundle()?.title || '';
const OUT = (b1, b2, b3) => [
  ['Bab I · Pendahuluan', b1],
  ['Bab II · Kajian Pustaka', b2],
  ['Bab III · Metode Penelitian', b3],
];
const SAMPLE_SET = [
  {
    method:
      'Metode campuran exploratory sequential: kualitatif lebih dahulu, didukung kuantitatif deskriptif dengan 16 informan dan 400 responden dari empat kampus.',
    questions: [
      'Hambatan apa saja yang dihadapi mahasiswa di Kota Malang dalam upaya memperoleh pendidikan seksual?',
      'Bagaimana peran film dalam memberikan informasi mengenai pendidikan seksual pada mahasiswa di Kota Malang?',
      'Bagaimana tindakan mahasiswa di Kota Malang setelah mendapatkan edukasi seksual dari film sebagai upaya pengendalian diri dari perilaku seksual yang tidak sehat?',
    ],
    outline: OUT(
      [
        [
          'Latar Belakang',
          'Uraikan pentingnya pendidikan seksual, sumber informasi dari keluarga dan sekolah, hambatan berupa anggapan tabu serta keterbatasan informasi, kebutuhan mahasiswa untuk belajar mandiri, dan posisi film sebagai salah satu media belajar. Tempatkan penelitian terdahulu dan celah penelitian sesuai konteks mahasiswa di Kota Malang.',
        ],
        [
          'Rumusan Masalah',
          'Gunakan tiga pertanyaan mengenai hambatan memperoleh pendidikan seksual, peran film dalam memberikan informasi, dan tindakan pengendalian diri. Pertahankan keselarasan dengan judul.',
        ],
        [
          'Tujuan Penelitian',
          'Deskripsikan hambatan, analisis pemanfaatan film sebagai media edukasi seksual, dan jelaskan pengendalian diri berdasarkan temuan lapangan.',
        ],
        [
          'Manfaat Penelitian',
          'Pisahkan manfaat teoretis bagi wawasan bidang pendidikan dan manfaat praktis bagi belajar mandiri mahasiswa serta masyarakat.',
        ],
      ],
      [
        [
          'Pemahaman Pendidikan Seksual',
          'Bahas ruang lingkup pendidikan seksual sesuai materi sumber, termasuk hubungan antarpribadi, kesehatan seksual, moral serta etika, dan informasi tentang kekerasan seksual. Penjelasan konseptual tidak diperlakukan sebagai temuan responden.',
        ],
        [
          'Pengendalian Diri',
          'Jelaskan konsep pengelolaan perilaku, pemahaman baik dan buruk, kemampuan menempatkan diri, dan tanggung jawab sebagaimana digunakan dalam naskah. Bagian ini muncul sebelum pembahasan Media Film.',
        ],
        [
          'Media Film dan Efektivitas Media Film',
          'Bahas film sebagai media komunikasi dan pendidikan; lanjutkan aspek akses, kejelasan, interaksi, relevansi, dan manfaat yang terdapat dalam kajian sumber. Judul penelitian tetap Peran Film.',
        ],
        [
          'Teori Konstruktivisme',
          'Jelaskan skema, asimilasi, akomodasi, dan ekuilibrasi serta keterkaitannya dengan proses belajar mahasiswa melalui film.',
        ],
      ],
      [
        [
          'Desain Penelitian',
          'Metode campuran; kualitatif terlebih dahulu, kemudian dukungan kuantitatif sesuai exploratory sequential design.',
        ],
        [
          'Populasi dan Sampel',
          'Cantumkan populasi tertulis 124.211 mahasiswa, 400 responden, sampling kuota, 16 informan, empat kampus, dan kriteria partisipan sesuai proposal.',
        ],
        [
          'Teknik Pengambilan Data',
          'Wawancara semi terstruktur, observasi, dan kuesioner daring 17 butir dengan skala 1–5.',
        ],
        [
          'Teknik Analisis Data',
          'Paparkan analisis kualitatif sesuai uraian sumber; distribusi frekuensi dan persentase kuantitatif; serta cara mempertemukan kedua jenis bukti untuk menjawab rumusan masalah.',
        ],
      ],
    ),
    framework: [
      [
        '01 Fenomena dan fokus',
        'Pendidikan seksual masih dianggap tabu dan informasi yang diperoleh mahasiswa dari keluarga serta lingkungan dapat terbatas. Penelitian berfokus pada hambatan memperoleh pendidikan seksual, peran film sebagai sumber informasi, dan tindakan pengendalian diri mahasiswa di Kota Malang.',
      ],
      [
        '02 Teori dan hubungan konsep',
        'Konstruktivisme Jean Piaget digunakan untuk menelaah hubungan pengetahuan awal mahasiswa dengan informasi pendidikan seksual yang diperoleh melalui film. Konsep skema, asimilasi, akomodasi, dan ekuilibrasi membantu membaca proses pembentukan serta penyesuaian pemahaman, termasuk penjelasan mahasiswa mengenai pengendalian diri.',
      ],
      [
        '03 Argumen / alur berpikir',
        'Keterbatasan informasi pendidikan seksual mendorong kebutuhan belajar mandiri. Film dikaji sebagai salah satu sumber informasi yang dipertemukan dengan pengetahuan awal mahasiswa. Proses pemahaman tersebut ditelaah melalui konstruktivisme, lalu dikaitkan dengan tindakan pengendalian diri yang dijelaskan mahasiswa. Hubungan ini menjadi arah penelaahan, belum merupakan bukti pengaruh sebab akibat.',
      ],
      [
        '04 Rancangan metode dan data',
        'Gunakan metode campuran dengan kualitatif terlebih dahulu, kemudian didukung kuantitatif. Wawancara dan observasi melibatkan 16 informan dari empat kampus; hasil kualitatif menjadi dasar tahap kuesioner pada 400 responden. Kuesioner memuat 17 butir skala 1–5. Analisis kualitatif dipertemukan dengan distribusi frekuensi dan persentase untuk membahas tiga rumusan masalah.',
      ],
    ],
  },
  {
    method:
      'Kualitatif: wawancara semi terstruktur dan observasi pada mahasiswa dewasa di Kota Malang. Jumlah dan kriteria informan ditetapkan bersama pembimbing.',
    questions: [
      'Bagaimana mahasiswa di Kota Malang memilih film sebagai sumber informasi pendidikan seksual?',
      'Bagaimana mahasiswa menafsirkan informasi pendidikan seksual yang diperoleh dari film?',
      'Bagaimana mahasiswa menilai kegunaan informasi tersebut bagi kehidupannya?',
    ],
    outline: OUT(
      [
        [
          'Latar Belakang',
          'Kebutuhan informasi pendidikan seksual, anggapan tabu, dan kebiasaan mahasiswa memakai film sebagai sumber belajar mandiri; tempatkan studi terdahulu tentang pengalaman menonton.',
        ],
        ['Rumusan Masalah', 'Tiga pertanyaan tentang memilih, menafsirkan, dan menilai informasi dari film.'],
        [
          'Tujuan Penelitian',
          'Memahami pengalaman mahasiswa memanfaatkan film sebagai sumber informasi pendidikan seksual.',
        ],
        ['Manfaat Penelitian', 'Teoretis bagi kajian media dan pendidikan; praktis bagi literasi media mahasiswa.'],
      ],
      [
        ['Pendidikan Seksual', 'Ruang lingkup pendidikan seksual sesuai sumber yang dirujuk.'],
        ['Film sebagai Sumber Informasi', 'Akses, kejelasan, dan relevansi pesan film.'],
        ['Pengalaman dan Pemaknaan Audiens', 'Cara audiens menafsirkan pesan media.'],
        ['Teori Konstruktivisme', 'Skema, asimilasi, dan akomodasi sebagai lensa penafsiran.'],
      ],
      [
        ['Desain Penelitian', 'Kualitatif dengan fokus pengalaman informan.'],
        ['Informan Penelitian', 'Mahasiswa dewasa di Kota Malang; jumlah dan kriteria ditetapkan bersama pembimbing.'],
        ['Teknik Pengambilan Data', 'Wawancara semi terstruktur dan observasi.'],
        ['Teknik Analisis Data', 'Reduksi, penyajian, dan penarikan kesimpulan dengan triangulasi sumber.'],
      ],
    ),
    framework: [
      [
        '01 Fenomena dan fokus',
        'Mahasiswa mencari informasi pendidikan seksual secara mandiri karena pembahasannya masih dianggap tabu. Fokus: pengalaman memilih, menafsirkan, dan menilai informasi dari film.',
      ],
      [
        '02 Teori dan hubungan konsep',
        'Konstruktivisme Jean Piaget membaca bagaimana pengalaman menonton bertemu pengetahuan awal mahasiswa melalui skema, asimilasi, dan akomodasi.',
      ],
      [
        '03 Argumen / alur berpikir',
        'Kebutuhan informasi → pemilihan film → penafsiran pesan → penilaian kegunaan. Alur ini menelaah pengalaman, bukan mengukur pengaruh film.',
      ],
      [
        '04 Rancangan metode dan data',
        'Kualitatif: wawancara semi terstruktur dan observasi pada mahasiswa dewasa di Kota Malang. Jumlah dan kriteria informan ditetapkan bersama pembimbing; analisis mengikuti tema pengalaman.',
      ],
    ],
  },
  {
    method:
      'Kualitatif: wawancara semi terstruktur dan observasi. Batas populasi dan lokasi penelitian perlu ditegaskan kembali bersama pembimbing.',
    questions: [
      'Hambatan apa yang dihadapi mahasiswa dalam mengakses pendidikan seksual?',
      'Mengapa mahasiswa memilih film sebagai sumber belajar mandiri tentang pendidikan seksual?',
      'Bagaimana hambatan akses berkaitan dengan cara mahasiswa memanfaatkan film?',
    ],
    outline: OUT(
      [
        [
          'Latar Belakang',
          'Hambatan akses pendidikan seksual dari keluarga, sekolah, dan lingkungan, serta munculnya film sebagai sumber belajar mandiri.',
        ],
        ['Rumusan Masalah', 'Tiga pertanyaan tentang hambatan akses, alasan memilih film, dan keterkaitannya.'],
        [
          'Tujuan Penelitian',
          'Mendeskripsikan hambatan akses dan menjelaskan pemanfaatan film sebagai sumber belajar mandiri.',
        ],
        ['Manfaat Penelitian', 'Teoretis bagi kajian pendidikan; praktis bagi penyedia informasi pendidikan seksual.'],
      ],
      [
        ['Akses Pendidikan Seksual', 'Sumber informasi formal dan informal serta hambatannya.'],
        ['Belajar Mandiri', 'Cara mahasiswa memilih sumber belajar.'],
        ['Media Film', 'Film sebagai sumber belajar: akses, kejelasan, dan relevansi.'],
        ['Teori Konstruktivisme', 'Pembentukan pemahaman dari sumber yang tersedia.'],
      ],
      [
        ['Desain Penelitian', 'Kualitatif deskriptif.'],
        ['Lokasi dan Informan', 'Batas populasi dan lokasi ditegaskan bersama pembimbing.'],
        ['Teknik Pengambilan Data', 'Wawancara semi terstruktur dan observasi.'],
        ['Teknik Analisis Data', 'Analisis tematik dengan triangulasi sumber.'],
      ],
    ),
    framework: [
      [
        '01 Fenomena dan fokus',
        'Akses pendidikan seksual dari keluarga, sekolah, dan lingkungan dapat terbatas. Fokus: hambatan akses dan alasan mahasiswa memilih film sebagai sumber belajar mandiri.',
      ],
      [
        '02 Teori dan hubungan konsep',
        'Konstruktivisme Jean Piaget menempatkan mahasiswa sebagai pembelajar yang membangun pemahaman dari sumber yang tersedia, termasuk film.',
      ],
      [
        '03 Argumen / alur berpikir',
        'Hambatan akses → kebutuhan belajar mandiri → pemilihan film → cara memanfaatkannya. Hubungan ditelaah dari penjelasan informan, bukan diuji sebab akibat.',
      ],
      [
        '04 Rancangan metode dan data',
        'Kualitatif: wawancara semi terstruktur dan observasi. Batas populasi dan lokasi penelitian perlu ditegaskan kembali bersama pembimbing.',
      ],
    ],
  },
  {
    method:
      'Kualitatif: wawancara mendalam dan observasi pada mahasiswa dewasa; pedoman wawancara mengikuti konsep Piaget. Jumlah informan ditetapkan bersama pembimbing.',
    questions: [
      'Bagaimana skema awal mahasiswa tentang pendidikan seksual sebelum menonton film?',
      'Bagaimana asimilasi dan akomodasi terjadi ketika mahasiswa menerima informasi dari film?',
      'Bagaimana mahasiswa mencapai ekuilibrasi dalam memaknai pendidikan seksual dan pengendalian diri?',
    ],
    outline: OUT(
      [
        [
          'Latar Belakang',
          'Keterbatasan informasi pendidikan seksual dan film sebagai sumber pemaknaan; tunjukkan alasan memilih perspektif konstruktivisme.',
        ],
        ['Rumusan Masalah', 'Tiga pertanyaan mengikuti skema, asimilasi–akomodasi, dan ekuilibrasi.'],
        [
          'Tujuan Penelitian',
          'Menjelaskan proses pemaknaan pendidikan seksual melalui film dalam perspektif konstruktivisme.',
        ],
        [
          'Manfaat Penelitian',
          'Teoretis bagi penerapan konstruktivisme; praktis bagi pendidikan seksual berbasis media.',
        ],
      ],
      [
        ['Teori Konstruktivisme Jean Piaget', 'Skema, asimilasi, akomodasi, dan ekuilibrasi sebagai kerangka utama.'],
        ['Pendidikan Seksual', 'Ruang lingkup sesuai sumber yang dirujuk.'],
        ['Film sebagai Media Belajar', 'Film sebagai sumber informasi yang dimaknai mahasiswa.'],
        ['Pengendalian Diri', 'Konsep pengendalian diri sebagai hasil pemaknaan.'],
      ],
      [
        ['Desain Penelitian', 'Kualitatif dengan lensa konstruktivisme.'],
        ['Informan Penelitian', 'Mahasiswa dewasa di Kota Malang; kriteria ditetapkan bersama pembimbing.'],
        ['Teknik Pengambilan Data', 'Wawancara mendalam dan observasi berpedoman konsep Piaget.'],
        ['Teknik Analisis Data', 'Pengodean berdasarkan konsep teori, lalu pemeriksaan silang antarinforman.'],
      ],
    ),
    framework: [
      [
        '01 Fenomena dan fokus',
        'Informasi pendidikan seksual terbatas dan dianggap tabu, sehingga film menjadi salah satu sumber pemaknaan. Fokus: proses pembentukan dan penyesuaian pengetahuan mahasiswa di Kota Malang.',
      ],
      [
        '02 Teori dan hubungan konsep',
        'Konstruktivisme Jean Piaget menjadi pusat penelaahan: skema awal, asimilasi informasi baru, akomodasi saat informasi berbeda, dan ekuilibrasi sebagai pemahaman yang lebih stabil.',
      ],
      [
        '03 Argumen / alur berpikir',
        'Skema awal → bertemu informasi dari film → asimilasi atau akomodasi → ekuilibrasi → penjelasan pengendalian diri. Kecukupan bukti untuk setiap konsep perlu dipastikan.',
      ],
      [
        '04 Rancangan metode dan data',
        'Kualitatif: wawancara mendalam dan observasi pada mahasiswa dewasa; pedoman wawancara disusun mengikuti konsep Piaget. Jumlah informan ditetapkan bersama pembimbing.',
      ],
    ],
  },
  {
    method:
      'Metode campuran exploratory sequential: 16 informan dari empat kampus lebih dahulu, lalu kuesioner 17 butir skala 1–5 pada 400 responden.',
    questions: [
      'Bagaimana mahasiswa menjelaskan peran film sebagai sumber informasi pendidikan seksual?',
      'Bagaimana gambaran deskriptif pemanfaatan film dan pengendalian diri berdasarkan kuesioner?',
      'Bagaimana bukti kualitatif dan kuantitatif saling melengkapi dalam menjelaskan pengendalian diri mahasiswa?',
    ],
    outline: OUT(
      [
        [
          'Latar Belakang',
          'Pendidikan seksual, anggapan tabu, film sebagai sumber informasi, dan alasan memakai metode campuran.',
        ],
        ['Rumusan Masalah', 'Tiga pertanyaan: kualitatif, kuantitatif deskriptif, dan integrasi.'],
        ['Tujuan Penelitian', 'Menjelaskan peran film dan pengendalian diri melalui dua jenis bukti.'],
        ['Manfaat Penelitian', 'Teoretis bagi kajian media pendidikan; praktis bagi program edukasi kampus.'],
      ],
      [
        ['Pendidikan Seksual dan Pengendalian Diri', 'Konsep dan indikator yang dipakai.'],
        ['Media Film', 'Akses, kejelasan, interaksi, relevansi, dan manfaat.'],
        ['Teori Konstruktivisme', 'Lensa penafsiran pembentukan pemahaman.'],
        ['Kerangka Integrasi', 'Cara temuan kualitatif membentuk instrumen kuantitatif.'],
      ],
      [
        ['Desain Penelitian', 'Metode campuran exploratory sequential.'],
        ['Populasi dan Sampel', '16 informan dan 400 responden dari empat kampus; dasar pemilihan dikonfirmasi.'],
        ['Teknik Pengambilan Data', 'Wawancara, observasi, dan kuesioner 17 butir skala 1–5.'],
        ['Teknik Analisis Data', 'Analisis kualitatif, frekuensi dan persentase, lalu integrasi per rumusan masalah.'],
      ],
    ),
    framework: [
      [
        '01 Fenomena dan fokus',
        'Pendidikan seksual masih dianggap tabu, sementara film menjadi salah satu sumber informasi mahasiswa. Fokus: peran film, informasi pendidikan seksual, dan pengendalian diri di Kota Malang.',
      ],
      [
        '02 Teori dan hubungan konsep',
        'Konstruktivisme Jean Piaget menafsirkan pembentukan pemahaman; konsep pengendalian diri menjadi dasar indikator kuesioner.',
      ],
      [
        '03 Argumen / alur berpikir',
        'Pengalaman informan → indikator kuesioner → gambaran deskriptif responden → integrasi dua jenis bukti. Integrasi menjelaskan pola, bukan membuktikan sebab akibat.',
      ],
      [
        '04 Rancangan metode dan data',
        'Metode campuran exploratory sequential: 16 informan dari empat kampus lebih dahulu, lalu kuesioner 17 butir skala 1–5 pada 400 responden; frekuensi dan persentase dipertemukan dengan temuan kualitatif.',
      ],
    ],
  },
];
const numberedQuestions = qs => qs.map((q, i) => `${i + 1}. ${q}`).join('\n');
function outlineText(outline) {
  return outline.map(([ch, subs]) => ch + '\n' + subs.map(([h, p]) => h + '\n' + p).join('\n')).join('\n');
}
function outlineHtml(outline) {
  return outline
    .map(
      ([ch, subs]) =>
        `<div class="component outline-ch"><h4>${e(ch)}</h4><dl class="outline-sub">${subs.map(([h, p]) => `<div><dt>${e(h)}</dt><dd>${e(p)}</dd></div>`).join('')}</dl></div>`,
    )
    .join('');
}
function frameworkHtml(rows) {
  return `<div class="frame-flow">${rows
    .map(([label, text], i) => {
      const [num, ...rest] = label.split(' ');
      return `${i ? `<span class="frame-arrow" aria-hidden="true">${I('arrowDown')}</span>` : ''}<section class="frame-node"><span class="frame-num">${e(num)}</span><div><h4>${e(rest.join(' '))}</h4>${
        /\n/.test(text)
          ? `<ol>${text
              .split('\n')
              .map(q => `<li>${e(q.replace(/^\d+\.\s*/, ''))}</li>`)
              .join('')}</ol>`
          : `<p>${e(text)}</p>`
      }</div></section>`;
    })
    .join('')}</div>`;
}
function currentBundle(index) {
  const options = titleOptions();
  index = Number(index);
  const t = options[index];
  if (!t) return null;
  const d = S.draft,
    sample = S.draftSample;
  const signature = JSON.stringify(['output-v5', t[0], d, sample, S.plan, konteksMethodLabel()]);
  const key = hashKey(t[0]);
  S.researchBundles ??= {};
  if (S.researchBundles[key]?.signature === signature) return S.researchBundles[key];
  let focus, questions, method, theory, design, outline, framework;
  if (sample) {
    const set = SAMPLE_SET[index] || SAMPLE_SET[0];
    questions = numberedQuestions(set.questions);
    method = set.method;
    theory = ALERIN.draft.theory;
    outline = set.outline;
    framework = [...set.framework, ['05 Rumusan masalah yang ditelaah', questions]];
    focus = set.framework[0][1].replace(/^.*(Fokus:|berfokus pada)\s*/, '');
    const tujuan = set.outline[0][1].find(x => x[0] === 'Tujuan Penelitian')?.[1] || '';
    design =
      index === 0
        ? SAMPLE_DESIGN
        : [
            ['Fokus dan tujuan', tujuan + ' Fokus: ' + focus],
            ['Pendekatan dan urutan pelaksanaan', method],
            [
              'Instrumen dan pengumpulan data',
              set.outline[2][1].find(x => x[0] === 'Teknik Pengambilan Data')[1] + ' ' + set.outline[2][1][1][1],
            ],
            [
              'Rencana analisis dan integrasi',
              set.outline[2][1].find(x => x[0] === 'Teknik Analisis Data')[1] + ' ' + set.framework[1][1],
            ],
            [
              'Hasil yang diharapkan',
              'Usulan arah yang perlu ditinjau pembimbing. Perubahan dari rancangan sumber tidak memuat hasil lapangan baru atau jaminan judul diterima.',
            ],
          ];
  } else {
    const topic = trimDot(d.topic),
      phen = trimDot(d.phenomenon),
      loc = trimDot(d.location),
      idea = trimDot(d.idea),
      mLabel = konteksMethodLabel(),
      fromKonteks = /kualitatif|kuantitatif|campuran|r&d|pengembangan/i.test(S.konteks?.method || '');
    const lc = v => (v ? v.charAt(0).toLowerCase() + v.slice(1) : '');
    focus = topic && phen ? `${capitalize(topic)}: ${lc(phen)}.` : capitalize(topic || phen) + '.';
    const subj = loc
      ? `Penelitian diarahkan pada ${lc(loc)}.`
      : 'Objek, subjek, atau lokasi penelitian belum ditentukan.';
    const mText = {
      Kuantitatif: 'pendekatan kuantitatif: mengukur variabel lalu menganalisis hubungannya secara statistik',
      Kualitatif: 'pendekatan kualitatif: menggali pengalaman, proses, atau makna secara mendalam',
      'Metode campuran': 'metode campuran: memadukan data kuantitatif dan kualitatif dengan urutan yang jelas',
      'R&D': 'penelitian dan pengembangan (R&D): mengembangkan produk lalu menguji kelayakan dan penggunaannya',
    }[mLabel];
    method = !mText
      ? 'Pendekatan belum disebutkan. Tentukan setelah rumusan masalah jelas: kualitatif untuk menggali pengalaman, kuantitatif untuk mengukur hubungan, atau metode campuran bila keduanya dibutuhkan.'
      : fromKonteks
        ? `Mengikuti metode di Konteks, rancangan memakai ${mText}. Pastikan pendekatan ini dapat menjawab rumusan masalah dan sesuai data yang dapat diakses.`
        : `Isianmu mengarah pada ${mText}. Pastikan pendekatan ini dapat menjawab rumusan masalah, lalu tetapkan metodenya di Konteks.`;
    theory = idea
      ? `Gagasan yang sudah terpikirkan: ${idea}. Gunakan sebagai lensa penafsiran, bukan kesimpulan awal.`
      : 'Teori belum ditentukan. Telusuri literatur melalui Validasi Literatur pada Opsi Judul.';
    const target = loc ? lc(loc) : 'subjek penelitian';
    const tp = lc(topic) || 'topik penelitian',
      ph = lc(phen) || 'fenomena yang diamati';
    questions = numberedQuestions(
      mLabel === 'Kuantitatif'
        ? [
            `Bagaimana gambaran ${tp} pada ${target}?`,
            `Apakah terdapat pengaruh faktor yang berkaitan dengan ${ph} pada ${target}?`,
            `Seberapa besar pengaruh faktor tersebut secara bersama-sama?`,
          ]
        : mLabel === 'Metode campuran'
          ? [
              `Bagaimana gambaran ${tp} pada ${target} berdasarkan data pengukuran?`,
              `Bagaimana ${target} memaknai ${ph}?`,
              `Bagaimana temuan kualitatif menjelaskan hasil pengukuran?`,
            ]
          : mLabel === 'R&D'
            ? [
                `Bagaimana kebutuhan ${target} terkait ${tp}?`,
                `Bagaimana kelayakan produk yang dikembangkan menurut validator ahli?`,
                `Bagaimana kepraktisan dan keefektifan produk bagi ${target}?`,
              ]
            : [
                `Bagaimana gambaran ${tp} pada ${target}?`,
                `Faktor apa saja yang berkaitan dengan ${ph}?`,
                `Bagaimana ${target} menjelaskan atau menyikapi fenomena tersebut?`,
              ],
    );
    const dataTech =
      mLabel === 'Kuantitatif'
        ? 'Kuesioner dengan indikator yang diturunkan dari teori.'
        : mLabel === 'Kualitatif'
          ? 'Wawancara dan observasi sesuai fokus penelitian.'
          : mLabel === 'Metode campuran'
            ? 'Wawancara, observasi, dan kuesioner sesuai urutan desain.'
            : mLabel === 'R&D'
              ? 'Lembar validasi ahli, angket respons pengguna, dan tes sesuai tahap pengembangan.'
              : 'Ditentukan setelah pendekatan dipilih.';
    const anaTech =
      mLabel === 'Kuantitatif'
        ? 'Statistik deskriptif atau inferensial sesuai rumusan masalah.'
        : mLabel === 'Kualitatif'
          ? 'Reduksi, penyajian, dan penarikan kesimpulan dengan triangulasi.'
          : mLabel === 'Metode campuran'
            ? 'Analisis kualitatif dan kuantitatif, lalu integrasi temuan.'
            : mLabel === 'R&D'
              ? 'Analisis kelayakan, kepraktisan, dan keefektifan produk sesuai model pengembangan.'
              : 'Dicocokkan dengan pertanyaan dan karakter data.';
    design = [
      [
        'Fokus dan tujuan',
        `Penelitian berangkat dari ${lc(topic) || 'topik yang diminati'}${phen ? ` dengan fenomena: ${lc(phen)}` : ''}. Fokus dan tujuan perlu dirumuskan lebih spesifik bersama pembimbing.`,
      ],
      ['Pendekatan dan urutan pelaksanaan', method],
      ['Instrumen dan pengumpulan data', `${subj} ${dataTech} Akses data dan izin perlu dipastikan.`],
      ['Rencana analisis dan integrasi', `${anaTech} ${theory}`],
      [
        'Hasil yang diharapkan',
        'Arah penelitian awal yang dapat dibawa ke pembimbing. Rancangan ini tidak memuat data, kutipan, atau simpulan sebagai fakta.',
      ],
    ];
    outline = OUT(
      [
        [
          'Latar Belakang',
          phen
            ? `Uraikan fenomena: ${lc(phen)}. Jelaskan pentingnya ${lc(topic) || 'topik ini'} dan tempatkan penelitian terdahulu sebelum menyatakan celah.`
            : `Jelaskan pentingnya ${lc(topic) || 'topik ini'} dan tempatkan penelitian terdahulu sebelum menyatakan celah.`,
        ],
        ['Rumusan Masalah', 'Susun dua sampai tiga pertanyaan yang menjawab fenomena utama dan selaras dengan judul.'],
        ['Tujuan Penelitian', 'Turunkan tujuan dari setiap rumusan masalah.'],
        ['Manfaat Penelitian', 'Pisahkan manfaat teoretis dan praktis.'],
      ],
      [
        ['Konsep Utama', `Bahas konsep ${lc(topic) || 'utama penelitian'} dari sumber yang dapat ditelusuri.`],
        [
          'Teori Pendukung',
          idea
            ? `Kembangkan gagasan yang sudah terpikirkan: ${idea}.`
            : 'Teori belum ditentukan; telusuri melalui Validasi Literatur.',
        ],
        ['Penelitian Terdahulu', 'Bandingkan studi relevan untuk menunjukkan posisi penelitian.'],
        ['Kerangka Berpikir', 'Hubungkan fenomena, konsep, dan pertanyaan penelitian.'],
      ],
      [
        [
          'Desain Penelitian',
          {
            Kuantitatif: 'Kuantitatif · survei atau desain pengukuran lain yang sesuai rumusan masalah.',
            Kualitatif: 'Kualitatif · studi kasus, fenomenologi, atau desain lain yang sesuai fokus.',
            'Metode campuran': 'Metode campuran · tentukan urutan kuantitatif dan kualitatif serta titik integrasinya.',
            'R&D': 'Penelitian dan pengembangan (R&D) · tentukan model pengembangan, validasi ahli, dan uji coba.',
          }[mLabel] || 'Pendekatan belum ditentukan. Pilih metode di Konteks.',
        ],
        ['Subjek dan Lokasi', loc ? capitalize(loc) + '.' : 'Belum ditentukan.'],
        ['Teknik Pengambilan Data', dataTech],
        ['Teknik Analisis Data', anaTech],
      ],
    );
    framework = [
      [
        '01 Fenomena dan fokus',
        `${phen ? capitalize(phen) + '.' : 'Fenomena belum diisi.'} Fokus awal: ${lc(topic) || 'belum ditentukan'}.`,
      ],
      ['02 Teori dan hubungan konsep', theory],
      [
        '03 Argumen / alur berpikir',
        `${phen ? 'Fenomena yang diamati' : 'Topik yang diminati'} → konsep utama ${lc(topic) || 'penelitian'} → penelaahan melalui ${idea ? 'teori atau metode yang dipilih' : 'teori yang akan ditentukan'} → arah pertanyaan penelitian. Belum merupakan bukti sebab akibat.`,
      ],
      ['04 Rancangan metode dan data', `${method} ${subj}`],
      ['05 Rumusan masalah yang ditelaah', questions],
    ];
  }
  return (S.researchBundles[key] = {
    key,
    index,
    title: t[0],
    signature,
    focus,
    questions,
    method,
    theory,
    design: boundedRows(design),
    outline,
    framework,
    summary: rangkumanRows(),
    sample,
    alternative: sample && index > 0,
  });
}
function designRows(bundle) {
  const active = selectedBundle();
  return boundedRows(
    active && bundle.key === active.key ? [['Judul penelitian', bundle.title], ...bundle.design] : bundle.design,
  );
}
function candidateModal(index, type) {
  const b = currentBundle(index);
  if (!b) return;
  const isFrame = type === 'framework',
    isActive = chosenTitle() === b.title;
  const text = isFrame ? rowText(b.framework) : outlineText(b.outline);
  modal(
    isFrame ? 'Kerangka Berpikir' : 'Outline Judul',
    `<div class="candidate-context">${badge(isActive ? 'Judul dipilih' : 'Pratinjau kandidat', 'blue')}<h3>${e(b.title)}</h3><p>${b.alternative ? 'Penyesuaian kandidat merupakan usulan berdasarkan konteks dokumen fitur; kebutuhan metode dan data perlu ditinjau kembali.' : S.draftSample ? 'Disusun mengikuti fokus, metode, dan sumber penelitian pada dokumen fitur.' : 'Disusun dari ide penelitian yang kamu isi; bagian yang belum diisi ditandai untuk dilengkapi.'}</p></div>${isFrame ? `<div data-output="framework" data-character-count="${text.length}">${frameworkHtml(b.framework)}</div><p class="small muted">Bagan arah penelaahan. Hubungan antarkonsep belum merupakan bukti sebab akibat.</p>` : `<div data-output="outline" data-character-count="${text.length}">${outlineHtml(b.outline)}</div><p class="small muted">Arahan isi setiap subbab disusun dari ide penelitian dan perlu dikembangkan bersama pembimbing.</p>`}`,
    B('Kembali', 'close-modal'),
    true,
  );
}
function selectedBundle() {
  const a = S.activeResearch;
  if (!a || a.title !== S.title || !(a.index >= 0)) return null;
  const b = currentBundle(a.index);
  return b ? { ...b, title: S.title } : null;
}
function hasilAwalPage() {
  S.draftReady = true;
  outputTab = outputTab === 'titles' ? 'titles' : 'design';
  const active = selectedBundle(),
    bundle = active || currentBundle(0),
    rows = designRows(bundle),
    opts = titleOptions();

  const isDefaultOrTest =
    !S.draft?.topic ||
    isAsal(S.draft.topic) ||
    /algoritma|video pendek|fatigue|reels/i.test(S.draft.topic) ||
    String(S.draft.topic).length < 5;
  const displayTopic = isDefaultOrTest
    ? 'Pengaruh algoritma konten video pendek (TikTok/Reels) terhadap fenomena social media fatigue dan pola konsumsi informasi audiens muda.'
    : S.draft.topic;

  const design = `<section class="output-section"><div class="section-head"><div><h3>Rancangan Penelitian</h3><p class="small">${active ? 'Mengikuti judul yang kamu pilih.' : 'Arah awal dari isianmu. Pilih satu judul di tab Opsi Judul.'} Disusun dari isianmu, belum analisis AI.</p></div>${badge('Contoh', '')}</div><div data-output="design">${outputRows(rows, false)}</div></section>`;

  const titles = opts
    .map((t, i) => {
      const on = active && active.index === i;
      const optNum = String(i + 1).padStart(2, '0');
      const optType = (t[1] || 'ALTERNATIF').toUpperCase();
      return `
        <div class="hasil-awal-option-card ${on ? 'selected' : ''}" data-title-option="${i}">
          <div class="hasil-awal-option-header">
            <div class="hasil-awal-option-label">OPSI ${optNum} · ${e(optType)}</div>
            <div class="hasil-awal-option-badge">${on ? 'Judul dipilih' : 'Contoh'}</div>
          </div>
          <div class="hasil-awal-option-title">${e(on ? S.title : t[0])}</div>
          <div class="hasil-awal-option-meta">
            <div class="hasil-awal-option-desc">${e(t[2])}</div>
            <div class="hasil-awal-option-need">
              <span class="hasil-awal-need-bold">Kebutuhan:</span>
              <span class="hasil-awal-need-text"> Ketepatan rumusan dan dukungan sumber perlu dibahas dengan pembimbing.</span>
            </div>
          </div>
          <div class="hasil-awal-option-actions">
            <button type="button" class="hasil-awal-btn-action" data-action="literature:${i}">
              ${I('book')}
              <span>Validasi Literatur</span>
            </button>
            <button type="button" class="hasil-awal-btn-action" data-action="candidate-framework:${i}">
              ${I('map')}
              <span>Kerangka Berpikir</span>
            </button>
            <button type="button" class="hasil-awal-btn-action" data-action="candidate-outline:${i}">
              ${I('document')}
              <span>Outline Judul</span>
            </button>
            ${on 
              ? `<button type="button" class="hasil-awal-btn-choose" data-action="guide-view:guide"><span>Buka Bab I</span></button>`
              : `<button type="button" class="hasil-awal-btn-choose" data-action="choose-title:${i}"><span>Pilih Judul</span></button>`
            }
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <div class="hasil-awal-container">
      <!-- HEADER ROW -->
      <div class="hasil-awal-head">
        <div class="hasil-awal-head-left">
          <h1 class="hasil-awal-title">Arah penelitian awal</h1>
          <p class="hasil-awal-subtitle">Tinjau rancangan, bandingkan judul, lalu pilih arah yang akan dikembangkan.</p>
        </div>
        <button type="button" class="hasil-awal-btn-edit" data-action="guide-view:idea">
          ${I('edit')}
          <span>Edit isian</span>
        </button>
      </div>

      <!-- BANNER BERDASARKAN ISIAN PENGGUNA -->
      <div class="hasil-awal-banner">
        <div class="hasil-awal-banner-tag">Berdasarkan isian pengguna</div>
        <div class="hasil-awal-banner-title">${e(displayTopic)}</div>
        <div class="hasil-awal-banner-desc">Rancangan merupakan bahan diskusi pembimbing. Outline dan kerangka berpikir tersedia pada setiap opsi judul.</div>
      </div>

      <!-- TABS BAR -->
      <div class="hasil-awal-tabs" role="tablist" aria-label="Hasil arah penelitian">
        <button type="button" role="tab" aria-selected="${outputTab === 'design'}" class="hasil-awal-tab-item ${outputTab === 'design' ? 'active' : ''}" data-action="output-tab:design">
          <span>Rancangan</span>
        </button>
        <button type="button" role="tab" aria-selected="${outputTab === 'titles'}" class="hasil-awal-tab-item ${outputTab === 'titles' ? 'active' : ''}" data-action="output-tab:titles">
          <span>Opsi Judul (${opts.length})</span>
        </button>
      </div>

      <!-- TAB CONTENT -->
      <div class="hasil-awal-content" role="tabpanel">
        ${outputTab === 'design' ? design : `<div class="hasil-awal-cards-list">${titles}</div>`}
      </div>
    </div>
  `;
}
function chooseTitleModal(i) {
  const t = titleOptions()[+i];
  if (!t) return;
  const title = t[0];
  const b = currentBundle(+i);
  const old = S.title;
  if (old && old !== title) {
    (S.titleVersions ??= []).push({ title: old, time: new Date().toISOString() });
    S.needsReview = true;
  }
  S.title = title;
  S.activeResearch = { key: b?.key, title, index: +i };
  S.review.title = title;
  S.sample = false;
  S.titleChosenAt = new Date().toISOString();
  S.stageLog = (S.stageLog || []).filter(x => x.stage !== 0);
  S.stageLog.unshift({ stage: 0, text: 'Judul dipilih', by: 'menurut pengguna', date: isoToday() });

  const sp = splitTheoryMethod(S.draft?.idea);
  if (sp.method && !S.profile.method) S.profile.method = detectMethod(sp.method);

  ensureGuide();
  S.guide.view = 'guide';
  S.guide.part = 'background';
  guideSeed();

  const doneBg = !S.tasks.some(x => x.part === 'background' && x.status !== 'done') &&
    S.tasks.find(x => x.part === 'background' && x.status === 'done');
  const task =
    doneBg ||
    partTask('background', {
      source: 'mulai',
      reason: 'Judul sudah dipilih. Latar belakang menjadi dasar rumusan masalah dan bab berikutnya.',
    });
  const ch = +(S.konteks?.chapter || 1);
  syncTasksForChapter(ch);
  record(old && old !== title ? 'Judul diganti' : 'Judul dipilih', title);
  synchronizeResearch();
  persist();
  render();

  showTitleChosenModal(i, title);
}

function showTitleChosenModal(i, title) {
  lastFocus = document.activeElement;
  modalDirty = false;
  $('#overlay-root').innerHTML = `
    <div class="overlay" data-overlay="true">
      <div class="pilih-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="pilih-modal-title">
        <button type="button" class="pilih-modal-close" data-action="close-modal" aria-label="Tutup jendela">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="pilih-modal-header">
          <div class="pilih-modal-icon-wrap">
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
              <path d="M16 3H7C5.89543 3 5 3.89543 5 5V23C5 24.1046 5.89543 25 7 25H16" stroke="#186DD8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 3L21 8V14" stroke="#186DD8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 3V8H21" stroke="#186DD8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 12H14" stroke="#186DD8" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 16H13" stroke="#186DD8" stroke-width="2" stroke-linecap="round"/>
              <circle cx="19.5" cy="19.5" r="5.5" fill="#186DD8"/>
              <path d="M17 19.5L18.8 21.3L22.2 17.7" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 id="pilih-modal-title" class="pilih-modal-title">Judul penelitianmu sudah dipilih</h2>
        </div>

        <div class="pilih-modal-box">
          <div class="pilih-modal-box-tag">Judul Aktif</div>
          <div class="pilih-modal-box-text">${e(title)}</div>
        </div>

        <p class="pilih-modal-desc">Unduh outline untuk bahan bimbingan, atau lanjutkan penyusunan Bab 1.</p>

        <div class="pilih-modal-actions">
          <div class="pilih-modal-downloads">
            <button type="button" class="pilih-modal-btn-download" data-action="download-outline:${i}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Unduh Outline</span>
            </button>
          </div>
          <button type="button" class="pilih-modal-btn-primary" data-action="go-bab-1:${i}">
            <span>Lanjutkan ke Bab 1</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.style.overflow = 'hidden';
}
window.showTitleChosenModal = showTitleChosenModal;

Object.assign(ACTIONS, {
  'v2-show-titles': () => {
    outputTab = 'titles';
    go('hasil-awal');
  },
  'candidate-outline': arg => {
    candidateModal(arg, 'outline');
  },
  'candidate-framework': arg => {
    candidateModal(arg, 'framework');
  },
  literature: arg => {
    relevantLiterature(arg);
  },
  'copy-literature': async arg => {
    const a = ALERIN.literature.find(x => x.id === arg);
    if (a) await copyText(a.title);
  },
  'copy-keyword': async arg => {
    const [i, idx] = arg.split(':');
    const b = currentBundle(+idx);
    if (b) await copyText(literatureKeywords(b)[+i] || '');
  },
  'output-tab': arg => {
    outputTab = arg;
    render();
  },
  'choose-title': arg => {
    chooseTitleModal(arg);
  },
  'download-outline': arg => {
    const b = currentBundle(+arg) || currentBundle(0);
    const txt = b ? outlineText(b.outline) : 'Outline Judul';
    const filename = `Outline_${(S.title || 'Skripsi').slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    download(filename, txt);
    toast('Outline judul berhasil diunduh.');
  },
  'download-framework': arg => {
    const b = currentBundle(+arg) || currentBundle(0);
    const txt = b ? rowText(b.framework) : 'Kerangka Berpikir';
    const filename = `Kerangka_Berpikir_${(S.title || 'Skripsi').slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    download(filename, txt);
    toast('Kerangka berpikir berhasil diunduh.');
  },
  'go-bab-1': () => {
    closeModal(true);
    ensureGuide();
    S.guide.view = 'guide';
    S.guide.part = 'background';
    if (!S.konteks) S.konteks = {};
    S.konteks.chapter = '1';
    syncTasksForChapter(1);
    persist();
    go('mulai');
    toast('Membuka Bab I · Latar Belakang.');
  },
});
