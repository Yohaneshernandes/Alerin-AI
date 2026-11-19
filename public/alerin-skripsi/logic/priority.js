'use strict';
/* Penyusun pekerjaan, prasyarat, urutan prioritas, dan syarat penyelesaian Progres Aktif.
   Revisi 18 November (Progres Aktif):
   - Prasyarat dibaca dari t.depends. Kartu yang menunggu tetap bisa dilihat, tetapi Periksa Pekerjaan dan
     Catat Sebagai Selesai terkunci sampai prasyaratnya selesai.
   - Maksimal tiga kartu aktif. Slot kosong hanya diisi dari antrean oleh pekerjaan yang siap dikerjakan.
   - Arahan dosen menjadi Prioritas Utama hanya bila menahan langkah berikutnya atau punya tenggat mendesak. */
/* Urutan baru yang menunggu konfirmasi pengguna. Tidak ikut disimpan. */
let pendingOrder = null;

/* ---------- Prasyarat ---------- */
const taskDeps = t => [t?.depends].flat().filter(Boolean).map(id => S.tasks.find(x => x.id === id)).filter(Boolean);
const taskWaitingOn = t => taskDeps(t).filter(d => d.status !== 'done');
const taskReady = t => !taskWaitingOn(t).length;
const taskDependents = t => S.tasks.filter(x => x.status !== 'done' && taskDeps(x).includes(t));
function waitLabel(t) {
  const w = taskWaitingOn(t);
  if (!w.length) return '';
  return `Menunggu “${w[0].title}”${w[0].status === 'deferred' ? ' (ditunda)' : ''}${w.length > 1 ? ` dan ${w.length - 1} pekerjaan lain` : ''}`;
}

/* ---------- Tiga slot dan antrean ---------- */
const openTasks = () => (S.tasks || []).filter(t => !['done', 'deferred'].includes(t.status));
/* Dipanggil setiap tampilan digambar. Kartu aktif tetap aktif (maksimal tiga). Slot kosong diisi dari antrean
   hanya oleh pekerjaan yang siap dikerjakan; bila tidak ada calon, slot dibiarkan kosong. */
function syncQueue() {
  const open = openTasks(),
    active = open.filter(t => t.status !== 'queued');
  for (const t of active.slice(3)) t.status = 'queued';
  let n = Math.min(active.length, 3);
  for (const t of open) {
    if (n >= 3) break;
    if (t.status === 'queued' && taskReady(t)) {
      t.status = 'todo';
      n++;
    }
  }
}
/* Dipanggil setelah urutan disusun ulang: tiga pekerjaan pertama yang boleh aktif menjadi aktif.
   Kartu antrean hanya boleh naik bila siap dikerjakan. */
function applyOrder() {
  let n = 0;
  for (const t of openTasks()) {
    if (n < 3 && (t.status !== 'queued' || taskReady(t))) {
      if (t.status === 'queued') t.status = 'todo';
      n++;
    } else t.status = 'queued';
  }
}
/* Nama slot. Prioritas Utama = pekerjaan utama pertama yang siap; Pekerjaan Paralel = kartu jenis paralel;
   selebihnya Prioritas Berikutnya (boleh menunggu prasyarat). */
const SLOTS = ['Prioritas Utama', 'Prioritas Berikutnya', 'Pekerjaan Paralel'];
function slotRoles(list = activeTasks()) {
  const pu = list.find(t => t.kind !== 'parallel' && taskReady(t)) || null;
  return {
    pu,
    pb: list.filter(t => t !== pu && t.kind !== 'parallel'),
    par: list.filter(t => t !== pu && t.kind === 'parallel'),
  };
}
function slotName(t) {
  const list = activeTasks();
  if (!list.includes(t)) return '';
  return t === slotRoles(list).pu ? SLOTS[0] : t.kind === 'parallel' ? SLOTS[2] : SLOTS[1];
}
/* Pekerjaan yang ditampilkan Beranda: Prioritas Utama, atau pekerjaan paralel yang siap bila belum ada. */
function primaryTask() {
  const r = slotRoles();
  return r.pu || r.par.find(taskReady) || activeTasks()[0] || null;
}

/* Slot kosong terisi dari antrean dulu, lalu dari subbagian berikutnya dalam rencana penelitian (Mulai Skripsi).
   Hanya kartu rencana (sumber Mulai Skripsi) yang menjadi patokan, supaya kartu dari temuan, arahan, atau skenario
   contoh tidak memunculkan subbagian baru tanpa alasan. */
