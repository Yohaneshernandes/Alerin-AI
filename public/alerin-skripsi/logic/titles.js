'use strict';
/* Penyusun opsi judul dan kata kunci literatur. */
function literatureKeywords(b) {
  const base = trimDot(S.draftSample ? b.focus : S.draft.topic || b.title)
    .replace(/[:;,.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const loc = trimDot(S.draft.location || '').replace(/^(pada|di)\s+/i, '');
  const method = detectMethod(S.draft.idea);
  return [
    b.title,
    `${base}${loc ? ' ' + loc : ''}`.trim(),
    `${base} ${method === 'Belum ditentukan' ? 'studi terdahulu' : method.toLowerCase()}`.trim(),
  ]
    .filter((v, i, a) => v && a.indexOf(v) === i)
    .slice(0, 3);
}
function relevantLiterature(index) {
  const b = currentBundle(index);
  if (!b) return;
  const isFilm = /film|seksual|sexual|pendidikan seks|media belajar/i.test(b.title + ' ' + b.focus);
  const list = isFilm ? ALERIN.literature.slice() : [];
  if ([1, 3].includes(+index)) list.sort((a, c) => (a.kind === 'film' ? -1 : c.kind === 'film' ? 1 : 0));
  const body = list.length
    ? `<p>Tiga judul artikel yang relevan dengan judul penelitianmu. Salin judulnya untuk dicari di Alerin Jurnal.</p>${list.map((a, i) => `<article class="literature-item"><span class="eyebrow">ARTIKEL ${i + 1}</span><h3>${e(a.title)}</h3><p>${e(a.authors)} · ${e(a.year)} · ${e(a.journal)}</p><p class="small">${e(a.relevance)}</p><div class="actions">${B('Salin Judul Artikel', 'copy-literature:' + a.id, '', 'copy')}</div></article>`).join('')}`
    : `<p>Belum ada judul artikel terverifikasi untuk konteks ini, sehingga Alerin tidak menampilkan judul yang dibuat-buat. Gunakan kata kunci berikut untuk mencari artikel pendukung di Alerin Jurnal.</p>${literatureKeywords(
        b,
      )
        .map(
          (k, i) =>
            `<article class="literature-item"><span class="eyebrow">KATA KUNCI ${i + 1}</span><h3>${e(k)}</h3><div class="actions">${B('Salin Kata Kunci', 'copy-keyword:' + i + ':' + index, '', 'copy')}</div></article>`,
        )
        .join('')}`;
  modal(
    'Validasi Literatur',
    `<div class="candidate-context"><span class="eyebrow">JUDUL YANG DITINJAU</span><h3>${e(b.title)}</h3></div>${body}<div class="mt">${note('Artikel rekomendasi belum otomatis menjadi sitasi atau daftar pustaka penelitianmu. Tinjau relevansi dan isinya sebelum digunakan.')}</div>`,
    B('Kembali', 'close-modal') +
      `<a class="btn primary" href="https://alerin.id/features/journal" target="_blank" rel="noopener noreferrer">${I('external')}Buka Alerin Jurnal</a>`,
    true,
  );
}
const LOWER_WORDS = new Set([
  'dan',
  'di',
  'ke',
  'dari',
  'pada',
  'dalam',
  'terhadap',
  'untuk',
  'bagi',
  'yang',
  'dengan',
  'oleh',
  'sebagai',
  'tentang',
  'atau',
  'serta',
  'kepada',
  'antara',
  'melalui',
  'atas',
]);
function titleCase(s) {
  const words = String(s).replace(/\s+/g, ' ').trim().split(' ');
  const out = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (i > 0 && w.toLowerCase() === words[i - 1].toLowerCase()) continue;
    const lw = w.toLowerCase();
    out.push(
      i > 0 && LOWER_WORDS.has(lw) ? lw : /^[A-Z0-9]{2,}$/.test(w) ? w : lw.charAt(0).toUpperCase() + lw.slice(1),
    );
  }
  return out.join(' ');
}
function makeTitles(d) {
  const topic = trimDot(d.topic || d.phenomenon || 'topik penelitian'),
    loc = trimDot(d.location || '').replace(/^(pada|di|bagi)\s+/i, '');
  const subj = loc || 'Mahasiswa',
    m = detectMethod(d.idea || '');
  const qual = /kualitatif/i.test(m) || !m || m === 'Belum ditentukan';
  const t1 = `Peran ${topic} bagi ${subj}`.replace(/^Peran peran/i, 'Peran');
  const t2 = `Pemaknaan ${subj} terhadap ${topic}`;
  const t3 = qual ? `Pengaruh ${topic} terhadap ${subj}` : `Pengalaman ${subj} dalam Memahami ${topic}`;
  return [
    [titleCase(t1), 'Paling realistis', 'Sesuai topik dan subjek yang kamu ceritakan.'],
    [titleCase(t2), 'Alternatif fokus', 'Fokus pada cara subjek memaknai topikmu.'],
    [
      titleCase(t3),
      'Alternatif metode',
      qual ? 'Menguji hubungan dengan pendekatan kuantitatif.' : 'Menggali pengalaman dengan pendekatan kualitatif.',
    ],
  ];
}
function titleOptions() {
  if (S.draftSample) return ALERIN.titles.slice(0, 3);
  return makeTitles(S.draft).map(([t, l, d]) => [
    t,
    l,
    d,
    'Ketepatan rumusan dan dukungan sumber dibahas bersama pembimbing.',
  ]);
}
