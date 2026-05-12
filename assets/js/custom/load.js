jQuery(document).ready(function () {
    window.app.init();
});

jQuery(window).on("load", function () {
    window.app.load();
});

window.resizeTimer;
window.windowWidth = jQuery(window).width();

window.isTouchDevice = () => {
    return window.matchMedia("(pointer: coarse), (hover: none)").matches;
}

window.deviceType = window.isTouchDevice();

window.resizeObserver = () => {
    if (jQuery(window).width() !== window.windowWidth) {
        if (window.deviceType != window.isTouchDevice()) {
            window.location.reload();
        } else {
            window.windowWidth = jQuery(window).width();
            clearTimeout(window.resizeTimer);
            window.scrollTo(0, 0);
        }
    }
};

jQuery(window).on("resize", function () {
    window.resizeObserver();
});