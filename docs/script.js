/* ========================================
   Jasmine Flower Shop — Main Script
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ── Mobile Navigation ──
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = navMenu.querySelectorAll('.nav__link');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
        }
    });

    // ── Header Scroll Effect ──
    const header = document.getElementById('header');
    const scrollTop = document.getElementById('scroll-top');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Header shadow
        header.classList.toggle('header--scrolled', scrollY > 50);

        // Scroll-to-top button
        scrollTop.classList.toggle('visible', scrollY > 400);

        // Active nav link
        updateActiveNav();
    });

    scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── Active Navigation Link ──
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }

    // ── Product Filters ──
    const filterBtns = document.querySelectorAll('.products__filter');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            productCards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                    card.style.animation = 'fadeInUp 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ── Testimonials Slider ──
    const track = document.querySelector('.testimonials__track');
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('testimonials-dots');
    const prevBtn = document.querySelector('.testimonials__btn--prev');
    const nextBtn = document.querySelector('.testimonials__btn--next');

    let currentSlide = 0;
    let slidesVisible = getSlidesVisible();
    let totalDots = Math.max(1, testimonials.length - slidesVisible + 1);

    function getSlidesVisible() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('testimonials__dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function goToSlide(index) {
        currentSlide = Math.max(0, Math.min(index, totalDots - 1));
        const percentage = (currentSlide * 100) / slidesVisible;
        track.style.transform = `translateX(-${percentage}%)`;
        updateDots();
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.testimonials__dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Recalculate on resize
    window.addEventListener('resize', () => {
        slidesVisible = getSlidesVisible();
        totalDots = Math.max(1, testimonials.length - slidesVisible + 1);
        createDots();
        goToSlide(Math.min(currentSlide, totalDots - 1));
    });

    createDots();

    // Auto-play
    let autoPlay = setInterval(() => {
        goToSlide(currentSlide + 1 >= totalDots ? 0 : currentSlide + 1);
    }, 5000);

    // Pause on hover
    const slider = document.getElementById('testimonials-slider');
    slider.addEventListener('mouseenter', () => clearInterval(autoPlay));
    slider.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => {
            goToSlide(currentSlide + 1 >= totalDots ? 0 : currentSlide + 1);
        }, 5000);
    });

    // ── Scroll Animations ──
    const animateElements = document.querySelectorAll(
        '.about__grid, .product-card, .service-card, .testimonial-card, .gallery__item, .contact__grid, .section__header'
    );

    animateElements.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animateElements.forEach(el => observer.observe(el));

    // ── Contact Form ──
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Simulate form submission
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = 'Message Sent!';
            btn.style.background = '#5a9e6f';
            contactForm.reset();

            showNotification('Thank you! We\'ll get back to you soon.', 'success');

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 2000);
        }, 1200);
    });

    // ── Newsletter Form ──
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        if (input.value) {
            showNotification('You\'re subscribed! Welcome to the Jasmine family.', 'success');
            input.value = '';
        }
    });

    // ── Notification Helper ──
    function showNotification(message, type) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;

        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%) translateY(20px)',
            padding: '0.875rem 1.5rem',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#fff',
            background: type === 'success' ? '#5a9e6f' : '#c4727f',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            zIndex: '9999',
            opacity: '0',
            transition: 'all 0.3s ease',
        });

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3500);
    }
});

/* CSS animation keyframes added via JS */
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
