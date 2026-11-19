'use strict';
/* Halaman Revisi Dosen.
   Alur mengikuti studio Revisi Dosen (18 November): pahami arahan → tautkan ke pekerjaan dan kerjakan di Progres Aktif
   → laporkan tindak lanjut (Tinjauan Alerin opsional) → catat selesai di Progres Aktif.
   Arahan dihitung sudah ditindaklanjuti (status 'done') begitu laporannya tersimpan, jadi kunci "Catat Sebagai Selesai"
   di Progres Aktif tetap memakai aturan yang sama. Konfirmasi dosen tidak dicatat di sini: arahan berikutnya ditambahkan
   lewat Tambah Arahan. */
let revQuery = '',
  revStage = '';
const REV_TABS = [
  ['semua', 'Semua'],
  ['konfirmasi', 'Perlu konfirmasi'],
  ['proses', 'Dalam pengerjaan'],
  ['selesai', 'Sudah ditindaklanjuti'],
  ['riwayat', 'Riwayat'],
];
/* Posisi arahan: [label status, warna, kelompok tab]. */
const REV_PHASE = {
  konfirmasi: ['Konfirmasi pemahaman', 'amber', 'konfirmasi'],
  tautkan: ['Siap ditautkan', 'blue', 'proses'],
  kerjakan: ['Perlu dikerjakan', 'blue', 'proses'],
  perbaikan: ['Perlu perbaikan', 'amber', 'proses'],
  klarifikasi: ['Perlu klarifikasi', 'amber', 'proses'],
  ditindaklanjuti: ['Sudah ditindaklanjuti', 'green', 'selesai'],
  selesai: ['Selesai dikerjakan', 'green', 'selesai'],
};
const REV_ANS = { yes: 'Sudah, bukti tersedia', no: 'Belum, perlu diperbaiki', ask: 'Belum yakin, perlu klarifikasi' };
const REV_FLOW = [
  ['Pahami arahan', 'Setujui pemahaman Alerin, atau ubah dulu bila kurang tepat.'],
  ['Tautkan dan kerjakan', 'Arahan masuk ke kartu di Progres Aktif. Perbaikannya dikerjakan di sana.'],
  ['Laporkan tindak lanjut', 'Tulis perubahan yang sudah kamu lakukan. Tinjauan Alerin boleh dipakai untuk cek mandiri.'],
  ['Catat selesai', 'Kartu di Progres Aktif bisa dicatat selesai setelah arahannya dilaporkan.'],
];
const revOf = id => (S.revisions || []).find(x => x.id === id);
const revTask = r => (r && r.taskId && S.tasks.find(t => t.id === r.taskId)) || null;
function revPhase(r) {
  const t = revTask(r);
  if (r.status === 'done' && t && t.status === 'done') return 'selesai';
  if (!revUnderstood(r)) return 'konfirmasi';
  if (r.status === 'done') return 'ditindaklanjuti';
  if (!t) return 'tautkan';
  if (r.review === 'changes') return 'perbaikan';
  if (r.review === 'ask') return 'klarifikasi';
  return 'kerjakan';
}
const revGroup = r => REV_PHASE[revPhase(r)][2];
/* Nomor tahap (0–10) saat arahan dicatat. Arahan lama hanya punya teks tahap, jadi nomornya dibaca dari teks itu. */
function revStageIdx(r) {
  if (Number.isInteger(r.stageIdx)) return r.stageIdx;
  const m = /^(\d{2})/.exec(r.stageText || '');
  if (m) return +m[1] - 1;
  return /^Sebelum/.test(r.stageText || '') ? -1 : null;
}
function revWhere(r) {
  const i = revStageIdx(r);
  const tahap = i === null ? '' : i < 0 ? 'Sebelum Tahap 01' : 'Tahap ' + String(i + 1).padStart(2, '0');
  return [tahap, partLabel(r.part)].filter(Boolean).join(' · ');
}
function revTaskStatus(t) {
  if (t.status === 'done') return 'Selesai dikerjakan';
  if (t.status === 'deferred') return 'Ditunda';
  return activeTasks().some(x => x.id === t.id) ? 'Pekerjaan aktif' : 'Dalam antrean';
}
const revSearchText = r =>
  [r.topic, r.text, r.understanding?.maksud, r.understanding?.langkah, partLabel(r.part), r.doneNote].join(' ').toLowerCase();
function revMatches(r) {
  const q = revQuery.trim().toLowerCase();
  if (q && !revSearchText(r).includes(q)) return false;
  return revStage === '' || String(revStageIdx(r)) === revStage;
}
/* Kriteria selesai: langkah perbaikan Alerin ditambah dua poin umum. Dipakai di laporan dan Tinjauan Alerin. */
function revCriteriaFrom(langkah, part) {
  const out = String(langkah || '')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 8)
    .slice(0, 2);
  for (const g of ['Perubahan menjawab seluruh catatan asli dosen.', `Letak perubahannya di ${partLabel(part) || 'naskah'} bisa ditunjukkan.`])
    if (out.length < 3) out.push(g);
  return out;
}
const revCriteria = r =>
  Array.isArray(r.criteria) && r.criteria.length ? r.criteria : revCriteriaFrom(r.understanding?.langkah, r.part);
/* Pemahaman awal Alerin. Bila pengguna memilih bagian naskah sendiri, bagian itu menjadi bagian utama. */
function revUnderstanding(src, sel = '') {
  const an = analyzeArahan(src);
  if (!sel || !PARTS[sel] || sel === an.part) return { part: an.part, maksud: an.maksud, bagian: an.bagian, langkah: an.langkah };
  const matched = ARAHAN_MAP.some(([re]) => re.test(src));
  const parts = [sel, ...(matched ? an.parts.filter(p => p !== sel) : [])].slice(0, 3);
  const bagian = parts.map(partLabel).join(' dan ');
  const first = String(src).trim().split(/(?<=[.!?])\s+/)[0].replace(/[.!?]+$/, '');
  const inti = first.length > 150 ? first.slice(0, 147) + '…' : first;
  const langkah =
    parts.includes('questions') && parts.includes('conclusion')
      ? 'Cocokkan tiap rumusan masalah dengan satu poin kesimpulan, dengan urutan yang sama.'
      : parts
          .slice(0, 2)
          .map(p => STEP_BY_PART[p])
          .join(' ');
  return { part: sel, maksud: maksudArahan(inti, bagian), bagian, langkah };
}
/* Tebakan bagian naskah saat catatan diketik. Kosong bila tidak ada kata yang dikenali. */
function revGuessPart(src) {
  return ARAHAN_MAP.some(([re]) => re.test(src)) ? analyzeArahan(src).part : '';
}

