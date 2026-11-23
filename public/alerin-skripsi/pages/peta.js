'use strict';
/* Peta Skripsi: sebelas tahap dalam accordion. Tiap tahap memuat catatan, pekerjaan, bukti, dan jadwal. */
let petaOpen = null,
  petaOpenFor;
function stageData(i, cur) {
  const ts = S.tasks.filter(t => +t.phase === i),
    done = ts.filter(t => t.status === 'done'),
    open = ts.filter(t => t.status !== 'done'),
    log = (S.stageLog || []).filter(x => x.stage === i),
    agendas = (S.agendas || []).filter(a => a.phase === i).sort((a, b) => a.date.localeCompare(b.date)),
    ev = ts.filter(t => t.evidence || S.files.some(f => f.context === 'task-' + t.id));
  const pos = cur === null ? 'next' : i < cur ? 'past' : i === cur ? 'now' : 'next';
  const complete = !open.length && (done.length > 0 || log.length > 0);
  return { ts, done, open, log, agendas, ev, pos, complete };
}
/* Satu baris ringkas yang tampil saat tahap tertutup. */
function stageSummary(d) {
  const today = isoToday(),
    next = d.agendas.find(a => a.date >= today && !a.log);
  const bits = [];
  if (d.ts.length) bits.push(`${d.done.length}/${d.ts.length} pekerjaan selesai`);
  else if (d.log.length) bits.push(`${d.log[0].text} · ${d.log[0].by}`);
  if (d.pos === 'past' && d.open.length) bits.push('masih ada yang terbuka');
  if (!bits.length)
    bits.push(
      d.pos === 'past'
        ? 'Sebelum posisimu · belum ada catatan'
        : d.pos === 'now'
          ? 'Belum ada pekerjaan di tahap ini'
          : next
            ? 'Dijadwalkan ' + dateLong(next.date)
            : 'Belum dimulai',
    );
  else if (next) bits.push('jadwal ' + dateLong(next.date));
  return bits.join(' · ');
}
function stagePanel(i, d, tg) {
  const p = ALERIN.phases[i];
  const sec = (title, body) => `<h4 class="mt">${title}</h4>${body}`;
  const catatan = d.log.length
    ? sec('Catatan tahap', `<ul class="sync-task-list">${d.log.map(l => `<li><strong>${e(l.text)}</strong><span>${e(l.by)} · ${dateLong(l.date)}</span></li>`).join('')}</ul>`)
    : '';
  const kerja = sec(
    `Pekerjaan${d.ts.length ? ` (${d.done.length}/${d.ts.length})` : ''}`,
    d.ts.length
      ? `<ul class="sync-task-list">${d.ts.map(t => `<li><strong><button class="inline-link" data-action="task:${t.id}">${e(t.title)}</button></strong><span>${t.status === 'done' ? 'Selesai menurut pengguna' : taskState(t)[1]}</span></li>`).join('')}</ul>`
      : `<p class="small muted">${d.pos === 'past' && !d.log.length ? 'Sebelum posisimu · belum ada catatan.' : 'Belum ada pekerjaan di tahap ini.'}</p>`,
  );
  const bukti = sec(
    'Bukti',
    `<p class="small muted">Biasanya berupa: ${e(p[2].replace(/\.$/, '').toLowerCase())}.</p>${
      d.ev.length
        ? `<p class="small">${d.ev.length} pekerjaan punya catatan atau lampiran: ${d.ev.map(t => e(t.title)).join('; ')}.</p>`
        : '<p class="small">Belum ada bukti tersimpan di tahap ini.</p>'
    }`,
  );
  const jadwalList = d.agendas.map(
    a =>
      `<li><strong>${e(a.title)}</strong><span>${dateLong(a.date)}${a.time ? ' · ' + e(a.time) + ' WIB' : ''}${a.log ? ' · Sudah lewat · catatan' : a.date < isoToday() ? ' · Sudah lewat' : ''}</span></li>`,
  );
  if (d.pos === 'now' && tg && !d.agendas.some(a => a.id === tg.id))
    jadwalList.unshift(`<li><strong>Target terdekat: ${e(tg.text)}</strong><span>${dateLong(tg.date)}</span></li>`);
  const jadwal = sec(
    'Jadwal',
    jadwalList.length ? `<ul class="sync-task-list">${jadwalList.join('')}</ul>` : '<p class="small muted">Belum ada jadwal untuk tahap ini.</p>',
  );
  return `<p>${e(p[1])}</p>${catatan}${kerja}${bukti}${jadwal}<div class="actions mt">${d.pos === 'now' || d.open.length ? B('Lihat Pekerjaan Tahap Ini', 'progress-tab:aktif', 'primary') : ''}${B('Tambah Agenda Tahap Ini', 'cal-add-stage:' + i, 'text', 'plus')}</div>`;
}
function petaPage() {
  const st = stageInfo(),
    cur = st.idx,
    tg = targetNow();
  if (petaOpen === null || petaOpenFor !== cur) {
    petaOpen = new Set(cur === null ? [] : [Math.max(0, cur)]);
    petaOpenFor = cur;
  }
  const rows = ALERIN.phases
    .map((p, i) => {
      const d = stageData(i, cur),
        open = petaOpen.has(i),
        no = String(i + 1).padStart(2, '0');
      const badgeText = d.complete
        ? 'Selesai'
        : d.pos === 'now'
          ? 'Sedang aktif'
          : d.open.length
            ? 'Sedang dikerjakan'
            : d.pos === 'past'
              ? 'Sebelum posisimu'
              : 'Belum dimulai';
      const badgeClass = d.complete
        ? 'peta-status-done'
        : (d.pos === 'now' || d.open.length)
          ? 'peta-status-active'
          : 'peta-status-default';

      const pct = d.complete ? 100 : d.ts.length ? Math.round((d.done.length / d.ts.length) * 100) : 0;
      const cardCls = [
        'peta-stage-card',
        d.complete ? 'done' : d.pos === 'now' ? 'active' : '',
        open ? 'selected' : ''
      ].filter(Boolean).join(' ');

      return `
        <div id="linked-phase-${i}" class="${cardCls}">
          <button type="button" class="peta-stage-trigger" id="map-head-${i}" data-action="peta-toggle:${i}" aria-expanded="${open}" aria-controls="map-panel-${i}">
            <div class="peta-number-circle">${d.complete ? I('check') : no}</div>
            <div class="peta-stage-text">
              <h3 class="peta-stage-title">${e(p[0])}</h3>
              <p class="peta-stage-subtitle">${e(p[1])}</p>
            </div>
            <div class="peta-status-badge ${badgeClass}">${e(badgeText)}</div>
            <div class="peta-chevron-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </button>
          <div class="peta-meter-track" role="progressbar" aria-label="Penyelesaian ${e(p[0])}" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
            <div class="peta-meter-fill" style="width:${pct}%"></div>
          </div>
          <div class="peta-stage-panel" id="map-panel-${i}" role="region" aria-labelledby="map-head-${i}" ${open ? '' : 'hidden'}>
            ${stagePanel(i, d, tg)}
          </div>
        </div>
      `;
    })
    .join('');

  const allOpen = petaOpen.size === ALERIN.phases.length;
  const dl = S.konteks?.deadline || S.profile.deadline;
  const left = dl ? daysLeft(dl) : null;

  const headerHtml = `
    <div class="peta-page-header">
      <h1 class="peta-title">Peta Skripsi</h1>
      <p class="peta-subtitle">Pilih tahap untuk melihat rincian dan pekerjaan yang terhubung. Status dihitung dari Progres Aktif.</p>
    </div>
  `;

  const posStripHtml = `
    <section class="card b18-progres-pos-strip" aria-label="Posisi Penelitian">
      <div class="b18-pos-strip-text">
        <span class="b18-pos-eyebrow">POSISI PENELITIANMU</span>
        <strong class="b18-pos-strong">${e(st.confirmed ? positionLabel(st.idx) : 'Pilih Tahap Terakhir')}</strong>
        <span class="b18-pos-meta">${e(st.confirmed ? positionSource() : 'Belum dikonfirmasi')}</span>
      </div>
      <button type="button" class="btn b18-pos-btn" data-action="pos-edit">
        <span>Perbarui Posisi</span>
      </button>
    </section>
  `;

  const targetsHtml = `
    <div class="peta-targets-grid">
      <div class="peta-target-card">
        <div class="peta-card-header">
          <h3 class="peta-card-title">Target Penyelesaian Skripsi</h3>
        </div>
        <div class="peta-card-value">${dl ? `${dateLong(dl)}${left !== null ? ` · ${left >= 0 ? left + ' hari lagi' : 'lewat ' + Math.abs(left) + ' hari'}` : ''}` : 'Belum ada terget'}</div>
        <div class="peta-card-footer">
          <span class="peta-card-hint">Diatur lewat Konteks di Mulai Skripsi.</span>
        </div>
      </div>

      <div class="peta-target-card">
        <div class="peta-card-header">
          <h3 class="peta-card-title">Target terdekat</h3>
        </div>
        <div class="peta-card-value">${tg ? `${e(tg.text)} · ${dateLong(tg.date)}` : 'Belum ada terget'}</div>
        <div class="peta-card-actions">
          <button type="button" class="btn-peta-add" data-action="${!tg ? 'target-suggest' : tg.source === 'agenda' ? 'cal-edit:' + tg.id : 'target'}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>${tg ? (tg.source === 'agenda' ? 'Ubah Agenda' : 'Ubah Target') : 'Tambah Target'}</span>
          </button>
          <button type="button" class="btn-peta-cal" data-action="nav:kalender">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Kalender Alerin</span>
          </button>
        </div>
      </div>
    </div>
  `;

  const mainCardHtml = `
    <section class="peta-main-card">
      <div class="peta-main-header">
        <p class="peta-main-desc">Pekerjaan yang selesai memperbarui tahap ini. Antrean, bukti, serta arahan dosen tetap dapat ditinjau; persetujuan akademik dicatat terpisah.</p>
        <button type="button" class="btn-peta-all" data-action="peta-all">${allOpen ? 'Tutup semua' : 'Buka semua'}</button>
      </div>
      <div class="peta-stages-list">
        ${rows}
      </div>
    </section>
  `;

  return `
    <div class="peta-layout-container">
      ${headerHtml}
      ${posStripHtml}
      ${targetsHtml}
      ${mainCardHtml}
    </div>
  `;
}

Object.assign(ACTIONS, {
  'peta-toggle': arg => {
    const i = +arg;
    if (petaOpen.has(i)) petaOpen.delete(i);
    else petaOpen.add(i);
    const open = petaOpen.has(i);
    $('#map-head-' + i)?.setAttribute('aria-expanded', String(open));
    $('#map-panel-' + i)?.toggleAttribute('hidden', !open);
    $('#linked-phase-' + i)?.classList.toggle('selected', open);
    const all = $('[data-action="peta-all"]');
    if (all) all.textContent = petaOpen.size === ALERIN.phases.length ? 'Tutup semua' : 'Buka semua';
  },
  'peta-all': () => {
    petaOpen = petaOpen.size === ALERIN.phases.length ? new Set() : new Set(ALERIN.phases.map((_, i) => i));
    render();
  },
  'peta-focus': arg => {
    const i = +arg;
    if (petaOpen === null) {
      petaOpenFor = stageInfo().idx;
      petaOpen = new Set();
    }
    petaOpen.add(i);
    closeModal(true);
    go('peta');
    requestAnimationFrame(() => $('#linked-phase-' + i)?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
  },
});
