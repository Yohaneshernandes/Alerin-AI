import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── Data ─────────────────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 1,
    title: "Skripsi Modern Minimalis",
    university: "Universitas Indonesia",
    faculty: "Fakultas Ekonomi & Bisnis",
    slides: 32,
    downloads: 12840,
    rating: 4.9,
    reviews: 847,
    category: "Minimalis",
    prodi: "Manajemen",
    color1: "#2563eb",
    color2: "#4f46e5",
    preview: "https://images.unsplash.com/photo-1782008237484-281984e7ea80?w=600&q=80",
    badge: "Terpopuler",
    badgeColor: "#f59e0b",
    tags: ["Biru", "Modern", "Chart"],
  },
  {
    id: 2,
    title: "Akademik Professional Clean",
    university: "Universitas Gadjah Mada",
    faculty: "Fakultas MIPA",
    slides: 28,
    downloads: 9320,
    rating: 4.8,
    reviews: 612,
    category: "Profesional",
    prodi: "Statistika",
    color1: "#0284c7",
    color2: "#06b6d4",
    preview: "https://images.unsplash.com/photo-1758691736490-03d39c292d7a?w=600&q=80",
    badge: "Rekomendasi",
    badgeColor: "#2563eb",
    tags: ["Biru Muda", "Clean", "Data"],
  },
  {
    id: 3,
    title: "Sidang Elegan Purple",
    university: "Institut Teknologi Bandung",
    faculty: "Sekolah Teknik Elektro",
    slides: 40,
    downloads: 7650,
    rating: 4.9,
    reviews: 534,
    category: "Elegan",
    prodi: "Teknik Informatika",
    color1: "#7c3aed",
    color2: "#a855f7",
    preview: "https://images.unsplash.com/photo-1782008237548-1a39bff20bb4?w=600&q=80",
    badge: "Baru",
    badgeColor: "#059669",
    tags: ["Ungu", "Premium", "Animasi"],
  },
  {
    id: 4,
    title: "Research Corporate Dark",
    university: "Universitas Airlangga",
    faculty: "Fakultas Ilmu Sosial",
    slides: 36,
    downloads: 6210,
    rating: 4.7,
    reviews: 421,
    category: "Dark",
    prodi: "Ilmu Komunikasi",
    color1: "#111827",
    color2: "#374151",
    preview: "https://images.unsplash.com/photo-1758691736498-422201cc57da?w=600&q=80",
    badge: "Pilihan Editor",
    badgeColor: "#dc2626",
    tags: ["Dark", "Infografik", "Bold"],
  },
  {
    id: 5,
    title: "Gradient Pastel Soft",
    university: "Universitas Brawijaya",
    faculty: "Fakultas Pertanian",
    slides: 24,
    downloads: 5890,
    rating: 4.8,
    reviews: 378,
    category: "Minimalis",
    prodi: "Agribisnis",
    color1: "#ea580c",
    color2: "#f97316",
    preview: "https://images.unsplash.com/photo-1782008237948-391f39f9959e?w=600&q=80",
    badge: null,
    badgeColor: "",
    tags: ["Orange", "Soft", "Pastel"],
  },
  {
    id: 6,
    title: "Tech & Engineering Blue",
    university: "Institut Pertanian Bogor",
    faculty: "Fakultas Teknologi Pertanian",
    slides: 45,
    downloads: 4930,
    rating: 4.6,
    reviews: 298,
    category: "Profesional",
    prodi: "Teknologi Pangan",
    color1: "#059669",
    color2: "#10b981",
    preview: "https://images.unsplash.com/photo-1782008237487-4fe72321500f?w=600&q=80",
    badge: null,
    badgeColor: "",
    tags: ["Hijau", "Teknis", "Timeline"],
  },
  {
    id: 7,
    title: "Warm Academic Cream",
    university: "Universitas Padjadjaran",
    faculty: "Fakultas Hukum",
    slides: 30,
    downloads: 4210,
    rating: 4.7,
    reviews: 267,
    category: "Elegan",
    prodi: "Ilmu Hukum",
    color1: "#d97706",
    color2: "#f59e0b",
    preview: "https://images.unsplash.com/photo-1782008237563-293085c91bc5?w=600&q=80",
    badge: null,
    badgeColor: "",
    tags: ["Kuning", "Formal", "Klasik"],
  },
  {
    id: 8,
    title: "Data Science Modern",
    university: "Universitas Diponegoro",
    faculty: "Fakultas Teknik",
    slides: 38,
    downloads: 3870,
    rating: 4.8,
    reviews: 241,
    category: "Dark",
    prodi: "Teknik Sipil",
    color1: "#0f172a",
    color2: "#1e3a8a",
    preview: "https://images.unsplash.com/photo-1758691736542-c437fea2c673?w=600&q=80",
    badge: null,
    badgeColor: "",
    tags: ["Navy", "Data", "Grafik"],
  },
  {
    id: 9,
    title: "Pink Feminine Academic",
    university: "Universitas Negeri Yogyakarta",
    faculty: "Fakultas Psikologi",
    slides: 26,
    downloads: 3540,
    rating: 4.9,
    reviews: 198,
    category: "Minimalis",
    prodi: "Psikologi",
    color1: "#db2777",
    color2: "#ec4899",
    preview: "https://images.unsplash.com/photo-1782008237484-281984e7ea80?w=600&q=80",
    badge: null,
    badgeColor: "",
    tags: ["Pink", "Soft", "Feminin"],
  },
];

