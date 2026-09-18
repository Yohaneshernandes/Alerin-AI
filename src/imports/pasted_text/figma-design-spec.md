STRICT DESIGN PRESERVATION + INTERACTIVE PROTOTYPE MODE

Saya melampirkan:
1. File Figma asli sebagai SOURCE OF TRUTH utama.
2. Screenshot sebagai referensi visual.

Tugas kamu adalah mengimplementasikan desain dari file Figma asli ke dalam Figma Make dengan tampilan semirip mungkin dengan desain yang diberikan.

JANGAN melakukan redesign atau membuat interpretasi visual baru.

==================================================
1. ATURAN UTAMA DESAIN
==================================================

Prioritaskan file Figma asli sebagai sumber utama.

Pertahankan:
- layout
- ukuran dan proporsi
- posisi setiap elemen
- warna
- typography
- font
- font weight
- line height
- letter spacing
- spacing
- border radius
- shadow
- icon
- illustration
- mascot
- asset
- decorative background
- progress bar
- card
- button
- alignment

Jangan mengganti asset Figma dengan asset generik.

Jangan menambahkan elemen visual baru yang tidak ada pada desain kecuali diperlukan untuk mendukung interaction.

Screenshot yang saya lampirkan hanya digunakan untuk membantu memahami tampilan visual dan hierarchy.

==================================================
2. STRUKTUR HALAMAN
==================================================

Pertahankan struktur halaman seperti desain asli:

- Background putih / very light blue
- Decorative curved dotted elements pada background
- Progress indicator di bagian atas
- Tombol back di kiri atas
- Text progress "Langkah 10 dari 10"
- Progress bar horizontal
- Persentase progress di kanan
- Mascot kecil di bagian kanan atas
- Card informasi Alerin di bagian tengah atas
- Section "DIREKOMENDASIKAN"
- Dua kartu fitur utama berdampingan:
  1. Fitur Parafrase
  2. Fitur Cari Jurnal
- Card CTA / recommendation di bagian bawah

Jangan mengubah komposisi utama tersebut.

==================================================
3. COPY / REDAKSI
==================================================

Pertahankan text utama dari desain asli.

Heading:
"Fitur yang pas buat kamu ✨"

Subheading:
"Berdasarkan kendalamu, ini fitur yang paling bisa membantu."

Section label:
"DIREKOMENDASIKAN"

Feature 1:
"Fitur Parafrase"

Description:
"Fitur parafrase membantu mengubah kalimat menjadi versi baru dengan makna yang sama, agar tulisan lebih mudah dipahami."

Feature 2:
"Fitur Cari Jurnal"

Description:
"Pembentukan mentalitas kepenelitian & kedisiplinan riset untuk bersaing di Iyy League & PTN Unggulan."

==================================================
4. FEATURE CARD HARUS BISA DIPILIH
==================================================

Jadikan setiap feature card sebagai selectable card.

Feature yang tersedia:
- Fitur Parafrase
- Fitur Cari Jurnal

Default:
- Tidak ada fitur yang dipilih.
- Semua card berada dalam keadaan normal.
- Button CTA di bawah dalam keadaan disabled.

Ketika user mengklik "Fitur Parafrase":
- Card menjadi selected.
- Berikan selected state yang tetap konsisten dengan desain asli.
- Gunakan border / outline / highlight yang subtle.
- Tambahkan indikator selected jika diperlukan.
- Card lain tetap normal.
- Button CTA di bawah berubah menjadi ACTIVE.

Ketika user mengklik "Fitur Cari Jurnal":
- Card menjadi selected.
- Terapkan selected state yang sama.
- Card lainnya kembali ke normal.
- Button CTA menjadi ACTIVE.

Hanya SATU fitur yang boleh dipilih pada satu waktu.

Jika user memilih fitur lain:
- selection berpindah ke fitur baru.
- jangan membuat dua fitur aktif sekaligus.

==================================================
5. BUTTON CTA BAGIAN BAWAH
==================================================

Pertahankan bentuk, ukuran, radius, posisi, dan style button/card bawah mengikuti desain Figma asli.

Namun ubah fungsi dan redaksinya agar menjadi CTA untuk fitur yang dipilih.

Gunakan area CTA bawah sebagai recommendation / next action card.

Default state ketika belum memilih fitur:

Title:
"Pilih fitur yang kamu butuhkan"

Description:
"Klik salah satu fitur di atas untuk melihat bantuan yang paling sesuai dengan kebutuhanmu."

