typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();
    
    function carousel() {
        const els = $("section.hero-blog");
        if (!els.length) return;

        els.each(function () {
            const self = $(this);

            let heading = self.find(".main-title .inner-word");

            app.Animation.prototype.headingAnimation(heading, {
                trigger: self,
                start: "top 60%"
            });

            const mm = gsap.matchMedia();
            const parallaxEl = self.find(".parallax");
            
            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop) {
                    app.smoother && app.smoother.effects(parallaxEl, { speed: 'clamp(1.2)' });
                }

                if (isMobile) {
                    app.smoother && app.smoother.effects(parallaxEl, { speed: 1 });
                }

                return () => { }
            });
        });
    }

    carousel();
});
