<?php

/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package cbtheme
 */

use Timber\Timber;

$context = Timber::context([
    "footer_template"              => get_field("footer_template")              ?: get_field("footer_template", "option"),
    // logos
    "footer_logo"                  => get_field("footer_logo")                  ?: get_field("footer_logo", "option"),
    "footer_logo_b"                => get_field("footer_logo_b")                ?: get_field("footer_logo_b", "option"),
    "footer_logo_c"                => get_field("footer_logo_c")                ?: get_field("footer_logo_c", "option"),
    // background images
    "bckground_image"              => get_field("bckground_image")              ?: get_field("bckground_image", "option"),
    "bckground_image_b"            => get_field("bckground_image_b")            ?: get_field("bckground_image_b", "option"),
    "bckground_image_c"            => get_field("bckground_image_c")            ?: get_field("bckground_image_c", "option"),
    // nav columns
    "primary_footer_nav_columns"   => get_field("primary_footer_nav_columns")   ?: get_field("primary_footer_nav_columns", "option"),
    "primary_footer_nav_columns_b" => get_field("primary_footer_nav_columns_b") ?: get_field("primary_footer_nav_columns_b", "option"),
    "primary_footer_nav_columns_c" => get_field("primary_footer_nav_columns_c") ?: get_field("primary_footer_nav_columns_c", "option"),
    // socials
    "footer_social"                => get_field("footer_social")                ?: get_field("footer_social", "option"),
    "footer_social_b"              => get_field("footer_social_b")              ?: get_field("footer_social_b", "option"),
    "footer_social_c"              => get_field("footer_social_c")              ?: get_field("footer_social_c", "option"),
    // sub footer
    "sub_footer"                   => get_field("sub_footer")                   ?: get_field("sub_footer", "option"),
    "sub_footer_b"                 => get_field("sub_footer_b")                 ?: get_field("sub_footer_b", "option"),
    "sub_footer_c"                 => get_field("sub_footer_c")                 ?: get_field("sub_footer_c", "option"),
    // legal
    "legal"                        => get_field("legal")                        ?: get_field("legal", "option"),
    "legal_b"                      => get_field("legal_b")                      ?: get_field("legal_b", "option"),
    "legal_c"                      => get_field("legal_c")                      ?: get_field("legal_c", "option"),
]);
?>

<?php Timber::render("./partials/nav-footer.twig", $context); ?>
<?php wp_footer(); ?>

</body>

</html>