/* ---------- Halaman ---------- */
function revisiPage() {
  const all = S.revisions || [];
  let tab = { belum: 'proses', sudah: 'selesai' }[S.revFilter] || S.revFilter;
  if (!REV_TABS.some(x => x[0] === tab)) tab = 'semua';
  const n = { konfirmasi: 0, proses: 0, selesai: 0 };
  for (const r of all) n[revGroup(r)]++;

  if (!all.length) {
    return `
      <div class="revisi-page-head">
        <h1>Arahan dosen dari setiap bimbingan</h1>
        <p>Catatan asli dosen tetap utuh. Konfirmasikan pemahaman sebelum menghubungkannya ke Progres Aktif.</p>
      </div>
      <div class="revisi-layout">
        <div class="revisi-main">
          <div class="revisi-empty-card">
            <div class="revisi-empty-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#52647D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </div>
            <h3 class="revisi-empty-title">Belum ada arahan dosen</h3>
            <p class="revisi-empty-desc">Catat arahan setiap selesai bimbingan. Alerin membantu memahami<br/>maksudnya dan menautkannya ke pekerjaan di Progres Aktif.</p>
            <button type="button" class="revisi-btn-tambah" data-action="add-revision">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Tambah Arahan</span>
            </button>
          </div>
        </div>
        <aside class="revisi-sidebar">
          ${revFlow()}
        </aside>
      </div>
    `;
  }

  const stats = [
    [all.length, 'Total arahan'],
    [n.konfirmasi, 'Perlu konfirmasi'],
    [n.proses, 'Dalam pengerjaan'],
    [n.selesai, 'Sudah ditindaklanjuti'],
  ];
  const tabs = `<div class="tabs v4-progress-tabs rv-tabs" role="tablist" aria-label="Saring arahan">${REV_TABS.map(([k, l]) =>
    B(l, 'rev-filter:' + k, tab === k ? 'primary' : 'text', '', `role="tab" aria-selected="${tab === k}"`),
  ).join('')}</div>`;

  return `
    <div class="revisi-page-head">
      <div class="revisi-head-text">
        <h1>Arahan dosen dari setiap bimbingan</h1>
        <p>Catatan asli dosen tetap utuh. Konfirmasikan pemahaman sebelum menghubungkannya ke Progres Aktif.</p>
      </div>
      <div class="revisi-head-action">
        <button type="button" class="revisi-btn-tambah" data-action="add-revision">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Tambah Arahan</span>
        </button>
      </div>
    </div>
    <div class="rv-stats">${stats.map(([v, l]) => `<div class="rv-stat"><strong>${v}</strong><span>${l}</span></div>`).join('')}</div>
    <div class="revisi-layout">
      <div class="revisi-main">
        ${tabs}
        ${tab === 'riwayat' ? revHistory() : revList(all, tab)}
      </div>
      <aside class="revisi-sidebar">
        ${revNext(all)}
        ${revFlow()}
      </aside>
    </div>
  `;
}
function revContext() {
  const st = stageInfo();
  const pos = st.idx !== null && st.idx !== undefined ? stageName(st.idx) + (st.source ? ' · ' + st.source : '') : 'belum tercatat';
  return `<section class="card rv-context" aria-label="Judul penelitian aktif"><span class="rv-context-ico">${I('document')}</span><div class="rv-context-copy"><span class="eyebrow">JUDUL PENELITIAN AKTIF</span><strong>${e(S.title || 'Judul penelitian belum ditentukan')}</strong><small>Posisi penelitian: ${e(pos)}</small></div>${B(S.title ? 'Lihat Konteks' : 'Isi Konteks Skripsi', 'guide-view:konteks', 'text', 'arrow')}</section>`;
}
function revList(all, tab) {
  const rs = all
    .filter(r => tab === 'semua' || revGroup(r) === tab)
    .sort((a, b) => b.date.localeCompare(a.date) || String(b.created || '').localeCompare(String(a.created || '')));
  const filters = `<div class="rv-filters"><label class="rv-search">${I('search')}<input id="rv-search" type="search" aria-label="Cari arahan" maxlength="80" placeholder="Cari arahan atau bagian penelitian" value="${e(revQuery)}" autocomplete="off"></label><label class="rv-stage-pick"><select id="rv-stage-filter" aria-label="Saring tahap"><option value="">Semua tahap</option>${all.some(r => revStageIdx(r) === -1) ? `<option value="-1" ${revStage === '-1' ? 'selected' : ''}>${e(stageName(-1))}</option>` : ''}${ALERIN.phases
    .map((p, i) => `<option value="${i}" ${revStage === String(i) ? 'selected' : ''}>${e(stageName(i))}</option>`)
    .join('')}</select></label></div>`;
  if (!rs.length) return filters + `<div class="card empty"><p class="muted">Tidak ada arahan di daftar ini.</p></div>` + revFoot();
  const groups = {};
  for (const r of rs) (groups[r.date] ??= []).push(r);
  let any = false;
  const html = Object.entries(groups)
    .map(([d, list]) => {
      const vis = list.filter(revMatches).length;
      if (vis) any = true;
      return `<section class="v6-session rv-session" ${vis ? '' : 'hidden'}><div class="section-head"><h2>Bimbingan ${dateLong(d)}</h2><span class="small muted" data-rv-count>${vis} arahan</span></div>${list.map(revCard).join('')}</section>`;
    })
    .join('');
  return (
    filters +
    html +
    `<div class="card empty rv-nomatch" ${any ? 'hidden' : ''}><p class="muted">Tidak ada arahan yang cocok dengan pencarian atau tahap ini.</p></div>` +
    revFoot()
  );
}
const revFoot = () =>
  `<div class="rv-foot"><span class="small muted">Catatan asli, pemahaman, dan laporan tindak lanjut bisa diunduh untuk dibawa saat bimbingan.</span>${B('Unduh catatan revisi', 'rev-export', 'text', 'download')}</div>`;
