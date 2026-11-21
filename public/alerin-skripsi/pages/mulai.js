'use strict';
/* Halaman mulai. */
function guideSeed() {
  ensureGuide();
  const f = S.guide.fields,
    d = S.draft || {},
    sp = splitTheoryMethod(d.idea);
  f.background ??= { f0: [d.topic, d.location].filter(Boolean).join(' · '), f1: d.phenomenon || '', f2: '', f3: '' };
  f.design ??= { f0: sp.method ? capitalize(sp.method) : S.profile.method || '', f1: '', f2: '' };
  if (sp.theory) f.theory ??= { f0: '', f1: capitalize(sp.theory), f2: '' };
}
const METODE = ['Kualitatif', 'Kuantitatif', 'Metode campuran', 'Penelitian dan pengembangan (R&D)', 'Belum ditentukan'];
function ensureKonteks() {
  S.konteks ??= { chapter: '', method: '', deadline: '', kendala: '', title: '', savedAt: '' };
  if (!SUSUNAN[S.konteks.susunan]) S.konteks.susunan = 'umum';
  return S.konteks;
}
const semesterValid = () => +S.profile.semester >= 1 && +S.profile.semester <= 14;
/* Lencana "Konteks tersimpan" hanya muncul kalau kolom wajib terisi dan sudah disimpan. */
const konteksLengkap = () => semesterValid() && !!ensureKonteks().method && !!S.konteks.savedAt;
function mulaiView() {
  ensureGuide();
  const v = S.guide.view;
  if (v === 'konteks' || !v) return 'konteks';
  if (['idea', 'guide', 'saran'].includes(v)) return v;
  return 'konteks';
}
function mulaiPage() {
  const view = mulaiView();
  if (view === 'guide') return workspaceView();
  if (view === 'saran') return strukturView();
  if (view === 'idea') return ideaPageView();
  return konteksView();
}
/* Pemilih bab dan subbagian (tampilan GPT: Peta Skripsi · Panduan Penyusunan).
   Dropdown hanya memuat subbagian bab yang sedang dipilih (QC 17 November). */
