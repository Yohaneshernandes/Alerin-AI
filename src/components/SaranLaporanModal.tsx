import React, { useState, useEffect } from "react";

export interface SaranLaporanModalProps {
  onClose: () => void;
  onToast?: (msg: string, type?: "success" | "info" | "warning") => void;
  isDark?: boolean;
}

export type FeedbackCategory = "saran" | "kendala" | "lainnya";

export default function SaranLaporanModal({
  onClose,
  onToast,
  isDark: propIsDark,
}: SaranLaporanModalProps) {
  // Cek theme dari prop atau dari class document
  const isDark =
    propIsDark ??
    (typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.body.classList.contains("dark")));

  const [category, setCategory] = useState<FeedbackCategory>("saran");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("alerin_user_profile");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.email) return parsed.email;
        }
      } catch {}
    }
    return "rakaaditya@gmail.com";
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const existingRaw = localStorage.getItem("alerin_feedback_list");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        const newEntry = {
          id: `fb_${Date.now()}`,
          category,
          subject: subject.trim() || (category === "saran" ? "Saran Fitur" : category === "kendala" ? "Laporan Kendala" : "Pertanyaan / Lainnya"),
          message: message.trim(),
          email: email.trim() || "rakaaditya@gmail.com",
          createdAt: new Date().toISOString(),
        };
        existing.unshift(newEntry);
        localStorage.setItem("alerin_feedback_list", JSON.stringify(existing));
      } catch (err) {
        console.error("Gagal menyimpan saran/laporan:", err);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      onToast?.("Saran & laporan berhasil dikirim. Terima kasih atas masukanmu!", "success");

      // Tutup otomatis setelah tampilan sukses singkat
      setTimeout(() => {
        onClose();
      }, 1300);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-[gemini-fade-in_0.2s_ease-out]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="saran-laporan-title"
    >
      <div
        className={`w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden animate-[gemini-zoom-in_0.2s_ease-out] transition-colors ${
          isDark
            ? "bg-[#1e293b] border-slate-700/80 text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
            : "bg-white border-slate-100 text-slate-900 shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* State Berhasil */}
        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm animate-bounce">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Terima Kasih!</h3>
            <p className={`text-sm max-w-xs mb-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Saran dan laporanmu telah berhasil kami terima. Tim Alerin akan segera meninjaunya.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              Selesai
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className={`p-6 pb-4 border-b flex items-start justify-between ${isDark ? "border-slate-700/80" : "border-slate-100"}`}>
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <path d="M8 9h8M8 13h5" />
                  </svg>
                </div>
                <div>
                  <h3 id="saran-laporan-title" className="text-lg font-extrabold tracking-tight">
                    Saran &amp; Laporan
                  </h3>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Bantu kami menyempurnakan pengalaman Alerin untukmu
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className={`size-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Pilihan Kategori */}
              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Kategori Masukan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory("saran")}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      category === "saran"
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : isDark
                        ? "bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>💡</span>
                    <span className="truncate">Saran Fitur</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory("kendala")}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      category === "kendala"
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : isDark
                        ? "bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>🐞</span>
                    <span className="truncate">Kendala / Bug</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory("lainnya")}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      category === "lainnya"
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : isDark
                        ? "bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>💬</span>
                    <span className="truncate">Lainnya</span>
                  </button>
                </div>
              </div>

              {/* Subjek (Opsional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="saran-subject" className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Topik / Subjek Singkat
                  </label>
                  <span className={`text-[11px] tabular-nums ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    {subject.length}/80
                  </span>
                </div>
                <input
                  id="saran-subject"
                  type="text"
                  maxLength={80}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value.slice(0, 80))}
                  placeholder={
                    category === "saran"
                      ? "Contoh: Usul fitur ringkasan jurnal otomatis"
                      : category === "kendala"
                      ? "Contoh: Gagal mengunggah berkas PDF referensi"
                      : "Contoh: Pertanyaan seputar integrasi kalender"
                  }
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                    isDark
                      ? "bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  }`}
                />
              </div>

              {/* Rincian Pesan */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="saran-message" className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Rincian Masukan <span className="text-red-500">*</span>
                  </label>
                  <span className={`text-[11px] tabular-nums ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    {message.length} karakter
                  </span>
                </div>
                <textarea
                  id="saran-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    category === "saran"
                      ? "Ceritakan ide atau perbaikan yang kamu harapkan dan bagaimana hal itu membantumu..."
                      : category === "kendala"
                      ? "Jelaskan kendala yang dialami, langkah yang dilakukan sebelum kendala muncul, atau error yang terlihat..."
                      : "Tuliskan saran, pertanyaan, atau masukanmu secara detail di sini..."
                  }
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all resize-none ${
                    isDark
                      ? "bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  }`}
                />
              </div>

              {/* Email Kontak */}
              <div>
                <label htmlFor="saran-email" className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Email Kamu (untuk tindak lanjut)
                </label>
                <input
                  id="saran-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                    isDark
                      ? "bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  }`}
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    isDark
                      ? "text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white"
                      : "text-slate-600 bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={!message.trim() || isSubmitting}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#347CEA" }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      <span>Kirim</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
