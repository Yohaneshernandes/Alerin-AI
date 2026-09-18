import svgPaths from "./svg-y2sz9s295p";

function AmbientBackgroundShapesAndPlayfulAccents() {
  return <div className="absolute inset-[0_0_128px_0] opacity-40" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 1280 905' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(90.51 0 0 63.993 640 452.5)'><stop stop-color='rgba(203,213,225,1)' offset='0.058926'/><stop stop-color='rgba(203,213,225,0)' offset='0.058926'/></radialGradient></defs></svg>\")" }} data-name="Ambient background shapes and playful accents" />;
}

function Svg() {
  return (
    <div className="absolute left-[32px] size-[32px] top-[112px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
        <g id="SVG">
          <path d={svgPaths.p3e38f040} fill="#6EE7B7" fillOpacity="0.7" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg1() {
  return (
    <div className="absolute bottom-[272px] right-[48px] size-[24px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="24" preserveAspectRatio="none" viewBox="0 0 24 24" width="24">
        <g id="SVG">
          <path d={svgPaths.p330d05e0} fill="#FCD34D" fillOpacity="0.8" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="SVG">
          <path d={svgPaths.p2c584980} id="Vector" stroke="#475569" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
        </g>
      </svg>
    </div>
  );
}

function ButtonKembaliKeLangkahSebelumnya() {
  return (
    <div className="bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-center p-px relative rounded-[9999px] shrink-0 size-[44px]" data-name="Button - Kembali ke langkah sebelumnya">
      <div aria-hidden className="absolute border border-[rgba(226,232,240,0.8)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Svg2 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#64748b] text-[14px] text-center whitespace-nowrap">
        <p>
          <span className="leading-[20px]">{`Langkah `}</span>
          <span className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[20px] text-[#1e293b]">5</span>
          <span className="leading-[20px]">{` dari 5`}</span>
        </p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#10b981] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#059669] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Hampir Selesai! (98%)</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[4px] pr-[3.99px] relative size-full">
          <Container1 />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function ProgressBarTrack() {
  return (
    <div className="h-[10px] overflow-clip relative rounded-[9999px] shrink-0 w-full" data-name="Progress Bar Track">
      <div aria-hidden className="absolute bg-[rgba(226,232,240,0.9)] inset-0 pointer-events-none rounded-[9999px]" />
      <div className="absolute bg-gradient-to-r from-[#3b82f6] inset-[2px_2.43%_2px_0.45%] rounded-[9999px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] to-[#3b5bf5]" data-name="Progressbar" />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function CenterProgressStepTracker() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start max-w-[448px] relative shrink-0 w-full" data-name="Center Progress & Step Tracker">
      <Container />
      <ProgressBarTrack />
    </div>
  );
}

function CenterProgressStepTrackerMargin() {
  return (
    <div className="flex-[1_0_0] min-w-[448px] relative" data-name="Center Progress & Step Tracker:margin">
      <div className="content-stretch flex flex-col items-start min-w-[inherit] px-[164.391px] relative size-full">
        <CenterProgressStepTracker />
      </div>
    </div>
  );
}

function MascotTurtleIcon() {
  return (
    <div className="bg-[#10b981] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] relative rounded-[9999px] shrink-0 size-[28px]" data-name="Mascot Turtle Icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pb-[6.5px] pt-[5.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
          <p className="leading-[16px]">🐢</p>
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#1e293b] text-[14px] tracking-[-0.35px] whitespace-nowrap">
          <p>
            <span className="leading-[20px]">Pintarly</span>
            <span className="[word-break:break-word] font-['Liberation_Sans:Bold',sans-serif] leading-[20px] not-italic text-[#10b981]">.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function PintarlyBrandBadge() {
  return (
    <div className="backdrop-blur-[2px] bg-[rgba(255,255,255,0.9)] content-stretch flex gap-[10px] items-center px-[15px] py-[7px] relative rounded-[9999px] shrink-0" data-name="Pintarly Brand Badge">
      <div aria-hidden className="absolute border border-[#d1fae5] border-solid inset-0 pointer-events-none rounded-[9999px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <MascotTurtleIcon />
      <Container3 />
    </div>
  );
}

function HeaderSection() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="HeaderSection">
      <ButtonKembaliKeLangkahSebelumnya />
      <CenterProgressStepTrackerMargin />
      <PintarlyBrandBadge />
    </div>
  );
}

function HeaderSectionMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="HeaderSection:margin">
      <div className="content-stretch flex flex-col items-start pb-[8px] pt-[24px] px-[152px] relative size-full">
        <HeaderSection />
      </div>
    </div>
  );
}

function UsingImage3STurtleMascotRepresentationWithHighFidelitySvgIllustration() {
  return (
    <div className="relative shrink-0 size-[56px]" data-name="Using Image 3's Turtle Mascot representation with high-fidelity SVG illustration">
      <svg className="absolute block inset-0 size-full" fill="none" height="56" preserveAspectRatio="none" viewBox="0 0 56 56" width="56">
        <g id="Using Image 3's Turtle Mascot representation with high-fidelity SVG illustration">
          <path d={svgPaths.p1e0bb500} fill="#67E8F9" id="Vector" />
          <path d={svgPaths.pb4585a0} fill="#5EEAD4" id="Vector_2" />
          <path d={svgPaths.p3febc4e0} fill="#7DD3FC" id="Vector_3" />
          <path d={svgPaths.p2a750100} fill="#FDA4AF" id="Vector_4" opacity="0.6" />
          <path d={svgPaths.p2a7df680} fill="#FDA4AF" id="Vector_5" opacity="0.6" />
          <path d={svgPaths.p1b98800} id="Vector_6" stroke="#0F766E" strokeLinecap="round" strokeWidth="1.55556" />
          <g id="Vector_7">
            <path d={svgPaths.p3db6f400} fill="white" fillOpacity="0.25" />
            <path d={svgPaths.p3db6f400} stroke="white" strokeWidth="1.86667" />
          </g>
          <g id="Vector_8">
            <path d={svgPaths.p3257400} fill="white" fillOpacity="0.25" />
            <path d={svgPaths.p3257400} stroke="white" strokeWidth="1.86667" />
          </g>
          <path d="M26.4444 27.2222H29.5556" id="Vector_9" stroke="white" strokeWidth="1.71111" />
          <path d={svgPaths.pc569b00} fill="#0F172A" id="Vector_10" />
          <path d={svgPaths.p1a723100} fill="#0F172A" id="Vector_11" />
          <path d={svgPaths.p2af4fc00} fill="white" id="Vector_12" />
          <path d={svgPaths.p33dcc100} fill="white" id="Vector_13" />
          <path d={svgPaths.p6caae50} fill="#A3E635" id="Vector_14" />
          <path d={svgPaths.p1da11300} fill="#4ADE80" id="Vector_15" />
          <path d={svgPaths.p30657b00} fill="#84CC16" id="Vector_16" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundShadow() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip p-[4px] relative rounded-[9999px] shadow-[0px_0px_0px_4px_white,0px_8px_30px_-4px_rgba(16,185,129,0.08),0px_4px_12px_-2px_rgba(0,0,0,0.04)] shrink-0 size-[64px]" style={{ backgroundImage: "linear-gradient(45deg, rgb(209, 250, 229) 0%, rgb(240, 249, 255) 50%, rgb(236, 253, 245) 100%)" }} data-name="Background+Shadow">
      <UsingImage3STurtleMascotRepresentationWithHighFidelitySvgIllustration />
    </div>
  );
}

function AilyMascotAvatarContainer() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Aily Mascot Avatar Container">
      <BackgroundShadow />
      <div className="absolute bg-[#10b981] bottom-0 right-[4px] rounded-[9999px] size-[16px]" data-name="Online / Active Status Badge">
        <div aria-hidden className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[9999px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#1e293b] text-[24px] tracking-[-0.6px] w-full">
          <p>
            <span className="leading-[32px]">{`Lagi di `}</span>
            <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-[rgba(250,204,21,0.8)] decoration-from-font decoration-solid font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold leading-[32px] text-[#020617] underline">semester berapa?</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#64748b] text-[14px] w-full">
          <p className="leading-[20px] mb-0">Pilih semester aktifmu agar jadwal belajar, rekomendasi modul</p>
          <p className="leading-[20px]">tugas, dan kuis adaptif Aily tepat sasaran sesuai kurikulummu.</p>
        </div>
      </div>
    </div>
  );
}

function SpeechBubbleContainer() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[24px]" data-name="Speech Bubble Container">
      <div aria-hidden className="absolute border border-[#f1f5f9] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="content-stretch flex flex-col gap-[6px] items-start p-[25px] relative size-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[24px] shadow-[0px_12px_35px_-5px_rgba(15,23,42,0.06),0px_4px_6px_-2px_rgba(0,0,0,0.02)]" data-name="Speech Bubble Container:shadow" />
        <Heading />
        <Container5 />
        <div className="absolute h-[20px] left-[-11px] top-[27px] w-[14px]" data-name="Speech Arrow Tail">
          <div aria-hidden className="absolute border-b-10 border-r-14 border-solid border-t-10 border-white inset-0 pointer-events-none shadow-[-2px_1px_1px_0px_rgba(0,0,0,0.03)]" />
        </div>
      </div>
    </div>
  );
}

function SectionPertanyaanAily() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Section - Pertanyaan Aily">
      <AilyMascotAvatarContainer />
      <SpeechBubbleContainer />
    </div>
  );
}

function SectionPertanyaanAilyMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[32px] relative shrink-0 w-full" data-name="Section - Pertanyaan Aily:margin">
      <SectionPertanyaanAily />
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#047857] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px]">🎓</p>
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pl-[1.72px] pr-[1.74px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#047857] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px] mb-0">Sarjana</p>
          <p className="leading-[20px]">(S1)</p>
        </div>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#d1fae5] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center px-[6px] py-[2px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#065f46] text-[10px] text-center tracking-[0.5px] uppercase whitespace-nowrap">
          <p className="leading-[20px]">AKTIF</p>
        </div>
      </div>
    </div>
  );
}

function ButtonS1TabActive() {
  return (
    <div className="bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[6px] items-center justify-center px-[13px] py-[9px] relative rounded-[12px] shrink-0 w-[145.33px]" data-name="Button - S1 Tab (Active)">
      <div aria-hidden className="absolute border border-[rgba(209,250,229,0.5)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container6 />
      <Container7 />
      <Background />
    </div>
  );
}

function ButtonS2Tab() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[12px] py-[8px] relative rounded-[12px] shrink-0 w-[143.34px]" data-name="Button - S2 Tab">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#475569] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Magister (S2)</p>
      </div>
    </div>
  );
}

function ButtonS3Tab() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[12px] py-[8px] relative rounded-[12px] shrink-0 w-[143.33px]" data-name="Button - S3 Tab">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#475569] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Doktor (S3)</p>
      </div>
    </div>
  );
}

