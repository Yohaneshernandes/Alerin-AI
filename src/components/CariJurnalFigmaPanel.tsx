import { useEffect, useState } from "react";

type JournalView = "home" | "collection";

const searchAssets = "/assets/jurnal-design/search";
const collectionAssets = "/assets/jurnal-design/collection";
const mobileAssets = "/assets/jurnal-design/mobile";

const journals = [
  {
    title: "Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges",
    authors: "Wongkitrungrueng, A. & Assarut, N.",
    description:
      "Interaksi parasosial antara host dan penonton, ditambah dorongan kelangkaan seperti batas waktu dan stok, meningkatkan niat beli di live streaming commerce. Temuan ini relevan untuk riset perilaku konsumen digital di Asia Tenggara.",
  },
  {
    title: "Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges",
    authors: "Wongkitrungrueng, A. & Assarut, N.",
    description:
      "Interaksi parasosial antara host dan penonton, ditambah dorongan kelangkaan seperti batas waktu dan stok, meningkatkan niat beli di live streaming.",
  },
];

function ProfileCard({ collection }: { collection: boolean }) {
  const assets = collection ? collectionAssets : searchAssets;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
      <img src={`${assets}/48c68.png`} alt="Raka Aditya" className="h-10 w-10 rounded-full object-cover" />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate font-['Inter:Semi_Bold'] text-sm font-semibold text-[#1d293d]">Raka Aditya</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#1e264b] px-2 py-0.5 font-['Inter:Bold'] text-[8px] font-bold text-white">
            Alerin Plus
            <span className="relative h-3 w-3 overflow-hidden">
              <img src={`${assets}/8923b.png`} alt="" className="absolute -left-2 -top-1 h-12 max-w-none" />
            </span>
          </span>
        </div>
        <p className="mt-0.5 font-['Inter:Regular'] text-[11px] text-[#90a1b9]">Manajemen · Semester 6</p>
      </div>
    </div>
  );
}

function Sidebar({
  view,
  onView,
  onBack,
}: {
  view: JournalView;
  onView: (view: JournalView) => void;
  onBack: () => void;
}) {
  const assets = view === "collection" ? collectionAssets : searchAssets;
  const homeIcon = view === "collection" ? "62b0b.svg" : "b4a91.svg";
  const collectionIcon = view === "collection" ? "57aea.svg" : "6f1a2.svg";

  return (
    <aside className="hidden w-[280px] shrink-0 flex-col border-r border-slate-100 bg-white p-5 md:flex">
      <div className="flex items-center gap-3">
        <img src={`${assets}/24a8e.svg`} alt="" />
        <div>
          <p className="font-['Inter:Bold'] text-[19px] font-bold tracking-[-0.47px] text-[#0f172a]">Alerin Jurnal</p>
          <p className="font-['Inter:Medium'] text-xs font-medium text-[#94a3b8]">Pendamping Akademik</p>
        </div>
      </div>

      <nav className="mt-10 space-y-1">
        <button
          type="button"
          onClick={() => onView("home")}
          className={`flex w-full items-center gap-4 rounded-[15px] px-4 py-3 font-['Inter:Semi_Bold'] text-[17px] font-semibold ${
            view === "home" ? "bg-[#e6f4ff]/80 text-[#0070ba]" : "text-[#475569]"
          }`}
        >
          <img src={`${assets}/${homeIcon}`} alt="" />
          {view === "home" ? "Beranda" : "Beranda Jurnal"}
        </button>
        <button
          type="button"
          onClick={() => onView("collection")}
          className={`flex w-full items-center gap-4 rounded-[15px] px-4 py-3 font-['Inter:Semi_Bold'] text-[17px] font-semibold ${
            view === "collection" ? "bg-[#ebf6ff] text-[#0070ba]" : "text-[#475569]"
          }`}
        >
          <img src={`${assets}/${collectionIcon}`} alt="" />
          Koleksi
        </button>
      </nav>

      <p className="mt-7 px-2 font-['Inter:Bold'] text-[13px] font-bold uppercase tracking-[0.69px] text-[#94a3b8]">Bandingkan Paket</p>
      <button type="button" className="mt-4 flex items-center gap-4 rounded-[14px] bg-[#ebf1ff] px-5 py-3.5 text-left font-['Inter:Semi_Bold'] text-base font-semibold text-[#475569]">
        <img src={`${assets}/88a20.svg`} alt="" />
        Upgrade Paket
      </button>

      <button type="button" onClick={onBack} className="mt-auto flex items-center gap-3 rounded-2xl border border-[#dbe4ff] bg-[#f7f9ff] p-3 text-left">
        <img src={`${assets}/f725b.png`} alt="" className="h-11 w-11 rounded-full object-cover" />
        <span>
          <span className="block font-['Inter:Bold'] text-xs font-bold text-[#1e293b]">Kembali Ke Alerin</span>
          <span className="mt-0.5 block font-['Inter:Regular'] text-[10px] text-[#94a3b8]">Navigasi ke halaman utama Alerin</span>
        </span>
      </button>
    </aside>
  );
}

