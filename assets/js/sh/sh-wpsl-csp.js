/**
 * sh-wpsl-csp.js
 * CSP-safe Underscore template patch for WP Store Locator (WPSL)
 * - Removes unsafe-eval requirement by replacing _.template ONLY for WPSL templates
 * - Supports:
 *   - <%= var %>
 *   - <%- var %>
 *   - <%= fn() %>
 *   - <%= fn(var) %>
 *   - <% if ( var ) { %> ... <% } %>
 */

(function () {

  const escapeHtml = (val) => {
    const s = String(val ?? "");
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const getVar = (data, path) => {
    const parts = String(path || "").trim().split(".");
    let cur = data;
    for (const p of parts) {
      if (!p) return "";
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
        cur = cur[p];
      } else {
        return "";
      }
    }
    return cur;
  };

  const evalSimpleCondition = (cond, data) => {
    const c = String(cond || "").trim();
    if (!c) return false;

    const negate = c[0] === "!";
    const name = negate ? c.slice(1).trim() : c;

    const v = getVar(data, name);
    const truthy = !!v;

    return negate ? !truthy : truthy;
  };

  const parseArgs = (rawArgs, data) => {
    const raw = String(rawArgs || "").trim();
    if (!raw) return [];

    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((token) => {
        if (/^-?\d+(\.\d+)?$/.test(token)) return Number(token);
        if (token === "true") return true;
        if (token === "false") return false;
        if (token === "null") return null;

        const m = token.match(/^(['"])(.*)\1$/);
        if (m) return m[2];

        return getVar(data, token);
      });
  };

  const callFn = (data, fnName, rawArgs) => {
    const fn =
      (data && typeof data[fnName] === "function" && data[fnName]) ||
      (typeof window[fnName] === "function" && window[fnName]) ||
      null;

    if (!fn) return "";

    try {
      const args = parseArgs(rawArgs, data);
      const res = fn.apply(data || window, args);
      return res == null ? "" : String(res);
    } catch (e) {
      return "";
    }
  };

  const compileSafe = (tpl) => {
    const tokenRe = /(<%[\s\S]*?%>)/g;
    const parts = String(tpl).split(tokenRe).filter(Boolean);

    return function render(data) {
      let html = "";
      const ifStack = [];

      const isAllowed = () => ifStack.every((x) => x.active);

      for (const raw of parts) {

        if (!raw.startsWith("<%")) {
          if (isAllowed()) html += raw;
          continue;
        }

        // <%= ... %>
        if (raw.startsWith("<%=")) {
          if (!isAllowed()) continue;

          const expr = raw.slice(3, -2).trim();
          const fnCall = expr.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\(\s*([\s\S]*?)\s*\)$/);

          if (fnCall) {
            html += callFn(data, fnCall[1], fnCall[2]);
            continue;
          }

          const v = getVar(data, expr);
          html += String(v ?? "");
          continue;
        }

        // <%- ... %>
        if (raw.startsWith("<%-")) {
          if (!isAllowed()) continue;

          const expr = raw.slice(3, -2).trim();
          const fnCall = expr.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\(\s*([\s\S]*?)\s*\)$/);

          if (fnCall) {
            html += escapeHtml(callFn(data, fnCall[1], fnCall[2]));
            continue;
          }

          const v = getVar(data, expr);
          html += escapeHtml(v);
          continue;
        }

        // <% if (...) { %>
        const code = raw.slice(2, -2).trim();

        const ifMatch = code.match(
          /^if\s*\(\s*(!?\s*[A-Za-z_$][A-Za-z0-9_$]*(?:\.[A-Za-z_$][A-Za-z0-9_$]*)*)\s*\)\s*\{\s*$/
        );

        if (ifMatch) {
          const cond = ifMatch[1].replace(/\s+/g, "");
          ifStack.push({ active: evalSimpleCondition(cond, data) });
          continue;
        }

        if (/^\}\s*$/.test(code)) {
          ifStack.pop();
          continue;
        }
      }

      // ==========================
      // REMOVE DUPLICATE TITLE
      // ==========================
      try {
        html = html.replace(
          /(<strong>\s*<a\b[^>]*>\s*([\s\S]*?)\s*<\/a>\s*<\/strong>)\s*<strong>\s*\2\s*<\/strong>/i,
          "$1"
        );
      } catch (e) {}

      return html;
    };
  };

  const looksLikeWpslTemplate = (tplStr) => {
    if (!tplStr) return false;
    const s = String(tplStr);
    return (
      /createDirectionUrl\s*\(/.test(s) ||
      /wpsl-store-location/.test(s) ||
      /wpsl-info-window/.test(s) ||
      /data-store-id/.test(s) ||
      /wpsl-store-details/.test(s)
    );
  };

  const patchUnderscore = () => {
    if (!window._ || typeof window._.template !== "function") return false;
    if (window._.__shWpslPatched) return true;

    const original = window._.template;

    window._.template = function (tpl) {
      if (looksLikeWpslTemplate(tpl)) {
        const render = compileSafe(String(tpl));
        const fn = function (data) {
          return render(data || {});
        };
        fn.source = "/* CSP-safe compiled template (sh-wpsl-csp) */";
        return fn;
      }
      return original.apply(this, arguments);
    };

    window._.__shWpslPatched = true;
    return true;
  };

  patchUnderscore();

})();