function fillSlots() {
  syncQueue();
  if (!S.title) return;
  for (let guard = 0; guard < 3 && activeTasks().length < 3; guard++) {
    const act = activeTasks(),
      idx = t => PART_ORDER.indexOf(t.part),
      plan = S.tasks.filter(t => t.part && PARTS[t.part] && t.source === 'mulai');
    if (!plan.length) break;
    const open = plan.filter(t => !['done', 'deferred'].includes(t.status) && t.kind !== 'parallel'),
      anchor = open.length ? Math.min(...open.map(idx)) : Math.max(...plan.map(idx)),
      anchorCh = PARTS[PART_ORDER[anchor]]?.chapter || 1,
      has = id => S.tasks.some(t => t.part === id),
      list = PART_ORDER.filter((id, i) => i > anchor && partApplies(id) && !has(id));
    if (!list.length) break;
    const needPar = act.length >= 2 && !act.some(t => t.kind === 'parallel'),
      alt = needPar && list.find(x => x !== list[0] && PARTS[x].chapter > anchorCh && PROPOSAL_PARTS.has(x));
    partTask(
      alt || list[0],
      alt
        ? {
            kind: 'parallel',
            reason: `Aman dikerjakan sambil menunggu tanggapan dosen atas Bab ${PARTS[PART_ORDER[anchor]]?.roman || 'sebelumnya'}. Terisi dari rencana penelitianmu karena slot Pekerjaan Paralel kosong.`,
          }
        : {
            reason: `Subbagian berikutnya dalam rencana penelitianmu setelah ${PARTS[PART_ORDER[anchor]]?.name || 'pekerjaan sebelumnya'}.`,
          },
    );
  }
  syncQueue();
}

/* ---------- Tunda, lanjutkan, buka lagi ---------- */
function deferTask(id) {
  const t = S.tasks.find(t => t.id === id);
  if (!t) return;
  const dep = taskDependents(t).filter(x => x.status !== 'deferred');
  modal(
    'Tunda pekerjaan',
    `<h3>${e(t.title)}</h3><p class="mt">Isian, bukti, dan tautan arahan dosen yang sudah ada tetap tersimpan di kartu ini.</p>${dep.length ? `<div class="mt">${note(`${dep.map(x => '“' + e(x.title) + '”').join(', ')} bergantung pada pekerjaan ini dan akan tetap menunggu sampai pekerjaan ini selesai.`, 'amber')}</div>` : ''}${field('defer-reason', 'Alasan penundaan', t.deferReason, 'Misalnya menunggu arahan pembimbing.', 500)}${field('defer-date', 'Rencana melanjutkan', t.resumeDate, '', 0, 'date')}`,
    B('Batal', 'close-modal') + B('Simpan penundaan', 'save-defer:' + id, 'primary', 'pause'),
  );
}
/* Lanjutkan (dari Ditunda) dan Buka Lagi (dari Selesai) memakai aturan yang sama: prasyarat dicek dulu,
   lalu bila tiga slot penuh pengguna memilih Masuk Antrean atau Ganti Pekerjaan Aktif. */
