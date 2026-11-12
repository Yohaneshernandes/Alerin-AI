type FiturLandingFigmaProps = {
  onChat: () => void;
  onJurnal: () => void;
  onSkripsi: () => void;
  onParafrase: () => void;
};

const assets = "/assets/fitur-design";

export default function FiturLandingFigma({
  onChat,
  onJurnal,
  onSkripsi,
  onParafrase,
}: FiturLandingFigmaProps) {
  const features = [
    {
      title: "Alerin Chat",
      description: "AI asisten untuk riset akademik dan diskusi topik.",
      icon: "05de5.svg",
      mobileIcon: "17983.svg",
      iconClass: "h-[44.283px] w-[44.283px]",
      framedIcon: false,
      arrow: "2138c.svg",
      mobileArrow: "c4a81.svg",
      action: onChat,
    },
    {
      title: "Alerin Jurnal",
      description: "Temukan referensi akademik terindeks Scopus & Sinta.",
      icon: "5ad2c.svg",
      mobileIcon: "0a094.svg",
      iconClass: "h-[44.283px] w-[44.283px]",
      framedIcon: false,
      arrow: "2138c.svg",
      mobileArrow: "c4a81.svg",
      action: onJurnal,
    },
    {
      title: "Alerin Skripsi",
      description: "Dapatkan arahan sesuai tahap penelitian dan revisi kamu.",
      icon: "4d2e9.svg",
      mobileIcon: "52023.svg",
      iconClass: "h-[16.606px] w-[20.296px]",
      framedIcon: true,
      arrow: "939bb.svg",
      mobileArrow: "a19d2.svg",
      action: onSkripsi,
    },
    {
      title: "Alerin Parafrase",
      description: "Ubah teks skripsi otomatis dengan pilihan gaya & intensitas.",
      icon: "377ce.svg",
      mobileIcon: "bff8f.svg",
      iconClass: "h-[16.103px] w-[18.116px]",
      framedIcon: true,
      arrow: "3f8a0.svg",
      mobileArrow: "6fcef.svg",
      action: onParafrase,
    },
  ];

  return (
    <div className="-mb-24 flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#f5f8fe] md:mb-0">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-28 pt-20 md:px-8 md:py-6">
        <div className="mx-auto max-w-[1020px]">
          <div className="relative block md:flex md:items-start md:justify-between md:gap-5">
            <div className="w-full md:w-auto">
              <span className="inline-flex rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1 font-['Inter:Bold'] text-xs font-bold text-[#3b82f6]">
                {features.length} alur akademik
              </span>
              <h1 className="mt-3 font-['Plus_Jakarta_Sans:SemiBold'] text-[25px] font-semibold leading-8 text-[#0f172b] md:text-2xl">
                Pilih cara Alerin membantumu
              </h1>
              <p className="mt-1 max-w-[685px] font-['Inter:Regular'] text-sm leading-5 text-[#62748e] md:leading-[19px]">
                Setiap fitur memberi formulir dan hasil berbeda agar mahasiswa tidak memulai dari ruang chat kosong.
              </p>
            </div>
            <button
              type="button"
              onClick={onChat}
              className="absolute right-0 top-0 flex shrink-0 items-center gap-2 rounded-xl border border-[#e2e8f0] px-4 py-2 font-['Inter:Semi_Bold'] text-sm font-semibold text-[#45556c] transition-colors hover:bg-white md:static"
            >
              <img src={`${assets}/0bba3.svg`} alt="" />
              Chat
            </button>
          </div>

          <div className="mt-[18px] grid gap-x-3 gap-y-3 sm:grid-cols-2 md:gap-y-[15px]">
            {features.map(feature => (
              <button
                key={feature.title}
                type="button"
                onClick={feature.action}
                className="group flex min-h-[99px] items-center gap-3 overflow-hidden rounded-2xl border-[1.2px] border-[#e2e8f0] bg-white p-5 text-left shadow-[0_0_25px_2px_rgba(37,99,235,0.1)] transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_10px_26px_rgba(37,99,235,0.14)] md:min-h-[124px] md:border md:shadow-[0_0_20px_2px_rgba(37,99,235,0.1)]"
              >
                <span className={`flex h-[43.987px] w-[43.987px] shrink-0 items-center justify-center rounded-2xl bg-[#eff6ff] md:h-[44.283px] md:w-[44.283px] ${feature.framedIcon ? "" : "md:bg-transparent"}`}>
                  <img
                    src={`${assets}/${feature.mobileIcon}`}
                    alt=""
                    className="md:hidden"
                  />
                  <img src={`${assets}/${feature.icon}`} alt="" className={`hidden md:block ${feature.iconClass}`} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-['Plus_Jakarta_Sans:Bold'] text-[14px] font-bold leading-5 text-[#1d293d]">
                    {feature.title}
                  </span>
                  <span className="mt-[3px] block font-['Inter:Regular'] text-xs leading-[17px] text-[#71809a] md:mt-1">
                    {feature.description}
                  </span>
                </span>
                <span className="flex h-[13.988px] w-[13.988px] shrink-0 items-center justify-center md:hidden">
                  <img
                    src={`${assets}/${feature.mobileArrow}`}
                    alt=""
                  />
                </span>
                <img src={`${assets}/${feature.arrow}`} alt="" className="hidden shrink-0 transition-transform group-hover:translate-x-0.5 md:block" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
