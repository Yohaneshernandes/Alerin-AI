'use strict';
/* Beranda (Revisi 18 November).
   Tiga informasi dipisah: posisi penelitian yang tersimpan, bahan yang terakhir diperiksa, dan kondisi pengerjaan.
   Kartu Prioritas Saat Ini membaca sumber data yang sama dengan Progres Aktif (activeTasks), dengan satu tombol utama
   "Kerjakan" yang membuka ruang kerja kartu itu di Progres Aktif. Arahan dosen yang belum menjadi Prioritas Utama tampil
   sebagai pemberitahuan terpisah dan tidak menggantikan prioritas. */
let calPreviewMonth = '';
/* Ruang kerja yang dibuka setelah pindah ke Progres Aktif lewat tombol Kerjakan. Tidak ikut disimpan. */
let pendingTaskOpen = null;
/* Panel uji: simulasi data Progres Aktif gagal dimuat. Tidak ikut disimpan. */
let ujiProgresGagal = false;
/* Kalender Alerin Induk belum terhubung di prototipe. Beranda tidak mengklaim pengingat sudah dikirim. */
const KALENDER_INDUK_TERHUBUNG = false;
/* Kondisi pengerjaan. Terpisah dari posisi penelitian: mengubahnya tidak memindahkan tahap. */
const SITUASI = [
  { id: 'lancar', label: 'Berjalan lancar', ket: 'Tidak ada kendala saat ini.' },
  { id: 'bingung', label: 'Bingung langkah selanjutnya', ket: 'Periksa Skripsi membantu menentukan langkah berikutnya.' },
  { id: 'menunggu', label: 'Menunggu dosen atau pihak lain', ket: 'Lihat pekerjaan yang aman dikerjakan sambil menunggu.' },
  { id: 'kesulitan', label: 'Kesulitan materi, metode, atau data', ket: 'Bawa ringkasan penelitianmu ke Dukungan Mentor.' },
  { id: 'tidaksempat', label: 'Tidak sempat', ket: 'Buat satu target kecil yang bisa ditautkan ke pekerjaan aktif.' },
];
const situasiOf = id => SITUASI.find(x => x.id === id);

function berandaPage() {
  const p = homePriority();
  return (
    `<div class="mulai-page-head">
      <h1>Halo, ${e(S.profile.name || 'Naya')}.</h1>
      <p>Satu langkah yang jelas untuk melanjutkan penelitianmu.</p>
    </div>` +
    homeStrip(p) +
    directionNotice(p) +
    `<div class="v7-home-layout qc14-home-layout b18-home-layout">${priorityCard(p)}<aside class="home-schedule">${targetCard()}</aside></div>` +
    homeShortcuts(p)
  );
}

/* ---------- Prioritas Saat Ini ---------- */
/* Jenis isi kartu: task (Prioritas Utama Progres Aktif), confirm (validasi tahap dari personalisasi),
   no-position (belum ada posisi), no-task (posisi ada, belum ada pekerjaan aktif), error (Progres gagal dimuat). */
function homePriority() {
  try {
    if (ujiProgresGagal || !Array.isArray(S.tasks)) throw new Error('Progres Aktif tidak terbaca');
    syncQueue();
    const act = activeTasks(),
      top = primaryTask();
    if (top) return { kind: 'task', t: top, act, queue: S.tasks.filter(t => t.status === 'queued').length };
  } catch {
    return { kind: 'error' };
  }
  const st = stageInfo(),
    k = kondisiOf(S.profile.kondisi);
  if (!st.confirmed) return k && k.stage !== null ? { kind: 'confirm', k } : { kind: 'no-position', k };
  return { kind: 'no-task', st, rec: homeRecommendation(st.idx) };
}
/* Saran akses saat belum ada pekerjaan aktif: tahap awal ke Mulai Skripsi, selebihnya ke Periksa Skripsi. */
function homeRecommendation(i) {
  if (i === null || i < 3)
    return {
      route: 'mulai',
      text: S.title
        ? 'Lanjutkan penyusunan bagian berikutnya lewat Mulai Skripsi. Bagian yang kamu mulai langsung masuk Progres Aktif.'
        : 'Mulai dari Mulai Skripsi: ceritakan idemu, lalu pilih judul. Setelah itu pekerjaan pertamamu masuk Progres Aktif.',
    };
  return {
    route: 'periksa',
    text: 'Periksa bagian yang sudah kamu tulis lewat Periksa Skripsi. Temuan yang kamu pilih bisa dijadikan pekerjaan di Progres Aktif.',
  };
}
/* Potong teks panjang di batas kata supaya cuplikan arahan tetap terbaca. */
function clip(v, n) {
  const t = String(v || '');
  if (t.length <= n) return t;
  const cut = t.slice(0, n - 1),
    sp = cut.lastIndexOf(' ');
  return (sp > n * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,.;:]+$/, '') + '…';
}
const activeTitle = () =>
  S.title ? `<div class="home-title"><span class="small muted">Judul aktif</span><p>${e(S.title)}</p></div>` : '';
