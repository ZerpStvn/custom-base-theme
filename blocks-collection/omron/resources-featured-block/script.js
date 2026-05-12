typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();
    
    function carousel() {
        const els = $("section.resources-featured-block");
        if (!els.length) return;

        let mm = window.matchMedia("(max-width: 767px)");

        els.each(function () {
            const self = $(this);
            const items = self.find('.item');

            let heading = self.find(".main-title .inner-word");

            app.Animation.prototype.headingAnimation(heading, {
                trigger: self,
                start: "top 60%"
            });

            if (items.length) {
                items.each(function() {
                    const subSelf = $(this);
                    const contentArea = subSelf.find(".item-content");

                    contentArea.hover(
                        function () {
                            if (subSelf.hasClass("active")) return;
    
                            items.removeClass("active");
                            subSelf.addClass("active");
    
                            if (mm.matches) {
                                setTimeout(() => {
                                    subSelf.get(0).scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start'
                                    });
                                }, 300);
                            }
                        }, function () {
                            return;
                        }
                    );
                })
            }
        });
    }

    carousel();
});
