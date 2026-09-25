import svgPaths from "./svg-cp9dj7kfzw";
import imgAilyPintarlyMascot from "./393f30616fec04ebe3210dcb60161f7c844d06e5.png";

function Svg() {
  return (
    <div className="absolute left-[-48px] size-[384px] top-[-48px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="384" preserveAspectRatio="none" viewBox="0 0 384 384" width="384">
        <g id="SVG">
          <path d={svgPaths.p2ce04600} id="Vector" stroke="#22C55E" strokeDasharray="30.72 23.04" strokeLinecap="round" strokeOpacity="0.2" strokeWidth="23.04" />
        </g>
      </svg>
    </div>
  );
}

function Svg1() {
  return (
    <div className="absolute right-[-80px] size-[320px] top-[266.66px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="320" preserveAspectRatio="none" viewBox="0 0 320 320" width="320">
        <g id="SVG">
          <path d={svgPaths.p3f325900} id="Vector" stroke="#6CB6D0" strokeOpacity="0.3" strokeWidth="12.8" />
        </g>
      </svg>
    </div>
  );
}

function Svg2() {
  return (
    <div className="absolute bottom-[40px] left-[64px] size-[192px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="192" preserveAspectRatio="none" viewBox="0 0 192 192" width="192">
        <g id="SVG">
          <path d={svgPaths.pd249550} id="Vector" stroke="#FFE16F" strokeDasharray="11.52 15.36" strokeOpacity="0.5" strokeWidth="11.52" />
          <path d={svgPaths.p3b4e0050} fill="#FFE16F" fillOpacity="0.4" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute inset-[0_0_569px_0] opacity-40 overflow-clip" data-name="Container">
      <Svg />
      <Svg1 />
      <Svg2 />
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 size-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
        <g id="Container">
          <path d={svgPaths.p2069b680} fill="#71717A" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ButtonKembaliKeLangkahSebelumnya() {
  return (
    <div className="bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-center relative rounded-[9999px] shrink-0 size-[40px]" data-name="Button - Kembali ke langkah sebelumnya">
      <Container1 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#22c55e] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[14px] tracking-[0.44px] whitespace-nowrap">
        <p className="leading-[20px]">Langkah 7 dari 8</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#3b5bf5] text-[11px] tracking-[0.44px] whitespace-nowrap">
        <p className="leading-[16px]">85% Selesai</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container4 />
      <Container5 />
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#e5e2e3] h-[8px] overflow-clip relative rounded-[9999px] shrink-0 w-full" data-name="Background">
      <div className="absolute bg-[#3b5bf5] inset-[2px_15.44%_2px_0.63%] rounded-[9999px]" data-name="Background" />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-center max-w-[320px] min-w-px relative" data-name="Container">
      <Container3 />
      <Background />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[11.667px] relative shrink-0 w-[11.09px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.6667" preserveAspectRatio="none" viewBox="0 0 11.0902 11.6667" width="11.0902">
        <g id="Container">
          <path d={svgPaths.pd8cd100} fill="#03677F" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#ebf8fe] content-stretch flex gap-[4px] items-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Background">
      <Container6 />
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#03677f] text-[11px] tracking-[0.44px] whitespace-nowrap">
        <p className="leading-[16px]">AI Tailored</p>
      </div>
    </div>
  );
}

function TopStepBarNavigationContext() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Top Step Bar & Navigation Context">
      <ButtonKembaliKeLangkahSebelumnya />
      <Container2 />
      <Background1 />
    </div>
  );
}

function TopStepBarNavigationContextMargin() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[24px] pb-[24px] right-[24px] top-[40px]" data-name="Top Step Bar & Navigation Context:margin">
      <TopStepBarNavigationContext />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">🎓</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#006e2f] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Skripsi / Tesis / Disertasi</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col h-[8px] items-start pl-[2px] relative shrink-0 w-[10px]" data-name="Margin">
      <div className="bg-[#006e2f] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex-[1_0_0] min-w-px relative rounded-[8px]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[10px] relative size-full">
          <Container7 />
          <Container8 />
          <Margin />
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">📝</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#71717a] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">{`Tugas Kuliah & Paper`}</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="flex-[1_0_0] min-w-px relative rounded-[8px]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8.01px] items-center justify-center px-[12px] py-[10px] relative size-full">
          <Container9 />
          <Container10 />
        </div>
      </div>
    </div>
  );
}