function revHistory() {
  const hs = (S.history || []).filter(h => historyRoute(h) === 'revisi');
  return `<section class="card rv-history-card"><div class="section-head"><h2>Riwayat bimbingan</h2>${B('Unduh catatan revisi', 'rev-export', 'text', 'download')}</div><p class="small muted">Pemahaman, tautan pekerjaan, laporan, dan tinjauan dicatat berurutan.</p>${
    hs.length
      ? `<ol class="rv-history">${hs.map(h => `<li><strong>${e(h.title)}</strong>${h.detail ? `<span>${e(h.detail)}</span>` : ''}<small>${e(localTime(h.time))} WIB</small></li>`).join('')}</ol>`
      : `<p class="muted mt">Belum ada catatan. Setiap arahan yang dicatat, disetujui, ditautkan, dan dilaporkan akan muncul di sini.</p>`
  }</section>`;
}
function revNext(all) {
  const by = ph => all.find(r => revPhase(r) === ph);
  let r, h, p, btn;
  if ((r = by('konfirmasi')))
    [h, p, btn] = ['Pastikan pemahamanmu sejalan.', 'Konfirmasikan maksud dosen sebelum mengerjakan perbaikan.', B('Tinjau Pemahaman', 'rev-detail:' + r.id, 'primary')];
  else if ((r = by('klarifikasi')))
    [h, p, btn] = ['Pastikan maksud dosen.', `Ada poin yang belum yakin di “${e(r.topic)}”. Tanyakan ulang sebelum memperbarui laporan.`, B('Tanyakan Ulang ke Dosen', 'rev-ask:' + r.id, 'primary')];
  else if ((r = by('perbaikan')))
    [h, p, btn] = ['Lengkapi poin yang belum terpenuhi.', `Tinjauan Alerin untuk “${e(r.topic)}” masih menemukan poin yang perlu diperbaiki.`, B('Kerjakan Revisi', 'rev-work:' + r.id, 'primary')];
  else if ((r = by('tautkan')))
    [h, p, btn] = ['Tautkan arahan ke pekerjaan.', 'Arahan yang sudah dipahami perlu masuk Progres Aktif supaya dikerjakan.', B('Tautkan ke Pekerjaan', 'rev-link:' + r.id, 'primary')];
  else if ((r = by('kerjakan')))
    [h, p, btn] = ['Lanjutkan revisi terdekat.', 'Kerjakan di kartu Progres Aktif, lalu laporkan perubahannya di sini.', B('Kerjakan Revisi', 'rev-work:' + r.id, 'primary')];
  else if ((r = all.find(x => revPhase(x) === 'ditindaklanjuti' && revTask(x))))
    [h, p, btn] = ['Catat pekerjaannya selesai.', 'Arahan sudah ditindaklanjuti. Kartunya di Progres Aktif bisa dicatat selesai setelah isiannya lengkap.', B('Buka Kartu', 'rev-work:' + r.id, 'primary')];
  else [h, p, btn] = ['Semua arahan sudah ditindaklanjuti.', 'Catat arahan baru setiap selesai bimbingan.', B('Tambah Arahan', 'add-revision', 'primary')];
  return `<aside class="card rv-next" aria-label="Langkahmu berikutnya"><span class="eyebrow">LANGKAHMU BERIKUTNYA</span><h3>${h}</h3><p class="small">${p}</p>${btn}</aside>`;
}
function revFlow() {
  return `
    <div class="revisi-flow-card">
      <h3 class="revisi-flow-head">Alur revisi</h3>
      <div class="revisi-flow-list">
        ${REV_FLOW.map(
          ([h, p], i) => `
          <div class="revisi-flow-item">
            <div class="revisi-flow-badge">${i + 1}</div>
            <div class="revisi-flow-content">
              <h4 class="revisi-flow-title">${e(h)}</h4>
              <p class="revisi-flow-desc">${e(p)}</p>
            </div>
          </div>
        `,
        ).join('')}
      </div>
    </div>
  `;
}

/* ---------- Kartu arahan ---------- */
function revTrail(r) {
  const t = revTask(r);
  const steps = [
    ['Pemahaman', revUnderstood(r)],
    ['Ditautkan', !!t],
    ['Tindak lanjut', r.status === 'done'],
    ['Pekerjaan selesai', t?.status === 'done'],
  ];
  const cur = steps.findIndex(s => !s[1]);
  return `<ol class="rv-trail" aria-label="Jejak arahan">${steps
    .map(([l, ok], i) => `<li class="${ok ? 'is-done' : i === cur ? 'is-current' : ''}">${ok ? I('check') : ''}${l}</li>`)
    .join('')}</ol>`;
}
/* Tombol utama sesuai posisi arahan. Dipakai di kartu dan di Detail arahan. */
function revPrimary(r, ph = revPhase(r)) {
  const id = r.id,
    t = revTask(r);
  if (ph === 'konfirmasi') return B('Setujui Pemahaman', 'rev-ok:' + id, 'primary', 'check');
  if (ph === 'tautkan') return B('Tautkan ke Pekerjaan', 'rev-link:' + id, 'primary', 'link');
  if (ph === 'klarifikasi') return B('Tanyakan Ulang ke Dosen', 'rev-ask:' + id, 'primary');
  if (ph === 'kerjakan' || ph === 'perbaikan') return B('Kerjakan Revisi', 'rev-work:' + id, 'primary', 'arrow');
  if (ph === 'ditindaklanjuti') return t ? B('Buka Kartu', 'rev-work:' + id, 'primary', 'arrow') : '';
  return B('Lihat Pekerjaan', 'rev-work:' + id, 'primary', 'arrow');
}
function revSecondary(r, ph) {
  const id = r.id,
    t = revTask(r);
  if (ph === 'konfirmasi') return B('Ubah Pemahaman', 'rev-edit:' + id, '');
  if (ph === 'kerjakan') return B('Laporkan Tindak Lanjut', 'rev-done:' + id, '');
  if (ph === 'perbaikan' || ph === 'klarifikasi') return B('Perbarui Laporan', 'rev-done:' + id, '');
  if (ph === 'ditindaklanjuti' && t) return B('Tinjauan Alerin', 'rev-review:' + id, '');
  return B('Lihat Detail', 'rev-detail:' + id, '');
}
function revHelp(r, ph) {
  const t = revTask(r);
  return {
    konfirmasi: `Baca pemahaman di atas. Setujui kalau sudah sesuai maksud dosen, atau ubah dulu.${t ? ' Kartu pekerjaannya terkunci sampai arahan ini ditindaklanjuti.' : ''}`,
    tautkan: 'Pilih pekerjaan yang cocok di Progres Aktif, atau buat pekerjaan baru.',
    kerjakan: 'Kerjakan di kartu Progres Aktif, lalu laporkan perubahannya di sini.',
    perbaikan: 'Tinjauan Alerin menemukan poin yang belum terpenuhi. Perbaiki, lalu perbarui laporannya.',
    klarifikasi: 'Ada poin yang belum yakin. Pastikan maksudnya ke dosen sebelum memperbarui laporan.',
    ditindaklanjuti: t
      ? `Arahan ini tidak lagi menahan kartu “${e(t.title)}”. Tinjauan Alerin opsional.`
      : 'Sudah ditindaklanjuti tanpa pekerjaan tertaut.',
    selesai: 'Pekerjaannya sudah dicatat selesai. Kalau dosen memberi arahan lagi, tambahkan sebagai arahan baru.',
  }[ph];
}
function revMenu(r, ph) {
  const id = r.id,
    t = revTask(r);
  const items = [
    ['Lihat Detail', 'rev-detail:' + id],
    ph !== 'selesai' && ['Ubah Pemahaman Alerin', 'rev-edit:' + id],
    ph === 'ditindaklanjuti' && t && ['Perbarui Laporan', 'rev-done:' + id],
    ['Tanyakan Ulang ke Dosen', 'rev-ask:' + id],
  ].filter(Boolean);
  return `<details class="v6-options rv-menu"><summary aria-label="Pilihan lain untuk arahan ${e(r.topic)}">${I('more')}</summary><div>${items
    .map(([l, a]) => `<button type="button" class="btn text" data-action="${a}">${l}</button>`)
    .join('')}<button type="button" class="btn text danger-text" data-action="rev-del:${id}">Hapus Arahan</button></div></details>`;
}
function revCard(r) {
  const ph = revPhase(r),
    [label, cls] = REV_PHASE[ph],
    t = revTask(r),
    u = r.understanding || {},
    files = S.files.filter(f => f.context === 'rev-' + r.id),
    idx = revStageIdx(r),
    where = revWhere(r);
  const ulabel = u.edited ? 'diubah olehmu' : revUnderstood(r) ? 'sudah kamu konfirmasi' : 'perlu kamu konfirmasi';
  const report = r.doneNote
    ? `<div class="rv-report"><span class="small muted">${r.status === 'done' ? 'Laporan tindak lanjut' + (r.doneAt ? ' · ' + dateLong(r.doneAt) : '') : 'Laporan terakhir · perlu diperbarui'}</span><p>${e(r.doneNote)}</p></div>`
    : '';
  const tinjau =
    r.review === 'passed' && r.status === 'done' ? badge('Tinjauan Alerin terpenuhi', 'green') : '';
  return `<article class="card v6-revision rv-card ${ph === 'selesai' ? 'is-done' : ''}" id="rev-${r.id}" data-rv-text="${e(revSearchText(r))}" data-rv-stage="${idx === null ? '' : idx}" ${revMatches(r) ? '' : 'hidden'}><div class="rv-meta">${badge(label, cls)}${tinjau}${where ? `<span class="rv-where">${e(where)}</span>` : ''}</div><div class="rv-titleline"><h3>${e(r.topic || 'Arahan dosen')}</h3>${revMenu(r, ph)}</div><div class="v6-original"><span class="small muted">Catatan asli dosen · tidak diubah</span><p>“${e(r.text)}”</p>${files.length ? `<div class="actions">${files.map(f => B(`${e(f.name)} · ${fileSize(f.size)}`, 'open-file:' + f.id, 'text', 'file')).join('')}</div>` : ''}</div><div class="rv-understanding"><strong class="small">Pemahaman Alerin · ${ulabel}</strong><p>${e(u.maksud || '')}</p><p class="small"><strong>Langkah perbaikan:</strong> ${e(u.langkah || '')}</p></div>${report}<p class="rv-link small">${I('link')}<span>${t ? `Tertaut ke <strong>${e(t.title)}</strong> · ${revTaskStatus(t)}` : 'Belum ditautkan ke pekerjaan'}</span></p>${revTrail(r)}<div class="rv-actions"><div class="actions">${revPrimary(r, ph)}${revSecondary(r, ph)}</div><p class="small muted">${revHelp(r, ph)}</p></div></article>`;
}

