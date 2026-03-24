// Main JS entry point
// Page-specific modules will be imported here as pages are built

import './styles/main.css';
import './styles/about.css';
import { initDock } from './dock.js';
import { initProjectPage } from './project-page.js';

// Only initialize the dock on pages that render the dock markup.
if (document.querySelector('.tool-dock')) {
  initDock();
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
}

function initBackToTopLinks() {
  const backToTopLinks = document.querySelectorAll('.footer__back-to-top');

  if (!backToTopLinks.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  backToTopLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    });
  });
}

initHeroGalleryPeek();
initProjectPage();
initBackToTopLinks();

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

  // Toggle drawer open/closed
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    setNavState(!drawer.classList.contains('is-open'));
  });

  // Close drawer when any actionable item inside is clicked
  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setNavState(false);
    });
  });

  // Close drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (!drawer.contains(e.target) && !hamburger.contains(e.target)) {
      setNavState(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
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
