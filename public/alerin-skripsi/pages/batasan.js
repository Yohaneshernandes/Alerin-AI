'use strict';
/* Halaman batasan. */
function batasanPage() {
  return (
    pageHead(
      'Batasan Alerin',
      'Kenali ruang bantuan Alerin agar keputusan akademik tetap dapat dipertanggungjawabkan.',
      '',
      '',
      '',
      'PROFIL',
    ) +
    `<div class="grid2"><section class="card"><h2 style="font-size:19px">Urutan acuan keputusan akademik</h2><div class="boundaries-list">${[
      ['Pedoman kampus terbaru', 'Menentukan ketentuan formal yang berlaku pada program studi.'],
      ['Arahan pembimbing', 'Menentukan keputusan sesuai konteks, selaras dengan pedoman dan integritas akademik.'],
      ['Referensi ilmiah tepercaya', 'Menjadi rujukan untuk menilai ketepatan teori, metode, dan analisis penelitian.'],
      ['Rekomendasi Alerin', 'Memberi pilihan dan pertanyaan untuk ditinjau. Tidak menjadi keputusan resmi kampus.'],
    ]
      .map(
        ([h, p], i) =>
          `<div class="boundary"><span class="boundary-number">${i + 1}</span><div><h3>${h}</h3><p>${p}</p></div></div>`,
      )
      .join(
        '',
      )}</div></section><section class="card prose"><h3 style="margin-top:0">Pendamping, bukan pengganti pembimbing</h3><p>Alerin membantu memahami, merancang, dan meninjau pekerjaanmu sendiri. Rancangan, outline, dan kerangka berpikir merupakan usulan yang perlu kamu kembangkan.</p><h3>Setiap klaim memiliki dasar</h3><p>Dokumen diunggah tidak otomatis berarti seluruh isinya sudah terbaca. Informasi pengguna, cuplikan sumber, dan hasil pemeriksaan harus dibedakan.</p><h3>Bukti dan keputusan dicatat terpisah</h3><p>Kelengkapan hasil pemeriksaan tidak sama dengan persetujuan pembimbing, bukti izin, atau kelulusan.</p><h3>Integritas penelitian</h3><p>Alerin tidak membuat data, responden, kutipan, hasil statistik, atau referensi fiktif. Pemeriksaan hasil analisis berbeda dari mengolah ulang data mentah.</p><h3>Data pada referensi ini</h3><p>Interaksi dan berkas disimpan pada peramban perangkatmu. Analisis AI, sinkronisasi akun, pembayaran, dan pengiriman kepada mentor belum terhubung.</p></section></div>`
  );
}