function priorityCard(p) {
  const head = (extra = '') =>
    `<div class="b18-priority-top">
      <div class="b18-priority-label-wrap">
        <div class="b18-priority-pulse-dot">
          <span class="b18-pulse-ring"></span>
          <span class="b18-pulse-core"></span>
        </div>
        <span class="b18-eyebrow">PRIORITAS SAAT INI</span>
      </div>
      ${extra}
    </div>`;
  if (p.kind === 'error')
    return `<section class="card next-step-card b18-priority b18-error" role="alert">${head(badge('Gagal dimuat', 'amber'))}<div class="b18-priority-body"><h2 id="home-priority-title">Progres Aktif belum dapat dimuat</h2><div class="b18-priority-banner"><div class="b18-priority-banner-text">Data pekerjaan di perangkat ini belum terbaca, jadi prioritas belum bisa ditampilkan. Posisi penelitian dan target tetap aman.</div></div><div class="actions b18-main-action">${B('Coba Lagi', 'home-retry', 'primary', 'refresh')}</div></div></section>`;
  if (p.kind === 'confirm') {
    const k = p.k,
      pz = S.profile.personalisasi || {};
    const rows = [
      ['Topik Riset', pz.topik],
      ['Judul Sementara', pz.judul],
    ].filter(r => r[1]);
    const stageNum = k.stage !== null && k.stage !== undefined ? k.stage + 1 : 1;
    const num = String(stageNum).padStart(2, '0');
    return `
      <section class="card next-step-card b18-priority b18-confirm" aria-labelledby="home-priority-title">
        <div class="b18-priority-top">
          <div class="b18-priority-label-wrap">
            <div class="b18-priority-pulse-dot">
              <span class="b18-pulse-ring"></span>
              <span class="b18-pulse-core"></span>
            </div>
            <span class="b18-eyebrow">PRIORITAS SAAT INI</span>
          </div>
          <span class="b18-confirm-badge">Perlu konfirmasi</span>
        </div>
        <div class="b18-priority-body">
          <div class="b18-confirm-head">
            <h2 id="home-priority-title">Apa Kamu Sedang di Tahap Ini?</h2>
          </div>
          <div class="b18-stage-box">
            <div class="b18-stage-top">
              <div class="b18-stage-badge">${num}</div>
              <div class="b18-stage-info">
                <strong>Tahap ${e(stageName(k.stage))}</strong>
                <span>Personalisasi dari sistem: ${e(k.ket || k.label)}</span>
              </div>
            </div>
            ${rows.length ? `
              <div class="b18-pz-table">
                ${rows.map(([h, v], idx) => `
                  <div class="b18-pz-row">
                    <div class="b18-pz-label">${e(h)}</div>
                    <div class="b18-pz-val ${idx === 1 ? 'b18-pz-val-title' : ''}">${e(v)}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            ${pz.contoh ? `
              <div class="b18-stage-note">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;">
                  <circle cx="8" cy="8" r="6" stroke="#3B82F6" stroke-width="1.3"></circle>
                  <line x1="8" y1="7" x2="8" y2="11.5" stroke="#3B82F6" stroke-width="1.3" stroke-linecap="round"></line>
                  <circle cx="8" cy="4.7" r="0.75" fill="#3B82F6"></circle>
                </svg>
                <span>Contoh data personalisasi dari profil awal. Judul dapat diubah sewaktu-waktu di pengaturan proposal.</span>
              </div>
            ` : ''}
          </div>
          <p class="b18-footnote">Jawabanmu disimpan sebagai posisi penelitian aktif saat ini. Tahap sebelumnya tidak otomatis ditandai selesai tanpa persetujuanmu.</p>
          <div class="actions b18-main-action b18-confirm-actions">
            <button type="button" class="b18-btn-confirm" data-action="pos-confirm">
              <span>Ya, Konfirmasi Tahap Ini</span>
            </button>
            <button type="button" class="b18-btn-other" data-action="pos-edit">
              <span>Pilih Tahap Lain</span>
            </button>
          </div>
        </div>
      </section>
    `;
  }
  if (p.kind === 'no-position') {
    const stop = p.k?.id === 'terhenti';
    return `
      <section class="card next-step-card b18-priority b18-empty" aria-labelledby="home-priority-title">
        ${head('<span class="b18-status-pill">Belum ada posisi</span>')}
        <div class="b18-priority-body">
          <h2 id="home-priority-title">Belum ada posisi penelitian</h2>
          <div class="b18-priority-banner">
            <div class="b18-priority-banner-text">${stop ? 'Personalisasimu menyebut progres sedang terhenti. Pilih tahap terakhir yang sudah kamu capai, lalu ceritakan kendalanya lewat Perbarui Kondisi.' : 'Pilih tahap terakhir yang sudah kamu capai. Alerin memakai posisi ini di Peta Skripsi dan ringkasan untuk Mentor.'}</div>
          </div>
          <div class="actions b18-main-action">${B('Pilih Tahap Terakhir', 'pos-edit', 'primary', 'map')}</div>
        </div>
      </section>
    `;
  }
  if (p.kind === 'no-task')
    return `
      <section class="card next-step-card b18-priority b18-empty" aria-labelledby="home-priority-title">
        ${head('<span class="b18-status-pill">Belum ada pekerjaan</span>')}
        <div class="b18-priority-body">
          <h2 id="home-priority-title">Belum ada pekerjaan aktif</h2>
          <div class="b18-priority-banner">
            <div class="b18-priority-banner-text">${e(p.rec.text)}</div>
          </div>
          <p class="b18-priority-note">Jawabanmu disimpan sebagai posisi penelitian aktif saat ini. Tahap sebelumnya tidak otomatis ditandai selesai tanpa persetujuanmu.</p>
          ${activeTitle()}
        </div>
      </section>
    `;
  /* Prioritas Utama dari Progres Aktif. */
  const t = p.t,
    st = taskState(t),
    revs = taskPendingRevs(t),
    rv = revs[0],
    crit = Array.isArray(t.criteria) ? t.criteria.join(' ') : t.criteria || '';
  const arahan = rv
    ? `<div class="b18-direction"><span class="small muted">Arahan dosen · Bimbingan ${dateLong(rv.date)}${revs.length > 1 ? ` · ${revs.length - 1} arahan lain` : ''}</span><p>“${e(clip(rv.text, 200))}”</p><span class="small"><strong>Status:</strong> ${e(REV_PHASE[revPhase(rv)][0])}</span></div>`
    : '';
  const meta = [(slotName(t) || 'Prioritas Utama') + ' di Progres Aktif', t.part && PARTS[t.part] ? partLabel(t.part) : '', 'Sumber: ' + taskSource(t)].filter(Boolean);
  return `
    <section class="card next-step-card b18-priority" aria-labelledby="home-priority-title">
      ${head(badge(st[1], st[0] === 'warn' ? 'amber' : 'blue'))}
      <div class="b18-priority-body">
        <h2 id="home-priority-title">${e(t.title)}</h2>
        <div class="b18-priority-banner">
          <div class="b18-priority-banner-text">${e(t.doing || t.reason || '')}</div>
        </div>
        ${crit ? `<p class="small b18-done-when"><strong>Selesai bila:</strong> ${e(crit)}</p>` : ''}
        ${arahan}
        <p class="small muted next-step-meta">${e(meta.join(' · '))}</p>
        <div class="actions b18-main-action">${B('Kerjakan', 'home-work:' + t.id, 'primary', 'arrow')}</div>
        <p class="small muted b18-slots">${p.act.length}/3 slot Progres Aktif terisi${p.queue ? ` · ${p.queue} pekerjaan di antrean` : ''}.</p>
        ${activeTitle()}
      </div>
    </section>
  `;
}

/* ---------- Posisi · terakhir diperiksa · kondisi ---------- */
function homeStrip(p) {
  const st = stageInfo(),
    k = kondisiOf(S.profile.kondisi),
    r = latestReview(),
    sit = situasiOf(S.situation?.id);

  const cell = (eyebrow, strong, meta, btn = '', ph = false) => `
    <div class="b18-cell">
      <div class="b18-cell-content">
        <span class="b18-eyebrow">${eyebrow}</span>
        <strong class="b18-strong ${ph ? 'b18-placeholder' : ''}">${e(strong)}</strong>
        <span class="b18-meta">${e(meta)}</span>
      </div>
      <div class="b18-cell-action">
        ${btn}
      </div>
    </div>
  `;

  const pos = cell(
    'POSISI PENELITIANMU',
    st.confirmed ? positionLabel(st.idx) : 'Pilih Tahap Terakhir',
    st.confirmed ? positionSource() : 'Belum dikonfirmasi',
    `<button type="button" class="btn text b18-btn-kondisi" data-action="pos-edit"><span>Perbarui Posisi</span></button>`,
    !st.confirmed,
  );

  let checked;
  if (r) {
    const open = openFindings().length,
      n = r.findings.length;
    checked = cell(
      'TERAKHIR DIPERIKSA',
      r.scope,
      `${localTime(r.date)} WIB · ${n ? n + ' temuan' : 'belum ada temuan'}${open ? ` · ${open} belum jadi pekerjaan` : ''}`,
      `<button type="button" class="btn text b18-btn-kondisi" data-action="nav:hasil-periksa"><span>Lihat Hasil</span></button>`,
    );
  } else {
    checked = cell(
      'TERAKHIR DIPERIKSA',
      'Belum ada bahan diperiksa',
      'Hasil Periksa Skripsi otomatis tampil di sini.',
      `<button type="button" class="btn text b18-btn-kondisi" data-action="nav:periksa"><span>Mulai Unggah Berkas</span></button>`,
      true,
    );
  }

  const kond = sit
    ? cell('KONDISI BIMBINGAN', sit.label, 'diperbarui ' + dateLong(String(S.situation.date || '').slice(0, 10)), `<button type="button" class="btn text b18-btn-kondisi" data-action="situasi-pick"><span>Perbarui Kondisi</span></button>`)
    : k?.id === 'terhenti'
      ? cell('KONDISI BIMBINGAN', 'Progres terhenti', 'menurut personalisasi · pilih kendalanya', `<button type="button" class="btn text b18-btn-kondisi" data-action="situasi-pick"><span>Perbarui Kondisi</span></button>`)
      : cell('KONDISI BIMBINGAN', 'Belum diperbarui', 'Ceritakan kendala dengan dosen pembimbing atau materi.', `<button type="button" class="btn text b18-btn-kondisi" data-action="situasi-pick"><span>Perbarui Kondisi</span></button>`, true);

  return `<section class="b18-strip" aria-label="Ringkasan penelitian">${pos}${checked}${kond}</section>`;
}

/* ---------- Pemberitahuan arahan dosen ---------- */
function directionNotice(p) {
  const topId = p.kind === 'task' ? p.t.id : null,
    list = pendingRevisions().filter(r => !topId || r.taskId !== topId);
  if (!list.length || p.kind === 'error') return '';
  const r = list[0],
    t = revTask(r),
    where = !t
      ? 'belum ditautkan ke pekerjaan'
      : activeTasks().some(x => x.id === t.id)
        ? `tertaut ke “${t.title}”`
        : `tertaut ke “${t.title}” di antrean`;
  const head = list.length > 1 ? `${list.length} arahan dosen belum ditindaklanjuti` : 'Ada arahan dosen yang menunggu';
  return `<section class="b18-notice" aria-label="Pemberitahuan arahan dosen">${I('bell')}<div><strong>${head}</strong><p class="small">${e(r.topic || 'Arahan dosen')} · Bimbingan ${dateLong(r.date)} · ${e(REV_PHASE[revPhase(r)][0])}, ${e(where)}. ${topId ? 'Belum menjadi Prioritas Utama.' : ''}</p></div>${B('Lihat Arahan', 'nav:revisi', 'text', 'arrow')}</section>`;
}

/* ---------- Akses lain ---------- */
function homeShortcuts(p) {
  return `
    <div class="home-shortcuts b18-home-shortcuts" aria-label="Akses lain">
      <button type="button" class="home-shortcut b18-shortcut-btn" data-action="nav:mulai">
        <div class="b18-shortcut-left">
          <div class="b18-shortcut-icon-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#125AB5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
          </div>
          <div class="b18-shortcut-text">
            <strong>Mulai Skripsi</strong>
            <p>Panduan bertahap menyusun kerangka latar belakang &amp; rumusan masalah</p>
          </div>
        </div>
        <div class="b18-shortcut-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </button>

      <button type="button" class="home-shortcut b18-shortcut-btn" data-action="nav:periksa">
        <div class="b18-shortcut-left">
          <div class="b18-shortcut-icon-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#125AB5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div class="b18-shortcut-text">
            <strong>Periksa Skripsi</strong>
            <p>Analisis keterbacaan, plagiasi internal, sitasi &amp; logika argumen</p>
          </div>
        </div>
        <div class="b18-shortcut-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </button>
    </div>
  `;
}

/* ---------- Target terdekat (Beranda dan Peta Skripsi) ---------- */
function targetCard() {
  const list = typeof targetsUpcoming === 'function' ? targetsUpcoming(5) : [];
  const primaryUrg = list.length ? urgency(list[0].date) : { cls: '', label: '' };
  let body = '';

  if (!list.length) {
    body = `
      <div class="b18-target-empty-wrap">
        <div class="b18-target-icon-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div class="b18-target-empty-title">Belum Ada Target Terdekat</div>
        <p class="b18-target-empty-desc">Tentukan tenggat bab atau jadwal bimbingan<br>untuk mendapatkan pengingat rutin.</p>
      </div>
    `;
  } else {
    body = `
      <div class="b18-targets-list-wrap">
        ${list
          .map((tg, idx) => {
            const urg = urgency(tg.date);
            const d = new Date(tg.date + 'T12:00:00');
            const ag = tg.source === 'agenda' ? (S.agendas || []).find(x => x.id === tg.id) : null;
            const phase = ag && ag.phase !== undefined && ag.phase !== null && ag.phase !== '' ? +ag.phase : null;
            const linked = tg.source === 'target' && S.target?.taskId ? S.tasks.find(x => x.id === S.target.taskId) : null;
            const editAct = tg.source === 'agenda' ? (route === 'beranda' ? 'home-agenda:' : 'cal-edit:') + tg.id : 'target';

            return `
              <div class="calendar-date b18-target-row-item ${idx > 0 ? 'mt-divider' : ''}">
                <div class="date-square">
                  <span>${d.toLocaleDateString('id-ID', { month: 'short', timeZone: 'Asia/Jakarta' }).toUpperCase()}</span>
                  <strong>${d.getDate()}</strong>
                </div>
                <div class="b18-target-info-col">
                  <div class="b18-target-title-row">
                    <strong class="b18-target-item-title">${e(tg.text)}</strong>
                    <button type="button" class="btn-icon-subtle b18-target-edit-btn" data-action="${editAct}" title="Ubah ${e(tg.text)}" aria-label="Ubah ${e(tg.text)}">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                  </div>
                  <p class="small">
                    ${tg.source === 'agenda' ? 'Agenda · ' : ''}${dateLong(tg.date)}${tg.time ? ' · ' + e(tg.time) + ' WIB' : ''}${urg.label ? ` · <span class="target-days">${urg.label}</span>` : ''}
                  </p>
                  ${phase !== null ? `<p class="small muted">Tahap ${e(stageName(phase))}</p>` : ''}
                  ${linked ? `<p class="small b18-target-link">${I('link')}<span>Terkait: ${e(linked.title)}${linked.status === 'done' ? ' · sudah selesai' : ''}</span></p>` : ''}
                </div>
              </div>
            `;
          })
          .join('')}
      </div>
    `;
  }

  const status =
    route === 'beranda' && !KALENDER_INDUK_TERHUBUNG
      ? `<div class="b18-cal-status">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>Kalender Alerin Induk belum terhubung. Pengingat otomatis via email belum aktif.</span>
        </div>`
      : '';

  return `
    <section class="card target-card b18-target-card ${primaryUrg.cls}">
      <div class="b18-target-head">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#125AB5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <h3>Target Terdekat${list.length > 1 ? ` (${list.length})` : ''}</h3>
      </div>
      ${body}
      ${status}
      <div class="actions b18-target-actions">
        <button type="button" class="btn b18-btn-add-target" data-action="target-suggest">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Tambah Target</span>
        </button>
        <button type="button" class="btn b18-btn-cal" data-action="${route === 'beranda' ? 'cal-preview' : 'calendar'}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#125AB5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Kalender Alerin</span>
        </button>
      </div>
    </section>
  `;
}
/* Pratinjau Kalender Alerin Induk (QC 14 November). Satu-satunya akses kalender di Beranda. */
function calPreviewModal() {
  calPreviewMonth = calPreviewMonth || isoToday().slice(0, 7);
  const today = isoToday(),
    [y, m] = calPreviewMonth.split('-').map(Number),
    start = new Date(y, m - 1, 1),
    days = new Date(y, m, 0).getDate(),
    pad = (start.getDay() + 6) % 7;
  const events = (S.agendas || [])
    .filter(a => a.date?.startsWith(calPreviewMonth))
    .map(a => ({
      title: a.title,
      date: a.date,
      time: a.time,
      status: a.log ? 'Catatan' : a.done ? 'Selesai' : a.date < today ? 'Sudah lewat' : 'Terjadwal',
    }));
  if (S.target?.date?.startsWith(calPreviewMonth) && S.target.text)
    events.push({ title: S.target.text, date: S.target.date, status: 'Target terdekat' });
  events.sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));
  const label = start.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  modal(
    'Kalender Alerin',
    `<p class="small muted">Pratinjau kalender Alerin Induk ${KALENDER_INDUK_TERHUBUNG ? badge('Terhubung', 'green') : badge('Belum terhubung', 'amber')}</p><div class="between qc14-calendar-heading"><h3>${e(label)}</h3><div class="actions">${B('', 'cal-preview-month:-1', '', 'chevronLeft', 'aria-label="Bulan sebelumnya"')}${B('Bulan Ini', 'cal-preview-month:0', 'text')}${B('', 'cal-preview-month:1', '', 'chevronRight', 'aria-label="Bulan berikutnya"')}</div></div><div class="qc14-calendar-grid">${['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(d => `<strong class="qc14-day-label">${d}</strong>`).join('')}${Array.from({ length: pad }, () => '<span></span>').join('')}${Array.from(
      { length: days },
      (_, i) => {
        const date = calPreviewMonth + '-' + String(i + 1).padStart(2, '0'),
          count = events.filter(a => a.date === date).length;
        return `<div class="qc14-calendar-day ${date === today ? 'today' : ''}" aria-label="${e(dateLong(date))} · ${count} agenda"><strong>${i + 1}</strong>${count ? `<span class="qc14-agenda-dot" title="${count} agenda"></span>` : ''}</div>`;
      },
    ).join(
      '',
    )}</div><div class="qc14-calendar-agenda"><h3>Agenda bulan ini</h3>${events.length ? events.map(a => `<article><strong>${e(a.title)}</strong><p>${e(dateLong(a.date))}${a.time ? ' · ' + e(a.time) + ' WIB' : ''} · ${a.status}</p></article>`).join('') : '<p class="muted mt">Belum ada agenda pada bulan ini.</p>'}</div><p class="small muted mt">Pratinjau memakai agenda di perangkat ini. Sinkronisasi ke Kalender Alerin Induk belum terhubung, jadi belum ada pengingat yang dikirim dari kalender induk.</p>`,
    B('Tutup', 'close-modal') +
      `<a class="btn primary" href="https://alerin.id/" target="_blank" rel="noopener noreferrer">Menuju Kalender Alerin ${I('external')}</a>`,
    true,
  );
}

