import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FEATURES = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    title: "Parafrase Online",
    description: "Ubah kalimat skripsimu tanpa mengubah makna. AI kami mengganti sinonim dan merestrukturisasi kalimat secara otomatis.",
    color: "#2563eb", bg: "#eff6ff", badge: "AI Powered", to: "/parafrase",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
    title: "Cek Plagiasi",
    description: "Periksa tingkat kemiripan teks dengan jutaan sumber akademik. Laporan lengkap dan rekomendasi perbaikan instan.",
    color: "#0ea5e9", bg: "#f0f9ff", badge: "Real-time", to: "/plagiasi",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4M7 8h10M7 12h6" />
      </svg>
    ),
    title: "Kumpulan PPT Sidang",
    description: "Ratusan template PowerPoint sidang skripsi profesional dari berbagai universitas. Download gratis dan edit sesuai kebutuhan.",
    color: "#7c3aed", bg: "#f5f3ff", badge: "500+ Template", to: "/ppt",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Chat AI Alerin",
    description: "Tanya apa saja tentang skripsimu kepada Alerin — asisten AI cerdas yang siap membantu 24/7, dari metodologi hingga analisis data.",
    color: "#059669", bg: "#ecfdf5", badge: "24/7 Online", to: "/claro",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    title: "Simulasi Sidang",
    description: "Latih kemampuan menjawab pertanyaan dosen penguji. AI Alerin berperan sebagai penguji dan memberi feedback instan per jawaban.",
    color: "#dc2626", bg: "#fff1f2", badge: "AI Examiner", to: "/simulasi",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: "Grammar Checker",
    description: "Periksa ejaan, tata bahasa, redundansi, dan gaya akademik skripsimu. AI menandai error langsung di teks dan memberi saran perbaikan.",
    color: "#7c3aed", bg: "#f5f3ff", badge: "AI Proofreading", to: "/grammar",
  },
];

const STATS = [
  { value: "50.000+", label: "Mahasiswa Aktif" },
  { value: "98%", label: "Tingkat Kepuasan" },
  { value: "500+", label: "Template PPT" },
  { value: "24/7", label: "Dukungan AI" },
];

const TESTIMONIALS = [
  { name: "Rizky Aditya", univ: "Universitas Indonesia", text: "Class Program benar-benar membantu skripsi saya. Fitur parafrase dan cek plagiasi sangat akurat dan hemat waktu!", avatar: "RA", color: "#2563eb" },
  { name: "Siti Nurhaliza", univ: "Universitas Gadjah Mada", text: "Alerin adalah asisten terbaik! Bisa menjawab pertanyaan metodologi penelitian dengan detail dan mudah dipahami.", avatar: "SN", color: "#7c3aed" },
  { name: "Budi Santoso", univ: "Institut Teknologi Bandung", text: "Template PPT sidangnya keren dan profesional. Dosen penguji saya sampai memuji presentasi saya!", avatar: "BS", color: "#0ea5e9" },
];

