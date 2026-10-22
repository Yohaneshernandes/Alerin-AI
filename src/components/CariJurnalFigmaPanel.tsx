import { useEffect, useMemo, useRef, useState, type ChangeEvent, type PointerEvent as ReactPointerEvent, type ReactNode, type UIEvent } from "react";

type JournalView = "home" | "collection" | "riwayat";

const searchAssets = "/assets/jurnal-design/search";
const collectionAssets = "/assets/jurnal-design/collection";
const mobileAssets = "/assets/jurnal-design/mobile";

const journals = [
  {
    title: "Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges",
    authors: "Rahmawati, D. & Pratama, A.",
    description:
      "Interaksi parasosial antara host dan penonton, ditambah dorongan kelangkaan seperti batas waktu dan stok, meningkatkan niat beli di live streaming commerce. Temuan ini relevan untuk riset perilaku konsumen digital di Asia Tenggara.",
  },
  {
    title: "Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges",
    authors: "Rahmawati, D. & Pratama, A.",
    description:
      "Interaksi parasosial antara host dan penonton, ditambah dorongan kelangkaan seperti batas waktu dan stok, meningkatkan niat beli di live streaming.",
  },
];

type CollectionFolder = { id: string; name: string };

type SavedJournal = {
  id: string;
  title: string;
  authors: string;
  description: string;
  year: string;
  relevancy: string;
  folderId: string;
};

const defaultFolders: CollectionFolder[] = [
  { id: "ungrouped", name: "Belum dikelompokkan" },
  { id: "skripsi", name: "Skripsi" },
  { id: "variabel", name: "Variabel dependen" },
  { id: "teori", name: "Landasan teori" },
  { id: "penelitian", name: "Jenis penelitian" },
  { id: "hipotesis", name: "Hipotesis Penelitian" },
];

const initialSavedJournals: SavedJournal[] = [
  {
    id: "saved-1",
    title: journals[0].title,
    authors: journals[0].authors,
    description: journals[0].description,
    year: "2023",
    relevancy: "97%",
    folderId: "ungrouped",
  },
  {
    id: "saved-2",
    title: journals[1].title,
    authors: journals[1].authors,
    description: journals[1].description,
    year: "2023",
    relevancy: "92%",
    folderId: "skripsi",
  },
];

const desktopResultJournals = [
  { id: "res-1", title: journals[0].title, authors: journals[0].authors, description: journals[0].description, year: "2023", relevancy: "97%" },
  {
    id: "res-2",
    title: "The Impact of Digital Literacy on Academic Achievement: A Meta-Analysis of Higher Education Students",
    authors: "Hidayat, M. & Nugroho, A.",
    description:
      "Meta-analisis 43 studi menunjukkan literasi digital memediasi hubungan antara akses teknologi dan capaian akademik mahasiswa.",
    year: "2022",
    relevancy: "92%",
  },
  {
    id: "res-3",
    title: "Strategi Peningkatan Minat Beli pada Live Commerce: Peran Kepercayaan dan Ulasan Konsumen",
    authors: "Pratama, R. & Lestari, S.",
    description: "Survei 312 responden pengguna live commerce di Indonesia menemukan kepercayaan dan ulasan konsumen memediasi minat beli.",
    year: "2024",
    relevancy: "89%",
  },
];

type ResultDetail = {
  id: string;
  headerTitle: string;
  headerNote: string;
  rank: string;
  badges: { label: string; tone: "sky" | "slate" }[];
  citations: string;
  source: string;
  fitBars: [string, number][];
  fitNote: string;
  quote: string;
  credibility: [string, string][];
  summary: string;
  doiUrl: string;
  pdfNote: string;
};

const desktopResultDetails: ResultDetail[] = [
  {
    id: "res-1",
    headerTitle: "Rekomendasi Jurnal",
    headerNote: "",
    rank: "Rekomendasi 1",
    badges: [
      { label: "Artikel Jurnal", tone: "sky" },
      { label: "2023", tone: "slate" },
      { label: "Akses Terbuka", tone: "sky" },
    ],
    citations: "",
    source: "Jurnal Kajian Pemasaran Digital",
    fitBars: [
      ["Kesesuaian variabel", 98],
      ["Kesesuaian topik", 96],
      ["Kesesuaian konteks", 94],
      ["Kesesuaian metode", 91],
      ["Kesesuaian teori", 89],
      ["Kesesuaian periode", 93],
    ],
    fitNote: "Cocok untuk: landasan teori, penyusunan hipotesis, pembanding penelitian, dan rujukan metode kuantitatif.",
    quote: "Parasocial interaction strengthens purchase intention when viewers perceive urgency and scarcity.",
    credibility: [
      ["Penerbit", "Pusat Studi Bisnis Digital Nusantara"],
      ["DOI terverifikasi", "DOI: 10.20886/jpkf.2022.6.1.16-28"],
      ["Jumlah sitasi", "Artikel ini dikutip dalam 45 karya ilmiah lainnya."],
      ["Sumber", "OpenAlex dan Crossref"],
    ],
    summary:
      "Penelitian ini menunjukkan bahwa interaksi parasosial antara host dan penonton dapat membangun kepercayaan. Ketika interaksi tersebut disertai pesan kelangkaan berupa batas waktu atau stok, niat beli konsumen pada live streaming commerce meningkat...",
    doiUrl: "https://doi.org/10.20886/jpkf.2022.6.1.16-28",
    pdfNote: "PDF Live Streaming Commerce dibuka.",
  },
  {
    id: "res-2",
    headerTitle: "Rekomendasi Jurnal",
    headerNote: "",
    rank: "Rekomendasi 2",
    badges: [
      { label: "Artikel Jurnal", tone: "sky" },
      { label: "2022", tone: "slate" },
      { label: "Akses Terbuka", tone: "sky" },
    ],
    citations: "",
    source: "Jurnal Kajian Pemasaran Digital",
    fitBars: [
      ["Kesesuaian variabel", 94],
      ["Kesesuaian topik", 92],
      ["Kesesuaian konteks", 90],
      ["Kesesuaian metode", 88],
      ["Kesesuaian teori", 86],
      ["Kesesuaian periode", 91],
    ],
    fitNote: "Cocok untuk: kerangka konseptual, pembahasan meta-analisis, dan perbandingan efek antarnegara.",
    quote: "Digital literacy mediates the relationship between technology access and academic achievement.",
    credibility: [
      ["Penerbit", "Pusat Studi Bisnis Digital Nusantara"],
      ["DOI terverifikasi", "DOI: 10.20886/jpkf.2022.6.1.16-28"],
      ["Jumlah sitasi", "Artikel ini dikutip dalam 45 karya ilmiah lainnya."],
      ["Sumber", "OpenAlex dan Crossref"],
    ],
    summary:
      "Meta-analisis 43 studi dari 12 negara menunjukkan literasi digital memediasi hubungan antara akses teknologi dan capaian akademik, dengan efek terbesar pada mahasiswa semester awal. Ukuran efek gabungan berada pada kategori sedang hingga kuat.",
    doiUrl: "https://doi.org/10.20886/jpkf.2022.6.1.16-28",
    pdfNote: "PDF meta-analisis literasi digital dibuka.",
  },
  {
    id: "res-3",
    headerTitle: "Rekomendasi Jurnal",
    headerNote: "",
    rank: "Rekomendasi 3",
    badges: [
      { label: "Artikel Jurnal", tone: "sky" },
      { label: "2024", tone: "slate" },
      { label: "Akses Terbuka", tone: "sky" },
    ],
    citations: "",
    source: "Jurnal Kajian Pemasaran Digital",
    fitBars: [
      ["Kesesuaian variabel", 88],
      ["Kesesuaian topik", 90],
      ["Kesesuaian konteks", 95],
      ["Kesesuaian metode", 84],
      ["Kesesuaian teori", 87],
      ["Kesesuaian periode", 96],
    ],
    fitNote: "Cocok untuk: konteks Indonesia, rujukan variabel kepercayaan, dan implikasi praktis pemasaran.",
    quote: "Kepercayaan konsumen memediasi pengaruh ulasan daring terhadap minat beli.",
    credibility: [
      ["Penerbit", "Pusat Studi Bisnis Digital Nusantara"],
      ["DOI terverifikasi", "DOI: 10.20886/jpkf.2022.6.1.16-28"],
      ["Jumlah sitasi", "Artikel ini dikutip dalam 45 karya ilmiah lainnya."],
      ["Sumber", "OpenAlex dan Crossref"],
    ],
    summary:
      "Survei 312 responden pengguna live commerce di Indonesia menemukan kepercayaan dan ulasan konsumen memediasi pengaruh interaksi parasosial terhadap minat beli, terutama pada kategori produk fesyen dan perawatan diri.",
    doiUrl: "https://doi.org/10.20886/jpkf.2022.6.1.16-28",
    pdfNote: "PDF strategi minat beli live commerce dibuka.",
  },
];

const mobileResultJournals = [
  {
    id: "mres-1",
    rank: "Rekomendasi 1",
    score: 97,
    citation: "2023 • Jurnal Kajian Pemasaran Digital",
    summary:
      "Penelitian ini menunjukkan bahwa interaksi parasosial antara host dan penonton dapat membangun kepercayaan. Ketika interaksi tersebut disertai pesan kelangkaan berupa batas waktu atau stok, niat beli konsumen pada live streaming commerce meningkat...",
    title: "Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges",
    authors: "Rahmawati, D. & Pratama, A.",
    description:
      "Interaksi parasosial antara host dan penonton ditambah dorongan kelangkaan seperti batas waktu dan stok meningkatkan niat beli di live streaming commerce.",
    year: "2023",
    relevancy: "97%",
  },
  {
    id: "mres-2",
    rank: "Rekomendasi #2",
    score: 89,
    citation: "2023 • Jurnal Kajian Pemasaran Digital",
    summary: "Studi ini memperkuat hubungan antara interaksi parasosial, dorongan kelangkaan, dan perilaku pembelian digital.",
    title: "Pengaruh Interaksi Parasosial dan Dorongan Kelangkaan terhadap Niat Beli di Live Streaming Commerce",
    authors: "Pratama, R. & Lestari, S.",
    description: "Studi ini memperkuat hubungan antara interaksi parasosial, dorongan kelangkaan, dan perilaku pembelian digital.",
    year: "2023",
    relevancy: "89%",
  },
];

function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="fixed bottom-20 right-4 z-[360] flex max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-xl bg-[#1f1f1f] px-4 py-3 text-sm font-medium text-white shadow-2xl md:bottom-6 md:right-6"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12.5l2.5 2.5L16 9.5" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

function NewFolderModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) setName("");
  }, [open]);

  if (!open) return null;

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[340] flex items-center justify-center bg-black/25 px-4 backdrop-blur-[2.55px]"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Folder baru"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={event => event.stopPropagation()}
      >
        <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold text-[#0f172a]">Folder baru</h2>
        <p className="mt-1 text-xs leading-5 text-[#64748b]">Buat folder untuk mengelompokkan jurnal tersimpanmu.</p>
        <input
          autoFocus
          value={name}
          onChange={event => setName(event.target.value)}
          onKeyDown={event => {
            if (event.key === "Enter") submit();
            if (event.key === "Escape") onClose();
          }}
          placeholder="Nama folder baru"
          className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 text-sm text-[#0f172a] outline-none placeholder:text-slate-400 focus:border-sky-400 focus:bg-white"
        />
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#64748b] hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!name.trim()}
            className={`rounded-xl px-5 py-2 text-xs font-semibold text-white ${name.trim() ? "bg-[#00629b] hover:bg-[#005280]" : "cursor-not-allowed bg-slate-200 text-slate-400"}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

function HapusJurnalModal({
  open,
  title,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[340] flex items-center justify-center bg-black/25 px-4 backdrop-blur-[2.55px]"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Hapus jurnal dari koleksi"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={event => event.stopPropagation()}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffdad6] text-[#93000a]">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
            <path d="M6.5 7v4M9.5 7v4" />
          </svg>
        </div>
        <h2 className="mt-4 font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold text-[#0f172a]">Kamu yakin ingin menghapus jurnal ini?</h2>
        <p className="mt-1.5 text-sm leading-6 text-[#64748b]">
          <span className="font-semibold text-[#0f172a]">{title}</span> akan dihapus dari Koleksi. Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#64748b] transition-colors hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-[#bd3434] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a12b2b]"
          >
            Ya, hapus
          </button>
        </div>
      </div>
    </div>
  );
}

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
  "Rekomendasi Jurnal Terverifikasi Alerin",
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
            Plus
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
  onUpgrade,
  onOpenRiwayat,
}: {
  view: JournalView;
  onView: (view: JournalView) => void;
  onUpgrade: () => void;
  onOpenRiwayat: (title: string) => void;
}) {
  const assets = view === "collection" ? collectionAssets : searchAssets;
  const homeIcon = view === "collection" ? "62b0b.svg" : "b4a91.svg";
  const collectionIcon = view === "collection" ? "57aea.svg" : "6f1a2.svg";
  const [items, setItems] = useState(riwayatSidebar);
  const [menuIndex, setMenuIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden shrink-0 flex-col overflow-hidden border-r border-slate-100 bg-white transition-all duration-300 md:flex ${
        collapsed ? "w-[76px] p-3" : "w-[280px] p-5"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          title={collapsed ? "Buka sidebar" : undefined}
          aria-label={collapsed ? "Buka sidebar" : "Alerin Jurnal"}
          className={`group relative flex shrink-0 cursor-pointer items-center justify-center ${
            collapsed ? "h-11 w-11 rounded-xl" : "h-[52px] w-[52px]"
          }`}
        >
          <img
            src={`${assets}/24a8e.svg`}
            alt=""
            className={`transition-opacity duration-150 ${collapsed ? "h-11 w-11 group-hover:opacity-0" : "h-[44px] w-[44px]"}`}
          />
          {collapsed && (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl text-slate-500 opacity-0 transition-opacity duration-150 group-hover:bg-sky-50 group-hover:text-sky-600 group-hover:opacity-100">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
                <path d="M6 2.5v11" />
                <path d="M10 6.5l-1.5 1.5 1.5 1.5" />
              </svg>
            </span>
          )}
        </button>
        {!collapsed && (
          <div className="flex min-w-0 flex-1 items-center">
            <p className="truncate font-['Inter:Bold'] text-lg font-bold leading-6 text-slate-900">Alerin Jurnal</p>
          </div>
        )}
        {!collapsed && (
          <button
            type="button"
            aria-label="Perkecil sidebar"
            title="Perkecil sidebar"
            onClick={() => {
              setMenuIndex(null);
              setCollapsed(true);
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
              <path d="M6 2.5v11" />
            </svg>
          </button>
        )}
      </div>

      <nav className="mt-8 space-y-1">
        <button
          type="button"
          onClick={() => onView("home")}
          title={collapsed ? "Beranda Jurnal" : undefined}
          className={`flex w-full items-center gap-3.5 rounded-xl py-3 text-base ${
            collapsed ? "justify-center px-0" : "px-4"
          } ${view === "home" ? "bg-sky-100/80 font-semibold text-sky-600" : "font-medium text-slate-600"}`}
        >
          <img src={`${assets}/${homeIcon}`} alt="" />
          {!collapsed && "Beranda Jurnal"}
        </button>
        <button
          type="button"
          onClick={() => onView("collection")}
          title={collapsed ? "Koleksi" : undefined}
          className={`flex w-full items-center gap-3.5 rounded-xl py-3 text-base ${
            collapsed ? "justify-center px-0" : "px-4"
          } ${view === "collection" ? "bg-sky-100/80 font-semibold text-sky-600" : "font-medium text-slate-600"}`}
        >
          <img src={`${assets}/${collectionIcon}`} alt="" />
          {!collapsed && "Koleksi"}
        </button>
      </nav>

      {!collapsed && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <p className="mt-6 font-['Inter:Bold'] text-sm font-bold uppercase leading-5 tracking-wide text-slate-400">Riwayat</p>
          <div className="mt-2 space-y-0.5">
        {items.map((item, index) => (
          <div key={`${index}-${item}`} className="group relative">
            <button
              type="button"
              onClick={() => {
                setMenuIndex(null);
                setActiveIndex(index);
                onOpenRiwayat(item);
              }}
              className={`flex w-full items-center gap-1 rounded-lg py-2 pl-2.5 pr-9 text-left text-xs leading-4 ${
                index === activeIndex
                  ? "bg-blue-50/70 font-semibold text-blue-900 outline outline-1 outline-blue-200/80"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="min-w-0 flex-1 truncate">{item}</span>
            </button>
            <button
              type="button"
              aria-label={`Opsi untuk ${item}`}
              onClick={event => {
                event.stopPropagation();
                setMenuIndex(menuIndex === index ? null : index);
              }}
              className={`absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-opacity hover:bg-slate-200/60 hover:text-slate-600 ${
                menuIndex === index ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <svg width="14" height="4" viewBox="0 0 14 4" fill="currentColor" aria-hidden="true">
                <circle cx="2" cy="2" r="1.5" />
                <circle cx="7" cy="2" r="1.5" />
                <circle cx="12" cy="2" r="1.5" />
              </svg>
            </button>
            {menuIndex === index && (
              <>
                <div className="fixed inset-0 z-[345]" onClick={() => setMenuIndex(null)} aria-hidden="true" />
                <div
                  className={`absolute right-0 z-[350] w-52 overflow-hidden rounded-2xl bg-[#1f1f1f] py-2 shadow-2xl ${
                    index >= items.length - 2 ? "bottom-full mb-1" : "top-full mt-1"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      const name = window.prompt("Ganti nama riwayat", item);
                      if (name && name.trim()) setItems(list => list.map((text, i) => (i === index ? name.trim() : text)));
                      setMenuIndex(null);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-100 transition-colors hover:bg-white/10"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
                    </svg>
                    Ganti nama
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      window.alert("Riwayat disematkan.");
                      setMenuIndex(null);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-100 transition-colors hover:bg-white/10"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 17v5" />
                      <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
                    </svg>
                    Sematkan
                  </button>
                  <div className="mx-4 my-1.5 border-t border-white/10" />
                  <button
                    type="button"
                    onClick={() => {
                      window.alert("Tautan riwayat berhasil disalin.");
                      setMenuIndex(null);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-100 transition-colors hover:bg-white/10"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <path d="M16 6l-4-4-4 4" />
                      <path d="M12 2v13" />
                    </svg>
                    Bagikan
                  </button>
                  <div className="mx-4 my-1.5 border-t border-white/10" />
                  <button
                    type="button"
                    onClick={() => {
                      setItems(list => list.filter((_, i) => i !== index));
                      setActiveIndex(current => {
                        if (index < current) return current - 1;
                        if (index === current) return 0;
                        return current;
                      });
                      setMenuIndex(null);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 6h18" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    </svg>
                    Hapus
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
          </div>
        </div>
      )}

      {collapsed ? (
        <button
          type="button"
          aria-label="Upgrade Sekarang"
          title="Upgrade Sekarang"
          onClick={onUpgrade}
          className="mt-auto flex h-11 w-11 items-center justify-center rounded-xl border border-amber-100/80 bg-gradient-to-br from-amber-50/70 via-blue-50/50 to-indigo-50/60 text-amber-500 transition-colors hover:bg-amber-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l2.9 6.26L21.5 9.3l-4.75 4.63 1.12 6.57L12 17.4l-5.87 3.1 1.12-6.57L2.5 9.3l6.6-1.04L12 2z" />
          </svg>
        </button>
      ) : (
        <>
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
          <div className="mt-3">
            <ProfileCard collection={view === "collection"} />
          </div>
        </>
      )}
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

const tahunSekarang = new Date().getFullYear();

const rentangTahun: Record<string, [string, string]> = {
  Semua: ["", ""],
  "2 tahun terakhir": [String(tahunSekarang - 2), String(tahunSekarang)],
  "5 tahun terakhir": [String(tahunSekarang - 5), String(tahunSekarang)],
  "10 tahun terakhir": [String(tahunSekarang - 10), String(tahunSekarang)],
};

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
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className="flex w-full items-center gap-2.5 rounded-lg py-1 text-left transition-colors hover:bg-slate-100/70"
    >
      <span
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
          checked ? "border-[#0369a1] bg-[#0369a1]" : "border-slate-300 bg-white"
        }`}
      >
        {checked && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 6.5l2.5 2.5 4.5-5.5" />
          </svg>
        )}
      </span>
      <span className={`text-sm leading-5 ${bold ? "font-semibold text-slate-800" : "text-slate-600"}`}>{label}</span>
    </button>
  );
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
  badge,
  bordered = true,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  badge?: number;
  bordered?: boolean;
}) {
  return (
    <section className={`pb-3 ${bordered ? "mb-3 border-b border-slate-200" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors ${
          open ? "border-sky-200 bg-sky-50/70" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
        }`}
      >
        <span className="flex items-center gap-2">
          <span className={`text-[15px] font-bold ${open ? "text-[#0369a1]" : "text-slate-900"}`}>{title}</span>
          {badge && badge > 0 ? (
            <span className="rounded-full bg-[#0369a1] px-2 py-0.5 text-[11px] font-semibold leading-4 text-white">{badge}</span>
          ) : null}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke={open ? "#0369a1" : "#64748b"}
          strokeWidth="1.6"
          strokeLinecap="round"
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>
      {open && <div className="flex flex-col gap-3.5 px-1 pb-1 pt-3.5">{children}</div>}
    </section>
  );
}

function FilterPanel({ open, onClose, onApply, onReset }: { open: boolean; onClose: () => void; onApply: () => void; onReset: () => void }) {
  const [tahun, setTahun] = useState("2 tahun terakhir");
  const [tahunAwal, setTahunAwal] = useState(rentangTahun["2 tahun terakhir"][0]);
  const [tahunAkhir, setTahunAkhir] = useState(rentangTahun["2 tahun terakhir"][1]);
  const [aksesTerbuka, setAksesTerbuka] = useState(true);
  const [metode, setMetode] = useState<Record<string, string[]>>({ Eksperimental: [...metodeGroups[0].items] });
  const [bidang, setBidang] = useState<Record<string, boolean>>({ "Bisnis dan manajemen": true });
  const [negara, setNegara] = useState<Record<string, boolean>>({});
  const [sections, setSections] = useState<Record<string, boolean>>({ umum: true, metodologi: false, bidang: false, negara: false });
  const [bidangTambahan, setBidangTambahan] = useState<string[]>([]);
  const [negaraTambahan, setNegaraTambahan] = useState<string[]>([]);
  const [bidangLain, setBidangLain] = useState("");
  const [negaraLain, setNegaraLain] = useState("");
  const [bidangLainOpen, setBidangLainOpen] = useState(false);
  const [negaraLainOpen, setNegaraLainOpen] = useState(false);

  const toggleSection = (key: string) => setSections(current => ({ ...current, [key]: !current[key] }));

  const toggleMetodeItem = (group: string, item: string) =>
    setMetode(current => {
      const selected = current[group] ?? [];
      return { ...current, [group]: selected.includes(item) ? selected.filter(value => value !== item) : [...selected, item] };
    });

  const groupChecked = (group: string) => (metode[group]?.length ?? 0) > 0;

  const tambahOpsi = (
    value: string,
    daftar: string[],
    setDaftar: (next: string[]) => void,
    setTerpilih: (updater: (current: Record<string, boolean>) => Record<string, boolean>) => void,
    reset: () => void,
  ) => {
    const trimmed = value.trim();
    if (!trimmed || daftar.includes(trimmed)) return;
    setDaftar([...daftar, trimmed]);
    setTerpilih(current => ({ ...current, [trimmed]: true }));
    reset();
  };

  const pilihRentangTahun = (option: string) => {
    setTahun(option);
    const rentang = rentangTahun[option];
    if (rentang) {
      setTahunAwal(rentang[0]);
      setTahunAkhir(rentang[1]);
    }
  };

  const handleReset = () => {
    setTahun("Semua");
    setTahunAwal("");
    setTahunAkhir("");
    setAksesTerbuka(false);
    setMetode({});
    setBidang({});
    setNegara({});
  };

  const metodeCount = Object.values(metode).reduce((sum, list) => sum + list.length, 0);
  const bidangCount = Object.values(bidang).filter(Boolean).length;
  const negaraCount = Object.values(negara).filter(Boolean).length;
  const activeCount = (tahun !== "Semua" ? 1 : 0) + metodeCount + bidangCount + negaraCount;

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
        className={`fixed right-0 top-0 z-[320] flex h-dvh w-full flex-col overflow-hidden rounded-l-[26px] border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 sm:max-w-[420px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-bold leading-7 text-slate-900">Filter jurnal</h2>
            <p className="mt-0.5 text-sm leading-5 text-slate-500">
              {activeCount > 0 ? `${activeCount} filter aktif` : "Sesuaikan hasil penelusuranmu"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Tutup filter"
            onClick={onClose}
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <FilterSection title="Umum" open={sections.umum} onToggle={() => toggleSection("umum")}>
            <div>
              <p className="text-sm font-medium leading-5 text-slate-700">Tahun terbit</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {pilihanTahun.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => pilihRentangTahun(option)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm leading-5 transition-colors ${
                      tahun === option
                        ? "border-[#0369a1] bg-[#0369a1] font-semibold text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2.5">
                <input
                  value={tahunAwal}
                  onChange={event => setTahunAwal(event.target.value)}
                  inputMode="numeric"
                  placeholder="YYYY"
                  aria-label="Tahun awal"
                  className="h-10 w-32 rounded-xl border border-slate-300 bg-white px-3 text-center text-sm font-medium text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-[#0369a1]"
                />
                <span className="shrink-0 text-sm text-slate-400">s/d</span>
                <input
                  value={tahunAkhir}
                  onChange={event => setTahunAkhir(event.target.value)}
                  inputMode="numeric"
                  placeholder="YYYY"
                  aria-label="Tahun akhir"
                  className="h-10 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-center text-sm font-medium text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-[#0369a1]"
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-3">
              <span className="text-sm font-medium text-slate-700">Hanya akses terbuka</span>
              <button
                type="button"
                role="switch"
                aria-checked={aksesTerbuka}
                onClick={() => setAksesTerbuka(value => !value)}
                className={`flex h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${aksesTerbuka ? "bg-[#0369a1]" : "bg-slate-300"}`}
              >
                <span className={`h-5 w-5 rounded-full border border-white bg-white shadow transition-transform ${aksesTerbuka ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </FilterSection>

          <FilterSection
            title="Metodologi"
            badge={metodeCount}
            open={sections.metodologi}
            onToggle={() => toggleSection("metodologi")}
          >
            <p className="text-sm leading-5 text-slate-500">Pilih jenis desain penelitian hingga tingkat yang lebih spesifik.</p>
            {metodeGroups.map(group => (
              <div
                key={group.name}
                className={`rounded-2xl border p-3.5 transition-colors ${
                  groupChecked(group.name) ? "border-sky-200 bg-sky-50/60" : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
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
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium leading-4 text-slate-500">
                    {group.items.length} jenis
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 pl-7 pt-2.5">
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

          <FilterSection title="Bidang studi" badge={bidangCount} open={sections.bidang} onToggle={() => toggleSection("bidang")}>
            <p className="text-sm leading-5 text-slate-500">23 bidang studi tersedia.</p>
            <div className="flex flex-col gap-1.5 rounded-2xl border border-slate-200 bg-white p-3.5">
              {bidangStudi.map(item => (
                <FilterCheck
                  key={item}
                  bold
                  checked={Boolean(bidang[item])}
                  label={item}
                  onToggle={() => setBidang(current => ({ ...current, [item]: !current[item] }))}
                />
              ))}
              {bidangTambahan.map(item => (
                <FilterCheck
                  key={item}
                  bold
                  checked={Boolean(bidang[item])}
                  label={item}
                  onToggle={() => setBidang(current => ({ ...current, [item]: !current[item] }))}
                />
              ))}
              {bidangLainOpen ? (
                <div className="mt-1 flex gap-2">
                  <input
                    autoFocus
                    value={bidangLain}
                    onChange={event => setBidangLain(event.target.value)}
                    onKeyDown={event => {
                      if (event.key !== "Enter") return;
                      event.preventDefault();
                      tambahOpsi(bidangLain, bidangTambahan, setBidangTambahan, setBidang, () => {
                        setBidangLain("");
                        setBidangLainOpen(false);
                      });
                    }}
                    placeholder="Tulis bidang studi lain"
                    className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-800 outline-none focus:border-[#0369a1]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      tambahOpsi(bidangLain, bidangTambahan, setBidangTambahan, setBidang, () => {
                        setBidangLain("");
                        setBidangLainOpen(false);
                      })
                    }
                    className="shrink-0 rounded-lg bg-[#0369a1] px-3 py-2 text-sm font-semibold text-white"
                  >
                    Tambah
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setBidangLainOpen(true)}
                  className="mt-1 flex items-center gap-1.5 rounded-lg px-1 py-1.5 text-sm font-semibold text-[#0369a1]"
                >
                  + Opsi lainnya
                </button>
              )}
            </div>
          </FilterSection>

          <FilterSection
            title="Negara penelitian"
            badge={negaraCount}
            open={sections.negara}
            onToggle={() => toggleSection("negara")}
            bordered={false}
          >
            <p className="text-sm leading-5 text-slate-500">236 negara dan wilayah.</p>
            <div className="flex flex-col gap-1.5 rounded-2xl border border-slate-200 bg-white p-3.5">
              {negaraPenelitian.map(item => (
                <FilterCheck
                  key={item}
                  bold
                  checked={Boolean(negara[item])}
                  label={item}
                  onToggle={() => setNegara(current => ({ ...current, [item]: !current[item] }))}
                />
              ))}
              {negaraTambahan.map(item => (
                <FilterCheck
                  key={item}
                  bold
                  checked={Boolean(negara[item])}
                  label={item}
                  onToggle={() => setNegara(current => ({ ...current, [item]: !current[item] }))}
                />
              ))}
              {negaraLainOpen ? (
                <div className="mt-1 flex gap-2">
                  <input
                    autoFocus
                    value={negaraLain}
                    onChange={event => setNegaraLain(event.target.value)}
                    onKeyDown={event => {
                      if (event.key !== "Enter") return;
                      event.preventDefault();
                      tambahOpsi(negaraLain, negaraTambahan, setNegaraTambahan, setNegara, () => {
                        setNegaraLain("");
                        setNegaraLainOpen(false);
                      });
                    }}
                    placeholder="Tulis negara atau wilayah lain"
                    className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-800 outline-none focus:border-[#0369a1]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      tambahOpsi(negaraLain, negaraTambahan, setNegaraTambahan, setNegara, () => {
                        setNegaraLain("");
                        setNegaraLainOpen(false);
                      })
                    }
                    className="shrink-0 rounded-lg bg-[#0369a1] px-3 py-2 text-sm font-semibold text-white"
                  >
                    Tambah
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setNegaraLainOpen(true)}
                  className="mt-1 flex items-center gap-1.5 rounded-lg px-1 py-1.5 text-sm font-semibold text-[#0369a1]"
                >
                  + Opsi lainnya
                </button>
              )}
            </div>
          </FilterSection>
        </div>

        <footer className="flex shrink-0 items-center gap-3 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
          <button
            type="button"
            onClick={() => {
              onApply();
              onClose();
            }}
            className="min-w-0 flex-1 rounded-xl bg-[#0369a1] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#075985]"
          >
            Terapkan filter
          </button>
          <button
            type="button"
            onClick={() => {
              handleReset();
              onReset();
            }}
            className="shrink-0 whitespace-nowrap rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
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
    desc: "Crossref, OpenAlex & basis data terverifikasi Alerin",
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
  <svg key="sintesis" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>,
  <svg key="database" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
    <rect x="3.5" y="2" width="9" height="12" rx="1.5" />
    <path d="M6 5.5h4M6 8h4M6 10.5h3" />
  </svg>,
  <svg key="deteksi" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 1.5l5 2v4.2c0 3-2.1 5.3-5 6.3-2.9-1-5-3.3-5-6.3V3.5l5-2z" />
    <path d="M5.8 8l1.6 1.6 2.8-3" />
  </svg>,
  <svg key="peta" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
    <path d="M3 13V7M8 13V3M13 13V9" />
  </svg>,
  <svg key="kuota" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 1.5h5l3 3v10H4z" />
    <path d="M9 1.5v3h3" />
    <path d="M6.5 9.5l1.5 1.5 2.5-2.5" />
  </svg>,
];

function UpgradePremiumCell({ value }: { value: string }) {
  if (value === "—") {
    return <span className="text-xs font-medium text-slate-400">—</span>;
  }
  if (value === "check") {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
        <svg width="12" height="9" viewBox="0 0 10 8" fill="none" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M1 4l2.5 2.5L9 1" />
        </svg>
      </span>
    );
  }
  const tone: Record<string, string> = {
    "10/hari": "whitespace-nowrap text-xs font-medium text-slate-400",
    Unlimited: "whitespace-nowrap rounded-md bg-indigo-50/70 px-2 py-0.5 text-xs font-bold text-zinc-800",
    "Unlimited + API": "whitespace-nowrap text-xs font-bold text-slate-700",
    "1 Jurnal/sesi": "whitespace-nowrap text-xs font-medium text-slate-500",
    "Hingga 30 Jurnal": "whitespace-nowrap text-xs font-bold text-zinc-800",
    "Hingga 80 Jurnal": "whitespace-nowrap text-xs font-bold text-sky-700",
  };
  return <span className={tone[value] ?? "whitespace-nowrap text-xs font-bold text-slate-700"}>{value}</span>;
}

function UpgradePremiumModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selectedPlan, setSelectedPlan] = useState<"gratis" | "plus" | "pro">("plus");

  const plans = [
    { key: "gratis", name: "Gratis", price: "Rp 0", note: "Akses dasar" },
    { key: "plus", name: "Paket Plus", price: "Rp 49.000", note: "per bulan" },
    { key: "pro", name: "Paket Pro", price: "Rp 99.000", note: "per bulan" },
  ] as const;

  const activePlan = plans.find(plan => plan.key === selectedPlan) ?? plans[1];

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
          <h2 className="font-['Inter:Extra_Bold'] text-2xl leading-7 text-slate-900">Upgrade ke Alerin Premium!</h2>
          <p className="mx-auto mt-1.5 max-w-96 text-xs font-medium leading-4 text-zinc-800">
            Akselerasi riset, telaah literatur, dan skripsimu lebih cepat &amp; tuntas dengan asisten bertenaga AI.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-5 pt-4">
          <div className="grid grid-cols-3 items-start gap-2">
            {plans.map(plan => {
              const active = selectedPlan === plan.key;
              return (
                <button
                  key={plan.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedPlan(plan.key)}
                  className={`relative rounded-xl p-4 text-center transition-colors ${
                    active
                      ? "bg-gradient-to-b from-cyan-50 to-blue-200/70 outline outline-[1.58px] outline-offset-[-1.58px] outline-blue-500/90"
                      : "bg-white outline outline-[0.79px] outline-offset-[-0.79px] outline-slate-200 hover:bg-slate-50"
                  } ${plan.key === "plus" ? "" : "mt-[3px]"}`}
                >
                  {plan.key === "plus" && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-red-500 px-2.5 py-[2px] text-[8.71px] font-bold uppercase leading-3 tracking-tight text-white shadow-sm">
                      Populer
                    </span>
                  )}
                  {plan.key === "plus" && (
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
                  )}
                  <p className={`text-xs leading-4 ${active ? "font-bold text-sky-900" : "font-semibold text-slate-600"}`}>{plan.name}</p>
                  <p className="mt-1.5 text-lg font-extrabold leading-6 text-slate-900">{plan.price}</p>
                  <p className={`text-[9.5px] leading-3 ${active ? "font-semibold text-sky-900" : "font-medium text-slate-400"}`}>{plan.note}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <div className="max-h-[236px] overflow-y-auto pr-1">
            <div className="sticky top-0 z-10 flex items-end gap-2 border-b border-slate-100 bg-white pb-2.5">
              <p className="min-w-0 flex-1 pl-1 text-base font-bold leading-6 tracking-wide text-zinc-800">Manfaat &amp; Fitur Riset</p>
              <span className="w-24 shrink-0 text-center text-[13px] font-semibold leading-5 tracking-wide text-slate-500">Gratis</span>
              <span className="w-24 shrink-0 text-center">
                <span className="inline-block rounded-md bg-indigo-50/80 px-2 py-0.5 text-[13px] font-bold leading-5 tracking-wide text-blue-950">Plus</span>
              </span>
              <span className="w-24 shrink-0 text-center text-[13px] font-semibold leading-5 tracking-wide text-slate-700">Pro</span>
            </div>
            {premiumFeatures.map((feature, index) => (
              <div key={feature.title} className={`flex items-center gap-2.5 py-3 ${index > 0 ? "border-t border-slate-100" : ""}`}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-700" aria-hidden="true">
                  {premiumFeatureIcons[index]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold leading-[21px] text-slate-900">{feature.title}</p>
                  <p className="mt-0.5 text-[13px] font-medium leading-[18px] text-neutral-700">{feature.desc}</p>
                </div>
                <span className="flex w-24 shrink-0 items-center justify-center">
                  <UpgradePremiumCell value={feature.gratis} />
                </span>
                <span className="flex w-24 shrink-0 items-center justify-center">
                  <UpgradePremiumCell value={feature.plus} />
                </span>
                <span className="flex w-24 shrink-0 items-center justify-center">
                  <UpgradePremiumCell value={feature.pro} />
                </span>
              </div>
            ))}
            </div>
            <p className="flex items-center justify-center gap-1.5 pt-2.5 text-[11px] font-medium leading-4 text-slate-400">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2v8M3 7l3 3 3-3" />
              </svg>
              Geser untuk melihat {premiumFeatures.length - 3} fitur lainnya
            </p>
          </div>
        </div>

        <div className="flex shrink-0 justify-center border-t border-slate-100 bg-slate-50 px-8 py-4">
          <button
            type="button"
            onClick={() => {
              window.alert(`${activePlan.name} dipilih (${activePlan.price}).`);
              onClose();
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-5 py-3 text-xs font-bold leading-5 text-white shadow-sm hover:bg-sky-700 sm:w-96"
          >
            Pilih {activePlan.name} Sekarang ({activePlan.price})
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
  { title: "Akses Basis Data Terverifikasi", desc: "Index jurnal yang tervalidasi Alerin" },
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
          <h2 className="pt-1 text-center font-['Inter:Bold'] text-[20px] leading-7 text-slate-900">Upgrade ke Alerin Premium!</h2>
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

function JournalCard({
  journal,
  folders,
  onMove,
  onRemove,
  onSitasi,
  onAbstrak,
}: {
  journal: SavedJournal;
  folders: CollectionFolder[];
  onMove: (folderId: string) => void;
  onRemove: () => void;
  onSitasi: () => void;
  onAbstrak: () => void;
}) {
  const activeFolder = folders.find(folder => folder.id === journal.folderId);
  const [note, setNote] = useState(() => {
    try {
      return window.localStorage.getItem(`alerin-journal-note-${journal.id}`) ?? "";
    } catch {
      return "";
    }
  });
  return (
    <article className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-[#0066a1]">Artikel Jurnal</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{journal.year}</span>
        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs text-[#0066a1]">Akses Terbuka</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{journal.relevancy} relevan</span>
      </div>
      <h3 className="mt-4 font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold leading-6 text-[#0f172a]">{journal.title}</h3>
      <p className="mt-1 font-['Inter:Regular'] text-sm text-[#94a3b8]">{journal.authors}</p>
      <p className="mt-4 font-['Inter:Regular'] text-sm leading-6 text-[#64748b]">{journal.description}</p>
      {journal.id === "saved-1" && (
        <>
          <div className="mt-4 rounded-xl bg-[#eaf6ff] px-4 py-3 text-sm leading-6 text-[#475569]">
            <strong className="font-['Inter:Bold'] text-[#0066a1]">Alasan direkomendasikan:</strong> Cocok untuk memperkuat landasan teori dan hubungan antarvariabel.
          </div>
          <label className="mt-4 block min-h-24 cursor-text rounded-xl border border-slate-200 bg-[#f1f5f9] p-4 transition-colors focus-within:border-sky-300 focus-within:bg-white">
            <span className="block font-['Plus_Jakarta_Sans:Bold'] text-base font-bold text-[#1e293b]">Catatan Pribadi</span>
            <textarea
              value={note}
              onChange={event => {
                setNote(event.target.value);
                try {
                  window.localStorage.setItem(`alerin-journal-note-${journal.id}`, event.target.value);
                } catch {
                  /* ignore storage errors */
                }
              }}
              placeholder="Kamu bisa menuliskan catatan pribadi di sini..."
              aria-label={`Catatan pribadi ${journal.title}`}
              className="mt-2 block min-h-14 w-full resize-none bg-transparent text-sm leading-6 text-[#475569] outline-none placeholder:text-[#94a3b8]"
            />
          </label>
        </>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-100 pt-4">
        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
        <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Lihat detail</button>
        <button
          type="button"
          onClick={onSitasi}
          className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold leading-5 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200"
        >
          Buat sitasi
        </button>
        <button
          type="button"
          onClick={onAbstrak}
          className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold leading-5 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200"
        >
          Abstrak
        </button>
        <button
          type="button"
          onClick={() => window.open("https://doi.org/10.1016/j.jretconser.2020.102345", "_blank", "noopener,noreferrer")}
          className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold leading-5 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200"
        >
          DOI
        </button>
        <button
          type="button"
          onClick={() => window.alert("PDF dibuka.")}
          className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold leading-5 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200"
        >
          Buka PDF
        </button>
        <label className="relative flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
          <span className="pointer-events-none max-w-24 truncate font-semibold text-slate-700">{activeFolder?.name ?? "Belum dikelompokkan"}</span>
          <select
            aria-label="Pindahkan jurnal ke folder"
            value={journal.folderId}
            onChange={event => onMove(event.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
          >
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
          <img src={`${collectionAssets}/b80d5.svg`} alt="" />
        </label>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Hapus dari koleksi"
          title="Hapus dari koleksi"
          className="flex shrink-0 items-center justify-center rounded-lg bg-white px-3.5 py-2.5 text-[#bd3434] outline outline-1 outline-offset-[-1px] outline-rose-200 transition-colors hover:bg-rose-50"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
            <path d="M6.5 7v4M9.5 7v4" />
          </svg>
        </button>
      </div>
    </article>
  );
}

function ActionResultIcon({ label }: { label: string }) {
  const shared = {
    width: 14,
    height: 14,
    viewBox: "0 0 13 13",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (label === "Buat sitasi") {
    return (
      <svg {...shared}>
        <path d="M2 3.1c1.7-.9 3.3-.9 4.5 0v7.8c-1.2-.9-2.8-.9-4.5 0z" />
        <path d="M11 3.1c-1.7-.9-3.3-.9-4.5 0v7.8c1.2-.9 2.8-.9 4.5 0z" />
      </svg>
    );
  }

  if (label === "Abstrak") {
    return (
      <svg {...shared}>
        <rect x="2.5" y="1.5" width="8" height="10" rx="1.6" />
        <path d="M4.7 4.4h3.6M4.7 6.5h3.6M4.7 8.6h2.3" />
      </svg>
    );
  }

  if (label === "DOI") {
    return (
      <svg {...shared}>
        <circle cx="6.5" cy="6.5" r="5" />
        <path d="M1.5 6.5h10M6.5 1.5c1.6 1.8 1.6 8.2 0 10M6.5 1.5c-1.6 1.8-1.6 8.2 0 10" />
      </svg>
    );
  }

  return (
    <svg {...shared}>
      <path d="M7.3 1.5H4.1a1.6 1.6 0 00-1.6 1.6v6.8a1.6 1.6 0 001.6 1.6h4.8a1.6 1.6 0 001.6-1.6V4.7z" />
      <path d="M7.3 1.5v3.2h3.2" />
    </svg>
  );
}

function RelevancyRing({ value }: { value: string }) {
  const parsed = Number.parseInt(value, 10);
  const percent = Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : 0;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percent / 100);

  return (
    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 80 80"
        fill="none"
        role="img"
        aria-label={`Relevansi ${percent}%`}
      >
        <circle cx="40" cy="40" r={radius} stroke="#e0f2fe" strokeWidth="5" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#0369a1"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="text-xl font-extrabold leading-6 tracking-[-0.4px] text-[#0369a1]">{value}</span>
    </div>
  );
}

function DesktopJournalResultCard({
  relevancy,
  onAnalisis,
  onSitasi,
  onAbstrak,
  journal,
  saved = false,
  onToggleSave,
}: {
  relevancy: string;
  onAnalisis?: () => void;
  onSitasi?: () => void;
  onAbstrak?: () => void;
  journal?: (typeof desktopResultJournals)[number];
  saved?: boolean;
  onToggleSave?: () => void;
}) {
  const detail = desktopResultDetails.find(item => item.id === journal?.id) ?? desktopResultDetails[0];
  const actionButtons = ["Buat sitasi", "Abstrak", "Buka PDF"];

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-2 outline-offset-[-2px] outline-sky-100">
      <div className="flex flex-col gap-3 px-6 py-6">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-sm bg-sky-700 px-2 py-0.5 text-xs font-bold leading-4 text-white">{detail.rank}</span>
          {detail.badges.map(badge => (
            <span
              key={badge.label}
              className={
                badge.tone === "sky"
                  ? "rounded-sm bg-sky-100 px-2 py-0.5 text-xs font-bold leading-4 text-sky-600"
                  : "rounded-sm bg-slate-100 px-2 py-0.5 text-xs font-semibold leading-4 text-slate-700"
              }
            >
              {badge.label}
            </span>
          ))}
        </div>

        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold leading-7 text-slate-900">{journal?.title}</h3>
            <p className="pt-1 text-xs font-medium leading-4 text-slate-600">{journal?.authors}</p>
            <p className="pt-0.5 text-xs leading-4 text-slate-500">{detail.source}</p>
          </div>
          <div className="flex w-28 shrink-0 flex-col items-center">
            <RelevancyRing value={relevancy} />

            <span className="pt-1 text-xs font-semibold leading-4 text-slate-500">Relevansi</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-1 min-[1180px]:flex-row">
          <div className="min-w-0 flex-1 rounded-xl bg-sky-50/30 p-4 outline outline-1 outline-offset-[-1px] outline-sky-100">
            <h4 className="text-xs font-bold leading-4 text-slate-900">Mengapa jurnal ini direkomendasikan?</h4>
            <div className="flex flex-col gap-2 pt-3">
              {detail.fitBars.map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1">
                  <div className="flex items-start justify-between text-xs leading-4">
                    <span className="font-semibold text-slate-600">{label}</span>
                    <span className="font-bold text-sky-600">{value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200">
                    <div className="h-1.5 rounded-full bg-sky-600" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 rounded-lg bg-[#f1f5f9] p-2.5 text-xs font-bold leading-4 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200">
              Kutipan relevan: &ldquo;{detail.quote}&rdquo;
            </p>
          </div>
          <div className="w-full shrink-0 rounded-xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-slate-200 min-[1180px]:w-[320px] min-[1180px]:self-start">
            <h4 className="text-center text-base font-extrabold leading-5 text-slate-900">Kredibilitas</h4>
            <ul className="mt-1 flex flex-col">
              {detail.credibility.map(([title, desc]) => (
                <li key={title} className="flex items-start gap-2.5 py-2.5">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true">
                    <path d="M2.5 8.5l3.5 3.5 7.5-8" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-4 text-slate-800">{title}</p>
                    {title === "DOI terverifikasi" ? (
                      <a
                        href={detail.doiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block pt-0.5 text-xs leading-4 text-sky-600 underline underline-offset-2 hover:text-sky-700"
                      >
                        {desc}
                      </a>
                    ) : (
                      <p className="pt-0.5 text-xs leading-4 text-slate-500">{desc}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-r-xl border-l-4 border-sky-600 bg-sky-50/70 px-4 pb-4 pt-6">
          <p className="text-xs font-bold leading-4 text-sky-600">RINGKASAN UTAMA</p>
          <p className="pt-1.5 text-xs leading-5 text-slate-700">{detail.summary}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onAnalisis}
            className="flex items-center gap-1.5 rounded-lg bg-[#0369a1] px-4 py-2 text-sm font-semibold leading-5 text-white"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <path d="M6.2 1.6l1.1 2.7 2.7 1.1-2.7 1.1-1.1 2.7-1.1-2.7L2.4 5.4l2.7-1.1z" />
              <path d="M10.6 7.7l.6 1.5 1.5.6-1.5.6-.6 1.5-.6-1.5-1.5-.6 1.5-.6z" />
            </svg>
            Analisis lengkap
          </button>
          {actionButtons.map(label => (
            <button
              key={label}
              type="button"
              onClick={
                label === "Buat sitasi"
                  ? onSitasi
                  : label === "Abstrak"
                    ? onAbstrak
                    : label === "DOI"
                      ? () => window.open(detail.doiUrl, "_blank", "noopener,noreferrer")
                      : () => window.alert(detail.pdfNote)
              }
              className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold leading-5 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200"
            >
              <ActionResultIcon label={label} />
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={journal ? onToggleSave : undefined}
            aria-pressed={saved}
            className={`ml-auto flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold leading-5 outline outline-1 outline-offset-[-1px] transition-colors ${
              saved ? "bg-sky-50 text-sky-700 outline-sky-200" : "bg-white text-slate-700 outline-slate-200"
            }`}
          >
            <svg
              width="13"
              height="15"
              viewBox="0 0 12 14"
              fill={saved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 1.5h8v11l-4-2.5-4 2.5v-11z" />
            </svg>
            {saved ? "Tersimpan" : "Simpan"}
          </button>
        </div>
      </div>
    </article>
  );
}

function RingkasanJurnalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<number[]>([0, 1]);
  if (!open) return null;

  const mainSummary =
    "Penelitian ini menunjukkan bahwa interaksi parasosial antara host dan penonton dapat membangun kepercayaan. Ketika interaksi tersebut disertai pesan kelangkaan berupa batas waktu atau stok, niat beli konsumen pada live streaming commerce meningkat.";

  const points = [
    {
      title: "Tujuan penelitian",
      hint: "Fokus dan sasaran penelitian",
      desc: "Menguji pengaruh interaksi parasosial dan dorongan kelangkaan terhadap niat pembelian konsumen dalam konteks live streaming commerce.",
    },
    {
      title: "Metode penelitian",
      hint: "Kuantitatif survei & analisis SEM-PLS",
      desc: "Pendekatan kuantitatif menggunakan survei cross-sectional. Hubungan antarvariabel dianalisis menggunakan metode SEM-PLS.",
    },
    {
      title: "Temuan utama",
      hint: "Hasil utama penelitian",
      desc: "Interaksi parasosial meningkatkan kepercayaan kepada host, sedangkan kelangkaan memperkuat urgensi yang mendorong keputusan pembelian.",
    },
    {
      title: "Relevansi untuk penelitianmu",
      hint: "Landasan hipotesis & teori variabel",
      desc: "Dapat digunakan untuk landasan teori, penyusunan hipotesis, pemilihan variabel, serta pembanding penelitian perilaku konsumen digital.",
    },
    {
      title: "Keterbatasan penelitian",
      hint: "Data satu periode survei",
      desc: "Data dikumpulkan pada satu periode sehingga belum menjelaskan perubahan perilaku konsumen dalam jangka panjang.",
    },
    {
      title: "Saran penggunaan",
      hint: "Cek metode & verifikasi sumber asli",
      desc: "Baca bagian metode dan hasil asli sebelum mengutip. Sesuaikan penerapan temuan dengan konteks objek dan wilayah penelitianmu.",
    },
  ];

  const copySummary = () => {
    const text = [`Ringkasan utama\n${mainSummary}`, ...points.map((point, index) => `${index + 1}. ${point.title}\n${point.desc}`)].join("\n\n");
    try {
      void navigator.clipboard.writeText(text);
    } catch {
      window.alert("Ringkasan berhasil disalin.");
      return;
    }
    window.alert("Ringkasan berhasil disalin.");
  };

  const togglePoint = (index: number) => {
    setExpanded(current => (current.includes(index) ? current.filter(item => item !== index) : [...current, index]));
  };

  return (
    <div
      className="fixed inset-0 z-[340] flex items-end justify-center bg-slate-900/50 backdrop-blur-[2px] md:items-center md:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ringkasan Jurnal"
        onClick={event => event.stopPropagation()}
        className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[32px] bg-white shadow-[0px_25px_60px_-15px_rgba(0,0,0,0.30)] md:max-h-[calc(100vh-32px)] md:w-[820px] md:max-w-full md:rounded-3xl md:outline md:outline-1 md:outline-offset-[-1px] md:outline-slate-100"
      >
        <div className="flex shrink-0 justify-center pb-1 pt-3 md:hidden">
          <span className="h-1.5 w-16 rounded-full bg-slate-300/80" aria-hidden="true" />
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-100 px-6 pb-4 pt-2 md:px-7 md:pb-4 md:pt-6">
          <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-xl font-bold leading-7 text-slate-900 md:text-xl md:leading-8">Ringkasan Jurnal</h2>
          <button
            type="button"
            aria-label="Tutup ringkasan"
            onClick={onClose}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-slate-200/80 transition-colors hover:bg-slate-50 md:h-8 md:w-8 md:outline-slate-200/90"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M2.5 2.5l9 9M11.5 2.5l-9 9" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:max-h-[70vh] md:p-7">
          <div className="flex flex-col gap-2 rounded-2xl border-l-4 border-sky-600 bg-sky-50/70 px-5 py-5 md:gap-1.5 md:rounded-xl md:bg-blue-50 md:pl-5 md:pr-6">
            <p className="font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold leading-5 text-slate-900 md:text-sm md:font-extrabold md:leading-5">Ringkasan utama</p>
            <p className="font-['Plus_Jakarta_Sans:Regular'] text-[13px] leading-6 text-slate-700 md:text-sm md:font-medium md:leading-5">{mainSummary}</p>
          </div>

          <div className="mt-5 flex flex-col gap-3 md:mt-4 md:grid md:grid-cols-2 md:gap-3">
            {points.map((point, index) => {
              const isOpen = expanded.includes(index);
              return (
                <div
                  key={point.title}
                  className={`overflow-hidden rounded-3xl bg-white outline outline-1 outline-offset-[-1px] md:flex md:flex-col md:gap-2 md:rounded-xl md:p-4 md:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.02)] ${
                    isOpen
                      ? "shadow-[0px_1px_2px_0px_rgba(0,0,0,0.03)] outline-sky-500/60 md:outline-slate-200/80"
                      : "outline-slate-200 md:outline-slate-200/80"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => togglePoint(index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-3 p-4 text-left md:pointer-events-none md:p-0"
                  >
                    <span className="flex min-w-0 items-center gap-3.5 md:gap-2">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full md:h-5 md:w-5 ${
                          isOpen ? "bg-sky-600 text-white md:bg-sky-100 md:text-sky-700" : "bg-sky-100 text-sky-700"
                        }`}
                      >
                        <span className="font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold leading-5 md:text-xs md:leading-4">{index + 1}</span>
                      </span>
                      <span className="min-w-0">
                        <span className="block font-['Plus_Jakarta_Sans:Bold'] text-[15px] font-bold leading-5 text-slate-900 md:text-sm md:leading-5">{point.title}</span>
                        {!isOpen && <span className="mt-0.5 block truncate text-xs leading-4 text-slate-400 md:hidden">{point.hint}</span>}
                      </span>
                    </span>
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full md:hidden ${isOpen ? "bg-sky-50" : ""}`}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke={isOpen ? "#0284c7" : "#94a3b8"}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className={isOpen ? "" : "-rotate-90"}
                      >
                        <path d="M3 5.5l4 4 4-4" />
                      </svg>
                    </span>
                  </button>
                  <div className={`px-4 pb-4 pl-[60px] pr-4 md:block md:px-0 md:pb-0 md:pl-7 ${isOpen ? "block" : "hidden"}`}>
                    <p className="font-['Plus_Jakarta_Sans:Regular'] text-[13px] leading-6 text-slate-600 md:text-xs md:font-medium md:leading-5">{point.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl bg-slate-100/90 px-5 py-4 md:hidden">
            <p className="text-center text-xs font-semibold leading-5 text-slate-500">
              <span className="text-slate-700">Catatan:</span> Ringkasan Alerin membantu memahami isi secara cepat, namun tetap disarankan memverifikasi kutipan langsung dari manuskrip asli.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 border-t border-slate-100 bg-white px-6 pb-6 pt-4 md:justify-end md:px-7 md:py-4">
          <button
            type="button"
            onClick={copySummary}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold leading-5 text-slate-800 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.03)] outline outline-1 outline-offset-[-1px] outline-slate-200 transition-colors hover:bg-slate-50 md:h-10 md:w-48 md:flex-none"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0f172a" strokeWidth="1.3" aria-hidden="true">
              <rect x="5" y="5.5" width="8" height="8.2" rx="1.5" />
              <rect x="2" y="2" width="8" height="8.2" rx="1.5" />
            </svg>
            Salin
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-xl bg-sky-700 text-sm font-bold leading-5 text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-sky-800 md:h-10 md:w-auto md:flex-none md:px-6 md:py-2.5 md:font-semibold"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

function TabelPenelitianModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [fullTable, setFullTable] = useState(false);
  if (!open) return null;

  const headers = ["No.", "Penelitian", "Variabel penelitian", "Metode penelitian", "Hasil penelitian", "Persamaan dan perbedaan"];

  const tableRows = [
    {
      study: "Peneliti A (2021)",
      subtitle: "Pengaruh Literasi Keuangan terhadap Perilaku Pengelolaan Keuangan pada Pelaku UMKM",
      variabel: "Independen (X): literasi keuangan. Dependen (Y): perilaku pengelolaan keuangan, mencakup pemahaman konsep keuangan, pengelolaan pendapatan, tabungan, pinjaman, dan pengambilan keputusan.",
      metode: "Kuantitatif dengan metode survei; data kuesioner pelaku UMKM; analisis regresi linear sederhana.",
      hasil: "Literasi keuangan berpengaruh positif terhadap perilaku pengelolaan keuangan: pelaku usaha lebih mampu menyusun anggaran, mengendalikan pengeluaran, dan mengambil keputusan secara terencana.",
      perbedaan: "Sama-sama menempatkan literasi keuangan sebagai independen dan perilaku pengelolaan keuangan sebagai dependen. Perbedaannya, penelitian terdahulu hanya memakai satu variabel independen, sedangkan penelitian baru menambahkan sikap keuangan.",
    },
    {
      study: "Peneliti B (2021)",
      subtitle: "Pengaruh Sikap Keuangan terhadap Perilaku Pengelolaan Keuangan",
      variabel: "Independen: sikap keuangan (cara pandang terhadap uang, orientasi masa depan, kedisiplinan, dan pertimbangan keputusan). Dependen: perilaku pengelolaan keuangan.",
      metode: "Kuantitatif dengan pendekatan survei; kuesioner pelaku UMKM; analisis regresi untuk menguji hubungan antarvariabel.",
      hasil: "Perencanaan dan kedisiplinan keuangan mendorong individu mengatur pengeluaran, mempertimbangkan kebutuhan sebelum membeli, serta mengelola dana usaha lebih bertanggung jawab.",
      perbedaan: "Persamaannya pada penggunaan sikap keuangan. Perbedaannya, penelitian baru menambahkan literasi keuangan serta berbeda dalam lokasi, karakteristik responden, dan indikator pengukuran.",
    },
    {
      study: "Peneliti C (2022)",
      subtitle: "Hubungan Literasi Keuangan dengan Pengelolaan Keuangan pada Usaha Mikro",
      variabel: "Independen: literasi keuangan. Dependen: pengelolaan keuangan usaha (pencatatan transaksi, pengelolaan modal, penganggaran, dan pemisahan keuangan pribadi dari usaha).",
      metode: "Kuantitatif dengan desain survei terhadap pelaku usaha mikro; kuesioner dan analisis statistik.",
      hasil: "Literasi keuangan berkorelasi positif dengan kemampuan mengelola keuangan usaha, meski juga dipengaruhi pengalaman usaha dan ketersediaan sistem pencatatan.",
      perbedaan: "Fokus pada usaha mikro dan praktik pencatatan. Penelitian baru memperluas unit analisis ke UMKM serta menambahkan sikap keuangan sebagai variabel independen.",
    },
    {
      study: "Peneliti D (2022)",
      subtitle: "Pengaruh Sikap Keuangan dan Pendapatan terhadap Perilaku Pengelolaan Keuangan",
      variabel: "Independen: sikap keuangan dan pendapatan. Dependen: perilaku pengelolaan keuangan.",
      metode: "Kuantitatif dengan metode survei; kuesioner; regresi linear berganda secara parsial dan simultan.",
      hasil: "Sikap keuangan yang mendukung perencanaan mendorong kedisiplinan pengelolaan uang, sedangkan tingkat pendapatan memengaruhi kemampuan memenuhi kebutuhan, menabung, dan mengalokasikan dana.",
      perbedaan: "Persamaannya pada sikap keuangan sebagai independen. Perbedaannya, penelitian terdahulu memakai pendapatan sebagai variabel tambahan, sedangkan penelitian baru memakai literasi keuangan.",
    },
    {
      study: "Peneliti E (2022)",
      subtitle: "Pengaruh Pengetahuan Keuangan dan Literasi Keuangan terhadap Pengelolaan Keuangan UMKM",
      variabel: "Independen: pengetahuan keuangan dan literasi keuangan. Dependen: pengelolaan keuangan UMKM.",
      metode: "Kuantitatif dengan regresi linear berganda untuk menguji pengaruh masing-masing variabel dan pengaruh keduanya secara bersama-sama.",
      hasil: "Pengetahuan dan literasi keuangan mendukung pengambilan keputusan, namun pengetahuan saja belum tentu menghasilkan pengelolaan yang baik bila tidak diterapkan secara konsisten.",
      perbedaan: "Penelitian terdahulu memakai pengetahuan keuangan, sedangkan penelitian baru memakai sikap keuangan sebagai variabel independen kedua; definisi operasional hasil yang diukur juga disesuaikan.",
    },
    {
      study: "Peneliti F (2023)",
      subtitle: "Pengaruh Literasi Keuangan dan Pengalaman Usaha terhadap Perilaku Keuangan Pelaku UMKM",
      variabel: "Independen: literasi keuangan dan pengalaman usaha (lama menjalankan usaha). Dependen: perilaku keuangan.",
      metode: "Kuantitatif dengan pendekatan survei; kuesioner pelaku UMKM; regresi linear berganda.",
      hasil: "Pemahaman keuangan membantu menilai pilihan keuangan, sedangkan pengalaman usaha memberi pembelajaran praktis dalam mengelola modal, menghadapi perubahan pendapatan, dan mengendalikan risiko.",
      perbedaan: "Persamaannya pada literasi keuangan sebagai independen. Perbedaannya, penelitian terdahulu memakai pengalaman usaha, sedangkan penelitian baru memakai sikap keuangan.",
    },
    {
      study: "Peneliti G (2023)",
      subtitle: "Pengaruh Sikap Keuangan dan Locus of Control terhadap Perilaku Pengelolaan Keuangan",
      variabel: "Independen: sikap keuangan dan locus of control (keyakinan atas kendali hasil). Dependen: perilaku pengelolaan keuangan.",
      metode: "Kuantitatif dengan metode survei; kuesioner untuk mengukur sikap keuangan, locus of control, dan perilaku pengelolaan keuangan; regresi linear berganda.",
      hasil: "Individu dengan sikap positif terhadap perencanaan dan rasa tanggung jawab atas keputusannya lebih terdorong mengendalikan pengeluaran dan mengevaluasi penggunaan dana secara teratur.",
      perbedaan: "Persamaannya pada sikap keuangan dan perilaku pengelolaan keuangan. Perbedaannya, penelitian terdahulu memakai locus of control, sedangkan penelitian baru memakai literasi keuangan sebagai independen kedua.",
    },
    {
      study: "Peneliti H (2024)",
      subtitle: "Pengaruh Literasi Keuangan dan Sikap Keuangan terhadap Pengelolaan Keuangan Pelaku UMKM",
      variabel: "Independen: literasi keuangan (pemahaman konsep) dan sikap keuangan (kecenderungan merencanakan serta menggunakan dana). Dependen: pengelolaan keuangan UMKM.",
      metode: "Kuantitatif; kuesioner disusun berdasarkan indikator tiap variabel; regresi linear berganda secara parsial dan simultan.",
      hasil: "Literasi keuangan berkaitan dengan pemahaman konsep keuangan, sedangkan sikap keuangan berhubungan dengan penerapan perencanaan dan disiplin keuangan; besaran pengaruh mengacu hasil analisis aktual.",
      perbedaan: "Model variabelnya paling serupa. Penelitian baru perlu menunjukkan perbedaan lokasi penelitian, karakteristik responden, periode pengumpulan data, indikator, dan definisi operasional variabel dependen.",
    },
    {
      study: "Peneliti I (2024)",
      subtitle: "Pengaruh Pengetahuan Keuangan terhadap Perilaku Keuangan Pelaku Usaha Mikro dan Kecil",
      variabel: "Independen: pengetahuan keuangan (pemahaman dasar keuangan dan penerapannya pada penganggaran, pengeluaran, tabungan, serta keputusan usaha). Dependen: perilaku keuangan.",
      metode: "Kuantitatif dengan metode survei; data primer kuesioner pelaku usaha mikro dan kecil; analisis statistik berdasarkan indikator yang ditentukan peneliti.",
      hasil: "Pemahaman pengelolaan dana membantu merencanakan kebutuhan, mengatur arus kas, dan menilai konsekuensi keputusan keuangan; penerapannya juga dipengaruhi kebiasaan, sikap, dan kondisi usaha.",
      perbedaan: "Penelitian terdahulu hanya memakai pengetahuan keuangan, sedangkan penelitian baru menambahkan literasi keuangan dan sikap keuangan.",
    },
    {
      study: "Peneliti J (2025)",
      subtitle: "Analisis Faktor-Faktor yang Memengaruhi Perilaku Pengelolaan Keuangan pada Pelaku UMKM",
      variabel: "Independen: literasi keuangan, sikap keuangan, dan pengalaman usaha (aspek pemahaman, kecenderungan keputusan, dan pembelajaran praktis). Dependen: perilaku pengelolaan keuangan.",
      metode: "Kuantitatif dengan desain survei; kuesioner pelaku UMKM; regresi linear berganda untuk menilai pengaruh setiap variabel dan kemampuan model menjelaskan variasi dependen.",
      hasil: "Ketiga faktor dikaji bersama-sama untuk menjelaskan perilaku pengelolaan keuangan; faktor paling berpengaruh hanya dapat ditetapkan setelah koefisien regresi dan uji signifikansi diperiksa.",
      perbedaan: "Persamaannya pada literasi keuangan dan sikap keuangan untuk menjelaskan perilaku pengelolaan keuangan UMKM. Perbedaannya, penelitian terdahulu memasukkan pengalaman usaha sebagai variabel tambahan, sedangkan penelitian baru berfokus pada wilayah tertentu.",
    },
  ];

  const copyTable = () => {
    const text = [
      headers.join("\t"),
      ...tableRows.map((row, index) =>
        [index + 1, `${row.study} — ${row.subtitle}`, row.variabel, row.metode, row.hasil, row.perbedaan].join("\t"),
      ),
    ].join("\n");
    try {
      void navigator.clipboard.writeText(text);
    } catch {
      window.alert("Tabel berhasil disalin.");
      return;
    }
    window.alert("Tabel berhasil disalin.");
  };

  const closeTable = () => {
    setFullTable(false);
    onClose();
  };

  const columnWidths = ["w-[5%]", "w-[19%]", "w-[20%]", "w-[17%]", "w-[20%]", "w-[19%]"];

  return (
    <div className="fixed inset-0 z-[340] bg-black/30" onClick={closeTable} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tabel penelitian terdahulu"
        onClick={event => event.stopPropagation()}
        className={`absolute inset-x-0 bottom-0 flex w-full flex-col overflow-hidden bg-white shadow-2xl ${
          fullTable ? "top-0 h-[100dvh] max-h-none rounded-none" : "h-[94dvh] max-h-[97dvh] rounded-t-[43.42px]"
        } md:inset-auto md:left-1/2 md:top-1/2 md:h-auto md:max-h-[calc(100vh-48px)] md:w-[1140px] md:max-w-[calc(100vw-32px)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:outline md:outline-1 md:outline-offset-[-1px] md:outline-slate-100`}
      >
        <div className={`flex shrink-0 justify-center pb-1.5 pt-5 md:hidden ${fullTable ? "hidden" : ""}`}>
          <span className="h-1.5 w-16 rounded-full bg-slate-300" aria-hidden="true" />
        </div>

        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 pb-4 pl-6 pr-5 pt-2 md:border-b-0 md:gap-4 md:px-8 md:pb-4 md:pt-7">
          <div>
            <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-xl font-bold leading-7 text-slate-900 md:text-2xl md:leading-8">Tabel penelitian terdahulu</h2>
            <p className="font-['Plus_Jakarta_Sans:Regular'] pt-1 text-xs font-normal leading-5 text-slate-500 md:text-sm">
              Perbandingan jurnal yang direkomendasikan Alerin berdasarkan topik penelitianmu
            </p>
          </div>
          <button
            type="button"
            aria-label="Tutup tabel"
            onClick={closeTable}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 transition-colors hover:bg-slate-50 md:h-10 md:w-10 md:rounded-xl"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M2.5 2.5l9 9M11.5 2.5l-9 9" />
            </svg>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5 md:px-8 md:py-4">
          <div className="hidden rounded-xl bg-sky-50 px-4 py-3.5 outline outline-1 outline-offset-[-1px] outline-blue-100 md:block">
            <p className="font-['Plus_Jakarta_Sans:Medium'] text-sm font-medium leading-5 text-cyan-900">
              Gunakan kolom &ldquo;Persamaan dan Perbedaan&rdquo; untuk menemukan kebaruan penelitian. Periksa jurnal aslinya sebelum memasukkan data ke
              dalam karya ilmiah.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 md:hidden">
            <p className="text-sm leading-5 text-slate-600">Seluruh kolom ditampilkan dalam satu tampilan.</p>
            <div className="flex shrink-0 items-center gap-2.5">
              <span className="text-sm font-semibold text-sky-600">{tableRows.length} Jurnal</span>
              <button
                type="button"
                onClick={() => setFullTable(value => !value)}
                aria-pressed={fullTable}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                {fullTable ? (
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 2v4H2M10 2v4h4M6 14v-4H2M10 14v-4h4" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" />
                  </svg>
                )}
                {fullTable ? "Perkecil" : "Layar penuh"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl outline outline-1 outline-offset-[-1px] outline-slate-200/80 md:rounded-2xl">
            <table className="w-[760px] table-fixed border-collapse text-left md:w-full">
              <thead>
                <tr className="bg-slate-50/90">
                  {headers.map((header, index) => (
                    <th
                      key={header}
                      className={`${columnWidths[index]} border-b border-slate-200/90 bg-slate-50/90 px-2 py-3 text-[12px] font-bold leading-5 text-slate-600 md:px-3 md:text-xs md:leading-5 ${
                        header === "Persamaan dan perbedaan" ? "bg-amber-50/40 text-amber-900" : ""
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, index) => (
                  <tr key={row.study} className={index === 0 ? "" : "border-t border-slate-100"}>
                    <td className="px-2 py-3 align-top text-[12px] font-bold leading-5 text-slate-800 md:px-3 md:text-xs md:leading-5">{index + 1}</td>
                    <td className="px-2 py-3 align-top md:px-3">
                      <p className="text-[13px] font-bold leading-5 text-slate-900 md:text-xs md:leading-5">{row.study}</p>
                      <p className="pt-1 text-[11px] font-normal leading-4 text-slate-500 md:text-[11px] md:leading-4">{row.subtitle}</p>
                    </td>
                    <td className="px-2 py-3 align-top text-[12px] font-normal leading-5 text-slate-700 md:px-3 md:text-xs md:leading-5">{row.variabel}</td>
                    <td className="px-2 py-3 align-top text-[12px] font-normal leading-5 text-slate-700 md:px-3 md:text-xs md:leading-5">{row.metode}</td>
                    <td className="px-2 py-3 align-top text-[12px] font-normal leading-5 text-slate-700 md:px-3 md:text-xs md:leading-5">{row.hasil}</td>
                    <td className="bg-amber-50/40 px-2 py-3 align-top text-[12px] font-normal leading-5 text-slate-700 md:px-3 md:text-xs md:leading-5">{row.perbedaan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 border-t border-slate-100 bg-white px-5 pb-5 pt-4 md:justify-end md:px-8 md:py-6">
            <button
              type="button"
              onClick={copyTable}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold leading-5 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200 transition-colors hover:bg-slate-50 md:order-1 md:flex-none md:rounded-xl md:px-5 md:py-2.5"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
                <path d="M10.5 5.5v-1a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1" />
              </svg>
              Salin tabel
            </button>
            <button
              type="button"
              onClick={closeTable}
              className="flex-1 rounded-2xl bg-sky-700 py-4 text-sm font-bold leading-5 text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-sky-800 md:order-2 md:w-auto md:flex-none md:rounded-xl md:px-7 md:py-2.5 md:text-sm md:font-semibold"
            >
              Selesai
            </button>
        </div>
      </div>
    </div>
  );
}

function BuatSitasiModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeStyle, setActiveStyle] = useState<"apa" | "mla" | "chicago" | "harvard" | "bibtex">("apa");
  if (!open) return null;

  const doi = "https://doi.org/10.1108/APJML-03-2022-0214";
  const journal = "Asia Pacific Journal of Marketing and Logistics";
  const title = "Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges";
  const bibtex = `@article{wongkitrungrueng2023live,
  title={${title}},
  author={Wongkitrungrueng, A. and Assarut, N.},
  journal={${journal}},
  volume={40},
  number={3},
  pages={341--362},
  year={2023},
  doi={10.1108/APJML-03-2022-0214}
}`;

  const styles: Record<"apa" | "mla" | "chicago" | "harvard" | "bibtex", { label: string; before: string; after: string }> = {
    apa: {
      label: "APA",
      before: "Wongkitrungrueng, A., & Assarut, N. (2023). " + title + ". ",
      after: ".",
    },
    mla: {
      label: "MLA",
      before: "Wongkitrungrueng, A., and N. Assarut. \u201c" + title + ".\u201d ",
      after: ", vol. 40, no. 3, 2023, pp. 341\u2013362.",
    },
    chicago: {
      label: "Chicago",
      before: "Wongkitrungrueng, A., and Nopporn Assarut. \u201c" + title + ".\u201d ",
      after: " 40, no. 3 (2023): 341\u2013362.",
    },
    harvard: {
      label: "Harvard",
      before: "Wongkitrungrueng, A. and Assarut, N. (2023) \u2018" + title + "\u2019, ",
      after: ", 40(3), pp. 341\u2013362.",
    },
    bibtex: {
      label: "BibTeX",
      before: "",
      after: "",
    },
  };

  const active = styles[activeStyle];
  const plainText = activeStyle === "bibtex" ? bibtex : `${active.before}${journal}${active.after}\n${doi}`;

  const copyCitation = () => {
    try {
      void navigator.clipboard.writeText(plainText);
    } catch {
      window.alert("Teks sitasi berhasil disalin.");
      return;
    }
    window.alert("Teks sitasi berhasil disalin.");
  };

  return (
    <div className="fixed inset-0 z-[340] flex items-end justify-center bg-black/30 backdrop-blur-[2px] md:items-center md:p-4" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Buat sitasi jurnal"
        onClick={event => event.stopPropagation()}
        className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0px_20px_50px_0px_rgba(0,0,0,0.18)] md:max-h-[calc(100vh-32px)] md:w-[656px] md:max-w-full md:rounded-2xl md:pb-0 md:outline md:outline-1 md:outline-offset-[-1px] md:outline-slate-100"
      >
        <div className="flex shrink-0 justify-center pb-1 pt-3 md:hidden">
          <span className="h-1.5 w-16 rounded-full bg-slate-300" aria-hidden="true" />
        </div>

        <div className="flex items-center justify-between gap-3 px-6 pb-2 pt-2 md:px-7 md:pb-2 md:pt-6">
          <h2 className="font-['Inter:Bold'] text-xl font-bold leading-7 text-slate-900">Buat sitasi jurnal</h2>
          <button
            type="button"
            aria-label="Tutup sitasi"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 outline outline-1 outline-offset-[-1px] outline-slate-200 transition-colors hover:bg-slate-200 md:h-8 md:w-8 md:bg-transparent md:hover:bg-slate-50"
          >
            <svg width="12" height="12" viewBox="0 0 10 10" fill="none" stroke="#64748b" strokeWidth="1.47" strokeLinecap="round" aria-hidden="true">
              <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex shrink-0 gap-6 overflow-x-auto border-b border-slate-200 px-6 pt-3 [scrollbar-width:none] md:gap-7 md:overflow-x-visible md:px-7">
          {(Object.keys(styles) as Array<keyof typeof styles>).map(key => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveStyle(key)}
              aria-pressed={activeStyle === key}
              className={`shrink-0 border-b-[3px] pb-2.5 text-base leading-6 transition-colors md:text-sm md:leading-5 ${
                activeStyle === key
                  ? "border-sky-600 font-['Inter:Bold'] font-bold text-slate-900"
                  : "border-transparent font-['Inter:Medium'] font-medium text-slate-600 hover:text-slate-800"
              }`}
            >
              {styles[key].label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-3 pt-4 md:px-7 md:pb-2">
          {activeStyle === "bibtex" ? (
            <div className="min-h-36 rounded-2xl bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.02)] outline outline-1 outline-offset-[-1px] outline-slate-200">
              <pre className="whitespace-pre-wrap font-['JetBrains_Mono:Medium'] text-[13px] leading-6 text-slate-800">{bibtex}</pre>
            </div>
          ) : (
            <div className="flex min-h-36 flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.02)] outline outline-1 outline-offset-[-1px] outline-slate-200">
              <p className="font-['Inter:Regular'] text-[16px] font-normal leading-8 text-slate-800 md:text-sm md:leading-6">
                {active.before}
                <span className="italic">{journal}</span>
                {active.after}
              </p>
              <a
                href={doi}
                target="_blank"
                rel="noreferrer"
                className="break-words font-['Inter:Regular'] text-[16px] font-normal leading-8 text-sky-600 underline hover:text-sky-700 md:text-sm md:leading-6"
              >
                {doi}
              </a>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-100 px-5 py-3 md:gap-3 md:border-0 md:px-7 md:pb-7 md:pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-base font-medium leading-5 text-slate-700 transition-colors hover:bg-slate-50 md:py-2 md:text-sm"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={copyCitation}
            className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-base font-semibold leading-5 tracking-tight text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-sky-700 md:py-2 md:text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
              <path d="M10.5 5.5v-1a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1" />
            </svg>
            Salin teks
          </button>
        </div>

        <div className="flex shrink-0 justify-center pb-2 pt-1 md:hidden">
          <span className="h-1.5 w-32 rounded-full bg-slate-300/80" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function AbstrakJurnalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [language, setLanguage] = useState<"id" | "original">("id");
  if (!open) return null;

  const abstracts: Record<"id" | "original", { label: string; text: string }> = {
    id: {
      label: "Bahasa Indonesia",
      text: "Penelitian ini mengkaji bagaimana interaksi parasosial antara pembawa acara dan penonton memengaruhi niat pembelian pada perdagangan melalui siaran langsung. Hasil menunjukkan bahwa kepercayaan kepada pembawa acara menjadi mekanisme penting, sementara pesan kelangkaan\u2014seperti keterbatasan stok dan waktu\u2014memperkuat urgensi untuk membeli. Temuan menegaskan bahwa kualitas hubungan sosial yang dirasakan konsumen dan desain pesan promosi perlu dipertimbangkan secara bersamaan.",
    },
    original: {
      label: "Bahasa asli jurnal",
      text: "This study examines how parasocial interaction between hosts and viewers influences purchase intention in live streaming commerce. The results show that trust in the host serves as a key mechanism, while scarcity messages, such as limited stock and time constraints, strengthen purchase urgency. The findings emphasize that consumers' perceived social relationship quality and promotional message design should be considered together.",
    },
  };

  const active = abstracts[language];
  const abstractTitle = "Live Streaming Commerce and Mimic Purchase Intention";

  const copyAbstract = () => {
    const text = `${abstractTitle}\n\n${active.text}`;
    try {
      void navigator.clipboard.writeText(text);
    } catch {
      window.alert("Abstrak berhasil disalin.");
      return;
    }
    window.alert("Abstrak berhasil disalin.");
  };

  return (
    <div className="fixed inset-0 z-[340] flex items-end justify-center bg-black/30 backdrop-blur-[2px] md:items-center md:p-4" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Abstrak jurnal"
        onClick={event => event.stopPropagation()}
        className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0px_26.75px_53.5px_-12.84px_rgba(0,0,0,0.25)] md:max-h-[calc(100vh-32px)] md:w-[749px] md:max-w-full md:rounded-3xl md:pb-0 md:outline md:outline-1 md:outline-offset-[-1px] md:outline-slate-100"
      >
        <div className="flex shrink-0 justify-center pb-1 pt-3 md:hidden">
          <span className="h-1.5 w-16 rounded-full bg-slate-300" aria-hidden="true" />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-6 pb-4 pt-2 md:px-9 md:pb-9 md:pt-7">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-xl font-bold leading-7 text-slate-900 md:text-2xl md:leading-9">Abstrak jurnal</h2>
            <button
              type="button"
              aria-label="Tutup abstrak"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 p-2.5 outline outline-1 outline-offset-[-1px] outline-slate-200 transition-colors hover:bg-slate-200 md:h-8 md:w-8 md:rounded-xl md:bg-white md:hover:bg-slate-50"
            >
              <svg width="10" height="10" viewBox="0 0 8 8" fill="none" stroke="#475569" strokeWidth="1.57" strokeLinecap="round" aria-hidden="true">
                <path d="M1 1l6 6M7 1l-6 6" />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {(Object.keys(abstracts) as Array<keyof typeof abstracts>).map(key => (
              <button
                key={key}
                type="button"
                onClick={() => setLanguage(key)}
                aria-pressed={language === key}
                className={`rounded-full px-3.5 py-1.5 font-['Plus_Jakarta_Sans:Medium'] text-[13px] font-medium leading-5 transition-colors md:py-1 md:text-xs md:leading-4 ${
                  language === key ? "bg-sky-100/90 text-sky-800" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {abstracts[key].label}
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl bg-sky-50 px-5 pb-5 pt-6 outline outline-1 outline-offset-[-1px] outline-sky-100">
            <div className="flex flex-col gap-2.5 border-l-4 border-sky-600 pl-3.5">
              <p className="font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold leading-6 text-slate-900">{abstractTitle}</p>
              <p className="font-['Plus_Jakarta_Sans:Regular'] text-[15px] font-normal leading-7 text-slate-700 md:text-sm md:leading-6">{active.text}</p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 px-6 py-3 md:border-0 md:px-9 md:pb-9 md:pt-0">
          <button
            type="button"
            onClick={copyAbstract}
            className="rounded-xl bg-white px-5 py-2.5 text-[15px] font-semibold leading-5 text-slate-800 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-slate-300 transition-colors hover:bg-slate-50 md:text-sm"
          >
            Salin
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-sky-600 px-6 py-2.5 text-[15px] font-semibold leading-5 text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-sky-700 md:text-sm"
          >
            Selesai
          </button>
        </div>

        <div className="flex shrink-0 justify-center pb-2 pt-1 md:hidden">
          <span className="h-1.5 w-32 rounded-full bg-slate-300/80" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function DesktopSearchResults({
  query,
  onBack,
  savedIds,
  onToggleSave,
  onOpenRingkasan,
  onOpenTabel,
  onOpenSitasi,
  onOpenAbstrak,
  analysis = false,
  fileName = "",
}: {
  query: string;
  onBack: () => void;
  savedIds: string[];
  onToggleSave: (journal: (typeof desktopResultJournals)[number]) => void;
  onOpenRingkasan: () => void;
  onOpenTabel: () => void;
  onOpenSitasi: () => void;
  onOpenAbstrak: () => void;
  analysis?: boolean;
  fileName?: string;
}) {
  const [temuanNav, setTemuanNav] = useState(0);
  const temuan = temuanAnalisis[temuanNav % temuanAnalisis.length];

  const renderKutipan = (text: string) => {
    const parts = text.split(/(keputusan pembelian|seluruh kelompok usia)/g);
    return parts.map((part, index) =>
      part === "keputusan pembelian" || part === "seluruh kelompok usia" ? (
        <span key={index} className="border-b-2 border-red-500 font-medium">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="mx-auto hidden max-w-[1160px] md:block">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-['Inter:Bold'] text-2xl font-extrabold leading-8 text-slate-900">Rekomendasi yang paling relevan</h1>
        <button
          type="button"
          onClick={onBack}
          className="flex shrink-0 items-center gap-2 rounded-[10px] bg-sky-700 px-6 py-2 text-sm font-bold leading-4 text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
        >
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 6H2M5.5 2.5L2 6l3.5 3.5" />
          </svg>
          Kembali ke Pencarian
        </button>
      </div>

      <div className="mt-6 flex items-start gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {analysis && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                  <svg width="28" height="32" viewBox="0 0 14 16" fill="none" stroke="#64748b" strokeWidth="1.2" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 1.5h6l4 4v9H2z" />
                    <path d="M8 1.5v4h4" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold leading-5 text-slate-800">{fileName || "Skripsi_Nadia_Final.docx"}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-medium leading-4 text-sky-700">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <rect x="1.5" y="1.5" width="11" height="11" rx="2" fill="#0369a1" />
                      <path d="M4.5 7.2l1.8 1.8 3.2-3.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Pemeriksaan selesai
                  </p>
                  <p className="mt-1 text-xs leading-4 text-slate-400">42 halaman • 126 sitasi diperiksa</p>
                </div>
              </div>

              <div className="grid grid-cols-4 divide-x divide-slate-200/70 rounded-2xl border border-slate-200/90 bg-white py-5 text-center shadow-sm">
                {[
                  ["7", "Temuan"],
                  ["3", "Sitasi tidak sesuai klaim"],
                  ["2", "Sumber Kurang kuat"],
                  ["2", "Referensi tidak kuat"],
                ].map(([value, label]) => (
                  <div key={label} className="px-3">
                    <p className="text-3xl font-extrabold leading-10 text-sky-600">{value}</p>
                    <p className="mt-0.5 text-[10px] font-bold leading-4 text-slate-600">{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold leading-7 text-slate-900">Temuan {temuanNav + 1} dari 7</h2>
                  <span className="flex items-center gap-1.5 rounded-md bg-sky-100/70 px-3.5 py-1 text-sm font-semibold leading-4 text-sky-600">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0284c7" strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="2" width="10" height="12" rx="1.5" />
                      <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" strokeLinecap="round" />
                    </svg>
                    BAB II • Halaman {temuan.halaman}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-md bg-red-100/70 px-3 py-1 text-xs font-bold uppercase leading-4 tracking-tight text-red-600">
                    <span className="h-2.5 w-2.5 bg-red-600" aria-hidden="true" />
                    {temuan.badge}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Temuan sebelumnya"
                    onClick={() => setTemuanNav(current => (current - 1 + temuanAnalisis.length) % temuanAnalisis.length)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-slate-200"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M8.5 3L5 7l3.5 4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Temuan berikutnya"
                    onClick={() => setTemuanNav(current => (current + 1) % temuanAnalisis.length)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-slate-200"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5.5 3L9 7l-3.5 4" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid gap-4 min-[1180px]:grid-cols-2">
                <div className="rounded-2xl bg-white p-5 outline outline-1 outline-offset-[-1px] outline-slate-200/90">
                  <h3 className="text-base font-bold leading-5 text-slate-800">Bagian yang perlu diperbaiki</h3>
                  <div className="mt-4 rounded-xl bg-blue-50 p-5 outline outline-1 outline-offset-[-1px] outline-sky-600">
                    <p className="text-base leading-7 text-slate-800">{renderKutipan(temuan.kutipan)}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-5 outline outline-1 outline-offset-[-1px] outline-slate-200/90">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-100" aria-hidden="true">
                      <span className="h-3 w-3 bg-red-500" />
                    </span>
                    <h3 className="text-base font-bold leading-5 text-slate-800">Mengapa sitasi ini bermasalah?</h3>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {temuan.alasan.map(reason => (
                      <li key={reason} className="text-xs leading-4 text-zinc-800">
                        {reason}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-sky-50/70 px-4 py-3 outline outline-1 outline-offset-[-1px] outline-sky-100">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0284c7" strokeWidth="1.1" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="2" width="10" height="12" rx="1.5" />
                      <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" strokeLinecap="round" />
                    </svg>
                    <p className="text-xs font-medium leading-4 text-sky-700">DOI valid • Metadata cocok • Isi sumber tidak mendukung klaim</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 outline outline-1 outline-offset-[-1px] outline-slate-200/90">
                <h3 className="text-base font-bold leading-5 text-slate-800">Saran perbaikan Alerin</h3>
                <div className="mt-4 rounded-xl bg-blue-50 px-4 py-4 outline outline-1 outline-offset-[-1px] outline-sky-600">
                  <p className="text-sm font-medium leading-5 text-slate-800">{temuan.saran}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white px-2.5 py-1 text-[10px] font-medium leading-3 text-slate-800">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#334155" strokeWidth="1" aria-hidden="true">
                      <rect x="1.5" y="1.5" width="9" height="9" rx="1.5" />
                    </svg>
                    OpenAlex <span>+4</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          <DesktopJournalResultCard
            relevancy="97%"
            onAnalisis={onOpenRingkasan}
            onSitasi={onOpenSitasi}
            onAbstrak={onOpenAbstrak}
            journal={desktopResultJournals[0]}
            saved={savedIds.includes(desktopResultJournals[0].id)}
            onToggleSave={() => onToggleSave(desktopResultJournals[0])}
          />
          <DesktopJournalResultCard
            relevancy="92%"
            onAnalisis={onOpenRingkasan}
            onSitasi={onOpenSitasi}
            onAbstrak={onOpenAbstrak}
            journal={desktopResultJournals[1]}
            saved={savedIds.includes(desktopResultJournals[1].id)}
            onToggleSave={() => onToggleSave(desktopResultJournals[1])}
          />
          <DesktopJournalResultCard
            relevancy="89%"
            onAnalisis={onOpenRingkasan}
            onSitasi={onOpenSitasi}
            onAbstrak={onOpenAbstrak}
            journal={desktopResultJournals[2]}
            saved={savedIds.includes(desktopResultJournals[2].id)}
            onToggleSave={() => onToggleSave(desktopResultJournals[2])}
          />
        </div>

        <aside className="sticky top-2 w-64 shrink-0 self-start space-y-4">
          {analysis && <ProfileCard collection={false} />}
          <div className="rounded-2xl bg-white p-6">
          <h2 className="text-base font-bold leading-6 text-slate-900">Ringkasan Hasil Pencarian</h2>
          <p className="pt-1 text-xs leading-4 text-slate-500">
            Alerin menelusuri dan menyaring jurnal berdasarkan relevansi dengan pencarianmu untuk menampilkan hasil yang paling sesuai.
          </p>
          <div className="flex flex-col items-start gap-2 pt-4">
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold leading-4 text-slate-700">
              Kata kunci: {query.trim() || "interaksi parasosial"}
            </span>
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold leading-4 text-slate-700">Tahun 2024–2026</span>
          </div>
          <div className="mt-5 border-t border-slate-200/70 pt-5 text-center">
            <p className="text-3xl font-extrabold leading-10 text-slate-900">4,2 juta</p>
            <p className="text-sm font-medium leading-5 text-slate-500">Jurnal tersedia</p>
          </div>
          <div className="mt-5 border-t border-slate-200/70 pt-5 text-center">
            <p className="text-3xl font-extrabold leading-10 text-slate-900">50</p>
            <p className="text-sm font-medium leading-5 text-slate-500">sesuai filter dan kriteria</p>
          </div>
          <div className="mt-5 border-t border-slate-200/70 pt-5 text-center">
            <p className="text-3xl font-extrabold leading-8 text-sky-600">20</p>
            <p className="text-sm font-medium leading-4 text-slate-500">paling relevan untuk ditelaah</p>
          </div>
          <button
            type="button"
            onClick={onOpenTabel}
            className="mt-5 w-full rounded-lg bg-sky-700 py-3 text-xs font-bold leading-4 text-white transition-colors hover:bg-sky-800"
          >
            Tabel penelitian terdahulu
          </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SortArrow({ dir }: { dir: "asc" | "desc" | null }) {
  return (
    <svg
      width="9"
      height="12"
      viewBox="0 0 9 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={dir === "desc" ? "rotate-180" : ""}
    >
      <path d="M1.5 4L4.5 1l3 3M1.5 8l3 3 3-3" />
    </svg>
  );
}

const priorityRows = (() => {
  const interleave = (...lists: string[][]) => {
    const out: string[] = [];
    const max = Math.max(...lists.map(list => list.length));
    for (let i = 0; i < max; i++) for (const list of lists) if (i < list.length) out.push(list[i]);
    return out;
  };
  const head = [
    { title: "Resilience among Women in Disaster Contexts: A Systematic Literature Review", year: 2023, relevan: 97, tag: "Sangat relevan", kind: "Ulasan teori", source: "Google Scholar" },
    { title: "Gendered Impacts of Natural Disasters: A Global Review", year: 2022, relevan: 95, tag: "Sangat relevan", kind: "Ulasan teori", source: "Crossref" },
    { title: "Community Resilience and Women's Leadership in Disaster Recovery", year: 2021, relevan: 91, tag: "Perlu ditinjau", kind: "Ulasan teori", source: "OpenAlex" },
    { title: "The Role of Social Support in Post-Disaster Recovery for Women", year: 2020, relevan: 93, tag: "Sangat relevan", kind: "Ulasan teori", source: "DOAJ" },
    { title: "Digital Platforms for Women's Resilience in Crisis Situations: An Empirical Study", year: 2023, relevan: 90, tag: "Perlu ditinjau", kind: "Empiris", source: "Google Scholar" },
  ];
  const topics = [
    "Women's Resilience in Disasters",
    "Gendered Disaster Recovery",
    "Social Support after Crises",
    "Community Preparedness and Women",
    "Psychological Recovery of Survivors",
    "Digital Inclusion in Humanitarian Crises",
    "Women's Leadership in Emergency Response",
    "Livelihood Restoration after Hazards",
    "Coastal Community Vulnerability and Adaptation",
    "Care Networks in Post-Disaster Settings",
    "Gender Sensitivity in Humanitarian Aid",
    "Education Continuity for Displaced Children",
  ];
  const suffixes = [
    ": A Systematic Review",
    ": Evidence from Coastal Indonesia",
    ": A Mixed-Methods Study",
    ": A Scoping Review",
    ": Insights from ASEAN",
    ": Lessons from COVID-19",
    ": Longitudinal Perspectives",
    ": Policy Implications",
  ];
  const tags = interleave(
    Array.from({ length: 21 }, () => "Sangat relevan"),
    Array.from({ length: 36 }, () => "Perlu ditinjau"),
    Array.from({ length: 30 }, () => "Cukup relevan"),
  );
  const kinds = interleave(
    Array.from({ length: 8 }, () => "Ulasan teori"),
    Array.from({ length: 45 }, () => "Empiris"),
    Array.from({ length: 34 }, () => "Campuran"),
  );
  const sources = ["Google Scholar", "Crossref", "OpenAlex", "DOAJ"];
  const extra = Array.from({ length: 87 }, (_, index) => ({
    title: `${topics[index % topics.length]}${suffixes[Math.floor(index / topics.length) % suffixes.length]}`,
    year: 2026 - (index % 7),
    relevan: Math.max(58, 94 - Math.floor(index * 0.42)),
    tag: tags[index],
    kind: kinds[index],
    source: sources[index % sources.length],
  }));
  return [...head, ...extra];
})();

const sourceLogos: Record<string, string> = {
  "Google Scholar": "/assets/source-logos/google-scholar.svg",
  Crossref: "/assets/source-logos/crossref.svg",
  OpenAlex: "/assets/source-logos/openalex.svg",
  DOAJ: "/assets/source-logos/doaj.svg",
};

const matrixRows = (() => {
  const curated = [
    { name: "Sari et al. (2022)", journal: "Jurnal Ketahanan Nasional", cells: ["Dukungan sosial perempuan pasca bencana", "Kualitatif (wawancara mendalam)", "Jaringan sosial mempercepat pemulihan psikologis dan ekonomi.", "Menunjukkan peran sentral komunitas perempuan."] },
    { name: "Ahmed & Rahman (2021)", journal: "International Journal of Disaster Risk Reduction", cells: ["Akses sumber daya pada tahap respon bencana", "Mixed methods", "Keterbatasan akses informasi menghambat keterlibatan perempuan dalam pengambilan keputusan.", "Mengidentifikasi kesenjangan akses berbasis gender."] },
    { name: "Putri (2023)", journal: "Jurnal Ilmu Sosial dan Humaniora", cells: ["Strategi coping perempuan korban bencana", "Kualitatif (studi kasus)", "Strategi coping berbasis agama dan dukungan keluarga meningkatkan resiliensi.", "Memberikan perspektif lokal dalam konteks Indonesia."] },
    { name: "Nguyen et al. (2020)", journal: "Global Environmental Change", cells: ["Peran perempuan dalam manajemen risiko bencana", "Kuantitatif (survei)", "Perempuan lebih aktif dalam kesiapsiagaan komunitas dibanding laki-laki.", "Data komparatif gender lintas negara Asia Tenggara."] },
  ];
  const authors = [
    "Pratama & Lestari",
    "Aisyah et al.",
    "Hidayat et al.",
    "Lim & Susanto",
    "Rahmawati & Dewi",
    "Kurniawan et al.",
    "Wongkitrungrueng & Assarut",
    "Saputra et al.",
    "Marinez & Wibowo",
    "Kusuma et al.",
    "Tanaka et al.",
    "Abdullah & Hafizah",
  ];
  const journals = [
    "Jurnal Ketahanan Nasional",
    "International Journal of Disaster Risk Reduction",
    "Jurnal Ilmu Sosial dan Humaniora",
    "Global Environmental Change",
    "Asia Pacific Journal of Public Health",
    "Disaster Prevention and Management",
    "Jurnal Perempuan dan Bencana",
    "Journal of Humanitarian Affairs",
  ];
  const fokus = [
    "Dukungan sosial perempuan pasca bencana",
    "Akses sumber daya pada tahap respon bencana",
    "Strategi coping perempuan korban bencana",
    "Peran perempuan dalam manajemen risiko bencana",
    "Kesiapsiagaan berbasis komunitas dan gender",
    "Pemulihan ekonomi keluarga terdampak",
    "Keterlibatan perempuan dalam pengambilan keputusan",
    "Adaptasi komunitas pesisir terhadap perubahan iklim",
  ];
  const metode = [
    "Kualitatif (wawancara mendalam)",
    "Mixed methods",
    "Kualitatif (studi kasus)",
    "Kuantitatif (survei)",
    "Etnografi (partisipatif)",
    "Tinjauan sistematis",
    "Kuantitatif (panel longitudinal)",
    "Studi kohort prospektif",
  ];
  const temuan = [
    "Jaringan sosial mempercepat pemulihan psikologis dan ekonomi.",
    "Keterbatasan akses informasi menghambat keterlibatan perempuan dalam pengambilan keputusan.",
    "Strategi coping berbasis agama dan dukungan keluarga meningkatkan resiliensi.",
    "Perempuan lebih aktif dalam kesiapsiagaan komunitas dibanding laki-laki.",
    "Program pemberdayaan mikro meningkatkan ketahanan rumah tangga pasca bencana.",
    "Partisipasi perempuan dalam perencanaan penanggulangan menaikkan kualitas kebijakan lokal.",
    "Literasi digital memperluas akses bantuan darurat bagi kelompok rentan.",
    "Koordinasi lintas sektor memperpendek waktu pemulihan wilayah terdampak.",
  ];
  const kontribusi = [
    "Menunjukkan peran sentral komunitas perempuan.",
    "Mengidentifikasi kesenjangan akses berbasis gender.",
    "Memberikan perspektif lokal dalam konteks Indonesia.",
    "Data komparatif gender lintas negara Asia Tenggara.",
    "Model pemantauan kebutuhan dasar berbasis kearifan lokal.",
    "Rekomendasi indikator inklusi gender dalam kesiapsiagaan.",
    "Bukti empiris dampak platform digital pada daya tahan keluarga.",
    "Kerangka integrasi mitigasi dan adaptasi berbasis komunitas.",
  ];
  const generated = priorityRows.slice(4).map((row, index) => {
    const i = index + 4;
    return {
      name: `${authors[i % authors.length]} (${row.year})`,
      journal: journals[i % journals.length],
      cells: [fokus[i % fokus.length], metode[i % metode.length], temuan[i % temuan.length], kontribusi[i % kontribusi.length]],
    };
  });
  return [...curated, ...generated];
})();

function DesktopLiteratureReview({ query, onBack, onOpenSitasi }: { query: string; onBack: () => void; onOpenSitasi: () => void }) {
  const sectionNames = [
    "Ringkasan Utama",
    "Pendahuluan",
    "Metodologi dan Cakupan",
    "Matriks Literatur",
    "Perbandingan Studi",
    "Pengelompokan Tema",
    "Sintesis",
    "Evaluasi dan Kritik",
    "Research Gap",
    "Posisi Penelitian",
    "Kesimpulan",
    "Daftar Pustaka",
  ];

  const stats = [
    { label: "Total hasil ditemukan", value: "126", tone: "text-[#0369a1]" },
    { label: "Duplikasi dihapus", value: "34", tone: "text-red-600" },
    { label: "Artikel tersisa untuk sintesis", value: "92", tone: "text-[#0369a1]" },
    { label: "Artikel prioritas tinggi", value: "24", tone: "text-[#0369a1]" },
  ];

  const filterChips = [
    { key: "semua", label: "Semua (92)" },
    { key: "relevan", label: "Sangat relevan (24)" },
    { key: "tinjau", label: "Perlu ditinjau (38)" },
    { key: "teori", label: "Ulasan teori (12)" },
    { key: "empiris", label: "Empiris (46)" },
  ];

  const matrixHeaders = ["Penelitian", "Fokus", "Metode", "Temuan Utama", "Kontribusi Khas"];

  const docNavRows = [
    {
      key: "2",
      title: "Pendahuluan",
      desc: "Latar belakang, dinamika kerentanan gender, dan konteks kebencanaan",
      section: 2,
      content: [
        "Bagian ini memaparkan latar belakang penelitian tentang resiliensi perempuan dalam menghadapi bencana, termasuk dinamika kerentanan gender yang memperberat dampak bencana bagi perempuan.",
        "Konteks kebencanaan di Indonesia—mulai dari gempa, banjir, hingga pandemi—menjadi fokus utama karena tingginya frekuensi dan dampaknya terhadap kelompok rentan.",
        "Kerentanan yang berlapis membuat perempuan sering kali menjadi kelompok yang paling terdampak sekaligus paling cepat pulih ketika kebutuhan spesifiknya terpenuhi. Perbedaan akses terhadap informasi, ruang pengambilan keputusan, dan sumber daya ekonomi menjadi variabel pembeda yang muncul konsisten di banyak studi.",
        "Urgensi kajian ini juga ditopang oleh meningkatnya frekuensi bencana hidrometeorologi di kawasan Asia Tenggara. Kebijakan pemulihan yang netral gender berisiko memperlebar ketimpangan, sehingga sintesis bukti yang sistematis dibutuhkan untuk mengarahkan intervensi yang lebih tepat sasaran.",
      ],
    },
    {
      key: "3",
      title: "Metodologi dan Cakupan",
      desc: "Strategi pencarian, kriteria inklusi, dan seleksi 126 artikel",
      section: 3,
      content: [
        "Penelusuran dilakukan di lima basis data dengan kata kunci terkait resiliensi perempuan, bencana, dan pemulihan pasca-bencana, menghasilkan 126 artikel yang direduksi menjadi 92 studi setelah penyaringan.",
        "Kriteria inklusi mencakup publikasi 2020–2026, bahasa Indonesia dan Inggris, serta metode penelitian empiris maupun tinjauan sistematis.",
        "Penyaringan dilakukan secara bertahap melalui penghapusan duplikasi, penilaian judul dan abstrak, lalu telaah teks penuh. Dua penilai independen menilai kesesuaian studi dengan kriteria inklusi dan menyelesaikan perbedaan penilaian melalui diskusi konsensus.",
        "Risiko bias setiap studi dinilai menggunakan instrumen kritikal yang disesuaikan dengan desain penelitian, sementara kualitas pelaporan diperiksa terhadap ketersediaan data, kejelasan metode, dan keterbatasan yang diakui penulis.",
      ],
    },
    {
      key: "4",
      title: "Matriks Literatur",
      desc: "Fokus, metode, temuan utama, dan kontribusi khas tiap studi",
      section: 4,
      content: [
        "Matriks merangkum fokus, metode, temuan utama, dan kontribusi khas dari studi unggulan agar perbandingan lintas penelitian dapat dilakukan secara cepat.",
        "Setiap baris memuat sitasi lengkap dan basis sumber agar klaim dalam sintesis ini dapat diverifikasi kembali.",
        "Matriks menyusun setiap studi pada empat dimensi—fokus, metode, temuan utama, dan kontribusi khas—sehingga pola kemiripan dan perbedaan antarkajian terlihat langsung tanpa harus membaca seluruh artikel.",
        "Kolom kontribusi khas menandai kebaruan tiap studi, sementara kolom celah memperlihatkan wilayah yang belum tergarap dan menjadi bahan penting bagi penyusunan sintesis pada bagian berikutnya.",
      ],
    },
    {
      key: "5",
      title: "Perbandingan Studi",
      desc: "Persamaan dan perbedaan metode serta temuan antar studi",
      section: 5,
      content: [
        "Studi-studi dibandingkan berdasarkan pendekatan metodologis, cakupan geografis, serta jenis temuan—memperlihatkan bahwa pendekatan kualitatif mendominasi literatur ini.",
        "Perbedaan utama terletak pada faktor yang ditekankan: jaringan sosial, akses sumber daya, maupun strategi coping individual.",
        "Secara metodologis, mayoritas studi mengandalkan wawancara mendalam dan studi kasus dengan jumlah partisipan terbatas. Beberapa penelitian kuantitatif mencoba mengukur tingkat resiliensi, tetapi instrumen yang digunakan belum seragam sehingga perbandingan langsung antarangka sulit dilakukan.",
        "Perbandingan lintas wilayah menunjukkan bahwa dukungan sosial lebih dominan pada konteks komunitas pedesaan, sedangkan akses layanan digital lebih menentukan pada wilayah perkotaan. Temuan ini menegaskan pemulihan yang efektif harus mempertimbangkan konteks lokal.",
      ],
    },
    {
      key: "6",
      title: "Pengelompokan Tema",
      desc: "Temuan utama dikelompokkan ke dalam lima tema besar",
      section: 6,
      content: [
        "Temuan utama dikelompokkan ke dalam lima tema: dukungan sosial, akses sumber daya, keterlibatan komunitas, faktor psikologis, dan pemanfaatan teknologi digital.",
        "Pengelompokan ini menjadi dasar penyusunan sintesis pada bagian selanjutnya.",
        "Lima tema besar yang teridentifikasi tidak berdiri sendiri, melainkan saling memperkuat. Misalnya, keterlibatan komunitas memperluas akses sumber daya, sementara faktor psikologis menentukan sejauh mana perempuan mampu memanfaatkan dukungan yang tersedia.",
        "Pemanfaatan teknologi digital muncul sebagai tema yang relatif baru dan tumbuh cepat, terutama pada masa pandemi, ketika layanan tatap muka terbatas dan jaringan daring menjadi kanal utama pemulihan ekonomi.",
      ],
    },
    {
      key: "7",
      title: "Sintesis",
      desc: "Integrasi temuan lintas studi menjadi satu narasi utuh",
      section: 7,
      content: [
        "Sintesis ini menunjukkan bahwa resiliensi perempuan bukan sifat bawaan, melainkan hasil interaksi dinamis antara faktor sosial, struktural, dan individual yang terbentuk sepanjang proses pemulihan.",
        "Dukungan sosial dari keluarga dan komunitas berperan sebagai fondasi emosional sekaligus sumber informasi praktis. Akses sumber daya—ekonomi, pendidikan, dan layanan kesehatan—menjadi prasyarat agar perempuan dapat mengambil keputusan strategis bagi keluarganya.",
        "Faktor individual seperti koping berbasis agama, ketangguhan keluarga, dan kepercayaan diri memperkuat kemampuan adaptasi, tetapi tidak dapat menggantikan peran struktur yang inklusif. Kombinasi ketiganya menentukan kecepatan pemulihan pasca-bencana.",
        "Secara keseluruhan, bukti yang tersintesis menegaskan bahwa intervensi pemulihan harus dirancang menyeluruh dan sensitif gender, bukan sekadar bantuan jangka pendek yang bersifat seragam.",
      ],
    },
    {
      key: "8",
      title: "Evaluasi dan Kritik",
      desc: "Penilaian kualitas bukti dan keterbatasan tiap studi",
      section: 8,
      content: [
        "Kualitas bukti yang tersedia beragam. Sebagian besar studi memiliki kekuatan pada kedalaman konteks, tetapi lemah dalam kemampuan generalisasi karena sampel berskala kecil dan terbatas pada satu lokasi.",
        "Beberapa penelitian tidak melaporkan secara rinci prosedur pengambilan sampel dan karakteristik partisipan, sehingga risiko bias seleksi sulit dinilai. Transparansi pelaporan masih menjadi titik lemah yang berulang.",
        "Definisi operasional resiliensi juga belum seragam: sebagian studi melihatnya sebagai kemampuan pulih, sebagian lain sebagai proses berkelanjutan. Perbedaan konseptual ini menyulitkan sintesis kuantitatif dan membuka ruang tafsir yang lebar.",
        "Meski demikian, keterbatasan tersebut tidak meniadakan nilai temuan. Pola yang konsisten lintas studi tetap memberi dasar yang cukup kuat untuk merumuskan implikasi praktis dan agenda penelitian berikutnya.",
      ],
    },
    {
      key: "9",
      title: "Research Gap",
      desc: "Celah penelitian yang belum terjawab dan arah lanjutan",
      section: 9,
      content: [
        "Celah paling menonjol adalah kelangkaan studi longitudinal yang mengikuti perempuan melewati siklus pemulihan jangka panjang. Sebagian besar penelitian bersifat potret sesaat dan gagal menangkap perubahan strategi adaptasi sepanjang waktu.",
        "Konteks Indonesia dan Asia Tenggara masih kurang terwakili meskipun wilayah ini menghadapi risiko bencana yang tinggi. Perbandingan lintas negara dengan latar budaya berbeda juga hampir tidak tersedia.",
        "Studi yang memisahkan pengalaman perempuan berdasarkan usia, status ekonomi, disabilitas, dan status perkawinan masih jarang, padahal kerentanan di dalam kelompok perempuan sendiri sangat berlapis.",
        "Selain itu, evaluasi dampak program pemulihan terhadap resiliensi belum banyak dilakukan, sehingga belum jelas intervensi mana yang benar-benar efektif dan layak diperluas.",
      ],
    },
  ];

  const [chip, setChip] = useState("semua");
  const [prioritySearch, setPrioritySearch] = useState("");
  const [yearSort, setYearSort] = useState<"asc" | "desc" | null>(null);
  const [relevanSort, setRelevanSort] = useState<"asc" | "desc" | null>(null);
  const [matrixSearch, setMatrixSearch] = useState("");
  const [matrixSort, setMatrixSort] = useState<{ index: number; dir: "asc" | "desc" } | null>(null);
  const [activeSection, setActiveSection] = useState(1);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const docRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const goToSection = (section: number) => {
    setActiveSection(section);
    const row = docNavRows.find(item => item.section === section);
    if (row) {
      setOpenRow(row.key);
      window.setTimeout(() => rowRefs.current[row.key]?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
    } else if (section === 1) {
      window.setTimeout(() => introRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    } else {
      window.setTimeout(() => docRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    }
  };

  const visiblePriority = (() => {
    let rows = priorityRows.filter(row => {
      if (chip === "relevan" && row.tag !== "Sangat relevan") return false;
      if (chip === "tinjau" && row.tag !== "Perlu ditinjau") return false;
      if (chip === "teori" && row.kind !== "Ulasan teori") return false;
      if (chip === "empiris" && row.kind !== "Empiris") return false;
      const q = prioritySearch.trim().toLowerCase();
      if (q && !row.title.toLowerCase().includes(q) && !row.source.toLowerCase().includes(q)) return false;
      return true;
    });
    if (yearSort) rows = [...rows].sort((a, b) => (yearSort === "desc" ? b.year - a.year : a.year - b.year));
    else if (relevanSort) rows = [...rows].sort((a, b) => (relevanSort === "desc" ? b.relevan - a.relevan : a.relevan - b.relevan));
    return rows;
  })();

  const visibleMatrix = (() => {
    const q = matrixSearch.trim().toLowerCase();
    let rows = matrixRows.filter(
      row => !q || row.name.toLowerCase().includes(q) || row.journal.toLowerCase().includes(q) || row.cells.some(cell => cell.toLowerCase().includes(q)),
    );
    if (matrixSort) {
      const { index, dir } = matrixSort;
      rows = [...rows].sort((a, b) => {
        const left = index === 0 ? a.name.toLowerCase() : a.cells[index - 1].toLowerCase();
        const right = index === 0 ? b.name.toLowerCase() : b.cells[index - 1].toLowerCase();
        return dir === "asc" ? left.localeCompare(right) : right.localeCompare(left);
      });
    }
    return rows;
  })();

  return (
    <div className="mx-auto hidden max-w-[1160px] flex-col gap-5 pb-8 md:flex">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-['Inter:Bold'] text-2xl font-extrabold leading-8 text-slate-900">Tinjau hasil penelusuran literatur</h1>
          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            Alerin telah menggabungkan, merapikan, dan memeringkat artikel berdasarkan relevansi.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="flex shrink-0 items-center gap-2 rounded-[9.88px] bg-sky-700 px-5 py-2.5 text-sm font-bold leading-5 text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
        >
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 6H2M5.5 2.5L2 6l3.5 3.5" />
          </svg>
          Kembali
        </button>
      </div>

      <div className="rounded-2xl bg-white p-2.5 shadow-sm">
        <div className="grid grid-cols-4 divide-x divide-slate-200/80">
          {stats.map(stat => (
            <div key={stat.label} className="px-6 py-4 text-center">
              <p className="text-base font-medium leading-6 text-slate-500">{stat.label}</p>
              <p className={`mt-2 text-2xl font-extrabold leading-8 ${stat.tone}`}>
                {stat.value} <span className="text-xl font-extrabold">artikel</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <section className="rounded-2xl bg-white shadow-sm">
        <div className="flex items-start justify-between gap-4 p-5">
          <div>
            <h2 className="text-lg font-bold leading-7 text-slate-900">Artikel prioritas untuk ditinjau</h2>
            <p className="mt-0.5 text-sm leading-5 text-slate-500">Berikut adalah artikel dengan relevansi tertinggi untuk topik Anda.</p>
          </div>
          <label className="flex h-10 w-full shrink-0 items-center gap-2 rounded-xl bg-slate-50 px-3 md:w-72">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <circle cx="6" cy="6" r="4.5" />
              <path d="M9.5 9.5L13 13" />
            </svg>
            <input
              value={prioritySearch}
              onChange={event => setPrioritySearch(event.target.value)}
              placeholder="Cari judul, penulis, atau kata kunci..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="mt-4 max-h-[460px] overflow-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="bg-slate-50/60">
                <th className="px-5 py-3 text-xs font-semibold text-slate-500">Judul</th>
                <th className="px-5 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRelevanSort(null);
                      setYearSort(yearSort === "desc" ? "asc" : "desc");
                    }}
                    className={`flex items-center gap-1.5 text-xs font-semibold ${yearSort ? "text-[#0369a1]" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Tahun
                    <SortArrow dir={yearSort} />
                  </button>
                </th>
                <th className="px-5 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      setYearSort(null);
                      setRelevanSort(relevanSort === "desc" ? "asc" : "desc");
                    }}
                    className={`flex items-center gap-1.5 text-xs font-semibold ${relevanSort ? "text-[#0369a1]" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Relevansi
                    <SortArrow dir={relevanSort} />
                  </button>
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500">Sumber</th>
              </tr>
            </thead>
            <tbody>
              {visiblePriority.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-400">
                    Tidak ada artikel yang cocok dengan pencarianmu.
                  </td>
                </tr>
              )}
              {visiblePriority.map(row => (
                <tr key={row.title} className="border-t border-slate-100">
                  <td className="max-w-[380px] px-5 py-4 text-sm font-medium leading-5 text-slate-800">{row.title}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{row.year}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        row.tag === "Sangat relevan"
                          ? "bg-emerald-50 text-emerald-700 outline outline-1 outline-emerald-200/60"
                          : row.tag === "Cukup relevan"
                            ? "bg-sky-50 text-sky-700 outline outline-1 outline-sky-200/60"
                            : "bg-amber-50 text-amber-700 outline outline-1 outline-amber-200/60"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          row.tag === "Sangat relevan" ? "bg-emerald-500" : row.tag === "Cukup relevan" ? "bg-sky-500" : "bg-amber-500"
                        }`}
                      />
                      {row.tag}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-2.5">
                      <img
                        src={sourceLogos[row.source] ?? "/assets/source-logos/openalex.svg"}
                        alt=""
                        className="h-6 w-6 shrink-0 object-contain"
                      />
                      <span className="text-sm text-slate-600">{row.source}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1.5 rounded-full bg-[#0369a1]" />
          <h2 className="text-2xl font-bold leading-8 text-slate-900">Hasil Analisis Literature Review</h2>
        </div>
        <p className="text-sm text-slate-500">Resiliensi perempuan dalam menghadapi bencana dan krisis</p>
      </div>

      <section className="rounded-2xl bg-white shadow-sm">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 p-5">
          <div>
            <h2 className="text-lg font-bold leading-7 text-slate-900">Matriks Literatur</h2>
            <p className="mt-0.5 text-sm leading-5 text-slate-500">
              Daftar studi yang dianalisis beserta fokus, metode, temuan utama, dan kontribusi khasnya.
            </p>
          </div>
          <label className="flex h-10 w-64 shrink-0 items-center gap-2 rounded-xl bg-slate-50 px-3">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <circle cx="6" cy="6" r="4.5" />
              <path d="M9.5 9.5L13 13" />
            </svg>
            <input
              value={matrixSearch}
              onChange={event => setMatrixSearch(event.target.value)}
              placeholder="Cari dalam matriks..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="max-h-[640px] overflow-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/60">
                {matrixHeaders.map((header, index) => (
                  <th key={header} className="sticky top-0 z-10 bg-slate-50/60 px-5 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        setMatrixSort(current =>
                          current && current.index === index ? { index, dir: current.dir === "asc" ? "desc" : "asc" } : { index, dir: "asc" },
                        )
                      }
                      className={`flex items-center gap-1.5 text-xs font-semibold ${
                        matrixSort?.index === index ? "text-[#0369a1]" : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {header}
                      <SortArrow dir={matrixSort?.index === index ? matrixSort.dir : null} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleMatrix.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-400">
                    Tidak ada baris yang cocok dengan pencarianmu.
                  </td>
                </tr>
              )}
              {visibleMatrix.map((row, rowIndex) => (
                <tr key={`${row.name}-${rowIndex}`} className="border-t border-slate-100 align-top">
                  <td className="w-56 px-5 py-4">
                    <span className="block text-sm font-semibold leading-5 text-[#0369a1]">{row.name}</span>
                    <span className="mt-0.5 block text-xs leading-4 text-slate-400">{row.journal}</span>
                  </td>
                  {row.cells.map((cell, index) => (
                    <td key={index} className="px-5 py-4 text-sm leading-5 text-slate-600">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1.5 rounded-full bg-[#0369a1]" />
          <h2 className="text-2xl font-extrabold leading-8 text-slate-900">Literature Review Siap Digunakan</h2>
        </div>
      </div>

      <section className="flex items-stretch gap-5 rounded-2xl bg-white p-5 shadow-sm">
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => window.alert("Dokumen berhasil diekspor ke Word.")}
            className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
          >
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.5 1.5h6l3 3v8h-9zM8.5 1.5v3h3" />
            </svg>
            Ekspor ke Word
          </button>
          <button
            type="button"
            onClick={() => window.alert("Dokumen berhasil diekspor ke PDF.")}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline outline-1 outline-slate-200 transition-colors hover:bg-slate-50"
          >
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.5 1.5h6l3 3v8h-9zM8.5 1.5v3h3" />
            </svg>
            Ekspor ke PDF
          </button>
          <button
            type="button"
            onClick={() => window.alert("Teks literatur review disalin ke papan klip.")}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline outline-1 outline-slate-200 transition-colors hover:bg-slate-50"
          >
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
              <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" />
              <path d="M9.5 4.5v-2a1.5 1.5 0 0 0-1.5-1.5H3A1.5 1.5 0 0 0 1.5 2.5V8A1.5 1.5 0 0 0 3 9.5h1.5" />
            </svg>
            Salin Teks
          </button>
          <button
            type="button"
            onClick={onOpenSitasi}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline outline-1 outline-slate-200 transition-colors hover:bg-slate-50"
          >
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
              <path d="M5.5 4.5H3.8A1.3 1.3 0 0 0 2.5 5.8v4.4a1.3 1.3 0 0 0 1.3 1.3h4.4a1.3 1.3 0 0 0 1.3-1.3V5.8a1.3 1.3 0 0 0-1.3-1.3H7M5 2.5h4M5 5h4" />
            </svg>
            Lihat Sitasi
          </button>
        </div>
        <div className="w-72 shrink-0 rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-bold leading-5 text-slate-800">Keterlacakan Sumber</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-xs leading-4 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-sky-600" />
                12 klaim terverifikasi
              </span>
              <span className="flex items-center gap-2 text-xs leading-4 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                3 manual
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium leading-4 text-slate-500">80% Valid</p>
              <div className="mt-1.5 flex h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                <span className="h-full w-4/5 bg-sky-600" />
                <span className="h-full w-1/5 bg-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0369a1" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M2.5 4h11M2.5 8h11M2.5 12h7" />
              </svg>
            </span>
            <span className="text-sm font-bold uppercase tracking-wide text-slate-800">Struktur Dokumen (12 Bagian)</span>
          </div>
          <span className="text-xs font-semibold text-[#0369a1]">Bagian Aktif: {activeSection} dari 12</span>
        </div>
        <div className="mt-4 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sectionNames.map((name, index) => (
            <button
              key={name}
              type="button"
              onClick={() => goToSection(index + 1)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                activeSection === index + 1
                  ? "bg-sky-50 text-sky-700 outline outline-1 outline-sky-200"
                  : "bg-slate-50 text-slate-600 outline outline-1 outline-slate-200 hover:bg-slate-100"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white ${
                  activeSection === index + 1 ? "bg-[#0369a1]" : "bg-slate-600"
                }`}
              >
                {index + 1}
              </span>
              {name}
            </button>
          ))}
        </div>
      </section>

      <section ref={docRef} className="rounded-3xl bg-white p-11 shadow-sm">
        <div ref={introRef} className="flex gap-4 rounded-2xl bg-gradient-to-r from-sky-50/90 via-sky-50/70 to-indigo-50/80 p-6">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0369a1]/10">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#0369a1" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 4.5C8.5 3.3 6.6 3 4 3v12c2.6 0 4.5.3 6 1.5 1.5-1.2 3.4-1.5 6-1.5V3c-2.6 0-4.5.3-6 1.5zM10 4.5v12" />
            </svg>
          </span>
          <div className="min-w-0">
            <h3 className="text-xl font-bold leading-7 text-slate-900">Ringkasan Utama</h3>
            <p className="mt-2 text-lg leading-8 text-slate-700">
              Tinjauan literatur ini mengkaji 126 artikel yang tersaring menjadi 92 studi relevan tentang resiliensi perempuan
              dalam menghadapi bencana dan krisis. Temuan menunjukkan bahwa pemulihan perempuan sangat bergantung pada{" "}
              <span className="font-semibold text-slate-900">dukungan sosial</span>, ketersediaan{" "}
              <span className="font-semibold text-slate-900">akses sumber daya</span> ekonomi dan informasi, serta{" "}
              <span className="font-semibold text-slate-900">faktor individual/psikologis</span> seperti koping berbasis agama dan keluarga.
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <h3 className="text-2xl font-bold leading-8 text-slate-900">1. Ringkasan Utama</h3>
          <span className="text-xs leading-4 text-slate-400">Halaman 1 dari 18</span>
        </div>
        <div className="mt-4 space-y-4">
          <p className="text-lg leading-8 text-slate-700">
            Kajian ini mengompilasi 92 artikel terpilih dari 126 hasil penelusuran setelah proses penghapusan duplikasi dan
            penyaringan berdasarkan kriteria inklusi. Sebagian besar studi menggunakan pendekatan kualitatif, dengan jumlah
            sampel yang terbatas, sehingga generalisasi temuan masih perlu kehati-hatian.
          </p>
          <p className="text-lg leading-8 text-slate-700">
            Tiga faktor utama paling konsisten muncul lintas studi: dukungan sosial dari keluarga dan komunitas, akses
            sumber daya serta informasi pada tahap respon bencana, dan faktor individual/psikologis perempuan. Ketiadaan
            salah satu faktor terbukti memperlambat pemulihan psikologis pasca-bencana.
          </p>
          <p className="text-lg leading-8 text-slate-700">
            Celah penelitian masih terbuka pada konteks Asia Tenggara, khususnya Indonesia, yang didominasi studi berskala
            kecil dan bersifat lokal. Dokumen ini menyusun sintesis dua belas bagian untuk menjawab kebutuhan tersebut
            sekaligus memetakan arah penelitian lanjutan.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {docNavRows.map(row => (
            <div
              key={row.key}
              ref={element => {
                rowRefs.current[row.key] = element;
              }}
              className="overflow-hidden rounded-2xl bg-slate-50"
            >
              <button
                type="button"
                onClick={() => {
                  setActiveSection(row.section);
                  setOpenRow(openRow === row.key ? null : row.key);
                }}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-100"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-[#0369a1] outline outline-1 outline-slate-200">
                  {row.key}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold leading-6 text-slate-800">{row.title}</span>
                  <span className="block text-sm leading-5 text-slate-500">{row.desc}</span>
                </span>
                <svg
                  width="8"
                  height="13"
                  viewBox="0 0 8 13"
                  fill="none"
                  stroke="#0369a1"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={`transition-transform ${openRow === row.key ? "rotate-90" : ""}`}
                >
                  <path d="M1.5 1.5L6.5 6.5l-5 5" />
                </svg>
              </button>
              {openRow === row.key && (
                <div className="border-t border-slate-200/70 px-5 py-5">
                  <p className="text-2xl font-bold leading-8 text-slate-900">
                    {row.key}. {row.title}
                  </p>
                  <div className="mt-4 space-y-4">
                    {row.content.map(paragraph => (
                      <p key={paragraph} className="text-lg leading-8 text-slate-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-slate-400">Kata kunci pencarian: {query.trim() || "resiliensi perempuan pasca bencana"}</p>
    </div>
  );
}


type LoaderTagKind = "lightHole" | "midHole" | "midCheck" | "lightCheck";

const loaderTags = {
  lightHole: { paths: ["M11.2641 38.4684C17.3201 37.9591 30.2648 38.2858 36.5025 38.3431C39.0683 42.2491 44.0193 47.076 47.3273 52.0018C47.6008 57.0994 48.1204 80.5974 45.6067 83.8489C42.9439 85.6206 39.8297 85.2931 36.5889 85.3708C27.3844 85.7447 17.4767 85.4627 8.2267 85.5237C6.27973 85.4702 3.36638 84.9325 2.05587 83.2895C-0.778969 79.7343 0.1749 72.5203 0.0830225 68.1418C-0.0297363 62.7609 0.0429276 57.1358 0.320231 51.8381C3.00389 47.8981 8.12313 42.1246 11.2641 38.4684Z", "M23.8695 45.8202C25.8332 45.8269 27.4561 47.3551 27.5813 49.3157C27.7066 51.2762 26.2913 52.9987 24.3443 53.2552C22.9628 53.4373 21.5951 52.8345 20.797 51.6919C19.9994 50.5493 19.9037 49.0575 20.5498 47.8226C21.1963 46.5877 22.4759 45.8156 23.8695 45.8202Z"], viewBox: "-1 37 50 49" },
  midHole: { paths: ["M98.1949 38.4669C104.886 37.9823 116.574 38.2793 123.386 38.3428C125.785 41.4104 132.829 49.2402 134.313 52.1624C134.3 57.7688 134.974 78.0864 133.002 83.448C132.34 85.246 125.714 85.3425 123.439 85.4182C114.373 85.7098 105.173 85.4115 96.096 85.5769C91.9226 85.6529 87.5108 84.1962 87.2953 79.2904C86.8948 70.1756 87.1274 60.8574 87.2435 51.7163C90.8226 47.674 94.43 42.792 98.1949 38.4669Z", "M108.943 45.8942C112.78 45.6657 113.12 46.7464 115.523 49.5112C114.444 50.7361 113.201 52.017 112.08 53.2222C107.312 54.4788 105.978 49.8985 108.943 45.8942Z"], viewBox: "86 37 50 49" },
  midCheck: { paths: ["M310.245 38.2715C316.709 37.7802 328.511 38.0864 335.143 38.1846C338.242 41.2802 343.325 47.8182 346.165 51.383C346.386 55.7695 346.954 78.8924 344.782 83.4255C343.943 85.1814 337.444 85.1785 335.152 85.2457L334.801 85.2549C326.281 85.4567 317.586 85.2495 309.175 85.3873C304.431 85.4651 299.478 84.5476 299.228 79.1142C298.823 70.324 299.073 60.3771 299.115 51.6136C302.798 47.0278 306.294 42.6242 310.245 38.2715Z", "M332.921 54C333.869 54.1479 335.815 56.169 336.659 56.9402C331.397 62.5738 325.642 68.2303 320.192 73.7009C318.822 71.9442 316.504 69.6457 314.905 67.9767L311 64.2524C312.324 63.1206 313.531 61.666 314.696 60.3509C316.291 62.494 318.879 64.8495 320.691 66.8359C324.868 63.0226 328.858 58.0039 332.921 54Z"], viewBox: "298 37 50 49" },
  lightCheck: { paths: ["M397.071 38.2716C403.599 37.7953 415.417 38.0698 422.087 38.1692C425.44 42.4613 429.646 47.1883 433.179 51.5573C433.292 57.0634 434.566 80.4841 431.229 83.7047C429.258 85.6097 423.891 85.1752 421.218 85.2358C420.976 85.2512 420.73 85.2613 420.487 85.2667C412.294 85.4334 404.066 85.3009 395.868 85.3431C391.855 85.364 386.501 84.8251 386.213 79.5776C385.708 70.332 386.008 60.822 386.079 51.5314C389.011 47.6194 393.734 41.7398 397.071 38.2716Z", "M418.886 54.0469C420.164 54.252 421.454 55.9256 422.431 56.9528C417.591 62.3387 411.297 68.202 406.102 73.6358C404.415 71.7638 402.552 69.8546 400.815 68.0127L396.91 64.2604C398 63.2126 399.307 61.5754 400.314 60.3902C401.659 62.1043 404.398 64.8181 405.985 66.4787C410.362 62.6378 413.995 58.0921 418.886 54.0469Z"], viewBox: "385 37 50 49" },
};

const loaderTagOrder: LoaderTagKind[] = ["lightHole", "midHole", "midCheck", "lightCheck"];

function LoaderTag({ kind, tone, size = 48 }: { kind: LoaderTagKind; tone: "grey" | "white"; size?: number }) {
  const entry = loaderTags[kind];
  const isLight = kind === "lightHole" || kind === "lightCheck";
  const body = tone === "white" ? "#ffffff" : isLight ? "#D5D5D4" : "#B8B7B7";
  const detail = tone === "white" ? "#164682" : "#F2F2F1";
  return (
    <svg width={size} height={size} viewBox={entry.viewBox} className="shrink-0" aria-hidden="true">
      <path d={entry.paths[0]} fill={body} />
      <path d={entry.paths[1]} fill={detail} />
    </svg>
  );
}

function SearchLoader() {
  const items = Array.from({ length: 24 }, (_, i) => loaderTagOrder[i % loaderTagOrder.length]);
  return (
    <div
      className="relative mx-auto h-[102px] w-full max-w-[434px] overflow-hidden min-[400px]:h-[120px] sm:h-[150px]"
      aria-hidden="true"
    >
      <div className="absolute left-1/2 top-0 h-[150px] w-[434px] origin-top -translate-x-1/2 scale-[0.66] min-[400px]:scale-[0.78] sm:scale-100">
      <div className="absolute inset-x-0 top-[14px] flex h-24 items-center">
        <div className="flex w-max animate-[alerin-tag-flow_3s_linear_infinite] items-center gap-[72px]">
          {items.map((kind, index) => (
            <LoaderTag key={`${kind}-${index}`} kind={kind} tone="grey" />
          ))}
        </div>
      </div>
      <svg className="absolute -left-[5px] top-0 h-[148.597px] w-[434px]" viewBox="0 0 433.511 148.597" fill="none" preserveAspectRatio="xMidYMid meet">
        <path d="M215.97 0.155502C218.551 -0.0354165 221.14 -0.0504596 223.721 0.109962C240.121 1.07667 255.465 8.53752 266.356 20.8436C283.195 39.7763 286.624 67.4155 275.277 90.1411C272.888 94.9299 269.463 100.19 265.433 103.761C267.476 105.857 278.705 117.701 280.159 118.221C281.115 117.866 281.487 117.698 282.527 117.608C286.173 120.8 290.754 125.685 294.321 129.257C297.724 132.663 303.437 138.062 306.214 141.691C303.75 144.409 302.038 146.137 299.319 148.597C291.573 140.326 283.149 132.713 275.644 124.64C275.394 123.283 275.582 123.538 276.421 122.023C276.271 121.505 263.504 109.002 262.009 107.52C252.763 116.31 240.902 121.849 228.227 123.298C210.695 125.144 194.721 121.435 180.919 110.181C168.131 99.8779 160.003 84.8793 158.351 68.5372C156.594 52.0656 161.475 35.5731 171.912 22.7127C183.383 8.75643 198.242 1.84828 215.97 0.155502Z" fill="#164682" />
      </svg>
      <div className="absolute left-[153px] top-[-2.5px] h-[128px] w-[128px] overflow-hidden rounded-full">
        <div className="flex h-full items-center">
          <div className="flex w-max animate-[alerin-tag-flow_3s_linear_infinite] items-center gap-[66px]">
            {items.map((kind, index) => (
              <LoaderTag key={`lens-${kind}-${index}`} kind={kind} tone="white" size={54} />
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function MobileLiteratureReview() {
  const [chip, setChip] = useState("semua");
  const [prioritySearch, setPrioritySearch] = useState("");
  const [priorityLimit, setPriorityLimit] = useState(6);
  const [matrixSearch, setMatrixSearch] = useState("");
  const [matrixLimit, setMatrixLimit] = useState(4);
  const [activeSection, setActiveSection] = useState(1);

  const stats = [
    { label: "Total ditemukan", value: "126", accent: "text-slate-900", sub: "text-slate-500", highlight: false },
    { label: "Duplikasi dihapus", value: "34", accent: "text-rose-600", sub: "text-rose-500", highlight: false },
    { label: "Siap sintesis", value: "92", accent: "text-slate-900", sub: "text-slate-500", highlight: true },
    { label: "Prioritas tinggi", value: "24", accent: "text-slate-900", sub: "text-slate-500", highlight: false },
  ];

  const filterChips = [
    { key: "semua", label: "Semua (92)" },
    { key: "relevan", label: "Sangat relevan (24)" },
    { key: "tinjau", label: "Perlu ditinjau (38)" },
    { key: "teori", label: "Ulasan teori (12)" },
    { key: "empiris", label: "Empiris (46)" },
  ];

  const tagPills: Record<string, { box: string; dot: string }> = {
    "Sangat relevan": { box: "bg-emerald-50 text-emerald-700 outline-emerald-200/80", dot: "bg-emerald-500" },
    "Perlu ditinjau": { box: "bg-amber-50 text-amber-700 outline-amber-200/80", dot: "bg-amber-500" },
    "Cukup relevan": { box: "bg-sky-50 text-sky-700 outline-sky-200/80", dot: "bg-sky-500" },
  };

  const structureSections = [
    { n: 1, label: "Ringkasan Utama" },
    { n: 2, label: "Pendahuluan" },
    { n: 3, label: "Metodologi" },
    { n: 4, label: "Matriks Literatur" },
  ];
  const sectionDescs: Record<number, string> = {
    2: "Latar belakang, dinamika gender, dan konteks kebencanaan",
    3: "Strategi pencarian, kriteria inklusi, dan seleksi 126 artikel",
    4: "Fokus, metode, temuan utama, dan kontribusi khas tiap studi",
  };
  const sectionPreview: Record<number, string[]> = {
    1: [
      "Kajian ini bertujuan untuk mengidentifikasi dan mensintesis faktor-faktor yang membentuk resiliensi perempuan dalam menghadapi bencana dan krisis berdasarkan literatur ilmiah yang relevan. Sebanyak 15 artikel yang memenuhi kriteria inklusi dianalisis menggunakan pendekatan scoping review.",
      "Dukungan sosial, seperti peran keluarga, komunitas, dan jaringan sosial, terbukti memberikan perlindungan emosional, informasi, dan bantuan praktis. Akses terhadap sumber daya, termasuk ekonomi, pendidikan, layanan kesehatan, dan informasi, menjadi faktor penting yang memungkinkan perempuan memenuhi kebutuhan dasar dan mengambil keputusan strategis.",
      "Temuan ini menegaskan bahwa resiliensi perempuan merupakan hasil interaksi kompleks antara faktor sosial, struktural, dan individual sehingga intervensi pemulihan harus dirancang komprehensif.",
    ],
    2: [
      "Bagian ini memaparkan latar belakang penelitian tentang resiliensi perempuan dalam menghadapi bencana, termasuk dinamika kerentanan gender yang memperberat dampak bencana bagi kelompok rentan.",
      "Konteks kebencanaan di Indonesia—mulai dari gempa, banjir, hingga pandemi—menjadi fokus utama karena tingginya frekuensi dan dampaknya terhadap kelompok rentan.",
    ],
    3: [
      "Penelusuran dilakukan di lima basis data dengan kata kunci terkait resiliensi perempuan, bencana, dan pemulihan pasca-bencana, menghasilkan 126 artikel yang direduksi menjadi 92 studi setelah penyaringan.",
      "Kriteria inklusi mencakup publikasi 2020–2026, bahasa Indonesia dan Inggris, serta metode penelitian empiris maupun tinjauan sistematis.",
    ],
    4: [
      "Matriks merangkum fokus, metode, temuan utama, dan kontribusi khas dari studi unggulan agar perbandingan lintas penelitian dapat dilakukan secara cepat.",
      "Setiap baris memuat sitasi lengkap dan basis sumber agar klaim dalam sintesis ini dapat diverifikasi kembali.",
    ],
  };

  const visiblePriority = priorityRows.filter(row => {
    if (chip === "relevan" && row.tag !== "Sangat relevan") return false;
    if (chip === "tinjau" && row.tag !== "Perlu ditinjau") return false;
    if (chip === "teori" && row.kind !== "Ulasan teori") return false;
    if (chip === "empiris" && row.kind !== "Empiris") return false;
    const q = prioritySearch.trim().toLowerCase();
    if (q && !row.title.toLowerCase().includes(q) && !row.source.toLowerCase().includes(q)) return false;
    return true;
  });

  const visibleMatrix = matrixRows.filter(row => {
    const q = matrixSearch.trim().toLowerCase();
    return !q || row.name.toLowerCase().includes(q) || row.journal.toLowerCase().includes(q) || row.cells.some(cell => cell.toLowerCase().includes(q));
  });

  const activeLabel = structureSections.find(item => item.n === activeSection)?.label ?? "Ringkasan Utama";
  const nextSection = structureSections.find(item => item.n === activeSection + 1);

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="rounded-3xl bg-white p-5 text-center shadow-sm outline outline-1 outline-offset-[-1px] outline-slate-200/80">
        <h2 className="font-['Inter:Bold'] text-[22px] font-bold leading-7 text-slate-900">Tinjau hasil penelusuran literatur</h2>
        <p className="mx-auto mt-2 max-w-[300px] text-sm leading-6 text-slate-500">
          Alerin telah menggabungkan, merapikan, dan memeringkat artikel berdasarkan relevansi topik riset Anda.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 text-left">
          {stats.map(stat => (
            <div
              key={stat.label}
              className={`rounded-[18.92px] p-4 ${stat.highlight ? "bg-sky-50/70 outline outline-1 outline-sky-100" : "bg-slate-50/70 outline outline-1 outline-slate-200/70"}`}
            >
              <p className={`text-xs text-slate-500 ${stat.highlight ? "font-semibold" : "font-medium"}`}>{stat.label}</p>
              <p className="mt-2 flex items-baseline gap-1.5">
                <span className={`text-2xl font-bold leading-8 ${stat.accent}`}>{stat.value}</span>
                <span className={`text-sm ${stat.sub} ${stat.highlight ? "font-semibold" : "font-medium"}`}>artikel</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <section className="rounded-[18.92px] bg-white p-4 shadow-sm outline outline-1 outline-slate-200/80">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[11px] font-bold uppercase leading-4 tracking-wide text-slate-700">Artikel prioritas untuk ditinjau</h3>
          <span className="shrink-0 text-[11px] font-medium text-slate-400">Total {visiblePriority.length} artikel</span>
        </div>
        <label className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 outline outline-1 outline-slate-200">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <circle cx="6" cy="6" r="4.5" />
            <path d="M9.5 9.5L13 13" />
          </svg>
          <input
            value={prioritySearch}
            onChange={event => {
              setPrioritySearch(event.target.value);
              setPriorityLimit(6);
            }}
            placeholder="Cari judul, penulis, kata kunci..."
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-slate-400"
          />
        </label>

        <div className="mt-3 space-y-3">
          {visiblePriority.slice(0, priorityLimit).map((row, index) => {
            return (
              <article key={`${row.title}-${index}`} className="rounded-[18.92px] bg-slate-50/70 p-4 outline outline-1 outline-slate-200/90">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="min-w-0 flex-1 text-sm font-semibold leading-5 text-slate-900">{row.title}</h4>
                  <button
                    type="button"
                    aria-label="Opsi jurnal"
                    onClick={() => window.alert("Opsi jurnal: Simpan ke Koleksi, Buka PDF, dan Buat sitasi.")}
                    className="-mr-1 shrink-0 rounded-md px-1.5 py-0.5 text-base leading-5 text-slate-400"
                  >
                    ⋮
                  </button>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold outline outline-1 ${
                      (tagPills[row.tag] ?? tagPills["Cukup relevan"]).box
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${(tagPills[row.tag] ?? tagPills["Cukup relevan"]).dot}`} />
                    {row.tag}
                  </span>
                  <span className="rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-600 outline outline-1 outline-slate-200">{row.year}</span>
                  <span className="flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-600 outline outline-1 outline-slate-200">
                    <img
                      src={sourceLogos[row.source] ?? "/assets/source-logos/openalex.svg"}
                      alt=""
                      className="h-3.5 w-3.5 shrink-0 object-contain"
                    />
                    {row.source}
                  </span>
                </div>
              </article>
            );
          })}
          {visiblePriority.length === 0 && (
            <p className="py-6 text-center text-xs text-slate-400">Tidak ada jurnal yang cocok dengan pencarianmu.</p>
          )}
        </div>
        {visiblePriority.length > priorityLimit && (
          <button
            type="button"
            onClick={() => setPriorityLimit(limit => limit + 6)}
            className="mt-3 w-full rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-600"
          >
            Muat lebih banyak ({Math.min(6, visiblePriority.length - priorityLimit)} lagi)
          </button>
        )}
      </section>

      <div className="border-t border-slate-200 px-3 pt-6 text-center">
        <h2 className="text-xl font-bold leading-7 text-slate-900">Hasil Analisis Literature Review</h2>
        <p className="mx-auto mt-1 max-w-[300px] text-sm font-medium leading-5 text-sky-700">Resiliensi perempuan dalam menghadapi bencana dan krisis</p>
      </div>

      <section className="rounded-3xl bg-white p-4 shadow-sm outline outline-1 outline-slate-200/80">
        <div>
          <h3 className="text-base font-bold text-slate-800">Matriks Literatur</h3>
          <p className="mt-0.5 text-sm text-slate-500">Daftar studi yang dianalisis beserta fokus, teori, metode, temuan utama, dan kontribusi penelitian.</p>
        </div>
        <label className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 outline outline-1 outline-slate-200">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <circle cx="6" cy="6" r="4.5" />
            <path d="M9.5 9.5L13 13" />
          </svg>
          <input
            value={matrixSearch}
            onChange={event => {
              setMatrixSearch(event.target.value);
              setMatrixLimit(4);
            }}
            placeholder="Cari dalam matriks..."
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-slate-400"
          />
        </label>
        <div className="mt-4 space-y-3">
          {visibleMatrix.slice(0, matrixLimit).map(row => (
            <article key={row.name} className="rounded-[18.92px] bg-slate-50/60 p-4 outline outline-1 outline-slate-200">
              <div className="flex items-baseline justify-between gap-3 border-b border-slate-200/60 pb-2.5">
                <span className="text-sm font-bold text-sky-700">{row.name}</span>
                <span className="min-w-0 shrink text-right text-xs font-medium leading-4 text-slate-500">{row.journal}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Fokus</p>
                  <p className="mt-1 text-sm leading-5 text-slate-700">{row.cells[0]}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Metode</p>
                  <p className="mt-1 text-sm leading-5 text-slate-700">{row.cells[1]}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 border-t border-slate-200/50 pt-1.5">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Temuan Utama:</p>
                  <p className="mt-0.5 text-sm leading-5 text-slate-700">{row.cells[2]}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-sky-700">Kontribusi Khas:</p>
                  <p className="mt-0.5 text-sm leading-5 text-slate-700">{row.cells[3]}</p>
                </div>
              </div>
            </article>
          ))}
          {visibleMatrix.length === 0 && (
            <p className="py-6 text-center text-xs text-slate-400">Tidak ada baris yang cocok dengan pencarianmu.</p>
          )}
        </div>
        {visibleMatrix.length > matrixLimit && (
          <button
            type="button"
            onClick={() => setMatrixLimit(limit => limit + 4)}
            className="mt-3 w-full rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-600"
          >
            Muat lebih banyak ({Math.min(4, visibleMatrix.length - matrixLimit)} lagi)
          </button>
        )}
      </section>

      <div className="rounded-3xl bg-white p-5 shadow-sm outline outline-1 outline-offset-[-1px] outline-slate-200/80">
        <h2 className="text-xl font-bold leading-7 text-slate-900">Literature Review Siap Digunakan</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => window.alert("Dokumen berhasil diekspor ke Word.")}
            className="flex items-center justify-center gap-2 rounded-2xl bg-sky-600 py-3 text-sm font-semibold text-white"
          >
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
              <path d="M2.5 1.5h6l3 3v8h-9zM8.5 1.5v3h3" />
            </svg>
            Ekspor ke Word
          </button>
          <button
            type="button"
            onClick={() => window.alert("Dokumen berhasil diekspor ke PDF.")}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white py-3 text-sm font-semibold text-slate-700 outline outline-1 outline-slate-200"
          >
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
              <path d="M2.5 1.5h6l3 3v8h-9zM8.5 1.5v3h3" />
            </svg>
            Ekspor ke PDF
          </button>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-800">Keterlacakan Sumber</h3>
            <span className="text-sm font-bold text-sky-600">80% Valid</span>
          </div>
          <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-sky-600" style={{ width: "80%" }} />
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              12 klaim terverifikasi
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              3 manual review
            </span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Struktur dokumen (12 bagian)</p>
          <p className="shrink-0 text-xs font-medium text-sky-700">Bagian Aktif: {activeSection} dari 12</p>
        </div>
        <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
          {structureSections.map(item => (
            <button
              key={item.n}
              type="button"
              onClick={() => setActiveSection(item.n)}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                activeSection === item.n ? "bg-sky-600 text-white" : "bg-white text-slate-600 outline outline-1 outline-slate-200"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                  activeSection === item.n ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {item.n}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-sm outline outline-1 outline-slate-200/90">
        <div className="rounded-2xl bg-sky-50/70 p-4 outline outline-1 outline-sky-100">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sky-600">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                <path d="M3.5 1.5h6l3 3v10h-9z" />
                <path d="M6 8.5l1.5 1.5L10 7.5" />
              </svg>
            </span>
            <span className="text-sm font-bold text-sky-900">Ringkasan Utama</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-sky-800">
            Literature review ini menganalisis 15 artikel mengenai resiliensi perempuan dalam menghadapi bencana dan krisis. Tiga tema utama: dukungan sosial, akses sumber daya, dan faktor adaptasi internal.
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
          <p className="text-sm font-bold text-slate-900">
            {activeSection}. {activeLabel}
          </p>
          <p className="shrink-0 text-xs font-medium text-slate-400">Halaman {activeSection} dari 18</p>
        </div>

        <div className="mt-3.5 space-y-3.5">
          {sectionPreview[activeSection]?.map(paragraph => (
            <p key={paragraph} className="text-sm leading-7 text-slate-600">
              {paragraph}
            </p>
          ))}
        </div>

        {nextSection && (
          <button
            type="button"
            onClick={() => {
              setActiveSection(nextSection.n);
              window.alert(`Membuka bagian ${nextSection.n}. ${nextSection.label}.`);
            }}
            className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-4 text-left outline outline-1 outline-slate-200/70"
          >
            <span className="flex h-9 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-sm font-bold text-slate-700">{nextSection.n}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-slate-800">
                {nextSection.n}. {nextSection.label}
              </span>
              <span className="mt-0.5 block text-xs leading-4 text-slate-500">{sectionDescs[nextSection.n]}</span>
            </span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
              <path d="M5 3l4 4-4 4" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}


const mapClusters = [
  { label: "Literasi AI", items: 28, color: "#3b82f6" },
  { label: "Motivasi & Pembelajaran", items: 24, color: "#34d399" },
  { label: "Keterampilan Kognitif", items: 18, color: "#a855f7" },
  { label: "Dampak & Tantangan", items: 12, color: "#fbbf24" },
  { label: "Konteks Pendidikan", items: 8, color: "#9ca3af" },
];

type MapNode = {
  name: string;
  x: number;
  y: number;
  r: number;
  cluster: number;
  year: number;
  labelPos: "inside" | "top" | "bottom" | "left" | "right";
};

const mapMainNodes: MapNode[] = [
  { name: "AI literacy", x: 43, y: 46, r: 46, cluster: 0, year: 2024.2, labelPos: "inside" },
  { name: "generative AI", x: 31, y: 21, r: 22, cluster: 0, year: 2024.8, labelPos: "top" },
  { name: "student engagement", x: 53, y: 15, r: 20, cluster: 1, year: 2023.6, labelPos: "top" },
  { name: "educational technology", x: 82, y: 22, r: 19, cluster: 0, year: 2023.1, labelPos: "top" },
  { name: "learning motivation", x: 64, y: 35, r: 31, cluster: 1, year: 2023.4, labelPos: "right" },
  { name: "critical thinking", x: 47, y: 78, r: 21, cluster: 2, year: 2023.3, labelPos: "bottom" },
  { name: "self-regulated learning", x: 71, y: 55, r: 15, cluster: 2, year: 2022.6, labelPos: "right" },
  { name: "digital literacy", x: 28, y: 81, r: 23, cluster: 3, year: 2023.9, labelPos: "bottom" },
  { name: "higher education", x: 22, y: 57, r: 20, cluster: 3, year: 2022.8, labelPos: "top" },
  { name: "AI anxiety", x: 17, y: 71, r: 12, cluster: 3, year: 2024.6, labelPos: "left" },
  { name: "chatGPT", x: 19, y: 37, r: 16, cluster: 4, year: 2024.9, labelPos: "top" },
  { name: "academic performance", x: 68, y: 80, r: 14, cluster: 4, year: 2022.9, labelPos: "right" },
];

const mapSmallNodes: Array<{ x: number; y: number; r: number; cluster: number }> = [
  { x: 28, y: 14, r: 7, cluster: 0 },
  { x: 38, y: 11, r: 6, cluster: 0 },
  { x: 45, y: 13, r: 5, cluster: 0 },
  { x: 50, y: 12, r: 4, cluster: 0 },
  { x: 30, y: 31, r: 6, cluster: 0 },
  { x: 39, y: 32, r: 5, cluster: 0 },
  { x: 24, y: 29, r: 5, cluster: 0 },
  { x: 35, y: 39, r: 4, cluster: 0 },
  { x: 48, y: 29, r: 5, cluster: 0 },
  { x: 52, y: 27, r: 4, cluster: 0 },
  { x: 30, y: 44, r: 4, cluster: 0 },
  { x: 22, y: 46, r: 5, cluster: 0 },
  { x: 35, y: 55, r: 4, cluster: 0 },
  { x: 43, y: 61, r: 5, cluster: 0 },
  { x: 26, y: 21, r: 4, cluster: 0 },
  { x: 78, y: 13, r: 6, cluster: 0 },
  { x: 86, y: 16, r: 5, cluster: 0 },
  { x: 88, y: 27, r: 5, cluster: 0 },
  { x: 74, y: 29, r: 4, cluster: 0 },
  { x: 84, y: 33, r: 5, cluster: 0 },
  { x: 50, y: 9, r: 6, cluster: 1 },
  { x: 58, y: 12, r: 5, cluster: 1 },
  { x: 63, y: 9, r: 5, cluster: 1 },
  { x: 68, y: 17, r: 6, cluster: 1 },
  { x: 72, y: 25, r: 5, cluster: 1 },
  { x: 60, y: 23, r: 4, cluster: 1 },
  { x: 76, y: 19, r: 4, cluster: 1 },
  { x: 55, y: 29, r: 4, cluster: 1 },
  { x: 62, y: 27, r: 4, cluster: 1 },
  { x: 70, y: 43, r: 4, cluster: 1 },
  { x: 74, y: 34, r: 4, cluster: 1 },
  { x: 66, y: 47, r: 5, cluster: 1 },
  { x: 56, y: 57, r: 7, cluster: 2 },
  { x: 63, y: 59, r: 5, cluster: 2 },
  { x: 60, y: 65, r: 5, cluster: 2 },
  { x: 66, y: 69, r: 6, cluster: 2 },
  { x: 72, y: 63, r: 4, cluster: 2 },
  { x: 55, y: 71, r: 4, cluster: 2 },
  { x: 58, y: 75, r: 5, cluster: 2 },
  { x: 50, y: 85, r: 5, cluster: 2 },
  { x: 44, y: 83, r: 4, cluster: 2 },
  { x: 62, y: 81, r: 4, cluster: 2 },
  { x: 74, y: 71, r: 5, cluster: 2 },
  { x: 16, y: 59, r: 6, cluster: 3 },
  { x: 22, y: 65, r: 5, cluster: 3 },
  { x: 28, y: 69, r: 5, cluster: 3 },
  { x: 34, y: 73, r: 6, cluster: 3 },
  { x: 40, y: 75, r: 5, cluster: 3 },
  { x: 24, y: 78, r: 5, cluster: 3 },
  { x: 18, y: 81, r: 4, cluster: 3 },
  { x: 30, y: 87, r: 5, cluster: 3 },
  { x: 36, y: 84, r: 4, cluster: 3 },
  { x: 20, y: 53, r: 4, cluster: 3 },
  { x: 26, y: 49, r: 5, cluster: 3 },
  { x: 14, y: 67, r: 4, cluster: 3 },
  { x: 18, y: 35, r: 5, cluster: 4 },
  { x: 26, y: 33, r: 4, cluster: 4 },
  { x: 30, y: 41, r: 4, cluster: 4 },
  { x: 16, y: 43, r: 4, cluster: 4 },
  { x: 24, y: 47, r: 4, cluster: 4 },
  { x: 64, y: 75, r: 5, cluster: 4 },
  { x: 68, y: 81, r: 5, cluster: 4 },
  { x: 72, y: 79, r: 4, cluster: 4 },
  { x: 76, y: 85, r: 4, cluster: 4 },
  { x: 58, y: 85, r: 4, cluster: 4 },
  { x: 66, y: 65, r: 4, cluster: 4 },
  { x: 70, y: 59, r: 4, cluster: 4 },
  { x: 74, y: 54, r: 4, cluster: 4 },
];

const mapMainEdges: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 3],
  [2, 4],
  [3, 4],
  [0, 5],
  [0, 6],
  [0, 7],
  [0, 8],
  [1, 9],
  [1, 10],
  [1, 11],
];

const mapYearStops = [
  { year: 2020, rgb: [37, 99, 235] },
  { year: 2021, rgb: [14, 165, 233] },
  { year: 2022, rgb: [45, 212, 191] },
  { year: 2023, rgb: [74, 222, 128] },
  { year: 2024, rgb: [250, 204, 21] },
  { year: 2025, rgb: [251, 146, 60] },
  { year: 2026, rgb: [239, 68, 68] },
];

const mapYearGradient = "linear-gradient(90deg,#2563eb,#0ea5e9,#2dd4bf,#4ade80,#facc15,#fb923c,#ef4444)";

function mapYearColor(year: number) {
  const clamped = Math.max(2020, Math.min(2026, year));
  for (let index = 0; index < mapYearStops.length - 1; index += 1) {
    const start = mapYearStops[index];
    const end = mapYearStops[index + 1];
    if (clamped >= start.year && clamped <= end.year) {
      const ratio = (clamped - start.year) / (end.year - start.year);
      const rgb = start.rgb.map((value, channel) => Math.round(value + (end.rgb[channel] - value) * ratio));
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
  }
  return "rgb(239, 68, 68)";
}

function mapCurve(from: { x: number; y: number }, to: { x: number; y: number }, bend: number) {
  const midX = (from.x + to.x) / 2 + (to.y - from.y) * bend;
  const midY = (from.y + to.y) / 2 - (to.x - from.x) * bend;
  return `M${from.x} ${from.y} Q${midX} ${midY} ${to.x} ${to.y}`;
}

function DesktopResearchMap({ query, onBack }: { query: string; onBack: () => void }) {
  const [mode, setMode] = useState("jaringan");
  const [showLines, setShowLines] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [activeNode, setActiveNode] = useState("AI literacy");
  const [nodeFilter, setNodeFilter] = useState<string | null>(null);
  const [mapSearch, setMapSearch] = useState("");
  const [chip, setChip] = useState("semua");
  const [yearSort, setYearSort] = useState<"asc" | "desc" | null>(null);
  const [relevanSort, setRelevanSort] = useState<"asc" | "desc" | null>(null);
  const [progress, setProgress] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState<number | null>(null);
  const [integratedOpen, setIntegratedOpen] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const graphRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(null);

  const zoomAt = (nextZoom: number, clientX?: number, clientY?: number) => {
    const target = Math.max(50, Math.min(200, nextZoom));
    const rect = graphRef.current?.getBoundingClientRect();
    if (!rect) {
      setZoom(target);
      return;
    }
    const centerX = (clientX ?? rect.left + rect.width / 2) - rect.left;
    const centerY = (clientY ?? rect.top + rect.height / 2) - rect.top;
    setPan(current => {
      const ratio = target / zoom;
      return { x: centerX - (centerX - current.x) * ratio, y: centerY - (centerY - current.y) * ratio };
    });
    setZoom(target);
  };

  const handleMapPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest("button, [data-map-node]")) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleMapPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setPan({ x: drag.originX + event.clientX - drag.startX, y: drag.originY + event.clientY - drag.startY });
  };

  const handleMapPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
  };

  const resetMapView = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    const element = graphRef.current;
    if (!element) return;
    const handleWheel = (event: globalThis.WheelEvent) => {
      event.preventDefault();
      zoomAt(zoom + (event.deltaY > 0 ? -10 : 10), event.clientX, event.clientY);
    };
    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, [zoom]);

  useEffect(() => {
    if (!fullscreen) return;
    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [fullscreen]);

  const nearestMain = (node: { x: number; y: number }) =>
    mapMainNodes.reduce(
      (best, candidate) => {
        const distance = Math.hypot(candidate.x - node.x, candidate.y - node.y);
        return distance < best.distance ? { node: candidate, distance } : best;
      },
      { node: mapMainNodes[0], distance: Number.POSITIVE_INFINITY },
    ).node;

  const edgeList = (() => {
    const list: Array<{ key: string; from: { x: number; y: number }; to: { x: number; y: number }; color: string; year: number; weight: number }> = [];
    mapMainEdges.forEach(([fromIndex, toIndex], index) => {
      const from = mapMainNodes[fromIndex];
      const to = mapMainNodes[toIndex];
      const year = Math.max(from.year, to.year);
      list.push({
        key: `main-${fromIndex}-${toIndex}-${index}`,
        from,
        to,
        color: mode === "perkembangan" ? mapYearColor(year) : mapClusters[from.cluster].color,
        year,
        weight: 1.5,
      });
    });
    mapSmallNodes.forEach((node, index) => {
      const anchor = nearestMain(node);
      const year = anchor.year;
      list.push({
        key: `small-${index}`,
        from: node,
        to: anchor,
        color: mode === "perkembangan" ? mapYearColor(year) : mapClusters[node.cluster].color,
        year,
        weight: 1,
      });
    });
    return list;
  })();

  const playYear = 2020 + 6 * progress;
  const densityScale = 0.55 + 0.45 * progress;
  const pulseScale = 1;

  const tabs = [
    { key: "jaringan", label: "Jaringan" },
    { key: "kepadatan", label: "Kepadatan" },
    { key: "perkembangan", label: "Perkembangan" },
  ];

  const filterChips = [
    { key: "semua", label: "Semua (92)" },
    { key: "relevan", label: "Sangat relevan (24)" },
    { key: "tinjau", label: "Perlu ditinjau (38)" },
    { key: "teori", label: "Ulasan teori (12)" },
    { key: "empiris", label: "Empiris (46)" },
  ];

  const modeInfo =
    mode === "perkembangan"
      ? {
          title: "Peta Perkembangan",
          subtitle: "Menampilkan rata-rata tahun publikasi setiap topik.",
          hint: "Geser slider untuk melihat kapan tiap topik mulai menguat dalam literatur.",
          stats: ["Jumlah item: 90", "Rentang tahun: 2020–2026", "Rata-rata: 2023.6"],
        }
      : mode === "kepadatan"
        ? {
            title: "Peta Kepadatan",
            subtitle: "Menampilkan tingkat konsentrasi topik dalam penelitian.",
            hint: "Geser slider untuk melihat intensitas konsentrasi sitasi pada setiap topik.",
            stats: ["Jumlah item: 90", "Area padat: 5", "Resolusi: 0.85"],
          }
        : {
            title: "Peta Jaringan",
            subtitle: "Menampilkan hubungan antar topik berdasarkan kemunculan bersama.",
            hint: "Geser slider untuk melihat pembentukan hubungan antar topik satu per satu.",
            stats: ["Jumlah item: 90", "Jumlah hubungan: 340", "Topik: 5"],
          };

  const toggleNode = (name: string) => {
    setActiveNode(name);
    setNodeFilter(current => (current === name ? null : name));
  };

  const visibleRows = (() => {
    let rows = priorityRows.map((row, index) => ({ row, node: mapMainNodes[index % mapMainNodes.length].name }));
    if (nodeFilter) rows = rows.filter(item => item.node === nodeFilter);
    rows = rows.filter(item => {
      const { row } = item;
      if (chip === "relevan" && row.tag !== "Sangat relevan") return false;
      if (chip === "tinjau" && row.tag !== "Perlu ditinjau") return false;
      if (chip === "teori" && row.kind !== "Ulasan teori") return false;
      if (chip === "empiris" && row.kind !== "Empiris") return false;
      const q = mapSearch.trim().toLowerCase();
      if (q && !row.title.toLowerCase().includes(q) && !row.source.toLowerCase().includes(q)) return false;
      return true;
    });
    if (yearSort) rows = [...rows].sort((a, b) => (yearSort === "desc" ? b.row.year - a.row.year : a.row.year - b.row.year));
    else if (relevanSort) rows = [...rows].sort((a, b) => (relevanSort === "desc" ? b.row.relevan - a.row.relevan : a.row.relevan - b.row.relevan));
    return rows;
  })();

  const modeIcon =
    mode === "perkembangan" ? (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="15" cy="15" r="11.5" />
        <path d="M15 8.5V15l4.5 3" />
      </svg>
    ) : mode === "kepadatan" ? (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 4.5L27 11l-12 6.5L3 11z" />
        <path d="M3 15.5L15 22l12-6.5" />
        <path d="M3 20L15 26.5 27 20" />
      </svg>
    ) : (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="15" cy="7" r="4" />
        <circle cx="6" cy="23" r="4" />
        <circle cx="24" cy="23" r="4" />
        <path d="M13.2 10.4L7.8 19.6M16.8 10.4l5.4 9.2M10 23h10" />
      </svg>
    );

  const heatSpots = mapMainNodes.map(node => ({ ...node, size: node.r * 5.6 }));

  const analysisRows =
    mode === "kepadatan"
      ? [
          {
            title: "Interpretasi Hasil Analisis",
            subtitle: "Konsentrasi topik pada peta kepadatan",
            paragraphs: [
              "Berdasarkan Peta Kepadatan, area AI Literacy dan Learning Motivation menunjukkan konsentrasi yang relatif tinggi dibandingkan beberapa topik lainnya. Hal ini menunjukkan bahwa kedua topik berada dalam wilayah jaringan dengan banyak item atau bobot yang terkonsentrasi.",
              "Sementara itu, Generative AI, Critical Thinking, dan Self-Regulated Learning memperlihatkan kepadatan yang bervariasi dan relatif lebih rendah pada beberapa area. Perbedaan kepadatan ini dapat membantu pengguna menentukan topik yang perlu ditelusuri lebih jauh. Namun, konsentrasi yang rendah tidak berarti suatu topik belum pernah diteliti.",
            ],
          },
          {
            title: "Kesimpulan dan Implikasi Penelitian",
            subtitle: "Topik padat dan peluang penelusuran lanjutan",
            paragraphs: [
              "AI Literacy dan Learning Motivation merupakan dua area yang memiliki konsentrasi penelitian menonjol dalam kumpulan artikel yang dianalisis. Topik dengan kepadatan lebih rendah, seperti Self-Regulated Learning dan AI Anxiety, dapat menjadi bahan eksplorasi lanjutan untuk mengetahui apakah terdapat pertanyaan penelitian yang belum terjawab.",
              "Kepadatan yang rendah merupakan petunjuk untuk melakukan penelusuran tambahan, bukan bukti adanya research gap.",
            ],
          },
        ]
      : mode === "perkembangan"
        ? [
            {
              title: "Interpretasi Hasil Analisis",
              subtitle: "Rata-rata tahun publikasi tiap topik",
              paragraphs: [
                "Berdasarkan simulasi, diperoleh rata-rata tahun publikasi beberapa topik berikut.",
                "Dalam kumpulan artikel ini, Generative AI memiliki rata-rata tahun publikasi yang lebih baru dibandingkan AI Literacy, Learning Motivation, dan Self-Regulated Learning. Pola tersebut menunjukkan adanya perbedaan waktu publikasi antartopik, dengan Generative AI lebih banyak direpresentasikan oleh artikel yang relatif baru dalam sampel.",
                "Namun, untuk memastikan apakah minat penelitian Generative AI benar-benar meningkat, perlu dibandingkan jumlah publikasi pada setiap tahun.",
              ],
            },
            {
              title: "Kesimpulan dan Implikasi Penelitian",
              subtitle: "Perbedaan periode dan batasan interpretasi",
              paragraphs: [
                "Generative AI dan AI Literacy termasuk topik dengan rata-rata tahun publikasi yang relatif lebih baru, sedangkan Self-Regulated Learning dan Academic Performance memiliki rata-rata yang lebih lama dalam kumpulan artikel ini. Hal tersebut dapat menjadi dasar untuk menelusuri bagaimana pembahasan AI dalam pendidikan berkaitan dengan topik pembelajaran yang sudah lebih dahulu diteliti.",
                "Perbedaan waktu publikasi tidak dengan sendirinya membuktikan adanya perubahan fokus penelitian secara global atau menjamin kebaruan suatu topik.",
              ],
            },
          ]
        : [
            {
              title: "Interpretasi Hasil Analisis",
              subtitle: "Struktur jaringan dan topik dominan",
              paragraphs: [
                "Berdasarkan simulasi 100 artikel penelitian periode 2020–2026, diperoleh 90 kata kunci yang dipetakan, 340 hubungan antarkata kunci, dan 5 kelompok penelitian.",
                "AI Literacy menjadi salah satu topik yang paling menonjol dengan kemunculan dalam 28 artikel, diikuti Learning Motivation (24 artikel) dan Generative AI (21 artikel). Dalam peta, AI Literacy memiliki sejumlah hubungan dengan Learning Motivation, Generative AI, Critical Thinking, serta Student Engagement. Hal ini menunjukkan bahwa literasi AI dibahas bersama dengan berbagai aspek pembelajaran mahasiswa dalam kumpulan artikel yang dianalisis.",
              ],
            },
            {
              title: "Kesimpulan dan Implikasi Penelitian",
              subtitle: "Implikasi dan batasan interpretasi",
              paragraphs: [
                "AI Literacy merupakan salah satu topik sentral dalam jaringan penelitian yang dianalisis. Keterkaitannya dengan Learning Motivation dan topik pembelajaran lainnya menunjukkan adanya ruang untuk menelusuri hubungan kedua variabel lebih lanjut.",
                "Meski demikian, hubungan pada peta belum membuktikan bahwa literasi AI meningkatkan atau menurunkan motivasi belajar. Untuk memahami hubungan tersebut, perlu dilakukan pemeriksaan terhadap metode dan temuan artikel pendukung.",
              ],
            },
          ];

  const perkembanganYears = [
    ["Self-Regulated Learning", "2022,6"],
    ["Academic Performance", "2022,9"],
    ["Learning Motivation", "2023,4"],
    ["Student Engagement", "2023,6"],
    ["AI Literacy", "2024,2"],
    ["Generative AI", "2024,8"],
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-4 pb-10 md:gap-5 md:pb-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold leading-7 text-slate-900 md:text-2xl md:leading-8">Peta Penelitian</h1>
          <p className="mt-1 text-xs leading-5 text-slate-500 md:mt-1.5">
            Jelajahi peta topik dari {priorityRows.length} publikasi, lalu geser slider untuk melihat jaringan, kepadatan sitasi, dan perkembangan tahun terbitnya.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="flex shrink-0 items-center justify-center gap-2 self-start rounded-[9.88px] bg-sky-700 px-4 py-2.5 text-sm font-bold leading-5 text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] md:px-5"
        >
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 6H2M5.5 2.5L2 6l3.5 3.5" />
          </svg>
          Kembali ke Pencarian
        </button>
      </div>

      <section className="rounded-2xl bg-white p-4 shadow-sm md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg bg-slate-100 p-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setMode(tab.key);
                  setProgress(1);
                  setAnalysisOpen(null);
                  resetMapView();
                }}
                className={`rounded-md px-3 py-1.5 text-sm font-medium leading-5 transition-colors ${
                  mode === tab.key ? "bg-white text-sky-700 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {mode !== "kepadatan" && (
            <button
              type="button"
              onClick={() => setShowLines(value => !value)}
              aria-pressed={showLines}
              className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M5.6 8.4l2.8-2.8M4.4 6.4L2.9 7.9a2.47 2.47 0 103.5 3.5l1.5-1.5M9.6 7.6l1.5-1.5a2.47 2.47 0 10-3.5-3.5L6.1 4.1" />
              </svg>
              <span className="text-xs font-medium leading-4 text-slate-500">Garis Relasi</span>
              <span className={`h-4 w-4 rounded-[3px] transition-colors ${showLines ? "bg-sky-700" : "bg-slate-300"}`} />
            </button>
          )}

          <div className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <button
              type="button"
              aria-label="Perkecil peta"
              onClick={() => zoomAt(zoom - 10)}
              className="flex h-6 w-6 items-center justify-center rounded-sm text-sm font-bold text-slate-500 transition-colors hover:bg-slate-50"
            >
              &minus;
            </button>
            <button
              type="button"
              onClick={resetMapView}
              title="Reset tampilan peta"
              className="w-9 rounded-sm text-center text-xs font-semibold leading-4 text-slate-900 transition-colors hover:bg-slate-50"
            >
              {zoom}%
            </button>
            <button
              type="button"
              aria-label="Perbesar peta"
              onClick={() => zoomAt(zoom + 10)}
              className="flex h-6 w-6 items-center justify-center rounded-sm text-sm font-bold text-slate-500 transition-colors hover:bg-slate-50"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => window.alert("Peta klaster berhasil diunduh sebagai gambar.")}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium leading-5 text-slate-900 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6.5 1.5v7M3.8 5.8l2.7 2.7 2.7-2.7M2 11h9" />
            </svg>
            Unduh Gambar
          </button>

          <div className="relative ml-auto">
            <button
              type="button"
              onClick={() => setHelpOpen(value => !value)}
              aria-expanded={helpOpen}
              className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium leading-5 text-slate-900 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-slate-50"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#0369a1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" />
                <path d="M8 7.2v4" />
                <circle cx="8" cy="4.9" r="0.9" fill="#0369a1" stroke="none" />
              </svg>
              Panduan Peta
            </button>
            {helpOpen && (
              <>
                <button
                  type="button"
                  aria-label="Tutup panduan peta"
                  onClick={() => setHelpOpen(false)}
                  className="fixed inset-0 z-20 cursor-default"
                />
                <div
                  role="dialog"
                  aria-label="Cara membaca peta"
                  className="absolute right-0 top-full z-30 mt-2 max-h-[70vh] w-[min(340px,calc(100vw-2.5rem))] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.16)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-bold leading-5 text-slate-900">Cara Membaca Peta</p>
                    <button
                      type="button"
                      aria-label="Tutup"
                      onClick={() => setHelpOpen(false)}
                      className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50"
                    >
                      <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                        <path d="M2.5 2.5l9 9M11.5 2.5l-9 9" />
                      </svg>
                    </button>
                  </div>
                  {mode === "jaringan" && (
                    <p className="mt-2 text-xs leading-5 text-slate-600">
                      Lingkaran menunjukkan kata kunci penelitian. Semakin besar lingkaran, semakin sering kata kunci tersebut muncul. Garis menunjukkan keterkaitan antar topik, sedangkan warna menunjukkan kelompok penelitian dengan tema yang berhubungan.
                    </p>
                  )}

                  {mode === "kepadatan" && (
                    <>
                      <p className="mt-2 text-xs leading-5 text-slate-600">
                        Peta Kepadatan menunjukkan konsentrasi topik dalam kumpulan artikel yang dianalisis melalui perbedaan warna.
                      </p>
                      <div className="mt-3 space-y-2 rounded-lg bg-slate-50 p-3">
                        {[
                          ["#dc2626", "Merah", "Kepadatan sangat tinggi"],
                          ["#eab308", "Kuning", "Kepadatan tinggi"],
                          ["#22c55e", "Hijau", "Kepadatan sedang"],
                          ["#2563eb", "Biru", "Kepadatan rendah"],
                        ].map(([color, name, label]) => (
                          <div key={name} className="flex items-center gap-2.5 text-xs leading-5">
                            <span className="h-4 w-4 shrink-0 rounded-[4px]" style={{ background: color }} />
                            <span className="w-14 shrink-0 font-semibold text-slate-800">{name}</span>
                            <span className="text-slate-600">{label}</span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-xs leading-5 text-slate-600">
                        Semakin hangat warna pada suatu area, semakin tinggi konsentrasi item berbobot di sekitarnya. Warna tidak menunjukkan kualitas penelitian ataupun secara langsung membuktikan adanya research gap.
                      </p>
                    </>
                  )}

                  {mode === "perkembangan" && (
                    <>
                      <p className="mt-2 text-xs leading-5 text-slate-600">
                        Peta Perkembangan membantu kamu melihat perbedaan periode publikasi pada setiap topik penelitian.
                      </p>
                      <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-600">
                        <li>
                          <span className="font-semibold text-slate-800">Warna:</span> menggambarkan rata-rata tahun publikasi artikel yang berkaitan dengan suatu topik, sesuai legenda waktu pada peta.
                        </li>
                        <li>
                          <span className="font-semibold text-slate-800">Lingkaran:</span> menunjukkan topik yang dianalisis.
                        </li>
                        <li>
                          <span className="font-semibold text-slate-800">Garis:</span> menunjukkan hubungan antar topik berdasarkan metode jaringan yang digunakan.
                        </li>
                        <li>
                          <span className="font-semibold text-slate-800">Angka tahun:</span> menunjukkan rata-rata tahun publikasi, bukan tahun pertama kali topik tersebut diteliti.
                        </li>
                      </ul>
                      <p className="mt-3 text-xs leading-5 text-slate-600">
                        Topik dengan rata-rata tahun lebih baru tidak otomatis sedang mengalami peningkatan popularitas. Untuk mengetahui tren pertumbuhan, diperlukan data jumlah publikasi per tahun.
                      </p>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

        </div>

        <div
          className={
            fullscreen
              ? "fixed inset-3 z-[400] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(2,6,23,0.35)] md:inset-6"
              : "mt-4 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          }
        >
          <div className="flex items-start justify-between gap-3 px-4 pt-4 md:gap-4 md:px-6 md:pt-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0">{modeIcon}</span>
              <div>
                <h3 className="font-['Plus_Jakarta_Sans:Bold'] text-xl font-bold leading-7 text-slate-900">{modeInfo.title}</h3>
                <p className="mt-1 text-sm leading-5 text-slate-500">{modeInfo.subtitle}</p>
              </div>
            </div>
            <button
              type="button"
              aria-label={fullscreen ? "Keluar dari layar penuh" : "Tampilkan peta layar penuh"}
              aria-pressed={fullscreen}
              onClick={() => setFullscreen(value => !value)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            >
              {fullscreen ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 2v4H2M10 2v4h4M6 14v-4H2M10 14v-4h4" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" />
                </svg>
              )}
            </button>
          </div>

          <div className={`flex gap-4 px-4 pb-2 pt-3 md:px-6 md:pt-4 ${fullscreen ? "min-h-0 flex-1" : ""}`}>
            <div
              ref={graphRef}
              onPointerDown={handleMapPointerDown}
              onPointerMove={handleMapPointerMove}
              onPointerUp={handleMapPointerUp}
              onPointerCancel={handleMapPointerUp}
              onDoubleClick={resetMapView}
              className={`relative min-w-0 flex-1 touch-none select-none overflow-hidden rounded-xl ${
                dragging ? "cursor-grabbing" : "cursor-grab"
              } ${fullscreen ? "" : "h-[300px] md:h-[430px]"} ${
                mode === "kepadatan"
                  ? "bg-[radial-gradient(circle_at_48%_45%,#1d4ed8_0%,#0b3bb8_55%,#072a8c_100%)]"
                  : "bg-[radial-gradient(circle_at_50%_35%,#f8fbff_0%,#ffffff_65%)]"
              }`}
            >
              {mode === "kepadatan" ? (
                <>
                  <div className="absolute inset-0" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`, transformOrigin: "0 0" }}>
                    {[
                      { x: 8, y: 10, w: 30, h: 34 },
                      { x: 34, y: 62, w: 34, h: 38 },
                      { x: 62, y: 4, w: 30, h: 30 },
                      { x: 74, y: 68, w: 28, h: 32 },
                    ].map((blob, index) => (
                      <span
                        key={`ambient-${index}`}
                        className="absolute rounded-full blur-[42px]"
                        style={{ left: `${blob.x}%`, top: `${blob.y}%`, width: `${blob.w}%`, height: `${blob.h}%`, background: "rgba(56,189,248,0.35)" }}
                      />
                    ))}

                    {heatSpots.map(spot => (
                      <span
                        key={spot.name}
                        className="absolute -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-300"
                        style={{
                          left: `${spot.x}%`,
                          top: `${spot.y}%`,
                          width: spot.size * densityScale * pulseScale,
                          height: spot.size * densityScale * pulseScale * 0.82,
                          opacity: progress <= 0 ? 0 : 1,
                        }}
                      >
                        <span
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: "radial-gradient(circle, rgba(74,222,128,0.95) 0%, rgba(34,197,94,0.5) 40%, rgba(29,78,216,0) 74%)",
                            filter: "blur(14px)",
                          }}
                        />
                        <span
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                          style={{
                            width: "62%",
                            height: "62%",
                            background: "radial-gradient(circle, rgba(250,204,21,0.95) 0%, rgba(250,204,21,0.55) 48%, rgba(250,204,21,0) 78%)",
                            filter: "blur(10px)",
                          }}
                        />
                        <span
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                          style={{
                            width: "34%",
                            height: "34%",
                            background: "radial-gradient(circle, rgba(239,68,68,0.98) 0%, rgba(239,68,68,0.7) 52%, rgba(239,68,68,0) 82%)",
                            filter: "blur(7px)",
                          }}
                        />
                      </span>
                    ))}

                    {mapMainNodes.map(node => (
                      <button
                        key={node.name}
                        type="button"
                        data-map-node
                        onClick={() => toggleNode(node.name)}
                        aria-pressed={nodeFilter === node.name}
                        aria-label={`Saring publikasi topik ${node.name}`}
                        className="absolute flex cursor-pointer -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 text-left"
                        style={{ left: `${node.x}%`, top: `${node.y}%`, opacity: 0.55 + 0.45 * progress }}
                      >
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)]" />
                        <span className="whitespace-nowrap text-[13px] font-extrabold leading-4 text-white [text-shadow:0_1px_6px_rgba(2,20,80,0.9)]">
                          {node.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="absolute inset-0" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`, transformOrigin: "0 0" }}>
                  {[
                    { x: 12, y: 12, size: 340, color: "rgba(59,130,246,0.16)" },
                    { x: 46, y: 6, size: 320, color: "rgba(52,211,153,0.16)" },
                    { x: 68, y: 24, size: 360, color: "rgba(168,85,247,0.14)" },
                    { x: 6, y: 56, size: 300, color: "rgba(251,191,36,0.16)" },
                    { x: 76, y: 62, size: 260, color: "rgba(156,163,175,0.16)" },
                  ].map((blob, index) => (
                    <span
                      key={`glow-${index}`}
                      className="absolute rounded-full blur-[70px] transition-opacity duration-300"
                      style={{
                        left: `${blob.x}%`,
                        top: `${blob.y}%`,
                        width: blob.size,
                        height: blob.size,
                        background: blob.color,
                        opacity: mode === "perkembangan" ? 0.7 : 1,
                      }}
                    />
                  ))}

                  {showLines && (
                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                      {edgeList.map((edge, index) => {
                        const bend = index % 2 === 0 ? 0.06 : -0.06;
                        const drawn = mode === "jaringan" ? Math.max(0, Math.min(1, (progress - index * 0.006) * 1.9)) : 1;
                        const visible = mode !== "perkembangan" || edge.year <= playYear;
                        const opacity =
                          mode === "jaringan" ? 0.42 : mode === "perkembangan" ? (visible ? 0.4 : 0.05) : 0.2;
                        return (
                          <path
                            key={edge.key}
                            d={mapCurve(edge.from, edge.to, bend)}
                            fill="none"
                            stroke={edge.color}
                            strokeWidth={mode === "jaringan" ? edge.weight : 1}
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                            style={{ opacity, transition: "opacity 250ms linear" }}
                          />
                        );
                      })}
                    </svg>
                  )}

                  {mapSmallNodes.map((node, index) => {
                    const anchor = nearestMain(node);
                    const appeared = mode !== "perkembangan" || anchor.year <= playYear;
                    const color = mode === "perkembangan" ? mapYearColor(anchor.year) : mapClusters[node.cluster].color;
                    const reveal = mode === "jaringan" ? Math.max(0, Math.min(1, (progress - index * 0.004) * 2.2)) : 1;
                    return (
                      <span
                        key={`small-${index}`}
                        className="absolute rounded-full transition-[opacity,transform] duration-300"
                        style={{
                          left: `${node.x}%`,
                          top: `${node.y}%`,
                          width: node.r * 2,
                          height: node.r * 2,
                          marginLeft: -node.r,
                          marginTop: -node.r,
                          background: color,
                          opacity: (appeared ? 0.9 : 0.14) * reveal,
                          transform: `scale(${0.6 + 0.4 * reveal})`,
                          boxShadow: `0 2px 6px -1px ${color}66`,
                        }}
                      />
                    );
                  })}

                  {mapMainNodes.map((node, index) => {
                    const appeared = mode !== "perkembangan" || node.year <= playYear;
                    const color = mode === "perkembangan" ? mapYearColor(node.year) : mapClusters[node.cluster].color;
                    const reveal = mode === "jaringan" ? Math.max(0, Math.min(1, 0.35 + (progress - index * 0.012) * 2.4)) : 1;
                    const active = activeNode === node.name;
                    const labelPos = mode === "perkembangan" && node.labelPos === "inside" ? "right" : node.labelPos;
                    const labelGap = node.r + 12;
                    const translate =
                      labelPos === "inside"
                        ? "translate(-50%, -50%)"
                        : labelPos === "top"
                          ? `translate(-50%, calc(-100% - ${labelGap}px))`
                          : labelPos === "bottom"
                            ? `translate(-50%, ${labelGap}px)`
                            : labelPos === "left"
                              ? `translate(calc(-100% - ${labelGap}px), -50%)`
                              : `translate(${labelGap}px, -50%)`;
                    const textAlign = labelPos === "left" ? "right" : labelPos === "right" ? "left" : "center";
                    return (
                      <div key={node.name} className="absolute z-10" style={{ left: `${node.x}%`, top: `${node.y}%`, opacity: appeared ? 1 : 0.5 }}>
                        <button
                          type="button"
                          onClick={() => toggleNode(node.name)}
                          aria-pressed={nodeFilter === node.name}
                          aria-label={`Saring publikasi topik ${node.name}`}
                          className="absolute left-0 top-0 rounded-full border-[3px] border-white transition-transform duration-200"
                          style={{
                            width: node.r * 2,
                            height: node.r * 2,
                            transform: `translate(-50%, -50%) scale(${reveal})`,
                            background: color,
                            backgroundImage:
                              "linear-gradient(145deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 52%)",
                            boxShadow: active
                              ? `0 0 0 4px ${color}33, 0 10px 24px -8px ${color}cc`
                              : `0 8px 22px -8px ${color}99`,
                            filter: appeared ? "none" : "grayscale(0.85)",
                          }}
                        />
                        <span
                          data-map-node
                          onClick={() => toggleNode(node.name)}
                          className={`absolute cursor-pointer whitespace-nowrap ${
                            labelPos === "inside"
                              ? "text-[19px] font-extrabold leading-6 text-slate-900"
                              : "text-[13px] font-extrabold leading-[18px] text-slate-900"
                          }`}
                          style={{ transform: translate, textAlign }}
                        >
                          <span className="block">{node.name}</span>
                          {mode === "perkembangan" && (
                            <span className="block text-[12px] font-bold text-slate-500">({node.year.toFixed(1)})</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <span
                className={`pointer-events-none absolute bottom-2.5 left-2.5 z-20 rounded-md px-2 py-1 text-[10px] font-medium leading-4 shadow-sm backdrop-blur-sm ${
                  mode === "kepadatan" ? "bg-[#072a8c]/75 text-white/85" : "bg-white/85 text-slate-500"
                }`}
              >
                Geser untuk memindahkan · Scroll untuk zoom · Klik topik untuk menyaring
              </span>
            </div>

          </div>

          {mode !== "jaringan" && (
            <div className="px-5 pb-1 md:px-6">
              {mode === "perkembangan" ? (
                <div className="mx-auto max-w-[900px]">
                  <div className="h-3.5 rounded-full" style={{ backgroundImage: mapYearGradient }} />
                  <div className="mt-2 flex justify-between text-xs font-medium leading-4 text-slate-500">
                    {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map(year => (
                      <span key={year}>{year}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium leading-5 text-slate-500">
                  <span>Rendah</span>
                  <span className="h-3.5 w-[420px] max-w-full rounded-full" style={{ backgroundImage: mapYearGradient }} />
                  <span>Tinggi</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-slate-100 px-5 py-3 md:px-6">
            <span className="w-14 shrink-0 text-xs font-semibold leading-4 text-slate-700">
              {mode === "perkembangan" ? playYear.toFixed(1) : `${Math.round(progress * 100)}%`}
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(progress * 100)}
              onChange={event => setProgress(Number(event.target.value) / 100)}
              aria-label="Kontrol simulasi peta"
              className="h-1.5 min-w-32 flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#0369a1]"
            />
            <span className="shrink-0 text-[11px] leading-4 text-slate-400">
              {mode === "perkembangan" ? "Simulasi tahun 2020–2026" : modeInfo.hint}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 px-5 py-3 text-sm leading-5 text-slate-500 md:px-6">
            {modeInfo.stats.map((stat, index) => (
              <span key={stat} className="flex items-center gap-4">
                {index > 0 && <span className="h-4 w-px bg-slate-300" />}
                {stat}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white outline outline-1 outline-offset-[-1px] outline-slate-200/90">
        <div className="flex flex-col gap-3 border-b border-slate-200/70 p-4 md:flex-row md:items-start md:justify-between md:gap-4 md:p-7">
          <div className="flex items-start gap-3">
            <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-sky-700">
              <svg width="12" height="13" viewBox="0 0 12 13" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="7" height="7" rx="1.5" fill="white" />
                <rect x="4.5" y="5" width="6.5" height="6.5" rx="1.5" fill="#bae6fd" />
              </svg>
            </span>
            <div>
              <h2 className="text-lg font-semibold leading-7 text-slate-900">Rekomendasi Jurnal Peta Penelitian</h2>
              <p className="mt-0.5 text-sm leading-5 text-slate-500">Daftar publikasi berbobot tinggi yang merepresentasikan klaster yang sedang aktif dipilih.</p>
            </div>
          </div>
          <label className="flex h-10 w-72 shrink-0 items-center gap-2 rounded-xl bg-slate-50 px-3">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <circle cx="6" cy="6" r="4.5" />
              <path d="M9.5 9.5L13 13" />
            </svg>
            <input
              value={mapSearch}
              onChange={event => setMapSearch(event.target.value)}
              placeholder="Cari judul, penulis, atau kata kunci..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/70 px-4 py-3 md:px-7 md:py-3.5">
          {filterChips.map(item => (
            <button
              key={item.key}
              type="button"
              onClick={() => setChip(item.key)}
              className={`rounded-full px-3 py-1 text-sm font-medium leading-5 transition-colors ${
                chip === item.key ? "bg-blue-50 text-blue-700 outline outline-1 outline-blue-200" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
          {nodeFilter && (
            <button
              type="button"
              onClick={() => setNodeFilter(null)}
              className="flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-sm font-medium leading-5 text-sky-700 outline outline-1 outline-sky-200"
            >
              Klaster: {nodeFilter}
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M1.5 1.5l6 6M7.5 1.5l-6 6" />
              </svg>
            </button>
          )}
        </div>

        <div className="hidden max-h-[430px] overflow-auto md:block">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="bg-slate-50/60">
                <th className="px-7 py-3 text-xs font-semibold text-slate-500">Judul</th>
                <th className="w-24 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRelevanSort(null);
                      setYearSort(yearSort === "desc" ? "asc" : "desc");
                    }}
                    className={`flex items-center gap-1.5 text-xs font-semibold ${yearSort ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Tahun
                    <SortArrow dir={yearSort} />
                  </button>
                </th>
                <th className="w-44 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      setYearSort(null);
                      setRelevanSort(relevanSort === "desc" ? "asc" : "desc");
                    }}
                    className={`flex items-center gap-1.5 text-xs font-semibold ${relevanSort ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Relevansi
                    <SortArrow dir={relevanSort} />
                  </button>
                </th>
                <th className="w-44 px-4 py-3 text-xs font-semibold text-slate-500">Sumber</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-7 py-8 text-center text-sm text-slate-400">
                    Tidak ada artikel yang cocok dengan pencarianmu.
                  </td>
                </tr>
              )}
              {visibleRows.map(({ row }) => (
                <tr key={row.title} className="border-t border-slate-100">
                  <td className="max-w-[514px] px-7 py-4 text-base font-semibold leading-6 text-slate-800">{row.title}</td>
                  <td className="px-4 py-4 text-sm font-medium text-slate-600">{row.year}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        row.tag === "Sangat relevan"
                          ? "bg-emerald-50 text-emerald-700 outline outline-1 outline-emerald-200/60"
                          : row.tag === "Cukup relevan"
                            ? "bg-blue-50 text-blue-700 outline outline-1 outline-blue-200/60"
                            : "bg-amber-50 text-amber-700 outline outline-1 outline-amber-200/60"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          row.tag === "Sangat relevan" ? "bg-emerald-500" : row.tag === "Cukup relevan" ? "bg-blue-500" : "bg-amber-500"
                        }`}
                      />
                      {row.tag}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="flex items-center gap-2.5">
                      <img
                        src={sourceLogos[row.source] ?? "/assets/source-logos/openalex.svg"}
                        alt=""
                        className="h-6 w-6 shrink-0 object-contain"
                      />
                      <span className="text-sm text-slate-600">{row.source}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden">
          {visibleRows.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-slate-400">Tidak ada artikel yang cocok dengan pencarianmu.</p>
          )}
          {visibleRows.map(({ row }) => (
            <div key={row.title} className="border-t border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold leading-5 text-slate-800">{row.title}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-xs font-medium text-slate-600">{row.year}</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    row.tag === "Sangat relevan"
                      ? "bg-emerald-50 text-emerald-700 outline outline-1 outline-emerald-200/60"
                      : row.tag === "Cukup relevan"
                        ? "bg-blue-50 text-blue-700 outline outline-1 outline-blue-200/60"
                        : "bg-amber-50 text-amber-700 outline outline-1 outline-amber-200/60"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      row.tag === "Sangat relevan" ? "bg-emerald-500" : row.tag === "Cukup relevan" ? "bg-blue-500" : "bg-amber-500"
                    }`}
                  />
                  {row.tag}
                </span>
                <span className="flex min-w-0 items-center gap-1.5">
                  <img src={sourceLogos[row.source] ?? "/assets/source-logos/openalex.svg"} alt="" className="h-4 w-4 shrink-0 object-contain" />
                  <span className="truncate text-xs text-slate-600">{row.source}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm md:p-6">
        <div>
          <h2 className="text-lg font-semibold leading-7 text-slate-900">
            {mode === "kepadatan" ? "Analisis Peta Kepadatan" : mode === "perkembangan" ? "Analisis Peta Perkembangan" : "Analisis Peta Jaringan"}
          </h2>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            Ringkasan otomatis berdasarkan parameter peta yang sedang ditampilkan.
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {analysisRows.map((item, index) => {
            const isOpen = analysisOpen === index;
            return (
              <div key={item.title} className="overflow-hidden rounded-2xl bg-slate-50/80 outline outline-1 outline-offset-[-1px] outline-slate-200/70">
                <button
                  type="button"
                  onClick={() => setAnalysisOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-100/70"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-semibold text-sky-700 outline outline-1 outline-offset-[-1px] outline-slate-200">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold leading-6 text-slate-900">{item.title}</span>
                    <span className="mt-0.5 block text-sm leading-5 text-slate-500">{item.subtitle}</span>
                  </span>
                  <svg
                    width="9"
                    height="14"
                    viewBox="0 0 9 14"
                    fill="none"
                    stroke="#0369a1"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className={`shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
                  >
                    <path d="M1.5 1.5L7 7l-5.5 5.5" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="border-t border-slate-200/70 px-5 py-5">
                    <div className="space-y-3">
                      {item.paragraphs.map(paragraph => (
                        <p key={paragraph} className="text-sm leading-7 text-slate-600">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    {mode === "perkembangan" && index === 0 && (
                      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <div className="grid grid-cols-2 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">
                          <span>Topik</span>
                          <span className="text-right">Rata-rata tahun</span>
                        </div>
                        {perkembanganYears.map(([topic, year]) => (
                          <div key={topic} className="grid grid-cols-2 border-t border-slate-100 px-4 py-2 text-sm text-slate-700">
                            <span>{topic}</span>
                            <span className="text-right font-semibold text-slate-800">{year}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm md:p-6">
        <button
          type="button"
          onClick={() => setIntegratedOpen(value => !value)}
          aria-expanded={integratedOpen}
          className="flex w-full items-center justify-between gap-4 text-left"
        >
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-semibold leading-7 text-slate-900">Analisis Peta Penelitian</span>
            </span>
            <span className="mt-1 block text-sm leading-5 text-slate-500">
              Gabungan temuan Peta Jaringan, Kepadatan, dan Perkembangan.
            </span>
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="#0369a1"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`shrink-0 transition-transform ${integratedOpen ? "rotate-90" : ""}`}
          >
            <path d="M5 2.5L9.5 7 5 11.5" />
          </svg>
        </button>

        {integratedOpen && (
          <div className="mt-5 space-y-6 border-t border-slate-100 pt-5">
            <div>
              <h3 className="text-base font-bold leading-6 text-slate-900">1. Analisis Keterkaitan Antar Topik Penelitian</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Peta Jaringan menunjukkan bahwa AI Literacy memiliki keterhubungan dengan berbagai topik pembelajaran, termasuk Learning Motivation, Critical Thinking, dan Student Engagement.
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Hal ini menunjukkan adanya keterkaitan tematik dalam artikel yang dianalisis, tetapi belum membuktikan hubungan sebab-akibat di antara variabel tersebut.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold leading-6 text-slate-900">2. Analisis Konsentrasi Penelitian</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Peta Kepadatan menunjukkan bahwa AI Literacy dan Learning Motivation berada pada area dengan konsentrasi relatif tinggi.
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Kondisi ini mengindikasikan bahwa kedua topik memiliki posisi menonjol dalam kumpulan literatur, sedangkan beberapa topik lain berada pada area dengan konsentrasi lebih rendah.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold leading-6 text-slate-900">3. Analisis Perkembangan Publikasi Ilmiah</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Peta Perkembangan menunjukkan bahwa Generative AI memiliki rata-rata tahun publikasi yang lebih baru dibandingkan Learning Motivation dan beberapa topik pembelajaran lainnya.
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Perbedaan ini dapat menjadi petunjuk untuk menelusuri pembahasan AI yang lebih baru dalam konteks pendidikan, meskipun belum cukup untuk menyimpulkan adanya peningkatan tren penelitian.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold leading-6 text-slate-900">4. Identifikasi Potensi Arah Penelitian</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Berdasarkan gabungan ketiga peta, beberapa hubungan yang layak ditelusuri lebih lanjut dalam contoh simulasi adalah:
              </p>
              <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
                  AI Literacy dan Learning Motivation.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
                  Generative AI dan Self-Regulated Learning.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
                  AI Literacy dan Critical Thinking.
                </li>
              </ul>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Ketiga hubungan tersebut merupakan arah eksplorasi, bukan research gap yang telah tervalidasi. Pemeriksaan artikel pendukung diperlukan untuk mengetahui temuan, metode, keterbatasan, dan pertanyaan yang belum terjawab.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold leading-6 text-slate-900">5. Sintesis Temuan dan Implikasi Penelitian</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Berdasarkan simulasi 100 artikel ilmiah, AI Literacy dan Learning Motivation memiliki keterkaitan yang menonjol dalam jaringan penelitian serta berada pada area dengan konsentrasi relatif tinggi.
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Sementara itu, Generative AI memiliki rata-rata tahun publikasi yang relatif lebih baru, sehingga dapat menjadi salah satu topik untuk ditelusuri dalam kaitannya dengan motivasi dan proses pembelajaran mahasiswa.
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Secara keseluruhan, ketiga peta memberikan gambaran mengenai hubungan, konsentrasi, dan perbedaan waktu publikasi. Hasil ini dapat membantu menentukan fokus penelusuran literatur berikutnya, tetapi belum cukup untuk memastikan kebaruan penelitian atau menetapkan research gap.
              </p>
            </div>
          </div>
        )}
      </section>

      <p className="text-center text-xs text-slate-400">Kata kunci pencarian: {query.trim() || "resiliensi perempuan pasca bencana"}</p>
    </div>
  );
}

export default function CariJurnalFigmaPanel({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<JournalView>("home");
  const [query, setQuery] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [fileName, setFileName] = useState("");
  const [useActiveFilter, setUseActiveFilter] = useState(true);
  const [fileSizeLabel, setFileSizeLabel] = useState("");
  const [mobileSearchStage, setMobileSearchStage] = useState<"home" | "loading" | "results">("home");
  const [desktopStage, setDesktopStage] = useState<"home" | "loading" | "results">("home");
  const [searchType, setSearchType] = useState<"journal" | "review" | "map">("journal");
  const [reviewTopic, setReviewTopic] = useState("AI Literacy dan Motivasi Belajar Mahasiswa");
  const [reviewPeriod, setReviewPeriod] = useState("2020-2026");
  const [reviewCount, setReviewCount] = useState("100");
  const [reviewTopics, setReviewTopics] = useState<string[]>([]);
  const [resultMode, setResultMode] = useState<"search" | "analysis">("search");
  const [temuanIndex, setTemuanIndex] = useState(1);
  const [mobileNavHidden, setMobileNavHidden] = useState(false);
  const lastMobileScrollY = useRef(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [folders, setFolders] = useState<CollectionFolder[]>(defaultFolders);
  const [savedJournals, setSavedJournals] = useState<SavedJournal[]>(initialSavedJournals);
  const [activeFolderId, setActiveFolderId] = useState("all");
  const [folderSelectMode, setFolderSelectMode] = useState(false);
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [ringkasanOpen, setRingkasanOpen] = useState(false);
  const [tabelOpen, setTabelOpen] = useState(false);
  const [sitasiOpen, setSitasiOpen] = useState(false);
  const [abstrakOpen, setAbstrakOpen] = useState(false);
  const [hapusJournalId, setHapusJournalId] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const showToast = (message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = { all: savedJournals.length };
    for (const folder of folders) counts[folder.id] = 0;
    for (const journal of savedJournals) counts[journal.folderId] = (counts[journal.folderId] ?? 0) + 1;
    return counts;
  }, [savedJournals, folders]);

  const savedIds = useMemo(() => savedJournals.map(journal => journal.id), [savedJournals]);

  const collectionJournals = useMemo(
    () => (activeFolderId === "all" ? savedJournals : savedJournals.filter(journal => journal.folderId === activeFolderId)),
    [savedJournals, activeFolderId],
  );

  const toggleSaveJournal = (journal: Omit<SavedJournal, "folderId">) => {
    if (savedJournals.some(item => item.id === journal.id)) {
      setSavedJournals(list => list.filter(item => item.id !== journal.id));
      showToast("Jurnal dihapus dari Koleksi");
    } else {
      setSavedJournals(list => [...list, { ...journal, folderId: "ungrouped" }]);
      showToast("Jurnal disimpan ke Koleksi");
    }
  };

  const moveJournal = (journalId: string, folderId: string) => {
    const folder = folders.find(item => item.id === folderId);
    setSavedJournals(list => list.map(item => (item.id === journalId ? { ...item, folderId } : item)));
    showToast(`Jurnal dipindahkan ke folder ${folder?.name ?? "Belum dikelompokkan"}`);
  };

  const removeSavedJournal = (journalId: string) => {
    setSavedJournals(list => list.filter(item => item.id !== journalId));
    showToast("Jurnal dihapus dari Koleksi");
  };

  const hapusJournal = savedJournals.find(journal => journal.id === hapusJournalId) ?? null;

  const confirmRemoveSavedJournal = () => {
    if (hapusJournalId) removeSavedJournal(hapusJournalId);
    setHapusJournalId(null);
  };

  const toggleFolderSelection = (folderId: string) => {
    setSelectedFolderIds(list => (list.includes(folderId) ? list.filter(item => item !== folderId) : [...list, folderId]));
  };

  const exitFolderSelect = () => {
    setFolderSelectMode(false);
    setSelectedFolderIds([]);
  };

  const deleteSelectedFolders = () => {
    if (selectedFolderIds.length === 0) return;
    setSavedJournals(list => list.map(item => (selectedFolderIds.includes(item.folderId) ? { ...item, folderId: "ungrouped" } : item)));
    setFolders(list => list.filter(folder => !selectedFolderIds.includes(folder.id)));
    if (selectedFolderIds.includes(activeFolderId)) setActiveFolderId("all");
    const count = selectedFolderIds.length;
    exitFolderSelect();
    showToast(`${count} folder dihapus, jurnal dipindahkan ke Belum dikelompokkan`);
  };

  const createFolder = (name: string) => {
    const id = `folder-${Date.now()}`;
    setFolders(list => [...list, { id, name }]);
    setActiveFolderId(id);
    setDesktopStage("home");
    setMobileSearchStage("home");
    setView("collection");
    showToast(`Folder ${name} dibuat`);
  };

  const startSearching = () => {
    setDesktopStage("home");
    setMobileSearchStage("home");
    setView("home");
  };

  const changeView = (next: JournalView) => {
    setView(next);
    setDesktopStage("home");
    setMobileSearchStage("home");
    setMobileNavHidden(false);
  };

  useEffect(() => {
    if (mobileSearchStage !== "loading") return;
    const timer = window.setTimeout(() => setMobileSearchStage("results"), 2400);
    return () => window.clearTimeout(timer);
  }, [mobileSearchStage]);

  useEffect(() => {
    setMobileNavHidden(false);
    lastMobileScrollY.current = 0;
  }, [view, mobileSearchStage]);

  const handleMobileScroll = (event: UIEvent<HTMLElement>) => {
    const y = event.currentTarget.scrollTop;
    const delta = y - lastMobileScrollY.current;
    if (y < 24 || Math.abs(delta) > 120) setMobileNavHidden(false);
    else if (delta > 6) setMobileNavHidden(true);
    else if (delta < -6) setMobileNavHidden(false);
    lastMobileScrollY.current = y;
  };

  useEffect(() => {
    if (desktopStage !== "loading") return;
    const timer = window.setTimeout(() => setDesktopStage("results"), 2400);
    return () => window.clearTimeout(timer);
  }, [desktopStage]);

  const runSearch = () => {
    if (query.trim() || paragraph.trim() || fileName) setDesktopStage("loading");
  };

  const startStructuredSearch = (type: "review" | "map") => {
    const topic = reviewTopic.trim();
    if (topic.length < 3) return;
    setQuery(topic);
    setSearchType(type);
    setResultMode("search");
    if (window.matchMedia("(min-width: 768px)").matches) setDesktopStage("loading");
    else setMobileSearchStage("loading");
  };

  const reviewTopicSuggestions = [
    "AI Literacy in Higher Education",
    "Learning Motivation and Academic Achievement",
    "Generative AI in Education",
    "Digital Literacy and Student Engagement",
  ];

  const mapTopicSuggestions = [
    "Research Trends in AI Education",
    "Publication Network and Collaboration",
    "Topic Clusters in Learning Motivation",
    "Emerging Research Directions 2020–2026",
  ];

  const topicSuggestions = searchType === "map" ? mapTopicSuggestions : reviewTopicSuggestions;

  const guideContent: { title: string; intro: string; steps: { title?: string; description: string }[] } | null =
    searchType === "review"
      ? {
          title: "Tiga langkah menyusun literatur review",
          intro: "Tentukan kebutuhan penelitianmu agar Alerin dapat menemukan jurnal yang relevan dan menyusun literatur review sesuai topikmu.",
          steps: [
            {
              title: "Masukkan topik penelitian",
              description: "Tuliskan topik penelitian atau pilih rekomendasi dari Alerin sesuai kebutuhanmu.",
            },
            {
              title: "Tentukan periode publikasi",
              description: "Pilih rentang tahun publikasi jurnal yang ingin digunakan sebagai referensi penelitian.",
            },
            {
              title: "Tentukan jumlah jurnal",
              description: "Pilih jumlah jurnal yang dibutuhkan untuk menyusun literatur review.",
            },
          ],
        }
      : searchType === "map"
        ? {
            title: "Tiga langkah menyusun peta penelitian",
            intro: "Tentukan kebutuhan penelitianmu agar Alerin dapat menemukan jurnal yang relevan dan menyusun peta penelitian untuk melihat keterkaitan topik, kepadatan kajian, serta perkembangan penelitian.",
            steps: [
              {
                title: "Masukkan topik penelitian",
                description: "Tuliskan topik penelitian atau pilih rekomendasi dari Alerin sesuai kebutuhanmu.",
              },
              {
                title: "Tentukan periode publikasi",
                description: "Pilih rentang tahun publikasi jurnal yang ingin dianalisis untuk melihat perkembangan penelitian.",
              },
              {
                title: "Tentukan jumlah jurnal",
                description: "Pilih jumlah jurnal yang akan digunakan sebagai dasar penyusunan peta penelitian.",
              },
            ],
          }
        : null;

  const toggleReviewTopic = (topic: string) => {
    setReviewTopics(list => (list.includes(topic) ? list.filter(item => item !== topic) : [...list, topic]));
  };

  const openRiwayatPencarian = (title: string) => {
    setView("home");
    setQuery(title);
    setSearchType("journal");
    setResultMode("search");
    setDesktopStage("loading");
  };

  const canSearch = query.trim().length >= 3;
  const analysisReady = Boolean(fileName) || paragraph.trim().length >= 5;
  const quickActive = query.trim().length > 0;
  const referenceActive = paragraph.trim().length > 0 || Boolean(fileName);
  const primaryDisabled = quickActive ? !canSearch : !analysisReady;

  const renderKutipanUnderline = (text: string) => {
    const parts = text.split(/(keputusan pembelian|seluruh kelompok usia)/g);
    return parts.map((part, index) =>
      part === "keputusan pembelian" || part === "seluruh kelompok usia" ? (
        <span key={index} className="border-b-2 border-red-500 font-medium text-slate-900">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileSizeLabel(`${(file.size / 1048576).toFixed(1)} MB`);
    event.target.value = "";
  };

  return (
    <div className="fixed inset-0 z-[300] flex h-dvh w-full overflow-hidden bg-[#f4f7fb] font-['Inter:Regular'] text-[#0f172a] md:bg-[#f3f6f9]">
      <Sidebar
        view={view}
        onView={changeView}
        onUpgrade={() => setUpgradeOpen(true)}
        onOpenRiwayat={openRiwayatPencarian}
      />

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

        <main onScroll={handleMobileScroll} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-28 pt-7 md:p-7">
          {mobileSearchStage === "loading" && view === "home" && (
            <div className="fixed inset-x-0 bottom-[68px] top-[65px] z-[305] flex flex-col items-center justify-center overflow-hidden bg-[#f4f7fb] px-6 md:hidden">
              <SearchLoader />
              <h1 className="text-center font-['Plus_Jakarta_Sans:ExtraBold'] text-[21px] font-extrabold tracking-[-0.5px] text-[#313131]">
                {searchType === "review" ? "Menyusun Tinjauan Literatur" : resultMode === "analysis" ? "Menganalisis Naskahmu" : "Menulusuri Jurnal Untukmu"}
              </h1>
              <p className="mt-2 max-w-[290px] animate-pulse text-center text-xs leading-5 text-[#71717a]">
                {searchType === "review"
                  ? "Alerin sedang menggabungkan, memeringkat, dan merapikan artikel untuk tinjauan literaturmu."
                  : resultMode === "analysis"
                    ? "Alerin sedang membaca dokumenmu dan menyiapkan temuan serta rekomendasi sitasi."
                    : "Alerin sedang mencari jurnal berdasarkan informasi yang kamu berikan."}
              </p>
            </div>
          )}

          {mobileSearchStage === "results" && view === "home" && (
            <div onScroll={handleMobileScroll} className={`fixed inset-x-0 top-[65px] z-[305] overflow-y-auto overflow-x-hidden bg-[#f4f7fb] px-4 pt-4 transition-[bottom] duration-300 ease-out md:hidden ${mobileNavHidden ? "bottom-0 pb-16" : "bottom-[68px] pb-6"}`}>
              <div className="mx-auto max-w-md">
                {searchType !== "map" && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Kembali ke pencarian"
                      onClick={() => {
                        setMobileSearchStage("home");
                        setSearchType("journal");
                      }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm"
                    >
                      <img src="/assets/jurnal-design/search-flow/19ff4.svg" alt="" />
                    </button>
                    <h1 className="font-['Plus_Jakarta_Sans:Bold'] text-base font-bold tracking-[-0.4px]">Rekomendasi yang paling relevan</h1>
                  </div>
                )}

                {searchType === "map" ? (
                  <div className="mt-1">
                    <DesktopResearchMap
                      query={query}
                      onBack={() => {
                        setMobileSearchStage("home");
                        setSearchType("journal");
                      }}
                    />
                  </div>
                ) : searchType === "review" ? (
                  <div className="mt-5">
                    <MobileLiteratureReview />
                  </div>
                ) : (
                  <>
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
                        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-600 outline outline-1 outline-sky-600/40">
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M1 4l2.5 2.5L9 1" />
                          </svg>
                          Selesai
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-4 gap-1.5">
                        {[
                          { value: "7", label: "Temuan", box: "bg-slate-50 outline-slate-100", valueTone: "text-blue-600", labelTone: "text-slate-500" },
                          { value: "3", label: "Bermasalah", box: "bg-rose-50 outline-rose-100", valueTone: "text-rose-600", labelTone: "text-rose-700" },
                          { value: "2", label: "Kurang Kuat", box: "bg-slate-50 outline-slate-100", valueTone: "text-slate-700", labelTone: "text-slate-500" },
                          { value: "2", label: "Ref. Lemah", box: "bg-slate-50 outline-slate-100", valueTone: "text-slate-700", labelTone: "text-slate-500" },
                        ].map(item => (
                          <div key={item.label} className={`rounded-2xl p-2 text-center outline outline-1 ${item.box}`}>
                            <p className={`text-lg font-extrabold leading-6 ${item.valueTone}`}>{item.value}</p>
                            <p className={`mt-0.5 text-[9px] font-medium leading-3 ${item.labelTone}`}>{item.label}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-xl font-bold text-slate-900">Temuan {temuanIndex} dari 7</h2>
                          <span className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 outline outline-1 outline-blue-100">
                            Halaman {temuanAnalisis[temuanIndex - 1].halaman}
                          </span>
                        </div>
                        <div className="flex shrink-0 gap-1.5">
                          <button
                            type="button"
                            aria-label="Temuan sebelumnya"
                            onClick={() => setTemuanIndex(index => Math.max(1, index - 1))}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-base text-slate-400 outline outline-1 outline-slate-200"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            aria-label="Temuan berikutnya"
                            onClick={() => setTemuanIndex(index => Math.min(7, index + 1))}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-base text-slate-700 outline outline-1 outline-slate-200"
                          >
                            ›
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 outline outline-1 outline-rose-200">
                        <p className="text-xs font-bold uppercase tracking-wide text-rose-700">⚠ {temuanAnalisis[temuanIndex - 1].badge}</p>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm font-bold text-slate-700">Bagian yang perlu diperbaiki:</p>
                        <blockquote className="mt-2 rounded-2xl bg-slate-50 p-4 text-sm font-medium leading-6 text-slate-700 outline outline-1 outline-slate-200">
                          {renderKutipanUnderline(temuanAnalisis[temuanIndex - 1].kutipan)}
                        </blockquote>
                      </div>

                      <div className="mt-4 rounded-2xl bg-rose-50/50 p-4 outline outline-1 outline-rose-100">
                        <p className="text-base font-bold text-rose-800">Mengapa sitasi ini bermasalah?</p>
                        <ul className="mt-2.5 space-y-2 text-sm leading-6 text-slate-700">
                          {temuanAnalisis[temuanIndex - 1].alasan.map(alasan => (
                            <li key={alasan} className="flex gap-2">
                              <span>•</span>
                              <span>{alasan}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 rounded-xl bg-sky-50/80 p-3">
                          <p className="text-xs leading-5 text-sky-800">✔ DOI valid · Metadata cocok · Isi sumber tidak mendukung klaim</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm font-bold text-sky-900">✦ Saran perbaikan Alerin:</p>
                        <div className="mt-2 rounded-2xl bg-sky-50/60 p-4 outline outline-1 outline-sky-200/80">
                          <p className="text-sm leading-6 text-sky-950">{temuanAnalisis[temuanIndex - 1].saran}</p>
                          <div className="mt-3 flex items-center justify-between gap-2 border-t border-sky-100 pt-2.5">
                            <span className="text-xs font-semibold text-sky-700">OpenAlex +4 verifikasi</span>
                            <button
                              type="button"
                              onClick={() => window.alert("Saran perbaikan Alerin diterapkan ke naskahmu.")}
                              className="shrink-0 text-xs font-bold text-sky-700 underline"
                            >
                              Terapkan ke naskah
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>
                  </>
                )}

                <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-sky-700" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 1.5h5.5L12 4v10.5H4z" />
                        <path d="M9.5 1.5V4H12" />
                        <path d="M6 8h4M6 11h4" />
                      </svg>
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">Ringkasan Hasil Pencarian</h2>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-neutral-700">Alerin menelusuri dan menyaring jurnal berdasarkan relevansi dengan pencarianmu untuk menampilkan hasil yang paling sesuai.</p>
                  <div className="mt-3 space-y-2">
                    <span className="flex h-9 w-fit items-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-medium text-slate-900">
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#0369a1" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                        <circle cx="7" cy="7" r="4.5" />
                        <path d="M10.4 10.4L14 14" />
                      </svg>
                      Kata kunci: {query.trim() || "interaksi parasosial"}
                    </span>
                    <span className="flex h-9 w-fit items-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-medium text-slate-900">
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#0369a1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="2" y="3" width="12" height="11" rx="2" />
                        <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
                      </svg>
                      Tahun: 2024–2026
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 px-1.5 py-4 text-center">
                    {[["4,2 jt", "jurnal tersedia"], ["50", "sesuai kriteria"], ["20", "sangat relevan"]].map(([value, label]) => (
                      <div key={value}>
                        <p className="text-2xl font-bold text-sky-700">{value}</p>
                        <p className="mt-0.5 text-[10px] font-semibold leading-4 text-slate-500">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setTabelOpen(true)}
                      className="w-full rounded-2xl bg-sky-700 py-3.5 text-sm font-semibold text-white shadow-sm"
                    >
                      Tabel penelitian
                    </button>
                  </div>
                </section>

                <div className="mt-4 flex items-center justify-between px-0.5">
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#0369a1" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                      <path d="M5.5 4h8.5M5.5 8h8.5M5.5 12h8.5" />
                      <circle cx="2.5" cy="4" r="1" fill="#0369a1" stroke="none" />
                      <circle cx="2.5" cy="8" r="1" fill="#0369a1" stroke="none" />
                      <circle cx="2.5" cy="12" r="1" fill="#0369a1" stroke="none" />
                    </svg>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Daftar rekomendasi</p>
                  </div>
                  <p className="text-xs font-medium text-slate-500">3 dari 20 telaah</p>
                </div>

                <div className="mt-2 space-y-3">
                  {mobileResultJournals.map((result, index) => (
                    <article key={result.rank} className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-[11px] font-medium text-slate-400">OpenAlex &amp; Crossref</p>
                      <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold">
                        <span className="rounded-md bg-sky-100 px-2 py-1 text-sky-700">Artikel Jurnal</span>
                        <span className="rounded-md bg-slate-200 px-2 py-1 text-slate-700">{result.year}</span>
                        <span className="rounded-md bg-sky-100 px-2 py-1 text-sky-700">Akses Terbuka</span>
                      </div>
                      <div className="mt-3 flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-sky-700">{result.rank}</p>
                          <h2 className="mt-1 text-xl font-bold leading-7 text-slate-900">{result.title}</h2>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{result.authors}</p>
                        </div>
                        <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full bg-sky-50 shadow-inner">
                          <strong className="text-2xl font-extrabold text-sky-700">{result.score}%</strong>
                          <span className="text-[8px] font-semibold uppercase tracking-wide text-slate-500">relevansi</span>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl bg-slate-100 p-4">
                        <p className="text-[13px] font-bold uppercase tracking-wide text-slate-900">Mengapa jurnal ini direkomendasikan?</p>
                        {[["Kesesuaian variabel", index ? 94 : 98], ["Kesesuaian topik", index ? 92 : 96], ["Kesesuaian konteks", index ? 90 : 94], ["Kesesuaian metode", index ? 88 : 91], ["Kesesuaian teori", index ? 86 : 89], ["Kesesuaian periode", index ? 91 : 93]].map(([label, value]) => (
                          <div key={String(label)} className="mt-2.5">
                            <div className="flex justify-between text-sm"><span className="text-slate-700">{label}</span><strong className="text-sky-700">{value}%</strong></div>
                            <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-200"><div className="h-full rounded-full bg-sky-700" style={{ width: `${value}%` }} /></div>
                          </div>
                        ))}
                        <div className="mt-3 rounded-xl bg-[#f1f5f9] p-4 outline outline-1 outline-slate-200">
                          <p className="text-sm leading-6">
                            <span className="font-semibold text-slate-700">Kutipan relevan:</span>
                            <span className="font-semibold text-slate-900"> "Parasocial interaction strengthens purchase intention when viewers perceive urgency and scarcity."</span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl bg-slate-100 p-4">
                        <p className="text-[13px] font-bold uppercase tracking-wide text-slate-900">Kredibilitas</p>
                        {[
                          ["Penerbit", "Pusat Studi Bisnis Digital Nusantara"],
                          ["DOI terverifikasi", "DOI: 10.20886/jpkf.2022.6.1.16-28"],
                          ["Jumlah sitasi", "Artikel ini dikutip dalam 45 karya ilmiah lainnya."],
                          ["Sumber", "OpenAlex dan Crossref"],
                        ].map(([judul, detail]) => (
                          <div key={judul} className="mt-3 flex items-start gap-2.5">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[9px] font-bold text-sky-600">✓</span>
                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-slate-900">{judul}</span>
                              {judul === "DOI terverifikasi" ? (
                                <a
                                  href="https://doi.org/10.20886/jpkf.2022.6.1.16-28"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-[13px] leading-5 text-sky-600 underline underline-offset-2"
                                >
                                  {detail}
                                </a>
                              ) : (
                                <span className="block text-[13px] leading-5 text-slate-500">{detail}</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 rounded-2xl bg-sky-50 p-4">
                        <p className="text-[13px] font-bold uppercase tracking-wide text-sky-700">Ringkasan utama</p>
                        <p className="mt-2 text-sm leading-6 text-slate-900">{result.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                          <span className="rounded-lg bg-white px-2.5 py-1.5 text-slate-900">2 kutipan pendukung</span>
                          <span className="rounded-lg bg-white px-2.5 py-1.5 text-slate-900">Metode SEM-PLS</span>
                          <span className="rounded-lg bg-white px-2.5 py-1.5 text-slate-900">Studi cross-sectional</span>
                          <span className="rounded-lg bg-white px-2.5 py-1.5 text-sky-700">Ringkasan Bahasa Indonesia</span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <button type="button" onClick={() => setRingkasanOpen(true)} className="flex items-center justify-center gap-1.5 rounded-2xl bg-sky-700 px-2 py-2.5 text-xs font-semibold text-white">
                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                            <path d="M7 1.5l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.7l-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" />
                          </svg>
                          Analisis
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSaveJournal(result)}
                          className={`flex items-center justify-center gap-1.5 rounded-2xl px-2 py-2.5 text-xs font-medium ${
                            savedIds.includes(result.id) ? "bg-sky-100 font-semibold text-sky-700" : "bg-slate-100 text-slate-900"
                          }`}
                        >
                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                            <path d="M3.5 1.5h7v11L7 9.5l-3.5 3z" />
                          </svg>
                          {savedIds.includes(result.id) ? "Tersimpan" : "Simpan"}
                        </button>
                        <button type="button" onClick={() => setSitasiOpen(true)} className="flex items-center justify-center gap-1.5 rounded-2xl bg-slate-100 px-2 py-2.5 text-xs font-medium text-slate-900">
                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                            <path d="M2 2.5h10v7H6l-3 2.5V9.5H2z" />
                          </svg>
                          Sitasi
                        </button>
                        <button type="button" onClick={() => setAbstrakOpen(true)} className="flex items-center justify-center gap-1.5 rounded-2xl bg-slate-100 px-2 py-2.5 text-xs font-medium text-slate-900">
                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                            <path d="M3 1.5h6l3 3v9H3zM6 7h4M6 10h4" />
                          </svg>
                          Abstrak
                        </button>
                        <button type="button" onClick={() => window.alert("PDF dibuka.")} className="flex items-center justify-center gap-1.5 rounded-2xl bg-slate-100 px-2 py-2.5 text-xs font-semibold text-sky-700">
                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                            <path d="M3 1.5h6l3 3v9H3zM8.5 1.5v3h3" />
                          </svg>
                          Buka PDF
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                  </>
                )}
              </div>
            </div>
          )}

          {desktopStage === "loading" && (
            <div className="hidden min-h-[70vh] flex-col items-center justify-center md:flex">
              <SearchLoader />
              <h1 className="mt-5 text-center text-2xl font-extrabold tracking-[-0.5px] text-slate-800">
                {searchType === "review" ? "Menyusun Tinjauan Literatur" : resultMode === "analysis" ? "Menganalisis Naskahmu" : "Menelusuri Jurnal Untukmu"}
              </h1>
              <p className="mt-2 max-w-sm animate-pulse text-center text-sm leading-6 text-slate-500">
                {searchType === "review"
                  ? "Alerin sedang menggabungkan, memeringkat, dan merapikan artikel untuk tinjauan literaturmu."
                  : resultMode === "analysis"
                    ? "Alerin sedang membaca dokumenmu dan menyiapkan temuan serta rekomendasi sitasi."
                    : "Alerin sedang mencari jurnal berdasarkan informasi yang kamu berikan."}
              </p>
            </div>
          )}

          {desktopStage === "results" &&
            (searchType === "review" ? (
              <DesktopLiteratureReview query={query} onBack={() => setDesktopStage("home")} onOpenSitasi={() => setSitasiOpen(true)} />
            ) : searchType === "map" ? (
              <DesktopResearchMap query={query} onBack={() => setDesktopStage("home")} />
            ) : (
              <DesktopSearchResults
                query={query}
                onBack={() => setDesktopStage("home")}
                savedIds={savedIds}
                onToggleSave={toggleSaveJournal}
                onOpenRingkasan={() => setRingkasanOpen(true)}
                onOpenTabel={() => setTabelOpen(true)}
                onOpenSitasi={() => setSitasiOpen(true)}
                onOpenAbstrak={() => setAbstrakOpen(true)}
                analysis={resultMode === "analysis"}
                fileName={fileName}
              />
            ))}

          {desktopStage !== "home" ? null : view === "home" ? (
            <div className="mx-auto grid max-w-[1160px] gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <h1 className="text-center font-['Plus_Jakarta_Sans:ExtraBold'] text-2xl font-extrabold leading-[33px] tracking-[-0.6px] text-[#0f172a] md:text-left md:text-[26px] md:leading-9 md:tracking-normal md:text-[#003859]">
                  {searchType === "review" ? (
                    "Buat literatur review penelitian"
                  ) : searchType === "map" ? (
                    "Buat visualisasi peta penelitian"
                  ) : (
                    <>
                      Temukan jurnal yang tepat <br className="md:hidden" />sesuai kebutuhanmu
                    </>
                  )}
                </h1>
                <p className="mt-2 text-center font-['Plus_Jakarta_Sans:Regular'] text-xs leading-[19.5px] text-[#232323] md:text-left md:text-base md:leading-6 md:text-[#475569]">
                  {searchType === "review" ? (
                    "Alerin membantu mencari jurnal relevan untuk memproses literature review."
                  ) : searchType === "map" ? (
                    "Temukan hubungan, kepadatan, dan perkembangan topik berdasarkan topik penelitian."
                  ) : (
                    <>
                      Cari dengan kata kunci atau biarkan Alerin memahami <br className="md:hidden" />paragraf dan dokumenmu.
                    </>
                  )}
                </p>

                <div
                  role="tablist"
                  aria-label="Jenis pencarian"
                  className="mt-5 flex w-full items-center gap-1 rounded-2xl bg-white p-1 outline outline-1 outline-slate-200/90 md:mt-6 md:w-[799px]"
                >
                  {(
                    [
                      ["journal", "Cari Jurnal"],
                      ["review", "Literatur Review"],
                      ["map", "Peta Penelitian"],
                    ] as const
                  ).map(([type, label]) => {
                    const active = searchType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setSearchType(type)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-2.5 py-2.5 text-xs font-semibold transition-colors md:w-64 md:flex-none md:px-4 md:text-sm ${
                          active ? "bg-[#00629b] text-white shadow-sm md:bg-sky-700" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {type === "journal" ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="7" cy="7" r="4.5" />
                            <path d="M10.5 10.5L14 14" />
                          </svg>
                        ) : type === "review" ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M2.5 3.5h4.2c.7 0 1.3.6 1.3 1.3v8.7c0-.7-.6-1.3-1.3-1.3H2.5z" />
                            <path d="M13.5 3.5H9.3c-.7 0-1.3.6-1.3 1.3v8.7c0-.7.6-1.3 1.3-1.3h4.2z" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M1.5 3.5l4-1.5 5 1.5 4-1.5v10l-4 1.5-5-1.5-4 1.5z" />
                            <path d="M5.5 2v10M10.5 3.5v10" />
                          </svg>
                        )}
                        {label}
                      </button>
                    );
                  })}
                </div>

                {searchType === "review" || searchType === "map" ? (
                  <section className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:mt-5 md:p-6">
                    <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-[17px] font-bold md:text-base">Topik penelitian</h2>
                    <label className="mt-3 flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 md:bg-white md:px-4">
                      <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                        <circle cx="7" cy="7" r="4.5" />
                        <path d="M10.5 10.5L14 14" />
                      </svg>
                      <input
                        value={reviewTopic}
                        onChange={event => setReviewTopic(event.target.value)}
                        onKeyDown={event => {
                          if (event.key === "Enter") startStructuredSearch(searchType);
                        }}
                        placeholder="AI Literacy dan Motivasi Belajar Mahasiswa"
                        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                      />
                      {reviewTopic && (
                        <button type="button" aria-label="Hapus topik" onClick={() => setReviewTopic("")} className="shrink-0 rounded-full p-1 text-slate-400 hover:bg-slate-100">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                            <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
                          </svg>
                        </button>
                      )}
                    </label>
                    <div className="mt-3 flex gap-1.5 rounded-xl bg-sky-50 px-3 py-2.5 text-[12px] leading-5 text-sky-800 md:text-xs">
                      <span className="font-bold">Contoh:</span>
                      <span>Artificial Intelligence dan motivasi belajar mahasiswa, atau gunakan beberapa kata kunci yang dipisahkan.</span>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <label className="block">
                        <span className="font-['Plus_Jakarta_Sans:SemiBold'] text-xs font-semibold text-slate-700">Periode publikasi</span>
                        <span className="relative mt-1.5 block">
                          <select
                            value={reviewPeriod}
                            onChange={event => setReviewPeriod(event.target.value)}
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-800 outline-none focus:border-sky-400"
                          >
                            <option value="2020-2026">2020 – 2026</option>
                            <option value="2015-2026">2015 – 2026</option>
                            <option value="2010-2026">2010 – 2026</option>
                          </select>
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <path d="M1 1.5L6 6.5l5-5" />
                          </svg>
                        </span>
                      </label>
                      <label className="block">
                        <span className="font-['Plus_Jakarta_Sans:SemiBold'] text-xs font-semibold text-slate-700">Jumlah jurnal</span>
                        <span className="relative mt-1.5 block">
                          <select
                            value={reviewCount}
                            onChange={event => setReviewCount(event.target.value)}
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-800 outline-none focus:border-sky-400"
                          >
                            <option value="50">50 jurnal</option>
                            <option value="100">100 jurnal</option>
                            <option value="200">200 jurnal</option>
                            <option value="300">300 jurnal</option>
                          </select>
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <path d="M1 1.5L6 6.5l5-5" />
                          </svg>
                        </span>
                      </label>
                    </div>

                    <div className="mt-5">
                      <p className="font-['Plus_Jakarta_Sans:SemiBold'] text-[13px] font-semibold text-slate-800 md:text-sm">Rekomendasi topik</p>
                      <div className="mt-3 grid gap-2">
                        {topicSuggestions.map(topic => {
                          const checked = reviewTopics.includes(topic);
                          return (
                            <label key={topic} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-colors ${checked ? "border-sky-200 bg-sky-50/50" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                              <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded ${checked ? "bg-[#0070ba]" : "border border-slate-300 bg-white"}`}>
                                <input type="checkbox" checked={checked} onChange={() => toggleReviewTopic(topic)} className="sr-only" />
                                {checked && (
                                  <svg width="11" height="9" viewBox="0 0 12 10" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M1.5 5l3 3 6-6.5" />
                                  </svg>
                                )}
                              </span>
                              <span className="text-[13px] font-medium text-slate-700 md:text-sm">{topic}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 md:flex-row md:items-center md:justify-end">
                      <button
                        type="button"
                        disabled={reviewTopic.trim().length < 3}
                        onClick={() => startStructuredSearch(searchType)}
                        className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-['Plus_Jakarta_Sans:Bold'] text-[13px] font-bold text-white md:py-2.5 md:text-xs ${
                          reviewTopic.trim().length < 3
                            ? "cursor-not-allowed bg-slate-300"
                            : searchType === "map"
                              ? "bg-[#00629b] shadow-[0px_2px_10px_0px_rgba(0,117,232,0.30)] md:bg-sky-700"
                              : "bg-[#00629b] md:bg-sky-700"
                        }`}
                      >
                        {searchType === "map" ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M1.5 3.5l4-1.5 5 1.5 4-1.5v10l-4 1.5-5-1.5-4 1.5z" />
                            <path d="M5.5 2v10M10.5 3.5v10" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M2.5 3.5h4.2c.7 0 1.3.6 1.3 1.3v8.7c0-.7-.6-1.3-1.3-1.3H2.5z" />
                            <path d="M13.5 3.5H9.3c-.7 0-1.3.6-1.3 1.3v8.7c0-.7.6-1.3 1.3-1.3h4.2z" />
                          </svg>
                        )}
                        {searchType === "map" ? "Buat Peta Penelitian" : "Analisis dan buat tinjauan literatur"}
                      </button>
                    </div>
                  </section>
                ) : (
                  <>
                <section className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:mt-5 md:p-6">
                  <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-[17px] font-bold md:text-base">Pencarian cepat</h2>

                  <div className="mt-4 flex min-w-0 items-stretch gap-2 md:gap-3">
                    <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 md:bg-white md:px-4">
                        <img src="/assets/jurnal-design/quick-search/f5f78.svg" alt="" className="max-w-none origin-center scale-[0.6667]" />
                        <input
                          value={query}
                          onChange={event => setQuery(event.target.value)}
                          onKeyDown={event => {
                            if (event.key !== "Enter") return;
                            if (query.trim().length < 3) return;
                            setSearchType("journal");
                            if (window.matchMedia("(min-width: 768px)").matches) runSearch();
                            else {
                              setResultMode("search");
                              setMobileSearchStage("loading");
                            }
                          }}
                          placeholder="Ketik topik, judul, penulis, variabel, atau DOI"
                          disabled={referenceActive}
                          className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:text-slate-400 md:text-sm"
                        />
                    </label>
                    <button
                      type="button"
                      onClick={() => setFilterOpen(true)}
                      aria-expanded={filterOpen}
                      disabled={referenceActive}
                      className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 md:gap-2 md:px-4 md:text-sm"
                    >
                      <span className="relative h-[19.689px] w-[17.143px] shrink-0 overflow-hidden">
                        <img src="/assets/jurnal-design/quick-search/8e43d.svg" alt="" className="absolute left-[-19.689px] top-[-18.447px] max-w-none origin-top-left scale-[0.6667]" />
                      </span>
                      Filter
                      {filterApplied && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-sky-100 md:h-6 md:w-6">
                          <svg width="14" height="11" viewBox="0 0 14 11" fill="none" stroke="#0070ba" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M1.5 5.8l3.8 3.8L12.5 1.5" />
                          </svg>
                        </span>
                      )}
                    </button>
                  </div>
                </section>

                <section className="mt-4 rounded-2xl border border-slate-200/80 bg-white px-4 py-[22px] shadow-sm md:p-6">
                  <h2 className="text-center font-['Plus_Jakarta_Sans:Bold'] text-[17px] font-bold md:text-left md:text-base">Cari rujukan dari tulisanmu</h2>
                  <p className="mx-auto mt-2 max-w-lg text-center font-['Plus_Jakarta_Sans:Regular'] text-xs leading-[19.5px] text-[#232323] md:mx-0 md:mt-1 md:max-w-none md:text-left md:text-base md:leading-6 md:text-[#475569]">Tempel kalimat atau paragraf yang ingin kamu perkuat dengan sitasi. Alerin akan membantu mencari artikel jurnal yang relevan untuk mendukung tulisanmu.</p>
                  <div className="mt-5 grid min-w-0 gap-3 md:grid-cols-[1.35fr_0.95fr]">
                    <label className="grid gap-1.5">
                      <span className="font-['Plus_Jakarta_Sans:SemiBold'] text-[14px] font-semibold text-[#334155] md:hidden">Draf / Paragraf Teks</span>
                      <textarea value={paragraph} onChange={event => setParagraph(event.target.value)} disabled={quickActive} placeholder="Masukkan kalimat atau paragraf yang membutuhkan sitasi." className="min-h-[123px] resize-none rounded-xl border border-slate-200 bg-[rgba(200,226,251,0.24)] p-3 text-[13px] outline-none focus:border-sky-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 md:min-h-44 md:bg-white md:p-4 md:text-sm md:disabled:bg-slate-100" />
                    </label>
                    {fileName ? (
                      <div className="flex min-h-[108px] w-full min-w-0 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-sky-200 bg-white p-5 text-center md:min-h-44 md:p-4">
                        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white outline outline-1 outline-offset-[-1px] outline-sky-200 shadow-[0_0_0_4px_rgba(224,242,254,1)] md:h-10 md:w-10 md:rounded-xl md:shadow-[0_0_0_3.5px_rgba(224,242,254,1)]">
                          <svg viewBox="0 0 14 16" fill="none" stroke="#0070ba" strokeWidth="1.2" strokeLinejoin="round" aria-hidden="true" className="h-7 w-6 md:h-4 md:w-[14px]">
                            <path d="M2 1.5h6l4 4v9H2z" />
                            <path d="M8 1.5v4h4" />
                          </svg>
                        </span>
                        <p className="mt-4 w-full truncate px-2 text-base font-bold leading-6 text-slate-900 md:mt-3 md:text-xs md:text-slate-800 md:leading-4">{fileName}</p>
                        <p className="mt-2 text-sm font-medium leading-5 text-slate-500 md:mt-1.5 md:text-xs md:leading-4">
                          {fileSizeLabel || "1.0 MB"} <span className="px-1">•</span> 22 Halaman
                        </p>
                        <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-2 border-t border-slate-200 pt-4 md:mt-3 md:gap-1 md:border-slate-500/20 md:pt-3">
                          <button
                            type="button"
                            className="rounded-lg bg-white px-4 py-1.5 text-sm font-bold leading-5 text-slate-800 outline outline-1 outline-offset-[-1px] outline-slate-200 md:px-2.5 md:py-1 md:text-xs md:font-semibold md:text-slate-600"
                          >
                            Lihat
                          </button>
                          <label className="cursor-pointer rounded-lg bg-blue-50 px-4 py-1.5 text-sm font-bold leading-5 text-blue-700 outline outline-1 outline-offset-[-1px] outline-blue-200 md:bg-sky-100/70 md:px-3 md:py-1 md:text-xs md:text-sky-700 md:outline-sky-200">
                            Ganti File
                            <input type="file" accept=".pdf,.doc,.docx,.txt" className="sr-only" onChange={handleFileChange} />
                          </label>
                          <button
                            type="button"
                            aria-label="Hapus file"
                            onClick={() => {
                              setFileName("");
                              setFileSizeLabel("");
                            }}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 md:p-1.5"
                          >
                            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="md:h-4 md:w-4">
                              <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
                              <path d="M6.5 7v4M9.5 7v4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label aria-disabled={quickActive} className={`flex min-h-[108px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/40 p-4 text-center md:min-h-44 md:border-2 md:border-dashed md:border-sky-200 md:bg-white ${quickActive ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                        <span className="flex h-[53px] w-[53px] items-center justify-center rounded-full border border-sky-100 bg-white shadow-sm md:h-9 md:w-9 md:rounded-lg md:border-0 md:bg-sky-50 md:shadow-none">
                          <img src={`${mobileAssets}/36094.svg`} alt="" className="md:hidden" />
                          <img src={`${searchAssets}/f5e87.svg`} alt="" className="hidden md:block" />
                        </span>
                        <span className="mt-3 text-[13px] font-semibold md:text-sm md:font-bold md:text-slate-800">Unggah artikel atau catatan</span>
                        <span className="mt-1 text-[12px] text-[#94a3b8] md:text-sm md:text-slate-500">PDF, DOCX, atau TXT hingga 20 MB</span>
                        <input type="file" accept=".pdf,.doc,.docx,.txt" className="sr-only" disabled={quickActive} onChange={handleFileChange} />
                      </label>
                    )}
                  </div>
                  <div className="mt-4 flex flex-col gap-3 md:mt-5 md:flex-row md:items-center md:justify-between">
                    <label className="flex cursor-pointer select-none items-center gap-2 text-[13px] text-[#475569] md:text-sm md:font-semibold md:text-slate-700">
                      <span
                        className={`flex h-[18px] w-[18px] items-center justify-center rounded ${
                          useActiveFilter ? "bg-[#0070ba]" : "border border-slate-300 bg-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={useActiveFilter}
                          onChange={event => setUseActiveFilter(event.target.checked)}
                          className="sr-only"
                        />
                        {useActiveFilter && (
                          <img src={`${searchAssets}/b5bd9.svg`} alt="" className="h-4 w-4" />
                        )}
                      </span>
                      Gunakan filter aktif pada rekomendasi Alerin
                    </label>
                    <button
                      type="button"
                      disabled={primaryDisabled}
                      onClick={() => {
                        if (quickActive) {
                          setSearchType("journal");
                          setResultMode("search");
                          if (window.matchMedia("(min-width: 768px)").matches) runSearch();
                          else setMobileSearchStage("loading");
                          return;
                        }
                        if (window.matchMedia("(min-width: 768px)").matches) {
                          setResultMode("analysis");
                          runSearch();
                        } else {
                          setResultMode("analysis");
                          setTemuanIndex(1);
                          setMobileSearchStage("loading");
                        }
                      }}
                      className={`flex items-center justify-center gap-2 rounded-xl px-8 py-3 font-['Plus_Jakarta_Sans:Bold'] text-[13px] font-bold text-white md:w-80 md:px-5 md:py-2.5 md:font-['Plus_Jakarta_Sans:Bold'] md:text-xs md:font-bold ${
                        primaryDisabled ? "cursor-not-allowed bg-slate-300 md:bg-slate-300" : "bg-[#00629b] md:bg-sky-700"
                      }`}
                    >
                      {quickActive ? (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="7" cy="7" r="4.5" />
                          <path d="M10.5 10.5L14 14" />
                        </svg>
                      ) : (
                        <>
                          <img src={`${mobileAssets}/8802c.svg`} alt="" className="max-w-none origin-center scale-[0.6667] md:hidden" />
                          <img src={`${searchAssets}/550ef.svg`} alt="" className="hidden md:block" />
                        </>
                      )}
                      {quickActive ? "Cari jurnal" : "Analisis dan carikan jurnal"}
                    </button>
                  </div>
                </section>
                  </>
                )}

              </div>

              <aside className="space-y-5">
                <button
                  type="button"
                  onClick={onBack}
                  className="hidden w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 text-left shadow-sm transition-colors hover:bg-slate-50 md:flex"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500">
                    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M16 10H4" />
                      <path d="M9 5l-5 5 5 5" />
                    </svg>
                  </span>
                  <span className="font-['Inter:Semi_Bold'] text-sm font-semibold text-slate-800">Kembali ke Beranda Alerin</span>
                </button>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-6">
                  <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-base font-bold md:text-base">{guideContent?.title ?? "Tiga cara menemukan jurnal"}</h2>
                  <p className="mt-2 text-sm leading-5 text-[#64748b] md:font-['Plus_Jakarta_Sans:Regular'] md:text-xs">{guideContent?.intro ?? "Pilih cara pencarian sesuai informasi yang sudah kamu miliki."}</p>
                  {guideContent ? (
                    <ol className="mt-4 space-y-2 md:mt-6 md:space-y-4">
                      {guideContent.steps.map((step, index) => (
                        <li key={step.description} className="flex gap-3 rounded-xl border border-slate-100/80 bg-slate-50 p-3 md:rounded-none md:border-0 md:bg-transparent md:p-0">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-[#0070ba] md:h-8 md:w-8 md:rounded-xl md:text-sky-600">{index + 1}</span>
                          <span className="min-w-0">
                            {step.title && <strong className="block text-sm md:text-sm">{step.title}</strong>}
                            <span className={step.title ? "mt-0.5 block text-xs leading-5 text-[#64748b] md:mt-1 md:text-xs md:leading-5" : "block text-sm leading-5 text-slate-700 md:text-xs md:leading-5"}>{step.description}</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ol className="mt-4 space-y-2 md:mt-6 md:space-y-6">
                      {[
                        ["1", "Ketik kata kunci", "Gunakan topik, variabel, nama penulis, atau informasi lain untuk menemukan jurnal yang relevan.", "Gunakan topik, variabel, nama penulis, atau informasi lain untuk menemukan jurnal yang relevan."],
                        ["2", "Tempel tulisan", "Tempel paragraf atau bagian tulisanmu. Alerin akan memahami konteksnya dan mencarikan jurnal yang dapat mendukung isi tulisan tersebut.", "Tempel paragraf atau bagian tulisanmu. Alerin akan memahami konteksnya dan mencarikan jurnal yang dapat mendukung isi tulisan tersebut."],
                        ["3", "Unggah dokumen", "Unggah dokumen untuk memeriksa penggunaan referensi dan menemukan bagian yang membutuhkan sumber, sitasi, atau jurnal pendukung.", "Unggah dokumen untuk memeriksa penggunaan referensi dan menemukan bagian yang membutuhkan sumber, sitasi, atau jurnal pendukung."],
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
                  )}
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
            <div className="-mt-4 md:hidden">
              <div className="flex items-center justify-between px-1">
                <h1 className="font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold tracking-[-0.27px] text-[#0f172a]">Folder Riset</h1>
                <button
                  type="button"
                  aria-label="Tambah folder"
                  onClick={() => setNewFolderOpen(true)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0369a1]"
                >
                  <img src="/assets/jurnal-design/collection-mobile/ce139.svg" alt="" className="h-[18px] w-[18px]" />
                </button>
              </div>

              <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
                {[{ id: "all", name: "Semua" }, ...folders].map((folder, chipIndex) => {
                  const active = activeFolderId === folder.id;
                  const count = folderCounts[folder.id] ?? 0;
                  return (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() => setActiveFolderId(folder.id)}
                      className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs shadow-sm ${
                        active ? "bg-[#00629b] text-white" : "bg-white text-[#64748b]"
                      }`}
                    >
                      <img
                        src={`/assets/jurnal-design/collection-mobile/${["55585.svg", "22763.svg", "d2faf.svg"][chipIndex % 3]}`}
                        alt=""
                        className={`h-[18px] w-[18px] shrink-0 ${active ? "brightness-0 invert" : ""}`}
                      />
                      {folder.name}
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${active ? "bg-white text-[#0369a1]" : "bg-slate-100"}`}>{count}</span>
                    </button>
                  );
                })}
              </div>

              {collectionJournals.length === 0 ? (
                <div className="mt-6 flex flex-col items-center rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                  </svg>
                  <p className="mt-4 max-w-xs text-xs leading-5 text-[#64748b]">
                    Belum ada jurnal di folder ini. Simpan jurnal dari Beranda atau pindahkan jurnal tersimpan ke folder ini.
                  </p>
                  <button type="button" onClick={startSearching} className="mt-5 rounded-xl bg-[#00629b] px-5 py-2.5 text-xs font-semibold text-white">
                    Mulai mencari jurnal
                  </button>
                </div>
              ) : (
              <div className="mt-2 space-y-3">
                {collectionJournals.map((journal, index) => (
                  <article key={journal.id} className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="rounded-full bg-sky-100 px-2 py-1 font-semibold text-[#0369a1]">Artikel Jurnal</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-[#64748b]">{journal.year}</span>
                      <span className="ml-auto flex items-center gap-1 rounded-full bg-sky-50 px-2 py-1 font-semibold text-[#006194]">
                        <img src="/assets/jurnal-design/collection-mobile/4bb5d.svg" alt="" className="max-w-none origin-center scale-[0.7]" />
                        {journal.relevancy} relevan
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
                      <img src="/assets/jurnal-design/collection-mobile/4f26d.svg" alt="" className="mt-1 h-4 w-[13.5px] shrink-0" />
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
                        onChange={event => window.localStorage.setItem(`alerin-journal-note-${journal.id}`, event.target.value)}
                        className="mt-2 min-h-16 w-full resize-none rounded-md bg-white p-2 text-xs outline-none shadow-inner"
                      />
                    </label>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold">
                      <button type="button" onClick={() => window.alert(`${journal.title}\n\n${journal.authors}`)} className="rounded-lg bg-slate-100 px-3 py-2.5">Lihat detail</button>
                      <button
                        type="button"
                        onClick={() => setAbstrakOpen(true)}
                        className="rounded-lg bg-slate-100 px-3 py-2.5"
                      >
                        Abstrak
                      </button>
                      <button
                        type="button"
                        onClick={() => setSitasiOpen(true)}
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
                        <select
                          aria-label="Pilih folder jurnal"
                          value={journal.folderId}
                          onChange={event => moveJournal(journal.id, event.target.value)}
                          className="w-full appearance-none rounded-lg bg-slate-100 py-2.5 pl-9 pr-8 text-xs font-semibold outline-none"
                        >
                          {folders.map(folder => (
                            <option key={folder.id} value={folder.id}>
                              {folder.name}
                            </option>
                          ))}
                        </select>
                        <img src="/assets/jurnal-design/collection-mobile/392b3.svg" alt="" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                      </label>
                      <button
                        type="button"
                        onClick={() => setHapusJournalId(journal.id)}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 text-xs font-medium text-[#bd3434] outline outline-1 outline-offset-[-1px] outline-rose-200 transition-colors hover:bg-rose-50"
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
                        </svg>
                        Hapus
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              )}
            </div>

            <div className="mx-auto hidden max-w-[1160px] gap-5 md:grid lg:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="font-['Plus_Jakarta_Sans:ExtraBold'] text-[28px] font-extrabold tracking-[-0.69px] text-[#003859]">Koleksi jurnal</h1>
                    <p className="mt-1.5 text-sm leading-6 text-[#64748b]">Simpan jurnal penting agar mudah ditemukan kembali saat menulis.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveFolderId("all")}
                    className="flex items-center justify-center gap-2.5 whitespace-nowrap rounded-[10px] bg-[#0066a1] px-5 py-2.5 font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold text-white"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                    </svg>
                    {activeFolderId === "all" ? "Semua folder" : (folders.find(folder => folder.id === activeFolderId)?.name ?? "Semua folder")}
                  </button>
                </div>
                {collectionJournals.length === 0 ? (
                  <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                    </svg>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-[#64748b]">
                      Belum ada jurnal di folder ini. Simpan jurnal dari Beranda atau pindahkan jurnal tersimpan ke folder ini.
                    </p>
                    <button type="button" onClick={startSearching} className="mt-5 rounded-xl bg-[#00629b] px-5 py-2.5 text-xs font-semibold text-white">
                      Mulai mencari jurnal
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 space-y-4">
                    {collectionJournals.map(journal => (
                      <JournalCard
                        key={journal.id}
                        journal={journal}
                        folders={folders}
                        onMove={folderId => moveJournal(journal.id, folderId)}
                        onRemove={() => setHapusJournalId(journal.id)}
                        onSitasi={() => setSitasiOpen(true)}
                        onAbstrak={() => setAbstrakOpen(true)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <aside className="space-y-4">
                <ProfileCard collection />
                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-2 px-2 pb-3">
                    <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-base font-bold text-[#1e293b]">Folder</h2>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => (folderSelectMode ? exitFolderSelect() : setFolderSelectMode(true))}
                        aria-pressed={folderSelectMode}
                        className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors ${
                          folderSelectMode
                            ? "border-sky-200 bg-sky-50 text-[#0066a1]"
                            : "border-slate-200 text-[#475569] hover:bg-slate-50"
                        }`}
                      >
                        {folderSelectMode ? "Batal" : "Pilih"}
                      </button>
                      {!folderSelectMode && (
                        <button
                          type="button"
                          aria-label="Buat folder baru"
                          onClick={() => setNewFolderOpen(true)}
                          className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200"
                        >
                          <img src={`${collectionAssets}/b2242.svg`} alt="" />
                        </button>
                      )}
                    </div>
                  </div>

                  {folderSelectMode && (
                    <div className="mb-2 flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2">
                      <span className="text-xs text-[#64748b]">{selectedFolderIds.length} folder dipilih</span>
                      <button
                        type="button"
                        disabled={selectedFolderIds.length === 0}
                        onClick={deleteSelectedFolders}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors ${
                          selectedFolderIds.length === 0 ? "cursor-not-allowed bg-slate-300" : "bg-[#bd3434]"
                        }`}
                      >
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
                        </svg>
                        Hapus
                      </button>
                    </div>
                  )}

                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => (folderSelectMode ? undefined : setActiveFolderId("all"))}
                      aria-disabled={folderSelectMode}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                        folderSelectMode
                          ? "text-slate-400"
                          : activeFolderId === "all"
                            ? "bg-sky-100 text-[#0066a1]"
                            : "text-[#475569]"
                      }`}
                    >
                      <img src={`${collectionAssets}/8b8d1.svg`} alt="" className={folderSelectMode ? "opacity-40" : ""} />
                      <span className="flex-1">Semua</span>
                      <span>{folderCounts.all ?? 0}</span>
                    </button>
                    {folders.map(folder => {
                      const selected = selectedFolderIds.includes(folder.id);
                      return (
                        <button
                          key={folder.id}
                          type="button"
                          onClick={() => (folderSelectMode ? toggleFolderSelection(folder.id) : setActiveFolderId(folder.id))}
                          aria-pressed={folderSelectMode ? selected : undefined}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                            folderSelectMode && selected
                              ? "bg-rose-50 text-[#bd3434]"
                              : activeFolderId === folder.id && !folderSelectMode
                                ? "bg-sky-100 text-[#0066a1]"
                                : "text-[#475569] hover:bg-slate-50"
                          }`}
                        >
                          {folderSelectMode ? (
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                selected ? "border-[#bd3434] bg-[#bd3434]" : "border-slate-300 bg-white"
                              }`}
                            >
                              {selected && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M1.5 5.2l2.3 2.3 4.7-5" />
                                </svg>
                              )}
                            </span>
                          ) : (
                            <img src={`${collectionAssets}/e1558.svg`} alt="" />
                          )}
                          <span className="flex-1">{folder.name}</span>
                          <span>{folderCounts[folder.id] ?? 0}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>
            </div>
            </>
          )}
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-[310] border-t border-slate-200 bg-white/95 px-3 pb-2 pt-1.5 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] backdrop-blur-md transition-transform duration-300 ease-out md:hidden"
        style={{ transform: mobileNavHidden ? "translateY(calc(100% + 36px))" : "translateY(0)" }}
      >
        <div className="mx-auto grid max-w-md grid-cols-5 items-end">
          <button type="button" onClick={() => changeView("home")} aria-current={view === "home" ? "page" : undefined} className={`flex flex-col items-center gap-1 py-1 text-[10px] font-semibold ${view === "home" ? "text-[#00629b]" : "text-slate-400"}`}>
            <span className="flex h-6 items-center"><img src={`${mobileAssets}/62a85.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" style={{ filter: view === "home" ? "none" : "brightness(0) saturate(100%) invert(70%) sepia(14%) saturate(518%) hue-rotate(176deg) brightness(90%) contrast(86%)" }} /></span>
            Beranda
          </button>
          <button type="button" onClick={() => changeView("collection")} aria-current={view === "collection" ? "page" : undefined} className={`flex flex-col items-center gap-1 py-1 text-[10px] font-medium ${view === "collection" ? "text-[#00629b]" : "text-slate-400"}`}>
            <span className="flex h-6 items-center"><img src={`${mobileAssets}/6978a.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" style={{ filter: view === "collection" ? "brightness(0) saturate(100%) invert(30%) sepia(96%) saturate(1030%) hue-rotate(164deg) brightness(86%) contrast(102%)" : "none" }} /></span>
            Koleksi
          </button>
          <button type="button" onClick={onBack} className="relative flex flex-col items-center gap-1 pb-1 text-[10px] font-bold text-[#004f80]">
            <span className="-mt-7 flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white bg-[rgba(123,123,123,0.05)] shadow-lg">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <img src={`${mobileAssets}/73c1a.png`} alt="Alerin AI" className="h-8 w-8 rounded-full object-cover" />
              </span>
            </span>
            ALERIN AI
          </button>
          <button
            type="button"
            onClick={() => changeView("riwayat")}
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
      <NewFolderModal open={newFolderOpen} onClose={() => setNewFolderOpen(false)} onCreate={createFolder} />
      <RingkasanJurnalModal open={ringkasanOpen} onClose={() => setRingkasanOpen(false)} />
      <TabelPenelitianModal open={tabelOpen} onClose={() => setTabelOpen(false)} />
      <BuatSitasiModal open={sitasiOpen} onClose={() => setSitasiOpen(false)} />
      <AbstrakJurnalModal open={abstrakOpen} onClose={() => setAbstrakOpen(false)} />
      <HapusJurnalModal
        open={hapusJournalId !== null}
        title={hapusJournal?.title ?? "Jurnal ini"}
        onClose={() => setHapusJournalId(null)}
        onConfirm={confirmRemoveSavedJournal}
      />
      <Toast message={toast} />
    </div>
  );
}
