# cbtheme — Custom WordPress Theme

**Author:** Steven Felizardo
**Stack:** WordPress · Timber (Twig) · ACF Pro · Tailwind CSS · GSAP

---

## Table of Contents

1. [Requirements](#requirements)
2. [Initial Setup](#initial-setup)
3. [Development Workflow](#development-workflow)
4. [Theme Structure](#theme-structure)
5. [Templating with Timber & Twig](#templating-with-timber--twig)
6. [Creating Blocks](#creating-blocks)
7. [ACF Option Pages](#acf-option-pages)
8. [Tailwind CSS](#tailwind-css)
9. [JavaScript & Animation](#javascript--animation)
10. [Fonts](#fonts)
11. [Theme Settings (bf.json)](#theme-settings-bfjson)
12. [Events & RSVP](#events--rsvp)
13. [Deployment](#deployment)
14. [Environment Variables](#environment-variables)

---

## Requirements

- PHP 7.4+
- WordPress 5.0+
- Composer
- Node.js v20+
- ACF Pro (Advanced Custom Fields)
- Timber (installed via Composer)

---

## Initial Setup

### 1. Install PHP dependencies

```bash
cd wp-content/private
composer install
cp .env.example .env
```

Edit `.env` and set the environment:

```
ENV=development
```

Accepted values: `development`, `staging`, `production`

### 2. Install Node dependencies

```bash
cd wp-content/themes/baunfire
npm install
```

### 3. Activate the theme

In WordPress Admin go to **Appearance > Themes** and activate **Custom Wordpress Theme**.

---

## Development Workflow

### Watch mode (Tailwind CSS)

Watches `assets/css/theme/tailwind.css` and recompiles `assets/css/theme/styles.css` on every change.

```bash
npm run tw
```

### Production build

Minifies and outputs the final CSS bundle.

```bash
npm run build
```

---

## Theme Structure

```
themes/baunfire/
├── acf-json/               # ACF field group JSON exports (auto-sync)
├── assets/
│   ├── css/
│   │   ├── admin/          # WordPress admin styles
│   │   ├── external/       # Third-party CSS (Swiper, Owl, Lenis, etc.)
│   │   └── theme/          # Main theme styles (Tailwind entry + output)
│   ├── fonts/              # Self-hosted web fonts
│   ├── img/                # Theme images and SVGs
│   ├── js/
│   │   ├── admin/          # Admin-only JS
│   │   ├── custom/         # Theme JS (01-app, 02-global, 03-animation, etc.)
│   │   └── external/       # Third-party JS (GSAP, Swiper, jQuery, etc.)
│   └── json/               # variables.json for JS consumption
├── blocks/                 # ACF custom blocks (one folder per block)
├── blocks-collection/      # Shared block utilities
├── components/             # Reusable Twig components
├── create-block-boilerplate/ # Scaffolding templates for new blocks
├── extensions/             # Third-party extensions
├── includes/               # PHP helpers and feature modules
├── partials/               # Twig page-level partials
├── snippets/               # Twig snippets (small reusable fragments)
├── templates/              # Page templates
├── twig_cache/             # Auto-generated Twig cache (do not edit)
├── bf.json                 # Design tokens (colors, spacing, border-radius)
├── functions.php           # Main theme entry point
├── tailwind.config.js      # Tailwind configuration
├── package.json            # NPM scripts and dependencies
└── style.css               # WordPress theme header
```

### Key files in `includes/`

| File | Purpose |
|------|---------|
| `timber.php` | Timber/Twig setup, cache config, global context |
| `hooks_filters.php` | ACF WYSIWYG toolbars, TinyMCE format options |
| `theme-settings.php` | Injects CSS custom properties from ACF options |
| `global_functions.php` | Asset helpers: `jpg()`, `svg()`, `png()`, `webp()`, `json_file()`, `favicon()`, `block_icon()` |
| `acf.php` | ACF Pro bundling and field customization |
| `svg.php` | Enables SVG uploads in the media library |
| `hide-comments.php` | Disables WordPress comments site-wide |
| `shortcodes.php` | Registers `[year]` shortcode |
| `support-header-security.php` | Adds security HTTP headers |
| `dd.php` | `dd()` debug dump helper |

---

## Templating with Timber & Twig

This theme uses [Timber](https://timber.github.io/docs/) to separate PHP logic from Twig templates.

### How it works

PHP template files (e.g. `page.php`) collect data and pass it to a Twig partial:

```php
// page.php
get_header();
// Timber::render() picks up partials/page.twig automatically
```

For more complex pages, build a context array:

```php
$context = Timber::context([
    'hero' => get_field('hero'),
    'posts' => Timber::get_posts(),
]);
Timber::render('./partials/page.twig', $context);
```

### Twig template locations

| Directory | Use for |
|-----------|---------|
| `partials/` | Full page sections (header, footer, 404, single-event) |
| `components/` | Reusable UI components (heading, image, cta, eyebrow) |
| `snippets/` | Small inline fragments (cta-icon, etc.) |

### Including components in Twig

```twig
{% include 'heading.twig' with { heading: post.title, tag: 'h1' } %}
{% include 'image.twig' with { image: featured_image } %}
{% include 'cta.twig' with { label: 'Learn More', url: link } %}
```

### Global context

The following variables are available in every Twig template (added in `includes/timber.php`):

| Variable | Value |
|----------|-------|
| `cache_key` | Cache-busting string |
| `current_url` | Current request path |

---

## Creating Blocks

This theme uses ACF blocks. A CLI tool scaffolds new blocks automatically.

### Run the block generator

```bash
npm run cb
# or
npm run create-block
```

You will be prompted for:
- **Block folder name** — lowercase, dashes only (e.g. `text-image`)
- **Block title** — human-readable label shown in the editor (e.g. `Text Image`)

The tool creates `blocks/[block-name]/` with:

| File | Purpose |
|------|---------|
| `block.json` | Block registration config (name, title, category) |
| `controller.php` | PHP logic — build the Twig context here |
| `template.twig` | Twig markup for the block |
| `block.css` | Block-scoped CSS |
| `script.js` | Block-scoped JavaScript |
| `script.asset.php` | Asset dependency manifest |
| `preview.png` | Preview image shown in the block picker |

### Block controller pattern

```php
// blocks/my-block/controller.php
$context = Timber::context([
    'heading' => get_field('heading'),
    'body'    => get_field('body'),
    'image'   => get_field('image'),
]);
Timber::render('./blocks/my-block/template.twig', $context);
```

### Block category

All blocks are grouped under a custom category. The category slug defaults to `cbtheme` and can be overridden via the **Theme Settings** ACF option page (field: `theme_slug`).

---

## ACF Option Pages

The theme registers the following ACF option pages under **cbtheme** in the admin menu:

| Page | Slug | Purpose |
|------|------|---------|
| Global Config | `theme-general-settings` | Parent page |
| Theme Settings | — | Theme slug, section padding, theme color |
| Header Navigation | — | Nav items |
| Footer Navigation | — | Footer nav, logos, socials, legal copy |
| 404 Page Configuration | — | Heading and CTA for error pages |

### Using option fields in PHP

```php
get_field('field_name', 'option');
```

### Using option fields in Twig (via controller)

Pass the value through the controller:

```php
$context = Timber::context([
    'theme_color' => get_field('theme_color', 'option'),
]);
```

---

## Tailwind CSS

### Entry point

`assets/css/theme/tailwind.css` — imports PostCSS partials and the Tailwind directives.

### Output

`assets/css/theme/styles.css` — compiled and minified; enqueued by WordPress.

### Custom screens (breakpoints)

| Token | Size |
|-------|------|
| `sm` | 576px |
| `md` | 768px |
| `lg` | 992px |
| `xl` | 1200px |
| `2xl` | 1400px |
| `3xl` | 1600px |

### Custom utilities

| Class | Effect |
|-------|--------|
| `translate-z` | Hardware-accelerated layer promotion |
| `center-x` | Horizontal centering via transform |
| `center-y` | Vertical centering via transform |
| `center-xy` | Both axes |
| `text-inherit-all` | Inherits color, font-size, and line-height |

### Custom variants

```html
<!-- Targets direct children -->
<ul class="child:text-white">…</ul>

<!-- Targets children on hover of parent -->
<ul class="child-hover:underline">…</ul>
```

### Design tokens (bf.json)

Colors and border-radius values live in `bf.json` and are imported by `tailwind.config.js`. Edit this file to update the design system — no Tailwind config changes needed.

```json
{
  "colors": {
    "primary": "#000000",
    "secondary": "#ffffff"
  },
  "corners": {
    "sm": "4px",
    "md": "8px"
  }
}
```

---

## JavaScript & Animation

### Custom JS files (loaded in order)

| File | Purpose |
|------|---------|
| `01-app.js` | App initialization |
| `02-global.js` | Global event listeners and utilities |
| `03-animation.js` | GSAP animation setup |
| `04-single-event.js` | Event RSVP modal logic |

All custom files are bundled into `custom.min.js` which is the only file enqueued by WordPress.

### GSAP

The following GSAP plugins are loaded:

- `gsap.min.js` — core
- `ScrollTrigger.min.js` — scroll-driven animations
- `ScrollToPlugin.min.js` — smooth scroll-to
- `SplitText.min.js` — text splitting (Club GreenSock)
- `ScrollSmoother.min.js` — smooth scrolling wrapper (Club GreenSock)
- `CustomEase.min.js` — custom easing

### Global JS variables

Available on `window` in all front-end scripts:

```js
templateURL   // WordPress template directory URI
frontendajax  // { ajaxurl, nonce } — use for AJAX requests
```

### Making an AJAX request

```js
$.post(frontendajax.ajaxurl, {
    action: 'my_action',
    nonce:  frontendajax.nonce,
    data:   'value',
})
.done(res => { if (res.success) { /* … */ } });
```

Register the handler in PHP:

```php
add_action('wp_ajax_my_action',        'my_action_handler');
add_action('wp_ajax_nopriv_my_action', 'my_action_handler');

function my_action_handler() {
    check_ajax_referer('frontend_nonce', 'nonce');
    wp_send_json_success(['message' => 'ok']);
}
```

---

## Fonts

Self-hosted fonts live in `assets/fonts/`. Loaded families:

| Family | Tailwind token |
|--------|---------------|
| KH Teka | `font-kh` |
| Hanken Grotesk | `font-hanken` |
| Instrument Sans | `font-instrument` / `font-instrument-condensed` / `font-instrument-semicondensed` |
| Big Shoulders | `font-big-shoulders` |
| Fraunces | `font-fraunces` / `font-fraunces-soft` / `font-fraunces-supersoft` |
| Radley | `font-radley` |
| Barlow | `font-barlow` |
| Helvetica | (fallback stack) |

Add new families in `tailwind.config.js` under `theme.extend.fontFamily` and register the `@font-face` rules in `assets/css/theme/typography.css`.

---

## Theme Settings (bf.json)

`bf.json` stores project-level design tokens consumed by Tailwind. It is the single source of truth for colors and border-radius values. After editing it, run a build to regenerate the CSS:

```bash
npm run build
```

---

## Events & RSVP

The theme integrates with **The Events Calendar** plugin (`tribe_events` CPT).

### Single event template

`single-event.php` builds the Twig context (title, dates, venue, cost, tickets) and renders `partials/single-event.twig`.

### RSVP modal

The RSVP flow is a three-step `<dialog>` modal (`partials/single-event.twig`):

1. **Step 1** — Attendee selects a ticket
2. **Step 2** — Attendee fills in name and email
3. **Step 3** — Confirmation with Add-to-Calendar links (Google Calendar, iCal)

The form submits via AJAX to the `bf_rsvp_submit` action, which creates a `tribe_rsvp_attendees` post in WordPress.

**Opening the modal from custom markup:**

```html
<button class="js-date-picker-open">RSVP</button>
```

---

## Deployment

Deployments run via **GitHub Actions** to **WP Engine**.

### Staging

Triggered automatically on every push to `main`:

```
.github/workflows/deploy-staging.yml
```

### Production

Triggered manually via **Actions > deploy-production > Run workflow**. Requires typing `deploy` to confirm.

### What the deploy action does

1. Installs Node 20 and PHP 8.2
2. Runs `composer install` in `wp-content/private/`
3. Creates `.env` with `THEME_ENVIRONMENT`
4. Runs `npm install` and `npm run build` inside the theme folder
5. Removes `node_modules` before upload
6. Deploys to WP Engine via the official WPE GitHub Action
7. Runs PHP linting and clears the WP Engine cache

### Excluding files from deployment

Add paths to `.deployignore` in the repo root to prevent them from being uploaded.

---

## Environment Variables

`.env` lives in `wp-content/private/` (never committed to git).

| Variable | Values | Effect |
|----------|--------|--------|
| `ENV` | `development` | Disables Twig cache, sets version to random string for cache-busting |
| `ENV` | `staging` / `production` | Enables Twig cache, sets version to `1.0.0` |

Copy the example file to get started:

```bash
cp wp-content/private/.env.example wp-content/private/.env
```
