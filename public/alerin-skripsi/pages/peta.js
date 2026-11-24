'use strict';
/* Peta Skripsi: sebelas tahap dalam accordion. Tiap tahap memuat catatan, pekerjaan, bukti, dan jadwal. */
let petaOpen = null,
  petaOpenFor;
function stageData(i, cur, st) {
  const ts = S.tasks.filter(t => +t.phase === i),
    done = ts.filter(t => t.status === 'done'),
    open = ts.filter(t => t.status !== 'done'),
    log = (S.stageLog || []).filter(x => x.stage === i),
    agendas = (S.agendas || []).filter(a => a.phase === i).sort((a, b) => a.date.localeCompare(b.date)),
    ev = ts.filter(t => t.evidence || S.files.some(f => f.context === 'task-' + t.id));
  const pos = cur === null ? 'next' : i < cur ? 'past' : i === cur ? 'now' : 'next';
  const complete = !!(st && st.confirmed) && !open.length && (done.length > 0 || log.length > 0);
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
function stagePanel(i, d, tg, badgeClass, badgeText) {
  const p = ALERIN.phases[i];

  // PEKERJAAN
  let kerjaItems = '';
  if (d.ts.length) {
    kerjaItems = d.ts
      .map(t => {
        const isDone = t.status === 'done';
        const isActive = t.status === 'active' || t.status === 'ready' || (!isDone && d.pos === 'now');
        const badgeText = isDone ? 'Selesai' : isActive ? 'Sedang aktif' : 'Belum dimulai';
        const badgeCls = isDone ? 'done' : isActive ? 'active' : 'default';
        const dotCls = isDone ? 'done' : isActive ? 'active' : '';
        const displayTitle = t.title.replace('Tindak lanjut arahan:', 'Tindak lanjuti arahan:');

        return `
          <div class="peta-subcard-kerja">
            <div class="peta-subcard-left">
              <div class="peta-subcard-dot ${dotCls}"></div>
              <button type="button" class="peta-task-link" data-action="task:${t.id}">
                ${e(displayTitle)}
              </button>
            </div>
            <div class="peta-subcard-badge ${badgeCls}">${e(badgeText)}</div>
          </div>
        `;
      })
      .join('');
  } else {
    kerjaItems = `
      <div class="peta-subcard-kerja">
        <div class="peta-subcard-left">
          <div class="peta-subcard-dot"></div>
          <span class="peta-subcard-empty-text">Belum ada pekerjaan di tahap ini.</span>
        </div>
      </div>
    `;
  }

  const kerjaSection = `
    <div class="peta-section-block">
      <div class="peta-section-eyebrow">PEKERJAAN</div>
      <div class="peta-subcard-list">
        ${kerjaItems}
      </div>
    </div>
  `;

  // BUKTI
  const buktiDesc = `Biasanya berupa: ${e(p[2].replace(/\.$/, '').toLowerCase())}.`;
  const buktiStatus = d.ev.length
    ? `<div class="peta-subcard-item"><div class="peta-subcard-dot done"></div><span>${d.ev.length} pekerjaan punya catatan atau lampiran: ${d.ev.map(t => e(t.title)).join('; ')}.</span></div>`
    : `<div class="peta-subcard-item"><div class="peta-subcard-dot"></div><span>Belum ada bukti tersimpan di tahap ini.</span></div>`;

  const buktiSection = `
    <div class="peta-section-block">
      <div class="peta-section-eyebrow">BUKTI</div>
      <div class="peta-subcard-panel">
        <div class="peta-subcard-desc">${buktiDesc}</div>
        ${buktiStatus}
      </div>
    </div>
  `;

  // JADWAL
  let jadwalItems = '';
  if (d.agendas.length) {
    jadwalItems = d.agendas
      .map(
        a => `
        <div class="peta-subcard-item">
          <div class="peta-subcard-dot ${a.log ? 'done' : ''}"></div>
          <span class="peta-jadwal-title">${e(a.title)}</span>
          <span class="peta-jadwal-meta">${dateLong(a.date)}${a.time ? ' • ' + e(a.time) + ' WIB' : ''}</span>
        </div>
      `,
      )
      .join('');
  } else {
    jadwalItems = `
      <div class="peta-subcard-item">
        <div class="peta-subcard-dot"></div>
        <span>Belum ada jadwal untuk tahap ini.</span>
      </div>
    `;
  }

  const jadwalSection = `
    <div class="peta-section-block">
      <div class="peta-section-eyebrow">JADWAL</div>
      <div class="peta-subcard-panel">
        ${jadwalItems}
      </div>
    </div>
  `;

  // CATATAN TAHAP
  let catatanSection = '';
  if (d.log.length) {
    catatanSection = `
      <div class="peta-section-block">
        <div class="peta-section-eyebrow">CATATAN TAHAP</div>
        <div class="peta-subcard-panel">
          ${d.log
            .map(
              l => `
            <div class="peta-subcard-item">
              <div class="peta-subcard-dot done"></div>
              <div class="peta-log-content">
                <strong>${e(l.text)}</strong>
                <span class="peta-log-meta">${e(l.by)} • ${dateLong(l.date)}</span>
              </div>
            </div>
          `,
            )
            .join('')}
        </div>
      </div>
    `;
  }

  const actionsHtml = d.pos === 'now' || d.open.length
    ? `<div class="peta-stage-actions"><button type="button" class="btn btn-primary small" data-action="progress-tab:aktif">Lihat Pekerjaan Tahap Ini</button></div>`
    : '';

  return `
    <div class="peta-panel-content">
      ${badgeClass && badgeText ? `<div class="peta-panel-badge-wrap"><div class="peta-status-badge ${badgeClass}">${e(badgeText)}</div></div>` : ''}
      ${catatanSection}
      ${kerjaSection}
      ${buktiSection}
      ${jadwalSection}
      ${actionsHtml}
    </div>
  `;
}
function petaPage() {
  const st = stageInfo(),
    cur = st.idx,
    tg = targetNow();
  if (petaOpen === null || petaOpenFor !== cur) {
    petaOpen = new Set(cur === null ? [0, 1] : [0, Math.max(0, cur)]);
    petaOpenFor = cur;
  }
  const rows = ALERIN.phases
    .map((p, i) => {
      const d = stageData(i, cur, st),
        open = petaOpen.has(i),
        no = String(i + 1).padStart(2, '0');
      const isComplete = d.complete;
      const isCurrent = cur === i || d.open.length > 0;
      const badgeText = isComplete
        ? 'Selesai'
        : isCurrent
          ? d.open.length
            ? 'Sedang dikerjakan'
            : 'Sedang aktif'
          : d.pos === 'past' && st.confirmed
            ? 'Sebelum posisimu'
            : 'Belum dimulai';
      const badgeClass = isComplete
        ? 'peta-status-done'
        : isCurrent
          ? 'peta-status-active'
          : 'peta-status-default';

      const pct = isComplete ? 100 : d.ts.length ? Math.round((d.done.length / d.ts.length) * 100) : 0;
      const cardCls = [
        'peta-stage-card',
        isComplete ? 'done' : isCurrent ? 'active' : '',
        open ? 'selected' : '',
      ]
        .filter(Boolean)
        .join(' ');

      return `
        <div id="linked-phase-${i}" class="${cardCls}">
          <button type="button" class="peta-stage-trigger" id="map-head-${i}" data-action="peta-toggle:${i}" aria-expanded="${open}" aria-controls="map-panel-${i}">
            <div class="peta-number-circle">${isComplete ? I('check') : no}</div>
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
            ${stagePanel(i, d, tg, badgeClass, badgeText)}
          </div>
        </div>
      `;
    })
    .join('');

  const allOpen = petaOpen.size === ALERIN.phases.length;
  const dl = S.konteks?.deadline || S.profile.deadline;
  const left = dl ? daysLeft(dl) : null;
  const dlProgressPct =
    left !== null ? Math.max(15, Math.min(100, Math.round(((180 - Math.max(0, left)) / 180) * 100))) : 37;

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

  const dlSet = Boolean(dl);
  const tgSet = Boolean(tg);

  const targetDeadlineBody = dlSet
    ? `
      <div class="peta-target-val-row">
        <span class="peta-target-date-main">${dateLong(dl)}</span>
        <span class="peta-target-days-sub">(${left !== null ? (left >= 0 ? left + ' hari lagi' : 'lewat ' + Math.abs(left) + ' hari') : ''})</span>
      </div>
      <div class="peta-target-bar-track">
        <div class="peta-target-bar-fill" style="width: ${dlProgressPct}%"></div>
      </div>
    `
    : `
      <div class="peta-target-val-row">
        <span class="peta-card-value">Belum ada target</span>
      </div>
    `;

  const targetNearestBody = tgSet
    ? `
      <div class="peta-target-nearest-title">${e(tg.text)}</div>
      <div class="peta-target-nearest-meta">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A8A29E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>${dateLong(tg.date)}${tg.time ? ' • ' + e(tg.time) + ' WIB' : ''}</span>
      </div>
    `
    : `
      <div class="peta-target-val-row">
        <span class="peta-card-value">Belum ada target</span>
      </div>
    `;

  const targetsHtml = `
    <div class="peta-targets-grid">
      <div class="peta-target-card">
        <div class="peta-card-header">
          <h3 class="peta-card-title">Target Penyelesaian Skripsi</h3>
          ${dlSet ? '<span class="peta-target-pill">Terjadwal</span>' : ''}
        </div>
        <div class="peta-target-body">
          ${targetDeadlineBody}
        </div>
        <div class="peta-card-footer">
          <span class="peta-card-hint">Diatur lewat Konteks di Mulai Skripsi.</span>
        </div>
      </div>

      <div class="peta-target-card">
        <div class="peta-card-header">
          <h3 class="peta-card-title">Target terdekat</h3>
          ${tgSet ? '<span class="peta-target-pill">Mendatang</span>' : ''}
        </div>
        <div class="peta-target-body">
          ${targetNearestBody}
        </div>
        <div class="peta-card-actions">
          <button type="button" class="btn-peta-add" data-action="${!tgSet ? 'target-suggest' : tg.source === 'agenda' ? 'cal-edit:' + tg.id : 'target'}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Tambah Target</span>
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
