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
  return `
    <div class="rw-page">
      <div class="rw-head">
        <h1 class="rw-title">Riwayat Penelitian</h1>
        <p class="rw-desc">Buka kembali hasil dan keputusan yang tersimpan di perangkat ini.</p>
      </div>

      <section class="rw-card">
        <div class="rw-card-header">
          <h2 class="rw-card-title">Catatan perjalanan</h2>
        </div>

        ${
          S.history && S.history.length
            ? `<div class="rw-list">
                ${S.history
                  .map(h => {
                    const r = historyRoute(h);
                    return `
                      <div class="rw-item">
                        <div class="rw-item-icon">
                          ${I('history')}
                        </div>
                        <div class="rw-item-body">
                          <div class="rw-item-content">
                            <div class="rw-item-title">${e(h.title)}</div>
                            ${h.detail ? `<div class="rw-item-detail">${e(h.detail)}</div>` : ''}
                            <div class="rw-item-meta">
                              <span class="rw-meta-time">
                                <span class="rw-meta-ico">${I('clock')}</span>
                                ${e(localTime(h.time))} WIB
                              </span>
                              <span class="rw-meta-dot">•</span>
                              <span class="rw-meta-user">
                                <span class="rw-meta-ico">${I('user')}</span>
                                Tindakan pengguna
                              </span>
                            </div>
                          </div>
                          ${
                            r
                              ? `<div class="rw-item-action">
                                  <button type="button" class="rw-btn-open" data-action="history-open:${h.id}">Buka Hasil</button>
                                </div>`
                              : ''
                          }
                        </div>
                      </div>
                    `;
                  })
                  .join('')}
              </div>`
            : `<div class="rw-empty">
                <p>Belum ada tindakan baru. Coba simpan draf, ubah target, atau mulai pekerjaan untuk mencatat riwayat.</p>
              </div>`
        }
      </section>
    </div>
  `;
}

Object.assign(ACTIONS, {
  'export-history': () => {
    download(
      'Riwayat_Penelitian_Alerin.txt',
      (S.history || []).map(h => `${localTime(h.time)} WIB\n${h.title}\n${h.detail}`).join('\n\n') || 'Belum ada catatan baru.',
    );
    toast('Riwayat siap diunduh.');
  },
  'history-open': arg => {
    const h = (S.history || []).find(x => x.id === arg);
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
