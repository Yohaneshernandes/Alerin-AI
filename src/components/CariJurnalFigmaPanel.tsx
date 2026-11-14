import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type PointerEvent as ReactPointerEvent, type ReactNode, type UIEvent } from "react";
import PlusBadgeIcon from "./PlusBadgeIcon";

type JournalView = "home" | "collection" | "riwayat";
type RiwayatItem = { label: string; query: string; type: "journal" | "review" | "map"; waktu: string; pinned?: boolean };

const searchAssets = "/assets/jurnal-design/search";
const collectionAssets = "/assets/jurnal-design/collection";
const mobileAssets = "/assets/jurnal-design/mobile";

const journals = [
  {
    title: "Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges",
    authors: "Rahmawati, D. & Pratama, A.",
    description:
      "Interaksi parasosial antara host dan penonton, ditambah dorongan kelangkaan seperti batas waktu dan stok, meningkatkan niat beli di live streaming commerce. Temuan ini relevan untuk riset perilaku konsumen digital di Asia Tenggara.",
  },
  {
    title: "Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges",
    authors: "Rahmawati, D. & Pratama, A.",
    description:
      "Interaksi parasosial antara host dan penonton, ditambah dorongan kelangkaan seperti batas waktu dan stok, meningkatkan niat beli di live streaming.",
  },
];

type CollectionFolder = { id: string; name: string };

type SavedJournal = {
  id: string;
  title: string;
  authors: string;
  description: string;
  year: string;
  relevancy: string;
  folderId: string;
};

const defaultFolders: CollectionFolder[] = [
  { id: "ungrouped", name: "Belum dikelompokkan" },
  { id: "skripsi", name: "Skripsi" },
  { id: "variabel", name: "Variabel dependen" },
  { id: "teori", name: "Landasan teori" },
  { id: "penelitian", name: "Jenis penelitian" },
  { id: "hipotesis", name: "Hipotesis Penelitian" },
];

const initialSavedJournals: SavedJournal[] = [
  {
    id: "saved-1",
    title: journals[0].title,
    authors: journals[0].authors,
    description: journals[0].description,
    year: "2023",
    relevancy: "97%",
    folderId: "ungrouped",
  },
  {
    id: "saved-2",
    title: "The Impact of Digital Literacy on Academic Achievement: A Meta-Analysis of Higher Education Students",
    authors: "Hidayat, M. & Nugroho, A.",
    description:
      "Meta-analisis 43 studi menunjukkan literasi digital memediasi hubungan antara akses teknologi dan capaian akademik mahasiswa.",
    year: "2022",
    relevancy: "92%",
    folderId: "skripsi",
  },
];

type SavedLiterature = {
  id: string;
  title: string;
  topic: string;
  sources: string;
  period: string;
  yearFrom: string;
  yearTo: string;
  count: number;
  folderId: string;
  date: string;
};

type SavedResearchMap = {
  id: string;
  title: string;
  topic: string;
  sources: string;
  clusters: string;
  folderId: string;
  date: string;
};

const defaultLiteratureFolders: CollectionFolder[] = [
  { id: "ungrouped", name: "Belum dikelompokkan" },
  { id: "skripsi", name: "Skripsi" },
  { id: "jurnal", name: "Review Jurnal" },
];

const initialSavedLiterature: SavedLiterature[] = [
  {
    id: "lit-1",
    title: "Literatur Review: Resiliensi Perempuan pasca Bencana",
    topic: "Resiliensi perempuan dalam menghadapi bencana dan krisis",
    sources: "15 jurnal",
    period: "2020–2026",
    yearFrom: "2020",
    yearTo: "2026",
    count: 15,
    folderId: "skripsi",
    date: "Hari ini",
  },
  {
    id: "lit-2",
    title: "Literatur Review: Literasi Keuangan Mahasiswa",
    topic: "Literasi keuangan mahasiswa",
    sources: "12 jurnal",
    period: "2021–2026",
    yearFrom: "2021",
    yearTo: "2026",
    count: 12,
    folderId: "jurnal",
    date: "Kemarin",
  },
];

const defaultMapFolders: CollectionFolder[] = [
  { id: "ungrouped", name: "Belum dikelompokkan" },
  { id: "skripsi", name: "Skripsi" },
  { id: "tema", name: "Pemetaan Tema" },
];

const initialSavedMaps: SavedResearchMap[] = [
  {
    id: "map-1",
    title: "Peta Penelitian: AI Generatif dalam Pendidikan",
    topic: "AI generatif dalam pendidikan",
    sources: "100 jurnal",
    clusters: "5 klaster",
    folderId: "skripsi",
    date: "Hari ini",
  },
  {
    id: "map-2",
    title: "Peta Penelitian: Pemasaran Digital UMKM",
    topic: "Pemasaran digital pada UMKM",
    sources: "80 jurnal",
    clusters: "4 klaster",
    folderId: "tema",
    date: "3 hari lalu",
  },
];

const desktopResultJournals = [
  { id: "res-1", title: journals[0].title, authors: journals[0].authors, description: journals[0].description, year: "2023", relevancy: "97%" },
  {
    id: "res-2",
    title: "The Impact of Digital Literacy on Academic Achievement: A Meta-Analysis of Higher Education Students",
    authors: "Hidayat, M. & Nugroho, A.",
    description:
      "Meta-analisis 43 studi menunjukkan literasi digital memediasi hubungan antara akses teknologi dan capaian akademik mahasiswa.",
    year: "2022",
    relevancy: "92%",
  },
  {
    id: "res-3",
    title: "Strategi Peningkatan Minat Beli pada Live Commerce: Peran Kepercayaan dan Ulasan Konsumen",
    authors: "Pratama, R. & Lestari, S.",
    description: "Survei 312 responden pengguna live commerce di Indonesia menemukan kepercayaan dan ulasan konsumen memediasi minat beli.",
    year: "2024",
    relevancy: "89%",
  },
];

function isDoiFormat(text: string): boolean {
  if (!text) return false;
  const clean = text.trim().toLowerCase();
  if (!clean) return false;
  return (
    clean.includes("doi.org") ||
    clean.includes("dx.doi.org") ||
    clean.startsWith("doi:") ||
    clean.startsWith("doi/") ||
    clean.startsWith("doi ") ||
    /^10\.\d{4,9}\//.test(clean) ||
    (clean.startsWith("10.") && clean.includes("/")) ||
    /^https?:\/\//i.test(clean)
  );
}

function capitalizeFirstLetter(text: string): string {
  if (!text) return text;
  if (isDoiFormat(text)) {
    return text;
  }
  const firstNonSpace = text.search(/\S/);
  if (firstNonSpace !== -1) {
    return text.slice(0, firstNonSpace) + text.charAt(firstNonSpace).toUpperCase() + text.slice(firstNonSpace + 1);
  }
  return text;
}

function formatRiwayatDisplayWaktu(raw: string): string {
  if (!raw) return "";
  const str = raw.trim();
  if (/^\d{1,2}\s+[A-Za-z]+\s+\d{4}\s+•\s+\d{1,2}[.:]\d{2}$/.test(str)) {
    return str.replace(":", ".");
  }
  const monthsMap: Record<string, string> = {
    jan: "Januari", januari: "Januari",
    feb: "Februari", februari: "Februari",
    mar: "Maret", maret: "Maret",
    apr: "April", april: "April",
    mei: "Mei",
    jun: "Juni", juni: "Juni",
    jul: "Juli", juli: "Juli",
    agu: "Agustus", ags: "Agustus", agustus: "Agustus",
    sep: "September", september: "September",
    okt: "Oktober", oktober: "Oktober",
    nov: "November", november: "November",
    des: "Desember", desember: "Desember",
  };
  const m = str.match(/^(\d{1,2})\s+([A-Za-z]+)(?:[,\s]+(\d{4}))?[,\s]+(\d{1,2})[.:](\d{2})$/);
  if (m) {
    const day = m[1];
    const monthKey = m[2].toLowerCase();
    const month = monthsMap[monthKey] || m[2];
    const year = m[3] || "2026";
    const hour = m[4].padStart(2, "0");
    const min = m[5];
    return `${day} ${month} ${year} • ${hour}.${min}`;
  }
  if (str.startsWith("Hari ini")) {
    const timeMatch = str.match(/(\d{1,2})[.:](\d{2})/);
    const time = timeMatch ? `${timeMatch[1].padStart(2, "0")}.${timeMatch[2]}` : "14.15";
    return `4 November 2026 • ${time}`;
  }
  if (str.startsWith("Kemarin")) {
    const timeMatch = str.match(/(\d{1,2})[.:](\d{2})/);
    const time = timeMatch ? `${timeMatch[1].padStart(2, "0")}.${timeMatch[2]}` : "20.15";
    return `3 November 2026 • ${time}`;
  }
  if (str === "Tersimpan") {
    return "4 November 2026 • 14.15";
  }
  return str;
}

type ResultDetail = {
  id: string;
  headerTitle: string;
  headerNote: string;
  rank: string;
  badges: { label: string; tone: "sky" | "slate" }[];
  citations: string;
  source: string;
  fitBars: [string, number][];
  fitNote: string;
  quote: string;
  credibility: [string, string][];
  summary: string;
  summaryMore?: string;
  doiUrl: string;
  pdfNote: string;
  isReplaced?: boolean;
};

const desktopResultDetails: ResultDetail[] = [
  {
    id: "res-1",
    headerTitle: "Rekomendasi Jurnal",
    headerNote: "",
    rank: "Rekomendasi 1",
    badges: [
      { label: "2023", tone: "slate" },
      { label: "Akses Terbuka", tone: "sky" },
    ],
    citations: "",
    source: "Jurnal Kajian Pemasaran Digital",
    fitBars: [
      ["Kesesuaian variabel", 98],
      ["Kesesuaian topik", 96],
      ["Kesesuaian konteks", 94],
      ["Kesesuaian metode", 91],
      ["Kesesuaian teori", 89],
      ["Kesesuaian periode", 93],
    ],
    fitNote: "Cocok untuk: landasan teori, penyusunan hipotesis, pembanding penelitian, dan rujukan metode kuantitatif.",
    quote: "Parasocial interaction strengthens purchase intention when viewers perceive urgency and scarcity.",
    credibility: [
      ["Sumber", "OpenAlex dan Crossref"],
      ["Penerbit", "Pusat Studi Bisnis Digital Nusantara"],
      ["DOI terverifikasi", "https://doi.org/10.21776/ub.jpt.2026.011.2"],
      ["Jumlah sitasi", "Artikel ini dikutip dalam 45 karya ilmiah lainnya."],
    ],
    summary:
      "Penelitian ini menunjukkan bahwa interaksi parasosial antara host dan penonton dapat membangun kepercayaan. Ketika interaksi tersebut disertai pesan kelangkaan berupa batas waktu atau stok, niat beli konsumen pada live streaming commerce meningkat...",
    summaryMore:
      "Temuan ini menegaskan bahwa kepercayaan yang terbentuk melalui interaksi parasosial menjadi kunci konversi, sehingga pelaku usaha perlu menjaga kualitas interaksi dan menyampaikan kelangkaan secara jujur agar niat beli berlanjut menjadi pembelian.",
    doiUrl: "https://doi.org/10.20886/jpkf.2022.6.1.16-28",
    pdfNote: "PDF Live Streaming Commerce dibuka.",
  },
  {
    id: "res-2",
    headerTitle: "Rekomendasi Jurnal",
    headerNote: "",
    rank: "Rekomendasi 2",
    badges: [
      { label: "2022", tone: "slate" },
      { label: "Akses Terbuka", tone: "sky" },
    ],
    citations: "",
    source: "Jurnal Kajian Pemasaran Digital",
    fitBars: [
      ["Kesesuaian variabel", 94],
      ["Kesesuaian topik", 92],
      ["Kesesuaian konteks", 90],
      ["Kesesuaian metode", 88],
      ["Kesesuaian teori", 86],
      ["Kesesuaian periode", 91],
    ],
    fitNote: "Cocok untuk: kerangka konseptual, pembahasan meta-analisis, dan perbandingan efek antarnegara.",
    quote: "Digital literacy mediates the relationship between technology access and academic achievement.",
    credibility: [
      ["Sumber", "OpenAlex dan Crossref"],
      ["Penerbit", "Pusat Studi Bisnis Digital Nusantara"],
      ["DOI terverifikasi", "https://doi.org/10.21776/ub.jpt.2026.011.2"],
      ["Jumlah sitasi", "Artikel ini dikutip dalam 45 karya ilmiah lainnya."],
    ],
    summary:
      "Meta-analisis 43 studi dari 12 negara menunjukkan literasi digital memediasi hubungan antara akses teknologi dan capaian akademik, dengan efek terbesar pada mahasiswa semester awal. Ukuran efek gabungan berada pada kategori sedang hingga kuat.",
    doiUrl: "https://doi.org/10.20886/jpkf.2022.6.1.16-28",
    pdfNote: "PDF meta-analisis literasi digital dibuka.",
  },
  {
    id: "res-3",
    headerTitle: "Rekomendasi Jurnal",
    headerNote: "",
    rank: "Rekomendasi 3",
    badges: [
      { label: "2024", tone: "slate" },
      { label: "Akses Terbuka", tone: "sky" },
    ],
    citations: "",
    source: "Jurnal Kajian Pemasaran Digital",
    fitBars: [
      ["Kesesuaian variabel", 88],
      ["Kesesuaian topik", 90],
      ["Kesesuaian konteks", 95],
      ["Kesesuaian metode", 84],
      ["Kesesuaian teori", 87],
      ["Kesesuaian periode", 96],
    ],
    fitNote: "Cocok untuk: konteks Indonesia, rujukan variabel kepercayaan, dan implikasi praktis pemasaran.",
    quote: "Kepercayaan konsumen memediasi pengaruh ulasan daring terhadap minat beli.",
    credibility: [
      ["Sumber", "OpenAlex dan Crossref"],
      ["Penerbit", "Pusat Studi Bisnis Digital Nusantara"],
      ["DOI terverifikasi", "https://doi.org/10.21776/ub.jpt.2026.011.2"],
      ["Jumlah sitasi", "Artikel ini dikutip dalam 45 karya ilmiah lainnya."],
    ],
    summary:
      "Survei 312 responden pengguna live commerce di Indonesia menemukan kepercayaan dan ulasan konsumen memediasi pengaruh interaksi parasosial terhadap minat beli, terutama pada kategori produk fesyen dan perawatan diri.",
    doiUrl: "https://doi.org/10.20886/jpkf.2022.6.1.16-28",
    pdfNote: "PDF strategi minat beli live commerce dibuka.",
  },
];

const JOURNAL_FEEDBACK_REASONS = [
  { id: "topik", label: "Topik penelitian" },
  { id: "tahun", label: "Tahun publikasi" },
  { id: "metode", label: "Metode penelitian" },
  { id: "doi", label: "DOI tidak tersedia" },
  { id: "hasil", label: "Hasil penelitian" },
  { id: "lainnya", label: "Lainnya" },
];

const alternativeJournalsPool = [
  {
    id: "alt-1",
    title: "Omnichannel Customer Experience in Digital Retail: Examining the Interplay of Personalization and Trust",
    authors: "Wicaksono, B. & Setiawan, I.",
    description: "Studi empiris 420 konsumen e-commerce Indonesia membuktikan bahwa integrasi omnichannel dan pesan personalisasi memperkuat niat beli ulang.",
    year: "2025",
    relevancy: "98%",
    detail: {
      id: "alt-1",
      headerTitle: "Rekomendasi Jurnal",
      headerNote: "",
      rank: "Rekomendasi Baru",
      badges: [
        { label: "2025", tone: "slate" as const },
        { label: "Akses Terbuka", tone: "sky" as const },
      ],
      citations: "",
      source: "Indonesian Journal of Information Systems & Retail Marketing",
      fitBars: [
        ["Kesesuaian variabel", 99],
        ["Kesesuaian topik", 97],
        ["Kesesuaian konteks", 95],
        ["Kesesuaian metode", 94],
        ["Kesesuaian teori", 92],
        ["Kesesuaian periode", 96],
      ] as [string, number][],
      fitNote: "Cocok untuk: penguatan variabel perilaku konsumen digital terkini dan metode SEM-PLS.",
      quote: "Personalized interaction significantly mitigates uncertainty and boosts consumer purchasing decisions in digital platforms.",
      credibility: [
        ["Sumber", "Scopus Q1, OpenAlex dan Crossref"],
        ["Penerbit", "Pusat Publikasi Riset Manajemen"],
        ["DOI terverifikasi", "https://doi.org/10.1016/j.ijisrm.2025.02.011"],
        ["Jumlah sitasi", "Artikel ini dikutip dalam 18 karya ilmiah terbaru."],
      ] as [string, string][],
      summary: "Penelitian ini mengkaji pengaruh integrasi omnichannel dan sistem personalisasi terhadap loyalitas serta niat beli pelanggan ritel digital di Indonesia...",
      summaryMore: "Hasil analisis menunjukkan bahwa transparansi ulasan dan respon host secara real-time berkontribusi paling dominan dalam membentuk kepercayaan belanja online.",
      doiUrl: "https://doi.org/10.1016/j.ijisrm.2025.02.011",
      pdfNote: "PDF Omnichannel Customer Experience dibuka.",
    },
  },
  {
    id: "alt-2",
    title: "The Role of Social Proof and Algorithmic Recommendations in Driving Urgency and Purchase Behavior",
    authors: "Kusuma, A. & Wardhana, T.",
    description: "Analisis eksperimen kuantitatif pada 550 pengguna media sosial mengungkap peran social proof dinamis dalam mempercepat keputusan belanja.",
    year: "2024",
    relevancy: "95%",
    detail: {
      id: "alt-2",
      headerTitle: "Rekomendasi Jurnal",
      headerNote: "",
      rank: "Rekomendasi Baru",
      badges: [
        { label: "2024", tone: "slate" as const },
        { label: "Akses Terbuka", tone: "sky" as const },
      ],
      citations: "",
      source: "Journal of Consumer Psychology & Digital Commerce",
      fitBars: [
        ["Kesesuaian variabel", 96],
        ["Kesesuaian topik", 95],
        ["Kesesuaian konteks", 92],
        ["Kesesuaian metode", 93],
        ["Kesesuaian teori", 90],
        ["Kesesuaian periode", 95],
      ] as [string, number][],
      fitNote: "Cocok untuk: analisis behavioral economics, consumer psychology, dan rujukan eksperimental.",
      quote: "Dynamic cues of scarcity and peer validation create a synergistic boost to immediate checkout rates.",
      credibility: [
        ["Sumber", "Crossref, DOAJ, dan OpenAlex"],
        ["Penerbit", "Asosiasi Riset Perilaku Digital"],
        ["DOI terverifikasi", "https://doi.org/10.1080/jcpdc.2024.11.045"],
        ["Jumlah sitasi", "Artikel ini dikutip dalam 29 karya ilmiah."],
      ] as [string, string][],
      summary: "Studi ini membuktikan bahwa kombinasi social proof real-time dan notifikasi kelangkaan secara signifikan menaikkan konversi pada platform live shopping...",
      summaryMore: "Peneliti merekomendasikan penggunaan indikator stok yang akurat agar tidak menimbulkan skeptisisme konsumen.",
      doiUrl: "https://doi.org/10.1080/jcpdc.2024.11.045",
      pdfNote: "PDF Social Proof & Algorithmic Recommendations dibuka.",
    },
  },
  {
    id: "alt-3",
    title: "Investigating Hedonic Motivation and Live Streamer Characteristics on Impulsive Buying Decisions",
    authors: "Sari, M. N. & Santoso, H.",
    description: "Penelitian berbasis structural equation modeling menunjukkan motivasi hedonis dan daya tarik streamer menjadi pendorong utama pembelian impulsif.",
    year: "2024",
    relevancy: "93%",
    detail: {
      id: "alt-3",
      headerTitle: "Rekomendasi Jurnal",
      headerNote: "",
      rank: "Rekomendasi Baru",
      badges: [
        { label: "2024", tone: "slate" as const },
        { label: "Akses Terbuka", tone: "sky" as const },
      ],
      citations: "",
      source: "Asia Pacific Journal of Marketing and Logistics",
      fitBars: [
        ["Kesesuaian variabel", 95],
        ["Kesesuaian topik", 93],
        ["Kesesuaian konteks", 91],
        ["Kesesuaian metode", 90],
        ["Kesesuaian teori", 92],
        ["Kesesuaian periode", 94],
      ] as [string, number][],
      fitNote: "Cocok untuk: tinjauan motivasi hedonis, impulsive buying, dan analisis streamer persona.",
      quote: "Streamer authenticity directly triggers emotional arousal, mediating hedonic values into rapid transactions.",
      credibility: [
        ["Sumber", "Emerald Insight, OpenAlex, dan Crossref"],
        ["Penerbit", "Emerald Publishing Limited"],
        ["DOI terverifikasi", "https://doi.org/10.1108/APJML-05-2024-0312"],
        ["Jumlah sitasi", "Artikel ini dikutip dalam 34 karya ilmiah."],
      ] as [string, string][],
      summary: "Fokus penelitian ini membedah bagaimana karakteristik streamer yang interaktif dan karismatik membangkitkan gairah emosional penonton untuk melakukan pembelian spontan...",
      summaryMore: "Implikasi praktis bagi digital marketer adalah membina streamer agar lebih berfokus pada storytelling daripada sekadar berjualan agresif.",
      doiUrl: "https://doi.org/10.1108/APJML-05-2024-0312",
      pdfNote: "PDF Hedonic Motivation dibuka.",
    },
  },
  {
    id: "alt-4",
    title: "Digital Marketing Capabilities and SME Performance: Moderating Role of Competitive Intensity",
    authors: "Fauzi, M. & Siregar, D.",
    description: "Kajian kuantitatif pada 380 pelaku UMKM di sektor retail menemukan kapabilitas pemasaran digital meningkatkan penjualan secara berkelanjutan.",
    year: "2023",
    relevancy: "91%",
    detail: {
      id: "alt-4",
      headerTitle: "Rekomendasi Jurnal",
      headerNote: "",
      rank: "Rekomendasi Baru",
      badges: [
        { label: "2023", tone: "slate" as const },
        { label: "Akses Terbuka", tone: "sky" as const },
      ],
      citations: "",
      source: "Journal of Small Business and Enterprise Development",
      fitBars: [
        ["Kesesuaian variabel", 94],
        ["Kesesuaian topik", 92],
        ["Kesesuaian konteks", 89],
        ["Kesesuaian metode", 91],
        ["Kesesuaian teori", 88],
        ["Kesesuaian periode", 93],
      ] as [string, number][],
      fitNote: "Cocok untuk: penelitian bisnis kecil, kapabilitas dinamis, dan analisis moderasi intensitas kompetitif.",
      quote: "Digital marketing capabilities act as dynamic assets that shield small enterprises against adverse market shifts.",
      credibility: [
        ["Sumber", "Scopus, Crossref, dan OpenAlex"],
        ["Penerbit", "Emerald Publishing Limited"],
        ["DOI terverifikasi", "https://doi.org/10.1108/JSBED-09-2023-0401"],
        ["Jumlah sitasi", "Artikel ini dikutip dalam 26 karya ilmiah."],
      ] as [string, string][],
      summary: "Penelitian ini menggarisbawahi pentingnya adopsi kapabilitas analitik dan konten digital bagi UMKM untuk mempertahankan keunggulan bersaing...",
      summaryMore: "Studi ini merekomendasikan pelatihan berkelanjutan bagi wirausahawan agar mampu mengoptimalkan data konsumen.",
      doiUrl: "https://doi.org/10.1108/JSBED-09-2023-0401",
      pdfNote: "PDF Digital Marketing Capabilities dibuka.",
    },
  },
];

type MobileResultJournal = {
  id: string;
  rank: string;
  score: number;
  citation: string;
  summary: string;
  title: string;
  authors: string;
  journal?: string;
  description: string;
  year: string;
  relevancy: string;
  isReplaced?: boolean;
};

const mobileResultJournals: MobileResultJournal[] = [
  {
    id: "mres-1",
    rank: "Rekomendasi 1",
    score: 97,
    citation: "2023 • Jurnal Kajian Pemasaran Digital",
    journal: "Jurnal Kajian Pemasaran Digital",
    summary:
      "Penelitian ini menunjukkan bahwa interaksi parasosial antara host dan penonton dapat membangun kepercayaan. Ketika interaksi tersebut disertai pesan kelangkaan berupa batas waktu atau stok, niat beli konsumen pada live streaming commerce meningkat...",
    title: "Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges",
    authors: "Rahmawati, D. & Pratama, A.",
    description:
      "Interaksi parasosial antara host dan penonton ditambah dorongan kelangkaan seperti batas waktu dan stok meningkatkan niat beli di live streaming commerce.",
    year: "2023",
    relevancy: "97%",
  },
  {
    id: "mres-2",
    rank: "Rekomendasi 2",
    score: 89,
    citation: "2023 • Jurnal Kajian Pemasaran Digital",
    journal: "Jurnal Kajian Pemasaran Digital",
    summary: "Studi ini memperkuat hubungan antara interaksi parasosial, dorongan kelangkaan, dan perilaku pembelian digital.",
    title: "Pengaruh Interaksi Parasosial dan Dorongan Kelangkaan terhadap Niat Beli di Live Streaming Commerce",
    authors: "Pratama, R. & Lestari, S.",
    description: "Studi ini memperkuat hubungan antara interaksi parasosial, dorongan kelangkaan, dan perilaku pembelian digital.",
    year: "2023",
    relevancy: "89%",
  },
  {
    id: "mres-3",
    rank: "Rekomendasi 3",
    score: 85,
    citation: "2024 • Jurnal Kajian Pemasaran Digital",
    journal: "Jurnal Kajian Pemasaran Digital",
    summary:
      "Survei 312 responden pengguna live commerce di Indonesia menemukan kepercayaan dan ulasan konsumen memediasi pengaruh interaksi parasosial terhadap minat beli, terutama pada kategori produk fesyen dan perawatan diri.",
    title: "Strategi Peningkatan Minat Beli pada Live Commerce: Peran Kepercayaan dan Ulasan Konsumen",
    authors: "Hidayat, M. & Nugroho, A.",
    description: "Survei 312 responden pengguna live commerce di Indonesia menemukan kepercayaan dan ulasan konsumen memediasi minat beli.",
    year: "2024",
    relevancy: "85%",
  },
];

function parseToastContent(input: string | { title: string; description?: string }): { title: string; description: string } {
  if (typeof input === "object" && input !== null) {
    return {
      title: input.title,
      description: input.description || "",
    };
  }

  const raw = String(input || "").trim();
  const lower = raw.toLowerCase();

  if (lower.includes("jurnal dihapus dari koleksi")) {
    return {
      title: "Berhasil Dihapus",
      description: "Jurnal telah dihapus dari Koleksi.",
    };
  }
  if (lower.includes("jurnal disimpan ke koleksi") || lower.includes("jurnal berhasil disimpan")) {
    return {
      title: "Berhasil Disimpan",
      description: "Jurnal telah berhasil disimpan ke Koleksi.",
    };
  }
  if (lower.includes("semua rekomendasi disimpan")) {
    return {
      title: "Berhasil Disimpan",
      description: "Semua rekomendasi telah disimpan ke Koleksi.",
    };
  }
  if (lower.includes("literature review dihapus")) {
    return {
      title: "Berhasil Dihapus",
      description: "Literature review telah dihapus dari Koleksi.",
    };
  }
  if (lower.includes("literature review disimpan")) {
    return {
      title: "Berhasil Disimpan",
      description: "Literature review telah disimpan ke Koleksi.",
    };
  }
  if (lower.includes("peta penelitian dihapus")) {
    return {
      title: "Berhasil Dihapus",
      description: "Peta penelitian telah dihapus dari Koleksi.",
    };
  }
  if (lower.includes("peta penelitian disimpan")) {
    return {
      title: "Berhasil Disimpan",
      description: "Peta penelitian telah disimpan ke Koleksi.",
    };
  }
  if (lower.includes("riwayat disematkan")) {
    return {
      title: "Berhasil Disematkan",
      description: "Riwayat pencarian telah disematkan ke atas.",
    };
  }
  if (lower.includes("sematan riwayat dilepas") || lower.includes("sematan dilepas")) {
    return {
      title: "Sematan Dilepas",
      description: "Sematan pada riwayat pencarian telah dilepas.",
    };
  }
  if (lower.includes("riwayat pencarian dihapus") || lower.includes("riwayat dihapus")) {
    return {
      title: "Berhasil Dihapus",
      description: "Riwayat pencarian telah berhasil dihapus.",
    };
  }
  if (lower.includes("nama riwayat berhasil diubah")) {
    return {
      title: "Berhasil Diperbarui",
      description: "Nama riwayat pencarian berhasil disimpan.",
    };
  }
  if (lower.includes("file berhasil dihapus")) {
    return {
      title: "Berhasil Dihapus",
      description: "File rujukan telah berhasil dihapus.",
    };
  }
  if (lower.includes("batas 3 jurnal gratis")) {
    return {
      title: "Batas Kuota",
      description: "Batas 3 jurnal gratis tercapai. Jurnal lainnya kini terkunci.",
    };
  }
  if (lower.includes("dihapus")) {
    return {
      title: "Berhasil Dihapus",
      description: raw.endsWith(".") ? raw : `${raw}.`,
    };
  }
  if (lower.includes("disimpan") || lower.includes("simpan")) {
    return {
      title: "Berhasil Disimpan",
      description: raw.endsWith(".") ? raw : `${raw}.`,
    };
  }
  if (lower.includes("dipindahkan") || lower.includes("pindah")) {
    return {
      title: "Berhasil Dipindahkan",
      description: raw.endsWith(".") ? raw : `${raw}.`,
    };
  }
  if (lower.includes("diperbarui") || lower.includes("diubah") || lower.includes("diganti")) {
    return {
      title: "Berhasil Diperbarui",
      description: raw.endsWith(".") ? raw : `${raw}.`,
    };
  }
  if (lower.includes("dibuat")) {
    return {
      title: "Berhasil Dibuat",
      description: raw.endsWith(".") ? raw : `${raw}.`,
    };
  }

  return {
    title: "Berhasil",
    description: raw.endsWith(".") ? raw : `${raw}.`,
  };
}

function Toast({ message }: { message: string | { title: string; description?: string } | null }) {
  if (!message) return null;
  const { title, description } = parseToastContent(message);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-4 right-4 z-[360] flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_12px_36px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06)] transition-all sm:left-auto sm:right-6 sm:w-auto sm:min-w-[340px] sm:max-w-[420px] md:bottom-6 md:right-6 animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm shadow-blue-500/20">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-[14.5px] font-bold leading-tight text-slate-900 tracking-[-0.01em]">
          {title}
        </h4>
        {description ? (
          <p className="mt-1 text-xs sm:text-[13px] leading-relaxed text-slate-500 font-normal">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function NewFolderModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) setName("");
  }, [open]);

  if (!open) return null;

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[340] flex items-center justify-center bg-black/25 px-4 backdrop-blur-[2.55px]"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Folder baru"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={event => event.stopPropagation()}
      >
        <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold text-[#0f172a]">Folder baru</h2>
        <p className="mt-1 text-xs leading-5 text-[#64748b]">Buat folder untuk mengelompokkan koleksi tersimpanmu.</p>
        <input
          autoFocus
          value={name}
          onChange={event => setName(capitalizeFirstLetter(event.target.value))}
          onKeyDown={event => {
            if (event.key === "Enter") submit();
            if (event.key === "Escape") onClose();
          }}
          placeholder="Nama folder baru"
          className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 text-sm text-[#0f172a] outline-none placeholder:text-slate-400 focus:border-sky-400 focus:bg-white"
        />
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#64748b] hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!name.trim()}
            className={`rounded-xl px-5 py-2 text-xs font-semibold text-white ${name.trim() ? "bg-[#00629b] hover:bg-[#005280]" : "cursor-not-allowed bg-slate-200 text-slate-400"}`}
          >
            Buat
          </button>
        </div>
      </div>
    </div>
  );
}

function HapusJurnalModal({
  open,
  title: _title,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[340] flex items-center justify-center bg-black/25 px-4 backdrop-blur-[2.55px]"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Hapus jurnal dari koleksi"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={event => event.stopPropagation()}
      >
        <div className="mx-auto sm:mx-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#ffdad6] text-[#93000a]">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
            <path d="M6.5 7v4M9.5 7v4" />
          </svg>
        </div>
        <h2 className="mt-4 font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold text-[#0f172a] text-center sm:text-left">
          Kamu yakin ingin menghapus<br className="sm:hidden" /> <span className="inline-block">jurnal ini?</span>
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-[#64748b] text-center sm:text-left">
          Jurnal ini akan dihapus dari Koleksi. Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="mt-5 flex flex-col-reverse sm:flex-row justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#64748b] transition-colors hover:bg-slate-50 active:scale-[0.99]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex min-h-[44px] items-center justify-center rounded-xl bg-[#bd3434] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a12b2b] active:scale-[0.99]"
          >
            Ya, hapus
          </button>
        </div>
      </div>
    </div>
  );
}

function GantiNamaRiwayatModal({
  open,
  currentName,
  onClose,
  onSave,
}: {
  open: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (newName: string) => void;
}) {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (open) {
      setName(currentName);
    }
  }, [currentName, open]);

  if (!open) return null;

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[520] flex items-center justify-center bg-black/25 px-4 backdrop-blur-[2.55px]"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ganti nama riwayat"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={event => event.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#00629b]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
            </svg>
          </div>
          <div>
            <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold text-[#0f172a]">Ganti nama riwayat</h2>
            <p className="text-xs leading-4 text-[#64748b]">Ubah judul riwayat pencarian ini.</p>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-[11px] font-semibold text-slate-500">Nama riwayat</label>
          <input
            autoFocus
            value={name}
            onChange={event => setName(event.target.value)}
            onKeyDown={event => {
              if (event.key === "Enter") submit();
              if (event.key === "Escape") onClose();
            }}
            placeholder="Masukkan nama baru..."
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm text-[#0f172a] outline-none placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[38px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#64748b] transition-colors hover:bg-slate-50 active:scale-95 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!name.trim()}
            className={`flex min-h-[38px] items-center justify-center rounded-xl px-5 py-2 text-xs font-semibold text-white transition-all cursor-pointer active:scale-95 ${
              name.trim()
                ? "bg-[#00629b] hover:bg-[#005280] shadow-2xs"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

function HapusRiwayatModal({
  open,
  title: _title,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/25 px-4 backdrop-blur-[2.55px]"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Hapus riwayat pencarian"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={event => event.stopPropagation()}
      >
        <div className="mx-auto sm:mx-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#ffdad6] text-[#93000a]">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
            <path d="M6.5 7v4M9.5 7v4" />
          </svg>
        </div>
        <h2 className="mt-4 font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold text-[#0f172a] text-center sm:text-left">
          Kamu yakin ingin menghapus<br className="sm:hidden" /> <span className="inline-block">riwayat ini?</span>
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-[#64748b] text-center sm:text-left">
          Riwayat pencarian ini akan dihapus. Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="mt-5 flex flex-col-reverse sm:flex-row justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#64748b] transition-colors hover:bg-slate-50 active:scale-[0.99]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex min-h-[44px] items-center justify-center rounded-xl bg-[#bd3434] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a12b2b] active:scale-[0.99]"
          >
            Ya, hapus
          </button>
        </div>
      </div>
    </div>
  );
}

function HapusLiteratureModal({
  open,
  title: _title,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[340] flex items-center justify-center bg-black/25 px-4 backdrop-blur-[2.55px]"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Hapus literature review dari koleksi"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={event => event.stopPropagation()}
      >
        <div className="mx-auto sm:mx-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#ffdad6] text-[#93000a]">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
            <path d="M6.5 7v4M9.5 7v4" />
          </svg>
        </div>
        <h2 className="mt-4 font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold text-[#0f172a] text-center sm:text-left">
          Kamu yakin ingin menghapus<br className="sm:hidden" /> <span className="inline-block">literature review ini?</span>
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-[#64748b] text-center sm:text-left">
          Literature review ini akan dihapus dari Koleksi. Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="mt-5 flex flex-col-reverse sm:flex-row justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#64748b] transition-colors hover:bg-slate-50 active:scale-[0.99]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex min-h-[44px] items-center justify-center rounded-xl bg-[#bd3434] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a12b2b] active:scale-[0.99]"
          >
            Ya, hapus
          </button>
        </div>
      </div>
    </div>
  );
}

function HapusMapModal({
  open,
  title: _title,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[340] flex items-center justify-center bg-black/25 px-4 backdrop-blur-[2.55px]"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Hapus peta penelitian dari koleksi"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={event => event.stopPropagation()}
      >
        <div className="mx-auto sm:mx-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#ffdad6] text-[#93000a]">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
            <path d="M6.5 7v4M9.5 7v4" />
          </svg>
        </div>
        <h2 className="mt-4 font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold text-[#0f172a] text-center sm:text-left">
          Kamu yakin ingin menghapus<br className="sm:hidden" /> <span className="inline-block">peta penelitian ini?</span>
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-[#64748b] text-center sm:text-left">
          Peta penelitian ini akan dihapus dari Koleksi. Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="mt-5 flex flex-col-reverse sm:flex-row justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#64748b] transition-colors hover:bg-slate-50 active:scale-[0.99]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex min-h-[44px] items-center justify-center rounded-xl bg-[#bd3434] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a12b2b] active:scale-[0.99]"
          >
            Ya, hapus
          </button>
        </div>
      </div>
    </div>
  );
}

function HapusFolderModal({
  open,
  count = 1,
  onClose,
  onConfirm,
}: {
  open: boolean;
  count?: number;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[340] flex items-center justify-center bg-black/25 px-4 backdrop-blur-[2.55px]"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Hapus folder dari koleksi"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={event => event.stopPropagation()}
      >
        <div className="mx-auto sm:mx-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#ffdad6] text-[#93000a]">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
            <path d="M6.5 7v4M9.5 7v4" />
          </svg>
        </div>
        <h2 className="mt-4 font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold text-[#0f172a] text-center sm:text-left">
          {count > 1 ? (
            <>
              Kamu yakin ingin menghapus<br className="sm:hidden" /> <span className="inline-block">{count} folder ini?</span>
            </>
          ) : (
            <>
              Kamu yakin ingin menghapus<br className="sm:hidden" /> <span className="inline-block">folder ini?</span>
            </>
          )}
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-[#64748b] text-center sm:text-left">
          Folder ini akan dihapus dari Koleksi dan item di dalamnya akan dipindahkan ke "Belum dikelompokkan". Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="mt-5 flex flex-col-reverse sm:flex-row justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#64748b] transition-colors hover:bg-slate-50 active:scale-[0.99]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex min-h-[44px] items-center justify-center rounded-xl bg-[#bd3434] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a12b2b] active:scale-[0.99]"
          >
            Ya, hapus
          </button>
        </div>
      </div>
    </div>
  );
}

function HapusFileModal({
  open,
  fileName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  fileName?: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/25 px-4 backdrop-blur-[2.55px]"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Hapus file"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150"
        onClick={event => event.stopPropagation()}
      >
        <div className="mx-auto sm:mx-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#ffdad6] text-[#93000a]">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
            <path d="M6.5 7v4M9.5 7v4" />
          </svg>
        </div>
        <h2 className="mt-4 font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold text-[#0f172a] text-center sm:text-left">
          Apakah kamu yakin menghapus<br className="sm:hidden" /> <span className="inline-block">file ini?</span>
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-[#64748b] text-center sm:text-left">
          {fileName ? (
            <>
              File <span className="font-semibold text-slate-800">"{fileName}"</span> akan dihapus dari pencarian. Kamu dapat mengunggah dokumen baru kapan saja.
            </>
          ) : (
            "File yang sudah diunggah akan dihapus. Kamu dapat mengunggah dokumen baru kapan saja."
          )}
        </p>
        <div className="mt-5 flex flex-col-reverse sm:flex-row justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#64748b] transition-colors hover:bg-slate-50 active:scale-[0.99]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex min-h-[44px] items-center justify-center rounded-xl bg-[#bd3434] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a12b2b] active:scale-[0.99]"
          >
            Ya, hapus
          </button>
        </div>
      </div>
    </div>
  );
}

function SlowSearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[360] flex items-center justify-center bg-black/35 px-4 backdrop-blur-[2.5px] animate-in fade-in duration-200"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Proses pencarian membutuhkan waktu lebih lama"
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100"
        onClick={event => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-[#00629b] border border-sky-200/80 shadow-xs">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        <h2 className="mt-4 text-center font-['Plus_Jakarta_Sans:Bold'] text-base sm:text-lg font-bold text-[#0f172a] leading-snug">
          Proses Pencarian Lebih Lama
        </h2>

        <p className="mt-2 text-center text-sm leading-relaxed text-[#64748b]">
          Proses pencarian membutuhkan waktu lebih lama. Tunggu hingga proses selesai.
        </p>

        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full min-h-[44px] items-center justify-center rounded-xl bg-[#00619c] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004e7e] active:scale-[0.99] shadow-xs"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}

function UpgradeLockedConfirmModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/35 px-4 backdrop-blur-[2.5px] transition-opacity"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Upgrade Paket Alerin"
        className="w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-7 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150"
        onClick={event => event.stopPropagation()}
      >
        <div className="mx-auto sm:mx-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-[#00629b] border border-sky-100 shadow-2xs">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h3 className="mt-4 font-['Plus_Jakarta_Sans:Bold',sans-serif] text-lg sm:text-[19px] font-bold leading-snug text-slate-900 text-center sm:text-left">
          Upgrade Paket Alerin untuk membuka jurnal ini
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-600 text-center sm:text-left">
          Akses jurnal ini terkunci karena batas kuota 3 jurnal gratis telah tercapai. Apakah Anda ingin meng-upgrade paket Alerin sekarang?
        </p>

        <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[42px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800 active:scale-95 cursor-pointer"
          >
            Tidak
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex min-h-[42px] items-center justify-center rounded-xl bg-[#00629b] px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#005282] active:scale-95 cursor-pointer"
          >
            Ya
          </button>
        </div>
      </div>
    </div>
  );
}

const temuanAnalisis = [
  {
    halaman: 18,
    badge: "Sitasi tidak mendukung klaim",
    kutipan:
      "“Media sosial terbukti meningkatkan keputusan pembelian pada seluruh kelompok usia (Pratama, 2021).”",
    alasan: [
      "Artikel hanya meneliti mahasiswa usia 18–24 tahun.",
      "Variabel yang diuji adalah niat beli, bukan keputusan pembelian.",
      "Klaim pada naskah jauh lebih luas daripada bukti dalam sumber aslinya.",
    ],
    saran:
      "“Pada mahasiswa usia 18–24 tahun di Bandung, intensitas penggunaan media sosial berhubungan positif dengan niat beli (Pratama & Lestari, 2021).”",
  },
  {
    halaman: 21,
    badge: "Sumber tidak dapat diverifikasi",
    kutipan:
      "“Konsumen Gen Z lebih loyal pada merek yang transparan (Hidayat, 2022).”",
    alasan: [
      "Referensi Hidayat (2022) tidak ditemukan di OpenAlex maupun Crossref.",
      "Tidak ada DOI atau tautan menuju sumber asli.",
      "Pembaca tidak dapat memeriksa ulang klaim ini.",
    ],
    saran:
      "“Sebanyak 68% konsumen Gen Z menyebut transparansi merek sebagai alasan loyalitas (Aisyah et al., 2023, hlm. 45).”",
  },
  {
    halaman: 24,
    badge: "Parafrase terlalu mirip aslinya",
    kutipan:
      "“Interaksi parasosial membuat penonton merasa dekat dengan host sehingga lebih mudah terdorong membeli (Wongkitrungrueng & Assarut, 2023).”",
    alasan: [
      "Kalimat hasil parafrase lebih dari 80% sama dengan sumber.",
      "Struktur kalimat dan pilihan kata mengikuti sumber terlalu ketat.",
      "Berisiko dianggap plagiarisme oleh pemeriksa similarity.",
    ],
    saran:
      "“Penonton yang membangun ikatan emosional dengan host cenderung lebih percaya dan lebih cepat mengambil keputusan pembelian (Wongkitrungrueng & Assarut, 2023).”",
  },
  {
    halaman: 27,
    badge: "Sumber terlalu lama",
    kutipan:
      "“Pemasaran media sosial adalah kanal utama branding saat ini (Kotler, 2010).”",
    alasan: [
      "Sumber berusia lebih dari 15 tahun.",
      "Lanskap media sosial telah berubah jauh setelah 2010.",
      "Klaim “utama saat ini” butuh data terbaru.",
    ],
    saran:
      "“Pada 2024, media sosial menjadi kanal akuisisi pelanggan dengan biaya terendah bagi UMKM (Databoks, 2024).”",
  },
  {
    halaman: 30,
    badge: "Klaim tanpa sitasi",
    kutipan:
      "“Live streaming commerce tumbuh 3x lebih cepat dibanding e-commerce konvensional.”",
    alasan: [
      "Tidak ada sumber yang dilampirkan pada akhir kalimat.",
      "Angka “3x” tidak diberi rujukan data.",
      "Pembaca tidak tahu periode dan cakupan perbandingan.",
    ],
    saran:
      "“Sepanjang 2023–2024, nilai transaksi live streaming commerce tumbuh 2,7 kali dibanding kanal e-commerce konvensional (Jakpat, 2024).”",
  },
  {
    halaman: 33,
    badge: "Mengutip sumber sekunder",
    kutipan:
      "“Teori uses and gratification menegaskan bahwa audiens aktif memilih media (Rahmawati, 2022).”",
    alasan: [
      "Kutipan diambil dari jurnal Rahmawati, bukan dari teori aslinya.",
      "Sumber asli (Katz, 1974) seharusnya dirujuk langsung.",
      "Pengutipan sumber sekunder melemahkan landasan teori.",
    ],
    saran:
      "“Audiens aktif memilih dan menyesuaikan media sesuai kebutuhannya (Katz, Blumler & Gurevitch, 1974; dikutip dari Rahmawati, 2022).”",
  },
  {
    halaman: 36,
    badge: "Judul sumber tidak sesuai kutipan",
    kutipan:
      "“Kelangkaan produk meningkatkan niat beli secara signifikan (Sari, 2023).”",
    alasan: [
      "Judul sumber Sari (2023) membahas discount depth, bukan kelangkaan.",
      "Variabel dalam sumber berbeda dengan yang dikutip.",
      "Sitasi tampak dipasang agar daftar pustaka penuh.",
    ],
    saran:
      "“Penekanan stok terbatas pada siaran langsung meningkatkan niat beli hingga 24% (Lim & Susanto, 2023).”",
  },
];

const riwayatPencarian = [
  {
    query: "interaksi parasosial niat beli konsumen",
    waktu: "Hari ini, 09.42",
    jumlah: "50 hasil",
    daftar: [
      "Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges",
      "Pengaruh Interaksi Parasosial dan Dorongan Kelangkaan terhadap Niat Beli di Live Streaming Commerce",
      "Parasocial Interaction Effects on Purchase Intention in Social Commerce Livestreaming",
    ],
  },
  {
    query: "kelangkaan produk strategi pemasaran digital",
    waktu: "Kemarin, 20.15",
    jumlah: "38 hasil",
    daftar: [
      "Scarcity Nudges and Consumer Decision Making in Digital Marketplace",
      "Strategi Kelangkaan Produk dalam Meningkatkan Urgensi Pembelian Online",
    ],
  },
  {
    query: "teori uses and gratification media sosial",
    waktu: "12 Okt 2026, 14.03",
    jumlah: "42 hasil",
    daftar: [
      "Uses and Gratification Theory in Social Media Consumer Behavior Research",
      "Eksplorasi Kepuasan Penonton Konten Streaming Berdasarkan Teori Uses and Gratification",
    ],
  },
];

const riwayatSidebar = [
  "Analisis Regresi Variabel Parasosial",
  "Tinjauan Teori TAM Skripsi Bab II",
  "Evaluasi Sitasi & Parafrase Bab 4",
  "Rekomendasi Jurnal Terverifikasi Alerin",
  "Buat Rumusan Masalah E-Commerce",
  "Penjelasan Uji Validitas & Reliabilitas",
];

function ProfileCard({
  collection,
  isDarkMode,
  onToggleDarkMode,
  collapsed = false,
}: {
  collection: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  collapsed?: boolean;
}) {
  const assets = collection ? collectionAssets : searchAssets;
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ left: 0, bottom: 0, arrowBottom: 32 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      {collapsed ? (
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="Profil"
          onClick={() => {
            const rect = buttonRef.current?.getBoundingClientRect();
            if (rect) {
              setMenuPosition({
                left: rect.right + 12,
                bottom: Math.max(12, window.innerHeight - rect.bottom),
                arrowBottom: rect.height / 2,
              });
            }
            setMenuOpen(open => !open);
          }}
          className="group/nav relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/80 bg-white shadow-sm transition-colors hover:bg-slate-50"
        >
          <img src={`${assets}/48c68.png`} alt="Profil" className="h-8 w-8 rounded-full object-cover" />
          <span className="pointer-events-none absolute left-full top-1/2 z-[999] ml-3 -translate-y-1/2 whitespace-nowrap rounded-full border border-slate-200/90 bg-white px-4 py-2 text-sm font-semibold text-slate-800 opacity-0 shadow-lg transition-opacity duration-200 group-hover/nav:opacity-100">
            Profil
          </span>
        </button>
      ) : (
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => {
            const rect = buttonRef.current?.getBoundingClientRect();
            if (rect) {
              setMenuPosition({
                left: rect.right + 12,
                bottom: Math.max(12, window.innerHeight - rect.bottom),
                arrowBottom: rect.height / 2,
              });
            }
            setMenuOpen(open => !open);
          }}
          className="flex w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 text-left shadow-sm transition-colors hover:bg-slate-50"
        >
          <img src={`${assets}/48c68.png`} alt="Raka Aditya" className="h-10 w-10 rounded-full object-cover" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-['Inter:Semi_Bold'] text-sm font-semibold text-slate-800">Raka Aditya</p>
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-indigo-950 px-2 py-0.5 font-['Inter:Bold'] text-[8px] font-bold text-white">
                Plus
                <PlusBadgeIcon size={10} />
              </span>
            </div>
            <p className="mt-0.5 font-['Inter:Regular'] text-xs text-slate-400">Manajemen · Semester 6</p>
          </div>
        </button>
      )}

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-[345]" onClick={() => setMenuOpen(false)} aria-hidden="true" />
          <div
            role="menu"
            className={`fixed z-[350] w-56 rounded-2xl border p-2 shadow-[0_12px_40px_rgba(0,0,0,0.13)] transition-colors ${
              isDarkMode
                ? "border-slate-700 bg-slate-900 text-slate-100"
                : "border-slate-200/90 bg-white text-slate-700"
            }`}
            style={{ left: menuPosition.left, bottom: menuPosition.bottom }}
          >
            {/* Ekor panah balon percakapan (speech bubble pointer) mengarah ke shape Raka Aditya */}
            <div
              className={`pointer-events-none absolute -left-[7px] h-3.5 w-3.5 rotate-45 rounded-bl-[2px] border-b border-l shadow-[-2px_2px_4px_rgba(0,0,0,0.04)] transition-colors ${
                isDarkMode
                  ? "border-slate-700 bg-slate-900"
                  : "border-slate-200/90 bg-white"
              }`}
              style={{ bottom: `${menuPosition.arrowBottom - 7}px` }}
              aria-hidden="true"
            />

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                window.alert("Profil Raka Aditya dibuka.");
                setMenuOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isDarkMode ? "text-slate-200 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Profil
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={onToggleDarkMode}
              className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isDarkMode ? "text-slate-200 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
                <span>{isDarkMode ? "Mode Terang" : "Mode Gelap"}</span>
              </div>
              <span className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${isDarkMode ? "bg-[#00629b]" : "bg-slate-200"}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${isDarkMode ? "translate-x-4.5" : "translate-x-0.5"}`} />
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Sidebar({
  view,
  onView,
  onUpgrade,
  onOpenRiwayat,
  riwayatItems,
  onRenameRiwayat,
  onDeleteRiwayat,
  onTogglePinRiwayat,
  activeRiwayatKey,
  onSelectRiwayatKey,
  isDarkMode,
  onToggleDarkMode,
}: {
  view: JournalView;
  onView: (view: JournalView) => void;
  onUpgrade: () => void;
  onOpenRiwayat: (item: RiwayatItem) => void;
  riwayatItems: RiwayatItem[];
  onRenameRiwayat: (index: number, label: string) => void;
  onDeleteRiwayat: (index: number) => void;
  onTogglePinRiwayat: (index: number) => void;
  activeRiwayatKey: string | null;
  onSelectRiwayatKey: (key: string | null) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}) {
  const assets = view === "collection" ? collectionAssets : searchAssets;
  const homeIcon = view === "collection" ? "62b0b.svg" : "b4a91.svg";
  const collectionIcon = view === "collection" ? "57aea.svg" : "6f1a2.svg";
  const items = riwayatItems.map(item => item.label);
  const [menuIndex, setMenuIndex] = useState<number | null>(null);
  const [menuCoords, setMenuCoords] = useState<{ top?: number; bottom?: number; right: number } | null>(null);
  const [hapusRiwayatIndex, setHapusRiwayatIndex] = useState<number | null>(null);
  const [gantiNamaRiwayatIndex, setGantiNamaRiwayatIndex] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden shrink-0 flex-col border-r border-slate-100 bg-white transition-all duration-300 md:flex ${
        collapsed ? "w-[76px] overflow-visible p-3" : "w-[280px] overflow-hidden p-5"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label={collapsed ? "Buka sidebar" : "Alerin Jurnal"}
          className={`group relative flex shrink-0 cursor-pointer items-center justify-center ${
            collapsed ? "h-11 w-11 rounded-xl" : "h-[52px] w-[52px]"
          }`}
        >
          <img
            src={`${assets}/24a8e.svg`}
            alt=""
            className={`transition-opacity duration-150 ${collapsed ? "h-11 w-11 group-hover:opacity-0" : "h-[44px] w-[44px]"}`}
          />
          {collapsed && (
            <>
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl text-slate-500 opacity-0 transition-opacity duration-150 group-hover:bg-sky-50 group-hover:text-sky-600 group-hover:opacity-100">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
                  <path d="M6 2.5v11" />
                  <path d="M10 6.5l-1.5 1.5 1.5 1.5" />
                </svg>
              </span>
              <span className="pointer-events-none absolute left-full top-1/2 z-[999] ml-3 -translate-y-1/2 whitespace-nowrap rounded-full border border-slate-200/90 bg-white px-4 py-2 text-sm font-semibold text-slate-800 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">Buka sidebar</span>
            </>
          )}
        </button>
        {!collapsed && (
          <div className="flex min-w-0 flex-1 items-center">
            <p className="truncate font-['Inter:Bold'] text-lg font-bold leading-6 text-slate-900">Alerin Jurnal</p>
          </div>
        )}
        {!collapsed && (
          <button
            type="button"
            aria-label="Perkecil sidebar"
            title="Perkecil sidebar"
            onClick={() => {
              setMenuIndex(null);
              setCollapsed(true);
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
              <path d="M6 2.5v11" />
            </svg>
          </button>
        )}
      </div>

      <nav className="mt-8 space-y-1">
        <button
          type="button"
          onClick={() => onView("home")}
          className={`group/nav relative flex w-full items-center gap-3.5 rounded-xl py-3 text-base ${
            collapsed ? "justify-center px-0" : "px-4"
          } ${view === "home" ? "bg-sky-100/80 font-semibold text-sky-600" : "font-medium text-slate-600"}`}
        >
          <img src={`${assets}/${homeIcon}`} alt="" />
          {!collapsed && "Beranda"}
          {collapsed && (
            <span className="pointer-events-none absolute left-full top-1/2 z-[999] ml-3 -translate-y-1/2 whitespace-nowrap rounded-full border border-slate-200/90 bg-white px-4 py-2 text-sm font-semibold text-slate-800 opacity-0 shadow-lg transition-opacity duration-200 group-hover/nav:opacity-100">Beranda</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => onView("collection")}
          className={`group/nav relative flex w-full items-center gap-3.5 rounded-xl py-3 text-base ${
            collapsed ? "justify-center px-0" : "px-4"
          } ${view === "collection" ? "bg-sky-100/80 font-semibold text-sky-600" : "font-medium text-slate-600"}`}
        >
          <img src={`${assets}/${collectionIcon}`} alt="" />
          {!collapsed && "Koleksi"}
          {collapsed && (
            <span className="pointer-events-none absolute left-full top-1/2 z-[999] ml-3 -translate-y-1/2 whitespace-nowrap rounded-full border border-slate-200/90 bg-white px-4 py-2 text-sm font-semibold text-slate-800 opacity-0 shadow-lg transition-opacity duration-200 group-hover/nav:opacity-100">Koleksi</span>
          )}
        </button>
      </nav>

      {!collapsed && (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <p className="mt-6 shrink-0 px-4 font-['Inter:Bold'] text-sm font-bold uppercase leading-5 tracking-wide text-slate-400">Riwayat</p>
          <div
            onScroll={() => {
              if (menuIndex !== null) {
                setMenuIndex(null);
                setMenuCoords(null);
              }
            }}
            className="mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
        {items.map((item, index) => {
          const itemKey = `${riwayatItems[index].type}:${riwayatItems[index].query.trim().toLowerCase()}`;
          const isItemActive = Boolean(activeRiwayatKey && activeRiwayatKey === itemKey);
          const isMenuOpen = menuIndex === index;
          return (
            <div
              key={`${index}-${item}`}
              onClick={() => {
                setMenuIndex(null);
                setMenuCoords(null);
                onSelectRiwayatKey(itemKey);
                onOpenRiwayat(riwayatItems[index]);
              }}
              className={`group relative flex w-full items-center justify-between gap-2 rounded-xl py-2 px-4 text-left text-xs leading-4 transition-colors cursor-pointer select-none outline-none focus:outline-none ring-0 focus:ring-0 border ${
                isItemActive
                  ? "border-[#00629b]/35 bg-[#f0f7ff] font-semibold text-[#004f80]"
                  : "border-transparent text-slate-600 hover:border-sky-200 hover:bg-[#f8fbff] hover:text-[#1e3a5f]"
              }`}
            >
              {/* Judul Riwayat di Kiri + Ikon Sematan */}
              <span className="min-w-0 flex-1 truncate pr-1 text-xs leading-4 flex items-center gap-1.5">
                {riwayatItems[index]?.pinned && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0070ba"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-label="Disematkan"
                    className="shrink-0 text-[#0070ba]"
                  >
                    <line x1="12" y1="17" x2="12" y2="22" />
                    <path d="M5 17h14v-1.76a2 2 0 0 0-.89-1.66l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1v3.76a2 2 0 0 1-.33.92l-1.78.9A2 2 0 0 0 5 15.24Z" />
                  </svg>
                )}
                <span className="truncate">{item}</span>
              </span>

              {/* Sisi Kanan: Kategori dan Titik Tiga bersih tanpa border/background kotak hitam */}
              <div className="flex shrink-0 items-center gap-1.5">
                {/* Tulisan Kategori */}
                <span
                  className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-bold leading-3 transition-colors cursor-pointer hover:opacity-90 active:scale-95 ${
                    isItemActive
                      ? "bg-[#00629b] text-white shadow-2xs"
                      : "bg-sky-50 text-sky-700"
                  }`}
                >
                  {riwayatItems[index].type === "review"
                    ? "Literature Review"
                    : riwayatItems[index].type === "map"
                      ? "Peta Penelitian"
                      : "Cari Jurnal"}
                </span>

                {/* Tombol Titik Tiga: berlatar shape putih saat muncul agar jelas */}
                <button
                  type="button"
                  aria-label={`Opsi untuk ${item}`}
                  onClick={event => {
                    event.stopPropagation();
                    if (isMenuOpen) {
                      setMenuIndex(null);
                      setMenuCoords(null);
                    } else {
                      const btn = event.currentTarget;
                      const btnRect = btn.getBoundingClientRect();
                      const spaceBelow = window.innerHeight - btnRect.bottom;
                      const rightOffset = Math.max(16, window.innerWidth - btnRect.right);

                      // Ketinggian menu dropdown ~180px.
                      // Jika sisa ruang di bawah tombol kurang dari 220px, posisikan ke atas agar tidak menabrak kartu Alerin Pro
                      if (spaceBelow < 220) {
                        setMenuCoords({
                          bottom: window.innerHeight - btnRect.top + 6,
                          right: rightOffset,
                        });
                      } else {
                        setMenuCoords({
                          top: btnRect.bottom + 6,
                          right: rightOffset,
                        });
                      }
                      setMenuIndex(index);
                    }
                  }}
                  className={`flex items-center justify-center rounded-md transition-all focus:outline-none outline-none ring-0 ${
                    isMenuOpen
                      ? "h-5 w-5 opacity-100 bg-white border border-slate-200/90 shadow-2xs text-slate-800"
                      : "h-5 w-0 opacity-0 overflow-hidden border-0 bg-transparent text-slate-500 hover:text-slate-900 group-hover:w-5 group-hover:opacity-100 group-hover:bg-white group-hover:border group-hover:border-slate-200/90 group-hover:shadow-2xs"
                  }`}
                >
                  <svg width="12" height="3" viewBox="0 0 14 4" fill="currentColor" aria-hidden="true">
                    <circle cx="2" cy="2" r="1.6" />
                    <circle cx="7" cy="2" r="1.6" />
                    <circle cx="12" cy="2" r="1.6" />
                  </svg>
                </button>
              </div>
            {menuIndex === index && menuCoords && (
              <>
                <div
                  className="fixed inset-0 z-[490]"
                  onClick={e => {
                    e.stopPropagation();
                    setMenuIndex(null);
                    setMenuCoords(null);
                  }}
                  aria-hidden="true"
                />
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    position: "fixed",
                    top: menuCoords.top !== undefined ? `${menuCoords.top}px` : undefined,
                    bottom: menuCoords.bottom !== undefined ? `${menuCoords.bottom}px` : undefined,
                    right: `${menuCoords.right}px`,
                  }}
                  className="z-[500] w-48 overflow-hidden rounded-2xl border border-slate-200/90 bg-white py-1.5 shadow-2xl transition-all"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setGantiNamaRiwayatIndex(index);
                      setMenuIndex(null);
                      setMenuCoords(null);
                    }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-slate-400">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
                    </svg>
                    Ganti nama
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onTogglePinRiwayat(index);
                      setMenuIndex(null);
                      setMenuCoords(null);
                    }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill={riwayatItems[index]?.pinned ? "#0070ba" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className={riwayatItems[index]?.pinned ? "text-[#0070ba]" : "text-slate-400"}
                    >
                      <line x1="12" y1="17" x2="12" y2="22" />
                      <path d="M5 17h14v-1.76a2 2 0 0 0-.89-1.66l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1v3.76a2 2 0 0 1-.33.92l-1.78.9A2 2 0 0 0 5 15.24Z" />
                    </svg>
                    {riwayatItems[index]?.pinned ? "Lepas sematan" : "Sematkan"}
                  </button>
                  <div className="mx-3 my-1 border-t border-slate-100" />
                  <button
                    type="button"
                    onClick={() => {
                      setHapusRiwayatIndex(index);
                      setMenuIndex(null);
                      setMenuCoords(null);
                    }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-rose-400">
                      <path d="M3 6h18" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    </svg>
                    Hapus
                  </button>
                </div>
              </>
            )}
          </div>
          );
        })}
          </div>
        </div>
      )}

      {collapsed ? (
        <div className="mt-auto flex flex-col items-center gap-3">
          <button
            type="button"
            aria-label="Upgrade Sekarang"
            onClick={onUpgrade}
            className="group/nav relative flex h-11 w-11 items-center justify-center rounded-xl border border-amber-200/90 bg-gradient-to-br from-amber-50/70 via-blue-50/50 to-indigo-50/60 text-amber-500 shadow-[0_-3px_10px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] transition-colors hover:bg-amber-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l2.9 6.26L21.5 9.3l-4.75 4.63 1.12 6.57L12 17.4l-5.87 3.1 1.12-6.57L2.5 9.3l6.6-1.04L12 2z" />
            </svg>
            <span className="pointer-events-none absolute left-full top-1/2 z-[999] ml-3 -translate-y-1/2 whitespace-nowrap rounded-full border border-slate-200/90 bg-white px-4 py-2 text-sm font-semibold text-slate-800 opacity-0 shadow-lg transition-opacity duration-200 group-hover/nav:opacity-100">Upgrade Sekarang</span>
          </button>
          <ProfileCard
            collection={view === "collection"}
            isDarkMode={isDarkMode}
            onToggleDarkMode={onToggleDarkMode}
            collapsed={true}
          />
        </div>
      ) : (
        <>
          <div className="mt-auto rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/70 via-blue-50/50 to-indigo-50/60 p-4 shadow-[0_-4px_16px_-1px_rgba(0,0,0,0.08),0_2px_8px_-1px_rgba(0,0,0,0.04)]">
            <p className="text-center text-xs leading-4 text-slate-600">
              Akses lebih banyak penggunaan dengan <span className="text-center text-blue-700">Alerin Pro</span>
            </p>
            <button
              type="button"
              onClick={onUpgrade}
              className="mt-3.5 w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-600 shadow-sm hover:bg-blue-50"
            >
              Upgrade Sekarang
            </button>
          </div>
          <div className="mt-3">
            <ProfileCard collection={view === "collection"} isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} />
          </div>
        </>
      )}

      <HapusRiwayatModal
        open={hapusRiwayatIndex !== null}
        title={hapusRiwayatIndex !== null ? items[hapusRiwayatIndex] : ""}
        onClose={() => setHapusRiwayatIndex(null)}
        onConfirm={() => {
          if (hapusRiwayatIndex !== null) {
            const deletedKey = `${riwayatItems[hapusRiwayatIndex].type}:${riwayatItems[hapusRiwayatIndex].query.trim().toLowerCase()}`;
            if (activeRiwayatKey === deletedKey) {
              onSelectRiwayatKey(null);
            }
            onDeleteRiwayat(hapusRiwayatIndex);
            setHapusRiwayatIndex(null);
          }
        }}
      />

      <GantiNamaRiwayatModal
        open={gantiNamaRiwayatIndex !== null}
        currentName={gantiNamaRiwayatIndex !== null ? items[gantiNamaRiwayatIndex] : ""}
        onClose={() => setGantiNamaRiwayatIndex(null)}
        onSave={newName => {
          if (gantiNamaRiwayatIndex !== null) {
            onRenameRiwayat(gantiNamaRiwayatIndex, newName);
            setGantiNamaRiwayatIndex(null);
          }
        }}
      />
    </aside>
  );
}

const metodeGroups = [
  { name: "Eksperimental", items: ["Uji acak terkontrol (RCT)", "Eksperimen nonacak", "Eksperimen laboratorium", "Eksperimen in vitro"] },
  {
    name: "Observasional",
    items: [
      "Studi lapangan",
      "Studi potong lintang",
      "Studi kohort",
      "Studi longitudinal/panel",
      "Studi kasus-kontrol",
      "Studi kasus",
      "Laporan kasus",
      "Studi wawancara",
      "Metode campuran",
    ],
  },
  { name: "Sintesis bukti", items: ["Tinjauan sistematis", "Meta-analisis", "Tinjauan literatur"] },
  { name: "Lainnya", items: ["Studi simulasi", "Artikel komentar", "Analisis historis"] },
];

const bidangStudi = [
  "Bisnis dan manajemen",
  "Ilmu sosial",
  "Pendidikan",
  "Kesehatan",
  "Kedokteran",
  "Ilmu komputer",
  "Teknik dan rekayasa",
  "Ekonomi dan keuangan",
  "Psikologi",
  "Hukum",
  "Ilmu lingkungan",
  "Pertanian dan perikanan",
  "Biologi",
  "Fisika",
  "Kimia",
  "Matematika",
  "Seni dan humaniora",
  "Ilmu komunikasi",
  "Ilmu politik",
  "Farmasi",
  "Arsitektur",
  "Linguistik dan sastra",
  "Filsafat",
];
const negaraPenelitian = [
  "Semua Negara",
  "Indonesia",
  "Amerika Serikat",
  "China",
  "Inggris",
  "Jerman",
];
const pilihanTahun = ["Semua", "2 tahun terakhir", "5 tahun terakhir", "10 tahun terakhir"];

const tahunSekarang = new Date().getFullYear();

const rentangTahun: Record<string, [string, string]> = {
  Semua: ["", ""],
  "2 tahun terakhir": [String(tahunSekarang - 2), String(tahunSekarang)],
  "5 tahun terakhir": [String(tahunSekarang - 5), String(tahunSekarang)],
  "10 tahun terakhir": [String(tahunSekarang - 10), String(tahunSekarang)],
};

function FilterCheck({
  checked,
  label,
  onToggle,
  bold = false,
  radio = false,
}: {
  checked: boolean;
  label: string;
  onToggle: () => void;
  bold?: boolean;
  radio?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      role={radio ? "radio" : "checkbox"}
      aria-checked={checked}
      className="group flex w-full items-center gap-2.5 rounded-lg py-1 px-1 text-left transition-colors hover:bg-sky-50/50 -mx-1"
    >
      <span
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center transition-all ${
          radio ? "rounded-full" : "rounded-[5px]"
        } border-2 ${
          checked ? "border-[#0369a1] bg-[#0369a1]" : "border-slate-300 bg-white group-hover:border-sky-500 group-hover:bg-sky-50/50"
        }`}
      >
        {checked && (
          radio ? (
            <span className="h-2 w-2 rounded-full bg-white" />
          ) : (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.5 6.5l2.5 2.5 4.5-5.5" />
            </svg>
          )
        )}
      </span>
      <span className={`text-sm leading-5 transition-colors ${bold ? "font-semibold text-slate-800 group-hover:text-sky-950" : "text-slate-600 group-hover:text-slate-900"}`}>{label}</span>
    </button>
  );
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
  badge,
  bordered = true,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  badge?: number;
  bordered?: boolean;
}) {
  return (
    <section className={`pb-3 ${bordered ? "mb-3 border-b border-slate-200" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors ${
          open ? "border-sky-200 bg-sky-50/70" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
        }`}
      >
        <span className="flex items-center gap-2">
          <span className={`text-[15px] font-bold ${open ? "text-[#0369a1]" : "text-slate-900"}`}>{title}</span>
          {badge && badge > 0 ? (
            <span className="rounded-full bg-[#0369a1] px-2 py-0.5 text-[11px] font-semibold leading-4 text-white">{badge}</span>
          ) : null}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke={open ? "#0369a1" : "#64748b"}
          strokeWidth="1.6"
          strokeLinecap="round"
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>
      {open && <div className="flex flex-col gap-3.5 px-1 pb-1 pt-3.5">{children}</div>}
    </section>
  );
}

function FilterPanel({ open, onClose, onApply, onReset }: { open: boolean; onClose: () => void; onApply: () => void; onReset: () => void }) {
  const [tahun, setTahun] = useState("Semua");
  const [tahunAwal, setTahunAwal] = useState(rentangTahun["Semua"][0]);
  const [tahunAkhir, setTahunAkhir] = useState(rentangTahun["Semua"][1]);
  const [aksesTerbuka, setAksesTerbuka] = useState(true);
  const [metode, setMetode] = useState<Record<string, string[]>>({});
  const [bidang, setBidang] = useState<Record<string, boolean>>({});
  const [negara, setNegara] = useState<Record<string, boolean>>({});
  const [sections, setSections] = useState<Record<string, boolean>>({ umum: true, metodologi: false, bidang: false, negara: false });
  const [bidangTambahan, setBidangTambahan] = useState<string[]>([]);
  const [negaraTambahan, setNegaraTambahan] = useState<string[]>([]);
  const [bidangSearch, setBidangSearch] = useState("");
  const [bidangDropdownOpen, setBidangDropdownOpen] = useState(false);
  const bidangDropdownRef = useRef<HTMLDivElement>(null);
  const [negaraLain, setNegaraLain] = useState("");
  const [negaraLainOpen, setNegaraLainOpen] = useState(false);

  useEffect(() => {
    if (!bidangDropdownOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (bidangDropdownRef.current && !bidangDropdownRef.current.contains(event.target as Node)) {
        setBidangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [bidangDropdownOpen]);

  const selectedBidang = Object.keys(bidang).find(key => bidang[key]) || null;
  const allBidangList = useMemo(() => Array.from(new Set([...bidangStudi, ...bidangTambahan])), [bidangTambahan]);
  const filteredBidang = useMemo(
    () => allBidangList.filter(item => item.toLowerCase().includes(bidangSearch.toLowerCase().trim())),
    [allBidangList, bidangSearch]
  );

  const toggleSection = (key: string) => setSections(current => ({ ...current, [key]: !current[key] }));

  const toggleMetodeItem = (group: string, item: string) =>
    setMetode(current => {
      const selected = current[group] ?? [];
      return { ...current, [group]: selected.includes(item) ? selected.filter(value => value !== item) : [...selected, item] };
    });

  const groupChecked = (group: string) => (metode[group]?.length ?? 0) > 0;

  const tambahOpsi = (
    value: string,
    daftar: string[],
    setDaftar: (next: string[]) => void,
    setTerpilih: (updater: (current: Record<string, boolean>) => Record<string, boolean>) => void,
    reset: () => void,
  ) => {
    const trimmed = value.trim();
    if (!trimmed || daftar.includes(trimmed)) return;
    setDaftar([...daftar, trimmed]);
    setTerpilih(current => ({ ...current, [trimmed]: true }));
    reset();
  };

  const pilihRentangTahun = (option: string) => {
    setTahun(option);
    const rentang = rentangTahun[option];
    if (rentang) {
      setTahunAwal(rentang[0]);
      setTahunAkhir(rentang[1]);
    }
  };

  const toggleNegara = (item: string) => {
    if (item === "Semua Negara") {
      setNegara(current => {
        if (current["Semua Negara"]) {
          return {} as Record<string, boolean>;
        }
        return { "Semua Negara": true };
      });
    } else {
      setNegara(current => {
        const nextState = { ...current };
        delete nextState["Semua Negara"];
        if (nextState[item]) {
          delete nextState[item];
        } else {
          nextState[item] = true;
        }
        return nextState;
      });
    }
  };

  const tambahNegara = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed || negaraTambahan.includes(trimmed) || negaraPenelitian.includes(trimmed)) return;
    setNegaraTambahan(curr => [...curr, trimmed]);
    setNegara(current => {
      const next = { ...current };
      delete next["Semua Negara"];
      next[trimmed] = true;
      return next;
    });
    setNegaraLain("");
    setNegaraLainOpen(false);
  };

  const handleReset = () => {
    setTahun("Semua");
    setTahunAwal("");
    setTahunAkhir("");
    setAksesTerbuka(false);
    setMetode({});
    setBidang({});
    setNegara({});
    setBidangSearch("");
    setBidangDropdownOpen(false);
  };

  const metodeCount = Object.values(metode).reduce((sum, list) => sum + list.length, 0);
  const bidangCount = Object.values(bidang).filter(Boolean).length;
  const negaraCount = Boolean(negara["Semua Negara"])
    ? 1
    : Object.values(negara).filter(Boolean).length;
  const activeCount = (tahun !== "Semua" ? 1 : 0) + metodeCount + bidangCount + negaraCount;

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[450] bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label="Filter jurnal"
        className={`fixed right-0 top-0 z-[460] flex h-dvh w-full flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 sm:max-w-[420px] sm:rounded-l-[26px] sm:border-l sm:border-slate-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 bg-white px-6 py-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
          <div>
            <h2 className="text-xl font-bold leading-7 text-slate-900">Filter jurnal</h2>
            <p className="mt-0.5 text-sm leading-5 text-slate-500">
              {activeCount > 0 ? `${activeCount} filter aktif` : "Sesuaikan hasil penelusuranmu"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Tutup filter"
            onClick={onClose}
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <FilterSection title="Umum" open={sections.umum} onToggle={() => toggleSection("umum")}>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium leading-5 text-slate-700">Tahun terbit</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {pilihanTahun.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => pilihRentangTahun(option)}
                    className={`rounded-full px-3.5 py-1.5 text-sm leading-5 transition-all cursor-pointer ${
                      tahun === option
                        ? "border-2 border-[#0369a1] bg-[#0369a1] font-semibold text-white shadow-sm"
                        : "border-[1.5px] border-slate-300 bg-white font-medium text-slate-700 hover:border-sky-500 hover:bg-sky-50 hover:text-sky-700 hover:shadow-xs active:scale-95"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2.5">
                <input
                  value={tahunAwal}
                  onChange={event => {
                    const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
                    if (digits.length === 4 && Number(digits) > 2026) {
                      setTahunAwal("2026");
                      return;
                    }
                    setTahunAwal(digits);
                  }}
                  onKeyDown={event => {
                    if (
                      !/^[0-9]$/.test(event.key) &&
                      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(event.key) &&
                      !event.ctrlKey &&
                      !event.metaKey
                    ) {
                      event.preventDefault();
                    }
                  }}
                  onBlur={() => {
                    if (tahunAwal && (tahunAwal.length < 4 || Number(tahunAwal) > 2026)) {
                      setTahunAwal(Number(tahunAwal) > 2026 ? "2026" : "2020");
                    }
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  placeholder="2020"
                  aria-label="Tahun awal"
                  className="h-10 w-32 rounded-xl border-2 border-slate-300/90 bg-white px-3 text-center text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-sky-400 focus:border-[#0369a1] focus:ring-2 focus:ring-sky-100"
                />
                <span className="shrink-0 text-sm font-medium text-slate-400">s/d</span>
                <input
                  value={tahunAkhir}
                  onChange={event => {
                    const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
                    if (digits.length === 4 && Number(digits) > 2026) {
                      setTahunAkhir("2026");
                      return;
                    }
                    setTahunAkhir(digits);
                  }}
                  onKeyDown={event => {
                    if (
                      !/^[0-9]$/.test(event.key) &&
                      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(event.key) &&
                      !event.ctrlKey &&
                      !event.metaKey
                    ) {
                      event.preventDefault();
                    }
                  }}
                  onBlur={() => {
                    if (tahunAkhir && (tahunAkhir.length < 4 || Number(tahunAkhir) > 2026)) {
                      setTahunAkhir(Number(tahunAkhir) > 2026 ? "2026" : "2026");
                    }
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  placeholder="2026"
                  aria-label="Tahun akhir"
                  className="h-10 min-w-0 flex-1 rounded-xl border-2 border-slate-300/90 bg-white px-3 text-center text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-sky-400 focus:border-[#0369a1] focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border-[1.5px] border-slate-300 bg-white px-3.5 py-3 transition-colors hover:border-sky-300">
              <span className="text-sm font-medium text-slate-700">Hanya akses terbuka</span>
              <button
                type="button"
                role="switch"
                aria-checked={aksesTerbuka}
                onClick={() => setAksesTerbuka(value => !value)}
                className={`flex h-6 w-11 shrink-0 rounded-full p-0.5 border transition-all ${
                  aksesTerbuka
                    ? "border-[#0369a1] bg-[#0369a1]"
                    : "border-slate-300 bg-slate-200 hover:border-sky-400 hover:bg-slate-300"
                }`}
              >
                <span className={`h-5 w-5 rounded-full border border-white bg-white shadow transition-transform ${aksesTerbuka ? "translate-x-5" : ""}`} />
              </button>
            </div>
            </div>
          </FilterSection>

          <FilterSection
            title="Metodologi"
            badge={metodeCount}
            open={sections.metodologi}
            onToggle={() => toggleSection("metodologi")}
          >
            <p className="text-sm leading-5 text-slate-500">Pilih jenis desain penelitian hingga tingkat yang lebih spesifik.</p>
            {metodeGroups.map(group => (
              <div
                key={group.name}
                className={`rounded-2xl border-[1.5px] p-3.5 transition-colors ${
                  groupChecked(group.name) ? "border-sky-300 bg-sky-50/60" : "border-slate-300 bg-white hover:border-slate-400"
                }`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                  <FilterCheck
                    bold
                    checked={(metode[group.name]?.length ?? 0) === group.items.length}
                    label={group.name}
                    onToggle={() =>
                      setMetode(current => ({
                        ...current,
                        [group.name]: (current[group.name]?.length ?? 0) === group.items.length ? [] : [...group.items],
                      }))
                    }
                  />
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium leading-4 text-slate-500">
                    {group.items.length} jenis
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 pl-7 pt-2.5">
                  {group.items.map(item => (
                    <FilterCheck
                      key={item}
                      checked={(metode[group.name] ?? []).includes(item)}
                      label={item}
                      onToggle={() => toggleMetodeItem(group.name, item)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </FilterSection>

          <FilterSection title="Bidang Studi" badge={bidangCount} open={sections.bidang} onToggle={() => toggleSection("bidang")}>
            <div ref={bidangDropdownRef} className="relative">
              {/* Selected badge if any */}
              {selectedBidang && (
                <div className="mb-2.5 flex items-center justify-between rounded-xl border border-sky-200 bg-sky-50/80 px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0369a1] text-white">
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3.5 8.5l3 3 6-6" />
                      </svg>
                    </span>
                    <span className="truncate text-xs font-semibold text-sky-950">{selectedBidang}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBidang({})}
                    className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-sky-700 transition-colors hover:bg-sky-200/60 hover:text-sky-950"
                    aria-label="Hapus pilihan bidang studi"
                    title="Hapus pilihan"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M4 4l8 8M12 4l-8 8" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Search bar input with dropdown toggle */}
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={bidangSearch}
                  onChange={e => {
                    setBidangSearch(capitalizeFirstLetter(e.target.value));
                    if (!bidangDropdownOpen) setBidangDropdownOpen(true);
                  }}
                  onFocus={() => setBidangDropdownOpen(true)}
                  placeholder={selectedBidang ? "Cari untuk ganti bidang studi..." : "Cari dan pilih bidang studi..."}
                  className="w-full rounded-xl border-[1.5px] border-slate-300 bg-white py-2.5 pl-9 pr-16 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-colors hover:border-sky-400 focus:border-[#0369a1] focus:ring-2 focus:ring-[#0369a1]/15"
                />
                <div className="absolute right-2 flex items-center gap-0.5">
                  {bidangSearch && (
                    <button
                      type="button"
                      onClick={() => setBidangSearch("")}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      aria-label="Bersihkan pencarian"
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M4 4l8 8M12 4l-8 8" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setBidangDropdownOpen(prev => !prev)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-transform"
                    aria-label="Buka/tutup daftar bidang studi"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-200 ${bidangDropdownOpen ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Dropdown list */}
              {bidangDropdownOpen && (
                <div className="mt-1.5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg animate-in fade-in-50 duration-150">
                  <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5">
                    {filteredBidang.length > 0 ? (
                      filteredBidang.map(item => {
                        const isItemActive = Boolean(bidang[item]);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setBidang(current => (current[item] ? {} : { [item]: true }));
                              setBidangSearch("");
                              setBidangDropdownOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                              isItemActive
                                ? "bg-sky-50 font-semibold text-[#0369a1]"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span>{item}</span>
                            {isItemActive && (
                              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#0369a1]">
                                <path d="M3.5 8.5l3 3 6-6" />
                              </svg>
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-3 py-2.5 text-center text-xs text-slate-500">
                        Tidak ada bidang studi yang cocok dengan &quot;{bidangSearch}&quot;
                      </div>
                    )}

                    {/* Option to add custom bidang if search does not match existing */}
                    {bidangSearch.trim() && !allBidangList.some(b => b.toLowerCase() === bidangSearch.trim().toLowerCase()) && (
                      <div className="border-t border-slate-100 pt-1 mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const trimmed = bidangSearch.trim();
                            if (trimmed) {
                              if (!bidangTambahan.includes(trimmed) && !bidangStudi.includes(trimmed)) {
                                setBidangTambahan(curr => [...curr, trimmed]);
                              }
                              setBidang({ [trimmed]: true });
                              setBidangSearch("");
                              setBidangDropdownOpen(false);
                            }
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-[#0369a1] hover:bg-sky-50"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                          Gunakan &quot;{bidangSearch.trim()}&quot; sebagai bidang studi
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </FilterSection>

          <FilterSection
            title="Negara Penelitian"
            badge={negaraCount}
            open={sections.negara}
            onToggle={() => toggleSection("negara")}
            bordered={false}
          >
            <div className="flex flex-col gap-1.5 rounded-2xl border-[1.5px] border-slate-300 bg-white p-3.5">
              {negaraPenelitian.map(item => (
                <FilterCheck
                  key={item}
                  bold
                  checked={Boolean(negara[item])}
                  label={item}
                  onToggle={() => toggleNegara(item)}
                />
              ))}
              {negaraTambahan.map(item => (
                <FilterCheck
                  key={item}
                  bold
                  checked={Boolean(negara[item])}
                  label={item}
                  onToggle={() => toggleNegara(item)}
                />
              ))}
              {negaraLainOpen ? (
                <div className="mt-1 flex gap-2">
                  <input
                    autoFocus
                    value={negaraLain}
                    onChange={event => setNegaraLain(capitalizeFirstLetter(event.target.value))}
                    onKeyDown={event => {
                      if (event.key !== "Enter") return;
                      event.preventDefault();
                      tambahNegara(negaraLain);
                    }}
                    placeholder="Tulis negara penelitian selanjutnya"
                    className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-800 outline-none focus:border-[#0369a1]"
                  />
                  <button
                    type="button"
                    onClick={() => tambahNegara(negaraLain)}
                    className="shrink-0 rounded-lg bg-[#0369a1] px-3 py-2 text-sm font-semibold text-white"
                  >
                    Tambah
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setNegaraLainOpen(true)}
                  className="mt-1 flex items-center gap-1.5 rounded-lg px-1 py-1.5 text-sm font-semibold text-[#0369a1]"
                >
                  + Opsi lainnya
                </button>
              )}
            </div>
          </FilterSection>
        </div>

        <footer className="flex shrink-0 items-center gap-3 border-t border-slate-200 bg-white/95 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur">
          <button
            type="button"
            onClick={() => {
              onApply();
              onClose();
            }}
            className="min-w-0 flex-1 rounded-xl bg-[#0369a1] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#075985]"
          >
            Terapkan filter
          </button>
          <button
            type="button"
            onClick={() => {
              handleReset();
              onReset();
            }}
            className="shrink-0 whitespace-nowrap rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Atur ulang
          </button>
        </footer>
      </aside>
    </>
  );
}

const premiumFeatures = [
  {
    title: "Sintesis Literatur & Matriks",
    desc: "Ekspor otomatis ke Word & Excel matriks telaah",
    gratis: "—",
    plus: "check",
    pro: "check",
  },
  {
    title: "Akses Basis Data Bereputasi",
    desc: "Crossref, OpenAlex & basis data terverifikasi Alerin",
    gratis: "10/hari",
    plus: "Unlimited",
    pro: "Unlimited + API",
  },
  {
    title: "Deteksi Klaim & Validasi Sitasi",
    desc: "Cek akurasi argumen naskah & anti halusinasi AI",
    gratis: "—",
    plus: "check",
    pro: "check",
  },
  {
    title: "Peta Riset Bibliometrik (Research Gap)",
    desc: "Visualisasi klaster topik & kebaruan studi",
    gratis: "—",
    plus: "check",
    pro: "check",
  },
  {
    title: "Kuota Analisis Naskah & PDF",
    desc: "Kapasitas pembacaan dokumen bab riset",
    gratis: "1 Jurnal/sesi",
    plus: "Hingga 30 Jurnal",
    pro: "Hingga 80 Jurnal",
  },
];

const premiumFeatureIcons: ReactNode[] = [
  <svg key="sintesis" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>,
  <svg key="database" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
    <rect x="3.5" y="2" width="9" height="12" rx="1.5" />
    <path d="M6 5.5h4M6 8h4M6 10.5h3" />
  </svg>,
  <svg key="deteksi" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 1.5l5 2v4.2c0 3-2.1 5.3-5 6.3-2.9-1-5-3.3-5-6.3V3.5l5-2z" />
    <path d="M5.8 8l1.6 1.6 2.8-3" />
  </svg>,
  <svg key="peta" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
    <path d="M3 13V7M8 13V3M13 13V9" />
  </svg>,
  <svg key="kuota" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 1.5h5l3 3v10H4z" />
    <path d="M9 1.5v3h3" />
    <path d="M6.5 9.5l1.5 1.5 2.5-2.5" />
  </svg>,
];

type PlanKey = "gratis" | "plus" | "pro";

interface JournalPlanFeature {
  icon: ReactNode;
  desc: Record<PlanKey, string>;
}

const journalPlanFeatures: JournalPlanFeature[] = [
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="7" cy="7" r="4.5" />
        <path d="M10.5 10.5L14 14" />
      </svg>
    ),
    desc: {
      gratis: "Cari Jurnal, Literature Review dan Peta Penelitian untuk mulai riset",
      plus: "Kuota Cari Jurnal, Literature Review dan Peta Penelitian lebih besar",
      pro: "Akses Cari Jurnal, Literature Review dan Peta Penelitian paling tinggi",
    },
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2.5 3.5h4.2c.7 0 1.3.6 1.3 1.3v8.7c0-.7-.6-1.3-1.3-1.3H2.5z" />
        <path d="M13.5 3.5H9.3c-.7 0-1.3.6-1.3 1.3v8.7c0-.7.6-1.3 1.3-1.3h4.2z" />
      </svg>
    ),
    desc: {
      gratis: "Literature Review dengan cakupan hingga 100 jurnal",
      plus: "Literature Review dengan cakupan hingga 500 jurnal",
      pro: "Literature Review dengan analisis jurnal paling maksimal",
    },
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="4" cy="5" r="2" />
        <circle cx="12" cy="4" r="1.5" />
        <circle cx="9" cy="11.5" r="2.5" />
        <path d="M5.8 5.8l4.5 4M10.8 5.2l-2 4.5" />
      </svg>
    ),
    desc: {
      gratis: "Analisis Peta Penelitian hingga 100 jurnal",
      plus: "Analisis Peta Penelitian hingga 500 jurnal",
      pro: "Analisis Peta Penelitian dengan pemetaan jurnal tanpa batas",
    },
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
        <path d="M2.5 6.5h11M7 6.5v7" />
      </svg>
    ),
    desc: {
      gratis: "Bandingkan jurnal dalam tabel penelitian terdahulu",
      plus: "Bandingkan lebih banyak jurnal dalam tabel penelitian",
      pro: "Kapasitas perbandingan jurnal terbesar dalam tabel penelitian",
    },
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2.5 4h11M2.5 7.5h11M2.5 11h7" />
      </svg>
    ),
    desc: {
      gratis: "Temukan jurnal relevan berdasarkan paragraf",
      plus: "Pencarian berbasis paragraf dengan input lebih panjang",
      pro: "Pencarian berbasis paragraf dengan kapasitas input terbesar",
    },
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2.5 10.5v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2" />
        <path d="M8 2.5v7M5 5.5l3-3 3 3" />
      </svg>
    ),
    desc: {
      gratis: "Pencarian jurnal melalui unggahan file hingga 5 MB",
      plus: "Pencarian jurnal melalui unggahan file hingga 20 MB",
      pro: "Pencarian jurnal melalui unggahan file hingga 30 MB",
    },
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 2.5h10v11l-5-2.5-5 2.5v-11z" />
      </svg>
    ),
    desc: {
      gratis: "Simpan jurnal pilihan dalam koleksi pribadi",
      plus: "Kapasitas koleksi jurnal lebih besar",
      pro: "Kapasitas koleksi pribadi terbesar",
    },
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 1.5l1.8 3.8 4.2.6-3 3 .7 4.1L8 11l-3.7 2 .7-4.1-3-3 4.2-.6z" />
      </svg>
    ),
    desc: {
      gratis: "Dapatkan rekomendasi jurnal sesuai topik riset",
      plus: "Lebih banyak rekomendasi jurnal sesuai topik riset",
      pro: "Pilihan rekomendasi jurnal paling banyak",
    },
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2.5 8a5.5 5.5 0 0 1 9.39-3.89L13.5 5.5M13.5 2v3.5H10" />
        <path d="M13.5 8a5.5 5.5 0 0 1-9.39 3.89L2.5 10.5M2.5 14v-3.5H6" />
      </svg>
    ),
    desc: {
      gratis: "Perbarui rekomendasi untuk menjelajahi referensi lainnya",
      plus: "Pembaruan rekomendasi lebih sering",
      pro: "Kuota pembaruan rekomendasi tertinggi",
    },
  },
];

function UpgradePremiumModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("plus");
  const activePlanKey: PlanKey = "plus";

  if (!open) return null;

  const plans: { key: PlanKey; title: string; subtitle: string }[] = [
    { key: "gratis", title: "Gratis", subtitle: "Mulai perjalanan riset lebih dalam" },
    { key: "plus", title: "Plus", subtitle: "Kembangkan riset dengan akses lebih luas" },
    { key: "pro", title: "Pro", subtitle: "Akses terluas untuk kedalaman riset tingkat lanjut" },
  ];

  return (
    <div
      className="fixed inset-0 z-[360] flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-[2px] transition-opacity duration-200"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Pilih Paket"
        onClick={event => event.stopPropagation()}
        className="relative flex max-h-[88dvh] sm:max-h-[92dvh] w-full max-w-[580px] flex-col overflow-hidden rounded-2xl sm:rounded-[28px] bg-white p-4.5 sm:p-6 md:p-8 shadow-2xl transition-all"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-1">
          <h2 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl md:text-[26px]">
            Pilih Paket
          </h2>
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {/* 3 Kartu Paket */}
        <div className="mt-3.5 sm:mt-5 grid grid-cols-3 gap-2 sm:gap-2.5">
          {plans.map(plan => {
            const isSelected = selectedPlan === plan.key;
            const isCurrentActive = plan.key === activePlanKey;
            return (
              <button
                key={plan.key}
                type="button"
                onClick={() => setSelectedPlan(plan.key)}
                className={`relative flex flex-col justify-between rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#111827] text-white shadow-sm ring-1 ring-slate-900"
                    : "border border-slate-200/90 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50/60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h3 className={`text-[13px] sm:text-base font-bold leading-tight ${isSelected ? "text-white" : "text-slate-900"}`}>
                      {plan.title}
                    </h3>
                    {isCurrentActive && (
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold tracking-wide ${
                          isSelected
                            ? "bg-white/20 text-slate-100"
                            : "border border-slate-200 bg-slate-100 text-slate-700"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Aktif
                      </span>
                    )}
                  </div>
                  <p className={`mt-1 text-[10.5px] sm:text-xs leading-[14px] sm:leading-4 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                    {plan.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* List Fitur / Baris Spesifikasi (Scrollable dengan scrollbar samping yang terlihat jelas) */}
        <div className="modal-custom-scrollbar mt-3.5 sm:mt-5 min-h-0 flex-1 overflow-y-auto pr-2 sm:pr-2.5 pb-4">
          <div className="divide-y divide-slate-100">
            {journalPlanFeatures.map((feat, index) => {
              const text = feat.desc[selectedPlan];
              return (
                <div key={index} className="flex items-center gap-3 py-2.5 first:pt-1 sm:gap-3.5 sm:py-3">
                  <span className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl border border-slate-200/80 bg-white text-slate-700 shadow-2xs">
                    {feat.icon}
                  </span>
                  <p className="min-w-0 flex-1 text-[13px] sm:text-sm font-semibold text-slate-800 leading-snug">
                    {text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Tombol Aksi (Full width di mobile, rapi dan mudah ditekan) */}
        <div className="mt-3 sm:mt-5 flex items-center justify-end border-t border-slate-100 pt-3 sm:pt-4">
          {selectedPlan === activePlanKey ? (
            <button
              type="button"
              disabled
              className="flex w-full sm:w-auto min-h-[44px] items-center justify-center gap-2 rounded-xl bg-slate-100 px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-500 cursor-default"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3.5 8.5l3 3 6-6" />
              </svg>
              Paket Saat Ini
            </button>
          ) : selectedPlan === "pro" ? (
            <button
              type="button"
              onClick={() => {
                window.alert("Upgrade ke Paket Pro Alerin Jurnal diproses.");
                onClose();
              }}
              className="flex w-full sm:w-auto min-h-[44px] items-center justify-center gap-2 rounded-xl bg-black px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-neutral-800 active:scale-98 cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
              </svg>
              Upgrade Paket
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                window.alert("Pilihan paket Gratis disimpan.");
                onClose();
              }}
              className="flex w-full sm:w-auto min-h-[44px] items-center justify-center gap-2 rounded-xl bg-black px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-neutral-800 active:scale-98 cursor-pointer"
            >
              Pilih Paket
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function UpgradePremiumSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Disatukan dengan UpgradePremiumModal yang sudah responsif untuk semua layar
  return null;
}

function JournalCard({
  journal,
  folders,
  onMove,
  onRemove,
  onSitasi,
  onAbstrak,
  onDetail,
  onDiskusikan,
}: {
  journal: SavedJournal;
  folders: CollectionFolder[];
  onMove: (folderId: string) => void;
  onRemove: () => void;
  onSitasi: () => void;
  onAbstrak: () => void;
  onDetail: () => void;
  onDiskusikan?: (template: string) => void;
}) {
  const activeFolder = folders.find(folder => folder.id === journal.folderId);
  const [note, setNote] = useState(() => {
    try {
      return window.localStorage.getItem(`alerin-journal-note-${journal.id}`) ?? "";
    } catch {
      return "";
    }
  });
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  return (
    <article className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{journal.year}</span>
        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs text-[#0066a1]">Akses Terbuka</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{journal.relevancy} relevan</span>
      </div>
      <h3 className="mt-4 font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold leading-6 text-[#0f172a]">{journal.title}</h3>
      <p className="mt-1 font-['Inter:Regular'] text-sm text-[#94a3b8]">{journal.authors}</p>
      <p className="mt-4 font-['Inter:Regular'] text-sm leading-6 text-[#64748b]">{journal.description}</p>
      <div className="mt-4 rounded-xl bg-[#eaf6ff] px-4 py-3 text-sm leading-6 text-[#475569]">
        <strong className="font-['Inter:Bold'] text-[#0066a1]">Alasan direkomendasikan:</strong>{" "}
        {journal.id === "saved-2"
          ? "Cocok sebagai pembanding temuan dan rujukan metode meta-analisis."
          : "Cocok untuk memperkuat landasan teori dan hubungan antarvariabel."}
      </div>
      <label className="mt-4 block min-h-24 cursor-text rounded-xl border border-slate-200 bg-[#f1f5f9] p-4 transition-colors focus-within:border-sky-300 focus-within:bg-white">
        <div className="flex items-center justify-between">
          <span className="block font-['Plus_Jakarta_Sans:Bold'] text-base font-bold text-[#1e293b]">Catatan Pribadi</span>
          {isSavedNotice ? (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8.5l3.5 3.5 6.5-7" />
              </svg>
              Tersimpan
            </span>
          ) : (
            <span className="text-xs font-normal text-slate-400">
              Menyimpan Otomatis
            </span>
          )}
        </div>
        <textarea
          value={note}
          onChange={event => {
            const formatted = capitalizeFirstLetter(event.target.value);
            setNote(formatted);
            try {
              window.localStorage.setItem(`alerin-journal-note-${journal.id}`, formatted);
              setIsSavedNotice(true);
              setTimeout(() => setIsSavedNotice(false), 2000);
            } catch {
              /* ignore storage errors */
            }
          }}
          placeholder="Kamu bisa menuliskan catatan pribadi di sini..."
          aria-label={`Catatan pribadi ${journal.title}`}
          className="mt-2 block min-h-14 w-full resize-none bg-transparent text-sm leading-6 text-[#475569] outline-none placeholder:text-[#94a3b8]"
        />
      </label>
      <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-4">
        <button type="button" onClick={onDetail} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-150 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 hover:shadow-xs active:scale-[0.98]">Lihat detail</button>
        <button
          type="button"
          onClick={onSitasi}
          className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold leading-5 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200 transition-all duration-150 hover:bg-sky-50 hover:text-sky-700 hover:outline-sky-300 hover:shadow-xs active:scale-[0.98]"
        >
          Buat sitasi
        </button>
        <button
          type="button"
          onClick={() => {
            const template = `Halo Alerin, saya ingin mendiskusikan artikel jurnal dari koleksi saya ini:

Judul: "${journal.title}"
Penulis: ${journal.authors} (${journal.year})
DOI: https://doi.org/10.1016/j.jretconser.2020.102345

Ringkasan:
${journal.description}

Mohon bantu saya untuk:
1. Menjelaskan poin-poin penting, metodologi, dan temuan kunci dari jurnal ini.
2. Memberikan saran bagaimana jurnal ini dapat saya gunakan untuk memperkuat tinjauan pustaka atau bab pembahasan saya.
3. Mengidentifikasi research gap atau ide pengembangan yang relevan.`;
            onDiskusikan?.(template);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold leading-5 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200 transition-all duration-150 hover:bg-sky-50 hover:text-sky-700 hover:outline-sky-300 hover:shadow-xs active:scale-[0.98]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 13.5V4a1.5 1.5 0 0 1 1.5-1.5h8A1.5 1.5 0 0 1 13.5 4v6a1.5 1.5 0 0 1-1.5 1.5H5.5L2.5 13.5z" />
            <path d="M5.5 6.5h5M5.5 9h3" />
          </svg>
          Diskusikan dengan Alerin
        </button>
        <button
          type="button"
          onClick={() => window.open("https://doi.org/10.1016/j.jretconser.2020.102345", "_blank", "noopener,noreferrer")}
          className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold leading-5 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200 transition-all duration-150 hover:bg-sky-50 hover:text-sky-700 hover:outline-sky-300 hover:shadow-xs active:scale-[0.98]"
        >
          DOI
        </button>
        <button
          type="button"
          onClick={() => window.alert("PDF dibuka.")}
          className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold leading-5 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200 transition-all duration-150 hover:bg-sky-50 hover:text-sky-700 hover:outline-sky-300 hover:shadow-xs active:scale-[0.98]"
        >
          Buka PDF
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Hapus dari koleksi"
          title="Hapus dari koleksi"
          className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg bg-white text-[#bd3434] outline outline-1 outline-offset-[-1px] outline-rose-200 transition-all duration-150 hover:bg-rose-50 hover:outline-rose-300 hover:shadow-xs active:scale-[0.98]"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
            <path d="M6.5 7v4M9.5 7v4" />
          </svg>
        </button>
        <label className="relative flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
          <span className="pointer-events-none max-w-24 truncate font-semibold text-slate-700">{activeFolder?.name ?? "Belum dikelompokkan"}</span>
          <select
            aria-label="Pindahkan jurnal ke folder"
            value={journal.folderId}
            onChange={event => onMove(event.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
          >
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
          <img src={`${collectionAssets}/b80d5.svg`} alt="" />
        </label>
      </div>
    </article>
  );
}

function ActionResultIcon({ label }: { label: string }) {
  const shared = {
    width: 14,
    height: 14,
    viewBox: "0 0 13 13",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (label === "Buat sitasi") {
    return (
      <svg {...shared}>
        <path d="M2 3.1c1.7-.9 3.3-.9 4.5 0v7.8c-1.2-.9-2.8-.9-4.5 0z" />
        <path d="M11 3.1c-1.7-.9-3.3-.9-4.5 0v7.8c1.2-.9 2.8-.9 4.5 0z" />
      </svg>
    );
  }

  if (label === "Abstrak" || label === "Ringkasan Jurnal") {
    return (
      <svg {...shared}>
        <rect x="2.5" y="1.5" width="8" height="10" rx="1.6" />
        <path d="M4.7 4.4h3.6M4.7 6.5h3.6M4.7 8.6h2.3" />
      </svg>
    );
  }

  if (label === "DOI") {
    return (
      <svg {...shared}>
        <circle cx="6.5" cy="6.5" r="5" />
        <path d="M1.5 6.5h10M6.5 1.5c1.6 1.8 1.6 8.2 0 10M6.5 1.5c-1.6 1.8-1.6 8.2 0 10" />
      </svg>
    );
  }

  return (
    <svg {...shared}>
      <path d="M7.3 1.5H4.1a1.6 1.6 0 00-1.6 1.6v6.8a1.6 1.6 0 001.6 1.6h4.8a1.6 1.6 0 001.6-1.6V4.7z" />
      <path d="M7.3 1.5v3.2h3.2" />
    </svg>
  );
}

function RelevancyRing({ value }: { value: string }) {
  const parsed = Number.parseInt(value, 10);
  const percent = Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : 0;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percent / 100);

  return (
    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 80 80"
        fill="none"
        role="img"
        aria-label={`Relevansi ${percent}%`}
      >
        <circle cx="40" cy="40" r={radius} stroke="#e0f2fe" strokeWidth="5" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#0369a1"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="text-xl font-extrabold leading-6 tracking-[-0.4px] text-[#0369a1]">{value}</span>
    </div>
  );
}

function JournalCardSkeleton({ rank }: { rank?: string }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-2 outline-offset-[-2px] outline-sky-100 animate-pulse">
      <div className="flex items-center gap-2">
        <span className="h-5 w-24 rounded-sm bg-sky-200" />
        <span className="h-5 w-14 rounded-sm bg-slate-200" />
        <span className="h-5 w-24 rounded-sm bg-sky-100" />
      </div>

      <div className="mt-4 flex items-start gap-4">
        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="h-6 w-11/12 rounded-md bg-slate-200" />
          <div className="h-5 w-3/4 rounded-md bg-slate-200" />
          <div className="h-3.5 w-1/3 rounded-md bg-slate-100" />
          <div className="h-3.5 w-1/4 rounded-md bg-slate-100" />
        </div>
        <div className="flex w-28 shrink-0 flex-col items-center">
          <div className="h-20 w-20 rounded-full border-4 border-slate-200 bg-slate-100/60" />
          <div className="mt-1 h-3 w-14 rounded bg-slate-200" />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 min-[1180px]:flex-row">
        <div className="min-w-0 flex-1 rounded-xl bg-sky-50/40 p-4 outline outline-1 outline-offset-[-1px] outline-sky-100 space-y-2.5">
          <div className="h-3.5 w-48 rounded bg-slate-200" />
          <div className="space-y-2 pt-2">
            {[90, 85, 75, 80].map((w, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between">
                  <div className="h-2.5 w-24 rounded bg-slate-200" />
                  <div className="h-2.5 w-7 rounded bg-slate-200" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-200">
                  <div className="h-1.5 rounded-full bg-sky-300" style={{ width: `${w}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 h-8 rounded-lg bg-slate-100" />
        </div>
        <div className="w-full shrink-0 rounded-xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-slate-200 min-[1180px]:w-[320px] space-y-3">
          <div className="mx-auto h-4 w-24 rounded bg-slate-200" />
          <div className="space-y-2.5 pt-1">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="flex items-start gap-2.5">
                <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-sky-200" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="h-2.5 w-40 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-r-xl border-l-4 border-sky-400 bg-sky-50/70 p-4 space-y-2">
        <div className="h-3 w-28 rounded bg-sky-300" />
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-4/5 rounded bg-slate-200" />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-100 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-9 w-32 rounded-lg bg-sky-700/30" />
          <div className="h-9 w-24 rounded-lg bg-slate-100" />
          <div className="h-9 w-20 rounded-lg bg-slate-100" />
          <div className="h-9 w-28 rounded-lg bg-amber-100/60" />
        </div>
        <div className="h-9 w-24 rounded-lg bg-slate-100" />
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-sky-700">
        <svg className="h-4 w-4 animate-spin text-sky-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span>Sedang mencari rekomendasi pengganti untuk {rank ?? "kartu ini"}...</span>
      </div>
    </article>
  );
}

function DesktopJournalResultCard({
  relevancy,
  onAnalisis,
  onSitasi,
  onAbstrak,
  onDiskusikan,
  journal,
  detailOverride,
  saved = false,
  onToggleSave,
  onReplaceJournal,
}: {
  relevancy: string;
  onAnalisis?: () => void;
  onSitasi?: () => void;
  onAbstrak?: () => void;
  onDiskusikan?: (template: string) => void;
  journal?: (typeof desktopResultJournals)[number] & { isReplaced?: boolean };
  detailOverride?: ResultDetail;
  saved?: boolean;
  onToggleSave?: () => void;
  onReplaceJournal?: (journalId: string, reasons: string[]) => Promise<void> | void;
}) {
  const detail = detailOverride ?? desktopResultDetails.find(item => item.id === journal?.id) ?? desktopResultDetails[0];
  const isReplaced = Boolean(journal?.isReplaced || detail?.isReplaced);
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReasonText, setOtherReasonText] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleOtherReasonChange = (raw: string) => {
    let val = raw;
    if (val.length > 150) {
      val = val.slice(0, 150);
    }
    setOtherReasonText(capitalizeFirstLetter(val));
  };

  const isSubmitEnabled =
    selectedReasons.length > 0 &&
    (!selectedReasons.includes("lainnya") || otherReasonText.trim().length >= 3);

  const toggleReason = (id: string) => {
    setSelectedReasons(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleProcessReplacement = async () => {
    if (!isSubmitEnabled || isRefreshing || !journal) return;
    setIsFeedbackOpen(false);
    setIsRefreshing(true);
    try {
      const payloadReasons = selectedReasons.includes("lainnya") && otherReasonText.trim()
        ? [...selectedReasons.filter(r => r !== "lainnya"), `Lainnya: ${otherReasonText.trim()}`]
        : selectedReasons;

      if (onReplaceJournal) {
        await onReplaceJournal(journal.id, payloadReasons);
      }
      setSelectedReasons([]);
      setOtherReasonText("");
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isRefreshing) {
    return <JournalCardSkeleton rank={detail.rank} />;
  }

  const actionButtons = ["Buat sitasi", "Abstrak", "Buka PDF"];

  return (
    <article className={`overflow-hidden rounded-2xl bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline transition-shadow hover:shadow-md ${
      isReplaced ? "outline-2 outline-offset-[-2px] outline-[#00629b]/40 shadow-xs" : "outline-2 outline-offset-[-2px] outline-sky-100"
    }`}>
      <div className="flex flex-col gap-3 px-6 py-6">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-sm bg-sky-700 px-2 py-0.5 text-xs font-bold leading-4 text-white">{detail.rank}</span>
          {detail.badges.map(badge => (
            <span
              key={badge.label}
              className={
                badge.tone === "sky"
                  ? "rounded-sm bg-sky-100 px-2 py-0.5 text-xs font-bold leading-4 text-sky-600"
                  : "rounded-sm bg-slate-100 px-2 py-0.5 text-xs font-semibold leading-4 text-slate-700"
              }
            >
              {badge.label}
            </span>
          ))}
          {isReplaced && (
            <button
              type="button"
              onClick={() => setIsFeedbackOpen(true)}
              className="inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-sm bg-sky-100 px-2 py-0.5 text-xs font-bold leading-4 text-[#00629b] border border-sky-200 hover:bg-sky-200 transition-colors cursor-pointer"
              title="Jurnal ini telah diperbarui. Klik jika belum sesuai untuk memperbarui kembali."
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2.5 8a5.5 5.5 0 0 1 9.39-3.89L13.5 5.5M13.5 2v3.5H10" />
                <path d="M13.5 8a5.5 5.5 0 0 1-9.39 3.89L2.5 10.5M2.5 14v-3.5H6" />
              </svg>
              <span>Telah Diperbarui</span>
            </button>
          )}
        </div>

        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold leading-7 text-slate-900">{journal?.title}</h3>
            <p className="pt-1 text-xs font-medium leading-4 text-slate-600">{journal?.authors}</p>
            <p className="pt-0.5 text-xs leading-4 text-slate-500">{detail.source}</p>
          </div>
          <div className="flex w-28 shrink-0 flex-col items-center">
            <RelevancyRing value={relevancy} />

            <span className="pt-1 text-xs font-semibold leading-4 text-slate-500">Relevansi</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-1 min-[1180px]:flex-row min-[1180px]:items-stretch">
          <div className="flex min-w-0 flex-1 flex-col justify-between rounded-xl bg-sky-50/30 p-4 outline outline-1 outline-offset-[-1px] outline-sky-100">
            <div>
              <h4 className="text-xs font-bold leading-4 text-slate-900">Mengapa jurnal ini direkomendasikan?</h4>
              <div className="flex flex-col gap-2 pt-3">
                {detail.fitBars.map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-1">
                    <div className="flex items-start justify-between text-xs leading-4">
                      <span className="font-semibold text-slate-600">{label}</span>
                      <span className="font-bold text-sky-600">{value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200">
                      <div className="h-1.5 rounded-full bg-sky-600" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 rounded-lg bg-[#f1f5f9] p-2.5 text-xs font-bold leading-4 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200">
              Kutipan relevan: &ldquo;{detail.quote}&rdquo;
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-col rounded-xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-slate-200 min-[1180px]:w-[320px] min-[1180px]:self-stretch">
            <h4 className="text-center text-base font-extrabold leading-5 text-slate-900">Kredibilitas</h4>
            <ul className="mt-2 flex flex-1 flex-col justify-around py-1">
              {detail.credibility.map(([title, desc]) => (
                <li key={title} className="flex items-start gap-2.5 py-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true">
                    <path d="M2.5 8.5l3.5 3.5 7.5-8" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-4 text-slate-800">{title}</p>
                    {title === "DOI terverifikasi" ? (
                      <a
                        href={detail.doiUrl || (desc.startsWith("http") ? desc : `https://doi.org/${desc.replace(/^DOI:\s*/i, "")}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block break-all pt-0.5 text-xs leading-4 text-sky-600 underline underline-offset-2 decoration-sky-300 transition-colors duration-150 hover:text-[#000000] hover:decoration-[#000000]"
                      >
                        {desc.startsWith("http") ? desc : `https://doi.org/${desc.replace(/^DOI:\s*/i, "")}`}
                      </a>
                    ) : (
                      <p className="pt-0.5 text-xs leading-4 text-slate-500">{desc}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-r-xl border-l-4 border-sky-600 bg-sky-50/70 px-4 pb-4 pt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold leading-4 tracking-wide text-sky-600 md:text-sm md:leading-5">RINGKASAN UTAMA</p>
              <p className="pt-1.5 font-['Inter:Regular'] font-normal text-[13px] leading-6 text-slate-800 md:text-sm md:leading-5">
                {detail.summaryMore ? (
                  summaryExpanded ? (
                    `${detail.summary.replace(/\.\.\.$/, "")}. ${detail.summaryMore}`
                  ) : (
                    <>
                      {detail.summary.replace(/\.\.\.$/, "")}
                      <button
                        type="button"
                        onClick={() => setSummaryExpanded(true)}
                        aria-label="Tampilkan ringkasan lengkap"
                        className="font-bold text-sky-700"
                      >
                        ...
                      </button>
                    </>
                  )
                ) : (
                  detail.summary
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={onAnalisis}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#0369a1] px-4 py-2 text-sm font-semibold leading-5 text-white shadow-xs transition-colors hover:bg-[#025684]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                <path d="M6.2 1.6l1.1 2.7 2.7 1.1-2.7 1.1-1.1 2.7-1.1-2.7L2.4 5.4l2.7-1.1z" />
                <path d="M10.6 7.7l.6 1.5 1.5.6-1.5.6-.6 1.5-.6-1.5-1.5-.6 1.5-.6z" />
              </svg>
              Lihat Detail
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-4">
          {actionButtons.map(label => (
            <button
              key={label}
              type="button"
              onClick={
                label === "Buat sitasi"
                  ? onSitasi
                  : label === "Abstrak"
                    ? (onAbstrak ?? onAnalisis)
                    : label === "Ringkasan Jurnal"
                      ? (onAnalisis ?? onAbstrak)
                      : label === "DOI"
                        ? () => window.open(detail.doiUrl, "_blank", "noopener,noreferrer")
                        : () => window.alert(detail.pdfNote)
              }
              className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold leading-5 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200 transition-all duration-150 hover:bg-sky-50 hover:text-sky-700 hover:outline-sky-300 hover:shadow-xs active:scale-[0.98]"
            >
              <ActionResultIcon label={label} />
              {label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              const template = `Halo Alerin, saya ingin mendiskusikan artikel jurnal ini untuk bahan penelitian saya:

Judul: "${journal?.title || ""}"
Penulis: ${journal?.authors || "-"} (${journal?.year || "-"})
DOI: ${detail.doiUrl || "-"}

Ringkasan:
${detail.summary}

Mohon bantu saya untuk:
1. Menjelaskan poin-poin penting, metodologi, dan temuan kunci dari jurnal ini.
2. Memberikan saran bagaimana jurnal ini dapat saya gunakan untuk memperkuat tinjauan pustaka atau bab pembahasan saya.
3. Mengidentifikasi research gap atau ide pengembangan yang relevan.`;
              onDiskusikan?.(template);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold leading-5 text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200 transition-all duration-150 hover:bg-sky-50 hover:text-sky-700 hover:outline-sky-300 hover:shadow-xs active:scale-[0.98]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2.5 13.5V4a1.5 1.5 0 0 1 1.5-1.5h8A1.5 1.5 0 0 1 13.5 4v6a1.5 1.5 0 0 1-1.5 1.5H5.5L2.5 13.5z" />
              <path d="M5.5 6.5h5M5.5 9h3" />
            </svg>
            Diskusikan dengan Alerin
          </button>

          {/* Tombol Pemicu: Belum Sesuai / Perbarui Kembali */}
          <button
            type="button"
            onClick={() => setIsFeedbackOpen(open => !open)}
            aria-expanded={isFeedbackOpen}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold leading-5 transition-all duration-150 active:scale-[0.98] ${
              isFeedbackOpen
                ? "bg-sky-100 text-sky-900 outline outline-1 outline-sky-300 ring-2 ring-sky-400/20 shadow-xs"
                : isReplaced
                  ? "bg-sky-50 text-[#00629b] outline outline-1 outline-sky-200 hover:bg-sky-100 hover:text-sky-900 hover:outline-sky-300 hover:shadow-xs"
                  : "bg-white text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200 hover:bg-sky-50 hover:text-sky-700 hover:outline-sky-300 hover:shadow-xs"
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${isFeedbackOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            >
              <path d="M2.5 8a5.5 5.5 0 0 1 9.39-3.89L13.5 5.5M13.5 2v3.5H10" />
              <path d="M13.5 8a5.5 5.5 0 0 1-9.39 3.89L2.5 10.5M2.5 14v-3.5H6" />
            </svg>
            {isReplaced ? "Perbarui Kembali" : "Belum Sesuai"}
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`ml-0.5 transition-transform duration-200 ${isFeedbackOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            >
              <path d="M2.5 4.5l3.5 3.5 3.5-3.5" />
            </svg>
          </button>

          <button
            type="button"
            onClick={journal ? onToggleSave : undefined}
            aria-pressed={saved}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold leading-5 outline outline-1 outline-offset-[-1px] transition-all duration-150 active:scale-[0.98] ${
              saved
                ? "bg-sky-50 text-sky-700 outline-sky-200 hover:bg-sky-100 hover:outline-sky-300 hover:shadow-xs"
                : "bg-white text-slate-700 outline-slate-200 hover:bg-sky-50 hover:text-sky-700 hover:outline-sky-300 hover:shadow-xs"
            }`}
          >
            <svg
              width="13"
              height="15"
              viewBox="0 0 12 14"
              fill={saved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 1.5h8v11l-4-2.5-4 2.5v-11z" />
            </svg>
            {saved ? "Tersimpan" : "Simpan"}
          </button>
        </div>

        {/* Panel Dropdown / Inline Expansion Kebawah */}
        {isFeedbackOpen && (
          <div className="mt-4 rounded-xl border border-slate-300/80 bg-gradient-to-b from-slate-50/90 via-slate-50/50 to-blue-50/30 p-4.5 transition-all duration-300 md:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-['Plus_Jakarta_Sans:Bold'] text-base font-bold text-slate-800">
                  {isReplaced ? "Mengapa rekomendasi baru ini masih belum sesuai?" : "Mengapa jurnal ini belum sesuai?"}
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  {isReplaced
                    ? "Pilih kendala yang masih ada agar Alerin dapat mencarikan alternatif jurnal lain yang lebih tepat."
                    : "Pilih minimal satu alasan agar Alerin dapat menggantinya dengan rekomendasi yang lebih sesuai kebutuhanmu."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsFeedbackOpen(false);
                  setSelectedReasons([]);
                  setOtherReasonText("");
                }}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition-colors"
                aria-label="Batal dan tutup"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
                <span className="hidden sm:inline">Batal</span>
              </button>
            </div>

            {/* Pilihan Alasan (Multi-select Chips / Checkbox Grid) */}
            <div className="mt-3.5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {JOURNAL_FEEDBACK_REASONS.map(reason => {
                const isChecked = selectedReasons.includes(reason.id);
                return (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => toggleReason(reason.id)}
                    className={`flex items-center gap-2.5 rounded-xl border-[1.5px] px-3 py-2.5 text-left text-sm transition-all ${
                      isChecked
                        ? "border-[#0284c7] bg-sky-50/90 font-semibold text-sky-950 shadow-xs ring-1 ring-[#0284c7]/30"
                        : "border-slate-300 bg-white font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50/80 shadow-2xs"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-[1.5px] transition-colors ${
                        isChecked
                          ? "border-[#0284c7] bg-[#0284c7] text-white"
                          : "border-slate-400/80 bg-white"
                      }`}
                    >
                      {isChecked && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1.5 4l2.5 2.5 4.5-5" />
                        </svg>
                      )}
                    </span>
                    <span className="truncate">{reason.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Field input tambahan jika memilih 'Lainnya' */}
            {selectedReasons.includes("lainnya") && (
              <div className="mt-2.5">
                <textarea
                  rows={3}
                  maxLength={150}
                  value={otherReasonText}
                  onChange={e => handleOtherReasonChange(e.target.value)}
                  placeholder="Tuliskan kendala spesifik jurnal ini..."
                  className="w-full min-h-[76px] resize-none rounded-xl border-[1.5px] border-slate-300 bg-white p-3 text-xs text-slate-800 outline-none placeholder:text-slate-400 hover:border-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20"
                />
                <div className="mt-1 flex items-center justify-between px-1 text-[11px] text-slate-400">
                  <span>
                    {otherReasonText.trim().length > 0 && otherReasonText.trim().length < 3 ? (
                      <span className="font-medium text-amber-600">Minimal 3 karakter</span>
                    ) : null}
                  </span>
                  <span>
                    {otherReasonText.length}/
                    <span className={otherReasonText.length >= 150 ? "font-semibold text-rose-500" : ""}>
                      150
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* Tombol Aksi di Pojok Bawah */}
            <div className="mt-3.5 flex items-center justify-end">
              <button
                type="button"
                disabled={!isSubmitEnabled || isRefreshing}
                onClick={handleProcessReplacement}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                  isSubmitEnabled && !isRefreshing
                    ? "bg-[#0369a1] text-white shadow-sm hover:bg-[#025684] active:scale-[0.98] cursor-pointer"
                    : "cursor-not-allowed bg-slate-200 text-slate-400"
                }`}
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 8a5.5 5.5 0 0 1 9.39-3.89L13.5 5.5M13.5 2v3.5H10" />
                  <path d="M13.5 8a5.5 5.5 0 0 1-9.39 3.89L2.5 10.5M2.5 14v-3.5H6" />
                </svg>
                {isReplaced ? "Perbarui Jurnal Lagi" : "Cari Jurnal Pengganti"}
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function RingkasanJurnalModal({
  open,
  onClose,
  onDiskusikan,
}: {
  open: boolean;
  onClose: () => void;
  onDiskusikan?: (template: string) => void;
}) {
  const [expanded, setExpanded] = useState<number[]>([0, 1]);
  const [expandedDesktopPoints, setExpandedDesktopPoints] = useState<number[]>([]);
  const [isMainExpanded, setIsMainExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  if (!open) return null;

  const mainSummaryShort =
    "Penelitian ini menunjukkan bahwa interaksi parasosial antara host dan penonton dapat membangun kepercayaan konsumen secara signifikan. Ketika interaksi tersebut disertai pesan kelangkaan (scarcity nudges) berupa batas waktu penawaran atau keterbatasan kuota stok, niat beli konsumen (purchase intention) pada siaran live streaming commerce mengalami peningkatan yang substansial.";

  const mainSummaryExtended =
    "Temuan ini menegaskan bahwa keintiman emosional dan rasa keterhubungan yang dirasakan penonton terhadap figur presenter bertindak sebagai pemicu psikologis utama yang mengurangi keraguan dalam bertransaksi. Ditambah dengan dorongan kelangkaan yang menciptakan urgensi waktu (perceived urgency), konsumen terdorong mengambil keputusan pembelian secara spontan tanpa penundaan panjang. Oleh karena itu, strategi pemasaran digital terpadu perlu menyeimbangkan keaslian interaksi presenter dengan transparansi informasi produk agar loyalitas dan retensi konsumen tetap terjaga dalam jangka panjang.";

  const points = [
    {
      title: "Tujuan penelitian",
      hint: "Fokus dan sasaran penelitian",
      desc: "Menguji pengaruh interaksi parasosial dan dorongan kelangkaan terhadap niat pembelian konsumen dalam konteks live streaming commerce.",
      extendedDesc:
        "Secara komprehensif, studi ini menganalisis bagaimana dimensi keterikatan emosional dan interaksi dua arah antara host dan audiens memediasi terbentuknya rasa percaya (perceived trust). Penelitian juga menguji peran moderasi dari kelangkaan kuantitas dan batasan waktu terhadap percepatan konversi transaksi belanja langsung.",
    },
    {
      title: "Metode penelitian",
      hint: "Kuantitatif survei & analisis SEM-PLS",
      desc: "Pendekatan kuantitatif menggunakan survei cross-sectional. Hubungan antarvariabel dianalisis menggunakan metode SEM-PLS.",
      extendedDesc:
        "Data dikumpulkan melalui kuesioner terstruktur berskala Likert 1–5 dari 312 responden aktif yang rutin berbelanja di platform live commerce. Analisis inferensial menggunakan Structural Equation Modeling berbasis Partial Least Squares (SEM-PLS) untuk memvalidasi reliabilitas komposit, validitas diskriminan, dan koefisien jalur struktural.",
    },
    {
      title: "Temuan utama",
      hint: "Hasil utama penelitian",
      desc: "Interaksi parasosial meningkatkan kepercayaan kepada host, sedangkan kelangkaan memperkuat urgensi yang mendorong keputusan pembelian.",
      extendedDesc:
        "Hasil estimasi empiris menunjukkan interaksi parasosial berkontribusi langsung sebesar 42% terhadap persepsi kepercayaan konsumen. Pesan kelangkaan (scarcity cues) terbukti memperkuat efek tersebut dengan memicu dorongan psikologis takut kehilangan penawaran (FOMO), yang secara signifikan melipatgandakan niat beli spontan.",
    },
    {
      title: "Relevansi untuk penelitianmu",
      hint: "Landasan hipotesis & teori variabel",
      desc: "Dapat digunakan untuk landasan teori, penyusunan hipotesis, pemilihan variabel, serta pembanding penelitian perilaku konsumen digital.",
      extendedDesc:
        "Sangat relevan untuk memperkuat Bab II (Tinjauan Pustaka) terkait Parasocial Interaction Theory dan Commodity Theory. Indikator variabelnya dapat langsung diadaptasi menjadi instrumen kuesioner pada Bab III, serta dijadikan rujukan komparatif ketika membahas temuan empiris pada Bab IV skripsi atau tesis.",
    },
    {
      title: "Keterbatasan penelitian",
      hint: "Data satu periode survei",
      desc: "Data dikumpulkan pada satu periode sehingga belum menjelaskan perubahan perilaku konsumen dalam jangka panjang.",
      extendedDesc:
        "Desain cross-sectional hanya mencerminkan respons konsumen pada satu titik waktu tertentu, sehingga belum mengeksplorasi retensi jangka panjang atau niat pembelian berulang (repurchase intention). Selain itu, sampel terfokus pada produk ritel fesyen dan kosmetik, sehingga perlu kehati-hatian dalam generalisasi ke produk bernilai tinggi.",
    },
    {
      title: "Saran penggunaan",
      hint: "Cek metode & verifikasi sumber asli",
      desc: "Baca bagian metode dan hasil asli sebelum mengutip. Sesuaikan penerapan temuan dengan konteks objek dan wilayah penelitianmu.",
      extendedDesc:
        "Disarankan untuk menelaah naskah lengkap melalui tautan DOI resmi, terutama tabel hasil outer loading dan koefisien jalur. Saat mengadopsi variabel penelitian, sesuaikan redaksi indikator agar selaras dengan karakteristik demografi sampel dan platform digital yang menjadi fokus studi mandirimu.",
    },
  ];

  const toggleDesktopPoint = (index: number) => {
    setExpandedDesktopPoints(current =>
      current.includes(index) ? current.filter(item => item !== index) : [...current, index]
    );
  };

  const copySummary = async () => {
    const fullMain = `${mainSummaryShort}\n\n${mainSummaryExtended}`;
    const text = [
      `Ringkasan utama\n${fullMain}`,
      ...points.map(
        (point, index) => `${index + 1}. ${point.title}\n${point.desc}\n${point.extendedDesc}`
      ),
    ].join("\n\n");
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  const togglePoint = (index: number) => {
    setExpanded(current => (current.includes(index) ? current.filter(item => item !== index) : [...current, index]));
  };

  return (
    <div
      className="fixed inset-0 z-[340] flex items-end justify-center bg-slate-900/50 backdrop-blur-[2px] md:items-center md:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ringkasan Jurnal"
        onClick={event => event.stopPropagation()}
        className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[32px] bg-white shadow-[0px_25px_60px_-15px_rgba(0,0,0,0.30)] md:max-h-[calc(100vh-32px)] md:w-[820px] md:max-w-full md:rounded-3xl md:border md:border-slate-300/80"
      >
        <div className="flex shrink-0 justify-center pb-1 pt-3 md:hidden">
          <span className="h-1.5 w-16 rounded-full bg-slate-300/80" aria-hidden="true" />
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-6 pb-4 pt-2 md:px-7 md:pb-4 md:pt-6">
          <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-xl font-bold leading-7 text-slate-900 md:text-xl md:leading-8">Ringkasan Jurnal</h2>
          <button
            type="button"
            aria-label="Tutup ringkasan"
            onClick={onClose}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white transition-colors hover:bg-slate-50 md:h-8 md:w-8"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#64748b" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M2.5 2.5l9 9M11.5 2.5l-9 9" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:max-h-[70vh] md:p-7">
          <div className="flex flex-col gap-2 rounded-2xl border-l-4 border-sky-600 bg-sky-50/70 px-5 py-5 md:gap-2 md:rounded-xl md:bg-blue-50 md:pl-5 md:pr-6">
            <div className="flex items-center justify-between gap-3">
              <p className="font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold leading-5 text-slate-900 md:text-sm md:font-extrabold md:leading-5">Ringkasan utama</p>
              <button
                type="button"
                onClick={() => setIsMainExpanded(v => !v)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#00629b] hover:text-sky-800 hover:underline cursor-pointer transition-colors"
              >
                <span>{isMainExpanded ? "Lihat Lebih Sedikit" : "Lihat Selengkapnya"}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${isMainExpanded ? "rotate-180" : ""}`}
                >
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </button>
            </div>
            <p className="font-['Inter:Medium',sans-serif] font-medium text-[13px] leading-6 text-slate-800 md:text-sm md:leading-6">
              {mainSummaryShort}
            </p>
            {isMainExpanded && (
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[13px] leading-6 text-slate-700 md:text-sm md:leading-6 pt-1">
                {mainSummaryExtended}
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-3 md:mt-4 md:grid md:grid-cols-2 md:gap-3">
            {points.map((point, index) => {
              const isOpen = expanded.includes(index);
              const isDesktopExpanded = expandedDesktopPoints.includes(index);
              return (
                <div
                  key={point.title}
                  className="overflow-hidden rounded-2xl border border-slate-300 bg-white transition-colors md:flex md:flex-col md:justify-between md:rounded-xl md:p-4 md:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.02)]"
                >
                  <div>
                    {/* Header Mobile Accordion */}
                    <button
                      type="button"
                      onClick={() => togglePoint(index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-3 p-4 text-left md:hidden"
                    >
                      <span className="flex min-w-0 items-center gap-3.5">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            isOpen ? "bg-sky-600 text-white" : "bg-sky-100 text-sky-700"
                          }`}
                        >
                          <span className="font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold leading-5">{index + 1}</span>
                        </span>
                        <span className="min-w-0">
                          <span className="block font-['Plus_Jakarta_Sans:Bold'] text-[15px] font-bold leading-5 text-slate-900">{point.title}</span>
                          {!isOpen && <span className="mt-0.5 block truncate text-xs leading-4 text-slate-400">{point.hint}</span>}
                        </span>
                      </span>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isOpen ? "bg-sky-50" : ""}`}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          stroke={isOpen ? "#0284c7" : "#94a3b8"}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          className={isOpen ? "" : "-rotate-90"}
                        >
                          <path d="M3 5.5l4 4 4-4" />
                        </svg>
                      </span>
                    </button>

                    {/* Header Desktop */}
                    <div className="hidden md:flex md:items-center md:gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                        <span className="font-['Plus_Jakarta_Sans:Bold'] text-xs font-bold leading-4">{index + 1}</span>
                      </span>
                      <span className="font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold leading-5 text-slate-900">{point.title}</span>
                    </div>

                    {/* Content */}
                    <div className={`px-4 pb-4 pl-[60px] pr-4 md:px-0 md:pb-0 md:pt-2 md:pl-7 ${isOpen ? "block" : "hidden md:block"}`}>
                      <p className="font-['Inter:Medium',sans-serif] font-medium text-[13px] leading-6 text-slate-800 md:text-xs md:leading-5">
                        {point.desc}
                      </p>
                      {isDesktopExpanded && (
                        <p className="mt-2 pt-2 border-t border-slate-100 font-['Inter:Regular',sans-serif] text-[13px] leading-6 text-slate-600 md:text-xs md:leading-5">
                          {point.extendedDesc}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Desktop Toggle Button */}
                  <div className="hidden md:flex md:items-center md:justify-end md:pl-7 md:pt-2.5">
                    <button
                      type="button"
                      onClick={() => toggleDesktopPoint(index)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00629b] hover:text-sky-800 hover:underline cursor-pointer transition-colors"
                    >
                      <span>{isDesktopExpanded ? "Lihat Lebih Sedikit" : "Lihat Selengkapnya"}</span>
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform duration-200 ${isDesktopExpanded ? "rotate-180" : ""}`}
                      >
                        <path d="M4 6l4 4 4-4" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 border-t border-slate-200 bg-white px-6 pb-6 pt-4 md:justify-end md:px-7 md:py-4">
          <button
            type="button"
            onClick={copySummary}
            className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold leading-5 shadow-xs transition-all active:scale-[0.98] md:h-10 md:w-44 md:flex-none ${
              isCopied
                ? "border-sky-300 bg-sky-50 text-[#00629b] shadow-sm"
                : "border-slate-200/90 bg-white text-slate-800 hover:bg-slate-50 hover:shadow-sm"
            }`}
          >
            {isCopied ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8.5l3.5 3.5 6.5-7" />
                </svg>
                Tersalin
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0f172a" strokeWidth="1.3" aria-hidden="true">
                  <rect x="5" y="5.5" width="8" height="8.2" rx="1.5" />
                  <rect x="2" y="2" width="8" height="8.2" rx="1.5" />
                </svg>
                Salin
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-xl bg-[#00629b] text-sm font-bold leading-5 text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#005282] active:scale-[0.98] md:h-10 md:w-auto md:flex-none md:px-6 md:py-2.5 md:font-semibold cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

function TabelPenelitianModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [fullTable, setFullTable] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  if (!open) return null;

  const headers = ["No.", "Penelitian", "Variabel penelitian", "Teori", "Metode penelitian", "Hasil penelitian", "Persamaan dan perbedaan"];

  const tableRows = [
    {
      study: "Peneliti A (2021)",
      subtitle: "Pengaruh Literasi Keuangan terhadap Perilaku Pengelolaan Keuangan pada Pelaku UMKM",
      variabel: "Independen (X): literasi keuangan. Dependen (Y): perilaku pengelolaan keuangan, mencakup pemahaman konsep keuangan, pengelolaan pendapatan, tabungan, pinjaman, dan pengambilan keputusan.",
      teori: "Teori perilaku keuangan (financial behavior theory)",
      metode: "Kuantitatif dengan metode survei; data kuesioner pelaku UMKM; analisis regresi linear sederhana.",
      hasil: "Literasi keuangan berpengaruh positif terhadap perilaku pengelolaan keuangan: pelaku usaha lebih mampu menyusun anggaran, mengendalikan pengeluaran, dan mengambil keputusan secara terencana.",
      perbedaan: "Sama-sama menempatkan literasi keuangan sebagai independen dan perilaku pengelolaan keuangan sebagai dependen. Perbedaannya, penelitian terdahulu hanya memakai satu variabel independen, sedangkan penelitian baru menambahkan sikap keuangan.",
    },
    {
      study: "Peneliti B (2021)",
      subtitle: "Pengaruh Sikap Keuangan terhadap Perilaku Pengelolaan Keuangan",
      variabel: "Independen: sikap keuangan (cara pandang terhadap uang, orientasi masa depan, kedisiplinan, dan pertimbangan keputusan). Dependen: perilaku pengelolaan keuangan.",
      teori: "Theory of Planned Behavior (sikap dan niat berperilaku)",
      metode: "Kuantitatif dengan pendekatan survei; kuesioner pelaku UMKM; analisis regresi untuk menguji hubungan antarvariabel.",
      hasil: "Perencanaan dan kedisiplinan keuangan mendorong individu mengatur pengeluaran, mempertimbangkan kebutuhan sebelum membeli, serta mengelola dana usaha lebih bertanggung jawab.",
      perbedaan: "Persamaannya pada penggunaan sikap keuangan. Perbedaannya, penelitian baru menambahkan literasi keuangan serta berbeda dalam lokasi, karakteristik responden, dan indikator pengukuran.",
    },
    {
      study: "Peneliti C (2022)",
      subtitle: "Hubungan Literasi Keuangan dengan Pengelolaan Keuangan pada Usaha Mikro",
      variabel: "Independen: literasi keuangan. Dependen: pengelolaan keuangan usaha (pencatatan transaksi, pengelolaan modal, penganggaran, dan pemisahan keuangan pribadi dari usaha).",
      teori: "Teori literasi keuangan dan pengelolaan keuangan",
      metode: "Kuantitatif dengan desain survei terhadap pelaku usaha mikro; kuesioner dan analisis statistik.",
      hasil: "Literasi keuangan berkorelasi positif dengan kemampuan mengelola keuangan usaha, meski juga dipengaruhi pengalaman usaha dan ketersediaan sistem pencatatan.",
      perbedaan: "Fokus pada usaha mikro dan praktik pencatatan. Penelitian baru memperluas unit analisis ke UMKM serta menambahkan sikap keuangan sebagai variabel independen.",
    },
    {
      study: "Peneliti D (2022)",
      subtitle: "Pengaruh Sikap Keuangan dan Pendapatan terhadap Perilaku Pengelolaan Keuangan",
      variabel: "Independen: sikap keuangan dan pendapatan. Dependen: perilaku pengelolaan keuangan.",
      teori: "Teori alokasi pendapatan dan perilaku konsumen",
      metode: "Kuantitatif dengan metode survei; kuesioner; regresi linear berganda secara parsial dan simultan.",
      hasil: "Sikap keuangan yang mendukung perencanaan mendorong kedisiplinan pengelolaan uang, sedangkan tingkat pendapatan memengaruhi kemampuan memenuhi kebutuhan, menabung, dan mengalokasikan dana.",
      perbedaan: "Persamaannya pada sikap keuangan sebagai independen. Perbedaannya, penelitian terdahulu memakai pendapatan sebagai variabel tambahan, sedangkan penelitian baru memakai literasi keuangan.",
    },
    {
      study: "Peneliti E (2022)",
      subtitle: "Pengaruh Pengetahuan Keuangan dan Literasi Keuangan terhadap Pengelolaan Keuangan UMKM",
      variabel: "Independen: pengetahuan keuangan dan literasi keuangan. Dependen: pengelolaan keuangan UMKM.",
      teori: "Teori pengetahuan dan literasi keuangan",
      metode: "Kuantitatif dengan regresi linear berganda untuk menguji pengaruh masing-masing variabel dan pengaruh keduanya secara bersama-sama.",
      hasil: "Pengetahuan dan literasi keuangan mendukung pengambilan keputusan, namun pengetahuan saja belum tentu menghasilkan pengelolaan yang baik bila tidak diterapkan secara konsisten.",
      perbedaan: "Penelitian terdahulu memakai pengetahuan keuangan, sedangkan penelitian baru memakai sikap keuangan sebagai variabel independen kedua; definisi operasional hasil yang diukur juga disesuaikan.",
    },
    {
      study: "Peneliti F (2023)",
      subtitle: "Pengaruh Literasi Keuangan dan Pengalaman Usaha terhadap Perilaku Keuangan Pelaku UMKM",
      variabel: "Independen: literasi keuangan dan pengalaman usaha (lama menjalankan usaha). Dependen: perilaku keuangan.",
      teori: "Teori pembelajaran pengalaman (experiential learning)",
      metode: "Kuantitatif dengan pendekatan survei; kuesioner pelaku UMKM; regresi linear berganda.",
      hasil: "Pemahaman keuangan membantu menilai pilihan keuangan, sedangkan pengalaman usaha memberi pembelajaran praktis dalam mengelola modal, menghadapi perubahan pendapatan, dan mengendalikan risiko.",
      perbedaan: "Persamaannya pada literasi keuangan sebagai independen. Perbedaannya, penelitian terdahulu memakai pengalaman usaha, sedangkan penelitian baru memakai sikap keuangan.",
    },
    {
      study: "Peneliti G (2023)",
      subtitle: "Pengaruh Sikap Keuangan dan Locus of Control terhadap Perilaku Pengelolaan Keuangan",
      variabel: "Independen: sikap keuangan dan locus of control (keyakinan atas kendali hasil). Dependen: perilaku pengelolaan keuangan.",
      teori: "Teori locus of control",
      metode: "Kuantitatif dengan metode survei; kuesioner untuk mengukur sikap keuangan, locus of control, dan perilaku pengelolaan keuangan; regresi linear berganda.",
      hasil: "Individu dengan sikap positif terhadap perencanaan dan rasa tanggung jawab atas keputusannya lebih terdorong mengendalikan pengeluaran dan mengevaluasi penggunaan dana secara teratur.",
      perbedaan: "Persamaannya pada sikap keuangan dan perilaku pengelolaan keuangan. Perbedaannya, penelitian terdahulu memakai locus of control, sedangkan penelitian baru memakai literasi keuangan sebagai independen kedua.",
    },
    {
      study: "Peneliti H (2024)",
      subtitle: "Pengaruh Literasi Keuangan dan Sikap Keuangan terhadap Pengelolaan Keuangan Pelaku UMKM",
      variabel: "Independen: literasi keuangan (pemahaman konsep) dan sikap keuangan (kecenderungan merencanakan serta menggunakan dana). Dependen: pengelolaan keuangan UMKM.",
      teori: "Teori literasi dan sikap keuangan",
      metode: "Kuantitatif; kuesioner disusun berdasarkan indikator tiap variabel; regresi linear berganda secara parsial dan simultan.",
      hasil: "Literasi keuangan berkaitan dengan pemahaman konsep keuangan, sedangkan sikap keuangan berhubungan dengan penerapan perencanaan dan disiplin keuangan; besaran pengaruh mengacu hasil analisis aktual.",
      perbedaan: "Model variabelnya paling serupa. Penelitian baru perlu menunjukkan perbedaan lokasi penelitian, karakteristik responden, periode pengumpulan data, indikator, dan definisi operasional variabel dependen.",
    },
    {
      study: "Peneliti I (2024)",
      subtitle: "Pengaruh Pengetahuan Keuangan terhadap Perilaku Keuangan Pelaku Usaha Mikro dan Kecil",
      variabel: "Independen: pengetahuan keuangan (pemahaman dasar keuangan dan penerapannya pada penganggaran, pengeluaran, tabungan, serta keputusan usaha). Dependen: perilaku keuangan.",
      teori: "Teori perilaku keuangan (financial behavior theory)",
      metode: "Kuantitatif dengan metode survei; data primer kuesioner pelaku usaha mikro dan kecil; analisis statistik berdasarkan indikator yang ditentukan peneliti.",
      hasil: "Pemahaman pengelolaan dana membantu merencanakan kebutuhan, mengatur arus kas, dan menilai konsekuensi keputusan keuangan; penerapannya juga dipengaruhi kebiasaan, sikap, dan kondisi usaha.",
      perbedaan: "Penelitian terdahulu hanya memakai pengetahuan keuangan, sedangkan penelitian baru menambahkan literasi keuangan dan sikap keuangan.",
    },
    {
      study: "Peneliti J (2025)",
      subtitle: "Analisis Faktor-Faktor yang Memengaruhi Perilaku Pengelolaan Keuangan pada Pelaku UMKM",
      variabel: "Independen: literasi keuangan, sikap keuangan, dan pengalaman usaha (aspek pemahaman, kecenderungan keputusan, dan pembelajaran praktis). Dependen: perilaku pengelolaan keuangan.",
      teori: "Theory of Planned Behavior dan literasi keuangan",
      metode: "Kuantitatif dengan desain survei; kuesioner pelaku UMKM; regresi linear berganda untuk menilai pengaruh setiap variabel dan kemampuan model menjelaskan variasi dependen.",
      hasil: "Ketiga faktor dikaji bersama-sama untuk menjelaskan perilaku pengelolaan keuangan; faktor paling berpengaruh hanya dapat ditetapkan setelah koefisien regresi dan uji signifikansi diperiksa.",
      perbedaan: "Persamaannya pada literasi keuangan dan sikap keuangan untuk menjelaskan perilaku pengelolaan keuangan UMKM. Perbedaannya, penelitian terdahulu memasukkan pengalaman usaha sebagai variabel tambahan, sedangkan penelitian baru berfokus pada wilayah tertentu.",
    },
  ];

  const copyTable = async () => {
    const text = [
      headers.join("\t"),
      ...tableRows.map((row, index) =>
        [index + 1, `${row.study} — ${row.subtitle}`, row.variabel, row.teori, row.metode, row.hasil, row.perbedaan].join("\t"),
      ),
    ].join("\n");
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  const closeTable = () => {
    setFullTable(false);
    onClose();
  };

  const columnWidths = ["w-[4%]", "w-[16%]", "w-[18%]", "w-[15%]", "w-[15%]", "w-[16%]", "w-[16%]"];

  return (
    <div className="fixed inset-0 z-[340] bg-black/30" onClick={closeTable} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tabel penelitian terdahulu"
        onClick={event => event.stopPropagation()}
        className={`absolute inset-x-0 bottom-0 flex w-full flex-col overflow-hidden bg-white shadow-2xl ${
          fullTable ? "top-0 h-[100dvh] max-h-none rounded-none" : "h-[94dvh] max-h-[97dvh] rounded-t-[43.42px]"
        } md:inset-auto md:left-1/2 md:top-1/2 md:h-auto md:max-h-[calc(100vh-48px)] md:w-[1140px] md:max-w-[calc(100vw-32px)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:outline md:outline-1 md:outline-offset-[-1px] md:outline-slate-100`}
      >
        <div className={`flex shrink-0 justify-center pb-1.5 pt-5 md:hidden ${fullTable ? "hidden" : ""}`}>
          <span className="h-1.5 w-16 rounded-full bg-slate-300" aria-hidden="true" />
        </div>

        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 pb-4 pl-6 pr-5 pt-2 md:border-b-0 md:gap-4 md:px-8 md:pb-4 md:pt-7">
          <div>
            <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-xl font-bold leading-7 text-slate-900 md:text-2xl md:leading-8">Tabel penelitian terdahulu</h2>
            <p className="font-['Plus_Jakarta_Sans:Regular'] pt-1 text-xs font-normal leading-5 text-slate-500 md:text-sm">
              Perbandingan jurnal yang direkomendasikan Alerin berdasarkan topik penelitianmu
            </p>
          </div>
          <button
            type="button"
            aria-label="Tutup tabel"
            onClick={closeTable}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 transition-colors hover:bg-slate-50 md:h-10 md:w-10 md:rounded-xl"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M2.5 2.5l9 9M11.5 2.5l-9 9" />
            </svg>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5 md:px-8 md:py-4">
          <div className="hidden rounded-xl bg-sky-50 px-4 py-3.5 outline outline-1 outline-offset-[-1px] outline-blue-100 md:block">
            <p className="font-['Plus_Jakarta_Sans:Medium'] text-sm font-medium leading-5 text-cyan-900">
              Gunakan kolom &ldquo;Persamaan dan Perbedaan&rdquo; untuk menemukan kebaruan penelitian. Periksa jurnal aslinya sebelum memasukkan data ke
              dalam karya ilmiah.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 md:hidden">
            <span className="text-xs font-semibold text-slate-500">{tableRows.length} Jurnal Penelitian</span>
            <button
              type="button"
              onClick={() => setFullTable(value => !value)}
              aria-pressed={fullTable}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 cursor-pointer"
            >
              {fullTable ? (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 2v4H2M10 2v4h4M6 14v-4H2M10 14v-4h4" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" />
                </svg>
              )}
              {fullTable ? "Perkecil" : "Layar penuh"}
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl outline outline-1 outline-offset-[-1px] outline-slate-200/80 md:rounded-2xl">
            <table className="w-[900px] table-fixed border-collapse text-left md:w-full">
              <thead>
                <tr className="bg-slate-50/90">
                  {headers.map((header, index) => (
                    <th
                      key={header}
                      className={`${columnWidths[index]} border-b border-slate-200/90 bg-slate-50/90 px-2 py-3 text-[12px] font-bold leading-5 text-slate-600 md:px-3 md:text-xs md:leading-5`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, index) => (
                  <tr key={row.study} className={index === 0 ? "" : "border-t border-slate-100"}>
                    <td className="px-2 py-3 align-top text-[12px] font-bold leading-5 text-slate-800 md:px-3 md:text-xs md:leading-5">{index + 1}</td>
                    <td className="px-2 py-3 align-top md:px-3">
                      <p className="text-[13px] font-bold leading-5 text-slate-900 md:text-xs md:leading-5">{row.study}</p>
                      <p className="pt-1 text-[11px] font-normal leading-4 text-slate-500 md:text-[11px] md:leading-4">{row.subtitle}</p>
                    </td>
                    <td className="px-2 py-3 align-top text-[12px] font-normal leading-5 text-slate-700 md:px-3 md:text-xs md:leading-5">{row.variabel}</td>
                    <td className="px-2 py-3 align-top text-[12px] font-normal leading-5 text-slate-700 md:px-3 md:text-xs md:leading-5">{row.teori}</td>
                    <td className="px-2 py-3 align-top text-[12px] font-normal leading-5 text-slate-700 md:px-3 md:text-xs md:leading-5">{row.metode}</td>
                    <td className="px-2 py-3 align-top text-[12px] font-normal leading-5 text-slate-700 md:px-3 md:text-xs md:leading-5">{row.hasil}</td>
                    <td className="px-2 py-3 align-top text-[12px] font-normal leading-5 text-slate-700 md:px-3 md:text-xs md:leading-5">{row.perbedaan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 border-t border-slate-100 bg-white px-5 pb-5 pt-4 md:justify-end md:px-8 md:py-6">
            <button
              type="button"
              onClick={copyTable}
              className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-semibold leading-5 shadow-xs transition-all active:scale-[0.98] md:order-1 md:flex-none md:rounded-xl md:px-5 md:py-2.5 ${
                isCopied
                  ? "border-sky-300 bg-sky-50 text-[#00629b] shadow-sm"
                  : "border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 hover:shadow-sm"
              }`}
            >
              {isCopied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 8.5l3.5 3.5 6.5-7" />
                  </svg>
                  Tersalin
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
                    <path d="M10.5 5.5v-1a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1" />
                  </svg>
                  Salin tabel
                </>
              )}
            </button>
            <button
              type="button"
              onClick={closeTable}
              className="flex-1 rounded-2xl bg-sky-700 py-4 text-sm font-bold leading-5 text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-sky-800 md:order-2 md:w-auto md:flex-none md:rounded-xl md:px-7 md:py-2.5 md:text-sm md:font-semibold"
            >
              Selesai
            </button>
        </div>
      </div>
    </div>
  );
}

function BuatSitasiModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeStyle, setActiveStyle] = useState<"apa" | "mla" | "chicago" | "harvard" | "bibtex">("apa");
  const [isCopied, setIsCopied] = useState(false);
  if (!open) return null;

  const doi = "https://doi.org/10.1108/APJML-03-2022-0214";
  const journal = "Asia Pacific Journal of Marketing and Logistics";
  const title = "Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges";
  const bibtex = `@article{wongkitrungrueng2023live,
  title={${title}},
  author={Wongkitrungrueng, A. and Assarut, N.},
  journal={${journal}},
  volume={40},
  number={3},
  pages={341--362},
  year={2023},
  doi={10.1108/APJML-03-2022-0214}
}`;

  const styles: Record<"apa" | "mla" | "chicago" | "harvard" | "bibtex", { label: string; before: string; after: string }> = {
    apa: {
      label: "APA",
      before: "Wongkitrungrueng, A., & Assarut, N. (2023). " + title + ". ",
      after: ".",
    },
    mla: {
      label: "MLA",
      before: "Wongkitrungrueng, A., and N. Assarut. \u201c" + title + ".\u201d ",
      after: ", vol. 40, no. 3, 2023, pp. 341\u2013362.",
    },
    chicago: {
      label: "Chicago",
      before: "Wongkitrungrueng, A., and Nopporn Assarut. \u201c" + title + ".\u201d ",
      after: " 40, no. 3 (2023): 341\u2013362.",
    },
    harvard: {
      label: "Harvard",
      before: "Wongkitrungrueng, A. and Assarut, N. (2023) \u2018" + title + "\u2019, ",
      after: ", 40(3), pp. 341\u2013362.",
    },
    bibtex: {
      label: "BibTeX",
      before: "",
      after: "",
    },
  };

  const active = styles[activeStyle];
  const plainText = activeStyle === "bibtex" ? bibtex : `${active.before}${journal}${active.after}\n${doi}`;

  const copyCitation = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(plainText);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = plainText;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[340] flex items-end justify-center bg-black/30 backdrop-blur-[2px] md:items-center md:p-4" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Buat sitasi jurnal"
        onClick={event => event.stopPropagation()}
        className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0px_20px_50px_0px_rgba(0,0,0,0.18)] md:max-h-[calc(100vh-32px)] md:w-[656px] md:max-w-full md:rounded-2xl md:pb-0 md:outline md:outline-1 md:outline-offset-[-1px] md:outline-slate-100"
      >
        <div className="flex shrink-0 justify-center pb-1 pt-3 md:hidden">
          <span className="h-1.5 w-16 rounded-full bg-slate-300" aria-hidden="true" />
        </div>

        <div className="flex items-center justify-between gap-3 px-6 pb-2 pt-2 md:px-7 md:pb-2 md:pt-6">
          <h2 className="font-['Inter:Bold'] text-xl font-bold leading-7 text-slate-900">Buat sitasi jurnal</h2>
          <button
            type="button"
            aria-label="Tutup sitasi"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 outline outline-1 outline-offset-[-1px] outline-slate-200 transition-colors hover:bg-slate-200 md:h-8 md:w-8 md:bg-transparent md:hover:bg-slate-50"
          >
            <svg width="12" height="12" viewBox="0 0 10 10" fill="none" stroke="#64748b" strokeWidth="1.47" strokeLinecap="round" aria-hidden="true">
              <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex shrink-0 gap-6 overflow-x-auto border-b border-slate-200 px-6 pt-3 [scrollbar-width:none] md:gap-7 md:overflow-x-visible md:px-7">
          {(Object.keys(styles) as Array<keyof typeof styles>).map(key => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveStyle(key)}
              aria-pressed={activeStyle === key}
              className={`shrink-0 border-b-[3px] pb-2.5 text-base leading-6 transition-colors md:text-sm md:leading-5 ${
                activeStyle === key
                  ? "border-sky-600 font-['Inter:Bold'] font-bold text-slate-900"
                  : "border-transparent font-['Inter:Medium'] font-medium text-slate-600 hover:text-slate-800"
              }`}
            >
              {styles[key].label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-3 pt-4 md:px-7 md:pb-2">
          {activeStyle === "bibtex" ? (
            <div className="min-h-36 rounded-2xl bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.02)] outline outline-1 outline-offset-[-1px] outline-slate-200">
              <pre className="whitespace-pre-wrap font-['JetBrains_Mono:Medium'] text-[13px] leading-6 text-slate-800">{bibtex}</pre>
            </div>
          ) : (
            <div className="flex min-h-36 flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.02)] outline outline-1 outline-offset-[-1px] outline-slate-200">
              <p className="font-['Inter:Regular'] text-[16px] font-normal leading-8 text-slate-800 md:text-sm md:leading-6">
                {active.before}
                <span className="italic">{journal}</span>
                {active.after}
              </p>
              <a
                href={doi}
                target="_blank"
                rel="noreferrer"
                className="break-words font-['Inter:Regular'] text-[16px] font-normal leading-8 text-sky-600 underline hover:text-sky-700 md:text-sm md:leading-6"
              >
                {doi}
              </a>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-slate-100 px-4 py-3 sm:px-6 md:gap-3 md:border-0 md:px-7 md:pb-7 md:pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none flex min-h-[44px] items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={copyCitation}
            className={`flex-1 sm:flex-none flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${
              isCopied
                ? "border border-sky-300 bg-sky-50 text-[#00629b] shadow-xs"
                : "bg-sky-600 text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-sky-700"
            }`}
          >
            {isCopied ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8.5l3.5 3.5 6.5-7" />
                </svg>
                Tersalin
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
                  <path d="M10.5 5.5v-1a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1" />
                </svg>
                Salin teks
              </>
            )}
          </button>
        </div>

        <div className="flex shrink-0 justify-center pb-2 pt-1 md:hidden">
          <span className="h-1.5 w-32 rounded-full bg-slate-300/80" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function AbstrakJurnalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [language, setLanguage] = useState<"id" | "original">("id");
  const [isCopied, setIsCopied] = useState(false);
  if (!open) return null;

  const abstracts: Record<"id" | "original", { label: string; text: string }> = {
    id: {
      label: "Bahasa Indonesia",
      text: "Penelitian ini mengkaji bagaimana interaksi parasosial antara pembawa acara dan penonton memengaruhi niat pembelian pada perdagangan melalui siaran langsung. Hasil menunjukkan bahwa kepercayaan kepada pembawa acara menjadi mekanisme penting, sementara pesan kelangkaan\u2014seperti keterbatasan stok dan waktu\u2014memperkuat urgensi untuk membeli. Temuan menegaskan bahwa kualitas hubungan sosial yang dirasakan konsumen dan desain pesan promosi perlu dipertimbangkan secara bersamaan.",
    },
    original: {
      label: "Bahasa asli jurnal",
      text: "This study examines how parasocial interaction between hosts and viewers influences purchase intention in live streaming commerce. The results show that trust in the host serves as a key mechanism, while scarcity messages, such as limited stock and time constraints, strengthen purchase urgency. The findings emphasize that consumers' perceived social relationship quality and promotional message design should be considered together.",
    },
  };

  const active = abstracts[language];
  const abstractTitle = "Live Streaming Commerce and Mimic Purchase Intention";

  const copyAbstract = async () => {
    const text = `${abstractTitle}\n\n${active.text}`;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[340] flex items-end justify-center bg-black/30 backdrop-blur-[2px] md:items-center md:p-4" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Abstrak Jurnal"
        onClick={event => event.stopPropagation()}
        className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0px_26.75px_53.5px_-12.84px_rgba(0,0,0,0.25)] md:max-h-[calc(100vh-32px)] md:w-[749px] md:max-w-full md:rounded-3xl md:pb-0 md:outline md:outline-1 md:outline-offset-[-1px] md:outline-slate-100"
      >
        <div className="flex shrink-0 justify-center pb-1 pt-3 md:hidden">
          <span className="h-1.5 w-16 rounded-full bg-slate-300" aria-hidden="true" />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-6 pb-4 pt-2 md:px-9 md:pb-9 md:pt-7">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-xl font-bold leading-7 text-slate-900 md:text-2xl md:leading-9">Abstrak Jurnal</h2>
            <button
              type="button"
              aria-label="Tutup abstrak jurnal"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 p-2.5 outline outline-1 outline-offset-[-1px] outline-slate-200 transition-colors hover:bg-slate-200 md:h-8 md:w-8 md:rounded-xl md:bg-white md:hover:bg-slate-50"
            >
              <svg width="10" height="10" viewBox="0 0 8 8" fill="none" stroke="#475569" strokeWidth="1.57" strokeLinecap="round" aria-hidden="true">
                <path d="M1 1l6 6M7 1l-6 6" />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {(Object.keys(abstracts) as Array<keyof typeof abstracts>).map(key => (
              <button
                key={key}
                type="button"
                onClick={() => setLanguage(key)}
                aria-pressed={language === key}
                className={`rounded-full px-3.5 py-1.5 font-['Plus_Jakarta_Sans:Medium'] text-[13px] font-medium leading-5 transition-colors md:py-1 md:text-xs md:leading-4 ${
                  language === key ? "bg-sky-100/90 text-sky-800" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {abstracts[key].label}
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl bg-sky-50 px-5 pb-5 pt-6 outline outline-1 outline-offset-[-1px] outline-sky-100">
            <div className="flex flex-col gap-2.5 border-l-4 border-sky-600 pl-3.5">
              <p className="font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold leading-6 text-slate-900">{abstractTitle}</p>
              <p className="font-['Plus_Jakarta_Sans:Regular'] text-[15px] font-normal leading-7 text-slate-700 md:text-sm md:leading-6">{active.text}</p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-slate-100 px-4 py-3 sm:px-6 md:border-0 md:px-9 md:pb-9 md:pt-0">
          <button
            type="button"
            onClick={copyAbstract}
            className={`flex flex-1 items-center justify-center min-h-[44px] gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] md:flex-none ${
              isCopied
                ? "border-sky-300 bg-sky-50 text-[#00629b] shadow-sm"
                : "border-slate-200/90 bg-white text-slate-800 shadow-[0px_2px_8px_rgba(0,0,0,0.08)] hover:bg-slate-50 hover:shadow-[0px_3px_10px_rgba(0,0,0,0.12)]"
            }`}
          >
            {isCopied ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8.5l3.5 3.5 6.5-7" />
                </svg>
                Tersalin
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0f172a" strokeWidth="1.3" aria-hidden="true">
                  <rect x="5" y="5.5" width="8" height="8.2" rx="1.5" />
                  <rect x="2" y="2" width="8" height="8.2" rx="1.5" />
                </svg>
                Salin
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex flex-1 items-center justify-center min-h-[44px] rounded-xl bg-sky-700 px-6 py-2.5 text-sm font-bold text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-sky-800 active:scale-[0.98] md:flex-none md:font-semibold"
          >
            Selesai
          </button>
        </div>

        <div className="flex shrink-0 justify-center pb-2 pt-1 md:hidden">
          <span className="h-1.5 w-32 rounded-full bg-slate-300/80" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function PdfPreviewModal({
  open,
  onClose,
  fileName,
  fileSize,
  fileUrl,
  fileObject,
}: {
  open: boolean;
  onClose: () => void;
  fileName: string;
  fileSize: string;
  fileUrl: string | null;
  fileObject: File | null;
}) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 22;
  const [activeTab, setActiveTab] = useState<"viewer" | "structured">("viewer");

  if (!open) return null;

  const isRealPdf = Boolean(fileUrl) && (fileName.toLowerCase().endsWith(".pdf") || fileObject?.type === "application/pdf");

  const handleDownload = () => {
    if (fileUrl) {
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = fileName || "naskah.pdf";
      a.click();
    } else {
      window.alert("Dokumen berhasil diunduh.");
    }
  };

  const handleOpenNewTab = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else {
      window.alert("Membuka dokumen di tab baru.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[360] flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-[3px] transition-opacity duration-200"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Pratinjau PDF"
        onClick={e => e.stopPropagation()}
        className="flex h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200/90 dark:bg-slate-900 dark:border-slate-800"
      >
        {/* Header Bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50/90 px-4 py-3 sm:px-6 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
            </span>
            <div className="min-w-0">
              <h3 className="truncate font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                {fileName || "Naskah_Skripsi_Bab_I_IV.pdf"}
              </h3>
              <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span>{fileSize || "1.0 MB"}</span>
                <span>•</span>
                <span>{totalPages} Halaman</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 sm:inline">
                  Siap Dianalisis
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Zoom Controls (Desktop) */}
            <div className="hidden items-center rounded-lg border border-slate-200 bg-white px-1 dark:border-slate-700 dark:bg-slate-800 md:flex">
              <button
                type="button"
                onClick={() => setZoom(z => Math.max(50, z - 15))}
                title="Perkecil"
                className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <span className="w-12 text-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                {zoom}%
              </span>
              <button
                type="button"
                onClick={() => setZoom(z => Math.min(180, z + 15))}
                title="Perbesar"
                className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>

            {/* Buka Tab Baru */}
            <button
              type="button"
              onClick={handleOpenNewTab}
              title="Buka di tab baru"
              className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 sm:flex"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>Tab Baru</span>
            </button>

            {/* Unduh */}
            <button
              type="button"
              onClick={handleDownload}
              title="Unduh PDF"
              className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-sky-700 active:scale-95"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="hidden sm:inline">Unduh</span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              title="Tutup"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sub-toolbar */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 py-2 text-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
              title="Halaman Sebelumnya"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Halaman <span className="font-bold text-slate-900 dark:text-white">{currentPage}</span> dari {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
              title="Halaman Selanjutnya"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab("viewer")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                activeTab === "viewer"
                  ? "bg-white text-sky-700 shadow-xs dark:bg-slate-700 dark:text-sky-300"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              {isRealPdf ? "Pratinjau PDF" : "Tampilan Dokumen"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("structured")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                activeTab === "structured"
                  ? "bg-white text-sky-700 shadow-xs dark:bg-slate-700 dark:text-sky-300"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              Struktur & Ekstraksi Teks
            </button>
          </div>
        </div>

        {/* Content Viewport */}
        <div className="relative min-h-0 flex-1 overflow-auto bg-slate-200/80 p-3 sm:p-6 dark:bg-slate-950/80">
          {activeTab === "viewer" && isRealPdf && fileUrl ? (
            <div
              className="mx-auto h-full w-full rounded-xl shadow-lg transition-transform"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
            >
              <iframe
                src={`${fileUrl}#page=${currentPage}&toolbar=0`}
                className="h-full w-full rounded-xl border border-slate-300 bg-white dark:border-slate-700"
                title="PDF Document"
              />
            </div>
          ) : (
            <div
              className="mx-auto max-w-3xl rounded-xl border border-slate-300/80 bg-white p-8 shadow-xl transition-transform dark:border-slate-800 dark:bg-slate-900 sm:p-12"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
            >
              {activeTab === "viewer" ? (
                <div className="space-y-6 text-slate-800 dark:text-slate-200 font-serif leading-relaxed">
                  <div className="border-b border-slate-200 pb-5 text-center dark:border-slate-800">
                    <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                      Naskah Penelitian / Draf Akademik
                    </p>
                    <h1 className="mt-2 text-xl font-bold font-sans text-slate-900 dark:text-white sm:text-2xl">
                      {fileName ? fileName.replace(/\.[^/.]+$/, "") : "Pengaruh Interaksi Parasosial dan Kelangkaan terhadap Minat Beli pada Live Streaming Commerce"}
                    </h1>
                    <p className="mt-2 text-xs font-sans text-slate-500 dark:text-slate-400">
                      Raka Aditya • Program Studi Manajemen • Universitas Brawijaya
                    </p>
                  </div>

                  {currentPage === 1 && (
                    <div className="space-y-5 text-sm">
                      <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-4 font-sans dark:border-sky-950 dark:bg-sky-950/30">
                        <h4 className="text-xs font-bold uppercase tracking-wide text-sky-800 dark:text-sky-300">
                          Abstrak Terdeteksi Alerin
                        </h4>
                        <p className="mt-1.5 text-xs leading-5 text-slate-700 dark:text-slate-300">
                          Penelitian ini bertujuan untuk menguji pengaruh interaksi parasosial dan pesan kelangkaan (scarcity nudges) terhadap niat beli konsumen dalam konteks siaran langsung perdagangan elektronik (live streaming commerce). Melalui pendekatan kuantitatif dengan model persamaan struktural (SEM-PLS), penelitian mengumpulkan data empiris untuk mengevaluasi peran mediasi kepercayaan konsumen.
                        </p>
                      </div>

                      <h3 className="font-sans text-base font-bold text-slate-900 dark:text-white">
                        BAB I. PENDAHULUAN
                      </h3>
                      <p>
                        Perkembangan teknologi digital dan media sosial telah mengubah lanskap perdagangan elektronik di Indonesia secara signifikan. Fenomena <em>live streaming commerce</em> kini menjadi strategi interaktif utama di mana pembawa acara (host) berinteraksi secara real-time dengan calon konsumen.
                      </p>
                      <p>
                        Meskipun volume transaksi terus meningkat, pemahaman mendalam mengenai faktor psikologis yang mendorong keputusan pembelian impulsif dan terencana masih memerlukan kajian empiris yang komprehensif. Hubungan emosional satu arah yang dirasakan penonton terhadap figur host—dikenal sebagai <strong>interaksi parasosial</strong>—diduga menjadi determinan kuat dalam membentuk kepercayaan dan niat beli.
                      </p>

                      <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50/60 p-3 font-sans text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                        <strong>Catatan Alerin:</strong> Bagian ini mengandung 3 variabel kunci: <em>Interaksi Parasosial</em>, <em>Pesan Kelangkaan</em>, dan <em>Niat Beli</em>. Cocok untuk pencarian rujukan bertopik SEM-PLS dan Consumer Behavior.
                      </div>
                    </div>
                  )}

                  {currentPage > 1 && (
                    <div className="space-y-5 text-sm">
                      <h3 className="font-sans text-base font-bold text-slate-900 dark:text-white">
                        {currentPage <= 5 ? "BAB II. TINJAUAN PUSTAKA & HIPOTESIS" : currentPage <= 12 ? "BAB III. METODOLOGI PENELITIAN" : "BAB IV. ANALISIS DATA & PEMBAHASAN"}
                      </h3>
                      <p>
                        Kerangka konseptual didasarkan pada integrasi Teori Penerimaan Teknologi (Technology Acceptance Model) dan Teori S-O-R (Stimulus-Organism-Response). Stimulus lingkungan berupa interaksi host bertindak sebagai pemicu reaksi afektif organisme (kepercayaan dan rasa keterikatan).
                      </p>
                      <p>
                        Berdasarkan telaah pustaka terhadap 45 artikel bereputasi internasional (Scopus Q1/Q2), hipotesis penelitian dirumuskan untuk mengukur pengaruh langsung dan tidak langsung dengan variabel moderasi keterbatasan waktu promo.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-5 font-sans">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Ringkasan Ekstraksi Dokumen
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Informasi penting yang diekstrak secara otomatis oleh Alerin Jurnal dari berkas naskah Anda.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Variabel Penelitian</span>
                      <ul className="mt-1.5 space-y-1 text-xs font-medium text-slate-800 dark:text-slate-200">
                        <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" /> Variabel X1: Interaksi Parasosial</li>
                        <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" /> Variabel X2: Pesan Kelangkaan (Scarcity)</li>
                        <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Variabel Z: Kepercayaan (Trust)</li>
                        <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Variabel Y: Niat Beli Konsumen</li>
                      </ul>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Metodologi Terdeteksi</span>
                      <ul className="mt-1.5 space-y-1 text-xs font-medium text-slate-800 dark:text-slate-200">
                        <li>Pendekatan: Kuantitatif Asosiatif</li>
                        <li>Alat Analisis: SEM-PLS (SmartPLS / WarpPLS)</li>
                        <li>Sampel: 250 Responden Konsumen E-Commerce</li>
                        <li>Skala Pengukuran: Likert 5 Poin</li>
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Potensi Rujukan Jurnal Relevan
                    </h4>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      Berdasarkan naskah ini, Alerin siap mencarikan jurnal rujukan dari <strong>OpenAlex</strong>, <strong>Crossref</strong>, dan <strong>SINTA</strong> yang memiliki kecocokan variabel di atas 90%.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Format: <span className="font-semibold text-slate-700 dark:text-slate-300">{fileName ? fileName.split('.').pop()?.toUpperCase() : "PDF"}</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-200 px-5 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function DesktopSearchResults({
  query,
  onBack,
  savedIds,
  onToggleSave,
  onOpenRingkasan,
  onOpenTabel,
  onOpenSitasi,
  onOpenAbstrak,
  onDiskusikan,
  onShowToast,
  analysis = false,
  fileName = "",
  quickSearchCategory = "topik",
}: {
  query: string;
  onBack: () => void;
  savedIds: string[];
  onToggleSave: (journal: (typeof desktopResultJournals)[number]) => void;
  onOpenRingkasan: () => void;
  onOpenTabel: () => void;
  onOpenSitasi: () => void;
  onOpenAbstrak: () => void;
  onDiskusikan?: (template: string) => void;
  onShowToast?: (message: string) => void;
  analysis?: boolean;
  fileName?: string;
  quickSearchCategory?: "topik" | "judul" | "penulis";
}) {
  const [temuanNav, setTemuanNav] = useState(0);
  const temuan = temuanAnalisis[temuanNav % temuanAnalisis.length];
  const [journalSlideIndex, setJournalSlideIndex] = useState(0);

  const [journals, setJournals] = useState<(typeof desktopResultJournals)[number][]>(desktopResultJournals);
  const [detailsMap, setDetailsMap] = useState<Record<string, ResultDetail>>(() => {
    const map: Record<string, ResultDetail> = {};
    desktopResultDetails.forEach(d => {
      map[d.id] = d;
    });
    return map;
  });
  const [isListRefreshing, setIsListRefreshing] = useState(false);

  const handleReplaceJournal = async (journalId: string, reasons: string[]) => {
    console.log("Proses Penggantian Jurnal:", { journalId, reasons });
    setIsListRefreshing(true);

    // AI Re-ranking & replacement simulation delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const currentJournals = [...journals];
    const idx = currentJournals.findIndex(j => j.id === journalId);
    if (idx === -1) {
      setIsListRefreshing(false);
      return;
    }

    const currentIds = currentJournals.map(j => j.id);
    const replacement =
      alternativeJournalsPool.find(j => !currentIds.includes(j.id)) ??
      alternativeJournalsPool[idx % alternativeJournalsPool.length];

    const newId = `${replacement.id}-${Date.now()}`;
    const updatedJournal = {
      id: newId,
      title: replacement.title,
      authors: replacement.authors,
      description: replacement.description,
      year: replacement.year,
      relevancy: replacement.relevancy,
      isReplaced: true,
    };

    const nextDetails = { ...detailsMap };
    nextDetails[newId] = {
      ...replacement.detail,
      id: newId,
      rank: "",
      isReplaced: true,
    };

    const nextJournals = [...currentJournals];
    nextJournals[idx] = updatedJournal;

    // Sort the 3 recommendations by relevancy percentage descending
    const parseScore = (r: string) => parseInt(r.replace(/\D/g, ""), 10) || 0;
    const sorted = [...nextJournals].sort((a, b) => parseScore(b.relevancy) - parseScore(a.relevancy));

    // Update ranks to maintain clean Rekomendasi 1, 2, 3 ordering
    sorted.forEach((j, rankIdx) => {
      const rankStr = `Rekomendasi ${rankIdx + 1}`;
      if (nextDetails[j.id]) {
        nextDetails[j.id] = {
          ...nextDetails[j.id],
          rank: rankStr,
        };
      }
    });

    setDetailsMap(nextDetails);
    setJournals(sorted);
    setIsListRefreshing(false);

    onShowToast?.("Jurnal berhasil diganti dan rekomendasi telah diurutkan!");
  };

  const renderKutipan = (text: string) => {
    const parts = text.split(/(keputusan pembelian|seluruh kelompok usia)/g);
    return parts.map((part, index) =>
      part === "keputusan pembelian" || part === "seluruh kelompok usia" ? (
        <span key={index} className="border-b-2 border-red-500 font-medium">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  if (query.trim() === "12345") {
    return (
      <div className="mx-auto hidden max-w-[1160px] md:flex min-h-[calc(100vh-140px)] flex-col pb-8">
        <div className="flex shrink-0 items-center justify-between gap-4">
          <div>
            <h1 className="font-['Inter:Bold'] text-2xl font-extrabold leading-8 text-slate-900">Hasil Pencarian Jurnal</h1>
            <p className="pt-1 text-xs leading-4 text-slate-500">
              Menampilkan hasil pencarian untuk kata kunci: &quot;12345&quot;
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-sky-700 px-6 py-2.5 text-sm font-bold leading-4 text-white shadow-xs transition-colors hover:bg-sky-800 cursor-pointer"
          >
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 6H2M5.5 2.5L2 6l3.5 3.5" />
            </svg>
            Kembali ke Pencarian
          </button>
        </div>

        <div className="my-auto w-full py-4">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-7 md:p-10 shadow-sm max-w-[1040px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.15fr] gap-8 md:gap-10 items-center">
              {/* Kolom Kiri: Ikon, Judul, Keterangan, dan Tombol Kembali (Berposisi di Tengah) */}
              <div className="flex flex-col items-center text-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-50 text-[#00629b] ring-8 ring-sky-50/60 shadow-xs">
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                    <path d="M8.5 8.5l5 5" />
                    <path d="M13.5 8.5l-5 5" />
                  </svg>
                </div>

                <h2 className="mt-5 font-['Plus_Jakarta_Sans:Bold'] text-2xl font-extrabold tracking-[-0.4px] text-slate-900">
                  Tidak ada jurnal yang ditemukan
                </h2>
                <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-slate-500">
                  Alerin tidak menemukan artikel atau referensi yang cocok dengan kata kunci{" "}
                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">&quot;12345&quot;</span>.
                  Coba periksa kembali ejaan atau gunakan topik penelitian yang lebih spesifik.
                </p>

                <button
                  type="button"
                  onClick={onBack}
                  className="mt-6 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-sky-700 px-7 py-3 text-sm font-bold text-white shadow-xs transition-all hover:bg-sky-800 active:scale-[0.98] cursor-pointer"
                >
                  <svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 6H2M5.5 2.5L2 6l3.5 3.5" />
                  </svg>
                  Kembali ke Pencarian
                </button>
              </div>

              {/* Kolom Kanan: Kotak Saran Pencarian */}
              <div className="rounded-2xl bg-slate-50/90 border border-slate-200/80 p-6 md:p-7 text-left h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
                  </svg>
                  <h3 className="text-sm font-bold text-slate-900">Saran untuk menemukan jurnal:</h3>
                </div>
                <ul className="space-y-3 text-xs sm:text-[13px] leading-relaxed text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <span className="text-sky-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>Gunakan kata kunci berupa topik riset, judul, atau nama penulis (contoh: <em>keputusan pembelian</em>, <em>digital marketing</em>, <em>artificial intelligence</em>).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-sky-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>Gunakan istilah dalam bahasa Indonesia maupun bahasa Inggris.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-sky-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>Hindari memasukkan kombinasi angka acak, kode serial, atau simbol khusus.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-sky-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>Gunakan fitur <strong>pencarian paragraf</strong> atau <strong>unggah dokumen</strong> di Beranda untuk pemeriksaan sitasi otomatis.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto hidden max-w-[1160px] md:block">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-['Inter:Bold'] text-2xl font-extrabold leading-8 text-slate-900">Rekomendasi yang paling relevan</h1>
        <button
          type="button"
          onClick={onBack}
          className="flex shrink-0 items-center gap-2 rounded-[10px] bg-sky-700 px-6 py-2 text-sm font-bold leading-4 text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
        >
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 6H2M5.5 2.5L2 6l3.5 3.5" />
          </svg>
          Kembali ke Pencarian
        </button>
      </div>

      <div className="mt-6 flex items-start gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {analysis && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                  <svg width="28" height="32" viewBox="0 0 14 16" fill="none" stroke="#64748b" strokeWidth="1.2" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 1.5h6l4 4v9H2z" />
                    <path d="M8 1.5v4h4" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold leading-5 text-slate-800">{fileName || "Skripsi_Nadia_Final.docx"}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-medium leading-4 text-sky-700">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <rect x="1.5" y="1.5" width="11" height="11" rx="2" fill="#0369a1" />
                      <path d="M4.5 7.2l1.8 1.8 3.2-3.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Pemeriksaan selesai
                  </p>
                  <p className="mt-1 text-xs leading-4 text-slate-400">42 halaman • 126 sitasi diperiksa</p>
                </div>
              </div>

              <div className="grid grid-cols-4 divide-x divide-slate-200/70 rounded-2xl border border-slate-200/90 bg-white py-5 text-center shadow-sm">
                {[
                  ["7", "Total temuan"],
                  ["3", "Sitasi tanpa daftar pustaka"],
                  ["2", "Referensi belum dikutip"],
                  ["2", "Data sitasi tidak cocok"],
                ].map(([value, label]) => (
                  <div key={label} className="px-3">
                    <p className="text-3xl font-extrabold leading-10 text-sky-600">{value}</p>
                    <p className="mt-0.5 text-[11px] font-bold leading-4 text-slate-600 md:text-xs">{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold leading-7 text-slate-900">Temuan {temuanNav + 1} dari 7</h2>
                  <span className="flex items-center gap-1.5 rounded-md bg-sky-100/70 px-3.5 py-1 text-sm font-semibold leading-4 text-sky-600">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0284c7" strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="2" width="10" height="12" rx="1.5" />
                      <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" strokeLinecap="round" />
                    </svg>
                    BAB II • Halaman {temuan.halaman}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-md bg-red-100/70 px-3 py-1 text-xs font-bold uppercase leading-4 tracking-tight text-red-600">
                    <span className="h-2.5 w-2.5 bg-red-600" aria-hidden="true" />
                    {temuan.badge}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Temuan sebelumnya"
                    onClick={() => setTemuanNav(current => (current - 1 + temuanAnalisis.length) % temuanAnalisis.length)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-slate-200"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M8.5 3L5 7l3.5 4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Temuan berikutnya"
                    onClick={() => setTemuanNav(current => (current + 1) % temuanAnalisis.length)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-slate-200"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5.5 3L9 7l-3.5 4" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid gap-4 min-[1180px]:grid-cols-2">
                <div className="rounded-2xl bg-white p-5 outline outline-1 outline-offset-[-1px] outline-slate-200/90">
                  <h3 className="text-base font-bold leading-5 text-slate-800">Bagian yang perlu diperbaiki</h3>
                  <div className="mt-4 rounded-xl bg-blue-50 p-5 outline outline-1 outline-offset-[-1px] outline-sky-600">
                    <p className="text-base leading-7 text-slate-800">{renderKutipan(temuan.kutipan)}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-5 outline outline-1 outline-offset-[-1px] outline-slate-200/90">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-100" aria-hidden="true">
                      <span className="h-3 w-3 bg-red-500" />
                    </span>
                    <h3 className="text-base font-bold leading-5 text-slate-800">Mengapa sitasi ini bermasalah?</h3>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {temuan.alasan.map(reason => (
                      <li key={reason} className="text-xs leading-4 text-zinc-800">
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 outline outline-1 outline-offset-[-1px] outline-slate-200/90">
                <h3 className="text-base font-bold leading-5 text-slate-800">Saran perbaikan Alerin</h3>
                <div className="mt-4 rounded-xl bg-blue-50 px-4 py-4 outline outline-1 outline-offset-[-1px] outline-sky-600">
                  <p className="text-sm font-medium leading-5 text-slate-800">{temuan.saran}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white px-2.5 py-1 text-[10px] font-medium leading-3 text-slate-800">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#334155" strokeWidth="1" aria-hidden="true">
                      <rect x="1.5" y="1.5" width="9" height="9" rx="1.5" />
                    </svg>
                    OpenAlex <span>+4</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {isListRefreshing ? (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2.5 rounded-xl bg-sky-50 px-4 py-3 text-xs font-semibold text-sky-800 border border-sky-200/80 animate-pulse">
                <svg className="h-4 w-4 animate-spin text-sky-600 shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Alerin sedang memperbarui rekomendasi dan menyusun kembali urutan relevansi...</span>
              </div>
              <JournalCardSkeleton rank="Rekomendasi 1" />
              <JournalCardSkeleton rank="Rekomendasi 2" />
              <JournalCardSkeleton rank="Rekomendasi 3" />
            </div>
          ) : analysis ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-xl bg-white px-5 py-3 outline outline-1 outline-offset-[-1px] outline-slate-200/90">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2.5" y="2" width="11" height="12" rx="1.5" />
                      <path d="M5 5h6M5 8h6M5 11h4" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-['Inter:Bold'] text-base font-bold text-slate-900">
                      Rekomendasi Jurnal Pengganti
                    </h3>
                    <p className="text-xs text-slate-500">
                      Slide {journalSlideIndex + 1} dari {journals.length} rekomendasi
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="mr-2 flex items-center gap-1.5">
                    {journals.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        aria-label={`Lihat rekomendasi slide ${idx + 1}`}
                        onClick={() => setJournalSlideIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          journalSlideIndex === idx ? "w-6 bg-sky-700" : "w-2 bg-slate-300 hover:bg-slate-400"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    aria-label="Rekomendasi sebelumnya"
                    disabled={journalSlideIndex === 0}
                    onClick={() => setJournalSlideIndex(curr => Math.max(0, curr - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M8.5 3L5 7l3.5 4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Rekomendasi berikutnya"
                    disabled={journalSlideIndex === journals.length - 1}
                    onClick={() => setJournalSlideIndex(curr => Math.min(journals.length - 1, curr + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5.5 3L9 7l-3.5 4" />
                    </svg>
                  </button>
                </div>
              </div>

              {(() => {
                const currentJournal = journals[journalSlideIndex] ?? journals[0];
                if (!currentJournal) return null;
                return (
                  <DesktopJournalResultCard
                    key={currentJournal.id}
                    relevancy={currentJournal.relevancy}
                    onAnalisis={onOpenRingkasan}
                    onSitasi={onOpenSitasi}
                    onAbstrak={onOpenAbstrak}
                    onDiskusikan={onDiskusikan}
                    journal={currentJournal}
                    detailOverride={detailsMap[currentJournal.id]}
                    saved={savedIds.includes(currentJournal.id)}
                    onToggleSave={() => onToggleSave(currentJournal)}
                    onReplaceJournal={handleReplaceJournal}
                  />
                );
              })()}
            </div>
          ) : (
            journals.map(journalItem => (
              <DesktopJournalResultCard
                key={journalItem.id}
                relevancy={journalItem.relevancy}
                onAnalisis={onOpenRingkasan}
                onSitasi={onOpenSitasi}
                onAbstrak={onOpenAbstrak}
                onDiskusikan={onDiskusikan}
                journal={journalItem}
                detailOverride={detailsMap[journalItem.id]}
                saved={savedIds.includes(journalItem.id)}
                onToggleSave={() => onToggleSave(journalItem)}
                onReplaceJournal={handleReplaceJournal}
              />
            ))
          )}
        </div>

        <aside className="sticky top-2 w-64 shrink-0 self-start space-y-4">
          <div className="rounded-2xl bg-white p-6">
          <h2 className="text-base font-bold leading-6 text-slate-900">Ringkasan Hasil Pencarian</h2>
          <p className="pt-1 text-xs leading-4 text-slate-500">
            Alerin menelusuri dan menyaring jurnal berdasarkan relevansi dengan pencarianmu untuk menampilkan hasil yang paling sesuai.
          </p>
          <div className="flex flex-col items-start gap-2 pt-4">
            <div className="w-full rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-semibold leading-relaxed text-slate-700 break-words">
              <span>Hasil Pencarian Dari: {query.trim() || "interaksi parasosial"} </span>
              {query.trim() && !isDoiFormat(query.trim()) && (
                <span className="inline-flex items-center align-middle rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-[#00629b] whitespace-nowrap ml-1">
                  {quickSearchCategory === "penulis" ? "Penulis" : quickSearchCategory === "judul" ? "Judul" : "Topik"}
                </span>
              )}
            </div>
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold leading-4 text-slate-700">Tahun: 2024–2026</span>
          </div>
          <div className="mt-5 border-t border-slate-200/70 pt-5 text-center">
            <p className="text-3xl font-extrabold leading-10 text-slate-900">4,2 juta</p>
            <p className="text-sm font-semibold leading-5 text-slate-600">Jurnal Tersedia</p>
          </div>
          <div className="mt-5 border-t border-slate-200/70 pt-5 text-center">
            <p className="text-3xl font-extrabold leading-10 text-slate-900">50</p>
            <p className="text-sm font-semibold leading-5 text-slate-600">Sesuai Filter</p>
          </div>
          <div className="mt-5 border-t border-slate-200/70 pt-5 text-center">
            <p className="text-3xl font-extrabold leading-10 text-sky-600">20</p>
            <p className="text-sm font-semibold leading-5 text-slate-600">Paling Relevan</p>
          </div>
          <button
            type="button"
            onClick={onOpenTabel}
            className="mt-5 w-full rounded-lg bg-sky-700 py-3 text-xs font-bold leading-4 text-white transition-colors hover:bg-sky-800"
          >
            Tabel penelitian terdahulu
          </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SortArrow({ dir }: { dir: "asc" | "desc" | null }) {
  return (
    <svg
      width="9"
      height="12"
      viewBox="0 0 9 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={dir === "desc" ? "rotate-180" : ""}
    >
      <path d="M1.5 4L4.5 1l3 3M1.5 8l3 3 3-3" />
    </svg>
  );
}

const priorityRows = (() => {
  const interleave = (...lists: string[][]) => {
    const out: string[] = [];
    const max = Math.max(...lists.map(list => list.length));
    for (let i = 0; i < max; i++) for (const list of lists) if (i < list.length) out.push(list[i]);
    return out;
  };
  const authorPool = [
    "Rahmawati, D. & Pratama, A.",
    "Hidayat, M. & Nugroho, A.",
    "Sari, N. & Wibowo, R.",
    "Lestari, P. & Kurniawan, B.",
    "Putri, A. & Santoso, D.",
    "Fajar, M. & Anggraini, S.",
  ];
  const head = [
    { title: "Resilience among Women in Disaster Contexts: A Systematic Literature Review", authors: authorPool[0], year: 2023, relevan: 97, tag: "Sangat relevan", kind: "Ulasan teori", source: "Google Scholar" },
    { title: "Gendered Impacts of Natural Disasters: A Global Review", authors: authorPool[1], year: 2022, relevan: 95, tag: "Sangat relevan", kind: "Ulasan teori", source: "Crossref" },
    { title: "Community Resilience and Women's Leadership in Disaster Recovery", authors: authorPool[2], year: 2021, relevan: 91, tag: "Perlu ditinjau", kind: "Ulasan teori", source: "OpenAlex" },
    { title: "The Role of Social Support in Post-Disaster Recovery for Women", authors: authorPool[3], year: 2020, relevan: 93, tag: "Sangat relevan", kind: "Ulasan teori", source: "DOAJ" },
    { title: "Digital Platforms for Women's Resilience in Crisis Situations: An Empirical Study", authors: authorPool[4], year: 2023, relevan: 90, tag: "Perlu ditinjau", kind: "Empiris", source: "Google Scholar" },
  ];
  const topics = [
    "Women's Resilience in Disasters",
    "Gendered Disaster Recovery",
    "Social Support after Crises",
    "Community Preparedness and Women",
    "Psychological Recovery of Survivors",
    "Digital Inclusion in Humanitarian Crises",
    "Women's Leadership in Emergency Response",
    "Livelihood Restoration after Hazards",
    "Coastal Community Vulnerability and Adaptation",
    "Care Networks in Post-Disaster Settings",
    "Gender Sensitivity in Humanitarian Aid",
    "Education Continuity for Displaced Children",
  ];
  const suffixes = [
    ": A Systematic Review",
    ": Evidence from Coastal Indonesia",
    ": A Mixed-Methods Study",
    ": A Scoping Review",
    ": Insights from ASEAN",
    ": Lessons from COVID-19",
    ": Longitudinal Perspectives",
    ": Policy Implications",
  ];
  const tags = interleave(
    Array.from({ length: 21 }, () => "Sangat relevan"),
    Array.from({ length: 36 }, () => "Perlu ditinjau"),
    Array.from({ length: 30 }, () => "Cukup relevan"),
  );
  const kinds = interleave(
    Array.from({ length: 8 }, () => "Ulasan teori"),
    Array.from({ length: 45 }, () => "Empiris"),
    Array.from({ length: 34 }, () => "Campuran"),
  );
  const sources = ["Google Scholar", "Crossref", "OpenAlex", "DOAJ"];
  const extra = Array.from({ length: 87 }, (_, index) => ({
    title: `${topics[index % topics.length]}${suffixes[Math.floor(index / topics.length) % suffixes.length]}`,
    authors: authorPool[index % authorPool.length],
    year: 2026 - (index % 7),
    relevan: Math.max(58, 94 - Math.floor(index * 0.42)),
    tag: tags[index],
    kind: kinds[index],
    source: sources[index % sources.length],
  }));
  return [...head, ...extra];
})();

const sourceLogos: Record<string, string> = {
  "Google Scholar": "/assets/source-logos/google-scholar.svg",
  Crossref: "/assets/source-logos/crossref.svg",
  OpenAlex: "/assets/source-logos/openalex.svg",
  DOAJ: "/assets/source-logos/doaj.svg",
};

const matrixRows = (() => {
  const curated = [
    {
      title: "Dukungan Sosial dan Modal Komunitas Perempuan Pasca Bencana",
      authors: "Sari, N., Rahmawati, D. & Lestari, A.",
      name: "Sari et al. (2022)",
      journal: "Jurnal Ketahanan Nasional",
      cells: ["Dukungan sosial perempuan pasca bencana", "Teori modal sosial dan resiliensi komunitas", "Kualitatif (wawancara mendalam)", "Jaringan sosial mempercepat pemulihan psikologis dan ekonomi.", "Menunjukkan peran sentral komunitas perempuan."]
    },
    {
      title: "Gender and Resource Access in Disaster Response and Preparedness",
      authors: "Ahmed, K. & Rahman, M.",
      name: "Ahmed & Rahman (2021)",
      journal: "International Journal of Disaster Risk Reduction",
      cells: ["Akses sumber daya pada tahap respon bencana", "Teori akses sumber daya dan kerentanan gender", "Mixed methods", "Keterbatasan akses informasi menghambat keterlibatan perempuan dalam pengambilan keputusan.", "Mengidentifikasi kesenjangan akses berbasis gender."]
    },
    {
      title: "Strategi Coping Religius dan Resiliensi Perempuan Korban Bencana",
      authors: "Putri, E. & Kusuma, W.",
      name: "Putri (2023)",
      journal: "Jurnal Ilmu Sosial dan Humaniora",
      cells: ["Strategi coping perempuan korban bencana", "Teori coping religius dan dukungan sosial", "Kualitatif (studi kasus)", "Strategi coping berbasis agama dan dukungan keluarga meningkatkan resiliensi.", "Memberikan perspektif lokal dalam konteks Indonesia."]
    },
    {
      title: "Women's Roles in Community-Based Disaster Risk Management in Southeast Asia",
      authors: "Nguyen, T., Tanaka, H. & Lim, C.",
      name: "Nguyen et al. (2020)",
      journal: "Global Environmental Change",
      cells: ["Peran perempuan dalam manajemen risiko bencana", "Teori kesiapsiagaan berbasis komunitas dan gender", "Kuantitatif (survei)", "Perempuan lebih aktif dalam kesiapsiagaan komunitas dibanding laki-laki.", "Data komparatif gender lintas negara Asia Tenggara."]
    },
  ];
  const authors = [
    "Pratama & Lestari",
    "Aisyah et al.",
    "Hidayat et al.",
    "Lim & Susanto",
    "Rahmawati & Dewi",
    "Kurniawan et al.",
    "Wongkitrungrueng & Assarut",
    "Saputra et al.",
    "Marinez & Wibowo",
    "Kusuma et al.",
    "Tanaka et al.",
    "Abdullah & Hafizah",
  ];
  const journals = [
    "Jurnal Ketahanan Nasional",
    "International Journal of Disaster Risk Reduction",
    "Jurnal Ilmu Sosial dan Humaniora",
    "Global Environmental Change",
    "Asia Pacific Journal of Public Health",
    "Disaster Prevention and Management",
    "Jurnal Perempuan dan Bencana",
    "Journal of Humanitarian Affairs",
  ];
  const fokus = [
    "Dukungan sosial perempuan pasca bencana",
    "Akses sumber daya pada tahap respon bencana",
    "Strategi coping perempuan korban bencana",
    "Peran perempuan dalam manajemen risiko bencana",
    "Kesiapsiagaan berbasis komunitas dan gender",
    "Pemulihan ekonomi keluarga terdampak",
    "Keterlibatan perempuan dalam pengambilan keputusan",
    "Adaptasi komunitas pesisir terhadap perubahan iklim",
  ];
  const teori = [
    "Teori modal sosial dan resiliensi komunitas",
    "Kerentanan gender dalam manajemen bencana",
    "Coping religius dan dukungan keluarga",
    "Partisipasi gender dalam kesiapsiagaan",
    "Pemberdayaan ekonomi rumah tangga",
    "Tata kelola inklusif dan partisipasi publik",
    "Literasi digital dan akses informasi",
    "Kolaborasi lintas sektor dan adaptasi iklim",
  ];
  const metode = [
    "Kualitatif (wawancara mendalam)",
    "Mixed methods",
    "Kualitatif (studi kasus)",
    "Kuantitatif (survei)",
    "Etnografi (partisipatif)",
    "Tinjauan sistematis",
    "Kuantitatif (panel longitudinal)",
    "Studi kohort prospektif",
  ];
  const temuan = [
    "Jaringan sosial mempercepat pemulihan psikologis dan ekonomi.",
    "Keterbatasan akses informasi menghambat keterlibatan perempuan dalam pengambilan keputusan.",
    "Strategi coping berbasis agama dan dukungan keluarga meningkatkan resiliensi.",
    "Perempuan lebih aktif dalam kesiapsiagaan komunitas dibanding laki-laki.",
    "Program pemberdayaan mikro meningkatkan ketahanan rumah tangga pasca bencana.",
    "Partisipasi perempuan dalam perencanaan penanggulangan menaikkan kualitas kebijakan lokal.",
    "Literasi digital memperluas akses bantuan darurat bagi kelompok rentan.",
    "Koordinasi lintas sektor memperpendek waktu pemulihan wilayah terdampak.",
  ];
  const kontribusi = [
    "Menunjukkan peran sentral komunitas perempuan.",
    "Mengidentifikasi kesenjangan akses berbasis gender.",
    "Memberikan perspektif lokal dalam konteks Indonesia.",
    "Data komparatif gender lintas negara Asia Tenggara.",
    "Model pemantauan kebutuhan dasar berbasis kearifan lokal.",
    "Rekomendasi indikator inklusi gender dalam kesiapsiagaan.",
    "Bukti empiris dampak platform digital pada daya tahan keluarga.",
    "Kerangka integrasi mitigasi dan adaptasi berbasis komunitas.",
  ];
  const generated = priorityRows.slice(4).map((row, index) => {
    const i = index + 4;
    return {
      title: row.title,
      authors: row.authors,
      name: `${authors[i % authors.length]} (${row.year})`,
      journal: journals[i % journals.length],
      cells: [fokus[i % fokus.length], teori[i % teori.length], metode[i % metode.length], temuan[i % temuan.length], kontribusi[i % kontribusi.length]],
    };
  });
  return [...curated, ...generated];
})();

const literatureDocSections = [
  {
    key: "1",
    title: "Ringkasan Utama",
    desc: "Inti temuan, faktor utama, dan arah sintesis",
    section: 1,
    content: [
      "Tinjauan literatur ini mengkaji 126 artikel yang tersaring menjadi 92 studi relevan tentang resiliensi perempuan dalam menghadapi bencana dan krisis. Temuan menunjukkan bahwa pemulihan perempuan sangat bergantung pada dukungan sosial, ketersediaan akses sumber daya ekonomi dan informasi, serta faktor individual/psikologis seperti koping berbasis agama dan keluarga.",
      "Kajian ini mengompilasi 92 artikel terpilih dari 126 hasil penelusuran setelah proses penghapusan duplikasi dan penyaringan berdasarkan kriteria inklusi. Sebagian besar studi menggunakan pendekatan kualitatif, dengan jumlah sampel yang terbatas, sehingga generalisasi temuan masih perlu kehati-hatian.",
      "Tiga faktor utama paling konsisten muncul lintas studi: dukungan sosial dari keluarga dan komunitas, akses sumber daya serta informasi pada tahap respon bencana, dan faktor individual/psikologis perempuan. Ketiadaan salah satu faktor terbukti memperlambat pemulihan psikologis pasca-bencana.",
      "Celah penelitian masih terbuka pada konteks Asia Tenggara, khususnya Indonesia, yang didominasi studi berskala kecil dan bersifat lokal. Dokumen ini menyusun sintesis dua belas bagian untuk menjawab kebutuhan tersebut sekaligus memetakan arah penelitian lanjutan.",
    ],
  },
  {
    key: "2",
    title: "Pendahuluan",
    desc: "Latar belakang, dinamika kerentanan gender, dan konteks kebencanaan",
    section: 2,
    content: [
      "Bagian ini memaparkan latar belakang penelitian tentang resiliensi perempuan dalam menghadapi bencana, termasuk dinamika kerentanan gender yang memperberat dampak bencana bagi perempuan.",
      "Konteks kebencanaan di Indonesia—mulai dari gempa, banjir, hingga pandemi—menjadi fokus utama karena tingginya frekuensi dan dampaknya terhadap kelompok rentan.",
      "Kerentanan yang berlapis membuat perempuan sering kali menjadi kelompok yang paling terdampak sekaligus paling cepat pulih ketika kebutuhan spesifiknya terpenuhi. Perbedaan akses terhadap informasi, ruang pengambilan keputusan, dan sumber daya ekonomi menjadi variabel pembeda yang muncul konsisten di banyak studi.",
      "Urgensi kajian ini juga ditopang oleh meningkatnya frekuensi bencana hidrometeorologi di kawasan Asia Tenggara. Kebijakan pemulihan yang netral gender berisiko memperlebar ketimpangan, sehingga sintesis bukti yang sistematis dibutuhkan untuk mengarahkan intervensi yang lebih tepat sasaran.",
    ],
  },
  {
    key: "3",
    title: "Metodologi dan Cakupan",
    desc: "Strategi pencarian, kriteria inklusi, dan seleksi 126 artikel",
    section: 3,
    content: [
      "Penelusuran dilakukan di lima basis data dengan kata kunci terkait resiliensi perempuan, bencana, dan pemulihan pasca-bencana, menghasilkan 126 artikel yang direduksi menjadi 92 studi setelah penyaringan.",
      "Kriteria inklusi mencakup publikasi 2020–2026, bahasa Indonesia dan Inggris, serta metode penelitian empiris maupun tinjauan sistematis.",
      "Penyaringan dilakukan secara bertahap melalui penghapusan duplikasi, penilaian judul dan abstrak, lalu telaah teks penuh. Dua penilai independen menilai kesesuaian studi dengan kriteria inklusi dan menyelesaikan perbedaan penilaian melalui diskusi konsensus.",
      "Risiko bias setiap studi dinilai menggunakan instrumen kritikal yang disesuaikan dengan desain penelitian, sementara kualitas pelaporan diperiksa terhadap ketersediaan data, kejelasan metode, dan keterbatasan yang diakui penulis.",
    ],
  },
  {
    key: "4",
    title: "Matriks Literatur",
    desc: "Fokus, teori, metode, temuan utama, dan kontribusi penelitian tiap studi",
    section: 4,
    content: [
      "Matriks merangkum fokus, teori, metode, temuan utama, dan kontribusi penelitian dari studi unggulan agar perbandingan lintas penelitian dapat dilakukan secara cepat.",
      "Setiap baris memuat sitasi lengkap dan basis sumber agar klaim dalam sintesis ini dapat diverifikasi kembali.",
      "Matriks menyusun setiap studi pada lima dimensi—fokus, teori, metode, temuan utama, dan kontribusi penelitian—sehingga pola kemiripan dan perbedaan antarkajian terlihat langsung tanpa harus membaca seluruh artikel.",
      "Kolom kontribusi penelitian menandai kebaruan tiap studi, sementara kolom celah memperlihatkan wilayah yang belum tergarap dan menjadi bahan penting bagi penyusunan sintesis pada bagian berikutnya.",
    ],
  },
  {
    key: "5",
    title: "Perbandingan Studi",
    desc: "Persamaan dan perbedaan metode serta temuan antar studi",
    section: 5,
    content: [
      "Studi-studi dibandingkan berdasarkan pendekatan metodologis, cakupan geografis, serta jenis temuan—memperlihatkan bahwa pendekatan kualitatif mendominasi literatur ini.",
      "Perbedaan utama terletak pada faktor yang ditekankan: jaringan sosial, akses sumber daya, maupun strategi coping individual.",
      "Secara metodologis, mayoritas studi mengandalkan wawancara mendalam dan studi kasus dengan jumlah partisipan terbatas. Beberapa penelitian kuantitatif mencoba mengukur tingkat resiliensi, tetapi instrumen yang digunakan belum seragam sehingga perbandingan langsung antarangka sulit dilakukan.",
      "Perbandingan lintas wilayah menunjukkan bahwa dukungan sosial lebih dominan pada konteks komunitas pedesaan, sedangkan akses layanan digital lebih menentukan pada wilayah perkotaan. Temuan ini menegaskan pemulihan yang efektif harus mempertimbangkan konteks lokal.",
    ],
  },
  {
    key: "6",
    title: "Pengelompokan Tema",
    desc: "Temuan utama dikelompokkan ke dalam lima tema besar",
    section: 6,
    content: [
      "Temuan utama dikelompokkan ke dalam lima tema: dukungan sosial, akses sumber daya, keterlibatan komunitas, faktor psikologis, dan pemanfaatan teknologi digital.",
      "Pengelompokan ini menjadi dasar penyusunan sintesis pada bagian selanjutnya.",
      "Lima tema besar yang teridentifikasi tidak berdiri sendiri, melainkan saling memperkuat. Misalnya, keterlibatan komunitas memperluas akses sumber daya, sementara faktor psikologis menentukan sejauh mana perempuan mampu memanfaatkan dukungan yang tersedia.",
      "Pemanfaatan teknologi digital muncul sebagai tema yang relatif baru dan tumbuh cepat, terutama pada masa pandemi, ketika layanan tatap muka terbatas dan jaringan daring menjadi kanal utama pemulihan ekonomi.",
    ],
  },
  {
    key: "7",
    title: "Sintesis",
    desc: "Integrasi temuan lintas studi menjadi satu narasi utuh",
    section: 7,
    content: [
      "Sintesis ini menunjukkan bahwa resiliensi perempuan bukan sifat bawaan, melainkan hasil interaksi dinamis antara faktor sosial, struktural, dan individual yang terbentuk sepanjang proses pemulihan.",
      "Dukungan sosial dari keluarga dan komunitas berperan sebagai fondasi emosional sekaligus sumber informasi praktis. Akses sumber daya—ekonomi, pendidikan, dan layanan kesehatan—menjadi prasyarat agar perempuan dapat mengambil keputusan strategis bagi keluarganya.",
      "Faktor individual seperti koping berbasis agama, ketangguhan keluarga, dan kepercayaan diri memperkuat kemampuan adaptasi, tetapi tidak dapat menggantikan peran struktur yang inklusif. Kombinasi ketiganya menentukan kecepatan pemulihan pasca-bencana.",
      "Secara keseluruhan, bukti yang tersintesis menegaskan bahwa intervensi pemulihan harus dirancang menyeluruh dan sensitif gender, bukan sekadar bantuan jangka pendek yang bersifat seragam.",
    ],
  },
  {
    key: "8",
    title: "Evaluasi dan Kritik",
    desc: "Penilaian kualitas bukti dan keterbatasan tiap studi",
    section: 8,
    content: [
      "Kualitas bukti yang tersedia beragam. Sebagian besar studi memiliki kekuatan pada kedalaman konteks, tetapi lemah dalam kemampuan generalisasi karena sampel berskala kecil dan terbatas pada satu lokasi.",
      "Beberapa penelitian tidak melaporkan secara rinci prosedur pengambilan sampel dan karakteristik partisipan, sehingga risiko bias seleksi sulit dinilai. Transparansi pelaporan masih menjadi titik lemah yang berulang.",
      "Definisi operasional resiliensi juga belum seragam: sebagian studi melihatnya sebagai kemampuan pulih, sebagian lain sebagai proses berkelanjutan. Perbedaan konseptual ini menyulitkan sintesis kuantitatif dan membuka ruang tafsir yang lebar.",
      "Meski demikian, keterbatasan tersebut tidak meniadakan nilai temuan. Pola yang konsisten lintas studi tetap memberi dasar yang cukup kuat untuk merumuskan implikasi praktis dan agenda penelitian berikutnya.",
    ],
  },
  {
    key: "9",
    title: "Research Gap",
    desc: "Celah penelitian yang belum terjawab dan arah lanjutan",
    section: 9,
    content: [
      "Celah paling menonjol adalah kelangkaan studi longitudinal yang mengikuti perempuan melewati siklus pemulihan jangka panjang. Sebagian besar penelitian bersifat potret sesaat dan gagal menangkap perubahan strategi adaptasi sepanjang waktu.",
      "Konteks Indonesia dan Asia Tenggara masih kurang terwakili meskipun wilayah ini menghadapi risiko bencana yang tinggi. Perbandingan lintas negara dengan latar budaya berbeda juga hampir tidak tersedia.",
      "Studi yang memisahkan pengalaman perempuan berdasarkan usia, status ekonomi, disabilitas, dan status perkawinan masih jarang, padahal kerentanan di dalam kelompok perempuan sendiri sangat berlapis.",
      "Selain itu, evaluasi dampak program pemulihan terhadap resiliensi belum banyak dilakukan, sehingga belum jelas intervensi mana yang benar-benar efektif dan layak diperluas.",
    ],
  },
  {
    key: "10",
    title: "Posisi Penelitian",
    desc: "Letak kebaruan penelitian dalam lanskap literatur",
    section: 10,
    content: [
      "Penelitian ini memposisikan diri sebagai sintesis yang melengkapi studi sebelumnya dengan menekankan keterkaitan antara dukungan sosial, akses sumber daya, dan faktor psikologis dalam satu kerangka utuh.",
      "Berbeda dari kajian yang berfokus pada satu faktor, penelitian ini menyoroti interaksi antarfaktor dan implikasinya bagi kebijakan pemulihan yang sensitif gender.",
      "Kebaruan lain terletak pada konteks Indonesia dan Asia Tenggara yang masih jarang dibandingkan secara sistematis, sehingga temuan dapat menjadi rujukan bagi penelitian serupa di wilayah lain.",
    ],
  },
  {
    key: "11",
    title: "Kesimpulan",
    desc: "Ringkasan jawaban dan implikasi penelitian",
    section: 11,
    content: [
      "Resiliensi perempuan pasca-bencana terbentuk dari kombinasi dukungan sosial, akses sumber daya, dan kapasitas individual yang saling memperkuat.",
      "Intervensi pemulihan perlu dirancang inklusif dan sensitif gender, dengan memperhatikan konteks lokal serta kebutuhan kelompok rentan.",
      "Keterbatasan bukti menuntut penelitian lanjutan yang lebih longitudinal, komparatif, dan representatif agar temuan dapat digeneralisasi secara lebih luas.",
    ],
  },
  {
    key: "12",
    title: "Daftar Pustaka",
    desc: "Referensi utama yang menjadi dasar sintesis",
    section: 12,
    content: [
      "Daftar pustaka memuat 92 studi terpilih yang menjadi dasar sintesis, mencakup artikel jurnal nasional dan internasional terbitan 2020–2026.",
      "Setiap entri disusun menurut gaya APA edisi ketujuh dan dilengkapi DOI bila tersedia agar dapat diverifikasi kembali.",
      "Referensi yang tidak memenuhi kriteria inklusi atau tidak dapat ditelusuri sumber aslinya tidak dimasukkan ke dalam daftar.",
    ],
  },
];

function FrameScrollIndicator({
  containerId = "alrin-main-scroll-container",
  className = "",
}: {
  containerId?: string;
  className?: string;
}) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbRatio, setThumbRatio] = useState(0.2);
  const timeoutRef = useRef<number | undefined>(undefined);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);

  const getScrollEl = useCallback(() => {
    const mobileResultsEl = document.getElementById("mobile-results-scroll-container");
    if (mobileResultsEl && mobileResultsEl.scrollHeight > mobileResultsEl.clientHeight + 2) {
      return mobileResultsEl;
    }
    const el = document.getElementById(containerId) || document.querySelector("main");
    if (el && el.scrollHeight > el.clientHeight + 2) return el;
    if (document.documentElement && document.documentElement.scrollHeight > document.documentElement.clientHeight + 2) {
      return document.documentElement;
    }
    return el || document.documentElement || document.body;
  }, [containerId]);

  const updateMetrics = useCallback((triggerShow = true) => {
    const scrollEl = getScrollEl();
    if (!scrollEl) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollEl;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      setIsScrolling(false);
      return;
    }
    const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
    const ratio = Math.max(0.1, Math.min(0.4, clientHeight / scrollHeight));
    setThumbRatio(ratio);
    setScrollProgress(progress);

    if (triggerShow) {
      setIsScrolling(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      if (!isDraggingRef.current) {
        timeoutRef.current = window.setTimeout(() => {
          setIsScrolling(false);
        }, 1000);
      }
    }
  }, [getScrollEl]);

  useEffect(() => {
    const scrollEl = getScrollEl();
    if (!scrollEl) return;

    const handleScroll = () => updateMetrics(true);

    scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    // Inisialisasi metrics tanpa memicu scrollbar muncul saat halaman pertama kali dibuka
    updateMetrics(false);

    return () => {
      scrollEl.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [getScrollEl, updateMetrics]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const scrollEl = getScrollEl();
    const track = trackRef.current;
    if (!scrollEl || !track) return;

    const rect = track.getBoundingClientRect();
    const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
    if (maxScroll <= 0) return;

    const trackHeight = rect.height;
    const thumbHeight = trackHeight * thumbRatio;
    const availableTrack = trackHeight - thumbHeight;
    if (availableTrack <= 0) return;

    const clickY = e.clientY - rect.top;
    const currentThumbTop = scrollProgress * availableTrack;

    // Cek apakah klik berada di dalam area thumb atau di luar
    const isNearThumb = clickY >= currentThumbTop - 3 && clickY <= currentThumbTop + thumbHeight + 3;

    if (!isNearThumb) {
      // Langsung loncat ke posisi yang diklik
      const targetThumbTop = clickY - thumbHeight / 2;
      const targetProgress = Math.min(1, Math.max(0, targetThumbTop / availableTrack));
      const nextScrollTop = targetProgress * maxScroll;
      scrollEl.scrollTop = nextScrollTop;
      setScrollProgress(targetProgress);
      dragStartScrollTop.current = nextScrollTop;
    } else {
      dragStartScrollTop.current = scrollEl.scrollTop;
    }

    isDraggingRef.current = true;
    setIsDragging(true);
    setIsScrolling(true);
    dragStartY.current = e.clientY;

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current) return;
      moveEvent.preventDefault();
      const deltaY = moveEvent.clientY - dragStartY.current;
      const deltaScroll = (deltaY / availableTrack) * maxScroll;
      const nextScrollTop = Math.min(maxScroll, Math.max(0, dragStartScrollTop.current + deltaScroll));
      scrollEl.scrollTop = nextScrollTop;
      setScrollProgress(nextScrollTop / maxScroll);
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      document.body.style.removeProperty("user-select");
      document.body.style.removeProperty("cursor");
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  };

  return (
    <div
      className={`fixed right-0 top-[68px] bottom-[72px] md:top-2 md:bottom-2 w-2.5 z-40 transition-opacity duration-300 ease-out select-none ${
        isScrolling || isDragging || isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Petunjuk garis scroll navigasi frame"
    >
      <div className="flex h-full w-full flex-col items-end pr-0.5 py-1">
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          className="group/track relative flex h-full w-full cursor-pointer items-center justify-end pr-0.5 select-none"
          title="Klik atau geser untuk menggulir halaman"
        >
          {/* Garis lintasan visual abu-abu ramping */}
          <div className="h-full w-1 rounded-full bg-slate-200/80 transition-colors group-hover/track:bg-slate-300/80" />

          {/* Thumb scrollbar abu-abu yang bisa digeser */}
          <div
            style={{
              height: `${Math.round(thumbRatio * 100)}%`,
              top: `${scrollProgress * (100 - thumbRatio * 100)}%`,
            }}
            className={`absolute w-1.5 rounded-full bg-slate-400 hover:bg-slate-500 active:bg-slate-600 cursor-grab active:cursor-grabbing shadow-2xs ${
              isDragging ? "" : "transition-[top] duration-75 ease-out"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

function DesktopLiteratureReview({
  query,
  onBack,
  onOpenSitasi,
  onOpenRingkasan,
  onOpenAbstrak,
  onSave,
  saved,
  onShowToast,
  onUpgrade,
  openedJournals: propOpenedJournals,
  onOpenJournal: propOnOpenJournal,
}: {
  query: string;
  onBack: () => void;
  onOpenSitasi: () => void;
  onOpenRingkasan?: () => void;
  onOpenAbstrak?: () => void;
  onSave: () => void;
  saved: boolean;
  onShowToast?: (msg: string) => void;
  onUpgrade?: () => void;
  openedJournals?: string[];
  onOpenJournal?: (title: string) => void;
}) {
  const docNavRows = literatureDocSections;
  const sectionNames = literatureDocSections.map(s => s.title);
  const is12345 = (query || "").trim() === "12345";
  const [localOpenedJournals, setLocalOpenedJournals] = useState<string[]>([]);
  const [localUpgradeConfirmOpen, setLocalUpgradeConfirmOpen] = useState(false);
  const openedJournals = propOpenedJournals ?? localOpenedJournals;

  const handleOpenJournalClick = (title: string) => {
    if (propOnOpenJournal) {
      propOnOpenJournal(title);
      return;
    }
    if (openedJournals.includes(title)) {
      window.open("https://doi.org", "_blank", "noopener,noreferrer");
      return;
    }
    if (openedJournals.length < 3) {
      const next = [...openedJournals, title];
      setLocalOpenedJournals(next);
      window.open("https://doi.org", "_blank", "noopener,noreferrer");
      if (next.length === 3) {
        onShowToast?.("Batas 3 jurnal gratis tercapai. Jurnal lainnya kini terkunci.");
      } else {
        onShowToast?.(`Jurnal dibuka (${next.length}/3 kuota gratis)`);
      }
    } else {
      setLocalUpgradeConfirmOpen(true);
    }
  };

  const stats = [
    { label: "Total hasil ditemukan", value: "126", tone: "text-[#0369a1]" },
    { label: "Duplikasi dihapus", value: "34", tone: "text-red-700" },
    { label: "Artikel tersisa untuk sintesis", value: "92", tone: "text-[#0369a1]" },
    { label: "Artikel prioritas tinggi", value: "24", tone: "text-[#0369a1]" },
  ];

  const filterChips = [
    { key: "semua", label: "Semua (92)" },
    { key: "relevan", label: "Prioritas tinggi (24)" },
    { key: "tinjau", label: "Perlu ditinjau (38)" },
    { key: "teori", label: "Ulasan teori (12)" },
    { key: "empiris", label: "Empiris (46)" },
  ];

  const matrixHeaders = ["Judul & Penulis", "Fokus", "Teori", "Metode", "Temuan Utama", "Kontribusi Penelitian"];

  const [savedJournalTitles, setSavedJournalTitles] = useState<string[]>([]);
  const toggleSaveJournal = (title: string) => {
    setSavedJournalTitles(prev => {
      const exists = prev.includes(title);
      if (exists) {
        if (onShowToast) onShowToast("Jurnal dihapus dari koleksi");
        return prev.filter(t => t !== title);
      } else {
        if (onShowToast) onShowToast("Jurnal berhasil disimpan ke koleksi");
        return [...prev, title];
      }
    });
  };

  const [chip, setChip] = useState("semua");
  const [prioritySearch, setPrioritySearch] = useState("");
  const [yearSort, setYearSort] = useState<"asc" | "desc" | null>(null);
  const [relevanSort, setRelevanSort] = useState<"asc" | "desc" | null>(null);
  const [matrixSearch, setMatrixSearch] = useState("");
  const [matrixSort, setMatrixSort] = useState<{ index: number; dir: "asc" | "desc" } | null>(null);
  const [activeSection, setActiveSection] = useState(1);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const docRef = useRef<HTMLElement | null>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Indikator Scroll Dinamis untuk Frame Jurnal yang Digunakan
  const priorityTableRef = useRef<HTMLDivElement | null>(null);
  const [isPriorityScrolling, setIsPriorityScrolling] = useState(false);
  const [priorityScrollProgress, setPriorityScrollProgress] = useState(0);
  const [priorityThumbRatio, setPriorityThumbRatio] = useState(0.25);
  const priorityScrollTimeout = useRef<number | undefined>(undefined);

  const handlePriorityTableScroll = () => {
    const el = priorityTableRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      setIsPriorityScrolling(false);
      return;
    }
    const ratio = Math.max(0.12, Math.min(0.8, clientHeight / scrollHeight));
    setPriorityThumbRatio(ratio);
    setPriorityScrollProgress(scrollTop / maxScroll);
    setIsPriorityScrolling(true);

    if (priorityScrollTimeout.current) window.clearTimeout(priorityScrollTimeout.current);
    priorityScrollTimeout.current = window.setTimeout(() => {
      setIsPriorityScrolling(false);
    }, 1200);
  };

  // Indikator Scroll Dinamis untuk Frame Matriks Literatur
  const matrixTableRef = useRef<HTMLDivElement | null>(null);
  const [isMatrixScrolling, setIsMatrixScrolling] = useState(false);
  const [matrixScrollProgress, setMatrixScrollProgress] = useState(0);
  const [matrixThumbRatio, setMatrixThumbRatio] = useState(0.25);
  const matrixScrollTimeout = useRef<number | undefined>(undefined);

  const handleMatrixTableScroll = () => {
    const el = matrixTableRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      setIsMatrixScrolling(false);
      return;
    }
    const ratio = Math.max(0.12, Math.min(0.8, clientHeight / scrollHeight));
    setMatrixThumbRatio(ratio);
    setMatrixScrollProgress(scrollTop / maxScroll);
    setIsMatrixScrolling(true);

    if (matrixScrollTimeout.current) window.clearTimeout(matrixScrollTimeout.current);
    matrixScrollTimeout.current = window.setTimeout(() => {
      setIsMatrixScrolling(false);
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (priorityScrollTimeout.current) window.clearTimeout(priorityScrollTimeout.current);
      if (matrixScrollTimeout.current) window.clearTimeout(matrixScrollTimeout.current);
    };
  }, []);

  const chipsScrollRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbRatio, setThumbRatio] = useState(0.35);

  const updateScrollProgress = useCallback(() => {
    if (chipsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = chipsScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
      const ratio = scrollWidth > 0 ? clientWidth / scrollWidth : 0.35;
      setThumbRatio(Math.max(0.18, Math.min(0.85, ratio)));
    }
  }, []);

  useEffect(() => {
    updateScrollProgress();
    const handleResize = () => updateScrollProgress();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateScrollProgress]);

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const initialScroll = chipsScrollRef.current ? chipsScrollRef.current.scrollLeft : 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!chipsScrollRef.current || !trackRef.current) return;
      const trackWidth = trackRef.current.clientWidth;
      const { scrollWidth, clientWidth } = chipsScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const thumbWidthPx = trackWidth * thumbRatio;
      const maxTravel = trackWidth - thumbWidthPx;
      if (maxTravel <= 0 || maxScroll <= 0) return;

      const deltaX = moveEvent.clientX - startX;
      const newScroll = initialScroll + (deltaX / maxTravel) * maxScroll;
      chipsScrollRef.current.scrollLeft = Math.max(0, Math.min(maxScroll, newScroll));
      updateScrollProgress();
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleThumbTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    const startX = touch.clientX;
    const initialScroll = chipsScrollRef.current ? chipsScrollRef.current.scrollLeft : 0;

    const onTouchMove = (moveEvent: TouchEvent) => {
      if (!chipsScrollRef.current || !trackRef.current) return;
      const moveTouch = moveEvent.touches[0];
      const trackWidth = trackRef.current.clientWidth;
      const { scrollWidth, clientWidth } = chipsScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const thumbWidthPx = trackWidth * thumbRatio;
      const maxTravel = trackWidth - thumbWidthPx;
      if (maxTravel <= 0 || maxScroll <= 0) return;

      const deltaX = moveTouch.clientX - startX;
      const newScroll = initialScroll + (deltaX / maxTravel) * maxScroll;
      chipsScrollRef.current.scrollLeft = Math.max(0, Math.min(maxScroll, newScroll));
      updateScrollProgress();
    };

    const onTouchEnd = () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };

    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || !chipsScrollRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const trackWidth = rect.width;
    const thumbWidthPx = trackWidth * thumbRatio;
    const centerClickProgress = (clickX - thumbWidthPx / 2) / (trackWidth - thumbWidthPx);
    const clampedProgress = Math.min(1, Math.max(0, centerClickProgress));
    const { scrollWidth, clientWidth } = chipsScrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    chipsScrollRef.current.scrollTo({ left: clampedProgress * maxScroll, behavior: "smooth" });
  };

  const goToSection = (section: number) => {
    setActiveSection(section);
    const row = docNavRows.find(item => item.section === section);
    if (row) {
      setOpenRow(row.key);
      window.setTimeout(() => rowRefs.current[row.key]?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
    } else {
      window.setTimeout(() => docRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    }
    if (chipsScrollRef.current) {
      const targetBtn = chipsScrollRef.current.children[section - 1] as HTMLElement | undefined;
      targetBtn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      setTimeout(updateScrollProgress, 350);
    }
  };

  const visiblePriority = (() => {
    let rows = priorityRows.filter(row => {
      if (chip === "relevan" && row.tag !== "Sangat relevan") return false;
      if (chip === "tinjau" && row.tag !== "Perlu ditinjau") return false;
      if (chip === "teori" && row.kind !== "Ulasan teori") return false;
      if (chip === "empiris" && row.kind !== "Empiris") return false;
      const q = prioritySearch.trim().toLowerCase();
      if (q && !row.title.toLowerCase().includes(q) && !row.source.toLowerCase().includes(q)) return false;
      return true;
    });
    if (yearSort) rows = [...rows].sort((a, b) => (yearSort === "desc" ? b.year - a.year : a.year - b.year));
    else if (relevanSort) rows = [...rows].sort((a, b) => (relevanSort === "desc" ? b.relevan - a.relevan : a.relevan - b.relevan));
    return rows;
  })();

  const visibleMatrix = (() => {
    const q = matrixSearch.trim().toLowerCase();
    let rows = matrixRows.filter(
      row =>
        !q ||
        (row.title && row.title.toLowerCase().includes(q)) ||
        (row.authors && row.authors.toLowerCase().includes(q)) ||
        row.name.toLowerCase().includes(q) ||
        row.journal.toLowerCase().includes(q) ||
        row.cells.some(cell => cell.toLowerCase().includes(q)),
    );
    if (matrixSort) {
      const { index, dir } = matrixSort;
      rows = [...rows].sort((a, b) => {
        const left = index === 0 ? (a.title || a.name).toLowerCase() : a.cells[index - 1].toLowerCase();
        const right = index === 0 ? (b.title || b.name).toLowerCase() : b.cells[index - 1].toLowerCase();
        return dir === "asc" ? left.localeCompare(right) : right.localeCompare(left);
      });
    }
    return rows;
  })();

  return (
    <div className="relative mx-auto hidden max-w-[1160px] flex-col gap-5 pb-8 md:flex">
      {/* Indikator Garis Penanda Scroll di Pinggir Kanan Frame */}
      <FrameScrollIndicator />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-['Inter:Bold'] text-2xl font-extrabold leading-8 text-slate-900">Hasil Literature Review</h1>
          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            Alerin telah menemukan jurnal yang relevan untuk membantu Anda menyusun literature review berdasarkan topik penelitian yang dipilih.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onSave}
            className={`flex items-center gap-2 rounded-[9.88px] px-4 py-2.5 text-sm font-bold leading-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 transition-all duration-150 active:scale-[0.98] cursor-pointer ${
              saved ? "bg-sky-50 text-sky-700 outline-sky-200 hover:bg-sky-100 hover:outline-sky-300 hover:shadow-xs" : "bg-white text-slate-700 outline-slate-200 hover:bg-sky-50 hover:text-sky-700 hover:outline-sky-300 hover:shadow-xs"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 2.5h8a1 1 0 0 1 1 1v10l-5-3-5 3v-10a1 1 0 0 1 1-1z" />
            </svg>
            {saved ? "Tersimpan" : "Simpan ke Koleksi"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-[9.88px] bg-sky-700 px-5 py-2.5 text-sm font-bold leading-5 text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
          >
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 6H2M5.5 2.5L2 6l3.5 3.5" />
            </svg>
            Kembali
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-2.5 shadow-sm">
        <div className="grid grid-cols-4 divide-x divide-slate-200/80">
          {stats.map(stat => (
            <div key={stat.label} className="px-6 py-4 text-center">
              <p className="text-base font-medium leading-6 text-slate-500">{stat.label}</p>
              <p className={`mt-2 text-2xl font-extrabold leading-8 ${stat.tone}`}>
                {stat.value} <span className="text-xl font-extrabold">artikel</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {is12345 && (
        <div className="flex items-center gap-3 rounded-2xl border border-sky-200/90 bg-sky-50/90 px-5 py-3.5 shadow-2xs">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00629b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-[#00629b]"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="min-w-0 flex-1 text-sm font-medium leading-relaxed text-[#003859]">
            Pencarian menghasilkan 500 artikel relevan dari target 1.000 artikel. Jumlah ini disesuaikan dengan ketersediaan literatur yang relevan dengan topik Anda.
          </p>
        </div>
      )}

      <section className="rounded-2xl bg-white shadow-sm">
        <div className="flex items-start justify-between gap-4 p-5">
          <div>
            <h2 className="text-lg font-bold leading-7 text-slate-900">Jurnal yang Digunakan</h2>
            <p className="mt-0.5 text-sm leading-5 text-slate-500">Daftar jurnal yang menjadi sumber penyusunan literature review.</p>
          </div>
          <label className="flex h-10 w-full shrink-0 items-center gap-2.5 rounded-xl border border-slate-300 bg-slate-50/90 px-3.5 shadow-sm transition-colors hover:border-slate-400 hover:bg-white focus-within:border-sky-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100 md:w-80">
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className="shrink-0">
              <circle cx="6" cy="6" r="4.5" />
              <path d="M9.5 9.5L13 13" />
            </svg>
            <input
              value={prioritySearch}
              onChange={event => setPrioritySearch(capitalizeFirstLetter(event.target.value))}
              placeholder="Cari judul, penulis, atau kata kunci..."
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="relative mt-4">
          <div
            ref={priorityTableRef}
            onScroll={handlePriorityTableScroll}
            className="max-h-[480px] overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr className="bg-slate-50/70 border-b border-slate-200/80">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500">Judul & Penulis</th>
                  <th className="px-5 py-3 w-28">
                    <button
                      type="button"
                      onClick={() => {
                        setRelevanSort(null);
                        setYearSort(yearSort === "desc" ? "asc" : "desc");
                      }}
                      className={`flex items-center gap-1.5 text-xs font-semibold ${yearSort ? "text-[#0369a1]" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      Tahun
                      <SortArrow dir={yearSort} />
                    </button>
                  </th>
                  <th className="px-5 py-3 w-40">
                    <button
                      type="button"
                      onClick={() => {
                        setYearSort(null);
                        setRelevanSort(relevanSort === "desc" ? "asc" : "desc");
                      }}
                      className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${relevanSort ? "text-[#0369a1]" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      Relevansi
                      <SortArrow dir={relevanSort} />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 w-44">Sumber</th>
                </tr>
              </thead>
              <tbody>
                {visiblePriority.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-400">
                      Tidak ada artikel yang cocok dengan pencarianmu.
                    </td>
                  </tr>
                )}
                {visiblePriority.map(row => {
                  const isOpened = openedJournals.includes(row.title);
                  const isLocked = !isOpened && openedJournals.length >= 3;
                  return (
                    <tr key={row.title} className="border-t border-slate-100 transition-colors hover:bg-slate-50/50">
                      <td className="max-w-[460px] px-5 py-4">
                        <p className="font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold leading-snug text-slate-900">
                          {row.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 font-normal">
                          {row.authors} · {row.source}
                        </p>
                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={isLocked ? () => handleOpenJournalClick(row.title) : (() => (onOpenRingkasan ? onOpenRingkasan() : (onOpenAbstrak ? onOpenAbstrak() : undefined)))}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium shadow-2xs transition-all active:scale-95 cursor-pointer ${
                              isLocked
                                ? "border-sky-300 bg-sky-50/85 text-[#00629b] hover:bg-sky-100/90"
                                : "border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                            title={isLocked ? "Terkunci - Batas 3 jurnal akun gratis tercapai" : "Ringkasan Jurnal"}
                          >
                            {isLocked && (
                              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#00629b]">
                                <rect x="3" y="7" width="10" height="7" rx="1.5" />
                                <path d="M5.5 7V4.5a2.5 2.5 0 0 1 5 0V7" />
                                <circle cx="8" cy="10.5" r="0.8" fill="currentColor" />
                              </svg>
                            )}
                            Ringkasan Jurnal
                          </button>
                          <button
                            type="button"
                            onClick={isLocked ? () => handleOpenJournalClick(row.title) : (() => onOpenSitasi())}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium shadow-2xs transition-all active:scale-95 cursor-pointer ${
                              isLocked
                                ? "border-sky-300 bg-sky-50/85 text-[#00629b] hover:bg-sky-100/90"
                                : "border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                            title={isLocked ? "Terkunci - Batas 3 jurnal akun gratis tercapai" : "Sitasi"}
                          >
                            {isLocked && (
                              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#00629b]">
                                <rect x="3" y="7" width="10" height="7" rx="1.5" />
                                <path d="M5.5 7V4.5a2.5 2.5 0 0 1 5 0V7" />
                                <circle cx="8" cy="10.5" r="0.8" fill="currentColor" />
                              </svg>
                            )}
                            Sitasi
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenJournalClick(row.title)}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium shadow-2xs transition-all active:scale-95 cursor-pointer ${
                              isLocked
                                ? "border-sky-300 bg-sky-50/85 text-[#00629b] hover:bg-sky-100/90"
                                : "border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                            title={isLocked ? "Terkunci - Batas 3 jurnal akun gratis tercapai" : "Buka jurnal"}
                          >
                            {isLocked ? (
                              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#00629b]">
                                <rect x="3" y="7" width="10" height="7" rx="1.5" />
                                <path d="M5.5 7V4.5a2.5 2.5 0 0 1 5 0V7" />
                                <circle cx="8" cy="10.5" r="0.8" fill="currentColor" />
                              </svg>
                            ) : (
                              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                                <path d="M12 9v4H3V4h4M9 2h5v5M6.5 9.5L14 2" />
                              </svg>
                            )}
                            Buka
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-slate-600 align-top">{row.year}</td>
                      <td className="px-5 py-4 align-top">
                        <span
                          className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            row.tag === "Sangat relevan"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : row.tag === "Cukup relevan"
                                ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                                : "bg-amber-50 text-amber-700 border border-amber-200/60"
                          }`}
                        >
                          {row.tag === "Sangat relevan" ? "Prioritas tinggi" : (row.tag || "Prioritas tinggi")}
                        </span>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <span className="flex items-center gap-2">
                          <img
                            src={sourceLogos[row.source] ?? "/assets/source-logos/openalex.svg"}
                            alt=""
                            className="h-5 w-5 shrink-0 object-contain rounded"
                          />
                          <span className="text-sm font-medium text-slate-700">{row.source}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Garis Penanda Scroll di Pinggir Frame - Bisa Diklik dan Digeser */}
          <div
            className={`pointer-events-auto absolute right-1 top-2 bottom-2 w-3 z-20 flex items-center justify-center cursor-pointer transition-opacity duration-300 ease-out select-none ${
              isPriorityScrolling ? "opacity-100" : "opacity-40 hover:opacity-100"
            }`}
            onPointerDown={e => {
              e.preventDefault();
              const scrollEl = priorityTableRef.current;
              const track = e.currentTarget;
              if (!scrollEl || !track) return;
              const rect = track.getBoundingClientRect();
              const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
              if (maxScroll <= 0) return;
              const trackHeight = rect.height;
              const thumbHeight = trackHeight * priorityThumbRatio;
              const availableTrack = trackHeight - thumbHeight;
              if (availableTrack <= 0) return;
              const clickY = e.clientY - rect.top;
              const currentThumbTop = priorityScrollProgress * availableTrack;
              if (clickY < currentThumbTop - 3 || clickY > currentThumbTop + thumbHeight + 3) {
                const targetThumbTop = clickY - thumbHeight / 2;
                const nextProgress = Math.min(1, Math.max(0, targetThumbTop / availableTrack));
                scrollEl.scrollTop = nextProgress * maxScroll;
                setPriorityScrollProgress(nextProgress);
              }
              setIsPriorityScrolling(true);
              const startY = e.clientY;
              const startScroll = scrollEl.scrollTop;
              const onMove = (me: PointerEvent) => {
                me.preventDefault();
                const deltaY = me.clientY - startY;
                scrollEl.scrollTop = Math.min(maxScroll, Math.max(0, startScroll + (deltaY / availableTrack) * maxScroll));
              };
              const onUp = () => {
                window.removeEventListener("pointermove", onMove);
                window.removeEventListener("pointerup", onUp);
                window.removeEventListener("pointercancel", onUp);
                document.body.style.removeProperty("user-select");
                document.body.style.removeProperty("cursor");
                window.setTimeout(() => setIsPriorityScrolling(false), 1000);
              };
              document.body.style.userSelect = "none";
              document.body.style.cursor = "grabbing";
              window.addEventListener("pointermove", onMove);
              window.addEventListener("pointerup", onUp);
              window.addEventListener("pointercancel", onUp);
            }}
            title="Klik atau geser untuk menggulir"
          >
            <div className="relative h-full w-1.5 rounded-full bg-slate-200/60">
              <div
                style={{
                  height: `${priorityThumbRatio * 100}%`,
                  top: `${priorityScrollProgress * (1 - priorityThumbRatio) * 100}%`,
                }}
                className="absolute w-full rounded-full bg-[#00629b] shadow-xs cursor-grab active:cursor-grabbing hover:bg-[#004f80]"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1.5 rounded-full bg-[#0369a1]" />
          <h2 className="text-2xl font-bold leading-8 text-slate-900">Hasil Analisis Literature Review</h2>
        </div>
        <p className="text-sm text-slate-500">Resiliensi perempuan dalam menghadapi bencana dan krisis</p>
      </div>

      <section className="rounded-2xl bg-white shadow-sm">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 p-5">
          <div>
            <h2 className="text-lg font-bold leading-7 text-slate-900">Matriks Literatur</h2>
            <p className="mt-0.5 text-sm leading-5 text-slate-500">
              Daftar studi yang dianalisis beserta fokus, teori, metode, temuan utama, dan kontribusi penelitian.
            </p>
          </div>
          <label className="flex h-10 w-full shrink-0 items-center gap-2.5 rounded-xl border border-slate-300 bg-slate-50/90 px-3.5 shadow-sm transition-colors hover:border-slate-400 hover:bg-white focus-within:border-sky-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100 md:w-80">
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className="shrink-0">
              <circle cx="6" cy="6" r="4.5" />
              <path d="M9.5 9.5L13 13" />
            </svg>
            <input
              value={matrixSearch}
              onChange={event => setMatrixSearch(capitalizeFirstLetter(event.target.value))}
              placeholder="Cari dalam matriks..."
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="relative">
          <div
            ref={matrixTableRef}
            onScroll={handleMatrixTableScroll}
            className="max-h-[640px] overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <table className="w-full min-w-[1180px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/60">
                  {matrixHeaders.map((header, index) => (
                    <th key={header} className="sticky top-0 z-10 bg-slate-50/60 px-5 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          setMatrixSort(current =>
                            current && current.index === index ? { index, dir: current.dir === "asc" ? "desc" : "asc" } : { index, dir: "asc" },
                          )
                        }
                        className={`flex items-center gap-1.5 text-xs font-semibold ${
                          matrixSort?.index === index ? "text-[#0369a1]" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {header}
                        <SortArrow dir={matrixSort?.index === index ? matrixSort.dir : null} />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleMatrix.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-400">
                      Tidak ada baris yang cocok dengan pencarianmu.
                    </td>
                  </tr>
                )}
                {visibleMatrix.map((row, rowIndex) => (
                  <tr key={`${row.title || row.name}-${rowIndex}`} className="border-t border-slate-100 align-top">
                    <td className="w-80 min-w-[280px] px-5 py-4">
                      <span className="block font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold leading-snug text-slate-900">{row.title || row.name}</span>
                      <span className="mt-1 block text-xs font-normal leading-4 text-slate-500">{row.authors || row.journal}</span>
                    </td>
                    {row.cells.map((cell, index) => (
                      <td key={index} className="px-5 py-4 text-sm leading-5 text-slate-600">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Garis Penanda Scroll di Pinggir Frame Matriks - Bisa Diklik dan Digeser */}
          <div
            className={`pointer-events-auto absolute right-1 top-2 bottom-2 w-3 z-20 flex items-center justify-center cursor-pointer transition-opacity duration-300 ease-out select-none ${
              isMatrixScrolling ? "opacity-100" : "opacity-40 hover:opacity-100"
            }`}
            onPointerDown={e => {
              e.preventDefault();
              const scrollEl = matrixTableRef.current;
              const track = e.currentTarget;
              if (!scrollEl || !track) return;
              const rect = track.getBoundingClientRect();
              const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
              if (maxScroll <= 0) return;
              const trackHeight = rect.height;
              const thumbHeight = trackHeight * matrixThumbRatio;
              const availableTrack = trackHeight - thumbHeight;
              if (availableTrack <= 0) return;
              const clickY = e.clientY - rect.top;
              const currentThumbTop = matrixScrollProgress * availableTrack;
              if (clickY < currentThumbTop - 3 || clickY > currentThumbTop + thumbHeight + 3) {
                const targetThumbTop = clickY - thumbHeight / 2;
                const nextProgress = Math.min(1, Math.max(0, targetThumbTop / availableTrack));
                scrollEl.scrollTop = nextProgress * maxScroll;
                setMatrixScrollProgress(nextProgress);
              }
              setIsMatrixScrolling(true);
              const startY = e.clientY;
              const startScroll = scrollEl.scrollTop;
              const onMove = (me: PointerEvent) => {
                me.preventDefault();
                const deltaY = me.clientY - startY;
                scrollEl.scrollTop = Math.min(maxScroll, Math.max(0, startScroll + (deltaY / availableTrack) * maxScroll));
              };
              const onUp = () => {
                window.removeEventListener("pointermove", onMove);
                window.removeEventListener("pointerup", onUp);
                window.removeEventListener("pointercancel", onUp);
                document.body.style.removeProperty("user-select");
                document.body.style.removeProperty("cursor");
                window.setTimeout(() => setIsMatrixScrolling(false), 1000);
              };
              document.body.style.userSelect = "none";
              document.body.style.cursor = "grabbing";
              window.addEventListener("pointermove", onMove);
              window.addEventListener("pointerup", onUp);
              window.addEventListener("pointercancel", onUp);
            }}
            title="Klik atau geser untuk menggulir"
          >
            <div className="relative h-full w-1.5 rounded-full bg-slate-200/60">
              <div
                style={{
                  height: `${matrixThumbRatio * 100}%`,
                  top: `${matrixScrollProgress * (1 - matrixThumbRatio) * 100}%`,
                }}
                className="absolute w-full rounded-full bg-[#00629b] shadow-xs cursor-grab active:cursor-grabbing hover:bg-[#004f80]"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="flex min-w-0 items-center gap-3">
          <span className="h-8 w-1.5 shrink-0 rounded-full bg-[#0369a1]" />
          <h2 className="text-2xl font-extrabold leading-8 text-slate-900">Literature Review Siap Digunakan</h2>
        </div>
        <details className="group relative shrink-0 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline outline-1 outline-slate-200 transition-colors hover:bg-slate-50">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-slate-600">
              <path d="M2.5 10v3a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-3" />
              <path d="M8 2.5v7.5M5 7l3 3 3-3" />
            </svg>
            Ekspor File
            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" className="transition-transform group-open:rotate-180">
              <path d="M1 1l5 5 5-5" />
            </svg>
          </summary>
          <div className="absolute right-0 top-full z-20 mt-2 w-40 overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
            <button
              type="button"
              onClick={event => {
                window.alert("Dokumen berhasil diekspor ke PDF.");
                event.currentTarget.closest("details")?.removeAttribute("open");
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-red-600">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              <span className="font-semibold text-slate-800">Unduh PDF</span>
            </button>
            <button
              type="button"
              onClick={event => {
                window.alert("Dokumen berhasil diekspor ke DOCX.");
                event.currentTarget.closest("details")?.removeAttribute("open");
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-blue-600">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span className="font-semibold text-slate-800">Unduh DOCX</span>
            </button>
          </div>
        </details>
      </div>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0369a1" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M2.5 4h11M2.5 8h11M2.5 12h7" />
              </svg>
            </span>
            <span className="text-sm font-bold uppercase tracking-wide text-slate-800">Struktur Dokumen (12 Bagian)</span>
          </div>
          <span className="text-xs font-semibold text-[#0369a1]">Bagian {activeSection} dari 12</span>
        </div>

        {/* Kontainer Scroll Chip */}
        <div
          ref={chipsScrollRef}
          onScroll={updateScrollProgress}
          className="mt-4 flex gap-2.5 overflow-x-auto pb-1 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sectionNames.map((name, index) => (
            <button
              key={name}
              type="button"
              onClick={() => goToSection(index + 1)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                activeSection === index + 1
                  ? "bg-sky-50 text-sky-700 outline outline-1 outline-sky-200"
                  : "bg-slate-50 text-slate-600 outline outline-1 outline-slate-200 hover:bg-slate-100"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white ${
                  activeSection === index + 1 ? "bg-[#0369a1]" : "bg-slate-600"
                }`}
              >
                {index + 1}
              </span>
              {name}
            </button>
          ))}
        </div>

        {/* Garis scrollbar di bawah yang bisa digeser-geser */}
        <div className="mt-3 w-full px-0.5">
          <div
            ref={trackRef}
            onClick={handleTrackClick}
            className="group relative h-1.5 w-full rounded-full bg-slate-200/90 cursor-pointer overflow-hidden transition-all hover:h-2"
            title="Geser garis untuk melihat bagian lainnya"
            aria-label="Garis geser bagian dokumen"
          >
            <div
              onMouseDown={handleThumbMouseDown}
              onTouchStart={handleThumbTouchStart}
              style={{
                width: `${thumbRatio * 100}%`,
                left: `${scrollProgress * (1 - thumbRatio) * 100}%`,
              }}
              className="absolute top-0 bottom-0 rounded-full bg-slate-400 group-hover:bg-[#00629b] active:bg-[#004f80] transition-colors cursor-grab active:cursor-grabbing shadow-2xs"
            />
          </div>
        </div>
      </section>

      <section ref={docRef} className="rounded-3xl bg-white p-11 shadow-sm">
        <div className="space-y-3">
          {docNavRows.map(row => (
            <div
              key={row.key}
              ref={element => {
                rowRefs.current[row.key] = element;
              }}
              className="overflow-hidden rounded-2xl bg-slate-50"
            >
              <button
                type="button"
                onClick={() => {
                  setActiveSection(row.section);
                  setOpenRow(openRow === row.key ? null : row.key);
                }}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-100"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-[#0369a1] outline outline-1 outline-slate-200">
                  {row.key}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold leading-6 text-slate-800">{row.title}</span>
                  <span className="block text-sm leading-5 text-slate-500">{row.desc}</span>
                </span>
                <svg
                  width="8"
                  height="13"
                  viewBox="0 0 8 13"
                  fill="none"
                  stroke="#0369a1"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={`transition-transform ${openRow === row.key ? "rotate-90" : ""}`}
                >
                  <path d="M1.5 1.5L6.5 6.5l-5 5" />
                </svg>
              </button>
              {openRow === row.key && (
                <div className="border-t border-slate-200/70 px-5 py-5">
                  <div className="flex items-start gap-2.5">
                    <span className="shrink-0 text-2xl font-bold leading-8 text-slate-900 select-none">
                      {row.key}.
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-2xl font-bold leading-8 text-slate-900">
                        {row.title}
                      </h3>
                      <div className="mt-4 space-y-4">
                        {row.content.map((paragraph, pIdx) => (
                          <p key={pIdx} className="text-lg leading-8 text-slate-700">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <UpgradeLockedConfirmModal
        open={localUpgradeConfirmOpen}
        onClose={() => setLocalUpgradeConfirmOpen(false)}
        onConfirm={() => {
          setLocalUpgradeConfirmOpen(false);
          onUpgrade?.();
        }}
      />
    </div>
  );
}

function LoaderDocCard() {
  return (
    <div className="flex h-[76px] w-full shrink-0 items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      {/* Kotak abu-abu di kiri */}
      <div className="h-12 w-12 shrink-0 rounded-lg bg-[#d5d8de]" />

      {/* Garis-garis skeleton di kanan */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-2 w-[92%] rounded-full bg-[#d5d8de]" />
        <div className="h-2 w-[68%] rounded-full bg-[#d5d8de]" />
        <div className="flex items-center gap-2">
          <div className="h-2 w-[38%] rounded-full bg-[#d5d8de]" />
          <div className="h-2 w-[22%] rounded-full bg-[#d5d8de]" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-[24%] rounded-full bg-[#d5d8de]" />
          <div className="h-2 w-[32%] rounded-full bg-[#d5d8de]" />
        </div>
      </div>
    </div>
  );
}

function SearchLoader() {
  return (
    <div
      className="relative mx-auto h-[160px] w-full max-w-[340px] sm:max-w-[380px] overflow-hidden select-none"
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, black 16%, black 84%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 16%, black 84%, transparent 100%)",
      }}
      aria-hidden="true"
    >
      {/* List kartu dokumen yang mengalir turun ke bawah */}
      <div className="flex flex-col gap-3 animate-[alerin-cards-scroll-down_2.8s_linear_infinite]">
        <LoaderDocCard />
        <LoaderDocCard />
        <LoaderDocCard />
        <LoaderDocCard />
      </div>

      {/* Kaca Pembesar Biru: Gerak melingkar memindai (orientasi tetap, tidak berputar jarum jam) */}
      <div className="pointer-events-none absolute right-4 sm:right-7 top-1/2 -translate-y-1/2 z-10">
        <div className="animate-[alerin-magnifier-circular_2.4s_linear_infinite]">
          <svg
            width="82"
            height="82"
            viewBox="0 0 82 82"
            fill="none"
            aria-hidden="true"
          >
            {/* Lensa kaca pembesar dengan outline biru tebal dan kaca semi-transparan */}
            <circle
              cx="34"
              cy="34"
              r="22"
              stroke="#0070ba"
              strokeWidth="4.5"
              fill="rgba(255, 255, 255, 0.45)"
            />
            {/* Kilau pantulan lengkungan kaca putih */}
            <path
              d="M21 24a15 15 0 0 1 16 -6"
              stroke="rgba(255, 255, 255, 0.85)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Gagang tebal silinder biru khas Alerin */}
            <line
              x1="50"
              y1="50"
              x2="70"
              y2="70"
              stroke="#0070ba"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function MobileLiteratureReview({
  query = "",
  onBack,
  onOpenRingkasan,
  onOpenAbstrak,
  onOpenSitasi,
  onSave,
  saved = false,
  onShowToast,
  onUpgrade,
  openedJournals: propOpenedJournals,
  onOpenJournal: propOnOpenJournal,
}: {
  query?: string;
  onBack?: () => void;
  onOpenRingkasan?: () => void;
  onOpenAbstrak?: () => void;
  onOpenSitasi?: () => void;
  onSave?: () => void;
  saved?: boolean;
  onShowToast?: (msg: string) => void;
  onUpgrade?: () => void;
  openedJournals?: string[];
  onOpenJournal?: (title: string) => void;
} = {}) {
  const [chip, setChip] = useState("semua");
  const [prioritySearch, setPrioritySearch] = useState("");
  const [priorityLimit, setPriorityLimit] = useState(6);
  const [matrixSearch, setMatrixSearch] = useState("");
  const [matrixLimit, setMatrixLimit] = useState(4);
  const [activeSection, setActiveSection] = useState(1);
  const activeTopic = (query.trim() || "Resiliensi perempuan dalam menghadapi bencana dan krisis").replace(/\s+/g, " ");
  const is12345 = (query || "").trim() === "12345";
  const [localOpenedJournals, setLocalOpenedJournals] = useState<string[]>([]);
  const [localUpgradeConfirmOpen, setLocalUpgradeConfirmOpen] = useState(false);
  const openedJournals = propOpenedJournals ?? localOpenedJournals;

  const handleOpenJournalClick = (title: string) => {
    if (propOnOpenJournal) {
      propOnOpenJournal(title);
      return;
    }
    if (openedJournals.includes(title)) {
      window.open("https://doi.org", "_blank", "noopener,noreferrer");
      return;
    }
    if (openedJournals.length < 3) {
      const next = [...openedJournals, title];
      setLocalOpenedJournals(next);
      window.open("https://doi.org", "_blank", "noopener,noreferrer");
      if (next.length === 3) {
        onShowToast?.("Batas 3 jurnal gratis tercapai. Jurnal lainnya kini terkunci.");
      } else {
        onShowToast?.(`Jurnal dibuka (${next.length}/3 kuota gratis)`);
      }
    } else {
      setLocalUpgradeConfirmOpen(true);
    }
  };

  const statsList = [
    { label: "Total hasil ditemukan", value: "126", tone: "text-[#00629b]" },
    { label: "Duplikasi dihapus", value: "34", tone: "text-red-700" },
    { label: "Tersisa untuk sintesis", value: "92", tone: "text-[#00629b]" },
    { label: "Prioritas tinggi", value: "24", tone: "text-[#00629b]" },
  ];

  const filterChips = [
    { key: "semua", label: "Semua (92)" },
    { key: "relevan", label: "Prioritas tinggi (24)" },
    { key: "tinjau", label: "Perlu ditinjau (38)" },
    { key: "teori", label: "Ulasan teori (12)" },
    { key: "empiris", label: "Empiris (46)" },
  ];

  const tagPills: Record<string, { box: string; dot: string }> = {
    "Sangat relevan": { box: "bg-emerald-50 text-emerald-700 outline-emerald-200/80", dot: "bg-emerald-500" },
    "Perlu ditinjau": { box: "bg-amber-50 text-amber-700 outline-amber-200/80", dot: "bg-amber-500" },
    "Cukup relevan": { box: "bg-sky-50 text-sky-700 outline-sky-200/80", dot: "bg-sky-500" },
  };

  const structureSections = literatureDocSections.map(item => ({
    n: item.section,
    label: item.title,
  }));
  const sectionDescs: Record<number, string> = {
    2: "Latar belakang, dinamika gender, dan konteks kebencanaan",
    3: "Strategi pencarian, kriteria inklusi, dan seleksi 126 artikel",
    4: "Fokus, metode, temuan utama, dan kontribusi penelitian tiap studi",
  };
  const sectionPreview: Record<number, string[]> = {
    1: [
      "Kajian ini bertujuan untuk mengidentifikasi dan mensintesis faktor-faktor yang membentuk resiliensi perempuan dalam menghadapi bencana dan krisis berdasarkan literatur ilmiah yang relevan. Sebanyak 15 artikel yang memenuhi kriteria inklusi dianalisis menggunakan pendekatan scoping review.",
      "Dukungan sosial, seperti peran keluarga, komunitas, dan jaringan sosial, terbukti memberikan perlindungan emosional, informasi, dan bantuan praktis. Akses terhadap sumber daya, termasuk ekonomi, pendidikan, layanan kesehatan, dan informasi, menjadi faktor penting yang memungkinkan perempuan memenuhi kebutuhan dasar dan mengambil keputusan strategis.",
      "Temuan ini menegaskan bahwa resiliensi perempuan merupakan hasil interaksi kompleks antara faktor sosial, struktural, dan individual sehingga intervensi pemulihan harus dirancang komprehensif.",
    ],
    2: [
      "Bagian ini memaparkan latar belakang penelitian tentang resiliensi perempuan dalam menghadapi bencana, termasuk dinamika kerentanan gender yang memperberat dampak bencana bagi kelompok rentan.",
      "Konteks kebencanaan di Indonesia—mulai dari gempa, banjir, hingga pandemi—menjadi fokus utama karena tingginya frekuensi dan dampaknya terhadap kelompok rentan.",
    ],
    3: [
      "Penelusuran dilakukan di lima basis data dengan kata kunci terkait resiliensi perempuan, bencana, dan pemulihan pasca-bencana, menghasilkan 126 artikel yang direduksi menjadi 92 studi setelah penyaringan.",
      "Kriteria inklusi mencakup publikasi 2020–2026, bahasa Indonesia dan Inggris, serta metode penelitian empiris maupun tinjauan sistematis.",
    ],
    4: [
      "Matriks merangkum fokus, metode, temuan utama, dan kontribusi penelitian dari studi unggulan agar perbandingan lintas penelitian dapat dilakukan secara cepat.",
      "Setiap baris memuat sitasi lengkap dan basis sumber agar klaim dalam sintesis ini dapat diverifikasi kembali.",
    ],
  };

  const visiblePriority = priorityRows.filter(row => {
    if (chip === "relevan" && row.tag !== "Sangat relevan") return false;
    if (chip === "tinjau" && row.tag !== "Perlu ditinjau") return false;
    if (chip === "teori" && row.kind !== "Ulasan teori") return false;
    if (chip === "empiris" && row.kind !== "Empiris") return false;
    const q = prioritySearch.trim().toLowerCase();
    if (q && !row.title.toLowerCase().includes(q) && !row.source.toLowerCase().includes(q)) return false;
    return true;
  });

  const visibleMatrix = matrixRows.filter(row => {
    const q = matrixSearch.trim().toLowerCase();
    return (
      !q ||
      (row.title && row.title.toLowerCase().includes(q)) ||
      (row.authors && row.authors.toLowerCase().includes(q)) ||
      row.name.toLowerCase().includes(q) ||
      row.journal.toLowerCase().includes(q) ||
      row.cells.some(cell => cell.toLowerCase().includes(q))
    );
  });

  const activeLabel = structureSections.find(item => item.n === activeSection)?.label ?? "Ringkasan Utama";
  const nextSection = structureSections.find(item => item.n === activeSection + 1);
  const currentDocSection = literatureDocSections.find(item => item.section === activeSection);
  const currentDocDesc = currentDocSection?.desc || sectionDescs[activeSection] || "Inti temuan, faktor utama, dan arah sintesis";
  const activeParagraphs =
    sectionPreview[activeSection] && sectionPreview[activeSection].length > 0
      ? sectionPreview[activeSection]
      : currentDocSection?.content ?? [];

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Indikator Garis Penanda Scroll di Pinggir Kanan Layar */}
      <FrameScrollIndicator />
      {/* Mobile Top Navigation Bar: Kembali & Simpan ke Koleksi */}
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-sky-700 px-3.5 py-2.5 text-xs font-bold text-white shadow-xs transition-all active:scale-[0.98]"
          >
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 6H2M5.5 2.5L2 6l3.5 3.5" />
            </svg>
            Kembali
          </button>
        )}
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold shadow-xs outline outline-1 transition-all active:scale-[0.98] cursor-pointer ${
              saved ? "bg-sky-50 text-sky-700 outline-sky-200 hover:bg-sky-100" : "bg-white text-slate-700 outline-slate-200 hover:bg-slate-50"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 2.5h8a1 1 0 0 1 1 1v10l-5-3-5 3v-10a1 1 0 0 1 1-1z" />
            </svg>
            {saved ? "Tersimpan" : "Simpan ke Koleksi"}
          </button>
        )}
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200/90 space-y-3.5">
        {/* Banner Topik yang Dianalisis (Paritas Koleksi) */}
        <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 via-blue-50/50 to-indigo-50/40 p-3.5 text-left">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-bold text-[#0284c7] shadow-xs">
              Literature Review
            </span>
            <span className="text-xs text-slate-500">Hari ini</span>
          </div>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Topik yang dianalisis</p>
          <h3 className="mt-0.5 font-['Plus_Jakarta_Sans:Bold'] text-[15px] sm:text-base font-bold leading-snug text-[#075985]">
            {activeTopic}
          </h3>
        </div>

        {/* Grid 4 Statistik (2x2) */}
        <div className="grid grid-cols-2 gap-2.5 text-left">
          {statsList.map(item => (
            <div key={item.label} className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-3 shadow-2xs">
              <p className="text-[12px] sm:text-[12.5px] font-semibold leading-snug text-slate-600">{item.label}</p>
              <p className="mt-1.5 flex items-baseline gap-1.5">
                <span className={`font-['Plus_Jakarta_Sans:ExtraBold'] text-[22px] sm:text-[23px] font-extrabold tracking-tight ${item.tone}`}>{item.value}</span>
                <span className={`text-xs font-medium ${item.label === "Duplikasi dihapus" ? "text-red-700/80" : "text-slate-500"}`}>artikel</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {is12345 && (
        <div className="flex items-start gap-2.5 rounded-xl border border-sky-200/90 bg-sky-50/90 p-3.5 text-left shadow-2xs">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00629b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 shrink-0 text-[#00629b]"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="min-w-0 flex-1 text-xs font-medium leading-relaxed text-[#003859]">
            Pencarian menghasilkan 500 artikel relevan dari target 1.000 artikel. Jumlah ini disesuaikan dengan ketersediaan literatur yang relevan dengan topik Anda.
          </p>
        </div>
      )}

      <section className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-slate-200/80">
        {/* Header Jurnal yang Digunakan (Paritas Penuh dengan Desktop) */}
        <div>
          <div className="flex items-center justify-between gap-2.5">
            <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-[17px] sm:text-lg font-bold text-slate-900 tracking-[-0.2px]">
              Jurnal yang Digunakan
            </h2>
            <span className="shrink-0 whitespace-nowrap inline-flex items-center rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-[#00629b] border border-sky-200/60">
              Total {visiblePriority.length} artikel
            </span>
          </div>
          <p className="mt-1.5 text-[13.5px] sm:text-sm leading-5 text-slate-500">
            Daftar jurnal yang menjadi sumber penyusunan literature review.
          </p>
        </div>

        {/* List Card Jurnal yang Digunakan */}
        <div className="mt-4 space-y-3">
          {visiblePriority.slice(0, priorityLimit).map((row, index) => {
            const isOpened = openedJournals.includes(row.title);
            const isLocked = !isOpened && openedJournals.length >= 3;
            return (
              <article key={`${row.title}-${index}`} className="rounded-xl bg-slate-50/70 p-4 border border-slate-200/90 shadow-2xs space-y-3 hover:border-sky-300 transition-colors">
                <div>
                  <h4 className="font-['Plus_Jakarta_Sans:Bold'] text-sm sm:text-[14.5px] font-bold leading-snug text-slate-900">{row.title}</h4>
                  <p className="mt-1 text-xs text-slate-500 font-normal">{row.authors} · <span className="font-medium text-slate-600">{row.source}</span></p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                      row.tag === "Sangat relevan" || row.tag === "Prioritas tinggi" || !row.tag
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                        : row.tag === "Cukup relevan"
                          ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                          : "bg-amber-50 text-amber-700 border border-amber-200/60"
                    }`}
                  >
                    {row.tag === "Sangat relevan" ? "Prioritas tinggi" : (row.tag || "Prioritas tinggi")}
                  </span>
                  <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200 shadow-2xs">
                    {row.year}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200 shadow-2xs">
                    <img
                      src={sourceLogos[row.source] ?? "/assets/source-logos/openalex.svg"}
                      alt=""
                      className="h-3.5 w-3.5 shrink-0 object-contain"
                    />
                    <span>{row.source}</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-200/70">
                  <button
                    type="button"
                    onClick={isLocked ? () => handleOpenJournalClick(row.title) : (onOpenRingkasan ?? onOpenAbstrak ?? (() => window.alert(`Membuka ringkasan jurnal: ${row.title}`)))}
                    className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border px-1.5 py-2 text-center text-xs font-bold leading-tight shadow-2xs transition-all active:scale-95 cursor-pointer ${
                      isLocked
                        ? "border-sky-300 bg-sky-50/85 text-[#00629b] hover:bg-sky-100/90"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                    title={isLocked ? "Terkunci - Batas 3 jurnal akun gratis tercapai" : "Ringkasan Jurnal"}
                  >
                    {isLocked && (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#00629b] shrink-0">
                        <rect x="3" y="7" width="10" height="7" rx="1.5" />
                        <path d="M5.5 7V4.5a2.5 2.5 0 0 1 5 0V7" />
                        <circle cx="8" cy="10.5" r="0.8" fill="currentColor" />
                      </svg>
                    )}
                    <span>Ringkasan Jurnal</span>
                  </button>
                  <button
                    type="button"
                    onClick={isLocked ? () => handleOpenJournalClick(row.title) : (onOpenSitasi ?? (() => window.alert(`Sitasi untuk: ${row.authors} (${row.year}). ${row.title}.`)))}
                    className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer ${
                      isLocked
                        ? "border-sky-300 bg-sky-50/85 text-[#00629b] hover:bg-sky-100/90"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                    title={isLocked ? "Terkunci - Batas 3 jurnal akun gratis tercapai" : "Sitasi"}
                  >
                    {isLocked && (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#00629b] shrink-0">
                        <rect x="3" y="7" width="10" height="7" rx="1.5" />
                        <path d="M5.5 7V4.5a2.5 2.5 0 0 1 5 0V7" />
                        <circle cx="8" cy="10.5" r="0.8" fill="currentColor" />
                      </svg>
                    )}
                    <span>Sitasi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenJournalClick(row.title)}
                    className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer ${
                      isLocked
                        ? "border-sky-300 bg-sky-50/85 text-[#00629b] hover:bg-sky-100/90"
                        : "border-slate-200 bg-white text-sky-700 hover:bg-sky-50"
                    }`}
                    title={isLocked ? "Terkunci - Batas 3 jurnal akun gratis tercapai" : "Buka jurnal"}
                  >
                    {isLocked ? (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#00629b]">
                        <rect x="3" y="7" width="10" height="7" rx="1.5" />
                        <path d="M5.5 7V4.5a2.5 2.5 0 0 1 5 0V7" />
                        <circle cx="8" cy="10.5" r="0.8" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-sky-600">
                        <path d="M12 9v4H3V4h4M9 2h5v5M6.5 9.5L14 2" />
                      </svg>
                    )}
                    <span>Buka</span>
                  </button>
                </div>
              </article>
            );
          })}
          {visiblePriority.length === 0 && (
            <p className="py-6 text-center text-xs text-slate-400">Tidak ada jurnal yang cocok dengan pencarianmu.</p>
          )}
        </div>
        {visiblePriority.length > priorityLimit && (
          <button
            type="button"
            onClick={() => setPriorityLimit(limit => limit + 6)}
            className="mt-3.5 flex w-full min-h-[44px] items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200/80 py-2.5 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          >
            Muat lebih banyak ({Math.min(6, visiblePriority.length - priorityLimit)} lagi)
          </button>
        )}
      </section>

      <div className="px-3 pt-3 pb-1 text-center">
        <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-xl sm:text-2xl font-extrabold leading-7 tracking-[-0.3px] text-slate-900">
          Hasil Analisis Literature Review
        </h2>
        <p className="mx-auto mt-1 max-w-[300px] text-sm font-medium leading-5 text-sky-700">Resiliensi perempuan dalam menghadapi bencana dan krisis</p>
      </div>

      <section className="rounded-2xl bg-white p-4 shadow-sm outline outline-1 outline-slate-200/80">
        <div>
          <h3 className="text-base font-bold text-slate-800">Matriks Literatur</h3>
          <p className="mt-0.5 text-sm text-slate-500">Analisis perbandingan penelitian untuk membantu penyusunan literature review</p>
        </div>
        <div className="mt-4 space-y-3.5">
          {visibleMatrix.slice(0, matrixLimit).map(row => (
            <article key={row.title || row.name} className="rounded-2xl bg-slate-50/70 p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3 transition-colors hover:border-sky-300">
              {/* Header: Judul Jurnal & Penulis */}
              <div className="border-b border-slate-200/70 pb-2.5 space-y-1">
                <h4 className="font-['Plus_Jakarta_Sans:Bold'] text-sm sm:text-[14.5px] font-bold text-slate-900 leading-snug">
                  {row.title || row.name}
                </h4>
                <p className="text-xs font-normal text-slate-500">
                  {row.authors || row.journal}
                </p>
              </div>

              {/* Fokus, Teori, dan Metode (Tata letak rapi, simetris, dan mudah dibaca) */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl bg-white p-3 border border-slate-200/70 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fokus</span>
                  <p className="mt-1 text-xs sm:text-[12.5px] font-medium leading-relaxed text-slate-800">{row.cells[0]}</p>
                </div>
                <div className="rounded-xl bg-white p-3 border border-slate-200/70 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Teori</span>
                  <p className="mt-1 text-xs sm:text-[12.5px] font-medium leading-relaxed text-slate-800">{row.cells[1]}</p>
                </div>
                <div className="col-span-2 rounded-xl bg-white px-3 py-2.5 border border-slate-200/70 shadow-2xs flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">Metode:</span>
                  <span className="text-xs sm:text-[12.5px] font-semibold text-slate-800 leading-snug">{row.cells[2]}</span>
                </div>
              </div>

              {/* Temuan Utama & Kontribusi Penelitian */}
              <div className="space-y-2.5 border-t border-slate-200/70 pt-2.5">
                <div className="rounded-xl bg-white p-3 border border-slate-200/70 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                    <p className="text-xs font-bold text-slate-800">Temuan Utama</p>
                  </div>
                  <p className="text-xs sm:text-[12.5px] font-normal leading-relaxed text-slate-600 pl-3">
                    {row.cells[3]}
                  </p>
                </div>

                <div className="rounded-xl bg-sky-50/70 p-3 border border-sky-200/60 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00629b] shrink-0" />
                    <p className="text-xs font-bold text-[#00629b]">Kontribusi Penelitian</p>
                  </div>
                  <p className="text-xs sm:text-[12.5px] font-medium leading-relaxed text-slate-700 pl-3">
                    {row.cells[4]}
                  </p>
                </div>
              </div>
            </article>
          ))}
          {visibleMatrix.length === 0 && (
            <p className="py-6 text-center text-xs text-slate-400">Tidak ada baris yang cocok dengan pencarianmu.</p>
          )}
        </div>
        {visibleMatrix.length > matrixLimit && (
          <button
            type="button"
            onClick={() => setMatrixLimit(limit => limit + 4)}
            className="mt-3 w-full rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-600"
          >
            Muat lebih banyak ({Math.min(4, visibleMatrix.length - matrixLimit)} lagi)
          </button>
        )}
      </section>

      {/* Satu Shape Terpadu: Literature Review Siap Digunakan, Struktur Dokumen, & Isi Dokumen */}
      <section className="rounded-2xl bg-white p-4 shadow-sm outline outline-1 outline-slate-200/80">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h2 className="text-base sm:text-lg font-bold leading-6 text-slate-900">Literature Review Siap Digunakan</h2>
          <details className="group relative shrink-0 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline outline-1 outline-slate-200 transition-colors hover:bg-slate-50 active:scale-95">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-slate-600">
                <path d="M2.5 10v3a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-3" />
                <path d="M8 2.5v7.5M5 7l3 3 3-3" />
              </svg>
              Ekspor File
              <svg width="10" height="6" viewBox="0 0 12 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" className="transition-transform group-open:rotate-180">
                <path d="M1 1l5 5 5-5" />
              </svg>
            </summary>
            <div className="absolute right-0 top-full z-20 mt-1.5 w-36 overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
              <button
                type="button"
                onClick={event => {
                  window.alert("Dokumen berhasil diekspor ke PDF.");
                  event.currentTarget.closest("details")?.removeAttribute("open");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-red-600">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                <span>Unduh PDF</span>
              </button>
              <button
                type="button"
                onClick={event => {
                  window.alert("Dokumen berhasil diekspor ke DOCX.");
                  event.currentTarget.closest("details")?.removeAttribute("open");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-blue-600">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <span>Unduh DOCX</span>
              </button>
            </div>
          </details>
        </div>

        {/* Struktur Dokumen Navigator */}
        <div className="pt-4.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-sky-100 text-[#00629b]">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M2.5 4h11M2.5 8h11M2.5 12h7" />
                </svg>
              </span>
              <p className="font-['Plus_Jakarta_Sans:Bold'] text-[14px] sm:text-[15px] font-bold text-slate-900 whitespace-nowrap">
                Struktur Dokumen
              </p>
            </div>
            <span className="shrink-0 whitespace-nowrap inline-flex items-center rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-[#00629b] border border-sky-200/60">
              Bagian {activeSection} dari 12
            </span>
          </div>

          {/* Chips Bar with proper bottom padding and modern rounded-xl styling */}
          <div className="-mx-4 mt-3.5 flex gap-2.5 overflow-x-auto px-4 pb-3 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {structureSections.map(item => (
              <button
                key={item.n}
                type="button"
                onClick={e => {
                  setActiveSection(item.n);
                  e.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                  });
                }}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                  activeSection === item.n
                    ? "bg-[#00629b] text-white shadow-xs ring-1 ring-[#00629b]"
                    : "bg-slate-100/90 text-slate-700 hover:bg-slate-200/80 border border-slate-200/70"
                }`}
              >
                <span
                  className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[10px] font-bold ${
                    activeSection === item.n ? "bg-white/20 text-white font-extrabold" : "bg-slate-200/90 text-slate-600"
                  }`}
                >
                  {item.n}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Konten Bagian Dokumen yang Terpilih (Paritas Tampilan Koleksi Literature Review) */}
        <div className="mt-1 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 space-y-2.5 transition-all">
          <div className="flex items-start gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-[#00629b]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold text-slate-800">
                {activeSection}. {activeLabel}
              </h4>
              <p className="text-xs text-slate-500 font-medium">{currentDocDesc}</p>
            </div>
          </div>
          <div className="border-t border-slate-200/60 pt-2.5 space-y-2">
            {activeParagraphs.map((paragraph, pIdx) => (
              <p key={pIdx} className="text-[14px] leading-6 text-slate-700">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <UpgradeLockedConfirmModal
        open={localUpgradeConfirmOpen}
        onClose={() => setLocalUpgradeConfirmOpen(false)}
        onConfirm={() => {
          setLocalUpgradeConfirmOpen(false);
          onUpgrade?.();
        }}
      />
    </div>
  );
}


const mapClusters = [
  { label: "Literasi AI", items: 28, color: "#3b82f6" },
  { label: "Motivasi & Pembelajaran", items: 24, color: "#34d399" },
  { label: "Keterampilan Kognitif", items: 18, color: "#a855f7" },
  { label: "Dampak & Tantangan", items: 12, color: "#fbbf24" },
  { label: "Konteks Pendidikan", items: 8, color: "#9ca3af" },
];

type MapNode = {
  name: string;
  x: number;
  y: number;
  r: number;
  cluster: number;
  year: number;
  labelPos: "inside" | "top" | "bottom" | "left" | "right";
};

const mapMainNodes: MapNode[] = [
  { name: "AI literacy", x: 43, y: 46, r: 46, cluster: 0, year: 2024.2, labelPos: "inside" },
  { name: "generative AI", x: 31, y: 21, r: 22, cluster: 0, year: 2024.8, labelPos: "top" },
  { name: "student engagement", x: 53, y: 15, r: 20, cluster: 1, year: 2023.6, labelPos: "top" },
  { name: "educational technology", x: 82, y: 22, r: 19, cluster: 0, year: 2023.1, labelPos: "top" },
  { name: "learning motivation", x: 64, y: 35, r: 31, cluster: 1, year: 2023.4, labelPos: "right" },
  { name: "critical thinking", x: 47, y: 78, r: 21, cluster: 2, year: 2023.3, labelPos: "bottom" },
  { name: "self-regulated learning", x: 71, y: 55, r: 15, cluster: 2, year: 2022.6, labelPos: "right" },
  { name: "digital literacy", x: 28, y: 81, r: 23, cluster: 3, year: 2023.9, labelPos: "bottom" },
  { name: "higher education", x: 22, y: 57, r: 20, cluster: 3, year: 2022.8, labelPos: "top" },
  { name: "AI anxiety", x: 17, y: 71, r: 12, cluster: 3, year: 2024.6, labelPos: "left" },
  { name: "chatGPT", x: 19, y: 37, r: 16, cluster: 4, year: 2024.9, labelPos: "top" },
  { name: "academic performance", x: 68, y: 80, r: 14, cluster: 4, year: 2022.9, labelPos: "right" },
];

const mapSmallNodes: Array<{ name: string; x: number; y: number; r: number; cluster: number }> = [
  // Cluster 0: Literasi AI (Blue)
  { name: "prompt engineering", x: 28, y: 14, r: 7, cluster: 0 },
  { name: "LLM evaluation", x: 38, y: 11, r: 6, cluster: 0 },
  { name: "AI ethics", x: 45, y: 13, r: 5, cluster: 0 },
  { name: "algorithm bias", x: 50, y: 12, r: 4, cluster: 0 },
  { name: "natural language processing", x: 30, y: 31, r: 6, cluster: 0 },
  { name: "deep learning", x: 39, y: 32, r: 5, cluster: 0 },
  { name: "machine learning", x: 24, y: 29, r: 5, cluster: 0 },
  { name: "data privacy", x: 35, y: 39, r: 4, cluster: 0 },
  { name: "AI tutoring system", x: 48, y: 29, r: 5, cluster: 0 },
  { name: "neural networks", x: 52, y: 27, r: 4, cluster: 0 },
  { name: "computer vision", x: 30, y: 44, r: 4, cluster: 0 },
  { name: "conversational agents", x: 22, y: 46, r: 5, cluster: 0 },
  { name: "automated feedback", x: 35, y: 55, r: 4, cluster: 0 },
  { name: "adaptive assessment", x: 43, y: 61, r: 5, cluster: 0 },
  { name: "AI pedagogy", x: 26, y: 21, r: 4, cluster: 0 },
  { name: "smart classroom", x: 78, y: 13, r: 6, cluster: 0 },
  { name: "edtech integration", x: 86, y: 16, r: 5, cluster: 0 },
  { name: "learning management", x: 88, y: 27, r: 5, cluster: 0 },
  { name: "digital learning tools", x: 74, y: 29, r: 4, cluster: 0 },
  { name: "virtual learning", x: 84, y: 33, r: 5, cluster: 0 },

  // Cluster 1: Motivasi & Pembelajaran (Emerald)
  { name: "intrinsic motivation", x: 50, y: 9, r: 6, cluster: 1 },
  { name: "academic engagement", x: 58, y: 12, r: 5, cluster: 1 },
  { name: "active learning", x: 63, y: 9, r: 5, cluster: 1 },
  { name: "collaborative learning", x: 68, y: 17, r: 6, cluster: 1 },
  { name: "peer interaction", x: 72, y: 25, r: 5, cluster: 1 },
  { name: "student satisfaction", x: 60, y: 23, r: 4, cluster: 1 },
  { name: "classroom climate", x: 76, y: 19, r: 4, cluster: 1 },
  { name: "pedagogical support", x: 55, y: 29, r: 4, cluster: 1 },
  { name: "task persistence", x: 62, y: 27, r: 4, cluster: 1 },
  { name: "experiential learning", x: 70, y: 43, r: 4, cluster: 1 },
  { name: "self-determination", x: 74, y: 34, r: 4, cluster: 1 },
  { name: "achievement goals", x: 66, y: 47, r: 5, cluster: 1 },

  // Cluster 2: Keterampilan Kognitif (Purple)
  { name: "metacognition", x: 56, y: 57, r: 7, cluster: 2 },
  { name: "problem-solving", x: 63, y: 59, r: 5, cluster: 2 },
  { name: "reflective thinking", x: 60, y: 65, r: 5, cluster: 2 },
  { name: "cognitive load", x: 66, y: 69, r: 6, cluster: 2 },
  { name: "information processing", x: 72, y: 63, r: 4, cluster: 2 },
  { name: "concept mapping", x: 55, y: 71, r: 4, cluster: 2 },
  { name: "inquiry learning", x: 58, y: 75, r: 5, cluster: 2 },
  { name: "analytical reasoning", x: 50, y: 85, r: 5, cluster: 2 },
  { name: "knowledge retention", x: 44, y: 83, r: 4, cluster: 2 },
  { name: "higher-order thinking", x: 62, y: 81, r: 4, cluster: 2 },
  { name: "decision-making", x: 74, y: 71, r: 5, cluster: 2 },

  // Cluster 3: Dampak & Tantangan (Amber)
  { name: "digital divide", x: 16, y: 59, r: 6, cluster: 3 },
  { name: "technostress", x: 22, y: 65, r: 5, cluster: 3 },
  { name: "information overload", x: 28, y: 69, r: 5, cluster: 3 },
  { name: "academic dishonesty", x: 34, y: 73, r: 6, cluster: 3 },
  { name: "cybersecurity literacy", x: 40, y: 75, r: 5, cluster: 3 },
  { name: "screen fatigue", x: 24, y: 78, r: 5, cluster: 3 },
  { name: "plagiarism detection", x: 18, y: 81, r: 4, cluster: 3 },
  { name: "equity in education", x: 30, y: 87, r: 5, cluster: 3 },
  { name: "mental well-being", x: 36, y: 84, r: 4, cluster: 3 },
  { name: "access disparity", x: 20, y: 53, r: 4, cluster: 3 },
  { name: "digital resilience", x: 26, y: 49, r: 5, cluster: 3 },
  { name: "ethical compliance", x: 14, y: 67, r: 4, cluster: 3 },

  // Cluster 4: Konteks Pendidikan (Gray)
  { name: "curriculum design", x: 18, y: 35, r: 5, cluster: 4 },
  { name: "teacher training", x: 26, y: 33, r: 4, cluster: 4 },
  { name: "institutional policy", x: 30, y: 41, r: 4, cluster: 4 },
  { name: "faculty readiness", x: 16, y: 43, r: 4, cluster: 4 },
  { name: "academic guidelines", x: 24, y: 47, r: 4, cluster: 4 },
  { name: "formative assessment", x: 64, y: 75, r: 5, cluster: 4 },
  { name: "learning analytics", x: 68, y: 81, r: 5, cluster: 4 },
  { name: "summative evaluation", x: 72, y: 79, r: 4, cluster: 4 },
  { name: "dropout prevention", x: 76, y: 85, r: 4, cluster: 4 },
  { name: "grading consistency", x: 58, y: 85, r: 4, cluster: 4 },
  { name: "student retention", x: 66, y: 65, r: 4, cluster: 4 },
  { name: "competency framework", x: 70, y: 59, r: 4, cluster: 4 },
  { name: "quality assurance", x: 74, y: 54, r: 4, cluster: 4 },
];

const mapMainEdges: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 3],
  [2, 4],
  [3, 4],
  [0, 5],
  [0, 6],
  [0, 7],
  [0, 8],
  [1, 9],
  [1, 10],
  [1, 11],
];

const mapYearStops = [
  { year: 2020, rgb: [37, 99, 235] },
  { year: 2021, rgb: [14, 165, 233] },
  { year: 2022, rgb: [45, 212, 191] },
  { year: 2023, rgb: [74, 222, 128] },
  { year: 2024, rgb: [250, 204, 21] },
  { year: 2025, rgb: [251, 146, 60] },
  { year: 2026, rgb: [239, 68, 68] },
];

const mapYearGradient = "linear-gradient(90deg,#2563eb,#0ea5e9,#2dd4bf,#4ade80,#facc15,#fb923c,#ef4444)";

function mapYearColor(year: number) {
  const clamped = Math.max(2020, Math.min(2026, year));
  for (let index = 0; index < mapYearStops.length - 1; index += 1) {
    const start = mapYearStops[index];
    const end = mapYearStops[index + 1];
    if (clamped >= start.year && clamped <= end.year) {
      const ratio = (clamped - start.year) / (end.year - start.year);
      const rgb = start.rgb.map((value, channel) => Math.round(value + (end.rgb[channel] - value) * ratio));
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
  }
  return "rgb(239, 68, 68)";
}

function mapCurve(from: { x: number; y: number }, to: { x: number; y: number }, bend: number) {
  const midX = (from.x + to.x) / 2 + (to.y - from.y) * bend;
  const midY = (from.y + to.y) / 2 - (to.x - from.x) * bend;
  return `M${from.x} ${from.y} Q${midX} ${midY} ${to.x} ${to.y}`;
}

function CollectionMapPreview({
  mode,
  className,
}: {
  mode: "jaringan" | "kepadatan" | "perkembangan";
  className?: string;
}) {
  if (mode === "kepadatan") {
    const heatSpots = [
      { name: "AI literacy", x: 44, y: 46, outer: 130, mid: 84, inner: 42 },
      { name: "learning motivation", x: 65, y: 35, outer: 105, mid: 66, inner: 32 },
      { name: "generative AI", x: 31, y: 22, outer: 85, mid: 54, inner: 24 },
      { name: "student engagement", x: 53, y: 16, outer: 75, mid: 48, inner: 20 },
      { name: "digital literacy", x: 28, y: 80, outer: 85, mid: 52, inner: 24 },
      { name: "critical thinking", x: 48, y: 77, outer: 76, mid: 46, inner: 18 },
      { name: "higher education", x: 22, y: 57, outer: 68, mid: 38, inner: 16 },
    ];

    return (
      <div
        className={`relative h-56 w-full overflow-hidden rounded-xl border border-slate-700 bg-[radial-gradient(circle_at_48%_45%,#1d4ed8_0%,#0b3bb8_55%,#072a8c_100%)] select-none ${
          className ?? ""
        }`}
      >
        {/* Ambient Blue Blobs */}
        <span className="pointer-events-none absolute left-[6%] top-[8%] h-24 w-32 rounded-full bg-cyan-400/20 blur-xl" />
        <span className="pointer-events-none absolute right-[8%] bottom-[10%] h-24 w-32 rounded-full bg-sky-400/20 blur-xl" />

        {/* Thermal Heatmap Spots */}
        {heatSpots.map((spot, idx) => (
          <div
            key={spot.name}
            className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${
              idx % 2 === 0 ? "map-thermal-breathe" : "map-thermal-breathe-alt"
            }`}
            style={{ left: `${spot.x}%`, top: `${spot.y}%`, animationDelay: `${idx * 0.6}s` }}
          >
            <span
              className="absolute rounded-full"
              style={{
                width: `${spot.outer}px`,
                height: `${spot.outer * 0.8}px`,
                background: "radial-gradient(circle, rgba(74,222,128,0.95) 0%, rgba(34,197,94,0.5) 40%, rgba(29,78,216,0) 74%)",
                filter: "blur(13px)",
              }}
            />
            <span
              className="absolute rounded-full"
              style={{
                width: `${spot.mid}px`,
                height: `${spot.mid * 0.8}px`,
                background: "radial-gradient(circle, rgba(250,204,21,0.95) 0%, rgba(250,204,21,0.55) 48%, rgba(250,204,21,0) 78%)",
                filter: "blur(9px)",
              }}
            />
            <span
              className="absolute rounded-full"
              style={{
                width: `${spot.inner}px`,
                height: `${spot.inner * 0.8}px`,
                background: "radial-gradient(circle, rgba(239,68,68,0.98) 0%, rgba(239,68,68,0.7) 52%, rgba(239,68,68,0) 82%)",
                filter: "blur(6px)",
              }}
            />
          </div>
        ))}

        {/* Nodes with glowing dots and white labels */}
        {mapMainNodes.map((node, idx) => {
          const isCenter = node.name === "AI literacy";
          return (
            <div
              key={node.name}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70"
                  style={{ animationDuration: `${2.2 + (idx % 3) * 0.5}s` }}
                />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" />
              </span>
              <span
                className={`whitespace-nowrap font-extrabold leading-none text-white [text-shadow:0_1px_8px_rgba(2,20,80,0.95)] ${
                  isCenter ? "text-[10px] tracking-tight" : "text-[8px] sm:text-[8.5px]"
                }`}
              >
                {node.name}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  const isEvolution = mode === "perkembangan";

  return (
    <div
      className={`relative h-56 w-full overflow-hidden rounded-xl border border-slate-200/90 bg-[radial-gradient(circle_at_50%_35%,#f8fbff_0%,#ffffff_65%)] select-none ${
        className ?? ""
      }`}
    >
      {/* Ambient background glows */}
      <span className="pointer-events-none absolute -left-4 -top-4 h-36 w-36 rounded-full bg-blue-400/15 blur-2xl" />
      <span className="pointer-events-none absolute -right-4 -top-4 h-36 w-36 rounded-full bg-emerald-400/15 blur-2xl" />
      <span className="pointer-events-none absolute -bottom-4 -left-4 h-36 w-36 rounded-full bg-amber-400/15 blur-2xl" />
      <span className="pointer-events-none absolute -bottom-4 -right-4 h-36 w-36 rounded-full bg-purple-400/15 blur-2xl" />

      {/* SVG Connecting Curved Lines */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {mapMainEdges.map(([fromIdx, toIdx], i) => {
          const from = mapMainNodes[fromIdx];
          const to = mapMainNodes[toIdx];
          const bend = i % 2 === 0 ? 0.05 : -0.05;
          const color = isEvolution
            ? mapYearColor((from.year + to.year) / 2)
            : mapClusters[from.cluster]?.color ?? "#93c5fd";
          return (
            <path
              key={`edge-${i}`}
              d={mapCurve({ x: from.x, y: from.y }, { x: to.x, y: to.y }, bend)}
              fill="none"
              stroke={color}
              strokeWidth="1.2"
              strokeLinecap="round"
              className="map-edge-flow"
              style={{ opacity: 0.45 }}
            />
          );
        })}
      </svg>

      {/* Small background nodes */}
      {mapSmallNodes.slice(0, 24).map((node, i) => {
        const anchor = mapMainNodes[node.cluster % mapMainNodes.length];
        const color = isEvolution
          ? mapYearColor(anchor.year)
          : mapClusters[node.cluster]?.color ?? "#3b82f6";
        return (
          <span
            key={`s-${i}`}
            className="pointer-events-none absolute rounded-full"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: `${Math.max(4, node.r)}px`,
              height: `${Math.max(4, node.r)}px`,
              transform: "translate(-50%, -50%)",
              backgroundColor: color,
              opacity: 0.85,
              boxShadow: `0 0 4px ${color}66`,
            }}
          />
        );
      })}

      {/* Central Node AI literacy */}
      <div className="pointer-events-none absolute left-[43%] top-[46%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
        <span
          className="pointer-events-none absolute -inset-2 rounded-full border animate-ping opacity-40"
          style={{ borderColor: isEvolution ? mapYearColor(2024.2) : "#38bdf8" }}
        />
        <span
          className="relative flex h-11 w-11 items-center justify-center rounded-full text-center text-[7.5px] font-extrabold text-white shadow-md ring-2 ring-white/90"
          style={{ backgroundColor: isEvolution ? mapYearColor(2024.2) : "#0070ba" }}
        >
          AI literacy
        </span>
      </div>

      {/* Other Main Nodes */}
      {mapMainNodes
        .filter(n => n.name !== "AI literacy")
        .map((node, i) => {
          const color = isEvolution
            ? mapYearColor(node.year)
            : mapClusters[node.cluster]?.color ?? "#3b82f6";
          const labelPos = node.labelPos;
          return (
            <div
              key={node.name}
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 flex items-center"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div
                className={`relative flex items-center ${
                  labelPos === "top"
                    ? "flex-col-reverse -translate-y-2"
                    : labelPos === "bottom"
                      ? "flex-col translate-y-2"
                      : labelPos === "left"
                        ? "flex-row-reverse -translate-x-2"
                        : "flex-row translate-x-2"
                }`}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white shadow-xs"
                  style={{ backgroundColor: color }}
                />
                <span
                  className={`whitespace-nowrap rounded px-1 py-0.5 text-[7px] sm:text-[7.5px] font-bold leading-none shadow-2xs ${
                    labelPos === "top"
                      ? "mb-1"
                      : labelPos === "bottom"
                        ? "mt-1"
                        : labelPos === "left"
                          ? "mr-1"
                          : "ml-1"
                  } bg-white/95 text-slate-800 border border-slate-200/80`}
                >
                  {node.name}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
}

const mapNodeDetails: Record<string, { clusterName: string; count: number; relations: number; desc: string }> = {
  "AI literacy": { clusterName: "Literasi & Adopsi AI", count: 28, relations: 8, desc: "Fokus sentral pada pemahaman dasar, etika, dan penggunaan AI dalam pembelajaran." },
  "generative AI": { clusterName: "Literasi & Adopsi AI", count: 21, relations: 6, desc: "Pemanfaatan model generatif seperti LLM untuk asisten penulisan & analisis riset." },
  "student engagement": { clusterName: "Motivasi & Pembelajaran", count: 19, relations: 5, desc: "Keterlibatan aktif mahasiswa dalam proses interaksi kelas berbantuan AI." },
  "educational technology": { clusterName: "Literasi & Adopsi AI", count: 16, relations: 4, desc: "Integrasi platform edtech cerdas dalam kurikulum pendidikan tinggi." },
  "learning motivation": { clusterName: "Motivasi & Pembelajaran", count: 24, relations: 7, desc: "Daya dorong internal mahasiswa dalam memanfaatkan alat kecerdasan buatan." },
  "critical thinking": { clusterName: "Keterampilan Kognitif", count: 18, relations: 5, desc: "Keterampilan evaluasi kritis terhadap output yang dihasilkan oleh AI." },
  "self-regulated learning": { clusterName: "Keterampilan Kognitif", count: 15, relations: 4, desc: "Kemandirian belajar dan pengaturan strategi belajar mahasiswa." },
  "digital literacy": { clusterName: "Dampak & Tantangan", count: 17, relations: 5, desc: "Kecakapan digital komprehensif sebagai prasyarat literasi kecerdasan buatan." },
  "higher education": { clusterName: "Dampak & Tantangan", count: 14, relations: 4, desc: "Lanskap kebijakan dan adaptasi institusi perguruan tinggi terhadap teknologi AI." },
  "AI anxiety": { clusterName: "Dampak & Tantangan", count: 12, relations: 3, desc: "Kecemasan psikologis terkait ketergantungan atau kekhawatiran terhadap teknologi AI." },
  "chatGPT": { clusterName: "Konteks Pendidikan", count: 16, relations: 4, desc: "Studi kasus implementasi chatbot percakapan AI dalam pengerjaan tugas akademik." },
  "academic performance": { clusterName: "Konteks Pendidikan", count: 14, relations: 3, desc: "Capaian indeks prestasi dan efektivitas hasil belajar berbantuan AI." },
};

function DesktopResearchMap({
  query,
  onBack,
  onSave,
  saved,
  onOpenRingkasan,
  onOpenAbstrak,
  onOpenSitasi,
  onShowToast,
  onUpgrade,
  openedJournals: propOpenedJournals,
  onOpenJournal: propOnOpenJournal,
}: {
  query: string;
  onBack: () => void;
  onSave: () => void;
  saved: boolean;
  onOpenRingkasan?: () => void;
  onOpenAbstrak?: () => void;
  onOpenSitasi?: () => void;
  onShowToast?: (msg: string) => void;
  onUpgrade?: () => void;
  openedJournals?: string[];
  onOpenJournal?: (title: string) => void;
}) {
  const [localOpenedJournals, setLocalOpenedJournals] = useState<string[]>([]);
  const [localUpgradeConfirmOpen, setLocalUpgradeConfirmOpen] = useState(false);
  const openedJournals = propOpenedJournals ?? localOpenedJournals;

  const handleOpenJournalClick = (title: string) => {
    if (propOnOpenJournal) {
      propOnOpenJournal(title);
      return;
    }
    if (openedJournals.includes(title)) {
      window.open("https://doi.org", "_blank", "noopener,noreferrer");
      return;
    }
    if (openedJournals.length < 3) {
      const next = [...openedJournals, title];
      setLocalOpenedJournals(next);
      window.open("https://doi.org", "_blank", "noopener,noreferrer");
      if (next.length === 3) {
        onShowToast?.("Batas 3 jurnal gratis tercapai. Jurnal lainnya kini terkunci.");
      } else {
        onShowToast?.(`Jurnal dibuka (${next.length}/3 kuota gratis)`);
      }
    } else {
      setLocalUpgradeConfirmOpen(true);
    }
  };
  const [mode, setMode] = useState("jaringan");
  const [showLines, setShowLines] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [activeNode, setActiveNode] = useState("AI literacy");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [nodeFilter, setNodeFilter] = useState<string | null>(null);
  const [mapSearch, setMapSearch] = useState("");
  const [chip, setChip] = useState("semua");
  const [mobileJournalLimit, setMobileJournalLimit] = useState(6);
  const [yearSort, setYearSort] = useState<"asc" | "desc" | null>(null);
  const [relevanSort, setRelevanSort] = useState<"asc" | "desc" | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play whenever query changes (e.g. user opens a new map from history or search)
  const prevQueryRef = useRef(query);
  useEffect(() => {
    if (prevQueryRef.current !== query) {
      prevQueryRef.current = query;
      setProgress(0);
      setIsPlaying(true);
    }
  }, [query]);
  const [nodeOffsets, setNodeOffsets] = useState<Record<string, { x: number; y: number }>>({});
  const [selectedNodeForDetail, setSelectedNodeForDetail] = useState<string | null>(null);
  const [showNodeArticles, setShowNodeArticles] = useState(false);
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(100);
  const [fullscreen, setFullscreen] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isMobilePreview = isMobileScreen && !fullscreen;
  const [helpOpen, setHelpOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState<number | null>(null);
  const [integratedOpen, setIntegratedOpen] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const mobileJournalListRef = useRef<HTMLDivElement | null>(null);
  const [isJournalScrolling, setIsJournalScrolling] = useState(false);
  const [journalScrollProgress, setJournalScrollProgress] = useState(0);
  const [journalThumbRatio, setJournalThumbRatio] = useState(0.25);
  const journalScrollTimeout = useRef<number | undefined>(undefined);

  const handleMobileJournalScroll = () => {
    const el = mobileJournalListRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      setIsJournalScrolling(false);
      return;
    }
    const ratio = Math.max(0.12, Math.min(0.8, clientHeight / scrollHeight));
    setJournalThumbRatio(ratio);
    setJournalScrollProgress(scrollTop / maxScroll);
    setIsJournalScrolling(true);

    if (journalScrollTimeout.current) window.clearTimeout(journalScrollTimeout.current);
    journalScrollTimeout.current = window.setTimeout(() => {
      setIsJournalScrolling(false);
    }, 1200);
  };
  const graphRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved?: boolean;
    nodeName?: string | null;
  } | null>(null);
  const justDraggedRef = useRef<boolean>(false);
  const draggingNodeRef = useRef<{
    name: string;
    pointerId: number;
    startX: number;
    startY: number;
    initialOffsetX: number;
    initialOffsetY: number;
    moved: boolean;
  } | null>(null);

  const getNodePos = (node: MapNode) => {
    const offset = nodeOffsets[node.name];
    if (!offset) return { x: node.x, y: node.y };
    return { x: node.x + offset.x, y: node.y + offset.y };
  };

  const handleNodePointerDown = (nodeName: string, event: ReactPointerEvent) => {
    if (event.pointerType !== "mouse") {
      // Touch/stylus events bubble to handleMapPointerDown so user can smoothly drag/pan canvas on mobile
      return;
    }
    if (event.button !== 0) return;
    event.stopPropagation();
    const currentOffset = nodeOffsets[nodeName] || { x: 0, y: 0 };
    draggingNodeRef.current = {
      name: nodeName,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      initialOffsetX: currentOffset.x,
      initialOffsetY: currentOffset.y,
      moved: false,
    };
    try {
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    } catch {}
  };

  const handleNodePointerMove = (event: ReactPointerEvent) => {
    const drag = draggingNodeRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const rect = graphRef.current?.getBoundingClientRect();
    if (!rect) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.hypot(deltaX, deltaY) > 3) {
      drag.moved = true;
    }
    const currentZoom = zoom / 100;
    const pctX = (deltaX / (rect.width * currentZoom)) * 100;
    const pctY = (deltaY / (rect.height * currentZoom)) * 100;
    setNodeOffsets(prev => ({
      ...prev,
      [drag.name]: {
        x: drag.initialOffsetX + pctX,
        y: drag.initialOffsetY + pctY,
      },
    }));
  };

  const handleNodePointerUp = (nodeName: string, event: ReactPointerEvent) => {
    const drag = draggingNodeRef.current;
    if (drag && drag.pointerId === event.pointerId) {
      if (!drag.moved) {
        toggleNode(nodeName);
        setSelectedNodeForDetail(nodeName);
        setShowNodeArticles(false);
      }
      draggingNodeRef.current = null;
    }
  };

  // Auto-play timeline & network simulation
  useEffect(() => {
    if (!isPlaying) return;
    const step = isMobileScreen ? (mode === "jaringan" ? 0.04 : 0.03) : 0.02;
    const timer = setInterval(() => {
      setProgress(curr => {
        if (curr >= 1) {
          setIsPlaying(false);
          return 1;
        }
        return Math.min(1, curr + step);
      });
    }, 30);
    return () => clearInterval(timer);
  }, [isPlaying, isMobileScreen, mode]);

  const handleTogglePlay = () => {
    if (progress >= 1) setProgress(0);
    setIsPlaying(p => !p);
  };

  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const panRef = useRef(pan);
  panRef.current = pan;
  const panRafRef = useRef<number | null>(null);

  const zoomAt = useCallback((nextZoom: number, clientX?: number, clientY?: number) => {
    const target = Math.max(50, Math.min(250, nextZoom));
    const currentZ = zoomRef.current;
    if (target === currentZ) return;
    const rect = graphRef.current?.getBoundingClientRect();
    if (!rect) {
      setZoom(target);
      return;
    }
    const centerX = (clientX ?? rect.left + rect.width / 2) - rect.left;
    const centerY = (clientY ?? rect.top + rect.height / 2) - rect.top;
    const currentP = panRef.current;
    const ratio = target / currentZ;
    setPan({
      x: centerX - (centerX - currentP.x) * ratio,
      y: centerY - (centerY - currentP.y) * ratio,
    });
    setZoom(target);
  }, []);

  const handleMapPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const target = event.target as HTMLElement;

    // On mouse pointer, don't drag map canvas if clicking node buttons or interactive controls
    if (event.pointerType === "mouse" && target.closest("button, [data-map-node]")) return;

    const nodeEl = target.closest("[data-map-node]") as HTMLElement | null;
    const nodeName = nodeEl?.getAttribute("data-node-name") ?? null;

    activePointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {}

    if (activePointersRef.current.size === 1) {
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: pan.x,
        originY: pan.y,
        moved: false,
        nodeName: nodeName,
      };
      setDragging(true);
    } else if (activePointersRef.current.size === 2) {
      const pts = Array.from(activePointersRef.current.values());
      pinchStartDistRef.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStartZoomRef.current = zoom;
      setDragging(false);
    }
  };

  const handleMapPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!activePointersRef.current.has(event.pointerId)) return;
    activePointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (activePointersRef.current.size === 2 && pinchStartDistRef.current && pinchStartDistRef.current > 0) {
      const pts = Array.from(activePointersRef.current.values());
      const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const ratio = currentDist / pinchStartDistRef.current;
      const nextZoom = Math.round(pinchStartZoomRef.current * ratio);
      const midX = (pts[0].x + pts[1].x) / 2;
      const midY = (pts[0].y + pts[1].y) / 2;
      zoomAt(nextZoom, midX, midY);
    } else if (activePointersRef.current.size === 1) {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;
      if (Math.hypot(deltaX, deltaY) > 4) {
        drag.moved = true;
        justDraggedRef.current = true;
      }
      const nextX = drag.originX + deltaX;
      const nextY = drag.originY + deltaY;
      if (panRafRef.current) cancelAnimationFrame(panRafRef.current);
      panRafRef.current = requestAnimationFrame(() => {
        setPan({ x: nextX, y: nextY });
      });
    }
  };

  const handleMapPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag && drag.pointerId === event.pointerId) {
      if (!drag.moved && drag.nodeName) {
        toggleNode(drag.nodeName);
        setSelectedNodeForDetail(drag.nodeName);
        setShowNodeArticles(false);
      }
      if (drag.moved) {
        justDraggedRef.current = true;
        setTimeout(() => {
          justDraggedRef.current = false;
        }, 120);
      }
    }
    activePointersRef.current.delete(event.pointerId);
    if (activePointersRef.current.size < 2) {
      pinchStartDistRef.current = null;
    }
    if (activePointersRef.current.size === 0) {
      dragRef.current = null;
      setDragging(false);
    }
  };

  const resetMapView = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
  };

  const handleDownloadImage = () => {
    if (isDownloadingImage) return;
    setIsDownloadingImage(true);
    setTimeout(() => {
      setIsDownloadingImage(false);
      window.alert("Peta klaster berhasil diunduh sebagai gambar.");
    }, 1200);
  };

  useEffect(() => {
    const element = graphRef.current;
    if (!element) return;
    let wheelRaf: number | null = null;
    const handleWheel = (event: globalThis.WheelEvent) => {
      event.preventDefault();
      if (wheelRaf) cancelAnimationFrame(wheelRaf);
      const delta = event.deltaY > 0 ? -15 : 15;
      const clientX = event.clientX;
      const clientY = event.clientY;
      wheelRaf = requestAnimationFrame(() => {
        zoomAt(zoomRef.current + delta, clientX, clientY);
      });
    };
    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", handleWheel);
      if (wheelRaf) cancelAnimationFrame(wheelRaf);
    };
  }, [zoomAt]);

  useEffect(() => {
    if (!fullscreen) return;
    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [fullscreen]);

  const nearestMain = (node: { x: number; y: number }) =>
    mapMainNodes.reduce(
      (best, candidate) => {
        const cPos = getNodePos(candidate);
        const distance = Math.hypot(cPos.x - node.x, cPos.y - node.y);
        return distance < best.distance ? { node: candidate, distance } : best;
      },
      { node: mapMainNodes[0], distance: Number.POSITIVE_INFINITY },
    ).node;

  const edgeList = useMemo(() => {
    const list: Array<{
      key: string;
      from: { x: number; y: number };
      to: { x: number; y: number };
      fromNodeName: string;
      toNodeName: string;
      color: string;
      year: number;
      weight: number;
    }> = [];

    mapMainEdges.forEach(([fromIndex, toIndex], index) => {
      const from = mapMainNodes[fromIndex];
      const to = mapMainNodes[toIndex];
      const year = Math.max(from.year, to.year);
      list.push({
        key: `main-${fromIndex}-${toIndex}-${index}`,
        from: getNodePos(from),
        to: getNodePos(to),
        fromNodeName: from.name,
        toNodeName: to.name,
        color: mode === "perkembangan" ? mapYearColor(year) : mapClusters[from.cluster].color,
        year,
        weight: 1.5,
      });
    });

    mapSmallNodes.forEach((node, index) => {
      const anchor = nearestMain(node);
      const year = anchor.year;
      list.push({
        key: `small-${index}`,
        from: node,
        to: getNodePos(anchor),
        fromNodeName: node.name,
        toNodeName: anchor.name,
        color: mode === "perkembangan" ? mapYearColor(year) : mapClusters[node.cluster].color,
        year,
        weight: 1,
      });
    });

    return list;
  }, [mode, nodeOffsets]);

  const playYear = 2020 + 6 * progress;
  const densityScale = 0.55 + 0.45 * progress;
  const pulseScale = 1;

  const tabs = [
    { key: "jaringan", label: "Jaringan" },
    { key: "kepadatan", label: "Kepadatan" },
    { key: "perkembangan", label: "Perkembangan" },
  ];

  const filterChips = [
    { key: "semua", label: "Semua (92)" },
    { key: "relevan", label: "Prioritas tinggi (24)" },
    { key: "tinjau", label: "Perlu ditinjau (38)" },
    { key: "teori", label: "Ulasan teori (12)" },
    { key: "empiris", label: "Empiris (46)" },
  ];

  const modeInfo =
    mode === "perkembangan"
      ? {
          title: "Peta Perkembangan",
          subtitle: "Menampilkan rata-rata tahun publikasi setiap topik.",
          hint: "Geser slider untuk melihat kapan tiap topik mulai menguat dalam literatur.",
          stats: ["Jumlah item: 90", "Rentang tahun: 2020–2026", "Rata-rata: 2023.6"],
        }
      : mode === "kepadatan"
        ? {
            title: "Peta Kepadatan",
            subtitle: "Menampilkan tingkat konsentrasi topik dalam penelitian.",
            hint: "Geser slider untuk melihat intensitas konsentrasi sitasi pada setiap topik.",
            stats: ["Jumlah item: 90", "Area padat: 5", "Resolusi: 0.85"],
          }
        : {
            title: "Peta Jaringan",
            subtitle: "Menampilkan hubungan antar topik berdasarkan kemunculan bersama.",
            hint: "Geser slider untuk melihat pembentukan hubungan antar topik satu per satu.",
            stats: ["Jumlah item: 90", "Jumlah hubungan: 340", "Topik: 5"],
          };

  const toggleNode = (name: string) => {
    setActiveNode(name);
    setNodeFilter(current => (current === name ? null : name));
  };

  const selectedNodeData = selectedNodeForDetail
    ? mapMainNodes.find(n => n.name === selectedNodeForDetail) ||
      (() => {
        const small = mapSmallNodes.find(n => n.name === selectedNodeForDetail);
        if (!small) return null;
        return {
          name: small.name,
          x: small.x,
          y: small.y,
          r: small.r,
          cluster: small.cluster,
          year: nearestMain(small).year,
          labelPos: "right" as const,
        };
      })()
    : null;

  const nodeRelatedPapers = useMemo(() => {
    if (!selectedNodeForDetail) return [];
    const directMatches = priorityRows
      .map((row, index) => ({ row, node: mapMainNodes[index % mapMainNodes.length].name }))
      .filter(item => item.node === selectedNodeForDetail);
    if (directMatches.length > 0) return directMatches;
    const small = mapSmallNodes.find(n => n.name === selectedNodeForDetail);
    if (small) {
      const anchor = nearestMain(small);
      return priorityRows
        .map((row, index) => ({ row, node: mapMainNodes[index % mapMainNodes.length].name }))
        .filter(item => item.node === anchor.name);
    }
    return [];
  }, [selectedNodeForDetail]);

  const visibleRows = useMemo(() => {
    let rows = priorityRows.map((row, index) => ({ row, node: mapMainNodes[index % mapMainNodes.length].name }));
    if (nodeFilter) rows = rows.filter(item => item.node === nodeFilter);
    rows = rows.filter(item => {
      const { row } = item;
      if (chip === "relevan" && row.tag !== "Sangat relevan") return false;
      if (chip === "tinjau" && row.tag !== "Perlu ditinjau") return false;
      if (chip === "teori" && row.kind !== "Ulasan teori") return false;
      if (chip === "empiris" && row.kind !== "Empiris") return false;
      const q = mapSearch.trim().toLowerCase();
      if (q && !row.title.toLowerCase().includes(q) && !row.source.toLowerCase().includes(q) && !row.authors.toLowerCase().includes(q)) return false;
      return true;
    });
    if (yearSort) rows = [...rows].sort((a, b) => (yearSort === "desc" ? b.row.year - a.row.year : a.row.year - b.row.year));
    else if (relevanSort) rows = [...rows].sort((a, b) => (relevanSort === "desc" ? b.row.relevan - a.row.relevan : a.row.relevan - b.row.relevan));
    return rows;
  }, [nodeFilter, chip, mapSearch, yearSort, relevanSort]);

  const modeIcon =
    mode === "perkembangan" ? (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="15" cy="15" r="11.5" />
        <path d="M15 8.5V15l4.5 3" />
      </svg>
    ) : mode === "kepadatan" ? (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 4.5L27 11l-12 6.5L3 11z" />
        <path d="M3 15.5L15 22l12-6.5" />
        <path d="M3 20L15 26.5 27 20" />
      </svg>
    ) : (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="15" cy="7" r="4" />
        <circle cx="6" cy="23" r="4" />
        <circle cx="24" cy="23" r="4" />
        <path d="M13.2 10.4L7.8 19.6M16.8 10.4l5.4 9.2M10 23h10" />
      </svg>
    );

  const heatSpots = useMemo(() => mapMainNodes.map(node => ({ ...node, size: node.r * 5.6 })), []);

  const analysisRows =
    mode === "kepadatan"
      ? [
          {
            title: "Interpretasi Hasil Analisis",
            subtitle: "Konsentrasi topik pada peta kepadatan",
            paragraphs: [
              "Berdasarkan Peta Kepadatan, area AI Literacy dan Learning Motivation menunjukkan konsentrasi yang relatif tinggi dibandingkan beberapa topik lainnya. Hal ini menunjukkan bahwa kedua topik berada dalam wilayah jaringan dengan banyak item atau bobot yang terkonsentrasi.",
              "Sementara itu, Generative AI, Critical Thinking, dan Self-Regulated Learning memperlihatkan kepadatan yang bervariasi dan relatif lebih rendah pada beberapa area. Perbedaan kepadatan ini dapat membantu pengguna menentukan topik yang perlu ditelusuri lebih jauh. Namun, konsentrasi yang rendah tidak berarti suatu topik belum pernah diteliti.",
            ],
          },
          {
            title: "Kesimpulan dan Implikasi Penelitian",
            subtitle: "Topik padat dan peluang penelusuran lanjutan",
            paragraphs: [
              "AI Literacy dan Learning Motivation merupakan dua area yang memiliki konsentrasi penelitian menonjol dalam kumpulan artikel yang dianalisis. Topik dengan kepadatan lebih rendah, seperti Self-Regulated Learning dan AI Anxiety, dapat menjadi bahan eksplorasi lanjutan untuk mengetahui apakah terdapat pertanyaan penelitian yang belum terjawab.",
              "Kepadatan yang rendah merupakan petunjuk untuk melakukan penelusuran tambahan, bukan bukti adanya research gap.",
            ],
          },
        ]
      : mode === "perkembangan"
        ? [
            {
              title: "Interpretasi Hasil Analisis",
              subtitle: "Rata-rata tahun publikasi tiap topik",
              paragraphs: [
                "Berdasarkan simulasi, diperoleh rata-rata tahun publikasi beberapa topik berikut.",
                "Dalam kumpulan artikel ini, Generative AI memiliki rata-rata tahun publikasi yang lebih baru dibandingkan AI Literacy, Learning Motivation, dan Self-Regulated Learning. Pola tersebut menunjukkan adanya perbedaan waktu publikasi antartopik, dengan Generative AI lebih banyak direpresentasikan oleh artikel yang relatif baru dalam sampel.",
                "Namun, untuk memastikan apakah minat penelitian Generative AI benar-benar meningkat, perlu dibandingkan jumlah publikasi pada setiap tahun.",
              ],
            },
            {
              title: "Kesimpulan dan Implikasi Penelitian",
              subtitle: "Perbedaan periode dan batasan interpretasi",
              paragraphs: [
                "Generative AI dan AI Literacy termasuk topik dengan rata-rata tahun publikasi yang relatif lebih baru, sedangkan Self-Regulated Learning dan Academic Performance memiliki rata-rata yang lebih lama dalam kumpulan artikel ini. Hal tersebut dapat menjadi dasar untuk menelusuri bagaimana pembahasan AI dalam pendidikan berkaitan dengan topik pembelajaran yang sudah lebih dahulu diteliti.",
                "Perbedaan waktu publikasi tidak dengan sendirinya membuktikan adanya perubahan fokus penelitian secara global atau menjamin kebaruan suatu topik.",
              ],
            },
          ]
        : [
            {
              title: "Interpretasi Hasil Analisis",
              subtitle: "Struktur jaringan dan topik dominan",
              paragraphs: [
                "Berdasarkan simulasi 100 artikel penelitian periode 2020–2026, diperoleh 90 kata kunci yang dipetakan, 340 hubungan antarkata kunci, dan 5 kelompok penelitian.",
                "AI Literacy menjadi salah satu topik yang paling menonjol dengan kemunculan dalam 28 artikel, diikuti Learning Motivation (24 artikel) dan Generative AI (21 artikel). Dalam peta, AI Literacy memiliki sejumlah hubungan dengan Learning Motivation, Generative AI, Critical Thinking, serta Student Engagement. Hal ini menunjukkan bahwa literasi AI dibahas bersama dengan berbagai aspek pembelajaran mahasiswa dalam kumpulan artikel yang dianalisis.",
              ],
            },
            {
              title: "Kesimpulan dan Implikasi Penelitian",
              subtitle: "Implikasi dan batasan interpretasi",
              paragraphs: [
                "AI Literacy merupakan salah satu topik sentral dalam jaringan penelitian yang dianalisis. Keterkaitannya dengan Learning Motivation dan topik pembelajaran lainnya menunjukkan adanya ruang untuk menelusuri hubungan kedua variabel lebih lanjut.",
                "Meski demikian, hubungan pada peta belum membuktikan bahwa literasi AI meningkatkan atau menurunkan motivasi belajar. Untuk memahami hubungan tersebut, perlu dilakukan pemeriksaan terhadap metode dan temuan artikel pendukung.",
              ],
            },
          ];

  const perkembanganYears = [
    ["Self-Regulated Learning", "2022,6"],
    ["Academic Performance", "2022,9"],
    ["Learning Motivation", "2023,4"],
    ["Student Engagement", "2023,6"],
    ["AI Literacy", "2024,2"],
    ["Generative AI", "2024,8"],
  ];

  const guideDialogContent = (
    <div
      role="dialog"
      aria-label="Cara membaca peta"
      className="fixed inset-x-3.5 top-16 z-50 max-h-[82vh] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-4.5 sm:p-5 shadow-[0_20px_50px_rgba(15,23,42,0.22)] sm:absolute sm:right-0 sm:top-full sm:inset-x-auto sm:z-30 sm:mt-2 sm:max-h-[85vh] sm:w-[min(440px,calc(100vw-2.5rem))]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-['Plus_Jakarta_Sans:Bold'] text-base font-bold leading-6 text-[#0f172a]">Cara Membaca Peta</h3>
        <button
          type="button"
          aria-label="Tutup"
          onClick={() => setHelpOpen(false)}
          className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M2.5 2.5l9 9M11.5 2.5l-9 9" />
          </svg>
        </button>
      </div>
      {mode === "jaringan" && (
        <div className="mt-3 flex flex-col gap-3.5">
          <p className="text-xs leading-relaxed text-slate-600">
            Peta Jaringan menunjukkan keterkaitan antar topik dalam kumpulan artikel.
          </p>

          <div className="flex flex-col gap-3 rounded-2xl bg-[#f8fafc] p-4 text-xs leading-relaxed">
            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                <span className="h-4 w-4 rounded-full bg-[#3b82f6]" />
              </span>
              <div>
                <strong className="block text-xs font-bold text-slate-900">Lingkaran:</strong>
                <span className="text-slate-600">Menunjukkan topik atau kata kunci yang dianalisis.</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                  <span className="h-3.5 w-3.5 rounded-full bg-[#2563eb]" />
                </span>
              </span>
              <div>
                <strong className="block text-xs font-bold text-slate-900">Ukuran lingkaran:</strong>
                <span className="text-slate-600">
                  Semakin besar lingkaran, semakin sering topik tersebut muncul dalam artikel yang dianalisis.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                <span className="h-1.5 w-6 rounded-full bg-[#94a3b8]" />
              </span>
              <div>
                <strong className="block text-xs font-bold text-slate-900">Garis:</strong>
                <span className="text-slate-600">
                  Menunjukkan hubungan antar topik yang sering muncul.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                <div className="grid grid-cols-2 place-items-center gap-1">
                  <span className="h-2 w-2 rounded-[3px] bg-[#dc2626]" />
                  <span className="h-2 w-2 rounded-[3px] bg-[#eab308]" />
                  <span className="h-2 w-2 rounded-[3px] bg-[#22c55e]" />
                  <span className="h-2 w-2 rounded-[3px] bg-[#2563eb]" />
                </div>
              </span>
              <div>
                <strong className="block text-xs font-bold text-slate-900">Warna:</strong>
                <span className="text-slate-600">
                  Menunjukkan kelompok topik dengan tema yang saling berhubungan.
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-slate-500">
            Topik yang saling terhubung tidak selalu menunjukkan hubungan sebab-akibat. Peta ini membantu membaca pola keterkaitan topik, bukan menilai kualitas penelitian secara langsung.
          </p>
        </div>
      )}

      {mode === "kepadatan" && (
        <>
          <p className="mt-2 text-xs leading-5 text-slate-600">
            Peta Kepadatan menunjukkan konsentrasi topik dalam kumpulan artikel yang dianalisis melalui perbedaan warna.
          </p>
          <div className="mt-3 space-y-2 rounded-lg bg-slate-50 p-3">
            {[
              ["#dc2626", "Merah", "Kepadatan sangat tinggi"],
              ["#eab308", "Kuning", "Kepadatan tinggi"],
              ["#22c55e", "Hijau", "Kepadatan sedang"],
              ["#2563eb", "Biru", "Kepadatan rendah"],
            ].map(([color, name, label]) => (
              <div key={name} className="flex items-center gap-2.5 text-xs leading-5">
                <span className="h-4 w-4 shrink-0 rounded-[4px]" style={{ background: color }} />
                <span className="w-14 shrink-0 font-semibold text-slate-800">{name}</span>
                <span className="text-slate-600">{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-600">
            Semakin hangat warna pada suatu area, semakin tinggi konsentrasi item berbobot di sekitarnya. Warna tidak menunjukkan kualitas penelitian ataupun secara langsung membuktikan adanya research gap.
          </p>
        </>
      )}

      {mode === "perkembangan" && (
        <div className="mt-3 flex flex-col gap-3.5">
          <p className="text-xs leading-relaxed text-slate-600">
            Peta Perkembangan membantu kamu melihat perbedaan periode publikasi pada setiap topik penelitian.
          </p>

          <div className="flex flex-col gap-3 rounded-2xl bg-[#f8fafc] p-4 text-xs leading-relaxed">
            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                <div className="grid grid-cols-2 place-items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#2563eb]" />
                  <span className="h-2 w-2 rounded-full bg-[#2dd4bf]" />
                  <span className="h-2 w-2 rounded-full bg-[#facc15]" />
                  <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                </div>
              </span>
              <div>
                <strong className="block text-xs font-bold text-slate-900">Warna:</strong>
                <span className="text-slate-600">
                  menggambarkan rata-rata tahun publikasi artikel yang berkaitan dengan suatu topik, sesuai legenda waktu pada peta.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                <span className="h-4 w-4 rounded-full bg-[#3b82f6]" />
              </span>
              <div>
                <strong className="block text-xs font-bold text-slate-900">Lingkaran:</strong>
                <span className="text-slate-600">menunjukkan topik yang dianalisis.</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                <span className="h-1.5 w-6 rounded-full bg-[#94a3b8]" />
              </span>
              <div>
                <strong className="block text-xs font-bold text-slate-900">Garis:</strong>
                <span className="text-slate-600">
                  menunjukkan hubungan antar topik berdasarkan metode jaringan yang digunakan.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-[9.5px] font-extrabold text-[#00629b] border border-sky-200/60">
                  ’24
                </span>
              </span>
              <div>
                <strong className="block text-xs font-bold text-slate-900">Angka tahun:</strong>
                <span className="text-slate-600">
                  menunjukkan rata-rata tahun publikasi, bukan tahun pertama kali topik tersebut diteliti.
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-slate-500">
            Topik dengan rata-rata tahun lebih baru tidak otomatis sedang mengalami peningkatan popularitas. Untuk mengetahui tren pertumbuhan, diperlukan data jumlah publikasi per tahun.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative mx-auto flex w-full max-w-[1160px] flex-col gap-4 pb-10 md:gap-5 md:pb-8">
      {/* Indikator Garis Penanda Scroll di Pinggir Kanan Frame */}
      <FrameScrollIndicator />
      {/* Mobile Top Action Bar: Kembali ke Pencarian & Simpan ke Koleksi */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          onClick={onBack}
          className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-sky-700 px-3.5 py-2.5 text-xs font-bold text-white shadow-xs transition-all active:scale-[0.98]"
        >
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 6H2M5.5 2.5L2 6l3.5 3.5" />
          </svg>
          Kembali
        </button>
        <button
          type="button"
          onClick={onSave}
          className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold shadow-xs outline outline-1 transition-all active:scale-[0.98] cursor-pointer ${
            saved ? "bg-sky-50 text-sky-700 outline-sky-200 hover:bg-sky-100" : "bg-white text-slate-700 outline-slate-200 hover:bg-slate-50"
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 2.5h8a1 1 0 0 1 1 1v10l-5-3-5 3v-10a1 1 0 0 1 1-1z" />
          </svg>
          {saved ? "Tersimpan" : "Simpan ke Koleksi"}
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex md:items-start md:justify-between md:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold leading-7 text-slate-900 md:text-2xl md:leading-8">Peta Penelitian</h1>
          <p className="mt-1 text-xs leading-5 text-slate-500 md:mt-1.5">
            Jelajahi peta topik dari {priorityRows.length} publikasi, lalu geser slider untuk melihat jaringan, kepadatan sitasi, dan perkembangan tahun terbitnya.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onSave}
            className={`flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold shadow-xs outline outline-1 transition-all duration-150 active:scale-[0.98] cursor-pointer ${
              saved ? "bg-sky-50 text-sky-700 outline-sky-200 hover:bg-sky-100 hover:outline-sky-300" : "bg-white text-slate-700 outline-slate-200 hover:bg-sky-50 hover:text-sky-700"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 2.5h8a1 1 0 0 1 1 1v10l-5-3-5 3v-10a1 1 0 0 1 1-1z" />
            </svg>
            {saved ? "Tersimpan" : "Simpan ke Koleksi"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all active:scale-[0.98] md:px-5"
          >
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 6H2M5.5 2.5L2 6l3.5 3.5" />
            </svg>
            Kembali ke Pencarian
          </button>
        </div>
      </div>

      <section className="rounded-2xl bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3.5 sm:gap-4">
          {/* Mobile Title, Subtitle, & Panduan Peta inside the white shape card */}
          <div className="md:hidden pb-1">
            <div className="flex items-center justify-between gap-2.5">
              <h1 className="text-lg sm:text-xl font-bold leading-snug text-slate-900">Peta Penelitian</h1>
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setHelpOpen(value => !value)}
                  aria-expanded={helpOpen}
                  title="Lihat panduan cara membaca peta"
                  className={`group flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold leading-5 transition-all duration-75 active:scale-95 cursor-pointer select-none ${
                    helpOpen
                      ? "border border-[#0070ba] bg-[#0070ba] text-white shadow-xs"
                      : "border border-slate-300/90 bg-white text-slate-700 shadow-2xs hover:border-[#0070ba] hover:bg-[#eaf6ff] hover:text-[#00629b]"
                  }`}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.5" />
                    <path d="M8 7.2v4" />
                    <circle cx="8" cy="4.9" r="0.9" fill="currentColor" stroke="none" />
                  </svg>
                  <span>Panduan Peta</span>
                </button>
                {helpOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Tutup panduan peta"
                      onClick={() => setHelpOpen(false)}
                      className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px] sm:hidden"
                    />
                    <div className="sm:hidden">
                      {guideDialogContent}
                    </div>
                  </>
                )}
              </div>
            </div>
            <p className="mt-2 text-xs sm:text-[13.5px] leading-relaxed text-slate-500">
              Jelajahi peta topik dari {priorityRows.length} publikasi, lalu geser slider untuk melihat jaringan, kepadatan sitasi, dan perkembangan tahun terbitnya.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex w-full sm:w-auto rounded-xl bg-slate-100 p-1">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setMode(tab.key);
                    setProgress(0);
                    setIsPlaying(true);
                    setAnalysisOpen(null);
                    resetMapView();
                  }}
                  className={`flex-1 sm:flex-initial rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-all duration-75 active:scale-95 cursor-pointer ${
                    mode === tab.key ? "bg-white text-sky-700 shadow-xs" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Desktop Quick Tools */}
            <div className="hidden sm:flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                title="Putar simulasi visualisasi peta"
                className="flex items-center gap-1.5 rounded-lg border border-sky-200/90 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 shadow-2xs transition-all duration-75 hover:bg-sky-100 hover:text-sky-800 active:scale-95 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="3" y="2" width="3.5" height="12" rx="1" />
                      <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
                    </svg>
                    <span>Jeda</span>
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <polygon points="4,2 14,8 4,14" />
                    </svg>
                    <span>{mode === "perkembangan" ? "Putar Timeline" : "Putar Simulasi"}</span>
                  </>
                )}
              </button>

              {mode !== "kepadatan" && (
                <button
                  type="button"
                  onClick={() => setShowLines(value => !value)}
                  aria-pressed={showLines}
                  className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] cursor-pointer transition-transform duration-75 active:scale-95"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                    <path d="M5.6 8.4l2.8-2.8M4.4 6.4L2.9 7.9a2.47 2.47 0 103.5 3.5l1.5-1.5M9.6 7.6l1.5-1.5a2.47 2.47 0 10-3.5-3.5L6.1 4.1" />
                  </svg>
                  <span className="text-xs font-medium leading-4 text-slate-500">Garis Relasi</span>
                  <span className={`h-4 w-4 rounded-[3px] transition-colors ${showLines ? "bg-sky-700" : "bg-slate-300"}`} />
                </button>
              )}

              <div className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                <button
                  type="button"
                  aria-label="Perkecil peta"
                  onClick={() => zoomAt(zoom - 18)}
                  className="flex h-6 w-6 items-center justify-center rounded-sm text-sm font-bold text-slate-500 transition-transform duration-75 hover:bg-slate-50 active:scale-90 cursor-pointer"
                >
                  &minus;
                </button>
                <button
                  type="button"
                  onClick={resetMapView}
                  title="Reset tampilan peta"
                  className="w-9 rounded-sm text-center text-xs font-semibold leading-4 text-slate-900 transition-transform duration-75 hover:bg-slate-50 active:scale-95 cursor-pointer"
                >
                  {zoom}%
                </button>
                <button
                  type="button"
                  aria-label="Perbesar peta"
                  onClick={() => zoomAt(zoom + 18)}
                  className="flex h-6 w-6 items-center justify-center rounded-sm text-sm font-bold text-slate-500 transition-transform duration-75 hover:bg-slate-50 active:scale-90 cursor-pointer"
                >
                  +
                </button>
              </div>

              {Object.keys(nodeOffsets).length > 0 && (
                <button
                  type="button"
                  onClick={() => setNodeOffsets({})}
                  title="Kembalikan semua topik ke posisi awal"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-transform duration-75 hover:bg-slate-50 active:scale-95 cursor-pointer"
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2.5 8a5.5 5.5 0 0 1 9.39-3.89L13.5 5.5M13.5 2v3.5H10" />
                    <path d="M13.5 8a5.5 5.5 0 0 1-9.39 3.89L2.5 10.5M2.5 14v-3.5H6" />
                  </svg>
                  <span>Reset Posisi</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={isDownloadingImage}
                title="Unduh visualisasi peta sebagai gambar"
                className={`group flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-sm font-semibold leading-5 transition-all duration-75 active:scale-95 cursor-pointer select-none ${
                  isDownloadingImage
                    ? "border border-[#0070ba] bg-[#0070ba] text-white shadow-sm"
                    : "border border-slate-300 bg-white text-slate-700 shadow-xs hover:border-[#0070ba] hover:bg-[#eaf6ff] hover:text-[#00629b]"
                }`}
              >
                {isDownloadingImage ? (
                  <svg className="h-3.5 w-3.5 animate-spin text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6.5 1.5v7M3.8 5.8l2.7 2.7 2.7-2.7M2 11h9" />
                  </svg>
                )}
                <span>{isDownloadingImage ? "Mengunduh..." : "Unduh Gambar"}</span>
              </button>

              <div className="relative ml-auto">
                <button
                  type="button"
                  onClick={() => setHelpOpen(value => !value)}
                  aria-expanded={helpOpen}
                  title="Lihat panduan cara membaca peta"
                  className={`group flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-sm font-semibold leading-5 transition-all duration-75 active:scale-95 cursor-pointer select-none ${
                    helpOpen
                      ? "border border-[#0070ba] bg-[#0070ba] text-white shadow-sm"
                      : "border border-slate-300 bg-white text-slate-700 shadow-xs hover:border-[#0070ba] hover:bg-[#eaf6ff] hover:text-[#00629b]"
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.5" />
                    <path d="M8 7.2v4" />
                    <circle cx="8" cy="4.9" r="0.9" fill="currentColor" stroke="none" />
                  </svg>
                  <span>Panduan Peta</span>
                </button>

                {helpOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Tutup panduan peta"
                      onClick={() => setHelpOpen(false)}
                      className="fixed inset-0 z-20 cursor-default"
                    />
                    <div className="hidden sm:block">
                      {guideDialogContent}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Map Header Outside Shape (Below Tabs) */}
        {!fullscreen && (
          <div className="mt-3.5 flex items-start gap-2.5 md:hidden">
            <span className="mt-0.5 shrink-0">{modeIcon}</span>
            <div className="min-w-0 flex-1">
              <h3 className="font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold leading-6 text-slate-900">
                {modeInfo.title}
              </h3>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                {modeInfo.subtitle}
              </p>
            </div>
          </div>
        )}

        {fullscreen && (
          <div
            className="fixed inset-0 z-[399] bg-black/40 backdrop-blur-xs"
            onClick={() => setFullscreen(false)}
          />
        )}

        <div
          className={
            fullscreen
              ? "fixed inset-2 sm:inset-4 md:inset-6 z-[400] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(2,6,23,0.35)]"
              : "mt-2.5 md:mt-4 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          }
        >
          <div className={`items-start justify-between gap-3 px-4 pt-4 md:gap-4 md:px-6 md:pt-5 ${fullscreen ? "flex" : "hidden md:flex"}`}>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0">{modeIcon}</span>
              <div>
                <h3 className="font-['Plus_Jakarta_Sans:Bold'] text-xl font-bold leading-7 text-slate-900">{modeInfo.title}</h3>
                <p className="mt-1 text-sm leading-5 text-slate-500">{modeInfo.subtitle}</p>
              </div>
            </div>
            <button
              type="button"
              aria-label={fullscreen ? "Keluar dari layar penuh" : "Tampilkan peta layar penuh"}
              aria-pressed={fullscreen}
              onClick={() => setFullscreen(value => !value)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800 cursor-pointer shadow-2xs md:h-9 md:w-9 md:p-0 md:justify-center"
            >
              {fullscreen ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 2v4H2M10 2v4h4M6 14v-4H2M10 14v-4h4" />
                  </svg>
                  <span className="md:hidden">Kecilkan</span>
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" />
                  </svg>
                  <span className="md:hidden">Perbesar</span>
                </>
              )}
            </button>
          </div>

          <div className={`flex gap-4 ${fullscreen ? "min-h-0 flex-1 px-4 pt-3 pb-2 md:px-6 md:pt-4" : "p-3 md:px-6 md:pb-2 md:pt-4"}`}>
            <div
              ref={graphRef}
              onPointerDown={handleMapPointerDown}
              onPointerMove={handleMapPointerMove}
              onPointerUp={handleMapPointerUp}
              onPointerCancel={handleMapPointerUp}
              onDoubleClick={resetMapView}
              className={`relative min-w-0 flex-1 touch-none select-none overflow-hidden rounded-xl ${
                dragging ? "cursor-grabbing" : "cursor-grab"
              } ${fullscreen ? "h-full min-h-[300px]" : "h-48 md:h-[560px]"} ${
                mode === "kepadatan"
                  ? "bg-[radial-gradient(circle_at_48%_45%,#1d4ed8_0%,#0b3bb8_55%,#072a8c_100%)]"
                  : "bg-[radial-gradient(circle_at_50%_35%,#f8fbff_0%,#ffffff_65%)]"
              }`}
            >
              {(() => {
                const spotlightNode = hoveredNode || (nodeFilter ? activeNode : null);
                const connectedNodeNames = new Set<string>();
                if (spotlightNode) {
                  connectedNodeNames.add(spotlightNode);
                  edgeList.forEach(edge => {
                    if (edge.fromNodeName === spotlightNode) connectedNodeNames.add(edge.toNodeName);
                    if (edge.toNodeName === spotlightNode) connectedNodeNames.add(edge.fromNodeName);
                  });
                }
                const hoveredNodeData = hoveredNode
                  ? mapMainNodes.find(n => n.name === hoveredNode) ||
                    (() => {
                      const small = mapSmallNodes.find(n => n.name === hoveredNode);
                      if (!small) return null;
                      return {
                        name: small.name,
                        x: small.x,
                        y: small.y,
                        r: small.r,
                        cluster: small.cluster,
                        year: nearestMain(small).year,
                        labelPos: "right" as const,
                      };
                    })()
                  : null;
                const hoveredNodePos = hoveredNodeData
                  ? (mapMainNodes.some(m => m.name === hoveredNodeData.name)
                      ? getNodePos(hoveredNodeData as MapNode)
                      : { x: hoveredNodeData.x, y: hoveredNodeData.y })
                  : null;

                if (mode === "kepadatan") {
                  return (
                    <div
                      className="absolute inset-0"
                      style={{
                        transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom / 100})`,
                        transformOrigin: "0 0",
                        transition: dragging ? "none" : "transform 260ms cubic-bezier(0.2, 0.9, 0.3, 1)",
                        willChange: "transform",
                      }}
                    >
                      {[
                        { x: 8, y: 10, w: 30, h: 34 },
                        { x: 34, y: 62, w: 34, h: 38 },
                        { x: 62, y: 4, w: 30, h: 30 },
                        { x: 74, y: 68, w: 28, h: 32 },
                      ].map((blob, index) => (
                        <span
                          key={`ambient-${index}`}
                          className="map-ambient-breathe pointer-events-none absolute rounded-full"
                          style={{
                            left: `${blob.x}%`,
                            top: `${blob.y}%`,
                            width: `${blob.w}%`,
                            height: `${blob.h}%`,
                            background: "radial-gradient(circle, rgba(56,189,248,0.35) 0%, rgba(56,189,248,0) 70%)",
                            filter: "blur(12px)",
                            animationDelay: `${index * 2.5}s`,
                          }}
                        />
                      ))}

                      {heatSpots.map((spot, idx) => {
                        const spotScale = isMobilePreview ? 0.48 : 1;
                        return (
                          <span
                            key={spot.name}
                            className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-300 ${
                              idx % 2 === 0 ? "map-thermal-breathe" : "map-thermal-breathe-alt"
                            }`}
                            style={{
                              left: `${spot.x}%`,
                              top: `${spot.y}%`,
                              width: spot.size * densityScale * pulseScale * spotScale,
                              height: spot.size * densityScale * pulseScale * 0.82 * spotScale,
                              opacity: progress <= 0 ? 0 : 1,
                              animationDelay: `${idx * 0.7}s`,
                            }}
                          >
                            <span
                              className="absolute inset-0 rounded-full"
                              style={{
                                background: "radial-gradient(circle, rgba(74,222,128,0.95) 0%, rgba(34,197,94,0.5) 40%, rgba(29,78,216,0) 74%)",
                                filter: isMobilePreview ? "blur(8px)" : "blur(14px)",
                              }}
                            />
                            <span
                              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                              style={{
                                width: "62%",
                                height: "62%",
                                background: "radial-gradient(circle, rgba(250,204,21,0.95) 0%, rgba(250,204,21,0.55) 48%, rgba(250,204,21,0) 78%)",
                                filter: isMobilePreview ? "blur(6px)" : "blur(10px)",
                              }}
                            />
                            <span
                              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                              style={{
                                width: "34%",
                                height: "34%",
                                background: "radial-gradient(circle, rgba(239,68,68,0.98) 0%, rgba(239,68,68,0.7) 52%, rgba(239,68,68,0) 82%)",
                                filter: isMobilePreview ? "blur(4px)" : "blur(7px)",
                              }}
                            />
                          </span>
                        );
                      })}

                      {mapMainNodes.map((node, idx) => {
                        const pos = getNodePos(node);
                        return (
                          <button
                            key={node.name}
                            type="button"
                            data-map-node
                            data-node-name={node.name}
                            onClick={() => {
                              if (justDraggedRef.current) return;
                              toggleNode(node.name);
                            }}
                            onMouseEnter={() => setHoveredNode(node.name)}
                            onMouseLeave={() => setHoveredNode(null)}
                            aria-pressed={nodeFilter === node.name}
                            aria-label={`Saring publikasi topik ${node.name}`}
                            className="group absolute flex cursor-pointer -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 text-left transition-transform hover:scale-110"
                            style={{ left: `${pos.x}%`, top: `${pos.y}%`, opacity: 0.75 + 0.25 * progress }}
                          >
                            <span className={`relative flex items-center justify-center ${isMobilePreview ? "h-2.5 w-2.5" : "h-3.5 w-3.5"}`}>
                              <span
                                className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60"
                                style={{ animationDuration: `${2.2 + (idx % 3) * 0.5}s` }}
                              />
                              <span className={`relative inline-flex rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)] ${isMobilePreview ? "h-1.5 w-1.5" : "h-2.5 w-2.5"}`} />
                            </span>
                            <span className={`whitespace-nowrap font-extrabold text-white [text-shadow:0_1px_8px_rgba(2,20,80,0.95)] transition-colors group-hover:text-yellow-300 ${
                              isMobilePreview ? "text-[8px] leading-tight" : "text-[13px] leading-4"
                            }`}>
                              {node.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                }

                return (
                  <div
                    className="absolute inset-0"
                    style={{
                      transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom / 100})`,
                      transformOrigin: "0 0",
                      transition: dragging ? "none" : "transform 260ms cubic-bezier(0.2, 0.9, 0.3, 1)",
                      willChange: "transform",
                    }}
                  >
                    {[
                      { x: 12, y: 12, size: 340, color: "rgba(59,130,246,0.22)" },
                      { x: 46, y: 6, size: 320, color: "rgba(52,211,153,0.22)" },
                      { x: 68, y: 24, size: 360, color: "rgba(168,85,247,0.2)" },
                      { x: 6, y: 56, size: 300, color: "rgba(251,191,36,0.22)" },
                      { x: 76, y: 62, size: 260, color: "rgba(156,163,175,0.2)" },
                    ].map((blob, index) => (
                      <span
                        key={`glow-${index}`}
                        className="map-ambient-breathe pointer-events-none absolute rounded-full transition-opacity duration-300"
                        style={{
                          left: `${blob.x}%`,
                          top: `${blob.y}%`,
                          width: blob.size,
                          height: blob.size,
                          background: `radial-gradient(circle, ${blob.color} 0%, rgba(255,255,255,0) 70%)`,
                          filter: "blur(14px)",
                          opacity: mode === "perkembangan" ? 0.7 : 1,
                          animationDelay: `${index * 3.2}s`,
                        }}
                      />
                    ))}

                    {showLines && (
                      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                        {edgeList.map((edge, index) => {
                          const bend = index % 2 === 0 ? 0.06 : -0.06;
                          const visible = mode !== "perkembangan" || edge.year <= playYear;
                          const isEdgeHighlighted = spotlightNode
                            ? edge.fromNodeName === spotlightNode || edge.toNodeName === spotlightNode
                            : false;
                          const isEdgeDimmed = spotlightNode ? !isEdgeHighlighted : false;

                          const edgeReveal = mode === "jaringan" ? Math.max(0, Math.min(1, (progress - (index / Math.max(1, edgeList.length)) * 0.5) * 3)) : 1;

                          const opacity = isEdgeHighlighted
                            ? 0.95
                            : isEdgeDimmed
                              ? 0.08
                              : mode === "jaringan" ? 0.42 * edgeReveal : mode === "perkembangan" ? (visible ? 0.45 : 0.05) : 0.2;

                          const strokeWidth = isEdgeHighlighted
                            ? (mode === "jaringan" ? edge.weight * 2 : 2.4)
                            : (mode === "jaringan" ? edge.weight : 1);

                          return (
                            <path
                              key={edge.key}
                              d={mapCurve(edge.from, edge.to, bend)}
                              fill="none"
                              stroke={isEdgeHighlighted ? (mode === "perkembangan" ? mapYearColor(edge.year) : edge.color) : edge.color}
                              strokeWidth={strokeWidth}
                              strokeLinecap="round"
                              vectorEffect="non-scaling-stroke"
                              className={isEdgeHighlighted ? "map-edge-flow-active" : "map-edge-flow"}
                              style={{ opacity, transition: "opacity 200ms ease, stroke-width 200ms ease" }}
                            />
                          );
                        })}
                      </svg>
                    )}

                    {mapSmallNodes.map((node, index) => {
                      if (isMobilePreview && index >= 24) return null;
                      const anchor = nearestMain(node);
                      const appeared = mode !== "perkembangan" || anchor.year <= playYear;
                      const color = mode === "perkembangan" ? mapYearColor(anchor.year) : mapClusters[node.cluster].color;
                      const reveal = mode === "jaringan" ? Math.max(0, Math.min(1, (progress - index * 0.004) * 2.2)) : 1;
                      const isConnectedToSpotlight = spotlightNode ? anchor.name === spotlightNode || node.name === spotlightNode : false;
                      const isDimmed = spotlightNode ? !isConnectedToSpotlight : false;
                      const floatClass = index % 3 === 0 ? "map-float-1" : index % 3 === 1 ? "map-float-2" : "map-float-3";

                      // Google Maps Level-of-Detail (LoD) Zoom Logic:
                      // Semakin di-zoom, topik-topik kecil semakin terlihat redaksinya
                      const isNodeHovered = hoveredNode === node.name;
                      const isNodeActive = activeNode === node.name;
                      const isNodeSelected = selectedNodeForDetail === node.name;
                      const isInteractive = isNodeHovered || isNodeActive || isNodeSelected;

                      // Ambang batas zoom bertingkat (LoD):
                      // - Sub-topik agak besar (r >= 6): mulai muncul di zoom 104%, jelas di 118%
                      // - Sub-topik sedang (r === 5): mulai muncul di zoom 114%, jelas di 128%
                      // - Sub-topik paling kecil (r <= 4): mulai muncul di zoom 124%, jelas di 140%
                      const minZoom = node.r >= 6 ? 104 : node.r >= 5 ? 114 : 124;
                      const labelLoDOpacity = Math.min(1, Math.max(0, (zoom - minZoom) / 16));
                      const isLabelVisible = !isMobilePreview && (isInteractive || labelLoDOpacity > 0.05);
                      const finalOpacity = isInteractive ? 1 : labelLoDOpacity;
                      const dotRadius = isMobilePreview ? Math.max(2.5, Math.round(node.r * 0.4)) : node.r;

                      return (
                        <div
                          key={`small-${node.name}-${index}`}
                          data-map-node="small"
                          data-node-name={node.name}
                          onClick={e => {
                            e.stopPropagation();
                            if (justDraggedRef.current) return;
                            toggleNode(node.name);
                            setSelectedNodeForDetail(node.name);
                            setShowNodeArticles(false);
                          }}
                          onMouseEnter={() => setHoveredNode(node.name)}
                          onMouseLeave={() => setHoveredNode(null)}
                          className={`group absolute cursor-pointer transition-all duration-200 ${floatClass}`}
                          style={{
                            left: `${node.x}%`,
                            top: `${node.y}%`,
                            zIndex: isInteractive ? 30 : isLabelVisible ? 16 : 6,
                            animationDelay: `${(index % 5) * 0.4}s`,
                          }}
                        >
                          {/* Dot Bulatan Node Kecil */}
                          <span
                            className="block rounded-full transition-transform duration-200 group-hover:scale-140"
                            style={{
                              width: dotRadius * 2,
                              height: dotRadius * 2,
                              marginLeft: -dotRadius,
                              marginTop: -dotRadius,
                              background: color,
                              opacity: isDimmed ? 0.15 : (appeared ? 0.95 : 0.2) * reveal,
                              transform: `scale(${isDimmed ? 0.5 : isInteractive ? 1.4 : 0.6 + 0.4 * reveal})`,
                              boxShadow: isInteractive
                                ? `0 0 12px 2px ${color}dd`
                                : isConnectedToSpotlight
                                  ? `0 0 10px 1px ${color}aa`
                                  : `0 2px 6px -1px ${color}66`,
                            }}
                          />

                          {/* Redaksi Topik (Google Maps style - makin di-zoom makin kelihatan dan jelas) */}
                          {isLabelVisible && (
                            <span
                              className="pointer-events-none absolute whitespace-nowrap select-none transition-opacity duration-200"
                              style={{
                                left: `${node.r + 4}px`,
                                top: "50%",
                                transform: "translateY(-50%)",
                                opacity: finalOpacity,
                                filter: isDimmed ? "opacity(0.35)" : "none",
                              }}
                            >
                              <span
                                className={`inline-block rounded px-1.5 py-0.5 text-[9px] sm:text-[10px] md:text-[10.5px] font-semibold leading-tight tracking-tight ${
                                  mode === "kepadatan"
                                    ? "text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] bg-black/70"
                                    : "text-slate-800 [text-shadow:0_0_3px_rgba(255,255,255,0.95)] bg-white/95 border border-slate-200/80 shadow-2xs"
                                } ${isInteractive ? "font-bold text-sky-800 bg-sky-50/95 ring-1 ring-sky-300 scale-105" : ""}`}
                              >
                                {node.name}
                              </span>
                            </span>
                          )}
                        </div>
                      );
                    })}

                    {mapMainNodes.map((node, index) => {
                      const pos = getNodePos(node);
                      const appeared = mode !== "perkembangan" || node.year <= playYear;
                      const color = mode === "perkembangan" ? mapYearColor(node.year) : mapClusters[node.cluster].color;
                      const reveal = mode === "jaringan"
                        ? (node.name === "AI literacy"
                            ? Math.max(0.4, Math.min(1, progress * 2.2))
                            : Math.max(0, Math.min(1, (progress - 0.06 - index * 0.05) * 2.5)))
                        : 1;
                      const active = activeNode === node.name;
                      const isTarget = hoveredNode === node.name;
                      const isConnected = spotlightNode ? connectedNodeNames.has(node.name) : false;
                      const isDimmed = spotlightNode ? !isConnected : false;

                      const isCenter = node.name === "AI literacy";
                      const currentRadius = isMobilePreview ? (isCenter ? 22 : 6) : node.r;
                      const labelPos = mode === "perkembangan" && node.labelPos === "inside" && !isMobilePreview ? "right" : node.labelPos;
                      const labelGap = currentRadius + (isMobilePreview ? 8 : 12);

                      const translate =
                        isCenter
                          ? "translate(-50%, -50%)"
                          : labelPos === "inside"
                            ? "translate(-50%, -50%)"
                            : labelPos === "top"
                              ? `translate(-50%, calc(-100% - ${labelGap}px))`
                              : labelPos === "bottom"
                                ? `translate(-50%, ${labelGap}px)`
                                : labelPos === "left"
                                  ? `translate(calc(-100% - ${labelGap}px), -50%)`
                                  : `translate(${labelGap}px, -50%)`;
                      const textAlign = isCenter ? "center" : labelPos === "left" ? "right" : labelPos === "right" ? "left" : "center";
                      const floatClass = index % 3 === 0 ? "map-float-1" : index % 3 === 1 ? "map-float-2" : "map-float-3";

                      return (
                        <div
                          key={node.name}
                          className={`absolute z-10 transition-opacity duration-200 ${floatClass}`}
                          style={{
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                            opacity: (isDimmed ? 0.3 : (appeared ? 1 : 0.5)) * reveal,
                            animationDelay: `${index * 0.4}s`,
                          }}
                        >
                          {/* Concentric animated ripple waves on central/major/active nodes (Only on desktop or fullscreen) */}
                          {!isMobilePreview && (node.r >= 22 || active || isTarget) && (
                            <>
                              <span
                                className="pointer-events-none absolute left-0 top-0 rounded-full"
                                style={{
                                  width: currentRadius * 2,
                                  height: currentRadius * 2,
                                  border: `2px solid ${color}`,
                                  animation: "map-ripple-ring 3.6s cubic-bezier(0, 0.2, 0.8, 1) infinite",
                                  animationDelay: `${index * 0.5}s`,
                                }}
                              />
                              <span
                                className="pointer-events-none absolute left-0 top-0 rounded-full"
                                style={{
                                  width: currentRadius * 2,
                                  height: currentRadius * 2,
                                  border: `1.5px solid ${color}`,
                                  animation: "map-ripple-ring-delayed 3.6s cubic-bezier(0, 0.2, 0.8, 1) infinite",
                                  animationDelay: `${index * 0.5 + 1.2}s`,
                                }}
                              />
                            </>
                          )}

                          <button
                            type="button"
                            data-map-node
                            data-node-name={node.name}
                            onPointerDown={e => handleNodePointerDown(node.name, e)}
                            onPointerMove={handleNodePointerMove}
                            onPointerUp={e => handleNodePointerUp(node.name, e)}
                            onMouseEnter={() => setHoveredNode(node.name)}
                            onMouseLeave={() => setHoveredNode(null)}
                            onClick={() => {
                              if (justDraggedRef.current) return;
                              toggleNode(node.name);
                              setSelectedNodeForDetail(node.name);
                              setShowNodeArticles(false);
                            }}
                            aria-pressed={nodeFilter === node.name}
                            aria-label={`Saring publikasi topik ${node.name}. Seret untuk memindahkan posisi.`}
                            title={`${node.name} · Klik untuk menyaring, seret untuk memindahkan posisi`}
                            className={`absolute left-0 top-0 rounded-full transition-all duration-200 cursor-grab active:cursor-grabbing hover:scale-110 select-none ${
                              isMobilePreview ? "border-[1.5px] border-white shadow-xs" : "border-[3px] border-white"
                            } ${isTarget ? "scale-110" : ""}`}
                            style={{
                              width: currentRadius * 2,
                              height: currentRadius * 2,
                              transform: `translate(-50%, -50%) scale(${reveal})`,
                              background: color,
                              backgroundImage:
                                "linear-gradient(145deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 52%)",
                              boxShadow: isTarget || isConnected || active
                                ? `0 0 0 ${isMobilePreview ? 2 : 5}px ${color}33, 0 0 20px ${color}bb`
                                : isMobilePreview ? `0 2px 8px -2px ${color}80` : `0 8px 22px -8px ${color}99`,
                              filter: appeared ? "none" : "grayscale(0.85)",
                            }}
                          />

                          <span
                            data-map-node
                            data-node-name={node.name}
                            onMouseEnter={() => setHoveredNode(node.name)}
                            onMouseLeave={() => setHoveredNode(null)}
                            onClick={() => {
                              if (justDraggedRef.current) return;
                              toggleNode(node.name);
                              setSelectedNodeForDetail(node.name);
                              setShowNodeArticles(false);
                            }}
                            className={`absolute cursor-pointer whitespace-nowrap transition-all duration-200 select-none ${
                              isMobilePreview
                                ? (isCenter ? "text-[7.5px] font-extrabold text-white pointer-events-none" : "text-[7.5px] font-bold")
                                : (labelPos === "inside"
                                    ? "text-[15px] sm:text-[17px] md:text-[19px] font-extrabold leading-6 text-slate-900"
                                    : "text-[11px] sm:text-[12px] md:text-[13px] font-extrabold leading-[16px] md:leading-[18px] text-slate-900")
                            } ${isTarget ? "text-sky-700 scale-105" : ""}`}
                            style={{ transform: translate, textAlign }}
                          >
                            {isMobilePreview ? (
                              isCenter ? (
                                <span>{node.name}</span>
                              ) : (
                                <span className="inline-block max-w-[85px] truncate rounded bg-white/95 px-1 py-0.5 shadow-2xs border border-slate-200/80 text-slate-800">
                                  {node.name}
                                </span>
                              )
                            ) : (
                              <>
                                <span className="inline-block max-w-[105px] sm:max-w-[130px] md:max-w-none truncate md:overflow-visible rounded-md bg-white/80 md:bg-transparent px-1.5 py-0.5 shadow-2xs md:shadow-none backdrop-blur-[2px] md:backdrop-blur-none border border-slate-200/50 md:border-transparent">
                                  {node.name}
                                </span>
                                {mode === "perkembangan" && (
                                  <span className="block text-[10px] md:text-[12px] font-bold text-slate-500">({node.year.toFixed(1)})</span>
                                )}
                              </>
                            )}
                          </span>
                        </div>
                      );
                    })}

                    {/* Interactive Hover Card / Tooltip (Desktop Only) */}
                    {hoveredNodeData && hoveredNodePos && (
                      <div
                        className="pointer-events-none absolute z-40 hidden md:block rounded-xl border border-slate-200/90 bg-white/95 p-3.5 shadow-xl backdrop-blur-md transition-all duration-150 animate-in fade-in zoom-in-95"
                        style={{
                          left: `${hoveredNodePos.x}%`,
                          top: `${hoveredNodePos.y}%`,
                          transform: hoveredNodePos.y < 30 ? "translate(-50%, 28px)" : "translate(-50%, calc(-100% - 24px))",
                          minWidth: "220px",
                          maxWidth: "280px",
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full shadow-2xs" style={{ background: mapClusters[hoveredNodeData.cluster].color }} />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              {mapNodeDetails[hoveredNodeData.name]?.clusterName ?? mapClusters[hoveredNodeData.cluster].label}
                            </span>
                          </div>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                            Thn {hoveredNodeData.year.toFixed(1)}
                          </span>
                        </div>
                        <h4 className="mt-1 font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold text-slate-900 leading-snug">
                          {hoveredNodeData.name}
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                          {mapNodeDetails[hoveredNodeData.name]?.desc ?? "Topik sentral yang banyak dibahas dalam publikasi ilmiah terkini."}
                        </p>
                        <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] font-semibold">
                          <span className="text-slate-700">
                            <strong className="text-sky-700">{mapNodeDetails[hoveredNodeData.name]?.count ?? 20}</strong> artikel
                          </span>
                          <span className="text-slate-700">
                            <strong className="text-emerald-600">{mapNodeDetails[hoveredNodeData.name]?.relations ?? 5}</strong> relasi topik
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-center gap-1 rounded-lg bg-sky-50 py-1 text-[10px] font-bold text-[#00629b]">
                          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                            <path d="M8 4v4l3 1.5" />
                          </svg>
                          Klik topik untuk menyaring tabel di bawah
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Mobile Floating Expand Button inside Map Preview */}
              {isMobilePreview && (
                <button
                  type="button"
                  aria-label="Tampilkan peta layar penuh"
                  title="Tampilkan peta layar penuh"
                  onPointerDown={e => e.stopPropagation()}
                  onClick={e => {
                    e.stopPropagation();
                    setFullscreen(true);
                  }}
                  className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs backdrop-blur-xs transition-all active:scale-95 cursor-pointer hover:bg-white hover:text-slate-900"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" />
                  </svg>
                  <span>Perbesar</span>
                </button>
              )}

              {!isMobilePreview && (
                <span
                  className={`pointer-events-none absolute bottom-3 left-3 z-20 max-w-[calc(100%-24px)] rounded-lg px-2.5 py-1.5 text-[10px] font-medium leading-4 shadow-sm ${
                    mode === "kepadatan" ? "bg-[#072a8c]/90 text-white/95" : "bg-white/95 text-slate-600 border border-slate-200/80"
                  }`}
                >
                  💡 Geser kanvas · Cubit untuk zoom · Tap node untuk detail
                </span>
              )}
            </div>

          </div>

          {mode !== "jaringan" && (
            <div className="px-5 pb-1 md:px-6">
              {mode === "perkembangan" ? (
                <div className="mx-auto max-w-[900px]">
                  <div className="h-3.5 rounded-full" style={{ backgroundImage: mapYearGradient }} />
                  <div className="mt-2 flex justify-between text-xs font-medium leading-4 text-slate-500">
                    {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map(year => (
                      <span key={year}>{year}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mx-auto max-w-[900px]">
                  <div className="h-3.5 rounded-full" style={{ backgroundImage: mapYearGradient }} />
                  <div className="mt-2 flex justify-between text-xs font-medium leading-4 text-slate-500 md:text-sm">
                    <span>Rendah</span>
                    <span>Tinggi</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === "perkembangan" && (
            <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-slate-100 px-5 py-3 md:px-6">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="sm:hidden flex items-center gap-1.5 rounded-lg bg-sky-50 px-3.5 py-1.5 text-xs font-bold text-sky-700 outline outline-1 outline-sky-200 transition-all hover:bg-sky-100 active:scale-95 cursor-pointer shadow-2xs"
              >
                {isPlaying ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="3" y="2" width="3.5" height="12" rx="1" />
                      <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
                    </svg>
                    <span>Jeda</span>
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <polygon points="4,2 14,8 4,14" />
                    </svg>
                    <span>Putar Timeline</span>
                  </>
                )}
              </button>
              <span className="w-18 shrink-0 text-xs font-bold leading-4 text-slate-800">
                Thn {playYear.toFixed(1)}
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(progress * 100)}
                onChange={event => {
                  setIsPlaying(false);
                  setProgress(Number(event.target.value) / 100);
                }}
                aria-label="Kontrol simulasi peta"
                className="h-1.5 w-full flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#0369a1] md:min-w-32"
              />
            </div>
          )}

          {(mode === "jaringan" || mode === "kepadatan") && (
            <div className="flex items-center border-t border-slate-100 px-5 py-2.5 sm:hidden">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="flex items-center gap-1.5 rounded-lg bg-sky-50 px-3.5 py-1.5 text-xs font-bold text-sky-700 outline outline-1 outline-sky-200 transition-all hover:bg-sky-100 active:scale-95 cursor-pointer shadow-2xs"
              >
                {isPlaying ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="3" y="2" width="3.5" height="12" rx="1" />
                      <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
                    </svg>
                    <span>Jeda</span>
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <polygon points="4,2 14,8 4,14" />
                    </svg>
                    <span>Putar Simulasi</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 px-5 py-3 text-sm leading-5 text-slate-500 md:px-6">
            {modeInfo.stats.map((stat, index) => (
              <span key={stat} className="flex items-center gap-4">
                <span className={`h-4 w-px bg-slate-300 ${index === 0 ? "md:hidden" : ""}`} />
                {stat}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-slate-200/80 md:border-0 md:p-0 md:outline md:outline-1 md:outline-offset-[-1px] md:outline-slate-200/90">
        {/* Mobile Header (Sama persis dengan Literatur Review) */}
        <div className="md:hidden">
          <div className="flex items-center justify-between gap-2.5">
            <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-[17px] sm:text-lg font-bold text-slate-900 tracking-[-0.2px]">
              Jurnal yang Digunakan
            </h2>
            <span className="shrink-0 whitespace-nowrap inline-flex items-center rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-[#00629b] border border-sky-200/60">
              Total {visibleRows.length} artikel
            </span>
          </div>
          <p className="mt-1.5 text-[13.5px] sm:text-sm leading-5 text-slate-500">
            Daftar jurnal yang menjadi dasar pembuatan peta penelitian.
          </p>

          {nodeFilter && (
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNodeFilter(null)}
                className="flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 outline outline-1 outline-sky-200"
              >
                Klaster: {nodeFilter}
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M1.5 1.5l6 6M7.5 1.5l-6 6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex md:items-start md:justify-between md:gap-4 md:border-b md:border-slate-200/70 md:p-7">
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-sky-700 self-start mt-1">
              <svg width="12" height="13" viewBox="0 0 12 13" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="7" height="7" rx="1.5" fill="white" />
                <rect x="4.5" y="5" width="6.5" height="6.5" rx="1.5" fill="#bae6fd" />
              </svg>
            </span>
            <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-lg font-semibold leading-7 text-slate-900">
              Jurnal yang Digunakan
            </h2>
            <p className="col-start-2 mt-0.5 text-sm leading-5 text-slate-500">
              Daftar jurnal yang menjadi dasar pembuatan peta penelitian.
            </p>
          </div>
          <label className="flex h-10 w-80 shrink-0 items-center gap-2.5 rounded-xl border border-slate-300 bg-slate-50/90 px-3.5 shadow-sm transition-colors hover:border-slate-400 hover:bg-white focus-within:border-sky-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100">
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className="shrink-0">
              <circle cx="6" cy="6" r="4.5" />
              <path d="M9.5 9.5L13 13" />
            </svg>
            <input
              value={mapSearch}
              onChange={event => setMapSearch(capitalizeFirstLetter(event.target.value))}
              placeholder="Cari judul, penulis, atau kata kunci..."
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        {/* Desktop Node filter */}
        {nodeFilter && (
          <div className="hidden md:flex flex-wrap items-center gap-2 border-b border-slate-200/70 px-7 py-3.5">
            <button
              type="button"
              onClick={() => setNodeFilter(null)}
              className="flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-sm font-medium leading-5 text-sky-700 outline outline-1 outline-sky-200"
            >
              Klaster: {nodeFilter}
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M1.5 1.5l6 6M7.5 1.5l-6 6" />
              </svg>
            </button>
          </div>
        )}

        {/* Desktop Table View */}
        <div className="hidden max-h-[480px] overflow-auto md:block">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-200/80 bg-slate-50/70">
                <th className="px-5 py-3 text-xs font-semibold text-slate-500">Judul & Penulis</th>
                <th className="w-28 px-5 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRelevanSort(null);
                      setYearSort(yearSort === "desc" ? "asc" : "desc");
                    }}
                    className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${yearSort ? "text-[#0369a1]" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Tahun
                    <SortArrow dir={yearSort} />
                  </button>
                </th>
                <th className="w-40 px-5 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      setYearSort(null);
                      setRelevanSort(relevanSort === "desc" ? "asc" : "desc");
                    }}
                    className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${relevanSort ? "text-[#0369a1]" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Relevansi
                    <SortArrow dir={relevanSort} />
                  </button>
                </th>
                <th className="w-44 px-5 py-3 text-xs font-semibold text-slate-500">Sumber</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-400">
                    Tidak ada artikel yang cocok dengan pencarianmu.
                  </td>
                </tr>
              )}
              {visibleRows.map(({ row }) => {
                const isOpened = openedJournals.includes(row.title);
                const isLocked = !isOpened && openedJournals.length >= 3;
                return (
                <tr key={row.title} className="border-t border-slate-100 transition-colors hover:bg-slate-50/50">
                  <td className="max-w-[460px] px-5 py-4">
                    <p className="font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold leading-snug text-slate-900">
                      {row.title}
                    </p>
                    <p className="mt-1 text-xs font-normal text-slate-500">
                      {row.authors} · {row.source}
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={isLocked ? () => handleOpenJournalClick(row.title) : (() => (onOpenRingkasan ? onOpenRingkasan() : (onOpenAbstrak ? onOpenAbstrak() : window.alert(`Membuka ringkasan jurnal: ${row.title}`))))}
                        className={`inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium shadow-2xs transition-all active:scale-95 ${
                          isLocked
                            ? "border-sky-300 bg-sky-50/85 text-[#00629b] hover:bg-sky-100/90"
                            : "border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                        title={isLocked ? "Terkunci - Batas 3 jurnal akun gratis tercapai" : "Ringkasan Jurnal"}
                      >
                        {isLocked && (
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#00629b]">
                            <rect x="3" y="7" width="10" height="7" rx="1.5" />
                            <path d="M5.5 7V4.5a2.5 2.5 0 0 1 5 0V7" />
                            <circle cx="8" cy="10.5" r="0.8" fill="currentColor" />
                          </svg>
                        )}
                        Ringkasan Jurnal
                      </button>
                      <button
                        type="button"
                        onClick={isLocked ? () => handleOpenJournalClick(row.title) : (() => (onOpenSitasi ? onOpenSitasi() : window.alert(`Sitasi untuk: ${row.authors} (${row.year}). ${row.title}.`)))}
                        className={`inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium shadow-2xs transition-all active:scale-95 ${
                          isLocked
                            ? "border-sky-300 bg-sky-50/85 text-[#00629b] hover:bg-sky-100/90"
                            : "border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                        title={isLocked ? "Terkunci - Batas 3 jurnal akun gratis tercapai" : "Sitasi"}
                      >
                        {isLocked && (
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#00629b]">
                            <rect x="3" y="7" width="10" height="7" rx="1.5" />
                            <path d="M5.5 7V4.5a2.5 2.5 0 0 1 5 0V7" />
                            <circle cx="8" cy="10.5" r="0.8" fill="currentColor" />
                          </svg>
                        )}
                        Sitasi
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenJournalClick(row.title)}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium shadow-2xs transition-all active:scale-95 ${
                          isLocked
                            ? "border-sky-300 bg-sky-50/85 text-[#00629b] hover:bg-sky-100/90"
                            : "border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                        title={isLocked ? "Terkunci - Batas 3 jurnal akun gratis tercapai" : "Buka jurnal"}
                      >
                        {isLocked ? (
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#00629b]">
                            <rect x="3" y="7" width="10" height="7" rx="1.5" />
                            <path d="M5.5 7V4.5a2.5 2.5 0 0 1 5 0V7" />
                            <circle cx="8" cy="10.5" r="0.8" fill="currentColor" />
                          </svg>
                        ) : (
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                            <path d="M12 9v4H3V4h4M9 2h5v5M6.5 9.5L14 2" />
                          </svg>
                        )}
                        Buka
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top text-sm font-medium text-slate-600">{row.year}</td>
                  <td className="px-5 py-4 align-top">
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        row.tag === "Sangat relevan"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          : row.tag === "Cukup relevan"
                            ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                            : "bg-amber-50 text-amber-700 border border-amber-200/60"
                      }`}
                    >
                      {row.tag === "Sangat relevan" ? "Prioritas tinggi" : (row.tag || "Prioritas tinggi")}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <span className="flex items-center gap-2">
                      <img
                        src={sourceLogos[row.source] ?? "/assets/source-logos/openalex.svg"}
                        alt=""
                        className="h-6 w-6 shrink-0 object-contain"
                      />
                      <span className="text-sm text-slate-600">{row.source}</span>
                    </span>
                  </td>
                </tr>
              ); })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards List (Sama persis dengan susunan Literatur Review) */}
        <div className="md:hidden mt-3.5 space-y-3">
          {visibleRows.slice(0, mobileJournalLimit).map(({ row }, index) => {
            const isOpened = openedJournals.includes(row.title);
            const isLocked = !isOpened && openedJournals.length >= 3;
            return (
            <article key={`${row.title}-${index}`} className="rounded-xl bg-slate-50/70 p-4 border border-slate-200/90 shadow-2xs space-y-3 hover:border-sky-300 transition-colors">
              <div>
                <h4 className="font-['Plus_Jakarta_Sans:Bold'] text-sm sm:text-[14.5px] font-bold leading-snug text-slate-900">{row.title}</h4>
                <p className="mt-1 text-xs text-slate-500 font-normal">{row.authors} · <span className="font-medium text-slate-600">{row.source}</span></p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    row.tag === "Sangat relevan" || row.tag === "Prioritas tinggi" || !row.tag
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                      : row.tag === "Cukup relevan"
                        ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                        : "bg-amber-50 text-amber-700 border border-amber-200/60"
                  }`}
                >
                  {row.tag === "Sangat relevan" ? "Prioritas tinggi" : (row.tag || "Prioritas tinggi")}
                </span>
                <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200 shadow-2xs">
                  {row.year}
                </span>
                <span className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200 shadow-2xs">
                  <img
                    src={sourceLogos[row.source] ?? "/assets/source-logos/openalex.svg"}
                    alt=""
                    className="h-3.5 w-3.5 shrink-0 object-contain"
                  />
                  <span>{row.source}</span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-200/70">
                <button
                  type="button"
                  onClick={isLocked ? () => handleOpenJournalClick(row.title) : (onOpenRingkasan ?? onOpenAbstrak ?? (() => window.alert(`Membuka ringkasan jurnal: ${row.title}`)))}
                  className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border px-1.5 py-2 text-center text-xs font-bold leading-tight shadow-2xs transition-all active:scale-95 cursor-pointer ${
                    isLocked
                      ? "border-sky-300 bg-sky-50/85 text-[#00629b] hover:bg-sky-100/90"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                  title={isLocked ? "Terkunci - Batas 3 jurnal akun gratis tercapai" : "Ringkasan Jurnal"}
                >
                  {isLocked && (
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#00629b] shrink-0">
                      <rect x="3" y="7" width="10" height="7" rx="1.5" />
                      <path d="M5.5 7V4.5a2.5 2.5 0 0 1 5 0V7" />
                      <circle cx="8" cy="10.5" r="0.8" fill="currentColor" />
                    </svg>
                  )}
                  <span>Ringkasan Jurnal</span>
                </button>
                <button
                  type="button"
                  onClick={isLocked ? () => handleOpenJournalClick(row.title) : (onOpenSitasi ?? (() => window.alert(`Sitasi untuk: ${row.authors} (${row.year}). ${row.title}.`)))}
                  className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer ${
                    isLocked
                      ? "border-sky-300 bg-sky-50/85 text-[#00629b] hover:bg-sky-100/90"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                  title={isLocked ? "Terkunci - Batas 3 jurnal akun gratis tercapai" : "Sitasi"}
                >
                  {isLocked && (
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#00629b] shrink-0">
                      <rect x="3" y="7" width="10" height="7" rx="1.5" />
                      <path d="M5.5 7V4.5a2.5 2.5 0 0 1 5 0V7" />
                      <circle cx="8" cy="10.5" r="0.8" fill="currentColor" />
                    </svg>
                  )}
                  <span>Sitasi</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenJournalClick(row.title)}
                  className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer ${
                    isLocked
                      ? "border-sky-300 bg-sky-50/85 text-[#00629b] hover:bg-sky-100/90"
                      : "border-slate-200 bg-white text-sky-700 hover:bg-sky-50"
                  }`}
                  title={isLocked ? "Terkunci - Batas 3 jurnal akun gratis tercapai" : "Buka jurnal"}
                >
                  {isLocked ? (
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#00629b]">
                      <rect x="3" y="7" width="10" height="7" rx="1.5" />
                      <path d="M5.5 7V4.5a2.5 2.5 0 0 1 5 0V7" />
                      <circle cx="8" cy="10.5" r="0.8" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-sky-600">
                      <path d="M12 9v4H3V4h4M9 2h5v5M6.5 9.5L14 2" />
                    </svg>
                  )}
                  <span>Buka</span>
                </button>
              </div>
            </article>
          ); })}
          {visibleRows.length === 0 && (
            <p className="py-6 text-center text-xs text-slate-400">Tidak ada jurnal yang cocok dengan pencarianmu.</p>
          )}

          {visibleRows.length > mobileJournalLimit && (
            <button
              type="button"
              onClick={() => setMobileJournalLimit(limit => limit + 6)}
              className="mt-3.5 flex w-full min-h-[44px] items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200/80 py-2.5 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              Muat lebih banyak ({Math.min(6, visibleRows.length - mobileJournalLimit)} lagi)
            </button>
          )}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm md:p-6">
        <div>
          <h2 className="text-lg font-semibold leading-7 text-slate-900">
            {mode === "kepadatan" ? "Analisis Peta Kepadatan" : mode === "perkembangan" ? "Analisis Peta Perkembangan" : "Analisis Peta Jaringan"}
          </h2>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            Ringkasan otomatis berdasarkan parameter peta yang sedang ditampilkan.
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {analysisRows.map((item, index) => {
            const isOpen = analysisOpen === index;
            return (
              <div
                key={item.title}
                className={`group overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? "bg-sky-50/40 border-sky-300/90 shadow-xs ring-1 ring-sky-300/30"
                    : "bg-slate-50/80 border-slate-200/80 hover:border-sky-300 hover:bg-sky-50/50 hover:shadow-xs"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setAnalysisOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors cursor-pointer"
                >
                  <span
                    className={`hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 ${
                      isOpen
                        ? "bg-sky-600 text-white shadow-xs"
                        : "bg-white text-sky-700 border border-slate-200 group-hover:border-sky-300 group-hover:bg-sky-100/70 group-hover:text-sky-800"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold leading-6 text-slate-900 group-hover:text-sky-950 transition-colors">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-sm leading-5 text-slate-500 group-hover:text-slate-600 transition-colors">
                      {item.subtitle}
                    </span>
                  </span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                      isOpen
                        ? "bg-sky-100 text-sky-800"
                        : "text-[#0369a1] group-hover:bg-sky-100/70 group-hover:text-sky-800 group-hover:translate-x-0.5"
                    }`}
                  >
                    <svg
                      width="9"
                      height="14"
                      viewBox="0 0 9 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                    >
                      <path d="M1.5 1.5L7 7l-5.5 5.5" />
                    </svg>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-slate-200/70 px-5 py-5">
                    <div className="space-y-3">
                      {item.paragraphs.map(paragraph => (
                        <p key={paragraph} className="text-sm leading-7 text-slate-600">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    {mode === "perkembangan" && index === 0 && (
                      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <div className="grid grid-cols-2 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">
                          <span>Topik</span>
                          <span className="text-right">Rata-rata tahun</span>
                        </div>
                        {perkembanganYears.map(([topic, year]) => (
                          <div key={topic} className="grid grid-cols-2 border-t border-slate-100 px-4 py-2 text-sm text-slate-700">
                            <span>{topic}</span>
                            <span className="text-right font-semibold text-slate-800">{year}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className={`rounded-2xl bg-white p-4 shadow-sm transition-all duration-200 md:p-6 border ${integratedOpen ? "border-sky-300/80 shadow-xs ring-1 ring-sky-300/20" : "border-slate-200/70"}`}>
        <button
          type="button"
          onClick={() => setIntegratedOpen(value => !value)}
          aria-expanded={integratedOpen}
          className="group -m-2 flex w-[calc(100%+16px)] items-center justify-between gap-4 rounded-xl p-3 text-left transition-all duration-200 hover:bg-sky-50/70 cursor-pointer"
        >
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-semibold leading-7 text-slate-900 group-hover:text-sky-950 transition-colors">
                Analisis Peta Penelitian
              </span>
            </span>
            <span className="mt-1 block text-sm leading-5 text-slate-500 group-hover:text-slate-600 transition-colors">
              Gabungan temuan Peta Jaringan, Kepadatan, dan Perkembangan.
            </span>
          </span>
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
              integratedOpen
                ? "bg-sky-600 text-white shadow-xs"
                : "bg-sky-50 text-sky-700 border border-sky-100 group-hover:bg-sky-100 group-hover:border-sky-300 group-hover:text-sky-800"
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={`transition-transform duration-200 ${integratedOpen ? "rotate-90" : ""}`}
            >
              <path d="M5 2.5L9.5 7 5 11.5" />
            </svg>
          </div>
        </button>

        {integratedOpen && (
          <div className="mt-5 space-y-6 border-t border-slate-100 pt-5">
            <div className="flex items-start gap-2.5">
              <span className="shrink-0 text-base font-bold leading-6 text-slate-900 select-none">
                1.
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold leading-6 text-slate-900">Analisis Keterkaitan Antar Topik Penelitian</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Peta Jaringan menunjukkan bahwa AI Literacy memiliki keterhubungan dengan berbagai topik pembelajaran, termasuk Learning Motivation, Critical Thinking, dan Student Engagement.
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Hal ini menunjukkan adanya keterkaitan tematik dalam artikel yang dianalisis, tetapi belum membuktikan hubungan sebab-akibat di antara variabel tersebut.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="shrink-0 text-base font-bold leading-6 text-slate-900 select-none">
                2.
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold leading-6 text-slate-900">Analisis Konsentrasi Penelitian</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Peta Kepadatan menunjukkan bahwa AI Literacy dan Learning Motivation berada pada area dengan konsentrasi relatif tinggi.
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Kondisi ini mengindikasikan bahwa kedua topik memiliki posisi menonjol dalam kumpulan literatur, sedangkan beberapa topik lain berada pada area dengan konsentrasi lebih rendah.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="shrink-0 text-base font-bold leading-6 text-slate-900 select-none">
                3.
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold leading-6 text-slate-900">Analisis Perkembangan Publikasi Ilmiah</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Peta Perkembangan menunjukkan bahwa Generative AI memiliki rata-rata tahun publikasi yang lebih baru dibandingkan Learning Motivation dan beberapa topik pembelajaran lainnya.
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Perbedaan ini dapat menjadi petunjuk untuk menelusuri pembahasan AI yang lebih baru dalam konteks pendidikan, meskipun belum cukup untuk menyimpulkan adanya peningkatan tren penelitian.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="shrink-0 text-base font-bold leading-6 text-slate-900 select-none">
                4.
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold leading-6 text-slate-900">Identifikasi Potensi Arah Penelitian</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Berdasarkan gabungan ketiga peta, beberapa hubungan yang layak ditelusuri lebih lanjut dalam contoh simulasi adalah:
                </p>
                <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
                    AI Literacy dan Learning Motivation.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
                    Generative AI dan Self-Regulated Learning.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
                    AI Literacy dan Critical Thinking.
                  </li>
                </ul>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Ketiga hubungan tersebut merupakan arah eksplorasi, bukan research gap yang telah tervalidasi. Pemeriksaan artikel pendukung diperlukan untuk mengetahui temuan, metode, keterbatasan, dan pertanyaan yang belum terjawab.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="shrink-0 text-base font-bold leading-6 text-slate-900 select-none">
                5.
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold leading-6 text-slate-900">Sintesis Temuan dan Implikasi Penelitian</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Berdasarkan simulasi 100 artikel ilmiah, AI Literacy dan Learning Motivation memiliki keterkaitan yang menonjol dalam jaringan penelitian serta berada pada area dengan konsentrasi relatif tinggi.
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Sementara itu, Generative AI memiliki rata-rata tahun publikasi yang relatif lebih baru, sehingga dapat menjadi salah satu topik untuk ditelusuri dalam kaitannya dengan motivasi dan proses pembelajaran mahasiswa.
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Secara keseluruhan, ketiga peta memberikan gambaran mengenai hubungan, konsentrasi, dan perbedaan waktu publikasi. Hasil ini dapat membantu menentukan fokus penelusuran literatur berikutnya, tetapi belum cukup untuk memastikan kebaruan penelitian atau menetapkan research gap.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Requirement 3 & 5: Mobile Responsive Bottom Sheet for Node Detail */}
      {selectedNodeData && (
        <div className="fixed inset-x-0 bottom-0 z-[420] md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-[2px] transition-opacity"
            onClick={() => setSelectedNodeForDetail(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-label={`Detail topik ${selectedNodeData.name}`}
            className="relative max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-slate-200 bg-white px-5 pb-6 pt-3 shadow-[0_-16px_36px_rgba(15,23,42,0.2)] animate-in slide-in-from-bottom-4 duration-200"
          >
            {/* Grab handle */}
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="h-3 w-3 shrink-0 rounded-full shadow-2xs" style={{ background: mapClusters[selectedNodeData.cluster].color }} />
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  {mapNodeDetails[selectedNodeData.name]?.clusterName ?? mapClusters[selectedNodeData.cluster].label}
                </span>
                <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700">
                  Thn {selectedNodeData.year.toFixed(1)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNodeForDetail(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 active:scale-95 cursor-pointer"
                aria-label="Tutup detail node"
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M2.5 2.5l9 9M11.5 2.5l-9 9" />
                </svg>
              </button>
            </div>

            <h3 className="mt-2.5 text-[15px] sm:text-[16px] font-semibold leading-snug text-slate-900">
              {selectedNodeData.name}
            </h3>

            <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
              <span className="rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                <strong className="font-bold">{mapNodeDetails[selectedNodeData.name]?.count ?? 20}</strong> artikel
              </span>
              <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <strong className="font-bold">{mapNodeDetails[selectedNodeData.name]?.relations ?? 5}</strong> relasi topik
              </span>
            </div>

            <p className="mt-3 text-[13px] leading-[1.4] text-slate-600">
              {mapNodeDetails[selectedNodeData.name]?.desc ?? "Topik sentral yang banyak dibahas dalam publikasi ilmiah terkini."}
            </p>

            {/* Expandable related articles */}
            <div className="mt-4 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowNodeArticles(v => !v)}
                className="flex w-full items-center justify-between py-1 text-xs font-bold text-slate-700 hover:text-sky-700 cursor-pointer"
              >
                <span>Artikel Terkait Topik Ini ({nodeRelatedPapers.length})</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className={`transition-transform duration-200 ${showNodeArticles ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </button>

              {showNodeArticles && (
                <div className="mt-2.5 max-h-44 space-y-2 overflow-y-auto pr-1">
                  {nodeRelatedPapers.length === 0 ? (
                    <p className="text-xs text-slate-400">Tidak ada artikel spesifik untuk node ini.</p>
                  ) : (
                    nodeRelatedPapers.slice(0, 4).map((paper, i) => (
                      <div key={i} className="rounded-xl border border-slate-200/80 bg-slate-50 p-2.5 text-left">
                        <p className="text-xs font-semibold leading-tight text-slate-800">{paper.row.title}</p>
                        <p className="mt-1 text-[11px] text-slate-500">{paper.row.authors} · {paper.row.year}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  toggleNode(selectedNodeData.name);
                  setSelectedNodeForDetail(null);
                }}
                className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-sky-700 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors hover:bg-sky-800 active:scale-95 cursor-pointer"
              >
                {nodeFilter === selectedNodeData.name ? "Hapus Saringan Topik" : "Saring Publikasi Topik Ini"}
              </button>
            </div>
          </div>
        </div>
      )}

      <UpgradeLockedConfirmModal
        open={localUpgradeConfirmOpen}
        onClose={() => setLocalUpgradeConfirmOpen(false)}
        onConfirm={() => {
          setLocalUpgradeConfirmOpen(false);
          onUpgrade?.();
        }}
      />
    </div>
  );
}

function MobileJournalResultCard({
  result,
  index,
  saved,
  onToggleSave,
  onAnalisis,
  onSitasi,
  onAbstrak,
  onDiskusikan,
  onReplaceJournal,
}: {
  result: (typeof mobileResultJournals)[number] & { isReplaced?: boolean };
  index: number;
  saved: boolean;
  onToggleSave: () => void;
  onAnalisis: () => void;
  onSitasi: () => void;
  onAbstrak: () => void;
  onDiskusikan?: (template: string) => void;
  onReplaceJournal?: (journalId: string, reasons: string[]) => Promise<void> | void;
}) {
  const isReplaced = Boolean(result.isReplaced);
  const cleanRank = (result.rank || "").replace(/#\s*/g, "");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReasonText, setOtherReasonText] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleOtherReasonChange = (raw: string) => {
    let val = raw;
    if (val.length > 150) {
      val = val.slice(0, 150);
    }
    setOtherReasonText(capitalizeFirstLetter(val));
  };

  const isSubmitEnabled =
    selectedReasons.length > 0 &&
    (!selectedReasons.includes("lainnya") || otherReasonText.trim().length >= 3);

  const toggleReason = (id: string) => {
    setSelectedReasons(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleProcessReplacement = async () => {
    if (!isSubmitEnabled || isRefreshing) return;
    setIsFeedbackOpen(false);
    setIsRefreshing(true);
    try {
      const payloadReasons = selectedReasons.includes("lainnya") && otherReasonText.trim()
        ? [...selectedReasons.filter(r => r !== "lainnya"), `Lainnya: ${otherReasonText.trim()}`]
        : selectedReasons;

      if (onReplaceJournal) {
        await onReplaceJournal(result.id, payloadReasons);
      }
      setSelectedReasons([]);
      setOtherReasonText("");
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isRefreshing) {
    return (
      <article className="rounded-2xl bg-white p-5 shadow-sm outline outline-1 outline-sky-200">
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-16 animate-pulse rounded bg-sky-100" />
        </div>
        <div className="mt-3.5 h-6 w-5/6 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-slate-100" />
        <div className="mt-1.5 h-3.5 w-1/3 animate-pulse rounded bg-slate-100" />
        <div className="mt-5 flex items-center justify-center gap-2.5 rounded-xl bg-sky-50 py-4 text-xs font-semibold text-sky-700">
          <svg className="h-4 w-4 animate-spin text-sky-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Sedang mencari rekomendasi pengganti untuk {cleanRank}...</span>
        </div>
      </article>
    );
  }

  return (
    <article className={`rounded-2xl bg-white p-4 shadow-sm outline transition-all ${
      isReplaced ? "outline-2 outline-[#00629b]/40 shadow-xs" : "outline-1 outline-slate-100"
    }`}>
      <div className="flex items-center justify-between gap-1.5 text-[10px] font-semibold">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-sky-700 px-2 py-1 text-xs font-bold text-white">{cleanRank}</span>
          <span className="rounded-md bg-slate-200 px-2 py-1 text-slate-700">{result.year}</span>
          <span className="rounded-md bg-sky-100 px-2 py-1 text-sky-700">Akses Terbuka</span>
        </div>
        {isReplaced && (
          <button
            type="button"
            onClick={() => setIsFeedbackOpen(true)}
            className="inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-1 text-[10.5px] font-bold text-[#00629b] border border-sky-200 hover:bg-sky-200 active:scale-95 transition-all cursor-pointer shadow-2xs"
            title="Klik jika belum sesuai untuk memperbarui kembali"
          >
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.5 8a5.5 5.5 0 0 1 9.39-3.89L13.5 5.5M13.5 2v3.5H10" />
              <path d="M13.5 8a5.5 5.5 0 0 1-9.39 3.89L2.5 10.5M2.5 14v-3.5H6" />
            </svg>
            <span>Telah Diperbarui</span>
          </button>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-[18px] sm:text-[20px] font-bold leading-[1.35] text-slate-900">{result.title}</h2>
          <p className="mt-1.5 text-xs font-medium leading-5 text-slate-600">{result.authors}</p>
          <p className="text-xs font-normal leading-5 text-slate-500">
            {result.journal || (result.citation?.includes("•") ? result.citation.split("•")[1]?.trim() : "") || "Jurnal Kajian Pemasaran Digital"}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-center">
          <RelevancyRing value={result.relevancy || `${result.score}%`} />
          <span className="pt-1 text-xs font-semibold leading-4 text-slate-500">Relevansi</span>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-100 p-4">
        <p className="text-[13px] font-bold uppercase tracking-wide text-slate-900">Mengapa jurnal ini direkomendasikan?</p>
        {[
          [["Kesesuaian variabel", 98], ["Kesesuaian topik", 96], ["Kesesuaian konteks", 94], ["Kesesuaian metode", 91], ["Kesesuaian teori", 89], ["Kesesuaian periode", 93]],
          [["Kesesuaian variabel", 94], ["Kesesuaian topik", 92], ["Kesesuaian konteks", 90], ["Kesesuaian metode", 88], ["Kesesuaian teori", 86], ["Kesesuaian periode", 91]],
          [["Kesesuaian variabel", 88], ["Kesesuaian topik", 90], ["Kesesuaian konteks", 95], ["Kesesuaian metode", 84], ["Kesesuaian teori", 87], ["Kesesuaian periode", 96]],
        ][index % 3].map(([label, value]) => (
          <div key={String(label)} className="mt-2.5">
            <div className="flex justify-between text-sm"><span className="text-slate-700">{label}</span><strong className="text-sky-700">{value}%</strong></div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-200"><div className="h-full rounded-full bg-sky-700" style={{ width: `${value}%` }} /></div>
          </div>
        ))}
        <div className="mt-3 rounded-xl bg-[#f1f5f9] p-4 outline outline-1 outline-slate-200">
          <p className="text-sm leading-6">
            <span className="font-semibold text-slate-700">Kutipan relevan:</span>
            <span className="font-semibold text-slate-900"> &ldquo;{[
              "Parasocial interaction strengthens purchase intention when viewers perceive urgency and scarcity.",
              "Parasocial interaction and scarcity cues significantly increase buying intention in livestreaming sessions.",
              "Kepercayaan konsumen memediasi pengaruh ulasan daring terhadap minat beli di ekosistem live commerce.",
            ][index % 3]}&rdquo;</span>
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4 outline outline-1 outline-slate-200 shadow-2xs">
        <p className="text-[13px] font-bold uppercase tracking-wide text-slate-900">Kredibilitas</p>
        {[
          ["Sumber", "OpenAlex dan Crossref"],
          ["Penerbit", "Pusat Studi Bisnis Digital Nusantara"],
          ["DOI terverifikasi", "https://doi.org/10.21776/ub.jpt.2026.011.2"],
          ["Jumlah sitasi", "Artikel ini dikutip dalam 45 karya ilmiah lainnya."],
        ].map(([judul, detail]) => (
          <div key={judul} className="mt-3 flex items-start gap-2.5">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#00629b] text-white shadow-2xs">
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2.5 6.2l2.3 2.3 4.7-5" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-slate-900">{judul}</span>
              {judul === "DOI terverifikasi" ? (
                <a
                  href="https://doi.org/10.20886/jpkf.2022.6.1.16-28"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block break-all text-[12.5px] sm:text-[13px] leading-5 text-[#00629b] font-medium underline underline-offset-2 decoration-slate-400 transition-colors duration-150 hover:text-black hover:decoration-black"
                >
                  {detail}
                </a>
              ) : (
                <span className="block text-[12.5px] sm:text-[13px] leading-5 text-slate-800">{detail}</span>
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-sky-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-sky-700 md:text-sm">Ringkasan utama</p>
        <p className="mt-1.5 font-['Inter:Regular'] font-normal text-[13px] sm:text-[14px] leading-[1.5] text-slate-800 md:text-sm md:leading-5">{result.summary}</p>
      </div>

      {/* Grid Tombol Aksi Mobile (6 Tombol + 1 Full Width Diskusikan) */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={onAnalisis}
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-sky-700 px-3 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-colors hover:bg-sky-800 active:scale-95"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
            <path d="M7 1.5l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.7l-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" />
          </svg>
          Analisis
        </button>

        <button
          type="button"
          onClick={onToggleSave}
          className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold transition-colors active:scale-95 ${
            saved ? "bg-sky-100 font-semibold text-sky-700 outline outline-1 outline-sky-300" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
            <path d="M3.5 1.5h7v11L7 9.5l-3.5 3z" />
          </svg>
          {saved ? "Tersimpan" : "Simpan"}
        </button>

        <button
          type="button"
          onClick={onSitasi}
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-200 active:scale-95"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
            <path d="M2 2.5h10v7H6l-3 2.5V9.5H2z" />
          </svg>
          Sitasi
        </button>

        <button
          type="button"
          onClick={onAbstrak ?? onAnalisis}
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-200 active:scale-95"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
            <path d="M3 1.5h6l3 3v9H3zM6 7h4M6 10h4" />
          </svg>
          Abstrak
        </button>

        <button
          type="button"
          onClick={() => window.open("https://doi.org/10.20886/jpkf.2022.6.1.16-28", "_blank", "noopener,noreferrer")}
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-200 active:scale-95"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
            <path d="M3 1.5h6l3 3v9H3zM8.5 1.5v3h3" />
          </svg>
          Buka PDF
        </button>

        <button
          type="button"
          onClick={() => setIsFeedbackOpen(v => !v)}
          className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
            isFeedbackOpen
              ? "bg-sky-100 text-sky-950 outline outline-1 outline-sky-300 ring-2 ring-sky-400/20"
              : isReplaced
                ? "bg-sky-50 text-[#00629b] outline outline-1 outline-sky-200 hover:bg-sky-100"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200"
          }`}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 8a5.5 5.5 0 0 1 9.39-3.89L13.5 5.5M13.5 2v3.5H10" />
            <path d="M13.5 8a5.5 5.5 0 0 1-9.39 3.89L2.5 10.5M2.5 14v-3.5H6" />
          </svg>
          {isReplaced ? "Perbarui Lagi" : "Belum Sesuai"}
        </button>

        <button
          type="button"
          onClick={() => {
            const template = `Halo Alerin, saya ingin mendiskusikan artikel jurnal ini untuk bahan penelitian saya:

Judul: "${result.title}"
Penulis: ${result.authors} (${result.year})
DOI: https://doi.org/10.21776/ub.jpt.2026.011.2

Ringkasan:
${result.summary}

Mohon bantu saya untuk:
1. Menjelaskan poin-poin penting, metodologi, dan temuan kunci dari jurnal ini.
2. Memberikan saran bagaimana jurnal ini dapat saya gunakan untuk memperkuat tinjauan pustaka atau bab pembahasan saya.
3. Mengidentifikasi research gap atau ide pengembangan yang relevan.`;
            onDiskusikan?.(template);
          }}
          className="col-span-2 sm:col-span-3 flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200 transition-colors hover:bg-slate-50 hover:text-slate-900 active:scale-[0.99]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 13.5V4a1.5 1.5 0 0 1 1.5-1.5h8A1.5 1.5 0 0 1 13.5 4v6a1.5 1.5 0 0 1-1.5 1.5H5.5L2.5 13.5z" />
            <path d="M5.5 6.5h5M5.5 9h3" />
          </svg>
          Diskusikan dengan Alerin
        </button>
      </div>

      {/* Accordion Form Feedback Alasan (Paritas Fitur Desktop) */}
      {isFeedbackOpen && (
        <div className="mt-3.5 rounded-xl border border-slate-300 bg-slate-50/90 p-3.5 sm:p-4 transition-all">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-['Plus_Jakarta_Sans:Bold'] text-xs sm:text-sm font-bold text-slate-800">
                {isReplaced ? "Mengapa rekomendasi baru ini masih belum sesuai?" : "Mengapa jurnal ini belum sesuai?"}
              </h4>
              <p className="mt-0.5 text-xs leading-5 text-slate-500">
                {isReplaced
                  ? "Pilih kendala yang masih ada agar Alerin dapat mencarikan alternatif jurnal lain:"
                  : "Pilih minimal satu alasan agar Alerin dapat menggantinya dengan rekomendasi yang lebih sesuai kebutuhanmu."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsFeedbackOpen(false);
                setSelectedReasons([]);
                setOtherReasonText("");
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              aria-label="Batal dan tutup"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {JOURNAL_FEEDBACK_REASONS.map(reason => {
              const isChecked = selectedReasons.includes(reason.id);
              return (
                <button
                  key={reason.id}
                  type="button"
                  onClick={() => toggleReason(reason.id)}
                  className={`flex min-h-[44px] items-center gap-2.5 rounded-xl border-[1.5px] px-3 py-2 text-left text-xs sm:text-sm transition-all ${
                    isChecked
                      ? "border-sky-600 bg-sky-50 font-bold text-sky-950"
                      : "border-slate-300 bg-white font-medium text-slate-700 hover:border-slate-400"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-[1.5px] ${
                      isChecked ? "border-sky-600 bg-sky-600 text-white" : "border-slate-400/80 bg-white"
                    }`}
                  >
                    {isChecked && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1.5 4l2.5 2.5 4.5-5" />
                      </svg>
                    )}
                  </span>
                  <span className="truncate">{reason.label}</span>
                </button>
              );
            })}
          </div>

          {selectedReasons.includes("lainnya") && (
            <div className="mt-3">
              <textarea
                rows={3}
                maxLength={150}
                value={otherReasonText}
                onChange={e => handleOtherReasonChange(e.target.value)}
                placeholder="Tuliskan kendala spesifik jurnal ini..."
                className="w-full min-h-[76px] resize-none rounded-xl border-[1.5px] border-slate-300 bg-white p-3 text-xs sm:text-sm text-slate-800 outline-none hover:border-slate-400 focus:border-sky-500 placeholder:text-slate-400"
              />
              <div className="mt-1 flex items-center justify-between px-1 text-[11px] text-slate-400">
                <span>
                  {otherReasonText.trim().length > 0 && otherReasonText.trim().length < 3 ? (
                    <span className="font-medium text-amber-600">Minimal 3 karakter</span>
                  ) : null}
                </span>
                <span>
                  {otherReasonText.length}/
                  <span className={otherReasonText.length >= 150 ? "font-semibold text-rose-500" : ""}>
                    150
                  </span>
                </span>
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center justify-end">
            <button
              type="button"
              disabled={!isSubmitEnabled || isRefreshing}
              onClick={handleProcessReplacement}
              className={`flex min-h-[44px] items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                isSubmitEnabled && !isRefreshing
                  ? "bg-sky-700 text-white hover:bg-sky-800 active:scale-95 cursor-pointer"
                  : "cursor-not-allowed bg-slate-200 text-slate-400"
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 8a5.5 5.5 0 0 1 9.39-3.89L13.5 5.5M13.5 2v3.5H10" />
                <path d="M13.5 8a5.5 5.5 0 0 1-9.39 3.89L2.5 10.5M2.5 14v-3.5H6" />
              </svg>
              {isReplaced ? "Perbarui Jurnal Lagi" : "Cari Jurnal Pengganti"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function MobileJournalCollectionCard({
  journal,
  folders,
  onMove,
  onRemove,
  onSitasi,
  onAbstrak,
  onDetail,
  onDiskusikan,
}: {
  journal: SavedJournal;
  folders: CollectionFolder[];
  onMove: (folderId: string) => void;
  onRemove: () => void;
  onSitasi: () => void;
  onAbstrak: () => void;
  onDetail: () => void;
  onDiskusikan?: (template: string) => void;
}) {
  const activeFolder = folders.find(folder => folder.id === journal.folderId);
  const [note, setNote] = useState(() => {
    try {
      return window.localStorage.getItem(`alerin-journal-note-${journal.id}`) ?? "";
    } catch {
      return "";
    }
  });
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = capitalizeFirstLetter(e.target.value);
    setNote(val);
    try {
      window.localStorage.setItem(`alerin-journal-note-${journal.id}`, val);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2000);
    } catch {
      /* ignore storage errors */
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-3.5 sm:p-5">
      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {journal.year}
        </span>
        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-[#00629b]">
          Akses Terbuka
        </span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-[#00629b]">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 1.5l2 4 4.5.6-3.3 3.2.8 4.4L8 11.5l-4 2.2.8-4.4L1.5 6.1l4.5-.6z" />
          </svg>
          {journal.relevancy} relevan
        </span>
      </div>

      {/* Judul & Penulis */}
      <div>
        <h3 className="font-['Plus_Jakarta_Sans:Bold'] text-base font-bold leading-snug text-[#0f172a] sm:text-lg">
          {journal.title}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-[#64748b] sm:text-sm">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-slate-400">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2.5 14a5.5 5.5 0 0 1 11 0" />
          </svg>
          <span className="truncate">{journal.authors}</span>
        </p>
      </div>

      {/* Deskripsi */}
      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm leading-relaxed text-slate-600">
        {journal.description}
      </div>

      {/* Alasan Direkomendasikan */}
      <div className="rounded-xl border border-sky-100/80 bg-[#eaf6ff] p-3 text-sm leading-relaxed text-slate-700">
        <strong className="font-['Inter:Bold'] text-[#00629b]">Alasan direkomendasikan:</strong>{" "}
        {journal.id === "saved-2"
          ? "Cocok sebagai pembanding temuan dan rujukan metode meta-analisis."
          : "Cocok untuk memperkuat landasan teori dan hubungan antarvariabel."}
      </div>

      {/* Catatan Pribadi (Paritas Desktop + Persistent LocalStorage + Anti iOS Zoom 14px) */}
      <label className="block rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 transition-colors focus-within:border-sky-300 focus-within:bg-white">
        <div className="flex items-center justify-between">
          <span className="font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold text-[#1e293b]">
            Catatan Pribadi
          </span>
          {isSavedNotice ? (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8.5l3.5 3.5 6.5-7" />
              </svg>
              Tersimpan
            </span>
          ) : (
            <span className="text-xs font-normal text-slate-400">
              Menyimpan Otomatis
            </span>
          )}
        </div>
        <textarea
          value={note}
          onChange={handleNoteChange}
          placeholder="Kamu bisa menuliskan catatan pribadi di sini..."
          aria-label={`Catatan pribadi ${journal.title}`}
          className="mt-2 block min-h-[72px] w-full resize-none bg-transparent text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400"
        />
      </label>

      {/* Grid Tombol Aksi (Detail, Sitasi, Abstrak, DOI, Buka PDF & Hapus bersanding, Diskusikan) */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          type="button"
          onClick={onDetail}
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 active:scale-[0.98]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" />
            <circle cx="8" cy="8" r="2" />
          </svg>
          Lihat detail
        </button>

        <button
          type="button"
          onClick={onSitasi}
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 active:scale-[0.98]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 7.5h2.2a1.3 1.3 0 0 0 1.3-1.3V4.8a1.3 1.3 0 0 0-1.3-1.3H3.2a1.3 1.3 0 0 0-1.3 1.3V6c0 2 1 3.4 2.8 4.2" />
            <path d="M9.5 7.5h2.2a1.3 1.3 0 0 0 1.3-1.3V4.8a1.3 1.3 0 0 0-1.3-1.3H9.7a1.3 1.3 0 0 0-1.3 1.3V6c0 2 1 3.4 2.8 4.2" />
          </svg>
          Buat sitasi
        </button>

        <button
          type="button"
          onClick={() => window.open("https://doi.org/10.1016/j.jretconser.2020.102345", "_blank", "noopener,noreferrer")}
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 active:scale-[0.98]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 2h4v4M6.5 9.5L14 2" />
            <path d="M12 9v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4" />
          </svg>
          Buka DOI
        </button>

        {/* Buka PDF bersanding dengan Hapus */}
        <button
          type="button"
          onClick={() => window.alert("PDF dibuka.")}
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 active:scale-[0.98]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
            <path d="M3 1.5h6l3 3v9H3zM8.5 1.5v3h3" />
          </svg>
          Buka PDF
        </button>

        <button
          type="button"
          onClick={onRemove}
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold text-rose-600 shadow-xs transition-colors hover:bg-rose-50 active:scale-[0.98]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
          </svg>
          Hapus
        </button>

        <button
          type="button"
          onClick={onAbstrak}
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 active:scale-[0.98]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
            <path d="M3 1.5h6l3 3v9H3zM6 7h4M6 10h4" />
          </svg>
          Abstrak
        </button>

        <button
          type="button"
          onClick={() => {
            const template = `Halo Alerin, saya ingin mendiskusikan artikel jurnal dari koleksi saya ini:

Judul: "${journal.title}"
Penulis: ${journal.authors} (${journal.year})
DOI: https://doi.org/10.1016/j.jretconser.2020.102345

Ringkasan:
${journal.description}

Mohon bantu saya untuk:
1. Menjelaskan poin-poin penting, metodologi, dan temuan kunci dari jurnal ini.
2. Memberikan saran bagaimana jurnal ini dapat saya gunakan untuk memperkuat tinjauan pustaka atau bab pembahasan saya.
3. Mengidentifikasi research gap atau ide pengembangan yang relevan.`;
            onDiskusikan?.(template);
          }}
          className="col-span-2 flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 outline outline-1 outline-offset-[-1px] outline-slate-200 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 active:scale-[0.99]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 13.5V4a1.5 1.5 0 0 1 1.5-1.5h8A1.5 1.5 0 0 1 13.5 4v6a1.5 1.5 0 0 1-1.5 1.5H5.5L2.5 13.5z" />
            <path d="M5.5 6.5h5M5.5 9h3" />
          </svg>
          Diskusikan dengan Alerin
        </button>
      </div>

      {/* Pindah Folder (Teks bersih & tajam, tidak ada tumpukan font) */}
      <div className="border-t border-slate-100 pt-3">
        <div className="relative w-full">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center text-[#00629b]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
            </svg>
          </span>
          <select
            aria-label="Pilih folder jurnal"
            value={journal.folderId}
            onChange={event => onMove(event.target.value)}
            className="min-h-[44px] w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-9 text-xs sm:text-sm font-semibold text-slate-700 outline-none transition-colors hover:bg-slate-100/70 focus:border-sky-400 focus:bg-white"
          >
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 1l4 4 4-4" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}

function DesktopLiteratureCollectionCard({
  item,
  folders,
  onOpen,
  onRemove,
  onMove,
}: {
  item: SavedLiterature;
  folders: CollectionFolder[];
  onOpen: () => void;
  onRemove: () => void;
  onMove: (folderId: string) => void;
}) {
  const [activeDocSection, setActiveDocSection] = useState(1);
  const currentSec =
    literatureDocSections.find(s => s.section === activeDocSection) ?? literatureDocSections[0];

  const chipsScrollRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbRatio, setThumbRatio] = useState(0.35);

  const updateScrollProgress = useCallback(() => {
    if (chipsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = chipsScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
      const ratio = scrollWidth > 0 ? clientWidth / scrollWidth : 0.35;
      setThumbRatio(Math.max(0.18, Math.min(0.85, ratio)));
    }
  }, []);

  useEffect(() => {
    updateScrollProgress();
    const handleResize = () => updateScrollProgress();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateScrollProgress]);

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const initialScroll = chipsScrollRef.current ? chipsScrollRef.current.scrollLeft : 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!chipsScrollRef.current || !trackRef.current) return;
      const trackWidth = trackRef.current.clientWidth;
      const { scrollWidth, clientWidth } = chipsScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const thumbWidthPx = trackWidth * thumbRatio;
      const maxTravel = trackWidth - thumbWidthPx;
      if (maxTravel <= 0 || maxScroll <= 0) return;

      const deltaX = moveEvent.clientX - startX;
      const newScroll = initialScroll + (deltaX / maxTravel) * maxScroll;
      chipsScrollRef.current.scrollLeft = Math.max(0, Math.min(maxScroll, newScroll));
      updateScrollProgress();
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleThumbTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    const startX = touch.clientX;
    const initialScroll = chipsScrollRef.current ? chipsScrollRef.current.scrollLeft : 0;

    const onTouchMove = (moveEvent: TouchEvent) => {
      if (!chipsScrollRef.current || !trackRef.current) return;
      const moveTouch = moveEvent.touches[0];
      const trackWidth = trackRef.current.clientWidth;
      const { scrollWidth, clientWidth } = chipsScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const thumbWidthPx = trackWidth * thumbRatio;
      const maxTravel = trackWidth - thumbWidthPx;
      if (maxTravel <= 0 || maxScroll <= 0) return;

      const deltaX = moveTouch.clientX - startX;
      const newScroll = initialScroll + (deltaX / maxTravel) * maxScroll;
      chipsScrollRef.current.scrollLeft = Math.max(0, Math.min(maxScroll, newScroll));
      updateScrollProgress();
    };

    const onTouchEnd = () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };

    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || !chipsScrollRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const trackWidth = rect.width;
    const thumbWidthPx = trackWidth * thumbRatio;
    const centerClickProgress = (clickX - thumbWidthPx / 2) / (trackWidth - thumbWidthPx);
    const clampedProgress = Math.min(1, Math.max(0, centerClickProgress));
    const { scrollWidth, clientWidth } = chipsScrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    chipsScrollRef.current.scrollTo({ left: clampedProgress * maxScroll, behavior: "smooth" });
  };

  return (
    <section className="rounded-[24px] border border-slate-200/90 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="rounded-2xl border border-sky-100/80 bg-gradient-to-br from-sky-50 via-blue-50/50 to-indigo-50/40 px-4 py-3.5">
        <p className="font-['Plus_Jakarta_Sans:SemiBold'] text-xs font-semibold text-slate-400">Topik yang dianalisis</p>
        <p className="mt-1 font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold leading-5 text-[#075985]">{item.topic}</p>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4">
        {[
          ["Total hasil ditemukan", "126", "text-[#00629b]"],
          ["Duplikasi dihapus", "34", "text-red-700"],
          ["Artikel tersisa untuk sintesis", "92", "text-[#00629b]"],
          ["Artikel prioritas tinggi", "24", "text-[#00629b]"],
        ].map(([label, value, tone]) => (
          <div key={label} className="rounded-2xl border border-slate-200/80 px-4 py-3.5">
            <p className="min-h-8 font-['Plus_Jakarta_Sans:Medium'] text-xs font-medium leading-4 text-slate-400">{label}</p>
            <p className="flex items-baseline gap-1.5">
              <span className={`font-['Plus_Jakarta_Sans:ExtraBold'] text-2xl font-extrabold ${tone}`}>{value}</span>
              <span className={`text-xs ${label === "Duplikasi dihapus" ? "text-red-700/80" : "text-slate-500"}`}>artikel</span>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,7fr)_minmax(250px,5fr)] gap-4">
        <div className="min-w-0 rounded-2xl border border-slate-200/80 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-[#0369a1]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="12" height="12" rx="2" />
                <path d="M2 6h12M6 2v12" />
              </svg>
            </span>
            <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-base font-bold text-slate-900">Matriks Literatur</h2>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">Analisis perbandingan penelitian untuk membantu penyusunan literature review</p>
          <div className="relative mt-3">
            <div
              className="max-h-[330px] overflow-auto [scrollbar-color:transparent_transparent] [scrollbar-width:thin] [&.is-scrolling]:[scrollbar-color:#3b82f6_transparent] [&.is-scrolling::-webkit-scrollbar-thumb]:bg-blue-500 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent"
              onScroll={event => {
                const scroller = event.currentTarget;
                scroller.classList.add("is-scrolling");
                window.clearTimeout(Number(scroller.dataset.scrollbarTimeout));
                scroller.dataset.scrollbarTimeout = String(window.setTimeout(() => {
                  scroller.classList.remove("is-scrolling");
                }, 700));
              }}
            >
              <table className="w-full min-w-[560px] table-fixed text-left text-xs">
                <thead className="border-b border-slate-200 text-slate-400">
                  <tr>
                    {["Judul & Penulis", "Fokus", "Teori", "Metode", "Temuan Utama", "Kontribusi"].map(label => (
                      <th key={label} className="px-2 py-2 font-semibold">{label} ⇅</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrixRows.slice(0, 3).map((row, index) => (
                    <tr key={`${row.title || row.name}-${index}`} className="border-b border-slate-100 align-top last:border-0">
                      <td className="px-2 py-3">
                        <span className="font-bold text-slate-900 block">{row.title || row.name}</span>
                        <span className="mt-0.5 block text-[11px] leading-4 text-slate-500">{row.authors || row.journal}</span>
                      </td>
                      {row.cells.map(cell => (
                        <td key={cell} className="px-2 py-3 leading-4 text-slate-600">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-slate-200/80 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-[#0369a1]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2.5 3.5h4.2c.7 0 1.3.6 1.3 1.3v8.7c0-.7-.6-1.3-1.3-1.3H2.5z" />
                <path d="M13.5 3.5H9.3c-.7 0-1.3.6-1.3 1.3v8.7c0-.7.6-1.3 1.3-1.3h4.2z" />
              </svg>
            </span>
            <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-base font-bold text-slate-900">Jurnal yang Digunakan</h2>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">Daftar jurnal yang menjadi sumber penyusunan literature review.</p>
          <table className="mt-3 w-full text-left text-xs">
            <thead className="border-b border-slate-200 text-slate-400">
              <tr>
                <th className="py-2">Penulis ⇅</th>
                <th className="py-2 text-center">Tahun ⇅</th>
                <th className="py-2 text-right">Sumber</th>
              </tr>
            </thead>
            <tbody>
              {priorityRows.slice(0, 5).map(row => (
                <tr key={row.title} className="border-b border-slate-100 last:border-0">
                  <td className="max-w-[135px] py-3 pr-2 font-medium text-slate-800">{row.authors}</td>
                  <td className="py-3 text-center text-slate-500">{row.year}</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1.5 text-slate-700">
                      <img src={sourceLogos[row.source] ?? "/assets/source-logos/openalex.svg"} alt="" className="h-3.5 w-3.5 object-contain" />
                      {row.source}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-[#0369a1]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M2.5 4h11M2.5 8h11M2.5 12h7" />
            </svg>
          </span>
          <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-base font-bold text-slate-900">Struktur Dokumen (12 Bagian)</h2>
        </div>
        <span className="text-xs font-semibold text-[#0369a1]">Bagian {activeDocSection} dari 12</span>
      </div>

      {/* Kontainer Scroll Chip */}
      <div
        ref={chipsScrollRef}
        onScroll={updateScrollProgress}
        className="mt-2.5 flex gap-2 overflow-x-auto pb-1 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {literatureDocSections.map((sec, index) => {
          const isActive = activeDocSection === index + 1;
          return (
            <button
              key={sec.key}
              type="button"
              onClick={() => {
                setActiveDocSection(index + 1);
                if (chipsScrollRef.current) {
                  const targetBtn = chipsScrollRef.current.children[index] as HTMLElement | undefined;
                  targetBtn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                  setTimeout(updateScrollProgress, 350);
                }
              }}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all ${
                isActive ? "bg-[#0369a1] text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                isActive ? "bg-white/20 text-white" : "bg-slate-300 text-slate-700"
              }`}>
                {index + 1}
              </span>
              {sec.title}
            </button>
          );
        })}
      </div>

      {/* Garis scrollbar di bawah yang bisa digeser-geser */}
      <div className="mt-2.5 w-full px-0.5">
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className="group relative h-1.5 w-full rounded-full bg-slate-200/90 cursor-pointer overflow-hidden transition-all hover:h-2"
          title="Geser garis untuk melihat bagian lainnya"
          aria-label="Garis geser bagian dokumen"
        >
          <div
            onMouseDown={handleThumbMouseDown}
            onTouchStart={handleThumbTouchStart}
            style={{
              width: `${thumbRatio * 100}%`,
              left: `${scrollProgress * (1 - thumbRatio) * 100}%`,
            }}
            className="absolute top-0 bottom-0 rounded-full bg-slate-400 group-hover:bg-[#00629b] active:bg-[#004f80] transition-colors cursor-grab active:cursor-grabbing shadow-2xs"
          />
        </div>
      </div>

      {/* Konten bagian dokumen yang berubah dinamis saat tab diklik */}
      <div className="mt-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 transition-all">
        <div className="flex gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0369a1]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-['Plus_Jakarta_Sans:Bold'] text-base font-bold text-slate-900">
                {currentSec.key}. {currentSec.title}
              </h3>
              <span className="rounded-full bg-sky-100/70 px-2.5 py-0.5 text-xs font-semibold text-[#0369a1]">
                Bagian {currentSec.section} dari 12
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-slate-500">{currentSec.desc}</p>
            <div className="mt-3 space-y-2 border-t border-slate-200/60 pt-3">
              {currentSec.content.map((p, idx) => (
                <p key={idx} className="text-sm leading-6 text-slate-600">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2.5 border-t border-slate-200/60 pt-3">
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-rose-50 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
            </svg>
            Hapus
          </button>
          <label className="relative">
            <select
              aria-label="Pilih folder literatur"
              value={item.folderId}
              onChange={event => onMove(event.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-7 text-xs font-semibold text-slate-700"
            >
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
              <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
            </svg>
          </label>
          <button
            type="button"
            onClick={onOpen}
            className="flex items-center gap-1.5 rounded-xl bg-[#0369a1] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#025684] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" />
              <circle cx="8" cy="8" r="2" />
            </svg>
            Lihat Detail
          </button>
        </div>
      </div>
    </section>
  );
}

function MobileLiteratureCollectionCard({
  item,
  onOpen,
  onRemove,
  onMove,
  folders,
}: {
  item: SavedLiterature;
  onOpen: () => void;
  onRemove: () => void;
  onMove: (folderId: string) => void;
  folders: CollectionFolder[];
}) {
  const [showMatrix, setShowMatrix] = useState(false);
  const [activeDocSection, setActiveDocSection] = useState(1);
  const chipsScrollRef = useRef<HTMLDivElement | null>(null);

  const currentSection =
    literatureDocSections.find(s => s.section === activeDocSection) ?? literatureDocSections[0];

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-3.5">
      {/* Banner Topik yang Dianalisis */}
      <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 via-blue-50/50 to-indigo-50/40 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-bold text-[#0284c7] shadow-xs">
            Literature Review
          </span>
          <span className="text-xs text-slate-500">{item.date}</span>
        </div>
        <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Topik yang dianalisis</p>
        <h3 className="mt-0.5 font-['Plus_Jakarta_Sans:Bold'] text-[15px] font-bold leading-snug text-[#075985]">
          {item.topic}
        </h3>
      </div>

      {/* Grid 4 Statistik (2x2) */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          ["Total hasil ditemukan", "126", "text-[#00629b]"],
          ["Duplikasi dihapus", "34", "text-red-700"],
          ["Tersisa untuk sintesis", "92", "text-[#00629b]"],
          ["Prioritas tinggi", "24", "text-[#00629b]"],
        ].map(([label, value, tone]) => (
          <div key={label} className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-3 shadow-2xs">
            <p className="text-[12px] sm:text-[12.5px] font-semibold leading-snug text-slate-600">{label}</p>
            <p className="mt-1.5 flex items-baseline gap-1.5">
              <span className={`font-['Plus_Jakarta_Sans:ExtraBold'] text-[22px] sm:text-[23px] font-extrabold tracking-tight ${tone}`}>{value}</span>
              <span className={`text-xs font-medium ${label === "Duplikasi dihapus" ? "text-red-700/80" : "text-slate-500"}`}>artikel</span>
            </p>
          </div>
        ))}
      </div>

      {/* Struktur Dokumen (12 Bagian) Horizontal Chips */}
      <div className="border-t border-slate-100/90 pt-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-[#00629b]">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M2.5 4h11M2.5 8h11M2.5 12h7" />
              </svg>
            </span>
            <h4 className="font-['Plus_Jakarta_Sans:Bold'] text-[13px] sm:text-[13.5px] font-bold text-slate-800 whitespace-nowrap">
              Struktur Dokumen
            </h4>
          </div>
          <span className="shrink-0 whitespace-nowrap inline-flex items-center rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-[#00629b] border border-sky-200/60">
            Bagian {activeDocSection} dari 12
          </span>
        </div>

        <div
          ref={chipsScrollRef}
          className="-mx-4 mt-3 flex gap-2.5 overflow-x-auto px-4 pb-2.5 pt-0.5 no-scrollbar scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {literatureDocSections.map((sec, index) => {
            const isActive = activeDocSection === index + 1;
            return (
              <button
                key={sec.key}
                type="button"
                onClick={e => {
                  setActiveDocSection(index + 1);
                  e.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                  });
                }}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer select-none active:scale-95 ${
                  isActive
                    ? "bg-[#00629b] text-white shadow-xs ring-1 ring-[#00629b]"
                    : "bg-slate-100/90 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/70"
                }`}
              >
                <span
                  className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white font-extrabold"
                      : "bg-slate-200/90 text-slate-600"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="whitespace-nowrap">{sec.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Konten Bagian Dokumen yang Terpilih (Berubah dinamis saat tab diklik) */}
      <div className="mt-1 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 space-y-2.5 transition-all">
        <div className="flex items-start gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-[#0369a1]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold text-slate-800">
              {currentSection.key}. {currentSection.title}
            </h4>
            <p className="text-xs text-slate-500 font-medium">{currentSection.desc}</p>
          </div>
        </div>
        <div className="border-t border-slate-200/60 pt-2.5 space-y-2">
          {currentSection.content.map((p, idx) => (
            <p key={idx} className="text-[14px] leading-6 text-slate-700">
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* Accordion Toggle Matriks Literatur & Jurnal */}
      <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => setShowMatrix(v => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#0369a1]" aria-hidden="true">
              <rect x="2" y="2" width="12" height="12" rx="2" />
              <path d="M2 6h12M6 2v12" />
            </svg>
            Matriks Literatur &amp; Jurnal Sumber
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 text-slate-500 ${showMatrix ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </button>

        {showMatrix && (
          <div className="border-t border-slate-100 p-3.5 space-y-4 bg-slate-50/40">
            {/* Matriks Literatur Table (Font Lebih Besar & Lebih Lega) */}
            <div>
              <div className="flex items-center justify-between pb-1.5">
                <p className="text-sm font-bold text-slate-800">Preview Matriks Literatur</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-[#00629b] border border-sky-100">
                  <span>Geser tabel</span>
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full min-w-[620px] text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-100/90 text-slate-700">
                    <tr>
                      <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[11px] w-[240px]">Judul & Penulis</th>
                      <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[11px] w-[150px]">Fokus</th>
                      <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[11px] w-[150px]">Teori</th>
                      <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[11px] w-[200px]">Temuan Utama</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {matrixRows.slice(0, 8).map((row, idx) => (
                      <tr key={`${row.title || row.name}-${idx}`} className="align-top hover:bg-slate-50/60 transition-colors">
                        <td className="px-3.5 py-3">
                          <span className="font-bold text-slate-900 text-[13px] block leading-snug">{row.title || row.name}</span>
                          <span className="block text-xs text-slate-500 font-medium mt-0.5">{row.authors || row.journal}</span>
                        </td>
                        <td className="px-3.5 py-3 text-xs leading-relaxed text-slate-700 font-normal">{row.cells[0]}</td>
                        <td className="px-3.5 py-3 text-xs leading-relaxed text-slate-700 font-normal">{row.cells[1]}</td>
                        <td className="px-3.5 py-3 text-xs leading-relaxed text-slate-700 font-normal">{row.cells[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Jurnal yang Digunakan (Banyak & Bisa Di-Scroll) */}
            <div>
              <div className="flex items-center justify-between pb-1.5">
                <p className="text-sm font-bold text-slate-800">Jurnal Sumber yang Digunakan</p>
                <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-[#00629b] border border-sky-200/60">
                  {priorityRows.length} Jurnal
                </span>
              </div>

              {/* Scrollable List Jurnal Sumber */}
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1 rounded-xl border border-slate-200/80 bg-slate-50/60 p-2 scroll-smooth">
                {priorityRows.map((row, idx) => (
                  <div
                    key={`${row.title}-${idx}`}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-2xs transition-colors hover:border-sky-300"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="font-bold text-slate-800 text-[13px] leading-snug truncate">{row.authors}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {row.year} {row.title ? `· ${row.title}` : ""}
                      </p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200/80 px-2 py-1 text-xs font-semibold text-slate-700">
                      <img src={sourceLogos[row.source] ?? "/assets/source-logos/openalex.svg"} alt="" className="h-3.5 w-3.5 object-contain" />
                      <span>{row.source}</span>
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-slate-400 text-center">
                Gulir ke bawah untuk melihat seluruh {priorityRows.length} jurnal sumber ↓
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Baris Tombol Aksi Bawah */}
      <div className="space-y-2 border-t border-slate-100 pt-3">
        {/* Tombol Utama: Lihat Detail Review */}
        <button
          type="button"
          onClick={onOpen}
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#00629b] px-4 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#004f80] active:scale-[0.98] cursor-pointer"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" />
            <circle cx="8" cy="8" r="2" />
          </svg>
          <span>Lihat Detail Review</span>
        </button>

        {/* Baris Pindah Folder & Hapus */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-[#00629b]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
              </svg>
            </span>
            <select
              value={item.folderId}
              onChange={e => onMove(e.target.value)}
              aria-label="Pilih folder literature review"
              className="min-h-[42px] w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-8 text-xs font-semibold text-slate-700 outline-none transition-colors hover:bg-slate-100/70 focus:border-sky-400 focus:bg-white truncate"
            >
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 1l4 4 4-4" />
              </svg>
            </span>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="flex min-h-[42px] shrink-0 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/40 px-3.5 text-xs font-semibold text-rose-600 shadow-2xs transition-colors hover:bg-rose-100/60 active:scale-95 cursor-pointer"
            aria-label="Hapus literature review"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
            </svg>
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function MobileResearchMapCollectionCard({
  item,
  onOpen,
  onRemove,
  onMove,
  folders,
}: {
  item: SavedResearchMap;
  onOpen: () => void;
  onRemove: () => void;
  onMove: (folderId: string) => void;
  folders: CollectionFolder[];
}) {
  const [activeMapTab, setActiveMapTab] = useState<"network" | "density" | "trend">("network");

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-3.5">
      {/* Header Meta Riset */}
      <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50/60 via-blue-50/40 to-slate-50/80 p-3.5 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-[#00629b] shadow-2xs border border-sky-200/80">
            Peta Penelitian
          </span>
          <span className="text-xs font-medium text-slate-500">{item.date}</span>
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Topik Penelitian</span>
          <p className="mt-0.5 flex items-center gap-1.5 font-['Plus_Jakarta_Sans:Bold'] text-[15px] sm:text-base font-bold text-slate-900">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#00629b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#00629b]">
              <circle cx="7" cy="7" r="4.5" />
              <path d="M10.5 10.5L14 14" />
            </svg>
            {item.topic}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/70">
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Sumber Jurnal</span>
            <span className="font-bold text-slate-800 text-xs sm:text-[13px]">{item.sources}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Periode</span>
            <span className="font-bold text-slate-800 text-xs sm:text-[13px]">2020 - 2026</span>
          </div>
        </div>
      </div>

      {/* Segmented Control 3 Peta di Mobile */}
      <div>
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveMapTab("network")}
            className={`rounded-lg py-2 text-xs sm:text-[12.5px] font-bold transition-all cursor-pointer ${
              activeMapTab === "network" ? "bg-white text-[#00629b] shadow-xs ring-1 ring-slate-200/60" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Peta Jaringan
          </button>
          <button
            type="button"
            onClick={() => setActiveMapTab("density")}
            className={`rounded-lg py-2 text-xs sm:text-[12.5px] font-bold transition-all cursor-pointer ${
              activeMapTab === "density" ? "bg-white text-[#00629b] shadow-xs ring-1 ring-slate-200/60" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Peta Kepadatan
          </button>
          <button
            type="button"
            onClick={() => setActiveMapTab("trend")}
            className={`rounded-lg py-2 text-xs sm:text-[12.5px] font-bold transition-all cursor-pointer ${
              activeMapTab === "trend" ? "bg-white text-[#00629b] shadow-xs ring-1 ring-slate-200/60" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Perkembangan
          </button>
        </div>

        {/* Tab Content Peta */}
        <div className="mt-2.5">
          {activeMapTab === "network" && (
            <div className="rounded-xl border border-slate-200/90 bg-white p-3.5">
              <p className="text-xs sm:text-[12.5px] font-semibold text-slate-700 text-center">Hubungan antar topik berdasarkan kemunculan bersama</p>
              <div className="mt-2.5">
                <CollectionMapPreview mode="jaringan" className="h-48" />
              </div>
            </div>
          )}

          {activeMapTab === "density" && (
            <div className="rounded-xl border border-slate-200/90 bg-white p-3.5">
              <p className="text-xs sm:text-[12.5px] font-semibold text-slate-700 text-center">Tingkat konsentrasi topik dalam penelitian</p>
              <div className="mt-2.5">
                <CollectionMapPreview mode="kepadatan" className="h-48" />
              </div>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                <span>Rendah</span>
                <span className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-red-500" />
                <span>Tinggi</span>
              </div>
            </div>
          )}

          {activeMapTab === "trend" && (
            <div className="rounded-xl border border-slate-200/90 bg-white p-3.5">
              <p className="text-xs sm:text-[12.5px] font-semibold text-slate-700 text-center">Rata-rata tahun publikasi setiap topik</p>
              <div className="mt-2.5">
                <CollectionMapPreview mode="perkembangan" className="h-48" />
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-gradient-to-r from-blue-600 via-emerald-400 to-amber-500" />
              <div className="mt-1 flex justify-between text-[9.5px] sm:text-[10px] font-medium text-slate-500">
                {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map(year => (
                  <span key={year}>{year}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Jurnal yang Digunakan Preview (Bisa ditampilkan banyak & bisa discroll) */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-100 text-[#00629b]">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 3.5h4.2c.7 0 1.3.6 1.3 1.3v8.7c0-.7-.6-1.3-1.3-1.3H2.5z" />
                <path d="M13.5 3.5H9.3c-.7 0-1.3.6-1.3 1.3v8.7c0-.7.6-1.3 1.3-1.3h4.2z" />
              </svg>
            </span>
            <h4 className="font-['Plus_Jakarta_Sans:Bold'] text-[13px] font-bold text-slate-800">Jurnal Sumber yang Digunakan</h4>
          </div>
          <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-[#00629b] border border-sky-200/60">
            {priorityRows.length} Jurnal
          </span>
        </div>

        {/* Scrollable list jurnal sumber */}
        <div className="modal-custom-scrollbar max-h-[260px] overflow-y-auto space-y-2 pr-1.5 scroll-smooth">
          {priorityRows.map((row, idx) => (
            <div
              key={`${row.title}-${idx}`}
              className="flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50/70 p-2.5 text-xs transition-colors hover:border-sky-300 hover:bg-slate-50"
            >
              <div className="min-w-0 flex-1 pr-2.5">
                <p className="font-bold text-slate-800 truncate text-[12px] sm:text-xs leading-snug">{row.authors}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5 leading-normal">
                  {row.year} {row.title ? `· ${row.title}` : ""}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200/60 shadow-2xs">
                <img src={sourceLogos[row.source] ?? "/assets/source-logos/openalex.svg"} alt="" className="h-3.5 w-3.5 object-contain" />
                <span>{row.source}</span>
              </span>
            </div>
          ))}
        </div>
        <p className="pt-0.5 text-[10.5px] text-slate-400 text-center">
          Gulir ke bawah untuk melihat seluruh {priorityRows.length} jurnal sumber ↓
        </p>
      </div>

      {/* Baris Tombol Aksi Bawah */}
      <div className="space-y-2.5 border-t border-slate-100 pt-3.5">
        {/* Tombol Utama: Lihat Detail Peta */}
        <button
          type="button"
          onClick={onOpen}
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#00629b] px-4 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#004f80] active:scale-[0.98] cursor-pointer"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" />
            <circle cx="8" cy="8" r="2" />
          </svg>
          <span>Lihat Detail Peta</span>
        </button>

        {/* Baris Pindah Folder & Hapus */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-[#00629b]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
              </svg>
            </span>
            <select
              value={item.folderId}
              onChange={e => onMove(e.target.value)}
              aria-label="Pilih folder peta penelitian"
              className="min-h-[44px] w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-8 text-xs font-semibold text-slate-700 outline-none transition-colors hover:bg-slate-100/70 focus:border-sky-400 focus:bg-white truncate"
            >
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 1l4 4 4-4" />
              </svg>
            </span>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/40 px-3.5 text-xs font-semibold text-rose-600 shadow-2xs transition-colors hover:bg-rose-100/60 active:scale-95 cursor-pointer"
            aria-label="Hapus peta penelitian"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
            </svg>
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </article>
  );
}

const validateSearchInput = (val: string): string | null => {
  const trimmed = val.trim();
  if (!trimmed) return null;

  // Bebaskan format DOI, situs DOI (doi.org), maupun URL dari validasi angka/simbol khusus
  if (isDoiFormat(trimmed)) {
    if (trimmed.length > 255) {
      return "Maksimal 255 karakter.";
    }
    return null;
  }

  if (val.length > 50) {
    return "Maksimal 50 karakter.";
  }

  // Format salah jika terdapat angka (0-9) atau karakter khusus (selain huruf dan spasi)
  const hasInvalidFormat = /[0-9]/.test(val) || /[^\p{L}\s]/u.test(val);
  if (hasInvalidFormat) {
    return "Format tidak valid. Gunakan huruf saja tanpa angka atau simbol khusus.";
  }

  return null;
};

export default function CariJurnalFigmaPanel({
  onBack,
  onDiskusikan,
}: {
  onBack: () => void;
  onDiskusikan?: (templatePrompt: string) => void;
}) {
  const [view, setView] = useState<JournalView>("home");
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 768 : false));
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsMobile(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return window.localStorage.getItem("alerin-theme") === "dark";
    } catch {
      return false;
    }
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        window.localStorage.setItem("alerin-theme", next ? "dark" : "light");
      } catch {}
      return next;
    });
  };

  const [riwayatItems, setRiwayatItems] = useState<RiwayatItem[]>(() => {
    const fallback = riwayatSidebar.map(label => ({ label, query: label, type: "journal" as const, waktu: "4 November 2026 • 14.15" }));
    try {
      const stored = JSON.parse(window.localStorage.getItem("alerin-jurnal-riwayat") ?? "null");
      if (Array.isArray(stored) && stored.length > 0) return stored as RiwayatItem[];
    } catch {
      return fallback;
    }
    return fallback;
  });
  const [query, setQuery] = useState("");
  const [searchSubmittedQuery, setSearchSubmittedQuery] = useState("");
  const [quickSearchCategory, setQuickSearchCategory] = useState<"topik" | "judul" | "penulis">("topik");
  const [paragraph, setParagraph] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileObject, setFileObject] = useState<File | null>(null);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);

  useEffect(() => {
    // Mencegah duplikasi state di mana query dan paragraph sama-sama terisi teks yang sama
    if (query.trim() && paragraph.trim() && query.trim() === paragraph.trim()) {
      setQuery("");
    }
  }, [query, paragraph]);
  const [useActiveFilter, setUseActiveFilter] = useState(true);
  const [fileSizeLabel, setFileSizeLabel] = useState("");
  const [mobileSearchStage, setMobileSearchStage] = useState<"home" | "loading" | "results">("home");
  const [desktopStage, setDesktopStage] = useState<"home" | "loading" | "results">("home");
  const [searchType, setSearchType] = useState<"journal" | "review" | "map">("journal");
  const [activeRiwayatKey, setActiveRiwayatKey] = useState<string | null>(null);
  const [literatureTopic, setLiteratureTopic] = useState("");
  const [mapTopic, setMapTopic] = useState("");
  const [reviewYearFrom, setReviewYearFrom] = useState("2020");
  const [reviewYearTo, setReviewYearTo] = useState("2026");
  const [reviewCount, setReviewCount] = useState("100");
  const [showReviewLimitNotice, setShowReviewLimitNotice] = useState(false);
  const [resultMode, setResultMode] = useState<"search" | "analysis">("search");
  const [loadingSource, setLoadingSource] = useState<"search" | "collection" | "history">("search");
  const [isLongLoading, setIsLongLoading] = useState(false);
  const [showSlowSearchPopup, setShowSlowSearchPopup] = useState(false);
  const [mobileJournalSlideIndex, setMobileJournalSlideIndex] = useState(0);
  const [mobileJournals, setMobileJournals] = useState(mobileResultJournals);
  const [isMobileListRefreshing, setIsMobileListRefreshing] = useState(false);

  const handleMobileReplaceJournal = async (journalId: string, _reasons: string[]) => {
    setIsMobileListRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1200));

    setMobileJournals(prev => {
      const idx = prev.findIndex(j => j.id === journalId);
      if (idx === -1) return prev;
      const currentIds = prev.map(j => j.id);
      const replacement = alternativeJournalsPool.find(j => !currentIds.includes(j.id)) ?? alternativeJournalsPool[idx % alternativeJournalsPool.length];
      const replacementJournal = replacement.detail?.source || "Jurnal Kajian Pemasaran Digital";
      const newId = `${replacement.id}-${Date.now()}`;
      const parseScore = (r: string) => parseInt(r.replace(/\D/g, ""), 10) || 90;
      const nextList = [...prev];
      nextList[idx] = {
        id: newId,
        rank: `Rekomendasi ${idx + 1}`,
        score: parseScore(replacement.relevancy),
        citation: `${replacement.year} • ${replacementJournal}`,
        journal: replacementJournal,
        summary: replacement.description,
        title: replacement.title,
        authors: replacement.authors,
        description: replacement.description,
        year: replacement.year,
        relevancy: replacement.relevancy,
        isReplaced: true,
      };

      const sorted = [...nextList].sort((a, b) => (b.score || 0) - (a.score || 0));
      return sorted.map((item, rankIdx) => ({
        ...item,
        rank: `Rekomendasi ${rankIdx + 1}`,
      }));
    });
    setIsMobileListRefreshing(false);
    showToast("Jurnal berhasil diganti dan rekomendasi telah diurutkan!");
  };
  const [temuanIndex, setTemuanIndex] = useState(1);
  const [mobileNavHidden, setMobileNavHidden] = useState(false);
  const lastMobileScrollY = useRef(0);
  const isOpeningRiwayatRef = useRef(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [folders, setFolders] = useState<CollectionFolder[]>(defaultFolders);
  const [savedJournals, setSavedJournals] = useState<SavedJournal[]>(initialSavedJournals);
  const [activeFolderId, setActiveFolderId] = useState("all");
  const [collectionTab, setCollectionTab] = useState<"journal" | "review" | "map">("journal");
  const [mobileCollectionMenuOpen, setMobileCollectionMenuOpen] = useState(false);
  const [mobileProfileMenuOpen, setMobileProfileMenuOpen] = useState(false);
  const [literatureFolders, setLiteratureFolders] = useState<CollectionFolder[]>(defaultLiteratureFolders);
  const [savedLiterature, setSavedLiterature] = useState<SavedLiterature[]>(initialSavedLiterature);
  const [activeLiteratureFolderId, setActiveLiteratureFolderId] = useState("all");
  const [mapFolders, setMapFolders] = useState<CollectionFolder[]>(defaultMapFolders);
  const [savedMaps, setSavedMaps] = useState<SavedResearchMap[]>(initialSavedMaps);
  const [activeMapFolderId, setActiveMapFolderId] = useState("all");
  const [folderSelectMode, setFolderSelectMode] = useState(false);
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [toast, setToast] = useState<string | { title: string; description?: string } | null>(null);
  const [ringkasanOpen, setRingkasanOpen] = useState(false);
  const [tabelOpen, setTabelOpen] = useState(false);
  const [sitasiOpen, setSitasiOpen] = useState(false);
  const [abstrakOpen, setAbstrakOpen] = useState(false);
  const [hapusJournalId, setHapusJournalId] = useState<string | null>(null);
  const [hapusLiteratureId, setHapusLiteratureId] = useState<string | null>(null);
  const [hapusMapId, setHapusMapId] = useState<string | null>(null);
  const [hapusFolderModalOpen, setHapusFolderModalOpen] = useState(false);
  const [hapusFileModalOpen, setHapusFileModalOpen] = useState(false);
  const [mobileHapusTarget, setMobileHapusTarget] = useState<{ type: "riwayat" | "extra"; index: number; label: string } | null>(null);
  const [mobileGantiNamaTarget, setMobileGantiNamaTarget] = useState<{ index: number; label: string } | null>(null);
  const [extraRiwayatList, setExtraRiwayatList] = useState(riwayatPencarian);
  const toastTimer = useRef<number | undefined>(undefined);
  const [openedLiteratureJournals, setOpenedLiteratureJournals] = useState<string[]>([]);
  const [upgradeLockedConfirmOpen, setUpgradeLockedConfirmOpen] = useState(false);

  const handleOpenLiteratureJournal = (title: string) => {
    if (openedLiteratureJournals.includes(title)) {
      window.open("https://doi.org", "_blank", "noopener,noreferrer");
      return;
    }
    if (openedLiteratureJournals.length < 3) {
      const next = [...openedLiteratureJournals, title];
      setOpenedLiteratureJournals(next);
      window.open("https://doi.org", "_blank", "noopener,noreferrer");
      if (next.length === 3) {
        showToast("Batas 3 jurnal gratis tercapai. Jurnal lainnya kini terkunci.");
      } else {
        showToast(`Jurnal dibuka (${next.length}/3 kuota gratis)`);
      }
    } else {
      setUpgradeLockedConfirmOpen(true);
    }
  };

  const confirmHapusFile = () => {
    if (fileUrl) {
      try {
        URL.revokeObjectURL(fileUrl);
      } catch {}
    }
    setFileUrl(null);
    setFileObject(null);
    setFileName("");
    setFileSizeLabel("");
    setHapusFileModalOpen(false);
    showToast("File berhasil dihapus");
  };

  const showToast = (message: string | { title: string; description?: string }) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3600);
  };

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = { all: savedJournals.length };
    for (const folder of folders) counts[folder.id] = 0;
    for (const journal of savedJournals) counts[journal.folderId] = (counts[journal.folderId] ?? 0) + 1;
    return counts;
  }, [savedJournals, folders]);

  const savedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const journal of savedJournals) {
      ids.add(journal.id);
      const cleanTitle = journal.title?.toLowerCase().trim();
      if (cleanTitle) {
        const matchingDesktop = desktopResultJournals.find(dr => dr.title?.toLowerCase().trim() === cleanTitle);
        if (matchingDesktop) ids.add(matchingDesktop.id);
        const matchingMobile = mobileResultJournals.find(mr => mr.title?.toLowerCase().trim() === cleanTitle);
        if (matchingMobile) ids.add(matchingMobile.id);
      }
    }
    return Array.from(ids);
  }, [savedJournals]);

  const collectionJournals = useMemo(
    () => (activeFolderId === "all" ? savedJournals : savedJournals.filter(journal => journal.folderId === activeFolderId)),
    [savedJournals, activeFolderId],
  );

  const literatureCounts = useMemo(() => {
    const counts: Record<string, number> = { all: savedLiterature.length };
    for (const folder of literatureFolders) counts[folder.id] = 0;
    for (const item of savedLiterature) counts[item.folderId] = (counts[item.folderId] ?? 0) + 1;
    return counts;
  }, [savedLiterature, literatureFolders]);

  const mapCounts = useMemo(() => {
    const counts: Record<string, number> = { all: savedMaps.length };
    for (const folder of mapFolders) counts[folder.id] = 0;
    for (const item of savedMaps) counts[item.folderId] = (counts[item.folderId] ?? 0) + 1;
    return counts;
  }, [savedMaps, mapFolders]);

  const collectionLiterature = activeLiteratureFolderId === "all" ? savedLiterature : savedLiterature.filter(item => item.folderId === activeLiteratureFolderId);
  const collectionMaps = activeMapFolderId === "all" ? savedMaps : savedMaps.filter(item => item.folderId === activeMapFolderId);

  const toggleSaveJournal = (journal: Omit<SavedJournal, "folderId">) => {
    const isSaved = savedJournals.some(
      item => item.id === journal.id || (Boolean(journal.title) && item.title.toLowerCase().trim() === journal.title.toLowerCase().trim())
    );
    if (isSaved) {
      setSavedJournals(list =>
        list.filter(
          item => item.id !== journal.id && (!journal.title || item.title.toLowerCase().trim() !== journal.title.toLowerCase().trim())
        )
      );
      showToast("Jurnal dihapus dari Koleksi");
    } else {
      setSavedJournals(list => [...list, { ...journal, folderId: "ungrouped" }]);
      showToast("Jurnal disimpan ke Koleksi");
    }
  };

  const allMobileJournalsSaved = useMemo(() => {
    return (
      mobileJournals.length > 0 &&
      mobileJournals.every(j =>
        savedJournals.some(
          item => item.id === j.id || (Boolean(j.title) && item.title.toLowerCase().trim() === j.title.toLowerCase().trim())
        )
      )
    );
  }, [mobileJournals, savedJournals]);

  const toggleSaveAllMobileJournals = () => {
    if (allMobileJournalsSaved) {
      setSavedJournals(list =>
        list.filter(
          item => !mobileJournals.some(j => j.id === item.id || (Boolean(j.title) && item.title.toLowerCase().trim() === j.title.toLowerCase().trim()))
        )
      );
      showToast("Jurnal dihapus dari Koleksi");
    } else {
      setSavedJournals(list => {
        const toAdd: SavedJournal[] = [];
        for (const j of mobileJournals) {
          const exists = list.some(
            item => item.id === j.id || (Boolean(j.title) && item.title.toLowerCase().trim() === j.title.toLowerCase().trim())
          );
          if (!exists) {
            toAdd.push({
              id: j.id,
              title: j.title,
              authors: j.authors,
              description: j.description || j.summary,
              year: j.year,
              relevancy: j.relevancy,
              folderId: "ungrouped",
            });
          }
        }
        return [...list, ...toAdd];
      });
      showToast("Semua rekomendasi disimpan ke Koleksi");
    }
  };

  const saveLiteratureReview = () => {
    const topic = (query.trim() || literatureTopic.trim() || "Resiliensi perempuan dalam menghadapi bencana dan krisis").replace(/\s+/g, " ");
    const isExisting = savedLiterature.some(item => item.topic.toLowerCase() === topic.toLowerCase());

    if (isExisting) {
      setSavedLiterature(list => list.filter(item => item.topic.toLowerCase() !== topic.toLowerCase()));
      showToast("Literature review dihapus dari Koleksi");
      return;
    }

    const count = Number.parseInt(reviewCount, 10) || 100;
    const yearFrom = reviewYearFrom || "2020";
    const yearTo = reviewYearTo || "2026";
    const displayTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
    const nextItem: SavedLiterature = {
      id: `lit-${Date.now()}`,
      title: `Literatur Review: ${displayTopic}`,
      topic,
      sources: `${count} jurnal`,
      period: `${yearFrom}–${yearTo}`,
      yearFrom,
      yearTo,
      count,
      folderId: "ungrouped",
      date: "Hari ini",
    };
    setSavedLiterature(list => [nextItem, ...list]);
    showToast("Literature review disimpan ke Koleksi");
  };

  const moveLiterature = (id: string, folderId: string) => {
    setSavedLiterature(list => list.map(item => (item.id === id ? { ...item, folderId } : item)));
    const folder = literatureFolders.find(item => item.id === folderId);
    showToast(`Literature review dipindahkan ke ${folder?.name ?? "Belum dikelompokkan"}`);
  };

  const removeLiterature = (id: string) => {
    setSavedLiterature(list => list.filter(item => item.id !== id));
    showToast("Literature review dihapus dari Koleksi");
  };

  const openSavedLiterature = (item: SavedLiterature) => {
    setView("home");
    setQuery(item.topic);
    setLiteratureTopic(item.topic);
    setReviewYearFrom(item.yearFrom);
    setReviewYearTo(item.yearTo);
    setReviewCount(String(item.count));
    setSearchType("review");
    setResultMode("search");
    setLoadingSource("collection");
    if (window.matchMedia("(min-width: 768px)").matches) setDesktopStage("loading");
    else setMobileSearchStage("loading");
  };

  const saveResearchMap = () => {
    const topic = (query.trim() || mapTopic.trim() || "AI generatif dalam pendidikan").replace(/\s+/g, " ");
    const isExisting = savedMaps.some(item => item.topic.toLowerCase() === topic.toLowerCase());

    if (isExisting) {
      setSavedMaps(list => list.filter(item => item.topic.toLowerCase() !== topic.toLowerCase()));
      showToast("Peta penelitian dihapus dari Koleksi");
      return;
    }

    const count = Number.parseInt(reviewCount, 10) || 100;
    const displayTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
    const nextItem: SavedResearchMap = {
      id: `map-${Date.now()}`,
      title: `Peta Penelitian: ${displayTopic}`,
      topic,
      sources: `${count} jurnal`,
      clusters: "5 klaster",
      folderId: "ungrouped",
      date: "Hari ini",
    };
    setSavedMaps(list => [nextItem, ...list]);
    showToast("Peta penelitian disimpan ke Koleksi");
  };

  const moveMap = (id: string, folderId: string) => {
    setSavedMaps(list => list.map(item => (item.id === id ? { ...item, folderId } : item)));
    const folder = mapFolders.find(item => item.id === folderId);
    showToast(`Peta penelitian dipindahkan ke ${folder?.name ?? "Belum dikelompokkan"}`);
  };

  const removeMap = (id: string) => {
    setSavedMaps(list => list.filter(item => item.id !== id));
    showToast("Peta penelitian dihapus dari Koleksi");
  };

  const openSavedMap = (item: SavedResearchMap) => {
    setView("home");
    setQuery(item.topic);
    setMapTopic(item.topic);
    setReviewCount(item.sources.replace(/[^0-9]/g, "") || "100");
    setSearchType("map");
    setResultMode("search");
    setLoadingSource("collection");
    if (window.matchMedia("(min-width: 768px)").matches) setDesktopStage("loading");
    else setMobileSearchStage("loading");
  };

  const moveJournal = (journalId: string, folderId: string) => {
    const folder = folders.find(item => item.id === folderId);
    setSavedJournals(list => list.map(item => (item.id === journalId ? { ...item, folderId } : item)));
    showToast(`Jurnal dipindahkan ke folder ${folder?.name ?? "Belum dikelompokkan"}`);
  };

  const removeSavedJournal = (journalId: string) => {
    setSavedJournals(list => list.filter(item => item.id !== journalId));
    showToast("Jurnal dihapus dari Koleksi");
  };

  const hapusJournal = savedJournals.find(journal => journal.id === hapusJournalId) ?? null;

  const confirmRemoveSavedJournal = () => {
    if (hapusJournalId) removeSavedJournal(hapusJournalId);
    setHapusJournalId(null);
  };

  const confirmRemoveLiterature = () => {
    if (hapusLiteratureId) removeLiterature(hapusLiteratureId);
    setHapusLiteratureId(null);
  };

  const confirmRemoveMap = () => {
    if (hapusMapId) removeMap(hapusMapId);
    setHapusMapId(null);
  };

  const toggleFolderSelection = (folderId: string) => {
    setSelectedFolderIds(list => (list.includes(folderId) ? list.filter(item => item !== folderId) : [...list, folderId]));
  };

  const exitFolderSelect = () => {
    setFolderSelectMode(false);
    setSelectedFolderIds([]);
  };

  const deleteSelectedFolders = () => {
    if (selectedFolderIds.length === 0) return;
    const count = selectedFolderIds.length;
    if (collectionTab === "review") {
      setSavedLiterature(list => list.map(item => (selectedFolderIds.includes(item.folderId) ? { ...item, folderId: "ungrouped" } : item)));
      setLiteratureFolders(list => list.filter(folder => !selectedFolderIds.includes(folder.id)));
      if (selectedFolderIds.includes(activeLiteratureFolderId)) setActiveLiteratureFolderId("all");
      exitFolderSelect();
      showToast(`${count} folder dihapus, literatur dipindahkan ke Belum dikelompokkan`);
      return;
    }
    if (collectionTab === "map") {
      setSavedMaps(list => list.map(item => (selectedFolderIds.includes(item.folderId) ? { ...item, folderId: "ungrouped" } : item)));
      setMapFolders(list => list.filter(folder => !selectedFolderIds.includes(folder.id)));
      if (selectedFolderIds.includes(activeMapFolderId)) setActiveMapFolderId("all");
      exitFolderSelect();
      showToast(`${count} folder dihapus, peta dipindahkan ke Belum dikelompokkan`);
      return;
    }
    setSavedJournals(list => list.map(item => (selectedFolderIds.includes(item.folderId) ? { ...item, folderId: "ungrouped" } : item)));
    setFolders(list => list.filter(folder => !selectedFolderIds.includes(folder.id)));
    if (selectedFolderIds.includes(activeFolderId)) setActiveFolderId("all");
    exitFolderSelect();
    showToast(`${count} folder dihapus, jurnal dipindahkan ke Belum dikelompokkan`);
  };

  const confirmDeleteSelectedFolders = () => {
    deleteSelectedFolders();
    setHapusFolderModalOpen(false);
  };

  const createFolder = (name: string) => {
    const id = `folder-${Date.now()}`;
    if (collectionTab === "review") {
      setLiteratureFolders(list => [...list, { id, name }]);
      setActiveLiteratureFolderId(id);
    } else if (collectionTab === "map") {
      setMapFolders(list => [...list, { id, name }]);
      setActiveMapFolderId(id);
    } else {
      setFolders(list => [...list, { id, name }]);
      setActiveFolderId(id);
    }
    setDesktopStage("home");
    setMobileSearchStage("home");
    setView("collection");
    showToast(`Folder ${name} dibuat`);
  };

  const startSearching = () => {
    setDesktopStage("home");
    setMobileSearchStage("home");
    setView("home");
  };

  const changeView = (next: JournalView) => {
    setView(next);
    setDesktopStage("home");
    setMobileSearchStage("home");
    setMobileNavHidden(false);
  };

  useEffect(() => {
    if (mobileSearchStage !== "loading") {
      setIsLongLoading(false);
      setShowSlowSearchPopup(false);
      return;
    }
    const isSlow = (searchSubmittedQuery || query).trim() === "12345" && searchType === "journal";
    const duration = isSlow ? 20000 : 2400;

    let subtextTimer: number | undefined;
    if (isSlow) {
      setShowSlowSearchPopup(false);
      setIsLongLoading(false);
      subtextTimer = window.setTimeout(() => {
        setIsLongLoading(true);
        setShowSlowSearchPopup(true);
      }, 3500);
    } else {
      setIsLongLoading(false);
      setShowSlowSearchPopup(false);
    }

    const timer = window.setTimeout(() => {
      setMobileSearchStage("results");
      setIsLongLoading(false);
      setShowSlowSearchPopup(false);
    }, duration);

    return () => {
      window.clearTimeout(timer);
      if (subtextTimer) window.clearTimeout(subtextTimer);
      setShowSlowSearchPopup(false);
    };
  }, [mobileSearchStage]);

  useEffect(() => {
    setMobileNavHidden(false);
    lastMobileScrollY.current = 0;
  }, [view, mobileSearchStage]);

  const handleMobileScroll = (event: UIEvent<HTMLElement>) => {
    if (mobileProfileMenuOpen) setMobileProfileMenuOpen(false);
    if (mobileCollectionMenuOpen) setMobileCollectionMenuOpen(false);
    const y = event.currentTarget.scrollTop;
    const delta = y - lastMobileScrollY.current;
    if (y < 24 || Math.abs(delta) > 120) setMobileNavHidden(false);
    else if (delta > 6) setMobileNavHidden(true);
    else if (delta < -6) setMobileNavHidden(false);
    lastMobileScrollY.current = y;
  };

  useEffect(() => {
    if (!mobileProfileMenuOpen) return;
    const handleScrollOrTouch = () => setMobileProfileMenuOpen(false);
    window.addEventListener("scroll", handleScrollOrTouch, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", handleScrollOrTouch, { capture: true });
  }, [mobileProfileMenuOpen]);

  useEffect(() => {
    if (desktopStage !== "loading") {
      setIsLongLoading(false);
      setShowSlowSearchPopup(false);
      return;
    }
    const isSlow = (searchSubmittedQuery || query).trim() === "12345" && searchType === "journal";
    const duration = isSlow ? 20000 : 2400;

    let subtextTimer: number | undefined;
    if (isSlow) {
      setShowSlowSearchPopup(false);
      setIsLongLoading(false);
      subtextTimer = window.setTimeout(() => {
        setIsLongLoading(true);
        setShowSlowSearchPopup(true);
      }, 3500);
    } else {
      setIsLongLoading(false);
      setShowSlowSearchPopup(false);
    }

    const timer = window.setTimeout(() => {
      setDesktopStage("results");
      setIsLongLoading(false);
      setShowSlowSearchPopup(false);
    }, duration);

    return () => {
      window.clearTimeout(timer);
      if (subtextTimer) window.clearTimeout(subtextTimer);
      setShowSlowSearchPopup(false);
    };
  }, [desktopStage]);

  useEffect(() => {
    try {
      window.localStorage.setItem("alerin-jurnal-riwayat", JSON.stringify(riwayatItems));
    } catch {
      // localStorage can be unavailable in private mode
    }
  }, [riwayatItems]);

  const addRiwayat = (item: { label: string; query: string; type: RiwayatItem["type"] }) => {
    setRiwayatItems(list => {
      const exists = list.some(
        existing =>
          existing.query.trim().toLowerCase() === item.query.trim().toLowerCase() &&
          existing.type === item.type
      );
      if (exists) {
        return list;
      }
      const now = new Date();
      const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember",
      ];
      const waktu = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} • ${String(now.getHours()).padStart(2, "0")}.${String(now.getMinutes()).padStart(2, "0")}`;
      return [{ ...item, waktu }, ...list].slice(0, 12);
    });
  };

  useEffect(() => {
    if (view !== "home" || (desktopStage === "home" && mobileSearchStage === "home")) {
      setActiveRiwayatKey(null);
    }
  }, [view, desktopStage, mobileSearchStage]);

  useEffect(() => {
    if (desktopStage !== "loading" && mobileSearchStage !== "loading") return;
    if (isOpeningRiwayatRef.current) {
      isOpeningRiwayatRef.current = false;
      return;
    }
    const topic =
      searchType === "journal"
        ? searchSubmittedQuery || query.trim() || (fileName ? `Analisis file ${fileName}` : paragraph.trim().slice(0, 60))
        : searchType === "map"
          ? mapTopic.trim() || query.trim()
          : literatureTopic.trim() || query.trim();
    if (topic.trim().length < 3) return;
    setActiveRiwayatKey(`${searchType}:${topic.trim().toLowerCase()}`);
    addRiwayat({ label: topic.trim(), query: topic.trim(), type: searchType });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desktopStage, mobileSearchStage]);

  const runSearch = () => {
    setLoadingSource("search");
    if (query.trim() || paragraph.trim() || fileName) setDesktopStage("loading");
  };

  const startStructuredSearch = (type: "review" | "map") => {
    const topic = (type === "map" ? mapTopic : literatureTopic).trim();
    if (topic.length < 3) return;
    const error = validateSearchInput(topic);
    if (error && topic !== "12345") return;
    setQuery(topic);
    setSearchType(type);
    setResultMode("search");
    setLoadingSource("search");
    if (window.matchMedia("(min-width: 768px)").matches) setDesktopStage("loading");
    else setMobileSearchStage("loading");
  };

  const reviewTopicSuggestions = [
    "Tinjau literatur AI dalam pendidikan",
    "Tinjau kesehatan mental mahasiswa",
    "Tinjau pemasaran digital pada UMKM",
    "Tinjau motivasi belajar mahasiswa",
  ];

  const mapTopicSuggestions = [
    "Peta AI dalam pendidikan",
    "Peta kesehatan mental mahasiswa",
    "Peta pemasaran digital pada UMKM",
    "Peta literasi keuangan generasi Z",
  ];

  const topicSuggestions = searchType === "map" ? mapTopicSuggestions : reviewTopicSuggestions;

  const guideContent: { title: string; intro: React.ReactNode; steps: { title?: string; description: string }[] } | null =
    searchType === "review"
      ? {
          title: "Cara Kerja Literature Review",
          intro: (
            <>
              Tentukan topik penelitian sesuai fokus{" "}
              <span className="block md:inline">yang ingin Anda teliti.</span>
            </>
          ),
          steps: [
            {
              title: "Masukkan topik penelitian",
              description: "Tuliskan topik penelitian atau pilih rekomendasi dari Alerin sesuai kebutuhan Anda.",
            },
            {
              title: "Tentukan periode publikasi",
              description: "Pilih rentang tahun publikasi jurnal yang ingin digunakan sebagai referensi penelitian.",
            },
            {
              title: "Tentukan jumlah jurnal",
              description: "Pilih jumlah jurnal yang dibutuhkan untuk menyusun literatur review.",
            },
          ],
        }
      : searchType === "map"
        ? {
            title: "Cara Kerja Peta Penelitian",
            intro: (
              <>
                Tentukan topik penelitian sesuai fokus{" "}
                <span className="block md:inline">yang ingin Anda cari.</span>
              </>
            ),
            steps: [
              {
                title: "Masukkan topik penelitian",
                description: "Tuliskan topik penelitian atau pilih rekomendasi dari Alerin sesuai kebutuhan Anda.",
              },
              {
                title: "Tentukan periode publikasi",
                description: "Pilih rentang tahun publikasi jurnal yang ingin dianalisis untuk melihat perkembangan penelitian.",
              },
              {
                title: "Tentukan jumlah jurnal",
                description: "Pilih jumlah jurnal yang akan digunakan sebagai dasar penyusunan peta penelitian.",
              },
            ],
          }
        : null;

  const openRiwayatPencarian = (item: RiwayatItem) => {
    isOpeningRiwayatRef.current = true;
    setView("home");
    setQuery(item.query);
    setSearchSubmittedQuery(item.query);
    setParagraph("");
    setFileName("");
    setSearchType(item.type);
    if (item.type === "review") setLiteratureTopic(item.query);
    else if (item.type === "map") setMapTopic(item.query);
    setResultMode("search");
    setLoadingSource("history");
    setActiveRiwayatKey(`${item.type}:${item.query.trim().toLowerCase()}`);
    if (window.matchMedia("(min-width: 768px)").matches) setDesktopStage("loading");
    else setMobileSearchStage("loading");
  };

  const getLoadingTitle = (isMobile = false): React.ReactNode => {
    if (loadingSource === "history") {
      if (searchType === "review") {
        return isMobile ? (
          <>
            Membuka Literatur Review <span className="block">untuk Anda</span>
          </>
        ) : (
          "Membuka Literatur Review untuk Anda"
        );
      }
      if (searchType === "map") {
        return isMobile ? (
          <>
            Membuka Peta Penelitian <span className="block">untuk Anda</span>
          </>
        ) : (
          "Membuka Peta Penelitian untuk Anda"
        );
      }
      return isMobile ? (
        <>
          Membuka Jurnal <span className="block">untuk Anda</span>
        </>
      ) : (
        "Membuka Jurnal untuk Anda"
      );
    }
    if (loadingSource === "collection") {
      if (searchType === "review") return "Membuka Literatur Review";
      if (searchType === "map") return "Membuka Peta Penelitian";
    }
    if (searchType === "review") {
      return isMobile ? (
        <>
          Menyusun Literatur Review <span className="block">untuk Anda</span>
        </>
      ) : (
        "Menyusun Literatur Review untuk Anda"
      );
    }
    if (searchType === "map") {
      return isMobile ? (
        <>
          Menyusun Peta Penelitian <span className="block">untuk Anda</span>
        </>
      ) : (
        "Menyusun Peta Penelitian untuk Anda"
      );
    }
    if (resultMode === "analysis") return "Menganalisis Naskahmu";
    return isMobile ? (
      <>
        Menelusuri Jurnal <span className="block">untuk Anda</span>
      </>
    ) : (
      "Menelusuri Jurnal untuk Anda"
    );
  };

  const getLoadingSubtitle = () => {
    if (loadingSource === "history") {
      if (searchType === "review") return "Alerin sedang membuka literatur review berdasarkan riwayat yang Anda pilih.";
      if (searchType === "map") return "Alerin sedang membuka Peta Penelitian berdasarkan riwayat yang Anda pilih.";
      return "Alerin sedang membuka jurnal berdasarkan riwayat yang Anda pilih.";
    }
    if (loadingSource === "collection") {
      if (searchType === "review") return "Alerin sedang memuat kembali hasil tinjauan literatur yang kamu simpan.";
      if (searchType === "map") return "Alerin sedang memuat kembali peta penelitian beserta analisis yang kamu simpan.";
    }
    if (searchType === "review") return "Alerin sedang menyusun tinjauan literatur berdasarkan topik dan kriteria yang kamu isi.";
    if (searchType === "map") return "Alerin sedang mengolah dan menyusun peta penelitian beserta analisisnya.";
    if (resultMode === "analysis") return "Alerin sedang membaca dokumenmu dan menyiapkan temuan serta rekomendasi sitasi.";
    return "Alerin sedang mencari jurnal berdasarkan informasi yang Anda berikan.";
  };

  const queryError = useMemo(() => validateSearchInput(query), [query]);
  const activeTopicInput = searchType === "map" ? mapTopic : literatureTopic;
  const topicError = useMemo(() => validateSearchInput(activeTopicInput), [activeTopicInput]);

  const canSearch = (query.trim().length >= 3 && !queryError) || query.trim() === "12345";
  const analysisReady = Boolean(fileName) || paragraph.trim().length >= 5;
  const quickActive = query.trim().length > 0;
  const referenceActive = paragraph.trim().length > 0 || Boolean(fileName);
  const primaryDisabled = quickActive ? !canSearch : !analysisReady;

  const renderKutipanUnderline = (text: string) => {
    const parts = text.split(/(keputusan pembelian|seluruh kelompok usia)/g);
    return parts.map((part, index) =>
      part === "keputusan pembelian" || part === "seluruh kelompok usia" ? (
        <span key={index} className="border-b-2 border-red-500 font-medium text-slate-900">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (quickActive || paragraph.trim().length > 0) return;
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileSizeLabel(`${(file.size / 1048576).toFixed(1)} MB`);
    setFileObject(file);
    if (fileUrl) {
      try {
        URL.revokeObjectURL(fileUrl);
      } catch {}
    }
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    event.target.value = "";
  };

  const handleOpenUploadedFile = () => {
    let targetUrl = fileUrl;
    if (!targetUrl && fileObject) {
      targetUrl = URL.createObjectURL(fileObject);
      setFileUrl(targetUrl);
    }
    if (!targetUrl && fileName) {
      const dummyContent = `Pratinjau Dokumen: ${fileName}\n\nDokumen ini berhasil diunggah di Alerin Jurnal.`;
      const blob = new Blob([dummyContent], { type: "text/plain;charset=utf-8" });
      targetUrl = URL.createObjectURL(blob);
    }
    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleTogglePinRiwayat = (index: number) => {
    setRiwayatItems(list => {
      const target = list[index];
      if (!target) return list;
      const isPinnedNow = !target.pinned;
      showToast(isPinnedNow ? "Riwayat disematkan ke atas" : "Sematan riwayat dilepas");
      const updatedTarget: RiwayatItem = { ...target, pinned: isPinnedNow };
      const remaining = list.filter((_, i) => i !== index);

      if (isPinnedNow) {
        // Taruh di paling atas
        return [updatedTarget, ...remaining];
      } else {
        // Taruh di awal kelompok riwayat yang tidak disematkan
        const pinned = remaining.filter(item => item.pinned);
        const unpinned = remaining.filter(item => !item.pinned);
        return [...pinned, updatedTarget, ...unpinned];
      }
    });
  };

  return (
    <div
      className={`fixed inset-0 z-[300] flex h-dvh w-full overflow-hidden font-['Inter:Regular'] ${
        isDarkMode
          ? "alerin-dark-theme bg-[#0b0f19] text-slate-100 dark"
          : "bg-[#f4f7fb] text-[#0f172a] md:bg-[#f3f6f9]"
      }`}
    >
      <Sidebar
        view={view}
        onView={changeView}
        onUpgrade={() => setUpgradeOpen(true)}
        onOpenRiwayat={openRiwayatPencarian}
        riwayatItems={riwayatItems}
        onRenameRiwayat={(index, label) => setRiwayatItems(list => list.map((item, i) => (i === index ? { ...item, label } : item)))}
        onDeleteRiwayat={index => setRiwayatItems(list => list.filter((_, i) => i !== index))}
        onTogglePinRiwayat={handleTogglePinRiwayat}
        activeRiwayatKey={activeRiwayatKey}
        onSelectRiwayatKey={setActiveRiwayatKey}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="relative z-[360] flex h-[65px] shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] backdrop-blur-md md:hidden">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center">
              <img src={`${mobileAssets}/90eed.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-['Plus_Jakarta_Sans:Bold'] text-base font-bold leading-5 text-slate-900">Alerin Jurnal</p>
              <div className="mt-0.5 flex items-center">
                <button
                  type="button"
                  onClick={() => setUpgradeOpen(true)}
                  title="Lihat Pilihan Paket"
                  className="inline-flex items-center gap-1 rounded-full bg-[#1e264b] hover:bg-[#2a3466] active:scale-95 px-1.5 py-0.5 font-['Inter:Bold'] text-[7.5px] font-bold text-white leading-none cursor-pointer transition-all shadow-xs"
                >
                  Plus
                  <PlusBadgeIcon size={9} />
                </button>
              </div>
            </div>
          </div>
          <div className="relative flex items-center gap-2">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={mobileProfileMenuOpen}
              onClick={() => setMobileProfileMenuOpen(open => !open)}
              title="Menu Profil"
              className="relative rounded-full focus:outline-none transition-transform active:scale-95"
            >
              <img src={`${mobileAssets}/48c68.png`} alt="Profil" className="h-[38px] w-[38px] rounded-full object-cover ring-2 ring-transparent focus:ring-sky-400" />
            </button>

            {mobileProfileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-[365]"
                  onClick={() => setMobileProfileMenuOpen(false)}
                  aria-hidden="true"
                />
                <div
                  role="menu"
                  className={`absolute right-0 top-[calc(100%+10px)] z-[370] w-60 rounded-2xl border p-2 shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-colors animate-in fade-in zoom-in-95 duration-150 ${
                    isDarkMode
                      ? "border-slate-700 bg-slate-900 text-slate-100"
                      : "border-slate-200/90 bg-white text-slate-700"
                  }`}
                >
                  {/* Ekor panah balon percakapan (speech bubble pointer) mengarah ke avatar profil */}
                  <div
                    className={`pointer-events-none absolute -top-[7px] right-3.5 h-3.5 w-3.5 rotate-45 rounded-tl-[2px] border-l border-t shadow-[-2px_-2px_4px_rgba(0,0,0,0.02)] transition-colors ${
                      isDarkMode
                        ? "border-slate-700 bg-slate-900"
                        : "border-slate-200/90 bg-white"
                    }`}
                    aria-hidden="true"
                  />

                  {/* Header info user */}
                  <div className={`flex items-center gap-2.5 px-3 py-2 border-b ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
                    <img src={`${mobileAssets}/48c68.png`} alt="Raka Aditya" className="h-8 w-8 rounded-full object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`truncate font-['Inter:Semi_Bold'] text-xs font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>Raka Aditya</p>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileProfileMenuOpen(false);
                            setUpgradeOpen(true);
                          }}
                          title="Lihat Pilihan Paket"
                          className="inline-flex items-center gap-0.5 rounded-full border border-blue-200 bg-indigo-950 px-1.5 py-0.5 font-['Inter:Bold'] text-[7.5px] font-bold text-white hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                        >
                          Plus
                        </button>
                      </div>
                      <p className="truncate text-[10.5px] text-slate-400">Manajemen · Semester 6</p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        window.alert("Profil Raka Aditya dibuka.");
                        setMobileProfileMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        isDarkMode ? "text-slate-200 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Profil
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={toggleDarkMode}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        isDarkMode ? "text-slate-200 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isDarkMode ? (
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                          </svg>
                        ) : (
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                          </svg>
                        )}
                        <span>{isDarkMode ? "Mode Terang" : "Mode Gelap"}</span>
                      </div>
                      <span className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${isDarkMode ? "bg-[#00629b]" : "bg-slate-200"}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${isDarkMode ? "translate-x-4.5" : "translate-x-0.5"}`} />
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        <main id="alrin-main-scroll-container" onScroll={handleMobileScroll} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-28 pt-7 md:p-7">
          {mobileSearchStage === "loading" && view === "home" && (
            <div className="fixed inset-x-0 bottom-[68px] top-[65px] z-[305] flex flex-col items-center justify-center overflow-hidden bg-[#f4f7fb] px-6 md:hidden">
              <SearchLoader />
              <h1 className="text-center font-['Plus_Jakarta_Sans:ExtraBold'] text-[21px] font-extrabold tracking-[-0.5px] text-[#313131]">
                {getLoadingTitle(true)}
              </h1>
              <p className="mt-2 max-w-[310px] animate-pulse text-center text-xs leading-5 text-[#71717a] transition-all duration-300">
                {getLoadingSubtitle()}
              </p>
            </div>
          )}

          {mobileSearchStage === "results" && view === "home" && (
            <div id="mobile-results-scroll-container" onScroll={handleMobileScroll} className={`fixed inset-x-0 top-[65px] z-[305] overflow-y-auto overflow-x-hidden bg-[#f4f7fb] px-4 pt-4 transition-[bottom] duration-300 ease-out md:hidden ${mobileNavHidden ? "bottom-0 pb-16" : "bottom-[68px] pb-6"} ${searchType !== "map" && searchType !== "review" && (searchSubmittedQuery || query).trim() === "12345" ? "flex flex-col" : ""}`}>
              <div className={`mx-auto w-full max-w-md ${searchType !== "map" && searchType !== "review" && (searchSubmittedQuery || query).trim() === "12345" ? "my-auto py-2" : ""}`}>
                {searchType === "map" ? (
                  <div className="mt-1">
                    <DesktopResearchMap
                      query={query}
                      onBack={() => {
                        setMobileSearchStage("home");
                        setSearchType("journal");
                      }}
                      onSave={saveResearchMap}
                      saved={savedMaps.some(item => item.topic.toLowerCase() === (query.trim() || mapTopic.trim()).toLowerCase())}
                      onOpenRingkasan={() => setRingkasanOpen(true)}
                      onOpenAbstrak={() => setAbstrakOpen(true)}
                      onOpenSitasi={() => setSitasiOpen(true)}
                      onShowToast={showToast}
                      onUpgrade={() => setUpgradeOpen(true)}
                      openedJournals={openedLiteratureJournals}
                      onOpenJournal={handleOpenLiteratureJournal}
                    />
                  </div>
                ) : searchType === "review" ? (
                  <div className="mt-2">
                    <MobileLiteratureReview
                      query={query || literatureTopic}
                      onBack={() => {
                        setMobileSearchStage("home");
                        setSearchType("journal");
                      }}
                      onOpenRingkasan={() => setRingkasanOpen(true)}
                      onOpenAbstrak={() => setAbstrakOpen(true)}
                      onOpenSitasi={() => setSitasiOpen(true)}
                      onSave={saveLiteratureReview}
                      saved={savedLiterature.some(item => item.topic.toLowerCase() === (query.trim() || literatureTopic.trim()).toLowerCase())}
                      onShowToast={showToast}
                      onUpgrade={() => setUpgradeOpen(true)}
                      openedJournals={openedLiteratureJournals}
                      onOpenJournal={handleOpenLiteratureJournal}
                    />
                  </div>
                ) : (searchSubmittedQuery || query).trim() === "12345" ? (
                  <div className="w-full">
                    {/* Mobile Empty Card */}
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-50 text-[#00629b] ring-6 ring-sky-50/60 shadow-xs">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="11" cy="11" r="8" />
                          <path d="M21 21l-4.35-4.35" />
                          <path d="M8.5 8.5l5 5" />
                          <path d="M13.5 8.5l-5 5" />
                        </svg>
                      </div>

                      <h2 className="mt-4 font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold tracking-tight text-slate-900">
                        Tidak ada jurnal yang ditemukan
                      </h2>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                        Alerin tidak menemukan jurnal yang cocok dengan kata kunci{" "}
                        <span className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">&quot;12345&quot;</span>. Coba periksa kembali ejaan atau gunakan topik penelitian yang lebih spesifik.
                      </p>

                      <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200/80 p-4 text-left">
                        <div className="flex items-center gap-1.5 mb-2.5">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
                          </svg>
                          <h3 className="text-xs font-bold text-slate-900">Saran pencarian:</h3>
                        </div>
                        <ul className="space-y-2 text-xs text-slate-600">
                          <li className="flex items-start gap-2">
                            <span className="text-sky-600 font-bold">•</span>
                            <span>Gunakan kata kunci topik, judul, atau penulis (contoh: <em>keputusan pembelian</em>).</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-sky-600 font-bold">•</span>
                            <span>Gunakan istilah bahasa Indonesia atau bahasa Inggris.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-sky-600 font-bold">•</span>
                            <span>Hindari angka acak atau simbol khusus.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-sky-600 font-bold">•</span>
                            <span>Gunakan pencarian paragraf untuk pencarian berbasis konteks teks.</span>
                          </li>
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setMobileSearchStage("home");
                          setSearchType("journal");
                        }}
                        className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all active:scale-[0.98]"
                      >
                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 6H2M5.5 2.5L2 6l3.5 3.5" />
                        </svg>
                        Coba Cari Ulang
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {resultMode === "analysis" && (
                  <>
                    <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006194" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <path d="M14 2v6h6" />
                              <path d="M16 13H8" />
                              <path d="M16 17H8" />
                            </svg>
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-['Plus_Jakarta_Sans:SemiBold'] text-sm font-semibold">{fileName || "Skripsi_Nadia_Final.docx"}</p>
                            <p className="mt-0.5 text-[11px] text-[#94a3b8]">42 halaman · 126 sitasi diperiksa</p>
                          </div>
                        </div>
                        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-600 outline outline-1 outline-sky-600/40">
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M1 4l2.5 2.5L9 1" />
                          </svg>
                          Selesai
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-4 gap-1.5">
                        {[
                          { value: "7", label: "Temuan", box: "bg-slate-50 outline-slate-100", valueTone: "text-blue-600", labelTone: "text-slate-500" },
                          { value: "3", label: "Bermasalah", box: "bg-rose-50 outline-rose-100", valueTone: "text-rose-600", labelTone: "text-rose-700" },
                          { value: "2", label: "Kurang Kuat", box: "bg-slate-50 outline-slate-100", valueTone: "text-slate-700", labelTone: "text-slate-500" },
                          { value: "2", label: "Ref. Lemah", box: "bg-slate-50 outline-slate-100", valueTone: "text-slate-700", labelTone: "text-slate-500" },
                        ].map(item => (
                          <div key={item.label} className={`rounded-2xl p-2 text-center outline outline-1 ${item.box}`}>
                            <p className={`text-lg font-extrabold leading-6 ${item.valueTone}`}>{item.value}</p>
                            <p className={`mt-0.5 text-[9px] font-medium leading-3 ${item.labelTone}`}>{item.label}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-xl font-bold text-slate-900">Temuan {temuanIndex} dari 7</h2>
                          <span className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 outline outline-1 outline-blue-100">
                            Halaman {temuanAnalisis[temuanIndex - 1].halaman}
                          </span>
                        </div>
                        <div className="flex shrink-0 gap-1.5">
                          <button
                            type="button"
                            aria-label="Temuan sebelumnya"
                            onClick={() => setTemuanIndex(index => Math.max(1, index - 1))}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-base text-slate-400 outline outline-1 outline-slate-200"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            aria-label="Temuan berikutnya"
                            onClick={() => setTemuanIndex(index => Math.min(7, index + 1))}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-base text-slate-700 outline outline-1 outline-slate-200"
                          >
                            ›
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 outline outline-1 outline-rose-200">
                        <p className="text-xs font-bold uppercase tracking-wide text-rose-700">⚠ {temuanAnalisis[temuanIndex - 1].badge}</p>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm font-bold text-slate-700">Bagian yang perlu diperbaiki:</p>
                        <blockquote className="mt-2 rounded-2xl bg-slate-50 p-4 text-sm font-medium leading-6 text-slate-700 outline outline-1 outline-slate-200">
                          {renderKutipanUnderline(temuanAnalisis[temuanIndex - 1].kutipan)}
                        </blockquote>
                      </div>

                      <div className="mt-4 rounded-2xl bg-rose-50/50 p-4 outline outline-1 outline-rose-100">
                        <p className="text-base font-bold text-rose-800">Mengapa sitasi ini bermasalah?</p>
                        <ul className="mt-2.5 space-y-2 text-sm leading-6 text-slate-700">
                          {temuanAnalisis[temuanIndex - 1].alasan.map(alasan => (
                            <li key={alasan} className="flex gap-2">
                              <span>•</span>
                              <span>{alasan}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm font-bold text-sky-900">✦ Saran perbaikan Alerin:</p>
                        <div className="mt-2 rounded-2xl bg-sky-50/60 p-4 outline outline-1 outline-sky-200/80">
                          <p className="text-sm leading-6 text-sky-950">{temuanAnalisis[temuanIndex - 1].saran}</p>
                          <div className="mt-3 flex items-center gap-2 border-t border-sky-100 pt-2.5">
                            <span className="text-xs font-semibold text-sky-700">OpenAlex +4 verifikasi</span>
                          </div>
                        </div>
                      </div>
                    </section>
                  </>
                )}

                <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-sky-700" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 1.5h5.5L12 4v10.5H4z" />
                        <path d="M9.5 1.5V4H12" />
                        <path d="M6 8h4M6 11h4" />
                      </svg>
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">Ringkasan Hasil Pencarian</h2>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-neutral-700">Alerin menelusuri dan menyaring jurnal berdasarkan relevansi dengan pencarianmu untuk menampilkan hasil yang paling sesuai.</p>
                  <div className="mt-3 flex flex-col items-start gap-2">
                    <div className="flex w-full min-w-0 max-w-full items-start gap-2.5 rounded-xl bg-slate-100 px-3.5 py-2.5 text-xs leading-5 text-slate-700">
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#0369a1" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0">
                        <circle cx="7" cy="7" r="4.5" />
                        <path d="M10.4 10.4L14 14" />
                      </svg>
                      <p className="min-w-0 flex-1 break-words leading-relaxed">
                        <span className="font-medium text-slate-900">Hasil Pencarian Dari: </span>
                        <span className="font-semibold text-slate-900">{searchSubmittedQuery || query.trim() || paragraph.trim() || "interaksi parasosial"} </span>
                        {(searchSubmittedQuery || query.trim()) && !isDoiFormat(searchSubmittedQuery || query.trim()) && (
                          <span className="inline-flex items-center align-middle rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-[#00629b] whitespace-nowrap ml-1">
                            {quickSearchCategory === "penulis" ? "Penulis" : quickSearchCategory === "judul" ? "Judul" : "Topik"}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="inline-flex min-h-[32px] w-fit max-w-full items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs text-slate-700">
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#0369a1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
                        <rect x="2" y="3" width="12" height="11" rx="2" />
                        <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
                      </svg>
                      <span>
                        <span className="font-medium text-slate-900">Tahun: </span>
                        <span className="font-semibold text-slate-900">2024–2026</span>
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-1 sm:gap-2.5 rounded-2xl bg-slate-100 px-2 py-4 text-center">
                    {[["4,2 jt", "Jurnal Tersedia"], ["50", "Sesuai Filter"], ["20", "Paling Relevan"]].map(([value, label]) => (
                      <div key={value} className="min-w-0 px-0.5">
                        <p className="text-2xl font-bold text-sky-700">{value}</p>
                        <p className="mt-1 text-[11.5px] min-[360px]:text-xs sm:text-[13px] font-semibold leading-tight text-slate-600 whitespace-nowrap">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setTabelOpen(true)}
                      className="flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-sky-700 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sky-800 active:scale-95"
                    >
                      Tabel penelitian terdahulu
                    </button>
                  </div>
                </section>

                <div className="mt-6 flex items-center gap-2.5 px-1">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-[#00629b]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                      <path d="M5.5 4h8.5M5.5 8h8.5M5.5 12h8.5" />
                      <circle cx="2.5" cy="4" r="1" fill="currentColor" stroke="none" />
                      <circle cx="2.5" cy="8" r="1" fill="currentColor" stroke="none" />
                      <circle cx="2.5" cy="12" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </span>
                  <h3 className="font-['Plus_Jakarta_Sans:Bold'] text-[15px] sm:text-base font-bold text-slate-900 leading-snug tracking-[-0.2px]">
                    Rekomendasi yang paling relevan
                  </h3>
                </div>

                <div className="mt-3.5 space-y-3.5">
                  {resultMode === "analysis" && (
                    <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm">
                      <span className="text-xs font-bold text-slate-700">
                        Slide {mobileJournalSlideIndex + 1} dari {mobileJournals.length}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          aria-label="Slide rekomendasi sebelumnya"
                          disabled={mobileJournalSlideIndex === 0}
                          onClick={() => setMobileJournalSlideIndex(idx => Math.max(0, idx - 1))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700 disabled:opacity-40"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          aria-label="Slide rekomendasi berikutnya"
                          disabled={mobileJournalSlideIndex === mobileJournals.length - 1}
                          onClick={() => setMobileJournalSlideIndex(idx => Math.min(mobileJournals.length - 1, idx + 1))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700 disabled:opacity-40"
                        >
                          ›
                        </button>
                      </div>
                    </div>
                  )}

                  {isMobileListRefreshing ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 rounded-xl bg-sky-50 px-3.5 py-3 text-xs font-semibold text-sky-800 border border-sky-200/80 animate-pulse">
                        <svg className="h-4 w-4 animate-spin text-sky-600 shrink-0" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Alerin sedang memperbarui rekomendasi dan menyusun kembali urutan relevansi...</span>
                      </div>
                      {[1, 2, 3].map(n => (
                        <article key={n} className="rounded-2xl bg-white p-5 shadow-sm outline outline-1 outline-sky-200 animate-pulse">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-24 rounded bg-slate-200" />
                            <div className="h-5 w-16 rounded bg-sky-100" />
                          </div>
                          <div className="mt-3.5 h-6 w-5/6 rounded bg-slate-200" />
                          <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
                          <div className="mt-1.5 h-3.5 w-1/3 rounded bg-slate-100" />
                        </article>
                      ))}
                    </div>
                  ) : (
                    (resultMode === "analysis"
                      ? [mobileJournals[mobileJournalSlideIndex] ?? mobileJournals[0]]
                      : mobileJournals
                    ).map((result, index) => (
                      <MobileJournalResultCard
                        key={result.id}
                        result={result}
                        index={index}
                        saved={savedIds.includes(result.id)}
                        onToggleSave={() => toggleSaveJournal(result)}
                        onAnalisis={() => setRingkasanOpen(true)}
                        onSitasi={() => setSitasiOpen(true)}
                        onAbstrak={() => setAbstrakOpen(true)}
                        onDiskusikan={onDiskusikan}
                        onReplaceJournal={handleMobileReplaceJournal}
                      />
                    ))
                  )}
                </div>
                  </>
                )}
              </div>
            </div>
          )}

          {desktopStage === "loading" && (
            <div className="hidden min-h-[70vh] flex-col items-center justify-center md:flex">
              <SearchLoader />
              <h1 className="mt-5 text-center text-2xl font-extrabold tracking-[-0.5px] text-slate-800">
                {getLoadingTitle()}
              </h1>
              <p className="mt-2 max-w-md animate-pulse text-center text-sm leading-6 text-slate-500 transition-all duration-300">
                {getLoadingSubtitle()}
              </p>
            </div>
          )}

          {desktopStage === "results" &&
            (searchType === "review" ? (
              <DesktopLiteratureReview
                query={query || literatureTopic}
                onBack={() => setDesktopStage("home")}
                onOpenSitasi={() => setSitasiOpen(true)}
                onOpenRingkasan={() => setRingkasanOpen(true)}
                onOpenAbstrak={() => setAbstrakOpen(true)}
                onSave={saveLiteratureReview}
                saved={savedLiterature.some(item => item.topic.toLowerCase() === (query.trim() || literatureTopic.trim()).toLowerCase())}
                onShowToast={showToast}
                onUpgrade={() => setUpgradeOpen(true)}
                openedJournals={openedLiteratureJournals}
                onOpenJournal={handleOpenLiteratureJournal}
              />
            ) : searchType === "map" ? (
              <DesktopResearchMap
                query={query}
                onBack={() => setDesktopStage("home")}
                onSave={saveResearchMap}
                saved={savedMaps.some(item => item.topic.toLowerCase() === (query.trim() || mapTopic.trim()).toLowerCase())}
                onOpenRingkasan={() => setRingkasanOpen(true)}
                onOpenAbstrak={() => setAbstrakOpen(true)}
                onOpenSitasi={() => setSitasiOpen(true)}
                onShowToast={showToast}
                onUpgrade={() => setUpgradeOpen(true)}
                openedJournals={openedLiteratureJournals}
                onOpenJournal={handleOpenLiteratureJournal}
              />
            ) : (
              <DesktopSearchResults
                query={searchSubmittedQuery || query.trim() || paragraph.trim()}
                onBack={() => {
                  setDesktopStage("home");
                  if (query.trim() && paragraph.trim() && query.trim() === paragraph.trim()) {
                    setQuery("");
                  }
                }}
                savedIds={savedIds}
                onToggleSave={toggleSaveJournal}
                onOpenRingkasan={() => setRingkasanOpen(true)}
                onOpenTabel={() => setTabelOpen(true)}
                onOpenSitasi={() => setSitasiOpen(true)}
                onOpenAbstrak={() => setAbstrakOpen(true)}
                onDiskusikan={onDiskusikan}
                onShowToast={showToast}
                analysis={resultMode === "analysis"}
                fileName={fileName}
                quickSearchCategory={quickSearchCategory}
              />
            ))}

          {desktopStage !== "home" ? null : view === "home" ? (
            <div className="mx-auto grid w-full min-w-0 max-w-[1160px] grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <h1 className="text-center font-['Plus_Jakarta_Sans:ExtraBold'] text-2xl font-extrabold leading-[33px] tracking-[-0.6px] text-[#0f172a] md:text-left md:text-[26px] md:leading-9 md:tracking-normal md:text-[#003859]">
                  {searchType === "review" ? (
                    "Buat literatur review dari jurnal yang paling relevan"
                  ) : searchType === "map" ? (
                    <>
                      Buat peta penelitian sesuai <br className="md:hidden" />yang Anda butuhkan
                    </>
                  ) : (
                    <>
                      Temukan jurnal yang tepat <br className="md:hidden" />sesuai kebutuhanmu
                    </>
                  )}
                </h1>
                <p className="mt-2 text-center font-['Plus_Jakarta_Sans:Regular'] text-sm leading-[21px] text-[#232323] md:text-left md:text-base md:leading-6 md:text-[#475569]">
                  {searchType === "review" ? (
                    <>
                      Alerin membantu mencari jurnal relevan <br className="md:hidden" />untuk memproses literature review.
                    </>
                  ) : searchType === "map" ? (
                    <>
                      Kenali topik yang saling berkaitan, <br className="md:hidden" />banyak diteliti, serta perkembangannya.
                    </>
                  ) : (
                    <>
                      Cari dengan kata kunci atau biarkan <br className="md:hidden" />Alerin memahami paragraf dan dokumen.
                    </>
                  )}
                </p>

                <div
                  role="tablist"
                  aria-label="Jenis pencarian"
                  className="mt-5 grid grid-cols-3 items-stretch gap-1 rounded-2xl bg-white p-1 sm:p-1.5 outline outline-1 outline-slate-200/90 shadow-2xs md:mt-6"
                >
                  {(
                    [
                      ["journal", "Cari Jurnal"],
                      ["review", "Literatur"],
                      ["map", "Peta Penelitian"],
                    ] as const
                  ).map(([type, label]) => {
                    const active = searchType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setSearchType(type)}
                        className={`flex min-h-[44px] h-full w-full items-center justify-center gap-1 min-[370px]:gap-1.5 rounded-xl px-1 min-[360px]:px-1.5 py-2.5 text-[11.5px] font-semibold tracking-[-0.1px] transition-all sm:gap-2 sm:px-2 sm:text-xs md:min-h-0 md:px-4 md:py-2.5 md:text-sm md:tracking-normal ${
                          active
                            ? "bg-[#00629b] text-white shadow-sm md:bg-sky-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        {type === "journal" ? (
                          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 h-[15px] w-[15px] md:h-4 md:w-4">
                            <circle cx="7" cy="7" r="4.5" />
                            <path d="M10.5 10.5L14 14" />
                          </svg>
                        ) : type === "review" ? (
                          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 h-[15px] w-[15px] md:h-4 md:w-4">
                            <path d="M2.5 3.5h4.2c.7 0 1.3.6 1.3 1.3v8.7c0-.7-.6-1.3-1.3-1.3H2.5z" />
                            <path d="M13.5 3.5H9.3c-.7 0-1.3.6-1.3 1.3v8.7c0-.7.6-1.3 1.3-1.3h4.2z" />
                          </svg>
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 h-[15px] w-[15px] md:h-4 md:w-4">
                            <path d="M1.5 3.5l4-1.5 5 1.5 4-1.5v10l-4 1.5-5-1.5-4 1.5z" />
                            <path d="M5.5 2v10M10.5 3.5v10" />
                          </svg>
                        )}
                        <span className="text-center leading-tight whitespace-nowrap">
                          {type === "review" ? (
                            <>
                              Literatur<span className="hidden md:inline"> Review</span>
                            </>
                          ) : (
                            label
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {searchType === "review" || searchType === "map" ? (
                  <section className="mt-4 w-full min-w-0 max-w-full rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:mt-5 md:p-6">
                    <h2 className="text-center font-['Plus_Jakarta_Sans:Bold'] text-[17px] font-bold text-slate-900 md:text-left md:text-base">Topik penelitian</h2>
                    <label className={`mt-3 flex min-w-0 items-center gap-2 rounded-xl border px-3 py-3 md:px-4 transition-colors ${
                      topicError
                        ? "border-red-300 bg-red-50/20 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100"
                        : "border-slate-200 bg-slate-50/80 md:bg-white focus-within:border-sky-600 focus-within:ring-2 focus-within:ring-sky-100"
                    }`}>
                      <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke={topicError ? "#ef4444" : "#94a3b8"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                        <circle cx="7" cy="7" r="4.5" />
                        <path d="M10.5 10.5L14 14" />
                      </svg>
                      <input
                        value={searchType === "map" ? mapTopic : literatureTopic}
                        onChange={event => {
                          const val = capitalizeFirstLetter(event.target.value);
                          if (searchType === "map") setMapTopic(val);
                          else setLiteratureTopic(val);
                        }}
                        onKeyDown={event => {
                          if (event.key === "Enter" && (!topicError || (searchType === "map" ? mapTopic : literatureTopic).trim() === "12345")) {
                            startStructuredSearch(searchType);
                          }
                        }}
                        placeholder="Ketik Topik Penelitan Anda"
                        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                      />
                      {(searchType === "map" ? mapTopic : literatureTopic) && (
                        <button
                          type="button"
                          aria-label="Hapus topik"
                          onClick={() => {
                            if (searchType === "map") setMapTopic("");
                            else setLiteratureTopic("");
                          }}
                          className="shrink-0 rounded-full p-1 text-slate-400 hover:bg-slate-100"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                            <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
                          </svg>
                        </button>
                      )}
                    </label>

                    {topicError && (
                      <div
                        role="alert"
                        className="mt-2.5 rounded-xl border border-red-200/90 bg-red-50/80 px-3.5 py-2.5 text-xs font-medium text-red-600 shadow-2xs transition-all animate-in fade-in duration-200"
                      >
                        {topicError}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (searchType === "map") {
                          setMapTopic("Peta AI dan motivasi belajar mahasiswa");
                        } else {
                          setLiteratureTopic("Tinjau literatur tentang literasi keuangan");
                        }
                      }}
                      className="mt-3 flex w-full flex-col items-start gap-0.5 rounded-xl border border-sky-200/70 bg-sky-50/80 px-3 py-2.5 text-left transition-all hover:bg-sky-100/70 active:scale-[0.99] cursor-pointer md:flex-row md:items-center md:gap-1.5 md:border-transparent md:bg-sky-50 md:text-xs md:leading-5"
                    >
                      <span className="font-['Plus_Jakarta_Sans:Bold'] text-xs font-bold text-[#00629b] md:text-sky-800">Contoh:</span>
                      <span className="text-[12px] leading-5 tracking-[-0.1px] text-slate-700 md:text-xs md:tracking-normal md:text-sky-800">
                        <span className="inline md:hidden">
                          {searchType === "review" ? (
                            <>
                              Tinjau literatur tentang{" "}
                              <span className="whitespace-nowrap">literasi keuangan.</span>
                            </>
                          ) : (
                            <>
                              Peta AI dan motivasi{" "}
                              <span className="whitespace-nowrap">belajar mahasiswa.</span>
                            </>
                          )}
                        </span>
                        <span className="hidden md:inline">
                          {searchType === "review"
                            ? "Tinjau literatur tentang literasi keuangan."
                            : "Peta AI dan motivasi belajar mahasiswa."}
                        </span>
                      </span>
                    </button>

                    <div className="mt-4 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2">
                      <label className="block min-w-0">
                        <span className="font-['Plus_Jakarta_Sans:SemiBold'] text-xs font-semibold text-slate-700">Periode publikasi</span>
                        <span className="mt-1.5 flex items-center gap-2">
                          <input
                            value={reviewYearFrom}
                            onChange={event => {
                              const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
                              if (digits.length === 4 && Number(digits) > 2026) {
                                setReviewYearFrom("2026");
                                return;
                              }
                              setReviewYearFrom(digits);
                            }}
                            onKeyDown={event => {
                              if (
                                !/^[0-9]$/.test(event.key) &&
                                !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(event.key) &&
                                !event.ctrlKey &&
                                !event.metaKey
                              ) {
                                event.preventDefault();
                              }
                            }}
                            onBlur={() => {
                              if (reviewYearFrom && (reviewYearFrom.length < 4 || Number(reviewYearFrom) > 2026)) {
                                setReviewYearFrom(Number(reviewYearFrom) > 2026 ? "2026" : "2020");
                              }
                            }}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={4}
                            aria-label="Tahun awal publikasi"
                            placeholder="2020"
                            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400"
                          />
                          <span className="text-sm text-slate-400">–</span>
                          <input
                            value={reviewYearTo}
                            onChange={event => {
                              const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
                              if (digits.length === 4 && Number(digits) > 2026) {
                                setReviewYearTo("2026");
                                return;
                              }
                              setReviewYearTo(digits);
                            }}
                            onKeyDown={event => {
                              if (
                                !/^[0-9]$/.test(event.key) &&
                                !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(event.key) &&
                                !event.ctrlKey &&
                                !event.metaKey
                              ) {
                                event.preventDefault();
                                return;
                              }
                              if (/^[0-9]$/.test(event.key)) {
                                const currentVal = event.currentTarget.value || "";
                                const start = event.currentTarget.selectionStart ?? currentVal.length;
                                const end = event.currentTarget.selectionEnd ?? currentVal.length;
                                const nextVal = (currentVal.slice(0, start) + event.key + currentVal.slice(end)).replace(/\D/g, "");
                                if (nextVal.length === 4 && Number(nextVal) > 2026) {
                                  event.preventDefault();
                                  setReviewYearTo("2026");
                                }
                              }
                            }}
                            onBlur={() => {
                              if (reviewYearTo && (reviewYearTo.length < 4 || Number(reviewYearTo) > 2026)) {
                                setReviewYearTo("2026");
                              }
                            }}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={4}
                            max={2026}
                            aria-label="Tahun akhir publikasi"
                            placeholder="2026"
                            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400"
                          />
                        </span>
                      </label>
                      <label className="block min-w-0">
                        <span className="font-['Plus_Jakarta_Sans:SemiBold'] text-xs font-semibold text-slate-700">Jumlah jurnal</span>
                        <span className="relative mt-1.5 block">
                          <input
                            value={reviewCount}
                            onChange={event => {
                              const raw = event.target.value.replace(/[^0-9]/g, "");
                              if (raw === "") {
                                setReviewCount("");
                                setShowReviewLimitNotice(false);
                                return;
                              }
                              const num = Number.parseInt(raw, 10);
                              if (Number.isNaN(num)) return;
                              if (num > 100) {
                                setReviewCount("100");
                                setShowReviewLimitNotice(true);
                              } else {
                                setReviewCount(String(num));
                                setShowReviewLimitNotice(false);
                              }
                            }}
                            onBlur={() => {
                              if (!reviewCount || Number(reviewCount) < 1) {
                                setReviewCount("100");
                              }
                            }}
                            inputMode="numeric"
                            maxLength={5}
                            aria-label="Jumlah jurnal"
                            placeholder="100"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-16 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400"
                          />
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">Jurnal</span>
                        </span>
                      </label>
                    </div>

                    {showReviewLimitNotice && (
                      <div className="mt-3 flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50/90 p-3 text-xs text-sky-900 shadow-2xs">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 hidden shrink-0 text-[#00629b] md:block">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <div className="min-w-0 flex-1 leading-relaxed">
                          Di <strong>Paket Plus</strong>, pencarian dibatasi maksimal <strong>100 jurnal</strong>. Ingin mencari lebih banyak?{" "}
                          <button
                            type="button"
                            onClick={() => setUpgradeOpen(true)}
                            className="font-bold text-[#00629b] underline hover:text-[#004f80] cursor-pointer inline-flex items-center gap-0.5"
                          >
                            Upgrade ke Paket Pro &rarr;
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowReviewLimitNotice(false)}
                          className="shrink-0 text-sky-600 hover:text-sky-900 p-0.5"
                          aria-label="Tutup notifikasi"
                        >
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M4 4l8 8M12 4l-8 8" />
                          </svg>
                        </button>
                      </div>
                    )}

                    <div className="mt-5">
                      <p className="font-['Plus_Jakarta_Sans:SemiBold'] text-[13px] font-semibold text-slate-800 md:text-sm">Rekomendasi topik</p>
                      <div className="mt-3 grid gap-2">
                        {topicSuggestions.map(topic => {
                          const activeTopic = searchType === "map" ? mapTopic : literatureTopic;
                          const selected = activeTopic === topic;
                          return (
                            <button
                              key={topic}
                              type="button"
                              onClick={() => {
                                if (searchType === "map") setMapTopic(topic);
                                else setLiteratureTopic(topic);
                              }}
                              aria-pressed={selected}
                              className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${selected ? "border-sky-300 bg-sky-50" : "border-slate-200 bg-white hover:border-sky-200 hover:bg-slate-50"}`}
                            >
                              <span className={`min-w-0 flex-1 text-[13px] font-medium md:text-sm ${selected ? "text-sky-800" : "text-slate-700"}`}>{topic}</span>
                              {selected && (
                                <svg width="14" height="11" viewBox="0 0 14 11" fill="none" stroke="#0070ba" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                                  <path d="M1.5 5.8l3.8 3.8L12.5 1.5" />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 pt-0 md:mt-5 md:border-t md:border-slate-100 md:pt-4 md:flex-row md:items-center md:justify-end">
                      <button
                        type="button"
                        disabled={
                          (searchType === "map" ? mapTopic : literatureTopic).trim().length < 3 ||
                          (Boolean(topicError) && (searchType === "map" ? mapTopic : literatureTopic).trim() !== "12345")
                        }
                        onClick={() => startStructuredSearch(searchType)}
                        className={`flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold text-white md:px-8 md:py-3 md:text-sm ${
                          (searchType === "map" ? mapTopic : literatureTopic).trim().length < 3 ||
                          (Boolean(topicError) && (searchType === "map" ? mapTopic : literatureTopic).trim() !== "12345")
                            ? "cursor-not-allowed bg-slate-300"
                            : searchType === "map"
                              ? "bg-[#00629b] shadow-[0px_2px_10px_0px_rgba(0,117,232,0.30)] md:bg-sky-700 cursor-pointer"
                              : "bg-[#00629b] md:bg-sky-700 cursor-pointer"
                        }`}
                      >
                        {searchType === "map" ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M1.5 3.5l4-1.5 5 1.5 4-1.5v10l-4 1.5-5-1.5-4 1.5z" />
                            <path d="M5.5 2v10M10.5 3.5v10" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M2.5 3.5h4.2c.7 0 1.3.6 1.3 1.3v8.7c0-.7-.6-1.3-1.3-1.3H2.5z" />
                            <path d="M13.5 3.5H9.3c-.7 0-1.3.6-1.3 1.3v8.7c0-.7.6-1.3 1.3-1.3h4.2z" />
                          </svg>
                        )}
                        {searchType === "map" ? "Buat Peta Penelitian" : "Buat Literature Review"}
                      </button>
                    </div>
                  </section>
                ) : (
                  <>
                <section className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:mt-5 md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-[17px] font-bold md:text-base">Pencarian cepat</h2>
                    <button
                      type="button"
                      onClick={() => setFilterOpen(true)}
                      aria-expanded={filterOpen}
                      className="flex md:hidden h-[34px] shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs active:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span className="relative h-[19.689px] w-[17.143px] shrink-0 overflow-hidden">
                        <img src="/assets/jurnal-design/quick-search/8e43d.svg" alt="" className="absolute left-[-19.689px] top-[-18.447px] max-w-none origin-top-left scale-[0.6667]" />
                      </span>
                      Filter
                      {filterApplied && (
                        <span className="flex h-4.5 w-4.5 items-center justify-center rounded-md bg-sky-100">
                          <svg width="12" height="9" viewBox="0 0 14 11" fill="none" stroke="#0070ba" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M1.5 5.8l3.8 3.8L12.5 1.5" />
                          </svg>
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="mt-3.5 flex min-w-0 items-stretch gap-2 md:mt-4 md:gap-3">
                    <label className={`flex min-h-[44px] min-w-0 flex-1 items-center gap-2 rounded-xl border px-3 py-2.5 md:px-4 transition-colors ${
                      queryError
                        ? "border-red-300 bg-red-50/20 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100"
                        : "border-slate-200 bg-slate-50/80 md:bg-white focus-within:border-sky-600 focus-within:ring-2 focus-within:ring-sky-100"
                    }`}>
                        <button
                          type="button"
                          onClick={() => {
                            if (query.trim().length < 3) return;
                            if (queryError && query.trim() !== "12345") return;
                            setSearchType("journal");
                            setResultMode("search");
                            setSearchSubmittedQuery(query.trim());
                            if (window.matchMedia("(min-width: 768px)").matches) runSearch();
                            else {
                              setLoadingSource("search");
                              setMobileSearchStage("loading");
                            }
                          }}
                          aria-label="Cari"
                          className="shrink-0 cursor-pointer p-0.5 hover:opacity-80 transition-opacity"
                        >
                          <img src="/assets/jurnal-design/quick-search/f5f78.svg" alt="" className="max-w-none origin-center scale-[0.6667]" />
                        </button>
                        <input
                          value={query}
                          onChange={event => setQuery(capitalizeFirstLetter(event.target.value))}
                          onKeyDown={event => {
                            if (event.key !== "Enter") return;
                            if (query.trim().length < 3) return;
                            if (queryError && query.trim() !== "12345") return;
                            setSearchType("journal");
                            setResultMode("search");
                            setSearchSubmittedQuery(query.trim());
                            if (window.matchMedia("(min-width: 768px)").matches) runSearch();
                            else {
                              setLoadingSource("search");
                              setMobileSearchStage("loading");
                            }
                          }}
                          placeholder={isMobile ? "Ketik topik, judul atau kata kunci lainnya" : "Ketik topik, judul, penulis, variabel, atau DOI"}
                          disabled={referenceActive}
                          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 placeholder:text-sm disabled:cursor-not-allowed disabled:text-slate-400 md:text-sm"
                        />
                        {query.trim().length > 0 && !referenceActive && (
                          <button
                            type="button"
                            aria-label="Hapus kata kunci"
                            onClick={() => setQuery("")}
                            className="shrink-0 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
                            </svg>
                          </button>
                        )}
                    </label>
                    <button
                      type="button"
                      onClick={() => setFilterOpen(true)}
                      aria-expanded={filterOpen}
                      className="hidden md:flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-slate-300 transition-colors cursor-pointer"
                    >
                      <span className="relative h-[19.689px] w-[17.143px] shrink-0 overflow-hidden">
                        <img src="/assets/jurnal-design/quick-search/8e43d.svg" alt="" className="absolute left-[-19.689px] top-[-18.447px] max-w-none origin-top-left scale-[0.6667]" />
                      </span>
                      Filter
                      {filterApplied && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-sky-100 md:h-6 md:w-6">
                          <svg width="14" height="11" viewBox="0 0 14 11" fill="none" stroke="#0070ba" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M1.5 5.8l3.8 3.8L12.5 1.5" />
                          </svg>
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Pilihan Kategori Pencarian Cepat (Topik, Judul, Penulis) - Tidak muncul jika input berupa format DOI */}
                  {query.trim().length > 0 && !isDoiFormat(query) && !referenceActive && (
                    <div className="mt-3 rounded-xl border border-slate-200/90 bg-slate-50/80 p-2.5 transition-all animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="flex items-center justify-between px-0.5 pb-2">
                        <span className="text-[12.5px] font-semibold text-slate-700 sm:text-[13px]">
                          Pilih kategori pencarian:
                        </span>
                        <span className="text-[11.5px] font-medium text-slate-500 sm:text-xs">
                          {quickSearchCategory === "topik" ? "Kategori: Topik" : quickSearchCategory === "judul" ? "Kategori: Judul" : "Kategori: Penulis"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(
                          [
                            ["topik", "Topik"],
                            ["judul", "Judul"],
                            ["penulis", "Penulis"],
                          ] as const
                        ).map(([catKey, catLabel]) => {
                          const isSelected = quickSearchCategory === catKey;
                          return (
                            <button
                              key={catKey}
                              type="button"
                              onClick={() => setQuickSearchCategory(catKey)}
                              className={`flex h-9 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer active:scale-95 ${
                                isSelected
                                  ? "bg-[#00629b] text-white shadow-2xs border border-[#00629b]"
                                  : "bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-100 hover:border-slate-300"
                              }`}
                            >
                              {isSelected && (
                                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M3.5 8.5l3 3 6-6" />
                                </svg>
                              )}
                              {catLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {queryError && (
                    <div
                      role="alert"
                      className="mt-2.5 rounded-xl border border-red-200/90 bg-red-50/80 px-3.5 py-2.5 text-xs font-medium text-red-600 shadow-2xs transition-all animate-in fade-in duration-200"
                    >
                      {queryError}
                    </div>
                  )}

                  {referenceActive && (
                    <p role="status" className="mt-3 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs leading-5 text-sky-800">
                      Pencarian cepat dinonaktifkan karena kolom pencarian melalui paragraf atau unggah file sudah terisi.
                    </p>
                  )}
                </section>

                <section className="mt-4 rounded-2xl border border-slate-200/80 bg-white px-4 py-[22px] shadow-sm md:p-6">
                  <h2 className="text-center font-['Plus_Jakarta_Sans:Bold'] text-[17px] font-bold md:text-left md:text-base">Cari rujukan dari tulisanmu</h2>
                  <p className="mx-auto mt-2 max-w-lg text-center font-['Plus_Jakarta_Sans:Regular'] text-xs leading-[19.5px] text-[#232323] md:mx-0 md:mt-1 md:max-w-none md:text-left md:text-base md:leading-6 md:text-[#475569]">Masukkan kalimat atau paragraf untuk memeriksa keakuratan sitasi dan menemukan referensi. Alerin akan merekomendasikan referensi jurnal yang lebih sesuai.</p>
                  <div className="mt-5 grid min-w-0 gap-3 md:grid-cols-[1.35fr_0.95fr]">
                    {quickActive && (
                      <p role="status" className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs leading-5 text-sky-800 md:col-span-2">
                        Pencarian jurnal melalui paragraf dan unggah file dinonaktifkan karena kolom pencarian cepat sudah terisi.
                      </p>
                    )}
                    <label className="relative grid">
                      <textarea
                        maxLength={1000}
                        value={paragraph}
                        onChange={event => setParagraph(capitalizeFirstLetter(event.target.value))}
                        disabled={quickActive || Boolean(fileName)}
                        placeholder={Boolean(fileName) ? "Hapus file terlebih dahulu untuk mengetik teks." : "Masukkan kalimat atau paragraf yang membutuhkan sitasi."}
                        className="min-h-44 resize-none rounded-xl border border-slate-200 bg-[rgba(200,226,251,0.24)] p-3 pb-8 text-sm outline-none focus:border-sky-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 md:min-h-44 md:p-4 md:pb-8 md:text-sm md:bg-white md:disabled:bg-slate-100 transition-colors"
                      />
                        {paragraph.trim().length > 0 && !Boolean(fileName) && !quickActive && (
                          <button
                            type="button"
                            aria-label="Hapus teks paragraf"
                            onClick={() => setParagraph("")}
                            className="absolute top-2.5 right-3 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            title="Hapus teks"
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
                            </svg>
                          </button>
                        )}
                        <span className="pointer-events-none absolute bottom-2.5 right-3 text-[11px] text-slate-400 transition-colors">
                          <span>{paragraph.length}</span>
                          <span>/</span>
                          <span className={paragraph.length >= 1000 ? "font-semibold text-rose-500" : ""}>1000</span>
                          <span> karakter</span>
                        </span>
                    </label>
                    {fileName ? (
                      <div className="flex min-h-44 w-full min-w-0 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-sky-200 bg-white p-5 text-center md:min-h-44 md:p-4">
                        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white outline outline-1 outline-offset-[-1px] outline-sky-200 shadow-[0_0_0_4px_rgba(224,242,254,1)] md:h-10 md:w-10 md:rounded-xl md:shadow-[0_0_0_3.5px_rgba(224,242,254,1)]">
                          <svg viewBox="0 0 14 16" fill="none" stroke="#0070ba" strokeWidth="1.2" strokeLinejoin="round" aria-hidden="true" className="h-7 w-6 md:h-4 md:w-[14px]">
                            <path d="M2 1.5h6l4 4v9H2z" />
                            <path d="M8 1.5v4h4" />
                          </svg>
                        </span>
                        <p className="mt-4 w-full truncate px-2 text-base font-bold leading-6 text-slate-900 md:mt-3 md:text-xs md:text-slate-800 md:leading-4">{fileName}</p>
                        <p className="mt-2 text-sm font-medium leading-5 text-slate-500 md:mt-1.5 md:text-xs md:leading-4">
                          {fileSizeLabel || "1.0 MB"} <span className="px-1">•</span> 22 Halaman
                        </p>
                        <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-2 border-t border-slate-200 pt-4 md:mt-3 md:gap-1 md:border-slate-500/20 md:pt-3">
                          <button
                            type="button"
                            onClick={handleOpenUploadedFile}
                            className="rounded-lg bg-white px-4 py-1.5 text-sm font-bold leading-5 text-slate-800 outline outline-1 outline-offset-[-1px] outline-slate-200 transition-colors hover:bg-slate-50 hover:text-sky-600 md:px-2.5 md:py-1 md:text-xs md:font-semibold md:text-slate-600"
                          >
                            Lihat
                          </button>
                          <label className="cursor-pointer rounded-lg bg-blue-50 px-4 py-1.5 text-sm font-bold leading-5 text-blue-700 outline outline-1 outline-offset-[-1px] outline-blue-200 md:bg-sky-100/70 md:px-3 md:py-1 md:text-xs md:text-sky-700 md:outline-sky-200">
                            Ganti File
                            <input type="file" accept=".pdf,.doc,.docx,.txt" className="sr-only" onChange={handleFileChange} />
                          </label>
                          <button
                            type="button"
                            aria-label="Hapus file"
                            onClick={() => setHapusFileModalOpen(true)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 md:p-1.5"
                          >
                            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="md:h-4 md:w-4">
                              <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
                              <path d="M6.5 7v4M9.5 7v4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        aria-disabled={quickActive || paragraph.trim().length > 0}
                        className={`flex min-h-44 flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/40 p-4 text-center md:min-h-44 md:border-2 md:border-dashed md:border-sky-200 md:bg-white transition-all ${
                          quickActive || paragraph.trim().length > 0
                            ? "cursor-not-allowed opacity-50 border-slate-200 bg-slate-50 md:bg-slate-50"
                            : "cursor-pointer hover:border-sky-400 hover:bg-sky-50/20"
                        }`}
                      >
                        <span className="flex h-[53px] w-[53px] items-center justify-center rounded-full border border-sky-100 bg-white shadow-sm md:h-9 md:w-9 md:rounded-lg md:border-0 md:bg-sky-50 md:shadow-none">
                          <img src={`${mobileAssets}/36094.svg`} alt="" className="md:hidden" />
                          <img src={`${searchAssets}/f5e87.svg`} alt="" className="hidden md:block" />
                        </span>
                        <span className="mt-3 text-[13px] font-semibold md:text-sm md:font-bold md:text-slate-800">Unggah file di sini</span>
                        <span className="mt-1 text-[12px] text-[#94a3b8] md:text-sm md:text-slate-500">TXT, DOCX, atau PDF</span>
                        <span className="mt-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500 md:text-xs">
                          {paragraph.trim().length > 0 ? "Hapus teks untuk unggah" : "Maks. 20 MB"}
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          className="sr-only"
                          disabled={quickActive || paragraph.trim().length > 0}
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>
                  {paragraph.trim().length > 0 && paragraph.trim().length < 5 && (
                    <div
                      role="alert"
                      className="mt-3 rounded-xl border border-red-200/90 bg-red-50/80 px-3.5 py-2.5 text-xs font-medium text-red-600 shadow-2xs transition-all animate-in fade-in duration-200"
                    >
                      Teks terlalu pendek. Masukkan kalimat atau paragraf yang lebih lengkap.
                    </div>
                  )}
                  <div className="mt-5 flex items-center justify-end md:mt-6">
                    <button
                      type="button"
                      disabled={primaryDisabled}
                      onClick={() => {
                        setLoadingSource("search");
                        if (quickActive) {
                          setSearchType("journal");
                          setResultMode("search");
                          setSearchSubmittedQuery(query.trim());
                          if (window.matchMedia("(min-width: 768px)").matches) runSearch();
                          else setMobileSearchStage("loading");
                          return;
                        }
                        if (fileName) {
                          setResultMode("analysis");
                          setSearchSubmittedQuery(fileName);
                          if (window.matchMedia("(min-width: 768px)").matches) {
                            runSearch();
                          } else {
                            setTemuanIndex(1);
                            setMobileSearchStage("loading");
                          }
                        } else {
                          setSearchType("journal");
                          setResultMode("search");
                          setSearchSubmittedQuery(paragraph.trim());
                          if (window.matchMedia("(min-width: 768px)").matches) {
                            runSearch();
                          } else {
                            setMobileSearchStage("loading");
                          }
                        }
                      }}
                      className={`inline-grid grid-cols-1 grid-rows-1 w-full items-center justify-center rounded-xl px-7 py-3 font-['Plus_Jakarta_Sans:Bold'] text-[13px] font-bold text-white shadow-sm transition-all sm:w-auto md:px-8 md:py-3 md:text-sm ${
                        primaryDisabled ? "cursor-not-allowed bg-slate-300 md:bg-slate-300" : "bg-[#00629b] hover:bg-[#005180] active:scale-98 md:bg-sky-700 md:hover:bg-sky-800"
                      }`}
                    >
                      {/* Spacer tersembunyi agar ukuran tombol 'Cari jurnal' persis sama dengan 'Analisis dan carikan jurnal' */}
                      <span className="invisible col-start-1 row-start-1 flex items-center justify-center gap-2 pointer-events-none select-none" aria-hidden="true">
                        <img src={`${mobileAssets}/8802c.svg`} alt="" className="max-w-none origin-center scale-[0.6667] md:hidden" />
                        <img src={`${searchAssets}/550ef.svg`} alt="" className="hidden md:block" />
                        <span>Analisis dan carikan jurnal</span>
                      </span>

                      {/* Konten aktif tombol */}
                      <span className="col-start-1 row-start-1 flex items-center justify-center gap-2">
                        {quickActive ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="7" cy="7" r="4.5" />
                            <path d="M10.5 10.5L14 14" />
                          </svg>
                        ) : (
                          <>
                            <img src={`${mobileAssets}/8802c.svg`} alt="" className="max-w-none origin-center scale-[0.6667] md:hidden" />
                            <img src={`${searchAssets}/550ef.svg`} alt="" className="hidden md:block" />
                          </>
                        )}
                        <span>{quickActive ? "Cari jurnal" : "Analisis dan carikan jurnal"}</span>
                      </span>
                    </button>
                  </div>
                </section>
                  </>
                )}

              </div>

              <aside className="space-y-5">
                <button
                  type="button"
                  onClick={onBack}
                  className="hidden w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 text-left shadow-sm transition-colors hover:bg-slate-50 md:flex"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500">
                    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M16 10H4" />
                      <path d="M9 5l-5 5 5 5" />
                    </svg>
                  </span>
                  <span className="font-['Inter:Semi_Bold'] text-sm font-semibold text-slate-800">Kembali ke Beranda Alerin</span>
                </button>
                <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-6 shadow-sm sm:p-6 md:p-6">
                  <h2 className="text-center font-['Plus_Jakarta_Sans:Bold'] text-[18px] font-extrabold leading-6 text-slate-900 md:text-base md:font-bold md:text-left">{guideContent?.title ?? "Cara menemukan jurnal"}</h2>
                  <p className="mt-1.5 text-center text-sm leading-relaxed text-[#64748b] md:mt-2 md:text-left md:font-['Plus_Jakarta_Sans:Regular'] md:text-xs">
                    {guideContent ? (
                      guideContent.intro
                    ) : (
                      <>
                        Pilih cara pencarian sesuai informasi yang{" "}
                        <span className="block md:inline">sudah Anda miliki.</span>
                      </>
                    )}
                  </p>
                  {guideContent ? (
                    <ol className="mt-6 space-y-2.5 md:mt-6 md:space-y-4">
                      {guideContent.steps.map((step, index) => (
                        <li key={step.description} className="flex gap-3 rounded-xl border border-slate-100/80 bg-slate-50 p-3 md:rounded-none md:border-0 md:bg-transparent md:p-0">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-[#0070ba] md:h-8 md:w-8 md:rounded-xl md:text-sky-600">{index + 1}</span>
                          <span className="min-w-0">
                            {step.title && <strong className="block text-sm md:text-sm">{step.title}</strong>}
                            <span className={step.title ? "mt-0.5 block text-xs leading-5 text-[#64748b] md:mt-1 md:text-xs md:leading-5" : "block text-sm leading-5 text-slate-700 md:text-xs md:leading-5"}>{step.description}</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ol className="mt-6 space-y-2.5 md:mt-6 md:space-y-6">
                      {[
                        ["1", "Ketik kata kunci", "Gunakan topik, variabel, nama penulis, atau informasi lain untuk menemukan jurnal yang relevan.", "Gunakan topik, variabel, nama penulis, atau informasi lain untuk menemukan jurnal yang relevan."],
                        ["2", "Tempel tulisan", "Tempel paragraf atau bagian tulisanmu. Alerin akan memahami konteksnya dan mencarikan jurnal yang dapat mendukung isi tulisan tersebut.", "Tempel paragraf atau bagian tulisanmu. Alerin akan memahami konteksnya dan mencarikan jurnal yang dapat mendukung isi tulisan tersebut."],
                        ["3", "Unggah dokumen", "Unggah dokumen untuk memeriksa penggunaan referensi dan menemukan bagian yang membutuhkan sumber, sitasi, atau jurnal pendukung.", "Unggah dokumen untuk memeriksa penggunaan referensi dan menemukan bagian yang membutuhkan sumber, sitasi, atau jurnal pendukung."],
                      ].map(([number, title, descriptionMobile, descriptionDesktop]) => (
                        <li key={number} className="flex gap-3 rounded-xl border border-slate-100/80 bg-slate-50 p-3 md:rounded-none md:border-0 md:bg-transparent md:p-0">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-[#0070ba] md:h-8 md:w-8 md:rounded-xl md:text-sky-600">{number}</span>
                          <span>
                            <strong className="block text-sm md:text-sm">{title}</strong>
                            <span className="mt-0.5 block text-xs leading-5 text-[#64748b] md:mt-1 md:text-xs md:leading-5">
                              <span className="md:hidden">{descriptionMobile}</span>
                              <span className="hidden md:inline">{descriptionDesktop}</span>
                            </span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </aside>
            </div>
          ) : view === "riwayat" ? (
            <div className="mx-auto max-w-[1160px]">
              <div className="-mt-1 md:max-w-2xl">
                <h1 className="font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold tracking-[-0.27px] text-[#0f172a]">
                  <span className="md:hidden">Riwayat</span>
                  <span className="hidden md:inline">Riwayat cari jurnal</span>
                </h1>
                <p className="mt-1 text-xs leading-5 text-[#64748b] md:text-sm">Pencarian yang pernah kamu lakukan di Alerin Jurnal.</p>

                <div className="mt-4 space-y-3">
                  {riwayatItems.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center text-xs text-slate-500">
                      Belum ada riwayat pencarian.
                    </div>
                  ) : (
                    riwayatItems.map((item, index) => (
                      <article key={`${item.type}-${item.query}-${index}`} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                      <div
                        onClick={() => openRiwayatPencarian(item)}
                        className="flex items-start justify-between gap-3 cursor-pointer select-none"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {item.pinned && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="#0070ba" stroke="#0070ba" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Disematkan" className="shrink-0 text-[#0070ba]">
                                <line x1="12" y1="17" x2="12" y2="22" />
                                <path d="M5 17h14v-1.76a2 2 0 0 0-.89-1.66l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1v3.76a2 2 0 0 1-.33.92l-1.78.9A2 2 0 0 0 5 15.24Z" />
                              </svg>
                            )}
                            <span
                              onClick={() => openRiwayatPencarian(item)}
                              className="truncate font-['Plus_Jakarta_Sans:SemiBold'] text-sm font-semibold text-[#0f172a] hover:text-[#00629b] transition-colors cursor-pointer"
                            >
                              {item.label}
                            </span>
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                setMobileGantiNamaTarget({ index, label: item.label });
                              }}
                              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:scale-90 transition-all cursor-pointer"
                              title="Ganti nama"
                              aria-label="Ganti nama"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
                              </svg>
                            </button>
                          </div>
                          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-[#94a3b8]">
                            <img src={`${mobileAssets}/3a1cb.svg`} alt="" className="h-3.5 w-3.5 opacity-60" />
                            <span>{formatRiwayatDisplayWaktu(item.waktu)}</span>
                          </p>
                        </div>
                        <span
                          onClick={e => {
                            e.stopPropagation();
                            openRiwayatPencarian(item);
                          }}
                          className="shrink-0 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold text-[#0066a1] cursor-pointer hover:bg-sky-100 active:scale-95 transition-all"
                        >
                          {item.type === "review" ? "Literature Review" : item.type === "map" ? "Peta Penelitian" : "Jurnal"}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-2 border-t border-slate-300 pt-3">
                        <button
                          type="button"
                          onClick={() => openRiwayatPencarian(item)}
                          className="flex-1 rounded-xl bg-[#00629b] px-3.5 py-2.5 text-xs font-semibold text-white active:scale-95 transition-transform"
                        >
                          Buka
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTogglePinRiwayat(index)}
                          className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-semibold whitespace-nowrap active:scale-95 transition-all ${
                            item.pinned
                              ? "border-sky-300 bg-sky-50 text-[#00629b] hover:bg-sky-100 font-bold"
                              : "border-slate-200 bg-white text-[#64748b] hover:bg-slate-50 hover:text-slate-800"
                          }`}
                          title={item.pinned ? "Lepas sematan" : "Sematkan"}
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill={item.pinned ? "#0070ba" : "none"}
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            className={`shrink-0 ${item.pinned ? "text-[#00629b]" : "text-slate-400"}`}
                          >
                            <line x1="12" y1="17" x2="12" y2="22" />
                            <path d="M5 17h14v-1.76a2 2 0 0 0-.89-1.66l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1v3.76a2 2 0 0 1-.33.92l-1.78.9A2 2 0 0 0 5 15.24Z" />
                          </svg>
                          <span>{item.pinned ? "Lepas sematan" : "Sematkan"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMobileHapusTarget({ type: "riwayat", index, label: item.label })}
                          className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-[#64748b] hover:bg-slate-50 active:scale-95 transition-all"
                        >
                          Hapus
                        </button>
                      </div>
                    </article>
                  )))}
                </div>
              </div>
            </div>
          ) : (
            <>
            <div className="-mt-4 md:hidden">
              <div className="px-1 py-[9px]">
                <div className="flex items-center justify-between">
                  <h1 className="font-['Plus_Jakarta_Sans:Bold'] text-lg font-bold tracking-[-0.27px] text-[#0f172a]">
                    {collectionTab === "journal" ? "Folder Jurnal" : collectionTab === "review" ? "Folder Literatur" : "Folder Peta"}
                  </h1>
                  <div className="relative flex items-center gap-2">
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={mobileCollectionMenuOpen}
                      onClick={() => setMobileCollectionMenuOpen(open => !open)}
                      className="flex h-7 items-center gap-1.5 rounded-lg bg-white px-2.5 text-sm font-bold text-[#0369a1] outline outline-1 outline-sky-200"
                    >
                      {collectionTab === "journal" ? "Jurnal" : collectionTab === "review" ? "Literatur Review" : "Peta Penelitian"}
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
                        <path d="M1 1l4 4 4-4" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      aria-label="Tambah folder"
                      onClick={() => setNewFolderOpen(true)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0369a1] active:scale-95 transition-transform"
                    >
                      <img src="/assets/jurnal-design/collection-mobile/ce139.svg" alt="" className="h-[18px] w-[18px]" />
                    </button>
                    {mobileCollectionMenuOpen && (
                      <div role="menu" className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl bg-white p-1.5 shadow-xl outline outline-1 outline-slate-200">
                        {(
                          [
                            ["journal", "Jurnal"],
                            ["review", "Literatur Review"],
                            ["map", "Peta Penelitian"],
                          ] as const
                        ).map(([type, label]) => (
                          <button
                            key={type}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setCollectionTab(type);
                              setMobileCollectionMenuOpen(false);
                              exitFolderSelect();
                            }}
                            className={`w-full rounded-lg px-3 py-2 text-left text-xs font-semibold ${
                              collectionTab === type ? "bg-sky-50 text-[#0369a1]" : "text-slate-600"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
                {[
                  { id: "all", name: "Semua" },
                  ...(collectionTab === "journal" ? folders : collectionTab === "review" ? literatureFolders : mapFolders),
                ].map((folder, chipIndex) => {
                  const active =
                    collectionTab === "journal"
                      ? activeFolderId === folder.id
                      : collectionTab === "review"
                        ? activeLiteratureFolderId === folder.id
                        : activeMapFolderId === folder.id;
                  const count =
                    collectionTab === "journal"
                      ? (folderCounts[folder.id] ?? 0)
                      : collectionTab === "review"
                        ? (literatureCounts[folder.id] ?? 0)
                        : (mapCounts[folder.id] ?? 0);
                  return (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() =>
                        collectionTab === "journal"
                          ? setActiveFolderId(folder.id)
                          : collectionTab === "review"
                            ? setActiveLiteratureFolderId(folder.id)
                            : setActiveMapFolderId(folder.id)
                      }
                      className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs shadow-sm ${
                        active ? "bg-[#00629b] text-white" : "bg-white text-[#64748b]"
                      }`}
                    >
                      <img
                        src="/assets/jurnal-design/collection-mobile/22763.svg"
                        alt=""
                        className={`h-[18px] w-[18px] shrink-0 ${active ? "brightness-0 invert" : ""}`}
                      />
                      {folder.name}
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${active ? "bg-white text-[#0369a1]" : "bg-slate-100"}`}>{count}</span>
                    </button>
                  );
                })}
              </div>

              {collectionTab === "journal" ? (
                collectionJournals.length === 0 ? (
                <div className="mt-6 flex flex-col items-center rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                  </svg>
                  <p className="mt-4 max-w-xs text-xs leading-5 text-[#64748b]">
                    Belum ada jurnal di folder ini. Simpan jurnal dari Beranda atau pindahkan jurnal tersimpan ke folder ini.
                  </p>
                  <button type="button" onClick={startSearching} className="mt-5 rounded-xl bg-[#00629b] px-5 py-2.5 text-xs font-semibold text-white">
                    Mulai mencari jurnal
                  </button>
                </div>
              ) : (
              <div className="mt-3 space-y-3.5">
                {collectionJournals.map(journal => (
                  <MobileJournalCollectionCard
                    key={journal.id}
                    journal={journal}
                    folders={folders}
                    onMove={folderId => moveJournal(journal.id, folderId)}
                    onRemove={() => setHapusJournalId(journal.id)}
                    onSitasi={() => setSitasiOpen(true)}
                    onDetail={() => setRingkasanOpen(true)}
                    onAbstrak={() => setAbstrakOpen(true)}
                    onDiskusikan={onDiskusikan}
                  />
                ))}
              </div>
              )
              ) : collectionTab === "review" ? (
                collectionLiterature.length === 0 ? (
                  <div className="mt-6 flex flex-col items-center rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                    </svg>
                    <p className="mt-4 max-w-xs text-xs leading-5 text-[#64748b]">
                      Belum ada literature review di folder ini. Lakukan literature review dari Beranda atau pindahkan literatur tersimpan ke folder ini.
                    </p>
                    <button type="button" onClick={startSearching} className="mt-5 rounded-xl bg-[#00629b] px-5 py-2.5 text-xs font-semibold text-white">
                      Mulai literature review
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 space-y-4">
                    {collectionLiterature.map(item => (
                      <MobileLiteratureCollectionCard
                        key={item.id}
                        item={item}
                        onOpen={() => openSavedLiterature(item)}
                        onRemove={() => setHapusLiteratureId(item.id)}
                        onMove={folderId => moveLiterature(item.id, folderId)}
                        folders={literatureFolders}
                      />
                    ))}
                  </div>
                )
              ) : collectionMaps.length === 0 ? (
                <div className="mt-6 flex flex-col items-center rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <p className="mt-4 max-w-xs text-xs leading-5 text-[#64748b]">
                    Belum ada peta penelitian di folder ini. Buat peta penelitian dari Beranda atau pindahkan peta tersimpan ke folder ini.
                  </p>
                  <button type="button" onClick={startSearching} className="mt-5 rounded-xl bg-[#00629b] px-5 py-2.5 text-xs font-semibold text-white">
                    Mulai peta penelitian
                  </button>
                </div>
              ) : (
                <div className="mt-2 space-y-4">
                  {collectionMaps.map(item => (
                    <MobileResearchMapCollectionCard
                      key={item.id}
                      item={item}
                      onOpen={() => openSavedMap(item)}
                      onRemove={() => setHapusMapId(item.id)}
                      onMove={folderId => moveMap(item.id, folderId)}
                      folders={mapFolders}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mx-auto hidden max-w-[1160px] gap-5 md:grid lg:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="font-['Plus_Jakarta_Sans:ExtraBold'] text-[28px] font-extrabold tracking-[-0.69px] text-[#003859]">
                      {collectionTab === "journal" ? "Koleksi jurnal" : collectionTab === "review" ? "Koleksi Literature Review" : "Koleksi Peta Penelitian"}
                    </h1>
                    <p className="mt-1.5 text-sm leading-6 text-[#64748b]">
                      {collectionTab === "journal"
                        ? "Simpan jurnal yang relevan agar mudah diakses saat kamu membutuhkannya."
                        : collectionTab === "review"
                          ? "Simpan hasil literature review agar mudah diakses kembali saat kamu membutuhkannya."
                          : "Simpan hasil peta penelitian agar mudah diakses kembali saat kamu membutuhkannya."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      collectionTab === "journal"
                        ? setActiveFolderId("all")
                        : collectionTab === "review"
                          ? setActiveLiteratureFolderId("all")
                          : setActiveMapFolderId("all")
                    }
                    className="flex items-center justify-center gap-2.5 whitespace-nowrap rounded-[10px] bg-[#0066a1] px-5 py-2.5 font-['Plus_Jakarta_Sans:Bold'] text-sm font-bold text-white"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                    </svg>
                    {collectionTab === "journal"
                      ? activeFolderId === "all"
                        ? "Semua folder"
                        : (folders.find(folder => folder.id === activeFolderId)?.name ?? "Semua folder")
                      : collectionTab === "review"
                        ? activeLiteratureFolderId === "all"
                          ? "Semua folder"
                          : (literatureFolders.find(folder => folder.id === activeLiteratureFolderId)?.name ?? "Semua folder")
                        : activeMapFolderId === "all"
                          ? "Semua folder"
                          : (mapFolders.find(folder => folder.id === activeMapFolderId)?.name ?? "Semua folder")}
                  </button>
                </div>

                <div role="tablist" aria-label="Jenis koleksi" className="mt-5 grid grid-cols-3 items-stretch gap-1 rounded-2xl bg-white p-1 outline outline-1 outline-slate-200/90 shadow-2xs">
                  {(
                    [
                      ["journal", "Koleksi Jurnal"],
                      ["review", "Literatur"],
                      ["map", "Peta Penelitian"],
                    ] as const
                  ).map(([type, label]) => {
                    const active = collectionTab === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => {
                          setCollectionTab(type);
                          exitFolderSelect();
                        }}
                        className={`flex h-full w-full items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[11px] font-semibold transition-all sm:gap-2 sm:text-xs md:px-4 md:text-sm ${
                          active
                            ? "bg-[#00629b] text-white shadow-sm md:bg-sky-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        {type === "journal" ? (
                          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 md:h-4 md:w-4">
                            <rect x="2.5" y="2" width="11" height="12" rx="1.5" />
                            <path d="M5 5h6M5 8h6M5 11h4" />
                          </svg>
                        ) : type === "review" ? (
                          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 md:h-4 md:w-4">
                            <path d="M2.5 3.5h5v9h-5zM8.5 3.5h5v9h-5z" />
                            <path d="M4.5 6h1M4.5 8.5h1M10.5 6h1M10.5 8.5h1" />
                          </svg>
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 md:h-4 md:w-4">
                            <path d="M2 3l4-1 4 1 4-1v11l-4 1-4-1-4 1z" />
                            <path d="M6 2v11M10 3v11" />
                          </svg>
                        )}
                        <span className="text-center leading-tight">
                          {type === "review" ? (
                            <>
                              Literatur<span className="hidden md:inline"> Review</span>
                            </>
                          ) : (
                            label
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {collectionTab === "journal" ? collectionJournals.length === 0 ? (
                  <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                    </svg>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-[#64748b]">
                      Belum ada jurnal di folder ini. Simpan jurnal dari Beranda atau pindahkan jurnal tersimpan ke folder ini.
                    </p>
                    <button type="button" onClick={startSearching} className="mt-5 rounded-xl bg-[#00629b] px-5 py-2.5 text-xs font-semibold text-white">
                      Mulai mencari jurnal
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 space-y-4">
                    {collectionJournals.map(journal => (
                      <JournalCard
                        key={journal.id}
                        journal={journal}
                        folders={folders}
                        onMove={folderId => moveJournal(journal.id, folderId)}
                        onRemove={() => setHapusJournalId(journal.id)}
                        onSitasi={() => setSitasiOpen(true)}
                        onDetail={() => setRingkasanOpen(true)}
                        onAbstrak={() => setAbstrakOpen(true)}
                        onDiskusikan={onDiskusikan}
                      />
                    ))}
                  </div>
                ) : collectionTab === "review" ? (
                  collectionLiterature.length === 0 ? (
                    <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                      </svg>
                      <p className="mt-4 max-w-sm text-sm leading-6 text-[#64748b]">Belum ada literature review di folder ini.</p>
                      <button type="button" onClick={startSearching} className="mt-5 rounded-xl bg-[#00629b] px-5 py-2.5 text-xs font-semibold text-white">
                        Mulai literature review
                      </button>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      {collectionLiterature.slice(0, 1).map(item => (
                        <DesktopLiteratureCollectionCard
                          key={item.id}
                          item={item}
                          folders={literatureFolders}
                          onOpen={() => openSavedLiterature(item)}
                          onRemove={() => setHapusLiteratureId(item.id)}
                          onMove={folderId => moveLiterature(item.id, folderId)}
                        />
                      ))}
                    </div>
                  )
                ) : collectionMaps.length === 0 ? (
                  <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                    </svg>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-[#64748b]">Belum ada peta penelitian di folder ini.</p>
                    <button type="button" onClick={startSearching} className="mt-5 rounded-xl bg-[#00629b] px-5 py-2.5 text-xs font-semibold text-white">
                      Mulai peta penelitian
                    </button>
                  </div>
                ) : (
                    <div className="mt-6 space-y-4">
                      {collectionMaps.slice(0, 1).map(item => (
                        <section key={item.id} className="rounded-[24px] border border-slate-200/90 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-5">
                          <div className="grid grid-cols-12 gap-3 rounded-2xl border border-sky-100/80 bg-gradient-to-br from-sky-50/50 via-blue-50/30 to-indigo-50/20 p-4">
                            <label className="col-span-5">
                              <span className="text-[11px] font-semibold text-slate-500">Topik penelitian ⓘ</span>
                              <span className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-xs">
                                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#0070ba" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                                  <circle cx="7" cy="7" r="4.5" />
                                  <path d="M10.5 10.5L14 14" />
                                </svg>
                                {item.topic}
                              </span>
                            </label>
                            <label className="col-span-3">
                              <span className="text-[11px] font-semibold text-slate-500">Sumber jurnal ⓘ</span>
                              <span className="mt-1 block rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-xs">{item.sources}</span>
                            </label>
                            <label className="col-span-4">
                              <span className="text-[11px] font-semibold text-slate-500">Periode publikasi ⓘ</span>
                              <span className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-xs">
                                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#0070ba" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                                  <rect x="2" y="3" width="12" height="11" rx="2" />
                                  <path d="M2 7h12M5 1.5v3M11 1.5v3" />
                                </svg>
                                2020 - 2026
                              </span>
                            </label>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <article className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4 transition-all hover:bg-slate-50/70">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2.5">
                                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#0070ba]">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <circle cx="4" cy="4" r="2" />
                                      <circle cx="12" cy="5" r="2" />
                                      <circle cx="8" cy="12" r="2" />
                                      <path d="M5.5 5l5 6M10.5 6L8.5 10.5M5.5 4.5h5" />
                                    </svg>
                                  </span>
                                  <strong className="text-xs text-slate-900">Peta Jaringan</strong>
                                </span>
                              </div>
                              <p className="mt-1.5 text-center text-xs leading-4 text-slate-600">Menampilkan hubungan antar topik berdasarkan kemunculan bersama.</p>
                              <div className="mt-4">
                                <CollectionMapPreview mode="jaringan" />
                              </div>
                            </article>

                            <article className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4 transition-all hover:bg-slate-50/70">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2.5">
                                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#0070ba]">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <circle cx="8" cy="8" r="6" />
                                      <circle cx="8" cy="8" r="3" fill="#0070ba" fillOpacity="0.3" />
                                      <circle cx="8" cy="8" r="1" fill="#0070ba" />
                                    </svg>
                                  </span>
                                  <strong className="text-xs text-slate-900">Peta Kepadatan</strong>
                                </span>
                              </div>
                              <p className="mt-1.5 text-center text-xs leading-4 text-slate-600">Menampilkan tingkat konsentrasi topik dalam penelitian.</p>
                              <div className="mt-4">
                                <CollectionMapPreview mode="kepadatan" />
                              </div>
                              <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400"><span>Rendah</span><span className="h-2 flex-1 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 via-emerald-400 via-yellow-400 to-red-500" /><span>Tinggi</span></div>
                            </article>

                            <article className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4 transition-all hover:bg-slate-50/70">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2.5">
                                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#0070ba]">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d="M2 13l3.5-4 3 2.5 5.5-7" />
                                      <path d="M10.5 4.5H14V8" />
                                    </svg>
                                  </span>
                                  <strong className="text-xs text-slate-900">Peta Perkembangan</strong>
                                </span>
                              </div>
                              <p className="mt-1.5 text-center text-xs leading-4 text-slate-600">Menampilkan rata-rata tahun publikasi setiap topik.</p>
                              <div className="mt-4">
                                <CollectionMapPreview mode="perkembangan" />
                              </div>
                              <div className="mt-2 h-1.5 rounded-full bg-gradient-to-r from-[#2563eb] via-[#0ea5e9] via-[#2dd4bf] via-[#4ade80] via-[#facc15] via-[#fb923c] to-[#ef4444]" /><div className="mt-1 flex justify-between text-[9px] text-slate-400">{[2020, 2021, 2022, 2023, 2024, 2025, 2026].map(year => <span key={year}>{year}</span>)}</div>
                            </article>
                          </div>

                          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
                            <div className="flex items-center justify-between border-b border-slate-100 p-5">
                              <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#0070ba]">
                                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M2.5 3.5h4.2c.7 0 1.3.6 1.3 1.3v8.7c0-.7-.6-1.3-1.3-1.3H2.5z" />
                                    <path d="M13.5 3.5H9.3c-.7 0-1.3.6-1.3 1.3v8.7c0-.7.6-1.3 1.3-1.3h4.2z" />
                                  </svg>
                                </span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-slate-900">Jurnal yang Digunakan</h3>
                                    <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-[#00629b] border border-sky-200/60">
                                      {priorityRows.length} Jurnal
                                    </span>
                                  </div>
                                  <p className="text-xs leading-4 text-slate-500">Daftar jurnal yang menjadi dasar pembuatan peta penelitian.</p>
                                </div>
                              </div>
                            </div>
                            <div className="modal-custom-scrollbar max-h-72 overflow-y-auto overflow-x-auto">
                              <table className="w-full min-w-[700px] text-left text-xs">
                                <thead className="bg-slate-50/80 text-slate-500 sticky top-0 z-10 backdrop-blur-xs">
                                  <tr>
                                    <th className="px-5 py-3">Penulis</th>
                                    <th className="px-5 py-3">Judul</th>
                                    <th className="px-5 py-3">Tahun ⇅</th>
                                    <th className="px-5 py-3">Sumber</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {priorityRows.map((row, idx) => (
                                    <tr key={`${row.title}-${idx}`} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                                      <td className="px-5 py-3.5 font-medium text-slate-800">{row.authors}</td>
                                      <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">{row.title}</td>
                                      <td className="px-5 py-3.5 text-slate-600 font-medium">{row.year}</td>
                                      <td className="px-5 py-3.5">
                                        <span className="flex items-center gap-2 text-slate-700">
                                          <img src={sourceLogos[row.source] ?? "/assets/source-logos/openalex.svg"} alt="" className="h-4 w-4 object-contain" />
                                          {row.source}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-200/60 pt-4">
                            <span className="text-xs text-slate-400">{item.date} · {mapFolders.find(folder => folder.id === item.folderId)?.name ?? "Belum dikelompokkan"}</span>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => setHapusMapId(item.id)} className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
                                </svg>
                                Hapus
                              </button>
                              <label className="relative">
                                <select aria-label="Pilih folder peta" value={item.folderId} onChange={event => moveMap(item.id, event.target.value)} className="appearance-none rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-7 text-xs font-semibold text-slate-700">
                                  {mapFolders.map(folder => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
                                </select>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
                                  <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                                </svg>
                              </label>
                              <button type="button" onClick={() => openSavedMap(item)} className="flex items-center gap-1.5 rounded-xl bg-[#0070ba] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#005c99] transition-colors">
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" />
                                  <circle cx="8" cy="8" r="2" />
                                </svg>
                                Lihat Detail
                              </button>
                            </div>
                          </div>
                        </section>
                      ))}
                    </div>
                )}
              </div>

              <aside className="space-y-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 text-left shadow-sm transition-colors hover:bg-slate-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500">
                    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M16 10H4" />
                      <path d="M9 5l-5 5 5 5" />
                    </svg>
                  </span>
                  <span className="font-['Inter:Semi_Bold'] text-sm font-semibold text-slate-800">Kembali ke Beranda Alerin</span>
                </button>
                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-2 px-2 pb-3">
                    <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-base font-bold text-[#1e293b]">
                      {collectionTab === "journal" ? "Folder Jurnal" : collectionTab === "review" ? "Folder Literatur" : "Folder Peta"}
                    </h2>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => (folderSelectMode ? exitFolderSelect() : setFolderSelectMode(true))}
                        aria-pressed={folderSelectMode}
                        className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors ${
                          folderSelectMode
                            ? "border-sky-200 bg-sky-50 text-[#0066a1]"
                            : "border-slate-200 text-[#475569] hover:bg-slate-50"
                        }`}
                      >
                        {folderSelectMode ? "Batal" : "Pilih"}
                      </button>
                      {!folderSelectMode && (
                        <button
                          type="button"
                          aria-label="Buat folder baru"
                          onClick={() => setNewFolderOpen(true)}
                          className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path d="M8 3v10M3 8h10" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {folderSelectMode && (
                    <div className="mb-2 flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2">
                      <span className="text-xs text-[#64748b]">{selectedFolderIds.length} folder dipilih</span>
                      <button
                        type="button"
                        disabled={selectedFolderIds.length === 0}
                        onClick={() => setHapusFolderModalOpen(true)}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors ${
                          selectedFolderIds.length === 0 ? "cursor-not-allowed bg-slate-300" : "bg-[#bd3434] hover:bg-[#a52a2a] cursor-pointer"
                        }`}
                      >
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
                        </svg>
                        Hapus
                      </button>
                    </div>
                  )}

                  {(() => {
                    const currentFolders = collectionTab === "journal" ? folders : collectionTab === "review" ? literatureFolders : mapFolders;
                    const currentActiveId = collectionTab === "journal" ? activeFolderId : collectionTab === "review" ? activeLiteratureFolderId : activeMapFolderId;
                    const currentCounts = collectionTab === "journal" ? folderCounts : collectionTab === "review" ? literatureCounts : mapCounts;
                    const handleSelectAll = () => {
                      if (folderSelectMode) return;
                      if (collectionTab === "journal") setActiveFolderId("all");
                      else if (collectionTab === "review") setActiveLiteratureFolderId("all");
                      else setActiveMapFolderId("all");
                    };
                    const handleSelectFolder = (id: string) => {
                      if (folderSelectMode) {
                        toggleFolderSelection(id);
                      } else {
                        if (collectionTab === "journal") setActiveFolderId(id);
                        else if (collectionTab === "review") setActiveLiteratureFolderId(id);
                        else setActiveMapFolderId(id);
                      }
                    };

                    return (
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={handleSelectAll}
                          aria-disabled={folderSelectMode}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                            folderSelectMode
                              ? "text-slate-400"
                              : currentActiveId === "all"
                                ? "bg-sky-100 text-[#0066a1]"
                                : "text-[#475569]"
                          }`}
                        >
                          <img src={`${collectionAssets}/8b8d1.svg`} alt="" className={folderSelectMode ? "opacity-40" : ""} />
                          <span className="flex-1">Semua</span>
                          <span>{currentCounts.all ?? 0}</span>
                        </button>
                        {currentFolders.map(folder => {
                          const selected = selectedFolderIds.includes(folder.id);
                          return (
                            <button
                              key={folder.id}
                              type="button"
                              onClick={() => handleSelectFolder(folder.id)}
                              aria-pressed={folderSelectMode ? selected : undefined}
                              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                                folderSelectMode && selected
                                  ? "bg-rose-50 text-[#bd3434]"
                                  : currentActiveId === folder.id && !folderSelectMode
                                    ? "bg-sky-100 text-[#0066a1]"
                                    : "text-[#475569] hover:bg-slate-50"
                              }`}
                            >
                              {folderSelectMode ? (
                                <span
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                    selected ? "border-[#bd3434] bg-[#bd3434]" : "border-slate-300 bg-white"
                                  }`}
                                >
                                  {selected && (
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d="M1.5 5.2l2.3 2.3 4.7-5" />
                                    </svg>
                                  )}
                                </span>
                              ) : (
                                <img src={`${collectionAssets}/e1558.svg`} alt="" />
                              )}
                              <span className="flex-1">{folder.name}</span>
                              <span>{currentCounts[folder.id] ?? 0}</span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </aside>
            </div>
            </>
          )}
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-[310] border-t border-slate-200 bg-white/95 px-3 pb-2 pt-1.5 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] backdrop-blur-md transition-transform duration-300 ease-out md:hidden"
        style={{ transform: mobileNavHidden ? "translateY(calc(100% + 36px))" : "translateY(0)" }}
      >
        <div className="mx-auto grid max-w-md grid-cols-5 items-end">
          <button type="button" onClick={() => changeView("home")} aria-current={view === "home" ? "page" : undefined} className={`flex flex-col items-center gap-1 py-1 text-[10px] font-semibold ${view === "home" ? "text-[#00629b]" : "text-slate-400"}`}>
            <span className="flex h-6 items-center"><img src={`${mobileAssets}/62a85.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" style={{ filter: view === "home" ? "none" : "brightness(0) saturate(100%) invert(70%) sepia(14%) saturate(518%) hue-rotate(176deg) brightness(90%) contrast(86%)" }} /></span>
            Beranda
          </button>
          <button type="button" onClick={() => changeView("collection")} aria-current={view === "collection" ? "page" : undefined} className={`flex flex-col items-center gap-1 py-1 text-[10px] font-medium ${view === "collection" ? "text-[#00629b]" : "text-slate-400"}`}>
            <span className="flex h-6 items-center"><img src={`${mobileAssets}/6978a.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" style={{ filter: view === "collection" ? "brightness(0) saturate(100%) invert(30%) sepia(96%) saturate(1030%) hue-rotate(164deg) brightness(86%) contrast(102%)" : "none" }} /></span>
            Koleksi
          </button>
          <button type="button" onClick={onBack} className="relative flex flex-col items-center gap-1 pb-1 text-[10px] font-bold text-[#004f80]">
            <span className="-mt-7 flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white bg-[rgba(123,123,123,0.05)] shadow-lg">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <img src={`${mobileAssets}/73c1a.png`} alt="Alerin" className="h-8 w-8 rounded-full object-cover" />
              </span>
            </span>
            Alerin
          </button>
          <button
            type="button"
            onClick={() => changeView("riwayat")}
            aria-current={view === "riwayat" ? "page" : undefined}
            className={`flex flex-col items-center gap-1 py-1 text-[10px] font-medium ${view === "riwayat" ? "text-[#00629b]" : "text-slate-400"}`}
          >
            <span className="flex h-6 items-center"><img src={`${mobileAssets}/3a1cb.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" style={{ filter: view === "riwayat" ? "brightness(0) saturate(100%) invert(30%) sepia(96%) saturate(1030%) hue-rotate(164deg) brightness(86%) contrast(102%)" : "none" }} /></span>
            Riwayat
          </button>
          <button type="button" onClick={() => setUpgradeOpen(true)} className="flex flex-col items-center gap-1 py-1 text-[10px] font-medium text-slate-400">
            <span className="flex h-6 items-center"><img src={`${mobileAssets}/ae5e6.svg`} alt="" className="max-w-none origin-center scale-[0.6667]" /></span>
            Paket
          </button>
        </div>
      </nav>

      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={() => setFilterApplied(true)}
        onReset={() => setFilterApplied(false)}
      />
      <UpgradePremiumModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
      <UpgradePremiumSheet open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
      <UpgradeLockedConfirmModal
        open={upgradeLockedConfirmOpen}
        onClose={() => setUpgradeLockedConfirmOpen(false)}
        onConfirm={() => {
          setUpgradeLockedConfirmOpen(false);
          setUpgradeOpen(true);
        }}
      />
      <NewFolderModal open={newFolderOpen} onClose={() => setNewFolderOpen(false)} onCreate={createFolder} />
      <RingkasanJurnalModal open={ringkasanOpen} onClose={() => setRingkasanOpen(false)} onDiskusikan={onDiskusikan} />
      <TabelPenelitianModal open={tabelOpen} onClose={() => setTabelOpen(false)} />
      <BuatSitasiModal open={sitasiOpen} onClose={() => setSitasiOpen(false)} />
      <AbstrakJurnalModal open={abstrakOpen} onClose={() => setAbstrakOpen(false)} />
      <PdfPreviewModal
        open={pdfPreviewOpen}
        onClose={() => setPdfPreviewOpen(false)}
        fileName={fileName}
        fileSize={fileSizeLabel}
        fileUrl={fileUrl}
        fileObject={fileObject}
      />
      <HapusJurnalModal
        open={hapusJournalId !== null}
        title={hapusJournal?.title ?? "Jurnal ini"}
        onClose={() => setHapusJournalId(null)}
        onConfirm={confirmRemoveSavedJournal}
      />
      <HapusLiteratureModal
        open={hapusLiteratureId !== null}
        onClose={() => setHapusLiteratureId(null)}
        onConfirm={confirmRemoveLiterature}
      />
      <HapusMapModal
        open={hapusMapId !== null}
        onClose={() => setHapusMapId(null)}
        onConfirm={confirmRemoveMap}
      />
      <HapusFolderModal
        open={hapusFolderModalOpen}
        count={selectedFolderIds.length}
        onClose={() => setHapusFolderModalOpen(false)}
        onConfirm={confirmDeleteSelectedFolders}
      />
      <HapusFileModal
        open={hapusFileModalOpen}
        fileName={fileName}
        onClose={() => setHapusFileModalOpen(false)}
        onConfirm={confirmHapusFile}
      />
      <HapusRiwayatModal
        open={mobileHapusTarget !== null}
        title={mobileHapusTarget?.label}
        onClose={() => setMobileHapusTarget(null)}
        onConfirm={() => {
          if (mobileHapusTarget) {
            if (mobileHapusTarget.type === "riwayat") {
              const itemToDelete = riwayatItems[mobileHapusTarget.index];
              if (itemToDelete) {
                const deletedKey = `${itemToDelete.type}:${itemToDelete.query.trim().toLowerCase()}`;
                if (activeRiwayatKey === deletedKey) {
                  setActiveRiwayatKey(null);
                }
              }
              setRiwayatItems(list => list.filter((_, i) => i !== mobileHapusTarget.index));
            } else {
              setExtraRiwayatList(list => list.filter((_, i) => i !== mobileHapusTarget.index));
            }
            showToast("Riwayat pencarian dihapus");
            setMobileHapusTarget(null);
          }
        }}
      />
      <GantiNamaRiwayatModal
        open={mobileGantiNamaTarget !== null}
        currentName={mobileGantiNamaTarget?.label ?? ""}
        onClose={() => setMobileGantiNamaTarget(null)}
        onSave={newName => {
          if (mobileGantiNamaTarget) {
            setRiwayatItems(list =>
              list.map((item, i) => (i === mobileGantiNamaTarget.index ? { ...item, label: newName } : item))
            );
            showToast("Nama riwayat berhasil diubah");
            setMobileGantiNamaTarget(null);
          }
        }}
      />
      <SlowSearchModal
        open={showSlowSearchPopup}
        onClose={() => setShowSlowSearchPopup(false)}
      />
      <Toast message={toast} />
    </div>
  );
}
