typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();

    function resourcesGrid() {
        const el = $("section.resources-grid");
        if (!el.length) return;

        const baseVisibleCount = 12;

        el.each(function () {
            const self = $(this);

            const searchItems = self.find(".blog-item");
            if (!searchItems.length) return;

            const emptyState = self.find(".empty");
            const loadMoreState = self.find(".load-more");
            const mobileSelect = self.find("select");

            let activeVisibleCount = baseVisibleCount;
            refreshVisibleItems(searchItems, activeVisibleCount, loadMoreState, emptyState);

            mobileSelect.selectmenu({
                open: function (event, ui) {
                    app.Global.prototype.updateSelectClass($(this));
                },
                change: function (event, data) {
                    const target = self.find(`.cat-btn[data-category="${data.item.value}"]`);
                    activeVisibleCount = baseVisibleCount;
                    
                    filterEvent(target, filters, searchItems, baseVisibleCount, loadMoreState, emptyState);
                },
                position: {
                    my: "left top",
                    at: "left bottom",
                    collision: "none",
                },
            });
            
            loadMoreState.click(function () {
                activeVisibleCount += baseVisibleCount;
                refreshVisibleItems(searchItems.filter(".in-filter"), activeVisibleCount, loadMoreState, emptyState);
            });

            const filters = self.find(".cat-btn");
            if (!filters.length) return;

            filters.click(function () {
                const subSelf = $(this);
                if (subSelf.hasClass("active")) return;

                activeVisibleCount = baseVisibleCount;
                filterEvent(subSelf, filters, searchItems, baseVisibleCount, loadMoreState, emptyState, true, mobileSelect);
            });
        });
    }

    function filterEvent(subSelf, filters, searchItems, baseVisibleCount, loadMoreState, emptyState, updateSelect = false, select = null) {
        filters.removeClass("active");
        subSelf.addClass("active");

        const category = subSelf.data('category');

        if (category == 'show-all') {
            searchItems.addClass("in-filter");
            refreshVisibleItems(searchItems, baseVisibleCount, loadMoreState, emptyState);
        } else {
            refreshSearch(searchItems, category, baseVisibleCount, loadMoreState, emptyState);
        }

        if (updateSelect) {
            select.val(category);
            select.selectmenu("refresh");
        }
    }

    function refreshSearch(items, category, baseVisibleCount, loadMoreState, emptyState) {
        items.removeClass("active in-filter");

        items.each(function () {
            const self = $(this);
            const categoryRaw = self.data("category");
            const categoryArray = Object.values(JSON.parse(JSON.stringify(categoryRaw)));

            if (categoryArray.includes(category)) {
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

    resourcesGrid();
});
