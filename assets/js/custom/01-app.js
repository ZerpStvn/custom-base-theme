(function(w) { 
	'use strict'; 
    var $ = jQuery.noConflict();
    var app = {
        init: function() {
            if (this.initialized) return;
            this.initialized = true;
            for (var obj in this) this[obj].hasOwnProperty("init") && this[obj]["init"](this);
            app.readyCallbacks.fire()
        },
        readyCallbacks: $.Callbacks(),
        ready: function(callback) {
            app.readyCallbacks.add(callback);
        },
        load: function() {
            app.loadCallbacks.fire()
        },
        loadCallbacks: $.Callbacks(),
        onLoad: function(callback) {
            app.loadCallbacks.add(callback) 
        }
    }
    w.app = app;
})(window);

