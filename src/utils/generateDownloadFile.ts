import JSZip from "jszip";

export interface DownloadableAttachmentMeta {
  name: string;
  meta: string;
  type: string;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toAsciiPdfText(value: string): string {
  return value
    .replace(/[·•—–]/g, "-")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function getDocumentLines(item: DownloadableAttachmentMeta): string[] {
  const lower = `${item.type} ${item.name}`.toLowerCase();
  const dateStr = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (lower.includes("sidang")) {
    return [
      `Judul Dokumen : ${item.name}`,
      `Informasi     : ${item.meta || "Dokumen Persiapan Sidang"}`,
      `Tanggal Unduh : ${dateStr}`,
      "Disusun Oleh  : Alerin AI Academic Assistant",
      "",
      "Ringkasan Panduan Sidang Skripsi:",
      "1. Pahami rumusan masalah, tujuan penelitian, dan grand theory.",
      "2. Kuasai alur metodologi: populasi, sampel, instrumen, dan teknik analisis.",
      "3. Siapkan jawaban atas keterbatasan penelitian dan implikasi manajerial.",
      "4. Jaga tempo presentasi tetap ringkas dan sistematis (10-12 menit).",
    ];
  }

  return [
    `Judul Dokumen : ${item.name}`,
    `Informasi     : ${item.meta || "Dokumen Akademik"}`,
    `Tanggal Unduh : ${dateStr}`,
    "Disusun Oleh  : Alerin AI Academic Assistant",
    "",
    "Ringkasan Data & Informasi:",
    "1. Dokumen ini dibuat dan diekspor langsung dari Alerin Chat.",
    "2. Struktur konten telah dirapikan untuk kebutuhan laporan dan akademik.",
    "3. Contoh data mencakup rekapitulasi mahasiswa, program studi, dan status.",
    "4. Siap dicetak atau disunting lebih lanjut sesuai kebutuhan tugas.",
  ];
}

function buildPdfBlob(item: DownloadableAttachmentMeta): Blob {
  const encoder = new TextEncoder();
  const lines = getDocumentLines(item);
  const streamCommands = [
    "BT",
    "/F2 16 Tf",
    "54 742 Td",
    `(${toAsciiPdfText(item.name)}) Tj`,
    "/F1 10 Tf",
    "0 -20 Td",
    `(${toAsciiPdfText(item.meta || "Dokumen Alerin AI")}) Tj`,
    "ET",
    "0.85 w",
    "54 708 m 558 708 l S",
    "BT",
    "/F1 11 Tf",
    "54 684 Td",
    ...lines.flatMap((ln, idx) =>
      idx === 0 ? [`(${toAsciiPdfText(ln)}) Tj`] : ["0 -18 Td", `(${toAsciiPdfText(ln)}) Tj`]
    ),
    "ET",
  ].join("\n");

  const streamByteLen = encoder.encode(streamCommands).byteLength;
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 6 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n",
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n",
    `6 0 obj\n<< /Length ${streamByteLen} >>\nstream\n${streamCommands}\nendstream\nendobj\n`,
  ];

  const header = "%PDF-1.4\n";
  let offset = encoder.encode(header).byteLength;
  const xrefEntries = ["0000000000 65535 f "];

  for (const obj of objects) {
    xrefEntries.push(`${String(offset).padStart(10, "0")} 00000 n `);
    offset += encoder.encode(obj).byteLength;
  }

  const xrefOffset = offset;
  const xrefSection = `xref\n0 ${objects.length + 1}\n${xrefEntries.join("\n")}\n`;
  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  const pdfString = header + objects.join("") + xrefSection + trailer;

  return new Blob([encoder.encode(pdfString)], { type: "application/pdf" });
}

const SAMPLE_EXCEL_ROWS: (string | number)[][] = [
  ["No", "NIM", "Nama Mahasiswa", "Program Studi", "Semester", "Status Akademik"],
  [1, "2024001", "Andi Pratama", "Sistem Informasi", "Semester 6", "Aktif"],
  [2, "2024002", "Siti Amelia", "Informatika", "Semester 6", "Aktif"],
  [3, "2024003", "Budi Santoso", "Manajemen Bisnis", "Semester 4", "Aktif"],
  [4, "2024004", "Dewi Lestari", "Akuntansi", "Semester 8", "Lulus Sidang"],
  [5, "2024005", "Rian Hidayat", "Ilmu Komunikasi", "Semester 6", "Aktif"],
  [6, "2024006", "Nadia Putri", "Psikologi", "Semester 6", "Aktif"],
  [7, "2024007", "Fajar Nugroho", "Teknik Industri", "Semester 8", "Bimbingan"],
  [8, "2024008", "Clara Wijaya", "Desain Komunikasi Visual", "Semester 4", "Aktif"],
  [9, "2024009", "Bagas Saputra", "Ekonomi Pembangunan", "Semester 6", "Aktif"],
  [10, "2024010", "Tari Kusuma", "Administrasi Publik", "Semester 8", "Siap Sidang"],
];

function colLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

async function buildXlsxBlob(): Promise<Blob> {
  const zip = new JSZip();

  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`
  );

  zip.folder("_rels")!.file(
    ".rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
  );

  const xl = zip.folder("xl")!;
  xl.file(
    "workbook.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Data Mahasiswa" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`
  );

