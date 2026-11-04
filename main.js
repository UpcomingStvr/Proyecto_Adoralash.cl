/**
 * ADORA LASHES - CLIENT SCRIPT SEGURO Y EDITOR VISUAL COMPLETO
 * Incluye: Navegación, Asistente de Mirada, Cero fugas de datos,
 * y Modo Diseñador en Vivo (Edición de textos en pantalla + Selector de Colores).
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  let waPhone = '56956407107';

  // Cargar colores y textos guardados del diseñador si existen
  try {
    const savedTheme = localStorage.getItem('adoralash_theme_colors');
    if (savedTheme) {
      const th = JSON.parse(savedTheme);
      if (th.rose) document.documentElement.style.setProperty('--rose', th.rose);
      if (th.blush) document.documentElement.style.setProperty('--blush-100', th.blush);
      if (th.bg) document.documentElement.style.setProperty('--bg-page', th.bg);
    }
    const savedVer = localStorage.getItem('adoralash_saved_ver');
    const CURRENT_VER = '2026.11-v2';
    if (savedVer === CURRENT_VER) {
      const savedHtml = localStorage.getItem('adoralash_saved_main_html');
      if (savedHtml) {
        const mainEl = document.querySelector('main');
        if (mainEl) mainEl.innerHTML = savedHtml;
      }
      const savedAvatar = localStorage.getItem('adoralash_saved_avatar');
      if (savedAvatar) {
        const av = document.querySelector('.brand-avatar-mini img');
        if (av) av.src = savedAvatar;
      }
    } else {
      localStorage.removeItem('adoralash_saved_main_html');
      localStorage.removeItem('adoralash_saved_ver');
      localStorage.removeItem('adoralash_saved_avatar');
    }
  } catch (e) {}

  // Carga dinámica de configuración
  fetch('config.json')
    .then(r => r.ok ? r.json() : null)
    .then(cfg => {
      if (!cfg) return;
      if (cfg.announcement) {
        const t = document.querySelector('.top-announcement span');
        if (t) t.textContent = cfg.announcement;
      }
      if (cfg.whatsappPhone) {
        waPhone = cfg.whatsappPhone.replace(/\D/g, '') || '56956407107';
      }
    }).catch(() => {});

  const sendWa = (txt) => {
    const cleanPhone = waPhone.replace(/\D/g, '') || '56956407107';
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(txt)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Botones WhatsApp centralizados (desactivados si está en modo diseñador)
  let isDesignerMode = false;
  document.addEventListener('click', (e) => {
    if (isDesignerMode) return;
    const btn = e.target.closest('.wa-btn');
    if (!btn) return;
    e.preventDefault();
    const act = btn.getAttribute('data-wa-action');
    const srv = btn.getAttribute('data-service') || '';
    if (act === 'catalog') sendWa('¡Hola Adora Lashes! 🎀✨ Quisiera solicitar el catálogo completo y disponibilidad en Talca.');
    else if (act === 'service') sendWa(`¡Hola Adora Lashes! 🎀✨ Quisiera consultar detalles y agendar para: *${srv}*.`);
    else sendWa('¡Hola Adora Lashes! 🎀✨ Quisiera hacer una consulta.');
  });

  // Menú móvil
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      mobileBtn.classList.toggle('active', open);
      mobileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      mobileBtn.classList.remove('active');
      mobileBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  // Modo Glam Nocturno (Dark Mode Chic)
  const themeToggle = document.getElementById('themeToggleBtn');
  try {
    if (localStorage.getItem('adoralash_dark_mode') === 'true') {
      document.documentElement.classList.add('dark-glam');
      if (themeToggle) themeToggle.textContent = '☀️';
    }
  } catch (e) {}
  themeToggle?.addEventListener('click', () => {
    const active = document.documentElement.classList.toggle('dark-glam');
    if (themeToggle) themeToggle.textContent = active ? '☀️' : '🌙';
    try { localStorage.setItem('adoralash_dark_mode', active ? 'true' : 'false'); } catch (e) {}
  });

  // Asesor Interactivo de Visagismo según Forma de Ojo
  const eyeData = {
    encapotado: {
      title: 'Efecto Wispy en Curva D',
      badge: 'Ideal Párpado Encapotado',
      desc: 'Para párpado caído o encapotado, la curvatura D combinada con espigas Wispy proyecta la fibra por encima del pliegue natural, abriendo la mirada de inmediato y disimulando la pesadez del párpado.',
      service: 'Wispy / Cat Eye'
    },
    redondo: {
      title: 'Efecto Cat Eye (Ojo de Gato)',
      badge: 'Ideal Ojos Redondos',
      desc: 'El diseño ascendente con longitud progresiva hacia la esquina exterior alarga visualmente el ojo, estilizándolo con un acabado delineado felino sumamente femenino.',
      service: 'Wispy / Cat Eye'
    },
    pequeno: {
      title: 'Volumen Tupido Aterciopelado',
      badge: 'Ideal Ojos Pequeños / Almendrados',
      desc: 'Aporta tridimensionalidad, profundidad y un efecto máscara intenso que hace ver los ojos más grandes, despiertos y fotogénicos.',
      service: 'Volumen Tupido'
    },
    rectas: {
      title: 'Lifting de Pestañas + Nutrición de Keratina',
      badge: 'Ideal Pestañas Rectas hacia abajo',
      desc: 'Eleva tu propia pestaña natural desde la raíz en 90°, fijando una curvatura permanente con tinte y nutrición profunda sin necesidad de extensiones.',
      service: 'Lifting de Pestañas + Nutrición'
    }
  };

  document.querySelectorAll('.advisor-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.advisor-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const eye = btn.getAttribute('data-eye');
      const info = eyeData[eye];
      if (!info) return;

      const t = document.getElementById('advisorResultTitle');
      const b = document.getElementById('advisorResultBadge');
      const d = document.getElementById('advisorResultDesc');
      const adopt = document.getElementById('advisorAdoptBtn');
      if (t) t.textContent = info.title;
      if (b) b.textContent = info.badge;
      if (d) d.textContent = info.desc;
      if (adopt) adopt.setAttribute('data-service', info.service);
    });
  });

  document.getElementById('advisorAdoptBtn')?.addEventListener('click', (e) => {
    const srv = e.currentTarget.getAttribute('data-service') || 'Las Clásicas (Pelo a Pelo)';
    bupaService = srv;
    const matchBtn = document.querySelector(`.bupa-choice-btn[data-service="${srv}"]`);
    if (matchBtn) {
      document.querySelectorAll('.bupa-choice-btn').forEach(b => b.classList.remove('selected'));
      matchBtn.classList.add('selected');
    }
    goToStep(2);
    document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Línea de Tiempo Interactiva de Retoques
  document.querySelectorAll('.timeline-tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.timeline-tab-btn').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const num = tab.getAttribute('data-tab');
      document.querySelectorAll('.timeline-pane').forEach(p => p.classList.remove('active'));
      const activePane = document.getElementById(`timelineDay${num}`);
      if (activePane) activePane.classList.add('active');
    });
  });

  // =========================================================================
  // AGENDAMIENTO MODERNO DE 2 PASOS (Cero fricción / Coordinación en WhatsApp)
  // =========================================================================
  let bupaService = 'Las Clásicas (Pelo a Pelo)';
  let isSubmitting = false;

  const progressFill = document.getElementById('progressFill');
  const pill1 = document.getElementById('pillStep1');
  const pill2 = document.getElementById('pillStep2');
  const pane1 = document.getElementById('paneStep1');
  const pane2 = document.getElementById('paneStep2');

  const goToStep = (step) => {
    if (pane1) pane1.style.display = step === 1 ? 'block' : 'none';
    if (pane2) pane2.style.display = step === 2 ? 'block' : 'none';

    if (pill1) pill1.classList.toggle('active', step >= 1);
    if (pill2) pill2.classList.toggle('active', step >= 2);

    if (progressFill) {
      progressFill.style.width = step === 1 ? '50%' : '100%';
    }

    if (step === 2) {
      const sumSrv = document.getElementById('summaryServiceText');
      if (sumSrv) sumSrv.textContent = bupaService;
      const nameInput = document.getElementById('clientName');
      setTimeout(() => nameInput?.focus(), 120);
    }
  };

  // Paso 1: Selección de Efecto en 1 Clic (Avanza fluidamente al Paso 2)
  document.querySelectorAll('.bupa-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bupa-choice-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      bupaService = btn.getAttribute('data-service') || bupaService;
      setTimeout(() => goToStep(2), 180);
    });
  });

  document.getElementById('bupaBackTo1')?.addEventListener('click', () => goToStep(1));

  // Paso 2: Confirmación Directa a WhatsApp con Sanitización Estricta
  const clean = (s) => (s || '').replace(/[<>"'&]/g, '').trim();
  const feedback = document.getElementById('formFeedback');
  const notify = (txt, cls) => { if (feedback) { feedback.textContent = txt; feedback.className = `form-feedback ${cls}`; } };

  document.getElementById('bupaSubmitBooking')?.addEventListener('click', () => {
    if (document.getElementById('websiteTrap')?.value.trim() !== '' || isSubmitting) return;

    const nameInput = document.getElementById('clientName');
    const name = clean(nameInput?.value);

    if (!name) {
      notify('Por favor, escribe tu nombre para continuar.', 'error');
      nameInput?.focus();
      return;
    }

    if (!document.getElementById('privacyConsent')?.checked) {
      notify('Por favor, acepta la política de privacidad.', 'error');
      return;
    }

    isSubmitting = true;
    notify('Abriendo WhatsApp oficial de forma segura...', 'success');

    const msg = `¡Hola Adora Lashes! 🎀✨ Mi nombre es *${name}*. Me gustaría consultar los cupos disponibles para *${bupaService}* en Talca.\n\n¿Qué días u horarios tienes disponibles? ¡Muchas gracias! 💕\n(Enviado desde adoralash.cl)`;

    setTimeout(() => {
      sendWa(msg);
      notify('', '');
      isSubmitting = false;
    }, 300);
  });

  // Panel Secreto de Administración (3 clics en Logo o Ctrl+Alt+A)
  // Criptografía Web: Hash SHA-256 con Salt (Cero contraseñas en texto plano)
  const modal = document.getElementById('secretAdminModal');
  const pinStep = document.getElementById('secretPinStep');
  const panelStep = document.getElementById('secretPanelStep');
  const pinIn = document.getElementById('secretPinInput');
  const waIn = document.getElementById('adminWaInput');
  const bannerIn = document.getElementById('adminBannerInput');

  const sha256 = async (str) => {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('adoralash_talca_2026_salt_' + str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  };
  const PIN_HASH = '1332f31a9b613510157f33a31cb75dea40c5cd04c4be1f1f99c1c85491ce419d';
  let pinAttempts = 0;
  let lockExpiry = 0;

  const toggleModal = (show) => {
    if (!modal) return;
    modal.style.display = show ? 'flex' : 'none';
    modal.setAttribute('aria-hidden', show ? 'false' : 'true');
    if (show) { pinStep.style.display = 'block'; panelStep.style.display = 'none'; pinIn.value = ''; setTimeout(() => pinIn?.focus(), 80); }
  };

  document.getElementById('secretAdminClose')?.addEventListener('click', () => toggleModal(false));

  let clicks = 0, timer;
  document.querySelector('.brand-logo')?.addEventListener('click', (e) => {
    clicks++;
    clearTimeout(timer);
    if (clicks >= 3) { e.preventDefault(); toggleModal(true); clicks = 0; }
    else timer = setTimeout(() => { clicks = 0; }, 500);
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      toggleModal(true);
    }
  });

  const checkPin = async () => {
    const now = Date.now();
    if (now < lockExpiry) {
      const wait = Math.ceil((lockExpiry - now) / 1000);
      alert(`⚠️ Demasiados intentos fallidos. Por seguridad, espera ${wait} segundos.`);
      return;
    }

    const val = pinIn?.value.trim() || '';
    if (!val) return;

    const hash = await sha256(val);
    if (hash === PIN_HASH) {
      pinAttempts = 0;
      pinStep.style.display = 'none';
      panelStep.style.display = 'block';
      if (waIn) waIn.value = waPhone;
      if (bannerIn) bannerIn.value = document.querySelector('.top-announcement span')?.textContent || '';
    } else {
      pinAttempts++;
      pinIn.value = '';
      if (pinAttempts >= 3) {
        lockExpiry = Date.now() + 60000;
        alert('⚠️ 3 intentos incorrectos. Bloqueo de seguridad activado por 60 segundos.');
      } else {
        alert(`PIN de acceso incorrecto. (Intento ${pinAttempts}/3)`);
      }
    }
  };

  document.getElementById('secretPinBtn')?.addEventListener('click', checkPin);
  pinIn?.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkPin(); });

  document.querySelectorAll('.quick-btn').forEach(b => b.addEventListener('click', () => {
    if (bannerIn) bannerIn.value = b.getAttribute('data-preset') || '';
  }));

  document.getElementById('secretSaveBtn')?.addEventListener('click', () => {
    const newWa = waIn?.value.trim(), newB = bannerIn?.value.trim();
    if (newWa) waPhone = newWa.replace(/\D/g, '') || '56956407107';
    if (newB) {
      const el = document.querySelector('.top-announcement span');
      if (el) el.textContent = newB;
    }
    alert('✨ ¡Ajustes actualizados en vivo!');
    toggleModal(false);
  });

  document.getElementById('secretDownloadBtn')?.addEventListener('click', () => {
    const cfg = { whatsappPhone: waIn?.value.trim() || waPhone, announcement: bannerIn?.value.trim() || '', studioStatus: "agendando" };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' }));
    a.download = 'config.json';
    a.click();
  });

  // =========================================================================
  // MODO DISEÑADOR VISUAL EN VIVO (Edición de textos en pantalla + Colores)
  // =========================================================================
  const designerToolbar = document.getElementById('designerToolbar');
  const colorPopover = document.getElementById('colorPopover');
  const editablesSelector = 'h1, h2, h3, h4, p, span, li, button, .tag-pill, .brand-name, .brand-sub, .work-label, .advisor-title, .gallery-caption, .care-step';

  const setVisualEditState = (active) => {
    isDesignerMode = active;
    document.body.classList.toggle('designer-mode-active', active);
    if (designerToolbar) designerToolbar.style.display = active ? 'flex' : 'none';
    if (!active && colorPopover) colorPopover.style.display = 'none';

    document.querySelectorAll(editablesSelector).forEach(el => {
      // Evitar que la toolbar o modal sean editables
      if (el.closest('.designer-bar') || el.closest('.color-picker-popover') || el.closest('.secret-admin-modal')) return;
      el.setAttribute('contenteditable', active ? 'true' : 'false');
    });
  };

  // Prevenir inyección de etiquetas HTML o scripts al pegar texto en modo diseñador
  document.addEventListener('paste', (e) => {
    if (!isDesignerMode) return;
    const target = e.target;
    if (target && target.isContentEditable) {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text/plain');
      const cleanText = (text || '').replace(/[<>]/g, '');
      document.execCommand('insertText', false, cleanText);
    }
  });

  // Reemplazo interactivo y ajuste de encuadre (posicionamiento y zoom) de fotos
  let activeImageToReplace = null;
  const hiddenPhotoInput = document.getElementById('hiddenPhotoInput');
  const photoAdjustModal = document.getElementById('photoAdjustModal');
  const closePhotoModal = document.getElementById('closePhotoModal');
  const triggerUploadBtn = document.getElementById('triggerUploadBtn');
  const applyPhotoModalBtn = document.getElementById('applyPhotoModalBtn');
  const posXRange = document.getElementById('posXRange');
  const posYRange = document.getElementById('posYRange');
  const zoomRange = document.getElementById('zoomRange');
  const posXVal = document.getElementById('posXVal');
  const posYVal = document.getElementById('posYVal');
  const zoomVal = document.getElementById('zoomVal');

  const updateImageTransform = () => {
    if (!activeImageToReplace) return;
    const x = posXRange ? posXRange.value : 50;
    const y = posYRange ? posYRange.value : 50;
    const z = zoomRange ? (zoomRange.value / 100).toFixed(2) : '1.00';
    
    if (posXVal) posXVal.textContent = `${x}%`;
    if (posYVal) posYVal.textContent = `${y}%`;
    if (zoomVal) zoomVal.textContent = `${(zoomRange.value / 100).toFixed(1)}x`;

    activeImageToReplace.style.objectPosition = `${x}% ${y}%`;
    if (parseFloat(z) > 1.0) {
      activeImageToReplace.style.transform = `scale(${z})`;
    } else {
      activeImageToReplace.style.transform = '';
    }
  };

  const openPhotoAdjust = (img) => {
    activeImageToReplace = img;
    let curX = 50, curY = 50, curZ = 100;
    const posMatch = (img.style.objectPosition || '').match(/(\d+)%\s+(\d+)%/);
    if (posMatch) {
      curX = parseInt(posMatch[1], 10);
      curY = parseInt(posMatch[2], 10);
    }
    const scaleMatch = (img.style.transform || '').match(/scale\(([\d.]+)\)/);
    if (scaleMatch) {
      curZ = Math.round(parseFloat(scaleMatch[1]) * 100);
    }
    if (posXRange) posXRange.value = curX;
    if (posYRange) posYRange.value = curY;
    if (zoomRange) zoomRange.value = curZ;
    if (posXVal) posXVal.textContent = `${curX}%`;
    if (posYVal) posYVal.textContent = `${curY}%`;
    if (zoomVal) zoomVal.textContent = `${(curZ / 100).toFixed(1)}x`;

    if (photoAdjustModal) {
      photoAdjustModal.style.display = 'flex';
      photoAdjustModal.setAttribute('aria-hidden', 'false');
    }
  };

  const closePhotoAdjust = () => {
    if (photoAdjustModal) {
      photoAdjustModal.style.display = 'none';
      photoAdjustModal.setAttribute('aria-hidden', 'true');
    }
  };

  closePhotoModal?.addEventListener('click', closePhotoAdjust);
  applyPhotoModalBtn?.addEventListener('click', () => {
    closePhotoAdjust();
    alert('✅ Encuadre listo. Presiona "💾 Guardar Cambios" para que quede guardado.');
  });

  posXRange?.addEventListener('input', updateImageTransform);
  posYRange?.addEventListener('input', updateImageTransform);
  zoomRange?.addEventListener('input', updateImageTransform);

  document.querySelectorAll('.photo-pos-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const x = btn.getAttribute('data-x');
      const y = btn.getAttribute('data-y');
      if (x !== null && y !== null && posXRange && posYRange) {
        posXRange.value = x;
        posYRange.value = y;
        updateImageTransform();
      }
    });
  });

  triggerUploadBtn?.addEventListener('click', () => {
    hiddenPhotoInput?.click();
  });

  const optimizeImage = (file, isAvatar = false) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = isAvatar ? 400 : 1200;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', isAvatar ? 0.88 : 0.86));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  document.addEventListener('click', (e) => {
    if (!isDesignerMode) return;
    const img = e.target.closest('img');
    if (!img) return;
    if (img.closest('.designer-bar') || img.closest('.color-picker-popover') || img.closest('.secret-admin-modal')) return;

    e.preventDefault();
    e.stopPropagation();
    openPhotoAdjust(img);
  });

  hiddenPhotoInput?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeImageToReplace) return;

    try {
      const isAvatar = Boolean(activeImageToReplace.closest('.brand-avatar-mini') || activeImageToReplace.closest('.insta-avatar-large'));
      const optimizedData = await optimizeImage(file, isAvatar);
      activeImageToReplace.src = optimizedData;
      activeImageToReplace.removeAttribute('srcset');

      activeImageToReplace.style.transition = 'transform 0.3s ease, filter 0.3s ease';
      activeImageToReplace.style.filter = 'brightness(1.12)';
      setTimeout(() => {
        if (activeImageToReplace) {
          activeImageToReplace.style.filter = '';
        }
      }, 500);

      alert('✨ ¡Foto cargada en alta calidad! Ahora puedes ajustar el encuadre con los deslizadores y presionar "Listo".');
    } catch (err) {
      alert('Hubo un detalle al procesar la foto. Intenta con un archivo JPG o PNG.');
    } finally {
      hiddenPhotoInput.value = '';
    }
  });

  // Botón del modal para entrar a Diseñador Visual
  document.getElementById('startVisualEditBtn')?.addEventListener('click', () => {
    toggleModal(false);
    setVisualEditState(true);
  });

  // Salir de Diseñador Visual
  document.getElementById('exitVisualBtn')?.addEventListener('click', () => {
    setVisualEditState(false);
  });

  // Guardar Cambios de Texto, Fotos y Colores en el navegador
  document.getElementById('saveVisualBtn')?.addEventListener('click', () => {
    try {
      const mainEl = document.querySelector('main');
      if (mainEl) {
        localStorage.setItem('adoralash_saved_main_html', mainEl.innerHTML);
        localStorage.setItem('adoralash_saved_ver', '2026.11-v2');
      }
      const av = document.querySelector('.brand-avatar-mini img');
      if (av && av.src && av.src.startsWith('data:')) {
        localStorage.setItem('adoralash_saved_avatar', av.src);
      }
      alert('💾 ¡Todos tus cambios de texto, fotos y colores quedaron guardados!');
    } catch (e) {
      alert('⚠️ Las fotos de alta resolución ocuparon la memoria local del navegador. Presiona "📥 Descargar Web" para descargar tu archivo index.html completo y listo.');
    }
  });

  // Descargar el archivo index.html completo con todos los cambios hechos
  document.getElementById('downloadHtmlBtn')?.addEventListener('click', () => {
    setVisualEditState(false);
    const clone = document.documentElement.cloneNode(true);
    clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
    const t = clone.querySelector('#designerToolbar');
    if (t) t.style.display = 'none';
    const c = clone.querySelector('#colorPopover');
    if (c) c.style.display = 'none';
    const m = clone.querySelector('#secretAdminModal');
    if (m) m.style.display = 'none';

    const fullHtml = '<!DOCTYPE html>\n' + clone.outerHTML;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([fullHtml], { type: 'text/html;charset=utf-8' }));
    a.download = 'index.html';
    a.click();
    setVisualEditState(true);
  });

  // Desplegar popover de colores
  document.getElementById('toggleColorsBtn')?.addEventListener('click', () => {
    if (!colorPopover) return;
    colorPopover.style.display = colorPopover.style.display === 'block' ? 'none' : 'block';
  });
  document.getElementById('closeColorPopover')?.addEventListener('click', () => {
    if (colorPopover) colorPopover.style.display = 'none';
  });

  // Aplicar paletas predefinidas de moda
  document.querySelectorAll('.preset-theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const r = btn.getAttribute('data-rose');
      const bl = btn.getAttribute('data-blush');
      const bg = btn.getAttribute('data-bg');
      if (r) {
        document.documentElement.style.setProperty('--rose', r);
        document.documentElement.style.setProperty('--rose-light', r);
      }
      if (bl) {
        document.documentElement.style.setProperty('--blush-100', bl);
        document.documentElement.style.setProperty('--blush-50', bg || bl);
      }
      if (bg) document.documentElement.style.setProperty('--bg-page', bg);

      const rInput = document.getElementById('customRoseColor');
      const bInput = document.getElementById('customBlushColor');
      if (rInput && r) rInput.value = r;
      if (bInput && bl) bInput.value = bl;

      try {
        localStorage.setItem('adoralash_theme_colors', JSON.stringify({ rose: r, blush: bl, bg: bg }));
      } catch (e) {}
    });
  });

  // Selector interactivo de color (Color Pickers en tiempo real)
  const applyCustomColors = () => {
    const r = document.getElementById('customRoseColor')?.value;
    const bl = document.getElementById('customBlushColor')?.value;
    if (r) document.documentElement.style.setProperty('--rose', r);
    if (bl) document.documentElement.style.setProperty('--blush-100', bl);
    try {
      localStorage.setItem('adoralash_theme_colors', JSON.stringify({ rose: r, blush: bl }));
    } catch (e) {}
  };

  document.getElementById('customRoseColor')?.addEventListener('input', applyCustomColors);
  document.getElementById('customBlushColor')?.addEventListener('input', applyCustomColors);
});
