Buat desain dan prototype high-fidelity untuk fitur web app bernama **“Grammar Checker”**, yaitu AI proofreading khusus untuk mahasiswa Indonesia yang sedang menulis skripsi.

Tujuan utama:
Membantu mahasiswa menemukan dan memperbaiki kesalahan ejaan, tata bahasa, tanda baca, redundansi, gaya bahasa akademik, kalimat pasif berlebihan, dan inkonsistensi istilah secara cepat melalui editor interaktif.

Konsep utama:
**Paste/Ketik teks → AI menganalisis → Kesalahan ditandai langsung di teks → Klik kesalahan → Lihat penjelasan dan saran → Terapkan perbaikan → Lihat skor kualitas tulisan**

Jangan membuatnya seperti chatbot. Buat pengalaman seperti **Microsoft Word / Google Docs yang memiliki AI writing assistant khusus skripsi Bahasa Indonesia.**

DESIGN DIRECTION:

Gunakan desain modern, clean, profesional, akademik, dan nyaman untuk membaca teks panjang.

Desktop-first:

* Main frame: 1440px
* Responsive untuk tablet dan mobile
* Font: Inter
* Grid: 8px spacing system
* Border radius: 10–12px
* Card border tipis
* Shadow sangat subtle
* Background: light neutral
* Primary color: #2563EB
* Error: red
* Warning: amber
* Success: green
* Informational: blue
* Text utama: dark charcoal/navy

Jangan menggunakan terlalu banyak warna.
Warna hanya digunakan untuk menunjukkan status error dan feedback.

GLOBAL APP LAYOUT:

Buat sidebar kiri:

Logo

Navigation:

* Dashboard
* Skripsi Saya
* Grammar Checker
* Parafrase
* Citation
* Simulasi Sidang

Bagian bawah:

* Bantuan
* Pengaturan
* Profile mahasiswa

Grammar Checker menjadi menu aktif.

SCREEN 1 — GRAMMAR CHECKER EDITOR

Header:

Title:
“Grammar Checker”

Subtitle:
“Periksa ejaan, tata bahasa, dan gaya akademik skripsimu.”

Top toolbar:

* Pilih dokumen
* Import DOCX
* Upload PDF
* Paste Text
* Save
* Export

Buat tombol utama:
“Periksa Grammar”

Editor utama menggunakan layout dua kolom.

LEFT PANEL — TEXT EDITOR

Buat editor seperti document editor.

Toolbar:

* Undo
* Redo
* Bold
* Italic
* Underline
* Bullet list
* Numbered list
* Alignment
* Font size

Tampilkan teks contoh:

“Penelitian ini membahas tentang pengaruh media sosial terhadap produktivitas mahasiswa. Penelitian dilakukan dengan metoda kualitatif dan melibatkan 100 responden.”

Tandai error langsung pada teks menggunakan underline/highlight.

Contoh:
“membahas tentang”
→ error kategori REDUNDANSI

“metoda”
→ error kategori EJAAN

Gunakan warna berbeda untuk setiap kategori:

* Grammar
* Ejaan
* Tanda Baca
* Gaya Akademik
* Redundansi
* Konsistensi Istilah

Tambahkan line number di sisi kiri editor.

Buat teks dapat di-scroll seperti editor dokumen sungguhan.

RIGHT PANEL — ANALYSIS

Header:
“Hasil Analisis”

Tampilkan score:

92/100
“Baik”

Kemudian summary:

🔴 3 Kesalahan
🟡 2 Saran
🟢 95% Kalimat Sudah Baik

Buat filter kategori:

Semua
Grammar
Ejaan
Tanda Baca
Gaya
Istilah

Buat list error:

1.

🔴 Ejaan Tidak Baku
“metoda”
→ “metode”

2.

🔴 Redundansi
“membahas tentang”
→ “membahas”

3.

🟡 Tanda Baca
Koma diperlukan setelah “kualitatif”

Setiap item bisa diklik dan editor otomatis scroll ke lokasi error.

ERROR DETAIL PANEL:

Ketika user mengklik error, tampilkan detail card:

Kategori:
“Redundansi”

Kesalahan:
“membahas tentang”

