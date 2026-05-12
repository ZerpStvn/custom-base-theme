typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();
    
    function homepage() {
        const els = $("section.hero-full-width-image");
        if (!els.length) return;

        els.each(function () {
            const self = $(this);

            const innerWords = self.find(".inner-word");
            const mediaContainer = self.find(".media-container");
            const ticker = self.find(".ticker");

            const isVideo = mediaContainer.hasClass("video");

            gsap.timeline()
                .to(innerWords,
                    {
                        delay: 0.4,
                        y: 0,
                        stagger: { each: 0.04 },
                        duration: 0.8,
                        ease: Power2.easeOut,
                    },
                    "in"
                )
                .to(mediaContainer,
                    {
                        delay: 0.4,
                        x: 0,
                        autoAlpha: 1,
                        duration: 0.8,
                        ease: Power2.easeOut,
                        onStart: () => {
                            if (!mediaContainer.length || !isVideo) return;
                            const videoID = mediaContainer.data("video-id");
                            mediaContainer.append(`<iframe src="https://player.vimeo.com/video/${videoID}?autoplay=1&background=1" playsinline frameborder="0" allow="autoplay;"></iframe>`)
                        },
                    },
                    "in"
                )
                .to(ticker,
                    {
                        x: 0,
                        duration: 3,
                        ease: "expo.out",
                        // duration: 3,
                        // ease: "steps(60)",
                        onComplete: () => {
                            if (!mediaContainer.length || !isVideo) return;

                            const playerContainer = mediaContainer.find("iframe");
                            if (!playerContainer.length) return;

                            const playerInstance = new Vimeo.Player(playerContainer.get(0));
                            playerInstance.setMuted(true);

                            ScrollTrigger.create({
                                trigger: self,
                                start: "top center",
                                end: "bottom 30%",
                                onEnter: () => {
                                    playerInstance.play();
                                },
                                onLeave: () => {
                                    playerInstance.pause();
                                },
                                onEnterBack: () => {
                                    playerInstance.play();
                                },
                                onLeaveBack: () => {
                                    playerInstance.pause();
                                }
                            });
                        }
                    },
                    "<0.5"
                )
        });
    }

    homepage();
});
