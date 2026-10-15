import { useEffect, useState, type ReactNode } from "react";

type JournalView = "home" | "collection" | "riwayat";

const searchAssets = "/assets/jurnal-design/search";
const collectionAssets = "/assets/jurnal-design/collection";
const mobileAssets = "/assets/jurnal-design/mobile";

const journals = [
  {
    title: "Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges",
    authors: "Wongkitrungrueng, A. & Assarut, N.",
    description:
      "Interaksi parasosial antara host dan penonton, ditambah dorongan kelangkaan seperti batas waktu dan stok, meningkatkan niat beli di live streaming commerce. Temuan ini relevan untuk riset perilaku konsumen digital di Asia Tenggara.",
  },
  {
    title: "Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges",
    authors: "Wongkitrungrueng, A. & Assarut, N.",
    description:
      "Interaksi parasosial antara host dan penonton, ditambah dorongan kelangkaan seperti batas waktu dan stok, meningkatkan niat beli di live streaming.",
  },
];

const temuanAnalisis = [
  {
    halaman: 18,
    badge: "Sitasi tidak mendukung klaim",
    kutipan:
      "“Media sosial terbukti meningkatkan keputusan pembelian pada seluruh kelompok usia (Pratama, 2021).”",
    alasan: [
      "Artikel hanya meneliti mahasiswa usia 18–24 tahun.",
      "Variabel yang diuji adalah niat beli, bukan keputusan pembelian.",
      "Klaim pada naskah jauh lebih luas daripada bukti dalam sumber aslinya.",
    ],
    saran:
      "“Pada mahasiswa usia 18–24 tahun di Bandung, intensitas penggunaan media sosial berhubungan positif dengan niat beli (Pratama & Lestari, 2021).”",
  },
  {
    halaman: 21,
    badge: "Sumber tidak dapat diverifikasi",
    kutipan:
      "“Konsumen Gen Z lebih loyal pada merek yang transparan (Hidayat, 2022).”",
    alasan: [
      "Referensi Hidayat (2022) tidak ditemukan di OpenAlex maupun Crossref.",
      "Tidak ada DOI atau tautan menuju sumber asli.",
      "Pembaca tidak dapat memeriksa ulang klaim ini.",
    ],
    saran:
      "“Sebanyak 68% konsumen Gen Z menyebut transparansi merek sebagai alasan loyalitas (Aisyah et al., 2023, hlm. 45).”",
  },
  {
    halaman: 24,
    badge: "Parafrase terlalu mirip aslinya",
    kutipan:
      "“Interaksi parasosial membuat penonton merasa dekat dengan host sehingga lebih mudah terdorong membeli (Wongkitrungrueng & Assarut, 2023).”",
    alasan: [
      "Kalimat hasil parafrase lebih dari 80% sama dengan sumber.",
      "Struktur kalimat dan pilihan kata mengikuti sumber terlalu ketat.",
      "Berisiko dianggap plagiarisme oleh pemeriksa similarity.",
    ],
    saran:
      "“Penonton yang membangun ikatan emosional dengan host cenderung lebih percaya dan lebih cepat mengambil keputusan pembelian (Wongkitrungrueng & Assarut, 2023).”",
  },
  {
    halaman: 27,
    badge: "Sumber terlalu lama",
    kutipan:
      "“Pemasaran media sosial adalah kanal utama branding saat ini (Kotler, 2010).”",
    alasan: [
      "Sumber berusia lebih dari 15 tahun.",
      "Lanskap media sosial telah berubah jauh setelah 2010.",
      "Klaim “utama saat ini” butuh data terbaru.",
    ],
    saran:
      "“Pada 2024, media sosial menjadi kanal akuisisi pelanggan dengan biaya terendah bagi UMKM (Databoks, 2024).”",
  },
  {
    halaman: 30,
    badge: "Klaim tanpa sitasi",
    kutipan:
      "“Live streaming commerce tumbuh 3x lebih cepat dibanding e-commerce konvensional.”",
    alasan: [
      "Tidak ada sumber yang dilampirkan pada akhir kalimat.",
      "Angka “3x” tidak diberi rujukan data.",
      "Pembaca tidak tahu periode dan cakupan perbandingan.",
    ],
    saran:
      "“Sepanjang 2023–2024, nilai transaksi live streaming commerce tumbuh 2,7 kali dibanding kanal e-commerce konvensional (Jakpat, 2024).”",
  },
  {
    halaman: 33,
    badge: "Mengutip sumber sekunder",
    kutipan:
      "“Teori uses and gratification menegaskan bahwa audiens aktif memilih media (Rahmawati, 2022).”",
    alasan: [
      "Kutipan diambil dari jurnal Rahmawati, bukan dari teori aslinya.",
      "Sumber asli (Katz, 1974) seharusnya dirujuk langsung.",
      "Pengutipan sumber sekunder melemahkan landasan teori.",
    ],
    saran:
      "“Audiens aktif memilih dan menyesuaikan media sesuai kebutuhannya (Katz, Blumler & Gurevitch, 1974; dikutip dari Rahmawati, 2022).”",
  },
  {
    halaman: 36,
    badge: "Judul sumber tidak sesuai kutipan",
    kutipan:
      "“Kelangkaan produk meningkatkan niat beli secara signifikan (Sari, 2023).”",
    alasan: [
      "Judul sumber Sari (2023) membahas discount depth, bukan kelangkaan.",
      "Variabel dalam sumber berbeda dengan yang dikutip.",
      "Sitasi tampak dipasang agar daftar pustaka penuh.",
    ],
    saran:
      "“Penekanan stok terbatas pada siaran langsung meningkatkan niat beli hingga 24% (Lim & Susanto, 2023).”",
  },
];

const riwayatPencarian = [
  {
    query: "interaksi parasosial niat beli konsumen",
    waktu: "Hari ini, 09.42",
    jumlah: "50 hasil",
    daftar: [
      "Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges",
      "Pengaruh Interaksi Parasosial dan Dorongan Kelangkaan terhadap Niat Beli di Live Streaming Commerce",
      "Parasocial Interaction Effects on Purchase Intention in Social Commerce Livestreaming",
    ],
  },
  {
    query: "kelangkaan produk strategi pemasaran digital",
    waktu: "Kemarin, 20.15",
    jumlah: "38 hasil",
    daftar: [
      "Scarcity Nudges and Consumer Decision Making in Digital Marketplace",
      "Strategi Kelangkaan Produk dalam Meningkatkan Urgensi Pembelian Online",
    ],
  },
  {
    query: "teori uses and gratification media sosial",
    waktu: "12 Okt 2026, 14.03",
    jumlah: "42 hasil",
    daftar: [
      "Uses and Gratification Theory in Social Media Consumer Behavior Research",
      "Eksplorasi Kepuasan Penonton Konten Streaming Berdasarkan Teori Uses and Gratification",
    ],
  },
];

const riwayatSidebar = [
  "Analisis Regresi Variabel Parasosial",
  "Tinjauan Teori TAM Skripsi Bab II",
  "Evaluasi Sitasi & Parafrase Bab 4",
  "Rekomendasi Jurnal Scopus Q1",
  "Buat Rumusan Masalah E-Commerce",
  "Penjelasan Uji Validitas & Reliabilitas",
];

function ProfileCard({ collection }: { collection: boolean }) {
  const assets = collection ? collectionAssets : searchAssets;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
      <img src={`${assets}/48c68.png`} alt="Raka Aditya" className="h-10 w-10 rounded-full object-cover" />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate font-['Inter:Semi_Bold'] text-sm font-semibold text-slate-800">Raka Aditya</p>
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-indigo-950 px-2 py-0.5 font-['Inter:Bold'] text-[8px] font-bold text-white">
            Alerin Plus
            <span className="relative h-3 w-3 overflow-hidden">
              <img src={`${assets}/8923b.png`} alt="" className="absolute -left-2 -top-1 h-12 max-w-none" />
            </span>
          </span>
        </div>
        <p className="mt-0.5 font-['Inter:Regular'] text-xs text-slate-400">Manajemen · Semester 6</p>
      </div>
    </div>
  );
}

