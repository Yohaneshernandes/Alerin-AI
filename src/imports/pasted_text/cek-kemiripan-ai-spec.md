Buat desain dan prototype high-fidelity untuk fitur web app bernama **“Cek Kemiripan & Parafrase”**, yaitu fitur AI untuk membantu mahasiswa Indonesia menemukan bagian skripsi yang memiliki tingkat kemiripan tinggi dan memperbaikinya dengan parafrase akademik.

IMPORTANT:
Jangan membuat fitur ini sebagai plagiarism checker yang mengklaim mampu mendeteksi plagiarisme secara absolut.

Gunakan istilah:

* “Similarity Score”
* “Tingkat Kemiripan”
* “Bagian yang Perlu Diperiksa”
* “Potensi Kemiripan Tinggi”

Jangan menggunakan klaim “100% bebas plagiarisme” atau “pasti lolos Turnitin”.

KONSEP UTAMA:

Upload dokumen
→ Analisis similarity
→ Lihat overall similarity score
→ Identifikasi bagian dengan kemiripan tinggi
→ Buka bagian tersebut
→ Bandingkan teks original dengan saran AI
→ Parafrase
→ Review perubahan
→ Terapkan perubahan
→ Cek ulang

Tujuan UX:
Membantu mahasiswa memahami bagian mana yang perlu diperbaiki dan memberikan kontrol penuh terhadap perubahan teks.

DESIGN DIRECTION:

Gunakan desain modern, profesional, akademik, clean, dan trustworthy.

Desktop-first:

* Frame utama 1440px
* Responsive tablet dan mobile
* Font: Inter
* 8px spacing system
* Border radius 10–14px
* Card dengan border tipis
* Subtle shadow
* Background light neutral
* Primary: #2563EB
* Success: green
* Warning: amber
* High similarity: red
* Neutral: gray
* Text: dark navy/charcoal

Gunakan warna hanya untuk menunjukkan status dan severity.

GLOBAL SIDEBAR:

Logo

Navigation:

* Dashboard
* Skripsi Saya
* Grammar Checker
* Cek Kemiripan
* Parafrase
* Citation
* Simulasi Sidang

Bottom:

* Bantuan
* Pengaturan
* Profile

“Cek Kemiripan” menjadi menu aktif.

SCREEN 1 — SIMILARITY DASHBOARD

Header:

Title:
“Cek Kemiripan Skripsi”

Subtitle:
“Temukan bagian tulisan yang memiliki kemiripan tinggi dan perbaiki dengan bantuan AI.”

Hero section:

Card besar:

“Similarity Score”

24%

Status:
“Perlu Diperiksa”

Tambahkan explanatory text:
“Skor ini menunjukkan tingkat kemiripan yang terdeteksi pada dokumen berdasarkan pemeriksaan yang dilakukan sistem.”

Tambahkan button:
“Periksa Dokumen”

Secondary:
“Lihat Riwayat”

Buat breakdown per BAB:

Bab I — Pendahuluan
8%

Bab II — Landasan Teori
42% 🔴

Bab III — Metodologi
18%

Bab IV — Hasil & Pembahasan
12%

Bab V — Kesimpulan
9%

Gunakan horizontal progress bars.

SECTION — “Bagian yang Perlu Diperiksa”

Buat 3 cards:

Card 1:
Bab II — Halaman 18
Similarity: 78%
Severity: Tinggi

Preview:
“Penelitian ini bertujuan untuk mengetahui...”

Button:
“Periksa”

Card 2:
Bab II — Halaman 23
Similarity: 65%
Severity: Sedang

Card 3:
Bab IV — Halaman 48
Similarity: 54%
Severity: Sedang

SCREEN 2 — UPLOAD DOCUMENT

Title:
“Upload Dokumen”

Description:
“Upload skripsimu untuk menganalisis tingkat kemiripan teks.”

Large drag & drop area:

“Tarik file ke sini”

atau

“Pilih File”

Supported:
DOCX
PDF
TXT

File example:

Skripsi_Final_Bab_1-5.docx
3.8 MB
✓ Siap dianalisis

Button:
“Mulai Analisis”

Tambahkan privacy information:

“Dokumen digunakan untuk proses analisis dan tidak dibagikan kepada pihak lain.”

SCREEN 3 — ANALYZING

Buat loading state yang profesional.

Title:
“Sedang menganalisis dokumen...”

Progress:
67%

Step indicators:

✓ Membaca dokumen
✓ Menganalisis struktur
● Menganalisis kemiripan
○ Menyiapkan hasil

Tambahkan estimated time:

“Analisis biasanya membutuhkan beberapa saat.”

Jangan membuat loading terlalu lama.