function BackgroundShadow() {
  return (
    <div className="relative rounded-[12px] shrink-0 w-full" data-name="Background+Shadow">
      <div aria-hidden className="absolute bg-[#f0edee] inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[6px] items-center justify-center p-[6px] relative size-full">
          <Button />
          <Button1 />
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="15" preserveAspectRatio="none" viewBox="0 0 15 15" width="15">
        <g id="Container">
          <path d={svgPaths.p1c6d5490} fill="#03677F" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[33px] relative shrink-0 w-[664px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] left-0 text-[#004657] text-[12px] top-[15.75px] whitespace-nowrap">
        <p className="mb-0">
          <span className="leading-[16.5px]">Catatan:</span>
          <span className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16.5px]">{` Jika kamu ingin mengerjakan tugas mata kuliah reguler, kamu bisa beralih tab di atas untuk memilih format`}</span>
        </p>
        <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16.5px]">tugas.</p>
      </div>
    </div>
  );
}

function LightNoteBanner() {
  return (
    <div className="bg-[#ebf8fe] relative rounded-[12px] shrink-0 w-full" data-name="Light Note Banner">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[14px] py-[8px] relative size-full">
          <Container11 />
          <Container12 />
        </div>
      </div>
    </div>
  );
}

function CategoryModeSwitcherTabs() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Category Mode Switcher Tabs">
      <BackgroundShadow />
      <LightNoteBanner />
    </div>
  );
}

function CategoryModeSwitcherTabsMargin() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[24px] pb-[20px] right-[24px] top-[245.5px]" data-name="Category Mode Switcher Tabs:margin">
      <CategoryModeSwitcherTabs />
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0 size-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="18.3333" preserveAspectRatio="none" viewBox="0 0 18.3333 18.3333" width="18.3333">
        <g id="Container">
          <path d={svgPaths.p3ca8ed80} fill="#03677F" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[36px]" data-name="Background">
      <Container14 />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 right-0 top-[-1px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[14px] whitespace-nowrap">
        <p className="leading-[17.5px]">Output AI untuk Fase Terpilih:</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[39.5px] relative shrink-0 w-[401.02px]" data-name="Container">
      <Container16 />
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] left-0 text-[#71717a] text-[12px] top-[30px] whitespace-nowrap">
        <p className="leading-[18px]">Template matriks penelitian Bab 1-3, sitasi APA 7th, dan tips ACC dosen.</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <Background2 />
      <Container15 />
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[14px] relative shrink-0 w-[14.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14.6667 14" width="14.6667">
        <g id="Container">
          <path d={svgPaths.pcb8380} fill="#006E2F" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#006e2f] text-[11px] tracking-[0.44px] whitespace-nowrap">
        <p className="leading-[16px]">Standar Dikti Siap Pakai</p>
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] content-stretch flex gap-[4px] items-center px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-name="Overlay">
      <Container17 />
      <Container18 />
    </div>
  );
}

function AiGuidanceRoadmapPreviewWidget() {
  return (
    <div className="bg-gradient-to-r drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] from-[#ebf8fe] relative rounded-[16px] shrink-0 to-[#e8f8ee] via-1/2 via-white w-full" data-name="AI Guidance Roadmap Preview Widget">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Container13 />
          <Overlay />
        </div>
      </div>
    </div>
  );
}

function AiGuidanceRoadmapPreviewWidgetMargin() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[24px] pb-[32px] right-[24px] top-[883.5px]" data-name="AI Guidance Roadmap Preview Widget:margin">
      <AiGuidanceRoadmapPreviewWidget />
    </div>
  );
}

