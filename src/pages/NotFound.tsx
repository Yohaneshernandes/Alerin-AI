import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
        <span className="text-4xl">🔍</span>
      </div>
      <h1 className="font-display font-800 text-4xl text-slate-900 mb-3">404</h1>
      <p className="text-slate-500 text-base mb-8 max-w-sm">
        Halaman yang kamu cari tidak ditemukan. Mungkin sudah dipindahkan atau tidak ada.
      </p>
      <Link to="/" className="btn-primary text-sm px-7 py-3 inline-flex items-center gap-2">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Kembali ke Beranda
      </Link>
    </div>
  );
}
