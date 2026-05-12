<?php
function current_year_shortcode()
{
    return date('Y');
}
add_shortcode('year', 'current_year_shortcode');
