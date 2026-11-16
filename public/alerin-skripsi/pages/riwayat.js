'use strict';
/* Halaman riwayat. */
function historyRoute(h) {
  const t = h.title || '';
  if (/Judul dipilih/.test(t)) return 'hasil-awal:titles';
  if (/Rancangan penelitian disusun|Arah penelitian awal/.test(t)) return 'hasil-awal:design';
  if (/Draf penelitian/.test(t)) return 'mulai';
  if (/Pemeriksaan kondisi|Pratinjau kondisi/.test(t)) return 'hasil-periksa';
  if (/Kondisi penelitian disimpan|Kondisi terbaru/.test(t)) return 'periksa';
  if (/Revisi dosen|Revisi Dosen|Arahan|Pemahaman|Klarifikasi/.test(t)) return 'revisi';
  if (/Prioritas|Pekerjaan|Koreksi Alerin|Catatan bukti|Bukti pekerjaan/.test(t)) return 'progres';
  if (/Agenda|Saran timeline|Target/.test(t)) return 'peta';
  if (/Daftar Pustaka|Daftar pustaka|Naskah|Sumber/.test(t)) return 'pustaka';
  if (/Mentor/.test(t)) return 'mentor';
  if (/Personalisasi/.test(t)) return 'profil';
  if (/Data contoh/.test(t)) return 'pengaturan';
  return '';
}
function riwayatPage() {
  return (
    pageHead(
      'Riwayat penelitian',
      'Buka kembali hasil dan keputusan yang tersimpan di perangkat ini.',
      '',
      '',
      '',
      'PROFIL',
    ) +
    `<section class="card"><div class="section-head"><h2>Catatan perjalanan</h2>${B('Unduh riwayat', 'export-history', 'text', 'download')}</div>${
      S.history.length
        ? S.history
            .map(h => {
              const r = historyRoute(h);
              return `<${r ? 'button' : 'div'} class="history-line ${r ? 'clickable' : ''}" ${r ? `data-action="history-open:${h.id}"` : ''}>${I('history')}<div><h4>${e(h.title)}</h4><p>${e(h.detail)}</p><small>${e(localTime(h.time))} WIB · tindakan pengguna</small></div>${r ? `<span class="history-go">Buka hasil</span>` : ''}</${r ? 'button' : 'div'}>`;
            })
            .join('')
        : `<div class="empty"><p>Belum ada tindakan baru. Coba simpan draf, ubah target, atau mulai pekerjaan untuk mencatat riwayat.</p></div>`
    }</section>`
  );
}

Object.assign(ACTIONS, {
  'export-history': () => {
    download(
      'Riwayat_Penelitian_Alerin.txt',
      S.history.map(h => `${localTime(h.time)} WIB\n${h.title}\n${h.detail}`).join('\n\n') || 'Belum ada catatan baru.',
    );
    toast('Riwayat siap diunduh.');
  },
  'history-open': arg => {
    const h = S.history.find(x => x.id === arg);
    const r = h && historyRoute(h);
    if (!r) return;
    const [page, tab] = r.split(':');
    if (page === 'hasil-awal' && !S.draftReady) {
      lastDraftResult();
      return;
    }
    if (page === 'hasil-periksa' && !S.reviewReady) {
      go('periksa');
      return;
    }
    if (page === 'hasil-awal') outputTab = tab || 'design';
    if (page === 'progres') progressTab = 'aktif';
    go(safeRoute(page));
  },
});
