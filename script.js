/**
 * SkillForge - Interactive Landing Page
 * SkillCraft Technology Web Development Internship - Task 01
 * 
 * Features:
 * - Dynamic scroll-aware navigation styling
 * - Active section highlight (ScrollSpy)
 * - Accessible mobile hamburger toggle
 * - Smooth scroll with fixed-header offset
 * - IntersectionObserver scroll-reveal animations
 * - Animated statistics counter
 * - Interactive client-side contact form validation
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const statNumbers = document.querySelectorAll('.stat-number');
  const backToTopBtn = document.getElementById('backToTopBtn');

  /* ------------------------------------------------------------------------
     1. Scroll-Aware Navbar Styling
     ------------------------------------------------------------------------ */
  const SCROLL_THRESHOLD = 50;

  function handleNavbarScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Initial check on load
  handleNavbarScroll();

  // Optimized scroll event listener with requestAnimationFrame
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        handleNavbarScroll();
        highlightActiveSection();
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  /* ------------------------------------------------------------------------
     2. Active Section Highlighting (ScrollSpy)
     ------------------------------------------------------------------------ */
  function highlightActiveSection() {
    const scrollPosition = window.scrollY + 120; // Offset for header detection

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });

    // Handle edge case when at the very bottom of the page
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
      navLinks.forEach(link => link.classList.remove('active'));
      const lastNavLink = document.querySelector('.nav-link[href="#contact"]');
      if (lastNavLink) lastNavLink.classList.add('active');
    }
  }

  /* ------------------------------------------------------------------------
     3. Smooth Scrolling with Fixed Navbar Offset
     ------------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();

        // Calculate offset dynamically based on current navbar state
        const navbarHeight = navbar.classList.contains('scrolled') ? 68 : 82;
        const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navbarHeight + 10;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });

  /* ------------------------------------------------------------------------
     4. Mobile Hamburger Menu Toggle
     ------------------------------------------------------------------------ */
  function toggleMobileMenu() {
    const isOpen = navMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('is-active', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    hamburgerBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    
    // Prevent background scrolling on small viewports when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  function closeMobileMenu() {
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      hamburgerBtn.classList.remove('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      hamburgerBtn.setAttribute('aria-label', 'Open navigation menu');
      document.body.style.overflow = '';
    }
  }

  hamburgerBtn.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when clicking outside of it
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && 
        !navMenu.contains(e.target) && 
        !hamburgerBtn.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Close mobile menu with keyboard ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMobileMenu();
      hamburgerBtn.focus();
    }
  });

  /* ------------------------------------------------------------------------
     5. Scroll-Reveal Animations (IntersectionObserver)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ------------------------------------------------------------------------
     6. Animated Statistics Counter (IntersectionObserver)
     ------------------------------------------------------------------------ */
  let statsAnimated = false;

  function animateCount(element, target, duration = 1800) {
    let startTimestamp = null;
    const startValue = 0;

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing: easeOutExpo curve for pleasant deceleration
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = Math.floor(easeProgress * (target - startValue) + startValue);

      // Format thousands with comma if applicable
      element.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = target.toLocaleString();
      }
    }

    window.requestAnimationFrame(step);
  }

  const statsSection = document.getElementById('statistics');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            if (!isNaN(target)) {
              animateCount(stat, target);
            }
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });

    statsObserver.observe(statsSection);
  }

  /* ------------------------------------------------------------------------
     7. Contact Form Validation & Friendly Feedback
     ------------------------------------------------------------------------ */
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    // Helper: Valid email check
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    // Clear individual field errors on input
    [nameInput, emailInput, messageInput].forEach(input => {
      if (!input) return;
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const errSpan = document.getElementById(`${input.id}Error`);
        if (errSpan) errSpan.classList.remove('visible');
        formFeedback.style.display = 'none';
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.classList.add('error');
        if (nameError) {
          nameError.textContent = 'Please enter your full name.';
          nameError.classList.add('visible');
        }
        isValid = false;
      } else {
        nameInput.classList.remove('error');
        if (nameError) nameError.classList.remove('visible');
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        emailInput.classList.add('error');
        if (emailError) {
          emailError.textContent = 'Please enter your email address.';
          emailError.classList.add('visible');
        }
        isValid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        emailInput.classList.add('error');
        if (emailError) {
          emailError.textContent = 'Please enter a valid email format (e.g., name@example.com).';
          emailError.classList.add('visible');
        }
        isValid = false;
      } else {
        emailInput.classList.remove('error');
        if (emailError) emailError.classList.remove('visible');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageInput.classList.add('error');
        if (messageError) {
          messageError.textContent = 'Please provide a message or inquiry.';
          messageError.classList.add('visible');
        }
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        messageInput.classList.add('error');
        if (messageError) {
          messageError.textContent = 'Your message must be at least 10 characters.';
          messageError.classList.add('visible');
        }
        isValid = false;
      } else {
        messageInput.classList.remove('error');
        if (messageError) messageError.classList.remove('visible');
      }

      if (!isValid) {
        // Focus first invalid input
        const firstError = contactForm.querySelector('.form-input.error, .form-textarea.error');
        if (firstError) firstError.focus();
        return;
      }

      // Simulated successful submission
      const userName = nameInput.value.trim();
      const submitBtn = contactForm.querySelector('.form-submit-btn');
      const originalBtnText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 1 1 10 10"></path>
        </svg>
        Sending...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Thank you, <strong>${userName}</strong>! Your message has been sent successfully. We will be in touch shortly.</span>
        `;
        formFeedback.style.display = 'flex';

        // Reset form
        contactForm.reset();

        // Auto-hide feedback after 8 seconds
        setTimeout(() => {
          formFeedback.style.display = 'none';
        }, 8000);
      }, 700);
    });
  }

  /* ------------------------------------------------------------------------
     8. Back to Top Smooth Scroll
     ------------------------------------------------------------------------ */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});