/**
 * 🗂️ Repositorio — Sistema de filtros para proyectos
 * 
 * Características:
 *   - Filtros combinados (año, tipo, región, búsqueda textual)
 *   - Animaciones de entrada/salida
 *   - Conteo de resultados
 *   - URL state (opcional, vía data attributes)
 */

(function () {
    'use strict';

    let proyectos = [];
    let filtrosActivos = {
        agno: null,
        tipo: null,
        region: null,
        search: '',
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRepositorio);
    } else {
        initRepositorio();
    }

    function initRepositorio() {
        const container = document.getElementById('av-repositorio');
        if (!container) return;

        const dataSrc = container.dataset.src || null;

        if (dataSrc) {
            // Cargar datos desde un JSON externo
            fetch(dataSrc)
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    proyectos = data;
                    renderFiltros(container);
                    renderProyectos(container);
                })
                .catch(function (err) {
                    console.error('Error cargando proyectos:', err);
                    container.innerHTML = '<p class="av-repositorio-empty">Error al cargar los proyectos.</p>';
                });
        } else {
            // Usar data inline (desde un script tag o shortcode)
            proyectos = window.avProyectosData || [];
            if (proyectos.length) {
                renderFiltros(container);
                renderProyectos(container);
            } else {
                // Datos de ejemplo (demostración)
                proyectos = getDefaultProyectos();
                renderFiltros(container);
                renderProyectos(container);
            }
        }
    }

    // ─── Extraer valores únicos para filtros ─────────────
    function getUniqueValues(arr, key) {
        const values = new Set();
        arr.forEach(function (item) {
            if (item[key]) values.add(item[key]);
        });
        return Array.from(values).sort();
    }

    // ─── Renderizar los botones de filtro ───────────────
    function renderFiltros(container) {
        const agnos  = getUniqueValues(proyectos, 'agno');
        const tipos  = getUniqueValues(proyectos, 'tipo');
        const regiones = getUniqueValues(proyectos, 'region');

        const header = document.createElement('div');
        header.className = 'av-repositorio-header';

        let html = '<div class="av-filtros">';

        // Filtro de búsqueda textual
        html += '<div class="av-filtro-search">';
        html += '<input type="text" id="av-search-input" placeholder="Buscar proyecto…" aria-label="Buscar proyecto">';
        html += '</div>';

        // Filtro por año
        if (agnos.length) {
            html += '<div class="av-filtros-group">';
            html += '<span class="av-filtros-label">Año</span>';
            html += '<button class="av-filtro-btn is-active" data-filter="agno" data-value="">Todos</button>';
            agnos.forEach(function (a) {
                html += '<button class="av-filtro-btn" data-filter="agno" data-value="' + a + '">' + a + '</button>';
            });
            html += '</div>';
        }

        // Filtro por tipo
        if (tipos.length) {
            html += '<div class="av-filtros-group">';
            html += '<span class="av-filtros-label">Tipo</span>';
            html += '<button class="av-filtro-btn is-active" data-filter="tipo" data-value="">Todos</button>';
            tipos.forEach(function (t) {
                html += '<button class="av-filtro-btn" data-filter="tipo" data-value="' + t + '">' + t + '</button>';
            });
            html += '</div>';
        }

        // Filtro por región
        if (regiones.length) {
            html += '<div class="av-filtros-group">';
            html += '<span class="av-filtros-label">Región</span>';
            html += '<button class="av-filtro-btn is-active" data-filter="region" data-value="">Todos</button>';
            regiones.forEach(function (r) {
                html += '<button class="av-filtro-btn" data-filter="region" data-value="' + r + '">' + r + '</button>';
            });
            html += '</div>';
        }

        html += '</div>'; // .av-filtros

        // Contador
        html += '<div class="av-repositorio-count" id="av-result-count">';
        html += proyectos.length + ' proyecto' + (proyectos.length !== 1 ? 's' : '');
        html += '</div>';

        header.innerHTML = html;
        container.prepend(header);

        // ─── Event listeners ────────────────────────────
        // Botones de filtro
        container.querySelectorAll('.av-filtro-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const filter = btn.dataset.filter;
                const value  = btn.dataset.value;

                // Actualizar estado
                filtrosActivos[filter] = value || null;

                // UI: toggle active class en el grupo
                const group = btn.closest('.av-filtros-group');
                if (group) {
                    group.querySelectorAll('.av-filtro-btn').forEach(function (b) {
                        b.classList.toggle('is-active', b.dataset.value === value);
                    });
                }

                aplicarFiltros(container);
            });
        });

        // Búsqueda textual
        const searchInput = container.querySelector('#av-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                filtrosActivos.search = this.value.toLowerCase().trim();
                aplicarFiltros(container);
            });
        }
    }

    // ─── Aplicar todos los filtros ──────────────────────
    function aplicarFiltros(container) {
        const items = container.querySelectorAll('.av-proyecto-card');
        let visibleCount = 0;

        items.forEach(function (card) {
            const agno   = card.dataset.agno;
            const tipo   = card.dataset.tipo;
            const region = card.dataset.region;
            const titulo = (card.dataset.titulo || '').toLowerCase();
            const desc   = (card.dataset.desc || '').toLowerCase();
            const autor  = (card.dataset.autor || '').toLowerCase();

            let visible = true;

            if (filtrosActivos.agno && agno !== filtrosActivos.agno) {
                visible = false;
            }
            if (visible && filtrosActivos.tipo && tipo !== filtrosActivos.tipo) {
                visible = false;
            }
            if (visible && filtrosActivos.region && region !== filtrosActivos.region) {
                visible = false;
            }
            if (visible && filtrosActivos.search) {
                const q = filtrosActivos.search;
                const hayMatch = titulo.includes(q) || desc.includes(q) || autor.includes(q);
                if (!hayMatch) visible = false;
            }

            if (visible) {
                card.classList.remove('is-hidden');
                card.classList.add('is-visible');
                visibleCount++;
            } else {
                card.classList.add('is-hidden');
                card.classList.remove('is-visible');
            }
        });

        // Actualizar contador
        const countEl = container.querySelector('#av-result-count');
        if (countEl) {
            countEl.textContent = visibleCount + ' proyecto' + (visibleCount !== 1 ? 's' : '');
        }

        // Mostrar mensaje si no hay resultados
        let emptyEl = container.querySelector('.av-repositorio-empty');
        if (visibleCount === 0) {
            if (!emptyEl) {
                emptyEl = document.createElement('div');
                emptyEl.className = 'av-repositorio-empty';
                emptyEl.innerHTML = '<p>No se encontraron proyectos con los filtros seleccionados.</p>';
                container.appendChild(emptyEl);
            }
            emptyEl.style.display = 'block';
        } else {
            if (emptyEl) emptyEl.style.display = 'none';
        }
    }

    // ─── Renderizar el grid de proyectos ────────────────
    function renderProyectos(container) {
        // Quitar grid existente si lo hay
        const oldGrid = container.querySelector('.av-proyectos-grid');
        if (oldGrid) oldGrid.remove();

        const grid = document.createElement('div');
        grid.className = 'av-proyectos-grid';

        proyectos.forEach(function (proj) {
            const card = document.createElement('div');
            card.className = 'av-proyecto-card is-visible';
            card.dataset.agno   = proj.agno || '';
            card.dataset.tipo   = proj.tipo || '';
            card.dataset.region = proj.region || '';
            card.dataset.titulo = proj.titulo || '';
            card.dataset.desc   = proj.descripcion || '';
            card.dataset.autor  = proj.autor || '';

            // Tags
            let tagsHtml = '';
            if (proj.agno)  tagsHtml += '<span class="av-proyecto-tag av-proyecto-tag-agno">' + proj.agno + '</span>';
            if (proj.tipo)  tagsHtml += '<span class="av-proyecto-tag av-proyecto-tag-tipo">' + proj.tipo + '</span>';
            if (proj.region) tagsHtml += '<span class="av-proyecto-tag">' + proj.region + '</span>';

            // Thumbnail
            let thumbHtml = '';
            if (proj.imagen) {
                thumbHtml = '<img class="av-proyecto-thumb" src="' + proj.imagen + '" alt="' + (proj.titulo || '') + '" loading="lazy">';
            } else {
                thumbHtml = '<div class="av-proyecto-thumb-placeholder">🎞️</div>';
            }

            card.innerHTML =
                thumbHtml +
                '<div class="av-proyecto-body">' +
                    '<div class="av-proyecto-meta">' + tagsHtml + '</div>' +
                    '<h3 class="av-proyecto-titulo">' + (proj.titulo || 'Sin título') + '</h3>' +
                    '<p class="av-proyecto-desc">' + (proj.descripcion || '') + '</p>' +
                    (proj.autor ? '<p class="av-proyecto-autor">— ' + proj.autor + '</p>' : '') +
                '</div>';

            grid.appendChild(card);
        });

        container.appendChild(grid);
    }

    // ─── Datos de ejemplo (fallback) ────────────────────
    function getDefaultProyectos() {
        return [
            {
                agno: '2024',
                tipo: 'Preservación',
                region: 'Lima',
                titulo: 'Restauración digital de cortometrajes andinos',
                descripcion: 'Proyecto de digitalización y restauración de 5 cortometrajes en película de 16mm de la región Cusco, realizados entre 1970 y 1985.',
                autor: 'Colectivo de Cine Andino',
            },
            {
                agno: '2024',
                tipo: 'Investigación',
                region: 'Arequipa',
                titulo: 'Archivo fílmico surandino: catalogación participativa',
                descripcion: 'Catalogación y puesta en valor de un archivo de 120 rollos de película familiar y comunitaria del sur del Perú.',
                autor: 'María Quispe Mamani',
            },
            {
                agno: '2023',
                tipo: 'Preservación',
                region: 'Lima',
                titulo: 'Digitalización del Fondo Filmográfico de la Pontificia Universidad Católica del Perú',
                descripcion: 'Digitalización y preservación de 40 títulos del archivo fílmico universitario, incluyendo material inédito de los años 60 y 70.',
                autor: 'PUCP - Archivo de Cine',
            },
            {
                agno: '2023',
                tipo: 'Difusión',
                region: 'Cusco',
                titulo: 'Cine al aire libre: proyecciones de patrimonio restaurado en comunidades rurales',
                descripcion: 'Ciclo de proyecciones gratuitas en 8 comunidades campesinas de la región Cusco con material restaurado de los años 40-60.',
                autor: 'Asociación de Cineastas del Sur',
            },
            {
                agno: '2022',
                tipo: 'Preservación',
                region: 'Lima',
                titulo: 'Restauración de la película "Tacna y Arica" (1925)',
                descripcion: 'Preservación y restauración digital del largometraje mudo más antiguo conservado en el Perú, con implicancias históricas y políticas.',
                autor: 'Archivo Peruano de Cine',
            },
            {
                agno: '2022',
                tipo: 'Investigación',
                region: 'Piura',
                titulo: 'Memorias del cine regional: historia de las salas de proyección en el norte del Perú',
                descripcion: 'Investigación sobre la historia de 30 salas de cine en las regiones de Piura, Lambayeque y La Libertad.',
                autor: 'Carlos Mendoza Ríos',
            },
            {
                agno: '2021',
                tipo: 'Formación',
                region: 'Lima',
                titulo: 'Taller de preservación audiovisual para comunidades indígenas amazónicas',
                descripcion: 'Capacitación en manejo básico de preservación digital para 15 comunicadores indígenas de la Amazonía peruana.',
                autor: 'Instituto de Etnomusicología PUCP',
            },
            {
                agno: '2021',
                tipo: 'Preservación',
                region: 'Junín',
                titulo: 'Rescate del archivo fílmico del Centro Comunitario de Huancayo',
                descripcion: 'Organización, catalogación y digitalización de 200 bobinas de película de 8mm y Super8 del archivo comunitario de la región.',
                autor: 'Centro Cultural Huancayo',
            },
        ];
    }

})();
