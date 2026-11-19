'use strict';
/* Pembuat sitasi enam gaya dan pembaca kutipan naskah. */
function blankSource() {
  return {
    type: 'Jurnal',
    title: '',
    authors: '',
    year: '',
    container: '',
    volume: '',
    issue: '',
    pages: '',
    doi: '',
    url: '',
    city: '',
  };
}
function knownSources() {
  return [
    {
      key: 'orozco2019',
      type: 'Jurnal',
      title:
        'The effectiveness of using entertainment education narratives to promote safer sexual behaviors of youth: A meta-analysis, 1985-2017',
      authors: 'Orozco-Olvera, V., Shen, F., & Cluver, L.',
      year: '2019',
      container: 'PLOS ONE',
      volume: '14',
      issue: '1',
      pages: 'e0209969',
      doi: '10.1371/journal.pone.0209969',
      url: '',
    },
    {
      key: 'aubrey2023',
      type: 'Jurnal',
      title:
        'Is sexual consent sexy?: Investigating the effects of a televised depiction of verbal sexual consent on college students’ sexual consent attitudes and behavioral intentions',
      authors: 'Aubrey, J. S., Terán, L., Dajches, L., Gahler, H., & Yan, K.',
      year: '2023',
      container: 'Health Communication',
      volume: '',
      issue: '',
      pages: '',
      doi: '10.1080/10410236.2022.2087264',
      url: '',
    },
    {
      key: 'darville2022',
      type: 'Jurnal',
      title:
        '“Someone You Love” documentary: Using narratives in entertainment media to increase HPV vaccination in Georgia',
      authors: 'Darville-Sanders, G. C., MacInnes, J., & Schwarz, K.',
      year: '2022',
      container: 'Journal of the Georgia Public Health Association',
      volume: '8',
      issue: '3',
      pages: '',
      doi: '',
      url: 'https://digitalcommons.georgiasouthern.edu/jgpha/vol8/iss3/6/',
    },
    {
      key: 'miles1994',
      type: 'Buku',
      title: 'Qualitative data analysis: An expanded sourcebook (2nd ed.)',
      authors: 'Miles, M. B., & Huberman, A. M.',
      year: '1994',
      container: 'Sage Publications',
      volume: '',
      issue: '',
      pages: '',
      doi: '',
      url: '',
    },
    {
      key: 'creswell2018',
      type: 'Buku',
      title: 'Designing and conducting mixed methods research (3rd ed.)',
      authors: 'Creswell, J. W., & Plano Clark, V. L.',
      year: '2018',
      container: 'Sage Publications',
      volume: '',
      issue: '',
      pages: '',
      doi: '',
      url: '',
    },
    {
      key: 'piaget1952',
      type: 'Buku',
      title: 'The origins of intelligence in children',
      authors: 'Piaget, J.',
      year: '1952',
      container: 'International Universities Press',
      volume: '',
      issue: '',
      pages: '',
      doi: '',
      url: '',
    },
    {
      key: 'putra2026',
      type: 'Jurnal',
      title: 'Pemanfaatan teknologi dalam pembelajaran di perguruan tinggi',
      authors: 'Putra, A., & Sari, B.',
      year: '2026',
      container: 'Jurnal Pendidikan dan Teknologi',
      volume: '10',
      issue: '2',
      pages: '12-24',
      doi: '',
      url: '',
    },
    {
      key: 'wibowo2025',
      type: 'Buku',
      title: 'Metodologi penelitian pendidikan',
      authors: 'Wibowo, R.',
      year: '2025',
      container: 'Penerbit Aksara Edukasi',
      volume: '',
      issue: '',
      pages: '',
      doi: '',
      url: '',
    },
    {
      key: 'rahmawati2026',
      type: 'Jurnal',
      title: 'Analisis faktor yang memengaruhi minat belajar mahasiswa',
      authors: 'Rahmawati, N.',
      year: '2026',
      container: 'Jurnal Riset Mahasiswa',
      volume: '5',
      issue: '1',
      pages: '45-58',
      doi: '',
      url: '',
    },
  ];
}
function sampleBiblio(empty) {
  const base = {
    style: 'APA 7',
    form: blankSource(),
    editing: null,
    tab: 'all',
    folder: '',
    query: '',
    folders: ['Bab I', 'Bab II', 'Bab III'],
    items: [],
    naskah: null,
  };
  if (empty) return base;
  const now = new Date().toISOString();
  base.items = [
    {
      id: 'dp-putra2026',
      type: 'Jurnal',
      title: 'Pemanfaatan teknologi dalam pembelajaran di perguruan tinggi',
      authors: 'Putra, A., & Sari, B.',
      year: '2026',
      container: 'Jurnal Pendidikan dan Teknologi',
      volume: '10',
      issue: '2',
      pages: '12-24',
      doi: '',
      url: '',
      folder: '',
      verified: true,
      addedAt: now,
      sample: true,
    },
    {
      id: 'dp-wibowo2025',
      type: 'Buku',
      title: 'Metodologi penelitian pendidikan',
      authors: 'Wibowo, R.',
      year: '2025',
      container: 'Penerbit Aksara Edukasi',
      volume: '',
      issue: '',
      pages: '',
      doi: '',
      url: '',
      folder: '',
      verified: true,
      addedAt: now,
      sample: true,
    },
    {
      id: 'dp-rahmawati2026',
      type: 'Jurnal',
      title: 'Analisis faktor yang memengaruhi minat belajar mahasiswa',
      authors: 'Rahmawati, N.',
      year: '2026',
      container: 'Jurnal Riset Mahasiswa',
      volume: '5',
      issue: '1',
      pages: '45-58',
      doi: '',
      url: '',
      folder: '',
      verified: true,
      addedAt: now,
      sample: true,
    },
  ];
  base.naskah = {
    source: 'Naskah contoh · Proposal Bab I–III (dokumen fitur)',
    sample: true,
    time: now,
    citations: [
      { label: 'Orozco-Olvera dkk. (2019)', surname: 'orozco-olvera', year: '2019', loc: 'Bab I · Latar Belakang' },
      { label: 'Aubrey dkk. (2023)', surname: 'aubrey', year: '2023', loc: 'Bab II · Media Film' },
      { label: 'Miles & Huberman (1994)', surname: 'miles', year: '1994', loc: 'Bab III · Teknik Analisis Data' },
      {
        label: 'Piaget (1952)',
        surname: 'piaget',
        year: '1952',
        loc: 'Bab II · Teori Konstruktivisme',
        suggest: 'piaget1952',
      },
      {
        label: 'Darville-Sanders dkk. (2022)',
        surname: 'darville-sanders',
        year: '2022',
        loc: 'Bab II · Media Film',
        suggest: 'darville2022',
      },
    ],
  };
  return base;
}
/* Penulis: "Belakang, Depan; Belakang, Depan", "Belakang, A., & Belakang, B.", atau "Depan Belakang". */
const INITIALS_RE = /^([A-ZÀ-Ž]\.\s*-?\s*)+$/;
const PARTIKEL = new Set(['van', 'von', 'de', 'der', 'den', 'da', 'di', 'del', 'della', 'la', 'le', 'du', 'bin', 'binti']);
function initialsOf(given) {
  return String(given || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(w =>
      INITIALS_RE.test(w)
        ? w
        : w
            .split('-')
            .filter(Boolean)
            .map(x => x[0].toUpperCase() + '.')
            .join('-'),
    )
    .join(' ');
}
function authorFrom(last, given = '') {
  return { last: last.trim(), given: given.trim(), initials: initialsOf(given) };
}
function authorFull(t) {
  const w = t.trim().split(/\s+/);
  if (w.length === 1) return authorFrom(w[0]);
  let cut = w.length - 1;
  while (cut > 1 && PARTIKEL.has(w[cut - 1].toLowerCase())) cut--;
  return authorFrom(w.slice(cut).join(' '), w.slice(0, cut).join(' '));
}
function parseAuthors(str) {
  const raw = String(str || '').trim();
  if (!raw) return [];
  if (raw.includes(';'))
    return raw
      .split(';')
      .map(x => x.trim().replace(/^(?:&|dan|and)\s+/i, ''))
      .filter(Boolean)
      .map(x => (x.includes(',') ? authorFrom(...x.split(/,(.*)/s)) : authorFull(x)));
  const toks = raw
    .replace(/,?\s+(?:&|dan|and)\s+/gi, ', ')
    .replace(/\s*&\s*/g, ', ')
    .split(',')
    .map(x => x.trim())
    .filter(Boolean);
  const looksGiven = t => INITIALS_RE.test(t) || /^[A-ZÀ-Ž][\p{L}'’-]*\.?(\s+[A-ZÀ-Ž][\p{L}'’-]*\.?){0,2}$/u.test(t);
  const allFull = toks.every(t => t.split(/\s+/).length >= 2 && !INITIALS_RE.test(t));
  const out = [];
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i],
      n = toks[i + 1];
    if (n && !INITIALS_RE.test(t) && (INITIALS_RE.test(n) || (!allFull && looksGiven(n)))) {
      out.push(authorFrom(t, n));
      i++;
    } else out.push(authorFull(t));
  }
  return out;
}
function normName(v) {
  return String(v || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z-]/g, '');
}
function firstSurname(authors) {
  return normName(parseAuthors(authors)[0]?.last || '');
}
/* Huruf kapital judul. Judul disimpan dalam huruf kalimat; IEEE (buku), MLA, dan Chicago memakai huruf kapital tiap kata. */
const KATA_KECIL = new Set(
  'a an the and but or nor for so yet as at by in of on to up via per from into onto with over off out than vs di ke dari dan yang untuk pada dalam sebagai terhadap dengan atau bagi oleh tentang antara serta melalui tanpa'.split(
    ' ',
  ),
);
function titleCaseCite(s) {
  const words = String(s || '').split(/(\s+)/);
  const real = words.map((w, i) => (i % 2 ? null : w));
  const idx = real.map((w, i) => (w ? i : -1)).filter(i => i >= 0);
  const first = idx[0],
    last = idx.at(-1);
  return words
    .map((w, i) => {
      if (i % 2 || !w) return w;
      const prev = idx[idx.indexOf(i) - 1];
      const afterColon = prev !== undefined && /[:?!.—–]$/.test(words[prev]);
      const core = w.toLowerCase().replace(/[^\p{L}]/gu, '');
      if (i !== first && i !== last && !afterColon && KATA_KECIL.has(core)) return w.toLowerCase();
      return w
        .split('-')
        .map(p => p.replace(/^([^\p{L}]*)(\p{L})/u, (m, a, c) => a + c.toUpperCase()))
        .join('-');
    })
    .join('');
}
/* Huruf kapital di awal judul dan setelah titik dua. Huruf lain dibiarkan seperti yang ditulis pengguna. */
function sentenceStart(s) {
  return String(s || '')
    .replace(/^([^\p{L}]*)(\p{L})/u, (m, a, c) => a + c.toUpperCase())
    .replace(/([:?!]\s+)(\p{L})/gu, (m, a, c) => a + c.toUpperCase());
}
/* Judul yang tampak ditulis dengan huruf kapital di banyak kata. */
function looksTitleCase(s) {
  const words = String(s || '')
    .split(/\s+/)
    .slice(1)
    .filter(w => /^\p{L}/u.test(w) && !KATA_KECIL.has(w.toLowerCase()) && w.length > 2);
  if (!words.length) return false;
  const caps = words.filter(w => /^\p{Lu}\p{Ll}/u.test(w)).length;
  return caps / words.length >= 0.6;
}
function toSentenceCase(s) {
  let afterColon = false;
  return String(s || '')
    .split(/(\s+)/)
    .map((w, i) => {
      if (i % 2) return w;
      const keep = i === 0 || afterColon;
      afterColon = /[:?!]$/.test(w);
      return !keep && /^\p{Lu}\p{Ll}+[\p{P}]*$/u.test(w) ? w.charAt(0).toLowerCase() + w.slice(1) : w;
    })
    .join('');
}
/* Singkatan nama jurnal untuk IEEE dan Vancouver (daftar kata umum ISO 4). */
const SINGKATAN_JURNAL = {
  journal: 'J.', jurnal: 'J.', communication: 'Commun.', communications: 'Commun.', international: 'Int.', research: 'Res.',
  education: 'Educ.', educational: 'Educ.', psychology: 'Psychol.', psychological: 'Psychol.', science: 'Sci.', sciences: 'Sci.',
  social: 'Soc.', society: 'Soc.', studies: 'Stud.', review: 'Rev.', quarterly: 'Q.', technology: 'Technol.', management: 'Manag.',
  medicine: 'Med.', medical: 'Med.', behavior: 'Behav.', behaviour: 'Behav.', computer: 'Comput.', computing: 'Comput.',
  information: 'Inf.', engineering: 'Eng.', applied: 'Appl.', american: 'Am.', association: 'Assoc.', proceedings: 'Proc.',
  conference: 'Conf.', development: 'Dev.', economics: 'Econ.', economic: 'Econ.', environmental: 'Environ.', political: 'Polit.',
  politics: 'Polit.', sociology: 'Sociol.', sociological: 'Sociol.', anthropology: 'Anthropol.', language: 'Lang.',
  linguistics: 'Linguist.', literature: 'Lit.', history: 'Hist.', philosophy: 'Philos.', mathematics: 'Math.', physics: 'Phys.',
  chemistry: 'Chem.', biology: 'Biol.', clinical: 'Clin.', adolescent: 'Adolesc.', adolescence: 'Adolesc.', family: 'Fam.',
  children: 'Child.', sexual: 'Sex.', sexuality: 'Sex.', culture: 'Cult.', cultural: 'Cult.', business: 'Bus.',
  marketing: 'Mark.', financial: 'Financ.', accounting: 'Account.', teaching: 'Teach.', learning: 'Learn.', nursing: 'Nurs.',
  annual: 'Annu.', national: 'Natl.', academy: 'Acad.', european: 'Eur.', transactions: 'Trans.', letters: 'Lett.',
  systems: 'Syst.', analysis: 'Anal.', electronic: 'Electron.', electrical: 'Electr.', software: 'Softw.', networks: 'Netw.',
  intelligence: 'Intell.', artificial: 'Artif.', advances: 'Adv.', practice: 'Pract.', television: 'Telev.',
};
const KATA_BUANG = new Set(['of', 'the', 'and', 'for', 'on', 'in', '&', 'a', 'an']);
function journalAbbr(name, dots = true) {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return words.join(' ');
  const out = words
    .filter((w, i) => i === 0 || !KATA_BUANG.has(w.toLowerCase()))
    .map(w => SINGKATAN_JURNAL[w.toLowerCase().replace(/[^a-z]/g, '')] || w);
  return out.join(' ').replace(/\./g, dots ? '.' : '');
}
/* Rentang halaman. */
const dash = v => String(v || '').trim().replace(/\s*[-–—]+\s*/g, '–');
function pageRange(v, style) {
  const m = dash(v).match(/^(\d+)–(\d+)$/);
  if (!m) return dash(v);
  const [, a, b] = m;
  if (+b <= +a || a.length !== b.length) return style === 'Vancouver' ? `${a}-${b}` : `${a}–${b}`;
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  if (style === 'Vancouver') return `${a}-${b.slice(i)}`;
  if (style === 'MLA') return +a < 100 ? `${a}–${b}` : a.slice(0, -2) === b.slice(0, -2) ? `${a}–${b.slice(-2)}` : `${a}–${b}`;
  if (style === 'Chicago') {
    if (+a < 100 || +a % 100 === 0) return `${a}–${b}`;
    let keep = b.slice(i);
    if (+a % 100 >= 10 && keep.length < 2) keep = b.slice(-2);
    return `${a}–${keep}`;
  }
  return `${a}–${b}`;
}
/* Kota terbit: "Bloomington, IN, USA" utuh untuk IEEE, "Bloomington" untuk Harvard, "Bloomington (IN)" untuk Vancouver. */
function cityFor(city, style) {
  const parts = String(city || '')
    .split(',')
    .map(x => x.trim())
    .filter(Boolean);
  if (!parts.length) return '';
  if (style === 'IEEE') return parts.join(', ');
  if (style === 'Vancouver') return parts.length > 1 ? `${parts[0]} (${parts[1]})` : parts[0];
  return parts[0];
}
function publisherFor(pub, style) {
  const p = trimDot(pub);
  if (style === 'IEEE') return p.replace(/\bUniversity\b/g, 'Univ.');
  if (style === 'MLA')
    return p
      .replace(/\bUniversity Press\b/g, 'UP')
      .replace(/^University of (.+) Press$/, 'U of $1 P')
      .replace(/\b(Inc|Ltd|Co)\.?$/, '')
      .trim();
  return p;
}
const BUKU = ['Buku', 'Bab Buku', 'Skripsi/Tesis'];
function formatCitation(src, style, no = 1) {
  const it = v => `<i>${e(v)}</i>`,
    A = parseAuthors(src.authors),
    raw = trimDot(src.title),
    c = trimDot(src.container),
    yr = src.year || 't.t.',
    book = BUKU.includes(src.type),
    web = src.type === 'Situs Web';
  const doi = String(src.doi || '').trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, '');
  const doiUrl = doi ? `https://doi.org/${doi}` : src.url || '';
  const vol = src.volume,
    iss = src.issue,
    pg = pageRange(src.pages, style),
    city = cityFor(src.city, style);
  const last = x => x.last;
  let html = '';
  if (style === 'APA 7') {
    const one = x => `${x.last}${x.initials ? ', ' + x.initials : ''}`;
    const a =
      A.length > 20
        ? A.slice(0, 19).map(one).join(', ') + ', … ' + one(A.at(-1))
        : A.length === 2
          ? `${one(A[0])}, & ${one(A[1])}`
          : joinList(A.map(one), ', ', ', & ');
    const title = sentenceStart(raw);
    html = book
      ? `${e(a)} (${e(yr)}). ${it(title)}. ${e(c)}.${doiUrl ? ' ' + e(doiUrl) : ''}`
      : web
        ? `${e(a)} (${e(yr)}). ${it(title)}. ${e(c)}.${src.url ? ' ' + e(src.url) : ''}`
        : `${e(a)} (${e(yr)}). ${e(title)}. ${it(c + (vol ? ', ' + vol : ''))}${iss ? `(${e(iss)})` : ''}${pg ? `, ${e(pg)}` : ''}.${doiUrl ? ' ' + e(doiUrl) : ''}`;
  } else if (style === 'IEEE') {
    const one = x => `${x.initials ? x.initials + ' ' : ''}${x.last}`;
    const a = A.length > 6 ? one(A[0]) + ' et al.' : A.length === 2 ? `${one(A[0])} and ${one(A[1])}` : joinList(A.map(one), ', ', ', and ');
    html = book
      ? `[${no}] ${e(a)}, ${it(titleCaseCite(raw))}. ${city ? e(city) + ': ' : ''}${e(publisherFor(c, 'IEEE'))}, ${e(yr)}.`
      : web
        ? `[${no}] ${e(a)}, "${e(sentenceStart(raw))}," ${e(c)}. ${src.url ? `[Online]. Available: ${e(src.url)}` : ''}`.trim()
        : `[${no}] ${e(a)}, "${e(sentenceStart(raw))}," ${it(journalAbbr(c))}${vol ? `, vol. ${e(vol)}` : ''}${iss ? `, no. ${e(iss)}` : ''}${pg ? `, ${/[–-]/.test(pg) ? 'pp.' : 'p.'} ${e(pg)}` : ''}, ${e(yr)}${doi ? `, doi: ${e(doi)}` : ''}.`;
  } else if (style === 'MLA') {
    const lead = A[0] ? `${A[0].last}${A[0].given ? ', ' + A[0].given : ''}` : '';
    const a = trimDot(
      A.length > 2 ? lead + ', et al' : A.length === 2 ? `${lead}, and ${A[1].given ? A[1].given + ' ' : ''}${A[1].last}` : lead,
    );
    const title = titleCaseCite(raw);
    html = book
      ? `${e(a)}. ${it(title)}. ${e(publisherFor(c, 'MLA'))}, ${e(yr)}.`
      : `${e(a)}. "${e(title)}." ${it(c)}${vol ? `, vol. ${e(vol)}` : ''}${iss ? `, no. ${e(iss)}` : ''}, ${e(yr)}${pg ? `, ${/[–-]/.test(pg) ? 'pp.' : 'p.'} ${e(pg)}` : ''}${doiUrl ? ', ' + e(doiUrl) : ''}.`;
  } else if (style === 'Chicago') {
    const list = A.length > 6 ? A.slice(0, 3) : A;
    const a = trimDot(
      joinList(
        list.map((x, i) => (i === 0 ? `${x.last}${x.given ? ', ' + x.given : ''}` : `${x.given ? x.given + ' ' : ''}${x.last}`)),
        ', ',
        list.length > 2 ? ', and ' : ', and ',
      ) + (A.length > 6 ? ', et al' : ''),
    );
    const title = titleCaseCite(raw);
    html = book
      ? `${e(a)}. ${e(yr)}. ${it(title)}. ${e(c)}.`
      : `${e(a)}. ${e(yr)}. "${e(title)}." ${it(c)}${vol ? ' ' + e(vol) : ''}${iss ? ` (${e(iss)})` : ''}${pg ? `: ${e(pg)}` : ''}.${doiUrl ? ' ' + e(doiUrl) + '.' : ''}`;
  } else if (style === 'Harvard') {
    const one = x => `${x.last}${x.initials ? ', ' + x.initials : ''}`;
    const a = A.length > 3 ? one(A[0]) + ' et al.' : joinList(A.map(one), ', ', ' & ');
    const title = sentenceStart(raw);
    html = book
      ? `${e(a)} (${e(yr)}) ${it(title)}. ${city ? e(city) + ': ' : ''}${e(c)}.`
      : `${e(a)} (${e(yr)}) ‘${e(title)}’, ${it(c)}${vol ? `, ${e(vol)}` : ''}${iss ? `(${e(iss)})` : ''}${pg ? `, ${/[–-]/.test(pg) ? 'pp.' : 'p.'} ${e(pg)}` : ''}.${doiUrl ? ` Available at: ${e(doiUrl)}.` : ''}`;
  } else {
    const one = x => `${x.last} ${x.initials.replace(/[.\s-]/g, '')}`.trim();
    const a = (A.length > 6 ? A.slice(0, 6) : A).map(one).join(', ') + (A.length > 6 ? ', et al' : '');
    const title = sentenceStart(raw);
    html = book
      ? `${e(a)}. ${e(title)}. ${city ? e(city) + ': ' : ''}${e(c)}; ${e(yr)}.`
      : `${e(a)}. ${e(title)}. ${e(journalAbbr(c, false))}. ${e(yr)}${vol ? ';' + e(vol) : ''}${iss ? `(${e(iss)})` : ''}${pg ? ':' + e(pg) : ''}.${doi ? ` doi:${e(doi)}` : ''}`;
  }
  return {
    html,
    text: html
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>'),
  };
}
/* Nomor urut IEEE: urutan sumber saat ditambahkan. */
function citeNo(id) {
  const items = S.biblio.items,
    i = items.findIndex(x => x.id === id);
  return i < 0 ? items.length + 1 : items.length - i;
}
function previewSource() {
  const f = S.biblio.form;
  if (f.title.trim() || f.authors.trim()) return { src: f, label: '', no: citeNo(S.biblio.editing) };
  const last = S.biblio.items[0];
  return last ? { src: last, label: 'Contoh dari daftar tersimpan', no: citeNo(last.id) } : null;
}
function extractCitations(text) {
  const cut = text.search(/\n\s*(DAFTAR\s+PUSTAKA|REFERENCES|BIBLIOGRAPHY)\s*\n/i);
  const body = cut > 0 ? text.slice(0, cut) : text;
  const marks = [...body.matchAll(/\bBAB\s+(IV|V|VI|I{1,3}|[1-6])\b/gi)].map(m => ({
    i: m.index,
    label: 'Bab ' + m[1].toUpperCase(),
  }));
  const at = i => {
    let l = 'Naskah';
    for (const c of marks) {
      if (c.i <= i) l = c.label;
      else break;
    }
    return l;
  };
  const stop = ['Bab', 'Tabel', 'Gambar', 'Tahun', 'Lampiran', 'Halaman', 'Pasal', 'Undang', 'Nomor', 'No'];
  const out = new Map();
  const add = (s, second, etal, year, i) => {
    if (stop.includes(s)) return;
    const key = normName(s) + '|' + year;
    if (!out.has(key))
      out.set(key, {
        label: `${s}${second ? ' & ' + second : etal ? ' dkk.' : ''} (${year})`,
        surname: normName(s),
        year,
        loc: at(i),
      });
  };
  const name = "[A-ZÀ-Ž][A-Za-zÀ-ž'\\-]+";
  for (const m of body.matchAll(
    new RegExp(
      `(${name})(?:\\s+(?:et al\\.?|dkk\\.?)|\\s+(?:&|dan|and)\\s+(${name}(?:\\s+${name})?))?\\s*\\(((?:19|20)\\d{2})[a-z]?(?:[,:][^)]*)?\\)`,
      'g',
    ),
  ))
    add(m[1], m[2], /et al|dkk/.test(m[0]), m[3], m.index);
  for (const m of body.matchAll(/\(([^()]{3,250}?(?:19|20)\d{2}[a-z]?[^()]*)\)/g))
    for (const part of m[1].split(';')) {
      const p = part.match(
        new RegExp(
          `(${name})(?:\\s+(?:et al\\.?|dkk\\.?)|\\s+(?:&|dan|and)\\s+(${name}(?:\\s+${name})?))?,?\\s+((?:19|20)\\d{2})`,
        ),
      );
      if (p) add(p[1], p[2], /et al|dkk/.test(part), p[3], m.index);
    }
  return [...out.values()];
}
