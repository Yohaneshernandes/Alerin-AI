'use strict';
/* Kalender Alerin: agenda (tambah, ubah, hapus), catatan bimbingan, target terdekat, dan saran timeline. */
let calYear, calMonth, calSel;
/* Agenda bertanggal lewat yang menunggu jawaban "simpan sebagai catatan?". Tidak ikut disimpan. */
let pendingAgenda = null;
/* Asal formulir agenda. 'beranda': dibuka dari kartu Target terdekat di Beranda, jadi setelah disimpan kembali ke Beranda
   tanpa membuka kalender kedua (Revisi 18 November). */
let agendaFrom = '';
const AGENDA_COLORS = {
  user: ['#f0a92a', '#fff8ec'],
  alerin: ['#347cea', '#f0f6ff'],
  target: ['#d9534f', '#fdf1f1'],
  deadline: ['#2f9e72', '#eef8f3'],
};
function calGoto(date) {
  calSel = date;
  calYear = +date.slice(0, 4);
  calMonth = +date.slice(5, 7) - 1;
}
function calendarEvents() {
  const map = {};
  const add = (date, ev) => {
    if (!date) return;
    (map[date] ??= []).push(ev);
  };
  for (const a of S.agendas) add(a.date, { ...a });
  if (S.target.date)
    add(S.target.date, {
      id: 'target',
      title: 'Target terdekat: ' + S.target.text,
      time: '',
      kind: 'target',
      fixed: true,
    });
  if (S.profile.deadline)
    add(S.profile.deadline, {
      id: 'deadline',
      title: 'Target selesai skripsi',
      time: '',
      kind: 'deadline',
      fixed: true,
    });
  return map;
}
function timelineSuggestions() {
  const start = isoToday(),
    end = S.profile.deadline || addDaysIso(110),
    span = Math.max(7, daysLeft(end));
  const from = Math.min(S.phase, 10),
    phases = ALERIN.phases.slice(from);
  return phases.map((p, i) => ({
    phase: from + i,
    title: 'Saran Alerin: ' + p[0],
    date: addDaysIso(Math.max(1, Math.round(((i + 1) * span) / phases.length)), start),
  }));
}
/* Keterangan kecil di bawah judul agenda. */
function agendaMeta(a) {
  const bits = [];
  if (a.time) bits.push(I('clock') + e(a.time) + ' WIB');
  if (a.kind === 'alerin') bits.push('Disarankan Alerin');
  if (a.kind === 'target') bits.push('Target terdekat');
  if (a.kind === 'deadline') bits.push('Dari Konteks Skripsi');
  if (a.phase !== undefined && a.phase !== null && a.phase !== '' && a.kind !== 'alerin')
    bits.push('Tahap ' + e(stageName(+a.phase)));
  if (!bits.length) bits.push('Agenda');
  return bits.join(' · ');
}
function agendaRow(a) {
  const past = a.date < isoToday();
  const state = a.log ? badge('Sudah lewat · catatan bimbingan', 'amber') : past && !a.fixed ? badge('Sudah lewat', 'amber') : '';
  const actions = a.fixed
    ? a.kind === 'target'
      ? B('Ubah target', 'target', 'text small', 'edit')
      : B('Ubah', 'guide-view:konteks', 'text small', 'edit')
    : `<button class="icon-btn" data-action="cal-edit:${a.id}" aria-label="Ubah agenda ${e(a.title)}" title="Ubah">${I('edit')}</button><button class="icon-btn" data-action="cal-del:${a.id}" aria-label="Hapus agenda ${e(a.title)}" title="Hapus">${I('trash')}</button>`;
  return `<div class="agenda-item ${past && !a.fixed ? 'past' : ''}" style="background:${AGENDA_COLORS[a.kind][1]}"><span class="bar" style="background:${AGENDA_COLORS[a.kind][0]}"></span><div><strong>${e(a.title)}</strong><small>${agendaMeta(a)}</small>${state}${a.note ? `<p class="agenda-note">${e(a.note)}</p>` : ''}</div><span class="agenda-actions">${actions}</span></div>`;
}
function calendarModal() {
  const today = isoToday();
  calSel ??= today;
  if (calYear === undefined) calGoto(calSel);
  const events = calendarEvents(),
    startDow = new Date(Date.UTC(calYear, calMonth, 1)).getUTCDay(),
    days = new Date(Date.UTC(calYear, calMonth + 1, 0)).getUTCDate();
  const monthName = new Date(Date.UTC(calYear, calMonth, 15)).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push('<span></span>');
  for (let d = 1; d <= days; d++) {
    const iso = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      ev = events[iso] || [];
    cells.push(
      `<button class="cal-day ${iso === today ? 'today' : ''} ${iso === calSel ? 'selected' : ''}" data-action="cal-day:${iso}" aria-label="${dateLong(iso)}${ev.length ? ', ' + ev.length + ' agenda' : ''}">${d}${
        ev.length
          ? `<span class="cal-dots">${ev
              .slice(0, 3)
              .map(x => `<i style="background:${iso === calSel ? '#fff' : AGENDA_COLORS[x.kind][0]}"></i>`)
              .join('')}</span>`
          : ''
      }</button>`,
    );
  }
  const list = events[calSel] || [];
  const selLabel = new Date(calSel + 'T12:00:00').toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
  const tg = targetNow();
  const sugg = timelineSuggestions();
  modal(
    'Kalender Alerin',
    `<div class="cal-top"><div class="cal-title"><span class="cal-badge">${I('calendar')}</span><div><h3>${e(monthName.charAt(0).toUpperCase() + monthName.slice(1))}</h3><p>Kalender Akademik Alerin</p></div></div><div class="cal-nav"><button class="icon-btn" data-action="cal-prev" aria-label="Bulan sebelumnya">${I('chevronLeft')}</button><button class="btn text small" data-action="cal-today">Hari ini</button><button class="icon-btn" data-action="cal-next" aria-label="Bulan berikutnya">${I('chevronRight')}</button></div></div><div class="cal-grid">${['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(x => `<span class="cal-dow">${x}</span>`).join('')}${cells.join('')}</div><p class="cal-next small" id="cal-target">${tg ? `${I('target')}<span>Target terdekat: <strong>${e(tg.text)}</strong> · ${dateLong(tg.date)}</span>` : `${I('target')}<span>Belum ada target terdekat.</span>`}</p><div class="cal-agenda"><div class="between"><h4>${e(selLabel)}</h4>${B('Tambah agenda', 'cal-add', 'text small', 'plus')}</div>${list.length ? list.map(agendaRow).join('') : '<p class="small muted mt">Belum ada agenda pada tanggal ini.</p>'}</div><details class="cal-suggest"><summary>Saran timeline Alerin · berdasarkan target selesai ${dateLong(S.profile.deadline)}</summary><p class="small">Alerin membagi tahap yang tersisa hingga target selesai skripsimu. Kamu memilih sendiri saran yang dimasukkan ke kalender; target dapat diubah kapan saja.</p>${sugg
      .map((s, i) => {
        const added = S.agendas.some(a => a.kind === 'alerin' && a.phase === s.phase);
        return `<div class="suggest-row"><span>${e(s.title.replace('Saran Alerin: ', ''))}</span><small>${dateLong(s.date)}</small>${added ? badge('Di kalender', 'green') : B('Tambahkan', 'cal-suggest:' + i, 'text small', 'plus')}</div>`;
      })
      .join(
        '',
      )}<div class="actions mt">${B('Tambahkan semua saran', 'cal-suggest-all', 'soft small', 'plus')}${B('Ubah target selesai', 'guide-view:konteks', 'text small', 'edit')}</div></details><div class="cal-google"><div class="flex"><span class="g-badge">G</span><div><strong>Google Kalender</strong><small>Sinkronkan deadline otomatis</small></div></div>${B('Integrasi Google Kalender', 'cal-google', 'google', 'external')}</div>`,
    '',
    true,
  );
  $('#overlay-root .modal')?.classList.add('calendar-modal');
}
/* Form agenda. Dipakai untuk menambah dan mengubah. */
function agendaModal(date, a = null, phase) {
  const st = stageInfo().idx;
  const ph = a ? a.phase : phase !== undefined ? phase : st !== null && st >= 0 ? st : '';
  const tahap = `<option value="">Tidak dikaitkan</option>${ALERIN.phases.map((p, i) => `<option value="${i}" ${String(ph) === String(i) ? 'selected' : ''}>${e(stageName(i))}</option>`).join('')}`;
  const tanggal = a ? a.date : date && date >= isoToday() ? date : isoToday();
  const judul = a ? a.title.replace(/^Catatan bimbingan · /, '') : '';
  modal(
    a ? 'Ubah agenda' : 'Tambah agenda',
    `<div class="field"><label for="agenda-title">Judul agenda <span class="required-label">Wajib</span></label><input id="agenda-title" type="text" maxlength="120" placeholder="Contoh: Bimbingan Bab I" value="${e(judul)}"></div><div class="field-grid"><div class="field"><label for="agenda-date">Tanggal <span class="required-label">Wajib</span></label><input id="agenda-date" type="date" max="${DATE_MAX}" value="${e(tanggal)}"></div><div class="field"><label for="agenda-time">Jam <span>Opsional</span></label><input id="agenda-time" type="time" value="${e((a?.time || '').replace('.', ':'))}"></div></div><div class="field"><label for="agenda-phase">Tahap terkait <span>Opsional</span></label><select id="agenda-phase">${tahap}</select><p class="small muted">Agenda yang dikaitkan tampil di tahap itu pada Peta Skripsi.</p></div><div class="field"><label for="agenda-note">Catatan <span>Opsional</span></label><textarea id="agenda-note" rows="2" maxlength="300" placeholder="Hal yang perlu disiapkan.">${e(a?.note || '')}</textarea></div><label class="check"><input type="checkbox" id="agenda-remind" ${!a || a.remind !== false ? 'checked' : ''}><span>Ingatkan aku lewat Alerin Chat</span></label>`,
    (agendaFrom === 'beranda' ? B('Batal', 'close-modal') : B('Kembali', 'calendar')) +
      B(a ? 'Simpan perubahan' : 'Simpan agenda', a ? 'cal-save:' + a.id : 'cal-save', 'primary'),
  );
}
function readAgenda(editId) {
  const old = editId ? S.agendas.find(x => x.id === editId) : null;
  const ph = $('#agenda-phase').value;
  const a = {
    ...(old || { kind: 'user' }),
    id: old ? old.id : uid(),
    title: capitalize($('#agenda-title').value),
    date: $('#agenda-date').value,
    time: ($('#agenda-time').value || '').replace(':', '.'),
    note: $('#agenda-note').value.trim(),
    remind: $('#agenda-remind').checked,
    phase: ph === '' ? undefined : +ph,
  };
  delete a.log;
  return a;
}
function saveAgenda(editId) {
  clearErrors();
  let ok = checkRequired('agenda-title', { asal: false });
  if (ok && isAsalShort($('#agenda-title').value))
    ok = fieldError('agenda-title', 'Isiannya belum bisa Alerin pahami. Coba tulis dengan kalimat biasa.');
  if (!checkDate('agenda-date', { required: true, future: false })) ok = false;
  if (!ok) return focusFirstError();
  const a = readAgenda(editId);
  if (a.date < isoToday()) {
    pendingAgenda = a;
    modal(
      'Tanggal ini sudah lewat',
      `<p>Tanggal ini sudah lewat. Simpan sebagai catatan bimbingan?</p><p class="small muted">Catatan bimbingan ditandai “Sudah lewat”, tidak dipakai sebagai target, dan tidak memunculkan pengingat.</p>`,
      B('Ubah tanggal', 'cal-add-again', 'text') + B('Simpan sebagai catatan', 'cal-log-save', 'primary'),
    );
    return;
  }
  commitAgenda(a);
}
/* Simpan agenda baru atau perubahan, lalu tampilkan target terdekat yang baru. */
function commitAgenda(a, asLog = false) {
  const before = targetNow();
  const old = S.agendas.find(x => x.id === a.id);
  if (asLog) a.log = true;
  if (old) {
    for (const k of Object.keys(old)) delete old[k];
    Object.assign(old, a);
  } else S.agendas.push(a);
  record(
    old ? 'Agenda diubah' : asLog ? 'Catatan bimbingan disimpan' : 'Agenda ditambahkan',
    a.title + ' · ' + dateLong(a.date),
  );
  pendingAgenda = null;
  persist();
  calGoto(a.date);
  const fromHome = agendaFrom === 'beranda';
  agendaFrom = '';
  if (fromHome) closeModal(true);
  render();
  if (!fromHome) calendarModal();
  toast(
    (asLog ? 'Disimpan sebagai catatan bimbingan.' : old ? 'Agenda diperbarui.' : 'Agenda tersimpan di Kalender Alerin.') +
      targetChangeNote(before),
  );
}
function targetChangeNote(before) {
  const now = targetNow();
  const key = x => (x ? x.date + '|' + x.text : '');
  if (key(before) === key(now)) return '';
  return now ? ` Target terdekat sekarang: ${now.text} (${dateLong(now.date)}).` : ' Belum ada target terdekat.';
}
function targetModal(pre = {}) {
  const tg = S.target || {};
  /* Target kecil bisa ditautkan ke pekerjaan aktif (Revisi 18 November, pilihan "Tidak sempat" di Beranda). */
  const act = activeTasks(),
    linkId = pre.taskId ?? tg.taskId ?? '',
    link =
      (pre.link || tg.taskId) && act.length
        ? selectField('target-task', 'Tautkan ke pekerjaan aktif (opsional)', [['', 'Tidak ditautkan'], ...act.map(t => [t.id, t.title])], linkId)
        : '';
  modal(
    pre.title || 'Target terdekat',
    `<div class="field"><label for="target-text">Yang ingin dicapai <span class="required-label">Wajib</span></label><textarea id="target-text" rows="2" maxlength="200" placeholder="Contoh: Selesaikan draf Bab I">${e(pre.text ?? tg.text ?? '')}</textarea></div><div class="field"><label for="target-date">Tanggal <span class="required-label">Wajib</span></label><input id="target-date" type="date" min="${isoToday()}" max="${DATE_MAX}" value="${e(pre.date ?? (tg.date >= isoToday() ? tg.date : ''))}"></div>${link}<p class="small muted">Target muncul di Beranda, Peta Skripsi, dan Kalender Alerin. Kalau ada agenda yang lebih dekat, agenda itu yang tampil sebagai target terdekat.</p>`,
    B('Batal', 'close-modal') +
      (tg.text ? B('Hapus target', 'target-clear', 'text') : '') +
      B('Simpan Target', 'save-target', 'primary'),
  );
}
function saveTarget() {
  clearErrors();
  let ok = checkRequired('target-text');
  if (!checkFutureDate('target-date', { required: true })) ok = false;
  if (!ok) return focusFirstError();
  const sel = $('#target-task'),
    taskId = sel ? sel.value : S.target?.taskId || '';
  S.target = { date: $('#target-date').value, text: capitalize($('#target-text').value), ...(taskId ? { taskId } : {}) };
  record('Target terdekat dipasang', dateLong(S.target.date) + ' · ' + S.target.text);
  closeModal(true);
  persist();
  render();
  toast('Target terdekat tersimpan.');
}

