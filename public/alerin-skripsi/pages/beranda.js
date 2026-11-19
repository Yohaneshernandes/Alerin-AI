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
    pageHead('Halo, ' + e(S.profile.name || 'Kawan') + '.', 'Satu langkah yang jelas untuk melanjutkan penelitianmu.') +
    homeStrip(p) +
    titleChangedNote() +
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
    `<div class="between b18-priority-top"><span class="eyebrow">PRIORITAS SAAT INI</span>${extra}</div>`;
  if (p.kind === 'error')
    return `<section class="card next-step-card b18-priority b18-error" role="alert">${head(badge('Gagal dimuat', 'amber'))}<h2>Progres Aktif belum dapat dimuat</h2><p class="next-step-copy">Data pekerjaan di perangkat ini belum terbaca, jadi prioritas belum bisa ditampilkan. Posisi penelitian dan target tetap aman.</p><div class="actions b18-main-action">${B('Coba Lagi', 'home-retry', 'primary', 'refresh')}</div></section>`;
  if (p.kind === 'confirm') {
    const k = p.k,
      pz = S.profile.personalisasi || {};
    const rows = [
      ['Topik', pz.topik],
      ['Judul', pz.judul],
    ].filter(r => r[1]);
    return `<section class="card next-step-card b18-priority b18-confirm" aria-labelledby="home-priority-title">${head(badge('Perlu konfirmasi', 'blue'))}<h2 id="home-priority-title">Apa Kamu Sampai Tahap Ini?</h2><div class="b18-stage-box"><strong>${e(positionLabel(k.stage))}</strong><span class="small muted">Dari personalisasi alerin.id: ${e(k.label)} · ${e(k.ket)}</span>${rows.length ? `<dl class="b18-pz">${rows.map(([h, v]) => `<dt>${h}</dt><dd>${e(v)}</dd>`).join('')}</dl>` : ''}${pz.contoh ? '<p class="small muted">Contoh data personalisasi. Judul ini belum menjadi judul aktif.</p>' : ''}</div><p class="small muted mt">Jawabanmu disimpan sebagai posisi penelitian. Tahap sebelumnya tidak otomatis ditandai selesai.</p><div class="actions b18-main-action">${B('Ya, Sampai Tahap Ini', 'pos-confirm', 'primary', 'check')}${B('Pilih Tahap Lain', 'pos-edit', 'text')}</div></section>`;
  }
  if (p.kind === 'no-position') {
    const stop = p.k?.id === 'terhenti';
    return `<section class="card next-step-card b18-priority b18-empty" aria-labelledby="home-priority-title">${head()}<h2 id="home-priority-title">Belum ada posisi penelitian</h2><p class="next-step-copy">${stop ? 'Personalisasimu menyebut progres sedang terhenti. Pilih tahap terakhir yang sudah kamu capai, lalu ceritakan kendalanya lewat Perbarui Kondisi.' : 'Pilih tahap terakhir yang sudah kamu capai. Alerin memakai posisi ini di Peta Skripsi dan ringkasan untuk Mentor.'}</p><div class="actions b18-main-action">${B('Pilih Tahap Terakhir', 'pos-edit', 'primary', 'map')}</div></section>`;
  }
  if (p.kind === 'no-task')
    return `<section class="card next-step-card b18-priority b18-empty" aria-labelledby="home-priority-title">${head(badge('Belum ada pekerjaan', ''))}<h2 id="home-priority-title">Belum ada pekerjaan aktif</h2><p class="next-step-copy">${e(p.rec.text)}</p><p class="small muted mt">Prioritas muncul di sini setelah ada pekerjaan di Progres Aktif: dari subbagian yang kamu susun, temuan pemeriksaan, atau arahan dosen yang ditautkan.</p>${activeTitle()}</section>`;
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
  return `<section class="card next-step-card b18-priority" aria-labelledby="home-priority-title">${head(badge(st[1], st[0] === 'warn' ? 'amber' : 'blue'))}<h2 id="home-priority-title">${e(t.title)}</h2><p class="next-step-copy">${e(t.doing || t.reason || '')}</p>${crit ? `<p class="small b18-done-when"><strong>Selesai bila:</strong> ${e(crit)}</p>` : ''}${arahan}<p class="small muted next-step-meta">${e(meta.join(' · '))}</p><div class="actions b18-main-action">${B('Kerjakan', 'home-work:' + t.id, 'primary', 'arrow')}</div><p class="small muted b18-slots">${p.act.length}/3 slot Progres Aktif terisi${p.queue ? ` · ${p.queue} pekerjaan di antrean` : ''}.</p>${activeTitle()}</section>`;
}

