typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();

    const script = () => {
        const els = $("section.content-cta-large-image-bg");
        if (!els.length) return;

        els.each(function () {
            const self = $(this);
            
            const box = self.find(".box");
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: self,
                    start: "top 60%"
                }
            })

            tl.fromTo(box, 
                {
                    autoAlpha: 0,
                    y: '3.75rem'
                },
                {
                    autoAlpha: 1,
                    duration: 1,
                    y: 0,
                    ease: Power2.easeOut
                }
            )

            let heading = self.find(".main-title .inner-word");
            if (heading.length) {
                tl.fromTo(heading,
                    {
                        y: "120%"
                    },
                    {
                        y: 0,
                        stagger: { each: 0.04 },
                        duration: 0.8,
                        ease: Power2.easeOut,
                    },
                    "<0.4"
                );
            }
        });
    }

    script();
});
