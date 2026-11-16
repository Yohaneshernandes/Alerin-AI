'use strict';
/* Halaman beranda. Tampilan mengikuti site GPT; urutan prioritas dan aturan tetap dari logika Claude. */
let calPreviewMonth = '';
function berandaPage() {
  const k = kondisiOf(S.profile.kondisi),
    a = homeAction(),
    part = S.guide?.view === 'guide' ? PARTS[S.guide.part] : null;
  return (
    pageHead('Halo, ' + e(S.profile.name || 'Kawan') + '.', 'Satu langkah yang jelas untuk melanjutkan penelitianmu.') +
    (!k ? conditionChooser() : '') +
    posStrip() +
    titleChangedNote() +
    `<div class="v7-home-layout qc14-home-layout"><section class="card next-step-card"><span class="eyebrow">TAHAP SAAT INI</span><h2>${e(a.title)}</h2><p class="next-step-copy">${e(a.text)}</p>${a.meta ? `<p class="small muted next-step-meta">${e(a.meta)}</p>` : ''}${S.title ? `<div class="home-title"><span class="small muted">Judul aktif</span><p>${e(S.title)}</p></div>` : ''}<div class="actions mt">${k ? B('Ubah Kondisi', 'kondisi-pick', 'text') : ''}</div>${part ? `<p class="small muted last-opened">Terakhir dibuka: Bab ${part.roman} · ${e(part.name)}</p>` : ''}<p class="small muted mt">Pilih Mulai Skripsi di bawah untuk melanjutkan penyusunan, atau Periksa Skripsi untuk meninjau naskah dan kesiapanmu.</p></section><aside class="home-schedule">${targetCard()}</aside></div>` +
    `<div class="home-shortcuts qc14-shortcuts"><button class="home-shortcut" data-action="nav:mulai">${I('compass')}<span><strong>Mulai Skripsi</strong><small>Susun ide dan bagian penelitian.</small></span>${I('arrow')}</button><button class="home-shortcut" data-action="nav:periksa">${I('document')}<span><strong>Periksa Skripsi</strong><small>Tinjau naskah dan kesiapanmu.</small></span>${I('arrow')}</button></div>` +
    (k?.id === 'terhenti' ? stuckChoices() : '')
  );
}
/* Urutan prioritas: arahan dosen → temuan pemeriksaan → Prioritas Utama → kondisi akun. */
function homeAction() {
  const pend = pendingRevisions(),
    fs = openFindings(),
    t = activeTasks()[0],
    k = kondisiOf(S.profile.kondisi);
  if (pend.length) {
    const r = pend[0];
    return {
      title: `Tindak lanjuti arahan dosen (${pend.length})`,
      text: r.text,
      meta: `${r.topic || 'Arahan'} · Bimbingan ${dateLong(r.date)}`,
    };
  }
  if (fs.length) {
    const f = fs[0];
    return {
      title: 'Jadikan temuan ini pekerjaan',
      text: f.title,
      meta: `${f.location} · dari pemeriksaan ${localTime(latestReview().date)} WIB`,
    };
  }
  if (t)
    return {
      title: 'Lanjutkan: ' + t.title,
      text: t.doing || t.reason || '',
      meta: (t.part ? partLabel(t.part) + ' · ' : '') + 'Prioritas Utama di Progres Aktif',
    };
  if (!k)
    return {
      title: 'Kondisimu belum diketahui',
      text: 'Pilih kondisi skripsimu di atas. Langkah berikutnya menyesuaikan pilihanmu.',
    };
  return { title: k.label, text: k.msg };
}
function conditionChooser() {
  const now = S.profile.kondisi || '';
  return `<section class="card condition-card"><div class="section-head"><div><span class="eyebrow">MULAI DARI KONDISIMU</span><h2>Sekarang, skripsimu sampai di mana?</h2><p>Pilih satu kondisi. Alerin akan menyiapkan langkah yang sesuai.</p></div></div><div class="condition-grid">${KONDISI.map((k, i) => `<button data-action="kondisi-set:${k.id}" class="condition-choice ${now === k.id ? 'selected' : ''}" ${now === k.id ? 'aria-current="true"' : ''}><span>${String(i + 1).padStart(2, '0')}</span><strong>${k.label}</strong></button>`).join('')}</div><p class="small muted mt">Pilihan tersimpan dalam personalisasi dan tidak perlu diulang setiap kali masuk.</p></section>`;
}
function targetCard() {
  const tg = targetNow(),
    urg = urgency(tg?.date);
  let body = '<p class="muted mt">Belum ada target terdekat.</p>';
  if (tg) {
    const d = new Date(tg.date + 'T12:00:00'),
      ag = tg.source === 'agenda' ? (S.agendas || []).find(x => x.id === tg.id) : null,
      phase = ag && ag.phase !== undefined && ag.phase !== null && ag.phase !== '' ? +ag.phase : null;
    body = `<div class="calendar-date"><div class="date-square"><span>${d.toLocaleDateString('id-ID', { month: 'short', timeZone: 'Asia/Jakarta' }).toUpperCase()}</span><strong>${d.getDate()}</strong></div><div><strong>${e(tg.text)}</strong><p class="small">${dateLong(tg.date)}${tg.time ? ' · ' + e(tg.time) + ' WIB' : ''}${urg.label ? ` · <span class="target-days">${urg.label}</span>` : ''}</p></div></div>${phase !== null ? `<p class="small muted">Tahap ${e(stageName(phase))}</p>` : ''}`;
  }
  const edit = tg ? (tg.source === 'agenda' ? 'cal-edit:' + tg.id : 'target') : 'target-suggest';
  return `<section class="card target-card ${urg.cls}"><div class="section-head"><h3>Target terdekat</h3>${I('target')}</div>${body}<div class="actions mt">${B(tg ? 'Ubah Target' : 'Tambah Target', edit, 'text', 'edit')}${B('Kalender Alerin', route === 'beranda' ? 'cal-preview' : 'calendar', 'soft', 'calendar')}</div></section>`;
}
/* Pratinjau Kalender Alerin Induk (QC 14 November). Kalender lengkap ada di Alerin Induk. */
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
    `<p class="small muted">Pratinjau kalender Alerin Induk</p><div class="between qc14-calendar-heading"><h3>${e(label)}</h3><div class="actions">${B('', 'cal-preview-month:-1', '', 'chevronLeft', 'aria-label="Bulan sebelumnya"')}${B('Bulan Ini', 'cal-preview-month:0', 'text')}${B('', 'cal-preview-month:1', '', 'chevronRight', 'aria-label="Bulan berikutnya"')}</div></div><div class="qc14-calendar-grid">${['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(d => `<strong class="qc14-day-label">${d}</strong>`).join('')}${Array.from({ length: pad }, () => '<span></span>').join('')}${Array.from(
      { length: days },
      (_, i) => {
        const date = calPreviewMonth + '-' + String(i + 1).padStart(2, '0'),
          count = events.filter(a => a.date === date).length;
        return `<div class="qc14-calendar-day ${date === today ? 'today' : ''}" aria-label="${e(dateLong(date))} · ${count} agenda"><strong>${i + 1}</strong>${count ? `<span class="qc14-agenda-dot" title="${count} agenda"></span>` : ''}</div>`;
      },
    ).join(
      '',
    )}</div><div class="qc14-calendar-agenda"><h3>Agenda bulan ini</h3>${events.length ? events.map(a => `<article><strong>${e(a.title)}</strong><p>${e(dateLong(a.date))}${a.time ? ' · ' + e(a.time) + ' WIB' : ''} · ${a.status}</p></article>`).join('') : '<p class="muted mt">Belum ada agenda pada bulan ini.</p>'}</div><p class="small muted mt">Pratinjau memakai agenda di perangkat ini; sinkronisasi ke kalender induk belum terhubung. Buka Kalender dari Beranda Alerin.</p>`,
    B('Tutup', 'close-modal') +
      `<a class="btn primary" href="https://alerin.id/" target="_blank" rel="noopener noreferrer">Menuju Kalender Alerin ${I('external')}</a>`,
    true,
  );
}
function stuckChoices() {
  return `<section class="card mt"><h2>Kita mulai dari yang paling memungkinkan.</h2><p class="muted mt">Pilih kendala yang paling dekat dengan kondisimu hari ini.</p><div class="stuck-grid">${[
    ['Bingung langkah selanjutnya', 'Judul saja sudah cukup untuk mulai meninjau.', 'nav:periksa'],
    ['Menunggu dosen atau pihak lain', 'Siapkan dulu: ' + parallelSuggestion().title.toLowerCase() + '.', 'stuck-parallel'],
    ['Kesulitan materi, metode, atau data', 'Bawa pertanyaanmu ke mentor.', 'nav:mentor'],
    ['Tidak sempat', 'Buat satu target kecil untuk minggu ini.', 'stuck-target'],
  ]
    .map(
      ([t, p, a], i) =>
        `<button class="stuck-option ${i === 0 ? 'featured' : ''}" data-action="${a}"><strong>${t}</strong><span>${e(p)}</span>${I('arrow')}</button>`,
    )
    .join('')}</div></section>`;
}
function parallelSuggestion() {
  const i = S.profile.lastStage ?? S.phase ?? 0;
  return i <= 2
    ? {
        title: 'Rapikan daftar pustaka Bab I–II',
        doing: 'Masukkan sumber yang sudah kamu baca ke Daftar Pustaka dan cek kelengkapannya.',
        part: 'prior',
      }
    : i <= 6
      ? {
          title: 'Siapkan instrumen pengumpulan data',
          doing: 'Cocokkan pertanyaan instrumen dengan setiap rumusan masalah.',
          part: 'collection',
        }
      : {
          title: 'Susun keterbatasan penelitian',
          doing: 'Catat keterbatasan yang benar-benar kamu alami selama penelitian.',
          part: 'limitations',
        };
}
function smallTarget() {
  const d = new Date(isoToday() + 'T12:00:00');
  const add = (7 - d.getDay()) % 7 || 7;
  d.setDate(d.getDate() + add);
  return {
    date: d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }),
    text: 'Selesaikan satu bagian kecil skripsimu minggu ini',
  };
}

