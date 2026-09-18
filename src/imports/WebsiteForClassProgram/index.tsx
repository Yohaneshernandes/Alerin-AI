import svgPaths from "./svg-70e4qynvsq";
import imgImageAlerin from "./eeec25fee4848e457348b9a4e108c0ec19fb79ad.png";

function ImageAlerin() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Image (Alerin)">
      <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImageAlerin} />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#0f172b] text-[14px] whitespace-nowrap">Alerin</p>
    </div>
  );
}

function Text() {
  return <div className="bg-[#00d492] relative rounded-[16777200px] shrink-0 size-[6px]" data-name="Text" />;
}

function Text1() {
  return (
    <div className="content-stretch flex flex-col h-[15px] items-start overflow-clip relative shrink-0 w-[89.453px]" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[15px] not-italic relative shrink-0 text-[#90a1b9] text-[10px] whitespace-nowrap">Asisten kampusmu</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[4px] h-[17px] items-center pt-[2px] relative shrink-0 w-full" data-name="Container">
      <Text />
      <Text1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[99.453px]" data-name="Container">
      <Paragraph />
      <Container4 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center px-[4px] relative shrink-0" data-name="Container">
      <ImageAlerin />
      <Container3 />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g id="Icon">
          <path d={svgPaths.pc71600} id="Vector" stroke="#90A1B9" strokeLinecap="round" strokeWidth="1.16667" />
          <path d="M5.25 1.75V12.25" id="Vector_2" stroke="#90A1B9" strokeLinecap="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[28px]" data-name="Button">
      <Icon />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Button />
    </div>
  );
}

function Container() {
  return (
    <div className="border-[#f1f5f9] border-b border-solid content-stretch flex flex-col items-start pb-[8px] pt-[12px] px-[8px] relative shrink-0 w-full" data-name="Container">
      <Container1 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M6 2.5V9.5" id="Vector" stroke="white" strokeWidth="1.25" />
          <path d="M2.5 6H9.5" id="Vector_2" stroke="white" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex flex-[165_0_0] gap-[6px] h-[32px] items-center justify-center min-w-px relative rounded-[12px]" style={{ backgroundImage: "linear-gradient(169.02434482718746deg, rgb(59, 130, 246) 0%, rgb(99, 102, 241) 100%)" }} data-name="Button">
      <Icon1 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[16px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">Baru</p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="13" preserveAspectRatio="none" viewBox="0 0 13 13" width="13">
        <g id="Icon">
          <path d={svgPaths.p257f19f0} id="Vector" stroke="#62748E" strokeWidth="1.35417" />
          <path d={svgPaths.p2b7e8600} id="Vector_2" stroke="#62748E" strokeWidth="1.35417" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[32px]" data-name="Button">
      <Icon2 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[6px] h-[44px] items-center pb-[4px] pt-[8px] px-[8px] relative shrink-0 w-[219px]" data-name="Container">
      <Button1 />
      <Button2 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="Icon">
          <path d={svgPaths.p1bb15080} id="Vector" stroke="#64748B" strokeLinecap="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <Icon3 />
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex gap-[10px] h-[36px] items-center px-[12px] py-[8px] relative rounded-[12px] shrink-0 w-[203px]" data-name="Button">
      <Text2 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#475569] text-[14px] whitespace-nowrap">Percakapan</p>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="Icon">
          <path d={svgPaths.pa70ae00} id="Vector" stroke="#64748B" strokeLinecap="round" strokeWidth="1.33333" />
          <path d="M14 2H9.33333V6.66667H14V2Z" id="Vector_2" stroke="#64748B" strokeLinecap="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3088a200} id="Vector_3" stroke="#64748B" strokeLinecap="round" strokeWidth="1.33333" />
          <path d={svgPaths.p33ab9000} id="Vector_4" stroke="#64748B" strokeLinecap="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <Icon4 />
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex gap-[10px] h-[36px] items-center px-[12px] py-[8px] relative rounded-[12px] shrink-0 w-[203px]" data-name="Button">
      <Text3 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#475569] text-[14px] whitespace-nowrap">Semua Fitur</p>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[2px] relative shrink-0" data-name="Button:margin">
      <Button4 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="Icon">
          <path d={svgPaths.p18af80f2} id="Vector" stroke="#64748B" strokeLinecap="round" strokeWidth="1.33333" />
          <path d={svgPaths.p32b7d180} id="Vector_2" stroke="#64748B" strokeLinecap="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <Icon5 />
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex gap-[10px] h-[36px] items-center px-[12px] py-[8px] relative rounded-[12px] shrink-0 w-[203px]" data-name="Button">
      <Text4 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#475569] text-[14px] whitespace-nowrap">Proyek Saya</p>
    </div>
  );
}

function ButtonMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[2px] relative shrink-0" data-name="Button:margin">
      <Button5 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g clipPath="url(#clip0_0_118)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="#64748B" strokeLinecap="round" strokeWidth="1.33333" />
          <path d="M8 4V8L10.6667 9.33333" id="Vector_2" stroke="#64748B" strokeLinecap="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_0_118">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <Icon6 />
    </div>
  );
}

function Button6() {
  return (
    <div className="content-stretch flex gap-[10px] h-[36px] items-center px-[12px] py-[8px] relative rounded-[12px] shrink-0 w-[203px]" data-name="Button">
      <Text5 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#475569] text-[14px] whitespace-nowrap">Progress</p>
    </div>
  );
}

function ButtonMargin2() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[2px] relative shrink-0" data-name="Button:margin">
      <Button6 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g clipPath="url(#clip0_0_26)" id="Icon">
          <path d={svgPaths.p30052a00} id="Vector" stroke="#64748B" strokeLinecap="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1b84be20} id="Vector_2" stroke="#64748B" strokeLinecap="round" strokeWidth="1.33333" />
          <path d="M2.66667 14.6667H13.3333" id="Vector_3" stroke="#64748B" strokeLinecap="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3205b80} id="Vector_4" stroke="#64748B" strokeLinecap="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3222c80} id="Vector_5" stroke="#64748B" strokeLinecap="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2274e770} id="Vector_6" stroke="#64748B" strokeLinecap="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_0_26">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <Icon7 />
    </div>
  );
}

function Button7() {
  return (
    <div className="content-stretch flex gap-[10px] h-[36px] items-center px-[12px] py-[8px] relative rounded-[12px] shrink-0 w-[203px]" data-name="Button">
      <Text6 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#475569] text-[14px] whitespace-nowrap">QUIZLAB</p>
    </div>
  );
}

function ButtonMargin3() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[2px] relative shrink-0" data-name="Button:margin">
      <Button7 />
    </div>
  );
}

