import { Outlet, useLocation, useRouteError } from "react-router";
import FloatingClaro from "../components/FloatingClaro";

export function RootErrorBoundary() {
  const error = useRouteError();
  console.error("Alerin application error caught:", error);

  const errorMsg =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "statusText" in error
      ? String((error as any).statusText || (error as any).status)
      : String(error || "");

  const handleResetData = () => {
    try {
      localStorage.removeItem("alerin_mobile_riwayat");
      localStorage.removeItem("alerin_user_projects");
      localStorage.removeItem("alerin_mobile_project_chats");
      localStorage.removeItem("alerin_mobile_project_sources");
    } catch {}
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-4 text-center font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-[#00629b] shadow-sm">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 className="mt-4 text-xl font-bold text-slate-800">
        Terjadi kendala saat memuat halaman
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
        Sistem sedang memulihkan data. Silakan muat ulang halaman atau kembali ke beranda untuk melanjutkan.
      </p>

      {errorMsg && (
        <div className="mt-4 max-w-lg rounded-xl border border-rose-100 bg-rose-50/70 p-3 text-left">
          <p className="text-[11px] font-mono text-rose-600 break-all">{errorMsg}</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-[#00629b] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#005280] active:scale-95 transition-all cursor-pointer"
        >
          Muat Ulang Halaman
        </button>
        <button
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
        >
          Kembali ke Beranda
        </button>
        <button
          type="button"
          onClick={handleResetData}
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 active:scale-95 transition-all cursor-pointer"
        >
          Pulihkan Data
        </button>
      </div>
    </div>
  );
}

export default function Root() {
  const { pathname } = useLocation();
  const hideFloat = pathname === "/claro" || pathname === "/";

  return (
    <>
      <Outlet />
      {!hideFloat && <FloatingClaro />}
    </>
  );
}
