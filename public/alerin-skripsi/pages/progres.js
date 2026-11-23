'use strict';
/* Halaman Progres Aktif (Revisi 18 November).
   Mahasiswa melihat apa yang bisa dikerjakan sekarang, apa yang masih menunggu, mengapa urutannya demikian,
   dan hasil seperti apa yang dianggap selesai. Kartu antrean dan kartu yang menunggu prasyarat hanya bisa
   dipratinjau; pengerjaan, Tinjauan Alerin, dan penyelesaian tersedia setelah kartu aktif dan siap. */
function relatedBlocks(t, compact = false, inModal = false) {
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
  const rev = `<section class="v6-linked-directions"><div class="between"><h4>Arahan dosen terkait (${revs.length})</h4>${revs.length ? badge(allDone ? 'Sudah ditindaklanjuti' : 'Menunggu tindak lanjut', allDone ? 'green' : 'amber') : ''}</div>${revs.length ? revs.map(revItem).join('') : '<p class="small muted">Tidak ada arahan tertaut.</p>'}<div class="actions">${revs.length ? B('Lihat di Revisi Dosen', 'nav:revisi', 'text', 'link') : ''}${inModal || ['done', 'queued'].includes(t.status) ? '' : B('Tambah arahan', 'add-revision:' + t.id, 'text', 'plus')}</div></section>`;
  const fin = fs.length
    ? `<section class="v6-linked-directions"><h4>Temuan pemeriksaan terkait (${fs.length})</h4>${fs.map(f => `<div class="v6-direction-excerpt"><strong>${e(f.title)}</strong><p class="small">${e(f.fix)}</p><p class="small muted">${e(f.location || '')}</p></div>`).join('')}${B('Lihat Pemeriksaan', 'nav:hasil-periksa', 'text', 'link')}</section>`
    : '';
  return rev + fin;
}
/* Tombol "Catat Sebagai Selesai". Saat terkunci tetap bisa ditekan supaya syarat yang belum terpenuhi muncul. */
function completeButton(t, cls, locked) {
  return locked
    ? `<button type="button" class="btn ${cls} locked" data-action="complete:${t.id}" aria-disabled="true">${I('check')}Catat Sebagai Selesai</button>`
    : B('Catat Sebagai Selesai', 'complete:' + t.id, cls, 'check');
}
const critList = t => taskCriteria(t);
/* Fakta tugas yang selalu tampil sebelum pengguna mengisi hasil: Yang Dikerjakan, Hasil yang Disiapkan, Selesai Bila. */
function taskFacts(t, tag = 'dl') {
  const crit = critList(t);
  const items = [
    ['Yang dikerjakan', e(t.doing || t.reason || '')],
    ['Hasil yang disiapkan', e(t.deliverable || '')],
    ['Selesai bila', crit.length ? `<ul class="b19-criteria">${crit.map(c => `<li>${e(c)}</li>`).join('')}</ul>` : 'Belum ada kriteria.'],
  ];
  return tag === 'dl'
    ? `<dl class="v6-task-facts">${items.map(([h, v]) => `<dt>${h}</dt><dd>${v}</dd>`).join('')}</dl>`
    : `<div class="v6-task-facts">${items.map(([h, v]) => `<strong>${h}</strong><div class="b19-fact">${v}</div>`).join('')}</div>`;
}
function approvalLine(t) {
  return t.approval
    ? `<p class="small ok-line">${I('check')} Disetujui pembimbing · ${dateLong(t.approval.date)} · dicatat pengguna</p>`
    : `<p class="small muted">Persetujuan dosen: belum dicatat. Selesai Dikerjakan tidak sama dengan persetujuan dosen.</p>`;
}
function taskCard(t, role = '') {
  const st = taskState(t),
    ph = +t.phase || 0,
    ready = taskReady(t),
    active = !!role;
  const eyebrow = t.status === 'done' ? 'SELESAI DIKERJAKAN' : t.status === 'deferred' ? 'DITUNDA' : active ? role.toUpperCase() : 'ANTREAN';
  const nFiles = S.files.filter(f => f.context === 'task-' + t.id).length;
  let acts;
  if (t.status === 'done')
    acts = `<div class="actions mt">${B('Lihat Pekerjaan', 'task:' + t.id, 'primary', 'arrow')}${B('Buka Lagi', 'reopen:' + t.id, 'text')}${t.approval ? '' : B('Catat Persetujuan Dosen', 'approve:' + t.id, 'text', 'check')}</div><p class="small muted">Selesai Dikerjakan${t.completedAt ? ' · ' + dateLong(t.completedAt.slice(0, 10)) : ''}.</p>${approvalLine(t)}`;
  else if (t.status === 'deferred')
    acts = `<div class="actions mt">${B('Lanjutkan', 'restore:' + t.id, 'primary', 'refresh')}${B('Lihat', 'task-preview:' + t.id, 'text')}</div><p class="small muted">Ditunda${t.deferReason ? ' · ' + e(t.deferReason) : ''}${t.resumeDate ? ' · rencana lanjut ' + dateLong(t.resumeDate) : ''}</p>`;
  else if (!active) acts = `<div class="actions mt">${B('Lihat', 'task-preview:' + t.id, '', 'arrow')}</div><p class="small muted">Pratinjau saja. Pengerjaan, pemeriksaan, dan penyelesaian tersedia setelah kartu aktif dan siap dikerjakan.</p>`;
  else if (!ready)
    acts = `<div class="actions mt">${B('Lihat Detail', 'task-preview:' + t.id, '', 'arrow')}${completeButton(t, '', true)}${B('Tunda', 'defer:' + t.id, 'text')}</div><p class="small muted help">Periksa Pekerjaan dan Catat Sebagai Selesai terbuka setelah prasyaratnya selesai.</p>`;
  else {
    const block = completionBlock(t);
    acts = `<div class="actions mt">${B('Kerjakan', 'task:' + t.id, 'primary', 'arrow')}${completeButton(t, '', !!block)}${B('Tunda', 'defer:' + t.id, 'text')}</div>${block ? `<p class="small muted help"><strong>Belum bisa dicatat selesai:</strong> ${e(block.text)}</p>` : ''}`;
  }
  const reason = priorityReason(t, role),
    early = earlierStageNote(t);
  const limit = t.kind === 'parallel' && t.limit && t.status !== 'done' ? `<p class="small b19-limit"><strong>Batas pekerjaan:</strong> ${e(t.limit)}</p>` : '';
  return `<article class="task-card v6-task ${role === SLOTS[0] ? 'lead' : ''} ${t.status} ${!ready && t.status !== 'done' ? 'b19-waiting' : ''}" data-task="${e(t.id)}"><div class="between"><span class="eyebrow">${e(eyebrow)}</span>${badge(st[1], t.status === 'done' ? 'green' : st[0] === 'warn' ? 'amber' : 'blue')}</div><button class="sync-stage-link" data-action="peta-focus:${ph}">Tahap ${e(stageName(ph))}</button><h3>${e(t.title)}</h3><p class="small muted b19-meta">Bagian: ${e(taskBagian(t))} · Sumber: ${e(taskSource(t))} · ${nFiles} berkas bukti</p>${reason ? `<p class="small b19-reason"><strong>Alasan prioritas:</strong> ${e(reason)}</p>` : ''}${early ? `<p class="small muted b19-early">${e(early)}</p>` : ''}${limit}${taskFacts(t)}${t.status === 'done' ? '' : relatedBlocks(t, true)}${acts}</article>`;
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
  /* Tambah arahan ada di setiap kartu dan Dukungan Mentor ada di sidebar, jadi tidak diulang di sini. */
  return `<section class="card mt"><h3>Perbarui konteks pekerjaan</h3><div class="actions mt">${B('Mulai Menyusun', S.title ? 'guide-view:guide' : 'nav:mulai', '', 'compass')}${B('Periksa Draf Terbaru', 'nav:periksa', '', 'document')}</div></section>`;
}
/* Tiga slot: Prioritas Utama, Prioritas Berikutnya, Pekerjaan Paralel. Slot tanpa calon yang siap dibiarkan kosong. */
function activeSlots(list) {
  const r = slotRoles(list),
    cells = [...(r.pu ? [[r.pu, SLOTS[0]]] : []), ...r.pb.map(t => [t, SLOTS[1]]), ...r.par.map(t => [t, SLOTS[2]])];
  const waitingQ = S.tasks.filter(t => t.status === 'queued' && !taskReady(t));
  const emptyWhy = waitingQ.length
    ? `Belum ada pekerjaan di antrean yang siap dikerjakan. “${waitingQ[0].title}” masih ${waitLabel(waitingQ[0]).charAt(0).toLowerCase() + waitLabel(waitingQ[0]).slice(1)}.`
    : 'Belum ada pekerjaan di antrean yang siap dikerjakan, jadi slot ini dibiarkan kosong.';
  const want = [SLOTS[1], SLOTS[2]].filter(n => !cells.some(c => c[1] === n));
  const pads = [];
  while (cells.length + pads.length < 3) pads.push(want.shift() || 'Slot kosong');
  const readyPar = r.par.find(taskReady);
  const noPu = !r.pu && list.length
    ? `<div class="mb">${note(`<strong>Belum ada Prioritas Utama yang siap dikerjakan.</strong> ${r.pb[0] ? e(`“${r.pb[0].title}” ${waitLabel(r.pb[0]).charAt(0).toLowerCase() + waitLabel(r.pb[0]).slice(1)}.`) : ''} ${readyPar ? e(`Kerjakan dulu “${readyPar.title}” di slot Pekerjaan Paralel.`) : ''}`, 'amber')}</div>`
    : '';
  return (
    noPu +
    `<div class="task-grid">${cells.map(([t, n]) => taskCard(t, n)).join('')}${pads
      .map(
        n =>
          `<article class="task-card v6-task slot-empty"><div class="between"><span class="eyebrow">${e(n.toUpperCase())}</span>${badge('Kosong', '')}</div><p class="small muted">${e(n === SLOTS[2] && !waitingQ.length ? 'Slot untuk pekerjaan yang aman dikerjakan sambil menunggu. Belum ada calon yang siap.' : emptyWhy)}</p></article>`,
      )
      .join('')}</div>`
  );
}
function progresGuideCard() {
  if (S.settings.hideProgresGuide) return '';
  return `
    <section class="card b18-progres-guide" aria-label="Cara membaca Progres Aktif">
      <div class="b18-guide-header">
        <div class="b18-guide-header-text">
          <h2>Cara membaca Progres Aktif</h2>
          <p>Pahami urutan prioritas agar pengerjaan skripsi tetap fokus, teratur, dan selesai tepat waktu.</p>
        </div>
        <button type="button" class="btn b18-btn-mengerti" data-action="dismiss-progres-guide">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3.33 8.5L6.67 11.5L12.67 4.5" stroke="#125AB5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Mengerti</span>
        </button>
      </div>
      <div class="b18-guide-cards">
        <div class="b18-guide-card">
          <div class="b18-guide-bar"></div>
          <div class="b18-guide-card-content">
            <div class="b18-guide-card-head">
              <div class="b18-guide-icon-box">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="#125AB5" stroke-width="1.33"/>
                  <circle cx="8" cy="8" r="3.5" stroke="#125AB5" stroke-width="1.33"/>
                  <circle cx="8" cy="8" r="1" fill="#125AB5"/>
                </svg>
              </div>
              <span class="b18-guide-badge">1 · PRIORITAS UTAMA</span>
            </div>
            <p class="b18-guide-desc">Pekerjaan yang siap dikerjakan sekarang dan paling menentukan langkah berikutnya. Alerin memilihnya dari pekerjaan yang membuka pekerjaan lain, arahan dosen yang menghambat, atau tenggat yang paling dekat.</p>
          </div>
        </div>
        <div class="b18-guide-card">
          <div class="b18-guide-bar"></div>
          <div class="b18-guide-card-content">
            <div class="b18-guide-card-head">
              <div class="b18-guide-icon-box">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12" stroke="#125AB5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="b18-guide-badge">2 · PRIORITAS BERIKUTNYA</span>
            </div>
            <p class="b18-guide-desc">Pekerjaan lanjutan yang paling relevan setelah Prioritas Utama. Kartunya bisa langsung dikerjakan, atau masih menunggu pekerjaan lain selesai. Selama menunggu, detailnya bisa dilihat, tetapi Periksa Pekerjaan dan Catat Sebagai Selesai baru terbuka setelah prasyaratnya selesai.</p>
          </div>
        </div>
        <div class="b18-guide-card">
          <div class="b18-guide-bar"></div>
          <div class="b18-guide-card-content">
            <div class="b18-guide-card-head">
              <div class="b18-guide-icon-box">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 5L8 2L14 5L8 8L2 5Z" stroke="#125AB5" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 8.5L8 11.5L14 8.5" stroke="#125AB5" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12L8 15L14 12" stroke="#125AB5" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="b18-guide-badge">3 · PEKERJAAN PARALEL</span>
            </div>
            <p class="b18-guide-desc">Pekerjaan yang bisa dicicil kapan saja tanpa menunggu pekerjaan lain, misalnya sambil menunggu tanggapan dosen. Mengerjakannya tidak menggeser Prioritas Utama. Kalau sebagian hasilnya masih bergantung pada pekerjaan lain, batasnya ditulis di kartu.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function progresPositionStrip() {
  const st = stageInfo();
  const title = st.confirmed ? positionLabel(st.idx) : 'Pilih Tahap Terakhir';
  const meta = st.confirmed ? positionSource() : 'Belum dikonfirmasi';
  return `
    <section class="card b18-progres-pos-strip" aria-label="Posisi Penelitian">
      <div class="b18-pos-strip-text">
        <span class="b18-pos-eyebrow">POSISI PENELITIANMU</span>
        <strong class="b18-pos-strong">${e(title)}</strong>
        <span class="b18-pos-meta">${e(meta)}</span>
      </div>
      <button type="button" class="btn b18-pos-btn" data-action="pos-edit">
        <span>Perbarui Posisi</span>
      </button>
    </section>
  `;
}

function progresSyncContext(tabs) {
  return `
    <div class="card b18-sync-context" aria-label="Konteks pekerjaan penting">
      <div class="b18-sync-text">
        <strong>Tiga hal yang paling penting dikerjakan</strong>
        <p>${tabs.aktif.length}/3 pekerjaan aktif · ${tabs.antre.length} di antrean. Arahan dosen dan temuan pemeriksaan terhubung ke pekerjaan yang sama.</p>
      </div>
      <button type="button" class="btn b18-btn-peta" data-action="nav:peta">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#125AB5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
          <line x1="8" y1="2" x2="8" y2="18"></line>
          <line x1="16" y1="6" x2="16" y2="22"></line>
        </svg>
        <span>Buka Peta Skripsi</span>
      </button>
    </div>
  `;
}

function progresTabsBar(tabs) {
  return `
    <div class="tabs b18-progres-tabs" role="tablist" aria-label="Status pekerjaan">
      ${PROGRESS_TABS.map(([k, l]) => `
        <button type="button" class="b18-tab-btn ${progressTab === k ? 'active' : ''}" data-action="progress-tab:${k}" role="tab" aria-selected="${progressTab === k}">
          <span>${l} (${tabs[k].length})</span>
        </button>
      `).join('')}
    </div>
  `;
}

function progresEmptyCard(kind, hasTasks) {
  if (kind === 'aktif') {
    if (!hasTasks) {
      return `
        <div class="card b18-progres-empty" aria-label="Belum ada pekerjaan">
          <div class="b18-empty-icon-wrap">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#9BAAC1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <polyline points="3 6 4 7 6 5"></polyline>
              <polyline points="3 12 4 13 6 11"></polyline>
              <polyline points="3 18 4 19 6 17"></polyline>
            </svg>
          </div>
          <h3>Belum ada pekerjaan</h3>
          <p>Pekerjaan muncul di sini dari rencana penelitian yang kamu pilih di Mulai Skripsi, <br/>temuan pemeriksaan yang kamu jadikan pekerjaan, atau arahan dosen yang sudah dikonfirmasi.</p>
          <button type="button" class="btn primary b18-btn-empty-start" data-action="nav:mulai">
            <span>Mulai Skripsi</span>
          </button>
        </div>
      `;
    }
    return `
      <div class="card b18-progres-empty" aria-label="Tidak ada pekerjaan aktif">
        <div class="b18-empty-icon-wrap">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#9BAAC1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <polyline points="3 6 4 7 6 5"></polyline>
            <polyline points="3 12 4 13 6 11"></polyline>
            <polyline points="3 18 4 19 6 17"></polyline>
          </svg>
        </div>
        <h3>Tidak ada pekerjaan aktif</h3>
        <p>Pekerjaan yang tersisa sudah selesai, ditunda, atau masih menunggu prasyarat.<br/>Lihat tab Antrean dan Ditunda.</p>
      </div>
    `;
  }
  if (kind === 'antre') {
    return `
      <div class="card b18-progres-empty" aria-label="Antrean kosong">
        <div class="b18-empty-icon-wrap">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#9BAAC1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <h3>Antrean kosong</h3>
        <p>Pekerjaan yang belum mendapat slot atau masih menunggu prasyarat tampil di sini.</p>
      </div>
    `;
  }
  if (kind === 'selesai') {
    return `
      <div class="card b18-progres-empty" aria-label="Belum ada pekerjaan selesai">
        <div class="b18-empty-icon-wrap">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#9BAAC1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3>Belum ada pekerjaan yang dicatat Selesai Dikerjakan</h3>
        <p>Pekerjaan yang kamu catat Selesai Dikerjakan akan tampil di sini sebagai riwayat pencapaian.</p>
      </div>
    `;
  }
  return `
    <div class="card b18-progres-empty" aria-label="Tidak ada pekerjaan ditunda">
      <div class="b18-empty-icon-wrap">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#9BAAC1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="10" y1="15" x2="10" y2="9"></line>
          <line x1="14" y1="15" x2="14" y2="9"></line>
        </svg>
      </div>
      <h3>Tidak ada pekerjaan yang ditunda</h3>
      <p>Pekerjaan yang kamu tunda sementara waktu akan tersimpan aman di sini.</p>
    </div>
  `;
}

function progresPage() {
  if (S.title && activeTasks().length < 3) {
    const n = S.tasks.length;
    fillSlots();
    if (S.tasks.length !== n) persist();
  }
  const tabs = progressLists();
  if (!tabs[progressTab]) progressTab = 'aktif';
  const list = tabs[progressTab];
  const body = !list.length
    ? progresEmptyCard(progressTab, S.tasks.length)
    : progressTab === 'aktif'
      ? activeSlots(list)
      : `<div class="task-grid">${list.map(t => taskCard(t)).join('')}</div>`;
  const sim = S.sample
    ? `<div class="b19-simbar">${badge('Mode Simulasi', 'amber')}<span>Contoh penelitian Naya. Arahan reliabilitas, tiga kartu aktif, dan antrean adalah skenario contoh, bukan data penelitianmu. Mulai ruang kosong lewat Pengaturan.</span></div>`
    : '';
  return `
    <div class="b18-progres-page-wrap">
      <div class="mulai-page-head b18-progres-head">
        <h1>Progres Aktif</h1>
        <p>Kerjakan prioritasmu, diskusikan perbaikan, dan simpan bukti dalam satu alur.</p>
      </div>
      ${sim}
      ${progresGuideCard()}
      ${progresPositionStrip()}
      ${progresSyncContext(tabs)}
      ${progresTabsBar(tabs)}
      <div role="tabpanel" data-progress-list="${progressTab}">${body}</div>
      ${tabs.aktif.length ? progressShortcuts() : ''}
    </div>
  `;
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
/* Dari fitur lain, pengguna diantar ke halaman Progres Aktif dan kartunya disorot.
   Ruang kerja penelitian hanya dibuka dari Progres Aktif (QC 17 November). */
let pendingTaskFocus = null;
function tabOfTask(t) {
  const tabs = progressLists();
  return Object.keys(tabs).find(k => tabs[k].includes(t)) || 'aktif';
}
function highlightTask(id) {
  const card = document.querySelector(`[data-task="${CSS.escape(id)}"]`);
  if (!card) return;
  card.classList.add('task-focus');
  card.scrollIntoView({ block: 'start', behavior: S.settings.motion ? 'smooth' : 'auto' });
  card.querySelector('[data-action^="task:"],[data-action^="task-preview:"],[data-action^="restore:"]')?.focus({ preventScroll: true });
  setTimeout(() => card.classList.remove('task-focus'), 2600);
}
function focusTaskInProgres(id) {
  const t = S.tasks.find(x => x.id === id);
  progressTab = t ? tabOfTask(t) : 'aktif';
  closeModal(true);
  if (route === 'progres' && location.hash === '#progres') {
    render();
    highlightTask(id);
    return;
  }
  pendingTaskFocus = id;
  go('progres');
}
/* Pratinjau untuk kartu antrean, kartu yang menunggu prasyarat, dan kartu yang ditunda. Tanpa isian. */
function previewTask(id) {
  const t = S.tasks.find(x => x.id === id);
  if (!t) return;
  const st = taskState(t),
    ph = +t.phase || 0,
    ready = taskReady(t);
  const why =
    t.status === 'deferred'
      ? 'Kartu ini ditunda. Tekan Lanjutkan untuk mengaktifkannya kembali; isian dan buktinya tetap tersimpan.'
      : t.status === 'queued'
        ? 'Kartu ini masih di Antrean. Pengerjaan, pemeriksaan, dan penyelesaian tersedia setelah kartu aktif dan siap dikerjakan.'
        : `${waitLabel(t)}. Periksa Pekerjaan dan Catat Sebagai Selesai terbuka setelah prasyaratnya selesai.`;
  modal(
    'Pratinjau pekerjaan',
    `<div class="between"><span class="pill blue">Tahap ${e(stageName(ph))}</span>${badge(st[1], st[0] === 'warn' ? 'amber' : '')}</div><h2 class="workspace-title mt">${e(t.title)}</h2><p class="small muted">Bagian: ${e(taskBagian(t))} · Sumber: ${e(taskSource(t))}</p><div class="mt">${note(e(why), ready && t.status !== 'deferred' ? '' : 'amber')}</div><p class="small b19-reason mt"><strong>Alasan prioritas:</strong> ${e(priorityReason(t))}</p>${t.kind === 'parallel' && t.limit ? `<p class="small b19-limit"><strong>Batas pekerjaan:</strong> ${e(t.limit)}</p>` : ''}${taskFacts(t)}${relatedBlocks(t, true, true)}`,
    B('Tutup', 'close-modal') + (t.status === 'deferred' ? B('Lanjutkan', 'restore:' + id, 'primary', 'refresh') : ''),
    true,
  );
}
/* Ruang kerja kartu aktif yang siap. Kartu lain diarahkan ke pratinjau. */
function showTask(id, alasan = '') {
  const t = S.tasks.find(x => x.id === id);
  if (!t) return;
  if (t.status !== 'done' && (!activeTasks().includes(t) || !taskReady(t))) return previewTask(id);
  ensureGuide();
  if (alasan) taskTab = 'work';
  const st = taskState(t),
    ph = +t.phase || 0,
    p = t.part && PARTS[t.part],
    v = p ? S.guide.fields[t.part] || {} : {},
    done = t.status === 'done';
  const meta = (fid, val, max, opt) =>
    `<div class="field-meta"><span>${opt ? 'Boleh dilengkapi kemudian.' : ''}</span><span data-count="${fid}">${String(val || '').length}/${max}</span></div>`;
  const facts = `<section class="b19-brief"><span class="eyebrow">TUGAS INI</span><p class="small b19-reason"><strong>Alasan prioritas:</strong> ${e(priorityReason(t) || t.reason || '')}</p>${t.kind === 'parallel' && t.limit ? `<p class="small b19-limit"><strong>Batas pekerjaan:</strong> ${e(t.limit)}</p>` : ''}${taskFacts(t, 'div')}</section>`;
  const kendala = String(ensureKonteks().kendala || '').trim();
  const kendalaNote =
    kendala && t.part && kendalaPart(kendala) === t.part
      ? `<div class="mt">${note(`<strong>Kendalamu dari Konteks:</strong> “${e(kendala)}” ${B('Lihat Saran Alerin', 'struktur:' + t.part, 'text small')}`)}</div>`
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
  const hint = taskRevs(t).length
    ? 'Jelaskan perubahan yang menjawab catatan dosen dan letaknya di naskah.'
    : (t.findingIds || []).length
      ? 'Jelaskan perbaikan atas temuan pemeriksaan dan letaknya di naskah.'
      : p
        ? 'Isian panduan di atas adalah hasil kerjanya. Tambahkan bukti bila ada, misalnya lampiran draf.'
        : 'Tunjukkan hasil sesuai “Hasil yang disiapkan”, letaknya di naskah, dan dasar yang dipakai.';
  const ev = `<h3 class="mt">${p ? 'Bukti tambahan' : 'Hasil dan bukti pekerjaan'}</h3><p class="small muted">${e(hint)}</p><div class="field"><label for="task-evidence">${p ? 'Catatan bukti' : 'Hasil atau bukti pekerjaan'}${p ? OPT : REQ}</label><textarea id="task-evidence" data-task-evidence="${e(id)}" maxlength="1500" placeholder="Contoh: bagian apa yang kamu ubah, letaknya (bab/halaman), dan dasar yang dipakai." rows="4">${e(t.evidence || '')}</textarea>${meta('task-evidence', t.evidence, 1500, !!p)}</div>${uploadZone('task-' + id, 'Tambahkan bukti pekerjaan', 'PDF, DOCX, JPG, PNG')}${fileList('task-' + id)}<p class="small muted">Lampiran PDF dan DOCX dibaca saat Periksa Pekerjaan bila teksnya bisa diakses. Gambar belum bisa dibaca.</p>`;
  const checks = completionChecks(t);
  const status = `<section class="b19-checks" id="ws-koreksi"><div class="between"><h3>Syarat Catat Sebagai Selesai</h3>${t.review ? B('Lihat Tinjauan Alerin', 'task-review:' + id, 'text small') : ''}</div><ul>${checks
    .map(c => `<li class="${c.ok ? 'ok' : ''}">${I(c.ok ? 'check' : 'info')}<span><strong>${c.label}:</strong> ${e(c.text)}${!c.ok && c.next ? `<small>${e(c.next)}</small>` : ''}</span></li>`)
    .join('')}</ul>${done ? approvalLine(t) : ''}</section>`;
  const banner = alasan ? `<div class="mt">${note(`<strong>Belum bisa dicatat selesai.</strong> ${e(alasan)}`, 'amber')}</div>` : '';
  const work = banner + facts + kendalaNote + relatedBlocks(t, false, true) + guide + ev + status + `<p class="small muted mt" data-autosave="1">Isian dan bukti tersimpan otomatis.</p>`;
  const disc = `<section class="v6-discussion"><p class="small muted">Tanyakan hal yang membuatmu ragu di pekerjaan ini. Jawaban berupa contoh panduan lokal, belum terhubung ke model AI.</p><div class="v6-discussion-log" role="log">${(t.discussion || []).map(m => `<div class="chat-message ${m.who === 'user' ? 'user' : ''}">${e(m.text)}</div>`).join('')}</div><div class="field disc-input"><label for="disc-text">Pertanyaan atau catatan tambahan <span>Opsional</span></label><textarea id="disc-text" maxlength="500" placeholder="Contoh: Rumusan masalahku sudah cukup spesifik?" rows="3" data-nocap="1"></textarea>${meta('disc-text', '', 500, true)}</div><div class="actions">${B('Kirim Pertanyaan', 'task-disc:' + id, 'primary', 'send')}${B('Konsultasikan ke Mentor', 'nav:mentor', 'text', 'people')}</div></section>`;
  const head = `<div class="between"><span class="pill blue">Tahap ${e(stageName(ph))}${p ? ' · ' + e(p.name) : ''}</span>${badge(st[1], done ? 'green' : st[0] === 'warn' ? 'amber' : '')}</div><h2 class="workspace-title mt">${e(t.title)}</h2><p class="small muted">Bagian: ${e(taskBagian(t))} · Sumber: ${e(taskSource(t))}</p><div class="tabs v6-work-tabs">${B('Pengerjaan', 'task-tab:' + id + ':work', taskTab === 'work' ? 'primary' : 'text')}${B('Diskusi terkait pekerjaan', 'task-tab:' + id + ':disc', taskTab === 'disc' ? 'primary' : 'text')}</div>`;
  const locked = !!completionBlock(t);
  modal(
    'Ruang kerja penelitian',
    head + (taskTab === 'disc' ? disc : work),
    `<div class="workspace-actions">${done ? B('Kembali ke Progres', 'close-modal') + B('Buka Lagi', 'reopen:' + id, '') + (t.approval ? '' : B('Catat Persetujuan Dosen', 'approve:' + id, '', 'check')) : completeButton(t, 'primary', locked) + B('Periksa Pekerjaan', 'task-koreksi:' + id, '', 'checklist')}</div>`,
    true,
  );
  $('#overlay-root .modal')?.classList.add('workspace-modal');
}
function collectTask(id) {
  const t = S.tasks.find(x => x.id === id);
  if (!t) return null;
  if ($('#task-evidence')) t.evidence = $('#task-evidence').value.trim();
  return t;
}
/* Menolak dengan alasan yang sebenarnya; pesan muncul di bawah kolom atau di daftar syarat. */
function completeTask(id) {
  const t = collectTask(id);
  if (!t) return;
  persist();
  const block = completionBlock(t);
  if (!block) {
    modal(
      'Catat pekerjaan ini selesai?',
      `<p><strong>${e(t.title)}</strong></p><p>Statusnya menjadi <strong>Selesai Dikerjakan</strong>.</p><p class="small muted">Persetujuan dosen tidak berubah dan dicatat terpisah setelah dosen mengonfirmasi. Kamu bisa membuka kartu ini lagi kapan saja.</p>`,
      B('Batal', 'close-modal') + B('Catat Selesai', 'confirm-complete:' + id, 'primary'),
    );
    return;
  }
  if (block.kind === 'prasyarat') {
    const par = activeTasks().find(x => x !== t && taskReady(x));
    modal(
      'Belum bisa dicatat selesai',
      `<p>${e(waitLabel(t))}.</p><p class="small muted">Periksa Pekerjaan dan Catat Sebagai Selesai terbuka setelah prasyaratnya selesai.${par ? ` Sementara itu, “${e(par.title)}” siap dikerjakan.` : ''}</p>`,
      B('Kembali', 'close-modal') + (par ? B('Kerjakan ' + par.title, 'task:' + par.id, 'primary') : ''),
    );
    return;
  }
  if (block.kind === 'arahan') {
    const belum = taskPendingRevs(t).some(r => !revUnderstood(r));
    modal(
      'Belum bisa dicatat selesai',
      `<p>${e(block.text)}</p><p class="small muted">${belum ? 'Setujui dulu pemahaman Alerin atas arahan itu, lalu laporkan tindak lanjutnya di Revisi Dosen.' : 'Laporkan tindak lanjut arahannya di Revisi Dosen dulu.'}</p>`,
      B('Kembali', 'close-modal') + B('Lihat di Revisi Dosen', 'nav:revisi', 'primary'),
    );
    return;
  }
  showTask(id, block.text);
  if (block.kind === 'kolom') {
    const ids = block.empty?.length ? block.empty : PARTS[t.part].fields.map((f, i) => i).filter(i => !PARTS[t.part].fields[i].includes('|optional'));
    for (const i of ids)
      fieldError(`guide-${t.part}-${i}`, block.empty?.length ? 'Kolom ini masih kosong. Isi dulu sebelum mencatat selesai.' : 'Tulis lebih jelas dengan kalimat biasa.');
    focusFirstError();
  } else if (block.kind === 'bukti') {
    fieldError('task-evidence', 'Tulis hasil atau bukti pekerjaanmu, atau lampirkan berkasnya.');
    focusFirstError();
  } else $('#ws-koreksi')?.scrollIntoView({ block: 'center' });
}
function confirmComplete(id) {
  const t = S.tasks.find(x => x.id === id);
  if (!t) return;
  const waiting = taskDependents(t).map(x => x.id);
  t.status = 'done';
  t.completedAt = new Date().toISOString();
  t.reopenReason = '';
  for (const f of taskFindings(t)) f.resolved = true;
  reorderTasks(false);
  fillSlots();
  record('Pekerjaan selesai', t.title + ' · Selesai Dikerjakan');
  synchronizeResearch();
  persist();
  closeModal(true);
  render();
  const opened = waiting.map(i => S.tasks.find(x => x.id === i)).filter(x => x && taskReady(x));
  const nx = t.part && nextPart(t.part),
    has = nx && S.tasks.some(x => x.part === nx && x.status !== 'done');
  modal(
    'Pekerjaan dicatat selesai',
    `<p><strong>${e(t.title)}</strong> berstatus Selesai Dikerjakan.</p>${opened.length ? `<p>Sekarang terbuka: <strong>${opened.map(x => e(x.title)).join(', ')}</strong>.</p>` : ''}${nx && !has && t.source === 'mulai' ? `<p>Langkah berikutnya dalam rencana: <strong>${e(partLabel(nx))}</strong>.</p>` : ''}<p class="small muted">Persetujuan dosen belum dicatat. Catat terpisah setelah dosen mengonfirmasi.</p>`,
    B('Tutup', 'close-modal') +
      (nx && !has && t.source === 'mulai' ? B('Lanjut ke ' + PARTS[nx].name, 'guide-next:' + nx, 'primary') : B('Lihat Progres Aktif', 'progress-tab:aktif', 'primary')),
  );
}
function approvalModal(id) {
  const t = S.tasks.find(x => x.id === id);
  if (!t) return;
  modal(
    'Catat persetujuan dosen',
    `<p><strong>${e(t.title)}</strong></p><p class="small muted">Catat hanya setelah dosen benar-benar mengonfirmasi. Status Selesai Dikerjakan tidak sama dengan persetujuan dosen.</p><div class="field"><label for="ap-date">Tanggal konfirmasi <span class="required-label">Wajib</span></label><input id="ap-date" type="date" max="${isoToday()}" value="${isoToday()}"></div><div class="field"><label for="ap-note">Catatan konfirmasi <span>Opsional</span></label><textarea id="ap-note" rows="2" maxlength="300" placeholder="Misalnya: disetujui saat bimbingan, lanjut ke bab berikutnya."></textarea></div><label class="check"><input type="checkbox" id="ap-ok"><span>Dosen sudah mengonfirmasi pekerjaan ini</span></label>`,
    B('Batal', 'close-modal') + B('Simpan Persetujuan', 'approve-save:' + id, 'primary', 'check'),
  );
}

Object.assign(ACTIONS, {
  defer: arg => {
    deferTask(arg);
  },
  'save-defer': async arg => {
    const t = S.tasks.find(t => t.id === arg);
    if (!t) return;
    t.beforeDefer = t.status;
    t.status = 'deferred';
    t.deferReason = $('#defer-reason').value;
    t.resumeDate = $('#defer-date').value;
    fillSlots();
    record('Pekerjaan ditunda', t.title);
    synchronizeResearch();
    if (!persist()) return render();
    closeModal(true);
    render();
    const dep = taskDependents(t).filter(x => x.status !== 'deferred'),
      par = activeTasks().find(x => taskReady(x));
    if (dep.length)
      return modal(
        'Pekerjaan ditunda',
        `<p><strong>${e(t.title)}</strong> tersimpan di Ditunda beserta isian, bukti, dan tautan arahannya.</p><p class="mt">${dep.map(x => '“' + e(x.title) + '”').join(', ')} tetap menunggu sampai pekerjaan ini selesai.</p>${par ? `<p class="mt">Yang siap dikerjakan sekarang: <strong>${e(par.title)}</strong>.</p>` : ''}`,
        B('Tutup', 'close-modal') + (par ? B('Kerjakan ' + par.title, 'task:' + par.id, 'primary', 'arrow') : ''),
      );
    toast('Pekerjaan tersimpan di daftar Ditunda.');
  },
  restore: arg => {
    restoreTask(arg, 'restore');
  },
  reopen: arg => {
    restoreTask(arg, 'reopen');
  },
  'restore-go': arg => {
    const [id, mode] = arg.split(':'),
      t = S.tasks.find(x => x.id === id);
    if (!t) return closeModal(true);
    clearErrors();
    if (mode === 'reopen') {
      const why = ($('#reopen-reason')?.value || '').trim();
      if (!why) return fieldError('reopen-reason', 'Tulis alasan membuka lagi pekerjaan ini.') || focusFirstError();
      if (why.replace(/\s/g, '').length < 5 || isAsalShort(why)) {
        fieldError('reopen-reason', 'Isiannya belum bisa Alerin pahami. Coba tulis dengan kalimat biasa.');
        return focusFirstError();
      }
      t.reopenDraft = why;
    }
    const how = $('input[name="rs-mode"]:checked')?.value || 'free',
      rep = $('#replace-task')?.value || '';
    if (how === 'swap' && taskReady(t)) {
      const old = S.tasks.find(x => x.id === rep);
      return modal(
        'Ganti pekerjaan aktif?',
        `<div class="order-change"><div><span class="eyebrow">DIPINDAHKAN KE ANTREAN</span><p>${e(old?.title || '')}</p></div>${I('arrowDown')}<div><span class="eyebrow">MENJADI AKTIF</span><p><strong>${e(t.title)}</strong></p></div></div><p class="small muted mt">Isian, bukti, dan tautan arahan kartu yang dipindahkan tetap tersimpan. Kartu itu naik lagi saat ada slot kosong.</p>`,
        B('Batal', 'close-modal') + B('Ya, Ganti', 'restore-swap:' + id + ':' + mode + ':' + rep, 'primary'),
      );
    }
    applyRestore(id, mode, how === 'free' ? 'free' : 'queue');
  },
  'restore-swap': arg => {
    const [id, mode, rep] = arg.split(':');
    applyRestore(id, mode, 'swap', rep);
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
    applyOrder();
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
  'task-preview': arg => {
    previewTask(arg);
  },
  'task-tab': arg => {
    const [id, tab] = arg.split(':');
    collectTask(id);
    persist();
    taskTab = tab === 'disc' ? 'disc' : 'work';
    showTask(id);
  },
  complete: arg => {
    completeTask(arg);
  },
  'confirm-complete': arg => {
    const t = S.tasks.find(x => x.id === arg);
    /* Syarat dicek ulang saat konfirmasi, supaya kunci tidak terlewati. */
    if (t && completionBlock(t)) return completeTask(arg);
    confirmComplete(arg);
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
  /* Periksa Pekerjaan: Tinjauan Alerin per kriteria Selesai Bila. */
  'task-koreksi': async arg => {
    const t = collectTask(arg);
    if (!t) return;
    persist();
    if (!taskReady(t) || !activeTasks().includes(t)) return previewTask(arg);
    await processing('Meninjau hasil kerjamu', async () => {
      t.review = await runReview(t);
      const met = t.review.items.filter(i => i.status === 'met').length;
      record('Tinjauan Alerin dijalankan', `${t.title} · ${met}/${t.review.items.length} kriteria terpenuhi`);
      persist();
      render();
      reviewModal(arg);
    });
  },
  'task-review': arg => {
    collectTask(arg);
    persist();
    reviewModal(arg);
  },
  'rv-note': arg => {
    const [id, nid] = arg.split(':'),
      t = S.tasks.find(x => x.id === id),
      n = t?.review?.notes?.find(x => x.id === nid);
    if (!n) return;
    n.done = !n.done;
    record(n.done ? 'Koreksi Alerin ditandai tuntas' : 'Koreksi Alerin dibuka lagi', n.title);
    persist();
    render();
    reviewModal(id);
  },
  approve: arg => {
    approvalModal(arg);
  },
  'approve-save': arg => {
    const t = S.tasks.find(x => x.id === arg);
    if (!t) return closeModal(true);
    clearErrors();
    let ok = checkDate('ap-date', { required: true, future: false });
    if (ok && $('#ap-date').value > isoToday()) ok = fieldError('ap-date', 'Tanggal konfirmasi belum terjadi. Periksa lagi, ya.');
    if (!$('#ap-ok').checked) {
      const w = $('#ap-ok').closest('label');
      w.insertAdjacentHTML('afterend', '<p class="field-error">Centang dulu bila dosen sudah mengonfirmasi.</p>');
      ok = false;
    }
    if (!ok) return focusFirstError();
    t.approval = { date: $('#ap-date').value, note: $('#ap-note').value.trim(), by: 'pengguna' };
    record('Persetujuan dosen dicatat', t.title + ' · ' + dateLong(t.approval.date));
    persist();
    closeModal(true);
    render();
    toast('Persetujuan dosen tercatat terpisah dari status Selesai Dikerjakan.');
  },
  'progress-tab': arg => {
    progressTab = arg;
    closeModal(true);
    if (route !== 'progres') go('progres');
    else render();
  },
  'dismiss-progres-guide': () => {
    S.settings.hideProgresGuide = true;
    persist();
    render();
    toast('Panduan Progres Aktif disembunyikan. Kamu bisa melihatnya kembali lewat Pengaturan.');
  },
  'show-progres-guide': () => {
    S.settings.hideProgresGuide = false;
    persist();
    render();
    toast('Panduan Progres Aktif ditampilkan kembali.');
  },
});
