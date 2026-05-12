<?php

/**
 * cbtheme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package cbtheme
 */

// Ensure this file is being accessed within WordPress
if (!defined('ABSPATH')) {
    exit;
}
define('PRIVATE_DIR',$_SERVER['DOCUMENT_ROOT'].'/wp-content/private');

require_once PRIVATE_DIR.'/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(PRIVATE_DIR);
$dotenv->load();

Timber\Timber::init();

define('_ENV', $_ENV["ENV"]);

if (!defined('_S_VERSION')) {
    if (_ENV == 'development')
        define('_S_VERSION', uniqid());
    else
        define('_S_VERSION', '1.0.0');
}

include 'includes/svg.php';
include 'includes/timber.php';
include 'includes/dd.php';
include 'includes/hide-comments.php';
include 'includes/hooks_filters.php';
include 'includes/shortcodes.php';
include 'includes/global_functions.php';
include 'includes/support-header-security.php';


if (!function_exists('bf_setup')):
    /**
     * Sets up theme defaults and registers support for various WordPress features.
     *
     * Note that this function is hooked into the after_setup_theme hook, which
     * runs before the init hook. The init hook is too late for some features, such
     * as indicating support for post thumbnails.
     */
    function bf_setup()
    {
        /*
         * Let WordPress manage the document title.
         * By adding theme support, we declare that this theme does not use a
         * hard-coded <title> tag in the document head, and expect WordPress to
         * provide it for us.
         */
        add_theme_support('align-wide');
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails');
    }
endif;

add_action('after_setup_theme', 'bf_setup');
















/******************** LOAD CSS/JS ************************/
add_action('wp_enqueue_scripts', 'load_js_scripts');
add_action('wp_enqueue_scripts', 'load_css_styles');
add_action('admin_enqueue_scripts', 'enqueue_admin_scripts_and_styles');


function load_css_styles()
{
    wp_enqueue_style('normalize-style', get_template_directory_uri() . '/assets/css/theme/normalize.css', array(), _S_VERSION);
    wp_enqueue_style('admin-bar-style', get_template_directory_uri() . '/assets/css/admin/bar.css', array(), _S_VERSION);
    
    wp_enqueue_style('theme-style', get_template_directory_uri() . '/assets/css/theme/styles.css', array(), uniqid());

    wp_register_style('swiper-style', get_template_directory_uri() . '/assets/css/external/swiper-bundle.min.css', array(), _S_VERSION);
    wp_register_style('jquery-ui-style', get_template_directory_uri() . '/assets/css/external/jquery-ui.css', array(), _S_VERSION);
    wp_register_style('owl-style', get_template_directory_uri() . '/assets/css/external/owl.css', array(), _S_VERSION);
}

function load_js_scripts()
{
    wp_enqueue_script("vimeo-script", "https://player.vimeo.com/api/player.js", array('jquery'), _S_VERSION, false);
    wp_enqueue_script("gsap-script", get_template_directory_uri() . '/assets/js/external/gsap.min.js', array('jquery'), _S_VERSION, false);
    wp_enqueue_script("scroll-trigger-script", get_template_directory_uri() . '/assets/js/external/ScrollTrigger.min.js', array('jquery'), _S_VERSION, false);

    // wp_enqueue_script("scroll-to-script", get_template_directory_uri() . '/assets/js/external/ScrollToPlugin.min.js', array(), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    // wp_register_script("split-text-script", get_template_directory_uri() . '/assets/js/external/SplitText.min.js', array(), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    // wp_register_script('swiper-script', get_template_directory_uri() . '/assets/js/external/swiper-bundle.min.js', array(), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    // wp_register_script("jquery-ui-script", get_template_directory_uri() . '/assets/js/external/jquery-ui.js', array(), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_register_script('owl-script', get_template_directory_uri() . '/assets/js/external/owl.min.js', array('jquery'), _S_VERSION, array('strategy' => 'defer', 'in_footer' => true));

    // $js_dirs = __DIR__ . '/assets/js/custom/';
    // foreach (scandir($js_dirs) as $k => $js) {
    //     if ($js === '.' || $js === '..') {
    //         continue;
    //     }
    //     $file = get_template_directory_uri() . '/assets/js/custom/' . $js;
        
    //     wp_enqueue_script("custom-js-" . $k, $file, ['jquery'], rand(), array('strategy'  => 'defer', 'in_footer' => true));
    //     // wp_localize_script("custom-js-" . $k, 'frontendajax', array('ajaxurl' => admin_url('admin-ajax.php'), 'nonce' => wp_create_nonce('acf_block_nonce')));
    // }

    wp_enqueue_script("custom-min-js", get_template_directory_uri() . '/assets/js/custom.min.js', ['jquery'], rand(), array('strategy'  => 'defer', 'in_footer' => true));
    wp_localize_script("custom-min-js", 'frontendajax', array('ajaxurl' => admin_url('admin-ajax.php'), 'nonce' => wp_create_nonce('acf_block_nonce')));
}

