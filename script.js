(() => {
  'use strict';

  // CONFIGURE THESE TWO VALUES BEFORE LAUNCH.
  // Create a SIRIUS-specific endpoint at https://formspree.io/ so enquiries do not mix with another project.
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/REPLACE_WITH_SIRIUS_FORM_ID';
  // Enter digits only, including country code, e.g. 919876543210. Leave blank until confirmed.
  const WHATSAPP_NUMBER = '';

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const navLinks = nav ? nav.querySelectorAll('a') : [];
  const header = document.querySelector('.site-header');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function closeMenu() {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('is-open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 700) closeMenu(); });
  }

  const updateHeader = () => header && header.classList.toggle('is-scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Reveal content as it enters view; reduced-motion users see everything immediately.
  const revealTargets = document.querySelectorAll('.section-kicker, .approach-grid, .manifesto-strip, .principle, .visual-world, .service-feature, .services-bottomline, .project-card, .project-mini, .work-note, .process-visual, .process-step, .cta-band > *, .contact-copy, .contact-form');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
    revealTargets.forEach((target, index) => {
      target.classList.add('reveal');
      if (target.classList.contains('principle') || target.classList.contains('process-step') || target.classList.contains('project-mini')) {
        target.classList.add(`reveal-delay-${(index % 3) + 1}`);
      }
      observer.observe(target);
    });
  }

  // Gentle pointer response on desktop only; intentionally disabled for touch and reduced motion.
  if (!reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('pointermove', event => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        hero.style.setProperty('--pointer-x', `${x * 12}px`);
        hero.style.setProperty('--pointer-y', `${y * 10}px`);
      }, { passive: true });
    }
  }

  // WhatsApp links fall back to the enquiry section until a real number is configured.
  document.querySelectorAll('[data-whatsapp]').forEach(link => {
    if (WHATSAPP_NUMBER && /^\d{8,15}$/.test(WHATSAPP_NUMBER)) {
      link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi SIRIUS, I would like to discuss a website or digital project.')}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else {
      link.href = '#contact-form';
      link.addEventListener('click', event => {
        event.preventDefault();
        const form = document.getElementById('contact-form');
        if (form) form.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
        const status = document.getElementById('form-status');
        if (status) {
          status.textContent = 'WhatsApp is ready to connect—add the SIRIUS business number in script.js before launch.';
          status.classList.remove('error', 'success');
          status.classList.add('sending');
        }
      });
    }
  });

  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (form && status) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      status.classList.remove('error', 'success', 'sending');
      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const interest = form.elements.interest.value;
      const message = form.elements.message.value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!name || !email || !interest || !message) {
        status.textContent = 'Please complete all required fields before sending your enquiry.';
        status.classList.add('error');
        return;
      }
      if (!emailOk) {
        status.textContent = 'Please enter a valid email address so we can reply.';
        status.classList.add('error');
        form.elements.email.focus();
        return;
      }
      if (form.elements._gotcha.value) return;
      if (!FORMSPREE_ENDPOINT.includes('REPLACE_WITH_SIRIUS_FORM_ID')) {
        const submit = form.querySelector('[type="submit"]');
        const originalText = submit.innerHTML;
        submit.disabled = true;
        submit.innerHTML = 'SENDING… <span aria-hidden="true">↗</span>';
        status.textContent = 'Sending your enquiry securely…';
        status.classList.add('sending');
        try {
          const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
          });
          if (!response.ok) throw new Error('Form service returned an error');
          form.reset();
          status.textContent = 'Enquiry sent. Thanks for reaching out to SIRIUS—we’ll be in touch.';
          status.classList.remove('sending');
          status.classList.add('success');
        } catch (error) {
          status.textContent = 'We couldn’t send that just now. Please try again in a moment or contact us on WhatsApp.';
          status.classList.remove('sending');
          status.classList.add('error');
        } finally {
          submit.disabled = false;
          submit.innerHTML = originalText;
        }
      } else {
        status.textContent = 'The form is ready for testing, but automatic delivery is not active yet. Add the SIRIUS Formspree endpoint in script.js before launch.';
        status.classList.add('error');
      }
    });
  }
})();