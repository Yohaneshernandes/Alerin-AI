import { useState } from "react";
import { Link, useLocation } from "react-router";
import logoImg from "../imports/Logo_CP_Baru_Renggang__1__2.png";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Parafrase", href: "/parafrase" },
  { label: "Grammar", href: "/grammar" },
  { label: "Cek Plagiasi", href: "/plagiasi" },
  { label: "PPT Sidang", href: "/ppt" },
  { label: "Simulasi Sidang", href: "/simulasi" },
  { label: "Alerin", href: "/claro" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isDark = pathname === "/parafrase";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b"
      style={{
        background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.92)",
        borderColor: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
        boxShadow: "0 1px 20px rgba(0,0,0,0.07)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src={logoImg} alt="Class Program" className="h-9 w-auto" />
          <span className={`font-display font-700 text-lg tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Class<span className="grad-text">Program</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => {
            const active = l.href === pathname || (l.href !== "/" && pathname.startsWith(l.href));
            return l.href.startsWith("/#") ? (
              <a key={l.label} href={l.href}
                className={`text-sm font-medium transition-colors duration-150 ${
                  isDark
                    ? "text-white/50 hover:text-white"
                    : "text-slate-500 hover:text-blue-600"
                }`}>
                {l.label}
              </a>
            ) : (
              <Link key={l.label} to={l.href}
                className={`text-sm font-medium transition-colors duration-150 ${
                  active
                    ? isDark ? "text-blue-400" : "text-blue-600"
                    : isDark ? "text-white/50 hover:text-white" : "text-slate-500 hover:text-blue-600"
                }`}>
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a href="#"
            className={`text-sm font-medium px-4 py-2 transition-colors ${isDark ? "text-white/60 hover:text-white" : "text-slate-600 hover:text-blue-600"}`}>
            Masuk
          </a>
          <a href="#" className="btn-primary text-sm px-5 py-2.5">Daftar Gratis</a>
        </div>

        <button onClick={() => setOpen(!open)}
          className={`md:hidden p-2 ${isDark ? "text-white/70" : "text-slate-600"}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open
              ? <path d="M18 6L6 18M6 6l12 12" />
              : <><path d="M3 12h18" /><path d="M3 6h18" /><path d="M3 18h18" /></>}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t px-6 py-5 flex flex-col gap-4"
          style={{
            background: isDark ? "rgba(15,23,42,0.98)" : "#fff",
            borderColor: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
          }}>
          {NAV_LINKS.map((l) =>
            l.href.startsWith("/#") ? (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                className={`text-sm font-medium py-1 transition-colors ${isDark ? "text-white/60" : "text-slate-600 hover:text-blue-600"}`}>
                {l.label}
              </a>
            ) : (
              <Link key={l.label} to={l.href} onClick={() => setOpen(false)}
                className={`text-sm font-medium py-1 transition-colors ${isDark ? "text-white/60" : "text-slate-600 hover:text-blue-600"}`}>
                {l.label}
              </Link>
            )
          )}
          <a href="#" className="btn-primary text-sm px-5 py-2.5 text-center mt-1">Daftar Gratis</a>
        </div>
      )}
    </nav>
  );
}
