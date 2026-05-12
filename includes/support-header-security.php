<?php
/**
 * Modular Security Headers Module
 * Strict CSP + nonce + inline script hashes
 * + Alpine CSP-friendly support via GLOBAL x-data="fn(args)" rewrite
 */

if ( ! defined('ABSPATH') ) exit;

// ====================
// CONFIG
// ====================
$ALLOW_UNSAFE_EVAL = false; // keep false to pass strict CSP (no unsafe-eval)

// --------------------
// 1) ACF Options Page (register under your Global Config parent)
// --------------------
add_action('acf/init', function () {
  if ( ! function_exists('acf_add_options_sub_page') ) return;

  acf_add_options_sub_page(array(
    'page_title'  => 'Security Headers',
    'menu_title'  => 'Security Headers',
    'menu_slug'   => 'security-headers',
    'parent_slug' => 'theme-general-settings',
    'capability'  => 'manage_options',
  ));
}, 99);

/**
 * Helper: get the security_headers group array safely
 */
function sh_get_security_headers_group(): array {
  if ( ! function_exists('get_field') ) return array();
  $group = get_field('security_headers', 'option');
  return is_array($group) ? $group : array();
}

/**
 * Helper: update a key inside the security_headers group array
 */
function sh_update_security_headers_group(array $group): void {
  if ( ! function_exists('update_field') ) return;
  update_field('security_headers', $group, 'option');
}

/**
 * Helper: convert ["a","b"] => [ ["value"=>"a"], ["value"=>"b"] ]
 */
function sh_to_repeater_rows(array $values): array {
  $rows = [];
  foreach ($values as $v) {
    $v = trim((string) $v);
    if ($v === '') continue;
    $rows[] = ['value' => $v];
  }
  return $rows;
}

/**
 * 1B) Seed CSP allowlist repeaters with safe defaults (run once)
 * Runs AFTER saving the ACF options page so values persist.
 * IMPORTANT: fields live inside group: security_headers
 */
add_action('acf/save_post', function ($post_id) {
  if ($post_id !== 'options') return;
  if ( ! function_exists('get_field') || ! function_exists('update_field') ) return;
  if ( ! current_user_can('manage_options') ) return;

  $group = sh_get_security_headers_group();

  // Only seed when admin allowlist is enabled
  $use_admin = !empty($group['csp_use_admin_allowlist']);
  if ( ! $use_admin ) return;

  $defaults = [
    'csp_script_src_list' => [
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://*.hubspot.com',
      'https://player.vimeo.com',
      'https://www.youtube.com',
      'https://maps.googleapis.com',
      'https://maps.gstatic.com',
      'https://px.ads.linkedin.com',
      'https://connect.facebook.net',
      'https://cdn.jsdelivr.net',
    ],
    'csp_style_src_list' => [
      'https://fonts.googleapis.com',
    ],
    'csp_img_src_list' => [
      'data:',
      'https:',
    ],
    'csp_font_src_list' => [
      'data:',
      'https://fonts.gstatic.com',
    ],
    'csp_connect_src_list' => [
      'https:',
    ],
    'csp_frame_src_list' => [
      'https://player.vimeo.com',
      'https://www.youtube.com',
    ],
    'csp_worker_src_list' => [
      'blob:',
      'https:',
    ],
  ];

  $changed = false;

  // Seed each repeater only if empty
  foreach ($defaults as $key => $values) {
    $current = $group[$key] ?? null;
    $is_empty = empty($current) || (is_array($current) && count($current) === 0);

    if ($is_empty) {
      $group[$key] = sh_to_repeater_rows($values);
      $changed = true;
    }
  }

  // Seed toggle defaults if unset (only if key not present at all)
  if (!array_key_exists('csp_upgrade_insecure_requests', $group)) {
    $group['csp_upgrade_insecure_requests'] = 1;
    $changed = true;
  }
  if (!array_key_exists('csp_allow_unsafe_inline_style', $group)) {
    $group['csp_allow_unsafe_inline_style'] = 1;
    $changed = true;
  }
  if (!array_key_exists('csp_allow_unsafe_eval', $group)) {
    $group['csp_allow_unsafe_eval'] = 0;
    $changed = true;
  }

  if ($changed) {
    sh_update_security_headers_group($group);
  }

}, 20);