  xl.folder("_rels")!.file(
    "workbook.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`
  );

  const rowsXml = SAMPLE_EXCEL_ROWS.map((row, rIdx) => {
    const rowNum = rIdx + 1;
    const cellsXml = row
      .map((val, cIdx) => {
        const ref = `${colLetter(cIdx)}${rowNum}`;
        if (typeof val === "number") {
          return `<c r="${ref}"><v>${val}</v></c>`;
        }
        return `<c r="${ref}" t="inlineStr"><is><t>${escapeXml(String(val))}</t></is></c>`;
      })
      .join("");
    return `<row r="${rowNum}">${cellsXml}</row>`;
  }).join("");

  xl.folder("worksheets")!.file(
    "sheet1.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>${rowsXml}</sheetData>
</worksheet>`
  );

  return zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

async function buildDocxBlob(item: DownloadableAttachmentMeta): Promise<Blob> {
  const zip = new JSZip();
  const lines = getDocumentLines(item);

  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
  );

  zip.folder("_rels")!.file(
    ".rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  );

  const bodyParagraphs = [
    `<w:p><w:r><w:rPr><w:b/><w:sz w:val="32"/></w:rPr><w:t>${escapeXml(item.name)}</w:t></w:r></w:p>`,
    ...lines.map(
      (ln) => `<w:p><w:r><w:t xml:space="preserve">${escapeXml(ln)}</w:t></w:r></w:p>`
    ),
  ].join("");

  const word = zip.folder("word")!;
  word.folder("_rels")!.file(
    "document.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`
  );
  word.file(
    "document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${bodyParagraphs}
    <w:sectPr><w:pgSz w:w="11906" w:h="16838"/></w:sectPr>
  </w:body>
</w:document>`
  );

  return zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

const SAMPLE_PPTX_SLIDES: { title: string; points: string[] }[] = [
  { title: "Judul Penelitian & Identitas", points: ["Presentasi Sidang Skripsi", "Disusun dengan bantuan Alerin AI"] },
  { title: "Latar Belakang Masalah", points: ["Fenomena empiris di lapangan", "Kesenjangan penelitian terdahulu (research gap)"] },
  { title: "Rumusan Masalah & Tujuan", points: ["Pertanyaan penelitian utama", "Tujuan teoritis dan praktis"] },
  { title: "Tinjauan Pustaka & Grand Theory", points: ["Landasan teori utama penelitian", "Definisi konseptual tiap variabel"] },
  { title: "Kerangka Konseptual & Hipotesis", points: ["Hubungan antar variabel penelitian", "Ringkasan hipotesis yang diuji"] },
  { title: "Metodologi Penelitian", points: ["Pendekatan dan desain penelitian", "Populasi, sampel, dan teknik sampling"] },
  { title: "Instrumen & Pengumpulan Data", points: ["Skala pengukuran dan sumber data", "Uji validitas dan reliabilitas"] },
  { title: "Hasil Analisis Data", points: ["Statistik deskriptif responden", "Hasil pengujian hipotesis"] },
  { title: "Pembahasan & Temuan Kunci", points: ["Interpretasi hasil dibandingkan teori", "Temuan utama dan implikasi manajerial"] },
  { title: "Kesimpulan & Saran", points: ["Jawaban atas rumusan masalah", "Keterbatasan studi dan saran penelitian lanjutan"] },
];

function buildSlideXml(slideTitle: string, points: string[]): string {
  const bullets = points
    .map(
      (pt) => `<a:p><a:r><a:rPr lang="id-ID" sz="1800"/><a:t>• ${escapeXml(pt)}</a:t></a:r></a:p>`
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
      <p:sp>
        <p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr>
        <p:spPr><a:xfrm><a:off x="685800" y="457200"/><a:ext cx="7772400" cy="914400"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
        <p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="id-ID" sz="2800" b="1"/><a:t>${escapeXml(slideTitle)}</a:t></a:r></a:p></p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr><p:cNvPr id="3" name="Content"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph idx="1"/></p:nvPr></p:nvSpPr>
        <p:spPr><a:xfrm><a:off x="685800" y="1600200"/><a:ext cx="7772400" cy="4572000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
        <p:txBody><a:bodyPr/><a:lstStyle/>${bullets}</p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>`;
}

async function buildPptxBlob(): Promise<Blob> {
  const zip = new JSZip();

  const slideOverrides = SAMPLE_PPTX_SLIDES.map(
    (_, idx) =>
      `<Override PartName="/ppt/slides/slide${idx + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`
  ).join("\n  ");

  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
  ${slideOverrides}
</Types>`
  );

  zip.folder("_rels")!.file(
    ".rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`
  );

