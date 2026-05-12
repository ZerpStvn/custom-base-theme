typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();
    
    function homepage() {
        const els = $("section.hero-homepage");
        if (!els.length) return;

        els.each(function () {
            const self = $(this);

            const innerWords = self.find(".inner-word");
            const videoContainer = self.find(".video-container");
            const ticker = self.find(".ticker");

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
                .to(videoContainer,
                    {
                        delay: 0.4,
                        x: 0,
                        autoAlpha: 1,
                        duration: 0.8,
                        ease: Power2.easeOut,
                        onStart: () => {
                            if (!videoContainer.length) return;
                            const videoID = videoContainer.data("video-id");
                            videoContainer.append(`<iframe src="https://player.vimeo.com/video/${videoID}?autoplay=1&background=1" playsinline frameborder="0" allow="autoplay;"></iframe>`)
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
                            const playerContainer = videoContainer.find("iframe");
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
