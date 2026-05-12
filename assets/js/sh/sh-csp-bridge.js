/* ==========================================================
   CSP BRIDGE + ALPINE RUNTIME
   Strict CSP compatible.
   Handles dynamic script injection + Alpine x-data bridge.
========================================================== */

(function () {
  "use strict";

  /* ==========================================================
     1) NONCE PROPAGATION (HubSpot / dynamic scripts safe)
  ========================================================== */

  var currentScript = document.currentScript;
  var nonce =
    (currentScript &&
      (currentScript.nonce || currentScript.getAttribute("nonce"))) ||
    "";

  if (nonce) {
    window.__CSP_NONCE__ = nonce;
  }

  function applyNonce(node) {
    if (!node || !nonce) return;
    if (node.tagName && node.tagName.toLowerCase() === "script") {
      if (!node.nonce && !node.getAttribute("nonce")) {
        node.setAttribute("nonce", nonce);
        node.nonce = nonce;
      }
    }
  }

  var originalAppend = Node.prototype.appendChild;
  Node.prototype.appendChild = function (node) {
    applyNonce(node);
    return originalAppend.call(this, node);
  };

  var originalInsert = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (node, ref) {
    applyNonce(node);
    return originalInsert.call(this, node, ref);
  };

  var originalReplace = Node.prototype.replaceChild;
  Node.prototype.replaceChild = function (node, oldNode) {
    applyNonce(node);
    return originalReplace.call(this, node, oldNode);
  };

  var originalCreate = Document.prototype.createElement;
  Document.prototype.createElement = function (tag, options) {
    var el = originalCreate.call(this, tag, options);
    if (String(tag).toLowerCase() === "script") {
      applyNonce(el);
    }
    return el;
  };

  /* ==========================================================
     2) ALPINE __csp BRIDGE
  ========================================================== */

  function parseArgs(raw) {
    if (!raw) return [];
    return String(raw)
      .split(",")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean)
      .map(function (token) {
        if (/^-?\d+(\.\d+)?$/.test(token)) return Number(token);
        if (token === "true") return true;
        if (token === "false") return false;
        if (token === "null") return null;
        var m = token.match(/^(['"])(.*)\1$/);
        if (m) return m[2];
        return token;
      });
  }

  function registerAlpineBridge(Alpine) {
    if (!Alpine || typeof Alpine.data !== "function") return;
    if (Alpine.__cspBridgeRegistered) return;

    Alpine.__cspBridgeRegistered = true;

    Alpine.data("__csp", function () {
      var el = this.$el;
      var fnName = el.getAttribute("data-csp-fn") || "";
      var rawArgs = el.getAttribute("data-csp-args") || "";
      var args = parseArgs(rawArgs);

      var fn =
        fnName && typeof window[fnName] === "function"
          ? window[fnName]
          : null;

      if (!fn) {
        return {}; // graceful fail
      }

      try {
        var result = fn.apply(window, args);
        return result && typeof result === "object" ? result : {};
      } catch (e) {
        return {};
      }
    });
  }

  if (window.Alpine) registerAlpineBridge(window.Alpine);

  document.addEventListener("alpine:init", function () {
    registerAlpineBridge(window.Alpine);
  });

})();

/* ==========================================================
   3)  ACCORDION COMPONENT
   Works with all naming variants across templates
========================================================== */

window.accordion = function accordion(index) {
  return {
    open: false,

    init() {
      // Optional: auto-open first item
      // if (Number(index) === 1) this.open = true;
    },

    toggle() {
      this.open = !this.open;
    },

    handleClick() {
      this.toggle();
    },

    /* -------------------------
       CLASS HELPERS
    -------------------------- */

    handleOpen() {
      return this.open ? "" : "hidden";
    },

    handleClose() {
      return this.open ? "hidden" : "";
    },

    handleToggleTitle() {
      return this.open ? "font-semibold" : "";
    },

    handleRotate() {
      return this.open ? "rotate-180" : "";
    },

    /* -------------------------
       HEIGHT ANIMATION
    -------------------------- */

    handleToggle() {
      var el = this.$refs && this.$refs.tab ? this.$refs.tab : null;
      if (!el) return "";

      return this.open
        ? "max-height: " + el.scrollHeight + "px;"
        : "max-height: 0px;";
    },
  };
};