/* ---------- Posisi · terakhir diperiksa · kondisi ---------- */
function homeStrip(p) {
  const st = stageInfo(),
    k = kondisiOf(S.profile.kondisi),
    r = latestReview(),
    sit = situasiOf(S.situation?.id);
  /* Saat posisi belum dikonfirmasi, tombolnya ada di kartu Prioritas, supaya tidak ada tombol ganda. */
  const posBtn = st.confirmed || !['confirm', 'no-position'].includes(p.kind) ? B('Perbarui Posisi', 'pos-edit', 'text', 'edit') : '';
  const cell = (eyebrow, strong, meta, btn = '', ph = false) =>
    `<div class="b18-cell"><span class="eyebrow">${eyebrow}</span><strong${ph ? ' class="b18-placeholder"' : ''}>${e(strong)}</strong><span class="position-source">${e(meta)}</span>${btn}</div>`;
  const pos = cell('POSISI PENELITIANMU', positionLabel(st.idx), positionSource(), posBtn, !st.confirmed);
  let checked;
  if (r) {
    const open = openFindings().length,
      n = r.findings.length;
    checked = cell(
      'TERAKHIR DIPERIKSA',
      r.scope,
      `${localTime(r.date)} WIB · ${n ? n + ' temuan' : 'belum ada temuan'}${open ? ` · ${open} belum jadi pekerjaan` : ''}`,
      B('Lihat Hasil', 'nav:hasil-periksa', 'text', 'arrow'),
    );
  } else checked = cell('TERAKHIR DIPERIKSA', 'Belum ada bahan yang diperiksa', 'Hasil Periksa Skripsi tampil di sini', '', true);
  const kond = sit
    ? cell('KONDISI', sit.label, 'diperbarui ' + dateLong(String(S.situation.date || '').slice(0, 10)), B('Perbarui Kondisi', 'situasi-pick', 'text', 'edit'))
    : k?.id === 'terhenti'
      ? cell('KONDISI', 'Progres terhenti', 'menurut personalisasi · pilih kendalanya', B('Perbarui Kondisi', 'situasi-pick', 'text', 'edit'))
      : cell('KONDISI', 'Belum diperbarui', 'Ceritakan bila ada kendala', B('Perbarui Kondisi', 'situasi-pick', 'text', 'edit'), true);
  return `<section class="position-strip b18-strip" aria-label="Ringkasan penelitian">${pos}${checked}${kond}</section>`;
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
  const quiet = p.kind !== 'no-task',
    rec = p.kind === 'no-task' ? p.rec.route : '';
  const item = (r, ico, title, sub) =>
    `<button class="home-shortcut ${rec === r ? 'b18-rec' : ''}" data-action="nav:${r}">${I(ico)}<span><strong>${title}${rec === r ? badge('Disarankan', 'blue') : ''}</strong><small>${sub}</small></span>${I('arrow')}</button>`;
  return `<div class="home-shortcuts qc14-shortcuts ${quiet ? 'b18-quiet' : ''}" aria-label="Akses lain">${item('mulai', 'compass', 'Mulai Skripsi', 'Susun ide dan bagian penelitian.')}${item('periksa', 'document', 'Periksa Skripsi', 'Tinjau naskah dan kesiapanmu.')}</div>`;
}

/* ---------- Target terdekat (Beranda dan Peta Skripsi) ---------- */
function targetCard() {
  const tg = targetNow(),
    urg = urgency(tg?.date);
  let body = '<p class="muted mt">Belum ada target terdekat.</p>';
  if (tg) {
    const d = new Date(tg.date + 'T12:00:00'),
      ag = tg.source === 'agenda' ? (S.agendas || []).find(x => x.id === tg.id) : null,
      phase = ag && ag.phase !== undefined && ag.phase !== null && ag.phase !== '' ? +ag.phase : null,
      linked = tg.source === 'target' && S.target?.taskId ? S.tasks.find(x => x.id === S.target.taskId) : null;
    body = `<div class="calendar-date"><div class="date-square"><span>${d.toLocaleDateString('id-ID', { month: 'short', timeZone: 'Asia/Jakarta' }).toUpperCase()}</span><strong>${d.getDate()}</strong></div><div><strong>${e(tg.text)}</strong><p class="small">${tg.source === 'agenda' ? 'Agenda · ' : ''}${dateLong(tg.date)}${tg.time ? ' · ' + e(tg.time) + ' WIB' : ''}${urg.label ? ` · <span class="target-days">${urg.label}</span>` : ''}</p></div></div>${phase !== null ? `<p class="small muted">Tahap ${e(stageName(phase))}</p>` : ''}${linked ? `<p class="small b18-target-link">${I('link')}<span>Terkait: ${e(linked.title)}${linked.status === 'done' ? ' · sudah selesai' : ''}</span></p>` : ''}`;
  }
  /* Label tombol sama dengan isi formulirnya: agenda → Ubah Agenda, target akademik → Ubah Target. */
  const [label, act] = !tg
    ? ['Tambah Target', 'target-suggest']
    : tg.source === 'agenda'
      ? ['Ubah Agenda', (route === 'beranda' ? 'home-agenda:' : 'cal-edit:') + tg.id]
      : ['Ubah Target', 'target'];
  const status =
    route === 'beranda' && !KALENDER_INDUK_TERHUBUNG
      ? `<p class="small muted b18-cal-status">${I('info')}<span>Kalender Alerin Induk belum terhubung. Pengingat belum dikirim otomatis.</span></p>`
      : '';
  return `<section class="card target-card ${urg.cls}"><div class="section-head"><h3>Target terdekat</h3>${I('target')}</div>${body}${status}<div class="actions mt">${B(label, act, 'text', 'edit')}${B('Kalender Alerin', route === 'beranda' ? 'cal-preview' : 'calendar', 'soft', 'calendar')}</div></section>`;
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