/* ---------- Tambah arahan ---------- */
function revPartSelect(id, value, auto) {
  const opts = CHAPTERS.map(
    c =>
      `<optgroup label="Bab ${c[0]} · ${e(c[1])}">${c[2]
        .filter(d => partApplies(d[0]) || d[0] === value)
        .map(d => `<option value="${d[0]}" ${d[0] === value ? 'selected' : ''}>${e(PARTS[d[0]].name)}</option>`)
        .join('')}</optgroup>`,
  ).join('');
  return `<div class="field"><label for="${id}">Bagian naskah <span>${auto ? 'Ditebak Alerin, bisa diganti' : 'Bisa diganti'}</span></label><select id="${id}" ${auto ? 'data-rv-auto="1"' : ''}>${auto ? `<option value="" ${value ? '' : 'selected'}>Ditebak dari catatan dosen</option>` : ''}${opts}</select><div class="field-meta"><span>Mengikuti susunan bab kampusmu.</span><span></span></div></div>`;
}
function revisionModal(taskId, pre = {}) {
  const t = taskId && S.tasks.find(x => x.id === taskId);
  const part = pre.part || (t && PARTS[t.part] ? t.part : '');
  const tahap = revisionStage(taskId);
  modal(
    'Tambahkan Revisi Dosen',
    `${t ? `<p class="small muted mb">Arahan ini langsung tertaut ke <strong>${e(t.title)}</strong>.</p>` : ''}<div class="field"><label for="rv-date">Tanggal bimbingan <span class="required-label">Wajib</span></label><input id="rv-date" type="date" value="${e(pre.date || isoToday())}" max="${isoToday()}" aria-required="true"></div><div class="field"><label for="rv-topic">Topik arahan <span class="required-label">Wajib</span></label><input id="rv-topic" type="text" maxlength="120" value="${e(pre.topic || '')}" placeholder="Contoh: Rumusan masalah" aria-required="true"><div class="field-meta"><span></span><span data-count="rv-topic">${String(pre.topic || '').length}/120</span></div></div><div class="field"><label for="rv-text">Catatan Dosen <span class="required-label">Wajib</span></label><textarea id="rv-text" maxlength="2000" placeholder="Salin catatan atau instruksi dosen sesuai aslinya." rows="3" aria-required="true">${e(pre.text || '')}</textarea><div class="field-meta"><span>Ditulis apa adanya. Alerin tidak mengubah catatan ini.</span><span data-count="rv-text">${String(pre.text || '').length}/2000</span></div></div>${revPartSelect('rv-part', part, !part)}${tahap ? `<p class="small muted rv-auto-stage">${I('info')}<span>Tahap tercatat otomatis: <strong>${e(tahap)}</strong></span></p>` : ''}${uploadZone('revisi6', 'Upload catatan / rekaman audio', 'PDF, DOCX, JPG, PNG, MP3, M4A')}${fileList('revisi6')}<div class="field"><label class="checkbox mt"><input type="checkbox" id="rv-ok" ${pre.ok ? 'checked' : ''}>Saya sudah memahami arahan ini dan menuliskannya sesuai yang disampaikan dosen.</label></div><p class="small muted mt">Rekaman disimpan sebagai lampiran. Transkripsi audio belum tersedia. Setelah disimpan, kamu diminta meninjau pemahaman Alerin.</p>`,
    B('Batal', 'close-modal') + B('Simpan & Tinjau', 'rev-save' + (taskId ? ':' + taskId : ''), 'primary', 'save'),
    true,
  );
}
/* Tahap dicatat otomatis dari pekerjaan tertaut atau posisi skripsi, tanpa meminta pengguna mengetik ulang. */
function revisionStageIdx(taskId) {
  const t = taskId && S.tasks.find(x => x.id === taskId);
  if (t) return +t.phase || 0;
  const st = stageInfo();
  return st.idx !== null && st.idx !== undefined ? st.idx : null;
}
function revisionStage(taskId) {
  const t = taskId && S.tasks.find(x => x.id === taskId);
  if (t) return stageName(+t.phase || 0) + (t.part && PARTS[t.part] ? ' · ' + PARTS[t.part].name : '');
  const i = revisionStageIdx(taskId);
  return i !== null ? stageName(i) : '';
}
function saveRevision(taskId) {
  clearErrors();
  let ok = true;
  const d = $('#rv-date').value;
  if (!d) ok = checkDate('rv-date', { required: true });
  else if (dateProblem(d)) ok = fieldError('rv-date', dateProblem(d));
  else if (d > isoToday()) ok = fieldError('rv-date', 'Tanggal bimbingan belum terjadi. Periksa lagi, ya.');
  if (!checkRequired('rv-topic', { asal: false })) ok = false;
  else if (isAsalShort($('#rv-topic').value))
    ok = fieldError('rv-topic', 'Isiannya belum bisa Alerin pahami. Coba tulis dengan kalimat biasa.');
  const text = $('#rv-text').value.trim();
  if (!checkRequired('rv-text', { min: 10 })) ok = false;
  else if (d && S.revisions.some(x => x.date === d && String(x.text || '').trim().toLowerCase() === text.toLowerCase()))
    ok = fieldError('rv-text', 'Catatan yang sama pada tanggal bimbingan ini sudah tersimpan.');
  if (!$('#rv-ok').checked) {
    const w = $('#rv-ok').closest('.field');
    w.classList.add('invalid');
    w.insertAdjacentHTML('beforeend', '<p class="field-error">Centang dulu bila kamu sudah memahami arahan ini.</p>');
    ok = false;
  }
  if (!ok) return focusFirstError();
  const topic = $('#rv-topic').value,
    u = revUnderstanding(text + ' ' + topic, $('#rv-part')?.value || ''),
    id = 'rv' + Date.now().toString(36);
  const r = {
    id,
    date: d,
    topic: capitalize(topic),
    stageText: revisionStage(taskId),
    stageIdx: revisionStageIdx(taskId),
    text,
    understanding: { maksud: u.maksud, bagian: u.bagian, langkah: u.langkah },
    part: u.part,
    criteria: revCriteriaFrom(u.langkah, u.part),
    status: 'open',
    understood: false,
    review: '',
    created: new Date().toISOString(),
  };
  for (const f of S.files) if (f.context === 'revisi6') f.context = 'rev-' + id;
  if (taskId && S.tasks.some(x => x.id === taskId)) r.taskId = taskId;
  S.revisions.unshift(r);
  record('Arahan dosen dicatat', r.topic);
  closeModal(true);
  let calm = true;
  if (r.taskId) {
    const t = S.tasks.find(x => x.id === r.taskId);
    if (t.status === 'done') {
      t.status = 'todo';
      t.reopenReason = 'Arahan dosen baru';
    }
    calm = reorderTasks(true, 'Ada arahan dosen baru');
  }
  persist();
  render();
  /* Seperti studio GPT: setelah disimpan, pemahaman Alerin langsung ditinjau. Dialog urutan Progres didahulukan bila muncul.
     Tanpa toast di sini, supaya tombol jendela di HP tidak tertutup. */
  if (calm) return revDetailModal(id, true);
  toast(
    r.taskId
      ? 'Arahan tersimpan dan tertaut ke kartu pekerjaan. Tinjau dan setujui pemahaman Alerin.'
      : 'Arahan tersimpan. Tinjau pemahaman Alerin, lalu tautkan ke pekerjaan.',
    '',
    6500,
  );
}

