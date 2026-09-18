import svgPaths from "./svg-zqthsj7i6k";
import imgAilyMascotPintarly from "./393f30616fec04ebe3210dcb60161f7c844d06e5.png";

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
    <div className="absolute right-[-80px] size-[320px] top-[389.33px]" data-name="SVG">
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
    <div className="absolute inset-0 opacity-40 overflow-clip" data-name="Container">
      <Svg />
      <Svg1 />
      <Svg2 />
    </div>
  );
}

function FloatingCurvilinearDoodlesLeftSideSvg() {
  return (
    <div className="absolute h-[288px] left-[24px] top-[48px] w-[256px]" data-name="Floating Curvilinear Doodles (Left side) → SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="288" preserveAspectRatio="none" viewBox="0 0 256 288" width="256">
        <g id="Floating Curvilinear Doodles (Left side) â SVG" opacity="0.8">
          <path d={svgPaths.p10275000} id="Vector" stroke="#22C55E" strokeDasharray="10.24 10.24" strokeLinecap="round" strokeOpacity="0.25" strokeWidth="5.12" />
          <path d={svgPaths.p2babbf58} fill="#FFE16F" id="Vector_2" />
          <path d={svgPaths.p2e708040} fill="#6CB6D0" id="Vector_3" opacity="0.7" />
          <path d={svgPaths.p3e89080} fill="#22C55E" id="Vector_4" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}

function Svg3() {
  return (
    <div className="h-[320px] relative shrink-0 w-[240px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="320" preserveAspectRatio="none" viewBox="0 0 240 320" width="240">
        <g id="SVG">
          <path d={svgPaths.pc5523b0} id="Vector" stroke="#6CB6D0" strokeLinecap="round" strokeOpacity="0.3" strokeWidth="4.8" />
          <path d={svgPaths.p140a1f00} fill="#FFE16F" id="Vector_2" />
          <path d={svgPaths.p23f60580} fill="#22C55E" id="Vector_3" opacity="0.6" />
          <path d={svgPaths.pd109e00} id="Vector_4" stroke="#22C55E" strokeDasharray="3.6 3.6" strokeWidth="2.4" />
        </g>
      </svg>
    </div>
  );
}

function FloatingCurvilinearDoodlesRightSide() {
  return (
    <div className="absolute bottom-[64px] content-stretch flex flex-col items-start opacity-80 right-[24px]" data-name="Floating Curvilinear Doodles (Right side)">
      <Svg3 />
    </div>
  );
}

function AilyMascotPintarly() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Aily Mascot Pintarly">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAilyMascotPintarly} />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 size-[12.833px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="12.8333" preserveAspectRatio="none" viewBox="0 0 12.8333 12.8333" width="12.8333">
        <g id="Container">
          <path d={svgPaths.p6da9c80} fill="#776300" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function CheerfulFloatingBadge() {
  return (
    <div className="absolute bg-[#ffe16f] bottom-[-4px] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-center p-[4px] right-[-4px] rounded-[9999px]" data-name="Cheerful Floating Badge">
      <Container1 />
    </div>
  );
}

function Background() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center p-[6px] relative rounded-[9999px] shrink-0 size-[80px]" data-name="Background">
      <div className="absolute bg-[rgba(255,255,255,0)] left-0 rounded-[9999px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] size-[80px] top-0" data-name="Overlay+Shadow" />
      <AilyMascotPintarly />
      <CheerfulFloatingBadge />
    </div>
  );
}

function MascotAvatarWithFloatingAuraRings() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Mascot Avatar with Floating Aura Rings">
      <div className="absolute bg-gradient-to-r blur-[6px] from-[#e8f8ee] inset-[-8px] opacity-70 rounded-[9999px] to-[rgba(135,209,235,0.4)] via-1/2 via-[rgba(255,225,111,0.4)]" data-name="Gradient+Blur" />
      <Background />
    </div>
  );
}

function MascotAvatarWithFloatingAuraRingsMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0 z-[2]" data-name="Mascot Avatar with Floating Aura Rings:margin">
      <MascotAvatarWithFloatingAuraRings />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[28px] text-center tracking-[-0.7px] whitespace-nowrap">
        <p className="leading-[38px]">Daftar Akun Pintarly</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-center max-w-[384px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[22px] mb-0">Mulai perjalanan belajar pintarmu dengan materi kurikulum</p>
        <p className="leading-[22px]">terpersonalisasi AI.</p>
      </div>
    </div>
  );
}

function FormHeadingSubtext() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start px-[8px] relative shrink-0 z-[1]" data-name="Form Heading & Subtext">
      <Heading />
      <Container2 />
    </div>
  );
}

function TopMascotInteractionSection() {
  return (
    <div className="content-stretch flex flex-col isolate items-center relative shrink-0 w-full" data-name="Top Mascot Interaction Section">
      <MascotAvatarWithFloatingAuraRingsMargin />
      <FormHeadingSubtext />
    </div>
  );
}

function TopMascotInteractionSectionMargin() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pb-[16px] right-0 top-0" data-name="Top Mascot Interaction Section:margin">
      <TopMascotInteractionSection />
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g clipPath="url(#clip0_0_18)" id="SVG">
          <path d={svgPaths.p28f279c0} fill="#EA4335" id="Vector" />
          <path d={svgPaths.p1e2f1800} fill="#4285F4" id="Vector_2" />
          <path d={svgPaths.p12247980} fill="#FBBC05" id="Vector_3" />
          <path d={svgPaths.p1bf9da00} fill="#34A853" id="Vector_4" />
        </g>
        <defs>
          <clipPath id="clip0_0_18">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Daftar Cepat dengan Google</p>
      </div>
    </div>
  );
}

function GoogleFastSignInButton() {
  return (
    <div className="bg-[#f6f3f4] h-[48px] relative rounded-[12px] shrink-0 w-full" data-name="Google Fast Sign-in Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[12px] items-center justify-center px-[16px] relative size-full">
          <Svg4 />
          <Container3 />
        </div>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-[162.14px] px-[8px] top-[-7.5px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#71717a] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">ATAU FORMULIR MANUAL</p>
      </div>
    </div>
  );
}

function ElegantFormSeparator() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Elegant Form Separator">
      <div className="bg-[#eaecef] flex-[1_0_0] h-px min-w-px relative" data-name="Horizontal Divider" />
      <Background1 />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Nama Lengkap atau Panggilan</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#006e2f] text-[11px] tracking-[0.44px] whitespace-nowrap">
        <p className="leading-[16px]">Wajib</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Label />
      <Container5 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(113,113,122,0.6)] w-full">
        <p className="leading-[normal]">Misal: Naufal Akbar atau Naufal</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#f6f6f8] flex-[1_0_0] h-[44px] min-w-px relative rounded-[12px]" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pl-[44px] pr-[16px] py-[13px] relative size-full">
          <Container7 />
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Container">
      <Input />
      <div className="absolute left-[17.34px] size-[13.333px] top-[15.34px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
          <path d={svgPaths.pfeb5cc0} fill="#71717A" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function FieldFullName() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Field: Full Name">
      <Container4 />
      <Container6 />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Alamat Email</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#71717a] text-[11px] tracking-[0.44px] whitespace-nowrap">
        <p className="leading-[16px]">Verifikasi aktif</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Label1 />
      <Container9 />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(113,113,122,0.6)] w-full">
        <p className="leading-[normal]">nama@gmail.com atau email kampus/sekolah</p>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-[#f6f6f8] flex-[1_0_0] h-[44px] min-w-px relative rounded-[12px]" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pl-[44px] pr-[40px] py-[13px] relative size-full">
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Container">
      <Input1 />
      <div className="absolute h-[13.333px] left-[15.66px] top-[15.34px] w-[16.667px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 16.6667 13.3333" width="16.6667">
          <path d={svgPaths.p68cd680} fill="#71717A" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function FieldEmailAddress() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Field: Email Address">
      <Container8 />
      <Container10 />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Kata Sandi Baru</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#71717a] text-[11px] tracking-[0.44px] whitespace-nowrap">
        <p className="leading-[16px]">Min. 8 karakter</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Label2 />
      <Container13 />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(113,113,122,0.6)] w-full">
        <p className="leading-[normal]">Buat kata sandi yang aman</p>
      </div>
    </div>
  );
}