// --------------------
// 2) Nonce: generate early for front-end requests
// --------------------
add_action('init', function () {
  if ( is_admin() ) return;
  global $csp_nonce;

  if ( ! empty($csp_nonce) ) return;

  try {
    $csp_nonce = base64_encode(random_bytes(16));
  } catch (Exception $e) {
    $csp_nonce = base64_encode(wp_generate_password(16, true, true));
  }
}, 1);

// --------------------
// 3) Add nonce + optional defer to enqueued scripts (with src=)
// --------------------
add_filter('script_loader_tag', function ($tag, $handle, $src) {
  global $csp_nonce;

  // Add nonce to any <script src> that doesn't have it yet
  if ( ! empty($csp_nonce) && strpos($tag, ' src=') !== false && strpos($tag, ' nonce=') === false ) {
    $tag = str_replace('<script', '<script nonce="' . esc_attr($csp_nonce) . '"', $tag);
  }

  // Force defer on specific handles (keeps HEAD clean + prevents early Alpine run)
  $defer_handles = [
    'alpine-bridge', // MUST be before alpine-csp
    'alpine-csp',
    'theme-main',
    'sh-wpsl-csp',
  ];

  if ( in_array($handle, $defer_handles, true) ) {
    if ( strpos($tag, ' defer') === false ) {
      $tag = str_replace('<script ', '<script defer ', $tag);
    }
  }

  return $tag;
}, 10, 3);

// --------------------
// 4) Send non-CSP security headers early (CSP is sent later after hashes exist)
// --------------------
add_action('send_headers', function () {
  $default_headers = array(
    'Strict-Transport-Security' => 'max-age=31536000; includeSubDomains; preload',
    'X-Frame-Options'           => 'SAMEORIGIN',
    'X-Content-Type-Options'    => 'nosniff',
    'Referrer-Policy'           => 'strict-origin-when-cross-origin',
    'Permissions-Policy'        => 'geolocation=(), microphone=(), camera=(), interest-cohort=()',
  );

  $acf = sh_get_security_headers_group();

  $headers = array(
    'Strict-Transport-Security' => !empty($acf['strict-transport-security']) ? trim($acf['strict-transport-security']) : $default_headers['Strict-Transport-Security'],
    'X-Frame-Options'           => !empty($acf['x-frame-options']) ? trim($acf['x-frame-options']) : $default_headers['X-Frame-Options'],
    'X-Content-Type-Options'    => !empty($acf['x-content-type-options']) ? trim($acf['x-content-type-options']) : $default_headers['X-Content-Type-Options'],
    'Referrer-Policy'           => !empty($acf['referrer-policy']) ? trim($acf['referrer-policy']) : $default_headers['Referrer-Policy'],
    'Permissions-Policy'        => !empty($acf['permissions-policy']) ? trim($acf['permissions-policy']) : $default_headers['Permissions-Policy'],
  );

  foreach ($headers as $key => $value) {
    if ($value === '' || $value === null) continue;
    header($key . ': ' . $value);
  }
}, 1);

// --------------------
// Helper: read repeater rows from group key, expects subfield 'value'
// --------------------
function sh_csp_read_group_repeater_values(array $group, string $key): array {
  $rows = $group[$key] ?? null;
  if ( ! is_array($rows) ) return array();

  $out = array();
  foreach ($rows as $row) {
    if (empty($row) || !is_array($row)) continue;
    if (empty($row['value'])) continue;

    $v = trim((string) $row['value']);
    if ($v === '') continue;

    // normalize whitespace
    $v = preg_replace('/\s+/', '', $v);

    $out[] = $v;
  }

  return array_values(array_unique($out));
}