function Navigation() {
  return (
    <div className="content-stretch flex flex-col h-[200px] items-start pb-[8px] pt-[4px] px-[8px] relative shrink-0 w-full" data-name="Navigation">
      <Button3 />
      <ButtonMargin />
      <ButtonMargin1 />
      <ButtonMargin2 />
      <ButtonMargin3 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[11px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 11 11" width="11">
        <g clipPath="url(#clip0_0_76)" id="Icon">
          <path d={svgPaths.p1f658e00} id="Vector" stroke="#94A3B8" strokeWidth="0.916667" />
          <path d={svgPaths.p105d7900} id="Vector_2" stroke="#94A3B8" strokeWidth="0.916667" />
        </g>
        <defs>
          <clipPath id="clip0_0_76">
            <rect fill="white" height="11" width="11" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[15px] not-italic relative shrink-0 text-[#90a1b9] text-[10px] tracking-[0.5px] uppercase whitespace-nowrap">Terakhir Dibuka</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon8 />
      <Text7 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[16px] items-start left-[8px] overflow-clip top-[6px] w-[171px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#314158] text-[12px] whitespace-nowrap">Ringkasan teori TAM</p>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute h-[43px] left-0 rounded-[8px] top-0 w-[187px]" data-name="Button">
      <Paragraph1 />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[8px] not-italic text-[#90a1b9] text-[10px] top-[22px] whitespace-nowrap">12 menit lalu</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[16px] items-start left-[8px] overflow-clip top-[6px] w-[171px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#314158] text-[12px] whitespace-nowrap">Kuantitatif vs Kualitatif</p>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute h-[43px] left-0 rounded-[8px] top-[47px] w-[187px]" data-name="Button">
      <Paragraph2 />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[8px] not-italic text-[#90a1b9] text-[10px] top-[22px] whitespace-nowrap">2 jam lalu</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[16px] items-start left-[8px] overflow-clip top-[6px] w-[171px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#314158] text-[12px] whitespace-nowrap">Ide judul live shopping</p>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute h-[43px] left-0 rounded-[8px] top-[94px] w-[187px]" data-name="Button">
      <Paragraph3 />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[8px] not-italic text-[#90a1b9] text-[10px] top-[22px] whitespace-nowrap">Kemarin</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[16px] items-start left-[8px] overflow-clip top-[6px] w-[171px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#314158] text-[12px] whitespace-nowrap">Revisi rumusan masalah</p>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute h-[43px] left-0 rounded-[8px] top-[141px] w-[187px]" data-name="Button">
      <Paragraph4 />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[8px] not-italic text-[#90a1b9] text-[10px] top-[22px] whitespace-nowrap">27 Agu</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[184px] relative shrink-0 w-full" data-name="Container">
      <Button8 />
      <Button9 />
      <Button10 />
      <Button11 />
    </div>
  );
}

function ContainerMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0 w-full" data-name="Container:margin">
      <Container8 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-[312.25_0_0] flex-col items-start min-h-px overflow-clip pb-[8px] px-[16px] relative w-[219px]" data-name="Container">
      <Container7 />
      <ContainerMargin />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[11px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 11 11" width="11">
        <g id="Icon">
          <path d={svgPaths.p3aae2680} id="Vector" stroke="#059669" strokeWidth="0.916667" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[15px] not-italic relative shrink-0 text-[#007a55] text-[10px] whitespace-nowrap">Pendamping, bukan joki</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon9 />
      <Text8 />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16.25px] not-italic relative shrink-0 text-[#096] text-[10px] w-[177px]">Alerin membantu kamu memahami dan memperbaiki pekerjaanmu sendiri.</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[#ecfdf5] border border-[#a4f4cf] border-solid content-stretch flex flex-col items-start p-[12px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <Container11 />
      <Paragraph5 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[11px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 11 11" width="11">
        <g clipPath="url(#clip0_0_116)" id="Icon">
          <path d={svgPaths.p1f5dd480} id="Vector" stroke="white" strokeWidth="1.14583" />
        </g>
        <defs>
          <clipPath id="clip0_0_116">
            <rect fill="white" height="11" width="11" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="bg-[#111827] content-stretch flex gap-[6px] h-[32px] items-center justify-center py-[8px] relative rounded-[12px] shrink-0 w-[203px]" data-name="Button">
      <Icon10 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[16px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">Upgrade Alerin</p>
    </div>
  );
}

function ButtonMargin4() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0" data-name="Button:margin">
      <Button12 />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] px-[8px] relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <ButtonMargin4 />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="bg-white border-[#f1f5f9] border-r border-solid content-stretch flex flex-col h-[763px] items-start overflow-clip relative shrink-0 w-[220px]" data-name="Sidebar">
      <Container />
      <Container5 />
      <Navigation />
      <Container6 />
      <Container9 />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[32px] relative shrink-0 text-[#0f172b] text-[24px] whitespace-nowrap">Profil Saya</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="content-stretch flex flex-col h-[18px] items-start pt-[2px] relative shrink-0 w-[440.477px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#90a1b9] text-[12px] whitespace-nowrap">Kelola informasi akun dan preferensi agar Alerin bisa membantumu lebih baik.</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[440.477px]" data-name="Container">
      <Heading />
      <Paragraph6 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="13" preserveAspectRatio="none" viewBox="0 0 13 13" width="13">
        <g clipPath="url(#clip0_0_60)" id="Icon">
          <path d={svgPaths.pe0c5f00} id="Vector" stroke="white" strokeWidth="1.35417" />
          <path d={svgPaths.p3f2350c0} id="Vector_2" stroke="white" strokeWidth="1.35417" />
        </g>
        <defs>
          <clipPath id="clip0_0_60">
            <rect fill="white" height="13" width="13" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="bg-[#0f172a] content-stretch flex gap-[8px] items-center px-[16px] py-[8px] relative rounded-[12px] shrink-0" data-name="Button">
      <Icon11 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">Edit Profil</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container15 />
      <Button13 />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[64px]" style={{ backgroundImage: "linear-gradient(135deg, rgb(245, 158, 11) 0%, rgb(217, 119, 6) 100%)" }} data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">RA</p>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 3">
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[28px] relative shrink-0 text-[#0f172b] text-[18px] whitespace-nowrap">Raka Aditya</p>
    </div>
  );
}

function Text9() {
  return (
    <div className="bg-[#eff6ff] border border-[#bfdbfe] border-solid content-stretch flex items-center px-[8px] py-[2px] relative rounded-[16777200px] shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Bold','Noto_Sans:Bold','Noto_Sans_Math:Regular','Noto_Sans_Symbols:Bold','Noto_Sans_Symbols2:Regular',sans-serif] font-bold leading-[15px] not-italic relative shrink-0 text-[#2563eb] text-[10px] whitespace-nowrap">✦ Premium</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Text9 />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="content-stretch flex flex-col h-[22px] items-start pt-[2px] relative shrink-0 w-[606px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#62748e] text-[14px] whitespace-nowrap">S1 (Sarjana) · Universitas Indonesia · Semester 6</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pt-[4px] relative shrink-0 w-[606px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Italic',sans-serif] font-normal italic leading-[16px] relative shrink-0 text-[#90a1b9] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: '"slnt" -14' }}>{`"Proses hari ini, hasil nanti."`}</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-[606.898_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Container19 />
      <Paragraph7 />
      <Paragraph8 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d={svgPaths.p2471b880} id="Vector" stroke="#45556C" />
          <path d={svgPaths.p32142a60} id="Vector_2" stroke="#45556C" />
          <path d="M10.5 7.5L8 5L2.5 10.5" id="Vector_3" stroke="#45556C" />
        </g>
      </svg>
    </div>
  );
}

function Button14() {
  return (
    <div className="border border-[#e2e8f0] border-solid content-stretch flex gap-[6px] items-center px-[12px] py-[6px] relative rounded-[12px] shrink-0" data-name="Button">
      <Icon12 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#45556c] text-[12px] text-center whitespace-nowrap">Ubah Foto</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-white border border-[#f1f5f9] border-solid content-stretch drop-shadow-[0px_1px_3px_rgba(0,0,0,0.04)] flex gap-[16px] items-center p-[20px] relative rounded-[16px] shrink-0 w-[848px]" data-name="Container">
      <Container17 />
      <Container18 />
      <Button14 />
    </div>
  );
}

function ContainerMargin2() {
  return (
    <div className="content-stretch flex flex-col items-center pt-[20px] relative shrink-0 w-full" data-name="Container:margin">
      <Container16 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g id="Icon">
          <path d={svgPaths.p1c47d580} id="Vector" stroke="#3B82F6" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function IconMargin() {
  return (
    <div className="content-stretch flex items-start pt-[2px] relative shrink-0" data-name="Icon:margin">
      <Icon13 />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] not-italic relative shrink-0 text-[#1447e6] text-[12px] whitespace-nowrap">Terus semangat, langkah kecil hari ini bisa jadi hasil besar nanti!</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="bg-[#eff6ff] border border-[#dbeafe] border-solid content-stretch flex gap-[10px] items-start px-[16px] py-[12px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <IconMargin />
      <Paragraph9 />
    </div>
  );
}

function ContainerMargin3() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-full" data-name="Container:margin">
      <Container20 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="white" strokeWidth="1.66667" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="white" strokeWidth="1.66667" />
          <path d="M12.6667 5.33333V9.33333" id="Vector_3" stroke="white" strokeWidth="1.66667" />
          <path d="M14.6667 7.33333H10.6667" id="Vector_4" stroke="white" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container22() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[36px]" data-name="Container">
      <Icon14 />
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">Daftar Sekarang</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] not-italic relative shrink-0 text-[#dbeafe] text-[11px] whitespace-nowrap">Buat akun gratis, personalisasi pengalamanmu</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[241.383px]" data-name="Container">
      <Paragraph10 />
      <Paragraph11 />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <Container22 />
      <Container23 />
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="Icon">
          <path d={svgPaths.p28681180} id="Vector" stroke="white" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button15() {
  return (
    <div className="content-stretch drop-shadow-[0px_4px_10px_rgba(37,99,235,0.25)] flex items-center justify-between px-[20px] py-[16px] relative rounded-[16px] shrink-0 w-[848px]" style={{ backgroundImage: "linear-gradient(175.3482093717023deg, rgb(37, 99, 235) 0%, rgb(79, 70, 229) 100%)" }} data-name="Button">
      <Container21 />
      <Icon15 />
    </div>
  );
}

function ButtonMargin5() {
  return (
    <div className="content-stretch flex flex-col items-center pt-[16px] relative shrink-0 w-full" data-name="Button:margin">
      <Button15 />
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="15" preserveAspectRatio="none" viewBox="0 0 15 15" width="15">
        <g clipPath="url(#clip0_0_46)" id="Icon">
          <path d={svgPaths.p1d5ac680} id="Vector" stroke="#3B82F6" strokeWidth="1.25" />
          <path d={svgPaths.p26530380} id="Vector_2" stroke="#3B82F6" strokeWidth="1.25" />
        </g>
        <defs>
          <clipPath id="clip0_0_46">
            <rect fill="white" height="15" width="15" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#1d293d] text-[14px] whitespace-nowrap">Informasi Akademik</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Icon16 />
      <Paragraph12 />
    </div>
  );
}

function Button16() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#155dfc] text-[12px] text-center whitespace-nowrap">Edit</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container27 />
      <Button16 />
    </div>
  );
}

function Text10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[112px]" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#90a1b9] text-[12px] whitespace-nowrap">Universitas</p>
    </div>
  );
}

function Text11() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#314158] text-[12px] text-right whitespace-nowrap">Universitas Indonesia</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text10 />
      <Text11 />
    </div>
  );
}

function Text12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[112px]" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#90a1b9] text-[12px] whitespace-nowrap">Jenjang</p>
    </div>
  );
}

function Text13() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#314158] text-[12px] text-right whitespace-nowrap">S1 (Sarjana)</p>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex h-[26px] items-start justify-between pt-[10px] relative shrink-0 w-[374px]" data-name="Container">
      <Text12 />
      <Text13 />
    </div>
  );
}

function Text14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[112px]" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#90a1b9] text-[12px] whitespace-nowrap">Program Studi</p>
    </div>
  );
}

