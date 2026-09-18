import { useState, useRef, useCallback } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = "upload" | "analyzing" | "result" | "detail" | "paraphrase" | "review" | "success";

type SimilarSection = {
  id: number;
  bab: string;
  page: number;
  score: number;
  severity: "tinggi" | "sedang" | "rendah";
  preview: string;
  original: string;
  suggested: string;
};

// ─── Static data ──────────────────────────────────────────────────────────────
const SECTIONS: SimilarSection[] = [
  {
    id: 1, bab: "Bab II", page: 18, score: 78, severity: "tinggi",
    preview: "Penelitian ini bertujuan untuk mengetahui pengaruh penggunaan media sosial...",
    original: "Penelitian ini bertujuan untuk mengetahui pengaruh penggunaan media sosial terhadap minat beli mahasiswa. Dengan meningkatnya penggunaan platform digital, perilaku konsumtif mahasiswa turut mengalami perubahan yang signifikan.",
    suggested: "Penelitian ini dilakukan untuk menganalisis pengaruh pemanfaatan media sosial terhadap minat beli pada kalangan mahasiswa. Seiring dengan meluasnya penggunaan platform digital, pola perilaku konsumtif mahasiswa mengalami pergeseran yang cukup berarti.",
  },
  {
    id: 2, bab: "Bab II", page: 23, score: 65, severity: "sedang",
    preview: "Teori Uses and Gratifications menjelaskan bahwa individu secara aktif...",
    original: "Teori Uses and Gratifications menjelaskan bahwa individu secara aktif memilih media yang dapat memenuhi kebutuhan mereka, baik kebutuhan informasi maupun hiburan.",
    suggested: "Teori Uses and Gratifications menyatakan bahwa individu secara proaktif menyeleksi media yang sesuai dengan kebutuhannya, mencakup kebutuhan akan informasi maupun kebutuhan hiburan.",
  },
  {
    id: 3, bab: "Bab IV", page: 48, score: 54, severity: "sedang",
    preview: "Hasil penelitian menunjukkan terdapat hubungan positif antara intensitas...",
    original: "Hasil penelitian menunjukkan terdapat hubungan positif antara intensitas penggunaan media sosial dengan minat beli produk secara online pada mahasiswa.",
    suggested: "Temuan penelitian mengindikasikan adanya korelasi positif antara frekuensi penggunaan media sosial dengan kecenderungan pembelian produk secara daring di kalangan mahasiswa.",
  },
];

const BAB_DATA = [
  { bab: "Bab I — Pendahuluan", score: 8, color: "#22c55e" },
  { bab: "Bab II — Landasan Teori", score: 42, color: "#dc2626" },
  { bab: "Bab III — Metodologi", score: 18, color: "#f59e0b" },
  { bab: "Bab IV — Hasil & Pembahasan", score: 12, color: "#f59e0b" },
  { bab: "Bab V — Kesimpulan", score: 9, color: "#22c55e" },
];

