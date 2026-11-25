document.documentElement.classList.add('has-js');
if (window.scrollX) {
  const savedScrollTop = window.scrollY;
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, savedScrollTop);
  document.documentElement.style.removeProperty('scroll-behavior');
}

const navItems = [
  ['Work', '/work.html', 'work'],
  ['Services', '/services.html', 'services'],
  ['Pricing', '/pricing.html', 'pricing'],
  ['FAQ', '/faq.html', 'faq'],
  ['About', '/about.html', 'about'],
];
const current = document.body.dataset.page || '';
const navLink = ([label, href, key]) => `<a href="${href}"${current === key ? ' aria-current="page"' : ''}>${label}</a>`;
const workAction = '<a class="header-work" href="/testimonials.html">Testimonials</a>';

const testimonialMarquee = document.querySelector('[data-testimonial-marquee]');
if (testimonialMarquee) {
  const firstRow = testimonialMarquee.querySelector('.testimonial-marquee__row');
  const firstTrack = firstRow?.querySelector('.testimonial-marquee__track');
  const firstGroup = firstTrack?.querySelector('.testimonial-marquee__group');
  if (firstRow && firstTrack && firstGroup) {
    const makeHiddenCopy = group => {
      const copy = group.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.inert = true;
      return copy;
    };
    const secondRow = firstRow.cloneNode(true);
    secondRow.classList.add('testimonial-marquee__row--reverse');
    secondRow.setAttribute('aria-hidden', 'true');
    secondRow.inert = true;
    const secondGroup = secondRow.querySelector('.testimonial-marquee__group');
    [...secondGroup.children].reverse().forEach(card => secondGroup.append(card));
    firstGroup.after(makeHiddenCopy(firstGroup));
    secondGroup.after(makeHiddenCopy(secondGroup));
    firstRow.after(secondRow);
    testimonialMarquee.classList.add('is-ready');

    const pauseButton = document.querySelector('[data-testimonial-motion-toggle]');
    const wall = testimonialMarquee.closest('.testimonial-wall');
    pauseButton?.addEventListener('click', () => {
      const paused = wall.classList.toggle('is-paused');
      pauseButton.setAttribute('aria-pressed', String(paused));
      pauseButton.textContent = paused ? 'Resume motion' : 'Pause motion';
    });
  }
}

const header = document.querySelector('[data-site-header]');
if (header) {
  header.innerHTML = `
    <header class="site-header">
      <div class="container header-inner">
        <a class="skip-link" href="#main-content">Skip to content</a>
        <a class="brand" href="/index.html" aria-label="Teal Stack Studios, home">
          <img class="brand-mark" src="/assets/images/brand-mark.png" alt="">
          <span class="brand-name"><strong>Teal Stack</strong><span> Studios</span></span>
        </a>
        <nav class="primary-nav" id="primary-nav" aria-label="Main navigation">${navItems.map(navLink).join('')}</nav>
        <div class="header-actions">
          ${workAction}
          <a class="header-action" href="/contact.html#inquiry">Book an appointment</a>
        </div>
        <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="primary-nav">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 6h14M3 14h14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
        </button>
      </div>
    </header>`;
}