function enqueue_admin_scripts_and_styles()
{
    wp_enqueue_script('block-preview-script', get_template_directory_uri() . '/assets/js/admin/block-preview.js', array(), _S_VERSION, true);
    wp_localize_script("block-preview-script", 'theme_path', array('url' => get_template_directory_uri()));

    wp_enqueue_style('custom-admin-style', get_template_directory_uri() . '/assets/css/admin/styles.css', array(), uniqid());
    wp_enqueue_style('acfe-style', get_template_directory_uri() . '/assets/css/external/acfe.css', array(), _S_VERSION);
}
















/******************** ACF ************************/
add_action('acf/init', 'my_acf_op_init');

function my_acf_op_init()
{
    if (function_exists('acf_add_options_page')) {
        acf_add_options_page(array(
            'menu_title'    => 'Global Config',
            'menu_slug'     => 'theme-general-settings',
            'capability'    => 'manage_options',
            'redirect'      => true,
            'icon_url'      => menu_icon(),
        ));

        acf_add_options_sub_page(array(
            'page_title'    => 'Theme Settings',
            'menu_title'    => 'Theme Settings',
            'parent_slug'   => 'theme-general-settings',
            'capability'    => 'manage_options',
        ));

        acf_add_options_sub_page(array(
            'page_title'    => 'Header Navigation',
            'menu_title'    => 'Header Navigation',
            'parent_slug'   => 'theme-general-settings',
            'capability'    => 'manage_options',
        ));

        acf_add_options_sub_page(array(
            'page_title'    => 'Footer Navigation',
            'menu_title'    => 'Footer Navigation',
            'parent_slug'   => 'theme-general-settings',
            'capability'    => 'manage_options',
        ));

        acf_add_options_sub_page(array(
            'page_title'    => '404',
            'menu_title'    => '404',
            'parent_slug'   => 'theme-general-settings',
            'capability'    => 'manage_options',
        ));
    }
}

add_action('init', 'register_custom_blocks');

function register_custom_blocks()
{
    if (!function_exists('acf_register_block_type')) {
        return;
    }

    $theme_slug = get_field("theme_slug", "option");
    $theme_slug = $theme_slug ? $theme_slug : "cbtheme";

    $blocks_dir = __DIR__ . '/blocks';

    if (!is_dir($blocks_dir) || !is_readable($blocks_dir)) {
        return;
    }

    foreach (scandir($blocks_dir) as $dir) {
        $block_path = $blocks_dir . '/' . $dir;

        if ($dir === '.' || $dir === '..' || !is_dir($block_path)) {
            continue;
        }

        $block_json = $block_path . '/block.json';
        if (!file_exists($block_json)) {
            continue;
        }

        register_block_type($block_path, [
            'category' => $theme_slug,
            'icon'     => block_icon(true),
            'supports' => [
                'anchor' => true,
            ],
        ]);
    }
}

