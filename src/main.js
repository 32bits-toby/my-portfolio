// Main JS entry point
// Page-specific modules will be imported here as pages are built

import './styles/main.css';
import './styles/about.css';
import { initDock } from './dock.js';
import { initProjectPage } from './project-page.js';

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const isReducedMotion = () => motionQuery.matches;

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

    const heroRect = hero.getBoundingClientRect();
    const galleryHeight = galleryPeekInner.getBoundingClientRect().height;
    const visibleHeight = galleryHeight * 0.1;
    const hiddenHeight = galleryHeight - visibleHeight;
    const heroVisibleBottomInHero = Math.max(0, Math.min(heroRect.bottom, viewportHeight) - heroRect.top);
    const galleryTop = heroVisibleBottomInHero - visibleHeight;

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

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  const setActiveSlide = (nextIndex) => {
    activeIndex = nextIndex;

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });

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

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      setActiveSlide(index);
      startAutoplay();
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

      const panX = (pointerRatioX - 0.5) * 16;
      const panY = (pointerRatioY - 0.5) * 12;

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
      if (!item.classList.contains('is-revealed')) {
        return;
      }

      const rect = item.getBoundingClientRect();
      pointerRatioX = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      pointerRatioY = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
      item.classList.add('is-parallax-active');
      scheduleParallax();
    });

    item.addEventListener('pointermove', (event) => {
      if (!item.classList.contains('is-revealed')) {
        return;
      }

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
  const initTimestamp = performance.now();

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

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

initProjectPage();
initMotionMode();
initScrollReveal();
initHeroGalleryPeek();
initProjectCardParallax();
initGalleryGridParallax();
initHomeHangingNav();
initStatCounters();
initBackToTopLinks();

// Only initialize the dock on pages that render the dock markup.
if (document.querySelector('.tool-dock')) {
  initDock();
}

// ---- Hamburger Nav ----
const hamburger = document.getElementById('nav-hamburger');
const drawer = document.getElementById('nav-drawer');

if (hamburger && drawer) {
  const setNavState = (isOpen) => {
    drawer.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    drawer.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('has-nav-open', isOpen);
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

  const desktopNavQuery = window.matchMedia('(min-width: 769px)');
  const handleDesktopNavChange = (event) => {
    if (event.matches) {
      setNavState(false);
    }
  };

  if (typeof desktopNavQuery.addEventListener === 'function') {
    desktopNavQuery.addEventListener('change', handleDesktopNavChange);
  } else if (typeof desktopNavQuery.addListener === 'function') {
    desktopNavQuery.addListener(handleDesktopNavChange);
  }
}
