import { useRef, useState } from "react";

const assets = "/assets/parafrase-design";

const sampleText =
  "Penelitian ini bertujuan untuk mengkaji pengaruh teknologi informasi terhadap efisiensi kerja karyawan. Data dikumpulkan menggunakan metode survei dengan sampel sebanyak 120 responden dari berbagai perusahaan di Jakarta.";

const synonyms: Record<string, string> = {
  penelitian: "kajian",
  bertujuan: "dimaksudkan",
  mengkaji: "menganalisis",
  pengaruh: "dampak",
  terhadap: "pada",
  menggunakan: "memanfaatkan",
  menunjukkan: "memperlihatkan",
  meningkatkan: "mengoptimalkan",
  penting: "krusial",
};

function paraphraseText(text: string, intensity: number) {
  let result = text;
  Object.entries(synonyms)
    .slice(0, intensity === 25 ? 4 : 8)
    .forEach(([word, replacement]) => {
      result = result.replace(new RegExp(`\\b${word}\\b`, "gi"), match =>
        match[0] === match[0].toUpperCase()
          ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
          : replacement,
      );
    });
  return result;
}

function wordCount(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

export default function ParafraseFigmaPanel({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [style, setStyle] = useState<"academic" | "concise">("academic");
  const [level, setLevel] = useState<25 | 55>(25);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileNotice, setFileNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const words = wordCount(input);

  const loadFile = (file: File) => {
    setFileNotice("");
    if (file.size > 5 * 1024 * 1024) {
      setFileNotice("Ukuran file maksimal 5 MB.");
      return;
    }
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = event => {
        setInput(String(event.target?.result || "").slice(0, 2000));
        setOutput("");
      };
      reader.readAsText(file);
      return;
    }
    setInput(sampleText);
    setOutput("");
    setFileNotice(`${file.name} berhasil dipilih. Teks contoh digunakan untuk pratinjau.`);
  };

  const runParaphrase = () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setOutput("");
    setProgress(12);
    const timer = window.setInterval(() => {
      setProgress(value => Math.min(value + 16, 92));
    }, 120);
    window.setTimeout(() => {
      window.clearInterval(timer);
      setProgress(100);
      setOutput(paraphraseText(input, level));
      setLoading(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[300] h-dvh w-full overflow-y-auto bg-[#f6f6f6] font-['Inter:Regular'] text-[#18181b]">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#fcfcfc]/95 px-4 py-4 backdrop-blur-md md:px-[35px]">
        <div className="mx-auto flex max-w-[1461px] items-center gap-[15px]">
          <button
            type="button"
            onClick={onBack}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-slate-100"
            aria-label="Kembali"
          >
            <img src={`${assets}/6ae41.svg`} alt="" />
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[15px] border border-[#e4e4e7] bg-[#f4f4f5]">
              <img src={`${assets}/ba77d.svg`} alt="" />
            </div>
            <p className="truncate font-['Inter:Bold'] text-xl font-bold leading-[30px] text-black md:text-2xl">Alerin Parafrase</p>
          </div>
          <button
            type="button"
            className="hidden items-center gap-2 rounded-xl border border-[#d4d4d8] bg-white px-[15px] py-2 font-['Plus_Jakarta_Sans:Medium'] text-xs font-medium text-[#27272a] sm:flex"
          >
            <img src={`${assets}/cae7a.svg`} alt="" />
            Riwayat
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-[#d4d4d8] bg-white px-[15px] py-2 font-['Plus_Jakarta_Sans:Medium'] text-xs font-medium text-[#27272a]"
          >
            Gratis
            <img src={`${assets}/850c0.svg`} alt="" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1535px] px-4 pb-10 pt-5 md:px-[35px]">
        <div className="mb-5">
          <h1 className="font-['Inter:Bold'] text-2xl font-bold tracking-[-0.6px] text-black md:text-[36px] md:leading-9">
            Sampaikan dengan cara berbeda, tanpa mengubah inti tulisan.
          </h1>
        </div>

        <section className="rounded-[20px] border border-[#e4e4e7]/80 bg-[#fcfcfc] p-4 shadow-[0_0_0_1px_rgba(24,24,27,0.06),0_2px_8px_-2px_rgba(24,24,27,0.04)] md:p-7">
          <div className="grid gap-5 xl:grid-cols-[277px_minmax(0,1fr)_351px] xl:gap-[61px]">
            <div>
              <p className="font-['Plus_Jakarta_Sans:Bold'] text-xs font-bold uppercase tracking-[1px] text-[#3f3f46]">Bahasa hasil</p>
              <button
                type="button"
                className="mt-2 flex w-full items-center justify-between rounded-xl border border-[#e4e4e7] bg-white px-4 py-3 font-['Inter:Medium'] text-sm font-medium text-[#27272a]"
              >
                <span className="flex items-center gap-2">
                  <img src={`${assets}/00f9f.svg`} alt="" />
                  Deteksi Otomatis
                </span>
                <img src={`${assets}/edf2d.svg`} alt="" />
              </button>
              <p className="mt-2 text-xs text-[#71717a]">Bahasa antarmuka tidak mengubah bahasa hasil.</p>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 font-['Plus_Jakarta_Sans:Bold'] text-xs font-bold uppercase tracking-[1px] text-[#3f3f46]">
                  Parafrase <img src={`${assets}/2b021.svg`} alt="" />
                </span>
                <span className="text-xs text-[#71717a]">Pilih satu</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {[
                  { id: "academic", label: "Akademik", locked: false },
                  { id: "concise", label: "Ringkas", locked: false },
                  { id: "professional", label: "Profesional", locked: true },
                  { id: "creative", label: "Kreatif", locked: true },
                  { id: "structured", label: "Terstruktur", locked: true },
                ].map(option => {
                  const active = style === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={option.locked}
                      onClick={() => !option.locked && setStyle(option.id as "academic" | "concise")}
                      className={`flex min-h-11 items-center justify-center gap-1 rounded-xl border px-3 font-['Inter:Medium'] text-sm font-medium transition-colors ${
                        active ? "border-[#18181b] bg-[#18181b] text-white" : "border-[#e4e4e7] bg-white text-[#27272a]"
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {option.label}
                      {option.locked && <img src={`${assets}/21d5e.svg`} alt="" />}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 flex items-center gap-2 text-xs text-[#71717a]">
                <img src={`${assets}/2faaa.svg`} alt="" />
                {style === "academic"
                  ? "Mode Akademik mempertahankan terminologi ilmiah dan tata kalimat formal."
                  : "Mode Ringkas memadatkan kalimat tanpa mengubah makna utama."}
              </p>
            </div>

            <div>
              <span className="flex items-center gap-1.5 font-['Plus_Jakarta_Sans:Bold'] text-xs font-bold uppercase tracking-[1px] text-[#3f3f46]">
                Perubahan <img src={`${assets}/2b021.svg`} alt="" />
              </span>
              <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl border border-[#e4e4e7] bg-[#f4f4f5] p-1">
                <button
                  type="button"
                  onClick={() => setLevel(25)}
                  className={`rounded-lg px-2 py-2 text-sm ${level === 25 ? "border border-[#e4e4e7]/60 bg-white shadow-sm" : ""}`}
                >
                  Ringan
                </button>
                <button
                  type="button"
                  onClick={() => setLevel(55)}
                  className={`rounded-lg px-2 py-2 text-sm ${level === 55 ? "border border-[#e4e4e7]/60 bg-white shadow-sm" : ""}`}
                >
                  Sedang
                </button>
                <button type="button" disabled className="flex items-center justify-center gap-1 rounded-lg px-2 py-2 text-sm opacity-50">
                  Mendalam <img src={`${assets}/b8416.svg`} alt="" />
                </button>
              </div>
              <p className="mt-2 text-xs text-[#71717a]">
                {level === 25 ? "Pilihan kata berubah seperlunya." : "Kalimat diolah lebih luas dengan makna tetap terjaga."}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-[18px] rounded-[20px] border border-[#e4e4e7]/80 bg-[#fcfcfc] p-4 shadow-[0_0_0_1px_rgba(24,24,27,0.06),0_2px_8px_-2px_rgba(24,24,27,0.04)] md:p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex min-h-[400px] flex-col overflow-hidden rounded-[10px] border border-[#e4e4e7] bg-white">
              <div className="flex h-14 items-center justify-between border-b border-[#e4e4e7] bg-[#fafafa] px-5">
                <span className="flex items-center gap-2 font-['Inter:Semi_Bold'] text-lg font-semibold">
                  <img src={`${assets}/d9eea.svg`} alt="" />
                  Teks Asli
                </span>
                <div className="flex rounded-lg border border-[#e4e4e7] bg-[#e4e4e7]/80 p-0.5 text-xs">
                  <button type="button" className="rounded-md bg-white px-3 py-1 shadow-sm">Teks</button>
                  <button type="button" onClick={() => fileRef.current?.click()} className="rounded-md px-3 py-1 text-[#71717a]">File</button>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  className="sr-only"
                  onChange={event => {
                    const file = event.target.files?.[0];
                    if (file) loadFile(file);
                  }}
                />
              </div>
              {fileNotice && <p className="border-b border-blue-100 bg-blue-50 px-5 py-2 text-xs text-blue-700">{fileNotice}</p>}
              <textarea
                value={input}
                maxLength={2000}
                onChange={event => {
                  setInput(event.target.value);
                  setOutput("");
                }}
                placeholder="Tempel teks kamu di sini..."
                className="min-h-[273px] flex-1 resize-none bg-white px-8 py-7 font-['Inter:Regular'] text-base leading-[22px] text-[#18181b] outline-none placeholder:text-[#71717a]"
              />
              <div className="border-t border-[#e4e4e7] bg-[#fafafa] px-5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-['JetBrains_Mono:Medium'] text-sm font-medium text-[#71717a]">
                    {words}/300 kata · {input.length}/2000 karakter
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setInput(sampleText);
                      setOutput("");
                    }}
                    className="hidden font-['Inter:Medium'] text-sm font-medium text-[#3b82f6]"
                  >
                    Muat contoh
                  </button>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#3b82f6] transition-all"
                    style={{ width: `${Math.min(100, (words / 300) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex min-h-[400px] flex-col overflow-hidden rounded-[10px] border border-[#e4e4e7] bg-white">
              <div className="flex h-14 items-center gap-2 border-b border-[#e4e4e7] bg-[#fafafa] px-6 font-['Inter:Semi_Bold'] text-lg font-semibold">
                <img src={`${assets}/97bde.svg`} alt="" />
                Hasil Parafrase
              </div>
              <div className="flex min-h-[300px] flex-1 items-center justify-center p-6">
                {loading ? (
                  <div className="text-center">
                    <div className="mx-auto flex h-[59px] w-[59px] items-center justify-center rounded-full bg-[#eff6ff]">
                      <span className="font-['Inter:Bold'] text-sm font-bold text-[#3b82f6]">{progress}%</span>
                    </div>
                    <p className="mt-3 font-['Inter:Semi_Bold'] text-sm font-semibold">Memproses tulisan...</p>
                  </div>
                ) : output ? (
                  <div className="self-start whitespace-pre-wrap font-['Inter:Regular'] text-sm leading-6 text-[#27272a]">{output}</div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto flex h-[59px] w-[59px] items-center justify-center rounded-full bg-[#eff6ff]">
                      <img src={`${assets}/29fae.svg`} alt="" />
                    </div>
                    <p className="mt-3 font-['Inter:Semi_Bold'] text-sm font-semibold text-[#3f3f46]">Hasil parafrasemu akan muncul di sini.</p>
                    <p className="mt-1 max-w-xs font-['Inter:Regular'] text-[11px] leading-[15px] text-[#71717a]">
                      Masukkan teksmu, lalu klik “Parafrase”.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-['Inter:Semi_Bold'] text-base font-semibold">1 kali parafrase menggunakan 1 jatah proses</p>
              <p className="mt-1 max-w-2xl font-['Inter:Regular'] text-xs leading-5 text-[#71717a]">
                Jatah hanya berkurang setelah hasil parafrase berhasil dibuat. Mengedit, memeriksa ulang, menyimpan, dan mengunduh hasil tidak mengurangi jatah.
                <span className="mt-1 flex items-center gap-1.5 font-['Inter:Semi_Bold'] text-[#171717]">
                  <img src={`${assets}/f6b44.svg`} alt="" /> 6 proses tersisa
                </span>
              </p>
            </div>
            <button
              type="button"
              disabled={!input.trim() || loading}
              onClick={runParaphrase}
              className="flex min-w-36 items-center justify-center gap-2 rounded-xl bg-[#3b82f6] px-6 py-3 font-['Inter:Semi_Bold'] text-sm font-semibold text-white shadow-[0_7px_16px_rgba(59,130,246,0.22)] transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              <img src={`${assets}/bf9a5.svg`} alt="" className="brightness-0 invert" />
              Parafrase
            </button>
          </div>
        </section>

        <section className="mt-[18px] rounded-[20px] border border-[#e4e4e7]/80 bg-[#fcfcfc] p-4 shadow-[0_0_0_1px_rgba(24,24,27,0.06),0_2px_8px_-2px_rgba(24,24,27,0.04)] md:p-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h2 className="font-['Inter:Semi_Bold'] text-lg font-semibold md:text-xl">Lanjutkan ke fitur Alerin lainnya</h2>
          </div>
          <button
            type="button"
            className="mt-5 flex w-full items-center gap-4 rounded-[15px] border border-[#e4e4e7] bg-[#fafafa] p-[18px] text-left transition-colors hover:border-blue-200 hover:bg-blue-50/40"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] border border-slate-200/80 bg-white">
              <img src={`${assets}/1a98b.svg`} alt="" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-['Inter:Bold'] text-sm font-bold">Alerin Cek Naskah</span>
              <span className="mt-0.5 block font-['Inter:Regular'] text-xs text-[#71717a]">
                Ubah teks skripsi otomatis dengan pilihan gaya &amp; intensitas.
              </span>
            </span>
            <img src={`${assets}/5a1f0.svg`} alt="" />
          </button>
        </section>

        <aside className="mt-[18px] flex items-center gap-4 rounded-[15px] border border-[#e4e4e7]/80 bg-[#fcfcfc] px-5 py-4 shadow-[0_2px_4px_rgba(24,24,27,0.04)]">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]">
            <img src={`${assets}/5c089.svg`} alt="" />
          </span>
          <div>
            <p className="font-['Inter:Semi_Bold'] text-[15px] font-semibold">Pendamping, bukan penghapus sumber</p>
            <p className="mt-0.5 font-['Inter:Regular'] text-xs text-[#71717a]">
              Alerin mempertahankan kutipan dan mengingatkan atribusi. Hasil tetap perlu kamu periksa.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
