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

  const titleLength = String(p.title || '').length;
  const focusLength = String(p.focus || '').length;
  const textLength = String(p.text || '').length;

  return `
    <div class="pk-page-v2">
      <div class="pk-page-head-v2">
        <h1 class="pk-page-title-v2">Apa yang ingin diperiksa?</h1>
        <p class="pk-page-desc-v2">Tinjau judul, satu bab, atau kesiapan naskahmu sebelum seminar proposal dan sidang.</p>
      </div>

      <section class="card pk-card-v2">
        <!-- Bagian 1: Pilih bagian yang diperiksa -->
        <div class="pk-section-v2">
          <div class="pk-section-head-v2">
            <h2 class="pk-section-title-v2">Pilih bagian yang diperiksa</h2>
          </div>

          <div class="pk-dropdown-row-v2">
            <!-- Dropdown 1: Bagian yang ingin diperiksa -->
            <div class="field pk-field-v2">
              <label for="periksa-chapter" class="pk-label-v2">Bagian yang ingin diperiksa</label>
              <div class="pk-select-wrap-v2">
                <select id="periksa-chapter" data-periksa="chapter" class="pk-select-v2">
                  ${scopeGroups()
                    .map(
                      ([g, opts]) =>
                        `<optgroup label="${g}">${opts
                          .map(
                            ([v, l]) =>
                              `<option value="${v}" ${p.chapter === v ? 'selected' : ''}>${e(l)}</option>`,
                          )
                          .join('')}</optgroup>`,
                    )
                    .join('')}
                </select>
                <div class="pk-select-arrow-v2">${I('down')}</div>
              </div>
            </div>

            <!-- Dropdown 2: Subbagian (Opsional) -->
            <div class="field pk-field-v2">
              <div class="pk-label-row-v2">
                <label for="periksa-part" class="pk-label-v2">Subbagian</label>
                <span class="pk-optional-badge-v2">Opsional</span>
              </div>
              <div class="pk-select-wrap-v2">
                <select id="periksa-part" data-periksa="part" class="pk-select-v2" ${ch ? '' : 'disabled'}>
                  <option value="">${ch ? `Seluruh Bab ${ch[0]}` : 'Pilih bab untuk memilih subbagian'}</option>
                  ${ch
                    ? ch[2]
                        .filter(x => partApplies(x[0]))
                        .map(
                          x =>
                            `<option value="${x[0]}" ${p.part === x[0] ? 'selected' : ''}>${e(x[1])}</option>`,
                        )
                        .join('')
                    : ''}
                </select>
                <div class="pk-select-arrow-v2">${I('down')}</div>
              </div>
            </div>
          </div>

          <!-- Info row -->
          <div class="pk-info-row-v2">
            <div class="pk-info-icon-v2">${I('info')}</div>
            <span class="pk-info-text-v2">
              Susunan Bab I–${lastRoman()} mengikuti pilihan <strong class="pk-info-strong-v2">${e(SUSUNAN[susunanId()].label)}</strong> di Konteks Skripsi.
            </span>
          </div>
        </div>

        <div class="pk-divider-v2"></div>

        <!-- Bagian 2: Tambahkan bahan pemeriksaan -->
        <div class="pk-section-v2">
          <div class="pk-section-head-v2">
            <h2 class="pk-section-title-v2">Tambahkan bahan pemeriksaan</h2>
            <p class="pk-section-desc-v2">Tambahkan bahan yang ingin ditinjau.</p>
          </div>

          <!-- Upload Zone -->
          <label class="upload-zone pk-upload-zone-v2" for="upload-periksa">
            <div class="pk-upload-icon-circle-v2">${I('upload')}</div>
            <strong class="pk-upload-title-v2">Pilih Berkas PDF / DOCX</strong>
            <small class="pk-upload-desc-v2">PDF, DOCX, TXT · maksimal ${limit().mb} MB per berkas</small>
            <small class="pk-upload-cta-v2">Klik untuk memilih atau letakkan berkas di sini.</small>
            <input class="native-input" id="upload-periksa" type="file" data-file-context="periksa" accept=".pdf,.docx,.txt" multiple>
          </label>
          ${fileList('periksa')}

          <!-- Form Fields Stack -->
          <div class="pk-fields-stack-v2">
            <!-- Field 1: Judul penelitian -->
            <div class="field pk-field-v2">
              <div class="pk-label-row-v2">
                <label for="periksa-title" class="pk-label-v2">Judul penelitian <span class="pk-required-star-v2">*</span></label>
                <span class="pk-counter-v2" data-count="periksa-title">${titleLength}/220</span>
              </div>
              <textarea id="periksa-title" maxlength="220" data-periksa="title" class="pk-textarea-v2" placeholder="Tuliskan judul penelitianmu" rows="3">${e(p.title)}</textarea>
            </div>

            <!-- Field 2: Ada bagian yang ingin diperhatikan? -->
            <div class="field pk-field-v2">
              <div class="pk-label-row-v2">
                <div class="pk-label-left-v2">
                  <label for="periksa-focus" class="pk-label-v2">Ada bagian yang ingin diperhatikan?</label>
                  <span class="pk-optional-sub-v2">· Opsional</span>
                </div>
                <span class="pk-counter-v2" data-count="periksa-focus">${focusLength}/400</span>
              </div>
              <textarea id="periksa-focus" maxlength="400" data-periksa="focus" class="pk-textarea-v2" placeholder="Misalnya: kesesuaian instrumen dan variabel penelitian." rows="3">${e(p.focus)}</textarea>
            </div>

            <!-- Field 3: Gunakan teks sebagai bahan pemeriksaan -->
            <div class="field pk-field-v2">
              <div class="pk-label-row-v2">
                <div class="pk-label-left-v2">
                  <label for="periksa-text" class="pk-label-v2">Gunakan teks sebagai bahan pemeriksaan</label>
                  <span class="pk-optional-sub-v2">· Opsional</span>
                </div>
                <span class="pk-counter-v2" data-count="periksa-text">${textLength}/20000</span>
              </div>
              <textarea id="periksa-text" maxlength="20000" data-periksa="text" class="pk-textarea-v2" placeholder="Teks subbagian atau bab yang ingin diperiksa." rows="4">${e(p.text)}</textarea>
            </div>
          </div>
        </div>

        <!-- Actions & Disclaimer -->
        <div class="pk-actions-section-v2">
          <div class="pk-btn-wrap-v2">
            <button class="btn primary pk-submit-btn-v2" data-action="run-periksa">
              <span>Periksa Sekarang</span>
              ${I('arrow')}
            </button>
            ${last ? `<button class="btn text pk-last-btn-v2" data-action="nav:hasil-periksa">Buka Hasil Terakhir</button>` : ''}
          </div>

          <div class="pk-disclaimer-banner-v2">
            <div class="pk-disclaimer-icon-v2">${I('warning')}</div>
            <div class="pk-disclaimer-text-v2">Alerin hanya menandai, perbaikannya tetap kamu tulis sendiri. Hasil saat ini contoh berbasis aturan, belum analisis AI.</div>
          </div>
        </div>
      </section>
    </div>
  `;
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
  /* Dari notifikasi "Judul aktif berubah": periksa judul aktif yang baru. */
  'periksa-judul': () => {
    const p = ensurePeriksa();
    p.chapter = 'title';
    p.part = '';
    p.title = S.title || p.title;
    const notifId = 'title-review:' + (S.activeTitle?.id || S.title || 'current');
    if (!S.notificationReads) S.notificationReads = [];
    if (!S.notificationReads.includes(notifId)) S.notificationReads.push(notifId);
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
