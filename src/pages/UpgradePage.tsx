import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router";
import PlusBadgeIcon from "@/components/PlusBadgeIcon";
import AlerinBusinessModal from "@/components/AlerinBusinessModal";
import SaranLaporanModal from "@/components/SaranLaporanModal";
import PasangPintasanModal from "@/components/PasangPintasanModal";
import AlerinToast from "@/components/AlerinToast";

// Deterministic QR Code matrix (33x33) untuk tampilan pembayaran QRIS
const QR_SIZE = 33;
const QR_MATRIX: boolean[][] = (() => {
  const grid: boolean[][] = Array.from({ length: QR_SIZE }, () =>
    Array.from({ length: QR_SIZE }, () => false)
  );
  const reserved: boolean[][] = Array.from({ length: QR_SIZE }, () =>
    Array.from({ length: QR_SIZE }, () => false)
  );

  const setFinder = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = row + r;
        const cc = col + c;
        if (rr < 0 || rr >= QR_SIZE || cc < 0 || cc >= QR_SIZE) continue;
        reserved[rr][cc] = true;
        if (r === -1 || r === 7 || c === -1 || c === 7) {
          grid[rr][cc] = false;
        } else if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          grid[rr][cc] = true;
        } else {
          grid[rr][cc] = false;
        }
      }
    }
  };

  setFinder(0, 0);
  setFinder(0, QR_SIZE - 7);
  setFinder(QR_SIZE - 7, 0);

  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const rr = 24 + r;
      const cc = 24 + c;
      reserved[rr][cc] = true;
      grid[rr][cc] =
        Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0);
    }
  }

  for (let i = 8; i < QR_SIZE - 8; i++) {
    reserved[6][i] = true;
    grid[6][i] = i % 2 === 0;
    reserved[i][6] = true;
    grid[i][6] = i % 2 === 0;
  }

  let seed = 20261118;
  for (let r = 0; r < QR_SIZE; r++) {
    for (let c = 0; c < QR_SIZE; c++) {
      if (reserved[r][c]) continue;
      seed = (seed * 1664525 + 1013904223) >>> 0;
      grid[r][c] = (seed & 0x10000) !== 0;
    }
  }
  return grid;
})();

// Database rincian detail paket fitur
const FEATURE_DETAILS: Record<
  string,
  {
    name: string;
    tag: string;
    desc: string;
    capabilities: string[];
  }
> = {
  chat: {
    name: "Alerin Chat",
    tag: "Diskusi & Riset",
    desc: "Teman diskusi akademik untuk eksplorasi topik penelitian, penyusunan outline, konsultasi teori, hingga persiapan bimbingan dosen.",
    capabilities: [
      "Diskusi interaktif untuk menemukan ide dan topik skripsi",
      "Penyusunan outline bab dan alur argumen yang runtut",
      "Konsultasi konsep teori, metodologi, dan telaah pustaka",
      "Persiapan presentasi sidang dan simulasi tanya-jawab",
      "Akses obrolan responsif 24 jam tanpa batasan waktu",
    ],
  },
  jurnal: {
    name: "Alerin Jurnal",
    tag: "Scopus & SINTA",
    desc: "Pencarian referensi jurnal nasional terakreditasi SINTA dan jurnal internasional bereputasi Scopus untuk memperkuat dasar teorimu.",
    capabilities: [
      "Akses ke 200 juta+ artikel ilmiah dan repositori dunia",
      "Ringkasan matriks sintesis otomatis (metode, hasil, gap riset)",
      "Tanya-jawab interaktif langsung ke dalam dokumen jurnal PDF",
      "Format sitasi instan: APA 7th, IEEE, Harvard, dan Vancouver",
      "Ekspor referensi mudah ke Mendeley dan Zotero",
    ],
  },
  skripsi: {
    name: "Alerin Skripsi",
    tag: "Bimbingan Bab 1 - 5",
    desc: "Panduan terarah untuk menyusun draf Bab 1 hingga Bab 5 sesuai pedoman penulisan karya ilmiah perguruan tinggi di Indonesia.",
    capabilities: [
      "Panduan langkah demi langkah Bab 1 sampai Bab 5",
      "Review kecocokan rumusan masalah, tujuan, dan metode riset",
      "Format penulisan otomatis: daftar pustaka, tabel, dan lampiran",
      "Eksplorasi instrumen dan teknik pengumpulan data",
      "Konsultasi intensif kapan saja saat menghadapi revisi dosen",
    ],
  },
  parafrase: {
    name: "Alerin Parafrase",
    tag: "Parafrase Akademik",
    desc: "Tulis ulang kalimat dan paragraf ilmiah agar bebas dari plagiasi Turnitin dan detektor AI kampus, dengan tetap menjaga keutuhan makna aslinya.",
    capabilities: [
      "Parafrase alami yang mempertahankan konteks dan makna asli",
      "Optimasi lolos uji Turnitin dan AI detector kampus",
      "Terintegrasi Alerin Chat untuk eksplorasi diksi dan sinonim",
      "Pilihan gaya bahasa: Formal Akademik, Ringkas, Luwes, dan Baku",
      "Mendukung naskah panjang hingga 10.000 kata per dokumen",
    ],
  },
};

// Database harga 4 fitur Alerin per durasi
const PRICING_DATABASE: Record<
  string,
  {
    name: string;
    tag: string;
    prices: Record<"7d" | "30d" | "1y", number>;
    original_yearly: number;
    description: string;
    badges: string[];
    icon: string;
    mobileIcon?: string;
    iconClass?: string;
    framedIcon?: boolean;
  }
> = {
  chat: {
    name: "Alerin Chat",
    tag: "AI Asisten Riset",
    prices: {
      "7d": 25000,
      "30d": 59000,
      "1y": 566000,
    },
    original_yearly: 708000,
    description: "AI asisten untuk riset akademik dan diskusi topik.",
    badges: ["Obrolan Riset Cerdas", "Brainstorming 24/7"],
    icon: "05de5.svg",
    mobileIcon: "17983.svg",
    iconClass: "h-[44px] w-[44px]",
    framedIcon: false,
  },
  jurnal: {
    name: "Alerin Jurnal",
    tag: "Scopus & SINTA",
    prices: {
      "7d": 35000,
      "30d": 79000,
      "1y": 758000,
    },
    original_yearly: 948000,
    description: "Temukan referensi akademik terindeks Scopus & Sinta.",
    badges: ["Akses 200M+ Paper", "Ekspor Sitasi Instan"],
    icon: "5ad2c.svg",
    mobileIcon: "0a094.svg",
    iconClass: "h-[44px] w-[44px]",
    framedIcon: false,
  },
  skripsi: {
    name: "Alerin Skripsi",
    tag: "Sarjana (S1)",
    prices: {
      "7d": 35000,
      "30d": 79000,
      "1y": 758000,
    },
    original_yearly: 948000,
    description: "Dapatkan arahan sesuai tahap penelitian dan revisi kamu.",
    badges: ["Review Metodologi", "Format Bab 1-5"],
    icon: "4d2e9.svg",
    mobileIcon: "52023.svg",
    iconClass: "h-[16.6px] w-[20.3px]",
    framedIcon: true,
  },
  parafrase: {
    name: "Alerin Parafrase",
    tag: "Humanized AI",
    prices: {
      "7d": 29000,
      "30d": 69000,
      "1y": 662000,
    },
    original_yearly: 828000,
    description: "Ubah teks skripsi otomatis dengan pilihan gaya & intensitas.",
    badges: ["Bypass AI Detector", "Bebas Plagiasi"],
    icon: "377ce.svg",
    mobileIcon: "bff8f.svg",
    iconClass: "h-[16.1px] w-[18.1px]",
    framedIcon: true,
  },
};

const FEATURE_KEYS = ["chat", "jurnal", "skripsi", "parafrase"];

function formatRupiah(num: number): string {
  const absFormatted = new Intl.NumberFormat("id-ID").format(Math.abs(num));
  return num < 0 ? `-Rp${absFormatted}` : `Rp${absFormatted}`;
}

function getDurationReadable(dur: "7d" | "30d" | "1y", tier?: "plus" | "pro"): string {
  const durLabel = dur === "7d" ? "7 Hari" : dur === "30d" ? "30 Hari" : "1 Tahun";
  if (!tier) return durLabel;
  return `${durLabel} (${tier === "pro" ? "Pro" : "Plus"})`;
}

interface NotifItemData {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  tab: string;
}

const UPGRADE_NOTIFS_UMUM: NotifItemData[] = [
  {
    id: "notif-target",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    title: "Target mingguan menunggu",
    desc: "Kamu belum menyelesaikan satu pun target minggu ini.",
    time: "Baru saja",
    unread: true,
    tab: "progress",
  },
  {
    id: "notif-deadline",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2 2" />
        <path d="M5 3 2 6" />
        <path d="m22 6-3-3" />
        <path d="M6.38 18.7 4 21" />
        <path d="M17.64 18.67 20 21" />
      </svg>
    ),
    title: "Deadline besok!",
    desc: "Presentasi Riset Pasar · besok pukul 09.00",
    time: "1 jam lalu",
    unread: true,
    tab: "progress",
  },
  {
    id: "notif-quiz",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
    title: "QUIZLAB tersedia",
    desc: "Quiz baru Sistem Informasi Semester 6 sudah aktif.",
    time: "3 jam lalu",
    unread: false,
    tab: "quizlab",
  },
  {
    id: "notif-saran",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    ),
    title: "Alerin punya saran",
    desc: "Berdasarkan progresmu, coba mulai BAB II sekarang.",
    time: "Kemarin",
    unread: false,
    tab: "percakapan",
  },
];

const UPGRADE_NOTIFS_SISTEM: NotifItemData[] = [
  {
    id: "notif-v24",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "Pembaruan Alerin v2.4",
    desc: "Peningkatan kecepatan respon dan performa model penalaran terbaru.",
    time: "2 hari lalu",
    unread: false,
    tab: "percakapan",
  },
  {
    id: "notif-sync",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "Sinkronisasi Berhasil",
    desc: "Riwayat obrolan dan data tugas perkuliahan telah aman tersimpan.",
    time: "3 hari lalu",
    unread: false,
    tab: "percakapan",
  },
];

