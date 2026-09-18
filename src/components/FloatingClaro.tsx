import { useState, useRef, useEffect, useCallback } from "react";
import penguinHeadImg from "@/imports/Gambar_Kepala_Penguin_31_Agu_2026.png";
import { useNavigate } from "react-router";

// ─── Robot button icon ────────────────────────────────────────────────────────
function RobotFace({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="44" rx="14" fill="url(#rbg)" />
      {/* Face */}
      <rect x="8" y="14" width="28" height="22" rx="7" fill="#0f172a" />
      {/* Eyes */}
      <rect x="11" y="19" width="10" height="12" rx="4" fill="#22c55e" />
      <rect x="23" y="19" width="10" height="12" rx="4" fill="#22c55e" />
      {/* Shine */}
      <ellipse cx="14" cy="21" rx="2.5" ry="2" fill="white" opacity="0.4" />
      <ellipse cx="26" cy="21" rx="2.5" ry="2" fill="white" opacity="0.4" />
      {/* Antenna dot */}
      <circle cx="22" cy="9" r="3" fill="white" opacity="0.6" />
      <rect x="21" y="10" width="2" height="4" fill="white" opacity="0.4" />
      <defs>
        <linearGradient id="rbg" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Mock AI responses ────────────────────────────────────────────────────────
const QUICK_REPLIES = [
  "Bantu kerangka BAB I skripsi",
  "Cara cek plagiasi dokumen",
  "Template PPT sidang",
  "Metodologi penelitian",
];

const AI_RESPONSES: [RegExp, string][] = [
  [/bab\s*[i1]|latar belakang|kerangka/i, "Tentu! Untuk BAB I, kamu butuh: Latar Belakang → Rumusan Masalah → Tujuan → Manfaat → Batasan. Mau saya buatkan outline lengkapnya? 📝"],
  [/plagias|cek|similarity/i, "Kamu bisa pakai fitur Cek Plagiasi kami untuk memeriksa tingkat kemiripan dokumen secara real-time. Akurasinya 99%! 🔍"],
  [/ppt|slide|presentasi|sidang/i, "Kami punya 500+ template PPT sidang siap pakai dari berbagai universitas. Gratis didownload! 🎓"],
  [/metode|metodologi|kuantitat|kualitat/i, "Pilihan metode tergantung tujuan penelitianmu. Kuantitatif untuk mengukur, kualitatif untuk memahami. Mau saya jelaskan lebih lanjut? 📊"],
  [/parafrase|sinonim|ubah teks/i, "Fitur Parafrase AI kami bisa mengubah kalimatmu secara otomatis dengan 3 level intensitas. Coba sekarang! ✍️"],
  [/referensi|jurnal|sitasi|daftar pustaka/i, "Untuk referensi berkualitas, gunakan Google Scholar, Scopus, atau Garuda Kemdikbud. Mau tips cara mencarinya? 📚"],
  [/halo|hai|hello|hi|selamat/i, "Halo! Saya Alerin, asisten skripsi AI. Saya siap bantu dari metodologi hingga persiapan sidang. Ada yang bisa saya bantu? 😊"],
];

function getResponse(msg: string): string {
  for (const [pattern, reply] of AI_RESPONSES) {
    if (pattern.test(msg)) return reply;
  }
  return "Pertanyaan yang bagus! Untuk jawaban lebih lengkap, buka halaman Alerin ya. Saya siap bantu 24/7! 💙";
}

type Msg = { id: number; role: "user" | "bot"; text: string };

// ─── Component ────────────────────────────────────────────────────────────────
export default function FloatingAlerin() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { id: 0, role: "bot", text: "Halo! Saya **Alerin** 👋\nAda yang bisa saya bantu untuk skripsi atau kuliahmu?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [idCounter, setIdCounter] = useState(1);
  const [pulse, setPulse] = useState(true);
  const [unread, setUnread] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Stop pulsing after first open
  useEffect(() => {
    if (open) { setPulse(false); setUnread(0); }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const sendMsg = useCallback((text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { id: idCounter, role: "user", text: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setIdCounter((n) => n + 1);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const reply = getResponse(text);
      setMessages((m) => [...m, { id: idCounter + 1, role: "bot", text: reply }]);
      setIdCounter((n) => n + 2);
      setLoading(false);
      if (!open) setUnread((u) => u + 1);
    }, 900 + Math.random() * 500);
  }, [loading, idCounter, open]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMsg(input);
  };

  // Render bot text with basic bold
  function BotText({ text }: { text: string }) {
    return (
      <span>
        {text.split("\n").map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {line.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
              seg.startsWith("**") && seg.endsWith("**")
                ? <strong key={j}>{seg.slice(2, -2)}</strong>
                : seg
            )}
          </span>
        ))}
      </span>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">

      {/* ── Chat widget ─────────────────────────────────────────────────── */}
      {open && (
        <div
          className="flex flex-col rounded-2xl overflow-hidden"
          style={{
            width: 360,
            height: 520,
            background: "#fff",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0",
            animation: "chat-pop 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100"
            style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
            <div className="flex items-center gap-2.5">
              {/* Penguin avatar */}
              <div className="w-8 h-8 rounded-xl bg-white overflow-hidden flex items-center justify-center shrink-0">
                <img src={penguinHeadImg} alt="Alerin" style={{ width: 32, height: 32, objectFit: "contain" }} />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">Alerin</p>
                <p className="text-[10px] text-blue-200 mt-0.5">Asisten Skripsi • Online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Expand to full page */}
              <button
                onClick={() => { setOpen(false); navigate("/claro"); }}
                title="Buka halaman penuh"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
            style={{ scrollbarWidth: "none" }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {msg.role === "bot" && (
                  <div className="w-6 h-6 rounded-lg shrink-0 overflow-hidden bg-white border border-slate-100 mb-0.5">
                    <img src={penguinHeadImg} alt="Alerin" style={{ width: 24, height: 24, objectFit: "contain" }} />
                  </div>
                )}
                <div
                  className="max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                  style={msg.role === "user"
                    ? { background: "linear-gradient(135deg,#2563eb,#4f46e5)", color: "#fff", borderBottomRightRadius: 6, boxShadow: "0 2px 8px rgba(37,99,235,0.3)" }
                    : { background: "#f1f5f9", color: "#1e293b", borderBottomLeftRadius: 6 }}>
                  {msg.role === "bot" ? <BotText text={msg.text} /> : msg.text}
                </div>
              </div>
            ))}

            {/* Typing */}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="7" width="18" height="13" rx="4" fill="white" opacity="0.9" />
                    <rect x="6" y="10" width="5" height="6" rx="2.5" fill="#22c55e" />
                    <rect x="13" y="10" width="5" height="6" rx="2.5" fill="#22c55e" />
                  </svg>
                </div>
                <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-slate-100 flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-2 h-2 rounded-full bg-blue-400 block"
                      style={{ animation: `bounce-dot 1.2s ${i * 0.2}s infinite ease-in-out` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick replies — shown when few messages */}
          {messages.length <= 2 && !loading && (
            <div className="px-4 pb-2 flex flex-col gap-1.5">
              {QUICK_REPLIES.map((q) => (
                <button key={q} onClick={() => sendMsg(q)}
                  className="text-left text-xs font-medium px-3.5 py-2.5 rounded-xl border transition-all duration-150 hover:bg-blue-50"
                  style={{ borderColor: "#bfdbfe", color: "#2563eb", background: "#eff6ff" }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 pb-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ketik pertanyaanmu…"
                className="flex-1 text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none"
              />
              <button
                onClick={() => sendMsg(input)}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-30"
                style={{ background: input.trim() && !loading ? "linear-gradient(135deg,#2563eb,#4f46e5)" : "#e2e8f0" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            {/* Open full page link */}
            <button
              onClick={() => { setOpen(false); navigate("/claro"); }}
              className="w-full mt-2.5 text-center text-[11px] text-slate-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
              Buka Alerin versi lengkap
            </button>
          </div>
        </div>
      )}

      {/* ── Floating robot button ─────────────────────────────────────────── */}
      <div className="relative">
        {/* Pulse ring */}
        {pulse && !open && (
          <span className="absolute inset-0 rounded-2xl animate-ping"
            style={{ background: "rgba(37,99,235,0.3)", animationDuration: "1.8s" }} />
        )}

        {/* Unread badge */}
        {unread > 0 && !open && (
          <span className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
            style={{ boxShadow: "0 0 0 2px white" }}>
            {unread}
          </span>
        )}

        {/* Shimmer ring — only when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-2xl pointer-events-none claro-shimmer-ring" />
        )}

        <button
          onClick={() => setOpen((o) => !o)}
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 overflow-hidden"
          style={{
            background: open ? "#1e293b" : "#ffffff",
            boxShadow: open
              ? "0 4px 16px rgba(0,0,0,0.2)"
              : "0 8px 28px rgba(37,99,235,0.4), 0 2px 8px rgba(0,0,0,0.1)",
            transform: open ? "rotate(0deg) scale(0.95)" : "rotate(0deg) scale(1)",
          }}>
          {/* Sweep glare */}
          {!open && <span className="absolute inset-0 rounded-2xl claro-glare pointer-events-none" />}
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <img src={penguinHeadImg} alt="Alerin" style={{ width: 48, height: 48, objectFit: "contain", position: "relative", zIndex: 1 }} />
          )}
        </button>
      </div>

      <style>{`
        @keyframes chat-pop {
          from { opacity: 0; transform: scale(0.85) translateY(16px); transform-origin: bottom right; }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes bounce-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes claro-glare-move {
          0%   { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
          10%  { opacity: 1; }
          50%  { transform: translateX(160%) skewX(-18deg); opacity: 0.9; }
          100% { transform: translateX(160%) skewX(-18deg); opacity: 0; }
        }
        .claro-glare {
          background: linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.65) 50%, transparent 80%);
          animation: claro-glare-move 2.4s ease-in-out infinite;
          animation-delay: 0.8s;
        }
        @keyframes claro-ring-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(37,99,235,0.5), 0 0 0 0 rgba(99,102,241,0.3); }
          60%  { box-shadow: 0 0 0 10px rgba(37,99,235,0), 0 0 0 18px rgba(99,102,241,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,99,235,0), 0 0 0 0 rgba(99,102,241,0); }
        }
        .claro-shimmer-ring {
          animation: claro-ring-pulse 2.4s ease-out infinite;
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}
