typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();

    const script = () => {
        const els = $("section.content-overlapping-blocks");
        if (!els.length) return;

        els.each(function () {
            const self = $(this);

            let heading = self.find(".main-title .inner-word");
            app.Animation.prototype.headingAnimation(heading, {
                trigger: self,
                start: "top 60%"
            });

            const panels = self.find(".item");
            if (!panels.length) return;

            const mm = gsap.matchMedia();
            const panelSTs = [];

            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop) {
                    if (!panelSTs.length) {
                        panels.each(function () {
                            const subSelf = $(this);
            
                            const panelST = ScrollTrigger.create({
                                trigger: subSelf,
                                pin: subSelf,
                                pinSpacing: false,
                                pinType: window.isTouchDevice() ? "fixed" : "transform",
                                start: () => `top ${$(".s-nav-inner").outerHeight()}px`,
                                end: () => `top ${$(".s-nav-inner").outerHeight()}px`,
                                // markers: true,
                                endTrigger: panels.last()
                            })
            
                            panelSTs.push(panelST);
                        })
                    }
                }

                if (isMobile) {
                    if (panelSTs.length) {
                        panelSTs.forEach(panelST => {
                            panelST.kill(true);
                        });
                    }
                }

                return () => { }
            });
        });
    }

    script();
});
