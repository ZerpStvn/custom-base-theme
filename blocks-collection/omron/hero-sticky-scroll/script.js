typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();

    const topPos = "-60px";
    const bottomPos = "80px";

    const script = () => {
        const els = $("section.hero-sticky-scroll");
        if (!els.length) return;

        els.each(function () {
            const self = $(this);

            let heading = self.find(".main-title .inner-word");
            app.Animation.prototype.headingAnimation(heading, {
                trigger: self,
                start: "top 60%"
            });

            pinContent(self);
            itemImages(self);
        });
    }

    const pinContent = (self) => {
        const contentArea = self.find(".item-content");
        const mm = gsap.matchMedia();
        let pinST = null;

        mm.add({
            isDesktop: `(min-width: 992px)`,
            isMobile: `(max-width: 991.98px)`,
        }, (context) => {
            let { isDesktop, isMobile } = context.conditions;

            if (isDesktop) {
                if (!pinST) {
                    pinST = ScrollTrigger.create({
                        trigger: self,
                        pin: contentArea,
                        pinSpacing: false,
                        start: "top top",
                        end: "bottom 90%",
                        // markers: true,
                        refreshPriority: 1,
                        invalidateOnRefresh: true,
                        pinType: window.isTouchDevice() ? "fixed" : "transform",
                    })
                }
            }

            if (isMobile) {
                if (pinST) {
                    pinST.kill(true);
                }
            }

            return () => { }
        });
    }

    const itemImages = (self) => {
        const itemImages = self.find(".item-image");
        if (!itemImages.length) return;

        const itemCount = itemImages.length;

        const mm = gsap.matchMedia();
        const imageSTs = [];

        mm.add({
            isDesktop: `(min-width: 992px)`,
            isMobile: `(max-width: 991.98px)`,
        }, (context) => {
            let { isDesktop, isMobile } = context.conditions;

            if (isDesktop) {
                if (!imageSTs.length) {
                    itemImages.each(function (index) {
                        const subSelf = $(this);
                        const isLastItem = itemCount == (index + 1);
    
                        const imageST = ScrollTrigger.create({
                            trigger: subSelf,
                            start: "top 60%",
                            end: "top top",
                            // markers: true,
                            onEnter: () => {
                                animateInOut(self, index, true);
                            },
                            onEnterBack: () => {
                                if (isLastItem) return;
                                animateInOut(self, index, true, true);
                            },
                            onLeave: () => {
                                if (isLastItem) return;
                                animateInOut(self, index, false);
                            },
                            onLeaveBack: () => {
                                animateInOut(self, index, false, true);
                            },
                        })

                        imageSTs.push(imageST);
                    });
                }
            }

            if (isMobile) {
                if (imageSTs.length) {
                    imageSTs.forEach(imageST => {
                        imageST.kill(true);
                    });
                }
            }

            return () => { }
        });
    }

    const animateInOut = (self, index, enter = true, back = false) => {
        let targetText = self.find(`.item-text[data-index='${index}']`);

        if (enter) {
            gsap.fromTo(targetText,
                {
                    y: !back ? bottomPos : topPos,
                    autoAlpha: 0,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.6,
                    ease: Power2.easeOut,
                    overwrite: true,
                    onStart: () => {
                        targetText.addClass("active");
                    }
                }
            )
        } else {
            gsap.fromTo(targetText,
                {
                    y: 0,
                    autoAlpha: 1,
                },
                {
                    autoAlpha: 0,
                    y: !back ? topPos : bottomPos,
                    duration: 0.6,
                    ease: Power2.easeOut,
                    overwrite: true,
                    onComplete: () => {
                        targetText.removeClass("active");
                    }
                }
            )
        }
    }

    script();
});
