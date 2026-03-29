import { PROJECT_TIMELINES } from './project-timelines.js';

const projectImageUrls = import.meta.glob('../images/Project_image_*.webp', {
  eager: true,
  import: 'default'
});

const getProjectImage = (fileName) => (
  projectImageUrls[`../images/${fileName}`] ?? `./images/${fileName}`
);

const PROJECTS = {
  rethinkable: {
    title: 'Rethinkable',
    kicker: 'Product Design / Branding',
    exactVisuals: true,
    summary: [
      'Rethinkable is a mobile-first Web3 professional networking and job platform that helps crypto-native talent and decentralized organizations find each other. It integrates with Discord, Telegram, Twitter, and major Web3 community channels that together reach millions of users.',
      'I joined the team as lead designer and got to shape the product from the ground up, working across onboarding, digital identity, job discovery, and application management. It was a genuine team effort, and the goal throughout was simple: make hiring in Web3 feel as natural as the community itself.'
    ],
    meta: [
      { label: 'Timeline', values: [PROJECT_TIMELINES.rethinkable] },
      { label: 'Links', values: [{ label: 'rethinkable.xyz', href: 'https://rethinkable.xyz/' }] },
      { label: 'Role', values: ['Lead Designer'] },
      { label: 'Tools', values: ['Figma', 'Cross functional team', 'Illustrator'] }
    ],
    solution: [
      'We asked ourselves what professional networking would look like if it were built from scratch for Web3, and Rethinkable is the answer.',
      'The platform works for both companies and talent, and it was designed around how people in this space actually operate: with pseudonymous identities, multi-chain affiliations, and communities built on Discord rather than LinkedIn. We made room for PFP profiles, DAO-led organizations, and token-based pay, because that\'s the reality of modern Web3 work.'
    ],
    results: [
      'Rethinkable grew into one of the largest Web3 job boards around, with listings distributed across Discord communities reaching millions of people.',
      'The platform made pseudonymous professional profiles a real, practical thing, introduced token-based compensation for contributors, and helped set a new standard for what hiring can look like in the decentralized web.'
    ],
    visuals: [
      {
        imageSrc: getProjectImage('Project_image_rethinkable_01.webp'),
        imageAlt: 'Rethinkable project visual 01'
      },
      {
        imageSrc: getProjectImage('Project_image_rethinkable_02.webp'),
        imageAlt: 'Rethinkable project visual 02'
      },
      {
        imageSrc: getProjectImage('Project_image_rethinkable_03.webp'),
        imageAlt: 'Rethinkable project visual 03'
      },
      {
        imageSrc: getProjectImage('Project_image_rethinkable_04.webp'),
        imageAlt: 'Rethinkable project visual 04'
      },
      {
        imageSrc: getProjectImage('Project_image_rethinkable_05.webp'),
        imageAlt: 'Rethinkable project visual 05'
      },
      {
        imageSrc: getProjectImage('Project_image_rethinkable_06.webp'),
        imageAlt: 'Rethinkable project visual 06'
      },
      {
        imageSrc: getProjectImage('Project_image_rethinkable_07.webp'),
        imageAlt: 'Rethinkable project visual 07'
      }
    ]
  },
  quicksave: {
    title: 'QuickSave',
    kicker: 'Product Design / Service Platform',
    exactVisuals: true,
    summary: [
      'QuickSave is a lightweight cloud storage platform built around one simple idea: saving and retrieving your files should never feel like a chore. No slowdowns, no friction, just fast and reliable access to everything you need, from anywhere.',
      'I came on as lead designer and worked on shaping an experience that feels as quick and dependable as the product promises. The focus throughout was on keeping things clean and intuitive, because when speed is the whole point, the interface has to get out of the way.'
    ],
    meta: [
      { label: 'Timeline', values: [PROJECT_TIMELINES.quicksave] },
      { label: 'Links', values: [{ label: 'Figma design', href: 'https://www.figma.com/design/V8LU49EGyV9O5hloZc7qq5/File-Storage-App?node-id=2862-81096&t=eR3SmCeBn1mOo6qq-1' }] },
      { label: 'Role', values: ['Lead Designer'] },
      { label: 'Tools', values: ['Figma', 'Illustrator'] }
    ],
    solution: [
      'A lot of storage platforms make you feel the weight of their complexity. QuickSave takes the opposite approach. We built a system that prioritises fast uploads, instant access, and seamless file sharing, without asking users to think too hard about any of it.',
      'For people handling sensitive or complex files, we also built in strong security under the hood, so your data stays protected without adding friction to your day to day experience.'
    ],
    results: [
      'QuickSave gives users a storage experience that genuinely keeps up with them. Files are accessible anytime and from any device, sharing feels effortless, and the security layer works quietly in the background without ever getting in the way.',
      'The platform brings together speed, simplicity, and peace of mind in a way that makes everyday file management feel almost invisible.'
    ],
    visuals: [
      {
        imageSrc: getProjectImage('Project_image_quicksave_01.webp'),
        imageAlt: 'QuickSave project visual 01'
      },
      {
        imageSrc: getProjectImage('Project_image_quicksave_02.webp'),
        imageAlt: 'QuickSave project visual 02'
      },
      {
        imageSrc: getProjectImage('Project_image_quicksave_03.webp'),
        imageAlt: 'QuickSave project visual 03'
      },
      {
        imageSrc: getProjectImage('Project_image_quicksave_04.webp'),
        imageAlt: 'QuickSave project visual 04'
      },
      {
        imageSrc: getProjectImage('Project_image_quicksave_05.webp'),
        imageAlt: 'QuickSave project visual 05'
      },
      {
        imageSrc: getProjectImage('Project_image_quicksave_06.webp'),
        imageAlt: 'QuickSave project visual 06'
      },
      {
        imageSrc: getProjectImage('Project_image_quicksave_07.webp'),
        imageAlt: 'QuickSave project visual 07'
      },
      {
        imageSrc: getProjectImage('Project_image_quicksave_08.webp'),
        imageAlt: 'QuickSave project visual 08'
      },
      {
        imageSrc: getProjectImage('Project_image_quicksave_09.webp'),
        imageAlt: 'QuickSave project visual 09'
      },
      {
        imageSrc: getProjectImage('Project_image_quicksave_10.webp'),
        imageAlt: 'QuickSave project visual 10'
      },
      {
        imageSrc: getProjectImage('Project_image_quicksave_11.webp'),
        imageAlt: 'QuickSave project visual 11'
      },
      {
        imageSrc: getProjectImage('Project_image_quicksave_12.webp'),
        imageAlt: 'QuickSave project visual 12'
      }
    ]
  },
  croart: {
    title: 'Cro.Art',
    kicker: 'Product Design / Operations',
    exactVisuals: true,
    summary: [
      'Cro.art is an NFT marketplace concept built on the Cronos blockchain, designed to make buying, selling, and discovering NFTs within the Cronos ecosystem feel simple and enjoyable. The platform was crafted to feel welcoming to both first-time collectors and experienced traders alike.',
      'I worked on this as lead designer, taking the product from initial concept through to a complete set of high-fidelity designs in Figma. The goal throughout was to make NFT trading feel approachable and rewarding, so that creators and collectors could focus on what they actually love about the space.'
    ],
    meta: [
      { label: 'Timeline', values: [PROJECT_TIMELINES.croart] },
      { label: 'Links', values: [{ label: 'Figma design', href: 'https://www.figma.com/design/gIXXPX6em6JkLhwIR3A8ld/CroArt-NFT-Market-Place?node-id=640-7789&t=ZarWt5cQvjBiEdti-1' }] },
      { label: 'Role', values: ['Lead Designer'] },
      { label: 'Tools', values: ['Figma', 'Cross functional team', 'Illustrator', 'Spline'] }
    ],
    solution: [
      'We wanted Cro.art to feel like a marketplace that actually enjoys being used. That meant designing intuitive browsing and discovery features, advanced filtering so users can find exactly what they are looking for, and a listing flow that gets creators onto the market with as little friction as possible.',
      'We also explored live auction functionality for real-time bidding, and dedicated creator spaces where artists and NFT projects could showcase their work and connect with buyers in a more meaningful way.'
    ],
    results: [
      'The project reached a fully fleshed out design stage, with high-fidelity screens covering the core marketplace experience, creator tools, and auction flows. While Cro.art did not move into development, the design work laid out a strong foundation for what a creator-friendly, accessible NFT marketplace on Cronos could look like.'
    ],
    visuals: [
      {
        imageSrc: getProjectImage('Project_image_croArt_01.webp'),
        imageAlt: 'Cro.Art project visual 01'
      },
      {
        imageSrc: getProjectImage('Project_image_croArt_02.webp'),
        imageAlt: 'Cro.Art project visual 02'
      },
      {
        imageSrc: getProjectImage('Project_image_croArt_03.webp'),
        imageAlt: 'Cro.Art project visual 03'
      },
      {
        imageSrc: getProjectImage('Project_image_croArt_04.webp'),
        imageAlt: 'Cro.Art project visual 04'
      },
      {
        imageSrc: getProjectImage('Project_image_croArt_05.webp'),
        imageAlt: 'Cro.Art project visual 05'
      },
      {
        imageSrc: getProjectImage('Project_image_croArt_06.webp'),
        imageAlt: 'Cro.Art project visual 06'
      }
    ]
  },
  aardvark: {
    title: 'Aardvark Messanger',
    kicker: 'Product Design / Web3 Messaging',
    exactVisuals: true,
    summary: [
      'Aardvark is a Web3 messaging app that lets users communicate and transact directly through their wallet addresses. No phone numbers, no emails, just your wallet and the people you want to connect with.',
      'I came on as lead designer and worked on bringing together two things that don\'t usually sit in the same place: the comfort of a familiar messaging experience and the power of blockchain functionality. The challenge was making something that feels natural to use even when what\'s happening under the hood is genuinely new.'
    ],
    meta: [
      { label: 'Timeline', values: [PROJECT_TIMELINES.aardvark] },
      { label: 'Links', values: [{ label: 'Figma design', href: 'https://www.figma.com/design/dTcDwDEPbDTOA6tpA0L8c3/Aardvark?node-id=0-1&t=2HJde4fS9dOpLaQB-1' }] },
      { label: 'Role', values: ['Lead Designer'] },
      { label: 'Tools', values: ['Figma', 'Illustrator'] }
    ],
    solution: [
      'We built Aardvark around the idea that messaging and transactions should not live in separate apps. Within a single chat, users can send messages, transfer crypto, and complete transactions as easily as typing a sentence. Wallet addresses replace contact details, NFTs serve as profile pictures, and the whole interface can be personalised with custom colours, themes, and layouts.',
      'End-to-end encryption keeps conversations private, and blockchain integration makes every transaction transparent and secure without adding complexity for the user.'
    ],
    results: [
      'Aardvark came together as a fully designed concept that reimagines what a messaging app can be in a Web3 world. The design work covers the core chat experience, in-chat crypto transfers, wallet-based contact management, and a customisable interface that feels as familiar as the apps people already love.',
      'It lays out a clear and considered vision for a platform where digital identity, communication, and financial transactions all feel at home together.'
    ],
    visuals: [
      {
        imageSrc: getProjectImage('Project_image_aardvark_01.webp'),
        imageAlt: 'Aardvark Messenger project visual 01'
      },
      {
        imageSrc: getProjectImage('Project_image_aardvark_02.webp'),
        imageAlt: 'Aardvark Messenger project visual 02'
      },
      {
        imageSrc: getProjectImage('Project_image_aardvark_03.webp'),
        imageAlt: 'Aardvark Messenger project visual 03'
      },
      {
        imageSrc: getProjectImage('Project_image_aardvark_04.webp'),
        imageAlt: 'Aardvark Messenger project visual 04'
      },
      {
        imageSrc: getProjectImage('Project_image_aardvark_05.webp'),
        imageAlt: 'Aardvark Messenger project visual 05'
      }
    ]
  }
};