function Text15() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#314158] text-[12px] text-right whitespace-nowrap">Manajemen</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex h-[26px] items-start justify-between pt-[10px] relative shrink-0 w-[374px]" data-name="Container">
      <Text14 />
      <Text15 />
    </div>
  );
}

function Text16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[112px]" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#90a1b9] text-[12px] whitespace-nowrap">Semester</p>
    </div>
  );
}

function Text17() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#314158] text-[12px] text-right whitespace-nowrap">Semester 6</p>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex h-[26px] items-start justify-between pt-[10px] relative shrink-0 w-[374px]" data-name="Container">
      <Text16 />
      <Text17 />
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col h-[110px] items-start pt-[16px] relative shrink-0 w-[374px]" data-name="Container">
      <Container29 />
      <Container30 />
      <Container31 />
      <Container32 />
    </div>
  );
}

function Container25() {
  return (
    <div className="bg-white border border-[#f1f5f9] border-solid col-1 content-stretch drop-shadow-[0px_1px_3px_rgba(0,0,0,0.04)] flex flex-col items-start justify-self-stretch p-[20px] relative rounded-[16px] row-1 self-stretch shrink-0" data-name="Container">
      <Container26 />
      <Container28 />
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="15" preserveAspectRatio="none" viewBox="0 0 15 15" width="15">
        <g clipPath="url(#clip0_0_81)" id="Icon">
          <path d={svgPaths.p32f0e200} id="Vector" stroke="#3B82F6" strokeWidth="1.25" />
        </g>
        <defs>
          <clipPath id="clip0_0_81">
            <rect fill="white" height="15" width="15" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#1d293d] text-[14px] whitespace-nowrap">Cara Alerin membantumu</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Icon17 />
      <Paragraph13 />
    </div>
  );
}

function Button17() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#155dfc] text-[12px] text-center whitespace-nowrap">Ubah</p>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container35 />
      <Button17 />
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g id="Icon">
          <path d={svgPaths.p1e5e0480} id="Vector" stroke="#3B82F6" strokeWidth="1.16667" />
          <path d={svgPaths.p46d7a00} id="Vector_2" stroke="#3B82F6" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container38() {
  return (
    <div className="bg-white content-stretch drop-shadow-[0px_1px_2px_rgba(0,0,0,0.06)] flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <Icon18 />
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#1d293d] text-[14px] whitespace-nowrap">Contoh + latihan singkat</p>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[2px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] not-italic relative shrink-0 text-[#62748e] text-[12px] w-[300px]">Alerin akan memberikan penjelasan disertai contoh dan latihan sederhana.</p>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[300px]" data-name="Container">
      <Paragraph14 />
      <Paragraph15 />
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Container">
      <Container38 />
      <Container39 />
    </div>
  );
}

function Container36() {
  return (
    <div className="bg-[#f0f7ff] border border-[#dbeafe] border-solid content-stretch flex flex-col items-start p-[14px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <Container37 />
    </div>
  );
}

function ContainerMargin5() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-full" data-name="Container:margin">
      <Container36 />
    </div>
  );
}

function Container33() {
  return (
    <div className="bg-white border border-[#f1f5f9] border-solid col-2 content-stretch drop-shadow-[0px_1px_3px_rgba(0,0,0,0.04)] flex flex-col items-start justify-self-stretch p-[20px] relative rounded-[16px] row-1 self-stretch shrink-0" data-name="Container">
      <Container34 />
      <ContainerMargin5 />
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="15" preserveAspectRatio="none" viewBox="0 0 15 15" width="15">
        <g id="Icon">
          <path d={svgPaths.p3178f700} id="Vector" stroke="#3B82F6" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#1d293d] text-[14px] whitespace-nowrap">Konteks Akademik Aktif</p>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Icon19 />
      <Paragraph16 />
    </div>
  );
}