  const ppt = zip.folder("ppt")!;
  const sldIdsXml = SAMPLE_PPTX_SLIDES.map(
    (_, idx) => `<p:sldId id="${256 + idx}" r:id="rId${idx + 2}"/>`
  ).join("");
  const slideRelsXml = SAMPLE_PPTX_SLIDES.map(
    (_, idx) =>
      `<Relationship Id="rId${idx + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${idx + 1}.xml"/>`
  ).join("");

  ppt.file(
    "presentation.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>
  <p:sldIdLst>${sldIdsXml}</p:sldIdLst>
  <p:sldSz cx="9144000" cy="6858000" type="screen4x3"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`
  );

  ppt.folder("_rels")!.file(
    "presentation.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
  ${slideRelsXml}
</Relationships>`
  );

  const masters = ppt.folder("slideMasters")!;
  masters.file(
    "slideMaster1.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  <p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>
</p:sldMaster>`
  );
  masters.folder("_rels")!.file(
    "slideMaster1.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>
</Relationships>`
  );

  const layouts = ppt.folder("slideLayouts")!;
  layouts.file(
    "slideLayout1.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="title">
  <p:cSld name="Title Slide"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sldLayout>`
  );
  layouts.folder("_rels")!.file(
    "slideLayout1.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>`
  );

  ppt.folder("theme")!.file(
    "theme1.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Alerin">
  <a:themeElements>
    <a:clrScheme name="Alerin"><a:dk1><a:srgbClr val="0F172A"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="334155"/></a:dk2><a:lt2><a:srgbClr val="F8FAFC"/></a:lt2><a:accent1><a:srgbClr val="2563EB"/></a:accent1><a:accent2><a:srgbClr val="1D4ED8"/></a:accent2><a:accent3><a:srgbClr val="0EA5E9"/></a:accent3><a:accent4><a:srgbClr val="10B981"/></a:accent4><a:accent5><a:srgbClr val="F59E0B"/></a:accent5><a:accent6><a:srgbClr val="64748B"/></a:accent6><a:hlink><a:srgbClr val="2563EB"/></a:hlink><a:folHlink><a:srgbClr val="1E40AF"/></a:folHlink></a:clrScheme>
    <a:fontScheme name="Alerin"><a:majorFont><a:latin typeface="Plus Jakarta Sans"/></a:majorFont><a:minorFont><a:latin typeface="Plus Jakarta Sans"/></a:minorFont></a:fontScheme>
    <a:fmtScheme name="Alerin"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme>
  </a:themeElements>
</a:theme>`
  );

  const slides = ppt.folder("slides")!;
  const slideRels = slides.folder("_rels")!;
  SAMPLE_PPTX_SLIDES.forEach((s, idx) => {
    const num = idx + 1;
    slides.file(`slide${num}.xml`, buildSlideXml(s.title, s.points));
    slideRels.file(
      `slide${num}.xml.rels`,
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>`
    );
  });

  return zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  });
}

export async function downloadAttachmentFile(item: DownloadableAttachmentMeta): Promise<void> {
  const lower = `${item.name} ${item.type}`.toLowerCase();
  let blob: Blob;
  let filename = item.name;

  if (lower.includes(".pdf") || item.type.toLowerCase() === "pdf") {
    blob = buildPdfBlob(item);
  } else if (lower.includes(".xlsx") || item.type.toLowerCase().includes("excel")) {
    blob = await buildXlsxBlob();
  } else if (lower.includes(".csv")) {
    const csv = SAMPLE_EXCEL_ROWS.map((r) => r.join(",")).join("\n");
    blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  } else if (lower.includes(".docx") || lower.includes(".doc") || item.type.toLowerCase().includes("word")) {
    blob = await buildDocxBlob(item);
    if (!filename.toLowerCase().endsWith(".docx")) filename = `${filename}.docx`;
  } else if (lower.includes(".pptx") || lower.includes(".ppt") || item.type.toLowerCase().includes("ppt")) {
    blob = await buildPptxBlob();
    if (!filename.toLowerCase().endsWith(".pptx")) filename = `${filename}.pptx`;
  } else {
    blob = new Blob([getDocumentLines(item).join("\n")], { type: "text/plain;charset=utf-8" });
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}