SCREEN 4 — SIMILARITY RESULT

Header:
“Hasil Analisis Kemiripan”

File:
Skripsi_Final.docx

Hero:

Similarity Score
24%

Status:
“Perlu Diperiksa”

Summary cards:

Total halaman:
82

Bagian diperiksa:
124

Kemiripan tinggi:
3

Kemiripan sedang:
7

Kemiripan rendah:
14

SECTION:
“Distribusi Kemiripan”

Gunakan chart/bar sederhana berdasarkan BAB.

Bab I
8%

Bab II
42%

Bab III
18%

Bab IV
12%

Bab V
9%

SECTION:
“Bagian dengan Kemiripan Tertinggi”

List:

1. Bab II — Halaman 18
   78% Similarity
   “Penelitian ini bertujuan...”

Button:
“Review”

2. Bab II — Halaman 23
   65%
   Button:
   “Review”

3. Bab IV — Halaman 48
   54%
   Button:
   “Review”

SCREEN 5 — SIMILARITY DETAIL

Buat layout dua kolom.

LEFT:
Document editor.

Tampilkan halaman skripsi.

Highlight bagian yang memiliki similarity tinggi.

Contoh:

“Penelitian ini bertujuan untuk mengetahui pengaruh penggunaan media sosial terhadap minat beli mahasiswa.”

Gunakan red/orange highlight untuk bagian yang perlu diperiksa.

RIGHT PANEL:

“Analisis Kemiripan”

Similarity:
78%

Severity:
Tinggi

Section:
“Bagian yang Perlu Diperiksa”

Tampilkan teks yang terdeteksi.

Section:
“AI Suggestion”

Berikan saran parafrase akademik.

Original:
“Penelitian ini bertujuan untuk mengetahui pengaruh penggunaan media sosial terhadap minat beli mahasiswa.”

Suggested:
“Penelitian ini dilakukan untuk menganalisis pengaruh pemanfaatan media sosial terhadap minat beli pada kalangan mahasiswa.”

Metrics:

Perubahan struktur: Tinggi
Kejelasan: Baik
Gaya akademik: Baik
Makna: Dipertahankan

Buttons:

“Gunakan Hasil”
“Parafrase Lagi”
“Abaikan”

SCREEN 6 — PARAPHRASE EDITOR

Buat editor khusus untuk membandingkan teks.

Header:
“Parafrase dengan AI”

Tampilkan two-column comparison.

LEFT:
“Original”

Text original.

RIGHT:
“Hasil Parafrase”

Text hasil AI.

Highlight perubahan kata dan struktur.

Tambahkan AI settings:

Gaya:

* Akademik
* Formal
* Natural
* Ringkas
* Detail

Strength:

* Ringan
* Sedang
* Tinggi

Tambahkan warning:

“Pastikan hasil parafrase tetap sesuai dengan makna dan konteks penelitianmu.”

Buttons:

“Gunakan Hasil”
“Generate Ulang”

SCREEN 7 — REVIEW CHANGES

Buat interface seperti track changes.

Header:
“Review Perubahan”

Progress:
Perubahan 2 dari 5

Tampilkan:

ORIGINAL

“Penelitian ini bertujuan untuk mengetahui pengaruh penggunaan media sosial terhadap minat beli mahasiswa.”

AI VERSION

“Penelitian ini dilakukan untuk menganalisis pengaruh pemanfaatan media sosial terhadap minat beli pada kalangan mahasiswa.”

Highlight:

* kata yang berubah
* struktur yang berubah
* bagian yang tetap

AI explanation:

“Struktur kalimat diubah dari pola ‘bertujuan untuk mengetahui’ menjadi ‘dilakukan untuk menganalisis’ agar kalimat lebih natural tanpa mengubah inti informasi.”

Buttons:

“Terapkan Perubahan”
“Lewati”

Navigation:
← Sebelumnya
Berikutnya →

SCREEN 8 — FULL DOCUMENT PARAPHRASE

Buat fitur premium untuk melakukan parafrase berdasarkan BAB.

Title:
“Parafrase BAB”

Tampilkan daftar:

Bab I
✓ Sudah diperiksa

Bab II
⚠ 12 bagian perlu diperbaiki

Bab III
✓ Sudah diperiksa

Bab IV
⚠ 5 bagian perlu diperbaiki

Bab V
✓ Sudah diperiksa

Button:
“Parafrase BAB II”

Tambahkan confirmation modal:

“Parafrase 1 BAB akan mengubah teks pada 12 bagian yang dipilih.”

Options:
○ Review satu per satu
○ Parafrase semua bagian

Important:
Pastikan user selalu memiliki opsi untuk review sebelum perubahan diterapkan.

