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
      const pill = d.complete
        ? badge('Selesai', 'green')
        : d.pos === 'now'
          ? badge('Posisimu', 'blue')
          : d.open.length
            ? badge('Sedang dikerjakan', 'blue')
            : d.pos === 'past'
              ? badge(d.log.length ? 'Tercatat' : 'Sebelum posisimu · belum ada catatan', '')
              : badge('Belum dimulai', '');
      const pct = d.complete ? 100 : d.ts.length ? Math.round((d.done.length / d.ts.length) * 100) : 0;
      const cls = [d.pos, d.complete ? 'done' : d.pos === 'past' && d.open.length ? 'open' : d.pos === 'past' ? 'nolog' : '', open ? 'selected' : '']
        .filter(Boolean)
        .join(' ');
      return `<section id="linked-phase-${i}" class="sync-phase ${cls}"><button class="sync-phase-trigger" id="map-head-${i}" data-action="peta-toggle:${i}" aria-expanded="${open}" aria-controls="map-panel-${i}"><span class="timeline-number">${d.complete ? I('check') : no}</span><span class="sync-phase-name"><strong>${e(p[0])}</strong><small>${e(stageSummary(d))}</small></span>${pill}</button><div class="sync-meter" role="progressbar" aria-label="Penyelesaian ${e(p[0])}" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div><div class="sync-phase-detail" id="map-panel-${i}" role="region" aria-labelledby="map-head-${i}" ${open ? '' : 'hidden'}>${stagePanel(i, d, tg)}</div></section>`;
    })
    .join('');
  const allOpen = petaOpen.size === ALERIN.phases.length;
  const dl = S.konteks?.deadline || S.profile.deadline;
  const left = dl ? daysLeft(dl) : null;
  return (
    pageHead('Peta Skripsi', 'Pilih tahap untuk melihat rincian dan pekerjaan yang terhubung. Status dihitung dari Progres Aktif.') +
    `<div class="v3-map-head"><div class="card"><h3>Target Penyelesaian Skripsi</h3><p>${dl ? `${dateLong(dl)}${left !== null ? ` · ${left >= 0 ? left + ' hari lagi' : 'lewat ' + Math.abs(left) + ' hari'}` : ''}` : 'Belum ditentukan'}</p><p class="small muted mt">Diatur lewat Konteks di Mulai Skripsi.</p></div>${targetCard()}</div>` +
    `<section class="card mt"><div class="between peta-head"><p class="small muted">Pekerjaan yang selesai memperbarui tahap ini. Antrean, bukti, serta arahan dosen tetap dapat ditinjau; persetujuan akademik dicatat terpisah.</p>${B(allOpen ? 'Tutup semua' : 'Buka semua', 'peta-all', 'text')}</div>${rows}</section>`
  );
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
