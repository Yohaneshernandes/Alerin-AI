'use strict';
/* Halaman mulai. */
function guideSeed() {
  ensureGuide();
  const f = S.guide.fields,
    d = S.draft || {},
    sp = splitTheoryMethod(d.idea);
  f.background ??= { f0: [d.topic, d.location].filter(Boolean).join(' · '), f1: d.phenomenon || '', f2: '', f3: '' };
  f.design ??= { f0: sp.method ? capitalize(sp.method) : S.profile.method || '', f1: '', f2: '' };
  if (sp.theory) f.theory ??= { f0: '', f1: capitalize(sp.theory), f2: '' };
}
const METODE = ['Kualitatif', 'Kuantitatif', 'Metode campuran', 'Penelitian dan pengembangan (R&D)', 'Belum ditentukan'];
function ensureKonteks() {
  S.konteks ??= { chapter: '', method: '', deadline: '', kendala: '', title: '', savedAt: '' };
  return S.konteks;
}
const semesterValid = () => +S.profile.semester >= 1 && +S.profile.semester <= 14;
/* Lencana "Konteks tersimpan" hanya muncul kalau kolom wajib terisi dan sudah disimpan. */
const konteksLengkap = () => semesterValid() && !!ensureKonteks().method && !!S.konteks.savedAt;
function mulaiView() {
  ensureGuide();
  const v = S.guide.view;
  if (['konteks', 'idea', 'guide'].includes(v)) return v;
  if (!ensureKonteks().savedAt) return 'konteks';
  return S.title ? 'guide' : 'idea';
}
function mulaiPage() {
  const view = mulaiView();
  if (view === 'guide') return workspaceView();
  if (view === 'idea')
    return pageHead('Mulai Skripsi', 'Tentukan topik atau judul sebagai awal penyusunan.') + chapterNav('idea') + ideaView();
  return pageHead('Mulai Skripsi', 'Panduan pengerjaan dari penentuan arah sampai Bab V.') + konteksView();
}
/* Pemilih bab dan subbagian (tampilan GPT: Peta Skripsi · Panduan Penyusunan). */
function chapterNav(view) {
  ensureGuide();
  const id = S.guide.part,
    p = PARTS[id];
  return `<section class="card v4-map-picker"><span class="eyebrow">PETA SKRIPSI · PANDUAN PENYUSUNAN</span><div class="v4-chapters">${B('Topik / Judul', 'guide-view:idea', view === 'idea' ? 'primary' : 'soft')}${CHAPTERS.map((c, ci) => B('Bab ' + c[0], 'guide-bab:' + (ci + 1), view === 'guide' && p?.chapter === ci + 1 ? 'primary' : 'soft', '', `title="${e(c[1])}"`)).join('')}</div><label for="part-select">Subbagian yang dikerjakan</label><select id="part-select" data-part-select="1"><option value="topic" ${view === 'idea' ? 'selected' : ''}>Topik / Judul</option>${CHAPTERS.map(
    (c, ci) =>
      `<optgroup label="Bab ${c[0]}">${c[2]
        .filter(x => partApplies(x[0]))
        .map(x => {
          const st = partStatus(x[0]);
          return `<option value="${x[0]}" ${view === 'guide' && x[0] === id ? 'selected' : ''}>${e(x[1])}${st[0] ? ' · ' + st[1] : ''}</option>`;
        })
        .join('')}</optgroup>`,
  ).join('')}</select></section>`;
}
function konteksView() {
  const c = ensureKonteks(),
    saved = konteksLengkap();
  const opsi = (list, val, kosong) =>
    (kosong !== null ? `<option value="">${kosong}</option>` : '') +
    list.map(([v, l]) => `<option value="${e(v)}" ${String(val) === String(v) ? 'selected' : ''}>${e(l)}</option>`).join('');
  const titleVal = c.title || S.title || '';
  return `<section class="card v3-context"><div class="section-head"><div><span class="eyebrow">LANGKAH AWAL</span><h2>Konteks Skripsi</h2></div>${badge(saved ? 'Konteks tersimpan' : 'Lengkapi konteks', saved ? 'green' : '')}</div><p>Tentukan bagian yang ingin dikerjakan. Semester tersinkron dengan personalisasi.</p><div class="context-identity"><strong>${e(S.profile.campus || 'Kampus belum tersedia')}</strong><p>${e(S.profile.major || 'Jurusan belum tersedia')}</p><p class="small muted">Identitas mengikuti Profil di Alerin Induk.</p></div><div class="field-grid"><div class="field"><label for="ctx-semester">Semester · Wajib</label><select id="ctx-semester" aria-required="true">${opsi(
    Array.from({ length: 14 }, (_, i) => [String(i + 1), String(i + 1)]),
    semesterValid() ? S.profile.semester : '',
    'Pilih semester',
  )}</select></div><div class="field"><label for="ctx-chapter">Bagian yang ingin dikerjakan</label><select id="ctx-chapter" data-bind="konteks.chapter">${opsi(
    CHAPTERS.map((ch, i) => [String(i + 1), `Bab ${ch[0]}`]),
    c.chapter,
    'Masih mencari ide',
  )}</select></div><div class="field"><label for="ctx-deadline">Target penyelesaian skripsi <span>Opsional</span></label><input id="ctx-deadline" type="date" max="${DATE_MAX}" min="${isoToday()}" data-bind="konteks.deadline" value="${e(c.deadline || '')}"></div><div class="field"><label for="ctx-method">Metode · Wajib</label><select id="ctx-method" data-bind="konteks.method" aria-required="true">${opsi(
    METODE.map(m => [m, m]),
    c.method,
    'Pilih metode',
  )}</select></div></div><div class="field"><label for="ctx-kendala">Kendala <span>Opsional</span></label><textarea id="ctx-kendala" maxlength="500" data-bind="konteks.kendala" placeholder="Bagian yang masih membingungkan" rows="3">${e(c.kendala || '')}</textarea><div class="field-meta"><span>Boleh dilengkapi kemudian.</span><span data-count="ctx-kendala">${String(c.kendala || '').length}/500</span></div></div><div class="field"><label for="ctx-title">Judul yang sudah dimiliki <span>Opsional</span></label><textarea id="ctx-title" maxlength="350" data-bind="konteks.title" placeholder="Kosongkan jika masih mencari judul." rows="3">${e(titleVal)}</textarea><div class="field-meta"><span>${S.title ? 'Mengubah judul di sini mengganti judul aktif.' : 'Boleh dilengkapi kemudian.'}</span><span data-count="ctx-title">${titleVal.length}/350</span></div></div><div class="actions">${B('Simpan dan Lanjutkan', 'konteks-save', 'primary')}${B('Isi Contoh', 'ctx-sample', 'text')}</div>${c.savedAt ? `<p class="small muted mt">Disimpan ${e(savedStamp(c.savedAt))}.</p>` : ''}</section>`;
}
function ideaView() {
  const d = S.draft || {};
  const topics = /komunikasi/i.test(S.profile.major)
    ? ['Film sebagai media belajar', 'Literasi informasi mahasiswa', 'Komunikasi kesehatan digital', 'Pengalaman audiens media sosial']
    : /akuntansi|ekonomi/i.test(S.profile.major)
      ? ['Literasi keuangan mahasiswa', 'Pelaporan keuangan UMKM', 'Penggunaan aplikasi akuntansi', 'Perilaku pengelolaan keuangan']
      : ['Pengalaman belajar mahasiswa', 'Pemanfaatan teknologi di bidang studi', 'Hambatan akses layanan', 'Perubahan perilaku di lingkungan kampus'];
  const chosen = S.title
    ? `<div class="mt mb">${note(`Judul dipilih: <strong>${e(S.title)}</strong>. Lanjutkan penyusunan lewat Bab I–V di atas. ` + B('Buka Bab I', 'guide-bab:1', 'text small'))}</div>`
    : S.draftReady
      ? `<div class="mt mb">${note('Rancangan dan opsi judul terakhir tersimpan. ' + B('Lihat Opsi Judul', 'output-tab:titles', 'text small'))}</div>`
      : '';
  return `${chosen}<section class="card"><h2>Topik / Judul</h2><p>Inspirasi awal untuk ${e(S.profile.major || 'jurusan yang kamu isi')}.</p><div class="v4-topics">${topics.map(t => B(e(t), 'use-topic:' + t, 'soft')).join('')}</div>${field('draft-topic', 'Topik atau bidang yang ingin diteliti', d.topic, 'Topik yang ingin dipahami', 150, 'textarea', 'draft.topic', false)}${field('draft-phenomenon', 'Fenomena atau masalah yang kamu lihat', d.phenomenon, 'Kondisi atau masalah yang kamu amati', 600, 'textarea', 'draft.phenomenon', false)}${field('draft-location', 'Objek, subjek, atau lokasi penelitian', d.location, 'Siapa atau apa yang ingin diteliti?', 150, 'textarea', 'draft.location')}${field('draft-idea', 'Teori, jurnal, atau metode yang terpikir', d.idea, 'Boleh dikosongkan jika belum ada gambaran.', 500, 'textarea', 'draft.idea')}${B('Lanjutkan', 'build-draft', 'primary')}${S.draftSavedAt ? `<p class="small muted mt">Draf tersimpan ${e(savedStamp(S.draftSavedAt))}.</p>` : ''}</section>`;
}
function workspaceView() {
  ensureGuide();
  guideSeed();
  const id = PARTS[S.guide.part] && partApplies(S.guide.part) ? S.guide.part : 'background',
    p = PARTS[id],
    v = S.guide.fields[id] || {},
    g = S.guide.guidance[id],
    kor = (S.guide.koreksi || {})[id],
    t = S.tasks.find(x => x.part === id && x.status !== 'done'),
    nx = nextPart(id),
    c = ensureKonteks();
  S.guide.part = id;
  const area = (fid, label, opt, val, max, rows, ph, bind) =>
    `<div class="field"><label for="${fid}">${e(label)}${opt ? OPT : REQ}</label><textarea id="${fid}" data-guide="${bind}" maxlength="${max}" placeholder="${e(ph)}" rows="${rows}" ${opt ? '' : 'aria-required="true"'}>${e(val || '')}</textarea><div class="field-meta"><span>${opt ? 'Boleh dilengkapi kemudian.' : ''}</span><span data-count="${fid}">${String(val || '').length}/${max}</span></div></div>`;
  const fields = p.fields
    .map((f, i) => {
      const [label, opt] = f.split('|');
      return area('guide-' + id + '-' + i, label, !!opt, v['f' + i], 1500, 3, 'Tuliskan berdasarkan bahan yang tersedia.', `${id}:f${i}`);
    })
    .join('');
  const draf = area('guide-' + id + '-draft', 'Draf tulisanmu', true, v.draft, 6000, 7, `Tulis paragraf ${p.name.toLowerCase()} dengan kalimatmu sendiri. Alerin tidak menuliskannya untukmu.`, `${id}:draft`);
  const koreksi = kor
    ? `<div class="v3-guidance" id="koreksi-box"><span class="eyebrow">KOREKSI · CONTOH, BELUM ANALISIS AI</span><h3>${e(p.name)}</h3>${kor.length ? outputRows(kor.map(f => [f.title, f.fix]), false) : '<p class="small">Aturan pemeriksaan Alerin tidak menemukan catatan pada tulisan ini. Tetap bahas bersama pembimbingmu.</p>'}<p class="small muted">Koreksi hanya menandai. Perbaikannya kamu tulis sendiri.</p></div>`
    : '';
  const arahan = g
    ? `<div class="v3-guidance" id="arahan-box"><span class="eyebrow">ARAHAN TERSIMPAN</span><h3>${e(p.name)}</h3>${outputRows(guidanceRows(id), false)}<p class="small muted">Panduan berbasis isianmu, belum analisis AI. Tulis bagian ini dengan kalimatmu sendiri.</p></div>`
    : '';
  const next = `<div class="mt"><h3>Langkah berikutnya</h3><div class="v3-focus"><span>${nx ? e(partLabel(nx)) : 'Periksa bab yang sudah kamu tulis'}</span>${nx ? B('Lanjut ke ' + PARTS[nx].name, 'guide-part:' + nx, 'soft') : B('Periksa Skripsi', 'periksa-bab:' + p.chapter, 'soft')}</div></div>`;
  return (
    pageHead('Mulai Skripsi', 'Panduan Bab I–V · isian setiap subbagian tersimpan otomatis di perangkat ini.', 'guide-view:konteks', 'Edit Konteks') +
    `<div class="v3-context-strip"><strong>${e(S.title || 'Judul belum dipilih')}</strong><span>${e(c.method || S.profile.method || 'Metode belum ditentukan')}</span></div><div class="v3-work-layout">${chapterNav('guide')}<section class="card v3-editor"><span class="eyebrow">BAB ${p.roman} · ${e(p.chapterName)}</span><h2>${e(p.name)}</h2>${['hypothesis', 'boundaries'].includes(id) ? note('Bagian ini opsional. Gunakan jika sesuai desain dan pedoman kampus.') : ''}${selectField('guide-method', 'Pendekatan penelitian', METODE, c.method || 'Belum ditentukan')}<div class="v3-section-fields">${fields}${draf}</div><div class="actions v3-editor-actions">${B('Kerjakan', t ? 'task:' + t.id : 'guide-task', 'primary')}${B('Simpan Bagian', 'guide-save', '')}${B('Lihat Arahan', 'guide-arahan', 'text')}${B('Minta Koreksi', 'guide-koreksi', 'text')}</div>${S.guide.saved[id] ? `<p class="small muted mt">Disimpan ${e(savedStamp(S.guide.saved[id]))}${t ? ' · ada di Progres Aktif' : ''}</p>` : ''}${arahan}${koreksi}${next}</section></div>`
  );
}
function guidanceRows(id) {
  const p = PARTS[id],
    v = S.guide.fields[id] || {},
    missing = p.fields
      .map((f, i) => [f, i])
      .filter(([f, i]) => !f.includes('|optional') && !String(v['f' + i] || '').trim())
      .map(([f]) => f.split('|')[0]);
  const q = methodKind() === 'kualitatif';
  const specific = {
    background:
      'Urutkan: topik dan objek → fenomena → masalah → kebutuhan penelitian. Pisahkan fakta yang punya sumber dari dugaanmu, lalu cari bukti untuk klaim yang belum punya referensi.',
    questions: q
      ? 'Rumuskan pertanyaan tentang pengalaman, proses, atau pemaknaan. Hindari pertanyaan yang memaksakan hubungan variabel.'
      : 'Turunkan pertanyaan dari masalah. Gunakan hubungan antarvariabel hanya bila desainmu memang mengujinya.',
    objectives:
      'Buat satu tujuan untuk setiap rumusan masalah. Gunakan kata kerja yang sesuai pendekatan, tanpa menjanjikan hasil.',
    results: 'Petakan setiap hasil ke pertanyaan penelitian dan lokasi buktinya. Bedakan hasil dari penafsiranmu.',
    conclusion: 'Gunakan hanya temuan Bab IV yang menjawab rumusan masalah.',
    analysis:
      methodKind() === 'campuran'
        ? 'Jelaskan analisis kualitatif dan kuantitatif secara terpisah, lalu cara keduanya dipertemukan.'
        : 'Cocokkan teknik analisis dengan pertanyaan, bentuk data, dan asumsinya.',
  };
  return [
    ['Dasar arahan', `${S.title || 'Judul belum dipilih'} · ${p.name}${methodKind() ? ' · ' + capitalize(methodKind()) : ''}`],
    ['Urutan pengerjaan', specific[id] || STEP_BY_PART[id]],
    [
      'Bahan yang masih diperlukan',
      missing.length
        ? missing.join('; ') + '.'
        : 'Isian wajib sudah ada. Periksa ketepatan dan sumbernya bersama pembimbing.',
    ],
    ['Hasil yang disiapkan', `Draf ${p.name.toLowerCase()} yang kamu tulis sendiri, beserta sumbernya.`],
  ];
}
function validatePart(id) {
  clearErrors();
  const p = PARTS[id];
  let ok = true;
  p.fields.forEach((f, i) => {
    if (f.includes('|optional')) return;
    const fid = 'guide-' + id + '-' + i,
      el = $('#' + fid);
    if (!el) return;
    const v = el.value.trim();
    if (!v) {
      fieldError(fid, 'Kolom ini perlu diisi dulu.');
      ok = false;
    } else if (isAsal(v)) {
      fieldError(fid, 'Isiannya belum bisa Alerin pahami. Coba tulis dengan kalimat biasa.');
      ok = false;
    }
  });
  if (!ok) focusFirstError();
  return ok;
}

