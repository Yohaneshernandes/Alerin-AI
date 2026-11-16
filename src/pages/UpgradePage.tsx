import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router";
import PlusBadgeIcon from "@/components/PlusBadgeIcon";

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
  tesis: {
    name: "Alerin Tesis",
    tag: "Magister (S2)",
    desc: "Dikhususkan untuk mahasiswa pascasarjana S2 yang membutuhkan penguatan sintesis teoritis, analisis data kuantitatif/kualitatif mendalam, dan pembahasan empiris.",
    capabilities: [
      "Bimbingan kerangka konseptual teoritis dan model hipotesis",
      "Asistensi analisis data riset tingkat lanjut (SEM PLS, SPSS, AMOS, NVivo)",
      "Sudah termasuk Alerin Chat interaktif untuk diskusi temuan lapangan",
      "Formulasi interpretasi data statistik dan uji validitas-reliabilitas",
      "Penyusunan implikasi teoritis dan praktis berbobot magister",
    ],
  },
  disertasi: {
    name: "Alerin Disertasi",
    tag: "Doktoral (S3)",
    desc: "Tingkat tertinggi untuk kandidat doktor S3 yang membutuhkan formulasi State-of-the-Art, novelty ilmiah, dan kontribusi orisinal pada kebaruan ilmu.",
    capabilities: [
      "Eksplorasi dan formulasi Novelty (Kebaruan Ilmiah) terukur",
      "State-of-the-Art gap analysis dari literatur global bereputasi tinggi",
      "Sudah termasuk Alerin Chat interaktif untuk asistensi filosofi keilmuan",
      "Kritik metodologis mendalam dan ketahanan uji sidang promosi doktor",
      "Rekomendasi pemetaan kontribusi epistemologis bagi dunia akademik",
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
  matakuliah: {
    name: "Alerin Mata Kuliah",
    tag: "Silabus & Konsep",
    desc: "Asisten belajar semesteran yang memecah materi perkuliahan yang rumit menjadi konsep sederhana yang mudah dipahami per pertemuan silabus.",
    capabilities: [
      "Rangkuman silabus dan bahan ajar kuliah mingguan secara otomatis",
      "Simulasi pemahaman materi dengan studi kasus kontekstual",
      "Sudah termasuk Alerin Chat untuk tutor pribadi sebelum UTS dan UAS",
      "Generator bank soal latihan lengkap dengan pembahasan langkah-demi-langkah",
      "Mind-mapping konsep kunci per modul mata kuliah",
    ],
  },
  tugaskuliah: {
    name: "Alerin Tugas Kuliah",
    tag: "Paper & Proyek",
    desc: "Membantu pengerjaan tugas rutin mahasiswa, mulai dari esai mingguan, makalah kelompok, studi kasus korporat, hingga draf slide presentasi.",
    capabilities: [
      "Penyusunan outline terstruktur untuk esai, resensi, dan paper kuliah",
      "Asistensi analisis studi kasus dan formulasi solusi pemecahan masalah",
      "Sudah termasuk Alerin Chat untuk brainstorming ide proyek kelompok",
      "Penyusunan poin-poin utama untuk slide presentasi PowerPoint",
      "Pengecekan ejaan dan kerapian format laporan tugas kuliah",
    ],
  },
};

// Database harga 7 fitur Alerin per durasi
const PRICING_DATABASE: Record<
  string,
  {
    name: string;
    tag: string;
    prices: Record<"7d" | "30d" | "1y", number>;
    original_yearly: number;
    description: string;
    badges: string[];
  }
> = {
  skripsi: {
    name: "Alerin Skripsi",
    tag: "Sarjana (S1)",
    prices: {
      "7d": 35000,
      "30d": 79000,
      "1y": 758000,
    },
    original_yearly: 948000,
    description:
      "Asisten komprehensif Bab 1–5, evaluasi metodologi, cek keselarasan rumusan masalah, dan template buku panduan kampus.",
    badges: ["Review Metodologi", "Format Bab 1-5"],
  },
  tesis: {
    name: "Alerin Tesis",
    tag: "Magister (S2)",
    prices: {
      "7d": 39000,
      "30d": 89000,
      "1y": 854000,
    },
    original_yearly: 1068000,
    description:
      "Analisis data riset tingkat lanjut (SEM, SPSS, NVivo), kerangka konseptual teoritis, serta pembahasan temuan empiris.",
    badges: ["Analisis Data Riset", "Diskusi Empiris S2"],
  },
  disertasi: {
    name: "Alerin Disertasi",
    tag: "Doktoral (S3)",
    prices: {
      "7d": 49000,
      "30d": 109000,
      "1y": 1046000,
    },
    original_yearly: 1308000,
    description:
      "Formulasi novelty ilmiah, evaluasi State-of-the-Art gap analysis, dan penajaman kontribusi teoritis doktoral.",
    badges: ["Novelty Formulator", "Gap Analysis S3"],
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
    description:
      "Parafrase multi-gaya akademik, penurun skor kesamaan Turnitin, dan optimasi struktur kalimat baku PUEBI & Formal English.",
    badges: ["Bypass AI Detector", "Bebas Plagiasi"],
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
    description:
      "Pencarian 200M+ literatur global, sintesis matriks penelitian otomatis, sitasi instan APA 7, IEEE, dan ekspor Mendeley.",
    badges: ["Akses 200M+ Paper", "Ekspor Sitasi Instan"],
  },
  matakuliah: {
    name: "Alerin Mata Kuliah",
    tag: "Silabus & Konsep",
    prices: {
      "7d": 25000,
      "30d": 59000,
      "1y": 566000,
    },
    original_yearly: 708000,
    description:
      "Pemecahan materi kuliah rumit per modul, rangkuman silabus, bank soal UTS/UAS, dan simulasi pemahaman materi.",
    badges: ["Rangkuman Silabus", "Bank Soal & Quiz"],
  },
  tugaskuliah: {
    name: "Alerin Tugas Kuliah",
    tag: "Paper & Proyek",
    prices: {
      "7d": 25000,
      "30d": 59000,
      "1y": 566000,
    },
    original_yearly: 708000,
    description:
      "Pembuatan outline esai, studi kasus komprehensif, penyusunan paper kelompok, dan pembuatan ringkasan slide presentasi.",
    badges: ["Asisten Esai & Paper", "Studi Kasus Cepat"],
  },
};

const FEATURE_KEYS = [
  "skripsi",
  "tesis",
  "disertasi",
  "parafrase",
  "jurnal",
  "matakuliah",
  "tugaskuliah",
];

function formatRupiah(num: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

function getDurationReadable(dur: "7d" | "30d" | "1y"): string {
  if (dur === "7d") return "7 Hari";
  if (dur === "30d") return "30 Hari";
  if (dur === "1y") return "1 Tahun";
  return dur;
}

export default function UpgradePage() {
  const navigate = useNavigate();

  // State
  const [currentDuration, setCurrentDuration] = useState<"7d" | "30d" | "1y">("30d");
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

  const [toast, setToast] = useState<{
    text: string;
    type: "info" | "success" | "warning" | "error";
  } | null>(null);

  const showToast = (text: string, type: "info" | "success" | "warning" | "error" = "info") => {
    setToast({ text, type });
    window.setTimeout(() => {
      setToast(null);
    }, 3000);
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
      const item = PRICING_DATABASE[key];
      const price = item.prices[currentDuration];
      if (selectedFeatures.has(key)) {
        sub += price;
        orig += currentDuration === "1y" ? item.original_yearly : price;
      }
    });

    const count = selectedFeatures.size;
    let rate = 0;
    let label = "Tidak Ada Diskon";

    if (count === 2) {
      rate = 0.15;
      label = "Diskon 15%";
    } else if (count >= 3 && count <= 4) {
      rate = 0.25;
      label = "Hemat 25%";
    } else if (count >= 5 && count <= 6) {
      rate = 0.35;
      label = "Super Bundling 35%";
    } else if (count === 7) {
      rate = 0.45;
      label = "Paket Komplit 45%";
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
        "Pilih 2 fitur untuk diskon 15%, 3-4 fitur hemat 25%, atau ambil seluruh fitur hemat hingga 45%.";
    } else if (count === 2) {
      infoTitle = "Bundling 2 Fitur Aktif";
      infoBadge = "Diskon Bundling 15%";
      infoBadgeClass = "bg-brand-100 text-brand-700 border border-brand-200";
      infoDesc = "Diskon 15% aktif! Tambah 1 fitur lagi untuk membuka diskon 25%.";
    } else if (count >= 3 && count <= 4) {
      infoTitle = `Bundling ${count} Fitur Aktif`;
      infoBadge = "Diskon Hemat 25%";
      infoBadgeClass = "bg-brand-100 text-brand-700 border border-brand-200";
      infoDesc = "Potongan 25% langsung dipotong dari total tagihan Anda.";
    } else if (count >= 5 && count <= 6) {
      infoTitle = `Super Bundling ${count} Fitur`;
      infoBadge = "Super Hemat 35%";
      infoBadgeClass = "bg-brand-600 text-white shadow-sm";
      infoDesc = "Hampir semua fitur terbuka dengan diskon super hemat 35%!";
    } else {
      infoTitle = "Akses Komplit Semua Fitur Alerin";
      infoBadge = "Diskon Maksimal 45%";
      infoBadgeClass = "bg-brand-700 text-white shadow-sm";
      infoDesc =
        "Paket all-in-one terlengkap untuk riset, penulisan, jurnal, dan perkuliahan!";
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
      showToast(`Voucher ${code} berhasil diterapkan! (Hemat Rp 25.000)`, "success");
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
    currentDuration === "7d" ? "/ 7 hari" : currentDuration === "30d" ? "/ 30 hari" : "/ tahun";

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased flex flex-col selection:bg-brand-100 selection:text-brand-900"
      onClick={() => {
        setPlanDropdownOpen(false);
        setProfileDropdownOpen(false);
      }}
    >
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-auto animate-[gemini-fade-in_0.2s_ease-out]">
          <div
            className={`px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 ${
              toast.type === "success"
                ? "bg-brand-600 text-white"
                : toast.type === "error"
                ? "bg-red-600 text-white"
                : toast.type === "warning"
                ? "bg-amber-600 text-white"
                : "bg-slate-900 text-white"
            }`}
          >
            <span>{toast.text}</span>
          </div>
        </div>
      )}

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
              onClick={() => navigate("/")}
              aria-label="Kembali ke chat"
              className="size-10 rounded-full border border-slate-200/90 bg-white/70 backdrop-blur-sm flex flex-col justify-center items-center gap-1 hover:bg-slate-50 active:scale-95 transition-all shrink-0 shadow-xs cursor-pointer"
              title="Kembali ke Obrolan"
            >
              <div className="w-4 h-0.5 bg-slate-800 rounded-full" />
              <div className="w-4 h-0.5 bg-slate-800 rounded-full" />
            </button>
            <div
              className="h-10 px-4 py-2 rounded-full border border-blue-200/90 bg-blue-50/80 backdrop-blur-sm flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="text-blue-600 text-sm font-semibold leading-5">Upgrade</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="Notifikasi"
              className="size-10 rounded-full border border-slate-200/90 bg-white/70 backdrop-blur-sm flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all relative shrink-0 shadow-xs cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="Profil pengguna"
              className="size-9 rounded-full overflow-hidden shrink-0 hover:opacity-90 active:scale-95 transition-all ring-1 ring-slate-200/90 bg-sky-100 shadow-xs cursor-pointer"
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
            <div
              className="h-[46px] px-4 rounded-full backdrop-blur-md border border-blue-200/90 bg-blue-50/80 flex items-center gap-1.5 transition-colors shrink-0 shadow-[0_4px_20px_rgba(37,99,235,0.08)] text-blue-600 font-semibold text-sm leading-5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Upgrade</span>
            </div>

            <div
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full backdrop-blur-md border border-slate-200/85 bg-white/90 shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition-colors"
            >
              <button
                type="button"
                onClick={() => navigate("/")}
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
                onClick={() => navigate("/")}
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

      {/* DURATION SELECTOR SECTION */}
      <section className="relative pt-6 pb-4 sm:pt-8 sm:pb-6 bg-gradient-to-b from-white via-white to-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Upgrade Paket Alerin
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto">
              Akses semua fitur penelitian, skripsi, jurnal, dan perkuliahan dalam satu platform cerdas.
            </p>
          </div>

          {/* DURATION SELECTOR (Tabs/Pills) */}
          <div className="flex justify-center">
            <div
              className="bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 inline-flex shadow-inner max-w-full overflow-x-auto no-scrollbar gap-1"
              role="tablist"
            >
              {/* Option: 7 Hari */}
              <button
                type="button"
                onClick={() => {
                  setCurrentDuration("7d");
                  showToast("Durasi diubah ke: 7 Hari", "info");
                }}
                className={`duration-btn relative px-5 sm:px-8 py-2.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                  currentDuration === "7d"
                    ? "font-bold bg-white text-blue-600 shadow-sm"
                    : "font-semibold text-slate-600 hover:text-slate-900"
                }`}
              >
                7 Hari
              </button>

              {/* Option: 30 Hari */}
              <button
                type="button"
                onClick={() => {
                  setCurrentDuration("30d");
                  showToast("Durasi diubah ke: 30 Hari", "info");
                }}
                className={`duration-btn relative px-5 sm:px-8 py-2.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                  currentDuration === "30d"
                    ? "font-bold bg-white text-blue-600 shadow-sm"
                    : "font-semibold text-slate-600 hover:text-slate-900"
                }`}
              >
                30 Hari
              </button>

              {/* Option: 1 Tahun */}
              <button
                type="button"
                onClick={() => {
                  setCurrentDuration("1y");
                  showToast("Durasi diubah ke: 1 Tahun", "info");
                }}
                className={`duration-btn relative px-5 sm:px-8 py-2.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                  currentDuration === "1y"
                    ? "font-bold bg-white text-blue-600 shadow-sm"
                    : "font-semibold text-slate-600 hover:text-slate-900"
                }`}
              >
                1 Tahun
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT: 2-COLUMN LAYOUT */}
      <main id="configurator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 lg:pb-16 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: FEATURE SELECTION & PROMO */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* BUNDLING PROMO BANNER */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 shadow-subtle transition-all">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
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
            <div className="flex items-center justify-between pt-1">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Pilih Fitur yang Diinginkan
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Pilih minimal 1 fitur atau kombinasikan beberapa fitur sesuai kebutuhan akademik Anda.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                Terpilih: <strong className="text-brand-600">{selectedFeatures.size}</strong>/7
              </span>
            </div>

            {/* 7 FEATURE CARDS: 2-COLUMN GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {FEATURE_KEYS.map((key) => {
                const item = PRICING_DATABASE[key];
                const isSelected = selectedFeatures.has(key);
                const price = item.prices[currentDuration];
                const isSingleSpan = key === "tugaskuliah";

                return (
                  <div
                    key={key}
                    onClick={() => toggleFeature(key)}
                    className={`feature-card cursor-pointer group relative bg-white rounded-2xl p-4 transition-all flex flex-col justify-between ${
                      isSingleSpan ? "sm:col-span-2 md:col-span-1" : ""
                    } ${
                      isSelected
                        ? "border-2 border-brand-600 ring-2 ring-brand-500/10 shadow-card"
                        : "border-2 border-slate-200 shadow-subtle hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shadow-sm shrink-0 ${
                              isSelected
                                ? "bg-brand-600 text-white"
                                : "border-2 border-slate-300 bg-white text-transparent"
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
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors tracking-tight truncate">
                              {item.name}
                            </h3>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {currentDuration === "1y" && (
                            <span className="text-[11px] text-slate-400 line-through mr-1">
                              {formatRupiah(item.original_yearly)}
                            </span>
                          )}
                          <span className="text-sm font-extrabold text-slate-900">
                            {formatRupiah(price)}
                          </span>
                          <span className="text-[10px] text-slate-500 block">{durationLabel}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Redaksi: Sudah termasuk Alerin Chat */}
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-sm">
                        <svg
                          className="w-3.5 h-3.5 text-brand-600 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span>Sudah termasuk Alerin Chat</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5 text-[10px] font-medium text-slate-500">
                        {item.badges.map((b) => (
                          <span key={b} className="bg-slate-100 px-2 py-0.5 rounded">
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
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-brand-600 hover:bg-brand-700 px-3 py-1.5 rounded-lg shadow-sm transition-all shrink-0 active:scale-95 cursor-pointer"
                      >
                        <span>Detail Paket</span>
                        <svg
                          className="w-3 h-3 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
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
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-subtle">
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
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm active:scale-95 shrink-0 cursor-pointer"
                >
                  Terapkan
                </button>
              </div>

              {/* Applied Voucher Notification / Hints */}
              <div className="mt-2 text-xs flex items-center justify-between">
                {appliedVoucher ? (
                  <span className="text-brand-600 font-bold flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Kupon {appliedVoucher.code} berhasil dipasang (Hemat Rp 25.000)
                  </span>
                ) : (
                  <span className="text-slate-400">
                    Gunakan kode{" "}
                    <strong
                      className="text-brand-600 cursor-pointer underline"
                      onClick={() => {
                        setVoucherInput("ALLERIHEMAT");
                        setAppliedVoucher({
                          code: "ALLERIHEMAT",
                          amount: 25000,
                          type: "fixed",
                        });
                        showToast("Voucher ALLERIHEMAT berhasil diterapkan!", "success");
                      }}
                    >
                      ALLERIHEMAT
                    </strong>{" "}
                    untuk potongan Rp 25.000 ekstra.
                  </span>
                )}
                {appliedVoucher && (
                  <button
                    type="button"
                    onClick={handleRemoveVoucher}
                    className="text-xs text-red-500 hover:underline cursor-pointer"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Ringkasan Paket</h3>
                  <p className="text-xs text-slate-500">Konfigurasi langganan Alerin</p>
                </div>
                <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                  {getDurationReadable(currentDuration)}
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
                          {formatRupiah(item.prices[currentDuration])}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
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
              <div className="pt-4 border-t-2 border-dashed border-slate-200">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Total Biaya Pembayaran</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      Sudah termasuk seluruh PPN
                    </span>
                  </div>
                  <div className="text-right">
                    {(bundlingDiscount > 0 || voucherDiscount > 0 || currentDuration === "1y") && (
                      <span className="text-xs text-slate-400 line-through block">
                        {formatRupiah(currentDuration === "1y" ? originalTotal : subtotal)}
                      </span>
                    )}
                    <span className="text-2xl sm:text-3xl font-extrabold text-brand-700 tracking-tight">
                      {formatRupiah(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout CTA Button */}
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full py-4 px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] cursor-pointer"
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

      {/* MOBILE FLOATING BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-sticky">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded border border-brand-200">
                {selectedFeatures.size} Fitur
              </span>
              <span className="text-[11px] text-slate-500">
                {getDurationReadable(currentDuration)}
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
            className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-600/25 transition-all shrink-0 flex items-center gap-1.5 active:scale-95 cursor-pointer"
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

      {/* STEP 2: CHECKOUT & PAYMENT MODAL */}
      {isCheckoutModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 lg:p-8 flex items-center justify-center animate-[gemini-fade-in_0.2s_ease-out]"
          onClick={() => setIsCheckoutModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-[gemini-zoom-in_0.15s_ease-out]"
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-200/70 text-slate-500 transition-colors cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900">Ringkasan Pembayaran</h3>
                    <span className="text-[10px] font-bold bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-200">
                      Step 2 dari 2
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Konfirmasi detail pesanan dan pilih opsi pembayaran Anda
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/60 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Sub-column: Detail Item & Diskon */}
              <div className="md:col-span-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Rincian Akses Alerin
                </h4>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/60">
                    <span className="text-slate-500">Durasi Langganan:</span>
                    <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                      {getDurationReadable(currentDuration)}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="text-slate-500 block font-medium">Fitur yang diaktifkan:</span>
                    <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {Array.from(selectedFeatures).map((key) => {
                        const item = PRICING_DATABASE[key];
                        return (
                          <li
                            key={key}
                            className="flex justify-between items-center text-slate-700"
                          >
                            <span className="flex items-center gap-1.5 font-medium truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" />
                              {item.name}
                            </span>
                            <span className="font-semibold shrink-0 ml-2">
                              {formatRupiah(item.prices[currentDuration])}
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
                      <div className="flex justify-between text-brand-600 font-semibold">
                        <span>Potongan Bundling Hemat:</span>
                        <span>-{formatRupiah(bundlingDiscount)}</span>
                      </div>
                    )}
                    {appliedVoucher && voucherDiscount > 0 && (
                      <div className="flex justify-between text-brand-600 font-semibold">
                        <span>Potongan Voucher:</span>
                        <span>-{formatRupiah(voucherDiscount)}</span>
                      </div>
                    )}
                  </div>

                  {/* Grand total in modal */}
                  <div className="pt-3 border-t-2 border-dashed border-slate-200 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-700">Total Akhir:</span>
                    <span className="text-xl font-black text-brand-700">
                      {formatRupiah(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Account recipient info */}
                <div className="p-3 bg-brand-50/50 rounded-xl border border-brand-100 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs"
                    style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
                  >
                    RA
                  </div>
                  <div className="text-xs min-w-0">
                    <p className="font-bold text-slate-800 truncate">
                      Raka Aditya (Akun Utama)
                    </p>
                    <p className="text-slate-500 truncate text-[11px]">
                      rakaaditya@gmail.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Sub-column: Metode Pembayaran */}
              <div className="md:col-span-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pilih Metode Pembayaran
                </h4>

                <div className="space-y-2.5 text-xs">
                  {/* Method 1: QRIS Instant (Default) */}
                  <label
                    onClick={() => setSelectedPaymentMethod("qris")}
                    className={`payment-method-card flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all ${
                      selectedPaymentMethod === "qris"
                        ? "border-2 border-brand-600 bg-brand-50/30"
                        : "border border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        value="qris"
                        checked={selectedPaymentMethod === "qris"}
                        onChange={() => setSelectedPaymentMethod("qris")}
                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">
                          QRIS (GoPay, OVO, ShopeePay, BCA)
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Scan cepat, verifikasi otomatis 5 detik
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase bg-brand-100 text-brand-700 px-2 py-0.5 rounded">
                      Instan
                    </span>
                  </label>

                  {/* Method 2: Virtual Account */}
                  <label
                    onClick={() => setSelectedPaymentMethod("va")}
                    className={`payment-method-card flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all ${
                      selectedPaymentMethod === "va"
                        ? "border-2 border-brand-600 bg-brand-50/30"
                        : "border border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        value="va"
                        checked={selectedPaymentMethod === "va"}
                        onChange={() => setSelectedPaymentMethod("va")}
                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">
                          Virtual Account (Bank Transfer)
                        </span>
                        <span className="text-[11px] text-slate-500">
                          BCA, Mandiri, BNI, BRI, Permata
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">VA</span>
                  </label>

                  {/* Method 3: E-Wallet Langsung */}
                  <label
                    onClick={() => setSelectedPaymentMethod("ewallet")}
                    className={`payment-method-card flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all ${
                      selectedPaymentMethod === "ewallet"
                        ? "border-2 border-brand-600 bg-brand-50/30"
                        : "border border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        value="ewallet"
                        checked={selectedPaymentMethod === "ewallet"}
                        onChange={() => setSelectedPaymentMethod("ewallet")}
                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">E-Wallet Direct</span>
                        <span className="text-[11px] text-slate-500">
                          DANA, GoPay Saldo, OVO Direct
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">App</span>
                  </label>

                  {/* Method 4: Kartu Kredit / Debit Online */}
                  <label
                    onClick={() => setSelectedPaymentMethod("cc")}
                    className={`payment-method-card flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all ${
                      selectedPaymentMethod === "cc"
                        ? "border-2 border-brand-600 bg-brand-50/30"
                        : "border border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        value="cc"
                        checked={selectedPaymentMethod === "cc"}
                        onChange={() => setSelectedPaymentMethod("cc")}
                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">
                          Kartu Kredit / Debit Online
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Visa, Mastercard, JCB (3D Secure)
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">Card</span>
                  </label>
                </div>

                {/* Simulation Pay Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isPaymentProcessing}
                    onClick={handleExecutePayment}
                    className="w-full py-3.5 px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer disabled:opacity-75"
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
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Bayar Sekarang ({formatRupiah(grandTotal)})</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-400 mt-2">
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
                  {selectedFeatures.size === 7
                    ? "Alerin Complete Suite (7 Fitur)"
                    : `Alerin Bundling (${selectedFeatures.size} Fitur)`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Masa Berlaku:</span>
                <span className="font-bold text-slate-800">
                  Aktif selama {getDurationReadable(currentDuration)}
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
                    <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold shadow-sm">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900">{detail.name}</h3>
                        <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                          {detail.tag}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-brand-600 mt-0.5">
                        {formatRupiah(pricing.prices[currentDuration])} /{" "}
                        {getDurationReadable(currentDuration)}
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
                  {/* Alerin Chat Highlight Box */}
                  <div className="p-3.5 rounded-2xl bg-brand-50 border border-brand-200 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-brand-900 block">
                        Sudah Termasuk Alerin Chat Induk
                      </span>
                      <span className="text-[11px] text-brand-700">
                        AI chat akademis interaktif tanpa batas untuk diskusi materi & asistensi
                        penulisan real-time.
                      </span>
                    </div>
                  </div>

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
                        : "bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20"
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
