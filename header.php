<?php

/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package cbtheme
 */

use Timber\Timber;

$context = Timber::context([
    "header_nav_item" => get_field("header_nav_item") ?: get_field("header_nav_item", "option"),
]);
?>

<!doctype html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="theme-color" content="<?= get_field("theme_color", "option") ?>">

    <link rel="icon" type="image/png" href="<?= favicon() ?>">

    <script type="text/javascript">
        const templateURL = '<?= get_template_directory_uri(); ?>';
        history.scrollRestoration = "manual"
    </script>

    <?php wp_head(); ?>
</head>

<body <?php body_class("is-loading"); ?>>
    <?php Timber::render("./partials/nav-header.twig", $context); ?>
    <?php Timber::render("./partials/modal-form.twig", [
        "footer_template" => get_field("footer_template") ?: get_field("footer_template", "option"),
    ]); ?>