<?php

if (!function_exists('is_plugin_active')) {
    include_once ABSPATH . 'wp-admin/includes/plugin.php';
}

if (is_plugin_active('advanced-custom-fields-pro/acf.php')) {
    // Abort all bundling, ACF PRO plugin takes priority
    return;
}

// Check if another plugin or theme has bundled ACF
if (defined('MY_ACF_PATH')) {
    return;
}

define('MY_ACF_PATH', get_template_directory_uri() . '/extensions/acf/');
define('MY_ACF_URL', get_template_directory_uri() . '/extensions/acf/');

// Include the ACF plugin.
include_once(MY_ACF_PATH . 'acf.php');

// Customize the URL setting to fix incorrect asset URLs.
add_filter('acf/settings/url', 'my_acf_settings_url');
function my_acf_settings_url($url)
{
    return MY_ACF_URL;
}


function acf_load_archive_post_type_choices($field)
{
    $post_types = get_post_types([], "objects");

    foreach ($post_types as $type) {
        $field["choices"][$type->name] = $type->labels->singular_name;
    }

    return $field;
}

add_filter(
    "acf/load_field/name=archive_post_type",
    "acf_load_archive_post_type_choices"
);

function override_post_type($args, $field, $post_id)
{
    die(var_dump($post_id));
    $post_type = get_field("archive_post_type", $post_id);
    $args["post_type"] = $post_type;

    return $args;
}

function wpforms_select($field)
{
    $args = [
        "post_type" => "wpforms",
        "post_status" => "publish",
        "posts_per_page" => -1,
    ];
    $posts = wpforms()->form->get();
    foreach ($posts as $post) {
        $field['choices'][$post->ID] = $post->post_title;
    }

    return $field;
}

//add_filter("acf/load_field/name=roi_signup_form", "wpforms_select");
//add_filter("acf/load_field/name=wpform_select","wpforms_select");

//add_filter('acf/fields/post_object/query/name=featured_resource','override_post_type');