// --------------------
// 5) Capture output, rewrite Alpine patterns, compute inline script hashes, THEN send CSP header
// --------------------
add_action('template_redirect', function () use ($ALLOW_UNSAFE_EVAL) {
  if ( is_admin() ) return;

  ob_start(function ($content) use ($ALLOW_UNSAFE_EVAL) {
    global $csp_nonce;

    // ==========================================================
    // GLOBAL ALPINE CSP SUPPORT (NO TEMPLATE/BLOCK EDITS)
    // Convert: x-data="fn(args)" -> x-data="__csp" data-csp-fn="fn" data-csp-args="args"
    // Targets ONLY function-call style x-data, not objects.
    // ==========================================================
    $content = preg_replace_callback(
      '/\bx-data\s*=\s*"([A-Za-z_$][A-Za-z0-9_$]*)\(\s*([^"]*?)\s*\)"/m',
      function ($m) {
        $fn   = $m[1];
        $args = trim($m[2]);
        return 'x-data="__csp" data-csp-fn="' . esc_attr($fn) . '" data-csp-args="' . esc_attr($args) . '"';
      },
      $content
    );

    // Collect hashes for inline <script> blocks that do NOT have src=
    $inline_script_hashes = array();
    if ( preg_match_all('/<script\b(?![^>]*\bsrc=)[^>]*>(.*?)<\/script>/is', $content, $matches) ) {
      foreach ($matches[1] as $script_content) {
        // IMPORTANT: hash exact contents, no trimming
        $hash = base64_encode(hash('sha256', $script_content, true));
        $inline_script_hashes[] = "'sha256-$hash'";
      }
    }

    // ==========================================================
    // CSP BUILD (group fields)
    // ==========================================================
    $group = sh_get_security_headers_group();

    $use_admin = !empty($group['csp_use_admin_allowlist']);

    // Defaults if admin mode OFF
    $upgrade_insecure = true;
    $allow_unsafe_inline_style = true;
    $allow_unsafe_eval = (bool) $ALLOW_UNSAFE_EVAL;

    // If admin mode ON, read toggles from group
    if ($use_admin) {
      $upgrade_insecure = !empty($group['csp_upgrade_insecure_requests']);
      $allow_unsafe_inline_style = !empty($group['csp_allow_unsafe_inline_style']);
      $allow_unsafe_eval = !empty($group['csp_allow_unsafe_eval']);
    }

    // Baselines (keeps site stable even if admin forgets schemes)
    $script_sources  = array("'self'", "https:");
    $style_sources   = array("'self'", "https:");
    $img_sources     = array("'self'", "data:", "https:");
    $font_sources    = array("'self'", "data:", "https:");
    $connect_sources = array("'self'", "https:");
    $frame_sources   = array("'self'", "https:");
    $worker_sources  = array("'self'", "blob:", "https:");

    if ($allow_unsafe_inline_style) {
      $style_sources[] = "'unsafe-inline'";
    }
    if ($allow_unsafe_eval) {
      $script_sources[] = "'unsafe-eval'";
    }

    if ($use_admin) {
      // Admin add/remove allowlist values from repeaters inside group
      $script_sources  = array_merge($script_sources,  sh_csp_read_group_repeater_values($group, 'csp_script_src_list'));
      $style_sources   = array_merge($style_sources,   sh_csp_read_group_repeater_values($group, 'csp_style_src_list'));
      $img_sources     = array_merge($img_sources,     sh_csp_read_group_repeater_values($group, 'csp_img_src_list'));
      $font_sources    = array_merge($font_sources,    sh_csp_read_group_repeater_values($group, 'csp_font_src_list'));
      $connect_sources = array_merge($connect_sources, sh_csp_read_group_repeater_values($group, 'csp_connect_src_list'));
      $frame_sources   = array_merge($frame_sources,   sh_csp_read_group_repeater_values($group, 'csp_frame_src_list'));
      $worker_sources  = array_merge($worker_sources,  sh_csp_read_group_repeater_values($group, 'csp_worker_src_list'));
    } else {
      // Fallback to your original hardcoded defaults (stable baseline)
      $script_sources = array_merge($script_sources, array(
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
        "https://*.hubspot.com",
        "https://player.vimeo.com",
        "https://www.youtube.com",
        "https://maps.googleapis.com",
        "https://maps.gstatic.com",
        "https://px.ads.linkedin.com",
        "https://connect.facebook.net",
        "https://cdn.jsdelivr.net",
      ));

      $style_sources = array_merge($style_sources, array(
        "https://fonts.googleapis.com",
      ));

      $font_sources = array_merge($font_sources, array(
        "https://fonts.gstatic.com",
      ));

      $frame_sources = array_merge($frame_sources, array(
        "https://player.vimeo.com",
        "https://www.youtube.com",
      ));
    }

    // Always append nonce + inline hashes to script-src
    if (!empty($csp_nonce)) {
      $script_sources[] = "'nonce-$csp_nonce'";
    }
    if (!empty($inline_script_hashes)) {
      $script_sources = array_merge($script_sources, $inline_script_hashes);
    }

    // Unique everything
    $script_sources  = array_values(array_unique($script_sources));
    $style_sources   = array_values(array_unique($style_sources));
    $img_sources     = array_values(array_unique($img_sources));
    $font_sources    = array_values(array_unique($font_sources));
    $connect_sources = array_values(array_unique($connect_sources));
    $frame_sources   = array_values(array_unique($frame_sources));
    $worker_sources  = array_values(array_unique($worker_sources));

    // Build CSP
    $csp_parts = array();

    if ($upgrade_insecure) {
      $csp_parts[] = "upgrade-insecure-requests;";
    }

    $csp_parts[] = "default-src 'self' https:;";
    $csp_parts[] = "script-src " . implode(' ', $script_sources) . ";";
    $csp_parts[] = "style-src " . implode(' ', $style_sources) . ";";
    $csp_parts[] = "img-src " . implode(' ', $img_sources) . ";";
    $csp_parts[] = "font-src " . implode(' ', $font_sources) . ";";
    $csp_parts[] = "connect-src " . implode(' ', $connect_sources) . ";";
    $csp_parts[] = "frame-src " . implode(' ', $frame_sources) . ";";
    $csp_parts[] = "worker-src " . implode(' ', $worker_sources) . ";";

    $csp_value = implode(' ', $csp_parts);

    // Send CSP header ONLY now (hashes are known)
    if ( ! headers_sent() ) {
      header('Content-Security-Policy: ' . $csp_value);
    }

    return $content;
  });
}, 0);

