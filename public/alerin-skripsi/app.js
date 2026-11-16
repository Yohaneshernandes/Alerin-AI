'use strict';
/* Titik masuk: satu penangan aksi, satu pendengar per jenis peristiwa, lalu tampilan pertama. */
async function runAction(command, button) {
  const [key, ...params] = command.split(':');
  const handler = ACTIONS[key];
  if (!handler) {
    console.warn('Aksi tanpa penangan:', command);
    toast('Aksi belum tersedia pada halaman ini.', 'error');
    return;
  }
  return handler(params.join(':'), button, key, command, params);
}

document.addEventListener('click', async ev => {
  const mentorLink = ev.target.closest('#mentor-link');
  if (mentorLink) {
    checkMentorLink(ev);
    return;
  }
  const btn = ev.target.closest('[data-action]');
  if (btn) {
    ev.preventDefault();
    if (btn.disabled) return;
    try {
      await runAction(btn.dataset.action, btn);
    } catch (error) {
      console.error('Alerin interaction error', error);
      toast('Aksi belum selesai. Coba ulangi; data tersimpan tetap tersedia.', 'error');
    }
    return;
  }
  if (ev.target.matches('[data-overlay]') && !modalBusy) closeModal();
  if (menuOpen && !ev.target.closest('.profile-menu,.profile-button')) {
    menuOpen = false;
    $('.profile-menu')?.remove();
    $('.profile-button')?.setAttribute('aria-expanded', 'false');
  }
});

/* Simpan otomatis sesaat setelah pengguna berhenti mengetik. */
let saveTimer;
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    if (unsaved) persist();
  }, 700);
}

document.addEventListener('input', ev => {
  const el = ev.target;
  const d = el.dataset;
  if (d.bind) {
    const [group, k] = d.bind.split('.');
    S[group][k] = el.value;
    unsaved = true;
    if (group === 'draft') S.draftSample = false;
  } else if (el.closest('#overlay-root') && el.matches('input,textarea,select')) modalDirty = true;
  const counter = $(`[data-count="${el.id}"]`);
  if (counter && el.maxLength > 0) counter.textContent = `${el.value.length}/${el.maxLength}`;
  if (el.id === 'command-search') $('#command-results').innerHTML = searchResults(el.value);
  if (d.dp) onSourceInput(el);
  if (el.id === 'dp-search') {
    S.biblio.query = el.value;
    unsaved = true;
    $('#dp-list').innerHTML = dpListHtml();
  }
  if (d.guide) {
    const [part, f] = d.guide.split(':');
    ensureGuide();
    (S.guide.fields[part] ??= {})[f] = el.value;
    unsaved = true;
  }
  if (d.periksa && el.tagName !== 'SELECT') {
    ensurePeriksa()[d.periksa] = el.value;
    unsaved = true;
  }
  if (d.mentor) onMentorInput(el);
  const invalid = el.closest('.field.invalid');
  if (invalid) {
    invalid.classList.remove('invalid');
    invalid.querySelector('.field-error')?.remove();
    el.removeAttribute('aria-invalid');
  }
  if (unsaved) scheduleSave();
});

document.addEventListener('change', async ev => {
  const el = ev.target;
  const d = el.dataset;
  if (d.bind) {
    const [group, k] = d.bind.split('.');
    S[group][k] = el.value;
    unsaved = true;
  }
  if (d.setting) {
    S.settings[d.setting] = el.type === 'checkbox' ? el.checked : el.value;
    persist();
    render();
    toast('Pengaturan tampilan tersimpan.');
  }
  if (d.fileContext && el.files.length) {
    await uploadFiles(el.files, d.fileContext);
    el.value = '';
  }
  if (d.dpNaskah && el.files?.length) {
    const file = el.files[0];
    el.value = '';
    await readNaskah(file);
  }
  if (d.periksa && el.tagName === 'SELECT') {
    const p = ensurePeriksa();
    p[d.periksa] = el.value;
    if (d.periksa === 'chapter') p.part = '';
    persist();
    render();
    return;
  }
  if (d.partSelect) {
    if (el.value === 'topic') ACTIONS['guide-view']('idea');
    else ACTIONS['guide-part'](el.value);
    $('#part-select')?.focus({ preventScroll: true });
    return;
  }
  if (el.id === 'guide-method') {
    const c = ensureKonteks();
    c.method = el.value;
    S.profile.method = el.value === 'Belum ditentukan' ? '' : el.value;
    record('Metode diperbarui', el.value);
    persist();
    render();
    $('#guide-method')?.focus({ preventScroll: true });
    toast('Metode diperbarui. Subbagian menyesuaikan metode.');
    return;
  }
  if (d.themeToggle) {
    S.settings.theme = el.checked ? 'dark' : 'light';
    persist();
    render();
    toast(el.checked ? 'Mode gelap aktif.' : 'Mode terang aktif.');
    return;
  }
  if (d.uji === 'kondisi') {
    S.profile.kondisi = el.value;
    setHome({ k: el.value, step: 'card', choosing: false });
    synchronizeResearch();
    persist();
    render();
    return;
  }
  const isText = el.tagName === 'TEXTAREA' || el.type === 'text';
  if (isText && !d.nocap && /^\s*[a-z]/.test(el.value)) {
    el.value = el.value.replace(/^(\s*)([a-z])/, (m, space, c) => space + c.toUpperCase());
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
});

document.addEventListener('dragover', ev => {
  if (ev.target.closest('.upload-zone')) ev.preventDefault();
});

document.addEventListener('drop', async ev => {
  const zone = ev.target.closest('.upload-zone');
  if (!zone) return;
  ev.preventDefault();
  const input = zone.querySelector('[data-file-context]');
  await uploadFiles(ev.dataTransfer.files, input.dataset.fileContext);
});

document.addEventListener('submit', ev => {
  ev.preventDefault();
  if (ev.target.id === 'chat-form') chatReply($('#chat-text').value);
});

document.addEventListener('keydown', ev => {
  const overlayOpen = $('#overlay-root').children.length > 0;
  if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'k') {
    ev.preventDefault();
    searchModal();
  }
  if (ev.key === 'Escape') {
    if (overlayOpen) {
      if (!modalBusy) closeModal();
    } else if (document.body.classList.contains('sidebar-open')) {
      document.body.classList.remove('sidebar-open');
      $('.mobile-menu')?.focus();
    } else if (chatOpen) {
      chatOpen = false;
      render();
    } else if (menuOpen) {
      menuOpen = false;
      render();
    }
  }
  if (ev.key === 'Tab' && overlayOpen) {
    const focusable = $$(
      '#overlay-root button,#overlay-root input:not([type=file]),#overlay-root textarea,#overlay-root select,#overlay-root a',
    ).filter(x => !x.disabled && x.getClientRects().length);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (ev.shiftKey && document.activeElement === first) {
      ev.preventDefault();
      last?.focus();
    } else if (!ev.shiftKey && document.activeElement === last) {
      ev.preventDefault();
      first?.focus();
    }
  }
});

window.addEventListener('hashchange', () => {
  if (unsaved) persist();
  menuOpen = false;
  document.body.classList.remove('sidebar-open');
  render();
  window.scrollTo({ top: 0 });
  $('#main')?.focus({ preventScroll: true });
});

window.addEventListener('beforeunload', () => {
  if (unsaved) persist();
});

window.addEventListener('resize', () => {
  if (!matchMedia('(max-width:760px)').matches) document.body.classList.remove('sidebar-open');
});

S = loadState();
normalizeState();
synchronizeResearch();
pushDueReminders();
render();