function Input2() {
  return (
    <div className="bg-[#f6f6f8] flex-[1_0_0] h-[44px] min-w-px relative rounded-[12px]" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[44px] py-[13px] relative size-full">
          <Container15 />
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[12.5px] relative shrink-0 w-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="12.5" preserveAspectRatio="none" viewBox="0 0 18.3333 12.5" width="18.3333">
        <g id="Container">
          <path d={svgPaths.p2e870a60} fill="#71717A" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center pb-[9px] pt-[4px] px-[4px] right-[12px] rounded-[6px] top-[5.5px]" data-name="Button">
      <Container16 />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Container">
      <Input2 />
      <div className="absolute h-[17.5px] left-[17.34px] top-[12.84px] w-[13.333px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" height="17.5" preserveAspectRatio="none" viewBox="0 0 13.3333 17.5" width="13.3333">
          <path d={svgPaths.p2eed4060} fill="#71717A" id="Icon" />
        </svg>
      </div>
      <Button />
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#eaecef] content-stretch flex gap-[4px] h-[6px] items-start overflow-clip relative rounded-[9999px] shrink-0 w-full" data-name="Background">
      <div className="bg-[#eaecef] flex-[1_0_0] h-full min-w-px relative rounded-[9999px]" data-name="Background" />
      <div className="bg-[#eaecef] flex-[1_0_0] h-full min-w-px relative rounded-[9999px]" data-name="Background" />
      <div className="bg-[#eaecef] flex-[1_0_0] h-full min-w-px relative rounded-[9999px]" data-name="Background" />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[12px] w-full">
        <p className="leading-[18px]">Kombinasi huruf, angka, dan minimal 8 karakter untuk keamanan maksimal.</p>
      </div>
    </div>
  );
}

function PasswordStrengthBarIndicator() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pt-[4px] relative shrink-0 w-full" data-name="Password Strength Bar Indicator">
      <Background2 />
      <Container17 />
    </div>
  );
}

function FieldPasswordInteractiveStrengthBar() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Field: Password & Interactive Strength Bar">
      <Container12 />
      <Container14 />
      <PasswordStrengthBarIndicator />
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Saya bukan robot</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[12px] whitespace-nowrap">
        <p className="leading-[18px]">Verifikasi pintar anti-bot</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container19 />
      <Container20 />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Label">
      <div className="bg-white relative rounded-[2.5px] shrink-0 size-[20px]" data-name="Input">
        <div aria-hidden className="absolute border border-[#767676] border-solid inset-0 pointer-events-none rounded-[2.5px]" />
      </div>
      <Container18 />
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[18.333px] relative shrink-0 w-[14.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="18.3333" preserveAspectRatio="none" viewBox="0 0 14.6667 18.3333" width="14.6667">
        <g id="Container">
          <path d={svgPaths.pa55cc00} fill="#03677F" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[10px] tracking-[-0.5px] uppercase whitespace-nowrap">
        <p className="leading-[22px]">TURNSTILE AI</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-end opacity-80 relative shrink-0" data-name="Container">
      <Container22 />
      <Container23 />
    </div>
  );
}

function InteractiveCaptchaAntiBotVerificationWidget() {
  return (
    <div className="bg-[#f6f6f8] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] relative rounded-[12px] shrink-0 w-full" data-name="Interactive CAPTCHA / Anti-bot Verification Widget">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[8px] relative size-full">
          <Label3 />
          <Container21 />
        </div>
      </div>
    </div>
  );
}

