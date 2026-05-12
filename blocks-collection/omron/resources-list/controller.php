<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block")
]);

$context["block"]["slug"] = sanitize_title($block["title"]);

$context['categories'] = Timber::get_terms(array(
    'taxonomy' => 'resource-category',
    'hide_empty' => true,
));

$context['subcategories'] = Timber::get_terms([
    'taxonomy' => 'resource-sub-category',
    'hide_empty' => false,
]);

$context['resources'] = Timber::get_posts(array(
    'post_type' => 'resource',
    'posts_per_page' => -1,
    'post_status' => 'publish',
    'order' => 'DESC',
));

acf_reset_meta($block["id"]);


Timber::render("./template.twig", $context);
