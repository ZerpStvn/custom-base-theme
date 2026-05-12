<?php

/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package cbtheme
 */

get_header();
?>

<main>
    <?php the_content(); ?>
</main>

<?php get_footer(); ?>