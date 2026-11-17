import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router";
import PlusBadgeIcon from "@/components/PlusBadgeIcon";
import AlerinBusinessModal from "@/components/AlerinBusinessModal";
import AlerinToast from "@/components/AlerinToast";

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
    tag: "AI Asisten Riset",
    desc: "Asisten AI cerdas untuk diskusi topik penelitian, eksplorasi ide akademik, penyusunan outline, dan bimbingan interaktif 24/7.",
    capabilities: [
      "Brainstorming topik dan rumusan masalah riset interaktif",
      "Penyusunan outline bab dan struktur argumen akademik",
      "Tanya-jawab konsep teori dan metodologi penelitian",
      "Asistensi persiapan presentasi dan seminar proposal",
      "Dukungan obrolan tanpa batas waktu 24/7",
    ],
  },
  jurnal: {
    name: "Alerin Jurnal",
    tag: "Scopus & SINTA",
    desc: "Solusi lengkap pencarian literatur global dan publikasi paper ke jurnal nasional terakreditasi SINTA 1–4 maupun jurnal internasional bereputasi Scopus Q1–Q4.",
    capabilities: [
      "Pencarian cerdas 200 Juta+ paper dan open-access repositori dunia",
      "Ekstraksi matriks sintesis literatur otomatis (Author, Method, Result, Gap)",
      "Sudah termasuk Alerin Chat untuk tanya-jawab langsung ke dalam isi paper PDF",
      "Format sitasi instan APA 7th, IEEE, Harvard, Chicago, dan Vancouver",
      "Sinkronisasi satu klik ke Mendeley, Zotero, dan EndNote",
    ],
  },
  skripsi: {
    name: "Alerin Skripsi",
    tag: "Sarjana (S1)",
    desc: "Dirancang spesifik untuk mahasiswa tingkat sarjana yang sedang menyusun Tugas Akhir atau Skripsi sesuai standar buku pedoman kampus di Indonesia.",
    capabilities: [
      "Asistensi Bab 1 hingga Bab 5 terstruktur (Latar Belakang hingga Kesimpulan)",
      "Review metodologi penelitian kualitatif, kuantitatif, dan R&D",
      "Sudah termasuk Alerin Chat interaktif untuk konsultasi rumusan masalah 24/7",
      "Pengecekan keselarasan rumusan masalah, tujuan, dan instrumen riset",
      "Panduan format penulisan, daftar pustaka otomatis, dan lampiran",
    ],
  },
  parafrase: {
    name: "Alerin Parafrase",
    tag: "Humanized AI",
    desc: "Mesin parafrase cerdas berbasis gaya penulisan ilmiah bahasa Indonesia baku (PUEBI) dan Academic English yang meloloskan naskah dari deteksi AI dan Turnitin.",
    capabilities: [
      "Humanized rewriting yang mempertahankan makna asli tanpa distorsi ide",
      "Optimasi lolos Turnitin Similarity Index dan AI Detector kampus",
      "Sudah termasuk Alerin Chat untuk modifikasi kata dan diksi sinonim cepat",
      "Pilihan nada bahasa: Formal Akademik, Ringkas, Luwes, atau Bahasa Baku",
      "Dukungan dokumen penuh hingga 10.000 kata per proses",
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

  // State
  const [currentDuration, setCurrentDuration] = useState<"7d" | "30d" | "1y">("30d");
  const [currentTier, setCurrentTier] = useState<"plus" | "pro">("plus");
  const [openDropdown, setOpenDropdown] = useState<"7d" | "30d" | "1y" | null>(null);
  const [businessModalOpen, setBusinessModalOpen] = useState(false);

  // Header Interactive States (Persis Header Alerin Chat)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileMenuPos, setProfileMenuPos] = useState<{ top: number; right: number } | null>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const [currentAccountPlan, setCurrentAccountPlan] = useState("Paket: Plus");
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
      setUpgradeDropdownOpen(false);
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"qris" | "va" | "ewallet" | "cc">("qris");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [toast, setToast] = useState<string | { title: string; description?: string } | null>(null);

  // Segment Switcher: Individu vs Business
  const [planType, setPlanType] = useState<"individual" | "business">("individual");
  const [bizForm, setBizForm] = useState({
    name: "",
    email: "",
    institution: "",
    purpose: "",
    features: [
      "Alerin Chat",
      "Alerin Jurnal",
      "Alerin Skripsi",
      "Alerin Parafrase",
    ] as string[],
  });
  const [bizSubmitting, setBizSubmitting] = useState(false);
  const [bizConfirmModalOpen, setBizConfirmModalOpen] = useState(false);
  const [bizErrors, setBizErrors] = useState<{
    name?: boolean;
    email?: boolean;
    institution?: boolean;
    purpose?: boolean;
    features?: boolean;
  }>({});

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
        features: [
          "Alerin Chat",
          "Alerin Jurnal",
          "Alerin Skripsi",
          "Alerin Parafrase",
        ],
      });
      showToast("Berhasil mengirim formulir ke admin@alerin.id", "success");
    }, 700);
  };

  const showToast = useCallback(
    (msg: string | { title: string; description?: string }, _type?: string) => {
      setToast(msg);
    },
    []
  );

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
  const handleExecutePayment = () => {
    setIsPaymentProcessing(true);
    setTimeout(() => {
      setIsPaymentProcessing(false);
      setIsCheckoutModalOpen(false);
      setIsSuccessModalOpen(true);
      setCurrentAccountPlan("Paket: Pro");
    }, 1400);
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
              className="h-10 px-4 py-2 rounded-full border border-blue-200/90 bg-blue-50/80 hover:bg-blue-100/70 text-[#155dfc] flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#155dfc" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="text-[#155dfc] text-sm font-semibold leading-5">Upgrade</span>
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
              className="h-[46px] px-4 rounded-full backdrop-blur-md border border-blue-200/90 bg-blue-50/80 hover:bg-blue-100/70 flex items-center gap-2 transition-colors shrink-0 shadow-[0_4px_20px_rgba(21,93,252,0.08)] text-[#155dfc] font-semibold text-sm leading-5 cursor-pointer active:scale-95"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#155dfc" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Upgrade</span>
            </button>

            <div
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full backdrop-blur-md border border-slate-200/85 bg-white/90 shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition-colors"
            >
              <button
                ref={profileBtnRef}
                type="button"
                onClick={() => {
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
                className="flex items-center gap-2.5 pl-0.5 pr-1 text-left hover:opacity-85 transition-opacity cursor-pointer"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs"
                  style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
                >
                  RA
                </div>
                <div className="min-w-0 flex flex-col items-start leading-tight">
                  <p className="text-xs font-semibold whitespace-nowrap text-slate-800">Raka Aditya</p>
                  <span className="mt-0.5 inline-flex items-center gap-1 rounded-full border border-blue-200 bg-white px-2 py-[1px] font-['Inter:Bold'] text-[9.5px] font-bold leading-[13px] whitespace-nowrap text-slate-900 shadow-2xs">
                    Plus
                    <PlusBadgeIcon size={11} />
                  </span>
                </div>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 ml-0.5 shrink-0">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
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
                  showToast("Form saran & laporan siap digunakan.", "info");
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
                  showToast("Pintasan Alerin siap dipasang di layar utama.", "info");
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
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <aside
            className={`fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] z-[160] shadow-2xl flex flex-col py-5 px-4 overflow-hidden ${
              isDarkTheme ? "bg-[#0f172a] border-r border-slate-800 text-white" : "bg-white text-slate-900"
            }`}
            style={{ animation: "drawerSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)" }}
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
                    ? "bg-[#155dfc] text-white shadow-sm shadow-[#155dfc]/25"
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
                      ? `font-bold bg-white ${currentTier === "pro" ? "text-slate-900" : "text-[#155dfc]"} shadow-sm`
                      : "font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  <span>7 Hari</span>
                  {currentDuration === "7d" && (
                    <span
                      className={`text-[9.5px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                        currentTier === "pro"
                          ? "bg-slate-100 text-slate-900 border border-slate-300"
                          : "bg-blue-100 text-[#155dfc]"
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
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#155dfc]">
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
                          stroke="#155dfc"
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
                      ? `font-bold bg-white ${currentTier === "pro" ? "text-slate-900" : "text-[#155dfc]"} shadow-sm`
                      : "font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  <span>30 Hari</span>
                  {currentDuration === "30d" && (
                    <span
                      className={`text-[9.5px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                        currentTier === "pro"
                          ? "bg-slate-100 text-slate-900 border border-slate-300"
                          : "bg-blue-100 text-[#155dfc]"
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
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#155dfc]">
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
                          stroke="#155dfc"
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
                      ? `font-bold bg-white ${currentTier === "pro" ? "text-slate-900" : "text-[#155dfc]"} shadow-sm`
                      : "font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  <span>1 Tahun</span>
                  {currentDuration === "1y" && (
                    <span
                      className={`text-[9.5px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                        currentTier === "pro"
                          ? "bg-slate-100 text-slate-900 border border-slate-300"
                          : "bg-blue-100 text-[#155dfc]"
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
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#155dfc]">
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
                          stroke="#155dfc"
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
                <div className="hidden sm:flex w-10 h-10 rounded-xl bg-[#155dfc] text-white items-center justify-center shrink-0 shadow-sm">
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
                  <strong className="text-[#155dfc] font-bold">{selectedFeatures.size}</strong>
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
                        ? "border-2 border-[#155dfc] ring-2 ring-[#155dfc]/10 shadow-card bg-blue-50/10"
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
                                ? "bg-[#155dfc] text-white border-2 border-[#155dfc] shadow-xs"
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
                            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#155dfc] transition-colors tracking-tight truncate">
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
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#155dfc] hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-sm shadow-blue-500/20 transition-all shrink-0 active:scale-95 cursor-pointer"
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
                Punya Kode Promo / Voucher?
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
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#155dfc] tracking-tight">
                      {formatRupiah(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout CTA Button */}
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full py-4 px-6 bg-[#155dfc] hover:bg-[#124bcf] text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#155dfc]/25 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] cursor-pointer"
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
                <span className="text-[10px] font-bold text-[#155dfc] bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200">
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
              className="px-5 py-3 bg-[#155dfc] hover:bg-[#124bcf] text-white font-bold text-xs rounded-xl shadow-md shadow-[#155dfc]/25 transition-all shrink-0 flex items-center gap-1.5 active:scale-95 cursor-pointer"
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
                            ? "bg-blue-50/90 border-[#155dfc] text-blue-900 shadow-sm ring-1 ring-[#155dfc]/30"
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
                              ? "bg-[#155dfc] text-white border-2 border-[#155dfc] shadow-xs"
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
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#155dfc] flex items-center justify-center shrink-0">
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
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-2xl bg-[#155dfc] hover:bg-[#124bcf] active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md shadow-[#155dfc]/25 cursor-pointer disabled:opacity-75"
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
              className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-[gemini-fade-in_0.2s_ease-out]"
              onClick={() => setBizConfirmModalOpen(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border border-slate-200 animate-[gemini-zoom-in_0.15s_ease-out]"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#155dfc] border border-blue-200 mx-auto flex items-center justify-center mb-4 shadow-sm">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#155dfc] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Konfirmasi Pengiriman
                </span>

                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-3 leading-snug">
                  Berhasil mengirim. Mohon ditunggu maksimal 3x24 jam
                </h3>

                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  Data formulir Anda telah otomatis dikirim ke email{" "}
                  <strong className="text-slate-900 font-semibold">admin@alerin.id</strong>. Tim Alerin akan segera meninjau dan menghubungi Anda kembali.
                </p>

                <button
                  type="button"
                  onClick={() => setBizConfirmModalOpen(false)}
                  className="w-full mt-6 py-3.5 px-5 bg-[#155dfc] hover:bg-[#124bcf] active:scale-95 text-white font-bold text-sm rounded-xl shadow-md shadow-[#155dfc]/25 transition-all cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* STEP 2: CHECKOUT & PAYMENT MODAL */}
      {isCheckoutModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 lg:p-8 flex items-center justify-center animate-[gemini-fade-in_0.2s_ease-out]"
          onClick={() => setIsCheckoutModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-[gemini-zoom-in_0.15s_ease-out]"
          >
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white sm:bg-transparent border border-slate-200/80 sm:border-transparent hover:bg-slate-200/70 text-slate-600 flex items-center justify-center transition-colors shrink-0 cursor-pointer shadow-2xs sm:shadow-none"
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
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                      Pembayaran
                    </h3>
                    <span className="text-[10px] font-bold bg-blue-50 text-[#155dfc] px-2 py-0.5 rounded-full border border-blue-200 shrink-0">
                      2 dari 2
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 truncate sm:whitespace-normal">
                    Konfirmasi detail pesanan dan pilih opsi pembayaran Anda
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/70 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0 ml-2 cursor-pointer"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
              {/* Left Sub-column: Detail Item & Diskon */}
              <div className="md:col-span-6 space-y-3.5 sm:space-y-4">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                  Rincian Akses Alerin
                </h4>

                <div className="bg-slate-50 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 space-y-3">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/60">
                    <span className="text-slate-500">Durasi Langganan:</span>
                    <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                      {getDurationReadable(currentDuration, currentTier)}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="text-slate-500 block font-medium">Fitur yang diaktifkan:</span>
                    <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {Array.from(selectedFeatures).map((key) => {
                        const item = PRICING_DATABASE[key];
                        if (!item) return null;
                        return (
                          <li
                            key={key}
                            className="flex justify-between items-center text-slate-700"
                          >
                            <span className="flex items-center gap-1.5 font-medium truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#155dfc] shrink-0" />
                              {item.name}
                            </span>
                            <span className="font-semibold shrink-0 ml-2">
                              {formatRupiah(getPrice(key))}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Discount detail in modal */}
                  <div className="pt-2 border-t border-slate-200/60 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal Normal:</span>
                      <span>{formatRupiah(subtotal)}</span>
                    </div>
                    {bundlingDiscount > 0 && (
                      <div className="flex justify-between text-[#155dfc] font-semibold">
                        <span>Potongan Bundling Hemat:</span>
                        <span>-{formatRupiah(bundlingDiscount)}</span>
                      </div>
                    )}
                    {appliedVoucher && voucherDiscount > 0 && (
                      <div className="flex justify-between text-[#155dfc] font-semibold">
                        <span>Potongan Voucher:</span>
                        <span>-{formatRupiah(voucherDiscount)}</span>
                      </div>
                    )}
                  </div>

                  {/* Grand total in modal */}
                  <div className="pt-3 border-t-2 border-dashed border-slate-200 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-700">Total Akhir:</span>
                    <span className="text-lg sm:text-xl font-black text-[#155dfc]">
                      {formatRupiah(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Sub-column: Metode Pembayaran */}
              <div className="md:col-span-6 space-y-3.5 sm:space-y-4">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pilih Metode Pembayaran
                </h4>

                <div className="space-y-2 sm:space-y-2.5 text-xs">
                  {/* Method 1: QRIS Instant (Default) */}
                  <label
                    onClick={() => setSelectedPaymentMethod("qris")}
                    className={`payment-method-card flex items-center justify-between p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all ${
                      selectedPaymentMethod === "qris"
                        ? "border-2 border-[#155dfc] bg-blue-50/40 shadow-xs"
                        : "border border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          selectedPaymentMethod === "qris"
                            ? "border-[#155dfc] bg-[#155dfc]"
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
                    <span className="text-[10px] font-extrabold uppercase bg-blue-100 text-[#155dfc] px-2 py-0.5 rounded shrink-0 ml-2">
                      Instan
                    </span>
                  </label>

                  {/* Method 2: Virtual Account */}
                  <label
                    onClick={() => setSelectedPaymentMethod("va")}
                    className={`payment-method-card flex items-center justify-between p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all ${
                      selectedPaymentMethod === "va"
                        ? "border-2 border-[#155dfc] bg-blue-50/40 shadow-xs"
                        : "border border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          selectedPaymentMethod === "va"
                            ? "border-[#155dfc] bg-[#155dfc]"
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
                          BCA, Mandiri, BNI, BRI, Permata
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 shrink-0 ml-2">VA</span>
                  </label>

                  {/* Method 3: E-Wallet Langsung */}
                  <label
                    onClick={() => setSelectedPaymentMethod("ewallet")}
                    className={`payment-method-card flex items-center justify-between p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all ${
                      selectedPaymentMethod === "ewallet"
                        ? "border-2 border-[#155dfc] bg-blue-50/40 shadow-xs"
                        : "border border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          selectedPaymentMethod === "ewallet"
                            ? "border-[#155dfc] bg-[#155dfc]"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {selectedPaymentMethod === "ewallet" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate">E-Wallet Direct</span>
                        <span className="text-[11px] text-slate-500 block">
                          DANA, GoPay Saldo, OVO Direct
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 shrink-0 ml-2">App</span>
                  </label>

                  {/* Method 4: Kartu Kredit / Debit Online */}
                  <label
                    onClick={() => setSelectedPaymentMethod("cc")}
                    className={`payment-method-card flex items-center justify-between p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all ${
                      selectedPaymentMethod === "cc"
                        ? "border-2 border-[#155dfc] bg-blue-50/40 shadow-xs"
                        : "border border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          selectedPaymentMethod === "cc"
                            ? "border-[#155dfc] bg-[#155dfc]"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {selectedPaymentMethod === "cc" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate">
                          Kartu Kredit / Debit Online
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Visa, Mastercard, JCB (3D Secure)
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 shrink-0 ml-2">Card</span>
                  </label>
                </div>

                {/* Simulation Pay Button */}
                <div className="pt-2 sm:pt-3">
                  <button
                    type="button"
                    disabled={isPaymentProcessing}
                    onClick={handleExecutePayment}
                    className="w-full py-3.5 px-6 bg-[#155dfc] hover:bg-[#124bcf] active:scale-[0.98] text-white font-bold text-sm rounded-xl sm:rounded-2xl shadow-lg shadow-[#155dfc]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
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
                  <p className="text-[11px] text-center text-slate-400 mt-2.5 pb-2 leading-relaxed">
                    Dengan mengklik tombol, Anda menyetujui Ketentuan Layanan & Privasi Alerin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRANSACTION SUCCESS MODAL */}
      {isSuccessModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center animate-[gemini-fade-in_0.2s_ease-out]"
          onClick={() => setIsSuccessModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-200 animate-[gemini-zoom-in_0.15s_ease-out]"
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-600 mx-auto flex items-center justify-center mb-4 shadow-sm">
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
              Pembayaran Berhasil Diverifikasi
            </span>

            <h3 className="text-xl font-extrabold text-slate-900 mt-3">
              Selamat Datang di Alerin Pro!
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Fitur yang Anda pilih telah aktif di akun Anda. Faktur resmi telah dikirim ke{" "}
              <span className="font-semibold text-slate-800">reyhan@universitas.ac.id</span>.
            </p>

            <div className="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">ID Referensi:</span>
                <span className="font-mono font-bold text-slate-800">ALR-2026-8891B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Paket Baru:</span>
                <span className="font-bold text-brand-600">
                  {selectedFeatures.size === 4
                    ? "Alerin Complete Suite (4 Fitur)"
                    : `Alerin Bundling (${selectedFeatures.size} Fitur)`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Masa Berlaku:</span>
                <span className="font-bold text-slate-800">
                  Aktif selama {getDurationReadable(currentDuration, currentTier)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSuccessModalOpen(false);
                navigate("/");
              }}
              className="w-full mt-6 py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Buka Dashboard Alerin
            </button>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL PAKET FITUR ALERIN */}
      {activeModalFeatureKey && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-[gemini-fade-in_0.2s_ease-out]"
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
                className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-[gemini-zoom-in_0.15s_ease-out]"
              >
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
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
                      <h3 className="text-base font-extrabold text-slate-900">{detail.name}</h3>
                      <p className="text-xs font-bold text-brand-600 mt-0.5">
                        {formatRupiah(getPrice(activeModalFeatureKey || ""))} /{" "}
                        {getDurationReadable(currentDuration, currentTier)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModalFeatureKey(null)}
                    className="w-8 h-8 rounded-full bg-slate-200/60 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Deskripsi & Ruang Lingkup
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {detail.desc}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Kapabilitas & Fitur Utama
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {detail.capabilities.map((cap) => (
                        <li key={cap} className="flex items-start gap-2 text-slate-600">
                          <svg
                            className="w-4 h-4 text-brand-600 shrink-0 mt-0.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModalFeatureKey(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      toggleFeature(activeModalFeatureKey);
                      setActiveModalFeatureKey(null);
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        : "bg-[#155dfc] hover:bg-[#124bcf] text-white shadow-md shadow-[#155dfc]/25"
                    }`}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{isSelected ? "Batal Pilih Fitur" : "Pilih Fitur Ini"}</span>
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
