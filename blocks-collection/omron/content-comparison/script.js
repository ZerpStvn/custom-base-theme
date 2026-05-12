typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();

    const script = () => {
        const els = $("section.content-comparison");
        if (!els.length) return;

        els.each(function () {
            const self = $(this);
            
            let heading = self.find(".main-title .inner-word");
            app.Animation.prototype.headingAnimation(heading, {
                trigger: self,
                start: "top 60%"
            });
        });
    }

    script();
});
