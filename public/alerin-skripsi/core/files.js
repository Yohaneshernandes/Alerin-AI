'use strict';
/* Berkas: simpan di peramban, baca isi dokumen, unggah, dan unduh. */
let dbPromise;
function fileDB() {
  if (!dbPromise)
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open('alerin-skripsi-claude-attachments-v1', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('files');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  return dbPromise;
}
async function fileStore(operation, id, file) {
  const db = await fileDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('files', operation === 'get' ? 'readonly' : 'readwrite'),
      store = tx.objectStore('files');
    const request = operation === 'get' ? store.get(id) : operation === 'put' ? store.put(file, id) : store.delete(id);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => resolve(request.result);
    tx.onerror = () => reject(tx.error);
  });
}
const scriptLoads = {};
/* Muat pustaka pihak ketiga hanya saat dibutuhkan, sekali saja. */
function loadScript(src) {
  scriptLoads[src] ??= new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.onload = resolve;
    el.onerror = () => {
      delete scriptLoads[src];
      reject(Error('Pustaka pembaca berkas gagal dimuat. Periksa koneksi, lalu coba lagi.'));
    };
    document.head.appendChild(el);
  });
  return scriptLoads[src];
}
async function extractDocument(file) {
  const ext = file.name?.split('.').pop()?.toLowerCase();
  if (ext === 'txt') return { text: await file.text(), pages: null };
  if (ext === 'docx') {
    await loadScript('vendor/jszip.js');
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    const xml = await zip.file('word/document.xml')?.async('string');
    if (!xml) throw Error('Dokumen Word tidak memiliki teks yang dapat dibaca.');
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    return {
      text: [...doc.getElementsByTagNameNS('*', 'p')]
        .map(p => [...p.getElementsByTagNameNS('*', 't')].map(t => t.textContent).join(''))
        .join('\n'),
      pages: null,
    };
  }
  if (ext === 'pdf') {
    const pdfjs = await import(new URL('vendor/pdf.mjs', document.baseURI).href);
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('vendor/pdf.worker.mjs', document.baseURI).href;
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false })
      .promise;
    const pages = [];
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n),
        content = await page.getTextContent();
      let text = '',
        lastY = null;
      for (const item of content.items) {
        if (!('str' in item)) continue;
        const y = item.transform[5];
        if (lastY !== null && Math.abs(y - lastY) > 3) text += '\n';
        else if (text && !text.endsWith('\n')) text += ' ';
        text += item.str;
        if (item.hasEOL) text += '\n';
        lastY = y;
      }
      pages.push(text);
    }
    return { text: pages.join('\n\n'), pages: pdf.numPages };
  }
  throw Error('Gunakan naskah PDF, DOCX, atau daftar pustaka TXT.');
}
let downloadsNS;
async function saveFile(filename, data, type = 'text/plain;charset=utf-8') {
  const blob = data instanceof Blob ? data : new Blob([data], { type });
  try {
    if (window.claude && typeof window.claude.use === 'function') {
      if (downloadsNS === undefined) downloadsNS = await window.claude.use('downloads');
      if (downloadsNS) {
        await downloadsNS.save({ filename, data: blob });
        toast(`${filename} siap disimpan.`);
        return true;
      }
    }
  } catch (err) {
    if (err?.code === 'declined') {
      toast('Unduhan dibatalkan.');
      return false;
    }
    if (err?.code === 'rate_limited') {
      toast('Jendela unduhan sebelumnya masih terbuka. Coba lagi sebentar.', 'error');
      return false;
    }
    if (err?.code && !['unavailable', 'not_granted', 'capability_disabled', 'capability_removed'].includes(err.code)) {
      toast('Berkas belum dapat diunduh. Coba lagi.', 'error');
      return false;
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 20000);
  return true;
}
function download(name, content, type = 'text/plain;charset=utf-8') {
  return saveFile(name, content, type);
}
const UPLOAD_RULES = {
  periksa: ['pdf', 'docx', 'txt'],
  'home-draft': ['pdf', 'docx'],
  'home-naskah': ['pdf', 'docx'],
  revisi6: ['pdf', 'docx', 'jpg', 'jpeg', 'png', 'mp3', 'm4a'],
};
const uploadAllowed = ctx =>
  UPLOAD_RULES[ctx] || (ctx.startsWith('task-') ? ['pdf', 'docx', 'jpg', 'jpeg', 'png'] : ['pdf', 'docx']);
function refreshFileLists(ctx) {
  $$(`[data-file-list="${ctx}"]`).forEach(el => {
    el.outerHTML = fileList(ctx);
  });
}
/* Pesan unggah tampil di bawah kotak unggah yang dipakai, bukan hanya toast. */
function uploadMessage(context, msg) {
  const zone = $(`[data-file-context="${context}"]`)?.closest('.upload-zone');
  if (!zone) {
    if (msg) toast(msg, 'error', 7000);
    return;
  }
  const wrap = zone.parentElement;
  wrap.querySelector(`.field-error[data-upload-err="${context}"]`)?.remove();
  zone.classList.toggle('invalid', !!msg);
  if (msg) zone.insertAdjacentHTML('afterend', `<p class="field-error" role="alert" data-upload-err="${e(context)}">${e(msg)}</p>`);
}
async function uploadFiles(files, context) {
  const all = [...files],
    ok = uploadAllowed(context),
    errors = [];
  let count = 0;
  uploadMessage(context, '');
  if (all.length > 10) {
    uploadMessage(context, 'Maksimal 10 berkas dalam satu kali unggah.');
    return;
  }
  for (const file of all) {
    const ext = file.name.split('.').pop().toLowerCase();
    let mb = limit().mb;
    if (['jpg', 'jpeg', 'png'].includes(ext)) mb = { Gratis: 2, Plus: 5, Pro: 10 }[S.plan];
    if (['mp3', 'm4a'].includes(ext)) mb = { Gratis: 10, Plus: 15, Pro: 30 }[S.plan];
    if (!ok.includes(ext)) {
      errors.push(`${file.name}: format belum didukung. Gunakan ${ok.filter(x => x !== 'jpeg').map(x => x.toUpperCase()).join(', ')}.`);
      continue;
    }
    if (!file.size || file.size > mb * 1048576) {
      errors.push(`${file.name}: ${file.size ? `ukurannya ${fileSize(file.size)}, melebihi batas ${mb} MB` : 'berkasnya kosong'}.`);
      continue;
    }
    const bytes = await file.arrayBuffer();
    let h = 2166136261;
    for (const byte of new Uint8Array(bytes)) {
      h ^= byte;
      h = Math.imul(h, 16777619);
    }
    const hash = file.size + ':' + (h >>> 0).toString(16);
    if (S.files.some(f => f.context === context && f.hash === hash)) {
      errors.push(`${file.name}: berkas yang sama sudah ada di daftar.`);
      continue;
    }
    const meta = {
      id: uid(),
      context,
      name: file.name,
      size: file.size,
      type: file.type,
      hash,
      time: new Date().toISOString(),
    };
    try {
      await fileStore('put', meta.id, file);
      S.files.push(meta);
      count++;
    } catch {
      errors.push(`${file.name}: belum tersimpan karena penyimpanan peramban tidak tersedia.`);
    }
  }
  if (count) {
    record('Berkas ditambahkan', `${count} berkas`);
    persist();
    refreshFileLists(context);
    toast(count === 1 ? 'Berkas ditambahkan.' : `${count} berkas ditambahkan.`);
  }
  if (errors.length) uploadMessage(context, 'Ups! ' + errors.join(' '));
}
