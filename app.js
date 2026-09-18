(() => {
  'use strict';

  const content = window.SITE_CONTENT || {};
  const projects = Array.isArray(content.projects) ? content.projects : [];
  const testimonials = Array.isArray(content.testimonials) ? content.testimonials : [];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const isSample = item => item.sample !== false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let revealObserver;
  let gallery = [];
  let galleryIndex = 0;
  let activeProject = null;
  let projectTrigger = null;
  let contactTrigger = null;

  // No analytics, uploads, third-party embeds, or browser persistence.
  function safeUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value, document.baseURI);
      if (url.username || url.password) return '';
      if (['https:', 'http:'].includes(url.protocol)) return url.href;
      // Supports opening the downloaded index.html directly on a computer.
      if (url.protocol === 'file:' && window.location.protocol === 'file:' && !/^[a-z]+:/i.test(value)) return url.href;
    } catch { /* Invalid links remain unavailable. */ }
    return '';
  }

  // These are explicitly labelled typographic development panels, never client work.
  // Add real files in content.js and they replace the panels automatically.
  function sampleVisual(style = 'poster') {
    const templates = {
      poster: '<span class="poster-kicker">RUANG TEMU<br>CREATIVE SESSION</span><div class="poster-title">IDE BESAR.<br><span class="outlined">MULAI</span><br>DARI SINI.</div><div class="poster-bottom"><span>DESAIN · CERITA · KOLABORASI<br>Contoh layout poster kegiatan</span><b>01</b></div>',
      video: '<span class="video-kicker">SEBUAH CATATAN KEGIATAN</span><div class="video-title">Cerita yang<br><em>layak diingat.</em></div><div class="video-bottom"><span class="video-play" aria-hidden="true">▶</span><span class="video-rule" aria-hidden="true"></span><span>VIDEO PREVIEW</span></div>',
      presentation: '<span class="slide-kicker">PRESENTATION DESIGN</span><div class="slide-title">Dari ide,<br>jadi <em>cerita.</em></div><div class="slide-footer"><span>Lebih visual. Lebih mudah dipahami.</span><b>01</b></div>',
      document: '<div class="document-paper"><p class="document-kicker">CONTOH DOKUMEN · DATA DUMMY</p><div class="document-heading">Laporan<br>Kegiatan Akademik</div><p class="document-section">01 — Pendahuluan</p><p class="document-text">Dokumen ini menggunakan teks contoh untuk memperlihatkan struktur laporan. Informasi disusun dengan hierarki judul, paragraf, dan jarak baca yang konsisten.</p><p class="document-section">02 — Pembahasan</p><p class="document-text">Materi dan identitas pada pratinjau ini bersifat ilustratif. Tidak memuat informasi milik pelanggan.</p><div class="document-page">01</div></div>'
    };
    const key = Object.hasOwn(templates, style) ? style : 'poster';
    const visual = make('div', `sample-visual visual-${key}`);
    visual.setAttribute('aria-hidden', 'true');
    visual.innerHTML = templates[key]; // Only the four fixed strings above; never user-supplied HTML.
    visual.append(make('span', 'sample-label', 'CONTOH LAYOUT'));
    return visual;
  }

  function coverElement(project, eager = false) {
    const src = safeUrl(project.cover);
    if (!src) return sampleVisual(project.coverStyle);
    const img = make('img');
    img.src = src;
    img.alt = project.coverAlt || project.title;
    img.width = 1200;
    img.height = 1000;
    img.loading = eager ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', () => {
      const fallback = make('div', 'sample-visual media-unavailable', 'Pratinjau belum tersedia.');
      img.replaceWith(fallback);
    }, { once: true });
    return img;
  }

  function renderCollage() {
    const featured = projects.filter(project => project.featured).slice(0, 4);
    const positions = ['poster', 'video', 'presentation', 'document'];
    const fragment = document.createDocumentFragment();
    featured.forEach((project, index) => {
      const link = make('a', `collage-piece collage-${positions[index]}`);
      link.href = '#projects';
      link.setAttribute('aria-label', `Lihat ${project.title}${isSample(project) ? ', contoh layout' : ''}`);
      link.append(coverElement(project, true));
      link.addEventListener('click', event => {
        event.preventDefault();
        openProject(project, link);
      });
      fragment.append(link);
    });
    $('#hero-collage').replaceChildren(fragment);
    $('#collage-caption').textContent = featured.some(isSample)
      ? 'Contoh layout · karya asli segera ditambahkan'
      : 'Sedikit dari karya yang pernah saya kerjakan.';
    if (!featured.length) {
      $('#hero-collage').append(make('p', 'media-unavailable', 'Karya pilihan segera ditambahkan.'));
      $('#collage-caption').hidden = true;
    }
  }

  function projectCard(project) {
    const article = make('article', 'project reveal');
    const cover = make('button', 'project-cover');
    cover.type = 'button';
    cover.setAttribute('aria-label', `Lihat Project: ${project.title}${isSample(project) ? ' (contoh)' : ''}`);
    cover.append(coverElement(project));
    const arrow = make('span', 'cover-action', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    cover.append(arrow);
    cover.addEventListener('click', () => openProject(project, cover));

    const meta = make('div', 'project-meta');
    const category = make('span', 'project-category', project.categoryLabel || project.category);
    if (isSample(project)) category.append(make('span', 'project-sample', 'Contoh'));
    meta.append(category, make('span', '', project.year));
    const title = make('h3', '', project.title);
    const summary = make('p', 'project-summary', project.description);
    const footer = make('div', 'project-footer');
    const button = make('button', 'text-link', 'Lihat Project');
    button.type = 'button';
    button.setAttribute('aria-label', `Lihat Project: ${project.title}`);
    const linkArrow = make('span', '', '↗');
    linkArrow.setAttribute('aria-hidden', 'true');
    button.append(linkArrow);
    button.addEventListener('click', () => openProject(project, button));
    footer.append(make('span', 'project-tools', `Tools: ${(project.tools || []).join(' / ')}`), button);
    article.append(cover, meta, title, summary, footer);
    return article;
  }

  function renderProjects(category = 'All') {
    const grid = $('#project-grid');
    if (revealObserver) $$('.reveal', grid).forEach(element => revealObserver.unobserve(element));
    const filtered = category === 'All' ? projects : projects.filter(project => project.category === category);
    grid.classList.toggle('is-filtered', category !== 'All');
    grid.replaceChildren(...filtered.map(projectCard));
    if (!filtered.length) grid.append(make('p', 'empty-state', 'Belum ada proyek di kategori ini. Coba kategori lainnya, ya.'));
    $('#filter-status').textContent = `${filtered.length} proyek ditampilkan${category === 'All' ? '' : ` untuk kategori ${category}`}.`;
    observeReveals(grid);
  }

  function renderTestimonials() {
    const cards = testimonials.map(review => {
      const article = make('article', 'testimonial reveal');
      const top = make('div', 'review-topline');
      top.append(make('span', '', isSample(review) ? 'CONTOH TESTIMONI' : 'KATA PELANGGAN'), make('span', 'review-category', review.category));
      const quote = make('blockquote', '', `“${review.quote}”`);
      const byline = make('div', 'review-person');
      const avatar = make('span', 'review-avatar', (review.name || '?').charAt(0));
      avatar.setAttribute('aria-hidden', 'true');
      byline.append(avatar, make('span', '', review.name));
      if (isSample(review)) byline.append(make('span', 'review-status', 'Placeholder'));
      article.append(top, quote, byline);
      return article;
    });
    $('#testimonials-grid').replaceChildren(...cards);
    $('#testimonial-demo-note').hidden = !testimonials.some(isSample);
    if (!cards.length) $('#testimonials-grid').append(make('p', 'empty-state', 'Ulasan pelanggan akan ditambahkan setelah mendapat izin.'));
  }

  function renderGallery() {
    const container = $('#project-dialog-media');
    $$('video', container).forEach(video => video.pause());
    container.replaceChildren();
    const preview = gallery[galleryIndex];
    if (!preview) {
      container.append(coverElement(activeProject, true));
    } else if (preview.type === 'video') {
      const video = make('video');
      video.src = safeUrl(preview.src);
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.setAttribute('aria-label', preview.alt || `Video ${activeProject.title}`);
      if (safeUrl(preview.poster)) video.poster = safeUrl(preview.poster);
      if (safeUrl(preview.captions)) {
        const track = make('track');
        track.kind = 'captions';
        track.label = 'Bahasa Indonesia';
        track.srclang = 'id';
        track.src = safeUrl(preview.captions);
        track.default = true;
        video.append(track);
      }
      video.addEventListener('error', () => container.replaceChildren(make('p', 'media-unavailable', 'Video belum bisa dimuat. Silakan buka hasil lengkap jika tersedia.')), { once: true });
      container.append(video);
    } else {
      const img = make('img');
      img.src = safeUrl(preview.src);
      img.alt = preview.alt || activeProject.coverAlt || activeProject.title;
      img.width = 1400;
      img.height = 1000;
      img.decoding = 'async';
      img.addEventListener('error', () => container.replaceChildren(make('p', 'media-unavailable', 'Gambar belum bisa dimuat. Silakan buka hasil lengkap jika tersedia.')), { once: true });
      container.append(img);
    }
    $('#gallery-controls').hidden = gallery.length <= 1;
    $('#gallery-counter').textContent = `${galleryIndex + 1} / ${gallery.length}`;
  }

  function openProject(project, trigger) {
    const dialog = $('#project-dialog');
    activeProject = project;
    projectTrigger = trigger;
    gallery = (project.previews || []).filter(preview => ['image', 'video'].includes(preview.type) && safeUrl(preview.src));
    galleryIndex = 0;
    $('#project-dialog-title').textContent = project.title;
    $('#project-dialog-meta').textContent = `${project.categoryLabel || project.category} · ${project.year}`;
    $('#project-dialog-description').textContent = project.description;
    $('#project-dialog-tools').textContent = (project.tools || []).join(' / ');
    $('#project-dialog-deliverable').textContent = project.deliverable || 'Sesuai kebutuhan proyek';
    $('#project-dialog-demo').hidden = !isSample(project);
    $('#project-dialog-privacy').hidden = !isSample(project) || !project.privacyNote;
    const link = $('#project-dialog-link');
    const url = safeUrl(project.projectUrl);
    link.hidden = !url;
    if (url) link.href = url;
    else link.removeAttribute('href');
    const serviceMap = { Design: 'Desain Grafis', Video: 'Video Editing', Presentation: 'Presentasi', Document: 'Tugas & Dokumen' };
    const contact = $('#project-dialog-contact');
    contact.dataset.service = serviceMap[project.category] || '';
    configureWhatsAppLink(contact);
    renderGallery();
    dialog.showModal();
    document.body.classList.add('dialog-open');
    dialog.scrollTop = 0;
    $('.icon-button', dialog).focus({ preventScroll: true });
  }

  function moveGallery(direction) {
    if (gallery.length < 2) return;
    galleryIndex = (galleryIndex + direction + gallery.length) % gallery.length;
    renderGallery();
  }
  $('#gallery-prev').addEventListener('click', () => moveGallery(-1));
  $('#gallery-next').addEventListener('click', () => moveGallery(1));

  // An empty number opens a transparent preview state, never a guessed recipient.
  function whatsappNumber() {
    const raw = String(content.whatsappNumber || '').trim();
    if (!/^\+?[\d\s()-]+$/.test(raw)) return '';
    let digits = raw.replace(/\D/g, '');
    if (digits.startsWith('08')) digits = `62${digits.slice(1)}`;
    return /^[1-9]\d{7,14}$/.test(digits) ? digits : '';
  }
  function briefText(service = '') {
    const greeting = content.whatsappGreeting || 'Halo Alfiji! Saya mau diskusi tentang kebutuhan digital saya.';
    return `${greeting}\n\nLayanan: ${service || '[desain / video / presentasi / dokumen]'}\nKebutuhan: \nDeadline: \nUkuran / durasi / jumlah halaman: \nMateri / referensi: \n\nBoleh diskusi detail dan estimasi biayanya?`;
  }
  function configureWhatsAppLink(link) {
    const number = whatsappNumber();
    if (number) {
      link.href = `https://wa.me/${number}?text=${encodeURIComponent(briefText(link.dataset.service))}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.removeAttribute('aria-haspopup');
    } else {
      link.href = '#contact';
      link.removeAttribute('target');
      link.setAttribute('aria-haspopup', 'dialog');
    }
  }
  function openContactPreview(link, channel) {
    contactTrigger = link;
    const contactLabel = channel === 'Telegram' ? 'Username Telegram' : 'Nomor WhatsApp';
    $('#contact-dialog-description').textContent = `${contactLabel} belum tersedia di pratinjau ini. Kamu bisa menyalin format brief berikut untuk disimpan dulu.`;
    $('#brief-text').value = briefText(link.dataset.service);
    $('#copy-status').textContent = '';
    $('#contact-dialog').showModal();
    document.body.classList.add('dialog-open');
    $('.icon-button', $('#contact-dialog')).focus({ preventScroll: true });
  }
  $$('[data-whatsapp]').forEach(link => {
    configureWhatsAppLink(link);
    link.addEventListener('click', event => {
      if (whatsappNumber()) return;
      event.preventDefault();
      openContactPreview(link, 'WhatsApp');
    });
  });

  function telegramUrl() {
    const username = String(content.telegramUsername || '').trim().replace(/^@/, '');
    // Accept only username characters, so this can never point to another domain.
    return /^[A-Za-z0-9_]+$/.test(username) ? `https://t.me/${encodeURIComponent(username)}` : '';
  }
  $$('[data-telegram]').forEach(link => {
    const url = telegramUrl();
    if (url) {
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else {
      link.setAttribute('aria-haspopup', 'dialog');
      link.addEventListener('click', event => {
        event.preventDefault();
        openContactPreview(link, 'Telegram');
      });
    }
  });

  $('#copy-brief').addEventListener('click', async () => {
    const textarea = $('#brief-text');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(textarea.value);
      $('#copy-status').textContent = 'Brief berhasil disalin. Kamu bisa menyimpannya dulu.';
    } catch {
      textarea.focus();
      textarea.select();
      $('#copy-status').textContent = 'Teks sudah dipilih. Tekan Ctrl+C / Cmd+C, atau pilih Salin pada ponsel.';
    }
  });

  $$('dialog').forEach(dialog => {
    $('[data-close-dialog]', dialog).addEventListener('click', () => dialog.close());
    let startedOutside = false;
    const outside = event => {
      const rect = dialog.getBoundingClientRect();
      return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    };
    dialog.addEventListener('pointerdown', event => { startedOutside = outside(event); });
    dialog.addEventListener('click', event => { if (event.target === dialog && startedOutside && outside(event)) dialog.close(); });
    dialog.addEventListener('close', () => {
      $$('video', dialog).forEach(video => video.pause());
      if (!$$('dialog[open]').length) document.body.classList.remove('dialog-open');
      const trigger = dialog.id === 'project-dialog' ? projectTrigger : contactTrigger;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    });
  });

  const menu = $('#main-nav');
  const menuToggle = $('.menu-toggle');
  const mobileQuery = window.matchMedia('(max-width: 720px)');
  function setMenu(open, focusToggle = false) {
    menu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    if (focusToggle) menuToggle.focus();
  }
  menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach(link => link.addEventListener('click', () => {
    setMenu(false);
    if (mobileQuery.matches) {
      const heading = $(link.getAttribute('href'))?.querySelector('h2');
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    }
  }));
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  });
  $('.site-header').addEventListener('focusout', event => {
    if (event.relatedTarget && !$('.site-header').contains(event.relatedTarget)) setMenu(false);
  });
  mobileQuery.addEventListener('change', () => setMenu(false));

  $$('.filter-button').forEach(button => button.addEventListener('click', () => {
    $$('.filter-button').forEach(other => {
      const selected = other === button;
      other.classList.toggle('is-active', selected);
      other.setAttribute('aria-pressed', String(selected));
    });
    renderProjects(button.dataset.filter);
  }));

  function observeReveals(root = document) {
    if (!revealObserver || reducedMotion.matches) return;
    $$('.reveal', root).forEach(element => {
      element.classList.add('is-waiting');
      revealObserver.observe(element);
    });
  }
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-waiting');
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: 0.07 });
  }
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      revealObserver?.disconnect();
      $$('.is-waiting').forEach(element => element.classList.remove('is-waiting'));
    }
  });

  $('#all-count').textContent = String(projects.length).padStart(2, '0');
  $('#project-demo-note').hidden = !projects.some(isSample);
  $('#year').textContent = String(new Date().getFullYear());
  renderCollage();
  renderProjects();
  renderTestimonials();
  observeReveals();
})();