add_filter('block_categories_all', 'custom_block_category', 10, 2);

function custom_block_category($categories, $post)
{
    $theme_slug = get_field("theme_slug", "option");
    $theme_slug = $theme_slug ? $theme_slug : "cbtheme";

    $custom_category = array(
        array(
            'slug' => $theme_slug,
            'title' => __(ucfirst(strtolower($theme_slug)) . ' Blocks', 'cbtheme')
        ),
    );

    return array_merge($custom_category, $categories);
}

add_filter('block_categories_all', 'custom_block_category', 10, 2);





















/******************** THEME RELATED VISUAL OVERRIDES ************************/

// Reposition the acf fields to the top of editor
add_action('admin_footer', function () {
?>
    <script type="text/javascript">
        jQuery(document).ready(function($) {
            setTimeout(() => {
                if ($('.block-editor').length) {
                    const mb = $('.edit-post-layout__metaboxes');
                    const pse = $('.edit-post-visual-editor');

                    if (mb.length && pse.length) {
                        mb.insertBefore(pse);
                        $('.postbox').addClass('closed');
                    }

                    mb.find(".acf-postbox .postbox-header h2").prepend(`<img src='<?= block_icon() ?>'/>`);
                }
            }, 400);
        });
    </script>
<?php
});

// Customize custom post type icon
add_action('registered_post_type', function ($post_type, $args) {
    if (!in_array($post_type, array(
        'resource',
    ))) return;

    // Set menu icon
    $args->menu_icon = menu_icon();

    global $wp_post_types;
    $wp_post_types[$post_type] = $args;
}, 10, 2);

// Customize wp-admin login logo
add_action('login_enqueue_scripts', function () {
    $login_logo = get_field("login_logo", "option");
    if (!$login_logo) return;
?>
    <style type="text/css">
        body.login #login h1 a {
            display: none;
        }

        body.login #login {
            padding-top: 0;
        }

        body.login #login .notice {
            margin-top: 16px;
        }
    </style>

    <div class="client-branding" style="text-align: center; padding-top: 5%;">
        <img style="width: 100%; max-width: 320px; height: auto;" src="<?= $login_logo ?>" alt="Custom Logo">
    </div>
<?php
});

// Allow templates selected in the Template Dropdown
add_filter('template_include', function ($template) {
    if (is_page_template()) {
        return $template;
    }

    // Dynamically load templates based on slug
    if (is_page()) {
        $slug = get_post_field('post_name', get_post());
        $custom_template = get_stylesheet_directory() . '/templates/page-' . $slug . '.php';

        if (file_exists($custom_template)) {
            return $custom_template;
        }
    }

    // Fallback to the default template
    return $template;
});

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_script(
        'single-event-js',
        get_template_directory_uri() . '/assets/js/custom/04-single-event.js',
        ['jquery'],
        _S_VERSION,
        ['strategy' => 'defer', 'in_footer' => true]
    );
    wp_localize_script('single-event-js', 'bfRsvp', [
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce'   => wp_create_nonce('bf_rsvp_submit'),
    ]);
});

add_action('wp_ajax_bf_rsvp_submit',        'bf_handle_rsvp');
add_action('wp_ajax_nopriv_bf_rsvp_submit', 'bf_handle_rsvp');

