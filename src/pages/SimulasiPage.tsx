import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = "dashboard" | "setup-1" | "setup-2" | "setup-3" | "simulation" | "result" | "review";
type Examiner = { id: string; name: string; role: string; difficulty: string; diffColor: string; desc: string; avatar: string };
type Question = { id: number; text: string; bab: string; difficulty: "easy" | "medium" | "hard" | "expert"; followUp?: string };
type Answer = { questionId: number; text: string; score: number; metrics: Record<string, number>; strengths: string[]; weaknesses: string[]; example: string; isFollowUp?: boolean; followUpText?: string; followUpAnswer?: string; followUpScore?: number };

// ─── Static data ──────────────────────────────────────────────────────────────
const EXAMINERS: Examiner[] = [
  { id: "kritis", name: "Prof. Dr. Andi Setiawan", role: "Penguji Kritis", difficulty: "Expert", diffColor: "#ef4444", desc: "Pertanyaan tajam, detail, dan sering menguji kelemahan penelitian. Cocok untuk mahasiswa yang sudah sangat siap.", avatar: "AS" },
  { id: "akademik", name: "Dr. Siti Rahayu, M.Si.", role: "Penguji Akademik", difficulty: "Hard", diffColor: "#f97316", desc: "Fokus pada teori, metodologi, dan validitas penelitian. Pertanyaan mendalam seputar literatur.", avatar: "SR" },
  { id: "balanced", name: "Dr. Budi Hartono, M.T.", role: "Penguji Balanced", difficulty: "Medium", diffColor: "#f59e0b", desc: "Seimbang antara pertanyaan kritis dan pemahaman. Ideal untuk simulasi pertama.", avatar: "BH" },
  { id: "supportive", name: "Dra. Maya Kusuma, M.Pd.", role: "Penguji Supportive", difficulty: "Easy", diffColor: "#22c55e", desc: "Membantu membangun kepercayaan diri dengan pertanyaan bertahap dan konstruktif.", avatar: "MK" },
];

const QUESTIONS: Question[] = [
  { id: 1, text: "Apa yang menjadi latar belakang utama pemilihan topik penelitian ini?", bab: "BAB I", difficulty: "easy", followUp: "Bagaimana urgensi masalah ini dibandingkan isu serupa yang sudah diteliti sebelumnya?" },
  { id: 2, text: "Mengapa Anda memilih metode kuantitatif dibandingkan metode kualitatif dalam penelitian ini?", bab: "BAB III", difficulty: "hard", followUp: "Bagaimana Anda memastikan bahwa data yang Anda gunakan valid dan reliabel?" },
  { id: 3, text: "Jelaskan kerangka teori utama yang mendasari penelitian Anda dan relevansinya!", bab: "BAB II", difficulty: "medium" },
  { id: 4, text: "Bagaimana teknik sampling yang Anda gunakan dan apa justifikasinya?", bab: "BAB III", difficulty: "hard", followUp: "Apakah ukuran sampel Anda representatif terhadap populasi yang diteliti?" },
  { id: 5, text: "Apa keterbatasan penelitian ini dan bagaimana dampaknya terhadap generalisasi temuan?", bab: "BAB V", difficulty: "expert" },
  { id: 6, text: "Jelaskan hasil utama penelitian Anda dan kaitannya dengan hipotesis awal!", bab: "BAB IV", difficulty: "medium" },
  { id: 7, text: "Bagaimana Anda menjelaskan adanya perbedaan antara temuan Anda dengan penelitian terdahulu?", bab: "BAB IV", difficulty: "hard" },
  { id: 8, text: "Apa kontribusi orisinal penelitian ini terhadap bidang ilmu yang Anda geluti?", bab: "BAB V", difficulty: "expert" },
  { id: 9, text: "Bagaimana validitas instrumen penelitian Anda diuji?", bab: "BAB III", difficulty: "hard" },
  { id: 10, text: "Apa rekomendasi praktis yang dapat diambil dari temuan penelitian Anda?", bab: "BAB V", difficulty: "easy" },
];

const HISTORY = [
  { id: 1, date: "22 Jan 2026", examiner: "Penguji Balanced", count: 15, score: 74, readiness: "Cukup Siap", duration: "32 mnt" },
  { id: 2, date: "15 Jan 2026", examiner: "Penguji Supportive", count: 10, score: 81, readiness: "Siap", duration: "22 mnt" },
  { id: 3, date: "8 Jan 2026", examiner: "Penguji Akademik", count: 20, score: 67, readiness: "Perlu Latihan", duration: "48 mnt" },
];

const METRICS = ["Penguasaan Materi", "Metodologi", "Argumentasi", "Kejelasan Jawaban", "Konsistensi"];
const METRIC_VALUES = [85, 72, 80, 76, 81];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function readinessLabel(score: number) {
  if (score >= 85) return { label: "Sangat Siap", color: "#059669", bg: "#d1fae5" };
  if (score >= 75) return { label: "Siap", color: "#2563eb", bg: "#dbeafe" };
  if (score >= 60) return { label: "Cukup Siap", color: "#d97706", bg: "#fef3c7" };
  return { label: "Perlu Latihan", color: "#dc2626", bg: "#fee2e2" };
}
function difficultyColor(d: string) {
  const map: Record<string, string> = { easy: "#22c55e", medium: "#f59e0b", hard: "#f97316", expert: "#ef4444" };
  return map[d] ?? "#64748b";
}
function difficultyLabel(d: string) {
  const map: Record<string, string> = { easy: "Mudah", medium: "Sedang", hard: "Sulit", expert: "Expert" };
  return map[d] ?? d;
}

