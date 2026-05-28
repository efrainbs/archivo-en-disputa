/**
 * 📜 Timeline — Scroll-triggered animations
 * 
 * Usa Intersection Observer para activar las animaciones
 * de entrada de los elementos de la línea de tiempo
 * cuando entran al viewport.
 * 
 * Soporta:
 *   - Timeline vertical (alternada izquierda/derecha)
 *   - Timeline horizontal (scroll horizontal con snaps)
 *   - Imágenes, videos y audios embebidos
 */

(function () {
    'use strict';

    // ─── Init cuando el DOM está listo ─────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTimelines);
    } else {
        initTimelines();
    }

    function initTimelines() {
        const timelines = document.querySelectorAll('.av-timeline');

        if (!timelines.length) return;

        timelines.forEach(function (timeline) {
            const items = timeline.querySelectorAll('.av-timeline-item');
            if (!items.length) return;

            // ▸ Configurar Intersection Observer
            const observer = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry, index) {
                        if (entry.isIntersecting) {
                            // Añadir un pequeño delay escalonado
                            const delay = Array.from(items).indexOf(entry.target) * 100;
                            setTimeout(function () {
                                entry.target.classList.add('is-visible');
                            }, delay);

                            // Dejar de observar una vez visible
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    root: null,          // viewport
                    rootMargin: '0px 0px -80px 0px', // trigger antes de llegar
                    threshold: 0.15,      // 15% visible
                }
            );

            // ▸ Observar cada item
            items.forEach(function (item) {
                observer.observe(item);
            });

            // ▸ Para timelines horizontales, resaltar el ítem activo
            if (timeline.dataset.type === 'horizontal') {
                initHorizontalScroll(timeline, items);
            }
        });
    }

    /**
     * Para timelines horizontales: detectar qué ítem está
     * centrado en el viewport y añadir clase 'is-active'
     */
    function initHorizontalScroll(timeline, items) {
        const track = timeline.querySelector('.av-timeline-track');
        if (!track) return;

        const scrollObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-active');
                    } else {
                        entry.target.classList.remove('is-active');
                    }
                });
            },
            {
                root: timeline,
                rootMargin: '-40% 0px -40% 0px',
                threshold: 0,
            }
        );

        items.forEach(function (item) {
            scrollObserver.observe(item);
        });
    }

})();
