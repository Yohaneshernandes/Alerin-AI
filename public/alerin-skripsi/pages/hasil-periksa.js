'use strict';
/* Halaman hasil-periksa. Revisi 18 November: tiap temuan tampil satu kali (di bagian 03), tanpa daftar ulang
   di ringkasan dan di bagian Mentor; Tambahkan ke Progres langsung menautkan tanpa pop up. */
function findingCard(f, i) {
  const t = f.taskId && S.tasks.find(x => x.id === f.taskId);
  /* Kartu di Progres Aktif dibuka dari halaman Progres Aktif (QC 17 November), jadi di sini hanya diantar ke sana. */
  const aksi = t
    ? `<p class="small linked">${I('check')} Ada di Progres Aktif · ${e(t.title)}</p>${B('Lihat di Progres Aktif', 'lihat-pekerjaan:' + t.id, 'text')}`
    : B('Tambahkan ke Progres', 'finding-add:' + f.id, 'primary', 'plus');
  return `<article class="repair-card ${f.severity === 'kritis' ? 'crit' : ''}"><div class="between"><span class="eyebrow">TEMUAN ${String(i + 1).padStart(2, '0')}</span>${f.severity === 'kritis' ? badge('Penting', 'amber') : ''}</div><h3>${e(f.title)}</h3><p>${e(f.fix)}</p><p class="small muted">Lokasi: ${e(f.location)}</p>${PARTS[f.part] ? `<p class="small muted">Subbagian: ${e(partLabel(f.part))}</p>` : ''}<p class="small"><strong>Mengapa:</strong> ${e(f.why)}</p>${aksi}</article>`;
}
/* Bahan yang dibaca, masing-masing dengan label sumbernya. */
function reviewBasis(r) {
  const item = (ico, judul, ket) =>
    `<div class="basis-item">${I(ico)}<div><strong>${judul}</strong><p class="small muted">${ket}</p></div></div>`;
  const rows = r.files.map(f =>
    item(f.ok ? 'file' : 'warning', e(f.name), (f.ok ? e(f.info) : 'Gagal dibaca · ' + e(f.info)) + ' · sumber: dokumen yang diunggah'),
  );
  if (r.pasted) rows.push(item('document', 'Teks yang ditempel', `${r.pasted.toLocaleString('id-ID')} karakter · sumber: informasi pengguna`));
  if (r.title) rows.push(item('edit', 'Judul penelitian', `${e(r.title)} · sumber: informasi pengguna`));
  const notes = [];
  if (r.textLen && r.textLen < 1500 && r.mode === 'bab' && r.chapter !== 'title' && !r.part)
    notes.push('Teksnya pendek, jadi kelengkapan struktur bab tidak diperiksa. Unggah bab lengkap untuk pemeriksaan struktur.');
  if (r.sections.length) notes.push(`<strong>Bagian yang terbaca:</strong> ${e(r.sections.join(', '))}`);
  else if (r.textLen) notes.push('Alerin belum mengenali judul subbagian di naskah ini.');
  if (r.focus) notes.push(`<strong>Yang kamu minta diperhatikan:</strong> ${e(r.focus)}`);
  return `<div class="review-basis">${rows.join('') || item('edit', 'Judul saja', 'Hanya judul yang diperiksa.')}</div>${notes.map(n => `<p class="small muted mt">${n}</p>`).join('')}`;
}
function hasilPeriksaPage() {
  const r = latestReview();
  if (!r)
    return (
      pageHead('Hasil Periksa Skripsi', 'Belum ada pemeriksaan.') +
      pageEmpty('Belum ada hasil pemeriksaan', 'Pilih judul, bab, atau kesiapan yang ingin diperiksa.', 'nav:periksa', 'Periksa Skripsi')
    );
  const kuat = (r.strengths || []).filter(([j]) => j !== 'Subbagian sudah terbaca'),
    n = r.findings.length,
    crit = r.findings.filter(f => f.severity === 'kritis').length,
    tertaut = r.findings.filter(f => f.taskId).length,
    stage = reviewStage(r);
  const desc = n
    ? `Alerin menemukan ${n} hal yang perlu kamu perbaiki${crit ? `, ${crit} di antaranya penting dicek lebih dulu` : ''}. ${tertaut}/${n} sudah ada di Progres Aktif.`
    : 'Aturan pemeriksaan Alerin tidak menemukan masalah pada bahan ini. Tetap bahas bersama pembimbingmu.';
  const meta = [r.scope, stage !== null ? 'Tahap terbaca: ' + stageName(stage) : '', localTime(r.date) + ' WIB', 'Contoh, belum analisis AI']
    .filter(Boolean)
    .join(' · ');
  const head = (no, title, extra = '') =>
    `<div class="report-heading"><span>${no}</span><h2>${title}</h2>${extra}</div>`;
  const strong = kuat.length
    ? `<h3 class="mt">Yang Sudah Kuat (${kuat.length})</h3>${kuat.map(([judul, ket]) => `<article class="review-observation strength"><h3>${I('check')} ${e(judul)}</h3><p>${e(ket)}</p></article>`).join('')}`
    : '';
  return (
    pageHead('Hasil Periksa Skripsi', e(r.title || S.title || 'Judul belum diisi')) +
    `<div class="review-report"><section class="card report-section">${head('01', 'Hasil Peninjauan Alerin', badge(n ? n + ' temuan' : 'Belum ada temuan', n ? 'amber' : 'green'))}<p class="review-scope">${e(meta)}</p><p>${e(desc)}</p>${strong}<p class="small muted mt">Dibaca dari bahan yang kamu kirim, bukan penilaian akhir. Persetujuan pembimbing dan persyaratan kampus tidak dinilai Alerin.</p><div class="actions mt">${B('Periksa Ulang', 'periksa-ulang', 'text', 'refresh')}</div></section>` +
    `<section class="card report-section">${head('02', 'Dasar Pemeriksaan')}${reviewBasis(r)}</section>` +
    `<section class="card report-section">${head('03', 'Hal yang Perlu Diperbaiki')}${n ? `<p class="muted mt">Tambahkan temuan ke Progres Aktif agar menjadi pekerjaan. Temuan untuk subbagian yang sudah punya kartu masuk ke kartu itu. Maksimal tiga pekerjaan aktif; sisanya masuk antrean.</p><div class="repair-cards">${r.findings.map(findingCard).join('')}</div>` : '<p class="muted mt">Tidak ada temuan dari aturan pemeriksaan Alerin.</p>'}</section>` +
    `<section class="card report-section mentor-handoff">${head('04', 'Bahas dengan Mentor')}<p class="mt">Butuh tinjauan manusia? Ringkasan dan temuan pemeriksaan ini ikut terbawa ke Dukungan Mentor, jadi kamu tidak perlu menjelaskan ulang.</p><div class="actions mt">${B('Siapkan Bimbingan', 'mentor-from-review', 'primary', 'people')}</div></section></div><p class="v6-disclaimer">Disclaimer: ${e(DISCLAIMER.replace(/^Disclaimer:\s*/, ''))}</p>`
  );
}
/* Tambahkan ke Progres: satu kartu per subbagian (keputusan 16 November).
   - Subbagian sudah punya kartu → temuan masuk ke kartu itu; kartu yang Selesai dibuka lagi dengan alasan
     "Temuan pemeriksaan baru".
   - Belum punya kartu → kartu baru untuk subbagian tersebut. */
