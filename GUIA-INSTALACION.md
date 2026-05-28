# Archivo en disputa — Guía de instalación

## Requisitos
- WordPress 5.8+
- Tema padre **Hello Elementor** instalado
- Plugin **Elementor** (gratuito) instalado y activado

## Instalación

### 1. Hello Elementor (tema padre)
Apariencia → Temas → Añadir nuevo → buscar "Hello Elementor" → instalar y activar

### 2. Subir el tema hijo
Opción A (SFTP/FTP): copia la carpeta `tema-hijo-elementor` a `/wp-content/themes/`
Opción B (WP admin): Apariencia → Temas → Añadir nuevo → Subir → comprime `tema-hijo-elementor` como ZIP y súbelo

### 3. Activar
Apariencia → Temas → activar **"Archivo en disputa"**

El tema hijo cargará automáticamente:
- Google Fonts (Oswald + Source Sans 3 + JetBrains Mono)
- Design System CSS (variables, botones, tarjetas, layout)
- CSS y JS de Timeline + Repositorio + animaciones

## Design System

### Colores globales (Elementor → Ajustes → Colores)

| Nombre | Código | Uso |
|--------|--------|-----|
| Fondo | `#FAFAF8` | Background principal |
| Texto | `#1A1A1A` | Textos y títulos |
| Acento | `#4E6B4E` | Verde terrozo — botones, links, badges |
| Muted | `#999` | Textos secundarios |
| Borde | `#ECECEC` | Líneas divisorias |
| Dark surface | `#1E1E1E` | Secciones oscuras |

### Tipografía global (Elementor → Ajustes → Tipografía)

| Uso | Fuente |
|-----|--------|
| Headings | Oswald (uppercase, weights 400–700) |
| Body | Source Sans 3 (weights 300–700) |
| Mono (fechas, datos) | JetBrains Mono (weights 400, 500) |

## Shortcodes disponibles

- `[av_timeline type="vertical"]` — Timeline vertical para página Tacna y Arica
- `[av_timeline type="horizontal"]` — Timeline horizontal para evolución de estímulos
- `[av_repositorio]` — Grid de proyectos con filtros

En Elementor: añade un widget **HTML** y pega el shortcode.

## Estructura del tema hijo

```
tema-hijo-elementor/
├── style.css
├── functions.php
└── assets/
    ├── css/
    │   ├── design-system.css
    │   ├── timeline.css
    │   └── repository.css
    ├── js/
    │   ├── timeline.js
    │   ├── repository.js
    │   └── custom.js
    └── img/
```