function restoreTask(id, mode = 'restore') {
  const t = S.tasks.find(t => t.id === id);
  if (!t) return;
  const active = activeTasks(),
    full = active.length >= 3,
    ready = taskReady(t),
    reopen = mode === 'reopen';
  const why = reopen
    ? `<div class="field"><label for="reopen-reason">Alasan membuka lagi <span class="required-label">Wajib</span></label><textarea id="reopen-reason" maxlength="200" rows="3" placeholder="Misalnya: dosen meminta latar belakang ditambah data terbaru.">${e(t.reopenDraft || '')}</textarea><div class="field-meta"><span></span><span data-count="reopen-reason">0/200</span></div></div>`
    : '';
  let slot;
  if (!ready)
    slot = note(`${e(waitLabel(t))}. Kartu ini masuk Antrean dan naik otomatis setelah prasyaratnya selesai dan ada slot kosong.`, 'amber');
  else if (full)
    slot = `<p class="mt"><strong>Tiga slot aktif sudah terisi.</strong> Pilih ke mana kartu ini masuk.</p><div class="choices"><label class="choice"><input type="radio" name="rs-mode" value="queue" checked><span><strong>Masuk Antrean</strong><small>Kartu menunggu di Antrean dan naik otomatis saat ada slot kosong.</small></span></label><label class="choice"><input type="radio" name="rs-mode" value="swap"><span><strong>Ganti Pekerjaan Aktif</strong><small>Kartu ini menjadi aktif. Kartu aktif yang kamu pilih dipindahkan ke Antrean.</small></span></label></div>${selectField(
        'replace-task',
        'Kartu aktif yang dipindahkan ke Antrean (bila memilih Ganti)',
        active.map(x => [x.id, x.title]),
        active.at(-1).id,
      )}`;
  else slot = `<p class="mt small muted">Ada slot kosong, jadi kartu ini langsung aktif kembali.</p>`;
  modal(
    reopen ? 'Buka lagi pekerjaan ini?' : 'Lanjutkan pekerjaan',
    `<h3>${e(t.title)}</h3><p class="small muted">${reopen ? 'Kartu yang sama dibuka lagi beserta isian, bukti, dan riwayatnya. Alerin tidak membuat pekerjaan baru. Tinjauan Alerin perlu dijalankan ulang.' : 'Isian, bukti, dan tautan arahan sebelumnya tetap tersedia.'}</p>${why}<div class="mt">${slot}</div>`,
    B('Batal', 'close-modal') + B(reopen ? 'Buka Lagi' : 'Lanjutkan', 'restore-go:' + id + ':' + mode, 'primary', 'refresh'),
  );
}
/* Terapkan pilihan Lanjutkan/Buka Lagi. Pilihan "Ganti" selalu dikonfirmasi dengan nama kartu dan tujuannya. */
function applyRestore(id, mode, how, replaceId) {
  const t = S.tasks.find(x => x.id === id);
  if (!t) return;
  const reopen = mode === 'reopen';
  if (reopen) {
    t.reopenReason = capitalize(t.reopenDraft || '');
    t.completedAt = null;
    if (t.review) t.reviewPrev = t.review;
    t.review = null;
    delete t.reopenDraft;
  } else t.deferReason = '';
  let msg;
  if (!taskReady(t) || how === 'queue') {
    t.status = 'queued';
    msg = !taskReady(t) ? `“${t.title}” masuk Antrean. ${waitLabel(t)}.` : `“${t.title}” masuk Antrean dan naik saat ada slot kosong.`;
  } else if (how === 'swap') {
    const old = S.tasks.find(x => x.id === replaceId);
    if (old) old.status = 'queued';
    t.status = 'todo';
    msg = `“${t.title}” aktif kembali. “${old?.title || ''}” dipindahkan ke Antrean.`;
  } else {
    t.status = 'todo';
    msg = `“${t.title}” aktif kembali di Progres Aktif.`;
  }
  record(reopen ? 'Pekerjaan dibuka lagi' : 'Pekerjaan dilanjutkan', t.title + (reopen ? ' · ' + t.reopenReason : '') + (how === 'swap' ? ' · ganti pekerjaan aktif' : ''));
  syncQueue();
  synchronizeResearch();
  persist();
  closeModal(true);
  toast(msg, '', 6500);
  focusTaskInProgres(t.id);
}

