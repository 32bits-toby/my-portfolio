// Main JS entry point
// Page-specific modules will be imported here as pages are built

import './styles/main.css';
import './styles/about.css';
import { initDock } from './dock.js';
import { initProjectPage } from './project-page.js';

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const isReducedMotion = () => motionQuery.matches;
const THEME_TRANSITION_KEY = 'theme-page-transition';
const THEME_TRANSITION_MAX_AGE = 1800;
const THEME_TRANSITION_NAVIGATE_DELAY = 480;
const THEME_TRANSITION_SETTLE_DURATION = 900;

// --- Shared Global Audio Engine ---
let sharedAudioCtx = null;
let audioEngineUnlocked = false;

const getSharedAudioCtx = () => {
  if (sharedAudioCtx) return sharedAudioCtx;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  try { sharedAudioCtx = new Ctor(); } catch (e) { return null; }
  return sharedAudioCtx;
};

const unlockSharedAudioEngine = (event) => {
  if (audioEngineUnlocked) return;
  const ctx = getSharedAudioCtx();
  if (!ctx) return;

  const handleUnlockSuccess = () => {
    if (audioEngineUnlocked) return;
    audioEngineUnlocked = true;

    // 1. Merge tooltip seamlessly into the click ripple
    const prompt = document.getElementById('audio-prompt');
    if (prompt) {
      prompt.classList.add('is-merging');
      setTimeout(() => prompt.remove(), 400);
    }

    // 2. Play ripple animation if it was a pointer/mouse/touch event
    if (event && (event.type === 'click' || event.type === 'pointerdown' || event.type === 'touchstart')) {
      let x = 0; let y = 0;
      if (event.touches && event.touches.length) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
      } else if (event.clientX !== undefined) {
        x = event.clientX;
        y = event.clientY;
      }

      if (x > 0 && y > 0) {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      }
    }

    // 3. Cleanup listeners
    ['click', 'touchstart', 'keydown', 'pointerdown', 'wheel', 'scroll', 'pointerover'].forEach((evt) => {
      window.removeEventListener(evt, unlockSharedAudioEngine, { capture: true });
    });
  };

  if (ctx.state === 'suspended') {
    ctx.resume().then(handleUnlockSuccess).catch(() => {});
  } else if (ctx.state === 'running') {
    handleUnlockSuccess();
  }

  try {
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch (e) {}
};

if (typeof window !== 'undefined') {
  const audioPromptDesktopQuery = window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)');

  // Bind an aggressive suite of listeners. Even if 'wheel' is ignored
  // by some browsers for audio unlock, 'click'/'pointerdown' guarantees
  // the entire site logic uses a unified, single unlockable context.
  ['click', 'touchstart', 'keydown', 'pointerdown', 'wheel', 'scroll', 'pointerover'].forEach((evt) => {
    window.addEventListener(evt, unlockSharedAudioEngine, { capture: true, passive: true });
  });

  // Setup cursor following logic for the audio onboarding prompt
  const promptEl = document.getElementById('audio-prompt');
  const heroEl = document.querySelector('.hero');

  if (promptEl && !audioPromptDesktopQuery.matches) {
    promptEl.remove();
  }

  if (promptEl && heroEl && audioPromptDesktopQuery.matches) {
    let mouseX = -100;
    let mouseY = -100;
    let targetX = -100;
    let targetY = -100;
    let isTracking = false;

    const updateCursor = () => {
      // Lerp for smooth magnetic trailing
      mouseX += (targetX - mouseX) * 0.2;
      mouseY += (targetY - mouseY) * 0.2;
      
      // Update CSS variables mapped to the translate3d transform
      promptEl.style.setProperty('--mouse-x', `${mouseX}px`);
      promptEl.style.setProperty('--mouse-y', `${mouseY}px`);

      // Keep ticking until the element visually catches up
      if (Math.abs(targetX - mouseX) > 0.1 || Math.abs(targetY - mouseY) > 0.1) {
        requestAnimationFrame(updateCursor);
      } else {
        isTracking = false;
      }
    };

    window.addEventListener('pointermove', (e) => {
      // If audio is already working, don't bother tracking
      if (audioEngineUnlocked) return;
      
      // Only show when comfortably inside the bounds of the hero section
      const heroRect = heroEl.getBoundingClientRect();
      const inHero = e.clientY >= heroRect.top && 
                     e.clientY <= heroRect.bottom && 
                     e.clientX >= heroRect.left && 
                     e.clientX <= heroRect.right;
      
      if (inHero) {
        targetX = e.clientX;
        targetY = e.clientY;
        
        if (!promptEl.classList.contains('is-visible')) {
          promptEl.classList.add('is-visible');
        }
        
        if (!isTracking) {
          isTracking = true;
          requestAnimationFrame(updateCursor);
        }
      } else {
        promptEl.classList.remove('is-visible');
      }
    });
  }
}
// ----------------------------------

const getPageTheme = (pathname = window.location.pathname) => (
  pathname.endsWith('/about.html') || pathname === '/about.html' ? 'dark' : 'light'
);

const getThemeTransitionColor = (theme) => (
  theme === 'dark' ? '#0f0f0f' : '#f7f7f7'
);

function releaseInitialPaintHold() {
  const root = document.documentElement;

  if (!root.classList.contains('is-app-loading')) {
    return;
  }

  const release = () => {
    root.classList.remove('is-app-loading');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.requestAnimationFrame(release);
    }, { once: true });
    return;
  }

  window.requestAnimationFrame(release);
}

function readThemeTransitionState({ consume = false } = {}) {
  let rawState = null;

  try {
    rawState = window.sessionStorage.getItem(THEME_TRANSITION_KEY);
  } catch {
    return null;
  }

  if (!rawState) {
    return null;
  }

  let transitionState = null;

  try {
    transitionState = JSON.parse(rawState);
  } catch {
    if (consume) {
      try {
        window.sessionStorage.removeItem(THEME_TRANSITION_KEY);
      } catch {
        // Ignore storage access errors.
      }
    }
    return null;
  }

  const isValid = (
    transitionState &&
    transitionState.theme === getPageTheme() &&
    (Date.now() - transitionState.timestamp) <= THEME_TRANSITION_MAX_AGE
  );

  if (consume) {
    try {
      window.sessionStorage.removeItem(THEME_TRANSITION_KEY);
    } catch {
      // Ignore storage access errors.
    }
  }

  return isValid ? transitionState : null;
}