Saran:
“membahas”

Penjelasan:
“Kata ‘tentang’ tidak diperlukan karena verba ‘membahas’ sudah menunjukkan makna pembahasan terhadap suatu topik.”

Confidence:
98%

Button:
“Terapkan”

Secondary:
“Abaikan”

Tambahkan:
“Tambahkan ke pengecualian”

SCREEN 2 — AI CORRECTION MODE

Buat mode “Perbaiki Semua”.

Ketika user klik:
“Perbaiki Semua”

Tampilkan confirmation modal:

“AI menemukan 5 masalah pada teks Anda.”

Summary:

* 3 kesalahan wajib diperbaiki
* 2 saran gaya akademik

Tampilkan pilihan:

○ Terapkan semua
○ Review satu per satu

Button:
“Review Perbaikan”

SCREEN 3 — REVIEW PERBAIKAN

Buat interface seperti document comparison.

Tampilkan:

SEBELUM
dan
SESUDAH

Contoh:

SEBELUM:
“Penelitian ini membahas tentang pengaruh media sosial...”

SESUDAH:
“Penelitian ini membahas pengaruh media sosial...”

Perubahan harus diberi highlight.

Sidebar kanan:

“Perubahan 1 dari 5”

Kategori:
Redundansi

Alasan:
“Menghilangkan kata yang tidak diperlukan agar kalimat lebih efektif.”

Button:
“Terapkan”
“Lewati”

Navigation:
← Sebelumnya
Berikutnya →

SCREEN 4 — GRAMMAR SCORE

Setelah semua pemeriksaan selesai, tampilkan dashboard hasil.

Header:
“Analisis Grammar Selesai”

Hero score:

92/100

Label:
“Penulisan Sudah Baik”

Buat circular progress.

Breakdown:

Ejaan
96%

Tata Bahasa
91%

Tanda Baca
88%

Gaya Akademik
94%

Konsistensi Istilah
90%

Buat visual progress bar.

Section:
“Masalah yang Ditemukan”

Card:

🔴 3 Kesalahan
Wajib diperbaiki

🟡 4 Saran
Disarankan diperbaiki

🟢 18 Kalimat Baik
Tidak perlu perubahan

Section:
“Rekomendasi AI”

Contoh:

“Secara umum tulisan sudah cukup baik. Fokus perbaikan utama terdapat pada tanda baca dan konsistensi istilah.”

CTA:
“Review Semua Perbaikan”

Secondary:
“Kembali ke Editor”

SCREEN 5 — DOCUMENT CHECK

Buat fitur untuk memeriksa dokumen panjang.

Header:
“Periksa Dokumen”

Upload area:

“Upload skripsi atau dokumen akademik”

Supported:
DOCX
PDF
TXT

Drag & Drop area.

Setelah upload:

File:
“Skripsi_Bab_3.docx”

Size:
2.4 MB

Status:
✓ Dokumen berhasil dibaca

Tampilkan:

Halaman:
24

Jumlah kata:
8.245

Estimasi pemeriksaan:
“Kurang dari 1 menit”

Button:
“Mulai Pemeriksaan”

SCREEN 6 — LONG DOCUMENT RESULT

Setelah pemeriksaan dokumen panjang selesai:

Header:
“Analisis Dokumen”

File:
Skripsi_Bab_3.docx

Overall Score:
89/100

Buat summary:

Total kata: 8.245
Total masalah: 37
Kesalahan: 18
Saran: 19

Buat breakdown berdasarkan bab/halaman:

Bab III
92%
12 masalah

Bab IV
86%
18 masalah

Bab V
91%
7 masalah

Setiap bagian dapat diklik untuk membuka editor di lokasi tersebut.

SCREEN 7 — TERM CONSISTENCY

Buat fitur khusus untuk konsistensi istilah.

Header:
“Konsistensi Istilah”

Tampilkan contoh:

“kuesioner”
Digunakan: 24x

“questionnaire”
Digunakan: 4x

AI Recommendation:
“Gunakan satu istilah secara konsisten.”

Button:
“Samakan Menjadi ‘kuesioner’”

Tambahkan daftar istilah:

