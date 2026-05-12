<?php

/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package cbtheme
 */
?>

<?php get_header();

use Timber\Timber;

$context = Timber::context([
    // "nt_heading" => get_field("404_heading", "option"),
    // "nt_cta" => get_field("404_cta", "option"),
]);
?>

<main>
    <?php Timber::render("./partials/404.twig", $context); ?>
</main>

<?php get_footer(); ?>