/* ---------- Formulir posisi dan kondisi ---------- */
function positionModal() {
  const p = positionOf(),
    cur = p ? String(p.stage) : '';
  const opts = [['-1', 'Sebelum 01 · Persiapan']].concat(ALERIN.phases.map((_, i) => [String(i), stageName(i)]));
  modal(
    'Perbarui posisi penelitian',
    `<p class="small muted">Pilih tahap yang sedang kamu jalani sekarang.</p><div class="field"><label for="pos-stage">Tahap terakhir <span class="required-label">Wajib</span></label><select id="pos-stage"><option value="" disabled ${cur === '' ? 'selected' : ''}>Pilih tahap terakhir</option>${opts.map(([v, n]) => `<option value="${v}" ${v === cur ? 'selected' : ''}>${e(n)}</option>`).join('')}</select></div>${note('Mengubah posisi tidak menandai tahap sebelumnya selesai. Status tiap tahap di Peta Skripsi tetap mengikuti pekerjaan dan bukti. Hasil Periksa Skripsi juga tidak mengubah posisimu.')}`,
    B('Batal', 'close-modal') + B('Simpan Posisi', 'pos-save', 'primary', 'save'),
  );
}
function savePosition(stage, from) {
  S.position = { stage, date: new Date().toISOString(), from };
  record(from === 'personalisasi' ? 'Posisi penelitian dikonfirmasi' : 'Posisi penelitian diperbarui', positionLabel(stage) + (from === 'personalisasi' ? ' · dari personalisasi' : ''));
  synchronizeResearch();
  persist();
  closeModal(true);
  render();
  toast('Posisi tersimpan: ' + positionLabel(stage) + '.');
}
function situasiModal() {
  const cur = S.situation?.id || '',
    st = stageInfo();
  modal(
    'Perbarui kondisi',
    `<p class="small muted">Kondisi pengerjaan dicatat terpisah dari posisi penelitian. ${st.confirmed ? 'Posisimu tetap ' + e(positionLabel(st.idx)) + '.' : 'Posisimu belum dikonfirmasi.'}</p><div class="stuck-grid b18-situasi">${SITUASI.map(
      s =>
        `<button type="button" class="stuck-option ${cur === s.id ? 'featured' : ''}" data-action="situasi-set:${s.id}" ${cur === s.id ? 'aria-current="true"' : ''}><strong>${s.label}</strong><span>${s.ket}</span>${I('arrow')}</button>`,
    ).join('')}</div>`,
    B('Batal', 'close-modal'),
    true,
  );
}
/* Rekomendasi pekerjaan paralel saat menunggu dosen. Pekerjaan baru dibuat setelah pengguna menyetujui. */
function parallelSuggestion() {
  const i = stageInfo().idx ?? S.phase ?? 0;
  return i <= 2
    ? {
        title: 'Rapikan daftar pustaka Bab I–II',
        doing: 'Masukkan sumber yang sudah kamu baca ke Daftar Pustaka dan cek kelengkapannya.',
        why: 'Daftar pustaka bisa dirapikan tanpa menunggu tanggapan dosen, dan nanti dipakai di semua bab.',
        part: 'prior',
      }
    : i <= 6
      ? {
          title: 'Siapkan instrumen pengumpulan data',
          doing: 'Cocokkan pertanyaan instrumen dengan setiap rumusan masalah.',
          why: 'Instrumen bisa disiapkan sambil menunggu, karena isinya mengikuti rumusan masalah yang sudah ada.',
          part: 'collection',
        }
      : {
          title: 'Susun keterbatasan penelitian',
          doing: 'Catat keterbatasan yang benar-benar kamu alami selama penelitian.',
          why: 'Keterbatasan penelitian ditulis dari pengalamanmu sendiri, jadi tidak bergantung pada tanggapan dosen.',
          part: 'limitations',
        };
}
function parallelModal() {
  const ps = parallelSuggestion(),
    existing = S.tasks.find(x => x.part === ps.part && x.status !== 'done'),
    n = activeTasks().length;
  const box = `<div class="b18-rec-box"><span class="eyebrow">REKOMENDASI ALERIN</span><h3>${e(existing ? existing.title : ps.title)}</h3><p class="small">${e(existing ? existing.doing || ps.doing : ps.doing)}</p></div><h4 class="mt">Alasannya</h4><p class="small">${e(ps.why)}</p>`;
  if (existing)
    return modal(
      'Kerjakan sambil menunggu',
      box + `<div class="mt">${note(`Pekerjaan ini sudah ada di Progres Aktif (${e(taskState(existing)[1])}). Alerin tidak membuat pekerjaan baru.`)}</div>`,
      B('Tutup', 'close-modal') + B('Lihat di Progres Aktif', 'home-focus:' + existing.id, 'primary', 'arrow'),
    );
  const where =
    n >= 3
      ? note('Tiga slot Progres Aktif sudah terisi. Kalau kamu setuju, pekerjaan ini masuk Antrean dan naik otomatis saat ada slot kosong. Prioritas Utama tidak berubah.', 'amber')
      : n === 0
        ? note('Progres Aktif masih kosong. Kalau kamu setuju, pekerjaan ini menjadi Prioritas Utama.')
        : note('Kalau kamu setuju, pekerjaan ini mengisi slot kosong di Progres Aktif sebagai Pekerjaan Paralel. Prioritas Utama tidak berubah.');
  modal(
    'Kerjakan sambil menunggu',
    box + `<div class="mt">${where}</div><p class="small muted mt">Belum ada pekerjaan yang dibuat sebelum kamu menekan Tambahkan ke Antrean.</p>`,
    B('Nanti saja', 'close-modal') + B('Tambahkan ke Antrean', 'home-parallel-add', 'primary', 'plus'),
  );
}
function smallTarget() {
  const d = new Date(isoToday() + 'T12:00:00');
  const add = (7 - d.getDay()) % 7 || 7;
  d.setDate(d.getDate() + add);
  const t = activeTasks()[0];
  return {
    date: d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }),
    text: t ? `Selesaikan satu langkah dari “${t.title}”` : 'Selesaikan satu bagian kecil skripsimu minggu ini',
    taskId: t?.id || '',
    link: true,
    title: 'Target kecil minggu ini',
  };
}
function mentorFromHome() {
  const st = stageInfo(),
    t = activeTasks()[0],
    where = st.confirmed ? positionLabel(st.idx) : 'skripsiku';
  if (!String(S.mentorNote || '').trim())
    S.mentorNote = `Saya kesulitan di materi, metode, atau data pada ${where}.${t ? ' Pekerjaan yang sedang saya kerjakan: ' + t.title + '.' : ''} Mohon arahan mentor.`;
  record('Kendala dibawa ke Dukungan Mentor', where);
  persist();
  go('mentor');
  toast(st.confirmed ? `Ringkasan untuk mentor memakai posisi terbaru: ${positionLabel(st.idx)}.` : 'Ringkasan untuk mentor siap. Posisi penelitianmu belum dikonfirmasi.', '', 6000);
}