function Button18() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#155dfc] text-[12px] text-center whitespace-nowrap">Lihat semua</p>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container42 />
      <Button18 />
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g clipPath="url(#clip0_0_33)" id="Icon">
          <path d={svgPaths.p3d796000} id="Vector" stroke="#3B82F6" strokeWidth="1.16667" />
          <path d={svgPaths.p39090f00} id="Vector_2" stroke="#3B82F6" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_0_33">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container45() {
  return (
    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <Icon20 />
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#1d293d] text-[14px] whitespace-nowrap">Skripsi</p>
    </div>
  );
}

function Text18() {
  return (
    <div className="bg-[#dcfce7] content-stretch flex flex-col items-start px-[6px] py-[2px] relative rounded-[16777200px] shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[13.5px] not-italic relative shrink-0 text-[#16a34a] text-[9px] whitespace-nowrap">● Aktif</p>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Paragraph17 />
      <Text18 />
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#62748e] text-[12px] whitespace-nowrap">Bab 2 · Literature Review</p>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-[302_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Container47 />
      <Paragraph18 />
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-[344px]" data-name="Container">
      <Container45 />
      <Container46 />
    </div>
  );
}

function Container50() {
  return <div className="bg-gradient-to-r from-[#3b82f6] h-[6px] relative rounded-[16777200px] shrink-0 to-[#6366f1] w-[132.57px]" data-name="Container" />;
}

function Container49() {
  return (
    <div className="bg-[#e2e8f0] content-stretch flex flex-[308.32_0_0] flex-col h-[6px] items-start min-w-px overflow-clip relative rounded-[16777200px]" data-name="Container">
      <Container50 />
    </div>
  );
}

function Text19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[16px] not-italic relative shrink-0 text-[#45556c] text-[12px] whitespace-nowrap">43%</p>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex gap-[8px] h-[28px] items-center pt-[12px] relative shrink-0 w-full" data-name="Container">
      <Container49 />
      <Text19 />
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[11px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 11 11" width="11">
        <g clipPath="url(#clip0_0_91)" id="Icon">
          <path d={svgPaths.p2388ff00} id="Vector" stroke="#94A3B8" strokeWidth="0.916667" />
          <path d="M7.33333 0.916667V2.75" id="Vector_2" stroke="#94A3B8" strokeWidth="0.916667" />
          <path d="M3.66667 0.916667V2.75" id="Vector_3" stroke="#94A3B8" strokeWidth="0.916667" />
          <path d="M1.375 4.58333H9.625" id="Vector_4" stroke="#94A3B8" strokeWidth="0.916667" />
        </g>
        <defs>
          <clipPath id="clip0_0_91">
            <rect fill="white" height="11" width="11" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] not-italic relative shrink-0 text-[#90a1b9] text-[11px] whitespace-nowrap">Target sidang: November 2026</p>
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex gap-[6px] h-[27px] items-center pt-[10px] relative shrink-0 w-[344px]" data-name="Container">
      <Icon21 />
      <Paragraph19 />
    </div>
  );
}

function Container43() {
  return (
    <div className="bg-[#f8fafc] border border-[#f1f5f9] border-solid content-stretch flex flex-col items-start p-[14px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <Container44 />
      <Container48 />
      <Container51 />
    </div>
  );
}

function ContainerMargin6() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-full" data-name="Container:margin">
      <Container43 />
    </div>
  );
}

function Container40() {
  return (
    <div className="bg-white border border-[#f1f5f9] border-solid col-1 content-stretch drop-shadow-[0px_1px_3px_rgba(0,0,0,0.04)] flex flex-col items-start justify-self-stretch p-[20px] relative rounded-[16px] row-2 self-stretch shrink-0" data-name="Container">
      <Container41 />
      <ContainerMargin6 />
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="15" preserveAspectRatio="none" viewBox="0 0 15 15" width="15">
        <g clipPath="url(#clip0_0_23)" id="Icon">
          <path d={svgPaths.p66e3e00} id="Vector" stroke="#3B82F6" strokeWidth="1.25" />
          <path d={svgPaths.p29091e00} id="Vector_2" stroke="#3B82F6" strokeWidth="1.25" />
        </g>
        <defs>
          <clipPath id="clip0_0_23">
            <rect fill="white" height="15" width="15" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#1d293d] text-[14px] whitespace-nowrap">{`Akun & Keamanan`}</p>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon22 />
      <Paragraph20 />
    </div>
  );
}

function Text20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#62748e] text-[12px] whitespace-nowrap">Email</p>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#314158] text-[12px] whitespace-nowrap">rakaaditya@gmail.com</p>
    </div>
  );
}

function Container55() {
  return (
    <div className="border-[#f1f5f9] border-b border-solid content-stretch flex items-center justify-between py-[10px] relative shrink-0 w-full" data-name="Container">
      <Text20 />
      <Container56 />
    </div>
  );
}

function Text21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#62748e] text-[12px] whitespace-nowrap">Nomor WhatsApp</p>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#314158] text-[12px] whitespace-nowrap">08xxxxxxxx</p>
    </div>
  );
}

function Container57() {
  return (
    <div className="border-[#f1f5f9] border-b border-solid content-stretch flex items-center justify-between py-[10px] relative shrink-0 w-full" data-name="Container">
      <Text21 />
      <Container58 />
    </div>
  );
}

function Text22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#62748e] text-[12px] whitespace-nowrap">Paket</p>
    </div>
  );
}

function Text23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#314158] text-[12px] whitespace-nowrap">Alerin Premium</p>
    </div>
  );
}

function Button19() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#155dfc] text-[12px] text-center whitespace-nowrap">Kelola</p>
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Text23 />
      <Button19 />
    </div>
  );
}

function Container59() {
  return (
    <div className="border-[#f1f5f9] border-b border-solid content-stretch flex items-center justify-between py-[10px] relative shrink-0 w-full" data-name="Container">
      <Text22 />
      <Container60 />
    </div>
  );
}

function Text24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#62748e] text-[12px] whitespace-nowrap">Keamanan Akun</p>
    </div>
  );
}

function Text25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#155dfc] text-[12px] whitespace-nowrap">Ubah kata sandi</p>
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="13" preserveAspectRatio="none" viewBox="0 0 13 13" width="13">
        <g id="Icon">
          <path d={svgPaths.p23079900} id="Vector" stroke="#94A3B8" strokeWidth="1.08333" />
        </g>
      </svg>
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Text25 />
      <Icon23 />
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex items-center justify-between py-[10px] relative shrink-0 w-full" data-name="Container">
      <Text24 />
      <Container62 />
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col h-[163px] items-start pt-[16px] relative shrink-0 w-[374px]" data-name="Container">
      <Container55 />
      <Container57 />
      <Container59 />
      <Container61 />
    </div>
  );
}

function Container52() {
  return (
    <div className="bg-white border border-[#f1f5f9] border-solid col-2 content-stretch drop-shadow-[0px_1px_3px_rgba(0,0,0,0.04)] flex flex-col items-start justify-self-stretch p-[20px] relative rounded-[16px] row-2 self-stretch shrink-0" data-name="Container">
      <Container53 />
      <Container54 />
    </div>
  );
}

function Container24() {
  return (
    <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[__416px_416px] grid-rows-[__172px_225px] relative shrink-0 w-full" data-name="Container">
      <Container25 />
      <Container33 />
      <Container40 />
      <Container52 />
    </div>
  );
}