function OverlayShadow() {
  return (
    <div className="content-stretch flex items-center justify-between max-w-[448px] p-[4px] relative rounded-[16px] shrink-0 w-[448px]" data-name="Overlay+Shadow">
      <div aria-hidden className="absolute bg-[rgba(226,232,240,0.7)] inset-0 pointer-events-none rounded-[16px]" />
      <ButtonS1TabActive />
      <ButtonS2Tab />
      <ButtonS3Tab />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#94a3b8] text-[12px] text-center whitespace-nowrap">
        <p>
          <span className="leading-[16px]">{`Menampilkan pilihan semester untuk jenjang `}</span>
          <span className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] text-[#475569]">S1 (Semester 1 sampai 8+)</span>
        </p>
      </div>
    </div>
  );
}

function SectionPilihJenjangKuliah() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full" data-name="Section - Pilih Jenjang Kuliah">
      <OverlayShadow />
      <Container8 />
    </div>
  );
}

function SectionPilihJenjangKuliahMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[20px] relative shrink-0 w-full" data-name="Section - Pilih Jenjang Kuliah:margin">
      <SectionPilihJenjangKuliah />
    </div>
  );
}

function LabelItem1Semester() {
  return (
    <div className="bg-white col-1 drop-shadow-[0px_2px_3px_rgba(0,0,0,0.04)] h-[58px] justify-self-stretch relative rounded-[9999px] row-1 shrink-0" data-name="Label - Item 1: Semester 1">
      <div aria-hidden className="absolute border border-[rgba(226,232,240,0.9)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[25px] py-[17px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#334155] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[24px]">Semester 1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LabelItem2Semester() {
  return (
    <div className="bg-white col-2 drop-shadow-[0px_2px_3px_rgba(0,0,0,0.04)] h-[58px] justify-self-stretch relative rounded-[9999px] row-1 shrink-0" data-name="Label - Item 2: Semester 2">
      <div aria-hidden className="absolute border border-[rgba(226,232,240,0.9)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[25px] py-[17px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#334155] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[24px]">Semester 2</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LabelItem3Semester() {
  return (
    <div className="bg-white col-1 drop-shadow-[0px_2px_3px_rgba(0,0,0,0.04)] h-[58px] justify-self-stretch relative rounded-[9999px] row-2 shrink-0" data-name="Label - Item 3: Semester 3">
      <div aria-hidden className="absolute border border-[rgba(226,232,240,0.9)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[25px] py-[17px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#334155] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[24px]">Semester 3</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LabelItem4Semester() {
  return (
    <div className="bg-white col-2 drop-shadow-[0px_2px_3px_rgba(0,0,0,0.04)] h-[58px] justify-self-stretch relative rounded-[9999px] row-2 shrink-0" data-name="Label - Item 4: Semester 4">
      <div aria-hidden className="absolute border border-[rgba(226,232,240,0.9)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[25px] py-[17px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#334155] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[24px]">Semester 4</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LabelItem5Semester() {
  return (
    <div className="bg-white col-1 drop-shadow-[0px_2px_3px_rgba(0,0,0,0.04)] h-[58px] justify-self-stretch relative rounded-[9999px] row-3 shrink-0" data-name="Label - Item 5: Semester 5">
      <div aria-hidden className="absolute border border-[rgba(226,232,240,0.9)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[25px] py-[17px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#334155] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[24px]">Semester 5</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LabelItem6Semester() {
  return (
    <div className="bg-white col-2 drop-shadow-[0px_2px_3px_rgba(0,0,0,0.04)] h-[58px] justify-self-stretch relative rounded-[9999px] row-3 shrink-0" data-name="Label - Item 6: Semester 6">
      <div aria-hidden className="absolute border border-[rgba(226,232,240,0.9)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[25px] py-[17px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#334155] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[24px]">Semester 6</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LabelItem7Semester() {
  return (
    <div className="bg-white col-1 drop-shadow-[0px_2px_3px_rgba(0,0,0,0.04)] h-[58px] justify-self-stretch relative rounded-[9999px] row-4 shrink-0" data-name="Label - Item 7: Semester 7">
      <div aria-hidden className="absolute border border-[rgba(226,232,240,0.9)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[25px] py-[17px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#334155] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[24px]">Semester 7</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LabelItem8Semester8PreSelectedAsShownInTheReferenceImage() {
  return (
    <div className="bg-[#3b5bf5] col-2 drop-shadow-[0px_4px_7px_rgba(59,91,245,0.35)] h-[58px] justify-self-stretch relative rounded-[9999px] row-4 shrink-0" data-name="Label - Item 8: Semester 8+ (Pre-selected as shown in the reference image)">
      <div aria-hidden className="absolute border border-[#2563eb] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[25px] py-[17px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
            <p className="leading-[24px]">Semester 8+</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fieldset() {
  return (
    <div className="gap-x-[14px] gap-y-[14px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[____58px_58px_58px_58px] relative shrink-0 w-full" data-name="Fieldset">
      <LabelItem1Semester />
      <LabelItem2Semester />
      <LabelItem3Semester />
      <LabelItem4Semester />
      <LabelItem5Semester />
      <LabelItem6Semester />
      <LabelItem7Semester />
      <LabelItem8Semester8PreSelectedAsShownInTheReferenceImage />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white tracking-[0.4px] whitespace-nowrap">
        <p className="leading-[24px]">{`Lanjut & Siapkan Rencana Belajar`}</p>
      </div>
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="SVG">
          <path d={svgPaths.p18e73b00} id="Vector" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.08333" />
        </g>
      </svg>
    </div>
  );
}

function PrimaryCtaButtonWarmYellowAmberMatchingPintarlyStyle() {
  return (
    <div className="bg-[#3b5bf5] content-stretch flex gap-[7.99px] items-center justify-center min-w-[320px] px-[32px] py-[16px] relative rounded-[9999px] shrink-0" data-name="Primary CTA Button (Warm Yellow/Amber matching Pintarly style)">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_-0.01px_0_0] rounded-[9999px] shadow-[0px_10px_25px_-4px_rgba(59,91,245,0.45)]" data-name="Primary CTA Button (Warm Yellow/Amber matching Pintarly style):shadow" />
      <Container9 />
      <Svg3 />
    </div>
  );
}

function ButtonSkipLaterLink() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center py-[4px] relative shrink-0" data-name="Button - Skip / Later Link">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#94a3b8] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Lewati dulu, tentukan nanti di profil</p>
      </div>
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full" data-name="ActionButtons">
      <PrimaryCtaButtonWarmYellowAmberMatchingPintarlyStyle />
      <ButtonSkipLaterLink />
    </div>
  );
}

function Form2ColumnsX4RowsMatchingReferenceLayoutExactly() {
  return (
    <div className="content-stretch flex flex-col gap-[56px] items-start relative shrink-0 w-full" data-name="Form - 2 Columns x 4 Rows Matching Reference Layout exactly">
      <Fieldset />
      <ActionButtons />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['FreeSerif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">🔒</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#94a3b8] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Pilihan semester dapat diperbarui kapan saja seiring pergantian tahun ajaran.</p>
      </div>
    </div>
  );
}

function FlexibilityPrivacyBadge() {
  return (
    <div className="content-stretch flex gap-[6px] items-center px-[16px] relative shrink-0" data-name="Flexibility & Privacy Badge">
      <Container10 />
      <Container11 />
    </div>
  );
}

function FlexibilityPrivacyBadgeMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[20px] relative shrink-0" data-name="Flexibility & Privacy Badge:margin">
      <FlexibilityPrivacyBadge />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-center max-w-[576px] relative shrink-0 w-[576px]" data-name="Container">
      <SectionPertanyaanAilyMargin />
      <SectionPilihJenjangKuliahMargin />
      <Form2ColumnsX4RowsMatchingReferenceLayoutExactly />
      <FlexibilityPrivacyBadgeMargin />
    </div>
  );
}

function MainContent() {
  return (
    <div className="relative shrink-0 w-full" data-name="MainContent">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[16px] py-[24px] relative size-full">
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#94a3b8] text-[12px] text-center whitespace-nowrap">
          <p className="leading-[16px]">© 2025 Pintarly. Seluruh hak cipta dilindungi undang-undang.</p>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="backdrop-blur-[2px] bg-[rgba(255,255,255,0.5)] content-stretch flex flex-col items-start pb-[16px] pt-[17px] relative shrink-0 w-full" data-name="Footer">
      <div aria-hidden className="absolute border-[rgba(226,232,240,0.6)] border-solid border-t inset-0 pointer-events-none" />
      <Container12 />
    </div>
  );
}

export default function Pintarly05KamuAdaDiSemesterBerapa() {
  return (
    <div className="content-stretch flex flex-col items-start justify-between pb-[128px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 250, 252) 0%, rgb(248, 250, 252) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Pintarly - 05 Kamu Ada di Semester Berapa">
      <AmbientBackgroundShapesAndPlayfulAccents />
      <div className="absolute bg-[rgba(209,250,229,0.6)] blur-[32px] right-[-96px] rounded-[9999px] size-[384px] top-[-96px]" data-name="Soft Mint Gradient Glow Top Right" />
      <div className="absolute bg-[rgba(254,243,199,0.6)] blur-[32px] bottom-[-128px] left-[-80px] rounded-[9999px] size-[384px]" data-name="Soft Amber Glow Bottom Left" />
      <Svg />
      <Svg1 />
      <div className="-translate-y-1/2 absolute bg-[rgba(52,211,153,0.4)] left-[40px] rounded-[9999px] size-[12px] top-[calc(50%-58px)]" data-name="Overlay" />
      <div className="absolute bg-[rgba(251,191,36,0.35)] bottom-[69.25%] right-[64px] rounded-[9999px] top-[29.2%] w-[16px]" data-name="Overlay" />
      <HeaderSectionMargin />
      <MainContent />
      <Footer />
    </div>
  );
}