function mockFeedback(qId: number, answer: string): Omit<Answer, "questionId" | "text"> {
  const base = 60 + Math.floor(Math.random() * 30);
  return {
    score: base,
    metrics: { Relevansi: base + 8, Kelengkapan: base - 6, Argumentasi: base + 2, Kejelasan: base + 4 },
    strengths: ["Jawaban relevan dengan topik penelitian", "Penggunaan istilah akademik cukup tepat", "Alur penjelasan cukup sistematis"],
    weaknesses: ["Berikan argumentasi yang lebih spesifik dan mendalam", "Hubungkan dengan data atau literatur yang konkret", "Perkuat kesimpulan dengan landasan teoretis"],
    example: "Saya memilih metode kuantitatif karena penelitian ini bertujuan mengukur hubungan kausalitas antar variabel secara terukur. Data yang dikumpulkan berupa angka (skala Likert) yang dapat dianalisis secara statistik menggunakan regresi linier berganda. Pilihan ini juga didasarkan pada karakteristik populasi yang luas (n=200) sehingga generalisasi temuan lebih valid. Selain itu, metode ini sesuai dengan paradigma positivisme yang menjadi landasan penelitian ini.",
  };
}

// ─── Reusable UI atoms ────────────────────────────────────────────────────────
function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold" style={{ color, background: bg }}>{label}</span>;
}

function ProgressBar({ value, color = "#2563eb", height = 8 }: { value: number; color?: string; height?: number }) {
  return (
    <div className="flex-1 rounded-full overflow-hidden" style={{ height, background: "#f1f5f9" }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

function CircularScore({ score, size = 120 }: { score: number; size?: number }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const { label, color } = readinessLabel(score);
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={size * 0.07} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={size * 0.07}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - score / 100)} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display font-800 leading-none" style={{ fontSize: size * 0.22, color }}>{score}</span>
        <span style={{ fontSize: size * 0.085, color: "#64748b" }} className="font-medium mt-0.5">{label}</span>
      </div>
    </div>
  );
}