/* ---------- Pembuatan pekerjaan ---------- */
function partTask(partId, opts = {}) {
  const p = PARTS[partId];
  if (!p) return null;
  let t =
    S.tasks.find(x => x.part === partId && x.status !== 'done') ||
    (opts.reopen && S.tasks.find(x => x.part === partId));
  if (t) {
    if (t.status === 'done' && opts.reopen) {
      t.status = 'todo';
      t.reopenReason = opts.reopen;
      record('Pekerjaan dibuka lagi', t.title + ' · ' + opts.reopen);
    }
    return t;
  }
  t = {
    id: 'part-' + partId + '-' + Date.now().toString(36),
    part: partId,
    title: opts.title || `Susun Bab ${p.roman} · ${p.name}`,
    phase: opts.phase ?? partPhase(partId),
    kind: opts.kind || 'main',
    source: opts.source || 'mulai',
    time: 'Sesuai cakupan bagian',
    reason: opts.reason || `Bagian ${p.name} menjadi dasar bagian berikutnya di Bab ${p.roman}.`,
    doing: opts.doing || STEP_BY_PART[partId] || 'Kerjakan bagian ini berdasarkan panduan.',
    deliverable: opts.deliverable || `Draf ${p.name} yang sudah kamu tulis sendiri, beserta sumbernya.`,
    criteria: opts.criteria || [`Isian panduan ${p.name} lengkap.`, 'Arahan dosen yang tertaut sudah ditindaklanjuti.'],
    steps: p.fields.map(f => f.split('|')[0]),
    status: 'todo',
    checks: [],
    evidence: '',
    findingIds: [],
    discussion: [],
    created: new Date().toISOString(),
  };
  if (activeTasks().length >= 3) t.status = 'queued';
  S.tasks.push(t);
  record('Pekerjaan ditambahkan', t.title);
  return t;
}
function plainTask(spec) {
  const t = {
    id: 'task-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    phase: S.phase || 0,
    kind: 'main',
    source: 'beranda',
    time: 'Sesuai cakupan',
    reason: '',
    doing: '',
    deliverable: 'Catatan perubahan dan lokasi buktinya.',
    criteria: ['Bukti perubahan dicatat.'],
    steps: [],
    status: activeTasks().length >= 3 ? 'queued' : 'todo',
    checks: [],
    evidence: '',
    findingIds: [],
    discussion: [],
    created: new Date().toISOString(),
    ...spec,
  };
  S.tasks.push(t);
  record('Pekerjaan ditambahkan', t.title);
  return t;
}

/* ---------- Urutan prioritas ---------- */
/* Arahan perbaikan kecil (ejaan, format, kerapian) tidak mengambil Prioritas Utama. */
const revMinor = r =>
  /(salah ketik|typo|ejaan|tanda baca|spasi|margin|font|ukuran huruf|huruf kapital|kapitalisasi|format penulisan|penomoran|nomor halaman|kerapian|rapikan tampilan|huruf miring|cetak miring|italic)/i.test(
    (r.topic || '') + ' ' + (r.text || ''),
  );
/* Tenggat tercatat untuk kartu: target terdekat yang ditautkan ke kartu ini, atau tanggal tenggat kartu. */
function taskDueDays(t) {
  const ds = [];
  if (S.target?.taskId === t.id && S.target.date) ds.push(daysLeft(S.target.date));
  if (t.due) ds.push(daysLeft(t.due));
  return ds.length ? Math.min(...ds) : null;
}
function taskScore(t) {
  let s = 0;
  const revs = taskPendingRevs(t),
    blocks = taskDependents(t).length > 0,
    due = taskDueDays(t),
    urgent = due !== null && due <= 3;
  if (revs.length) s -= revs.some(r => !revMinor(r)) ? (blocks || urgent ? 100 : 15) : 5;
  if (blocks) s -= 50;
  if (urgent) s -= 60;
  else if (due !== null && due <= 7) s -= 20;
  const fs = taskFindings(t);
  if (fs.length) s -= fs.some(f => f.severity === 'kritis') ? 40 : 15;
  if (t.part) s += PART_ORDER.indexOf(t.part);
  if (t.kind === 'parallel') s += 60;
  if (!taskReady(t)) s += 200;
  return s;
}
/* Prioritas Utama dari sebuah urutan: kartu utama pertama yang siap di antara tiga kartu yang akan aktif. */
function puOfOrder(list) {
  const act = [];
  for (const t of list.filter(x => !['done', 'deferred'].includes(x.status)))
    if (act.length < 3 && (t.status !== 'queued' || taskReady(t))) act.push(t);
  return act.find(t => t.kind !== 'parallel' && taskReady(t)) || null;
}
function reorderTasks(ask = false, cause = 'Ada arahan atau temuan baru') {
  const before = slotRoles().pu?.id;
  const open = S.tasks.filter(t => !['done', 'deferred'].includes(t.status)),
    rest = S.tasks.filter(t => ['done', 'deferred'].includes(t.status));
  const sorted = [...open].sort((a, b) => taskScore(a) - taskScore(b));
  /* Status baru diturunkan dari urutan setelah urutan disimpan, supaya "Biarkan urutan lama" tidak mengosongkan slot. */
  const next = [...sorted, ...rest];
  const after = puOfOrder(next)?.id;
  if (ask && before && after && before !== after) {
    const b = S.tasks.find(t => t.id === before),
      a = S.tasks.find(t => t.id === after);
    pendingOrder = next.map(t => t.id);
    modal(
      'Urutan pekerjaan berubah',
      `<p>${e(cause)}, sehingga urutan Progres Aktif ikut berubah.</p><div class="order-change"><div><span class="eyebrow">SEBELUMNYA</span><p>${e(b.title)}</p></div>${I('arrowDown')}<div><span class="eyebrow">PRIORITAS UTAMA SEKARANG</span><p><strong>${e(a.title)}</strong></p><p class="small muted">${e(priorityReason(a, SLOTS[0]))}</p></div></div>`,
      B('Biarkan urutan lama', 'order-keep') + B('Simpan urutan baru', 'order-save', 'primary'),
    );
    return false;
  }
  S.tasks = next;
  applyOrder();
  return true;
}