const CATEGORIES = ["Semua", "Minimalis", "Profesional", "Elegan", "Dark"];
const PRODI_LIST = ["Semua Prodi", "Manajemen", "Statistika", "Teknik Informatika", "Ilmu Komunikasi", "Agribisnis", "Teknologi Pangan", "Ilmu Hukum", "Teknik Sipil", "Psikologi"];

// ─── Slide preview mockup ────────────────────────────────────────────────────
function SlideMockup({ tmpl }: { tmpl: typeof TEMPLATES[0] }) {
  return (
    <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
      {/* Background */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${tmpl.color1}, ${tmpl.color2})` }} />

      {/* Photo overlay */}
      {tmpl.preview && (
        <img src={tmpl.preview} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" />
      )}

      {/* Decorative shapes */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20" style={{ background: "rgba(255,255,255,0.3)" }} />
      <div className="absolute -left-4 -bottom-6 w-24 h-24 rounded-full opacity-15" style={{ background: "rgba(255,255,255,0.25)" }} />
      <div className="absolute right-8 bottom-6 w-14 h-2 rounded-full opacity-30" style={{ background: "rgba(255,255,255,0.5)" }} />
      <div className="absolute right-8 bottom-10 w-10 h-2 rounded-full opacity-20" style={{ background: "rgba(255,255,255,0.5)" }} />

      {/* Slide content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <div className="w-8 h-1 rounded-full mb-1.5 opacity-80" style={{ background: "rgba(255,255,255,0.9)" }} />
            <div className="w-5 h-1 rounded-full opacity-50" style={{ background: "rgba(255,255,255,0.7)" }} />
          </div>
          <div className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
            SKRIPSI
          </div>
        </div>
        <div>
          <div className="text-[11px] font-bold text-white leading-tight mb-1 line-clamp-2">{tmpl.title}</div>
          <div className="text-[8px] opacity-70 text-white">{tmpl.university}</div>
          {/* Mini slide indicators */}
          <div className="flex gap-0.5 mt-2">
            {Array.from({ length: Math.min(6, Math.floor(tmpl.slides / 5)) }).map((_, i) => (
              <div key={i} className="h-0.5 rounded-full flex-1 opacity-50" style={{ background: "#fff" }} />
            ))}
          </div>
        </div>
      </div>

      {/* PowerPoint logo watermark */}
      <div className="absolute top-2.5 right-2.5">
        <div className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-black"
          style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}>P</div>
      </div>
    </div>
  );
}

// ─── Template card ─────────────────────────────────────────────────────────────
function TemplateCard({ tmpl }: { tmpl: typeof TEMPLATES[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group rounded-2xl bg-white border border-slate-100 overflow-hidden transition-all duration-200 hover:-translate-y-1"
      style={{ boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.05)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Preview */}
      <div className="relative">
        <SlideMockup tmpl={tmpl} />

        {/* Badge */}
        {tmpl.badge && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm"
            style={{ background: "#fff", color: tmpl.badgeColor }}>
            {tmpl.badge}
          </span>
        )}

        {/* Hover overlay */}
        <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-slate-800 text-xs font-bold shadow hover:bg-blue-50 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold shadow transition-colors"
            style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display font-700 text-sm text-slate-800 mb-0.5 truncate group-hover:text-blue-600 transition-colors">
          {tmpl.title}
        </h3>
        <p className="text-[11px] text-slate-400 mb-3 truncate">{tmpl.university} · {tmpl.prodi}</p>

        {/* Tags */}
        <div className="flex gap-1 flex-wrap mb-3">
          {tmpl.tags.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">{t}</span>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span className="text-[11px] font-bold text-slate-700">{tmpl.rating}</span>
            <span className="text-[10px] text-slate-400">({tmpl.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            <span className="text-[10px]">{tmpl.slides} slide</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/></svg>
            <span className="text-[10px]">{(tmpl.downloads / 1000).toFixed(1)}k</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PPTPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeProdi, setActiveProdi] = useState("Semua Prodi");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Terpopuler");

  const filtered = TEMPLATES
    .filter((t) => activeCategory === "Semua" || t.category === activeCategory)
    .filter((t) => activeProdi === "Semua Prodi" || t.prodi === activeProdi)
    .filter((t) => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.prodi.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "Terpopuler" ? b.downloads - a.downloads : sort === "Rating Tertinggi" ? b.rating - a.rating : b.id - a.id);

  const totalDownloads = TEMPLATES.reduce((s, t) => s + t.downloads, 0);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-14 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#eff6ff 0%,#f5f3ff 50%,#fff 100%)" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full opacity-5" style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }} />
          <div className="absolute -left-10 bottom-0 w-72 h-72 rounded-full opacity-5" style={{ background: "linear-gradient(135deg,#0ea5e9,#2563eb)" }} />
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Link to="/" className="hover:text-slate-600 transition-colors">Beranda</Link>
            <span>›</span>
            <span className="text-slate-600 font-medium">Kumpulan PPT Sidang</span>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100 mb-4 uppercase tracking-wider">
                Template PowerPoint
              </span>
              <h1 className="font-display font-800 text-4xl md:text-5xl text-slate-900 leading-tight mb-3">
                Kumpulan PPT<br /><span className="grad-text">Sidang Skripsi</span>
              </h1>
              <p className="text-slate-500 text-base max-w-lg leading-relaxed">
                Ratusan template PowerPoint sidang skripsi profesional dari berbagai universitas Indonesia. Download gratis, edit sesuai kebutuhanmu.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6 shrink-0">
              {[
                { value: `${TEMPLATES.length * 60}+`, label: "Template Tersedia" },
                { value: `${(totalDownloads / 1000).toFixed(0)}k+`, label: "Total Download" },
                { value: "100%", label: "Gratis" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display font-800 text-2xl text-blue-600">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-14 z-30 bg-white border-b border-slate-100 px-6 py-3"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 flex-1 min-w-48 max-w-64">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari template…"
              className="flex-1 text-sm text-slate-700 placeholder-slate-300 outline-none bg-transparent" />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={activeCategory === cat
                  ? { background: "#2563eb", color: "#fff", boxShadow: "0 4px 10px rgba(37,99,235,0.3)" }
                  : { background: "#f1f5f9", color: "#64748b" }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="ml-auto text-xs font-medium text-slate-600 border border-slate-200 rounded-xl px-3 py-2 outline-none bg-white cursor-pointer">
            {["Terpopuler", "Rating Tertinggi", "Terbaru"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <span className="text-xs text-slate-400 shrink-0">{filtered.length} template</span>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">
        {/* Sidebar filter */}
        <aside className="w-52 shrink-0 hidden lg:block">
          <div className="sticky top-36">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Program Studi</p>
            <div className="space-y-1">
              {PRODI_LIST.map((p) => (
                <button key={p} onClick={() => setActiveProdi(p)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all"
                  style={activeProdi === p
                    ? { background: "#eff6ff", color: "#2563eb", fontWeight: 700 }
                    : { color: "#64748b" }}>
                  {p}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
              <p className="text-[11px] font-bold mb-1">Request Template?</p>
              <p className="text-[10px] opacity-80 leading-relaxed mb-3">Belum ada template yang cocok? Minta desain khusus sesuai universitasmu.</p>
              <button className="w-full py-1.5 rounded-lg bg-white text-blue-600 text-[11px] font-bold hover:bg-blue-50 transition-colors">
                Request Template
              </button>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-4xl mb-4">🔍</p>
              <p className="font-semibold text-slate-700 mb-1">Template tidak ditemukan</p>
              <p className="text-slate-400 text-sm">Coba kata kunci atau filter lain.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((t) => <TemplateCard key={t.id} tmpl={t} />)}
            </div>
          )}

          {/* Bottom banner */}
          <div className="mt-14 rounded-3xl overflow-hidden relative"
            style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)" }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.5) 0%, transparent 60%)" }} />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 px-10 py-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl shrink-0">📊</div>
                <div>
                  <p className="font-display font-700 text-white text-xl mb-1">Ingin Template Premium?</p>
                  <p className="text-blue-200 text-sm">Dapatkan akses ke 500+ template eksklusif dengan desain premium untuk presentasi yang berkesan.</p>
                </div>
              </div>
              <button className="shrink-0 px-7 py-3.5 rounded-xl bg-white font-bold text-blue-700 text-sm hover:bg-blue-50 transition-all whitespace-nowrap"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
                Lihat Template Premium →
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
