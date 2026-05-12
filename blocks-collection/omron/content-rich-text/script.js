typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();

    $('section.content-rich-text-start').each(function () {
        const $start = $(this);
        const $end = $start.nextAll('.content-rich-text-end').first();
        const $container = $start.find('.content');

        if ($end.length && $container.length) {
            const $elementsInBetween = $start.nextUntil($end);
            $container.append($elementsInBetween);
            $start.removeClass('content-rich-text-start').addClass('content-rich-text');
            $end.remove();
        }

        let heading = $start.find(".main-title .inner-word");
        app.Animation.prototype.headingAnimation(heading, {
            trigger: $start,
            start: "top 60%"
        });
    });
});