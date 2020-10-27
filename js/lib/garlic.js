!function (t) {
  "use strict";
  var e = function (t) {
    this.defined = "undefined" != typeof localStorage;
    var e = "garlic:" + document.domain + ">test";
    try {localStorage.setItem(e, e), localStorage.removeItem(e);} catch (t) {this.defined = !1;}
  };
  e.prototype = {
    constructor: e,
    get: function (t, e) {
      var i = localStorage.getItem(t);
      if (i) {
        try {i = JSON.parse(i);} catch (t) {}
        return i;
      }
      return void 0 !== e ? e : null;
    },
    has: function (t) {return !!localStorage.getItem(t);},
    set: function (t, e, i) {return "" === e || e instanceof Array && 0 === e.length ? this.destroy(t) : (e = JSON.stringify(e), localStorage.setItem(t, e)), "function" != typeof i || i();},
    destroy: function (t, e) {return localStorage.removeItem(t), "function" != typeof e || e();},
    clean: function (t) {
      for (var e = localStorage.length - 1; e >= 0; e--) void 0 === Array.indexOf && -1 !== localStorage.key(e).indexOf("garlic:") && localStorage.removeItem(localStorage.key(e));
      return "function" != typeof t || t();
    },
    clear: function (t) {return localStorage.clear(), "function" != typeof t || t();}
  };
  var i = function (t, e, i) {this.init("garlic", t, e, i);};
  i.prototype = {
    constructor: i,
    init: function (e, i, n, s) {this.type = e, this.$element = t(i), this.options = this.getOptions(s), this.storage = n, this.path = this.options.getPath(this.$element) || this.getPath(), this.parentForm = this.$element.closest("form"), this.$element.addClass("garlic-auto-save"), this.expiresFlag = !!this.options.expires && (this.$element.data("expires") ? this.path : this.getPath(this.parentForm)) + "_flag", this.$element.on(this.options.events.join("." + this.type + " "), !1, t.proxy(this.persist, this)), this.options.destroy && t(this.parentForm).on("submit reset", !1, t.proxy(this.destroy, this)), this.retrieve();},
    getOptions: function (e) {return t.extend({}, t.fn[this.type].defaults, e, this.$element.data());},
    persist: function () {
      if (this.val !== this.getVal()) {
        this.val = this.getVal(), this.options.expires && this.storage.set(this.expiresFlag, ((new Date).getTime() + 1e3 * this.options.expires).toString());
        var t = this.options.prePersist(this.$element, this.val);
        "string" == typeof t && (this.val = t), this.storage.set(this.path, this.val), this.options.onPersist(this.$element, this.val);
      }
    },
    getVal: function () {return this.$element.is("input[type=checkbox]") ? this.$element.prop("checked") ? "checked" : "unchecked" : this.$element.val();},
    retrieve: function () {
      if (this.storage.has(this.path)) {
        if (this.options.expires) {
          var t = (new Date).getTime();
          if (this.storage.get(this.expiresFlag) < t.toString()) return void this.storage.destroy(this.path);
          this.$element.attr("expires-in", Math.floor((parseInt(this.storage.get(this.expiresFlag)) - t) / 1e3));
        }
        var e = this.$element.val(), i = this.storage.get(this.path);
        if ("boolean" == typeof (i = this.options.preRetrieve(this.$element, e, i)) && 0 == i) return;
        return this.options.conflictManager.enabled && this.detectConflict() ? this.conflictManager() : this.$element.is("input[type=radio], input[type=checkbox]") ? "checked" === i || this.$element.val() === i ? this.$element.prop("checked", !0) : void ("unchecked" === i && this.$element.prop("checked", !1)) : (this.$element.val(i), this.$element.trigger("input"), void this.options.onRetrieve(this.$element, i));
      }
    },
    detectConflict: function () {
      var e = this;
      if (this.$element.is("input[type=checkbox], input[type=radio]")) return !1;
      if (this.$element.val() && this.storage.get(this.path) !== this.$element.val()) {
        if (this.$element.is("select")) {
          var i = !1;
          return this.$element.find("option").each(function () {0 !== t(this).index() && t(this).attr("selected") && t(this).val() !== e.storage.get(this.path) && (i = !0);}), i;
        }
        return !0;
      }
      return !1;
    },
    conflictManager: function () {
      if ("function" == typeof this.options.conflictManager.onConflictDetected && !this.options.conflictManager.onConflictDetected(this.$element, this.storage.get(this.path))) return !1;
      this.options.conflictManager.garlicPriority ? (this.$element.data("swap-data", this.$element.val()), this.$element.data("swap-state", "garlic"), this.$element.val(this.storage.get(this.path))) : (this.$element.data("swap-data", this.storage.get(this.path)), this.$element.data("swap-state", "default")), this.swapHandler(), this.$element.addClass("garlic-conflict-detected"), this.$element.closest("input[type=submit]").attr("disabled", !0);
    },
    swapHandler: function () {
      var e = t(this.options.conflictManager.template);
      this.$element.after(e.text(this.options.conflictManager.message)), e.on("click", !1, t.proxy(this.swap, this));
    },
    swap: function () {
      var e = this.$element.data("swap-data");
      this.$element.data("swap-state", "garlic" === this.$element.data("swap-state") ? "default" : "garlic"), this.$element.data("swap-data", this.$element.val()), t(this.$element).val(e), this.options.onSwap(this.$element, this.$element.data("swap-data"), e);
    },
    destroy: function () {this.storage.destroy(this.path);},
    remove: function () {this.destroy(), this.$element.is("input[type=radio], input[type=checkbox]") ? t(this.$element).attr("checked", !1) : this.$element.val("");},
    getPath: function (e) {
      if (void 0 === e && (e = this.$element), this.options.getPath(e)) return this.options.getPath(e);
      if (1 != e.length) return !1;
      for (var i = "", n = e.is("input[type=checkbox]"), s = e; s.length;) {
        var a = s[0], o = a.nodeName;
        if (!o) break;
        o = o.toLowerCase();
        var r = s.parent(), h = r.children(o);
        if (t(a).is("form, input, select, textarea") || n) {
          if (o += t(a).attr("name") ? "." + t(a).attr("name") : "", h.length > 1 && !t(a).is("input[type=radio]") && (o += ":eq(" + h.index(a) + ")"), i = o + (i ? ">" + i : ""), "form" == a.nodeName.toLowerCase()) break;
          s = r;
        } else s = r;
      }
      return "garlic:" + document.domain + (this.options.domain ? "*" : window.location.pathname) + ">" + i;
    },
    getStorage: function () {return this.storage;}
  }, t.fn.garlic = function (n, s) {
    var a = t.extend(!0, {}, t.fn.garlic.defaults, n, this.data()), o = new e, r = !1;
    if (!o.defined) return !1;

    function h(e) {
      var s = t(e), r = s.data("garlic"), h = t.extend({}, a, s.data());
      if ((void 0 === h.storage || h.storage) && "password" !== t(e).attr("type")) return r || s.data("garlic", r = new i(e, o, h)), "string" == typeof n && "function" == typeof r[n] ? r[n]() : void 0;
    }

    return this.each(function () {
      if (t(this).is("form")) t(this).find(a.inputs).each(function () {t(this).is(a.excluded) || (r = h(t(this)));}); else if (t(this).is(a.inputs)) {
        if (t(this).is(a.excluded)) return;
        r = h(t(this));
      }
    }), "function" == typeof s ? s() : r;
  }, t.fn.garlic.Constructor = i, t.fn.garlic.defaults = {
    destroy: !0,
    inputs: "input, textarea, select",
    excluded: 'input[type="file"], input[type="hidden"], input[type="submit"], input[type="reset"]',
    events: ["DOMAttrModified", "textInput", "input", "change", "click", "keypress", "paste", "focus"],
    domain: !1,
    expires: !1,
    conflictManager: {
      enabled: !1,
      garlicPriority: !0,
      template: '<span class="garlic-swap"></span>',
      message: "This is your saved data. Click here to see default one",
      onConflictDetected: function (t, e) {return !0;}
    },
    getPath: function (t) {},
    preRetrieve: function (t, e, i) {return i;},
    onRetrieve: function (t, e) {},
    prePersist: function (t, e) {return !1;},
    onPersist: function (t, e) {},
    onSwap: function (t, e, i) {}
  }, t(window).on("load", function () {t('[data-persist="garlic"]').each(function () {t(this).garlic();});});
}(window.jQuery || window.Zepto);
