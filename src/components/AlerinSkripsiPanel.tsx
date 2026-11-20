import React, { useEffect, useState } from "react";

interface AlerinSkripsiPanelProps {
  onBack: () => void;
}

export default function AlerinSkripsiPanel({ onBack }: AlerinSkripsiPanelProps) {
  const [loading, setLoading] = useState(true);
  const [iframeSrc] = useState(() => `/alerin-skripsi/index.html?v=${Date.now()}`);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "backToAlerin" || event.data?.type === "backToAlerin") {
        onBack();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onBack]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 w-full h-full overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-xs">
          <div className="size-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-3.5 text-xs font-semibold text-slate-700 tracking-tight">
            Memuat Alerin Skripsi...
          </p>
        </div>
      )}
      <iframe
        src={iframeSrc}
        title="Alerin Skripsi"
        onLoad={() => setLoading(false)}
        className="w-full h-full border-none flex-1"
        allow="clipboard-write; clipboard-read"
      />
    </div>
  );
}
