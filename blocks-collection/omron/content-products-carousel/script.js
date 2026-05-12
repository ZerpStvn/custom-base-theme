typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();
    
    function carousel() {
        const els = $("section.content-products-carousel");
        if (!els.length) return;

        const itemAnimation = (targetItem, items) => {
            if (targetItem.length) {
                items.removeClass("active");
                targetItem.addClass("active");

                app.Animation.prototype.headingAnimation(targetItem.find("h4 .inner-word"), null, { delay: 0.3 });
            }
        }

        els.each(function () {
            const self = $(this);

            let items = self.find(".item");
            let itemCount = items.length;

            let heading = self.find(".main-title .inner-word");

            app.Animation.prototype.headingAnimation(heading, {
                trigger: self,
                start: "top 60%"
            });

            app.Animation.prototype.headingAnimation(items.first().find("h4 .inner-word"));

            if (itemCount > 1) {
                let arrowIndex = 0;

                const arrowContainer = self.find(".arrows");
                arrowContainer.addClass("active");

                const arrowLeft = self.find(".ar-l");
                const arrowRight = self.find(".ar-r");

                arrowRight.click(function () {
                    if (arrowIndex + 1 < itemCount) {
                        arrowIndex++;
                    } else {
                        arrowIndex = 0;
                    }

                    let targetItem = self.find(`.item[data-index="${arrowIndex}"]`);
                    itemAnimation(targetItem, items);
                });

                arrowLeft.click(function () {
                    if (arrowIndex - 1 >= 0) {
                        arrowIndex--;
                    } else {
                        arrowIndex = itemCount - 1;
                    }

                    let targetItem = self.find(`.item[data-index="${arrowIndex}"]`);
                    itemAnimation(targetItem, items);
                })
            }

            app.Animation.prototype.orbAnimation(self.find(".box"), self.find(".orb"));

            const mm = gsap.matchMedia();
            const parallaxEl = self.find(".parallax");
            
            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop) {
                    app.smoother && app.smoother.effects(parallaxEl, { speed: 'clamp(0.94)' });
                }

                if (isMobile) {
                    app.smoother && app.smoother.effects(parallaxEl, { speed: 1 });
                }

                return () => { }
            });
        });
    }

    carousel();
});