// ─── Ebook data ───────────────────────────────────────────────────────────────
const EBOOKS = [
  {
    id: 1,
    title: "Panduan Lengkap Menulis Skripsi",
    subtitle: "Dari Proposal hingga Sidang",
    author: "Dr. Ahmad Fauzi, M.Pd.",
    category: "Metodologi",
    pages: 248,
    rating: 4.9,
    reviews: 1240,
    badge: "Terlaris",
    badgeColor: "#f59e0b",
    badgeBg: "#fffbeb",
    gradient: "linear-gradient(145deg, #1d4ed8, #3b82f6)",
    accent: "#93c5fd",
    cover: "https://images.unsplash.com/photo-1529521818954-c76995518833?w=400&q=80",
    emoji: "📘",
    free: false,
    price: "Gratis",
  },
  {
    id: 2,
    title: "Metode Penelitian Kuantitatif",
    subtitle: "Panduan SPSS untuk Mahasiswa",
    author: "Prof. Siti Rahayu, M.Si.",
    category: "Statistika",
    pages: 312,
    rating: 4.8,
    reviews: 987,
    badge: "Populer",
    badgeColor: "#7c3aed",
    badgeBg: "#f5f3ff",
    gradient: "linear-gradient(145deg, #7c3aed, #a855f7)",
    accent: "#d8b4fe",
    cover: null,
    emoji: "📊",
    free: false,
    price: "Gratis",
  },
  {
    id: 3,
    title: "Tips Lolos Sidang Skripsi",
    subtitle: "Strategi & Teknik Menjawab Penguji",
    author: "Budi Santoso, M.T.",
    category: "Sidang",
    pages: 156,
    rating: 4.9,
    reviews: 2150,
    badge: "Baru",
    badgeColor: "#059669",
    badgeBg: "#ecfdf5",
    gradient: "linear-gradient(145deg, #059669, #10b981)",
    accent: "#6ee7b7",
    cover: "https://images.unsplash.com/photo-1770235622881-7c3b96af6972?w=400&q=80",
    emoji: "🎓",
    free: true,
    price: "Gratis",
  },
  {
    id: 4,
    title: "Cara Mudah Parafrase Akademik",
    subtitle: "Hindari Plagiarisme dengan Tepat",
    author: "Maya Kusuma, M.Pd.",
    category: "Penulisan",
    pages: 120,
    rating: 4.7,
    reviews: 834,
    badge: "Gratis",
    badgeColor: "#dc2626",
    badgeBg: "#fef2f2",
    gradient: "linear-gradient(145deg, #dc2626, #ef4444)",
    accent: "#fca5a5",
    cover: null,
    emoji: "✍️",
    free: true,
    price: "Gratis",
  },
  {
    id: 5,
    title: "Tinjauan Pustaka & Sitasi APA",
    subtitle: "Referensi Valid untuk Skripsi Berkualitas",
    author: "Dr. Hendra Wijaya",
    category: "Referensi",
    pages: 192,
    rating: 4.8,
    reviews: 671,
    badge: "Rekomendasi",
    badgeColor: "#0284c7",
    badgeBg: "#f0f9ff",
    gradient: "linear-gradient(145deg, #0284c7, #38bdf8)",
    accent: "#7dd3fc",
    cover: "https://images.unsplash.com/photo-1785780224424-65ee9ac09a98?w=400&q=80",
    emoji: "📚",
    free: false,
    price: "Gratis",
  },
  {
    id: 6,
    title: "Analisis Data Kualitatif",
    subtitle: "Wawancara, Observasi & Triangulasi",
    author: "Prof. Rina Marlina, Ph.D.",
    category: "Metodologi",
    pages: 276,
    rating: 4.6,
    reviews: 512,
    badge: "Pilihan Editor",
    badgeColor: "#ea580c",
    badgeBg: "#fff7ed",
    gradient: "linear-gradient(145deg, #ea580c, #f97316)",
    accent: "#fdba74",
    cover: null,
    emoji: "🔍",
    free: false,
    price: "Gratis",
  },
];

// ─── Ebook cover card ──────────────────────────────────────────────────────────
function EbookCover({ book }: { book: typeof EBOOKS[0] }) {
  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-lg"
      style={{ aspectRatio: "2/3", background: book.gradient }}>
      {/* Book texture overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.15) 28px, rgba(255,255,255,0.15) 29px)" }} />

      {/* Spine effect */}
      <div className="absolute left-0 top-0 bottom-0 w-3 opacity-30"
        style={{ background: "rgba(0,0,0,0.4)" }} />

      {/* Photo cover if available */}
      {book.cover && (
        <img src={book.cover} alt={book.title}
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay" />
      )}

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        <div>
          <div className="text-3xl mb-3">{book.emoji}</div>
          <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider mb-2"
            style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}>
            {book.category}
          </span>
          <h3 className="text-white font-display font-700 text-sm leading-tight mb-1">{book.title}</h3>
          <p className="text-[11px] leading-snug" style={{ color: book.accent }}>{book.subtitle}</p>
        </div>
        <div>
          <div className="w-full h-px mb-3" style={{ background: "rgba(255,255,255,0.2)" }} />
          <p className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>{book.author}</p>
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{book.pages} halaman</p>
        </div>
      </div>

      {/* Shine */}
      <div className="absolute top-0 left-3 right-0 h-1/3 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)" }} />
    </div>
  );
}