// --------------------
// 6) Flush output buffer safely
// --------------------
add_action('shutdown', function () {
  while ( ob_get_level() > 0 ) {
    @ob_end_flush();
  }
}, 0);

// --------------------
// 7) Enqueue Alpine CSP build + bridge + theme + (optional) WPSL CSP patch
// --------------------
add_action('wp_enqueue_scripts', function () {
  if ( is_admin() ) return;

  /**
   * (1) Bridge FIRST (no deps). Attaches alpine:init listener before Alpine loads.
   */
  $bridge_rel = '/assets/js/sh/sh-csp-bridge.js';
  $bridge_abs = get_template_directory() . $bridge_rel;
  $bridge_url = get_template_directory_uri() . $bridge_rel;

  wp_enqueue_script(
    'alpine-bridge',
    $bridge_url,
    [],
    file_exists($bridge_abs) ? filemtime($bridge_abs) : null,
    false // HEAD
  );

  /**
   * (2) Alpine CSP build (CDN) — avoids unsafe-eval
   * Depend on bridge so ordering is guaranteed.
   */
  wp_enqueue_script(
    'alpine-csp',
    'https://cdn.jsdelivr.net/npm/@alpinejs/csp@3.x.x/dist/cdn.min.js',
    ['alpine-bridge'],
    null,
    false // HEAD
  );

}, 20);

