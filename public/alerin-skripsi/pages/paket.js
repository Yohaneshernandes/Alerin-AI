'use strict';
/* Halaman paket. */
function paketPage() {
  return (
    pageHead(
      'Ruang yang sesuai dengan kebutuhanmu.',
      'Semua paket membuka alur utama. Kedalaman penjelasan, kapasitas, dan jatah penggunaan menyesuaikan kebutuhan penelitian.',
      '',
      '',
      '',
      'PAKET ALERIN SKRIPSI',
    ) +
    `<div class="plan-grid">${['Gratis', 'Plus', 'Pro']
      .map((p, i) => {
        const l = ALERIN.planLimits[p];
        return `<section class="pricing-card ${S.plan === p ? 'selected' : ''}"><div class="between"><span class="eyebrow">${['LANGKAH PERTAMA', 'PROGRES RUTIN', 'RISET LEBIH INTENSIF'][i]}</span>${S.plan === p ? badge('Paket saat ini', 'blue') : ''}</div><h2>${p}</h2><p>${['Kenali arah dan cara kerja Alerin.', 'Lebih leluasa untuk pemeriksaan berkala.', 'Cakupan lebih dalam untuk revisi dan hubungan antarbab.'][i]}</p><ul>${[`${l.titles} opsi judul`, `${['Ringkasan dasar', 'Penjelasan keterkaitan', 'Analisis risiko dan konsekuensi'][i]}`, `Pemeriksaan utama: ${l.main[0]}/hari · ${l.main[1]}/minggu`, `Pembaruan AI: ${l.update[0]}/hari · ${l.update[1]}/minggu`, `Pemrosesan berkas: ${l.file[0]}/hari · ${l.file[1]}/minggu`, `Berkas hingga ${l.mb} MB`, `Koleksi ${l.refs} sumber`].map(t => `<li>${I('check')}<span>${t}</span></li>`).join('')}</ul>${B(S.plan === p ? 'Lihat manfaat paket' : 'Coba tampilan ' + p, 'set-plan:' + p, S.plan === p ? 'soft' : 'primary', S.plan === p ? 'info' : '')}</section>`;
      })
      .join(
        '',
      )}</div><div class="mt">${note('Pemilihan paket di sini hanya mengubah pratinjau akses dan kedalaman konten. Tidak ada pembayaran atau perubahan langganan Alerin asli. Ketentuan jatah mengikuti PDF terbaru.')}</div><section class="card mt"><h3>Bagaimana penggunaan dihitung?</h3><div class="grid3 mt">${[
      ['Pemeriksaan Utama', 'Satu rangkaian hasil awal, termasuk lima jenis output, dihitung satu permintaan.'],
      ['Pembaruan AI', 'Analisis baru setelah perubahan isian, kondisi, arahan, atau bukti.'],
      ['Pemrosesan Berkas', 'Membaca berkas baru atau versi revisi; berbeda dari analisis akademik.'],
    ]
      .map(([h, p]) => `<div><h4>${h}</h4><p class="small" style="margin-top:8px;line-height:1.9">${p}</p></div>`)
      .join(
        '',
      )}</div><hr class="rule"><p class="small">Simpan draf, Kerjakan, Tunda, pilih judul, membuka hasil, dan mengubah target secara manual tidak memakai jatah AI. Referensi ini tidak memotong kuota akun produksi.</p></section>`
  );
}

Object.assign(ACTIONS, {
  'set-plan': arg => {
    modal(
      'Pratinjau paket ' + e(arg),
      `<p>Paket ${e(arg)} menampilkan ${ALERIN.planLimits[arg].titles} opsi judul, batas berkas ${ALERIN.planLimits[arg].mb} MB, dan kapasitas ${ALERIN.planLimits[arg].refs} sumber.</p><div class="mt">${note('Ini hanya perubahan tampilan referensi. Tidak ada transaksi, perubahan langganan asli, atau penghapusan data.')}</div>`,
      B('Batal', 'close-modal') + B('Terapkan pratinjau ' + arg, 'confirm-plan:' + arg, 'primary', 'check'),
    );
  },
  'confirm-plan': arg => {
    if (!ALERIN.planLimits[arg]) return;
    S.plan = arg;
    record('Tampilan paket diubah', arg + ' · pratinjau tanpa transaksi');
    persist();
    closeModal(true);
    render();
    toast('Pratinjau paket ' + arg + ' diterapkan.');
  },
});