function Sidebar({
  view,
  onView,
  onBack,
  onUpgrade,
}: {
  view: JournalView;
  onView: (view: JournalView) => void;
  onBack: () => void;
  onUpgrade: () => void;
}) {
  const assets = view === "collection" ? collectionAssets : searchAssets;
  const homeIcon = view === "collection" ? "62b0b.svg" : "b4a91.svg";
  const collectionIcon = view === "collection" ? "57aea.svg" : "6f1a2.svg";

  return (
    <aside className="hidden w-[280px] shrink-0 flex-col border-r border-slate-100 bg-white p-5 md:flex">
      <div className="flex items-center gap-3">
        <img src={`${assets}/24a8e.svg`} alt="" />
        <div className="min-w-0 flex-1">
          <p className="font-['Inter:Bold'] text-lg font-bold leading-5 text-slate-900">Alerin Jurnal</p>
          <p className="font-['Inter:Medium'] text-xs font-medium leading-4 text-slate-400">Pendamping Akademik</p>
        </div>
        <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
            <path d="M6 2.5v11" />
          </svg>
        </span>
      </div>

      <nav className="mt-8 space-y-1">
        <button
          type="button"
          onClick={() => onView("home")}
          className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-base ${
            view === "home" ? "bg-sky-100/80 font-semibold text-sky-600" : "font-medium text-slate-600"
          }`}
        >
          <img src={`${assets}/${homeIcon}`} alt="" />
          Beranda Jurnal
        </button>
        <button
          type="button"
          onClick={() => onView("collection")}
          className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-base ${
            view === "collection" ? "bg-sky-100/80 font-semibold text-sky-600" : "font-medium text-slate-600"
          }`}
        >
          <img src={`${assets}/${collectionIcon}`} alt="" />
          Koleksi
        </button>
        <button
          type="button"
          onClick={onBack}
          className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50"
        >
          <img src={`${assets}/f725b.png`} alt="" className="h-8 w-8 rounded-full object-cover outline outline-1 outline-slate-400/50" />
          Home Alerin
        </button>
      </nav>

      <p className="mt-6 px-4 font-['Inter:Bold'] text-sm font-bold uppercase leading-5 tracking-wide text-slate-400">Riwayat</p>
      <div className="mt-2 space-y-0.5">
        {riwayatSidebar.map((item, index) => (
          <button
            key={item}
            type="button"
            onClick={() => onView("riwayat")}
            className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs leading-4 ${
              index === 0 ? "bg-blue-50/70 font-semibold text-blue-900 outline outline-1 outline-blue-200/80" : "text-slate-600"
            }`}
          >
            <span className="truncate">{item}</span>
            {index === 0 && <span className="shrink-0 text-slate-400" aria-hidden="true">•••</span>}
          </button>
        ))}
      </div>

      <div className="mt-auto rounded-2xl border border-amber-100/80 bg-gradient-to-br from-amber-50/70 via-blue-50/50 to-indigo-50/60 p-4">
        <div className="flex items-start gap-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" className="mt-0.5 shrink-0" aria-hidden="true">
            <path d="M12 2l2.9 6.26L21.5 9.3l-4.75 4.63 1.12 6.57L12 17.4l-5.87 3.1 1.12-6.57L2.5 9.3l6.6-1.04L12 2z" />
          </svg>
          <p className="text-xs leading-4 text-slate-600">
            Akses lebih banyak fitur dengan <span className="text-blue-700">Alerin Premium</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onUpgrade}
          className="mt-3.5 w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-600 shadow-sm hover:bg-blue-50"
        >
          Upgrade Sekarang
        </button>
      </div>
    </aside>
  );
}

const metodeGroups = [
  { name: "Eksperimental", items: ["Uji acak terkontrol (RCT)", "Eksperimen nonacak", "Eksperimen laboratorium", "Eksperimen in vitro"] },
  {
    name: "Observasional",
    items: [
      "Studi lapangan",
      "Studi potong lintang",
      "Studi kohort",
      "Studi longitudinal/panel",
      "Studi kasus-kontrol",
      "Studi kasus",
      "Laporan kasus",
      "Studi wawancara",
      "Metode campuran",
    ],
  },
  { name: "Sintesis bukti", items: ["Tinjauan sistematis", "Meta-analisis", "Tinjauan literatur"] },
  { name: "Lainnya", items: ["Studi simulasi", "Artikel komentar", "Analisis historis"] },
];

const bidangStudi = ["Bisnis dan manajemen", "Ilmu sosial", "Pendidikan", "Kesehatan"];
const negaraPenelitian = ["Indonesia", "Asia Tenggara", "Semua negara"];
const pilihanTahun = ["Semua", "2 tahun terakhir", "5 tahun terakhir", "10 tahun terakhir"];

function FilterCheck({
  checked,
  label,
  onToggle,
  bold = false,
}: {
  checked: boolean;
  label: string;
  onToggle: () => void;
  bold?: boolean;
}) {
  return (
    <button type="button" onClick={onToggle} className="flex w-full items-center gap-2 py-0.5 text-left">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
          checked ? "border-sky-700 bg-sky-700" : "border-slate-300 bg-white"
        }`}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 6.5l2.5 2.5 4.5-5.5" />
          </svg>
        )}
      </span>
      <span className={`text-xs ${bold ? "font-semibold text-slate-800" : "text-slate-600"}`}>{label}</span>
    </button>
  );
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
  bordered = true,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  bordered?: boolean;
}) {
  return (
    <section className={`pb-5 ${bordered ? "border-b border-slate-200" : "pb-0"}`}>
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between py-4 text-left">
        <span className="text-sm font-bold text-slate-900">{title}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="#64748b"
          strokeWidth="1.6"
          strokeLinecap="round"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>
      {open && <div className="flex flex-col gap-3">{children}</div>}
    </section>
  );
}

