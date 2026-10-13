'use strict';
// Publications remain visible; details are native keyboard-accessible disclosures.
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