/* ---------- Hubungan dengan arahan dan temuan ---------- */
const taskRevs = t => (S.revisions || []).filter(r => r.taskId === t.id);
const taskPendingRevs = t => taskRevs(t).filter(r => r.status !== 'done');
function taskFindings(t) {
  const ids = new Set(t.findingIds || []),
    out = [];
  for (const r of S.reviews || [])
    for (const f of r.findings) if (ids.has(f.id) && !out.some(x => x.id === f.id)) out.push(f);
  return out;
}
/* Pemahaman Alerin atas sebuah arahan dianggap sudah disetujui kecuali ditandai belum. */
const revUnderstood = r => r.understood !== false;
/* Kartu yang membahas bagian dan hasil kerja yang sama dengan sebuah arahan. Kata yang muncul di judul
   beberapa kartu sekaligus diberi bobot setengah, supaya kecocokan tidak hanya karena kata umum. */
function revTaskMatches(r) {
  const part = r.part || analyzeArahan(r.text).part,
    ch = PARTS[part]?.chapter,
    words = rootsOf([r.topic, r.text, r.understanding?.maksud, r.understanding?.bagian].join(' '));
  const pool = S.tasks.filter(t => t.status !== 'done');
  const inTitles = w => pool.filter(t => norm(t.title).includes(w)).length;
  return pool
    .map(t => {
      let score = 0;
      if (t.part && t.part === part) score += 0.6;
      else if (ch && PARTS[t.part]?.chapter === ch) score += 0.15;
      const tt = norm(t.title),
        dd = norm([t.deliverable, t.bagian].join(' '));
      for (const w of words) if (tt.includes(w)) score += inTitles(w) > 1 ? 0.125 : 0.25;
      score += Math.min(0.3, words.filter(w => dd.includes(w)).length * 0.1);
      return { t, score };
    })
    .filter(x => x.score >= 0.25)
    .sort((a, b) => b.score - a.score);
}
/* Saat arahan dikonfirmasi: tautkan otomatis bila kecocokannya jelas. Hasil null berarti pengguna perlu memilih. */
function revAutoLink(r) {
  const m = revTaskMatches(r),
    top = m[0];
  if (!top || top.score < 0.5 || (m[1] && top.score - m[1].score < 0.2) || !['todo', 'queued'].includes(top.t.status)) return null;
  r.taskId = top.t.id;
  record('Arahan tertaut otomatis', r.topic + ' → ' + top.t.title);
  return top.t;
}

/* ---------- Status kartu ---------- */
function taskState(t) {
  if (t.status === 'done') return ['ok', 'Selesai Dikerjakan'];
  if (t.status === 'deferred') return ['', 'Ditunda'];
  if (!taskReady(t)) return ['warn', waitLabel(t)];
  if (t.status === 'queued') return ['', 'Antrean'];
  const pend = taskPendingRevs(t),
    rv = reviewState(t);
  if (pend.some(r => !revUnderstood(r))) return ['warn', 'Arahan menunggu konfirmasi pemahaman'];
  if (rv === 'stale') return ['warn', 'Perlu Diperiksa Ulang'];
  if (pend.length) return ['warn', 'Menunggu tindak lanjut arahan dosen'];
  if (t.reopenReason) return ['info', 'Dibuka lagi · ' + t.reopenReason];
  if (rv === 'pass') return ['info', 'Lolos Tinjauan Alerin'];
  return taskHasWork(t) ? ['info', 'Sedang dikerjakan'] : ['', 'Belum dimulai'];
}
const taskHasWork = t =>
  !!String(t.evidence || '').trim() ||
  S.files.some(f => f.context === 'task-' + t.id) ||
  (t.part && Object.values(S.guide?.fields?.[t.part] || {}).some(v => String(v || '').trim()));
