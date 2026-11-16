'use strict';
/* Penyusun pekerjaan dan urutan prioritas Progres Aktif. */
/* Urutan baru yang menunggu konfirmasi pengguna. Tidak ikut disimpan. */
let pendingOrder = null;
function fillSlots() {
  const open = 3 - activeTasks().length;
  if (open > 0)
    S.tasks
      .filter(t => t.status === 'queued')
      .slice(0, open)
      .forEach(t => (t.status = 'todo'));
}
function deferTask(id) {
  const t = S.tasks.find(t => t.id === id);
  if (!t) return;
  modal(
    'Tunda pekerjaan',
    `<h3>${e(t.title)}</h3><p class="mt">Bukti dan catatan yang sudah disimpan tetap tersedia.</p>${field('defer-reason', 'Alasan penundaan', t.deferReason, 'Misalnya menunggu arahan pembimbing.', 500)}${field('defer-date', 'Rencana melanjutkan', t.resumeDate, '', 0, 'date')}`,
    B('Batal', 'close-modal') + B('Simpan penundaan', 'save-defer:' + id, 'primary', 'pause'),
  );
}
function restoreTask(id) {
  const t = S.tasks.find(t => t.id === id);
  if (!t) return;
  const active = activeTasks();
  modal(
    'Aktifkan kembali pekerjaan',
    `<h3>${e(t.title)}</h3><p class="mt">${active.length === 3 ? 'Tiga slot aktif sudah terisi. Pilih satu pekerjaan untuk ditunda agar antrean tetap fokus.' : 'Pekerjaan akan kembali ke antrean aktif dengan bukti dan catatan sebelumnya.'}</p>${
      active.length === 3
        ? selectField(
            'replace-task',
            'Pekerjaan yang akan ditunda',
            active.map(x => [x.id, x.title]),
            active[0].id,
          )
        : ''
    }`,
    B('Batal', 'close-modal') + B('Aktifkan kembali', 'confirm-restore:' + id, 'primary', 'refresh'),
  );
}
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
function taskScore(t) {
  let s = 0;
  if (pendingRevisions().some(r => r.taskId === t.id)) s -= 100;
  if ((t.findingIds || []).length) s -= 40;
  if (t.part) s += PART_ORDER.indexOf(t.part);
  if (t.kind === 'parallel') s += 60;
  return s;
}
function reorderTasks(ask = false) {
  const before = activeTasks()[0]?.id;
  const open = S.tasks.filter(t => !['done', 'deferred'].includes(t.status)),
    rest = S.tasks.filter(t => ['done', 'deferred'].includes(t.status));
  const sorted = [...open].sort((a, b) => taskScore(a) - taskScore(b));
  sorted.forEach((t, i) => {
    if (i < 3 && t.status === 'queued') t.status = 'todo';
    if (i >= 3 && ['todo'].includes(t.status)) t.status = 'queued';
  });
  const next = [...sorted, ...rest];
  const after = next.filter(t => !['done', 'deferred', 'queued'].includes(t.status))[0]?.id;
  if (ask && before && after && before !== after) {
    const b = S.tasks.find(t => t.id === before),
      a = S.tasks.find(t => t.id === after);
    pendingOrder = next.map(t => t.id);
    modal(
      'Urutan pekerjaan berubah',
      `<p>Ada arahan atau temuan baru, sehingga urutan Progres Aktif ikut berubah.</p><div class="order-change"><div><span class="eyebrow">SEBELUMNYA</span><p>${e(b.title)}</p></div>${I('arrowDown')}<div><span class="eyebrow">PRIORITAS UTAMA SEKARANG</span><p><strong>${e(a.title)}</strong></p></div></div>`,
      B('Biarkan urutan lama', 'order-keep') + B('Simpan urutan baru', 'order-save', 'primary'),
    );
    return false;
  }
  S.tasks = next;
  return true;
}
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
function taskState(t) {
  if (t.status === 'done') return ['ok', 'Selesai menurut pengguna'];
  const pend = taskPendingRevs(t);
  if (pend.some(r => !revUnderstood(r))) return ['warn', 'Arahan menunggu konfirmasi pemahaman'];
  if (pend.length) return ['warn', 'Menunggu tindak lanjut arahan dosen'];
  if (t.reopenReason) return ['info', 'Dibuka lagi · ' + t.reopenReason];
  if (t.status === 'queued') return ['', 'Antrean'];
  if (t.status === 'deferred') return ['', 'Ditunda'];
  return t.checks?.length || t.evidence ? ['info', 'Sedang dikerjakan'] : ['', 'Belum dimulai'];
}
/* Nama slot untuk tiga kartu aktif. Pekerjaan paralel selalu memakai nama slotnya sendiri. */
const SLOTS = ['Prioritas Utama', 'Prioritas Berikutnya', 'Pekerjaan Paralel'];
const slotName = (t, i) => (i === 0 ? SLOTS[0] : t.kind === 'parallel' || i >= 2 ? SLOTS[2] : SLOTS[1]);
/* Label sumber pekerjaan. Status dan sumber selalu ditulis terpisah. */
function taskSource(t) {
  if (taskRevs(t).length || t.source === 'revisi') return 'arahan pembimbing';
  if ((t.findingIds || []).length || t.source === 'periksa') return 'pemeriksaan Alerin';
  return 'informasi pengguna';
}
/* Alasan "Catat Sebagai Selesai" belum bisa dipakai. Hasil null berarti boleh dicatat selesai. */
function completionBlock(t) {
  const pend = taskPendingRevs(t);
  if (pend.length)
    return { kind: 'arahan', text: `Masih ada ${pend.length} arahan dosen yang belum ditindaklanjuti.` };
  if (t.part) {
    const pf = partFilled(t.part);
    if (pf.empty.length)
      return {
        kind: 'kolom',
        empty: pf.emptyIdx,
        text:
          pf.empty.length === 1
            ? `Kolom ${pf.empty[0]} masih kosong.`
            : `${pf.empty.length} kolom wajib masih kosong: ${joinList(pf.empty, ', ', ' dan ')}.`,
      };
    if (!pf.ok)
      return {
        kind: 'kolom',
        empty: [],
        text: 'Isian wajib masih terlalu singkat atau belum bisa dipahami. Tulis minimal 20 karakter dengan kalimat biasa.',
      };
  } else {
    const bukti = String(t.evidence || '');
    const adaBerkas = S.files.some(f => f.context === 'task-' + t.id);
    if (!adaBerkas && (bukti.replace(/\s/g, '').length < 20 || isAsal(bukti)))
      return {
        kind: 'bukti',
        text: bukti
          ? 'Bukti perubahan masih terlalu singkat. Tulis minimal 20 karakter dengan kalimat yang jelas.'
          : 'Bukti perubahan belum ditulis dan belum ada berkas yang dilampirkan.',
      };
  }
  const catatan = (t.koreksi || []).length;
  if (catatan && !t.koreksiOk)
    return { kind: 'koreksi', text: `Koreksi Alerin yang kamu minta masih punya ${catatan} catatan yang belum kamu tinjau.` };
  return null;
}
