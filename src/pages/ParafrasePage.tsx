import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── Synonym engine ──────────────────────────────────────────────────────────
const SYNONYMS: Record<string, string[]> = {
  "penelitian": ["kajian", "studi", "analisis", "penyelidikan"],
  "membahas": ["mengkaji", "menganalisis", "menguraikan", "menjelaskan"],
  "menunjukkan": ["memperlihatkan", "mengindikasikan", "mengungkapkan", "membuktikan"],
  "dilakukan": ["dikerjakan", "dijalankan", "dilaksanakan", "diimplementasikan"],
  "menggunakan": ["memanfaatkan", "memakai", "menerapkan", "mengaplikasikan"],
  "terdapat": ["ditemukan", "dijumpai", "ada", "terdiri dari"],
  "berdasarkan": ["berlandaskan", "sesuai dengan", "mengacu pada", "berpijak pada"],
  "bertujuan": ["dimaksudkan", "bermaksud", "difokuskan", "berorientasi"],
  "sehingga": ["oleh karena itu", "dengan demikian", "akibatnya", "maka"],
  "metode": ["pendekatan", "teknik", "cara", "prosedur"],
  "hasil": ["temuan", "luaran", "output", "capaian"],
  "dapat": ["mampu", "bisa", "sanggup", "memungkinkan"],
  "sangat": ["amat", "sungguh", "cukup", "sedemikian"],
  "juga": ["pula", "turut", "selain itu"],
  "namun": ["akan tetapi", "meski demikian", "kendati", "walau begitu"],
  "sebagai": ["selaku", "berperan sebagai", "berfungsi sebagai"],
  "hal ini": ["fenomena tersebut", "kondisi ini", "keadaan ini"],
  "meningkatkan": ["memperbesar", "menambah", "memperkuat", "mengoptimalkan"],
  "data": ["informasi", "fakta", "keterangan"],
  "menjelaskan": ["memaparkan", "menguraikan", "menerangkan", "mendeskripsikan"],
  "dibuat": ["dikembangkan", "dirancang", "dibangun", "dihasilkan"],
  "penting": ["krusial", "vital", "esensial", "signifikan"],
  "masalah": ["permasalahan", "problematika", "kendala", "isu"],
  "solusi": ["pemecahan", "jawaban", "penyelesaian", "jalan keluar"],
  "tinggi": ["besar", "signifikan", "substansial"],
  "rendah": ["kecil", "minim", "terbatas"],
  "proses": ["tahapan", "alur", "mekanisme", "prosedur"],
  "sistem": ["perangkat", "mekanisme", "kerangka", "infrastruktur"],
  "faktor": ["aspek", "variabel", "elemen", "komponen"],
  "menunjukkan bahwa": ["mengungkapkan bahwa", "membuktikan bahwa", "memperlihatkan bahwa"],
  "digunakan": ["diterapkan", "dimanfaatkan", "dipakai"],
  "secara": ["dengan cara", "melalui pendekatan", "dengan metode"],
  "tujuan": ["maksud", "sasaran", "target", "objektif"],
  "kesimpulan": ["simpulan", "konklusi", "inferensi", "rangkuman"],
  "variabel": ["faktor", "indikator", "parameter", "komponen"],
  "sampel": ["responden", "subjek penelitian", "unit analisis"],
  "populasi": ["kelompok sasaran", "subjek kajian"],
};

const STYLES = [
  { id: "academic", label: "Akademik", desc: "Bahasa formal ilmiah", icon: "🎓" },
  { id: "neutral", label: "Netral", desc: "Seimbang dan natural", icon: "⚖️" },
  { id: "simple", label: "Sederhana", desc: "Mudah dipahami", icon: "💬" },
];

const LEVELS = [
  { value: 25, label: "Ringan", color: "#22c55e" },
  { value: 55, label: "Sedang", color: "#f59e0b" },
  { value: 85, label: "Mendalam", color: "#ef4444" },
];

