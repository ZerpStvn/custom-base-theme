typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();

    const script = () => {
        const els = $("section.hero-homepage");
        if (!els.length) return;

        const nav = $("nav.nav");
        const heroImg = els.first().find("[data-hero-bg] img")[0];

        if (nav.length) {
            gsap.set(nav, { opacity: 0 });
        }

        const revealNav = () => {
            gsap.to(nav, { opacity: 1, duration: 0.6, ease: "power2.out" });
        };

        if (!heroImg) {
            revealNav();
            return;
        }

        if (heroImg.complete && heroImg.naturalWidth > 0) {
            revealNav();
        } else {
            heroImg.addEventListener("load", revealNav, { once: true });
            // Safety fallback — show nav if image takes too long or errors
            heroImg.addEventListener("error", revealNav, { once: true });
            setTimeout(revealNav, 2500);
        }
    };

    script();
});
