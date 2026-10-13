'use strict';
// Native disclosures and anchors stay usable with or without motion enhancement.
const publicationLink = document.querySelector('nav a[href="#research"]');
if (publicationLink && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      publicationLink.classList.toggle('active', entry.isIntersecting);
      if (entry.isIntersecting) publicationLink.setAttribute('aria-current', 'location');
      else publicationLink.removeAttribute('aria-current');
    }
  }, {rootMargin: '-70px 0px -25% 0px', threshold: 0});
  observer.observe(document.getElementById('research'));
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const items = [...document.querySelectorAll('.research > h2, .paper, .contact, footer')];
  const reveal = element => {
    element.classList.remove('reveal-pending');
    revealObserver.unobserve(element);
  };
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
  }, {rootMargin: '0px 0px -32px 0px', threshold: 0.02});

  for (const item of items) {
    item.setAttribute('data-scroll-reveal', '');
    if (item.getBoundingClientRect().top >= window.innerHeight - 32) {
      item.classList.add('reveal-pending');
      revealObserver.observe(item);
    }
  }

  // Jump links and keyboard focus reveal their destination immediately.
  const revealDestination = () => {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); }
    catch { return; }
    const target = document.getElementById(id);
    const item = target?.closest('[data-scroll-reveal]');
    if (item) reveal(item);
    if (target?.id === 'research') reveal(document.getElementById('research-title'));
  };
  window.addEventListener('hashchange', revealDestination);
  window.addEventListener('pageshow', revealDestination);
  document.addEventListener('focusin', event => {
    const item = event.target.closest('[data-scroll-reveal]');
    if (item) reveal(item);
  });
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      items.forEach(reveal);
      revealObserver.disconnect();
    }
  });
  revealDestination();
}
