# Kode Alerin Skripsi

Versi: `1795003363-3da2` (18 November 2026, 19.02 WIB). Isinya sama persis dengan site yang tayang: 46 berkas, sudah dicocokkan per sha256.

Site: https://claude.ai/artifact/LF6LR2nJ33hFyqSUcdNPKV

## Cara menjalankan

Buka lewat server lokal, jangan langsung dari berkas (`file://`), karena pembaca PDF dimuat sebagai modul:

```
cd alerin-skripsi
python3 -m http.server 8000
```

Lalu buka http://localhost:8000. Data tersimpan di localStorage peramban. Panel uji muncul dengan `?uji=1`.

Tanpa framework dan tanpa build: HTML, CSS, dan JavaScript biasa. Urutan pemuatan skrip diatur di `index.html`.

## Struktur

- `index.html`: titik masuk.
- `app.js`: penangan klik dan input.
- `core/`: data dan penyimpanan (`state.js`), rute halaman (`router.js`), berkas dan pembaca PDF/DOCX (`files.js`), utilitas.
- `logic/`:
  - `stage.js`: posisi penelitian.
  - `priority.js`: Progres Aktif (urutan, prasyarat, slot, syarat selesai).
  - `tinjauan.js`: Tinjauan Alerin.
  - `parts.js`: bab dan subbagian.
  - `analysis.js`: temuan pemeriksaan dan pemahaman arahan.
  - `struktur.js`: struktur Mulai Skripsi dan ekspor DOCX.
  - `citation.js`: Daftar Pustaka.
  - `titles.js`: opsi judul.
- `pages/`: satu berkas per halaman (beranda, mulai, periksa, progres, peta, revisi, pustaka, mentor, kalender, dan lain-lain).
- `ui/`: kerangka halaman (sidebar, header, notifikasi), komponen, ikon.
- `vendor/`: JSZip, docx, dan pdf.js (pihak ketiga, tidak diubah).
- Gaya: `tokens.css`, `components.css`, `pages.css`, dan `extras.css`. Revisi terbaru ditambahkan di akhir `extras.css`.

## Yang masih simulasi

- Analisis AI: pemeriksaan naskah, pemahaman arahan, dan Tinjauan Alerin memakai aturan lokal dan berlabel Contoh/Simulasi.
- Belum terhubung:
  - akun dan personalisasi alerin.id;
  - Kalender Alerin Induk;
  - pembayaran;
  - sinkronisasi antarperangkat.

Catatan perubahan per fitur ada di project "Alerin AI Development" (dokumen `claude/revisi-…-2026-11-18.md`).
