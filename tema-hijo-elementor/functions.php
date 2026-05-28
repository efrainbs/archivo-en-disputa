<?php
/**
 * Theme Functions - Antropología Visual
 *
 * Tema hijo de Hello Elementor
 */

// ─── 1. Enqueue styles ────────────────────────────────────────────────
add_action('wp_enqueue_scripts', 'av_enqueue_styles');
function av_enqueue_styles() {
    $theme = wp_get_theme();

    // Parent theme style (Hello Elementor)
    wp_enqueue_style(
        'hello-elementor',
        get_template_directory_uri() . '/style.css',
        [],
        $theme->parent()->get('Version')
    );

    // Child theme style
    wp_enqueue_style(
        'antropologia-visual',
        get_stylesheet_uri(),
        ['hello-elementor'],
        $theme->get('Version')
    );

    // Design System — variables globales + base
    wp_enqueue_style(
        'av-design-system',
        get_stylesheet_directory_uri() . '/assets/css/design-system.css',
        ['antropologia-visual'],
        $theme->get('Version')
    );

    // Timeline styles (páginas 1 y 3)
    wp_enqueue_style(
        'av-timeline',
        get_stylesheet_directory_uri() . '/assets/css/timeline.css',
        ['av-design-system'],
        $theme->get('Version')
    );

    // Repository styles (página 2)
    wp_enqueue_style(
        'av-repository',
        get_stylesheet_directory_uri() . '/assets/css/repository.css',
        ['av-design-system'],
        $theme->get('Version')
    );
}

// ─── 2. Enqueue scripts ───────────────────────────────────────────────
add_action('wp_enqueue_scripts', 'av_enqueue_scripts');
function av_enqueue_scripts() {
    $theme = wp_get_theme();

    // Intersection Observer para scroll-triggered animations
    wp_enqueue_script(
        'av-timeline',
        get_stylesheet_directory_uri() . '/assets/js/timeline.js',
        [],
        $theme->get('Version'),
        true
    );

    // Repository filters
    wp_enqueue_script(
        'av-repository',
        get_stylesheet_directory_uri() . '/assets/js/repository.js',
        [],
        $theme->get('Version'),
        true
    );

    // Custom animations and interactions
    wp_enqueue_script(
        'av-custom',
        get_stylesheet_directory_uri() . '/assets/js/custom.js',
        [],
        $theme->get('Version'),
        true
    );
}

// ─── 3. Cargar Google Fonts ───────────────────────────────────────────
add_action('wp_enqueue_scripts', 'av_google_fonts');
function av_google_fonts() {
    wp_enqueue_style(
        'av-google-fonts',
        'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
        [],
        null
    );
}

// ─── 4. Soporte para el theme ─────────────────────────────────────────
add_action('after_setup_theme', 'av_theme_support');
function av_theme_support() {
    // Soporte para logo personalizado
    add_theme_support('custom-logo', [
        'height'      => 80,
        'width'       => 280,
        'flex-height' => true,
        'flex-width'  => true,
    ]);
}

// ─── 5. Clases adicionales al body ─────────────────────────────────────
add_filter('body_class', 'av_body_classes');
function av_body_classes($classes) {
    if (function_exists('is_elementor_page') && is_elementor_page()) {
        $classes[] = 'av-elementor-page';
    }
    return $classes;
}

// ─── 6. Shortcode para línea de tiempo ────────────────────────────────
add_shortcode('av_timeline', 'av_timeline_shortcode');
function av_timeline_shortcode($atts) {
    $atts = shortcode_atts([
        'type' => 'horizontal', // horizontal | vertical
    ], $atts);

    wp_enqueue_style('av-timeline');
    wp_enqueue_script('av-timeline');

    return '<div class="av-timeline" data-type="' . esc_attr($atts['type']) . '"></div>';
}

// ─── 7. Shortcode para repositorio ────────────────────────────────────
add_shortcode('av_repositorio', 'av_repositorio_shortcode');
function av_repositorio_shortcode($atts) {
    wp_enqueue_style('av-repository');
    wp_enqueue_script('av-repository');

    return '<div class="av-repositorio" id="av-repositorio"></div>';
}