const footer = document.querySelector('[data-site-footer]');
if (footer) {
  footer.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-call">
            <p class="eyebrow">Teal Stack Studios</p>
            <h2>Have a business idea to <span class="accent">move forward?</span></h2>
            <a class="button button--light" href="/contact.html#inquiry">Book an appointment <span aria-hidden="true">↗</span></a>
          </div>
          <div class="footer-details">
            <a class="footer-email" href="mailto:tealstackstudios@gmail.com">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2.75" y="4.75" width="18.5" height="14.5" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="m4 6.5 8 6 8-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              tealstackstudios@gmail.com
            </a>
            <a class="footer-social" href="https://www.instagram.com/teal_stack_studios/" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/><circle cx="17.5" cy="6.8" r="1" fill="currentColor"/></svg>
              Instagram · @teal_stack_studios
            </a>
            <nav class="footer-nav" aria-label="Footer navigation">
              <a href="/work.html">Work</a><a href="/services.html">Services</a><a href="/pricing.html">Pricing</a><a href="/faq.html">FAQ</a><a href="/about.html">About</a><a href="/testimonials.html">Testimonials</a><a href="/contact.html">Contact</a>
            </nav>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© <span data-year></span> Teal Stack Studios</span>
          <nav class="footer-legal" aria-label="Legal links"><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms of use</a><a href="/copyright.html">Copyright</a></nav>
        </div>
      </div>
    </footer>`;
}

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

const inquiryForm = document.querySelector('#inquiry');
if (inquiryForm) {
  const isLocalPreview = location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname);
  if (isLocalPreview) {
  inquiryForm.addEventListener('submit', event => {
    event.preventDefault();
    const fields = new FormData(inquiryForm);
    const subject = `Appointment inquiry: ${fields.get('name')} — ${fields.get('service')}`;
    const body = [
      `Name: ${fields.get('name')}`,
      `Email: ${fields.get('email')}`,
      `Service: ${fields.get('service')}`,
      `Preferred appointment time: ${fields.get('preferred-appointment') || 'Not specified'}`,
      '',
      'Project details:',
      fields.get('project-details'),
    ].join('\n');
    const status = inquiryForm.querySelector('.form-status');
    if (status) status.textContent = 'Your email app should open with this inquiry ready. Send the email to complete your request.';
    window.location.href = `mailto:tealstackstudios@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
  } else {
    inquiryForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (!inquiryForm.reportValidity()) return;

      const submitButton = inquiryForm.querySelector('[type="submit"]');
      const status = inquiryForm.querySelector('.form-status');
      if (submitButton) submitButton.disabled = true;
      if (status) status.textContent = 'Sending your inquiry…';

      try {
        const response = await fetch(inquiryForm.action, {
          method: 'POST',
          body: new FormData(inquiryForm),
          headers: { Accept: 'application/json' },
        });

        if (response.ok && response.redirected) {
          window.location.assign(response.url);
          return;
        }

        let result = {};
        try { result = await response.json(); } catch { /* Use the fallback message below. */ }
        if (!response.ok) throw new Error(result.error || 'We could not send your inquiry. Please try again.');
        window.location.assign('/thank-you.html');
      } catch (error) {
        if (status) status.textContent = error instanceof Error
          ? error.message
          : 'We could not send your inquiry. Please email tealstackstudios@gmail.com directly.';
        if (submitButton) submitButton.disabled = false;
      }
    });
  }
}

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
function closeMenu() {
  if (!toggle || !nav) return;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  nav?.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); }, { passive: true });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealTargets = document.querySelectorAll(
  '.page-intro .page-heading, .section-heading, .project-row, .service-item, .studio-value, .case-body, .price-row, .quote-factors article, .contact-info, .contact-form, .empty-state'
);
revealTargets.forEach((item, index) => {
  item.dataset.reveal = '';
  item.style.setProperty('--reveal-delay', `${(index % 3) * 55}ms`);
});

const spotlightTargets = document.querySelectorAll('.project-row, .service-item, .studio-value, .service-detail article, .quote-factors article');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
  spotlightTargets.forEach(item => {
    item.classList.add('aceternity-spotlight');
    item.addEventListener('pointermove', event => {
      const bounds = item.getBoundingClientRect();
      item.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
      item.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
    }, { passive: true });
  });
}

const tiltCard = document.querySelector('[data-tilt-card]');
if (tiltCard) {
  const resetTilt = () => {
    tiltCard.style.setProperty('--tilt-x', '0deg');
    tiltCard.style.setProperty('--tilt-y', '0deg');
    tiltCard.style.setProperty('--spotlight-x', '50%');
    tiltCard.style.setProperty('--spotlight-y', '50%');
  };
  const setTilt = (clientX, clientY, depth = 7) => {
    const bounds = tiltCard.getBoundingClientRect();
    const x = (clientX - bounds.left) / bounds.width;
    const y = (clientY - bounds.top) / bounds.height;
    tiltCard.style.setProperty('--tilt-x', `${((.5 - y) * depth).toFixed(2)}deg`);
    tiltCard.style.setProperty('--tilt-y', `${((x - .5) * depth).toFixed(2)}deg`);
    tiltCard.style.setProperty('--spotlight-x', `${(x * 100).toFixed(1)}%`);
    tiltCard.style.setProperty('--spotlight-y', `${(y * 100).toFixed(1)}%`);
  };
  if (!reduceMotion) {
    tiltCard.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch') setTilt(event.clientX, event.clientY, 6);
    }, { passive: true });
    tiltCard.addEventListener('pointermove', event => setTilt(event.clientX, event.clientY, event.pointerType === 'touch' ? 6 : 12), { passive: true });
    tiltCard.addEventListener('pointerleave', resetTilt, { passive: true });
    tiltCard.addEventListener('pointerup', resetTilt, { passive: true });
    tiltCard.addEventListener('pointercancel', resetTilt, { passive: true });
    tiltCard.addEventListener('keydown', event => {
      const step = 3;
      let x = parseFloat(tiltCard.style.getPropertyValue('--tilt-x')) || 0;
      let y = parseFloat(tiltCard.style.getPropertyValue('--tilt-y')) || 0;
      if (event.key === 'ArrowUp') x = Math.min(x + step, 10);
      else if (event.key === 'ArrowDown') x = Math.max(x - step, -10);
      else if (event.key === 'ArrowLeft') y = Math.max(y - step, -10);
      else if (event.key === 'ArrowRight') y = Math.min(y + step, 10);
      else if (event.key === 'Escape') resetTilt();
      else return;
      event.preventDefault();
      tiltCard.style.setProperty('--tilt-x', `${x}deg`);
      tiltCard.style.setProperty('--tilt-y', `${y}deg`);
    });
    tiltCard.addEventListener('blur', resetTilt);
  }
}

const revealItems = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

