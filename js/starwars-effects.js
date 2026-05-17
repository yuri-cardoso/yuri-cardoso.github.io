(function () {
  'use strict';

  /* =====================================================
     Som de Sabre de Luz — Web Audio API
     Sintetiza: ignição (pitch rising) + hum + crackle
  ===================================================== */
  function playLightsaberSound() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var now = ctx.currentTime;
      var dur = 0.7;

      /* --- Osciladores principais (o zumbido) --- */
      var osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(72, now);
      osc1.frequency.exponentialRampToValueAtTime(200, now + 0.14);
      osc1.frequency.exponentialRampToValueAtTime(160, now + 0.35);

      var osc2 = ctx.createOscillator();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(108, now);
      osc2.frequency.exponentialRampToValueAtTime(295, now + 0.14);
      osc2.frequency.exponentialRampToValueAtTime(240, now + 0.35);

      /* --- Ruído branco para o crackle --- */
      var bufLen = Math.ceil(ctx.sampleRate * dur);
      var noiseBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      var nd = noiseBuf.getChannelData(0);
      for (var i = 0; i < bufLen; i++) nd[i] = (Math.random() * 2 - 1) * 0.25;
      var noise = ctx.createBufferSource();
      noise.buffer = noiseBuf;

      /* --- Filtros --- */
      var bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 850;
      bandpass.Q.value = 2.8;

      var lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(2800, now);
      lowpass.frequency.exponentialRampToValueAtTime(700, now + 0.45);

      /* --- Gains --- */
      var masterGain = ctx.createGain();
      var noiseGain  = ctx.createGain();

      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.2, now + 0.04);
      masterGain.gain.setValueAtTime(0.17, now + 0.16);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.05);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      /* --- Conexões --- */
      osc1.connect(lowpass);
      osc2.connect(lowpass);
      lowpass.connect(masterGain);

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(masterGain);

      masterGain.connect(ctx.destination);

      /* --- Play --- */
      osc1.start(now);  osc1.stop(now + dur);
      osc2.start(now);  osc2.stop(now + dur);
      noise.start(now); noise.stop(now + dur);

    } catch (e) {
      /* Web Audio API indisponível — silencia sem erros */
    }
  }

  /* =====================================================
     Efeito Visual — Corte de Sabre de Luz
  ===================================================== */
  function playSlashEffect() {
    /* Remove instância anterior se ainda existir */
    var existing = document.getElementById('lightsaber-slash');
    if (existing) existing.parentNode.removeChild(existing);

    var slash = document.createElement('div');
    slash.id = 'lightsaber-slash';
    document.body.appendChild(slash);

    /* Remove o elemento após a animação terminar */
    setTimeout(function () {
      if (slash.parentNode) slash.parentNode.removeChild(slash);
    }, 700);
  }

  /* =====================================================
     Dispara som + visual juntos
  ===================================================== */
  function onSectionChange() {
    playLightsaberSound();
    playSlashEffect();
  }

  /* =====================================================
     Navegação por scroll do mouse entre seções
  ===================================================== */
  function initScrollNavigation() {
    var sections       = ['home', 'resume', 'badges', 'services'];
    var isCoolingDown  = false;
    var cooldown       = 1000; /* ms entre trocas de seção */

    /* Contador de scrolls no limite — exige 2 para trocar de seção */
    var boundaryCount  = 0;
    var boundaryDir    = 0;   /* 1 = baixo, -1 = cima */
    var resetTimer     = null;

    function getCurrentIndex() {
      var current = document.querySelector('.pt-page-current');
      if (!current) return 0;
      var id  = current.getAttribute('data-id');
      var idx = sections.indexOf(id);
      return idx >= 0 ? idx : 0;
    }

    function navigateTo(id) {
      var link = document.querySelector('a.pt-trigger[href*="#' + id + '"]');
      if (link) link.click();
    }

    function onWheel(e) {
      if (isCoolingDown) return;

      var delta      = e.deltaY !== undefined ? e.deltaY : (e.detail || -e.wheelDelta);
      if (delta === 0) return;

      var scrollTop    = window.scrollY || document.documentElement.scrollTop;
      var scrollHeight = document.documentElement.scrollHeight;
      var clientHeight = window.innerHeight;
      var tolerance    = 6;

      var atBottom = scrollTop + clientHeight >= scrollHeight - tolerance;
      var atTop    = scrollTop <= tolerance;
      var dir      = delta > 0 ? 1 : -1;

      var atBoundary = (dir === 1 && atBottom) || (dir === -1 && atTop);

      if (!atBoundary) {
        /* Dentro da página — scroll normal, zera o contador */
        boundaryCount = 0;
        boundaryDir   = 0;
        clearTimeout(resetTimer);
        return;
      }

      /* Mudou de direção no limite — reinicia a contagem */
      if (dir !== boundaryDir) {
        boundaryCount = 0;
        boundaryDir   = dir;
      }

      boundaryCount++;

      /* Reseta o contador se o usuário parar de rolar por 1.5s */
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        boundaryCount = 0;
        boundaryDir   = 0;
      }, 1500);

      /* 1º e 2º scroll no limite: segura (dá o "delay de resistência") */
      if (boundaryCount < 3) {
        e.preventDefault();
        return;
      }

      /* Terceiro scroll no limite: navega para a próxima/anterior seção */
      var idx  = getCurrentIndex();
      var next = dir === 1 ? idx + 1 : idx - 1;

      if (next < 0 || next >= sections.length) return;

      e.preventDefault();
      boundaryCount = 0;
      boundaryDir   = 0;
      isCoolingDown = true;

      /* Som direto aqui — ainda dentro do evento de gesto do usuário */
      playLightsaberSound();
      playSlashEffect();

      navigateTo(sections[next]);
      setTimeout(function () { window.scrollTo({ top: 0, behavior: 'instant' }); }, 50);
      setTimeout(function () { isCoolingDown = false; }, cooldown);
    }

    document.addEventListener('wheel',          onWheel, { passive: false });
    document.addEventListener('DOMMouseScroll',  onWheel, { passive: false });
  }

  /* =====================================================
     Inicialização — hookeia nos links de navegação
  ===================================================== */
  function init() {
    /* Links do menu desktop e mobile (classe .pt-trigger) */
    var navLinks = document.querySelectorAll('.pt-trigger');
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function () {
        /* Pequeno delay para o click ser processado primeiro */
        setTimeout(onSectionChange, 10);
      });
    }

    initScrollNavigation();
  }

  /* =====================================================
     Carrossel de subtítulos — 3 itens visíveis, scroll horizontal
  ===================================================== */
  function initTextRotation() {
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.owlCarousel === 'undefined') return;

    var $carousel = jQuery('.text-rotation');
    if (!$carousel.length) return;

    /* Aguarda o main.js terminar de inicializar o carousel original */
    setTimeout(function () {
      /* Destrói a instância atual */
      $carousel.trigger('destroy.owl.carousel');
      $carousel.removeClass('owl-loaded owl-drag owl-text-select-off');

      /* Reinicializa mostrando 3 itens com slide suave */
      $carousel.owlCarousel({
        loop:               true,
        dots:               false,
        nav:                false,
        margin:             24,
        autoplay:           true,
        autoplayHoverPause: false,
        autoplayTimeout:    1800,
        autoplaySpeed:      650,
        smartSpeed:         650,
        responsive: {
          0:   { items: 1 },
          500: { items: 2 },
          720: { items: 3 }
        }
      });
    }, 400);
  }

  /* =====================================================
     Chamas em volta do texto "by Yuri Cardoso"
  ===================================================== */
  function initHyperspaceFooter() {
    var copyrights = document.querySelector('footer .copyrights');
    if (!copyrights) return;

    /* Wrapper em volta do texto */
    var wrapper = document.createElement('div');
    wrapper.id  = 'hyperspace-wrapper';
    copyrights.parentNode.replaceChild(wrapper, copyrights);
    wrapper.appendChild(copyrights);

    /* Canvas atrás do texto */
    var canvas = document.createElement('canvas');
    canvas.id  = 'hyperspace-canvas';
    wrapper.insertBefore(canvas, copyrights);

    var ctx        = canvas.getContext('2d');
    var particles  = [];
    var MAX        = 90;
    var W, H;

    function resize() {
      W = canvas.width  = wrapper.offsetWidth;
      H = canvas.height = wrapper.offsetHeight;
    }

    function spawn() {
      var r = Math.random();
      var x, y;

      if (r < 0.5) {
        /* Borda inferior — maioria das chamas sobe daqui */
        x = Math.random() * W;
        y = H;
      } else if (r < 0.75) {
        /* Borda esquerda (metade de baixo) */
        x = 0;
        y = H * 0.4 + Math.random() * H * 0.6;
      } else {
        /* Borda direita (metade de baixo) */
        x = W;
        y = H * 0.4 + Math.random() * H * 0.6;
      }

      return {
        x:    x,
        y:    y,
        vx:   (Math.random() - 0.5) * 1.1,
        vy:   -(Math.random() * 1.8 + 0.8),
        turb: (Math.random() - 0.5) * 0.12,
        life: 1,
        dec:  Math.random() * 0.022 + 0.014,
        size: Math.random() * 7 + 3
      };
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);

      while (particles.length < MAX) particles.push(spawn());

      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];

        p.vx   += p.turb;
        p.x    += p.vx;
        p.y    += p.vy;
        p.life -= p.dec;

        if (p.life <= 0 || p.y < -p.size) { particles[i] = spawn(); continue; }

        var a    = p.life * 0.88;
        var size = p.size * (0.3 + p.life * 0.7);
        var g    = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);

        if (p.life > 0.55) {
          /* Núcleo quente — amarelo claro */
          g.addColorStop(0,   'rgba(255,240,160,' + a + ')');
          g.addColorStop(0.4, 'rgba(255,140,10,'  + (a * 0.85) + ')');
          g.addColorStop(1,   'rgba(210,30,0,0)');
        } else if (p.life > 0.28) {
          /* Meio — laranja */
          g.addColorStop(0,   'rgba(255,110,0,' + a + ')');
          g.addColorStop(0.5, 'rgba(190,30,0,'  + (a * 0.65) + ')');
          g.addColorStop(1,   'rgba(130,10,0,0)');
        } else {
          /* Pontas — vermelho escuro */
          g.addColorStop(0, 'rgba(160,15,0,' + a + ')');
          g.addColorStop(1, 'rgba(80,0,0,0)');
        }

        ctx.beginPath();
        ctx.fillStyle = g;
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener('resize', resize);
  }

  /* =====================================================
     Lightbox da foto de perfil — Magnific Popup
  ===================================================== */
  function initProfileLightbox() {
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.magnificPopup === 'undefined') return;
    jQuery('.profile-lightbox').magnificPopup({
      type: 'image',
      closeOnContentClick: true,
      closeBtnInside: false,
      fixedContentPos: true,
      image: {
        verticalFit: true
      },
      callbacks: {
        open: function () {
          /* Fecha qualquer som ao abrir a foto */
        }
      }
    });
  }

  /* Aguarda o DOM estar pronto */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
      initProfileLightbox();
      initTextRotation();
    });
  } else {
    init();
    initProfileLightbox();
    initTextRotation();
  }

}());