function ContainerMargin4() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-full" data-name="Container:margin">
      <Container24 />
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g clipPath="url(#clip0_0_39)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="#3B82F6" strokeWidth="1.16667" />
          <path d="M7 4.66667V7" id="Vector_2" stroke="#3B82F6" strokeWidth="1.16667" />
          <path d="M7 9.33333H7.00583" id="Vector_3" stroke="#3B82F6" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_0_39">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#1d293d] text-[14px] whitespace-nowrap">Yang Alerin ketahui tentangmu</p>
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="content-stretch flex flex-col h-[19px] items-start pt-[2px] relative shrink-0 w-[372.5px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] not-italic relative shrink-0 text-[#90a1b9] text-[11px] whitespace-nowrap">Informasi ini digunakan untuk menyesuaikan jawaban dan rekomendasi.</p>
    </div>
  );
}

function Container66() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[372.5px]" data-name="Container">
      <Paragraph21 />
      <Paragraph22 />
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Icon24 />
      <Container66 />
    </div>
  );
}

function Button20() {
  return (
    <div className="content-stretch flex flex-col h-[16px] items-center justify-center pl-[12px] relative shrink-0 w-[77px]" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#155dfc] text-[12px] text-center whitespace-nowrap">Kelola data</p>
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container65 />
      <Button20 />
    </div>
  );
}

function Text26() {
  return (
    <div className="absolute bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col h-[26px] items-start left-0 px-[12px] py-[4px] rounded-[16777200px] top-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#314158] text-[12px] whitespace-nowrap">Manajemen</p>
    </div>
  );
}

function Text27() {
  return (
    <div className="absolute bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col h-[26px] items-start left-[100.79px] px-[12px] py-[4px] rounded-[16777200px] top-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#314158] text-[12px] whitespace-nowrap">Universitas Indonesia</p>
    </div>
  );
}

function Text28() {
  return (
    <div className="absolute bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col h-[26px] items-start left-[258.09px] px-[12px] py-[4px] rounded-[16777200px] top-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#314158] text-[12px] whitespace-nowrap">Semester 6</p>
    </div>
  );
}

function Text29() {
  return (
    <div className="absolute bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col h-[26px] items-start left-[357.48px] px-[12px] py-[4px] rounded-[16777200px] top-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#314158] text-[12px] whitespace-nowrap">Skripsi (Bab 2)</p>
    </div>
  );
}

function Text30() {
  return (
    <div className="absolute bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col h-[26px] items-start left-[475.37px] px-[12px] py-[4px] rounded-[16777200px] top-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#314158] text-[12px] whitespace-nowrap">Target Sidang Nov 2026</p>
    </div>
  );
}

function Text31() {
  return (
    <div className="absolute bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col h-[26px] items-start left-0 px-[12px] py-[4px] rounded-[16777200px] top-[34px]" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#314158] text-[12px] whitespace-nowrap">Preferensi: Contoh + latihan</p>
    </div>
  );
}

function Container67() {
  return (
    <div className="h-[60px] relative shrink-0 w-full" data-name="Container">
      <Text26 />
      <Text27 />
      <Text28 />
      <Text29 />
      <Text30 />
      <Text31 />
    </div>
  );
}

function ContainerMargin8() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-full" data-name="Container:margin">
      <Container67 />
    </div>
  );
}

function Container63() {
  return (
    <div className="bg-white border border-[#f1f5f9] border-solid content-stretch drop-shadow-[0px_1px_3px_rgba(0,0,0,0.04)] flex flex-col items-start p-[20px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <Container64 />
      <ContainerMargin8 />
    </div>
  );
}

function ContainerMargin7() {
  return (
    <div className="content-stretch flex flex-col items-start py-[16px] relative shrink-0 w-full" data-name="Container:margin">
      <Container63 />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[896px] px-[24px] py-[28px] relative shrink-0 w-[896px]" data-name="Container">
      <Container14 />
      <ContainerMargin2 />
      <ContainerMargin3 />
      <ButtonMargin5 />
      <ContainerMargin4 />
      <ContainerMargin7 />
    </div>
  );
}

function ContainerMargin1() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container:margin">
      <Container13 />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-[763_0_0] flex-col items-start min-h-px overflow-clip relative w-full" data-name="Container">
      <ContainerMargin1 />
    </div>
  );
}

function ProfilTab() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex flex-[763_0_0] flex-col items-start min-h-px overflow-clip relative w-full" data-name="ProfilTab">
      <Container12 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="content-stretch flex flex-[964_0_0] flex-col h-[763px] items-start min-w-px overflow-clip relative" data-name="Main Content">
      <ProfilTab />
    </div>
  );
}

function Container69() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[16777200px] shrink-0 size-[32px]" style={{ backgroundImage: "linear-gradient(135deg, rgb(245, 158, 11) 0%, rgb(217, 119, 6) 100%)" }} data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[16px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">RA</p>
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="content-stretch flex flex-col h-[16px] items-start overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#1d293d] text-[12px] whitespace-nowrap">Raka Aditya</p>
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="content-stretch flex flex-col h-[15px] items-start overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[15px] not-italic relative shrink-0 text-[#90a1b9] text-[10px] whitespace-nowrap">Premium · Sem 6</p>
    </div>
  );
}

function Container70() {
  return (
    <div className="content-stretch flex flex-[113_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Paragraph23 />
      <Paragraph24 />
    </div>
  );
}

function Button21() {
  return (
    <div className="content-stretch flex flex-[157_0_0] gap-[12px] items-center min-w-px relative" data-name="Button">
      <Container69 />
      <Container70 />
    </div>
  );
}

function Icon25() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="15" preserveAspectRatio="none" viewBox="0 0 15 15" width="15">
        <g clipPath="url(#clip0_0_72)" id="Icon">
          <path d={svgPaths.p155bec00} id="Vector" stroke="#90A1B9" strokeWidth="1.25" />
        </g>
        <defs>
          <clipPath id="clip0_0_72">
            <rect fill="white" height="15" width="15" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text32() {
  return <div className="absolute bg-[#fb2c36] border border-solid border-white left-[20px] rounded-[16777200px] size-[6px] top-[2px]" data-name="Text" />;
}

function Button22() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[28px]" data-name="Button">
      <Icon25 />
      <Text32 />
    </div>
  );
}

function Container68() {
  return (
    <div className="bg-[rgba(255,255,255,0)] border border-[#f1f5f9] border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[16px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.04)] shrink-0 w-full" data-name="Container">
      <Button21 />
      <Button22 />
    </div>
  );
}

function ContainerMargin9() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Container:margin">
      <Container68 />
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[13.5px] not-italic relative shrink-0 text-[#90a1b9] text-[9px] tracking-[0.9px] uppercase whitespace-nowrap">Progress Minggu Ini</p>
    </div>
  );
}

function Paragraph26() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[28px] relative shrink-0 text-[#0f172b] text-[18px] whitespace-nowrap">0 dari 4 target</p>
    </div>
  );
}

function Icon26() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g clipPath="url(#clip0_0_83)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="#34D399" strokeWidth="1.16667" />
          <path d={svgPaths.p24da2380} id="Vector_2" stroke="#34D399" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_0_83">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container73() {
  return (
    <div className="border-2 border-[#00d492] border-dashed content-stretch flex items-center justify-center relative rounded-[16777200px] shrink-0 size-[32px]" data-name="Container">
      <Icon26 />
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex h-[36px] items-center justify-between pt-[4px] relative shrink-0 w-[189px]" data-name="Container">
      <Paragraph26 />
      <Container73 />
    </div>
  );
}

