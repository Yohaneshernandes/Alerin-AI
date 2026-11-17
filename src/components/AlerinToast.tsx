import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export function parseAlerinToast(
  rawMsg: string | { title: string; description?: string }
): { title: string; description: string } {
  if (typeof rawMsg === "object" && rawMsg !== null) {
    return {
      title: rawMsg.title,
      description: rawMsg.description
        ? rawMsg.description.endsWith(".") || rawMsg.description.endsWith("!")
          ? rawMsg.description
          : `${rawMsg.description}.`
        : "",
    };
  }
  const raw = String(rawMsg || "").trim();
  const lower = raw.toLowerCase();
  const cleanDesc = raw.endsWith(".") || raw.endsWith("!") ? raw : `${raw}.`;

  if (lower.includes("paket dipilih") || lower.includes("paket"))
    return { title: "Paket Berhasil Dipilih", description: cleanDesc };
  if (lower.includes("voucher") && lower.includes("berhasil"))
    return { title: "Voucher Diterapkan", description: cleanDesc };
  if (lower.includes("lapor")) return { title: "Laporan Respon Diterima", description: "Terima kasih telah melaporkan" };
  if (lower.includes("disalin") || lower.includes("salin"))
    return { title: "Berhasil Disalin", description: cleanDesc };
  if (lower.includes("dihapus")) return { title: "Berhasil Dihapus", description: cleanDesc };
  if (lower.includes("disimpan") || lower.includes("simpan"))
    return { title: "Berhasil Disimpan", description: cleanDesc };
  if (lower.includes("dibuat")) return { title: "Berhasil Dibuat", description: cleanDesc };
  if (lower.includes("ditambahkan")) return { title: "Berhasil Ditambahkan", description: cleanDesc };
  if (lower.includes("tersinkron") || lower.includes("berhasil"))
    return { title: "Berhasil", description: cleanDesc };
  return { title: "Pemberitahuan", description: cleanDesc };
}

export default function AlerinToast({
  msg,
  onDone,
}: {
  msg: string | { title: string; description?: string };
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  const { title, description } = parseAlerinToast(msg);

  const content = (
    <div
      role="status"
      aria-live="polite"
      className="alerin-toast-card fixed bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[300] mx-auto w-auto max-w-[400px] sm:min-w-[340px] sm:max-w-[420px] flex items-center justify-between gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-[0_16px_40px_rgba(0,0,0,0.14),0_4px_12px_rgba(0,0,0,0.06)] animate-[gemini-fade-in_0.2s_ease-out]"
      style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm shadow-blue-500/20">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h4
            className="text-[14px] font-bold leading-tight text-slate-900 tracking-tight truncate"
            style={{ color: "#0f172a" }}
          >
            {title}
          </h4>
          {description ? (
            <p
              className="mt-0.5 text-xs leading-snug text-slate-500 font-normal line-clamp-2"
              style={{ color: "#64748b" }}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        onClick={onDone}
        className="size-7 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
        aria-label="Tutup notifikasi"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(content, document.body) : content;
}
