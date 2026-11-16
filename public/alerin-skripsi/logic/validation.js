'use strict';
/* Aturan isian asal. */
function isAsal(v) {
  const s = String(v || '')
    .trim()
    .toLowerCase();
  if (!s) return false;
  if (/^(.)\1+$/.test(s.replace(/\s/g, ''))) return true;
  if (!/[aiueo]/.test(s)) return true;
  const compact = s.replace(/[^a-z]/g, '');
  if (/(asdf|sdfg|dfgh|fghj|ghjk|hjkl|jkl;|qwer|wert|erty|rtyu|tyui|yuio|uiop|zxcv|xcvb|cvbn|vbnm)/.test(compact))
    return true;
  if (s.split(/\s+/).filter(Boolean).length < 3 && compact.length < 12) return true;
  return false;
}
function isAsalShort(v) {
  const s = String(v || '')
    .trim()
    .toLowerCase();
  if (!s) return false;
  const c = s.replace(/[^a-z]/g, '');
  return /^(.)\1+$/.test(c) || !/[aiueo]/.test(c) || /(asdf|qwer|zxcv|hjkl|sdfg|jkl)/.test(c) || c.length < 2;
}
