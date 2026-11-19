'use strict';
/* Tinjauan Alerin untuk kartu Progres Aktif (Simulasi: aturan lokal, belum analisis AI).
   Hasil kerja dibandingkan dengan tugas awal dan tiap kriteria Selesai Bila. Setiap poin berstatus
   Terpenuhi, Perlu Bukti, atau Perlu Revisi. Hasil tinjauan terikat pada versi bukti: bila hasil, isian, atau
   lampiran berubah, statusnya menjadi Perlu Diperiksa Ulang. Lampiran hanya dinilai bila isinya benar-benar terbaca. */
const TJ_STOP = new Set(
  'yang dan atau dari untuk dengan pada dalam ini itu ada akan sudah telah juga bila jika agar tidak bisa dapat oleh sebagai setiap seluruh semua para lebih masih antara serta tiap hasil bagian sesuai saya kami kamu hari sini sana lain secara karena sehingga tersebut adalah menjadi terhadap kepada tentang'.split(' '),
);
const TJ_PREFIX = ['meng', 'meny', 'mem', 'men', 'me', 'peng', 'peny', 'pem', 'pen', 'pe', 'di', 'ku', 'ter', 'ber'];
function tjStem(w) {
  let s = w.replace(/(nya|lah|kah|pun)$/, '');
  if (s.length > 6) s = s.replace(/(kan|an)$/, '');
  for (const p of TJ_PREFIX)
    if (s.startsWith(p) && s.length - p.length >= 4) {
      s = s.slice(p.length);
      break;
    }
  return s;
}
/* Kata penting beserta akarnya, unik per akar. */
function wordsOf(text) {
  const seen = new Set(),
    out = [];
  for (const w of norm(text).split(' ')) {
    if (w.length < 4 || TJ_STOP.has(w) || /^\d+$/.test(w)) continue;
    const r = tjStem(w);
    if (r.length < 4 || seen.has(r)) continue;
    seen.add(r);
    out.push({ w, r });
  }
  return out;
}
const rootsOf = text => wordsOf(text).map(x => x.r);
const taskCriteria = t => (Array.isArray(t.criteria) ? t.criteria : [t.criteria]).map(c => String(c || '').trim()).filter(Boolean);
/* Versi bukti: isi hasil/bukti, isian panduan, dan daftar lampiran. */
function evidenceHash(t) {
  return hashKey(
    JSON.stringify([
      String(t.evidence || '').trim(),
      t.part ? S.guide?.fields?.[t.part] || {} : null,
      S.files.filter(f => f.context === 'task-' + t.id).map(f => f.id),
    ]),
  );
}
function reviewState(t) {
  const r = t.review;
  if (!r) return 'none';
  if (r.hash !== evidenceHash(t)) return 'stale';
  return r.status;
}
/* Kosakata pekerjaan untuk memeriksa apakah bukti memang membahas pekerjaan ini. */
function taskVocab(t) {
  const p = t.part && PARTS[t.part];
  return rootsOf(
    [
      t.title,
      t.doing,
      t.deliverable,
      taskCriteria(t).join(' '),
      (t.steps || []).join(' '),
      t.bagian,
      p ? p.name + ' ' + p.fields.map(f => f.split('|')[0]).join(' ') : '',
      S.title,
      ...taskRevs(t).map(r => [r.topic, r.understanding?.langkah, r.understanding?.bagian].join(' ')),
    ].join(' '),
  );
}
const tjSentences = text =>
  String(text || '')
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 3);
const tjQuestion = c => `Di bagian mana kamu menunjukkan bahwa ${trimDot(c).charAt(0).toLowerCase() + trimDot(c).slice(1)}? Sebutkan bab atau halamannya.`;
const tjItem = (crit, status, reason, quote = '', fix = '', question = '', from = '') => ({ crit, status, reason, quote, fix, question, from });
function tjCriterion(c, ctx, t) {
  if (/isian panduan/i.test(c) && t.part && PARTS[t.part]) {
    const pf = partFilled(t.part);
    return pf.ok
      ? tjItem(c, 'met', 'Semua kolom wajib di isian panduan terisi dan membahas penelitianmu.', tjSentences(ctx.own)[0] || '', '', '', 'isian panduan')
      : tjItem(
          c,
          'need',
          pf.empty.length ? `Kolom ${joinList(pf.empty, ', ', ' dan ')} masih kosong.` : 'Isian wajib masih terlalu singkat atau belum bisa dipahami.',
          '',
          'Lengkapi isian panduan di ruang kerja.',
          `Apa isi ${pf.empty[0] ? pf.empty[0].toLowerCase() : 'bagian ini'} menurutmu?`,
        );
  }
  if (/arahan dosen/i.test(c)) {
    const revs = taskRevs(t),
      pend = taskPendingRevs(t);
    if (!revs.length) return tjItem(c, 'met', 'Tidak ada arahan tertaut.');
    return pend.length
      ? tjItem(c, 'revise', `${pend.length} arahan dosen belum dilaporkan tindak lanjutnya.`, '', 'Laporkan tindak lanjutnya di Revisi Dosen.')
      : tjItem(c, 'met', 'Laporan tindak lanjut arahan sudah tersimpan di Revisi Dosen.', revs.find(r => r.doneNote)?.doneNote || '', '', '', 'laporan Revisi Dosen');
  }
  if (/bukti perubahan dicatat/i.test(c)) {
    const s = ctx.sents.find(x => ctx.vocab.some(w => norm(x).includes(w))) || ctx.sents[0] || '';
    return tjItem(c, 'met', 'Bukti mencatat perubahan yang membahas pekerjaan ini.', s, '', '', ctx.fromOf(s));
  }
  const words = wordsOf(c);
  if (!words.length) return tjItem(c, 'need', 'Kriteria ini belum bisa diperiksa otomatis.', '', 'Pastikan kriteria ini terpenuhi, lalu jelaskan di kolom bukti.', tjQuestion(c));
  let best = '',
    bestN = 0;
  for (const s of ctx.sents) {
    const n = words.filter(x => norm(s).includes(x.r)).length;
    if (n > bestN) {
      bestN = n;
      best = s;
    }
  }
  const found = words.filter(x => ctx.all.includes(x.r)),
    missing = words.filter(x => !ctx.all.includes(x.r)).map(x => x.w),
    ratio = found.length / words.length,
    neg = /\b(belum|nanti|akan|masih|rencana|kurang)\b/i.test(best);
  if (ratio >= 0.6 && !neg) return tjItem(c, 'met', 'Bukti menunjukkan kriteria ini.', best, '', '', ctx.fromOf(best));
  if (ratio >= 0.6)
    return tjItem(c, 'revise', 'Bukti menyebut kriteria ini, tetapi menandakan pekerjaannya belum selesai.', best, 'Selesaikan bagian itu, lalu perbarui buktinya.', tjQuestion(c), ctx.fromOf(best));
  if (found.length)
    return tjItem(
      c,
      'revise',
      `Bukti baru menyinggung sebagian kriteria. Belum terlihat: ${joinList(missing, ', ', ' dan ')}.`,
      best,
      `Lengkapi hasil kerjamu tentang ${joinList(missing, ', ', ' dan ')}, lalu tulis letaknya di naskah.`,
      tjQuestion(c),
      ctx.fromOf(best),
    );
  return tjItem(c, 'need', 'Belum ada bagian bukti yang menunjukkan kriteria ini.', '', 'Tambahkan bukti untuk kriteria ini beserta letaknya di naskah.', tjQuestion(c));
}
/* Menjalankan Tinjauan Alerin. Lampiran PDF/DOCX dibaca bila isinya bisa diakses; gambar tidak dinilai. */
async function runReview(t) {
  const files = [];
  let fileText = '';
  for (const f of S.files.filter(x => x.context === 'task-' + t.id)) {
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext)) {
      files.push({ name: f.name, ok: false, info: 'Gambar belum bisa dibaca Alerin di prototipe ini, jadi tidak ikut dinilai.' });
      continue;
    }
    try {
      const blob = await fileStore('get', f.id);
      if (!blob) throw Error('Isi berkas tidak tersedia di peramban ini.');
      const r = await extractDocument(new File([blob], f.name));
      const len = r.text.replace(/\s/g, '').length;
      if (len < 40) throw Error('Teks tidak terbaca. Berkas mungkin hasil pindai.');
      fileText += '\n' + r.text;
      files.push({ name: f.name, ok: true, info: `${len.toLocaleString('id-ID')} karakter terbaca dan ikut dinilai` });
    } catch (err) {
      files.push({ name: f.name, ok: false, info: (err.message || 'Belum bisa dibaca.') + ' Tidak ikut dinilai.' });
    }
  }
  const own = [t.part ? Object.values(S.guide?.fields?.[t.part] || {}).join('\n') : '', t.evidence || ''].join('\n').trim(),
    text = (own + '\n' + fileText).trim(),
    crit = taskCriteria(t),
    prevNotes = t.review?.notes || t.reviewPrev?.notes || [];
  const base = { hash: evidenceHash(t), date: new Date().toISOString(), files, simulated: true, notes: [] };
  if (!text)
    return {
      ...base,
      status: 'empty',
      items: crit.map(c => tjItem(c, 'need', 'Belum ada hasil atau bukti yang bisa diperiksa.', '', 'Tulis hasil kerjamu atau lampirkan berkas yang bisa dibaca.', tjQuestion(c))),
    };
  if (isAsal(text.slice(0, 200)))
    return {
      ...base,
      status: 'unclear',
      items: crit.map(c => tjItem(c, 'need', 'Isian belum bisa dipahami, jadi kriteria ini belum bisa dinilai.', '', 'Tulis ulang hasil kerjamu dengan kalimat biasa.', tjQuestion(c))),
    };
  const vocab = taskVocab(t),
    all = norm(text),
    hits = vocab.filter(w => all.includes(w));
  if (hits.length < 2)
    return {
      ...base,
      status: 'irrelevant',
      items: crit.map(c =>
        tjItem(
          c,
          'need',
          'Bukti yang ditulis tidak membahas pekerjaan ini, jadi tidak bisa dipakai untuk kriteria ini.',
          '',
          `Tunjukkan hasil sesuai “Hasil yang disiapkan”: ${trimDot(t.deliverable || 'hasil pekerjaan')}.`,
          tjQuestion(c),
        ),
      ),
    };
  const ctx = {
    own,
    all,
    vocab,
    sents: tjSentences(text),
    fromOf: s => (s && !own.includes(s) ? 'lampiran' : s ? 'kolom bukti' : ''),
  };
  const items = crit.map(c => tjCriterion(c, ctx, t));
  const notes = findIssues(text, { chapters: [], title: '', method: methodKind() }).map((f, i) => ({
    id: 'n' + i,
    title: f.title,
    fix: f.fix,
    done: prevNotes.some(p => p.title === f.title && p.done),
  }));
  return { ...base, status: items.every(i => i.status === 'met') ? 'pass' : 'partial', items, notes };
}
const TJ_LABEL = { met: ['Terpenuhi', 'green'], need: ['Perlu Bukti', 'amber'], revise: ['Perlu Revisi', 'red'] };
function reviewModal(id) {
  const t = S.tasks.find(x => x.id === id);
  if (!t) return;
  const r = t.review,
    rs = reviewState(t);
  if (!r) return showTask(id);
  const head = {
    pass: badge('Semua kriteria terpenuhi', 'green'),
    partial: badge(`${r.items.filter(i => i.status === 'met').length} dari ${r.items.length} kriteria terpenuhi`, 'amber'),
    irrelevant: badge('Bukti belum relevan', 'amber'),
    empty: badge('Belum dapat diperiksa', ''),
    unclear: badge('Belum dapat diperiksa', 'amber'),
    stale: badge('Perlu Diperiksa Ulang', 'amber'),
  }[rs];
  const state = {
    empty: 'Belum dapat diperiksa karena hasil atau bukti masih kosong.',
    unclear: 'Belum dapat diperiksa karena isian belum bisa dipahami.',
    irrelevant: 'Bukti yang ditulis tidak membahas pekerjaan ini. Penyelesaian tetap terkunci.',
  }[r.status];
  const items = r.items
    .map(i => {
      const [lab, cls] = TJ_LABEL[i.status];
      return `<details class="b19-crit ${i.status}" ${i.status !== 'met' ? 'open' : ''}><summary>${badge(lab, cls)}<span>${e(i.crit)}</span></summary><div class="b19-crit-body"><p><strong>Alasan:</strong> ${e(i.reason)}</p><p><strong>Bukti yang dirujuk:</strong> ${i.quote ? `“${e(i.quote.length > 260 ? i.quote.slice(0, 257) + '…' : i.quote)}”${i.from ? ` <span class="small muted">· ${e(i.from)}</span>` : ''}` : 'Belum ada bagian bukti yang dirujuk.'}</p>${i.fix ? `<p><strong>Tindakan perbaikan:</strong> ${e(i.fix)}</p>` : ''}${i.question ? `<p><strong>Pertanyaan validasi:</strong> ${e(i.question)}</p>` : ''}</div></details>`;
    })
    .join('');
  const files = r.files.length
    ? `<ul class="b19-files">${r.files.map(f => `<li>${I(f.ok ? 'check' : 'info')}<span><strong>${e(f.name)}</strong> · ${e(f.info)}</span></li>`).join('')}</ul>`
    : '<p class="small muted">Tidak ada lampiran. Penilaian memakai isian di ruang kerja.</p>';
  const kor = ['pass', 'partial'].includes(r.status)
    ? r.notes.length
      ? `<ul class="b19-notes">${r.notes.map(n => `<li class="${n.done ? 'done' : ''}"><div><strong>${e(n.title)}</strong><p class="small">${e(n.fix)}</p></div>${B(n.done ? 'Tuntas' : 'Tandai Tuntas', 'rv-note:' + id + ':' + n.id, n.done ? 'soft small' : 'small', n.done ? 'check' : '', `aria-pressed="${n.done}"`)}</li>`).join('')}</ul>`
      : '<p class="small">Tidak ada poin koreksi dari bukti yang diperiksa.</p>'
    : '<p class="small muted">Koreksi Alerin dijalankan setelah bukti relevan dan bisa diperiksa.</p>';
  modal(
    'Tinjauan Alerin',
    `<div class="b19-sim">${badge('Simulasi', 'amber')}<span class="small">Aturan lokal di perangkat ini, belum analisis AI. Diperiksa ${e(localTime(r.date))} WIB.</span></div>${rs === 'stale' ? `<div class="mt">${note('Hasil, isian, atau lampiran berubah sejak diperiksa. Status: <strong>Perlu Diperiksa Ulang</strong>.', 'amber')}</div>` : ''}<div class="between mt"><h3>${e(t.title)}</h3>${head}</div>${state ? `<p class="small mt">${e(state)}</p>` : ''}<section class="b19-task mt"><span class="eyebrow">TUGAS AWAL</span><p>${e(t.doing || t.reason || '')}</p><p class="small muted">Hasil yang disiapkan: ${e(t.deliverable || '')}</p></section><h4 class="mt">Kriteria Selesai Bila</h4><div class="b19-crits">${items}</div><h4 class="mt">Lampiran</h4>${files}<h4 class="mt">Koreksi Alerin</h4>${kor}`,
    B('Kembali ke Ruang Kerja', 'task:' + id) + (rs === 'stale' ? B('Periksa Ulang', 'task-koreksi:' + id, 'primary', 'refresh') : ''),
    true,
  );
}
