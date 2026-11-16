'use strict';
/* Halaman mentor. */
const MINMA_WA = '6281234361959';
const DISCLAIMER =
  'Disclaimer: Alerin AI tidak menjamin hasil analisis yang sempurna, kamu perlu mengecek hasilnya kembali, konsultasikan pada Dosen Pembimbing atau Mentor Class Program, ya.';
const waLink = text => `https://wa.me/${MINMA_WA}?text=${encodeURIComponent(text)}`;
/* Temuan yang dibawa lewat "Kirim ke Mentor". Kosong kalau pemeriksaannya sudah bukan yang terbaru. */
function mentorFindings(r = latestReview()) {
  return r && S.mentorReview === r.id ? r.findings : [];
}
function mentorSummaryRows(r = latestReview()) {
  const t = activeTasks()[0],
    rev = pendingRevisions()[0],
    bawaan = mentorFindings(r);
  const rows = [
    ['Judul', S.title || 'Belum dipilih'],
    ['Tahap', stageText().full],
    ['Prioritas Utama', t ? t.title : 'Belum ada pekerjaan aktif'],
  ];
  if (r)
    rows.push([
      'Pemeriksaan terbaru',
      `${r.scope} · ${r.findings.length} hal perlu diperbaiki` +
        (r.findings.length
          ? ': ' +
            r.findings
              .slice(0, 3)
              .map(f => f.title)
              .join('; ')
          : ''),
    ]);
  if (bawaan.length)
    rows.push(['Temuan yang ingin ditinjau', bawaan.map((f, i) => `${i + 1}) ${f.title} (${f.location})`).join(' ')]);
  if (rev)
    rows.push([
      'Arahan dosen tertunda',
      rev.topic + ' · ' + (rev.text.length > 140 ? rev.text.slice(0, 137) + '…' : rev.text),
    ]);
  return rows;
}
function mentorMessage(r, kendala = '') {
  return `Halo Minma, saya ${S.profile.name || ''}, mahasiswa ${S.profile.level || 'S1'} ${S.profile.major || ''} semester ${S.profile.semester || '-'}. Saya ingin konsultasi dengan Mentor Class Program.\n\n${kendala ? 'Kendala:\n' + kendala + '\n\n' : ''}Ringkasan dari Alerin Skripsi:\n${mentorSummaryRows(
    r,
  )
    .map(([h, v]) => `- ${h}: ${v}`)
    .join('\n')}`.replace(/  +/g, ' ');
}
function mentorPage() {
  const bawaan = mentorFindings(),
    note = S.mentorNote || '',
    msg = mentorMessage(latestReview(), note);
  const temuan = bawaan.length
    ? `<section class="v6-linked-directions"><div class="between"><h4>Temuan terbaru yang ikut dikirim (${bawaan.length})</h4>${B('Jangan sertakan', 'mentor-clear-review', 'text')}</div>${bawaan.map(f => `<div class="v6-direction-excerpt"><strong>${e(f.title)}</strong><p class="small muted">${e(f.location)}</p></div>`).join('')}<p class="small muted">Sumber: pemeriksaan Alerin · ${e(latestReview().scope)}</p></section>`
    : '';
  return (
    pageHead('Dukungan Mentor', 'Sampaikan kendalamu pada Mentor, agar skripsian jadi lebih terarah') +
    `<section class="card mentor-preparation"><h2>Ringkasan bimbingan</h2><div class="field"><label for="mentor-note">Pertanyaan untuk mentor <span class="required-label">Wajib</span></label><textarea id="mentor-note" maxlength="1000" data-mentor="1" placeholder="Apa yang ingin kamu klarifikasikan?" rows="3">${e(note)}</textarea><div class="field-meta"><span></span><span data-count="mentor-note">${note.length}/1000</span></div></div>${temuan}<details open><summary>Periksa ringkasan</summary><pre class="v3-mentor-preview" id="mentor-preview">${e(msg)}</pre></details><div class="actions mt"><a class="btn primary" id="mentor-link" href="${waLink(msg)}" target="_blank" rel="noopener">${I('people')}Lanjut ke WhatsApp</a><a class="btn" href="https://classprogram.id/" target="_blank" rel="noopener noreferrer">Website Class Program</a></div><p class="small muted mt">Pesan disiapkan terlebih dahulu; pengiriman tetap dilakukan oleh pengguna di WhatsApp. Pesan masuk ke Minma, admin Class Program, lalu diteruskan ke mentor yang sesuai.</p></section>`
  );
}
function onMentorInput(el) {
  S.mentorNote = el.value;
  unsaved = true;
  const message = mentorMessage(latestReview(), el.value.trim());
  const preview = $('#mentor-preview');
  if (preview) preview.textContent = message;
  const link = $('#mentor-link');
  if (link) link.href = waLink(message);
}
function checkMentorLink(ev) {
  clearErrors();
  const note = $('#mentor-note')?.value.trim() || '';
  if (note.length < 10 || isAsal(note)) {
    ev.preventDefault();
    const message = note
      ? 'Ceritakan kendalamu dengan kalimat yang jelas, minimal 10 karakter.'
      : 'Kolom ini perlu diisi dulu.';
    fieldError('mentor-note', message);
    focusFirstError();
    return;
  }
  S.mentorNote = note;
  persist();
  record('Pesan ke mentor disiapkan', 'WhatsApp Minma');
}

Object.assign(ACTIONS, {
  'mentor-from-review': () => {
    const r = latestReview();
    if (!r) return go('periksa');
    S.mentorReview = r.id;
    if (!String(S.mentorNote || '').trim())
      S.mentorNote = `Saya ingin meminta tinjauan mentor atas hasil pemeriksaan ${r.scope}${r.findings.length ? `, terutama ${r.findings.length} temuan yang tercantum` : ''}.`;
    record('Hasil pemeriksaan dibawa ke Dukungan Mentor', r.scope);
    persist();
    go('mentor');
    toast('Temuan terbaru sudah terisi. Tambahkan kendalamu bila perlu.');
  },
  'mentor-clear-review': () => {
    S.mentorReview = '';
    persist();
    render();
    toast('Temuan tidak disertakan di pesan.');
  },
});
