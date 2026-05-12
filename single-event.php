<?php

/**
 * Template for single tribe_events posts (The Events Calendar)
 *
 * @package cbtheme
 */

use Timber\Timber;

get_header();

$id        = get_the_ID();
$permalink = function_exists('tribe_get_event_link') ? tribe_get_event_link($id) : get_permalink($id);
$has_venue = function_exists('tribe_get_venue');

$start_raw = get_post_meta($id, '_EventStartDate', true);
$end_raw   = get_post_meta($id, '_EventEndDate',   true);

function _bf_fmt($raw, $format) {
    if (!$raw) return '';
    $ts = strtotime($raw);
    return $ts ? date_i18n($format, $ts) : '';
}

$raw_tickets = class_exists('Tribe__Tickets__Tickets')
    ? Tribe__Tickets__Tickets::get_all_event_tickets($id)
    : [];

$tickets = [];
foreach ($raw_tickets as $t) {
    $tickets[] = [
        'id'          => $t->ID,
        'name'        => $t->name ?? '',
        'description' => $t->description ?? '',
        'start_date'  => !empty($t->start_date) ? date_i18n('M j, Y', strtotime($t->start_date)) : '',
        'end_date'    => !empty($t->end_date)   ? date_i18n('M j, Y', strtotime($t->end_date))   : '',
    ];
}

$context = Timber::context([
    'hero'           => get_field('block', $id) ?: [],
    'event_title'    => get_the_title($id),
    'thumbnail'      => get_post_thumbnail_id($id) ?: null,
    'content'        => apply_filters('the_content', get_post_field('post_content', $id)),
    'start_date'     => _bf_fmt($start_raw, 'D, M j, Y'),
    'start_day_num'  => _bf_fmt($start_raw, 'j'),
    'start_day_name' => _bf_fmt($start_raw, 'D'),
    'start_time'     => _bf_fmt($start_raw, 'g:i A'),
    'start_iso'      => $start_raw ? date('Ymd\THis', strtotime($start_raw)) : '',
    'end_date'       => _bf_fmt($end_raw,   'D, M j, Y'),
    'end_time'       => _bf_fmt($end_raw,   'g:i A'),
    'end_iso'        => $end_raw   ? date('Ymd\THis', strtotime($end_raw))   : '',
    'venue'          => $has_venue ? tribe_get_venue($id) : '',
    'venue_address'  => function_exists('tribe_get_full_address') ? tribe_get_full_address($id) : '',
    'cost'           => function_exists('tribe_get_cost') ? tribe_get_cost($id, true, false) : '',
    'website'        => function_exists('tribe_get_event_website_url') ? tribe_get_event_website_url($id) : '',
    'event_id'       => $id,
    'tickets'        => $tickets,
    'has_tickets'    => !empty($tickets),
    'permalink'      => $permalink,
]);

Timber::render('./partials/single-event.twig', $context);

get_footer();
