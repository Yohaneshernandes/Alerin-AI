import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { Link } from "react-router";
import maskotImg from "@/imports/Animasi_Maskot_Buku_31_Agu_2026.png";
import owlGradImg from "@/imports/image-6.png";
import claroIconImg from "@/imports/image-2.png";
import penguinHeadImg from "@/imports/image-2.png";
import penguinGradImg from "@/imports/image-2.png";
import aleriniWelcomeImg from "@/imports/WebsiteForClassProgram/eeec25fee4848e457348b9a4e108c0ec19fb79ad.png";
import ParafraseFigmaPanel from "@/components/ParafraseFigmaPanel";
import CariJurnalFigmaPanel from "@/components/CariJurnalFigmaPanel";
import FiturLandingFigma from "@/components/FiturLandingFigma";

// ─── Types ────────────────────────────────────────────────────────────────────
type NavTab = "percakapan" | "fitur" | "proyek" | "progress" | "quizlab" | "profil";
type ChatSource = { title: string; author: string; year: string; url?: string };
type FeatureKey = "matakuliah" | "parafrase" | "grammar" | "plagiasi" | "jurnal" | "judul" | "quizlab" | "progress" | "ppt" | "simulasi";
type FeatureRec = { label: string; desc: string; tab?: NavTab; featureKey?: FeatureKey; icon: string; color: string };
type ChatMsg = { role: "user" | "claro"; text: string; time: string; imageUrl?: string; imagePrompt?: string; generating?: boolean; paraphrase?: { original: string; versions: { label: string; text: string; color: string }[] }; fileCard?: { name: string; type: string; size: string }; suggestions?: string[]; sources?: ChatSource[]; featureRec?: FeatureRec };
type SearchFilter = "semua" | "chat" | "dokumen" | "proyek";

// Indonesian remains the source language so existing content keeps working,
// while the English layer can also translate content mounted after navigation.
const ENGLISH_INTERFACE_COPY: Record<string, string> = {
  "Asisten kampusmu": "Your campus assistant",
  "Baru": "New",
  "Percakapan": "Chats",
  "Semua Fitur": "All Features",
  "Proyek Saya": "My Projects",
  "Progress": "Progress",
  "Profil": "Profile",
  "Chat": "Chat",
  "Fitur": "Features",
  "Proyek": "Projects",
  "Cari percakapan": "Search chats",
  "Riwayat percakapan": "Chat history",
  "Hari ini": "Today",
  "Kemarin": "Yesterday",
  "Notifikasi": "Notifications",
  "Tandai semua dibaca": "Mark all as read",
  "Kredit AI": "AI Credits",
  "Upgrade": "Upgrade",
  "Temukan mentor": "Find a mentor",
  "Profil Saya": "My Profile",
  "Mode Terang": "Light Mode",
  "Mode Gelap": "Dark Mode",
  "Saran & Laporan": "Feedback & Reports",
  "Pasang Aplikasi": "Install App",
  "Untuk desktop dan mobile": "For desktop and mobile",
  "Keluar": "Sign Out",
  "Detail Informasi": "Personal Details",
  "Edit": "Edit",
  "Nama Lengkap": "Full Name",
  "Universitas": "University",
  "Jenjang": "Degree Level",
  "Program Studi": "Study Program",
  "Semester": "Semester",
  "Dibantu untuk": "Assistance Focus",
  "Fase saat ini": "Current Phase",
  "Akun & Keamanan": "Account & Security",
  "Nomor WhatsApp": "WhatsApp Number",
  "Paket": "Plan",
  "Keamanan Akun": "Account Security",
  "Ubah kata sandi": "Change password",
  "Kelola": "Manage",
  "Yang Alerin ketahui": "What Alerin Knows",
  "Progres": "Progress",
  "Personalisasi": "Personalization",
  "Umum": "General",
  "Mode Bahasa": "Language",
  "Pilih satu dari 27 bahasa untuk antarmuka dan jawaban Alerin.": "Choose one of 27 languages for the interface and Alerin's responses.",
  "27 bahasa": "27 languages",
  "Gulir di dalam daftar untuk melihat semua bahasa": "Scroll inside the list to see all languages",
  "Tema Gelap dan Terang": "Dark and Light Theme",
  "Pilih tampilan yang paling nyaman untuk belajar.": "Choose the most comfortable appearance for studying.",
  "Terang": "Light",
  "Gelap": "Dark",
  "Privasi & Data": "Privacy & Data",
  "Tentang Alerin": "About Alerin",
  "Edit Profil": "Edit Profile",
  "Perubahan disimulasikan dan dapat disimpan.": "Changes can be reviewed and saved.",
  "Pilih foto baru": "Choose new photo",
  "JPG atau PNG, maksimal 5 MB.": "JPG or PNG, maximum 5 MB.",
  "Motto": "Motto",
  "Batal": "Cancel",
  "Simpan perubahan": "Save changes",
  "Kelola Data Pribadi": "Manage Personal Data",
  "Data pribadi berhasil disimpan.": "Personal data saved.",
  "Pengaturan Notifikasi": "Notification Settings",
  "Pengingat deadline": "Deadline reminders",
  "Ringkasan progres mingguan": "Weekly progress summary",
  "Rekomendasi dari Alerin": "Recommendations from Alerin",
  "Simpan": "Save",
  "Personalisasi jawaban": "Personalized responses",
  "Izinkan Alerin menggunakan data akademikmu.": "Allow Alerin to use your academic data.",
  "Hapus seluruh riwayat": "Delete all history",
  "Mata Kuliah": "Courses",
  "Tugas Kuliah": "Course Assignments",
  "Skripsi": "Undergraduate Thesis",
  "Tesis": "Master's Thesis",
  "Disertasi": "Dissertation",
  "Tahapan Skripsi": "Thesis Stages",
  "Target Akademik": "Academic Target",
  "Atur Ulang Rencana": "Reset Plan",
  "Motivasi Hari Ini": "Today's Motivation",
  "Terus semangat, langkah kecil hari ini bisa jadi hasil besar nanti!": "Keep going—today's small steps can lead to big results!",
  "Daftar Sekarang": "Register Now",
  "Mulai Chat": "Start Chat",
  "Kirim": "Send",
  "Kembali": "Back",
  "Lanjut": "Continue",
  "Selesai": "Done",
  "Coba Lagi": "Try Again",
  "Bahasa Indonesia": "Indonesian",
  "Indonesia": "Indonesia",
  "Inggris": "English",
};

const INDONESIAN_INTERFACE_COPY = Object.fromEntries(
  Object.entries(ENGLISH_INTERFACE_COPY).map(([indonesian, english]) => [english, indonesian]),
) as Record<string, string>;

function translateInterfaceNode(root: Node, language: "id" | "en") {
  const dictionary = language === "en" ? ENGLISH_INTERFACE_COPY : INDONESIAN_INTERFACE_COPY;
  const translateValue = (value: string) => {
    const trimmed = value.trim();
    const translated = dictionary[trimmed];
    return translated ? value.replace(trimmed, translated) : value;
  };
  const translateTextNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
      const translated = translateValue(node.nodeValue);
      if (translated !== node.nodeValue) node.nodeValue = translated;
    }
  };

  translateTextNode(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) translateTextNode(walker.currentNode);

  const elements = root instanceof Element ? [root, ...root.querySelectorAll<HTMLElement>("*")] : [];
  elements.forEach(element => {
    ["placeholder", "aria-label", "title"].forEach(attribute => {
      const value = element.getAttribute(attribute);
      if (value) element.setAttribute(attribute, translateValue(value));
    });
  });
}

// ─── Image generation ─────────────────────────────────────────────────────────
const IMAGE_KEYWORDS = ["gambar", "ilustrasi", "foto", "visualisasi", "buat gambar", "generate gambar", "buatkan gambar", "bikin gambar", "tampilkan gambar", "render", "desain gambar", "tunjukkan gambar"];

function isImageRequest(text: string): boolean {
  const lower = text.toLowerCase();
  return IMAGE_KEYWORDS.some(k => lower.includes(k));
}

const IMAGE_MAP: { keywords: string[]; url: string; credit: string }[] = [
  { keywords: ["kampus", "universitas", "kuliah", "mahasiswa", "gedung kampus"], url: "https://images.unsplash.com/photo-1562774053-701939374585?w=640&h=400&fit=crop&auto=format", credit: "Unsplash" },
  { keywords: ["perpustakaan", "buku", "library", "membaca"], url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=640&h=400&fit=crop&auto=format", credit: "Unsplash" },
  { keywords: ["skripsi", "penelitian", "jurnal", "tesis", "akademik"], url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=640&h=400&fit=crop&auto=format", credit: "Unsplash" },
  { keywords: ["teknologi", "komputer", "laptop", "coding", "digital", "software"], url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=640&h=400&fit=crop&auto=format", credit: "Unsplash" },
  { keywords: ["alam", "hutan", "pohon", "hijau", "lingkungan", "nature"], url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=640&h=400&fit=crop&auto=format", credit: "Unsplash" },
  { keywords: ["kota", "gedung", "arsitektur", "infrastruktur", "urban"], url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=640&h=400&fit=crop&auto=format", credit: "Unsplash" },
  { keywords: ["data", "grafik", "chart", "statistik", "analisis", "diagram"], url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=400&fit=crop&auto=format", credit: "Unsplash" },
  { keywords: ["ekonomi", "bisnis", "uang", "pasar", "keuangan"], url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=640&h=400&fit=crop&auto=format", credit: "Unsplash" },
  { keywords: ["kesehatan", "medis", "dokter", "rumah sakit", "obat"], url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=640&h=400&fit=crop&auto=format", credit: "Unsplash" },
  { keywords: ["desain", "kreatif", "seni", "art", "warna"], url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=400&fit=crop&auto=format", credit: "Unsplash" },
  { keywords: ["orang", "manusia", "masyarakat", "sosial", "komunitas"], url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=640&h=400&fit=crop&auto=format", credit: "Unsplash" },
  { keywords: ["marketing", "pemasaran", "brand", "iklan", "promosi"], url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=640&h=400&fit=crop&auto=format", credit: "Unsplash" },
];

function getImageUrl(text: string): string {
  const lower = text.toLowerCase();
  for (const entry of IMAGE_MAP) {
    if (entry.keywords.some(k => lower.includes(k))) return entry.url;
  }
  return "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=640&h=400&fit=crop&auto=format";
}

function extractImagePrompt(text: string): string {
  const lower = text.toLowerCase();
  for (const kw of IMAGE_KEYWORDS) {
    const idx = lower.indexOf(kw);
    if (idx !== -1) {
      const after = text.slice(idx + kw.length).trim().replace(/^[:\-–—tentang\s]+/i, "").trim();
      if (after.length > 2) return after.charAt(0).toUpperCase() + after.slice(1);
    }
  }
  return text.trim();
}

// ─── Paraphrase detection ─────────────────────────────────────────────────────
const PARAPHRASE_KEYWORDS = ["parafrase", "parafrasa", "paraphrase", "ubah kalimat", "perbaiki kalimat", "saran kalimat", "variasi kalimat", "rewrite", "tulis ulang", "ganti kata", "sinonim kalimat"];

function isParaphraseRequest(text: string): boolean {
  return PARAPHRASE_KEYWORDS.some(k => text.toLowerCase().includes(k));
}

function extractTargetText(text: string): string {
  const lower = text.toLowerCase();
  for (const kw of PARAPHRASE_KEYWORDS) {
    const idx = lower.indexOf(kw);
    if (idx !== -1) {
      const after = text.slice(idx + kw.length).trim().replace(/^[:\-–—"'\s]+/, "").replace(/["']$/, "").trim();
      if (after.length > 5) return after;
    }
  }
  return text.replace(/parafrase|parafrasa|paraphrase|ubah kalimat|perbaiki kalimat/gi, "").trim() || text;
}

function generateParaphrases(original: string): { label: string; text: string; color: string }[] {
  const s = original.trim().replace(/[.!?]+$/, "");
  return [
    { label: "Formal", color: "#2563eb", text: `Berdasarkan kajian yang dilakukan, ${s.charAt(0).toLowerCase() + s.slice(1)}, sehingga hal ini perlu mendapat perhatian yang lebih mendalam.` },
    { label: "Sederhana", color: "#059669", text: `Intinya, ${s.charAt(0).toLowerCase() + s.slice(1)}. Ini penting untuk dipahami lebih lanjut.` },
    { label: "Akademik", color: "#7c3aed", text: `Hasil temuan menunjukkan bahwa ${s.charAt(0).toLowerCase() + s.slice(1)}, yang relevan dengan konteks penelitian ini (cf. literatur terkait).` },
  ];
}

// ─── Search data ─────────────────────────────────────────────────────────────
const SEARCH_HISTORY = [
  { id: 1, type: "chat", title: "Analisis Website Skripsi", snippet: "...mbingan Skripsi Online Class Program dan membandingkannya dengan konsep sis...", date: "27 Agu", keyword: "Skripsi" },
  { id: 2, type: "chat", title: "Simpulan Dan Prompt Figma Make", snippet: "...itin. ([Skripsita AI](https://skripsita.com/parafrase-online?utm_source=chatgpt.com)...", date: "27 Agu", keyword: "" },
  { id: 3, type: "chat", title: "Judul Skripsi Film", snippet: "Judul Skripsi Film", date: "5 Des 2024", keyword: "Skripsi" },
  { id: 4, type: "dokumen", title: "Buku Penting Skripsi", snippet: "...Penting Skripsi", date: "17 Agu 2023", keyword: "Skripsi" },
  { id: 5, type: "chat", title: "Kesalahan dalam skripsi", snippet: "...n dalam skripsi", date: "22 Agu 2023", keyword: "skripsi" },
  { id: 6, type: "chat", title: "Rangkuman Email QuizLab", snippet: "Rangkuman percakapan tentang jadwal dan target mingguan...", date: "20 Agu 2023", keyword: "" },
  { id: 7, type: "proyek", title: "Metodologi Penelitian", snippet: "Proyek aktif · terakhir diperbarui hari ini", date: "Hari ini", keyword: "" },
  { id: 8, type: "proyek", title: "Skripsi Live Shopping", snippet: "Proyek aktif · terakhir diperbarui 2 hari lalu", date: "29 Agu", keyword: "Skripsi" },
  { id: 9, type: "dokumen", title: "Template BAB I Pendahuluan", snippet: "Dokumen template untuk bab pertama skripsi S1...", date: "15 Jul 2023", keyword: "" },
];

// ─── Highlight bold keyword in text ─────────────────────────────────────────
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((p, i) =>
        regex.test(p) ? <strong key={i} className="font-bold text-slate-900">{p}</strong> : <span key={i}>{p}</span>
      )}
    </>
  );
}

const RECENT_CHATS = [
  "Tampilkan Hasil Ujian Bagus",
  "Ngantuk Setelah Makan Siang",
  "Simpulan Dan Prompt Figma Make",
  "Analisis Website Skripsi",
  "Rangkuman Email QuizLab",
  "Kepanjangan Lucu Tempat",
  "Tulisan Kue Ulang Tahun",
];

const ChatBubbleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

// ─── Search Modal ─────────────────────────────────────────────────────────────
function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SearchFilter>("semua");
  const inputRef = useRef<HTMLInputElement>(null);
  const hasQuery = query.trim().length > 0;

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const FILTERS: { id: SearchFilter; label: string }[] = [
    { id: "semua", label: "Semua" },
    { id: "chat", label: "Chat" },
    { id: "dokumen", label: "Dokumen" },
    { id: "proyek", label: "Proyek" },
  ];

  const filtered = SEARCH_HISTORY.filter((item) => {
    const matchFilter = filter === "semua" || item.type === filter;
    const matchQuery = !query.trim() ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.snippet.toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchQuery;
  });

  const typeIcon = (type: string) => {
    if (type === "dokumen") return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    );
    if (type === "proyek") return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    );
    return <ChatBubbleIcon />;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20"
      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden bg-white"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.18)", border: "1px solid #e5e7eb" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input row */}
        <div className="flex items-center gap-3 px-5 py-4">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari..."
            className="flex-1 bg-transparent text-slate-800 text-base placeholder-slate-400 outline-none"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* ── Empty state: Obrolan terbaru ── */}
        {!hasQuery && (
          <div className="pb-4">
            <p className="px-5 pb-2 text-xs font-semibold text-slate-400">Obrolan terbaru</p>
            {RECENT_CHATS.map((title) => (
              <button
                key={title}
                onClick={onClose}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors text-left group"
              >
                <span className="text-slate-400 group-hover:text-slate-600 transition-colors shrink-0">
                  <ChatBubbleIcon />
                </span>
                <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">{title}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Has query: filter tabs + results ── */}
        {hasQuery && (
          <>
            {/* Filter tabs */}
            <div className="flex items-center gap-1 px-4 pb-2 border-b border-slate-100">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={filter === f.id
                    ? { background: "#3b82f6", color: "#fff" }
                    : { color: "#64748b", background: "transparent" }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-slate-400 text-sm">Tidak ada hasil untuk "<span className="text-slate-700">{query}</span>"</p>
                </div>
              ) : (
                filtered.map((item) => (
                  <button
                    key={item.id}
                    onClick={onClose}
                    className="w-full flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left group"
                  >
                    <span className="text-slate-400 group-hover:text-slate-600 transition-colors mt-0.5 shrink-0">
                      {typeIcon(item.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors truncate">
                        <Highlight text={item.title} query={query} />
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        <Highlight text={item.snippet} query={query} />
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0 mt-0.5">{item.date}</span>
                  </button>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="px-5 py-2.5 border-t border-slate-100 flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[10px]">↑↓</kbd> navigasi
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[10px]">Enter</kbd> buka
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[10px]">Esc</kbd> tutup
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Static data ──────────────────────────────────────────────────────────────
const RECENT: { label: string; time: string; msgs: ChatMsg[] }[] = [
  {
    label: "Ringkasan teori TAM",
    time: "12 menit lalu",
    msgs: [
      { role: "user", text: "Tolong jelaskan teori TAM (Technology Acceptance Model) secara singkat.", time: "10:42" },
      { role: "claro", text: "TAM atau Technology Acceptance Model adalah teori yang dikembangkan oleh Davis (1989) untuk menjelaskan faktor-faktor yang mempengaruhi penerimaan teknologi oleh pengguna. Dua konstruk utamanya:\n\n• **Perceived Usefulness (PU)** — sejauh mana pengguna percaya bahwa sistem akan meningkatkan kinerja mereka.\n• **Perceived Ease of Use (PEOU)** — sejauh mana pengguna percaya bahwa sistem mudah digunakan.\n\nKedua konstruk ini mempengaruhi **Behavioral Intention** yang akhirnya menentukan **Actual Use** dari sistem.", time: "10:42" },
      { role: "user", text: "Apa bedanya dengan UTAUT?", time: "10:45" },
      { role: "claro", text: "UTAUT (Unified Theory of Acceptance and Use of Technology) adalah pengembangan dari TAM dan beberapa teori lain. Perbedaan utamanya:\n\n• TAM fokus pada 2 konstruk (PU & PEOU), sedangkan UTAUT memiliki 4 konstruk utama: Performance Expectancy, Effort Expectancy, Social Influence, dan Facilitating Conditions.\n• UTAUT juga mempertimbangkan variabel moderator seperti gender, usia, dan pengalaman.\n• Untuk skripsi, TAM lebih sering digunakan karena lebih sederhana dan banyak referensinya.", time: "10:46" },
    ],
  },
  {
    label: "Kuantitatif vs Kualitatif",
    time: "2 jam lalu",
    msgs: [
      { role: "user", text: "Apa perbedaan penelitian kuantitatif dan kualitatif? Buat perbandingannya.", time: "11:30" },
      { role: "claro", text: `Berikut perbandingan lengkap antara penelitian kuantitatif dan kualitatif — dua pendekatan utama yang paling sering digunakan dalam skripsi dan tesis di Indonesia.

## Perbandingan Penelitian Kuantitatif vs Kualitatif

| Aspek | Kuantitatif | Kualitatif |
|-------|-------------|------------|
| **Tujuan** | Mengukur, menguji hipotesis, mencari hubungan sebab-akibat | Memahami makna, persepsi, dan pengalaman secara mendalam |
| **Data** | Angka, statistik, hasil survei/kuesioner | Kata-kata, narasi, hasil wawancara/observasi |
| **Sampel** | Besar (100–500+ responden), representatif | Kecil (10–30 informan), purposive |
| **Instrumen** | Kuesioner skala Likert, tes, eksperimen | Panduan wawancara, catatan lapangan |
| **Analisis** | SPSS, SmartPLS, regresi, SEM, ANOVA | Thematic analysis, coding, NVivo |
| **Hasil** | Generalisasi ke populasi yang lebih luas | Pemahaman mendalam pada konteks tertentu |
| **Waktu** | Relatif lebih singkat (survei digital) | Lebih lama (perlu wawancara mendalam) |

## Kapan Memilih Kuantitatif?

Pilih pendekatan kuantitatif ketika kamu ingin menguji **pengaruh atau hubungan** antar variabel secara statistik, mengumpulkan data dari jumlah responden yang besar dalam waktu singkat, dan mendapatkan hasil yang bisa digeneralisasikan ke populasi lebih luas. Teori yang sering dipakai: TAM, UTAUT, Theory of Planned Behavior.

## Kapan Memilih Kualitatif?

Gunakan pendekatan kualitatif jika ingin mengeksplorasi **fenomena baru** yang belum banyak diteliti, memahami perspektif dan pengalaman individu secara mendalam, atau menjawab pertanyaan yang dimulai dengan "Bagaimana" atau "Mengapa".

## Pilihan Ketiga: Mixed Methods

Banyak peneliti sekarang memilih *mixed methods* — menggabungkan keduanya:

1. **Sequential Explanatory** — mulai dengan kuantitatif, lalu perdalam dengan kualitatif
2. **Sequential Exploratory** — mulai kualitatif untuk membangun instrumen, lalu kuantitatif untuk validasi
3. **Concurrent Triangulation** — keduanya berjalan paralel dan hasilnya dibandingkan

Mau aku bantu tentukan mana yang paling cocok untuk topik penelitianmu?`, time: "11:31" },
    ],
  },
  {
    label: "Ide judul live shopping",
    time: "Kemarin",
    msgs: [
      { role: "user", text: "Saya sedang mencari judul skripsi tentang live shopping, ada ide?", time: "14:20" },
      { role: "claro", text: "Tentu! Berikut beberapa kandidat judul untuk topik live shopping:\n\n1. **Pengaruh Interaktivitas Live Shopping terhadap Keputusan Pembelian Impulsif di TikTok Shop**\n2. **Analisis Faktor-Faktor yang Mempengaruhi Kepercayaan Konsumen dalam Live Commerce**\n3. **Peran Kredibilitas Streamer pada Intensi Pembelian melalui Platform Live Shopping**\n4. **Pengaruh Scarcity Appeal dan Social Proof dalam Live Shopping terhadap Purchase Intention**\n\nMana yang paling sesuai dengan minat dan data yang bisa kamu akses?", time: "14:21" },
      { role: "user", text: "Yang nomor 1 menarik, bisa bantu rumusan masalahnya?", time: "14:23" },
      { role: "claro", text: "Berikut rumusan masalah untuk judul tersebut:\n\n1. Apakah interaktivitas live shopping berpengaruh signifikan terhadap keputusan pembelian impulsif?\n2. Apakah engagement streamer memoderasi hubungan antara interaktivitas dan keputusan pembelian impulsif?\n3. Seberapa besar pengaruh interaktivitas live shopping terhadap keputusan pembelian impulsif konsumen TikTok Shop di Indonesia?\n\nSaya sarankan fokus ke 1-2 rumusan agar penelitian lebih terarah.", time: "14:24" },
    ],
  },
  {
    label: "Revisi rumusan masalah",
    time: "27 Agu",
    msgs: [
      { role: "user", text: "Tolong periksa rumusan masalah skripsi saya: 'Apakah terdapat pengaruh kualitas pelayanan terhadap kepuasan pelanggan pada aplikasi ojek online?'", time: "09:10" },
      { role: "claro", text: "Rumusan masalahnya sudah cukup baik, tapi ada beberapa yang bisa diperkuat:\n\n**Versi yang lebih kuat:**\n*'Apakah kualitas pelayanan (service quality) berpengaruh signifikan terhadap kepuasan pelanggan (customer satisfaction) pengguna aplikasi ojek online di Indonesia?'*\n\n**Saran perbaikan:**\n• Tambahkan objek penelitian yang lebih spesifik (misalnya: Gojek, Grab, atau keduanya)\n• Tentukan populasi yang jelas (pengguna aktif, mahasiswa, dsb)\n• Pertimbangkan dimensi kualitas pelayanan apa yang akan diukur (SERVQUAL: reliability, responsiveness, assurance, empathy, tangibles)", time: "09:11" },
    ],
  },
];

const DEADLINES = [
  { label: "Presentasi Riset Pasar", time: "Besok · 09.00", color: "#ef4444" },
  { label: "Revisi Kerangka BAB I", time: "31 Agu · 23.59", color: "#f59e0b" },
  { label: "QUIZLAB Semester 6", time: "3 Sep · 20.00", color: "#3b82f6" },
  { label: "Target baru 4", time: "Belum dijadwalkan", color: "#8b5cf6" },
];

const FEATURES = [
  { icon: "📖", title: "Mata Kuliah", desc: "Jelaskan materi, buat rangkuman, contoh, dan latihan sesuai mata kuliahmu.", color: "#3b82f6", bg: "#eff6ff" },
  { icon: "📋", title: "Tugas", desc: "Pahami instruksi dosen dan ubah tugas menjadi langkah kerja yang jelas.", color: "#8b5cf6", bg: "#f5f3ff" },
  { icon: "🎓", title: "Skripsi / Tesis", desc: "Dapatkan arahan berdasarkan tahap penelitian dan revisi yang sedang kamu hadapi.", color: "#059669", bg: "#ecfdf5" },
  { icon: "💡", title: "Cari Judul", desc: "Gabungkan minat, fenomena, objek, dan metode menjadi kandidat judul yang layak.", color: "#d97706", bg: "#fffbeb" },
  { icon: "🔍", title: "Cari Jurnal", desc: "Cari sumber berdasarkan topik, tahun, indeks, dan tujuan penggunaannya.", color: "#0284c7", bg: "#f0f9ff" },
  { icon: "✏️", title: "Alat Penulisan", desc: "Periksa typo, gaya akademik, parafrase, dan konsistensi tulisanmu.", color: "#dc2626", bg: "#fef2f2" },
];

const SHORTCUTS = [
  { icon: "📖", title: "Mata Kuliah", desc: "Pahami materi sulit", color: "#3b82f6", bg: "#eff6ff" },
  { icon: "📋", title: "Tugas", desc: "Pecah jadi lebih ringan", color: "#8b5cf6", bg: "#f5f3ff" },
  { icon: "🎓", title: "Skripsi / Tesis", desc: "Dari topik hingga sidang", color: "#059669", bg: "#ecfdf5" },
  { icon: "💡", title: "Cari Judul", desc: "Temukan arah penelitian", color: "#d97706", bg: "#fffbeb" },
];

const PROJECTS: { title: string; updated: string; status: string; emoji: string; msgs: ChatMsg[] }[] = [
  {
    title: "Metodologi Penelitian", updated: "Terakhir diperbarui hari ini", status: "Aktif", emoji: "🔬",
    msgs: [
      { role: "user", text: "Alerin, bantu aku menyusun metodologi penelitian untuk skripsi tentang penggunaan AI di pendidikan tinggi.", time: "09.12" },
      { role: "claro", text: "Tentu! Untuk topik penggunaan AI di pendidikan tinggi, berikut struktur metodologi yang bisa kamu gunakan:\n\n**Pendekatan:** Penelitian kuantitatif dengan survei\n**Populasi & Sampel:** Mahasiswa aktif S1, teknik purposive sampling\n**Instrumen:** Kuesioner berbasis skala Likert (TAM/UTAUT)\n**Analisis:** Structural Equation Modeling (SEM) atau regresi berganda\n\nApakah kamu sudah menentukan variabel penelitiannya?", time: "09.13" },
      { role: "user", text: "Variabelnya: variabel bebas = kemudahan penggunaan AI, variabel terikat = hasil belajar mahasiswa.", time: "09.15" },
      { role: "claro", text: "Bagus! Dengan dua variabel itu, kamu bisa gunakan **regresi linear sederhana**. Tambahkan juga variabel mediasi seperti 'motivasi belajar' agar penelitianmu lebih kaya. Judul yang cocok: *'Pengaruh Kemudahan Penggunaan AI terhadap Hasil Belajar Mahasiswa dengan Motivasi Belajar sebagai Variabel Mediasi'*.", time: "09.16" },
    ],
  },
  {
    title: "Skripsi Live Shopping", updated: "Terakhir diperbarui 2 hari lalu", status: "Aktif", emoji: "🛍️",
    msgs: [
      { role: "user", text: "Aku sedang mengerjakan skripsi tentang live shopping di TikTok. Bisa bantu outline BAB II?", time: "14.30" },
      { role: "claro", text: "Siap! Berikut outline BAB II untuk skripsi Live Shopping TikTok:\n\n**2.1 Live Commerce & Live Shopping**\n— Definisi dan perkembangan\n— Karakteristik unik live shopping\n\n**2.2 Perilaku Konsumen Online**\n— Teori TPB (Theory of Planned Behavior)\n— Impulse buying behavior\n\n**2.3 TikTok sebagai Platform Live Shopping**\n— Fitur dan ekosistem TikTok Shop\n— Data pengguna di Indonesia\n\n**2.4 Penelitian Terdahulu**\n— Tabel matriks minimal 15 jurnal\n\nMau saya bantu cari referensi jurnalnya?", time: "14.31" },
      { role: "user", text: "Iya, tolong carikan 3 jurnal internasional yang relevan.", time: "14.33" },
      { role: "claro", text: "Berikut 3 jurnal internasional yang relevan:\n\n1. **Sun et al. (2022)** — *'Live streaming commerce and consumers' purchase intention'* — Journal of Retailing and Consumer Services\n2. **Wongkitrungrueng & Assarut (2020)** — *'The role of live streaming in building consumer trust'* — Journal of Business Research\n3. **Xu et al. (2020)** — *'Investigating consumer impulsive purchase intentions on social media'* — International Journal of Information Management\n\nSemua tersedia di Scopus/WoS. Perlu bantuan sintesis teorinya?", time: "14.35" },
    ],
  },
  {
    title: "Persiapan UAS", updated: "Terakhir diperbarui 3 hari lalu", status: "Aktif", emoji: "📚",
    msgs: [
      { role: "user", text: "Bantu aku membuat rangkuman materi Sistem Informasi Manajemen untuk UAS.", time: "20.00" },
      { role: "claro", text: "Berikut rangkuman SIM untuk UAS:\n\n**Topik Utama:**\n• Konsep dasar sistem informasi & komponen\n• Decision Support System (DSS) vs Executive IS\n• ERP, CRM, SCM — integrasi bisnis\n• E-commerce & digital transformation\n• Keamanan informasi & etika SI\n\n**Soal yang sering muncul:**\n1. Perbedaan data, informasi, pengetahuan\n2. Contoh penerapan ERP di perusahaan\n3. Ancaman keamanan siber dan penanganannya\n\nMau dibuatkan latihan soal?", time: "20.01" },
    ],
  },
  {
    title: "Catatan Alerin 4", updated: "Terakhir diperbarui 4 hari lalu", status: "Aktif", emoji: "📝",
    msgs: [
      { role: "user", text: "Simpan catatan ini: rumusan masalah skripsi saya adalah pengaruh media sosial terhadap produktivitas belajar mahasiswa.", time: "11.00" },
      { role: "claro", text: "Catatan tersimpan! ✅\n\n**Rumusan Masalah:**\n*'Apakah penggunaan media sosial berpengaruh signifikan terhadap produktivitas belajar mahasiswa?'*\n\nSaran perbaikan agar lebih akademis:\n*'Seberapa besar pengaruh intensitas penggunaan media sosial terhadap produktivitas belajar mahasiswa Universitas X angkatan 2022-2024?'*\n\nMau saya bantu kembangkan menjadi hipotesis penelitian?", time: "11.01" },
      { role: "user", text: "Iya, buatkan hipotesisnya.", time: "11.03" },
      { role: "claro", text: "**Hipotesis Penelitian:**\n\n**H₀:** Intensitas penggunaan media sosial tidak berpengaruh signifikan terhadap produktivitas belajar mahasiswa.\n\n**H₁:** Intensitas penggunaan media sosial berpengaruh signifikan dan negatif terhadap produktivitas belajar mahasiswa.\n\nUji dengan uji-t (parsial) pada signifikansi α = 0,05.", time: "11.04" },
    ],
  },
];

const QUIZ_QUESTIONS = [
  {
    q: "Menurut Technology Acceptance Model, dua faktor utama yang memengaruhi penerimaan teknologi adalah...",
    opts: ["Harga dan promosi", "Kemudahan dan manfaat yang dirasakan", "Usia dan jenis kelamin", "Kecepatan internet dan desain logo"],
    correct: 1,
  },
  {
    q: "Metode penelitian yang mengumpulkan data dalam bentuk angka dan dianalisis secara statistik disebut...",
    opts: ["Kualitatif", "Studi kasus", "Kuantitatif", "Etnografi"],
    correct: 2,
  },
  {
    q: "Teknik pengambilan sampel yang memberikan peluang yang sama bagi setiap anggota populasi disebut...",
    opts: ["Purposive sampling", "Snowball sampling", "Random sampling", "Quota sampling"],
    correct: 2,
  },
];

const AI_RESPONSES: [RegExp, string][] = [
  [/python|kode python|contoh python|buat fungsi|function python/i, `Tentu! Berikut contoh kode Python yang bisa kamu pakai untuk analisis data sederhana menggunakan pandas — sangat berguna untuk skripsi kuantitatif.

\`\`\`python
import pandas as pd
import numpy as np

# Membaca data kuesioner dari CSV
df = pd.read_csv("data_kuesioner.csv")

# Hitung mean dan standar deviasi tiap variabel
variables = ["X1", "X2", "Y"]
for var in variables:
    mean = df[var].mean()
    std = df[var].std()
    print(f"{var}: Mean={mean:.2f}, SD={std:.2f}")

# Uji korelasi Pearson
corr_matrix = df[variables].corr()
print(corr_matrix)
\`\`\`

## Penjelasan Kode

- **pandas** digunakan untuk membaca dan memanipulasi data tabel
- **numpy** untuk operasi matematis dasar
- \`df.corr()\` menghasilkan matriks korelasi antar variabel

Mau saya tambahkan regresi linear atau uji normalitas Kolmogorov-Smirnov?`],

  [/sql|database|query|tabel database|struktur db/i, `Berikut contoh struktur database dan query SQL untuk sistem akademik sederhana — cocok untuk skripsi berbasis sistem informasi.

\`\`\`sql
-- Buat tabel mahasiswa
CREATE TABLE mahasiswa (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  nim         VARCHAR(12) NOT NULL UNIQUE,
  nama        VARCHAR(100) NOT NULL,
  jurusan_id  INT,
  angkatan    YEAR,
  ipk         DECIMAL(3,2)
);

-- Query mahasiswa aktif dengan IPK di atas 3.0
SELECT m.nim, m.nama, j.nama AS jurusan, m.ipk
FROM mahasiswa m
JOIN jurusan j ON m.jurusan_id = j.id
WHERE m.ipk >= 3.0
ORDER BY m.ipk DESC
LIMIT 10;
\`\`\`

## Tips Desain Database Akademik

- Gunakan \`foreign key\` untuk menjaga integritas relasi antar tabel
- Beri indeks pada kolom yang sering dijadikan filter (\`nim\`, \`ipk\`)
- Normalkan hingga 3NF untuk menghindari redundansi data`],

  [/javascript|js|react|html|css|web|frontend|backend|api/i, `Berikut contoh kode JavaScript/React yang bisa kamu jadikan referensi untuk pengembangan aplikasi web sebagai objek penelitian atau implementasi skripsi.

\`\`\`javascript
// Contoh fetch data dari REST API
async function fetchMahasiswaData(nim) {
  try {
    const response = await fetch(\`/api/mahasiswa/\${nim}\`);

    if (!response.ok) {
      throw new Error("Data tidak ditemukan");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

// Gunakan fungsi di atas
const mahasiswa = await fetchMahasiswaData("12345678");
console.log(mahasiswa.nama, mahasiswa.ipk);
\`\`\`

## Poin Penting untuk Laporan

- **async/await** membuat kode asinkron lebih mudah dibaca
- Selalu tangani error dengan \`try/catch\`
- Dokumentasikan setiap endpoint API di BAB III metodologi`],

  [/kuantitatif.*kualitatif|kualitatif.*kuantitatif|perbandingan.*metode|beda.*kuantitatif|beda.*kualitatif/i, `Berikut perbandingan lengkap antara penelitian kuantitatif dan kualitatif — dua pendekatan utama yang paling sering digunakan dalam skripsi dan tesis di Indonesia.

## Perbandingan Penelitian Kuantitatif vs Kualitatif

| Aspek | Kuantitatif | Kualitatif |
|-------|-------------|------------|
| **Tujuan** | Mengukur, menguji hipotesis, mencari hubungan sebab-akibat | Memahami makna, persepsi, dan pengalaman secara mendalam |
| **Data** | Angka, statistik, hasil survei/kuesioner | Kata-kata, narasi, hasil wawancara/observasi |
| **Sampel** | Besar (100–500+ responden), representatif | Kecil (10–30 informan), purposive |
| **Instrumen** | Kuesioner skala Likert, tes, eksperimen | Panduan wawancara, catatan lapangan |
| **Analisis** | SPSS, SmartPLS, regresi, SEM, ANOVA | Thematic analysis, coding, NVivo |
| **Hasil** | Generalisasi ke populasi yang lebih luas | Pemahaman mendalam pada konteks tertentu |
| **Waktu** | Relatif lebih singkat (survei digital) | Lebih lama (perlu wawancara mendalam) |
| **Validitas** | Diuji secara statistik (Cronbach Alpha, AVE) | Diuji melalui triangulasi dan member checking |

## Kapan Memilih Kuantitatif?

Pilih pendekatan kuantitatif ketika kamu ingin:

- Menguji **pengaruh atau hubungan** antara variabel secara statistik
- Mengumpulkan data dari **jumlah responden yang besar** dalam waktu singkat
- Mendapatkan hasil yang bisa **digeneralisasikan** ke populasi yang lebih luas
- Menggunakan teori yang sudah mapan seperti TAM, UTAUT, atau Theory of Planned Behavior

## Kapan Memilih Kualitatif?

Gunakan pendekatan kualitatif jika kamu ingin:

- Mengeksplorasi **fenomena baru** yang belum banyak diteliti
- Memahami **perspektif dan pengalaman** individu secara mendalam
- Meneliti topik yang **sensitif atau kompleks** yang sulit diukur dengan angka
- Menjawab pertanyaan penelitian yang dimulai dengan "Bagaimana" atau "Mengapa"

## Mixed Methods: Pilihan Terbaik?

Banyak peneliti sekarang memilih *mixed methods* — menggabungkan keduanya. Misalnya:

1. **Sequential Explanatory** — mulai dengan kuantitatif, lalu perdalam dengan kualitatif
2. **Sequential Exploratory** — mulai kualitatif untuk membangun instrumen, lalu kuantitatif untuk validasi
3. **Concurrent Triangulation** — keduanya berjalan paralel dan hasilnya dibandingkan

Mau aku bantu tentukan mana yang paling cocok untuk topik penelitianmu?`],

  [/skripsi|tesis|penelitian/i, `Tentu, aku siap mendampingi perjalanan skripsimu dari awal hingga sidang. Berikut panduan lengkapnya.

## Struktur Skripsi yang Benar

Skripsi pada umumnya terdiri dari lima bab utama, masing-masing dengan peran yang sangat spesifik:

| Bab | Judul | Isi Utama |
|-----|-------|-----------|
| **BAB I** | Pendahuluan | Latar belakang, rumusan masalah, tujuan, manfaat, dan batasan penelitian |
| **BAB II** | Kajian Pustaka | Landasan teori, penelitian terdahulu, kerangka konseptual, dan hipotesis |
| **BAB III** | Metodologi | Desain penelitian, populasi & sampel, instrumen, prosedur pengumpulan data, teknik analisis |
| **BAB IV** | Hasil & Pembahasan | Deskripsi data, hasil uji statistik/analisis, pembahasan dikaitkan dengan teori |
| **BAB V** | Penutup | Kesimpulan, implikasi, keterbatasan, dan saran untuk penelitian selanjutnya |

## Tips Menulis Latar Belakang yang Kuat

Latar belakang adalah kesan pertama yang dinilai dosen pembimbing. Gunakan struktur ini:

1. **Mulai dari hal umum** — gambaran besar topik atau fenomena yang sedang terjadi
2. **Perkecil ke masalah spesifik** — data statistik, fakta, atau gap yang ada di lapangan
3. **Tunjukkan urgensi** — mengapa masalah ini penting untuk diteliti sekarang?
4. **Hubungkan ke penelitianmu** — bagaimana penelitianmu akan berkontribusi?

## Timeline Pengerjaan yang Realistis

- **Bulan 1–2:** Penentuan topik, konsultasi pembimbing, penyusunan proposal
- **Bulan 3–4:** Studi literatur mendalam, penyempurnaan BAB I dan II
- **Bulan 5–6:** Pengumpulan data, penyusunan BAB III
- **Bulan 7–8:** Analisis data, penulisan BAB IV dan V
- **Bulan 9:** Revisi final, persiapan sidang

Ceritakan topik penelitianmu dan di mana kamu sekarang dalam proses pengerjaannya — aku akan bantu yang paling dibutuhkan!`],

  [/judul|topik/i, `Menemukan judul skripsi yang kuat adalah langkah pertama yang sangat menentukan. Mari kita bahas secara menyeluruh.

## Formula Judul yang Efektif

Judul penelitian yang baik biasanya mengikuti pola berikut:

*"Pengaruh/Hubungan/Analisis [Variabel X] terhadap [Variabel Y] pada [Objek Penelitian] di [Lokasi/Konteks]"*

Atau untuk penelitian kualitatif:

*"Strategi/Persepsi/Pengalaman [Subjek] dalam [Fenomena] di [Konteks]"*

## Kriteria Judul yang Baik

- **Spesifik** — hindari kata-kata terlalu umum seperti "dampak" atau "analisis" tanpa konteks
- **Terukur** — variabel yang disebutkan harus bisa dioperasionalkan
- **Relevan** — berkaitan dengan isu yang sedang aktual dan punya referensi yang cukup
- **Feasible** — data harus bisa kamu akses dalam waktu dan sumber daya yang kamu miliki

## Topik Riset yang Sedang Relevan (2024–2026)

| Bidang | Contoh Topik | Keterangan |
|--------|-------------|------------|
| **Digital Marketing** | Live shopping, influencer marketing, TikTok commerce | Banyak data primer tersedia |
| **AI & Pendidikan** | Penggunaan ChatGPT dalam belajar, AI literacy mahasiswa | Sangat baru, sumber berkembang cepat |
| **Fintech** | QRIS adoption, pinjol, e-wallet behavior | Regulasi OJK banyak tersedia |
| **Sustainability** | Green purchase intention, ESG awareness generasi Z | Tren global yang masuk Indonesia |
| **Kesehatan Mental** | Well-being mahasiswa, burnout, akademik-karir | Isu yang terus relevan pasca pandemi |

## Langkah Menemukan Judulmu

1. **Identifikasi minatmu** — bidang apa yang paling menarik bagimu?
2. **Cek ketersediaan data** — apakah ada survei yang bisa kamu lakukan, atau data sekunder yang tersedia?
3. **Baca 5–10 jurnal terbaru** — lihat celah penelitian (*research gap*) yang bisa kamu isi
4. **Konsultasikan ke dosen** — pastikan topikmu sesuai dengan bidang pembimbingmu

Ceritakan minat dan bidang studimu — aku bantu rumuskan 3–5 kandidat judul yang kuat!`],

  [/metode|metodologi/i, `Metodologi penelitian adalah jantung dari skripsimu — menentukan bagaimana kamu mengumpulkan dan menganalisis data untuk menjawab rumusan masalah.

## Perbandingan Pendekatan Penelitian

| Aspek | Kuantitatif | Kualitatif | Mixed Methods |
|-------|-------------|------------|---------------|
| **Tujuan** | Menguji hipotesis, mengukur hubungan | Memahami makna & konteks | Keduanya |
| **Data** | Angka, statistik | Narasi, wawancara | Kombinasi |
| **Sampel** | Besar (100–500+) | Kecil (10–30) | Variatif |
| **Analisis** | SPSS, SmartPLS, AMOS | NVivo, Atlas.ti, manual | Keduanya |
| **Waktu** | Relatif singkat | Lebih lama | Terlama |

## Teknik Sampling yang Umum Digunakan

Pemilihan sampel sangat menentukan validitas penelitianmu:

- **Purposive Sampling** — dipilih berdasarkan kriteria tertentu yang relevan dengan tujuan penelitian
- **Simple Random Sampling** — setiap anggota populasi punya peluang sama untuk terpilih
- **Stratified Sampling** — populasi dibagi ke dalam kelompok (strata), lalu diambil sampel dari setiap strata
- **Snowball Sampling** — cocok untuk populasi tersembunyi, informan pertama merekomendasikan berikutnya

## Teknik Analisis Data Kuantitatif

| Teknik | Kegunaan | Software |
|--------|----------|----------|
| **Regresi Linier** | Pengaruh 1 variabel independen ke dependen | SPSS |
| **Regresi Berganda** | Pengaruh beberapa variabel independen | SPSS |
| **SEM-PLS** | Model kompleks dengan variabel laten | SmartPLS |
| **SEM-CB** | Konfirmasi model teori | AMOS |
| **Uji T / ANOVA** | Perbandingan antar kelompok | SPSS |
| **Analisis Faktor** | Reduksi variabel / validasi konstruk | SPSS |

## Uji Validitas dan Reliabilitas

Sebelum analisis utama, kamu wajib membuktikan instrumenmu valid dan reliabel:

1. **Uji Validitas** — menggunakan *Corrected Item-Total Correlation* atau *Factor Loading* (nilai > 0,4)
2. **Uji Reliabilitas** — *Cronbach's Alpha* harus ≥ 0,70 untuk dinyatakan reliabel
3. **AVE (Average Variance Extracted)** — nilai > 0,50 menunjukkan *convergent validity* yang baik
4. **Discriminant Validity** — nilai AVE harus lebih besar dari kuadrat korelasi antar konstruk

Bagikan topik dan rumusan masalahmu, aku bantu tentukan metode dan teknik analisis yang paling tepat!`],

  [/tugas|pr|essay/i, `Baik! Mari kita buat tugasmu lebih terstruktur dan mudah dikerjakan dengan framework yang terbukti efektif.

## Framework Pengerjaan Tugas Akademik

Setiap tugas akademik — baik essay, laporan, makalah, atau studi kasus — bisa dipecah ke dalam lima tahap berikut:

1. **Analisis Instruksi** — baca rubrik penilaian dan tandai kata kunci seperti "analisis", "bandingkan", "evaluasi"
2. **Mind Mapping** — petakan semua ide awal tanpa filter selama 10–15 menit
3. **Riset Terarah** — cari 5–10 sumber terpercaya yang relevan langsung ke poin utama
4. **Penulisan Draft** — tulis kasar tanpa mengedit, targetkan jumlah kata yang diminta
5. **Revisi Bertahap** — edit struktur → argumen → bahasa → format → referensi

## Struktur Essay Akademik yang Ideal

| Bagian | Proporsi | Isi |
|--------|----------|-----|
| **Pendahuluan** | 10–15% | Hook, latar belakang, thesis statement |
| **Tinjauan Pustaka** | 20–25% | Teori & penelitian pendukung |
| **Pembahasan** | 50–60% | Analisis mendalam, argumen utama |
| **Kesimpulan** | 10–15% | Ringkasan, implikasi, saran |
| **Referensi** | — | Semua sumber yang dikutip |

## Tips Menulis yang Efektif

- **Satu paragraf, satu ide** — setiap paragraf punya *topic sentence* yang jelas di awal
- **Gunakan transisi** — kata penghubung seperti "Selain itu", "Lebih lanjut", "Sebaliknya" membuat tulisan mengalir
- **Hindari paragraf pendek** — minimal 4–5 kalimat per paragraf
- **Kutip dengan benar** — setiap klaim yang bukan pendapat pribadi harus ada sumbernya
- **Baca nyaring** — cara terbaik mendeteksi kalimat yang janggal atau tidak mengalir

## Kesalahan Umum yang Harus Dihindari

- Plagiarisme — gunakan parafrase yang baik dan selalu cantumkan sumber
- Terlalu banyak kutipan langsung — maksimal 20% dari keseluruhan tulisan
- Kalimat terlalu panjang — idealnya satu kalimat maksimal 25–30 kata
- Tidak menjawab pertanyaan soal secara langsung

Bagikan instruksi tugasmu atau pertanyaan esainya, aku bantu buat outline dan draf pertamanya!`],

  [/jurnal|referensi|sumber/i, `Mencari dan menggunakan jurnal akademik dengan tepat adalah keterampilan paling penting dalam penelitian. Berikut panduan lengkapnya.

## Database Jurnal Terpercaya

| Database | Akses | Keunggulan | Terbaik untuk |
|----------|-------|------------|---------------|
| **Google Scholar** | Gratis | Cakupan luas, mudah digunakan | Pencarian awal, semua bidang |
| **Scopus** | Berbayar (via kampus) | Terindeks internasional, impact factor | Jurnal Q1–Q4 internasional |
| **Web of Science** | Berbayar (via kampus) | Sangat selektif, citation tracking | Riset bergengsi |
| **Sinta** | Gratis | Jurnal nasional terindeks | Wajib untuk skripsi S1 |
| **DOAJ** | Gratis | Open access, unduh bebas | Referensi tambahan |
| **ResearchGate** | Gratis | Bisa minta PDF langsung ke penulis | Jurnal yang tidak bisa diakses |

## Strategi Pencarian yang Efektif

1. **Gunakan Boolean operators** — AND, OR, NOT untuk memperluas atau mempersempit hasil
2. **Coba variasi kata kunci** — gabungkan Bahasa Indonesia dan Inggris
3. **Gunakan tanda kutip** — "purchase intention" untuk frasa yang tepat
4. **Filter tahun** — prioritaskan 5 tahun terakhir (2020–2026), kecuali teori seminal
5. **Lacak referensi** — lihat daftar pustaka jurnal yang relevan untuk menemukan sumber lain
6. **Cek jumlah sitasi** — semakin banyak dikutip, semakin berpengaruh jurnal tersebut

## Format Sitasi APA 7th Edition

Format yang paling umum digunakan di Indonesia:

- **Jurnal:** Penulis, A. A., & Penulis, B. B. (Tahun). Judul artikel. *Nama Jurnal*, *Volume*(Nomor), halaman–halaman. https://doi.org/xxxxx
- **Buku:** Penulis, A. A. (Tahun). *Judul buku* (Edisi ke-X). Penerbit.
- **Situs web:** Penulis, A. A. (Tahun, Tanggal Bulan). *Judul halaman*. Nama situs. URL

## Cara Menilai Kualitas Jurnal

- **Impact Factor (IF)** — makin tinggi, makin berpengaruh jurnalnya
- **Quartile (Q1–Q4)** — Q1 adalah yang terbaik dalam bidangnya
- **H-Index penulis** — menunjukkan produktivitas dan sitasi sang peneliti
- **Peer-reviewed** — pastikan artikel sudah melalui proses review sejawat

Sebutkan topik penelitianmu — aku rekomendasikan 5–10 jurnal paling relevan yang bisa kamu gunakan!`],

  [/halo|hai|hi|hello/i, `Halo! Senang bertemu kamu di sini. Aku **Alerin**, asisten akademik AI yang dirancang khusus untuk membantu mahasiswa Indonesia menghadapi tantangan dunia perkuliahan.

## Yang Bisa Aku Bantu

- **Skripsi & Tesis** — dari menentukan topik, menulis setiap bab, hingga persiapan sidang
- **Tugas & Essay** — membuat outline, memperkuat argumen, dan memperbaiki tulisanmu
- **Metodologi** — memilih metode yang tepat, memahami statistik, dan menganalisis data
- **Jurnal & Referensi** — mencari, menyintesis, dan mensitasi sumber akademik
- **Persiapan Ujian** — merangkum materi, membuat catatan, dan latihan soal
- **Parafrase & Plagiarisme** — membantu kamu menulis ulang dengan bahasa sendiri

## Cara Mendapatkan Hasil Terbaik dari Aku

1. **Semakin detail pertanyaanmu, semakin baik jawabanku** — ceritakan konteks, jurusan, semester, dan apa yang sudah kamu coba
2. **Gunakan kategori di bawah** — pilih "Metodologi", "Penulisan", atau topik lain untuk jawaban yang lebih terarah
3. **Tindak lanjuti** — jangan ragu untuk meminta penjelasan lebih lanjut atau contoh konkret

Ceritakan apa yang sedang kamu kerjakan hari ini, dan kita mulai bersama!`],
];

function getAIResponse(msg: string): string {
  for (const [pattern, resp] of AI_RESPONSES) {
    if (pattern.test(msg)) return resp;
  }
  return `Pertanyaan yang menarik! Izinkan aku memberikan jawaban yang terstruktur dan komprehensif.

## Pemahaman Awal

Sebelum aku menjawab lebih mendalam, ada beberapa hal yang perlu kamu pahami terkait topik ini. Setiap pertanyaan akademik biasanya memiliki beberapa dimensi yang perlu dijawab secara bertahap — mulai dari konsep dasar, penerapannya, hingga implikasi praktisnya dalam konteks penelitian atau pembelajaran.

## Yang Perlu Kamu Pertimbangkan

- **Konteks:** Apakah ini untuk skripsi, tugas kuliah, atau keperluan belajar mandiri?
- **Tingkat kedalaman:** Apakah kamu butuh penjelasan dasar atau analisis yang lebih mendalam?
- **Aplikasi:** Bagaimana jawaban ini akan kamu gunakan dalam pekerjaan akademikmu?

## Langkah Selanjutnya

1. Ceritakan lebih detail tentang pertanyaanmu — latar belakang masalah, bidang studi, dan apa yang sudah kamu coba cari sebelumnya
2. Jika ini berkaitan dengan penelitian, sebutkan metode dan variabel yang kamu gunakan
3. Bagikan draf atau tulisanmu jika ada, aku bantu perbaiki dan perkuat argumennya

Semakin spesifik pertanyaanmu, semakin tepat dan berguna jawaban yang bisa aku berikan. Yuk, ceritakan lebih lanjut!`;
}

const SUGGESTION_MAP: { pattern: RegExp; suggestions: string[] }[] = [
  { pattern: /TAM|UTAUT|technology acceptance/i, suggestions: ["Jelaskan konstruk TAM lebih detail", "Contoh kuesioner TAM siap pakai", "Bandingkan TAM dengan UTAUT2"] },
  { pattern: /metodologi|kuantitatif|kualitatif|survei|sampel/i, suggestions: ["Berapa minimal sampel yang valid?", "Perbedaan validitas & reliabilitas", "Teknik sampling mana yang cocok?"] },
  { pattern: /rumusan masalah|hipotesis/i, suggestions: ["Bantu kembangkan hipotesisnya", "Saran variabel penelitian tambahan", "Cek apakah rumusannya sudah tajam"] },
  { pattern: /judul|topik/i, suggestions: ["Saran judul lebih spesifik", "Bantu buat latar belakang masalah", "Cari jurnal pendukung topik ini"] },
  { pattern: /bab|outline|struktur|daftar isi/i, suggestions: ["Bantu tulis BAB I secara lengkap", "Saran referensi untuk BAB II", "Outline BAB III metodologi"] },
  { pattern: /jurnal|referensi|literatur|pustaka/i, suggestions: ["Cari 5 jurnal Scopus yang relevan", "Cara sitasi APA 7 yang benar", "Buat matriks literatur review"] },
  { pattern: /parafrase|parafrasa/i, suggestions: ["Parafrase paragraf lainnya", "Tips hindari plagiarisme akademik", "Perbedaan parafrase dan kutipan"] },
  { pattern: /analisis|SEM|regresi|SPSS|SmartPLS/i, suggestions: ["Cara membaca output regresi", "Uji apa saja yang perlu dilakukan?", "Bantu interpretasi hasil SEM"] },
  { pattern: /revisi|perbaiki|koreksi/i, suggestions: ["Ada bagian lain yang perlu direvisi?", "Saran perkuat argumen akademis", "Cek konsistensi antar bab"] },
  { pattern: /live shopping|tiktok|ecommerce|e-commerce/i, suggestions: ["Teori paling cocok untuk topik ini", "Saran variabel & indikator penelitian", "Jurnal live shopping terbaru"] },
  { pattern: /uas|ujian|ulangan|kuis/i, suggestions: ["Buatkan latihan soal UAS", "Rangkuman materi dalam tabel", "Prediksi soal yang sering keluar"] },
  { pattern: /skripsi|tesis|penelitian/i, suggestions: ["Cek kerangka penelitianku", "Saran topik yang feasible", "Timeline skripsi realistis"] },
  { pattern: /ai|kecerdasan buatan|machine learning/i, suggestions: ["Aplikasi AI di bidang akademik", "Etika penggunaan AI untuk skripsi", "Referensi AI terbaru (2023-2024)"] },
  { pattern: /python|kode|coding|program|javascript|sql|database|api|web|react|frontend|backend/i, suggestions: ["Tambahkan error handling", "Jelaskan kode ini baris per baris", "Buat unit test untuk fungsi ini"] },
];

const DEFAULT_SUGGESTIONS = ["Lanjutkan penjelasannya lebih detail", "Berikan contoh konkret", "Apa yang harus kulakukan selanjutnya?"];

const SOURCE_MAP: { pattern: RegExp; sources: ChatSource[] }[] = [
  { pattern: /TAM|UTAUT|technology acceptance/i, sources: [
    { title: "Perceived Usefulness, Perceived Ease of Use, and User Acceptance of Information Technology", author: "Davis, F.D.", year: "1989", url: "https://doi.org/10.2307/249008" },
    { title: "A Unified Theory of Acceptance and Use of Technology", author: "Venkatesh et al.", year: "2003", url: "https://doi.org/10.2307/30036540" },
  ]},
  { pattern: /live shopping|tiktok shop/i, sources: [
    { title: "Live Streaming Commerce and Consumers' Purchase Intention", author: "Sun et al.", year: "2022", url: "https://doi.org/10.1016/j.jretconser.2021.102992" },
    { title: "The Role of Live Streaming in Building Consumer Trust", author: "Wongkitrungrueng & Assarut", year: "2020", url: "https://doi.org/10.1016/j.jbusres.2018.08.032" },
  ]},
  { pattern: /metodologi|kuantitatif|survei|kuesioner/i, sources: [
    { title: "Research Design: Qualitative, Quantitative, and Mixed Methods", author: "Creswell, J.W.", year: "2014" },
    { title: "Metode Penelitian Pendidikan: Pendekatan Kuantitatif dan Kualitatif", author: "Sugiyono", year: "2019" },
  ]},
  { pattern: /jurnal|literatur|pustaka|referensi/i, sources: [
    { title: "Scopus — Database Jurnal Internasional", author: "Elsevier", year: "2024", url: "https://www.scopus.com" },
    { title: "Google Scholar — Mesin Pencari Akademik", author: "Google", year: "2024", url: "https://scholar.google.com" },
  ]},
  { pattern: /skripsi|penulisan ilmiah|karya tulis/i, sources: [
    { title: "Panduan Penulisan Skripsi dan Tesis", author: "Kemdikbud RI", year: "2022" },
    { title: "Academic Writing for Graduate Students", author: "Swales & Feak", year: "2012" },
  ]},
  { pattern: /SEM|SmartPLS|regresi|analisis data/i, sources: [
    { title: "Structural Equation Modeling with AMOS", author: "Byrne, B.M.", year: "2016" },
    { title: "Primer on Partial Least Squares Structural Equation Modeling", author: "Hair et al.", year: "2017" },
  ]},
];

function getSuggestions(userMsg: string, claroBotText: string): string[] {
  const combined = userMsg + " " + claroBotText;
  for (const { pattern, suggestions } of SUGGESTION_MAP) {
    if (pattern.test(combined)) return suggestions;
  }
  return DEFAULT_SUGGESTIONS;
}

function getSources(userMsg: string, claroBotText: string): ChatSource[] | undefined {
  const combined = userMsg + " " + claroBotText;
  for (const { pattern, sources } of SOURCE_MAP) {
    if (pattern.test(combined)) return sources;
  }
  return undefined;
}

const FEATURE_REC_MAP: { pattern: RegExp; rec: FeatureRec }[] = [
  {
    pattern: /parafrase|parafrasa|perbaiki kalimat|ubah kalimat|tulis ulang|rewrite/i,
    rec: { label: "Parafrase Otomatis", desc: "Ubah dan perbaiki kalimatmu agar lebih akademis secara instan.", tab: "fitur", featureKey: "parafrase", icon: "✍️", color: "#7c3aed" },
  },
  {
    pattern: /plagiarisme|plagiat|cek kesamaan|similarity/i,
    rec: { label: "Cek Plagiarisme", desc: "Periksa tingkat kemiripan teks dengan dokumen lain secara akurat.", tab: "fitur", featureKey: "plagiasi", icon: "🔒", color: "#dc2626" },
  },
  {
    pattern: /grammar|tata bahasa|ejaan|typo|kata baku|eyd|bahasa inggris/i,
    rec: { label: "Koreksi Grammar", desc: "Perbaiki tata bahasa dan ejaan teks akademismu otomatis.", tab: "fitur", featureKey: "grammar", icon: "📝", color: "#0891b2" },
  },
  {
    pattern: /presentasi|ppt|slide|powerpoint/i,
    rec: { label: "Buat Presentasi PPT", desc: "Generate slide presentasi akademis dari teks atau outline.", tab: "fitur", featureKey: "ppt", icon: "🖼️", color: "#dc2626" },
  },
  {
    pattern: /simulasi|skema|diagram|flowchart|visualisasi/i,
    rec: { label: "Simulasi & Visualisasi", desc: "Buat diagram dan visualisasi konsep akademis dengan mudah.", tab: "fitur", featureKey: "simulasi", icon: "🗺️", color: "#059669" },
  },
  {
    pattern: /jurnal|referensi|pustaka|sitasi|citation|scopus|daftar pustaka/i,
    rec: { label: "Cari Jurnal & Referensi", desc: "Temukan jurnal ilmiah dan kelola daftar pustaka otomatis.", tab: "fitur", featureKey: "jurnal", icon: "🔍", color: "#0891b2" },
  },
  {
    pattern: /cari judul|saran judul|ide judul|generate judul|judul skripsi/i,
    rec: { label: "Generator Judul Skripsi", desc: "Dapatkan saran judul penelitian yang relevan dan spesifik.", tab: "fitur", featureKey: "judul", icon: "💡", color: "#d97706" },
  },
  {
    pattern: /quiz|latihan soal|kuis|soal latihan/i,
    rec: { label: "QUIZLAB — Latihan Soal", desc: "Buat kuis latihan otomatis dari materi kuliahmu.", tab: "quizlab", icon: "🧪", color: "#059669" },
  },
  {
    pattern: /lacak progress|target deadline|jadwal kuliah|pantau deadline/i,
    rec: { label: "Lacak Progress Akademik", desc: "Pantau target semester dan deadline akademikmu.", tab: "progress", icon: "📊", color: "#7c3aed" },
  },
  {
    pattern: /skripsi saya|bab skripsi|progress skripsi|proyek skripsi|manajemen skripsi/i,
    rec: { label: "Proyek Skripsi", desc: "Pantau progres bab, deadline, dan catatan skripsimu di satu tempat.", tab: "proyek", icon: "📁", color: "#2563eb" },
  },
];

function getFeatureRec(userMsg: string): FeatureRec | undefined {
  for (const { pattern, rec } of FEATURE_REC_MAP) {
    if (pattern.test(userMsg)) return rec;
  }
  return undefined;
}

function now() {
  return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

// ─── Bird mascot icon ─────────────────────────────────────────────────────────
function BirdIcon({ size = 32, color = "#3b82f6" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="20" fill={color + "18"} />
      <path d="M28 14c0 0-2-1-4 1-1.5 1.5-1.5 3.5-1.5 3.5S21 17 19 17c-3 0-6 2-6 5s2.5 5 6 5c2 0 3.5-1 4.5-2.5L26 28l1-3-2-1.5c.5-1 .5-2.5.5-3.5 1-.5 2.5-1.5 2.5-3.5L30 15l-2-1z" fill={color} />
      <circle cx="22" cy="16" r="1.2" fill="#fff" />
    </svg>
  );
}

// ─── Layout shell ─────────────────────────────────────────────────────────────
// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-xl flex items-center gap-2"
      style={{ background: "#111827", animation: "fade-up 0.3s ease" }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
      {msg}
    </div>
  );
}

// ─── Image bubble components ──────────────────────────────────────────────────
function ImageGeneratingBubble({ prompt }: { prompt: string }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const stages = ["Memahami permintaan…", "Merancang komposisi…", "Menggambar detail…", "Finishing touches…"];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + Math.random() * 12 + 4;
        return next > 95 ? 95 : next;
      });
    }, 180);
    const stageInterval = setInterval(() => {
      setStage(s => (s < stages.length - 1 ? s + 1 : s));
    }, 700);
    return () => { clearInterval(interval); clearInterval(stageInterval); };
  }, []);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm overflow-hidden w-full max-w-[320px]" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      {/* shimmer placeholder */}
      <div className="relative h-44 overflow-hidden" style={{ background: "linear-gradient(135deg,#dbeafe,#e0e7ff,#f0fdf4)" }}>
        <div className="absolute inset-0 shimmer-sweep" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-700 mb-0.5">Alerin sedang membuat gambar</p>
            <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{prompt}</p>
          </div>
        </div>
        {/* animated scan line */}
        <div className="absolute left-0 right-0 h-0.5 opacity-60" style={{ top: `${(progress / 95) * 100}%`, background: "linear-gradient(90deg,transparent,#3b82f6,transparent)", transition: "top 0.2s ease" }} />
      </div>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-slate-400 font-medium">{stages[stage]}</span>
          <span className="text-[10px] font-bold text-blue-500">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-200" style={{ width: `${progress}%`, background: "linear-gradient(90deg,#3b82f6,#6366f1)" }} />
        </div>
      </div>
    </div>
  );
}

function ImageResultBubble({ imageUrl, prompt }: { imageUrl: string; prompt: string }) {
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm overflow-hidden w-full max-w-[320px]"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)", opacity: visible ? 1 : 0, transform: visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(8px)", transition: "opacity 0.4s ease, transform 0.4s ease" }}>
      <div className="relative bg-slate-100" style={{ height: 200 }}>
        <img
          src={imageUrl}
          alt={prompt}
          onLoad={() => setLoaded(true)}
          className="w-full h-full object-cover"
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease" }}
        />
        {!loaded && (
          <div className="absolute inset-0 shimmer-sweep" style={{ background: "linear-gradient(135deg,#dbeafe,#e0e7ff)" }} />
        )}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }}>
          <p className="text-white text-[10px] font-medium truncate">{prompt}</p>
        </div>
        {/* action buttons */}
        <div className="absolute top-2 right-2 flex gap-1.5">
          {[
            { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>, label: "Unduh" },
            { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>, label: "Buat ulang" },
          ].map(btn => (
            <button key={btn.label} title={btn.label}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white transition-opacity hover:opacity-80"
              style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
              {btn.icon}
            </button>
          ))}
        </div>
      </div>
      <div className="px-3 py-2 flex items-center gap-2">
        <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          Dibuat oleh Alerin
        </span>
        <span className="ml-auto text-[9px] text-slate-400">via Unsplash</span>
      </div>
    </div>
  );
}

// ─── Paraphrase bubble ────────────────────────────────────────────────────────
function ParaphraseBubble({ original, versions }: { original: string; versions: { label: string; text: string; color: string }[] }) {
  const [copied, setCopied] = useState<number | null>(null);
  const copy = (text: string, i: number) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(i);
    setTimeout(() => setCopied(null), 1800);
  };
  return (
    <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm overflow-hidden max-w-sm md:max-w-md" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div className="px-4 pt-3 pb-2 border-b border-slate-50">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Teks asli</p>
        <p className="text-xs text-slate-600 leading-relaxed italic">"{original}"</p>
      </div>
      <div className="px-4 pt-2 pb-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Saran parafrase</p>
        <div className="space-y-2">
          {versions.map((v, i) => (
            <div key={i} className="rounded-xl border p-3 relative" style={{ borderColor: `${v.color}30`, background: `${v.color}08` }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold rounded-full px-2 py-0.5" style={{ color: v.color, background: `${v.color}18` }}>{v.label}</span>
                <button onClick={() => copy(v.text, i)} className="text-[10px] font-semibold flex items-center gap-1 transition-colors" style={{ color: copied === i ? "#059669" : "#94a3b8" }}>
                  {copied === i ? (
                    <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>Disalin</>
                  ) : (
                    <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Salin</>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 py-2.5">
        <p className="text-[9px] text-slate-400 text-center">Klik "Salin" untuk menyalin versi yang kamu suka</p>
      </div>
    </div>
  );
}

// ─── Notification panel ───────────────────────────────────────────────────────
const NOTIFS = [
  { icon: "🎯", title: "Target mingguan menunggu", desc: "Kamu belum menyelesaikan satu pun target minggu ini.", time: "Baru saja", unread: true },
  { icon: "⏰", title: "Deadline besok!", desc: "Presentasi Riset Pasar · besok pukul 09.00", time: "1 jam lalu", unread: true },
  { icon: "🏆", title: "QUIZLAB tersedia", desc: "Quiz baru Sistem Informasi Semester 6 sudah aktif.", time: "3 jam lalu", unread: false },
  { icon: "💡", title: "Alerin punya saran", desc: "Berdasarkan progresmu, coba mulai BAB II sekarang.", time: "Kemarin", unread: false },
];

function NotifPanel({ onClose, onNavigate }: { onClose: () => void; onNavigate: (t: NavTab) => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
      onClick={onClose}>
      <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.22)" }}
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
            <p className="font-bold text-sm text-slate-800">Notifikasi</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-[11px] font-semibold text-blue-600">Tandai dibaca</button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
        {/* Items */}
        {NOTIFS.map((n, i) => (
          <button key={i} onClick={() => { onNavigate(i === 0 || i === 1 ? "progress" : "percakapan"); onClose(); }}
            className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left border-b border-slate-50 last:border-0">
            <span className="text-lg shrink-0 mt-0.5">{n.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="text-xs font-bold text-slate-800 truncate">{n.title}</p>
                {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{n.desc}</p>
              <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" className="shrink-0 mt-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        ))}
        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-50">
          <button className="w-full text-xs font-semibold text-blue-600 text-center py-1">Lihat semua notifikasi</button>
        </div>
      </div>
    </div>
  );
}

// ─── Upgrade modal ────────────────────────────────────────────────────────────
function UpgradeModal({ onClose, onToast }: { onClose: () => void; onToast: (m: string) => void }) {
  const plans = [
    {
      id: "gratis", name: "Gratis", tagline: "Mulai tanpa biaya",
      desc: "Coba semua fitur dasar Alerin dan rasakan bagaimana AI bisa membantu perkuliahanmu.",
      price: 0, current: true,
      cta: "Paket saat ini",
      features: [
        "20 kredit per bulan",
        "Percakapan akademik dasar",
        "3 proyek tersimpan",
        "QUIZLAB terbatas (5 sesi)",
        "Cari Jurnal & Cari Judul",
        "Parafrase Online terbatas",
      ],
      accent: "#4f46e5",
    },
    {
      id: "pro", name: "Alerin Pro", tagline: "Asisten kampus penuh",
      desc: "Akses semua fitur tanpa batas. Ideal untuk mahasiswa yang aktif mengerjakan skripsi atau tugas besar.",
      price: 49000, current: false,
      cta: "Upgrade ke Pro",
      popular: true,
      features: [
        "200 kredit per bulan",
        "Semua fitur Alerin tanpa batas",
        "Proyek tersimpan tak terbatas",
        "QUIZLAB penuh & adaptive",
        "Upload PDF & DOCX",
        "Mode Profesor & Berpikir",
        "Cari Jurnal prioritas (Scopus Q1)",
        "Outline skripsi otomatis",
      ],
      accent: "#2563eb",
    },
    {
      id: "kampus", name: "Alerin Max", tagline: "Daya penuh + mentor",
      desc: "Untuk mahasiswa tingkat akhir yang butuh pendampingan nyata dari mentor akademik berpengalaman.",
      price: 99000, current: false,
      cta: "Mulai Alerin Max",
      features: [
        "500 kredit per bulan",
        "Semua fitur Pro",
        "Konsultasi Mentor 2× / bulan",
        "Laporan progres akademik",
        "Review skripsi oleh mentor",
        "Prioritas dukungan 24 jam",
        "Akses fitur beta eksklusif",
        "Tanpa iklan",
      ],
      accent: "#7c3aed",
    },
  ];

  const fmt = (n: number) => n === 0 ? "Rp 0" : `Rp ${n.toLocaleString("id-ID")}`;

  return (
    <div className="fixed inset-0 z-[150] flex items-start md:items-center justify-center overflow-y-auto py-4 md:py-8 px-3"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      onClick={onClose}>
      <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: "0 32px 80px rgba(37,99,235,0.15), 0 8px 32px rgba(0,0,0,0.12)" }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 pt-6 pb-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Upgrade Alerin</span>
              </div>
              <h2 className="font-display font-800 text-xl md:text-2xl text-slate-900">Pilih paket yang tepat untukmu</h2>
              <p className="text-slate-500 text-sm mt-1">Mulai gratis, upgrade kapan saja</p>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0 mt-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          {plans.map((p) => (
            <div key={p.id}
              className="relative rounded-2xl flex flex-col overflow-hidden"
              style={p.popular ? {
                background: "linear-gradient(155deg,#1e40af 0%,#2563eb 55%,#4f46e5 100%)",
                boxShadow: "0 8px 32px rgba(37,99,235,0.35)",
              } : {
                background: "#f8fafc",
                border: "1.5px solid #e2e8f0",
              }}>

              {/* Popular badge */}
              {p.popular && (
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-blue-700 border border-blue-200" style={{ background: "rgba(255,255,255,0.92)" }}>
                    ✦ POPULER
                  </span>
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                {/* Tier label */}
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
                  style={{ color: p.popular ? "rgba(191,219,254,0.85)" : p.id === "kampus" ? "#7c3aed" : "#2563eb" }}>
                  {p.name}
                </p>

                {/* Tagline */}
                <p className="font-display font-800 text-lg leading-tight mb-2"
                  style={{ color: p.popular ? "#fff" : "#0f172a" }}>
                  {p.tagline}
                </p>

                {/* Desc */}
                <p className="text-xs leading-relaxed mb-5"
                  style={{ color: p.popular ? "rgba(191,219,254,0.8)" : "#64748b" }}>
                  {p.desc}
                </p>

                {/* Price */}
                <div className="mb-5">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-sm font-bold" style={{ color: p.popular ? "#93c5fd" : "#64748b" }}>Rp</span>
                    <span className="font-display font-800 text-3xl ml-0.5"
                      style={{ color: p.popular ? "#fff" : "#0f172a" }}>
                      {p.price === 0 ? "0" : (p.price / 1000).toLocaleString("id-ID") + ".000"}
                    </span>
                    <span className="text-xs ml-1" style={{ color: p.popular ? "rgba(147,197,253,0.7)" : "#94a3b8" }}>/bulan</span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => { if (!p.current) { onToast("Fitur upgrade segera hadir!"); onClose(); } }}
                  className="w-full py-2.5 rounded-xl text-sm font-bold transition-all mb-5"
                  style={p.current
                    ? { background: "#e2e8f0", color: "#94a3b8", cursor: "default" }
                    : p.popular
                      ? { background: "#fff", color: "#1d4ed8", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }
                      : p.id === "kampus"
                        ? { background: "linear-gradient(135deg,#7c3aed,#6366f1)", color: "#fff", boxShadow: "0 2px 12px rgba(99,102,241,0.3)" }
                        : { background: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "#fff", boxShadow: "0 2px 12px rgba(59,130,246,0.3)" }}>
                  {p.current ? "Paket saat ini" : `✦ ${p.cta}`}
                </button>

                {/* Divider */}
                <div className="mb-4" style={{ height: "1px", background: p.popular ? "rgba(255,255,255,0.15)" : "#e2e8f0" }} />

                {/* Features label */}
                <p className="text-[10px] font-bold uppercase tracking-wider mb-3"
                  style={{ color: p.popular ? "rgba(147,197,253,0.75)" : "#94a3b8" }}>
                  {p.id === "gratis" ? "Termasuk:" : p.id === "pro" ? "Semua Gratis, ditambah:" : "Semua Pro, ditambah:"}
                </p>

                {/* Feature list */}
                <ul className="space-y-2 flex-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs"
                      style={{ color: p.popular ? "rgba(219,234,254,0.9)" : "#475569" }}>
                      <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                        style={{ background: p.popular ? "rgba(255,255,255,0.15)" : p.id === "kampus" ? "#ede9fe" : "#eff6ff" }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none"
                          stroke={p.popular ? "#fff" : p.id === "kampus" ? "#7c3aed" : "#3b82f6"} strokeWidth="3">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center justify-center gap-4">
          <p className="text-center text-xs text-slate-400">
            🔒 Pembayaran aman · Batalkan kapan saja · Tanpa biaya tersembunyi
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Credits modal ────────────────────────────────────────────────────────────
function CreditsModal({ onClose, onUpgrade }: { onClose: () => void; onUpgrade: () => void }) {
  const used = 8; const total = 20;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(3px)" }} onClick={onClose}>
      <div className="bg-white rounded-3xl p-7 w-full max-w-sm mx-4" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-800 text-lg text-slate-900">Kredit Kamu</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div className="text-center mb-5">
          <p className="font-display font-800 text-5xl text-slate-900">{used}</p>
          <p className="text-slate-400 text-sm mt-1">dari {total} kredit digunakan bulan ini</p>
        </div>
        <div className="h-3 rounded-full bg-slate-100 overflow-hidden mb-2">
          <div className="h-full rounded-full transition-all" style={{ width: `${(used/total)*100}%`, background: "linear-gradient(90deg,#3b82f6,#6366f1)" }} />
        </div>
        <p className="text-xs text-slate-400 text-right mb-5">{total - used} kredit tersisa</p>
        <div className="space-y-2 mb-5">
          {[["Percakapan AI","5 kredit"],["Upload & Analisis PDF","2 kredit"],["QUIZLAB","1 kredit"]].map(([act, cr]) => (
            <div key={act} className="flex items-center justify-between py-2 border-b border-slate-100"><p className="text-xs text-slate-700">{act}</p><p className="text-xs font-semibold text-blue-600">{cr}</p></div>
          ))}
        </div>
        <button onClick={() => { onClose(); onUpgrade(); }} className="w-full py-3 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)" }}>
          Upgrade untuk lebih banyak kredit
        </button>
      </div>
    </div>
  );
}

// ─── Mentor modal ─────────────────────────────────────────────────────────────
const MENTORS = [
  { name: "Dr. Andi Pratama", field: "Sistem Informasi", rating: "4.9", sessions: "142 sesi", avatar: "AP", color: "#3b82f6" },
  { name: "Rizka Amelia, M.Kom", field: "Metodologi Penelitian", rating: "4.8", sessions: "98 sesi", avatar: "RA", color: "#8b5cf6" },
  { name: "Budi Santoso, M.T", field: "Rekayasa Perangkat Lunak", rating: "4.7", sessions: "76 sesi", avatar: "BS", color: "#059669" },
];
function MentorModal({ onClose, onToast }: { onClose: () => void; onToast: (m: string) => void }) {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="bg-white rounded-3xl p-7 w-full max-w-md mx-4" style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.18)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div><h2 className="font-display font-800 text-xl text-slate-900">Temukan Mentor</h2><p className="text-slate-400 text-xs mt-0.5">Konsultasi langsung dengan mentor akademik</p></div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div className="space-y-3 mb-5">
          {MENTORS.map(m => (
            <div key={m.name} className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: m.color }}>{m.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800">{m.name}</p>
                <p className="text-xs text-slate-400">{m.field} · ⭐ {m.rating} · {m.sessions}</p>
              </div>
              <button onClick={() => { onToast(`Menghubungi ${m.name}…`); onClose(); }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shrink-0" style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)" }}>
                Hubungi
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => { onToast("Fitur pencarian mentor segera hadir!"); onClose(); }}
          className="w-full py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
          Lihat semua mentor →
        </button>
      </div>
    </div>
  );
}

// ─── New project modal ────────────────────────────────────────────────────────
function NewProjectModal({ onClose, onToast }: { onClose: () => void; onToast: (m: string) => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Skripsi");
  const types = ["Skripsi", "Tesis", "Tugas Besar", "Penelitian", "Magang", "Lainnya"];
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(3px)" }} onClick={onClose}>
      <div className="bg-white rounded-3xl p-7 w-full max-w-sm mx-4" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-800 text-lg text-slate-900">Proyek Baru</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Nama Proyek</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Skripsi Analisis TAM..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Tipe Proyek</label>
            <div className="flex flex-wrap gap-2">
              {types.map(t => (
                <button key={t} onClick={() => setType(t)} className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                  style={type === t ? { background: "#3b82f6", color: "#fff", borderColor: "#3b82f6" } : { background: "#fff", color: "#64748b", borderColor: "#e2e8f0" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button disabled={!name.trim()} onClick={() => { onToast(`Proyek "${name}" berhasil dibuat!`); onClose(); }}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
            style={{ backgroundColor: "#347CEA" }}>
            Buat Proyek
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add target modal ─────────────────────────────────────────────────────────
function AddTargetModal({ onClose, onToast }: { onClose: () => void; onToast: (m: string) => void }) {
  const [label, setLabel] = useState("");
  const [date, setDate] = useState("");
  const colors = ["#ef4444","#f59e0b","#3b82f6","#8b5cf6","#059669"];
  const [color, setColor] = useState(colors[2]);
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(3px)" }} onClick={onClose}>
      <div className="bg-white rounded-3xl p-7 w-full max-w-sm mx-4" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-800 text-lg text-slate-900">Tambah Target</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Nama Target</label>
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Contoh: Selesaikan BAB III..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Deadline</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-blue-400 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Warna Label</label>
            <div className="flex gap-2">
              {colors.map(c => (
                <button key={c} onClick={() => setColor(c)} className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{ background: c, borderColor: color === c ? "#111827" : "transparent", transform: color === c ? "scale(1.2)" : "scale(1)" }} />
              ))}
            </div>
          </div>
          <button disabled={!label.trim()} onClick={() => { onToast(`Target "${label}" ditambahkan!`); onClose(); }}
            className="w-full py-3 rounded-xl text-sm font-bold text-white disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)" }}>
            Simpan Target
          </button>
        </div>
      </div>
    </div>
  );
}

function Shell({ children, activeTab, onTab, onOpenHistory, onNewChat }: { children: React.ReactNode; activeTab: NavTab; onTab: (t: NavTab) => void; onOpenHistory: (msgs: ChatMsg[]) => void; onNewChat: () => void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true); // single toggle for both sidebars
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [profileMenuPos, setProfileMenuPos] = useState<{ top: number; right: number } | null>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);

  const showToast = useCallback((msg: string) => { setToast(msg); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    let interfaceLanguage: "id" | "en" = window.localStorage.getItem("alerin-language") === "en" ? "en" : "id";
    const applyLanguage = (root: Node = document.body) => {
      document.documentElement.lang = interfaceLanguage;
      translateInterfaceNode(root, interfaceLanguage);
    };
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === "characterData") applyLanguage(mutation.target);
        mutation.addedNodes.forEach(node => applyLanguage(node));
      });
    });
    const handleLanguageChange = (event: Event) => {
      const requestedLanguage = (event as CustomEvent<string>).detail;
      interfaceLanguage = requestedLanguage === "en" ? "en" : "id";
      applyLanguage();
    };

    applyLanguage();
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    window.addEventListener("alerin-language-change", handleLanguageChange);
    return () => {
      observer.disconnect();
      window.removeEventListener("alerin-language-change", handleLanguageChange);
    };
  }, []);

  const NAV: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: "percakapan", label: "Percakapan", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { id: "fitur", label: "Semua Fitur", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { id: "proyek", label: "Proyek Saya", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
    { id: "progress", label: "Progress", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
    { id: "quizlab", label: "QUIZLAB", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg> },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      {upgradeOpen && <UpgradeModal onClose={() => setUpgradeOpen(false)} onToast={showToast} />}
      {creditsOpen && <CreditsModal onClose={() => setCreditsOpen(false)} onUpgrade={() => { setCreditsOpen(false); setUpgradeOpen(true); }} />}
      {mentorOpen && <MentorModal onClose={() => setMentorOpen(false)} onToast={showToast} />}
      {calOpen && <CalendarModal onClose={() => setCalOpen(false)} onToast={showToast} />}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      {logoutConfirmOpen && (
        <div
          className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shell-logout-dialog-title"
          onClick={event => {
            if (event.target === event.currentTarget) setLogoutConfirmOpen(false);
          }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            </div>
            <p id="shell-logout-dialog-title" className="mt-4 text-lg font-bold text-slate-900">Apakah kamu yakin ingin keluar?</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">Kamu perlu masuk kembali untuk melanjutkan aktivitas di Alerin.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLogoutConfirmOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setLogoutConfirmOpen(false);
                  showToast("Anda telah keluar dari akun.");
                }}
                className="rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-red-600"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile top header */}
      <div className="md:hidden flex items-center justify-between px-4 py-2.5 shrink-0 bg-white z-40" style={{ borderBottom: "1px solid #f1f5f9" }}>
        <div className="flex items-center gap-2">
          <img src="/assets/f725b.png" alt="Alerin" className="size-8 rounded-full border border-white object-cover shadow-sm" />
          <div>
            <p className="font-bold text-[14px] text-slate-900 leading-none">ALERIN</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setSearchOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button onClick={() => setNotifOpen(o => !o)}
            className="relative w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 border border-white" />
          </button>
          <button onClick={onNewChat}
            className="h-8 px-[18px] rounded-xl text-xs font-bold text-white flex items-center gap-1 transition-opacity hover:opacity-90"
            style={{ backgroundColor: "rgb(52, 124, 234)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Chat
          </button>
        </div>
      </div>
      {notifOpen && (
        <div className="md:hidden">
          <NotifPanel
            onClose={() => setNotifOpen(false)}
            onNavigate={tab => {
              onTab(tab);
              setNotifOpen(false);
            }}
          />
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        {/* Left sidebar — desktop only, collapses to icon rail */}
        <aside className="hidden md:flex shrink-0 border-r border-slate-100 flex-col bg-white overflow-hidden"
          style={{ width: sidebarOpen ? 220 : 56, transition: "width 0.28s cubic-bezier(0.4,0,0.2,1)", minWidth: 0 }}>

          {/* Logo / Branding */}
          <div className="shrink-0 px-2 pt-3 pb-2 border-b border-slate-100">
            {sidebarOpen ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 px-1">
                  <img src="/assets/f725b.png" alt="Alerin" className="h-8 w-8 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="font-display font-700 text-sm text-slate-900 leading-none">Alerin</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-[10px] text-slate-400 truncate">Asisten kampusmu</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} title="Tutup sidebar"
                  className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <button onClick={() => setSidebarOpen(true)} title="Buka sidebar">
                  <img src="/assets/f725b.png" alt="Alerin" className="h-8 w-8 rounded-full object-cover" />
                </button>
              </div>
            )}
          </div>

          {/* Action row: Baru + Cari */}
          <div className="px-2 pt-2 pb-1 shrink-0">
            {sidebarOpen ? (
              <div className="flex items-center gap-1.5">
                <button onClick={onNewChat}
                  className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-xl border-0 text-xs font-bold text-white whitespace-nowrap transition-all hover:opacity-90"
                  style={{ backgroundColor: "#347CEA" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Baru
                </button>
                <button onClick={() => setSearchOpen(true)} title="Cari percakapan"
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 hover:text-blue-600 transition-all">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <button onClick={onNewChat} title="Chat baru"
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <button onClick={() => setSearchOpen(true)} title="Cari percakapan"
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 hover:text-blue-600 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </button>
              </div>
            )}
          </div>

          {/* Nav items */}
          {sidebarOpen ? (
            <>
              <nav className="px-2 space-y-0.5 mb-2 mt-1">
                {NAV.map((n) => (
                  <button key={n.id} onClick={() => onTab(n.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left"
                    style={activeTab === n.id ? { background: "#111827", color: "#fff", fontWeight: 700 } : { color: "#475569", fontWeight: 500 }}>
                    <span style={{ color: activeTab === n.id ? "#fff" : "#64748b" }}>{n.icon}</span>
                    {n.label}
                  </button>
                ))}
              </nav>
              <div className="px-4 mb-2 overflow-y-auto flex-1">
                <div className="flex items-center gap-1.5 mb-2">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Terakhir Dibuka</span>
                </div>
                <div className="space-y-1">
                  {RECENT.map((r) => (
                    <button key={r.label} onClick={() => { onTab("percakapan"); onOpenHistory(r.msgs); }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors group">
                      <p className="text-xs font-medium text-slate-700 truncate group-hover:text-blue-600 transition-colors">{r.label}</p>
                      <p className="text-[10px] text-slate-400">{r.time}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom section: hint + profile/actions */}
              <div className="mt-auto shrink-0 px-2 pb-3 space-y-2">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <span className="text-[10px] font-bold text-emerald-700">Pendamping, bukan joki</span>
                  </div>
                  <p className="text-[10px] text-emerald-600 leading-relaxed">Alerin membantu kamu memahami dan memperbaiki pekerjaanmu sendiri.</p>
                </div>
                {/* Upgrade */}
                <button onClick={() => setUpgradeOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-opacity"
                  style={{ background: "#111827" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  Upgrade Alerin
                </button>
                {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)} onNavigate={(t) => { onTab(t); setNotifOpen(false); }} />}
              </div>
            </>
          ) : (
            /* Icon rail when collapsed */
            <>
              <nav className="flex flex-col items-center gap-1 px-1.5 pt-1 flex-1">
                {NAV.map((n) => (
                  <button key={n.id} onClick={() => onTab(n.id)} title={n.label}
                    className="w-9 h-9 flex items-center justify-center rounded-xl transition-all"
                    style={activeTab === n.id ? { background: "#111827", color: "#fff" } : { color: "#64748b" }}>
                    <span className="text-base leading-none">{n.icon}</span>
                  </button>
                ))}
              </nav>
              {/* Bottom icons collapsed */}
              <div className="shrink-0 flex flex-col items-center gap-2 px-1.5 pb-3 pt-2 border-t border-slate-100">
                <button onClick={() => setUpgradeOpen(true)} title="Upgrade Alerin"
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-white hover:opacity-90 transition-opacity"
                  style={{ background: "#111827" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </button>
                <button onClick={() => setNotifOpen(o => !o)} title="Notifikasi"
                  className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border border-white" />
                </button>
                <button onClick={() => setCalOpen(true)} title="Kalender"
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </button>
              </div>
            </>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-hidden flex flex-col pb-24 md:pb-0">
          {children}
        </main>

        {/* Right panel — desktop only, hides when sidebar collapsed */}
        <aside className="hidden lg:flex shrink-0 border-l border-slate-100 overflow-y-auto bg-white py-4 px-4 flex-col overflow-hidden"
          style={{ width: sidebarOpen ? 256 : 0, opacity: sidebarOpen ? 1 : 0, transition: "width 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease", minWidth: 0 }}>

          {/* Profile card — top of right sidebar */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl border border-slate-100 mb-4"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <button
              ref={profileBtnRef}
              onClick={() => {
                const rect = profileBtnRef.current?.getBoundingClientRect();
                if (rect) setProfileMenuPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
                setProfileMenuOpen(o => !o);
              }}
              className="flex items-center gap-3 flex-1 min-w-0 text-left hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>RA</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">Raka Aditya</p>
                <p className="text-[10px] text-slate-400 truncate" style={{ bottom: "-1px" }}>Premium · Sem 6</p>
              </div>
            </button>
            <button onClick={() => setNotifOpen(o => !o)} title="Notifikasi"
              className="relative w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-red-500 border border-white" />
            </button>
          </div>
          {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)} onNavigate={(t) => { onTab(t); setNotifOpen(false); }} />}

          <div className="rounded-2xl border border-slate-100 p-4 mb-4" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Progress Minggu Ini</p>
            <div className="flex items-center justify-between">
              <p className="font-display font-800 text-lg text-slate-900">0 dari 4 target</p>
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-emerald-400 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
              </div>
            </div>
            <button onClick={() => onTab("progress")} className="mt-2 text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Buka detail progress <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
          <div className="rounded-2xl border border-slate-100 p-4 mb-4" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-slate-800">Deadline terdekat</p>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div className="space-y-2">
              {DEADLINES.map((d) => (
                <button key={d.label} onClick={() => onTab("progress")} className="w-full flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800">{d.label}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <p className="text-[10px] text-slate-400">{d.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(145deg,#1e3a8a,#1d4ed8)" }}>
            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border border-white/20 text-blue-200 mb-3">Alerin + Mentor</span>
            <p className="font-display font-800 text-base leading-tight mb-2">Butuh keputusan akademik yang lebih spesifik?</p>
            <p className="text-[11px] text-blue-200 leading-relaxed mb-4">Teruskan ringkasan percakapanmu kepada mentor yang sesuai bidang.</p>
            <button onClick={() => setMentorOpen(true)} className="w-full py-2.5 rounded-xl bg-white text-blue-700 text-xs font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5">
              Temukan mentor <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </aside>
      </div>

      {/* Bottom nav — floating pill, mobile only */}
      <nav
        ref={(nav) => {
          if (!nav) return;
          const lastScrollPositions = new WeakMap<EventTarget, number>();
          let visible = true;

          const setVisible = (nextVisible: boolean) => {
            if (visible === nextVisible) return;
            visible = nextVisible;
            nav.style.transform = nextVisible ? "translateY(0)" : "translateY(calc(100% + 2rem))";
            nav.style.opacity = nextVisible ? "1" : "0";
            nav.style.pointerEvents = nextVisible ? "auto" : "none";
          };

          const handleScroll = (event: Event) => {
            const target = event.target;
            if (!target) return;
            const scrollTop = target instanceof Document
              ? target.scrollingElement?.scrollTop ?? 0
              : target instanceof HTMLElement
              ? target.scrollTop
              : 0;
            const previousScrollTop = lastScrollPositions.get(target) ?? scrollTop;
            const delta = scrollTop - previousScrollTop;

            if (scrollTop <= 8) setVisible(true);
            else if (delta > 2) setVisible(false);
            else if (delta < -2) setVisible(true);

            lastScrollPositions.set(target, scrollTop);
          };

          document.addEventListener("scroll", handleScroll, { capture: true, passive: true });
          return () => document.removeEventListener("scroll", handleScroll, true);
        }}
        className="fixed bottom-5 left-3 right-3 z-50 transition-[transform,opacity] duration-300 ease-out will-change-transform md:hidden">
        <div className="rounded-[22px] flex items-stretch px-2 py-2" style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.95)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
        }}>
          {([
            { id: "percakapan", label: "Chat", asset: "/assets/689f8.svg", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
            { id: "fitur", label: "Fitur", asset: "/assets/3f19b.svg", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg> },
            { id: "proyek", label: "Proyek", asset: "/assets/abe62.svg", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
            { id: "progress", label: "Progress", asset: "/assets/cb179.svg", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
            { id: "profil", label: "Profil", asset: "/assets/a16cb.svg", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
          ] as { id: NavTab; label: string; asset: string; icon: React.ReactNode }[]).map((n) => {
            const active = activeTab === n.id;
            return (
              <button key={n.id} onClick={() => onTab(n.id)}
                className="flex-1 flex flex-col items-center justify-center gap-[3px] py-1.5 px-1 rounded-[16px] transition-all"
                style={{ background: active ? "#eff6ff" : "transparent", minWidth: 0 }}>
                <span className={active ? "text-blue-600" : "text-slate-400"}>
                  {activeTab === "profil" ? <img src={n.asset} alt="" /> : n.icon}
                </span>
                <span className="text-[9px] font-semibold leading-none truncate w-full text-center" style={{ color: active ? "#2563eb" : "#94a3b8" }}>{n.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Profile popup — fixed, escapes overflow */}
      {profileMenuOpen && profileMenuPos && (
        <>
          <div className="fixed inset-0 z-[190]" onClick={() => setProfileMenuOpen(false)} />
          <div
            ref={(menu) => {
              if (!menu) return;
              const shell = menu.closest(".h-screen");
              const isDark = window.localStorage.getItem("alerin-theme") === "dark";
              shell?.classList.toggle("profile-dark", isDark);
              if (shell instanceof HTMLElement) shell.style.backgroundColor = isDark ? "#0f172a" : "#ffffff";
            }}
            className="fixed z-[200] w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white"
            style={{ top: profileMenuPos.top, right: profileMenuPos.right, boxShadow: "0 12px 40px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">RA</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">Raka</p>
                <p className="mt-0.5 truncate text-xs text-slate-400">rakaaditya@gmail.com</p>
              </div>
            </div>

            <div className="p-2">
              <button type="button" onClick={() => { onTab("profil"); setProfileMenuOpen(false); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-slate-600 transition-colors hover:bg-slate-50">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="text-sm font-medium">Profil</span>
              </button>

              {(() => {
                const isDark = window.localStorage.getItem("alerin-theme") === "dark";
                return (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isDark}
                    onClick={(event) => {
                      const shell = event.currentTarget.closest(".h-screen");
                      const nextDark = !shell?.classList.contains("profile-dark");
                      shell?.classList.toggle("profile-dark", nextDark);
                      if (shell instanceof HTMLElement) shell.style.backgroundColor = nextDark ? "#0f172a" : "#ffffff";
                      window.localStorage.setItem("alerin-theme", nextDark ? "dark" : "light");
                      event.currentTarget.setAttribute("aria-checked", String(nextDark));
                      const label = event.currentTarget.querySelector("[data-theme-label]");
                      if (label) label.textContent = nextDark ? "Mode Gelap" : "Mode Terang";
                      const track = event.currentTarget.querySelector("[data-theme-track]");
                      track?.classList.toggle("bg-blue-600", nextDark);
                      track?.classList.toggle("bg-slate-200", !nextDark);
                      const knob = event.currentTarget.querySelector("[data-theme-knob]");
                      knob?.classList.toggle("translate-x-5", nextDark);
                      knob?.classList.toggle("translate-x-0", !nextDark);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-slate-600 transition-colors hover:bg-slate-50">
                    <span className="flex items-center gap-3">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                      <span data-theme-label className="text-sm font-medium">{isDark ? "Mode Gelap" : "Mode Terang"}</span>
                    </span>
                    <span data-theme-track className={`relative h-6 w-11 rounded-full transition-colors ${isDark ? "bg-blue-600" : "bg-slate-200"}`}>
                      <span data-theme-knob className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${isDark ? "translate-x-5" : "translate-x-0"}`} />
                    </span>
                  </button>
                );
              })()}

              <button type="button" onClick={() => { showToast("Form saran & laporan siap digunakan."); setProfileMenuOpen(false); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-slate-600 transition-colors hover:bg-slate-50">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/></svg>
                <span className="text-sm font-medium">Saran &amp; Laporan</span>
              </button>

              <button type="button" onClick={() => { showToast("Alerin dapat dipasang di desktop dan mobile."); setProfileMenuOpen(false); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-600 transition-colors hover:bg-slate-50">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M9 8l3 3 3-3M12 5v6"/></svg>
                <span className="flex flex-col">
                  <span className="text-sm font-medium">Pasang Aplikasi</span>
                  <span className="text-[11px] text-slate-400">Untuk desktop dan mobile</span>
                </span>
              </button>
            </div>

            <div className="border-t border-slate-100 p-2">
              <button type="button" onClick={() => { setLogoutConfirmOpen(true); setProfileMenuOpen(false); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-500 transition-colors hover:bg-red-50">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span className="text-sm font-semibold">Keluar</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Content header ───────────────────────────────────────────────────────────
function ContentHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="shrink-0 px-4 md:px-8 py-3 md:py-4 border-b border-slate-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ color: "#8b5cf6", borderColor: "#ddd6fe", background: "#f5f3ff" }}>
        Prototipe interaktif
      </span>
    </div>
  );
}

// ─── Prompt suggestions & categories ─────────────────────────────────────────
type CategoryKey = "penulisan" | "metodologi" | "analisis" | "sidang" | "referensi";

const PROMPT_SUGGESTIONS = [
  "Jelaskan teori TAM dengan contoh sederhana",
  "Pecah tugas presentasi menjadi langkah kerja",
  "Bantu buat kerangka BAB II skripsi",
  "Cari jurnal tentang e-commerce Scopus 2023",
  "Perbaiki kalimat pasif di paragraf ini",
  "Rumuskan hipotesis penelitian kuantitatif",
];

const CATEGORY_SUGGESTIONS: Record<CategoryKey, string[]> = {
  penulisan: [
    "Perbaiki struktur kalimat paragraf ini",
    "Bantu buat abstrak skripsi yang baik",
    "Cara menulis latar belakang yang kuat",
    "Contoh kalimat transisi antar paragraf",
    "Review dan koreksi tulisan BAB I saya",
    "Teknik parafrase agar tidak plagiat",
  ],
  metodologi: [
    "Perbedaan penelitian kualitatif dan kuantitatif",
    "Cara menentukan jumlah sampel yang tepat",
    "Apa itu uji validitas dan reliabilitas?",
    "Bantu susun kuesioner untuk penelitian saya",
    "Cara memilih teknik sampling yang tepat",
    "Perbedaan metode survei dan eksperimen",
  ],
  analisis: [
    "Cara baca output SPSS regresi linear",
    "Apa itu uji normalitas dan kapan dipakai?",
    "Interpretasi nilai R square dalam penelitian",
    "Cara analisis data kualitatif dengan coding",
    "Perbedaan uji T dan uji ANOVA",
    "Cara membuat tabel distribusi frekuensi",
  ],
  sidang: [
    "Pertanyaan sidang yang sering ditanya penguji",
    "Cara jawab pertanyaan metodologi di sidang",
    "Teknik presentasi skripsi yang meyakinkan",
    "Cara buat slide sidang yang baik",
    "Apa yang dilakukan jika tidak bisa jawab penguji?",
    "Persiapan mental sebelum sidang skripsi",
  ],
  referensi: [
    "Cari jurnal Scopus tentang e-commerce 2023",
    "Cara menulis daftar pustaka APA style",
    "Rekomendasi buku metodologi penelitian",
    "Cara pakai Mendeley untuk sitasi otomatis",
    "Cara cari jurnal gratis di Google Scholar",
    "Apa itu DOI dan cara mencantumkannya?",
  ],
};

const CATEGORIES: { id: CategoryKey; label: string; placeholder: string; icon: React.ReactNode }[] = [
  {
    id: "penulisan",
    label: "Penulisan",
    placeholder: "Tanya Alerin tentang skripsimu, parafrase, atau perbaiki kalimat...",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  },
  {
    id: "metodologi",
    label: "Metodologi",
    placeholder: "Tanya tentang metode penelitian, populasi, sampel, atau instrumen...",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  },
  {
    id: "analisis",
    label: "Analisis Data",
    placeholder: "Tanya tentang olah data, statistik, SPSS, atau interpretasi hasil...",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  },
  {
    id: "sidang",
    label: "Sidang",
    placeholder: "Tanya tentang persiapan sidang, pertanyaan penguji, atau presentasi...",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  },
  {
    id: "referensi",
    label: "Referensi",
    placeholder: "Cari jurnal, buku, atau sumber ilmiah untuk mendukung penelitianmu...",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  },
];

// ─── Shared chat input block ──────────────────────────────────────────────────
type ModeKey = "normal" | "profesor" | "berpikir" | "ringkas" | "kreatif" | "debat";

const MODES: { id: ModeKey; label: string; desc: string; color: string; bg: string; border: string; icon: React.ReactNode }[] = [
  {
    id: "normal", label: "Normal", desc: "Jawaban standar, seimbang dan jelas",
    color: "#475569", bg: "#f8fafc", border: "#e2e8f0",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  },
  {
    id: "profesor", label: "Profesor", desc: "Gaya akademik mendalam seperti dosen",
    color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  },
  {
    id: "berpikir", label: "Berpikir", desc: "Analisis langkah demi langkah sebelum menjawab",
    color: "#0284c7", bg: "#f0f9ff", border: "#bae6fd",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  },
  {
    id: "ringkas", label: "Ringkas", desc: "Jawaban singkat, padat, langsung ke inti",
    color: "#059669", bg: "#ecfdf5", border: "#a7f3d0",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="13" y2="18"/></svg>,
  },
  {
    id: "kreatif", label: "Kreatif", desc: "Eksplorasi ide inovatif dan out-of-the-box",
    color: "#d97706", bg: "#fffbeb", border: "#fcd34d",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  },
  {
    id: "debat", label: "Debat", desc: "Dua sisi argumen untuk analisis kritis",
    color: "#dc2626", bg: "#fef2f2", border: "#fecaca",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
  },
];

function ChatInputBox({
  input, setInput, onSend, onSendWithFile, onNewChat, activeCategory, setActiveCategory, hideTopSuggestions, mobileFloat,
}: {
  input: string;
  setInput: (v: string) => void;
  onSend: (text: string) => void;
  onSendWithFile?: (text: string, file: { name: string; type: string; size: string }) => void;
  onNewChat?: () => void;
  activeCategory: CategoryKey | null;
  setActiveCategory: (c: CategoryKey | null) => void;
  hideTopSuggestions?: boolean;
  mobileFloat?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const activeCat = CATEGORIES.find((c) => c.id === activeCategory) ?? null;
  const currentSuggestions = (activeCategory && CATEGORY_SUGGESTIONS[activeCategory as CategoryKey]) ? CATEGORY_SUGGESTIONS[activeCategory as CategoryKey] : PROMPT_SUGGESTIONS;;
  const [activeMode, setActiveMode] = useState<ModeKey>("normal");
  const [modeOpen, setModeOpen] = useState(false);
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false);
  const [uploadMenuPos, setUploadMenuPos] = useState<{ bottom: number; left: number } | null>(null);
  const [listening, setListening] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const recognitionRef = useRef<any>(null);
  const modeRef = useRef<HTMLDivElement>(null);
  const modeBtnRef = useRef<HTMLButtonElement>(null);
  const uploadBtnRef = useRef<HTMLButtonElement>(null);
  const [modeDropdownPos, setModeDropdownPos] = useState<{ top: number; left: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    e.target.value = "";
    setUploadMenuOpen(false);
  };

  const openUploadMenu = () => {
    const rect = uploadBtnRef.current?.getBoundingClientRect();
    if (rect) setUploadMenuPos({ bottom: window.innerHeight - rect.top + 8, left: rect.left });
    setUploadMenuOpen(o => !o);
  };

  const currentMode = MODES.find((m) => m.id === activeMode)!;

  // Close mode dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modeRef.current && !modeRef.current.contains(e.target as Node)) setModeOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Voice dictation
  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "id-ID";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setInput(transcript);
    };
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  const handleSend = () => {
    if (uploadedFile) {
      const ext = uploadedFile.name.split(".").pop()?.toUpperCase() ?? "FILE";
      const size = uploadedFile.size < 1024 * 1024
        ? `${(uploadedFile.size / 1024).toFixed(0)} KB`
        : `${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB`;
      onSendWithFile?.(
        input.trim() || "Tolong analisis file ini.",
        { name: uploadedFile.name, type: ext, size }
      );
      setUploadedFile(null);
      setInput("");
    } else {
      onSend(input);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className={mobileFloat
      ? "fixed md:relative bottom-[88px] md:bottom-auto left-3 right-3 md:left-auto md:right-auto md:mx-6 md:mb-4 z-[60] md:z-auto pt-2 px-3 pb-2 md:pt-2 md:pb-2 rounded-2xl"
      : "shrink-0 px-4 md:px-6 pb-3 md:pb-4 pt-2"}
      style={mobileFloat
        ? { background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.92)", boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)" } as React.CSSProperties
        : { borderTop: "1px solid rgba(226,232,240,0.6)" }}>
      <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
        onChange={handleFileChange} />
      <input ref={imageInputRef} type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp,.gif"
        onChange={handleFileChange} />
      {/* Uploaded file indicator */}
      {uploadedFile && (
        <div className="flex items-center gap-2 mb-2 px-1">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 flex-1 min-w-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span className="text-xs text-blue-700 font-medium truncate">{uploadedFile.name}</span>
            <span className="text-[10px] text-blue-400 shrink-0">{(uploadedFile.size / 1024).toFixed(0)} KB</span>
          </div>
          <button onClick={() => setUploadedFile(null)} className="text-slate-400 hover:text-slate-600 shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}
      {/* Suggestion pills — default or per-category, hidden in chat mode */}
      {!hideTopSuggestions && (
        <div className="flex gap-1.5 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {currentSuggestions.map((s) => (
            <button key={s} onClick={() => onSend(s)}
              className="shrink-0 px-3 py-1 rounded-full border border-slate-200 bg-white text-[11px] font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all whitespace-nowrap"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input card */}
      <div className="rounded-2xl border overflow-visible mb-2 relative"
        style={{
          background: mobileFloat ? "transparent" : "#fff",
          borderColor: listening ? "#3b82f6" : mobileFloat ? "transparent" : "#e2e8f0",
          boxShadow: listening
            ? "0 0 0 3px rgba(59,130,246,0.12), 0 4px 20px rgba(0,0,0,0.08)"
            : mobileFloat ? "none" : "0 4px 20px rgba(0,0,0,0.08)",
          transition: "box-shadow 0.2s, border-color 0.2s",
        }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={listening ? "Berbicara sekarang…" : (activeCat?.placeholder ?? "Tanya Alerin tentang materi, tugas, jurnal, skripsi, atau kebutuhan kuliah lainnya...")}
          rows={2}
          className="w-full px-4 pt-3 pb-2 text-sm text-slate-800 placeholder-slate-400 resize-none outline-none leading-relaxed rounded-t-2xl"
        />
        {/* Bottom row inside card */}
        <div className="flex items-center px-2.5 pb-2 pt-0.5 gap-1.5">
          <div className="flex items-center gap-1.5 overflow-x-auto flex-1 min-w-0" style={{ scrollbarWidth: "none" }}>
            {/* Upload trigger */}
            <div className="relative shrink-0">
              <button ref={uploadBtnRef} onClick={openUploadMenu}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all whitespace-nowrap"
                style={uploadMenuOpen ? { borderColor: "#93c5fd", color: "#2563eb", background: "#eff6ff" } : {}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Lampirkan
              </button>

              {/* Upload popup menu */}
              {uploadMenuOpen && uploadMenuPos && (
                <>
                  <div className="fixed inset-0 z-[190]" onClick={() => setUploadMenuOpen(false)} />
                  <div className="fixed z-[200] w-56 rounded-2xl overflow-hidden"
                    style={{
                      bottom: uploadMenuPos.bottom,
                      left: Math.min(uploadMenuPos.left, window.innerWidth - 240),
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                    }}>
                    {/* Upload dokumen */}
                    <button onClick={() => { fileInputRef.current?.click(); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#eff6ff" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-slate-800">Upload Dokumen</p>
                        <p className="text-[10px] text-slate-400">PDF, Word, PPT, TXT</p>
                      </div>
                    </button>

                    {/* Upload foto */}
                    <button onClick={() => { imageInputRef.current?.click(); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#f5f3ff" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-slate-800">Upload Foto / Gambar</p>
                        <p className="text-[10px] text-slate-400">JPG, PNG, WEBP, GIF</p>
                      </div>
                    </button>

                    <div className="mx-4 h-px bg-slate-100" />

                    {/* Ambil foto kamera */}
                    <button onClick={() => {
                      const inp = document.createElement("input");
                      inp.type = "file"; inp.accept = "image/*"; inp.capture = "environment";
                      inp.onchange = (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) { setUploadedFile(f); setUploadMenuOpen(false); } };
                      inp.click();
                    }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#f0fdf4" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-slate-800">Ambil dari Kamera</p>
                        <p className="text-[10px] text-slate-400">Foto langsung dari kamera</p>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mode selector pill */}
            <div className="shrink-0" ref={modeRef}>
              <button
                ref={modeBtnRef}
                onClick={() => {
                  if (modeOpen) { setModeOpen(false); setModeDropdownPos(null); return; }
                  const rect = modeBtnRef.current?.getBoundingClientRect();
                  if (rect) setModeDropdownPos({ top: rect.top - 8, left: rect.left });
                  setModeOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all whitespace-nowrap"
                style={{ borderColor: currentMode.border, color: currentMode.color, background: currentMode.bg }}>
                {currentMode.icon}
                {currentMode.label}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.6 }}><path d="M6 9l6 6 6-6"/></svg>
              </button>

              {/* Mode dropdown — fixed to escape overflow:hidden parents */}
              {modeOpen && modeDropdownPos && (
                <div className="fixed w-72 rounded-2xl bg-white border border-slate-200 overflow-hidden z-[200]"
                  style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.14)", bottom: `calc(100vh - ${modeDropdownPos.top}px)`, left: Math.min(modeDropdownPos.left, (typeof window !== "undefined" ? window.innerWidth : 400) - 296) }}>
                  <p className="px-4 pt-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mode Jawaban</p>
                  {MODES.map((m) => (
                    <button key={m.id} onClick={() => { setActiveMode(m.id); setModeOpen(false); setModeDropdownPos(null); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                      style={activeMode === m.id ? { background: m.bg } : {}}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: m.bg, color: m.color, border: `1.5px solid ${m.border}` }}>
                        {m.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold" style={{ color: activeMode === m.id ? m.color : "#334155" }}>{m.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{m.desc}</p>
                      </div>
                      {activeMode === m.id && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={m.color} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-slate-200 shrink-0 mx-0.5" />

            {/* Category chips — inline scrollable */}
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(isActive ? null : (cat.id as CategoryKey))}
                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all whitespace-nowrap"
                  style={isActive
                    ? { background: "#2563eb", color: "#fff", borderColor: "#2563eb" }
                    : { background: "transparent", color: "#64748b", borderColor: "#e2e8f0" }}>
                  <span style={{ color: isActive ? "#fff" : "#64748b" }}>{cat.icon}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Right side: voice + send */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto pl-1">
            {/* Voice button */}
            <button
              onClick={toggleListening}
              title={listening ? "Hentikan dikte" : "Dikte suara (Bahasa Indonesia)"}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={listening
                ? { background: "#ef4444", color: "#fff", boxShadow: "0 0 0 4px rgba(239,68,68,0.15)" }
                : { background: "#f1f5f9", color: "#64748b" }}>
              {listening ? (
                /* animated mic bars */
                <span className="flex items-end gap-px h-4">
                  {[1, 0.6, 1, 0.4, 0.8].map((h, i) => (
                    <span key={i} className="w-0.5 rounded-full bg-white voice-bar"
                      style={{ height: `${h * 14}px`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </span>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              )}
            </button>

            {/* Send */}
            <button onClick={handleSend} disabled={!input.trim() && !uploadedFile}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-30"
              style={{ background: (input.trim() || uploadedFile) ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "#c7d2fe" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}

// ─── Markdown Renderer (ChatGPT/Gemini-style) ────────────────────────────────
function renderInlineMd(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="bg-slate-100 text-blue-600 px-1.5 py-0.5 rounded text-[0.82em] font-mono">{part.slice(1, -1)}</code>;
    return part;
  });
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const highlight = (line: string, language: string): React.ReactNode => {
    if (language === "json") {
      const parts: React.ReactNode[] = [];
      let rest = line;
      let ki = 0;
      const jsonToken = /("(?:[^"\\]|\\.)*"\s*:)|("(?:[^"\\]|\\.)*")|(true|false|null)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
      let m: RegExpExecArray | null;
      let lastIdx = 0;
      jsonToken.lastIndex = 0;
      while ((m = jsonToken.exec(rest)) !== null) {
        if (m.index > lastIdx) parts.push(<span key={ki++} style={{ color: "#e2e8f0" }}>{rest.slice(lastIdx, m.index)}</span>);
        if (m[1]) parts.push(<span key={ki++} style={{ color: "#93c5fd" }}>{m[1]}</span>);
        else if (m[2]) parts.push(<span key={ki++} style={{ color: "#86efac" }}>{m[2]}</span>);
        else if (m[3]) parts.push(<span key={ki++} style={{ color: "#f97316" }}>{m[3]}</span>);
        else if (m[4]) parts.push(<span key={ki++} style={{ color: "#fb923c" }}>{m[4]}</span>);
        lastIdx = m.index + m[0].length;
      }
      if (lastIdx < rest.length) parts.push(<span key={ki++} style={{ color: "#e2e8f0" }}>{rest.slice(lastIdx)}</span>);
      return parts.length ? <>{parts}</> : <span style={{ color: "#e2e8f0" }}>{line}</span>;
    }
    if (language === "python" || language === "py") {
      const kw = /\b(def|class|import|from|return|if|elif|else|for|while|in|not|and|or|True|False|None|with|as|try|except|finally|raise|pass|break|continue|lambda|yield|async|await|self)\b/g;
      const str = /(["'])(?:(?!\1)[^\\]|\\.)*?\1/g;
      const comment = /(#.*)/g;
      const num = /\b(\d+(?:\.\d+)?)\b/g;
      const fn = /\b([a-zA-Z_]\w*)\s*(?=\()/g;
      let result = line
        .replace(comment, '<c-comment>$1</c-comment>')
        .replace(str, '<c-string>$&</c-string>')
        .replace(kw, '<c-kw>$1</c-kw>')
        .replace(fn, '<c-fn>$1</c-fn>')
        .replace(num, '<c-num>$1</c-num>');
      const colorMap: Record<string, string> = { "c-kw": "#c084fc", "c-string": "#86efac", "c-comment": "#64748b", "c-fn": "#60a5fa", "c-num": "#fb923c" };
      const parts2: React.ReactNode[] = [];
      const tagRe = /<(c-\w+)>(.*?)<\/\1>/g;
      let li = 0, m2: RegExpExecArray | null;
      tagRe.lastIndex = 0;
      while ((m2 = tagRe.exec(result)) !== null) {
        if (m2.index > li) parts2.push(<span key={li} style={{ color: "#e2e8f0" }}>{result.slice(li, m2.index)}</span>);
        parts2.push(<span key={m2.index} style={{ color: colorMap[m2[1]] ?? "#e2e8f0" }}>{m2[2]}</span>);
        li = m2.index + m2[0].length;
      }
      if (li < result.length) parts2.push(<span key={li + 9999} style={{ color: "#e2e8f0" }}>{result.slice(li)}</span>);
      return <>{parts2}</>;
    }
    if (language === "sql") {
      const kw = /\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP BY|ORDER BY|HAVING|INSERT|UPDATE|DELETE|CREATE|TABLE|DROP|ALTER|INDEX|AS|AND|OR|NOT|IN|IS|NULL|DISTINCT|LIMIT|OFFSET|SET|VALUES|INTO)\b/gi;
      const parts3: React.ReactNode[] = [];
      let li3 = 0, m3: RegExpExecArray | null;
      kw.lastIndex = 0;
      while ((m3 = kw.exec(line)) !== null) {
        if (m3.index > li3) parts3.push(<span key={li3} style={{ color: "#e2e8f0" }}>{line.slice(li3, m3.index)}</span>);
        parts3.push(<span key={m3.index} style={{ color: "#c084fc", fontWeight: 600 }}>{m3[0]}</span>);
        li3 = m3.index + m3[0].length;
      }
      if (li3 < line.length) parts3.push(<span key={li3 + 9999} style={{ color: "#e2e8f0" }}>{line.slice(li3)}</span>);
      return <>{parts3}</>;
    }
    // js/ts/jsx/tsx
    if (/^(js|ts|jsx|tsx|javascript|typescript)$/.test(language)) {
      const kw = /\b(const|let|var|function|return|if|else|for|while|in|of|import|export|default|class|extends|new|this|typeof|instanceof|async|await|try|catch|finally|throw|null|undefined|true|false|void|type|interface|enum)\b/g;
      const str = /(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g;
      const comment = /(\/\/.*)/g;
      const num = /\b(\d+(?:\.\d+)?)\b/g;
      const fn = /\b([a-zA-Z_$][\w$]*)\s*(?=\()/g;
      let r = line
        .replace(comment, '<c-comment>$1</c-comment>')
        .replace(str, '<c-string>$&</c-string>')
        .replace(kw, '<c-kw>$1</c-kw>')
        .replace(fn, '<c-fn>$1</c-fn>')
        .replace(num, '<c-num>$1</c-num>');
      const colorMap2: Record<string, string> = { "c-kw": "#c084fc", "c-string": "#86efac", "c-comment": "#64748b", "c-fn": "#60a5fa", "c-num": "#fb923c" };
      const prt: React.ReactNode[] = [];
      const tagRe2 = /<(c-\w+)>(.*?)<\/\1>/g;
      let li4 = 0, m4: RegExpExecArray | null;
      tagRe2.lastIndex = 0;
      while ((m4 = tagRe2.exec(r)) !== null) {
        if (m4.index > li4) prt.push(<span key={li4} style={{ color: "#e2e8f0" }}>{r.slice(li4, m4.index)}</span>);
        prt.push(<span key={m4.index} style={{ color: colorMap2[m4[1]] ?? "#e2e8f0" }}>{m4[2]}</span>);
        li4 = m4.index + m4[0].length;
      }
      if (li4 < r.length) prt.push(<span key={li4 + 9999} style={{ color: "#e2e8f0" }}>{r.slice(li4)}</span>);
      return <>{prt}</>;
    }
    return <span style={{ color: "#e2e8f0" }}>{line}</span>;
  };

  const displayLang = lang || "code";
  const langLabel = displayLang.toUpperCase();

  return (
    <div className="my-4 rounded-2xl overflow-hidden" style={{ background: "#0f1623", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{langLabel}</span>
        </div>
        <button onClick={copy} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all"
          style={{ background: copied ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.07)", color: copied ? "#4ade80" : "#94a3b8" }}>
          {copied ? (
            <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg> Tersalin</>
          ) : (
            <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Salin</>
          )}
        </button>
      </div>
      {/* Code */}
      <div className="overflow-x-auto p-4">
        <pre className="text-[0.8125rem] leading-6 font-mono m-0" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" }}>
          {code.split("\n").map((ln, idx) => (
            <div key={idx} className="flex gap-4">
              <span className="select-none w-6 text-right shrink-0" style={{ color: "#334155" }}>{idx + 1}</span>
              <span>{highlight(ln, displayLang)}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

function MarkdownRenderer({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    // Blank line → skip
    if (!line) { i++; continue; }

    // Code block (fenced with ```)
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim().toLowerCase();
      i++;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(<CodeBlock key={`code-${i}`} lang={lang} code={codeLines.join("\n")} />);
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line)) {
      elements.push(<hr key={i} className="border-slate-200 my-5" />);
      i++; continue;
    }

    // Headings
    const h1m = line.match(/^#\s+(.+)/);
    const h2m = line.match(/^##\s+(.+)/);
    const h3m = line.match(/^###\s+(.+)/);
    const boldOnly = /^\*\*[^*]+\*\*$/.test(line);
    if (h1m || h2m || h3m || boldOnly) {
      const content = h1m ? h1m[1] : h2m ? h2m[1] : h3m ? h3m[1] : line.slice(2, -2);
      const cls = h1m
        ? "text-[1.0625rem] font-bold text-slate-900 mt-7 mb-3 leading-snug"
        : "text-[0.9375rem] font-semibold text-slate-800 mt-6 mb-2.5 leading-snug";
      elements.push(<p key={i} className={cls}>{renderInlineMd(content)}</p>);
      i++; continue;
    }

    // Table block: lines starting with |
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const parseRow = (r: string) => r.replace(/^\||\|$/g, "").split("|").map(c => c.trim());
      const isSep = (r: string) => /^\|[-| :]+\|$/.test(r);
      const rows = tableLines.filter(r => !isSep(r));
      const headers = rows[0] ? parseRow(rows[0]) : [];
      const body = rows.slice(1);
      elements.push(
        <div key={`tbl-${i}`} className="my-5 overflow-x-auto rounded-xl border border-slate-200" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <table className="w-full text-[0.875rem] border-collapse">
            <thead>
              <tr style={{ background: "linear-gradient(90deg,#f8faff,#f1f5ff)" }}>
                {headers.map((h, ci) => (
                  <th key={ci} className="px-4 py-3 text-left text-[0.8125rem] font-semibold text-slate-700 border-b border-slate-200 whitespace-nowrap">
                    {renderInlineMd(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => {
                const cells = parseRow(row);
                return (
                  <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                    {cells.map((cell, ci) => (
                      <td key={ci} className="px-4 py-3 text-slate-700 border-b border-slate-100 leading-relaxed align-top">
                        {renderInlineMd(cell)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s+/.test(line)) {
      const items: React.ReactNode[] = [];
      let n = 1;
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const c = lines[i].trim().replace(/^\d+\.\s+/, "");
        items.push(
          <li key={i} className="flex gap-3.5 items-start">
            <span className="shrink-0 min-w-[1.5rem] h-6 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center leading-none mt-0.5">{n}</span>
            <span className="flex-1 text-[0.9375rem] text-slate-700 leading-7">{renderInlineMd(c)}</span>
          </li>
        );
        n++; i++;
      }
      elements.push(<ol key={`ol-${i}`} className="space-y-3 my-4 list-none">{items}</ol>);
      continue;
    }

    // Bullet list: -, •, ○, —
    if (/^[-•○—]\s+/.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^[-•○—]\s+/.test(lines[i].trim())) {
        const c = lines[i].trim().replace(/^[-•○—]\s+/, "");
        items.push(
          <li key={i} className="flex gap-3 items-start">
            <span className="shrink-0 w-[0.4375rem] h-[0.4375rem] rounded-full bg-slate-400 mt-[0.6rem]" />
            <span className="flex-1 text-[0.9375rem] text-slate-700 leading-7">{renderInlineMd(c)}</span>
          </li>
        );
        i++;
      }
      elements.push(<ul key={`ul-${i}`} className="space-y-2.5 my-4 list-none">{items}</ul>);
      continue;
    }

    // Paragraph
    elements.push(
      <p key={i} className="text-[0.9375rem] text-slate-700 leading-7 mb-1">
        {renderInlineMd(line)}
      </p>
    );
    i++;
  }

  return <div className="space-y-0">{elements}</div>;
}

// ─── Shortcut Modal ───────────────────────────────────────────────────────────
type ShortcutType = "mata-kuliah" | "tugas" | "skripsi" | "cari-judul" | "cari-jurnal";

const SHORTCUT_CONFIG: Record<ShortcutType, {
  icon: string; iconBg: string;
  title: string; subtitle: string;
  fields: { id: string; label: string; placeholder: string; half?: boolean; textarea?: boolean }[];
  preview: string;
  buildPrompt: (f: Record<string, string>) => string;
}> = {
  "mata-kuliah": {
    icon: "📖", iconBg: "linear-gradient(135deg,#dbeafe,#eff6ff)",
    title: "Mata Kuliah", subtitle: "Jelaskan materi, buat rangkuman, contoh, dan latihan sesuai mata kuliahmu.",
    fields: [
      { id: "mataKuliah", label: "Mata kuliah", placeholder: "Contoh: Manajemen Keuangan", half: true },
      { id: "topik", label: "Topik", placeholder: "Contoh: Analisis arus kas", half: true },
      { id: "bagian", label: "Bagian yang belum dipahami", placeholder: "Ceritakan bagian yang masih membingungkan...", textarea: true },
    ],
    preview: `**Analisis Arus Kas dalam Manajemen Keuangan**\n\nArus kas adalah pergerakan uang masuk dan keluar dari perusahaan dalam periode tertentu. Ini adalah salah satu indikator kesehatan keuangan yang paling penting.\n\n## Tiga Jenis Arus Kas\n\n| Jenis | Sumber | Contoh |\n|-------|--------|--------|\n| **Operasional** | Kegiatan bisnis utama | Penerimaan penjualan, pembayaran supplier |\n| **Investasi** | Aset jangka panjang | Beli mesin, jual gedung |\n| **Pendanaan** | Modal & utang | Pinjaman bank, pembayaran dividen |\n\n## Cara Membaca Laporan Arus Kas\n\n- Arus kas **positif** = perusahaan menghasilkan lebih banyak kas dari yang dikeluarkan\n- Arus kas **negatif** tidak selalu buruk, bisa berarti perusahaan sedang berinvestasi\n- Bandingkan selalu dengan *net income* untuk mendeteksi manipulasi laba`,
    buildPrompt: (f) => `Aku butuh bantuan memahami materi **${f.topik || "topik ini"}** dalam mata kuliah **${f.mataKuliah || "mata kuliah ini"}**.\n\nBagian yang belum aku pahami:\n${f.bagian || "Tolong jelaskan secara menyeluruh."}\n\nTolong jelaskan dengan bahasa yang mudah dipahami, lengkap dengan contoh nyata, tabel perbandingan jika perlu, dan ringkasan agar aku benar-benar mengerti.`,
  },
  "tugas": {
    icon: "📋", iconBg: "linear-gradient(135deg,#ede9fe,#f5f3ff)",
    title: "Tugas", subtitle: "Pahami instruksi dosen dan ubah tugas menjadi langkah kerja yang jelas.",
    fields: [
      { id: "mataKuliah", label: "Mata kuliah", placeholder: "Nama mata kuliah", half: true },
      { id: "deadline", label: "Deadline", placeholder: "Contoh: Jumat, 4 September", half: true },
      { id: "instruksi", label: "Instruksi dosen", placeholder: "Tempel instruksi tugas atau hasil yang diminta...", textarea: true },
    ],
    preview: `**Rencana Kerja Tugas: Analisis Laporan Keuangan**\n\nBerdasarkan instruksi dosen, berikut langkah kerja yang bisa kamu ikuti agar tugas selesai tepat waktu dan berkualitas:\n\n## Timeline Pengerjaan\n\n1. **Hari 1–2:** Kumpulkan laporan keuangan 3 tahun terakhir dari IDX atau website resmi perusahaan\n2. **Hari 3:** Hitung rasio keuangan — likuiditas, profitabilitas, dan solvabilitas\n3. **Hari 4:** Analisis tren dan bandingkan dengan rata-rata industri\n4. **Hari 5:** Tulis interpretasi dan rekomendasi\n5. **Hari 6:** Review format, sitasi, dan submit\n\n## Hal yang Sering Dilupakan\n\n- Cantumkan sumber data secara eksplisit di setiap tabel\n- Gunakan format sitasi yang diminta dosen (APA / IEEE)\n- Baca ulang instruksi sebelum submit — checklist setiap poin`,
    buildPrompt: (f) => `Aku punya tugas dari mata kuliah **${f.mataKuliah || "mata kuliah ini"}** dengan deadline **${f.deadline || "segera"}**.\n\nInstruksi dari dosen:\n${f.instruksi || "Tolong bantu aku memahami dan mengerjakan tugas ini."}\n\nBantu aku:\n1. Memahami apa yang diminta dosen secara rinci\n2. Membuat rencana kerja langkah demi langkah dengan timeline yang realistis\n3. Memberikan tips agar hasilnya berkualitas dan tidak salah arah`,
  },
  "skripsi": {
    icon: "🎓", iconBg: "linear-gradient(135deg,#d1fae5,#ecfdf5)",
    title: "Skripsi / Tesis", subtitle: "Dapatkan arahan berdasarkan tahap penelitian dan revisi yang sedang kamu hadapi.",
    fields: [
      { id: "jenjang", label: "Jenjang dan jurusan", placeholder: "Contoh: S1 Manajemen", half: true },
      { id: "tahap", label: "Tahap saat ini", placeholder: "Contoh: Revisi BAB III", half: true },
      { id: "judul", label: "Judul sementara", placeholder: "Masukkan judul atau topik penelitian" },
      { id: "kendala", label: "Kendala utama", placeholder: "Jelaskan revisi dosen atau bagian yang menghambat...", textarea: true },
    ],
    preview: `**Arahan Revisi BAB III — Metodologi Penelitian**\n\nBerdasarkan kendala yang kamu ceritakan, berikut arahan konkret yang bisa langsung diterapkan:\n\n## Perbaikan Prioritas\n\n- **Populasi & Sampel:** Perjelas kriteria inklusi dan eksklusi responden secara eksplisit di teks\n- **Instrumen:** Tambahkan tabel kisi-kisi dengan kolom variabel, indikator, nomor butir, dan referensi teori\n- **Uji Validitas:** Cantumkan hasil pilot test minimal 30 responden sebelum pengumpulan data utama\n\n## Langkah Selanjutnya\n\n1. Revisi subbab 3.3 dengan menambahkan paragraf justifikasi pemilihan teknik sampling\n2. Buat tabel operasionalisasi variabel dengan definisi konseptual dan operasional\n3. Tambahkan bagan/flowchart prosedur penelitian untuk memperjelas alur\n4. Konsultasikan draft revisi ke pembimbing sebelum pengumpulan data dimulai`,
    buildPrompt: (f) => `Aku mahasiswa **${f.jenjang || "S1"}** sedang mengerjakan skripsi/tesis.\n\nJudul sementara: *${f.judul || "[judul penelitian]"}*\nTahap saat ini: **${f.tahap || "[tahap]"}**\n\nKendala yang aku hadapi:\n${f.kendala || "Tolong berikan arahan untuk melanjutkan penelitian ini."}\n\nBerikan arahan yang konkret, spesifik, dan langsung bisa aku terapkan untuk mengatasi kendala ini dan melanjutkan ke tahap berikutnya. Sertakan contoh atau template jika memungkinkan.`,
  },
  "cari-judul": {
    icon: "💡", iconBg: "linear-gradient(135deg,#fef3c7,#fffbeb)",
    title: "Cari Judul", subtitle: "Gabungkan minat, fenomena, objek, dan metode menjadi kandidat judul yang layak.",
    fields: [
      { id: "jurusan", label: "Jurusan", placeholder: "Contoh: Ilmu Komunikasi", half: true },
      { id: "minat", label: "Minat topik", placeholder: "Contoh: Live shopping", half: true },
      { id: "fenomena", label: "Fenomena atau masalah", placeholder: "Hal apa yang menarik untuk diteliti?", textarea: true },
      { id: "objek", label: "Objek penelitian", placeholder: "Contoh: Mahasiswa Gen Z", half: true },
      { id: "metode", label: "Metode", placeholder: "Kuantitatif / Kualitatif", half: true },
    ],
    preview: `**5 Kandidat Judul Skripsi — Ilmu Komunikasi & Live Shopping**\n\nBerikut kandidat judul yang telah disesuaikan dengan minat, objek, dan metode yang kamu tentukan:\n\n1. **Pengaruh Kredibilitas Streamer terhadap Minat Beli Konsumen di TikTok Shop** *(Kuantitatif — PLS-SEM, TAM)*\n\n2. **Strategi Komunikasi Pemasaran Live Commerce dalam Mendorong Keputusan Pembelian Impulsif Generasi Z** *(Kualitatif — Studi kasus)*\n\n3. **Hubungan Interaktivitas Live Shopping dengan Kepercayaan dan Intensi Pembelian Konsumen Muda** *(Kuantitatif — Regresi berganda)*\n\n4. **Peran Social Proof dan Scarcity Appeal dalam Live Commerce terhadap Purchase Intention** *(Kuantitatif — SEM-AMOS)*\n\n5. **Pengalaman Belanja Live Commerce: Studi Fenomenologi Konsumen Perkotaan Indonesia** *(Kualitatif — Fenomenologi)*\n\n## Rekomendasi Terbaik\n\nJudul **no. 1 dan no. 3** paling feasible karena data primer mudah didapat (survei online) dan literatur pendukungnya sudah banyak tersedia di Scopus.`,
    buildPrompt: (f) => `Aku mahasiswa jurusan **${f.jurusan || "[jurusan]"}** yang tertarik dengan topik **${f.minat || "[minat topik]"}**.\n\nFenomena yang menarik untuk diteliti:\n${f.fenomena || "[fenomena]"}\n\nObjek penelitian: **${f.objek || "[objek]"}**\nMetode yang dipertimbangkan: **${f.metode || "Kuantitatif / Kualitatif"}**\n\nBantu aku menemukan 5 kandidat judul skripsi yang:\n- Kuat secara akademik dan layak dijadikan penelitian S1\n- Relevan dengan isu terkini dan data yang mudah diakses\n- Menggunakan variabel yang jelas dan terukur\n- Dilengkapi rekomendasi metode, teori, dan tingkat feasibility-nya`,
  },
  "cari-jurnal": {
    icon: "🔍", iconBg: "linear-gradient(135deg,#e0f2fe,#f0f9ff)",
    title: "Cari Jurnal", subtitle: "Cari sumber berdasarkan topik, tahun, indeks, dan tujuan penggunaannya.",
    fields: [
      { id: "topik", label: "Topik atau kata kunci", placeholder: "Contoh: Purchase intention pada live shopping" },
      { id: "tahun", label: "Rentang tahun", placeholder: "Contoh: 2021–2026", half: true },
      { id: "indeks", label: "Indeks sumber", placeholder: "Sinta / Scopus / Semua", half: true },
      { id: "tujuan", label: "Tujuan penggunaan", placeholder: "Contoh: Landasan teori dan research gap", textarea: true },
    ],
    preview: `**Hasil Pencarian Jurnal — Purchase Intention & Live Shopping**\n\nBerikut rekomendasi jurnal relevan berdasarkan topik dan indeks yang kamu minta:\n\n| Judul | Penulis | Tahun | Indeks |\n|-------|---------|-------|--------|\n| **Live streaming commerce and mimic purchase intention** | Wongkitrungrueng & Assarut | 2020 | Scopus Q1 |\n| **Influencer live streaming and purchase intention** | Sun et al. | 2022 | Scopus Q2 |\n| **Consumer behavior in TikTok live shopping** | Liu & Zhang | 2023 | Scopus Q2 |\n| **Pengaruh interaktivitas live commerce terhadap impulse buying** | Pratama & Susanti | 2023 | Sinta 2 |\n| **Trust and purchase intention in social commerce** | Chen et al. | 2021 | Scopus Q1 |\n\n## Cara Menggunakannya\n\n- Akses melalui **Google Scholar**, **Semantic Scholar**, atau **Sinta** (untuk jurnal lokal)\n- Gunakan kata kunci: *live streaming commerce*, *purchase intention*, *social commerce*\n- Filter tahun **2020–2026** untuk memastikan relevansi terkini\n- Simpan DOI atau link permanen sebelum menutup halaman`,
    buildPrompt: (f) => `Bantu aku mencari jurnal ilmiah untuk penelitian dengan topik: **${f.topik || "[topik penelitian]"}**.\n\nRentang tahun: **${f.tahun || "5 tahun terakhir"}**\nIndeks yang diutamakan: **${f.indeks || "Scopus / Sinta / Semua"}**\nTujuan penggunaan: ${f.tujuan || "Sebagai referensi penelitian"}\n\nBerikan:\n1. Minimal 5 rekomendasi jurnal relevan dalam format tabel (judul, penulis, tahun, indeks, link/DOI jika ada)\n2. Kata kunci pencarian yang efektif untuk database akademik\n3. Tips mengakses jurnal tersebut secara gratis jika memungkinkan`,
  },
};

function ShortcutModal({ type, onClose, onSubmit }: { type: ShortcutType; onClose: () => void; onSubmit: (text: string) => void }) {
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [fields, setFields] = useState<Record<string, string>>({});
  const config = SHORTCUT_CONFIG[type];
  const setField = (id: string, val: string) => setFields(f => ({ ...f, [id]: val }));

  // Group half fields into pairs
  const renderFormFields = () => {
    const defs = config.fields;
    const nodes: React.ReactNode[] = [];
    let i = 0;
    while (i < defs.length) {
      const f = defs[i];
      const next = defs[i + 1];
      if (f.half && next?.half) {
        nodes.push(
          <div key={f.id} className="grid grid-cols-2 gap-3">
            {[f, next].map(fd => (
              <div key={fd.id}>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">{fd.label}</label>
                <input
                  value={fields[fd.id] ?? ""}
                  onChange={e => setField(fd.id, e.target.value)}
                  placeholder={fd.placeholder}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
                  style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#93c5fd"; e.currentTarget.style.background = "#fff"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                />
              </div>
            ))}
          </div>
        );
        i += 2;
      } else if (f.textarea) {
        nodes.push(
          <div key={f.id}>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.label}</label>
            <textarea
              value={fields[f.id] ?? ""}
              onChange={e => setField(f.id, e.target.value)}
              placeholder={f.placeholder}
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none resize-none transition-all"
              style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}
              onFocus={e => { e.currentTarget.style.borderColor = "#93c5fd"; e.currentTarget.style.background = "#fff"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
            />
          </div>
        );
        i++;
      } else {
        nodes.push(
          <div key={f.id}>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.label}</label>
            <input
              value={fields[f.id] ?? ""}
              onChange={e => setField(f.id, e.target.value)}
              placeholder={f.placeholder}
              className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
              style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}
              onFocus={e => { e.currentTarget.style.borderColor = "#93c5fd"; e.currentTarget.style.background = "#fff"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
            />
          </div>
        );
        i++;
      }
    }
    return nodes;
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center sm:p-4"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <div className="w-full sm:max-w-lg bg-white sm:rounded-3xl rounded-t-3xl overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.28), 0 8px 24px rgba(0,0,0,0.12)" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 md:px-7 pt-6 md:pt-7 pb-0">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: config.iconBg }}>
              {config.icon}
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <h2 className="font-display font-800 text-[1.375rem] text-slate-900 mb-1">{config.title}</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-4">{config.subtitle}</p>
          <div className="flex gap-0 border-b border-slate-100">
            {(["form", "preview"] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className="pb-3 mr-7 text-sm font-semibold transition-colors relative whitespace-nowrap"
                style={{ color: activeTab === t ? "#0f172a" : "#94a3b8" }}>
                {t === "form" ? "Isi kebutuhan" : "Contoh hasil"}
                {activeTab === t && <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-slate-900" />}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 md:px-7 py-5 max-h-[55vh] overflow-y-auto">
          {activeTab === "form" ? (
            <div className="space-y-4">{renderFormFields()}</div>
          ) : (
            <div className="rounded-2xl border border-slate-100 px-5 py-4" style={{ background: "#f8fafc" }}>
              <MarkdownRenderer text={config.preview} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 md:px-7 pb-6 md:pb-7 pt-3 flex items-center justify-end gap-3 border-t border-slate-50">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
            Batal
          </button>
          <button onClick={() => onSubmit(config.buildPrompt(fields))}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)", boxShadow: "0 4px 14px rgba(37,99,235,0.4)" }}>
            Proses dengan Alerin
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: Percakapan (Chat) ───────────────────────────────────────────────────
function PercakapanTab({ onFeatureClick, onTab, onFeatureRec, initialMsgs, pendingPrompt, onPendingPromptConsumed }: { onFeatureClick: (f: string) => void; onTab: (t: NavTab) => void; onFeatureRec?: (rec: FeatureRec) => void; initialMsgs?: ChatMsg[]; pendingPrompt?: string; onPendingPromptConsumed?: () => void }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>(initialMsgs ?? []);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [chatMode, setChatMode] = useState((initialMsgs ?? []).length > 0);
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);
  const [shortcutModal, setShortcutModal] = useState<ShortcutType | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const openFeature = useCallback((rec: FeatureRec) => {
    if (onFeatureRec) onFeatureRec(rec);
    else if (rec.tab) onTab(rec.tab);
  }, [onFeatureRec, onTab]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  useEffect(() => {
    if (pendingPrompt) { send(pendingPrompt); onPendingPromptConsumed?.(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendWithFile = useCallback((text: string, file: { name: string; type: string; size: string }) => {
    setChatMode(true);
    const userMsg: ChatMsg = { role: "user", text: text.trim(), time: now(), fileCard: file };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { role: "claro", text: `Oke, saya sudah menerima file **${file.name}** (${file.type}, ${file.size}). Saya akan membantu menganalisisnya. Apa yang ingin kamu ketahui dari dokumen ini?`, time: now() }]);
    }, 1600);
  }, []);

  const send = useCallback((text: string) => {
    if (!text.trim()) return;
    setChatMode(true);
    const userMsg: ChatMsg = { role: "user", text: text.trim(), time: now() };
    setMsgs((m) => [...m, userMsg]);
    setInput("");

    if (isImageRequest(text)) {
      const prompt = extractImagePrompt(text);
      const imageUrl = getImageUrl(text);
      setMsgs((m) => [...m, { role: "claro", text: "", time: now(), generating: true, imagePrompt: prompt }]);
      setTimeout(() => {
        const replyText = `Ini gambar tentang "${prompt}" yang sudah Alerin buat untuk kamu! ✨`;
        setMsgs((m) => m.map((msg, i) =>
          i === m.length - 1 && msg.generating
            ? { ...msg, generating: false, imageUrl, text: replyText, suggestions: ["Buat gambar tema lain", "Ceritakan detail gambar ini"] }
            : msg
        ));
      }, 3200);
    } else if (isParaphraseRequest(text)) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        const original = extractTargetText(text);
        const versions = generateParaphrases(original);
        setMsgs((m) => [...m, { role: "claro", text: "Berikut beberapa pilihan parafrase untuk teksmu. Pilih yang paling sesuai dengan gaya penulisanmu!", time: now(), paraphrase: { original, versions }, suggestions: ["Parafrase kalimat lain", "Cara hindari plagiarisme"], featureRec: getFeatureRec(text) }]);
      }, 1600);
    } else {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        const replyText = getAIResponse(text);
        setMsgs((m) => [...m, { role: "claro", text: replyText, time: now(), suggestions: getSuggestions(text, replyText), sources: getSources(text, replyText), featureRec: getFeatureRec(text) }]);
      }, 1400);
    }
  }, []);

  if (!chatMode) {
    return (
      <>
      <div className="flex-1 flex flex-col overflow-hidden relative" style={{
        background: "linear-gradient(160deg, #fafcff 0%, #f4f8ff 40%, #f8fbff 70%, #fafcff 100%)",
      }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, rgba(59,130,246,0.035) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        zIndex: 0,
      }} />
        <div className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-5">
          {/* Hero card */}
          <div className="rounded-2xl mb-4 overflow-hidden" style={{
            background: "#ffffff",
            border: "1.5px solid rgba(191,219,254,0.4)",
            boxShadow: "0 2px 16px rgba(59,130,246,0.06), 0 1px 3px rgba(59,130,246,0.04)",
          }}>
            <div className="flex items-center gap-6 px-6 py-5">
              {/* Left: text */}
              <div className="flex-1 min-w-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold mb-3" style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", color: "#374151" }}>
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <path d="M6 0l1.2 3.8L11 4.5l-3 2.9.7 4L6 9.5l-2.7 1.9.7-4-3-2.9 3.8-.7z" fill="#2563eb"/>
                  </svg>
                  AI khusus dunia perkuliahan
                </span>
                <h2 className="font-display font-900 leading-snug mb-2 text-slate-900" style={{ fontSize: "clamp(1.15rem, 3.2vw, 1.6rem)" }}>
                  Tanya apa saja tentang kuliah.{" "}
                  <span style={{ color: "#2563eb", fontWeight: 600 }}>Alerin bantu sampai jelas.</span>
                </h2>
                <p className="text-slate-500 text-[12px] leading-relaxed mb-4">
                  Mulai dari materi, tugas, jurnal, hingga skripsi—semua dalam satu ruang yang memahami perjalanan kuliahmu.
                </p>
                <button onClick={() => send("Halo Alerin! Aku mau mulai belajar hari ini.")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
                  Mulai Chat
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>

              {/* Right: mascot */}
              <img src={claroIconImg} alt="Alerin mascot" className="hidden sm:block shrink-0 object-contain" style={{ width: 100, height: 100 }} />
            </div>
          </div>

          {/* Shortcuts */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-bold text-slate-800 text-base">Pintasan untukmu</p>
                <p className="text-xs text-slate-400">Disesuaikan dengan jurusan dan semester</p>
              </div>
              <button onClick={() => onTab("fitur")} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Lihat semua <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SHORTCUTS.map((s, idx) => {
                const types: ShortcutType[] = ["mata-kuliah", "tugas", "skripsi", "cari-judul"];
                const sType = types[idx] ?? "mata-kuliah";
                return (
                  <button key={s.title} onClick={() => setShortcutModal(sType)}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all text-left group">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: s.bg }}>{s.icon}</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{s.title}</p>
                      <p className="text-[11px] text-slate-400">{s.desc}</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" className="ml-auto shrink-0"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                );
              })}
            </div>
          </div>


          {/* Mobile only: input scrolls with content */}
          <div className="md:hidden">
            <ChatInputBox
              input={input} setInput={setInput} onSend={send}
              activeCategory={activeCategory} setActiveCategory={setActiveCategory}
              onSendWithFile={sendWithFile}
            />
          </div>
          </div>{/* close max-w-5xl */}
        </div>{/* close overflow-y-auto */}

        {/* Desktop only: static input pinned at bottom */}
        <div className="hidden md:block shrink-0">
          <div className="max-w-5xl mx-auto">
            <ChatInputBox
              input={input} setInput={setInput} onSend={send}
              activeCategory={activeCategory} setActiveCategory={setActiveCategory}
              onSendWithFile={sendWithFile}
            />
          </div>
        </div>
      </div>{/* close flex-1 flex-col */}
      {shortcutModal && (
        <ShortcutModal
          type={shortcutModal}
          onClose={() => setShortcutModal(null)}
          onSubmit={(text) => { setShortcutModal(null); send(text); }}
        />
      )}
      </>
    );
  }

  // Chat mode
  return (
    <>
    <div className="flex-1 flex flex-col overflow-hidden" style={{
      background: "linear-gradient(160deg, #fafcff 0%, #f4f8ff 40%, #f8fbff 70%, #fafcff 100%)",
    }}>
      {/* Decorative dot grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, rgba(59,130,246,0.035) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        zIndex: 0,
      }} />

      <div className="flex-1 overflow-y-auto relative z-10 pb-4">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-8">
        {msgs.map((m, i) => {
          const isLastAlerin = m.role === "claro" && !m.generating && i === msgs.length - 1;

          /* ── User message ─────────────────────────────────────── */
          if (m.role === "user") {
            return (
              <div key={i} className="flex flex-col items-end gap-1">
                {m.fileCard && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl rounded-br-sm max-w-[80%]" style={{ background: "#1e293b" }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#fee2e2" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{m.fileCard.name}</p>
                      <p className="text-xs text-slate-400">{m.fileCard.type} · {m.fileCard.size}</p>
                    </div>
                  </div>
                )}
                <div className="max-w-[80%] md:max-w-[68%] rounded-2xl rounded-br-sm px-4 py-3 text-[0.9375rem] leading-relaxed text-white"
                  style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)", boxShadow: "0 4px 14px rgba(59,130,246,0.28)" }}>
                  {m.text}
                </div>
                <p className="text-[10px] text-slate-400 pr-1">{m.time}</p>
              </div>
            );
          }

          /* ── Alerin message ────────────────────────────────────── */
          return (
            <div key={i} className="flex flex-col gap-3">
              {/* Avatar row */}
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">Alerin</span>
              </div>

              {/* Content */}
              <div className="pl-9">
                {m.generating && m.imagePrompt ? (
                  <ImageGeneratingBubble prompt={m.imagePrompt} />
                ) : m.imageUrl ? (
                  <div className="flex flex-col gap-3">
                    <ImageResultBubble imageUrl={m.imageUrl} prompt={m.imagePrompt ?? ""} />
                    <MarkdownRenderer text={m.text} />
                  </div>
                ) : m.paraphrase ? (
                  <div className="flex flex-col gap-4">
                    <MarkdownRenderer text={m.text} />
                    <ParaphraseBubble original={m.paraphrase.original} versions={m.paraphrase.versions} />
                  </div>
                ) : (
                  <MarkdownRenderer text={m.text} />
                )}
                <p className="text-[10px] text-slate-400 mt-3">{m.time}</p>

                {/* Sources */}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-4">
                    <details className="group">
                      <summary className="flex items-center gap-2 cursor-pointer list-none select-none w-fit">
                        <div className="flex -space-x-1.5">
                          {m.sources.slice(0, 3).map((_, si) => (
                            <div key={si} className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white"
                              style={{ background: si === 0 ? "#3b82f6" : si === 1 ? "#6366f1" : "#8b5cf6", zIndex: 3 - si }}>
                              {si + 1}
                            </div>
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-slate-500 group-open:text-blue-600 transition-colors">
                          {m.sources.length} Sumber
                        </span>
                        <svg className="w-3 h-3 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                      </summary>
                      <div className="mt-3 flex flex-col gap-2">
                        {m.sources.map((src, si) => (
                          <div key={si} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50/60">
                            <div className="w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5"
                              style={{ background: si === 0 ? "#3b82f6" : si === 1 ? "#6366f1" : "#8b5cf6" }}>
                              {si + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              {src.url ? (
                                <a href={src.url} target="_blank" rel="noopener noreferrer"
                                  className="text-xs font-medium text-blue-600 hover:underline leading-snug line-clamp-2">
                                  {src.title}
                                </a>
      ) : step === 1 || showEmailVerify ? null : (
                                <p className="text-xs font-medium text-slate-700 leading-snug line-clamp-2">{src.title}</p>
                              )}
                              <p className="text-[10px] text-slate-400 mt-0.5">{src.author} · {src.year}</p>
                            </div>
                            {src.url && (
                              <svg className="w-3 h-3 text-slate-300 shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                )}

                {/* Suggestions */}
                {isLastAlerin && m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[11px] text-slate-400 font-medium mb-2">Kalau mau, saya bisa:</p>
                    <div className="flex flex-col gap-1.5">
                      {m.suggestions.map((s, si) => (
                        <button key={si} onClick={() => send(s)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-left transition-all hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                          style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(226,232,240,0.8)", color: "#475569", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feature recommendation card */}
                {isLastAlerin && m.featureRec && (
                  <button
                    onClick={() => openFeature(m.featureRec!)}
                    className="mt-4 w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all hover:shadow-md group"
                    style={{ background: "linear-gradient(135deg, #f8faff 0%, #fff 100%)", borderColor: "#dbeafe", boxShadow: "0 1px 6px rgba(59,130,246,0.07)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ background: `${m.featureRec.color}15`, border: `1.5px solid ${m.featureRec.color}30` }}>
                      {m.featureRec.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: m.featureRec.color }}>Fitur Alerin</span>
                        <span className="text-[10px] text-slate-400">· Coba sekarang</span>
                      </div>
                      <p className="text-sm font-bold text-slate-800">{m.featureRec.label}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed truncate">{m.featureRec.desc}</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="shrink-0 group-hover:stroke-blue-500 transition-colors"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {typing && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">Alerin</span>
            </div>
            <div className="pl-9 flex gap-1 items-center h-6">
              {[0, 0.2, 0.4].map((d) => (
                <div key={d} className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${d}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
        </div>
      </div>

      {/* Static input at bottom — all screen sizes */}
      <div className="shrink-0 relative z-10">
        <div className="max-w-5xl mx-auto">
          <ChatInputBox
            input={input} setInput={setInput} onSend={send}
            onNewChat={() => { setMsgs([]); setChatMode(false); }}
            activeCategory={activeCategory} setActiveCategory={setActiveCategory}
            onSendWithFile={sendWithFile}
            hideTopSuggestions
          />
        </div>
      </div>
    </div>
    {shortcutModal && (
      <ShortcutModal
        type={shortcutModal}
        onClose={() => setShortcutModal(null)}
        onSubmit={(text) => { setShortcutModal(null); send(text); }}
      />
    )}
    </>
  );
}

// ─── TAB: Semua Fitur ─────────────────────────────────────────────────────────
// ─── Embedded Paraphrase Panel ────────────────────────────────────────────────
const PARA_SYNONYMS: Record<string, string[]> = {
  "penelitian": ["kajian", "studi", "analisis", "penyelidikan"],
  "membahas": ["mengkaji", "menganalisis", "menguraikan", "menjelaskan"],
  "menunjukkan": ["memperlihatkan", "mengindikasikan", "mengungkapkan", "membuktikan"],
  "dilakukan": ["dikerjakan", "dijalankan", "dilaksanakan", "diimplementasikan"],
  "menggunakan": ["memanfaatkan", "memakai", "menerapkan", "mengaplikasikan"],
  "terdapat": ["ditemukan", "dijumpai", "ada", "terdiri dari"],
  "berdasarkan": ["berlandaskan", "sesuai dengan", "mengacu pada", "berpijak pada"],
  "bertujuan": ["dimaksudkan", "bermaksud", "difokuskan", "berorientasi"],
  "sehingga": ["oleh karena itu", "dengan demikian", "akibatnya", "maka"],
  "metode": ["pendekatan", "teknik", "cara", "prosedur"],
  "hasil": ["temuan", "luaran", "output", "capaian"],
  "dapat": ["mampu", "bisa", "sanggup", "memungkinkan"],
  "sangat": ["amat", "sungguh", "cukup", "sedemikian"],
  "juga": ["pula", "turut", "selain itu"],
  "namun": ["akan tetapi", "meski demikian", "kendati", "walau begitu"],
  "sebagai": ["selaku", "berperan sebagai", "berfungsi sebagai"],
  "hal ini": ["fenomena tersebut", "kondisi ini", "keadaan ini"],
  "meningkatkan": ["memperbesar", "menambah", "memperkuat", "mengoptimalkan"],
  "data": ["informasi", "fakta", "keterangan"],
  "menjelaskan": ["memaparkan", "menguraikan", "menerangkan", "mendeskripsikan"],
  "penting": ["krusial", "vital", "esensial", "signifikan"],
  "masalah": ["permasalahan", "problematika", "kendala", "isu"],
  "solusi": ["pemecahan", "jawaban", "penyelesaian", "jalan keluar"],
  "proses": ["tahapan", "alur", "mekanisme", "prosedur"],
  "faktor": ["aspek", "variabel", "elemen", "komponen"],
  "tujuan": ["maksud", "sasaran", "target", "objektif"],
  "kesimpulan": ["simpulan", "konklusi", "inferensi", "rangkuman"],
  "sampel": ["responden", "subjek penelitian", "unit analisis"],
};

const PARA_STYLES = [
  { id: "academic", label: "Akademik", desc: "Bahasa formal ilmiah", icon: "🎓" },
  { id: "neutral", label: "Netral", desc: "Seimbang dan natural", icon: "⚖️" },
  { id: "simple", label: "Sederhana", desc: "Mudah dipahami", icon: "💬" },
];
const PARA_LEVELS = [
  { value: 25, label: "Ringan", color: "#22c55e" },
  { value: 55, label: "Sedang", color: "#f59e0b" },
  { value: 85, label: "Mendalam", color: "#ef4444" },
];

function doParaPhrase(text: string, intensity: number): string {
  if (!text.trim()) return "";
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  return sentences.map((sentence) => {
    let result = sentence;
    const entries = Object.entries(PARA_SYNONYMS).sort(() => Math.random() - 0.5);
    const applyCount = Math.floor(entries.length * (intensity / 100));
    entries.slice(0, applyCount).forEach(([word, alts]) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      if (regex.test(result)) {
        const replacement = alts[Math.floor(Math.random() * alts.length)];
        result = result.replace(regex, (match) =>
          match[0] === match[0].toUpperCase()
            ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
            : replacement
        );
      }
    });
    if (intensity > 60) {
      const commaIdx = result.indexOf(",");
      if (commaIdx > 0 && commaIdx < result.length / 2 && Math.random() > 0.5) {
        const first = result.slice(0, commaIdx).trim();
        const second = result.slice(commaIdx + 1).trim().replace(/[.!?]$/, "");
        const end = result.match(/[.!?]$/)?.[0] || ".";
        if (first.length > 10 && second.length > 10) result = `${second.charAt(0).toUpperCase() + second.slice(1)}, ${first.toLowerCase()}${end}`;
      }
    }
    return result.trim();
  }).join(" ");
}

function paraWordCount(t: string) { return t.trim() ? t.trim().split(/\s+/).length : 0; }
function paraSentenceCount(t: string) { return (t.match(/[.!?]+/g) || []).length; }
function paraUniqueness(original: string, result: string): number {
  if (!result) return 0;
  const origWords = new Set(original.toLowerCase().split(/\s+/));
  const resWords = result.toLowerCase().split(/\s+/);
  const matches = resWords.filter((w) => origWords.has(w)).length;
  return Math.round((1 - matches / Math.max(origWords.size, 1)) * 100);
}

function ParaDiffView({ original, result }: { original: string; result: string }) {
  const origSet = new Set(original.toLowerCase().split(/\s+/));
  return (
    <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
      {result.split(/(\s+)/).map((token, i) => {
        if (/^\s+$/.test(token)) return <span key={i}>{token}</span>;
        const isNew = !origSet.has(token.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""));
        return <span key={i} className={isNew ? "rounded px-0.5 font-medium" : ""} style={isNew ? { background: "#dbeafe", color: "#1d4ed8" } : {}}>{token}</span>;
      })}
    </p>
  );
}

function ParafrasePanel({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [level, setLevel] = useState(55);
  const [style, setStyle] = useState("academic");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"editor" | "diff">("editor");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileNotice, setFileNotice] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const readFile = useCallback((file: File) => {
    setFileNotice(null);
    if (file.size > 5 * 1024 * 1024) { setFileNotice("Ukuran file maksimal 5 MB."); return; }
    setFileName(file.name);
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (e) => { setInput(e.target?.result as string || ""); setOutput(""); };
      reader.readAsText(file);
    } else {
      setInput(
        "Penelitian ini bertujuan untuk mengkaji pengaruh teknologi informasi terhadap efisiensi kerja karyawan. " +
        "Data dikumpulkan menggunakan metode survei dengan sampel sebanyak 120 responden dari berbagai perusahaan di Jakarta. " +
        "Hasil penelitian menunjukkan bahwa terdapat pengaruh yang sangat signifikan antara penggunaan teknologi informasi dan produktivitas karyawan. " +
        "Oleh karena itu, perusahaan sangat disarankan untuk meningkatkan investasi dalam infrastruktur teknologi sebagai solusi utama."
      );
      setOutput("");
      setFileNotice(`File ${file.name} diunggah. Teks contoh ditampilkan — parsing PDF/DOCX memerlukan layanan backend.`);
    }
  }, []);

  const handleParaphrase = useCallback(() => {
    if (!input.trim() || loading) return;
    setLoading(true); setOutput(""); setProgress(0); setActiveTab("editor");
    const duration = 1400 + Math.random() * 600;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(95, (elapsed / duration) * 100);
      setProgress(pct);
      if (elapsed < duration) requestAnimationFrame(tick);
      else {
        const result = doParaPhrase(input, level);
        setOutput(result); setProgress(100); setLoading(false);
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    };
    requestAnimationFrame(tick);
  }, [input, level, loading]);

  const handleCopy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([output], { type: "text/plain" }));
    a.download = "hasil-parafrase.txt"; a.click();
  };

  const score = output ? paraUniqueness(input, output) : null;
  const inputWC = paraWordCount(input);
  const outputWC = paraWordCount(output);
  const currentLevel = PARA_LEVELS.find((l) => l.value === level) ?? PARA_LEVELS[1];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleParaphrase(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleParaphrase]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-8 py-4 border-b border-slate-100 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)" }}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: "#eff6ff" }}>✏️</div>
        <div>
          <h2 className="font-display font-800 text-base text-slate-900">Parafrase Online</h2>
          <p className="text-[11px] text-slate-400">Ubah teks akademik secara otomatis dengan AI</p>
        </div>
        <span className="ml-auto text-[10px] text-slate-400 hidden sm:block">Ctrl+Enter untuk proses</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 md:px-8 py-5 flex flex-col gap-5">

          {/* Hidden file input */}
          <input ref={fileRef} type="file" accept=".txt,.pdf,.docx" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f); e.target.value = ""; }} />

          {/* Style + Level row */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Style */}
            <div className="rounded-2xl bg-white border border-slate-100 p-4" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Gaya Bahasa</p>
              <div className="flex gap-2">
                {PARA_STYLES.map((s) => (
                  <button key={s.id} onClick={() => setStyle(s.id)}
                    className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-center transition-all"
                    style={style === s.id ? { borderColor: "#2563eb", background: "#eff6ff" } : { borderColor: "#f1f5f9", background: "#fff" }}>
                    <span className="text-base">{s.icon}</span>
                    <span className="text-[10px] font-bold" style={{ color: style === s.id ? "#2563eb" : "#64748b" }}>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity */}
            <div className="rounded-2xl bg-white border border-slate-100 p-4" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Intensitas</p>
              <div className="flex gap-2">
                {PARA_LEVELS.map((l) => (
                  <button key={l.value} onClick={() => setLevel(l.value)}
                    className="flex-1 py-2 rounded-xl text-[11px] font-semibold border-2 transition-all"
                    style={level === l.value ? { borderColor: l.color, background: l.color + "14", color: l.color } : { borderColor: "#f1f5f9", color: "#94a3b8" }}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab selector */}
          <div className="flex gap-1 rounded-xl p-1 bg-white border border-slate-100 self-start" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
            {(["editor", "diff"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} disabled={tab === "diff" && !output}
                className="px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-30"
                style={activeTab === tab ? { background: "#2563eb", color: "#fff" } : { color: "#64748b" }}>
                {tab === "editor" ? "✏️ Editor" : "🔍 Perbandingan"}
              </button>
            ))}
          </div>

          {/* Editor panels */}
          {activeTab === "editor" && (
            <div className="grid md:grid-cols-2 gap-4">
              {/* Input */}
              <div className="flex flex-col rounded-2xl overflow-hidden border border-slate-100 bg-white" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)", minHeight: 340 }}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="text-xs font-semibold text-slate-500">Teks Asli</span>
                    {/* File pill — shown when a file is loaded */}
                    {fileName && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 ml-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <span className="text-[10px] font-semibold text-blue-600 max-w-[100px] truncate">{fileName}</span>
                        <button onClick={() => { setFileName(null); setFileNotice(null); setInput(""); setOutput(""); }}
                          className="text-blue-300 hover:text-blue-600 transition-colors ml-0.5">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{inputWC} kata · {paraSentenceCount(input)} kalimat</span>
                    {/* Upload icon */}
                    <button onClick={() => fileRef.current?.click()} title="Lampirkan file (.txt .pdf .docx)"
                      className="w-6 h-6 flex items-center justify-center rounded-lg transition-colors"
                      style={{ color: fileName ? "#3b82f6" : "#94a3b8" }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#3b82f6"; e.currentTarget.style.background = "#eff6ff"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = fileName ? "#3b82f6" : "#94a3b8"; e.currentTarget.style.background = "transparent"; }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                      </svg>
                    </button>
                  </div>
                </div>
                {fileNotice && (
                  <div className="px-4 py-2 border-b border-amber-100 bg-amber-50">
                    <p className="text-[11px] text-amber-700 leading-relaxed">{fileNotice}</p>
                  </div>
                )}
                <textarea value={input} onChange={(e) => { setInput(e.target.value); setOutput(""); }}
                  placeholder={"Tempel teks skripsimu di sini…\n\nContoh: Penelitian ini bertujuan untuk mengkaji..."}
                  className="flex-1 p-5 text-sm leading-relaxed resize-none outline-none text-slate-700 placeholder-slate-300"
                  style={{ background: "transparent", minHeight: 260 }} />
                <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3">
                  <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (inputWC / 500) * 100)}%`, background: inputWC > 400 ? "#ef4444" : "#2563eb" }} />
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{inputWC}/500 kata</span>
                </div>
              </div>

              {/* Output */}
              <div ref={outputRef} className="flex flex-col rounded-2xl overflow-hidden border bg-white"
                style={{ boxShadow: output ? "0 4px 20px rgba(37,99,235,0.1)" : "0 2px 12px rgba(0,0,0,0.04)", borderColor: output ? "#bfdbfe" : "#f1f5f9", minHeight: 340 }}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${output ? "bg-blue-500" : "bg-slate-300"}`} />
                    <span className="text-xs font-semibold text-slate-500">Hasil Parafrase</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {score !== null && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">+{score}% lebih unik</span>}
                    {output && (
                      <>
                        <button onClick={handleCopy} className="text-[10px] font-semibold transition-colors flex items-center gap-1" style={{ color: copied ? "#059669" : "#2563eb" }}>
                          {copied ? <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>Disalin</> : <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Salin</>}
                        </button>
                        <button onClick={handleDownload} className="text-[10px] font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Unduh
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex-1 p-5 overflow-y-auto" style={{ minHeight: 260 }}>
                  {loading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                      <div className="relative w-14 h-14">
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                          <circle cx="28" cy="28" r="24" fill="none" stroke="#e2e8f0" strokeWidth="4"/>
                          <circle cx="28" cy="28" r="24" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 24}`}
                            strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
                            style={{ transition: "stroke-dashoffset 0.1s ease" }}/>
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-blue-600">{Math.round(progress)}%</span>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-700 mb-1">Memproses teks…</p>
                        <p className="text-xs text-slate-400">AI sedang menganalisis dan merestrukturisasi kalimatmu</p>
                      </div>
                    </div>
                  ) : output ? (
                    <p className="text-sm leading-relaxed text-slate-700">{output}</p>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.5"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
                      </div>
                      <p className="text-sm font-semibold text-slate-400">Hasil akan muncul di sini</p>
                      <p className="text-xs text-slate-300">Masukkan teks lalu klik "Parafrase Sekarang"</p>
                    </div>
                  )}
                </div>
                {output && (
                  <div className="px-4 py-2.5 border-t border-blue-100 bg-blue-50/40 flex gap-4">
                    {[{ label: "Kata", orig: inputWC, res: outputWC }, { label: "Kalimat", orig: paraSentenceCount(input), res: paraSentenceCount(output) }].map((s) => (
                      <div key={s.label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <span>{s.label}:</span>
                        <span className="text-slate-400 line-through">{s.orig}</span>
                        <span>→</span>
                        <span className="font-semibold text-blue-600">{s.res}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Diff tab */}
          {activeTab === "diff" && output && (
            <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Perbandingan Kata</span>
                <div className="flex items-center gap-4 text-[10px]">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: "#dbeafe" }}/><span className="text-slate-500">Kata baru</span></span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-200"/><span className="text-slate-500">Tidak berubah</span></span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="p-6"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Teks Asli</p><p className="text-sm leading-relaxed text-slate-600">{input}</p></div>
                <div className="p-6"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Hasil Parafrase</p><ParaDiffView original={input} result={output} /></div>
              </div>
              <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 grid grid-cols-3 gap-4">
                {[
                  { label: "Tingkat Orisinalitas", value: `${score}%`, color: "#059669" },
                  { label: "Kata Diubah", value: String(Math.round(outputWC * ((score ?? 0) / 100))), color: "#2563eb" },
                  { label: "Intensitas Digunakan", value: currentLevel.label, color: currentLevel.color },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="font-display font-800 text-xl" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleParaphrase} disabled={!input.trim() || loading}
              className="flex-1 btn-primary flex items-center justify-center gap-2 py-3.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none">
              {loading ? (
                <><div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"/>Memparafrase…</>
              ) : (
                <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>Parafrase Sekarang</>
              )}
            </button>
            {output && (
              <>
                <button onClick={handleCopy} className="btn-outline flex items-center justify-center gap-2 px-5 py-3.5 text-sm" style={{ color: copied ? "#059669" : undefined, borderColor: copied ? "#059669" : undefined }}>
                  {copied ? "✓ Disalin!" : "Salin Teks"}
                </button>
                <button onClick={handleDownload}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold rounded-xl text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Unduh File
                </button>
                <button onClick={() => setActiveTab("diff")} className="flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold rounded-xl border-2 border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all">
                  🔍 Bandingkan
                </button>
              </>
            )}
          </div>

          {/* Score cards */}
          {output && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-4">
              {[
                { label: "Kata Asli", value: inputWC, icon: "📝" },
                { label: "Kata Hasil", value: outputWC, icon: "✍️" },
                { label: "Tingkat Unik", value: `${score}%`, icon: "⭐" },
                { label: "Kalimat", value: paraSentenceCount(output), icon: "📋" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-slate-100 bg-white p-4 flex flex-col items-center text-center" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                  <span className="text-lg mb-1">{s.icon}</span>
                  <span className="font-display font-800 text-xl text-blue-600">{s.value}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Embedded Grammar Checker ─────────────────────────────────────────────────
type GramErrorCategory = "ejaan" | "grammar" | "tanda-baca" | "gaya" | "redundansi" | "konsistensi";
type GramErrorSeverity = "error" | "warning" | "info";
type GrammarError = { id: number; start: number; end: number; word: string; category: GramErrorCategory; severity: GramErrorSeverity; suggestion: string; explanation: string; confidence: number; ignored?: boolean; fixed?: boolean };

const GRAM_CATEGORY_META: Record<GramErrorCategory, { label: string; color: string; bg: string; border: string }> = {
  ejaan:        { label: "Ejaan",          color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
  grammar:      { label: "Tata Bahasa",    color: "#9333ea", bg: "#faf5ff", border: "#d8b4fe" },
  "tanda-baca": { label: "Tanda Baca",     color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
  gaya:         { label: "Gaya Akademik",  color: "#0284c7", bg: "#f0f9ff", border: "#7dd3fc" },
  redundansi:   { label: "Redundansi",     color: "#ea580c", bg: "#fff7ed", border: "#fdba74" },
  konsistensi:  { label: "Konsistensi",    color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
};

const GRAM_SAMPLE_TEXT = `Penelitian ini membahas tentang pengaruh media sosial terhadap produktivitas mahasiswa. Penelitian dilakukan dengan metoda kualitatif dan melibatkan 100 responden. Data dikumpulkan oleh peneliti melalui wawancara mendalam dan questionnaire yang dibagikan secara online. Hasil daripada penelitian menunjukkan bahwa penggunaan media sosial yang berlebihan dapat menurunkan produktivitas mahasiswa secara signifikan.`;

const GRAM_DEMO_ERRORS: GrammarError[] = [
  { id: 1, start: 22, end: 38, word: "membahas tentang", category: "redundansi", severity: "error", suggestion: "membahas", explanation: "Kata 'tentang' tidak diperlukan karena verba 'membahas' sudah mengandung makna pembahasan terhadap suatu topik.", confidence: 98 },
  { id: 2, start: 116, end: 122, word: "metoda", category: "ejaan", severity: "error", suggestion: "metode", explanation: "Penulisan yang baku menurut KBBI adalah 'metode', bukan 'metoda'.", confidence: 99 },
  { id: 3, start: 221, end: 233, word: "questionnaire", category: "konsistensi", severity: "warning", suggestion: "kuesioner", explanation: "Gunakan istilah bahasa Indonesia 'kuesioner' secara konsisten dalam karya ilmiah.", confidence: 95 },
  { id: 4, start: 258, end: 268, word: "Data dikumpulkan oleh peneliti", category: "gaya", severity: "warning", suggestion: "Peneliti mengumpulkan data", explanation: "Kalimat pasif berlebihan. Kalimat aktif lebih dianjurkan dalam penulisan akademik.", confidence: 87 },
  { id: 5, start: 322, end: 335, word: "Hasil daripada", category: "grammar", severity: "error", suggestion: "Hasil", explanation: "Penggunaan 'daripada' di sini tidak tepat secara tata bahasa. Kata 'daripada' digunakan untuk membandingkan, bukan menunjukkan kepemilikan.", confidence: 97 },
];

const GRAM_SCORE_BREAKDOWN = [
  { label: "Ejaan", value: 96, color: "#2563eb" },
  { label: "Tata Bahasa", value: 91, color: "#9333ea" },
  { label: "Tanda Baca", value: 88, color: "#d97706" },
  { label: "Gaya Akademik", value: 94, color: "#0284c7" },
  { label: "Konsistensi Istilah", value: 90, color: "#059669" },
];

const GRAM_REVIEW_ITEMS = [
  { id: 1, before: "Penelitian ini membahas tentang pengaruh", after: "Penelitian ini membahas pengaruh", cat: "redundansi" as GramErrorCategory, reason: "Menghilangkan kata yang tidak diperlukan agar kalimat lebih efektif." },
  { id: 2, before: "dilakukan dengan metoda kualitatif", after: "dilakukan dengan metode kualitatif", cat: "ejaan" as GramErrorCategory, reason: "Menggunakan bentuk ejaan baku KBBI 'metode'." },
  { id: 3, before: "questionnaire yang dibagikan", after: "kuesioner yang dibagikan", cat: "konsistensi" as GramErrorCategory, reason: "Menggunakan istilah bahasa Indonesia yang konsisten." },
  { id: 4, before: "Data dikumpulkan oleh peneliti", after: "Peneliti mengumpulkan data", cat: "gaya" as GramErrorCategory, reason: "Kalimat aktif lebih efektif dan dianjurkan dalam penulisan akademik." },
  { id: 5, before: "Hasil daripada penelitian", after: "Hasil penelitian", cat: "grammar" as GramErrorCategory, reason: "Penggunaan 'daripada' tidak tepat; kata ini untuk perbandingan, bukan kepemilikan." },
];

function GramSeverityDot({ severity }: { severity: GramErrorSeverity }) {
  const colors: Record<GramErrorSeverity, string> = { error: "#dc2626", warning: "#d97706", info: "#2563eb" };
  return <span className="w-2 h-2 rounded-full shrink-0 mt-0.5" style={{ background: colors[severity] }} />;
}

function GramCategoryBadge({ cat }: { cat: GramErrorCategory }) {
  const m = GRAM_CATEGORY_META[cat];
  return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide" style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>{m.label}</span>;
}

function GramCircularScore({ score, size = 120 }: { score: number; size?: number }) {
  const r = size * 0.38; const circ = 2 * Math.PI * r;
  const color = score >= 90 ? "#059669" : score >= 75 ? "#2563eb" : "#d97706";
  const label = score >= 90 ? "Sangat Baik" : score >= 75 ? "Baik" : "Perlu Perbaikan";
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={size*0.07}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.07} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ*(1-score/100)}/>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display font-800 leading-none" style={{ fontSize: size*0.22, color }}>{score}</span>
        <span style={{ fontSize: size*0.09, color: "#64748b" }} className="font-medium">{label}</span>
      </div>
    </div>
  );
}

function GramProgressBar({ value, color = "#2563eb", height = 8 }: { value: number; color?: string; height?: number }) {
  return (
    <div className="flex-1 rounded-full overflow-hidden" style={{ height, background: "#f1f5f9" }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }}/>
    </div>
  );
}

function GramHighlightedText({ text, errors, selectedId, onSelect }: { text: string; errors: GrammarError[]; selectedId: number | null; onSelect: (id: number) => void }) {
  const active = errors.filter((e) => !e.ignored && !e.fixed);
  if (!text) return null;
  const segments: Array<{ text: string; error?: GrammarError }> = [];
  let cursor = 0;
  for (const err of [...active].sort((a, b) => a.start - b.start)) {
    if (err.start > cursor) segments.push({ text: text.slice(cursor, err.start) });
    segments.push({ text: text.slice(err.start, err.end), error: err });
    cursor = err.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return (
    <span>
      {segments.map((seg, i) => {
        if (!seg.error) return <span key={i}>{seg.text}</span>;
        const m = GRAM_CATEGORY_META[seg.error.category];
        const isSelected = selectedId === seg.error.id;
        return (
          <mark key={i} onClick={() => onSelect(seg.error!.id)} className="cursor-pointer rounded-sm transition-all"
            style={{ background: isSelected ? m.bg : "transparent", borderBottom: `2px ${seg.error.severity === "error" ? "solid" : "dashed"} ${m.color}`, color: "inherit", padding: "0 1px", outline: isSelected ? `2px solid ${m.color}` : "none" }}>
            {seg.text}
          </mark>
        );
      })}
    </span>
  );
}

function GramEditorScreen({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<GrammarError[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [filterCat, setFilterCat] = useState<GramErrorCategory | "all">("all");
  const [mode, setMode] = useState<"edit" | "view">("edit");
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedError = errors.find((e) => e.id === selectedId && !e.ignored && !e.fixed) ?? null;
  const activeErrors = errors.filter((e) => !e.ignored && !e.fixed);
  const filtered = filterCat === "all" ? activeErrors : activeErrors.filter((e) => e.category === filterCat);
  const errorCount = activeErrors.filter((e) => e.severity === "error").length;
  const warnCount = activeErrors.filter((e) => e.severity === "warning").length;
  const score = analyzed ? Math.round(100 - errorCount * 4 - warnCount * 2) : 0;

  const analyze = useCallback(() => {
    if (!text.trim()) return;
    setAnalyzing(true); setAnalyzed(false); setErrors([]); setSelectedId(null);
    setTimeout(() => {
      const mapped: GrammarError[] = [];
      for (const demo of GRAM_DEMO_ERRORS) {
        const idx = text.indexOf(demo.word);
        if (idx !== -1) mapped.push({ ...demo, start: idx, end: idx + demo.word.length });
      }
      setErrors(mapped); setAnalyzing(false); setAnalyzed(true); setMode("view");
    }, 1800);
  }, [text]);

  const applyFix = useCallback((id: number) => {
    setErrors((prev) => prev.map((e) => {
      if (e.id !== id) return e;
      setText(text.slice(0, e.start) + e.suggestion + text.slice(e.end));
      return { ...e, fixed: true };
    }));
    setSelectedId(null);
  }, [text]);

  const ignoreError = useCallback((id: number) => {
    setErrors((prev) => prev.map((e) => e.id === id ? { ...e, ignored: true } : e));
    setSelectedId(null);
  }, []);

  const CATS = Object.entries(GRAM_CATEGORY_META) as [GramErrorCategory, typeof GRAM_CATEGORY_META[GramErrorCategory]][];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 md:px-6 py-3 border-b border-slate-100 flex items-center gap-3 flex-wrap" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)" }}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500 shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0" style={{ background: "#f0f9ff" }}>📝</div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-800 text-sm text-slate-900">Grammar Checker</h2>
          <p className="text-[11px] text-slate-400">Periksa ejaan, tata bahasa, dan gaya akademik</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input ref={fileRef} type="file" accept=".txt,.pdf,.doc,.docx" className="hidden"
            onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = (ev) => { setText(ev.target?.result as string ?? ""); setMode("edit"); setAnalyzed(false); setErrors([]); }; reader.readAsText(file); e.target.value = ""; }} />
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload
          </button>
          <button onClick={() => { setText(GRAM_SAMPLE_TEXT); setAnalyzed(false); setErrors([]); setMode("edit"); }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">Teks Contoh</button>
          {analyzed && (
            <button onClick={onDone} className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">Lihat Skor</button>
          )}
          <button onClick={analyze} disabled={!text.trim() || analyzing}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white disabled:opacity-40 transition-all"
            style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
            {analyzing ? <><div className="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin"/>Memeriksa…</> : <>Periksa Grammar</>}
          </button>
        </div>
      </div>

      {/* Two-column body */}
      <div className="flex flex-1 min-h-0">
        {/* LEFT: Editor */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-slate-100">
          {/* Toolbar */}
          <div className="shrink-0 flex items-center gap-1 px-3 py-2 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-1 ml-auto">
              {(["edit", "view"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} className="px-2.5 py-1 rounded text-[11px] font-semibold transition-all"
                  style={mode === m ? { background: "#eff6ff", color: "#2563eb" } : { color: "#94a3b8" }}>
                  {m === "edit" ? "Edit" : "Review"}
                </button>
              ))}
              <span className="text-[11px] text-slate-400 ml-3">{text.split(/\s+/).filter(Boolean).length} kata</span>
            </div>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-y-auto relative" style={{ background: "#fafbff" }}>
            {!text && !analyzing ? (
              <div className="h-full flex flex-col items-center justify-center px-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <h3 className="font-display font-700 text-base text-slate-700 mb-2">Mulai Periksa Tulisanmu</h3>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed mb-5">Tempel teks atau upload dokumen untuk menemukan kesalahan ejaan, grammar, dan gaya akademik.</p>
                <div className="flex gap-2">
                  <button onClick={() => { setTimeout(() => document.getElementById("gram-textarea")?.focus(), 50); }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>Paste Teks</button>
                  <button onClick={() => fileRef.current?.click()} className="px-4 py-2 rounded-xl text-xs font-semibold border-2 border-slate-200 text-slate-600 hover:border-blue-300 transition-all">Upload</button>
                </div>
              </div>
            ) : mode === "view" && analyzed ? (
              <div className="p-6 max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-5 p-3 rounded-xl border" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>Pemeriksaan selesai
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500">{activeErrors.length} masalah — klik kata bergaris untuk detail</span>
                </div>
                <p className="text-[15px] leading-loose text-slate-800" style={{ fontFamily: "Georgia, serif" }}>
                  <GramHighlightedText text={text} errors={errors} selectedId={selectedId} onSelect={setSelectedId}/>
                </p>
              </div>
            ) : (
              <div className="flex h-full">
                <div className="shrink-0 w-9 pt-6 text-right pr-2 select-none" style={{ color: "#cbd5e1", fontSize: 11, lineHeight: "1.75rem" }}>
                  {text.split("\n").map((_, i) => <div key={i}>{i + 1}</div>)}
                </div>
                <textarea id="gram-textarea" value={text} onChange={(e) => { setText(e.target.value); setAnalyzed(false); setErrors([]); }}
                  placeholder="Tulis atau tempel teks skripsimu di sini..."
                  className="flex-1 p-6 pl-2 text-sm text-slate-800 placeholder-slate-300 resize-none outline-none leading-loose bg-transparent"
                  style={{ fontFamily: "Georgia, serif", fontSize: 14 }}/>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Analysis panel */}
        <div className="w-72 shrink-0 flex flex-col bg-white overflow-y-auto border-l border-slate-100">
          {!analyzed ? (
            <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3 text-xl">📋</div>
              <p className="font-semibold text-slate-700 text-sm mb-1">Hasil Analisis</p>
              <p className="text-slate-400 text-xs leading-relaxed">Klik "Periksa Grammar" untuk memulai analisis.</p>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <GramCircularScore score={score} size={72}/>
                  <div>
                    <p className="font-display font-700 text-slate-800 text-xs mb-1">Hasil Analisis</p>
                    {[{ color: "bg-red-500", label: `${errorCount} Kesalahan` }, { color: "bg-amber-400", label: `${warnCount} Saran` }, { color: "bg-emerald-500", label: `${Math.max(0,100-(errorCount+warnCount)*4)}% Kalimat Baik` }].map((s) => (
                      <div key={s.label} className="flex items-center gap-1.5 mb-0.5">
                        <span className={`w-2 h-2 rounded-full ${s.color}`}/>
                        <span className="text-[11px] text-slate-600">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={onDone} className="mt-3 w-full py-1.5 rounded-xl text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all">Lihat Skor Lengkap →</button>
              </div>

              <div className="p-3 border-b border-slate-100">
                <div className="flex flex-wrap gap-1">
                  <button onClick={() => setFilterCat("all")} className="px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all"
                    style={filterCat === "all" ? { background: "#eff6ff", color: "#2563eb" } : { background: "#f8faff", color: "#64748b" }}>
                    Semua ({activeErrors.length})
                  </button>
                  {CATS.map(([key, m]) => {
                    const count = activeErrors.filter((e) => e.category === key).length;
                    if (!count) return null;
                    return (
                      <button key={key} onClick={() => setFilterCat(key)} className="px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all"
                        style={filterCat === key ? { background: m.bg, color: m.color, border: `1px solid ${m.border}` } : { background: "#f8faff", color: "#64748b" }}>
                        {m.label} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="p-5 text-center"><p className="text-xl mb-1">✅</p><p className="text-xs font-semibold text-slate-700">Tidak ada kesalahan di kategori ini</p></div>
                ) : filtered.map((err) => {
                  const m = GRAM_CATEGORY_META[err.category];
                  const isSelected = selectedId === err.id;
                  return (
                    <div key={err.id}>
                      <button onClick={() => { setSelectedId(isSelected ? null : err.id); setMode("view"); }}
                        className="w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-all"
                        style={isSelected ? { background: m.bg } : {}}>
                        <div className="flex items-start gap-2">
                          <GramSeverityDot severity={err.severity}/>
                          <div className="flex-1 min-w-0">
                            <GramCategoryBadge cat={err.category}/>
                            <p className="text-xs text-slate-700 font-medium line-through decoration-red-400 truncate mt-1">"{err.word}"</p>
                            <p className="text-xs text-emerald-700 font-semibold">→ "{err.suggestion}"</p>
                          </div>
                        </div>
                      </button>
                      {isSelected && (
                        <div className="px-4 py-3 border-b border-slate-200 bg-white" style={{ boxShadow: "inset 0 2px 8px rgba(0,0,0,0.04)" }}>
                          <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{err.explanation}</p>
                          <div className="flex items-center gap-1.5 mb-3">
                            <span className="text-[10px] text-slate-400 shrink-0">AI:</span>
                            <GramProgressBar value={err.confidence} height={4} color="#2563eb"/>
                            <span className="text-[10px] font-bold text-blue-600">{err.confidence}%</span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => applyFix(err.id)} className="flex-1 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>✓ Terapkan</button>
                            <button onClick={() => ignoreError(err.id)} className="flex-1 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">Abaikan</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {activeErrors.length > 0 && (
                <div className="p-3 border-t border-slate-100">
                  <button onClick={() => activeErrors.forEach((e) => applyFix(e.id))} className="w-full py-2 rounded-xl text-xs font-bold border-2 border-blue-200 text-blue-600 hover:bg-blue-50 transition-all">
                    Perbaiki Semua ({activeErrors.length})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function GramScoreScreen({ onBack, onReview }: { onBack: () => void; onReview: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
      {/* Back header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h2 className="font-display font-800 text-base text-slate-900">Analisis Grammar Selesai</h2>
          <p className="text-xs text-slate-400">Ringkasan kualitas tulisanmu</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <div className="rounded-2xl bg-white border border-slate-100 p-6 flex flex-col items-center" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <GramCircularScore score={92} size={130}/>
          <p className="mt-3 text-sm font-semibold text-slate-600">Skor Keseluruhan</p>
          <div className="mt-3 grid grid-cols-3 gap-1.5 w-full text-center">
            {[["Kesalahan","3"],["Saran","4"],["Kalimat Baik","18"]].map(([l,v]) => (
              <div key={l} className="rounded-xl bg-slate-50 py-2">
                <p className="font-bold text-slate-700 text-sm">{v}</p>
                <p className="text-[9px] text-slate-400">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 rounded-2xl bg-white border border-slate-100 p-6" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <p className="font-display font-700 text-slate-800 mb-4 text-sm">Breakdown per Kategori</p>
          <div className="space-y-3">
            {GRAM_SCORE_BREAKDOWN.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-36 shrink-0">{s.label}</span>
                <GramProgressBar value={s.value} color={s.color} height={8}/>
                <span className="text-xs font-bold text-slate-700 w-9 text-right">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-6">
        {[
          { icon: "🔴", label: "3 Kesalahan", desc: "Wajib diperbaiki", bg: "#fef2f2", border: "#fca5a5", color: "#dc2626" },
          { icon: "🟡", label: "4 Saran", desc: "Disarankan diperbaiki", bg: "#fffbeb", border: "#fcd34d", color: "#d97706" },
          { icon: "🟢", label: "18 Kalimat Baik", desc: "Tidak perlu perubahan", bg: "#ecfdf5", border: "#6ee7b7", color: "#059669" },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl p-4 border" style={{ background: c.bg, borderColor: c.border }}>
            <p className="text-xl mb-1">{c.icon}</p>
            <p className="font-bold text-slate-800 text-sm">{c.label}</p>
            <p className="text-xs mt-0.5" style={{ color: c.color }}>{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-blue-100 p-5 mb-6" style={{ background: "#eff6ff" }}>
        <p className="font-semibold text-blue-700 text-sm mb-1.5 flex items-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Rekomendasi AI
        </p>
        <p className="text-sm text-blue-700 leading-relaxed">Secara umum tulisan sudah cukup baik. Fokus perbaikan utama pada <strong>tanda baca</strong> dan <strong>konsistensi istilah</strong>. Perhatikan kata 'metoda' yang seharusnya 'metode' sesuai KBBI.</p>
      </div>

      <div className="flex gap-3 justify-center pb-4">
        <button onClick={onReview} className="px-6 py-3 rounded-xl text-sm font-bold text-white flex items-center gap-2" style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>Review Semua Perbaikan</button>
        <button onClick={onBack} className="px-6 py-3 rounded-xl text-sm font-semibold border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">Kembali ke Editor</button>
      </div>
    </div>
  );
}

function GramReviewScreen({ onBack, onFinish }: { onBack: () => void; onFinish: () => void }) {
  const [current, setCurrent] = useState(0);
  const [applied, setApplied] = useState<Set<number>>(new Set());
  const [skipped, setSkipped] = useState<Set<number>>(new Set());
  const item = GRAM_REVIEW_ITEMS[current];
  const isApplied = applied.has(item.id); const isSkipped = skipped.has(item.id);
  const m = GRAM_CATEGORY_META[item.cat];
  const allDone = applied.size + skipped.size === GRAM_REVIEW_ITEMS.length;

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div className="flex-1">
          <h2 className="font-display font-800 text-base text-slate-900">Review Perbaikan</h2>
          <p className="text-xs text-slate-400">Perubahan {current + 1} dari {GRAM_REVIEW_ITEMS.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{applied.size} diterapkan · {skipped.size} dilewati</span>
          {allDone && <button onClick={onFinish} className="px-4 py-1.5 rounded-xl text-xs font-bold text-white" style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>Selesai</button>}
        </div>
      </div>

      <div className="flex gap-1.5 mb-6">
        {GRAM_REVIEW_ITEMS.map((r, i) => (
          <div key={r.id} className="flex-1 h-1.5 rounded-full transition-all"
            style={{ background: applied.has(r.id) ? "#059669" : skipped.has(r.id) ? "#94a3b8" : i === current ? "#2563eb" : "#e2e8f0" }}/>
        ))}
      </div>

      <div className="grid md:grid-cols-5 gap-5">
        <div className="md:col-span-3 space-y-3">
          {[{ label: "Sebelum", bg: "#fef2f2", color: "#dc2626", text: item.before },
            { label: "Sesudah", bg: "#ecfdf5", color: "#059669", text: item.after }].map((p) => (
            <div key={p.label} className="rounded-2xl bg-white border border-slate-100 overflow-hidden" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <div className="px-4 py-2.5 border-b border-slate-100" style={{ background: p.bg }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: p.color }}>{p.label}</span>
              </div>
              <p className="px-5 py-4 text-sm text-slate-700 leading-loose" style={{ fontFamily: "Georgia, serif" }}>
                {p.text}… {p.label === "Sesudah" && <mark className="ml-1 rounded px-1 py-0.5 text-xs" style={{ background: "#dcfce7", color: "#059669" }}>diubah</mark>}
              </p>
            </div>
          ))}
        </div>
        <div className="md:col-span-2 rounded-2xl bg-white border border-slate-100 p-5 flex flex-col" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <GramCategoryBadge cat={item.cat}/>
          <p className="font-display font-700 text-slate-800 mt-3 mb-1.5 text-sm">Alasan Perubahan</p>
          <p className="text-xs text-slate-500 leading-relaxed flex-1">{item.reason}</p>
          <div className="mt-5 space-y-2">
            <button onClick={() => { setApplied((p) => new Set([...p, item.id])); if (current < GRAM_REVIEW_ITEMS.length - 1) setCurrent((c) => c + 1); }}
              disabled={isApplied} className="w-full py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60" style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
              {isApplied ? "✓ Diterapkan" : "Terapkan"}
            </button>
            <button onClick={() => { setSkipped((p) => new Set([...p, item.id])); if (current < GRAM_REVIEW_ITEMS.length - 1) setCurrent((c) => c + 1); }}
              disabled={isSkipped} className="w-full py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-60 transition-all">
              {isSkipped ? "Dilewati" : "Lewati"}
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
              className="flex-1 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 flex items-center justify-center gap-1 transition-all">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Prev
            </button>
            <button onClick={() => setCurrent((c) => Math.min(GRAM_REVIEW_ITEMS.length - 1, c + 1))} disabled={current === GRAM_REVIEW_ITEMS.length - 1}
              className="flex-1 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 flex items-center justify-center gap-1 transition-all">
              Next<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GrammarPanel({ onBack }: { onBack: () => void }) {
  const [screen, setScreen] = useState<"editor" | "score" | "review">("editor");
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {screen === "editor" && <GramEditorScreen onDone={() => setScreen("score")} onBack={onBack}/>}
      {screen === "score" && <GramScoreScreen onBack={() => setScreen("editor")} onReview={() => setScreen("review")}/>}
      {screen === "review" && <GramReviewScreen onBack={() => setScreen("score")} onFinish={() => setScreen("editor")}/>}
    </div>
  );
}

// ─── Embedded Cek Plagiasi ────────────────────────────────────────────────────
type PlagScreen = "upload" | "analyzing" | "result" | "detail" | "paraphrase" | "review" | "success" | "history";
type PlagSection = { id: number; bab: string; page: number; score: number; severity: "tinggi"|"sedang"|"rendah"; preview: string; original: string; suggested: string };

const PLAG_SECTIONS: PlagSection[] = [
  { id:1, bab:"Bab II", page:18, score:78, severity:"tinggi", preview:"Penelitian ini bertujuan untuk mengetahui pengaruh penggunaan media sosial...", original:"Penelitian ini bertujuan untuk mengetahui pengaruh penggunaan media sosial terhadap minat beli mahasiswa. Dengan meningkatnya penggunaan platform digital, perilaku konsumtif mahasiswa turut mengalami perubahan yang signifikan.", suggested:"Penelitian ini dilakukan untuk menganalisis pengaruh pemanfaatan media sosial terhadap minat beli pada kalangan mahasiswa. Seiring dengan meluasnya penggunaan platform digital, pola perilaku konsumtif mahasiswa mengalami pergeseran yang cukup berarti." },
  { id:2, bab:"Bab II", page:23, score:65, severity:"sedang", preview:"Teori Uses and Gratifications menjelaskan bahwa individu secara aktif...", original:"Teori Uses and Gratifications menjelaskan bahwa individu secara aktif memilih media yang dapat memenuhi kebutuhan mereka, baik kebutuhan informasi maupun hiburan.", suggested:"Teori Uses and Gratifications menyatakan bahwa individu secara proaktif menyeleksi media yang sesuai dengan kebutuhannya, mencakup kebutuhan akan informasi maupun kebutuhan hiburan." },
  { id:3, bab:"Bab IV", page:48, score:54, severity:"sedang", preview:"Hasil penelitian menunjukkan terdapat hubungan positif antara intensitas...", original:"Hasil penelitian menunjukkan terdapat hubungan positif antara intensitas penggunaan media sosial dengan minat beli produk secara online pada mahasiswa.", suggested:"Temuan penelitian mengindikasikan adanya korelasi positif antara frekuensi penggunaan media sosial dengan kecenderungan pembelian produk secara daring di kalangan mahasiswa." },
];
const PLAG_BAB_DATA = [
  { bab:"Bab I — Pendahuluan", score:8, color:"#22c55e" },
  { bab:"Bab II — Landasan Teori", score:42, color:"#dc2626" },
  { bab:"Bab III — Metodologi", score:18, color:"#f59e0b" },
  { bab:"Bab IV — Hasil & Pembahasan", score:12, color:"#f59e0b" },
  { bab:"Bab V — Kesimpulan", score:9, color:"#22c55e" },
];
const PLAG_HISTORY = [
  { date:"27 Agu 2026", file:"Skripsi_Final_v3.docx", score:24, sections:"3 bagian tinggi", status:"Perlu Diperiksa" },
  { date:"20 Agu 2026", file:"Bab_II_Revisi.docx", score:38, sections:"8 bagian", status:"Perlu Diperiksa" },
  { date:"10 Agu 2026", file:"Skripsi_Draft.docx", score:61, sections:"14 bagian", status:"Kemiripan Tinggi" },
];

function plagSeverityColor(s: PlagSection["severity"]) { return s==="tinggi"?"#dc2626":s==="sedang"?"#d97706":"#22c55e"; }
function plagSeverityBg(s: PlagSection["severity"]) { return s==="tinggi"?"#fef2f2":s==="sedang"?"#fffbeb":"#ecfdf5"; }
function plagScoreLabel(n: number) {
  if (n<=20) return { label:"Aman", color:"#059669", bg:"#ecfdf5" };
  if (n<=35) return { label:"Perlu Diperiksa", color:"#d97706", bg:"#fffbeb" };
  return { label:"Kemiripan Tinggi", color:"#dc2626", bg:"#fef2f2" };
}
function plagFormatBytes(b: number) { return b<1024*1024?`${(b/1024).toFixed(0)} KB`:`${(b/(1024*1024)).toFixed(1)} MB`; }

function PlagCircularScore({ score, size=140 }: { score: number; size?: number }) {
  const r=size*0.38; const circ=2*Math.PI*r;
  const { label, color } = plagScoreLabel(score);
  return (
    <div className="relative flex items-center justify-center" style={{ width:size, height:size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={size*0.08}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.08} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ*(1-score/100)}/>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display font-800 leading-none" style={{ fontSize:size*0.22, color }}>{score}%</span>
        <span style={{ fontSize:size*0.085, color:"#64748b" }} className="font-medium text-center px-2">{label}</span>
      </div>
    </div>
  );
}
function PlagProgressBar({ value, color, height=8 }: { value: number; color: string; height?: number }) {
  return (
    <div className="flex-1 rounded-full overflow-hidden" style={{ height, background:"#f1f5f9" }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width:`${value}%`, background:color }}/>
    </div>
  );
}

function PlagUploadScreen({ onAnalyze, onBack }: { onAnalyze: (file: File) => void; onBack: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File|null>(null);
  const [dragOver, setDragOver] = useState(false);
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{ background:"#ecfdf5" }}>🔍</div>
        <div>
          <h2 className="font-display font-800 text-base text-slate-900">Cek Kemiripan Teks</h2>
          <p className="text-xs text-slate-400">Upload skripsimu untuk menganalisis tingkat kemiripan</p>
        </div>
      </div>

      <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
        onChange={(e) => { const f=e.target.files?.[0]; if(f) setFile(f); e.target.value=""; }}/>

      {!file ? (
        <div onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f=e.dataTransfer.files?.[0]; if(f) setFile(f); }}
          className="rounded-2xl border-2 border-dashed p-14 flex flex-col items-center text-center cursor-pointer transition-all mb-5"
          style={dragOver?{borderColor:"#2563eb",background:"#eff6ff"}:{borderColor:"#cbd5e1",background:"#fff"}}>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p className="font-display font-700 text-base text-slate-700 mb-1">Tarik file ke sini</p>
          <p className="text-slate-400 text-sm mb-4">atau klik untuk pilih file</p>
          <div className="flex gap-2 mb-4">
            {["DOCX","PDF","TXT"].map((f) => <span key={f} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold">{f}</span>)}
          </div>
          <span className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold">Pilih File</span>
          <p className="text-[10px] text-slate-400 mt-3">Maks. 50 MB</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 p-5 mb-5" style={{ boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-sm truncate">{file.name}</p>
              <p className="text-xs text-slate-400">{plagFormatBytes(file.size)}</p>
              <div className="flex items-center gap-1 mt-0.5 text-emerald-600 text-xs font-semibold">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>Siap dianalisis
              </div>
            </div>
            <button onClick={() => setFile(null)} className="text-slate-300 hover:text-slate-500 transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[["Format","DOCX"],["Estimasi","< 1 mnt"],["Bab","5 Bab"]].map(([l,v]) => (
              <div key={l} className="rounded-xl bg-slate-50 py-2.5"><p className="font-bold text-slate-700 text-sm">{v}</p><p className="text-[10px] text-slate-400">{l}</p></div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 flex items-center gap-2 mb-5">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <p className="text-xs text-blue-700">Dokumen digunakan hanya untuk proses analisis dan tidak dibagikan kepada pihak lain.</p>
      </div>

      <button onClick={() => file && onAnalyze(file)} disabled={!file}
        className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background:"linear-gradient(135deg,#2563eb,#4f46e5)", boxShadow:file?"0 8px 24px rgba(37,99,235,0.3)":"none" }}>
        {file?"Mulai Analisis":"Pilih Dokumen Terlebih Dahulu"}
      </button>
    </div>
  );
}

function PlagAnalyzingScreen() {
  const steps = [
    { label:"Membaca dokumen", done:true },
    { label:"Menganalisis struktur", done:true },
    { label:"Menganalisis kemiripan", active:true },
    { label:"Menyiapkan hasil", done:false },
  ];
  const [progress] = useState(67);
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
          <div className="w-9 h-9 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"/>
        </div>
        <h2 className="font-display font-700 text-lg text-slate-900 mb-1">Sedang menganalisis dokumen...</h2>
        <p className="text-slate-400 text-sm mb-6">Analisis biasanya membutuhkan beberapa saat.</p>
        <div className="rounded-2xl bg-white border border-slate-100 p-5 text-left" style={{ boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">Progress</span>
            <span className="text-sm font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 mb-5 overflow-hidden">
            <div className="h-full rounded-full bg-blue-600" style={{ width:`${progress}%` }}/>
          </div>
          <div className="space-y-2.5">
            {steps.map((s,i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={s.done?{background:"#22c55e"}:(s as any).active?{background:"#2563eb"}:{background:"#e2e8f0"}}>
                  {s.done?<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    :(s as any).active?<div className="w-2 h-2 rounded-full bg-white animate-pulse"/>
                    :<div className="w-2 h-2 rounded-full bg-slate-300"/>}
                </div>
                <span className="text-sm" style={{ color:s.done?"#22c55e":(s as any).active?"#2563eb":"#94a3b8", fontWeight:(s as any).active?600:400 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlagResultScreen({ fileName, onDetail, onHistory, onBack }: { fileName: string; onDetail: (s: PlagSection) => void; onHistory: () => void; onBack: () => void }) {
  const overall=24;
  const { label, color, bg } = plagScoreLabel(overall);
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h2 className="font-display font-800 text-base text-slate-900">Hasil Analisis Kemiripan</h2>
            <p className="text-slate-400 text-xs flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>{fileName}
            </p>
          </div>
        </div>
        <button onClick={onHistory} className="text-xs font-semibold text-blue-600 flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Riwayat
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl bg-white border border-slate-100 p-6 flex flex-col items-center" style={{ boxShadow:"0 2px 16px rgba(0,0,0,0.05)" }}>
          <PlagCircularScore score={overall} size={130}/>
          <p className="mt-2 text-xs text-slate-500 text-center leading-relaxed">Tingkat kemiripan yang terdeteksi berdasarkan pemeriksaan sistem.</p>
          <span className="mt-2 px-3 py-1 rounded-full text-xs font-bold" style={{ background:bg, color }}>{label}</span>
        </div>
        <div className="rounded-2xl bg-white border border-slate-100 p-5" style={{ boxShadow:"0 2px 16px rgba(0,0,0,0.05)" }}>
          <p className="font-display font-700 text-slate-800 mb-3 text-sm">Ringkasan Dokumen</p>
          <div className="grid grid-cols-2 gap-2">
            {[["Total Halaman","82"],["Bagian Diperiksa","124"],["Kemiripan Tinggi","3"],["Kemiripan Sedang","7"],["Kemiripan Rendah","14"],["Aman","100"]].map(([l,v]) => (
              <div key={l} className="rounded-xl bg-slate-50 p-2.5"><p className="font-bold text-slate-800 text-sm">{v}</p><p className="text-[10px] text-slate-400">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-slate-100 p-5" style={{ boxShadow:"0 2px 16px rgba(0,0,0,0.05)" }}>
          <p className="font-display font-700 text-slate-800 mb-3 text-sm">Distribusi per Bab</p>
          <div className="space-y-2.5">
            {PLAG_BAB_DATA.map((b) => (
              <div key={b.bab} className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 w-28 shrink-0 truncate">{b.bab}</span>
                <PlagProgressBar value={b.score} color={b.color} height={7}/>
                <span className="text-[11px] font-bold w-7 text-right" style={{ color:b.color }}>{b.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-slate-100 p-5 mb-5" style={{ boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
        <p className="font-display font-700 text-slate-800 mb-4 text-sm">Bagian dengan Kemiripan Tertinggi</p>
        <div className="space-y-2.5">
          {PLAG_SECTIONS.map((s,i) => {
            const sc=plagSeverityColor(s.severity); const sb=plagSeverityBg(s.severity);
            return (
              <div key={s.id} className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 transition-all" style={{ background:"#fafafa" }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background:sc }}>{i+1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-slate-700">{s.bab} — Hal. {s.page}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background:sb, color:sc }}>{s.score}% · {s.severity.charAt(0).toUpperCase()+s.severity.slice(1)}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{s.preview}</p>
                </div>
                <button onClick={() => onDetail(s)} className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all">Review</button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-start gap-2">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <p className="text-[11px] text-slate-400 leading-relaxed">Dokumenmu digunakan untuk proses analisis. Similarity score bukan indikasi pasti plagiarisme.</p>
      </div>
    </div>
  );
}

function PlagDetailScreen({ section, onParaphrase, onBack }: { section: PlagSection; onParaphrase: () => void; onBack: () => void }) {
  const sc=plagSeverityColor(section.severity); const sb=plagSeverityBg(section.severity);
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div><h2 className="font-display font-700 text-base text-slate-900">Analisis Kemiripan</h2><p className="text-slate-400 text-xs">{section.bab} — Halaman {section.page}</p></div>
      </div>
      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 rounded-2xl bg-white border border-slate-100 overflow-hidden" style={{ boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Tampilan Dokumen</span>
            <span className="text-[10px] text-slate-400">{section.bab} · Hal. {section.page}</span>
          </div>
          <div className="p-6">
            <p className="text-[13px] text-slate-500 leading-loose mb-4 font-serif">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation.</p>
            <mark className="rounded px-0.5 text-[13px] leading-loose font-serif cursor-pointer" style={{ background:sb, borderBottom:`2px solid ${sc}`, color:"inherit" }}>{section.original}</mark>
            <p className="text-[13px] text-slate-500 leading-loose mt-4 font-serif">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          </div>
        </div>
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="rounded-2xl bg-white border border-slate-100 p-4" style={{ boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Similarity Score</p>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-display font-800 text-3xl" style={{ color:sc }}>{section.score}%</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background:sb, color:sc }}>{section.severity.charAt(0).toUpperCase()+section.severity.slice(1)}</span>
            </div>
            <PlagProgressBar value={section.score} color={sc} height={7}/>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 p-4" style={{ boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Bagian yang Perlu Diperiksa</p>
            <p className="text-xs text-slate-700 leading-relaxed italic">"{section.original}"</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 p-4" style={{ boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>AI Suggestion
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Original</p>
            <p className="text-xs text-slate-600 leading-relaxed line-through decoration-red-300 mb-2 italic">"{section.original}"</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Disarankan</p>
            <p className="text-xs text-emerald-700 leading-relaxed italic">"{section.suggested}"</p>
            <div className="grid grid-cols-2 gap-1.5 mt-3">
              {[["Perubahan Struktur","Tinggi"],["Kejelasan","Baik"],["Gaya Akademik","Baik"],["Makna","Dipertahankan"]].map(([l,v]) => (
                <div key={l} className="rounded-lg bg-slate-50 p-1.5"><p className="text-[9px] text-slate-400">{l}</p><p className="text-[11px] font-semibold text-slate-700">{v}</p></div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onParaphrase} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white" style={{ background:"linear-gradient(135deg,#2563eb,#4f46e5)" }}>Gunakan Hasil</button>
            <button className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all">Parafrase Lagi</button>
          </div>
          <button className="w-full py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">Abaikan</button>
        </div>
      </div>
    </div>
  );
}

function PlagParaphraseScreen({ section, onReview, onBack }: { section: PlagSection; onReview: () => void; onBack: () => void }) {
  const [style, setStyle] = useState("Akademik");
  const [strength, setStrength] = useState("Sedang");
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h2 className="font-display font-700 text-base text-slate-900">Parafrase dengan AI</h2>
      </div>
      <div className="rounded-2xl bg-white border border-slate-100 p-4 mb-5 flex flex-wrap items-center gap-5" style={{ boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">Gaya</p>
          <div className="flex gap-1.5 flex-wrap">
            {["Akademik","Formal","Natural","Ringkas"].map((s) => (
              <button key={s} onClick={() => setStyle(s)} className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                style={style===s?{background:"#eff6ff",color:"#2563eb",border:"1.5px solid #bfdbfe"}:{background:"#f8faff",color:"#64748b",border:"1.5px solid #f1f5f9"}}>{s}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">Tingkat Perubahan</p>
          <div className="flex gap-1.5">
            {["Ringan","Sedang","Tinggi"].map((s) => (
              <button key={s} onClick={() => setStrength(s)} className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                style={strength===s?{background:"#eff6ff",color:"#2563eb",border:"1.5px solid #bfdbfe"}:{background:"#f8faff",color:"#64748b",border:"1.5px solid #f1f5f9"}}>{s}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-2xl bg-white border border-slate-100 overflow-hidden" style={{ boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
          <div className="px-4 py-2.5 border-b border-red-100 bg-red-50"><span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Original</span></div>
          <div className="p-5"><p className="text-sm text-slate-700 leading-loose font-serif">{section.original}</p></div>
        </div>
        <div className="rounded-2xl bg-white border border-emerald-200 overflow-hidden" style={{ boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
          <div className="px-4 py-2.5 border-b border-emerald-100 bg-emerald-50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Hasil Parafrase</span>
            <span className="text-[10px] text-emerald-500 font-semibold">{style} · {strength}</span>
          </div>
          <div className="p-5">
            <p className="text-sm text-slate-700 leading-loose font-serif">
              {section.suggested.split(" ").map((word,i) => {
                const changed=!section.original.toLowerCase().split(" ").includes(word.toLowerCase().replace(/[.,]/g,""));
                return changed?<mark key={i} className="rounded px-0.5" style={{ background:"#dcfce7",color:"inherit" }}>{word} </mark>:<span key={i}>{word} </span>;
              })}
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center gap-2 mb-5">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <p className="text-xs text-amber-700">Pastikan hasil parafrase tetap sesuai dengan makna dan konteks penelitianmu.</p>
      </div>
      <div className="flex gap-3">
        <button onClick={onReview} className="flex-1 py-3 rounded-xl text-sm font-bold text-white" style={{ background:"linear-gradient(135deg,#2563eb,#4f46e5)" }}>Gunakan Hasil</button>
        <button className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 border-blue-200 text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>Generate Ulang
        </button>
      </div>
    </div>
  );
}

function PlagReviewScreen({ onFinish, onBack }: { onFinish: () => void; onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [applied, setApplied] = useState<Set<number>>(new Set());
  const total=PLAG_SECTIONS.length;
  const s=PLAG_SECTIONS[current];
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div><h2 className="font-display font-700 text-base text-slate-900">Review Perubahan</h2><p className="text-slate-400 text-xs">Perubahan {Math.min(current+1,total)} dari {total}</p></div>
        </div>
        {current>=total && <button onClick={onFinish} className="px-4 py-1.5 rounded-xl text-xs font-bold text-white" style={{ background:"linear-gradient(135deg,#059669,#10b981)" }}>Selesai</button>}
      </div>
      <div className="flex gap-1.5 mb-5">
        {PLAG_SECTIONS.map((_,i) => <div key={i} className="flex-1 h-1.5 rounded-full transition-all" style={{ background:i<current?"#2563eb":i===current?"#93c5fd":"#e2e8f0" }}/>)}
      </div>
      {current<total ? (
        <>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {[{label:"Sebelum",bg:"#fef2f2",border:"#fca5a5",color:"#dc2626",text:s.original},{label:"Sesudah (AI Version)",bg:"#ecfdf5",border:"#6ee7b7",color:"#059669",text:s.suggested}].map((p) => (
              <div key={p.label} className="rounded-2xl bg-white border overflow-hidden" style={{ borderColor:p.border, boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
                <div className="px-4 py-2.5 border-b" style={{ borderColor:p.border, background:p.bg }}><span className="text-[10px] font-bold uppercase tracking-wider" style={{ color:p.color }}>{p.label}</span></div>
                <p className="p-5 text-sm leading-loose font-serif" style={{ color:p.label==="Sesudah (AI Version)"?"#065f46":"#374151" }}>{p.text}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 mb-4">
            <p className="text-xs text-blue-700 leading-relaxed">Struktur kalimat diubah untuk mengurangi kemiripan tanpa mengubah inti informasi dan makna akademik dari teks asli.</p>
          </div>
          <div className="flex gap-3 mb-2">
            <button onClick={() => { setApplied((p)=>new Set([...p,s.id])); setCurrent((c)=>c+1); }} className="flex-1 py-3 rounded-xl text-sm font-bold text-white" style={{ background:"linear-gradient(135deg,#2563eb,#4f46e5)" }}>Terapkan Perubahan</button>
            <button onClick={() => setCurrent((c)=>c+1)} className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">Lewati</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCurrent((c)=>Math.max(0,c-1))} disabled={current===0} className="flex-1 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 disabled:opacity-40 flex items-center justify-center gap-1 transition-all">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Sebelumnya
            </button>
            <button onClick={() => setCurrent((c)=>Math.min(total,c+1))} className="flex-1 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 flex items-center justify-center gap-1 transition-all hover:bg-slate-50">
              Berikutnya<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">✅</p>
          <p className="font-display font-700 text-lg text-slate-900 mb-1">Semua bagian sudah direview!</p>
          <p className="text-slate-400 text-sm mb-5">{applied.size} perubahan diterapkan · {total-applied.size} dilewati</p>
          <button onClick={onFinish} className="px-7 py-3 rounded-xl text-sm font-bold text-white" style={{ background:"linear-gradient(135deg,#059669,#10b981)" }}>Selesai</button>
        </div>
      )}
    </div>
  );
}

function PlagSuccessScreen({ onRecheck, onResult }: { onRecheck: () => void; onResult: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5 text-3xl">🎉</div>
        <h2 className="font-display font-800 text-xl text-slate-900 mb-2">Review Selesai!</h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">Semua bagian yang kamu pilih sudah diperiksa dan perubahan telah diterapkan.</p>
        <div className="rounded-2xl bg-white border border-slate-100 p-5 mb-6 grid grid-cols-3 gap-3 text-center" style={{ boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
          {[["3","Bagian Diperiksa"],["2","Perubahan Diterapkan"],["1","Dilewati"]].map(([v,l]) => (
            <div key={l}><p className="font-display font-800 text-xl text-blue-600">{v}</p><p className="text-[11px] text-slate-400 mt-0.5">{l}</p></div>
          ))}
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 mb-5 text-left">
          <p className="text-xs text-amber-700 leading-relaxed"><strong>Estimasi:</strong> Lakukan analisis ulang untuk mendapat skor terbaru setelah perubahan diterapkan.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onResult} className="flex-1 py-3 rounded-xl text-sm font-bold text-white" style={{ background:"linear-gradient(135deg,#2563eb,#4f46e5)" }}>Lihat Dokumen</button>
          <button onClick={onRecheck} className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">Analisis Ulang</button>
        </div>
      </div>
    </div>
  );
}

function PlagHistoryScreen({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState("Semua");
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h2 className="font-display font-700 text-base text-slate-900">Riwayat Pemeriksaan</h2>
      </div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {["Semua","Terbaru","Similarity Tinggi","Sudah Diperbaiki"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={filter===f?{background:"#2563eb",color:"#fff"}:{background:"#f1f5f9",color:"#64748b"}}>{f}</button>
        ))}
      </div>
      <div className="rounded-2xl bg-white border border-slate-100 overflow-hidden" style={{ boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Tanggal","Dokumen","Similarity","Bagian","Status",""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLAG_HISTORY.map((h,i) => {
                const {label,color,bg}=plagScoreLabel(h.score);
                return (
                  <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 text-xs text-slate-500">{h.date}</td>
                    <td className="px-4 py-3.5"><p className="text-xs font-semibold text-slate-700 truncate max-w-[140px]">{h.file}</p></td>
                    <td className="px-4 py-3.5"><span className="font-bold text-sm" style={{color}}>{h.score}%</span></td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">{h.sections}</td>
                    <td className="px-4 py-3.5"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{background:bg,color}}>{label}</span></td>
                    <td className="px-4 py-3.5"><button className="text-xs font-semibold text-blue-600 hover:text-blue-700">Lihat Detail</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Cari Judul Panel ─────────────────────────────────────────────────────────
type JudulKompleksitas = "Rendah" | "Sedang" | "Tinggi";
interface JudulKandidat {
  judul: string;
  variabel: string;
  sesuai: number;
  kompleksitas: JudulKompleksitas;
  alasan: string;
  struktur: { x: string[]; y: string; mediasi?: string; moderasi?: string };
}

const CONTOH_JUDUL: JudulKandidat[] = [
  {
    judul: "Pengaruh Interaktivitas Live Shopping terhadap Perilaku Pembelian Impulsif pada Mahasiswa Pengguna TikTok Shop di Kota Malang",
    variabel: "X: Interaktivitas Live Shopping • Y: Perilaku Pembelian Impulsif",
    sesuai: 94, kompleksitas: "Rendah",
    alasan: "Judul ini langsung menghubungkan variabel X dan Y yang kamu sebutkan, fokus pada objek yang spesifik (mahasiswa TikTok Shop), dan kompleksitasnya rendah sehingga sangat feasible untuk skripsi S1.",
    struktur: { x: ["Interaktivitas Live Shopping"], y: "Perilaku Pembelian Impulsif" },
  },
  {
    judul: "Pengaruh Interaktivitas Live Shopping dan Kredibilitas Streamer terhadap Perilaku Pembelian Impulsif pada Mahasiswa Pengguna TikTok Shop di Kota Malang",
    variabel: "X1: Interaktivitas Live Shopping • X2: Kredibilitas Streamer • Y: Perilaku Pembelian Impulsif",
    sesuai: 90, kompleksitas: "Sedang",
    alasan: "Menambahkan variabel kredibilitas streamer memperkaya kontribusi teoritis. Kompleksitas sedang karena membutuhkan dua instrumen variabel independen.",
    struktur: { x: ["Interaktivitas Live Shopping", "Kredibilitas Streamer"], y: "Perilaku Pembelian Impulsif" },
  },
  {
    judul: "Peran Kepercayaan sebagai Mediasi Pengaruh Interaktivitas Live Shopping terhadap Perilaku Pembelian Impulsif pada Mahasiswa TikTok Shop",
    variabel: "X: Interaktivitas Live Shopping • M: Kepercayaan • Y: Perilaku Pembelian Impulsif",
    sesuai: 88, kompleksitas: "Tinggi",
    alasan: "Model mediasi lebih kompleks dan membutuhkan uji path analysis (PLS-SEM), namun memberikan kontribusi teoritis yang lebih dalam dan unik.",
    struktur: { x: ["Interaktivitas Live Shopping"], y: "Perilaku Pembelian Impulsif", mediasi: "Kepercayaan" },
  },
  {
    judul: "Pengaruh Interaktivitas Live Shopping terhadap Perilaku Pembelian Impulsif dengan Fear of Missing Out sebagai Variabel Moderasi pada Mahasiswa Pengguna TikTok Shop",
    variabel: "X: Interaktivitas Live Shopping • Z: Fear of Missing Out • Y: Perilaku Pembelian Impulsif",
    sesuai: 84, kompleksitas: "Tinggi",
    alasan: "FOMO sebagai moderator relevan dan sedang trending dalam riset consumer behavior digital. Butuh MRA atau interaction term dalam SEM.",
    struktur: { x: ["Interaktivitas Live Shopping"], y: "Perilaku Pembelian Impulsif", moderasi: "Fear of Missing Out (FOMO)" },
  },
  {
    judul: "Analisis Faktor-Faktor Pendorong Perilaku Pembelian Impulsif dalam Interaktivitas Live Shopping pada Mahasiswa (Studi pada Pengguna TikTok Shop)",
    variabel: "Y: Perilaku Pembelian Impulsif • X: ditetapkan melalui kajian teori",
    sesuai: 80, kompleksitas: "Tinggi",
    alasan: "Pendekatan induktif yang cocok jika kamu ingin menemukan variabel melalui wawancara atau grounded theory. Cocok untuk penelitian kualitatif.",
    struktur: { x: ["Ditentukan via kajian teori"], y: "Perilaku Pembelian Impulsif" },
  },
];

function CariJudulPanel({ onBack }: { onBack: () => void }) {
  const [jenjang, setJenjang] = useState("S1");
  const [jurusan, setJurusan] = useState("");
  const [fokus, setFokus] = useState("");
  const [fenomena, setFenomena] = useState("");
  const [objek, setObjek] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [teori, setTeori] = useState("");
  const [metode, setMetode] = useState("Kuantitatif");
  const [akses, setAkses] = useState("Mudah dijangkau");
  const [kendala, setKendala] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [selected, setSelected] = useState<JudulKandidat | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailTab, setDetailTab] = useState<"ringkasan" | "kelayakan" | "struktur">("ringkasan");
  const [showOutline, setShowOutline] = useState(false);

  const filledCount = [jenjang, jurusan, fokus, fenomena, objek, lokasi, teori, metode, akses, kendala].filter(Boolean).length;
  const canSubmit = jurusan.trim() && fokus.trim() && fenomena.trim() && objek.trim();

  const loadContoh = () => {
    setJenjang("S1"); setJurusan("Manajemen"); setFokus("perilaku pembelian impulsif");
    setFenomena("interaktivitas live shopping"); setObjek("mahasiswa pengguna TikTok Shop");
    setLokasi("Kota Malang"); setTeori("Stimulus–Organism–Response");
    setMetode("Kuantitatif"); setAkses("Mudah dijangkau");
    setKendala("Waktu penelitian 4 bulan dan responden harus dapat dijangkau secara daring.");
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setHasResults(false);
    setSelected(null);
    setTimeout(() => {
      setAnalyzing(false);
      setHasResults(true);
      setSelected(CONTOH_JUDUL[0]);
    }, 2600);
  };

  const handleCopy = () => {
    if (!selected) return;
    navigator.clipboard.writeText(selected.judul).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const kompleksBadge = (k: JudulKompleksitas): React.CSSProperties => {
    if (k === "Rendah") return { background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" };
    if (k === "Sedang") return { background: "#fefce8", color: "#a16207", border: "1px solid #fef08a" };
    return { background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" };
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all";
  const inputSt: React.CSSProperties = { background: "#f8fafc", border: "1.5px solid #e2e8f0" };
  const onF = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#818cf8"; e.currentTarget.style.background = "#fff";
  };
  const onB = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc";
  };

  // ── Outline screen ──────────────────────────────────────────────────────────
  if (showOutline && selected) {
    const xVars = selected.struktur.x;
    const yVar = selected.struktur.y;
    const medVar = selected.struktur.mediasi;
    const modVar = selected.struktur.moderasi;
    const allXLabel = xVars.map(x => x.toLowerCase()).join(" dan ");

    const babs: { no: number; judul: string; subs: { title: string; items: string[] }[] }[] = [
      {
        no: 1, judul: "Pendahuluan",
        subs: [
          { title: "1.1 Latar Belakang Masalah", items: [
            `Perkembangan ${fenomena || xVars[0]} sebagai fenomena yang memengaruhi ${yVar.toLowerCase()}`,
            `Data dan fakta terkini tentang ${objek || "responden"} dan perilaku mereka`,
            `Research gap: keterbatasan studi sebelumnya yang dijawab penelitian ini`,
          ]},
          { title: "1.2 Rumusan Masalah", items: xVars.map((x, i) =>
            `Apakah ${x.toLowerCase()} berpengaruh terhadap ${yVar.toLowerCase()}${lokasi ? ` pada ${objek || "responden"} di ${lokasi}` : ""}?`
          ).concat(medVar ? [`Apakah ${medVar.toLowerCase()} memediasi pengaruh ${allXLabel} terhadap ${yVar.toLowerCase()}?`] : [])
           .concat(modVar ? [`Apakah ${modVar.toLowerCase()} memoderasi pengaruh ${allXLabel} terhadap ${yVar.toLowerCase()}?`] : []) },
          { title: "1.3 Tujuan Penelitian", items: xVars.map(x =>
            `Menganalisis pengaruh ${x.toLowerCase()} terhadap ${yVar.toLowerCase()}`
          ).concat(medVar ? [`Menganalisis peran mediasi ${medVar.toLowerCase()}`] : [])
           .concat(modVar ? [`Menganalisis peran moderasi ${modVar.toLowerCase()}`] : []) },
          { title: "1.4 Manfaat Penelitian", items: ["Manfaat teoritis: pengembangan teori yang relevan", "Manfaat praktis: rekomendasi bagi pelaku industri dan akademisi"] },
        ],
      },
      {
        no: 2, judul: "Tinjauan Pustaka",
        subs: [
          { title: "2.1 Landasan Teori", items: [
            ...(teori ? [`Teori ${teori} sebagai kerangka utama`] : ["Technology Acceptance Model (TAM) sebagai kerangka utama"]),
            ...xVars.map(x => `Definisi dan dimensi ${x.toLowerCase()}`),
            `Definisi dan dimensi ${yVar.toLowerCase()}`,
            ...(medVar ? [`Definisi dan peran ${medVar.toLowerCase()}`] : []),
            ...(modVar ? [`Definisi dan peran ${modVar.toLowerCase()}`] : []),
          ]},
          { title: "2.2 Kajian Empiris / Penelitian Terdahulu", items: [
            "Minimal 8–10 penelitian relevan (Scopus/Sinta, 2019–2024)",
            "Perbandingan variabel, metode, objek, dan temuan",
            "Identifikasi research gap yang dijawab penelitian ini",
          ]},
          { title: "2.3 Kerangka Konseptual", items: [
            `Hubungan antar variabel: ${xVars.join(", ")} → ${yVar}`,
            ...(medVar ? [`Jalur mediasi melalui ${medVar}`] : []),
            ...(modVar ? [`Efek moderasi ${modVar}`] : []),
          ]},
          { title: "2.4 Hipotesis Penelitian", items: [
            ...xVars.map((x, i) => `H${i + 1}: ${x} berpengaruh positif dan signifikan terhadap ${yVar}`),
            ...(medVar ? [`H${xVars.length + 1}: ${medVar} memediasi pengaruh ${xVars[0]} terhadap ${yVar}`] : []),
            ...(modVar ? [`H${xVars.length + 1}: ${modVar} memoderasi pengaruh ${xVars[0]} terhadap ${yVar}`] : []),
          ]},
        ],
      },
      {
        no: 3, judul: "Metode Penelitian",
        subs: [
          { title: "3.1 Jenis dan Pendekatan Penelitian", items: [`Penelitian ${metode || "kuantitatif"} dengan pendekatan survei`, `Tingkat eksplanasi: explanatory research`] },
          { title: "3.2 Populasi, Sampel, dan Teknik Sampling", items: [
            `Populasi: ${objek || "mahasiswa"}${lokasi ? ` di ${lokasi}` : ""}`,
            `Teknik: purposive sampling atau cluster sampling`,
            `Estimasi sampel: 100–250 responden (rule of thumb SEM/regresi)`,
          ]},
          { title: "3.3 Instrumen dan Pengukuran", items: [
            "Skala Likert 1–5 untuk semua variabel",
            ...xVars.map(x => `Kisi-kisi instrumen: ${x} (3–5 indikator)`),
            `Kisi-kisi instrumen: ${yVar} (3–5 indikator)`,
            "Uji validitas (CFA / AVE ≥ 0.5) dan reliabilitas (Cronbach α ≥ 0.7)",
          ]},
          { title: "3.4 Teknik Analisis Data", items: [
            metode === "Kualitatif" ? "Analisis tematik / grounded theory" :
            (medVar || modVar || xVars.length > 1) ? "SEM-PLS (SmartPLS 4) untuk uji path analysis" : "Analisis regresi linear berganda (SPSS/SmartPLS)",
            "Uji asumsi klasik (normalitas, heteroskedastisitas, multikolinearitas)",
            medVar ? "Uji mediasi dengan bootstrapping (Preacher & Hayes)" : "",
            modVar ? "Uji moderasi dengan Moderated Regression Analysis (MRA)" : "",
          ].filter(Boolean) },
        ],
      },
      {
        no: 4, judul: "Hasil dan Pembahasan",
        subs: [
          { title: "4.1 Deskripsi Responden", items: ["Profil demografis responden (usia, jenis kelamin, frekuensi penggunaan)", "Statistik deskriptif semua variabel penelitian"] },
          { title: "4.2 Uji Instrumen", items: ["Hasil uji validitas dan reliabilitas instrumen", "Confirmatory Factor Analysis (CFA)"] },
          { title: "4.3 Pengujian Hipotesis", items: xVars.map((x, i) => `Hasil uji H${i + 1}: pengaruh ${x} terhadap ${yVar}`).concat(
            medVar ? [`Hasil uji mediasi ${medVar}`] : [],
            modVar ? [`Hasil uji moderasi ${modVar}`] : [],
          ) },
          { title: "4.4 Pembahasan", items: [
            "Interpretasi hasil sesuai teori dan kajian empiris",
            "Perbandingan dengan penelitian terdahulu",
            "Implikasi manajerial dan akademis",
          ]},
        ],
      },
      {
        no: 5, judul: "Penutup",
        subs: [
          { title: "5.1 Kesimpulan", items: xVars.map((x, i) => `Kesimpulan H${i + 1}: ${x} terhadap ${yVar}`) },
          { title: "5.2 Keterbatasan Penelitian", items: ["Keterbatasan sampel dan generalisasi", "Keterbatasan metode pengumpulan data"] },
          { title: "5.3 Saran", items: ["Saran bagi penelitian selanjutnya", "Saran praktis bagi pelaku industri dan institusi terkait"] },
        ],
      },
    ];

    const babColors = ["#4f46e5","#0369a1","#059669","#d97706","#dc2626"];
    const babBgs = ["#eef2ff","#f0f9ff","#f0fdf4","#fffbeb","#fef2f2"];

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="shrink-0 flex items-center gap-3 px-4 md:px-6 py-3 border-b border-slate-100 bg-white">
          <button onClick={() => setShowOutline(false)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold leading-none mb-0.5">Cari Judul → Outline</p>
            <h2 className="font-display font-800 text-base text-slate-900 leading-tight truncate">{selected.judul}</h2>
          </div>
          <button onClick={handleCopy}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0"
            style={copied ? { background: "#f0fdf4", color: "#15803d", borderColor: "#bbf7d0" } : { background: "#f8fafc", color: "#475569", borderColor: "#e2e8f0" }}>
            {copied ? "✓ Tersalin" : "Salin judul"}
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5 md:py-6">
          <div className="max-w-2xl mx-auto space-y-4">

            {/* Hero summary */}
            <div className="rounded-2xl p-5 mb-2" style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)", boxShadow: "0 4px 20px rgba(79,70,229,0.3)" }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider mb-1.5">Outline Lengkap Skripsi {jenjang}</p>
                  <p className="font-display font-800 text-base text-white leading-snug">{selected.judul}</p>
                </div>
                <div className="shrink-0 text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-indigo-700 bg-white"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>{selected.sesuai}</div>
                  <p className="text-[9px] text-indigo-200 mt-0.5">/100</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {xVars.map((x, i) => <span key={i} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/15 text-white">X{xVars.length > 1 ? i + 1 : ""}: {x}</span>)}
                {medVar && <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/15 text-white">M: {medVar}</span>}
                {modVar && <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/15 text-white">Z: {modVar}</span>}
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/15 text-white">Y: {yVar}</span>
              </div>
            </div>

            {/* BAB list */}
            {babs.map((bab, bi) => (
              <div key={bab.no} className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                {/* BAB header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: babBgs[bi], color: babColors[bi] }}>
                    {bab.no}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: babColors[bi] }}>BAB {bab.no}</p>
                    <p className="font-display font-800 text-sm text-slate-900">{bab.judul}</p>
                  </div>
                </div>
                {/* Subbabs */}
                <div className="divide-y divide-slate-50">
                  {bab.subs.map((sub, si) => (
                    <div key={si} className="px-5 py-3.5">
                      <p className="text-xs font-bold text-slate-700 mb-2">{sub.title}</p>
                      <ul className="space-y-1.5">
                        {sub.items.map((item, ii) => (
                          <li key={ii} className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
                            <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: babColors[bi] }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Download / mentor CTA */}
            <div className="rounded-2xl p-4 flex items-center justify-between gap-4"
              style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", boxShadow: "0 4px 16px rgba(15,23,42,0.25)" }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-base shrink-0">💬</div>
                <div>
                  <p className="text-xs font-bold text-white mb-0.5">Butuh penilaian manusia?</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">Diskusikan outline ini bersama Mentor Class Program.</p>
                </div>
              </div>
              <button className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors whitespace-nowrap">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Konsultasi Mentor
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="shrink-0 flex items-center gap-3 px-4 md:px-6 py-3 border-b border-slate-100 bg-white">
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold leading-none mb-0.5">Alat Akademik</p>
          <h2 className="font-display font-800 text-base text-slate-900 leading-tight">Cari Judul Penelitian</h2>
        </div>
        <span className="hidden sm:block px-3 py-1 rounded-full text-xs font-bold border" style={{ background: "#eef2ff", color: "#4338ca", borderColor: "#c7d2fe" }}>AI Generator</span>
      </div>

      {/* Two-panel body */}
      <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row">

        {/* ── LEFT: Form ── */}
        <div className="lg:w-[420px] xl:w-[460px] shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-100 lg:overflow-y-auto">
          <div className="px-5 md:px-6 py-5 space-y-4">
            {/* Step header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                  style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)" }}>1</div>
                <div>
                  <p className="font-display font-800 text-base text-slate-900">Isi konteks penelitian</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    <span style={{ color: filledCount >= 8 ? "#16a34a" : "#6366f1", fontWeight: 600 }}>{filledCount}/10</span> informasi terisi · semakin spesifik, semakin relevan hasilnya.
                  </p>
                </div>
              </div>
              <button onClick={loadContoh} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 whitespace-nowrap transition-colors shrink-0">
                Gunakan contoh
              </button>
            </div>

            {/* Jenjang + Jurusan */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Jenjang</label>
                <div className="relative">
                  <select value={jenjang} onChange={e => setJenjang(e.target.value)}
                    className={inputCls + " appearance-none pr-7"} style={inputSt} onFocus={onF} onBlur={onB}>
                    {["D3","S1","S2","S3"].map(j => <option key={j}>{j}</option>)}
                  </select>
                  <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Jurusan <span className="text-red-400">Wajib</span></label>
                <input value={jurusan} onChange={e => setJurusan(e.target.value)} placeholder="Manajemen" className={inputCls} style={inputSt} onFocus={onF} onBlur={onB} />
              </div>
            </div>

            {/* Fokus */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-600">Fokus yang ingin diteliti <span className="text-red-400">Wajib</span></label>
              </div>
              <input value={fokus} onChange={e => setFokus(e.target.value)}
                placeholder="Contoh: perilaku pembelian impulsif"
                className={inputCls} style={inputSt} onFocus={onF} onBlur={onB} />
              <p className="text-[11px] text-slate-400 mt-1">Gunakan konsep atau hasil yang ingin dijelaskan, bukan kalimat judul lengkap.</p>
            </div>

            {/* Fenomena + Objek */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fenomena utama <span className="text-red-400">Wajib</span></label>
                <input value={fenomena} onChange={e => setFenomena(e.target.value)} placeholder="live shopping TikTok" className={inputCls} style={inputSt} onFocus={onF} onBlur={onB} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Objek / Responden <span className="text-red-400">Wajib</span></label>
                <input value={objek} onChange={e => setObjek(e.target.value)} placeholder="mahasiswa Gen Z" className={inputCls} style={inputSt} onFocus={onF} onBlur={onB} />
              </div>
            </div>

            {/* Lokasi + Teori */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Lokasi / konteks</label>
                <input value={lokasi} onChange={e => setLokasi(e.target.value)} placeholder="Kota Malang" className={inputCls} style={inputSt} onFocus={onF} onBlur={onB} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Teori yang dikuasai</label>
                <input value={teori} onChange={e => setTeori(e.target.value)} placeholder="TAM, S-O-R, SEM" className={inputCls} style={inputSt} onFocus={onF} onBlur={onB} />
              </div>
            </div>

            {/* Metode + Akses */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Metode pilihan</label>
                <div className="relative">
                  <select value={metode} onChange={e => setMetode(e.target.value)}
                    className={inputCls + " appearance-none pr-7"} style={inputSt} onFocus={onF} onBlur={onB}>
                    {["Kuantitatif","Kualitatif","Mixed Methods"].map(m => <option key={m}>{m}</option>)}
                  </select>
                  <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Akses terhadap data</label>
                <div className="relative">
                  <select value={akses} onChange={e => setAkses(e.target.value)}
                    className={inputCls + " appearance-none pr-7"} style={inputSt} onFocus={onF} onBlur={onB}>
                    {["Mudah dijangkau","Perlu izin khusus","Terbatas"].map(a => <option key={a}>{a}</option>)}
                  </select>
                  <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            {/* Kendala */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Batas waktu atau kendala</label>
              <textarea value={kendala} onChange={e => setKendala(e.target.value.slice(0, 500))}
                placeholder="Contoh: waktu penelitian 4 bulan, responden hanya bisa daring..."
                rows={3} className={inputCls + " resize-none"} style={inputSt} onFocus={onF} onBlur={onB} />
              <p className="text-[11px] text-slate-400 mt-1 text-right">{kendala.length}/500 karakter</p>
            </div>

            {/* Submit */}
            <button onClick={handleAnalyze} disabled={!canSubmit || analyzing}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1,#818cf8)", boxShadow: "0 4px 16px rgba(79,70,229,0.4)" }}>
              {analyzing
                ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Menganalisis...</>
                : <><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z"/></svg>Analisis &amp; Buat 5 Kandidat</>
              }
            </button>
            <button onClick={() => { setJurusan(""); setFokus(""); setFenomena(""); setObjek(""); setLokasi(""); setTeori(""); setKendala(""); }}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors py-1">
              Kosongkan formulir
            </button>
          </div>
        </div>

        {/* ── RIGHT: Results ── */}
        <div className="flex-1 min-w-0 lg:overflow-y-auto px-5 md:px-6 py-5">
          {/* Step header */}
          <div className="flex items-start gap-3 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
              style={{ background: hasResults ? "linear-gradient(135deg,#4f46e5,#6366f1)" : "#f1f5f9", color: hasResults ? "#fff" : "#94a3b8" }}>2</div>
            <div>
              <p className="font-display font-800 text-base text-slate-900">Kandidat yang direkomendasikan</p>
              <p className="text-xs text-slate-400 mt-0.5">Pilih satu judul untuk melihat alasan, kelayakan, dan struktur awal.</p>
            </div>
          </div>

          {/* Empty state */}
          {!hasResults && !analyzing && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-4"
                style={{ background: "linear-gradient(135deg,#eef2ff,#e0e7ff)" }}>💡</div>
              <p className="font-display font-700 text-lg text-slate-700 mb-2">Belum ada kandidat judul</p>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">Isi formulir di sebelah kiri dengan informasi penelitianmu, lalu klik <strong>"Analisis & Buat 5 Kandidat"</strong>.</p>
              <div className="mt-6 grid grid-cols-2 gap-2 text-left max-w-xs">
                {["Jenjang & jurusan", "Fokus penelitian", "Fenomena utama", "Objek responden"].map(tip => (
                  <div key={tip} className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analyzing */}
          {analyzing && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-4 animate-pulse"
                style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)", boxShadow: "0 8px 30px rgba(79,70,229,0.4)" }}>✨</div>
              <p className="font-display font-800 text-lg text-slate-900 mb-2">Menganalisis konteks penelitianmu...</p>
              <p className="text-sm text-slate-500 mb-6">Menyesuaikan dengan jurusan, metode, dan kendala</p>
              <div className="flex gap-1.5">
                {[0, 0.15, 0.3].map(d => (
                  <div key={d} className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: `${d}s` }} />
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {hasResults && !analyzing && (
            <>
              {/* Count bar */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-4" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div>
                  <p className="text-sm font-bold text-slate-800">5 kandidat ditemukan</p>
                  <p className="text-xs text-slate-400">Diurutkan berdasarkan kejelasan fokus dan kelayakan awal</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  Konteks terbaca
                </span>
              </div>

              {/* Candidate list */}
              <div className="space-y-2.5 mb-5">
                {CONTOH_JUDUL.map((k, i) => (
                  <button key={i} onClick={() => { setSelected(k); setShowDetail(true); setDetailTab("ringkasan"); }}
                    className="w-full text-left p-4 rounded-2xl border-2 transition-all"
                    style={selected === k
                      ? { borderColor: "#6366f1", background: "#fafbff", boxShadow: "0 0 0 3px rgba(99,102,241,0.1)" }
                      : { borderColor: "#f1f5f9", background: "#fff" }}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                          style={{ background: selected === k ? "#6366f1" : "#f1f5f9", color: selected === k ? "#fff" : "#94a3b8" }}>{i + 1}</span>
                        <p className="text-sm font-bold text-slate-800 leading-snug">{k.judul}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs font-bold text-indigo-600">{k.sesuai}% sesuai</p>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={kompleksBadge(k.kompleksitas)}>
                          Kompleksitas {k.kompleksitas}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 ml-7">{k.variabel}</p>
                  </button>
                ))}
              </div>

              {/* Selected detail */}
              {selected && showDetail && (
                <div className="rounded-2xl border border-indigo-100 overflow-hidden bg-white" style={{ boxShadow: "0 2px 12px rgba(99,102,241,0.08)" }}>
                  {/* Header: pilihan label + judul + score ring */}
                  <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Pilihan {CONTOH_JUDUL.indexOf(selected) + 1}</span>
                      <p className="font-display font-800 text-base text-slate-900 leading-snug mt-1">{selected.judul}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-center gap-0.5">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{ background: `conic-gradient(#22c55e ${selected.sesuai * 3.6}deg, #e2e8f0 0deg)`, boxShadow: "inset 0 0 0 5px white" }}>
                        <span className="text-sm font-bold text-slate-800">{selected.sesuai}</span>
                      </div>
                      <p className="text-[9px] text-slate-400">/100</p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2 flex-wrap">
                    <button onClick={handleCopy}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all"
                      style={copied ? { background: "#f0fdf4", color: "#15803d", borderColor: "#bbf7d0" } : { background: "#f8fafc", color: "#475569", borderColor: "#e2e8f0" }}>
                      {copied
                        ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>Tersalin!</>
                        : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Salin judul</>
                      }
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                      style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)", boxShadow: "0 3px 10px rgba(79,70,229,0.3)" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                      Simpan ke Proyek
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="px-5 pt-3 pb-0 flex gap-0 border-b border-slate-100">
                    {(["ringkasan", "kelayakan", "struktur"] as const).map(t => (
                      <button key={t} onClick={() => setDetailTab(t)}
                        className="pb-2.5 mr-6 text-xs font-semibold transition-colors relative whitespace-nowrap capitalize"
                        style={{ color: detailTab === t ? "#1e293b" : "#94a3b8" }}>
                        {t === "ringkasan" ? "Ringkasan" : t === "kelayakan" ? "Kelayakan" : "Struktur awal"}
                        {detailTab === t && <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-indigo-600" />}
                      </button>
                    ))}
                  </div>

                  {/* Tab: Ringkasan */}
                  {detailTab === "ringkasan" && (
                    <div className="px-5 py-4 space-y-3">
                      <div className="p-4 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mengapa judul ini cocok?</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{selected.alasan}</p>
                      </div>
                      <div className="p-4 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Variabel penelitian</p>
                        <div className="flex flex-wrap gap-2">
                          {selected.struktur.x.map((x, i) => (
                            <span key={i} className="px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}>
                              X{selected.struktur.x.length > 1 ? (i + 1) : ""}: {x}
                            </span>
                          ))}
                          {selected.struktur.mediasi && <span className="px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a" }}>M: {selected.struktur.mediasi}</span>}
                          {selected.struktur.moderasi && <span className="px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: "#fdf4ff", color: "#7e22ce", border: "1px solid #e9d5ff" }}>Z: {selected.struktur.moderasi}</span>}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="self-center"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          <span className="px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}>Y: {selected.struktur.y}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab: Kelayakan */}
                  {detailTab === "kelayakan" && (
                    <div className="px-5 py-4 space-y-3">
                      {[
                        { label: "Ketersediaan data", val: selected.kompleksitas === "Rendah" ? "Mudah — survei online ke mahasiswa" : selected.kompleksitas === "Sedang" ? "Cukup mudah — butuh 2 instrumen" : "Perlu perencanaan lebih matang", ok: selected.kompleksitas !== "Tinggi" },
                        { label: "Kesesuaian metode", val: `${selected.struktur.x.length > 1 || selected.struktur.mediasi || selected.struktur.moderasi ? "SEM-PLS / PLS-SEM" : "Regresi linear / SEM"} — sesuai untuk ${selected.kompleksitas === "Rendah" ? "skripsi S1" : "penelitian yang lebih mendalam"}`, ok: true },
                        { label: "Referensi tersedia", val: "Lebih dari 20 jurnal Scopus tersedia untuk topik ini (2020–2025)", ok: true },
                        { label: "Waktu pengerjaan", val: selected.kompleksitas === "Rendah" ? "Estimasi 3–4 bulan — sangat feasible" : selected.kompleksitas === "Sedang" ? "Estimasi 4–5 bulan — masih feasible" : "Estimasi 5–6 bulan — butuh manajemen waktu ketat", ok: selected.kompleksitas === "Rendah" },
                      ].map(row => (
                        <div key={row.label} className="flex items-start gap-3 p-3.5 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${row.ok ? "bg-emerald-100" : "bg-amber-100"}`}>
                            {row.ok
                              ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                              : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3"><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-700 mb-0.5">{row.label}</p>
                            <p className="text-xs text-slate-500 leading-relaxed">{row.val}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: selected.sesuai >= 90 ? "#f0fdf4" : "#fefce8", border: `1px solid ${selected.sesuai >= 90 ? "#bbf7d0" : "#fef08a"}` }}>
                        <p className="text-xs font-bold" style={{ color: selected.sesuai >= 90 ? "#15803d" : "#a16207" }}>
                          {selected.sesuai >= 90 ? "✅ Judul ini sangat direkomendasikan untuk jenjangmu" : "⚠️ Judul ini bisa digunakan dengan perencanaan lebih matang"}
                        </p>
                        <span className="text-sm font-bold ml-3" style={{ color: selected.sesuai >= 90 ? "#16a34a" : "#d97706" }}>{selected.sesuai}%</span>
                      </div>
                    </div>
                  )}

                  {/* Tab: Struktur awal */}
                  {detailTab === "struktur" && (
                    <div className="px-5 py-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                          <p className="text-xs font-bold text-slate-700 mb-2">Rumusan masalah awal</p>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Apakah {selected.struktur.x.map(x => x.toLowerCase()).join(" dan ")} berpengaruh terhadap {selected.struktur.y.toLowerCase()} pada {selected.variabel.includes("mahasiswa") ? "mahasiswa pengguna TikTok Shop" : "responden penelitian"}?
                          </p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                          <p className="text-xs font-bold text-slate-700 mb-2">Tujuan penelitian awal</p>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Menganalisis pengaruh {selected.struktur.x.map(x => x.toLowerCase()).join(" dan ")} terhadap {selected.struktur.y.toLowerCase()}.
                          </p>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                        <p className="text-xs font-bold text-slate-700 mb-2">Hipotesis awal</p>
                        {selected.struktur.x.map((x, i) => (
                          <p key={i} className="text-xs text-slate-600 leading-relaxed mb-1">
                            H{i + 1}: {x.toLowerCase()} berpengaruh positif dan signifikan terhadap {selected.struktur.y.toLowerCase()}.
                          </p>
                        ))}
                        {selected.struktur.mediasi && (
                          <p className="text-xs text-slate-600 leading-relaxed mb-1">
                            H{selected.struktur.x.length + 1}: {selected.struktur.mediasi.toLowerCase()} memediasi pengaruh {selected.struktur.x[0].toLowerCase()} terhadap {selected.struktur.y.toLowerCase()}.
                          </p>
                        )}
                        {selected.struktur.moderasi && (
                          <p className="text-xs text-slate-600 leading-relaxed">
                            H{selected.struktur.x.length + 1}: {selected.struktur.moderasi.toLowerCase()} memoderasi pengaruh {selected.struktur.x[0].toLowerCase()} terhadap {selected.struktur.y.toLowerCase()}.
                          </p>
                        )}
                      </div>

                      {/* Lihat Outline Lengkap */}
                      <button onClick={() => setShowOutline(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 transition-all hover:bg-indigo-50 active:scale-[0.98]"
                        style={{ borderColor: "#6366f1", color: "#4f46e5" }}>
                        Lihat Outline Lengkap
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </button>

                      {/* Belum pas */}
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                          <div>
                            <p className="text-xs font-bold text-slate-700">Belum pas?</p>
                            <p className="text-[11px] text-slate-400">Ubah konteks di formulir, lalu buat ulang kandidat.</p>
                          </div>
                        </div>
                        <button onClick={() => { setHasResults(false); setShowDetail(false); setSelected(null); }}
                          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors shrink-0">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>
                          Buat ulang
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Bottom: Butuh penilaian manusia */}
                  <div className="mx-5 mb-5 mt-1 rounded-2xl p-4 flex items-center justify-between gap-4"
                    style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", boxShadow: "0 4px 16px rgba(15,23,42,0.25)" }}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-base">💬</div>
                      <div>
                        <p className="text-xs font-bold text-white mb-0.5">Butuh penilaian manusia?</p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">Siapkan ringkasan judul, konteks, dan kelayakan untuk direview Mentor Class Program.</p>
                      </div>
                    </div>
                    <button className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors whitespace-nowrap">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                      Konsultasi Mentor
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Cari Jurnal Panel ────────────────────────────────────────────────────────
const JURNAL_DEMO: { judul: string; penulis: string; tahun: number; indeks: string; sinta?: string; doi: string; abstrak: string; relevansi: number; tipe: string }[] = [
  { judul: "Live Streaming Commerce and Mimic Purchase Intention: The Role of Parasocial Interaction and Scarcity Nudges", penulis: "Wongkitrungrueng, A. & Assarut, N.", tahun: 2023, indeks: "Scopus Q1", doi: "10.1016/j.jretconser.2023.103612", abstrak: "Penelitian ini mengeksplorasi peran interaksi parasosial dan kelangkaan buatan dalam meningkatkan niat beli konsumen pada platform live streaming commerce di Asia Tenggara.", relevansi: 97, tipe: "Artikel" },
  { judul: "The Influence of Streamer Credibility on Purchase Intention in TikTok Live Shopping", penulis: "Sun, Y., Shao, X., Li, X., Guo, Y. & Nie, K.", tahun: 2023, indeks: "Scopus Q2", doi: "10.1108/INTR-06-2022-0432", abstrak: "Studi kuantitatif tentang bagaimana kredibilitas streamer (kepercayaan, keahlian, daya tarik) mempengaruhi niat pembelian pengguna muda pada platform live commerce.", relevansi: 94, tipe: "Artikel" },
  { judul: "Pengaruh Interaktivitas Live Commerce terhadap Impulse Buying dan Purchase Intention", penulis: "Pratama, R. A. & Susanti, D.", tahun: 2023, indeks: "Sinta 2", sinta: "S2", doi: "10.21831/economia.v19i1.54321", abstrak: "Penelitian survei pada 250 mahasiswa pengguna TikTok Shop di Indonesia, mengukur pengaruh fitur interaktif live commerce terhadap pembelian impulsif.", relevansi: 91, tipe: "Artikel" },
  { judul: "Trust Mechanisms in Social Commerce: A Meta-Analysis of Purchase Intention Antecedents", penulis: "Chen, J., Zhang, C. & Xu, Y.", tahun: 2022, indeks: "Scopus Q1", doi: "10.1016/j.elerap.2022.101256", abstrak: "Meta-analisis atas 68 studi empiris tentang mekanisme kepercayaan dalam social commerce, mencakup live streaming sebagai salah satu konteks utama.", relevansi: 88, tipe: "Review" },
  { judul: "Faktor-Faktor yang Mempengaruhi Keputusan Pembelian pada Platform Live Streaming", penulis: "Hidayat, M. R. & Kurniawan, B.", tahun: 2022, indeks: "Sinta 3", sinta: "S3", doi: "10.24252/minds.v9i2.29871", abstrak: "Analisis regresi berganda pada konsumen Shopee Live di Indonesia, mengidentifikasi faktor hiburan, kepercayaan, dan ulasan sebagai prediktor utama.", relevansi: 85, tipe: "Artikel" },
  { judul: "Information Quality and Consumer Behavior in Live Commerce: Evidence from China", penulis: "Liu, X. & Zhang, W.", tahun: 2022, indeks: "Scopus Q2", doi: "10.1108/EJM-03-2021-0218", abstrak: "Menggunakan Technology Acceptance Model (TAM) untuk menganalisis pengaruh kualitas informasi pada live commerce terhadap perilaku konsumen digital.", relevansi: 82, tipe: "Artikel" },
];

type JurnalScreen = "search" | "results" | "detail";

function CariJurnalPanel({ onBack }: { onBack: () => void }) {
  const [screen, setScreen] = useState<JurnalScreen>("search");
  const [topik, setTopik] = useState("");
  const [tahun, setTahun] = useState("2020–2026");
  const [indeks, setIndeks] = useState("Semua");
  const [tujuan, setTujuan] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(JURNAL_DEMO);
  const [selected, setSelected] = useState<typeof JURNAL_DEMO[0] | null>(null);
  const [saved, setSaved] = useState<number[]>([]);

  const INDEKS_OPTS = ["Semua", "Scopus Q1", "Scopus Q2", "Sinta 1", "Sinta 2", "Sinta 3", "Google Scholar"];

  const handleSearch = () => {
    if (!topik.trim()) return;
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setResults(JURNAL_DEMO.filter(j => indeks === "Semua" || j.indeks.includes(indeks.replace(" ", "").slice(0, 7))));
      setScreen("results");
    }, 2200);
  };

  const toggleSave = (idx: number) => setSaved(s => s.includes(idx) ? s.filter(i => i !== idx) : [...s, idx]);

  const indeksBadgeStyle = (ind: string): React.CSSProperties => {
    if (ind.includes("Q1")) return { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" };
    if (ind.includes("Q2")) return { background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" };
    if (ind.includes("S2") || ind.includes("Sinta 2")) return { background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" };
    if (ind.includes("S3") || ind.includes("Sinta 3")) return { background: "#fefce8", color: "#a16207", border: "1px solid #fef08a" };
    return { background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0" };
  };

  // ── Search screen ──────────────────────────────────────────────────────────
  if (screen === "search") return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h2 className="font-display font-800 text-xl text-slate-900 leading-tight">Cari Jurnal</h2>
            <p className="text-xs text-slate-400">Scopus · Sinta · Google Scholar</p>
          </div>
        </div>

        <div className="max-w-2xl">
          {/* Hero */}
          <div className="rounded-2xl p-6 mb-6 overflow-hidden relative" style={{ background: "linear-gradient(135deg,#0c4a6e 0%,#0369a1 55%,#0284c7 100%)" }}>
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle,#fff,transparent)", transform: "translate(30%,-30%)" }} />
            <p className="text-[10px] font-bold text-sky-300 uppercase tracking-wider mb-2">Pencarian Cerdas</p>
            <p className="font-display font-800 text-xl text-white mb-1">Temukan Referensi Akademik</p>
            <p className="text-sm text-sky-100 leading-relaxed">Masukkan topik penelitianmu — Alerin akan merekomendasikan jurnal terindeks berdasarkan relevansi, tahun, dan indeks yang kamu pilih.</p>
          </div>

          <div className="space-y-4">
            {/* Topik */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Topik atau kata kunci <span className="text-red-400">*</span></label>
              <input
                value={topik} onChange={e => setTopik(e.target.value)}
                placeholder="Contoh: purchase intention live streaming TikTok"
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
                style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}
                onFocus={e => { e.currentTarget.style.borderColor = "#38bdf8"; e.currentTarget.style.background = "#fff"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
            </div>

            {/* Tahun + Indeks */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Rentang tahun</label>
                <input
                  value={tahun} onChange={e => setTahun(e.target.value)}
                  placeholder="2020–2026"
                  className="w-full px-4 py-3 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
                  style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#38bdf8"; e.currentTarget.style.background = "#fff"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Indeks sumber</label>
                <div className="relative">
                  <select value={indeks} onChange={e => setIndeks(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm text-slate-800 outline-none appearance-none transition-all pr-8"
                    style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}>
                    {INDEKS_OPTS.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            {/* Tujuan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tujuan penggunaan</label>
              <textarea
                value={tujuan} onChange={e => setTujuan(e.target.value)}
                placeholder="Contoh: landasan teori BAB II, research gap, tinjauan pustaka..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none resize-none transition-all"
                style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}
                onFocus={e => { e.currentTarget.style.borderColor = "#38bdf8"; e.currentTarget.style.background = "#fff"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
              />
            </div>

            {/* Tips chips */}
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Topik populer</p>
              <div className="flex flex-wrap gap-2">
                {["Purchase intention", "Live shopping", "TAM Model", "SEM-PLS", "Kualitatif fenomenologi", "Research gap"].map(t => (
                  <button key={t} onClick={() => setTopik(t)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 border border-slate-200 bg-white hover:border-sky-300 hover:text-sky-700 hover:bg-sky-50 transition-all">
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSearch} disabled={!topik.trim()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg,#0369a1,#0ea5e9)", boxShadow: "0 4px 14px rgba(3,105,161,0.35)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              Cari Jurnal Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Searching screen ───────────────────────────────────────────────────────
  if (searching) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
        style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)", boxShadow: "0 8px 30px rgba(3,105,161,0.4)" }}>
        🔍
      </div>
      <div className="text-center">
        <p className="font-display font-800 text-xl text-slate-900 mb-2">Menelusuri database jurnal...</p>
        <p className="text-slate-500 text-sm">Scopus · Sinta · Google Scholar · Semantic Scholar</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 0.15, 0.3].map(d => (
          <div key={d} className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: `${d}s` }} />
        ))}
      </div>
      <div className="w-full max-w-xs space-y-2">
        {["Scopus Q1 & Q2", "Sinta 1 & 2", "Memeringkat relevansi"].map((s, i) => (
          <div key={s} className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
            {s}
          </div>
        ))}
      </div>
    </div>
  );

  // ── Results screen ─────────────────────────────────────────────────────────
  if (screen === "results") return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setScreen("search")} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-800 text-lg text-slate-900 leading-tight truncate">"{topik}"</h2>
            <p className="text-xs text-slate-400">{results.length} jurnal ditemukan · {tahun} · {indeks}</p>
          </div>
          <button onClick={() => setScreen("search")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 transition-colors shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            Ubah pencarian
          </button>
        </div>

        {/* Summary bar */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5 overflow-x-auto" style={{ background: "#f0f9ff", border: "1px solid #bae6fd" }}>
          {[
            { label: "Total", val: results.length.toString(), icon: "📚" },
            { label: "Scopus", val: results.filter(j => j.indeks.includes("Scopus")).length.toString(), icon: "🌐" },
            { label: "Sinta", val: results.filter(j => j.indeks.includes("Sinta")).length.toString(), icon: "🇮🇩" },
            { label: "Tersimpan", val: saved.length.toString(), icon: "🔖" },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 shrink-0">
              <span>{s.icon}</span>
              <div>
                <p className="text-sm font-bold text-sky-900">{s.val}</p>
                <p className="text-[10px] text-sky-600">{s.label}</p>
              </div>
              <div className="w-px h-6 bg-sky-200 last:hidden ml-3" />
            </div>
          ))}
        </div>

        {/* Keyword tips */}
        {tujuan && (
          <div className="px-4 py-3 rounded-xl mb-5" style={{ background: "#fefce8", border: "1px solid #fef08a" }}>
            <p className="text-xs font-semibold text-amber-700 mb-1">💡 Tips berdasarkan tujuanmu: "{tujuan}"</p>
            <p className="text-xs text-amber-600">Gunakan jurnal dengan relevansi ≥90% untuk landasan teori. Jurnal dengan relevansi 80–89% cocok sebagai perbandingan atau research gap.</p>
          </div>
        )}

        {/* Result cards */}
        <div className="space-y-3">
          {results.map((j, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all hover:border-sky-200 hover:shadow-sm" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={indeksBadgeStyle(j.indeks)}>{j.indeks}</span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "#f1f5f9", color: "#64748b" }}>{j.tipe}</span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "#f1f5f9", color: "#64748b" }}>{j.tahun}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 leading-snug mb-1">{j.judul}</p>
                    <p className="text-xs text-slate-500 mb-3">{j.penulis}</p>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{j.abstrak}</p>
                  </div>
                  {/* Relevance ring */}
                  <div className="shrink-0 flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: `conic-gradient(#0ea5e9 ${j.relevansi * 3.6}deg, #e2e8f0 0deg)`, boxShadow: "inset 0 0 0 4px white" }}>
                      <span className="text-[11px] font-bold text-slate-700">{j.relevansi}%</span>
                    </div>
                    <p className="text-[9px] text-slate-400 text-center">Relevansi</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
                  <button onClick={() => { setSelected(j); setScreen("detail"); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Detail
                  </button>
                  <button onClick={() => toggleSave(idx)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                    style={saved.includes(idx)
                      ? { background: "#fef3c7", color: "#b45309" }
                      : { background: "#f8fafc", color: "#64748b" }}>
                    {saved.includes(idx) ? "🔖 Tersimpan" : "🔖 Simpan"}
                  </button>
                  <a href={`https://doi.org/${j.doi}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    DOI
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How to access */}
        <div className="mt-5 p-4 rounded-2xl" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <p className="text-xs font-semibold text-slate-700 mb-2">📌 Cara mengakses jurnal gratis</p>
          <ul className="text-xs text-slate-500 space-y-1">
            <li>• <strong>Sci-Hub</strong> — akses hampir semua jurnal berpaywalled via DOI</li>
            <li>• <strong>Unpaywall</strong> — ekstensi browser untuk versi open access legal</li>
            <li>• <strong>Sinta.kemdikbud.go.id</strong> — direktori jurnal nasional terindeks</li>
            <li>• <strong>Perpustakaan kampus</strong> — akses Scopus/ProQuest via VPN institusi</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // ── Detail screen ──────────────────────────────────────────────────────────
  if (screen === "detail" && selected) return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setScreen("results")} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h2 className="font-display font-800 text-lg text-slate-900 leading-tight">Detail Jurnal</h2>
            <p className="text-xs text-slate-400">{selected.indeks} · {selected.tahun}</p>
          </div>
        </div>

        <div className="max-w-2xl space-y-4">
          {/* Title card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={indeksBadgeStyle(selected.indeks)}>{selected.indeks}</span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "#f1f5f9", color: "#64748b" }}>{selected.tipe} · {selected.tahun}</span>
            </div>
            <h3 className="font-display font-800 text-base text-slate-900 leading-snug mb-2">{selected.judul}</h3>
            <p className="text-sm text-slate-500 mb-1">{selected.penulis}</p>
            <p className="text-xs text-slate-400">DOI: {selected.doi}</p>
          </div>

          {/* Abstrak */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Abstrak</p>
            <p className="text-sm text-slate-700 leading-relaxed">{selected.abstrak}</p>
          </div>

          {/* Relevansi & cara sitasi */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <p className="text-2xl font-bold text-sky-600 mb-0.5">{selected.relevansi}%</p>
              <p className="text-xs text-slate-500">Relevansi topik</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-4" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cocok untuk</p>
              <p className="text-xs text-slate-700 leading-relaxed">{selected.relevansi >= 90 ? "Landasan teori utama & tinjauan pustaka" : "Pembanding & research gap"}</p>
            </div>
          </div>

          {/* Contoh sitasi APA */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contoh sitasi APA 7</p>
            <p className="text-sm text-slate-700 leading-relaxed font-mono bg-slate-50 p-3 rounded-xl">
              {selected.penulis} ({selected.tahun}). {selected.judul}. <em>Jurnal Akademik</em>. https://doi.org/{selected.doi}
            </p>
          </div>

          <a href={`https://doi.org/${selected.doi}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#0369a1,#0ea5e9)", boxShadow: "0 4px 14px rgba(3,105,161,0.35)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Buka Jurnal (DOI)
          </a>
        </div>
      </div>
    </div>
  );

  return null;
}

function PlagiasPanel({ onBack }: { onBack: () => void }) {
  const [screen, setScreen] = useState<PlagScreen>("upload");
  const [fileName, setFileName] = useState("Skripsi_Final_Bab_1-5.docx");
  const [selectedSection, setSelectedSection] = useState<PlagSection|null>(null);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {screen==="upload" && <PlagUploadScreen onBack={onBack} onAnalyze={(file) => { setFileName(file.name); setScreen("analyzing"); setTimeout(()=>setScreen("result"),3000); }}/>}
      {screen==="analyzing" && <PlagAnalyzingScreen/>}
      {screen==="result" && <PlagResultScreen fileName={fileName} onDetail={(s)=>{setSelectedSection(s);setScreen("detail");}} onHistory={()=>setScreen("history")} onBack={()=>setScreen("upload")}/>}
      {screen==="detail" && selectedSection && <PlagDetailScreen section={selectedSection} onParaphrase={()=>setScreen("paraphrase")} onBack={()=>setScreen("result")}/>}
      {screen==="paraphrase" && selectedSection && <PlagParaphraseScreen section={selectedSection} onReview={()=>setScreen("review")} onBack={()=>setScreen("detail")}/>}
      {screen==="review" && <PlagReviewScreen onFinish={()=>setScreen("success")} onBack={()=>setScreen("paraphrase")}/>}
      {screen==="success" && <PlagSuccessScreen onRecheck={()=>setScreen("upload")} onResult={()=>setScreen("result")}/>}
      {screen==="history" && <PlagHistoryScreen onBack={()=>setScreen("result")}/>}
    </div>
  );
}

function FiturTab({ onChat, openFeatureKey, onFeatureOpened }: { onChat: (prompt?: string) => void; openFeatureKey?: FeatureKey; onFeatureOpened?: () => void }) {
  const [showParafrase, setShowParafrase] = useState(openFeatureKey === "parafrase");
  const [showGrammar, setShowGrammar] = useState(openFeatureKey === "grammar");
  const [showPlagiasi, setShowPlagiasi] = useState(openFeatureKey === "plagiasi");
  const [showJurnal, setShowJurnal] = useState(openFeatureKey === "jurnal");
  const [showCariJudul, setShowCariJudul] = useState(openFeatureKey === "judul");
  const [shortcutModal, setShortcutModal] = useState<ShortcutType | null>(openFeatureKey === "matakuliah" ? "mata-kuliah" : null);

  useEffect(() => {
    if (!openFeatureKey) return;
    setShowParafrase(openFeatureKey === "parafrase");
    setShowGrammar(openFeatureKey === "grammar");
    setShowPlagiasi(openFeatureKey === "plagiasi");
    setShowJurnal(openFeatureKey === "jurnal");
    setShowCariJudul(openFeatureKey === "judul");
    if (openFeatureKey === "matakuliah") setShortcutModal("mata-kuliah");
    onFeatureOpened?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openFeatureKey]);

  if (showParafrase) return <ParafraseFigmaPanel onBack={() => setShowParafrase(false)} />;
  if (showGrammar) return <GrammarPanel onBack={() => setShowGrammar(false)} />;
  if (showPlagiasi) return <PlagiasPanel onBack={() => setShowPlagiasi(false)} />;
  if (showJurnal) return <CariJurnalFigmaPanel onBack={() => setShowJurnal(false)} />;
  if (showCariJudul) return <CariJudulPanel onBack={() => setShowCariJudul(false)} />;

  return (
    <>
      <FiturLandingFigma
        onChat={() => onChat()}
        onJurnal={() => setShowJurnal(true)}
        onSkripsi={() => setShortcutModal("skripsi")}
        onParafrase={() => setShowParafrase(true)}
        onMataKuliah={() => setShortcutModal("mata-kuliah")}
        onTugas={() => setShortcutModal("tugas")}
        onPemeriksaan={() => setShowGrammar(true)}
      />
      {shortcutModal && (
        <ShortcutModal
          type={shortcutModal}
          onClose={() => setShortcutModal(null)}
          onSubmit={text => {
            setShortcutModal(null);
            onChat(text);
          }}
        />
      )}
    </>
  );
}

// ─── TAB: Proyek Saya ─────────────────────────────────────────────────────────
function ProyekTab({ onTab, onOpenHistory }: { onTab: (t: NavTab) => void; onOpenHistory: (msgs: ChatMsg[]) => void }) {
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {newProjectOpen && <NewProjectModal onClose={() => setNewProjectOpen(false)} onToast={m => setToast(m)} />}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-display font-800 text-2xl text-slate-900 mb-1">Proyek Saya</h2>
            <p className="text-slate-500 text-sm">Simpan percakapan penting dan lanjutkan tanpa mengulang konteks.</p>
          </div>
          <button onClick={() => setNewProjectOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Proyek baru
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROJECTS.map((p) => (
            <button key={p.title} onClick={() => { onOpenHistory(p.msgs); onTab("percakapan"); }}
              className="rounded-2xl bg-white border border-slate-100 p-5 hover:border-blue-200 hover:shadow-md transition-all text-left group" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-lg">
                  {p.emoji}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">{p.status}</span>
              </div>
              <h3 className="font-display font-700 text-base text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{p.title}</h3>
              <p className="text-xs text-slate-400 mb-4">{p.updated}</p>
              {/* Preview last message */}
              {p.msgs.length > 0 && (
                <p className="text-[11px] text-slate-500 truncate mb-3 italic">"{p.msgs[p.msgs.length - 1].text.slice(0, 60)}…"</p>
              )}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                Lanjutkan percakapan <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TAB: Progress ────────────────────────────────────────────────────────────
// ─── Calendar data ────────────────────────────────────────────────────────────
const CAL_EVENTS: Record<string, { label: string; time: string; color: string }[]> = {
  "2026-09-01": [{ label: "Presentasi Riset Pasar", time: "09.00", color: "#ef4444" }],
  "2026-08-31": [{ label: "Revisi Kerangka BAB I", time: "23.59", color: "#f59e0b" }],
  "2026-09-03": [{ label: "QUIZLAB Semester 6", time: "20.00", color: "#3b82f6" }],
  "2026-09-10": [{ label: "Konsultasi Dosen Pembimbing", time: "13.00", color: "#8b5cf6" }],
  "2026-09-15": [{ label: "Pengumpulan Draft BAB III", time: "17.00", color: "#059669" }],
  "2026-09-20": [{ label: "Simulasi Sidang Internal", time: "10.00", color: "#d97706" }],
};

function CalendarModal({ onClose, onToast }: { onClose: () => void; onToast: (m: string) => void }) {
  const today = new Date(2026, 7, 31); // Aug 31 2026
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthNames = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const dayNames = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const toKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const isToday = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  const isSelected = (d: number) => selected?.getDate() === d && selected?.getMonth() === month && selected?.getFullYear() === year;
  const cellKey = (d: number) => toKey(new Date(year, month, d));
  const selectedKey = selected ? toKey(selected) : null;
  const selectedEvents = selectedKey ? (CAL_EVENTS[selectedKey] ?? []) : [];

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center overflow-y-auto py-8 px-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="w-full max-w-xl mx-auto"
        onClick={e => e.stopPropagation()}>

        {/* Calendar card */}
        <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.18)" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <p className="font-display font-800 text-base text-slate-900">{monthNames[month]} {year}</p>
                <p className="text-[11px] text-slate-400">Kalender Akademik Alerin</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setCursor(new Date(year, month - 1, 1))}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
                className="px-3 py-1 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors">
                Hari ini
              </button>
              <button onClick={() => setCursor(new Date(year, month + 1, 1))}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              <button onClick={onClose} className="ml-2 w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 px-4 pt-3 pb-1">
            {dayNames.map(d => (
              <div key={d} className="text-center text-[11px] font-bold text-slate-400 py-1">{d}</div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 px-4 pb-4 gap-y-1">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const key = cellKey(d);
              const events = CAL_EVENTS[key] ?? [];
              const hasEvents = events.length > 0;
              const todayCell = isToday(d);
              const sel = isSelected(d);
              return (
                <button key={i} onClick={() => setSelected(sel ? null : new Date(year, month, d))}
                  className="flex flex-col items-center py-1.5 px-1 rounded-xl transition-all"
                  style={sel ? { background: "#3b82f6" } : todayCell ? { background: "#eff6ff" } : {}}>
                  <span className="text-sm font-semibold leading-none mb-1"
                    style={{ color: sel ? "#fff" : todayCell ? "#2563eb" : "#334155" }}>{d}</span>
                  {hasEvents ? (
                    <div className="flex gap-0.5 flex-wrap justify-center">
                      {events.slice(0,3).map((ev, ei) => (
                        <span key={ei} className="w-1.5 h-1.5 rounded-full" style={{ background: sel ? "#fff" : ev.color }} />
                      ))}
                    </div>
                  ) : <div className="h-2" />}
                </button>
              );
            })}
          </div>

          {/* Selected day events */}
          {selected && (
            <div className="border-t border-slate-100 px-6 py-4">
              <p className="text-xs font-bold text-slate-500 mb-3">
                {selected.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              {selectedEvents.length === 0 ? (
                <div className="flex items-center gap-3 py-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <p className="text-sm text-slate-400">Tidak ada jadwal di hari ini</p>
                  <button onClick={() => { onClose(); onToast("Silakan tambah target baru!"); }}
                    className="ml-auto text-xs font-bold text-blue-600 hover:text-blue-700">+ Tambah</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedEvents.map((ev, ei) => (
                    <div key={ei} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: ev.color + "12" }}>
                      <div className="w-1 h-10 rounded-full shrink-0" style={{ background: ev.color }} />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">{ev.label}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {ev.time}
                        </p>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: ev.color }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer: Google Calendar integration */}
          <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Google Calendar G logo */}
              <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 bg-white shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M12 11.2v2.8h4.4c-.4 2.2-2.3 3.8-4.4 3.8-2.7 0-4.8-2.2-4.8-4.8s2.1-4.8 4.8-4.8c1.2 0 2.4.5 3.2 1.3l2.1-2.1C15.7 5.6 13.9 4.8 12 4.8 7.6 4.8 4 8.4 4 12s3.6 7.2 8 7.2c6.6 0 8.2-6.2 7.5-8.2L12 11.2z"/></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">Google Kalender</p>
                <p className="text-[10px] text-slate-400">Sinkronkan deadline otomatis</p>
              </div>
            </div>
            <button
              onClick={() => { onToast("Menghubungkan ke Google Kalender…"); setTimeout(() => onToast("Berhasil! Deadline tersinkron ✓"), 1800); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#4285F4,#0F9D58)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Integrasi Google Kalender
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressTab() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setChecked((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const [addOpen, setAddOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {addOpen && <AddTargetModal onClose={() => setAddOpen(false)} onToast={m => setToast(m)} />}
      {calOpen && <CalendarModal onClose={() => setCalOpen(false)} onToast={m => setToast(m)} />}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      <ContentHeader title="Progress" subtitle="Kamis, 28 Agustus · Semester 6" />
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6">
        {/* Hero */}
        <div className="rounded-2xl p-7 mb-7 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1d4ed8,#3b82f6)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-2">Progress Minggu Ini</p>
              <h2 className="font-display font-800 text-3xl text-white">{checked.size} dari 4 target selesai</h2>
              <div className="mt-4 h-2 w-64 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full rounded-full bg-white/80 transition-all duration-500" style={{ width: `${(checked.size / 4) * 100}%` }} />
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-white/30 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
            </div>
          </div>
        </div>

        {/* Targets */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-700 text-lg text-slate-900">Target dan deadline</h3>
            <p className="text-xs text-slate-400">Ketuk lingkaran untuk mengubah status.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCalOpen(true)}
              title="Buka Kalender"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </button>
            <button onClick={() => setAddOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Tambah
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {DEADLINES.map((d, i) => (
            <button key={d.label} onClick={() => toggle(i)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border transition-all text-left"
              style={{ borderColor: checked.has(i) ? "#bfdbfe" : "#f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0"
                  style={{ borderColor: checked.has(i) ? "#3b82f6" : "#e2e8f0", background: checked.has(i) ? "#3b82f6" : "transparent" }}>
                  {checked.has(i) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${checked.has(i) ? "text-slate-400 line-through" : "text-slate-800"}`}>{d.label}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <p className="text-[10px] text-slate-400">{d.time}</p>
                  </div>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── QUIZLAB data ─────────────────────────────────────────────────────────────
const QUIZ_TOPICS: { id: string; emoji: string; label: string; sublabel: string; color: string; bg: string; border: string; questions: typeof QUIZ_QUESTIONS }[] = [
  {
    id: "skripsi", emoji: "🎓", label: "Skripsi / Tesis", sublabel: "Metodologi, BAB, sidang",
    color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe",
    questions: [
      { q: "Menurut Technology Acceptance Model, dua faktor utama yang memengaruhi penerimaan teknologi adalah...", opts: ["Harga dan promosi", "Kemudahan dan manfaat yang dirasakan", "Usia dan jenis kelamin", "Kecepatan internet dan desain logo"], correct: 1 },
      { q: "Metode penelitian yang mengumpulkan data dalam bentuk angka dan dianalisis secara statistik disebut...", opts: ["Kualitatif", "Studi kasus", "Kuantitatif", "Etnografi"], correct: 2 },
      { q: "Teknik pengambilan sampel yang memberikan peluang yang sama bagi setiap anggota populasi disebut...", opts: ["Purposive sampling", "Snowball sampling", "Random sampling", "Quota sampling"], correct: 2 },
    ],
  },
  {
    id: "jurusan", emoji: "📖", label: "Mata Kuliah", sublabel: "Konsep, teori, dan aplikasi",
    color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe",
    questions: [
      { q: "Konsep dalam pemrograman berorientasi objek yang memungkinkan objek mewarisi sifat dari kelas lain adalah...", opts: ["Enkapsulasi", "Polimorfisme", "Inheritansi", "Abstraksi"], correct: 2 },
      { q: "Dalam sistem basis data relasional, kunci yang secara unik mengidentifikasi setiap baris tabel disebut...", opts: ["Foreign key", "Primary key", "Composite key", "Candidate key"], correct: 1 },
      { q: "Protokol yang digunakan untuk komunikasi aman di web (HTTPS) berbasis pada...", opts: ["FTP", "TCP/IP saja", "TLS/SSL", "UDP"], correct: 2 },
    ],
  },
  {
    id: "metodologi", emoji: "🔬", label: "Metodologi Penelitian", sublabel: "Desain, instrumen, analisis",
    color: "#059669", bg: "#ecfdf5", border: "#a7f3d0",
    questions: [
      { q: "Dalam penelitian kuantitatif, instrumen yang paling sering digunakan untuk mengukur persepsi responden adalah...", opts: ["Wawancara mendalam", "Skala Likert", "Observasi partisipan", "Focus Group Discussion"], correct: 1 },
      { q: "Uji validitas yang mengukur seberapa baik instrumen mencerminkan teori yang mendasarinya disebut...", opts: ["Validitas konstruk", "Validitas isi", "Validitas eksternal", "Validitas konkuren"], correct: 0 },
      { q: "Reliabilitas instrumen penelitian paling sering diukur menggunakan koefisien...", opts: ["Pearson r", "Cronbach Alpha", "Cohen Kappa", "Spearman rho"], correct: 1 },
    ],
  },
  {
    id: "sidang", emoji: "🎤", label: "Persiapan Sidang", sublabel: "Pertanyaan penguji, presentasi",
    color: "#d97706", bg: "#fffbeb", border: "#fcd34d",
    questions: [
      { q: "Saat penguji bertanya 'Apa novelty penelitianmu?', yang dimaksud adalah...", opts: ["Judul yang unik", "Kontribusi baru yang membedakan dari penelitian sebelumnya", "Jumlah halaman skripsi", "Nama metode yang digunakan"], correct: 1 },
      { q: "Triangulasi dalam penelitian kualitatif berfungsi untuk...", opts: ["Menambah jumlah responden", "Meningkatkan kredibilitas data dari berbagai sumber", "Mempercepat proses analisis", "Menyederhanakan hasil penelitian"], correct: 1 },
      { q: "Jika penguji meminta kamu 'mempertahankan metode penelitianmu', langkah terbaik adalah...", opts: ["Meminta ganti penguji", "Menjelaskan alasan pemilihan metode berdasarkan tujuan penelitian", "Mengubah metode sesuai permintaan", "Membaca ulang bab metodologi"], correct: 1 },
    ],
  },
  {
    id: "analisis", emoji: "📊", label: "Analisis Data", sublabel: "Statistik, interpretasi, SPSS",
    color: "#dc2626", bg: "#fef2f2", border: "#fecaca",
    questions: [
      { q: "Uji statistik yang digunakan untuk membandingkan rata-rata dua kelompok yang independen adalah...", opts: ["ANOVA", "Independent Samples t-Test", "Chi-Square", "Regresi Linear"], correct: 1 },
      { q: "Nilai p-value di bawah 0.05 dalam uji hipotesis mengindikasikan...", opts: ["Hipotesis nol diterima", "Hipotesis nol ditolak (hasil signifikan)", "Data tidak valid", "Perlu menambah sampel"], correct: 1 },
      { q: "Teknik analisis yang menguji hubungan sebab-akibat antara variabel bebas dan variabel terikat disebut...", opts: ["Analisis korelasi", "Analisis regresi", "Analisis faktor", "Analisis cluster"], correct: 1 },
    ],
  },
];

const PACKAGES: { score: [number, number]; label: string; tag: string; tagColor: string; tagBg: string; desc: string; price: string; features: string[]; cta: string; highlight: boolean }[] = [
  {
    score: [3, 3], label: "Kamu Sudah Kuat!", tag: "⭐ Ahli", tagColor: "#059669", tagBg: "#ecfdf5",
    desc: "Pemahamanmu sudah solid. Tingkatkan ke level lanjut dengan bimbingan intensif untuk finishing touch.",
    price: "Rp 199.000", cta: "Gabung Kelas Lanjut",
    features: ["Sesi review skripsi 1-on-1", "Simulasi sidang live", "Feedback penguji asli", "Akses materi premium"],
    highlight: true,
  },
  {
    score: [2, 2], label: "Hampir Sempurna!", tag: "👍 Baik", tagColor: "#d97706", tagBg: "#fffbeb",
    desc: "Fondasi kamu bagus. Satu sesi bimbingan akan menutup celah yang tersisa.",
    price: "Rp 99.000", cta: "Mulai Bimbingan",
    features: ["2 sesi bimbingan online", "Koreksi BAB pilihan", "Tanya jawab via chat", "Materi ringkasan"],
    highlight: false,
  },
  {
    score: [0, 1], label: "Perlu Diperkuat", tag: "📖 Pemula", tagColor: "#dc2626", tagBg: "#fef2f2",
    desc: "Jangan khawatir! Dengan paket intensif, kamu bisa mengejar ketertinggalan dengan cepat.",
    price: "Rp 149.000", cta: "Daftar Kelas Intensif",
    features: ["4 sesi bimbingan online", "Modul dari nol", "Latihan soal terbimbing", "Mentor 1-on-1", "Garansi pemahaman"],
    highlight: false,
  },
];

// ─── TAB: QUIZLAB ─────────────────────────────────────────────────────────────
function QuizlabTab({ onTab }: { onTab: (t: NavTab) => void }) {
  type QuizScreen = "topic" | "quiz" | "result";
  const [screen, setScreen] = useState<QuizScreen>("topic");
  const [topic, setTopic] = useState<typeof QUIZ_TOPICS[0] | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const questions = topic?.questions ?? QUIZ_QUESTIONS;
  const q = questions[qIdx];

  const startQuiz = (t: typeof QUIZ_TOPICS[0]) => { setTopic(t); setScreen("quiz"); setQIdx(0); setSelected(null); setAnswered(false); setScore(0); };
  const handleSelect = (i: number) => { if (answered) return; setSelected(i); setAnswered(true); if (i === q.correct) setScore(s => s + 1); };
  const handleNext = () => { if (qIdx + 1 >= questions.length) { setScreen("result"); return; } setQIdx(i => i + 1); setSelected(null); setAnswered(false); };
  const reset = () => { setScreen("topic"); setTopic(null); setQIdx(0); setSelected(null); setAnswered(false); setScore(0); };

  const pkg = PACKAGES.find(p => score >= p.score[0] && score <= p.score[1])!;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      <ContentHeader title="QUIZLAB" subtitle="Kamis, 28 Agustus · Semester 6" />
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6">

        {/* ── SCREEN 1: Topic selection ── */}
        {screen === "topic" && (
          <>
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold border" style={{ background: "#fffbeb", color: "#d97706", borderColor: "#fcd34d" }}>
                  🏆 QUIZLAB
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold border border-slate-200 text-slate-500">5 topik tersedia</span>
              </div>
              <h2 className="font-display font-800 text-2xl text-slate-900 mb-1">Pilih fokus kuis kamu</h2>
              <p className="text-slate-500 text-sm">Setiap topik punya 3 soal yang disesuaikan dengan kebutuhanmu saat ini.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
              {QUIZ_TOPICS.map(t => (
                <button key={t.id} onClick={() => startQuiz(t)}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white border-2 text-left group transition-all hover:shadow-md"
                  style={{ borderColor: "#f1f5f9" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = t.color)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#f1f5f9")}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: t.bg }}>{t.emoji}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-0.5">{t.label}</p>
                    <p className="text-xs text-slate-400">{t.sublabel}</p>
                    <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: t.bg, color: t.color }}>3 soal</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Info card */}
            <div className="rounded-2xl p-5 border border-blue-100 bg-blue-50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 text-xl">💡</div>
              <div>
                <p className="text-sm font-bold text-blue-800 mb-0.5">Rekomendasi setelah kuis</p>
                <p className="text-xs text-blue-600 leading-relaxed">Setelah selesai, kamu akan mendapat rekomendasi paket bimbingan yang sesuai dengan hasilmu.</p>
              </div>
            </div>
          </>
        )}

        {/* ── SCREEN 2: Quiz ── */}
        {screen === "quiz" && topic && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold border" style={{ background: topic.bg, color: topic.color, borderColor: topic.border }}>
                  {topic.emoji} {topic.label}
                </span>
              </div>
              <button onClick={reset} className="text-xs font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Ganti topik
              </button>
            </div>

            <div className="rounded-2xl bg-white border border-slate-100 overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div className="px-7 pt-6 pb-4 border-b border-slate-100">
                <p className="text-xs font-bold mb-3" style={{ color: topic.color }}>PERTANYAAN {qIdx + 1} DARI {questions.length}</p>
                <div className="flex gap-1.5 mb-4">
                  {questions.map((_, i) => (
                    <div key={i} className="flex-1 h-1.5 rounded-full transition-all" style={{ background: i < qIdx ? topic.color : i === qIdx ? topic.color + "55" : "#e2e8f0" }} />
                  ))}
                </div>
                <p className="font-display font-700 text-lg text-slate-900 leading-snug">{q.q}</p>
              </div>

              <div className="p-5 space-y-2">
                {q.opts.map((opt, i) => {
                  let st: React.CSSProperties = { borderColor: "#f1f5f9", background: "#fff" };
                  if (answered) {
                    if (i === q.correct) st = { borderColor: "#22c55e", background: "#f0fdf4" };
                    else if (i === selected) st = { borderColor: "#ef4444", background: "#fef2f2" };
                  } else if (selected === i) {
                    st = { borderColor: topic.color, background: topic.bg };
                  }
                  return (
                    <button key={i} onClick={() => handleSelect(i)}
                      className="w-full flex items-center gap-3 px-5 py-4 rounded-xl border-2 text-sm text-left font-medium transition-all"
                      style={{ ...st, color: "#334155" }}>
                      <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={{ borderColor: answered && i === q.correct ? "#22c55e" : answered && i === selected ? "#ef4444" : "#cbd5e1" }}>
                        {answered && i === q.correct && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                        {answered && i === selected && i !== q.correct && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="px-5 pb-5">
                <button onClick={handleNext} disabled={!answered}
                  className="w-full py-4 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg,${topic.color},${topic.color}cc)` }}>
                  {qIdx + 1 >= questions.length ? "Lihat Hasil & Rekomendasi" : "Lanjut ke soal berikutnya"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── SCREEN 3: Result + Package recommendation ── */}
        {screen === "result" && topic && pkg && (
          <>
            {/* Score card */}
            <div className="rounded-2xl p-7 mb-5 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg,${topic.color}22,${topic.color}08)`, border: `2px solid ${topic.color}33` }}>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: pkg.tagBg, color: pkg.tagColor }}>{pkg.tag}</span>
              </div>
              <p className="text-6xl font-display font-800 mb-2" style={{ color: topic.color }}>{score}<span className="text-2xl text-slate-400">/{questions.length}</span></p>
              <h3 className="font-display font-800 text-xl text-slate-900 mb-1">{pkg.label}</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">{pkg.desc}</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <button onClick={reset} className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                  Coba topik lain
                </button>
                <button onClick={() => onTab("percakapan")} className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-colors" style={{ background: topic.color }}>
                  Diskusikan dengan Alerin
                </button>
              </div>
            </div>

            {/* Package recommendation */}
            <div className="mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Rekomendasi Paket Bimbingan</p>
              <div className="space-y-3">
                {PACKAGES.map((p, pi) => {
                  const isRecommended = p === pkg;
                  return (
                    <div key={pi} className="rounded-2xl border-2 overflow-hidden transition-all"
                      style={{ borderColor: isRecommended ? topic.color : "#f1f5f9", background: isRecommended ? topic.bg + "60" : "#fff", boxShadow: isRecommended ? `0 4px 20px ${topic.color}22` : "none" }}>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            {isRecommended && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-2" style={{ background: topic.color, color: "#fff" }}>
                                ✦ Direkomendasikan untukmu
                              </span>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold px-2 py-0.5 rounded-full" style={{ background: p.tagBg, color: p.tagColor }}>{p.tag}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-display font-800 text-xl text-slate-900">{p.price}</p>
                            <p className="text-[10px] text-slate-400">/paket</p>
                          </div>
                        </div>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4">
                          {p.features.map(f => (
                            <li key={f} className="flex items-center gap-1.5 text-xs text-slate-600">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                              {f}
                            </li>
                          ))}
                        </ul>
                        <button onClick={() => { setToast(`Mengalihkan ke pendaftaran ${p.cta}…`); }}
                          className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                          style={isRecommended
                            ? { background: `linear-gradient(135deg,${topic.color},${topic.color}bb)`, color: "#fff" }
                            : { background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" }}>
                          {p.cta}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

// ─── TAB: Profil ─────────────────────────────────────────────────────────────
// ─── Register / Onboarding Modal (Pintarly-inspired full-screen) ─────────────
type FinishDest = { prompt?: string; tab?: NavTab; featureKey?: FeatureKey };

const PintarlyMascotBubble = React.memo(function PintarlyMascotBubble({ pre, bold, sub }: { pre?: string; bold: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 w-full" style={{ animation: "bubbleEnter 0.45s cubic-bezier(0.34,1.56,0.64,1) both" }}>
      <div className="relative shrink-0" style={{ animation: "mascotBob 3s ease-in-out infinite" }}>
        <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-full overflow-hidden flex items-center justify-center" style={{ background: "linear-gradient(135deg,#dbeafe,#c7d2fe)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -2px rgba(0,0,0,0.1)", border: "2px solid #bfdbfe" }}>
          <img src="/assets/alerin-logo.png" alt="Alerin" className="w-full h-full object-cover"/>
        </div>
      </div>
      <div className="relative flex-1 bg-white rounded-[18px] sm:rounded-[24px] px-4 sm:px-5 py-3.5 sm:py-4 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
        style={{ border: "1px solid #e5e7eb", animation: "bubblePop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.1s both" }}>
        <div className="absolute top-1/2 -translate-y-1/2" style={{ left: -9, width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderRight: "10px solid white" }}/>
        <p className="text-[16px] sm:text-[17px] text-[#1f2937] leading-[24px] sm:leading-[28px]">
          <strong className="font-extrabold text-[#111827]">{pre && `${pre} `}{bold}</strong>
        </p>
        {sub && <p className="text-[13px] sm:text-sm text-[#6b7280] mt-1 sm:mt-1 leading-[18px] sm:leading-[20px]">{sub}</p>}
      </div>
    </div>
  );
});

class RegisterErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: Error) { console.error("RegisterModal error:", err); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <p className="text-[15px] font-semibold text-slate-800 mb-1" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Terjadi kesalahan</p>
          <p className="text-[13px] text-slate-500 mb-4">Silakan coba lagi dari awal.</p>
          <button onClick={() => window.location.reload()} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 transition">Muat Ulang</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function RegisterModal({ onClose, onFinish }: { onClose: () => void; onFinish: (dest: FinishDest) => void }) {
  // 0=welcome, 1=akun, 2=jenjang, 3=fase, 4=target, 5=identitas, 6=fitur
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [captchaDone, setCaptchaDone] = useState(false);
  const [jenjang, setJenjang] = useState("");
  const [fase, setFase] = useState("");
  const [target, setTarget] = useState("");
  const [kendala, setKendala] = useState<string[]>([]);
  const [namaPanggilan, setNamaPanggilan] = useState("");
  const [universitas, setUniversitas] = useState("");
  const [prodi, setProdi] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(0);
  const [loadingPrompt, setLoadingPrompt] = useState("");
  const [showEmailVerify, setShowEmailVerify] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRecoverySent, setShowRecoverySent] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetPasswordConfirmation, setResetPasswordConfirmation] = useState("");
  const [showResetPasswordValue, setShowResetPasswordValue] = useState(false);
  const [showResetPasswordConfirmation, setShowResetPasswordConfirmation] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginCaptchaDone, setLoginCaptchaDone] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [prodiSearch, setProdiSearch] = useState("");
  const [prodiOpen, setProdiOpen] = useState(false);
  const [uniSearch, setUniSearch] = useState("");
  const [uniOpen, setUniOpen] = useState(false);
  const [bantuPilihan, setBantuPilihan] = useState("");
  const [faseLainnya, setFaseLainnya] = useState("");
  const [featureLoading, setFeatureLoading] = useState(false);
  const [featureLoadingDone, setFeatureLoadingDone] = useState(false);
  const [featureLoadingStatus, setFeatureLoadingStatus] = useState(0);
  const [selectedFitur, setSelectedFitur] = useState("");
  const TOTAL = bantuPilihan === "tugas" ? 11 : 10;
  const loadingTimers = useRef<number[]>([]);
  const featureTimers = useRef<number[]>([]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      loadingTimers.current.forEach(id => clearTimeout(id));
      loadingTimers.current.forEach(id => clearInterval(id));
      featureTimers.current.forEach(id => clearTimeout(id));
      featureTimers.current.forEach(id => clearInterval(id));
    };
  }, []);

  // Kendala → recommended feature mapping
  const KENDALA_FITUR_MAP: Record<string, string> = {
    "Kesulitan memahami materi kuliah": "Mata Kuliah",
    "Kesulitan mencari referensi materi": "Mata Kuliah",
    "Kesulitan menentukan prioritas belajar": "Mata Kuliah",
    "Kesulitan mempraktikkan teori mata kuliah": "Mata Kuliah",
    "Belum memahami instruksi tugas": "Mata Kuliah",
    "Bingung memulai dari bagian mana": "Mata Kuliah",
    "Sulit mencari referensi yang sesuai": "Mata Kuliah",
    "Deadline tugas sudah sangat dekat": "Mata Kuliah",
    "Persiapan Kualifikasi Disertasi masih belum diterima": "Skripsi/Tesis/Disertasi",
    "Kurang yakin dengan draft final Disertasi": "Skripsi/Tesis/Disertasi",
    "Kurang yakin dengan draft final tesis": "Skripsi/Tesis/Disertasi",
    "Bingung memulai penelitian": "Skripsi/Tesis/Disertasi",
    "Belum memiliki topik/judul": "Skripsi/Tesis/Disertasi",
    "Stuck dan tidak tahu harus menulis apa lagi": "Skripsi/Tesis/Disertasi",
    "Sulit menemukan referensi yang relevan": "Cari Jurnal",
    "Banyak revisi dari dosen": "Skripsi/Tesis/Disertasi",
    "Khawatir hasil plagiasi tinggi": "Cek Plagiasi",
    "Kesulitan mengolah atau menganalisis data": "Skripsi/Tesis/Disertasi",
    "Penulisan akademik masih kurang tepat": "Parafrase",
    "Target penyelesaian terasa berat": "Skripsi/Tesis/Disertasi",
  };
  const kendalaFitur = kendala.length > 0 ? KENDALA_FITUR_MAP[kendala[0]] ?? "Parafrase" : null;

  useEffect(() => {
    if (!showEmailVerify) return;
    setResendCountdown(10);
    const iv = setInterval(() => {
      setResendCountdown((c) => {
        if (c <= 1) { clearInterval(iv); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [showEmailVerify]);

  const LOADING_MSGS = [
    "Menganalisis profilmu...",
    "Menyiapkan jalur akademik personalmu...",
    "Mengkonfigurasi asisten Alerin...",
    "Memprioritaskan kebutuhanmu...",
    "Hampir selesai, sebentar lagi! ✨",
  ];

  const playClick = () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.14);
    } catch (_) {}
  };

  const transition = (next: number) => {
    playClick();
    setVisible(false);
    const tid = window.setTimeout(() => { setStep(next); setVisible(true); }, 180);
    loadingTimers.current.push(tid);
  };
  // Step map: 0=welcome 1=akun 2=jenjang 3=jurusan 4=semester 5=kampus 6=bantu 7=fase | tugas: 8=dibingungkan 9=target 10=kendala 11=fitur | others: 8=target 9=kendala 10=fitur
  const AUTO_STEPS = [2, 5, 6, 8];
  const goNext = () => {
    if (step === 9 && bantuPilihan !== "tugas") handleFinish();
    else if (step === 10 && bantuPilihan === "tugas") handleFinish();
    else transition(step + 1);
  };
  const goBack = () => {
    if (step > 0) transition(step - 1);
    else onClose();
  };
  const pickAndAdvance = (setter: (v: string) => void, value: string) => {
    setter(value);
    const tid = window.setTimeout(() => goNext(), 220);
    loadingTimers.current.push(tid);
  };

  const handleFinish = () => {
    loadingTimers.current.forEach(id => { clearTimeout(id); clearInterval(id); });
    loadingTimers.current = [];
    const jl = jenjang === "S1" ? "Skripsi S1" : jenjang === "S2" ? "Tesis S2" : jenjang === "S3" ? "Disertasi S3" : jenjang;
    const prompt = `Halo Alerin! Saya ${namaPanggilan || "kamu"}, mahasiswa ${prodi || "berbagai jurusan"} di ${universitas || "kampus"}, ${semester || ""}. Saya mengerjakan ${jl} dengan fase: ${fase || "belum ditentukan"}. Target selesai: ${target || "belum ditentukan"}. Tolong bantu saya mulai dan beri arahan yang relevan!`;
    setLoadingPrompt(prompt);
    setLoading(true);
    let idx = 0;
    const iv = window.setInterval(() => {
      idx += 1;
      setLoadingStatus(idx % LOADING_MSGS.length);
    }, 900);
    loadingTimers.current.push(iv);
    const tid = window.setTimeout(() => {
      clearInterval(iv);
      setLoadingDone(true);
    }, 4500);
    loadingTimers.current.push(tid);
  };

  const FEATURE_MSGS = [
    "Menyiapkan fitur sesuai dengan kebutuhanmu..",
    "Sedikit lagi, siap!",
  ];
  const startFeatureLoading = () => {
    const bantuanLabel = bantuPilihan === "matakuliah"
      ? "Mata Kuliah"
      : bantuPilihan === "tugas"
      ? "Tugas Kuliah"
      : jenjang === "S2"
      ? "Tesis"
      : jenjang === "S3"
      ? "Disertasi"
      : "Skripsi";
    window.localStorage.setItem("alerin-registration-profile", JSON.stringify({
      nama: namaLengkap || namaPanggilan,
      universitas,
      jenjang: jenjang === "S1" ? "S1 (Sarjana)" : jenjang === "S2" ? "S2 (Magister)" : jenjang === "S3" ? "S3 (Doktor)" : jenjang,
      prodi,
      semester,
      bantuan: bantuanLabel,
      fase: fase === "Lainnya" ? faseLainnya : fase,
    }));
    featureTimers.current.forEach(id => { clearTimeout(id); clearInterval(id); });
    featureTimers.current = [];
    setFeatureLoading(true);
    setFeatureLoadingDone(false);
    setFeatureLoadingStatus(0);
    let idx = 0;
    const iv = window.setInterval(() => {
      idx += 1;
      setFeatureLoadingStatus(idx % FEATURE_MSGS.length);
    }, 1000);
    featureTimers.current.push(iv);
    const tid = window.setTimeout(() => {
      clearInterval(iv);
      setFeatureLoadingDone(true);
    }, 4000);
    featureTimers.current.push(tid);
    // Auto-navigate after loading completes
    const navTid = window.setTimeout(() => {
      setFeatureLoading(false);
      setFeatureLoadingDone(false);
      const FITUR_DEST: Record<string, FinishDest> = {
        matakuliah:{ tab: "fitur", featureKey: "matakuliah" },
        jurnal:    { tab: "fitur", featureKey: "jurnal" },
        parafrase: { tab: "fitur", featureKey: "parafrase" },
        skripsi:   { tab: "fitur", featureKey: "skripsi" },
      };
      onFinish(FITUR_DEST[selectedFitur] ?? { prompt: loadingPrompt });
    }, 4200);
    featureTimers.current.push(navTid);
  };

  const progress = step === 0 ? 0 : (step / TOTAL) * 100;

  const cardBase = { boxShadow: "0 2px 12px rgba(0,0,0,0.06)" };
  const cardSel = { border: "2px solid #2563eb", background: "#eff6ff", boxShadow: "0 2px 16px rgba(37,99,235,0.12)" };
  const cardDef = { border: "2px solid transparent", background: "#ffffff", ...cardBase };

  const Radio = ({ on }: { on: boolean }) => (
    <div className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all"
      style={on ? { borderColor: "#2563eb", background: "#2563eb" } : { borderColor: "#cbd5e1", background: "#fff" }}>
      {on && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><path d="M20 6L9 17l-5-5"/></svg>}
    </div>
  );

  const MascotBubble = ({ pre, bold, sub }: { pre: string; bold: string; sub?: string }) => (
    <div className="flex items-center gap-3 mb-7 w-full" style={{ animation: "bubbleEnter 0.45s cubic-bezier(0.34,1.56,0.64,1) both" }}>
      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 drop-shadow-sm" style={{ animation: "mascotBob 3s ease-in-out infinite" }}>
        <img src="/assets/alerin-logo.png" alt="Alerin" className="w-full h-full object-cover"/>
      </div>
      <div className="relative bg-white rounded-2xl px-5 py-3.5 flex-1" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)", borderRadius: "0 20px 20px 20px", animation: "bubblePop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.1s both" }}>
        <div className="absolute -left-2.5 top-4 w-0 h-0" style={{ borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderRight: "12px solid white", filter: "drop-shadow(-2px 0 2px rgba(0,0,0,0.06))" }} />
        <p className="text-[15px] text-slate-800 leading-snug">
          {pre} <strong className="font-bold text-slate-900">{bold}</strong>
        </p>
        {sub && <p className="text-sm text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
  );

  const inpCls = "w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none bg-white border-2 border-transparent focus:border-blue-400 transition-all placeholder:text-slate-400";
  const inpShadow = { boxShadow: "0 1px 8px rgba(0,0,0,0.06)" };
  const resetPasswordChecks = {
    length: resetPassword.length >= 8,
    letterCase: /[a-z]/.test(resetPassword) && /[A-Z]/.test(resetPassword),
    unique: /[\d\W]/.test(resetPassword),
  };
  const resetPasswordScore = Object.values(resetPasswordChecks).filter(Boolean).length;
  const resetPasswordsMatch = resetPassword.length > 0 && resetPassword === resetPasswordConfirmation;
  const canSaveResetPassword = resetPasswordScore === 3 && resetPasswordsMatch;

  const canProceed = [
    true,                    // 0: welcome
    !!(namaLengkap.trim() && email.trim() && password.length >= 6 && agreeTerms && captchaDone), // 1: akun
    !!jenjang,               // 2: jenjang (auto)
    !!universitas.trim(),    // 3: kampus
    !!prodi.trim(),          // 4: jurusan
    !!semester,              // 5: semester
    !!bantuPilihan,          // 6: bantu
    fase === "Lainnya" ? !!faseLainnya.trim() : !!fase, // 7: fase
    bantuPilihan === "tugas" ? true : !!target,                     // 8: dibingungkan(tugas) or target
    bantuPilihan === "tugas" ? !!target : kendala.length > 0,      // 9: target(tugas) or kendala
    bantuPilihan === "tugas" ? kendala.length > 0 : !!selectedFitur, // 10: kendala(tugas) or fitur
    !!selectedFitur,         // 11: fitur (tugas only)
  ][step];

  if (showResetPassword) return (
    <div
      key="reset-password"
      className="fixed inset-0 z-[300] flex min-h-dvh items-center justify-center overflow-y-auto px-4 py-8"
      style={{ background: "url('/assets/5187b.png') center / cover no-repeat #f3f7fe" }}
    >
      <div
        className="w-full max-w-[440px] overflow-hidden rounded-[16px] bg-white"
        style={{ boxShadow: "0px 20px 25px -5px rgba(0,0,0,0.08), 0px 8px 10px -6px rgba(0,0,0,0.06)" }}
      >
        <div className="h-[6px] bg-gradient-to-r from-[#60a5fa] to-[#6366f1]" />
        <div className="px-5 pb-6 pt-6 sm:px-7">
          <div className="text-center">
            <h2 className="font-['Plus_Jakarta_Sans:ExtraBold'] text-[23px] font-extrabold leading-[30px] tracking-[-0.46px] text-[#1b1b1c]">
              Buat Kata Sandi Baru
            </h2>
            <p className="mx-auto mt-2 max-w-[377px] font-['Plus_Jakarta_Sans:Regular'] text-[14px] leading-[21px] text-[#64748b]">
              Kata sandi kamu harus berbeda dari kata sandi yang pernah digunakan sebelumnya
            </p>
          </div>

          <form
            className="mt-5"
            onSubmit={event => {
              event.preventDefault();
              if (!canSaveResetPassword) return;
              setShowResetPassword(false);
              setShowLogin(true);
              setResetPassword("");
              setResetPasswordConfirmation("");
            }}
          >
            <label className="block">
              <span className="mb-2 block font-['Plus_Jakarta_Sans:SemiBold'] text-[14px] font-semibold leading-5 text-[#1e293b]">Kata Sandi Baru</span>
              <span className="relative block">
                <input
                  type={showResetPasswordValue ? "text" : "password"}
                  value={resetPassword}
                  onChange={event => setResetPassword(event.target.value)}
                  placeholder="Masukkan kata sandi"
                  autoComplete="new-password"
                  className="h-[46px] w-full rounded-xl border border-[#e2e8f0] bg-slate-50/50 px-3 pr-11 font-['Plus_Jakarta_Sans:Regular'] text-[13px] text-slate-800 outline-none transition-colors placeholder:text-zinc-400/60 focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowResetPasswordValue(value => !value)}
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center opacity-60"
                  aria-label={showResetPasswordValue ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  <img src="/assets/6aa10.svg" alt="" />
                </button>
              </span>
            </label>

            <div className="mt-3" style={{ fontFamily: "Arial, sans-serif" }}>
              <div className="flex items-center justify-between text-[12px] leading-[18px]">
                <span className="text-[#64748b]">Kekuatan Kata Sandi</span>
                <span className="text-[#2563eb]">{resetPasswordScore === 3 ? "Sangat Kuat" : resetPasswordScore === 2 ? "Kuat" : resetPasswordScore === 1 ? "Lemah" : "Belum dinilai"}</span>
              </div>
              <div className="mt-1 flex h-[6px] gap-1">
                {[0, 1, 2, 3].map(segment => (
                  <span key={segment} className={`h-full flex-1 rounded-full ${segment < (resetPasswordScore === 3 ? 4 : resetPasswordScore) ? "bg-[#2563eb]" : "bg-slate-200"}`} />
                ))}
              </div>
              <div className="mt-3 space-y-1.5 text-[12px] leading-[18px]">
                {[
                  [resetPasswordChecks.length, "Minimal 8 karakter"],
                  [resetPasswordChecks.letterCase, "Mengandung huruf besar & kecil"],
                  [resetPasswordChecks.unique, "Mengandung angka atau simbol unik"],
                ].map(([valid, label]) => (
                  <div key={String(label)} className={`flex items-center gap-1.5 ${valid ? "text-[#2563eb]" : "text-slate-400"}`}>
                    <img src="/assets/a2f45.svg" alt="" className={`shrink-0 ${valid ? "opacity-100" : "opacity-30 grayscale"}`} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block font-['Plus_Jakarta_Sans:SemiBold'] text-[14px] font-semibold leading-5 text-[#1e293b]">Konfirmasi kata sandi</span>
              <span className="relative block">
                <input
                  type={showResetPasswordConfirmation ? "text" : "password"}
                  value={resetPasswordConfirmation}
                  onChange={event => setResetPasswordConfirmation(event.target.value)}
                  placeholder="Masukkan kata sandi"
                  autoComplete="new-password"
                  className="h-[46px] w-full rounded-xl border border-[#e2e8f0] bg-slate-50/50 px-3 pr-11 font-['Plus_Jakarta_Sans:Regular'] text-[13px] text-slate-800 outline-none transition-colors placeholder:text-zinc-400/60 focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowResetPasswordConfirmation(value => !value)}
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center opacity-60"
                  aria-label={showResetPasswordConfirmation ? "Sembunyikan konfirmasi kata sandi" : "Tampilkan konfirmasi kata sandi"}
                >
                  <img src="/assets/6aa10.svg" alt="" />
                </button>
              </span>
            </label>

            <div className={`mt-2 flex items-center gap-1.5 text-[12px] leading-[18px] ${resetPasswordsMatch ? "text-[#2563eb]" : "text-slate-400"}`} style={{ fontFamily: "Arial, sans-serif" }}>
              <img src="/assets/4b4d0.svg" alt="" className={resetPasswordsMatch ? "opacity-100" : "opacity-30 grayscale"} />
              <span>{resetPasswordConfirmation ? (resetPasswordsMatch ? "Kata sandi cocok" : "Kata sandi belum cocok") : "Kata sandi cocok"}</span>
            </div>

            <button
              type="submit"
              disabled={!canSaveResetPassword}
              className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-[#2563eb] px-4 font-['Plus_Jakarta_Sans:Bold'] text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Simpan
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setShowResetPassword(false);
              setShowLogin(true);
            }}
            className="mx-auto mt-4 flex items-center justify-center gap-1.5 font-['Plus_Jakarta_Sans:SemiBold'] text-[14px] font-semibold leading-5 text-[#2563eb]"
          >
            <img src="/assets/c0bc7.svg" alt="" />
            Kembali ke Halaman Masuk
          </button>
        </div>
      </div>
    </div>
  );

  if (showRecoverySent) return (
    <div
      key="recovery-sent"
      className="fixed inset-0 z-[300] flex items-center justify-center overflow-y-auto px-4 py-8"
      style={{ background: "url('/assets/5187b.png') center / cover no-repeat #f3f7fe" }}
    >
      <div
        className="w-full max-w-[440px] overflow-hidden rounded-[16px] bg-white"
        style={{ boxShadow: "0px 20px 25px -5px rgba(0,0,0,0.08), 0px 8px 10px -6px rgba(0,0,0,0.06)", animation: "emailCardIn 0.4s ease both" }}
      >
        <div className="h-[6px] bg-gradient-to-r from-[#60a5fa] to-[#6366f1]" />
        <div className="flex flex-col items-center px-7 pb-8 pt-6 text-center">
          <div className="relative h-[145px] w-[144px] overflow-hidden">
            <img
              src="/assets/90f05.png"
              alt="Email pemulihan telah dikirim"
              className="pointer-events-none absolute max-w-none"
              style={{ width: 410, height: 230, left: -141, top: -40 }}
            />
          </div>
          <h2 className="font-['Plus_Jakarta_Sans:ExtraBold'] text-[28px] font-extrabold leading-9 tracking-[-0.55px] text-[#1b1b1c]">Cek Email Kamu</h2>
          <p className="mt-3 max-w-[370px] font-['Plus_Jakarta_Sans:Regular'] text-[14px] leading-[23px] text-slate-500">
            Kami telah mengirim tautan pemulihan kata sandi ke email Kamu. Silakan cek kotak masuk dan ikuti instruksi untuk mengatur ulang kata sandi.
          </p>
          <button
            type="button"
            onClick={() => {
              setShowRecoverySent(false);
              setShowForgotPassword(false);
              setShowResetPassword(true);
            }}
            className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Kembali ke Halaman Masuk
          </button>
        </div>
      </div>
    </div>
  );

  if (showForgotPassword) return (
    <div
      key="forgot-password"
      className="fixed inset-0 z-[300] flex items-center justify-center overflow-y-auto px-4 py-8"
      style={{ background: "url('/assets/5187b.png') center / cover no-repeat #f3f7fe", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="w-full max-w-[440px] overflow-hidden rounded-[16px] bg-white shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.08),0px_8px_10px_-6px_rgba(0,0,0,0.06)]">
        <div className="h-[6px] bg-gradient-to-r from-[#60a5fa] to-[#6366f1]" />
        <div className="px-7 pb-6 pt-7 sm:px-8">
          <div className="text-center">
            <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-[24px] font-bold leading-8 tracking-[-0.5px] text-[#1b1b1c]">Lupa Kata Sandi?</h2>
            <p className="mx-auto mt-2 max-w-[410px] font-['Plus_Jakarta_Sans:Regular'] text-[14px] leading-[23px] text-slate-500">
              Masukkan alamat email yang terdaftar untuk menerima tautan verifikasi pemulihan kata sandi Kamu.
            </p>
          </div>

          <label className="mt-5 block">
            <span className="mb-1.5 block font-['Plus_Jakarta_Sans:SemiBold'] text-[14px] font-semibold text-slate-800">Email</span>
            <span className="relative block">
              <img src="/assets/c9652.svg" alt="" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={recoveryEmail}
                onChange={event => setRecoveryEmail(event.target.value)}
                placeholder="Masukan email aktifmu"
                className="h-[48px] w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 font-['Plus_Jakarta_Sans:Regular'] text-[14px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </span>
          </label>

          <div className="mt-3 flex min-h-[65px] items-center rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2">
            <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center">
              <img src="/assets/56fca.svg" alt="" />
            </div>
            <p className="ml-2 font-['Plus_Jakarta_Sans:Regular'] text-[12px] leading-[19.5px] text-slate-600">
              Tautan pemulihan berlaku selama <strong className="font-['Plus_Jakarta_Sans:Bold'] font-bold">60 menit.</strong> Pastikan memeriksa kotak masuk atau spam email kamu
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowRecoverySent(true)}
            className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.99]"
          >
            Kirim Tautan Pemulihan
          </button>

          <button type="button" onClick={() => setShowForgotPassword(false)} className="mx-auto mt-5 flex items-center gap-1.5 font-['Plus_Jakarta_Sans:SemiBold'] text-[14px] font-semibold text-blue-600 hover:text-blue-700">
            <img src="/assets/c0bc7.svg" alt="" />
            Kembali ke Halaman Masuk
          </button>
        </div>
      </div>
    </div>
  );

  if (showLogin) return (
    <div key="login" className="fixed inset-0 z-[300] flex flex-col overflow-hidden" style={{ background: "url('/assets/5187b.png') center / cover no-repeat #f3f7fe", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @keyframes emailCardIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-4 py-6">
        <div className="max-w-[422px] w-full">
          <div className="w-full" style={{ animation: "emailCardIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <div className="bg-white rounded-[15px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.08),0px_8px_10px_-6px_rgba(0,0,0,0.06)] overflow-hidden">
              {/* Top gradient bar */}
              <div className="h-[6px]" style={{ background: "linear-gradient(90deg,#60a5fa,#6366f1)" }}/>

              {/* Header */}
              <div className="flex flex-col items-center px-4 pb-3 pt-4">
                <div className="mb-2 flex h-[61px] w-[61px] items-center justify-center overflow-hidden rounded-full border-2 border-blue-100 bg-white shadow-md">
                  <img src="/assets/f725b.png" alt="Alerin" className="h-full w-full object-cover" />
                </div>
                <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-[22px] font-bold leading-[30px] tracking-[-0.45px] text-[#1b1b1c]">Masuk ke Alerin</h2>
                <p className="mt-1 w-full text-center font-['Plus_Jakarta_Sans:Regular'] text-[12px] leading-[19px] text-[#71717a]">Selamat datang kembali! Masuk untuk melanjutkan.</p>
              </div>

              {/* Fields */}
              <div className="space-y-[12px] px-[22px] pb-[12px] pt-1">
                {/* Email */}
                <div className="space-y-[6px]">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-semibold text-[#1b1b1c] leading-[20px]">Email</label>
                    <span className="font-['Plus_Jakarta_Sans:Medium'] text-[10px] font-medium leading-4 text-[#2563eb]">Wajib</span>
                  </div>
                  <div className="relative">
                    <img src="/assets/36806.svg" alt="" className="absolute left-[13px] top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={event => setLoginEmail(event.target.value)}
                      className="w-full pl-[38px] pr-4 h-[46px] rounded-[10px] border text-[14px] text-[#1b1b1c] outline-none transition-all placeholder:text-[#a1a1aa]"
                      style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}
                      onFocus={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                      onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.boxShadow = "none"; }}
                      placeholder="Masukan email aktifmu"/>
                  </div>
                </div>

                {/* Kata Sandi */}
                <div className="space-y-[6px]">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-semibold text-[#1b1b1c] leading-[20px]">Kata Sandi</label>
                    <span className="font-['Plus_Jakarta_Sans:Medium'] text-[10px] font-medium leading-4 text-[#2563eb]">Wajib</span>
                  </div>
                  <div className="relative">
                    <img src="/assets/e3c20.svg" alt="" className="absolute left-[13px] top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={loginPassword}
                      onChange={event => setLoginPassword(event.target.value)}
                      className="w-full pl-[38px] pr-[42px] h-[46px] rounded-[10px] border text-[14px] text-[#1b1b1c] outline-none transition-all placeholder:text-[#a1a1aa]"
                      style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}
                      onFocus={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                      onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.boxShadow = "none"; }}
                      placeholder="Masukkan kata sandi"/>
                    <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-[13px] top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity">
                      <img src="/assets/7c5e4.svg" alt="Tampilkan kata sandi" />
                    </button>
                  </div>
                  <div className="flex justify-start">
                    <button type="button" onClick={() => setShowForgotPassword(true)} className="text-[12px] font-bold text-[#2563eb] leading-[18px]">Lupa kata sandi?</button>
                  </div>
                </div>

                {/* CAPTCHA */}
                <button type="button" onClick={() => setLoginCaptchaDone(value => !value)}
                  className="w-full flex items-center justify-between px-[13px] py-[10px] rounded-[10px] border transition-all"
                  style={{ background: "#f8fafc", borderColor: "#e2e8f0", boxShadow: "0px 1px_1px rgba(0,0,0,0.04)" }}>
                  <div className="flex items-center gap-[10px]">
                    <div className="w-[18px] h-[18px] rounded-[3px] border flex items-center justify-center transition-all shrink-0"
                      style={loginCaptchaDone ? { borderColor: "#2563eb", background: "#2563eb", borderWidth: 2 } : { borderColor: "#94a3b8", background: "white", borderWidth: 1.5 }}>
                      {loginCaptchaDone && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><path d="M20 6L9 17l-5-5"/></svg>}
                    </div>
                    <div className="text-left">
                      <p className="text-[13px] font-semibold text-[#1b1b1c] leading-[18px]">Saya bukan robot</p>
                      <p className="text-[11px] text-[#71717a] leading-[16px]">Verifikasi pintar anti-bot</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-center border-l border-slate-200 pl-3">
                    <img src="/assets/7a08e.svg" alt="" />
                    <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-500">Turnstile</span>
                  </div>
                </button>
              </div>

              {/* Footer actions */}
              <div className="space-y-[10px] px-[22px] pb-[22px] pt-0">
                {/* Belum punya akun */}
                <p className="text-[12px] text-[#71717a] text-center leading-[18px]">
                  Belum memiliki akun?{" "}
                  <button onClick={() => setShowLogin(false)} className="font-bold text-[#2563eb]">Daftar sekarang</button>
                </p>

                {/* Masuk button */}
                <button
                  type="button"
                  disabled={!loginEmail.trim() || !loginPassword || !loginCaptchaDone}
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 h-[48px] rounded-[12px] text-white font-bold text-[15px] transition-all active:scale-[0.98] disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", boxShadow: "0px 4px 12px rgba(37,99,235,0.28)" }}>
                  Masuk
                </button>

                {/* Atau divider */}
                <div className="flex items-center gap-3 py-[2px]">
                  <div className="flex-1 h-px bg-[#e2e8f0]"/>
                  <span className="text-[12px] text-[#94a3b8] font-medium">atau</span>
                  <div className="flex-1 h-px bg-[#e2e8f0]"/>
                </div>

                {/* Google */}
                <button type="button" onClick={onClose} className="w-full flex items-center justify-center gap-[10px] h-[46px] rounded-[12px] font-semibold text-[#1b1b1c] text-[14px] transition-all active:scale-[0.98]"
                  style={{ background: "#f6f6f8" }}>
                  <img src="/assets/78567.svg" alt="Google" />
                  Masuk dengan Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (showEmailVerify) return (
    <div key="email-verify" className="fixed inset-0 z-[300] flex flex-col overflow-hidden" style={{ background: "linear-gradient(180deg, #f8faff 0%, #f0f5ff 50%, #f8faff 100%)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @keyframes emailCardIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", transform: "translate(30%, -30%)" }}/>
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }}/>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center">
        <div className="max-w-[448px] w-full mx-auto px-4 sm:px-0 pt-2 pb-8 flex flex-col items-center">

          {/* Card */}
          <div className="w-full bg-white rounded-[24px] overflow-hidden relative" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9", animation: "emailCardIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both", top: "14px" }}>
            {/* Top gradient bar */}
            <div className="h-[6px] w-full" style={{ background: "linear-gradient(90deg, #2563eb, #6366f1)" }}/>

            {/* Email illustration */}
            <div className="flex justify-center pt-6 pb-1">
              <img src="/assets/email-illustration.png" alt="Email" style={{ width: 119, height: 125, objectFit: "cover", marginTop: "-13px", marginRight: "-7px", marginBottom: "-13px", marginLeft: "-7px" }}/>
            </div>

            <div className="px-[22px] pb-6 flex flex-col">
              {/* Title + subtitle */}
              <div className="flex flex-col items-center text-center mb-5">
                <h2 className="font-extrabold text-[22px] leading-[27.5px] text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Cek Email Kamu!</h2>
                <p className="mt-1 text-[13px] leading-[21.125px] text-[#6b7280]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tautan verifikasi sudah dikirim ke email yang kamu daftarkan.</p>
              </div>

              {/* Email row */}
              <div className="flex items-center rounded-[14px] mb-4 relative" style={{ background: "#f8faff", border: "1.5px solid #dbeafe", minHeight: 69, padding: "0 16px" }}>
                <div className="flex items-center justify-center rounded-[10px] shrink-0 mr-3" style={{ width: 36, height: 36, background: "#eff6ff" }}>
                  <img src="/assets/icon-email.svg" alt="" style={{ width: 21, height: 21 }}/>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[11px] font-medium leading-[16.5px] text-[#9ca3af]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Email kamu</span>
                  <span className="text-[14px] font-bold leading-[21px] text-[#111827] truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{email}</span>
                </div>
                <button onClick={() => setShowEmailVerify(false)}
                  className="shrink-0 ml-3 px-3 py-1.5 rounded-[8px] text-[12px] font-bold leading-[18px] transition-all active:scale-95"
                  style={{ background: "#eff6ff", color: "#2563eb", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Ubah
                </button>
              </div>

              {/* Notes box */}
              <div className="rounded-[14px] mb-5 relative" style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "16px 16px 16px 16px" }}>
                <p className="text-[12px] font-bold leading-[18px] text-[#1d4ed8] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Catatan:</p>
                <div className="flex flex-col gap-3">
                  {[
                    { src: "/assets/icon-spam.svg", text: "Periksa folder Spam atau Promosi jika email tidak muncul di Kotak Masuk" },
                    { src: "/assets/icon-verify-check.svg", text: "Tautan verifikasi berlaku selama 24 jam sejak email dikirim." },
                    { src: "/assets/icon-link.svg", text: "Demi keamanan akun, jangan bagikan tautan verifikasi kepada pihak manapun" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="rounded-[6px] flex items-center justify-center shrink-0" style={{ width: 25, height: 25, background: "linear-gradient(180deg, #1d4ed8 0%, #0f2972 100%)", opacity: 0.79 }}>
                        <img src={item.src} alt="" style={{ width: 14, height: 14, display: "block", margin: "auto" }}/>
                      </div>
                      <p className="text-[12px] font-medium leading-[19.5px] text-[#1e40af]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resend */}
              <p className="text-center text-[13px] leading-[19.5px] text-[#6b7280] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Belum menerima email?</p>
              <button
                disabled={resendCountdown > 0}
                onClick={() => { setShowEmailVerify(false); goNext(); }}
                className="w-full py-3 rounded-[12px] text-[14px] font-bold leading-[21px] transition-all active:scale-[0.98]"
                style={resendCountdown > 0
                  ? { background: "#f1f5f9", color: "#9ca3af", cursor: "not-allowed", fontFamily: "'Plus Jakarta Sans', sans-serif" }
                  : { background: "#eff6ff", color: "#2563eb", border: "1.5px solid #bfdbfe", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {resendCountdown > 0 ? `Kirim ulang email (${resendCountdown}s)` : "Kirim ulang email"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden" style={{ background: "linear-gradient(180deg, #f8faff 0%, #f0f5ff 50%, #f8faff 100%)" }}>

      {/* Same progress bar style as registration slides — hidden on mobile */}
      <div className="hidden sm:block absolute top-0 left-0 right-0 h-1.5 z-10" style={{ background: "rgba(203,213,225,0.4)" }}>
        <div className="h-full rounded-full" style={{ background: "#2563eb", animation: loadingDone ? "none" : "fillBar 4.4s cubic-bezier(0.33,0,0.66,1) forwards", width: loadingDone ? "100%" : undefined }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl w-full">
        <h1 className="font-bold text-[19px] sm:text-3xl text-slate-900 mb-2 leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <span className="sm:hidden">Terima kasih telah mempercayakan mimpimu</span>
          <span className="hidden sm:inline">Terima kasih telah mempercayakan mimpimu pada Alerin</span>
        </h1>
        <p className="text-slate-500 text-[12px] sm:text-[15px] mb-9 leading-relaxed">
          <span className="sm:hidden">Sekarang, Alerin sedang merancang jalur akademik untukmu.</span>
          <span className="hidden sm:inline">Sekarang, Alerin sedang merancang jalur akademik yang sesuai kebutuhanmu</span>
        </p>

        {/* Arc ring (static) + logo (static) */}
        <div className="relative w-52 h-52 mb-5">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 208 208">
            <circle cx="104" cy="104" r="96" fill="none" stroke="#dbeafe" strokeWidth="10"/>
            <circle cx="104" cy="104" r="96" fill="none" stroke="#2563eb" strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="603"
              strokeDashoffset={loadingDone ? 0 : undefined}
              style={{ animation: loadingDone ? "none" : "fillArc 4.4s cubic-bezier(0.33,0,0.66,1) forwards",
                       strokeDashoffset: loadingDone ? 0 : undefined,
                       transition: loadingDone ? "stroke-dashoffset 0.4s ease" : undefined }}
            />
          </svg>
          {/* Floating logo in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full overflow-hidden flex items-center justify-center"
              style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", animation: "floatUpDown 4s ease-in-out infinite" }}>
              <img
                src="/assets/alerin-logo.png"
                alt="Alerin"
                className="w-28 h-28 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Status text — fades in each time it changes */}
        <p key={loadingDone ? "done" : loadingStatus} className="text-sm mb-7"
          style={{ minHeight: "1.4rem", color: "#2563eb", animation: "fadeSlideUp 0.5s ease forwards" }}>
          {loadingDone ? "Semuanya siap!" : LOADING_MSGS[loadingStatus]}
        </p>

        {/* CTA button */}
        <div style={{ opacity: loadingDone ? 1 : 0, transform: loadingDone ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.5s ease, transform 0.5s ease", pointerEvents: loadingDone ? "auto" : "none" }}>
          <button
            onClick={() => { setLoading(false); setLoadingDone(false); setSelectedFitur(""); transition(TOTAL); }}
            className="px-10 py-4 rounded-2xl text-white font-bold text-base active:scale-95 transition-transform"
            style={{ background: "#2563eb", boxShadow: "0 6px 24px rgba(37,99,235,0.3)" }}>
            Lihat Rekomendasi Fitur
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fillArc{from{stroke-dashoffset:603}to{stroke-dashoffset:0}}
        @keyframes fillBar{from{width:0%}to{width:95%}}
        @keyframes floatUpDown{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
      `}</style>
    </div>
  );

  // Feature loading screen (after selecting a feature)
  if (featureLoading) return (
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden" style={{ background: "linear-gradient(180deg, #f8faff 0%, #f0f5ff 50%, #f8faff 100%)" }}>

      {/* Glowing light behind logo */}
      <div className="relative mb-8">
        {/* Outer glow */}
        <div className="absolute inset-0 -m-16 sm:-m-20 rounded-full" style={{
          background: "radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(37,99,235,0.08) 40%, transparent 70%)",
          animation: "glowPulse 2s ease-in-out infinite",
        }}/>
        {/* Static rays — only pulse brightness */}
        <div className="absolute inset-0 -m-12 sm:-m-16">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <div key={deg} className="absolute top-1/2 left-1/2 w-[2px] sm:w-[3px] rounded-full origin-bottom" style={{
              height: "40px",
              background: "linear-gradient(to top, rgba(37,99,235,0.3), transparent)",
              transform: `translate(-50%, -100%) rotate(${deg}deg)`,
              animation: `rayPulse 2s ease-in-out ${i * 0.25}s infinite`,
            }}/>
          ))}
        </div>
        {/* Inner glow */}
        <div className="absolute inset-0 -m-8 sm:-m-10 rounded-full" style={{
          background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 60%)",
          animation: "glowPulse 2s ease-in-out 0.3s infinite",
        }}/>
        {/* Logo */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center z-10" style={{
          background: "white",
          boxShadow: "0 4px 30px rgba(37,99,235,0.15)",
        }}>
          <img src="/assets/alerin-logo.png" alt="Alerin" className="w-20 h-20 sm:w-24 sm:h-24 object-contain"/>
        </div>
      </div>

      {/* Status text */}
      <div className="text-center px-6">
        <h2 className="font-bold text-[20px] sm:text-[24px] text-[#1e293b] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {featureLoadingDone ? "Siap digunakan" : "Langkah pertamamu dimulai di sini"}
        </h2>
        <p key={featureLoadingStatus} className="text-[13px] sm:text-[14px] text-[#64748b] leading-relaxed"
          style={{ animation: "fadeSlideUp 0.4s ease forwards" }}>
          {featureLoadingDone ? "Alerin siap membantumu." : FEATURE_MSGS[featureLoadingStatus]}
        </p>
      </div>

      {/* Progress bar — solid blue */}
      <div className="w-48 sm:w-56 h-[6px] rounded-full bg-[#dbeafe] mt-6 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{
          background: "#2563eb",
          width: featureLoadingDone ? "100%" : `${Math.min(95, ((featureLoadingStatus + 1) / FEATURE_MSGS.length) * 100)}%`,
        }}/>
      </div>

      <style>{`
        @keyframes glowPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.05)}}
        @keyframes rayPulse{0%,100%{opacity:0.2}50%{opacity:1}}
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  );

  // Pintarly-style radio card
  const RadioCard = ({ selected, onClick, icon, label, sublabel, badge, badgeColor }: { selected: boolean; onClick: () => void; icon: React.ReactNode; label: string; sublabel: string; badge?: string; badgeColor?: string }) => (
    <button onClick={onClick}
      className="w-full bg-white relative rounded-[12px] sm:rounded-[16px] transition-all active:scale-[0.98] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] group reg-card"
      style={selected ? { border: "2px solid #2563eb", background: "#eff6ff" } : { border: "1px solid #e5e7eb" }}>
      <div className="flex items-center justify-between px-4 sm:px-[20px] py-[14px] sm:py-[16px]">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[10px] sm:rounded-[12px] flex items-center justify-center shrink-0 transition-colors"
            style={{ background: "#eff6ff", color: step >= 3 ? "#374151" : "#2563eb" }}>{icon}</div>
          <div className="text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-[#111827] text-[16px] sm:text-[17px] leading-[24px] sm:leading-[28px]">{label}</p>
              {badge && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: (badgeColor || "#60a5fa") + "22", color: badgeColor || "#2563eb" }}>{badge}</span>}
            </div>
            <p className="text-[13px] sm:text-sm text-[#6b7280] leading-[18px] sm:leading-[20px]">{sublabel}</p>
          </div>
        </div>
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 sm:ml-3 transition-all"
          style={selected ? { borderColor: "#2563eb", background: "#2563eb" } : { borderColor: "#d1d5db", background: "white" }}>
          {selected && <svg width="11" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4.5L4.2 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
      </div>
    </button>
  );

  // Pintarly-style mascot speech bubble

  return (
    <div
      key="register-flow"
      className="fixed inset-0 z-[300] flex flex-col overflow-hidden"
      style={{
        background: step === 1 && !showEmailVerify
          ? "url('/assets/5187b.png') center / cover no-repeat #f3f7fe"
          : "linear-gradient(180deg, #f8faff 0%, #f0f5ff 50%, #f8faff 100%)",
        padding: 0,
      }}
    >
      {step === 0 && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden sm:hidden">
          {[0, 1].map(layer => (
            <img
              key={layer}
              src="/assets/5187b.png"
              alt=""
              className="absolute left-0 top-0 max-w-none opacity-50"
              style={{ width: 1433, height: 760 }}
            />
          ))}
        </div>
      )}

      {/* Header — step 0: close only; step 1 & email verify: no header; step 2+: progress header */}
      {step === 0 ? (
        <div className="relative z-10 flex justify-end px-5 pt-5 pb-2 shrink-0">
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full text-[#6b7280] hover:bg-white/60 transition-all">
            <img src="/assets/fbb9c.svg" alt="" />
          </button>
        </div>
      ) : (step === 1 || showEmailVerify) ? (
        !showEmailVerify ? (
          <div className="absolute right-4 top-4 z-20">
            <button onClick={onClose} aria-label="Tutup pendaftaran" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/80 text-slate-500 shadow-sm backdrop-blur-sm hover:bg-white">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        ) : null
      ) : (
        <div className="relative z-10 flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 shrink-0">
          {/* Back button — hidden on fitur/recommendation step */}
          {step < TOTAL && step !== 2 && (
            <button onClick={goBack}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white border border-[#e5e7eb] shadow-sm active:scale-95 transition-all shrink-0"
              style={{ boxShadow: "0px_1px_2px_0px_rgba(0,0,0,0.05)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
          )}
          {/* Progress track */}
          <div className="flex-1 flex flex-col gap-1 sm:gap-1.5">
            <div className="hidden sm:flex items-center justify-between px-1">
              <span className="text-[12px] font-bold leading-[16px]" style={{ color: "#2563eb" }}>Langkah {step} dari {TOTAL}</span>
              <span className="text-[12px] font-semibold leading-[16px]" style={{ color: "#6b7280" }}>{Math.round(progress)}% Selesai</span>
            </div>
            <div className="h-[6px] sm:h-2 rounded-full overflow-hidden" style={{ background: "rgba(229,231,235,0.8)" }}>
              <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%`, background: "linear-gradient(90deg,#60a5fa,#6366f1)" }}/>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-4 relative z-10 flex flex-col" style={{ paddingLeft: "16px", paddingRight: "16px" }}>
        <div className={step === 0 ? "w-full flex items-center justify-center flex-1" : step === 1 ? "max-w-[418px] mx-auto w-full flex items-center justify-center flex-1" : "max-w-md mx-auto w-full pt-4 sm:pt-2 pb-8"}
          style={step === 0 ? { minHeight: "100%", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)", transition: "opacity 0.18s ease, transform 0.18s ease" } : { opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)", transition: "opacity 0.18s ease, transform 0.18s ease" }}>

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="flex items-center justify-center w-full px-5" style={{ paddingBottom: "80px" }}>
              <div className="w-full max-w-[700px] mx-auto sm:px-9" style={{ animation: "welcomeCardIn 0.65s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                {/* Card */}
                <div className="bg-white rounded-[29px] flex flex-col sm:flex-row items-center gap-6 sm:gap-10 px-6 sm:px-10 py-8 sm:py-10 text-center sm:text-left"
                  style={{ boxShadow: "0px 4px 40px rgba(0,0,0,0.12)" }}>

                  {/* Mascot circle */}
                  <div className="relative shrink-0">
                    <div className="absolute rounded-full pointer-events-none"
                      style={{ inset: "-28px", background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(99,102,241,0.1) 60%, transparent 100%)", filter: "blur(12px)" }}/>
                    <div className="relative flex items-center justify-center rounded-full overflow-hidden mx-auto"
                      style={{ width: 168, height: 168, background: "linear-gradient(135deg, #dbeafe 0%, #c7d2fe 100%)", border: "3px solid rgba(255,255,255,0.85)", boxShadow: "0px 6.94px 5.2px rgba(0,0,0,0.1), 0px 3.47px 3.47px rgba(0,0,0,0.1)" }}>
                      <img src="/assets/f725b.png" alt="Alerin" className="h-[140px] w-[140px] rounded-full object-cover"/>
                    </div>
                  </div>

                  {/* Text + CTA */}
                  <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start">
                    <h1 className="mb-2 font-['Plus_Jakarta_Sans:ExtraBold'] text-[26px] font-extrabold leading-[32.5px] tracking-[-0.65px] text-[#1b1b1c] sm:text-[32px]">
                      Halo, aku <span className="text-[#2563eb]">Alerin!</span>
                    </h1>
                    <p className="mb-5 font-['Inter:Regular'] text-[15px] leading-[24.375px] text-[#71717a] sm:text-[18px]">
                      Temukan solusi dari seluruh kendala akademikmu di sini
                    </p>
                    <button onClick={goNext}
                      className="flex items-center justify-center gap-2 active:scale-[0.98] transition-transform w-full sm:w-auto"
                      style={{ background: "#2563eb", boxShadow: "0px 3.63px 3.17px rgba(37,99,235,0.38)", borderRadius: 14, paddingTop: 14, paddingBottom: 14, paddingLeft: 32, paddingRight: 32, color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 16 }}>
                      Mulai sekarang
                      <img src="/assets/a4e37.svg" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Akun (no header) */}
          {step === 1 && (
            <div className="w-full py-5 sm:py-8">
              {/* White card form */}
              <div className="bg-white rounded-[15px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.08),0px_8px_10px_-6px_rgba(0,0,0,0.06)] overflow-hidden">
                {/* Top accent bar */}
                <div className="h-[6px] bg-gradient-to-r from-[#60a5fa] to-[#6366f1]"/>
                {/* Header inside card */}
                <div className="flex flex-col items-center px-4 pb-3 pt-5">
                  <h2 className="font-['Plus_Jakarta_Sans:Bold'] text-[22px] font-bold leading-[30px] tracking-[-0.45px] text-[#1b1b1c]">Daftar Akun</h2>
                  <p className="mt-1 w-full text-center font-['Plus_Jakarta_Sans:Regular'] text-[12px] leading-[19px] text-[#71717a]">Mulai perjalanan akademikmu bersama Alerin.</p>
                </div>
                <div className="space-y-[12px] px-[22px] pb-[12px] pt-1">
                  {/* Nama Lengkap */}
                  <div className="space-y-[6px]">
                    <div className="flex items-center justify-between h-[23px]">
                      <label className="font-['Plus_Jakarta_Sans'] font-semibold text-[14px] text-[#1b1b1c] leading-[21px]">Nama lengkap</label>
                      <span className="font-['Plus_Jakarta_Sans:Medium'] text-[11px] font-medium leading-[16.5px] text-[#2563eb]">Wajib</span>
                    </div>
                    <div className="relative">
                      <img src="/assets/40306.svg" alt="" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input value={namaLengkap} onChange={e => setNamaLengkap(e.target.value)}
                        className="w-full pl-10 pr-4 h-11 rounded-[12px] text-[14px] text-[#1b1b1c] border border-[#e2e8f0] outline-none transition-all placeholder:text-[rgba(113,113,122,0.6)] font-['Plus_Jakarta_Sans']"
                        style={{ background: "#f8fafc" }}
                        onFocus={e => { e.currentTarget.style.outline = "2px solid #2563eb"; e.currentTarget.style.background = "#fff"; }}
                        onBlur={e => { e.currentTarget.style.outline = "none"; e.currentTarget.style.background = "#f8fafc"; }}
                        placeholder="Masukkan nama lengkapmu" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-[6px]">
                    <div className="flex items-center justify-between h-[23px]">
                      <label className="font-['Plus_Jakarta_Sans'] font-semibold text-[14px] text-[#1b1b1c] leading-[21px]">Email</label>
                      <span className="font-['Plus_Jakarta_Sans:Medium'] text-[11px] font-medium leading-[16.5px] text-[#2563eb]">Wajib</span>
                    </div>
                    <div className="relative">
                      <img src="/assets/10dab.svg" alt="" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                        className="w-full pl-10 pr-4 h-11 rounded-[12px] text-[14px] text-[#1b1b1c] border border-[#e2e8f0] outline-none transition-all placeholder:text-[rgba(113,113,122,0.6)] font-['Plus_Jakarta_Sans']"
                        style={{ background: "#f8fafc" }}
                        onFocus={e => { e.currentTarget.style.outline = "2px solid #2563eb"; e.currentTarget.style.background = "#fff"; }}
                        onBlur={e => { e.currentTarget.style.outline = "none"; e.currentTarget.style.background = "#f8fafc"; }}
                        placeholder="Masukkan email aktifmu" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-[6px]">
                    <div className="flex items-center justify-between h-[23px]">
                      <label className="font-['Plus_Jakarta_Sans'] font-semibold text-[14px] text-[#1b1b1c] leading-[21px]">Kata sandi baru</label>
                      <span className="font-['Plus_Jakarta_Sans:Medium'] text-[11px] font-medium leading-[16.5px] text-[#2563eb]">Wajib</span>
                    </div>
                    <div className="relative">
                      <img src="/assets/d7753.svg" alt="" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input value={password} onChange={e => setPassword(e.target.value)} type={showPass ? "text" : "password"}
                        className="w-full pl-10 pr-11 h-11 rounded-[12px] text-[14px] text-[#1b1b1c] border border-[#e2e8f0] outline-none transition-all placeholder:text-[rgba(113,113,122,0.6)] font-['Plus_Jakarta_Sans']"
                        style={{ background: "#f8fafc" }}
                        onFocus={e => { e.currentTarget.style.outline = "2px solid #2563eb"; e.currentTarget.style.background = "#fff"; }}
                        onBlur={e => { e.currentTarget.style.outline = "none"; e.currentTarget.style.background = "#f8fafc"; }}
                        placeholder="Buat kata sandi yang aman" />
                      <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        <img src="/assets/4eafa.svg" alt="" />
                      </button>
                    </div>
                    <div className="flex gap-[6px] items-center pt-[2px]">
                      <div className="flex-1 h-[5px] rounded-full overflow-hidden bg-[#dce9ff]">
                        <div className="h-full rounded-full transition-all" style={{ width: password.length >= 8 ? "100%" : password.length >= 5 ? "66%" : "33%", background: password.length >= 8 ? "#22c55e" : password.length >= 5 ? "#f59e0b" : "#ef4444" }} />
                      </div>
                      <span className="font-['Inter:Medium'] font-medium text-[10px] text-[#434655] tracking-[0.4px] whitespace-nowrap">
                        {`Kekuatan: ${password.length >= 8 ? "Kuat" : password.length >= 5 ? "Sedang" : "Lemah"}`}
                      </span>
                    </div>
                  </div>

                  {/* Captcha */}
                  <button type="button" onClick={() => setCaptchaDone(p => !p)}
                    className="w-full flex items-center justify-between p-[13px] rounded-[12px] h-[66px] transition-all"
                    style={{ background: "rgba(248,250,252,0.7)", border: "1px solid rgba(226,232,240,0.9)", boxShadow: "0px_2px_8px_-2px_rgba(15,23,42,0.05)" }}>
                    <div className="flex items-center gap-0">
                      <div className="w-5 h-5 rounded-[4px] border flex items-center justify-center transition-all shrink-0 mr-3"
                        style={captchaDone ? { borderColor: "#2563eb", background: "#2563eb", borderWidth: 2 } : { borderColor: "#cbd5e1", background: "white", borderWidth: 1 }}>
                        {captchaDone && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                      </div>
                      <div>
                        <p className="font-['Plus_Jakarta_Sans'] font-semibold text-[14px] text-[#334155] text-left leading-[16px]">Saya bukan robot</p>
                        <p className="font-['Plus_Jakarta_Sans'] font-normal text-[12px] text-[#94a3b8] text-left leading-[13.75px] mt-[2px]">Verifikasi pintar anti-bot</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center pl-[9px] border-l border-[rgba(226,232,240,0.6)] shrink-0">
                      <img src="/assets/a4b24.svg" alt="" />
                      <span className="font-['Plus_Jakarta_Sans'] font-bold text-[9px] text-[#64748b] tracking-[0.45px] uppercase mt-[2px]">TURNSTILE</span>
                    </div>
                  </button>
                </div>

                {/* Bottom section: Terms → Masuk link → Lanjut → atau → Google */}
                <div className="space-y-0 px-[22px] pb-[22px] pt-0">
                  {/* Terms */}
                  <button type="button" onClick={() => setAgreeTerms(p => !p)} className="w-full flex items-start gap-[10px] text-left pb-[8px] pt-[4px]">
                    <div className="w-4 h-4 mt-[2px] rounded-[4px] border flex items-center justify-center transition-all shrink-0"
                      style={agreeTerms ? { borderColor: "#2563eb", background: "#2563eb", borderWidth: 1 } : { borderColor: "#cbd5e1", background: "#f8fafc", borderWidth: 1 }}>
                      {agreeTerms && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                    </div>
                    <p className="font-['Plus_Jakarta_Sans'] font-normal text-[14px] text-[#64748b] leading-[17px]">
                      {`Saya telah membaca dan menyetujui `}<span className="font-['Plus_Jakarta_Sans'] font-medium text-[#2563eb]">{`Syarat & Ketentuan`}</span>{` serta `}<span className="font-['Plus_Jakarta_Sans'] font-medium text-[#2563eb]">Kebijakan Privasi</span>{` Alerin.`}
                    </p>
                  </button>
                  {/* Sudah punya akun */}
                  <div className="flex items-center justify-center gap-[2px] py-[10px]">
                    <span className="font-['Plus_Jakarta_Sans'] font-normal text-[14px] text-[#64748b] leading-[20px]">Sudah punya akun Alerin?</span>
                    <button onClick={() => setShowLogin(true)} className="font-['Plus_Jakarta_Sans'] font-bold text-[14px] text-[#2563eb] leading-[20px] ml-[2px]">Masuk</button>
                  </div>
                  {/* Lanjut */}
                  <button
                    disabled={!canProceed}
                    onClick={() => setShowEmailVerify(true)}
                    className="w-full flex items-center justify-center gap-2 py-[14px] rounded-[12px] text-white font-['Inter'] font-bold text-[16px] leading-[24px] transition-all disabled:opacity-40 active:scale-[0.98]"
                    style={{ background: "linear-gradient(90deg,#2563eb,#1d4ed8)", boxShadow: canProceed ? "0px 4px 6px -1px rgba(59,130,246,0.25),0px 2px 4px -2px rgba(59,130,246,0.25)" : "none" }}>
                    Lanjut
                    <img src="/assets/cec1a.svg" alt="" />
                  </button>
                  {/* atau divider */}
                  <div className="relative flex items-center justify-center py-[10px]">
                    <div className="flex-1 border-t border-[#e2e8f0]" />
                    <div className="absolute bg-white px-3">
                      <span className="font-['Plus_Jakarta_Sans:Medium'] font-medium text-[12px] text-[#94a3b8] tracking-[0.3px]">Atau Melalui</span>
                    </div>
                  </div>
                  {/* Google */}
                  <button className="w-full flex items-center justify-center gap-3 py-[12px] rounded-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1b1b1c] text-[14px] leading-[21px] transition-all active:scale-[0.98]"
                    style={{ background: "#f6f6f8" }}>
                    <img src="/assets/676c7.svg" alt="" />
                    Daftar dengan Google
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Jenjang */}
          {step === 2 && (
            <>
              <PintarlyMascotBubble pre="" bold="Pilih Jenjang Akademikmu" />
              <div className="space-y-3 sm:space-y-[14px]">
                <RadioCard selected={jenjang === "S1"} onClick={() => pickAndAdvance(setJenjang, "S1")} icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>} label="S1 Sarjana/D4 Diploma" sublabel="Program Sarjana, Diploma, atau Terapan" />
                <RadioCard selected={jenjang === "S2"} onClick={() => pickAndAdvance(setJenjang, "S2")} icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>} label="S2 Magister" sublabel="Program Pascasarjana"/>
                <RadioCard selected={jenjang === "S3"} onClick={() => pickAndAdvance(setJenjang, "S3")} icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>} label="S3 Doktor" sublabel="Program Doktoral"/>
              </div>
            </>
          )}

          {/* Step 4: Jurusan */}
          {step === 4 && (() => {
            const ALL_PRODI = [
              "Manajemen","Ilmu Hukum","Akuntansi","Psikologi","Ilmu Komunikasi","Teknik Informatika",
              "Sistem Informasi","PGSD","Administrasi Negara","Teknik Sipil","Teknik Elektro","Teknik Mesin",
              "Teknik Kimia","Teknik Industri","Kedokteran","Keperawatan","Farmasi","Kesehatan Masyarakat",
              "Gizi","Kebidanan","Pendidikan Matematika","Pendidikan Bahasa Indonesia","Pendidikan Bahasa Inggris",
              "Pendidikan IPA","Pendidikan IPS","Pendidikan Jasmani","Bimbingan Konseling","Ekonomi Pembangunan",
              "Ekonomi Islam","Perbankan Syariah","Hubungan Internasional","Ilmu Politik","Sosiologi","Antropologi",
              "Sejarah","Sastra Indonesia","Sastra Inggris","Sastra Jepang","Sastra Arab","Arsitektur",
              "Perencanaan Wilayah dan Kota","Desain Komunikasi Visual (DKV)","Desain Produk","Seni Rupa",
              "Musik","Ilmu Perpustakaan","Administrasi Bisnis","Administrasi Publik","Kriminologi",
              "Biologi","Kimia","Fisika","Matematika","Statistika","Agribisnis","Agroteknologi",
              "Peternakan","Perikanan","Kehutanan","Ilmu Kelautan","Komunikasi Penyiaran Islam",
              "Hukum Ekonomi Syariah","Perbankan","Keuangan","Bisnis Digital","Informatika","Data Science",
              "Kecerdasan Buatan","Cyber Security","Teknik Komputer","Multimedia","Animasi",
            ];
            const POPULAR_PRODI = ["Manajemen","Ilmu Hukum","Akuntansi","Psikologi","Ilmu Komunikasi","Teknik Informatika","Sistem Informasi","PGSD","Administrasi Negara","Teknik Sipil"];
            const prodiFiltered = prodiSearch.trim()
              ? ALL_PRODI.filter(u => u.toLowerCase().includes(prodiSearch.toLowerCase()))
              : POPULAR_PRODI;
            const hasNoResult = prodiSearch.trim().length > 0 && prodiFiltered.length === 0;
            const showDropdown = prodiOpen;
            return (
              <>
                <PintarlyMascotBubble pre="Jurusan kuliahmu" bold="apa?" />

                <div className="bg-white rounded-[24px] w-full drop-shadow-[0px_8px_15px_rgba(0,0,0,0.04)]" style={{ border: "1px solid #f1f5f9" }}>
                  <div className="flex flex-col gap-5 p-5">

                    {/* Jurusan search with dropdown */}
                    <div className="flex flex-col gap-2">
                      <div className="relative">
                        {/* Input */}
                        <div className="flex items-center w-full px-4 py-3.5 rounded-[16px] transition-all"
                          style={{ background: "#fff", border: showDropdown ? "2px solid #3b82f6" : "2px solid #e5e7eb", boxShadow: showDropdown ? "0 0 0 3px rgba(59,130,246,0.12)" : "none" }}>
                          <input
                            value={prodiSearch}
                            onChange={e => { setProdiSearch(e.target.value); setProdiOpen(true); }}
                            onFocus={() => setProdiOpen(true)}
                            onBlur={() => setTimeout(() => setProdiOpen(false), 150)}
                            placeholder="Ketik jurusan kuliahmu di sini"
                            className="flex-1 text-[14px] text-[#111827] outline-none bg-transparent placeholder:text-[#9ca3af]"
                          />
                          <button onMouseDown={e => { e.preventDefault(); setProdiOpen(p => !p); }} className="shrink-0 ml-2 text-[#9ca3af] transition-all">
                            {showDropdown
                              ? <svg width="14" height="8" viewBox="0 0 14 8" fill="none"><path d="M1 1L7 7L13 1" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/></svg>
                              : <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/></svg>
                            }
                          </button>
                        </div>

                        {/* Dropdown */}
                        {showDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-[16px] overflow-hidden z-20"
                            style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9" }}>
                            {!hasNoResult ? (
                              <div className="max-h-[240px] overflow-y-auto">
                                {prodiFiltered.map((u, i) => (
                                  <button key={u}
                                    onMouseDown={() => { setProdi(u); setProdiSearch(""); setProdiOpen(false); }}
                                    className="w-full text-left px-5 py-3.5 transition-all active:bg-[#eff6ff]"
                                    style={{ background: i === 0 && prodiSearch.trim() ? "#f8faff" : "#fff", borderBottom: i < prodiFiltered.length - 1 ? "1px solid #f8faff" : "none" }}>
                                    <p className="text-[14px] font-semibold text-[#111827]">{u}</p>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-col">
                                <div className="border-t border-[#f1f5f9]">
                                  <button
                                    onMouseDown={() => { setProdi(prodiSearch); setProdiSearch(""); setProdiOpen(false); }}
                                    className="w-full flex items-center gap-3 px-5 py-4 transition-all active:bg-[#eff6ff]">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "#dbeafe" }}>
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    </div>
                                    <div className="text-left">
                                      <p className="text-[12px] text-[#6b7280]">Tetap gunakan input manual?</p>
                                      <p className="text-[14px] font-bold text-[#111827]">"{prodiSearch}"</p>
                                    </div>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Selected prodi display from search */}
                      {prodi && !showDropdown && (
                        <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-[14px]" style={{ background: "rgba(239,246,255,0.8)", border: "1px solid #bfdbfe" }}>
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0" style={{ background: "#2563eb" }}>
                              <svg width="12" height="10" viewBox="0 0 12 9" fill="none"><path d="M1 4.5L4.2 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                            <p className="text-[13px] sm:text-[14px] font-semibold text-[#111827] truncate">{prodi}</p>
                          </div>
                          <button onClick={() => setProdi("")} className="text-[11px] font-bold shrink-0" style={{ color: "#2563eb" }}>Ubah</button>
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-[#f0f0f0]"/>
                      <p className="text-[10px] font-bold tracking-[0.55px] uppercase text-[#9ca3af] whitespace-nowrap">Pilihan Populer</p>
                      <div className="flex-1 h-px bg-[#f0f0f0]"/>
                    </div>

                    {/* Popular prodi pills */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {POPULAR_PRODI.map(p => {
                        const isActive = prodi === p;
                        return (
                          <button key={p}
                            onClick={() => setProdi(isActive ? "" : p)}
                            className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all active:scale-95"
                            style={isActive
                              ? { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }
                              : { background: "#f6f6f8", color: "#374151", border: "1px solid transparent" }}>
                            {isActive && <svg width="11" height="8" viewBox="0 0 12 9" fill="none"><path d="M1 4.5L4.2 8L11 1" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            {p}
                          </button>
                        );
                      })}
                    </div>

                  </div>
                </div>
              </>
            );
          })()}

          {/* Step 5: Semester */}
          {step === 5 && (() => {
            const semNums: string[] = ["Semester 1","Semester 2","Semester 3","Semester 4","Semester 5","Semester 6","Semester 7","Semester 8","Semester 8+"];
            return (
              <>
                <PintarlyMascotBubble
                  pre="Sedang di"
                  bold="semester berapa?"
                />


                {/* 3-column grid */}
                <div className="w-full grid grid-cols-3 gap-2 sm:gap-[10px]">
                  {semNums.map((key) => {
                    const on = semester === key;
                    return (
                      <button key={key} onClick={() => pickAndAdvance(setSemester, key)}
                        className="relative flex items-center justify-center rounded-[12px] sm:rounded-[16px] transition-all active:scale-[0.95] reg-grid-card h-[56px] sm:h-[72px]"
                        style={{
                          background: on ? "#eff6ff" : "#ffffff",
                          border: on ? "2px solid #2563eb" : "1.5px solid #e2e8f0",
                          boxShadow: on ? "0 4px 16px rgba(37,99,235,0.14)" : "0 1px 4px rgba(0,0,0,0.05)",
                        }}>
                        <span className="text-[13px] sm:text-[15px] font-extrabold leading-none text-center px-1" style={{ color: on ? "#2563eb" : "#334155" }}>{key}</span>
                        {on && (
                          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center" style={{ background: "#2563eb" }}>
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            );
          })()}

          {/* Step 3: Kampus */}
          {step === 3 && (() => {
            const ALL_UNIVERSITIES = [
              "Universitas Indonesia (UI)","Universitas Gadjah Mada (UGM)","Institut Teknologi Bandung (ITB)",
              "Universitas Brawijaya (UB)","Universitas Diponegoro (UNDIP)","Universitas Airlangga (UNAIR)",
              "Institut Pertanian Bogor (IPB)","Universitas Padjadjaran (UNPAD)","Universitas Hasanuddin (UNHAS)",
              "Universitas Sebelas Maret (UNS)","Institut Teknologi Sepuluh Nopember (ITS)","Universitas Negeri Jakarta (UNJ)",
              "Universitas Negeri Yogyakarta (UNY)","Universitas Pendidikan Indonesia (UPI)","Universitas Negeri Malang (UM)",
              "Universitas Negeri Semarang (UNNES)","Universitas Negeri Surabaya (UNESA)","Universitas Lampung (UNILA)",
              "Universitas Sriwijaya (UNSRI)","Universitas Sumatera Utara (USU)","Universitas Andalas (UNAND)",
              "Universitas Muhammadiyah Yogyakarta (UMY)","Universitas Islam Indonesia (UII)","Universitas Ahmad Dahlan (UAD)",
              "Universitas Muhammadiyah Malang (UMM)","Universitas Islam Negeri Jakarta (UIN Jakarta)",
              "Universitas Islam Negeri Sunan Kalijaga (UIN Yogyakarta)","Universitas Islam Negeri Malang (UIN Malang)",
              "Universitas Bina Nusantara (BINUS)","Universitas Trisakti","Universitas Mercu Buana","Universitas Tarumanagara",
              "Universitas Atma Jaya Jakarta","Universitas Pelita Harapan (UPH)","Universitas Telkom",
              "Universitas Gunadarma","Universitas Dian Nuswantoro (UDINUS)","Universitas Komputer Indonesia (UNIKOM)",
              "Universitas Pasundan (UNPAS)","Universitas Jenderal Soedirman (UNSOED)","Universitas Surabaya (UBAYA)",
              "Universitas Kristen Petra","Universitas Ciputra","Universitas Esa Unggul","Universitas Pancasila",
              "Universitas Nasional (UNAS)","Universitas Paramadina","Universitas Budi Luhur",
              "Universitas Atma Jaya Yogyakarta","Universitas Sanata Dharma","Universitas Pembangunan Nasional (UPN)",
              "Universitas Muhammadiyah Surakarta (UMS)","Universitas Muhammadiyah Jakarta (UMJ)",
              "Universitas Terbuka (UT)","Universitas Pamulang (UNPAM)","Universitas BSI",
            ];
            const POPULAR_UNI = ["UI","UGM","ITB","UNAIR","IPB","ITS","UNPAD","UB","BINUS","TELKOM"];
            const POPULAR_UNI_FULL: Record<string,string> = {
              "UI":"Universitas Indonesia (UI)","UGM":"Universitas Gadjah Mada (UGM)","ITB":"Institut Teknologi Bandung (ITB)",
              "UNAIR":"Universitas Airlangga (UNAIR)","IPB":"Institut Pertanian Bogor (IPB)","ITS":"Institut Teknologi Sepuluh Nopember (ITS)",
              "UNPAD":"Universitas Padjadjaran (UNPAD)","UB":"Universitas Brawijaya (UB)","BINUS":"Universitas Bina Nusantara (BINUS)",
              "TELKOM":"TELKOM","UT":"Universitas Terbuka (UT)","Unpam":"Universitas Pamulang (UNPAM)",
              "UIN Jakarta":"Universitas Islam Negeri Jakarta (UIN Jakarta)","UNJ":"Universitas Negeri Jakarta (UNJ)",
            };
            const POPULAR_UNI_LIST = ["Universitas Indonesia (UI)","Universitas Gadjah Mada (UGM)","Institut Teknologi Bandung (ITB)","Universitas Airlangga (UNAIR)","Institut Pertanian Bogor (IPB)","Institut Teknologi Sepuluh Nopember (ITS)","Universitas Padjadjaran (UNPAD)","Universitas Brawijaya (UB)","Universitas Bina Nusantara (BINUS)","Universitas Telkom"];
            const uniFiltered = uniSearch.trim()
              ? ALL_UNIVERSITIES.filter(u => u.toLowerCase().includes(uniSearch.toLowerCase()))
              : POPULAR_UNI_LIST;
            const hasNoResult = uniSearch.trim().length > 0 && uniFiltered.length === 0;
            const showUniDropdown = uniOpen;
            return (
              <>
                <PintarlyMascotBubble pre="Kamu" bold="kuliah di mana?" />

                <div className="bg-white rounded-[24px] w-full drop-shadow-[0px_8px_15px_rgba(0,0,0,0.04)]" style={{ border: "1px solid #f1f5f9" }}>
                  <div className="flex flex-col gap-5 p-5">

                    {/* University search */}
                    <div className="flex flex-col gap-2">
                      <div className="relative">
                        <div className="flex items-center w-full px-4 py-3.5 rounded-[16px] transition-all"
                          style={{ background: "#fff", border: showUniDropdown ? "2px solid #2563eb" : "2px solid #e5e7eb", boxShadow: showUniDropdown ? "0 0 0 3px rgba(37,99,235,0.12)" : "none" }}>
                          <svg className="shrink-0 mr-3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                          <input
                            value={uniSearch}
                            onChange={e => { setUniSearch(e.target.value); setUniOpen(true); }}
                            onFocus={() => setUniOpen(true)}
                            onBlur={() => setTimeout(() => setUniOpen(false), 150)}
                            placeholder="Ketik nama kampusmu di sini"
                            className="flex-1 text-[14px] text-[#111827] outline-none bg-transparent placeholder:text-[#9ca3af]"
                          />
                          <button onMouseDown={e => { e.preventDefault(); setUniOpen(p => !p); }} className="shrink-0 ml-2 text-[#9ca3af]">
                            {showUniDropdown
                              ? <svg width="14" height="8" viewBox="0 0 14 8" fill="none"><path d="M1 1L7 7L13 1" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/></svg>
                              : <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/></svg>
                            }
                          </button>
                        </div>

                        {showUniDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-[16px] overflow-hidden z-20"
                            style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9" }}>
                            {!hasNoResult ? (
                              <div className="max-h-[240px] overflow-y-auto">
                                {uniFiltered.map((u, i) => (
                                  <button key={u}
                                    onMouseDown={() => { setUniversitas(u); setUniSearch(""); setUniOpen(false); }}
                                    className="w-full text-left px-5 py-3.5 transition-all active:bg-[#eff6ff]"
                                    style={{ background: i === 0 && uniSearch.trim() ? "#f8faff" : "#fff", borderBottom: i < uniFiltered.length - 1 ? "1px solid #f8faff" : "none" }}>
                                    <p className="text-[14px] font-semibold text-[#111827]">{u}</p>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-col">
                                <div className="border-t border-[#f1f5f9]">
                                  <button
                                    onMouseDown={() => { setUniversitas(uniSearch); setUniSearch(""); setUniOpen(false); }}
                                    className="w-full flex items-center gap-3 px-5 py-4 transition-all active:bg-[#eff6ff]">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "#dbeafe" }}>
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    </div>
                                    <div className="text-left">
                                      <p className="text-[12px] text-[#6b7280]">Tetap gunakan input manual?</p>
                                      <p className="text-[14px] font-bold text-[#111827]">"{uniSearch}"</p>
                                    </div>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Selected university chip */}
                      {universitas && !showUniDropdown && (
                        <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-[14px]" style={{ background: "rgba(239,246,255,0.8)", border: "1px solid #bfdbfe" }}>
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0" style={{ background: "#2563eb" }}>
                              <svg width="12" height="10" viewBox="0 0 12 9" fill="none"><path d="M1 4.5L4.2 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                            <p className="text-[13px] sm:text-[14px] font-semibold text-[#111827] truncate">{universitas}</p>
                          </div>
                          <button onClick={() => setUniversitas("")} className="text-[11px] font-bold shrink-0" style={{ color: "#2563eb" }}>Ubah</button>
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-[#f0f0f0]"/>
                      <p className="text-[10px] font-bold tracking-[0.55px] uppercase text-[#9ca3af] whitespace-nowrap">Pilihan Populer</p>
                      <div className="flex-1 h-px bg-[#f0f0f0]"/>
                    </div>

                    {/* Popular university pills */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {POPULAR_UNI.map(abbr => {
                        const full = POPULAR_UNI_FULL[abbr] ?? abbr;
                        const isActive = universitas === full;
                        return (
                          <button key={abbr}
                            onClick={() => setUniversitas(isActive ? "" : full)}
                            className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all active:scale-95"
                            style={isActive
                              ? { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }
                              : { background: "#f6f6f8", color: "#374151", border: "1px solid transparent" }}>
                            {isActive && <svg width="11" height="8" viewBox="0 0 12 9" fill="none"><path d="M1 4.5L4.2 8L11 1" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            {abbr}
                          </button>
                        );
                      })}
                    </div>

                  </div>
                </div>
              </>
            );
          })()}

          {/* Step 6: Apa yang bisa dibantu */}
          {step === 6 && (() => {
            const BANTUAN = [
              {
                id: "matakuliah",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
                label: "Mata Kuliah",
                badge: undefined,
                badgeColor: undefined,
                desc: "Konsep dasar hingga materi lanjutan",
                tags: ["Rangkuman Otomatis", "Kuis Adaptif", "Catatan Kuliah", "Tanya AI per Modul"],
              },
              {
                id: "tugas",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
                label: "Tugas Kuliah",
                badge: undefined,
                badgeColor: undefined,
                desc: "Makalah, Esai, Paper dan tugas lainnya",
                tags: ["Parafrase Akademik", "Sitasi Ilmiah APA/IEEE", "Cek Plagiarisme & Argumen"],
              },
              {
                id: "skripsi",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
                label: jenjang === "S2" ? "Tesis" : jenjang === "S3" ? "Disertasi" : "Skripsi",
                badge: undefined,
                badgeColor: "#d97706",
                desc: "Judul, Bab 1-5, olah data, revisi, sidang",
                tags: ["Review Metodologi Riset", "Olah Data (SPSS/Python)", "Simulasi Tanya Jawab Sidang"],
              },
            ];
            return (
              <>
                <PintarlyMascotBubble pre="Apa yang bisa" bold="Alerin bantu?" sub="Pilih yang ingin kamu pelajari bersama Alerin." />
                <div className="flex flex-col gap-3 w-full">
                  {BANTUAN.map(item => {
                    const isActive = bantuPilihan === item.id;
                    return (
                      <button key={item.id} onClick={() => pickAndAdvance(setBantuPilihan, item.id)}
                        className={`w-full bg-white rounded-[20px] text-left transition-all active:scale-[0.99] reg-bantuan-card`}
                        style={isActive
                          ? { border: "2px solid #2563eb", background: "#eff6ff", boxShadow: "0 4px 20px rgba(37,99,235,0.12)" }
                          : { border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                        <div className="px-5 py-4">
                          {/* Header row */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
                                style={{ background: "#eff6ff", color: "#374151" }}>
                                {item.icon}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-bold text-[17px] text-[#111827] leading-snug">{item.label}</p>
                                  {item.badge && (
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0"
                                      style={{ background: (item.badgeColor ?? "#2563eb") + "20", color: item.badgeColor ?? "#2563eb" }}>
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[13px] text-[#6b7280] leading-snug mt-0.5">{item.desc}</p>
                              </div>
                            </div>
                            {/* Radio indicator */}
                            <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0"
                              style={isActive ? { borderColor: "#2563eb", background: "#2563eb" } : { borderColor: "#d1d5db", background: "white" }}>
                              {isActive && <svg width="11" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4.5L4.2 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            );
          })()}

          {/* Step 7: Fase — conditional on bantuPilihan */}
          {step === 7 && bantuPilihan === "tugas" && (
            <>
              <PintarlyMascotBubble pre="Jenis tugas" bold="apa yang dikerjakan?" />
              <div className="space-y-[10px] sm:space-y-[14px]">
                {[
                  { id: "Makalah", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, desc: "Makalah akademik / laporan" },
                  { id: "Esai", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>, desc: "Esai argumentatif atau reflektif" },
                  { id: "Paper", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, desc: "Paper penelitian / karya ilmiah" },
                  { id: "Lainnya", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>, desc: "Jenis tugas lainnya" },
                ].map(o => (
                  <RadioCard key={o.id} selected={fase === o.id} onClick={() => {
                    if (o.id === "Lainnya") { setFase(o.id); }
                    else { pickAndAdvance(setFase, o.id); }
                  }} icon={o.icon} label={o.id} sublabel={o.desc}/>
                ))}
                {fase === "Lainnya" && (
                  <div className="pt-1">
                    <input
                      value={faseLainnya}
                      onChange={e => setFaseLainnya(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && faseLainnya.trim()) goNext(); }}
                      placeholder="Tuliskan jenis tugasmu..."
                      className="w-full px-4 py-3.5 rounded-[16px] text-[14px] text-[#111827] outline-none transition-all placeholder:text-[#9ca3af]"
                      style={{ background: "#f6f6f8", border: "2px solid #2563eb" }}
                      autoFocus
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {step === 7 && bantuPilihan === "matakuliah" && (
            <>
              <PintarlyMascotBubble pre="Sedang di" bold="tahap mana?" sub="Pilih fase belajarmu saat ini agar Alerin bisa bantu dengan tepat." />
              <div className="space-y-[10px] sm:space-y-[14px]">
                {[
                  { id: "Baru mau memulai", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>, desc: "Belum tahu harus mulai dari mana" },
                  { id: "Belajar materi", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>, desc: "Memahami materi, konsep, atau teori" },
                  { id: "Persiapan ujian", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, desc: "Belajar untuk kuis, UTS, atau UAS" },
                  { id: "Review materi", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>, desc: "Mempelajari kembali materi sebelumnya" },
                ].map(o => (
                  <RadioCard key={o.id} selected={fase === o.id} onClick={() => pickAndAdvance(setFase, o.id)} icon={o.icon} label={o.id} sublabel={o.desc}/>
                ))}
              </div>
            </>
          )}

          {step === 7 && bantuPilihan === "skripsi" && (() => {
            const SKRIPSI_OPTS_S1 = [
              { id: "Belum mulai", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>, desc: "Memahami alur dan persiapan skripsi" },
              { id: "Mencari topik/judul", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>, desc: "Membantu penyusunan topik/judul" },
              { id: "Penyusunan proposal", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, desc: "Menyusun Bab 1 sampai Bab 3" },
              { id: "Persiapan sempro", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>, desc: "Mempelajari materi untuk sempro" },
              { id: "Pengumpulan data", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/></svg>, desc: "Riset lapangan atau analisis data" },
              { id: "Penyusunan bab akhir", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>, desc: "Menyusun Bab 4 hingga selesai" },
              { id: "Review dan revisi", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>, desc: "Mengoreksi dan memperbaiki keseluruhan skripsi" },
              { id: "Persiapan sidang", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, desc: "Mempelajari materi untuk sidang skripsi" },
              { id: "Progres terhenti", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, desc: "Bingung menentukan langkah selanjutnya" },
            ];
            const SKRIPSI_OPTS_S2 = [
              { id: "Belum mulai", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>, desc: "Memahami alur dan persiapan Tesis" },
              { id: "Menentukan fokus penelitian", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>, desc: "Menentukan masalah, fokus, dan arah penelitian" },
              { id: "Kualifikasi/Komprehensif", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>, desc: "Menyiapkan rancangan penelitian" },
              { id: "Menyusun proposal", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, desc: "Menyusun dan menyempurnakan rancangan penelitian" },
              { id: "Persiapan sempro", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, desc: "Mempelajari materi untuk seminar proposal" },
              { id: "Persiapan penelitian", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, desc: "Menyiapkan instrumen, perizinan, etik, dan kebutuhan penelitian" },
              { id: "Pengumpulan data", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/></svg>, desc: "Melaksanakan penelitian dan mengumpulkan data" },
              { id: "Analisis data", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>, desc: "Mengolah dan menginterpretasikan data penelitian" },
              { id: "Hasil, pembahasan, dan kesimpulan", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>, desc: "Menyusun temuan hingga kesimpulan penelitian" },
              { id: "Seminar hasil", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, desc: "Mempresentasikan hasil dan menerima masukan" },
              { id: "Finalisasi tesis", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, desc: "Menyempurnakan keseluruhan Tesis" },
              { id: "Ujian tesis/Sidang Akhir", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, desc: "Mempelajari materi Tesis untuk Sidang" },
            ];
            const SKRIPSI_OPTS_S3 = [
              { id: "Belum mulai", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>, desc: "Memahami proses dan tahapan penelitian Disertasi" },
              { id: "Menentukan fokus penelitian", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>, desc: "Menentukan masalah, gap, kebaruan, dan arah penelitian" },
              { id: "Kualifikasi/Komprehensif", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>, desc: "Mempersiapkan kelayakan akademik dan rancangan penelitian" },
              { id: "Proposal Disertasi", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, desc: "Penyusunan dan penyempurnaan rancangan penelitian" },
              { id: "Persiapan penelitian", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, desc: "Menyiapkan instrumen, perizinan, etik, dan kebutuhan penelitian" },
              { id: "Pengumpulan data", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/></svg>, desc: "Menjalankan penelitian dan mengumpulkan data yang dibutuhkan" },
              { id: "Analisis dan interpretasi", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>, desc: "Mengolah data serta memahami makna temuan penelitian" },
              { id: "Hasil dan Pembahasan", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>, desc: "Menyusun temuan, pembahasan, dan kontribusi penelitian" },
              { id: "Finalisasi disertasi", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, desc: "Meninjau dan menyempurnakan keseluruhan naskah" },
              { id: "Ujian tertutup", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, desc: "Mempertahankan disertasi di hadapan tim penguji" },
              { id: "Promosi/Ujian Terbuka", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, desc: "Mempertahankan kontribusi disertasi pada tahap akhir" },
              { id: "Revisi akhir", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>, desc: "Menyelesaikan perbaikan dan keseluruhan Naskah Disertasi" },
            ];
            const SKRIPSI_OPTS = jenjang === "S3" ? SKRIPSI_OPTS_S3 : jenjang === "S2" ? SKRIPSI_OPTS_S2 : SKRIPSI_OPTS_S1;
            const jenjangLabel = jenjang === "S2" ? "Tesis" : jenjang === "S3" ? "Disertasi" : "Skripsi";
            return (
              <>
                <PintarlyMascotBubble pre="Sedang di" bold="tahap mana?" sub="Pilih fase belajarmu saat ini agar Alerin bisa bantu dengan tepat." />
                <div className="grid grid-cols-2 gap-3 w-full">
                  {SKRIPSI_OPTS.map(o => {
                    const isActive = fase === o.id;
                    return (
                      <button key={o.id} onClick={() => pickAndAdvance(setFase, o.id)}
                        className="bg-white rounded-[20px] p-4 text-left transition-all active:scale-[0.98] reg-grid-card"
                        style={isActive
                          ? { border: "2px solid #2563eb", background: "#eff6ff", boxShadow: "0 4px 16px rgba(37,99,235,0.12)" }
                          : { border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-xl shrink-0"
                            style={{ background: "#eff6ff", color: "#374151" }}>{o.icon}</div>
                          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                            style={isActive ? { borderColor: "#2563eb", background: "#2563eb" } : { borderColor: "#d1d5db", background: "white" }}>
                            {isActive && <svg width="9" height="7" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                        </div>
                        <p className="font-bold text-[13px] text-[#111827] leading-snug mb-1">{o.id}</p>
                        {o.desc && <p className="text-[11px] text-[#6b7280] leading-snug">{o.desc}</p>}
                      </button>
                    );
                  })}
                </div>
              </>
            );
          })()}

          {/* Step 8: Dibingungkan (tugas) | Target (matakuliah/skripsi) — combined with step 8 Target block below */}

          {/* Step 9: Target (tugas) | Kendala chips (matakuliah/skripsi) */}
           {step === 9 && (() => {
            // Tugas kuliah at step 9: show Target (Kapan deadline?)
            if (bantuPilihan === "tugas") {
              const tugasTargetOpts = [
                { id: "Deadline Besok", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, label: "Deadline Besok", sublabel: "Butuh bantuan segera" },
                { id: "Kurang dari 1 minggu", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, label: "Kurang dari 1 minggu", sublabel: "Maksimalkan sisa waktu pengerjaan" },
                { id: "Kurang dari 1 bulan", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label: "Kurang dari 1 bulan", sublabel: "Pakai waktu yang ada agar lebih matang" },
                { id: "Belum yakin", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, label: "Belum yakin", sublabel: "Belum tahu kapan targetnya" },
              ];
              return (
                <>
                  <PintarlyMascotBubble bold="Kapan target tugasmu selesai?" />
                  <div className="space-y-[10px] sm:space-y-[14px]">
                    {tugasTargetOpts.map(o => (
                      <RadioCard key={o.id} selected={target === o.id} onClick={() => pickAndAdvance(setTarget, o.id)}
                        icon={o.icon} label={o.label} sublabel={o.sublabel} />
                    ))}
                  </div>
                </>
              );
            }

            const MAX = 2;
            const OPTS_BY_BANTU: Record<string, { label: string; fitur: string; icon: React.ReactNode }[]> = {
              matakuliah: [
                { label: "Kesulitan memahami materi kuliah", fitur: "Mata Kuliah", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
                { label: "Kesulitan mencari referensi materi", fitur: "Mata Kuliah", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
                { label: "Kesulitan menentukan prioritas belajar", fitur: "Mata Kuliah", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg> },
                { label: "Kesulitan mempraktikkan teori mata kuliah", fitur: "Mata Kuliah", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
              ],
              skripsi: [
                { label: "Bingung memulai penelitian", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
                { label: "Belum memiliki topik/judul", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg> },
                { label: "Stuck dan tidak tahu harus menulis apa lagi", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
                { label: "Sulit menemukan referensi yang relevan", fitur: "Cari Jurnal", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
                { label: "Banyak revisi dari dosen", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
                { label: "Khawatir hasil plagiasi tinggi", fitur: "Cek Plagiasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
                { label: "Kesulitan mengolah atau menganalisis data", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg> },
                { label: "Penulisan akademik masih kurang tepat", fitur: "Parafrase", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
                { label: "Target penyelesaian terasa berat", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
              ],
              tesis: [
                { label: "Bingung memulai penelitian", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
                { label: "Belum memiliki topik/judul", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg> },
                { label: "Stuck dan tidak tahu harus menulis apa lagi", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
                { label: "Sulit menemukan referensi yang relevan", fitur: "Cari Jurnal", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
                { label: "Banyak revisi dari dosen", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
                { label: "Khawatir hasil plagiasi tinggi", fitur: "Cek Plagiasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
                { label: "Kesulitan mengolah atau menganalisis data", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg> },
                { label: "Penulisan akademik masih kurang tepat", fitur: "Parafrase", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
                { label: "Kurang yakin dengan draft final tesis", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
                { label: "Target penyelesaian terasa berat", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
              ],
              disertasi: [
                { label: "Bingung memulai penelitian", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
                { label: "Belum memiliki topik/judul", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg> },
                { label: "Persiapan Kualifikasi Disertasi masih belum diterima", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
                { label: "Stuck dan tidak tahu harus menulis apa lagi", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
                { label: "Sulit menemukan referensi yang relevan", fitur: "Cari Jurnal", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
                { label: "Banyak revisi dari dosen", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
                { label: "Khawatir hasil plagiasi tinggi", fitur: "Cek Plagiasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
                { label: "Kesulitan mengolah atau menganalisis data", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg> },
                { label: "Penulisan akademik masih kurang tepat", fitur: "Parafrase", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
                { label: "Kurang yakin dengan draft final Disertasi", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
                { label: "Target penyelesaian terasa berat", fitur: "Skripsi/Tesis/Disertasi", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
              ],
            };
            const opts = bantuPilihan === "skripsi" && jenjang === "S3"
              ? OPTS_BY_BANTU.disertasi
              : bantuPilihan === "skripsi" && jenjang === "S2"
              ? OPTS_BY_BANTU.tesis
              : OPTS_BY_BANTU[bantuPilihan] ?? OPTS_BY_BANTU.skripsi;
            const toggle = (label: string) => {
              setKendala(prev =>
                prev.includes(label)
                  ? prev.filter(k => k !== label)
                  : prev.length < MAX ? [...prev, label] : prev
              );
            };
            const bubbleData = {
              matakuliah: { pre: "Apa kendala utamamu", bold: "saat ini?", sub: "Pilih maksimal 2 agar Alerin bisa bantu kamu lebih tepat." },
              skripsi: { pre: "Apa kendala utamamu", bold: "saat ini?", sub: "Pilih maksimal 2 agar Alerin bisa bantu kamu lebih tepat." },
            }[bantuPilihan] ?? { pre: "Apa kendala utamamu", bold: "saat ini?", sub: "Pilih maksimal 2 agar Alerin bisa bantu kamu lebih tepat." };
            return (
              <>
                <PintarlyMascotBubble pre={bubbleData.pre} bold={bubbleData.bold} sub={bubbleData.sub} />
                <div className="flex flex-col gap-[10px] w-full rounded-[20px] p-5" style={{ background: "#ffffff", border: "2px solid #60a5fa" }}>
                  {opts.map(o => {
                    const on = kendala.includes(o.label);
                    const maxed = kendala.length >= MAX && !on;
                    return (
                      <button
                        key={o.label}
                        onClick={() => !maxed && toggle(o.label)}
                        className="w-full text-left transition-all active:scale-[0.97]"
                        style={{
                          padding: "10px 18px",
                          borderRadius: "12px",
                          fontSize: 14,
                          fontWeight: on ? 600 : 500,
                          lineHeight: "20px",
                          border: on ? "2px solid #2563eb" : "1.5px solid #d1d5db",
                          background: on ? "#2563eb" : "#fff",
                          color: on ? "#fff" : "#374151",
                          opacity: maxed ? 0.4 : 1,
                          boxShadow: on ? "0 2px 8px rgba(37,99,235,0.18)" : "0 1px 3px rgba(0,0,0,0.06)",
                          cursor: maxed ? "not-allowed" : "pointer",
                        }}>
                        {o.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[13px] text-[#6b7280]" style={{ marginTop: "17px", marginBottom: "17px" }}>Dipilih {kendala.length} dari {MAX}</p>
              </>
            );
          })()}

          {/* Step 8: Dibingungkan 2x2 (tugas) | Target (matakuliah/skripsi) */}
          {step === 8 && (() => {
            // Tugas kuliah: show "Bagian yang dibingungkan" 2x2 grid
            if (bantuPilihan === "tugas") {
              const TUGAS_OPTS = [
                { id: "Memahami tugas", desc: "Memahami apa yang harus dikerjakan", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
                { id: "Menyusun kerangka", desc: "Menentukan struktur dan isi tugas", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
                { id: "Mencari referensi", desc: "Menemukan sumber yang relevan", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
                { id: "Revisi tugas", desc: "Memperbaiki tugas sebelum dikumpulkan", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
              ];
              return (
                <>
                  <PintarlyMascotBubble pre="" bold="Sedang ditahap mana?" sub="Pilih fase belajarmu saat ini agar Alerin bisa bantu dengan tepat." />
                  <div className="grid grid-cols-2 gap-3 w-full">
                    {TUGAS_OPTS.map(o => {
                      const isActive = kendala.includes(o.id);
                      return (
                        <button key={o.id} onClick={() => { setKendala([o.id]); const tid = window.setTimeout(() => goNext(), 220); loadingTimers.current.push(tid); }}
                          className="bg-white rounded-[20px] p-4 text-left transition-all active:scale-[0.98] reg-grid-card"
                          style={isActive
                            ? { border: "2px solid #2563eb", background: "#eff6ff", boxShadow: "0 4px 16px rgba(37,99,235,0.12)" }
                            : { border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                              style={{ background: "#eff6ff", color: "#374151" }}>{o.icon}</div>
                            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                              style={isActive ? { borderColor: "#2563eb", background: "#2563eb" } : { borderColor: "#d1d5db", background: "white" }}>
                              {isActive && <svg width="9" height="7" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </div>
                          </div>
                          <p className="font-bold text-[13px] text-[#111827] leading-snug mb-1">{o.id}</p>
                          <p className="text-[11px] text-[#6b7280] leading-snug">{o.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </>
              );
            }
            // Matakuliah / Skripsi: show Target
            const cfgByBantu: Record<string, { pre: string; bold: string; sub: string; opts: { id: string; icon: React.ReactNode; label: string; sublabel: string }[] }> = {
              matakuliah: {
                pre: "", bold: "Apa targetmu saat ini?", sub: "",
                opts: [
                  { id: "Memahami materi", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>, label: "Memahami materi", sublabel: "Paham konsep dan materi kuliah" },
                  { id: "Mendapat nilai lebih baik", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, label: "Mendapat nilai lebih baik", sublabel: "Meningkatkan nilai tugas, ujian, atau IPK" },
                  { id: "Lulus semua mata kuliah", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>, label: "Lulus semua mata kuliah", sublabel: "Tidak ada mata kuliah yang tertinggal" },
                  { id: "Mengejar ketertinggalan", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>, label: "Mengejar ketertinggalan", sublabel: "Memprioritaskan mata kuliah yang mengulang" },
                ],
              },
              skripsi: {
                pre: "Kapan target", bold: jenjang === "S2" ? "Tesismu selesai?" : jenjang === "S3" ? "Disertasimu selesai?" : "Skripsimu selesai?", sub: "",
                opts: [
                  { id: "Bulan ini", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, label: "Bulan ini", sublabel: "Butuh bantuan segera" },
                  { id: "1–3 bulan", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label: "1-3 Bulan", sublabel: "Maksimalkan waktu pengerjaan" },
                  { id: "Lebih dari 3 bulan", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z"/><path d="M6.4 6.4L17.6 17.6"/><path d="M6 12s0-4 6-4 6 4 6 4"/></svg>, label: "Lebih dari 3 Bulan", sublabel: "Gunakan waktu yang ada untuk progres" },
                  { id: "Belum yakin", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, label: "Belum yakin", sublabel: "Belum tahu kapan targetnya" },
                ],
              },
            };
            const cfg = cfgByBantu[bantuPilihan] ?? cfgByBantu.skripsi;
            return (
              <>
                <PintarlyMascotBubble pre={cfg.pre} bold={cfg.bold} sub={cfg.sub} />
                <div className="space-y-[10px] sm:space-y-[14px]">
                  {cfg.opts.map(o => (
                    <RadioCard key={o.id} selected={target === o.id} onClick={() => pickAndAdvance(setTarget, o.id)}
                      icon={o.icon} label={o.label} sublabel={o.sublabel} />
                  ))}
                </div>
              </>
            );
          })()}

          {/* Step 10 (tugas only): Kendala chips */}
          {step === 10 && bantuPilihan === "tugas" && (() => {
            const MAX = 2;
            const tugasKendalaOpts = [
              { label: "Belum memahami instruksi tugas", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
              { label: "Bingung memulai dari bagian mana", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg> },
              { label: "Sulit mencari referensi yang sesuai", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
              { label: "Deadline tugas sudah sangat dekat", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
            ];
            const toggle = (label: string) => {
              setKendala(prev =>
                prev.includes(label) ? prev.filter(k => k !== label) : prev.length < MAX ? [...prev, label] : prev
              );
            };
            return (
              <>
                <PintarlyMascotBubble pre="Apa kendala utamamu" bold="saat ini?" sub="Pilih maksimal 2 agar Alerin bisa bantu kamu lebih tepat." />
                <div className="flex flex-col gap-[10px] w-full rounded-[20px] p-5" style={{ background: "#ffffff", border: "2px solid #60a5fa" }}>
                  {tugasKendalaOpts.map(o => {
                    const on = kendala.includes(o.label);
                    const maxed = kendala.length >= MAX && !on;
                    return (
                      <button key={o.label} onClick={() => !maxed && toggle(o.label)}
                        className="w-full text-left transition-all active:scale-[0.97]"
                        style={{ padding: "10px 18px", borderRadius: "12px", fontSize: 14, fontWeight: on ? 600 : 500, lineHeight: "20px", border: on ? "2px solid #2563eb" : "1.5px solid #d1d5db", background: on ? "#2563eb" : "#fff", color: on ? "#fff" : "#374151", opacity: maxed ? 0.4 : 1, boxShadow: on ? "0 2px 8px rgba(37,99,235,0.18)" : "0 1px 3px rgba(0,0,0,0.06)", cursor: maxed ? "not-allowed" : "pointer" }}>
                        {o.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[13px] text-[#6b7280]" style={{ marginTop: "17px", marginBottom: "17px" }}>Dipilih {kendala.length} dari {MAX}</p>
              </>
            );
          })()}

          {/* Step 10 (non-tugas) or Step 11 (tugas): Rekomendasi Fitur */}
          {(step === 10 && bantuPilihan !== "tugas" || step === 11 && bantuPilihan === "tugas") && (
            <>
              <PintarlyMascotBubble
                pre=""
                bold="Fitur yang sesuai dengan kebutuhanmu"
              />

              {/* DIREKOMENDASIKAN divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-[1.5px]" style={{ background: "linear-gradient(90deg, rgba(37,99,235,0.6), rgba(37,99,235,0.05))" }}/>
                <span style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 10, color: "#2563eb", letterSpacing: "2px", textTransform: "uppercase", whiteSpace: "nowrap" }}>Direkomendasikan</span>
                <div className="flex-1 h-[1.5px]" style={{ background: "linear-gradient(90deg, rgba(37,99,235,0.05), rgba(37,99,235,0.6))" }}/>
              </div>

              {/* Feature cards — two vertically stacked, matching Figma */}
              <div className="flex flex-col gap-3 w-full">

                {/* Card Fitur Mata Kuliah — shown for matakuliah or tugas */}
                {(bantuPilihan === "matakuliah" || bantuPilihan === "tugas") && (() => {
                  const sel = selectedFitur === "matakuliah";
                  return (
                    <div
                      onClick={() => setSelectedFitur(sel ? "" : "matakuliah")}
                      className="w-full relative overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
                      style={{
                        borderRadius: 14,
                        backgroundImage: "linear-gradient(-66.07deg, rgba(230,247,250,0.35) 5.77%, rgb(235,245,255) 36.07%, rgb(255,255,255) 66.37%, rgb(255,255,255) 92.35%)",
                        boxShadow: sel ? "0 0 0 2px #2563eb, 0px 4px 4px rgba(0,0,0,0.14)" : "0px 4px 4px rgba(0,0,0,0.14)",
                        minHeight: 140,
                      }}>
                      <div className="flex" style={{ height: "100%" }}>
                        {/* LEFT — title + desc + button */}
                        <div className="flex flex-col justify-between" style={{ flex: "1 1 0", minWidth: 0, paddingTop: 24, paddingBottom: 24, paddingLeft: 19, paddingRight: 19 }}>
                          <div>
                            <p style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 19, lineHeight: "24px", color: "#000", letterSpacing: "-0.45px", marginBottom: 6 }}>Fitur Mata Kuliah</p>
                            <p style={{ fontFamily: "Inter", fontWeight: 400, fontSize: 10.5, lineHeight: "14.5px", color: "rgba(84,84,84,0.95)" }}>Mata Kuliah: Membantu memahami materi perkuliahan, mempersiapkan ujian, serta mencapai target akademikmu</p>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); setSelectedFitur(sel ? "" : "matakuliah"); }}
                            className="transition-all active:opacity-80"
                            style={{
                              marginTop: 12,
                              alignSelf: "flex-start",
                              padding: "8px 18px",
                              borderRadius: 11,
                              border: "none",
                              cursor: "pointer",
                              background: "#2563eb",
                              boxShadow: "0px 5.5px 13.8px -2.75px rgba(0,133,255,0.42)",
                              fontFamily: "Inter",
                              fontWeight: 500,
                              fontSize: 11,
                              color: "#fff",
                              letterSpacing: "0.24px",
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}>
                            {sel ? (
                              <>
                                <svg width="12" height="10" viewBox="0 0 12 9" fill="none"><path d="M1 4.5L4.2 8L11 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                Sudah dipilih
                              </>
                            ) : "Pilih untuk digunakan"}
                          </button>
                        </div>

                        {/* RIGHT — blue panel with inner widget */}
                        <div style={{ width: 140, flexShrink: 0, background: "rgba(55,127,233,0.38)", borderRadius: "10px 14px 14px 10px", padding: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {/* Inner widget card */}
                          <div style={{ width: "100%", background: "#fff", borderRadius: 7.5, border: "0.47px solid rgba(241,245,249,0.9)", boxShadow: "0px 4.7px 11.7px -1.87px rgba(26,26,44,0.06), 0px 0.94px 2.81px -0.47px rgba(0,0,0,0.04)", overflow: "hidden", paddingBottom: 8 }}>
                            {/* Widget header */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 8px 5px", borderBottom: "0.47px solid #f1f5f9" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                                <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 7, color: "#2563eb" }}>+</span>
                                <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 6.5, color: "#1d1b27", letterSpacing: "-0.16px" }}>Mata Kuliah Alerin </span>
                              </div>
                              <div style={{ width: 9, height: 9, background: "#f1f5f9", borderRadius: 2.5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ width: 4.5, height: 4.5, background: "#cbd5e1", borderRadius: 1 }}/>
                              </div>
                            </div>
                            {/* Skeleton lines */}
                            <div style={{ padding: "7px 8px 0", display: "flex", flexDirection: "column", gap: 4.5 }}>
                              <div style={{ height: 6.5, borderRadius: 2.5, background: "#edf1f8", width: "80%" }}/>
                              <div style={{ height: 6.5, borderRadius: 2.5, background: "#edf1f8", width: "100%" }}/>
                              <div style={{ height: 6.5, borderRadius: 2.5, background: "#edf1f8", width: "60%" }}/>
                            </div>
                            {/* Button */}
                            <div style={{ position: "relative", margin: "5px 8px 0" }}>
                              <div style={{ background: "#2563eb", borderRadius: 5.5, textAlign: "center", boxShadow: "0px 4.7px 9.4px -1.4px #2563eb", position: "relative", fontWeight: 700, marginTop: 6, marginBottom: 6, height: 23, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 600, fontSize: 6.5, color: "#fff", paddingLeft: 7, paddingRight: 7 }}>Pelajari </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Card 1 — Fitur Parafrase (skripsi only) */}
                {bantuPilihan === "skripsi" && (() => {
                  const sel = selectedFitur === "parafrase";
                  return (
                    <div
                      onClick={() => setSelectedFitur(sel ? "" : "parafrase")}
                      className="w-full relative overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
                      style={{
                        borderRadius: 14,
                        backgroundImage: "linear-gradient(-66.07deg, rgba(230,247,250,0.35) 5.77%, rgb(235,245,255) 36.07%, rgb(255,255,255) 66.37%, rgb(255,255,255) 92.35%)",
                        boxShadow: sel ? "0 0 0 2px #2563eb, 0px 4px 4px rgba(0,0,0,0.14)" : "0px 4px 4px rgba(0,0,0,0.14)",
                        minHeight: 140,
                      }}>
                      <div className="flex" style={{ height: "100%" }}>
                        {/* LEFT — title + desc + button */}
                        <div className="flex flex-col justify-between" style={{ flex: "1 1 0", minWidth: 0, paddingTop: 24, paddingBottom: 24, paddingLeft: 19, paddingRight: 19 }}>
                          <div>
                            <p style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 19, lineHeight: "24px", color: "#000", letterSpacing: "-0.45px", marginBottom: 6 }}>Fitur Parafrase</p>
                            <p style={{ fontFamily: "Inter", fontWeight: 400, fontSize: 10.5, lineHeight: "14.5px", color: "rgba(84,84,84,0.95)" }}>Parafrase: Memeriksa kemiripan tulisan dengan sumber yang tersedia dan menunjukkan bagian yang perlu ditinjau atau diberi sitasi.</p>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); setSelectedFitur(sel ? "" : "parafrase"); }}
                            className="transition-all active:opacity-80"
                            style={{
                              marginTop: 12,
                              alignSelf: "flex-start",
                              padding: "8px 18px",
                              borderRadius: 11,
                              border: "none",
                              cursor: "pointer",
                              background: "#2563eb",
                              boxShadow: "0px 5.5px 13.8px -2.75px rgba(0,133,255,0.42)",
                              fontFamily: "Inter",
                              fontWeight: 500,
                              fontSize: 11,
                              color: "#fff",
                              letterSpacing: "0.24px",
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}>
                            {sel ? (
                              <>
                                <svg width="12" height="10" viewBox="0 0 12 9" fill="none"><path d="M1 4.5L4.2 8L11 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                Sudah dipilih
                              </>
                            ) : "Pilih untuk digunakan"}
                          </button>
                        </div>

                        {/* RIGHT — blue panel with inner widget */}
                        <div style={{ width: 140, flexShrink: 0, background: "rgba(55,127,233,0.38)", borderRadius: "10px 14px 14px 10px", padding: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {/* Inner widget card */}
                          <div style={{ width: "100%", background: "#fff", borderRadius: 7.5, border: "0.47px solid rgba(241,245,249,0.9)", boxShadow: "0px 4.7px 11.7px -1.87px rgba(26,26,44,0.06), 0px 0.94px 2.81px -0.47px rgba(0,0,0,0.04)", overflow: "hidden", paddingBottom: 8 }}>
                            {/* Widget header */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 8px 5px", borderBottom: "0.47px solid #f1f5f9" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                                <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 7, color: "#2563eb" }}>+</span>
                                <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 6.5, color: "#1d1b27", letterSpacing: "-0.16px" }}>Parafrase Alerin </span>
                              </div>
                              <div style={{ width: 9, height: 9, background: "#f1f5f9", borderRadius: 2.5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ width: 4.5, height: 4.5, background: "#cbd5e1", borderRadius: 1 }}/>
                              </div>
                            </div>
                            {/* Skeleton lines */}
                            <div style={{ padding: "7px 8px 0", display: "flex", flexDirection: "column", gap: 4.5 }}>
                              <div style={{ height: 6.5, borderRadius: 2.5, background: "#edf1f8", width: "80%" }}/>
                              <div style={{ height: 6.5, borderRadius: 2.5, background: "#edf1f8", width: "100%" }}/>
                              <div style={{ height: 6.5, borderRadius: 2.5, background: "#edf1f8", width: "60%" }}/>
                            </div>
                            {/* Perbaiki button + cursor */}
                            <div style={{ position: "relative", margin: "5px 8px 0" }}>
                              <div style={{ background: "#2563eb", borderRadius: 5.5, paddingTop: 0, paddingBottom: 0, textAlign: "center", boxShadow: "0px 4.7px 9.4px -1.4px #2563eb", position: "relative", fontWeight: 700, marginTop: 6, marginBottom: 6, height: 23, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 600, fontSize: 6.5, color: "#fff", marginTop: -18, marginRight: -1, marginBottom: -18, marginLeft: -1, paddingLeft: 7, paddingRight: 7 }}>Perbaiki </span>
                              </div>
                              <img src="/assets/66b22.svg" alt="" style={{ position: "absolute", right: -12, bottom: -12, width: 28, height: 28, pointerEvents: "none" }}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Card 2 — Cari Jurnal (skripsi only) */}
                {bantuPilihan === "skripsi" && (() => {
                  const sel = selectedFitur === "jurnal";
                  return (
                    <div
                      onClick={() => setSelectedFitur(sel ? "" : "jurnal")}
                      className="w-full relative overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
                      style={{
                        borderRadius: 14,
                        backgroundImage: "linear-gradient(-66.07deg, rgba(230,247,250,0.35) 5.77%, rgb(235,245,255) 36.07%, rgb(255,255,255) 66.37%, rgb(255,255,255) 92.35%)",
                        boxShadow: sel ? "0 0 0 2px #d34442, 0px 4px 4px rgba(0,0,0,0.14)" : "0px 4px 4px rgba(0,0,0,0.14)",
                        minHeight: 140,
                      }}>
                      <div className="flex" style={{ height: "100%" }}>
                        {/* LEFT — title + desc + button */}
                        <div className="flex flex-col justify-between" style={{ flex: "1 1 0", minWidth: 0, paddingTop: 26, paddingBottom: 26, paddingLeft: 22, paddingRight: 22 }}>
                          <div>
                            <p style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 19, lineHeight: "24px", color: "#000", letterSpacing: "-0.45px", marginBottom: 6 }}>Cari Jurnal</p>
                            <p style={{ fontFamily: "Inter", fontWeight: 400, fontSize: 10.5, lineHeight: "14.5px", color: "rgba(84,84,84,0.95)" }}>Cari jurnal: Membantu menemukan referensi akademik terpercaya dari berbagai sumber jurnal yang relevan dengan topik penelitian</p>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); setSelectedFitur(sel ? "" : "jurnal"); }}
                            className="transition-all active:opacity-80"
                            style={{
                              marginTop: 12,
                              alignSelf: "flex-start",
                              padding: "8px 18px",
                              borderRadius: 11,
                              border: "none",
                              cursor: "pointer",
                              background: "#d34442",
                              boxShadow: "0px 5.5px 13.8px -2.75px rgba(0,133,255,0.42)",
                              fontFamily: "Inter",
                              fontWeight: 500,
                              fontSize: 11,
                              color: "#fff",
                              letterSpacing: "0.24px",
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}>
                            {sel ? (
                              <>
                                <svg width="12" height="10" viewBox="0 0 12 9" fill="none"><path d="M1 4.5L4.2 8L11 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                Sudah dipilih
                              </>
                            ) : "Pilih untuk digunakan"}
                          </button>
                        </div>

                        {/* RIGHT — red panel "kotak di dalam kotak" */}
                        <div style={{ width: 140, flexShrink: 0, background: "rgba(211,68,66,0.57)", borderRadius: "10px 14px 14px 10px", padding: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {/* Inner illustration box — same structure as Parafrase inner widget */}
                          <div style={{ width: "100%", borderRadius: 8, overflow: "hidden", position: "relative", minHeight: 116 }}>
                            {/* Lozenge decorative rows */}
                            <div style={{ position: "absolute", top: 0, right: 0, left: 0, display: "flex", flexDirection: "column", rowGap: 13, columnGap: 5, padding: "8px 0 0 8px", opacity: 0.34 }}>
                              <div style={{ display: "flex", gap: 4 }}>
                                <div style={{ height: 13, borderRadius: 9999, background: "rgba(226,232,240,0.5)", width: 34 }}/>
                                <div style={{ height: 13, borderRadius: 9999, background: "rgba(226,232,240,0.6)", width: 52 }}/>
                                <div style={{ height: 15, borderRadius: 9999, background: "#e2e8f0", width: 60 }}/>
                              </div>
                              <div style={{ display: "flex", gap: 4, paddingRight: 8 }}>
                                <div style={{ height: 13, borderRadius: 9999, background: "rgba(226,232,240,0.4)", width: 43 }}/>
                                <div style={{ height: 15, borderRadius: 9999, background: "rgba(109,109,109,0.06)", width: 60 }}/>
                                <div style={{ height: 13, borderRadius: 9999, background: "rgba(226,232,240,0.6)", width: 34 }}/>
                              </div>
                              <div style={{ display: "flex", gap: 4 }}>
                                <div style={{ height: 13, borderRadius: 9999, background: "rgba(226,232,240,0.45)", width: 52 }}/>
                                <div style={{ height: 15, borderRadius: 9999, background: "#e2e8f0", width: 68 }}/>
                              </div>
                            </div>
                            {/* Patent papers illustration — contained inside the box */}
                            <img src="/assets/f4f63.png" alt="Cari Jurnal" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", marginTop: 2, marginRight: 6, marginBottom: 2, marginLeft: 6 }}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      {step > 0 && (
        <div className={`relative z-10 px-4 sm:px-5 pb-3 sm:pb-4 shrink-0 ${step === TOTAL ? "pt-1" : "pt-2"}`}>
          <div className="max-w-md mx-auto flex flex-col items-center gap-1.5 sm:gap-2">
            {AUTO_STEPS.includes(step) ? (
              <p className="text-[12px] text-[#9ca3af] text-center leading-[16px] py-1">
                Pilihan ini dapat diubah sewaktu-waktu melalui profil saya
              </p>
            ) : (
              <>
                {step === TOTAL ? (
                  /* Simple Lanjut button for feature selection */
                  <button
                    disabled={!canProceed}
                    onClick={() => {
                      startFeatureLoading();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 sm:py-[14px] rounded-[12px] sm:rounded-[16px] text-white font-bold text-[15px] sm:text-[16px] transition-all disabled:opacity-40 active:scale-[0.98]"
                    style={{ background: canProceed ? "#2563eb" : "rgba(37,99,235,0.4)", boxShadow: canProceed ? "0px 4px 7px rgba(37,99,235,0.38)" : "none", cursor: canProceed ? "pointer" : "not-allowed" }}>
                    Lanjut
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                ) : (
                  !(step === 7 && !(fase === "Lainnya" && faseLainnya.trim())) && step !== 1 && !(step === 9 && bantuPilihan === "tugas") && !((step === 9 && bantuPilihan !== "tugas" || step === 10 && bantuPilihan === "tugas") && kendala.length === 0) && (
                    <button
                      disabled={!canProceed}
                      onClick={step === 1 ? () => setShowEmailVerify(true) : goNext}
                      className="w-full flex items-center justify-center gap-2 py-3 sm:py-[14px] rounded-[12px] sm:rounded-[16px] text-white font-bold text-[15px] sm:text-[16px] transition-all disabled:opacity-40 active:scale-[0.98]"
                      style={{ background: "#2563eb", boxShadow: canProceed ? "0px 4px 7px rgba(37,99,235,0.38)" : "none" }}>
                    Lanjut
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                  )
                )}
                {(step === 3 || step === 4) && (
                  <button onClick={goNext}
                    className="text-[13px] font-semibold text-[#94a3b8] hover:text-[#64748b] transition-colors py-1 active:scale-95">
                    Lewati
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bubbleEnter { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
        @keyframes bubblePop { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
        @keyframes mascotBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes welcomeCardIn { from{opacity:0;transform:translateY(32px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes welcomeMascotBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes welcomeGlow { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
        @keyframes welcomeTextUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes welcomeShimmer { 0%{transform:translateX(-100%)} 30%,100%{transform:translateX(200%)} }

        /* Register card hover effects */
        .reg-card:not([style*="border: 2px"]):hover {
          border: 2px solid #93c5fd !important;
          background: #f0f7ff !important;
          box-shadow: 0 4px 18px rgba(37,99,235,0.10) !important;
          transform: translateY(-1px);
        }
        .reg-pill:not(.reg-pill-sel):hover {
          background: #dbeafe !important;
          border-color: #93c5fd !important;
          color: #1d4ed8 !important;
          box-shadow: 0 3px 12px rgba(37,99,235,0.13) !important;
        }
        .reg-grid-card:not([style*="border: 2px"]):hover {
          border: 2px solid #93c5fd !important;
          background: #f0f7ff !important;
          box-shadow: 0 4px 16px rgba(37,99,235,0.12) !important;
          transform: translateY(-1px);
        }
        .reg-bantuan-card:not([style*="border: 2px"]):hover {
          border: 2px solid #93c5fd !important;
          background: #f0f7ff !important;
          box-shadow: 0 4px 20px rgba(37,99,235,0.12) !important;
        }
      `}</style>
    </div>
  );
}

function ProfilTab({ onTab, onRegister }: { onTab: (t: NavTab) => void; onRegister: () => void }) {
  type ProfileView = "main" | "profile-photo" | "memory-summary" | "edit-profile" | "manage-data" | "account-security" | "password" | "package" | "stage-detail" | "reset-plan" | "notifications" | "privacy-policy" | "terms" | "privacy" | "about";
  type ProfileSubTab = "profil" | "progres" | "personalisasi" | "umum";
  const registrationProfile = (() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(window.localStorage.getItem("alerin-registration-profile") || "{}") as Partial<{
        nama: string;
        universitas: string;
        jenjang: string;
        prodi: string;
        semester: string;
        bantuan: string;
        fase: string;
      }>;
    } catch {
      return {};
    }
  })();
  const accountEmail = "rakaaditya@gmail.com";
  const [subTab, setSubTab] = useState<ProfileSubTab>("profil");
  const subTabListRef = useRef<HTMLDivElement>(null);
  const subTabButtonRefs = useRef<Record<ProfileSubTab, HTMLButtonElement | null>>({
    profil: null,
    progres: null,
    personalisasi: null,
    umum: null,
  });
  const [subTabIndicator, setSubTabIndicator] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [profileView, setProfileView] = useState<ProfileView>("main");
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeBillingCycle, setUpgradeBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [profilePhoto, setProfilePhoto] = useState(() => (
    typeof window !== "undefined" ? window.localStorage.getItem("alerin-profile-photo") || "" : ""
  ));
  const [draftProfilePhoto, setDraftProfilePhoto] = useState(profilePhoto);
  const [selectedStage, setSelectedStage] = useState("Revisi Bab III & instrumen");
  const [notice, setNotice] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyPersonalization, setPrivacyPersonalization] = useState(true);
  const [knownItems, setKnownItems] = useState(["Manajemen", "Universitas Indonesia", "Semester 6", "Skripsi (Bab 2)", "Target Sidang Nov 2026", "Preferensi: Contoh + latihan"]);
  const [draftKnownItems, setDraftKnownItems] = useState<string[]>(knownItems);
  const [manualKnownItem, setManualKnownItem] = useState("");
  const [manageDataError, setManageDataError] = useState("");
  const [whatsapp, setWhatsapp] = useState("-");
  const [draftWhatsapp, setDraftWhatsapp] = useState(whatsapp);
  const [currentAccountPassword, setCurrentAccountPassword] = useState("");
  const [newAccountPassword, setNewAccountPassword] = useState("");
  const [confirmAccountPassword, setConfirmAccountPassword] = useState("");
  const [accountSecurityError, setAccountSecurityError] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState(accountEmail);
  const [languageMode, setLanguageMode] = useState(() => (
    typeof window !== "undefined" ? window.localStorage.getItem("alerin-language") || "id" : "id"
  ));
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [communicationStyle, setCommunicationStyle] = useState(() => (
    typeof window !== "undefined" ? window.localStorage.getItem("alerin-communication-style") || "Rapi dan Presisi" : "Rapi dan Presisi"
  ));
  const [nama, setNama] = useState(registrationProfile.nama || "Raka Aditya");
  const [universitas, setUniversitas] = useState(registrationProfile.universitas || "Universitas Indonesia");
  const [jenjang, setJenjang] = useState(registrationProfile.jenjang || "S1 (Sarjana)");
  const [prodi, setProdi] = useState(registrationProfile.prodi || "Manajemen");
  const [semester, setSemester] = useState(registrationProfile.semester || "Semester 6");
  const [bantuan, setBantuan] = useState(registrationProfile.bantuan || "Skripsi");
  const [faseAkademik, setFaseAkademik] = useState(registrationProfile.fase || "Penyusunan Bab II");
  const [motto, setMotto] = useState("Proses hari ini, hasil nanti.");

  const inF = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = "#93c5fd"; e.currentTarget.style.background = "#fff"; };
  const inB = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; };
  const inCls = "w-full px-3 py-2 rounded-xl text-sm text-slate-800 outline-none transition-all";
  const inSt = { background: "#f8fafc", border: "1.5px solid #e2e8f0" };

  const completeProfileAction = (message: string) => {
    setNotice(message);
    setProfileView("main");
    window.setTimeout(() => {
      setNotice("");
    }, 2400);
  };

  const saveProfileDetails = () => {
    window.localStorage.setItem("alerin-registration-profile", JSON.stringify({
      nama,
      universitas,
      jenjang,
      prodi,
      semester,
      bantuan,
      fase: faseAkademik,
    }));
    completeProfileAction("Profil berhasil diperbarui.");
  };

  const openAccountSecurity = () => {
    setDraftWhatsapp(whatsapp);
    setCurrentAccountPassword("");
    setNewAccountPassword("");
    setConfirmAccountPassword("");
    setAccountSecurityError("");
    setProfileView("account-security");
  };

  const applyProfilePhotoFile = (file: File, input: HTMLInputElement) => {
    if (file.size > 5 * 1024 * 1024) {
      setNotice("Ukuran foto maksimal 5 MB.");
      window.setTimeout(() => setNotice(""), 2400);
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      setDraftProfilePhoto(reader.result);
      setProfilePhoto(reader.result);
      window.localStorage.setItem("alerin-profile-photo", reader.result);
      setPhotoModalOpen(false);
      setNotice("Foto profil berhasil diperbarui.");
      window.setTimeout(() => setNotice(""), 2400);
    };
    reader.readAsDataURL(file);
  };

  const saveAccountSecurity = () => {
    const nextWhatsapp = draftWhatsapp.trim();
    if (!nextWhatsapp) {
      setAccountSecurityError("Nomor WhatsApp wajib diisi.");
      return;
    }

    const changingPassword = Boolean(currentAccountPassword || newAccountPassword || confirmAccountPassword);
    if (changingPassword && !currentAccountPassword) {
      setAccountSecurityError("Masukkan kata sandi saat ini untuk mengubah kata sandi.");
      return;
    }
    if (changingPassword && newAccountPassword.length < 8) {
      setAccountSecurityError("Kata sandi baru minimal 8 karakter.");
      return;
    }
    if (changingPassword && newAccountPassword !== confirmAccountPassword) {
      setAccountSecurityError("Konfirmasi kata sandi baru belum cocok.");
      return;
    }

    setWhatsapp(nextWhatsapp);
    setDraftWhatsapp(nextWhatsapp);
    setCurrentAccountPassword("");
    setNewAccountPassword("");
    setConfirmAccountPassword("");
    setAccountSecurityError("");
    completeProfileAction(changingPassword ? "Akun dan kata sandi berhasil diperbarui." : "Informasi akun berhasil diperbarui.");
  };

  const openManageData = () => {
    setDraftKnownItems(knownItems);
    setManualKnownItem("");
    setManageDataError("");
    setProfileView("manage-data");
  };

  const addManualKnownItem = () => {
    const item = manualKnownItem.trim();
    if (!item) {
      setManageDataError("Tulis informasi yang ingin ditambahkan.");
      return;
    }
    if (draftKnownItems.some(existingItem => existingItem.toLocaleLowerCase() === item.toLocaleLowerCase())) {
      setManageDataError("Informasi tersebut sudah ada di dalam daftar.");
      return;
    }

    setDraftKnownItems(items => [...items, item]);
    setManualKnownItem("");
    setManageDataError("");
  };

  const saveManagedData = () => {
    const pendingItem = manualKnownItem.trim();
    const nextItems = pendingItem && !draftKnownItems.some(item => item.toLocaleLowerCase() === pendingItem.toLocaleLowerCase())
      ? [...draftKnownItems, pendingItem]
      : draftKnownItems;

    setKnownItems(nextItems);
    setDraftKnownItems(nextItems);
    setManualKnownItem("");
    setManageDataError("");
    completeProfileAction("Data pribadi berhasil disimpan.");
  };

  const toggleAlerinMemory = () => {
    const enabled = !privacyPersonalization;
    setPrivacyPersonalization(enabled);
    setNotice(enabled ? "Memori Alerin diaktifkan." : "Memori Alerin dinonaktifkan.");
    window.setTimeout(() => setNotice(""), 2200);
  };

  const subTabs: { id: ProfileSubTab; label: string; icon: string; activeIcon: string }[] = [
    { id: "profil", label: "Profil", icon: "/assets/24ca3.svg", activeIcon: "/assets/7ef20.svg" },
    { id: "progres", label: "Progres", icon: "/assets/5d70a.svg", activeIcon: "/assets/ff271.svg" },
    { id: "personalisasi", label: "Personalisasi", icon: "/assets/0d577.svg", activeIcon: "/assets/8fdb1.svg" },
    { id: "umum", label: "Umum", icon: "/assets/0d518.svg", activeIcon: "/assets/4fa2c.svg" },
  ];

  useLayoutEffect(() => {
    const list = subTabListRef.current;
    const activeButton = subTabButtonRefs.current[subTab];
    if (!list || !activeButton) return;

    const updateIndicator = () => {
      setSubTabIndicator({
        left: activeButton.offsetLeft,
        top: activeButton.offsetTop,
        width: activeButton.offsetWidth,
        height: activeButton.offsetHeight,
      });
    };

    updateIndicator();
    const observer = new ResizeObserver(updateIndicator);
    observer.observe(list);
    Object.values(subTabButtonRefs.current).forEach(button => {
      if (button) observer.observe(button);
    });

    return () => observer.disconnect();
  }, [subTab]);

  const profileViewTitle: Record<Exclude<ProfileView, "main">, string> = {
    "profile-photo": "Ubah Foto Profil",
    "memory-summary": "Ringkasan memori",
    "edit-profile": "Edit Data Pendaftaran",
    "manage-data": "Kelola memori Alerin",
    "account-security": "Akun & Keamanan",
    password: "Ubah Kata Sandi",
    package: "Kelola Paket",
    "stage-detail": "Detail Tahapan",
    "reset-plan": "Atur Ulang Rencana",
    notifications: "Pengaturan Notifikasi",
    "privacy-policy": "Kebijakan Privasi",
    terms: "Syarat & Ketentuan",
    privacy: "Privasi & Data",
    about: "Tentang Alerin",
  };

  return (
    <div
      className={`-mb-24 flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden p-0 transition-colors md:mb-0 ${themeMode === "dark" ? "profile-dark" : ""}`}
      style={{ background: themeMode === "dark" ? "#0f172a" : "#f0f2f5" }}
    >
      {logoutModalOpen && (
        <div
          className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-dialog-title"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setLogoutModalOpen(false);
          }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            </div>
            <p id="logout-dialog-title" className="mt-4 text-lg font-bold text-slate-900">Apakah kamu yakin ingin keluar?</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">Kamu perlu masuk kembali untuk melanjutkan aktivitas di Alerin.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setLogoutModalOpen(false);
                  setNotice("Simulasi keluar berhasil. Sesi pengguna tetap dipertahankan untuk demo.");
                  window.setTimeout(() => setNotice(""), 2600);
                }}
                className="rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-red-600"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {packageModalOpen && (
        <div
          className="fixed inset-0 z-[400] flex items-center justify-center overflow-y-auto bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Detail paket"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setPackageModalOpen(false);
          }}
        >
          <div className="relative my-auto w-full max-w-2xl overflow-visible rounded-2xl bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setPackageModalOpen(false)}
              aria-label="Tutup detail paket"
              className="absolute -right-3 -top-3 z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition-colors hover:bg-slate-100 hover:text-slate-800"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="my-[11px] max-h-[75vh] overflow-y-auto px-5 py-[10px] sm:px-6">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <img src="/assets/7052b.png" alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-bold text-slate-900">Alerin Plus</p>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Aktif</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Paket bulanan</p>
                  </div>
                </div>
                <p className="shrink-0 text-right text-base font-bold text-slate-900">Rp49.000<span className="block text-[11px] font-medium text-slate-400">per bulan</span></p>
              </div>

              <dl className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 px-4">
                {[
                  ["Status langganan", "Aktif"],
                  ["Tanggal mulai", "30 Desember 2025"],
                  ["Tagihan berikutnya", "30 Desember 2026"],
                  ["Metode pembayaran", "Visa •••• 2048"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-xs text-slate-500">{label}</dt>
                    <dd className="text-right text-xs font-semibold text-slate-800">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5">
                <p className="text-sm font-bold text-[#1D293D]">Benefit paket</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {["Akses semua fitur Alerin", "Analisis akademik mendalam", "Respons prioritas", "Riwayat proyek tanpa batas"].map(benefit => (
                    <div key={benefit} className="flex items-center gap-2 text-xs text-slate-600">
                      <svg className="shrink-0 text-emerald-600" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4L19 6" /></svg>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="text-sm font-bold text-[#1D293D]">Tindakan paket</p>
                <div className="mt-3 space-y-3">
                  <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Batalkan Langganan</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">Hentikan perpanjangan otomatis. Paket tetap aktif sampai 30 Desember 2026.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPackageModalOpen(false);
                        setNotice("Perpanjangan otomatis berhasil dibatalkan.");
                        window.setTimeout(() => setNotice(""), 2600);
                      }}
                      className="shrink-0 rounded-lg border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      Batalkan Langganan
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Batalkan Paket</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">Akhiri paket sekarang. Akun akan kembali ke Alerin Basic dan benefit Plus langsung berhenti.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPackageModalOpen(false);
                        setNotice("Permintaan pembatalan paket berhasil dikirim.");
                        window.setTimeout(() => setNotice(""), 2600);
                      }}
                      className="shrink-0 rounded-lg border border-[#D33D3D] bg-[#D33D3D] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#bd3434]"
                    >
                      Batalkan Paket
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {upgradeModalOpen && (
        <div
          className="fixed inset-0 z-[400] flex items-center justify-center overflow-y-auto bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upgrade-modal-title"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setUpgradeModalOpen(false);
          }}
        >
          <div className="my-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="relative px-6 pb-6 pt-5">
              <button
                type="button"
                onClick={() => setUpgradeModalOpen(false)}
                aria-label="Tutup pilihan paket"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center">
                <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-blue-100 bg-blue-50 shadow-sm">
                  <img src="/assets/f725b.png" alt="Logo Alerin" className="h-full w-full object-cover" />
                </div>
              <p className="mt-4 text-[18px] font-bold text-slate-800">Buka semua fitur Alerin</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Dapatkan dukungan penuh untuk belajar, riset, dan menyelesaikan target akademikmu.</p>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  ["Akses tanpa batas", "Gunakan seluruh fitur Alerin tanpa batas harian."],
                  ["Mentor akademik", "Dapatkan sesi pendampingan untuk tugas dan penelitian."],
                  ["Prioritas tertinggi", "Respons lebih cepat dan review dokumen lanjutan."],
                ].map(([title, description], index) => (
                  <div key={title} className="flex items-start gap-3">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${index < 3 ? "bg-[#558FDF] text-white" : "bg-blue-50 text-[#347CEA]"}`}>
                      {index === 0 ? (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2"><path d="M5 12h14M12 5v14" /></svg>
                      ) : index === 1 ? (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
                      ) : (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2"><path d="m13 2-2 7h7l-9 13 2-9H4z" /></svg>
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { id: "monthly" as const, label: "Bulanan", price: "Rp99.000", caption: "Ditagih setiap bulan" },
                  { id: "yearly" as const, label: "Tahunan", price: "Rp990.000", caption: "Hemat Rp198.000" },
                ].map(option => {
                  const active = upgradeBillingCycle === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setUpgradeBillingCycle(option.id)}
                      className={`rounded-xl border p-4 text-left transition-colors ${active ? "border-[#347CEA] bg-blue-50/50" : "border-slate-200 bg-white hover:border-blue-200"}`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-slate-600">{option.label}</span>
                        <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${active ? "border-[#347CEA]" : "border-slate-300"}`}>
                          {active && <span className="h-2 w-2 rounded-full bg-[#347CEA]" />}
                        </span>
                      </span>
                      <span className="mt-3 block text-base font-bold text-slate-900">{option.price}</span>
                      <span className={`mt-1 block text-[10px] ${active && option.id === "yearly" ? "font-semibold text-[#347CEA]" : "text-slate-400"}`}>{option.caption}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  setUpgradeModalOpen(false);
                  setNotice(`Paket ${upgradeBillingCycle === "yearly" ? "tahunan" : "bulanan"} Alerin Max siap dilanjutkan ke pembayaran.`);
                  window.setTimeout(() => setNotice(""), 2800);
                }}
                className="mt-5 w-full rounded-xl bg-[#347CEA] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
              >
                Upgrade Sekarang
              </button>
              <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">Batalkan kapan saja. Paket diperpanjang otomatis sesuai periode yang dipilih.</p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto p-0">
        <div className="mx-auto min-h-full max-w-5xl px-3 py-4 md:px-6">
          {/* Profile summary — follows the supplied Alerin profile layout */}
          <div className="relative -mt-1 h-[272px] rounded-2xl bg-white shadow-sm md:mb-3 md:mt-0 md:h-auto md:px-7 md:py-6">
            <div className="relative mb-1 flex h-full flex-col items-center md:mb-0 md:h-auto md:flex-row md:gap-4">
              <div className={`absolute left-1/2 top-profile-avatar-top flex w-fit -translate-x-1/2 shrink-0 flex-col items-center md:static md:translate-x-0 ${photoModalOpen ? "z-[100]" : "z-0"}`}>
                <div
                  className="flex size-profile-avatar items-center justify-center overflow-hidden rounded-full border-4 border-white font-['Inter:Bold'] text-profile-avatar font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#f59e0b,#ea8b00)", boxShadow: "0 2px 10px rgba(0,0,0,0.14)" }}
                >
                  {profilePhoto ? <img src={profilePhoto} alt={`Foto profil ${nama}`} className="h-full w-full object-cover" /> : "RA"}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDraftProfilePhoto(profilePhoto);
                    setPhotoModalOpen(open => !open);
                  }}
                  aria-expanded={photoModalOpen}
                  aria-haspopup="menu"
                  className="absolute left-13 top-18 flex h-6 w-[53px] items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 font-['Inter:Medium'] text-profile-edit font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                >
                  <img src="/assets/bdfdb.svg" alt="" className={themeMode === "dark" ? "brightness-0 invert" : ""} />
                  Edit
                </button>
                {photoModalOpen && (
                  <div
                    role="menu"
                    aria-label="Pilihan foto profil"
                    className="absolute left-1/2 top-[104px] z-[110] w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-[0_12px_30px_rgba(15,23,42,0.16)] md:left-[112px] md:top-[60px] md:w-48 md:translate-x-0 md:p-1.5"
                  >
                    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700 md:py-2.5 md:text-xs">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4 16 6h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l1.5-2h5Z" /><circle cx="12" cy="12" r="3" /></svg>
                      Ambil dari kamera
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        className="sr-only"
                        onChange={event => {
                          const file = event.target.files?.[0];
                          if (file) applyProfilePhotoFile(file, event.target);
                        }}
                      />
                    </label>
                    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700 md:py-2.5 md:text-xs">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m21 15-5-5L5 20" /></svg>
                      Pilih dari galeri
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        onChange={event => {
                          const file = event.target.files?.[0];
                          if (file) applyProfilePhotoFile(file, event.target);
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="absolute inset-x-0 top-[147px] min-w-0 py-1.5 text-center md:static md:flex-1 md:py-0 md:text-left">
                <div className="flex items-center justify-center md:justify-start md:gap-2">
                  <p className="font-['Plus_Jakarta_Sans:Bold'] text-profile-name font-bold text-slate-900">{nama}</p>
                  <span className="absolute left-1/2 top-[-33px] mt-[5px] inline-flex h-profile-badge w-[107px] -translate-x-1/2 items-center justify-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 font-['Inter:Bold'] text-profile-badge font-bold text-slate-900 shadow-sm md:static md:mt-0 md:w-auto md:translate-x-0 md:bg-white md:text-slate-900 md:shadow-none">
                    Alerin Plus
                    <span className="relative h-[17px] w-[17px] overflow-hidden">
                      <img src="/assets/8923b.png" alt="" className="pointer-events-none absolute max-w-none" style={{ width: 41, height: 74, left: -12, top: -6 }} />
                    </span>
                  </span>
                </div>
                <p className="mt-1 font-['Inter:Medium'] text-sm font-medium leading-5 text-[#3e3f40]">{jenjang.replace(/\s*\([^)]*\)/, "")} · {prodi} · {universitas}</p>
              </div>

              <p
                ref={(element) => {
                  if (!element) return;
                  const messages = Array.from(new Set([
                    motto,
                    "Langkah kecil hari ini, hasil besar nanti.",
                    "Belajar konsisten, tumbuh tanpa batas.",
                  ]));
                  let activeIndex = 0;
                  let fadeTimer = 0;

                  const fitMessage = (message: string) => {
                    element.textContent = `"${message}"`;
                    element.title = message;
                    let fontSize = 16;
                    element.style.fontSize = `${fontSize}px`;
                    while (element.scrollWidth > element.clientWidth && fontSize > 10) {
                      fontSize -= 0.5;
                      element.style.fontSize = `${fontSize}px`;
                    }
                  };

                  fitMessage(messages[activeIndex]);
                  const rotationTimer = window.setInterval(() => {
                    element.style.opacity = "0";
                    fadeTimer = window.setTimeout(() => {
                      activeIndex = (activeIndex + 1) % messages.length;
                      fitMessage(messages[activeIndex]);
                      element.style.opacity = "1";
                    }, 200);
                  }, 20000);
                  const resizeObserver = new ResizeObserver(() => fitMessage(messages[activeIndex]));
                  resizeObserver.observe(element);

                  return () => {
                    window.clearInterval(rotationTimer);
                    window.clearTimeout(fadeTimer);
                    resizeObserver.disconnect();
                  };
                }}
                className="absolute bottom-[8px] left-0 right-0 overflow-hidden whitespace-nowrap px-3 py-5 text-center font-['Plus_Jakarta_Sans'] text-base font-extrabold not-italic text-profile-motto-ink transition-[opacity,font-size] duration-200 md:static md:max-w-64 md:px-0 md:py-0 md:text-right"
              >
                "{motto}"
              </p>
            </div>
          </div>

          {/* Profile completion */}
          <button
            type="button"
            onClick={onRegister}
            className="group relative mx-0 mb-3 mt-[11px] flex min-h-profile-cta w-full items-center gap-3 overflow-hidden rounded-2xl bg-white px-5 py-[22px] text-left text-blue-800 shadow-[0_10px_30px_rgba(52,124,234,0.16)] ring-1 ring-blue-100"
          >
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/3 z-20 hidden w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-blue-200/70 to-transparent opacity-0 blur-sm transition-[left,opacity] duration-700 ease-out group-hover:left-[115%] group-hover:opacity-100 md:block" />
            <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full border border-blue-200/70" />
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-16 right-12 hidden h-32 w-52 rounded-full bg-blue-400/25 blur-2xl md:block" />
            <span aria-hidden="true" className="pointer-events-none absolute left-[42%] top-3 h-2 w-2 rotate-45 rounded-[2px] bg-blue-300/70" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-[58%] h-1.5 w-1.5 rounded-full bg-blue-400/70" />
            <img src="/assets/6667b.svg" alt="" className="relative z-10 shrink-0 rounded-xl border border-white/70 bg-[linear-gradient(135deg,rgba(52,124,234,0.88),rgba(85,143,223,0.62))] p-2 shadow-[0_6px_18px_rgba(52,124,234,0.28),inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-xl" />
            <span className="relative z-10 min-w-0 flex-1">
              <span className="block font-['Inter:Bold'] text-[15px] font-bold leading-5 text-[#3a3a3b]">Lengkapi Profil Kamu 8/10</span>
              <span className="mt-0.5 block max-w-profile-description font-['Inter:Medium'] text-[13px] font-medium text-slate-500">Lengkapi profilmu untuk pengalaman yang lebih personal dan menarik.</span>
            </span>
            <svg className="relative z-10 shrink-0 md:hidden" width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="var(--color-blue-500)" />
            </svg>
            <span className="relative z-10 hidden shrink-0 items-center gap-4 md:flex">
              <span className="h-2 w-40 overflow-hidden rounded bg-blue-100 lg:w-56">
                <span className="block h-full w-4/5 bg-blue-500" />
              </span>
              <span className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 font-['Inter:Bold'] text-xs font-bold leading-4 text-white shadow-sm">
                Mulai Lengkapi
                <img src="/assets/1d78a.svg" alt="" className="ml-1 brightness-0 invert" />
              </span>
            </span>
          </button>

          {/* Main + sidebar layout */}
          <div className="flex gap-3 pb-6">
            {/* Main column */}
            <div className="flex-1 min-w-0">
              {/* Sub-tabs */}
              <div ref={subTabListRef} className="relative mb-3 flex h-profile-tabs items-center justify-center gap-1 overflow-hidden rounded-2xl bg-white p-3 shadow-sm md:justify-start">
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute left-0 top-0 rounded-full border border-white/70 bg-[linear-gradient(135deg,rgba(52,124,234,0.88),rgba(85,143,223,0.62))] shadow-[0_3px_10px_rgba(52,124,234,0.18),inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-xl transition-[transform,width,height,opacity] duration-300 ease-out motion-reduce:transition-none md:hidden ${subTabIndicator.width ? "opacity-100" : "opacity-0"}`}
                  style={{
                    width: subTabIndicator.width,
                    height: subTabIndicator.height,
                    transform: `translate(${subTabIndicator.left}px, ${subTabIndicator.top}px)`,
                  }}
                />
                {subTabs.map(t => (
                  <button
                    ref={button => {
                      subTabButtonRefs.current[t.id] = button;
                    }}
                    key={t.id}
                    onClick={() => { setSubTab(t.id); setProfileView("main"); }}
                    className={`${t.id === "progres" ? "hidden" : "flex"} relative z-10 shrink-0 items-center justify-center rounded-full py-1.5 font-['Inter:Semi_Bold'] text-sm font-semibold transition-all duration-200 md:text-xs ${t.id === "umum" ? "gap-x-[5px] gap-y-1.5 px-[7px]" : "gap-1.5 px-3"} ${
                      subTab === t.id ? "text-white md:border md:border-white/70 md:bg-[linear-gradient(135deg,rgba(52,124,234,0.88),rgba(85,143,223,0.62))] md:shadow-[0_3px_10px_rgba(52,124,234,0.18),inset_0_1px_0_rgba(255,255,255,0.45)] md:backdrop-blur-xl" : "text-slate-500"
                    }`}
                  >
                    <img
                      src={subTab === t.id ? t.activeIcon : t.icon}
                      alt=""
                      className={t.id === "umum" ? "-mx-[5px] h-[23px] w-[23px]" : "h-4 w-4"}
                    />
                    {t.label}
                  </button>
                ))}
              </div>

              {notice && (
                <div className="mb-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4L19 6"/></svg>
                  {notice}
                </div>
              )}

              {profileView !== "main" && (
                <div
                  className="w-full rounded-2xl bg-white p-5 md:p-6"
                  style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
                >
                  <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                    <button
                      type="button"
                      onClick={() => setProfileView("main")}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
                      aria-label="Kembali"
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <div>
                      <p className="text-base font-bold text-slate-900">{profileViewTitle[profileView]}</p>
                      {profileView !== "edit-profile" && profileView !== "account-security" && profileView !== "manage-data" && (
                        <p className={`mt-0.5 ${profileView === "memory-summary" ? "text-[13px] text-[#4f4f51]" : "text-[11px] text-slate-400"}`}>
                          {profileView === "memory-summary"
                            ? "Baru saja diperbarui"
                            : "Perubahan disimulasikan dan dapat disimpan."}
                        </p>
                      )}
                    </div>
                  </div>

                  {profileView === "memory-summary" && (
                    <div className="mx-auto max-w-3xl">
                      <div className="space-y-7">
                        <section>
                          <h2 className="text-lg font-bold text-[#1D293D]">Ringkasan</h2>
                          <p className="mt-2 text-sm leading-7 text-slate-600">
                            Kamu adalah {nama}, mahasiswa {jenjang} program studi {prodi} di {universitas}. Saat ini kamu berada di {semester} dan sedang berfokus pada {bantuan.toLowerCase()} dalam fase {faseAkademik.toLowerCase()}.
                          </p>
                        </section>

                        <section>
                          <h2 className="text-lg font-bold text-[#1D293D]">Akademik &amp; Proyek</h2>
                          <p className="mt-2 text-sm leading-7 text-slate-600">
                            Fokus akademikmu berkaitan dengan {prodi.toLowerCase()} dan penyelesaian {bantuan.toLowerCase()}. Alerin mengingat tahapan yang sedang kamu kerjakan agar bantuan, penjelasan, serta rekomendasi berikutnya tetap relevan dengan progresmu.
                          </p>
                        </section>

                        <section>
                          <h2 className="text-lg font-bold text-[#1D293D]">Gaya Belajar</h2>
                          <p className="mt-2 text-sm leading-7 text-slate-600">
                            Kamu lebih mudah memahami materi melalui contoh dan latihan singkat. Gaya komunikasi Alerin yang kamu pilih adalah {communicationStyle.toLowerCase()}, sehingga jawaban akan disampaikan dengan struktur dan nada yang sesuai.
                          </p>
                        </section>

                        <section>
                          <h2 className="text-lg font-bold text-[#1D293D]">Personalisasi yang Diingat</h2>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {knownItems.map(item => (
                              <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">{item}</span>
                            ))}
                          </div>
                        </section>
                      </div>

                      <form
                        className="mt-8 space-y-3"
                        onSubmit={event => {
                          event.preventDefault();
                          const form = event.currentTarget;
                          const input = form.elements.namedItem("memoryPrompt") as HTMLInputElement;
                          const submitButton = form.querySelector<HTMLButtonElement>("[data-memory-submit]");
                          const output = form.querySelector<HTMLElement>("[data-memory-output]");
                          const outputQuestion = form.querySelector<HTMLElement>("[data-memory-question]");
                          const idleIcon = form.querySelector<HTMLElement>("[data-memory-idle]");
                          const loadingIcon = form.querySelector<HTMLElement>("[data-memory-loading]");
                          const question = input.value.trim();
                          if (!question || !submitButton || !output || !outputQuestion || !idleIcon || !loadingIcon) return;

                          output.classList.add("hidden");
                          input.disabled = true;
                          input.value = "Alerin sedang menyusun jawaban...";
                          submitButton.disabled = true;
                          idleIcon.classList.add("hidden");
                          loadingIcon.classList.remove("hidden");

                          window.setTimeout(() => {
                            outputQuestion.textContent = question;
                            output.classList.remove("hidden");
                            input.disabled = false;
                            input.value = "";
                            submitButton.disabled = false;
                            idleIcon.classList.remove("hidden");
                            loadingIcon.classList.add("hidden");
                            input.focus();
                          }, 1400);
                        }}
                      >
                        <div data-memory-output role="status" className="relative hidden rounded-2xl bg-[#1D293D] p-5 pr-12 text-white shadow-xl">
                          <button
                            type="button"
                            aria-label="Tutup jawaban"
                            onClick={event => event.currentTarget.parentElement?.classList.add("hidden")}
                            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-300 transition-colors hover:bg-white/20 hover:text-white"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                          </button>
                          <p className="text-sm leading-7 text-slate-100">Dari yang Alerin tahu tentangmu, berikut konteks yang paling relevan:</p>
                          <ul className="mt-3 space-y-2 pl-5 text-sm leading-6 text-slate-200">
                            <li className="list-disc"><strong className="text-white">Fokus akademik:</strong> {bantuan} pada fase {faseAkademik.toLowerCase()}.</li>
                            <li className="list-disc"><strong className="text-white">Gaya belajar:</strong> penjelasan terstruktur melalui contoh dan latihan singkat.</li>
                            <li className="list-disc"><strong className="text-white">Pertanyaanmu:</strong> <span data-memory-question /></li>
                          </ul>
                        </div>

                        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
                          <input
                            name="memoryPrompt"
                            type="text"
                            aria-label="Tanya atau perbarui ringkasan memori"
                            placeholder="Tanya atau perbarui"
                            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:text-slate-400"
                          />
                          <button data-memory-submit type="submit" aria-label="Kirim" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#347CEA] text-white transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:bg-blue-400">
                            <span data-memory-idle>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m12 19 0-14" />
                                <path d="m5 12 7-7 7 7" />
                              </svg>
                            </span>
                            <span data-memory-loading className="hidden h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {profileView === "profile-photo" && (
                    <div className="mx-auto max-w-xl">
                      <div className="flex flex-col items-center rounded-2xl bg-slate-50 p-6 text-center">
                        <div
                          className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white text-3xl font-bold text-white shadow-md"
                          style={{ background: "linear-gradient(135deg,#f59e0b,#ea8b00)" }}
                        >
                          {draftProfilePhoto ? <img src={draftProfilePhoto} alt="Pratinjau foto profil" className="h-full w-full object-cover" /> : "RA"}
                        </div>
                        <p className="mt-4 text-sm font-bold text-slate-800">Foto Profil</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">Gunakan foto JPG, PNG, atau WebP dengan ukuran maksimal 5 MB.</p>
                        <label className="mt-4 cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                          Pilih foto baru
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="sr-only"
                            onChange={event => {
                              const file = event.target.files?.[0];
                              if (!file) return;
                              if (file.size > 5 * 1024 * 1024) {
                                setNotice("Ukuran foto maksimal 5 MB.");
                                window.setTimeout(() => setNotice(""), 2400);
                                event.target.value = "";
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === "string") setDraftProfilePhoto(reader.result);
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                        {draftProfilePhoto && (
                          <button type="button" onClick={() => setDraftProfilePhoto("")} className="mt-3 text-xs font-semibold text-red-500 hover:text-red-600">
                            Hapus foto
                          </button>
                        )}
                      </div>
                      <div className="mt-6 flex justify-end gap-2">
                        <button type="button" onClick={() => setProfileView("main")} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600">Batal</button>
                        <button
                          type="button"
                          onClick={() => {
                            setProfilePhoto(draftProfilePhoto);
                            if (draftProfilePhoto) {
                              window.localStorage.setItem("alerin-profile-photo", draftProfilePhoto);
                            } else {
                              window.localStorage.removeItem("alerin-profile-photo");
                            }
                            completeProfileAction("Foto profil berhasil diperbarui.");
                          }}
                          className="rounded-xl bg-[#347CEA] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-700"
                        >
                          Simpan foto
                        </button>
                      </div>
                    </div>
                  )}

                  {profileView === "edit-profile" && (
                    <div className="mx-auto max-w-2xl">
                      <div className="mb-5">
                        <p className="text-lg font-bold text-slate-800">Data akun dan akademik</p>
                        <p className="mt-1 text-[13px] leading-relaxed text-slate-600">Pastikan informasi berikut sesuai dengan data pendaftaranmu agar bantuan Alerin tetap relevan.</p>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-slate-700">Nama Lengkap</span>
                          <input value={nama} onChange={event => setNama(event.target.value)} className={`${inCls} px-4 py-3 text-base`} style={inSt} onFocus={inF} onBlur={inB} />
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-slate-700">Jenjang Akademik</span>
                          <select value={jenjang} onChange={event => setJenjang(event.target.value)} className={`${inCls} px-4 py-3 text-base`} style={inSt}>
                            <option value="S1 (Sarjana)">S1 Sarjana/D4 Diploma</option>
                            <option value="S2 (Magister)">S2 Magister</option>
                            <option value="S3 (Doktor)">S3 Doktor</option>
                          </select>
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-slate-700">Universitas</span>
                          <input value={universitas} onChange={event => setUniversitas(event.target.value)} className={`${inCls} px-4 py-3 text-base`} style={inSt} onFocus={inF} onBlur={inB} />
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-slate-700">Jurusan</span>
                          <input value={prodi} onChange={event => setProdi(event.target.value)} className={`${inCls} px-4 py-3 text-base`} style={inSt} onFocus={inF} onBlur={inB} />
                        </label>
                        <label className="block sm:col-span-2">
                          <span className="mb-2 block text-sm font-semibold text-slate-700">Semester Saat Ini</span>
                          <select value={semester} onChange={event => setSemester(event.target.value)} className={`${inCls} px-4 py-3 text-base`} style={inSt}>
                            {["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8", "Semester 9", "Semester 10", "Semester 11", "Semester 12", "Semester 9+"].map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className="mt-6 flex justify-end gap-2">
                        <button type="button" onClick={() => setProfileView("main")} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600">Batal</button>
                        <button type="button" onClick={saveProfileDetails} className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700">Simpan perubahan</button>
                      </div>
                    </div>
                  )}

                  {profileView === "manage-data" && (
                    <div className="mx-auto max-w-2xl">
                      <p className="mb-4 text-sm leading-relaxed text-slate-600">Tambahkan informasi yang boleh digunakan Alerin untuk menyesuaikan jawaban dan rekomendasi.</p>

                      <form
                        className="flex flex-col gap-2 xs:flex-row"
                        onSubmit={event => {
                          event.preventDefault();
                          addManualKnownItem();
                        }}
                      >
                        <input
                          value={manualKnownItem}
                          onChange={event => {
                            setManualKnownItem(event.target.value);
                            if (manageDataError) setManageDataError("");
                          }}
                          aria-label="Informasi pribadi baru"
                          placeholder="Contoh: Target sidang Desember 2026"
                          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
                        />
                        <button
                          type="submit"
                          disabled={!manualKnownItem.trim()}
                          className="rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          Tambah
                        </button>
                      </form>

                      {manageDataError && (
                        <p className="mt-2 text-xs font-medium text-red-500" role="alert">{manageDataError}</p>
                      )}

                      <div className="mt-5 flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-slate-800">Data yang digunakan Alerin</p>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">{draftKnownItems.length} data</span>
                      </div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {draftKnownItems.map(item => (
                          <div key={item} className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <span className="min-w-0 break-words text-xs font-medium text-slate-700">{item}</span>
                            <button
                              type="button"
                              aria-label={`Hapus ${item}`}
                              onClick={() => setDraftKnownItems(items => items.filter(knownItem => knownItem !== item))}
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M18 6 6 18M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        {draftKnownItems.length === 0 && (
                          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-xs leading-relaxed text-slate-400 sm:col-span-2">
                            Belum ada data. Tambahkan informasi yang ingin digunakan Alerin.
                          </div>
                        )}
                      </div>

                      <button type="button" onClick={saveManagedData} className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white transition-colors hover:bg-blue-700">Simpan</button>
                    </div>
                  )}

                  {profileView === "account-security" && (
                    <form
                      className="mx-auto max-w-xl"
                      onSubmit={event => {
                        event.preventDefault();
                        saveAccountSecurity();
                      }}
                    >
                      <div className="space-y-5">
                        <label className="block">
                          <span className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
                            Email
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">Tidak dapat diubah</span>
                          </span>
                          <input
                            type="email"
                            value={accountEmail}
                            readOnly
                            aria-readonly="true"
                            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-base text-slate-500 outline-none"
                          />
                          <span className="mt-2 block text-[13px] leading-relaxed text-slate-500">Email ini terhubung dengan akun Alerin dan tidak dapat diganti.</span>
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-slate-700">Nomor Handphone</span>
                          <input
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            value={draftWhatsapp === whatsapp ? "" : draftWhatsapp}
                            onChange={event => {
                              setDraftWhatsapp(event.target.value);
                              if (accountSecurityError) setAccountSecurityError("");
                            }}
                            placeholder="Masukkan nomor aktifmu"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
                          />
                        </label>
                      </div>

                      <div className="my-6 border-t border-slate-100" />

                      <div>
                        <p className="text-lg font-bold text-slate-800">Ubah kata sandi</p>
                        <p className="mt-1 text-[13px] leading-relaxed text-slate-600">Kosongkan bagian ini jika hanya ingin memperbarui nomor Handphone.</p>
                      </div>

                      <div className="mt-5 space-y-5">
                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-slate-700">Kata sandi saat ini</span>
                          <input
                            type="password"
                            autoComplete="current-password"
                            value={currentAccountPassword}
                            onChange={event => {
                              setCurrentAccountPassword(event.target.value);
                              if (accountSecurityError) setAccountSecurityError("");
                            }}
                            placeholder="Masukkan kata sandi saat ini"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
                          />
                        </label>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-slate-700">Kata sandi baru</span>
                            <input
                              type="password"
                              autoComplete="new-password"
                              value={newAccountPassword}
                              onChange={event => {
                                setNewAccountPassword(event.target.value);
                                if (accountSecurityError) setAccountSecurityError("");
                              }}
                              placeholder="Minimal 8 karakter"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-slate-700">Konfirmasi kata sandi</span>
                            <input
                              type="password"
                              autoComplete="new-password"
                              value={confirmAccountPassword}
                              onChange={event => {
                                setConfirmAccountPassword(event.target.value);
                                if (accountSecurityError) setAccountSecurityError("");
                              }}
                              placeholder="Ulangi kata sandi baru"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="my-6 border-t border-slate-100" />

                      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 sm:p-5">
                        <div>
                          <p className="text-lg font-bold text-slate-800">Lupa kata sandi?</p>
                          <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
                            Masukkan email akunmu untuk menerima tautan pemulihan kata sandi.
                          </p>
                        </div>
                        <label className="mt-4 block">
                          <span className="mb-2 block text-sm font-semibold text-slate-700">Email pemulihan</span>
                          <input
                            type="email"
                            value={recoveryEmail}
                            onChange={event => setRecoveryEmail(event.target.value)}
                            placeholder={accountEmail}
                            autoComplete="email"
                            className="w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-base text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const email = recoveryEmail.trim() || accountEmail;
                            setRecoveryEmail(email);
                            setNotice(`Tautan pemulihan telah dikirim ke ${email}.`);
                            window.setTimeout(() => setNotice(""), 2600);
                          }}
                          className="mt-4 w-full rounded-xl bg-[#347CEA] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                        >
                          Kirim tautan pemulihan
                        </button>
                      </div>

                      {accountSecurityError && (
                        <p className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600" role="alert">{accountSecurityError}</p>
                      )}

                      <div className="mt-6 flex flex-col-reverse gap-2 xs:flex-row xs:justify-end">
                        <button type="button" onClick={() => setProfileView("main")} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">Batal</button>
                        <button type="submit" className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700">Simpan perubahan</button>
                      </div>
                    </form>
                  )}

                  {profileView === "password" && (
                    <div className="mx-auto max-w-lg space-y-4">
                      {["Kata sandi saat ini", "Kata sandi baru", "Konfirmasi kata sandi baru"].map(label => (
                        <label key={label} className="block">
                          <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
                          <input type="password" placeholder="••••••••" className={inCls} style={inSt} onFocus={inF} onBlur={inB} />
                        </label>
                      ))}
                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-[11px] leading-relaxed text-blue-700">Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.</div>
                      <button type="button" onClick={() => completeProfileAction("Kata sandi berhasil diubah.")} className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white">Ubah kata sandi</button>
                    </div>
                  )}

                  {profileView === "package" && (
                    <div className="mx-auto max-w-xl">
                      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                        <div className="flex items-center gap-4">
                          <img src="/assets/7052b.png" alt="" className="h-16 w-16 rounded-2xl object-cover" />
                          <div>
                            <p className="font-display text-xl font-bold text-slate-900">Alerin Plus</p>
                            <p className="mt-1 text-xs text-slate-500">Aktif sampai 30 Desember 2026</p>
                          </div>
                        </div>
                        <div className="mt-5 space-y-2">
                          {["Akses semua fitur AI", "Analisis akademik mendalam", "Prioritas respons", "Riwayat proyek tanpa batas"].map(feature => (
                            <div key={feature} className="flex items-center gap-2 text-xs text-slate-700">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 12 4 4L19 6"/></svg></span>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                      <button type="button" onClick={() => completeProfileAction("Simulasi upgrade paket berhasil.")} className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white">Simulasikan upgrade paket</button>
                    </div>
                  )}

                  {profileView === "stage-detail" && (
                    <div className="mx-auto max-w-2xl">
                      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Tahap Skripsi Aktif</span>
                        <p className="mt-2 text-lg font-bold text-slate-900">{selectedStage}</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">Tahap ini memiliki dua penghambat yang perlu diselesaikan sebelum melanjutkan ke seminar proposal.</p>
                      </div>
                      <div className="mt-4 space-y-2">
                        {["Finalisasi instrumen penelitian", "Validasi dosen pembimbing", "Perbaiki catatan revisi Bab III"].map((task, index) => (
                          <label key={task} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-xs text-slate-700">
                            <input type="checkbox" defaultChecked={index === 2} className="h-4 w-4 accent-blue-600" />
                            {task}
                          </label>
                        ))}
                      </div>
                      <button type="button" onClick={() => completeProfileAction("Progres tahapan berhasil diperbarui.")} className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white">Simpan progres</button>
                    </div>
                  )}

                  {profileView === "reset-plan" && (
                    <div className="mx-auto max-w-xl space-y-4">
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-slate-600">Target seminar proposal</span>
                        <input type="date" defaultValue="2026-10-18" className={inCls} style={inSt} />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-slate-600">Jam belajar per minggu</span>
                        <input type="range" min="2" max="30" defaultValue="12" className="w-full accent-blue-600" />
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] text-slate-400">Risiko baru</p><p className="mt-1 text-sm font-bold text-emerald-600">Rendah</p></div>
                        <div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] text-slate-400">Estimasi</p><p className="mt-1 text-sm font-bold text-slate-800">18 jam</p></div>
                      </div>
                      <button type="button" onClick={() => completeProfileAction("Rencana belajar berhasil diperbarui.")} className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white">Terapkan rencana</button>
                    </div>
                  )}

                  {profileView === "notifications" && (
                    <div className="mx-auto max-w-xl space-y-3">
                      {["Pengingat deadline", "Ringkasan progres mingguan", "Rekomendasi dari Alerin"].map(label => (
                        <button key={label} type="button" onClick={() => setNotificationsEnabled(value => !value)} className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left">
                          <span className="text-sm font-medium text-slate-700">{label}</span>
                          <span className={`relative h-6 w-11 rounded-full transition-colors ${notificationsEnabled ? "bg-blue-600" : "bg-slate-300"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${notificationsEnabled ? "left-6" : "left-1"}`} /></span>
                        </button>
                      ))}
                      <button type="button" onClick={() => completeProfileAction("Pengaturan notifikasi disimpan.")} className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white">Simpan</button>
                    </div>
                  )}

                  {profileView === "privacy-policy" && (
                    <div className="mx-auto max-w-2xl">
                      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                        <p className="text-base font-bold text-slate-900">Kebijakan Privasi Alerin</p>
                        <p className="mt-1 text-xs text-slate-500">Terakhir diperbarui: 2 Oktober 2026</p>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          Privasimu penting bagi kami. Kebijakan ini menjelaskan data yang Alerin simpan, cara penggunaannya, dan pilihan yang kamu miliki.
                        </p>
                      </div>

                      <div className="mt-5 divide-y divide-slate-100">
                        {[
                          {
                            title: "Data yang kami kumpulkan",
                            description: "Alerin menyimpan data akun, profil akademik, preferensi belajar, serta percakapan yang diperlukan untuk memberikan bantuan yang relevan.",
                          },
                          {
                            title: "Cara kami menggunakan data",
                            description: "Data digunakan untuk mempersonalisasi jawaban, menampilkan progres akademik, menyimpan pengaturan, dan meningkatkan keamanan layanan.",
                          },
                          {
                            title: "Penyimpanan dan keamanan",
                            description: "Kami menerapkan perlindungan teknis yang wajar untuk menjaga data dari akses, perubahan, atau penggunaan yang tidak sah.",
                          },
                          {
                            title: "Kontrol pengguna",
                            description: "Kamu dapat mengubah data profil, menonaktifkan personalisasi, mengelola memori Alerin, atau menghapus riwayat melalui pengaturan Privasi & Data.",
                          },
                          {
                            title: "Pembagian data",
                            description: "Alerin tidak menjual data pribadimu. Data hanya dibagikan jika diperlukan untuk menjalankan layanan atau memenuhi kewajiban hukum.",
                          },
                        ].map(section => (
                          <section key={section.title} className="py-4 first:pt-0 last:pb-0">
                            <h2 className="text-sm font-bold text-[#1D293D]">{section.title}</h2>
                            <p className="mt-1.5 text-sm leading-6 text-slate-500">{section.description}</p>
                          </section>
                        ))}
                      </div>

                      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-bold text-slate-800">Pertanyaan tentang privasi?</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">Hubungi tim Alerin melalui pusat bantuan jika kamu ingin menanyakan atau meminta penghapusan data.</p>
                      </div>
                    </div>
                  )}

                  {profileView === "terms" && (
                    <div className="mx-auto max-w-2xl">
                      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                        <p className="text-base font-bold text-slate-900">Syarat &amp; Ketentuan Alerin</p>
                        <p className="mt-1 text-xs text-slate-500">Terakhir diperbarui: 2 Oktober 2026</p>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          Dengan menggunakan Alerin, kamu menyetujui ketentuan berikut. Bacalah informasi ini agar kamu memahami hak dan tanggung jawab selama menggunakan layanan.
                        </p>
                      </div>

                      <div className="mt-5 divide-y divide-slate-100">
                        {[
                          {
                            title: "Penggunaan layanan",
                            description: "Alerin ditujukan sebagai asisten akademik untuk membantu proses belajar, riset, penulisan, dan pengelolaan progres mahasiswa.",
                          },
                          {
                            title: "Tanggung jawab akun",
                            description: "Kamu bertanggung jawab menjaga kerahasiaan informasi masuk, memberikan data yang benar, serta memastikan seluruh aktivitas akun dilakukan dengan aman.",
                          },
                          {
                            title: "Integritas akademik",
                            description: "Hasil dari Alerin harus digunakan secara bertanggung jawab. Kamu tetap wajib mengikuti aturan kampus, melakukan verifikasi, dan mencantumkan sumber bila diperlukan.",
                          },
                          {
                            title: "Batasan penggunaan",
                            description: "Kamu tidak diperkenankan menggunakan Alerin untuk tindakan ilegal, merugikan pihak lain, mengganggu layanan, atau mencoba mengakses sistem tanpa izin.",
                          },
                          {
                            title: "Konten dan jawaban AI",
                            description: "Jawaban AI dapat mengandung kekeliruan. Pengguna bertanggung jawab meninjau ketepatan informasi sebelum menggunakannya untuk keputusan akademik.",
                          },
                          {
                            title: "Perubahan layanan",
                            description: "Alerin dapat memperbarui fitur dan ketentuan dari waktu ke waktu. Perubahan penting akan diinformasikan melalui aplikasi.",
                          },
                        ].map(section => (
                          <section key={section.title} className="py-4 first:pt-0 last:pb-0">
                            <h2 className="text-sm font-bold text-[#1D293D]">{section.title}</h2>
                            <p className="mt-1.5 text-sm leading-6 text-slate-500">{section.description}</p>
                          </section>
                        ))}
                      </div>

                      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-bold text-slate-800">Butuh bantuan?</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">Hubungi pusat bantuan Alerin jika ada bagian dari syarat dan ketentuan yang ingin kamu tanyakan.</p>
                      </div>
                    </div>
                  )}

                  {profileView === "privacy" && (
                    <div className="mx-auto max-w-xl">
                      <button type="button" onClick={() => setPrivacyPersonalization(value => !value)} className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left">
                        <span><span className="block text-sm font-semibold text-slate-700">Personalisasi jawaban</span><span className="mt-1 block text-[11px] text-slate-400">Izinkan Alerin menggunakan data akademikmu.</span></span>
                        <span className={`relative h-6 w-11 shrink-0 rounded-full ${privacyPersonalization ? "bg-blue-600" : "bg-slate-300"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white ${privacyPersonalization ? "left-6" : "left-1"}`} /></span>
                      </button>
                      <button type="button" onClick={() => { setNotice("Riwayat berhasil dihapus dalam simulasi."); window.setTimeout(() => setNotice(""), 2200); }} className="mt-3 w-full rounded-xl border border-red-200 py-3 text-xs font-bold text-red-500 hover:bg-red-50">Hapus seluruh riwayat</button>
                      <button type="button" onClick={() => completeProfileAction("Pengaturan privasi disimpan.")} className="mt-3 w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white">Simpan</button>
                    </div>
                  )}

                  {profileView === "about" && (
                    <div className="mx-auto max-w-xl text-center">
                      <img src="/assets/alerin-logo.png" alt="Alerin" className="mx-auto h-20 w-20 rounded-2xl object-cover" />
                      <p className="mt-4 font-display text-xl font-bold text-slate-900">Alerin AI</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">Asisten akademik untuk membantu mahasiswa Indonesia belajar, meneliti, dan menyelesaikan tugas akhirnya.</p>
                      <p className="mt-4 text-xs text-slate-400">Versi simulasi 1.0.0</p>
                    </div>
                  )}
                </div>
              )}

              {/* Profil tab */}
              {profileView === "main" && subTab === "profil" && (
                <div className="grid gap-3 md:grid-cols-2">
                  {/* Detail Informasi */}
                  <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-base font-bold text-slate-900">Detail Informasi</p>
                      <button onClick={() => setProfileView("edit-profile")} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Edit</button>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {[
                        ["Nama Lengkap", nama],
                        ["Jenjang Akademik", jenjang.replace(/\s*\([^)]*\)/, "")],
                        ["Jurusan", prodi],
                        ["Semester", semester],
                        ["Kampus", universitas],
                      ].map(([label, value]) => (
                        <div key={label} className="flex min-h-11 items-center justify-between gap-4 py-2.5">
                          <span className="w-32 shrink-0 text-[13px] font-semibold text-slate-600">{label}</span>
                          <span className="text-right text-[13px] font-bold text-slate-800">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Akun & Keamanan */}
                  <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div className="mb-4 flex items-center gap-2">
                      <p className="mr-auto text-base font-bold text-slate-900">Akun &amp; Keamanan</p>
                      <button type="button" onClick={openAccountSecurity} className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700">Edit</button>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {[
                        { label: "Email", value: accountEmail },
                        { label: "Nomor Handphone", value: whatsapp },
                        { label: "Kata Sandi", value: "Ubah kata sandi" },
                        { label: "Lupa Kata Sandi", value: "Pulihkan akun" },
                      ].map(row => (
                        <div key={row.label} className="flex min-h-11 items-center justify-between gap-4 py-2.5">
                          <span className="text-[13px] font-semibold text-slate-600">{row.label}</span>
                          <span className="flex items-center gap-2 text-right">
                            <span className={`text-[13px] font-bold ${row.label === "Kata Sandi" || row.label === "Lupa Kata Sandi" ? "text-black" : "text-slate-800"}`}>{row.value}</span>
                            {row.action === "Kelola" && <button type="button" onClick={() => setProfileView("package")} className="text-[13px] font-semibold text-blue-600">Kelola</button>}
                            {row.action === "›" && <button type="button" onClick={() => setProfileView("password")} className="text-slate-400">›</button>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Paket Alerin Plus */}
                  <div className="w-full rounded-2xl bg-white p-5 md:col-span-2" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div className="flex flex-col gap-4 py-1 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <img src="/assets/7052b.png" alt="" className="h-16 w-16 rounded-2xl object-cover" />
                        <div>
                          <p className="font-display text-xl font-bold text-slate-900">Paket Alerin Plus</p>
                          <span className="mt-2 inline-flex rounded-full border border-solid border-[#558FDF] bg-[#558FDF] px-2 py-0.5 text-[10px] font-bold text-white">
                            Masa Aktif Sampai 30 Desember 2026
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <button type="button" onClick={() => setPackageModalOpen(true)} className="flex items-center justify-center rounded-lg border border-[#347CEA] bg-white px-5 py-3 text-xs font-bold uppercase text-[#347CEA] transition-colors hover:bg-blue-50">
                          Kelola Paket
                        </button>
                        <button type="button" onClick={() => setUpgradeModalOpen(true)} className="flex items-center justify-center rounded-lg bg-[#347CEA] px-5 py-3 text-xs font-bold uppercase text-white transition-colors hover:bg-blue-700">
                          Upgrade Paket
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Progres tab */}
              {profileView === "main" && subTab === "progres" && (
                <div className="grid items-start gap-3 md:grid-cols-[minmax(0,2fr)_minmax(220px,0.75fr)]">
                  <div
                    className="relative overflow-hidden rounded-2xl border border-blue-200 bg-blue-50 p-4 md:col-span-2 md:flex md:items-center md:justify-between md:gap-5 md:p-5"
                    style={{ boxShadow: "0 8px 24px rgba(37,99,235,0.08)" }}
                  >
                    <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-blue-200/40 blur-2xl" />
                    <div className="relative flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">Terintegrasi dengan Fitur Skripsi</p>
                          <span className="rounded-full border border-blue-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600">Tersinkron</span>
                        </div>
                        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600">
                          Progres di halaman ini terhubung dengan Fitur Skripsi. Akses fiturnya untuk melihat panduan lengkap, menyusun bab, mengelola revisi, dan mendapatkan bantuan di setiap tahap.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onTab("fitur")}
                      className="relative mt-4 flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 md:mt-0 md:w-auto"
                    >
                      Buka Fitur Skripsi
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>

                  {/* Tahapan skripsi */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div className="mb-5 flex flex-col items-start gap-3 border-b border-slate-200 pb-5 md:flex-row md:flex-wrap md:items-center md:justify-between">
                      <div className="w-full md:w-auto">
                        <p className="font-display text-xs font-bold uppercase tracking-wider text-blue-600">Tahapan Skripsi</p>
                        <p className="mt-1 whitespace-nowrap font-['Inter:Bold'] text-base font-bold text-slate-900">Jalur berdasarkan pedoman kampusmu</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Ilmu Komunikasi · S1</span>
                    </div>

                    <div>
                      {[
                        { title: "Persiapan topik & judul", description: "Selesai · judul sementara tersimpan", state: "done" },
                        { title: "Penyusunan proposal", description: "Bab I–II terverifikasi", state: "done" },
                        { title: "Revisi Bab III & instrumen", description: "Tahap saat ini · 2 penghambat", state: "active" },
                        { title: "Seminar proposal", description: "Target 18 Oktober 2026", state: "waiting" },
                        { title: "Pengumpulan data", description: "Belum dapat dimulai", state: "waiting" },
                        { title: "Pengolahan & analisis", description: "Belum dimulai", state: "waiting" },
                        { title: "Penulisan hasil & pembahasan", description: "Belum dimulai", state: "waiting" },
                        { title: "Finalisasi & sidang", description: "Belum dimulai", state: "waiting" },
                      ].map((stage, index, stages) => (
                        <div key={stage.title} className="relative flex min-h-16 gap-3">
                          {index < stages.length - 1 && <span className="absolute left-3 top-7 h-full w-px bg-slate-200" />}
                          <span
                            className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                              stage.state === "done"
                                ? "bg-emerald-500 text-white"
                                : stage.state === "active"
                                  ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                  : "border border-slate-200 bg-slate-100 text-slate-400"
                            }`}
                          >
                            {stage.state === "done" ? (
                              <img src="/assets/d6611.svg" alt="" />
                            ) : index + 1}
                          </span>
                          <div className="min-w-0 flex-1 pb-4">
                            <p className="text-sm font-semibold text-slate-800">{stage.title}</p>
                            <p className="mt-0.5 text-[11px] text-slate-400">{stage.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStage(stage.title);
                              setProfileView("stage-detail");
                            }}
                            className="self-start text-[11px] font-medium text-blue-600 hover:text-blue-700"
                          >
                            Detail
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risiko deadline */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                    <p className="font-display text-[11px] font-bold uppercase tracking-wider text-blue-600">Risiko Deadline</p>
                    <div className="relative mx-auto mt-4 h-28 w-44">
                      <svg width="176" height="104" viewBox="0 0 176 104" fill="none" aria-hidden="true">
                        <defs>
                          <linearGradient id="deadline-risk-gradient" x1="20" y1="90" x2="144" y2="22" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#84cc16" />
                            <stop offset="0.5" stopColor="#f59e0b" />
                            <stop offset="1" stopColor="#f97316" />
                          </linearGradient>
                        </defs>
                        <path d="M18 88a70 70 0 0 1 140 0" stroke="#f1f5f9" strokeWidth="14" strokeLinecap="round" />
                        <path d="M18 88a70 70 0 0 1 112-56" stroke="url(#deadline-risk-gradient)" strokeWidth="14" strokeLinecap="round" />
                      </svg>
                      <p className="absolute inset-x-0 bottom-2 text-center text-xl font-extrabold text-amber-500">Sedang</p>
                    </div>
                    <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                      Sempro masih memungkinkan tercapai jika dua penghambat utama selesai paling lambat 2 Oktober.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <p className="text-[10px] font-medium text-slate-400">Sisa waktu</p>
                        <p className="mt-1 text-xs font-bold text-slate-900">24 hari</p>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <p className="text-[10px] font-medium text-slate-400">Estimasi kebutuhan</p>
                        <p className="mt-1 text-xs font-bold text-slate-900">16–22 jam</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setProfileView("reset-plan")} className="mt-3 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      Atur ulang rencana
                    </button>
                  </div>
                </div>
              )}

              {/* Personalisasi tab */}
              {profileView === "main" && subTab === "personalisasi" && (
                <div className="space-y-3">
                  <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div className="mb-4">
                      <p className="text-base font-bold text-slate-900 md:text-[15px]">Gaya Bicara dan Karakteristik</p>
                      <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#1D293D] md:text-xs">Pilih cara Alerin menyampaikan jawaban agar lebih sesuai dengan keinginanmu</p>
                    </div>
                    <div className="grid max-h-[250px] gap-2.5 overflow-y-auto overscroll-contain pr-2 sm:max-h-none sm:grid-cols-2 sm:overflow-visible sm:pr-0">
                      {[
                        ["Default", "Gaya dan bahasa bawaan"],
                        ["Rapi dan Presisi", "Jawaban terstruktur dan jelas"],
                        ["Ramah", "Hangat dan akrab"],
                        ["Lugas", "Langsung ke inti"],
                        ["Nyentrik", "Menyenangkan dan imajinatif"],
                        ["Sinis", "Kritis dan analitis"],
                      ].map(([title, description]) => {
                        const active = communicationStyle === title;
                        return (
                          <button
                            key={title}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setCommunicationStyle(title)}
                            className={`rounded-xl border p-3 text-left transition-all ${active ? "border-blue-500 bg-[#455877] text-white shadow-sm ring-2 ring-blue-100" : "border-slate-100 bg-slate-50 hover:border-blue-200"}`}
                          >
                            <span className={`block text-[13px] font-bold md:text-xs ${active ? "text-white" : "text-[#1D293D]"}`}>{title}</span>
                            <span className={`mt-1 block text-xs font-medium md:text-[11px] ${active ? "text-slate-200" : "text-[#1D293D]"}`}>{description}</span>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.localStorage.setItem("alerin-communication-style", communicationStyle);
                        setNotice(`Gaya bicara "${communicationStyle}" berhasil disimpan.`);
                        window.setTimeout(() => setNotice(""), 2400);
                      }}
                      className="mt-4 w-full rounded-xl bg-[#347CEA] py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 md:text-[13px]"
                    >
                      {"Simpan\u00A0\u00A0"}
                    </button>
                  </div>

                  <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${privacyPersonalization ? "bg-[#347CEA]" : "bg-slate-400"}`}>
                        <img src="/assets/8fdb1.svg" alt="" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-['Inter:Bold'] text-base font-bold text-slate-900 md:text-[15px]">Memori Alerin</span>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={privacyPersonalization}
                            aria-label={privacyPersonalization ? "Nonaktifkan Memori Alerin" : "Aktifkan Memori Alerin"}
                            onClick={toggleAlerinMemory}
                            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${privacyPersonalization ? "bg-[#347CEA]" : "bg-slate-300"}`}
                          >
                            <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${privacyPersonalization ? "left-6" : "left-1"}`} />
                          </button>
                        </span>
                        <span className="mt-1 block font-['Inter:Medium'] text-[13px] font-medium leading-relaxed text-[#1D293D] md:text-xs">
                          Alerin mengingat konteks penting agar jawaban berikutnya lebih sesuai
                        </span>
                      </span>
                    </div>

                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className={`h-2 w-2 shrink-0 rounded-full ${privacyPersonalization ? "bg-emerald-500" : "bg-slate-300"}`} />
                          <span className="truncate font-['Inter:Semi_Bold'] text-[13px] font-semibold text-slate-700 md:text-xs">
                            {privacyPersonalization ? "Memori aktif" : "Memori dijeda"}
                          </span>
                        </span>
                        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 font-['Inter:Semi_Bold'] text-xs font-semibold text-slate-600 shadow-sm md:text-[11px]">
                          {knownItems.length} memori
                        </span>
                      </div>

                      {privacyPersonalization ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {knownItems.slice(0, 2).map(item => (
                            <span key={item} className="max-w-full truncate rounded-full border border-slate-200 bg-white px-3 py-1 font-['Inter:Regular'] text-xs text-slate-600 md:text-[11px]">{item}</span>
                          ))}
                          {knownItems.length > 2 && (
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-['Inter:Semi_Bold'] text-xs font-semibold text-blue-600 md:text-[11px]">+{knownItems.length - 2} lainnya</span>
                          )}
                          {knownItems.length === 0 && (
                            <p className="font-['Inter:Regular'] text-xs leading-relaxed text-slate-500 md:text-[11px]">Belum ada informasi yang disimpan.</p>
                          )}
                        </div>
                      ) : (
                        <p className="mt-2 font-['Inter:Regular'] text-xs leading-relaxed text-slate-500 md:text-[11px]">Data tetap tersimpan, tetapi sementara tidak digunakan.</p>
                      )}

                      <div className="mt-4 flex justify-end border-t border-slate-200 pt-3">
                        <button type="button" onClick={openManageData} className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-blue-600 transition-colors hover:border-blue-200 hover:bg-blue-50 md:text-xs">
                          Kelola memori Alerin
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-base font-bold text-[#1D293D] md:text-[15px]">Ringkasan memori</p>
                    <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-[#343941] md:text-xs">
                        Lihat ikhtisar tentang hal penting yang telah dipelajari Alerin tentangmu. Kamu tetap dapat mengelola setiap memori yang tersimpan.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProfileView("memory-summary")}
                      className="shrink-0 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-[13px] font-bold text-[#1D293D] transition-colors hover:border-blue-300 hover:bg-blue-50 md:text-xs"
                    >
                      Kelola
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <p className="text-base font-bold text-slate-900 md:text-[15px]">Tentang Kamu</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 md:text-[11px]">Nama panggilan</p>
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          role="textbox"
                          aria-label="Nama panggilan"
                          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] font-medium text-slate-700 outline-none transition-colors focus:border-blue-400 focus:bg-white md:text-xs"
                        >
                          Raka
                        </div>
                      </div>
                    </div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 md:text-[11px]">Deskripsi minat dan gaya riset</p>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      role="textbox"
                      aria-label="Deskripsi minat dan gaya riset"
                      aria-multiline="true"
                      className="min-h-24 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-[13px] leading-relaxed text-slate-600 outline-none transition-colors focus:border-blue-400 focus:bg-white md:text-xs"
                    >
                      Saya tertarik pada manajemen dan riset terapan. Saya lebih mudah memahami penjelasan melalui contoh serta latihan singkat.
                    </div>
                  </div>
                </div>
              )}

              {/* Umum tab */}
              {profileView === "main" && subTab === "umum" && (
                <div className="space-y-3">
                  {/* Mode bahasa */}
                  <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <p className="font-['Inter:Bold'] text-base font-bold text-slate-900 md:text-[15px]">Mode Bahasa</p>
                      <p className="text-right font-['Plus_Jakarta_Sans'] text-[13px] font-semibold leading-relaxed text-[#414243] md:text-xs">Pilih satu dari 27 bahasa</p>
                    </div>
                    <div className="grid max-h-80 gap-2.5 overflow-y-auto overscroll-contain pr-2 sm:grid-cols-2 lg:grid-cols-3">
                      {[
                        { id: "id", label: "Bahasa Indonesia", description: "Indonesia" },
                        { id: "en", label: "English", description: "English" },
                        { id: "ms", label: "Bahasa Melayu", description: "Malaysia" },
                        { id: "es", label: "Español", description: "Spanyol" },
                        { id: "fr", label: "Français", description: "Prancis" },
                        { id: "de", label: "Deutsch", description: "Jerman" },
                        { id: "pt", label: "Português", description: "Portugal & Brasil" },
                        { id: "it", label: "Italiano", description: "Italia" },
                        { id: "nl", label: "Nederlands", description: "Belanda" },
                        { id: "ru", label: "Русский", description: "Rusia" },
                        { id: "uk", label: "Українська", description: "Ukraina" },
                        { id: "pl", label: "Polski", description: "Polandia" },
                        { id: "tr", label: "Türkçe", description: "Turki" },
                        { id: "ar", label: "العربية", description: "Arab" },
                        { id: "fa", label: "فارسی", description: "Persia" },
                        { id: "hi", label: "हिन्दी", description: "India" },
                        { id: "bn", label: "বাংলা", description: "Bengali" },
                        { id: "ur", label: "اردو", description: "Urdu" },
                        { id: "zh", label: "中文", description: "Mandarin" },
                        { id: "ja", label: "日本語", description: "Jepang" },
                        { id: "ko", label: "한국어", description: "Korea" },
                        { id: "th", label: "ไทย", description: "Thailand" },
                        { id: "vi", label: "Tiếng Việt", description: "Vietnam" },
                        { id: "fil", label: "Filipino", description: "Filipina" },
                        { id: "sw", label: "Kiswahili", description: "Afrika Timur" },
                        { id: "sv", label: "Svenska", description: "Swedia" },
                        { id: "cs", label: "Čeština", description: "Ceko" },
                      ].map(option => {
                        const active = languageMode === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setLanguageMode(option.id)}
                            className={`relative min-h-profile-language-option rounded-xl border p-3 text-left transition-all ${active ? "border-profile-language bg-blue-50" : "border-slate-200 bg-white hover:border-blue-200"}`}
                          >
                            <span className={`block font-['Inter:Bold'] text-[13px] font-bold md:text-xs ${active ? "text-blue-700" : "text-slate-700"}`}>{option.label}</span>
                            <span className="mt-1 block font-['Inter:Regular'] text-xs text-slate-500 md:text-profile-caption md:text-slate-400">{option.description}</span>
                            <span className={`absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full border ${active ? "border-profile-language bg-profile-language" : "border-slate-300"}`}>
                              {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.localStorage.setItem("alerin-language", languageMode);
                        window.dispatchEvent(new CustomEvent("alerin-language-change", { detail: languageMode }));
                        setNotice("Perubahan bahasa berhasil disimpan.");
                        window.setTimeout(() => setNotice(""), 2400);
                      }}
                      className="mt-4 w-full rounded-xl bg-[#347CEA] py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 md:text-[13px]"
                    >
                      Simpan perubahan
                    </button>
                  </div>

                  {/* Tema */}
                  <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div className="mb-4">
                      <p className="text-base font-bold text-slate-900 md:text-[15px]">Tema Gelap dan Terang</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-slate-500 md:text-xs">Pilih tampilan yang paling nyaman untuk belajar.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "light" as const, label: "Terang", shell: "bg-slate-100", panel: "profile-theme-light-panel", line: "bg-slate-200" },
                        { id: "dark" as const, label: "Gelap", shell: "bg-slate-950", panel: "bg-slate-800", line: "bg-slate-600" },
                      ].map(option => {
                        const active = themeMode === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            aria-pressed={active}
                            onClick={(event) => {
                              const isDark = option.id === "dark";
                              const shell = event.currentTarget.closest(".h-screen");
                              setThemeMode(option.id);
                              shell?.classList.toggle("profile-dark", isDark);
                              if (shell instanceof HTMLElement) {
                                shell.style.backgroundColor = isDark ? "#0f172a" : "#ffffff";
                              }
                              document.documentElement.style.colorScheme = option.id;
                              window.localStorage.setItem("alerin-theme", option.id);
                            }}
                            className={`rounded-xl border p-2.5 text-left transition-all ${active ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200 hover:border-blue-200"}`}
                          >
                            <span className={`block rounded-lg p-2 ${option.shell}`}>
                              <span className={`block h-12 rounded-md p-2 ${option.panel}`}>
                                <span className={`block h-1.5 w-2/3 rounded-full ${option.line}`} />
                                <span className={`mt-2 block h-1.5 w-1/2 rounded-full ${option.line}`} />
                              </span>
                            </span>
                            <span className="mt-2 flex items-center justify-between px-0.5">
                              <span className="text-[13px] font-bold text-slate-700 md:text-xs">{option.label}</span>
                              <span className={`h-4 w-4 rounded-full border ${active ? "border-blue-500 bg-blue-500 ring-2 ring-blue-100" : "border-slate-300"}`} />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Menu list */}
                  <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                    {[
                      { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8M12 17v4M16 8l-4 4-2-2M12 5v7"/></svg>, label: "Pasang Pintasan", view: "edit-profile" as ProfileView },
                      { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/></svg>, label: "Kebijakan Privasi", view: "privacy-policy" as ProfileView },
                      { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11"/><path d="M8 7h6M8 11h6M8 15h3"/><path d="m16 19 2 2 4-4"/></svg>, label: "Syarat & Ketentuan", view: "terms" as ProfileView },
                    ].map((item, i) => (
                      <button key={i} type="button" onClick={() => {
                        if (i === 0) {
                          setNotice("Alerin dapat dipasang untuk desktop dan mobile.");
                          window.setTimeout(() => setNotice(""), 2600);
                          return;
                        }
                        setProfileView(item.view);
                      }} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span className="flex flex-col text-left">
                            <span className="text-sm font-medium text-slate-700">{item.label}</span>
                            {i === 0 && <span className="text-xs text-slate-500 md:text-[11px] md:text-slate-400">Untuk desktop dan mobile</span>}
                          </span>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                    ))}
                  </div>

                  {/* Keluar */}
                  <button type="button" onClick={() => setLogoutModalOpen(true)} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-red-500 border border-red-100 bg-white hover:bg-red-50 transition-colors" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Keluar
                  </button>
                </div>
              )}
            </div>

            {/* Right sidebar — desktop only */}
            <div className="hidden flex-col gap-3 w-72 shrink-0">
              {/* Yang Alerin ketahui */}
              <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-slate-800 text-sm">Yang Alerin ketahui</p>
                  <button type="button" onClick={openManageData} className="text-xs font-semibold text-blue-600 hover:text-blue-700">Kelola</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {knownItems.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-600 border border-slate-200 bg-slate-50">{t}</span>
                  ))}
                </div>
              </div>

              {/* Motivasi */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <p className="text-xs font-bold text-blue-700">Motivasi Hari Ini</p>
                </div>
                <p className="text-xs text-blue-700 leading-relaxed">Terus semangat, langkah kecil hari ini bisa jadi hasil besar nanti!</p>
              </div>

              {/* Premium upsell */}
              <div className="rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}>
                <p className="font-bold text-sm mb-1">✦ Alerin Premium</p>
                <p className="text-xs opacity-80 mb-3">Fitur lebih lengkap untuk perjalanan akademikmu.</p>
                <div className="space-y-1.5 mb-3">
                  {["Akses semua fitur AI", "Analisis mendalam", "Prioritas respons"].map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      <span className="text-xs opacity-90">{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={onRegister} className="w-full py-2 rounded-xl text-xs font-bold bg-white hover:bg-blue-50 transition-colors" style={{ color: "#2563eb" }}>
                  Daftar Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function AlerinPage() {
  const [tab, setTab] = useState<NavTab>("percakapan");
  const [historyMsgs, setHistoryMsgs] = useState<ChatMsg[] | undefined>(undefined);
  const [historyKey, setHistoryKey] = useState(0);
  const [pendingPrompt, setPendingPrompt] = useState<string | undefined>(undefined);
  const [pendingFeature, setPendingFeature] = useState<FeatureKey | undefined>(undefined);
  const [registerOpen, setRegisterOpen] = useState(false);

  const openHistory = (msgs: ChatMsg[]) => {
    setHistoryMsgs(msgs);
    setHistoryKey(k => k + 1);
    setTab("percakapan");
  };

  const goToChat = (prompt?: string) => {
    setPendingPrompt(prompt);
    setHistoryMsgs(undefined);
    setHistoryKey(k => k + 1);
    setTab("percakapan");
  };

  const goToFeature = (rec: FeatureRec) => {
    if (rec.featureKey) setPendingFeature(rec.featureKey);
    if (rec.tab) setTab(rec.tab);
  };

  return (
    <Shell activeTab={tab} onTab={(t) => { setTab(t); if (t === "percakapan") { setHistoryMsgs(undefined); setHistoryKey(k => k + 1); } if (t !== "fitur") setPendingFeature(undefined); }} onOpenHistory={openHistory} onNewChat={() => { setHistoryMsgs(undefined); setHistoryKey(k => k + 1); setTab("percakapan"); }}>
      {tab === "percakapan" && <PercakapanTab key={historyKey} onFeatureClick={() => setTab("fitur")} onTab={setTab} onFeatureRec={goToFeature} initialMsgs={historyMsgs} pendingPrompt={pendingPrompt} onPendingPromptConsumed={() => setPendingPrompt(undefined)} />}
      {tab === "fitur" && <FiturTab onChat={goToChat} openFeatureKey={pendingFeature} onFeatureOpened={() => setPendingFeature(undefined)} />}
      {tab === "proyek" && <ProyekTab onTab={setTab} onOpenHistory={openHistory} />}
      {tab === "progress" && <ProgressTab />}
      {tab === "quizlab" && <QuizlabTab onTab={setTab} />}
      {tab === "profil" && <ProfilTab onTab={setTab} onRegister={() => setRegisterOpen(true)} />}
      {registerOpen && (
        <RegisterErrorBoundary>
        <RegisterModal
          onClose={() => setRegisterOpen(false)}
          onFinish={(dest) => {
            setRegisterOpen(false);
            if (dest.featureKey) {
              setPendingFeature(dest.featureKey);
              setTab(dest.tab ?? "fitur");
            } else if (dest.tab && dest.tab !== "percakapan") {
              setTab(dest.tab);
            } else {
              goToChat(dest.prompt);
            }
          }}
        />
        </RegisterErrorBoundary>
      )}
    </Shell>
  );
}