const MOBILE_PROJECT_LAYOUT_QUERY = '(max-width: 960px)';
const PROJECT_VISUAL_CARD_COUNT = 10;

function expandProjectVisuals(baseVisuals, totalCards = PROJECT_VISUAL_CARD_COUNT) {
  if (baseVisuals.length >= totalCards) {
    return baseVisuals.slice(0, totalCards);
  }

  return Array.from({ length: totalCards }, (_, index) => {
    const visual = baseVisuals[index % baseVisuals.length];

    if (index < baseVisuals.length) {
      return visual;
    }

    return {
      ...visual,
      kicker: `${visual.kicker} ${String(index + 1).padStart(2, '0')}`
    };
  });
}

function renderMetaItem(item) {
  const values = item.values
    .map((value) => {
      if (typeof value === 'object' && value && 'href' in value) {
        return `<a class="project-detail__meta-value project-detail__meta-link" href="${value.href}">${value.label}</a>`;
      }

      return `<span class="project-detail__meta-value">${value}</span>`;
    })
    .join('');

  return `
    <div class="project-detail__meta-item">
      <p class="project-detail__meta-label">${item.label}</p>
      <div class="project-detail__meta-values">${values}</div>
    </div>
  `;
}

function renderAccordionItem(label, paragraphs) {
  const content = paragraphs
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join('');

  return `
    <details class="project-detail__accordion" data-project-accordion>
      <summary class="project-detail__accordion-summary">
        <span class="project-detail__accordion-title">${label}</span>
        <span class="project-detail__accordion-indicator" aria-hidden="true"></span>
      </summary>
      <div class="project-detail__accordion-content">${content}</div>
    </details>
  `;
}