Button:
"Pilih Fitur"

Button dalam keadaan DISABLED dan tidak dapat diklik.

==================================================
6. ACTIVE CTA STATE
==================================================

Setelah user memilih salah satu fitur:

Ubah text CTA secara dinamis.

Untuk Fitur Parafrase:

Title:
"Siap mulai parafrase?"

Description:
"Gunakan fitur Parafrase untuk membantu membuat tulisanmu lebih jelas dan mudah dipahami."

Button:
"Mulai Parafrase →"

Untuk Fitur Cari Jurnal:

Title:
"Siap mencari jurnal?"

Description:
"Temukan referensi jurnal yang sesuai untuk mendukung tugas dan penelitianmu."

Button:
"Mulai Cari Jurnal →"

Button menjadi aktif dan clickable setelah fitur dipilih.

==================================================
7. BUTTON INTERACTION
==================================================

Button harus memiliki 3 state:

STATE 1 — DISABLED
- terjadi ketika belum ada fitur dipilih
- warna button mengikuti desain asli tetapi terlihat disabled
- cursor / interaction disabled
- tidak dapat melanjutkan

STATE 2 — ACTIVE
- muncul setelah fitur dipilih
- gunakan warna utama button dari desain Figma
- button dapat diklik
- hover state harus tersedia
- active/pressed state harus tersedia jika memungkinkan

STATE 3 — NAVIGATION
Ketika button diklik:

Jika selected feature = Fitur Parafrase:
→ arahkan user ke halaman / screen Fitur Parafrase.

Jika selected feature = Fitur Cari Jurnal:
→ arahkan user ke halaman / screen Fitur Cari Jurnal.

Gunakan destination/page yang sudah tersedia di file Figma apabila ada.

Jangan membuat halaman baru apabila destination yang sesuai sudah ada.

==================================================
8. BUTTON TEXT DINAMIS
==================================================

CTA bawah harus selalu mengikuti fitur yang dipilih.

Tidak ada selection:
"Pilih Fitur"

Fitur Parafrase selected:
"Mulai Parafrase →"

Fitur Cari Jurnal selected:
"Mulai Cari Jurnal →"

Pastikan title, description, dan button berubah secara konsisten ketika selection berubah.

==================================================
9. VISUAL SELECTED STATE
==================================================

Selected state jangan membuat desain menjadi berbeda jauh dari Figma asli.

Pertahankan:
- ukuran card
- posisi card
- ilustrasi
- typography
- warna dasar
- radius
- spacing

Tambahkan selected indicator secara minimal, misalnya:
- border yang lebih jelas
- subtle glow/shadow
- check indicator kecil

Gunakan visual language yang sama dengan desain asli.

==================================================
10. BACK BUTTON
==================================================

Tombol back tetap berada di kiri atas seperti desain asli.

Ketika diklik:
→ kembali ke halaman / langkah sebelumnya.

Pertahankan desain button back dari Figma.

==================================================
11. RESPONSIVE
==================================================

Pada desktop:
- tampilkan layout persis seperti Figma.

Pada tablet:
- pertahankan hierarchy dan proporsi.

Pada mobile:
- feature cards boleh disusun vertikal
- CTA tetap berada di bagian bawah setelah feature list
- typography dapat menyesuaikan secara proporsional
- jangan mengubah visual identity.

==================================================
12. IMPLEMENTATION QUALITY
==================================================

Gunakan component dan state yang rapi.

Buat logic:
selectedFeature

Nilai yang diperbolehkan:
- null
- "parafrase"
- "jurnal"

Behavior:

selectedFeature = null
→ CTA disabled

selectedFeature = "parafrase"
→ CTA aktif
→ text CTA = "Mulai Parafrase →"

selectedFeature = "jurnal"
→ CTA aktif
→ text CTA = "Mulai Cari Jurnal →"

Pastikan selection tetap sinkron antara card dan CTA.

==================================================
13. FINAL REQUIREMENT
==================================================

Hasil akhir harus terasa seperti desain Figma asli yang sekarang sudah menjadi prototype interaktif.

Jangan membuat redesign.

Jangan mengubah visual hanya karena menurut kamu ada desain yang lebih modern.

Prioritas:

1. Exact Figma design
2. Exact asset
3. Exact visual hierarchy
4. Interactive feature selection
5. Dynamic CTA
6. Navigation ke fitur yang dipilih
7. Responsive behavior

Implementasikan desain terlebih dahulu, kemudian tambahkan interaction tanpa mengganggu tampilan visual.