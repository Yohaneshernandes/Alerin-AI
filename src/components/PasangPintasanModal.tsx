import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export interface PasangPintasanModalProps {
  onClose: () => void;
  onToast?: (msg: string, type?: "success" | "info" | "warning") => void;
  isDark?: boolean;
}

type DeviceType = "ios" | "android" | "desktop";

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

  // Deteksi perangkat pengguna secara otomatis
  const [device, setDevice] = useState<DeviceType>(() => {
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent || "";
      if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
      if (/Android/i.test(ua)) return "android";
    }
    return "desktop";
  });

  const [hasNativePrompt, setHasNativePrompt] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ((window as any).deferredInstallPrompt) {
        setHasNativePrompt(true);
      }
      const handlePromptReady = () => setHasNativePrompt(true);
      window.addEventListener("alerin_install_prompt_ready", handlePromptReady);
      return () => {
        window.removeEventListener("alerin_install_prompt_ready", handlePromptReady);
      };
    }
  }, []);

  // Tutup dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Eksekusi PWA install prompt jika didukung browser
  const handleNativeInstall = async () => {
    const promptEvent = (window as any).deferredInstallPrompt;
    if (!promptEvent) {
      onToast?.("Gunakan panduan di bawah untuk memasang pintasan di browsermu.", "info");
      return;
    }
    try {
      setIsInstalling(true);
      promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      if (choiceResult.outcome === "accepted") {
        onToast?.("Pintasan Alerin berhasil dipasang di perangkatmu!", "success");
        (window as any).deferredInstallPrompt = null;
        setHasNativePrompt(false);
        setTimeout(() => onClose(), 800);
      } else {
        onToast?.("Pemasangan pintasan dibatalkan.", "info");
      }
    } catch (err) {
      console.error("Gagal memicu install prompt:", err);
    } finally {
      setIsInstalling(false);
    }
  };

  // Unduh pintasan desktop (.url) untuk Windows / Mac
  const handleDownloadDesktopShortcut = () => {
    try {
      const appOrigin = typeof window !== "undefined" ? window.location.origin : "https://alerin-ai.vercel.app";
      const fileContent = `[InternetShortcut]\nURL=${appOrigin}/\nIconIndex=0\nIconFile=${appOrigin}/favicon.png\n`;
      const blob = new Blob([fileContent], { type: "application/internet-shortcut" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Alerin AI.url";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      onToast?.("File pintasan Alerin berhasil diunduh. Pindahkan ke Desktop kamu!", "success");
    } catch (err) {
      console.error("Gagal mengunduh pintasan desktop:", err);
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
        className={`w-full max-w-[480px] rounded-3xl shadow-2xl border overflow-hidden animate-[gemini-zoom-in_0.2s_ease-out] transition-colors max-h-[92vh] flex flex-col ${
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
            <div className="size-12 rounded-2xl bg-[#EDF4FF] dark:bg-blue-950/60 p-2 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center shrink-0 shadow-xs">
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
                Pasang Pintasan Alerin
              </h3>
              <p
                className={`text-xs mt-0.5 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Akses cepat Alerin langsung dari layar utama perangkatmu
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

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Tombol Pasang Instan jika Browser Mendukung Native Prompt */}
          {hasNativePrompt && (
            <div className="rounded-2xl p-4 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#186DD8] dark:text-blue-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Browser mendukung instalasi langsung</span>
              </div>
              <button
                type="button"
                onClick={handleNativeInstall}
                disabled={isInstalling}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#347CEA] hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shadow-blue-500/25 cursor-pointer disabled:opacity-50"
              >
                {isInstalling ? (
                  <span>Sedang memasang...</span>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <rect x="3" y="3" width="18" height="14" rx="2" />
                      <path d="M8 21h8M12 17v4" />
                      <path d="M9 8l3 3 3-3M12 5v6" />
                    </svg>
                    <span>Pasang Aplikasi Alerin Sekarang</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Tab Pemilihan Perangkat */}
          <div>
            <label className={`block text-xs font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Pilih Jenis Perangkatmu:
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
              <button
                type="button"
                onClick={() => setDevice("ios")}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  device === "ios"
                    ? "bg-white dark:bg-slate-700 text-[#347CEA] dark:text-blue-400 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <span>🍎</span>
                <span className="truncate">iPhone / iPad</span>
              </button>

              <button
                type="button"
                onClick={() => setDevice("android")}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  device === "android"
                    ? "bg-white dark:bg-slate-700 text-[#347CEA] dark:text-blue-400 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <span>🤖</span>
                <span className="truncate">Android</span>
              </button>

              <button
                type="button"
                onClick={() => setDevice("desktop")}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  device === "desktop"
                    ? "bg-white dark:bg-slate-700 text-[#347CEA] dark:text-blue-400 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <span>💻</span>
                <span className="truncate">Laptop / PC</span>
              </button>
            </div>
          </div>

          {/* Panduan Khusus Sesuai Perangkat */}
          <div className={`p-4 rounded-2xl border ${isDark ? "bg-slate-800/40 border-slate-700/60" : "bg-slate-50/80 border-slate-200/80"}`}>
            {device === "ios" && (
              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <span className="size-6 rounded-full bg-[#347CEA] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Buka di Safari &amp; Ketuk Tombol Bagikan (Share)
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Ketuk ikon kotak dengan panah ke atas <strong className="font-semibold text-blue-600">[↑]</strong> di bilah navigasi bawah Safari.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="size-6 rounded-full bg-[#347CEA] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Pilih "Tambahkan ke Layar Utama" (Add to Home Screen)
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Gulir ke bawah pada menu bagikan, lalu pilih opsi dengan ikon tanda tambah <strong className="font-semibold text-blue-600">[+]</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="size-6 rounded-full bg-[#347CEA] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Ketuk "Tambah" di Kanan Atas
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Selesai! Logo resmi Alerin akan otomatis tampil di layar utama HP kamu seperti aplikasi biasa.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {device === "android" && (
              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <span className="size-6 rounded-full bg-[#347CEA] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Ketuk Menu Titik Tiga (⋮) di Chrome
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Buka Alerin di Google Chrome, lalu ketuk ikon titik tiga di pojok kanan atas browser.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="size-6 rounded-full bg-[#347CEA] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Pilih "Tambahkan ke Layar Utama" atau "Instal Aplikasi"
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Ketuk opsi <strong>Instal aplikasi</strong> atau <strong>Tambahkan ke Layar Utama</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="size-6 rounded-full bg-[#347CEA] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Konfirmasi Pemasangan
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Ketuk tombol <strong>Instal</strong>. Alerin dengan logo resminya akan segera terpasang di HP kamu!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {device === "desktop" && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="size-6 rounded-full bg-[#347CEA] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Klik Ikon Pasang di Bilah URL Browser
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        Di Chrome atau Edge, perhatikan sebelah kanan bilah URL (tempat mengetik alamat web). Klik ikon monitor kecil atau ikon tambah <strong className="font-semibold text-blue-600">[⊕]</strong> lalu pilih <strong>Instal</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="size-6 rounded-full bg-[#347CEA] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Atau Unduh File Pintasan Desktop Langsung
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        Kamu juga bisa mengunduh file shortcut untuk disimpan di Desktop komputer:
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadDesktopShortcut}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 active:scale-[0.98] transition-all cursor-pointer shadow-2xs"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#347CEA]">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Unduh File Pintasan Desktop (.url)</span>
                </button>
              </div>
            )}
          </div>

          {/* Kartu Pratinjau Logo Alerin */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/80 dark:border-blue-900/40">
            <div className="size-10 rounded-xl bg-white shadow-2xs p-1 border border-slate-100 shrink-0 flex items-center justify-center">
              <img
                src="/assets/alerin-logo-only.png"
                alt="Alerin"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                Alerin - AI Skripsi &amp; Kuliah
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Layar Utama &bull; Buka langsung tanpa ketik alamat web
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className={`p-4 sm:p-5 pt-3 border-t flex items-center justify-end shrink-0 ${
            isDark ? "border-slate-700/80" : "border-slate-100"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#347CEA] hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
}