SCREEN 9 — BEFORE & AFTER RESULT

Setelah user melakukan parafrase:

Title:
“Perbandingan Sebelum & Sesudah”

Create comparison card:

BEFORE
Similarity:
42%

AFTER
Estimated similarity:
lebih rendah

Gunakan visual comparison sederhana.

Tambahkan:

“Perubahan berhasil diterapkan pada 12 bagian.”

Metrics:

12 bagian diperbaiki
34 kalimat diproses
100% perubahan direview

Button:
“Lihat Dokumen”

Secondary:
“Analisis Ulang”

IMPORTANT:
Jangan menampilkan angka penurunan similarity sebagai hasil yang pasti jika belum benar-benar dilakukan pemeriksaan ulang oleh sistem.

Gunakan label:
“Estimasi”
atau
“Setelah pemeriksaan ulang”

SCREEN 10 — HISTORY

Title:
“Riwayat Pemeriksaan”

Table:

Tanggal
Dokumen
Similarity
Bagian Diperiksa
Status
Action

Example:

27 Aug 2026
Skripsi Final
24%
3 bagian tinggi
Lihat Detail

20 Aug 2026
Bab II
38%
8 bagian
Lihat Detail

Buat filter:

* Semua
* Terbaru
* Similarity tinggi
* Sudah diperbaiki

SCREEN 11 — SUCCESS STATE

Setelah user menyelesaikan review:

Icon success

Title:
“Review Selesai”

Description:
“Semua bagian yang kamu pilih sudah diperiksa dan perubahan telah diterapkan.”

Summary:

12 bagian diperiksa
10 perubahan diterapkan
2 perubahan ditolak

Button:
“Lihat Dokumen”

Secondary:
“Periksa Ulang”

INTERACTION:

Buat prototype flow:

Dashboard
→ Upload Document
→ Analyze
→ Similarity Result
→ Select High Similarity
→ Similarity Detail
→ AI Paraphrase
→ Compare Original & Result
→ Review Changes
→ Apply
→ Analyze Again
→ Updated Result

Buat interaction state:

1. Empty
2. File uploaded
3. Upload error
4. Analyzing
5. Analysis complete
6. High similarity selected
7. AI generating
8. Paraphrase result
9. User accepts
10. User rejects
11. Generate again
12. Review complete
13. Re-check
14. Success

EDITOR BEHAVIOR:

Buat editor terasa seperti Google Docs / Microsoft Word.

Fitur:

* text selection
* inline highlight
* paragraph selection
* line numbers
* undo
* redo
* save
* version history

Ketika user memilih teks:

Floating toolbar muncul:

“Ask AI”

Menu:

* Parafrase
* Ringkas
* Perjelas
* Buat lebih akademik

Untuk fitur ini fokus utama adalah:
“Parafrase”

PRIVACY:

Tambahkan privacy notice di upload dan result:

“Dokumenmu digunakan untuk proses analisis. Jangan masukkan data pribadi atau informasi rahasia yang tidak diperlukan.”

UX PRINCIPLES:

1. Jangan membuat user takut dengan angka similarity.
2. Jelaskan bahwa similarity bukan otomatis berarti plagiarisme.
3. Gunakan “Perlu Diperiksa” daripada langsung mengatakan “Plagiarisme”.
4. Berikan konteks pada setiap bagian yang terdeteksi.
5. User harus bisa melihat original dan hasil AI.
6. Jangan mengubah teks secara otomatis tanpa persetujuan user.
7. Pertahankan format dokumen.
8. Pertahankan heading, bold, italic, tabel, citation, dan numbering.
9. Jangan mengubah citation/reference secara otomatis.
10. Jangan mengubah fakta, angka, nama penelitian, istilah teknis, atau nama sumber.
11. Pastikan makna akademik tetap dipertahankan.
12. Gunakan Bahasa Indonesia yang natural.
13. Buat semua feedback mudah dipahami mahasiswa.

PRODUCT DIFFERENTIATOR:

Jangan membuat produk sekadar:
“Plagiarism Checker”

Buat menjadi:

**AI Similarity Assistant untuk Skripsi**

Flow utama:

**Detect → Explain → Paraphrase → Review → Re-check**

Sehingga mahasiswa tidak hanya mengetahui bahwa suatu bagian memiliki kemiripan tinggi, tetapi langsung dibantu memahami bagian tersebut dan memperbaikinya secara terkontrol.

Gunakan realistic Indonesian academic sample content pada seluruh screen.

Hasil akhir harus berupa high-fidelity interactive prototype yang terasa seperti produk SaaS akademik profesional dan siap dikembangkan menjadi fitur web production.
