import React, { useState, useEffect, useRef, useCallback } from "react";

interface PdfViewerProps {
  url: string;
  fileName?: string;
  onOpenNative?: () => void;
}

export default function PdfViewer({ url, fileName, onOpenNative }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = Fit Width

  const pdfDocRef = useRef<any>(null);
  const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const renderTasksRef = useRef<Map<number, any>>(new Map());

  // Muat dokumen PDF dengan PDF.js via dynamic import (code-splitting)
  useEffect(() => {
    let isCancelled = false;

    async function loadPdf() {
      try {
        setLoading(true);
        setError(null);

        const pdfjsLib = await import("pdfjs-dist");
        const gwo = pdfjsLib.GlobalWorkerOptions || (pdfjsLib as any).default?.GlobalWorkerOptions;
        if (gwo) {
          gwo.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }

        const getDocument = pdfjsLib.getDocument || (pdfjsLib as any).default?.getDocument;
        const loadingTask = getDocument({
          url,
          cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
        setCurrentPage(1);
        setLoading(false);
      } catch (err: any) {
        if (!isCancelled) {
          console.error("Gagal memuat PDF:", err);
          setError(err?.message || "Gagal memuat pratinjau berkas PDF.");
          setLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
      // Batalkan render tasks yang masih aktif
      renderTasksRef.current.forEach((task) => {
        try {
          task.cancel();
        } catch {}
      });
      renderTasksRef.current.clear();
      canvasRefs.current.clear();
      pdfDocRef.current = null;
    };
  }, [url]);

  // Render halaman tertentu ke elemen canvas yang sesuai
  const renderPage = useCallback(
    async (pageNum: number) => {
      const doc = pdfDocRef.current;
      const canvas = canvasRefs.current.get(pageNum);
      const container = containerRef.current;
      if (!doc || !canvas || !container) return;

      try {
        // Batalkan tugas render halaman ini jika sedang berjalan
        const existingTask = renderTasksRef.current.get(pageNum);
        if (existingTask) {
          try {
            existingTask.cancel();
          } catch {}
        }

        const page = await doc.getPage(pageNum);
        const unscaledViewport = page.getViewport({ scale: 1 });

        // Hitung lebar pas container dengan margin/padding aman (maks 760px di desktop)
        const maxAllowedWidth = Math.min(container.clientWidth - 24, 760);
        const availableWidth = Math.max(maxAllowedWidth, 280);
        // Base fit-to-width scale
        const fitScale = (availableWidth / unscaledViewport.width) * zoomLevel;
        const viewport = page.getViewport({ scale: fitScale });

        const dpr = Math.min(window.devicePixelRatio || 1, 2.5); // Retina scaling
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(dpr, dpr);

        const renderContext = {
          canvasContext: ctx,
          viewport,
        };

        const renderTask = page.render(renderContext);
        renderTasksRef.current.set(pageNum, renderTask);

        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.warn(`Render halaman ${pageNum} dilewati:`, err);
        }
      }
    },
    [zoomLevel]
  );

  // Render ulang saat halaman selesai dimuat atau zoom/resize berubah
  useEffect(() => {
    if (loading || !numPages) return;

    for (let p = 1; p <= numPages; p++) {
      renderPage(p);
    }

    const handleResize = () => {
      for (let p = 1; p <= numPages; p++) {
        renderPage(p);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [loading, numPages, renderPage]);

  // Pantau scroll untuk mengupdate nomor halaman aktif
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || numPages <= 1) return;

    const containerTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    for (let p = 1; p <= numPages; p++) {
      const canvas = canvasRefs.current.get(p);
      if (canvas) {
        const top = canvas.offsetTop;
        const height = canvas.offsetHeight;
        if (top + height / 2 >= containerTop && top <= containerTop + containerHeight / 2) {
          setCurrentPage(p);
          break;
        }
      }
    }
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.75));
  const handleZoomFit = () => setZoomLevel(1);

  if (loading) {
    return (
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-6 bg-slate-50/60 text-center select-none">
        <div className="size-10 rounded-full border-3 border-blue-600 border-t-transparent animate-spin mb-3.5" />
        <p className="text-sm font-semibold text-slate-800">Menyesuaikan ukuran berkas...</p>
        <p className="text-xs text-slate-400 mt-1">Membuat tampilan fit proporsional</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-6 bg-slate-50/60 text-center select-none">
        <div className="size-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-sm font-bold text-slate-800">Pratinjau langsung tidak tersedia</p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
          Berkas dapat dibuka langsung menggunakan pembaca bawaan perangkat Anda.
        </p>
        {onOpenNative && (
          <button
            type="button"
            onClick={onOpenNative}
            className="mt-4 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Buka di Bawaan HP / Layar Penuh
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full relative flex flex-col overflow-hidden bg-[#e5e7eb]">
      {/* Scrollable Container dengan auto-fit */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 w-full h-full overflow-y-auto overflow-x-auto p-3 sm:p-5 flex flex-col items-center gap-4 scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {Array.from({ length: numPages }, (_, idx) => idx + 1).map((pageNum) => (
          <div
            key={pageNum}
            className="relative bg-white shadow-md rounded-lg overflow-hidden flex items-center justify-center transition-transform shrink-0"
            style={{ maxWidth: "100%" }}
          >
            <canvas
              ref={(el) => {
                if (el) {
                  canvasRefs.current.set(pageNum, el);
                } else {
                  canvasRefs.current.delete(pageNum);
                }
              }}
              className="block bg-white"
            />
          </div>
        ))}
      </div>

      {/* Floating Control Toolbar (Page indicator & Zoom Controls) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <div className="bg-slate-900/85 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-3">
          <span className="font-medium text-slate-200">
            Hal {currentPage} / {numPages}
          </span>
          <div className="h-3 w-px bg-white/20" />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleZoomOut}
              aria-label="Perkecil"
              title="Perkecil (-)"
              disabled={zoomLevel <= 0.75}
              className="size-5 flex items-center justify-center rounded text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-40 cursor-pointer text-sm font-bold"
            >
              −
            </button>
            <button
              type="button"
              onClick={handleZoomFit}
              title="Fit Layar (100%)"
              className="px-1.5 py-0.5 rounded text-[11px] font-semibold text-blue-300 hover:text-blue-200 hover:bg-white/10 cursor-pointer"
            >
              Fit
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              aria-label="Perbesar"
              title="Perbesar (+)"
              disabled={zoomLevel >= 2.5}
              className="size-5 flex items-center justify-center rounded text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-40 cursor-pointer text-sm font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Quick Button (Buka di Bawaan HP / Layar Penuh) */}
      {onOpenNative && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <button
            type="button"
            onClick={onOpenNative}
            className="px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-[13px] font-semibold shadow-lg backdrop-blur-md flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>Buka di Bawaan HP / Layar Penuh</span>
          </button>
        </div>
      )}
    </div>
  );
}
