import React from "react";

export interface AlerinBusinessModalProps {
  onClose: () => void;
  onToast?: (msg: string, type?: "success" | "info" | "warning") => void;
}

export default function AlerinBusinessModal({
  onClose,
  onToast,
}: AlerinBusinessModalProps) {
  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[gemini-fade-in_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-[gemini-zoom-in_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900">Alerin Business</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                  Business
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Solusi institusi, kampus & laboratorium penelitian</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="size-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs leading-relaxed text-slate-600">
            Dirancang khusus untuk universitas, fakultas, program pascasarjana, dan lembaga riset yang membutuhkan kolaborasi multi-pengguna dengan standar keamanan data akademik.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <span className="size-2 rounded-full bg-blue-600" />
                Multi-User Seat
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Mulai dari 5 hingga 500+ akun mahasiswa dan dosen dalam satu penagihan terpusat.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <span className="size-2 rounded-full bg-emerald-600" />
                Prioritas Dedicated AI
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Kecepatan komputasi analisis dokumen besar & Scopus Q1 tanpa antrean server.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <span className="size-2 rounded-full bg-purple-600" />
                Dashboard Admin
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Pantau progres riset, distribusi kuota, dan analitik publikasi tim secara realtime.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <span className="size-2 rounded-full bg-amber-600" />
                Faktur Pajak Resmi
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Mendukung invoice resmi B2B, e-faktur perpajakan, dan kontrak kerjasama institusi.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-2 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
          <a
            href="https://wa.me/6281234567890?text=Halo%20Tim%20Alerin%20Business%2C%20saya%20tertarik%20dengan%20paket%20Alerin%20Business%20%2F%20Institusi."
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              onToast?.("Membuka WhatsApp Tim Alerin Business", "info");
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Konsultasi via WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 active:scale-98 text-slate-700 font-bold text-xs transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