function bf_handle_rsvp() {
    if (!check_ajax_referer('bf_rsvp_submit', 'nonce', false)) {
        wp_send_json_error(['message' => 'Invalid request.']);
    }

    $ticket_id  = intval($_POST['ticket_id']  ?? 0);
    $event_id   = intval($_POST['event_id']   ?? 0);
    $first_name = sanitize_text_field($_POST['first_name'] ?? '');
    $last_name  = sanitize_text_field($_POST['last_name']  ?? '');
    $email      = sanitize_email($_POST['email'] ?? '');

    if (!$ticket_id || !$event_id || !$first_name || !$last_name || !is_email($email)) {
        wp_send_json_error(['message' => 'Please fill in all required fields.']);
    }

    $full_name = $first_name . ' ' . $last_name;
    $order_key = 'rsvp-' . wp_generate_password(12, false);

    $attendee_id = wp_insert_post([
        'post_title'  => $full_name,
        'post_type'   => 'tribe_rsvp_attendees',
        'post_status' => 'publish',
        'post_author' => 0,
        'post_parent' => $ticket_id,
    ]);

    if (is_wp_error($attendee_id)) {
        wp_send_json_error(['message' => 'Could not save RSVP. Please try again.']);
    }

    update_post_meta($attendee_id, '_tribe_rsvp_status',  'yes');
    update_post_meta($attendee_id, '_tribe_rsvp_order',   $order_key);
    update_post_meta($attendee_id, '_tribe_rsvp_full_name', $full_name);
    update_post_meta($attendee_id, '_tribe_rsvp_email',   $email);
    update_post_meta($attendee_id, '_tribe_rsvp_product', $ticket_id);
    update_post_meta($attendee_id, '_tribe_rsvp_event',   $event_id);

    wp_send_json_success(['message' => 'RSVP confirmed!']);
}

// Use single-event.php for tribe_events — PHP_INT_MAX ensures this runs after TEC v2's own loader
add_filter('template_include', function ($template) {
    if (!is_singular('tribe_events')) {
        return $template;
    }
    // Let TEC Tickets handle its own checkout/form pages
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (preg_match('#/form/?(\?|$)#', $uri)) {
        return $template;
    }
    static $path = null;
    if ($path === null) {
        $candidate = get_stylesheet_directory() . '/single-event.php';
        $path = file_exists($candidate) ? $candidate : false;
    }
    return $path ?: $template;
}, PHP_INT_MAX);

// Change default list preview count to 200 from 20
function apply_filter_to_all_post_types()
{
    $post_count = 200;
    $post_types = get_post_types(array('public' => true), 'names');

    foreach ($post_types as $post_type) {
        add_filter("edit_{$post_type}_per_page", function ($per_page) use ($post_count) {
            return $post_count;
        });
    }

    add_filter('edit_acf-field-group_per_page', function ($per_page) use ($post_count) {
        return $post_count;
    });
}
add_action('init', 'apply_filter_to_all_post_types');

// Support more file types
add_filter('upload_mimes', function ($mime_types) {
    $mime_types['jpg'] = 'image/jpeg';
    $mime_types['jpeg'] = 'image/jpeg';
    $mime_types['png'] = 'image/png';
    $mime_types['pdf'] = 'application/pdf';
    $mime_types['ico'] = 'image/x-icon';
    $mime_types['svg'] = 'image/svg+xml';
    $mime_types['svgz'] = 'image/svg+xml';
    $mime_types['*'] = 'application/octet-stream';
    return $mime_types;
});

// Disable hotlinking
function prevent_hotlinking() {
    if (isset($_SERVER['HTTP_REFERER']) && strpos($_SERVER['HTTP_REFERER'], home_url()) === false) {
        header("Content-Type: image/jpeg");
        readfile(get_template_directory() . '/assets/img/png/no-hotlinking.png');
        exit;
    }
}
// add_action('template_redirect', 'prevent_hotlinking');

function external_post_redirect_to_home()
{
    if (is_singular(['press-release', 'insight', 'news'])) {
        $is_external = get_field('is_external_url');

        if ($is_external) {
            $url_to_redirect = home_url();
            $external_url_link = get_field("external_url");

            if ($external_url_link && isset($external_url_link['url'])) {
                $url_to_redirect = $external_url_link['url'] ? $external_url_link['url'] : home_url();
            }

            wp_redirect($url_to_redirect);
            exit;
        }
    }
}

// add_action('wp', 'external_post_redirect_to_home');