// WPSL CSP patch (must run BEFORE WPSL renders templates)
// ---------------------------------------------------------
// 8) WPSL CSP patch — load ONLY when ACF Store Locator block exists
// ---------------------------------------------------------

/**
 * Recursively detect a block inside nested blocks.
 */
function sh_has_block_recursive(array $blocks, string $needle): bool {
  foreach ($blocks as $b) {
    if (!empty($b['blockName']) && $b['blockName'] === $needle) return true;
    if (!empty($b['innerBlocks']) && sh_has_block_recursive($b['innerBlocks'], $needle)) return true;
  }
  return false;
}

/**
 * True when current singular content contains ACF block: acf/store-locator-block
 */
function sh_should_load_wpsl_patch(): bool {
  if (is_admin()) return false;
  if (!is_singular()) return false;

  global $post;
  if (!($post instanceof WP_Post)) return false;

  // Fast path (works for normal ACF blocks in post_content)
  if (function_exists('has_block') && has_block('acf/store-locator-block', $post)) {
    return true;
  }

  // Safer fallback (nested blocks / reusable / etc.)
  if (function_exists('parse_blocks') && !empty($post->post_content)) {
    $blocks = parse_blocks($post->post_content);
    if (is_array($blocks) && sh_has_block_recursive($blocks, 'acf/store-locator-block')) {
      return true;
    }
  }

  return false;
}

/**
 * Enqueue patch early (HEAD).
 */
add_action('wp_enqueue_scripts', function () {
  if (!sh_should_load_wpsl_patch()) return;

  $rel = '/assets/js/sh/sh-wpsl-csp.js';
  $abs = get_template_directory() . $rel;
  $url = get_template_directory_uri() . $rel;

  wp_enqueue_script(
    'sh-wpsl-csp',
    $url,
    ['underscore'], // ensures underscore is present
    file_exists($abs) ? filemtime($abs) : null,
    false // HEAD (important)
  );
}, 5);

/**
 * Force WPSL scripts to load AFTER our patch (guaranteed order).
 * Run very late so WPSL has had time to register/enqueue its scripts.
 */
add_action('wp_enqueue_scripts', function () {
  if (!sh_should_load_wpsl_patch()) return;

  global $wp_scripts;
  if (!($wp_scripts instanceof WP_Scripts)) return;

  // These are the common handles WPSL uses (varies by version/config)
  $targets = ['wpsl-gmap', 'wpsl', 'wpsl-core', 'wpsl-gmap-js'];

  foreach ($targets as $h) {
    if (!empty($wp_scripts->registered[$h])) {
      $deps = $wp_scripts->registered[$h]->deps ?? [];
      if (!in_array('sh-wpsl-csp', $deps, true)) {
        $wp_scripts->registered[$h]->deps[] = 'sh-wpsl-csp';
      }
    }
  }
}, 999);

// --------------------
// Default ACF values
// --------------------
add_filter('acf/load_value/name=strict-transport-security', function ($value) {
  return empty($value) ? 'max-age=31536000; includeSubDomains; preload' : $value;
}, 10);

add_filter('acf/load_value/name=x-frame-options', function ($value) {
  return empty($value) ? 'SAMEORIGIN' : $value;
}, 10);

add_filter('acf/load_value/name=x-content-type-options', function ($value) {
  return empty($value) ? 'nosniff' : $value;
}, 10);

add_filter('acf/load_value/name=referrer-policy', function ($value) {
  return empty($value) ? 'strict-origin-when-cross-origin' : $value;
}, 10);

add_filter('acf/load_value/name=permissions-policy', function ($value) {
  return empty($value) ? 'geolocation=(), microphone=(), camera=(), interest-cohort=()' : $value;
}, 10);