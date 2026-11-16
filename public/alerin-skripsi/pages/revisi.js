'use strict';
/* Halaman revisi. */
function revisiPage() {
  const all = S.revisions || [],
    filter = S.revFilter || 'semua',
    pend = pendingRevisions().length;
  const list = all.filter(r => filter === 'semua' || (filter === 'belum' ? r.status !== 'done' : r.status === 'done'));
  const groups = {};
  for (const r of [...list].sort((a, b) => b.date.localeCompare(a.date))) (groups[r.date] ??= []).push(r);
  const tabs = `<div class="tabs v4-progress-tabs" role="tablist" aria-label="Saring arahan">${[
    ['semua', 'Semua', all.length],
    ['belum', 'Belum ditindaklanjuti', pend],
    ['sudah', 'Sudah ditindaklanjuti', all.length - pend],
  ]
    .map(([k, l, n]) => B(`${l} (${n})`, 'rev-filter:' + k, filter === k ? 'primary' : 'text', '', `role="tab" aria-selected="${filter === k}"`))
    .join('')}</div>`;
  const body = !all.length
    ? `<div class="card empty">${I('edit')}<h3>Belum ada arahan dosen</h3><p>Catat arahan setiap selesai bimbingan. Alerin membantu memahami maksudnya dan menautkannya ke pekerjaan di Progres Aktif.</p>${B('Tambah Arahan', 'add-revision', 'primary', 'plus')}</div>`
    : !list.length
      ? `<div class="card empty"><p class="muted">Tidak ada arahan di daftar ini.</p></div>`
      : Object.entries(groups)
          .map(
            ([d, rs]) =>
              `<section class="v6-session"><div class="section-head"><h2>Bimbingan ${dateLong(d)}</h2><span class="small muted">${rs.length} arahan</span></div>${rs.map(revCard).join('')}</section>`,
          )
          .join('');
  return (
    pageHead(
      'Arahan dosen dari setiap bimbingan',
      'Catatan asli dosen tetap utuh. Konfirmasikan pemahaman sebelum menghubungkannya ke Progres Aktif.',
      'add-revision',
      'Tambah Arahan',
      'plus',
      'REVISI DOSEN',
    ) +
    (all.length ? tabs : '') +
    body
  );
}
function revCard(r) {
  const t = r.taskId && S.tasks.find(x => x.id === r.taskId),
    u = r.understanding || {},
    done = r.status === 'done',
    paham = revUnderstood(r),
    files = S.files.filter(f => f.context === 'rev-' + r.id);
  const link = t ? badge('Tertaut ke: ' + t.title, 'blue') : badge('Belum tertaut ke pekerjaan', '');
  const status = done
    ? badge('Sudah ditindaklanjuti · ' + dateLong(r.doneAt).replace(/ \d{4}$/, ''), 'green')
    : paham
      ? badge('Belum ditindaklanjuti', 'amber')
      : badge('Menunggu konfirmasi pemahaman', 'amber');
  let acts, help = '';
  if (done) {
    acts = B('Tandai Belum Ditindaklanjuti', 'rev-undo:' + r.id, 'text');
  } else if (!paham) {
    acts = B('Setujui Pemahaman', 'rev-ok:' + r.id, 'primary', 'check') + B('Ubah Pemahaman', 'rev-edit:' + r.id, '');
    help = `Baca pemahaman di atas. Setujui kalau sudah sesuai maksud dosen, atau ubah dulu.${t ? ' Kartu pekerjaannya sudah terkunci sejak arahan ini disimpan.' : ''}`;
  } else if (t) {
    acts = B('Sudah Ditindaklanjuti', 'rev-done:' + r.id, 'primary', 'check') + B('Buka Kartu', 'task:' + t.id, '', 'arrow');
    help = 'Status kartunya di Progres Aktif ikut berubah.';
  } else {
    acts = B('Masukkan ke Progres', 'rev-link:' + r.id, 'primary', 'plus') + B('Sudah Ditindaklanjuti', 'rev-done:' + r.id, 'text');
    help = 'Alerin menautkan ke pekerjaan yang cocok, atau membuat pekerjaan baru.';
  }
  const label = u.edited ? 'diubah olehmu' : paham ? 'contoh · sudah kamu setujui' : 'contoh · belum analisis AI';
  return `<article class="card v6-revision ${done ? 'is-done' : ''}" id="rev-${r.id}"><div class="between">${link}${status}</div><h3 class="mt">${e(r.topic || 'Arahan dosen')}</h3><p class="small muted">${r.stageText ? `Tahap saat itu: ${e(r.stageText)} · ` : ''}Sumber: arahan pembimbing</p><div class="v6-original"><span class="small muted">Catatan asli dosen · tidak diubah</span><p>“${e(r.text)}”</p>${files.length ? `<div class="actions">${files.map(f => B(`${e(f.name)} · ${fileSize(f.size)}`, 'open-file:' + f.id, 'text', 'file')).join('')}</div>` : ''}</div><div class="mt"><strong class="small">Pemahaman Alerin · ${label}</strong><p>${e(u.maksud || '')}</p></div><div class="v6-impact mt"><p class="small"><strong>Bagian terdampak:</strong> ${e(u.bagian || '')}</p><p class="small"><strong>Langkah perbaikan:</strong> ${e(u.langkah || '')}</p></div>${done && r.doneNote ? `<div class="v6-original mt"><span class="small muted">Perubahan yang sudah dilakukan</span><p>${e(r.doneNote)}</p></div>` : ''}<div class="between mt"><div class="actions">${acts}</div><details class="v6-options"><summary aria-label="Pilihan lain untuk arahan ini">•••</summary><div><button type="button" class="btn text" data-action="rev-edit:${r.id}">Ubah Pemahaman Alerin</button><button type="button" class="btn text" data-action="rev-ask:${r.id}">Tanyakan Ulang ke Dosen</button><button type="button" class="btn text danger-text" data-action="rev-del:${r.id}">Hapus Arahan</button></div></details></div>${help ? `<p class="small muted mt">${help}</p>` : ''}</article>`;
}
function revisionModal(taskId, pre = {}) {
  const t = taskId && S.tasks.find(x => x.id === taskId),
    st = stageInfo();
  const ph =
    st.idx !== null
      ? `Contoh: ${stageName(st.idx)}${t ? ', ' + t.title : ''}`
      : 'Contoh: 02 · Penyusunan Proposal, revisi Bab I';
  modal(
    'Tambahkan Revisi Dosen',
    `${t ? `<p class="small muted mb">Arahan ini langsung tertaut ke <strong>${e(t.title)}</strong>.</p>` : ''}<div class="field"><label for="rv-date">Tanggal bimbingan <span class="required-label">Wajib</span></label><input id="rv-date" type="date" value="${e(pre.date || isoToday())}" max="${isoToday()}" aria-required="true"></div><div class="field"><label for="rv-topic">Topik arahan <span class="required-label">Wajib</span></label><input id="rv-topic" type="text" maxlength="120" value="${e(pre.topic || '')}" placeholder="Contoh: Rumusan masalah" aria-required="true"><div class="field-meta"><span></span><span data-count="rv-topic">${String(pre.topic || '').length}/120</span></div></div><div class="field"><label for="rv-stage">Tahap menurutmu saat ini <span>Opsional</span></label><input id="rv-stage" type="text" maxlength="160" value="${e(pre.stage || '')}" placeholder="${e(ph)}"></div><p class="field-hint">Contoh: Penyusunan Proposal atau Pengolahan dan Analisis Data.</p><div class="field"><label for="rv-text">Catatan Dosen <span class="required-label">Wajib</span></label><textarea id="rv-text" maxlength="2000" placeholder="Salin catatan atau instruksi dosen sesuai aslinya." rows="3" aria-required="true">${e(pre.text || '')}</textarea><div class="field-meta"><span>Ditulis apa adanya. Alerin tidak mengubah catatan ini.</span><span data-count="rv-text">${String(pre.text || '').length}/2000</span></div></div>${uploadZone('revisi6', 'Upload catatan / rekaman audio', 'PDF, DOCX, JPG, PNG, MP3, M4A')}${fileList('revisi6')}<div class="field"><label class="checkbox mt"><input type="checkbox" id="rv-ok" ${pre.ok ? 'checked' : ''}>Saya sudah memahami arahan ini dan menuliskannya sesuai yang disampaikan dosen.</label></div><p class="small muted mt">Rekaman disimpan sebagai lampiran. Transkripsi audio belum tersedia.</p>`,
    B('Batal', 'close-modal') + B('Simpan Arahan', 'rev-save' + (taskId ? ':' + taskId : ''), 'primary', 'save'),
    true,
  );
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
  if (!checkRequired('rv-text', { min: 10 })) ok = false;
  if ($('#rv-stage').value.trim() && isAsal($('#rv-stage').value))
    ok = fieldError('rv-stage', 'Isiannya belum bisa Alerin pahami. Coba tulis dengan kalimat biasa.');
  if (!$('#rv-ok').checked) {
    const w = $('#rv-ok').closest('.field');
    w.classList.add('invalid');
    w.insertAdjacentHTML('beforeend', '<p class="field-error">Centang dulu bila kamu sudah memahami arahan ini.</p>');
    ok = false;
  }
  if (!ok) return focusFirstError();
  const text = $('#rv-text').value.trim(),
    an = analyzeArahan(text + ' ' + $('#rv-topic').value),
    id = 'rv' + Date.now().toString(36);
  const r = {
    id,
    date: d,
    topic: capitalize($('#rv-topic').value),
    stageText: capitalize($('#rv-stage').value),
    text,
    understanding: { maksud: an.maksud, bagian: an.bagian, langkah: an.langkah },
    part: an.part,
    status: 'open',
    understood: false,
    created: new Date().toISOString(),
  };
  for (const f of S.files) if (f.context === 'revisi6') f.context = 'rev-' + id;
  if (taskId && S.tasks.some(x => x.id === taskId)) r.taskId = taskId;
  S.revisions.unshift(r);
  record('Arahan dosen dicatat', r.topic);
  closeModal(true);
  if (r.taskId) {
    const t = S.tasks.find(x => x.id === r.taskId);
    if (t.status === 'done') {
      t.status = 'todo';
      t.reopenReason = 'Arahan dosen baru';
    }
    reorderTasks(true);
  }
  persist();
  render();
  toast(
    r.taskId
      ? 'Arahan tersimpan dan tertaut ke kartu pekerjaan. Setujui pemahaman Alerin di Revisi Dosen.'
      : 'Arahan tersimpan. Setujui pemahaman Alerin, lalu masukkan ke Progres.',
    '',
    6500,
  );
}
function revLinkModal(id) {
  const r = S.revisions.find(x => x.id === id);
  if (!r) return;
  const part = r.part || analyzeArahan(r.text).part;
  const same = S.tasks.find(t => t.part === part && t.status !== 'deferred') || activeTasks()[0];
  const opt = (v, t, d, on) =>
    `<label class="choice"><input type="radio" name="rl-mode" value="${v}" ${on ? 'checked' : ''}><span><strong>${t}</strong><small>${d}</small></span></label>`;
  modal(
    'Masukkan ke Progres',
    `<p class="small muted">Arahan: <strong>${e(r.topic)}</strong> · bagian terdampak ${e(partLabel(part))}</p><div class="choices">${same ? opt('link:' + same.id, `Tautkan ke “${e(same.title)}”`, same.status === 'done' ? 'Kartu ini sudah selesai dan akan dibuka lagi.' : 'Paling cocok dengan bagian yang terdampak.', true) : ''}${opt('new', 'Buat pekerjaan baru', `Kartu baru: Tindak lanjuti arahan · ${e(r.topic)}`, !same)}</div>`,
    B('Batal', 'close-modal') + B('Simpan', 'rev-link-save:' + id, 'primary'),
  );
}
function saveRevLink(id) {
  const r = S.revisions.find(x => x.id === id),
    v = $('input[name="rl-mode"]:checked')?.value || 'new';
  let t;
  const part = r.part || analyzeArahan(r.text).part;
  if (v.startsWith('link:')) {
    t = S.tasks.find(x => x.id === v.slice(5));
    if (t.status === 'done') {
      t.status = 'todo';
      t.reopenReason = 'Arahan dosen baru';
      record('Pekerjaan dibuka lagi', t.title + ' · Arahan dosen baru');
    }
  } else
    t = plainTask({
      title: 'Tindak lanjuti arahan: ' + r.topic,
      part,
      phase: partPhase(part),
      source: 'revisi',
      reason: r.understanding?.maksud || '',
      doing: r.understanding?.langkah || '',
      deliverable: 'Bagian yang sudah kamu perbaiki sesuai arahan dosen.',
    });
  r.taskId = t.id;
  record('Arahan masuk ke Progres Aktif', r.topic + ' → ' + t.title);
  closeModal(true);
  reorderTasks(true);
  persist();
  render();
  toast(`Arahan tertaut ke “${t.title}”.`);
}
function revDoneModal(id) {
  const r = S.revisions.find(x => x.id === id);
  if (!r) return;
  modal(
    'Tandai sudah ditindaklanjuti',
    `<p class="small muted mb">${e(r.topic)}</p><div class="field"><label for="rv-done">Perubahan yang sudah dilakukan <span class="required-label">Wajib</span></label><textarea id="rv-done" rows="4" maxlength="800" placeholder="Contoh: Rumusan masalah Bab I kutulis ulang menjadi tiga pertanyaan, urutannya sama dengan kesimpulan Bab V."></textarea></div>${r.taskId ? '<p class="small">Status kartunya di Progres Aktif ikut berubah.</p>' : ''}`,
    B('Batal', 'close-modal') + B('Simpan', 'rev-done-save:' + id, 'primary'),
  );
}
function saveRevDone(id) {
  clearErrors();
  if (!checkRequired('rv-done', { min: 20, label: 'perubahan' })) return focusFirstError();
  const r = S.revisions.find(x => x.id === id);
  r.status = 'done';
  r.doneAt = isoToday();
  r.doneNote = capitalize($('#rv-done').value);
  record('Arahan ditindaklanjuti', r.topic);
  closeModal(true);
  persist();
  render();
  toast('Arahan ditandai sudah ditindaklanjuti.');
}
function revEditModal(id) {
  const r = S.revisions.find(x => x.id === id),
    u = r.understanding || {};
  modal(
    'Ubah pemahaman Alerin',
    `<p class="small muted mb">Catatan asli dosen tidak ikut berubah.</p>${field('ru-maksud', 'Maksud arahan', u.maksud, '', 400, 'textarea', '', false)}${field('ru-bagian', 'Bagian terdampak', u.bagian, '', 200, 'textarea', '', false)}${field('ru-langkah', 'Langkah perbaikan', u.langkah, '', 500, 'textarea', '', false)}`,
    B('Batal', 'close-modal') + B('Simpan', 'rev-edit-save:' + id, 'primary'),
  );
}
function saveRevEdit(id) {
  clearErrors();
  const ok = ['ru-maksud', 'ru-bagian', 'ru-langkah'].map(x => checkRequired(x)).every(Boolean);
  if (!ok) return focusFirstError();
  const r = S.revisions.find(x => x.id === id);
  r.understanding = {
    maksud: capitalize($('#ru-maksud').value),
    bagian: capitalize($('#ru-bagian').value),
    langkah: capitalize($('#ru-langkah').value),
    edited: true,
  };
  r.understood = true;
  record('Pemahaman arahan diubah', r.topic);
  closeModal(true);
  persist();
  render();
  toast('Pemahaman arahan diperbarui dan dianggap sudah kamu setujui.');
}
function revAskModal(id) {
  const r = S.revisions.find(x => x.id === id);
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

Object.assign(ACTIONS, {
  'add-revision': arg => {
    revisionModal(arg || null);
  },
  'rev-save': arg => {
    saveRevision(arg || null);
  },
  'rev-filter': arg => {
    S.revFilter = arg;
    persist();
    render();
  },
  'rev-ok': arg => {
    const r = S.revisions.find(x => x.id === arg);
    if (!r) return;
    r.understood = true;
    record('Pemahaman arahan disetujui', r.topic);
    persist();
    render();
    const t = r.taskId && S.tasks.find(x => x.id === r.taskId);
    toast(
      t
        ? `Pemahaman disetujui. Arahan tetap tertaut ke “${t.title}”.`
        : 'Pemahaman disetujui. Masukkan arahan ini ke Progres untuk menindaklanjutinya.',
    );
  },
  'rev-link': arg => {
    revLinkModal(arg);
  },
  'rev-link-save': arg => {
    saveRevLink(arg);
  },
  'rev-done': arg => {
    revDoneModal(arg);
  },
  'rev-done-save': arg => {
    saveRevDone(arg);
  },
  'rev-undo': arg => {
    const r = S.revisions.find(x => x.id === arg);
    r.status = 'open';
    r.doneAt = null;
    persist();
    render();
    toast('Arahan ditandai belum ditindaklanjuti.');
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
  'rev-del': arg => {
    modal(
      'Hapus arahan ini?',
      '<p>Catatan dosen dan pemahamannya dihapus dari Revisi Dosen. Kartu pekerjaan yang tertaut tetap ada.</p>',
      B('Batal', 'close-modal') + B('Hapus arahan', 'rev-del-ok:' + arg, 'danger'),
    );
  },
  'rev-del-ok': arg => {
    const r = S.revisions.find(x => x.id === arg);
    S.revisions = S.revisions.filter(x => x.id !== arg);
    record('Arahan dihapus', r?.topic || '');
    persist();
    closeModal(true);
    render();
    toast('Arahan dihapus.');
  },
});