function InputMargin() {
  return (
    <div className="content-stretch flex flex-col h-[18px] items-start pt-[2px] relative shrink-0 w-[16px]" data-name="Input:margin">
      <div className="bg-white relative rounded-[2.5px] shrink-0 size-[16px]" data-name="Input">
        <div aria-hidden className="absolute border border-[#767676] border-solid inset-0 pointer-events-none rounded-[2.5px]" />
      </div>
    </div>
  );
}

function Label4() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[20.67px] relative shrink-0" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#3d4a3d] text-[12px] whitespace-nowrap">
        <p className="mb-0">
          <span className="leading-[19.5px]">{`Saya telah membaca dan menyetujui `}</span>
          <span className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[19.5px] text-[#006e2f]">{`Syarat & Ketentuan`}</span>
          <span className="leading-[19.5px]">{` serta `}</span>
          <span className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[19.5px] text-[#006e2f]">Kebijakan Privasi</span>
        </p>
        <p className="leading-[19.5px]">Pintarly Indonesia.</p>
      </div>
    </div>
  );
}

function TermsConditionCheckbox() {
  return (
    <div className="content-stretch flex gap-[8px] items-start pb-[8px] pt-[4px] relative shrink-0 w-full" data-name="Terms & Condition Checkbox">
      <InputMargin />
      <Label4 />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px]">Buat Akun Sekarang</p>
      </div>
    </div>
  );
}

function Container25() {
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

function PrimaryCtaButtonWithSunnyYellowAestheticButton() {
  return (
    <div className="bg-[#006e2f] relative rounded-[9999px] shrink-0 w-full" data-name="Primary CTA Button with Sunny Yellow Aesthetic → Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[14px] relative size-full">
          <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[9999px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" data-name="Button:shadow" />
          <Container24 />
          <Container25 />
        </div>
      </div>
    </div>
  );
}

function RegistrationInputsForm() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Registration Inputs Form">
      <FieldFullName />
      <FieldEmailAddress />
      <FieldPasswordInteractiveStrengthBar />
      <InteractiveCaptchaAntiBotVerificationWidget />
      <TermsConditionCheckbox />
      <PrimaryCtaButtonWithSunnyYellowAestheticButton />
    </div>
  );
}

function AlreadyHaveAccountLink() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-end justify-center leading-[0] pb-px relative shrink-0 text-center w-full whitespace-nowrap" data-name="Already Have Account Link">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#71717a] text-[14px]">
        <p className="leading-[22px]">{`Sudah punya akun Pintarly? `}</p>
      </div>
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center relative shrink-0 text-[#006e2f] text-[16px]">
        <p className="leading-[24px]">Masuk ke sini</p>
      </div>
    </div>
  );
}

function SurfaceCardFormWrapper() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[24px] items-start left-0 overflow-clip p-[36px] right-0 rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] top-[186px]" data-name="Surface Card Form Wrapper">
      <div className="absolute bg-gradient-to-r from-[#87d1eb] h-[6px] left-0 right-0 to-[#22c55e] top-0 via-1/2 via-[#006e2f]" data-name="Subtle Top Colored Accent Bar" />
      <GoogleFastSignInButton />
      <ElegantFormSeparator />
      <RegistrationInputsForm />
      <AlreadyHaveAccountLink />
    </div>
  );
}

function MainCardContainer() {
  return (
    <div className="h-[910px] max-w-[560px] relative shrink-0 w-[560px]" data-name="Main Card Container">
      <TopMascotInteractionSectionMargin />
      <SurfaceCardFormWrapper />
    </div>
  );
}

