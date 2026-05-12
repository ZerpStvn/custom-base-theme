typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();

    const script = () => {
        const els = $("section.hero-three-across-tiles");
        if (!els.length) return;

        els.each(function () {
            const self = $(this);

            let heading = self.find(".main-title .inner-word");
            app.Animation.prototype.headingAnimation(heading, {
                trigger: self,
                start: "top 60%"
            });

            const items = self.find(".item");
            items.each(function (index) {
                const subSelf = $(this);

                const itemBox = subSelf.find(".item-box");
                const itemT = subSelf.find(".item-t");
                const itemR = subSelf.find(".item-r");
                const itemB = subSelf.find(".item-b");
                const itemL = subSelf.find(".item-l");

                const length = "8.75rem";
                const start = "0%";
                const end = "100%";
                const resetDuration = 0.4;
                const tweenDuration = 2.5;

                const tl = gsap.timeline({
                    paused: true,
                    repeat: 4,
                    defaults: {
                        duration: tweenDuration,
                        ease: "linear",
                        immediateRender: false,
                    },
                    scrollTrigger: {
                        trigger: subSelf,
                        start: "top 60%",
                        end: "bottom top",
                        onEnter: () => tl.play(),
                        onEnterBack: () => tl.play(),
                        onLeave: () => tl.pause(),
                        onLeaveBack: () => tl.pause(),
                    }
                })
                    .set([itemL, itemR, itemB, itemL], {
                        clearProps: true
                    })
                    .fromTo(itemT,
                        {
                            right: end,
                            width: length
                        },
                        {
                            right: start,
                            width: length,
                            onStart: () => {
                                gsap.fromTo(itemL,
                                    {
                                        y: 0,
                                        top: 0,
                                        height: length,
                                    },
                                    {
                                        y: `-${end}`,
                                        height: length,
                                        duration: resetDuration,
                                        ease: "linear"
                                    }
                                )
                            }
                        },
                        "going-right"
                    )
                    .fromTo(itemBox,
                        {
                            top: start,
                            left: start,
                        },
                        {
                            top: start,
                            left: end,
                        },
                        "going-right"
                    )
                    .fromTo(itemR,
                        {
                            bottom: end,
                            height: length,
                        },
                        {
                            bottom: 0,
                            height: length,
                            onStart: () => animateOut(itemT, resetDuration)
                        },
                        "going-down"
                    )
                    .fromTo(itemBox,
                        {
                            left: end,
                            top: start,
                        },
                        {
                            left: end,
                            top: end,
                        },
                        "going-down"
                    )
                    .fromTo(itemB,
                        {
                            left: end,
                            width: length,
                        },
                        {
                            left: 0,
                            width: length,
                            onStart: () => animateOut(itemR, resetDuration, false)
                        },
                        "going-left"
                    )
                    .fromTo(itemBox,
                        {
                            left: end,
                            top: end
                        },
                        {
                            left: start,
                            top: end,
                        },
                        "going-left"
                    )
                    .fromTo(itemL,
                        {
                            top: end,
                            height: length,
                            y: 0
                        },
                        {
                            top: 0,
                            y: 0,
                            height: length,
                            onStart: () => animateOut(itemB, resetDuration)
                        },
                        "going-top"
                    )
                    .fromTo(itemBox,
                        {
                            left: start,
                            top: end
                        },
                        {
                            left: start,
                            top: start,
                        },
                        "going-top"
                    )

                tl.seek(1.5 * (index + 1));
                animateOut(itemT, resetDuration);
            });
        });
    }

    const animateOut = (el, resetDuration, width = true) => {
        if (!el.length) return;

        const config = {
            duration: resetDuration,
            ease: "linear"
        }

        if (width) {
            config.width = 0;
        } else {
            config.height = 0;
        }

        gsap.to(el, config);
    }

    script();
});