function addFindingToProgress(fid) {
  const r = latestReview(),
    f = r?.findings.find(x => x.id === fid);
  if (!f || f.taskId) return;
  let t = S.tasks.find(x => x.part === f.part && x.status !== 'deferred');
  const ada = !!t;
  if (t) {
    if (t.status === 'done') {
      t.status = 'todo';
      t.reopenReason = 'Temuan pemeriksaan baru';
      t.completedAt = null;
      record('Pekerjaan dibuka lagi', t.title + ' · Temuan pemeriksaan baru');
    }
  } else
    t =
      PARTS[f.part] && !S.tasks.some(x => x.part === f.part)
        ? partTask(f.part, { title: 'Perbaiki: ' + f.title, source: 'periksa', reason: f.why, doing: f.fix })
        : plainTask({
            title: 'Perbaiki: ' + f.title,
            part: f.part,
            phase: partPhase(f.part),
            source: 'periksa',
            reason: f.why,
            doing: f.fix,
            deliverable: 'Bagian yang sudah kamu perbaiki sendiri.',
          });
  (t.findingIds ??= []).includes(f.id) || t.findingIds.push(f.id);
  f.taskId = t.id;
  record('Temuan masuk ke Progres Aktif', f.title + ' → ' + t.title);
  const same = reorderTasks(true, 'Ada temuan pemeriksaan baru');
  if (same) fillSlots();
  persist();
  render();
  toast(ada ? `Temuan masuk ke kartu “${t.title}”.` : `Kartu baru “${t.title}” dibuat di Progres Aktif.`);
}

Object.assign(ACTIONS, {
  'finding-add': arg => {
    addFindingToProgress(arg);
  },
});