function Icon27() {
  return (
    <div className="relative shrink-0 size-[10px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="10" preserveAspectRatio="none" viewBox="0 0 10 10" width="10">
        <g id="Icon">
          <path d={svgPaths.p4403200} id="Vector" stroke="#155DFC" strokeWidth="1.04167" />
        </g>
      </svg>
    </div>
  );
}

function Button23() {
  return (
    <div className="content-stretch flex gap-[4px] h-[24.5px] items-center pt-[8px] relative shrink-0 w-[123px]" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.5px] not-italic relative shrink-0 text-[#155dfc] text-[11px] text-center whitespace-nowrap">Buka detail progress</p>
      <Icon27 />
    </div>
  );
}

function Container71() {
  return (
    <div className="bg-[rgba(255,255,255,0)] border border-[#f1f5f9] border-solid content-stretch flex flex-col h-[108.5px] items-start p-[16px] relative rounded-[16px] shadow-[0px_1px_6px_0px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Container">
      <Paragraph25 />
      <Container72 />
      <Button23 />
    </div>
  );
}

function ContainerMargin10() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Container:margin">
      <Container71 />
    </div>
  );
}

function Paragraph27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#1d293d] text-[14px] whitespace-nowrap">Deadline terdekat</p>
    </div>
  );
}

function Icon28() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g id="Icon">
          <path d={svgPaths.p24a2b500} id="Vector" stroke="#94A3B8" strokeWidth="1.16667" />
          <path d="M9.33333 1.16667V3.5" id="Vector_2" stroke="#94A3B8" strokeWidth="1.16667" />
          <path d="M4.66667 1.16667V3.5" id="Vector_3" stroke="#94A3B8" strokeWidth="1.16667" />
          <path d="M1.75 5.83333H12.25" id="Vector_4" stroke="#94A3B8" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container75() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Paragraph27 />
      <Icon28 />
    </div>
  );
}

function Paragraph28() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#1d293d] text-[12px] whitespace-nowrap">Presentasi Riset Pasar</p>
    </div>
  );
}

function Icon29() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="9" preserveAspectRatio="none" viewBox="0 0 9 9" width="9">
        <g clipPath="url(#clip0_0_13)" id="Icon">
          <path d={svgPaths.p352d0d00} id="Vector" stroke="#94A3B8" strokeWidth="0.75" />
          <path d="M4.5 2.25V4.5L6 5.25" id="Vector_2" stroke="#94A3B8" strokeWidth="0.75" />
        </g>
        <defs>
          <clipPath id="clip0_0_13">
            <rect fill="white" height="9" width="9" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph29() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[15px] not-italic relative shrink-0 text-[#90a1b9] text-[10px] whitespace-nowrap">Besok · 09.00</p>
    </div>
  );
}

function Container78() {
  return (
    <div className="content-stretch flex gap-[4px] h-[17px] items-center pt-[2px] relative shrink-0 w-[129.008px]" data-name="Container">
      <Icon29 />
      <Paragraph29 />
    </div>
  );
}

function Container77() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[129.008px]" data-name="Container">
      <Paragraph28 />
      <Container78 />
    </div>
  );
}

function Text33() {
  return <div className="bg-[#ef4444] relative rounded-[16777200px] shrink-0 size-[8px]" data-name="Text" />;
}

function Icon30() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M2.5 6H9.5M6 9.5L9.5 6L6 2.5" id="Vector" stroke="#CBD5E1" />
        </g>
      </svg>
    </div>
  );
}

function Container79() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Text33 />
      <Icon30 />
    </div>
  );
}

function Button24() {
  return (
    <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative rounded-[12px] shrink-0 w-[189px]" data-name="Button">
      <Container77 />
      <Container79 />
    </div>
  );
}

function Paragraph30() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#1d293d] text-[12px] whitespace-nowrap">Revisi Kerangka BAB I</p>
    </div>
  );
}

function Icon31() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="9" preserveAspectRatio="none" viewBox="0 0 9 9" width="9">
        <g clipPath="url(#clip0_0_13)" id="Icon">
          <path d={svgPaths.p352d0d00} id="Vector" stroke="#94A3B8" strokeWidth="0.75" />
          <path d="M4.5 2.25V4.5L6 5.25" id="Vector_2" stroke="#94A3B8" strokeWidth="0.75" />
        </g>
        <defs>
          <clipPath id="clip0_0_13">
            <rect fill="white" height="9" width="9" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[15px] not-italic relative shrink-0 text-[#90a1b9] text-[10px] whitespace-nowrap">31 Agu · 23.59</p>
    </div>
  );
}

function Container81() {
  return (
    <div className="content-stretch flex gap-[4px] h-[17px] items-center pt-[2px] relative shrink-0 w-[126.586px]" data-name="Container">
      <Icon31 />
      <Paragraph31 />
    </div>
  );
}

function Container80() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[126.586px]" data-name="Container">
      <Paragraph30 />
      <Container81 />
    </div>
  );
}

function Text34() {
  return <div className="bg-[#f59e0b] relative rounded-[16777200px] shrink-0 size-[8px]" data-name="Text" />;
}

function Icon32() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M2.5 6H9.5M6 9.5L9.5 6L6 2.5" id="Vector" stroke="#CBD5E1" />
        </g>
      </svg>
    </div>
  );
}

function Container82() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Text34 />
      <Icon32 />
    </div>
  );
}

function Button25() {
  return (
    <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative rounded-[12px] shrink-0 w-[189px]" data-name="Button">
      <Container80 />
      <Container82 />
    </div>
  );
}

function ButtonMargin6() {
  return (
    <div className="content-stretch flex flex-col items-center pt-[8px] relative shrink-0 w-full" data-name="Button:margin">
      <Button25 />
    </div>
  );
}

function Paragraph32() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#1d293d] text-[12px] whitespace-nowrap">QUIZLAB Semester 6</p>
    </div>
  );
}

function Icon33() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="9" preserveAspectRatio="none" viewBox="0 0 9 9" width="9">
        <g clipPath="url(#clip0_0_13)" id="Icon">
          <path d={svgPaths.p352d0d00} id="Vector" stroke="#94A3B8" strokeWidth="0.75" />
          <path d="M4.5 2.25V4.5L6 5.25" id="Vector_2" stroke="#94A3B8" strokeWidth="0.75" />
        </g>
        <defs>
          <clipPath id="clip0_0_13">
            <rect fill="white" height="9" width="9" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[15px] not-italic relative shrink-0 text-[#90a1b9] text-[10px] whitespace-nowrap">3 Sep · 20.00</p>
    </div>
  );
}

function Container84() {
  return (
    <div className="content-stretch flex gap-[4px] h-[17px] items-center pt-[2px] relative shrink-0 w-[121.781px]" data-name="Container">
      <Icon33 />
      <Paragraph33 />
    </div>
  );
}

function Container83() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[121.781px]" data-name="Container">
      <Paragraph32 />
      <Container84 />
    </div>
  );
}

function Text35() {
  return <div className="bg-[#3b82f6] relative rounded-[16777200px] shrink-0 size-[8px]" data-name="Text" />;
}

function Icon34() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M2.5 6H9.5M6 9.5L9.5 6L6 2.5" id="Vector" stroke="#CBD5E1" />
        </g>
      </svg>
    </div>
  );
}

function Container85() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Text35 />
      <Icon34 />
    </div>
  );
}

