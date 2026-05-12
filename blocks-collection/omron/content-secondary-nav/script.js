typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();

    const script = () => {
        const els = $("section.content-secondary-nav");
        if (!els.length) return;

        els.each(function () {
            const self = $(this);
            const snav = self.find(".s-nav");

            ScrollTrigger.create({
                trigger: self,
                pin: snav,
                pinSpacing: false,
                start: "top top",
                end: "max",
                pinType: window.isTouchDevice() ? "fixed" : "transform",
                toggleClass: { targets: self, className: "active" },
            })
        });
    }

    script();
});