/* ---------- Detail dan pemahaman ---------- */
function revDetailModal(id, fresh = false) {
  const r = revOf(id);
  if (!r) return;
  const ph = revPhase(r),
    t = revTask(r),
    u = r.understanding || {},
    ans = r.reviewAnswers || [];
  const meta = ['Bimbingan ' + dateLong(r.date), r.stageText ? 'Tahap saat itu: ' + r.stageText : ''].filter(Boolean).join(' · ');
  const body = `${fresh ? note('Arahan tersimpan. Pastikan pemahaman Alerin sesuai maksud dosen sebelum mengerjakan perbaikan.') : ''}<div class="rv-meta mt">${badge(REV_PHASE[ph][0], REV_PHASE[ph][1])}</div><h3 class="mt">${e(r.topic)}</h3><p class="small muted">${e(meta)}</p><div class="v6-original"><span class="small muted">Catatan asli dosen · tidak diubah</span><p>“${e(r.text)}”</p></div><div class="rv-understanding"><strong class="small">Pemahaman Alerin · ${revUnderstood(r) ? 'sudah kamu konfirmasi' : 'perlu kamu konfirmasi'}</strong><p>${e(u.maksud || '')}</p><p class="small"><strong>Bagian terdampak:</strong> ${e(u.bagian || partLabel(r.part))}</p><p class="small"><strong>Langkah perbaikan:</strong> ${e(u.langkah || '')}</p></div><div class="mt"><strong class="small">Kriteria selesai</strong><ul class="rv-criteria">${revCriteria(r)
    .map((c, i) => `<li class="${ans[i] ? 'is-' + ans[i] : ''}">${e(c)}${ans[i] ? `<small>${REV_ANS[ans[i]]}</small>` : ''}</li>`)
    .join('')}</ul></div>${r.doneNote ? `<div class="rv-report"><span class="small muted">${r.status === 'done' ? 'Laporan tindak lanjut' + (r.doneAt ? ' · ' + dateLong(r.doneAt) : '') : 'Laporan terakhir · perlu diperbarui'}</span><p>${e(r.doneNote)}</p></div>` : ''}<p class="rv-link small">${I('link')}<span>${t ? `Tertaut ke <strong>${e(t.title)}</strong> · ${revTaskStatus(t)}` : 'Belum ditautkan ke pekerjaan'}</span></p>`;
  const foot =
    ph === 'konfirmasi'
      ? B('Ubah Pemahaman', 'rev-edit:' + id) + B('Setujui Pemahaman', 'rev-ok:' + id, 'primary', 'check')
      : B('Tutup', 'close-modal') + revPrimary(r, ph);
  modal(fresh ? 'Tinjau pemahaman Alerin' : 'Detail arahan', body, foot, true);
}
function revEditModal(id) {
  const r = revOf(id);
  if (!r) return;
  const u = r.understanding || {},
    crit = revCriteria(r);
  modal(
    'Ubah pemahaman Alerin',
    `<p class="small muted mb">Catatan asli dosen tidak ikut berubah.</p>${field('ru-maksud', 'Maksud arahan', u.maksud, '', 400, 'textarea', '', false)}${revPartSelect('ru-part', r.part || '', false)}${field('ru-bagian', 'Bagian terdampak', u.bagian, '', 200, 'textarea', '', false)}${field('ru-langkah', 'Langkah perbaikan', u.langkah, '', 500, 'textarea', '', false)}<fieldset class="rv-crit-edit"><legend>Kriteria selesai <span>Dipakai saat melapor dan di Tinjauan Alerin</span></legend>${[0, 1, 2]
      .map(
        i =>
          `<div class="field"><label for="ru-k${i}">Kriteria ${i + 1}${i ? ' <span>Opsional</span>' : ' <span class="required-label">Wajib</span>'}</label><input id="ru-k${i}" type="text" maxlength="160" value="${e(crit[i] || '')}"></div>`,
      )
      .join('')}</fieldset><label class="checkbox mt"><input type="checkbox" id="ru-ok" checked>Simpan dan setujui pemahaman ini</label>`,
    B('Batal', 'close-modal') + B('Simpan Pemahaman', 'rev-edit-save:' + id, 'primary'),
    true,
  );
}
function saveRevEdit(id) {
  clearErrors();
  const ok = ['ru-maksud', 'ru-bagian', 'ru-langkah', 'ru-k0'].map(x => checkRequired(x)).every(Boolean);
  if (!ok) return focusFirstError();
  const r = revOf(id);
  if (!r) return closeModal(true);
  const approve = $('#ru-ok').checked,
    sel = $('#ru-part').value;
  r.understanding = {
    maksud: capitalize($('#ru-maksud').value),
    bagian: capitalize($('#ru-bagian').value),
    langkah: capitalize($('#ru-langkah').value),
    edited: true,
  };
  if (PARTS[sel]) r.part = sel;
  r.criteria = [0, 1, 2].map(i => $('#ru-k' + i).value.trim()).filter(Boolean).map(capitalize);
  r.understood = approve;
  /* Pemahaman berubah, jadi tinjauan mandiri perlu diulang. */
  r.review = '';
  r.reviewAnswers = [];
  if (!approve && r.status === 'done' && revTask(r)?.status !== 'done') {
    r.status = 'open';
    r.doneAt = null;
  }
  record('Pemahaman arahan diubah', r.topic);
  closeModal(true);
  persist();
  render();
  if (approve && !revTask(r) && r.status !== 'done') return revLinkModal(id, 'Pemahaman diperbarui dan disetujui. Sekarang tautkan arahan ini ke pekerjaan.');
  toast(approve ? 'Pemahaman arahan diperbarui dan disetujui.' : 'Pemahaman diperbarui. Setujui dulu sebelum dikerjakan.');
}