function doParaphrase(text: string, intensity: number): string {
  if (!text.trim()) return "";
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  return sentences.map((sentence) => {
    let result = sentence;
    const entries = Object.entries(SYNONYMS).sort(() => Math.random() - 0.5);
    const applyCount = Math.floor(entries.length * (intensity / 100));
    entries.slice(0, applyCount).forEach(([word, alternatives]) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      if (regex.test(result)) {
        const replacement = alternatives[Math.floor(Math.random() * alternatives.length)];
        result = result.replace(regex, (match) =>
          match[0] === match[0].toUpperCase()
            ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
            : replacement
        );
      }
    });
    if (intensity > 60) {
      const commaIdx = result.indexOf(",");
      if (commaIdx > 0 && commaIdx < result.length / 2 && Math.random() > 0.5) {
        const first = result.slice(0, commaIdx).trim();
        const second = result.slice(commaIdx + 1).trim().replace(/[.!?]$/, "");
        const end = result.match(/[.!?]$/)?.[0] || ".";
        if (first.length > 10 && second.length > 10) {
          result = `${second.charAt(0).toUpperCase() + second.slice(1)}, ${first.toLowerCase()}${end}`;
        }
      }
    }
    return result.trim();
  }).join(" ");
}

function wordCount(t: string) { return t.trim() ? t.trim().split(/\s+/).length : 0; }
function charCount(t: string) { return t.length; }
function sentenceCount(t: string) { return (t.match(/[.!?]+/g) || []).length; }
function uniquenessScore(original: string, result: string): number {
  if (!result) return 0;
  const origWords = new Set(original.toLowerCase().split(/\s+/));
  const resWords = result.toLowerCase().split(/\s+/);
  const matches = resWords.filter((w) => origWords.has(w)).length;
  return Math.round((1 - matches / Math.max(origWords.size, 1)) * 100);
}

// ─── Diff highlight ──────────────────────────────────────────────────────────
function DiffView({ original, result }: { original: string; result: string }) {
  const origWords = original.split(/(\s+)/);
  const resWords = result.split(/(\s+)/);
  const origSet = new Set(original.toLowerCase().split(/\s+/));

  return (
    <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
      {resWords.map((token, i) => {
        const isSpace = /^\s+$/.test(token);
        if (isSpace) return <span key={i}>{token}</span>;
        const isNew = !origSet.has(token.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""));
        return (
          <span key={i} className={isNew
            ? "rounded px-0.5 font-medium"
            : ""}
            style={isNew ? { background: "#dbeafe", color: "#1d4ed8" } : {}}>
            {token}
          </span>
        );
      })}
    </p>
  );
}

// ─── History ─────────────────────────────────────────────────────────────────
type HistoryItem = {
  id: number;
  input: string;
  output: string;
  level: number;
  style: string;
  score: number;
  timestamp: Date;
};