function AilyPintarlyMascot() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Aily Pintarly Mascot">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAilyPintarlyMascot} />
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div className="content-stretch flex items-center justify-center p-[6px] relative rounded-[16px] shrink-0 size-[56px]" style={{ backgroundImage: "linear-gradient(44.999999999999986deg, rgb(232, 248, 238) 0%, rgb(255, 255, 255) 50%, rgb(235, 248, 254) 100%)" }} data-name="Background">
      <div className="absolute bg-[rgba(255,255,255,0)] left-0 rounded-[16px] shadow-[0px_0px_0px_2px_rgba(0,110,47,0.1),0px_1px_2px_0px_rgba(0,0,0,0.05)] size-[56px] top-0" data-name="Overlay+Shadow" />
      <AilyPintarlyMascot />
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[11px] relative shrink-0 w-[11.25px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 11.25 11" width="11.25">
        <g id="Container">
          <path d={svgPaths.p156c7600} fill="#221B00" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundShadow1() {
  return (
    <div className="absolute bg-[#ffe16f] bottom-[-4px] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-center right-[-4px] rounded-[9999px] size-[20px]" data-name="Background+Shadow">
      <Container19 />
    </div>
  );
}

function MascotAvatarFrame() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Mascot Avatar Frame">
      <Background3 />
      <BackgroundShadow1 />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[20px] whitespace-nowrap">
        <p>
          <span className="leading-[28px]">{`Sedang di `}</span>
          <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-[#22c55e] decoration-from-font decoration-wavy font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[28px] text-[#006e2f] underline">tahap mana</span>
          <span className="leading-[28px]">{` risetmu?`}</span>
        </p>
      </div>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(255,225,111,0.6)] content-stretch flex flex-col items-start px-[8px] py-[2px] relative rounded-[6px] shrink-0" data-name="Overlay">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#776300] text-[11px] tracking-[0.44px] whitespace-nowrap">
        <p className="leading-[16px]">Fokus Riset</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Overlay1 />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[14px] w-full">
        <p className="leading-[22.75px] mb-0">Pilih fase pengerjaan saat ini agar Pintarly AI menyiapkan panduan struktur bab, kurasi jurnal</p>
        <p className="leading-[22.75px]">bereputasi, dan checklist milestone harian yang presisi.</p>
      </div>
    </div>
  );
}

function DialogueBubble() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[3.375px] items-start min-w-px relative" data-name="Dialogue Bubble">
      <Container20 />
      <Container21 />
    </div>
  );
}

function FriendlyMascotPromptBox() {
  return (
    <div className="bg-white relative rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Friendly Mascot Prompt Box">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[16px] items-start p-[20px] relative size-full">
          <MascotAvatarFrame />
          <DialogueBubble />
          <div className="absolute bg-[rgba(34,197,94,0.1)] blur-[12px] bottom-[-23.13px] right-[-24px] rounded-[9999px] size-[96px]" data-name="Overlay+Blur" />
        </div>
      </div>
    </div>
  );
}

