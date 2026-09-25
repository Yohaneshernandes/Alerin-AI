Buat desain dan prototype high-fidelity untuk fitur web app bernama **“Simulasi Sidang Skripsi”** yang membantu mahasiswa Indonesia berlatih menghadapi sidang skripsi menggunakan AI sebagai dosen penguji.

Tujuan utama fitur:
Membuat mahasiswa dapat melakukan simulasi sidang secara interaktif berdasarkan isi skripsi mereka, memilih karakter dan tingkat kesulitan dosen, menjawab pertanyaan, mendapatkan feedback AI, dan melihat laporan kesiapan sidang setelah sesi selesai.

Gunakan desain modern, profesional, clean, akademik, tetapi tetap friendly untuk mahasiswa. Prioritaskan usability, visual hierarchy, readability, dan pengalaman yang tidak membuat mahasiswa merasa terintimidasi.

Gunakan desktop-first web app dengan frame utama 1440px wide. Gunakan responsive layout untuk tablet dan mobile.

DESIGN SYSTEM:

* Font: Inter atau font sans-serif modern yang sangat mudah dibaca
* Border radius: 10–14px
* Spacing system: 8px
* Gunakan card dengan border tipis dan subtle shadow
* Background aplikasi: very light neutral gray
* Primary color: blue modern seperti #2563EB
* Success: green
* Warning: amber
* Error: red
* Text utama: dark navy/charcoal
* Hindari desain yang terlalu colorful
* Gunakan icon sederhana dan konsisten
* CTA utama harus sangat jelas
* Buat komponen reusable untuk button, card, badge, progress bar, avatar, modal, input, tabs, tooltip, dan alert

BUAT 6 SCREEN UTAMA:

SCREEN 1 — SIMULATION DASHBOARD

Header:

* Logo website
* Navigation: Dashboard, Skripsi Saya, Simulasi Sidang, Riwayat
* Notification
* Profile mahasiswa

Main content:
Title: “Simulasi Sidang”
Subtitle: “Latih kemampuan menjawab pertanyaan penguji berdasarkan skripsimu.”

Buat hero card:
“Seberapa siap kamu menghadapi sidang?”
Readiness Score: 78%
Status: “Cukup Siap”

Tampilkan progress breakdown:

* Penguasaan Materi: 85%
* Metodologi: 72%
* Argumentasi: 80%
* Kejelasan Jawaban: 76%
* Konsistensi Jawaban: 81%

CTA utama:
“+ Mulai Simulasi Baru”

Buat section “Riwayat Simulasi” dengan beberapa card:

* tanggal
* jenis penguji
* jumlah pertanyaan
* score
* readiness
* tombol “Lihat Hasil”

Tambahkan empty state jika belum pernah melakukan simulasi.

SCREEN 2 — SETUP SIMULATION

Buat halaman wizard sebelum simulasi dimulai.

Step indicator:

1. Pilih Skripsi
2. Penguji
3. Pengaturan
4. Mulai

Step 1:
Card upload/pilih skripsi.
Tampilkan:
“Pilih Skripsi yang akan digunakan”
File contoh:
“Analisis Pengaruh Media Sosial terhadap Minat Beli Gen Z.pdf”
Status:
“✓ Skripsi berhasil dianalisis”

Tampilkan metadata:

* Judul
* Program Studi
* Jumlah halaman
* Bab terdeteksi
* Status analisis AI

Step 2:
“Pilih Karakter Penguji”

Buat 4 card penguji:

1. Penguji Kritis — Expert
   Deskripsi: “Pertanyaan tajam, detail, dan sering menguji kelemahan penelitian.”
2. Penguji Akademik — Hard
   Deskripsi: “Fokus pada teori, metodologi, dan validitas penelitian.”
3. Penguji Balanced — Medium
   Deskripsi: “Seimbang antara pertanyaan kritis dan pertanyaan pemahaman.”
4. Penguji Supportive — Easy
   Deskripsi: “Membantu membangun kepercayaan diri dengan pertanyaan bertahap.”

Setiap card memiliki avatar dosen AI, difficulty badge, description, dan radio selection.

Step 3:
Pengaturan simulasi:

* Durasi: 15 / 30 / 45 / 60 menit
* Tingkat kesulitan: Easy / Medium / Hard / Expert
* Jumlah pertanyaan: 10 / 15 / 20
* Fokus pertanyaan:
  Bab I
  Bab II
  Bab III
  Bab IV
  Bab V
  Semua Bab

Tambahkan toggle:
“Pertanyaan lanjutan berdasarkan jawaban saya”

Tambahkan CTA:
“Mulai Simulasi”

SCREEN 3 — LIVE SIMULATION

Buat interface simulasi yang fokus dan immersive.

Layout:
Sidebar kiri sekitar 280px.
Content area utama.

Sidebar:

* Avatar dosen AI
* Nama: “Prof. Dr. Andi”
* Badge: “Penguji Kritis”
* Status: “● Sedang menguji”
* Progress simulasi
* “Pertanyaan 4 dari 15”
* Timer
* List nomor pertanyaan
* Pertanyaan yang sudah dijawab ditandai completed
* Pertanyaan aktif diberi highlight

Main area:
Header kecil:
“Simulasi Sidang”
“Pertanyaan 04/15”
Timer countdown.

Question card besar:
Label: “PERTANYAAN PENGUJI”
Tampilkan pertanyaan:
“Mengapa Anda memilih metode kuantitatif dibandingkan metode kualitatif dalam penelitian ini?”

