typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();

    function carousel() {
        const els = $("section.content-click-drag-carousel");
        if (!els.length) return;

        els.each(function () {
            const self = $(this);
            const items = self.find(".swiper-slide");
            const swiperEL = self.find('.swiper-container');
            const parallaxEl = self.find(".parallax");

            let heading = self.find(".main-title .inner-word");

            app.Animation.prototype.headingAnimation(heading, {
                trigger: self,
                start: "top 60%"
            });

            app.Animation.prototype.orbAnimation(self.find(".box"), self.find(".orb"));

            if (swiperEL.length) {
                const next = self.find(".arrow-right");
                const prev = self.find(".arrow-left");

                const swiper = new Swiper(swiperEL.get(0), {
                    slidesPerView: 'auto',
                    freeMode: {
                        enable: true,
                        momentumBounceRatio: 0.8,
                        minimumVelocity: 0.01,
                        momentumRatio: 0.6,
                        momentumVelocityRatio: 0.8
                    },
                    speed: 1000,
                    resistanceRatio: 1,
                });

                next.click(function() {
                    swiper.slideNext();
                });

                prev.click(function() {
                    swiper.slidePrev();
                });
            }

            if (items.length) {
                items.hover(
                    function () {
                        const subSelf = $(this);
                        const ticker = subSelf.find(".ticker");

                        gsap.to(ticker,
                            {
                                x: 0,
                                duration: 3,
                                ease: "expo.out",
                                overwrite: true
                            }
                        )
                    }, function () {
                        const subSelf = $(this);
                        const ticker = subSelf.find(".ticker");

                        gsap.to(ticker,
                            {
                                x: "-120%",
                                duration: 1,
                                ease: "expo.out",
                                overwrite: true
                            }
                        )
                    }
                );
            }

            const mm = gsap.matchMedia();

            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop) {
                    app.smoother && app.smoother.effects(parallaxEl, { speed: 'clamp(1.2)' });
                }

                if (isMobile) {
                    app.smoother && app.smoother.effects(parallaxEl, { speed: 'clamp(1.4)' });
                }

                return () => { }
            });
        });
    }

    carousel();
});
