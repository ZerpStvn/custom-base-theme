(function (app) {
    "use strict";
    var $ = jQuery.noConflict();
    var Animation = function () { };

    Animation.prototype.init = function () {
        Animation.prototype.handleNav();
        Animation.prototype.smoothScroll();
        Animation.prototype.footerAnimation();
    };

    Animation.prototype.smoothScroll = function () {
        if (typeof ScrollSmoother === 'undefined') return;
        // if (ScrollTrigger.isTouch !== 1) {
        const isNotTouchDevice = ScrollTrigger.isTouch !== 1;

        app.smoother = ScrollSmoother.create({
            wrapper: '#smooth-wrapper',
            content: '#smooth-content',
            smooth: isNotTouchDevice ? 1.8 : 0,
            speed: isNotTouchDevice ? 0.8 : 1,
            effects: true,
            // normalizeScroll: isNotTouchDevice ? true : false,
            // ignoreMobileResize: true
        });
        // } else {
        //     app.rellax = new Rellax('.rellax');
        // }

        Animation.prototype.handleAnchors(app.smoother);
    };

    Animation.prototype.handleAnchors = function (smoother) {
        const anchors = $('a[href^="#"]');
        if (!anchors.length) return;

        anchors.click(function (e) {
            e.preventDefault();

            const subSelf = $(this);
            const selector = subSelf.attr("href");
            if (selector == '#') return;
            
            smoother.scrollTo(selector, true, "center center");

            // gsap.to(smoother, {
            //     // don't let it go beyond the maximum scrollable area
            //     scrollTop: Math.min(
            //         ScrollTrigger.maxScroll(window),
            //         smoother.offset(selector, "top 100px")
            //     ),
            //     duration: 0.6,
            //     overwrite: true,
            //     easeL
            // });

            // gsap.to(window, { 
            //     duration: 0.4, 
            //     overwrite: true, 
            //     scrollTo: { 
            //         y: selector, 
            //         offsetY: 100,
            //         autoKill: false
            //     },
            //     ease: "power2" 
            // });
        });
    };

    Animation.prototype.handleNav = function () {
        const nav = $("nav");
        if (!nav.length) return;

        const toggleBGOnScroll = () => {
            ScrollTrigger.create({
                id: "nav-bg-scroll",
                trigger: "main",
                start: "top -20px",
                endTrigger: "footer",
                end: "bottom top",
                refreshPriority: 1,
                toggleClass: { targets: "nav", className: "active" },
            });
        }

        const showDDPanel = () => {
            const items = nav.find(".nav__item.parent");
            const overlay = nav.find(".nav__overlay");

            overlay.click(function () {
                const activeItems = nav.find(".nav__item.parent.active");

                gsap.to(activeItems.find(".nav__dd"), {
                    height: 0,
                    duration: 0.4,
                    ease: Power2.easeOut,
                    overwrite: true,
                    onComplete: () => {
                        items.removeClass("active");
                    }
                });
            });

            items.click(function (e) {
                e.stopPropagation();

                const subSelf = $(this);
                const dd = subSelf.find(".nav__dd");
                const ddInner = dd.find(".nav__dd-inner");

                if (!subSelf.hasClass("active")) {
                    const navItemTL = gsap.timeline({ defaults: { overwrite: true } });

                    const activeItems = nav.find(".nav__item.parent.active");
                    items.removeClass("active");
                    subSelf.addClass("active");

                    if (activeItems.length) {
                        navItemTL.set(activeItems.find(".nav__dd, .nav__dd-inner"), {
                            clearProps: true
                        });
                    }

                    navItemTL
                        .fromTo(dd,
                            {
                                height: 0,
                            },
                            {
                                height: "auto",
                                duration: 0.6,
                                ease: "expo.out"
                            },
                        )
                        .fromTo(ddInner,
                            {
                                autoAlpha: 0,
                                y: "2rem",
                            },
                            {
                                y: 0,
                                autoAlpha: 1,
                                duration: 0.6,
                                ease: Power2.easeOut
                            },
                            "<0.2"
                        )

                } else {
                    overlay.trigger("click");
                }
            })
        }

        const productsHover = () => {
            const items = nav.find(".nav__dd.is-products .nav__dd-group-link");
            const itemImages = nav.find(".nav__dd.is-products .nav__dd-image");

            items.hover(
                function () {
                    itemImages.removeClass("active");

                    const subSelf = $(this);
                    const index = subSelf.data("product-index");
                    nav.find(`.nav__dd.is-products .nav__dd-image[data-product-index='${index}']`).addClass("active");
                }, function () {
                    return;
                    // itemImages.removeClass("active");
                }
            );
        }

        const toggleNav = () => {
            ScrollTrigger.create({
                id: "nav-bg-hide",
                trigger: "body",
                start: "top top",
                end: "max",
                onUpdate: (self) => {
                    if (self.direction === 1) {
                        hideHeader(true);
                    } else {
                        hideHeader(false);
                    }
                },
            });

            function hideHeader(state) {
                if (state) {
                    if (nav.hasClass("nav-hidden") || nav.hasClass("mob-active")) return;
                    nav.addClass("nav-hidden");
                } else {
                    if (!nav.hasClass("nav-hidden")) return;
                    nav.removeClass("nav-hidden");
                }
            }
        }

        if ($(".content-secondary-nav").length) {
            toggleNav();
        }

        toggleBGOnScroll();
        productsHover();
        showDDPanel();
    };

    Animation.prototype.headingAnimation = function (words, ST, TW = {}) {
        if (words) {
            const tweenConfig = {
                y: 0,
                stagger: { each: 0.04 },
                duration: 0.8,
                ease: Power2.easeOut,
                ...TW
            }

            if (ST) {
                tweenConfig.scrollTrigger = { ...ST };
            }

            gsap.fromTo(words, { y: "120%" }, { ...tweenConfig });
        }
    };

    Animation.prototype.orbAnimation = function (box, orb) {
        if (!box.length || !orb.length) return;

        let mm = window.matchMedia("(max-width: 1200px)");

        const setX = gsap.quickTo(orb, "x", { duration: 0.8, ease: "power3" });
        const setY = gsap.quickTo(orb, "y", { duration: 0.8, ease: "power3" });

        const moveOrb = (e) => {
            const rect = box.get(0).getBoundingClientRect();
            const orbWidth = orb.outerWidth() / 2;
            const orbHeight = orb.outerHeight() / 2;

            setX(e.clientX - rect.left - orbWidth);
            setY(e.clientY - rect.top - orbHeight);
        };

        const startFollow = () => box.on("mousemove", moveOrb);
        const stopFollow = () => box.off("mousemove", moveOrb);

        const fade = gsap.to(orb, {
            autoAlpha: 1,
            scale: 1,
            ease: "none",
            paused: true,
            onReverseComplete: stopFollow,
        });

        box.on("mouseenter", (e) => {
            if (mm.matches) return;
            fade.play();
            startFollow();
            moveOrb(e);
        });

        box.on("mouseleave", () => fade.reverse());
    }

    Animation.prototype.footerAnimation = function () {
        const backToTopAnim = () => {
            const backToTop = $(`.footer__to-top`);
            if (!backToTop.length) return;

            backToTop.click(function () {
                gsap.to(window, {
                    duration: 0.2,
                    scrollTo: 0,
                    ease: Power1.easeInOut,
                    overwrite: true
                });
            });
        }

        const footerHeadingAnim = () => {
            let heading = $(".footer__pre-heading .inner-word");
            if (!heading.length) return;

            app.Animation.prototype.headingAnimation(heading, {
                trigger: ".footer",
                start: "top 60%"
            });
        }

        const footerVideo = () => {
            const videoContainer = $(`.footer__media .video-container`);
            if (!videoContainer.length) return;

            ScrollTrigger.create({
                trigger: "footer",
                start: "top 60%",
                once: true,
                onEnter: () => {
                    const videoID = videoContainer.data("video-id");
                    videoContainer.append(`<iframe src="https://player.vimeo.com/video/${videoID}?autoplay=1&background=1" playsinline frameborder="0" allow="autoplay;"></iframe>`);

                    setTimeout(() => {
                        videoContainer.addClass("loaded");

                        const playerContainer = videoContainer.find("iframe");
                        if (!playerContainer.length) return;

                        const playerInstance = new Vimeo.Player(playerContainer.get(0));
                        playerInstance.setMuted(true);

                        ScrollTrigger.create({
                            trigger: "footer",
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
                    }, 3000);
                },
            });
        }

        backToTopAnim();
        footerVideo();
        footerHeadingAnim();
    };

    app.Animation = Animation;

    app.ready(function () {
        // console.log("Animation ->");
        Animation.prototype.init();
    });
})(window.app);