function Button26() {
  return (
    <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative rounded-[12px] shrink-0 w-[189px]" data-name="Button">
      <Container83 />
      <Container85 />
    </div>
  );
}

function ButtonMargin7() {
  return (
    <div className="content-stretch flex flex-col items-center pt-[8px] relative shrink-0 w-full" data-name="Button:margin">
      <Button26 />
    </div>
  );
}

function Paragraph34() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#1d293d] text-[12px] whitespace-nowrap">Target baru 4</p>
    </div>
  );
}

function Icon35() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="9" preserveAspectRatio="none" viewBox="0 0 9 9" width="9">
        <g clipPath="url(#clip0_0_13)" id="Icon">
          <path d={svgPaths.p352d0d00} id="Vector" stroke="#94A3B8" strokeWidth="0.75" />
          <path d="M4.5 2.25V4.5L6 5.25" id="Vector_2" stroke="#94A3B8" strokeWidth="0.75" />
        </g>
        <defs>
          <clipPath id="clip0_0_13">
            <rect fill="white" height="9" width="9" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph35() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[15px] not-italic relative shrink-0 text-[#90a1b9] text-[10px] whitespace-nowrap">Belum dijadwalkan</p>
    </div>
  );
}

function Container87() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon35 />
      <Paragraph35 />
    </div>
  );
}

function ContainerMargin12() {
  return (
    <div className="content-stretch flex flex-col items-center pt-[2px] relative shrink-0 w-full" data-name="Container:margin">
      <Container87 />
    </div>
  );
}

function Container86() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[101.219px]" data-name="Container">
      <Paragraph34 />
      <ContainerMargin12 />
    </div>
  );
}

function Text36() {
  return <div className="bg-[#8b5cf6] relative rounded-[16777200px] shrink-0 size-[8px]" data-name="Text" />;
}

function Icon36() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M2.5 6H9.5M6 9.5L9.5 6L6 2.5" id="Vector" stroke="#CBD5E1" />
        </g>
      </svg>
    </div>
  );
}

function Container88() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Text36 />
      <Icon36 />
    </div>
  );
}

function Button27() {
  return (
    <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative rounded-[12px] shrink-0 w-[189px]" data-name="Button">
      <Container86 />
      <Container88 />
    </div>
  );
}

function ButtonMargin8() {
  return (
    <div className="content-stretch flex flex-col items-center pt-[8px] relative shrink-0 w-full" data-name="Button:margin">
      <Button27 />
    </div>
  );
}

function Container76() {
  return (
    <div className="content-stretch flex flex-col h-[232px] items-start pt-[12px] relative shrink-0 w-[189px]" data-name="Container">
      <Button24 />
      <ButtonMargin6 />
      <ButtonMargin7 />
      <ButtonMargin8 />
    </div>
  );
}

function Container74() {
  return (
    <div className="bg-[rgba(255,255,255,0)] border border-[#f1f5f9] border-solid content-stretch flex flex-col h-[286px] items-start p-[16px] relative rounded-[16px] shadow-[0px_1px_6px_0px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Container">
      <Container75 />
      <Container76 />
    </div>
  );
}

function ContainerMargin11() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Container:margin">
      <Container74 />
    </div>
  );
}

function Text37() {
  return (
    <div className="absolute border border-[rgba(255,255,255,0.2)] border-solid h-[25px] left-0 rounded-[16777200px] top-[1.5px] w-[97.094px]" data-name="Text">
      <p className="[word-break:break-word] absolute font-['Inter:Bold',sans-serif] font-bold leading-[15px] left-[10px] not-italic text-[#bedbff] text-[10px] top-[4.5px] whitespace-nowrap">Alerin + Mentor</p>
    </div>
  );
}

function Container90() {
  return (
    <div className="h-[38.5px] relative shrink-0 w-full" data-name="Container">
      <Text37 />
    </div>
  );
}

function Paragraph36() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[16px] text-white w-[183px]">Butuh keputusan akademik yang lebih spesifik?</p>
    </div>
  );
}

function Paragraph37() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[17.875px] not-italic relative shrink-0 text-[#bedbff] text-[11px] w-[183px]">Teruskan ringkasan percakapanmu kepada mentor yang sesuai bidang.</p>
    </div>
  );
}

function Icon37() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M2.5 6H9.5M6 9.5L9.5 6L6 2.5" id="Vector" stroke="#1447E6" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Button28() {
  return (
    <div className="bg-white content-stretch flex gap-[6px] h-[36px] items-center justify-center py-[10px] relative rounded-[12px] shrink-0 w-[183px]" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[16px] not-italic relative shrink-0 text-[#1447e6] text-[12px] text-center whitespace-nowrap">Temukan mentor</p>
      <Icon37 />
    </div>
  );
}

function ButtonMargin9() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0" data-name="Button:margin">
      <Button28 />
    </div>
  );
}

function Container89() {
  return (
    <div className="content-stretch flex flex-col items-start p-[20px] relative rounded-[16px] shrink-0 w-full" style={{ backgroundImage: "linear-gradient(141.5913568239207deg, rgb(30, 58, 138) 6.1733%, rgb(29, 78, 216) 93.827%)" }} data-name="Container">
      <Container90 />
      <Paragraph36 />
      <Paragraph37 />
      <ButtonMargin9 />
    </div>
  );
}

function Sidebar1() {
  return (
    <div className="bg-white border-[#f1f5f9] border-l border-solid content-stretch flex flex-col h-[763px] items-start overflow-clip p-[16px] relative shrink-0 w-[256px]" data-name="Sidebar">
      <ContainerMargin9 />
      <ContainerMargin10 />
      <ContainerMargin11 />
      <Container89 />
    </div>
  );
}

function Shell() {
  return (
    <div className="bg-white content-stretch flex h-[763px] items-start overflow-clip relative shrink-0 w-[1440px]" data-name="Shell">
      <Sidebar />
      <MainContent />
      <Sidebar1 />
    </div>
  );
}

function Icon38() {
  return (
    <div className="absolute h-[763px] left-0 top-0 w-[1440px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="763" preserveAspectRatio="none" viewBox="0 0 1440 763" width="1440">
        <g clipPath="url(#clip0_0_99)" id="Icon">
          <path d={svgPaths.p3ce4a470} fill="#DBEAFE" id="Vector" opacity="0.25" />
          <path d={svgPaths.p1f234700} id="Vector_2" opacity="0.35" stroke="#93C5FD" strokeDasharray="16 12" strokeLinecap="round" strokeWidth="5" />
          <path d={svgPaths.p222b4e50} fill="#DBEAFE" id="Vector_3" opacity="0.18" />
          <path d={svgPaths.pdcd1700} fill="#FBBF24" id="Vector_4" opacity="0.35" />
          <path d={svgPaths.p24605800} fill="#60A5FA" id="Vector_5" opacity="0.3" />
          <path d={svgPaths.p13aba300} fill="#A5B4FC" id="Vector_6" opacity="0.28" />
          <path d={svgPaths.p6904200} id="Vector_7" opacity="0.28" stroke="#93C5FD" strokeDasharray="12 10" strokeLinecap="round" strokeWidth="4" />
          <path d={svgPaths.p19d44b00} fill="#FBBF24" id="Vector_8" opacity="0.22" />
          <path d={svgPaths.p124dd680} id="Vector_9" opacity="0.22" stroke="#93C5FD" strokeLinecap="round" strokeWidth="4.5" />
          <path d={svgPaths.p1821b700} fill="#60A5FA" id="Vector_10" opacity="0.2" />
          <path d={svgPaths.p11489d70} fill="#FBBF24" id="Vector_11" opacity="0.2" />
          <path d={svgPaths.p1485d800} fill="#93C5FD" id="Vector_12" opacity="0.3" />
          <path d={svgPaths.p24c23080} fill="#A5B4FC" id="Vector_13" opacity="0.28" />
          <path d={svgPaths.p72a18f0} fill="#60A5FA" id="Vector_14" opacity="0.18" />
          <path d={svgPaths.p1ece8f80} fill="#A5B4FC" id="Vector_15" opacity="0.15" />
          <path d={svgPaths.p21eafb80} fill="#93C5FD" id="Vector_16" opacity="0.18" />
        </g>
        <defs>
          <clipPath id="clip0_0_99">
            <rect fill="white" height="763" width="1440" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Icon39() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
        <g id="Icon">
          <path d="M13.5 4.5L4.5 13.5" id="Vector" stroke="#6B7280" strokeWidth="1.65" />
          <path d="M4.5 4.5L13.5 13.5" id="Vector_2" stroke="#6B7280" strokeWidth="1.65" />
        </g>
      </svg>
    </div>
  );
}

