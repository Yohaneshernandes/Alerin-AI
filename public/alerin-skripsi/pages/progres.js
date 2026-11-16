'use strict';
/* Halaman progres. */
function relatedBlocks(t, compact = false) {
  const revs = taskRevs(t),
    fs = taskFindings(t);
  const revItem = r => {
    const kutipan = compact && r.text.length > 220 ? r.text.slice(0, 217) + '…' : r.text;
    const status =
      r.status === 'done'
        ? `<p class="small ok-line">${I('check')} Sudah ditindaklanjuti · ${dateLong(r.doneAt)}</p>`
        : !revUnderstood(r)
          ? `<p class="small wait-line">Pemahaman Alerin belum kamu setujui</p>`
          : '';
    return `<div class="v6-direction-excerpt"><p class="small muted">Catatan asli · Bimbingan ${dateLong(r.date)}</p><p>“${e(kutipan)}”</p>${compact ? '' : `<p class="small"><strong>Pemahaman:</strong> ${e(r.understanding?.maksud || '')}</p>`}${status}</div>`;
  };
  const allDone = revs.length && revs.every(r => r.status === 'done');
  const rev = `<section class="v6-linked-directions"><div class="between"><h4>Arahan dosen terkait (${revs.length})</h4>${revs.length ? badge(allDone ? 'Sudah ditindaklanjuti' : 'Menunggu tindak lanjut', allDone ? 'green' : 'amber') : ''}</div>${revs.length ? revs.map(revItem).join('') : '<p class="small muted">Belum ada arahan dosen untuk pekerjaan ini.</p>'}<div class="actions">${revs.length ? B('Lihat di Revisi Dosen', 'nav:revisi', 'text', 'link') : ''}${B('Tambah arahan', 'add-revision:' + t.id, 'text', 'plus')}</div></section>`;
  const fin = fs.length
    ? `<section class="v6-linked-directions"><h4>Temuan pemeriksaan terkait (${fs.length})</h4>${fs.map(f => `<div class="v6-direction-excerpt"><strong>${e(f.title)}</strong><p class="small">${e(f.fix)}</p><p class="small muted">${e(f.location || '')}</p></div>`).join('')}${B('Lihat Pemeriksaan', 'nav:hasil-periksa', 'text', 'link')}</section>`
    : '';
  return rev + fin;
}
/* Tombol "Catat Sebagai Selesai". Saat terkunci tetap bisa ditekan supaya alasannya muncul. */
function completeButton(t, cls, locked) {
  return locked
    ? `<button type="button" class="btn ${cls} locked" data-action="complete:${t.id}" aria-disabled="true">${I('check')}Catat Sebagai Selesai</button>`
    : B('Catat Sebagai Selesai', 'complete:' + t.id, cls, 'check');
}
function taskCard(t, slot = '') {
  const st = taskState(t),
    ph = +t.phase || 0,
    lead = slot === SLOTS[0];
  const crit = Array.isArray(t.criteria) ? t.criteria.join(' ') : t.criteria || '';
  const eyebrow =
    t.status === 'done' ? 'SELESAI DIKERJAKAN' : t.status === 'deferred' ? 'DITUNDA' : !slot ? 'MENUNGGU SLOT' : slot.toUpperCase();
  const nFiles = S.files.filter(f => f.context === 'task-' + t.id).length;
  let acts;
  if (t.status === 'done')
    acts = `<div class="actions mt">${B('Lihat Pekerjaan', 'task:' + t.id, 'primary', 'arrow')}${B('Buka Lagi', 'reopen:' + t.id, 'text')}</div><p class="small muted">Selesai menurut pengguna${taskRevs(t).length ? ' · sesuai arahan dosen' : ''}${t.completedAt ? ' · ' + dateLong(t.completedAt.slice(0, 10)) : ''}. Persetujuan pembimbing dicatat terpisah.</p>`;
  else if (t.status === 'deferred')
    acts = `<div class="actions mt">${B('Lanjutkan', 'restore:' + t.id, 'primary')}</div><p class="small muted">Ditunda${t.deferReason ? ' · ' + e(t.deferReason) : ''}${t.resumeDate ? ' · lanjut ' + dateLong(t.resumeDate) : ''}</p>`;
  else if (!slot)
    acts = `<div class="actions mt">${B('Lihat', 'task:' + t.id, '')}</div><p class="small muted">Masuk antrean karena sudah ada tiga pekerjaan aktif. Kartu ini naik otomatis saat ada slot kosong.</p>`;
  else {
    const block = completionBlock(t);
    const bantuan = !block
      ? ''
      : block.kind === 'arahan'
        ? `${block.text} Catat Sebagai Selesai terbuka setelah arahan di kartu ini ditandai sudah ditindaklanjuti.`
        : `${block.text} Lengkapi lewat tombol Kerjakan.`;
    acts = `<div class="actions mt">${B('Kerjakan', 'task:' + t.id, 'primary', 'arrow')}${completeButton(t, '', !!block)}${B('Tunda', 'defer:' + t.id, 'text')}</div>${bantuan ? `<p class="small muted help">${e(bantuan)}</p>` : ''}`;
  }
  return `<article class="task-card v6-task ${lead ? 'lead' : ''} ${t.status}" data-task="${e(t.id)}"><div class="between"><span class="eyebrow">${e(eyebrow)}</span>${badge(st[1], t.status === 'done' ? 'green' : st[0] === 'warn' ? 'amber' : 'blue')}</div><button class="sync-stage-link" data-action="peta-focus:${ph}">Tahap ${e(stageName(ph))}</button><h3>${e(t.title)}</h3>${t.part && PARTS[t.part] ? `<p class="small muted">${e(partLabel(t.part))}</p>` : ''}<dl class="v6-task-facts"><dt>Yang dikerjakan</dt><dd>${e(t.doing || t.reason || '')}</dd><dt>Hasil yang disiapkan</dt><dd>${e(t.deliverable || '')}</dd>${crit ? `<dt>Selesai bila</dt><dd>${e(crit)}</dd>` : ''}</dl><p class="small muted">Sumber: ${taskSource(t)} · ${nFiles} berkas bukti</p>${t.status === 'done' ? '' : relatedBlocks(t, true)}${acts}</article>`;
}
/* Empat tab hanya untuk tampilan. Status pekerjaan berubah lewat tombol kartu dan aturan kunci. */
const PROGRESS_TABS = [
  ['aktif', 'Aktif'],
  ['antre', 'Antrean'],
  ['selesai', 'Selesai Dikerjakan'],
  ['tunda', 'Ditunda'],
];
function progressLists() {
  const aktif = activeTasks();
  return {
    aktif,
    antre: S.tasks.filter(t => !['done', 'deferred'].includes(t.status) && !aktif.includes(t)),
    selesai: S.tasks.filter(t => t.status === 'done'),
    tunda: S.tasks.filter(t => t.status === 'deferred'),
  };
}
function progressShortcuts() {
  return `<section class="card mt"><h3>Perbarui konteks pekerjaan</h3><div class="actions mt">${B('Mulai Menyusun', S.title ? 'guide-view:guide' : 'nav:mulai', '', 'compass')}${B('Periksa Draf Terbaru', 'nav:periksa', '', 'document')}${B('Tambah Arahan Dosen', 'add-revision', '', 'edit')}${B('Dukungan Mentor', 'nav:mentor', 'text', 'people')}</div></section>`;
}
function activeSlots(list) {
  const kosong = [
    '',
    'Terisi otomatis dari antrean, temuan pemeriksaan, atau subbagian berikutnya.',
    'Untuk pekerjaan yang aman dikerjakan sambil menunggu dosen.',
  ];
  return SLOTS.map((nama, i) => {
    const t = list[i];
    if (t) return taskCard(t, slotName(t, i));
    return `<article class="task-card v6-task slot-empty"><div class="between"><span class="eyebrow">${e(nama.toUpperCase())}</span>${badge('Kosong', '')}</div><p class="small muted">Slot ini masih kosong. ${kosong[i]}</p></article>`;
  }).join('');
}
function progresPage() {
  const tabs = progressLists();
  if (!tabs[progressTab]) progressTab = 'aktif';
  const list = tabs[progressTab];
  const empty = {
    aktif: pageEmpty(
      'Belum ada pekerjaan aktif',
      'Pekerjaan muncul setelah kamu memilih judul, mengerjakan panduan, atau menambahkan temuan dan arahan dosen.',
      'nav:mulai',
      'Mulai Menyusun',
      'checklist',
    ),
    antre: '<div class="card empty"><p class="muted">Antrean kosong. Pekerjaan keempat dan seterusnya menunggu di sini.</p></div>',
    selesai: '<div class="card empty"><p class="muted">Belum ada pekerjaan yang dicatat selesai.</p></div>',
    tunda: '<div class="card empty"><p class="muted">Tidak ada pekerjaan yang ditunda.</p></div>',
  };
  const body = !list.length
    ? empty[progressTab]
    : `<div class="task-grid">${progressTab === 'aktif' ? activeSlots(list) : list.map(t => taskCard(t)).join('')}</div>`;
  return (
    pageHead('Progres Aktif', 'Kerjakan prioritasmu, diskusikan perbaikan, dan simpan bukti dalam satu alur.') +
    `<div class="sync-context"><div><strong>Tiga hal yang paling penting dikerjakan</strong><p>${tabs.aktif.length}/3 pekerjaan aktif. Arahan dosen dan temuan pemeriksaan terhubung ke pekerjaan yang sama.</p></div>${B('Buka Peta Skripsi', 'nav:peta', 'soft', 'map')}</div>` +
    `<div class="tabs v4-progress-tabs" role="tablist" aria-label="Status pekerjaan">${PROGRESS_TABS.map(([k, l]) =>
      B(`${l} (${tabs[k].length})`, 'progress-tab:' + k, progressTab === k ? 'primary' : 'text', '', `role="tab" aria-selected="${progressTab === k}"`),
    ).join('')}</div>` +
    `<div role="tabpanel" data-progress-list="${progressTab}">${body}</div>` +
    progressShortcuts()
  );
}
function ditundaPage() {
  const list = S.tasks.filter(t => t.status === 'deferred');
  return (
    pageHead('Pekerjaan ditunda', 'Isian dan bukti tetap tersimpan. Aktifkan kembali saat waktunya tepat.', 'progress-tab:aktif', 'Kembali ke progres', 'back') +
    (list.length
      ? `<div class="task-grid">${list.map(t => taskCard(t)).join('')}</div>`
      : `<div class="card empty">${I('pause')}<h3>Tidak ada pekerjaan yang ditunda</h3><p>Pekerjaan yang kamu tunda akan tetap tersedia di halaman ini.</p>${B('Lihat Progres Aktif', 'progress-tab:aktif', 'primary', 'checklist')}</div>`)
  );
}
function discussionReply(t, q) {
  const p = t.part && PARTS[t.part];
  const base = p
    ? `Untuk ${p.name.toLowerCase()}, mulai dari ${
        String(STEP_BY_PART[t.part] || '')
          .charAt(0)
          .toLowerCase() + String(STEP_BY_PART[t.part] || '').slice(1)
      }`
    : `Mulai dari langkah pertama di kartu ini: ${t.steps?.[0] || t.doing || 'tuliskan bagian yang ingin kamu ubah'}.`;
  return `${base} Coba tulis satu paragraf dengan kalimatmu sendiri, lalu kirim ke sini bila ingin dibahas lagi.${/contoh|buatkan|tuliskan/i.test(q) ? ' Alerin tidak menuliskan bagian skripsimu, tetapi bisa menunjukkan arah dan memeriksa tulisanmu.' : ''}`;
}
let taskTab = 'work';
function showTask(id, alasan = '') {
  const t = S.tasks.find(x => x.id === id);
  if (!t) return;
  ensureGuide();
  if (alasan) taskTab = 'work';
  const st = taskState(t),
    ph = +t.phase || 0,
    p = t.part && PARTS[t.part],
    v = p ? S.guide.fields[t.part] || {} : {},
    revs = taskRevs(t);
  const meta = (fid, val, max, opt) =>
    `<div class="field-meta"><span>${opt ? 'Boleh dilengkapi kemudian.' : ''}</span><span data-count="${fid}">${String(val || '').length}/${max}</span></div>`;
  const crit = Array.isArray(t.criteria) ? t.criteria.join(' ') : t.criteria || '';
  const facts = `<div class="v6-task-facts"><strong>Alasan prioritas</strong><p>${e(t.reason || t.doing || '')}</p>${t.doing && t.doing !== t.reason ? `<strong>Yang dikerjakan</strong><p>${e(t.doing)}</p>` : ''}<strong>Hasil yang disiapkan</strong><p>${e(t.deliverable || '')}</p>${crit ? `<strong>Selesai bila</strong><p>${e(crit)}</p>` : ''}</div>`;
  const steps = (t.steps || []).length
    ? `<h3 class="mt">Periksa hasil pekerjaanmu</h3><div class="checklist">${t.steps.map((s, i) => `<label class="checkbox"><input type="checkbox" name="task-check" value="${i}" ${(t.checks || []).includes(i) ? 'checked' : ''}>${e(s)}</label>`).join('')}</div>`
    : '';
  const guide = p
    ? `<div class="between mt"><h3>Isian panduan · ${e(p.name)}</h3>${B('Buka di Mulai Skripsi', 'guide-part:' + t.part, 'text', 'arrow')}</div>${p.fields
        .map((f, i) => {
          const [label, opt] = f.split('|');
          const fid = 'guide-' + t.part + '-' + i;
          return `<div class="field"><label for="${fid}">${e(label)}${opt ? OPT : REQ}</label><textarea id="${fid}" maxlength="1500" data-guide="${t.part}:f${i}" rows="3">${e(v['f' + i] || '')}</textarea>${meta(fid, v['f' + i], 1500, !!opt)}</div>`;
        })
        .join('')}`
    : '';
  const ev = `<div class="field"><label for="task-evidence">Bukti perubahan atau hasil pekerjaan${p ? OPT : REQ}</label><textarea id="task-evidence" maxlength="1500" placeholder="Catat apa yang berubah, dasar, dan lokasi buktinya." rows="3">${e(t.evidence || '')}</textarea>${meta('task-evidence', t.evidence, 1500, !!p)}</div>${uploadZone('task-' + id, 'Tambahkan bukti pekerjaan', 'PDF, DOCX, JPG, PNG')}${fileList('task-' + id)}`;
  const catatan = t.koreksi || [];
  const korStatus = !t.koreksi ? 'belum diminta' : !catatan.length ? 'tidak ada catatan' : t.koreksiOk ? `${catatan.length} catatan · sudah ditinjau` : `${catatan.length} catatan · perlu ditinjau`;
  const revStatus = !revs.length
    ? 'belum ada arahan tertaut'
    : revs.every(r => r.status === 'done')
      ? 'sudah ditindaklanjuti'
      : `${revs.filter(r => r.status !== 'done').length} arahan menunggu tindak lanjut`;
  const korList = catatan.length
    ? `<div class="v3-guidance"><span class="eyebrow">KOREKSI ALERIN · CONTOH, BELUM ANALISIS AI</span>${outputRows(catatan.map(f => [f.title, f.fix]), false)}${t.koreksiOk ? `<p class="small ok-line">${I('check')} Catatan koreksi sudah kamu tinjau</p>` : `<div class="actions">${B('Tandai Sudah Ditinjau', 'task-koreksi-ok:' + id, 'soft', 'check')}</div>`}</div>`
    : '';
  const status = `<div class="v6-work-status" id="ws-koreksi">${revs.length ? B('Tinjau Revisi Dosen', 'nav:revisi', 'text') : ''}<p>Koreksi Alerin: <strong>${korStatus}</strong></p><p>Revisi Dosen: <strong>${revStatus}</strong></p></div>${korList}`;
  const banner = alasan ? `<div class="mt">${note(`<strong>Belum bisa dicatat selesai.</strong> ${e(alasan)}`, 'amber')}</div>` : '';
  const work = banner + facts + steps + relatedBlocks(t) + guide + ev + status;
  const disc = `<section class="v6-discussion"><p class="small muted">Tanyakan hal yang membuatmu ragu di pekerjaan ini. Jawaban berupa contoh panduan lokal, belum terhubung ke model AI.</p><div class="v6-discussion-log" role="log">${(t.discussion || []).map(m => `<div class="chat-message ${m.who === 'user' ? 'user' : ''}">${e(m.text)}</div>`).join('')}</div><div class="field disc-input"><label for="disc-text">Pertanyaan atau catatan tambahan <span>Opsional</span></label><textarea id="disc-text" maxlength="500" placeholder="Contoh: Rumusan masalahku sudah cukup spesifik?" rows="3" data-nocap="1"></textarea>${meta('disc-text', '', 500, true)}</div><div class="actions">${B('Kirim Pertanyaan', 'task-disc:' + id, 'primary', 'send')}${B('Konsultasikan ke Mentor', 'nav:mentor', 'text', 'people')}</div></section>`;
  const head = `<div class="between"><span class="pill blue">Tahap ${e(stageName(ph))}${p ? ' · ' + e(p.name) : ''}</span>${badge(st[1], t.status === 'done' ? 'green' : st[0] === 'warn' ? 'amber' : '')}</div><h2 class="workspace-title mt">${e(t.title)}</h2><p class="small muted">Sumber: ${taskSource(t)}</p><div class="tabs v6-work-tabs">${B('Pengerjaan', 'task-tab:' + id + ':work', taskTab === 'work' ? 'primary' : 'text')}${B('Diskusi terkait pekerjaan', 'task-tab:' + id + ':disc', taskTab === 'disc' ? 'primary' : 'text')}</div>`;
  const terkunci = completionBlock(t)?.kind === 'arahan';
  modal(
    'Ruang kerja penelitian',
    head + (taskTab === 'disc' ? disc : work),
    `<div class="workspace-actions">${t.status === 'done' ? B('Kembali ke Progres', 'close-modal') : completeButton(t, 'primary', terkunci)}${B('Simpan untuk Ditinjau', 'task-save:' + id, '', 'save')}${B('Tambahkan Revisi Dosen', 'add-revision:' + id, '', 'edit')}${B('Periksa Pekerjaan', 'task-koreksi:' + id, '', 'checklist')}</div>`,
    true,
  );
  $('#overlay-root .modal')?.classList.add('workspace-modal');
}
function collectTask(id) {
  const t = S.tasks.find(x => x.id === id);
  if (!t) return null;
  if ($('#task-evidence')) t.evidence = $('#task-evidence').value.trim();
  if ($$('[name="task-check"]').length) t.checks = $$('[name="task-check"]:checked').map(x => +x.value);
  return t;
}
/* Menolak dengan alasan yang sebenarnya; pesan muncul di bawah kolom yang bermasalah. */
function completeTask(id) {
  const t = collectTask(id);
  if (!t) return;
  persist();
  const block = completionBlock(t);
  if (!block) {
    modal(
      'Catat pekerjaan ini selesai?',
      `<p><strong>${e(t.title)}</strong></p><p>Statusnya: Selesai menurut pengguna.</p><p class="small muted">Kamu bisa membukanya lagi kapan saja.</p>`,
      B('Batal', 'close-modal') + B('Catat Selesai', 'confirm-complete:' + id, 'primary'),
    );
    return;
  }
  if (block.kind === 'arahan') {
    const belum = taskPendingRevs(t).some(r => !revUnderstood(r));
    modal(
      'Belum bisa dicatat selesai',
      `<p>${e(block.text)}</p><p class="small muted">${belum ? 'Setujui dulu pemahaman Alerin atas arahan itu, lalu tandai sudah ditindaklanjuti di Revisi Dosen.' : 'Tandai arahannya sebagai sudah ditindaklanjuti di Revisi Dosen dulu.'}</p>`,
      B('Kembali', 'close-modal') + B('Lihat di Revisi Dosen', 'nav:revisi', 'primary'),
    );
    return;
  }
  showTask(id, block.text);
  if (block.kind === 'kolom') {
    const ids = block.empty.length ? block.empty : PARTS[t.part].fields.map((f, i) => i).filter(i => !PARTS[t.part].fields[i].includes('|optional'));
    for (const i of ids)
      fieldError(
        `guide-${t.part}-${i}`,
        block.empty.length ? 'Kolom ini masih kosong. Isi dulu sebelum mencatat selesai.' : 'Tulis lebih jelas dengan kalimat biasa.',
      );
  } else if (block.kind === 'bukti')
    fieldError('task-evidence', 'Tulis bukti perubahan minimal 20 karakter, atau lampirkan berkas.');
  else $('#ws-koreksi')?.scrollIntoView({ block: 'center' });
  focusFirstError();
}
function confirmComplete(id) {
  const t = S.tasks.find(x => x.id === id);
  if (!t) return;
  t.status = 'done';
  t.completedAt = new Date().toISOString();
  t.reopenReason = '';
  for (const f of taskFindings(t)) f.resolved = true;
  fillSlots();
  reorderTasks(false);
  record('Pekerjaan selesai', t.title + ' · menurut pengguna');
  synchronizeResearch();
  persist();
  closeModal(true);
  render();
  const nx = t.part && nextPart(t.part),
    has = nx && S.tasks.some(x => x.part === nx && x.status !== 'done');
  modal(
    'Pekerjaan dicatat selesai',
    `<p><strong>${e(t.title)}</strong> dicatat selesai menurut pengguna.</p>${nx && !has ? `<p>Langkah berikutnya: <strong>${e(partLabel(nx))}</strong>.</p>` : ''}`,
    B('Tutup', 'close-modal') +
      (nx && !has
        ? B('Kerjakan ' + PARTS[nx].name, 'guide-next:' + nx, 'primary')
        : B('Lihat Progres Aktif', 'progress-tab:aktif', 'primary')),
  );
}

