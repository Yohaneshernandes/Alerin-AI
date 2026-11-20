'use strict';
/* Halaman Revisi Dosen.
   Alur mengikuti studio Revisi Dosen (18 November): pahami arahan → tautkan ke pekerjaan dan kerjakan di Progres Aktif
   → laporkan tindak lanjut (Tinjauan Alerin opsional) → catat selesai di Progres Aktif.
   Arahan dihitung sudah ditindaklanjuti (status 'done') begitu laporannya tersimpan, jadi kunci "Catat Sebagai Selesai"
   di Progres Aktif tetap memakai aturan yang sama. Konfirmasi dosen tidak dicatat di sini: arahan berikutnya ditambahkan
   lewat Tambah Arahan. */
let revQuery = '',
  revStage = '',
  revSort = 'terbaru';
const REV_TABS = [
  ['semua', 'Semua'],
  ['belum', 'Belum dikerjakan'],
  ['proses', 'Dalam pengerjaan'],
  ['selesai', 'Selesai dikerjakan'],
];
function partChapterLabel(part) {
  for (const c of CHAPTERS) {
    for (const p of c[2]) {
      if (p[0] === part) {
        return `Bab ${c[0]} · ${p[1]}`;
      }
    }
  }
  return partLabel(part) || 'Bab I · Rumusan Masalah';
}
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
const REV_FLOW_EMPTY = [
  ['Pahami arahan', 'Setujui pemahaman Alerin, atau ubah dulu bila kurang tepat.'],
  ['Tautkan dan kerjakan', 'Arahan masuk ke kartu di Progres Aktif. Perbaikannya dikerjakan di sana.'],
  ['Laporkan tindak lanjut', 'Tulis perubahan yang sudah kamu lakukan. Tinjauan Alerin boleh dipakai untuk cek mandiri.'],
  ['Catat selesai', 'Kartu di Progres Aktif bisa dicatat selesai setelah arahannya dilaporkan.'],
];
const REV_FLOW = [
  ['Catat arahan', 'Tulis catatan dosen apa adanya setiap selesai bimbingan.'],
  ['Setujui pemahaman', 'Pastikan pemahaman Alerin sesuai maksud dosen, atau ubah dulu.'],
  ['Jadikan Progres Aktif', 'Arahan menjadi kartu pekerjaan. Paling banyak 2 arahan dikerjakan bersamaan.'],
  ['Selesaikan di Progres Aktif', 'Tulis perubahanmu, periksa, lalu catat selesai. Kartu di sini mencatat hasilnya.'],
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

  if (!all.length) {
    return `
      <div class="revisi-v2-container">
        <div class="revisi-v2-head">
          <div class="revisi-v2-head-text">
            <h1 class="revisi-v2-title">Arahan dosen dari setiap bimbingan</h1>
            <p class="revisi-v2-desc">Catatan asli dosen tetap utuh. Konfirmasikan pemahaman sebelum menghubungkannya ke Progres Aktif.</p>
          </div>
        </div>

        <div class="rv-main-grid-v2">
          <div class="rv-cards-column-v2">
            <div class="rv-empty-state-card-v2">
              <div class="rv-empty-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#52647D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <h3 class="rv-empty-title">Belum ada arahan dosen</h3>
              <p class="rv-empty-desc">Catat arahan setiap selesai bimbingan. Alerin membantu memahami<br/>maksudnya dan menautkannya ke pekerjaan di Progres Aktif.</p>
              <button type="button" class="rv-empty-btn-tambah" data-action="add-revision">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Tambah Arahan</span>
              </button>
            </div>
          </div>
          <aside class="rv-sidebar-column-v2">
            <div class="rv-sidebar-card-v2">
              <h3 class="rv-sidebar-title-v2">Alur revisi</h3>
              <div class="rv-sidebar-list-v2">
                ${REV_FLOW_EMPTY.map(
                  ([title, desc], i) => `
                  <div class="rv-sidebar-item-v2">
                    <div class="rv-sidebar-circle-v2">${i + 1}</div>
                    <div class="rv-sidebar-item-body-v2">
                      <h4 class="rv-sidebar-item-title-v2">${e(title)}</h4>
                      <p class="rv-sidebar-item-desc-v2">${e(desc)}</p>
                    </div>
                  </div>
                `,
                ).join('')}
              </div>
            </div>
          </aside>
        </div>
      </div>
    `;
  }

  let tab = S.revFilter || 'semua';
  if (!REV_TABS.some(x => x[0] === tab)) tab = 'semua';

  const totalCount = all.length;
  const belumCount = all.filter(r => !r.taskId && r.status !== 'done').length;
  const prosesCount = all.filter(r => r.taskId && r.status !== 'done').length;
  const selesaiCount = all.filter(r => r.status === 'done').length;

  const st = stageInfo();
  const pos = st.idx !== null && st.idx !== undefined ? (st.idx < 0 ? 'Sebelum 01 · Persiapan' : stageName(st.idx)) : 'Sebelum 01 · Persiapan';

  return `
    <div class="revisi-v2-container">
      <div class="revisi-v2-head">
        <div class="revisi-v2-head-text">
          <h1 class="revisi-v2-title">Arahan dosen dari setiap bimbingan</h1>
          <p class="revisi-v2-desc">Catat arahan, setujui pemahamannya, lalu kerjakan sampai selesai di Progres Aktif. Catatan asli dosen tetap utuh.</p>
        </div>
        <button type="button" class="revisi-v2-btn-tambah" data-action="add-revision">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Tambah Arahan</span>
        </button>
      </div>

      <div class="rv-context-card-v2">
        <div class="rv-context-left">
          <div class="rv-context-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div class="rv-context-info">
            <span class="rv-context-eyebrow">JUDUL PENELITIAN AKTIF</span>
            <h3 class="rv-context-title">${e(S.title || 'Judul penelitian belum ditentukan')}</h3>
            <p class="rv-context-meta">Posisi penelitian: ${e(pos)} · menurut informasimu</p>
          </div>
        </div>
        <button type="button" class="rv-context-btn" data-action="guide-view:konteks">${S.title ? 'Lihat Konteks' : 'Isi Konteks Skripsi'}</button>
      </div>

      <div class="rv-stats-row-v2">
        <div class="rv-stat-card-v2">
          <h2 class="rv-stat-num-v2">${totalCount}</h2>
          <span class="rv-stat-lbl-v2">Total arahan</span>
        </div>
        <div class="rv-stat-card-v2">
          <h2 class="rv-stat-num-v2">${belumCount}</h2>
          <span class="rv-stat-lbl-v2">Belum dikerjakan</span>
        </div>
        <div class="rv-stat-card-v2">
          <h2 class="rv-stat-num-v2">${prosesCount}/${totalCount || 1}</h2>
          <span class="rv-stat-lbl-v2">Dalam pengerjaan</span>
        </div>
        <div class="rv-stat-card-v2">
          <h2 class="rv-stat-num-v2">${selesaiCount}</h2>
          <span class="rv-stat-lbl-v2">Selesai dikerjakan</span>
        </div>
      </div>

      <div class="rv-controls-wrap-v2">
        <div class="rv-tabs-row-v2" role="tablist">
          ${REV_TABS.map(
            ([k, lbl]) => `
            <button type="button" class="rv-tab-btn-v2 ${tab === k ? 'active' : ''}" data-action="rev-filter:${k}">
              ${e(lbl)}
            </button>
          `,
          ).join('')}
        </div>
        <div class="rv-search-row-v2">
          <div class="rv-search-wrap-v2">
            <svg class="rv-search-icon-v2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input id="rv-search" type="search" placeholder="Cari arahan atau bagian penelitian" value="${e(revQuery)}" class="rv-search-input-v2">
          </div>
          <div class="rv-stage-select-wrap-v2">
            <select id="rv-stage-filter" class="rv-stage-select-v2">
              <option value="" ${revStage === '' ? 'selected' : ''}>Semua tahap</option>
              <option value="-1" ${revStage === '-1' ? 'selected' : ''}>Sebelum 01 · Persiapan</option>
              ${ALERIN.phases.map((p, i) => `<option value="${i}" ${revStage === String(i) ? 'selected' : ''}>Tahap ${stageName(i)}</option>`).join('')}
            </select>
            <svg class="rv-stage-chevron-v2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <div class="rv-main-grid-v2">
        <div class="rv-cards-column-v2">
          ${revList(all, tab)}
        </div>
        <aside class="rv-sidebar-column-v2">
          <div class="rv-sidebar-card-v2">
            <h3 class="rv-sidebar-title-v2">Alur revisi</h3>
            <div class="rv-sidebar-list-v2">
              ${REV_FLOW.map(
                ([title, desc], i) => `
                <div class="rv-sidebar-item-v2">
                  <div class="rv-sidebar-circle-v2">${i + 1}</div>
                  <div class="rv-sidebar-item-body-v2">
                    <h4 class="rv-sidebar-item-title-v2">${e(title)}</h4>
                    <p class="rv-sidebar-item-desc-v2">${e(desc)}</p>
                  </div>
                </div>
              `,
              ).join('')}
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;
}
function revContext() {
  const st = stageInfo();
  const pos = st.idx !== null && st.idx !== undefined ? stageName(st.idx) + (st.source ? ' · ' + st.source : '') : 'belum tercatat';
  return `<section class="card rv-context" aria-label="Judul penelitian aktif"><span class="rv-context-ico">${I('document')}</span><div class="rv-context-copy"><span class="eyebrow">JUDUL PENELITIAN AKTIF</span><strong>${e(S.title || 'Judul penelitian belum ditentukan')}</strong><small>Posisi penelitian: ${e(pos)}</small></div>${B(S.title ? 'Lihat Konteks' : 'Isi Konteks Skripsi', 'guide-view:konteks', 'text', 'arrow')}</section>`;
}
function revList(all, tab) {
  let rs = all.filter(r => {
    if (tab === 'belum') return !r.taskId && r.status !== 'done';
    if (tab === 'proses') return !!r.taskId && r.status !== 'done';
    if (tab === 'selesai') return r.status === 'done';
    return true;
  });

  const q = revQuery.trim().toLowerCase();
  if (q) {
    rs = rs.filter(r => revSearchText(r).includes(q));
  }
  if (revStage !== '') {
    rs = rs.filter(r => String(revStageIdx(r)) === revStage);
  }

  if (revSort === 'terbaru') {
    rs.sort((a, b) => (b.date || '').localeCompare(a.date || '') || String(b.created || '').localeCompare(String(a.created || '')));
  } else {
    rs.sort((a, b) => (a.date || '').localeCompare(b.date || '') || String(a.created || '').localeCompare(String(b.created || '')));
  }

  if (!rs.length) {
    return `<div class="card empty rv-empty-card" style="text-align:center;padding:48px 24px;border-radius:16px;outline:1px #DCE4EF solid;background:#fff;"><p class="muted" style="margin:0;font-size:13px;color:#64748B;">Tidak ada arahan pada filter ini.</p></div>`;
  }

  return rs.map(revCard).join('');
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
  const u = r.understanding || {};
  const files = (S.files || []).filter(f => f.context === 'rev-' + r.id);
  const partStr = partChapterLabel(r.part);
  const isApproved = revUnderstood(r);
  const isDone = r.status === 'done';
  const t = revTask(r);

  const stagePartText = `${r.stageText || 'Sebelum Tahap 01'} · ${partStr}`;

  let badgeStatusText = 'Siap dikerjakan';
  if (isDone) {
    badgeStatusText = 'Selesai dikerjakan';
  } else if (!isApproved) {
    badgeStatusText = 'Konfirmasi pemahaman';
  } else if (t) {
    badgeStatusText = 'Dalam pengerjaan';
  } else {
    badgeStatusText = 'Siap dikerjakan';
  }

  return `
    <article class="rv-session-card-v2" id="rev-${r.id}" data-rv-text="${e(revSearchText(r))}" data-rv-stage="${e(String(revStageIdx(r)))}">
      <!-- Session Header -->
      <div class="rv-session-header-v2">
        <h3 class="rv-session-date-v2">Bimbingan ${dateLong(r.date)}</h3>
        <details class="v6-options rv-session-menu">
          <summary class="rv-session-dots-btn" aria-label="Pilihan arahan ${e(r.topic || 'Jurnal')}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#125AB5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="5" cy="12" r="1.5"></circle>
              <circle cx="12" cy="12" r="1.5"></circle>
              <circle cx="19" cy="12" r="1.5"></circle>
            </svg>
          </summary>
          <div class="rv-session-dropdown">
            <button type="button" class="btn text" data-action="rev-detail:${r.id}">Lihat Detail</button>
            <button type="button" class="btn text" data-action="rev-edit:${r.id}">Ubah Pemahaman</button>
            <button type="button" class="btn text danger-text" data-action="rev-del:${r.id}">Hapus Arahan</button>
          </div>
        </details>
      </div>

      <!-- Top meta badges -->
      <div class="rv-card-top-row">
        <div class="rv-badge-status-v2">${e(badgeStatusText)}</div>
        <div class="rv-stage-part-text">${e(stagePartText)}</div>
      </div>

      <!-- Topic Title -->
      <h4 class="rv-topic-title-v2">${e(r.topic || 'Jurnal')}</h4>

      <!-- Catatan Asli Dosen Box -->
      <div class="rv-box-original-v2">
        <span class="rv-box-eyebrow-v2">CATATAN ASLI DOSEN · TIDAK DIUBAH</span>
        <p class="rv-box-quote-v2">“${e(r.text)}”</p>
        ${files.length ? `
          <div class="rv-original-files" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;">
            ${files.map(f => B(`${e(f.name)} · ${fileSize(f.size)}`, 'open-file:' + f.id, 'text', 'file')).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Pemahaman Alerin Box -->
      <div class="rv-box-understanding-v2">
        <span class="rv-box-blue-eyebrow-v2">PEMAHAMAN ALERIN · ${isApproved ? (u.edited ? 'DIUBAH OLEHMU' : 'DIUBAH OLEHMU') : 'PERLU KAMU KONFIRMASI'}</span>
        <p class="rv-box-maksud-v2">${e(u.maksud || '')}</p>
        <div class="rv-box-langkah-wrap-v2">
          <strong class="rv-box-langkah-label">Langkah perbaikan:</strong>
          <span class="rv-box-langkah-val">${e(u.langkah || '')}</span>
        </div>
      </div>

      <!-- Footer Area -->
      <div class="rv-card-footer-v2">
        <div class="rv-card-footer-top-row">
          <div class="rv-card-link-status">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <span>${t ? `Tertaut ke <strong>${e(t.title)}</strong>` : 'Belum dibawa ke Progres Aktif'}</span>
          </div>
          <div class="rv-card-step-pills">
            <!-- Step 1: Pemahaman -->
            <div class="rv-step-pill ${isApproved ? 'is-done' : ''}">
              ${isApproved ? `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#125AB5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ` : ''}
              <span>Pemahaman</span>
            </div>
            <!-- Step 2: Progres Aktif -->
            <div class="rv-step-pill ${t ? 'is-done' : ''}">
              ${t ? `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#125AB5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ` : ''}
              <span>Progres Aktif</span>
            </div>
            <!-- Step 3: Selesai dikerjakan -->
            <div class="rv-step-pill ${isDone ? 'is-done' : ''}">
              ${isDone ? `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#125AB5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ` : ''}
              <span>Selesai dikerjakan</span>
            </div>
          </div>
        </div>

        <!-- Action row -->
        <div class="rv-card-footer-action-row">
          ${!isApproved ? `
            <button type="button" class="rv-btn-card-activate" data-action="rev-detail:${r.id}">Konfirmasi Pemahaman</button>
          ` : !t ? `
            <button type="button" class="rv-btn-card-activate" data-action="rev-card-activate:${r.id}">Jadikan Progres Aktif</button>
            <p class="rv-card-hint-text">Setelah dijadikan Progres Aktif, laporan perubahan sampai Catat Sebagai Selesai dikerjakan di kartunya.</p>
          ` : `
            <button type="button" class="rv-btn-card-activate" data-action="rev-work:${r.id}">
              <span>Buka di Progres</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          `}
        </div>
      </div>
    </article>
  `;
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

  const body = `
    ${t ? `<p class="small muted mb">Arahan ini langsung tertaut ke <strong>${e(t.title)}</strong>.</p>` : ''}
    <div class="field rv-modal-field">
      <label for="rv-date" class="rv-modal-label">Tanggal bimbingan</label>
      <div class="rv-modal-date-wrap">
        <input id="rv-date" type="date" value="${e(pre.date || isoToday())}" max="${isoToday()}" class="rv-modal-input" aria-required="true">
        <svg class="rv-modal-date-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </div>
    </div>
    <div class="field rv-modal-field">
      <label for="rv-text" class="rv-modal-label">Catatan Dosen<span class="req">*</span></label>
      <textarea id="rv-text" maxlength="2000" placeholder="Salin catatan atau instruksi dosen sesuai aslinya." class="rv-modal-textarea" rows="3" aria-required="true">${e(pre.text || '')}</textarea>
    </div>
    <label class="rv-modal-upload-zone" for="upload-revisi6">
      <svg class="rv-modal-upload-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 16l-4-4-4 4M12 12v9"></path>
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
        <polyline points="16 16 12 12 8 16"></polyline>
      </svg>
      <strong class="rv-modal-upload-title">Upload catatan / rekaman audio</strong>
      <span class="rv-modal-upload-formats">PDF, DOCX, JPG, PNG, MP3, M4A. Maksimal 30 MB per berkas</span>
      <span class="rv-modal-upload-hint">Klik untuk memilih atau letakkan berkas di sini.</span>
      <input class="native-input" id="upload-revisi6" type="file" data-file-context="revisi6" accept=".pdf,.docx,.jpg,.jpeg,.png,.mp3,.m4a" multiple>
    </label>
    ${fileList('revisi6')}
    <div class="rv-modal-checkbox-row">
      <label class="rv-modal-checkbox-label">
        <input type="checkbox" id="rv-ok" ${pre.ok ? 'checked' : ''} class="rv-modal-checkbox">
        <span>Saya sudah memahami arahan ini dan menuliskannya sesuai yang disampaikan dosen.</span>
      </label>
    </div>
  `;

  const footer = `
    <button type="button" class="rv-modal-btn-cancel" data-action="close-modal">Batal</button>
    <button type="button" class="rv-modal-btn-submit" data-action="rev-save${taskId ? ':' + taskId : ''}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
      </svg>
      <span>Simpan Arahan</span>
    </button>
  `;

  modal('Tambahkan Revisi Dosen', body, footer, 'rv-new-modal');
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
  if (i !== null && i !== undefined) {
    return i < 0 ? 'Sebelum 01 · Persiapan' : stageName(i);
  }
  return 'Sebelum 01 · Persiapan';
}
function saveRevision(taskId) {
  clearErrors();
  let ok = true;
  const d = $('#rv-date')?.value;
  if (!d) ok = checkDate('rv-date', { required: true });
  else if (dateProblem(d)) ok = fieldError('rv-date', dateProblem(d));
  else if (d > isoToday()) ok = fieldError('rv-date', 'Tanggal bimbingan belum terjadi. Periksa lagi, ya.');

  const text = $('#rv-text')?.value?.trim() || '';
  if (!checkRequired('rv-text', { min: 10 })) ok = false;
  else if (d && S.revisions.some(x => x.date === d && String(x.text || '').trim().toLowerCase() === text.toLowerCase()))
    ok = fieldError('rv-text', 'Catatan yang sama pada tanggal bimbingan ini sudah tersimpan.');

  if (!$('#rv-ok')?.checked) {
    const w = $('#rv-ok')?.closest('.rv-modal-checkbox-row') || $('#rv-ok')?.parentElement;
    if (w) {
      w.classList.add('invalid');
      if (!w.querySelector('.field-error')) {
        w.insertAdjacentHTML('beforeend', '<p class="field-error" style="color:#C53645;font-size:11px;margin-top:4px;">Centang dulu bila kamu sudah memahami arahan ini.</p>');
      }
    }
    ok = false;
  }
  if (!ok) return focusFirstError();

  const cleanText = text.replace(/^[“"']+|[”"']+$/g, '').trim();
  let topic = $('#rv-topic')?.value?.trim() || '';
  if (!topic) {
    if (/jurnal|artikel|referensi|pustaka|tam|consumer behavior/i.test(cleanText)) {
      topic = 'Jurnal';
    } else if (/rumusan|masalah/i.test(cleanText)) {
      topic = 'Rumusan masalah';
    } else if (/latar|belakang/i.test(cleanText)) {
      topic = 'Latar belakang';
    } else if (/metode|pendekatan|desain/i.test(cleanText)) {
      topic = 'Metode penelitian';
    } else if (/wawancara|observasi|instrumen/i.test(cleanText)) {
      topic = 'Instrumen penelitian';
    } else {
      const firstSentence = cleanText.split(/(?<=[.!?])\s+/)[0].replace(/[.!?]+$/, '').trim();
      topic = (firstSentence.length > 50 ? firstSentence.slice(0, 47) + '…' : firstSentence) || 'Rumusan masalah';
      if (/^revisi semuanya$/i.test(topic)) {
        topic = 'Rumusan masalah';
      }
    }
  }

  const u = revUnderstanding(cleanText + (cleanText.toLowerCase().includes(topic.toLowerCase()) ? '' : ' ' + topic), $('#rv-part')?.value || '');
  const id = 'rv' + Date.now().toString(36);
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
  if (r.taskId) {
    const t = S.tasks.find(x => x.id === r.taskId);
    if (t.status === 'done') {
      t.status = 'todo';
      t.reopenReason = 'Arahan dosen baru';
    }
    reorderTasks(true, 'Ada arahan dosen baru');
  }
  persist();
  render();
  revDetailModal(r.id, true);
}

/* ---------- Detail dan pemahaman ---------- */
function revDetailModal(id, fresh = false) {
  const r = revOf(id);
  if (!r) return;
  const ph = revPhase(r),
    t = revTask(r),
    u = r.understanding || {},
    files = (S.files || []).filter(f => f.context === 'rev-' + r.id);
  const meta = ['Bimbingan ' + dateLong(r.date), r.stageText ? 'Tahap saat itu: ' + r.stageText : ''].filter(Boolean).join(' · ');

  const alertBox = fresh
    ? `
    <div class="rv-review-alert">
      <div class="rv-review-alert-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div class="rv-review-alert-text">
        Arahan tersimpan. Pastikan pemahaman Alerin sesuai maksud dosen sebelum mengerjakan perbaikan.
      </div>
    </div>
  `
    : '';

  const isApproved = revUnderstood(r);
  const badgeLabel = isApproved ? 'Sudah disetujui' : 'Konfirmasi pemahaman';

  const body = `
    ${alertBox}
    <div class="rv-review-meta-block">
      <div class="rv-review-badge">${e(badgeLabel)}</div>
      <div class="rv-review-heading-wrap">
        <h3 class="rv-review-topic">${e(r.topic || 'Jurnal')}</h3>
        <p class="rv-review-meta-line">${e(meta)}</p>
      </div>
    </div>

    <div class="rv-review-original-box">
      <span class="rv-review-box-eyebrow">CATATAN ASLI DOSEN · TIDAK DIUBAH</span>
      <div class="rv-review-original-text">“${e(r.text)}”</div>
      ${files.length ? `
        <div class="rv-original-files" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;">
          ${files.map(f => B(`${e(f.name)} · ${fileSize(f.size)}`, 'open-file:' + f.id, 'text', 'file')).join('')}
        </div>
      ` : ''}
    </div>

    <div class="rv-review-understanding-box">
      <div class="rv-review-understanding-head">
        <div class="rv-review-blue-dot"></div>
        <span class="rv-review-understanding-eyebrow">PEMAHAMAN ALERIN · ${isApproved ? 'SUDAH KAMU KONFIRMASI' : 'PERLU KAMU KONFIRMASI'}</span>
      </div>
      <div class="rv-review-understanding-text">
        ${e(u.maksud || '')}
      </div>
      <div class="rv-review-understanding-details">
        <div class="rv-review-detail-row">
          <span class="rv-review-detail-label">Bagian terdampak:</span>
          <span class="rv-review-part-badge">${e(partChapterLabel(r.part))}</span>
        </div>
        <div class="rv-review-detail-row">
          <span class="rv-review-detail-label">Langkah perbaikan:</span>
          <span class="rv-review-detail-val">${e(u.langkah || '')}</span>
        </div>
      </div>
    </div>

    <div class="rv-review-criteria-section">
      <h4 class="rv-review-criteria-title">Kriteria selesai · menjadi “Selesai bila” di Progres Aktif</h4>
      <ul class="rv-review-criteria-list">
        ${revCriteria(r).map(c => `
          <li>
            <span class="rv-review-criteria-dot"></span>
            <span>${e(c)}</span>
          </li>
        `).join('')}
      </ul>
      <div class="rv-review-criteria-status">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        <span>${t ? `Tertaut ke <strong>${e(t.title)}</strong>` : 'Belum dibawa ke Progres Aktif'}</span>
      </div>
    </div>

    ${r.doneNote ? `
      <div class="rv-report" style="margin-top:12px;padding:12px 16px;background:#F8FAFC;border-radius:10px;outline:1px #E2E8F0 solid;">
        <span class="small muted">${r.status === 'done' ? 'Laporan tindak lanjut' + (r.doneAt ? ' · ' + dateLong(r.doneAt) : '') : 'Laporan terakhir · perlu diperbarui'}</span>
        <p style="margin:4px 0 0;font-size:14px;color:#334155;">${e(r.doneNote)}</p>
      </div>
    ` : ''}
  `;

  const foot = `
    <button type="button" class="rv-review-btn-edit" data-action="rev-edit:${id}">Ubah Pemahaman</button>
    <button type="button" class="rv-review-btn-approve" data-action="rev-ok:${id}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>Setujui Pemahaman</span>
    </button>
  `;

  modal('Tinjau pemahaman Alerin', body, foot, 'rv-review-modal');
}
function revActiveConfirmModal(id) {
  const r = revOf(id);
  if (!r) return;

  const body = `
    <div class="rv-progres-confirm-body">
      <div class="rv-progres-line">Pemahaman diperbarui dan disetujui.</div>
      <div class="rv-progres-line">
        <strong class="rv-progres-topic">${e(r.topic || 'Jurnal')}</strong>
        <span> siap dikerjakan.</span>
      </div>
      <div class="rv-progres-line rv-progres-desc">
        Arahan menjadi kartu pekerjaan di Progres Aktif. Laporan perubahan sampai<br/>Catat Sebagai Selesai dikerjakan di kartu itu.
      </div>
    </div>
  `;

  const foot = `
    <button type="button" class="rv-progres-btn-later" data-action="rev-progres-later:${r.id}">Nanti Saja</button>
    <button type="button" class="rv-progres-btn-confirm" data-action="rev-progres-activate:${r.id}">Jadikan Progres Aktif</button>
  `;

  modal('Jadikan Progres Aktif?', body, foot, 'rv-progres-confirm-modal');
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
  'rev-sort-toggle': () => {
    revSort = revSort === 'terbaru' ? 'terlama' : 'terbaru';
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
    render();
    revActiveConfirmModal(r.id);
  },
  'rev-progres-later': arg => {
    const r = revOf(arg);
    closeModal(true);
    render();
    toast(r ? `Pemahaman disetujui. Arahan “${r.topic}” siap ditautkan ke Progres Aktif kapan saja.` : 'Pemahaman disetujui.');
  },
  'rev-progres-activate': arg => {
    const r = revOf(arg);
    if (r) {
      r.understood = true;
    }
    persist();
    closeModal(true);
    render();
    if (r) toast(`Arahan “${r.topic || 'Jurnal'}” siap dikerjakan.`, 'check');
  },
  'rev-card-activate': arg => {
    const r = revOf(arg);
    if (!r) return;
    let t = revTask(r);
    if (!t) {
      const auto = revAutoLink(r);
      if (auto) {
        t = auto;
      } else {
        const part = r.part || analyzeArahan(r.text).part;
        const title = 'Tindak lanjuti arahan: ' + (r.topic || 'Jurnal');
        t = plainTask({
          title: capitalize(title),
          part,
          phase: partPhase(part),
          source: 'revisi',
          reason: r.understanding?.maksud || '',
          doing: r.understanding?.langkah || '',
          deliverable: 'Bagian yang sudah kamu perbaiki sesuai arahan dosen.',
        });
        r.taskId = t.id;
        record('Arahan masuk ke Progres Aktif', r.topic + ' → ' + t.title);
      }
    } else if (t.status === 'done') {
      t.status = 'todo';
      t.reopenReason = 'Arahan dosen baru';
    }
    reorderTasks(true, 'Ada arahan dosen baru');
    persist();
    render();
    toast(`Arahan “${r.topic || 'Jurnal'}” berhasil dijadikan kartu pekerjaan di Progres Aktif.`, 'check');
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
