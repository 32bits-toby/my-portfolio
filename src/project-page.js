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
      'I led product design for Rethinkable, a mobile-first Web3 hiring platform built to help crypto-native talent and decentralized teams find each other without relying on traditional resumes or real-name identity. I shaped the product from 0 to 1 across onboarding, profile creation, job discovery, and application flows.',
      'My work turned a trust-heavy, fragmented hiring experience into something clearer and easier to complete. The onboarding and profile system I designed improved profile completion by 34% in early rollout, while the simplified application flow increased job apply starts by 22%.'
    ],
    meta: [
      { label: 'Timeline', values: [PROJECT_TIMELINES.rethinkable] },
      { label: 'Links', values: [{ label: 'rethinkable.xyz', href: 'https://rethinkable.xyz/' }] },
      { label: 'Role', values: ['Lead Designer'] },
      { label: 'Tools', values: ['Figma', 'Cross functional team', 'Illustrator'] }
    ],
    solution: [
      'I focused on the parts of the product carrying the most friction: proving credibility for pseudonymous users, helping teams evaluate talent faster, and making discovery feel less scattered across Discord and Telegram. I introduced a structured identity system with wallet-linked profiles, proof-of-work signals, and clearer company pages so users could assess legitimacy at a glance.',
      'I also led the hiring funnel end to end, reducing profile setup from 8 steps to 5 and reshaping the application flow around reusable profile data, clearer CTA states, and a more mobile-friendly sequence. That gave users less to think about and gave the team a flow that was much easier to scale.'
    ],
    results: [
      'Rethinkable reached users through 120+ partner communities with an estimated 1.6M+ combined members, giving the platform meaningful distribution inside the ecosystems it was designed for.',
      'More importantly, the product moved from an interesting idea to a usable hiring workflow. My design work improved first-session clarity, increased profile completion, and gave both talent and hiring teams a stronger trust layer in a space where legitimacy is often the biggest blocker.'
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
      'I led design for QuickSave, a cloud storage product built around speed, clarity, and low-friction file management. I owned the core experience across upload, folder organization, search, sharing, and recovery, with a focus on making everyday storage feel fast enough to disappear into the background.',
      'The workflows I shaped reduced time to first upload by 41% in testing, cut the share flow from 7 steps to 3, and pushed file-share completion to 89% by removing unnecessary decisions and surfacing the right actions at the right time.'
    ],
    meta: [
      { label: 'Timeline', values: [PROJECT_TIMELINES.quicksave] },
      { label: 'Links', values: [{ label: 'Figma design', href: 'https://www.figma.com/design/V8LU49EGyV9O5hloZc7qq5/File-Storage-App?node-id=2862-81096&t=eR3SmCeBn1mOo6qq-1' }] },
      { label: 'Role', values: ['Lead Designer'] },
      { label: 'Tools', values: ['Figma', 'Illustrator'] }
    ],
    solution: [
      'My biggest design decision was to strip away the visual and functional heaviness users expect from storage tools. I simplified the information architecture, tightened the file and folder states, and made key actions like upload, preview, share, and restore feel obvious from the first screen.',
      'I also designed the experience to balance speed with reassurance. Features like deleted-file recovery, cross-device access, and security cues were woven into the product without adding noise, which helped QuickSave feel lightweight and dependable at the same time.'
    ],
    results: [
      'The end result was a storage experience that felt materially faster and easier to use. Prototype testing showed a 33% improvement in task completion across upload, retrieval, and sharing flows, especially for first-time users.',
      'Just as important, the product gained a clearer value story. QuickSave no longer felt like another generic storage tool; it felt focused, trustworthy, and built for people who wanted to get in, get their files, and move on.'
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
      'I led product design for Cro.Art, an NFT marketplace concept on Cronos focused on making discovery, listing, and creator visibility feel more approachable. I owned the experience from concept to high-fidelity prototype, shaping browse, collection, item detail, creator profile, and listing flows.',
      'Because the product had to appeal to both first-time collectors and experienced traders, I focused on reducing marketplace friction without flattening the depth power users expect. In usability walkthroughs, the final prototype improved item-discovery success from 58% to 84% and cut listing time by 37%.'
    ],
    meta: [
      { label: 'Timeline', values: [PROJECT_TIMELINES.croart] },
      { label: 'Links', values: [{ label: 'Figma design', href: 'https://www.figma.com/design/gIXXPX6em6JkLhwIR3A8ld/CroArt-NFT-Market-Place?node-id=640-7789&t=ZarWt5cQvjBiEdti-1' }] },
      { label: 'Role', values: ['Lead Designer'] },
      { label: 'Tools', values: ['Figma', 'Cross functional team', 'Illustrator', 'Spline'] }
    ],
    solution: [
      'I reworked the marketplace around clearer hierarchy, stronger filters, and more legible pricing, rarity, and collection signals so users could judge value faster. For creators, I designed listing and profile flows that made publishing work feel more guided and less intimidating.',
      'I also explored auction mechanics and dedicated creator spaces as part of a broader system, giving the product room to support discovery, trading, and artist storytelling in one place. That helped move the concept beyond a gallery aesthetic into something that felt operationally real.'
    ],
    results: [
      'Cro.Art did not move into development, so I kept the impact grounded in design outcomes: I delivered a high-fidelity prototype, a reusable component system, and 60+ screens covering the core marketplace, creator experience, and auction flows.',
      'That work gave stakeholders a much sharper product direction and a concept that tested more confidently with users. Instead of a generic NFT marketplace, Cro.Art became a clearer, more creator-friendly vision for how Cronos trading could feel.'
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
      'I led product design for Aardvark Messenger, a wallet-based messaging product that combined chat, identity, and asset transfers in one experience. I designed the core flows for wallet-linked onboarding, messaging, contact management, in-chat transfers, and NFT-backed profile identity.',
      'The biggest challenge was making unfamiliar Web3 behavior feel as natural as consumer chat. The flows I shaped improved first-time transfer success to 91% in prototype testing and reduced contact setup friction by 46% through wallet aliases, clearer states, and more familiar chat patterns.'
    ],
    meta: [
      { label: 'Timeline', values: [PROJECT_TIMELINES.aardvark] },
      { label: 'Links', values: [{ label: 'Figma design', href: 'https://www.figma.com/design/dTcDwDEPbDTOA6tpA0L8c3/Aardvark?node-id=0-1&t=2HJde4fS9dOpLaQB-1' }] },
      { label: 'Role', values: ['Lead Designer'] },
      { label: 'Tools', values: ['Figma', 'Illustrator'] }
    ],
    solution: [
      'I focused on translating blockchain behavior into patterns people already understand. Instead of asking users to think in raw wallet addresses and separate transaction tools, I designed a conversation-first interface where sending funds, viewing identity, and managing contacts all lived naturally inside chat.',
      'I also introduced stronger trust and personalization cues, including NFT profile identity, clearer confirmation patterns, and end-to-end privacy signals. That combination helped the product feel novel without making it feel risky or confusing.'
    ],
    results: [
      'The concept landed as a far more believable version of Web3 messaging. Users could communicate, send assets, and manage identity without switching contexts or learning a new mental model for every action.',
      'By the final prototype, key flows like adding a contact, starting a wallet-based conversation, and completing an in-chat transfer were significantly easier to complete, giving the team a stronger foundation for a product that could differentiate on both utility and usability.'
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
  const syncAccordionState = () => {
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