/* ---------- Tautkan ke pekerjaan ---------- */
function revLinkModal(id, why = '') {
  const r = revOf(id);
  if (!r) return;
  const part = r.part || analyzeArahan(r.text).part,
    ch = PARTS[part]?.chapter;
  const sameCh = t => ch && PARTS[t.part]?.chapter === ch;
  const score = t => (t.part === part ? 0 : sameCh(t) ? 1 : 2) + (t.status === 'done' ? 3 : 0);
  const matches = S.tasks
    .filter(
      t =>
        t.status !== 'deferred' &&
        (t.part === part || (t.status !== 'done' && (sameCh(t) || taskRevs(t).some(x => x.part === part)))),
    )
    .sort((a, b) => score(a) - score(b))
    .slice(0, 4);
  const opt = (v, title, desc, on) =>
    `<label class="choice"><input type="radio" name="rl-mode" value="${v}" ${on ? 'checked' : ''}><span><strong>${title}</strong><small>${desc}</small></span></label>`;
  modal(
    'Tautkan ke pekerjaan',
    `<div class="rv-link-form">${why ? `<p class="rv-why small">${I('check')}<span>${e(why)}</span></p>` : ''}<p class="small muted">Arahan: <strong>${e(r.topic)}</strong> · bagian ${e(partLabel(part))}</p>${matches.length ? note('Ada pekerjaan yang mungkin sesuai. Menautkan tidak membuat kartu baru.') : ''}<div class="choices">${matches
      .map((t, i) =>
        opt(
          'link:' + t.id,
          `Tautkan ke “${e(t.title)}”`,
          t.status === 'done' ? 'Sudah selesai · akan dibuka lagi' : `${revTaskStatus(t)} · ${taskRevs(t).length} arahan`,
          i === 0,
        ),
      )
      .join('')}${opt('new', 'Buat pekerjaan baru', 'Kartu baru masuk Progres Aktif. Urutannya ditata ulang otomatis.', !matches.length)}</div><div class="field rv-newtitle"><label for="rl-title">Judul pekerjaan baru <span class="required-label">Wajib</span></label><input id="rl-title" type="text" maxlength="120" value="${e('Tindak lanjuti arahan: ' + r.topic)}"><div class="field-meta"><span></span><span data-count="rl-title">${('Tindak lanjuti arahan: ' + r.topic).length}/120</span></div></div></div>`,
    B('Batal', 'close-modal') + B('Tautkan Arahan', 'rev-link-save:' + id, 'primary', 'link'),
  );
}
function saveRevLink(id) {
  clearErrors();
  const r = revOf(id);
  if (!r) return closeModal(true);
  const v = $('input[name="rl-mode"]:checked')?.value || 'new';
  let t;
  const part = r.part || analyzeArahan(r.text).part;
  if (v.startsWith('link:')) {
    t = S.tasks.find(x => x.id === v.slice(5));
    if (!t) return toast('Pekerjaan itu sudah tidak ada. Pilih yang lain, ya.', 'error');
    if (t.status === 'done') {
      t.status = 'todo';
      t.reopenReason = 'Arahan dosen baru';
      record('Pekerjaan dibuka lagi', t.title + ' · Arahan dosen baru');
    }
  } else {
    if (!checkRequired('rl-title', { min: 5, asal: false })) return focusFirstError();
    t = plainTask({
      title: capitalize($('#rl-title').value),
      part,
      phase: partPhase(part),
      source: 'revisi',
      reason: r.understanding?.maksud || '',
      doing: r.understanding?.langkah || '',
      deliverable: 'Bagian yang sudah kamu perbaiki sesuai arahan dosen.',
    });
  }
  r.taskId = t.id;
  record('Arahan masuk ke Progres Aktif', r.topic + ' → ' + t.title);
  closeModal(true);
  reorderTasks(true, 'Ada arahan dosen baru');
  persist();
  render();
  toast(`Arahan tertaut ke “${t.title}”. Kerjakan di Progres Aktif, lalu laporkan perubahannya di sini.`, '', 6500);
}