function UpgradeNotifModal({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate: (tab: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"umum" | "sistem">("umum");
  const [notifsUmum, setNotifsUmum] = useState<NotifItemData[]>(UPGRADE_NOTIFS_UMUM);
  const [notifsSistem, setNotifsSistem] = useState<NotifItemData[]>(UPGRADE_NOTIFS_SISTEM);
  const [isSimulatedEmpty, setIsSimulatedEmpty] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMarkAllRead = () => {
    setNotifsUmum((prev) => prev.map((n) => ({ ...n, unread: false })));
    setNotifsSistem((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const displayUmum = isSimulatedEmpty ? [] : isDesktop ? notifsUmum : notifsUmum.slice(0, 4);
  const displaySistem = isSimulatedEmpty ? [] : notifsSistem;
  const currentList = activeTab === "umum" ? displayUmum : displaySistem;

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs select-none animate-[gemini-fade-in_0.15s_ease-out]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[390px] md:max-w-[680px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-[gemini-zoom-in_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 md:px-6 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsSimulatedEmpty((prev) => !prev)}
              title={isSimulatedEmpty ? "Tampilkan notifikasi" : "Simulasikan tidak ada notifikasi"}
              className={`size-9 rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                isSimulatedEmpty
                  ? "bg-slate-200/80 border-slate-300 text-slate-700 shadow-inner"
                  : "bg-slate-100 hover:bg-slate-200/80 border-slate-200/70 text-slate-600 shadow-2xs"
              }`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <h3 className="font-bold text-[17px] text-slate-900 tracking-tight">Notifikasi</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={isSimulatedEmpty || currentList.length === 0}
              className={`text-xs font-semibold transition-all ${
                isSimulatedEmpty || currentList.length === 0
                  ? "text-slate-400 cursor-not-allowed"
                  : "text-slate-900 hover:text-black active:scale-95 cursor-pointer"
              }`}
            >
              Tandai dibaca
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup notifikasi"
              className="size-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-90 transition-all cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab row */}
        <div className="grid grid-cols-2 border-b border-slate-100 w-full relative">
          <button
            type="button"
            onClick={() => setActiveTab("umum")}
            className={`relative flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "umum" ? "text-blue-600 font-bold" : "text-slate-400 hover:text-slate-600 font-medium"
            }`}
          >
            <span>Umum</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${
                activeTab === "umum" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
              }`}
            >
              {displayUmum.length}
            </span>
            {activeTab === "umum" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sistem")}
            className={`relative flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "sistem" ? "text-blue-600 font-bold" : "text-slate-400 hover:text-slate-600 font-medium"
            }`}
          >
            <span>Sistem</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${
                activeTab === "sistem" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
              }`}
            >
              {displaySistem.length}
            </span>
            {activeTab === "sistem" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>

        {/* List items */}
        <div
          className={`max-h-[60vh] md:max-h-[500px] md:h-auto overflow-y-auto md:p-4 md:pb-4 pb-2 [&::-webkit-scrollbar]:hidden ${
            currentList.length === 0
              ? "divide-y divide-slate-100/90 md:divide-y-0 md:flex md:items-center md:justify-center"
              : "divide-y divide-slate-100/90 md:divide-y-0 md:grid md:grid-cols-2 md:gap-2.5 md:content-start"
          }`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {currentList.length === 0 ? (
            <div className="py-14 md:py-0 px-6 flex flex-col items-center justify-center text-center animate-[gemini-fade-in_0.2s_ease-out]">
              <div className="size-16 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-400 mb-3.5 shadow-2xs">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-slate-400">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  <line x1="4" y1="4" x2="20" y2="20" />
                </svg>
              </div>
              <h4 className="text-[15px] font-bold text-slate-800 tracking-tight">Tidak ada notifikasi</h4>
              <p className="text-xs text-slate-400 font-normal leading-relaxed mt-1.5 max-w-[260px]">
                Belum ada pembaruan aktivitas untukmu saat ini.
              </p>
            </div>
          ) : (
            currentList.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  onNavigate(n.tab);
                  onClose();
                }}
                className="w-full flex items-start gap-3.5 px-5 py-3.5 md:px-4 md:py-3 md:rounded-2xl md:border md:border-slate-100 md:bg-slate-50/40 hover:bg-slate-50/80 md:hover:bg-slate-50 active:bg-slate-100/70 transition-colors text-left cursor-pointer group"
              >
                <div className="size-11 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 mt-0.5 text-slate-700 shadow-2xs group-hover:bg-white group-hover:border-slate-300 transition-colors">
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-1.5 leading-snug">
                    <h4 className="text-[13.5px] font-medium text-slate-900 truncate">{n.title}</h4>
                    {n.unread && <span className="size-2 rounded-full bg-blue-600 shrink-0 inline-block" />}
                  </div>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed mt-0.5 line-clamp-2">
                    {n.desc}
                  </p>
                  <span className="text-[11px] text-slate-400 font-normal mt-1 block">
                    {n.time}
                  </span>
                </div>
                <div className="shrink-0 pt-3 text-slate-300 group-hover:text-slate-400 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function UpgradePage() {
  const navigate = useNavigate();

  const [toast, setToast] = useState<string | { title: string; description?: string } | null>(null);
  const showToast = useCallback(
    (msg: string | { title: string; description?: string }, _type?: string) => {
      setToast(msg);
    },
    []
  );

  // State
  const [currentDuration, setCurrentDuration] = useState<"7d" | "30d" | "1y">("30d");
  const [currentTier, setCurrentTier] = useState<"plus" | "pro">("plus");
  const [openDropdown, setOpenDropdown] = useState<"7d" | "30d" | "1y" | null>(null);
  const [businessModalOpen, setBusinessModalOpen] = useState(false);

  // Header Interactive States (Persis Header Alerin Chat)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [pintasanOpen, setPintasanOpen] = useState(false);
  const [profileMenuPos, setProfileMenuPos] = useState<{ top: number; right: number } | null>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const [currentAccountPlan, setCurrentAccountPlan] = useState("Paket: Plus");
  const [accountPlan, setAccountPlan] = useState<"plus" | "pro">(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("alerin_user_package") || localStorage.getItem("alerin_user_plan");
        if (saved && saved.toLowerCase().includes("pro")) return "pro";
      } catch {}
    }
    return "plus";
  });

  const toggleAccountPlan = useCallback(() => {
    setAccountPlan((prev) => {
      const next = prev === "plus" ? "pro" : "plus";
      try {
        localStorage.setItem("alerin_user_package", next);
        localStorage.setItem("alerin_user_plan", next);
        window.dispatchEvent(new Event("alerin_plan_change"));
      } catch {}
      showToast(next === "pro" ? "Beralih ke akun Pro" : "Beralih ke akun Plus", "success");
      return next;
    });
  }, [showToast]);

  useEffect(() => {
    const handlePlanChange = () => {
      try {
        const saved = localStorage.getItem("alerin_user_package") || localStorage.getItem("alerin_user_plan");
        if (saved && saved.toLowerCase().includes("pro")) setAccountPlan("pro");
        else if (saved && saved.toLowerCase().includes("plus")) setAccountPlan("plus");
      } catch {}
    };
    window.addEventListener("alerin_plan_change", handlePlanChange);
    return () => window.removeEventListener("alerin_plan_change", handlePlanChange);
  }, []);
  const [isDarkTheme, setIsDarkTheme] = useState(() =>
    typeof window !== "undefined" && window.localStorage.getItem("alerin-theme") === "dark"
  );

  const [historyList] = useState<Array<{ id: string; title: string; pinned?: boolean }>>(() => {
    try {
      const saved = localStorage.getItem("alerin_mobile_riwayat");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      { id: "rw-u1", title: "Bantu cari ide judul skripsi ..." },
      { id: "rw-u2", title: "Bantu buat kerangka BAB I..." },
      { id: "rw-u3", title: "Parafrase abstrak agar be..." },
      { id: "rw-u4", title: "Analisis data kuantitatif..." },
      { id: "rw-u5", title: "Review jurnal internasional..." },
      { id: "rw-u6", title: "Perbaiki format daftar pustaka..." },
      { id: "rw-u7", title: "Panduan sitasi APA style..." },
    ];
  });
  const [expandedHistory, setExpandedHistory] = useState(false);

  const pinnedHistoryItems = useMemo(
    () => historyList.filter((item) => Boolean(item.pinned)),
    [historyList]
  );
  const unpinnedHistoryItems = useMemo(
    () => historyList.filter((item) => !item.pinned),
    [historyList]
  );

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkTheme(window.localStorage.getItem("alerin-theme") === "dark");
    };
    window.addEventListener("alerin-theme-change", checkTheme);
    return () => window.removeEventListener("alerin-theme-change", checkTheme);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkTheme;
    setIsDarkTheme(nextDark);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("alerin-theme", nextDark ? "dark" : "light");
      const shell = document.querySelector(".alerin-shell");
      shell?.classList.toggle("profile-dark", nextDark);
      shell?.classList.toggle("alerin-dark-theme", nextDark);
      shell?.classList.toggle("dark", nextDark);
      if (shell instanceof HTMLElement) shell.style.backgroundColor = nextDark ? "#0f172a" : "#ffffff";
      document.documentElement.classList.toggle("dark", nextDark);
      document.documentElement.classList.toggle("profile-dark", nextDark);
      document.documentElement.classList.toggle("alerin-dark-theme", nextDark);
      document.documentElement.style.colorScheme = nextDark ? "dark" : "light";
      if (document.body) {
        document.body.classList.toggle("dark", nextDark);
        document.body.classList.toggle("profile-dark", nextDark);
        document.body.classList.toggle("alerin-dark-theme", nextDark);
        document.body.style.backgroundColor = nextDark ? "#0f172a" : "#ffffff";
      }
      window.dispatchEvent(new Event("alerin-theme-change"));
    }
    showToast(nextDark ? "Mode Gelap diaktifkan" : "Mode Terang diaktifkan", "info");
  };

  useEffect(() => {
    const handleOutsideClick = () => {
      setOpenDropdown(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const getPrice = useCallback((key: string) => {
    const item = PRICING_DATABASE[key];
    if (!item) return 0;
    const base = item.prices[currentDuration];
    if (currentTier === "pro") {
      return Math.round((base * 1.35) / 1000) * 1000;
    }
    return base;
  }, [currentDuration, currentTier]);

  const getOriginalYearly = useCallback((key: string) => {
    const item = PRICING_DATABASE[key];
    if (!item) return 0;
    if (currentTier === "pro") {
      return Math.round((item.original_yearly * 1.35) / 1000) * 1000;
    }
    return item.original_yearly;
  }, [currentTier]);
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(
    () => new Set(["skripsi", "parafrase"])
  );
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    amount: number;
    type: "fixed";
  } | null>(null);


  const [activeModalFeatureKey, setActiveModalFeatureKey] = useState<string | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
  const [mobilePaymentType, setMobilePaymentType] = useState<"qris" | "va_bca" | "shopeepay" | "card" | "gopay" | "akulaku">("qris");
  const [bcaGuideTab, setBcaGuideTab] = useState<"atm" | "klikbca" | "mbca" | null>("atm");
  const [briGuideTab, setBriGuideTab] = useState<"atm" | "ib" | "brimo" | null>("atm");
  const [shopeeGuideOpen, setShopeeGuideOpen] = useState(true);
  const [gopayGuideOpen, setGopayGuideOpen] = useState(true);
  const [akulakuGuideOpen, setAkulakuGuideOpen] = useState(true);
  const [cardGuideOpen, setCardGuideOpen] = useState(true);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isQrisLoading, setIsQrisLoading] = useState(false);
  const [cancelPaymentModalOpen, setCancelPaymentModalOpen] = useState(false);
  const [cancelPaymentReason, setCancelPaymentReason] = useState<string>("Saya berubah pikiran");
  const [qrisGuideOpen, setQrisGuideOpen] = useState(true);
  const [qrisSecondsLeft, setQrisSecondsLeft] = useState(3 * 3600 + 54 * 60 + 57);
  const checkoutScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isQrisModalOpen) {
      setIsQrisLoading(false);
      return;
    }
    setIsQrisLoading(true);
    const loadTimer = window.setTimeout(() => {
      setIsQrisLoading(false);
    }, 900);
    return () => window.clearTimeout(loadTimer);
  }, [isQrisModalOpen]);

  useEffect(() => {
    if (!isQrisModalOpen || isQrisLoading) return;
    const timer = window.setInterval(() => {
      setQrisSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isQrisModalOpen, isQrisLoading]);

  const qrisHours = Math.floor(qrisSecondsLeft / 3600);
  const qrisMinutes = Math.floor((qrisSecondsLeft % 3600) / 60);
  const qrisSeconds = qrisSecondsLeft % 60;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    | "va"
    | "qris"
    | "dana"
    | "shopeepay"
    | "gopay"
    | "alfa"
    | "indomaret"
    | "cc"
    | "akulaku"
    | "kredivo"
    | "ewallet"
  >("qris");
  const [vaDropdownOpen, setVaDropdownOpen] = useState(false);
  const [selectedVaBank, setSelectedVaBank] = useState<string>("bni");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Segment Switcher: Individu vs Business
  const [planType, setPlanType] = useState<"individual" | "business">("individual");
  const [bizForm, setBizForm] = useState({
    name: "",
    email: "",
    institution: "",
    purpose: "",
    features: [] as string[],
  });
  const [bizSubmitting, setBizSubmitting] = useState(false);
  const [bizConfirmModalOpen, setBizConfirmModalOpen] = useState(false);
  const [isVoucherSuccessModalOpen, setIsVoucherSuccessModalOpen] = useState(false);
  const [bizErrors, setBizErrors] = useState<{
    name?: boolean;
    email?: boolean;
    institution?: boolean;
    purpose?: boolean;
    features?: boolean;
  }>({});

  const isAnyModalOpen = Boolean(
    activeModalFeatureKey ||
      isCheckoutModalOpen ||
      isQrisModalOpen ||
      isSuccessModalOpen ||
      bizConfirmModalOpen ||
      businessModalOpen ||
      isVoucherSuccessModalOpen ||
      notifOpen ||
      mobileDrawerOpen
  );

  useEffect(() => {
    if (!isAnyModalOpen) return;
    const scrollY = window.scrollY;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevHtmlScrollBehavior = document.documentElement.style.scrollBehavior;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyLeft = document.body.style.left;
    const prevBodyRight = document.body.style.right;
    const prevBodyWidth = document.body.style.width;
    const prevBodyOverscroll = document.body.style.overscrollBehavior;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.left = prevBodyLeft;
      document.body.style.right = prevBodyRight;
      document.body.style.width = prevBodyWidth;
      document.body.style.overscrollBehavior = prevBodyOverscroll;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      document.documentElement.style.scrollBehavior = prevHtmlScrollBehavior;
    };
  }, [isAnyModalOpen]);

  const toggleBizFeature = (featureName: string) => {
    setBizForm((prev) => {
      const exists = prev.features.includes(featureName);
      const updated = exists
        ? prev.features.filter((f) => f !== featureName)
        : [...prev.features, featureName];
      return { ...prev, features: updated };
    });
    if (bizErrors.features) {
      setBizErrors((prev) => ({ ...prev, features: false }));
    }
  };

  const handleBizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof bizErrors = {};
    if (!bizForm.name.trim()) errors.name = true;
    if (!bizForm.email.trim() || !bizForm.email.includes("@")) errors.email = true;
    if (!bizForm.institution.trim()) errors.institution = true;
    if (!bizForm.purpose.trim()) errors.purpose = true;
    if (bizForm.features.length === 0) errors.features = true;

    if (Object.keys(errors).length > 0) {
      setBizErrors(errors);
      showToast("Harap lengkapi semua kolom formulir yang bertanda bintang (*)", "warning");
      return;
    }

    setBizErrors({});
    setBizSubmitting(true);

    // Alur Pengiriman: Otomatis dikirim ke email admin@alerin.id
    console.log("Mengirim formulir kemitraan business ke admin@alerin.id:", bizForm);

    setTimeout(() => {
      setBizSubmitting(false);
      setBizConfirmModalOpen(true);
      // Reset form
      setBizForm({
        name: "",
        email: "",
        institution: "",
        purpose: "",
        features: [],
      });
      showToast("Berhasil mengirim formulir ke admin@alerin.id", "success");
    }, 700);
  };

  // Toggle Features
  const toggleFeature = (key: string) => {
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size <= 1) {
          showToast("Pilih minimal 1 fitur utama untuk melanjutkan.", "warning");
          return prev;
        }
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Calculations
  const {
    subtotal,
    originalTotal,
    bundlingRate,
    bundlingLabel,
    bundlingDiscount,
    annualSavings,
    voucherDiscount,
    grandTotal,
    bundlingInfo,
  } = useMemo(() => {
    let sub = 0;
    let orig = 0;

    FEATURE_KEYS.forEach((key) => {
      const price = getPrice(key);
      if (selectedFeatures.has(key)) {
        sub += price;
        orig += currentDuration === "1y" ? getOriginalYearly(key) : price;
      }
    });

    const count = selectedFeatures.size;
    let rate = 0;
    let label = "Tidak Ada Diskon";

    if (count === 2) {
      rate = 0.15;
      label = "Diskon 15%";
    } else if (count === 3) {
      rate = 0.25;
      label = "Hemat 25%";
    } else if (count === 4) {
      rate = 0.35;
      label = "Paket Komplit 35%";
    }

    const bDiscount = Math.round(sub * rate);
    const annSavings = currentDuration === "1y" ? orig - sub : 0;

    let vDiscount = 0;
    if (appliedVoucher && appliedVoucher.type === "fixed") {
      vDiscount = Math.min(appliedVoucher.amount, sub - bDiscount);
    }

    const total = Math.max(0, sub - bDiscount - vDiscount);

    let infoTitle = "";
    let infoBadge = "";
    let infoBadgeClass = "";
    let infoDesc = "";

    if (count === 1) {
      infoTitle = "Tambah 1 Fitur Lagi untuk Diskon!";
      infoBadge = "Harga Normal (1 Fitur)";
      infoBadgeClass = "bg-slate-200 text-slate-700";
      infoDesc =
        "Pilih 2 fitur untuk diskon 15%, 3 fitur hemat 25%, atau ambil seluruh 4 fitur hemat hingga 35%.";
    } else if (count === 2) {
      infoTitle = "Bundling 2 Fitur Aktif";
      infoBadge = "Diskon Bundling 15%";
      infoBadgeClass = "bg-brand-100 text-brand-700 border border-brand-200";
      infoDesc = "Diskon 15% aktif! Tambah 1 fitur lagi untuk membuka diskon 25%.";
    } else if (count === 3) {
      infoTitle = "Bundling 3 Fitur Aktif";
      infoBadge = "Diskon Hemat 25%";
      infoBadgeClass = "bg-brand-100 text-brand-700 border border-brand-200";
      infoDesc = "Potongan 25% aktif! Tambah 1 fitur lagi untuk paket komplit hemat 35%.";
    } else {
      infoTitle = "Akses Komplit Semua Fitur Alerin";
      infoBadge = "Diskon Maksimal 35%";
      infoBadgeClass = "bg-brand-700 text-white shadow-sm";
      infoDesc =
        "Paket all-in-one terlengkap untuk riset akademik, pencarian jurnal, bimbingan skripsi, dan parafrase!";
    }

    return {
      subtotal: sub,
      originalTotal: orig,
      bundlingRate: rate,
      bundlingLabel: label,
      bundlingDiscount: bDiscount,
      annualSavings: annSavings,
      voucherDiscount: vDiscount,
      grandTotal: total,
      bundlingInfo: {
        title: infoTitle,
        badge: infoBadge,
        badgeClass: infoBadgeClass,
        desc: infoDesc,
      },
    };
  }, [currentDuration, selectedFeatures, appliedVoucher]);

  // Voucher apply handler
  const handleApplyVoucher = () => {
    const code = voucherInput.trim().toUpperCase();
    if (!code) {
      showToast("Ketikkan kode promo terlebih dahulu.", "warning");
      return;
    }
    if (code === "ALLERIHEMAT" || code === "ALERINHEMAT") {
      setAppliedVoucher({
        code,
        amount: 25000,
        type: "fixed",
      });
      setIsVoucherSuccessModalOpen(true);
      showToast(`Voucher ${code} berhasil diterapkan! (Hemat Rp25.000)`, "success");
    } else {
      showToast("Kode voucher tidak valid atau sudah kedaluwarsa.", "error");
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput("");
    showToast("Voucher telah dihapus.", "info");
  };

  // Payment Execution Simulation
  const handleExecutePayment = (forceMobile = false) => {
    if (forceMobile || (typeof window !== "undefined" && window.innerWidth < 768)) {
      if (selectedPaymentMethod === "qris") {
        setMobilePaymentType("qris");
        setQrisGuideOpen(true);
        setQrisSecondsLeft(3 * 3600 + 54 * 60 + 57);
        setIsQrisLoading(true);
        setIsQrisModalOpen(true);
        checkoutScrollRef.current?.scrollTo({ top: 0 });
        return;
      }
      if (selectedPaymentMethod === "va") {
        setMobilePaymentType("va_bca");
        setBcaGuideTab("atm");
        setBriGuideTab("atm");
        setQrisSecondsLeft(3 * 3600 + 54 * 60 + 57);
        setIsQrisLoading(true);
        setIsQrisModalOpen(true);
        checkoutScrollRef.current?.scrollTo({ top: 0 });
        return;
      }
      if (selectedPaymentMethod === "gopay" || selectedPaymentMethod === "ewallet") {
        setMobilePaymentType("gopay");
        setGopayGuideOpen(true);
        setQrisSecondsLeft(3 * 3600 + 54 * 60 + 57);
        setIsQrisLoading(true);
        setIsQrisModalOpen(true);
        checkoutScrollRef.current?.scrollTo({ top: 0 });
        return;
      }
      if (selectedPaymentMethod === "akulaku") {
        setMobilePaymentType("akulaku");
        setAkulakuGuideOpen(true);
        setQrisSecondsLeft(3 * 3600 + 54 * 60 + 57);
        setIsQrisLoading(true);
        setIsQrisModalOpen(true);
        checkoutScrollRef.current?.scrollTo({ top: 0 });
        return;
      }
      if (selectedPaymentMethod === "shopeepay") {
        setMobilePaymentType("shopeepay");
        setShopeeGuideOpen(true);
        setQrisSecondsLeft(3 * 3600 + 54 * 60 + 57);
        setIsQrisLoading(true);
        setIsQrisModalOpen(true);
        checkoutScrollRef.current?.scrollTo({ top: 0 });
        return;
      }
      if (selectedPaymentMethod === "cc") {
        setMobilePaymentType("card");
        setCardGuideOpen(true);
        setQrisSecondsLeft(3 * 3600 + 54 * 60 + 57);
        setIsQrisLoading(true);
        setIsQrisModalOpen(true);
        checkoutScrollRef.current?.scrollTo({ top: 0 });
        return;
      }
    }

    setIsPaymentProcessing(true);
    setTimeout(() => {
      setIsPaymentProcessing(false);
      setIsQrisModalOpen(false);
      setIsCheckoutModalOpen(false);
      setIsSuccessModalOpen(true);
      setCurrentAccountPlan("Paket: Pro");
    }, 1400);
  };

  const handleCopyVaNumber = (vaNumber: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(vaNumber)
        .then(() => showToast("Nomor Virtual Account berhasil disalin", "success"))
        .catch(() => showToast("Nomor Virtual Account disalin", "success"));
    } else {
      showToast("Nomor Virtual Account disalin", "success");
    }
  };

  const handleDownloadQris = () => {
    try {
      const size = 600;
      const margin = 48;
      const cell = (size - margin * 2) / QR_SIZE;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = "#000000";
        for (let r = 0; r < QR_SIZE; r++) {
          for (let c = 0; c < QR_SIZE; c++) {
            if (QR_MATRIX[r][c]) {
              ctx.fillRect(
                Math.floor(margin + c * cell),
                Math.floor(margin + r * cell),
                Math.ceil(cell),
                Math.ceil(cell)
              );
            }
          }
        }
        const link = document.createElement("a");
        link.download = "QRIS-Alerin.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
      showToast("Kode QR berhasil diunduh", "success");
    } catch {
      showToast("Gagal mengunduh kode QR", "warning");
    }
  };

  const handleDownloadInvoice = () => {
    try {
      const link = document.createElement("a");
      link.href = "/invoice-alerin.pdf";
      link.download = "INV-BSO11082600001.pdf";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Invoice berhasil diunduh", "success");
    } catch {
      showToast("Gagal mengunduh invoice", "warning");
    }
  };

  const durationLabel =
    currentDuration === "7d" ? "/7 hari" : currentDuration === "30d" ? "/30 hari" : "/tahun";

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased flex flex-col selection:bg-brand-100 selection:text-brand-900"
      onClick={() => {
        setProfileMenuOpen(false);
      }}
    >
      {/* Toast Notification (Persis Toast di Alerin Chat) */}
      {toast && <AlerinToast msg={toast} onDone={() => setToast(null)} />}

      {/* HEADER & NAVIGATION (Persis Header Utama Alerin di Chat) */}
      <header
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/40 transition-all duration-200 shadow-xs"
        style={{ WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)" }}
      >
        {/* Mobile top header — persis header mobile chat Alerin */}
        <div className="md:hidden flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 w-full">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Buka navigasi"
              className="size-10 rounded-full border border-slate-200/90 bg-white/70 backdrop-blur-sm flex flex-col justify-center items-center gap-1 hover:bg-slate-50 active:scale-95 transition-all shrink-0 shadow-xs cursor-pointer"
              title="Buka Navigasi"
            >
              <div className="w-4 h-0.5 bg-slate-800 rounded-full" />
              <div className="w-4 h-0.5 bg-slate-800 rounded-full" />
            </button>
            {/* Mobile: Upgrade Button */}
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="h-10 px-4 py-2 rounded-full border border-blue-200/90 bg-blue-50/80 hover:bg-blue-100/70 text-[#1A73E8] flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="text-[#1A73E8] text-sm font-semibold leading-5">Upgrade</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setNotifOpen(true)}
              aria-label="Notifikasi"
              className="size-10 rounded-full border border-slate-200/90 bg-white/70 backdrop-blur-sm flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all relative shrink-0 shadow-xs cursor-pointer"
              title="Buka Notifikasi"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setProfileMenuPos({
                  top: rect.bottom + 8,
                  right: Math.max(12, window.innerWidth - rect.right),
                });
                setProfileMenuOpen((o) => !o);
              }}
              aria-label="Profil pengguna"
              className="size-9 rounded-full overflow-hidden shrink-0 hover:opacity-90 active:scale-95 transition-all ring-1 ring-slate-200/90 bg-sky-100 shadow-xs cursor-pointer"
              title="Menu Profil"
            >
              <img
                src="/assets/avatar-profile.jpg"
                alt="Profil"
                className="size-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/assets/avatar-profile.jpg";
                }}
              />
            </button>
          </div>
        </div>

        {/* Desktop top header — persis header desktop chat Alerin */}
        <div className="hidden md:flex items-center justify-between h-[72px] px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Left: Brand Alerin & Kembali ke Chat */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
              <img
                src="/assets/73c1a.png"
                alt="Alerin"
                className="size-9 rounded-full border border-white object-cover shadow-sm group-hover:scale-105 transition-transform"
              />
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                ALERIN
              </span>
            </Link>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-1.5 ml-3 px-3.5 py-2 rounded-full border border-slate-200/90 bg-white/80 hover:bg-blue-50/60 hover:border-blue-200 text-slate-700 hover:text-blue-600 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Kembali ke Chat</span>
            </button>
          </div>

          {/* Right: Floating pill group persis seperti di ClaroPage */}
          <div className="flex items-center gap-2.5">
            {/* Desktop: Upgrade Button */}
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="h-[46px] px-4 rounded-full backdrop-blur-md border border-blue-200/90 bg-blue-50/80 hover:bg-blue-100/70 flex items-center gap-2 transition-colors shrink-0 shadow-[0_4px_20px_rgba(21,93,252,0.08)] text-[#1A73E8] font-semibold text-sm leading-5 cursor-pointer active:scale-95"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Upgrade</span>
            </button>

            <div
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full backdrop-blur-md border border-slate-200/85 bg-white/90 shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition-colors"
            >
              <div className="flex items-center gap-2 pl-0.5 pr-1 text-left">
                <button
                  type="button"
                  ref={profileBtnRef}
                  onClick={(e) => {
                    const pillEl = profileBtnRef.current?.parentElement ?? profileBtnRef.current;
                    const rect = pillEl?.getBoundingClientRect();
                    if (rect) {
                      setProfileMenuPos({
                        top: rect.bottom + 8,
                        right: Math.max(12, window.innerWidth - rect.right),
                      });
                    }
                    setProfileMenuOpen((o) => !o);
                  }}
                  className="flex items-center gap-2.5 text-left hover:opacity-85 transition-opacity cursor-pointer"
                  aria-label="Profil Raka Aditya"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs"
                    style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
                  >
                    RA
                  </div>
                  <div className="min-w-0 flex flex-col items-start leading-tight">
                    <p className="text-xs font-semibold whitespace-nowrap text-slate-800">Raka Aditya</p>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAccountPlan();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleAccountPlan();
                        }
                      }}
                      title={accountPlan === "pro" ? "Klik untuk ganti ke Plus" : "Klik untuk ganti ke Pro"}
                      className="mt-0.5 inline-flex items-center gap-1 rounded-full border border-blue-200 bg-white px-2 py-[1px] font-['Inter:Bold'] text-[9.5px] font-bold leading-[13px] whitespace-nowrap text-slate-900 shadow-2xs hover:border-blue-300 hover:bg-blue-50/60 transition-all active:scale-95 cursor-pointer select-none"
                    >
                      <span>{accountPlan === "pro" ? "Pro" : "Plus"}</span>
                      <PlusBadgeIcon tier={accountPlan} size={11} />
                    </span>
                  </div>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-400 ml-0.5 shrink-0"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
              <div className="w-px h-5 shrink-0 bg-slate-200/80" />
              <button
                type="button"
                onClick={() => setNotifOpen(true)}
                title="Notifikasi"
                aria-label="Notifikasi"
                className="relative w-8 h-8 flex items-center justify-center rounded-full transition-colors shrink-0 cursor-pointer text-slate-500 hover:text-slate-800 hover:bg-slate-100/80"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 border border-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Modal (Persis NotifPanel di Alerin Chat) */}
      {notifOpen && (
        <UpgradeNotifModal
          onClose={() => setNotifOpen(false)}
          onNavigate={(tab) => {
            navigate(tab ? `/?tab=${tab}` : "/");
            setNotifOpen(false);
          }}
        />
      )}

      {/* Alerin Business Modal */}
      {businessModalOpen && (
        <AlerinBusinessModal
          onClose={() => setBusinessModalOpen(false)}
          onToast={showToast}
        />
      )}

      {/* Saran & Laporan Modal */}
      {feedbackOpen && (
        <SaranLaporanModal
          onClose={() => setFeedbackOpen(false)}
          onToast={showToast}
          isDark={isDarkTheme}
        />
      )}

      {/* Pasang Pintasan Modal */}
      {pintasanOpen && (
        <PasangPintasanModal
          onClose={() => setPintasanOpen(false)}
          onToast={showToast}
          isDark={isDarkTheme}
        />
      )}

      {/* Profile Popup Menu (Persis Profile Menu di Alerin Chat) */}
      {profileMenuOpen && profileMenuPos && (
        <>
          <div className="fixed inset-0 z-[190]" onClick={() => setProfileMenuOpen(false)} />
          <div
            className={`fixed z-[200] w-64 max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border animate-[gemini-fade-in_0.15s_ease-out] ${
              isDarkTheme
                ? "bg-[#1e293b] border-slate-700 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3)] text-slate-100"
                : "border-slate-100 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.13),0_2px_8px_rgba(0,0,0,0.06)] text-slate-900"
            }`}
            style={{ top: profileMenuPos.top, right: profileMenuPos.right }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center gap-3 border-b px-4 py-4 ${isDarkTheme ? "border-slate-700/80" : "border-slate-100"}`}>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white overflow-hidden ring-1 ${isDarkTheme ? "ring-slate-700" : "ring-slate-100"}`}>
                <img
                  src="/assets/avatar-profile.jpg"
                  alt="Raka"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              </div>
              <div className="min-w-0">
                <p className={`truncate text-sm font-bold ${isDarkTheme ? "text-white" : "text-slate-900"}`}>Raka</p>
                <p className="mt-0.5 truncate text-xs text-slate-400">rakaaditya@gmail.com</p>
              </div>
            </div>

            <div className="p-2 space-y-0.5">
              <button
                type="button"
                onClick={() => {
                  navigate("/?tab=profil");
                  setProfileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors cursor-pointer text-left ${
                  isDarkTheme ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-sm font-medium">Profil</span>
              </button>

              <button
                type="button"
                role="switch"
                aria-checked={isDarkTheme}
                onClick={() => {
                  toggleTheme();
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-colors cursor-pointer text-left ${
                  isDarkTheme ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-3">
                  {isDarkTheme ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                  <span className="text-sm font-medium">
                    {isDarkTheme ? "Mode Terang" : "Mode Gelap"}
                  </span>
                </span>
                <span className={`relative h-6 w-11 rounded-full transition-colors ${isDarkTheme ? "bg-blue-600" : "bg-slate-200"}`}>
                  <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${isDarkTheme ? "translate-x-5" : "translate-x-0"}`} />
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFeedbackOpen(true);
                  setProfileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors cursor-pointer text-left ${
                  isDarkTheme ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M8 9h8M8 13h5" />
                </svg>
                <span className="text-sm font-medium">Saran &amp; Laporan</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPintasanOpen(true);
                  setProfileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors cursor-pointer ${
                  isDarkTheme ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                  <path d="M9 8l3 3 3-3M12 5v6" />
                </svg>
                <span className="flex flex-col">
                  <span className="text-sm font-medium">Pasang Pintasan</span>
                  <span className="text-[11px] text-slate-400">Cara cepat mengakses Alerin</span>
                </span>
              </button>

              <div className={`my-1 border-t ${isDarkTheme ? "border-slate-800" : "border-slate-100"}`} />

              <button
                type="button"
                onClick={() => {
                  showToast("Berhasil keluar dari akun.", "info");
                  setProfileMenuOpen(false);
                  navigate("/");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span className="text-sm font-medium">Keluar</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Mobile Drawer Sidebar (Persis Mobile Drawer di Alerin Chat) */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-[150]">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            style={{
              animation: "drawerBackdropFadeIn 0.38s cubic-bezier(0.32, 0.72, 0, 1) forwards",
              willChange: "opacity",
            }}
            onClick={() => setMobileDrawerOpen(false)}
          />
          <aside
            className={`fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] z-[160] shadow-2xl flex flex-col py-5 px-4 overflow-hidden ${
              isDarkTheme ? "bg-[#0f172a] border-r border-slate-800 text-white" : "bg-white text-slate-900"
            }`}
            style={{
              animation: "drawerSlideIn 0.38s cubic-bezier(0.32, 0.72, 0, 1) forwards",
              willChange: "transform",
            }}
          >
            {/* Drawer Header */}
            <div className="shrink-0 flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/73c1a.png"
                  alt="Alerin"
                  className="size-9 rounded-full object-cover shadow-xs border border-white"
                />
                <span className="font-bold leading-none font-sans text-lg text-slate-900">ALERIN</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    navigate("/");
                  }}
                  aria-label="Cari Obrolan"
                  title="Cari Obrolan"
                  className="size-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer text-slate-700 hover:bg-slate-100"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  aria-label="Tutup menu"
                  title="Tutup menu"
                  className="size-8 rounded-full border border-neutral-200/80 text-neutral-800 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Navigation Menu (Persis SIDEBAR_NAV_ITEMS di ClaroPage) */}
            <nav className="shrink-0 space-y-1 mb-6">
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  navigate("/");
                }}
                className="w-full flex items-center h-11 px-3.5 py-2.5 rounded-2xl gap-3 text-slate-600 hover:bg-slate-100 font-medium transition-colors text-left cursor-pointer [&>svg]:size-5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span className="text-base">Beranda</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  navigate("/?tab=fitur");
                }}
                className="w-full flex items-center h-11 px-3.5 py-2.5 rounded-2xl gap-3 text-slate-600 hover:bg-slate-100 font-medium transition-colors text-left cursor-pointer [&>svg]:size-5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                <span className="text-base">Semua Fitur</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  navigate("/?tab=proyek");
                }}
                className="w-full flex items-center h-11 px-3.5 py-2.5 rounded-2xl gap-3 text-slate-600 hover:bg-slate-100 font-medium transition-colors text-left cursor-pointer [&>svg]:size-5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="text-base">Proyek Saya</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  navigate("/");
                }}
                className="w-full flex items-center h-11 px-3.5 py-2.5 rounded-2xl gap-3 text-slate-600 hover:bg-slate-100 font-medium transition-colors text-left cursor-pointer [&>svg]:size-5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="text-base">Kalender</span>
              </button>
            </nav>

            {/* Disematkan & Riwayat Section (Persis ClaroPage) */}
            <div className="flex flex-col flex-1 min-h-0 pt-1">
              {pinnedHistoryItems.length > 0 && (
                <div className="shrink-0 mb-4">
                  <div className="font-semibold uppercase tracking-wider px-1 text-xs mb-2 text-zinc-500 bg-white">
                    Disematkan
                  </div>
                  <div className="space-y-1">
                    {pinnedHistoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="relative flex items-center justify-between rounded-xl px-2 py-1 transition-all hover:bg-slate-50 text-neutral-800"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            try { localStorage.setItem("alerin_active_history_id", item.id); } catch {}
                            setMobileDrawerOpen(false);
                            navigate("/");
                          }}
                          className="flex-1 text-left truncate transition-colors pr-2 flex items-center font-normal text-[15px] leading-relaxed gap-2 text-neutral-800 hover:text-blue-600"
                        >
                          <span title="Disematkan" className="inline-flex shrink-0 text-neutral-800">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="12" y1="17" x2="12" y2="22" />
                              <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.89A4 4 0 0 1 14 9V4h1a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2h1v5a4 4 0 0 1-2.11 3.56l-1.78.89A2 2 0 0 0 5 15.24Z" />
                            </svg>
                          </span>
                          <span className="truncate">{item.title}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileDrawerOpen(false);
                            navigate("/");
                          }}
                          aria-label={`Menu riwayat ${item.title}`}
                          className="size-7 rounded-lg flex items-center justify-center transition-colors shrink-0 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="19" cy="12" r="1.5" />
                            <circle cx="5" cy="12" r="1.5" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="shrink-0 mb-2">
                <div className="font-semibold uppercase tracking-wider px-1 text-xs text-zinc-500 bg-white">
                  Riwayat
                </div>
              </div>

              {/* Hanya daftar riwayat ini yang memiliki overflow-y-auto */}
              <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-1 space-y-1">
                {(expandedHistory ? unpinnedHistoryItems : unpinnedHistoryItems.slice(0, 7)).map((item) => (
                  <div
                    key={item.id}
                    className="relative flex items-center justify-between rounded-xl px-2 py-1 transition-all hover:bg-slate-50 text-neutral-800"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        try { localStorage.setItem("alerin_active_history_id", item.id); } catch {}
                        setMobileDrawerOpen(false);
                        navigate("/");
                      }}
                      className="flex-1 text-left truncate transition-colors pr-2 flex items-center font-normal text-[15px] leading-relaxed gap-2 text-neutral-800 hover:text-blue-600"
                    >
                      <span className="truncate">{item.title}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        navigate("/");
                      }}
                      aria-label={`Menu riwayat ${item.title}`}
                      className="size-7 rounded-lg flex items-center justify-center transition-colors shrink-0 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="19" cy="12" r="1.5" />
                        <circle cx="5" cy="12" r="1.5" />
                      </svg>
                    </button>
                  </div>
                ))}

                {unpinnedHistoryItems.length > 7 && (
                  <div className="pt-1.5 pb-1 px-1">
                    <button
                      type="button"
                      onClick={() => setExpandedHistory((prev) => !prev)}
                      className="flex items-center justify-between w-full text-left text-neutral-500 hover:text-blue-600 font-medium transition-colors cursor-pointer group px-1 text-[13px] py-1"
                    >
                      <span>{expandedHistory ? "Tampilkan lebih sedikit" : "Lihat selengkapnya"}</span>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`ml-auto text-neutral-400 group-hover:text-blue-600 transition-transform duration-200 ${
                          expandedHistory ? "rotate-180" : ""
                        }`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom + Obrolan button (Persis ClaroPage) */}
            <div className="shrink-0 pt-3">
              <button
                type="button"
                onClick={() => {
                  try { localStorage.removeItem("alerin_active_history_id"); } catch {}
                  setMobileDrawerOpen(false);
                  navigate("/");
                }}
                className="w-full bg-[#1A73E8] hover:bg-[#1557b0] active:scale-[0.98] text-white flex items-center justify-center font-semibold transition-all cursor-pointer h-11 px-5 py-2.5 rounded-full shadow-md shadow-[#1A73E8]/25 gap-2 text-sm"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Obrolan</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* DURATION SELECTOR SECTION */}
      <section className={`relative pt-6 sm:pt-8 bg-gradient-to-b from-white via-white to-[#F8FAFC] ${
        planType === "individual" ? "pb-4 sm:pb-6" : "pb-2 sm:pb-3"
      }`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Upgrade Paket Alerin
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto">
              {planType === "individual"
                ? "Akses semua fitur penelitian, skripsi, jurnal, dan perkuliahan dalam satu platform cerdas."
                : "Solusi lisensi terpusat, komputasi AI prioritas, dan kemitraan resmi untuk kampus & lembaga riset."}
            </p>
          </div>

          {/* PILIHAN INDIVIDU & BUSINESS */}
          <div className={`flex justify-center ${planType === "individual" ? "mb-4 sm:mb-5" : "mb-1 sm:mb-2"}`}>
            <div className="bg-slate-100 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-200/80 inline-flex shadow-inner max-w-full gap-1">
              <button
                type="button"
                onClick={() => {
                  setPlanType("individual");
                  setOpenDropdown(null);
                }}
                className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
                  planType === "individual"
                    ? "bg-[#1A73E8] text-white shadow-sm shadow-[#1A73E8]/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Individu</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPlanType("business");
                  setOpenDropdown(null);
                }}
                className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
                  planType === "business"
                    ? "bg-slate-900 text-white shadow-sm shadow-slate-900/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <span>Business</span>
              </button>
            </div>
          </div>

          {/* DURATION SELECTOR (Tabs/Pills with Dropdown Plus / Pro) */}
          {planType === "individual" && (
            <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
            <div
              className="bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 inline-flex shadow-inner max-w-full overflow-visible gap-1"
              role="tablist"
            >
              {/* Tab 1: 7 Hari */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown((prev) => (prev === "7d" ? null : "7d"))}
                  className={`duration-btn relative px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    currentDuration === "7d"
                      ? `font-bold bg-white ${currentTier === "pro" ? "text-slate-900" : "text-[#1A73E8]"} shadow-sm`
                      : "font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  <span>7 Hari</span>
                  {currentDuration === "7d" && (
                    <span
                      className={`text-[9.5px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                        currentTier === "pro"
                          ? "bg-slate-100 text-slate-900 border border-slate-300"
                          : "bg-blue-100 text-[#1A73E8]"
                      }`}
                    >
                      {currentTier === "pro" ? "Pro" : "Plus"}
                    </span>
                  )}
                  <svg
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      openDropdown === "7d" ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Dropdown for 7 Hari */}
                {openDropdown === "7d" && (
                  <div className="absolute top-full left-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2 z-50 text-left animate-[gemini-zoom-in_0.15s_ease-out]">
                    {/* Speech bubble pointer / arrow */}
                    <div
                      className="absolute -top-[5px] left-14 sm:left-1/2 sm:-translate-x-1/2 w-3 h-3 bg-white border-t border-l border-slate-200/90 rotate-45 rounded-tl-[1.5px] pointer-events-none z-10"
                      aria-hidden="true"
                    />

                    {/* Option: 7 Hari Plus */}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentDuration("7d");
                        setCurrentTier("plus");
                        setOpenDropdown(null);
                        showToast("Paket dipilih: 7 Hari Plus", "success");
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                        currentDuration === "7d" && currentTier === "plus"
                          ? "bg-blue-50/80 border border-blue-200 text-blue-900"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900">
                            7 Hari <span className="text-slate-900">Plus</span>
                          </p>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#1A73E8]">
                            Plus
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 mt-0.5">Akses fitur esensial</p>
                      </div>
                      {currentDuration === "7d" && currentTier === "plus" && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#1A73E8"
                          strokeWidth="2.5"
                          className="shrink-0 ml-2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>

                    {/* Option: 7 Hari Pro */}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentDuration("7d");
                        setCurrentTier("pro");
                        setOpenDropdown(null);
                        showToast("Paket dipilih: 7 Hari Pro", "success");
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer mt-1 ${
                        currentDuration === "7d" && currentTier === "pro"
                          ? "bg-slate-100/90 border border-slate-300 text-slate-900"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900">
                            7 Hari <span className="text-slate-900">Pro</span>
                          </p>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-300">
                            Pro
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 mt-0.5">Kuota & prioritas AI penuh</p>
                      </div>
                      {currentDuration === "7d" && currentTier === "pro" && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#0f172a"
                          strokeWidth="2.5"
                          className="shrink-0 ml-2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Tab 2: 30 Hari */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown((prev) => (prev === "30d" ? null : "30d"))}
                  className={`duration-btn relative px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    currentDuration === "30d"
                      ? `font-bold bg-white ${currentTier === "pro" ? "text-slate-900" : "text-[#1A73E8]"} shadow-sm`
                      : "font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  <span>30 Hari</span>
                  {currentDuration === "30d" && (
                    <span
                      className={`text-[9.5px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                        currentTier === "pro"
                          ? "bg-slate-100 text-slate-900 border border-slate-300"
                          : "bg-blue-100 text-[#1A73E8]"
                      }`}
                    >
                      {currentTier === "pro" ? "Pro" : "Plus"}
                    </span>
                  )}
                  <svg
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      openDropdown === "30d" ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Dropdown for 30 Hari */}
                {openDropdown === "30d" && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2 z-50 text-left animate-[gemini-zoom-in_0.15s_ease-out]">
                    {/* Speech bubble pointer / arrow */}
                    <div
                      className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-slate-200/90 rotate-45 rounded-tl-[1.5px] pointer-events-none z-10"
                      aria-hidden="true"
                    />

                    {/* Option: 30 Hari Plus */}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentDuration("30d");
                        setCurrentTier("plus");
                        setOpenDropdown(null);
                        showToast("Paket dipilih: 30 Hari Plus", "success");
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                        currentDuration === "30d" && currentTier === "plus"
                          ? "bg-blue-50/80 border border-blue-200 text-blue-900"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900">
                            30 Hari <span className="text-slate-900">Plus</span>
                          </p>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#1A73E8]">
                            Plus
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 mt-0.5">Pilihan bulanan esensial</p>
                      </div>
                      {currentDuration === "30d" && currentTier === "plus" && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#1A73E8"
                          strokeWidth="2.5"
                          className="shrink-0 ml-2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>

                    {/* Option: 30 Hari Pro */}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentDuration("30d");
                        setCurrentTier("pro");
                        setOpenDropdown(null);
                        showToast("Paket dipilih: 30 Hari Pro", "success");
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer mt-1 ${
                        currentDuration === "30d" && currentTier === "pro"
                          ? "bg-slate-100/90 border border-slate-300 text-slate-900"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900">
                            30 Hari <span className="text-slate-900">Pro</span>
                          </p>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-300">
                            Pro
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 mt-0.5">Kuota & prioritas AI penuh</p>
                      </div>
                      {currentDuration === "30d" && currentTier === "pro" && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#0f172a"
                          strokeWidth="2.5"
                          className="shrink-0 ml-2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Tab 3: 1 Tahun */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown((prev) => (prev === "1y" ? null : "1y"))}
                  className={`duration-btn relative px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    currentDuration === "1y"
                      ? `font-bold bg-white ${currentTier === "pro" ? "text-slate-900" : "text-[#1A73E8]"} shadow-sm`
                      : "font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  <span>1 Tahun</span>
                  {currentDuration === "1y" && (
                    <span
                      className={`text-[9.5px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                        currentTier === "pro"
                          ? "bg-slate-100 text-slate-900 border border-slate-300"
                          : "bg-blue-100 text-[#1A73E8]"
                      }`}
                    >
                      {currentTier === "pro" ? "Pro" : "Plus"}
                    </span>
                  )}
                  <svg
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      openDropdown === "1y" ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Dropdown for 1 Tahun */}
                {openDropdown === "1y" && (
                  <div className="absolute top-full right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2 z-50 text-left animate-[gemini-zoom-in_0.15s_ease-out]">
                    {/* Speech bubble pointer / arrow */}
                    <div
                      className="absolute -top-[5px] right-14 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-3 h-3 bg-white border-t border-l border-slate-200/90 rotate-45 rounded-tl-[1.5px] pointer-events-none z-10"
                      aria-hidden="true"
                    />

                    {/* Option: 1 Tahun Plus */}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentDuration("1y");
                        setCurrentTier("plus");
                        setOpenDropdown(null);
                        showToast("Paket dipilih: 1 Tahun Plus", "success");
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                        currentDuration === "1y" && currentTier === "plus"
                          ? "bg-blue-50/80 border border-blue-200 text-blue-900"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900">
                            1 Tahun <span className="text-slate-900">Plus</span>
                          </p>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#1A73E8]">
                            Plus
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 mt-0.5">Hemat tahunan esensial</p>
                      </div>
                      {currentDuration === "1y" && currentTier === "plus" && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#1A73E8"
                          strokeWidth="2.5"
                          className="shrink-0 ml-2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>

                    {/* Option: 1 Tahun Pro */}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentDuration("1y");
                        setCurrentTier("pro");
                        setOpenDropdown(null);
                        showToast("Paket dipilih: 1 Tahun Pro", "success");
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer mt-1 ${
                        currentDuration === "1y" && currentTier === "pro"
                          ? "bg-slate-100/90 border border-slate-300 text-slate-900"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900">
                            1 Tahun <span className="text-slate-900">Pro</span>
                          </p>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-300">
                            Pro
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 mt-0.5">Kuota & prioritas AI penuh</p>
                      </div>
                      {currentDuration === "1y" && currentTier === "pro" && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#0f172a"
                          strokeWidth="2.5"
                          className="shrink-0 ml-2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}
        </div>
      </section>

      {/* MAIN CONTENT: 2-COLUMN LAYOUT (INDIVIDU) */}
      {planType === "individual" && (
        <main id="configurator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 lg:pb-16 flex-1 w-full animate-[gemini-fade-in_0.2s_ease-out]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: FEATURE SELECTION & PROMO */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* BUNDLING PROMO BANNER */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 shadow-subtle transition-all">
              <div className="flex items-start gap-3.5">
                <div className="hidden sm:flex w-10 h-10 rounded-xl bg-[#1A73E8] text-white items-center justify-center shrink-0 shadow-sm">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {bundlingInfo.title}
                    </h3>
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${bundlingInfo.badgeClass}`}>
                      {bundlingInfo.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {bundlingInfo.desc}
                  </p>
                </div>
              </div>
              <div className="hidden sm:block text-right shrink-0">
                <span className="text-xs text-slate-500 block">Status Hemat:</span>
                <span className="text-sm font-extrabold text-brand-600">
                  {formatRupiah(bundlingDiscount)}
                </span>
              </div>
            </div>

            {/* SECTION TITLE: FEATURE PICKER */}
            <div className="pt-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Pilih Fitur yang Diinginkan
                </h2>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/80 inline-flex items-center gap-1 shadow-2xs">
                  <span>Terpilih:</span>
                  <strong className="text-[#1A73E8] font-bold">{selectedFeatures.size}</strong>
                  <span className="text-slate-400">/4</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Pilih minimal 1 fitur atau kombinasikan beberapa fitur sesuai kebutuhan akademik Anda.
              </p>
            </div>

            {/* 4 FEATURE CARDS: 2-COLUMN GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {FEATURE_KEYS.map((key) => {
                const item = PRICING_DATABASE[key];
                if (!item) return null;
                const isSelected = selectedFeatures.has(key);
                const price = getPrice(key);

                return (
                  <div
                    key={key}
                    onClick={() => toggleFeature(key)}
                    className={`feature-card cursor-pointer group relative bg-white rounded-2xl p-4 sm:p-5 transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-2 border-[#1A73E8] ring-2 ring-[#1A73E8]/10 shadow-card bg-blue-50/10"
                        : "border-2 border-slate-300 shadow-subtle hover:border-slate-400 hover:shadow-md"
                    }`}
                  >
                    <div>
                      {/* Top row: Checkbox + Title on left; Price on right */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Tombol centang di depan */}
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 ${
                              isSelected
                                ? "bg-[#1A73E8] text-white border-2 border-[#1A73E8] shadow-xs"
                                : "border-2 border-slate-300 bg-white group-hover:border-slate-400"
                            }`}
                          >
                            {isSelected && (
                              <svg
                                className="w-3.5 h-3.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#1A73E8] transition-colors tracking-tight truncate">
                              {item.name}
                            </h3>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {currentDuration === "1y" && (
                            <span className="text-[11px] text-slate-400 line-through mr-1 block">
                              {formatRupiah(item.original_yearly)}
                            </span>
                          )}
                          <div className="flex items-baseline justify-end whitespace-nowrap">
                            <span className="text-sm sm:text-base font-extrabold text-slate-900 whitespace-nowrap">
                              {formatRupiah(price)}
                            </span>
                            <span className="text-xs sm:text-sm text-slate-500 font-normal whitespace-nowrap">
                              {durationLabel}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-slate-200 flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5 text-[10px] font-medium text-slate-500">
                        {item.badges.map((b) => (
                          <span
                            key={b}
                            className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80"
                          >
                            {b}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalFeatureKey(key);
                        }}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#1A73E8] hover:bg-[#1557b0] px-3 py-1.5 rounded-lg shadow-sm shadow-[#1A73E8]/20 transition-all shrink-0 active:scale-95 cursor-pointer"
                      >
                        <span>Detail Paket</span>
                        <svg
                          className="w-3 h-3 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* VOUCHER CODE BOX */}
            <div className="bg-white border border-slate-300 rounded-2xl p-4 sm:p-5 shadow-subtle">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Punya Kode Promo/Voucher?
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleApplyVoucher();
                    }}
                    placeholder="Masukkan kode (contoh: ALLERIHEMAT)"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold uppercase tracking-wider text-slate-800 placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all"
                  />
                  <svg
                    className="w-4 h-4 text-slate-400 absolute left-3 top-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2.586 16.726A2 2 0 0 1 2 15.312V9c0-.55.45-1 1-1h1.5a1.5 1.5 0 0 0 0-3H3c-.55 0-1-.45-1-1V3a1 1 0 0 1 1-1h6.312a2 2 0 0 1 1.414.586l10.688 10.688a2 2 0 0 1 0 2.828l-6.312 6.312a2 2 0 0 1-2.828 0L2.586 16.726Z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={handleApplyVoucher}
                  className="px-5 py-2.5 bg-[#1A73E8] hover:bg-[#1557b0] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm shadow-[#1A73E8]/20 active:scale-95 shrink-0 cursor-pointer"
                >
                  Terapkan
                </button>
              </div>

              {/* Applied Voucher Notification */}
              {appliedVoucher && (
                <div className="mt-2 text-xs flex items-center justify-between">
                  <span className="text-[#1A73E8] font-bold flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Kupon {appliedVoucher.code} berhasil dipasang (Hemat {formatRupiah(voucherDiscount)})
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveVoucher}
                    className="text-xs text-red-500 hover:underline cursor-pointer font-medium"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-card space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Ringkasan Paket</h3>
                  <p className="text-xs text-slate-500">Pastikan sudah sesuai.</p>
                </div>
                <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                  {getDurationReadable(currentDuration, currentTier)}
                </span>
              </div>

              {/* Feature items list */}
              <div className="space-y-2.5 text-xs">
                <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                  Fitur yang diaktifkan:
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {Array.from(selectedFeatures).map((key) => {
                    const item = PRICING_DATABASE[key];
                    if (!item) return null;
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between text-slate-700 font-medium py-1"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <svg
                            className="w-3.5 h-3.5 text-brand-600 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className="truncate max-w-[170px] sm:max-w-[200px] text-xs">
                            {item.name}
                          </span>
                        </div>
                        <span className="font-semibold text-slate-900 text-xs shrink-0">
                          {formatRupiah(getPrice(key))}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="pt-4 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span>Subtotal Harga Normal</span>
                  <span className="font-semibold text-slate-800">{formatRupiah(subtotal)}</span>
                </div>

                {/* Bundling Discount Line */}
                {bundlingDiscount > 0 && (
                  <div className="flex justify-between items-center text-brand-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span>Diskon Bundling</span>
                      <span className="text-[10px] bg-brand-100 text-brand-700 px-1.5 py-0.2 rounded font-bold">
                        {bundlingLabel}
                      </span>
                    </div>
                    <span>-{formatRupiah(bundlingDiscount)}</span>
                  </div>
                )}

                {/* Duration 1 Year Savings Line */}
                {currentDuration === "1y" && annualSavings > 0 && (
                  <div className="flex justify-between items-center text-brand-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span>Diskon Langganan Tahunan</span>
                      <span className="text-[10px] bg-brand-100 text-brand-700 px-1.5 py-0.2 rounded font-bold">
                        Hemat 20%
                      </span>
                    </div>
                    <span>-{formatRupiah(annualSavings)}</span>
                  </div>
                )}

                {/* Voucher Discount Line */}
                {appliedVoucher && voucherDiscount > 0 && (
                  <div className="flex justify-between items-center text-brand-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span>Potongan Voucher ({appliedVoucher.code})</span>
                      <button
                        type="button"
                        onClick={handleRemoveVoucher}
                        className="text-slate-400 hover:text-red-500 text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    <span>-{formatRupiah(voucherDiscount)}</span>
                  </div>
                )}

                {/* Tax / Admin Fee (Gratis) */}
                <div className="flex justify-between items-center text-slate-500">
                  <span>Biaya Penanganan Sistem</span>
                  <span className="text-brand-600 font-semibold uppercase text-[10px] bg-brand-50 px-1.5 py-0.5 rounded">
                    Gratis
                  </span>
                </div>
              </div>

              {/* Total Due */}
              <div className="pt-4 border-t-2 border-dashed border-slate-300">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base sm:text-lg font-bold text-slate-900 block">Total Biaya</span>
                  </div>
                  <div className="text-right">
                    {(bundlingDiscount > 0 || voucherDiscount > 0 || currentDuration === "1y") && (
                      <span className="text-xs text-slate-400 line-through block">
                        {formatRupiah(currentDuration === "1y" ? originalTotal : subtotal)}
                      </span>
                    )}
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#1A73E8] tracking-tight">
                      {formatRupiah(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout CTA Button */}
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full py-4 px-6 bg-[#1A73E8] hover:bg-[#1557b0] text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#1A73E8]/25 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] cursor-pointer"
              >
                <span>Lanjut ke Pembayaran</span>
                <svg
                  className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
      )}

      {/* MOBILE FLOATING BOTTOM BAR (MELAYANG & AGAK KOTAK / ROUNDED-2XL) - HANYA INDIVIDU */}
      {planType === "individual" && (
        <div className="lg:hidden fixed bottom-3.5 inset-x-3.5 sm:bottom-5 sm:inset-x-4 max-w-md mx-auto z-40 bg-white/95 backdrop-blur-md border border-slate-300 rounded-2xl px-4.5 py-3 shadow-[0_12px_32px_rgba(15,23,42,0.16),0_4px_12px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-700">
                  {getDurationReadable(currentDuration, currentTier)}
                </span>
                <span className="text-[10px] font-bold text-[#1A73E8] bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200">
                  {selectedFeatures.size} Fitur
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg font-extrabold text-slate-900 leading-tight">
                  {formatRupiah(grandTotal)}
                </span>
                {(bundlingDiscount > 0 || voucherDiscount > 0) && (
                  <span className="text-xs text-slate-400 line-through">{formatRupiah(subtotal)}</span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCheckoutModalOpen(true)}
              className="px-5 py-3 bg-[#1A73E8] hover:bg-[#1557b0] text-white font-bold text-xs rounded-xl shadow-md shadow-[#1A73E8]/25 transition-all shrink-0 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span>Lanjut Bayar</span>
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* BUSINESS / INSTITUTION VIEW (Mengisi Form Pengajuan Institusi) */}
      {planType === "business" && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 sm:pt-2 pb-24 flex-1 w-full animate-[gemini-fade-in_0.2s_ease-out]">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-blue-50/30">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Pengajuan Kemitraan & Paket Business
              </h3>
              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                Lengkapi formulir khusus calon mitra di bawah ini. Data akan otomatis dikirimkan ke <strong className="text-slate-700 font-semibold">admin@alerin.id</strong>.
              </p>
            </div>

            <form onSubmit={handleBizSubmit} className="p-6 sm:p-9 space-y-6 sm:space-y-7">
              {/* Nama */}
              <div>
                <label className="block text-sm sm:text-[15px] font-bold text-slate-800 mb-2">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  value={bizForm.name}
                  onChange={(e) => {
                    setBizForm({ ...bizForm, name: e.target.value });
                    if (bizErrors.name) setBizErrors({ ...bizErrors, name: false });
                  }}
                  className={`w-full px-4.5 py-3.5 sm:py-4 text-sm sm:text-base rounded-2xl border transition-all placeholder:text-slate-400 ${
                    bizErrors.name
                      ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  }`}
                />
                {bizErrors.name && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">Nama wajib diisi</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm sm:text-[15px] font-bold text-slate-800 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="nama@instansi.ac.id atau nama@email.com"
                  value={bizForm.email}
                  onChange={(e) => {
                    setBizForm({ ...bizForm, email: e.target.value });
                    if (bizErrors.email) setBizErrors({ ...bizErrors, email: false });
                  }}
                  className={`w-full px-4.5 py-3.5 sm:py-4 text-sm sm:text-base rounded-2xl border transition-all placeholder:text-slate-400 ${
                    bizErrors.email
                      ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  }`}
                />
                {bizErrors.email && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">Email valid wajib diisi</p>
                )}
              </div>

              {/* Instansi */}
              <div>
                <label className="block text-sm sm:text-[15px] font-bold text-slate-800 mb-2">
                  Instansi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama universitas, fakultas, sekolah, atau instansi"
                  value={bizForm.institution}
                  onChange={(e) => {
                    setBizForm({ ...bizForm, institution: e.target.value });
                    if (bizErrors.institution) setBizErrors({ ...bizErrors, institution: false });
                  }}
                  className={`w-full px-4.5 py-3.5 sm:py-4 text-sm sm:text-base rounded-2xl border transition-all placeholder:text-slate-400 ${
                    bizErrors.institution
                      ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  }`}
                />
                {bizErrors.institution && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">Instansi wajib diisi</p>
                )}
              </div>

              {/* Tujuan Penggunaan Alerin */}
              <div>
                <label className="block text-sm sm:text-[15px] font-bold text-slate-800 mb-2">
                  Tujuan Penggunaan Alerin <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Jelaskan kebutuhan atau tujuan penggunaan Alerin di instansi Anda..."
                  value={bizForm.purpose}
                  onChange={(e) => {
                    setBizForm({ ...bizForm, purpose: e.target.value });
                    if (bizErrors.purpose) setBizErrors({ ...bizErrors, purpose: false });
                  }}
                  className={`w-full px-4.5 py-3.5 sm:py-4 text-sm sm:text-base rounded-2xl border transition-all resize-y placeholder:text-slate-400 ${
                    bizErrors.purpose
                      ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  }`}
                />
                {bizErrors.purpose && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">Tujuan penggunaan Alerin wajib diisi</p>
                )}
              </div>

              {/* Pilihan Fitur yang Ingin Digunakan */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
                  <label className="block text-sm sm:text-[15px] font-bold text-slate-800">
                    Pilihan Fitur yang Ingin Digunakan <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-slate-400">Pilih fitur yang dibutuhkan</span>
                </div>

                {/* List fitur: kebawah pada mobile (grid-cols-1) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
                  {[
                    {
                      key: "Alerin Chat",
                      label: "Alerin Chat",
                      desc: "AI asisten untuk riset akademik dan diskusi topik.",
                    },
                    {
                      key: "Alerin Jurnal",
                      label: "Alerin Jurnal",
                      desc: "Temukan referensi akademik terindeks Scopus & Sinta.",
                    },
                    {
                      key: "Alerin Skripsi",
                      label: "Alerin Skripsi",
                      desc: "Dapatkan arahan sesuai tahap penelitian dan revisi kamu.",
                    },
                    {
                      key: "Alerin Parafrase",
                      label: "Alerin Parafrase",
                      desc: "Ubah teks skripsi otomatis dengan pilihan gaya & intensitas.",
                    },
                  ].map((feature) => {
                    const isChecked = bizForm.features.includes(feature.key);
                    return (
                      <label
                        key={feature.key}
                        onClick={() => toggleBizFeature(feature.key)}
                        className={`flex items-center justify-between gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                          isChecked
                            ? "bg-blue-50/90 border-[#1A73E8] text-blue-900 shadow-sm ring-1 ring-[#1A73E8]/30"
                            : "bg-white border-slate-200/90 hover:border-slate-300 text-slate-700 hover:bg-slate-50/60 shadow-2xs"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-bold text-slate-900 block">{feature.label}</span>
                          <span className="text-xs text-slate-500 block mt-0.5 leading-relaxed">{feature.desc}</span>
                        </div>

                        {/* Tombol centang di samping kanan */}
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 ${
                            isChecked
                              ? "bg-[#1A73E8] text-white border-2 border-[#1A73E8] shadow-xs"
                              : "border-2 border-slate-300 bg-white group-hover:border-slate-400"
                          }`}
                        >
                          {isChecked && (
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
                {bizErrors.features && (
                  <p className="text-xs text-red-500 mt-2 font-medium">Pilih minimal 1 fitur yang ingin digunakan</p>
                )}
              </div>

              {/* Info Pengiriman ke admin@alerin.id */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#1A73E8] flex items-center justify-center shrink-0">
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Data formulir yang diisi akan otomatis dikirim ke email <strong className="text-slate-800 font-semibold">admin@alerin.id</strong>. Tim Alerin akan menghubungi Anda kembali maksimal dalam 3x24 jam.
                </p>
              </div>

              {/* Submit Action */}
              <div className="pt-3 flex items-center justify-end border-t border-slate-200">
                <button
                  type="submit"
                  disabled={bizSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-2xl bg-[#1A73E8] hover:bg-[#1557b0] active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md shadow-[#1A73E8]/25 cursor-pointer disabled:opacity-75"
                >
                  {bizSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Mengirim ke admin@alerin.id...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Formulir Pengajuan</span>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* POP-UP KONFIRMASI PENGIRIMAN FORMULIR BUSINESS */}
          {bizConfirmModalOpen && (
            <div
              className="fixed inset-0 z-50 overflow-hidden overscroll-none bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-[gemini-fade-in_0.2s_ease-out]"
              onClick={() => setBizConfirmModalOpen(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border border-slate-200 animate-[gemini-zoom-in_0.15s_ease-out]"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center mb-4 select-none">
                  <img
                    src="/assets/icon-success-check-3d.png"
                    alt="Berhasil Terkirim"
                    className="w-full h-full object-contain drop-shadow-sm pointer-events-none"
                  />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  Berhasil mengirim. Mohon ditunggu maksimal 3x24 jam
                </h3>

                <p className="text-xs sm:text-[13px] text-slate-600 mt-2.5 leading-relaxed">
                  Data formulir Anda telah otomatis dikirim ke email{" "}
                  <strong className="text-slate-900 font-semibold">admin@alerin.id</strong>. Tim Alerin akan segera meninjau dan menghubungi Anda kembali.
                </p>

                <button
                  type="button"
                  onClick={() => setBizConfirmModalOpen(false)}
                  className="w-full mt-6 py-3.5 px-5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* STEP 2: CHECKOUT & PAYMENT (Full Page di Mobile, Pop-up Modal di Desktop) */}
      {isCheckoutModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden overscroll-none bg-[#F8FAFC] md:bg-slate-900/60 md:backdrop-blur-sm p-0 md:p-6 lg:p-8 flex flex-col md:items-center md:justify-center animate-[gemini-fade-in_0.18s_ease-out]"
          onClick={() => {
            setIsQrisModalOpen(false);
            setIsCheckoutModalOpen(false);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-3xl bg-[#F8FAFC] md:bg-white rounded-none md:rounded-3xl flex flex-col shadow-none md:shadow-2xl border-0 md:border md:border-slate-200 overflow-hidden transform transition-all md:animate-[gemini-zoom-in_0.15s_ease-out]"
          >
            {/* Header (Sticky Top Bar di Mobile, Modal Header di Desktop) */}
            <div className="px-4 md:px-6 pt-[max(0.875rem,env(safe-area-inset-top))] md:pt-4 pb-3.5 md:pb-4 border-b border-slate-200/80 md:border-slate-100 flex items-center justify-between bg-white md:bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    if (isQrisModalOpen) {
                      setIsQrisModalOpen(false);
                      return;
                    }
                    setIsCheckoutModalOpen(false);
                  }}
                  className="w-9 h-9 md:w-8 md:h-8 rounded-full md:rounded-xl bg-slate-100/80 md:bg-transparent border border-slate-200/70 md:border-transparent hover:bg-slate-200/70 text-slate-700 md:text-slate-600 flex items-center justify-center transition-colors shrink-0 cursor-pointer active:scale-95"
                  aria-label="Kembali"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight">
                      Pembayaran
                    </h3>
                    <span className="text-[10px] font-bold bg-blue-50 text-[#1A73E8] px-2 py-0.5 rounded-full border border-blue-200 shrink-0">
                      2 dari 2
                    </span>
                  </div>
                  <p className="text-[11px] md:text-xs text-slate-500 truncate md:whitespace-normal">
                    Konfirmasi detail pesanan dan pilih opsi pembayaran Anda
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsQrisModalOpen(false);
                  setIsCheckoutModalOpen(false);
                }}
                className="hidden md:flex w-8 h-8 rounded-full bg-slate-200/70 text-slate-500 hover:text-slate-800 hover:bg-slate-200 items-center justify-center transition-colors shrink-0 ml-2 cursor-pointer"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            {/* Body (Halaman Scrollable di Mobile, 2-Kolom Modal di Desktop) */}
            <div
              ref={checkoutScrollRef}
              className={`px-4 pt-4 ${isQrisModalOpen ? "pb-10" : "pb-28"} md:p-6 overflow-y-auto overscroll-contain flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 content-start`}
            >
              {/* Left Sub-column: Ringkasan Pesanan */}
              <div className="md:col-span-6">
                {isQrisModalOpen && isQrisLoading ? (
                  /* Skeleton Shimmer: Ringkasan Pesanan (Mobile) */
                  <div className="md:hidden bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden">
                    <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3">
                      <div className="h-4 w-36 rounded-md bg-slate-200/80 shimmer-sweep" />
                      <div className="h-6 w-24 rounded-full bg-slate-200/70 shimmer-sweep" />
                    </div>
                    <div className="px-4 py-3.5 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="h-3.5 w-28 rounded-md bg-slate-200/75 shimmer-sweep" />
                        <div className="h-3.5 w-16 rounded-md bg-slate-200/80 shimmer-sweep" />
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="h-3.5 w-32 rounded-md bg-slate-200/75 shimmer-sweep" />
                        <div className="h-3.5 w-16 rounded-md bg-slate-200/80 shimmer-sweep" />
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-16 rounded-md bg-slate-200/70 shimmer-sweep" />
                        <div className="h-3 w-16 rounded-md bg-slate-200/75 shimmer-sweep" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-24 rounded-md bg-slate-200/70 shimmer-sweep" />
                        <div className="h-3 w-16 rounded-md bg-slate-200/75 shimmer-sweep" />
                      </div>
                    </div>
                    <div className="px-4 py-3.5 border-t border-slate-200/70 bg-white flex items-center justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-20 rounded-md bg-slate-200/80 shimmer-sweep" />
                        <div className="h-2.5 w-24 rounded-md bg-slate-200/65 shimmer-sweep" />
                      </div>
                      <div className="h-6 w-24 rounded-md bg-slate-200/85 shimmer-sweep" />
                    </div>
                  </div>
                ) : null}

                <div
                  className={`${
                    isQrisModalOpen && isQrisLoading ? "hidden md:block" : "block"
                  } bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden ${
                    isQrisModalOpen ? "animate-[gemini-fade-in_0.25s_ease-out]" : ""
                  }`}
                >
                  {/* Header Card */}
                  <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3">
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                      Ringkasan Pesanan
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
                      {getDurationReadable(currentDuration, currentTier)}
                    </span>
                  </div>

                  {/* Daftar Fitur */}
                  <div className="px-4 py-3.5 space-y-2.5 max-h-44 overflow-y-auto">
                    {Array.from(selectedFeatures).map((key) => {
                      const item = PRICING_DATABASE[key];
                      if (!item) return null;
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="text-[13px] font-medium text-slate-700 truncate">
                            {item.name}
                          </span>
                          <span className="text-[13px] font-semibold text-slate-900 tabular-nums shrink-0">
                            {formatRupiah(getPrice(key))}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Rincian Subtotal & Diskon */}
                  <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-medium text-slate-700 tabular-nums">
                        {formatRupiah(subtotal)}
                      </span>
                    </div>
                    {bundlingDiscount > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Diskon Bundling</span>
                        <span className="font-semibold text-emerald-600 tabular-nums">
                          -{formatRupiah(bundlingDiscount)}
                        </span>
                      </div>
                    )}
                    {appliedVoucher && voucherDiscount > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Voucher ({appliedVoucher.code})</span>
                        <span className="font-semibold text-emerald-600 tabular-nums">
                          -{formatRupiah(voucherDiscount)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Total Biaya */}
                  <div className="px-4 py-3.5 border-t border-slate-200/70 bg-white flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[13px] font-bold text-slate-900 block">
                        Total Biaya
                      </span>
                      {bundlingDiscount + voucherDiscount > 0 && (
                        <span className="text-[11px] font-medium text-emerald-600 block mt-0.5">
                          Hemat {formatRupiah(bundlingDiscount + voucherDiscount)}
                        </span>
                      )}
                    </div>
                    <span className="text-[19px] font-extrabold text-slate-950 tracking-tight tabular-nums">
                      {formatRupiah(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Sub-column: Metode Pembayaran */}
              <div className="md:col-span-6 space-y-3.5 sm:space-y-4">
                {/* Mobile View: QRIS Payment (Skeleton -> Timer + QRIS Card) ATAU Metode Pembayaran List */}
                {isQrisModalOpen ? (
                  isQrisLoading ? (
                    <div className="md:hidden space-y-3.5">
                      {/* Skeleton Shimmer: Countdown Timer Card */}
                      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-slate-200/85 shimmer-sweep shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3.5 w-11/12 rounded-md bg-slate-200/85 shimmer-sweep" />
                            <div className="h-2.5 w-3/5 rounded-md bg-slate-200/70 shimmer-sweep" />
                          </div>
                        </div>
                        <div className="border-t border-slate-100 my-3" />
                        <div className="grid grid-cols-3 gap-2.5">
                          <div className="h-9 rounded-lg bg-slate-200/80 shimmer-sweep" />
                          <div className="h-9 rounded-lg bg-slate-200/80 shimmer-sweep" />
                          <div className="h-9 rounded-lg bg-slate-200/80 shimmer-sweep" />
                        </div>
                      </div>

                      {/* Skeleton Shimmer: Payment Detail Card (BCA VA atau QRIS) */}
                      {mobilePaymentType === "va_bca" ? (
                        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
                          {/* Logo BCA shape */}
                          <div className="h-8 w-28 rounded-lg bg-slate-200/85 shimmer-sweep" />
                          {/* Description lines */}
                          <div className="mt-4 space-y-2">
                            <div className="h-3 w-full rounded-md bg-slate-200/75 shimmer-sweep" />
                            <div className="h-3 w-11/12 rounded-md bg-slate-200/75 shimmer-sweep" />
                            <div className="h-3 w-4/5 rounded-md bg-slate-200/70 shimmer-sweep" />
                          </div>
                          {/* Virtual Account title & number box */}
                          <div className="mt-5 space-y-2.5">
                            <div className="h-4 w-32 rounded-md bg-slate-200/85 shimmer-sweep" />
                            <div className="h-12 w-full rounded-xl bg-slate-200/75 shimmer-sweep" />
                          </div>
                          {/* Petunjuk Penggunaan + Accordion shapes */}
                          <div className="mt-5 space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="size-5 rounded-full bg-slate-200/85 shimmer-sweep shrink-0" />
                              <div className="h-4 w-40 rounded-md bg-slate-200/80 shimmer-sweep" />
                            </div>
                            <div className="h-5 w-24 rounded-md bg-slate-200/80 shimmer-sweep" />
                            <div className="p-4 rounded-xl bg-slate-100/90 space-y-2.5">
                              <div className="h-3 w-11/12 rounded-md bg-slate-200/80 shimmer-sweep" />
                              <div className="h-3 w-full rounded-md bg-slate-200/80 shimmer-sweep" />
                              <div className="h-3 w-5/6 rounded-md bg-slate-200/80 shimmer-sweep" />
                              <div className="h-3 w-4/5 rounded-md bg-slate-200/80 shimmer-sweep" />
                              <div className="h-3 w-2/3 rounded-md bg-slate-200/80 shimmer-sweep" />
                            </div>
                            <div className="h-10 w-full rounded-lg bg-slate-200/65 shimmer-sweep" />
                            <div className="h-10 w-full rounded-lg bg-slate-200/65 shimmer-sweep" />
                          </div>
                          {/* Batalkan Button shape */}
                          <div className="mt-5 h-12 w-full rounded-2xl bg-slate-200/85 shimmer-sweep" />
                        </div>
                      ) : mobilePaymentType === "gopay" || mobilePaymentType === "akulaku" || mobilePaymentType === "shopeepay" ? (
                        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
                          {/* Logos shape */}
                          <div className="flex items-center gap-3">
                            <div className="h-7 w-20 rounded-lg bg-slate-200/85 shimmer-sweep" />
                            <div className="h-7 w-28 rounded-lg bg-slate-200/85 shimmer-sweep" />
                          </div>
                          {/* Description lines */}
                          <div className="mt-4 space-y-2">
                            <div className="h-3 w-full rounded-md bg-slate-200/75 shimmer-sweep" />
                            <div className="h-3 w-11/12 rounded-md bg-slate-200/75 shimmer-sweep" />
                            <div className="h-3 w-4/5 rounded-md bg-slate-200/70 shimmer-sweep" />
                          </div>
                          {/* Petunjuk Penggunaan shape */}
                          <div className="mt-5 space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="size-5 rounded-full bg-slate-200/85 shimmer-sweep shrink-0" />
                              <div className="h-4 w-40 rounded-md bg-slate-200/80 shimmer-sweep" />
                            </div>
                            <div className="p-4 rounded-xl bg-slate-100/90 space-y-2.5">
                              <div className="h-3 w-11/12 rounded-md bg-slate-200/80 shimmer-sweep" />
                              <div className="h-3 w-4/5 rounded-md bg-slate-200/80 shimmer-sweep" />
                              <div className="h-3 w-full rounded-md bg-slate-200/80 shimmer-sweep" />
                              <div className="h-3 w-5/6 rounded-md bg-slate-200/80 shimmer-sweep" />
                              <div className="h-3 w-3/4 rounded-md bg-slate-200/80 shimmer-sweep" />
                              <div className="h-3 w-11/12 rounded-md bg-slate-200/80 shimmer-sweep" />
                            </div>
                          </div>
                          {/* Action buttons shape */}
                          <div className="mt-5 h-12 w-full rounded-2xl bg-slate-200/85 shimmer-sweep" />
                          <div className="mt-3 h-12 w-full rounded-2xl bg-slate-200/80 shimmer-sweep" />
                        </div>
                      ) : mobilePaymentType === "card" ? (
                        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
                          {/* Back + Title */}
                          <div className="flex items-center gap-2.5">
                            <div className="size-6 rounded-md bg-slate-200/80 shimmer-sweep" />
                            <div className="h-5 w-36 rounded-md bg-slate-200/85 shimmer-sweep" />
                          </div>
                          {/* 5 Card Logos */}
                          <div className="mt-4 flex items-center gap-2.5">
                            <div className="h-5 w-12 rounded bg-slate-200/85 shimmer-sweep" />
                            <div className="h-5 w-8 rounded bg-slate-200/85 shimmer-sweep" />
                            <div className="h-5 w-8 rounded bg-slate-200/80 shimmer-sweep" />
                            <div className="h-5 w-7 rounded bg-slate-200/80 shimmer-sweep" />
                            <div className="h-5 w-9 rounded bg-slate-200/80 shimmer-sweep" />
                          </div>
                          {/* Description lines */}
                          <div className="mt-4 space-y-2">
                            <div className="h-3 w-full rounded-md bg-slate-200/75 shimmer-sweep" />
                            <div className="h-3 w-11/12 rounded-md bg-slate-200/75 shimmer-sweep" />
                            <div className="h-3 w-2/3 rounded-md bg-slate-200/70 shimmer-sweep" />
                          </div>
                          {/* 3 Input fields */}
                          <div className="mt-5 space-y-4">
                            <div className="space-y-2">
                              <div className="h-3.5 w-24 rounded bg-slate-200/85 shimmer-sweep" />
                              <div className="h-12 w-full rounded-xl bg-slate-200/75 shimmer-sweep" />
                            </div>
                            <div className="space-y-2">
                              <div className="h-3.5 w-28 rounded bg-slate-200/85 shimmer-sweep" />
                              <div className="h-12 w-full rounded-xl bg-slate-200/75 shimmer-sweep" />
                            </div>
                            <div className="space-y-2">
                              <div className="h-3.5 w-12 rounded bg-slate-200/85 shimmer-sweep" />
                              <div className="h-12 w-full rounded-xl bg-slate-200/75 shimmer-sweep" />
                            </div>
                          </div>
                          {/* Petunjuk Penggunaan */}
                          <div className="mt-5 space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="size-5 rounded-full bg-slate-200/85 shimmer-sweep shrink-0" />
                              <div className="h-4 w-40 rounded-md bg-slate-200/80 shimmer-sweep" />
                            </div>
                            <div className="p-4 rounded-xl bg-slate-100/90 space-y-2.5">
                              <div className="h-3 w-11/12 rounded-md bg-slate-200/80 shimmer-sweep" />
                              <div className="h-3 w-full rounded-md bg-slate-200/80 shimmer-sweep" />
                              <div className="h-3 w-4/5 rounded-md bg-slate-200/80 shimmer-sweep" />
                              <div className="h-3 w-5/6 rounded-md bg-slate-200/80 shimmer-sweep" />
                            </div>
                          </div>
                          {/* Bayar Sekarang button */}
                          <div className="mt-5 h-12 w-full rounded-2xl bg-slate-200/85 shimmer-sweep" />
                        </div>
                      ) : (
                        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
                          {/* Logo shape */}
                          <div className="h-7 w-24 rounded-lg bg-slate-200/85 shimmer-sweep" />

                          {/* Description lines */}
                          <div className="mt-4 space-y-2">
                            <div className="h-3 w-full rounded-md bg-slate-200/75 shimmer-sweep" />
                            <div className="h-3 w-11/12 rounded-md bg-slate-200/75 shimmer-sweep" />
                            <div className="h-3 w-4/5 rounded-md bg-slate-200/70 shimmer-sweep" />
                          </div>

                          {/* QR Code Square shape */}
                          <div className="my-6 flex justify-center">
                            <div className="w-[220px] h-[220px] rounded-2xl bg-slate-200/80 shimmer-sweep" />
                          </div>

                          {/* Download QR Button shape */}
                          <div className="h-12 w-full rounded-2xl bg-slate-200/85 shimmer-sweep" />

                          {/* Petunjuk Penggunaan shape */}
                          <div className="mt-5 space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="size-5 rounded-full bg-slate-200/85 shimmer-sweep shrink-0" />
                              <div className="h-4 w-40 rounded-md bg-slate-200/80 shimmer-sweep" />
                            </div>
                            <div className="p-4 rounded-xl bg-slate-100/90 space-y-2.5">
                              <div className="h-3 w-11/12 rounded-md bg-slate-200/80 shimmer-sweep" />
                              <div className="h-3 w-4/5 rounded-md bg-slate-200/80 shimmer-sweep" />
                              <div className="h-3 w-full rounded-md bg-slate-200/80 shimmer-sweep" />
                              <div className="h-3 w-5/6 rounded-md bg-slate-200/80 shimmer-sweep" />
                              <div className="h-3 w-2/3 rounded-md bg-slate-200/80 shimmer-sweep" />
                            </div>
                          </div>

                          {/* Batalkan Button shape */}
                          <div className="mt-5 h-12 w-full rounded-2xl bg-slate-200/85 shimmer-sweep" />
                        </div>
                      )}
                    </div>
                  ) : (
                  <div className="md:hidden space-y-3.5 animate-[gemini-fade-in_0.25s_ease-out]">
                    {/* Blue Countdown Timer Card */}
                    <div className="bg-[#3E76BE] rounded-2xl p-4 text-white shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-white text-[#3E76BE] flex items-center justify-center shrink-0 shadow-2xs">
                          <svg
                            className="w-6 h-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <polyline points="12 7 12 12 15.5 14" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12.5px] font-bold leading-snug text-white">
                            Bayar sebelum waktu habis dan simpan bukti sebagai konfirmasi.
                          </p>
                          <p className="text-[10.5px] text-white/75 mt-0.5 leading-tight">
                            *Voucher hangus jika terlambat bayar
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-dashed border-white/30 my-3" />

                      <div className="grid grid-cols-3 gap-2.5">
                        <div className="bg-white rounded-lg py-2 px-2 flex items-baseline justify-center gap-1 shadow-2xs">
                          <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                            {qrisHours}
                          </span>
                          <span className="text-xs font-bold text-[#C26B27]">Jam</span>
                        </div>
                        <div className="bg-white rounded-lg py-2 px-2 flex items-baseline justify-center gap-1 shadow-2xs">
                          <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                            {String(qrisMinutes).padStart(2, "0")}
                          </span>
                          <span className="text-xs font-bold text-[#C26B27]">Menit</span>
                        </div>
                        <div className="bg-white rounded-lg py-2 px-2 flex items-baseline justify-center gap-1 shadow-2xs">
                          <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                            {String(qrisSeconds).padStart(2, "0")}
                          </span>
                          <span className="text-xs font-bold text-[#C26B27]">Detik</span>
                        </div>
                      </div>
                    </div>

                    {/* White Payment Card: BCA Virtual Account ATAU QRIS */}
                    {mobilePaymentType === "va_bca" ? (
                      <div className="bg-white rounded-3xl p-5 border border-slate-200/75 shadow-2xs">
                        {/* Logo Bank VA (klik untuk simulasi pembayaran berhasil) */}
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => {
                              setIsQrisModalOpen(false);
                              setIsCheckoutModalOpen(false);
                              setCurrentAccountPlan(currentTier === "pro" ? "Paket: Pro" : "Paket: Plus");
                              setIsSuccessModalOpen(true);
                            }}
                            title="Simulasi Pembayaran Berhasil"
                            className="cursor-pointer active:scale-95 transition-transform"
                          >
                            {selectedVaBank === "bri" ? (
                              <img src="/assets/payment-logos/bri.png" alt="BRI" className="h-7 w-auto object-contain shrink-0" />
                            ) : selectedVaBank === "mandiri" ? (
                              <img src="/assets/payment-logos/mandiri.png" alt="Mandiri" className="h-8 w-auto object-contain shrink-0" />
                            ) : selectedVaBank === "permata" ? (
                              <img src="/assets/payment-logos/permata.png" alt="Permata" className="h-8 w-auto object-contain shrink-0" />
                            ) : selectedVaBank === "cimb" ? (
                              <span className="inline-flex items-center gap-1.5 py-1">
                                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                  <rect width="24" height="24" rx="3" fill="#790008" />
                                  <path d="M7 7l6 5-6 5h5l6-5-6-5H7z" fill="#FFFFFF" />
                                </svg>
                                <span className="text-[13px] tracking-tight leading-none whitespace-nowrap">
                                  <span className="font-black text-[#790008]">CIMB</span>{" "}
                                  <span className="font-medium text-[#790008]">NIAGA</span>
                                </span>
                              </span>
                            ) : selectedVaBank === "bsi" ? (
                              <span className="inline-flex items-center gap-1 py-1">
                                <span className="relative text-[18px] font-black tracking-tight leading-none text-[#00A39D] pr-1">
                                  BSI
                                  <span className="absolute -top-1 right-0 text-[9px] text-[#F9AD19] leading-none">✦</span>
                                </span>
                                <span className="flex flex-col leading-none text-left text-[7px] font-bold text-[#00A39D] uppercase">
                                  <span>BANK SYARIAH</span>
                                  <span>INDONESIA</span>
                                </span>
                              </span>
                            ) : (
                              <img src="/assets/payment-logos/bni.png" alt="BNI" className="h-7 w-auto object-contain shrink-0" />
                            )}
                          </button>
                        </div>

                        {/* Deskripsi */}
                        <p className="text-[13px] leading-[1.6] text-neutral-700 mt-4">
                          {selectedVaBank === "bri"
                            ? "Gunakan nomor BRI Virtual Account di bawah untuk melakukan transaksi dan lakukan pembayaran sesuai nominal yang tertera."
                            : `Gunakan nomor ${selectedVaBank === "mandiri" ? "Mandiri" : selectedVaBank === "permata" ? "Permata Bank" : selectedVaBank === "cimb" ? "CIMB Niaga" : selectedVaBank === "bsi" ? "BSI" : "BNI"} Virtual Account di bawah ini untuk melakukan pembayaran. Pastikan nominal transfer sesuai hingga digit terakhir agar transaksi terverifikasi otomatis.`}
                        </p>

                        {/* Virtual Account Section */}
                        <div className="mt-5">
                          <h5 className="text-[15px] font-bold text-black leading-snug">
                            {selectedVaBank === "bri" ? "Nomor Virtual Account" : "Virtual Account"}
                          </h5>
                          <div className="mt-2.5 px-3.5 py-3 rounded-xl border-[1.5px] border-indigo-200 bg-white flex items-center justify-between gap-2">
                            <span className="text-[13.5px] sm:text-[14.5px] font-bold text-blue-800 tracking-wide tabular-nums truncate select-all">
                              {selectedVaBank === "bri" ? "1241291143858888908" : "077434423784279374928453"}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyVaNumber(
                                  selectedVaBank === "bri"
                                    ? "1241291143858888908"
                                    : "077434423784279374928453"
                                )
                              }
                              aria-label="Salin nomor Virtual Account"
                              className="p-1.5 rounded-lg text-blue-800 hover:bg-blue-50 active:scale-95 transition-all shrink-0 cursor-pointer"
                            >
                              <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Petunjuk Penggunaan / Bank Guide */}
                        {selectedVaBank === "bri" ? (
                          <div className="mt-5 space-y-0">
                            {/* 1. ATM BRI */}
                            <div className="py-2.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setBriGuideTab((prev) => (prev === "atm" ? null : "atm"))
                                }
                                className="w-full flex items-center justify-between text-left cursor-pointer group"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="size-5 rounded-full bg-sky-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                                    ?
                                  </span>
                                  <span className="text-[13.5px] font-bold text-neutral-900">
                                    ATM BRI
                                  </span>
                                </div>
                                <svg
                                  className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-900 transition-colors"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m7 15 5 5 5-5" />
                                  <path d="m7 9 5-5 5 5" />
                                </svg>
                              </button>
                              {briGuideTab === "atm" && (
                                <ol className="mt-3 py-4 pr-4 pl-8 rounded-xl bg-blue-500/15 text-[12.5px] text-black font-medium leading-relaxed space-y-2 list-decimal list-outside">
                                  <li>Masukkan kartu ATM BRI dan PIN Kamu.</li>
                                  <li>
                                    Pilih menu <strong className="font-bold">Transaksi Lainnya</strong>.
                                  </li>
                                  <li>
                                    Pilih{" "}
                                    <strong className="font-bold">
                                      Transfer &rarr; ke Rekening BRI Virtual Account
                                    </strong>
                                    .
                                  </li>
                                  <li>Masukkan nomor rekening virtual BRI.</li>
                                  <li>Masukkan jumlah yang harus dibayar, lalu konfirmasi.</li>
                                  <li>Pembayaran selesai.</li>
                                </ol>
                              )}
                            </div>

                            {/* 2. Internet Banking BRI */}
                            <div className="border-t border-slate-100 py-2.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setBriGuideTab((prev) => (prev === "ib" ? null : "ib"))
                                }
                                className="w-full flex items-center justify-between text-left cursor-pointer group"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="size-5 rounded-full bg-sky-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                                    ?
                                  </span>
                                  <span className="text-[13.5px] font-bold text-neutral-900">
                                    Internet Banking BRI
                                  </span>
                                </div>
                                <svg
                                  className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-900 transition-colors"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m7 15 5 5 5-5" />
                                  <path d="m7 9 5-5 5 5" />
                                </svg>
                              </button>
                              {briGuideTab === "ib" && (
                                <ol className="mt-3 py-4 pr-4 pl-8 rounded-xl bg-blue-500/15 text-[12.5px] text-black font-medium leading-relaxed space-y-2 list-decimal list-outside">
                                  <li>Login pada Internet Banking BRI.</li>
                                  <li>
                                    Pilih menu{" "}
                                    <strong className="font-bold">
                                      Transfer &rarr; Transfer ke Virtual Account
                                    </strong>
                                    .
                                  </li>
                                  <li>Masukkan nomor Virtual Account yang tertera di atas.</li>
                                  <li>Masukkan jumlah pembayaran sesuai tagihan.</li>
                                  <li>Validasi transaksi menggunakan mToken Kamu.</li>
                                  <li>Pembayaran selesai.</li>
                                </ol>
                              )}
                            </div>

                            {/* 3. BRImo */}
                            <div className="border-t border-slate-100 py-2.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setBriGuideTab((prev) => (prev === "brimo" ? null : "brimo"))
                                }
                                className="w-full flex items-center justify-between text-left cursor-pointer group"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="size-5 rounded-full bg-sky-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                                    ?
                                  </span>
                                  <span className="text-[13.5px] font-bold text-neutral-900">
                                    BRImo
                                  </span>
                                </div>
                                <svg
                                  className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-900 transition-colors"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m7 15 5 5 5-5" />
                                  <path d="m7 9 5-5 5 5" />
                                </svg>
                              </button>
                              {briGuideTab === "brimo" && (
                                <ol className="mt-3 py-4 pr-4 pl-8 rounded-xl bg-blue-500/15 text-[12.5px] text-black font-medium leading-relaxed space-y-2 list-decimal list-outside">
                                  <li>Login pada aplikasi BRImo.</li>
                                  <li>
                                    Pilih menu{" "}
                                    <strong className="font-bold">
                                      Pembayaran &rarr; Virtual Account BRI
                                    </strong>
                                    .
                                  </li>
                                  <li>Masukkan nomor Virtual Account yang tertera di atas.</li>
                                  <li>Konfirmasi nominal pembayaran yang tampil pada layar.</li>
                                  <li>Masukkan PIN BRImo Kamu.</li>
                                  <li>Transaksi berhasil dilakukan.</li>
                                </ol>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-5">
                            <div className="flex items-center gap-2">
                              <span className="size-5 rounded-full bg-sky-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                                ?
                              </span>
                              <span className="text-[13.5px] font-bold text-sky-900">
                                Petunjuk Penggunaan
                              </span>
                              <svg
                                className="w-3.5 h-3.5 text-sky-900/70"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="m7 15 5 5 5-5" />
                                <path d="m7 9 5-5 5 5" />
                              </svg>
                            </div>

                            {/* 1. ATM BCA */}
                            <div className="mt-3.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setBcaGuideTab((prev) => (prev === "atm" ? null : "atm"))
                                }
                                className="w-full py-2 flex items-center justify-between text-left cursor-pointer"
                              >
                                <span className="text-[14px] font-bold text-neutral-900">
                                  ATM BCA
                                </span>
                                <svg
                                  className={`w-4 h-4 text-black transition-transform ${
                                    bcaGuideTab === "atm" ? "rotate-90" : ""
                                  }`}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m9 18 6-6-6-6" />
                                </svg>
                              </button>
                              {bcaGuideTab === "atm" && (
                                <ol className="mt-2 mb-3.5 py-4 pr-4 pl-8 rounded-xl bg-blue-500/15 text-[12.5px] text-black font-medium leading-relaxed space-y-2 list-decimal list-outside">
                                  <li>Masukkan kartu ATM dan PIN BCA Kamu.</li>
                                  <li>
                                    Pilih menu Transaksi Lainnya lalu Transfer lalu Ke Rekening BCA Virtual Account.
                                  </li>
                                  <li>
                                    Masukkan nomor Virtual Account yang tertera di atas, lalu tekan Benar.
                                  </li>
                                  <li>
                                    Periksa rincian pembayaran pada layar, lalu pilih Ya untuk mengonfirmasi.
                                  </li>
                                  <li>
                                    Transaksi selesai, simpan struk sebagai bukti pembayaran.
                                  </li>
                                </ol>
                              )}
                            </div>

                            {/* 2. Klik BCA */}
                            <div className="border-t border-neutral-800/40">
                              <button
                                type="button"
                                onClick={() =>
                                  setBcaGuideTab((prev) => (prev === "klikbca" ? null : "klikbca"))
                                }
                                className="w-full py-3.5 flex items-center justify-between text-left cursor-pointer"
                              >
                                <span className="text-[14px] font-bold text-neutral-900">
                                  Klik BCA
                                </span>
                                <svg
                                  className={`w-4 h-4 text-black transition-transform ${
                                    bcaGuideTab === "klikbca" ? "rotate-90" : ""
                                  }`}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m9 18 6-6-6-6" />
                                </svg>
                              </button>
                              {bcaGuideTab === "klikbca" && (
                                <ol className="mb-3.5 py-4 pr-4 pl-8 rounded-xl bg-blue-500/15 text-[12.5px] text-black font-medium leading-relaxed space-y-2 list-decimal list-outside">
                                  <li>Login ke situs KlikBCA Individual dengan User ID dan PIN kamu.</li>
                                  <li>Pilih menu Transfer Dana lalu pilih Transfer ke BCA Virtual Account.</li>
                                  <li>Masukkan nomor Virtual Account di atas, lalu klik Lanjutkan.</li>
                                  <li>Periksa rincian pembayaran, masukkan respon KeyBCA, lalu klik Kirim.</li>
                                  <li>Transaksi selesai, simpan bukti pembayaran kamu.</li>
                                </ol>
                              )}
                            </div>

                            {/* 3. m-BCA */}
                            <div className="border-t border-b border-neutral-800/40">
                              <button
                                type="button"
                                onClick={() =>
                                  setBcaGuideTab((prev) => (prev === "mbca" ? null : "mbca"))
                                }
                                className="w-full py-3.5 flex items-center justify-between text-left cursor-pointer"
                              >
                                <span className="text-[14px] font-bold text-neutral-900">
                                  m-BCA
                                </span>
                                <svg
                                  className={`w-4 h-4 text-black transition-transform ${
                                    bcaGuideTab === "mbca" ? "rotate-90" : ""
                                  }`}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m9 18 6-6-6-6" />
                                </svg>
                              </button>
                              {bcaGuideTab === "mbca" && (
                                <ol className="mb-3.5 py-4 pr-4 pl-8 rounded-xl bg-blue-500/15 text-[12.5px] text-black font-medium leading-relaxed space-y-2 list-decimal list-outside">
                                  <li>Buka aplikasi BCA mobile, pilih menu m-BCA, lalu masukkan Kode Akses.</li>
                                  <li>Pilih menu m-Transfer lalu pilih BCA Virtual Account.</li>
                                  <li>Masukkan nomor Virtual Account di atas, lalu tekan OK dan Send.</li>
                                  <li>Periksa rincian pembayaran yang muncul, tekan OK, lalu masukkan PIN m-BCA.</li>
                                  <li>Transaksi selesai, simpan bukti transaksi kamu.</li>
                                </ol>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Tombol Batalkan */}
                        <button
                          type="button"
                          onClick={() => {
                            setCancelPaymentReason("Saya berubah pikiran");
                            setCancelPaymentModalOpen(true);
                          }}
                          className="mt-5 w-full py-3.5 px-6 rounded-2xl bg-[#F42B2B] hover:bg-[#dc2626] active:scale-[0.98] text-white font-bold text-sm transition-all cursor-pointer shadow-sm"
                        >
                          Batalkan
                        </button>
                      </div>
                    ) : mobilePaymentType === "gopay" ? (
                      <div className="bg-white rounded-3xl p-5 border border-slate-200/75 shadow-2xs">
                        {/* Logos GoPay & GoPayLater */}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsQrisModalOpen(false);
                              setIsCheckoutModalOpen(false);
                              setCurrentAccountPlan(currentTier === "pro" ? "Paket: Pro" : "Paket: Plus");
                              setIsSuccessModalOpen(true);
                            }}
                            title="Simulasi Pembayaran Berhasil"
                            className="flex items-center gap-3 cursor-pointer active:scale-95 transition-transform"
                          >
                            <img
                              src="/assets/payment-logos/gopay.png"
                              alt="GoPay"
                              className="h-6 w-auto object-contain shrink-0"
                            />
                            <img
                              src="/assets/payment-logos/gopaylater.png"
                              alt="GoPayLater"
                              className="h-6.5 w-auto object-contain shrink-0"
                            />
                          </button>
                        </div>

                        {/* Deskripsi */}
                        <p className="text-[13px] leading-[1.6] text-neutral-700 mt-4">
                          Tekan tombol di bawah untuk membuka aplikasi GoPay dan selesaikan pembayaran menggunakan GoPay atau GoPayLater. Pastikan saldo GoPay atau limit GoPayLater kamu mencukupi sebelum melanjutkan pembayaran.
                        </p>

                        {/* Petunjuk Penggunaan */}
                        <div className="mt-5">
                          <button
                            type="button"
                            onClick={() => setGopayGuideOpen((prev) => !prev)}
                            className="flex items-center gap-2 text-left cursor-pointer group"
                          >
                            <span className="size-5 rounded-full bg-sky-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                              ?
                            </span>
                            <span className="text-[13.5px] font-bold text-sky-900">
                              Petunjuk Penggunaan
                            </span>
                            <svg
                              className="w-3.5 h-3.5 text-sky-900/70 group-hover:text-sky-900 transition-colors"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m7 15 5 5 5-5" />
                              <path d="m7 9 5-5 5 5" />
                            </svg>
                          </button>

                          {gopayGuideOpen && (
                            <ol className="mt-3 py-4 pr-4 pl-8 rounded-xl bg-blue-500/15 text-[12.5px] text-black font-medium leading-relaxed space-y-2 list-decimal list-outside">
                              <li>Tekan tombol Bayar dengan GoPay.</li>
                              <li>Kamu akan otomatis diarahkan ke aplikasi GoPay.</li>
                              <li>Pilih metode pembayaran GoPay atau GoPayLater.</li>
                              <li>Periksa rincian pembayaran, lalu pilih Konfirmasi &amp; Bayar.</li>
                              <li>Konfirmasi transaksi dengan memasukkan PIN GoPay atau mengikuti proses autentikasi GoPayLater.</li>
                              <li>Pembayaran berhasil.</li>
                            </ol>
                          )}
                        </div>

                        {/* Tombol Biru Bayar dengan GoPay */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsQrisModalOpen(false);
                            setIsCheckoutModalOpen(false);
                            setCurrentAccountPlan(currentTier === "pro" ? "Paket: Pro" : "Paket: Plus");
                            setIsSuccessModalOpen(true);
                          }}
                          className="mt-5 w-full py-3.5 px-6 rounded-2xl bg-[#3B7CE2] hover:bg-[#2563EB] active:scale-[0.98] text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
                        >
                          Bayar dengan GoPay
                        </button>

                        {/* Tombol Merah Batalkan */}
                        <button
                          type="button"
                          onClick={() => {
                            setCancelPaymentReason("Saya berubah pikiran");
                            setCancelPaymentModalOpen(true);
                          }}
                          className="mt-3 w-full py-3.5 px-6 rounded-2xl bg-[#F42B2B] hover:bg-[#dc2626] active:scale-[0.98] text-white font-bold text-sm transition-all cursor-pointer shadow-sm"
                        >
                          Batalkan
                        </button>
                      </div>
                    ) : mobilePaymentType === "akulaku" ? (
                      <div className="bg-white rounded-3xl p-5 border border-slate-200/75 shadow-2xs">
                        {/* Logo Akulaku PayLater */}
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsQrisModalOpen(false);
                              setIsCheckoutModalOpen(false);
                              setCurrentAccountPlan(currentTier === "pro" ? "Paket: Pro" : "Paket: Plus");
                              setIsSuccessModalOpen(true);
                            }}
                            title="Simulasi Pembayaran Berhasil"
                            className="cursor-pointer active:scale-95 transition-transform"
                          >
                            <img
                              src="/assets/payment-logos/akulaku.png"
                              alt="Akulaku PayLater"
                              className="h-8 w-auto object-contain shrink-0"
                            />
                          </button>
                        </div>

                        {/* Deskripsi */}
                        <p className="text-[13px] leading-[1.6] text-neutral-700 mt-4">
                          Tekan tombol di bawah untuk melanjutkan pembayaran menggunakan Akulaku PayLater. Kamu akan diarahkan ke aplikasi Akulaku untuk memilih tenor cicilan dan mengonfirmasi pembayaran.
                        </p>

                        {/* Petunjuk Penggunaan */}
                        <div className="mt-5">
                          <button
                            type="button"
                            onClick={() => setAkulakuGuideOpen((prev) => !prev)}
                            className="flex items-center gap-2 text-left cursor-pointer group"
                          >
                            <span className="size-5 rounded-full bg-sky-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                              ?
                            </span>
                            <span className="text-[13.5px] font-bold text-sky-900">
                              Petunjuk Penggunaan
                            </span>
                            <svg
                              className="w-3.5 h-3.5 text-sky-900/70 group-hover:text-sky-900 transition-colors"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m7 15 5 5 5-5" />
                              <path d="m7 9 5-5 5 5" />
                            </svg>
                          </button>

                          {akulakuGuideOpen && (
                            <ol className="mt-3 py-4 pr-4 pl-8 rounded-xl bg-blue-500/15 text-[12.5px] text-black font-medium leading-relaxed space-y-2 list-decimal list-outside">
                              <li>Tekan tombol Bayar dengan Akulaku PayLater.</li>
                              <li>Kamu akan otomatis diarahkan ke aplikasi Akulaku.</li>
                              <li>Pilih tenor cicilan yang diinginkan.</li>
                              <li>Periksa rincian pembayaran, lalu konfirmasi transaksi.</li>
                              <li>Masukkan PIN Akulaku atau kode verifikasi (OTP) Kamu.</li>
                              <li>
                                Selesaikan verifikasi dengan memasukkan PIN atau kode OTP jika diminta.
                                <br />
                                Pembayaran berhasil.
                              </li>
                            </ol>
                          )}
                        </div>

                        {/* Tombol Biru Bayar dengan Akulaku PayLater */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsQrisModalOpen(false);
                            setIsCheckoutModalOpen(false);
                            setCurrentAccountPlan(currentTier === "pro" ? "Paket: Pro" : "Paket: Plus");
                            setIsSuccessModalOpen(true);
                          }}
                          className="mt-5 w-full py-3.5 px-6 rounded-2xl bg-[#3B7CE2] hover:bg-[#2563EB] active:scale-[0.98] text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
                        >
                          Bayar dengan Akulaku PayLater
                        </button>

                        {/* Tombol Merah Batalkan */}
                        <button
                          type="button"
                          onClick={() => {
                            setCancelPaymentReason("Saya berubah pikiran");
                            setCancelPaymentModalOpen(true);
                          }}
                          className="mt-3 w-full py-3.5 px-6 rounded-2xl bg-[#F42B2B] hover:bg-[#dc2626] active:scale-[0.98] text-white font-bold text-sm transition-all cursor-pointer shadow-sm"
                        >
                          Batalkan
                        </button>
                      </div>
                    ) : mobilePaymentType === "shopeepay" ? (
                      <div className="bg-white rounded-3xl p-5 border border-slate-200/75 shadow-2xs">
                        {/* Logos ShopeePay & SPayLater */}
                        <div className="flex items-center gap-3.5">
                          <img
                            src="/assets/payment-logos/shopeepay.png"
                            alt="ShopeePay"
                            className="h-7 w-auto object-contain shrink-0"
                          />
                          <img
                            src="/assets/payment-logos/spaylater.png"
                            alt="SPayLater"
                            className="h-7 w-auto object-contain shrink-0"
                          />
                        </div>

                        {/* Deskripsi */}
                        <p className="text-[13px] leading-[1.6] text-neutral-700 mt-4">
                          Tekan tombol di bawah ini untuk membuka aplikasi Shopee dan menyelesaikan pembayaran menggunakan ShopeePay atau SPayLater. Pastikan saldo atau limit Anda mencukupi.
                        </p>

                        {/* Petunjuk Penggunaan */}
                        <div className="mt-5">
                          <button
                            type="button"
                            onClick={() => setShopeeGuideOpen((prev) => !prev)}
                            className="flex items-center gap-2 text-left cursor-pointer group"
                          >
                            <span className="size-5 rounded-full bg-sky-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                              ?
                            </span>
                            <span className="text-[13.5px] font-bold text-sky-900">
                              Petunjuk Penggunaan
                            </span>
                            <svg
                              className="w-3.5 h-3.5 text-sky-900/70 group-hover:text-sky-900 transition-colors"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m7 15 5 5 5-5" />
                              <path d="m7 9 5-5 5 5" />
                            </svg>
                          </button>

                          {shopeeGuideOpen && (
                            <ol className="mt-3 py-4 pr-4 pl-8 rounded-xl bg-blue-500/15 text-[12.5px] text-black font-medium leading-relaxed space-y-2 list-decimal list-outside">
                              <li>Tekan tombol &quot;Bayar dengan ShopeePay/SPayLater&quot;.</li>
                              <li>Anda akan otomatis diarahkan ke aplikasi Shopee.</li>
                              <li>
                                Pilih metode pembayaran yang ingin digunakan (ShopeePay atau SPayLater).
                              </li>
                              <li>Periksa kembali total tagihan, lalu tekan Bayar Sekarang.</li>
                              <li>Masukkan PIN ShopeePay Anda untuk mengonfirmasi transaksi.</li>
                              <li>
                                Pembayaran berhasil! Anda akan otomatis dialihkan kembali ke halaman transaksi.
                              </li>
                            </ol>
                          )}
                        </div>

                        {/* Tombol Biru Bayar dengan ShopeePay */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsQrisModalOpen(false);
                            setIsCheckoutModalOpen(false);
                            setCurrentAccountPlan(currentTier === "pro" ? "Paket: Pro" : "Paket: Plus");
                            setIsSuccessModalOpen(true);
                          }}
                          className="mt-5 w-full py-3.5 px-6 rounded-2xl bg-[#1A73E8] hover:bg-[#1557b0] active:scale-[0.98] text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
                        >
                          Bayar dengan ShopeePay
                        </button>

                        {/* Tombol Merah Batalkan */}
                        <button
                          type="button"
                          onClick={() => {
                            setCancelPaymentReason("Saya berubah pikiran");
                            setCancelPaymentModalOpen(true);
                          }}
                          className="mt-3 w-full py-3.5 px-6 rounded-2xl bg-[#F42B2B] hover:bg-[#dc2626] active:scale-[0.98] text-white font-bold text-sm transition-all cursor-pointer shadow-sm"
                        >
                          Batalkan
                        </button>
                      </div>
                    ) : mobilePaymentType === "card" ? (
                      <div className="bg-white rounded-3xl p-5 border border-slate-200/75 shadow-2xs">
                        {/* Header: Back arrow + Card Payment */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsQrisModalOpen(false)}
                            aria-label="Kembali ke metode pembayaran"
                            className="size-8 -ml-1.5 rounded-full flex items-center justify-center text-black hover:bg-slate-100 active:scale-95 transition-all cursor-pointer shrink-0"
                          >
                            <svg
                              className="w-5 h-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m15 18-6-6 6-6" />
                            </svg>
                          </button>
                          <h3 className="text-[19px] font-bold text-black tracking-tight">
                            Card Payment
                          </h3>
                        </div>

                        {/* 5 Card Network Logos: VISA, Mastercard, JCB, AMEX, UnionPay */}
                        <div className="mt-4 flex items-center gap-3 flex-wrap">
                          <img
                            src="/assets/payment-logos/visa.png"
                            alt="VISA"
                            className="h-5 w-auto object-contain shrink-0"
                          />
                          {/* Mastercard */}
                          <svg
                            className="w-9 h-6 shrink-0"
                            viewBox="0 0 32 20"
                            fill="none"
                            aria-label="Mastercard"
                          >
                            <circle cx="11" cy="10" r="8" fill="#EB001B" />
                            <circle cx="21" cy="10" r="8" fill="#F79E1B" />
                            <path
                              d="M16 3.7a8 8 0 0 1 0 12.6 8 8 0 0 1 0-12.6z"
                              fill="#FF5F00"
                            />
                          </svg>
                          {/* JCB */}
                          <span className="inline-flex items-center gap-[2px] bg-white p-[1.5px] rounded-[4px] border border-slate-200/80 shrink-0">
                            <span className="w-[10px] h-[20px] rounded-[2px] bg-gradient-to-b from-[#1D4ED8] to-[#0284C7] text-[8.5px] font-black text-white flex items-center justify-center leading-none">
                              J
                            </span>
                            <span className="w-[10px] h-[20px] rounded-[2px] bg-gradient-to-b from-[#991B1B] to-[#E11D48] text-[8.5px] font-black text-white flex items-center justify-center leading-none">
                              C
                            </span>
                            <span className="w-[10px] h-[20px] rounded-[2px] bg-gradient-to-b from-[#15803D] to-[#65A30D] text-[8.5px] font-black text-white flex items-center justify-center leading-none">
                              B
                            </span>
                          </span>
                          {/* American Express */}
                          <span className="inline-flex flex-col items-center justify-center w-[26px] h-[24px] rounded-[3px] bg-[#2E77BC] text-white font-extrabold leading-none tracking-tighter shrink-0">
                            <span className="text-[4.5px]">AMERICAN</span>
                            <span className="text-[5px] mt-[1px]">EXPRESS</span>
                          </span>
                          {/* UnionPay */}
                          <span className="inline-flex items-center justify-center h-[24px] px-1.5 rounded-[4px] bg-gradient-to-r from-[#E21836] via-[#00447C] to-[#007B84] text-white font-bold text-[7px] italic tracking-tight leading-none shrink-0">
                            UnionPay
                          </span>
                        </div>

                        {/* Deskripsi */}
                        <p className="text-[13px] leading-[1.6] text-neutral-700 mt-4">
                          Masukkan detail kartu kredit atau debit Anda di bawah ini. Pastikan informasi yang dimasukkan sudah benar untuk memproses transaksi.
                        </p>

                        {/* Form Kartu */}
                        <div className="mt-4 space-y-3.5">
                          {/* Card Number */}
                          <div>
                            <label className="block text-[14px] font-bold text-black mb-1.5">
                              Card Number
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              autoComplete="cc-number"
                              value={cardNumber}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                                const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
                                setCardNumber(formatted);
                              }}
                              placeholder="1234 1234 1234 1234"
                              className="w-full px-4 py-3 rounded-xl border border-neutral-400/90 text-[14px] font-medium text-neutral-800 placeholder:text-neutral-500/90 focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15 transition-all"
                            />
                          </div>

                          {/* Expiration Date */}
                          <div>
                            <label className="block text-[14px] font-semibold text-neutral-950 mb-1.5">
                              Expiration Date
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              autoComplete="cc-exp"
                              value={cardExpiry}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                                const formatted =
                                  digits.length > 2
                                    ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                                    : digits;
                                setCardExpiry(formatted);
                              }}
                              placeholder="MM/YY"
                              className="w-full px-4 py-3 rounded-xl border border-neutral-400/90 text-[14px] font-medium text-neutral-800 placeholder:text-neutral-500/90 focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15 transition-all"
                            />
                          </div>

                          {/* CVV */}
                          <div>
                            <label className="block text-[14px] font-semibold text-neutral-950 mb-1.5">
                              CVV
                            </label>
                            <input
                              type="password"
                              inputMode="numeric"
                              autoComplete="cc-csc"
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                                setCardCvv(digits);
                              }}
                              placeholder="1234"
                              className="w-full px-4 py-3 rounded-xl border border-neutral-400/90 text-[14px] font-medium text-neutral-800 placeholder:text-neutral-500/90 focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15 transition-all"
                            />
                          </div>
                        </div>

                        {/* Petunjuk Penggunaan */}
                        <div className="mt-5">
                          <button
                            type="button"
                            onClick={() => setCardGuideOpen((prev) => !prev)}
                            className="flex items-center gap-2 text-left cursor-pointer group"
                          >
                            <span className="size-5 rounded-full bg-sky-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                              ?
                            </span>
                            <span className="text-[13.5px] font-bold text-sky-900">
                              Petunjuk Penggunaan
                            </span>
                            <svg
                              className="w-3.5 h-3.5 text-sky-900/70 group-hover:text-sky-900 transition-colors"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m7 15 5 5 5-5" />
                              <path d="m7 9 5-5 5 5" />
                            </svg>
                          </button>

                          {cardGuideOpen && (
                            <ol className="mt-3 py-4 pr-4 pl-8 rounded-xl bg-blue-500/15 text-[12.5px] text-black font-medium leading-relaxed space-y-2 list-decimal list-outside">
                              <li>Masukkan 16 digit nomor kartu kredit atau debit Anda.</li>
                              <li>
                                Isi masa berlaku kartu (Bulan/Tahun) serta 3 digit kode CVV/CVC yang tertera di belakang kartu Anda.
                              </li>
                              <li>Klik tombol bayar untuk melanjutkan transaksi.</li>
                              <li>
                                Masukkan kode OTP yang dikirimkan melalui SMS oleh bank penerbit kartu Anda (jika diminta).
                              </li>
                              <li>
                                Transaksi selesai! Halaman akan otomatis dialihkan setelah pembayaran terverifikasi.
                              </li>
                            </ol>
                          )}
                        </div>

                        {/* Tombol Biru Bayar Sekarang */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsQrisModalOpen(false);
                            setIsCheckoutModalOpen(false);
                            setCurrentAccountPlan(currentTier === "pro" ? "Paket: Pro" : "Paket: Plus");
                            setIsSuccessModalOpen(true);
                          }}
                          className="mt-5 w-full py-3.5 px-6 rounded-2xl bg-[#1A73E8] hover:bg-[#1557b0] active:scale-[0.98] text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
                        >
                          Bayar Sekarang
                        </button>
                      </div>
                    ) : (
                    <div className="bg-white rounded-3xl p-5 border border-slate-200/75 shadow-2xs">
                      {/* Logo QRIS (klik untuk simulasi pembayaran berhasil) */}
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsQrisModalOpen(false);
                            setIsCheckoutModalOpen(false);
                            setCurrentAccountPlan(currentTier === "pro" ? "Paket: Pro" : "Paket: Plus");
                            setIsSuccessModalOpen(true);
                          }}
                          title="Simulasi Pembayaran Berhasil"
                          className="cursor-pointer active:scale-95 transition-transform"
                        >
                          <img
                            src="/assets/payment-logos/qris.png"
                            alt="QRIS"
                            className="h-7 w-auto object-contain shrink-0"
                          />
                        </button>
                      </div>

                      {/* Deskripsi */}
                      <p className="text-[13px] leading-[1.6] text-neutral-700 mt-4">
                        Scan kode QR menggunakan e-wallet atau m-banking pilihan kamu, kemudian lakukan pembayaran sesuai nominal yang tertera.
                      </p>

                      {/* Kode QR (klik juga bisa untuk simulasi pembayaran berhasil) */}
                      <div className="my-6 flex justify-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsQrisModalOpen(false);
                            setIsCheckoutModalOpen(false);
                            setCurrentAccountPlan(currentTier === "pro" ? "Paket: Pro" : "Paket: Plus");
                            setIsSuccessModalOpen(true);
                          }}
                          title="Simulasi Pembayaran Berhasil"
                          className="p-2 bg-white rounded-xl cursor-pointer active:scale-[0.98] transition-transform"
                        >
                          <svg
                            className="w-[220px] h-[220px] block"
                            viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
                            shapeRendering="crispEdges"
                            aria-label="Kode QR Pembayaran QRIS"
                          >
                            <rect width={QR_SIZE} height={QR_SIZE} fill="#FFFFFF" />
                            {QR_MATRIX.map((row, r) =>
                              row.map((filled, c) =>
                                filled ? (
                                  <rect
                                    key={`${r}-${c}`}
                                    x={c}
                                    y={r}
                                    width={1}
                                    height={1}
                                    fill="#000000"
                                  />
                                ) : null
                              )
                            )}
                          </svg>
                        </button>
                      </div>

                      {/* Tombol Download QR */}
                      <button
                        type="button"
                        onClick={handleDownloadQris}
                        className="w-full py-3.5 px-6 rounded-2xl bg-[#475D85] hover:bg-[#3a4d70] active:scale-[0.98] text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
                      >
                        Download QR
                      </button>

                      {/* Petunjuk Penggunaan */}
                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={() => setQrisGuideOpen((prev) => !prev)}
                          className="flex items-center gap-2 text-left cursor-pointer group"
                        >
                          <span className="size-5 rounded-full bg-sky-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                            ?
                          </span>
                          <span className="text-[13.5px] font-bold text-sky-900">
                            Petunjuk Penggunaan
                          </span>
                          <svg
                            className="w-3.5 h-3.5 text-sky-900/70 group-hover:text-sky-900 transition-colors"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m7 15 5 5 5-5" />
                            <path d="m7 9 5-5 5 5" />
                          </svg>
                        </button>

                        {qrisGuideOpen && (
                          <ol className="mt-3 py-4 pr-4 pl-8 rounded-xl bg-blue-500/15 text-[12.5px] text-black font-medium leading-relaxed space-y-2 list-decimal list-outside">
                            <li>Buka aplikasi m-banking atau e-wallet pilihan kamu.</li>
                            <li>Pilih menu Scan atau QRIS.</li>
                            <li>
                              Arahkan kamera ke kode QR di atas (atau unggah dari galeri jika kode QR sudah disimpan).
                            </li>
                            <li>
                              Pindai kode QR yang tersedia (atau unggah dari galeri jika kode QR telah disimpan).
                            </li>
                            <li>Pembayaran berhasil.</li>
                          </ol>
                        )}
                      </div>

                      {/* Tombol Batalkan */}
                      <button
                        type="button"
                        onClick={() => {
                          setCancelPaymentReason("Saya berubah pikiran");
                          setCancelPaymentModalOpen(true);
                        }}
                        className="mt-5 w-full py-3.5 px-6 rounded-2xl bg-[#F42B2B] hover:bg-[#dc2626] active:scale-[0.98] text-white font-bold text-sm transition-all cursor-pointer shadow-sm"
                      >
                        Batalkan
                      </button>
                    </div>
                    )}
                  </div>
                  )
                ) : (
                <div className="md:hidden bg-white rounded-3xl p-4 border border-slate-200/75 shadow-2xs">
                  <div className="mb-4">
                    <h4 className="text-[17px] font-bold text-black leading-snug tracking-tight">
                      Metode Pembayaran
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed mt-1">
                      Pilih metode pembayaran yang kamu inginkan
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {/* 1. Virtual Account (Expandable Dropdown sesuai referensi) */}
                    {vaDropdownOpen ? (
                      <div className="w-full rounded-xl border border-[#3B7CE2] bg-white overflow-hidden shadow-[0_3px_12px_rgba(59,124,226,0.12)] transition-all">
                        {/* Blue Accordion Header */}
                        <button
                          type="button"
                          onClick={() => setVaDropdownOpen(false)}
                          className="w-full flex items-center justify-between px-4 py-3.5 bg-[#3B7CE2] text-white cursor-pointer"
                        >
                          <span className="text-[13px] font-bold tracking-tight">
                            Virtual Account
                          </span>
                          <svg
                            className="w-4 h-4 text-white shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </button>

                        {/* Grid of 6 Banks (BNI, BRI, Mandiri, Permata Bank, CIMB Niaga, BSI) */}
                        <div className="p-3.5 grid grid-cols-2 gap-2.5 bg-white">
                          {/* 1. BNI */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPaymentMethod("va");
                              setSelectedVaBank("bni");
                              setMobilePaymentType("va_bca");
                            }}
                            className={`h-11 px-2.5 rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-[0.98] ${
                              selectedPaymentMethod === "va" && selectedVaBank === "bni"
                                ? "bg-blue-50/40 border-2 border-[#1A73E8] shadow-2xs"
                                : "bg-white border border-slate-300/90 hover:border-[#3B7CE2]"
                            }`}
                          >
                            <img
                              src="/assets/payment-logos/bni.png"
                              alt="BNI"
                              className="h-4.5 w-auto max-w-[84px] object-contain"
                            />
                          </button>

                          {/* 2. BANK BRI */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPaymentMethod("va");
                              setSelectedVaBank("bri");
                              setMobilePaymentType("va_bca");
                            }}
                            className={`h-11 px-2.5 rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-[0.98] ${
                              selectedPaymentMethod === "va" && selectedVaBank === "bri"
                                ? "bg-blue-50/40 border-2 border-[#1A73E8] shadow-2xs"
                                : "bg-white border border-slate-300/90 hover:border-[#3B7CE2]"
                            }`}
                          >
                            <img
                              src="/assets/payment-logos/bri.png"
                              alt="BANK BRI"
                              className="h-4.5 w-auto max-w-[100px] object-contain"
                            />
                          </button>

                          {/* 3. Mandiri */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPaymentMethod("va");
                              setSelectedVaBank("mandiri");
                              setMobilePaymentType("va_bca");
                            }}
                            className={`h-11 px-2.5 rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-[0.98] ${
                              selectedPaymentMethod === "va" && selectedVaBank === "mandiri"
                                ? "bg-blue-50/40 border-2 border-[#1A73E8] shadow-2xs"
                                : "bg-white border border-slate-300/90 hover:border-[#3B7CE2]"
                            }`}
                          >
                            <img
                              src="/assets/payment-logos/mandiri.png"
                              alt="Mandiri"
                              className="h-6 w-auto max-w-[100px] object-contain"
                            />
                          </button>

                          {/* 4. Permata Bank */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPaymentMethod("va");
                              setSelectedVaBank("permata");
                              setMobilePaymentType("va_bca");
                            }}
                            className={`h-11 px-2.5 rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-[0.98] ${
                              selectedPaymentMethod === "va" && selectedVaBank === "permata"
                                ? "bg-blue-50/40 border-2 border-[#1A73E8] shadow-2xs"
                                : "bg-white border border-slate-300/90 hover:border-[#3B7CE2]"
                            }`}
                          >
                            <img
                              src="/assets/payment-logos/permata.png"
                              alt="Permata Bank"
                              className="h-5.5 w-auto max-w-[112px] object-contain"
                            />
                          </button>

                          {/* 5. CIMB NIAGA */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPaymentMethod("va");
                              setSelectedVaBank("cimb");
                              setMobilePaymentType("va_bca");
                            }}
                            className={`h-11 px-2.5 rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-[0.98] ${
                              selectedPaymentMethod === "va" && selectedVaBank === "cimb"
                                ? "bg-blue-50/40 border-2 border-[#1A73E8] shadow-2xs"
                                : "bg-white border border-slate-300/90 hover:border-[#3B7CE2]"
                            }`}
                          >
                            <span className="inline-flex items-center gap-1.5">
                              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <rect width="24" height="24" rx="3" fill="#790008" />
                                <path d="M7 7l6 5-6 5h5l6-5-6-5H7z" fill="#FFFFFF" />
                              </svg>
                              <span className="text-[11px] tracking-tight leading-none whitespace-nowrap">
                                <span className="font-black text-[#790008]">CIMB</span>{" "}
                                <span className="font-medium text-[#790008]">NIAGA</span>
                              </span>
                            </span>
                          </button>

                          {/* 6. BSI */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPaymentMethod("va");
                              setSelectedVaBank("bsi");
                              setMobilePaymentType("va_bca");
                            }}
                            className={`h-11 px-2.5 rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-[0.98] ${
                              selectedPaymentMethod === "va" && selectedVaBank === "bsi"
                                ? "bg-blue-50/40 border-2 border-[#1A73E8] shadow-2xs"
                                : "bg-white border border-slate-300/90 hover:border-[#3B7CE2]"
                            }`}
                          >
                            <span className="inline-flex items-center gap-1">
                              <span className="relative text-[15px] font-black tracking-tight leading-none text-[#00A39D] pr-1">
                                BSI
                                <span className="absolute -top-1 right-0 text-[8px] text-[#F9AD19] leading-none">✦</span>
                              </span>
                              <span className="flex flex-col leading-none text-left text-[6px] font-bold text-[#00A39D] uppercase">
                                <span>BANK SYARIAH</span>
                                <span>INDONESIA</span>
                              </span>
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPaymentMethod("va");
                          setVaDropdownOpen(true);
                        }}
                        className={`w-full flex items-center justify-between gap-1.5 px-3 py-3.5 rounded-xl transition-all cursor-pointer active:scale-[0.99] ${
                          selectedPaymentMethod === "va"
                            ? "bg-blue-50/25 border-2 border-[#0095FF] shadow-[0_2px_10px_rgba(0,149,255,0.12)]"
                            : "bg-white border-[1.5px] border-indigo-200 hover:border-indigo-300"
                        }`}
                      >
                        <span className="text-[12.5px] font-bold text-black/75 whitespace-nowrap">
                          Virtual Account
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <img src="/assets/payment-logos/bni.png" alt="BNI" className="h-3 w-auto object-contain" />
                          <img src="/assets/payment-logos/bri.png" alt="BANK BRI" className="h-3.5 w-auto object-contain" />
                          <span className="text-[11.5px] font-bold text-black">+4</span>
                          <svg className="w-4 h-4 text-black shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </div>
                      </button>
                    )}

                    {/* 2. QRIS */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPaymentMethod("qris");
                        setMobilePaymentType("qris");
                        setVaDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-3.5 rounded-xl transition-all cursor-pointer active:scale-[0.99] ${
                        selectedPaymentMethod === "qris"
                          ? "bg-blue-50/25 border-2 border-[#1A73E8] shadow-[0_2px_10px_rgba(26,115,232,0.12)]"
                          : "bg-white border-[1.5px] border-indigo-200 hover:border-indigo-300"
                      }`}
                    >
                      <span className="text-[12.5px] font-bold text-black/75 whitespace-nowrap">
                        QRIS
                      </span>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <img src="/assets/payment-logos/qris.png" alt="QRIS" className="h-[19px] w-auto object-contain" />
                        <span
                          className={`w-[17px] h-[17px] rounded-full flex items-center justify-center shrink-0 transition-all ${
                            selectedPaymentMethod === "qris"
                              ? "bg-[#1A73E8] border-[1.5px] border-[#1A73E8] text-white"
                              : "bg-white border-[1.5px] border-slate-300"
                          }`}
                        >
                          {selectedPaymentMethod === "qris" && (
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                      </div>
                    </button>

                    {/* 3. Gopay (gopay + gopaylater) */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPaymentMethod("gopay");
                        setMobilePaymentType("gopay");
                        setVaDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-3.5 rounded-xl transition-all cursor-pointer active:scale-[0.99] ${
                        selectedPaymentMethod === "gopay" || selectedPaymentMethod === "ewallet"
                          ? "bg-blue-50/25 border-2 border-[#1A73E8] shadow-[0_2px_10px_rgba(26,115,232,0.12)]"
                          : "bg-white border-[1.5px] border-indigo-200 hover:border-indigo-300"
                      }`}
                    >
                      <span className="text-[12.5px] font-bold text-black/75 whitespace-nowrap">
                        Gopay
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <img
                          src="/assets/payment-logos/gopay.png"
                          alt="GoPay"
                          className="h-4 w-auto object-contain"
                        />
                        <img
                          src="/assets/payment-logos/gopaylater.png"
                          alt="GoPayLater"
                          className="h-4.5 w-auto object-contain"
                        />
                        <span
                          className={`w-[17px] h-[17px] rounded-full flex items-center justify-center shrink-0 transition-all ml-0.5 ${
                            selectedPaymentMethod === "gopay" || selectedPaymentMethod === "ewallet"
                              ? "bg-[#1A73E8] border-[1.5px] border-[#1A73E8] text-white"
                              : "bg-white border-[1.5px] border-slate-300"
                          }`}
                        >
                          {(selectedPaymentMethod === "gopay" || selectedPaymentMethod === "ewallet") && (
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                      </div>
                    </button>

                    {/* 4. Akulaku Paylater */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPaymentMethod("akulaku");
                        setMobilePaymentType("akulaku");
                        setVaDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-3.5 rounded-xl transition-all cursor-pointer active:scale-[0.99] ${
                        selectedPaymentMethod === "akulaku"
                          ? "bg-blue-50/25 border-2 border-[#1A73E8] shadow-[0_2px_10px_rgba(26,115,232,0.12)]"
                          : "bg-white border-[1.5px] border-indigo-200 hover:border-indigo-300"
                      }`}
                    >
                      <span className="text-[12.5px] font-bold text-black/75 whitespace-nowrap">
                        Akulaku Paylater
                      </span>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <img
                          src="/assets/payment-logos/akulaku.png"
                          alt="Akulaku PayLater"
                          className="h-6.5 w-auto object-contain"
                        />
                        <span
                          className={`w-[17px] h-[17px] rounded-full flex items-center justify-center shrink-0 transition-all ${
                            selectedPaymentMethod === "akulaku"
                              ? "bg-[#1A73E8] border-[1.5px] border-[#1A73E8] text-white"
                              : "bg-white border-[1.5px] border-slate-300"
                          }`}
                        >
                          {selectedPaymentMethod === "akulaku" && (
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
                )}

                {/* Desktop Heading & List */}
                <h4 className="hidden md:block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pilih Metode Pembayaran
                </h4>

                <div className="hidden md:block space-y-2 sm:space-y-2.5 text-xs">
                  {/* Method 1: QRIS Instant (Default) */}
                  <label
                    onClick={() => setSelectedPaymentMethod("qris")}
                    className={`payment-method-card flex items-center justify-between p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all ${
                      selectedPaymentMethod === "qris"
                        ? "border-2 border-[#1A73E8] bg-blue-50/40 shadow-xs"
                        : "border border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          selectedPaymentMethod === "qris"
                            ? "border-[#1A73E8] bg-[#1A73E8]"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {selectedPaymentMethod === "qris" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate">
                          QRIS (GoPay, OVO, ShopeePay, BCA)
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Scan cepat, verifikasi otomatis 5 detik
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase bg-blue-100 text-[#1A73E8] px-2 py-0.5 rounded shrink-0 ml-2">
                      Instan
                    </span>
                  </label>

                  {/* Method 2: Virtual Account */}
                  <label
                    onClick={() => setSelectedPaymentMethod("va")}
                    className={`payment-method-card flex items-center justify-between p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all ${
                      selectedPaymentMethod === "va"
                        ? "border-2 border-[#1A73E8] bg-blue-50/40 shadow-xs"
                        : "border border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          selectedPaymentMethod === "va"
                            ? "border-[#1A73E8] bg-[#1A73E8]"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {selectedPaymentMethod === "va" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate">
                          Virtual Account (Bank Transfer)
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          BNI, BRI, Mandiri, Permata, CIMB Niaga, BSI
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 shrink-0 ml-2">VA</span>
                  </label>

                  {/* Method 3: GoPay */}
                  <label
                    onClick={() => setSelectedPaymentMethod("gopay")}
                    className={`payment-method-card flex items-center justify-between p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all ${
                      selectedPaymentMethod === "gopay" || selectedPaymentMethod === "ewallet"
                        ? "border-2 border-[#1A73E8] bg-blue-50/40 shadow-xs"
                        : "border border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          selectedPaymentMethod === "gopay" || selectedPaymentMethod === "ewallet"
                            ? "border-[#1A73E8] bg-[#1A73E8]"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {(selectedPaymentMethod === "gopay" || selectedPaymentMethod === "ewallet") && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate">GoPay</span>
                        <span className="text-[11px] text-slate-500 block">
                          GoPay & GoPayLater
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 shrink-0 ml-2">App</span>
                  </label>

                  {/* Method 4: Akulaku Paylater */}
                  <label
                    onClick={() => setSelectedPaymentMethod("akulaku")}
                    className={`payment-method-card flex items-center justify-between p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all ${
                      selectedPaymentMethod === "akulaku"
                        ? "border-2 border-[#1A73E8] bg-blue-50/40 shadow-xs"
                        : "border border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          selectedPaymentMethod === "akulaku"
                            ? "border-[#1A73E8] bg-[#1A73E8]"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {selectedPaymentMethod === "akulaku" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate">
                          Akulaku Paylater
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Cicilan & Paylater
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 shrink-0 ml-2">Paylater</span>
                  </label>
                </div>

                {/* Simulation Pay Button (Desktop inside right column) */}
                <div className="hidden md:block pt-3">
                  <button
                    type="button"
                    disabled={isPaymentProcessing}
                    onClick={() => handleExecutePayment(false)}
                    className="w-full py-3.5 px-6 bg-[#1A73E8] hover:bg-[#1557b0] active:scale-[0.98] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#1A73E8]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isPaymentProcessing ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Memverifikasi Pembayaran...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Bayar Sekarang ({formatRupiah(grandTotal)})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Bottom Bar (Mobile Full Page - melayang dengan harga di kiri & tombol Lanjutkan di kanan) */}
            {!isQrisModalOpen && (
              <div className="md:hidden fixed bottom-3.5 inset-x-3.5 sm:bottom-5 sm:inset-x-4 max-w-md mx-auto z-[60] bg-white/95 backdrop-blur-md border border-slate-300 rounded-2xl px-4.5 py-3 shadow-[0_12px_32px_rgba(15,23,42,0.16),0_4px_12px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-slate-500 block">
                      Total Biaya
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-lg font-extrabold text-slate-900 leading-tight">
                        {formatRupiah(grandTotal)}
                      </span>
                      {(bundlingDiscount > 0 || voucherDiscount > 0) && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatRupiah(subtotal)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isPaymentProcessing}
                    onClick={() => handleExecutePayment(true)}
                    className="px-5 py-3 bg-[#1A73E8] hover:bg-[#1557b0] text-white font-bold text-xs rounded-xl shadow-md shadow-[#1A73E8]/25 transition-all shrink-0 flex items-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-75"
                  >
                    {isPaymentProcessing ? (
                      <>
                        <svg
                          className="animate-spin h-3.5 w-3.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <span>Lanjutkan</span>
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POP-UP KONFIRMASI BATALKAN PEMBAYARAN (sesuai referensi desain) */}
      {cancelPaymentModalOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-5 overflow-hidden overscroll-none animate-[gemini-fade-in_0.18s_ease-out]"
          onClick={() => setCancelPaymentModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[360px] bg-white rounded-[24px] p-6 shadow-2xl animate-[gemini-zoom-in_0.16s_ease-out]"
          >
            {/* Close Button X di dalam pojok kanan atas kartu */}
            <button
              type="button"
              onClick={() => setCancelPaymentModalOpen(false)}
              aria-label="Tutup"
              className="absolute top-4 right-4 size-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h3 className="text-[21px] font-bold text-black leading-[1.22] tracking-tight pr-8">
              Yakin ingin membatalkan pembayaran?
            </h3>
              <p className="text-[13px] text-neutral-700 leading-[1.55] mt-3">
                Mohon beri tahu kami alasan kamu membatalkan pembayaran ini. Masukan kamu sangat berharga untuk membantu kami meningkatkan kualitas layanan di masa mendatang.
              </p>

              {/* 4 Pill Alasan Pembatalan */}
              <div className="mt-5 space-y-2.5">
                {[
                  "Saya berubah pikiran",
                  "Gunakan metode pembayaran lain",
                  "Terjadi kendala saat pembayaran",
                  "Saya ingin mengubah pesanan",
                ].map((reason) => {
                  const isActive = cancelPaymentReason === reason;
                  return (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setCancelPaymentReason(reason)}
                      className={`w-full py-3 px-4 rounded-full text-center text-[13px] transition-all cursor-pointer active:scale-[0.99] ${
                        isActive
                          ? "bg-[#3E82D6] border-[1.5px] border-[#3E82D6] text-white font-semibold shadow-xs"
                          : "bg-white border-[1.5px] border-stone-400/60 text-neutral-800 font-medium hover:border-slate-500"
                      }`}
                    >
                      {reason}
                    </button>
                  );
                })}
              </div>

              {/* Tombol Merah Batalkan Pembayaran */}
              <button
                type="button"
                onClick={() => {
                  setCancelPaymentModalOpen(false);
                  setIsQrisModalOpen(false);
                  if (cancelPaymentReason === "Gunakan metode pembayaran lain") {
                    showToast("Silakan pilih metode pembayaran lainnya", "info");
                  } else {
                    setIsCheckoutModalOpen(false);
                    showToast("Pembayaran berhasil dibatalkan", "info");
                  }
                }}
                className="mt-5 w-full py-3.5 px-5 bg-[#F42B2B] hover:bg-[#dc2626] active:scale-[0.98] text-white font-bold text-[14px] rounded-2xl shadow-sm transition-all cursor-pointer"
              >
                Batalkan Pembayaran
              </button>
          </div>
        </div>
      )}

      {/* POP-UP VOUCHER BERHASIL DITERAPKAN */}
      {isVoucherSuccessModalOpen && (
        <div
          className="fixed inset-0 z-[80] overflow-hidden overscroll-none bg-slate-900/60 backdrop-blur-sm p-4 sm:p-5 flex items-center justify-center animate-[gemini-fade-in_0.2s_ease-out]"
          onClick={() => setIsVoucherSuccessModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-[26px] max-w-[380px] w-full p-6 sm:p-7 text-center shadow-2xl border border-slate-100 animate-[gemini-zoom-in_0.18s_ease-out]"
          >
            {/* Close Button X */}
            <button
              type="button"
              onClick={() => setIsVoucherSuccessModalOpen(false)}
              aria-label="Tutup"
              className="absolute top-4 right-4 size-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Icon Voucher / Badge Diskon */}
            <div className="size-16 sm:size-20 rounded-2xl bg-gradient-to-tr from-[#1A73E8] to-sky-400 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.586 16.726A2 2 0 0 1 2 15.312V9c0-.55.45-1 1-1h1.5a1.5 1.5 0 0 0 0-3H3c-.55 0-1-.45-1-1V3a1 1 0 0 1 1-1h6.312a2 2 0 0 1 1.414.586l10.688 10.688a2 2 0 0 1 0 2.828l-6.312 6.312a2 2 0 0 1-2.828 0L2.586 16.726Z" />
                <circle cx="8" cy="8" r="1.5" fill="currentColor" />
              </svg>
            </div>

            {/* Pill Status */}
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1A73E8] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Voucher Berhasil Diterapkan
            </span>

            {/* Title */}
            <h3 className="text-xl sm:text-[22px] font-extrabold text-slate-900 mt-3 leading-snug">
              Hemat {formatRupiah(appliedVoucher?.amount || 25000)}!
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-[13px] text-slate-600 mt-2 leading-relaxed">
              Kode promo <strong className="font-bold text-[#1A73E8] tracking-wider">{appliedVoucher?.code || "ALLERIHEMAT"}</strong> berhasil dipasang. Potongan harga otomatis diterapkan ke total pesananmu.
            </p>

            {/* Rincian Box */}
            <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Kode Kupon</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">{appliedVoucher?.code || "ALLERIHEMAT"}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Total Potongan</span>
                <span className="font-bold text-emerald-600">-{formatRupiah(appliedVoucher?.amount || 25000)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Status</span>
                <span className="inline-flex items-center gap-1 font-semibold text-blue-600">
                  <span className="size-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                  Aktif Digunakan
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={() => setIsVoucherSuccessModalOpen(false)}
              className="w-full mt-5 py-3.5 px-5 bg-[#1A73E8] hover:bg-[#1557b0] active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md shadow-[#1A73E8]/20 transition-all cursor-pointer"
            >
              Gunakan Sekarang
            </button>
          </div>
        </div>
      )}

      {/* TRANSACTION SUCCESS MODAL */}
      {isSuccessModalOpen && (
        <div
          className="fixed inset-0 z-[80] overflow-hidden overscroll-none bg-slate-900/60 backdrop-blur-sm p-5 flex items-center justify-center animate-[gemini-fade-in_0.2s_ease-out]"
          onClick={() => setIsSuccessModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[24px] max-w-[360px] w-full px-6 py-8 text-center shadow-2xl border border-slate-100 animate-[gemini-zoom-in_0.18s_ease-out]"
          >
            {/* 3D Blue Verified Checkmark Badge */}
            <img
              src="/assets/payment-logos/verified-badge.png"
              alt="Pembayaran Berhasil"
              className="w-28 h-28 mx-auto object-contain drop-shadow-sm select-none"
            />

            <h3 className="text-[23px] font-extrabold text-black tracking-tight mt-4 leading-tight">
              Pembayaran Berhasil
            </h3>
            <p className="text-[13.5px] text-slate-800 mt-2.5 leading-relaxed max-w-[290px] mx-auto">
              Terima kasih telah melakukan pembayaran. Paket kamu sudah aktif, silakan mulai nikmati fitur Alerin.
            </p>

            {/* Action Buttons */}
            <div className="mt-7 space-y-3">
              <button
                type="button"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  navigate("/");
                }}
                className="w-full py-3.5 px-5 bg-[#1A73E8] hover:bg-[#1557b0] active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Mulai Nikmati Alerin
              </button>
              <button
                type="button"
                onClick={handleDownloadInvoice}
                className="w-full py-3.5 px-5 bg-[#5E6D7E] hover:bg-[#4e5b6a] active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL PAKET FITUR ALERIN */}
      {activeModalFeatureKey && (
        <div
          className="fixed inset-0 z-50 overflow-hidden overscroll-none bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-[gemini-fade-in_0.2s_ease-out]"
          onClick={() => setActiveModalFeatureKey(null)}
        >
          {(() => {
            const detail = FEATURE_DETAILS[activeModalFeatureKey];
            const pricing = PRICING_DATABASE[activeModalFeatureKey];
            const isSelected = selectedFeatures.has(activeModalFeatureKey);
            if (!detail || !pricing) return null;

            return (
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-[gemini-zoom-in_0.15s_ease-out]"
              >
                {/* Modal Header */}
                <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eff6ff] ${
                        pricing.framedIcon ? "" : "md:bg-transparent"
                      }`}
                    >
                      {pricing.mobileIcon ? (
                        <>
                          <img
                            src={`/assets/fitur-design/${pricing.mobileIcon}`}
                            alt=""
                            className="md:hidden"
                          />
                          <img
                            src={`/assets/fitur-design/${pricing.icon}`}
                            alt=""
                            className={`hidden md:block ${pricing.iconClass || "h-11 w-11"}`}
                          />
                        </>
                      ) : (
                        <img
                          src={`/assets/fitur-design/${pricing.icon}`}
                          alt=""
                          className={pricing.iconClass || "h-11 w-11"}
                        />
                      )}
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">{detail.name}</h3>
                      <p className="text-xs font-bold text-[#1A73E8] mt-0.5">
                        {formatRupiah(getPrice(activeModalFeatureKey || ""))}/{getDurationReadable(currentDuration, currentTier)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModalFeatureKey(null)}
                    aria-label="Tutup"
                    className="size-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4 overflow-y-auto overscroll-contain flex-1">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-sky-50/50 to-indigo-50/30 border border-blue-100/90 text-slate-700 text-[13px] sm:text-[13.5px] leading-relaxed font-normal">
                    {detail.desc}
                  </div>

                  <div className="pt-1">
                    <h4 className="text-[11.5px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Keunggulan & Manfaat
                    </h4>
                    <div className="space-y-2.5">
                      {detail.capabilities.map((cap) => (
                        <div key={cap} className="flex items-start gap-2.5 text-[13px] text-slate-700 leading-snug">
                          <div className="size-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5 text-[#1A73E8]">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer (Button Tutup Dihilangkan, Action Button Full Width) */}
                <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-center shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      toggleFeature(activeModalFeatureKey);
                      setActiveModalFeatureKey(null);
                    }}
                    className={`w-full py-3.5 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${
                      isSelected
                        ? "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        : "bg-[#1A73E8] hover:bg-[#1557b0] text-white shadow-md shadow-[#1A73E8]/20"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <svg
                          className="w-4 h-4 text-slate-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        <span>Batal Pilih Fitur</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Pilih Fitur Ini</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