const HISTORY = [
  { date: "27 Agu 2026", file: "Skripsi_Final_v3.docx", score: 24, sections: "3 bagian tinggi", status: "Perlu Diperiksa" },
  { date: "20 Agu 2026", file: "Bab_II_Revisi.docx", score: 38, sections: "8 bagian", status: "Perlu Diperiksa" },
  { date: "10 Agu 2026", file: "Skripsi_Draft.docx", score: 61, sections: "14 bagian", status: "Kemiripan Tinggi" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function severityColor(s: SimilarSection["severity"]) {
  return s === "tinggi" ? "#dc2626" : s === "sedang" ? "#d97706" : "#22c55e";
}
function severityBg(s: SimilarSection["severity"]) {
  return s === "tinggi" ? "#fef2f2" : s === "sedang" ? "#fffbeb" : "#ecfdf5";
}
function scoreLabel(n: number) {
  if (n <= 20) return { label: "Aman", color: "#059669", bg: "#ecfdf5" };
  if (n <= 35) return { label: "Perlu Diperiksa", color: "#d97706", bg: "#fffbeb" };
  return { label: "Kemiripan Tinggi", color: "#dc2626", bg: "#fef2f2" };
}
function formatBytes(b: number) {
  return b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Circular score ───────────────────────────────────────────────────────────
function CircularScore({ score, size = 140 }: { score: number; size?: number }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const { label, color } = scoreLabel(score);
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={size * 0.08} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={size * 0.08}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display font-800 leading-none" style={{ fontSize: size * 0.22, color }}>{score}%</span>
        <span style={{ fontSize: size * 0.085, color: "#64748b" }} className="font-medium text-center px-2">{label}</span>
      </div>
    </div>
  );
}

function ProgressBar({ value, color, height = 8 }: { value: number; color: string; height?: number }) {
  return (
    <div className="flex-1 rounded-full overflow-hidden" style={{ height, background: "#f1f5f9" }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

// ─── TOP NAV ──────────────────────────────────────────────────────────────────
function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 bg-white border-b border-slate-100"
      style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
      <div className="flex items-center gap-6">
        <Link to="/" className="font-display font-700 text-slate-800 text-base">
          Class<span className="text-blue-600">Program</span>
        </Link>
        <nav className="hidden md:flex items-center gap-5">
          {[["Beranda","/"],["Grammar","/grammar"],["Cek Kemiripan","/plagiasi"],["Parafrase","/parafrase"],["Simulasi Sidang","/simulasi"],["Alerin","/claro"]].map(([l,t])=>(
            <Link key={l} to={t} className={`text-sm font-medium transition-colors ${t==="/plagiasi"?"text-blue-600":"text-slate-500 hover:text-slate-800"}`}>{l}</Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Kembali
        </Link>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:"linear-gradient(135deg,#2563eb,#4f46e5)"}}>M</div>
      </div>
    </header>
  );
}

// ─── SCREEN: Upload ───────────────────────────────────────────────────────────
function UploadScreen({ onAnalyze }: { onAnalyze: (file: File) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const processFile = (f: File) => setFile(f);
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); };

  return (
    <div className="pt-14 min-h-screen px-6 py-10 max-w-3xl mx-auto" style={{ background: "#f8faff" }}>
      <div className="mb-8">
        <Link to="#" onClick={() => {}} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 mb-4">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Dashboard
        </Link>
        <h1 className="font-display font-800 text-2xl text-slate-900 mb-1">Upload Dokumen</h1>
        <p className="text-slate-500 text-sm">Upload skripsimu untuk menganalisis tingkat kemiripan teks.</p>
      </div>

      <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); e.target.value = ""; }} />

      {!file ? (
        <div onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className="rounded-2xl border-2 border-dashed p-16 flex flex-col items-center text-center cursor-pointer transition-all mb-5"
          style={dragOver ? { borderColor: "#2563eb", background: "#eff6ff" } : { borderColor: "#cbd5e1", background: "#fff" }}>
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p className="font-display font-700 text-lg text-slate-700 mb-1">Tarik file ke sini</p>
          <p className="text-slate-400 text-sm mb-5">atau klik untuk pilih file</p>
          <div className="flex gap-2 mb-4">
            {["DOCX","PDF","TXT"].map((f)=>(
              <span key={f} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold">{f}</span>
            ))}
          </div>
          <span className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">Pilih File</span>
          <p className="text-[10px] text-slate-400 mt-4">Maks. 50 MB</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 mb-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-sm truncate">{file.name}</p>
              <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
              <div className="flex items-center gap-1.5 mt-1 text-emerald-600 text-xs font-semibold">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                Siap dianalisis
              </div>
            </div>
            <button onClick={() => setFile(null)} className="text-slate-300 hover:text-slate-500 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[["Format","DOCX"],["Estimasi","< 1 menit"],["Bab","5 Bab"]].map(([l,v])=>(
              <div key={l} className="rounded-xl bg-slate-50 py-2.5">
                <p className="font-bold text-slate-700 text-sm">{v}</p>
                <p className="text-[10px] text-slate-400">{l}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 flex items-center gap-2 mb-6">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <p className="text-xs text-blue-700">Dokumen digunakan untuk proses analisis dan tidak dibagikan kepada pihak lain.</p>
      </div>

      <button onClick={() => file && onAnalyze(file)} disabled={!file}
        className="w-full py-4 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)", boxShadow: file ? "0 8px 24px rgba(37,99,235,0.3)" : "none" }}>
        {file ? "Mulai Analisis" : "Pilih Dokumen Terlebih Dahulu"}
      </button>
    </div>
  );
}

