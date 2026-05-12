(function (app) {
    "use strict";
    var $ = jQuery.noConflict();
    var Global = function () { };

    Global.prototype.init = function () {
        Global.prototype.handleDownloadLinks();
        Global.prototype.initFormModal();
        Global.prototype.initAnchorScroll();
    };

    Global.prototype.refreshScrollTriggers = function () {
        const triggers = ScrollTrigger.getAll();

        triggers.forEach((trigger) => {
            if (trigger.vars.id == 'nav-bg-scroll' || trigger.vars.id == 'nav-bg-hide') return;
            trigger.refresh(true);
        });
    };
    
    Global.prototype.initFormModal = function () {
        const modal = document.getElementById('form-modal');
        if (!modal) return;

        // Open on any link with href="#form-modal"
        $(document).on('click', 'a[href="#form-modal"]', function (e) {
            e.preventDefault();
            modal.showModal();
        });

        // Close on backdrop click
        $(modal).on('click', function (e) {
            if (e.target === modal) modal.close();
        });

        // Close button
        $(modal).find('.form-modal__close').on('click', function () {
            modal.close();
        });
    };

    Global.prototype.initAnchorScroll = function () {
        $(document).on('click', 'a[href^="#"]', function (e) {
            const href = $(this).attr('href');

            // Skip reserved anchors
            if (href === '#' || href === '#form-modal') return;

            const target = document.getElementById(href.slice(1));
            if (!target) return;

            e.preventDefault();

            const navHeight = $('.nav').outerHeight(true) || 0;
            const offset = target.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    };

    Global.prototype.handleDownloadLinks = function () {
        const links = $(`a[href^="download:"]`);
        if (!links.length) return;

        links.each(function () {
            const self = $(this);
            const href = self.attr('href');
            self.attr('href', href.replace('download:', ''));
            self.attr('download', '');
        });
    };

    Global.prototype.updateSelectClass = function (target) {
        const parent = target.selectmenu("menuWidget");
        parent.find(".selected").removeClass("selected");
        
        const activeItem = parent.find(".ui-state-active");
        activeItem.addClass("selected");
    };

    app.Global = Global;

    app.ready(function () {
        // console.log("Global ->");
        Global.prototype.init();
    });
})(window.app);
