typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();

    const script = () => {
        const els = $("section.content-text-interactive-image");
        if (!els.length) return;

        els.each(function () {
            const self = $(this);
            /* Add your logic here */
        });
    }

    script();
});