// ─── SCREEN: Analyzing ────────────────────────────────────────────────────────
function AnalyzingScreen() {
  const steps = [
    { label: "Membaca dokumen", done: true },
    { label: "Menganalisis struktur", done: true },
    { label: "Menganalisis kemiripan", active: true },
    { label: "Menyiapkan hasil", done: false },
  ];
  const [progress] = useState(67);

  return (
    <div className="pt-14 min-h-screen flex items-center justify-center px-6" style={{ background: "#f8faff" }}>
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
          <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
        </div>
        <h2 className="font-display font-700 text-xl text-slate-900 mb-1">Sedang menganalisis dokumen...</h2>
        <p className="text-slate-400 text-sm mb-8">Analisis biasanya membutuhkan beberapa saat.</p>

        <div className="rounded-2xl bg-white border border-slate-100 p-6 mb-6 text-left" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700">Progress</span>
            <span className="text-sm font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 mb-6 overflow-hidden">
            <div className="h-full rounded-full bg-blue-600 transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={s.done ? { background: "#22c55e" } : (s as any).active ? { background: "#2563eb" } : { background: "#e2e8f0" }}>
                  {s.done ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                  ) : (s as any).active ? (
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>
                <span className="text-sm" style={{ color: s.done ? "#22c55e" : (s as any).active ? "#2563eb" : "#94a3b8", fontWeight: (s as any).active ? 600 : 400 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: Result ───────────────────────────────────────────────────────────
function ResultScreen({ fileName, onDetail, onHistory }: { fileName: string; onDetail: (s: SimilarSection) => void; onHistory: () => void }) {
  const overall = 24;
  const { label, color, bg } = scoreLabel(overall);

  return (
    <div className="pt-14 min-h-screen px-6 py-8 max-w-5xl mx-auto" style={{ background: "#f8faff" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-800 text-2xl text-slate-900">Hasil Analisis Kemiripan</h1>
          <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            {fileName}
          </p>
        </div>
        <button onClick={onHistory} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Riwayat
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Hero score */}
        <div className="rounded-2xl bg-white border border-slate-100 p-7 flex flex-col items-center" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
          <CircularScore score={overall} size={150} />
          <p className="mt-3 text-xs text-slate-500 text-center max-w-xs leading-relaxed">
            Skor ini menunjukkan tingkat kemiripan yang terdeteksi berdasarkan pemeriksaan sistem.
          </p>
          <span className="mt-3 px-3 py-1 rounded-full text-xs font-bold" style={{ background: bg, color }}>{label}</span>
        </div>

        {/* Summary stats */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
          <p className="font-display font-700 text-slate-800 mb-4">Ringkasan Dokumen</p>
          <div className="grid grid-cols-2 gap-3">
            {[["Total Halaman","82"],["Bagian Diperiksa","124"],["Kemiripan Tinggi","3"],["Kemiripan Sedang","7"],["Kemiripan Rendah","14"],["Aman","100"]].map(([l,v])=>(
              <div key={l} className="rounded-xl bg-slate-50 p-3">
                <p className="font-bold text-slate-800 text-sm">{v}</p>
                <p className="text-[10px] text-slate-400">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BAB breakdown */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
          <p className="font-display font-700 text-slate-800 mb-4">Distribusi per Bab</p>
          <div className="space-y-3">
            {BAB_DATA.map((b) => (
              <div key={b.bab} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-32 shrink-0 truncate">{b.bab}</span>
                <ProgressBar value={b.score} color={b.color} height={8} />
                <span className="text-xs font-bold w-8 text-right" style={{ color: b.color }}>{b.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* High similarity sections */}
      <div className="rounded-2xl bg-white border border-slate-100 p-6" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <p className="font-display font-700 text-slate-800 mb-5">Bagian dengan Kemiripan Tertinggi</p>
        <div className="space-y-3">
          {SECTIONS.map((s, i) => {
            const sc = severityColor(s.severity);
            const sb = severityBg(s.severity);
            return (
              <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 transition-all"
                style={{ background: "#fafafa" }}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: sc }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-700">{s.bab} — Halaman {s.page}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: sb, color: sc }}>
                      {s.score}% · {s.severity.charAt(0).toUpperCase() + s.severity.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{s.preview}</p>
                </div>
                <button onClick={() => onDetail(s)}
                  className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all">
                  Review
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy notice */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-start gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <p className="text-[11px] text-slate-400 leading-relaxed">Dokumenmu digunakan untuk proses analisis. Jangan masukkan data pribadi atau informasi rahasia yang tidak diperlukan. Similarity score bukan indikasi pasti plagiarisme.</p>
      </div>
    </div>
  );
}

// ─── SCREEN: Detail ───────────────────────────────────────────────────────────
function DetailScreen({ section, onParaphrase, onBack }: { section: SimilarSection; onParaphrase: () => void; onBack: () => void }) {
  const sc = severityColor(section.severity);
  const sb = severityBg(section.severity);

  return (
    <div className="pt-14 min-h-screen px-6 py-8 max-w-5xl mx-auto" style={{ background: "#f8faff" }}>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-700 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h1 className="font-display font-700 text-xl text-slate-900">Analisis Kemiripan</h1>
          <p className="text-slate-400 text-xs">{section.bab} — Halaman {section.page}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: editor view */}
        <div className="lg:col-span-3 rounded-2xl bg-white border border-slate-100 overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Tampilan Dokumen</span>
            <span className="text-[10px] text-slate-400">{section.bab} · Hal. {section.page}</span>
          </div>
          <div className="p-7">
            <p className="text-[13px] text-slate-600 leading-loose mb-5 font-serif">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <mark className="rounded px-0.5 text-[13px] leading-loose font-serif cursor-pointer"
              style={{ background: sb, borderBottom: `2px solid ${sc}`, color: "inherit" }}>
              {section.original}
            </mark>
            <p className="text-[13px] text-slate-600 leading-loose mt-5 font-serif">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
        </div>

        {/* Right: analysis panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Score */}
          <div className="rounded-2xl bg-white border border-slate-100 p-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Similarity Score</p>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-display font-800 text-3xl" style={{ color: sc }}>{section.score}%</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ background: sb, color: sc }}>
                {section.severity.charAt(0).toUpperCase() + section.severity.slice(1)}
              </span>
            </div>
            <ProgressBar value={section.score} color={sc} height={8} />
          </div>

          {/* Original */}
          <div className="rounded-2xl bg-white border border-slate-100 p-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Bagian yang Perlu Diperiksa</p>
            <p className="text-xs text-slate-700 leading-relaxed italic">"{section.original}"</p>
          </div>

          {/* AI suggestion */}
          <div className="rounded-2xl bg-white border border-slate-100 p-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>
              AI Suggestion
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Original</p>
            <p className="text-xs text-slate-600 leading-relaxed line-through decoration-red-300 mb-3 italic">"{section.original}"</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Disarankan</p>
            <p className="text-xs text-emerald-700 leading-relaxed italic">"{section.suggested}"</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {[["Perubahan Struktur","Tinggi"],["Kejelasan","Baik"],["Gaya Akademik","Baik"],["Makna","Dipertahankan"]].map(([l,v])=>(
                <div key={l} className="rounded-lg bg-slate-50 p-2">
                  <p className="text-[9px] text-slate-400">{l}</p>
                  <p className="text-[11px] font-semibold text-slate-700">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={onParaphrase}
              className="flex-1 py-3 rounded-xl text-xs font-bold text-white transition-all"
              style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
              Gunakan Hasil
            </button>
            <button className="flex-1 py-3 rounded-xl text-xs font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all">
              Parafrase Lagi
            </button>
          </div>
          <button className="w-full py-2.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">
            Abaikan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: Paraphrase editor ────────────────────────────────────────────────
function ParaphraseScreen({ section, onReview, onBack }: { section: SimilarSection; onReview: () => void; onBack: () => void }) {
  const [style, setStyle] = useState("Akademik");
  const [strength, setStrength] = useState("Sedang");
  const styles = ["Akademik","Formal","Natural","Ringkas","Detail"];
  const strengths = ["Ringan","Sedang","Tinggi"];

  return (
    <div className="pt-14 min-h-screen px-6 py-8 max-w-5xl mx-auto" style={{ background: "#f8faff" }}>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-700 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 className="font-display font-700 text-xl text-slate-900">Parafrase dengan AI</h1>
      </div>

      {/* Settings bar */}
      <div className="rounded-2xl bg-white border border-slate-100 p-5 mb-6 flex flex-wrap items-center gap-6" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-2">Gaya</p>
          <div className="flex gap-1.5">
            {styles.map((s) => (
              <button key={s} onClick={() => setStyle(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={style === s ? { background: "#eff6ff", color: "#2563eb", border: "1.5px solid #bfdbfe" } : { background: "#f8faff", color: "#64748b", border: "1.5px solid #f1f5f9" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-2">Tingkat Perubahan</p>
          <div className="flex gap-1.5">
            {strengths.map((s) => (
              <button key={s} onClick={() => setStrength(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={strength === s ? { background: "#eff6ff", color: "#2563eb", border: "1.5px solid #bfdbfe" } : { background: "#f8faff", color: "#64748b", border: "1.5px solid #f1f5f9" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="rounded-2xl bg-white border border-slate-100 overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div className="px-5 py-3 border-b border-slate-100 bg-red-50">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Original</span>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-700 leading-loose font-serif">{section.original}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-emerald-200 overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div className="px-5 py-3 border-b border-emerald-100 bg-emerald-50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Hasil Parafrase</span>
            <span className="text-[10px] text-emerald-500 font-semibold">{style} · {strength}</span>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-700 leading-loose font-serif">
              {section.suggested.split(" ").map((word, i) => {
                const origWords = section.original.toLowerCase().split(" ");
                const changed = !origWords.includes(word.toLowerCase().replace(/[.,]/g, ""));
                return changed ? (
                  <mark key={i} className="rounded px-0.5" style={{ background: "#dcfce7", color: "inherit" }}>{word} </mark>
                ) : <span key={i}>{word} </span>;
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center gap-2 mb-6">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <p className="text-xs text-amber-700">Pastikan hasil parafrase tetap sesuai dengan makna dan konteks penelitianmu.</p>
      </div>

      <div className="flex gap-3">
        <button onClick={onReview} className="flex-1 py-3.5 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
          Gunakan Hasil
        </button>
        <button className="flex-1 py-3.5 rounded-xl text-sm font-semibold border-2 border-blue-200 text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
          Generate Ulang
        </button>
      </div>
    </div>
  );
}

// ─── SCREEN: Review changes ───────────────────────────────────────────────────
function ReviewScreen({ onFinish, onBack }: { onFinish: () => void; onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [applied, setApplied] = useState<Set<number>>(new Set());
  const total = SECTIONS.length;
  const s = SECTIONS[current];
  const allDone = applied.size + (total - applied.size) >= total || current >= total;

  return (
    <div className="pt-14 min-h-screen px-6 py-8 max-w-4xl mx-auto" style={{ background: "#f8faff" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 className="font-display font-700 text-xl text-slate-900">Review Perubahan</h1>
            <p className="text-slate-400 text-xs">Perubahan {Math.min(current + 1, total)} dari {total}</p>
          </div>
        </div>
        {current >= total && (
          <button onClick={onFinish} className="px-5 py-2 rounded-xl text-xs font-bold text-white" style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>Selesai</button>
        )}
      </div>

      {/* Progress track */}
      <div className="flex gap-1.5 mb-8">
        {SECTIONS.map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full transition-all"
            style={{ background: i < current ? "#2563eb" : i === current ? "#93c5fd" : "#e2e8f0" }} />
        ))}
      </div>

      {current < total ? (
        <>
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div className="rounded-2xl bg-white border border-slate-100 overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div className="px-5 py-3 border-b border-red-100 bg-red-50"><span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Sebelum</span></div>
              <p className="p-6 text-sm text-slate-700 leading-loose font-serif">{s.original}</p>
            </div>
            <div className="rounded-2xl bg-white border border-emerald-200 overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div className="px-5 py-3 border-b border-emerald-100 bg-emerald-50"><span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">AI Version</span></div>
              <p className="p-6 text-sm text-emerald-800 leading-loose font-serif">{s.suggested}</p>
            </div>
          </div>
          <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 mb-5">
            <p className="text-xs text-blue-700 leading-relaxed">
              Struktur kalimat diubah untuk mengurangi kemiripan tanpa mengubah inti informasi dan makna akademik dari teks asli.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setApplied((p) => new Set([...p, s.id])); setCurrent((c) => c + 1); }}
              className="flex-1 py-3.5 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
              Terapkan Perubahan
            </button>
            <button onClick={() => setCurrent((c) => c + 1)}
              className="flex-1 py-3.5 rounded-xl text-sm font-semibold border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
              Lewati
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
              className="flex-1 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 disabled:opacity-40 flex items-center justify-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Sebelumnya
            </button>
            <button onClick={() => setCurrent((c) => Math.min(total, c + 1))}
              className="flex-1 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 flex items-center justify-center gap-1">
              Berikutnya<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">✅</p>
          <p className="font-display font-700 text-xl text-slate-900 mb-1">Semua bagian sudah direview!</p>
          <p className="text-slate-400 text-sm mb-6">{applied.size} perubahan diterapkan · {total - applied.size} dilewati</p>
          <button onClick={onFinish} className="px-8 py-3.5 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>
            Selesai
          </button>
        </div>
      )}
    </div>
  );
}

// ─── SCREEN: Success ──────────────────────────────────────────────────────────
function SuccessScreen({ onRecheck, onDashboard }: { onRecheck: () => void; onDashboard: () => void }) {
  return (
    <div className="pt-14 min-h-screen flex items-center justify-center px-6" style={{ background: "#f8faff" }}>
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6 text-4xl">🎉</div>
        <h1 className="font-display font-800 text-2xl text-slate-900 mb-2">Review Selesai!</h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Semua bagian yang kamu pilih sudah diperiksa dan perubahan telah diterapkan.
        </p>
        <div className="rounded-2xl bg-white border border-slate-100 p-6 mb-8 grid grid-cols-3 gap-4 text-center" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          {[["3","Bagian Diperiksa"],["2","Perubahan Diterapkan"],["1","Dilewati"]].map(([v,l])=>(
            <div key={l}>
              <p className="font-display font-800 text-2xl text-blue-600">{v}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 mb-6 text-left">
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>Estimasi:</strong> Tingkat kemiripan mungkin lebih rendah setelah perubahan diterapkan. Lakukan analisis ulang untuk hasil yang akurat.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onDashboard} className="flex-1 py-3.5 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
            Lihat Dokumen
          </button>
          <button onClick={onRecheck} className="flex-1 py-3.5 rounded-xl text-sm font-semibold border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
            Analisis Ulang
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: History ──────────────────────────────────────────────────────────
function HistoryScreen({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState("Semua");
  return (
    <div className="pt-14 min-h-screen px-6 py-8 max-w-4xl mx-auto" style={{ background: "#f8faff" }}>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-700"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
        <h1 className="font-display font-700 text-xl text-slate-900">Riwayat Pemeriksaan</h1>
      </div>
      <div className="flex gap-2 mb-6">
        {["Semua","Terbaru","Similarity Tinggi","Sudah Diperbaiki"].map((f)=>(
          <button key={f} onClick={() => setFilter(f)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={filter===f?{background:"#2563eb",color:"#fff"}:{background:"#f1f5f9",color:"#64748b"}}>
            {f}
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-white border border-slate-100 overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {["Tanggal","Dokumen","Similarity","Bagian","Status",""].map((h)=>(
                <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HISTORY.map((h,i)=>{
              const {label,color,bg} = scoreLabel(h.score);
              return (
                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 text-xs text-slate-500">{h.date}</td>
                  <td className="px-5 py-4"><p className="text-xs font-semibold text-slate-700 truncate max-w-[160px]">{h.file}</p></td>
                  <td className="px-5 py-4"><span className="font-bold text-sm" style={{color}}>{h.score}%</span></td>
                  <td className="px-5 py-4 text-xs text-slate-500">{h.sections}</td>
                  <td className="px-5 py-4"><span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold" style={{background:bg,color}}>{label}</span></td>
                  <td className="px-5 py-4"><button className="text-xs font-semibold text-blue-600 hover:text-blue-700">Lihat Detail</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Root page ────────────────────────────────────────────────────────────────
export default function PlagiasPage() {
  const [screen, setScreen] = useState<Screen>("upload");
  const [fileName, setFileName] = useState("Skripsi_Final_Bab_1-5.docx");
  const [selectedSection, setSelectedSection] = useState<SimilarSection | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleAnalyze = useCallback((file: File) => {
    setFileName(file.name);
    setScreen("analyzing");
    setTimeout(() => setScreen("result"), 3000);
  }, []);

  if (showHistory) return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <TopNav />
      <HistoryScreen onBack={() => setShowHistory(false)} />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <TopNav />

      {screen === "upload" && <UploadScreen onAnalyze={handleAnalyze} />}
      {screen === "analyzing" && <AnalyzingScreen />}
      {screen === "result" && (
        <ResultScreen
          fileName={fileName}
          onDetail={(s) => { setSelectedSection(s); setScreen("detail"); }}
          onHistory={() => setShowHistory(true)}
        />
      )}
      {screen === "detail" && selectedSection && (
        <DetailScreen
          section={selectedSection}
          onParaphrase={() => setScreen("paraphrase")}
          onBack={() => setScreen("result")}
        />
      )}
      {screen === "paraphrase" && selectedSection && (
        <ParaphraseScreen
          section={selectedSection}
          onReview={() => setScreen("review")}
          onBack={() => setScreen("detail")}
        />
      )}
      {screen === "review" && (
        <ReviewScreen
          onFinish={() => setScreen("success")}
          onBack={() => setScreen("paraphrase")}
        />
      )}
      {screen === "success" && (
        <SuccessScreen
          onRecheck={() => { setScreen("upload"); }}
          onDashboard={() => setScreen("result")}
        />
      )}
    </div>
  );
}
