import { useState, useRef, useCallback } from "react";
import { Link } from "react-router";

// ─── Types ────────────────────────────────────────────────────────────────────
type ErrorCategory = "ejaan" | "grammar" | "tanda-baca" | "gaya" | "redundansi" | "konsistensi";
type ErrorSeverity = "error" | "warning" | "info";
type GrammarError = {
  id: number;
  start: number;
  end: number;
  word: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  suggestion: string;
  explanation: string;
  confidence: number;
  ignored?: boolean;
  fixed?: boolean;
};

type Screen = "editor" | "score" | "review" | "upload";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORY_META: Record<ErrorCategory, { label: string; color: string; bg: string; border: string }> = {
  ejaan:       { label: "Ejaan",            color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
  grammar:     { label: "Tata Bahasa",      color: "#9333ea", bg: "#faf5ff", border: "#d8b4fe" },
  "tanda-baca":{ label: "Tanda Baca",       color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
  gaya:        { label: "Gaya Akademik",    color: "#0284c7", bg: "#f0f9ff", border: "#7dd3fc" },
  redundansi:  { label: "Redundansi",       color: "#ea580c", bg: "#fff7ed", border: "#fdba74" },
  konsistensi: { label: "Konsistensi",      color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
};

const SAMPLE_TEXT = `Penelitian ini membahas tentang pengaruh media sosial terhadap produktivitas mahasiswa. Penelitian dilakukan dengan metoda kualitatif dan melibatkan 100 responden. Data dikumpulkan oleh peneliti melalui wawancara mendalam dan questionnaire yang dibagikan secara online. Hasil daripada penelitian menunjukkan bahwa penggunaan media sosial yang berlebihan dapat menurunkan produktivitas mahasiswa secara signifikan. Oleh karena itu, peneliti merekomendasikan agar mahasiswa lebih bijak dalam menggunakan media sosial supaya produktivitas mereka tidak terganggu.`;

const DEMO_ERRORS: GrammarError[] = [
  { id: 1, start: 22, end: 38, word: "membahas tentang", category: "redundansi", severity: "error", suggestion: "membahas", explanation: "Kata 'tentang' tidak diperlukan karena verba 'membahas' sudah mengandung makna pembahasan terhadap suatu topik.", confidence: 98 },
  { id: 2, start: 116, end: 122, word: "metoda", category: "ejaan", severity: "error", suggestion: "metode", explanation: "Penulisan yang baku menurut KBBI adalah 'metode', bukan 'metoda'.", confidence: 99 },
  { id: 3, start: 221, end: 233, word: "questionnaire", category: "konsistensi", severity: "warning", suggestion: "kuesioner", explanation: "Gunakan istilah bahasa Indonesia 'kuesioner' secara konsisten dalam karya ilmiah.", confidence: 95 },
  { id: 4, start: 258, end: 268, word: "Data dikumpulkan oleh peneliti", category: "gaya", severity: "warning", suggestion: "Peneliti mengumpulkan data", explanation: "Kalimat pasif berlebihan dalam konteks ini. Kalimat aktif lebih dianjurkan dalam penulisan akademik.", confidence: 87 },
  { id: 5, start: 322, end: 335, word: "Hasil daripada", category: "grammar", severity: "error", suggestion: "Hasil", explanation: "Penggunaan 'daripada' di sini tidak tepat secara tata bahasa. Kata 'daripada' digunakan untuk membandingkan, bukan menunjukkan kepemilikan.", confidence: 97 },
];

const SCORE_BREAKDOWN = [
  { label: "Ejaan", value: 96, color: "#2563eb" },
  { label: "Tata Bahasa", value: 91, color: "#9333ea" },
  { label: "Tanda Baca", value: 88, color: "#d97706" },
  { label: "Gaya Akademik", value: 94, color: "#0284c7" },
  { label: "Konsistensi Istilah", value: 90, color: "#059669" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function SeverityDot({ severity }: { severity: ErrorSeverity }) {
  const colors: Record<ErrorSeverity, string> = { error: "#dc2626", warning: "#d97706", info: "#2563eb" };
  return <span className="w-2 h-2 rounded-full shrink-0 mt-0.5" style={{ background: colors[severity] }} />;
}

function CategoryBadge({ cat }: { cat: ErrorCategory }) {
  const m = CATEGORY_META[cat];
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
      style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
      {m.label}
    </span>
  );
}

function CircularScore({ score, size = 120 }: { score: number; size?: number }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const color = score >= 90 ? "#059669" : score >= 75 ? "#2563eb" : "#d97706";
  const label = score >= 90 ? "Sangat Baik" : score >= 75 ? "Baik" : "Perlu Perbaikan";
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={size * 0.07} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={size * 0.07}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display font-800 leading-none" style={{ fontSize: size * 0.22, color }}>{score}</span>
        <span style={{ fontSize: size * 0.09, color: "#64748b" }} className="font-medium">{label}</span>
      </div>
    </div>
  );
}

function ProgressBar({ value, color = "#2563eb", height = 8 }: { value: number; color?: string; height?: number }) {
  return (
    <div className="flex-1 rounded-full overflow-hidden" style={{ height, background: "#f1f5f9" }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

// ─── Inline highlighted text renderer ────────────────────────────────────────
function HighlightedText({
  text, errors, selectedId, onSelect,
}: {
  text: string;
  errors: GrammarError[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const active = errors.filter((e) => !e.ignored && !e.fixed);
  if (!text) return null;

  // Build segments
  const segments: Array<{ text: string; error?: GrammarError }> = [];
  let cursor = 0;

  const sorted = [...active].sort((a, b) => a.start - b.start);
  for (const err of sorted) {
    if (err.start > cursor) segments.push({ text: text.slice(cursor, err.start) });
    segments.push({ text: text.slice(err.start, err.end), error: err });
    cursor = err.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });

  return (
    <span>
      {segments.map((seg, i) => {
        if (!seg.error) return <span key={i}>{seg.text}</span>;
        const m = CATEGORY_META[seg.error.category];
        const isSelected = selectedId === seg.error.id;
        return (
          <mark key={i}
            onClick={() => onSelect(seg.error!.id)}
            className="cursor-pointer rounded-sm transition-all"
            style={{
              background: isSelected ? m.bg : "transparent",
              borderBottom: `2px ${seg.error.severity === "error" ? "solid" : "dashed"} ${m.color}`,
              color: "inherit",
              padding: "0 1px",
              outline: isSelected ? `2px solid ${m.color}` : "none",
            }}>
            {seg.text}
          </mark>
        );
      })}
    </span>
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
          {[
            ["Beranda", "/"],
            ["Grammar Checker", "/grammar"],
            ["Parafrase", "/parafrase"],
            ["Simulasi Sidang", "/simulasi"],
            ["Alerin", "/claro"],
          ].map(([label, to]) => (
            <Link key={label} to={to}
              className={`text-sm font-medium transition-colors ${to === "/grammar" ? "text-blue-600" : "text-slate-500 hover:text-slate-800"}`}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Kembali
        </Link>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>M</div>
      </div>
    </header>
  );
}

// ─── EDITOR SCREEN ────────────────────────────────────────────────────────────
function EditorScreen({ onDone }: { onDone: () => void }) {
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<GrammarError[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [filterCat, setFilterCat] = useState<ErrorCategory | "all">("all");
  const [mode, setMode] = useState<"edit" | "view">("edit");
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedError = errors.find((e) => e.id === selectedId && !e.ignored && !e.fixed) ?? null;

  const analyze = useCallback(() => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setAnalyzed(false);
    setErrors([]);
    setSelectedId(null);
    setTimeout(() => {
      // map demo errors to actual positions in the current text
      const mapped: GrammarError[] = [];
      for (const demo of DEMO_ERRORS) {
        const idx = text.indexOf(demo.word);
        if (idx !== -1) {
          mapped.push({ ...demo, start: idx, end: idx + demo.word.length });
        }
      }
      setErrors(mapped);
      setAnalyzing(false);
      setAnalyzed(true);
      setMode("view");
    }, 1800);
  }, [text]);

  const applyFix = useCallback((id: number) => {
    setErrors((prev) => prev.map((e) => {
      if (e.id !== id) return e;
      const before = text.slice(0, e.start);
      const after = text.slice(e.end);
      setText(before + e.suggestion + after);
      return { ...e, fixed: true };
    }));
    setSelectedId(null);
  }, [text]);

  const ignoreError = useCallback((id: number) => {
    setErrors((prev) => prev.map((e) => e.id === id ? { ...e, ignored: true } : e));
    setSelectedId(null);
  }, []);

  const activeErrors = errors.filter((e) => !e.ignored && !e.fixed);
  const filtered = filterCat === "all" ? activeErrors : activeErrors.filter((e) => e.category === filterCat);
  const errorCount = activeErrors.filter((e) => e.severity === "error").length;
  const warnCount = activeErrors.filter((e) => e.severity === "warning").length;
  const score = analyzed ? Math.round(100 - errorCount * 4 - warnCount * 2) : 0;

  const loadSample = () => {
    setText(SAMPLE_TEXT);
    setAnalyzed(false);
    setErrors([]);
    setMode("edit");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setText(ev.target?.result as string ?? ""); setMode("edit"); setAnalyzed(false); setErrors([]); };
    reader.readAsText(file);
    e.target.value = "";
  };

  const CATS = Object.entries(CATEGORY_META) as [ErrorCategory, typeof CATEGORY_META[ErrorCategory]][];

  return (
    <div className="pt-14 h-screen flex flex-col overflow-hidden" style={{ background: "#f8faff" }}>
      {/* Page header */}
      <div className="shrink-0 px-8 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="font-display font-800 text-xl text-slate-900">Grammar Checker</h1>
          <p className="text-slate-400 text-xs mt-0.5">Periksa ejaan, tata bahasa, dan gaya akademik skripsimu.</p>
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileRef} type="file" accept=".txt,.pdf,.doc,.docx" className="hidden" onChange={handleFileUpload} />
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload Dokumen
          </button>
          <button onClick={loadSample}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            Coba Teks Contoh
          </button>
          {analyzed && (
            <button onClick={onDone}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              Lihat Skor
            </button>
          )}
          <button onClick={analyze} disabled={!text.trim() || analyzing}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
            {analyzing ? (
              <><div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />Memeriksa…</>
            ) : (
              <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>Periksa Grammar</>
            )}
          </button>
        </div>
      </div>

      {/* Main two-column layout */}
      <div className="flex flex-1 min-h-0">
        {/* LEFT: Editor */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-slate-100">
          {/* Toolbar */}
          <div className="shrink-0 flex items-center gap-1 px-4 py-2 border-b border-slate-100 bg-white">
            {[
              <svg key="u" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h11a8 8 0 0 1 0 16H3v-4h11a4 4 0 0 0 0-8H3V10z"/><path d="M3 14h11"/><path d="M3 10V3"/></svg>,
              <svg key="i" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>,
              <svg key="b" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>,
            ].map((icon, i) => (
              <button key={i} className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all">{icon}</button>
            ))}
            <div className="w-px h-5 bg-slate-200 mx-1" />
            <div className="flex items-center gap-1 ml-auto">
              {(["edit", "view"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className="px-2.5 py-1 rounded text-[11px] font-semibold transition-all"
                  style={mode === m ? { background: "#eff6ff", color: "#2563eb" } : { color: "#94a3b8" }}>
                  {m === "edit" ? "Edit" : "Review"}
                </button>
              ))}
              <span className="text-[11px] text-slate-400 ml-3">{text.length} karakter · {text.split(/\s+/).filter(Boolean).length} kata</span>
            </div>
          </div>

          {/* Editor content */}
          <div className="flex-1 overflow-y-auto relative">
            {!text && !analyzing ? (
              /* Empty state */
              <div className="h-full flex flex-col items-center justify-center px-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <h3 className="font-display font-700 text-lg text-slate-700 mb-2">Mulai Periksa Tulisanmu</h3>
                <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-6">
                  Tempel teks atau upload dokumen skripsimu untuk menemukan kesalahan ejaan, grammar, dan gaya akademik.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => { setText(""); setTimeout(() => document.getElementById("main-textarea")?.focus(), 100); }}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
                    Paste Text
                  </button>
                  <button onClick={() => fileRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all">
                    Upload Dokumen
                  </button>
                </div>
              </div>
            ) : mode === "view" && analyzed ? (
              /* Highlighted view */
              <div className="p-8 max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-6 p-4 rounded-xl border"
                  style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    Pemeriksaan selesai
                  </div>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500">{activeErrors.length} masalah ditemukan — klik kata bergaris untuk detail</span>
                </div>
                <p className="text-[15px] leading-loose text-slate-800" style={{ fontFamily: "Georgia, serif" }}>
                  <HighlightedText text={text} errors={errors} selectedId={selectedId} onSelect={setSelectedId} />
                </p>
              </div>
            ) : (
              /* Raw textarea */
              <div className="flex h-full">
                {/* Line numbers */}
                <div className="shrink-0 w-10 pt-8 text-right pr-3 select-none" style={{ color: "#cbd5e1", fontSize: 12, lineHeight: "1.75rem" }}>
                  {text.split("\n").map((_, i) => <div key={i}>{i + 1}</div>)}
                </div>
                <textarea
                  id="main-textarea"
                  value={text}
                  onChange={(e) => { setText(e.target.value); setAnalyzed(false); setErrors([]); }}
                  placeholder="Tulis atau tempel teks skripsimu di sini..."
                  className="flex-1 p-8 pl-2 text-sm text-slate-800 placeholder-slate-300 resize-none outline-none leading-loose bg-transparent"
                  style={{ fontFamily: "Georgia, serif", fontSize: 15 }}
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Analysis panel */}
        <div className="w-80 shrink-0 flex flex-col bg-white overflow-y-auto">
          {!analyzed ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-2xl">📋</div>
              <p className="font-semibold text-slate-700 text-sm mb-1">Hasil Analisis</p>
              <p className="text-slate-400 text-xs leading-relaxed">Klik "Periksa Grammar" untuk memulai analisis teks.</p>
            </div>
          ) : (
            <>
              {/* Score */}
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <CircularScore score={score} size={80} />
                  <div>
                    <p className="font-display font-700 text-slate-800 text-sm mb-1">Hasil Analisis</p>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-xs text-slate-600">{errorCount} Kesalahan</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-xs text-slate-600">{warnCount} Saran</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs text-slate-600">
                        {Math.max(0, 100 - (errorCount + warnCount) * 4)}% Kalimat Baik
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={onDone}
                  className="mt-4 w-full py-2 rounded-xl text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all">
                  Lihat Skor Lengkap →
                </button>
              </div>

              {/* Category filter */}
              <div className="p-4 border-b border-slate-100">
                <div className="flex flex-wrap gap-1.5">
                  <button onClick={() => setFilterCat("all")}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
                    style={filterCat === "all" ? { background: "#eff6ff", color: "#2563eb" } : { background: "#f8faff", color: "#64748b" }}>
                    Semua ({activeErrors.length})
                  </button>
                  {CATS.map(([key, m]) => {
                    const count = activeErrors.filter((e) => e.category === key).length;
                    if (!count) return null;
                    return (
                      <button key={key} onClick={() => setFilterCat(key)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
                        style={filterCat === key ? { background: m.bg, color: m.color, border: `1px solid ${m.border}` } : { background: "#f8faff", color: "#64748b" }}>
                        {m.label} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error list */}
              <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-2xl mb-2">✅</p>
                    <p className="text-sm font-semibold text-slate-700">Tidak ditemukan kesalahan</p>
                    <p className="text-xs text-slate-400 mt-1">pada kategori ini</p>
                  </div>
                ) : (
                  filtered.map((err) => {
                    const m = CATEGORY_META[err.category];
                    const isSelected = selectedId === err.id;
                    return (
                      <div key={err.id}>
                        <button
                          onClick={() => { setSelectedId(isSelected ? null : err.id); setMode("view"); }}
                          className="w-full text-left px-4 py-3.5 border-b border-slate-100 hover:bg-slate-50 transition-all"
                          style={isSelected ? { background: m.bg } : {}}>
                          <div className="flex items-start gap-2 mb-1.5">
                            <SeverityDot severity={err.severity} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <CategoryBadge cat={err.category} />
                              </div>
                              <p className="text-xs text-slate-700 font-medium line-through decoration-red-400 truncate">"{err.word}"</p>
                              <p className="text-xs text-emerald-700 font-semibold">→ "{err.suggestion}"</p>
                            </div>
                          </div>
                        </button>

                        {/* Inline detail when selected */}
                        {isSelected && (
                          <div className="px-4 py-4 border-b border-slate-200 bg-white" style={{ boxShadow: "inset 0 2px 8px rgba(0,0,0,0.04)" }}>
                            <p className="text-xs text-slate-500 leading-relaxed mb-3">{err.explanation}</p>
                            <div className="flex items-center gap-1.5 mb-4">
                              <span className="text-[10px] text-slate-400">Kepercayaan AI:</span>
                              <div className="flex-1">
                                <ProgressBar value={err.confidence} height={5} color="#2563eb" />
                              </div>
                              <span className="text-[10px] font-bold text-blue-600">{err.confidence}%</span>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => applyFix(err.id)}
                                className="flex-1 py-2 rounded-lg text-xs font-bold text-white transition-all"
                                style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
                                ✓ Terapkan
                              </button>
                              <button onClick={() => ignoreError(err.id)}
                                className="flex-1 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">
                                Abaikan
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {activeErrors.length > 0 && (
                <div className="p-4 border-t border-slate-100">
                  <button onClick={() => { activeErrors.forEach((e) => applyFix(e.id)); }}
                    className="w-full py-2.5 rounded-xl text-xs font-bold border-2 border-blue-200 text-blue-600 hover:bg-blue-50 transition-all">
                    Perbaiki Semua ({activeErrors.length})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SCORE SCREEN ─────────────────────────────────────────────────────────────
function ScoreScreen({ onBack, onReview }: { onBack: () => void; onReview: () => void }) {
  return (
    <div className="pt-14 min-h-screen px-6 py-10 max-w-4xl mx-auto" style={{ background: "#f8faff" }}>
      <div className="text-center mb-10">
        <p className="text-3xl mb-2">📝</p>
        <h1 className="font-display font-800 text-2xl text-slate-900 mb-1">Analisis Grammar Selesai</h1>
        <p className="text-slate-500 text-sm">Berikut ringkasan kualitas tulisanmu.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Hero score */}
        <div className="rounded-2xl bg-white border border-slate-100 p-8 flex flex-col items-center" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
          <CircularScore score={92} size={150} />
          <p className="mt-4 text-sm font-semibold text-slate-600">Skor Keseluruhan</p>
          <div className="mt-4 grid grid-cols-3 gap-2 w-full text-center">
            {[["Kesalahan", "3"], ["Saran", "4"], ["Kalimat Baik", "18"]].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-slate-50 py-2">
                <p className="font-bold text-slate-700 text-sm">{v}</p>
                <p className="text-[9px] text-slate-400">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        <div className="md:col-span-2 rounded-2xl bg-white border border-slate-100 p-7" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
          <p className="font-display font-700 text-slate-800 mb-5">Breakdown per Kategori</p>
          <div className="space-y-4">
            {SCORE_BREAKDOWN.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-40 shrink-0">{s.label}</span>
                <ProgressBar value={s.value} color={s.color} height={10} />
                <span className="text-sm font-bold text-slate-700 w-10 text-right">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: "🔴", label: "3 Kesalahan", desc: "Wajib diperbaiki", bg: "#fef2f2", border: "#fca5a5", color: "#dc2626" },
          { icon: "🟡", label: "4 Saran", desc: "Disarankan diperbaiki", bg: "#fffbeb", border: "#fcd34d", color: "#d97706" },
          { icon: "🟢", label: "18 Kalimat Baik", desc: "Tidak perlu perubahan", bg: "#ecfdf5", border: "#6ee7b7", color: "#059669" },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl p-5 border" style={{ background: c.bg, borderColor: c.border }}>
            <p className="text-2xl mb-2">{c.icon}</p>
            <p className="font-bold text-slate-800">{c.label}</p>
            <p className="text-xs mt-0.5" style={{ color: c.color }}>{c.desc}</p>
          </div>
        ))}
      </div>

      {/* AI Rec */}
      <div className="rounded-2xl border border-blue-100 p-6 mb-8" style={{ background: "#eff6ff" }}>
        <p className="font-semibold text-blue-700 text-sm mb-2 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          Rekomendasi AI
        </p>
        <p className="text-sm text-blue-700 leading-relaxed">
          Secara umum tulisan sudah cukup baik. Fokus perbaikan utama terdapat pada <strong>tanda baca</strong> dan <strong>konsistensi istilah</strong>. Perhatikan juga penggunaan kata 'metoda' yang seharusnya 'metode' sesuai KBBI.
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        <button onClick={onReview}
          className="px-8 py-3.5 rounded-xl text-sm font-bold text-white flex items-center gap-2"
          style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
          Review Semua Perbaikan
        </button>
        <button onClick={onBack}
          className="px-8 py-3.5 rounded-xl text-sm font-semibold border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
          Kembali ke Editor
        </button>
      </div>
    </div>
  );
}

// ─── REVIEW SCREEN ────────────────────────────────────────────────────────────
const REVIEW_ITEMS = [
  { id: 1, before: "Penelitian ini membahas tentang pengaruh", after: "Penelitian ini membahas pengaruh", cat: "redundansi" as ErrorCategory, reason: "Menghilangkan kata yang tidak diperlukan agar kalimat lebih efektif." },
  { id: 2, before: "dilakukan dengan metoda kualitatif", after: "dilakukan dengan metode kualitatif", cat: "ejaan" as ErrorCategory, reason: "Menggunakan bentuk ejaan baku KBBI 'metode'." },
  { id: 3, before: "questionnaire yang dibagikan", after: "kuesioner yang dibagikan", cat: "konsistensi" as ErrorCategory, reason: "Menggunakan istilah bahasa Indonesia yang konsisten." },
  { id: 4, before: "Data dikumpulkan oleh peneliti", after: "Peneliti mengumpulkan data", cat: "gaya" as ErrorCategory, reason: "Kalimat aktif lebih efektif dan dianjurkan dalam penulisan akademik." },
  { id: 5, before: "Hasil daripada penelitian", after: "Hasil penelitian", cat: "grammar" as ErrorCategory, reason: "Penggunaan 'daripada' tidak tepat; kata ini untuk perbandingan, bukan kepemilikan." },
];

function ReviewScreen({ onBack, onFinish }: { onBack: () => void; onFinish: () => void }) {
  const [current, setCurrent] = useState(0);
  const [applied, setApplied] = useState<Set<number>>(new Set());
  const [skipped, setSkipped] = useState<Set<number>>(new Set());

  const item = REVIEW_ITEMS[current];
  const isApplied = applied.has(item.id);
  const isSkipped = skipped.has(item.id);
  const m = CATEGORY_META[item.cat];
  const allDone = applied.size + skipped.size === REVIEW_ITEMS.length;

  return (
    <div className="pt-14 min-h-screen px-6 py-10 max-w-4xl mx-auto" style={{ background: "#f8faff" }}>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-700 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h1 className="font-display font-700 text-xl text-slate-900">Review Perbaikan</h1>
          <p className="text-slate-400 text-xs">Perubahan {current + 1} dari {REVIEW_ITEMS.length}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-slate-400">{applied.size} diterapkan · {skipped.size} dilewati</span>
          {allDone && (
            <button onClick={onFinish}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>
              Selesai
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5 mb-8">
        {REVIEW_ITEMS.map((r, i) => (
          <div key={r.id} className="flex-1 h-1.5 rounded-full transition-all"
            style={{
              background: applied.has(r.id) ? "#059669" : skipped.has(r.id) ? "#94a3b8" : i === current ? "#2563eb" : "#e2e8f0"
            }} />
        ))}
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Before/After comparison */}
        <div className="md:col-span-3 space-y-4">
          <div className="rounded-2xl bg-white border border-slate-100 overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2 bg-red-50">
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Sebelum</span>
            </div>
            <p className="px-6 py-5 text-sm text-slate-700 leading-loose" style={{ fontFamily: "Georgia, serif" }}>
              {item.before.split(new RegExp(`(${item.before.replace(item.after, "").trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "g")).map((part, i) =>
                i % 2 === 1 ? (
                  <mark key={i} className="rounded px-0.5 font-medium" style={{ background: "#fee2e2", color: "#dc2626" }}>{part}</mark>
                ) : <span key={i}>{part}</span>
              )}
              ...
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2 bg-emerald-50">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Sesudah</span>
            </div>
            <p className="px-6 py-5 text-sm text-slate-700 leading-loose" style={{ fontFamily: "Georgia, serif" }}>
              {item.after}...
              {item.after !== item.before && (
                <mark className="ml-1 rounded px-1 py-0.5 text-xs" style={{ background: "#dcfce7", color: "#059669" }}>diubah</mark>
              )}
            </p>
          </div>
        </div>

        {/* Detail panel */}
        <div className="md:col-span-2 rounded-2xl bg-white border border-slate-100 p-6 flex flex-col" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <CategoryBadge cat={item.cat} />
          <p className="font-display font-700 text-slate-800 mt-3 mb-2 text-sm">Alasan Perubahan</p>
          <p className="text-xs text-slate-500 leading-relaxed flex-1">{item.reason}</p>
          <div className="mt-6 space-y-2">
            <button
              onClick={() => { setApplied((p) => new Set([...p, item.id])); if (current < REVIEW_ITEMS.length - 1) setCurrent((c) => c + 1); }}
              disabled={isApplied}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
              {isApplied ? "✓ Diterapkan" : "Terapkan"}
            </button>
            <button
              onClick={() => { setSkipped((p) => new Set([...p, item.id])); if (current < REVIEW_ITEMS.length - 1) setCurrent((c) => c + 1); }}
              disabled={isSkipped}
              className="w-full py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-60">
              {isSkipped ? "Dilewati" : "Lewati"}
            </button>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
              className="flex-1 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-all flex items-center justify-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Prev
            </button>
            <button onClick={() => setCurrent((c) => Math.min(REVIEW_ITEMS.length - 1, c + 1))} disabled={current === REVIEW_ITEMS.length - 1}
              className="flex-1 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-all flex items-center justify-center gap-1">
              Next
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function GrammarPage() {
  const [screen, setScreen] = useState<Screen>("editor");

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <TopNav />
      {screen === "editor" && <EditorScreen onDone={() => setScreen("score")} />}
      {screen === "score" && <ScoreScreen onBack={() => setScreen("editor")} onReview={() => setScreen("review")} />}
      {screen === "review" && <ReviewScreen onBack={() => setScreen("score")} onFinish={() => setScreen("editor")} />}
    </div>
  );
}