Object.assign(ACTIONS, {
  'use-topic': arg => {
    S.draft.topic = arg;
    S.draftSample = false;
    persist();
    closeModal(true);
    render();
    $('#draft-phenomenon')?.focus();
  },
  'enter-wizard': () => {
    closeModal(true);
    if (route === 'mulai') render();
    else go('mulai');
  },
  'guide-view': arg => {
    ensureGuide();
    S.guide.view = ['konteks', 'idea', 'guide'].includes(arg) ? arg : 'konteks';
    persist();
    closeModal(true);
    if (route !== 'mulai') go('mulai');
    else render();
  },
  'konteks-save': () => {
    clearErrors();
    const c = ensureKonteks();
    let ok = true;
    const sem = $('#ctx-semester').value;
    if (!(+sem >= 1 && +sem <= 14)) ok = fieldError('ctx-semester', 'Pilih semester 1–14.');
    if (!$('#ctx-method').value)
      ok = fieldError('ctx-method', 'Pilih metode dulu. Kalau belum yakin, pilih “Belum ditentukan”.');
    if (!checkFutureDate('ctx-deadline')) ok = false;
    const kendala = $('#ctx-kendala').value.trim();
    if (kendala && isAsalShort(kendala))
      ok = fieldError('ctx-kendala', 'Isiannya belum bisa Alerin pahami. Coba tulis dengan kalimat biasa.');
    const title = ($('#ctx-title')?.value || '').trim();
    if (title && (isAsal(title) || title.split(/\s+/).length < 4))
      ok = fieldError('ctx-title', 'Judul terlalu pendek. Tulis judul lengkap, atau kosongkan dulu.');
    if (!ok) return focusFirstError();
    S.profile.semester = String(+sem);
    Object.assign(c, {
      method: $('#ctx-method').value,
      chapter: $('#ctx-chapter').value,
      deadline: $('#ctx-deadline').value,
      kendala: capitalize(kendala),
      title: '',
      savedAt: new Date().toISOString(),
    });
    S.profile.method = c.method === 'Belum ditentukan' ? '' : c.method;
    if (c.deadline) S.profile.deadline = c.deadline;
    const nt = title ? titleCase(title) : '';
    if (nt && nt !== S.title) {
      const old = S.title;
      if (old) {
        (S.titleVersions ??= []).push({ title: old, time: new Date().toISOString() });
        S.needsReview = true;
      }
      S.title = nt;
      S.review.title = S.title;
      S.sample = false;
      S.stageLog = [
        { stage: 0, text: 'Judul dipilih', by: 'menurut pengguna', date: isoToday() },
        ...(S.stageLog || []).filter(x => x.stage !== 0),
      ];
      record(old ? 'Judul aktif diganti dari Konteks' : 'Judul dicatat dari Konteks', S.title);
    }
    ensureGuide();
    S.guide.view = !c.chapter && !S.title ? 'idea' : 'guide';
    if (c.chapter) {
      const first = CHAPTERS[+c.chapter - 1][2].map(x => x[0]).find(partApplies);
      if (PARTS[S.guide.part]?.chapter !== +c.chapter && first) S.guide.part = first;
    }
    record('Konteks skripsi disimpan', [c.method, c.chapter ? 'Bab ' + CHAPTERS[+c.chapter - 1][0] : ''].filter(Boolean).join(' · '));
    synchronizeResearch();
    persist();
    render();
    window.scrollTo({ top: 0 });
    toast(S.guide.view === 'idea' ? 'Konteks tersimpan. Lanjutkan dengan topik atau judul.' : 'Konteks tersimpan. Workspace siap dipakai.');
  },
  'ctx-sample': () => {
    const c = ensureKonteks();
    if (!semesterValid()) S.profile.semester = '7';
    Object.assign(c, {
      chapter: c.chapter || '1',
      method: c.method || 'Kualitatif',
      kendala: c.kendala || 'Belum yakin cara merumuskan masalah penelitian dari fenomena yang diamati.',
    });
    persist();
    render();
    toast('Contoh konteks dimuat. Tinjau lalu simpan.');
  },
  'guide-bab': arg => {
    ensureGuide();
    const list = CHAPTERS[+arg - 1][2].map(x => x[0]).filter(partApplies);
    if (PARTS[S.guide.part]?.chapter !== +arg) S.guide.part = list[0];
    S.guide.view = 'guide';
    persist();
    render();
    $(`[data-action="guide-bab:${arg}"]`)?.focus({ preventScroll: true });
  },
  'guide-part': arg => {
    ensureGuide();
    S.guide.part = arg;
    S.guide.view = 'guide';
    persist();
    closeModal(true);
    if (route !== 'mulai') go('mulai');
    else {
      render();
      $(`[data-action="guide-part:${arg}"]`)?.focus({ preventScroll: true });
    }
  },
  'guide-koreksi': () => {
    const id = S.guide.part,
      v = S.guide.fields[id] || {},
      text = Object.values(v).join('\n').trim();
    clearErrors();
    if (text.replace(/\s/g, '').length < 40) {
      fieldError('guide-' + id + '-draft', 'Tulis dulu jawaban atau drafmu, minimal satu kalimat, supaya bisa dikoreksi.');
      focusFirstError();
      return;
    }
    const catatan = findIssues(text, { chapters: [], title: '' });
    if (isAsal(text.slice(0, 160)))
      catatan.unshift({ title: 'Tulisan belum bisa dipahami', fix: 'Tulis ulang dengan kalimat biasa.' });
    (S.guide.koreksi ??= {})[id] = catatan.map(f => ({ title: f.title, fix: f.fix }));
    record('Koreksi diminta', partLabel(id));
    persist();
    render();
    $('#koreksi-box')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  },
  'guide-next': arg => {
    closeModal(true);
    const t = partTask(arg, { source: 'mulai' });
    reorderTasks(false);
    ensureGuide();
    S.guide.part = arg;
    S.guide.view = 'guide';
    persist();
    go('mulai');
    toast(`“${t.title}” masuk ke Progres Aktif.`);
  },
  'guide-arahan': () => {
    const id = S.guide.part;
    S.guide.guidance[id] = true;
    persist();
    render();
    $('#arahan-box')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  },
  'guide-save': () => {
    const id = S.guide.part;
    if (!validatePart(id)) return;
    S.guide.saved[id] = new Date().toISOString();
    record('Bagian disimpan', partLabel(id));
    persist();
    render();
    toast(`${PARTS[id].name} tersimpan.`);
  },
  'guide-task': () => {
    const id = S.guide.part;
    if (!validatePart(id)) return;
    S.guide.saved[id] = new Date().toISOString();
    const t = partTask(id, { source: 'mulai' });
    const changed = reorderTasks(true);
    persist();
    render();
    if (changed !== false) toast(`“${t.title}” masuk ke Progres Aktif.`);
  },
  'save-draft': () => {
    S.draftSavedAt = new Date().toISOString();
    record('Draf ide disimpan', S.draft.topic || 'Draf');
    persist();
    render();
    toast('Draf tersimpan.');
  },
  'build-draft': async () => {
    clearErrors();
    let ok = checkRequired('draft-topic');
    if (!checkRequired('draft-phenomenon', { min: 20, label: 'fenomena' })) ok = false;
    for (const id of ['draft-location', 'draft-idea']) {
      const v = $('#' + id)?.value.trim();
      if (v && isAsal(v) && v.split(/\s+/).length > 1) {
        fieldError(id, 'Isiannya belum bisa Alerin pahami. Coba tulis dengan kalimat biasa.');
        ok = false;
      }
    }
    if (!ok) return focusFirstError();
    await processing('Menyusun rancangan dan opsi judul', () => {
      S.draftReady = true;
      S.draftSample = false;
      S.researchBundles = {};
      outputTab = 'titles';
      record('Rancangan dan opsi judul disusun', S.draft.topic);
      persist();
      go('hasil-awal');
    });
  },
});
