import React, { useState, useEffect } from "react";
import JSZip from "jszip";

export interface FileContentPreviewProps {
  file: File;
  fileName: string;
  fileSize: string;
  fileType: string;
  previewUrl?: string;
  onDownload?: () => void;
}

type SlideData = {
  slideNum: number;
  title: string;
  paragraphs: string[];
  images: string[];
};

type DocxParagraph = {
  type: "title" | "heading" | "bullet" | "paragraph";
  text: string;
};

type TableData = {
  headers: string[];
  rows: string[][];
};

export default function FileContentPreview({
  file,
  fileName,
  fileSize,
  fileType,
  previewUrl,
  onDownload,
}: FileContentPreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PPTX State
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [slideViewMode, setSlideViewMode] = useState<"single" | "list">("single");

  // DOCX State
  const [docxContent, setDocxContent] = useState<DocxParagraph[]>([]);

  // Spreadsheet State (CSV / XLSX)
  const [tableData, setTableData] = useState<TableData | null>(null);

  // Plain Text / Code State
  const [textContent, setTextContent] = useState<string | null>(null);

  // Detected format
  const lowerName = fileName.toLowerCase();
  const isPptx = lowerName.endsWith(".pptx") || lowerName.endsWith(".ppt");
  const isDocx = lowerName.endsWith(".docx") || lowerName.endsWith(".doc");
  const isXlsx = lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls");
  const isCsv = lowerName.endsWith(".csv");
  const isText =
    lowerName.endsWith(".txt") ||
    lowerName.endsWith(".md") ||
    lowerName.endsWith(".json") ||
    lowerName.endsWith(".js") ||
    lowerName.endsWith(".ts") ||
    lowerName.endsWith(".jsx") ||
    lowerName.endsWith(".tsx") ||
    lowerName.endsWith(".html") ||
    lowerName.endsWith(".css") ||
    lowerName.endsWith(".py") ||
    lowerName.endsWith(".xml");

  useEffect(() => {
    let cancelled = false;
    const objectUrlsToRevoke: string[] = [];

    async function loadContent() {
      setLoading(true);
      setError(null);

      try {
        if (isPptx) {
          // Parse PPTX with JSZip & DOMParser
          const zip = await JSZip.loadAsync(file);
          const slideFiles = Object.keys(zip.files).filter((k) =>
            /^ppt\/slides\/slide\d+\.xml$/i.test(k)
          );

          if (slideFiles.length === 0) {
            throw new Error("Tidak ditemukan slide dalam berkas presentasi.");
          }

          // Sort numerically: slide1.xml, slide2.xml, slide3.xml, etc.
          slideFiles.sort((a, b) => {
            const numA = parseInt(a.match(/slide(\d+)\.xml/i)?.[1] || "0", 10);
            const numB = parseInt(b.match(/slide(\d+)\.xml/i)?.[1] || "0", 10);
            return numA - numB;
          });

          const parser = new DOMParser();
          const parsedSlides: SlideData[] = [];

          for (let i = 0; i < slideFiles.length; i++) {
            const slideKey = slideFiles[i];
            const slideNum = parseInt(slideKey.match(/slide(\d+)\.xml/i)?.[1] || `${i + 1}`, 10);
            const xmlText = await zip.files[slideKey].async("text");
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            // Extract slide relationships for images if any
            const relKey = `ppt/slides/_rels/slide${slideNum}.xml.rels`;
            const imageMap: Record<string, string> = {};
            if (zip.files[relKey]) {
              try {
                const relXml = await zip.files[relKey].async("text");
                const relDoc = parser.parseFromString(relXml, "text/xml");
                const rels = relDoc.querySelectorAll("Relationship");
                rels.forEach((rel) => {
                  const rId = rel.getAttribute("Id");
                  const target = rel.getAttribute("Target") || "";
                  if (rId && target.includes("media/")) {
                    const filename = target.split("/").pop();
                    if (filename) imageMap[rId] = filename;
                  }
                });
              } catch {}
            }

            // Extract images
            const slideImages: string[] = [];
            const blipNodes = xmlDoc.querySelectorAll("blip, *|blip");
            for (const blip of Array.from(blipNodes)) {
              const embedId =
                blip.getAttribute("r:embed") ||
                blip.getAttribute("embed") ||
                blip.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "embed");
              if (embedId && imageMap[embedId]) {
                const imgPath = `ppt/media/${imageMap[embedId]}`;
                if (zip.files[imgPath]) {
                  try {
                    const blob = await zip.files[imgPath].async("blob");
                    const url = URL.createObjectURL(blob);
                    objectUrlsToRevoke.push(url);
                    slideImages.push(url);
                  } catch {}
                }
              }
            }

            // Extract shapes & text
            let title = "";
            const paragraphs: string[] = [];
            const shapes = xmlDoc.querySelectorAll("sp, *|sp");

            shapes.forEach((sp, spIdx) => {
              const ph = sp.querySelector("ph, *|ph");
              const phType = ph?.getAttribute("type") || "";
              const isTitleShape =
                phType === "title" || phType === "ctrTitle" || (spIdx === 0 && !title);

              const pNodes = sp.querySelectorAll("p, *|p");
              const shapeLines: string[] = [];

              pNodes.forEach((p) => {
                const tNodes = p.querySelectorAll("t, *|t");
                let lineText = "";
                tNodes.forEach((t) => {
                  lineText += t.textContent || "";
                });
                lineText = lineText.trim();
                if (lineText) {
                  shapeLines.push(lineText);
                }
              });

              if (shapeLines.length > 0) {
                if (isTitleShape && !title) {
                  title = shapeLines[0];
                  if (shapeLines.length > 1) {
                    paragraphs.push(...shapeLines.slice(1));
                  }
                } else {
                  paragraphs.push(...shapeLines);
                }
              }
            });

            if (!title && paragraphs.length > 0) {
              title = paragraphs[0];
              paragraphs.shift();
            }

            parsedSlides.push({
              slideNum,
              title: title || `Slide ${slideNum}`,
              paragraphs,
              images: slideImages,
            });
          }

          if (!cancelled) {
            setSlides(parsedSlides);
            setCurrentSlideIdx(0);
          }
        } else if (isDocx) {
          // Parse DOCX with JSZip & DOMParser
          const zip = await JSZip.loadAsync(file);
          const docKey = "word/document.xml";
          if (!zip.files[docKey]) {
            throw new Error("Tidak ditemukan dokumen utama dalam berkas Word.");
          }
          const xmlText = await zip.files[docKey].async("text");
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, "text/xml");

          const paragraphs: DocxParagraph[] = [];
          const pNodes = xmlDoc.querySelectorAll("p, *|p");

          pNodes.forEach((p) => {
            const pStyle = p.querySelector("pStyle, *|pStyle")?.getAttribute("w:val") || "";
            const numPr = p.querySelector("numPr, *|numPr");
            const isBullet = !!numPr;
            const isHeading =
              /heading|judul/i.test(pStyle) || pStyle.startsWith("Heading") || pStyle === "Title";

            const tNodes = p.querySelectorAll("t, *|t");
            let lineText = "";
            tNodes.forEach((t) => {
              lineText += t.textContent || "";
            });
            lineText = lineText.trim();

            if (lineText) {
              paragraphs.push({
                type: isHeading ? (pStyle === "Title" ? "title" : "heading") : isBullet ? "bullet" : "paragraph",
                text: lineText,
              });
            }
          });

          if (!cancelled) {
            setDocxContent(paragraphs);
          }
        } else if (isXlsx) {
          // Parse XLSX
          const zip = await JSZip.loadAsync(file);
          const sharedStrKey = "xl/sharedStrings.xml";
          const sharedStrings: string[] = [];

          if (zip.files[sharedStrKey]) {
            const ssXml = await zip.files[sharedStrKey].async("text");
            const parser = new DOMParser();
            const ssDoc = parser.parseFromString(ssXml, "text/xml");
            const siNodes = ssDoc.querySelectorAll("si, *|si");
            siNodes.forEach((si) => {
              sharedStrings.push(si.textContent || "");
            });
          }

          const sheet1Key = "xl/worksheets/sheet1.xml";
          if (!zip.files[sheet1Key]) {
            throw new Error("Lembar kerja Excel tidak dapat dibaca.");
          }

          const sheetXml = await zip.files[sheet1Key].async("text");
          const parser = new DOMParser();
          const sheetDoc = parser.parseFromString(sheetXml, "text/xml");
          const rowNodes = sheetDoc.querySelectorAll("row, *|row");

          const tableRows: string[][] = [];
          rowNodes.forEach((r, idx) => {
            if (idx > 100) return; // Limit to first 100 rows for preview speed
            const cNodes = r.querySelectorAll("c, *|c");
            const rowValues: string[] = [];
            cNodes.forEach((c) => {
              const cellType = c.getAttribute("t");
              const vNode = c.querySelector("v, *|v");
              const val = vNode?.textContent || "";
              if (cellType === "s") {
                const sIdx = parseInt(val, 10);
                rowValues.push(sharedStrings[sIdx] || val);
              } else {
                rowValues.push(val);
              }
            });
            if (rowValues.some((v) => v.trim())) {
              tableRows.push(rowValues);
            }
          });

          if (tableRows.length > 0 && !cancelled) {
            setTableData({
              headers: tableRows[0],
              rows: tableRows.slice(1),
            });
          }
        } else if (isCsv) {
          // Parse CSV
          const text = await file.text();
          const lines = text
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean);
          if (lines.length > 0) {
            const delimiter = lines[0].includes(";") ? ";" : ",";
            const tableRows = lines.map((l) => l.split(delimiter).map((c) => c.replace(/^"|"$/g, "").trim()));
            if (!cancelled) {
              setTableData({
                headers: tableRows[0],
                rows: tableRows.slice(1, 100),
              });
            }
          }
        } else if (isText) {
          // Plain Text / Markdown / Code / JSON
          const text = await file.text();
          if (!cancelled) {
            setTextContent(text);
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Tidak dapat memuat pratinjau berkas secara langsung.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadContent();

    return () => {
      cancelled = true;
      objectUrlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [file, isPptx, isDocx, isXlsx, isCsv, isText]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-center animate-[gemini-fade-in_0.2s_ease-out]">
        <div className="size-12 rounded-full border-3 border-blue-600 border-t-transparent animate-spin mb-4" />
        <h4 className="text-sm font-bold text-neutral-800">Membaca isi berkas...</h4>
        <p className="text-xs text-neutral-400 mt-1">
          Menyiapkan pratinjau {isPptx ? "slide presentasi" : isDocx ? "dokumen" : "berkas"}
        </p>
      </div>
    );
  }

  // 1. PPTX Presentation Slide Viewer
  if (isPptx && slides.length > 0) {
    const curSlide = slides[currentSlideIdx] || slides[0];

    return (
      <div className="w-full max-w-xl flex flex-col items-center select-text">
        {/* Slide Deck Navigation Bar */}
        <div className="w-full flex items-center justify-between mb-2.5 px-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold shadow-xs">
              Slide {currentSlideIdx + 1} dari {slides.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSlideViewMode((m) => (m === "single" ? "list" : "single"))}
              className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                {slideViewMode === "single" ? (
                  <>
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </>
                ) : (
                  <>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                  </>
                )}
              </svg>
              <span>{slideViewMode === "single" ? "Daftar Slide" : "Mode Slide"}</span>
            </button>
          </div>
        </div>

        {/* Mode 1: Single Slide Card (Presentation View) */}
        {slideViewMode === "single" && (
          <div className="w-full flex flex-col items-center">
            <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-100 flex flex-col justify-between min-h-[300px] max-h-[64vh] overflow-hidden relative">
              {/* Slide Number Watermark */}
              <div className="absolute top-4 right-5 text-[11px] font-bold text-neutral-300 pointer-events-none">
                #{curSlide.slideNum}
              </div>

              {/* Slide Content */}
              <div className="flex-1 overflow-y-auto pr-1">
                {/* Title */}
                <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 mb-3.5 leading-snug">
                  {curSlide.title}
                </h3>

                {/* Images in Slide */}
                {curSlide.images && curSlide.images.length > 0 && (
                  <div className="my-3 flex flex-wrap gap-2 justify-center">
                    {curSlide.images.map((imgUrl, iIdx) => (
                      <img
                        key={iIdx}
                        src={imgUrl}
                        alt={`Slide ${curSlide.slideNum} img`}
                        className="max-h-40 max-w-full rounded-xl object-contain shadow-sm border border-neutral-100"
                      />
                    ))}
                  </div>
                )}

                {/* Paragraphs / Bullets */}
                {curSlide.paragraphs.length > 0 ? (
                  <ul className="space-y-2.5">
                    {curSlide.paragraphs.map((p, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5 text-sm text-neutral-700 leading-relaxed">
                        <span className="size-1.5 rounded-full bg-blue-600 shrink-0 mt-2" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  !curSlide.images.length && (
                    <p className="text-xs text-neutral-400 italic">Tidak ada teks tambahan pada slide ini.</p>
                  )
                )}
              </div>
            </div>

            {/* Slide Navigation Controls */}
            <div className="flex items-center justify-between w-full mt-3.5 px-3">
              <button
                type="button"
                disabled={currentSlideIdx === 0}
                onClick={() => setCurrentSlideIdx((i) => Math.max(0, i - 1))}
                className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span>Sebelumnya</span>
              </button>

              {/* Slide Dots / Pill */}
              <div className="flex items-center gap-1 overflow-x-auto max-w-[160px] py-1 px-1">
                {slides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setCurrentSlideIdx(dotIdx)}
                    className={`size-2 rounded-full transition-all cursor-pointer ${
                      dotIdx === currentSlideIdx ? "bg-white w-5" : "bg-white/35 hover:bg-white/60"
                    }`}
                    title={`Ke slide ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                disabled={currentSlideIdx === slides.length - 1}
                onClick={() => setCurrentSlideIdx((i) => Math.min(slides.length - 1, i + 1))}
                className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                <span>Selanjutnya</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Mode 2: All Slides List (Vertical Scroll) */}
        {slideViewMode === "list" && (
          <div className="w-full max-h-[64vh] overflow-y-auto space-y-3 pr-1">
            {slides.map((s, sIdx) => (
              <div
                key={sIdx}
                className="bg-white rounded-2xl p-5 shadow-lg border border-neutral-100 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                    Slide #{s.slideNum}
                  </span>
                </div>
                <h4 className="text-base font-bold text-neutral-900 mb-2">{s.title}</h4>
                {s.images && s.images.length > 0 && (
                  <div className="my-2 flex flex-wrap gap-2">
                    {s.images.map((imgUrl, iIdx) => (
                      <img
                        key={iIdx}
                        src={imgUrl}
                        alt={`Slide ${s.slideNum}`}
                        className="max-h-32 rounded-lg object-contain shadow-xs border border-neutral-100"
                      />
                    ))}
                  </div>
                )}
                {s.paragraphs.length > 0 && (
                  <ul className="space-y-1.5 mt-1">
                    {s.paragraphs.map((p, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-xs text-neutral-700 leading-relaxed">
                        <span className="size-1 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. DOCX Document Reader
  if (isDocx && docxContent.length > 0) {
    return (
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-100 max-h-[66vh] overflow-y-auto select-text">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100">
          <div className="size-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Dokumen Word ({docxContent.length} Paragraf)
          </span>
        </div>

        <div className="space-y-3.5">
          {docxContent.map((p, pIdx) => {
            if (p.type === "title") {
              return (
                <h1 key={pIdx} className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight">
                  {p.text}
                </h1>
              );
            }
            if (p.type === "heading") {
              return (
                <h3 key={pIdx} className="text-base sm:text-lg font-bold text-neutral-900 mt-4 leading-snug">
                  {p.text}
                </h3>
              );
            }
            if (p.type === "bullet") {
              return (
                <div key={pIdx} className="flex items-start gap-2.5 text-sm text-neutral-700 leading-relaxed pl-2">
                  <span className="size-1.5 rounded-full bg-blue-600 shrink-0 mt-2" />
                  <span>{p.text}</span>
                </div>
              );
            }
            return (
              <p key={pIdx} className="text-sm text-neutral-700 leading-relaxed">
                {p.text}
              </p>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. Spreadsheet Viewer (XLSX / CSV)
  if ((isXlsx || isCsv) && tableData) {
    return (
      <div className="w-full max-w-2xl bg-white rounded-3xl p-5 shadow-2xl border border-neutral-100 max-h-[66vh] overflow-hidden flex flex-col select-text">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Spreadsheet
            </span>
            <span className="text-xs text-neutral-400">
              {tableData.rows.length + 1} Baris · {tableData.headers.length} Kolom
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-auto rounded-xl border border-neutral-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-neutral-50 sticky top-0 border-b border-neutral-200">
              <tr>
                {tableData.headers.map((h, hIdx) => (
                  <th key={hIdx} className="px-3 py-2 font-bold text-neutral-800 border-r border-neutral-200 last:border-r-0 whitespace-nowrap">
                    {h || `Kolom ${hIdx + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-150">
              {tableData.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-blue-50/40 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-1.5 text-neutral-700 border-r border-neutral-200 last:border-r-0 whitespace-nowrap">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 4. Plain Text / Markdown / Code Viewer
  if (isText && textContent !== null) {
    return (
      <div className="w-full max-w-xl bg-neutral-900 rounded-3xl p-5 shadow-2xl border border-neutral-800 max-h-[66vh] overflow-hidden flex flex-col select-text">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-800">
          <span className="text-xs font-mono text-neutral-400">
            {fileName} ({textContent.split("\n").length} baris)
          </span>
          <button
            type="button"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(textContent);
              }
            }}
            className="px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono transition-colors cursor-pointer"
          >
            Salin Teks
          </button>
        </div>
        <pre className="flex-1 overflow-auto text-xs text-neutral-200 font-mono leading-relaxed pr-1 whitespace-pre-wrap">
          {textContent}
        </pre>
      </div>
    );
  }

  // 5. Fallback Card (for unsupported binaries or when parsing fails)
  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center">
      <div className="size-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <h4 className="text-base font-bold text-neutral-900 mb-1 max-w-full truncate px-4">
        {fileName}
      </h4>
      <p className="text-xs text-neutral-500 mb-3">
        {fileSize} · Berkas {fileType}
      </p>
      {error && (
        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl mb-4 max-w-xs">
          {error}
        </p>
      )}
      {previewUrl && (
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          download={fileName}
          className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Buka / Unduh Berkas</span>
        </a>
      )}
    </div>
  );
}
