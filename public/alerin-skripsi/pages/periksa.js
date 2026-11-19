'use strict';
/* Halaman periksa. */
/* Satu pilihan cakupan (Revisi 18 November): Judul, satu bab mengikuti Susunan bab kampusmu di Konteks Skripsi,
   atau naskah utuh (keseluruhan, kesiapan seminar proposal, kesiapan sidang). Mode dan jenis kesiapan diturunkan
   dari pilihan ini, jadi data pemeriksaan tetap memakai mode, prep, dan chapter seperti sebelumnya. */
const NASKAH_MIN = 1500;
const PREP_SCOPE = { 'prep-sempro': 'sempro', 'prep-sidang': 'sidang' };
const scopeGroups = () => [
  ['Judul', [['title', 'Judul Penelitian']]],
  ['Per bab', CHAPTERS.map((c, i) => [String(i + 1), `Bab ${c[0]} · ${c[1]}`])],
  [
    'Naskah utuh',
    [
      ['all', `Keseluruhan naskah (Bab I–${lastRoman()})`],
      ['prep-sempro', `Kesiapan Sempro (Bab I–${proposalRoman()})`],
      ['prep-sidang', `Kesiapan Sidang (Bab I–${lastRoman()})`],
    ],
  ],
];
const chapterOpts = () => scopeGroups().flatMap(g => g[1]);
/* Rapikan cakupan sebelum dipakai. Data lama (mode prep + nomor bab) dipindah sekali ke pilihan kesiapan. */
function periksaScope() {
  const p = ensurePeriksa();
  if (!p.scopeV) {
    if (p.mode === 'prep') p.chapter = p.prep === 'sidang' ? 'prep-sidang' : 'prep-sempro';
    p.scopeV = 2;
  }
  if (!chapterOpts().some(o => o[0] === p.chapter)) {
    /* Susunan bab bisa berganti (5 atau 6 bab); bab yang tidak ada lagi kembali ke Bab I. */
    p.chapter = '1';
    p.part = '';
  }
  p.mode = PREP_SCOPE[p.chapter] ? 'prep' : 'bab';
  if (p.mode === 'prep') p.prep = PREP_SCOPE[p.chapter];
  if (p.part && !(PARTS[p.part] && /^\d+$/.test(p.chapter) && PARTS[p.part].chapter === +p.chapter)) p.part = '';
  return p;
}
function periksaPage() {
  const p = periksaScope();
  const ch = /^\d+$/.test(p.chapter) ? CHAPTERS[+p.chapter - 1] : null,
    titleOnly = p.chapter === 'title',
    whole = p.chapter === 'all' || p.mode === 'prep',
    last = latestReview();
  const scopeSelect = `<div class="field"><label for="periksa-chapter">Bagian yang ingin diperiksa</label><select id="periksa-chapter" data-periksa="chapter">${scopeGroups()
    .map(([g, opts]) => `<optgroup label="${g}">${opts.map(([v, l]) => `<option value="${v}" ${p.chapter === v ? 'selected' : ''}>${e(l)}</option>`).join('')}</optgroup>`)
    .join('')}</select></div>`;
  const partSelect = ch
    ? `<div class="field"><label for="periksa-part">Subbagian <span>Opsional</span></label><select id="periksa-part" data-periksa="part"><option value="">Seluruh Bab ${ch[0]}</option>${ch[2]
        .filter(x => partApplies(x[0]))
        .map(x => `<option value="${x[0]}" ${p.part === x[0] ? 'selected' : ''}>${e(x[1])}</option>`)
        .join('')}</select></div>`
    : '';
  const hint = titleOnly
    ? ''
    : `<p class="small muted">${
        whole
          ? `Unggah ${p.prep === 'sempro' && p.mode === 'prep' ? `proposal terbaru (Bab I–${proposalRoman()})` : `naskah terbaru (Bab I–${lastRoman()})`}${p.mode === 'prep' ? ' beserta daftar pustaka' : ''}. Naskah utuh perlu minimal ${NASKAH_MIN.toLocaleString('id-ID')} karakter yang terbaca. `
          : ''
      }Susunan Bab I–${lastRoman()} mengikuti pilihan <strong>${e(SUSUNAN[susunanId()].label)}</strong> di Konteks Skripsi.</p>`;
  const meta = (id, val, max, opt) =>
    `<div class="field-meta"><span>${opt ? 'Boleh dilengkapi kemudian.' : ''}</span><span data-count="${id}">${String(val || '').length}/${max}</span></div>`;
  const titleField = `<div class="field"><label for="periksa-title">Judul penelitian <span class="required-label">Wajib</span></label><textarea id="periksa-title" maxlength="220" data-periksa="title" aria-required="true" placeholder="Tuliskan judul penelitianmu" rows="3">${e(p.title)}</textarea>${meta('periksa-title', p.title, 220, false)}</div>`;
  const bahan = titleOnly
    ? `<p class="mt">Judul saja sudah cukup untuk meninjau keselarasan judul.</p>${titleField}`
    : `<p class="mt">Tambahkan bahan yang ingin ditinjau.</p>${uploadZone('periksa', 'Pilih Berkas PDF / DOCX', 'PDF, DOCX, TXT')}${fileList('periksa')}<details class="v6-review-title v6-review-detail" ${p.title ? '' : 'open'}><summary>Judul penelitian · ${p.title ? 'Sudah tersedia' : 'Wajib diisi'}</summary>${titleField}</details>`;
  return (
    pageHead('Apa yang ingin diperiksa?', 'Tinjau judul, satu bab, atau kesiapan naskahmu sebelum seminar proposal dan sidang.', '', '', '', 'PERIKSA SKRIPSI') +
    `<section class="card v6-review-form"><h3 class="mb">1 · Pilih bagian yang diperiksa</h3><div class="field-grid">${scopeSelect}${partSelect}</div>${hint}<hr class="rule"><h3>2 · Tambahkan bahan pemeriksaan</h3>${bahan}<details class="v6-review-title v6-review-detail focus" ${p.focus ? 'open' : ''}><summary>Bagian yang ingin diperhatikan · ${p.focus ? 'Sudah diisi' : 'Opsional'}</summary><div class="field"><label for="periksa-focus">Ada bagian yang ingin diperhatikan? <span>Opsional</span></label><textarea id="periksa-focus" maxlength="400" data-periksa="focus" placeholder="Misalnya: kesesuaian instrumen dan variabel penelitian." rows="3">${e(p.focus)}</textarea>${meta('periksa-focus', p.focus, 400, true)}</div></details>${
      titleOnly
        ? ''
        : `<details class="v6-review-title v6-review-detail paste" ${p.text ? 'open' : ''}><summary>Gunakan teks sebagai bahan pemeriksaan · ${p.text ? 'Sudah diisi' : 'Opsional'}</summary><div class="field"><label for="periksa-text">Tempel teks naskah <span>Opsional</span></label><textarea id="periksa-text" maxlength="20000" data-periksa="text" placeholder="Teks subbagian atau bab yang ingin diperiksa." rows="3">${e(p.text)}</textarea>${meta('periksa-text', p.text, 20000, true)}</div></details>`
    }<p class="small muted mt">Alerin hanya menandai; perbaikannya tetap kamu tulis sendiri. Hasil saat ini contoh berbasis aturan, belum analisis AI.</p><div class="actions mt">${B('Periksa Sekarang', 'run-periksa', 'primary', 'arrow')}${last ? B('Buka Hasil Terakhir', 'nav:hasil-periksa', 'text') : ''}</div></section>`
  );
}
async function readPeriksaFiles() {
  const res = [];
  let text = '';
  for (const f of S.files.filter(x => x.context === 'periksa')) {
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
/* Temuan berbasis kalimat (tahun data, klaim tanpa sumber) masuk ke subbagian tempat kalimat itu berada,
   bukan selalu ke Bab I · Latar Belakang. Urutan: subbagian yang dipilih → judul subbagian terdekat di atas
   kalimat (dalam bab yang dipilih) → subbagian pertama bab yang dipilih. */
function placeFindings(findings, text, p) {
  const flat = text.replace(/\s+/g, ' '),
    bab = /^\d+$/.test(p.chapter) ? +p.chapter : 0;
  const fits = id => PARTS[id] && partApplies(id) && (!bab || PARTS[id].chapter === bab);
  const first = bab ? CHAPTERS[bab - 1]?.[2].find(x => partApplies(x[0]))?.[0] || '' : '';
  for (const f of findings) {
    if (f.part !== 'background' || !String(f.location).startsWith('“…')) continue;
    if (p.part && fits(p.part)) {
      f.part = p.part;
      continue;
    }
    const at = flat.indexOf(f.location.replace(/^“…|…”$/g, ''));
    let best = -1,
      near = '';
    if (at >= 0)
      for (const [id, re] of Object.entries(SECTION_RE)) {
        if (!fits(id)) continue;
        for (const m of flat.matchAll(new RegExp(re.source, 'gi')))
          if (m.index <= at + 30 && m.index > best) {
            best = m.index;
            near = id;
          }
      }
    f.part = near || first || f.part;
  }
  return findings;
}
async function runPeriksa() {
  const p = periksaScope();
  clearErrors();
  p.title = ($('#periksa-title')?.value ?? p.title ?? '').trim();
  p.text = ($('#periksa-text')?.value ?? p.text ?? '').trim();
  p.focus = ($('#periksa-focus')?.value ?? p.focus ?? '').trim();
  const titleOnly = p.chapter === 'title',
    whole = p.chapter === 'all' || p.mode === 'prep',
    hasFile = S.files.some(f => f.context === 'periksa');
  let ok = true;
  if (!p.title) ok = fieldError('periksa-title', 'Kolom ini perlu diisi dulu.');
  else if (isAsal(p.title))
    ok = fieldError('periksa-title', 'Isiannya belum bisa Alerin pahami. Coba tulis dengan kalimat biasa.');
  if (!ok) $('#periksa-title')?.closest('details')?.setAttribute('open', '');
  /* Semua cakupan selain Judul butuh bahan, termasuk kesiapan seminar dan sidang. */
  if (!titleOnly && !hasFile && p.text.length < 80) {
    ok = false;
    $('details.paste')?.setAttribute('open', '');
    fieldError(
      'periksa-text',
      p.text ? 'Teksnya terlalu pendek untuk diperiksa. Tempel minimal satu paragraf.' : 'Unggah naskah atau tempel teks bab dulu.',
    );
  } else if (!titleOnly && p.text && isAsal(p.text.slice(0, 200))) {
    $('details.paste')?.setAttribute('open', '');
    ok = fieldError('periksa-text', 'Isiannya belum bisa Alerin pahami. Coba tulis dengan kalimat biasa.');
  }
  if (!ok) return focusFirstError();
  let kurang = null;
  await processing('Membaca naskahmu', async () => {
    const read = titleOnly ? { text: '', files: [] } : await readPeriksaFiles();
    const text = (read.text + '\n' + (titleOnly ? '' : p.text)).trim();
    /* Naskah utuh yang terlalu pendek tidak dinilai: hasilnya akan tampak "siap" padahal belum terbaca. */
    const len = text.replace(/\s/g, '').length;
    if (whole && len < NASKAH_MIN) {
      kurang = { len, gagal: read.files.find(f => !f.ok) };
      return;
    }
    const prep = p.mode === 'prep' ? p.prep : '';
    const chapters =
      prep === 'sempro'
        ? proposalChapters()
        : prep === 'sidang' || p.chapter === 'all'
          ? CHAPTERS.map((c, i) => i + 1)
          : titleOnly
            ? []
            : [+p.chapter];
    const partName = p.mode === 'bab' && p.part && PARTS[p.part] ? PARTS[p.part].name : '';
    const scope =
      prep === 'sempro'
        ? 'Kesiapan seminar proposal'
        : prep === 'sidang'
          ? 'Kesiapan sidang skripsi'
          : titleOnly
            ? 'Judul penelitian'
            : p.chapter === 'all'
              ? 'Keseluruhan naskah'
              : (chapterOpts().find(x => x[0] === p.chapter) || ['', 'Bab ' + p.chapter])[1] + (partName ? ' · ' + partName : '');
    const findings = placeFindings(
      findIssues(text, {
        chapters: p.part && p.mode === 'bab' ? [] : chapters,
        title: p.title,
        titleOnly,
        prep,
        method: methodKind(),
      }),
      text,
      p,
    );
    /* Subbagian yang terbaca sudah tampil di Dasar Pemeriksaan, jadi tidak diulang sebagai "sudah kuat". */
    const strengths = findStrengths(text, { title: p.title, titleOnly }, findings).filter(([j]) => j !== 'Subbagian sudah terbaca');
    const sections = Object.entries(SECTION_RE)
      .filter(([id, re]) => re.test(text) && PARTS[id])
      .map(([id]) => PARTS[id].name);
    const r = {
      id: 'rv-' + Date.now().toString(36),
      date: new Date().toISOString(),
      mode: p.mode,
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
    /* Pemeriksaan baru menjawab catatan "judul aktif berubah". */
    S.needsReview = false;
    if (p.title && !S.title) S.review.title = p.title;
    record('Pemeriksaan selesai', `${scope} · ${findings.length} hal perlu diperbaiki, ${strengths.length} sudah kuat`);
    synchronizeResearch();
    persist();
    go('hasil-periksa');
  });
  if (kurang) {
    closeModal(true);
    persist();
    $('details.paste')?.setAttribute('open', '');
    const label = chapterOpts().find(o => o[0] === p.chapter)?.[1] || 'Naskah utuh';
    fieldError(
      'periksa-text',
      `Naskah yang terbaca baru ${kurang.len.toLocaleString('id-ID')} karakter. ${label} perlu naskah utuh, minimal ${NASKAH_MIN.toLocaleString('id-ID')} karakter. Unggah naskah lengkap, atau pilih satu bab.` +
        (kurang.gagal ? ` Berkas ${kurang.gagal.name} gagal dibaca: ${kurang.gagal.info}` : ''),
    );
    focusFirstError();
  }
}

Object.assign(ACTIONS, {
  /* Dari catatan "Judul aktif berubah": periksa judul aktif yang baru. */
  'periksa-judul': () => {
    const p = ensurePeriksa();
    p.chapter = 'title';
    p.part = '';
    p.title = S.title || p.title;
    persist();
    go('periksa');
  },
  'periksa-bab': arg => {
    const p = ensurePeriksa();
    p.chapter = arg;
    p.part = '';
    persist();
    go('periksa');
  },
  'run-periksa': async () => {
    await runPeriksa();
  },
  'periksa-ulang': () => {
    const r = latestReview(),
      p = periksaScope();
    if (r) {
      p.chapter = r.mode === 'prep' ? (r.prep === 'sidang' ? 'prep-sidang' : 'prep-sempro') : r.chapter || p.chapter;
      p.part = r.part || '';
    }
    persist();
    go('periksa');
    toast('Ganti berkas lama dengan naskah terbarumu, lalu periksa lagi.');
  },
});