function FriendlyMascotPromptBoxMargin() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[24px] pb-[24px] right-[24px] top-[104px]" data-name="Friendly Mascot Prompt Box:margin">
      <FriendlyMascotPromptBox />
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 size-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="18.3333" preserveAspectRatio="none" viewBox="0 0 18.3333 18.3333" width="18.3333">
        <g id="Container">
          <path d={svgPaths.p3313b100} fill="#3D4A3D" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#f6f3f4] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[44px]" data-name="Background">
      <Container22 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[16px] w-full">
        <p className="leading-[24px]">Belum mulai</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[12px] w-full">
        <p className="leading-[19.5px] mb-0">Ingin belajar cara menyusun skripsi dari</p>
        <p className="leading-[19.5px]">dasar dan alur administrasi kampus.</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="content-stretch flex flex-col gap-[2px] items-start pr-[24px] relative size-full">
        <Heading1 />
        <Container24 />
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[7.015px] relative shrink-0 w-[9.508px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
        <g id="Container" opacity="0">
          <path d={svgPaths.p25f8ca80} fill="white" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background5() {
  return (
    <div className="absolute bg-[#e5e2e3] content-stretch flex items-center justify-center right-[16px] rounded-[9999px] size-[20px] top-[16px]" data-name="Background">
      <Container25 />
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white col-1 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] h-[97px] justify-self-stretch relative rounded-[16px] row-1 shrink-0" data-name="Card 1">
      <div className="content-stretch flex gap-[14px] items-start p-[16px] relative size-full">
        <Background4 />
        <Container23 />
        <Background5 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[18.333px] relative shrink-0 w-[13.75px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="18.3333" preserveAspectRatio="none" viewBox="0 0 13.75 18.3333" width="13.75">
        <g id="Container">
          <path d={svgPaths.pbaaf300} fill="#3D4A3D" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background6() {
  return (
    <div className="bg-[#f6f3f4] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[44px]" data-name="Background">
      <Container26 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[16px] w-full">
        <p className="leading-[24px]">Mencari topik / judul</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[12px] w-full">
        <p className="leading-[19.5px] mb-0">Membantu ide riset, novelty, telaah gap</p>
        <p className="leading-[19.5px]">riset, dan perumusan judul skripsi.</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="content-stretch flex flex-col gap-[2px] items-start pr-[24px] relative size-full">
        <Heading2 />
        <Container28 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[7.015px] relative shrink-0 w-[9.508px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
        <g id="Container" opacity="0">
          <path d={svgPaths.p25f8ca80} fill="white" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background7() {
  return (
    <div className="absolute bg-[#e5e2e3] content-stretch flex items-center justify-center right-[16px] rounded-[9999px] size-[20px] top-[16px]" data-name="Background">
      <Container29 />
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white col-2 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] h-[97px] justify-self-stretch relative rounded-[16px] row-1 shrink-0" data-name="Card 2">
      <div className="content-stretch flex gap-[14px] items-start p-[16px] relative size-full">
        <Background6 />
        <Container27 />
        <Background7 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[14.667px] relative shrink-0 w-[20.167px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="14.6667" preserveAspectRatio="none" viewBox="0 0 20.1667 14.6667" width="20.1667">
        <g id="Container">
          <path d={svgPaths.p397d2d80} fill="#3B5BF5" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background8() {
  return (
    <div className="bg-[#dbe4ff] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[44px]" data-name="Background">
      <Container30 />
    </div>
  );
}

function Heading2Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[2px] relative shrink-0" data-name="Heading 2:margin">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#3b5bf5] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Proposal (Bab 1 - 3)</p>
      </div>
    </div>
  );
}

function Background9() {
  return (
    <div className="bg-[#3b5bf5] content-stretch flex flex-col items-start px-[6px] relative rounded-[4px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[10px] text-white whitespace-nowrap">
        <p className="leading-[12.5px]">TERPILIH</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading2Margin />
      <Background9 />
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#3d4a3d] text-[12px] w-full">
        <p className="leading-[19.5px] mb-0">Bab 1 sampai 3 untuk persiapan seminar</p>
        <p className="leading-[19.5px]">{`proposal (Sempro), teori & metodologi.`}</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="content-stretch flex flex-col items-start pr-[24px] relative size-full">
        <Container32 />
        <Container33 />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[7.963px] relative shrink-0 w-[10.442px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="7.9625" preserveAspectRatio="none" viewBox="0 0 10.4417 7.9625" width="10.4417">
        <g id="Container">
          <path d={svgPaths.p90c9340} fill="white" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundShadow2() {
  return (
    <div className="absolute bg-[#3b5bf5] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-center right-[16px] rounded-[9999px] size-[20px] top-[16px]" data-name="Background+Shadow">
      <Container34 />
    </div>
  );
}

function Card3DefaultActiveSelectedState() {
  return (
    <div className="bg-[#eff4ff] col-1 h-[97px] justify-self-stretch relative rounded-[16px] row-2 shrink-0" data-name="Card 3 (Default Active / Selected State)">
      <div className="content-stretch flex gap-[14px] items-start p-[16px] relative size-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[16px] shadow-[0px_0px_0px_2px_#3b5bf5,0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" data-name="Card 3 (Default Active / Selected State):shadow" />
        <Background8 />
        <Container31 />
        <BackgroundShadow2 />
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[19.25px] relative shrink-0 w-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="19.25" preserveAspectRatio="none" viewBox="0 0 18.3333 19.25" width="18.3333">
        <g id="Container">
          <path d={svgPaths.pe980f90} fill="#3D4A3D" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background10() {
  return (
    <div className="bg-[#f6f3f4] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[44px]" data-name="Background">
      <Container35 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[16px] w-full">
        <p className="leading-[24px]">Pengumpulan data</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[12px] w-full">
        <p className="leading-[19.5px] mb-0">Riset lapangan, sebar kuesioner, olah</p>
        <p className="leading-[19.5px]">statistik (SPSS/PLS/R), atau wawancara.</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="content-stretch flex flex-col gap-[2px] items-start pr-[24px] relative size-full">
        <Heading3 />
        <Container37 />
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[7.015px] relative shrink-0 w-[9.508px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
        <g id="Container" opacity="0">
          <path d={svgPaths.p25f8ca80} fill="white" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background11() {
  return (
    <div className="absolute bg-[#e5e2e3] content-stretch flex items-center justify-center right-[16px] rounded-[9999px] size-[20px] top-[16px]" data-name="Background">
      <Container38 />
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-white col-2 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] h-[97px] justify-self-stretch relative rounded-[16px] row-2 shrink-0" data-name="Card 4">
      <div className="content-stretch flex gap-[14px] items-start p-[16px] relative size-full">
        <Background10 />
        <Container36 />
        <Background11 />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[14.667px] relative shrink-0 w-[16.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="14.6667" preserveAspectRatio="none" viewBox="0 0 16.5 14.6667" width="16.5">
        <g id="Container">
          <path d={svgPaths.p2ebb6700} fill="#3D4A3D" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background12() {
  return (
    <div className="bg-[#f6f3f4] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[44px]" data-name="Background">
      <Container39 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[16px] w-full">
        <p className="leading-[24px]">Bab 4 - Selesai</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[12px] w-full">
        <p className="leading-[19.5px] mb-0">Penyusunan bab akhir, pembahasan</p>
        <p className="leading-[19.5px] mb-0">mendalam temuan hasil, dan kesimpulan</p>
        <p className="leading-[19.5px]">saran.</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="content-stretch flex flex-col gap-[2px] items-start pr-[24px] relative size-full">
        <Heading4 />
        <Container41 />
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[7.015px] relative shrink-0 w-[9.508px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
        <g id="Container" opacity="0">
          <path d={svgPaths.p25f8ca80} fill="white" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background13() {
  return (
    <div className="absolute bg-[#e5e2e3] content-stretch flex items-center justify-center right-[16px] rounded-[9999px] size-[20px] top-[16px]" data-name="Background">
      <Container42 />
    </div>
  );
}

function Card3() {
  return (
    <div className="bg-white col-1 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] h-[116.5px] justify-self-stretch relative rounded-[16px] row-3 shrink-0" data-name="Card 5">
      <div className="content-stretch flex gap-[14px] items-start p-[16px] relative size-full">
        <Background12 />
        <Container40 />
        <Background13 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="h-[17.417px] relative shrink-0 w-[20.167px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="17.4167" preserveAspectRatio="none" viewBox="0 0 20.1667 17.4167" width="20.1667">
        <g id="Container">
          <path d={svgPaths.p154d51f0} fill="#3D4A3D" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background14() {
  return (
    <div className="bg-[#f6f3f4] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[44px]" data-name="Background">
      <Container43 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[16px] w-full">
        <p className="leading-[24px]">Persiapan sidang</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[12px] w-full">
        <p className="leading-[19.5px] mb-0">Simulasi sidang meja hijau, prediksi tanya</p>
        <p className="leading-[19.5px]">{`jawab penguji, & slide presentasi.`}</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="content-stretch flex flex-col gap-[2px] items-start pr-[24px] relative size-full">
        <Heading5 />
        <Container45 />
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[7.015px] relative shrink-0 w-[9.508px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
        <g id="Container" opacity="0">
          <path d={svgPaths.p25f8ca80} fill="white" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background15() {
  return (
    <div className="absolute bg-[#e5e2e3] content-stretch flex items-center justify-center right-[16px] rounded-[9999px] size-[20px] top-[16px]" data-name="Background">
      <Container46 />
    </div>
  );
}

function Card4() {
  return (
    <div className="bg-white col-2 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] h-[116.5px] justify-self-stretch relative rounded-[16px] row-3 shrink-0" data-name="Card 6">
      <div className="content-stretch flex gap-[14px] items-start p-[16px] relative size-full">
        <Background14 />
        <Container44 />
        <Background15 />
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.5" preserveAspectRatio="none" viewBox="0 0 18.3333 16.5" width="18.3333">
        <g id="Container">
          <path d={svgPaths.p32d48480} fill="#3D4A3D" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background16() {
  return (
    <div className="bg-[#f6f3f4] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[44px]" data-name="Background">
      <Container47 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[16px] w-full">
        <p className="leading-[24px]">Stuck di tengah</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[12px] w-full">
        <p className="leading-[19.5px] mb-0">Bingung langkah selanjutnya, bimbingan</p>
        <p className="leading-[19.5px]">macet, atau ingin ganti arah variabel.</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="content-stretch flex flex-col gap-[2px] items-start pr-[24px] relative size-full">
        <Heading6 />
        <Container49 />
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="h-[7.015px] relative shrink-0 w-[9.508px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
        <g id="Container" opacity="0">
          <path d={svgPaths.p25f8ca80} fill="white" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background17() {
  return (
    <div className="absolute bg-[#e5e2e3] content-stretch flex items-center justify-center right-[16px] rounded-[9999px] size-[20px] top-[16px]" data-name="Background">
      <Container50 />
    </div>
  );
}

function Card5() {
  return (
    <div className="bg-white col-1 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] h-[116.5px] justify-self-stretch relative rounded-[16px] row-4 shrink-0" data-name="Card 7">
      <div className="content-stretch flex gap-[14px] items-start p-[16px] relative size-full">
        <Background16 />
        <Container48 />
        <Background17 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[13.819px] relative shrink-0 w-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="13.8188" preserveAspectRatio="none" viewBox="0 0 18.3333 13.8188" width="18.3333">
        <g id="Container">
          <path d={svgPaths.p2d1a8700} fill="#3D4A3D" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background18() {
  return (
    <div className="bg-[#f6f3f4] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[44px]" data-name="Background">
      <Container51 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[16px] w-full">
        <p className="leading-[24px]">{`Review & revisi`}</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[12px] w-full">
        <p className="leading-[19.5px] mb-0">Review menyeluruh draf bab 1-5, cek</p>
        <p className="leading-[19.5px] mb-0">plagiasi Turnitin, dan perbaikan catatan</p>
        <p className="leading-[19.5px]">dosen.</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="content-stretch flex flex-col gap-[2px] items-start pr-[24px] relative size-full">
        <Heading7 />
        <Container53 />
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="h-[7.015px] relative shrink-0 w-[9.508px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
        <g id="Container" opacity="0">
          <path d={svgPaths.p25f8ca80} fill="white" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background19() {
  return (
    <div className="absolute bg-[#e5e2e3] content-stretch flex items-center justify-center right-[16px] rounded-[9999px] size-[20px] top-[16px]" data-name="Background">
      <Container54 />
    </div>
  );
}

function Card6() {
  return (
    <div className="bg-white col-2 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] h-[116.5px] justify-self-stretch relative rounded-[16px] row-4 shrink-0" data-name="Card 8">
      <div className="content-stretch flex gap-[14px] items-start p-[16px] relative size-full">
        <Background18 />
        <Container52 />
        <Background19 />
      </div>
    </div>
  );
}

function RadiogroupPilihFasePengerjaanSkripsi() {
  return (
    <div className="gap-x-[14px] gap-y-[14px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[____97px_97px_116.50px_116.50px] relative shrink-0 w-full" data-name="Radiogroup - Pilih Fase Pengerjaan Skripsi">
      <Card />
      <Card1 />
      <Card3DefaultActiveSelectedState />
      <Card2 />
      <Card3 />
      <Card4 />
      <Card5 />
      <Card6 />
    </div>
  );
}

function RadiogroupPilihFasePengerjaanSkripsiMargin() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[24px] pb-[32px] right-[24px] top-[382.5px]" data-name="Radiogroup - Pilih Fase Pengerjaan Skripsi:margin">
      <RadiogroupPilihFasePengerjaanSkripsi />
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px]">Lanjut ke Pilih Kendala Utama</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="relative shrink-0 size-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
        <g id="Container">
          <path d={svgPaths.p32510800} fill="white" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function LinkPintarlyBrightYellowPrimaryCta() {
  return (
    <div className="bg-[#3b5bf5] relative rounded-[9999px] shrink-0 w-full" data-name="Link - Pintarly Bright Yellow Primary CTA">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center px-[32px] py-[16px] relative size-full">
          <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[9999px] shadow-[0px_8px_24px_-2px_rgba(59,91,245,0.45)]" data-name="Link - Pintarly Bright Yellow Primary CTA:shadow" />
          <Container55 />
          <Container56 />
        </div>
      </div>
    </div>
  );
}

function SecondarySoftLink() {
  return (
    <div className="content-stretch flex flex-col items-start py-[4px] relative shrink-0" data-name="Secondary Soft Link">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#71717a] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Lewati dulu, tentukan nanti di dashboard</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="h-[14px] relative shrink-0 w-[10.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 10.6667 14" width="10.6667">
        <g id="Container">
          <path d={svgPaths.p31864a80} fill="#6D7B6C" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex flex-col items-center pl-[31.59px] pr-[31.61px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[18px] mb-0">Fase pengerjaan dapat kamu perbarui kapan saja seiring progres</p>
        <p className="leading-[18px]">bimbinganmu.</p>
      </div>
    </div>
  );
}

function SafeInfoBadgeWithLockIcon() {
  return (
    <div className="content-stretch flex gap-[6px] items-center justify-center pt-[8px] relative shrink-0" data-name="Safe info badge with lock icon">
      <Container57 />
      <Container58 />
    </div>
  );
}

function ActionButtonsSubtext() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[14px] items-center left-[160px] max-w-[448px] right-[160px] top-[987px]" data-name="Action Buttons & Subtext">
      <LinkPintarlyBrightYellowPrimaryCta />
      <SecondarySoftLink />
      <SafeInfoBadgeWithLockIcon />
    </div>
  );
}

function Main() {
  return (
    <div className="h-[1183px] max-w-[768px] relative shrink-0 w-[768px]" data-name="Main">
      <TopStepBarNavigationContextMargin />
      <CategoryModeSwitcherTabsMargin />
      <AiGuidanceRoadmapPreviewWidgetMargin />
      <FriendlyMascotPromptBoxMargin />
      <RadiogroupPilihFasePengerjaanSkripsiMargin />
      <ActionButtonsSubtext />
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[12px] whitespace-nowrap">
        <p className="leading-[18px]">© 2025 Pintarly Indonesia. Sahabat Belajar Pintar Berbasis Kecerdasan Buatan.</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[12px] whitespace-nowrap">
        <p className="leading-[18px]">Pusat Bantuan</p>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#eaecef] text-[12px] whitespace-nowrap">
        <p className="leading-[18px]">•</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[12px] whitespace-nowrap">
        <p className="leading-[18px]">{`Privasi & Keamanan Data`}</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Container">
      <Link />
      <Container62 />
      <Link1 />
    </div>
  );
}

function Container59() {
  return (
    <div className="max-w-[1280px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center max-w-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between max-w-[inherit] px-[24px] relative size-full">
          <Container60 />
          <Container61 />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-[rgba(246,243,244,0.8)] content-stretch flex flex-col items-start py-[24px] relative shrink-0 w-full" data-name="Footer">
      <Container59 />
    </div>
  );
}

function PintarlyCuteCheerfulTurtleMascotWithGlassesVibrantModernVectorIconSoftMintGreenAndCyanGradientRoundedFriendlyShapesDesignContextPrimaryColor22C55EFontPlusJakartaSansModeLightRoundnessRoundedMdTheLogoShouldBeVisuallyConsistentWithTheseBrandTokens() {
  return (
    <div
      className="relative shrink-0 size-[32px]"
      data-name="Pintarly cute cheerful turtle mascot with glasses, vibrant modern vector icon, soft mint green and cyan gradient, rounded friendly shapes. Design context: - Primary color: #22c55e
- Font: plusJakartaSans
- Mode: light
- Roundness: rounded-md
. The logo should be visually consistent with these brand tokens."
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAilyPintarlyMascot} />
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[16px] tracking-[-0.4px] whitespace-nowrap">
        <p className="leading-[16px]">Pintarly</p>
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#71717a] text-[11px] tracking-[0.44px] w-full">
        <p className="leading-[11px]">Teman Belajar AI</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[2px] relative shrink-0 w-full" data-name="Margin">
      <Container67 />
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container66 />
      <Margin1 />
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Link">
      <PintarlyCuteCheerfulTurtleMascotWithGlassesVibrantModernVectorIconSoftMintGreenAndCyanGradientRoundedFriendlyShapesDesignContextPrimaryColor22C55EFontPlusJakartaSansModeLightRoundnessRoundedMdTheLogoShouldBeVisuallyConsistentWithTheseBrandTokens />
      <Container65 />
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex items-center min-w-[200px] pr-[66.39px] relative shrink-0" data-name="Container">
      <Link2 />
    </div>
  );
}

function Container71() {
  return (
    <div className="h-[12px] relative shrink-0 w-[14.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 14.6667 12" width="14.6667">
        <g id="Container">
          <path d={svgPaths.p3e18e180} fill="#006E2F" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container70() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <Container71 />
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[14px] tracking-[0.44px] whitespace-nowrap">
        <p className="leading-[20px]">Profil Pembelajar</p>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#71717a] text-[11px] tracking-[0.44px] whitespace-nowrap">
        <p className="leading-[16px]">Langkah 1 dari 4</p>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container70 />
      <Container72 />
    </div>
  );
}

function Background20() {
  return (
    <div className="bg-[#eaecef] h-[8px] overflow-clip relative rounded-[9999px] shrink-0 w-full" data-name="Background">
      <div className="absolute bg-[#3b5bf5] bottom-0 left-0 right-3/4 rounded-[9999px] top-0" data-name="Background" />
    </div>
  );
}

function Container68() {
  return (
    <div className="flex-[1_0_0] max-w-[448px] min-w-px relative" data-name="Container">
      <div className="flex flex-col items-center justify-center max-w-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[6px] items-center justify-center max-w-[inherit] px-[16px] relative size-full">
          <Container69 />
          <Background20 />
        </div>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex flex-col items-start px-[8px] py-[6px] relative rounded-[8px] shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Simpan Draf</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="content-stretch flex flex-col items-start px-[8px] py-[6px] relative rounded-[8px] shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Bantuan</p>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="content-stretch flex gap-[7.99px] items-center relative shrink-0" data-name="Nav">
      <Link3 />
      <Link4 />
    </div>
  );
}

function Container74() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Container">
          <path d={svgPaths.p3189a600} fill="white" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundShadow3() {
  return (
    <div className="bg-[#006e2f] content-stretch drop-shadow-[0px_2px_4px_rgba(0,110,47,0.2)] flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background+Shadow">
      <Container74 />
    </div>
  );
}

function Container73() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-end min-w-[200px] relative shrink-0" data-name="Container">
      <Nav />
      <BackgroundShadow3 />
    </div>
  );
}

function Container63() {
  return (
    <div className="h-[64px] max-w-[1280px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center max-w-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between max-w-[inherit] px-[24px] relative size-full">
          <Container64 />
          <Container68 />
          <Container73 />
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="absolute backdrop-blur-[12px] bg-[rgba(255,255,255,0.9)] content-stretch flex flex-col items-start left-0 right-0 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.04)] top-0" data-name="Header">
      <Container63 />
    </div>
  );
}

export default function Pintarly07PilihFaseSaatIniSkripsiTugas() {
  return (
    <div className="content-stretch flex flex-col gap-[56px] items-center pt-[64px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(246, 246, 248) 0%, rgb(246, 246, 248) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Pintarly - 07 Pilih Fase Saat Ini (Skripsi & Tugas)">
      <Container />
      <Main />
      <Footer />
      <Header />
    </div>
  );
}