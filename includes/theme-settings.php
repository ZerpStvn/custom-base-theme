<?php
class CbthemeThemeController
{

    function settingStyles()
    {
        $section = get_field('section', 'option');
        ob_start();
?>
        <style>
            :root {
                --section-padding-top: <?= $section['padding_top']; ?>px;
                --section-padding-bottom: <?= $section['padding_bottom']; ?>px;
                --section-padding-top-mobile: <?= $section['padding_top_mobile']; ?>px;
                --section-padding-bottom-mobile: <?= $section['padding_bottom_mobile']; ?>px;
            }
        </style>
<?php
        return ob_end_flush();
    }

    public static function init()
    {
        add_action('wp_head', [(new self), 'settingStyles']);
    }

    public static function filterCustomTaxonomy($post_type)
    {
        $taxonomies = get_object_taxonomies($post_type);
        $default = [
            'category',
            'post_tag'
        ];
        foreach ($taxonomies as $key => $taxonomy) {
            if (in_array($taxonomy, $default))
                unset($taxonomies[$key]);
        }
        return array_values($taxonomies)[0];
    }
}

CbthemeThemeController::init();