Object.assign(ACTIONS, {
  defer: arg => {
    deferTask(arg);
  },
  'save-defer': async arg => {
    const t = S.tasks.find(t => t.id === arg);
    t.beforeDefer = t.status;
    t.status = 'deferred';
    t.deferReason = $('#defer-reason').value;
    t.resumeDate = $('#defer-date').value;
    fillSlots();
    record('Pekerjaan ditunda', t.title);
    synchronizeResearch();
    if (persist()) {
      closeModal(true);
      toast('Pekerjaan tersimpan di daftar Ditunda.');
    }
    render();
  },
  restore: arg => {
    restoreTask(arg);
  },
  'confirm-restore': async arg => {
    const t = S.tasks.find(t => t.id === arg);
    const replace = $('#replace-task')?.value;
    if (replace) {
      const old = S.tasks.find(t => t.id === replace);
      old.beforeDefer = old.status;
      old.status = 'deferred';
      old.deferReason = 'Ditunda saat mengaktifkan kembali pekerjaan lain.';
    }
    t.status = t.beforeDefer && t.beforeDefer !== 'deferred' ? t.beforeDefer : 'todo';
    record('Pekerjaan diaktifkan kembali', t.title);
    synchronizeResearch();
    persist();
    closeModal(true);
    go('progres');
    render();
    toast('Antrean aktif diperbarui. Maksimal tiga pekerjaan.');
  },
  'order-keep': () => {
    pendingOrder = null;
    persist();
    closeModal(true);
    render();
    toast('Urutan lama dipertahankan.');
  },
  'order-save': () => {
    const ids = pendingOrder || [];
    S.tasks = ids
      .map(id => S.tasks.find(t => t.id === id))
      .filter(Boolean)
      .concat(S.tasks.filter(t => !ids.includes(t.id)));
    pendingOrder = null;
    fillSlots();
    persist();
    closeModal(true);
    render();
    toast('Urutan Progres Aktif diperbarui.');
  },
  task: arg => {
    taskTab = 'work';
    showTask(arg);
  },
  'task-tab': arg => {
    const [id, tab] = arg.split(':');
    collectTask(id);
    persist();
    taskTab = tab === 'disc' ? 'disc' : 'work';
    showTask(id);
  },
  'task-save': arg => {
    collectTask(arg);
    persist();
    closeModal(true);
    render();
    toast('Pekerjaan tersimpan.');
  },
  complete: arg => {
    completeTask(arg);
  },
  'confirm-complete': arg => {
    confirmComplete(arg);
  },
  reopen: arg => {
    const t = S.tasks.find(x => x.id === arg);
    t.status = activeTasks().length >= 3 ? 'queued' : 'todo';
    t.reopenReason = 'Dibuka lagi olehmu';
    t.completedAt = null;
    record('Pekerjaan dibuka lagi', t.title);
    synchronizeResearch();
    persist();
    progressTab = 'aktif';
    render();
    toast('Pekerjaan dibuka lagi.');
  },
  'task-disc': arg => {
    const t = collectTask(arg),
      q = $('#disc-text')?.value.trim();
    if (!q) {
      clearErrors();
      fieldError('disc-text', 'Tulis pertanyaanmu dulu.');
      $('#disc-text')?.focus();
      return;
    }
    (t.discussion ??= []).push({ who: 'user', text: q }, { who: 'alerin', text: discussionReply(t, q) });
    persist();
    showTask(arg);
    $('#disc-text')?.focus();
  },
  'task-koreksi': arg => {
    const t = collectTask(arg);
    if (taskTab !== 'work') {
      taskTab = 'work';
      showTask(arg);
    }
    const v = t.part ? Object.values(S.guide.fields[t.part] || {}).join('\n') : '';
    const text = [v, t.evidence].join('\n').trim();
    if (text.replace(/\s/g, '').length < 20) {
      clearErrors();
      fieldError('task-evidence', 'Tulis isian atau bukti dulu, minimal satu kalimat, supaya bisa dikoreksi.');
      return focusFirstError();
    }
    t.koreksi = findIssues(text, { chapters: [], title: '', method: methodKind() }).map(f => ({ title: f.title, fix: f.fix }));
    if (isAsal(text.slice(0, 120)))
      t.koreksi.unshift({ title: 'Isian belum bisa dipahami', fix: 'Tulis ulang dengan kalimat biasa.' });
    t.koreksiOk = false;
    record('Koreksi Alerin diminta', `${t.title} · ${t.koreksi.length} catatan`);
    persist();
    showTask(arg);
    $('#ws-koreksi')?.scrollIntoView({ block: 'nearest' });
  },
  'task-koreksi-ok': arg => {
    const t = collectTask(arg);
    t.koreksiOk = true;
    persist();
    showTask(arg);
    $('#ws-koreksi')?.scrollIntoView({ block: 'nearest' });
    toast('Catatan koreksi ditandai sudah ditinjau.');
  },
  'progress-tab': arg => {
    progressTab = arg;
    closeModal(true);
    if (route !== 'progres') go('progres');
    else render();
  },
});