Object.assign(ACTIONS, {
  calendar: () => {
    agendaFrom = '';
    calendarModal();
  },
  'cal-prev': (arg, button, key) => {
    calMonth += key === 'cal-prev' ? -1 : 1;
    if (calMonth < 0) {
      calMonth = 11;
      calYear--;
    }
    if (calMonth > 11) {
      calMonth = 0;
      calYear++;
    }
    calendarModal();
  },
  'cal-today': () => {
    calGoto(isoToday());
    calendarModal();
  },
  'cal-day': arg => {
    calSel = arg;
    calendarModal();
  },
  'cal-open': arg => {
    calGoto(arg);
    calendarModal();
  },
  'cal-add': () => {
    agendaFrom = '';
    agendaModal(calSel);
  },
  'cal-add-stage': arg => {
    agendaFrom = '';
    agendaModal(isoToday(), null, +arg);
  },
  'cal-edit': arg => {
    agendaFrom = '';
    const a = S.agendas.find(x => x.id === arg);
    if (a) agendaModal(a.date, a);
  },
  'cal-save': arg => {
    saveAgenda(arg || null);
  },
  'cal-add-again': () => {
    const a = pendingAgenda;
    agendaModal(isoToday(), a && S.agendas.some(x => x.id === a.id) ? { ...a, date: isoToday() } : null);
    if (a) {
      $('#agenda-title').value = a.title;
      $('#agenda-note').value = a.note;
      $('#agenda-time').value = (a.time || '').replace('.', ':');
      $('#agenda-phase').value = a.phase ?? '';
    }
    $('#agenda-date')?.focus();
  },
  'cal-log-save': () => {
    if (pendingAgenda) commitAgenda(pendingAgenda, true);
  },
  'cal-del': arg => {
    const a = S.agendas.find(x => x.id === arg);
    if (!a) return;
    modal(
      'Hapus agenda?',
      `<p><strong>${e(a.title)}</strong> · ${dateLong(a.date)}${a.time ? ' · ' + e(a.time) + ' WIB' : ''}</p><p class="small muted">Agenda dihapus dari Kalender Alerin dan Peta Skripsi. Kalau agenda ini target terdekatmu, target berganti ke agenda berikutnya.</p>`,
      B('Batal', 'cal-open:' + a.date, 'text') + B('Hapus agenda', 'cal-del-ok:' + a.id, 'danger', 'trash'),
    );
  },
  'cal-del-ok': arg => {
    const a = S.agendas.find(x => x.id === arg);
    if (!a) return;
    const before = targetNow();
    S.agendas = S.agendas.filter(x => x.id !== arg);
    record('Agenda dihapus', a.title + ' · ' + dateLong(a.date));
    persist();
    calGoto(a.date);
    render();
    calendarModal();
    toast('Agenda dihapus.' + targetChangeNote(before));
  },
  'cal-suggest': (arg, button, key) => {
    const list = timelineSuggestions(),
      pick = key === 'cal-suggest' ? [list[+arg]] : list;
    let n = 0;
    for (const s of pick) {
      if (!s || S.agendas.some(a => a.kind === 'alerin' && a.phase === s.phase)) continue;
      S.agendas.push({ id: uid(), title: s.title, date: s.date, time: '', kind: 'alerin', phase: s.phase });
      n++;
    }
    if (n) record('Saran timeline ditambahkan', n + ' agenda dari saran Alerin');
    persist();
    render();
    calendarModal();
    toast(n ? `${n} saran timeline masuk ke kalender.` : 'Saran sudah ada di kalender.');
  },
  'cal-google': () => {
    modal(
      'Integrasi Google Kalender',
      '<p>Integrasi Google Kalender belum terhubung pada prototipe ini. Pada produk, deadline dan agenda disinkronkan setelah kamu memberi izin akun Google.</p>',
      B('Kembali ke kalender', 'calendar', 'primary', 'calendar'),
    );
  },
  target: () => {
    targetModal();
  },
  'save-target': () => {
    saveTarget();
  },
  'target-clear': () => {
    S.target = {};
    record('Target terdekat dihapus');
    persist();
    closeModal(true);
    render();
    const now = targetNow();
    toast('Target dihapus.' + (now ? ` Target terdekat sekarang: ${now.text}.` : ''));
  },
});
ACTIONS['cal-next'] = ACTIONS['cal-prev'];
ACTIONS['cal-suggest-all'] = ACTIONS['cal-suggest'];