* responden
* partisipan
* metode
* metoda
* online
* daring

Tampilkan status:
✓ Konsisten
⚠ Perlu diperiksa

SCREEN 8 — WRITING STYLE

Buat panel analisis gaya akademik.

Score:
87/100

Analyze:

Formalitas
90%

Kejelasan
84%

Efektivitas Kalimat
86%

Konsistensi
89%

Tampilkan rekomendasi:

“Kalimat pasif terlalu sering digunakan.”

Contoh:

Sebelum:
“Data dikumpulkan oleh peneliti melalui wawancara.”

Saran:
“Peneliti mengumpulkan data melalui wawancara.”

Button:
“Terapkan Saran”

SCREEN 9 — EXPORT

Buat modal export.

Title:
“Export Dokumen”

Options:

□ Terapkan semua perbaikan
□ Sertakan komentar AI
□ Tampilkan perubahan

Format:

DOCX
PDF
TXT

Button:
“Export Dokumen”

Tampilkan success state:

✓ Dokumen berhasil diperbaiki

“Skripsi_Bab_3_Reviewed.docx”

Button:
“Download Dokumen”

INTERACTION:

Buat prototype interaktif:

Dashboard
→ Grammar Checker
→ Input Text
→ Analyze
→ Error Detected
→ Click Error
→ Error Detail
→ Apply Correction
→ Next Error
→ Finish Review
→ Grammar Score
→ Export

Buat state:

1. Empty editor
2. User typing
3. Analyzing
4. Analysis complete
5. Error selected
6. Correction applied
7. Correction ignored
8. All corrections applied
9. Document uploaded
10. Long document analyzing
11. Export success
12. No errors found

EMPTY STATE:

Jika belum ada teks:

Icon document/check

Title:
“Mulai Periksa Tulisanmu”

Description:
“Tempel teks atau upload dokumen skripsimu untuk menemukan kesalahan ejaan, grammar, dan gaya akademik.”

Buttons:
“Paste Text”
“Upload Document”

NO ERROR STATE:

Jika tidak ada kesalahan:

✓ Tidak ditemukan kesalahan

“Tulisan kamu sudah sesuai dengan standar pemeriksaan yang digunakan.”

Score:
100/100

Tambahkan tombol:
“Periksa Dokumen Lain”

UX PRINCIPLES:

1. Jangan membuat user harus membaca laporan panjang untuk menemukan error.
2. Error harus langsung terlihat pada teks.
3. Klik error → otomatis tampilkan alasan dan saran.
4. User selalu memiliki kontrol untuk menerapkan atau menolak perubahan.
5. Jangan otomatis mengubah tulisan tanpa persetujuan user.
6. Bedakan antara ERROR dan SUGGESTION.
7. Gunakan bahasa Indonesia yang mudah dipahami mahasiswa.
8. Hindari istilah teknis grammar yang tidak perlu.
9. Jangan mengubah makna akademik dari kalimat.
10. Prioritaskan readability untuk dokumen panjang.
11. Buat editor menjadi fokus utama, bukan dashboard.
12. Pastikan semua interaction state tersedia.
13. Buat responsive design.
14. Gunakan component system yang reusable.

IMPORTANT PRODUCT DIFFERENTIATOR:

Jangan membuat fitur hanya sebagai “spell checker”.

Buat sistem terasa seperti:

**AI Academic Writing Assistant untuk Skripsi Indonesia.**

Sistem harus mampu membantu:

* Ejaan KBBI
* Tata bahasa
* Redundansi
* Tanda baca
* Kalimat tidak efektif
* Gaya bahasa akademik
* Kalimat pasif berlebihan
* Konsistensi istilah
* Bahasa informal
* Struktur kalimat

Tambahkan label kategori pada setiap error sehingga mahasiswa memahami jenis masalahnya.

Gunakan realistic Indonesian academic sample text pada seluruh prototype agar desain terlihat seperti produk nyata, bukan placeholder.

Hasil akhir harus berupa high-fidelity interactive prototype dengan visual hierarchy kuat, editor dokumen yang realistis, inline error detection, AI suggestion panel, review correction flow, score dashboard, document upload, dan export flow.