/* Label sumber pekerjaan. Status dan sumber selalu ditulis terpisah. */
function taskSource(t) {
  if (taskRevs(t).length || t.source === 'revisi') return 'arahan pembimbing';
  if ((t.findingIds || []).length || t.source === 'periksa') return 'pemeriksaan Alerin';
  if (t.sample) return 'skenario contoh (Mode Simulasi)';
  if (t.source === 'mulai') return 'rencana penelitian';
  return 'informasi pengguna';
}
const taskBagian = t => (t.part && PARTS[t.part] ? partLabel(t.part) : t.bagian || 'Bagian belum ditentukan');
/* Alasan urutan yang ditampilkan di kartu. */
function priorityReason(t, role = slotName(t)) {
  if (t.status === 'done') return '';
  if (t.status === 'deferred') return 'Ditunda. Prasyarat dan tautannya tetap berlaku saat dilanjutkan.';
  if (t.status === 'queued')
    return taskReady(t)
      ? 'Tiga slot aktif sudah terisi. Kartu ini naik otomatis saat ada slot kosong.'
      : `${waitLabel(t)}. Kartu ini naik setelah prasyaratnya selesai dan ada slot kosong.`;
  const bits = [],
    deps = taskDependents(t),
    revs = taskPendingRevs(t),
    due = taskDueDays(t);
  if (role === SLOTS[0]) {
    if (revs.some(r => !revMinor(r)) && (deps.length || (due !== null && due <= 3))) bits.push('Arahan dosen tertaut menahan langkah berikutnya.');
    if (deps.length) bits.push(`Siap dikerjakan dan membuka “${deps[0].title}”${deps.length > 1 ? ` serta ${deps.length - 1} pekerjaan lain` : ''}.`);
    if (due !== null && due <= 7) bits.push(`Tenggat tercatat ${due < 0 ? 'sudah lewat' : due === 0 ? 'hari ini' : due + ' hari lagi'}.`);
    if (!bits.length) bits.push(t.reason || 'Pekerjaan siap dikerjakan yang paling awal dalam urutan.');
  } else if (role === SLOTS[2]) bits.push('Bisa dikerjakan sekarang tanpa menunggu pekerjaan lain selesai.');
  else
    bits.push(
      taskReady(t)
        ? 'Pekerjaan lanjutan yang paling relevan setelah Prioritas Utama.'
        : `${waitLabel(t)}. Detailnya bisa dilihat dulu; pemeriksaan dan penyelesaian terbuka setelah prasyaratnya selesai.`,
    );
  if (revs.length && revs.every(revMinor)) bits.push('Arahan dosen tertaut berupa perbaikan kecil, jadi urutannya mengikuti urgensi.');
  return bits.join(' ');
}
/* Kartu dari tahap sebelum posisi penelitian tetap tampil bila masih relevan, dengan alasannya. */
function earlierStageNote(t) {
  const st = stageInfo();
  if (!st.confirmed || t.status === 'done' || !(+t.phase < st.idx)) return '';
  const deps = taskDependents(t);
  const why = taskPendingRevs(t).length
    ? 'arahan dosen tertaut belum tuntas'
    : deps.length
      ? `hasilnya dibutuhkan “${deps[0].title}”`
      : 'pekerjaan ini belum selesai';
  return `Dari Tahap ${stageName(+t.phase)} · tetap tampil karena ${why}.`;
}

/* ---------- Syarat Catat Sebagai Selesai ---------- */
/* Daftar syarat yang ditampilkan di ruang kerja. Jumlah karakter hanya validasi isian;
   kesesuaian hasil dinilai lewat Tinjauan Alerin per kriteria Selesai Bila. */