function JournalCard({ index }: { index: number }) {
  return (
    <article className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-semibold text-[#0066a1]">Scopus Q1</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600">2023</span>
        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] text-[#0066a1]">Akses terbuka legal</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600">97% relevan</span>
      </div>
      <h3 className="mt-4 font-['Plus_Jakarta_Sans:Bold'] text-base font-bold leading-[22px] text-[#0f172a]">{journals[index].title}</h3>
      <p className="mt-1 font-['Inter:Regular'] text-xs text-[#94a3b8]">{journals[index].authors}</p>
      <p className="mt-4 font-['Inter:Regular'] text-xs leading-5 text-[#64748b]">{journals[index].description}</p>
      {index === 0 && (
        <>
          <div className="mt-4 rounded-xl bg-[#eaf6ff] px-4 py-3 text-xs text-[#475569]">
            <strong className="font-['Inter:Bold'] text-[#0066a1]">Alasan direkomendasikan:</strong> Cocok untuk memperkuat landasan teori dan hubungan antarvariabel.
          </div>
          <div className="mt-4 min-h-24 rounded-xl border border-slate-200 bg-[#f1f5f9] p-4">
            <p className="font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold text-[#1e293b]">Catatan Pribadi</p>
            <p className="mt-2 text-xs text-[#94a3b8]">Kamu bisa menuliskan catatan pribadi di sini......</p>
          </div>
        </>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
        <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs">Lihat detail</button>
        <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs">Abstrak</button>
        <button type="button" className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs">
          <img src={`${collectionAssets}/9b4e4.svg`} alt="" /> Buat sitasi
        </button>
        <button type="button" className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs">
          <img src={`${collectionAssets}/edcfd.svg`} alt="" /> Buka DOI
        </button>
        <button type="button" className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs">
          Skripsi <img src={`${collectionAssets}/b80d5.svg`} alt="" />
        </button>
        {index === 0 && <button type="button" className="ml-auto rounded-lg bg-[#bd3434] px-4 py-2 text-xs font-semibold text-white">Hapus dari koleksi</button>}
      </div>
    </article>
  );
}

export default function CariJurnalFigmaPanel({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<JournalView>("home");
  const [query, setQuery] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [hasResults, setHasResults] = useState(false);
  const [fileName, setFileName] = useState("");
  const [mobileSearchStage, setMobileSearchStage] = useState<"home" | "loading" | "results">("home");
  const [searchType, setSearchType] = useState("");

  useEffect(() => {
    if (mobileSearchStage !== "loading") return;
    const timer = window.setTimeout(() => setMobileSearchStage("results"), 2400);
    return () => window.clearTimeout(timer);
  }, [mobileSearchStage]);

  const runSearch = () => {
    if (query.trim() || paragraph.trim() || fileName) setHasResults(true);
  };

  return (
    <div className="fixed inset-0 z-[300] flex h-dvh w-full overflow-hidden bg-[#f4f7fb] font-['Inter:Regular'] text-[#0f172a] md:bg-[#f3f6f9]">
      <Sidebar view={view} onView={setView} onBack={onBack} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-[65px] shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] backdrop-blur-md md:hidden">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center">
              <img src={`${mobileAssets}/90eed.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="truncate font-['Plus_Jakarta_Sans:Bold'] text-base font-bold leading-5">Alerin Jurnal</p>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#1e264b] px-1.5 py-0.5 font-['Inter:Bold'] text-[7px] font-bold text-white">
                  Plus
                  <span className="relative h-2.5 w-2.5 overflow-hidden">
                    <img src={`${mobileAssets}/8923b.png`} alt="" className="absolute -left-1.5 -top-0.5 h-8 max-w-none" />
                  </span>
                </span>
              </div>
              <p className="font-['Plus_Jakarta_Sans:Medium'] text-[11px] leading-3 text-[#64748b]">Pendamping Akademik</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-xl">
              <img src={`${mobileAssets}/1a16f.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" />
              <span className="absolute right-1.5 top-1 h-2 w-2 rounded-full border border-white bg-red-500" />
            </button>
            <img src={`${mobileAssets}/48c68.png`} alt="Profil" className="h-[38px] w-[38px] rounded-full object-cover" />
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-28 pt-7 md:p-7">
          {mobileSearchStage === "loading" && (
            <div className="fixed inset-x-0 bottom-[68px] top-[65px] z-[305] flex flex-col items-center justify-center bg-[#f4f7fb] px-6 md:hidden">
              <img
                src="/assets/jurnal-design/search-flow/5e7e4.svg"
                alt=""
                className="w-[290px] max-w-[82vw] animate-[bounce_1.4s_ease-in-out_infinite]"
              />
              <h1 className="mt-5 text-center font-['Plus_Jakarta_Sans:ExtraBold'] text-[21px] font-extrabold tracking-[-0.5px] text-[#313131]">
                Menulusuri Jurnal Untukmu
              </h1>
              <p className="mt-2 max-w-[290px] animate-pulse text-center text-xs leading-5 text-[#71717a]">
                Alerin sedang mencari jurnal berdasarkan informasi yang kamu berikan.
              </p>
            </div>
          )}

          {mobileSearchStage === "results" && (
            <div className="fixed inset-x-0 bottom-[68px] top-[65px] z-[305] overflow-y-auto bg-[#f4f7fb] px-4 pb-6 pt-4 md:hidden">
              <div className="mx-auto max-w-md">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Kembali ke pencarian"
                    onClick={() => {
                      setMobileSearchStage("home");
                      setSearchType("");
                    }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm"
                  >
                    <img src="/assets/jurnal-design/search-flow/19ff4.svg" alt="" />
                  </button>
                  <h1 className="font-['Plus_Jakarta_Sans:Bold'] text-base font-bold tracking-[-0.4px]">Rekomendasi yang paling relevan</h1>
                </div>

                <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                  <h2 className="flex items-center gap-2 font-['Plus_Jakarta_Sans:Bold'] text-base font-bold">
                    <img src="/assets/jurnal-design/search-flow/ef610.svg" alt="" className="h-5 w-5" />
                    Ringkasan hasil pencarian
                  </h2>
                  <p className="mt-3 text-xs leading-5 text-[#373737]">Alerin menyeleksi hasil secara bertahap sebelum menampilkan jurnal terbaik.</p>
                  <div className="mt-3 space-y-2 text-[11px] font-medium">
                    <p className="flex items-center gap-2"><img src="/assets/jurnal-design/search-flow/d6638.svg" alt="" className="h-4 w-4" />Kata kunci: {query.trim() || "live streaming commerce"}</p>
                    <p className="flex items-center gap-2"><img src="/assets/jurnal-design/search-flow/d6dd5.svg" alt="" className="h-4 w-4" />Tahun: 2024–2026</p>
                  </div>
                  <div className="mt-4 grid grid-cols-3 rounded-xl bg-[#f1f4fa] px-2 py-3 text-center">
                    {[["4,2 jt", "jurnal tersedia"], ["50", "sangat relevan"], ["20", "sangat teratas"]].map(([value, label]) => (
                      <div key={value}>
                        <p className="font-['Plus_Jakarta_Sans:Bold'] text-xl font-bold text-[#006194]">{value}</p>
                        <p className="mt-0.5 text-[9px] font-semibold text-[#64748b]">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => window.alert("Tabel penelitian ditampilkan.")} className="rounded-xl bg-[#006194] px-3 py-2.5 text-xs font-semibold text-white">Tabel penelitian</button>
                    <button type="button" onClick={() => window.alert("Peta penelitian ditampilkan.")} className="rounded-xl bg-[#0f172a] px-3 py-2.5 text-xs font-semibold text-white">Peta Penelitian</button>
                  </div>
                </section>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Daftar rekomendasi</p>
                  <p className="text-[11px] font-medium text-[#64748b]">3 dari 20 telaah</p>
                </div>

                <div className="mt-2 space-y-3">
                  {[
                    {
                      rank: "Paling Relevan #1",
                      score: 97,
                      title: "Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges",
                      citation: "2023 • 120 sitasi • Asia Pacific Journal of Marketing and Logistics • DOI terverifikasi",
                      summary: "Interaksi parasosial antara host dan penonton ditambah dorongan kelangkaan seperti batas waktu dan stok meningkatkan niat beli di live streaming commerce.",
                    },
                    {
                      rank: "Rekomendasi #2",
                      score: 89,
                      title: "Pengaruh Interaksi Parasosial dan Dorongan Kelangkaan terhadap Niat Beli di Live Streaming Commerce",
                      citation: "2023 • 120 sitasi • Asia Pacific Journal of Marketing and Logistics • DOI terverifikasi",
                      summary: "Studi ini memperkuat hubungan antara interaksi parasosial, dorongan kelangkaan, dan perilaku pembelian digital.",
                    },
                  ].map((result, index) => (
                    <article key={result.rank} className="rounded-2xl bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap gap-1 text-[9px] font-semibold">
                          <span className="rounded-md bg-sky-100 px-2 py-1 text-[#0369a1]">Scopus Q1</span>
                          <span className="rounded-md bg-slate-200 px-2 py-1 text-slate-700">Artikel</span>
                          <span className="rounded-md bg-slate-200 px-2 py-1 text-slate-700">2023</span>
                        </div>
                        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full bg-sky-50 shadow-inner">
                          <strong className="font-['Plus_Jakarta_Sans:ExtraBold'] text-xl text-[#006194]">{result.score}%</strong>
                          <span className="text-[7px] font-semibold uppercase text-slate-500">relevansi</span>
                        </div>
                      </div>
                      <p className="mt-2 text-[11px] font-semibold text-[#0369a1]">{result.rank}</p>
                      <h2 className="mt-1 font-['Plus_Jakarta_Sans:Bold'] text-base font-bold leading-5">{result.title}</h2>
                      <p className="mt-2 text-[10px] leading-4 text-slate-600">Wongkitrungrueng, A. &amp; Assarut, N.</p>
                      <p className="mt-1 text-[10px] leading-4 text-slate-600">{result.citation}</p>

                      <div className="mt-3 rounded-xl bg-[#f1f4fa] p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide">Mengapa jurnal ini direkomendasikan?</p>
                        {[["Kesesuaian variabel", index ? 98 : 99], ["Kesesuaian topik", 96], ["Kesesuaian wilayah", index ? 80 : 93]].map(([label, value]) => (
                          <div key={String(label)} className="mt-2">
                            <div className="flex justify-between text-[10px]"><span>{label}</span><strong className="text-[#006194]">{value}%</strong></div>
                            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-300"><div className="h-full rounded-full bg-[#006194]" style={{ width: `${value}%` }} /></div>
                          </div>
                        ))}
                        <p className="mt-3 text-[10px] leading-4 text-slate-600">Cocok untuk landasan teori, penyusunan hipotesis, dan pengembangan penelitian.</p>
                      </div>

                      <div className="mt-3 rounded-xl bg-sky-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#006194]">Ringkasan utama</p>
                        <p className="mt-2 text-[11px] leading-[17px]">{result.summary}</p>
                        <div className="mt-2 flex flex-wrap gap-1 text-[9px]">
                          <span className="rounded-md bg-white px-2 py-1">2 kutipan pendukung</span>
                          <span className="rounded-md bg-white px-2 py-1">Metode SEM-PLS</span>
                          <span className="rounded-md bg-white px-2 py-1">Studi cross-sectional</span>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-semibold">
                        <button type="button" onClick={() => window.alert("Analisis jurnal dibuka.")} className="rounded-xl bg-[#006194] px-2 py-2 text-white">Analisis</button>
                        <button type="button" onClick={() => window.alert("Jurnal disimpan ke koleksi.")} className="rounded-xl bg-[#f1f4fa] px-2 py-2">Simpan</button>
                        <button type="button" onClick={() => window.alert("Sitasi berhasil dibuat.")} className="rounded-xl bg-[#f1f4fa] px-2 py-2">Sitasi</button>
                        <button type="button" onClick={() => window.alert("Abstrak jurnal dibuka.")} className="rounded-xl bg-[#f1f4fa] px-2 py-2">Abstrak</button>
                        <button type="button" onClick={() => window.open("https://doi.org/10.1016/j.jretconser.2020.102345", "_blank", "noopener,noreferrer")} className="rounded-xl bg-[#f1f4fa] px-2 py-2">DOI</button>
                        <button type="button" onClick={() => window.alert("PDF dibuka.")} className="rounded-xl bg-[#f1f4fa] px-2 py-2 text-[#006194]">Buka PDF</button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === "home" ? (
            <div className="mx-auto grid max-w-[1160px] gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <h1 className="text-center font-['Plus_Jakarta_Sans:ExtraBold'] text-2xl font-extrabold leading-[33px] tracking-[-0.6px] text-[#0f172a] md:text-left md:text-[30px] md:leading-normal md:tracking-[-0.85px] md:text-[#193662]">
                  Temukan jurnal yang tepat <br className="md:hidden" />untuk tulisanmu
                </h1>
                <p className="mt-2 text-center font-['Plus_Jakarta_Sans:Regular'] text-xs leading-[19.5px] text-[#232323] md:text-left md:text-base md:leading-normal md:text-[#475569]">Cari dengan kata kunci atau biarkan Alerin memahami paragraf dan dokumenmu.</p>

                <section className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:mt-7 md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-[17px] font-bold">Pencarian cepat</h2>
                    <button type="button" onClick={() => window.alert("Panel filter dibuka.")} className="flex items-center gap-2 font-['Plus_Jakarta_Sans:SemiBold'] text-xs font-semibold text-[#334155] md:text-sm">
                      <span className="relative h-[19.689px] w-[17.143px] shrink-0 overflow-hidden">
                        <img src="/assets/jurnal-design/quick-search/8e43d.svg" alt="" className="absolute left-[-19.689px] top-[-18.447px] max-w-none origin-top-left scale-[0.6667]" />
                      </span>
                      Filter
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-[#0070ba]">10</span>
                    </button>
                  </div>

                  <label className="mt-4 flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 md:px-4">
                      <img src="/assets/jurnal-design/quick-search/f5f78.svg" alt="" className="max-w-none origin-center scale-[0.6667]" />
                      <input
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                        onKeyDown={event => {
                          if (event.key !== "Enter") return;
                          if (window.matchMedia("(min-width: 768px)").matches) runSearch();
                          else setMobileSearchStage("loading");
                        }}
                        placeholder="Ketik topik, judul, penulis, variabel, atau DOI"
                        className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-slate-400 md:text-sm"
                      />
                  </label>

                  <div className="mt-4 grid grid-cols-[minmax(0,1fr)_52px] gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!searchType) setSearchType("journal");
                        if (window.matchMedia("(min-width: 768px)").matches) runSearch();
                        else setMobileSearchStage("loading");
                      }}
                      className="rounded-xl bg-[#00629b] px-4 py-3 text-center font-['Plus_Jakarta_Sans:SemiBold'] text-sm font-semibold text-white md:bg-[#0070ba]"
                    >
                      {searchType === "review" ? "Literatur Review" : searchType === "map" ? "Peta Penelitian" : "Cari jurnal"}
                    </button>
                    <label className="relative flex min-h-12 items-center justify-center rounded-lg border border-black/15 bg-white shadow-[0_4px_4px_rgba(0,0,0,0.1)]">
                      <span className="sr-only">Pilih jenis pencarian</span>
                      <select
                        value={searchType}
                        onChange={event => setSearchType(event.target.value)}
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none opacity-0"
                      >
                        <option value="" disabled>Cari jurnal</option>
                        <option value="journal">Cari jurnal</option>
                        <option value="review">Literatur Review</option>
                        <option value="map">Peta Penelitian</option>
                      </select>
                      <img src="/assets/jurnal-design/quick-search/9490a.svg" alt="" className="pointer-events-none max-w-none origin-center scale-[0.6667]" />
                    </label>
                  </div>
                </section>

                <section className="mt-4 rounded-2xl border border-slate-200/80 bg-white px-4 py-[22px] shadow-sm md:p-6">
                  <h2 className="text-center font-['Plus_Jakarta_Sans:ExtraBold'] text-[19px] font-extrabold md:text-left md:font-['Plus_Jakarta_Sans:Bold'] md:text-base md:font-bold">Cari rujukan dari tulisanmu</h2>
                  <p className="mx-auto mt-2 max-w-lg text-center font-['Plus_Jakarta_Sans:Regular'] text-xs leading-[19.5px] text-[#1c1c1c] md:mx-0 md:mt-1 md:max-w-none md:text-left md:font-['Inter:Regular'] md:leading-5 md:text-[#64748b]">Tempel kalimat atau paragraf yang ingin kamu perkuat dengan sitasi. Alerin akan membantu mencari artikel jurnal yang relevan untuk mendukung tulisanmu.</p>
                  <div className="mt-5 grid gap-3 md:grid-cols-[1.35fr_0.95fr]">
                    <label className="grid gap-1.5">
                      <span className="font-['Plus_Jakarta_Sans:SemiBold'] text-[13px] font-semibold text-[#334155] md:hidden">Draf / Paragraf Teks</span>
                      <textarea value={paragraph} onChange={event => setParagraph(event.target.value)} placeholder="Masukkan kalimat atau paragraf yang membutuhkan sitasi." className="min-h-[123px] resize-none rounded-xl border border-slate-200 bg-[rgba(200,226,251,0.24)] p-3 text-xs outline-none focus:border-sky-400 md:min-h-44 md:p-4 md:text-sm" />
                    </label>
                    <label className="flex min-h-[108px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/40 p-4 text-center md:min-h-44 md:border md:border-sky-400 md:bg-white">
                      <span className="flex h-[53px] w-[53px] items-center justify-center rounded-full border border-sky-100 bg-white shadow-sm md:h-9 md:w-9 md:rounded-lg md:border-0 md:bg-sky-50 md:shadow-none">
                        <img src={`${mobileAssets}/36094.svg`} alt="" className="md:hidden" />
                        <img src={`${searchAssets}/f5e87.svg`} alt="" className="hidden md:block" />
                      </span>
                      <span className="mt-3 text-xs font-semibold">Unggah artikel atau catatan</span>
                      <span className="mt-1 text-[11px] text-[#94a3b8]">PDF, DOCX, atau TXT hingga 20 MB</span>
                      <span className="mt-2 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] text-[#004f80] md:bg-transparent md:p-0 md:text-[11px] md:text-emerald-600">{fileName || "Belum ada dokumen"}</span>
                      <input type="file" accept=".pdf,.doc,.docx,.txt" className="sr-only" onChange={event => setFileName(event.target.files?.[0]?.name || "")} />
                    </label>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 md:mt-5 md:flex-row md:items-center md:justify-between md:border-b md:border-slate-200 md:pb-4">
                    <label className="flex items-center gap-2 text-xs text-[#475569]">
                      <span className="flex h-[18px] w-[18px] items-center justify-center rounded bg-[#0070ba]">
                        <img src={`${mobileAssets}/9e421.svg`} alt="" className="max-w-none origin-center scale-[0.6667] md:hidden" />
                        <img src={`${searchAssets}/b5bd9.svg`} alt="" className="hidden md:block" />
                      </span>
                      Gunakan filter aktif pada rekomendasi Alerin
                    </label>
                    <button type="button" onClick={runSearch} className="flex items-center justify-center gap-2 rounded-xl bg-[#00629b] px-8 py-3 font-['Plus_Jakarta_Sans:Bold'] text-xs font-bold text-white md:bg-[#0066a1] md:font-['Inter:Semi_Bold'] md:text-sm md:font-semibold">
                      <img src={`${mobileAssets}/8802c.svg`} alt="" className="max-w-none origin-center scale-[0.6667] md:hidden" />
                      <img src={`${searchAssets}/550ef.svg`} alt="" className="hidden md:block" />
                      Analisis dan carikan jurnal
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-[#64748b] md:border-0 md:pt-0">
                    <span className="w-full md:w-auto">Konsep yang dipahami Alerin:</span>
                    {["interaksi parasosial", "kepercayaan konsumen", "kelangkaan produk", "niat beli"].map(item => (
                      <span key={item} className="rounded-lg bg-slate-100 px-3 py-1 font-['Plus_Jakarta_Sans:SemiBold'] text-[#334155] md:rounded-full md:font-['Inter:Regular']">{item}</span>
                    ))}
                  </div>
                </section>

                {hasResults && (
                  <section className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-xl font-bold text-[#193662]">Jurnal yang direkomendasikan</h2>
                      <button type="button" onClick={() => setView("collection")} className="text-sm font-semibold text-[#0070ba]">Lihat koleksi</button>
                    </div>
                    <JournalCard index={0} />
                  </section>
                )}
              </div>

              <aside className="space-y-5">
                <div className="hidden md:block"><ProfileCard collection={false} /></div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-6">
                  <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold md:text-base">Tiga cara menemukan jurnal</h2>
                  <p className="mt-2 text-xs leading-5 text-[#64748b]">Pilih cara paling mudah sesuai informasi yang sudah kamu punya.</p>
                  <ol className="mt-4 space-y-2 md:mt-6 md:space-y-6">
                    {[
                      ["1", "Ketik kata kunci", "Cocok jika sudah tahu topik, penulis, atau variabel."],
                      ["2", "Tempel tulisan", "Alerin memahami teori dan konteks paragrafmu."],
                      ["3", "Unggah dokumen", "Alerin mengambil konsep penting dari artikel atau catatan."],
                    ].map(([number, title, description]) => (
                      <li key={number} className="flex gap-3 rounded-xl border border-slate-100/80 bg-slate-50 p-3 md:rounded-none md:border-0 md:bg-transparent md:p-0">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-[#0070ba] md:h-8 md:w-8 md:text-base">{number}</span>
                        <span><strong className="block text-xs md:text-sm">{title}</strong><span className="mt-0.5 block text-[11px] leading-4 text-[#64748b] md:mt-1 md:text-xs md:leading-5">{description}</span></span>
                      </li>
                    ))}
                  </ol>
                </div>
              </aside>
            </div>
          ) : (
            <>
            <div data-mobile-collection className="-mt-4 md:hidden">
              <div className="flex items-center justify-between px-1">
                <h1 className="font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold tracking-[-0.27px] text-[#0f172a]">Folder Riset</h1>
                <button
                  type="button"
                  aria-label="Tambah folder"
                  onClick={() => {
                    const name = window.prompt("Nama folder riset baru");
                    if (name?.trim()) window.alert(`Folder “${name.trim()}” berhasil ditambahkan.`);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0369a1]"
                >
                  <img src="/assets/jurnal-design/collection-mobile/ce139.svg" alt="" />
                </button>
              </div>

              <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
                {[
                  ["all", "55585.svg", "Semua", "2"],
                  ["skripsi", "22763.svg", "Skripsi", "2"],
                  ["ungrouped", "d2faf.svg", "Belum dikelompokkan", "0"],
                ].map(([filter, icon, label, count]) => (
                  <button
                    key={filter}
                    type="button"
                    data-folder-filter={filter}
                    onClick={event => {
                      const container = event.currentTarget.closest("[data-mobile-collection]");
                      container?.querySelectorAll<HTMLElement>("[data-folder-filter]").forEach(button => {
                        const active = button === event.currentTarget;
                        button.classList.toggle("bg-[#00629b]", active);
                        button.classList.toggle("text-white", active);
                        button.classList.toggle("bg-white", !active);
                        button.classList.toggle("text-[#64748b]", !active);
                      });
                      container?.querySelectorAll<HTMLElement>("[data-journal-folder]").forEach(card => {
                        card.hidden = filter !== "all" && card.dataset.journalFolder !== filter;
                      });
                    }}
                    className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs shadow-sm ${
                      filter === "skripsi" ? "bg-[#00629b] text-white" : "bg-white text-[#64748b]"
                    }`}
                  >
                    <img src={`/assets/jurnal-design/collection-mobile/${icon}`} alt="" className="max-w-none origin-center scale-[0.7]" />
                    {label}
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${filter === "skripsi" ? "bg-white text-[#0369a1]" : "bg-slate-100"}`}>{count}</span>
                  </button>
                ))}
              </div>

              <div className="mt-2 space-y-3">
                {journals.map((journal, index) => (
                  <article key={index} data-journal-folder="skripsi" className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="rounded-full bg-sky-100 px-2 py-1 font-semibold text-[#0369a1]">Scopus Q1</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-[#64748b]">2023</span>
                      <span className="ml-auto flex items-center gap-1 rounded-full bg-sky-50 px-2 py-1 font-semibold text-[#006194]">
                        <img src="/assets/jurnal-design/collection-mobile/4bb5d.svg" alt="" className="max-w-none origin-center scale-[0.7]" />
                        97% relevan
                      </span>
                    </div>

                    <h2 className="mt-2 font-['Plus_Jakarta_Sans:ExtraBold'] text-base font-extrabold leading-[21px] tracking-[-0.14px] text-[#0f172a]">{journal.title}</h2>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-[#64748b]">
                      <img src="/assets/jurnal-design/collection-mobile/dadef.svg" alt="" className="max-w-none origin-center scale-[0.65]" />
                      {journal.authors}
                    </p>

                    <p className="mt-3 rounded-lg bg-slate-100/60 p-3 text-[13px] leading-[19px] text-slate-700">{journal.description}</p>
                    <div data-full-abstract className="mt-2 hidden rounded-lg border border-sky-100 bg-sky-50/50 p-3 text-[13px] leading-[19px] text-slate-700">
                      Abstrak lengkap mensintesis hubungan interaksi parasosial, dorongan kelangkaan, dan niat beli pada konteks live streaming commerce.
                    </div>

                    <div className="mt-2 flex gap-2 rounded-lg bg-sky-50 p-3 text-xs leading-[18px] text-[#0f172a]">
                      <img src="/assets/jurnal-design/collection-mobile/4f26d.svg" alt="" className="mt-0.5 max-w-none shrink-0 origin-top scale-[0.65]" />
                      <p><strong className="text-[#006194]">Alasan direkomendasikan:</strong> Cocok untuk memperkuat landasan teori dan hubungan antarvariabel.</p>
                    </div>

                    <label className="mt-2 block rounded-lg bg-slate-100 p-3">
                      <span className="flex items-center justify-between text-xs font-semibold">
                        Catatan Pribadi
                        <span className="font-normal text-slate-500">Otomatis tersimpan</span>
                      </span>
                      <textarea
                        aria-label={`Catatan jurnal ${index + 1}`}
                        placeholder="Masukan catatanmu disini"
                        onChange={event => window.localStorage.setItem(`alerin-journal-note-${index}`, event.target.value)}
                        className="mt-2 min-h-16 w-full resize-none rounded-md bg-white p-2 text-xs outline-none shadow-inner"
                      />
                    </label>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold">
                      <button type="button" onClick={() => window.alert(`${journal.title}\n\n${journal.authors}`)} className="rounded-lg bg-slate-100 px-3 py-2.5">Lihat detail</button>
                      <button
                        type="button"
                        onClick={event => event.currentTarget.closest("article")?.querySelector("[data-full-abstract]")?.classList.toggle("hidden")}
                        className="rounded-lg bg-slate-100 px-3 py-2.5"
                      >
                        Abstrak
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          void navigator.clipboard?.writeText(`${journal.authors} (2023). ${journal.title}.`);
                          window.alert("Sitasi berhasil disalin.");
                        }}
                        className="rounded-lg bg-sky-100 px-3 py-2.5 text-[#0369a1]"
                      >
                        Buat sitasi
                      </button>
                      <button type="button" onClick={() => window.open("https://doi.org/10.1016/j.jretconser.2020.102345", "_blank", "noopener,noreferrer")} className="rounded-lg bg-slate-100 px-3 py-2.5">Buka DOI</button>
                    </div>

                    <div className="mt-2 flex gap-2">
                      <label className="relative min-w-0 flex-1">
                        <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2 text-xs font-semibold">
                          <img src="/assets/jurnal-design/collection-mobile/445e6.svg" alt="" className="max-w-none origin-center scale-[0.65]" />
                        </span>
                        <select aria-label="Pilih folder jurnal" defaultValue="skripsi" className="w-full appearance-none rounded-lg bg-slate-100 py-2.5 pl-9 pr-8 text-xs font-semibold outline-none">
                          <option value="skripsi">Skripsi</option>
                          <option value="theory">Landasan teori</option>
                          <option value="hypothesis">Hipotesis</option>
                        </select>
                        <img src="/assets/jurnal-design/collection-mobile/392b3.svg" alt="" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                      </label>
                      <button
                        type="button"
                        onClick={event => {
                          if (window.confirm("Hapus jurnal ini dari koleksi?")) event.currentTarget.closest("article")?.remove();
                        }}
                        className="flex items-center gap-1.5 rounded-lg bg-[#ffdad6] px-3 text-xs font-medium text-[#93000a]"
                      >
                        <img src="/assets/jurnal-design/collection-mobile/29816.svg" alt="" className="max-w-none origin-center scale-[0.65]" />
                        Hapus
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mx-auto hidden max-w-[1160px] gap-5 md:grid lg:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="font-['Plus_Jakarta_Sans:ExtraBold'] text-[28px] font-extrabold tracking-[-0.69px] text-[#003859]">Koleksi jurnal</h1>
                    <p className="mt-1 text-xs text-[#64748b]">Simpan jurnal penting agar mudah ditemukan kembali saat menulis.</p>
                  </div>
                  <button type="button" className="flex items-center justify-center gap-3 rounded-[10px] bg-[#0066a1] px-5 py-2.5 font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold text-white">
                    Folder Skripsi <img src={`${collectionAssets}/f08e5.svg`} alt="" />
                  </button>
                </div>
                <div className="mt-5 space-y-4">
                  <JournalCard index={0} />
                  <JournalCard index={1} />
                </div>
              </div>

              <aside className="space-y-4">
                <ProfileCard collection />
                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between px-2 pb-3">
                    <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold text-[#1e293b]">Folder</h2>
                    <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200"><img src={`${collectionAssets}/b2242.svg`} alt="" /></button>
                  </div>
                  <div className="space-y-1">
                    {[
                      ["Semua jurnal tersimpan", "1", false],
                      ["Belum dikelompokkan", "0", false],
                      ["Variabel dependen", "1", true],
                      ["Landasan teori", "0", false],
                      ["Jenis penelitian", "0", false],
                      ["Hipotesis Penelitian", "0", false],
                    ].map(([label, count, active], index) => (
                      <button key={label} type="button" className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs ${active ? "bg-sky-100 text-[#0066a1]" : "text-[#475569]"}`}>
                        <img src={`${collectionAssets}/${index < 2 ? "8b8d1.svg" : "e1558.svg"}`} alt="" />
                        <span className="flex-1">{label}</span>
                        <span>{count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
            </>
          )}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-[310] border-t border-slate-200 bg-white/95 px-3 pb-2 pt-1.5 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] backdrop-blur-md md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 items-end">
          <button type="button" onClick={() => setView("home")} aria-current={view === "home" ? "page" : undefined} className={`flex flex-col items-center gap-1 py-1 text-[10px] font-semibold ${view === "home" ? "text-[#00629b]" : "text-slate-400"}`}>
            <span className="flex h-6 items-center"><img src={`${mobileAssets}/62a85.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" style={{ filter: view === "home" ? "none" : "brightness(0) saturate(100%) invert(70%) sepia(14%) saturate(518%) hue-rotate(176deg) brightness(90%) contrast(86%)" }} /></span>
            Beranda
          </button>
          <button type="button" onClick={() => setView("collection")} aria-current={view === "collection" ? "page" : undefined} className={`flex flex-col items-center gap-1 py-1 text-[10px] font-medium ${view === "collection" ? "text-[#00629b]" : "text-slate-400"}`}>
            <span className="flex h-6 items-center"><img src={`${mobileAssets}/6978a.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" style={{ filter: view === "collection" ? "brightness(0) saturate(100%) invert(30%) sepia(96%) saturate(1030%) hue-rotate(164deg) brightness(86%) contrast(102%)" : "none" }} /></span>
            Koleksi
          </button>
          <button type="button" onClick={onBack} className="relative flex flex-col items-center gap-1 pb-1 text-[10px] font-bold text-[#004f80]">
            <span className="-mt-7 flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white bg-[rgba(123,123,123,0.05)] shadow-lg">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <img src={`${mobileAssets}/f725b.png`} alt="Alerin AI" className="h-8 w-8 rounded-full object-cover" />
              </span>
            </span>
            ALERIN AI
          </button>
          <button type="button" className="flex flex-col items-center gap-1 py-1 text-[10px] font-medium text-slate-400">
            <span className="flex h-6 items-center"><img src={`${mobileAssets}/3a1cb.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" /></span>
            Riwayat
          </button>
          <button type="button" className="flex flex-col items-center gap-1 py-1 text-[10px] font-medium text-slate-400">
            <span className="flex h-6 items-center"><img src={`${mobileAssets}/ae5e6.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" /></span>
            Paket
          </button>
        </div>
      </nav>
    </div>
  );
}
