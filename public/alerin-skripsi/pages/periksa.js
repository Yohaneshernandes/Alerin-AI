'use strict';
/* Halaman periksa. */
const CHAPTER_OPTS = [
  ['title', 'Judul Penelitian'],
  ['1', 'Bab I · Pendahuluan'],
  ['2', 'Bab II · Tinjauan Pustaka'],
  ['3', 'Bab III · Metode Penelitian'],
  ['4', 'Bab IV · Hasil dan Pembahasan'],
  ['5', 'Bab V · Penutup'],
  ['all', 'Keseluruhan naskah'],
];
function periksaPage() {
  const p = ensurePeriksa(),
    ch = CHAPTERS[+p.chapter - 1],
    titleOnly = p.mode === 'bab' && p.chapter === 'title',
    last = latestReview();
  const option = (id, ico, t, d) =>
    `<button class="v6-review-option ${p.mode === id ? 'selected' : ''}" data-action="periksa-mode:${id}" aria-pressed="${p.mode === id}">${I(ico)}<strong>${t}</strong><span>${d}</span></button>`;
  const scope =
    p.mode === 'prep'
      ? `<div class="field"><label for="periksa-prep">Apa yang ingin kamu siapkan?</label><select id="periksa-prep" data-periksa="prep"><option value="sempro" ${p.prep === 'sempro' ? 'selected' : ''}>Seminar Proposal</option><option value="sidang" ${p.prep === 'sidang' ? 'selected' : ''}>Sidang Skripsi</option></select></div><p class="small muted">${p.prep === 'sidang' ? 'Siapkan naskah lengkap Bab I–V terbaru dan catatan pembimbing.' : 'Siapkan proposal terbaru (Bab I–III) dan catatan pembimbing.'}</p>`
      : `<div class="field-grid"><div class="field"><label for="periksa-chapter">Bab atau bagian yang ingin diperiksa</label><select id="periksa-chapter" data-periksa="chapter">${CHAPTER_OPTS.map(([v, l]) => `<option value="${v}" ${p.chapter === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>${
          ch
            ? `<div class="field"><label for="periksa-part">Subbagian <span>Opsional</span></label><select id="periksa-part" data-periksa="part"><option value="">Seluruh Bab ${ch[0]}</option>${ch[2]
                .filter(x => partApplies(x[0]))
                .map(x => `<option value="${x[0]}" ${p.part === x[0] ? 'selected' : ''}>${e(x[1])}</option>`)
                .join('')}</select></div>`
            : ''
        }</div><p class="small muted">Struktur Bab I–V mengikuti susunan panduan; sesuaikan subbagian dengan pedoman kampus.</p>`;
  const meta = (id, val, max, opt) =>
    `<div class="field-meta"><span>${opt ? 'Boleh dilengkapi kemudian.' : ''}</span><span data-count="${id}">${String(val || '').length}/${max}</span></div>`;
  const titleField = `<div class="field"><label for="periksa-title">Judul penelitian <span class="required-label">Wajib</span></label><textarea id="periksa-title" maxlength="220" data-periksa="title" aria-required="true" placeholder="Tuliskan judul penelitianmu" rows="3">${e(p.title)}</textarea>${meta('periksa-title', p.title, 220, false)}</div>`;
  const bahan = titleOnly
    ? `<p class="mt">Judul saja sudah cukup untuk meninjau keselarasan judul.</p>${titleField}`
    : `<p class="mt">Tambahkan bahan yang ingin ditinjau.</p>${uploadZone('periksa', 'Pilih Berkas PDF / DOCX', 'PDF, DOCX, TXT')}${fileList('periksa')}<details class="v6-review-title" ${p.title ? '' : 'open'}><summary>Judul penelitian · ${p.title ? 'Sudah tersedia' : 'Wajib diisi'}</summary>${titleField}</details>`;
  return (
    pageHead('Apa yang ingin diperiksa?', 'Tinjau bagian skripsi atau persiapkan naskah untuk seminar proposal dan sidang.', '', '', '', 'PERIKSA SKRIPSI') +
    `<section class="card v6-review-form"><h3 class="mb">1 · Pilih tujuan pemeriksaan</h3><div class="v6-review-options" role="group" aria-label="Tujuan pemeriksaan">${option('bab', 'document', 'Periksa Bab atau Bagian', 'Tinjau satu bab atau subbagian naskah.')}${option('prep', 'checklist', 'Kesiapan Seminar atau Sidang', 'Tinjau naskah dan kelengkapan persiapan.')}</div>${scope}<hr class="rule"><h3>2 · Pilih bahan pemeriksaan</h3>${bahan}<div class="field"><label for="periksa-focus">Ada bagian yang ingin diperhatikan? <span>Opsional</span></label><textarea id="periksa-focus" maxlength="400" data-periksa="focus" placeholder="Misalnya: kesesuaian instrumen dan variabel penelitian." rows="3">${e(p.focus)}</textarea>${meta('periksa-focus', p.focus, 400, true)}</div>${
      titleOnly
        ? ''
        : `<details class="paste" ${p.text ? 'open' : ''}><summary>Gunakan teks sebagai bahan pemeriksaan</summary><div class="field"><label for="periksa-text">Tempel teks naskah <span>Opsional</span></label><textarea id="periksa-text" maxlength="20000" data-periksa="text" placeholder="Teks subbagian atau bab yang ingin diperiksa." rows="3">${e(p.text)}</textarea>${meta('periksa-text', p.text, 20000, true)}</div></details>`
    }<p class="small muted mt">Analisis AI belum terhubung, jadi hasilnya contoh berbasis aturan. Alerin hanya menandai; perbaikannya tetap kamu tulis sendiri. Persetujuan pembimbing dan persyaratan kampus dicatat terpisah.</p><div class="actions mt">${B('Periksa Sekarang', 'run-periksa', 'primary', 'arrow')}${last ? B('Buka Hasil Terakhir', 'nav:hasil-periksa', 'text') : ''}</div></section>`
  );
}
async function readPeriksaFiles(ctxs) {
  const res = [];
  let text = '';
  for (const f of S.files.filter(x => ctxs.includes(x.context))) {
    try {
      const blob = await fileStore('get', f.id);
      if (!blob) throw Error('Isi berkas tidak tersedia di peramban ini.');
      const file = new File([blob], f.name);
      const r = await extractDocument(file);
      const len = r.text.replace(/\s/g, '').length;
      if (len < 40) throw Error('Teks tidak terbaca. Berkas mungkin hasil pindai.');
      text += '\n' + r.text;
      res.push({
        name: f.name,
        ok: true,
        info: `${r.pages ? r.pages + ' halaman · ' : ''}${len.toLocaleString('id-ID')} karakter terbaca`,
      });
    } catch (err) {
      res.push({ name: f.name, ok: false, info: err.message || 'Format belum bisa dibaca.' });
    }
  }
  return { text, files: res };
}
async function runPeriksa(opts = {}) {
  const p = ensurePeriksa();
  clearErrors();
  if (!opts.silent) {
    p.title = ($('#periksa-title')?.value ?? p.title ?? '').trim();
    p.text = ($('#periksa-text')?.value ?? p.text ?? '').trim();
    p.focus = ($('#periksa-focus')?.value || '').trim();
  }
  const mode = opts.mode || p.mode,
    titleOnly = mode === 'bab' && p.chapter === 'title';
  const ctxs = opts.contexts || ['periksa'],
    hasFile = S.files.some(f => ctxs.includes(f.context));
  let ok = true;
  if (!p.title && !opts.silent) ok = fieldError('periksa-title', 'Kolom ini perlu diisi dulu.');
  else if (p.title && isAsal(p.title))
    ok = fieldError('periksa-title', 'Isiannya belum bisa Alerin pahami. Coba tulis dengan kalimat biasa.');
  if (!titleOnly && mode === 'bab' && !hasFile && p.text.length < 80) {
    ok = false;
    if ($('#periksa-text')) {
      $('details.paste')?.setAttribute('open', '');
      fieldError(
        'periksa-text',
        p.text
          ? 'Teksnya terlalu pendek untuk diperiksa. Tempel minimal satu paragraf.'
          : 'Unggah naskah atau tempel teks bab dulu.',
      );
    } else toast('Unggah naskah atau tempel teks bab dulu.', 'error');
  } else if (p.text && isAsal(p.text.slice(0, 200)))
    ok = fieldError('periksa-text', 'Isiannya belum bisa Alerin pahami. Coba tulis dengan kalimat biasa.');
  if (!ok) return focusFirstError();
  await processing('Membaca naskahmu', async () => {
    const read = titleOnly ? { text: '', files: [] } : await readPeriksaFiles(ctxs);
    const text = (read.text + '\n' + (titleOnly ? '' : p.text)).trim();
    const prep = mode === 'prep' ? opts.prep || p.prep : '';
    const chapters =
      prep === 'sempro'
        ? [1, 2, 3]
        : prep === 'sidang'
          ? [1, 2, 3, 4, 5]
          : p.chapter === 'all'
            ? [1, 2, 3, 4, 5]
            : titleOnly
              ? []
              : [+p.chapter];
    const partName = mode === 'bab' && p.part && PARTS[p.part] ? PARTS[p.part].name : '';
    const scope =
      prep === 'sempro'
        ? 'Kesiapan seminar proposal'
        : prep === 'sidang'
          ? 'Kesiapan sidang skripsi'
          : titleOnly
            ? 'Judul penelitian'
            : p.chapter === 'all'
              ? 'Keseluruhan naskah'
              : CHAPTER_OPTS.find(x => x[0] === p.chapter)[1] + (partName ? ' · ' + partName : '');
    const findings = findIssues(text, {
      chapters: p.part && mode === 'bab' ? [] : chapters,
      title: p.title,
      titleOnly,
      prep,
      method: methodKind(),
    });
    const strengths = findStrengths(text, { title: p.title, titleOnly }, findings);
    const sections = Object.entries(SECTION_RE)
      .filter(([id, re]) => re.test(text) && PARTS[id])
      .map(([id]) => PARTS[id].name);
    const r = {
      id: 'rv-' + Date.now().toString(36),
      date: new Date().toISOString(),
      mode,
      prep,
      chapter: p.chapter,
      part: p.part,
      title: p.title,
      focus: p.focus,
      scope,
      files: read.files,
      pasted: titleOnly ? 0 : p.text.length,
      sections,
      findings,
      strengths,
      textLen: text.length,
    };
    S.reviews = [r, ...(S.reviews || [])].slice(0, 12);
    S.reviewReady = true;
    if (p.title && !S.title) S.review.title = p.title;
    record('Pemeriksaan selesai', `${scope} · ${findings.length} hal perlu diperbaiki, ${strengths.length} sudah kuat`);
    synchronizeResearch();
    persist();
    go('hasil-periksa');
  });
}

Object.assign(ACTIONS, {
  'periksa-mode': arg => {
    ensurePeriksa().mode = arg;
    persist();
    render();
  },
  'periksa-bab': arg => {
    const p = ensurePeriksa();
    p.mode = 'bab';
    p.chapter = arg;
    p.part = '';
    persist();
    go('periksa');
  },
  'periksa-judul': () => {
    const p = ensurePeriksa();
    p.mode = 'bab';
    p.chapter = 'title';
    persist();
    go('periksa');
  },
  'run-periksa': async () => {
    await runPeriksa();
  },
  'periksa-ulang': () => {
    const r = latestReview(),
      p = ensurePeriksa();
    if (r) {
      p.mode = r.mode;
      p.chapter = r.chapter || p.chapter;
      p.part = r.part || '';
      p.prep = r.prep || p.prep;
    }
    persist();
    go('periksa');
    toast('Unggah naskah terbarumu, lalu periksa lagi.');
  },
});