function completionChecks(t) {
  const out = [],
    rv = reviewState(t),
    pend = taskPendingRevs(t),
    revs = taskRevs(t);
  out.push(
    taskReady(t)
      ? { kind: 'prasyarat', ok: true, label: 'Prasyarat', text: taskDeps(t).length ? 'Terpenuhi' : 'Tidak ada prasyarat' }
      : { kind: 'prasyarat', ok: false, label: 'Prasyarat', text: waitLabel(t) + '.', next: 'Selesaikan prasyaratnya dulu. Sementara itu, kerjakan pekerjaan paralel yang siap.' },
  );
  if (t.part && PARTS[t.part]) {
    const pf = partFilled(t.part);
    out.push(
      pf.ok
        ? { kind: 'kolom', ok: true, label: 'Isian panduan', text: 'Lengkap' }
        : {
            kind: 'kolom',
            ok: false,
            label: 'Isian panduan',
            empty: pf.emptyIdx,
            text: pf.empty.length
              ? pf.empty.length === 1
                ? `Kolom ${pf.empty[0]} masih kosong.`
                : `${pf.empty.length} kolom wajib masih kosong: ${joinList(pf.empty, ', ', ' dan ')}.`
              : 'Isian wajib masih terlalu singkat atau belum bisa dipahami.',
            next: 'Lengkapi isian panduan di ruang kerja.',
          },
    );
  } else {
    const ev = String(t.evidence || '').trim(),
      files = S.files.some(f => f.context === 'task-' + t.id);
    out.push(
      (ev && !isAsal(ev)) || files
        ? { kind: 'bukti', ok: true, label: 'Hasil atau bukti', text: [ev ? 'Ditulis' : '', files ? 'lampiran ada' : ''].filter(Boolean).join(' · ') }
        : {
            kind: 'bukti',
            ok: false,
            label: 'Hasil atau bukti',
            text: ev ? 'Isiannya belum bisa dipahami.' : 'Belum ditulis dan belum ada lampiran.',
            next: 'Tulis hasil kerjamu dan letaknya di naskah, atau lampirkan berkasnya.',
          },
    );
  }
  const rvText = {
    none: ['Belum diperiksa', 'Tekan Periksa Pekerjaan.'],
    stale: ['Perlu Diperiksa Ulang · hasil atau bukti berubah sejak diperiksa', 'Tekan Periksa Pekerjaan lagi.'],
    empty: ['Belum dapat diperiksa · hasil atau bukti masih kosong', 'Isi hasil atau bukti, lalu periksa lagi.'],
    unclear: ['Belum dapat diperiksa · isian belum bisa dipahami', 'Tulis ulang dengan kalimat biasa, lalu periksa lagi.'],
    irrelevant: ['Bukti belum relevan dengan pekerjaan ini', 'Tunjukkan hasil yang sesuai dengan Hasil yang Disiapkan, lalu periksa lagi.'],
    partial: [`${t.review?.items?.filter(i => i.status === 'met').length || 0} dari ${t.review?.items?.length || 0} kriteria terpenuhi`, 'Buka Tinjauan Alerin untuk melihat poin yang perlu bukti atau revisi.'],
    pass: ['Semua kriteria terpenuhi', ''],
  }[rv];
  out.push({ kind: 'tinjauan', ok: rv === 'pass', label: 'Tinjauan Alerin', text: rvText[0], next: rvText[1] });
  const notes = (t.review?.notes || []).filter(n => !n.done);
  out.push(
    rv === 'pass' || rv === 'partial'
      ? notes.length
        ? { kind: 'koreksi', ok: false, label: 'Koreksi Alerin', text: `${notes.length} poin belum ditandai tuntas`, next: 'Perbaiki poinnya, lalu tandai tuntas di Tinjauan Alerin.' }
        : { kind: 'koreksi', ok: true, label: 'Koreksi Alerin', text: 'Tidak ada poin terbuka' }
      : { kind: 'koreksi', ok: false, label: 'Koreksi Alerin', text: 'Menunggu Tinjauan Alerin', next: 'Jalankan Periksa Pekerjaan dulu.' },
  );
  out.push(
    !revs.length
      ? { kind: 'arahan', ok: true, label: 'Revisi Dosen', text: 'Tidak ada arahan tertaut' }
      : pend.length
        ? { kind: 'arahan', ok: false, label: 'Revisi Dosen', text: `${pend.length} arahan menunggu tindak lanjut`, next: 'Laporkan tindak lanjutnya di Revisi Dosen.' }
        : { kind: 'arahan', ok: true, label: 'Revisi Dosen', text: 'Sudah ditindaklanjuti' },
  );
  return out;
}
/* Syarat pertama yang belum terpenuhi. Hasil null berarti boleh dicatat selesai. */
function completionBlock(t) {
  const c = completionChecks(t).find(x => !x.ok);
  return c ? { ...c, text: c.text + (c.next ? ' ' + c.next : '') } : null;
}