function Button29() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[16777200px] shrink-0 size-[36px]" data-name="Button">
      <Icon39 />
    </div>
  );
}

function Container91() {
  return (
    <div className="absolute content-stretch flex items-start justify-end left-0 pb-[8px] pt-[20px] px-[20px] top-0 w-[1440px]" data-name="Container">
      <Button29 />
    </div>
  );
}

function Heading1Margin() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[78.95px] pb-[12.406px] top-[146px]" data-name="Heading 1:margin">
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold leading-[0] relative shrink-0 text-[#1b1b1c] text-[37.158px] text-center tracking-[-0.9289px] whitespace-nowrap">
        <span className="leading-[50.428px]">{`Halo, aku `}</span>
        <span className="leading-[50.428px] text-[#2563eb]">{`Alerin `}</span>
        <span className="leading-[50.428px]">Siap Bantu Kamu!</span>
      </p>
    </div>
  );
}

function ParagraphMargin() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[81.54px] pb-[6.203px] top-[214.46px]" data-name="Paragraph:margin">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[34.116px] not-italic relative shrink-0 text-[#71717a] text-[21.71px] text-center whitespace-nowrap">{`Asisten AI untuk bantu skripsi & kuliah kamu.`}</p>
    </div>
  );
}

function ParagraphMargin1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[80.95px] pb-[62.029px] top-[262.8px]" data-name="Paragraph:margin">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[31.014px] not-italic relative shrink-0 text-[#9ca3af] text-[20.159px] text-center whitespace-nowrap">Dipercaya 50.000+ mahasiswa Indonesia 🇮🇩</p>
    </div>
  );
}

function Icon40() {
  return (
    <div className="relative shrink-0 size-[13.593px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="13.5929" preserveAspectRatio="none" viewBox="0 0 13.5929 13.5929" width="13.5929">
        <g id="Icon">
          <path d={svgPaths.paca8800} id="Vector" stroke="white" strokeWidth="1.41593" />
        </g>
      </svg>
    </div>
  );
}

function Button30() {
  return (
    <div className="absolute bg-[#2563eb] content-stretch drop-shadow-[0px_3.625px_3.172px_rgba(37,99,235,0.38)] flex gap-[7.25px] items-center justify-center left-[79px] max-w-[347.9786071777344px] py-[14.499px] rounded-[14.499px] top-[322px] w-[347.979px]" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[24.467px] not-italic relative shrink-0 text-[16.311px] text-center text-white whitespace-nowrap">Mulai Sekarang</p>
      <Icon40 />
    </div>
  );
}

function Container95() {
  return <div className="absolute blur-[68.342px] left-[-27.77px] rounded-[28664692px] size-[246.031px] top-[-27.77px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 246.03 246.03' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 -17.397 -17.397 0 123.02 123.02)'><stop stop-color='rgba(37,99,235,0.18)' offset='0'/><stop stop-color='rgba(99,102,241,0.1)' offset='0.6'/><stop stop-color='rgba(99,102,241,0)' offset='1'/></radialGradient></defs></svg>\")" }} data-name="Container" />;
}

function ImageAlerin1() {
  return (
    <div className="relative shrink-0 size-[159.631px]" data-name="Image (Alerin)">
      <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImageAlerin} />
    </div>
  );
}

function Container96() {
  return (
    <div className="absolute border-[3.47px] border-[rgba(255,255,255,0.85)] border-solid content-stretch drop-shadow-[0px_6.94px_5.205px_rgba(0,0,0,0.1),0px_3.47px_3.47px_rgba(0,0,0,0.1)] flex items-center justify-center left-0 p-[13.881px] rounded-[29110440px] size-[194.333px] top-0" style={{ backgroundImage: "linear-gradient(135deg, rgb(219, 234, 254) 0%, rgb(199, 210, 254) 100%)" }} data-name="Container">
      <ImageAlerin1 />
    </div>
  );
}

function Text38() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular','Noto_Sans:Regular','Noto_Sans_Math:Regular','Noto_Sans_Symbols:Regular','Noto_Sans_Symbols2:Regular',sans-serif] font-normal leading-[36.438px] not-italic relative shrink-0 text-[#78350f] text-[24.292px] text-center whitespace-nowrap">✦</p>
    </div>
  );
}

function Container97() {
  return (
    <div className="absolute bg-[#fcd34d] content-stretch drop-shadow-[0px_1.735px_3.47px_rgba(0,0,0,0.15)] flex items-center justify-center left-[145.75px] rounded-[29110440px] size-[55.524px] top-[145.75px]" data-name="Container">
      <Text38 />
    </div>
  );
}

function Container94() {
  return (
    <div className="relative shrink-0 size-[194.333px]" data-name="Container">
      <Container95 />
      <Container96 />
      <Container97 />
    </div>
  );
}

function ContainerMargin14() {
  return (
    <div className="absolute content-stretch flex flex-col h-[209px] items-start left-[-174.75px] pb-[41.643px] top-[157.74px] w-[201.667px]" data-name="Container:margin">
      <Container94 />
    </div>
  );
}

function Container93() {
  return (
    <div className="absolute h-[569.312px] left-[474px] top-[-16px] w-[530.253px]" data-name="Container">
      <Heading1Margin />
      <ParagraphMargin />
      <ParagraphMargin1 />
      <Button30 />
      <ContainerMargin14 />
    </div>
  );
}

function ContainerMargin13() {
  return (
    <div className="absolute h-[481px] left-[20px] right-[20px] top-0" data-name="Container:margin">
      <Container93 />
    </div>
  );
}

function Container92() {
  return (
    <div className="absolute h-[658px] left-[4px] overflow-clip top-[139px] w-[1440px]" data-name="Container">
      <ContainerMargin13 />
    </div>
  );
}

function RegisterModal() {
  return (
    <div className="absolute bg-gradient-to-b from-[#f8faff] h-[763px] left-0 overflow-clip to-[#f8faff] top-0 via-1/2 via-[#f0f5ff] w-[1440px]" data-name="RegisterModal">
      <Icon38 />
      <div className="absolute bg-white h-[347px] left-[237px] rounded-[29px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[201px] w-[989px]" />
      <Container91 />
      <Container92 />
    </div>
  );
}

export default function WebsiteForClassProgram() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="Website for Class Program">
      <Shell />
      <RegisterModal />
    </div>
  );
}