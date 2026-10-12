'use strict';
const navLinks = [...document.querySelectorAll('nav a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, {rootMargin:'-12% 0px -62% 0px',threshold:0});
  document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
}
const filters = [...document.querySelectorAll('[data-filter]')];
const papers = [...document.querySelectorAll('.paper[data-category]')];
const status = document.getElementById('filter-status');
filters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  let visible = 0;
  papers.forEach(paper => {
    const shown = category === 'all' || paper.dataset.category === category;
    paper.hidden = !shown;
    if (shown) visible++;
  });
  const label = button.textContent.replace(/\s*\d+\s*$/, '').trim();
  status.textContent = category === 'all' ? `Showing all ${visible} publications.` : `Showing ${visible} ${label.toLowerCase()} ${visible === 1 ? 'publication' : 'publications'}.`;
}));
// A news link must still reach a paper hidden by a previous category selection.
document.querySelectorAll('a[href^="#paper-"]').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (target?.hidden) filters.find(button => button.dataset.filter === 'all').click();
  });
});

// An explicitly labelled illustration; never substitute it for research footage.
const gripper = document.getElementById('gripper-illustration');
const gripperToggle = document.getElementById('gripper-toggle');
if (gripper && gripperToggle) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let illustrationPaused = false;
  function updateIllustration() {
    const motionOff = reducedMotion.matches;
    gripper.classList.toggle('motion-enabled', !motionOff);
    gripper.classList.toggle('motion-paused', illustrationPaused || motionOff);
    gripperToggle.hidden = false;
    gripperToggle.disabled = motionOff;
    gripperToggle.setAttribute('aria-pressed', String(!illustrationPaused && !motionOff));
    gripperToggle.textContent = motionOff ? 'Motion off' : illustrationPaused ? 'Play illustration' : 'Pause illustration';
    gripperToggle.title = motionOff ? 'Your reduced-motion preference is enabled.' : '';
  }
  gripperToggle.addEventListener('click', () => {
    illustrationPaused = !illustrationPaused;
    updateIllustration();
  });
  reducedMotion.addEventListener('change', updateIllustration);
  updateIllustration();
}
