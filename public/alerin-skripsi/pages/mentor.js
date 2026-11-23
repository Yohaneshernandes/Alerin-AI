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

function mentorSummaryData(r = latestReview(), note = '') {
  const t = activeTasks()[0],
    rev = pendingRevisions()[0],
    st = stageInfo(),
    bawaan = mentorFindings(r);

  const judul = S.title || 'Belum ditentukan';
  const tahap =
    st.idx !== null
      ? `${positionLabel(st.idx)} · ${st.source}`
      : st.akun !== null && ALERIN.phases[st.akun]
        ? `${ALERIN.phases[st.akun][0]} · menurut personalisasi`
        : 'Penentuan Topik atau Judul · menurut personalisasi';
  const kendala = String(ensureKonteks().kendala || '').trim() || 'Belum dicatat';

  let temuan = 'Belum ada pemeriksaan.';
  if (r && r.findings && r.findings.length) {
    temuan =
      `${r.scope} · ${r.findings.length} hal perlu diperbaiki: ` +
      r.findings.slice(0, 3).map(f => f.title).join('; ');
  } else if (bawaan.length) {
    temuan = bawaan.map((f, i) => `${i + 1}) ${f.title} (${f.location})`).join('; ');
  }

  const dasar = r ? r.scope : 'Belum ada bahan pemeriksaan.';
  const prioritas = t ? t.title : 'Belum ada pekerjaan aktif.';
  const arahan = rev
    ? `${rev.topic} · ${rev.text.length > 140 ? rev.text.slice(0, 137) + '…' : rev.text}`
    : 'Belum ada arahan tertunda.';
  const pertanyaan = note.trim() || '[isi sebelum bimbingan]';

  return { judul, tahap, kendala, temuan, dasar, prioritas, arahan, pertanyaan };
}

function mentorSummaryHtml(r, note = '') {
  const d = mentorSummaryData(r, note);
  return `
    <div class="mentor-summary-item">Ringkasan untuk Mentor</div>
    <div class="mentor-summary-item">Judul: ${e(d.judul)}</div>
    <div class="mentor-summary-item">Tahap: ${e(d.tahap)}</div>
    <div class="mentor-summary-item">Kendala: ${e(d.kendala)}</div>
    <div class="mentor-summary-item">Temuan pemeriksaan terbaru:<br/>${e(d.temuan)}</div>
    <div class="mentor-summary-item">Dasar pemeriksaan: ${e(d.dasar)}</div>
    <div class="mentor-summary-item">Prioritas Utama: ${e(d.prioritas)}</div>
    <div class="mentor-summary-item">Arahan dosen: ${e(d.arahan)}</div>
    <div class="mentor-summary-item">Pertanyaan: ${e(d.pertanyaan)}</div>
  `;
}

function mentorMessage(r, note = '') {
  const d = mentorSummaryData(r, note);
  return `Halo Minma, saya ${S.profile.name || ''}, mahasiswa ${S.profile.level || 'S1'} ${S.profile.major || ''} semester ${S.profile.semester || '-'}. Saya ingin konsultasi dengan Mentor Class Program.

Ringkasan untuk Mentor
Judul: ${d.judul}
Tahap: ${d.tahap}
Kendala: ${d.kendala}
Temuan pemeriksaan terbaru:
${d.temuan}
Dasar pemeriksaan: ${d.dasar}
Prioritas Utama: ${d.prioritas}
Arahan dosen: ${d.arahan}
Pertanyaan: ${d.pertanyaan}`.replace(/  +/g, ' ');
}

function mentorPage() {
  const bawaan = mentorFindings(),
    note = S.mentorNote || '',
    msg = mentorMessage(latestReview(), note);
  const temuanChip = bawaan.length
    ? `<div class="mentor-attached-findings"><span>${bawaan.length} temuan pemeriksaan disertakan</span><button type="button" class="btn text small" data-action="mentor-clear-review">Jangan sertakan</button></div>`
    : '';

  return `
    <div class="mentor-page-head">
      <h1>Dukungan Mentor</h1>
      <p>Sampaikan kendalamu pada Mentor, agar skripsian jadi lebih terarah</p>
    </div>
    <section class="mentor-card">
      <h2 class="mentor-card-title">Ringkasan bimbingan</h2>
      <div class="field mentor-field">
        <div class="mentor-field-label-row">
          <label for="mentor-note" class="mentor-field-label">Pertanyaan untuk mentor <span class="req">*</span></label>
          <span class="mentor-counter" data-count="mentor-note">${note.length}/1500</span>
        </div>
        <textarea id="mentor-note" data-mentor="1" maxlength="1500" placeholder="Apa yang ingin kamu klarifikasikan?" class="mentor-textarea">${e(note)}</textarea>
      </div>
      ${temuanChip}
      <details class="mentor-accordion" open>
        <summary class="mentor-accordion-toggle">
          <span>Contoh ringkasan</span>
          <svg class="mentor-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 5L5 1L9 5"/>
          </svg>
        </summary>
        <div class="mentor-summary-box" id="mentor-preview">
          ${mentorSummaryHtml(latestReview(), note)}
        </div>
      </details>
      <div class="mentor-actions">
        <a class="mentor-btn-wa" id="mentor-link" href="${waLink(msg)}" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.23c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.12.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.53.59.19 1.14.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29"/>
          </svg>
          <span>Lanjut ke WhatsApp</span>
        </a>
        <a class="mentor-btn-web" href="https://classprogram.id/" target="_blank" rel="noopener noreferrer">
          <span>Website Class Program</span>
        </a>
      </div>
      <p class="mentor-footer-note">Pesan masuk ke Minma, admin Class Program, lalu diteruskan ke mentor yang sesuai.</p>
    </section>
  `;
}

function onMentorInput(el) {
  S.mentorNote = el.value;
  unsaved = true;
  const message = mentorMessage(latestReview(), el.value.trim());
  const preview = $('#mentor-preview');
  if (preview) preview.innerHTML = mentorSummaryHtml(latestReview(), el.value.trim());
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
