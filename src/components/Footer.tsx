import { Link } from "react-router";
import logoImg from "../imports/Logo_CP_Baru_Renggang__1__2.png";

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-14 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoImg} alt="Class Program" className="h-8 w-auto" />
              <span className="font-display font-700 text-white">
                Class<span className="text-blue-400">Program</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform skripsi terpercaya untuk mahasiswa Indonesia.
            </p>
          </div>
          {[
            { title: "Fitur", links: [["Parafrase Online", "/parafrase"], ["Cek Plagiasi", "/#plagiasi"], ["Kumpulan PPT", "/#ppt"], ["Chat Alerin", "/#claro"]] },
            { title: "Perusahaan", links: [["Tentang Kami", "/#tentang"], ["Blog", "#"], ["Karier", "#"], ["Press Kit", "#"]] },
            { title: "Dukungan", links: [["FAQ", "#"], ["Panduan", "#"], ["Kontak", "#"], ["Kebijakan Privasi", "#"]] },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith("/") && !href.startsWith("/#") ? (
                      <Link to={href} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">{label}</Link>
                    ) : (
                      <a href={href} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">{label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">© 2026 Class Program. Hak cipta dilindungi.</p>
          <div className="flex gap-5">
            {["Instagram", "Twitter", "YouTube", "LinkedIn"].map((s) => (
              <a key={s} href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
