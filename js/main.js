/* ============================================
   AROMA VIVO — Landing Page JavaScript
   Animations, Navigation, Counter
   ============================================ */

(function () {
    'use strict';

    // ========== HEADER SCROLL EFFECT ==========
    const header = document.getElementById('header');
    let lastScrollY = 0;

    function handleHeaderScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // ========== MOBILE MENU ==========
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function () {
            const isOpen = nav.classList.toggle('open');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu on link click
        nav.querySelectorAll('.header__link').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ========== SCROLL ANIMATIONS (IntersectionObserver) ==========
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        var observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1
        };

        var scrollObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animateElements.forEach(function (el) {
            scrollObserver.observe(el);
        });
    } else {
        // Fallback: show all elements
        animateElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // ========== BENEFITS STAGGER ANIMATION ==========
    var benefitsGrid = document.querySelector('.beneficios__grid');
    if (benefitsGrid && 'IntersectionObserver' in window) {
        var benefits = benefitsGrid.querySelectorAll('.benefit');
        // Remove do observer genérico — controle manual
        benefits.forEach(function (b) {
            scrollObserver.unobserve(b);
        });

        var benefitsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    benefits.forEach(function (b, i) {
                        setTimeout(function () {
                            b.classList.add('visible');
                        }, i * 150);
                    });
                    benefitsObserver.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.15 });

        benefitsObserver.observe(benefitsGrid);
    }

    // ========== COUNTER ANIMATION ==========
    var counters = document.querySelectorAll('.counter');

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var duration = 2000; // 2 seconds
        var startTime = null;
        var startValue = 0;

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function updateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var easedProgress = easeOutCubic(progress);
            var currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

            el.textContent = '~' + currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = '~' + target;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    if ('IntersectionObserver' in window) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    } else {
        counters.forEach(function (counter) {
            counter.textContent = '~' + counter.getAttribute('data-target');
        });
    }

    // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========== STAGGER ANIMATION FOR GRID ITEMS ==========
    function staggerChildren(parentSelector, childSelector) {
        var parents = document.querySelectorAll(parentSelector);
        parents.forEach(function (parent) {
            var children = parent.querySelectorAll(childSelector);
            children.forEach(function (child, index) {
                child.style.transitionDelay = (index * 0.1) + 's';
            });
        });
    }

    staggerChildren('.beneficios__grid', '.card');
    staggerChildren('.depoimentos__grid', '.depoimento-card');
    staggerChildren('.sabores__track', '.sabor-card');

    // ========== LAZY LOAD VIDEO ==========
    var video = document.querySelector('.video-section__player video');
    if (video && 'IntersectionObserver' in window) {
        var videoSource = video.querySelector('source');
        var originalSrc = videoSource ? videoSource.getAttribute('src') : null;

        // Only preload metadata initially; full load happens on play
        video.setAttribute('preload', 'metadata');
    }

})();
