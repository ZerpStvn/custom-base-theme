<?php
function jpg($name)
{
    return get_template_directory_uri() . "/assets/img/jpg/" . $name . ".jpg";
}

function svg($name)
{
    return get_template_directory_uri() . "/assets/img/svg/" . $name . ".svg";
}

function png($name)
{
    return get_template_directory_uri() . "/assets/img/png/" . $name . ".png";
}

function webp($name)
{
    return get_template_directory_uri() . "/assets/img/webp/" . $name . ".webp";
}

function video($name)
{
    return get_template_directory_uri() . "/assets/video/" . $name;
}

function json($name)
{
    return get_template_directory_uri() . "/assets/json/" . $name . ".json";
}

function block_icon($code = false)
{
    if ($code) {
        $theme_block_icon = get_field("block_icon_code", "option");

        if ($theme_block_icon) {
            return $theme_block_icon;
        }

        return '<svg width="16" height="16" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_3652_302)"> <circle cx="45" cy="45" r="45" fill="white"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M47.6606 24.5713H42.2873L29.5126 59.68H34.4266C35.077 59.6797 35.7112 59.4767 36.2408 59.0992C36.7705 58.7218 37.1694 58.1887 37.382 57.574L38.786 53.466L40.71 47.7027L45.1473 34.928L49.4373 47.7027L51.2573 53.466L52.618 57.548C52.8255 58.1696 53.2235 58.7101 53.7555 59.0928C54.2876 59.4755 54.9266 59.6809 55.582 59.68H60.4786L47.6606 24.5713Z" fill="#272628"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M45 83.99C37.2865 83.99 29.7463 81.7027 23.3328 77.4173C16.9193 73.1319 11.9205 67.0409 8.96871 59.9146C6.0169 52.7883 5.24457 44.9467 6.74939 37.3815C8.25421 29.8162 11.9686 22.8671 17.4228 17.4128C22.8771 11.9586 29.8262 8.2442 37.3915 6.73938C44.9567 5.23456 52.7983 6.00689 59.9246 8.9587C67.051 11.9105 73.1419 16.9092 77.4273 23.3228C81.7127 29.7363 84 37.2765 84 44.99C84 55.3334 79.8911 65.2532 72.5772 72.5671C65.2632 79.8811 55.3434 83.99 45 83.99ZM45 11.7273C38.4188 11.7256 31.985 13.6757 26.5122 17.331C21.0394 20.9862 16.7736 26.1824 14.2543 32.2623C11.735 38.3422 11.0754 45.0326 12.3589 51.4874C13.6424 57.9423 16.8114 63.8714 21.465 68.525C26.1186 73.1786 32.0477 76.3476 38.5025 77.6311C44.9574 78.9146 51.6478 78.255 57.7277 75.7357C63.8076 73.2164 69.0038 68.9506 72.659 63.4778C76.3143 58.005 78.2644 51.5712 78.2626 44.99C78.2512 36.1717 74.7431 27.7179 68.5076 21.4824C62.2721 15.2469 53.8183 11.7388 45 11.7273Z" fill="#272628"/> </g> <defs> <clipPath id="clip0_3652_302"> <rect width="90" height="90" fill="white"/> </clipPath> </defs> </svg>';
    } else {
        $theme_block_icon = get_field("block_icon", "option");

        if ($theme_block_icon) {
            return $theme_block_icon;
        }

        return svg("block-icon");
    }
}

function menu_icon()
{
    $theme_menu_icon = get_field("menu_icon", "option");

    if ($theme_menu_icon) {
        return $theme_menu_icon;
    }

    return svg("block-icon");
}

function favicon()
{
    $favicon = get_field("favicon", "option");

    if ($favicon) {
        return $favicon;
    }

    return png("favicon");
}
