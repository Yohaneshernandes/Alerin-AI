import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export interface SaranLaporanModalProps {
  onClose: () => void;
  onToast?: (msg: string, type?: "success" | "info" | "warning") => void;
  isDark?: boolean;
}

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

  const [message, setMessage] = useState("");
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
        let userEmail = "rakaaditya@gmail.com";
        try {
          const saved = localStorage.getItem("alerin_user_profile");
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed?.email) userEmail = parsed.email;
          }
        } catch {}

        const newEntry = {
          id: `fb_${Date.now()}`,
          category: "umum",
          subject:
            message.trim().slice(0, 60) +
            (message.trim().length > 60 ? "..." : ""),
          message: message.trim().slice(0, 500),
          email: userEmail,
          createdAt: new Date().toISOString(),
        };
        existing.unshift(newEntry);
        localStorage.setItem("alerin_feedback_list", JSON.stringify(existing));
      } catch (err) {
        console.error("Gagal menyimpan saran/laporan:", err);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      onToast?.(
        "Saran & laporan berhasil dikirim. Terima kasih atas masukanmu!",
        "success"
      );

      // Tutup otomatis setelah tampilan sukses singkat
      setTimeout(() => {
        onClose();
      }, 1300);
    }, 600);
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[350] flex items-center justify-center p-4 backdrop-blur-sm animate-[gemini-fade-in_0.2s_ease-out]"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="saran-laporan-title"
    >
      <div
        className={`w-full max-w-[460px] rounded-3xl shadow-2xl border overflow-hidden animate-[gemini-zoom-in_0.2s_ease-out] transition-colors ${
          isDark
            ? "bg-[#1e293b] border-slate-700/80 text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
            : "bg-white border-slate-100 text-slate-900 shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* State Berhasil */}
        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#347CEA] dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center mb-4 shadow-sm animate-bounce">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Terima Kasih!</h3>
            <p
              className={`text-sm max-w-xs mb-6 ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Saran dan laporanmu telah berhasil kami terima. Tim Alerin akan segera meninjaunya.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#347CEA] hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              Selesai
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div
              className={`p-6 pb-4 border-b flex items-start justify-between ${
                isDark ? "border-slate-700/80" : "border-slate-100"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="size-11 rounded-2xl bg-[#347CEA] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <path d="M8 9h8M8 13h5" />
                  </svg>
                </div>
                <div>
                  <h3
                    id="saran-laporan-title"
                    className="text-base sm:text-lg font-bold tracking-tight"
                  >
                    Saran &amp; Laporan
                  </h3>
                  <p
                    className={`text-xs mt-0.5 ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Bantu kami menyempurnakan pengalaman Alerin untukmu
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className={`size-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isDark
                    ? "text-slate-400 hover:text-white hover:bg-slate-800"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Detail Masukan */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="saran-message"
                    className={`text-sm sm:text-[15px] font-semibold ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Detail Masukan <span className="text-red-500">*</span>
                  </label>
                  <span
                    className={`text-xs sm:text-[13px] tabular-nums ${
                      message.length >= 500
                        ? "text-amber-500 font-medium"
                        : isDark
                        ? "text-slate-500"
                        : "text-slate-400"
                    }`}
                  >
                    {message.length}/500 karakter
                  </span>
                </div>
                <textarea
                  id="saran-message"
                  required
                  rows={5}
                  maxLength={500}
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                  placeholder="Ceritakan ide, saran perbaikan, atau kendala yang kamu alami saat menggunakan Alerin..."
                  className={`w-full px-4 py-3.5 rounded-2xl border text-[15px] sm:text-base placeholder:text-[14px] sm:placeholder:text-[15px] outline-none transition-all resize-none leading-relaxed ${
                    isDark
                      ? "bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-[#347CEA] focus:ring-2 focus:ring-blue-500/20"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#347CEA] focus:ring-2 focus:ring-blue-100"
                  }`}
                  autoFocus
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 rounded-xl text-sm sm:text-[15px] font-semibold transition-colors cursor-pointer ${
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
                  className={`flex items-center justify-center gap-2 px-6.5 py-2.5 rounded-xl text-sm sm:text-[15px] font-bold text-white transition-all shadow-sm ${
                    !message.trim() || isSubmitting
                      ? "bg-[#347CEA]/50 cursor-not-allowed opacity-60"
                      : "bg-[#347CEA] hover:bg-blue-700 active:scale-[0.98] shadow-blue-500/25 cursor-pointer"
                  }`}
                >
                  {isSubmitting ? (
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
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
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

  if (typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
}
