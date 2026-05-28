/**
 * 🧩 Custom Interactions — Antropología Visual
 *
 * Micro-interacciones y efectos visuales:
 *   - Navbar transparente → sólida al scrollear
 *   - Smooth reveal para secciones
 *   - Contador de números en estadísticas
 *   - Lazy loading de imágenes con fade-in
 */

(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCustom);
    } else {
        initCustom();
    }

    function initCustom() {
        stickyHeader();
        smoothReveal();
        initCounters();
        if (window.lazyLoadOptions) {
            initLazyLoading();
        }
    }

    // ─── Header sticky con transición ────────────────────
    function stickyHeader() {
        const header = document.querySelector('.site-header, #masthead, .av-header');
        if (!header) return;

        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        header.classList.add('is-scrolled');
                    } else {
                        header.classList.remove('is-scrolled');
                    }
                });
            },
            { threshold: 0 }
        );

        // Observar un elemento invisible al inicio del body
        const sentinel = document.createElement('div');
        sentinel.style.position = 'absolute';
        sentinel.style.top = '0';
        sentinel.style.left = '0';
        sentinel.style.width = '1px';
        sentinel.style.height = '1px';
        sentinel.style.opacity = '0';
        sentinel.style.pointerEvents = 'none';
        document.body.prepend(sentinel);
        observer.observe(sentinel);
    }

    // ─── Reveal suave para secciones ─────────────────────
    function smoothReveal() {
        const sections = document.querySelectorAll(
            '.av-section, .elementor-section:not(.elementor-element-overlay)'
        );

        if (!sections.length) return;

        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('av-revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '0px 0px -80px 0px',
                threshold: 0.1,
            }
        );

        sections.forEach(function (section) {
            section.classList.add('av-reveal');
            observer.observe(section);
        });
    }

    // ─── Contadores animados ─────────────────────────────
    function initCounters() {
        const counters = document.querySelectorAll('.av-counter');
        if (!counters.length) return;

        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(function (counter) {
            observer.observe(counter);
        });
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10) || 0;
        const duration = 2000; // ms
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    }

    // ─── Lazy loading con fade-in ────────────────────────
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        if (!images.length) return;

        images.forEach(function (img) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.6s ease';

            img.addEventListener('load', function () {
                img.style.opacity = '1';
            });

            if (img.complete) {
                img.style.opacity = '1';
            }
        });
    }

})();
