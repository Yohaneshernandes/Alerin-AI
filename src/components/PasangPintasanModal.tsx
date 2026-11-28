import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export interface PasangPintasanModalProps {
  onClose: () => void;
  onToast?: (msg: string, type?: "success" | "info" | "warning") => void;
  isDark?: boolean;
}

export default function PasangPintasanModal({
  onClose,
  onToast,
  isDark: propIsDark,
}: PasangPintasanModalProps) {
  const isDark =
    propIsDark ??
    (typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.body.classList.contains("dark")));

  const [isInstalling, setIsInstalling] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [showDesktopGuide, setShowDesktopGuide] = useState(false);

  // Deteksi lingkungan perangkat
  const isIos =
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod/i.test(navigator.userAgent || "");

  const isAndroid =
    typeof navigator !== "undefined" &&
    /Android/i.test(navigator.userAgent || "");

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Handler utama saat tombol "Pasang Pintasan Sekarang" diklik
  const handleUniversalInstall = async () => {
    // 1. Jika browser mendukung PWA BeforeInstallPrompt (Chrome Android / Desktop Chrome / Edge)
    const promptEvent = (window as any).deferredInstallPrompt;
    if (promptEvent) {
      try {
        setIsInstalling(true);
        promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;
        if (choiceResult.outcome === "accepted") {
          onToast?.("Aplikasi Alerin berhasil dipasang di perangkatmu!", "success");
          (window as any).deferredInstallPrompt = null;
          setTimeout(() => onClose(), 800);
        } else {
          onToast?.("Pemasangan pintasan dibatalkan.", "info");
        }
      } catch (err) {
        console.error("Gagal memicu install prompt:", err);
      } finally {
        setIsInstalling(false);
      }
      return;
    }

    // 2. Jika di iOS Safari (iPhone / iPad) - Apple tidak mengizinkan trigger programmatic share sheet
    if (isIos) {
      setShowIosGuide(true);
      onToast?.("Ketuk tombol Bagikan [↑] di Safari, lalu pilih 'Tambahkan ke Layar Utama'.", "info");
      return;
    }

    // 3. Jika di Android tapi prompt belum ditangkap
    if (isAndroid) {
      onToast?.("Buka menu titik tiga (⋮) di Chrome, lalu pilih 'Tambahkan ke Layar Utama'.", "info");
      return;
    }

    // 4. Jika di Desktop (PC / Laptop Windows atau Mac)
    try {
      const appOrigin = typeof window !== "undefined" ? window.location.origin : "https://alerin-ai.vercel.app";
      const fileContent = `[InternetShortcut]\nURL=${appOrigin}/\nIconIndex=0\nIconFile=${appOrigin}/favicon.png\n`;
      const blob = new Blob([fileContent], { type: "application/internet-shortcut" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Alerin.url";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setShowDesktopGuide(true);
      onToast?.("Aplikasi Desktop Alerin berhasil diunduh!", "success");
    } catch {
      setShowDesktopGuide(true);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[350] flex items-center justify-center p-4 backdrop-blur-sm animate-[gemini-fade-in_0.2s_ease-out]"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pasang-pintasan-title"
    >
      <div
        className={`w-full max-w-[440px] rounded-3xl shadow-2xl border overflow-hidden animate-[gemini-zoom-in_0.2s_ease-out] transition-colors flex flex-col ${
          isDark
            ? "bg-[#1e293b] border-slate-700/80 text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
            : "bg-white border-slate-100 text-slate-900 shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`p-5 sm:p-6 pb-4 border-b flex items-start justify-between shrink-0 ${
            isDark ? "border-slate-700/80" : "border-slate-100"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-[#EDF4FF] dark:bg-blue-950/60 p-2.5 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center shrink-0 shadow-xs">
              <img
                src="/assets/alerin-logo-only.png"
                alt="Logo Alerin"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3
                id="pasang-pintasan-title"
                className="text-base sm:text-lg font-bold tracking-tight"
              >
                Pasang Aplikasi Alerin
              </h3>
              <p
                className={`text-xs mt-0.5 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Akses cepat Alerin langsung dari layar utama
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className={`size-8 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
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

        {/* Universal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Card Pratinjau Pintasan Alerin */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/90 via-sky-50/60 to-indigo-50/40 dark:from-blue-950/40 dark:via-blue-950/20 dark:to-indigo-950/30 border border-blue-100/90 dark:border-blue-900/50">
            <div className="size-12 rounded-2xl bg-white shadow-xs border border-blue-100 overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src="/apple-touch-icon.png?v=2"
                alt="Alerin"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  Alerin
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-2xs">
                  Aplikasi Web
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Layar Utama &bull; Buka langsung tanpa ketik alamat web
              </p>
            </div>
          </div>

          {/* Manfaat Pintasan */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <span className="size-4 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#347CEA] flex items-center justify-center text-[10px] font-bold shrink-0">
                ✓
              </span>
              <span>Buka Alerin dalam 1 sentuhan seperti aplikasi biasa</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <span className="size-4 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#347CEA] flex items-center justify-center text-[10px] font-bold shrink-0">
                ✓
              </span>
              <span>Tampilan layar penuh lebih luas dan nyaman</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <span className="size-4 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#347CEA] flex items-center justify-center text-[10px] font-bold shrink-0">
                ✓
              </span>
              <span>Akun dan riwayat tersimpan otomatis</span>
            </div>
          </div>

          {/* Panduan Cepat Khusus jika Muncul State iOS / Desktop */}
          {showIosGuide && (
            <div className="p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs space-y-1.5 animate-[gemini-fade-in_0.2s_ease-out]">
              <p className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <span>📱</span>
                <span>Langkah Pemasangan di iPhone / iPad:</span>
              </p>
              <ol className="list-decimal list-inside space-y-1 text-amber-800 dark:text-amber-400 leading-relaxed">
                <li>Ketuk ikon <strong>Bagikan [↑]</strong> di bilah bawah Safari.</li>
                <li>Pilih <strong>"Tambahkan ke Layar Utama" [+]</strong>.</li>
                <li>Ketuk <strong>"Tambah"</strong> di kanan atas. Selesai!</li>
              </ol>
            </div>
          )}

          {showDesktopGuide && (
            <div className="p-3.5 rounded-2xl bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs space-y-1.5 animate-[gemini-fade-in_0.2s_ease-out]">
              <p className="font-bold text-[#186DD8] dark:text-blue-300 flex items-center gap-1.5">
                <span>💻</span>
                <span>Pintasan Desktop Siap!</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                File pintasan sudah diunduh ke komputermu. Kamu juga bisa mengklik ikon instal <strong>[⊕]</strong> di sebelah kanan bilah URL browser untuk menginstal sebagai aplikasi.
              </p>
            </div>
          )}

          {/* Tombol Universal Pasang Aplikasi */}
          <button
            type="button"
            onClick={handleUniversalInstall}
            disabled={isInstalling}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-[#347CEA] hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-500/25 cursor-pointer disabled:opacity-50"
          >
            {isInstalling ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Sedang memasang aplikasi...</span>
              </>
            ) : (
              <>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                  <path d="M9 8l3 3 3-3M12 5v6" />
                </svg>
                <span>Pasang Aplikasi</span>
              </>
            )}
          </button>

          <p className={`text-center text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            Didukung di HP Android, iPhone / iPad, Windows, dan Mac
          </p>
        </div>
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
}