Object.assign(ACTIONS, {
  'kondisi-pick': () => {
    modal('Kondisi Skripsimu', conditionChooser(), B('Kembali', 'close-modal'), true);
  },
  'kondisi-set': id => {
    const k = kondisiOf(id);
    if (!k) return;
    S.profile.kondisi = id;
    if (id !== 'terhenti') delete S.profile.lastStage;
    record('Kondisi skripsi diperbarui', k.label);
    synchronizeResearch();
    persist();
    closeModal(true);
    if (route !== 'beranda') go('beranda');
    else render();
    toast('Kondisi tersimpan: ' + k.label + '.');
  },
  'kondisi-sync': () => {
    const st = stageInfo();
    modal(
      'Perbarui kondisi akun?',
      `<p>Ubah tahap menurut akun menjadi <strong>${e(phaseName(st.idx))}</strong>?</p><p class="small muted mt">Ini pembaruan kondisi pengguna, bukan persetujuan pembimbing.</p>`,
      B('Nanti saja', 'close-modal') + B('Perbarui', 'kondisi-sync-ok', 'primary'),
    );
  },
  'kondisi-sync-ok': () => {
    const id = kondisiForStage(stageInfo().idx);
    S.profile.kondisi = id;
    record('Kondisi skripsi diperbarui', kondisiOf(id).label + ' · dari pemeriksaan');
    persist();
    closeModal(true);
    render();
    toast('Kondisi diperbarui: ' + kondisiOf(id).label + '.');
  },
  'kondisi-up': arg => {
    S.profile.kondisi = arg;
    record('Kondisi skripsi diperbarui', kondisiOf(arg).label);
    synchronizeResearch();
    persist();
    closeModal(true);
    render();
    toast('Kondisi diperbarui: ' + kondisiOf(arg).label + '.');
  },
  'last-stage-save': () => {
    S.profile.lastStage = +$('#last-stage').value;
    synchronizeResearch();
    persist();
    render();
    toast('Tahap terakhir tersimpan.');
  },
  'stuck-parallel': () => {
    const ps = parallelSuggestion(),
      t = partTask(ps.part, { title: ps.title, doing: ps.doing, kind: 'parallel', source: 'beranda' });
    reorderTasks(false);
    persist();
    progressTab = 'aktif';
    go('progres');
    toast(`“${t.title}” masuk ke Progres Aktif.`);
  },
  'stuck-target': () => {
    targetModal(smallTarget());
  },
  'target-suggest': () => {
    const k = kondisiOf(S.profile.kondisi);
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