// ─── Ebook section ─────────────────────────────────────────────────────────────
function EbookSection() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const categories = ["Semua", "Metodologi", "Statistika", "Sidang", "Penulisan", "Referensi"];
  const filtered = activeCategory === "Semua" ? EBOOKS : EBOOKS.filter((b) => b.category === activeCategory);

  return (
    <section id="ebook" className="py-24 px-6" style={{ background: "linear-gradient(180deg, #f8faff 0%, #fff 100%)" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-semibold border border-purple-100 mb-4 uppercase tracking-wider">
              Koleksi Ebook
            </span>
            <h2 className="font-display font-800 text-4xl md:text-[42px] text-slate-900 leading-tight">
              Rekomendasi Ebook<br />
              <span className="grad-text">untuk Skripsimu</span>
            </h2>
            <p className="text-slate-400 text-base mt-3 max-w-md">
              Panduan lengkap dari para akademisi dan praktisi — bisa diunduh gratis untuk mahasiswa terdaftar.
            </p>
          </div>

          {/* Hero reading image */}
          <div className="hidden md:block rounded-2xl overflow-hidden shrink-0"
            style={{ width: 280, height: 140, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
            <img
              src="https://images.unsplash.com/photo-1767102060241-130cb9260718?w=600&q=80"
              alt="Mahasiswa membaca"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150"
              style={activeCategory === cat
                ? { background: "#2563eb", color: "#fff", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }
                : { background: "#f1f5f9", color: "#64748b" }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Books grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {filtered.map((book) => (
            <div key={book.id} className="group flex flex-col">
              {/* Cover */}
              <div className="relative mb-3 transition-transform duration-300 group-hover:-translate-y-2"
                style={{ filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.18))" }}>
                <EbookCover book={book} />

                {/* Badge */}
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm"
                  style={{ background: book.badgeBg, color: book.badgeColor, border: `1px solid ${book.badgeColor}30` }}>
                  {book.badge}
                </span>

                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                  style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}>
                  <button className="px-4 py-2 rounded-lg bg-white text-slate-800 text-xs font-bold shadow-lg hover:bg-blue-50 transition-colors">
                    Download Gratis
                  </button>
                </div>
              </div>

              {/* Meta */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-sm font-display font-700 text-slate-800 leading-tight mb-0.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {book.title}
                </h3>
                <p className="text-[11px] text-slate-400 mb-2 line-clamp-1">{book.author}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-[11px] font-bold text-slate-700">{book.rating}</span>
                  <span className="text-[10px] text-slate-400">({book.reviews.toLocaleString()})</span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-emerald-600">{book.price}</span>
                  <span className="text-[10px] text-slate-400">{book.pages} hal</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 rounded-3xl overflow-hidden relative"
          style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb,#7c3aed)" }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)" }} />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 px-10 py-10">
            <div className="flex items-center gap-5">
              {/* Mini book stack preview */}
              <div className="flex -space-x-3 shrink-0">
                {EBOOKS.slice(0, 4).map((b, i) => (
                  <div key={b.id}
                    className="w-10 h-14 rounded-md shadow-lg border border-white/20 shrink-0"
                    style={{ background: b.gradient, zIndex: 4 - i, transform: `rotate(${(i - 1.5) * 4}deg)` }}
                  />
                ))}
              </div>
              <div>
                <p className="font-display font-700 text-white text-xl mb-1">50+ Ebook Tersedia</p>
                <p className="text-blue-200 text-sm">Semua gratis untuk mahasiswa yang terdaftar di Class Program</p>
              </div>
            </div>
            <button className="shrink-0 px-7 py-3.5 rounded-xl bg-white font-bold text-blue-700 text-sm hover:bg-blue-50 transition-all"
              style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
              Lihat Semua Ebook →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* HERO */}
      <section id="beranda" className="relative pt-16 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #f0f7ff 0%, #ffffff 50%, #f5f3ff 100%)" }}>
        <div className="absolute inset-0 dot-bg opacity-60" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #bfdbfe, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, #ddd6fe, transparent 70%)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 flex flex-col lg:flex-row items-center gap-14">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-7 fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Platform Skripsi #1 di Indonesia
            </div>
            <h1 className="font-display font-800 text-5xl md:text-6xl leading-tight text-slate-900 mb-5 fade-up-2">
              Selesaikan Skripsimu<br />
              <span className="grad-text">Lebih Cepat & Cerdas</span>
            </h1>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-9 max-w-lg mx-auto lg:mx-0 fade-up-3">
              Class Program menyediakan tools lengkap berbasis AI untuk mahasiswa — parafrase, cek plagiasi,
              template PPT sidang, hingga asisten Alerin yang siap 24/7.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start fade-up-3">
              <Link to="/parafrase" className="btn-primary text-sm px-8 py-3 flex items-center gap-2">
                Coba Parafrase AI
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <a href="#fitur" className="btn-outline text-sm px-7 py-3">Lihat Semua Fitur</a>
            </div>
            <div className="flex flex-wrap items-center gap-5 mt-10 justify-center lg:justify-start">
              {[{ icon: "🎓", text: "50+ Universitas" }, { icon: "⭐", text: "Rating 4.9/5" }, { icon: "🔒", text: "Data Aman" }].map((b) => (
                <div key={b.text} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span>{b.icon}</span>{b.text}
                </div>
              ))}
            </div>
          </div>

          {/* Hero right */}
          <div className="flex-1 flex justify-center lg:justify-end w-full max-w-md">
            <div className="relative w-full max-w-sm float">
              <div className="rounded-2xl bg-white border border-slate-100 p-6"
                style={{ boxShadow: "0 24px 64px rgba(37,99,235,0.12)" }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                      style={{ background: "linear-gradient(135deg,#2563eb,#60a5fa)" }}>C</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Alerin</p>
                      <p className="text-[10px] text-slate-400">Asisten Skripsi Pintar</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Online
                  </span>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="rounded-xl rounded-tl-sm p-3 bg-blue-50 text-xs text-slate-700 leading-relaxed max-w-[85%]">
                    Halo! Ada yang bisa Alerin bantu hari ini? 😊
                  </div>
                  <div className="rounded-xl rounded-tr-sm p-3 bg-slate-100 text-xs text-slate-700 max-w-[85%] ml-auto">
                    Bantu saya membuat kerangka BAB 1 skripsi sistem informasi
                  </div>
                  <div className="rounded-xl rounded-tl-sm p-3 bg-blue-50 text-xs text-slate-700 leading-relaxed max-w-[85%]">
                    Tentu! Berikut struktur BAB 1 yang disarankan... ✨
                  </div>
                </div>
                <div className="flex items-center gap-2 border border-slate-100 rounded-xl px-3 py-2.5 bg-slate-50">
                  <input className="flex-1 text-xs text-slate-500 bg-transparent outline-none" placeholder="Ketik pertanyaan..." readOnly />
                  <button className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#2563eb,#60a5fa)" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="absolute -left-8 top-8 bg-white rounded-xl px-4 py-3 border border-slate-100"
                style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-green-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-800">Plagiasi: 8%</p>
                    <p className="text-[9px] text-slate-400">Aman disubmit</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-6 bottom-12 bg-white rounded-xl px-4 py-3 border border-slate-100"
                style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-800">+87% Unik</p>
                    <p className="text-[9px] text-slate-400">Hasil parafrase</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.value} className="flex flex-col items-center gap-0.5">
                <span className="font-display font-800 text-2xl text-blue-600">{s.value}</span>
                <span className="text-xs text-slate-400 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="fitur" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100 mb-4 uppercase tracking-wider">
              Fitur Unggulan
            </span>
            <h2 className="font-display font-800 text-4xl md:text-[44px] text-slate-900 leading-tight mb-4">
              Semua Tools Skripsi<br />
              <span className="grad-text">dalam Satu Tempat</span>
            </h2>
            <p className="text-slate-400 text-base max-w-lg mx-auto">
              Dirancang khusus untuk mahasiswa Indonesia yang ingin lulus tepat waktu dengan skripsi berkualitas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {FEATURES.map((f) => {
              const inner = (
                <div className="card-hover group rounded-2xl border border-slate-100 p-6 bg-white h-full"
                  style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
                  <div className="icon-wrap w-12 h-12 mb-5" style={{ background: f.bg }}>
                    <div style={{ color: f.color }}>{f.icon}</div>
                  </div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold mb-3"
                    style={{ background: f.bg, color: f.color }}>{f.badge}</div>
                  <h3 className="font-display font-700 text-slate-900 text-base mb-2 group-hover:text-blue-600 transition-colors">{f.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{f.description}</p>
                  <div className="mt-5 flex items-center gap-1 text-xs font-semibold" style={{ color: f.color }}>
                    Coba Sekarang
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
              return f.to.startsWith("/") && !f.to.startsWith("/#") ? (
                <Link key={f.title} to={f.to} className="block">{inner}</Link>
              ) : (
                <a key={f.title} href={f.to} className="block">{inner}</a>
              );
            })}
          </div>

          {/* How it works */}
          <div className="mt-20 rounded-3xl p-10 md:p-14"
            style={{ background: "linear-gradient(135deg, #eff6ff, #f5f3ff)" }}>
            <div className="text-center mb-10">
              <h3 className="font-display font-800 text-2xl text-slate-900 mb-2">Cara Kerja Class Program</h3>
              <p className="text-slate-400 text-sm">3 langkah mudah untuk memulai</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Daftar Gratis", desc: "Buat akun dalam 30 detik. Tidak perlu kartu kredit.", icon: "👤" },
                { step: "02", title: "Upload Skripsimu", desc: "Upload file Word, PDF, atau tempel teks langsung.", icon: "📄" },
                { step: "03", title: "Dapatkan Hasilnya", desc: "Parafrase, laporan plagiasi, dan rekomendasi instan.", icon: "✅" },
              ].map((s, i) => (
                <div key={s.step} className="flex flex-col items-center text-center relative">
                  {i < 2 && <div className="hidden md:block absolute top-6 left-3/4 w-1/2 border-t-2 border-dashed border-blue-200" />}
                  <div className="w-14 h-14 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-2xl mb-4 relative z-10"
                    style={{ boxShadow: "0 4px 16px rgba(37,99,235,0.1)" }}>{s.icon}</div>
                  <span className="text-xs font-bold text-blue-400 mb-1">{s.step}</span>
                  <p className="font-display font-700 text-slate-800 text-base mb-1.5">{s.title}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="tentang" className="py-24 px-6"
        style={{ background: "linear-gradient(180deg, #f8faff 0%, #ffffff 100%)" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden bg-white border border-slate-100 p-8"
              style={{ boxShadow: "0 20px 64px rgba(37,99,235,0.1)" }}>
              <div className="flex items-center gap-4 mb-8">
                <img src="/Logo_CP_Baru_Renggang__1__2.png" alt="" className="h-12 w-auto" onError={() => {}} />
                <div>
                  <p className="font-display font-700 text-lg text-slate-900">Class Program</p>
                  <p className="text-xs text-slate-400">Platform Skripsi Terpercaya</p>
                </div>
              </div>
              <div className="space-y-5">
                {[
                  { label: "Akurasi Parafrase", value: 97, color: "#2563eb" },
                  { label: "Deteksi Plagiasi", value: 99, color: "#0ea5e9" },
                  { label: "Kepuasan Pengguna", value: 98, color: "#7c3aed" },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-medium text-slate-600">{bar.label}</span>
                      <span className="text-xs font-bold" style={{ color: bar.color }}>{bar.value}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${bar.value}%`, background: `linear-gradient(90deg, ${bar.color}, ${bar.color}88)` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[{ n: "50K+", l: "Pengguna" }, { n: "50+", l: "Universitas" }, { n: "4.9★", l: "Rating" }].map((s) => (
                  <div key={s.l} className="rounded-xl bg-blue-50 p-3 text-center">
                    <p className="font-display font-700 text-blue-600 text-base">{s.n}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100 mb-5 uppercase tracking-wider">Tentang Kami</span>
            <h2 className="font-display font-800 text-4xl text-slate-900 leading-tight mb-5">
              Dibuat oleh Mahasiswa,<br /><span className="grad-text">untuk Mahasiswa</span>
            </h2>
            <p className="text-slate-500 leading-relaxed mb-5">
              Class Program lahir dari keresahan mahasiswa tingkat akhir yang kesulitan menyelesaikan skripsi tepat waktu.
              Kami membangun platform all-in-one yang menggabungkan kecerdasan buatan dengan kebutuhan nyata mahasiswa Indonesia.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🎓", title: "50+ Universitas", desc: "Digunakan mahasiswa dari kampus terkemuka Indonesia" },
                { icon: "🤖", title: "AI Terdepan", desc: "Teknologi NLP terbaru untuk parafrase & analisis teks" },
                { icon: "🔒", title: "Data Aman", desc: "Enkripsi end-to-end untuk keamanan datamu" },
                { icon: "📞", title: "Support 24/7", desc: "Tim dan Alerin siap membantu kapan saja" },
              ].map((i) => (
                <div key={i.title} className="rounded-xl border border-slate-100 p-4"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                  <span className="text-xl mb-2 block">{i.icon}</span>
                  <p className="font-semibold text-slate-800 text-xs mb-0.5">{i.title}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{i.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimoni" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100 mb-4 uppercase tracking-wider">Testimoni</span>
            <h2 className="font-display font-800 text-4xl text-slate-900 mb-3">
              Kata Mereka tentang<br /><span className="grad-text">Class Program</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card-hover rounded-2xl border border-slate-100 p-7 bg-white"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
                <Stars n={5} />
                <p className="text-slate-600 text-sm leading-relaxed mt-4 mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}99)` }}>{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.univ}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EBOOK SECTION */}
      <EbookSection />

      {/* CTA */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 60%, #6366f1 100%)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-800 text-4xl text-white mb-4">
            Siap Selesaikan Skripsimu<br />Bersama Class Program?
          </h2>
          <p className="text-blue-100 text-base mb-10 leading-relaxed">
            Bergabung dengan 50.000+ mahasiswa yang sudah merasakan kemudahan bersama kami.<br />
            Daftar gratis, tidak perlu kartu kredit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/parafrase"
              className="inline-flex items-center justify-center gap-2 px-9 py-3.5 rounded-xl bg-white text-blue-600 font-bold text-sm transition-all hover:shadow-xl hover:-translate-y-0.5">
              Coba Parafrase Gratis
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a href="#"
              className="inline-flex items-center justify-center gap-2 px-9 py-3.5 rounded-xl border-2 border-white/40 text-white font-semibold text-sm hover:border-white hover:bg-white/10 transition-all">
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
