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