function renderVisualCard(visual) {
  if (visual.imageSrc) {
    return `
      <article class="project-detail__visual-card project-detail__visual-card--media">
        <div class="project-detail__visual-frame project-detail__visual-frame--media">
          <img class="project-detail__visual-media" src="${visual.imageSrc}" alt="${visual.imageAlt ?? ''}" loading="lazy" decoding="async" />
        </div>
      </article>
    `;
  }

  return `
    <article class="project-detail__visual-card project-detail__visual-card--${visual.tone}">
      <div class="project-detail__visual-card-header">
        <p class="project-detail__visual-kicker">${visual.kicker}</p>
        <h2 class="project-detail__visual-title">${visual.title}</h2>
        <p class="project-detail__visual-caption">${visual.caption}</p>
      </div>
      <div class="project-detail__visual-frame">
        <div class="project-detail__visual-ui">
          <div class="project-detail__visual-ui-bar"></div>
          <div class="project-detail__visual-ui-grid">
            <div class="project-detail__visual-ui-panel"></div>
            <div class="project-detail__visual-ui-stack">
              <div class="project-detail__visual-ui-chip"></div>
              <div class="project-detail__visual-ui-chip"></div>
              <div class="project-detail__visual-ui-chip"></div>
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
}

function applyAccordionDefaults(root, isMobile) {
  root.querySelectorAll('[data-project-accordion]').forEach((accordion) => {
    accordion.open = !isMobile;
  });
}

function initProjectAccordionTransitions(root) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return;
  }

  const accordions = Array.from(root.querySelectorAll('[data-project-accordion]'));

  if (!accordions.length) {
    return;
  }

  accordions.forEach((accordion) => {
    const summary = accordion.querySelector('.project-detail__accordion-summary');
    const content = accordion.querySelector('.project-detail__accordion-content');

    if (!summary || !content) {
      return;
    }

    let isAnimating = false;

    const finishOpen = () => {
      accordion.classList.remove('is-expanding');
      content.style.height = 'auto';
      isAnimating = false;
    };

    const finishClose = () => {
      accordion.classList.remove('is-collapsing');
      accordion.open = false;
      content.style.height = '0px';
      isAnimating = false;
    };

    const animateOpen = () => {
      isAnimating = true;
      accordion.classList.remove('is-collapsing');
      accordion.classList.add('is-expanding');
      accordion.open = true;

      content.style.height = '0px';
      void content.offsetHeight;

      const endHeight = content.scrollHeight;

      const handleOpenEnd = (event) => {
        if (event.target !== content || event.propertyName !== 'height') {
          return;
        }

        content.removeEventListener('transitionend', handleOpenEnd);
        finishOpen();
      };

      content.addEventListener('transitionend', handleOpenEnd);

      window.requestAnimationFrame(() => {
        content.style.height = `${endHeight}px`;
      });
    };

    const animateClose = () => {
      isAnimating = true;
      accordion.classList.remove('is-expanding');
      accordion.classList.add('is-collapsing');

      const startHeight = content.scrollHeight;
      content.style.height = `${startHeight}px`;
      void content.offsetHeight;

      const handleCloseEnd = (event) => {
        if (event.target !== content || event.propertyName !== 'height') {
          return;
        }

        content.removeEventListener('transitionend', handleCloseEnd);
        finishClose();
      };

      content.addEventListener('transitionend', handleCloseEnd);

      window.requestAnimationFrame(() => {
        content.style.height = '0px';
      });
    };

    accordion.classList.add('is-animated');
    content.style.height = accordion.open ? 'auto' : '0px';

    summary.addEventListener('click', (event) => {
      event.preventDefault();

      if (isAnimating) {
        return;
      }

      if (accordion.open) {
        animateClose();
        return;
      }

      animateOpen();
    });
  });
}

export function initProjectPage() {
  const root = document.querySelector('[data-project-page]');

  if (!root) {
    return;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const slug = searchParams.get('project');
  const project = PROJECTS[slug] ?? PROJECTS.aardvark;

  const title = root.querySelector('[data-project-title]');
  const summary = root.querySelector('[data-project-summary]');
  const meta = root.querySelector('[data-project-meta]');
  const accordions = root.querySelector('[data-project-accordions]');
  const visuals = root.querySelector('[data-project-visuals]');

  if (!title || !summary || !meta || !accordions || !visuals) {
    return;
  }

  title.textContent = project.title;
  summary.innerHTML = project.summary.map((paragraph) => `<p>${paragraph}</p>`).join('');
  meta.innerHTML = project.meta.map(renderMetaItem).join('');
  accordions.innerHTML = [
    renderAccordionItem('Solution', project.solution),
    renderAccordionItem('Results', project.results)
  ].join('');
  const projectVisuals = project.exactVisuals ? project.visuals : expandProjectVisuals(project.visuals);
  visuals.innerHTML = projectVisuals.map(renderVisualCard).join('');

  document.title = `${project.title} – Toby`;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute('content', project.summary[0]);
  }

  const mobileQuery = window.matchMedia(MOBILE_PROJECT_LAYOUT_QUERY);
  const syncAccordionState = (event) => {
    applyAccordionDefaults(root, event.matches);

    root.querySelectorAll('[data-project-accordion]').forEach((accordion) => {
      const content = accordion.querySelector('.project-detail__accordion-content');

      if (!content) {
        return;
      }

      accordion.classList.remove('is-expanding', 'is-collapsing');
      content.style.height = accordion.open ? 'auto' : '0px';
    });
  };

  syncAccordionState(mobileQuery);
  initProjectAccordionTransitions(root);

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', syncAccordionState);
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(syncAccordionState);
  }
}
