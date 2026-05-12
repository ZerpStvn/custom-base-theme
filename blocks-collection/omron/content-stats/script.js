typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();
    
    function stats() {
        const statsSections = $("section.content-stats");
        if (!statsSections.length) return;

        let resizeTimeout;
        let currentWindowWidth = $(window).width();

        const titleData = [];

        statsSections.each(function () {
            const section = $(this);
            const mainTitle = section.find(".main-title");
            const items = section.find(".item");
            const itemCounters = items.find("h2 span");

            let textSplit = null;
            let textTimeline = null;

            // Animate counters
            if (items.length) {
                const animationConfig = {
                    textContent: 0,
                    duration: 1.6,
                    snap: { textContent: 1 },
                    ease: "linear",
                    stagger: { each: 0.3 },
                    scrollTrigger: {
                        trigger: section,
                        start: "top 40%",
                        invalidateOnRefresh: true
                    },
                };

                gsap.from(itemCounters, animationConfig);

                items.each(function () {
                    const subSelf = $(this);
                    app.Animation.prototype.orbAnimation(subSelf, subSelf.find(".orb"));
                });
            }

            // Animate title text
            if (mainTitle.length) {
                const titleConfig = { mainTitle, section, textSplit, textTimeline };
                titleData.push(titleConfig);
                updateTitleAnimation(titleConfig);
            }

            const mm = gsap.matchMedia();
            const parallaxEl = section.find(".parallax");
            
            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop) {
                    app.smoother && app.smoother.effects(parallaxEl, { speed: 'clamp(0.94)' });
                }

                if (isMobile) {
                    app.smoother && app.smoother.effects(parallaxEl, { speed: 'clamp(1.1)' });
                }

                return () => { }
            });
        });

        // $(window).on("resize", () => {
        //     if ($(window).width() !== currentWindowWidth) {
        //         currentWindowWidth = $(window).width();
        //         clearTimeout(resizeTimeout);
        //         resizeTimeout = setTimeout(() => {
        //             titleData.forEach(updateTitleAnimation);
        //         }, 200);
        //     }
        // });

        function updateTitleAnimation(config) {
            const { mainTitle, section } = config;

            if (config.textSplit) config.textSplit.revert();
            if (config.textTimeline) config.textTimeline.kill(true);

            let mm = window.matchMedia("(max-width: 1200px)");

            config.textSplit = new SplitText(mainTitle, { type: "words" });
            config.textTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: mm.matches ? mainTitle : section,
                    scrub: mm.matches ? true : 1,
                    start: mm.matches ? "top 60%" : "top 75%",
                    end: "bottom 90%",
                },
            });

            config.textSplit.words.forEach((word) => {
                config.textTimeline.to(word, {
                    backgroundPositionX: 0,
                    ease: "none",
                    duration: 0.5,
                });
            });
        }
    }

    stats();
});