function primeThemePageTransition() {
  if (isReducedMotion()) {
    try {
      window.sessionStorage.removeItem(THEME_TRANSITION_KEY);
    } catch {
      // Ignore storage access errors.
    }
    return;
  }

  const transitionState = readThemeTransitionState({ consume: true });

  if (!transitionState) {
    return;
  }

  const root = document.documentElement;

  root.style.setProperty('--page-transition-overlay', getThemeTransitionColor(transitionState.theme));
  root.classList.add('is-theme-transition-enter');
  root.classList.remove('is-theme-transitioning');
  root.classList.remove('is-theme-transition-settle');

  const releaseTransition = () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        root.classList.add('is-theme-transition-settle');

        window.setTimeout(() => {
          root.classList.remove('is-theme-transition-enter');
          root.classList.remove('is-theme-transition-settle');
          root.style.removeProperty('--page-transition-overlay');
        }, THEME_TRANSITION_SETTLE_DURATION);
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', releaseTransition, { once: true });
    return;
  }

  releaseTransition();
}

function initMotionMode() {
  const root = document.documentElement;

  if (isReducedMotion()) {
    root.classList.remove('is-motion-enabled');
    root.classList.add('is-motion-ready');
    return;
  }

  root.classList.add('is-motion-enabled');

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      root.classList.add('is-motion-ready');
    });
  });
}

/**
 * Adds a subtle, synthesised pop/tick sound on hover for each tool-dock item.
 *
 * Each item is assigned a slightly different pitch so that scrubbing across
 * the dock creates a pleasant, xylophone-like sweep.
 *
 * Uses the Web Audio API — no external sound files required.
 * Respects `prefers-reduced-motion` (skips entirely).
 */
function initDockHoverSounds() {
  const items = document.querySelectorAll('.tool-dock__item');

  if (!items.length || isReducedMotion()) {
    return;
  }

  const BASE_FREQ = 1000;
  const FREQ_STEP = 60;

  const playPop = (freq) => {
    const ctx = getSharedAudioCtx();
    if (!ctx) return;

    // Eagerly try to resume just in case the browser allows MEI skips
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // If still suspended after our best efforts, we can't play sound yet
    if (ctx.state !== 'running') return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.72, now + 0.055);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.065);
  };

  items.forEach((item, index) => {
    const freq = BASE_FREQ + index * FREQ_STEP;
    item.addEventListener('pointerenter', () => {
      playPop(freq);
    });
  });
}

function initThemePageTransitions() {
  if (isReducedMotion()) {
    return;
  }

  const currentTheme = getPageTheme();
  const root = document.documentElement;
  let isTransitioning = false;

  document.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (
        isTransitioning ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === '_blank' ||
        link.hasAttribute('download')
      ) {
        return;
      }

      const href = link.getAttribute('href');

      if (!href || href.startsWith('#')) {
        return;
      }

      const destination = new URL(link.href, window.location.href);

      if (
        destination.origin !== window.location.origin ||
        (destination.pathname === window.location.pathname && destination.search === window.location.search)
      ) {
        return;
      }

      const destinationTheme = getPageTheme(destination.pathname);

      event.preventDefault();
      isTransitioning = true;

      try {
        window.sessionStorage.setItem(THEME_TRANSITION_KEY, JSON.stringify({
          theme: destinationTheme,
          timestamp: Date.now(),
        }));
      } catch {
        // Ignore storage access errors; transition will still work on the outgoing page.
      }

      root.style.setProperty('--page-transition-overlay', getThemeTransitionColor(destinationTheme));
      root.classList.add('is-theme-transitioning');

      window.setTimeout(() => {
        window.location.href = destination.href;
      }, THEME_TRANSITION_NAVIGATE_DELAY);
    });
  });
}

function initScrollReveal() {
  const root = document.documentElement;
  const prepared = new Set();

  const prepareReveal = (element, type = 'up', delay = 0) => {
    if (!element || prepared.has(element)) {
      return;
    }

    prepared.add(element);
    element.dataset.reveal = type;
    element.style.setProperty('--reveal-delay', `${delay}ms`);
  };

  [
    ['.about__bio-card', 'soft'],
    ['.about__stats > .stat-block', 'scale'],
    ['.projects__header-text', 'soft'],
    ['.testimonials__header', 'soft'],
    ['.skills-banner', 'soft'],
    ['.gallery-page__heading', 'soft'],
    ['.about-page__title', 'soft'],
    ['.about-page__profile', 'scale'],
    ['.about-marquee__surface', 'soft'],
    ['.about-experience__intro', 'soft'],
    ['.project-detail__header', 'soft'],
    ['.project-detail__summary', 'soft'],
    ['.contact-section', 'soft'],
    ['.footer', 'soft'],
  ].forEach(([selector, type]) => {
    document.querySelectorAll(selector).forEach((element) => {
      prepareReveal(element, type);
    });
  });

  [
    ['.about__stats-row', '.stat-block', 'scale', 90],
    ['.projects__list', '.project-card', 'soft', 90],
    ['.testimonials__grid', '.testimonial-card', 'soft', 90],
    ['.gallery-grid', '.gallery-grid__item', 'scale', 70],
    ['.about-page__story', '.about-page__story-block, .about-page__actions', 'soft', 80],
    ['.about-experience__list', '.experience-card', 'soft', 70],
    ['.project-detail__meta-grid', '.project-detail__meta-item', 'soft', 70],
    ['.project-detail__accordion-list', '.project-detail__accordion', 'soft', 70],
    ['.project-detail__visual-stack', '.project-detail__visual-card', 'scale', 75],
  ].forEach(([parentSelector, childSelector, type, step]) => {
    document.querySelectorAll(parentSelector).forEach((parent) => {
      parent.querySelectorAll(childSelector).forEach((element, index) => {
        prepareReveal(element, type, index * step);
      });
    });
  });

  const revealElements = Array.from(document.querySelectorAll('[data-reveal]'));

  if (!revealElements.length) {
    return;
  }

  if (!root.classList.contains('is-motion-enabled')) {
    revealElements.forEach((element) => {
      element.classList.add('is-revealed');
    });
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -8% 0px',
  });

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