// ─── Main component ──────────────────────────────────────────────────────────
export default function ParafrasePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [level, setLevel] = useState(55);
  const [style, setStyle] = useState("academic");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"editor" | "diff" | "history">("editor");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIdCounter, setHistoryIdCounter] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const readFile = useCallback((file: File) => {
    setNotice(null);
    if (file.size > 5 * 1024 * 1024) { setNotice("Ukuran file maksimal 5 MB."); return; }
    setFileName(file.name);
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (e) => { setInput(e.target?.result as string || ""); setOutput(""); };
      reader.readAsText(file);
    } else {
      setInput(
        "Penelitian ini bertujuan untuk mengkaji pengaruh teknologi informasi terhadap efisiensi kerja karyawan. " +
        "Data dikumpulkan menggunakan metode survei dengan sampel sebanyak 120 responden dari berbagai perusahaan di Jakarta. " +
        "Hasil penelitian menunjukkan bahwa terdapat pengaruh yang sangat signifikan antara penggunaan teknologi informasi dan produktivitas karyawan. " +
        "Oleh karena itu, perusahaan sangat disarankan untuk meningkatkan investasi dalam infrastruktur teknologi sebagai solusi utama. " +
        "Namun, hal ini juga harus dilakukan berdasarkan analisis kebutuhan yang mendalam agar dapat memberikan hasil yang optimal dan berkelanjutan."
      );
      setOutput("");
      setNotice(`File ${file.name} diunggah. Teks contoh ditampilkan — parsing PDF/DOCX memerlukan layanan backend.`);
    }
  }, []);

  const handleParaphrase = useCallback(() => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setOutput("");
    setProgress(0);
    setActiveTab("editor");

    const duration = 1400 + Math.random() * 600;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(95, (elapsed / duration) * 100);
      setProgress(pct);
      if (elapsed < duration) requestAnimationFrame(tick);
      else {
        const result = doParaphrase(input, level);
        setOutput(result);
        setProgress(100);
        setLoading(false);
        const newItem: HistoryItem = {
          id: historyIdCounter,
          input,
          output: result,
          level,
          style,
          score: uniquenessScore(input, result),
          timestamp: new Date(),
        };
        setHistory((h) => [newItem, ...h].slice(0, 10));
        setHistoryIdCounter((n) => n + 1);
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    };
    requestAnimationFrame(tick);
  }, [input, level, style, loading, historyIdCounter]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "hasil-parafrase.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInput(""); setOutput(""); setFileName(null); setNotice(null);
    setProgress(0); setActiveTab("editor");
    if (fileRef.current) fileRef.current.value = "";
  };

  const score = output ? uniquenessScore(input, output) : null;
  const inputWordCount = wordCount(input);
  const outputWordCount = wordCount(output);
  const currentLevel = LEVELS.find((l) => l.value === level) ?? LEVELS[1];

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleParaphrase();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleParaphrase]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f8faff", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Page header */}
      <div className="pt-16" style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)" }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-5">
            <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            <span className="text-white font-medium">Parafrase Online</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                <span className="text-white/70 text-sm font-medium">AI Paraphrase Tool</span>
              </div>
              <h1 className="font-display font-800 text-3xl md:text-4xl text-white mb-2">
                Parafrase Online
              </h1>
              <p className="text-blue-100 text-sm max-w-lg">
                Ubah teks skripsimu secara otomatis menggunakan AI. Upload file atau tempel teks, pilih gaya dan intensitas, dan dapatkan hasil berkualitas akademik.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-3 shrink-0">
              {[
                { label: "Kata Diproses", value: "2.4M+" },
                { label: "Pengguna Aktif", value: "50K+" },
                { label: "Akurasi", value: "97%" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl px-4 py-3 text-center"
                  style={{ background: "rgba(255,255,255,0.12)" }}>
                  <p className="font-display font-700 text-white text-lg">{s.value}</p>
                  <p className="text-blue-200 text-[10px] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">

          {/* ─── Left sidebar: settings ─────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Style selector */}
            <div className="rounded-2xl bg-white border border-slate-100 p-5"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Gaya Bahasa</p>
              <div className="space-y-2">
                {STYLES.map((s) => (
                  <button key={s.id} onClick={() => setStyle(s.id)}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border-2 text-left transition-all duration-150"
                    style={style === s.id
                      ? { borderColor: "#2563eb", background: "#eff6ff" }
                      : { borderColor: "#f1f5f9", background: "#fff" }}>
                    <span className="text-base">{s.icon}</span>
                    <div>
                      <p className={`text-xs font-semibold ${style === s.id ? "text-blue-700" : "text-slate-700"}`}>{s.label}</p>
                      <p className="text-[10px] text-slate-400">{s.desc}</p>
                    </div>
                    {style === s.id && (
                      <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: "#2563eb" }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity slider */}
            <div className="rounded-2xl bg-white border border-slate-100 p-5"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Intensitas</p>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: currentLevel.color + "18", color: currentLevel.color }}>
                  {currentLevel.label}
                </span>
              </div>
              <div className="flex gap-2 mb-4">
                {LEVELS.map((l) => (
                  <button key={l.value} onClick={() => setLevel(l.value)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold border-2 transition-all duration-150"
                    style={level === l.value
                      ? { borderColor: l.color, background: l.color + "14", color: l.color }
                      : { borderColor: "#f1f5f9", color: "#94a3b8", background: "#fff" }}>
                    {l.label}
                  </button>
                ))}
              </div>
              <input type="range" min={10} max={95} value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer" />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-slate-400">Minimal</span>
                <span className="text-[10px] text-blue-600 font-semibold">{level}%</span>
                <span className="text-[10px] text-slate-400">Maksimal</span>
              </div>
            </div>

            {/* File upload */}
            <div className="rounded-2xl bg-white border border-slate-100 p-5"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Upload File</p>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) readFile(f); }}
                onClick={() => fileRef.current?.click()}
                className="rounded-xl border-2 border-dashed cursor-pointer p-5 text-center transition-all duration-200"
                style={{
                  borderColor: dragOver ? "#2563eb" : "#e2e8f0",
                  background: dragOver ? "#eff6ff" : "#f8faff",
                }}>
                <input ref={fileRef} type="file" accept=".txt,.pdf,.docx" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f); }} />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={dragOver ? "#2563eb" : "#94a3b8"} strokeWidth="1.8" strokeLinecap="round" className="mx-auto mb-2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {fileName ? (
                  <p className="text-xs font-semibold text-blue-600">{fileName}</p>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-slate-600 mb-0.5">Drag & drop atau klik</p>
                    <p className="text-[10px] text-slate-400">.txt · .pdf · .docx · maks 5 MB</p>
                  </>
                )}
              </div>
              {notice && (
                <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <p className="text-[10px] text-amber-700 leading-relaxed">{notice}</p>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="rounded-2xl border border-blue-100 p-5"
              style={{ background: "linear-gradient(135deg, #eff6ff, #f5f3ff)" }}>
              <p className="text-xs font-bold text-blue-700 mb-3 uppercase tracking-wider">Tips Parafrase</p>
              <ul className="space-y-2">
                {[
                  "Gunakan teks lengkap per paragraf untuk hasil terbaik",
                  "Mode Akademik cocok untuk BAB I–V skripsi",
                  "Cek hasil di tab Perbandingan untuk melihat perubahan",
                  "Shortcut: Ctrl+Enter untuk memulai parafrase",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-slate-600">
                    <span className="text-blue-400 mt-0.5">•</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ─── Right: editor + output ──────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1 rounded-xl p-1 border border-slate-100 bg-white"
                style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                {(["editor", "diff", "history"] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    disabled={tab === "diff" && !output}
                    className="px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 disabled:opacity-30"
                    style={activeTab === tab
                      ? { background: "#2563eb", color: "#fff" }
                      : { color: "#64748b" }}>
                    {tab === "editor" && "✏️ Editor"}
                    {tab === "diff" && "🔍 Perbandingan"}
                    {tab === "history" && `🕐 Riwayat${history.length > 0 ? ` (${history.length})` : ""}`}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {input && (
                  <button onClick={handleClear}
                    className="text-xs text-slate-400 hover:text-red-500 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-all">
                    Hapus Semua
                  </button>
                )}
                <span className="text-[10px] text-slate-400 px-2">Ctrl+Enter untuk proses</span>
              </div>
            </div>

            {/* ── EDITOR TAB ── */}
            {activeTab === "editor" && (
              <div className="grid md:grid-cols-2 gap-4">
                {/* Input panel */}
                <div className="flex flex-col rounded-2xl overflow-hidden border border-slate-100 bg-white"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)", minHeight: 480 }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                      <span className="text-xs font-semibold text-slate-500">Teks Asli</span>
                      {fileName && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-semibold border border-blue-100">
                          {fileName}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      <span>{inputWordCount} kata</span>
                      <span>{charCount(input)} karakter</span>
                      <span>{sentenceCount(input)} kalimat</span>
                    </div>
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setOutput(""); setFileName(null); }}
                    placeholder="Tempel teks skripsimu di sini…&#10;&#10;Contoh: Penelitian ini bertujuan untuk mengkaji..."
                    className="flex-1 p-5 text-sm leading-relaxed resize-none outline-none text-slate-700 placeholder-slate-300"
                    style={{ background: "transparent", minHeight: 380 }}
                  />
                  {/* Word count bar */}
                  <div className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden mr-3">
                      <div className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (inputWordCount / 500) * 100)}%`,
                          background: inputWordCount > 400 ? "#ef4444" : "#2563eb",
                        }} />
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{inputWordCount}/500 kata</span>
                  </div>
                </div>

                {/* Output panel */}
                <div ref={outputRef} className="flex flex-col rounded-2xl overflow-hidden border bg-white"
                  style={{
                    boxShadow: output ? "0 4px 20px rgba(37,99,235,0.1)" : "0 2px 12px rgba(0,0,0,0.04)",
                    borderColor: output ? "#bfdbfe" : "#f1f5f9",
                    minHeight: 480,
                  }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${output ? "bg-blue-500" : "bg-slate-300"}`} />
                      <span className="text-xs font-semibold text-slate-500">Hasil Parafrase</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {score !== null && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          +{score}% lebih unik
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">{outputWordCount} kata</span>
                      {output && (
                        <>
                          <button onClick={handleCopy}
                            className="flex items-center gap-1 text-[10px] font-semibold transition-colors"
                            style={{ color: copied ? "#059669" : "#2563eb" }}>
                            {copied ? (
                              <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>Disalin</>
                            ) : (
                              <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Salin</>
                            )}
                          </button>
                          <button onClick={handleDownload}
                            className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            Unduh
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 p-5 overflow-y-auto" style={{ minHeight: 380 }}>
                    {loading ? (
                      <div className="h-full flex flex-col items-center justify-center gap-5">
                        <div className="relative w-14 h-14">
                          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                            <circle cx="28" cy="28" r="24" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                            <circle cx="28" cy="28" r="24" fill="none" stroke="#2563eb" strokeWidth="4"
                              strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 24}`}
                              strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
                              style={{ transition: "stroke-dashoffset 0.1s ease" }} />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-blue-600">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-slate-700 mb-1">Memproses teks…</p>
                          <p className="text-xs text-slate-400">AI sedang menganalisis dan merestrukturisasi kalimatmu</p>
                        </div>
                      </div>
                    ) : output ? (
                      <p className="text-sm leading-relaxed text-slate-700">{output}</p>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.5">
                            <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 .49-3.5" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-slate-400">Hasil akan muncul di sini</p>
                        <p className="text-xs text-slate-300">Masukkan teks lalu klik "Parafrase Sekarang"<br />atau tekan Ctrl+Enter</p>
                      </div>
                    )}
                  </div>

                  {output && (
                    <div className="px-4 py-2.5 border-t border-blue-100 bg-blue-50/40 flex gap-4">
                      {[
                        { label: "Kata", orig: inputWordCount, res: outputWordCount },
                        { label: "Kalimat", orig: sentenceCount(input), res: sentenceCount(output) },
                      ].map((s) => (
                        <div key={s.label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <span>{s.label}:</span>
                          <span className="text-slate-400 line-through">{s.orig}</span>
                          <span>→</span>
                          <span className="font-semibold text-blue-600">{s.res}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── DIFF TAB ── */}
            {activeTab === "diff" && output && (
              <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Perbandingan Kata</span>
                  <div className="flex items-center gap-4 text-[10px]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded" style={{ background: "#dbeafe" }} />
                      <span className="text-slate-500">Kata baru / diubah</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-slate-200" />
                      <span className="text-slate-500">Tidak berubah</span>
                    </span>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                  <div className="p-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Teks Asli</p>
                    <p className="text-sm leading-relaxed text-slate-600">{input}</p>
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Hasil Parafrase</p>
                    <DiffView original={input} result={output} />
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 grid grid-cols-3 gap-4">
                  {[
                    { label: "Tingkat Orisinalitas", value: `${score}%`, color: "#059669" },
                    { label: "Kata Diubah", value: `${outputWordCount - (outputWordCount - Math.round(outputWordCount * ((score ?? 0) / 100)))}`, color: "#2563eb" },
                    { label: "Intensitas Digunakan", value: `${level}%`, color: currentLevel.color },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="font-display font-800 text-xl" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── HISTORY TAB ── */}
            {activeTab === "history" && (
              <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Riwayat Parafrase</span>
                  {history.length > 0 && (
                    <button onClick={() => setHistory([])}
                      className="text-[10px] text-red-400 hover:text-red-600 font-medium transition-colors">
                      Hapus Semua
                    </button>
                  )}
                </div>
                {history.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-slate-400 text-sm">Belum ada riwayat parafrase</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                    {history.map((h) => (
                      <div key={h.id} className="p-5 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400">#{h.id}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600">
                              {STYLES.find((s) => s.id === h.style)?.label}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                              style={{
                                background: (LEVELS.find((l) => l.value === h.level)?.color ?? "#94a3b8") + "18",
                                color: LEVELS.find((l) => l.value === h.level)?.color ?? "#94a3b8",
                              }}>
                              {h.level}% intensitas
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-emerald-600 font-bold">+{h.score}% unik</span>
                            <span className="text-[10px] text-slate-400">
                              {h.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{h.output}</p>
                        <div className="flex gap-2">
                          <button onClick={() => { setInput(h.input); setOutput(h.output); setActiveTab("editor"); }}
                            className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg bg-blue-50 transition-colors">
                            Muat Kembali
                          </button>
                          <button onClick={() => navigator.clipboard.writeText(h.output)}
                            className="text-[10px] font-semibold text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg bg-slate-100 transition-colors">
                            Salin Hasil
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── Action bar ─────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleParaphrase}
                disabled={!input.trim() || loading}
                className="flex-1 btn-primary flex items-center justify-center gap-2.5 py-3.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none">
                {loading ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />Memparafrase… ({Math.round(progress)}%)</>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 .49-3.5" />
                    </svg>
                    Parafrase Sekarang
                    <span className="opacity-60 text-xs">(Ctrl+Enter)</span>
                  </>
                )}
              </button>

              {output && (
                <>
                  <button onClick={handleCopy}
                    className="btn-outline flex items-center justify-center gap-2 px-5 py-3.5 text-sm"
                    style={{ color: copied ? "#059669" : undefined, borderColor: copied ? "#059669" : undefined }}>
                    {copied
                      ? <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>Disalin!</>
                      : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Salin Teks</>}
                  </button>
                  <button onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold rounded-xl border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Unduh .txt
                  </button>
                  <button onClick={() => setActiveTab("diff")}
                    className="flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold rounded-xl border-2 border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                    Bandingkan
                  </button>
                </>
              )}
            </div>

            {/* Score card — shown after result */}
            {output && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Kata Asli", value: inputWordCount, icon: "📝" },
                  { label: "Kata Hasil", value: outputWordCount, icon: "✍️" },
                  { label: "Tingkat Unik", value: `${score}%`, icon: "⭐" },
                  { label: "Kalimat", value: sentenceCount(output), icon: "📋" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-slate-100 bg-white p-4 flex flex-col items-center text-center"
                    style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                    <span className="text-lg mb-1">{s.icon}</span>
                    <span className="font-display font-800 text-xl text-blue-600">{s.value}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
