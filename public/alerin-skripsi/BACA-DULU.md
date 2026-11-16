# Kode Alerin Skripsi

Versi tayang `1794743860-f549` (Revisi QC 14 November), diunggah 15 November 2026.
Situs: https://claude.ai/artifact/LF6LR2nJ33hFyqSUcdNPKV

Situs statis: HTML, CSS, dan JavaScript biasa, tanpa build dan tanpa server aplikasi. Semua data pengguna disimpan di localStorage peramban.

## Menjalankan

1. Ekstrak zip.
2. Di folder hasil ekstrak, jalankan server statis, misalnya `python3 -m http.server 8000`.
3. Buka http://localhost:8000/index.html. Kalau index.html dibuka langsung (file://), skrip tidak termuat semua.

## Peta berkas

| Folder / berkas | Isi |
| --- | --- |
| `index.html` | Memuat CSS dan skrip berurutan, penanda versi `?v=20261115c` |
| `tokens.css`, `components.css`, `pages.css` | CSS site GPT (enam berkas digabung tanpa mengubah urutan aturan) |
| `extras.css` | Gaya untuk elemen yang hanya ada di logika Claude + perbaikan mode gelap |
| `data.js` | Data tetap: 11 tahap skripsi, bab dan subbagian, contoh literatur |
| `core/` | `state.js` (data, localStorage, data contoh), `router.js` (rute halaman), `files.js` (unggah dan baca PDF/DOCX/TXT), `utils.js` |
| `ui/` | `components.js` (tombol, kolom, modal, pesan galat), `shell.js` (sidebar, header, Notifikasi, chat, pencarian), `icons.js` |
| `logic/` | `stage.js` (kondisi, posisi tahap), `priority.js` (Progres Aktif, kunci Catat Sebagai Selesai), `parts.js`, `analysis.js` (temuan Periksa, pemahaman arahan dosen), `citation.js` (format sitasi), `titles.js`, `validation.js` |
| `pages/` | Satu berkas per halaman; tiap halaman menambah penangan ke `ACTIONS` |
| `app.js` | Pendengar klik, input, dan change global; semua tombol memakai `data-action="kunci:argumen"` |
| `vendor/` | Pustaka pihak ketiga, tidak diubah: `jszip.js` (baca DOCX), `docx.js` (ekspor Word), `pdf.mjs` + `pdf.worker.mjs` (pdf.js, baca PDF) |
| `assets/` | Logo dan font Inter |
| `uji/` | Skrip uji otomatis (Python + Playwright) dan pemeriksa kode (Node) |

## Menjalankan uji

Butuh Python 3, `pip install playwright`, lalu `playwright install chromium`.

```
cd uji
SITE=/path/ke/folder/hasil/ekstrak python3 smoke.py      # desktop
SITE=/path/ke/folder/hasil/ekstrak python3 smoke.py hp   # lebar HP 390 px
node audit.js /path/ke/folder/hasil/ekstrak              # pemeriksa kode
```

Skrip lain: `uji11.py` (Daftar Uji 1–11), `tahap5.py` (Peta + Kalender), `tahap6.py` (Daftar Pustaka), `tahap7.py` (Mentor), `qc14.py` (Revisi QC 14 November), `layout.py` (luapan horizontal).

## Catatan

- Analisis AI belum terhubung. Temuan pemeriksaan, pemahaman arahan dosen, dan jawaban diskusi adalah contoh berbasis aturan di `logic/analysis.js`.
- Tidak ada backend: WhatsApp memakai tautan wa.me, Kalender Alerin Induk dan Cari DOI masih contoh.