function FilterPanel({ open, onClose, onApply, onReset }: { open: boolean; onClose: () => void; onApply: () => void; onReset: () => void }) {
  const [tahun, setTahun] = useState("2 tahun terakhir");
  const [tahunAwal, setTahunAwal] = useState("2024");
  const [tahunAkhir, setTahunAkhir] = useState("2026");
  const [aksesTerbuka, setAksesTerbuka] = useState(true);
  const [metode, setMetode] = useState<Record<string, string[]>>({ Eksperimental: [...metodeGroups[0].items] });
  const [bidang, setBidang] = useState<Record<string, boolean>>({ "Bisnis dan manajemen": true });
  const [negara, setNegara] = useState<Record<string, boolean>>({});
  const [sections, setSections] = useState<Record<string, boolean>>({ umum: true, metodologi: true, bidang: true, negara: true });

  const toggleSection = (key: string) => setSections(current => ({ ...current, [key]: !current[key] }));

  const toggleMetodeItem = (group: string, item: string) =>
    setMetode(current => {
      const selected = current[group] ?? [];
      return { ...current, [group]: selected.includes(item) ? selected.filter(value => value !== item) : [...selected, item] };
    });

  const groupChecked = (group: string) => (metode[group]?.length ?? 0) > 0;

  const handleReset = () => {
    setTahun("Semua");
    setAksesTerbuka(false);
    setMetode({});
    setBidang({});
    setNegara({});
  };

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[315] bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label="Filter jurnal"
        className={`fixed right-0 top-0 z-[320] flex h-dvh w-full max-w-[384px] flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold leading-7 text-slate-900">Filter jurnal</h2>
          <button
            type="button"
            aria-label="Tutup filter"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6">
          <FilterSection title="Umum" open={sections.umum} onToggle={() => toggleSection("umum")}>
            <div>
              <p className="text-xs font-medium leading-4 text-slate-600">Tahun terbit</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {pilihanTahun.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTahun(option)}
                    className={`rounded-lg px-2.5 py-1 text-xs ${
                      tahun === option ? "border border-sky-300 bg-sky-100 font-semibold text-sky-700" : "border border-slate-200 text-slate-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  value={tahunAwal}
                  onChange={event => setTahunAwal(event.target.value)}
                  inputMode="numeric"
                  aria-label="Tahun awal"
                  className="h-7 w-40 rounded-lg border border-slate-300 bg-white px-3 text-center text-xs text-slate-800 outline-none focus:border-sky-400"
                />
                <span className="h-px w-3.5 shrink-0 bg-slate-400" />
                <input
                  value={tahunAkhir}
                  onChange={event => setTahunAkhir(event.target.value)}
                  inputMode="numeric"
                  aria-label="Tahun akhir"
                  className="h-7 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-center text-xs text-slate-800 outline-none focus:border-sky-400"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-medium text-slate-700">Hanya akses terbuka</span>
              <button
                type="button"
                role="switch"
                aria-checked={aksesTerbuka}
                onClick={() => setAksesTerbuka(value => !value)}
                className={`flex h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors ${aksesTerbuka ? "bg-sky-700" : "bg-slate-300"}`}
              >
                <span className={`h-4 w-4 rounded-full border border-white bg-white shadow transition-transform ${aksesTerbuka ? "translate-x-4" : ""}`} />
              </button>
            </div>
          </FilterSection>

          <FilterSection title="Metodologi" open={sections.metodologi} onToggle={() => toggleSection("metodologi")}>
            <p className="text-xs leading-4 text-slate-500">Pilih jenis desain penelitian hingga tingkat yang lebih spesifik.</p>
            {metodeGroups.map(group => (
              <div key={group.name} className={`rounded-xl border border-slate-200 p-3 ${groupChecked(group.name) ? "bg-sky-50/50" : ""}`}>
                <div className="flex items-center justify-between gap-2">
                  <FilterCheck
                    bold
                    checked={(metode[group.name]?.length ?? 0) === group.items.length}
                    label={group.name}
                    onToggle={() =>
                      setMetode(current => ({
                        ...current,
                        [group.name]: (current[group.name]?.length ?? 0) === group.items.length ? [] : [...group.items],
                      }))
                    }
                  />
                  <span className="shrink-0 text-xs font-medium text-slate-400">{group.items.length} jenis</span>
                </div>
                <div className="flex flex-col gap-1.5 pl-6 pt-1">
                  {group.items.map(item => (
                    <FilterCheck
                      key={item}
                      checked={(metode[group.name] ?? []).includes(item)}
                      label={item}
                      onToggle={() => toggleMetodeItem(group.name, item)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </FilterSection>

          <FilterSection title="Bidang studi" open={sections.bidang} onToggle={() => toggleSection("bidang")}>
            <p className="text-xs leading-4 text-slate-500">23 bidang studi tersedia.</p>
            <div className="flex flex-col gap-2 pt-1">
              {bidangStudi.map(item => (
                <FilterCheck
                  key={item}
                  bold
                  checked={Boolean(bidang[item])}
                  label={item}
                  onToggle={() => setBidang(current => ({ ...current, [item]: !current[item] }))}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Negara penelitian" open={sections.negara} onToggle={() => toggleSection("negara")} bordered={false}>
            <p className="text-xs leading-4 text-slate-500">236 negara dan wilayah.</p>
            <div className="flex flex-col gap-2 pt-1">
              {negaraPenelitian.map(item => (
                <FilterCheck
                  key={item}
                  bold
                  checked={Boolean(negara[item])}
                  label={item}
                  onToggle={() => setNegara(current => ({ ...current, [item]: !current[item] }))}
                />
              ))}
            </div>
          </FilterSection>
        </div>

        <footer className="flex shrink-0 items-center gap-3 border-t border-slate-200 bg-white p-4">
          <button
            type="button"
            onClick={() => {
              onApply();
              onClose();
            }}
            className="min-w-0 flex-1 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm sm:flex-none sm:w-60"
          >
            Terapkan filter
          </button>
          <button
            type="button"
            onClick={() => {
              handleReset();
              onReset();
            }}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700"
          >
            Atur ulang
          </button>
        </footer>
      </aside>
    </>
  );
}

const premiumFeatures = [
  {
    title: "Sintesis Literatur & Matriks",
    desc: "Ekspor otomatis ke Word & Excel matriks telaah",
    gratis: "—",
    plus: "check",
    pro: "check",
  },
  {
    title: "Akses Basis Data Bereputasi",
    desc: "Scopus, SINTA 1-6, Crossref & OpenAlex",
    gratis: "10/hari",
    plus: "Unlimited",
    pro: "Unlimited + API",
  },
  {
    title: "Deteksi Klaim & Validasi Sitasi",
    desc: "Cek akurasi argumen naskah & anti halusinasi AI",
    gratis: "—",
    plus: "check",
    pro: "check",
  },
  {
    title: "Peta Riset Bibliometrik (Research Gap)",
    desc: "Visualisasi klaster topik & kebaruan studi",
    gratis: "—",
    plus: "check",
    pro: "check",
  },
  {
    title: "Kuota Analisis Naskah & PDF",
    desc: "Kapasitas pembacaan dokumen bab riset",
    gratis: "1 Jurnal/sesi",
    plus: "Hingga 30 Jurnal",
    pro: "Hingga 80 Jurnal",
  },
];

const premiumFeatureIcons: ReactNode[] = [
  <svg key="sintesis" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>,
  <svg key="database" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
    <rect x="3.5" y="2" width="9" height="12" rx="1.5" />
    <path d="M6 5.5h4M6 8h4M6 10.5h3" />
  </svg>,
  <svg key="deteksi" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 1.5l5 2v4.2c0 3-2.1 5.3-5 6.3-2.9-1-5-3.3-5-6.3V3.5l5-2z" />
    <path d="M5.8 8l1.6 1.6 2.8-3" />
  </svg>,
  <svg key="peta" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
    <path d="M3 13V7M8 13V3M13 13V9" />
  </svg>,
  <svg key="kuota" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 1.5h5l3 3v10H4z" />
    <path d="M9 1.5v3h3" />
    <path d="M6.5 9.5l1.5 1.5 2.5-2.5" />
  </svg>,
];

function UpgradePremiumCell({ value }: { value: string }) {
  if (value === "—") {
    return <span className="text-xs font-semibold text-slate-400">—</span>;
  }
  if (value === "check") {
    return (
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100">
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M1 4l2.5 2.5L9 1" />
        </svg>
      </span>
    );
  }
  const tone: Record<string, string> = {
    "10/hari": "text-[8.71px] font-medium text-slate-400",
    Unlimited: "rounded-[3px] bg-indigo-50/70 px-2 py-[3px] text-[8.71px] font-bold text-zinc-800",
    "Unlimited + API": "text-[8.71px] font-bold text-slate-700",
    "1 Jurnal/sesi": "text-[8.71px] font-medium text-slate-500",
    "Hingga 30 Jurnal": "text-[8.71px] font-bold text-zinc-800",
    "Hingga 80 Jurnal": "text-[8.71px] font-bold text-sky-700",
  };
  return <span className={tone[value] ?? "text-[8.71px] font-bold text-slate-700"}>{value}</span>;
}

function UpgradePremiumModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-[330] hidden items-center justify-center p-4 transition-opacity duration-200 md:flex ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      aria-hidden={!open}
    >
      <div onClick={onClose} className="absolute inset-0 bg-black/20" aria-hidden="true" />
      <div
        role="dialog"
        aria-label="Upgrade ke Alerin Premium"
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-[608px] flex-col overflow-hidden rounded-[19px] bg-white shadow-[0px_19.79px_39.58px_-9.5px_rgba(0,0,0,0.25)] outline outline-[0.79px] outline-offset-[-0.79px] outline-slate-100"
      >
        <div className="relative shrink-0 px-8 pb-3 pt-6 text-center">
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
          <h2 className="text-2xl font-extrabold leading-7 text-slate-900">Upgrade ke Alerin Premium!</h2>
          <p className="mx-auto mt-1.5 max-w-96 text-xs font-medium leading-4 text-zinc-800">
            Akselerasi riset, telaah literatur, dan skripsimu lebih cepat &amp; tuntas dengan asisten bertenaga AI.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-5">
          <div className="grid grid-cols-3 items-start gap-2">
            <div className="mt-[3px] rounded-xl bg-white p-4 text-center outline outline-[0.79px] outline-offset-[-0.79px] outline-slate-200">
              <p className="text-xs font-semibold leading-4 text-slate-600">Gratis</p>
              <p className="mt-1.5 text-lg font-extrabold leading-6 text-slate-900">Rp 0</p>
              <p className="text-[9.5px] font-medium leading-3 text-slate-400">Akses dasar</p>
            </div>
            <div className="relative rounded-xl bg-gradient-to-b from-cyan-50 to-blue-200/70 p-4 text-center outline outline-[1.58px] outline-offset-[-1.58px] outline-blue-500/90">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-red-500 px-2.5 py-[2px] text-[8.71px] font-bold uppercase leading-3 tracking-tight text-white shadow-sm">
                Populer
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="#f59e0b"
                className="absolute right-2.5 top-2.5 opacity-80"
                aria-hidden="true"
              >
                <path d="M12 2l2.9 6.26L21.5 9.3l-4.75 4.63 1.12 6.57L12 17.4l-5.87 3.1 1.12-6.57L2.5 9.3l6.6-1.04L12 2z" />
              </svg>
              <p className="text-xs font-bold leading-4 text-sky-900">Paket Plus</p>
              <p className="mt-1.5 text-lg font-extrabold leading-6 text-slate-900">Rp 49.000</p>
              <p className="text-[9.5px] font-semibold leading-3 text-sky-900">per bulan</p>
            </div>
            <div className="mt-[3px] rounded-xl bg-white p-4 text-center outline outline-[0.79px] outline-offset-[-0.79px] outline-slate-200">
              <p className="text-xs font-semibold leading-4 text-slate-600">Paket Pro</p>
              <p className="mt-1.5 text-lg font-extrabold leading-6 text-slate-900">Rp 99.000</p>
              <p className="text-[9.5px] font-medium leading-3 text-slate-400">per bulan</p>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3">
            <div className="flex items-end gap-2 border-b border-slate-100 pb-2">
              <p className="min-w-0 flex-1 pl-1 text-xs font-bold leading-3 tracking-wide text-zinc-800">Manfaat &amp; Fitur Riset</p>
              <span className="w-20 shrink-0 text-center text-[9.5px] font-semibold leading-3 tracking-wide text-slate-500 sm:w-24">Gratis</span>
              <span className="w-20 shrink-0 text-center sm:w-24">
                <span className="inline-block rounded-sm bg-indigo-50/80 px-2 py-[2px] text-[9.5px] font-bold leading-3 tracking-wide text-blue-950">Plus</span>
              </span>
              <span className="w-20 shrink-0 text-center text-[9.5px] font-semibold leading-3 tracking-wide text-slate-700 sm:w-24">Pro</span>
            </div>
            {premiumFeatures.map((feature, index) => (
              <div key={feature.title} className={`flex items-center gap-2 py-2.5 ${index > 0 ? "border-t border-slate-100" : ""}`}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-neutral-700" aria-hidden="true">
                  {premiumFeatureIcons[index]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold leading-4 text-slate-900">{feature.title}</p>
                  <p className="text-[9px] font-medium leading-3 text-neutral-700">{feature.desc}</p>
                </div>
                <span className="flex w-20 shrink-0 items-center justify-center sm:w-24">
                  <UpgradePremiumCell value={feature.gratis} />
                </span>
                <span className="flex w-20 shrink-0 items-center justify-center sm:w-24">
                  <UpgradePremiumCell value={feature.plus} />
                </span>
                <span className="flex w-20 shrink-0 items-center justify-center sm:w-24">
                  <UpgradePremiumCell value={feature.pro} />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 justify-center border-t border-slate-100 bg-slate-50 px-8 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-5 py-3 text-xs font-bold leading-5 text-white shadow-sm hover:bg-sky-700 sm:w-96"
          >
            Pilih Paket Plus Sekarang (Rp 49.000)
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 6h8M7 3l3 3-3 3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const mobilePremiumFeatures = [
  { title: "Sintesis Literatur AI", desc: "Ringkas ratusan jurnal instan" },
  { title: "Akses SINTA & Scopus", desc: "Index Q1-Q4 & SINTA 1-6" },
  { title: "Cek Sitasi & Referensi", desc: "Format APA, IEEE, Harvard" },
  { title: "Peta Bibliometrik", desc: "Visualisasi novelty & gap riset" },
];

const mobilePremiumFeatureIcons: ReactNode[] = [
  <svg key="m-sintesis" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 3.5c2-.8 3.5-.8 5.5 0v9c-2-.8-3.5-.8-5.5 0v-9zM13.5 3.5c-2-.8-3.5-.8-5.5 0v9c2-.8 3.5-.8 5.5 0v-9z" />
  </svg>,
  <svg key="m-sinta" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
    <path d="M5.5 6.5h5M5.5 9.5h3" />
  </svg>,
  <svg key="m-sitasi" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 1.5h5l3 3v10H4z" />
    <path d="M9 1.5v3h3M6.5 9.5l1.5 1.5 2.5-2.5" />
  </svg>,
  <svg key="m-peta" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 11.5l3.5-4 2.5 2 4.5-5" />
    <path d="M10.5 4.5h2.5v2.5" />
  </svg>,
];

function UpgradePremiumSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div className={`fixed inset-0 z-[330] md:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-label="Upgrade ke Alerin Premium"
        className={`absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[32px] border-t border-white/80 bg-stone-50 shadow-[0px_31px_70px_-16px_rgba(15,23,42,0.25)] transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="relative flex shrink-0 flex-col items-center gap-1 px-6 pb-4 pt-4">
          <span className="h-1.5 w-14 rounded-full bg-slate-300" aria-hidden="true" />
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
          <h2 className="pt-1 text-center text-[20px] font-bold leading-7 text-slate-900">Upgrade ke Alerin Premium!</h2>
          <p className="text-center text-[13px] leading-5 text-slate-500">Akselerasi riset &amp; skripsimu lebih mudah &amp; cepat.</p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
          <div className="grid grid-cols-3 items-start gap-2 pt-2">
            <div className="mt-1.5 rounded-2xl bg-white p-3 text-center shadow-[0px_1.5px_3px_rgba(0,0,0,0.05)] outline outline-[1.5px] outline-offset-[-1.5px] outline-slate-200/90">
              <p className="text-[13px] font-bold leading-5 text-slate-600">Gratis</p>
              <p className="mt-0.5 text-lg font-extrabold leading-6 text-slate-900">Rp 0</p>
              <p className="text-[11px] leading-4 text-slate-400">selamanya</p>
            </div>
            <div className="relative rounded-2xl bg-amber-50/80 p-3 pt-3.5 text-center shadow-[0px_3px_6px_-3px_rgba(0,0,0,0.1),0px_6px_9px_-2px_rgba(0,0,0,0.1)] outline outline-2 outline-offset-[-2px] outline-amber-300">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-red-500 px-2.5 py-[2px] text-[9px] font-bold uppercase leading-3.5 tracking-tight text-white shadow-sm">
                Popular
              </span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b" className="absolute right-2 top-2 opacity-30" aria-hidden="true">
                <path d="M12 2l2.9 6.26L21.5 9.3l-4.75 4.63 1.12 6.57L12 17.4l-5.87 3.1 1.12-6.57L2.5 9.3l6.6-1.04L12 2z" />
              </svg>
              <p className="text-[13px] font-bold leading-5 text-amber-900">Plus</p>
              <p className="mt-0.5 text-xl font-extrabold leading-7 text-amber-950">Rp 49rb</p>
              <p className="text-[11px] leading-4 text-amber-800/80">per bulan</p>
            </div>
            <div className="mt-1.5 rounded-2xl bg-white p-3 text-center shadow-[0px_1.5px_3px_rgba(0,0,0,0.05)] outline outline-[1.5px] outline-offset-[-1.5px] outline-slate-200/90">
              <p className="text-[13px] font-bold leading-5 text-slate-600">Pro</p>
              <p className="mt-0.5 text-lg font-extrabold leading-6 text-slate-900">Rp 99rb</p>
              <p className="text-[11px] leading-4 text-slate-400">per bulan</p>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex items-end gap-1.5 border-b-2 border-slate-200 px-1.5 pb-2">
              <p className="min-w-0 flex-1 text-[13px] font-bold uppercase leading-5 tracking-wide text-slate-600">Manfaat</p>
              <span className="w-10 shrink-0 text-center text-[13px] font-bold leading-5 text-slate-500">Gratis</span>
              <span className="w-10 shrink-0 text-center text-[13px] font-bold leading-5 text-sky-700">Plus</span>
            </div>
            {mobilePremiumFeatures.map((feature, index) => (
              <div key={feature.title} className={`px-1.5 py-3 ${index > 0 ? "border-t-2 border-slate-100" : ""}`}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex shrink-0 items-center justify-center rounded-[10px] bg-neutral-700 p-1.5" aria-hidden="true">
                    {mobilePremiumFeatureIcons[index]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold leading-5 text-slate-800">{feature.title}</p>
                    <p className="text-[12px] leading-4 text-slate-400">{feature.desc}</p>
                  </div>
                  <span className="flex w-10 shrink-0 items-center justify-center pt-1.5">
                    <span className="h-0.5 w-5 bg-slate-300" aria-hidden="true" />
                  </span>
                  <span className="flex w-10 shrink-0 items-center justify-center pt-1">
                    <svg width="16" height="13" viewBox="0 0 16 13" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M1.5 7l4.5 4.5L14.5 1.5" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-100 bg-white px-5 pb-6 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-4 text-[15px] font-bold tracking-wide text-white shadow-sm hover:bg-sky-700"
          >
            Pilih Paket Plus (Rp 49.000)
            <svg width="15" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 6h8M7 3l3 3-3 3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function JournalCard({ index }: { index: number }) {
  return (
    <article className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-semibold text-[#0066a1]">Scopus Q1</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600">2023</span>
        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] text-[#0066a1]">Akses terbuka legal</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600">97% relevan</span>
      </div>
      <h3 className="mt-4 font-['Plus_Jakarta_Sans:Bold'] text-base font-bold leading-[22px] text-[#0f172a]">{journals[index].title}</h3>
      <p className="mt-1 font-['Inter:Regular'] text-xs text-[#94a3b8]">{journals[index].authors}</p>
      <p className="mt-4 font-['Inter:Regular'] text-xs leading-5 text-[#64748b]">{journals[index].description}</p>
      {index === 0 && (
        <>
          <div className="mt-4 rounded-xl bg-[#eaf6ff] px-4 py-3 text-xs text-[#475569]">
            <strong className="font-['Inter:Bold'] text-[#0066a1]">Alasan direkomendasikan:</strong> Cocok untuk memperkuat landasan teori dan hubungan antarvariabel.
          </div>
          <div className="mt-4 min-h-24 rounded-xl border border-slate-200 bg-[#f1f5f9] p-4">
            <p className="font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold text-[#1e293b]">Catatan Pribadi</p>
            <p className="mt-2 text-xs text-[#94a3b8]">Kamu bisa menuliskan catatan pribadi di sini......</p>
          </div>
        </>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
        <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs">Lihat detail</button>
        <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs">Abstrak</button>
        <button type="button" className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs">
          <img src={`${collectionAssets}/9b4e4.svg`} alt="" /> Buat sitasi
        </button>
        <button type="button" className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs">
          <img src={`${collectionAssets}/edcfd.svg`} alt="" /> Buka DOI
        </button>
        <button type="button" className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs">
          Skripsi <img src={`${collectionAssets}/b80d5.svg`} alt="" />
        </button>
        {index === 0 && <button type="button" className="ml-auto rounded-lg bg-[#bd3434] px-4 py-2 text-xs font-semibold text-white">Hapus dari koleksi</button>}
      </div>
    </article>
  );
}

export default function CariJurnalFigmaPanel({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<JournalView>("home");
  const [query, setQuery] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [hasResults, setHasResults] = useState(false);
  const [fileName, setFileName] = useState("");
  const [mobileSearchStage, setMobileSearchStage] = useState<"home" | "loading" | "results">("home");
  const [searchType, setSearchType] = useState("");
  const [resultMode, setResultMode] = useState<"search" | "analysis">("search");
  const [temuanIndex, setTemuanIndex] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    if (mobileSearchStage !== "loading") return;
    const timer = window.setTimeout(() => setMobileSearchStage("results"), 2400);
    return () => window.clearTimeout(timer);
  }, [mobileSearchStage]);

  const runSearch = () => {
    if (query.trim() || paragraph.trim() || fileName) setHasResults(true);
  };

  const canSearch = query.trim().length >= 5;

  return (
    <div className="fixed inset-0 z-[300] flex h-dvh w-full overflow-hidden bg-[#f4f7fb] font-['Inter:Regular'] text-[#0f172a] md:bg-[#f3f6f9]">
      <Sidebar view={view} onView={setView} onBack={onBack} onUpgrade={() => setUpgradeOpen(true)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-[65px] shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] backdrop-blur-md md:hidden">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center">
              <img src={`${mobileAssets}/90eed.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="truncate font-['Plus_Jakarta_Sans:Bold'] text-base font-bold leading-5">Alerin Jurnal</p>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#1e264b] px-1.5 py-0.5 font-['Inter:Bold'] text-[7px] font-bold text-white">
                  Plus
                  <span className="relative h-2.5 w-2.5 overflow-hidden">
                    <img src={`${mobileAssets}/8923b.png`} alt="" className="absolute -left-1.5 -top-0.5 h-8 max-w-none" />
                  </span>
                </span>
              </div>
              <p className="font-['Plus_Jakarta_Sans:Medium'] text-[11px] leading-3 text-[#64748b]">Pendamping Akademik</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-xl">
              <img src={`${mobileAssets}/1a16f.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" />
              <span className="absolute right-1.5 top-1 h-2 w-2 rounded-full border border-white bg-red-500" />
            </button>
            <img src={`${mobileAssets}/48c68.png`} alt="Profil" className="h-[38px] w-[38px] rounded-full object-cover" />
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-28 pt-7 md:p-7">
          {mobileSearchStage === "loading" && (
            <div className="fixed inset-x-0 bottom-[68px] top-[65px] z-[305] flex flex-col items-center justify-center bg-[#f4f7fb] px-6 md:hidden">
              <img
                src="/assets/jurnal-design/search-flow/5e7e4.svg"
                alt=""
                className="w-[290px] max-w-[82vw] animate-[bounce_1.4s_ease-in-out_infinite]"
              />
              <h1 className="mt-5 text-center font-['Plus_Jakarta_Sans:ExtraBold'] text-[21px] font-extrabold tracking-[-0.5px] text-[#313131]">
                {resultMode === "analysis" ? "Menganalisis Naskahmu" : "Menulusuri Jurnal Untukmu"}
              </h1>
              <p className="mt-2 max-w-[290px] animate-pulse text-center text-xs leading-5 text-[#71717a]">
                {resultMode === "analysis"
                  ? "Alerin sedang membaca dokumenmu dan menyiapkan temuan serta rekomendasi sitasi."
                  : "Alerin sedang mencari jurnal berdasarkan informasi yang kamu berikan."}
              </p>
            </div>
          )}

          {mobileSearchStage === "results" && (
            <div className="fixed inset-x-0 bottom-[68px] top-[65px] z-[305] overflow-y-auto bg-[#f4f7fb] px-4 pb-6 pt-4 md:hidden">
              <div className="mx-auto max-w-md">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Kembali ke pencarian"
                    onClick={() => {
                      setMobileSearchStage("home");
                      setSearchType("");
                    }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm"
                  >
                    <img src="/assets/jurnal-design/search-flow/19ff4.svg" alt="" />
                  </button>
                  <h1 className="font-['Plus_Jakarta_Sans:Bold'] text-base font-bold tracking-[-0.4px]">Rekomendasi yang paling relevan</h1>
                </div>

                {resultMode === "analysis" && (
                  <>
                    <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006194" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <path d="M14 2v6h6" />
                              <path d="M16 13H8" />
                              <path d="M16 17H8" />
                            </svg>
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-['Plus_Jakarta_Sans:SemiBold'] text-sm font-semibold">{fileName || "Skripsi_Nadia_Final.docx"}</p>
                            <p className="mt-0.5 text-[11px] text-[#94a3b8]">42 halaman · 126 sitasi diperiksa</p>
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">Selesai</span>
                      </div>
                      <div className="mt-3 grid grid-cols-4 rounded-xl bg-[#f1f4fa] py-3 text-center">
                        {[
                          ["7", "Temuan", "text-[#006194]", ""],
                          ["3", "Bermasalah", "text-[#e7000b]", "bg-red-50"],
                          ["2", "Kurang Kuat", "text-[#006194]", ""],
                          ["2", "Ref. Lemah", "text-[#006194]", ""],
                        ].map(([value, label, color, bg]) => (
                          <div key={label} className={`mx-1 rounded-lg ${bg}`}>
                            <p className={`font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold ${color}`}>{value}</p>
                            <p className="mt-0.5 text-[9px] font-medium text-[#64748b]">{label}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold">Temuan {temuanIndex} dari 7</h2>
                          <span className="shrink-0 rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-[#0369a1]">Halaman {temuanAnalisis[temuanIndex - 1].halaman}</span>
                        </div>
                        <div className="flex shrink-0 gap-1.5">
                          <button
                            type="button"
                            aria-label="Temuan sebelumnya"
                            onClick={() => setTemuanIndex(index => Math.max(1, index - 1))}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-sm text-[#64748b]"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            aria-label="Temuan berikutnya"
                            onClick={() => setTemuanIndex(index => Math.min(7, index + 1))}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-sm text-[#64748b]"
                          >
                            ›
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 rounded-xl bg-red-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#e7000b]">⚠ {temuanAnalisis[temuanIndex - 1].badge}</p>
                        <p className="mt-2.5 text-[11px] font-semibold text-[#475569]">Bagian yang perlu diperbaiki:</p>
                        <blockquote className="mt-1.5 rounded-lg bg-white p-2.5 font-['Inter:Italic'] text-[11px] italic leading-4 text-[#334155]">
                          {temuanAnalisis[temuanIndex - 1].kutipan}
                        </blockquote>
                        <p className="mt-3 text-[11px] font-bold text-[#e7000b]">Mengapa sitasi ini bermasalah?</p>
                        <ul className="mt-1.5 space-y-1.5 text-[11px] leading-4 text-[#475569]">
                          {temuanAnalisis[temuanIndex - 1].alasan.map(alasan => (
                            <li key={alasan} className="flex gap-1.5">
                              <span className="text-[#e7000b]">•</span>
                              <span>{alasan}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-2.5 text-[10px] font-medium leading-4 text-[#0369a1]">✔ DOI valid · Metadata cocok · Isi sitasi tidak mendukung klaim</p>
                      </div>

                      <div className="mt-3 rounded-xl bg-sky-50 p-3">
                        <p className="text-[11px] font-bold text-[#0369a1]">✦ Saran perbaikan Alerin:</p>
                        <blockquote className="mt-1.5 rounded-lg bg-white p-2.5 font-['Inter:Italic'] text-[11px] italic leading-4 text-[#334155]">
                          {temuanAnalisis[temuanIndex - 1].saran}
                        </blockquote>
                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-[#64748b]">OpenAlex + 4 verifikasi</span>
                          <button
                            type="button"
                            onClick={() => window.alert("Saran perbaikan Alerin diterapkan ke naskahmu.")}
                            className="shrink-0 rounded-lg bg-[#006194] px-3 py-1.5 text-[11px] font-semibold text-white"
                          >
                            Terapkan ke naskah
                          </button>
                        </div>
                      </div>
                    </section>
                  </>
                )}

                <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                  <h2 className="flex items-center gap-2 font-['Plus_Jakarta_Sans:Bold'] text-base font-bold">
                    <img src="/assets/jurnal-design/search-flow/ef610.svg" alt="" className="h-5 w-5" />
                    Ringkasan hasil pencarian
                  </h2>
                  <p className="mt-3 text-xs leading-5 text-[#373737]">Alerin menyeleksi hasil secara bertahap sebelum menampilkan jurnal terbaik.</p>
                  <div className="mt-3 space-y-2 text-[11px] font-medium">
                    <p className="flex items-center gap-2"><img src="/assets/jurnal-design/search-flow/d6638.svg" alt="" className="h-4 w-4" />Kata kunci: {query.trim() || "live streaming commerce"}</p>
                    <p className="flex items-center gap-2"><img src="/assets/jurnal-design/search-flow/d6dd5.svg" alt="" className="h-4 w-4" />Tahun: 2024–2026</p>
                  </div>
                  <div className="mt-4 grid grid-cols-3 rounded-xl bg-[#f1f4fa] px-2 py-3 text-center">
                    {[["4,2 jt", "jurnal tersedia"], ["50", "sangat relevan"], ["20", "sangat teratas"]].map(([value, label]) => (
                      <div key={value}>
                        <p className="font-['Plus_Jakarta_Sans:Bold'] text-xl font-bold text-[#006194]">{value}</p>
                        <p className="mt-0.5 text-[9px] font-semibold text-[#64748b]">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => window.alert("Tabel penelitian ditampilkan.")} className="rounded-xl bg-[#006194] px-3 py-2.5 text-xs font-semibold text-white">Tabel penelitian</button>
                    <button type="button" onClick={() => window.alert("Peta penelitian ditampilkan.")} className="rounded-xl bg-[#0f172a] px-3 py-2.5 text-xs font-semibold text-white">Peta Penelitian</button>
                  </div>
                </section>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Daftar rekomendasi</p>
                  <p className="text-[11px] font-medium text-[#64748b]">3 dari 20 telaah</p>
                </div>

                <div className="mt-2 space-y-3">
                  {[
                    {
                      rank: "Paling Relevan #1",
                      score: 97,
                      title: "Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges",
                      citation: "2023 • 120 sitasi • Asia Pacific Journal of Marketing and Logistics • DOI terverifikasi",
                      summary: "Interaksi parasosial antara host dan penonton ditambah dorongan kelangkaan seperti batas waktu dan stok meningkatkan niat beli di live streaming commerce.",
                    },
                    {
                      rank: "Rekomendasi #2",
                      score: 89,
                      title: "Pengaruh Interaksi Parasosial dan Dorongan Kelangkaan terhadap Niat Beli di Live Streaming Commerce",
                      citation: "2023 • 120 sitasi • Asia Pacific Journal of Marketing and Logistics • DOI terverifikasi",
                      summary: "Studi ini memperkuat hubungan antara interaksi parasosial, dorongan kelangkaan, dan perilaku pembelian digital.",
                    },
                  ].map((result, index) => (
                    <article key={result.rank} className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-[9px] font-medium text-slate-400">OpenAlex &amp; Crossref Scopus</p>
                      <div className="mt-1.5 flex items-start justify-between gap-3">
                        <div className="flex flex-wrap gap-1 text-[9px] font-semibold">
                          <span className="rounded-md bg-sky-100 px-2 py-1 text-[#0369a1]">Scopus Q1</span>
                          <span className="rounded-md bg-slate-200 px-2 py-1 text-slate-700">Artikel</span>
                          <span className="rounded-md bg-slate-200 px-2 py-1 text-slate-700">2023</span>
                        </div>
                        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full bg-sky-50 shadow-inner">
                          <strong className="font-['Plus_Jakarta_Sans:ExtraBold'] text-xl text-[#006194]">{result.score}%</strong>
                          <span className="text-[7px] font-semibold uppercase text-slate-500">relevansi</span>
                        </div>
                      </div>
                      <p className="mt-2 text-[11px] font-semibold text-[#0369a1]">{result.rank}</p>
                      <h2 className="mt-1 font-['Plus_Jakarta_Sans:Bold'] text-base font-bold leading-5">{result.title}</h2>
                      <p className="mt-2 text-[10px] leading-4 text-slate-600">Wongkitrungrueng, A. &amp; Assarut, N.</p>
                      <p className="mt-1 text-[10px] leading-4 text-slate-600">{result.citation}</p>

                      <div className="mt-3 rounded-xl bg-[#f1f4fa] p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide">Mengapa jurnal ini direkomendasikan?</p>
                        {[["Kesesuaian variabel", index ? 98 : 99], ["Kesesuaian topik", 96], ["Kesesuaian wilayah", index ? 80 : 93]].map(([label, value]) => (
                          <div key={String(label)} className="mt-2">
                            <div className="flex justify-between text-[10px]"><span>{label}</span><strong className="text-[#006194]">{value}%</strong></div>
                            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-300"><div className="h-full rounded-full bg-[#006194]" style={{ width: `${value}%` }} /></div>
                          </div>
                        ))}
                        <p className="mt-3 text-[10px] leading-4 text-slate-600">Cocok untuk landasan teori, penyusunan hipotesis, dan pengembangan penelitian.</p>
                      </div>

                      <div className="mt-3 rounded-xl bg-amber-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#b45309]">Kutipan relevan</p>
                        <p className="mt-1.5 text-[11px] italic leading-4 text-[#475569]">
                          "Parasocial interaction strengthens purchase intention when viewers perceive urgency and scarcity."
                        </p>
                      </div>

                      <div className="mt-3 rounded-xl bg-[#f1f4fa] p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide">Kredibilitas &amp; akses</p>
                        {[
                          ["Scopus Q1 terverifikasi", "Status indeks dicek dari sumber resmi"],
                          ["DOI & metadata cocok", "Judul, penulis, tahun, dan penerbit konsisten"],
                          ["PDF dapat diakses legal", "Versi akses terbuka tersedia dari penerbit"],
                          ["Tidak ada peringatan integritas", "Tidak ditemukan retraksi atau koreksi kritis"],
                        ].map(([judul, detail]) => (
                          <div key={judul} className="mt-2 flex items-start gap-2">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[9px] font-bold text-emerald-600">✓</span>
                            <span className="min-w-0">
                              <span className="block text-[11px] font-semibold text-[#1e293b]">{judul}</span>
                              <span className="block text-[10px] leading-4 text-[#94a3b8]">{detail}</span>
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 rounded-xl bg-sky-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#006194]">Ringkasan utama</p>
                        <p className="mt-2 text-[11px] leading-[17px]">{result.summary}</p>
                        <div className="mt-2 flex flex-wrap gap-1 text-[9px]">
                          <span className="rounded-md bg-white px-2 py-1">2 kutipan pendukung</span>
                          <span className="rounded-md bg-white px-2 py-1">Metode SEM-PLS</span>
                          <span className="rounded-md bg-white px-2 py-1">Studi cross-sectional</span>
                          <span className="rounded-md bg-white px-2 py-1">Ringkasan Bahasa Indonesia</span>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-semibold">
                        <button type="button" onClick={() => window.alert("Analisis jurnal dibuka.")} className="rounded-xl bg-[#006194] px-2 py-2 text-white">Analisis</button>
                        <button type="button" onClick={() => window.alert("Jurnal disimpan ke koleksi.")} className="rounded-xl bg-[#f1f4fa] px-2 py-2">Simpan</button>
                        <button type="button" onClick={() => window.alert("Sitasi berhasil dibuat.")} className="rounded-xl bg-[#f1f4fa] px-2 py-2">Sitasi</button>
                        <button type="button" onClick={() => window.alert("Abstrak jurnal dibuka.")} className="rounded-xl bg-[#f1f4fa] px-2 py-2">Abstrak</button>
                        <button type="button" onClick={() => window.open("https://doi.org/10.1016/j.jretconser.2020.102345", "_blank", "noopener,noreferrer")} className="rounded-xl bg-[#f1f4fa] px-2 py-2">DOI</button>
                        <button type="button" onClick={() => window.alert("PDF dibuka.")} className="rounded-xl bg-[#f1f4fa] px-2 py-2 text-[#006194]">Buka PDF</button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === "home" ? (
            <div className="mx-auto grid max-w-[1160px] gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <h1 className="text-center font-['Plus_Jakarta_Sans:ExtraBold'] text-2xl font-extrabold leading-[33px] tracking-[-0.6px] text-[#0f172a] md:text-left md:text-[30px] md:leading-10 md:tracking-normal md:text-[#172554]">
                  Temukan jurnal yang tepat <br className="md:hidden" />untuk tulisanmu
                </h1>
                <p className="mt-2 text-center font-['Plus_Jakarta_Sans:Regular'] text-xs leading-[19.5px] text-[#232323] md:text-left md:text-base md:leading-6 md:text-[#475569]">Cari dengan kata kunci atau biarkan Alerin memahami paragraf dan dokumenmu.</p>

                <section className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:mt-7 md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-[17px] font-bold md:text-base">Pencarian cepat</h2>
                    <button type="button" onClick={() => setFilterOpen(true)} aria-expanded={filterOpen} className="flex items-center gap-2 font-['Plus_Jakarta_Sans:SemiBold'] text-xs font-semibold text-[#334155] md:text-sm md:hidden">
                      <span className="relative h-[19.689px] w-[17.143px] shrink-0 overflow-hidden">
                        <img src="/assets/jurnal-design/quick-search/8e43d.svg" alt="" className="absolute left-[-19.689px] top-[-18.447px] max-w-none origin-top-left scale-[0.6667]" />
                      </span>
                      Filter
                      {filterApplied ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-100">
                          <svg width="14" height="11" viewBox="0 0 14 11" fill="none" stroke="#0070ba" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M1.5 5.8l3.8 3.8L12.5 1.5" />
                          </svg>
                        </span>
                      ) : (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-[#0070ba]">10</span>
                      )}
                    </button>
                  </div>

                  <div className="mt-4 flex min-w-0 items-stretch gap-3">
                    <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 md:bg-white md:px-4">
                        <img src="/assets/jurnal-design/quick-search/f5f78.svg" alt="" className="max-w-none origin-center scale-[0.6667]" />
                        <input
                          value={query}
                          onChange={event => setQuery(event.target.value)}
                          onKeyDown={event => {
                            if (event.key !== "Enter") return;
                            if (query.trim().length < 5) return;
                            if (window.matchMedia("(min-width: 768px)").matches) runSearch();
                            else {
                              setResultMode("search");
                              setMobileSearchStage("loading");
                            }
                          }}
                          placeholder="Ketik topik, judul, penulis, variabel, atau DOI"
                          className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-slate-400 md:text-sm"
                        />
                    </label>
                    <button
                      type="button"
                      onClick={() => setFilterOpen(true)}
                      aria-expanded={filterOpen}
                      className="hidden shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 md:flex"
                    >
                      <span className="relative h-[19.689px] w-[17.143px] shrink-0 overflow-hidden">
                        <img src="/assets/jurnal-design/quick-search/8e43d.svg" alt="" className="absolute left-[-19.689px] top-[-18.447px] max-w-none origin-top-left scale-[0.6667]" />
                      </span>
                      Filter
                      {filterApplied && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-100">
                          <svg width="14" height="11" viewBox="0 0 14 11" fill="none" stroke="#0070ba" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M1.5 5.8l3.8 3.8L12.5 1.5" />
                          </svg>
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="mt-4 hidden flex-wrap gap-4 md:flex">
                    {[
                      ["journal", "Cari jurnal"],
                      ["review", "Literatur Review"],
                      ["map", "Peta Penelitian"],
                    ].map(([type, label]) => (
                      <button
                        key={type}
                        type="button"
                        disabled={!canSearch}
                        onClick={() => {
                          setSearchType(type);
                          runSearch();
                        }}
                        className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors ${
                          !canSearch ? "cursor-not-allowed bg-slate-200 text-slate-400" : searchType === type ? "bg-[#00629b]" : "bg-sky-700"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-[minmax(0,1fr)_52px] gap-2 md:hidden">
                    <button
                      type="button"
                      disabled={!canSearch}
                      onClick={() => {
                        if (!searchType) setSearchType("journal");
                        if (window.matchMedia("(min-width: 768px)").matches) runSearch();
                        else {
                          setResultMode("search");
                          setMobileSearchStage("loading");
                        }
                      }}
                      className={`rounded-xl px-4 py-3 text-center font-['Plus_Jakarta_Sans:SemiBold'] text-sm font-semibold text-white transition-colors md:bg-[#0070ba] ${
                        !canSearch ? "cursor-not-allowed bg-slate-200 text-slate-400" : "bg-[#00629b]"
                      }`}
                    >
                      {searchType === "review" ? "Literatur Review" : searchType === "map" ? "Peta Penelitian" : "Cari jurnal"}
                    </button>
                    <label className="relative flex min-h-12 items-center justify-center rounded-lg border border-black/15 bg-white shadow-[0_4px_4px_rgba(0,0,0,0.1)]">
                      <span className="sr-only">Pilih jenis pencarian</span>
                      <select
                        value={searchType}
                        onChange={event => setSearchType(event.target.value)}
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none opacity-0"
                      >
                        <option value="" disabled>Cari jurnal</option>
                        <option value="journal">Cari jurnal</option>
                        <option value="review">Literatur Review</option>
                        <option value="map">Peta Penelitian</option>
                      </select>
                      <img src="/assets/jurnal-design/quick-search/9490a.svg" alt="" className="pointer-events-none max-w-none origin-center scale-[0.6667]" />
                    </label>
                  </div>
                </section>

                <section className="mt-4 rounded-2xl border border-slate-200/80 bg-white px-4 py-[22px] shadow-sm md:p-6">
                  <h2 className="text-center font-['Plus_Jakarta_Sans:ExtraBold'] text-[19px] font-extrabold md:text-left md:font-['Plus_Jakarta_Sans:Bold'] md:text-base md:font-bold">Cari rujukan dari tulisanmu</h2>
                  <p className="mx-auto mt-2 max-w-lg text-center font-['Plus_Jakarta_Sans:Regular'] text-[13px] leading-5 text-[#1c1c1c] md:mx-0 md:mt-1 md:max-w-none md:text-left md:font-['Plus_Jakarta_Sans:Medium'] md:font-medium md:leading-5 md:text-xs md:text-[#71717a]">Tempel kalimat atau paragraf yang ingin kamu perkuat dengan sitasi. Alerin akan membantu mencari artikel jurnal yang relevan untuk mendukung tulisanmu.</p>
                  <div className="mt-5 grid gap-3 md:grid-cols-[1.35fr_0.95fr]">
                    <label className="grid gap-1.5">
                      <span className="font-['Plus_Jakarta_Sans:SemiBold'] text-[14px] font-semibold text-[#334155] md:hidden">Draf / Paragraf Teks</span>
                      <textarea value={paragraph} onChange={event => setParagraph(event.target.value)} placeholder="Masukkan kalimat atau paragraf yang membutuhkan sitasi." className="min-h-[123px] resize-none rounded-xl border border-slate-200 bg-[rgba(200,226,251,0.24)] p-3 text-[13px] outline-none focus:border-sky-400 md:min-h-44 md:bg-white md:p-4 md:text-xs" />
                    </label>
                    <label className="flex min-h-[108px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/40 p-4 text-center md:min-h-44 md:border-2 md:border-dashed md:border-sky-200 md:bg-white">
                      <span className="flex h-[53px] w-[53px] items-center justify-center rounded-full border border-sky-100 bg-white shadow-sm md:h-9 md:w-9 md:rounded-lg md:border-0 md:bg-sky-50 md:shadow-none">
                        <img src={`${mobileAssets}/36094.svg`} alt="" className="md:hidden" />
                        <img src={`${searchAssets}/f5e87.svg`} alt="" className="hidden md:block" />
                      </span>
                      <span className="mt-3 text-[13px] font-semibold md:text-xs md:font-bold md:text-slate-800">Unggah artikel atau catatan</span>
                      <span className="mt-1 text-[12px] text-[#94a3b8] md:text-slate-500">PDF, DOCX, atau TXT hingga 20 MB</span>
                      <span className="mt-2 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] text-[#004f80] md:bg-transparent md:p-0 md:text-xs md:font-semibold md:text-emerald-600">{fileName || "Belum ada dokumen"}</span>
                      <input type="file" accept=".pdf,.doc,.docx,.txt" className="sr-only" onChange={event => setFileName(event.target.files?.[0]?.name || "")} />
                    </label>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 md:mt-5 md:flex-row md:items-center md:justify-between">
                    <label className="flex items-center gap-2 text-[13px] text-[#475569] md:text-xs md:font-semibold md:text-slate-700">
                      <span className="flex h-[18px] w-[18px] items-center justify-center rounded bg-[#0070ba]">
                        <img src={`${mobileAssets}/9e421.svg`} alt="" className="max-w-none origin-center scale-[0.6667] md:hidden" />
                        <img src={`${searchAssets}/b5bd9.svg`} alt="" className="hidden md:block" />
                      </span>
                      Gunakan filter aktif pada rekomendasi Alerin
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.matchMedia("(min-width: 768px)").matches) runSearch();
                        else {
                          setResultMode("analysis");
                          setTemuanIndex(1);
                          setMobileSearchStage("loading");
                        }
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#00629b] px-8 py-3 font-['Plus_Jakarta_Sans:Bold'] text-[13px] font-bold text-white md:w-80 md:bg-sky-700 md:px-5 md:py-2.5 md:font-['Plus_Jakarta_Sans:Bold'] md:text-xs md:font-bold"
                    >
                      <img src={`${mobileAssets}/8802c.svg`} alt="" className="max-w-none origin-center scale-[0.6667] md:hidden" />
                      <img src={`${searchAssets}/550ef.svg`} alt="" className="hidden md:block" />
                      Analisis dan carikan jurnal
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-[12px] text-[#64748b] md:pt-4 md:font-semibold md:text-slate-500">
                    <span className="w-full md:w-auto">Konsep yang dipahami Alerin:</span>
                    {["interaksi parasosial", "kepercayaan konsumen", "kelangkaan produk", "niat beli"].map(item => (
                      <span key={item} className="rounded-lg bg-slate-100 px-3 py-1 font-['Plus_Jakarta_Sans:SemiBold'] text-[#334155] md:bg-sky-50 md:font-['Plus_Jakarta_Sans:SemiBold'] md:font-semibold md:text-zinc-700">{item}</span>
                    ))}
                  </div>
                </section>

                {hasResults && (
                  <section className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-xl font-bold text-[#193662]">Jurnal yang direkomendasikan</h2>
                      <button type="button" onClick={() => setView("collection")} className="text-sm font-semibold text-[#0070ba]">Lihat koleksi</button>
                    </div>
                    <JournalCard index={0} />
                  </section>
                )}
              </div>

              <aside className="space-y-5">
                <div className="hidden md:block"><ProfileCard collection={false} /></div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-6">
                  <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-base font-bold md:text-base">Tiga cara menemukan jurnal</h2>
                  <p className="mt-2 text-sm leading-5 text-[#64748b] md:font-['Plus_Jakarta_Sans:Regular'] md:text-xs">Pilih cara paling mudah sesuai informasi yang sudah kamu punya.</p>
                  <ol className="mt-4 space-y-2 md:mt-6 md:space-y-6">
                    {[
                      ["1", "Ketik kata kunci", "Cocok jika sudah tahu topik, penulis, atau variabel.", "Cocok jika sudah tahu topik, penulis, atau variabel."],
                      ["2", "Tempel tulisan", "Alerin memahami teori dan konteks paragrafmu.", "Alerin memahami narasi atau konteks paragrafmu."],
                      ["3", "Unggah dokumen", "Alerin mengambil konsep penting dari artikel atau catatan.", "Alerin membantu koreksi file untuk mengecek kekurangan atau kesalahan referensi yang digunakan."],
                    ].map(([number, title, descriptionMobile, descriptionDesktop]) => (
                      <li key={number} className="flex gap-3 rounded-xl border border-slate-100/80 bg-slate-50 p-3 md:rounded-none md:border-0 md:bg-transparent md:p-0">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-[#0070ba] md:h-8 md:w-8 md:rounded-xl md:text-sky-600">{number}</span>
                        <span>
                          <strong className="block text-sm md:text-sm">{title}</strong>
                          <span className="mt-0.5 block text-xs leading-5 text-[#64748b] md:mt-1 md:text-xs md:leading-5">
                            <span className="md:hidden">{descriptionMobile}</span>
                            <span className="hidden md:inline">{descriptionDesktop}</span>
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </aside>
            </div>
          ) : view === "riwayat" ? (
            <div className="mx-auto max-w-[1160px]">
              <div className="-mt-1 md:max-w-2xl">
                <h1 className="font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold tracking-[-0.27px] text-[#0f172a]">Riwayat cari jurnal</h1>
                <p className="mt-1 text-xs leading-5 text-[#64748b] md:text-sm">Pencarian yang pernah kamu lakukan di Alerin Jurnal.</p>

                <div className="mt-4 space-y-3">
                  {riwayatPencarian.map(item => (
                    <article key={item.query} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-['Plus_Jakarta_Sans:SemiBold'] text-sm font-semibold text-[#0f172a]">{item.query}</p>
                          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-[#94a3b8]">
                            <img src={`${mobileAssets}/3a1cb.svg`} alt="" className="h-3.5 w-3.5 opacity-60" />
                            {item.waktu} · {item.jumlah}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold text-[#0066a1]">{item.daftar.length} jurnal</span>
                      </div>

                      <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                        {item.daftar.map(judul => (
                          <li key={judul} className="flex items-start gap-2 text-xs leading-5 text-[#475569]">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" />
                            <span className="line-clamp-2">{judul}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setQuery(item.query);
                            setMobileSearchStage("home");
                            setView("home");
                          }}
                          className="flex-1 rounded-xl bg-[#00629b] px-4 py-2.5 text-xs font-semibold text-white"
                        >
                          Cari lagi
                        </button>
                        <button
                          type="button"
                          onClick={() => window.alert("Riwayat pencarian dihapus.")}
                          className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#64748b]"
                        >
                          Hapus
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
            <div data-mobile-collection className="-mt-4 md:hidden">
              <div className="flex items-center justify-between px-1">
                <h1 className="font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold tracking-[-0.27px] text-[#0f172a]">Folder Riset</h1>
                <button
                  type="button"
                  aria-label="Tambah folder"
                  onClick={() => {
                    const name = window.prompt("Nama folder riset baru");
                    if (name?.trim()) window.alert(`Folder “${name.trim()}” berhasil ditambahkan.`);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0369a1]"
                >
                  <img src="/assets/jurnal-design/collection-mobile/ce139.svg" alt="" />
                </button>
              </div>

              <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
                {[
                  ["all", "55585.svg", "Semua", "2"],
                  ["skripsi", "22763.svg", "Skripsi", "2"],
                  ["ungrouped", "d2faf.svg", "Belum dikelompokkan", "0"],
                ].map(([filter, icon, label, count]) => (
                  <button
                    key={filter}
                    type="button"
                    data-folder-filter={filter}
                    onClick={event => {
                      const container = event.currentTarget.closest("[data-mobile-collection]");
                      container?.querySelectorAll<HTMLElement>("[data-folder-filter]").forEach(button => {
                        const active = button === event.currentTarget;
                        button.classList.toggle("bg-[#00629b]", active);
                        button.classList.toggle("text-white", active);
                        button.classList.toggle("bg-white", !active);
                        button.classList.toggle("text-[#64748b]", !active);
                      });
                      container?.querySelectorAll<HTMLElement>("[data-journal-folder]").forEach(card => {
                        card.hidden = filter !== "all" && card.dataset.journalFolder !== filter;
                      });
                    }}
                    className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs shadow-sm ${
                      filter === "skripsi" ? "bg-[#00629b] text-white" : "bg-white text-[#64748b]"
                    }`}
                  >
                    <img src={`/assets/jurnal-design/collection-mobile/${icon}`} alt="" className="max-w-none origin-center scale-[0.7]" />
                    {label}
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${filter === "skripsi" ? "bg-white text-[#0369a1]" : "bg-slate-100"}`}>{count}</span>
                  </button>
                ))}
              </div>

              <div className="mt-2 space-y-3">
                {journals.map((journal, index) => (
                  <article key={index} data-journal-folder="skripsi" className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="rounded-full bg-sky-100 px-2 py-1 font-semibold text-[#0369a1]">Scopus Q1</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-[#64748b]">2023</span>
                      <span className="ml-auto flex items-center gap-1 rounded-full bg-sky-50 px-2 py-1 font-semibold text-[#006194]">
                        <img src="/assets/jurnal-design/collection-mobile/4bb5d.svg" alt="" className="max-w-none origin-center scale-[0.7]" />
                        97% relevan
                      </span>
                    </div>

                    <h2 className="mt-2 font-['Plus_Jakarta_Sans:ExtraBold'] text-base font-extrabold leading-[21px] tracking-[-0.14px] text-[#0f172a]">{journal.title}</h2>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-[#64748b]">
                      <img src="/assets/jurnal-design/collection-mobile/dadef.svg" alt="" className="max-w-none origin-center scale-[0.65]" />
                      {journal.authors}
                    </p>

                    <p className="mt-3 rounded-lg bg-slate-100/60 p-3 text-[13px] leading-[19px] text-slate-700">{journal.description}</p>
                    <div data-full-abstract className="mt-2 hidden rounded-lg border border-sky-100 bg-sky-50/50 p-3 text-[13px] leading-[19px] text-slate-700">
                      Abstrak lengkap mensintesis hubungan interaksi parasosial, dorongan kelangkaan, dan niat beli pada konteks live streaming commerce.
                    </div>

                    <div className="mt-2 flex gap-2 rounded-lg bg-sky-50 p-3 text-xs leading-[18px] text-[#0f172a]">
                      <img src="/assets/jurnal-design/collection-mobile/4f26d.svg" alt="" className="mt-0.5 max-w-none shrink-0 origin-top scale-[0.65]" />
                      <p><strong className="text-[#006194]">Alasan direkomendasikan:</strong> Cocok untuk memperkuat landasan teori dan hubungan antarvariabel.</p>
                    </div>

                    <label className="mt-2 block rounded-lg bg-slate-100 p-3">
                      <span className="flex items-center justify-between text-xs font-semibold">
                        Catatan Pribadi
                        <span className="font-normal text-slate-500">Otomatis tersimpan</span>
                      </span>
                      <textarea
                        aria-label={`Catatan jurnal ${index + 1}`}
                        placeholder="Masukan catatanmu disini"
                        onChange={event => window.localStorage.setItem(`alerin-journal-note-${index}`, event.target.value)}
                        className="mt-2 min-h-16 w-full resize-none rounded-md bg-white p-2 text-xs outline-none shadow-inner"
                      />
                    </label>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold">
                      <button type="button" onClick={() => window.alert(`${journal.title}\n\n${journal.authors}`)} className="rounded-lg bg-slate-100 px-3 py-2.5">Lihat detail</button>
                      <button
                        type="button"
                        onClick={event => event.currentTarget.closest("article")?.querySelector("[data-full-abstract]")?.classList.toggle("hidden")}
                        className="rounded-lg bg-slate-100 px-3 py-2.5"
                      >
                        Abstrak
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          void navigator.clipboard?.writeText(`${journal.authors} (2023). ${journal.title}.`);
                          window.alert("Sitasi berhasil disalin.");
                        }}
                        className="rounded-lg bg-sky-100 px-3 py-2.5 text-[#0369a1]"
                      >
                        Buat sitasi
                      </button>
                      <button type="button" onClick={() => window.open("https://doi.org/10.1016/j.jretconser.2020.102345", "_blank", "noopener,noreferrer")} className="rounded-lg bg-slate-100 px-3 py-2.5">Buka DOI</button>
                    </div>

                    <div className="mt-2 flex gap-2">
                      <label className="relative min-w-0 flex-1">
                        <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2 text-xs font-semibold">
                          <img src="/assets/jurnal-design/collection-mobile/445e6.svg" alt="" className="max-w-none origin-center scale-[0.65]" />
                        </span>
                        <select aria-label="Pilih folder jurnal" defaultValue="skripsi" className="w-full appearance-none rounded-lg bg-slate-100 py-2.5 pl-9 pr-8 text-xs font-semibold outline-none">
                          <option value="skripsi">Skripsi</option>
                          <option value="theory">Landasan teori</option>
                          <option value="hypothesis">Hipotesis</option>
                        </select>
                        <img src="/assets/jurnal-design/collection-mobile/392b3.svg" alt="" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                      </label>
                      <button
                        type="button"
                        onClick={event => {
                          if (window.confirm("Hapus jurnal ini dari koleksi?")) event.currentTarget.closest("article")?.remove();
                        }}
                        className="flex items-center gap-1.5 rounded-lg bg-[#ffdad6] px-3 text-xs font-medium text-[#93000a]"
                      >
                        <img src="/assets/jurnal-design/collection-mobile/29816.svg" alt="" className="max-w-none origin-center scale-[0.65]" />
                        Hapus
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mx-auto hidden max-w-[1160px] gap-5 md:grid lg:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="font-['Plus_Jakarta_Sans:ExtraBold'] text-[28px] font-extrabold tracking-[-0.69px] text-[#003859]">Koleksi jurnal</h1>
                    <p className="mt-1 text-xs text-[#64748b]">Simpan jurnal penting agar mudah ditemukan kembali saat menulis.</p>
                  </div>
                  <button type="button" className="flex items-center justify-center gap-3 rounded-[10px] bg-[#0066a1] px-5 py-2.5 font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold text-white">
                    Folder Skripsi <img src={`${collectionAssets}/f08e5.svg`} alt="" />
                  </button>
                </div>
                <div className="mt-5 space-y-4">
                  <JournalCard index={0} />
                  <JournalCard index={1} />
                </div>
              </div>

              <aside className="space-y-4">
                <ProfileCard collection />
                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between px-2 pb-3">
                    <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold text-[#1e293b]">Folder</h2>
                    <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200"><img src={`${collectionAssets}/b2242.svg`} alt="" /></button>
                  </div>
                  <div className="space-y-1">
                    {[
                      ["Semua jurnal tersimpan", "1", false],
                      ["Belum dikelompokkan", "0", false],
                      ["Variabel dependen", "1", true],
                      ["Landasan teori", "0", false],
                      ["Jenis penelitian", "0", false],
                      ["Hipotesis Penelitian", "0", false],
                      ].map(([label, count, active], index) => (
                      <button key={String(label)} type="button" className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs ${active ? "bg-sky-100 text-[#0066a1]" : "text-[#475569]"}`}>
                        <img src={`${collectionAssets}/${index < 2 ? "8b8d1.svg" : "e1558.svg"}`} alt="" />
                        <span className="flex-1">{label}</span>
                        <span>{count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
            </>
          )}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-[310] border-t border-slate-200 bg-white/95 px-3 pb-2 pt-1.5 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] backdrop-blur-md md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 items-end">
          <button type="button" onClick={() => setView("home")} aria-current={view === "home" ? "page" : undefined} className={`flex flex-col items-center gap-1 py-1 text-[10px] font-semibold ${view === "home" ? "text-[#00629b]" : "text-slate-400"}`}>
            <span className="flex h-6 items-center"><img src={`${mobileAssets}/62a85.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" style={{ filter: view === "home" ? "none" : "brightness(0) saturate(100%) invert(70%) sepia(14%) saturate(518%) hue-rotate(176deg) brightness(90%) contrast(86%)" }} /></span>
            Beranda
          </button>
          <button type="button" onClick={() => setView("collection")} aria-current={view === "collection" ? "page" : undefined} className={`flex flex-col items-center gap-1 py-1 text-[10px] font-medium ${view === "collection" ? "text-[#00629b]" : "text-slate-400"}`}>
            <span className="flex h-6 items-center"><img src={`${mobileAssets}/6978a.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" style={{ filter: view === "collection" ? "brightness(0) saturate(100%) invert(30%) sepia(96%) saturate(1030%) hue-rotate(164deg) brightness(86%) contrast(102%)" : "none" }} /></span>
            Koleksi
          </button>
          <button type="button" onClick={onBack} className="relative flex flex-col items-center gap-1 pb-1 text-[10px] font-bold text-[#004f80]">
            <span className="-mt-7 flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white bg-[rgba(123,123,123,0.05)] shadow-lg">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <img src={`${mobileAssets}/f725b.png`} alt="Alerin AI" className="h-8 w-8 rounded-full object-cover" />
              </span>
            </span>
            ALERIN AI
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileSearchStage("home");
              setView("riwayat");
            }}
            aria-current={view === "riwayat" ? "page" : undefined}
            className={`flex flex-col items-center gap-1 py-1 text-[10px] font-medium ${view === "riwayat" ? "text-[#00629b]" : "text-slate-400"}`}
          >
            <span className="flex h-6 items-center"><img src={`${mobileAssets}/3a1cb.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" style={{ filter: view === "riwayat" ? "brightness(0) saturate(100%) invert(30%) sepia(96%) saturate(1030%) hue-rotate(164deg) brightness(86%) contrast(102%)" : "none" }} /></span>
            Riwayat
          </button>
          <button type="button" onClick={() => setUpgradeOpen(true)} className="flex flex-col items-center gap-1 py-1 text-[10px] font-medium text-slate-400">
            <span className="flex h-6 items-center"><img src={`${mobileAssets}/ae5e6.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" /></span>
            Paket
          </button>
        </div>
      </nav>

      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={() => setFilterApplied(true)}
        onReset={() => setFilterApplied(false)}
      />
      <UpgradePremiumModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
      <UpgradePremiumSheet open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