Buat area jawaban:
Textarea besar dengan placeholder:
“Tulis jawaban Anda sebagai mahasiswa...”

Tambahkan:

* character counter
* microphone button “Jawab dengan Suara”
* button “Kirim Jawaban”

Saat user mengirim jawaban, tampilkan loading state:
“AI sedang menganalisis jawaban Anda...”

Setelah analisis selesai, tampilkan feedback drawer/card di bawah pertanyaan.

FEEDBACK CARD:
Score besar:
82/100
Badge: “Sangat Baik”

Section:
“Analisis Jawaban”

“Yang sudah bagus”

* Jawaban relevan dengan metode penelitian
* Penjelasan cukup sistematis
* Menggunakan istilah akademik dengan tepat

“Yang perlu diperbaiki”

* Berikan alasan yang lebih spesifik
* Hubungkan dengan karakteristik data penelitian
* Tambahkan landasan metodologis

“Contoh jawaban yang lebih kuat”
Tampilkan contoh jawaban dalam card yang mudah dibaca.

Tampilkan mini metrics:
Relevansi 90%
Kelengkapan 78%
Argumentasi 80%
Kejelasan 84%

CTA:
“Lanjut Pertanyaan”

SCREEN 4 — FOLLOW-UP QUESTION

Buat state ketika AI memberikan pertanyaan lanjutan berdasarkan jawaban mahasiswa.

Contoh:
Penguji:
“Baik. Jika demikian, bagaimana Anda memastikan bahwa data yang Anda gunakan valid?”

Tambahkan badge:
“Pertanyaan Lanjutan”

Tampilkan indikator:
“AI mendeteksi area yang perlu diperdalam: VALIDITAS DATA”

Buat interface jawaban yang sama dengan Screen 3.

Tujuannya membuat simulasi terasa seperti percakapan sidang sungguhan, bukan sekadar kumpulan soal.

SCREEN 5 — SESSION RESULT

Setelah simulasi selesai, tampilkan halaman hasil.

Header:
“Simulasi Selesai 🎓”
Subtitle:
“Berikut analisis performa kamu selama simulasi.”

Hero score:
“78/100”
Label:
“Cukup Siap Sidang”

Tambahkan readiness visualization berbentuk circular progress.

Section:
“Performa Kamu”

Metrics:

* Penguasaan Materi — 85%
* Metodologi — 72%
* Argumentasi — 80%
* Kejelasan Jawaban — 76%
* Konsistensi — 81%

Gunakan horizontal progress bars.

Section:
“Kekuatan Kamu”

* Penguasaan materi cukup baik
* Jawaban relevan dengan penelitian
* Struktur jawaban cukup jelas

Section:
“Yang Perlu Diperkuat”

* Metodologi penelitian
* Validitas data
* Argumentasi pemilihan metode

Section:
“Rekomendasi AI”
Buat recommendation card:
“Sebelum simulasi berikutnya, pelajari kembali Bab III terutama bagian metode penelitian, teknik sampling, dan validitas data.”

Section:
“Pertanyaan yang Paling Sulit”
Buat list 3 pertanyaan dengan score masing-masing.

CTA:
“Latihan Lagi”
“Lihat Detail Jawaban”

Secondary CTA:
“Download Laporan”

SCREEN 6 — ANSWER REVIEW

Buat halaman untuk melihat seluruh jawaban setelah simulasi.

Header:
“Review Simulasi”
Summary:
15 pertanyaan • 78/100 • 30 menit

Buat list pertanyaan dalam accordion.

Setiap item:
Pertanyaan
Score
Difficulty
Status

Ketika dibuka:

* Jawaban mahasiswa
* Score
* Analisis AI
* Kelebihan
* Kekurangan
* Contoh jawaban yang lebih baik

Tambahkan filter:
Semua
Perlu Diperbaiki
Sangat Baik

Tambahkan search untuk mencari pertanyaan tertentu.

INTERACTION DAN PROTOTYPE:

Buat prototype flow berikut:
Dashboard → Mulai Simulasi → Setup → Pilih Skripsi → Pilih Penguji → Atur Simulasi → Mulai → Live Simulation → Submit Answer → AI Feedback → Follow-up Question → Next Question → Session Result → Answer Review.

Buat state untuk:

* Empty state
* Uploading
* File analyzed
* Selected examiner
* Loading AI
* Answer submitted
* Feedback available
* Timer running
* Session completed

Tambahkan micro-interactions sederhana:

* progress animation
* button hover
* selected card state
* loading indicator
* success state
* score animation

PRINSIP UX:

1. Jangan membuat mahasiswa bingung harus klik apa selanjutnya.
2. CTA utama selalu terlihat jelas.
3. Pada halaman live simulation, pertanyaan dosen harus menjadi fokus utama.
4. Feedback jangan menutupi pertanyaan.
5. Gunakan bahasa Indonesia yang natural dan tidak terlalu formal.
6. Tampilkan progress agar mahasiswa tahu sudah sejauh mana.
7. Jangan membuat interface terlihat seperti chatbot biasa; buat terasa seperti ruang latihan sidang.
8. Pastikan semua state dan screen terlihat konsisten.
9. Prioritaskan accessibility dan contrast.
10. Buat desain yang realistis untuk dikembangkan menjadi web app production-ready.

Tambahkan realistic sample data agar seluruh screen terlihat seperti produk nyata, bukan wireframe kosong.

Hasil akhir harus berupa high-fidelity interactive prototype dengan component system yang konsisten dan seluruh flow simulasi dapat diklik dari awal sampai hasil akhir.
