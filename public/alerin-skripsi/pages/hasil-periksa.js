'use strict';
/* Halaman hasil-periksa. */
function findingCard(f, i) {
  const t = f.taskId && S.tasks.find(x => x.id === f.taskId);
  const aksi = t
    ? `<p class="small linked">${I('check')} Ada di Progres Aktif · ${e(t.title)}</p>${B('Lihat Kartu', 'task:' + t.id, 'text')}`
    : B('Tambahkan ke Progres', 'finding-add:' + f.id, 'primary', 'plus');
  return `<article class="repair-card ${f.severity === 'kritis' ? 'crit' : ''}"><div class="between"><span class="eyebrow">TEMUAN ${String(i + 1).padStart(2, '0')}</span>${f.severity === 'kritis' ? badge('Penting', 'amber') : ''}</div><h3>${e(f.title)}</h3><p>${e(f.fix)}</p><p class="small muted">Bagian: ${e(f.location)}</p><p class="small"><strong>Mengapa:</strong> ${e(f.why)}</p>${aksi}</article>`;
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
  if (r.textLen && r.textLen < 1500 && r.mode === 'bab')
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
      pageEmpty('Belum ada hasil pemeriksaan', 'Pilih bab atau kesiapan yang ingin diperiksa.', 'nav:periksa', 'Periksa Skripsi')
    );
  const kuat = r.strengths || [],
    n = r.findings.length,
    crit = r.findings.filter(f => f.severity === 'kritis').length,
    tertaut = r.findings.filter(f => f.taskId).length,
    stage = reviewStage(r);
  const desc = n
    ? `Alerin menemukan ${n} hal yang perlu kamu perbaiki${crit ? `, ${crit} di antaranya penting dicek lebih dulu` : ''}. ${tertaut}/${n} sudah ada di Progres Aktif.`
    : 'Aturan pemeriksaan Alerin tidak menemukan masalah pada bahan ini. Tetap bahas bersama pembimbingmu.';
  const head = (no, title, extra = '') =>
    `<div class="report-heading"><span>${no}</span><h2>${title}</h2>${extra}</div>`;
  const obs = r.findings
    .slice(0, 3)
    .map(f => `<article class="review-observation"><h3>${e(f.title)}</h3><p>${e(f.why)}</p><p class="small muted">Lokasi: ${e(f.location)}</p></article>`)
    .join('');
  const strong = kuat.length
    ? `<h3 class="mt">Yang Sudah Kuat (${kuat.length})</h3>${kuat.map(([judul, ket]) => `<article class="review-observation strength"><h3>${I('check')} ${e(judul)}</h3><p>${e(ket)}</p></article>`).join('')}`
    : '';
  const ringkas = r.findings.slice(0, 3).map(f => `<li>${e(f.title)}</li>`).join('');
  return (
    pageHead('Hasil Periksa Skripsi', e(r.title || S.title || 'Judul belum diisi')) +
    `<div class="review-report"><section class="card report-section">${head('01', 'Hasil Peninjauan Alerin', badge(n ? n + ' temuan' : 'Belum ada temuan', n ? 'amber' : 'green'))}<p class="review-scope">${e(r.scope)} · ${e(localTime(r.date))} WIB · Contoh, belum analisis AI</p><p>${e(desc)}</p>${obs}${strong}<p class="small muted mt"><strong>Cakupan:</strong> ${e(r.scope)}${stage !== null ? ` · <strong>Tahap terbaca:</strong> ${e(stageName(stage))}` : ''} · <strong>Sumber:</strong> pemeriksaan Alerin</p><p class="small muted">Persetujuan pembimbing: Belum dikonfirmasi · Persyaratan kampus: Belum dinilai. Dibaca dari bahan yang kamu kirim, bukan penilaian akhir.</p></section>` +
    `<section class="card report-section">${head('02', 'Dasar Pemeriksaan')}${reviewBasis(r)}<p class="small muted mt">Temuan bersumber dari teks yang terbaca. Pemeriksaan awal belum menjalankan penilaian akademik oleh model AI.</p></section>` +
    `<section class="card report-section">${head('03', 'Hal yang Perlu Diperbaiki')}${n ? `<p class="muted mt">${n} pekerjaan perbaikan dari temuan pemeriksaan. Maksimal tiga pekerjaan aktif; pekerjaan lain tetap tersimpan dalam antrean.</p><div class="repair-cards">${r.findings.map(findingCard).join('')}</div>` : '<p class="muted mt">Tidak ada temuan dari aturan pemeriksaan Alerin.</p>'}</section>` +
    `<section class="card report-section mentor-handoff">${head('04', 'Handoff ke Mentor untuk Bimbingan')}<p class="mt">Butuh tinjauan manusia? Hasil pemeriksaan ini ikut terbawa ke Dukungan Mentor, jadi kamu tidak perlu menjelaskan ulang.</p>${ringkas ? `<ul class="handoff-list">${ringkas}</ul>${n > 3 ? `<p class="small muted">dan ${n - 3} temuan lainnya</p>` : ''}` : ''}<div class="actions mt">${B('Siapkan Bimbingan', 'mentor-from-review', 'primary', 'people')}${B('Periksa Ulang', 'periksa-ulang', '', 'refresh')}</div></section></div><p class="v6-disclaimer">Disclaimer: ${e(DISCLAIMER.replace(/^Disclaimer:\s*/, ''))}</p>`
  );
}
function linkFindingModal(fid) {
  const r = latestReview(),
    f = r?.findings.find(x => x.id === fid);
  if (!f) return;
  const same = S.tasks.find(t => t.part === f.part && t.status !== 'deferred'),
    first = same || activeTasks()[0];
  const opt = (v, t, d, on) =>
    `<label class="choice"><input type="radio" name="link-mode" value="${v}" ${on ? 'checked' : ''}><span><strong>${t}</strong><small>${d}</small></span></label>`;
  modal(
    'Tambahkan ke Progres Aktif',
    `<p class="small muted">Temuan: <strong>${e(f.title)}</strong></p><div class="choices">${first ? opt('link:' + first.id, `Tautkan ke “${e(first.title)}”`, first.status === 'done' ? 'Kartu ini sudah selesai dan akan dibuka lagi dengan alasan Temuan pemeriksaan baru.' : 'Temuan muncul di kartu ini, tanpa menambah kartu baru.', true) : ''}${opt('new', 'Buat pekerjaan baru', `Kartu baru untuk ${e(PARTS[f.part] ? partLabel(f.part) : 'temuan ini')}.`, !first)}</div>`,
    B('Batal', 'close-modal') + B('Simpan', 'finding-save:' + fid, 'primary'),
  );
}
function saveFindingLink(fid) {
  const r = latestReview(),
    f = r?.findings.find(x => x.id === fid);
  if (!f) return;
  const v = $('input[name="link-mode"]:checked')?.value || 'new';
  let t;
  if (v.startsWith('link:')) {
    t = S.tasks.find(x => x.id === v.slice(5));
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
  closeModal(true);
  const same = reorderTasks(true);
  if (same) fillSlots();
  persist();
  render();
  toast(`Temuan tertaut ke “${t.title}”.`);
}

Object.assign(ACTIONS, {
  'finding-add': arg => {
    linkFindingModal(arg);
  },
  'finding-save': arg => {
    saveFindingLink(arg);
  },
});
