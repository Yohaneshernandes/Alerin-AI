'use strict';
/* Halaman pedoman. */
function pedomanPage() {
  return (
    pageHead(
      'Pedoman kampus',
      'Tambahkan pedoman terbaru program studimu sebagai acuan format dan ketentuan akademik.',
      '',
      '',
      '',
      'PROFIL',
    ) +
    `<div class="review-layout"><section class="card"><div class="section-head"><h2>Pedoman penelitian</h2>${badge('Opsional, sangat disarankan', 'blue')}</div>${uploadZone('pedoman', S.files.some(f => f.context === 'pedoman') ? 'Update Pedoman' : 'Unggah pedoman kampus')}${fileList('pedoman')}<p class="settings-note">Berkas dapat dibuka kembali dari perangkat yang sama. Pada referensi ini, isi pedoman belum dianalisis atau diterapkan otomatis.</p></section><aside class="card"><h3>Gunakan acuan yang sesuai</h3><ul class="list-lines"><li>Pastikan versi dan tahun pedoman terbaru.</li><li>Utamakan ketentuan program studi.</li><li>Klarifikasi perbedaan aturan bersama pembimbing.</li></ul>${B('Lihat urutan acuan', 'nav:batasan', 'text', '')}</aside></div>`
  );
}