/* ---------- Laporan tindak lanjut ---------- */
function revDoneModal(id) {
  const r = revOf(id);
  if (!r) return;
  const t = revTask(r);
  if (!revUnderstood(r)) return revDetailModal(id);
  if (!t && r.status !== 'done') return revLinkModal(id, 'Tautkan arahan ke pekerjaan dulu, lalu laporkan tindak lanjutnya.');
  const nFiles = t ? S.files.filter(f => f.context === 'task-' + t.id).length : 0,
    bukti = t && String(t.evidence || '').trim(),
    val = r.doneNote || '';
  modal(
    'Laporkan tindak lanjut',
    `<p class="small muted mb">${e(r.topic)} · laporan perubahan berbeda dari persetujuan dosen.</p><div class="v6-original"><span class="small muted">Catatan asli dosen</span><p>“${e(r.text)}”</p></div><div class="mt"><strong class="small">Pastikan laporannya menjawab:</strong><ul class="rv-criteria">${revCriteria(r)
      .map(c => `<li>${e(c)}</li>`)
      .join('')}</ul></div><div class="field"><label for="rv-done">Apa yang sudah kamu ubah? <span class="required-label">Wajib</span></label><textarea id="rv-done" rows="5" maxlength="1500" placeholder="Contoh: Penjelasan validitas dan reliabilitas di Bab III kupisah menjadi dua paragraf, lalu kutambahkan rujukan interpretasi alpha.">${e(val)}</textarea><div class="field-meta"><span>Jelaskan bagian, perubahan, dan lokasi buktinya. Minimal 30 karakter.</span><span data-count="rv-done">${val.length}/1500</span></div></div>${t ? `<p class="small muted">${I('file')} Bukti di kartu “${e(t.title)}”: ${nFiles} lampiran${bukti ? ' · catatan bukti tersedia' : ''}.</p>` : ''}`,
    B('Batal', 'close-modal') + B('Simpan Laporan', 'rev-done-save:' + id, 'primary'),
  );
}
function saveRevDone(id) {
  clearErrors();
  if (!checkRequired('rv-done', { min: 30, label: 'perubahan' })) return focusFirstError();
  const r = revOf(id);
  if (!r) return closeModal(true);
  const ulang = !!r.doneNote;
  r.status = 'done';
  r.doneAt = isoToday();
  r.doneNote = capitalize($('#rv-done').value);
  r.review = '';
  r.reviewAnswers = [];
  record(ulang ? 'Arahan dilaporkan ulang' : 'Arahan dilaporkan sudah ditindaklanjuti', r.topic);
  closeModal(true);
  persist();
  render();
  const t = revTask(r);
  toast(t ? `Laporan tersimpan. Arahan ini tidak lagi menahan kartu “${t.title}”.` : 'Laporan tindak lanjut tersimpan.', '', 6000);
}

/* ---------- Tinjauan Alerin (opsional, cek mandiri) ---------- */
function revReviewModal(id) {
  const r = revOf(id);
  if (!r) return;
  if (r.status !== 'done') return revDoneModal(id);
  const ans = r.reviewAnswers || [];
  modal(
    'Tinjauan Alerin',
    `${note('Cek mandiri berdasarkan jawabanmu, bukan pembacaan otomatis isi berkas. Hasilnya bukan persetujuan dosen.')}<p class="small muted mt">${e(r.topic)} · opsional</p>${revCriteria(r)
      .map(
        (c, i) =>
          `<div class="field"><label for="rr-${i}">${i + 1}. ${e(c)}</label><select id="rr-${i}"><option value="">Pilih jawaban</option>${Object.entries(REV_ANS)
            .map(([k, l]) => `<option value="${k}" ${ans[i] === k ? 'selected' : ''}>${l}</option>`)
            .join('')}</select></div>`,
      )
      .join('')}`,
    B('Batal', 'close-modal') + B('Lihat Hasil', 'rev-review-save:' + id, 'primary'),
  );
}
function saveRevReview(id) {
  clearErrors();
  const r = revOf(id);
  if (!r) return closeModal(true);
  const vals = revCriteria(r).map((_, i) => $('#rr-' + i)?.value || '');
  let ok = true;
  vals.forEach((v, i) => {
    if (!v) ok = fieldError('rr-' + i, 'Pilih jawaban untuk poin ini.');
  });
  if (!ok) return focusFirstError();
  r.reviewAnswers = vals;
  r.review = vals.every(v => v === 'yes') ? 'passed' : vals.includes('no') ? 'changes' : 'ask';
  /* Poin yang belum terpenuhi membuat arahan kembali dikerjakan sampai laporannya diperbarui. */
  if (r.review !== 'passed') {
    r.status = 'open';
    r.doneAt = null;
  }
  const hasil = { passed: 'semua poin terpenuhi', changes: 'masih perlu perbaikan', ask: 'perlu klarifikasi ke dosen' }[r.review];
  record('Arahan ditinjau Alerin', `${r.topic} · ${hasil}`);
  closeModal(true);
  persist();
  render();
  toast(
    r.review === 'passed'
      ? 'Tinjauan Alerin: semua poin terpenuhi.'
      : r.review === 'changes'
        ? 'Ada poin yang belum terpenuhi. Arahan kembali dikerjakan dan kartunya terkunci lagi sampai laporannya diperbarui.'
        : 'Ada poin yang perlu dipastikan. Tanyakan ulang ke dosen, lalu perbarui laporannya.',
    '',
    7000,
  );
}