function ExaminerAvatar({ initials, size = 48, color = "#2563eb" }: { initials: string; size?: number; color?: string }) {
  return (
    <div className="rounded-2xl flex items-center justify-center text-white font-bold shrink-0"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${color}, ${color}aa)`, fontSize: size * 0.3 }}>
      {initials}
    </div>
  );
}

// ─── Top nav ──────────────────────────────────────────────────────────────────
function TopNav({ onBack }: { onBack?: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 bg-white border-b border-slate-100"
      style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
      <div className="flex items-center gap-6">
        <Link to="/" className="font-display font-700 text-slate-800 text-base">
          Class<span className="text-blue-600">Program</span>
        </Link>
        <nav className="hidden md:flex items-center gap-5">
          {[["Dashboard", "/"], ["Simulasi Sidang", "/simulasi"], ["Parafrase", "/parafrase"], ["Alerin", "/claro"]].map(([label, to]) => (
            <Link key={label} to={to}
              className={`text-sm font-medium transition-colors ${to === "/simulasi" ? "text-blue-600" : "text-slate-500 hover:text-slate-800"}`}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" /></svg>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>M</div>
      </div>
    </header>
  );
}

// ─── SCREEN 1: Dashboard ──────────────────────────────────────────────────────
function Dashboard({ onStart }: { onStart: () => void }) {
  const overall = 78;
  const { label, color, bg } = readinessLabel(overall);

  return (
    <div className="pt-14 min-h-screen px-6 py-8 max-w-7xl mx-auto" style={{ background: "#f8faff" }}>
      <div className="mb-8">
        <h1 className="font-display font-800 text-2xl text-slate-900 mb-1">Simulasi Sidang</h1>
        <p className="text-slate-500 text-sm">Latih kemampuan menjawab pertanyaan penguji berdasarkan skripsimu.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Hero readiness card */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-100 p-8" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex flex-col items-center">
              <CircularScore score={overall} size={140} />
              <Badge label={label} color={color} bg={bg} />
            </div>
            <div className="flex-1">
              <h2 className="font-display font-700 text-xl text-slate-800 mb-1">Seberapa siap kamu menghadapi sidang?</h2>
              <p className="text-slate-400 text-sm mb-5">Berdasarkan 3 sesi simulasi terakhirmu</p>
              <div className="space-y-3">
                {METRICS.map((m, i) => (
                  <div key={m} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-36 shrink-0">{m}</span>
                    <ProgressBar value={METRIC_VALUES[i]} color={METRIC_VALUES[i] >= 80 ? "#2563eb" : METRIC_VALUES[i] >= 70 ? "#f59e0b" : "#ef4444"} />
                    <span className="text-xs font-bold text-slate-700 w-8 text-right">{METRIC_VALUES[i]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Start card */}
        <div className="rounded-2xl p-7 flex flex-col justify-between text-white" style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)", boxShadow: "0 8px 24px rgba(37,99,235,0.3)" }}>
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <h3 className="font-display font-700 text-xl mb-2">Mulai Simulasi Baru</h3>
            <p className="text-blue-100 text-sm leading-relaxed">Pilih penguji, atur durasi, dan latih kemampuan sidangmu dengan AI.</p>
          </div>
          <button onClick={onStart}
            className="mt-6 w-full py-3.5 rounded-xl bg-white font-bold text-blue-600 text-sm hover:bg-blue-50 transition-all">
            + Mulai Simulasi
          </button>
        </div>
      </div>

      {/* History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-700 text-lg text-slate-800">Riwayat Simulasi</h2>
          <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Lihat Semua</button>
        </div>

        {HISTORY.length === 0 ? (
          <div className="rounded-2xl bg-white border border-dashed border-slate-200 p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mx-auto mb-4">🎓</div>
            <p className="font-semibold text-slate-700 mb-1">Belum ada riwayat simulasi</p>
            <p className="text-slate-400 text-sm">Mulai simulasi pertamamu untuk melihat hasilnya di sini.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {HISTORY.map((h) => {
              const r = readinessLabel(h.score);
              return (
                <div key={h.id} className="rounded-2xl bg-white border border-slate-100 p-5 hover:border-blue-200 transition-all" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">{h.date}</p>
                      <p className="text-sm font-semibold text-slate-700">{h.examiner}</p>
                    </div>
                    <Badge label={r.label} color={r.color} bg={r.bg} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    {[["Pertanyaan", h.count], ["Skor", h.score], ["Durasi", h.duration]].map(([l, v]) => (
                      <div key={String(l)} className="rounded-xl bg-slate-50 py-2">
                        <p className="font-bold text-slate-800 text-sm">{v}</p>
                        <p className="text-[10px] text-slate-400">{l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <ProgressBar value={h.score} height={6} />
                    <span className="text-xs font-bold text-slate-600">{h.score}%</span>
                  </div>
                  <button className="mt-3 w-full py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all">
                    Lihat Hasil
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SCREEN 2: Setup wizard ───────────────────────────────────────────────────
function SetupWizard({ step, onNext, onBack, config, setConfig }: {
  step: 1 | 2 | 3;
  onNext: () => void;
  onBack: () => void;
  config: SimConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimConfig>>;
}) {
  const STEPS = ["Pilih Skripsi", "Penguji", "Pengaturan", "Mulai"];
  return (
    <div className="pt-14 min-h-screen px-6 py-8 max-w-3xl mx-auto" style={{ background: "#f8faff" }}>
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                style={i + 1 < step ? { background: "#2563eb", borderColor: "#2563eb", color: "#fff" } :
                  i + 1 === step ? { background: "#fff", borderColor: "#2563eb", color: "#2563eb" } :
                    { background: "#fff", borderColor: "#e2e8f0", color: "#94a3b8" }}>
                {i + 1 < step ? "✓" : i + 1}
              </div>
              <span className="text-[10px] mt-1 font-medium" style={{ color: i + 1 === step ? "#2563eb" : "#94a3b8" }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mb-4 transition-all" style={{ background: i + 1 < step ? "#2563eb" : "#e2e8f0" }} />
            )}
          </div>
        ))}
      </div>

      {step === 1 && <SetupStep1 config={config} setConfig={setConfig} />}
      {step === 2 && <SetupStep2 config={config} setConfig={setConfig} />}
      {step === 3 && <SetupStep3 config={config} setConfig={setConfig} />}

      <div className="flex items-center justify-between mt-8">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Kembali
        </button>
        <button onClick={onNext}
          className="btn-primary px-8 py-3 text-sm flex items-center gap-2">
          {step === 3 ? (
            <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>Mulai Simulasi</>
          ) : (
            <>Lanjut<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>
          )}
        </button>
      </div>
    </div>
  );
}

function SetupStep1({ config, setConfig }: { config: SimConfig; setConfig: React.Dispatch<React.SetStateAction<SimConfig>> }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const formatBytes = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`;

  const processFile = (file: File) => {
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) return;
    setUploadedFile(file);
    setAnalyzing(true);
    setAnalyzed(false);
    setTimeout(() => { setAnalyzing(false); setAnalyzed(true); }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const removeFile = () => { setUploadedFile(null); setAnalyzed(false); setAnalyzing(false); };

  return (
    <div>
      <h2 className="font-display font-700 text-xl text-slate-900 mb-1">Upload Skripsi</h2>
      <p className="text-slate-500 text-sm mb-6">Upload file skripsimu agar AI dapat menyiapkan pertanyaan yang relevan.</p>

      <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleFileChange} />

      {!uploadedFile && !analyzing ? (
        /* Drop zone */
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className="rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center cursor-pointer transition-all mb-4"
          style={dragOver
            ? { borderColor: "#2563eb", background: "#eff6ff" }
            : { borderColor: "#cbd5e1", background: "#f8faff" }}>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className="font-semibold text-slate-700 mb-1">Drag & drop skripsi ke sini</p>
          <p className="text-xs text-slate-400 mb-4">atau klik untuk pilih file</p>
          <span className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all">
            Pilih File
          </span>
          <p className="text-[10px] text-slate-400 mt-4">PDF, DOC, DOCX, TXT · Maks. 20 MB</p>
        </div>
      ) : analyzing ? (
        /* Analyzing state */
        <div className="rounded-2xl bg-white border border-blue-100 p-6 mb-4 flex items-center gap-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <div className="w-6 h-6 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Menganalisis skripsi...</p>
            <p className="text-xs text-slate-400 mt-0.5">AI sedang membaca struktur dan konten skripsimu</p>
          </div>
        </div>
      ) : (
        /* Analyzed result */
        <div className="rounded-2xl bg-white border border-slate-200 p-6 mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-sm mb-0.5 truncate">{uploadedFile!.name}</p>
              <p className="text-xs text-slate-400 mb-3">{formatBytes(uploadedFile!.size)}</p>
              <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                Skripsi berhasil dianalisis
              </div>
            </div>
            <button onClick={removeFile} className="text-slate-300 hover:text-slate-500 transition-colors shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[["Program Studi", "Manajemen"], ["Jumlah Halaman", "127 hal"], ["Bab Terdeteksi", "5 Bab"], ["Status AI", "Siap"]].map(([l, v]) => (
              <div key={String(l)} className="rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] text-slate-400 mb-0.5">{l}</p>
                <p className="text-sm font-semibold text-slate-700">{v}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadedFile && (
        <button onClick={() => fileRef.current?.click()}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-sm font-medium text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Ganti File
        </button>
      )}
    </div>
  );
}

function SetupStep2({ config, setConfig }: { config: SimConfig; setConfig: React.Dispatch<React.SetStateAction<SimConfig>> }) {
  const colors: Record<string, string> = { kritis: "#ef4444", akademik: "#f97316", balanced: "#f59e0b", supportive: "#22c55e" };
  return (
    <div>
      <h2 className="font-display font-700 text-xl text-slate-900 mb-1">Pilih Karakter Penguji</h2>
      <p className="text-slate-500 text-sm mb-6">Setiap penguji memiliki gaya dan tingkat kesulitan yang berbeda.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {EXAMINERS.map((e) => {
          const selected = config.examinerId === e.id;
          const color = colors[e.id];
          return (
            <button key={e.id} onClick={() => setConfig((c) => ({ ...c, examinerId: e.id }))}
              className="text-left rounded-2xl p-5 border-2 transition-all duration-150"
              style={selected ? { borderColor: color, background: color + "08" } : { borderColor: "#f1f5f9", background: "#fff" }}>
              <div className="flex items-start gap-3 mb-3">
                <ExaminerAvatar initials={e.avatar} size={44} color={color} />
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-sm">{e.name}</p>
                  <p className="text-xs text-slate-500">{e.role}</p>
                </div>
                <Badge label={e.difficulty} color={color} bg={color + "18"} />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{e.desc}</p>
              {selected && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold" style={{ color }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  Dipilih
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type SimConfig = {
  examinerId: string;
  duration: number;
  questionCount: number;
  difficulty: string;
  focus: string;
  followUp: boolean;
};

function SetupStep3({ config, setConfig }: { config: SimConfig; setConfig: React.Dispatch<React.SetStateAction<SimConfig>> }) {
  return (
    <div>
      <h2 className="font-display font-700 text-xl text-slate-900 mb-1">Pengaturan Simulasi</h2>
      <p className="text-slate-500 text-sm mb-6">Sesuaikan durasi, jumlah pertanyaan, dan fokus materi.</p>
      <div className="space-y-5">
        {/* Duration */}
        <div className="rounded-2xl bg-white border border-slate-100 p-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <p className="text-sm font-semibold text-slate-700 mb-3">Durasi Simulasi</p>
          <div className="grid grid-cols-4 gap-2">
            {[15, 30, 45, 60].map((d) => (
              <button key={d} onClick={() => setConfig((c) => ({ ...c, duration: d }))}
                className="py-2.5 rounded-xl text-sm font-semibold border-2 transition-all"
                style={config.duration === d ? { borderColor: "#2563eb", background: "#eff6ff", color: "#2563eb" } : { borderColor: "#f1f5f9", color: "#64748b" }}>
                {d} mnt
              </button>
            ))}
          </div>
        </div>

        {/* Question count */}
        <div className="rounded-2xl bg-white border border-slate-100 p-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <p className="text-sm font-semibold text-slate-700 mb-3">Jumlah Pertanyaan</p>
          <div className="grid grid-cols-3 gap-2">
            {[10, 15, 20].map((q) => (
              <button key={q} onClick={() => setConfig((c) => ({ ...c, questionCount: q }))}
                className="py-2.5 rounded-xl text-sm font-semibold border-2 transition-all"
                style={config.questionCount === q ? { borderColor: "#2563eb", background: "#eff6ff", color: "#2563eb" } : { borderColor: "#f1f5f9", color: "#64748b" }}>
                {q} pertanyaan
              </button>
            ))}
          </div>
        </div>

        {/* Focus */}
        <div className="rounded-2xl bg-white border border-slate-100 p-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <p className="text-sm font-semibold text-slate-700 mb-3">Fokus Pertanyaan</p>
          <div className="flex flex-wrap gap-2">
            {["BAB I", "BAB II", "BAB III", "BAB IV", "BAB V", "Semua Bab"].map((f) => (
              <button key={f} onClick={() => setConfig((c) => ({ ...c, focus: f }))}
                className="px-4 py-2 rounded-xl text-xs font-semibold border-2 transition-all"
                style={config.focus === f ? { borderColor: "#2563eb", background: "#eff6ff", color: "#2563eb" } : { borderColor: "#f1f5f9", color: "#64748b" }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Follow-up toggle */}
        <div className="rounded-2xl bg-white border border-slate-100 p-5 flex items-center justify-between" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div>
            <p className="text-sm font-semibold text-slate-700">Pertanyaan Lanjutan</p>
            <p className="text-xs text-slate-400 mt-0.5">AI akan memberi pertanyaan lanjutan berdasarkan jawaban kamu</p>
          </div>
          <button onClick={() => setConfig((c) => ({ ...c, followUp: !c.followUp }))}
            className="relative w-11 h-6 rounded-full transition-all duration-200"
            style={{ background: config.followUp ? "#2563eb" : "#e2e8f0" }}>
            <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
              style={{ left: config.followUp ? "calc(100% - 22px)" : "2px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 3+4: Live Simulation ──────────────────────────────────────────────
function LiveSimulation({ config, questions, onFinish }: { config: SimConfig; questions: Question[]; onFinish: (answers: Answer[]) => void }) {
  const examiner = EXAMINERS.find((e) => e.id === config.examinerId) ?? EXAMINERS[2];
  const examinerColor = ({ kritis: "#ef4444", akademik: "#f97316", balanced: "#f59e0b", supportive: "#22c55e" } as Record<string, string>)[examiner.id] ?? "#2563eb";

  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<ReturnType<typeof mockFeedback> | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(config.duration * 60);
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState("");
  const timerRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const currentQ = questions[qIndex];
  const total = Math.min(questions.length, config.questionCount);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const toggleListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setMicError("Browser tidak mendukung Speech Recognition. Gunakan Chrome."); return; }
    setMicError("");

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const rec = new SR();
    rec.lang = "id-ID";
    rec.continuous = true;
    rec.interimResults = true;

    let baseText = answer;
    rec.onresult = (e: any) => {
      let interim = "";
      let final = baseText;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          final += (final ? " " : "") + e.results[i][0].transcript;
          baseText = final;
        } else {
          interim = e.results[i][0].transcript;
        }
      }
      setAnswer(final + (interim ? " " + interim : ""));
    };
    rec.onerror = () => { setListening(false); setMicError("Akses mikrofon ditolak atau terjadi error."); };
    rec.onend = () => setListening(false);

    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  }, [listening, answer]);

  const handleSubmit = useCallback(() => {
    if (!answer.trim() || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      const fb = mockFeedback(currentQ.id, answer);
      setFeedback(fb);
      setSubmitting(false);
    }, 1800);
  }, [answer, submitting, currentQ]);

  const handleNext = useCallback(() => {
    if (!feedback) return;
    const newAnswer: Answer = {
      questionId: currentQ.id,
      text: answer,
      ...feedback,
      isFollowUp: false,
    };
    const updated = [...answers, newAnswer];
    setAnswers(updated);

    if (config.followUp && currentQ.followUp && !isFollowUp) {
      setIsFollowUp(true);
      setAnswer("");
      setFeedback(null);
      return;
    }

    setIsFollowUp(false);
    setAnswer("");
    setFeedback(null);
    setFollowUpAnswer("");

    if (qIndex + 1 >= total) {
      clearInterval(timerRef.current!);
      onFinish(updated);
    } else {
      setQIndex((i) => i + 1);
    }
  }, [feedback, answer, answers, currentQ, config, isFollowUp, qIndex, total, onFinish]);

  const displayQ = isFollowUp && currentQ.followUp ? currentQ.followUp : currentQ.text;
  const urgent = timeLeft < 120;

  return (
    <div className="pt-14 h-screen flex overflow-hidden" style={{ background: "#f8faff" }}>
      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r border-slate-100 bg-white flex flex-col overflow-y-auto">
        {/* Examiner */}
        <div className="p-5 border-b border-slate-100">
          <ExaminerAvatar initials={examiner.avatar} size={56} color={examinerColor} />
          <p className="font-semibold text-slate-800 mt-3 text-sm">{examiner.name}</p>
          <Badge label={examiner.role} color={examinerColor} bg={examinerColor + "15"} />
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs text-slate-500">Sedang menguji</span>
          </div>
        </div>

        {/* Progress */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Pertanyaan {qIndex + 1} dari {total}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: urgent ? "#fee2e2" : "#dbeafe", color: urgent ? "#dc2626" : "#2563eb" }}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <ProgressBar value={((qIndex) / total) * 100} height={6} />
        </div>

        {/* Question list */}
        <div className="flex-1 p-4 space-y-1.5">
          {questions.slice(0, total).map((q, i) => {
            const done = i < qIndex;
            const active = i === qIndex;
            return (
              <div key={q.id}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all"
                style={active ? { background: "#eff6ff", border: "1px solid #bfdbfe" } : done ? { background: "#f0fdf4" } : { background: "#f8faff" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={done ? { background: "#22c55e", color: "#fff" } : active ? { background: "#2563eb", color: "#fff" } : { background: "#e2e8f0", color: "#64748b" }}>
                  {done ? "✓" : i + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-600 truncate">{q.bab}</p>
                  <p className="text-[10px] text-slate-400">{difficultyLabel(q.difficulty)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Mini header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-700">Simulasi Sidang</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">Pertanyaan {String(qIndex + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}</span>
            {isFollowUp && <Badge label="Pertanyaan Lanjutan" color="#7c3aed" bg="#f5f3ff" />}
          </div>
          <span className="text-sm font-bold tabular-nums" style={{ color: urgent ? "#dc2626" : "#2563eb" }}>
            ⏱ {formatTime(timeLeft)}
          </span>
        </div>

        <div className="flex-1 px-8 py-6 max-w-3xl mx-auto w-full">
          {/* Follow-up indicator */}
          {isFollowUp && (
            <div className="mb-4 px-4 py-3 rounded-xl border border-purple-100 bg-purple-50 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              <p className="text-xs text-purple-700 font-medium">AI mendeteksi area yang perlu diperdalam: <strong>METODOLOGI PENELITIAN</strong></p>
            </div>
          )}

          {/* Question card */}
          <div className="rounded-2xl bg-white border border-slate-100 p-7 mb-5" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3">Pertanyaan Penguji</p>
            <div className="flex items-start gap-3 mb-4">
              <ExaminerAvatar initials={examiner.avatar} size={36} color={examinerColor} />
              <p className="text-slate-800 font-medium text-base leading-relaxed">{displayQ}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge label={currentQ.bab} color="#2563eb" bg="#eff6ff" />
              <Badge label={difficultyLabel(currentQ.difficulty)} color={difficultyColor(currentQ.difficulty)} bg={difficultyColor(currentQ.difficulty) + "18"} />
            </div>
          </div>

          {/* Answer area */}
          {!feedback && (
            <div className="rounded-2xl bg-white border overflow-hidden mb-5 transition-all"
              style={{ borderColor: listening ? "#2563eb" : "#f1f5f9", boxShadow: listening ? "0 0 0 3px rgba(37,99,235,0.12)" : "0 2px 12px rgba(0,0,0,0.05)" }}>

              {/* Listening indicator bar */}
              {listening && (
                <div className="flex items-center gap-3 px-6 py-3 border-b" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
                  <div className="flex items-end gap-0.5 h-5">
                    {[0.3,0.5,0.2,0.6,0.4].map((delay, i) => (
                      <div key={i} className="w-1 rounded-full bg-blue-500 voice-bar"
                        style={{ animationDelay: `${delay}s`, animationDuration: `${0.4 + delay}s` }} />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-blue-700">Sedang merekam — bicara sekarang...</span>
                  <span className="ml-auto flex items-center gap-1 text-[10px] text-blue-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    LIVE
                  </span>
                </div>
              )}

              <div className="px-6 pt-5 pb-2">
                <textarea
                  ref={textareaRef}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={listening ? "Hasil bicara akan muncul di sini..." : "Tulis jawaban Anda sebagai mahasiswa..."}
                  rows={6}
                  className="w-full text-sm text-slate-800 placeholder-slate-300 resize-none outline-none leading-relaxed"
                  style={{ background: "transparent" }}
                />
              </div>

              <div className="flex items-center justify-between px-6 pb-4 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">{answer.length} karakter</span>

                  {/* Mic button */}
                  <button onClick={toggleListening}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={listening
                      ? { background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5" }
                      : { background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" }}>
                    {listening ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                        Stop Rekam
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>
                        Jawab dengan Suara
                      </>
                    )}
                  </button>
                </div>

                <button onClick={handleSubmit} disabled={!answer.trim() || submitting}
                  className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                  {submitting ? (
                    <><div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />Mengirim…</>
                  ) : (
                    <>Kirim Jawaban<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></>
                  )}
                </button>
              </div>

              {micError && (
                <p className="px-6 pb-3 text-xs text-red-500">{micError}</p>
              )}
            </div>
          )}

          {/* Loading state */}
          {submitting && (
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6 mb-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <div className="w-5 h-5 rounded-full border-2 border-blue-300 border-t-blue-600 animate-spin" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800">AI sedang menganalisis jawaban Anda…</p>
                <p className="text-xs text-blue-500">Mengevaluasi relevansi, argumentasi, dan kejelasan jawaban</p>
              </div>
            </div>
          )}

          {/* Feedback card */}
          {feedback && !submitting && (
            <div className="rounded-2xl bg-white border border-slate-100 overflow-hidden mb-5" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
              {/* Score header */}
              <div className="px-7 py-5 border-b border-slate-100 flex items-center gap-5"
                style={{ background: "linear-gradient(135deg,#f8faff,#eff6ff)" }}>
                <div className="text-center">
                  <p className="font-display font-800 text-4xl" style={{ color: feedback.score >= 80 ? "#059669" : feedback.score >= 65 ? "#d97706" : "#dc2626" }}>
                    {feedback.score}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">/ 100</p>
                </div>
                <div>
                  <Badge
                    label={feedback.score >= 80 ? "Sangat Baik" : feedback.score >= 65 ? "Cukup Baik" : "Perlu Perbaikan"}
                    color={feedback.score >= 80 ? "#059669" : feedback.score >= 65 ? "#d97706" : "#dc2626"}
                    bg={feedback.score >= 80 ? "#d1fae5" : feedback.score >= 65 ? "#fef3c7" : "#fee2e2"}
                  />
                  <p className="text-sm font-semibold text-slate-700 mt-1">Analisis Jawaban</p>
                  <div className="flex gap-3 mt-2">
                    {Object.entries(feedback.metrics).map(([k, v]) => (
                      <div key={k} className="text-center">
                        <p className="text-xs font-bold text-slate-700">{v}%</p>
                        <p className="text-[9px] text-slate-400">{k}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-7 py-5 grid md:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2.5">Yang sudah bagus ✓</p>
                  <ul className="space-y-1.5">
                    {feedback.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="text-emerald-500 mt-0.5 shrink-0">•</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2.5">Yang perlu diperbaiki</p>
                  <ul className="space-y-1.5">
                    {feedback.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="text-amber-500 mt-0.5 shrink-0">•</span>{w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-7 pb-5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Contoh jawaban yang lebih kuat</p>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-xs text-slate-700 leading-relaxed">{feedback.example}</p>
                </div>
              </div>

              <div className="px-7 pb-6 flex justify-end">
                <button onClick={handleNext} className="btn-primary px-7 py-3 text-sm flex items-center gap-2">
                  {qIndex + 1 >= total && !isFollowUp ? "Selesai Simulasi" : "Lanjut Pertanyaan"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── SCREEN 5: Result ─────────────────────────────────────────────────────────
function SessionResult({ answers, config, onReview, onRestart }: { answers: Answer[]; config: SimConfig; onReview: () => void; onRestart: () => void }) {
  const examiner = EXAMINERS.find((e) => e.id === config.examinerId) ?? EXAMINERS[2];
  const avg = answers.length ? Math.round(answers.reduce((s, a) => s + a.score, 0) / answers.length) : 0;
  const { label, color, bg } = readinessLabel(avg);
  const hardest = [...answers].sort((a, b) => a.score - b.score).slice(0, 3);

  return (
    <div className="pt-14 min-h-screen px-6 py-10 max-w-4xl mx-auto" style={{ background: "#f8faff" }}>
      <div className="text-center mb-10">
        <p className="text-3xl mb-2">🎓</p>
        <h1 className="font-display font-800 text-2xl text-slate-900 mb-1">Simulasi Selesai!</h1>
        <p className="text-slate-500 text-sm">Berikut analisis performa kamu selama simulasi.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Score */}
        <div className="md:col-span-1 rounded-2xl bg-white border border-slate-100 p-7 flex flex-col items-center justify-center" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
          <CircularScore score={avg} size={160} />
          <p className="text-sm font-semibold text-slate-600 mt-3">Skor Keseluruhan</p>
          <Badge label={label} color={color} bg={bg} />
          <div className="mt-4 grid grid-cols-3 gap-2 w-full text-center">
            {[["Pertanyaan", answers.length], ["Penguji", examiner.role.split(" ")[1]], ["Durasi", `${config.duration} mnt`]].map(([l, v]) => (
              <div key={String(l)} className="rounded-lg bg-slate-50 py-2 px-1">
                <p className="font-bold text-slate-700 text-xs">{v}</p>
                <p className="text-[9px] text-slate-400">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="md:col-span-2 rounded-2xl bg-white border border-slate-100 p-7" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
          <p className="font-display font-700 text-slate-800 text-base mb-5">Performa Kamu</p>
          <div className="space-y-4">
            {METRICS.map((m, i) => (
              <div key={m} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-36 shrink-0">{m}</span>
                <ProgressBar value={METRIC_VALUES[i]} color={METRIC_VALUES[i] >= 80 ? "#2563eb" : METRIC_VALUES[i] >= 70 ? "#f59e0b" : "#ef4444"} height={10} />
                <span className="text-sm font-bold text-slate-700 w-10 text-right">{METRIC_VALUES[i]}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Strengths */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <p className="font-semibold text-emerald-600 text-sm mb-4 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
            Kekuatan Kamu
          </p>
          <ul className="space-y-2">
            {["Penguasaan materi cukup baik", "Jawaban relevan dengan penelitian", "Struktur jawaban cukup sistematis"].map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-emerald-500 mt-0.5">•</span>{s}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <p className="font-semibold text-amber-600 text-sm mb-4 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 8v4M12 16h.01"/><circle cx="12" cy="12" r="10"/></svg>
            Yang Perlu Diperkuat
          </p>
          <ul className="space-y-2">
            {["Metodologi penelitian", "Validitas dan reliabilitas data", "Argumentasi pemilihan metode"].map((w) => (
              <li key={w} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-amber-500 mt-0.5">•</span>{w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="rounded-2xl border border-blue-100 p-6 mb-6" style={{ background: "#eff6ff", boxShadow: "0 2px 8px rgba(37,99,235,0.08)" }}>
        <p className="font-semibold text-blue-700 text-sm mb-2 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          Rekomendasi AI
        </p>
        <p className="text-sm text-blue-700 leading-relaxed">
          Sebelum simulasi berikutnya, pelajari kembali <strong>BAB III</strong> terutama bagian metode penelitian, teknik sampling, dan validitas data. Fokus pada kemampuan menjelaskan alasan pemilihan metodologi secara argumentatif.
        </p>
      </div>

      {/* Hardest questions */}
      <div className="rounded-2xl bg-white border border-slate-100 p-6 mb-8" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <p className="font-display font-700 text-slate-800 mb-4">Pertanyaan yang Paling Sulit</p>
        <div className="space-y-3">
          {hardest.map((a, i) => {
            const q = QUESTIONS.find((qq) => qq.id === a.questionId);
            return (
              <div key={a.questionId} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: "#fee2e2", color: "#dc2626" }}>{i + 1}</div>
                <p className="flex-1 text-sm text-slate-600 truncate">{q?.text ?? "—"}</p>
                <span className="font-bold text-sm shrink-0" style={{ color: a.score >= 65 ? "#f59e0b" : "#dc2626" }}>{a.score}/100</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={onRestart} className="btn-primary px-8 py-3.5 text-sm flex items-center justify-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
          Latihan Lagi
        </button>
        <button onClick={onReview} className="btn-outline px-8 py-3.5 text-sm">Lihat Detail Jawaban</button>
        <button className="px-8 py-3.5 text-sm font-semibold rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Laporan
        </button>
      </div>
    </div>
  );
}

// ─── SCREEN 6: Answer Review ──────────────────────────────────────────────────
function AnswerReview({ answers, onBack }: { answers: Answer[]; onBack: () => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "good" | "bad">("all");
  const [search, setSearch] = useState("");

  const filtered = answers.filter((a) => {
    const q = QUESTIONS.find((qq) => qq.id === a.questionId);
    const matchFilter = filter === "all" || (filter === "good" && a.score >= 75) || (filter === "bad" && a.score < 75);
    const matchSearch = !search || q?.text.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });
  const avg = Math.round(answers.reduce((s, a) => s + a.score, 0) / Math.max(answers.length, 1));

  return (
    <div className="pt-14 min-h-screen px-6 py-8 max-w-4xl mx-auto" style={{ background: "#f8faff" }}>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h1 className="font-display font-700 text-xl text-slate-900">Review Simulasi</h1>
          <p className="text-slate-400 text-xs">{answers.length} pertanyaan · {avg}/100 · {QUESTIONS.length > 0 ? "30" : "—"} menit</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 flex-1" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pertanyaan…"
            className="flex-1 text-sm text-slate-700 placeholder-slate-300 outline-none bg-transparent" />
        </div>
        <div className="flex gap-2">
          {([["all", "Semua"], ["good", "Sangat Baik"], ["bad", "Perlu Diperbaiki"]] as const).map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border-2 transition-all whitespace-nowrap"
              style={filter === v ? { borderColor: "#2563eb", background: "#eff6ff", color: "#2563eb" } : { borderColor: "#f1f5f9", color: "#64748b" }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion list */}
      <div className="space-y-3">
        {filtered.map((a) => {
          const q = QUESTIONS.find((qq) => qq.id === a.questionId);
          const isOpen = open === a.questionId;
          const scoreColor = a.score >= 80 ? "#059669" : a.score >= 65 ? "#d97706" : "#dc2626";
          return (
            <div key={a.questionId} className="rounded-2xl bg-white border border-slate-100 overflow-hidden transition-all" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <button onClick={() => setOpen(isOpen ? null : a.questionId)}
                className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: scoreColor + "18", color: scoreColor }}>
                  {QUESTIONS.findIndex((qq) => qq.id === a.questionId) + 1}
                </div>
                <p className="flex-1 text-sm font-medium text-slate-700 line-clamp-1">{q?.text ?? "—"}</p>
                <div className="flex items-center gap-2 shrink-0">
                  {q && <Badge label={difficultyLabel(q.difficulty)} color={difficultyColor(q.difficulty)} bg={difficultyColor(q.difficulty) + "18"} />}
                  <span className="font-bold text-sm" style={{ color: scoreColor }}>{a.score}/100</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 border-t border-slate-100 pt-5 space-y-4">
                  {/* User answer */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Jawaban Kamu</p>
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                      <p className="text-sm text-slate-700 leading-relaxed">{a.text || "—"}</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(a.metrics).map(([k, v]) => (
                      <div key={k} className="rounded-xl bg-slate-50 p-3 text-center">
                        <p className="font-bold text-slate-700 text-sm">{v}%</p>
                        <p className="text-[9px] text-slate-400">{k}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Kelebihan</p>
                      <ul className="space-y-1">
                        {a.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="text-emerald-500 shrink-0">•</span>{s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2">Kekurangan</p>
                      <ul className="space-y-1">
                        {a.weaknesses.map((w, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="text-amber-500 shrink-0">•</span>{w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">Contoh jawaban yang lebih baik</p>
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                      <p className="text-xs text-blue-800 leading-relaxed">{a.example}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl bg-white border border-slate-100 p-12 text-center">
            <p className="text-slate-400 text-sm">Tidak ada pertanyaan yang cocok.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page: state machine ─────────────────────────────────────────────────
const DEFAULT_CONFIG: SimConfig = {
  examinerId: "balanced",
  duration: 30,
  questionCount: 10,
  difficulty: "medium",
  focus: "Semua Bab",
  followUp: true,
};

export default function SimulasiPage() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [setupStep, setSetupStep] = useState<1 | 2 | 3>(1);
  const [config, setConfig] = useState<SimConfig>(DEFAULT_CONFIG);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const activeQuestions = QUESTIONS.slice(0, config.questionCount);

  const handleStartSetup = () => { setSetupStep(1); setScreen("setup-1"); };
  const handleSetupNext = () => {
    if (setupStep === 1) { setSetupStep(2); setScreen("setup-2"); }
    else if (setupStep === 2) { setSetupStep(3); setScreen("setup-3"); }
    else { setScreen("simulation"); }
  };
  const handleSetupBack = () => {
    if (setupStep === 1) setScreen("dashboard");
    else if (setupStep === 2) { setSetupStep(1); setScreen("setup-1"); }
    else { setSetupStep(2); setScreen("setup-2"); }
  };
  const handleFinish = (ans: Answer[]) => { setAnswers(ans); setScreen("result"); };
  const handleRestart = () => { setConfig(DEFAULT_CONFIG); setAnswers([]); setScreen("dashboard"); };

  const isSetup = screen === "setup-1" || screen === "setup-2" || screen === "setup-3";

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {screen !== "simulation" && <TopNav />}

      {screen === "dashboard" && <Dashboard onStart={handleStartSetup} />}

      {isSetup && (
        <SetupWizard
          step={setupStep as 1 | 2 | 3}
          onNext={handleSetupNext}
          onBack={handleSetupBack}
          config={config}
          setConfig={setConfig}
        />
      )}

      {screen === "simulation" && (
        <LiveSimulation config={config} questions={activeQuestions} onFinish={handleFinish} />
      )}

      {screen === "result" && (
        <SessionResult
          answers={answers}
          config={config}
          onReview={() => setScreen("review")}
          onRestart={handleRestart}
        />
      )}

      {screen === "review" && (
        <AnswerReview answers={answers} onBack={() => setScreen("result")} />
      )}
    </div>
  );
}