function MainInteractiveBackgroundCanvasDoodles() {
  return (
    <div className="relative shrink-0 w-full" data-name="Main → Interactive Background Canvas Doodles">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[24px] py-[36px] relative size-full">
          <FloatingCurvilinearDoodlesLeftSideSvg />
          <FloatingCurvilinearDoodlesRightSide />
          <MainCardContainer />
        </div>
      </div>
    </div>
  );
}

function Container27() {
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

function Container29() {
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

function Container28() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Container">
      <Link />
      <Container29 />
      <Link1 />
    </div>
  );
}

function Container26() {
  return (
    <div className="max-w-[1280px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center max-w-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between max-w-[inherit] px-[24px] relative size-full">
          <Container27 />
          <Container28 />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-[rgba(246,243,244,0.8)] content-stretch flex flex-col items-start py-[24px] relative shrink-0 w-full" data-name="Footer">
      <Container26 />
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
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAilyMascotPintarly} />
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[16px] tracking-[-0.4px] whitespace-nowrap">
        <p className="leading-[16px]">Pintarly</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#71717a] text-[11px] tracking-[0.44px] w-full">
        <p className="leading-[11px]">Teman Belajar AI</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[2px] relative shrink-0 w-full" data-name="Margin">
      <Container34 />
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container33 />
      <Margin />
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Link">
      <PintarlyCuteCheerfulTurtleMascotWithGlassesVibrantModernVectorIconSoftMintGreenAndCyanGradientRoundedFriendlyShapesDesignContextPrimaryColor22C55EFontPlusJakartaSansModeLightRoundnessRoundedMdTheLogoShouldBeVisuallyConsistentWithTheseBrandTokens />
      <Container32 />
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex items-center min-w-[200px] pr-[66.39px] relative shrink-0" data-name="Container">
      <Link2 />
    </div>
  );
}

function Container38() {
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

function Container37() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <Container38 />
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1b1b1c] text-[14px] tracking-[0.44px] whitespace-nowrap">
        <p className="leading-[20px]">Profil Pembelajar</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#71717a] text-[11px] tracking-[0.44px] whitespace-nowrap">
        <p className="leading-[16px]">Langkah 1 dari 4</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container37 />
      <Container39 />
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#eaecef] h-[8px] overflow-clip relative rounded-[9999px] shrink-0 w-full" data-name="Background">
      <div className="absolute bg-gradient-to-r bottom-0 from-[#87d1eb] left-0 right-3/4 rounded-[9999px] to-[#006e2f] top-0 via-1/2 via-[#22c55e]" data-name="Gradient" />
    </div>
  );
}

function Container35() {
  return (
    <div className="flex-[1_0_0] max-w-[448px] min-w-px relative" data-name="Container">
      <div className="flex flex-col items-center justify-center max-w-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[6px] items-center justify-center max-w-[inherit] px-[16px] relative size-full">
          <Container36 />
          <Background3 />
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

function Container41() {
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

function BackgroundShadow() {
  return (
    <div className="bg-[#006e2f] content-stretch drop-shadow-[0px_2px_4px_rgba(0,110,47,0.2)] flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background+Shadow">
      <Container41 />
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-end min-w-[200px] relative shrink-0" data-name="Container">
      <Nav />
      <BackgroundShadow />
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[64px] max-w-[1280px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center max-w-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between max-w-[inherit] px-[24px] relative size-full">
          <Container31 />
          <Container35 />
          <Container40 />
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="absolute backdrop-blur-[12px] bg-[rgba(255,255,255,0.9)] content-stretch flex flex-col items-start left-0 right-0 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.04)] top-0" data-name="Header">
      <Container30 />
    </div>
  );
}

export default function PintarlyFormulirPendaftaranAkunVerifikasi() {
  return (
    <div className="content-stretch flex flex-col gap-[56px] items-start pt-[64px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(246, 246, 248) 0%, rgb(246, 246, 248) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Pintarly - Formulir Pendaftaran Akun & Verifikasi">
      <Container />
      <MainInteractiveBackgroundCanvasDoodles />
      <Footer />
      <Header />
    </div>
  );
}