function chapterNav(view) {
  ensureGuide();
  const id = S.guide.part,
    p = PARTS[id],
    cur = view === 'guide' && p ? CHAPTERS[p.chapter - 1] : null;
  const select = cur
    ? `<label for="part-select">Subbagian Bab ${cur[0]} · ${e(cur[1])}</label><select id="part-select" data-part-select="1">${cur[2]
        .filter(x => partApplies(x[0]))
        .map(x => {
          const st = partStatus(x[0]);
          return `<option value="${x[0]}" ${x[0] === id ? 'selected' : ''}>${e(PARTS[x[0]].name)}${st[0] ? ' · ' + st[1] : ''}</option>`;
        })
        .join('')}</select>`
    : `<p class="small muted v4-map-hint">Pilih bab untuk melihat subbagiannya.</p>`;
  return `<section class="card v4-map-picker"><span class="eyebrow">PETA SKRIPSI · PANDUAN PENYUSUNAN</span><div class="v4-chapters">${B('Topik / Judul', 'guide-view:idea', view === 'idea' ? 'primary' : 'soft')}${CHAPTERS.map((c, ci) => B('Bab ' + c[0], 'guide-bab:' + (ci + 1), view === 'guide' && p?.chapter === ci + 1 ? 'primary' : 'soft', '', `title="${e(c[1])}"`)).join('')}</div>${select}</section>`;
}
/* Susunan bab kampus di Konteks Skripsi: aturan dan pratinjau babnya. */
const SUSUNAN_NOTE = {
  umum: 'Bawaan. Hasil dan Pembahasan dalam satu bab.',
  hasil6: 'Hasil Penelitian dan Pembahasan menjadi dua bab.',
  konsep6: 'Kerangka Berpikir dan Hipotesis menjadi bab sendiri.',
};
const SUSUNAN_LABELS = {
  umum: '5 bab · Umum',
  hasil6: '6 bab · Hasil dan Pembahasan terpisah',
  konsep6: '6 bab · Kerangka Konseptual terpisah',
};
function susunanPreview() {
  return CHAPTERS.map(
    c => `
    <div class="mulai-chapter-pill">
      <strong class="mulai-pill-bab">Bab ${c[0]}</strong>
      <span class="mulai-pill-name">${e(c[1])}</span>
    </div>
  `,
  ).join('');
}
function chapterOptions(val) {
  return `<option value="">Masih mencari ide</option>${CHAPTERS.map((ch, i) => `<option value="${i + 1}" ${String(val) === String(i + 1) ? 'selected' : ''}>Bab ${ch[0]} · ${e(ch[1])}</option>`).join('')}`;
}
function refreshSusunanField() {
  const box = $('#susunan-preview'),
    sel = $('#ctx-chapter');
  if (box) box.innerHTML = susunanPreview();
  if (sel) sel.innerHTML = chapterOptions(ensureKonteks().chapter);
  $$('.mulai-pedoman-card').forEach(l => {
    const radio = l.querySelector('input');
    l.classList.toggle('selected', !!radio?.checked);
  });
  const subDesk = $('.mulai-page-head .mulai-sub-desktop') || $('#main .page-head p');
  if (subDesk) subDesk.textContent = `Panduan pengerjaan dari penentuan arah sampai Bab ${lastRoman()}.`;
}
function konteksView() {
  const c = ensureKonteks();
  const opsi = (list, val, kosong) =>
    (kosong !== null ? `<option value="">${kosong}</option>` : '') +
    list.map(([v, l]) => `<option value="${e(v)}" ${String(val) === String(v) ? 'selected' : ''}>${e(l)}</option>`).join('');
  const titleVal = c.title || S.title || '';
  const campus = S.profile.campus || 'Universitas Indonesia';
  const major = S.profile.major || 'Ilmu Komunikasi';
  const semester = semesterValid() ? S.profile.semester : '7';

  return `
    <div class="mulai-page-head">
      <h1>Mulai Skripsi</h1>
      <p class="mulai-sub-desktop">Panduan pengerjaan dari penentuan arah sampai Bab ${lastRoman()}.</p>
      <p class="mulai-sub-mobile">Panduan penyusunan dan penentuan<br/>arah skripsi Bab I sampai selesai</p>
    </div>
    <div class="mulai-main-card">
      <div class="mulai-card-head">
        <h2 class="mulai-card-title">Konteks Skripsi</h2>
      </div>

      <div class="mulai-identity-box">
        <div class="mulai-identity-icon-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#186DD8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21h18"></path>
            <path d="M5 21V7l7-4 7 4v14"></path>
            <path d="M9 10h1"></path>
            <path d="M14 10h1"></path>
            <path d="M9 14h1"></path>
            <path d="M14 14h1"></path>
          </svg>
        </div>
        <div class="mulai-identity-info">
          <div class="mulai-identity-campus">${e(campus)}</div>
          <div class="mulai-identity-major">${e(major)}</div>
          <div class="mulai-identity-note">Identitas mengikuti Profil di Alerin Induk.</div>
        </div>
      </div>

      <div class="mulai-pedoman-box">
        <div class="mulai-pedoman-title">Pilih sesuai Pedoman Kampus</div>
        <div class="mulai-pedoman-options">
          ${Object.entries(SUSUNAN)
            .map(([k, v]) => {
              const isSel = susunanId() === k;
              const label = SUSUNAN_LABELS[k] || v.label;
              return `
                <label class="mulai-pedoman-card ${isSel ? 'selected' : ''}">
                  <input type="radio" name="ctx-susunan" value="${k}" data-bind="konteks.susunan" ${isSel ? 'checked' : ''} class="native-input">
                  <div class="mulai-radio-indicator">
                    <div class="mulai-radio-dot"></div>
                  </div>
                  <div class="mulai-pedoman-content">
                    <div class="mulai-pedoman-name">${e(label)}</div>
                    <div class="mulai-pedoman-desc">${e(SUSUNAN_NOTE[k])}</div>
                  </div>
                </label>
              `;
            })
            .join('')}
        </div>
        <div class="mulai-chapter-pills" id="susunan-preview" aria-live="polite">
          ${susunanPreview()}
        </div>
      </div>

      <div class="mulai-form-grid">
        <div class="field mulai-field">
          <label for="ctx-semester" class="mulai-label">Semester<span class="mulai-req">*</span></label>
          <select id="ctx-semester" class="mulai-select" aria-required="true">
            ${opsi(
              Array.from({ length: 14 }, (_, i) => [String(i + 1), String(i + 1)]),
              semester,
              'Pilih semester',
            )}
          </select>
        </div>

        <div class="field mulai-field">
          <label for="ctx-chapter" class="mulai-label">Bagian yang ingin dikerjakan</label>
          <select id="ctx-chapter" class="mulai-select" data-bind="konteks.chapter">
            ${chapterOptions(c.chapter)}
          </select>
        </div>

        <div class="field mulai-field">
          <div class="mulai-label-row">
            <label for="ctx-deadline" class="mulai-label">Target penyelesaian skripsi</label>
            <span class="mulai-opt">Opsional</span>
          </div>
          <div class="mulai-date-wrap">
            <input id="ctx-deadline" type="date" class="mulai-input mulai-date-input" max="${DATE_MAX}" min="${isoToday()}" data-bind="konteks.deadline" value="${e(c.deadline || '')}">
            <svg class="mulai-date-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#202E42" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
        </div>

        <div class="field mulai-field">
          <label for="ctx-method" class="mulai-label">Metode<span class="mulai-req">*</span></label>
          <select id="ctx-method" class="mulai-select" data-bind="konteks.method" aria-required="true">
            ${opsi(
              METODE.map(m => [m, m]),
              c.method,
              'Pilih metode',
            )}
          </select>
        </div>
      </div>

      <div class="field mulai-field-full">
        <div class="mulai-label-row">
          <label for="ctx-kendala" class="mulai-label">Kendala</label>
          <span class="mulai-opt">Opsional</span>
          <span class="mulai-count" data-count="ctx-kendala">${String(c.kendala || '').length}/350</span>
        </div>
        <textarea id="ctx-kendala" maxlength="350" data-bind="konteks.kendala" placeholder="Bagian yang masih membingungkan" class="mulai-textarea" rows="3">${e(c.kendala || '')}</textarea>
      </div>

      <div class="field mulai-field-full">
        <div class="mulai-label-row">
          <label for="ctx-title" class="mulai-label">Judul yang sudah dimiliki</label>
          <span class="mulai-opt">Opsional</span>
          <span class="mulai-count" data-count="ctx-title">${titleVal.length}/350</span>
        </div>
        <textarea id="ctx-title" maxlength="350" data-bind="konteks.title" placeholder="Kosongkan jika masih mencari judul." class="mulai-textarea" rows="3">${e(titleVal)}</textarea>
      </div>

      <div class="mulai-submit-row">
        <button type="button" class="mulai-btn-submit" data-action="konteks-save">
          <span>Simpan dan Lanjutkan</span>
        </button>
      </div>
    </div>
  `;
}
function ideaPageView() {
  ensureGuide();
  const d = S.draft || {};
  const topics = [
    'Film sebagai media belajar',
    'Literasi informasi mahasiswa',
    'Komunikasi kesehatan digital',
    'Pengalaman audiens media sosial',
  ];

  return `
    <div class="mulai-page-head">
      <h1>Mulai Skripsi</h1>
      <p class="mulai-sub-desktop">Panduan pengerjaan dari penentuan arah sampai Bab ${lastRoman()}.</p>
      <p class="mulai-sub-mobile">Panduan penyusunan dan penentuan<br/>arah skripsi Bab I sampai selesai</p>
    </div>

    <!-- CARD 1: PETA SKRIPSI (STEPPER) -->
    <div class="idea-card idea-stepper-card">
      <div class="idea-card-header">
        <h2 class="idea-card-title">Peta Skripsi</h2>
      </div>
      <div class="idea-stepper-wrap">
        <div class="idea-stepper-track"></div>
        <div class="idea-stepper-list">
          <div class="idea-step-item active" data-action="guide-view:idea" role="button" tabindex="0" aria-label="Tahap 0: Topik/Judul">
            <div class="idea-step-circle active">
              <div class="idea-step-glow"></div>
              <span>0</span>
            </div>
            <div class="idea-step-label active"><span class="step-lbl-full">Topik/Judul</span><span class="step-lbl-break">Topik/<br/>Judul</span></div>
          </div>
          ${CHAPTERS.map((ch, idx) => `
            <div class="idea-step-item" data-action="guide-bab:${idx + 1}" role="button" tabindex="0" title="Bab ${ch[0]} · ${e(ch[1])}" aria-label="Bab ${idx + 1}: ${e(ch[1])}">
              <div class="idea-step-circle">
                <span>${idx + 1}</span>
              </div>
              <div class="idea-step-label">Bab ${idx + 1}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- CARD 2: TOPIK/JUDUL FORM -->
    <div class="idea-card idea-form-card">
      <div class="idea-card-header">
        <h2 class="idea-card-title">Topik/Judul</h2>
      </div>

      <div class="idea-topics-row">
        ${topics.map(t => `
          <button type="button" class="idea-topic-pill" data-action="use-topic:${e(t)}">
            <span>${e(t)}</span>
          </button>
        `).join('')}
      </div>

      <div class="idea-fields-group">
        <div class="field idea-field">
          <div class="idea-label-row">
            <div class="idea-label-left">
              <label for="draft-topic" class="idea-label">Topik atau bidang yang ingin diteliti</label>
              <span class="idea-req">*</span>
            </div>
            <span class="idea-count" data-count="draft-topic">${String(d.topic || '').length}/150</span>
          </div>
          <textarea id="draft-topic" maxlength="150" data-bind="draft.topic" placeholder="Topik yang ingin dipahami" class="idea-textarea" rows="2" aria-required="true">${e(d.topic || '')}</textarea>
        </div>

        <div class="field idea-field">
          <div class="idea-label-row">
            <div class="idea-label-left">
              <label for="draft-phenomenon" class="idea-label">Fenomena atau masalah yang kamu lihat</label>
              <span class="idea-req">*</span>
            </div>
            <span class="idea-count" data-count="draft-phenomenon">${String(d.phenomenon || '').length}/600</span>
          </div>
          <textarea id="draft-phenomenon" maxlength="600" data-bind="draft.phenomenon" placeholder="Kondisi atau masalah yang kamu amati" class="idea-textarea" rows="2" aria-required="true">${e(d.phenomenon || '')}</textarea>
        </div>

        <div class="field idea-field">
          <div class="idea-label-row">
            <div class="idea-label-left">
              <label for="draft-location" class="idea-label">Objek, subjek, atau lokasi penelitian</label>
              <span class="idea-opt">Opsional</span>
            </div>
            <span class="idea-count" data-count="draft-location">${String(d.location || '').length}/150</span>
          </div>
          <textarea id="draft-location" maxlength="150" data-bind="draft.location" placeholder="Siapa atau apa yang ingin diteliti?" class="idea-textarea" rows="2">${e(d.location || '')}</textarea>
        </div>

        <div class="field idea-field">
          <div class="idea-label-row">
            <div class="idea-label-left">
              <label for="draft-idea" class="idea-label">Teori, jurnal, atau metode yang terpikir</label>
              <span class="idea-opt">Opsional</span>
            </div>
            <span class="idea-count" data-count="draft-idea">${String(d.idea || '').length}/500</span>
          </div>
          <textarea id="draft-idea" maxlength="500" data-bind="draft.idea" placeholder="Boleh dikosongkan jika belum ada gambaran." class="idea-textarea" rows="2">${e(d.idea || '')}</textarea>
        </div>

        <div class="idea-submit-row">
          <button type="button" class="idea-btn-submit" data-action="build-draft">
            <span>Lanjutkan</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
function workspaceView() {
  ensureGuide();
  guideSeed();
  const id = PARTS[S.guide.part] && partApplies(S.guide.part) ? S.guide.part : 'background',
    p = PARTS[id],
    v = S.guide.fields[id] || {},
    t = S.tasks.find(x => x.part === id && x.status !== 'done'),
    done = !t && S.tasks.find(x => x.part === id && x.status === 'done'),
    nx = nextPart(id),
    c = ensureKonteks();
  S.guide.part = id;

  const curChapterParts = CHAPTERS[p.chapter - 1][2].filter(
    x => partApplies(x[0]) && (p.chapter !== 1 || x[0] !== 'boundaries' || id === 'boundaries'),
  );

  const area = (fid, label, opt, val, max, rows, ph, bind) => `
    <div class="field idea-field">
      <div class="idea-label-row">
        <div class="idea-label-left">
          <label for="${fid}" class="idea-label">${e(label)}</label>
          ${opt ? '<span class="idea-opt">Opsional</span>' : '<span class="idea-req">*</span>'}
        </div>
        <span class="idea-count" data-count="${fid}">${String(val || '').length}/${max}</span>
      </div>
      <textarea id="${fid}" data-guide="${bind}" maxlength="${max}" placeholder="${e(ph)}" rows="${rows}" class="idea-textarea" ${opt ? '' : 'aria-required="true"'}>${e(val || '')}</textarea>
    </div>
  `;

  const fields = p.fields
    .map((f, i) => {
      const [label, opt] = f.split('|');
      return area('guide-' + id + '-' + i, label, !!opt, v['f' + i], 1500, 3, 'Tuliskan berdasarkan bahan yang tersedia.', `${id}:f${i}`);
    })
    .join('');

  const draf = area(
    'guide-' + id + '-draft',
    'Draf tulisanmu',
    true,
    v.draft,
    6000,
    3,
    `Tulis paragraf ${p.name.toLowerCase()} dengan kalimatmu sendiri.`,
    `${id}:draft`,
  );

  const kendala = String(c.kendala || '').trim(),
    kp = kendala && kendalaPart(kendala);
  const kendalaNote =
    kendala && kp === id
      ? `<div class="mt">${note(`<strong>Kendalamu ada di bagian ini.</strong> “${e(kendala)}” Lengkapi isian lalu klik Kerjakan; Alerin menunjukkan poin yang perlu didahulukan.`)}</div>`
      : '';
  const doneNote = done
    ? `<div class="mt">${note(`<strong>${e(p.name)} sudah dicatat selesai</strong> menurut pengguna${done.completedAt ? ' · ' + dateLong(done.completedAt.slice(0, 10)) : ''}. Lihat pekerjaannya di Progres Aktif, atau buka lagi dengan alasan bila perlu diubah.`, 'green')}</div>`
    : '';

  const buttons = done
    ? `<button type="button" class="idea-btn-submit" data-action="lihat-pekerjaan:${done.id}"><span>Lihat Pekerjaan</span></button>
       <button type="button" class="bab-btn-next" style="background:#52647D; margin-left: 8px;" data-action="reopen:${done.id}"><span>Buka Lagi</span></button>`
    : `<button type="button" class="idea-btn-submit" data-action="guide-task"><span>Kerjakan</span></button>`;

  const nextBox = nx
    ? `
      <div class="bab-next-box">
        <div class="bab-next-content">
          <div class="bab-next-title">Langkah berikutnya</div>
          <div class="bab-next-sub">Bab ${p.roman} • ${e(PARTS[nx].name)}</div>
        </div>
        <button type="button" class="bab-btn-next" data-action="guide-part:${nx}">
          <span>Lanjut ke ${e(PARTS[nx].name)}</span>
        </button>
      </div>
    `
    : `
      <div class="bab-next-box">
        <div class="bab-next-content">
          <div class="bab-next-title">Langkah berikutnya</div>
          <div class="bab-next-sub">Periksa bab yang sudah kamu tulis</div>
        </div>
        <button type="button" class="bab-btn-next" data-action="periksa-bab:${p.chapter}">
          <span>Periksa Skripsi</span>
        </button>
      </div>
    `;

  return `
    <div class="mulai-page-head">
      <h1>Mulai Skripsi</h1>
      <p class="mulai-sub-desktop">Panduan pengerjaan dari penentuan arah sampai Bab ${lastRoman()}.</p>
      <p class="mulai-sub-mobile">Panduan penyusunan dan penentuan<br/>arah skripsi Bab I sampai selesai</p>
    </div>

    <!-- CARD 1: PETA SKRIPSI (STEPPER + TAHAP BAB) -->
    <div class="idea-card bab-stepper-card">
      <div class="idea-card-header">
        <h2 class="idea-card-title">Peta Skripsi</h2>
      </div>
      <div class="idea-stepper-wrap">
        <div class="idea-stepper-track"></div>
        <div class="idea-stepper-list">
          <div class="idea-step-item" data-action="guide-view:idea" role="button" tabindex="0" aria-label="Tahap 0: Topik/Judul">
            <div class="idea-step-circle completed">
              <span>0</span>
            </div>
            <div class="idea-step-label active"><span class="step-lbl-full">Topik/Judul</span><span class="step-lbl-break">Topik/<br/>Judul</span></div>
          </div>
          ${CHAPTERS.map((ch, idx) => {
            const chNum = idx + 1;
            const isChActive = p.chapter === chNum;
            const isChCompleted = p.chapter > chNum;
            const circleClass = isChActive ? 'active' : isChCompleted ? 'completed' : '';
            return `
              <div class="idea-step-item" data-action="guide-bab:${chNum}" role="button" tabindex="0" title="Bab ${ch[0]} · ${e(ch[1])}" aria-label="Bab ${chNum}: ${e(ch[1])}">
                <div class="idea-step-circle ${circleClass}">
                  <span>${chNum}</span>
                </div>
                <div class="idea-step-label ${isChActive ? 'active' : ''}">Bab ${chNum}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="bab-substeps-wrap">
        <div class="bab-substeps-title">Tahap Bab ${p.chapter}</div>
        <div class="bab-substeps-list">
          ${curChapterParts.map(cp => {
            const isPartActive = cp[0] === id;
            return `
              <button type="button" class="bab-substep-btn ${isPartActive ? 'active' : ''}" data-action="guide-part:${cp[0]}">
                <span>${e(cp[1])}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- CARD 2: FORM / EDITOR (LATAR BELAKANG) -->
    <div class="idea-card bab-editor-card">
      <div class="idea-card-header">
        <h2 class="idea-card-title">${e(p.name)}</h2>
      </div>

      <div class="idea-fields-group">
        <div class="field bab-field">
          <div class="idea-label-row">
            <div class="idea-label-left">
              <label for="guide-method" class="idea-label">Pendekatan penelitian</label>
              <span class="idea-req">*</span>
            </div>
          </div>
          <div class="bab-select-wrap">
            <select id="guide-method" class="bab-select" aria-required="true">
              ${METODE.map(m => `<option value="${e(m)}" ${(c.method === m || (!c.method && m === 'Kualitatif')) ? 'selected' : ''}>${e(m)}</option>`).join('')}
            </select>
            <div class="bab-select-arrow" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        ${fields}
        ${draf}

        ${kendalaNote}
        ${doneNote}

        <div class="idea-submit-row">
          ${buttons}
        </div>

        <div class="bab-autosave-note">
          Isian tersimpan otomatis di perangkat ini • pekerjaannya ada di Progres Aktif.
        </div>

        ${nextBox}
      </div>
    </div>
  `;
}
function guidanceRows(id) {
  const p = PARTS[id],
    v = S.guide.fields[id] || {},
    missing = p.fields
      .map((f, i) => [f, i])
      .filter(([f, i]) => !f.includes('|optional') && !String(v['f' + i] || '').trim())
      .map(([f]) => f.split('|')[0]);
  const q = methodKind() === 'kualitatif';
  const specific = {
    background:
      'Urutkan: topik dan objek → fenomena → masalah → kebutuhan penelitian. Pisahkan fakta yang punya sumber dari dugaanmu, lalu cari bukti untuk klaim yang belum punya referensi.',
    questions: q
      ? 'Rumuskan pertanyaan tentang pengalaman, proses, atau pemaknaan. Hindari pertanyaan yang memaksakan hubungan variabel.'
      : 'Turunkan pertanyaan dari masalah. Gunakan hubungan antarvariabel hanya bila desainmu memang mengujinya.',
    objectives:
      'Buat satu tujuan untuk setiap rumusan masalah. Gunakan kata kerja yang sesuai pendekatan, tanpa menjanjikan hasil.',
    results: 'Petakan setiap hasil ke pertanyaan penelitian dan lokasi buktinya. Bedakan hasil dari penafsiranmu.',
    conclusion: `Gunakan hanya temuan Bab ${PARTS.results.roman} yang menjawab rumusan masalah.`,
    analysis:
      methodKind() === 'campuran'
        ? 'Jelaskan analisis kualitatif dan kuantitatif secara terpisah, lalu cara keduanya dipertemukan.'
        : 'Cocokkan teknik analisis dengan pertanyaan, bentuk data, dan asumsinya.',
  };
  return [
    ['Dasar arahan', `${S.title || 'Judul belum dipilih'} · ${p.name}${methodKind() ? ' · ' + capitalize(methodKind()) : ''}`],
    ['Urutan pengerjaan', specific[id] || STEP_BY_PART[id]],
    [
      'Bahan yang masih diperlukan',
      missing.length
        ? missing.join('; ') + '.'
        : 'Isian wajib sudah ada. Periksa ketepatan dan sumbernya bersama pembimbing.',
    ],
    ['Hasil yang disiapkan', `Draf ${p.name.toLowerCase()} yang kamu tulis sendiri, beserta sumbernya.`],
  ];
}
/* Pemeriksaan isian dari data tersimpan, dipakai saat tombol ditekan di luar tampilan isian. */
function partInputOk(id) {
  const v = S.guide.fields[id] || {};
  return PARTS[id].fields.every((f, i) => {
    if (f.includes('|optional')) return true;
    const x = String(v['f' + i] || '').trim();
    return x && !isAsal(x);
  });
}
function validatePart(id) {
  clearErrors();
  const p = PARTS[id];
  let ok = true;
  p.fields.forEach((f, i) => {
    if (f.includes('|optional')) return;
    const fid = 'guide-' + id + '-' + i,
      el = $('#' + fid);
    if (!el) return;
    const v = el.value.trim();
    if (!v) {
      fieldError(fid, 'Kolom ini perlu diisi dulu.');
      ok = false;
    } else if (isAsal(v)) {
      fieldError(fid, 'Isiannya belum bisa Alerin pahami. Coba tulis dengan kalimat biasa.');
      ok = false;
    }
  });
  if (!ok) focusFirstError();
  return ok;
}

Object.assign(ACTIONS, {
  'use-topic': arg => {
    S.draft.topic = arg;
    S.draftSample = false;
    persist();
    closeModal(true);
    render();
    $('#draft-phenomenon')?.focus();
  },
  'enter-wizard': () => {
    closeModal(true);
    if (route === 'mulai') render();
    else go('mulai');
  },
  'guide-view': arg => {
    ensureGuide();
    S.guide.view = ['konteks', 'idea', 'guide', 'saran'].includes(arg) ? arg : 'konteks';
    persist();
    closeModal(true);
    if (route !== 'mulai') go('mulai');
    else render();
  },
  'konteks-save': () => {
    clearErrors();
    const c = ensureKonteks();
    let ok = true;
    const sem = $('#ctx-semester').value;
    if (!(+sem >= 1 && +sem <= 14)) ok = fieldError('ctx-semester', 'Pilih semester 1–14.');
    if (!$('#ctx-method').value)
      ok = fieldError('ctx-method', 'Pilih metode dulu. Kalau belum yakin, pilih “Belum ditentukan”.');
    if (!checkFutureDate('ctx-deadline')) ok = false;
    const kendala = $('#ctx-kendala').value.trim();
    if (kendala && isAsalShort(kendala))
      ok = fieldError('ctx-kendala', 'Isiannya belum bisa Alerin pahami. Coba tulis dengan kalimat biasa.');
    const title = ($('#ctx-title')?.value || '').trim();
    if (title && (isAsal(title) || title.split(/\s+/).length < 4))
      ok = fieldError('ctx-title', 'Judul terlalu pendek. Tulis judul lengkap, atau kosongkan dulu.');
    if (!ok) return focusFirstError();
    S.profile.semester = String(+sem);
    Object.assign(c, {
      method: $('#ctx-method').value,
      chapter: $('#ctx-chapter').value,
      deadline: $('#ctx-deadline').value,
      kendala: capitalize(kendala),
      title: '',
      savedAt: new Date().toISOString(),
    });
    S.profile.method = c.method === 'Belum ditentukan' ? '' : c.method;
    if (c.deadline) S.profile.deadline = c.deadline;
    const nt = title ? titleCase(title) : '';
    if (nt && nt !== S.title) {
      const old = S.title;
      if (old) {
        (S.titleVersions ??= []).push({ title: old, time: new Date().toISOString() });
        S.needsReview = true;
      }
      S.title = nt;
      S.review.title = S.title;
      S.sample = false;
      S.stageLog = [
        { stage: 0, text: 'Judul dipilih', by: 'menurut pengguna', date: isoToday() },
        ...(S.stageLog || []).filter(x => x.stage !== 0),
      ];
      record(old ? 'Judul aktif diganti dari Konteks' : 'Judul dicatat dari Konteks', S.title);
    }
    ensureGuide();
    S.guide.view = 'idea';
    if (c.chapter) {
      const first = CHAPTERS[+c.chapter - 1][2].map(x => x[0]).find(partApplies);
      if (PARTS[S.guide.part]?.chapter !== +c.chapter && first) S.guide.part = first;
    }
    record('Konteks skripsi disimpan', [c.method, c.chapter ? 'Bab ' + CHAPTERS[+c.chapter - 1][0] : ''].filter(Boolean).join(' · '));
    synchronizeResearch();
    persist();
    render();
    window.scrollTo({ top: 0 });
    toast('Konteks tersimpan. Lanjutkan dengan topik atau judul.');
  },
  'guide-bab': arg => {
    ensureGuide();
    const list = CHAPTERS[+arg - 1][2].map(x => x[0]).filter(partApplies);
    if (PARTS[S.guide.part]?.chapter !== +arg) S.guide.part = list[0];
    S.guide.view = 'guide';
    persist();
    render();
    $(`[data-action="guide-bab:${arg}"]`)?.focus({ preventScroll: true });
  },
  'guide-part': arg => {
    ensureGuide();
    S.guide.part = arg;
    S.guide.view = 'guide';
    persist();
    closeModal(true);
    if (route !== 'mulai') go('mulai');
    else {
      render();
      $(`[data-action="guide-part:${arg}"]`)?.focus({ preventScroll: true });
    }
  },
  'guide-next': arg => {
    closeModal(true);
    ensureGuide();
    S.guide.part = arg;
    S.guide.view = 'guide';
    persist();
    if (route !== 'mulai') go('mulai');
    else render();
    toast(`Isi ${PARTS[arg].name}, lalu klik Kerjakan.`);
  },
  /* Kerjakan: periksa isian, lalu tampilkan Struktur (poin pembahasan). Pekerjaan baru dibuat lewat "Jadikan Progres Aktif". */
  'guide-task': () => {
    ensureGuide();
    const id = S.guide.part;
    if (!validatePart(id)) return;
    S.guide.saved[id] = new Date().toISOString();
    S.guide.view = 'saran';
    record('Struktur dibuka', partLabel(id));
    persist();
    render();
    window.scrollTo({ top: 0 });
    $('#struktur-title')?.focus?.();
  },
  'guide-panduan': () => {
    ensureGuide();
    S.guide.guidance[S.guide.part] = true;
    persist();
    render();
    const box = $('#panduan-box');
    box?.scrollIntoView({ block: 'nearest', behavior: S.settings.motion ? 'smooth' : 'auto' });
    box?.focus({ preventScroll: true });
  },
  'guide-panduan-tutup': () => {
    ensureGuide();
    S.guide.guidance[S.guide.part] = false;
    persist();
    render();
    $('[data-action="guide-panduan"]')?.focus({ preventScroll: true });
  },
  'lihat-pekerjaan': arg => {
    focusTaskInProgres(arg);
  },
  'build-draft': () => {
    clearErrors();
    const t = $('#draft-topic')?.value?.trim();
    const p = $('#draft-phenomenon')?.value?.trim();
    const loc = $('#draft-location')?.value?.trim() || '';
    const idea = $('#draft-idea')?.value?.trim() || '';

    if (t) S.draft.topic = t;
    else if (!S.draft.topic) {
      S.draft.topic = 'Pengaruh algoritma konten video pendek (TikTok/Reels) terhadap fenomena social media fatigue dan pola konsumsi informasi audiens muda.';
    }

    if (p) S.draft.phenomenon = p;
    else if (!S.draft.phenomenon) {
      S.draft.phenomenon = 'Kondisi konsumsi video pendek yang intensif pada audiens muda.';
    }

    if (loc) S.draft.location = loc;
    else if (!S.draft.location) {
      S.draft.location = 'Pengguna Aktif Tiktok dan Instagram Reels Usia 18–25 Tahun (mahasiswa atau Pekerja Awal) di Kota Malang';
    }

    if (idea) S.draft.idea = idea;

    S.draftReady = true;
    S.draftSample = false;
    S.researchBundles = {};
    outputTab = 'titles';
    record('Rancangan dan opsi judul disusun', S.draft.topic);
    persist();
    go('hasil-awal');
  },
});