function initStatCounters() {
  const statNumbers = Array.from(document.querySelectorAll('.stat-block__number'));

  if (!statNumbers.length) {
    return;
  }

  const parsedNumbers = statNumbers
    .map((element) => {
      const match = element.textContent.trim().match(/^(\d+)(\+?)$/);

      if (!match) {
        return null;
      }

      return {
        element,
        target: Number(match[1]),
        suffix: match[2] || '',
      };
    })
    .filter(Boolean);

  if (!parsedNumbers.length) {
    return;
  }

  const animateValue = ({ element, target, suffix }) => {
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - ((1 - progress) ** 3);
      const current = Math.max(0, Math.round(target * eased));

      element.textContent = `${current}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      } else {
        element.textContent = `${target}${suffix}`;
      }
    };

    window.requestAnimationFrame(tick);
  };

  if (isReducedMotion()) {
    parsedNumbers.forEach((item) => {
      item.element.textContent = `${item.target}${item.suffix}`;
    });
    return;
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.counted === 'true') {
        return;
      }

      entry.target.dataset.counted = 'true';
      const counter = parsedNumbers.find((item) => item.element === entry.target);

      if (counter) {
        animateValue(counter);
      }

      counterObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.45,
  });

  parsedNumbers.forEach((item) => {
    counterObserver.observe(item.element);
  });
}

function initHeroGalleryPeek() {
  const hero = document.querySelector('.hero');
  const galleryPeekInner = document.querySelector('.gallery-peek__inner');

  if (!hero || !galleryPeekInner) {
    return;
  }

  let frameId = null;

  const updatePeekOffset = () => {
    frameId = null;

    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

    hero.style.setProperty('--hero-viewport-height', `${viewportHeight}px`);

    const heroHeight = hero.getBoundingClientRect().height;
    const galleryHeight = galleryPeekInner.getBoundingClientRect().height;
    const preferredVisibleHeight = parseFloat(window.getComputedStyle(hero).getPropertyValue('--hero-gallery-peek-visible')) || 0;
    const visibleHeight = Math.max(0, Math.min(galleryHeight, preferredVisibleHeight || (galleryHeight * 0.1)));
    const hiddenHeight = Math.max(0, galleryHeight - visibleHeight);
    const galleryTop = Math.max(0, heroHeight - visibleHeight);

    hero.style.setProperty('--hero-gallery-overflow', `${hiddenHeight}px`);
    hero.style.setProperty('--hero-gallery-visible-height', `${visibleHeight}px`);
    hero.style.setProperty('--hero-gallery-top', `${galleryTop}px`);
  };

  const scheduleUpdate = () => {
    if (frameId !== null) {
      return;
    }

    frameId = window.requestAnimationFrame(updatePeekOffset);
  };

  scheduleUpdate();
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate, { once: true });
  window.visualViewport?.addEventListener('resize', scheduleUpdate);

  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(galleryPeekInner);
  }

  const slides = Array.from(galleryPeekInner.querySelectorAll('[data-gallery-slide]'));
  const indicators = Array.from(galleryPeekInner.querySelectorAll('[data-gallery-indicator]'));

  if (!slides.length || slides.length !== indicators.length) {
    return;
  }

  const prefersReducedMotion = isReducedMotion();
  let activeIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
  let autoplayId = null;
  let slideTransitionId = 0;
  let outgoingTimeoutId = null;
  const slideTransitionDuration = 860;

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  const setActiveSlide = (nextIndex) => {
    const previousIndex = activeIndex;
    activeIndex = nextIndex;
    slideTransitionId += 1;
    const currentTransitionId = slideTransitionId;

    if (outgoingTimeoutId !== null) {
      window.clearTimeout(outgoingTimeoutId);
      outgoingTimeoutId = null;
    }

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;

      if (isActive) {
        slide.classList.add('is-active');
        slide.classList.remove('is-outgoing');
        slide.setAttribute('aria-hidden', 'false');
        return;
      }

      if (index !== previousIndex) {
        slide.classList.remove('is-active', 'is-outgoing');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    if (previousIndex >= 0 && previousIndex !== activeIndex) {
      const previousSlide = slides[previousIndex];
      previousSlide.classList.remove('is-active');
      previousSlide.classList.add('is-outgoing');
      previousSlide.setAttribute('aria-hidden', 'true');

      outgoingTimeoutId = window.setTimeout(() => {
        if (currentTransitionId !== slideTransitionId) {
          return;
        }

        previousSlide.classList.remove('is-outgoing');
        outgoingTimeoutId = null;
      }, slideTransitionDuration);
    }

    indicators.forEach((indicator, index) => {
      const isActive = index === activeIndex;
      indicator.classList.toggle('is-active', isActive);
      indicator.setAttribute('aria-pressed', String(isActive));
    });
  };

  const stopAutoplay = () => {
    if (autoplayId === null) {
      return;
    }

    window.clearInterval(autoplayId);
    autoplayId = null;
  };

  const startAutoplay = () => {
    if (prefersReducedMotion || slides.length < 2) {
      return;
    }

    stopAutoplay();
    autoplayId = window.setInterval(() => {
      setActiveSlide((activeIndex + 1) % slides.length);
    }, 4500);
  };

  const activateIndicator = (index) => {
    setActiveSlide(index);
    startAutoplay();
  };

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      activateIndicator(index);
    });

    indicator.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      activateIndicator(index);
    });
  });

  const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  let depthFrameId = null;
  let pointerRatioX = 0.5;
  let pointerRatioY = 0.5;

  const applyPeekDepth = () => {
    depthFrameId = null;

    const rotateY = (pointerRatioX - 0.5) * 8;
    const rotateX = (0.5 - pointerRatioY) * 6;
    const shiftX = (pointerRatioX - 0.5) * 18;
    const shiftY = (pointerRatioY - 0.5) * 14;

    galleryPeekInner.style.setProperty('--peek-rotate-x', `${rotateX.toFixed(2)}deg`);
    galleryPeekInner.style.setProperty('--peek-rotate-y', `${rotateY.toFixed(2)}deg`);
    galleryPeekInner.style.setProperty('--peek-shift-x', `${shiftX.toFixed(2)}px`);
    galleryPeekInner.style.setProperty('--peek-shift-y', `${shiftY.toFixed(2)}px`);
  };

  const schedulePeekDepth = () => {
    if (depthFrameId !== null) {
      return;
    }

    depthFrameId = window.requestAnimationFrame(applyPeekDepth);
  };

  const resetPeekDepth = () => {
    galleryPeekInner.classList.remove('is-peek-active', 'is-peek-pressed');
    if (depthFrameId !== null) {
      window.cancelAnimationFrame(depthFrameId);
      depthFrameId = null;
    }
    pointerRatioX = 0.5;
    pointerRatioY = 0.5;
    galleryPeekInner.style.setProperty('--peek-rotate-x', '0deg');
    galleryPeekInner.style.setProperty('--peek-rotate-y', '0deg');
    galleryPeekInner.style.setProperty('--peek-shift-x', '0px');
    galleryPeekInner.style.setProperty('--peek-shift-y', '0px');
  };

  if (!prefersReducedMotion && hoverQuery.matches) {
    galleryPeekInner.addEventListener('pointerenter', (event) => {
      galleryPeekInner.classList.add('is-peek-active');
      const rect = galleryPeekInner.getBoundingClientRect();
      pointerRatioX = (event.clientX - rect.left) / rect.width;
      pointerRatioY = (event.clientY - rect.top) / rect.height;
      schedulePeekDepth();
    });
    galleryPeekInner.addEventListener('pointermove', (event) => {
      const rect = galleryPeekInner.getBoundingClientRect();
      pointerRatioX = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      pointerRatioY = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
      schedulePeekDepth();
    });
    galleryPeekInner.addEventListener('pointerleave', resetPeekDepth);
    galleryPeekInner.addEventListener('pointercancel', resetPeekDepth);
    galleryPeekInner.addEventListener('pointerdown', () => {
      galleryPeekInner.classList.add('is-peek-pressed');
    });
    galleryPeekInner.addEventListener('pointerup', () => {
      galleryPeekInner.classList.remove('is-peek-pressed');
    });
  }

  galleryPeekInner.addEventListener('pointerenter', stopAutoplay);
  galleryPeekInner.addEventListener('pointerleave', () => {
    resetPeekDepth();
    startAutoplay();
  });
  galleryPeekInner.addEventListener('focusin', stopAutoplay);
  galleryPeekInner.addEventListener('focusout', (event) => {
    if (!galleryPeekInner.contains(event.relatedTarget)) {
      startAutoplay();
    }
  });

  resetPeekDepth();
  setActiveSlide(activeIndex);
  startAutoplay();
}

function initProjectCardParallax() {
  const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  const visuals = Array.from(document.querySelectorAll('.project-card__visual'));

  if (!visuals.length || isReducedMotion() || !hoverQuery.matches) {
    return;
  }

  visuals.forEach((visual) => {
    const media = visual.querySelector('.grey-block--project-visual');

    if (!media) {
      return;
    }

    let frameId = null;
    let pointerRatioX = 0.5;
    let pointerRatioY = 0.5;

    const applyParallax = () => {
      frameId = null;

      const panX = (pointerRatioX - 0.5) * 8;
      const panY = (pointerRatioY - 0.5) * 6;

      visual.style.setProperty('--project-visual-pan-x', `${panX.toFixed(2)}px`);
      visual.style.setProperty('--project-visual-pan-y', `${panY.toFixed(2)}px`);
    };

    const scheduleParallax = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(applyParallax);
    };

    const resetParallax = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }

      pointerRatioX = 0.5;
      pointerRatioY = 0.5;
      visual.style.setProperty('--project-visual-pan-x', '0px');
      visual.style.setProperty('--project-visual-pan-y', '0px');
    };

    visual.addEventListener('pointerenter', (event) => {
      const rect = visual.getBoundingClientRect();
      pointerRatioX = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      pointerRatioY = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
      scheduleParallax();
    });

    visual.addEventListener('pointermove', (event) => {
      const rect = visual.getBoundingClientRect();
      pointerRatioX = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      pointerRatioY = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
      scheduleParallax();
    });

    visual.addEventListener('pointerleave', resetParallax);
    visual.addEventListener('pointercancel', resetParallax);

    resetParallax();
  });
}

function initGalleryGridParallax() {
  const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  const items = Array.from(document.querySelectorAll('.gallery-grid__item'));

  if (!items.length || isReducedMotion() || !hoverQuery.matches) {
    return;
  }

  items.forEach((item) => {
    const media = item.querySelector('.gallery-grid__image');

    if (!media) {
      return;
    }

    let frameId = null;
    let pointerRatioX = 0.5;
    let pointerRatioY = 0.5;

    const applyParallax = () => {
      frameId = null;

      const panX = (pointerRatioX - 0.5) * 18;
      const panY = (pointerRatioY - 0.5) * 14;

      item.style.setProperty('--gallery-item-pan-x', `${panX.toFixed(2)}px`);
      item.style.setProperty('--gallery-item-pan-y', `${panY.toFixed(2)}px`);
    };

    const scheduleParallax = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(applyParallax);
    };

    const resetParallax = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }

      pointerRatioX = 0.5;
      pointerRatioY = 0.5;
      item.classList.remove('is-parallax-active');
      item.style.setProperty('--gallery-item-pan-x', '0px');
      item.style.setProperty('--gallery-item-pan-y', '0px');
    };

    item.addEventListener('pointerenter', (event) => {
      const rect = item.getBoundingClientRect();
      pointerRatioX = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      pointerRatioY = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
      item.classList.add('is-parallax-active');
      scheduleParallax();
    });

    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      pointerRatioX = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      pointerRatioY = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
      scheduleParallax();
    });

    item.addEventListener('pointerleave', resetParallax);
    item.addEventListener('pointercancel', resetParallax);

    resetParallax();
  });
}

function initProjectDetailVisualParallax() {
  const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  const frames = Array.from(document.querySelectorAll('.project-detail__visual-frame--media'));

  if (!frames.length || isReducedMotion() || !hoverQuery.matches) {
    return;
  }

  frames.forEach((frame) => {
    const media = frame.querySelector('.project-detail__visual-media');

    if (!media) {
      return;
    }

    let frameId = null;
    let pointerRatioX = 0.5;
    let pointerRatioY = 0.5;

    const applyParallax = () => {
      frameId = null;

      const panX = (pointerRatioX - 0.5) * 16;
      const panY = (pointerRatioY - 0.5) * 12;

      frame.style.setProperty('--project-detail-visual-pan-x', `${panX.toFixed(2)}px`);
      frame.style.setProperty('--project-detail-visual-pan-y', `${panY.toFixed(2)}px`);
    };

    const scheduleParallax = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(applyParallax);
    };

    const resetParallax = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }

      pointerRatioX = 0.5;
      pointerRatioY = 0.5;
      frame.style.setProperty('--project-detail-visual-pan-x', '0px');
      frame.style.setProperty('--project-detail-visual-pan-y', '0px');
    };

    frame.addEventListener('pointerenter', (event) => {
      const rect = frame.getBoundingClientRect();
      pointerRatioX = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      pointerRatioY = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
      scheduleParallax();
    });

    frame.addEventListener('pointermove', (event) => {
      const rect = frame.getBoundingClientRect();
      pointerRatioX = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      pointerRatioY = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
      scheduleParallax();
    });

    frame.addEventListener('pointerleave', resetParallax);
    frame.addEventListener('pointercancel', resetParallax);

    resetParallax();
  });
}

function initHomeHangingNav() {
  const nav = document.querySelector('.page--home .nav--hanging');
  const frame = nav?.querySelector('.nav__frame');
  const rightString = nav?.querySelector('.nav__string--right');
  const handle = nav?.querySelector('.nav__repair-handle');

  if (!nav || !frame || !rightString || !handle || isReducedMotion()) {
    return;
  }

  const desktopQuery = window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)');
  const repairSnapDistance = 28;
  const repairProgressThreshold = 0.84;
  const scrollInitGraceMs = 700;
  const activeScrollGapMs = 220;
  let scrollFrameId = null;
  let draggingPointerId = null;
  let repairProgress = 0;
  let repairStartPoint = null;
  let repairTargetPoint = null;
  let repairVector = null;
  let lastScrollTick = 0;
  let lastScrollY = window.scrollY;
  let activeScrollMs = 0;
  let scrollDistance = 0;
  let breakActiveMsTarget = 900 + (Math.random() * 1300);
  let breakDistanceTarget = 120 + (Math.random() * 220);
  let hasBroken = false;
  let hasRepaired = false;
  let lastRepairFeedbackStep = 0;
  let navNoiseBuffer = null;
  const initTimestamp = performance.now();
  const canVibrate = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const primeNavAudio = () => {
    const context = getSharedAudioCtx();

    if (!context || context.state === 'running') {
      return;
    }

    context.resume().catch(() => {
      // Ignore audio resume failures; sound is optional polish.
    });
  };

  const getNavNoiseBuffer = (context) => {
    if (!context) {
      return null;
    }

    if (navNoiseBuffer && navNoiseBuffer.sampleRate === context.sampleRate) {
      return navNoiseBuffer;
    }

    const bufferLength = Math.max(1, Math.floor(context.sampleRate * 0.08));
    const buffer = context.createBuffer(1, bufferLength, context.sampleRate);
    const channel = buffer.getChannelData(0);

    for (let index = 0; index < bufferLength; index += 1) {
      const decay = 1 - (index / bufferLength);
      channel[index] = ((Math.random() * 2) - 1) * decay;
    }

    navNoiseBuffer = buffer;
    return navNoiseBuffer;
  };

  const vibrateNav = (pattern) => {
    if (!canVibrate) {
      return;
    }

    navigator.vibrate(pattern);
  };

  const playNavSnapSound = () => {
    const context = getSharedAudioCtx();

    if (!context || context.state !== 'running') {
      return;
    }

    const now = context.currentTime + 0.005;
    const masterGain = context.createGain();
    masterGain.gain.value = 0.15; // Lowered from 0.5 for a more subtle, tactile sound
    masterGain.connect(context.destination);

    // 1. Snip/Friction noise (high frequency burst)
    const noise = context.createBufferSource();
    noise.buffer = getNavNoiseBuffer(context);

    const noiseFilter = context.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(4000, now);
    noiseFilter.Q.setValueAtTime(1.0, now);

    const noiseGain = context.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.exponentialRampToValueAtTime(2.0, now + 0.015);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    // 2. Sharp string "twang"/snap (high-pitched tension breaking)
    const twang = context.createOscillator();
    twang.type = 'sine';
    twang.frequency.setValueAtTime(2500, now);
    twang.frequency.exponentialRampToValueAtTime(600, now + 0.03);

    const twangGain = context.createGain();
    twangGain.gain.setValueAtTime(1.2, now);
    twangGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    twang.connect(twangGain);
    twangGain.connect(masterGain);

    // 3. Low-end "thud" for the physical break impact
    const thud = context.createOscillator();
    thud.type = 'triangle';
    thud.frequency.setValueAtTime(200, now);
    thud.frequency.exponentialRampToValueAtTime(40, now + 0.05);

    const thudGain = context.createGain();
    thudGain.gain.setValueAtTime(0.8, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    thud.connect(thudGain);
    thudGain.connect(masterGain);

    noise.start(now);
    noise.stop(now + 0.1);

    twang.start(now);
    twang.stop(now + 0.05);

    thud.start(now);
    thud.stop(now + 0.07);
  };

  const emitRepairFeedback = (progress) => {
    const normalizedProgress = clamp(progress, 0, 1);
    const feedbackStep = Math.min(4, Math.floor(normalizedProgress * 4));

    if (feedbackStep <= lastRepairFeedbackStep) {
      return;
    }

    lastRepairFeedbackStep = feedbackStep;
    vibrateNav(feedbackStep >= 4 ? 12 : 7);
  };

  const setRepairProgress = (value) => {
    repairProgress = clamp(value, 0, 1);
    nav.style.setProperty('--nav-repair-progress', repairProgress.toFixed(3));
  };

  const clearRepairProgress = () => {
    repairProgress = 0;
    nav.style.removeProperty('--nav-repair-progress');
  };

  const resetBreakTriggerState = () => {
    lastScrollTick = 0;
    lastScrollY = window.scrollY;
    activeScrollMs = 0;
    scrollDistance = 0;
    breakActiveMsTarget = 900 + (Math.random() * 1300);
    breakDistanceTarget = 120 + (Math.random() * 220);
  };

  const resetVisualState = () => {
    nav.classList.remove('is-nav-breaking', 'is-nav-broken', 'is-nav-dragging', 'is-nav-repairing');
    if (draggingPointerId !== null && handle.hasPointerCapture(draggingPointerId)) {
      handle.releasePointerCapture(draggingPointerId);
    }
    clearRepairProgress();
    draggingPointerId = null;
    repairStartPoint = null;
    repairTargetPoint = null;
    repairVector = null;
    lastRepairFeedbackStep = 0;
    hasBroken = false;
    hasRepaired = false;
    resetBreakTriggerState();
  };

  const breakNav = () => {
    if (hasBroken || hasRepaired || !desktopQuery.matches) {
      return;
    }

    hasBroken = true;
    nav.classList.add('is-nav-breaking', 'is-nav-broken');
    setRepairProgress(0);
    playNavSnapSound();
    vibrateNav(12);

    window.setTimeout(() => {
      nav.classList.remove('is-nav-breaking');
    }, 940);
  };

  const reconnectNav = () => {
    const activePointerId = draggingPointerId;

    hasRepaired = true;
    hasBroken = false;
    if (activePointerId !== null && handle.hasPointerCapture(activePointerId)) {
      handle.releasePointerCapture(activePointerId);
    }
    draggingPointerId = null;
    repairStartPoint = null;
    repairTargetPoint = null;
    repairVector = null;
    nav.classList.remove('is-nav-breaking', 'is-nav-broken', 'is-nav-dragging');
    nav.classList.add('is-nav-repairing');
    setRepairProgress(1);
    lastRepairFeedbackStep = 4;
    vibrateNav([10, 22, 14]);

    window.setTimeout(() => {
      nav.classList.remove('is-nav-repairing');
      clearRepairProgress();
    }, 560);
  };

  const getRepairTarget = () => {
    const rect = rightString.getBoundingClientRect();

    return {
      x: rect.left + (rect.width / 2),
      y: rect.bottom,
    };
  };

  const updateRepairProgress = (clientX, clientY) => {
    if (!repairStartPoint || !repairTargetPoint || !repairVector) {
      return;
    }

    const deltaX = clientX - repairStartPoint.x;
    const deltaY = clientY - repairStartPoint.y;
    const projectedProgress = (
      (deltaX * repairVector.dx) +
      (deltaY * repairVector.dy)
    ) / repairVector.lengthSquared;
    const distanceToTarget = Math.hypot(clientX - repairTargetPoint.x, clientY - repairTargetPoint.y);
    const proximityProgress = 1 - clamp(distanceToTarget / repairSnapDistance, 0, 1);
    const nextProgress = Math.max(projectedProgress, proximityProgress);

    setRepairProgress(nextProgress);
    emitRepairFeedback(nextProgress);

    if (distanceToTarget <= repairSnapDistance || repairProgress >= repairProgressThreshold) {
      reconnectNav();
    }
  };

  const onScroll = () => {
    scrollFrameId = null;

    if (!desktopQuery.matches || hasBroken || hasRepaired) {
      return;
    }

    const now = performance.now();
    const nextScrollY = window.scrollY;
    const scrollDelta = Math.abs(nextScrollY - lastScrollY);

    if ((now - initTimestamp) < scrollInitGraceMs) {
      lastScrollTick = now;
      lastScrollY = nextScrollY;
      return;
    }

    if (lastScrollTick > 0) {
      const elapsed = now - lastScrollTick;

      if (elapsed <= activeScrollGapMs) {
        activeScrollMs += Math.min(elapsed, 120);
      }
    }

    scrollDistance += scrollDelta;
    lastScrollTick = now;
    lastScrollY = nextScrollY;

    if (activeScrollMs >= breakActiveMsTarget && scrollDistance >= breakDistanceTarget) {
      breakNav();
    }
  };

  const scheduleScrollCheck = () => {
    if (scrollFrameId !== null) {
      return;
    }

    scrollFrameId = window.requestAnimationFrame(onScroll);
  };

  handle.addEventListener('pointerdown', (event) => {
    if (!desktopQuery.matches || !nav.classList.contains('is-nav-broken') || nav.classList.contains('is-nav-repairing')) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    draggingPointerId = event.pointerId;
    lastRepairFeedbackStep = 0;
    nav.classList.add('is-nav-dragging');
    handle.setPointerCapture(draggingPointerId);

    const handleRect = handle.getBoundingClientRect();
    repairStartPoint = {
      x: handleRect.left + (handleRect.width / 2),
      y: handleRect.top + (handleRect.height / 2),
    };
    repairTargetPoint = getRepairTarget();
    repairVector = {
      dx: repairTargetPoint.x - repairStartPoint.x,
      dy: repairTargetPoint.y - repairStartPoint.y,
      lengthSquared: Math.max(
        1,
        ((repairTargetPoint.x - repairStartPoint.x) ** 2) +
        ((repairTargetPoint.y - repairStartPoint.y) ** 2),
      ),
    };

    updateRepairProgress(event.clientX, event.clientY);
  });

  const onRepairPointerMove = (event) => {
    if (event.pointerId !== draggingPointerId || !nav.classList.contains('is-nav-dragging')) {
      return;
    }

    event.preventDefault();
    updateRepairProgress(event.clientX, event.clientY);
  };

  const endRepairDrag = (event) => {
    if (event.pointerId !== draggingPointerId) {
      return;
    }

    const activePointerId = draggingPointerId;
    updateRepairProgress(event.clientX, event.clientY);

    if (activePointerId !== null && handle.hasPointerCapture(activePointerId)) {
      handle.releasePointerCapture(activePointerId);
    }

    if (hasRepaired) {
      return;
    }

    nav.classList.remove('is-nav-dragging');
    setRepairProgress(0);
    draggingPointerId = null;
    repairStartPoint = null;
    repairTargetPoint = null;
    repairVector = null;

    window.setTimeout(() => {
      if (!nav.classList.contains('is-nav-dragging') && nav.classList.contains('is-nav-broken')) {
        clearRepairProgress();
      }
    }, 280);
  };

  handle.addEventListener('pointermove', onRepairPointerMove);
  handle.addEventListener('pointerup', endRepairDrag);
  handle.addEventListener('pointercancel', endRepairDrag);
  window.addEventListener('pointermove', onRepairPointerMove, { passive: false });
  window.addEventListener('pointerup', endRepairDrag);
  window.addEventListener('pointercancel', endRepairDrag);
  handle.addEventListener('lostpointercapture', () => {
    if (!hasRepaired && nav.classList.contains('is-nav-dragging')) {
      nav.classList.remove('is-nav-dragging');
      clearRepairProgress();
    }

    draggingPointerId = null;
    repairStartPoint = null;
    repairTargetPoint = null;
    repairVector = null;
  });

  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) {
      scheduleScrollCheck();
      return;
    }

    resetVisualState();
  });

  window.addEventListener('pointerdown', primeNavAudio, { passive: true });
  window.addEventListener('keydown', primeNavAudio, { passive: true });
  window.addEventListener('wheel', primeNavAudio, { passive: true });
  window.addEventListener('scroll', scheduleScrollCheck, { passive: true });
  scheduleScrollCheck();
}

function initBackToTopLinks() {
  const backToTopLinks = document.querySelectorAll('.footer__back-to-top');

  if (!backToTopLinks.length) {
    return;
  }

  backToTopLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: isReducedMotion() ? 'auto' : 'smooth',
      });
    });
  });
}

function initExperienceCardTransitions() {
  if (isReducedMotion()) {
    return;
  }

  const cards = Array.from(document.querySelectorAll('.experience-card'));

  if (!cards.length) {
    return;
  }

  cards.forEach((card) => {
    const summary = card.querySelector('.experience-card__toggle');
    const body = card.querySelector('.experience-card__body');

    if (!summary || !body) {
      return;
    }

    let isAnimating = false;

    const finishOpen = () => {
      card.classList.remove('is-expanding');
      body.style.height = 'auto';
      isAnimating = false;
    };

    const finishClose = () => {
      card.classList.remove('is-collapsing');
      card.open = false;
      body.style.height = '0px';
      isAnimating = false;
    };

    const animateOpen = () => {
      isAnimating = true;
      card.classList.remove('is-collapsing');
      card.classList.add('is-expanding');
      card.open = true;

      body.style.height = '0px';
      void body.offsetHeight;

      const endHeight = body.scrollHeight;

      const handleOpenEnd = (event) => {
        if (event.target !== body || event.propertyName !== 'height') {
          return;
        }

        body.removeEventListener('transitionend', handleOpenEnd);
        finishOpen();
      };

      body.addEventListener('transitionend', handleOpenEnd);

      window.requestAnimationFrame(() => {
        body.style.height = `${endHeight}px`;
      });
    };

    const animateClose = () => {
      isAnimating = true;
      card.classList.remove('is-expanding');
      card.classList.add('is-collapsing');

      const startHeight = body.scrollHeight;
      body.style.height = `${startHeight}px`;
      void body.offsetHeight;

      const handleCloseEnd = (event) => {
        if (event.target !== body || event.propertyName !== 'height') {
          return;
        }

        body.removeEventListener('transitionend', handleCloseEnd);
        finishClose();
      };

      body.addEventListener('transitionend', handleCloseEnd);

      window.requestAnimationFrame(() => {
        body.style.height = '0px';
      });
    };

    card.classList.add('is-animated');
    body.style.height = card.open ? 'auto' : '0px';

    summary.addEventListener('click', (event) => {
      event.preventDefault();

      if (isAnimating) {
        return;
      }

      if (card.open) {
        animateClose();
        return;
      }

      animateOpen();
    });
  });
}

function initManchesterTime() {
  const timeNodes = Array.from(document.querySelectorAll('.contact-header__time'));

  if (!timeNodes.length || typeof Intl === 'undefined') {
    return;
  }

  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const formatTimeLabel = () => {
    const now = new Date();
    const time = timeFormatter.format(now).replace(/\b(am|pm)\b/i, (match) => match.toUpperCase());
    const parts = dateFormatter.formatToParts(now);
    const weekday = parts.find((part) => part.type === 'weekday')?.value ?? '';
    const month = parts.find((part) => part.type === 'month')?.value ?? '';
    const day = parts.find((part) => part.type === 'day')?.value ?? '';

    return `${time} ${weekday}, ${month} ${day}`.trim();
  };

  const updateTime = () => {
    const label = formatTimeLabel();
    timeNodes.forEach((node) => {
      node.textContent = label;
    });
  };

  updateTime();
  window.setInterval(updateTime, 60 * 1000);
}

function initAboutMarquee() {
  const surface = document.querySelector('.about-marquee__surface');
  const list = surface?.querySelector('.about-marquee__list');

  if (!surface || !list || list.children.length < 2 || isReducedMotion()) {
    return;
  }

  let lastTimestamp = 0;
  let offset = 0;
  let itemAdvance = 0;
  let isPaused = false;
  let resizeFrameId = 0;

  const getSpeed = () => {
    if (window.innerWidth <= 480) {
      return 24;
    }

    if (window.innerWidth <= 768) {
      return 28;
    }

    return 34;
  };

  const updateMetrics = () => {
    const firstCard = list.firstElementChild;

    if (!firstCard) {
      itemAdvance = 0;
      return;
    }

    const listStyles = window.getComputedStyle(list);
    const gap = parseFloat(listStyles.columnGap || listStyles.gap || '0');
    itemAdvance = firstCard.getBoundingClientRect().width + gap;
  };

  const syncTransform = () => {
    list.style.transform = `translate3d(${-offset}px, 0, 0)`;
  };

  const queueMetricsRefresh = () => {
    if (resizeFrameId) {
      window.cancelAnimationFrame(resizeFrameId);
    }

    resizeFrameId = window.requestAnimationFrame(() => {
      const previousAdvance = itemAdvance;
      updateMetrics();

      if (previousAdvance > 0 && itemAdvance > 0) {
        offset = (offset / previousAdvance) * itemAdvance;
      } else {
        offset = 0;
      }

      syncTransform();
    });
  };

  const tick = (timestamp) => {
    if (!lastTimestamp) {
      lastTimestamp = timestamp;
    }

    const deltaSeconds = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
    lastTimestamp = timestamp;

    if (!isPaused && !document.hidden && itemAdvance > 0) {
      offset += getSpeed() * deltaSeconds;

      while (offset >= itemAdvance) {
        offset -= itemAdvance;
        list.append(list.firstElementChild);
      }

      syncTransform();
    }

    window.requestAnimationFrame(tick);
  };

  surface.addEventListener('pointerenter', () => {
    isPaused = true;
  });

  surface.addEventListener('pointerleave', () => {
    isPaused = false;
    lastTimestamp = 0;
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      lastTimestamp = 0;
    }
  });

  window.addEventListener('resize', queueMetricsRefresh, { passive: true });

  if (typeof ResizeObserver === 'function') {
    const resizeObserver = new ResizeObserver(queueMetricsRefresh);
    resizeObserver.observe(surface);
  }

  updateMetrics();
  syncTransform();
  window.requestAnimationFrame(tick);
}

primeThemePageTransition();
releaseInitialPaintHold();
initProjectPage();
initMotionMode();
initThemePageTransitions();
initScrollReveal();
initHeroGalleryPeek();
initProjectCardParallax();
initGalleryGridParallax();
initProjectDetailVisualParallax();
initExperienceCardTransitions();
initManchesterTime();
initHomeHangingNav();
initStatCounters();
initAboutMarquee();
initBackToTopLinks();

// Only initialize the dock on pages that render the dock markup.
if (document.querySelector('.tool-dock')) {
  initDock();
  initDockHoverSounds();
}

// ---- Hamburger Nav ----
const hamburger = document.getElementById('nav-hamburger');
const drawer = document.getElementById('nav-drawer');

if (hamburger && drawer) {
  const mobileNavQuery = window.matchMedia('(max-width: 768px)');
  let touchScrollLockActive = false;

  const preventBackgroundTouchScroll = (event) => {
    if (!drawer.classList.contains('is-open')) {
      return;
    }

    if (drawer.contains(event.target)) {
      return;
    }

    event.preventDefault();
  };

  const lockMobileNavScroll = () => {
    if (!mobileNavQuery.matches || touchScrollLockActive) {
      return;
    }

    touchScrollLockActive = true;
    document.body.dataset.navScrollLocked = 'true';
    document.documentElement.classList.add('has-nav-open');
    document.body.classList.add('has-nav-open');
    document.addEventListener('touchmove', preventBackgroundTouchScroll, { passive: false });
  };

  const unlockMobileNavScroll = () => {
    if (!touchScrollLockActive) {
      return;
    }

    touchScrollLockActive = false;
    document.body.removeAttribute('data-nav-scroll-locked');
    document.documentElement.classList.remove('has-nav-open');
    document.body.classList.remove('has-nav-open');
    document.removeEventListener('touchmove', preventBackgroundTouchScroll, { passive: false });
  };

  const setNavState = (isOpen) => {
    drawer.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    drawer.setAttribute('aria-hidden', String(!isOpen));

    if (isOpen) {
      lockMobileNavScroll();
    } else {
      unlockMobileNavScroll();
    }
  };

  setNavState(false);

  hamburger.addEventListener('click', (event) => {
    event.stopPropagation();
    setNavState(!drawer.classList.contains('is-open'));
  });

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setNavState(false);
    });
  });

  document.addEventListener('click', (event) => {
    if (!drawer.contains(event.target) && !hamburger.contains(event.target)) {
      setNavState(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setNavState(false);
    }
  });

  const handleDesktopNavChange = (event) => {
    if (event.matches) {
      setNavState(false);
    }
  };

  const desktopNavQuery = window.matchMedia('(min-width: 769px)');

  if (typeof desktopNavQuery.addEventListener === 'function') {
    desktopNavQuery.addEventListener('change', handleDesktopNavChange);
  } else if (typeof desktopNavQuery.addListener === 'function') {
    desktopNavQuery.addListener(handleDesktopNavChange);
  }
}
