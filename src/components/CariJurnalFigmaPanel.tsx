import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";

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
  { id: "res-2", title: journals[0].title, authors: journals[0].authors, description: journals[0].description, year: "2023", relevancy: "92%" },
  { id: "res-3", title: journals[0].title, authors: journals[0].authors, description: journals[0].description, year: "2023", relevancy: "89%" },
];

const mobileResultJournals = [
  {
    id: "mres-1",
    rank: "Paling Relevan #1",
    score: 97,
    citation: "2023 • 120 sitasi • Asia Pacific Journal of Marketing and Logistics • DOI terverifikasi",
    summary:
      "Interaksi parasosial antara host dan penonton ditambah dorongan kelangkaan seperti batas waktu dan stok meningkatkan niat beli di live streaming commerce.",
    title: "Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges",
    authors: "Wongkitrungrueng, A. & Assarut, N.",
    description:
      "Interaksi parasosial antara host dan penonton ditambah dorongan kelangkaan seperti batas waktu dan stok meningkatkan niat beli di live streaming commerce.",
    year: "2023",
    relevancy: "97%",
  },
  {
    id: "mres-2",
    rank: "Rekomendasi #2",
    score: 89,
    citation: "2023 • 120 sitasi • Asia Pacific Journal of Marketing and Logistics • DOI terverifikasi",
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
  onOpenRiwayat,
}: {
  view: JournalView;
  onView: (view: JournalView) => void;
  onBack: () => void;
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
          className="shrink-0 cursor-pointer"
        >
          <img src={`${assets}/24a8e.svg`} alt="" />
        </button>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="font-['Inter:Bold'] text-lg font-bold leading-5 text-slate-900">Alerin Jurnal</p>
            <p className="font-['Inter:Medium'] text-xs font-medium leading-4 text-slate-400">Pendamping Akademik</p>
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
        <button
          type="button"
          onClick={onBack}
          title={collapsed ? "Home Alerin" : undefined}
          className={`flex w-full items-center gap-3.5 rounded-xl py-3 text-base font-medium text-slate-600 hover:bg-slate-50 ${
            collapsed ? "justify-center px-0" : "px-4"
          }`}
        >
          <img src={`${assets}/73c1a.png`} alt="" className="h-8 w-8 rounded-full object-contain outline outline-1 outline-slate-400/50" />
          {!collapsed && "Home Alerin"}
        </button>
      </nav>

      {!collapsed && (
        <>
          <p className="mt-6 px-4 font-['Inter:Bold'] text-sm font-bold uppercase leading-5 tracking-wide text-slate-400">Riwayat</p>
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
        </>
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
            className="shrink-0 whitespace-nowrap rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700"
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
          <h2 className="text-2xl font-extrabold leading-7 text-slate-900">Upgrade ke Alerin Premium!</h2>
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
            <div className="flex items-end gap-2 border-b border-slate-100 pb-2.5">
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
  return (
    <article className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-semibold text-[#0066a1]">Scopus Q1</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600">{journal.year}</span>
        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] text-[#0066a1]">Akses terbuka legal</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600">{journal.relevancy} relevan</span>
      </div>
      <h3 className="mt-4 font-['Plus_Jakarta_Sans:Bold'] text-base font-bold leading-[22px] text-[#0f172a]">{journal.title}</h3>
      <p className="mt-1 font-['Inter:Regular'] text-xs text-[#94a3b8]">{journal.authors}</p>
      <p className="mt-4 font-['Inter:Regular'] text-xs leading-5 text-[#64748b]">{journal.description}</p>
      {journal.id === "saved-1" && (
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
        <button
          type="button"
          onClick={onSitasi}
          className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold leading-4 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200"
        >
          Buat sitasi
        </button>
        <button
          type="button"
          onClick={onAbstrak}
          className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold leading-4 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200"
        >
          Abstrak
        </button>
        <button
          type="button"
          onClick={() => window.open("https://doi.org/10.1016/j.jretconser.2020.102345", "_blank", "noopener,noreferrer")}
          className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold leading-4 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
            <rect x="1.5" y="1.5" width="9" height="9" rx="1.5" />
          </svg>
          DOI
        </button>
        <button
          type="button"
          onClick={() => window.alert("PDF dibuka.")}
          className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold leading-4 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200"
        >
          Buka PDF
        </button>
        <label className="relative flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs">
          <span className="pointer-events-none max-w-24 truncate font-medium">{activeFolder?.name ?? "Belum dikelompokkan"}</span>
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
        <button type="button" onClick={onRemove} className="ml-auto rounded-lg bg-[#bd3434] px-4 py-2 text-xs font-semibold text-white">
          Hapus dari koleksi
        </button>
      </div>
    </article>
  );
}

function DesktopJournalResultCard({
  relevancy,
  showHeader = false,
  onAnalisis,
  onSitasi,
  onAbstrak,
  journal,
  saved = false,
  onToggleSave,
}: {
  relevancy: string;
  showHeader?: boolean;
  onAnalisis?: () => void;
  onSitasi?: () => void;
  onAbstrak?: () => void;
  journal?: (typeof desktopResultJournals)[number];
  saved?: boolean;
  onToggleSave?: () => void;
}) {
  const fitBars: [string, number][] = [
    ["Kesesuaian variabel", 98],
    ["Kesesuaian topik", 96],
    ["Kesesuaian wilayah", 90],
  ];
  const credibilityItems: [string, string][] = [
    ["Scopus Q1 terverifikasi", "Status indeks dicek pada sumber resmi"],
    ["DOI & metadata cocok", "Judul, penulis, tahun, dan penerbit konsisten"],
    ["PDF dapat diakses legal", "Versi akses terbuka tersedia dari penerbit"],
    ["Tidak ada peringatan integritas", "Tidak ditemukan retraksi atau koreksi kritis"],
  ];
  const actionButtons = ["Buat sitasi", "Abstrak", "DOI", "Buka PDF"];

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-2 outline-offset-[-2px] outline-sky-100">
      {showHeader && (
        <div className="flex items-center justify-between border-b border-slate-100 bg-sky-50/40 px-6 py-3">
          <p className="text-sm font-bold leading-4 text-slate-900">Rekomendasi Jurnal</p>
          <p className="text-xs font-bold leading-4 text-sky-700">Ditemukan OpenAlex dan Diverifikasi Crossref &amp; Scopus</p>
        </div>
      )}
      <div className="flex flex-col gap-3 px-6 py-6">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-sm bg-sky-100 px-2 py-0.5 text-xs font-bold leading-4 text-sky-600">Scopus Q1</span>
          <span className="rounded-sm bg-slate-100 px-2 py-0.5 text-xs font-semibold leading-4 text-slate-700">Artikel</span>
          <span className="rounded-sm bg-slate-100 px-2 py-0.5 text-xs font-semibold leading-4 text-slate-700">2023</span>
          <span className="rounded-sm bg-sky-100 px-2 py-0.5 text-xs font-semibold leading-4 text-sky-600">Akses terbuka legal</span>
        </div>

        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold leading-7 text-slate-900">
              Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges
            </h3>
            <p className="pt-1 text-xs font-medium leading-4 text-slate-600">Wongkitrungrueng, A. &amp; Assarut, N.</p>
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs leading-4">
              <span className="font-semibold text-sky-600 underline">120 sitasi</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-500">Asia Pacific Journal of Marketing and Logistics</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-500">DOI terverifikasi</span>
            </div>
          </div>
          <div className="flex w-28 shrink-0 flex-col items-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-extrabold leading-8 text-sky-600 outline outline-4 outline-offset-[-3.64px] outline-sky-600">
              {relevancy}
            </span>
            <span className="pt-1 text-xs font-semibold leading-4 text-slate-500">Relevansi</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-1 min-[1180px]:flex-row">
          <div className="min-w-0 flex-1 rounded-xl bg-sky-50/30 p-4 outline outline-1 outline-offset-[-1px] outline-sky-100">
            <h4 className="text-xs font-bold leading-4 text-slate-900">Mengapa jurnal ini direkomendasikan?</h4>
            <div className="flex flex-col gap-2 pt-3">
              {fitBars.map(([label, value]) => (
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
            <p className="pt-3 text-xs font-bold leading-4 text-slate-800">
              Cocok untuk: landasan teori, penyusunan hipotesis, pembanding penelitian, dan rujukan metode kuantitatif.
            </p>
            <p className="mt-3 rounded-lg bg-amber-50 p-2.5 text-xs font-bold leading-4 text-amber-900 outline outline-1 outline-offset-[-1px] outline-amber-200/60">
              Kutipan relevan: &ldquo;Parasocial interaction strengthens purchase intention when viewers perceive urgency and scarcity.&rdquo;
            </p>
          </div>
          <div className="w-full shrink-0 rounded-xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-slate-200 min-[1180px]:w-[300px]">
            <h4 className="text-center text-base font-extrabold leading-5 text-slate-900">Kredibilitas &amp; akses</h4>
            <ul className="flex flex-col">
              {credibilityItems.map(([title, desc]) => (
                <li key={title} className="flex items-start gap-2 py-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true">
                    <path d="M2.5 8.5l3.5 3.5 7.5-8" />
                  </svg>
                  <div>
                    <p className="text-xs font-bold leading-4 text-slate-800">{title}</p>
                    <p className="text-xs leading-4 text-slate-500">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-r-xl border-l-4 border-sky-600 bg-sky-50/70 px-4 pb-4 pt-6">
          <p className="text-xs font-bold leading-4 text-sky-600">RINGKASAN UTAMA</p>
          <p className="pt-1.5 text-xs leading-5 text-slate-700">
            Interaksi parasosial antara host dan penonton, ditambah dorongan kelangkaan seperti batas waktu dan stok, meningkatkan niat beli di live
            streaming commerce. Temuan ini relevan untuk riset perilaku konsumen digital di Asia Tenggara.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <button type="button" onClick={onAnalisis} className="rounded-lg bg-sky-600 px-3.5 py-1.5 text-xs font-semibold leading-4 text-white">
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
                      ? () => window.open("https://doi.org/10.1016/j.jretconser.2020.102345", "_blank", "noopener,noreferrer")
                      : () => window.alert("PDF dibuka.")
              }
              className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold leading-4 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200"
            >
              {label === "DOI" && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
                  <rect x="1.5" y="1.5" width="9" height="9" rx="1.5" />
                </svg>
              )}
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={journal ? onToggleSave : undefined}
            aria-pressed={saved}
            className={`ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold leading-4 outline outline-1 outline-offset-[-1px] transition-colors ${
              saved ? "bg-sky-50 text-sky-700 outline-sky-200" : "bg-white text-slate-700 outline-slate-200"
            }`}
          >
            <svg
              width="12"
              height="14"
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
  if (!open) return null;

  const mainSummary =
    "Penelitian ini menunjukkan bahwa interaksi parasosial antara host dan penonton dapat membangun kepercayaan. Ketika interaksi tersebut disertai pesan kelangkaan berupa batas waktu atau stok, niat beli konsumen pada live streaming commerce meningkat.";

  const points = [
    {
      title: "Tujuan penelitian",
      desc: "Menguji pengaruh interaksi parasosial dan dorongan kelangkaan terhadap niat pembelian konsumen dalam konteks live streaming commerce.",
    },
    {
      title: "Metode penelitian",
      desc: "Pendekatan kuantitatif menggunakan survei cross-sectional. Hubungan antarvariabel dianalisis menggunakan metode SEM-PLS.",
    },
    {
      title: "Temuan penelitian",
      desc: "Interaksi parasosial meningkatkan kepercayaan kepada host, sedangkan kelangkaan memperkuat urgensi yang mendorong keputusan pembelian.",
    },
    {
      title: "Relevansi penelitian",
      desc: "Dapat digunakan untuk landasan teori, penyusunan hipotesis, pemilihan variabel, serta pembanding penelitian perilaku konsumen digital.",
    },
    {
      title: "Keterbatasan penelitian",
      desc: "Data dikumpulkan pada satu periode sehingga belum menjelaskan perubahan perilaku konsumen dalam jangka panjang.",
    },
    {
      title: "Saran penggunaan",
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

  return (
    <div
      className="fixed inset-0 z-[340] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ringkasan Jurnal"
        onClick={event => event.stopPropagation()}
        className="flex max-h-[calc(100vh-32px)] w-[820px] max-w-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0px_25px_60px_-15px_rgba(0,0,0,0.30)] outline outline-1 outline-offset-[-1px] outline-slate-100"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-7 pb-4 pt-6">
          <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-xl font-bold leading-8 text-slate-900">Ringkasan Jurnal</h2>
          <button
            type="button"
            aria-label="Tutup ringkasan"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full outline outline-1 outline-offset-[-1px] outline-slate-200/90 transition-colors hover:bg-slate-50"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#64748b" strokeWidth="1.33" strokeLinecap="round" aria-hidden="true">
              <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto p-7">
          <div className="flex flex-col gap-1.5 rounded-xl border-l-[3px] border-sky-600 bg-blue-50 py-5 pl-5 pr-6">
            <p className="font-['Plus_Jakarta_Sans:ExtraBold'] text-sm font-extrabold leading-5 text-slate-900">Ringkasan utama</p>
            <p className="font-['Plus_Jakarta_Sans:Medium'] text-sm font-medium leading-5 text-slate-700">{mainSummary}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-1 min-[640px]:grid-cols-2">
            {points.map((point, index) => (
              <div
                key={point.title}
                className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.02)] outline outline-1 outline-offset-[-1px] outline-slate-200/80"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100">
                    <span className="font-['Plus_Jakarta_Sans:Bold'] text-xs font-bold leading-4 text-sky-700">{index + 1}</span>
                  </span>
                  <p className="font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold leading-5 text-slate-900">{point.title}</p>
                </div>
                <p className="pl-7 font-['Plus_Jakarta_Sans:Medium'] text-xs font-medium leading-5 text-slate-600">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-7 py-4">
          <button
            type="button"
            onClick={copySummary}
            className="flex h-10 w-48 items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold leading-5 text-slate-800 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.03)] outline outline-1 outline-offset-[-1px] outline-slate-200 transition-colors hover:bg-slate-50"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="4.5" y="4.8" width="8" height="8.2" rx="1.5" fill="white" stroke="#0c0a09" strokeWidth="1.3" />
              <rect x="1.5" y="1" width="8" height="8.2" rx="1.5" fill="white" stroke="#0c0a09" strokeWidth="1.3" />
            </svg>
            Salin ringkasan
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-sky-700 px-6 py-2.5 text-sm font-semibold leading-5 text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-sky-800"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

function TabelPenelitianModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  const headers = ["No.", "Penelitian", "Tujuan", "Metode dan sampel", "Temuan utama", "Perbedaan dan celah", "Relevansi"];

  const tableRows = [
    {
      study: "Wongkitrungrueng & Assarut (2023)",
      subtitle: "Live Streaming Commerce and Mimic Purchase Intention",
      tujuan: "Menguji peran interaksi parasosial dan kelangkaan pada niat beli.",
      metode: "Survei potong lintang; SEM-PLS; pengguna live commerce.",
      temuan: "Kepercayaan memediasi pengaruh interaksi parasosial; kelangkaan memperkuat urgensi.",
      celah: "Belum menguji perubahan perilaku jangka panjang dan konteks Indonesia.",
      relevansi: "97%",
    },
    {
      study: "Chen, Li & Zhang (2024)",
      subtitle: "Social Presence, Trust and Purchase Intention",
      tujuan: "Menganalisis kehadiran sosial dan kredibilitas host.",
      metode: "Survei 468 responden; SEM.",
      temuan: "Kehadiran sosial meningkatkan kepercayaan dan keterlibatan konsumen.",
      celah: "Tidak memasukkan pesan kelangkaan sebagai variabel moderator.",
      relevansi: "94%",
    },
    {
      study: "Rahmawati & Prasetyo (2024)",
      subtitle: "Kelangkaan Produk dan Interaksi Host",
      tujuan: "Menguji keputusan pembelian pada konsumen Indonesia.",
      metode: "Survei 215 pengguna; regresi berganda.",
      temuan: "Interaksi host dan kelangkaan berpengaruh positif pada keputusan pembelian.",
      celah: "Belum menguji mekanisme kepercayaan dan hubungan parasosial secara terpisah.",
      relevansi: "91%",
    },
  ];

  const copyTable = () => {
    const text = [
      headers.join("\t"),
      ...tableRows.map((row, index) => [index + 1, row.study, row.tujuan, row.metode, row.temuan, row.celah, row.relevansi].join("\t")),
    ].join("\n");
    try {
      void navigator.clipboard.writeText(text);
    } catch {
      window.alert("Tabel berhasil disalin.");
      return;
    }
    window.alert("Tabel berhasil disalin.");
  };

  const downloadCsv = () => {
    window.alert("Tabel berhasil diunduh sebagai CSV.");
  };

  const columnWidths = ["w-16", "w-64", "w-56", "w-56", "w-60", "w-64", "w-28"];

  return (
    <div className="fixed inset-0 z-[340] bg-black/30" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tabel penelitian terdahulu"
        onClick={event => event.stopPropagation()}
        className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-[43.42px] bg-white shadow-2xl md:inset-auto md:left-1/2 md:top-1/2 md:max-h-[calc(100vh-48px)] md:w-[1140px] md:max-w-[calc(100vw-32px)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:outline md:outline-1 md:outline-offset-[-1px] md:outline-slate-100"
      >
        <div className="flex shrink-0 justify-center pb-1.5 pt-5 md:hidden">
          <span className="h-1.5 w-16 rounded-full bg-slate-300" aria-hidden="true" />
        </div>

        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 pb-5 pl-10 pr-7 pt-3 md:border-b-0 md:px-8 md:pb-4 md:pt-7">
          <div>
            <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-2xl font-bold leading-8 text-slate-900">Tabel penelitian terdahulu</h2>
            <p className="font-['Plus_Jakarta_Sans:Regular'] pt-1 text-sm font-normal leading-5 text-slate-500">
              Perbandingan jurnal yang direkomendasikan Alerin berdasarkan topik penelitianmu
            </p>
          </div>
          <button
            type="button"
            aria-label="Tutup tabel"
            onClick={onClose}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 transition-colors hover:bg-slate-50 md:h-10 md:w-10 md:rounded-xl"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M2.5 2.5l9 9M11.5 2.5l-9 9" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto px-6 py-5 md:px-8 md:py-4">
          <div className="hidden rounded-xl bg-sky-50 px-4 py-3.5 outline outline-1 outline-offset-[-1px] outline-blue-100 md:block">
            <p className="font-['Plus_Jakarta_Sans:Medium'] text-sm font-medium leading-5 text-cyan-900">
              Gunakan kolom &ldquo;Perbedaan dan celah&rdquo; untuk menyusun kebaruan penelitian. Selalu cek paper asli sebelum memasukkan tabel ke
              karya ilmiah.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 md:hidden">
            <p className="flex items-center gap-2 text-sm leading-5 text-slate-600">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 8h12M4.5 5.5L2 8l2.5 2.5M11.5 5.5L14 8l-2.5 2.5" />
              </svg>
              Geser ke samping untuk melihat seluruh kolom
            </p>
            <span className="shrink-0 text-sm font-semibold text-sky-600">3 Jurnal</span>
          </div>

          <div className="overflow-x-auto rounded-3xl outline outline-1 outline-offset-[-1px] outline-slate-200/80 md:rounded-2xl">
            <table className="w-full min-w-[1178px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/90">
                  {headers.map((header, index) => (
                    <th
                      key={header}
                      className={`${columnWidths[index]} border-b border-slate-200/90 bg-slate-50/90 px-5 py-4 text-sm font-bold leading-5 text-slate-600 ${
                        header === "Perbedaan dan celah" ? "bg-amber-50/30" : ""
                      } ${header === "Relevansi" ? "text-center" : ""}`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, index) => (
                  <tr key={row.study} className={index === 0 ? "" : "border-t border-slate-100"}>
                    <td className="px-5 py-4 align-top text-sm font-bold leading-6 text-slate-800">{index + 1}</td>
                    <td className="px-5 py-4 align-top">
                      <p className="text-sm font-bold leading-5 text-slate-900">{row.study}</p>
                      <p className="pt-1 text-xs font-normal leading-4 text-slate-500">{row.subtitle}</p>
                    </td>
                    <td className="px-5 py-4 align-top text-sm font-normal leading-6 text-slate-700">{row.tujuan}</td>
                    <td className="px-5 py-4 align-top text-sm font-normal leading-6 text-slate-700">{row.metode}</td>
                    <td className="px-5 py-4 align-top text-sm font-normal leading-6 text-slate-700">{row.temuan}</td>
                    <td className="bg-amber-50/30 px-5 py-4 align-top text-sm font-normal leading-6 text-slate-700">{row.celah}</td>
                    <td className="px-5 py-4 text-center align-top">
                      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{row.relevansi}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-100 bg-white px-6 pb-6 pt-5 md:flex md:items-center md:justify-end md:gap-3 md:px-8 md:py-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={copyTable}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold leading-5 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200 transition-colors hover:bg-slate-50 md:flex-none md:rounded-xl md:px-5 md:py-2.5"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
                <path d="M10.5 5.5v-1a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1" />
              </svg>
              Salin tabel
            </button>
            <button
              type="button"
              onClick={downloadCsv}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold leading-5 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200 transition-colors hover:bg-slate-50 md:flex-none md:rounded-xl md:px-5 md:py-2.5"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 2.5v7M5 7l3 3 3-3M3 13h10" />
              </svg>
              Unduh CSV
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full rounded-2xl bg-sky-700 py-4 text-sm font-bold leading-5 text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-sky-800 md:mt-0 md:w-auto md:rounded-xl md:px-7 md:py-2.5 md:text-sm md:font-semibold"
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
    <div className="fixed inset-0 z-[340] flex items-center justify-center bg-black/25 p-4 backdrop-blur-[2.55px]" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Buat sitasi jurnal"
        onClick={event => event.stopPropagation()}
        className="flex max-h-[calc(100vh-32px)] w-[656px] max-w-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0px_20px_50px_0px_rgba(0,0,0,0.18)] outline outline-1 outline-offset-[-1px] outline-slate-100"
      >
        <div className="flex items-center justify-between px-7 pb-2 pt-6">
          <h2 className="font-['Inter:Bold'] text-xl font-bold leading-8 text-slate-900">Buat sitasi jurnal</h2>
          <button
            type="button"
            aria-label="Tutup sitasi"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full outline outline-1 outline-offset-[-1px] outline-slate-200 transition-colors hover:bg-slate-50"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#64748b" strokeWidth="1.47" strokeLinecap="round" aria-hidden="true">
              <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex gap-7 border-b border-slate-200 px-7 pt-3">
          {(Object.keys(styles) as Array<keyof typeof styles>).map(key => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveStyle(key)}
              aria-pressed={activeStyle === key}
              className={`border-b-[3px] pb-2.5 text-sm leading-5 transition-colors ${
                activeStyle === key
                  ? "border-sky-600 font-['Inter:Bold'] font-bold text-slate-900"
                  : "border-transparent font-['Inter:Medium'] font-medium text-slate-600 hover:text-slate-800"
              }`}
            >
              {styles[key].label}
            </button>
          ))}
        </div>

        <div className="px-7 pb-2 pt-4">
          {activeStyle === "bibtex" ? (
            <div className="min-h-36 rounded-xl bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.02)] outline outline-1 outline-offset-[-1px] outline-slate-200">
              <pre className="whitespace-pre-wrap font-['JetBrains_Mono:Medium'] text-xs leading-5 text-slate-800">{bibtex}</pre>
            </div>
          ) : (
            <div className="flex min-h-36 flex-col gap-4 rounded-xl bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.02)] outline outline-1 outline-offset-[-1px] outline-slate-200">
              <p className="font-['Inter:Regular'] text-sm font-normal leading-6 text-slate-800">
                {active.before}
                <span className="italic">{journal}</span>
                {active.after}
              </p>
              <a
                href={doi}
                target="_blank"
                rel="noreferrer"
                className="font-['Inter:Regular'] text-sm font-normal leading-6 text-sky-600 underline hover:text-sky-700"
              >
                {doi}
              </a>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-7 pb-7 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium leading-5 text-slate-700 transition-colors hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={copyCitation}
            className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold leading-5 tracking-tight text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-sky-700"
          >
            Salin teks
          </button>
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
    <div className="fixed inset-0 z-[340] flex items-center justify-center bg-black/25 p-4 backdrop-blur-[2.55px]" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Abstrak jurnal"
        onClick={event => event.stopPropagation()}
        className="flex max-h-[calc(100vh-32px)] w-[749px] max-w-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0px_26.75px_53.5px_-12.84px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-slate-100"
      >
        <div className="flex flex-col gap-3 px-9 pb-9 pt-7">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-2xl font-bold leading-9 text-slate-900">Abstrak jurnal</h2>
            <button
              type="button"
              aria-label="Tutup abstrak"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white p-2.5 outline outline-1 outline-offset-[-1px] outline-slate-200/80 transition-colors hover:bg-slate-50"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#475569" strokeWidth="1.57" strokeLinecap="round" aria-hidden="true">
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
                className={`rounded-full px-3.5 py-1 font-['Plus_Jakarta_Sans:Medium'] text-xs font-medium leading-4 transition-colors ${
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
              <p className="font-['Plus_Jakarta_Sans:Regular'] text-sm font-normal leading-6 text-slate-700">{active.text}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-5">
            <button
              type="button"
              onClick={copyAbstract}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold leading-5 text-slate-800 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-slate-300 transition-colors hover:bg-slate-50"
            >
              Salin abstrak
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold leading-5 text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-sky-700"
            >
              Selesai
            </button>
          </div>
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
        <h1 className="text-2xl font-extrabold leading-8 text-sky-800">Rekomendasi yang paling relevan</h1>
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
            showHeader
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

        <aside className="w-64 shrink-0 space-y-4">
          {analysis && <ProfileCard collection={false} />}
          <div className="rounded-2xl bg-white p-6">
          <h2 className="text-base font-bold leading-6 text-slate-900">Ringkasan hasil pencarian</h2>
          <p className="pt-1 text-xs leading-4 text-slate-500">
            Alerin menyeleksi hasil secara bertahap sebelum menampilkan jurnal terbaik.
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

function DesktopLiteratureReview({ query, onBack }: { query: string; onBack: () => void }) {
  const sectionNames = [
    "Ringkasan Eksekutif",
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
    { label: "Total hasil ditemukan", value: "126", tone: "text-blue-600" },
    { label: "Duplikasi dihapus", value: "34", tone: "text-red-600" },
    { label: "Artikel tersisa untuk sintesis", value: "92", tone: "text-blue-600" },
    { label: "Artikel prioritas tinggi", value: "24", tone: "text-blue-600" },
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
      ],
    },
    {
      key: "7–9",
      title: "Pengelompokan Tema",
      desc: "Sintesis tema lanjutan beserta celah penelitian yang ditemukan",
      section: 7,
      content: [
        "Bagian ini menyintesis tema-tema lanjutan dan memetakan celah penelitian yang belum terjawab, khususnya pada konteks Asia Tenggara.",
        "Sintesis menunjukkan kebutuhan studi longitudinal berskala besar yang melibatkan perempuan sebagai subjek utama.",
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
          <h1 className="text-2xl font-extrabold leading-8 text-slate-900">Tinjau hasil penelusuran literatur</h1>
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
          <label className="flex h-10 w-72 shrink-0 items-center gap-2 rounded-xl bg-slate-50 px-3">
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

        <div className="flex flex-wrap gap-2 px-5">
          {filterChips.map(item => (
            <button
              key={item.key}
              type="button"
              onClick={() => setChip(item.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                chip === item.key
                  ? "bg-blue-50 text-blue-700 outline outline-1 outline-blue-200"
                  : "bg-white text-slate-600 outline outline-1 outline-slate-200 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
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
                    className={`flex items-center gap-1.5 text-xs font-semibold ${yearSort ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
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
                    className={`flex items-center gap-1.5 text-xs font-semibold ${relevanSort ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
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
          <span className="h-8 w-1.5 rounded-full bg-blue-600" />
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
                        matrixSort?.index === index ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
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
                    <span className="block text-sm font-semibold leading-5 text-blue-600">{row.name}</span>
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
          <span className="h-8 w-1.5 rounded-full bg-blue-600" />
          <h2 className="text-2xl font-extrabold leading-8 text-slate-900">Literature Review Siap Digunakan</h2>
        </div>
        <div className="flex items-center gap-2">
          {[
            { label: "Scoping Review", icon: "text-blue-500", path: "M3 2.5h7.5v9H3zM3 5.5h7.5M5.5 2.5v9" },
            { label: "15 artikel", icon: "text-emerald-500", path: "M7 1.5v8M4 6.5L7 9.5l3-3M2.5 12.5h9" },
            { label: "Berbasis sumber", icon: "text-amber-500", path: "M7 1.5l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.7l-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" },
          ].map(item => (
            <span key={item.label} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm outline outline-1 outline-slate-200">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" className={item.icon} aria-hidden="true">
                <path d={item.path} />
              </svg>
              {item.label}
            </span>
          ))}
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
            onClick={() => window.alert("Daftar sitasi ditampilkan.")}
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
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M2.5 4h11M2.5 8h11M2.5 12h7" />
              </svg>
            </span>
            <span className="text-sm font-bold uppercase tracking-wide text-slate-800">Struktur Dokumen (12 Bagian)</span>
          </div>
          <span className="text-xs font-semibold text-blue-600">Bagian Aktif: {activeSection} dari 12</span>
        </div>
        <div className="mt-4 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sectionNames.map((name, index) => (
            <button
              key={name}
              type="button"
              onClick={() => goToSection(index + 1)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                activeSection === index + 1
                  ? "bg-blue-50 text-blue-700 outline outline-1 outline-blue-200"
                  : "bg-slate-50 text-slate-600 outline outline-1 outline-slate-200 hover:bg-slate-100"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white ${
                  activeSection === index + 1 ? "bg-blue-600" : "bg-slate-600"
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
        <div ref={introRef} className="flex gap-4 rounded-2xl bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-indigo-50/80 p-6">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/10">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 4.5C8.5 3.3 6.6 3 4 3v12c2.6 0 4.5.3 6 1.5 1.5-1.2 3.4-1.5 6-1.5V3c-2.6 0-4.5.3-6 1.5zM10 4.5v12" />
            </svg>
          </span>
          <div className="min-w-0">
            <h3 className="text-xl font-bold leading-7 text-slate-900">Ringkasan Eksekutif</h3>
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
          <h3 className="text-2xl font-bold leading-8 text-slate-900">1. Ringkasan Eksekutif</h3>
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
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-blue-600 outline outline-1 outline-slate-200">
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
                  stroke="#2563eb"
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
  const sourcePills: Record<string, string> = {
    "Google Scholar": "bg-blue-50 text-sky-700 outline-blue-100",
    Crossref: "bg-blue-50 text-sky-700 outline-blue-100",
    OpenAlex: "bg-purple-50 text-purple-700 outline-purple-200",
    DOAJ: "bg-emerald-50 text-emerald-700 outline-emerald-200",
  };

  const structureSections = [
    { n: 1, label: "Ringkasan Eksekutif" },
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

  const activeLabel = structureSections.find(item => item.n === activeSection)?.label ?? "Ringkasan Eksekutif";
  const nextSection = structureSections.find(item => item.n === activeSection + 1);

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div>
        <h2 className="text-[22px] font-bold leading-7 text-slate-900">Tinjau hasil penelusuran literatur</h2>
        <p className="mt-1.5 text-sm leading-6 text-slate-500">
          Alerin telah menggabungkan, merapikan, dan memeringkat artikel berdasarkan relevansi topik riset Anda.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map(stat => (
          <div
            key={stat.label}
            className={`rounded-[18.92px] p-4 shadow-sm ${stat.highlight ? "bg-white/70 outline outline-1 outline-white" : "bg-white outline outline-1 outline-slate-200/90"}`}
          >
            <p className={`text-xs text-slate-500 ${stat.highlight ? "font-semibold" : "font-medium"}`}>{stat.label}</p>
            <p className="mt-2 flex items-baseline gap-1.5">
              <span className={`text-2xl font-bold leading-8 ${stat.accent}`}>{stat.value}</span>
              <span className={`text-sm ${stat.sub} ${stat.highlight ? "font-semibold" : "font-medium"}`}>artikel</span>
            </p>
          </div>
        ))}
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
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {filterChips.map(item => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setChip(item.key);
                setPriorityLimit(6);
              }}
              className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                chip === item.key ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-3 space-y-3">
          {visiblePriority.slice(0, priorityLimit).map((row, index) => {
            const tag = tagPills[row.tag] ?? tagPills["Cukup relevan"];
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
                  <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold outline outline-1 ${tag.box}`}>
                    <span className={`h-2 w-2 rounded-full ${tag.dot}`} />
                    {row.tag}
                  </span>
                  <span className="rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-600 outline outline-1 outline-slate-200">{row.year}</span>
                  <span className={`rounded-md px-2 py-1 text-[11px] font-medium outline outline-1 ${sourcePills[row.source]}`}>{row.source}</span>
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

      <div className="border-t border-slate-200 pt-6">
        <h2 className="text-xl font-bold leading-7 text-slate-900">Hasil Analisis Literature Review</h2>
        <p className="mt-1 text-sm font-medium leading-5 text-sky-700">Resiliensi perempuan dalam menghadapi bencana dan krisis</p>
      </div>

      <section className="rounded-3xl bg-white p-4 shadow-sm outline outline-1 outline-slate-200/80">
        <div>
          <h3 className="text-base font-bold text-slate-800">Matriks Literatur</h3>
          <p className="mt-0.5 text-sm text-slate-500">Komparasi fokus, metode &amp; kontribusi khas</p>
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

      <div className="border-t border-slate-200 pt-6">
        <h2 className="text-xl font-bold leading-7 text-slate-900">Literature Review Siap Digunakan</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { label: "Scoping Review", box: "bg-blue-50 text-sky-700 outline-blue-200", icon: true },
            { label: "15 artikel", box: "bg-slate-100 text-slate-700 outline-slate-200", icon: false },
            { label: "Berbasis sumber", box: "bg-amber-50 text-amber-800 outline-amber-200", icon: false },
          ].map(item => (
            <span key={item.label} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium outline outline-1 ${item.box}`}>
              {item.icon && (
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                  <path d="M3 2.5h7.5v9H3zM3 5.5h5.5M5.5 2.5v9" />
                </svg>
              )}
              {item.label}
            </span>
          ))}
        </div>
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
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm outline outline-1 outline-slate-200/90">
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
        <div className="rounded-2xl bg-blue-50/70 p-4 outline outline-1 outline-blue-100">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sky-600">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                <path d="M3.5 1.5h6l3 3v10h-9z" />
                <path d="M6 8.5l1.5 1.5L10 7.5" />
              </svg>
            </span>
            <span className="text-sm font-bold text-sky-900">Ringkasan Eksekutif</span>
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


function DesktopResearchMap({ query, onBack }: { query: string; onBack: () => void }) {
  const [mode, setMode] = useState("kepadatan");
  const [showLines, setShowLines] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [activeNode, setActiveNode] = useState("AI Literacy");
  const [nodeFilter, setNodeFilter] = useState<string | null>(null);
  const [mapSearch, setMapSearch] = useState("");
  const [chip, setChip] = useState("semua");
  const [yearSort, setYearSort] = useState<"asc" | "desc" | null>(null);
  const [relevanSort, setRelevanSort] = useState<"asc" | "desc" | null>(null);

  const mapNodes = [
    { name: "AI Literacy", x: 23, y: 44, size: 36, color: "red", pct: 88, cluster: "AI Literacy & Motivation" },
    { name: "Learning Motivation", x: 57, y: 52, size: 36, color: "red", pct: 84, cluster: "AI Literacy & Motivation" },
    { name: "Generative AI", x: 13.3, y: 25, size: 24, color: "amber", pct: 76, cluster: "Generative AI & Tools" },
    { name: "Digital Learning", x: 51.6, y: 37, size: 24, color: "yellow", pct: 72, cluster: "Digital Learning Systems" },
    { name: "Academic Engagement", x: 74.2, y: 34, size: 24, color: "yellow", pct: 70, cluster: "Academic Engagement" },
    { name: "Critical Thinking", x: 18.4, y: 69.7, size: 20, color: "amber", pct: 66, cluster: "Critical Thinking & SRL" },
    { name: "Self-Regulated Learning", x: 45.9, y: 74.7, size: 20, color: "amber", pct: 64, cluster: "Critical Thinking & SRL" },
  ];

  const nodeLabels = [
    { label: "Teacher Education", x: 47, y: 20 },
    { label: "Digital Competence", x: 37, y: 28 },
    { label: "Educational Technology", x: 36, y: 40 },
    { label: "Learning Analytics", x: 44, y: 48 },
    { label: "AI tools", x: 14, y: 40 },
    { label: "Problem Solving", x: 19, y: 80 },
    { label: "Higher Order Thinking", x: 23, y: 84 },
    { label: "Student Engagement", x: 85, y: 40 },
    { label: "Blended Learning", x: 87, y: 62 },
    { label: "Motivation Theory", x: 76, y: 72 },
    { label: "Online Learning", x: 87, y: 74 },
    { label: "Self-Efficacy", x: 58, y: 81 },
  ];

  const mapRects = [
    { x: 29, y: 42.6, w: 38.4, h: 7.4, color: "outline outline-4 outline-offset-[-2px] outline-red-500/90" },
    { x: 19, y: 25.6, w: 9, h: 16.7, color: "outline outline-2 outline-offset-[-1px] outline-sky-400/60" },
    { x: 25, y: 44.2, w: 4, h: 24, color: "outline outline-2 outline-offset-[-1px] outline-sky-400/60" },
    { x: 29, y: 29.2, w: 11.2, h: 14.9, color: "outline outline-1 outline-offset-[-1px] outline-sky-400/40" },
    { x: 39.5, y: 29.2, w: 16, h: 7.4, color: "outline outline-2 outline-offset-[-1px] outline-sky-400/60" },
    { x: 56, y: 36.4, w: 11.2, h: 11.9, color: "outline outline-2 outline-offset-[-1px] outline-sky-400/60" },
    { x: 67, y: 33.7, w: 14.4, h: 14.9, color: "outline outline-2 outline-offset-[-1px] outline-amber-500/75" },
    { x: 56, y: 33.7, w: 25.5, h: 1.4, color: "outline outline-1 outline-offset-[-1px] outline-sky-400/50" },
    { x: 54.5, y: 49.6, w: 12.8, h: 20.4, color: "outline outline-2 outline-offset-[-1px] outline-sky-400/60" },
    { x: 25, y: 67.2, w: 28.7, h: 4.5, color: "outline outline-1 outline-offset-[-1px] outline-sky-400/50" },
    { x: 14, y: 25.6, w: 4.8, h: 14.9, color: "outline outline-1 outline-offset-[-1px] outline-sky-400/30" },
    { x: 67, y: 49.6, w: 17.6, h: 11.9, color: "outline outline-1 outline-offset-[-1px] outline-sky-400/40" },
    { x: 54.5, y: 71.7, w: 8, h: 6.7, color: "outline outline-1 outline-offset-[-1px] outline-sky-400/40" },
    { x: 22.5, y: 67.2, w: 2.4, h: 11.9, color: "outline outline-1 outline-offset-[-1px] outline-sky-400/30" },
    { x: 39.5, y: 21.1, w: 9.6, h: 8.2, color: "outline outline-1 outline-offset-[-1px] outline-sky-400/30" },
  ];

  const mapEdges = [
    { from: [13.3, 25], to: [23, 44], color: "#38bdf8" },
    { from: [23, 44], to: [14, 40], color: "#38bdf8" },
    { from: [23, 44], to: [57, 52], color: "#ef4444" },
    { from: [57, 52], to: [51.6, 37], color: "#38bdf8" },
    { from: [51.6, 37], to: [74.2, 34], color: "#f59e0b" },
    { from: [57, 52], to: [74.2, 34], color: "#f59e0b" },
    { from: [57, 52], to: [45.9, 74.7], color: "#38bdf8" },
    { from: [18.4, 69.7], to: [45.9, 74.7], color: "#38bdf8" },
    { from: [18.4, 69.7], to: [23, 44], color: "#38bdf8" },
    { from: [13.3, 25], to: [18.4, 69.7], color: "#38bdf899" },
    { from: [74.2, 34], to: [87, 62], color: "#38bdf899" },
    { from: [57, 52], to: [87, 74], color: "#38bdf899" },
  ];

  const glowBlobs = [
    { x: 11, y: 8, size: 320, color: "bg-sky-500/25" },
    { x: 50, y: 18, size: 320, color: "bg-red-500/20" },
    { x: 7, y: 3, size: 208, color: "bg-indigo-500/25" },
    { x: 40, y: 11, size: 224, color: "bg-sky-500/20" },
    { x: 68, y: 7, size: 224, color: "bg-amber-500/20" },
    { x: 15, y: 50, size: 192, color: "bg-indigo-500/20" },
    { x: 42, y: 56, size: 208, color: "bg-sky-500/20" },
  ];

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

  const active = mapNodes.find(node => node.name === activeNode) ?? mapNodes[0];
  const blobOpacity = mode === "jaringan" ? 0.15 : mode === "perkembangan" ? 0.5 : 1;

  const toggleNode = (name: string) => {
    setActiveNode(name);
    setNodeFilter(current => (current === name ? null : name));
  };

  const visibleRows = (() => {
    let rows = priorityRows.map((row, index) => ({ row, node: mapNodes[index % mapNodes.length].name }));
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

  return (
    <div className="mx-auto hidden max-w-[1160px] flex-col gap-5 pb-8 md:flex">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold leading-8 text-slate-900">Visualisasi Klaster &amp; Kepadatan Sitasi</h1>
          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            Jelajahi peta topik berdasarkan {priorityRows.length} publikasi dan klik lingkaran topik untuk menyaring rekomendasi.
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
          Kembali ke Pencarian
        </button>
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg bg-slate-100 p-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setMode(tab.key)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium leading-5 transition-colors ${
                  mode === tab.key ? "bg-white text-sky-700 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

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

          <div className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <button
              type="button"
              aria-label="Perkecil peta"
              onClick={() => setZoom(value => Math.max(50, value - 10))}
              className="flex h-6 w-6 items-center justify-center rounded-sm text-sm font-bold text-slate-500 transition-colors hover:bg-slate-50"
            >
              &minus;
            </button>
            <span className="w-9 text-center text-xs font-semibold leading-4 text-slate-900">{zoom}%</span>
            <button
              type="button"
              aria-label="Perbesar peta"
              onClick={() => setZoom(value => Math.min(200, value + 10))}
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
            <svg width="9" height="6" viewBox="0 0 9 6" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 1.5L4.5 5 8 1.5" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => window.alert("Data klaster berhasil diunduh sebagai CSV.")}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium leading-5 text-slate-900 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <rect x="1.5" y="1.5" width="10" height="10" rx="1.5" />
              <path d="M1.5 5h10M1.5 8.5h10M5.5 1.5v10" />
            </svg>
            CSV Data
          </button>
        </div>

        <div className="relative mt-4 h-[538px] overflow-hidden rounded-2xl bg-slate-900 shadow-[0px_12px_32px_0px_rgba(3,15,38,0.18)]">
          <div className="absolute inset-0 transition-transform duration-200" style={{ transform: `scale(${zoom / 100})` }}>
            {glowBlobs.map((blob, index) => (
              <span
                key={index}
                className={`absolute rounded-full blur-3xl transition-opacity duration-300 ${blob.color}`}
                style={{ left: `${blob.x}%`, top: `${blob.y}%`, width: blob.size, height: blob.size, opacity: blobOpacity }}
              />
            ))}

            {mapRects.map((rect, index) => (
              <span
                key={index}
                className={`absolute ${rect.color}`}
                style={{ left: `${rect.x}%`, top: `${rect.y}%`, width: `${rect.w}%`, height: `${rect.h}%` }}
              />
            ))}

            {showLines && (
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {mapEdges.map((edge, index) => (
                  <line
                    key={index}
                    x1={edge.from[0]}
                    y1={edge.from[1]}
                    x2={edge.to[0]}
                    y2={edge.to[1]}
                    stroke={edge.color}
                    strokeWidth={1.4}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
            )}

            {nodeLabels.map(label => (
              <span
                key={label.label}
                className="absolute -translate-y-1/2 whitespace-nowrap text-xs leading-4 text-blue-300/90"
                style={{ left: `${label.x}%`, top: `${label.y}%` }}
              >
                {label.label}
              </span>
            ))}

            {mapNodes.map(node => {
              const isActive = activeNode === node.name;
              const circleSize = node.size === 36 ? "h-9 w-9" : node.size === 24 ? "h-6 w-6" : "h-5 w-5";
              const innerSize = node.size === 36 ? "h-3 w-3" : node.size === 24 ? "h-2 w-2" : "h-1.5 w-1.5";
              const colorCls =
                node.color === "red"
                  ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.9)]"
                  : node.color === "yellow"
                    ? "bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.9)]"
                    : "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.9)]";
              const outlineCls = isActive ? "outline outline-2 outline-offset-[4px] outline-white/80" : "outline outline-2 outline-offset-[-2px] outline-white";
              return (
                <button
                  key={node.name}
                  type="button"
                  onClick={() => toggleNode(node.name)}
                  aria-pressed={nodeFilter === node.name}
                  className="absolute z-10 flex items-center gap-2"
                  style={{ left: `${node.x}%`, top: `${node.y}%`, transform: `translate(${-node.size / 2}px, -50%)` }}
                >
                  <span className={`flex shrink-0 items-center justify-center rounded-full ${circleSize} ${colorCls} ${outlineCls}`}>
                    <span className={`${innerSize} rounded-full bg-white`} />
                  </span>
                  <span
                    className={
                      node.size === 36
                        ? "rounded-md bg-slate-900/60 px-2.5 py-1 text-lg font-bold leading-6 text-white shadow-[0px_2px_8px_rgba(0,0,0,0.9)] backdrop-blur-sm"
                        : "whitespace-nowrap rounded-sm bg-slate-900/50 px-2 py-0.5 text-xs font-semibold leading-5 text-white shadow-[0px_2px_4px_rgba(0,0,0,0.9)] backdrop-blur-sm"
                    }
                  >
                    {node.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-sky-950/80 px-2.5 py-1 text-xs font-semibold uppercase leading-4 tracking-tight text-blue-100 backdrop-blur-md">
              VOSVIEWER DENSITY MODEL
            </span>
            <span className="rounded-md bg-sky-950/80 px-2 py-1 text-xs font-medium leading-4 tracking-tight text-slate-400 backdrop-blur-md">
              Iterasi: 1,420
            </span>
            <span className="flex items-center gap-1.5 rounded-md bg-sky-950/80 px-2 py-1 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span className="text-xs font-semibold leading-4 tracking-tight text-emerald-600">
                Node Aktif: {active.cluster} ({active.pct}%)
              </span>
            </span>
          </div>

          <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-lg bg-sky-950/90 px-3 py-1.5 backdrop-blur-md">
            <span className="text-xs font-medium leading-4 tracking-tight text-slate-400">Kepadatan Sitasi:</span>
            <span className="h-2.5 w-28 rounded-full bg-gradient-to-r from-sky-500 via-yellow-500 to-red-500" />
            <span className="text-[10px] leading-4 text-slate-300">Rendah</span>
            <span className="text-[10px] leading-4 text-slate-300">Tinggi</span>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-1.5 border-t border-slate-800/60 bg-sky-950/90 px-4 py-2.5 backdrop-blur-md">
            <div className="flex items-start gap-2">
              <svg width="13" height="15" viewBox="0 0 13 15" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
                <path d="M6.5.8c-2.7 0-4.9 2.2-4.9 4.9 0 3.7 4.9 8.5 4.9 8.5s4.9-4.8 4.9-8.5c0-2.7-2.2-4.9-4.9-4.9z" fill="#f59e0b" />
                <circle cx="6.5" cy="5.7" r="1.9" fill="#020617" />
              </svg>
              <p className="text-xs leading-5 text-white">
                Klik pada lingkaran topik untuk membedah relasi bibliometrik &amp; menyaring daftar publikasi rujukan di bawah.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-4">
              <span className="font-medium text-slate-400">Resolusi: 0.85</span>
              <span className="text-slate-600">&bull;</span>
              <span className="font-medium text-slate-400">Metode: Modularity Louvain</span>
              <span className="text-slate-600">&bull;</span>
              <span className="font-medium text-slate-400">
                Klaster Aktif: <span className="font-bold text-white">{active.cluster}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white outline outline-1 outline-offset-[-1px] outline-slate-200/90">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 p-7">
          <div className="flex items-start gap-3">
            <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-sky-700">
              <svg width="12" height="13" viewBox="0 0 12 13" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="7" height="7" rx="1.5" fill="white" />
                <rect x="4.5" y="5" width="6.5" height="6.5" rx="1.5" fill="#bae6fd" />
              </svg>
            </span>
            <div>
              <h2 className="text-lg font-semibold leading-7 text-slate-900">Rekomendasi Jurnal Sesuai Klaster Peta</h2>
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

        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/70 px-7 py-3.5">
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

        <div className="max-h-[430px] overflow-auto">
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
  const [searchType, setSearchType] = useState("");
  const [resultMode, setResultMode] = useState<"search" | "analysis">("search");
  const [temuanIndex, setTemuanIndex] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [folders, setFolders] = useState<CollectionFolder[]>(defaultFolders);
  const [savedJournals, setSavedJournals] = useState<SavedJournal[]>(initialSavedJournals);
  const [activeFolderId, setActiveFolderId] = useState("all");
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [ringkasanOpen, setRingkasanOpen] = useState(false);
  const [tabelOpen, setTabelOpen] = useState(false);
  const [sitasiOpen, setSitasiOpen] = useState(false);
  const [abstrakOpen, setAbstrakOpen] = useState(false);
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

  useEffect(() => {
    if (mobileSearchStage !== "loading") return;
    const timer = window.setTimeout(() => setMobileSearchStage("results"), 2400);
    return () => window.clearTimeout(timer);
  }, [mobileSearchStage]);

  useEffect(() => {
    if (desktopStage !== "loading") return;
    const timer = window.setTimeout(() => setDesktopStage("results"), 2400);
    return () => window.clearTimeout(timer);
  }, [desktopStage]);

  const runSearch = () => {
    if (query.trim() || paragraph.trim() || fileName) setDesktopStage("loading");
  };

  const openRiwayatPencarian = (title: string) => {
    setView("home");
    setQuery(title);
    setSearchType("journal");
    setResultMode("search");
    setDesktopStage("loading");
  };

  const canSearch = query.trim().length >= 5;
  const analysisReady = Boolean(fileName) || paragraph.trim().length >= 5;

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
        onView={setView}
        onBack={onBack}
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

        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-28 pt-7 md:p-7">
          {mobileSearchStage === "loading" && (
            <div className="fixed inset-x-0 bottom-[68px] top-[65px] z-[305] flex flex-col items-center justify-center bg-[#f4f7fb] px-6 md:hidden">
              <img
                src="/assets/jurnal-design/search-flow/5e7e4.svg"
                alt=""
                className="w-[290px] max-w-[82vw] animate-[bounce_1.4s_ease-in-out_infinite]"
              />
              <h1 className="mt-5 text-center font-['Plus_Jakarta_Sans:ExtraBold'] text-[21px] font-extrabold tracking-[-0.5px] text-[#313131]">
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

          {mobileSearchStage === "results" && (
            <div className="fixed inset-x-0 bottom-[68px] top-[65px] z-[305] overflow-y-auto overflow-x-hidden bg-[#f4f7fb] px-4 pb-6 pt-4 md:hidden">
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

                {searchType === "review" ? (
                  <MobileLiteratureReview />
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
                    <span className="h-6 w-6 shrink-0 rounded bg-sky-700" aria-hidden="true" />
                    <h2 className="text-xl font-bold text-slate-900">Ringkasan hasil pencarian</h2>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-neutral-700">Alerin menyeleksi hasil secara bertahap sebelum menampilkan jurnal terbaik.</p>
                  <div className="mt-3 space-y-2">
                    <span className="flex h-9 w-fit items-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-medium text-slate-900">
                      <span className="h-4 w-4 shrink-0 bg-sky-700" aria-hidden="true" />
                      Kata kunci: {query.trim() || "interaksi parasosial"}
                    </span>
                    <span className="flex h-9 w-fit items-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-medium text-slate-900">
                      <span className="h-4 w-4 shrink-0 bg-sky-700" aria-hidden="true" />
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
                    <span className="h-4 w-4 shrink-0 bg-sky-700" aria-hidden="true" />
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Daftar rekomendasi</p>
                  </div>
                  <p className="text-xs font-medium text-slate-500">3 dari 20 telaah</p>
                </div>

                <div className="mt-2 space-y-3">
                  {mobileResultJournals.map((result, index) => (
                    <article key={result.rank} className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-[10px] font-medium text-slate-400">OpenAlex &amp; Crossref Scopus</p>
                      <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold">
                        <span className="rounded-md bg-sky-100 px-2 py-1 text-sky-700">Scopus Q1</span>
                        <span className="rounded-md bg-slate-200 px-2 py-1 text-slate-700">Artikel</span>
                        <span className="rounded-md bg-slate-200 px-2 py-1 text-slate-700">2023</span>
                      </div>
                      <div className="mt-3 flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-sky-700">{result.rank}</p>
                          <h2 className="mt-1 text-xl font-bold leading-7 text-slate-900">{result.title}</h2>
                          <p className="mt-2 text-xs leading-5 text-slate-600">Wongkitrungrueng, A. &amp; Assarut, N.</p>
                          <p className="mt-1 text-[11px] leading-4 text-slate-500">{result.citation}</p>
                        </div>
                        <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full bg-sky-50 shadow-inner">
                          <strong className="text-2xl font-extrabold text-sky-700">{result.score}%</strong>
                          <span className="text-[8px] font-semibold uppercase tracking-wide text-slate-500">relevansi</span>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl bg-slate-100 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-900">Mengapa jurnal ini direkomendasikan?</p>
                        {[["Kesesuaian variabel", index ? 96 : 98], ["Kesesuaian topik", index ? 94 : 96], ["Kesesuaian wilayah", index ? 85 : 90]].map(([label, value]) => (
                          <div key={String(label)} className="mt-2.5">
                            <div className="flex justify-between text-xs"><span className="text-slate-700">{label}</span><strong className="text-sky-700">{value}%</strong></div>
                            <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-200"><div className="h-full rounded-full bg-sky-700" style={{ width: `${value}%` }} /></div>
                          </div>
                        ))}
                        <p className="mt-3 text-xs leading-5">
                          <span className="font-medium text-slate-900">Cocok untuk:</span>
                          <span className="text-slate-500"> landasan teori, penyusunan hipotesis, pembanding penelitian, dan rujukan metode kuantitatif.</span>
                        </p>
                        <div className="mt-3 rounded-xl bg-amber-50 p-4">
                          <p className="text-xs leading-5">
                            <span className="font-semibold text-amber-600">Kutipan relevan:</span>
                            <span className="font-semibold text-slate-900"> "Parasocial interaction strengthens purchase intention when viewers perceive urgency and scarcity."</span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl bg-slate-100 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-900">Kredibilitas &amp; akses</p>
                        {[
                          ["Scopus Q1 terverifikasi", "Status indeks dicek dari sumber resmi"],
                          ["DOI & metadata cocok", "Judul, penulis, tahun, dan penerbit konsisten"],
                          ["PDF dapat diakses legal", "Versi akses terbuka tersedia dari penerbit"],
                          ["Tidak ada peringatan integritas", "Tidak ditemukan retraksi atau koreksi kritis"],
                        ].map(([judul, detail]) => (
                          <div key={judul} className="mt-3 flex items-start gap-2.5">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[9px] font-bold text-emerald-600">✓</span>
                            <span className="min-w-0">
                              <span className="block text-xs font-medium text-slate-900">{judul}</span>
                              <span className="block text-[11px] leading-4 text-slate-500">{detail}</span>
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 rounded-2xl bg-sky-50 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-sky-700">Ringkasan utama</p>
                        <p className="mt-2 text-xs leading-5 text-slate-900">{result.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
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
                        <button type="button" onClick={() => window.open("https://doi.org/10.1016/j.jretconser.2020.102345", "_blank", "noopener,noreferrer")} className="flex items-center justify-center gap-1.5 rounded-2xl bg-slate-100 px-2 py-2.5 text-xs font-medium text-slate-900">
                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                            <path d="M5.5 8.5l3-3M4.8 6.3L3.3 7.8a2.1 2.1 0 003 3l1.5-1.5M9.2 7.7l1.5-1.5a2.1 2.1 0 00-3-3L6.2 4.7" />
                          </svg>
                          DOI
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
              <img
                src="/assets/jurnal-design/search-flow/5e7e4.svg"
                alt=""
                className="w-[290px] animate-[bounce_1.4s_ease-in-out_infinite]"
              />
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
              <DesktopLiteratureReview query={query} onBack={() => setDesktopStage("home")} />
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
                          setResultMode("search");
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
                  <h2 className="text-center font-['Plus_Jakarta_Sans:Bold'] text-[17px] font-bold md:text-left md:text-base">Cari rujukan dari tulisanmu</h2>
                  <p className="mx-auto mt-2 max-w-lg text-center font-['Plus_Jakarta_Sans:Regular'] text-xs leading-[19.5px] text-[#232323] md:mx-0 md:mt-1 md:max-w-none md:text-left md:text-base md:leading-6 md:text-[#475569]">Tempel kalimat atau paragraf yang ingin kamu perkuat dengan sitasi. Alerin akan membantu mencari artikel jurnal yang relevan untuk mendukung tulisanmu.</p>
                  <div className="mt-5 grid min-w-0 gap-3 md:grid-cols-[1.35fr_0.95fr]">
                    <label className="grid gap-1.5">
                      <span className="font-['Plus_Jakarta_Sans:SemiBold'] text-[14px] font-semibold text-[#334155] md:hidden">Draf / Paragraf Teks</span>
                      <textarea value={paragraph} onChange={event => setParagraph(event.target.value)} placeholder="Masukkan kalimat atau paragraf yang membutuhkan sitasi." className="min-h-[123px] resize-none rounded-xl border border-slate-200 bg-[rgba(200,226,251,0.24)] p-3 text-[13px] outline-none focus:border-sky-400 md:min-h-44 md:bg-white md:p-4 md:text-xs" />
                    </label>
                    {fileName ? (
                      <div className="flex min-h-[108px] w-full min-w-0 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-sky-200 bg-white p-5 text-center md:min-h-44 md:p-4">
                        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-red-500 shadow-[0_0_0_4px_rgba(224,242,254,1)] md:h-10 md:w-10 md:rounded-xl md:shadow-[0_0_0_3.5px_rgba(224,242,254,1)]">
                          <svg viewBox="0 0 14 16" fill="none" stroke="white" strokeWidth="1.2" strokeLinejoin="round" aria-hidden="true" className="h-7 w-6 md:h-4 md:w-[14px]">
                            <path d="M2 1.5h6l4 4v9H2z" />
                            <path d="M8 1.5v4h4" />
                          </svg>
                          <span className="absolute bottom-1 text-[9px] font-extrabold uppercase leading-none tracking-tight text-rose-200 md:bottom-[3px] md:text-[6px]">PDF</span>
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
                            Lihat Pratinjau
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
                      <label className="flex min-h-[108px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/40 p-4 text-center md:min-h-44 md:border-2 md:border-dashed md:border-sky-200 md:bg-white">
                        <span className="flex h-[53px] w-[53px] items-center justify-center rounded-full border border-sky-100 bg-white shadow-sm md:h-9 md:w-9 md:rounded-lg md:border-0 md:bg-sky-50 md:shadow-none">
                          <img src={`${mobileAssets}/36094.svg`} alt="" className="md:hidden" />
                          <img src={`${searchAssets}/f5e87.svg`} alt="" className="hidden md:block" />
                        </span>
                        <span className="mt-3 text-[13px] font-semibold md:text-xs md:font-bold md:text-slate-800">Unggah artikel atau catatan</span>
                        <span className="mt-1 text-[12px] text-[#94a3b8] md:text-slate-500">PDF, DOCX, atau TXT hingga 20 MB</span>
                        <span className="mt-2 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] text-[#004f80] md:bg-transparent md:p-0 md:text-xs md:font-semibold md:text-emerald-600">Belum ada dokumen</span>
                        <input type="file" accept=".pdf,.doc,.docx,.txt" className="sr-only" onChange={handleFileChange} />
                      </label>
                    )}
                  </div>
                  <div className="mt-4 flex flex-col gap-3 md:mt-5 md:flex-row md:items-center md:justify-between">
                    <label className="flex cursor-pointer select-none items-center gap-2 text-[13px] text-[#475569] md:text-xs md:font-semibold md:text-slate-700">
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
                          <>
                            <img src={`${mobileAssets}/9e421.svg`} alt="" className="max-w-none origin-center scale-[0.6667] md:hidden" />
                            <img src={`${searchAssets}/b5bd9.svg`} alt="" className="hidden md:block" />
                          </>
                        )}
                      </span>
                      Gunakan filter aktif pada rekomendasi Alerin
                    </label>
                    <button
                      type="button"
                      disabled={!analysisReady}
                      onClick={() => {
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
                        analysisReady ? "bg-[#00629b] md:bg-sky-700" : "cursor-not-allowed bg-slate-300 md:bg-slate-300"
                      }`}
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
            <div className="-mt-4 md:hidden">
              <div className="flex items-center justify-between px-1">
                <h1 className="font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold tracking-[-0.27px] text-[#0f172a]">Folder Riset</h1>
                <button
                  type="button"
                  aria-label="Tambah folder"
                  onClick={() => setNewFolderOpen(true)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0369a1]"
                >
                  <img src="/assets/jurnal-design/collection-mobile/ce139.svg" alt="" />
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
                        className="max-w-none origin-center scale-[0.7]"
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
                      <span className="rounded-full bg-sky-100 px-2 py-1 font-semibold text-[#0369a1]">Scopus Q1</span>
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
                        onClick={() => {
                          if (window.confirm("Hapus jurnal ini dari koleksi?")) removeSavedJournal(journal.id);
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
              )}
            </div>

            <div className="mx-auto hidden max-w-[1160px] gap-5 md:grid lg:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="font-['Plus_Jakarta_Sans:ExtraBold'] text-[28px] font-extrabold tracking-[-0.69px] text-[#003859]">Koleksi jurnal</h1>
                    <p className="mt-1 text-xs text-[#64748b]">Simpan jurnal penting agar mudah ditemukan kembali saat menulis.</p>
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
                        onRemove={() => removeSavedJournal(journal.id)}
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
                  <div className="flex items-center justify-between px-2 pb-3">
                    <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold text-[#1e293b]">Folder</h2>
                    <button
                      type="button"
                      aria-label="Buat folder baru"
                      onClick={() => setNewFolderOpen(true)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200"
                    >
                      <img src={`${collectionAssets}/b2242.svg`} alt="" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setActiveFolderId("all")}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs ${
                        activeFolderId === "all" ? "bg-sky-100 text-[#0066a1]" : "text-[#475569]"
                      }`}
                    >
                      <img src={`${collectionAssets}/8b8d1.svg`} alt="" />
                      <span className="flex-1">Semua jurnal tersimpan</span>
                      <span>{folderCounts.all ?? 0}</span>
                    </button>
                    {folders.map(folder => (
                      <button
                        key={folder.id}
                        type="button"
                        onClick={() => setActiveFolderId(folder.id)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs ${
                          activeFolderId === folder.id ? "bg-sky-100 text-[#0066a1]" : "text-[#475569]"
                        }`}
                      >
                        <img src={`${collectionAssets}/e1558.svg`} alt="" />
                        <span className="flex-1">{folder.name}</span>
                        <span>{folderCounts[folder.id] ?? 0}</span>
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
                <img src={`${mobileAssets}/73c1a.png`} alt="Alerin AI" className="h-8 w-8 rounded-full object-contain" />
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
      <NewFolderModal open={newFolderOpen} onClose={() => setNewFolderOpen(false)} onCreate={createFolder} />
      <RingkasanJurnalModal open={ringkasanOpen} onClose={() => setRingkasanOpen(false)} />
      <TabelPenelitianModal open={tabelOpen} onClose={() => setTabelOpen(false)} />
      <BuatSitasiModal open={sitasiOpen} onClose={() => setSitasiOpen(false)} />
      <AbstrakJurnalModal open={abstrakOpen} onClose={() => setAbstrakOpen(false)} />
      <Toast message={toast} />
    </div>
  );
}
