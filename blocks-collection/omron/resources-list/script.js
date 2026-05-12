typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();

    function resourcesList() {
        const el = $("section.resources-list");
        if (!el.length) return;

        const baseVisibleCount = 10;

        el.each(function () {
            const self = $(this);

            const searchItems = self.find(".res-card");
            if (!searchItems.length) return;

            let activeCategories = [];
            let activeSubcategories = [];

            let activeVisibleCount = baseVisibleCount;

            const searchInput = self.find(".search input");
            const filterGroups = self.find(".res-group");
            const filterItems = self.find(".res-filter input[type='checkbox']");

            const emptyState = self.find(".empty");
            const loadMoreState = self.find(".load-more");
            const clearAll = self.find(".clear-all");

            const dialog = self.find("dialog");
            const dialogTrigger = self.find(".dialog-trigger");
            const dialogClose = self.find(".dialog-close");

            refreshVisibleItems(searchItems, activeVisibleCount, loadMoreState, emptyState);

            loadMoreState.click(function () {
                activeVisibleCount += baseVisibleCount;
                refreshVisibleItems(searchItems.filter(".in-filter"), activeVisibleCount, loadMoreState, emptyState);
            });

            clearAll.click(function () {
                filterItems.prop('checked', false);
                activeCategories = [];
                activeSubcategories = [];
                searchItems.addClass("in-filter");
                refreshVisibleItems(searchItems, baseVisibleCount, loadMoreState, emptyState);
            });

            if (!filterItems.length || !filterGroups.length) return;
            accordionEvent(filterGroups);

            filterItems.change(function () {
                const subSelf = $(this);

                const value = subSelf.val();
                const type = subSelf.attr('name');
                const isChecked = subSelf.prop('checked');
                searchInput.val('');

                if (isChecked) {
                    if (type === "category") {
                        activeCategories.push(value);
                    } else {
                        activeSubcategories.push(value);
                    }
                } else {
                    if (type === "category") {
                        activeCategories = $.grep(activeCategories, function (x) {
                            return x !== value;
                        });
                    } else {
                        activeSubcategories = $.grep(activeSubcategories, function (x) {
                            return x !== value;
                        });
                    }
                }

                if (activeCategories.length === 0 && activeSubcategories.length === 0) {
                    clearAll.click();
                } else {
                    refreshSearch(searchItems, activeCategories, activeSubcategories, baseVisibleCount, loadMoreState, emptyState);
                }
            });

            searchInput.on("keyup", function (e) {
                let searchInput = $(this).val().toLowerCase();

                if (e.which === 13) {
                    e.preventDefault();
                    searchItems.removeClass("in-filter active");

                    if (searchInput) {
                        self.find("input[type='checkbox']").prop('checked', false);

                        searchItems.each(function () {
                            const subSelf = $(this);
                            const title = subSelf.find(".main-title").text().toLowerCase();

                            if (title.includes(searchInput)) {
                                subSelf.addClass("in-filter");
                            }
                        });

                        refreshVisibleItems(searchItems.filter(".in-filter"), baseVisibleCount, loadMoreState, emptyState)
                    } else {
                        clearAll.trigger("click");
                    }
                }
            });

            dialogTrigger.click(function () {
                dialog[0].showModal();
                dialog.scrollTop(0);
                dialog.find('.dialog-body').scrollTop(0);
            });

            dialogClose.click(function () {
                dialog[0].close();
            });

            const mm = gsap.matchMedia();

            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop) {
                    dialogClose.trigger("click");
                }

                return () => { }
            });
        });
    }

    const accordionEvent = (items) => {
        if (!items.length) return;

        items.each(function () {
            const subSelf = $(this);
            const head = subSelf.find(".res-head");

            head.click(function () {
                subSelf.toggleClass("active");
                ScrollTrigger.refresh();
            });
        })
    };

    const refreshSearch = (items, activeCategories, activeSubcategories, baseVisibleCount, loadMoreState, emptyState) => {
        items.removeClass("active in-filter");

        items.each(function () {
            const self = $(this);

            const categoryRaw = self.data("category");
            const categoryArray = Object.values(JSON.parse(JSON.stringify(categoryRaw)));

            const subcategoryRaw = self.data("sub-category");
            const subcategoryArray = Object.values(JSON.parse(JSON.stringify(subcategoryRaw)));

            if (categoryArray.some(item => activeCategories.includes(item)) || subcategoryArray.some(item => activeSubcategories.includes(item))) {
                self.addClass("in-filter");
            }
        });

        refreshVisibleItems(items.filter(".in-filter"), baseVisibleCount, loadMoreState, emptyState);
    }

    function refreshVisibleItems(items, count, loadMoreState, emptyState) {
        emptyState.hide();

        if (items.length) {
            items.removeClass("active");
            items.slice(0, count).addClass("active");

            if (count >= items.length) {
                loadMoreState.removeClass("active");
            } else {
                loadMoreState.addClass("active");
            }
        } else {
            loadMoreState.removeClass("active");
            emptyState.show();
        }

        ScrollTrigger.refresh();
    }

    resourcesList();
});
