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
    const savedHtml = localStorage.getItem('adoralash_saved_main_html');
    if (savedHtml) {
      const mainEl = document.querySelector('main');
      if (mainEl) mainEl.innerHTML = savedHtml;
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
      mobileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      mobileBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  // Asistente de Mirada
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.advisor-btn');
    if (!btn || isDesignerMode) return;
    document.querySelectorAll('.advisor-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.getAttribute('data-target-service');
    if (target) {
      bupaService = target;
      const bupaChoice = document.querySelector(`.bupa-choice-btn[data-service="${target}"]`);
      if (bupaChoice) {
        document.querySelectorAll('.bupa-choice-btn').forEach(b => b.classList.remove('selected'));
        bupaChoice.classList.add('selected');
      }
    }
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('card-highlight'));
    const match = document.querySelector(`.service-card[data-card-id="${target}"]`);
    if (match) {
      match.classList.add('card-highlight');
      match.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  // =========================================================================
  // AGENDAMIENTO PSICOLÓGICAMENTE FÁCIL (ESTILO BUPA / 3 PASOS FLUIDOS)
  // =========================================================================
  let bupaService = 'Las Clásicas (Pelo a Pelo)';
  let bupaDay = 'Lo antes posible';
  let bupaTime = 'Mañana (10:00 - 13:30)';
  let isSubmitting = false;

  const progressFill = document.getElementById('progressFill');
  const pill1 = document.getElementById('pillStep1');
  const pill2 = document.getElementById('pillStep2');
  const pill3 = document.getElementById('pillStep3');
  const pane1 = document.getElementById('paneStep1');
  const pane2 = document.getElementById('paneStep2');
  const pane3 = document.getElementById('paneStep3');

  const goToStep = (step) => {
    if (pane1) pane1.style.display = step === 1 ? 'block' : 'none';
    if (pane2) pane2.style.display = step === 2 ? 'block' : 'none';
    if (pane3) pane3.style.display = step === 3 ? 'block' : 'none';

    if (pill1) pill1.classList.toggle('active', step >= 1);
    if (pill2) pill2.classList.toggle('active', step >= 2);
    if (pill3) pill3.classList.toggle('active', step >= 3);

    if (progressFill) {
      progressFill.style.width = step === 1 ? '33%' : (step === 2 ? '66%' : '100%');
    }

    if (step === 3) {
      const sumSrv = document.getElementById('summaryServiceText');
      const sumTime = document.getElementById('summaryTimeText');
      if (sumSrv) sumSrv.textContent = bupaService;
      if (sumTime) sumTime.textContent = `${bupaDay} • ${bupaTime.split(' ')[0]}`;
      const nameInput = document.getElementById('clientName');
      setTimeout(() => nameInput?.focus(), 120);
    }
  };

  // Paso 1: Selección de Servicio en 1 Clic (Avanza automáticamente al Paso 2)
  document.querySelectorAll('.bupa-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bupa-choice-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      bupaService = btn.getAttribute('data-service') || bupaService;
      setTimeout(() => goToStep(2), 200);
    });
  });

  // Paso 2: Selección de Día y Jornada en Chips
  document.querySelectorAll('#dayChipsContainer .time-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#dayChipsContainer .time-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      bupaDay = chip.getAttribute('data-val') || bupaDay;
    });
  });

  document.querySelectorAll('#timeChipsContainer .time-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#timeChipsContainer .time-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      bupaTime = chip.getAttribute('data-val') || bupaTime;
    });
  });

  document.getElementById('bupaBackTo1')?.addEventListener('click', () => goToStep(1));
  document.getElementById('bupaGoTo3')?.addEventListener('click', () => goToStep(3));
  document.getElementById('bupaBackTo2')?.addEventListener('click', () => goToStep(2));

  // Paso 3: Confirmación Directa a WhatsApp
  const clean = (s) => (s || '').replace(/[<>]/g, '').trim();
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

    const msg = `¡Hola Adora Lashes! 🎀✨ Mi nombre es *${name}*. Deseo consultar disponibilidad en Talca:\n\n` +
                `💖 *Servicio:* ${bupaService}\n` +
                `📅 *Preferencia de día:* ${bupaDay}\n` +
                `⏰ *Jornada:* ${bupaTime}\n\n` +
                `¿Tienen cupo disponible? ¡Muchas gracias! 💕\n(Enviado desde adoralash.cl)`;

    setTimeout(() => {
      sendWa(msg);
      notify('', '');
      isSubmitting = false;
    }, 300);
  });

  // Panel Secreto de Administración (3 clics en Logo o Ctrl+Alt+A)
  const modal = document.getElementById('secretAdminModal');
  const pinStep = document.getElementById('secretPinStep');
  const panelStep = document.getElementById('secretPanelStep');
  const pinIn = document.getElementById('secretPinInput');
  const waIn = document.getElementById('adminWaInput');
  const bannerIn = document.getElementById('adminBannerInput');

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

  const checkPin = () => {
    if (pinIn?.value.trim() === '741963852') {
      pinStep.style.display = 'none';
      panelStep.style.display = 'block';
      if (waIn) waIn.value = waPhone;
      if (bannerIn) bannerIn.value = document.querySelector('.top-announcement span')?.textContent || '';
    } else {
      alert('PIN de acceso incorrecto.');
      pinIn.value = '';
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

  // Botón del modal para entrar a Diseñador Visual
  document.getElementById('startVisualEditBtn')?.addEventListener('click', () => {
    toggleModal(false);
    setVisualEditState(true);
  });

  // Salir de Diseñador Visual
  document.getElementById('exitVisualBtn')?.addEventListener('click', () => {
    setVisualEditState(false);
  });

  // Guardar Cambios de Texto y Colores en el navegador
  document.getElementById('saveVisualBtn')?.addEventListener('click', () => {
    try {
      const mainEl = document.querySelector('main');
      if (mainEl) localStorage.setItem('adoralash_saved_main_html', mainEl.innerHTML);
      alert('💾 ¡Todos tus cambios de texto y colores quedaron guardados!');
    } catch (e) {
      alert('Guardado correctamente.');
    }
  });

  // Descargar el archivo index.html completo con todos los cambios hechos
  document.getElementById('downloadHtmlBtn')?.addEventListener('click', () => {
    setVisualEditState(false);
    const fullHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
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