/* ---------- Tanyakan ulang dan unduh ---------- */
function revAskModal(id) {
  const r = revOf(id);
  if (!r) return;
  const q = `Selamat siang, Bapak/Ibu. Terkait arahan “${r.topic}” pada bimbingan ${dateLong(r.date)}, saya ingin memastikan maksudnya. Apakah yang Bapak/Ibu maksud ${String(
    r.understanding?.maksud || '',
  )
    .replace(/^Dosen meminta kamu /, 'saya perlu ')
    .replace(/^Dosen meminta /, '')
    .replace(/^Dosen memberi catatan bahwa (.*?)\. Alerin.*$/, 'bagian ini perlu diperbaiki karena $1')
    .replace(/\.$/, '')}? Terima kasih.`;
  modal(
    'Tanyakan ulang ke dosen',
    `<p class="small muted mb">Sesuaikan dulu pertanyaannya, lalu kirim lewat kanal yang biasa kamu pakai.</p><div class="field"><label for="ask-text">Pertanyaan <span>Bisa diubah</span></label><textarea id="ask-text" rows="6" maxlength="800">${e(q)}</textarea></div>`,
    B('Tutup', 'close-modal') + B('Salin Teks', 'copy-field:ask-text', 'primary'),
  );
}
function revExportText() {
  const rs = [...(S.revisions || [])].sort((a, b) => b.date.localeCompare(a.date));
  const out = ['ALERIN · CATATAN REVISI DOSEN', S.title || 'Judul penelitian belum ditentukan', 'Diunduh ' + dateLong(isoToday()), ''];
  for (const r of rs) {
    const t = revTask(r),
      u = r.understanding || {},
      ans = r.reviewAnswers || [];
    out.push(
      '------------------------------',
      r.topic || 'Arahan dosen',
      `Bimbingan: ${dateLong(r.date)}${r.stageText ? ' · Tahap saat itu: ' + r.stageText : ''}`,
      `Bagian naskah: ${partLabel(r.part) || '-'}`,
      `Status: ${REV_PHASE[revPhase(r)][0]}`,
      '',
      `Catatan asli dosen: ${r.text}`,
      `Pemahaman Alerin: ${u.maksud || '-'}`,
      `Langkah perbaikan: ${u.langkah || '-'}`,
      'Kriteria selesai:',
      ...revCriteria(r).map((c, i) => `  ${i + 1}. ${c}${ans[i] ? ' (' + REV_ANS[ans[i]] + ')' : ''}`),
      `Pekerjaan tertaut: ${t ? t.title + ' · ' + revTaskStatus(t) : 'Belum ditautkan'}`,
      `Laporan tindak lanjut: ${r.doneNote || 'Belum ada'}`,
      `Tinjauan Alerin: ${{ passed: 'Semua poin terpenuhi', changes: 'Masih perlu perbaikan', ask: 'Perlu klarifikasi' }[r.review] || 'Belum dilakukan'}`,
      '',
    );
  }
  if (!rs.length) out.push('Belum ada arahan dosen.');
  return out.join('\n');
}
/* Penyaring cari dan tahap bekerja langsung di halaman, supaya kursor tidak hilang saat mengetik. */
function revApplyFilters() {
  const main = $('#main');
  if (!main) return;
  const q = revQuery.trim().toLowerCase();
  let any = false;
  main.querySelectorAll('.rv-session').forEach(sec => {
    let n = 0;
    sec.querySelectorAll('.rv-card').forEach(c => {
      const show = (!q || c.dataset.rvText.includes(q)) && (revStage === '' || c.dataset.rvStage === revStage);
      c.hidden = !show;
      if (show) n++;
    });
    sec.hidden = !n;
    if (n) any = true;
    const cnt = sec.querySelector('[data-rv-count]');
    if (cnt) cnt.textContent = n + ' arahan';
  });
  const nm = main.querySelector('.rv-nomatch');
  if (nm) nm.hidden = any;
}
document.addEventListener('input', ev => {
  const el = ev.target;
  if (el.id === 'rv-search') {
    revQuery = el.value;
    revApplyFilters();
  }
  if (el.id === 'rv-text' || el.id === 'rv-topic') {
    const sel = $('#rv-part');
    if (sel && sel.dataset.rvAuto === '1') {
      const src = ($('#rv-text')?.value || '') + ' ' + ($('#rv-topic')?.value || '');
      sel.value = revGuessPart(src);
    }
  }
});
document.addEventListener('change', ev => {
  const el = ev.target;
  if (el.id === 'rv-part') el.dataset.rvAuto = el.value ? '0' : '1';
  if (el.id === 'rv-stage-filter') {
    revStage = el.value;
    revApplyFilters();
  }
});

Object.assign(ACTIONS, {
  'add-revision': arg => {
    revisionModal(arg || null);
  },
  'rev-save': arg => {
    saveRevision(arg || null);
  },
  'rev-filter': arg => {
    S.revFilter = REV_TABS.some(x => x[0] === arg) ? arg : 'semua';
    persist();
    render();
  },
  'rev-detail': arg => {
    revDetailModal(arg);
  },
  'rev-ok': arg => {
    const r = revOf(arg);
    if (!r) return;
    r.understood = true;
    record('Pemahaman arahan disetujui', r.topic);
    persist();
    closeModal(true);
    render();
    const t = revTask(r);
    /* Revisi 18 November (Progres Aktif): bila ada kartu yang jelas membahas bagian dan hasil kerja yang sama,
       arahan langsung ditautkan ke kartu itu. Bila kecocokannya meragukan, pengguna memilih. */
    if (!t && r.status !== 'done') {
      const auto = revAutoLink(r);
      if (!auto)
        return revLinkModal(r.id, 'Pemahaman disetujui. Kecocokan dengan kartu yang ada belum pasti, jadi pilih kartu yang membahas bagian yang sama atau buat pekerjaan baru.');
      const calm = reorderTasks(true, 'Ada arahan dosen baru');
      persist();
      render();
      if (calm) toast(`Pemahaman disetujui. Arahan tertaut ke kartu yang sudah ada: “${auto.title}”.`, '', 6500);
      return;
    }
    toast(t ? `Pemahaman disetujui. Arahan tetap tertaut ke “${t.title}”.` : 'Pemahaman disetujui.');
  },
  'rev-link': arg => {
    revLinkModal(arg);
  },
  'rev-link-save': arg => {
    saveRevLink(arg);
  },
  'rev-work': arg => {
    const r = revOf(arg),
      t = revTask(r);
    if (!t) return revLinkModal(arg);
    focusTaskInProgres(t.id);
  },
  'rev-done': arg => {
    revDoneModal(arg);
  },
  'rev-done-save': arg => {
    saveRevDone(arg);
  },
  'rev-review': arg => {
    revReviewModal(arg);
  },
  'rev-review-save': arg => {
    saveRevReview(arg);
  },
  'rev-edit': arg => {
    revEditModal(arg);
  },
  'rev-edit-save': arg => {
    saveRevEdit(arg);
  },
  'rev-ask': arg => {
    revAskModal(arg);
  },
  'rev-export': () => {
    download('Catatan_Revisi_Dosen_Alerin.txt', revExportText());
    toast('Catatan revisi siap diunduh.');
  },
  'rev-del': arg => {
    modal(
      'Hapus arahan ini?',
      '<p>Catatan dosen, pemahaman, dan laporannya dihapus dari Revisi Dosen. Kartu pekerjaan yang tertaut tetap ada.</p>',
      B('Batal', 'close-modal') + B('Hapus arahan', 'rev-del-ok:' + arg, 'danger'),
    );
  },
  'rev-del-ok': arg => {
    const r = revOf(arg);
    S.revisions = S.revisions.filter(x => x.id !== arg);
    record('Arahan dihapus', r?.topic || '');
    persist();
    closeModal(true);
    render();
    toast('Arahan dihapus.');
  },
});
