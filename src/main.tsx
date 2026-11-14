import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'katex/dist/katex.min.css'
import './index.css'

// Sinkronkan tema gelap langsung saat halaman pertama kali dimuat agar tidak ada flash putih
if (typeof window !== 'undefined') {
  try {
    const isDark = window.localStorage.getItem('alerin-theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark', 'profile-dark', 'alerin-dark-theme');
      document.documentElement.style.colorScheme = 'dark';
      if (document.body) {
        document.body.classList.add('dark', 'profile-dark', 'alerin-dark-theme');
        document.body.style.backgroundColor = '#0f172a';
      }
    }
  } catch {}
}

// Tangani otomatis refresh jika terjadi pergantian chunk bundle setelah rilis baru di Vercel
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  window.location.reload();
});

window.addEventListener('error', (event) => {
  const msg = event?.message || '';
  if (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes('error loading dynamically imported module')
  ) {
    window.location.reload();
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
