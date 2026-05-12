typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();

    function content() {
        const els = $("section.content-50-50");
        if (!els.length) return;

        els.each(function () {
            const self = $(this);

            let heading = self.find(".main-title .inner-word");
            const ticker = self.find(".ticker");
            const videoContainer = self.find(".video-container");

            app.Animation.prototype.headingAnimation(heading, {
                trigger: self,
                start: "top 60%"
            });

            gsap.to(ticker,
                {
                    y: 0,
                    duration: 3,
                    ease: "expo.out",
                    // duration: 3,
                    // ease: "steps(60)",
                    delay: 0.6,
                    scrollTrigger: {
                        trigger: self,
                        start: "top 60%"
                    },
                    onStart: () => {
                        if (!videoContainer.length) return;
                        const videoID = videoContainer.data("video-id");
                        videoContainer.append(`<iframe src="https://player.vimeo.com/video/${videoID}?autoplay=1&background=1" playsinline frameborder="0" allow="autoplay;"></iframe>`);

                        const playerContainer = videoContainer.find("iframe");
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
                    },
                }
            )
        });
    }

    content();
});