/* ---------- Personalisasi (dipakai Profil) ---------- */
function conditionChooser() {
  const now = S.profile.kondisi || '';
  return `<section class="card condition-card"><div class="section-head"><div><span class="eyebrow">PERSONALISASI</span><h2>Sekarang, skripsimu sampai di mana?</h2><p>Pilih satu kondisi. Pilihan ini disimpan sebagai data personalisasi.</p></div></div><div class="condition-grid">${KONDISI.map((k, i) => `<button data-action="kondisi-set:${k.id}" class="condition-choice ${now === k.id ? 'selected' : ''}" ${now === k.id ? 'aria-current="true"' : ''}><span>${String(i + 1).padStart(2, '0')}</span><strong>${k.label}</strong></button>`).join('')}</div><p class="small muted mt">Posisi penelitian tetap dikonfirmasi terpisah di Beranda.</p></section>`;
}

Object.assign(ACTIONS, {
  'kondisi-pick': () => {
    modal('Kondisi Skripsimu', conditionChooser(), B('Kembali', 'close-modal'), true);
  },
  'kondisi-set': id => {
    const k = kondisiOf(id);
    if (!k) return;
    S.profile.kondisi = id;
    if (S.profile.personalisasi) S.profile.personalisasi.contoh = false;
    record('Kondisi skripsi diperbarui', k.label + ' · personalisasi');
    synchronizeResearch();
    persist();
    closeModal(true);
    if (route !== 'beranda') go('beranda');
    else render();
    toast('Kondisi tersimpan: ' + k.label + '.');
  },
  /* Dari Arah penelitian awal setelah judul dipilih: pengguna menyetujui pindah ke tahap kondisi itu. */
  'kondisi-up': arg => {
    const k = kondisiOf(arg);
    if (!k) return;
    S.profile.kondisi = arg;
    if (k.stage !== null) S.position = { stage: k.stage, date: new Date().toISOString(), from: 'pengguna' };
    record('Posisi penelitian diperbarui', positionLabel(k.stage) + ' · setelah judul dipilih');
    synchronizeResearch();
    persist();
    closeModal(true);
    render();
    toast('Posisi diperbarui: ' + positionLabel(k.stage) + '.');
  },
  'home-work': id => {
    const t = S.tasks.find(x => x.id === id);
    if (!t || ['done', 'deferred'].includes(t.status)) {
      render();
      return toast('Pekerjaan ini sudah tidak aktif. Prioritas di Beranda diperbarui.', 'error');
    }
    pendingTaskOpen = id;
    focusTaskInProgres(id);
  },
  'home-focus': id => {
    focusTaskInProgres(id);
  },
  'home-retry': () => {
    const was = ujiProgresGagal;
    ujiProgresGagal = false;
    render();
    if (Array.isArray(S.tasks)) toast(was ? 'Progres Aktif berhasil dimuat ulang.' : 'Progres Aktif dimuat ulang.');
    else toast('Progres Aktif masih belum dapat dimuat. Unduh salinan data di Pengaturan, lalu hubungi Admin.', 'error', 6500);
  },
  'pos-edit': () => {
    positionModal();
  },
  'pos-save': () => {
    clearErrors();
    const v = $('#pos-stage')?.value ?? '';
    if (v === '') return fieldError('pos-stage', 'Pilih tahap terakhirmu dulu.') || focusFirstError();
    savePosition(+v, 'pengguna');
  },
  'pos-confirm': () => {
    const k = kondisiOf(S.profile.kondisi);
    if (!k || k.stage === null) return positionModal();
    savePosition(k.stage, 'personalisasi');
  },
  'situasi-pick': () => {
    situasiModal();
  },
  'situasi-set': id => {
    const s = situasiOf(id);
    if (!s) return;
    S.situation = { id, date: new Date().toISOString() };
    record('Kondisi pengerjaan diperbarui', s.label);
    persist();
    closeModal(true);
    render();
    if (id === 'lancar') return toast('Kondisi tersimpan: ' + s.label + '.');
    if (id === 'bingung')
      return modal(
        'Tentukan langkah lewat pemeriksaan',
        `<p>Saat bingung menentukan langkah berikutnya, mulai dari pemeriksaan.</p><p class="mt">Periksa Skripsi membaca bahan yang sudah ada (judul saja sudah cukup), lalu menunjukkan bagian yang perlu diperbaiki. Temuan itu bisa kamu jadikan pekerjaan di Progres Aktif, sehingga langkah berikutnya jelas.</p><p class="small muted mt">Hasil pemeriksaan tidak mengubah posisi penelitianmu.</p>`,
        B('Nanti saja', 'close-modal') + B('Buka Periksa Skripsi', 'nav:periksa', 'primary', 'document'),
      );
    if (id === 'menunggu') return parallelModal();
    if (id === 'kesulitan') return mentorFromHome();
    if (id === 'tidaksempat') return targetModal(smallTarget());
  },
  'home-parallel-add': () => {
    const ps = parallelSuggestion();
    if (S.tasks.some(x => x.part === ps.part && x.status !== 'done')) return parallelModal();
    const full = activeTasks().length >= 3;
    const t = partTask(ps.part, { title: ps.title, doing: ps.doing, reason: ps.why, kind: 'parallel', source: 'beranda' });
    if (!t) return toast('Pekerjaan belum bisa ditambahkan. Coba lagi, ya.', 'error');
    /* Ditaruh di akhir urutan tanpa menyusun ulang, supaya Prioritas Utama tidak berubah diam-diam. */
    syncQueue();
    persist();
    closeModal(true);
    render();
    toast(full ? `“${t.title}” masuk Antrean Progres Aktif.` : `“${t.title}” masuk Progres Aktif.`, '', 6000);
  },
  'home-agenda': id => {
    const a = (S.agendas || []).find(x => x.id === id);
    if (!a) return render();
    agendaFrom = 'beranda';
    agendaModal(a.date, a);
  },
  'target-suggest': () => {
    const st = stageInfo(),
      k = st.confirmed ? KONDISI.filter(x => x.stage !== null && x.stage <= st.idx).at(-1) : kondisiOf(S.profile.kondisi);
    targetModal({ text: k?.target || '', date: addDaysIso(14) });
  },
  'cal-preview': () => {
    calPreviewMonth = isoToday().slice(0, 7);
    calPreviewModal();
  },
  'cal-preview-month': arg => {
    const [y, m] = (calPreviewMonth || isoToday().slice(0, 7)).split('-').map(Number),
      d = new Date(y, m - 1 + Number(arg), 1);
    calPreviewMonth =
      Number(arg) === 0 ? isoToday().slice(0, 7) : d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    calPreviewModal();
  },
});
