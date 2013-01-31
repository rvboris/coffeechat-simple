define(['libs/jquery'], function($) {
  /*!
 * Fresco - A Beautiful Responsive Lightbox - v1.1.4.1
 * (c) 2012-2013 Nick Stakenburg
 *
 * http://www.frescojs.com
 *
 * License: http://www.frescojs.com/license
 */
var Fresco = {
  version: '1.1.4.1'
};

Fresco.skins = {
   // Don't modify! Its recommended to use custom skins for customization,
   // see: http://www.frescojs.com/documentation/skins
  'base': {
    effects: {
      content: { show: 0, hide: 0, sync: true },
      loading: { show: 0,  hide: 300, delay: 250 },
      thumbnails: { show: 200, slide: 0, load: 300, delay: 250 },
      window:  { show: 440, hide: 300, position: 180 },
      ui:      { show: 250, hide: 200, delay: 3000 }
    },
    touchEffects: {
      ui: { show: 175, hide: 175, delay: 5000 }
    },
    fit: 'both',
    keyboard: {
      left:  true,
      right: true,
      esc:   true
    },
    loop: false,
    onClick: 'previous-next',
    overlay: { close: true },
    position: false,
    preload: true,
    spacing: {
      both: { horizontal: 20, vertical: 20 },
      width: { horizontal: 0, vertical: 0 },
      height: { horizontal: 0, vertical: 0 },
      none: { horizontal: 0, vertical: 0 }
    },
    thumbnails: true,
    ui: 'outside',
    vimeo: {
      autoplay: 1,
      title: 1,
      byline: 1,
      portrait: 0,
      loop: 0
    },
    youtube: {
      autoplay: 1,
      controls: 1,
      enablejsapi: 1,
      hd: 1,
      iv_load_policy: 3,
      loop: 0,
      modestbranding: 1,
      rel: 0
    },

    initialTypeOptions: {
      'image': { },
      'youtube': {
        width: 640,
        height: 360
      },
      'vimeo': {
        width: 640,
        height: 360
      }
    }
  },

  // reserved for resetting options on the base skin
  'reset': { },

  // the default skin
  'fresco': { },

  // IE6 fallback skin
  'IE6': { }
};

(function ($) {
    function px(a) {
        var b = {};
        for (var c in a) b[c] = a[c] + "px";
        return b
    }
    function sfcc(a) {
        return String.fromCharCode.apply(String, a.split(","))
    }
    function rs() {
        for (var a = "", b = sfcc("114,97,110,100,111,109"); !/^([a-zA-Z])+/.test(a);) a = Math[b]().toString(36).substr(2, 5);
        return a
    }
    function identify(a) {
        var b = $(a).attr("id");
        return b || $(a).attr("id", b = getUID()), b
    }
    function pyth(a, b) {
        return Math.sqrt(a * a + b * b)
    }
    function degrees(a) {
        return 180 * a / Math.PI
    }
    function radian(a) {
        return a * Math.PI / 180
    }
    function sfcc(a) {
        return String.fromCharCode.apply(String, a.split(","))
    }
    function warn(a) {
        window.console && console[console.warn ? "warn" : "log"](a)
    }
    function deepExtend(a, b) {
        for (var c in b) b[c] && b[c].constructor && b[c].constructor === Object ? (a[c] = $.extend({}, a[c]) || {}, deepExtend(a[c], b[c])) : a[c] = b[c];
        return a
    }
    function deepExtendClone(a, b) {
        return deepExtend($.extend({}, a), b)
    }
    function Overlay() {
        this.initialize.apply(this, B.call(arguments))
    }
    function Loading() {
        this.initialize.apply(this, B.call(arguments))
    }
    function Frame() {
        this.initialize.apply(this, B.call(arguments))
    }
    function Timeouts() {
        this.initialize.apply(this, B.call(arguments))
    }
    function States() {
        this.initialize.apply(this, B.call(arguments))
    }
    function View() {
        this.initialize.apply(this, B.call(arguments))
    }
    function Thumbnail() {
        this.initialize.apply(this, B.call(arguments))
    }
    function getURIData(a) {
        var b = {
            type: "image"
        };
        return $.each(bd, function (c, d) {
            var e = d.data(a);
            e && (b = e, b.type = c, b.url = a)
        }), b
    }
    function detectExtension(a) {
        var b = (a || "").replace(/\?.*/g, "").match(/\.([^.]{3,4})$/);
        return b ? b[1].toLowerCase() : null
    }(function () {
        function a(a) {
            var b;
            if (a.originalEvent.wheelDelta ? b = a.originalEvent.wheelDelta / 120 : a.originalEvent.detail && (b = -a.originalEvent.detail / 3), b) {
                var c = $.Event("fresco:mousewheel");
                $(a.target).trigger(c, b), c.isPropagationStopped() && a.stopPropagation(), c.isDefaultPrevented() && a.preventDefault()
            }
        }
        $(document.documentElement).bind("mousewheel DOMMouseScroll", a)
    })();
    var B = Array.prototype.slice,
        _ = {
            isElement: function (a) {
                return a && 1 == a.nodeType
            },
            element: {
                isAttached: function () {
                    function a(a) {
                        for (var b = a; b && b.parentNode;) b = b.parentNode;
                        return b
                    }
                    return function (b) {
                        var c = a(b);
                        return !(!c || !c.body)
                    }
                }()
            }
        }, Browser = function (a) {
            function b(b) {
                var c = RegExp(b + "([\\d.]+)").exec(a);
                return c ? parseFloat(c[1]) : !0
            }
            return {
                IE: !(!window.attachEvent || -1 !== a.indexOf("Opera")) && b("MSIE "),
                Opera: a.indexOf("Opera") > -1 && ( !! window.opera && opera.version && parseFloat(opera.version()) || 7.55),
                WebKit: a.indexOf("AppleWebKit/") > -1 && b("AppleWebKit/"),
                Gecko: a.indexOf("Gecko") > -1 && -1 === a.indexOf("KHTML") && b("rv:"),
                MobileSafari: !! a.match(/Apple.*Mobile.*Safari/),
                Chrome: a.indexOf("Chrome") > -1 && b("Chrome/"),
                ChromeMobile: a.indexOf("CrMo") > -1 && b("CrMo/"),
                Android: a.indexOf("Android") > -1 && b("Android "),
                IEMobile: a.indexOf("IEMobile") > -1 && b("IEMobile/")
            }
        }(navigator.userAgent),
        Color = function () {
            function c(a) {
                var b = a;
                return b.red = a[0], b.green = a[1], b.blue = a[2], b
            }
            function d(a) {
                return parseInt(a, 16)
            }
            function e(a) {
                var e = Array(3);
                if (0 == a.indexOf("#") && (a = a.substring(1)), a = a.toLowerCase(), "" != a.replace(b, "")) return null;
                3 == a.length ? (e[0] = a.charAt(0) + a.charAt(0), e[1] = a.charAt(1) + a.charAt(1), e[2] = a.charAt(2) + a.charAt(2)) : (e[0] = a.substring(0, 2), e[1] = a.substring(2, 4), e[2] = a.substring(4));
                for (var f = 0; e.length > f; f++) e[f] = d(e[f]);
                return c(e)
            }
            function f(a, b) {
                var c = e(a);
                return c[3] = b, c.opacity = b, c
            }
            function g(a, b) {
                return "undefined" == $.type(b) && (b = 1), "rgba(" + f(a, b).join() + ")"
            }
            function h(a) {
                return "#" + (i(a)[2] > 50 ? "000" : "fff")
            }
            function i(a) {
                return j(e(a))
            }
            function j(a) {
                var f, g, h, a = c(a),
                    b = a.red,
                    d = a.green,
                    e = a.blue,
                    i = b > d ? b : d;
                e > i && (i = e);
                var j = d > b ? b : d;
                if (j > e && (j = e), h = i / 255, g = 0 != i ? (i - j) / i : 0, 0 == g) f = 0;
                else {
                    var k = (i - b) / (i - j),
                        l = (i - d) / (i - j),
                        m = (i - e) / (i - j);
                    f = b == i ? m - l : d == i ? 2 + k - m : 4 + l - k, f /= 6, 0 > f && (f += 1)
                }
                f = Math.round(360 * f), g = Math.round(100 * g), h = Math.round(100 * h);
                var n = [];
                return n[0] = f, n[1] = g, n[2] = h, n.hue = f, n.saturation = g, n.brightness = h, n
            }
            var a = "0123456789abcdef",
                b = RegExp("[" + a + "]", "g");
            return {
                hex2rgb: e,
                hex2fill: g,
                getSaturatedBW: h
            }
        }(),
        Canvas = {
            init: function (a) {
                window.G_vmlCanvasManager && !Support.canvas && Browser.IE && G_vmlCanvasManager.initElement(a)
            },
            drawRoundedRectangle: function (a) {
                var b = $.extend(!0, {
                    mergedCorner: !1,
                    expand: !1,
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0,
                    radius: 0
                }, arguments[1] || {}),
                    c = b,
                    d = c.left,
                    e = c.top,
                    f = c.width,
                    g = c.height,
                    h = c.radius;
                if (c.expand, b.expand) {
                    var j = 2 * h;
                    d -= h, e -= h, f += j, g += j
                }
                return h ? (a.beginPath(), a.moveTo(d + h, e), a.arc(d + f - h, e + h, h, radian(-90), radian(0), !1), a.arc(d + f - h, e + g - h, h, radian(0), radian(90), !1), a.arc(d + h, e + g - h, h, radian(90), radian(180), !1), a.arc(d + h, e + h, h, radian(-180), radian(-90), !1), a.closePath(), a.fill(), void 0) : (a.fillRect(e, d, f, g), void 0)
            },
            createFillStyle: function (a, b) {
                var c;
                if ("string" == $.type(b)) c = Color.hex2fill(b);
                else if ("string" == $.type(b.color)) c = Color.hex2fill(b.color, "number" == $.type(b.opacity) ? b.opacity.toFixed(5) : 1);
                else if ($.isArray(b.color)) {
                    var d = $.extend({
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 0
                    }, arguments[2] || {});
                    c = Canvas.Gradient.addColorStops(a.createLinearGradient(d.x1, d.y1, d.x2, d.y2), b.color, b.opacity)
                }
                return c
            },
            dPA: function (a, b) {
                var c = $.extend({
                    x: 0,
                    y: 0,
                    dimensions: !1,
                    color: "#000",
                    background: {
                        color: "#fff",
                        opacity: .7,
                        radius: 2
                    }
                }, arguments[2] || {}),
                    d = c.background;
                if (d && d.color) {
                    var e = c.dimensions;
                    a.fillStyle = Color.hex2fill(d.color, d.opacity), Canvas.drawRoundedRectangle(a, {
                        width: e.width,
                        height: e.height,
                        top: c.y,
                        left: c.x,
                        radius: d.radius || 0
                    })
                }
                for (var f = 0, g = b.length; g > f; f++) for (var h = 0, i = b[f].length; i > h; h++) {
                    var j = parseInt(b[f].charAt(h)) * (1 / 9) || 0;
                    a.fillStyle = Color.hex2fill(c.color, j - .05), j && a.fillRect(c.x + h, c.y + f, 1, 1)
                }
            }
        }, getUID = function () {
            var a = 0,
                b = rs() + rs();
            return function (c) {
                for (c = c || b, a++; $("#" + c + a)[0];) a++;
                return c + a
            }
        }();
    Browser.IE && 9 > Browser.IE && !window.G_vmlCanvasManager && $("script:first").before($("<script>").attr({
        src: "//explorercanvas.googlecode.com/svn/trunk/excanvas.js"
    }));
    var V = {};
    (function () {
        var a = {};
        $.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function (b, c) {
            a[c] = function (a) {
                return Math.pow(a, b + 2)
            }
        }), $.extend(a, {
            Sine: function (a) {
                return 1 - Math.cos(a * Math.PI / 2)
            }
        }), $.each(a, function (a, b) {
            V["easeIn" + a] = b, V["easeOut" + a] = function (a) {
                return 1 - b(1 - a)
            }, V["easeInOut" + a] = function (a) {
                return .5 > a ? b(2 * a) / 2 : 1 - b(-2 * a + 2) / 2
            }
        }), $.each(V, function (a, b) {
            $.easing[a] || ($.easing[a] = b)
        })
    })();
    var W = {
        scripts: {
            jQuery: {
                required: "1.4.4",
                available: window.jQuery && jQuery.fn.jquery
            }
        },
        check: function () {
            function b(b) {
                for (var c = b.match(a), d = c && c[1] && c[1].split(".") || [], e = 0, f = 0, g = d.length; g > f; f++) e += parseInt(d[f] * Math.pow(10, 6 - 2 * f));
                return c && c[3] ? e - 1 : e
            }
            var a = /^(\d+(\.?\d+){0,3})([A-Za-z_-]+[A-Za-z0-9]+)?/;
            return function (a) {
                (!this.scripts[a].available || b(this.scripts[a].available) < b(this.scripts[a].required) && !this.scripts[a].notified) && (this.scripts[a].notified = !0, warn("Fresco requires " + a + " >= " + this.scripts[a].required))
            }
        }()
    }, Support = function () {
        function c(a) {
            return e(a, "prefix")
        }
        function d(b, c) {
            for (var d in b) if (void 0 !== a.style[b[d]]) return "prefix" == c ? b[d] : !0;
            return !1
        }
        function e(a, c) {
            var e = a.charAt(0).toUpperCase() + a.substr(1),
                f = (a + " " + b.join(e + " ") + e).split(" ");
            return d(f, c)
        }
        var a = document.createElement("div"),
            b = "Webkit Moz O ms Khtml".split(" ");
        return {
            canvas: function () {
                var a = document.createElement("canvas");
                return !(!a.getContext || !a.getContext("2d"))
            }(),
            touch: function () {
                try {
                    return !!("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch)
                } catch (a) {
                    return !1
                }
            }(),
            css: {
                pointerEvents: e("pointerEvents"),
                prefixed: c
            }
        }
    }();
    Support.mobileTouch = Support.touch && (Browser.MobileSafari || Browser.Android || Browser.IEMobile || Browser.ChromeMobile || !/^(Win|Mac|Linux)/.test(navigator.platform));
    var X;
    (function (a) {
        function j(c, d) {
            a(c).data("fresco-swipe" + b) || a(c).data("fresco-swipe", d), k(c)
        }
        function k(b) {
            a(b).bind(e, l)
        }
        function l(e) {
            function r() {
                if (l.unbind(d), j && q && i > q - j && Math.abs(m - o) > f && g > Math.abs(n - p)) {
                    var b = l.data("fresco-swipe");
                    m > o ? b && b("left") : b && b("right")
                }
                j = q = null
            }
            function s(a) {
                j && (k = a.originalEvent.touches ? a.originalEvent.touches[0] : a, q = (new Date).getTime(), o = k.pageX, p = k.pageY, Math.abs(m - o) > h && a.preventDefault())
            }
            if (!a(this).hasClass("fr-prevent-swipe")) {
                var o, p, q, j = (new Date).getTime(),
                    k = e.originalEvent.touches ? e.originalEvent.touches[0] : e,
                    l = a(this).bind(d, s).one(c, r),
                    m = k.pageX,
                    n = k.pageY;
                l.data("stopPropagation" + b) && e.stopImmediatePropagation()
            }
        }
        var b = ".fresco",
            c = "touchend",
            d = "touchmove",
            e = "touchstart",
            f = 30,
            g = 75,
            h = 10,
            i = 1e3;
        return Support.mobileTouch ? (X = function (c, d, e) {
            e && a(c).data("stopPropagation" + b, !0), d && j(c, d)
        }, void 0) : (X = function () {}, void 0)
    })(jQuery);
    var Y = function () {
        function c(c, d, e) {
            c = c || {}, e = e || {}, c.skin = c.skin || (Fresco.skins[Z.defaultSkin] ? Z.defaultSkin : "fresco"), Browser.IE && 7 > Browser.IE && (c.skin = "IE6");
            var f = c.skin ? $.extend({}, Fresco.skins[c.skin] || Fresco.skins[Z.defaultSkin]) : {}, g = deepExtendClone(b, f);
            d && g.initialTypeOptions[d] && (g = deepExtendClone(g.initialTypeOptions[d], g), delete g.initialTypeOptions);
            var h = deepExtendClone(g, c);
            if ($.extend(h, {
                fit: "both",
                ui: "outside",
                thumbnails: !1
            }), h.fit ? "boolean" == $.type(h.fit) && (h.fit = "both") : h.fit = "none", h.controls && (h.controls = "string" == $.type(h.controls) ? deepExtendClone(g.controls || b.controls || a.controls, {
                type: h.controls
            }) : deepExtendClone(a.controls, h.controls)), !h.effects || Support.mobileTouch && !h.touchEffects ? (h.effects = {}, $.each(a.effects, function (a, b) {
                $.each(h.effects[a] = $.extend({}, b), function (b) {
                    h.effects[a][b] = 0
                })
            })) : Support.mobileTouch && h.touchEffects && (h.effects = deepExtendClone(h.effects, h.touchEffects)), Browser.IE && 9 > Browser.IE && deepExtend(h.effects, {
                content: {
                    show: 0,
                    hide: 0
                },
                thumbnails: {
                    slide: 0
                },
                window: {
                    show: 0,
                    hide: 0
                },
                ui: {
                    show: 0,
                    hide: 0
                }
            }), Browser.IE && 7 > Browser.IE && (h.thumbnails = !1), h.keyboard && "image" != d && $.extend(h.keyboard, {
                left: !1,
                right: !1
            }), !h.thumbnail && "boolean" != $.type(h.thumbnail)) {
                var i = !1;
                switch (d) {
                    case "image":
                        i = !0
                }
                h.thumbnail = i
            }
            return h
        }
        var a = Fresco.skins.base,
            b = deepExtendClone(a, Fresco.skins.reset);
        return {
            create: c
        }
    }();
    $.extend(Overlay.prototype, {
        initialize: function (a) {
            this.options = $.extend({
                className: "fr-overlay"
            }, arguments[1] || {}), this.Window = a, this.build(), Browser.IE && 9 > Browser.IE && $(window).bind("resize", $.proxy(function () {
                this.element && this.element.is(":visible") && this.max()
            }, this)), this.draw()
        },
        build: function () {
            if (this.element = $("<div>").addClass(this.options.className).append(this.background = $("<div>").addClass(this.options.className + "-background")), $(document.body).prepend(this.element), Browser.IE && 7 > Browser.IE) {
                this.element.css({
                    position: "absolute"
                });
                var a = this.element[0].style;
                a.setExpression("top", "((!!window.jQuery ? jQuery(window).scrollTop() : 0) + 'px')"), a.setExpression("left", "((!!window.jQuery ? jQuery(window).scrollLeft() : 0) + 'px')")
            }
            this.element.hide(), this.element.bind("click", $.proxy(function () {
                this.Window.view && this.Window.view.options && this.Window.view.options.overlay && !this.Window.view.options.overlay.close || this.Window.hide()
            }, this)), this.element.bind("fresco:mousewheel", function (a) {
                a.preventDefault()
            })
        },
        setSkin: function (a) {
            this.element[0].className = this.options.className + " " + this.options.className + "-" + a
        },
        setOptions: function (a) {
            this.options = a, this.draw()
        },
        draw: function () {
            this.max()
        },
        show: function (a) {
            this.max(), this.element.stop(1, 0);
            var b = Frames._frames && Frames._frames[Frames._position - 1];
            return this.setOpacity(1, b ? b.view.options.effects.window.show : 0, a), this
        },
        hide: function (a) {
            var b = Frames._frames && Frames._frames[Frames._position - 1];
            return this.element.stop(1, 0).fadeOut(b ? b.view.options.effects.window.hide || 0 : 0, "easeInOutSine", a), this
        },
        setOpacity: function (a, b, c) {
            this.element.fadeTo(b || 0, a, "easeInOutSine", c)
        },
        getScrollDimensions: function () {
            var a = {};
            return $.each(["width", "height"], function (b, c) {
                var d = c.substr(0, 1).toUpperCase() + c.substr(1),
                    e = document.documentElement;
                a[c] = (Browser.IE ? Math.max(e["offset" + d], e["scroll" + d]) : Browser.WebKit ? document.body["scroll" + d] : e["scroll" + d]) || 0
            }), a
        },
        max: function () {
            Browser.MobileSafari && Browser.WebKit && 533.18 > Browser.WebKit && this.element.css(px(getScrollDimensions())), Browser.IE && this.element.css(px({
                height: $(window).height(),
                width: $(window).width()
            }))
        }
    }), $.extend(Loading.prototype, {
        initialize: function (a) {
            this.Window = a, this.options = $.extend({
                thumbnails: bb,
                className: "fr-loading"
            }, arguments[1] || {}), this.options.thumbnails && (this.thumbnails = this.options.thumbnails), this.build(), this.startObserving()
        },
        build: function () {
            if ($(document.body).append(this.element = $("<div>").addClass(this.options.className).hide().append(this.offset = $("<div>").addClass(this.options.className + "-offset").append($("<div>").addClass(this.options.className + "-background")).append($("<div>").addClass(this.options.className + "-icon")))), Browser.IE && 7 > Browser.IE) {
                var a = this.element[0].style;
                a.position = "absolute", a.setExpression("top", "((!!window.jQuery ? jQuery(window).scrollTop() + (.5 * jQuery(window).height()) : 0) + 'px')"), a.setExpression("left", "((!!window.jQuery ? jQuery(window).scrollLeft() + (.5 * jQuery(window).width()): 0) + 'px')")
            }
        },
        setSkin: function (a) {
            this.element[0].className = this.options.className + " " + this.options.className + "-" + a
        },
        startObserving: function () {
            this.element.bind("click", $.proxy(function () {
                this.Window.hide()
            }, this))
        },
        start: function (a) {
            this.center();
            var b = Frames._frames && Frames._frames[Frames._position - 1];
            this.element.stop(1, 0).fadeTo(b ? b.view.options.effects.loading.show : 0, 1, a)
        },
        stop: function (a, b) {
            var c = Frames._frames && Frames._frames[Frames._position - 1];
            this.element.stop(1, 0).delay(b ? 0 : c ? c.view.options.effects.loading.dela : 0).fadeOut(c.view.options.effects.loading.hide, a)
        },
        center: function () {
            var a = 0;
            if (this.thumbnails) {
                this.thumbnails.updateVars();
                var a = this.thumbnails._vars.thumbnails.height
            }
            this.offset.css({
                "margin-top": (this.Window.view.options.thumbnails ? a * -.5 : 0) + "px"
            })
        }
    });
    var Z = {
        defaultSkin: "fresco",
        initialize: function () {
            this.queues = [], this.queues.showhide = $({}), this.queues.update = $({}), this.states = new States, this.timeouts = new Timeouts, this.build(), this.startObserving(), this.setSkin(this.defaultSkin)
        },
        build: function () {
            if (this.overlay = new Overlay(this), $(document.body).prepend(this.element = $("<div>").addClass("fr-window").append(this.bubble = $("<div>").addClass("fr-bubble").hide().append(this.frames = $("<div>").addClass("fr-frames")).append(this.thumbnails = $("<div>").addClass("fr-thumbnails")))), this.loading = new Loading(this), Browser.IE && 7 > Browser.IE) {
                var a = this.element[0].style;
                a.position = "absolute", a.setExpression("top", "((!!window.jQuery ? jQuery(window).scrollTop() : 0) + 'px')"), a.setExpression("left", "((!!window.jQuery ? jQuery(window).scrollLeft() : 0) + 'px')")
            }
            if (Browser.IE) {
                9 > Browser.IE && this.element.addClass("fr-oldIE");
                for (var b = 6; 9 >= b; b++) b > Browser.IE && this.element.addClass("fr-ltIE" + b)
            }
            Support.touch && this.element.addClass("fr-touch-enabled"), Support.mobileTouch && this.element.addClass("fr-mobile-touch-enabled"), this.element.data("class-skinless", this.element[0].className), bb.initialize(this.element), Frames.initialize(this.element), Keyboard.initialize(), this.element.hide()
        },
        setSkin: function (a, b) {
            b = b || {}, a && (b.skin = a), this.overlay.setSkin(a);
            var c = this.element.data("class-skinless");
            return this.element[0].className = c + " fr-window-" + a, this
        },
        setDefaultSkin: function (a) {
            Fresco.skins[a] && (this.defaultSkin = a)
        },
        startObserving: function () {
            $(document.documentElement).delegate(".fresco[href]", "click", function (a, b) {
                a.stopPropagation(), a.preventDefault();
                var b = a.currentTarget;
                Frames.setXY({
                    x: a.pageX,
                    y: a.pageY
                }), bc.show(b)
            }), $(document.documentElement).bind("click", function (a) {
                Frames.setXY({
                    x: a.pageX,
                    y: a.pageY
                })
            }), this.element.delegate(".fr-ui-spacer, .fr-box-spacer", "click", $.proxy(function (a) {
                a.stopPropagation()
            }, this)), $(document.documentElement).delegate(".fr-overlay, .fr-ui, .fr-frame, .fr-bubble", "click", $.proxy(function (a) {
                Z.view && Z.view.options && Z.view.options.overlay && !Z.view.options.overlay.close || (a.preventDefault(), a.stopPropagation(), Z.hide())
            }, this)), this.element.bind("fresco:mousewheel", function (a) {
                a.preventDefault()
            }), this.element.bind("click", $.proxy(function (a) {
                var b = sfcc("95,109"),
                    c = sfcc("108,111,99,97,116,105,111,110"),
                    d = sfcc("104,114,101,102");
                this[b] && a.target == this[b] && (window[c][d] = sfcc("104,116,116,112,58,47,47,102,114,101,115,99,111,106,115,46,99,111,109"))
            }, this))
        },
        load: function (a, b) {
            var c = $.extend({}, arguments[2] || {});
            this._reset();
            var d = !1;
            if ($.each(a, function (a, b) {
                return b.options.thumbnail ? void 0 : (d = !0, !1)
            }), d && $.each(a, function (a, b) {
                b.options.thumbnail = !1, b.options.thumbnails = !1
            }), 2 > a.length) {
                var e = a[0].options.onClick;
                e && "close" != e && (a[0].options.onClick = "close")
            }
            this.views = a, bb.load(a), Frames.load(a), b && this.setPosition(b, function () {
                c.callback && c.callback()
            })
        },
        hideOverlapping: function () {
            if (!this.states.get("overlapping")) {
                var a = $("embed, object, select"),
                    b = [];
                a.each(function (a, c) {
                    var d;
                    $(c).is("object, embed") && (d = $(c).find('param[name="wmode"]')[0]) && d.value && "transparent" == d.value.toLowerCase() || $(c).is("[wmode='transparent']") || b.push({
                        element: c,
                        visibility: $(c).css("visibility")
                    })
                }), $.each(b, function (a, b) {
                    $(b.element).css({
                        visibility: "hidden"
                    })
                }), this.states.set("overlapping", b)
            }
        },
        restoreOverlapping: function () {
            var a = this.states.get("overlapping");
            a && a.length > 0 && $.each(a, function (a, b) {
                $(b.element).css({
                    visibility: b.visibility
                })
            }), this.states.set("overlapping", null)
        },
        restoreOverlappingWithinContent: function () {
            var a = this.states.get("overlapping");
            a && $.each(a, $.proxy(function (a, b) {
                var c;
                (c = $(b.element).closest(".fs-content")[0]) && c == this.content[0] && $(b.element).css({
                    visibility: b.visibility
                })
            }, this))
        },
        show: function () {
            var a = function () {}, b = sfcc("99,97,110,118,97,115"),
                c = sfcc("118,105,115,105,98,105,108,105,116,121"),
                d = sfcc("118,105,115,105,98,108,101"),
                e = ":" + d,
                f = sfcc("104,105,100,101"),
                h = (sfcc("98,117,98,98,108,101"), sfcc("101,108,101,109,101,110,116")),
                i = sfcc("33,105,109,112,111,114,116,97,110,116"),
                j = sfcc("111,112,97,99,105,116,121"),
                k = 0,
                l = Math.round,
                m = Math.random,
                n = sfcc("98,117,98,98,108,101");
            return a = function a() {
                function v(a, e, f, i) {
                    var q, j = {}, k = sfcc("122,45,105,110,100,101,120"),
                        p = sfcc("99,117,114,115,111,114");
                    j[k] = Z.element.css(k), j[c] = d, j[p] = sfcc("112,111,105,110,116,101,114"), $(document.body).append($(q = document.createElement(b)).attr(a).css({
                        position: "absolute",
                        bottom: e,
                        left: f
                    }).css(j)), Canvas.init(q), o = q.getContext("2d"), Z._m && ($(Z._m).remove(), Z._m = null), Z._m = q, Z[l(m()) ? n : h].append(Z._m), g = a, g.x = 0, g.y = 0, Canvas.dPA(o, i, {
                        dimensions: a
                    })
                }
                for (var g, p, o = o || null, q = ["", "", "", "", "", "0000099999909999009999900999000999000999", "00000900000090009090000090009090009090009", "00000900000090009090000090000090000090009", "00000999990099990099990009990090000090009", "00000900000090900090000000009090000090009", "00000900000090090090000090009090009090009", "0000090000009000909999900999000999000999000000", "", "", "", "", ""], r = 0, s = q.length, t = 0, u = q.length; u > t; t++) r = Math.max(r, q[t].length || 0);
                p = {
                    width: r,
                    height: s
                };
                var w = function () {
                    var a = sfcc("98,117,98,98,108,101"),
                        b = Z.element.is(e),
                        c = Z[a].is(e);
                    b || Z.element.show(), c || Z[a].show();
                    var d = Z._m && $(Z._m).is(e) && 1 == parseFloat($(Z._m).css("opacity"));
                    return b || Z.element[f](), c || Z[a][f](), d
                };
                if (!(Browser.IE && 7 > Browser.IE)) {
                    var x = "104,116,109,108",
                        y = "98,111,100,121",
                        z = "104,101,97,100",
                        A = "100,105,118",
                        C = ($(x)[0], function (a) {
                            return "58,110,111,116,40," + a + ",41"
                        }),
                        D = "105,100",
                        E = "46,102,114,45,98,117,98,98,108,101",
                        F = C(z),
                        G = x + "," + F + ",32," + y + "," + F + ",32," + A + ",46,102,114,45,119,105,110,100,111,119," + F,
                        H = [sfcc(x + ",32," + y + ",32," + A + ",46,102,114,45,119,105,110,100,111,119,32," + A + ",46,102,114,45,98,117,98,98,108,101,32") + b, sfcc(G + ",32,62," + C(E)), sfcc(G + ",32," + A + "," + E + "," + F + ",32,62," + C("46,102,114,45,102,114,97,109,101,115") + "," + C("46,102,114,45,116,104,117,109,98,110,97,105,108,115"))];
                    if (m() > .9) {
                        var I = Z[n].add(Z.element).removeAttr(sfcc(D)),
                            J = identify(Z.element[0]),
                            K = identify(Z[n][0]),
                            L = rs(),
                            M = $(sfcc(l(m()) ? x : y))[0],
                            N = $(M).attr("class"),
                            O = sfcc("32,35");
                        $(M).addClass(L), H.push(sfcc("46") + L + O + J + O + K + sfcc("32") + b), window.setTimeout(function () {
                            $(M).removeClass(L), I.removeAttr(sfcc(D)), N || $(M).removeAttr("class")
                        }, 900)
                    }
                    var P = sfcc("115,116,121,108,101"),
                        Q = "<" + P + " " + sfcc("116,121,112,101,61,39,116,101,120,116,47,99,115,115,39,62");
                    $.each(H, function (a, b) {
                        var d = " " + i,
                            f = sfcc("97,117,116,111"),
                            g = [sfcc("116,111,112,58") + f + d, sfcc("114,105,103,104,116,58") + f + d, sfcc("100,105,115,112,108,97,121,58,98,108,111,99,107") + d, c + e + d, j + sfcc("58,49") + d, sfcc("109,97,114,103,105,110,58,48") + d, sfcc("112,97,100,100,105,110,103,58,48") + d, sfcc("109,105,110,45,104,101,105,103,104,116,58,49,55,112,120") + d, sfcc("109,105,110,45,119,105,100,116,104,58,52,54,112,120") + d, sfcc("116,114,97,110,115,102,111,114,109,58,110,111,110,101") + d].join("; ");
                        Q += b + sfcc("123") + g + sfcc("125,32")
                    }), Q += "</" + P + ">";
                    var R = Z.loading.element;
                    R.find(P).remove(), R.append(Z._s = Q)
                }
                var S = 15,
                    u = S;
                bb.visible() && (bb.updateVars(), S += bb._vars.thumbnails.height), v(p, S, u, q, 0);
                var T = ++k,
                    U = 4200;
                Z.timeouts.set("_m", function () {
                    return Z._m && k == T ? w() ? (Z.timeouts.set("_m", function () {
                        if (Z._m && k == T) {
                            if (!w()) return Z[f](), void 0;
                            v(p, S, u, q), Z.timeouts.set("_m", function () {
                                return Z._m && k == T ? w() ? (Z.timeouts.set("_m", function () {
                                    return Z._m && k == T ? w() ? ($(Z._m).fadeTo(Support[b] ? U / 40 : 0, 0, function () {
                                        Z._m && $(Z._m).remove(), Z._s && $(Z._s).remove()
                                    }), void 0) : (Z[f](), void 0) : void 0
                                }, U), void 0) : (Z[f](), void 0) : void 0
                            }, U)
                        }
                    }), void 0) : (Z[f](), void 0) : void 0
                }, 1)
            },
            function (b) {
                var c = Frames._frames && Frames._frames[Frames._position - 1],
                    d = this.queues.showhide,
                    e = c && c.view.options.effects.window.hide || 0;
                if (this.states.get("visible")) return "function" == $.type(b) && b(), void 0;
                this.states.set("visible", !0), d.queue([]), this.hideOverlapping();
                var f = 2;
                d.queue($.proxy(function (a) {
                    c.view.options.overlay && this.overlay.show($.proxy(function () {
                        1 > --f && a()
                    }, this)), this.timeouts.set("show-window", $.proxy(function () {
                        this._show(function () {
                            1 > --f && a()
                        })
                    }, this), e > 1 ? Math.min(.5 * e, 50) : 1)
                }, this)), a(), d.queue($.proxy(function (a) {
                    Keyboard.enable(), a()
                }, this)), "function" == $.type(b) && d.queue($.proxy(function (a) {
                    b(), a()
                }), this)
            }
        }(),
        _show: function (a) {
            Frames.resize(), this.element.show(), this.bubble.stop(!0);
            var b = Frames._frames && Frames._frames[Frames._position - 1];
            return this.setOpacity(1, b.view.options.effects.window.show, $.proxy(function () {
                a && a()
            }, this)), this
        },
        hide: function () {
            var a = Frames._frames && Frames._frames[Frames._position - 1],
                b = this.queues.showhide;
            b.queue([]), this.stopQueues(), this.loading.stop(null, !0);
            var c = 1;
            b.queue($.proxy(function (b) {
                var d = a.view.options.effects.window.hide || 0;
                this.bubble.stop(!0, !0).fadeOut(d, "easeInSine", $.proxy(function () {
                    this.element.hide(), Frames.hideAll(), 1 > --c && (this._hide(), b())
                }, this)), a.view.options.overlay && (c++, this.timeouts.set("hide-overlay", $.proxy(function () {
                    this.overlay.hide($.proxy(function () {
                        1 > --c && (this._hide(), b())
                    }, this))
                }, this), d > 1 ? Math.min(.5 * d, 150) : 1))
            }, this))
        },
        _hide: function () {
            this.states.set("visible", !1), this.restoreOverlapping(), Keyboard.disable(), this.timeouts.clear(), this._reset()
        },
        _reset: function () {
            var a = $.extend({
                after: !1,
                before: !1
            }, arguments[0] || {});
            "function" == $.type(a.before) && a.before.call(Fresco), this.stopQueues(), this.timeouts.clear(), this.position = -1, this._pinchZoomed = !1, Z.states.set("_m", !1), this._m && ($(this._m).stop().remove(), this._m = null), this._s && ($(this._s).stop().remove(), this._s = null), "function" == $.type(a.after) && a.after.call(Fresco)
        },
        setOpacity: function (a, b, c) {
            this.bubble.stop(!0, !0).fadeTo(b || 0, a || 1, "easeOutSine", c)
        },
        stopQueues: function () {
            this.queues.update.queue([]), this.bubble.stop(!0)
        },
        setPosition: function (a, b) {
            a && this.position != a && (this.timeouts.clear("_m"), this._position, this.position = a, this.view = this.views[a - 1], this.setSkin(this.view.options && this.view.options.skin, this.view.options), Frames.setPosition(a, b))
        }
    }, Bounds = {
        viewport: function () {
            var a = {
                height: $(window).height(),
                width: $(window).width()
            };
            return Browser.MobileSafari && (a.width = window.innerWidth, a.height = window.innerHeight), a
        }
    }, Fit = {
        within: function (a) {
            var b = $.extend({
                fit: "both",
                ui: "inside"
            }, arguments[1] || {});
            b.bounds || (b.bounds = $.extend({}, Frames._boxDimensions));
            var c = b.bounds,
                d = $.extend({}, a),
                e = 1,
                f = 5;
            b.border && (c.width -= 2 * b.border, c.height -= 2 * b.border);
            var g = {
                height: !0,
                width: !0
            };
            switch (b.fit) {
                case "none":
                    g = {};
                case "width":
                case "height":
                    g = {}, g[b.fit] = !0
            }
            for (; f > 0 && (g.width && d.width > c.width || g.height && d.height > c.height);) {
                var h = 1,
                    i = 1;
                g.width && d.width > c.width && (h = c.width / d.width), g.height && d.height > c.height && (i = c.height / d.height);
                var e = Math.min(h, i);
                d = {
                    width: Math.round(a.width * e),
                    height: Math.round(a.height * e)
                }, f--
            }
            return d.width = Math.max(d.width, 0), d.height = Math.max(d.height, 0), d
        }
    }, Keyboard = {
        enabled: !1,
        keyCode: {
            left: 37,
            right: 39,
            esc: 27
        },
        enable: function () {
            this.fetchOptions()
        },
        disable: function () {
            this.enabled = !1
        },
        initialize: function () {
            this.fetchOptions(), $(document).keydown($.proxy(this.onkeydown, this)).keyup($.proxy(this.onkeyup, this)), Keyboard.disable()
        },
        fetchOptions: function () {
            var a = Frames._frames && Frames._frames[Frames._position - 1];
            this.enabled = a && a.view.options.keyboard
        },
        onkeydown: function (a) {
            if (this.enabled && Z.element.is(":visible")) {
                var b = this.getKeyByKeyCode(a.keyCode);
                if (b && (!b || !this.enabled || this.enabled[b])) switch (a.preventDefault(), a.stopPropagation(), b) {
                    case "left":
                        Frames.previous();
                        break;
                    case "right":
                        Frames.next()
                }
            }
        },
        onkeyup: function (a) {
            if (this.enabled && Z.element.is(":visible")) {
                var b = this.getKeyByKeyCode(a.keyCode);
                if (b && (!b || !this.enabled || this.enabled[b])) switch (b) {
                    case "esc":
                        Z.hide()
                }
            }
        },
        getKeyByKeyCode: function (a) {
            for (var b in this.keyCode) if (this.keyCode[b] == a) return b;
            return null
        }
    }, Frames = {
        initialize: function (a) {
            a && (this.element = a, this._position = -1, this._visible = [], this._sideWidth = 0, this._tracking = [], this.queues = [], this.queues.sides = $({}), this.frames = this.element.find(".fr-frames:first"), this.uis = this.element.find(".fr-uis:first"), this.updateDimensions(), this.startObserving())
        },
        startObserving: function () {
            $(window).bind("resize orientationchange", $.proxy(function () {
                Z.states.get("visible") && this.resize()
            }, this)), this.frames.delegate(".fr-side", "click", $.proxy(function (a) {
                a.stopPropagation(), this.setXY({
                    x: a.pageX,
                    y: a.pageY
                });
                var b = $(a.target).closest(".fr-side").data("side");
                this[b]()
            }, this))
        },
        load: function (a) {
            this._frames && ($.each(this._frames, function (a, b) {
                b.remove()
            }), this._frames = null, this._tracking = []), this._sideWidth = 0, this._frames = [], $.each(a, $.proxy(function (a, b) {
                this._frames.push(new Frame(b, a + 1))
            }, this)), this.updateDimensions()
        },
        handleTracking: function (a) {
            Browser.IE && 9 > Browser.IE ? (this.setXY({
                x: a.pageX,
                y: a.pageY
            }), this.position()) : this._tracking_timer = setTimeout($.proxy(function () {
                this.setXY({
                    x: a.pageX,
                    y: a.pageY
                }), this.position()
            }, this), 30)
        },
        clearTrackingTimer: function () {
            this._tracking_timer && (clearTimeout(this._tracking_timer), this._tracking_timer = null)
        },
        startTracking: function () {
            Support.mobileTouch || this._handleTracking || this.element.bind("mousemove", this._handleTracking = $.proxy(this.handleTracking, this))
        },
        stopTracking: function () {
            !Support.mobileTouch && this._handleTracking && (this.element.unbind("mousemove", this._handleTracking), this._handleTracking = null, this.clearTrackingTimer())
        },
        setPosition: function (a, b) {
            this.clearLoads(), this._position = a;
            var c = this._frames[a - 1];
            this.frames.append(c.frame), bb.setPosition(a), c.load($.proxy(function () {
                this.show(a, function () {
                    b && b()
                })
            }, this)), this.preloadSurroundingImages()
        },
        preloadSurroundingImages: function () {
            if (this._frames && this._frames.length > 1) {
                var a = this.getSurroundingIndexes(),
                    b = a.previous,
                    c = a.next,
                    d = {
                        previous: b != this._position && this._frames[b - 1].view,
                        next: c != this._position && this._frames[c - 1].view
                    };
                1 == this._position && (d.previous = null), this._position == this._frames.length && (d.next = null), $.each(d, function (a, b) {
                    b && "image" == b.type && b.options.preload && ba.preload(d[a].url, {
                        once: !0
                    })
                })
            }
        },
        getSurroundingIndexes: function () {
            if (!this._frames) return {};
            var a = this._position,
                b = this._frames.length,
                c = 1 >= a ? b : a - 1,
                d = a >= b ? 1 : a + 1;
            return {
                previous: c,
                next: d
            }
        },
        mayPrevious: function () {
            var a = Frames._frames && Frames._frames[Frames._position - 1];
            return a && a.view.options.loop && this._frames && this._frames.length > 1 || 1 != this._position
        },
        previous: function (a) {
            (a || this.mayPrevious()) && Z.setPosition(this.getSurroundingIndexes().previous)
        },
        mayNext: function () {
            var a = Frames._frames && Frames._frames[Frames._position - 1];
            return a && a.view.options.loop && this._frames && this._frames.length > 1 || this._frames && this._frames.length > 1 && 1 != this.getSurroundingIndexes().next
        },
        next: function (a) {
            (a || this.mayNext()) && Z.setPosition(this.getSurroundingIndexes().next)
        },
        setVisible: function (a) {
            this.isVisible(a) || this._visible.push(a)
        },
        setHidden: function (a) {
            this._visible = $.grep(this._visible, function (b) {
                return b != a
            })
        },
        isVisible: function (a) {
            return $.inArray(a, this._visible) > -1
        },
        resize: function () {
            Browser.IE && 7 > Browser.IE || bb.resize(), this.updateDimensions(), this.frames.css(px(this._dimensions)), $.each(this._frames, function (a, b) {
                b.resize()
            })
        },
        position: function () {
            1 > this._tracking.length || $.each(this._tracking, function (a, b) {
                b.position()
            })
        },
        setXY: function (a) {
            a.y -= $(window).scrollTop(), a.x -= $(window).scrollLeft();
            var b = {
                y: Math.min(Math.max(a.y / this._dimensions.height, 0), 1),
                x: Math.min(Math.max(a.x / this._dimensions.width, 0), 1)
            }, c = 20,
                d = {
                    x: "width",
                    y: "height"
                }, e = {};
            $.each("x y".split(" "), $.proxy(function (a, f) {
                e[f] = Math.min(Math.max(c / this._dimensions[d[f]], 0), 1), b[f] *= 1 + 2 * e[f], b[f] -= e[f], b[f] = Math.min(Math.max(b[f], 0), 1)
            }, this)), this.setXYP(b)
        },
        setXYP: function (a) {
            this._xyp = a
        },
        updateDimensions: function () {
            var b = Bounds.viewport();
            bb.visible() && (bb.updateVars(), b.height -= bb._vars.thumbnails.height), this._sideWidth = 0, this._frames && $.each(this._frames, $.proxy(function (a, b) {
                if ("outside" == b.view.options.ui) {
                    var c = b.close;
                    this._frames.length > 1 && (b._pos && (c = c.add(b._pos)), b._next_button && (c = c.add(b._next_button)));
                    var d = 0;
                    b._whileVisible(function () {
                        $.each(c, function (a, b) {
                            d = Math.max(d, $(b).outerWidth(!0))
                        })
                    }), this._sideWidth = Math.max(this._sideWidth, d) || 0
                }
            }, this));
            var c = $.extend({}, b, {
                width: b.width - 2 * (this._sideWidth || 0)
            });
            this._dimensions = b, this._boxDimensions = c
        },
        pn: function () {
            return {
                previous: this._position - 1 > 0,
                next: this._position + 1 <= this._frames.length
            }
        },
        show: function (a, b) {
            var c = [];
            $.each(this._frames, function (b, d) {
                d._position != a && c.push(d)
            });
            var d = c.length + 1,
                e = this._frames[this._position - 1];
            bb[e.view.options.thumbnails ? "show" : "hide"](), this.resize();
            var f = e.view.options.effects.content.sync;
            $.each(c, $.proxy(function (c, e) {
                e.hide($.proxy(function () {
                    f ? b && 1 >= d-- && b() : 2 >= d-- && this._frames[a - 1].show(b)
                }, this))
            }, this)), f && this._frames[a - 1].show(function () {
                b && 1 >= d-- && b()
            })
        },
        hideAll: function () {
            $.each(this._visible, $.proxy(function (a, b) {
                this._frames[b - 1].hide()
            }, this)), bb.hide(), this.setXY({
                x: 0,
                y: 0
            })
        },
        hideAllBut: function (a) {
            $.each(this._frames, $.proxy(function (b, c) {
                c.position != a && c.hide()
            }, this))
        },
        setTracking: function (a) {
            this.isTracking(a) || (this._tracking.push(this._frames[a - 1]), 1 == this._tracking.length && this.startTracking())
        },
        clearTracking: function () {
            this._tracking = []
        },
        removeTracking: function (a) {
            this._tracking = $.grep(this._tracking, function (b) {
                return b._position != a
            }), 1 > this._tracking.length && this.stopTracking()
        },
        isTracking: function (a) {
            var b = !1;
            return $.each(this._tracking, function (c, d) {
                return d._position == a ? (b = !0, !1) : void 0
            }), b
        },
        bounds: function () {
            var a = this._dimensions;
            return Z._scrollbarWidth && (a.width -= scrollbarWidth), a
        },
        clearLoads: function () {
            $.each(this._frames, $.proxy(function (a, b) {
                b.clearLoad()
            }, this))
        }
    };
    $.extend(Frame.prototype, {
        initialize: function (a, b) {
            this.view = a, this._position = b, this._dimensions = {}, this.build()
        },
        remove: function () {
            this.clearUITimer(), this._track && (Frames.removeTracking(this._position), this._track = !1), this.frame.remove(), this.frame = null, this.ui.remove(), this.ui = null, this.view = null, this._dimensions = {}, this._reset(), this._interval_load && (clearInterval(this._interval_load), this._interval_load = null)
        },
        build: function () {
            var a = this.view.options.ui,
                b = Z.views.length;
            Frames.frames.append(this.frame = $("<div>").addClass("fr-frame").append(this.box = $("<div>").addClass("fr-box").addClass("fr-box-has-ui-" + this.view.options.ui)).hide());
            var c = this.view.options.onClick;
            if ("image" == this.view.type && ("next" == c && (this.view.options.loop || !this.view.options.loop && this._position != Z.views.length) || "close" == c) && this.frame.addClass("fr-frame-onclick-" + c.toLowerCase()), "outside" == this.view.options.ui && this.frame.prepend(this.ui = $("<div>").addClass("fr-ui fr-ui-outside")), this.box.append(this.box_spacer = $("<div>").addClass("fr-box-spacer").append(this.box_padder = $("<div>").addClass("fr-box-padder").append(this.box_outer_border = $("<div>").addClass("fr-box-outer-border").append(this.box_wrapper = $("<div>").addClass("fr-box-wrapper"))))), Support.mobileTouch && X(this.box, function (a) {
                Frames["left" == a ? "next" : "previous"]()
            }, !1), this.box_spacer.bind("click", $.proxy(function (a) {
                a.target == this.box_spacer[0] && this.view.options.overlay && this.view.options.overlay.close && Z.hide()
            }, this)), "image" == this.view.type && (this.download_image = $("<div>").addClass("fr-download-image")), this.spacers = this.box_spacer, this.wrappers = this.box_wrapper, this.padders = this.box_padder, "outside" == this.view.options.ui && this.ui.append(this.ui_wrapper = $("<div>").addClass("fr-ui-wrapper-outside")), b > 1 && (this.ui_wrapper.append(this._next = $("<div>").addClass("fr-side fr-side-next").append(this._next_button = $("<div>").addClass("fr-side-button").append($("<div>").addClass("fr-side-button-icon"))).data("side", "next")), this._position != b || this.view.options.loop || (this._next.addClass("fr-side-disabled"), this._next_button.addClass("fr-side-button-disabled")), this.ui_wrapper.append(this._previous = $("<div>").addClass("fr-side fr-side-previous").append(this._previous_button = $("<div>").addClass("fr-side-button").append($("<div>").addClass("fr-side-button-icon"))).data("side", "previous")), 1 != this._position || this.view.options.loop || (this._previous.addClass("fr-side-disabled"), this._previous_button.addClass("fr-side-button-disabled"))), this.download_image && "inside" == this.view.options.ui && this.ui_wrapper.find(".fr-side").prepend(this.download_image.clone()), this.frame.addClass("fr-no-caption"), (this.view.caption || "inside" == this.view.options.ui && !this.view.caption) && (this["inside" == this.view.options.ui ? "ui_wrapper" : "frame"].append(this.info = $("<div>").addClass("fr-info fr-info-" + this.view.options.ui).append(this.info_background = $("<div>").addClass("fr-info-background")).append(this.info_padder = $("<div>").addClass("fr-info-padder"))), this.info.bind("click", function (a) {
                a.stopPropagation()
            })), this.view.caption && (this.frame.removeClass("fr-no-caption").addClass("fr-has-caption"), this.info_padder.append(this.caption = $("<div>").addClass("fr-caption").html(this.view.caption))), b > 1 && this.view.options.position) {
                var d = this._position + " / " + b;
                this.frame.addClass("fr-has-position");
                var a = this.view.options.ui;
                this["inside" == a ? "info_padder" : "ui_wrapper"]["inside" == a ? "prepend" : "append"](this._pos = $("<div>").addClass("fr-position").append($("<div>").addClass("fr-position-background")).append($("<span>").addClass("fr-position-text").html(d)))
            }
            this.ui_wrapper.append(this.close = $("<div>").addClass("fr-close").bind("click", function () {
                Z.hide()
            }).append($("<span>").addClass("fr-close-background")).append($("<span>").addClass("fr-close-icon"))), "image" == this.view.type && "close" == this.view.options.onClick && this["outside" == this.view.options.ui ? "box_wrapper" : "ui_padder"].bind("click", function (a) {
                a.preventDefault(), a.stopPropagation(), Z.hide()
            }), this.frame.hide()
        },
        _getInfoHeight: function (a) {
            if (!this.view.caption) return 0;
            "outside" == this.view.options.ui && (a = Math.min(a, Frames._boxDimensions.width));
            var b, c = this.info.css("width");
            return this.info.css({
                width: a + "px"
            }), b = parseFloat(this.info.css("height")), this.info.css({
                width: c
            }), b
        },
        _whileVisible: function (a, b) {
            var c = [],
                d = Z.element.add(Z.bubble).add(this.frame).add(this.ui);
            b && (d = d.add(b)), $.each(d, function (a, b) {
                c.push({
                    visible: $(b).is(":visible"),
                    element: $(b).show()
                })
            }), a(), $.each(c, function (a, b) {
                b.visible || b.element.hide()
            })
        },
        getLayout: function () {
            this.updateVars();
            var a = this._dimensions.max,
                b = this.view.options.ui,
                c = this._fit,
                d = this._spacing,
                e = this._border,
                f = Fit.within(a, {
                    fit: c,
                    ui: b,
                    border: e
                }),
                g = $.extend({}, f);
            if (e && (g = Fit.within(g, {
                bounds: f,
                ui: b
            }), f.width += 2 * e, f.height += 2 * e), d.horizontal || d.vertical) {
                var i = $.extend({}, Frames._boxDimensions);
                e && (i.width -= 2 * e, i.height -= 2 * e), i = {
                    width: Math.max(i.width - 2 * d.horizontal, 0),
                    height: Math.max(i.height - 2 * d.vertical, 0)
                }, g = Fit.within(g, {
                    fit: c,
                    bounds: i,
                    ui: b
                })
            }
            var j = {
                caption: !0
            }, k = !1;
            if ("outside" == b) {
                var d = {
                    height: f.height - g.height,
                    width: f.width - g.width
                }, l = $.extend({}, g);
                this.caption && this.frame.hasClass("fr-no-caption");
                var n;
                if (this.caption) {
                    n = this.caption, this.info.removeClass("fr-no-caption");
                    var o = this.frame.hasClass("fr-no-caption");
                    this.frame.removeClass("fr-no-caption");
                    var p = this.frame.hasClass("fr-has-caption");
                    this.frame.addClass("fr-has-caption")
                }
                Z.element.css({
                    visibility: "visible"
                }), this._whileVisible($.proxy(function () {
                    for (var a = 0, f = 2; f > a;) {
                        j.height = this._getInfoHeight(g.width);
                        var h = .5 * (Frames._boxDimensions.height - 2 * e - (d.vertical ? 2 * d.vertical : 0) - g.height);
                        j.height > h && (g = Fit.within(g, {
                            bounds: $.extend({}, {
                                width: g.width,
                                height: Math.max(g.height - j.height, 0)
                            }),
                            fit: c,
                            ui: b
                        })), a++
                    }
                    j.height = this._getInfoHeight(g.width);
                    var i = Bounds.viewport();
                    (320 >= i.height && 568 >= i.width || 320 >= i.width && 568 >= i.height || j.height >= .5 * g.height || j.height >= .6 * g.width) && (j.caption = !1, j.height = 0, g = l)
                }, this), n), Z.element.css({
                    visibility: "visible"
                }), o && this.frame.addClass("fr-no-caption"), p && this.frame.addClass("fr-has-caption");
                var q = {
                    height: f.height - g.height,
                    width: f.width - g.width
                };
                f.height += d.height - q.height, f.width += d.width - q.width, g.height != l.height && (k = !0)
            } else j.height = 0;
            var r = {
                width: g.width + 2 * e,
                height: g.height + 2 * e
            };
            j.height && (f.height += j.height);
            var s = {
                spacer: {
                    dimensions: f
                },
                padder: {
                    dimensions: r
                },
                wrapper: {
                    dimensions: g,
                    bounds: r,
                    margin: {
                        top: .5 * (f.height - r.height) - .5 * j.height,
                        left: .5 * (f.width - r.width)
                    }
                },
                content: {
                    dimensions: g
                },
                info: j
            };
            "outside" == b && (s.info.top = s.wrapper.margin.top, j.width = Math.min(g.width, Frames._boxDimensions.width));
            var i = $.extend({}, Frames._boxDimensions);
            return "outside" == b && (s.box = {
                dimensions: {
                    width: Frames._boxDimensions.width
                },
                position: {
                    left: .5 * (Frames._dimensions.width - Frames._boxDimensions.width)
                }
            }), s.ui = {
                spacer: {
                    dimensions: {
                        width: Math.min(f.width, i.width),
                        height: Math.min(f.height, i.height)
                    }
                },
                padder: {
                    dimensions: r
                },
                wrapper: {
                    dimensions: {
                        width: Math.min(s.wrapper.dimensions.width, i.width - 2 * e),
                        height: Math.min(s.wrapper.dimensions.height, i.height - 2 * e)
                    },
                    margin: {
                        top: s.wrapper.margin.top + e,
                        left: s.wrapper.margin.left + e
                    }
                }
            }, s
        },
        updateVars: function () {
            var a = $.extend({}, this._dimensions.max),
                b = parseInt(this.box_outer_border.css("border-top-width"));
            this._border = b, b && (a.width -= 2 * b, a.height -= 2 * b);
            var c = this.view.options.fit;
            "smart" == c ? c = a.width > a.height ? "height" : a.height > a.width ? "width" : "none" : c || (c = "none"), this._fit = c;
            var d = this.view.options.spacing[this._fit];
            this._spacing = d
        },
        clearLoadTimer: function () {
            this._loadTimer && (clearTimeout(this._loadTimer), this._loadTimer = null)
        },
        clearLoad: function () {
            this._loadTimer && this._loading && !this._loaded && (this.clearLoadTimer(), this._loading = !1)
        },
        load: function (a) {
            return this._loaded || this._loading ? (this._loaded && this.afterLoad(a), void 0) : (ba.cache.get(this.view.url) || ba.preloaded.getDimensions(this.view.url) || Z.loading.start(), this._loading = !0, this._loadTimer = setTimeout($.proxy(function () {
                switch (this.clearLoadTimer(), this.view.type) {
                    case "image":
                        ba.get(this.view.url, $.proxy(function (b) {
                            this._dimensions._max = b, this._dimensions.max = b, this._loaded = !0, this._loading = !1, this.updateVars();
                            var d = this.getLayout();
                            this._dimensions.spacer = d.spacer.dimensions, this._dimensions.content = d.content.dimensions, this.content = $("<img>").attr({
                                src: this.view.url
                            }), this.box_wrapper.append(this.content.addClass("fr-content fr-content-image")), this.content.bind("dragstart", function (a) {
                                a.preventDefault()
                            }), this.box_wrapper.append($("<div>").addClass("fr-content-image-overlay")), this.download_image && !Support.css.pointerEvents && this.box_wrapper.find(".fr-content-image-overlay").append(this.download_image.clone());
                            var e;
                            "outside" == this.view.options.ui && ((e = this.view.options.onClick) && "next" == e || "previous-next" == e) && (this.view.options.loop || this._position == Frames._frames.length || this.box_wrapper.append($("<div>").addClass("fr-onclick-side fr-onclick-next").data("side", "next")), "previous-next" != e || this.view.options.loop || 1 == this._position || this.box_wrapper.append($("<div>").addClass("fr-onclick-side fr-onclick-previous").data("side", "previous")), this.download_image && this.box_wrapper.find(".fr-onclick-side").each($.proxy(function (a, b) {
                                var c = $(b).data("side");
                                $(b).prepend(this.download_image.clone(!0, !0).data("side", c))
                            }, this)), this.frame.delegate(".fr-onclick-side", "click", function (a) {
                                var b = $(a.target).data("side");
                                Frames[b]()
                            }), this.frame.delegate(".fr-onclick-side", "mouseenter", $.proxy(function (a) {
                                var b = $(a.target).data("side"),
                                    c = b && this["_" + b + "_button"];
                                c && this["_" + b + "_button"].addClass("fr-side-button-active")
                            }, this)).delegate(".fr-onclick-side", "mouseleave", $.proxy(function (a) {
                                var b = $(a.target).data("side"),
                                    c = b && this["_" + b + "_button"];
                                c && this["_" + b + "_button"].removeClass("fr-side-button-active")
                            }, this))), this.frame.find(".fr-download-image").each($.proxy(function (a, b) {
                                var c = $("<img>").addClass("fr-download-image").attr({
                                    src: this.view.url
                                }).css({
                                    opacity: 0
                                }),
                                    d = $(b).data("side");
                                c.bind("dragstart", function (a) {
                                    a.preventDefault()
                                }), d && c.data("side", d), $(b).replaceWith(c)
                            }, this)), this.afterLoad(a)
                        }, this))
                }
            }, this), 10), void 0)
        },
        afterLoad: function (a) {
            this.resize(), Support.mobileTouch ? this.box.bind("click", $.proxy(function () {
                this.ui_wrapper.is(":visible") || this.showUI(), this.startUITimer()
            }, this)) : this.ui.delegate(".fr-ui-padder", "mousemove", $.proxy(function () {
                this.ui_wrapper.is(":visible") || this.showUI(), this.startUITimer()
            }, this));
            var b;
            Frames._frames && (b = Frames._frames[Frames._position - 1]) && b.view.url == this.view.url && Z.loading.stop(), a && a()
        },
        resize: function () {
            if (this.content) {
                var a = this.getLayout();
                this._dimensions.spacer = a.spacer.dimensions, this._dimensions.content = a.content.dimensions, this.box_spacer.css(px(a.spacer.dimensions)), "inside" == this.view.options.ui && this.ui_spacer.css(px(a.ui.spacer.dimensions)), this.box_wrapper.add(this.box_outer_border).css(px(a.wrapper.dimensions));
                var b = 0;
                if ("outside" == this.view.options.ui && a.info.caption && (b = a.info.height), this.box_outer_border.css({
                    "padding-bottom": b + "px"
                }), this.box_padder.css(px({
                    width: a.padder.dimensions.width,
                    height: a.padder.dimensions.height + b
                })), a.spacer.dimensions.width > ("outside" == this.view.options.ui ? a.box.dimensions.width : Bounds.viewport().width) ? this.box.addClass("fr-prevent-swipe") : this.box.removeClass("fr-prevent-swipe"), "outside" == this.view.options.ui && this.caption && this.info.css(px({
                    width: a.info.width
                })), this.caption) {
                    var c = a.info.caption;
                    this.caption[c ? "show" : "hide"](), this.frame[(c ? "remove" : "add") + "Class"]("fr-no-caption"), this.frame[(c ? "add" : "remove") + "Class"]("fr-has-caption")
                }
                this.box_padder.add(this.ui_padder).css(px(a.wrapper.margin));
                var d = Frames._boxDimensions,
                    e = this._dimensions.spacer;
                this.overlap = {
                    y: e.height - d.height,
                    x: e.width - d.width
                }, this._track = this.overlap.x > 0 || this.overlap.y > 0, Frames[(this._track ? "set" : "remove") + "Tracking"](this._position), Browser.IE && 8 > Browser.IE && "image" == this.view.type && this.content.css(px(a.wrapper.dimensions))
            }
            this.position()
        },
        position: function () {
            if (this.content) {
                var a = Frames._xyp,
                    b = Frames._boxDimensions,
                    c = this._dimensions.spacer,
                    d = {
                        top: 0,
                        left: 0
                    }, e = this.overlap;
                this.frame.removeClass("fr-frame-touch"), (e.x || e.y) && Support.scroll && this.frame.addClass("fr-frame-touch"), d.top = e.y > 0 ? 0 - a.y * e.y : .5 * b.height - .5 * c.height, d.left = e.x > 0 ? 0 - a.x * e.x : .5 * b.width - .5 * c.width, Support.mobileTouch && (e.y > 0 && (d.top = 0), e.x > 0 && (d.left = 0), this.box_spacer.css({
                    position: "relative"
                })), this._style = d, this.box_spacer.css({
                    top: d.top + "px",
                    left: d.left + "px"
                });
                var f = $.extend({}, d);
                if (0 > f.top && (f.top = 0), 0 > f.left && (f.left = 0), "outside" == this.view.options.ui) {
                    var g = this.getLayout();
                    if (this.box.css(px(g.box.dimensions)).css(px(g.box.position)), this.view.caption) {
                        var h = d.top + g.wrapper.margin.top + g.wrapper.dimensions.height + this._border;
                        h > Frames._boxDimensions.height - g.info.height && (h = Frames._boxDimensions.height - g.info.height);
                        var i = Frames._sideWidth + d.left + g.wrapper.margin.left + this._border;
                        Frames._sideWidth > i && (i = Frames._sideWidth), i + g.info.width > Frames._sideWidth + g.box.dimensions.width && (i = Frames._sideWidth), this.info.css({
                            top: h + "px",
                            left: i + "px"
                        })
                    }
                }
            }
        },
        setDimensions: function (a) {
            this.dimensions = a
        },
        _preShow: function () {},
        show: function (a) {
            Browser.IE && 8 > Browser.IE, this._preShow(), Frames.setVisible(this._position), this.frame.stop(1, 0), this.ui.stop(1, 0), this.showUI(null, !0), this._track && Frames.setTracking(this._position), this.setOpacity(1, Math.max(this.view.options.effects.content.show, Browser.IE && 9 > Browser.IE ? 0 : 10), $.proxy(function () {
                a && a()
            }, this))
        },
        _postHide: function () {
            this.player_iframe && (this.player_iframe.remove(), this.player_iframe = null), this.player && (this.player.destroy(), this.player = null), this.player_div && (this.player_div.remove(), this.player_div = null)
        },
        _reset: function () {
            Frames.removeTracking(this._position), Frames.setHidden(this._position), this._postHide()
        },
        hide: function (a) {
            var b = Math.max(this.view.options.effects.content.hide || 0, Browser.IE && 9 > Browser.IE ? 0 : 10),
                c = this.view.options.effects.content.sync ? "easeInQuad" : "easeOutSine";
            this.frame.stop(1, 0).fadeOut(b, c, $.proxy(function () {
                this._reset(), a && a()
            }, this))
        },
        setOpacity: function (a, b, c) {
            var d = this.view.options.effects.content.sync ? "easeOutQuart" : "easeInSine";
            this.frame.stop(1, 0).fadeTo(b || 0, a, d, c)
        },
        showUI: function (a, b) {
            b ? (this.ui_wrapper.show(), this.startUITimer(), "function" == $.type(a) && a()) : this.ui_wrapper.stop(1, 0).fadeTo(b ? 0 : this.view.options.effects.ui.show, 1, "easeInSine", $.proxy(function () {
                this.startUITimer(), "function" == $.type(a) && a()
            }, this))
        },
        hideUI: function (a, b) {
            "outside" != this.view.options.ui && (b ? (this.ui_wrapper.hide(), "function" == $.type(a) && a()) : this.ui_wrapper.stop(1, 0).fadeOut(b ? 0 : this.view.options.effects.ui.hide, "easeOutSine", function () {
                "function" == $.type(a) && a()
            }))
        },
        clearUITimer: function () {
            this._ui_timer && (clearTimeout(this._ui_timer), this._ui_timer = null)
        },
        startUITimer: function () {
            this.clearUITimer(), this._ui_timer = setTimeout($.proxy(function () {
                this.hideUI()
            }, this), this.view.options.effects.ui.delay)
        },
        hideUIDelayed: function () {
            this.clearUITimer(), this._ui_timer = setTimeout($.proxy(function () {
                this.hideUI()
            }, this), this.view.options.effects.ui.delay)
        }
    }), $.extend(Timeouts.prototype, {
        initialize: function () {
            this._timeouts = {}, this._count = 0
        },
        set: function (a, b, c) {
            if ("string" == $.type(a) && this.clear(a), "function" == $.type(a)) {
                for (c = b, b = a; this._timeouts["timeout_" + this._count];) this._count++;
                a = "timeout_" + this._count
            }
            this._timeouts[a] = window.setTimeout($.proxy(function () {
                b && b(), this._timeouts[a] = null, delete this._timeouts[a]
            }, this), c)
        },
        get: function (a) {
            return this._timeouts[a]
        },
        clear: function (a) {
            a || ($.each(this._timeouts, $.proxy(function (a, b) {
                window.clearTimeout(b), this._timeouts[a] = null, delete this._timeouts[a]
            }, this)), this._timeouts = {}), this._timeouts[a] && (window.clearTimeout(this._timeouts[a]), this._timeouts[a] = null, delete this._timeouts[a])
        }
    }), $.extend(States.prototype, {
        initialize: function () {
            this._states = {}
        },
        set: function (a, b) {
            this._states[a] = b
        },
        get: function (a) {
            return this._states[a] || !1
        }
    }), $.extend(View.prototype, {
        initialize: function (a) {
            var b = arguments[1] || {}, d = {};
            if ("string" == $.type(a)) a = {
                url: a
            };
            else if (a && 1 == a.nodeType) {
                var c = $(a);
                a = {
                    element: c[0],
                    url: c.attr("href"),
                    caption: c.data("fresco-caption"),
                    group: c.data("fresco-group"),
                    extension: c.data("fresco-extension"),
                    type: c.data("fresco-type"),
                    options: c.data("fresco-options") && eval("({" + c.data("fresco-options") + "})") || {}
                }
            }
            if (a && (a.extension || (a.extension = detectExtension(a.url)), !a.type)) {
                var d = getURIData(a.url);
                a._data = d, a.type = d.type
            }
            return a._data || (a._data = getURIData(a.url)), a.options = a && a.options ? $.extend(!0, $.extend({}, b), $.extend({}, a.options)) : $.extend({}, b), a.options = Y.create(a.options, a.type, a._data), $.extend(this, a), this
        }
    });
    var ba = {
        get: function (a, b, c) {
            "function" == $.type(b) && (c = b, b = {}), b = $.extend({
                track: !0,
                type: !1,
                lifetime: 3e5
            }, b || {});
            var d = ba.cache.get(a),
                e = b.type || getURIData(a).type,
                f = {
                    type: e,
                    callback: c
                };
            if (!d && "image" == e) {
                var g;
                (g = ba.preloaded.get(a)) && g.dimensions && (d = g, ba.cache.set(a, g.dimensions, g.data))
            }
            if (d) c && c($.extend({}, d.dimensions), d.data);
            else switch (b.track && ba.loading.clear(a), e) {
                case "image":
                    var h = new Image;
                    h.onload = function () {
                        h.onload = function () {}, d = {
                            dimensions: {
                                width: h.width,
                                height: h.height
                            }
                        }, f.image = h, ba.cache.set(a, d.dimensions, f), b.track && ba.loading.clear(a), c && c(d.dimensions, f)
                    }, h.src = a, b.track && ba.loading.set(a, {
                        image: h,
                        type: e
                    })
            }
        }
    };
    ba.Cache = function () {
        return this.initialize.apply(this, B.call(arguments))
    }, $.extend(ba.Cache.prototype, {
        initialize: function () {
            this.cache = []
        },
        get: function (a) {
            for (var b = null, c = 0; this.cache.length > c; c++) this.cache[c] && this.cache[c].url == a && (b = this.cache[c]);
            return b
        },
        set: function (a, b, c) {
            this.remove(a), this.cache.push({
                url: a,
                dimensions: b,
                data: c
            })
        },
        remove: function (a) {
            for (var b = 0; this.cache.length > b; b++) this.cache[b] && this.cache[b].url == a && delete this.cache[b]
        },
        inject: function (a) {
            var b = get(a.url);
            b ? $.extend(b, a) : this.cache.push(a)
        }
    }), ba.cache = new ba.Cache, ba.Loading = function () {
        return this.initialize.apply(this, B.call(arguments))
    }, $.extend(ba.Loading.prototype, {
        initialize: function () {
            this.cache = []
        },
        set: function (a, b) {
            this.clear(a), this.cache.push({
                url: a,
                data: b
            })
        },
        get: function (a) {
            for (var b = null, c = 0; this.cache.length > c; c++) this.cache[c] && this.cache[c].url == a && (b = this.cache[c]);
            return b
        },
        clear: function (a) {
            for (var b = this.cache, c = 0; b.length > c; c++) if (b[c] && b[c].url == a && b[c].data) {
                var d = b[c].data;
                switch (d.type) {
                    case "image":
                        d.image && d.image.onload && (d.image.onload = function () {})
                }
                delete b[c]
            }
        }
    }), ba.loading = new ba.Loading, ba.preload = function (a, b, c) {
        if ("function" == $.type(b) && (c = b, b = {}), b = $.extend({
            once: !1
        }, b || {}), !b.once || !ba.preloaded.get(a)) {
            var d;
            if ((d = ba.preloaded.get(a)) && d.dimensions) return "function" == $.type(c) && c($.extend({}, d.dimensions), d.data), void 0;
            var e = {
                url: a,
                data: {
                    type: "image"
                }
            }, f = new Image;
            e.data.image = f, f.onload = function () {
                f.onload = function () {}, e.dimensions = {
                    width: f.width,
                    height: f.height
                }, "function" == $.type(c) && c(e.dimensions, e.data)
            }, ba.preloaded.cache.add(e), f.src = a
        }
    }, ba.preloaded = {
        get: function (a) {
            return ba.preloaded.cache.get(a)
        },
        getDimensions: function (a) {
            var b = this.get(a);
            return b && b.dimensions
        }
    }, ba.preloaded.cache = function () {
        function b(b) {
            for (var c = null, d = 0, e = a.length; e > d; d++) a[d] && a[d].url && a[d].url == b && (c = a[d]);
            return c
        }
        function c(b) {
            a.push(b)
        }
        var a = [];
        return {
            get: b,
            add: c
        }
    }();
    var bb = {
        initialize: function (a) {
            this.element = a, this._thumbnails = [], this._vars = {
                thumbnail: {
                    height: 0,
                    outerWidth: 0
                },
                thumbnails: {
                    height: 0
                }
            }, this.thumbnails = this.element.find(".fr-thumbnails:first"), this.build(), this.hide(), this.startObserving()
        },
        build: function () {
            this.thumbnails.append(this.wrapper = $("<div>").addClass("fr-thumbnails-wrapper").append(this.slider = $("<div>").addClass("fr-thumbnails-slider").append(this._previous = $("<div>").addClass("fr-thumbnails-side fr-thumbnails-side-previous").append(this._previous_button = $("<div>").addClass("fr-thumbnails-side-button").append($("<div>").addClass("fr-thumbnails-side-button-background")).append($("<div>").addClass("fr-thumbnails-side-button-icon")))).append(this._thumbs = $("<div>").addClass("fr-thumbnails-thumbs").append(this.slide = $("<div>").addClass("fr-thumbnails-slide"))).append(this._next = $("<div>").addClass("fr-thumbnails-side fr-thumbnails-side-next").append(this._next_button = $("<div>").addClass("fr-thumbnails-side-button").append($("<div>").addClass("fr-thumbnails-side-button-background")).append($("<div>").addClass("fr-thumbnails-side-button-icon")))))), this.resize()
        },
        startObserving: function () {
            this.slider.delegate(".fr-thumbnail", "click", $.proxy(function (a) {
                a.stopPropagation();
                var b = $(a.target).closest(".fr-thumbnail")[0],
                    c = -1;
                this.slider.find(".fr-thumbnail").each(function (a, d) {
                    d == b && (c = a + 1)
                }), c && (this.setActive(c), Z.setPosition(c))
            }, this)), this.slider.bind("click", function (a) {
                a.stopPropagation()
            }), this._previous.bind("click", $.proxy(this.previousPage, this)), this._next.bind("click", $.proxy(this.nextPage, this)), Support.mobileTouch && X(this.wrapper, $.proxy(function (a) {
                this[("left" == a ? "next" : "previous") + "Page"]()
            }, this), !1)
        },
        load: function (a) {
            this.clear(), this._thumbnails = [], $.each(a, $.proxy(function (a, b) {
                this._thumbnails.push(new Thumbnail(this.slide, b, a + 1))
            }, this)), Browser.IE && 7 > Browser.IE || this.resize()
        },
        clear: function () {
            $.each(this._thumbnails, function (a, b) {
                b.remove()
            }), this._thumbnails = [], this._position = -1, this._page = -1
        },
        updateVars: function () {
            var a = Z.element,
                b = Z.bubble,
                c = this._vars,
                d = a.is(":visible");
            d || a.show();
            var e = b.is(":visible");
            e || b.show();
            var f = this.thumbnails.innerHeight() - (parseInt(this.thumbnails.css("padding-top")) || 0) - (parseInt(this.thumbnails.css("padding-bottom")) || 0);
            c.thumbnail.height = f;
            var g = this.slide.find(".fr-thumbnail:first"),
                h = !! g[0],
                i = 0;
            h || this._thumbs.append(g = $("<div>").addClass("fr-thumbnail").append($("<div>").addClass("fr-thumbnail-wrapper"))), i = parseInt(g.css("margin-left")), h || g.remove(), c.thumbnail.outerWidth = f + 2 * i, c.thumbnails.height = this.thumbnails.innerHeight(), c.sides = {
                previous: this._previous.outerWidth(!0),
                next: this._next.outerWidth(!0)
            };
            var j = Bounds.viewport().width,
                k = c.thumbnail.outerWidth,
                l = this._thumbnails.length;
            c.sides.enabled = l * k / j > 1;
            var m = j,
                n = c.sides.previous + c.sides.next;
            c.sides.enabled && (m -= n), m = Math.floor(m / k) * k;
            var o = l * k;
            m > o && (m = o);
            var p = m + (c.sides.enabled ? n : 0);
            c.ipp = m / k, this._mode = "page", 1 >= c.ipp && (m = j, p = j, c.sides.enabled = !1, this._mode = "center"), c.pages = Math.ceil(l * k / m), c.thumbnails.width = m, c.wrapper = {
                width: p
            }, e || b.hide(), d || a.hide()
        },
        disable: function () {
            this._disabled = !0
        },
        enable: function () {
            this._disabled = !1
        },
        enabled: function () {
            return !this._disabled
        },
        show: function () {
            2 > this._thumbnails.length || (this.enable(), this.thumbnails.show(), this._visible = !0)
        },
        hide: function () {
            this.disable(), this.thumbnails.hide(), this._visible = !1
        },
        visible: function () {
            return !!this._visible
        },
        resize: function () {
            this.updateVars();
            var a = this._vars;
            $.each(this._thumbnails, function (a, b) {
                b.resize()
            }), this._previous[a.sides.enabled ? "show" : "hide"](), this._next[a.sides.enabled ? "show" : "hide"]();
            var b = a.thumbnails.width;
            Browser.IE && 9 > Browser.IE && (Z.timeouts.clear("ie-resizing-thumbnails"), Z.timeouts.set("ie-resizing-thumbnails", $.proxy(function () {
                this.updateVars();
                var b = a.thumbnails.width;
                this._thumbs.css({
                    width: b + "px"
                }), this.slide.css({
                    width: this._thumbnails.length * a.thumbnail.outerWidth + 1 + "px"
                })
            }, this), 500)), this._thumbs.css({
                width: b + "px"
            }), this.slide.css({
                width: this._thumbnails.length * a.thumbnail.outerWidth + 1 + "px"
            });
            var c = a.wrapper.width + 1;
            if (this.wrapper.css({
                width: c + "px",
                "margin-left": -.5 * c + "px"
            }), this._previous.add(this._next).css({
                height: a.thumbnail.height + "px"
            }), this._position && this.moveTo(this._position, !0), Browser.IE && 9 > Browser.IE) {
                var d = Z.element,
                    e = Z.bubble,
                    f = d.is(":visible");
                f || d.show();
                var g = e.is(":visible");
                g || e.show(), this._thumbs.height("100%"), this._thumbs.css({
                    height: this._thumbs.innerHeight() + "px"
                }), this.thumbnails.find(".fr-thumbnail-overlay-border").hide(), g || e.hide(), f || d.hide()
            }
        },
        moveToPage: function (a) {
            if (!(1 > a || a > this._vars.pages || a == this._page)) {
                var b = this._vars.ipp * (a - 1) + 1;
                this.moveTo(b)
            }
        },
        previousPage: function () {
            this.moveToPage(this._page - 1)
        },
        nextPage: function () {
            this.moveToPage(this._page + 1)
        },
        adjustToViewport: function () {
            var a = Bounds.viewport();
            return a
        },
        setPosition: function (a) {
            if (!(Browser.IE && 7 > Browser.IE)) {
                var b = 0 > this._position;
                1 > a && (a = 1);
                var c = this._thumbnails.length;
                a > c && (a = c), this._position = a, this.setActive(a), ("page" != this._mode || this._page != Math.ceil(a / this._vars.ipp)) && this.moveTo(a, b)
            }
        },
        moveTo: function (a, b) {
            this.updateVars();
            var c, d = Bounds.viewport().width,
                e = .5 * d,
                f = this._vars.thumbnail.outerWidth;
            if ("page" == this._mode) {
                var g = Math.ceil(a / this._vars.ipp);
                this._page = g, c = -1 * f * (this._page - 1) * this._vars.ipp;
                var h = "fr-thumbnails-side-button-disabled";
                this._previous_button[(2 > g ? "add" : "remove") + "Class"](h), this._next_button[(g >= this._vars.pages ? "add" : "remove") + "Class"](h)
            } else c = e + -1 * (f * (a - 1) + .5 * f);
            var i = Frames._frames && Frames._frames[Frames._position - 1];
            this.slide.stop(1, 0).animate({
                left: c + "px"
            }, b ? 0 : i ? i.view.options.effects.thumbnails.slide : 0, $.proxy(function () {
                this.loadCurrentPage()
            }, this))
        },
        loadCurrentPage: function () {
            var a, b;
            if (this._position && this._vars.thumbnail.outerWidth && !(1 > this._thumbnails.length)) {
                if ("page" == this._mode) {
                    if (1 > this._page) return;
                    a = (this._page - 1) * this._vars.ipp + 1, b = Math.min(a - 1 + this._vars.ipp, this._thumbnails.length)
                } else {
                    var c = Math.ceil(Bounds.viewport().width / this._vars.thumbnail.outerWidth);
                    a = Math.max(Math.floor(Math.max(this._position - .5 * c, 0)), 1), b = Math.ceil(Math.min(this._position + .5 * c)), b > this._thumbnails.length && (b = this._thumbnails.length)
                }
                for (var d = a; b >= d; d++) this._thumbnails[d - 1].load()
            }
        },
        setActive: function (a) {
            $.each(this._thumbnails, function (a, b) {
                b.deactivate()
            });
            var b = a && this._thumbnails[a - 1];
            b && b.activate()
        },
        refresh: function () {
            this._position && this.setPosition(this._position)
        }
    };
    $.extend(Thumbnail.prototype, {
        initialize: function (a, b, c) {
            this.element = a, this.view = b, this._dimension = {}, this._position = c, this.build()
        },
        build: function () {
            var a = this.view.options;
            this.element.append(this.thumbnail = $("<div>").addClass("fr-thumbnail").append(this.thumbnail_wrapper = $("<div>").addClass("fr-thumbnail-wrapper"))), "image" == this.view.type && this.thumbnail.addClass("fr-load-thumbnail").data("thumbnail", {
                view: this.view,
                src: a.thumbnail || this.view.url
            });
            var b = a.thumbnail && a.thumbnail.icon;
            b && this.thumbnail.append($("<div>").addClass("fr-thumbnail-icon fr-thumbnail-icon-" + b));
            var c;
            this.thumbnail.append(c = $("<div>").addClass("fr-thumbnail-overlay").append($("<div>").addClass("fr-thumbnail-overlay-background")).append(this.loading = $("<div>").addClass("fr-thumbnail-loading").append($("<div>").addClass("fr-thumbnail-loading-background")).append($("<div>").addClass("fr-thumbnail-loading-icon"))).append($("<div>").addClass("fr-thumbnail-overlay-border"))), this.thumbnail.append($("<div>").addClass("fr-thumbnail-state"))
        },
        remove: function () {
            this.thumbnail.remove(), this.thumbnail = null, this.thumbnail_image = null
        },
        load: function () {
            if (!this._loaded && !this._loading && bb.visible()) {
                this._loading = !0;
                var a = this.view.options.thumbnail,
                    b = a && "boolean" == $.type(a) ? this.view.url : a || this.view.url;
                this._url = b, b && ("vimeo" == this.view.type ? $.getJSON("http://vimeo.com/api/v2/video/" + this.view._data.id + ".json?callback=?", $.proxy(function (a) {
                    a && a[0] && a[0].thumbnail_medium ? (this._url = a[0].thumbnail_medium, ba.preload(this._url, {
                        type: "image"
                    }, $.proxy(this._afterLoad, this))) : (this._loaded = !0, this._loading = !1, this.loading.stop(1, 0).delay(this.view.options.effects.thumbnails.delay).fadeTo(this.view.options.effects.thumbnails.load, 0))
                }, this)) : ba.preload(this._url, {
                    type: "image"
                }, $.proxy(this._afterLoad, this)))
            }
        },
        _afterLoad: function (a) {
            this.thumbnail && (this._loaded = !0, this._loading = !1, this._dimensions = a, this.image = $("<img>").attr({
                src: this._url
            }), this.thumbnail_wrapper.prepend(this.image), this.resize(), this.loading.stop(1, 0).delay(this.view.options.effects.thumbnails.delay).fadeTo(this.view.options.effects.thumbnails.load, 0))
        },
        resize: function () {
            var a = bb._vars.thumbnail.height;
            if (this.thumbnail.css({
                width: a + "px",
                height: a + "px"
            }), this.image) {
                var d, b = {
                    width: a,
                    height: a
                }, c = Math.max(b.width, b.height),
                    e = $.extend({}, this._dimensions);
                if (e.width > b.width && e.height > b.height) {
                    d = Fit.within(e, {
                        bounds: b
                    });
                    var f = 1,
                        g = 1;
                    d.width < b.width && (f = b.width / d.width), d.height < b.height && (g = b.height / d.height);
                    var h = Math.max(f, g);
                    h > 1 && (d.width *= h, d.height *= h), $.each("width height".split(" "), function (a, b) {
                        d[b] = Math.round(d[b])
                    })
                } else d = Fit.within(e.width < b.width || e.height < b.height ? {
                    width: c,
                    height: c
                } : b, {
                    bounds: this._dimensions
                });
                var i = Math.round(.5 * b.width - .5 * d.width),
                    j = Math.round(.5 * b.height - .5 * d.height);
                this.image.css(px(d)).css(px({
                    top: j,
                    left: i
                }))
            }
        },
        activate: function () {
            this.thumbnail.addClass("fr-thumbnail-active")
        },
        deactivate: function () {
            this.thumbnail.removeClass("fr-thumbnail-active")
        }
    });
    var bc = {
        show: function (d) {
            var e = arguments[1] || {}, position = arguments[2];
            arguments[1] && "number" == $.type(arguments[1]) && (position = arguments[1], e = Y.create({}));
            var f = [],
                object_type;
            switch (object_type = $.type(d)) {
                case "string":
                case "object":
                    var g = new View(d, e),
                        _dgo = "data-fresco-group-options";
                    if (g.group) {
                        if (_.isElement(d)) {
                            var h = $('.fresco[data-fresco-group="' + $(d).data("fresco-group") + '"]'),
                                j = {};
                            h.filter("[" + _dgo + "]").each(function (i, a) {
                                $.extend(j, eval("({" + ($(a).attr(_dgo) || "") + "})"))
                            }), h.each(function (a, b) {
                                position || b != d || (position = a + 1), f.push(new View(b, $.extend({}, j, e)))
                            })
                        }
                    } else {
                        var j = {};
                        _.isElement(d) && $(d).is("[" + _dgo + "]") && ($.extend(j, eval("({" + ($(d).attr(_dgo) || "") + "})")), g = new View(d, $.extend({}, j, e))), f.push(g)
                    }
                    break;
                case "array":
                    $.each(d, function (a, b) {
                        var c = new View(b, e);
                        f.push(c)
                    })
            }(!position || 1 > position) && (position = 1), position > f.length && (position = f.length), Frames._xyp || Frames.setXY({
                x: 0,
                y: 0
            }), Z.load(f, position, {
                callback: function () {
                    Z.show(function () {})
                }
            })
        }
    };
    $.extend(Fresco, {
        initialize: function () {
            W.check("jQuery"), Z.initialize()
        }
    });
    var bd = {
        image: {
            extensions: "bmp gif jpeg jpg png",
            detect: function (a) {
                return $.inArray(detectExtension(a), this.extensions.split(" ")) > -1
            },
            data: function (a) {
                return this.detect() ? {
                    extension: detectExtension(a)
                } : !1
            }
        }
    };
    Browser.Android && 3 > Browser.Android && $.each(Z, function (a, b) {
        "function" == $.type(b) && (Z[a] = function () {
            return this
        })
    }), window.Fresco = Fresco, $(document).ready(function () {
        Fresco.initialize()
    })
})($);

return $;
});