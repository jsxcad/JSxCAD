var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var chroma = createCommonjsModule(function (module, exports) {
/**
 * chroma.js - JavaScript library for color conversions
 *
 * Copyright (c) 2011-2019, Gregor Aisch
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. The name Gregor Aisch may not be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * -------------------------------------------------------
 *
 * chroma.js includes colors from colorbrewer2.org, which are released under
 * the following license:
 *
 * Copyright (c) 2002 Cynthia Brewer, Mark Harrower,
 * and The Pennsylvania State University.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * ------------------------------------------------------
 *
 * Named colors are taken from X11 Color Names.
 * http://www.w3.org/TR/css3-color/#svg-color
 *
 * @preserve
 */

(function (global, factory) {
     module.exports = factory() ;
}(commonjsGlobal, (function () {
    var limit = function (x, min, max) {
        if ( min === void 0 ) min=0;
        if ( max === void 0 ) max=1;

        return x < min ? min : x > max ? max : x;
    };

    var clip_rgb = function (rgb) {
        rgb._clipped = false;
        rgb._unclipped = rgb.slice(0);
        for (var i=0; i<=3; i++) {
            if (i < 3) {
                if (rgb[i] < 0 || rgb[i] > 255) { rgb._clipped = true; }
                rgb[i] = limit(rgb[i], 0, 255);
            } else if (i === 3) {
                rgb[i] = limit(rgb[i], 0, 1);
            }
        }
        return rgb;
    };

    // ported from jQuery's $.type
    var classToType = {};
    for (var i = 0, list = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Undefined', 'Null']; i < list.length; i += 1) {
        var name = list[i];

        classToType[("[object " + name + "]")] = name.toLowerCase();
    }
    var type = function(obj) {
        return classToType[Object.prototype.toString.call(obj)] || "object";
    };

    var unpack = function (args, keyOrder) {
        if ( keyOrder === void 0 ) keyOrder=null;

    	// if called with more than 3 arguments, we return the arguments
        if (args.length >= 3) { return Array.prototype.slice.call(args); }
        // with less than 3 args we check if first arg is object
        // and use the keyOrder string to extract and sort properties
    	if (type(args[0]) == 'object' && keyOrder) {
    		return keyOrder.split('')
    			.filter(function (k) { return args[0][k] !== undefined; })
    			.map(function (k) { return args[0][k]; });
    	}
    	// otherwise we just return the first argument
    	// (which we suppose is an array of args)
        return args[0];
    };

    var last = function (args) {
        if (args.length < 2) { return null; }
        var l = args.length-1;
        if (type(args[l]) == 'string') { return args[l].toLowerCase(); }
        return null;
    };

    var PI = Math.PI;

    var utils = {
    	clip_rgb: clip_rgb,
    	limit: limit,
    	type: type,
    	unpack: unpack,
    	last: last,
    	PI: PI,
    	TWOPI: PI*2,
    	PITHIRD: PI/3,
    	DEG2RAD: PI / 180,
    	RAD2DEG: 180 / PI
    };

    var input = {
    	format: {},
    	autodetect: []
    };

    var last$1 = utils.last;
    var clip_rgb$1 = utils.clip_rgb;
    var type$1 = utils.type;


    var Color = function Color() {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var me = this;
        if (type$1(args[0]) === 'object' &&
            args[0].constructor &&
            args[0].constructor === this.constructor) {
            // the argument is already a Color instance
            return args[0];
        }

        // last argument could be the mode
        var mode = last$1(args);
        var autodetect = false;

        if (!mode) {
            autodetect = true;
            if (!input.sorted) {
                input.autodetect = input.autodetect.sort(function (a,b) { return b.p - a.p; });
                input.sorted = true;
            }
            // auto-detect format
            for (var i = 0, list = input.autodetect; i < list.length; i += 1) {
                var chk = list[i];

                mode = chk.test.apply(chk, args);
                if (mode) { break; }
            }
        }

        if (input.format[mode]) {
            var rgb = input.format[mode].apply(null, autodetect ? args : args.slice(0,-1));
            me._rgb = clip_rgb$1(rgb);
        } else {
            throw new Error('unknown format: '+args);
        }

        // add alpha channel
        if (me._rgb.length === 3) { me._rgb.push(1); }
    };

    Color.prototype.toString = function toString () {
        if (type$1(this.hex) == 'function') { return this.hex(); }
        return ("[" + (this._rgb.join(',')) + "]");
    };

    var Color_1 = Color;

    var chroma = function () {
    	var args = [], len = arguments.length;
    	while ( len-- ) args[ len ] = arguments[ len ];

    	return new (Function.prototype.bind.apply( chroma.Color, [ null ].concat( args) ));
    };

    chroma.Color = Color_1;
    chroma.version = '2.1.0';

    var chroma_1 = chroma;

    var unpack$1 = utils.unpack;
    var max = Math.max;

    var rgb2cmyk = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$1(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        r = r / 255;
        g = g / 255;
        b = b / 255;
        var k = 1 - max(r,max(g,b));
        var f = k < 1 ? 1 / (1-k) : 0;
        var c = (1-r-k) * f;
        var m = (1-g-k) * f;
        var y = (1-b-k) * f;
        return [c,m,y,k];
    };

    var rgb2cmyk_1 = rgb2cmyk;

    var unpack$2 = utils.unpack;

    var cmyk2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$2(args, 'cmyk');
        var c = args[0];
        var m = args[1];
        var y = args[2];
        var k = args[3];
        var alpha = args.length > 4 ? args[4] : 1;
        if (k === 1) { return [0,0,0,alpha]; }
        return [
            c >= 1 ? 0 : 255 * (1-c) * (1-k), // r
            m >= 1 ? 0 : 255 * (1-m) * (1-k), // g
            y >= 1 ? 0 : 255 * (1-y) * (1-k), // b
            alpha
        ];
    };

    var cmyk2rgb_1 = cmyk2rgb;

    var unpack$3 = utils.unpack;
    var type$2 = utils.type;



    Color_1.prototype.cmyk = function() {
        return rgb2cmyk_1(this._rgb);
    };

    chroma_1.cmyk = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['cmyk']) ));
    };

    input.format.cmyk = cmyk2rgb_1;

    input.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$3(args, 'cmyk');
            if (type$2(args) === 'array' && args.length === 4) {
                return 'cmyk';
            }
        }
    });

    var unpack$4 = utils.unpack;
    var last$2 = utils.last;
    var rnd = function (a) { return Math.round(a*100)/100; };

    /*
     * supported arguments:
     * - hsl2css(h,s,l)
     * - hsl2css(h,s,l,a)
     * - hsl2css([h,s,l], mode)
     * - hsl2css([h,s,l,a], mode)
     * - hsl2css({h,s,l,a}, mode)
     */
    var hsl2css = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var hsla = unpack$4(args, 'hsla');
        var mode = last$2(args) || 'lsa';
        hsla[0] = rnd(hsla[0] || 0);
        hsla[1] = rnd(hsla[1]*100) + '%';
        hsla[2] = rnd(hsla[2]*100) + '%';
        if (mode === 'hsla' || (hsla.length > 3 && hsla[3]<1)) {
            hsla[3] = hsla.length > 3 ? hsla[3] : 1;
            mode = 'hsla';
        } else {
            hsla.length = 3;
        }
        return (mode + "(" + (hsla.join(',')) + ")");
    };

    var hsl2css_1 = hsl2css;

    var unpack$5 = utils.unpack;

    /*
     * supported arguments:
     * - rgb2hsl(r,g,b)
     * - rgb2hsl(r,g,b,a)
     * - rgb2hsl([r,g,b])
     * - rgb2hsl([r,g,b,a])
     * - rgb2hsl({r,g,b,a})
     */
    var rgb2hsl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$5(args, 'rgba');
        var r = args[0];
        var g = args[1];
        var b = args[2];

        r /= 255;
        g /= 255;
        b /= 255;

        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);

        var l = (max + min) / 2;
        var s, h;

        if (max === min){
            s = 0;
            h = Number.NaN;
        } else {
            s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
        }

        if (r == max) { h = (g - b) / (max - min); }
        else if (g == max) { h = 2 + (b - r) / (max - min); }
        else if (b == max) { h = 4 + (r - g) / (max - min); }

        h *= 60;
        if (h < 0) { h += 360; }
        if (args.length>3 && args[3]!==undefined) { return [h,s,l,args[3]]; }
        return [h,s,l];
    };

    var rgb2hsl_1 = rgb2hsl;

    var unpack$6 = utils.unpack;
    var last$3 = utils.last;


    var round = Math.round;

    /*
     * supported arguments:
     * - rgb2css(r,g,b)
     * - rgb2css(r,g,b,a)
     * - rgb2css([r,g,b], mode)
     * - rgb2css([r,g,b,a], mode)
     * - rgb2css({r,g,b,a}, mode)
     */
    var rgb2css = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgba = unpack$6(args, 'rgba');
        var mode = last$3(args) || 'rgb';
        if (mode.substr(0,3) == 'hsl') {
            return hsl2css_1(rgb2hsl_1(rgba), mode);
        }
        rgba[0] = round(rgba[0]);
        rgba[1] = round(rgba[1]);
        rgba[2] = round(rgba[2]);
        if (mode === 'rgba' || (rgba.length > 3 && rgba[3]<1)) {
            rgba[3] = rgba.length > 3 ? rgba[3] : 1;
            mode = 'rgba';
        }
        return (mode + "(" + (rgba.slice(0,mode==='rgb'?3:4).join(',')) + ")");
    };

    var rgb2css_1 = rgb2css;

    var unpack$7 = utils.unpack;
    var round$1 = Math.round;

    var hsl2rgb = function () {
        var assign;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        args = unpack$7(args, 'hsl');
        var h = args[0];
        var s = args[1];
        var l = args[2];
        var r,g,b;
        if (s === 0) {
            r = g = b = l*255;
        } else {
            var t3 = [0,0,0];
            var c = [0,0,0];
            var t2 = l < 0.5 ? l * (1+s) : l+s-l*s;
            var t1 = 2 * l - t2;
            var h_ = h / 360;
            t3[0] = h_ + 1/3;
            t3[1] = h_;
            t3[2] = h_ - 1/3;
            for (var i=0; i<3; i++) {
                if (t3[i] < 0) { t3[i] += 1; }
                if (t3[i] > 1) { t3[i] -= 1; }
                if (6 * t3[i] < 1)
                    { c[i] = t1 + (t2 - t1) * 6 * t3[i]; }
                else if (2 * t3[i] < 1)
                    { c[i] = t2; }
                else if (3 * t3[i] < 2)
                    { c[i] = t1 + (t2 - t1) * ((2 / 3) - t3[i]) * 6; }
                else
                    { c[i] = t1; }
            }
            (assign = [round$1(c[0]*255),round$1(c[1]*255),round$1(c[2]*255)], r = assign[0], g = assign[1], b = assign[2]);
        }
        if (args.length > 3) {
            // keep alpha channel
            return [r,g,b,args[3]];
        }
        return [r,g,b,1];
    };

    var hsl2rgb_1 = hsl2rgb;

    var RE_RGB = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/;
    var RE_RGBA = /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/;
    var RE_RGB_PCT = /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
    var RE_RGBA_PCT = /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;
    var RE_HSL = /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
    var RE_HSLA = /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;

    var round$2 = Math.round;

    var css2rgb = function (css) {
        css = css.toLowerCase().trim();
        var m;

        if (input.format.named) {
            try {
                return input.format.named(css);
            } catch (e) {
                // eslint-disable-next-line
            }
        }

        // rgb(250,20,0)
        if ((m = css.match(RE_RGB))) {
            var rgb = m.slice(1,4);
            for (var i=0; i<3; i++) {
                rgb[i] = +rgb[i];
            }
            rgb[3] = 1;  // default alpha
            return rgb;
        }

        // rgba(250,20,0,0.4)
        if ((m = css.match(RE_RGBA))) {
            var rgb$1 = m.slice(1,5);
            for (var i$1=0; i$1<4; i$1++) {
                rgb$1[i$1] = +rgb$1[i$1];
            }
            return rgb$1;
        }

        // rgb(100%,0%,0%)
        if ((m = css.match(RE_RGB_PCT))) {
            var rgb$2 = m.slice(1,4);
            for (var i$2=0; i$2<3; i$2++) {
                rgb$2[i$2] = round$2(rgb$2[i$2] * 2.55);
            }
            rgb$2[3] = 1;  // default alpha
            return rgb$2;
        }

        // rgba(100%,0%,0%,0.4)
        if ((m = css.match(RE_RGBA_PCT))) {
            var rgb$3 = m.slice(1,5);
            for (var i$3=0; i$3<3; i$3++) {
                rgb$3[i$3] = round$2(rgb$3[i$3] * 2.55);
            }
            rgb$3[3] = +rgb$3[3];
            return rgb$3;
        }

        // hsl(0,100%,50%)
        if ((m = css.match(RE_HSL))) {
            var hsl = m.slice(1,4);
            hsl[1] *= 0.01;
            hsl[2] *= 0.01;
            var rgb$4 = hsl2rgb_1(hsl);
            rgb$4[3] = 1;
            return rgb$4;
        }

        // hsla(0,100%,50%,0.5)
        if ((m = css.match(RE_HSLA))) {
            var hsl$1 = m.slice(1,4);
            hsl$1[1] *= 0.01;
            hsl$1[2] *= 0.01;
            var rgb$5 = hsl2rgb_1(hsl$1);
            rgb$5[3] = +m[4];  // default alpha = 1
            return rgb$5;
        }
    };

    css2rgb.test = function (s) {
        return RE_RGB.test(s) ||
            RE_RGBA.test(s) ||
            RE_RGB_PCT.test(s) ||
            RE_RGBA_PCT.test(s) ||
            RE_HSL.test(s) ||
            RE_HSLA.test(s);
    };

    var css2rgb_1 = css2rgb;

    var type$3 = utils.type;




    Color_1.prototype.css = function(mode) {
        return rgb2css_1(this._rgb, mode);
    };

    chroma_1.css = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['css']) ));
    };

    input.format.css = css2rgb_1;

    input.autodetect.push({
        p: 5,
        test: function (h) {
            var rest = [], len = arguments.length - 1;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

            if (!rest.length && type$3(h) === 'string' && css2rgb_1.test(h)) {
                return 'css';
            }
        }
    });

    var unpack$8 = utils.unpack;

    input.format.gl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgb = unpack$8(args, 'rgba');
        rgb[0] *= 255;
        rgb[1] *= 255;
        rgb[2] *= 255;
        return rgb;
    };

    chroma_1.gl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['gl']) ));
    };

    Color_1.prototype.gl = function() {
        var rgb = this._rgb;
        return [rgb[0]/255, rgb[1]/255, rgb[2]/255, rgb[3]];
    };

    var unpack$9 = utils.unpack;

    var rgb2hcg = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$9(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);
        var delta = max - min;
        var c = delta * 100 / 255;
        var _g = min / (255 - delta) * 100;
        var h;
        if (delta === 0) {
            h = Number.NaN;
        } else {
            if (r === max) { h = (g - b) / delta; }
            if (g === max) { h = 2+(b - r) / delta; }
            if (b === max) { h = 4+(r - g) / delta; }
            h *= 60;
            if (h < 0) { h += 360; }
        }
        return [h, c, _g];
    };

    var rgb2hcg_1 = rgb2hcg;

    var unpack$a = utils.unpack;
    var floor = Math.floor;

    /*
     * this is basically just HSV with some minor tweaks
     *
     * hue.. [0..360]
     * chroma .. [0..1]
     * grayness .. [0..1]
     */

    var hcg2rgb = function () {
        var assign, assign$1, assign$2, assign$3, assign$4, assign$5;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        args = unpack$a(args, 'hcg');
        var h = args[0];
        var c = args[1];
        var _g = args[2];
        var r,g,b;
        _g = _g * 255;
        var _c = c * 255;
        if (c === 0) {
            r = g = b = _g;
        } else {
            if (h === 360) { h = 0; }
            if (h > 360) { h -= 360; }
            if (h < 0) { h += 360; }
            h /= 60;
            var i = floor(h);
            var f = h - i;
            var p = _g * (1 - c);
            var q = p + _c * (1 - f);
            var t = p + _c * f;
            var v = p + _c;
            switch (i) {
                case 0: (assign = [v, t, p], r = assign[0], g = assign[1], b = assign[2]); break
                case 1: (assign$1 = [q, v, p], r = assign$1[0], g = assign$1[1], b = assign$1[2]); break
                case 2: (assign$2 = [p, v, t], r = assign$2[0], g = assign$2[1], b = assign$2[2]); break
                case 3: (assign$3 = [p, q, v], r = assign$3[0], g = assign$3[1], b = assign$3[2]); break
                case 4: (assign$4 = [t, p, v], r = assign$4[0], g = assign$4[1], b = assign$4[2]); break
                case 5: (assign$5 = [v, p, q], r = assign$5[0], g = assign$5[1], b = assign$5[2]); break
            }
        }
        return [r, g, b, args.length > 3 ? args[3] : 1];
    };

    var hcg2rgb_1 = hcg2rgb;

    var unpack$b = utils.unpack;
    var type$4 = utils.type;






    Color_1.prototype.hcg = function() {
        return rgb2hcg_1(this._rgb);
    };

    chroma_1.hcg = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['hcg']) ));
    };

    input.format.hcg = hcg2rgb_1;

    input.autodetect.push({
        p: 1,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$b(args, 'hcg');
            if (type$4(args) === 'array' && args.length === 3) {
                return 'hcg';
            }
        }
    });

    var unpack$c = utils.unpack;
    var last$4 = utils.last;
    var round$3 = Math.round;

    var rgb2hex = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$c(args, 'rgba');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var a = ref[3];
        var mode = last$4(args) || 'auto';
        if (a === undefined) { a = 1; }
        if (mode === 'auto') {
            mode = a < 1 ? 'rgba' : 'rgb';
        }
        r = round$3(r);
        g = round$3(g);
        b = round$3(b);
        var u = r << 16 | g << 8 | b;
        var str = "000000" + u.toString(16); //#.toUpperCase();
        str = str.substr(str.length - 6);
        var hxa = '0' + round$3(a * 255).toString(16);
        hxa = hxa.substr(hxa.length - 2);
        switch (mode.toLowerCase()) {
            case 'rgba': return ("#" + str + hxa);
            case 'argb': return ("#" + hxa + str);
            default: return ("#" + str);
        }
    };

    var rgb2hex_1 = rgb2hex;

    var RE_HEX = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    var RE_HEXA = /^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/;

    var hex2rgb = function (hex) {
        if (hex.match(RE_HEX)) {
            // remove optional leading #
            if (hex.length === 4 || hex.length === 7) {
                hex = hex.substr(1);
            }
            // expand short-notation to full six-digit
            if (hex.length === 3) {
                hex = hex.split('');
                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
            }
            var u = parseInt(hex, 16);
            var r = u >> 16;
            var g = u >> 8 & 0xFF;
            var b = u & 0xFF;
            return [r,g,b,1];
        }

        // match rgba hex format, eg #FF000077
        if (hex.match(RE_HEXA)) {
            if (hex.length === 5 || hex.length === 9) {
                // remove optional leading #
                hex = hex.substr(1);
            }
            // expand short-notation to full eight-digit
            if (hex.length === 4) {
                hex = hex.split('');
                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
            }
            var u$1 = parseInt(hex, 16);
            var r$1 = u$1 >> 24 & 0xFF;
            var g$1 = u$1 >> 16 & 0xFF;
            var b$1 = u$1 >> 8 & 0xFF;
            var a = Math.round((u$1 & 0xFF) / 0xFF * 100) / 100;
            return [r$1,g$1,b$1,a];
        }

        // we used to check for css colors here
        // if _input.css? and rgb = _input.css hex
        //     return rgb

        throw new Error(("unknown hex color: " + hex));
    };

    var hex2rgb_1 = hex2rgb;

    var type$5 = utils.type;




    Color_1.prototype.hex = function(mode) {
        return rgb2hex_1(this._rgb, mode);
    };

    chroma_1.hex = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['hex']) ));
    };

    input.format.hex = hex2rgb_1;
    input.autodetect.push({
        p: 4,
        test: function (h) {
            var rest = [], len = arguments.length - 1;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

            if (!rest.length && type$5(h) === 'string' && [3,4,5,6,7,8,9].indexOf(h.length) >= 0) {
                return 'hex';
            }
        }
    });

    var unpack$d = utils.unpack;
    var TWOPI = utils.TWOPI;
    var min = Math.min;
    var sqrt = Math.sqrt;
    var acos = Math.acos;

    var rgb2hsi = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        /*
        borrowed from here:
        http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/rgb2hsi.cpp
        */
        var ref = unpack$d(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        r /= 255;
        g /= 255;
        b /= 255;
        var h;
        var min_ = min(r,g,b);
        var i = (r+g+b) / 3;
        var s = i > 0 ? 1 - min_/i : 0;
        if (s === 0) {
            h = NaN;
        } else {
            h = ((r-g)+(r-b)) / 2;
            h /= sqrt((r-g)*(r-g) + (r-b)*(g-b));
            h = acos(h);
            if (b > g) {
                h = TWOPI - h;
            }
            h /= TWOPI;
        }
        return [h*360,s,i];
    };

    var rgb2hsi_1 = rgb2hsi;

    var unpack$e = utils.unpack;
    var limit$1 = utils.limit;
    var TWOPI$1 = utils.TWOPI;
    var PITHIRD = utils.PITHIRD;
    var cos = Math.cos;

    /*
     * hue [0..360]
     * saturation [0..1]
     * intensity [0..1]
     */
    var hsi2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        /*
        borrowed from here:
        http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/hsi2rgb.cpp
        */
        args = unpack$e(args, 'hsi');
        var h = args[0];
        var s = args[1];
        var i = args[2];
        var r,g,b;

        if (isNaN(h)) { h = 0; }
        if (isNaN(s)) { s = 0; }
        // normalize hue
        if (h > 360) { h -= 360; }
        if (h < 0) { h += 360; }
        h /= 360;
        if (h < 1/3) {
            b = (1-s)/3;
            r = (1+s*cos(TWOPI$1*h)/cos(PITHIRD-TWOPI$1*h))/3;
            g = 1 - (b+r);
        } else if (h < 2/3) {
            h -= 1/3;
            r = (1-s)/3;
            g = (1+s*cos(TWOPI$1*h)/cos(PITHIRD-TWOPI$1*h))/3;
            b = 1 - (r+g);
        } else {
            h -= 2/3;
            g = (1-s)/3;
            b = (1+s*cos(TWOPI$1*h)/cos(PITHIRD-TWOPI$1*h))/3;
            r = 1 - (g+b);
        }
        r = limit$1(i*r*3);
        g = limit$1(i*g*3);
        b = limit$1(i*b*3);
        return [r*255, g*255, b*255, args.length > 3 ? args[3] : 1];
    };

    var hsi2rgb_1 = hsi2rgb;

    var unpack$f = utils.unpack;
    var type$6 = utils.type;






    Color_1.prototype.hsi = function() {
        return rgb2hsi_1(this._rgb);
    };

    chroma_1.hsi = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['hsi']) ));
    };

    input.format.hsi = hsi2rgb_1;

    input.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$f(args, 'hsi');
            if (type$6(args) === 'array' && args.length === 3) {
                return 'hsi';
            }
        }
    });

    var unpack$g = utils.unpack;
    var type$7 = utils.type;






    Color_1.prototype.hsl = function() {
        return rgb2hsl_1(this._rgb);
    };

    chroma_1.hsl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['hsl']) ));
    };

    input.format.hsl = hsl2rgb_1;

    input.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$g(args, 'hsl');
            if (type$7(args) === 'array' && args.length === 3) {
                return 'hsl';
            }
        }
    });

    var unpack$h = utils.unpack;
    var min$1 = Math.min;
    var max$1 = Math.max;

    /*
     * supported arguments:
     * - rgb2hsv(r,g,b)
     * - rgb2hsv([r,g,b])
     * - rgb2hsv({r,g,b})
     */
    var rgb2hsl$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$h(args, 'rgb');
        var r = args[0];
        var g = args[1];
        var b = args[2];
        var min_ = min$1(r, g, b);
        var max_ = max$1(r, g, b);
        var delta = max_ - min_;
        var h,s,v;
        v = max_ / 255.0;
        if (max_ === 0) {
            h = Number.NaN;
            s = 0;
        } else {
            s = delta / max_;
            if (r === max_) { h = (g - b) / delta; }
            if (g === max_) { h = 2+(b - r) / delta; }
            if (b === max_) { h = 4+(r - g) / delta; }
            h *= 60;
            if (h < 0) { h += 360; }
        }
        return [h, s, v]
    };

    var rgb2hsv = rgb2hsl$1;

    var unpack$i = utils.unpack;
    var floor$1 = Math.floor;

    var hsv2rgb = function () {
        var assign, assign$1, assign$2, assign$3, assign$4, assign$5;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        args = unpack$i(args, 'hsv');
        var h = args[0];
        var s = args[1];
        var v = args[2];
        var r,g,b;
        v *= 255;
        if (s === 0) {
            r = g = b = v;
        } else {
            if (h === 360) { h = 0; }
            if (h > 360) { h -= 360; }
            if (h < 0) { h += 360; }
            h /= 60;

            var i = floor$1(h);
            var f = h - i;
            var p = v * (1 - s);
            var q = v * (1 - s * f);
            var t = v * (1 - s * (1 - f));

            switch (i) {
                case 0: (assign = [v, t, p], r = assign[0], g = assign[1], b = assign[2]); break
                case 1: (assign$1 = [q, v, p], r = assign$1[0], g = assign$1[1], b = assign$1[2]); break
                case 2: (assign$2 = [p, v, t], r = assign$2[0], g = assign$2[1], b = assign$2[2]); break
                case 3: (assign$3 = [p, q, v], r = assign$3[0], g = assign$3[1], b = assign$3[2]); break
                case 4: (assign$4 = [t, p, v], r = assign$4[0], g = assign$4[1], b = assign$4[2]); break
                case 5: (assign$5 = [v, p, q], r = assign$5[0], g = assign$5[1], b = assign$5[2]); break
            }
        }
        return [r,g,b,args.length > 3?args[3]:1];
    };

    var hsv2rgb_1 = hsv2rgb;

    var unpack$j = utils.unpack;
    var type$8 = utils.type;






    Color_1.prototype.hsv = function() {
        return rgb2hsv(this._rgb);
    };

    chroma_1.hsv = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['hsv']) ));
    };

    input.format.hsv = hsv2rgb_1;

    input.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$j(args, 'hsv');
            if (type$8(args) === 'array' && args.length === 3) {
                return 'hsv';
            }
        }
    });

    var labConstants = {
        // Corresponds roughly to RGB brighter/darker
        Kn: 18,

        // D65 standard referent
        Xn: 0.950470,
        Yn: 1,
        Zn: 1.088830,

        t0: 0.137931034,  // 4 / 29
        t1: 0.206896552,  // 6 / 29
        t2: 0.12841855,   // 3 * t1 * t1
        t3: 0.008856452,  // t1 * t1 * t1
    };

    var unpack$k = utils.unpack;
    var pow = Math.pow;

    var rgb2lab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$k(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = rgb2xyz(r,g,b);
        var x = ref$1[0];
        var y = ref$1[1];
        var z = ref$1[2];
        var l = 116 * y - 16;
        return [l < 0 ? 0 : l, 500 * (x - y), 200 * (y - z)];
    };

    var rgb_xyz = function (r) {
        if ((r /= 255) <= 0.04045) { return r / 12.92; }
        return pow((r + 0.055) / 1.055, 2.4);
    };

    var xyz_lab = function (t) {
        if (t > labConstants.t3) { return pow(t, 1 / 3); }
        return t / labConstants.t2 + labConstants.t0;
    };

    var rgb2xyz = function (r,g,b) {
        r = rgb_xyz(r);
        g = rgb_xyz(g);
        b = rgb_xyz(b);
        var x = xyz_lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / labConstants.Xn);
        var y = xyz_lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / labConstants.Yn);
        var z = xyz_lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / labConstants.Zn);
        return [x,y,z];
    };

    var rgb2lab_1 = rgb2lab;

    var unpack$l = utils.unpack;
    var pow$1 = Math.pow;

    /*
     * L* [0..100]
     * a [-100..100]
     * b [-100..100]
     */
    var lab2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$l(args, 'lab');
        var l = args[0];
        var a = args[1];
        var b = args[2];
        var x,y,z, r,g,b_;

        y = (l + 16) / 116;
        x = isNaN(a) ? y : y + a / 500;
        z = isNaN(b) ? y : y - b / 200;

        y = labConstants.Yn * lab_xyz(y);
        x = labConstants.Xn * lab_xyz(x);
        z = labConstants.Zn * lab_xyz(z);

        r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);  // D65 -> sRGB
        g = xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
        b_ = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);

        return [r,g,b_,args.length > 3 ? args[3] : 1];
    };

    var xyz_rgb = function (r) {
        return 255 * (r <= 0.00304 ? 12.92 * r : 1.055 * pow$1(r, 1 / 2.4) - 0.055)
    };

    var lab_xyz = function (t) {
        return t > labConstants.t1 ? t * t * t : labConstants.t2 * (t - labConstants.t0)
    };

    var lab2rgb_1 = lab2rgb;

    var unpack$m = utils.unpack;
    var type$9 = utils.type;






    Color_1.prototype.lab = function() {
        return rgb2lab_1(this._rgb);
    };

    chroma_1.lab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['lab']) ));
    };

    input.format.lab = lab2rgb_1;

    input.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$m(args, 'lab');
            if (type$9(args) === 'array' && args.length === 3) {
                return 'lab';
            }
        }
    });

    var unpack$n = utils.unpack;
    var RAD2DEG = utils.RAD2DEG;
    var sqrt$1 = Math.sqrt;
    var atan2 = Math.atan2;
    var round$4 = Math.round;

    var lab2lch = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$n(args, 'lab');
        var l = ref[0];
        var a = ref[1];
        var b = ref[2];
        var c = sqrt$1(a * a + b * b);
        var h = (atan2(b, a) * RAD2DEG + 360) % 360;
        if (round$4(c*10000) === 0) { h = Number.NaN; }
        return [l, c, h];
    };

    var lab2lch_1 = lab2lch;

    var unpack$o = utils.unpack;



    var rgb2lch = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$o(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = rgb2lab_1(r,g,b);
        var l = ref$1[0];
        var a = ref$1[1];
        var b_ = ref$1[2];
        return lab2lch_1(l,a,b_);
    };

    var rgb2lch_1 = rgb2lch;

    var unpack$p = utils.unpack;
    var DEG2RAD = utils.DEG2RAD;
    var sin = Math.sin;
    var cos$1 = Math.cos;

    var lch2lab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        /*
        Convert from a qualitative parameter h and a quantitative parameter l to a 24-bit pixel.
        These formulas were invented by David Dalrymple to obtain maximum contrast without going
        out of gamut if the parameters are in the range 0-1.

        A saturation multiplier was added by Gregor Aisch
        */
        var ref = unpack$p(args, 'lch');
        var l = ref[0];
        var c = ref[1];
        var h = ref[2];
        if (isNaN(h)) { h = 0; }
        h = h * DEG2RAD;
        return [l, cos$1(h) * c, sin(h) * c]
    };

    var lch2lab_1 = lch2lab;

    var unpack$q = utils.unpack;



    var lch2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$q(args, 'lch');
        var l = args[0];
        var c = args[1];
        var h = args[2];
        var ref = lch2lab_1 (l,c,h);
        var L = ref[0];
        var a = ref[1];
        var b_ = ref[2];
        var ref$1 = lab2rgb_1 (L,a,b_);
        var r = ref$1[0];
        var g = ref$1[1];
        var b = ref$1[2];
        return [r, g, b, args.length > 3 ? args[3] : 1];
    };

    var lch2rgb_1 = lch2rgb;

    var unpack$r = utils.unpack;


    var hcl2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var hcl = unpack$r(args, 'hcl').reverse();
        return lch2rgb_1.apply(void 0, hcl);
    };

    var hcl2rgb_1 = hcl2rgb;

    var unpack$s = utils.unpack;
    var type$a = utils.type;






    Color_1.prototype.lch = function() { return rgb2lch_1(this._rgb); };
    Color_1.prototype.hcl = function() { return rgb2lch_1(this._rgb).reverse(); };

    chroma_1.lch = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['lch']) ));
    };
    chroma_1.hcl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['hcl']) ));
    };

    input.format.lch = lch2rgb_1;
    input.format.hcl = hcl2rgb_1;

    ['lch','hcl'].forEach(function (m) { return input.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$s(args, m);
            if (type$a(args) === 'array' && args.length === 3) {
                return m;
            }
        }
    }); });

    /**
    	X11 color names

    	http://www.w3.org/TR/css3-color/#svg-color
    */

    var w3cx11 = {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflower: '#6495ed',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkgrey: '#a9a9a9',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkslategrey: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dimgrey: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        gold: '#ffd700',
        goldenrod: '#daa520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        grey: '#808080',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        indianred: '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        laserlemon: '#ffff54',
        lavender: '#e6e6fa',
        lavenderblush: '#fff0f5',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrod: '#fafad2',
        lightgoldenrodyellow: '#fafad2',
        lightgray: '#d3d3d3',
        lightgreen: '#90ee90',
        lightgrey: '#d3d3d3',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightslategrey: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        maroon2: '#7f0000',
        maroon3: '#b03060',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370db',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#db7093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        purple2: '#7f007f',
        purple3: '#a020f0',
        rebeccapurple: '#663399',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        slategrey: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32'
    };

    var w3cx11_1 = w3cx11;

    var type$b = utils.type;





    Color_1.prototype.name = function() {
        var hex = rgb2hex_1(this._rgb, 'rgb');
        for (var i = 0, list = Object.keys(w3cx11_1); i < list.length; i += 1) {
            var n = list[i];

            if (w3cx11_1[n] === hex) { return n.toLowerCase(); }
        }
        return hex;
    };

    input.format.named = function (name) {
        name = name.toLowerCase();
        if (w3cx11_1[name]) { return hex2rgb_1(w3cx11_1[name]); }
        throw new Error('unknown color name: '+name);
    };

    input.autodetect.push({
        p: 5,
        test: function (h) {
            var rest = [], len = arguments.length - 1;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

            if (!rest.length && type$b(h) === 'string' && w3cx11_1[h.toLowerCase()]) {
                return 'named';
            }
        }
    });

    var unpack$t = utils.unpack;

    var rgb2num = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$t(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        return (r << 16) + (g << 8) + b;
    };

    var rgb2num_1 = rgb2num;

    var type$c = utils.type;

    var num2rgb = function (num) {
        if (type$c(num) == "number" && num >= 0 && num <= 0xFFFFFF) {
            var r = num >> 16;
            var g = (num >> 8) & 0xFF;
            var b = num & 0xFF;
            return [r,g,b,1];
        }
        throw new Error("unknown num color: "+num);
    };

    var num2rgb_1 = num2rgb;

    var type$d = utils.type;



    Color_1.prototype.num = function() {
        return rgb2num_1(this._rgb);
    };

    chroma_1.num = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['num']) ));
    };

    input.format.num = num2rgb_1;

    input.autodetect.push({
        p: 5,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            if (args.length === 1 && type$d(args[0]) === 'number' && args[0] >= 0 && args[0] <= 0xFFFFFF) {
                return 'num';
            }
        }
    });

    var unpack$u = utils.unpack;
    var type$e = utils.type;
    var round$5 = Math.round;

    Color_1.prototype.rgb = function(rnd) {
        if ( rnd === void 0 ) rnd=true;

        if (rnd === false) { return this._rgb.slice(0,3); }
        return this._rgb.slice(0,3).map(round$5);
    };

    Color_1.prototype.rgba = function(rnd) {
        if ( rnd === void 0 ) rnd=true;

        return this._rgb.slice(0,4).map(function (v,i) {
            return i<3 ? (rnd === false ? v : round$5(v)) : v;
        });
    };

    chroma_1.rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['rgb']) ));
    };

    input.format.rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgba = unpack$u(args, 'rgba');
        if (rgba[3] === undefined) { rgba[3] = 1; }
        return rgba;
    };

    input.autodetect.push({
        p: 3,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$u(args, 'rgba');
            if (type$e(args) === 'array' && (args.length === 3 ||
                args.length === 4 && type$e(args[3]) == 'number' && args[3] >= 0 && args[3] <= 1)) {
                return 'rgb';
            }
        }
    });

    /*
     * Based on implementation by Neil Bartlett
     * https://github.com/neilbartlett/color-temperature
     */

    var log = Math.log;

    var temperature2rgb = function (kelvin) {
        var temp = kelvin / 100;
        var r,g,b;
        if (temp < 66) {
            r = 255;
            g = -155.25485562709179 - 0.44596950469579133 * (g = temp-2) + 104.49216199393888 * log(g);
            b = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b = temp-10) + 115.67994401066147 * log(b);
        } else {
            r = 351.97690566805693 + 0.114206453784165 * (r = temp-55) - 40.25366309332127 * log(r);
            g = 325.4494125711974 + 0.07943456536662342 * (g = temp-50) - 28.0852963507957 * log(g);
            b = 255;
        }
        return [r,g,b,1];
    };

    var temperature2rgb_1 = temperature2rgb;

    /*
     * Based on implementation by Neil Bartlett
     * https://github.com/neilbartlett/color-temperature
     **/


    var unpack$v = utils.unpack;
    var round$6 = Math.round;

    var rgb2temperature = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgb = unpack$v(args, 'rgb');
        var r = rgb[0], b = rgb[2];
        var minTemp = 1000;
        var maxTemp = 40000;
        var eps = 0.4;
        var temp;
        while (maxTemp - minTemp > eps) {
            temp = (maxTemp + minTemp) * 0.5;
            var rgb$1 = temperature2rgb_1(temp);
            if ((rgb$1[2] / rgb$1[0]) >= (b / r)) {
                maxTemp = temp;
            } else {
                minTemp = temp;
            }
        }
        return round$6(temp);
    };

    var rgb2temperature_1 = rgb2temperature;

    Color_1.prototype.temp =
    Color_1.prototype.kelvin =
    Color_1.prototype.temperature = function() {
        return rgb2temperature_1(this._rgb);
    };

    chroma_1.temp =
    chroma_1.kelvin =
    chroma_1.temperature = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['temp']) ));
    };

    input.format.temp =
    input.format.kelvin =
    input.format.temperature = temperature2rgb_1;

    var type$f = utils.type;

    Color_1.prototype.alpha = function(a, mutate) {
        if ( mutate === void 0 ) mutate=false;

        if (a !== undefined && type$f(a) === 'number') {
            if (mutate) {
                this._rgb[3] = a;
                return this;
            }
            return new Color_1([this._rgb[0], this._rgb[1], this._rgb[2], a], 'rgb');
        }
        return this._rgb[3];
    };

    Color_1.prototype.clipped = function() {
        return this._rgb._clipped || false;
    };

    Color_1.prototype.darken = function(amount) {
    	if ( amount === void 0 ) amount=1;

    	var me = this;
    	var lab = me.lab();
    	lab[0] -= labConstants.Kn * amount;
    	return new Color_1(lab, 'lab').alpha(me.alpha(), true);
    };

    Color_1.prototype.brighten = function(amount) {
    	if ( amount === void 0 ) amount=1;

    	return this.darken(-amount);
    };

    Color_1.prototype.darker = Color_1.prototype.darken;
    Color_1.prototype.brighter = Color_1.prototype.brighten;

    Color_1.prototype.get = function(mc) {
        var ref = mc.split('.');
        var mode = ref[0];
        var channel = ref[1];
        var src = this[mode]();
        if (channel) {
            var i = mode.indexOf(channel);
            if (i > -1) { return src[i]; }
            throw new Error(("unknown channel " + channel + " in mode " + mode));
        } else {
            return src;
        }
    };

    var type$g = utils.type;
    var pow$2 = Math.pow;

    var EPS = 1e-7;
    var MAX_ITER = 20;

    Color_1.prototype.luminance = function(lum) {
        if (lum !== undefined && type$g(lum) === 'number') {
            if (lum === 0) {
                // return pure black
                return new Color_1([0,0,0,this._rgb[3]], 'rgb');
            }
            if (lum === 1) {
                // return pure white
                return new Color_1([255,255,255,this._rgb[3]], 'rgb');
            }
            // compute new color using...
            var cur_lum = this.luminance();
            var mode = 'rgb';
            var max_iter = MAX_ITER;

            var test = function (low, high) {
                var mid = low.interpolate(high, 0.5, mode);
                var lm = mid.luminance();
                if (Math.abs(lum - lm) < EPS || !max_iter--) {
                    // close enough
                    return mid;
                }
                return lm > lum ? test(low, mid) : test(mid, high);
            };

            var rgb = (cur_lum > lum ? test(new Color_1([0,0,0]), this) : test(this, new Color_1([255,255,255]))).rgb();
            return new Color_1(rgb.concat( [this._rgb[3]]));
        }
        return rgb2luminance.apply(void 0, (this._rgb).slice(0,3));
    };


    var rgb2luminance = function (r,g,b) {
        // relative luminance
        // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        r = luminance_x(r);
        g = luminance_x(g);
        b = luminance_x(b);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    var luminance_x = function (x) {
        x /= 255;
        return x <= 0.03928 ? x/12.92 : pow$2((x+0.055)/1.055, 2.4);
    };

    var interpolator = {};

    var type$h = utils.type;


    var mix = function (col1, col2, f) {
        if ( f === void 0 ) f=0.5;
        var rest = [], len = arguments.length - 3;
        while ( len-- > 0 ) rest[ len ] = arguments[ len + 3 ];

        var mode = rest[0] || 'lrgb';
        if (!interpolator[mode] && !rest.length) {
            // fall back to the first supported mode
            mode = Object.keys(interpolator)[0];
        }
        if (!interpolator[mode]) {
            throw new Error(("interpolation mode " + mode + " is not defined"));
        }
        if (type$h(col1) !== 'object') { col1 = new Color_1(col1); }
        if (type$h(col2) !== 'object') { col2 = new Color_1(col2); }
        return interpolator[mode](col1, col2, f)
            .alpha(col1.alpha() + f * (col2.alpha() - col1.alpha()));
    };

    Color_1.prototype.mix =
    Color_1.prototype.interpolate = function(col2, f) {
    	if ( f === void 0 ) f=0.5;
    	var rest = [], len = arguments.length - 2;
    	while ( len-- > 0 ) rest[ len ] = arguments[ len + 2 ];

    	return mix.apply(void 0, [ this, col2, f ].concat( rest ));
    };

    Color_1.prototype.premultiply = function(mutate) {
    	if ( mutate === void 0 ) mutate=false;

    	var rgb = this._rgb;
    	var a = rgb[3];
    	if (mutate) {
    		this._rgb = [rgb[0]*a, rgb[1]*a, rgb[2]*a, a];
    		return this;
    	} else {
    		return new Color_1([rgb[0]*a, rgb[1]*a, rgb[2]*a, a], 'rgb');
    	}
    };

    Color_1.prototype.saturate = function(amount) {
    	if ( amount === void 0 ) amount=1;

    	var me = this;
    	var lch = me.lch();
    	lch[1] += labConstants.Kn * amount;
    	if (lch[1] < 0) { lch[1] = 0; }
    	return new Color_1(lch, 'lch').alpha(me.alpha(), true);
    };

    Color_1.prototype.desaturate = function(amount) {
    	if ( amount === void 0 ) amount=1;

    	return this.saturate(-amount);
    };

    var type$i = utils.type;

    Color_1.prototype.set = function(mc, value, mutate) {
        if ( mutate === void 0 ) mutate=false;

        var ref = mc.split('.');
        var mode = ref[0];
        var channel = ref[1];
        var src = this[mode]();
        if (channel) {
            var i = mode.indexOf(channel);
            if (i > -1) {
                if (type$i(value) == 'string') {
                    switch(value.charAt(0)) {
                        case '+': src[i] += +value; break;
                        case '-': src[i] += +value; break;
                        case '*': src[i] *= +(value.substr(1)); break;
                        case '/': src[i] /= +(value.substr(1)); break;
                        default: src[i] = +value;
                    }
                } else if (type$i(value) === 'number') {
                    src[i] = value;
                } else {
                    throw new Error("unsupported value for Color.set");
                }
                var out = new Color_1(src, mode);
                if (mutate) {
                    this._rgb = out._rgb;
                    return this;
                }
                return out;
            }
            throw new Error(("unknown channel " + channel + " in mode " + mode));
        } else {
            return src;
        }
    };

    var rgb$1 = function (col1, col2, f) {
        var xyz0 = col1._rgb;
        var xyz1 = col2._rgb;
        return new Color_1(
            xyz0[0] + f * (xyz1[0]-xyz0[0]),
            xyz0[1] + f * (xyz1[1]-xyz0[1]),
            xyz0[2] + f * (xyz1[2]-xyz0[2]),
            'rgb'
        )
    };

    // register interpolator
    interpolator.rgb = rgb$1;

    var sqrt$2 = Math.sqrt;
    var pow$3 = Math.pow;

    var lrgb = function (col1, col2, f) {
        var ref = col1._rgb;
        var x1 = ref[0];
        var y1 = ref[1];
        var z1 = ref[2];
        var ref$1 = col2._rgb;
        var x2 = ref$1[0];
        var y2 = ref$1[1];
        var z2 = ref$1[2];
        return new Color_1(
            sqrt$2(pow$3(x1,2) * (1-f) + pow$3(x2,2) * f),
            sqrt$2(pow$3(y1,2) * (1-f) + pow$3(y2,2) * f),
            sqrt$2(pow$3(z1,2) * (1-f) + pow$3(z2,2) * f),
            'rgb'
        )
    };

    // register interpolator
    interpolator.lrgb = lrgb;

    var lab$1 = function (col1, col2, f) {
        var xyz0 = col1.lab();
        var xyz1 = col2.lab();
        return new Color_1(
            xyz0[0] + f * (xyz1[0]-xyz0[0]),
            xyz0[1] + f * (xyz1[1]-xyz0[1]),
            xyz0[2] + f * (xyz1[2]-xyz0[2]),
            'lab'
        )
    };

    // register interpolator
    interpolator.lab = lab$1;

    var _hsx = function (col1, col2, f, m) {
        var assign, assign$1;

        var xyz0, xyz1;
        if (m === 'hsl') {
            xyz0 = col1.hsl();
            xyz1 = col2.hsl();
        } else if (m === 'hsv') {
            xyz0 = col1.hsv();
            xyz1 = col2.hsv();
        } else if (m === 'hcg') {
            xyz0 = col1.hcg();
            xyz1 = col2.hcg();
        } else if (m === 'hsi') {
            xyz0 = col1.hsi();
            xyz1 = col2.hsi();
        } else if (m === 'lch' || m === 'hcl') {
            m = 'hcl';
            xyz0 = col1.hcl();
            xyz1 = col2.hcl();
        }

        var hue0, hue1, sat0, sat1, lbv0, lbv1;
        if (m.substr(0, 1) === 'h') {
            (assign = xyz0, hue0 = assign[0], sat0 = assign[1], lbv0 = assign[2]);
            (assign$1 = xyz1, hue1 = assign$1[0], sat1 = assign$1[1], lbv1 = assign$1[2]);
        }

        var sat, hue, lbv, dh;

        if (!isNaN(hue0) && !isNaN(hue1)) {
            // both colors have hue
            if (hue1 > hue0 && hue1 - hue0 > 180) {
                dh = hue1-(hue0+360);
            } else if (hue1 < hue0 && hue0 - hue1 > 180) {
                dh = hue1+360-hue0;
            } else{
                dh = hue1 - hue0;
            }
            hue = hue0 + f * dh;
        } else if (!isNaN(hue0)) {
            hue = hue0;
            if ((lbv1 == 1 || lbv1 == 0) && m != 'hsv') { sat = sat0; }
        } else if (!isNaN(hue1)) {
            hue = hue1;
            if ((lbv0 == 1 || lbv0 == 0) && m != 'hsv') { sat = sat1; }
        } else {
            hue = Number.NaN;
        }

        if (sat === undefined) { sat = sat0 + f * (sat1 - sat0); }
        lbv = lbv0 + f * (lbv1-lbv0);
        return new Color_1([hue, sat, lbv], m);
    };

    var lch$1 = function (col1, col2, f) {
    	return _hsx(col1, col2, f, 'lch');
    };

    // register interpolator
    interpolator.lch = lch$1;
    interpolator.hcl = lch$1;

    var num$1 = function (col1, col2, f) {
        var c1 = col1.num();
        var c2 = col2.num();
        return new Color_1(c1 + f * (c2-c1), 'num')
    };

    // register interpolator
    interpolator.num = num$1;

    var hcg$1 = function (col1, col2, f) {
    	return _hsx(col1, col2, f, 'hcg');
    };

    // register interpolator
    interpolator.hcg = hcg$1;

    var hsi$1 = function (col1, col2, f) {
    	return _hsx(col1, col2, f, 'hsi');
    };

    // register interpolator
    interpolator.hsi = hsi$1;

    var hsl$1 = function (col1, col2, f) {
    	return _hsx(col1, col2, f, 'hsl');
    };

    // register interpolator
    interpolator.hsl = hsl$1;

    var hsv$1 = function (col1, col2, f) {
    	return _hsx(col1, col2, f, 'hsv');
    };

    // register interpolator
    interpolator.hsv = hsv$1;

    var clip_rgb$2 = utils.clip_rgb;
    var pow$4 = Math.pow;
    var sqrt$3 = Math.sqrt;
    var PI$1 = Math.PI;
    var cos$2 = Math.cos;
    var sin$1 = Math.sin;
    var atan2$1 = Math.atan2;

    var average = function (colors, mode, weights) {
        if ( mode === void 0 ) mode='lrgb';
        if ( weights === void 0 ) weights=null;

        var l = colors.length;
        if (!weights) { weights = Array.from(new Array(l)).map(function () { return 1; }); }
        // normalize weights
        var k = l / weights.reduce(function(a, b) { return a + b; });
        weights.forEach(function (w,i) { weights[i] *= k; });
        // convert colors to Color objects
        colors = colors.map(function (c) { return new Color_1(c); });
        if (mode === 'lrgb') {
            return _average_lrgb(colors, weights)
        }
        var first = colors.shift();
        var xyz = first.get(mode);
        var cnt = [];
        var dx = 0;
        var dy = 0;
        // initial color
        for (var i=0; i<xyz.length; i++) {
            xyz[i] = (xyz[i] || 0) * weights[0];
            cnt.push(isNaN(xyz[i]) ? 0 : weights[0]);
            if (mode.charAt(i) === 'h' && !isNaN(xyz[i])) {
                var A = xyz[i] / 180 * PI$1;
                dx += cos$2(A) * weights[0];
                dy += sin$1(A) * weights[0];
            }
        }

        var alpha = first.alpha() * weights[0];
        colors.forEach(function (c,ci) {
            var xyz2 = c.get(mode);
            alpha += c.alpha() * weights[ci+1];
            for (var i=0; i<xyz.length; i++) {
                if (!isNaN(xyz2[i])) {
                    cnt[i] += weights[ci+1];
                    if (mode.charAt(i) === 'h') {
                        var A = xyz2[i] / 180 * PI$1;
                        dx += cos$2(A) * weights[ci+1];
                        dy += sin$1(A) * weights[ci+1];
                    } else {
                        xyz[i] += xyz2[i] * weights[ci+1];
                    }
                }
            }
        });

        for (var i$1=0; i$1<xyz.length; i$1++) {
            if (mode.charAt(i$1) === 'h') {
                var A$1 = atan2$1(dy / cnt[i$1], dx / cnt[i$1]) / PI$1 * 180;
                while (A$1 < 0) { A$1 += 360; }
                while (A$1 >= 360) { A$1 -= 360; }
                xyz[i$1] = A$1;
            } else {
                xyz[i$1] = xyz[i$1]/cnt[i$1];
            }
        }
        alpha /= l;
        return (new Color_1(xyz, mode)).alpha(alpha > 0.99999 ? 1 : alpha, true);
    };


    var _average_lrgb = function (colors, weights) {
        var l = colors.length;
        var xyz = [0,0,0,0];
        for (var i=0; i < colors.length; i++) {
            var col = colors[i];
            var f = weights[i] / l;
            var rgb = col._rgb;
            xyz[0] += pow$4(rgb[0],2) * f;
            xyz[1] += pow$4(rgb[1],2) * f;
            xyz[2] += pow$4(rgb[2],2) * f;
            xyz[3] += rgb[3] * f;
        }
        xyz[0] = sqrt$3(xyz[0]);
        xyz[1] = sqrt$3(xyz[1]);
        xyz[2] = sqrt$3(xyz[2]);
        if (xyz[3] > 0.9999999) { xyz[3] = 1; }
        return new Color_1(clip_rgb$2(xyz));
    };

    // minimal multi-purpose interface

    // @requires utils color analyze


    var type$j = utils.type;

    var pow$5 = Math.pow;

    var scale = function(colors) {

        // constructor
        var _mode = 'rgb';
        var _nacol = chroma_1('#ccc');
        var _spread = 0;
        // const _fixed = false;
        var _domain = [0, 1];
        var _pos = [];
        var _padding = [0,0];
        var _classes = false;
        var _colors = [];
        var _out = false;
        var _min = 0;
        var _max = 1;
        var _correctLightness = false;
        var _colorCache = {};
        var _useCache = true;
        var _gamma = 1;

        // private methods

        var setColors = function(colors) {
            colors = colors || ['#fff', '#000'];
            if (colors && type$j(colors) === 'string' && chroma_1.brewer &&
                chroma_1.brewer[colors.toLowerCase()]) {
                colors = chroma_1.brewer[colors.toLowerCase()];
            }
            if (type$j(colors) === 'array') {
                // handle single color
                if (colors.length === 1) {
                    colors = [colors[0], colors[0]];
                }
                // make a copy of the colors
                colors = colors.slice(0);
                // convert to chroma classes
                for (var c=0; c<colors.length; c++) {
                    colors[c] = chroma_1(colors[c]);
                }
                // auto-fill color position
                _pos.length = 0;
                for (var c$1=0; c$1<colors.length; c$1++) {
                    _pos.push(c$1/(colors.length-1));
                }
            }
            resetCache();
            return _colors = colors;
        };

        var getClass = function(value) {
            if (_classes != null) {
                var n = _classes.length-1;
                var i = 0;
                while (i < n && value >= _classes[i]) {
                    i++;
                }
                return i-1;
            }
            return 0;
        };

        var tMapLightness = function (t) { return t; };
        var tMapDomain = function (t) { return t; };

        // const classifyValue = function(value) {
        //     let val = value;
        //     if (_classes.length > 2) {
        //         const n = _classes.length-1;
        //         const i = getClass(value);
        //         const minc = _classes[0] + ((_classes[1]-_classes[0]) * (0 + (_spread * 0.5)));  // center of 1st class
        //         const maxc = _classes[n-1] + ((_classes[n]-_classes[n-1]) * (1 - (_spread * 0.5)));  // center of last class
        //         val = _min + ((((_classes[i] + ((_classes[i+1] - _classes[i]) * 0.5)) - minc) / (maxc-minc)) * (_max - _min));
        //     }
        //     return val;
        // };

        var getColor = function(val, bypassMap) {
            var col, t;
            if (bypassMap == null) { bypassMap = false; }
            if (isNaN(val) || (val === null)) { return _nacol; }
            if (!bypassMap) {
                if (_classes && (_classes.length > 2)) {
                    // find the class
                    var c = getClass(val);
                    t = c / (_classes.length-2);
                } else if (_max !== _min) {
                    // just interpolate between min/max
                    t = (val - _min) / (_max - _min);
                } else {
                    t = 1;
                }
            } else {
                t = val;
            }

            // domain map
            t = tMapDomain(t);

            if (!bypassMap) {
                t = tMapLightness(t);  // lightness correction
            }

            if (_gamma !== 1) { t = pow$5(t, _gamma); }

            t = _padding[0] + (t * (1 - _padding[0] - _padding[1]));

            t = Math.min(1, Math.max(0, t));

            var k = Math.floor(t * 10000);

            if (_useCache && _colorCache[k]) {
                col = _colorCache[k];
            } else {
                if (type$j(_colors) === 'array') {
                    //for i in [0.._pos.length-1]
                    for (var i=0; i<_pos.length; i++) {
                        var p = _pos[i];
                        if (t <= p) {
                            col = _colors[i];
                            break;
                        }
                        if ((t >= p) && (i === (_pos.length-1))) {
                            col = _colors[i];
                            break;
                        }
                        if (t > p && t < _pos[i+1]) {
                            t = (t-p)/(_pos[i+1]-p);
                            col = chroma_1.interpolate(_colors[i], _colors[i+1], t, _mode);
                            break;
                        }
                    }
                } else if (type$j(_colors) === 'function') {
                    col = _colors(t);
                }
                if (_useCache) { _colorCache[k] = col; }
            }
            return col;
        };

        var resetCache = function () { return _colorCache = {}; };

        setColors(colors);

        // public interface

        var f = function(v) {
            var c = chroma_1(getColor(v));
            if (_out && c[_out]) { return c[_out](); } else { return c; }
        };

        f.classes = function(classes) {
            if (classes != null) {
                if (type$j(classes) === 'array') {
                    _classes = classes;
                    _domain = [classes[0], classes[classes.length-1]];
                } else {
                    var d = chroma_1.analyze(_domain);
                    if (classes === 0) {
                        _classes = [d.min, d.max];
                    } else {
                        _classes = chroma_1.limits(d, 'e', classes);
                    }
                }
                return f;
            }
            return _classes;
        };


        f.domain = function(domain) {
            if (!arguments.length) {
                return _domain;
            }
            _min = domain[0];
            _max = domain[domain.length-1];
            _pos = [];
            var k = _colors.length;
            if ((domain.length === k) && (_min !== _max)) {
                // update positions
                for (var i = 0, list = Array.from(domain); i < list.length; i += 1) {
                    var d = list[i];

                  _pos.push((d-_min) / (_max-_min));
                }
            } else {
                for (var c=0; c<k; c++) {
                    _pos.push(c/(k-1));
                }
                if (domain.length > 2) {
                    // set domain map
                    var tOut = domain.map(function (d,i) { return i/(domain.length-1); });
                    var tBreaks = domain.map(function (d) { return (d - _min) / (_max - _min); });
                    if (!tBreaks.every(function (val, i) { return tOut[i] === val; })) {
                        tMapDomain = function (t) {
                            if (t <= 0 || t >= 1) { return t; }
                            var i = 0;
                            while (t >= tBreaks[i+1]) { i++; }
                            var f = (t - tBreaks[i]) / (tBreaks[i+1] - tBreaks[i]);
                            var out = tOut[i] + f * (tOut[i+1] - tOut[i]);
                            return out;
                        };
                    }

                }
            }
            _domain = [_min, _max];
            return f;
        };

        f.mode = function(_m) {
            if (!arguments.length) {
                return _mode;
            }
            _mode = _m;
            resetCache();
            return f;
        };

        f.range = function(colors, _pos) {
            setColors(colors);
            return f;
        };

        f.out = function(_o) {
            _out = _o;
            return f;
        };

        f.spread = function(val) {
            if (!arguments.length) {
                return _spread;
            }
            _spread = val;
            return f;
        };

        f.correctLightness = function(v) {
            if (v == null) { v = true; }
            _correctLightness = v;
            resetCache();
            if (_correctLightness) {
                tMapLightness = function(t) {
                    var L0 = getColor(0, true).lab()[0];
                    var L1 = getColor(1, true).lab()[0];
                    var pol = L0 > L1;
                    var L_actual = getColor(t, true).lab()[0];
                    var L_ideal = L0 + ((L1 - L0) * t);
                    var L_diff = L_actual - L_ideal;
                    var t0 = 0;
                    var t1 = 1;
                    var max_iter = 20;
                    while ((Math.abs(L_diff) > 1e-2) && (max_iter-- > 0)) {
                        (function() {
                            if (pol) { L_diff *= -1; }
                            if (L_diff < 0) {
                                t0 = t;
                                t += (t1 - t) * 0.5;
                            } else {
                                t1 = t;
                                t += (t0 - t) * 0.5;
                            }
                            L_actual = getColor(t, true).lab()[0];
                            return L_diff = L_actual - L_ideal;
                        })();
                    }
                    return t;
                };
            } else {
                tMapLightness = function (t) { return t; };
            }
            return f;
        };

        f.padding = function(p) {
            if (p != null) {
                if (type$j(p) === 'number') {
                    p = [p,p];
                }
                _padding = p;
                return f;
            } else {
                return _padding;
            }
        };

        f.colors = function(numColors, out) {
            // If no arguments are given, return the original colors that were provided
            if (arguments.length < 2) { out = 'hex'; }
            var result = [];

            if (arguments.length === 0) {
                result = _colors.slice(0);

            } else if (numColors === 1) {
                result = [f(0.5)];

            } else if (numColors > 1) {
                var dm = _domain[0];
                var dd = _domain[1] - dm;
                result = __range__(0, numColors, false).map(function (i) { return f( dm + ((i/(numColors-1)) * dd) ); });

            } else { // returns all colors based on the defined classes
                colors = [];
                var samples = [];
                if (_classes && (_classes.length > 2)) {
                    for (var i = 1, end = _classes.length, asc = 1 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
                        samples.push((_classes[i-1]+_classes[i])*0.5);
                    }
                } else {
                    samples = _domain;
                }
                result = samples.map(function (v) { return f(v); });
            }

            if (chroma_1[out]) {
                result = result.map(function (c) { return c[out](); });
            }
            return result;
        };

        f.cache = function(c) {
            if (c != null) {
                _useCache = c;
                return f;
            } else {
                return _useCache;
            }
        };

        f.gamma = function(g) {
            if (g != null) {
                _gamma = g;
                return f;
            } else {
                return _gamma;
            }
        };

        f.nodata = function(d) {
            if (d != null) {
                _nacol = chroma_1(d);
                return f;
            } else {
                return _nacol;
            }
        };

        return f;
    };

    function __range__(left, right, inclusive) {
      var range = [];
      var ascending = left < right;
      var end = !inclusive ? right : ascending ? right + 1 : right - 1;
      for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
        range.push(i);
      }
      return range;
    }

    //
    // interpolates between a set of colors uzing a bezier spline
    //

    // @requires utils lab




    var bezier = function(colors) {
        var assign, assign$1, assign$2;

        var I, lab0, lab1, lab2;
        colors = colors.map(function (c) { return new Color_1(c); });
        if (colors.length === 2) {
            // linear interpolation
            (assign = colors.map(function (c) { return c.lab(); }), lab0 = assign[0], lab1 = assign[1]);
            I = function(t) {
                var lab = ([0, 1, 2].map(function (i) { return lab0[i] + (t * (lab1[i] - lab0[i])); }));
                return new Color_1(lab, 'lab');
            };
        } else if (colors.length === 3) {
            // quadratic bezier interpolation
            (assign$1 = colors.map(function (c) { return c.lab(); }), lab0 = assign$1[0], lab1 = assign$1[1], lab2 = assign$1[2]);
            I = function(t) {
                var lab = ([0, 1, 2].map(function (i) { return ((1-t)*(1-t) * lab0[i]) + (2 * (1-t) * t * lab1[i]) + (t * t * lab2[i]); }));
                return new Color_1(lab, 'lab');
            };
        } else if (colors.length === 4) {
            // cubic bezier interpolation
            var lab3;
            (assign$2 = colors.map(function (c) { return c.lab(); }), lab0 = assign$2[0], lab1 = assign$2[1], lab2 = assign$2[2], lab3 = assign$2[3]);
            I = function(t) {
                var lab = ([0, 1, 2].map(function (i) { return ((1-t)*(1-t)*(1-t) * lab0[i]) + (3 * (1-t) * (1-t) * t * lab1[i]) + (3 * (1-t) * t * t * lab2[i]) + (t*t*t * lab3[i]); }));
                return new Color_1(lab, 'lab');
            };
        } else if (colors.length === 5) {
            var I0 = bezier(colors.slice(0, 3));
            var I1 = bezier(colors.slice(2, 5));
            I = function(t) {
                if (t < 0.5) {
                    return I0(t*2);
                } else {
                    return I1((t-0.5)*2);
                }
            };
        }
        return I;
    };

    var bezier_1 = function (colors) {
        var f = bezier(colors);
        f.scale = function () { return scale(f); };
        return f;
    };

    /*
     * interpolates between a set of colors uzing a bezier spline
     * blend mode formulas taken from http://www.venture-ware.com/kevin/coding/lets-learn-math-photoshop-blend-modes/
     */




    var blend = function (bottom, top, mode) {
        if (!blend[mode]) {
            throw new Error('unknown blend mode ' + mode);
        }
        return blend[mode](bottom, top);
    };

    var blend_f = function (f) { return function (bottom,top) {
            var c0 = chroma_1(top).rgb();
            var c1 = chroma_1(bottom).rgb();
            return chroma_1.rgb(f(c0, c1));
        }; };

    var each = function (f) { return function (c0, c1) {
            var out = [];
            out[0] = f(c0[0], c1[0]);
            out[1] = f(c0[1], c1[1]);
            out[2] = f(c0[2], c1[2]);
            return out;
        }; };

    var normal = function (a) { return a; };
    var multiply = function (a,b) { return a * b / 255; };
    var darken$1 = function (a,b) { return a > b ? b : a; };
    var lighten = function (a,b) { return a > b ? a : b; };
    var screen = function (a,b) { return 255 * (1 - (1-a/255) * (1-b/255)); };
    var overlay = function (a,b) { return b < 128 ? 2 * a * b / 255 : 255 * (1 - 2 * (1 - a / 255 ) * ( 1 - b / 255 )); };
    var burn = function (a,b) { return 255 * (1 - (1 - b / 255) / (a/255)); };
    var dodge = function (a,b) {
        if (a === 255) { return 255; }
        a = 255 * (b / 255) / (1 - a / 255);
        return a > 255 ? 255 : a
    };

    // # add = (a,b) ->
    // #     if (a + b > 255) then 255 else a + b

    blend.normal = blend_f(each(normal));
    blend.multiply = blend_f(each(multiply));
    blend.screen = blend_f(each(screen));
    blend.overlay = blend_f(each(overlay));
    blend.darken = blend_f(each(darken$1));
    blend.lighten = blend_f(each(lighten));
    blend.dodge = blend_f(each(dodge));
    blend.burn = blend_f(each(burn));
    // blend.add = blend_f(each(add));

    var blend_1 = blend;

    // cubehelix interpolation
    // based on D.A. Green "A colour scheme for the display of astronomical intensity images"
    // http://astron-soc.in/bulletin/11June/289392011.pdf

    var type$k = utils.type;
    var clip_rgb$3 = utils.clip_rgb;
    var TWOPI$2 = utils.TWOPI;
    var pow$6 = Math.pow;
    var sin$2 = Math.sin;
    var cos$3 = Math.cos;


    var cubehelix = function(start, rotations, hue, gamma, lightness) {
        if ( start === void 0 ) start=300;
        if ( rotations === void 0 ) rotations=-1.5;
        if ( hue === void 0 ) hue=1;
        if ( gamma === void 0 ) gamma=1;
        if ( lightness === void 0 ) lightness=[0,1];

        var dh = 0, dl;
        if (type$k(lightness) === 'array') {
            dl = lightness[1] - lightness[0];
        } else {
            dl = 0;
            lightness = [lightness, lightness];
        }

        var f = function(fract) {
            var a = TWOPI$2 * (((start+120)/360) + (rotations * fract));
            var l = pow$6(lightness[0] + (dl * fract), gamma);
            var h = dh !== 0 ? hue[0] + (fract * dh) : hue;
            var amp = (h * l * (1-l)) / 2;
            var cos_a = cos$3(a);
            var sin_a = sin$2(a);
            var r = l + (amp * ((-0.14861 * cos_a) + (1.78277* sin_a)));
            var g = l + (amp * ((-0.29227 * cos_a) - (0.90649* sin_a)));
            var b = l + (amp * (+1.97294 * cos_a));
            return chroma_1(clip_rgb$3([r*255,g*255,b*255,1]));
        };

        f.start = function(s) {
            if ((s == null)) { return start; }
            start = s;
            return f;
        };

        f.rotations = function(r) {
            if ((r == null)) { return rotations; }
            rotations = r;
            return f;
        };

        f.gamma = function(g) {
            if ((g == null)) { return gamma; }
            gamma = g;
            return f;
        };

        f.hue = function(h) {
            if ((h == null)) { return hue; }
            hue = h;
            if (type$k(hue) === 'array') {
                dh = hue[1] - hue[0];
                if (dh === 0) { hue = hue[1]; }
            } else {
                dh = 0;
            }
            return f;
        };

        f.lightness = function(h) {
            if ((h == null)) { return lightness; }
            if (type$k(h) === 'array') {
                lightness = h;
                dl = h[1] - h[0];
            } else {
                lightness = [h,h];
                dl = 0;
            }
            return f;
        };

        f.scale = function () { return chroma_1.scale(f); };

        f.hue(hue);

        return f;
    };

    var digits = '0123456789abcdef';

    var floor$2 = Math.floor;
    var random = Math.random;

    var random_1 = function () {
        var code = '#';
        for (var i=0; i<6; i++) {
            code += digits.charAt(floor$2(random() * 16));
        }
        return new Color_1(code, 'hex');
    };

    var log$1 = Math.log;
    var pow$7 = Math.pow;
    var floor$3 = Math.floor;
    var abs = Math.abs;


    var analyze = function (data, key) {
        if ( key === void 0 ) key=null;

        var r = {
            min: Number.MAX_VALUE,
            max: Number.MAX_VALUE*-1,
            sum: 0,
            values: [],
            count: 0
        };
        if (type(data) === 'object') {
            data = Object.values(data);
        }
        data.forEach(function (val) {
            if (key && type(val) === 'object') { val = val[key]; }
            if (val !== undefined && val !== null && !isNaN(val)) {
                r.values.push(val);
                r.sum += val;
                if (val < r.min) { r.min = val; }
                if (val > r.max) { r.max = val; }
                r.count += 1;
            }
        });

        r.domain = [r.min, r.max];

        r.limits = function (mode, num) { return limits(r, mode, num); };

        return r;
    };


    var limits = function (data, mode, num) {
        if ( mode === void 0 ) mode='equal';
        if ( num === void 0 ) num=7;

        if (type(data) == 'array') {
            data = analyze(data);
        }
        var min = data.min;
        var max = data.max;
        var values = data.values.sort(function (a,b) { return a-b; });

        if (num === 1) { return [min,max]; }

        var limits = [];

        if (mode.substr(0,1) === 'c') { // continuous
            limits.push(min);
            limits.push(max);
        }

        if (mode.substr(0,1) === 'e') { // equal interval
            limits.push(min);
            for (var i=1; i<num; i++) {
                limits.push(min+((i/num)*(max-min)));
            }
            limits.push(max);
        }

        else if (mode.substr(0,1) === 'l') { // log scale
            if (min <= 0) {
                throw new Error('Logarithmic scales are only possible for values > 0');
            }
            var min_log = Math.LOG10E * log$1(min);
            var max_log = Math.LOG10E * log$1(max);
            limits.push(min);
            for (var i$1=1; i$1<num; i$1++) {
                limits.push(pow$7(10, min_log + ((i$1/num) * (max_log - min_log))));
            }
            limits.push(max);
        }

        else if (mode.substr(0,1) === 'q') { // quantile scale
            limits.push(min);
            for (var i$2=1; i$2<num; i$2++) {
                var p = ((values.length-1) * i$2)/num;
                var pb = floor$3(p);
                if (pb === p) {
                    limits.push(values[pb]);
                } else { // p > pb
                    var pr = p - pb;
                    limits.push((values[pb]*(1-pr)) + (values[pb+1]*pr));
                }
            }
            limits.push(max);

        }

        else if (mode.substr(0,1) === 'k') { // k-means clustering
            /*
            implementation based on
            http://code.google.com/p/figue/source/browse/trunk/figue.js#336
            simplified for 1-d input values
            */
            var cluster;
            var n = values.length;
            var assignments = new Array(n);
            var clusterSizes = new Array(num);
            var repeat = true;
            var nb_iters = 0;
            var centroids = null;

            // get seed values
            centroids = [];
            centroids.push(min);
            for (var i$3=1; i$3<num; i$3++) {
                centroids.push(min + ((i$3/num) * (max-min)));
            }
            centroids.push(max);

            while (repeat) {
                // assignment step
                for (var j=0; j<num; j++) {
                    clusterSizes[j] = 0;
                }
                for (var i$4=0; i$4<n; i$4++) {
                    var value = values[i$4];
                    var mindist = Number.MAX_VALUE;
                    var best = (void 0);
                    for (var j$1=0; j$1<num; j$1++) {
                        var dist = abs(centroids[j$1]-value);
                        if (dist < mindist) {
                            mindist = dist;
                            best = j$1;
                        }
                        clusterSizes[best]++;
                        assignments[i$4] = best;
                    }
                }

                // update centroids step
                var newCentroids = new Array(num);
                for (var j$2=0; j$2<num; j$2++) {
                    newCentroids[j$2] = null;
                }
                for (var i$5=0; i$5<n; i$5++) {
                    cluster = assignments[i$5];
                    if (newCentroids[cluster] === null) {
                        newCentroids[cluster] = values[i$5];
                    } else {
                        newCentroids[cluster] += values[i$5];
                    }
                }
                for (var j$3=0; j$3<num; j$3++) {
                    newCentroids[j$3] *= 1/clusterSizes[j$3];
                }

                // check convergence
                repeat = false;
                for (var j$4=0; j$4<num; j$4++) {
                    if (newCentroids[j$4] !== centroids[j$4]) {
                        repeat = true;
                        break;
                    }
                }

                centroids = newCentroids;
                nb_iters++;

                if (nb_iters > 200) {
                    repeat = false;
                }
            }

            // finished k-means clustering
            // the next part is borrowed from gabrielflor.it
            var kClusters = {};
            for (var j$5=0; j$5<num; j$5++) {
                kClusters[j$5] = [];
            }
            for (var i$6=0; i$6<n; i$6++) {
                cluster = assignments[i$6];
                kClusters[cluster].push(values[i$6]);
            }
            var tmpKMeansBreaks = [];
            for (var j$6=0; j$6<num; j$6++) {
                tmpKMeansBreaks.push(kClusters[j$6][0]);
                tmpKMeansBreaks.push(kClusters[j$6][kClusters[j$6].length-1]);
            }
            tmpKMeansBreaks = tmpKMeansBreaks.sort(function (a,b){ return a-b; });
            limits.push(tmpKMeansBreaks[0]);
            for (var i$7=1; i$7 < tmpKMeansBreaks.length; i$7+= 2) {
                var v = tmpKMeansBreaks[i$7];
                if (!isNaN(v) && (limits.indexOf(v) === -1)) {
                    limits.push(v);
                }
            }
        }
        return limits;
    };

    var analyze_1 = {analyze: analyze, limits: limits};

    var contrast = function (a, b) {
        // WCAG contrast ratio
        // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
        a = new Color_1(a);
        b = new Color_1(b);
        var l1 = a.luminance();
        var l2 = b.luminance();
        return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
    };

    var sqrt$4 = Math.sqrt;
    var atan2$2 = Math.atan2;
    var abs$1 = Math.abs;
    var cos$4 = Math.cos;
    var PI$2 = Math.PI;

    var deltaE = function(a, b, L, C) {
        if ( L === void 0 ) L=1;
        if ( C === void 0 ) C=1;

        // Delta E (CMC)
        // see http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CMC.html
        a = new Color_1(a);
        b = new Color_1(b);
        var ref = Array.from(a.lab());
        var L1 = ref[0];
        var a1 = ref[1];
        var b1 = ref[2];
        var ref$1 = Array.from(b.lab());
        var L2 = ref$1[0];
        var a2 = ref$1[1];
        var b2 = ref$1[2];
        var c1 = sqrt$4((a1 * a1) + (b1 * b1));
        var c2 = sqrt$4((a2 * a2) + (b2 * b2));
        var sl = L1 < 16.0 ? 0.511 : (0.040975 * L1) / (1.0 + (0.01765 * L1));
        var sc = ((0.0638 * c1) / (1.0 + (0.0131 * c1))) + 0.638;
        var h1 = c1 < 0.000001 ? 0.0 : (atan2$2(b1, a1) * 180.0) / PI$2;
        while (h1 < 0) { h1 += 360; }
        while (h1 >= 360) { h1 -= 360; }
        var t = (h1 >= 164.0) && (h1 <= 345.0) ? (0.56 + abs$1(0.2 * cos$4((PI$2 * (h1 + 168.0)) / 180.0))) : (0.36 + abs$1(0.4 * cos$4((PI$2 * (h1 + 35.0)) / 180.0)));
        var c4 = c1 * c1 * c1 * c1;
        var f = sqrt$4(c4 / (c4 + 1900.0));
        var sh = sc * (((f * t) + 1.0) - f);
        var delL = L1 - L2;
        var delC = c1 - c2;
        var delA = a1 - a2;
        var delB = b1 - b2;
        var dH2 = ((delA * delA) + (delB * delB)) - (delC * delC);
        var v1 = delL / (L * sl);
        var v2 = delC / (C * sc);
        var v3 = sh;
        return sqrt$4((v1 * v1) + (v2 * v2) + (dH2 / (v3 * v3)));
    };

    // simple Euclidean distance
    var distance = function(a, b, mode) {
        if ( mode === void 0 ) mode='lab';

        // Delta E (CIE 1976)
        // see http://www.brucelindbloom.com/index.html?Equations.html
        a = new Color_1(a);
        b = new Color_1(b);
        var l1 = a.get(mode);
        var l2 = b.get(mode);
        var sum_sq = 0;
        for (var i in l1) {
            var d = (l1[i] || 0) - (l2[i] || 0);
            sum_sq += d*d;
        }
        return Math.sqrt(sum_sq);
    };

    var valid = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        try {
            new (Function.prototype.bind.apply( Color_1, [ null ].concat( args) ));
            return true;
        } catch (e) {
            return false;
        }
    };

    // some pre-defined color scales:




    var scales = {
    	cool: function cool() { return scale([chroma_1.hsl(180,1,.9), chroma_1.hsl(250,.7,.4)]) },
    	hot: function hot() { return scale(['#000','#f00','#ff0','#fff']).mode('rgb') }
    };

    /**
        ColorBrewer colors for chroma.js

        Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The
        Pennsylvania State University.

        Licensed under the Apache License, Version 2.0 (the "License");
        you may not use this file except in compliance with the License.
        You may obtain a copy of the License at
        http://www.apache.org/licenses/LICENSE-2.0

        Unless required by applicable law or agreed to in writing, software distributed
        under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
        CONDITIONS OF ANY KIND, either express or implied. See the License for the
        specific language governing permissions and limitations under the License.
    */

    var colorbrewer = {
        // sequential
        OrRd: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'],
        PuBu: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'],
        BuPu: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'],
        Oranges: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
        BuGn: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'],
        YlOrBr: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'],
        YlGn: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
        Reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
        RdPu: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'],
        Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
        YlGnBu: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
        Purples: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
        GnBu: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'],
        Greys: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
        YlOrRd: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
        PuRd: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'],
        Blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
        PuBuGn: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'],
        Viridis: ['#440154', '#482777', '#3f4a8a', '#31678e', '#26838f', '#1f9d8a', '#6cce5a', '#b6de2b', '#fee825'],

        // diverging

        Spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
        RdYlGn: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'],
        RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
        PiYG: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'],
        PRGn: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
        RdYlBu: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
        BrBG: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
        RdGy: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'],
        PuOr: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],

        // qualitative

        Set2: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
        Accent: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
        Set1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
        Set3: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'],
        Dark2: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
        Paired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
        Pastel2: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'],
        Pastel1: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2'],
    };

    // add lowercase aliases for case-insensitive matches
    for (var i$1 = 0, list$1 = Object.keys(colorbrewer); i$1 < list$1.length; i$1 += 1) {
        var key = list$1[i$1];

        colorbrewer[key.toLowerCase()] = colorbrewer[key];
    }

    var colorbrewer_1 = colorbrewer;

    // feel free to comment out anything to rollup
    // a smaller chroma.js built

    // io --> convert colors















    // operators --> modify existing Colors










    // interpolators










    // generators -- > create new colors
    chroma_1.average = average;
    chroma_1.bezier = bezier_1;
    chroma_1.blend = blend_1;
    chroma_1.cubehelix = cubehelix;
    chroma_1.mix = chroma_1.interpolate = mix;
    chroma_1.random = random_1;
    chroma_1.scale = scale;

    // other utility methods
    chroma_1.analyze = analyze_1.analyze;
    chroma_1.contrast = contrast;
    chroma_1.deltaE = deltaE;
    chroma_1.distance = distance;
    chroma_1.limits = analyze_1.limits;
    chroma_1.valid = valid;

    // scale
    chroma_1.scales = scales;

    // colors
    chroma_1.colors = w3cx11_1;
    chroma_1.brewer = colorbrewer_1;

    var chroma_js = chroma_1;

    return chroma_js;

})));
});

// Derived from npm color-namer due to issue with rollup and weak maps.

var colors = [
  { name: 'black', rgb: 0x000000, origin: 'basic' },
  { name: 'blue', rgb: 0x0000FF, origin: 'basic' },
  { name: 'cyan', rgb: 0x00FFFF, origin: 'basic' },
  { name: 'green', rgb: 0x008000, origin: 'basic' },
  { name: 'teal', rgb: 0x008080, origin: 'basic' },
  { name: 'turquoise', rgb: 0x40E0D0, origin: 'basic' },
  { name: 'indigo', rgb: 0x4B0082, origin: 'basic' },
  { name: 'gray', rgb: 0x808080, origin: 'basic' },
  { name: 'purple', rgb: 0x800080, origin: 'basic' },
  { name: 'brown', rgb: 0xA52A2A, origin: 'basic' },
  { name: 'tan', rgb: 0xD2B48C, origin: 'basic' },
  { name: 'violet', rgb: 0xEE82EE, origin: 'basic' },
  { name: 'beige', rgb: 0xF5F5DC, origin: 'basic' },
  { name: 'fuchsia', rgb: 0xFF00FF, origin: 'basic' },
  { name: 'gold', rgb: 0xFFD700, origin: 'basic' },
  { name: 'magenta', rgb: 0xFF00FF, origin: 'basic' },
  { name: 'orange', rgb: 0xFFA500, origin: 'basic' },
  { name: 'pink', rgb: 0xFFC0CB, origin: 'basic' },
  { name: 'red', rgb: 0xFF0000, origin: 'basic' },
  { name: 'white', rgb: 0xFFFFFF, origin: 'basic' },
  { name: 'yellow', rgb: 0xFFFF00, origin: 'basic' },
  { name: 'aqua', rgb: 0x00FFFF, origin: 'html' },
  { name: 'aliceblue', rgb: 0xF0F8FF, origin: 'html' },
  { name: 'antiquewhite', rgb: 0xFAEBD7, origin: 'html' },
  { name: 'black', rgb: 0x000000, origin: 'html' },
  { name: 'blue', rgb: 0x0000FF, origin: 'html' },
  { name: 'cyan', rgb: 0x00FFFF, origin: 'html' },
  { name: 'darkblue', rgb: 0x00008B, origin: 'html' },
  { name: 'darkcyan', rgb: 0x008B8B, origin: 'html' },
  { name: 'darkgreen', rgb: 0x006400, origin: 'html' },
  { name: 'darkturquoise', rgb: 0x00CED1, origin: 'html' },
  { name: 'deepskyblue', rgb: 0x00BFFF, origin: 'html' },
  { name: 'green', rgb: 0x008000, origin: 'html' },
  { name: 'lime', rgb: 0x00FF00, origin: 'html' },
  { name: 'mediumblue', rgb: 0x0000CD, origin: 'html' },
  { name: 'mediumspringgreen', rgb: 0x00FA9A, origin: 'html' },
  { name: 'navy', rgb: 0x000080, origin: 'html' },
  { name: 'springgreen', rgb: 0x00FF7F, origin: 'html' },
  { name: 'teal', rgb: 0x008080, origin: 'html' },
  { name: 'midnightblue', rgb: 0x191970, origin: 'html' },
  { name: 'dodgerblue', rgb: 0x1E90FF, origin: 'html' },
  { name: 'lightseagreen', rgb: 0x20B2AA, origin: 'html' },
  { name: 'forestgreen', rgb: 0x228B22, origin: 'html' },
  { name: 'seagreen', rgb: 0x2E8B57, origin: 'html' },
  { name: 'darkslategray', rgb: 0x2F4F4F, origin: 'html' },
  { name: 'darkslategrey', rgb: 0x2F4F4F, origin: 'html' },
  { name: 'limegreen', rgb: 0x32CD32, origin: 'html' },
  { name: 'mediumseagreen', rgb: 0x3CB371, origin: 'html' },
  { name: 'turquoise', rgb: 0x40E0D0, origin: 'html' },
  { name: 'royalblue', rgb: 0x4169E1, origin: 'html' },
  { name: 'steelblue', rgb: 0x4682B4, origin: 'html' },
  { name: 'darkslateblue', rgb: 0x483D8B, origin: 'html' },
  { name: 'mediumturquoise', rgb: 0x48D1CC, origin: 'html' },
  { name: 'indigo', rgb: 0x4B0082, origin: 'html' },
  { name: 'darkolivegreen', rgb: 0x556B2F, origin: 'html' },
  { name: 'cadetblue', rgb: 0x5F9EA0, origin: 'html' },
  { name: 'cornflowerblue', rgb: 0x6495ED, origin: 'html' },
  { name: 'mediumaquamarine', rgb: 0x66CDAA, origin: 'html' },
  { name: 'dimgray', rgb: 0x696969, origin: 'html' },
  { name: 'dimgrey', rgb: 0x696969, origin: 'html' },
  { name: 'slateblue', rgb: 0x6A5ACD, origin: 'html' },
  { name: 'olivedrab', rgb: 0x6B8E23, origin: 'html' },
  { name: 'slategray', rgb: 0x708090, origin: 'html' },
  { name: 'slategrey', rgb: 0x708090, origin: 'html' },
  { name: 'lightslategray', rgb: 0x778899, origin: 'html' },
  { name: 'lightslategrey', rgb: 0x778899, origin: 'html' },
  { name: 'mediumslateblue', rgb: 0x7B68EE, origin: 'html' },
  { name: 'lawngreen', rgb: 0x7CFC00, origin: 'html' },
  { name: 'aquamarine', rgb: 0x7FFFD4, origin: 'html' },
  { name: 'chartreuse', rgb: 0x7FFF00, origin: 'html' },
  { name: 'gray', rgb: 0x808080, origin: 'html' },
  { name: 'grey', rgb: 0x808080, origin: 'html' },
  { name: 'maroon', rgb: 0x800000, origin: 'html' },
  { name: 'olive', rgb: 0x808000, origin: 'html' },
  { name: 'purple', rgb: 0x800080, origin: 'html' },
  { name: 'lightskyblue', rgb: 0x87CEFA, origin: 'html' },
  { name: 'skyblue', rgb: 0x87CEEB, origin: 'html' },
  { name: 'blueviolet', rgb: 0x8A2BE2, origin: 'html' },
  { name: 'darkmagenta', rgb: 0x8B008B, origin: 'html' },
  { name: 'darkred', rgb: 0x8B0000, origin: 'html' },
  { name: 'saddlebrown', rgb: 0x8B4513, origin: 'html' },
  { name: 'darkseagreen', rgb: 0x8FBC8F, origin: 'html' },
  { name: 'lightgreen', rgb: 0x90EE90, origin: 'html' },
  { name: 'mediumpurple', rgb: 0x9370DB, origin: 'html' },
  { name: 'darkviolet', rgb: 0x9400D3, origin: 'html' },
  { name: 'palegreen', rgb: 0x98FB98, origin: 'html' },
  { name: 'darkorchid', rgb: 0x9932CC, origin: 'html' },
  { name: 'yellowgreen', rgb: 0x9ACD32, origin: 'html' },
  { name: 'sienna', rgb: 0xA0522D, origin: 'html' },
  { name: 'brown', rgb: 0xA52A2A, origin: 'html' },
  { name: 'darkgray', rgb: 0xA9A9A9, origin: 'html' },
  { name: 'darkgrey', rgb: 0xA9A9A9, origin: 'html' },
  { name: 'greenyellow', rgb: 0xADFF2F, origin: 'html' },
  { name: 'lightblue', rgb: 0xADD8E6, origin: 'html' },
  { name: 'paleturquoise', rgb: 0xAFEEEE, origin: 'html' },
  { name: 'lightsteelblue', rgb: 0xB0C4DE, origin: 'html' },
  { name: 'powderblue', rgb: 0xB0E0E6, origin: 'html' },
  { name: 'firebrick', rgb: 0xB22222, origin: 'html' },
  { name: 'darkgoldenrod', rgb: 0xB8860B, origin: 'html' },
  { name: 'mediumorchid', rgb: 0xBA55D3, origin: 'html' },
  { name: 'rosybrown', rgb: 0xBC8F8F, origin: 'html' },
  { name: 'darkkhaki', rgb: 0xBDB76B, origin: 'html' },
  { name: 'silver', rgb: 0xC0C0C0, origin: 'html' },
  { name: 'mediumvioletred', rgb: 0xC71585, origin: 'html' },
  { name: 'indianred', rgb: 0xCD5C5C, origin: 'html' },
  { name: 'peru', rgb: 0xCD853F, origin: 'html' },
  { name: 'chocolate', rgb: 0xD2691E, origin: 'html' },
  { name: 'tan', rgb: 0xD2B48C, origin: 'html' },
  { name: 'lightgray', rgb: 0xD3D3D3, origin: 'html' },
  { name: 'lightgrey', rgb: 0xD3D3D3, origin: 'html' },
  { name: 'thistle', rgb: 0xD8BFD8, origin: 'html' },
  { name: 'goldenrod', rgb: 0xDAA520, origin: 'html' },
  { name: 'orchid', rgb: 0xDA70D6, origin: 'html' },
  { name: 'palevioletred', rgb: 0xDB7093, origin: 'html' },
  { name: 'crimson', rgb: 0xDC143C, origin: 'html' },
  { name: 'gainsboro', rgb: 0xDCDCDC, origin: 'html' },
  { name: 'plum', rgb: 0xDDA0DD, origin: 'html' },
  { name: 'burlywood', rgb: 0xDEB887, origin: 'html' },
  { name: 'lightcyan', rgb: 0xE0FFFF, origin: 'html' },
  { name: 'lavender', rgb: 0xE6E6FA, origin: 'html' },
  { name: 'darksalmon', rgb: 0xE9967A, origin: 'html' },
  { name: 'palegoldenrod', rgb: 0xEEE8AA, origin: 'html' },
  { name: 'violet', rgb: 0xEE82EE, origin: 'html' },
  { name: 'azure', rgb: 0xF0FFFF, origin: 'html' },
  { name: 'honeydew', rgb: 0xF0FFF0, origin: 'html' },
  { name: 'khaki', rgb: 0xF0E68C, origin: 'html' },
  { name: 'lightcoral', rgb: 0xF08080, origin: 'html' },
  { name: 'sandybrown', rgb: 0xF4A460, origin: 'html' },
  { name: 'beige', rgb: 0xF5F5DC, origin: 'html' },
  { name: 'mintcream', rgb: 0xF5FFFA, origin: 'html' },
  { name: 'wheat', rgb: 0xF5DEB3, origin: 'html' },
  { name: 'whitesmoke', rgb: 0xF5F5F5, origin: 'html' },
  { name: 'ghostwhite', rgb: 0xF8F8FF, origin: 'html' },
  { name: 'lightgoldenrodyellow', rgb: 0xFAFAD2, origin: 'html' },
  { name: 'linen', rgb: 0xFAF0E6, origin: 'html' },
  { name: 'salmon', rgb: 0xFA8072, origin: 'html' },
  { name: 'oldlace', rgb: 0xFDF5E6, origin: 'html' },
  { name: 'bisque', rgb: 0xFFE4C4, origin: 'html' },
  { name: 'blanchedalmond', rgb: 0xFFEBCD, origin: 'html' },
  { name: 'coral', rgb: 0xFF7F50, origin: 'html' },
  { name: 'cornsilk', rgb: 0xFFF8DC, origin: 'html' },
  { name: 'darkorange', rgb: 0xFF8C00, origin: 'html' },
  { name: 'deeppink', rgb: 0xFF1493, origin: 'html' },
  { name: 'floralwhite', rgb: 0xFFFAF0, origin: 'html' },
  { name: 'fuchsia', rgb: 0xFF00FF, origin: 'html' },
  { name: 'gold', rgb: 0xFFD700, origin: 'html' },
  { name: 'hotpink', rgb: 0xFF69B4, origin: 'html' },
  { name: 'ivory', rgb: 0xFFFFF0, origin: 'html' },
  { name: 'lavenderblush', rgb: 0xFFF0F5, origin: 'html' },
  { name: 'lemonchiffon', rgb: 0xFFFACD, origin: 'html' },
  { name: 'lightpink', rgb: 0xFFB6C1, origin: 'html' },
  { name: 'lightsalmon', rgb: 0xFFA07A, origin: 'html' },
  { name: 'lightyellow', rgb: 0xFFFFE0, origin: 'html' },
  { name: 'magenta', rgb: 0xFF00FF, origin: 'html' },
  { name: 'mistyrose', rgb: 0xFFE4E1, origin: 'html' },
  { name: 'moccasin', rgb: 0xFFE4B5, origin: 'html' },
  { name: 'navajowhite', rgb: 0xFFDEAD, origin: 'html' },
  { name: 'orange', rgb: 0xFFA500, origin: 'html' },
  { name: 'orangered', rgb: 0xFF4500, origin: 'html' },
  { name: 'papayawhip', rgb: 0xFFEFD5, origin: 'html' },
  { name: 'peachpuff', rgb: 0xFFDAB9, origin: 'html' },
  { name: 'pink', rgb: 0xFFC0CB, origin: 'html' },
  { name: 'red', rgb: 0xFF0000, origin: 'html' },
  { name: 'seashell', rgb: 0xFFF5EE, origin: 'html' },
  { name: 'snow', rgb: 0xFFFAFA, origin: 'html' },
  { name: 'tomato', rgb: 0xFF6347, origin: 'html' },
  { name: 'white', rgb: 0xFFFFFF, origin: 'html' },
  { name: 'yellow', rgb: 0xFFFF00, origin: 'html' },
  { name: 'black', rgb: 0x000000, origin: './ntc' },
  { name: 'navy blue', rgb: 0x000080, origin: './ntc' },
  { name: 'dark blue', rgb: 0x0000C8, origin: './ntc' },
  { name: 'blue', rgb: 0x0000FF, origin: './ntc' },
  { name: 'stratos', rgb: 0x000741, origin: './ntc' },
  { name: 'swamp', rgb: 0x001B1C, origin: './ntc' },
  { name: 'resolution blue', rgb: 0x002387, origin: './ntc' },
  { name: 'deep fir', rgb: 0x002900, origin: './ntc' },
  { name: 'burnham', rgb: 0x002E20, origin: './ntc' },
  { name: 'international klein blue', rgb: 0x002FA7, origin: './ntc' },
  { name: 'prussian blue', rgb: 0x003153, origin: './ntc' },
  { name: 'midnight blue', rgb: 0x003366, origin: './ntc' },
  { name: 'smalt', rgb: 0x003399, origin: './ntc' },
  { name: 'deep teal', rgb: 0x003532, origin: './ntc' },
  { name: 'cyprus', rgb: 0x003E40, origin: './ntc' },
  { name: 'kaitoke green', rgb: 0x004620, origin: './ntc' },
  { name: 'cobalt', rgb: 0x0047AB, origin: './ntc' },
  { name: 'crusoe', rgb: 0x004816, origin: './ntc' },
  { name: 'sherpa blue', rgb: 0x004950, origin: './ntc' },
  { name: 'endeavour', rgb: 0x0056A7, origin: './ntc' },
  { name: 'camarone', rgb: 0x00581A, origin: './ntc' },
  { name: 'science blue', rgb: 0x0066CC, origin: './ntc' },
  { name: 'blue ribbon', rgb: 0x0066FF, origin: './ntc' },
  { name: 'tropical rain forest', rgb: 0x00755E, origin: './ntc' },
  { name: 'allports', rgb: 0x0076A3, origin: './ntc' },
  { name: 'deep cerulean', rgb: 0x007BA7, origin: './ntc' },
  { name: 'lochmara', rgb: 0x007EC7, origin: './ntc' },
  { name: 'azure radiance', rgb: 0x007FFF, origin: './ntc' },
  { name: 'teal', rgb: 0x008080, origin: './ntc' },
  { name: 'bondi blue', rgb: 0x0095B6, origin: './ntc' },
  { name: 'pacific blue', rgb: 0x009DC4, origin: './ntc' },
  { name: 'persian green', rgb: 0x00A693, origin: './ntc' },
  { name: 'jade', rgb: 0x00A86B, origin: './ntc' },
  { name: 'caribbean green', rgb: 0x00CC99, origin: './ntc' },
  { name: "robin's egg blue", rgb: 0x00CCCC, origin: './ntc' },
  { name: 'green', rgb: 0x00FF00, origin: './ntc' },
  { name: 'spring green', rgb: 0x00FF7F, origin: './ntc' },
  { name: 'cyan / aqua', rgb: 0x00FFFF, origin: './ntc' },
  { name: 'blue charcoal', rgb: 0x010D1A, origin: './ntc' },
  { name: 'midnight', rgb: 0x011635, origin: './ntc' },
  { name: 'holly', rgb: 0x011D13, origin: './ntc' },
  { name: 'daintree', rgb: 0x012731, origin: './ntc' },
  { name: 'cardin green', rgb: 0x01361C, origin: './ntc' },
  { name: 'county green', rgb: 0x01371A, origin: './ntc' },
  { name: 'astronaut blue', rgb: 0x013E62, origin: './ntc' },
  { name: 'regal blue', rgb: 0x013F6A, origin: './ntc' },
  { name: 'aqua deep', rgb: 0x014B43, origin: './ntc' },
  { name: 'orient', rgb: 0x015E85, origin: './ntc' },
  { name: 'blue stone', rgb: 0x016162, origin: './ntc' },
  { name: 'fun green', rgb: 0x016D39, origin: './ntc' },
  { name: 'pine green', rgb: 0x01796F, origin: './ntc' },
  { name: 'blue lagoon', rgb: 0x017987, origin: './ntc' },
  { name: 'deep sea', rgb: 0x01826B, origin: './ntc' },
  { name: 'green haze', rgb: 0x01A368, origin: './ntc' },
  { name: 'english holly', rgb: 0x022D15, origin: './ntc' },
  { name: 'sherwood green', rgb: 0x02402C, origin: './ntc' },
  { name: 'congress blue', rgb: 0x02478E, origin: './ntc' },
  { name: 'evening sea', rgb: 0x024E46, origin: './ntc' },
  { name: 'bahama blue', rgb: 0x026395, origin: './ntc' },
  { name: 'observatory', rgb: 0x02866F, origin: './ntc' },
  { name: 'cerulean', rgb: 0x02A4D3, origin: './ntc' },
  { name: 'tangaroa', rgb: 0x03163C, origin: './ntc' },
  { name: 'green vogue', rgb: 0x032B52, origin: './ntc' },
  { name: 'mosque', rgb: 0x036A6E, origin: './ntc' },
  { name: 'midnight moss', rgb: 0x041004, origin: './ntc' },
  { name: 'black pearl', rgb: 0x041322, origin: './ntc' },
  { name: 'blue whale', rgb: 0x042E4C, origin: './ntc' },
  { name: 'zuccini', rgb: 0x044022, origin: './ntc' },
  { name: 'teal blue', rgb: 0x044259, origin: './ntc' },
  { name: 'deep cove', rgb: 0x051040, origin: './ntc' },
  { name: 'gulf blue', rgb: 0x051657, origin: './ntc' },
  { name: 'venice blue', rgb: 0x055989, origin: './ntc' },
  { name: 'watercourse', rgb: 0x056F57, origin: './ntc' },
  { name: 'catalina blue', rgb: 0x062A78, origin: './ntc' },
  { name: 'tiber', rgb: 0x063537, origin: './ntc' },
  { name: 'gossamer', rgb: 0x069B81, origin: './ntc' },
  { name: 'niagara', rgb: 0x06A189, origin: './ntc' },
  { name: 'tarawera', rgb: 0x073A50, origin: './ntc' },
  { name: 'jaguar', rgb: 0x080110, origin: './ntc' },
  { name: 'black bean', rgb: 0x081910, origin: './ntc' },
  { name: 'deep sapphire', rgb: 0x082567, origin: './ntc' },
  { name: 'elf green', rgb: 0x088370, origin: './ntc' },
  { name: 'bright turquoise', rgb: 0x08E8DE, origin: './ntc' },
  { name: 'downriver', rgb: 0x092256, origin: './ntc' },
  { name: 'palm green', rgb: 0x09230F, origin: './ntc' },
  { name: 'madison', rgb: 0x09255D, origin: './ntc' },
  { name: 'bottle green', rgb: 0x093624, origin: './ntc' },
  { name: 'deep sea green', rgb: 0x095859, origin: './ntc' },
  { name: 'salem', rgb: 0x097F4B, origin: './ntc' },
  { name: 'black russian', rgb: 0x0A001C, origin: './ntc' },
  { name: 'dark fern', rgb: 0x0A480D, origin: './ntc' },
  { name: 'japanese laurel', rgb: 0x0A6906, origin: './ntc' },
  { name: 'atoll', rgb: 0x0A6F75, origin: './ntc' },
  { name: 'cod gray', rgb: 0x0B0B0B, origin: './ntc' },
  { name: 'marshland', rgb: 0x0B0F08, origin: './ntc' },
  { name: 'gordons green', rgb: 0x0B1107, origin: './ntc' },
  { name: 'black forest', rgb: 0x0B1304, origin: './ntc' },
  { name: 'san felix', rgb: 0x0B6207, origin: './ntc' },
  { name: 'malachite', rgb: 0x0BDA51, origin: './ntc' },
  { name: 'ebony', rgb: 0x0C0B1D, origin: './ntc' },
  { name: 'woodsmoke', rgb: 0x0C0D0F, origin: './ntc' },
  { name: 'racing green', rgb: 0x0C1911, origin: './ntc' },
  { name: 'surfie green', rgb: 0x0C7A79, origin: './ntc' },
  { name: 'blue chill', rgb: 0x0C8990, origin: './ntc' },
  { name: 'black rock', rgb: 0x0D0332, origin: './ntc' },
  { name: 'bunker', rgb: 0x0D1117, origin: './ntc' },
  { name: 'aztec', rgb: 0x0D1C19, origin: './ntc' },
  { name: 'bush', rgb: 0x0D2E1C, origin: './ntc' },
  { name: 'cinder', rgb: 0x0E0E18, origin: './ntc' },
  { name: 'firefly', rgb: 0x0E2A30, origin: './ntc' },
  { name: 'torea bay', rgb: 0x0F2D9E, origin: './ntc' },
  { name: 'vulcan', rgb: 0x10121D, origin: './ntc' },
  { name: 'green waterloo', rgb: 0x101405, origin: './ntc' },
  { name: 'eden', rgb: 0x105852, origin: './ntc' },
  { name: 'arapawa', rgb: 0x110C6C, origin: './ntc' },
  { name: 'ultramarine', rgb: 0x120A8F, origin: './ntc' },
  { name: 'elephant', rgb: 0x123447, origin: './ntc' },
  { name: 'jewel', rgb: 0x126B40, origin: './ntc' },
  { name: 'diesel', rgb: 0x130000, origin: './ntc' },
  { name: 'asphalt', rgb: 0x130A06, origin: './ntc' },
  { name: 'blue zodiac', rgb: 0x13264D, origin: './ntc' },
  { name: 'parsley', rgb: 0x134F19, origin: './ntc' },
  { name: 'nero', rgb: 0x140600, origin: './ntc' },
  { name: 'tory blue', rgb: 0x1450AA, origin: './ntc' },
  { name: 'bunting', rgb: 0x151F4C, origin: './ntc' },
  { name: 'denim', rgb: 0x1560BD, origin: './ntc' },
  { name: 'genoa', rgb: 0x15736B, origin: './ntc' },
  { name: 'mirage', rgb: 0x161928, origin: './ntc' },
  { name: 'hunter green', rgb: 0x161D10, origin: './ntc' },
  { name: 'big stone', rgb: 0x162A40, origin: './ntc' },
  { name: 'celtic', rgb: 0x163222, origin: './ntc' },
  { name: 'timber green', rgb: 0x16322C, origin: './ntc' },
  { name: 'gable green', rgb: 0x163531, origin: './ntc' },
  { name: 'pine tree', rgb: 0x171F04, origin: './ntc' },
  { name: 'chathams blue', rgb: 0x175579, origin: './ntc' },
  { name: 'deep forest green', rgb: 0x182D09, origin: './ntc' },
  { name: 'blumine', rgb: 0x18587A, origin: './ntc' },
  { name: 'palm leaf', rgb: 0x19330E, origin: './ntc' },
  { name: 'nile blue', rgb: 0x193751, origin: './ntc' },
  { name: 'fun blue', rgb: 0x1959A8, origin: './ntc' },
  { name: 'lucky point', rgb: 0x1A1A68, origin: './ntc' },
  { name: 'mountain meadow', rgb: 0x1AB385, origin: './ntc' },
  { name: 'tolopea', rgb: 0x1B0245, origin: './ntc' },
  { name: 'haiti', rgb: 0x1B1035, origin: './ntc' },
  { name: 'deep koamaru', rgb: 0x1B127B, origin: './ntc' },
  { name: 'acadia', rgb: 0x1B1404, origin: './ntc' },
  { name: 'seaweed', rgb: 0x1B2F11, origin: './ntc' },
  { name: 'biscay', rgb: 0x1B3162, origin: './ntc' },
  { name: 'matisse', rgb: 0x1B659D, origin: './ntc' },
  { name: 'crowshead', rgb: 0x1C1208, origin: './ntc' },
  { name: 'rangoon green', rgb: 0x1C1E13, origin: './ntc' },
  { name: 'persian blue', rgb: 0x1C39BB, origin: './ntc' },
  { name: 'everglade', rgb: 0x1C402E, origin: './ntc' },
  { name: 'elm', rgb: 0x1C7C7D, origin: './ntc' },
  { name: 'green pea', rgb: 0x1D6142, origin: './ntc' },
  { name: 'creole', rgb: 0x1E0F04, origin: './ntc' },
  { name: 'karaka', rgb: 0x1E1609, origin: './ntc' },
  { name: 'el paso', rgb: 0x1E1708, origin: './ntc' },
  { name: 'cello', rgb: 0x1E385B, origin: './ntc' },
  { name: 'te papa green', rgb: 0x1E433C, origin: './ntc' },
  { name: 'dodger blue', rgb: 0x1E90FF, origin: './ntc' },
  { name: 'eastern blue', rgb: 0x1E9AB0, origin: './ntc' },
  { name: 'night rider', rgb: 0x1F120F, origin: './ntc' },
  { name: 'java', rgb: 0x1FC2C2, origin: './ntc' },
  { name: 'jacksons purple', rgb: 0x20208D, origin: './ntc' },
  { name: 'cloud burst', rgb: 0x202E54, origin: './ntc' },
  { name: 'blue dianne', rgb: 0x204852, origin: './ntc' },
  { name: 'eternity', rgb: 0x211A0E, origin: './ntc' },
  { name: 'deep blue', rgb: 0x220878, origin: './ntc' },
  { name: 'forest green', rgb: 0x228B22, origin: './ntc' },
  { name: 'mallard', rgb: 0x233418, origin: './ntc' },
  { name: 'violet', rgb: 0x240A40, origin: './ntc' },
  { name: 'kilamanjaro', rgb: 0x240C02, origin: './ntc' },
  { name: 'log cabin', rgb: 0x242A1D, origin: './ntc' },
  { name: 'black olive', rgb: 0x242E16, origin: './ntc' },
  { name: 'green house', rgb: 0x24500F, origin: './ntc' },
  { name: 'graphite', rgb: 0x251607, origin: './ntc' },
  { name: 'cannon black', rgb: 0x251706, origin: './ntc' },
  { name: 'port gore', rgb: 0x251F4F, origin: './ntc' },
  { name: 'shark', rgb: 0x25272C, origin: './ntc' },
  { name: 'green kelp', rgb: 0x25311C, origin: './ntc' },
  { name: 'curious blue', rgb: 0x2596D1, origin: './ntc' },
  { name: 'paua', rgb: 0x260368, origin: './ntc' },
  { name: 'paris m', rgb: 0x26056A, origin: './ntc' },
  { name: 'wood bark', rgb: 0x261105, origin: './ntc' },
  { name: 'gondola', rgb: 0x261414, origin: './ntc' },
  { name: 'steel gray', rgb: 0x262335, origin: './ntc' },
  { name: 'ebony clay', rgb: 0x26283B, origin: './ntc' },
  { name: 'bay of many', rgb: 0x273A81, origin: './ntc' },
  { name: 'plantation', rgb: 0x27504B, origin: './ntc' },
  { name: 'eucalyptus', rgb: 0x278A5B, origin: './ntc' },
  { name: 'oil', rgb: 0x281E15, origin: './ntc' },
  { name: 'astronaut', rgb: 0x283A77, origin: './ntc' },
  { name: 'mariner', rgb: 0x286ACD, origin: './ntc' },
  { name: 'violent violet', rgb: 0x290C5E, origin: './ntc' },
  { name: 'bastille', rgb: 0x292130, origin: './ntc' },
  { name: 'zeus', rgb: 0x292319, origin: './ntc' },
  { name: 'charade', rgb: 0x292937, origin: './ntc' },
  { name: 'jelly bean', rgb: 0x297B9A, origin: './ntc' },
  { name: 'jungle green', rgb: 0x29AB87, origin: './ntc' },
  { name: 'cherry pie', rgb: 0x2A0359, origin: './ntc' },
  { name: 'coffee bean', rgb: 0x2A140E, origin: './ntc' },
  { name: 'baltic sea', rgb: 0x2A2630, origin: './ntc' },
  { name: 'turtle green', rgb: 0x2A380B, origin: './ntc' },
  { name: 'cerulean blue', rgb: 0x2A52BE, origin: './ntc' },
  { name: 'sepia black', rgb: 0x2B0202, origin: './ntc' },
  { name: 'valhalla', rgb: 0x2B194F, origin: './ntc' },
  { name: 'heavy metal', rgb: 0x2B3228, origin: './ntc' },
  { name: 'blue gem', rgb: 0x2C0E8C, origin: './ntc' },
  { name: 'revolver', rgb: 0x2C1632, origin: './ntc' },
  { name: 'bleached cedar', rgb: 0x2C2133, origin: './ntc' },
  { name: 'lochinvar', rgb: 0x2C8C84, origin: './ntc' },
  { name: 'mikado', rgb: 0x2D2510, origin: './ntc' },
  { name: 'outer space', rgb: 0x2D383A, origin: './ntc' },
  { name: 'st tropaz', rgb: 0x2D569B, origin: './ntc' },
  { name: 'jacaranda', rgb: 0x2E0329, origin: './ntc' },
  { name: 'jacko bean', rgb: 0x2E1905, origin: './ntc' },
  { name: 'rangitoto', rgb: 0x2E3222, origin: './ntc' },
  { name: 'rhino', rgb: 0x2E3F62, origin: './ntc' },
  { name: 'sea green', rgb: 0x2E8B57, origin: './ntc' },
  { name: 'scooter', rgb: 0x2EBFD4, origin: './ntc' },
  { name: 'onion', rgb: 0x2F270E, origin: './ntc' },
  { name: 'governor bay', rgb: 0x2F3CB3, origin: './ntc' },
  { name: 'sapphire', rgb: 0x2F519E, origin: './ntc' },
  { name: 'spectra', rgb: 0x2F5A57, origin: './ntc' },
  { name: 'casal', rgb: 0x2F6168, origin: './ntc' },
  { name: 'melanzane', rgb: 0x300529, origin: './ntc' },
  { name: 'cocoa brown', rgb: 0x301F1E, origin: './ntc' },
  { name: 'woodrush', rgb: 0x302A0F, origin: './ntc' },
  { name: 'san juan', rgb: 0x304B6A, origin: './ntc' },
  { name: 'turquoise', rgb: 0x30D5C8, origin: './ntc' },
  { name: 'eclipse', rgb: 0x311C17, origin: './ntc' },
  { name: 'pickled bluewood', rgb: 0x314459, origin: './ntc' },
  { name: 'azure', rgb: 0x315BA1, origin: './ntc' },
  { name: 'calypso', rgb: 0x31728D, origin: './ntc' },
  { name: 'paradiso', rgb: 0x317D82, origin: './ntc' },
  { name: 'persian indigo', rgb: 0x32127A, origin: './ntc' },
  { name: 'blackcurrant', rgb: 0x32293A, origin: './ntc' },
  { name: 'mine shaft', rgb: 0x323232, origin: './ntc' },
  { name: 'stromboli', rgb: 0x325D52, origin: './ntc' },
  { name: 'bilbao', rgb: 0x327C14, origin: './ntc' },
  { name: 'astral', rgb: 0x327DA0, origin: './ntc' },
  { name: 'christalle', rgb: 0x33036B, origin: './ntc' },
  { name: 'thunder', rgb: 0x33292F, origin: './ntc' },
  { name: 'shamrock', rgb: 0x33CC99, origin: './ntc' },
  { name: 'tamarind', rgb: 0x341515, origin: './ntc' },
  { name: 'mardi gras', rgb: 0x350036, origin: './ntc' },
  { name: 'valentino', rgb: 0x350E42, origin: './ntc' },
  { name: 'jagger', rgb: 0x350E57, origin: './ntc' },
  { name: 'tuna', rgb: 0x353542, origin: './ntc' },
  { name: 'chambray', rgb: 0x354E8C, origin: './ntc' },
  { name: 'martinique', rgb: 0x363050, origin: './ntc' },
  { name: 'tuatara', rgb: 0x363534, origin: './ntc' },
  { name: 'waiouru', rgb: 0x363C0D, origin: './ntc' },
  { name: 'ming', rgb: 0x36747D, origin: './ntc' },
  { name: 'la palma', rgb: 0x368716, origin: './ntc' },
  { name: 'chocolate', rgb: 0x370202, origin: './ntc' },
  { name: 'clinker', rgb: 0x371D09, origin: './ntc' },
  { name: 'brown tumbleweed', rgb: 0x37290E, origin: './ntc' },
  { name: 'birch', rgb: 0x373021, origin: './ntc' },
  { name: 'oracle', rgb: 0x377475, origin: './ntc' },
  { name: 'blue diamond', rgb: 0x380474, origin: './ntc' },
  { name: 'grape', rgb: 0x381A51, origin: './ntc' },
  { name: 'dune', rgb: 0x383533, origin: './ntc' },
  { name: 'oxford blue', rgb: 0x384555, origin: './ntc' },
  { name: 'clover', rgb: 0x384910, origin: './ntc' },
  { name: 'limed spruce', rgb: 0x394851, origin: './ntc' },
  { name: 'dell', rgb: 0x396413, origin: './ntc' },
  { name: 'toledo', rgb: 0x3A0020, origin: './ntc' },
  { name: 'sambuca', rgb: 0x3A2010, origin: './ntc' },
  { name: 'jacarta', rgb: 0x3A2A6A, origin: './ntc' },
  { name: 'william', rgb: 0x3A686C, origin: './ntc' },
  { name: 'killarney', rgb: 0x3A6A47, origin: './ntc' },
  { name: 'keppel', rgb: 0x3AB09E, origin: './ntc' },
  { name: 'temptress', rgb: 0x3B000B, origin: './ntc' },
  { name: 'aubergine', rgb: 0x3B0910, origin: './ntc' },
  { name: 'jon', rgb: 0x3B1F1F, origin: './ntc' },
  { name: 'treehouse', rgb: 0x3B2820, origin: './ntc' },
  { name: 'amazon', rgb: 0x3B7A57, origin: './ntc' },
  { name: 'boston blue', rgb: 0x3B91B4, origin: './ntc' },
  { name: 'windsor', rgb: 0x3C0878, origin: './ntc' },
  { name: 'rebel', rgb: 0x3C1206, origin: './ntc' },
  { name: 'meteorite', rgb: 0x3C1F76, origin: './ntc' },
  { name: 'dark ebony', rgb: 0x3C2005, origin: './ntc' },
  { name: 'camouflage', rgb: 0x3C3910, origin: './ntc' },
  { name: 'bright gray', rgb: 0x3C4151, origin: './ntc' },
  { name: 'cape cod', rgb: 0x3C4443, origin: './ntc' },
  { name: 'lunar green', rgb: 0x3C493A, origin: './ntc' },
  { name: 'bean  ', rgb: 0x3D0C02, origin: './ntc' },
  { name: 'bistre', rgb: 0x3D2B1F, origin: './ntc' },
  { name: 'goblin', rgb: 0x3D7D52, origin: './ntc' },
  { name: 'kingfisher daisy', rgb: 0x3E0480, origin: './ntc' },
  { name: 'cedar', rgb: 0x3E1C14, origin: './ntc' },
  { name: 'english walnut', rgb: 0x3E2B23, origin: './ntc' },
  { name: 'black marlin', rgb: 0x3E2C1C, origin: './ntc' },
  { name: 'ship gray', rgb: 0x3E3A44, origin: './ntc' },
  { name: 'pelorous', rgb: 0x3EABBF, origin: './ntc' },
  { name: 'bronze', rgb: 0x3F2109, origin: './ntc' },
  { name: 'cola', rgb: 0x3F2500, origin: './ntc' },
  { name: 'madras', rgb: 0x3F3002, origin: './ntc' },
  { name: 'minsk', rgb: 0x3F307F, origin: './ntc' },
  { name: 'cabbage pont', rgb: 0x3F4C3A, origin: './ntc' },
  { name: 'tom thumb', rgb: 0x3F583B, origin: './ntc' },
  { name: 'mineral green', rgb: 0x3F5D53, origin: './ntc' },
  { name: 'puerto rico', rgb: 0x3FC1AA, origin: './ntc' },
  { name: 'harlequin', rgb: 0x3FFF00, origin: './ntc' },
  { name: 'brown pod', rgb: 0x401801, origin: './ntc' },
  { name: 'cork', rgb: 0x40291D, origin: './ntc' },
  { name: 'masala', rgb: 0x403B38, origin: './ntc' },
  { name: 'thatch green', rgb: 0x403D19, origin: './ntc' },
  { name: 'fiord', rgb: 0x405169, origin: './ntc' },
  { name: 'viridian', rgb: 0x40826D, origin: './ntc' },
  { name: 'chateau green', rgb: 0x40A860, origin: './ntc' },
  { name: 'ripe plum', rgb: 0x410056, origin: './ntc' },
  { name: 'paco', rgb: 0x411F10, origin: './ntc' },
  { name: 'deep oak', rgb: 0x412010, origin: './ntc' },
  { name: 'merlin', rgb: 0x413C37, origin: './ntc' },
  { name: 'gun powder', rgb: 0x414257, origin: './ntc' },
  { name: 'east bay', rgb: 0x414C7D, origin: './ntc' },
  { name: 'royal blue', rgb: 0x4169E1, origin: './ntc' },
  { name: 'ocean green', rgb: 0x41AA78, origin: './ntc' },
  { name: 'burnt maroon', rgb: 0x420303, origin: './ntc' },
  { name: 'lisbon brown', rgb: 0x423921, origin: './ntc' },
  { name: 'faded jade', rgb: 0x427977, origin: './ntc' },
  { name: 'scarlet gum', rgb: 0x431560, origin: './ntc' },
  { name: 'iroko', rgb: 0x433120, origin: './ntc' },
  { name: 'armadillo', rgb: 0x433E37, origin: './ntc' },
  { name: 'river bed', rgb: 0x434C59, origin: './ntc' },
  { name: 'green leaf', rgb: 0x436A0D, origin: './ntc' },
  { name: 'barossa', rgb: 0x44012D, origin: './ntc' },
  { name: 'morocco brown', rgb: 0x441D00, origin: './ntc' },
  { name: 'mako', rgb: 0x444954, origin: './ntc' },
  { name: 'kelp', rgb: 0x454936, origin: './ntc' },
  { name: 'san marino', rgb: 0x456CAC, origin: './ntc' },
  { name: 'picton blue', rgb: 0x45B1E8, origin: './ntc' },
  { name: 'loulou', rgb: 0x460B41, origin: './ntc' },
  { name: 'crater brown', rgb: 0x462425, origin: './ntc' },
  { name: 'gray asparagus', rgb: 0x465945, origin: './ntc' },
  { name: 'steel blue', rgb: 0x4682B4, origin: './ntc' },
  { name: 'rustic red', rgb: 0x480404, origin: './ntc' },
  { name: 'bulgarian rose', rgb: 0x480607, origin: './ntc' },
  { name: 'clairvoyant', rgb: 0x480656, origin: './ntc' },
  { name: 'cocoa bean', rgb: 0x481C1C, origin: './ntc' },
  { name: 'woody brown', rgb: 0x483131, origin: './ntc' },
  { name: 'taupe', rgb: 0x483C32, origin: './ntc' },
  { name: 'van cleef', rgb: 0x49170C, origin: './ntc' },
  { name: 'brown derby', rgb: 0x492615, origin: './ntc' },
  { name: 'metallic bronze', rgb: 0x49371B, origin: './ntc' },
  { name: 'verdun green', rgb: 0x495400, origin: './ntc' },
  { name: 'blue bayoux', rgb: 0x496679, origin: './ntc' },
  { name: 'bismark', rgb: 0x497183, origin: './ntc' },
  { name: 'bracken', rgb: 0x4A2A04, origin: './ntc' },
  { name: 'deep bronze', rgb: 0x4A3004, origin: './ntc' },
  { name: 'mondo', rgb: 0x4A3C30, origin: './ntc' },
  { name: 'tundora', rgb: 0x4A4244, origin: './ntc' },
  { name: 'gravel', rgb: 0x4A444B, origin: './ntc' },
  { name: 'trout', rgb: 0x4A4E5A, origin: './ntc' },
  { name: 'pigment indigo', rgb: 0x4B0082, origin: './ntc' },
  { name: 'nandor', rgb: 0x4B5D52, origin: './ntc' },
  { name: 'saddle', rgb: 0x4C3024, origin: './ntc' },
  { name: 'abbey', rgb: 0x4C4F56, origin: './ntc' },
  { name: 'blackberry', rgb: 0x4D0135, origin: './ntc' },
  { name: 'cab sav', rgb: 0x4D0A18, origin: './ntc' },
  { name: 'indian tan', rgb: 0x4D1E01, origin: './ntc' },
  { name: 'cowboy', rgb: 0x4D282D, origin: './ntc' },
  { name: 'livid brown', rgb: 0x4D282E, origin: './ntc' },
  { name: 'rock', rgb: 0x4D3833, origin: './ntc' },
  { name: 'punga', rgb: 0x4D3D14, origin: './ntc' },
  { name: 'bronzetone', rgb: 0x4D400F, origin: './ntc' },
  { name: 'woodland', rgb: 0x4D5328, origin: './ntc' },
  { name: 'mahogany', rgb: 0x4E0606, origin: './ntc' },
  { name: 'bossanova', rgb: 0x4E2A5A, origin: './ntc' },
  { name: 'matterhorn', rgb: 0x4E3B41, origin: './ntc' },
  { name: 'bronze olive', rgb: 0x4E420C, origin: './ntc' },
  { name: 'mulled wine', rgb: 0x4E4562, origin: './ntc' },
  { name: 'axolotl', rgb: 0x4E6649, origin: './ntc' },
  { name: 'wedgewood', rgb: 0x4E7F9E, origin: './ntc' },
  { name: 'shakespeare', rgb: 0x4EABD1, origin: './ntc' },
  { name: 'honey flower', rgb: 0x4F1C70, origin: './ntc' },
  { name: 'daisy bush', rgb: 0x4F2398, origin: './ntc' },
  { name: 'indigo', rgb: 0x4F69C6, origin: './ntc' },
  { name: 'fern green', rgb: 0x4F7942, origin: './ntc' },
  { name: 'fruit salad', rgb: 0x4F9D5D, origin: './ntc' },
  { name: 'apple', rgb: 0x4FA83D, origin: './ntc' },
  { name: 'mortar', rgb: 0x504351, origin: './ntc' },
  { name: 'kashmir blue', rgb: 0x507096, origin: './ntc' },
  { name: 'cutty sark', rgb: 0x507672, origin: './ntc' },
  { name: 'emerald', rgb: 0x50C878, origin: './ntc' },
  { name: 'emperor', rgb: 0x514649, origin: './ntc' },
  { name: 'chalet green', rgb: 0x516E3D, origin: './ntc' },
  { name: 'como', rgb: 0x517C66, origin: './ntc' },
  { name: 'smalt blue', rgb: 0x51808F, origin: './ntc' },
  { name: 'castro', rgb: 0x52001F, origin: './ntc' },
  { name: 'maroon oak', rgb: 0x520C17, origin: './ntc' },
  { name: 'gigas', rgb: 0x523C94, origin: './ntc' },
  { name: 'voodoo', rgb: 0x533455, origin: './ntc' },
  { name: 'victoria', rgb: 0x534491, origin: './ntc' },
  { name: 'hippie green', rgb: 0x53824B, origin: './ntc' },
  { name: 'heath', rgb: 0x541012, origin: './ntc' },
  { name: 'judge gray', rgb: 0x544333, origin: './ntc' },
  { name: 'fuscous gray', rgb: 0x54534D, origin: './ntc' },
  { name: 'vida loca', rgb: 0x549019, origin: './ntc' },
  { name: 'cioccolato', rgb: 0x55280C, origin: './ntc' },
  { name: 'saratoga', rgb: 0x555B10, origin: './ntc' },
  { name: 'finlandia', rgb: 0x556D56, origin: './ntc' },
  { name: 'havelock blue', rgb: 0x5590D9, origin: './ntc' },
  { name: 'fountain blue', rgb: 0x56B4BE, origin: './ntc' },
  { name: 'spring leaves', rgb: 0x578363, origin: './ntc' },
  { name: 'saddle brown', rgb: 0x583401, origin: './ntc' },
  { name: 'scarpa flow', rgb: 0x585562, origin: './ntc' },
  { name: 'cactus', rgb: 0x587156, origin: './ntc' },
  { name: 'hippie blue', rgb: 0x589AAF, origin: './ntc' },
  { name: 'wine berry', rgb: 0x591D35, origin: './ntc' },
  { name: 'brown bramble', rgb: 0x592804, origin: './ntc' },
  { name: 'congo brown', rgb: 0x593737, origin: './ntc' },
  { name: 'millbrook', rgb: 0x594433, origin: './ntc' },
  { name: 'waikawa gray', rgb: 0x5A6E9C, origin: './ntc' },
  { name: 'horizon', rgb: 0x5A87A0, origin: './ntc' },
  { name: 'jambalaya', rgb: 0x5B3013, origin: './ntc' },
  { name: 'bordeaux', rgb: 0x5C0120, origin: './ntc' },
  { name: 'mulberry wood', rgb: 0x5C0536, origin: './ntc' },
  { name: 'carnaby tan', rgb: 0x5C2E01, origin: './ntc' },
  { name: 'comet', rgb: 0x5C5D75, origin: './ntc' },
  { name: 'redwood', rgb: 0x5D1E0F, origin: './ntc' },
  { name: 'don juan', rgb: 0x5D4C51, origin: './ntc' },
  { name: 'chicago', rgb: 0x5D5C58, origin: './ntc' },
  { name: 'verdigris', rgb: 0x5D5E37, origin: './ntc' },
  { name: 'dingley', rgb: 0x5D7747, origin: './ntc' },
  { name: 'breaker bay', rgb: 0x5DA19F, origin: './ntc' },
  { name: 'kabul', rgb: 0x5E483E, origin: './ntc' },
  { name: 'hemlock', rgb: 0x5E5D3B, origin: './ntc' },
  { name: 'irish coffee', rgb: 0x5F3D26, origin: './ntc' },
  { name: 'mid gray', rgb: 0x5F5F6E, origin: './ntc' },
  { name: 'shuttle gray', rgb: 0x5F6672, origin: './ntc' },
  { name: 'aqua forest', rgb: 0x5FA777, origin: './ntc' },
  { name: 'tradewind', rgb: 0x5FB3AC, origin: './ntc' },
  { name: 'horses neck', rgb: 0x604913, origin: './ntc' },
  { name: 'smoky', rgb: 0x605B73, origin: './ntc' },
  { name: 'corduroy', rgb: 0x606E68, origin: './ntc' },
  { name: 'danube', rgb: 0x6093D1, origin: './ntc' },
  { name: 'espresso', rgb: 0x612718, origin: './ntc' },
  { name: 'eggplant', rgb: 0x614051, origin: './ntc' },
  { name: 'costa del sol', rgb: 0x615D30, origin: './ntc' },
  { name: 'glade green', rgb: 0x61845F, origin: './ntc' },
  { name: 'buccaneer', rgb: 0x622F30, origin: './ntc' },
  { name: 'quincy', rgb: 0x623F2D, origin: './ntc' },
  { name: 'butterfly bush', rgb: 0x624E9A, origin: './ntc' },
  { name: 'west coast', rgb: 0x625119, origin: './ntc' },
  { name: 'finch', rgb: 0x626649, origin: './ntc' },
  { name: 'patina', rgb: 0x639A8F, origin: './ntc' },
  { name: 'fern', rgb: 0x63B76C, origin: './ntc' },
  { name: 'blue violet', rgb: 0x6456B7, origin: './ntc' },
  { name: 'dolphin', rgb: 0x646077, origin: './ntc' },
  { name: 'storm dust', rgb: 0x646463, origin: './ntc' },
  { name: 'siam', rgb: 0x646A54, origin: './ntc' },
  { name: 'nevada', rgb: 0x646E75, origin: './ntc' },
  { name: 'cornflower blue', rgb: 0x6495ED, origin: './ntc' },
  { name: 'viking', rgb: 0x64CCDB, origin: './ntc' },
  { name: 'rosewood', rgb: 0x65000B, origin: './ntc' },
  { name: 'cherrywood', rgb: 0x651A14, origin: './ntc' },
  { name: 'purple heart', rgb: 0x652DC1, origin: './ntc' },
  { name: 'fern frond', rgb: 0x657220, origin: './ntc' },
  { name: 'willow grove', rgb: 0x65745D, origin: './ntc' },
  { name: 'hoki', rgb: 0x65869F, origin: './ntc' },
  { name: 'pompadour', rgb: 0x660045, origin: './ntc' },
  { name: 'purple', rgb: 0x660099, origin: './ntc' },
  { name: 'tyrian purple', rgb: 0x66023C, origin: './ntc' },
  { name: 'dark tan', rgb: 0x661010, origin: './ntc' },
  { name: 'silver tree', rgb: 0x66B58F, origin: './ntc' },
  { name: 'bright green', rgb: 0x66FF00, origin: './ntc' },
  { name: "screamin' green", rgb: 0x66FF66, origin: './ntc' },
  { name: 'black rose', rgb: 0x67032D, origin: './ntc' },
  { name: 'scampi', rgb: 0x675FA6, origin: './ntc' },
  { name: 'ironside gray', rgb: 0x676662, origin: './ntc' },
  { name: 'viridian green', rgb: 0x678975, origin: './ntc' },
  { name: 'christi', rgb: 0x67A712, origin: './ntc' },
  { name: 'nutmeg wood finish', rgb: 0x683600, origin: './ntc' },
  { name: 'zambezi', rgb: 0x685558, origin: './ntc' },
  { name: 'salt box', rgb: 0x685E6E, origin: './ntc' },
  { name: 'tawny port', rgb: 0x692545, origin: './ntc' },
  { name: 'finn', rgb: 0x692D54, origin: './ntc' },
  { name: 'scorpion', rgb: 0x695F62, origin: './ntc' },
  { name: 'lynch', rgb: 0x697E9A, origin: './ntc' },
  { name: 'spice', rgb: 0x6A442E, origin: './ntc' },
  { name: 'himalaya', rgb: 0x6A5D1B, origin: './ntc' },
  { name: 'soya bean', rgb: 0x6A6051, origin: './ntc' },
  { name: 'hairy heath', rgb: 0x6B2A14, origin: './ntc' },
  { name: 'royal purple', rgb: 0x6B3FA0, origin: './ntc' },
  { name: 'shingle fawn', rgb: 0x6B4E31, origin: './ntc' },
  { name: 'dorado', rgb: 0x6B5755, origin: './ntc' },
  { name: 'bermuda gray', rgb: 0x6B8BA2, origin: './ntc' },
  { name: 'olive drab', rgb: 0x6B8E23, origin: './ntc' },
  { name: 'eminence', rgb: 0x6C3082, origin: './ntc' },
  { name: 'turquoise blue', rgb: 0x6CDAE7, origin: './ntc' },
  { name: 'lonestar', rgb: 0x6D0101, origin: './ntc' },
  { name: 'pine cone', rgb: 0x6D5E54, origin: './ntc' },
  { name: 'dove gray', rgb: 0x6D6C6C, origin: './ntc' },
  { name: 'juniper', rgb: 0x6D9292, origin: './ntc' },
  { name: 'gothic', rgb: 0x6D92A1, origin: './ntc' },
  { name: 'red oxide', rgb: 0x6E0902, origin: './ntc' },
  { name: 'moccaccino', rgb: 0x6E1D14, origin: './ntc' },
  { name: 'pickled bean', rgb: 0x6E4826, origin: './ntc' },
  { name: 'dallas', rgb: 0x6E4B26, origin: './ntc' },
  { name: 'kokoda', rgb: 0x6E6D57, origin: './ntc' },
  { name: 'pale sky', rgb: 0x6E7783, origin: './ntc' },
  { name: 'cafe royale', rgb: 0x6F440C, origin: './ntc' },
  { name: 'flint', rgb: 0x6F6A61, origin: './ntc' },
  { name: 'highland', rgb: 0x6F8E63, origin: './ntc' },
  { name: 'limeade', rgb: 0x6F9D02, origin: './ntc' },
  { name: 'downy', rgb: 0x6FD0C5, origin: './ntc' },
  { name: 'persian plum', rgb: 0x701C1C, origin: './ntc' },
  { name: 'sepia', rgb: 0x704214, origin: './ntc' },
  { name: 'antique bronze', rgb: 0x704A07, origin: './ntc' },
  { name: 'ferra', rgb: 0x704F50, origin: './ntc' },
  { name: 'coffee', rgb: 0x706555, origin: './ntc' },
  { name: 'slate gray', rgb: 0x708090, origin: './ntc' },
  { name: 'cedar wood finish', rgb: 0x711A00, origin: './ntc' },
  { name: 'metallic copper', rgb: 0x71291D, origin: './ntc' },
  { name: 'affair', rgb: 0x714693, origin: './ntc' },
  { name: 'studio', rgb: 0x714AB2, origin: './ntc' },
  { name: 'tobacco brown', rgb: 0x715D47, origin: './ntc' },
  { name: 'yellow metal', rgb: 0x716338, origin: './ntc' },
  { name: 'peat', rgb: 0x716B56, origin: './ntc' },
  { name: 'olivetone', rgb: 0x716E10, origin: './ntc' },
  { name: 'storm gray', rgb: 0x717486, origin: './ntc' },
  { name: 'sirocco', rgb: 0x718080, origin: './ntc' },
  { name: 'aquamarine blue', rgb: 0x71D9E2, origin: './ntc' },
  { name: 'venetian red', rgb: 0x72010F, origin: './ntc' },
  { name: 'old copper', rgb: 0x724A2F, origin: './ntc' },
  { name: 'go ben', rgb: 0x726D4E, origin: './ntc' },
  { name: 'raven', rgb: 0x727B89, origin: './ntc' },
  { name: 'seance', rgb: 0x731E8F, origin: './ntc' },
  { name: 'raw umber', rgb: 0x734A12, origin: './ntc' },
  { name: 'kimberly', rgb: 0x736C9F, origin: './ntc' },
  { name: 'crocodile', rgb: 0x736D58, origin: './ntc' },
  { name: 'crete', rgb: 0x737829, origin: './ntc' },
  { name: 'xanadu', rgb: 0x738678, origin: './ntc' },
  { name: 'spicy mustard', rgb: 0x74640D, origin: './ntc' },
  { name: 'limed ash', rgb: 0x747D63, origin: './ntc' },
  { name: 'rolling stone', rgb: 0x747D83, origin: './ntc' },
  { name: 'blue smoke', rgb: 0x748881, origin: './ntc' },
  { name: 'laurel', rgb: 0x749378, origin: './ntc' },
  { name: 'mantis', rgb: 0x74C365, origin: './ntc' },
  { name: 'russett', rgb: 0x755A57, origin: './ntc' },
  { name: 'deluge', rgb: 0x7563A8, origin: './ntc' },
  { name: 'cosmic', rgb: 0x76395D, origin: './ntc' },
  { name: 'blue marguerite', rgb: 0x7666C6, origin: './ntc' },
  { name: 'lima', rgb: 0x76BD17, origin: './ntc' },
  { name: 'sky blue', rgb: 0x76D7EA, origin: './ntc' },
  { name: 'dark burgundy', rgb: 0x770F05, origin: './ntc' },
  { name: 'crown of thorns', rgb: 0x771F1F, origin: './ntc' },
  { name: 'walnut', rgb: 0x773F1A, origin: './ntc' },
  { name: 'pablo', rgb: 0x776F61, origin: './ntc' },
  { name: 'pacifika', rgb: 0x778120, origin: './ntc' },
  { name: 'oxley', rgb: 0x779E86, origin: './ntc' },
  { name: 'pastel green', rgb: 0x77DD77, origin: './ntc' },
  { name: 'japanese maple', rgb: 0x780109, origin: './ntc' },
  { name: 'mocha', rgb: 0x782D19, origin: './ntc' },
  { name: 'peanut', rgb: 0x782F16, origin: './ntc' },
  { name: 'camouflage green', rgb: 0x78866B, origin: './ntc' },
  { name: 'wasabi', rgb: 0x788A25, origin: './ntc' },
  { name: 'ship cove', rgb: 0x788BBA, origin: './ntc' },
  { name: 'sea nymph', rgb: 0x78A39C, origin: './ntc' },
  { name: 'roman coffee', rgb: 0x795D4C, origin: './ntc' },
  { name: 'old lavender', rgb: 0x796878, origin: './ntc' },
  { name: 'rum', rgb: 0x796989, origin: './ntc' },
  { name: 'fedora', rgb: 0x796A78, origin: './ntc' },
  { name: 'sandstone', rgb: 0x796D62, origin: './ntc' },
  { name: 'spray', rgb: 0x79DEEC, origin: './ntc' },
  { name: 'siren', rgb: 0x7A013A, origin: './ntc' },
  { name: 'fuchsia blue', rgb: 0x7A58C1, origin: './ntc' },
  { name: 'boulder', rgb: 0x7A7A7A, origin: './ntc' },
  { name: 'wild blue yonder', rgb: 0x7A89B8, origin: './ntc' },
  { name: 'de york', rgb: 0x7AC488, origin: './ntc' },
  { name: 'red beech', rgb: 0x7B3801, origin: './ntc' },
  { name: 'cinnamon', rgb: 0x7B3F00, origin: './ntc' },
  { name: 'yukon gold', rgb: 0x7B6608, origin: './ntc' },
  { name: 'tapa', rgb: 0x7B7874, origin: './ntc' },
  { name: 'waterloo ', rgb: 0x7B7C94, origin: './ntc' },
  { name: 'flax smoke', rgb: 0x7B8265, origin: './ntc' },
  { name: 'amulet', rgb: 0x7B9F80, origin: './ntc' },
  { name: 'asparagus', rgb: 0x7BA05B, origin: './ntc' },
  { name: 'kenyan copper', rgb: 0x7C1C05, origin: './ntc' },
  { name: 'pesto', rgb: 0x7C7631, origin: './ntc' },
  { name: 'topaz', rgb: 0x7C778A, origin: './ntc' },
  { name: 'concord', rgb: 0x7C7B7A, origin: './ntc' },
  { name: 'jumbo', rgb: 0x7C7B82, origin: './ntc' },
  { name: 'trendy green', rgb: 0x7C881A, origin: './ntc' },
  { name: 'gumbo', rgb: 0x7CA1A6, origin: './ntc' },
  { name: 'acapulco', rgb: 0x7CB0A1, origin: './ntc' },
  { name: 'neptune', rgb: 0x7CB7BB, origin: './ntc' },
  { name: 'pueblo', rgb: 0x7D2C14, origin: './ntc' },
  { name: 'bay leaf', rgb: 0x7DA98D, origin: './ntc' },
  { name: 'malibu', rgb: 0x7DC8F7, origin: './ntc' },
  { name: 'bermuda', rgb: 0x7DD8C6, origin: './ntc' },
  { name: 'copper canyon', rgb: 0x7E3A15, origin: './ntc' },
  { name: 'claret', rgb: 0x7F1734, origin: './ntc' },
  { name: 'peru tan', rgb: 0x7F3A02, origin: './ntc' },
  { name: 'falcon', rgb: 0x7F626D, origin: './ntc' },
  { name: 'mobster', rgb: 0x7F7589, origin: './ntc' },
  { name: 'moody blue', rgb: 0x7F76D3, origin: './ntc' },
  { name: 'chartreuse', rgb: 0x7FFF00, origin: './ntc' },
  { name: 'aquamarine', rgb: 0x7FFFD4, origin: './ntc' },
  { name: 'maroon', rgb: 0x800000, origin: './ntc' },
  { name: 'rose bud cherry', rgb: 0x800B47, origin: './ntc' },
  { name: 'falu red', rgb: 0x801818, origin: './ntc' },
  { name: 'red robin', rgb: 0x80341F, origin: './ntc' },
  { name: 'vivid violet', rgb: 0x803790, origin: './ntc' },
  { name: 'russet', rgb: 0x80461B, origin: './ntc' },
  { name: 'friar gray', rgb: 0x807E79, origin: './ntc' },
  { name: 'olive', rgb: 0x808000, origin: './ntc' },
  { name: 'gray', rgb: 0x808080, origin: './ntc' },
  { name: 'gulf stream', rgb: 0x80B3AE, origin: './ntc' },
  { name: 'glacier', rgb: 0x80B3C4, origin: './ntc' },
  { name: 'seagull', rgb: 0x80CCEA, origin: './ntc' },
  { name: 'nutmeg', rgb: 0x81422C, origin: './ntc' },
  { name: 'spicy pink', rgb: 0x816E71, origin: './ntc' },
  { name: 'empress', rgb: 0x817377, origin: './ntc' },
  { name: 'spanish green', rgb: 0x819885, origin: './ntc' },
  { name: 'sand dune', rgb: 0x826F65, origin: './ntc' },
  { name: 'gunsmoke', rgb: 0x828685, origin: './ntc' },
  { name: 'battleship gray', rgb: 0x828F72, origin: './ntc' },
  { name: 'merlot', rgb: 0x831923, origin: './ntc' },
  { name: 'shadow', rgb: 0x837050, origin: './ntc' },
  { name: 'chelsea cucumber', rgb: 0x83AA5D, origin: './ntc' },
  { name: 'monte carlo', rgb: 0x83D0C6, origin: './ntc' },
  { name: 'plum', rgb: 0x843179, origin: './ntc' },
  { name: 'granny smith', rgb: 0x84A0A0, origin: './ntc' },
  { name: 'chetwode blue', rgb: 0x8581D9, origin: './ntc' },
  { name: 'bandicoot', rgb: 0x858470, origin: './ntc' },
  { name: 'bali hai', rgb: 0x859FAF, origin: './ntc' },
  { name: 'half baked', rgb: 0x85C4CC, origin: './ntc' },
  { name: 'red devil', rgb: 0x860111, origin: './ntc' },
  { name: 'lotus', rgb: 0x863C3C, origin: './ntc' },
  { name: 'ironstone', rgb: 0x86483C, origin: './ntc' },
  { name: 'bull shot', rgb: 0x864D1E, origin: './ntc' },
  { name: 'rusty nail', rgb: 0x86560A, origin: './ntc' },
  { name: 'bitter', rgb: 0x868974, origin: './ntc' },
  { name: 'regent gray', rgb: 0x86949F, origin: './ntc' },
  { name: 'disco', rgb: 0x871550, origin: './ntc' },
  { name: 'americano', rgb: 0x87756E, origin: './ntc' },
  { name: 'hurricane', rgb: 0x877C7B, origin: './ntc' },
  { name: 'oslo gray', rgb: 0x878D91, origin: './ntc' },
  { name: 'sushi', rgb: 0x87AB39, origin: './ntc' },
  { name: 'spicy mix', rgb: 0x885342, origin: './ntc' },
  { name: 'kumera', rgb: 0x886221, origin: './ntc' },
  { name: 'suva gray', rgb: 0x888387, origin: './ntc' },
  { name: 'avocado', rgb: 0x888D65, origin: './ntc' },
  { name: 'camelot', rgb: 0x893456, origin: './ntc' },
  { name: 'solid pink', rgb: 0x893843, origin: './ntc' },
  { name: 'cannon pink', rgb: 0x894367, origin: './ntc' },
  { name: 'makara', rgb: 0x897D6D, origin: './ntc' },
  { name: 'burnt umber', rgb: 0x8A3324, origin: './ntc' },
  { name: 'true v', rgb: 0x8A73D6, origin: './ntc' },
  { name: 'clay creek', rgb: 0x8A8360, origin: './ntc' },
  { name: 'monsoon', rgb: 0x8A8389, origin: './ntc' },
  { name: 'stack', rgb: 0x8A8F8A, origin: './ntc' },
  { name: 'jordy blue', rgb: 0x8AB9F1, origin: './ntc' },
  { name: 'electric violet', rgb: 0x8B00FF, origin: './ntc' },
  { name: 'monarch', rgb: 0x8B0723, origin: './ntc' },
  { name: 'corn harvest', rgb: 0x8B6B0B, origin: './ntc' },
  { name: 'olive haze', rgb: 0x8B8470, origin: './ntc' },
  { name: 'schooner', rgb: 0x8B847E, origin: './ntc' },
  { name: 'natural gray', rgb: 0x8B8680, origin: './ntc' },
  { name: 'mantle', rgb: 0x8B9C90, origin: './ntc' },
  { name: 'portage', rgb: 0x8B9FEE, origin: './ntc' },
  { name: 'envy', rgb: 0x8BA690, origin: './ntc' },
  { name: 'cascade', rgb: 0x8BA9A5, origin: './ntc' },
  { name: 'riptide', rgb: 0x8BE6D8, origin: './ntc' },
  { name: 'cardinal pink', rgb: 0x8C055E, origin: './ntc' },
  { name: 'mule fawn', rgb: 0x8C472F, origin: './ntc' },
  { name: 'potters clay', rgb: 0x8C5738, origin: './ntc' },
  { name: 'trendy pink', rgb: 0x8C6495, origin: './ntc' },
  { name: 'paprika', rgb: 0x8D0226, origin: './ntc' },
  { name: 'sanguine brown', rgb: 0x8D3D38, origin: './ntc' },
  { name: 'tosca', rgb: 0x8D3F3F, origin: './ntc' },
  { name: 'cement', rgb: 0x8D7662, origin: './ntc' },
  { name: 'granite green', rgb: 0x8D8974, origin: './ntc' },
  { name: 'manatee', rgb: 0x8D90A1, origin: './ntc' },
  { name: 'polo blue', rgb: 0x8DA8CC, origin: './ntc' },
  { name: 'red berry', rgb: 0x8E0000, origin: './ntc' },
  { name: 'rope', rgb: 0x8E4D1E, origin: './ntc' },
  { name: 'opium', rgb: 0x8E6F70, origin: './ntc' },
  { name: 'domino', rgb: 0x8E775E, origin: './ntc' },
  { name: 'mamba', rgb: 0x8E8190, origin: './ntc' },
  { name: 'nepal', rgb: 0x8EABC1, origin: './ntc' },
  { name: 'pohutukawa', rgb: 0x8F021C, origin: './ntc' },
  { name: 'el salva', rgb: 0x8F3E33, origin: './ntc' },
  { name: 'korma', rgb: 0x8F4B0E, origin: './ntc' },
  { name: 'squirrel', rgb: 0x8F8176, origin: './ntc' },
  { name: 'vista blue', rgb: 0x8FD6B4, origin: './ntc' },
  { name: 'burgundy', rgb: 0x900020, origin: './ntc' },
  { name: 'old brick', rgb: 0x901E1E, origin: './ntc' },
  { name: 'hemp', rgb: 0x907874, origin: './ntc' },
  { name: 'almond frost', rgb: 0x907B71, origin: './ntc' },
  { name: 'sycamore', rgb: 0x908D39, origin: './ntc' },
  { name: 'sangria', rgb: 0x92000A, origin: './ntc' },
  { name: 'cumin', rgb: 0x924321, origin: './ntc' },
  { name: 'beaver', rgb: 0x926F5B, origin: './ntc' },
  { name: 'stonewall', rgb: 0x928573, origin: './ntc' },
  { name: 'venus', rgb: 0x928590, origin: './ntc' },
  { name: 'medium purple', rgb: 0x9370DB, origin: './ntc' },
  { name: 'cornflower', rgb: 0x93CCEA, origin: './ntc' },
  { name: 'algae green', rgb: 0x93DFB8, origin: './ntc' },
  { name: 'copper rust', rgb: 0x944747, origin: './ntc' },
  { name: 'arrowtown', rgb: 0x948771, origin: './ntc' },
  { name: 'scarlett', rgb: 0x950015, origin: './ntc' },
  { name: 'strikemaster', rgb: 0x956387, origin: './ntc' },
  { name: 'mountain mist', rgb: 0x959396, origin: './ntc' },
  { name: 'carmine', rgb: 0x960018, origin: './ntc' },
  { name: 'brown', rgb: 0x964B00, origin: './ntc' },
  { name: 'leather', rgb: 0x967059, origin: './ntc' },
  { name: "purple mountain's majesty", rgb: 0x9678B6, origin: './ntc' },
  { name: 'lavender purple', rgb: 0x967BB6, origin: './ntc' },
  { name: 'pewter', rgb: 0x96A8A1, origin: './ntc' },
  { name: 'summer green', rgb: 0x96BBAB, origin: './ntc' },
  { name: 'au chico', rgb: 0x97605D, origin: './ntc' },
  { name: 'wisteria', rgb: 0x9771B5, origin: './ntc' },
  { name: 'atlantis', rgb: 0x97CD2D, origin: './ntc' },
  { name: 'vin rouge', rgb: 0x983D61, origin: './ntc' },
  { name: 'lilac bush', rgb: 0x9874D3, origin: './ntc' },
  { name: 'bazaar', rgb: 0x98777B, origin: './ntc' },
  { name: 'hacienda', rgb: 0x98811B, origin: './ntc' },
  { name: 'pale oyster', rgb: 0x988D77, origin: './ntc' },
  { name: 'mint green', rgb: 0x98FF98, origin: './ntc' },
  { name: 'fresh eggplant', rgb: 0x990066, origin: './ntc' },
  { name: 'violet eggplant', rgb: 0x991199, origin: './ntc' },
  { name: 'tamarillo', rgb: 0x991613, origin: './ntc' },
  { name: 'totem pole', rgb: 0x991B07, origin: './ntc' },
  { name: 'copper rose', rgb: 0x996666, origin: './ntc' },
  { name: 'amethyst', rgb: 0x9966CC, origin: './ntc' },
  { name: 'mountbatten pink', rgb: 0x997A8D, origin: './ntc' },
  { name: 'blue bell', rgb: 0x9999CC, origin: './ntc' },
  { name: 'prairie sand', rgb: 0x9A3820, origin: './ntc' },
  { name: 'toast', rgb: 0x9A6E61, origin: './ntc' },
  { name: 'gurkha', rgb: 0x9A9577, origin: './ntc' },
  { name: 'olivine', rgb: 0x9AB973, origin: './ntc' },
  { name: 'shadow green', rgb: 0x9AC2B8, origin: './ntc' },
  { name: 'oregon', rgb: 0x9B4703, origin: './ntc' },
  { name: 'lemon grass', rgb: 0x9B9E8F, origin: './ntc' },
  { name: 'stiletto', rgb: 0x9C3336, origin: './ntc' },
  { name: 'hawaiian tan', rgb: 0x9D5616, origin: './ntc' },
  { name: 'gull gray', rgb: 0x9DACB7, origin: './ntc' },
  { name: 'pistachio', rgb: 0x9DC209, origin: './ntc' },
  { name: 'granny smith apple', rgb: 0x9DE093, origin: './ntc' },
  { name: 'anakiwa', rgb: 0x9DE5FF, origin: './ntc' },
  { name: 'chelsea gem', rgb: 0x9E5302, origin: './ntc' },
  { name: 'sepia skin', rgb: 0x9E5B40, origin: './ntc' },
  { name: 'sage', rgb: 0x9EA587, origin: './ntc' },
  { name: 'citron', rgb: 0x9EA91F, origin: './ntc' },
  { name: 'rock blue', rgb: 0x9EB1CD, origin: './ntc' },
  { name: 'morning glory', rgb: 0x9EDEE0, origin: './ntc' },
  { name: 'cognac', rgb: 0x9F381D, origin: './ntc' },
  { name: 'reef gold', rgb: 0x9F821C, origin: './ntc' },
  { name: 'star dust', rgb: 0x9F9F9C, origin: './ntc' },
  { name: 'santas gray', rgb: 0x9FA0B1, origin: './ntc' },
  { name: 'sinbad', rgb: 0x9FD7D3, origin: './ntc' },
  { name: 'feijoa', rgb: 0x9FDD8C, origin: './ntc' },
  { name: 'tabasco', rgb: 0xA02712, origin: './ntc' },
  { name: 'buttered rum', rgb: 0xA1750D, origin: './ntc' },
  { name: 'hit gray', rgb: 0xA1ADB5, origin: './ntc' },
  { name: 'citrus', rgb: 0xA1C50A, origin: './ntc' },
  { name: 'aqua island', rgb: 0xA1DAD7, origin: './ntc' },
  { name: 'water leaf', rgb: 0xA1E9DE, origin: './ntc' },
  { name: 'flirt', rgb: 0xA2006D, origin: './ntc' },
  { name: 'rouge', rgb: 0xA23B6C, origin: './ntc' },
  { name: 'cape palliser', rgb: 0xA26645, origin: './ntc' },
  { name: 'gray chateau', rgb: 0xA2AAB3, origin: './ntc' },
  { name: 'edward', rgb: 0xA2AEAB, origin: './ntc' },
  { name: 'pharlap', rgb: 0xA3807B, origin: './ntc' },
  { name: 'amethyst smoke', rgb: 0xA397B4, origin: './ntc' },
  { name: 'blizzard blue', rgb: 0xA3E3ED, origin: './ntc' },
  { name: 'delta', rgb: 0xA4A49D, origin: './ntc' },
  { name: 'wistful', rgb: 0xA4A6D3, origin: './ntc' },
  { name: 'green smoke', rgb: 0xA4AF6E, origin: './ntc' },
  { name: 'jazzberry jam', rgb: 0xA50B5E, origin: './ntc' },
  { name: 'zorba', rgb: 0xA59B91, origin: './ntc' },
  { name: 'bahia', rgb: 0xA5CB0C, origin: './ntc' },
  { name: 'roof terracotta', rgb: 0xA62F20, origin: './ntc' },
  { name: 'paarl', rgb: 0xA65529, origin: './ntc' },
  { name: 'barley corn', rgb: 0xA68B5B, origin: './ntc' },
  { name: 'donkey brown', rgb: 0xA69279, origin: './ntc' },
  { name: 'dawn', rgb: 0xA6A29A, origin: './ntc' },
  { name: 'mexican red', rgb: 0xA72525, origin: './ntc' },
  { name: 'luxor gold', rgb: 0xA7882C, origin: './ntc' },
  { name: 'rich gold', rgb: 0xA85307, origin: './ntc' },
  { name: 'reno sand', rgb: 0xA86515, origin: './ntc' },
  { name: 'coral tree', rgb: 0xA86B6B, origin: './ntc' },
  { name: 'dusty gray', rgb: 0xA8989B, origin: './ntc' },
  { name: 'dull lavender', rgb: 0xA899E6, origin: './ntc' },
  { name: 'tallow', rgb: 0xA8A589, origin: './ntc' },
  { name: 'bud', rgb: 0xA8AE9C, origin: './ntc' },
  { name: 'locust', rgb: 0xA8AF8E, origin: './ntc' },
  { name: 'norway', rgb: 0xA8BD9F, origin: './ntc' },
  { name: 'chinook', rgb: 0xA8E3BD, origin: './ntc' },
  { name: 'gray olive', rgb: 0xA9A491, origin: './ntc' },
  { name: 'aluminium', rgb: 0xA9ACB6, origin: './ntc' },
  { name: 'cadet blue', rgb: 0xA9B2C3, origin: './ntc' },
  { name: 'schist', rgb: 0xA9B497, origin: './ntc' },
  { name: 'tower gray', rgb: 0xA9BDBF, origin: './ntc' },
  { name: 'perano', rgb: 0xA9BEF2, origin: './ntc' },
  { name: 'opal', rgb: 0xA9C6C2, origin: './ntc' },
  { name: 'night shadz', rgb: 0xAA375A, origin: './ntc' },
  { name: 'fire', rgb: 0xAA4203, origin: './ntc' },
  { name: 'muesli', rgb: 0xAA8B5B, origin: './ntc' },
  { name: 'sandal', rgb: 0xAA8D6F, origin: './ntc' },
  { name: 'shady lady', rgb: 0xAAA5A9, origin: './ntc' },
  { name: 'logan', rgb: 0xAAA9CD, origin: './ntc' },
  { name: 'spun pearl', rgb: 0xAAABB7, origin: './ntc' },
  { name: 'regent st blue', rgb: 0xAAD6E6, origin: './ntc' },
  { name: 'magic mint', rgb: 0xAAF0D1, origin: './ntc' },
  { name: 'lipstick', rgb: 0xAB0563, origin: './ntc' },
  { name: 'royal heath', rgb: 0xAB3472, origin: './ntc' },
  { name: 'sandrift', rgb: 0xAB917A, origin: './ntc' },
  { name: 'cold purple', rgb: 0xABA0D9, origin: './ntc' },
  { name: 'bronco', rgb: 0xABA196, origin: './ntc' },
  { name: 'limed oak', rgb: 0xAC8A56, origin: './ntc' },
  { name: 'east side', rgb: 0xAC91CE, origin: './ntc' },
  { name: 'lemon ginger', rgb: 0xAC9E22, origin: './ntc' },
  { name: 'napa', rgb: 0xACA494, origin: './ntc' },
  { name: 'hillary', rgb: 0xACA586, origin: './ntc' },
  { name: 'cloudy', rgb: 0xACA59F, origin: './ntc' },
  { name: 'silver chalice', rgb: 0xACACAC, origin: './ntc' },
  { name: 'swamp green', rgb: 0xACB78E, origin: './ntc' },
  { name: 'spring rain', rgb: 0xACCBB1, origin: './ntc' },
  { name: 'conifer', rgb: 0xACDD4D, origin: './ntc' },
  { name: 'celadon', rgb: 0xACE1AF, origin: './ntc' },
  { name: 'mandalay', rgb: 0xAD781B, origin: './ntc' },
  { name: 'casper', rgb: 0xADBED1, origin: './ntc' },
  { name: 'moss green', rgb: 0xADDFAD, origin: './ntc' },
  { name: 'padua', rgb: 0xADE6C4, origin: './ntc' },
  { name: 'green yellow', rgb: 0xADFF2F, origin: './ntc' },
  { name: 'hippie pink', rgb: 0xAE4560, origin: './ntc' },
  { name: 'desert', rgb: 0xAE6020, origin: './ntc' },
  { name: 'bouquet', rgb: 0xAE809E, origin: './ntc' },
  { name: 'medium carmine', rgb: 0xAF4035, origin: './ntc' },
  { name: 'apple blossom', rgb: 0xAF4D43, origin: './ntc' },
  { name: 'brown rust', rgb: 0xAF593E, origin: './ntc' },
  { name: 'driftwood', rgb: 0xAF8751, origin: './ntc' },
  { name: 'alpine', rgb: 0xAF8F2C, origin: './ntc' },
  { name: 'lucky', rgb: 0xAF9F1C, origin: './ntc' },
  { name: 'martini', rgb: 0xAFA09E, origin: './ntc' },
  { name: 'bombay', rgb: 0xAFB1B8, origin: './ntc' },
  { name: 'pigeon post', rgb: 0xAFBDD9, origin: './ntc' },
  { name: 'cadillac', rgb: 0xB04C6A, origin: './ntc' },
  { name: 'matrix', rgb: 0xB05D54, origin: './ntc' },
  { name: 'tapestry', rgb: 0xB05E81, origin: './ntc' },
  { name: 'mai tai', rgb: 0xB06608, origin: './ntc' },
  { name: 'del rio', rgb: 0xB09A95, origin: './ntc' },
  { name: 'powder blue', rgb: 0xB0E0E6, origin: './ntc' },
  { name: 'inch worm', rgb: 0xB0E313, origin: './ntc' },
  { name: 'bright red', rgb: 0xB10000, origin: './ntc' },
  { name: 'vesuvius', rgb: 0xB14A0B, origin: './ntc' },
  { name: 'pumpkin skin', rgb: 0xB1610B, origin: './ntc' },
  { name: 'santa fe', rgb: 0xB16D52, origin: './ntc' },
  { name: 'teak', rgb: 0xB19461, origin: './ntc' },
  { name: 'fringy flower', rgb: 0xB1E2C1, origin: './ntc' },
  { name: 'ice cold', rgb: 0xB1F4E7, origin: './ntc' },
  { name: 'shiraz', rgb: 0xB20931, origin: './ntc' },
  { name: 'biloba flower', rgb: 0xB2A1EA, origin: './ntc' },
  { name: 'tall poppy', rgb: 0xB32D29, origin: './ntc' },
  { name: 'fiery orange', rgb: 0xB35213, origin: './ntc' },
  { name: 'hot toddy', rgb: 0xB38007, origin: './ntc' },
  { name: 'taupe gray', rgb: 0xB3AF95, origin: './ntc' },
  { name: 'la rioja', rgb: 0xB3C110, origin: './ntc' },
  { name: 'well read', rgb: 0xB43332, origin: './ntc' },
  { name: 'blush', rgb: 0xB44668, origin: './ntc' },
  { name: 'jungle mist', rgb: 0xB4CFD3, origin: './ntc' },
  { name: 'turkish rose', rgb: 0xB57281, origin: './ntc' },
  { name: 'lavender', rgb: 0xB57EDC, origin: './ntc' },
  { name: 'mongoose', rgb: 0xB5A27F, origin: './ntc' },
  { name: 'olive green', rgb: 0xB5B35C, origin: './ntc' },
  { name: 'jet stream', rgb: 0xB5D2CE, origin: './ntc' },
  { name: 'cruise', rgb: 0xB5ECDF, origin: './ntc' },
  { name: 'hibiscus', rgb: 0xB6316C, origin: './ntc' },
  { name: 'thatch', rgb: 0xB69D98, origin: './ntc' },
  { name: 'heathered gray', rgb: 0xB6B095, origin: './ntc' },
  { name: 'eagle', rgb: 0xB6BAA4, origin: './ntc' },
  { name: 'spindle', rgb: 0xB6D1EA, origin: './ntc' },
  { name: 'gum leaf', rgb: 0xB6D3BF, origin: './ntc' },
  { name: 'rust', rgb: 0xB7410E, origin: './ntc' },
  { name: 'muddy waters', rgb: 0xB78E5C, origin: './ntc' },
  { name: 'sahara', rgb: 0xB7A214, origin: './ntc' },
  { name: 'husk', rgb: 0xB7A458, origin: './ntc' },
  { name: 'nobel', rgb: 0xB7B1B1, origin: './ntc' },
  { name: 'heather', rgb: 0xB7C3D0, origin: './ntc' },
  { name: 'madang', rgb: 0xB7F0BE, origin: './ntc' },
  { name: 'milano red', rgb: 0xB81104, origin: './ntc' },
  { name: 'copper', rgb: 0xB87333, origin: './ntc' },
  { name: 'gimblet', rgb: 0xB8B56A, origin: './ntc' },
  { name: 'green spring', rgb: 0xB8C1B1, origin: './ntc' },
  { name: 'celery', rgb: 0xB8C25D, origin: './ntc' },
  { name: 'sail', rgb: 0xB8E0F9, origin: './ntc' },
  { name: 'chestnut', rgb: 0xB94E48, origin: './ntc' },
  { name: 'crail', rgb: 0xB95140, origin: './ntc' },
  { name: 'marigold', rgb: 0xB98D28, origin: './ntc' },
  { name: 'wild willow', rgb: 0xB9C46A, origin: './ntc' },
  { name: 'rainee', rgb: 0xB9C8AC, origin: './ntc' },
  { name: 'guardsman red', rgb: 0xBA0101, origin: './ntc' },
  { name: 'rock spray', rgb: 0xBA450C, origin: './ntc' },
  { name: 'bourbon', rgb: 0xBA6F1E, origin: './ntc' },
  { name: 'pirate gold', rgb: 0xBA7F03, origin: './ntc' },
  { name: 'nomad', rgb: 0xBAB1A2, origin: './ntc' },
  { name: 'submarine', rgb: 0xBAC7C9, origin: './ntc' },
  { name: 'charlotte', rgb: 0xBAEEF9, origin: './ntc' },
  { name: 'medium red violet', rgb: 0xBB3385, origin: './ntc' },
  { name: 'brandy rose', rgb: 0xBB8983, origin: './ntc' },
  { name: 'rio grande', rgb: 0xBBD009, origin: './ntc' },
  { name: 'surf', rgb: 0xBBD7C1, origin: './ntc' },
  { name: 'powder ash', rgb: 0xBCC9C2, origin: './ntc' },
  { name: 'tuscany', rgb: 0xBD5E2E, origin: './ntc' },
  { name: 'quicksand', rgb: 0xBD978E, origin: './ntc' },
  { name: 'silk', rgb: 0xBDB1A8, origin: './ntc' },
  { name: 'malta', rgb: 0xBDB2A1, origin: './ntc' },
  { name: 'chatelle', rgb: 0xBDB3C7, origin: './ntc' },
  { name: 'lavender gray', rgb: 0xBDBBD7, origin: './ntc' },
  { name: 'french gray', rgb: 0xBDBDC6, origin: './ntc' },
  { name: 'clay ash', rgb: 0xBDC8B3, origin: './ntc' },
  { name: 'loblolly', rgb: 0xBDC9CE, origin: './ntc' },
  { name: 'french pass', rgb: 0xBDEDFD, origin: './ntc' },
  { name: 'london hue', rgb: 0xBEA6C3, origin: './ntc' },
  { name: 'pink swan', rgb: 0xBEB5B7, origin: './ntc' },
  { name: 'fuego', rgb: 0xBEDE0D, origin: './ntc' },
  { name: 'rose of sharon', rgb: 0xBF5500, origin: './ntc' },
  { name: 'tide', rgb: 0xBFB8B0, origin: './ntc' },
  { name: 'blue haze', rgb: 0xBFBED8, origin: './ntc' },
  { name: 'silver sand', rgb: 0xBFC1C2, origin: './ntc' },
  { name: 'key lime pie', rgb: 0xBFC921, origin: './ntc' },
  { name: 'ziggurat', rgb: 0xBFDBE2, origin: './ntc' },
  { name: 'lime', rgb: 0xBFFF00, origin: './ntc' },
  { name: 'thunderbird', rgb: 0xC02B18, origin: './ntc' },
  { name: 'mojo', rgb: 0xC04737, origin: './ntc' },
  { name: 'old rose', rgb: 0xC08081, origin: './ntc' },
  { name: 'silver', rgb: 0xC0C0C0, origin: './ntc' },
  { name: 'pale leaf', rgb: 0xC0D3B9, origin: './ntc' },
  { name: 'pixie green', rgb: 0xC0D8B6, origin: './ntc' },
  { name: 'tia maria', rgb: 0xC1440E, origin: './ntc' },
  { name: 'fuchsia pink', rgb: 0xC154C1, origin: './ntc' },
  { name: 'buddha gold', rgb: 0xC1A004, origin: './ntc' },
  { name: 'bison hide', rgb: 0xC1B7A4, origin: './ntc' },
  { name: 'tea', rgb: 0xC1BAB0, origin: './ntc' },
  { name: 'gray suit', rgb: 0xC1BECD, origin: './ntc' },
  { name: 'sprout', rgb: 0xC1D7B0, origin: './ntc' },
  { name: 'sulu', rgb: 0xC1F07C, origin: './ntc' },
  { name: 'indochine', rgb: 0xC26B03, origin: './ntc' },
  { name: 'twine', rgb: 0xC2955D, origin: './ntc' },
  { name: 'cotton seed', rgb: 0xC2BDB6, origin: './ntc' },
  { name: 'pumice', rgb: 0xC2CAC4, origin: './ntc' },
  { name: 'jagged ice', rgb: 0xC2E8E5, origin: './ntc' },
  { name: 'maroon flush', rgb: 0xC32148, origin: './ntc' },
  { name: 'indian khaki', rgb: 0xC3B091, origin: './ntc' },
  { name: 'pale slate', rgb: 0xC3BFC1, origin: './ntc' },
  { name: 'gray nickel', rgb: 0xC3C3BD, origin: './ntc' },
  { name: 'periwinkle gray', rgb: 0xC3CDE6, origin: './ntc' },
  { name: 'tiara', rgb: 0xC3D1D1, origin: './ntc' },
  { name: 'tropical blue', rgb: 0xC3DDF9, origin: './ntc' },
  { name: 'cardinal', rgb: 0xC41E3A, origin: './ntc' },
  { name: 'fuzzy wuzzy brown', rgb: 0xC45655, origin: './ntc' },
  { name: 'orange roughy', rgb: 0xC45719, origin: './ntc' },
  { name: 'mist gray', rgb: 0xC4C4BC, origin: './ntc' },
  { name: 'coriander', rgb: 0xC4D0B0, origin: './ntc' },
  { name: 'mint tulip', rgb: 0xC4F4EB, origin: './ntc' },
  { name: 'mulberry', rgb: 0xC54B8C, origin: './ntc' },
  { name: 'nugget', rgb: 0xC59922, origin: './ntc' },
  { name: 'tussock', rgb: 0xC5994B, origin: './ntc' },
  { name: 'sea mist', rgb: 0xC5DBCA, origin: './ntc' },
  { name: 'yellow green', rgb: 0xC5E17A, origin: './ntc' },
  { name: 'brick red', rgb: 0xC62D42, origin: './ntc' },
  { name: 'contessa', rgb: 0xC6726B, origin: './ntc' },
  { name: 'oriental pink', rgb: 0xC69191, origin: './ntc' },
  { name: 'roti', rgb: 0xC6A84B, origin: './ntc' },
  { name: 'ash', rgb: 0xC6C3B5, origin: './ntc' },
  { name: 'kangaroo', rgb: 0xC6C8BD, origin: './ntc' },
  { name: 'las palmas', rgb: 0xC6E610, origin: './ntc' },
  { name: 'monza', rgb: 0xC7031E, origin: './ntc' },
  { name: 'red violet', rgb: 0xC71585, origin: './ntc' },
  { name: 'coral reef', rgb: 0xC7BCA2, origin: './ntc' },
  { name: 'melrose', rgb: 0xC7C1FF, origin: './ntc' },
  { name: 'cloud', rgb: 0xC7C4BF, origin: './ntc' },
  { name: 'ghost', rgb: 0xC7C9D5, origin: './ntc' },
  { name: 'pine glade', rgb: 0xC7CD90, origin: './ntc' },
  { name: 'botticelli', rgb: 0xC7DDE5, origin: './ntc' },
  { name: 'antique brass', rgb: 0xC88A65, origin: './ntc' },
  { name: 'lilac', rgb: 0xC8A2C8, origin: './ntc' },
  { name: 'hokey pokey', rgb: 0xC8A528, origin: './ntc' },
  { name: 'lily', rgb: 0xC8AABF, origin: './ntc' },
  { name: 'laser', rgb: 0xC8B568, origin: './ntc' },
  { name: 'edgewater', rgb: 0xC8E3D7, origin: './ntc' },
  { name: 'piper', rgb: 0xC96323, origin: './ntc' },
  { name: 'pizza', rgb: 0xC99415, origin: './ntc' },
  { name: 'light wisteria', rgb: 0xC9A0DC, origin: './ntc' },
  { name: 'rodeo dust', rgb: 0xC9B29B, origin: './ntc' },
  { name: 'sundance', rgb: 0xC9B35B, origin: './ntc' },
  { name: 'earls green', rgb: 0xC9B93B, origin: './ntc' },
  { name: 'silver rust', rgb: 0xC9C0BB, origin: './ntc' },
  { name: 'conch', rgb: 0xC9D9D2, origin: './ntc' },
  { name: 'reef', rgb: 0xC9FFA2, origin: './ntc' },
  { name: 'aero blue', rgb: 0xC9FFE5, origin: './ntc' },
  { name: 'flush mahogany', rgb: 0xCA3435, origin: './ntc' },
  { name: 'turmeric', rgb: 0xCABB48, origin: './ntc' },
  { name: 'paris white', rgb: 0xCADCD4, origin: './ntc' },
  { name: 'bitter lemon', rgb: 0xCAE00D, origin: './ntc' },
  { name: 'skeptic', rgb: 0xCAE6DA, origin: './ntc' },
  { name: 'viola', rgb: 0xCB8FA9, origin: './ntc' },
  { name: 'foggy gray', rgb: 0xCBCAB6, origin: './ntc' },
  { name: 'green mist', rgb: 0xCBD3B0, origin: './ntc' },
  { name: 'nebula', rgb: 0xCBDBD6, origin: './ntc' },
  { name: 'persian red', rgb: 0xCC3333, origin: './ntc' },
  { name: 'burnt orange', rgb: 0xCC5500, origin: './ntc' },
  { name: 'ochre', rgb: 0xCC7722, origin: './ntc' },
  { name: 'puce', rgb: 0xCC8899, origin: './ntc' },
  { name: 'thistle green', rgb: 0xCCCAA8, origin: './ntc' },
  { name: 'periwinkle', rgb: 0xCCCCFF, origin: './ntc' },
  { name: 'electric lime', rgb: 0xCCFF00, origin: './ntc' },
  { name: 'tenn', rgb: 0xCD5700, origin: './ntc' },
  { name: 'chestnut rose', rgb: 0xCD5C5C, origin: './ntc' },
  { name: 'brandy punch', rgb: 0xCD8429, origin: './ntc' },
  { name: 'onahau', rgb: 0xCDF4FF, origin: './ntc' },
  { name: 'sorrell brown', rgb: 0xCEB98F, origin: './ntc' },
  { name: 'cold turkey', rgb: 0xCEBABA, origin: './ntc' },
  { name: 'yuma', rgb: 0xCEC291, origin: './ntc' },
  { name: 'chino', rgb: 0xCEC7A7, origin: './ntc' },
  { name: 'eunry', rgb: 0xCFA39D, origin: './ntc' },
  { name: 'old gold', rgb: 0xCFB53B, origin: './ntc' },
  { name: 'tasman', rgb: 0xCFDCCF, origin: './ntc' },
  { name: 'surf crest', rgb: 0xCFE5D2, origin: './ntc' },
  { name: 'humming bird', rgb: 0xCFF9F3, origin: './ntc' },
  { name: 'scandal', rgb: 0xCFFAF4, origin: './ntc' },
  { name: 'red stage', rgb: 0xD05F04, origin: './ntc' },
  { name: 'hopbush', rgb: 0xD06DA1, origin: './ntc' },
  { name: 'meteor', rgb: 0xD07D12, origin: './ntc' },
  { name: 'perfume', rgb: 0xD0BEF8, origin: './ntc' },
  { name: 'prelude', rgb: 0xD0C0E5, origin: './ntc' },
  { name: 'tea green', rgb: 0xD0F0C0, origin: './ntc' },
  { name: 'geebung', rgb: 0xD18F1B, origin: './ntc' },
  { name: 'vanilla', rgb: 0xD1BEA8, origin: './ntc' },
  { name: 'soft amber', rgb: 0xD1C6B4, origin: './ntc' },
  { name: 'celeste', rgb: 0xD1D2CA, origin: './ntc' },
  { name: 'mischka', rgb: 0xD1D2DD, origin: './ntc' },
  { name: 'pear', rgb: 0xD1E231, origin: './ntc' },
  { name: 'hot cinnamon', rgb: 0xD2691E, origin: './ntc' },
  { name: 'raw sienna', rgb: 0xD27D46, origin: './ntc' },
  { name: 'careys pink', rgb: 0xD29EAA, origin: './ntc' },
  { name: 'tan', rgb: 0xD2B48C, origin: './ntc' },
  { name: 'deco', rgb: 0xD2DA97, origin: './ntc' },
  { name: 'blue romance', rgb: 0xD2F6DE, origin: './ntc' },
  { name: 'gossip', rgb: 0xD2F8B0, origin: './ntc' },
  { name: 'sisal', rgb: 0xD3CBBA, origin: './ntc' },
  { name: 'swirl', rgb: 0xD3CDC5, origin: './ntc' },
  { name: 'charm', rgb: 0xD47494, origin: './ntc' },
  { name: 'clam shell', rgb: 0xD4B6AF, origin: './ntc' },
  { name: 'straw', rgb: 0xD4BF8D, origin: './ntc' },
  { name: 'akaroa', rgb: 0xD4C4A8, origin: './ntc' },
  { name: 'bird flower', rgb: 0xD4CD16, origin: './ntc' },
  { name: 'iron', rgb: 0xD4D7D9, origin: './ntc' },
  { name: 'geyser', rgb: 0xD4DFE2, origin: './ntc' },
  { name: 'hawkes blue', rgb: 0xD4E2FC, origin: './ntc' },
  { name: 'grenadier', rgb: 0xD54600, origin: './ntc' },
  { name: 'can can', rgb: 0xD591A4, origin: './ntc' },
  { name: 'whiskey', rgb: 0xD59A6F, origin: './ntc' },
  { name: 'winter hazel', rgb: 0xD5D195, origin: './ntc' },
  { name: 'granny apple', rgb: 0xD5F6E3, origin: './ntc' },
  { name: 'my pink', rgb: 0xD69188, origin: './ntc' },
  { name: 'tacha', rgb: 0xD6C562, origin: './ntc' },
  { name: 'moon raker', rgb: 0xD6CEF6, origin: './ntc' },
  { name: 'quill gray', rgb: 0xD6D6D1, origin: './ntc' },
  { name: 'snowy mint', rgb: 0xD6FFDB, origin: './ntc' },
  { name: 'new york pink', rgb: 0xD7837F, origin: './ntc' },
  { name: 'pavlova', rgb: 0xD7C498, origin: './ntc' },
  { name: 'fog', rgb: 0xD7D0FF, origin: './ntc' },
  { name: 'valencia', rgb: 0xD84437, origin: './ntc' },
  { name: 'japonica', rgb: 0xD87C63, origin: './ntc' },
  { name: 'thistle', rgb: 0xD8BFD8, origin: './ntc' },
  { name: 'maverick', rgb: 0xD8C2D5, origin: './ntc' },
  { name: 'foam', rgb: 0xD8FCFA, origin: './ntc' },
  { name: 'cabaret', rgb: 0xD94972, origin: './ntc' },
  { name: 'burning sand', rgb: 0xD99376, origin: './ntc' },
  { name: 'cameo', rgb: 0xD9B99B, origin: './ntc' },
  { name: 'timberwolf', rgb: 0xD9D6CF, origin: './ntc' },
  { name: 'tana', rgb: 0xD9DCC1, origin: './ntc' },
  { name: 'link water', rgb: 0xD9E4F5, origin: './ntc' },
  { name: 'mabel', rgb: 0xD9F7FF, origin: './ntc' },
  { name: 'cerise', rgb: 0xDA3287, origin: './ntc' },
  { name: 'flame pea', rgb: 0xDA5B38, origin: './ntc' },
  { name: 'bamboo', rgb: 0xDA6304, origin: './ntc' },
  { name: 'red damask', rgb: 0xDA6A41, origin: './ntc' },
  { name: 'orchid', rgb: 0xDA70D6, origin: './ntc' },
  { name: 'copperfield', rgb: 0xDA8A67, origin: './ntc' },
  { name: 'golden grass', rgb: 0xDAA520, origin: './ntc' },
  { name: 'zanah', rgb: 0xDAECD6, origin: './ntc' },
  { name: 'iceberg', rgb: 0xDAF4F0, origin: './ntc' },
  { name: 'oyster bay', rgb: 0xDAFAFF, origin: './ntc' },
  { name: 'cranberry', rgb: 0xDB5079, origin: './ntc' },
  { name: 'petite orchid', rgb: 0xDB9690, origin: './ntc' },
  { name: 'di serria', rgb: 0xDB995E, origin: './ntc' },
  { name: 'alto', rgb: 0xDBDBDB, origin: './ntc' },
  { name: 'frosted mint', rgb: 0xDBFFF8, origin: './ntc' },
  { name: 'crimson', rgb: 0xDC143C, origin: './ntc' },
  { name: 'punch', rgb: 0xDC4333, origin: './ntc' },
  { name: 'galliano', rgb: 0xDCB20C, origin: './ntc' },
  { name: 'blossom', rgb: 0xDCB4BC, origin: './ntc' },
  { name: 'wattle', rgb: 0xDCD747, origin: './ntc' },
  { name: 'westar', rgb: 0xDCD9D2, origin: './ntc' },
  { name: 'moon mist', rgb: 0xDCDDCC, origin: './ntc' },
  { name: 'caper', rgb: 0xDCEDB4, origin: './ntc' },
  { name: 'swans down', rgb: 0xDCF0EA, origin: './ntc' },
  { name: 'swiss coffee', rgb: 0xDDD6D5, origin: './ntc' },
  { name: 'white ice', rgb: 0xDDF9F1, origin: './ntc' },
  { name: 'cerise red', rgb: 0xDE3163, origin: './ntc' },
  { name: 'roman', rgb: 0xDE6360, origin: './ntc' },
  { name: 'tumbleweed', rgb: 0xDEA681, origin: './ntc' },
  { name: 'gold tips', rgb: 0xDEBA13, origin: './ntc' },
  { name: 'brandy', rgb: 0xDEC196, origin: './ntc' },
  { name: 'wafer', rgb: 0xDECBC6, origin: './ntc' },
  { name: 'sapling', rgb: 0xDED4A4, origin: './ntc' },
  { name: 'barberry', rgb: 0xDED717, origin: './ntc' },
  { name: 'beryl green', rgb: 0xDEE5C0, origin: './ntc' },
  { name: 'pattens blue', rgb: 0xDEF5FF, origin: './ntc' },
  { name: 'heliotrope', rgb: 0xDF73FF, origin: './ntc' },
  { name: 'apache', rgb: 0xDFBE6F, origin: './ntc' },
  { name: 'chenin', rgb: 0xDFCD6F, origin: './ntc' },
  { name: 'lola', rgb: 0xDFCFDB, origin: './ntc' },
  { name: 'willow brook', rgb: 0xDFECDA, origin: './ntc' },
  { name: 'chartreuse yellow', rgb: 0xDFFF00, origin: './ntc' },
  { name: 'mauve', rgb: 0xE0B0FF, origin: './ntc' },
  { name: 'anzac', rgb: 0xE0B646, origin: './ntc' },
  { name: 'harvest gold', rgb: 0xE0B974, origin: './ntc' },
  { name: 'calico', rgb: 0xE0C095, origin: './ntc' },
  { name: 'baby blue', rgb: 0xE0FFFF, origin: './ntc' },
  { name: 'sunglo', rgb: 0xE16865, origin: './ntc' },
  { name: 'equator', rgb: 0xE1BC64, origin: './ntc' },
  { name: 'pink flare', rgb: 0xE1C0C8, origin: './ntc' },
  { name: 'periglacial blue', rgb: 0xE1E6D6, origin: './ntc' },
  { name: 'kidnapper', rgb: 0xE1EAD4, origin: './ntc' },
  { name: 'tara', rgb: 0xE1F6E8, origin: './ntc' },
  { name: 'mandy', rgb: 0xE25465, origin: './ntc' },
  { name: 'terracotta', rgb: 0xE2725B, origin: './ntc' },
  { name: 'golden bell', rgb: 0xE28913, origin: './ntc' },
  { name: 'shocking', rgb: 0xE292C0, origin: './ntc' },
  { name: 'dixie', rgb: 0xE29418, origin: './ntc' },
  { name: 'light orchid', rgb: 0xE29CD2, origin: './ntc' },
  { name: 'snuff', rgb: 0xE2D8ED, origin: './ntc' },
  { name: 'mystic', rgb: 0xE2EBED, origin: './ntc' },
  { name: 'apple green', rgb: 0xE2F3EC, origin: './ntc' },
  { name: 'razzmatazz', rgb: 0xE30B5C, origin: './ntc' },
  { name: 'alizarin crimson', rgb: 0xE32636, origin: './ntc' },
  { name: 'cinnabar', rgb: 0xE34234, origin: './ntc' },
  { name: 'cavern pink', rgb: 0xE3BEBE, origin: './ntc' },
  { name: 'peppermint', rgb: 0xE3F5E1, origin: './ntc' },
  { name: 'mindaro', rgb: 0xE3F988, origin: './ntc' },
  { name: 'deep blush', rgb: 0xE47698, origin: './ntc' },
  { name: 'gamboge', rgb: 0xE49B0F, origin: './ntc' },
  { name: 'melanie', rgb: 0xE4C2D5, origin: './ntc' },
  { name: 'twilight', rgb: 0xE4CFDE, origin: './ntc' },
  { name: 'bone', rgb: 0xE4D1C0, origin: './ntc' },
  { name: 'sunflower', rgb: 0xE4D422, origin: './ntc' },
  { name: 'grain brown', rgb: 0xE4D5B7, origin: './ntc' },
  { name: 'zombie', rgb: 0xE4D69B, origin: './ntc' },
  { name: 'frostee', rgb: 0xE4F6E7, origin: './ntc' },
  { name: 'snow flurry', rgb: 0xE4FFD1, origin: './ntc' },
  { name: 'amaranth', rgb: 0xE52B50, origin: './ntc' },
  { name: 'zest', rgb: 0xE5841B, origin: './ntc' },
  { name: 'dust storm', rgb: 0xE5CCC9, origin: './ntc' },
  { name: 'stark white', rgb: 0xE5D7BD, origin: './ntc' },
  { name: 'hampton', rgb: 0xE5D8AF, origin: './ntc' },
  { name: 'bon jour', rgb: 0xE5E0E1, origin: './ntc' },
  { name: 'mercury', rgb: 0xE5E5E5, origin: './ntc' },
  { name: 'polar', rgb: 0xE5F9F6, origin: './ntc' },
  { name: 'trinidad', rgb: 0xE64E03, origin: './ntc' },
  { name: 'gold sand', rgb: 0xE6BE8A, origin: './ntc' },
  { name: 'cashmere', rgb: 0xE6BEA5, origin: './ntc' },
  { name: 'double spanish white', rgb: 0xE6D7B9, origin: './ntc' },
  { name: 'satin linen', rgb: 0xE6E4D4, origin: './ntc' },
  { name: 'harp', rgb: 0xE6F2EA, origin: './ntc' },
  { name: 'off green', rgb: 0xE6F8F3, origin: './ntc' },
  { name: 'hint of green', rgb: 0xE6FFE9, origin: './ntc' },
  { name: 'tranquil', rgb: 0xE6FFFF, origin: './ntc' },
  { name: 'mango tango', rgb: 0xE77200, origin: './ntc' },
  { name: 'christine', rgb: 0xE7730A, origin: './ntc' },
  { name: 'tonys pink', rgb: 0xE79F8C, origin: './ntc' },
  { name: 'kobi', rgb: 0xE79FC4, origin: './ntc' },
  { name: 'rose fog', rgb: 0xE7BCB4, origin: './ntc' },
  { name: 'corn', rgb: 0xE7BF05, origin: './ntc' },
  { name: 'putty', rgb: 0xE7CD8C, origin: './ntc' },
  { name: 'gray nurse', rgb: 0xE7ECE6, origin: './ntc' },
  { name: 'lily white', rgb: 0xE7F8FF, origin: './ntc' },
  { name: 'bubbles', rgb: 0xE7FEFF, origin: './ntc' },
  { name: 'fire bush', rgb: 0xE89928, origin: './ntc' },
  { name: 'shilo', rgb: 0xE8B9B3, origin: './ntc' },
  { name: 'pearl bush', rgb: 0xE8E0D5, origin: './ntc' },
  { name: 'green white', rgb: 0xE8EBE0, origin: './ntc' },
  { name: 'chrome white', rgb: 0xE8F1D4, origin: './ntc' },
  { name: 'gin', rgb: 0xE8F2EB, origin: './ntc' },
  { name: 'aqua squeeze', rgb: 0xE8F5F2, origin: './ntc' },
  { name: 'clementine', rgb: 0xE96E00, origin: './ntc' },
  { name: 'burnt sienna', rgb: 0xE97451, origin: './ntc' },
  { name: 'tahiti gold', rgb: 0xE97C07, origin: './ntc' },
  { name: 'oyster pink', rgb: 0xE9CECD, origin: './ntc' },
  { name: 'confetti', rgb: 0xE9D75A, origin: './ntc' },
  { name: 'ebb', rgb: 0xE9E3E3, origin: './ntc' },
  { name: 'ottoman', rgb: 0xE9F8ED, origin: './ntc' },
  { name: 'clear day', rgb: 0xE9FFFD, origin: './ntc' },
  { name: 'carissma', rgb: 0xEA88A8, origin: './ntc' },
  { name: 'porsche', rgb: 0xEAAE69, origin: './ntc' },
  { name: 'tulip tree', rgb: 0xEAB33B, origin: './ntc' },
  { name: 'rob roy', rgb: 0xEAC674, origin: './ntc' },
  { name: 'raffia', rgb: 0xEADAB8, origin: './ntc' },
  { name: 'white rock', rgb: 0xEAE8D4, origin: './ntc' },
  { name: 'panache', rgb: 0xEAF6EE, origin: './ntc' },
  { name: 'solitude', rgb: 0xEAF6FF, origin: './ntc' },
  { name: 'aqua spring', rgb: 0xEAF9F5, origin: './ntc' },
  { name: 'dew', rgb: 0xEAFFFE, origin: './ntc' },
  { name: 'apricot', rgb: 0xEB9373, origin: './ntc' },
  { name: 'zinnwaldite', rgb: 0xEBC2AF, origin: './ntc' },
  { name: 'fuel yellow', rgb: 0xECA927, origin: './ntc' },
  { name: 'ronchi', rgb: 0xECC54E, origin: './ntc' },
  { name: 'french lilac', rgb: 0xECC7EE, origin: './ntc' },
  { name: 'just right', rgb: 0xECCDB9, origin: './ntc' },
  { name: 'wild rice', rgb: 0xECE090, origin: './ntc' },
  { name: 'fall green', rgb: 0xECEBBD, origin: './ntc' },
  { name: 'aths special', rgb: 0xECEBCE, origin: './ntc' },
  { name: 'starship', rgb: 0xECF245, origin: './ntc' },
  { name: 'red ribbon', rgb: 0xED0A3F, origin: './ntc' },
  { name: 'tango', rgb: 0xED7A1C, origin: './ntc' },
  { name: 'carrot orange', rgb: 0xED9121, origin: './ntc' },
  { name: 'sea pink', rgb: 0xED989E, origin: './ntc' },
  { name: 'tacao', rgb: 0xEDB381, origin: './ntc' },
  { name: 'desert sand', rgb: 0xEDC9AF, origin: './ntc' },
  { name: 'pancho', rgb: 0xEDCDAB, origin: './ntc' },
  { name: 'chamois', rgb: 0xEDDCB1, origin: './ntc' },
  { name: 'primrose', rgb: 0xEDEA99, origin: './ntc' },
  { name: 'frost', rgb: 0xEDF5DD, origin: './ntc' },
  { name: 'aqua haze', rgb: 0xEDF5F5, origin: './ntc' },
  { name: 'zumthor', rgb: 0xEDF6FF, origin: './ntc' },
  { name: 'narvik', rgb: 0xEDF9F1, origin: './ntc' },
  { name: 'honeysuckle', rgb: 0xEDFC84, origin: './ntc' },
  { name: 'lavender magenta', rgb: 0xEE82EE, origin: './ntc' },
  { name: 'beauty bush', rgb: 0xEEC1BE, origin: './ntc' },
  { name: 'chalky', rgb: 0xEED794, origin: './ntc' },
  { name: 'almond', rgb: 0xEED9C4, origin: './ntc' },
  { name: 'flax', rgb: 0xEEDC82, origin: './ntc' },
  { name: 'bizarre', rgb: 0xEEDEDA, origin: './ntc' },
  { name: 'double colonial white', rgb: 0xEEE3AD, origin: './ntc' },
  { name: 'cararra', rgb: 0xEEEEE8, origin: './ntc' },
  { name: 'manz', rgb: 0xEEEF78, origin: './ntc' },
  { name: 'tahuna sands', rgb: 0xEEF0C8, origin: './ntc' },
  { name: 'athens gray', rgb: 0xEEF0F3, origin: './ntc' },
  { name: 'tusk', rgb: 0xEEF3C3, origin: './ntc' },
  { name: 'loafer', rgb: 0xEEF4DE, origin: './ntc' },
  { name: 'catskill white', rgb: 0xEEF6F7, origin: './ntc' },
  { name: 'twilight blue', rgb: 0xEEFDFF, origin: './ntc' },
  { name: 'jonquil', rgb: 0xEEFF9A, origin: './ntc' },
  { name: 'rice flower', rgb: 0xEEFFE2, origin: './ntc' },
  { name: 'jaffa', rgb: 0xEF863F, origin: './ntc' },
  { name: 'gallery', rgb: 0xEFEFEF, origin: './ntc' },
  { name: 'porcelain', rgb: 0xEFF2F3, origin: './ntc' },
  { name: 'mauvelous', rgb: 0xF091A9, origin: './ntc' },
  { name: 'golden dream', rgb: 0xF0D52D, origin: './ntc' },
  { name: 'golden sand', rgb: 0xF0DB7D, origin: './ntc' },
  { name: 'buff', rgb: 0xF0DC82, origin: './ntc' },
  { name: 'prim', rgb: 0xF0E2EC, origin: './ntc' },
  { name: 'khaki', rgb: 0xF0E68C, origin: './ntc' },
  { name: 'selago', rgb: 0xF0EEFD, origin: './ntc' },
  { name: 'titan white', rgb: 0xF0EEFF, origin: './ntc' },
  { name: 'alice blue', rgb: 0xF0F8FF, origin: './ntc' },
  { name: 'feta', rgb: 0xF0FCEA, origin: './ntc' },
  { name: 'gold drop', rgb: 0xF18200, origin: './ntc' },
  { name: 'wewak', rgb: 0xF19BAB, origin: './ntc' },
  { name: 'sahara sand', rgb: 0xF1E788, origin: './ntc' },
  { name: 'parchment', rgb: 0xF1E9D2, origin: './ntc' },
  { name: 'blue chalk', rgb: 0xF1E9FF, origin: './ntc' },
  { name: 'mint julep', rgb: 0xF1EEC1, origin: './ntc' },
  { name: 'seashell', rgb: 0xF1F1F1, origin: './ntc' },
  { name: 'saltpan', rgb: 0xF1F7F2, origin: './ntc' },
  { name: 'tidal', rgb: 0xF1FFAD, origin: './ntc' },
  { name: 'chiffon', rgb: 0xF1FFC8, origin: './ntc' },
  { name: 'flamingo', rgb: 0xF2552A, origin: './ntc' },
  { name: 'tangerine', rgb: 0xF28500, origin: './ntc' },
  { name: 'mandys pink', rgb: 0xF2C3B2, origin: './ntc' },
  { name: 'concrete', rgb: 0xF2F2F2, origin: './ntc' },
  { name: 'black squeeze', rgb: 0xF2FAFA, origin: './ntc' },
  { name: 'pomegranate', rgb: 0xF34723, origin: './ntc' },
  { name: 'buttercup', rgb: 0xF3AD16, origin: './ntc' },
  { name: 'new orleans', rgb: 0xF3D69D, origin: './ntc' },
  { name: 'vanilla ice', rgb: 0xF3D9DF, origin: './ntc' },
  { name: 'sidecar', rgb: 0xF3E7BB, origin: './ntc' },
  { name: 'dawn pink', rgb: 0xF3E9E5, origin: './ntc' },
  { name: 'wheatfield', rgb: 0xF3EDCF, origin: './ntc' },
  { name: 'canary', rgb: 0xF3FB62, origin: './ntc' },
  { name: 'orinoco', rgb: 0xF3FBD4, origin: './ntc' },
  { name: 'carla', rgb: 0xF3FFD8, origin: './ntc' },
  { name: 'hollywood cerise', rgb: 0xF400A1, origin: './ntc' },
  { name: 'sandy brown', rgb: 0xF4A460, origin: './ntc' },
  { name: 'saffron', rgb: 0xF4C430, origin: './ntc' },
  { name: 'ripe lemon', rgb: 0xF4D81C, origin: './ntc' },
  { name: 'janna', rgb: 0xF4EBD3, origin: './ntc' },
  { name: 'pampas', rgb: 0xF4F2EE, origin: './ntc' },
  { name: 'wild sand', rgb: 0xF4F4F4, origin: './ntc' },
  { name: 'zircon', rgb: 0xF4F8FF, origin: './ntc' },
  { name: 'froly', rgb: 0xF57584, origin: './ntc' },
  { name: 'cream can', rgb: 0xF5C85C, origin: './ntc' },
  { name: 'manhattan', rgb: 0xF5C999, origin: './ntc' },
  { name: 'maize', rgb: 0xF5D5A0, origin: './ntc' },
  { name: 'wheat', rgb: 0xF5DEB3, origin: './ntc' },
  { name: 'sandwisp', rgb: 0xF5E7A2, origin: './ntc' },
  { name: 'pot pourri', rgb: 0xF5E7E2, origin: './ntc' },
  { name: 'albescent white', rgb: 0xF5E9D3, origin: './ntc' },
  { name: 'soft peach', rgb: 0xF5EDEF, origin: './ntc' },
  { name: 'ecru white', rgb: 0xF5F3E5, origin: './ntc' },
  { name: 'beige', rgb: 0xF5F5DC, origin: './ntc' },
  { name: 'golden fizz', rgb: 0xF5FB3D, origin: './ntc' },
  { name: 'australian mint', rgb: 0xF5FFBE, origin: './ntc' },
  { name: 'french rose', rgb: 0xF64A8A, origin: './ntc' },
  { name: 'brilliant rose', rgb: 0xF653A6, origin: './ntc' },
  { name: 'illusion', rgb: 0xF6A4C9, origin: './ntc' },
  { name: 'merino', rgb: 0xF6F0E6, origin: './ntc' },
  { name: 'black haze', rgb: 0xF6F7F7, origin: './ntc' },
  { name: 'spring sun', rgb: 0xF6FFDC, origin: './ntc' },
  { name: 'violet red', rgb: 0xF7468A, origin: './ntc' },
  { name: 'chilean fire', rgb: 0xF77703, origin: './ntc' },
  { name: 'persian pink', rgb: 0xF77FBE, origin: './ntc' },
  { name: 'rajah', rgb: 0xF7B668, origin: './ntc' },
  { name: 'azalea', rgb: 0xF7C8DA, origin: './ntc' },
  { name: 'we peep', rgb: 0xF7DBE6, origin: './ntc' },
  { name: 'quarter spanish white', rgb: 0xF7F2E1, origin: './ntc' },
  { name: 'whisper', rgb: 0xF7F5FA, origin: './ntc' },
  { name: 'snow drift', rgb: 0xF7FAF7, origin: './ntc' },
  { name: 'casablanca', rgb: 0xF8B853, origin: './ntc' },
  { name: 'chantilly', rgb: 0xF8C3DF, origin: './ntc' },
  { name: 'cherub', rgb: 0xF8D9E9, origin: './ntc' },
  { name: 'marzipan', rgb: 0xF8DB9D, origin: './ntc' },
  { name: 'energy yellow', rgb: 0xF8DD5C, origin: './ntc' },
  { name: 'givry', rgb: 0xF8E4BF, origin: './ntc' },
  { name: 'white linen', rgb: 0xF8F0E8, origin: './ntc' },
  { name: 'magnolia', rgb: 0xF8F4FF, origin: './ntc' },
  { name: 'spring wood', rgb: 0xF8F6F1, origin: './ntc' },
  { name: 'coconut cream', rgb: 0xF8F7DC, origin: './ntc' },
  { name: 'white lilac', rgb: 0xF8F7FC, origin: './ntc' },
  { name: 'desert storm', rgb: 0xF8F8F7, origin: './ntc' },
  { name: 'texas', rgb: 0xF8F99C, origin: './ntc' },
  { name: 'corn field', rgb: 0xF8FACD, origin: './ntc' },
  { name: 'mimosa', rgb: 0xF8FDD3, origin: './ntc' },
  { name: 'carnation', rgb: 0xF95A61, origin: './ntc' },
  { name: 'saffron mango', rgb: 0xF9BF58, origin: './ntc' },
  { name: 'carousel pink', rgb: 0xF9E0ED, origin: './ntc' },
  { name: 'dairy cream', rgb: 0xF9E4BC, origin: './ntc' },
  { name: 'portica', rgb: 0xF9E663, origin: './ntc' },
  { name: 'amour', rgb: 0xF9EAF3, origin: './ntc' },
  { name: 'rum swizzle', rgb: 0xF9F8E4, origin: './ntc' },
  { name: 'dolly', rgb: 0xF9FF8B, origin: './ntc' },
  { name: 'sugar cane', rgb: 0xF9FFF6, origin: './ntc' },
  { name: 'ecstasy', rgb: 0xFA7814, origin: './ntc' },
  { name: 'tan hide', rgb: 0xFA9D5A, origin: './ntc' },
  { name: 'corvette', rgb: 0xFAD3A2, origin: './ntc' },
  { name: 'peach yellow', rgb: 0xFADFAD, origin: './ntc' },
  { name: 'turbo', rgb: 0xFAE600, origin: './ntc' },
  { name: 'astra', rgb: 0xFAEAB9, origin: './ntc' },
  { name: 'champagne', rgb: 0xFAECCC, origin: './ntc' },
  { name: 'linen', rgb: 0xFAF0E6, origin: './ntc' },
  { name: 'fantasy', rgb: 0xFAF3F0, origin: './ntc' },
  { name: 'citrine white', rgb: 0xFAF7D6, origin: './ntc' },
  { name: 'alabaster', rgb: 0xFAFAFA, origin: './ntc' },
  { name: 'hint of yellow', rgb: 0xFAFDE4, origin: './ntc' },
  { name: 'milan', rgb: 0xFAFFA4, origin: './ntc' },
  { name: 'brink pink', rgb: 0xFB607F, origin: './ntc' },
  { name: 'geraldine', rgb: 0xFB8989, origin: './ntc' },
  { name: 'lavender rose', rgb: 0xFBA0E3, origin: './ntc' },
  { name: 'sea buckthorn', rgb: 0xFBA129, origin: './ntc' },
  { name: 'sun', rgb: 0xFBAC13, origin: './ntc' },
  { name: 'lavender pink', rgb: 0xFBAED2, origin: './ntc' },
  { name: 'rose bud', rgb: 0xFBB2A3, origin: './ntc' },
  { name: 'cupid', rgb: 0xFBBEDA, origin: './ntc' },
  { name: 'classic rose', rgb: 0xFBCCE7, origin: './ntc' },
  { name: 'apricot peach', rgb: 0xFBCEB1, origin: './ntc' },
  { name: 'banana mania', rgb: 0xFBE7B2, origin: './ntc' },
  { name: 'marigold yellow', rgb: 0xFBE870, origin: './ntc' },
  { name: 'festival', rgb: 0xFBE96C, origin: './ntc' },
  { name: 'sweet corn', rgb: 0xFBEA8C, origin: './ntc' },
  { name: 'candy corn', rgb: 0xFBEC5D, origin: './ntc' },
  { name: 'hint of red', rgb: 0xFBF9F9, origin: './ntc' },
  { name: 'shalimar', rgb: 0xFBFFBA, origin: './ntc' },
  { name: 'shocking pink', rgb: 0xFC0FC0, origin: './ntc' },
  { name: 'tickle me pink', rgb: 0xFC80A5, origin: './ntc' },
  { name: 'tree poppy', rgb: 0xFC9C1D, origin: './ntc' },
  { name: 'lightning yellow', rgb: 0xFCC01E, origin: './ntc' },
  { name: 'goldenrod', rgb: 0xFCD667, origin: './ntc' },
  { name: 'candlelight', rgb: 0xFCD917, origin: './ntc' },
  { name: 'cherokee', rgb: 0xFCDA98, origin: './ntc' },
  { name: 'double pearl lusta', rgb: 0xFCF4D0, origin: './ntc' },
  { name: 'pearl lusta', rgb: 0xFCF4DC, origin: './ntc' },
  { name: 'vista white', rgb: 0xFCF8F7, origin: './ntc' },
  { name: 'bianca', rgb: 0xFCFBF3, origin: './ntc' },
  { name: 'moon glow', rgb: 0xFCFEDA, origin: './ntc' },
  { name: 'china ivory', rgb: 0xFCFFE7, origin: './ntc' },
  { name: 'ceramic', rgb: 0xFCFFF9, origin: './ntc' },
  { name: 'torch red', rgb: 0xFD0E35, origin: './ntc' },
  { name: 'wild watermelon', rgb: 0xFD5B78, origin: './ntc' },
  { name: 'crusta', rgb: 0xFD7B33, origin: './ntc' },
  { name: 'sorbus', rgb: 0xFD7C07, origin: './ntc' },
  { name: 'sweet pink', rgb: 0xFD9FA2, origin: './ntc' },
  { name: 'light apricot', rgb: 0xFDD5B1, origin: './ntc' },
  { name: 'pig pink', rgb: 0xFDD7E4, origin: './ntc' },
  { name: 'cinderella', rgb: 0xFDE1DC, origin: './ntc' },
  { name: 'golden glow', rgb: 0xFDE295, origin: './ntc' },
  { name: 'lemon', rgb: 0xFDE910, origin: './ntc' },
  { name: 'old lace', rgb: 0xFDF5E6, origin: './ntc' },
  { name: 'half colonial white', rgb: 0xFDF6D3, origin: './ntc' },
  { name: 'drover', rgb: 0xFDF7AD, origin: './ntc' },
  { name: 'pale prim', rgb: 0xFDFEB8, origin: './ntc' },
  { name: 'cumulus', rgb: 0xFDFFD5, origin: './ntc' },
  { name: 'persian rose', rgb: 0xFE28A2, origin: './ntc' },
  { name: 'sunset orange', rgb: 0xFE4C40, origin: './ntc' },
  { name: 'bittersweet', rgb: 0xFE6F5E, origin: './ntc' },
  { name: 'california', rgb: 0xFE9D04, origin: './ntc' },
  { name: 'yellow sea', rgb: 0xFEA904, origin: './ntc' },
  { name: 'melon', rgb: 0xFEBAAD, origin: './ntc' },
  { name: 'bright sun', rgb: 0xFED33C, origin: './ntc' },
  { name: 'dandelion', rgb: 0xFED85D, origin: './ntc' },
  { name: 'salomie', rgb: 0xFEDB8D, origin: './ntc' },
  { name: 'cape honey', rgb: 0xFEE5AC, origin: './ntc' },
  { name: 'remy', rgb: 0xFEEBF3, origin: './ntc' },
  { name: 'oasis', rgb: 0xFEEFCE, origin: './ntc' },
  { name: 'bridesmaid', rgb: 0xFEF0EC, origin: './ntc' },
  { name: 'beeswax', rgb: 0xFEF2C7, origin: './ntc' },
  { name: 'bleach white', rgb: 0xFEF3D8, origin: './ntc' },
  { name: 'pipi', rgb: 0xFEF4CC, origin: './ntc' },
  { name: 'half spanish white', rgb: 0xFEF4DB, origin: './ntc' },
  { name: 'wisp pink', rgb: 0xFEF4F8, origin: './ntc' },
  { name: 'provincial pink', rgb: 0xFEF5F1, origin: './ntc' },
  { name: 'half dutch white', rgb: 0xFEF7DE, origin: './ntc' },
  { name: 'solitaire', rgb: 0xFEF8E2, origin: './ntc' },
  { name: 'white pointer', rgb: 0xFEF8FF, origin: './ntc' },
  { name: 'off yellow', rgb: 0xFEF9E3, origin: './ntc' },
  { name: 'orange white', rgb: 0xFEFCED, origin: './ntc' },
  { name: 'red', rgb: 0xFF0000, origin: './ntc' },
  { name: 'rose', rgb: 0xFF007F, origin: './ntc' },
  { name: 'purple pizzazz', rgb: 0xFF00CC, origin: './ntc' },
  { name: 'magenta / fuchsia', rgb: 0xFF00FF, origin: './ntc' },
  { name: 'scarlet', rgb: 0xFF2400, origin: './ntc' },
  { name: 'wild strawberry', rgb: 0xFF3399, origin: './ntc' },
  { name: 'razzle dazzle rose', rgb: 0xFF33CC, origin: './ntc' },
  { name: 'radical red', rgb: 0xFF355E, origin: './ntc' },
  { name: 'red orange', rgb: 0xFF3F34, origin: './ntc' },
  { name: 'coral red', rgb: 0xFF4040, origin: './ntc' },
  { name: 'vermilion', rgb: 0xFF4D00, origin: './ntc' },
  { name: 'international orange', rgb: 0xFF4F00, origin: './ntc' },
  { name: 'outrageous orange', rgb: 0xFF6037, origin: './ntc' },
  { name: 'blaze orange', rgb: 0xFF6600, origin: './ntc' },
  { name: 'pink flamingo', rgb: 0xFF66FF, origin: './ntc' },
  { name: 'orange', rgb: 0xFF681F, origin: './ntc' },
  { name: 'hot pink', rgb: 0xFF69B4, origin: './ntc' },
  { name: 'persimmon', rgb: 0xFF6B53, origin: './ntc' },
  { name: 'blush pink', rgb: 0xFF6FFF, origin: './ntc' },
  { name: 'burning orange', rgb: 0xFF7034, origin: './ntc' },
  { name: 'pumpkin', rgb: 0xFF7518, origin: './ntc' },
  { name: 'flamenco', rgb: 0xFF7D07, origin: './ntc' },
  { name: 'flush orange', rgb: 0xFF7F00, origin: './ntc' },
  { name: 'coral', rgb: 0xFF7F50, origin: './ntc' },
  { name: 'salmon', rgb: 0xFF8C69, origin: './ntc' },
  { name: 'pizazz', rgb: 0xFF9000, origin: './ntc' },
  { name: 'west side', rgb: 0xFF910F, origin: './ntc' },
  { name: 'pink salmon', rgb: 0xFF91A4, origin: './ntc' },
  { name: 'neon carrot', rgb: 0xFF9933, origin: './ntc' },
  { name: 'atomic tangerine', rgb: 0xFF9966, origin: './ntc' },
  { name: 'vivid tangerine', rgb: 0xFF9980, origin: './ntc' },
  { name: 'sunshade', rgb: 0xFF9E2C, origin: './ntc' },
  { name: 'orange peel', rgb: 0xFFA000, origin: './ntc' },
  { name: 'mona lisa', rgb: 0xFFA194, origin: './ntc' },
  { name: 'web orange', rgb: 0xFFA500, origin: './ntc' },
  { name: 'carnation pink', rgb: 0xFFA6C9, origin: './ntc' },
  { name: 'hit pink', rgb: 0xFFAB81, origin: './ntc' },
  { name: 'yellow orange', rgb: 0xFFAE42, origin: './ntc' },
  { name: 'cornflower lilac', rgb: 0xFFB0AC, origin: './ntc' },
  { name: 'sundown', rgb: 0xFFB1B3, origin: './ntc' },
  { name: 'my sin', rgb: 0xFFB31F, origin: './ntc' },
  { name: 'texas rose', rgb: 0xFFB555, origin: './ntc' },
  { name: 'cotton candy', rgb: 0xFFB7D5, origin: './ntc' },
  { name: 'macaroni and cheese', rgb: 0xFFB97B, origin: './ntc' },
  { name: 'selective yellow', rgb: 0xFFBA00, origin: './ntc' },
  { name: 'koromiko', rgb: 0xFFBD5F, origin: './ntc' },
  { name: 'amber', rgb: 0xFFBF00, origin: './ntc' },
  { name: 'wax flower', rgb: 0xFFC0A8, origin: './ntc' },
  { name: 'pink', rgb: 0xFFC0CB, origin: './ntc' },
  { name: 'your pink', rgb: 0xFFC3C0, origin: './ntc' },
  { name: 'supernova', rgb: 0xFFC901, origin: './ntc' },
  { name: 'flesh', rgb: 0xFFCBA4, origin: './ntc' },
  { name: 'sunglow', rgb: 0xFFCC33, origin: './ntc' },
  { name: 'golden tainoi', rgb: 0xFFCC5C, origin: './ntc' },
  { name: 'peach orange', rgb: 0xFFCC99, origin: './ntc' },
  { name: 'chardonnay', rgb: 0xFFCD8C, origin: './ntc' },
  { name: 'pastel pink', rgb: 0xFFD1DC, origin: './ntc' },
  { name: 'romantic', rgb: 0xFFD2B7, origin: './ntc' },
  { name: 'grandis', rgb: 0xFFD38C, origin: './ntc' },
  { name: 'gold', rgb: 0xFFD700, origin: './ntc' },
  { name: 'school bus yellow', rgb: 0xFFD800, origin: './ntc' },
  { name: 'cosmos', rgb: 0xFFD8D9, origin: './ntc' },
  { name: 'mustard', rgb: 0xFFDB58, origin: './ntc' },
  { name: 'peach schnapps', rgb: 0xFFDCD6, origin: './ntc' },
  { name: 'caramel', rgb: 0xFFDDAF, origin: './ntc' },
  { name: 'tuft bush', rgb: 0xFFDDCD, origin: './ntc' },
  { name: 'watusi', rgb: 0xFFDDCF, origin: './ntc' },
  { name: 'pink lace', rgb: 0xFFDDF4, origin: './ntc' },
  { name: 'navajo white', rgb: 0xFFDEAD, origin: './ntc' },
  { name: 'frangipani', rgb: 0xFFDEB3, origin: './ntc' },
  { name: 'pippin', rgb: 0xFFE1DF, origin: './ntc' },
  { name: 'pale rose', rgb: 0xFFE1F2, origin: './ntc' },
  { name: 'negroni', rgb: 0xFFE2C5, origin: './ntc' },
  { name: 'cream brulee', rgb: 0xFFE5A0, origin: './ntc' },
  { name: 'peach', rgb: 0xFFE5B4, origin: './ntc' },
  { name: 'tequila', rgb: 0xFFE6C7, origin: './ntc' },
  { name: 'kournikova', rgb: 0xFFE772, origin: './ntc' },
  { name: 'sandy beach', rgb: 0xFFEAC8, origin: './ntc' },
  { name: 'karry', rgb: 0xFFEAD4, origin: './ntc' },
  { name: 'broom', rgb: 0xFFEC13, origin: './ntc' },
  { name: 'colonial white', rgb: 0xFFEDBC, origin: './ntc' },
  { name: 'derby', rgb: 0xFFEED8, origin: './ntc' },
  { name: 'vis vis', rgb: 0xFFEFA1, origin: './ntc' },
  { name: 'egg white', rgb: 0xFFEFC1, origin: './ntc' },
  { name: 'papaya whip', rgb: 0xFFEFD5, origin: './ntc' },
  { name: 'fair pink', rgb: 0xFFEFEC, origin: './ntc' },
  { name: 'peach cream', rgb: 0xFFF0DB, origin: './ntc' },
  { name: 'lavender blush', rgb: 0xFFF0F5, origin: './ntc' },
  { name: 'gorse', rgb: 0xFFF14F, origin: './ntc' },
  { name: 'buttermilk', rgb: 0xFFF1B5, origin: './ntc' },
  { name: 'pink lady', rgb: 0xFFF1D8, origin: './ntc' },
  { name: 'forget me not', rgb: 0xFFF1EE, origin: './ntc' },
  { name: 'tutu', rgb: 0xFFF1F9, origin: './ntc' },
  { name: 'picasso', rgb: 0xFFF39D, origin: './ntc' },
  { name: 'chardon', rgb: 0xFFF3F1, origin: './ntc' },
  { name: 'paris daisy', rgb: 0xFFF46E, origin: './ntc' },
  { name: 'barley white', rgb: 0xFFF4CE, origin: './ntc' },
  { name: 'egg sour', rgb: 0xFFF4DD, origin: './ntc' },
  { name: 'sazerac', rgb: 0xFFF4E0, origin: './ntc' },
  { name: 'serenade', rgb: 0xFFF4E8, origin: './ntc' },
  { name: 'chablis', rgb: 0xFFF4F3, origin: './ntc' },
  { name: 'seashell peach', rgb: 0xFFF5EE, origin: './ntc' },
  { name: 'sauvignon', rgb: 0xFFF5F3, origin: './ntc' },
  { name: 'milk punch', rgb: 0xFFF6D4, origin: './ntc' },
  { name: 'varden', rgb: 0xFFF6DF, origin: './ntc' },
  { name: 'rose white', rgb: 0xFFF6F5, origin: './ntc' },
  { name: 'baja white', rgb: 0xFFF8D1, origin: './ntc' },
  { name: 'gin fizz', rgb: 0xFFF9E2, origin: './ntc' },
  { name: 'early dawn', rgb: 0xFFF9E6, origin: './ntc' },
  { name: 'lemon chiffon', rgb: 0xFFFACD, origin: './ntc' },
  { name: 'bridal heath', rgb: 0xFFFAF4, origin: './ntc' },
  { name: 'scotch mist', rgb: 0xFFFBDC, origin: './ntc' },
  { name: 'soapstone', rgb: 0xFFFBF9, origin: './ntc' },
  { name: 'witch haze', rgb: 0xFFFC99, origin: './ntc' },
  { name: 'buttery white', rgb: 0xFFFCEA, origin: './ntc' },
  { name: 'island spice', rgb: 0xFFFCEE, origin: './ntc' },
  { name: 'cream', rgb: 0xFFFDD0, origin: './ntc' },
  { name: 'chilean heath', rgb: 0xFFFDE6, origin: './ntc' },
  { name: 'travertine', rgb: 0xFFFDE8, origin: './ntc' },
  { name: 'orchid white', rgb: 0xFFFDF3, origin: './ntc' },
  { name: 'quarter pearl lusta', rgb: 0xFFFDF4, origin: './ntc' },
  { name: 'half and half', rgb: 0xFFFEE1, origin: './ntc' },
  { name: 'apricot white', rgb: 0xFFFEEC, origin: './ntc' },
  { name: 'rice cake', rgb: 0xFFFEF0, origin: './ntc' },
  { name: 'black white', rgb: 0xFFFEF6, origin: './ntc' },
  { name: 'romance', rgb: 0xFFFEFD, origin: './ntc' },
  { name: 'yellow', rgb: 0xFFFF00, origin: './ntc' },
  { name: 'laser lemon', rgb: 0xFFFF66, origin: './ntc' },
  { name: 'pale canary', rgb: 0xFFFF99, origin: './ntc' },
  { name: 'portafino', rgb: 0xFFFFB4, origin: './ntc' },
  { name: 'ivory', rgb: 0xFFFFF0, origin: './ntc' },
  { name: 'white', rgb: 0xFFFFFF, origin: './ntc' },
  { name: 'mahogany', rgb: 0xCD4A4A, origin: './pantone' },
  { name: 'fuzzy wuzzy brown', rgb: 0xCC6666, origin: './pantone' },
  { name: 'chestnut', rgb: 0xBC5D58, origin: './pantone' },
  { name: 'red orange', rgb: 0xFF5349, origin: './pantone' },
  { name: 'sunset orange', rgb: 0xFD5E53, origin: './pantone' },
  { name: 'bittersweet', rgb: 0xFD7C6E, origin: './pantone' },
  { name: 'melon', rgb: 0xFDBCB4, origin: './pantone' },
  { name: 'outrageous orange', rgb: 0xFF6E4A, origin: './pantone' },
  { name: 'vivid tangerine', rgb: 0xFFA089, origin: './pantone' },
  { name: 'burnt sienna', rgb: 0xEA7E5D, origin: './pantone' },
  { name: 'brown', rgb: 0xB4674D, origin: './pantone' },
  { name: 'sepia', rgb: 0xA5694F, origin: './pantone' },
  { name: 'orange', rgb: 0xFF7538, origin: './pantone' },
  { name: 'burnt orange', rgb: 0xFF7F49, origin: './pantone' },
  { name: 'copper', rgb: 0xDD9475, origin: './pantone' },
  { name: 'mango tango', rgb: 0xFF8243, origin: './pantone' },
  { name: 'atomic tangerine', rgb: 0xFFA474, origin: './pantone' },
  { name: 'beaver', rgb: 0x9F8170, origin: './pantone' },
  { name: 'antique brass', rgb: 0xCD9575, origin: './pantone' },
  { name: 'desert sand', rgb: 0xEFCDB8, origin: './pantone' },
  { name: 'raw sienna', rgb: 0xD68A59, origin: './pantone' },
  { name: 'tumbleweed', rgb: 0xDEAA88, origin: './pantone' },
  { name: 'tan', rgb: 0xFAA76C, origin: './pantone' },
  { name: 'peach', rgb: 0xFFCFAB, origin: './pantone' },
  { name: 'macaroni and cheese', rgb: 0xFFBD88, origin: './pantone' },
  { name: 'apricot', rgb: 0xFDD9B5, origin: './pantone' },
  { name: 'neon carrot', rgb: 0xFFA343, origin: './pantone' },
  { name: 'almond', rgb: 0xEFDBC5, origin: './pantone' },
  { name: 'yellow orange', rgb: 0xFFB653, origin: './pantone' },
  { name: 'gold', rgb: 0xE7C697, origin: './pantone' },
  { name: 'shadow', rgb: 0x8A795D, origin: './pantone' },
  { name: 'banana mania', rgb: 0xFAE7B5, origin: './pantone' },
  { name: 'sunglow', rgb: 0xFFCF48, origin: './pantone' },
  { name: 'goldenrod', rgb: 0xFCD975, origin: './pantone' },
  { name: 'dandelion', rgb: 0xFDDB6D, origin: './pantone' },
  { name: 'yellow', rgb: 0xFCE883, origin: './pantone' },
  { name: 'green yellow', rgb: 0xF0E891, origin: './pantone' },
  { name: 'spring green', rgb: 0xECEABE, origin: './pantone' },
  { name: 'olive green', rgb: 0xBAB86C, origin: './pantone' },
  { name: 'laser lemon', rgb: 0xFDFC74, origin: './pantone' },
  { name: 'unmellow yellow', rgb: 0xFDFC74, origin: './pantone' },
  { name: 'canary', rgb: 0xFFFF99, origin: './pantone' },
  { name: 'yellow green', rgb: 0xC5E384, origin: './pantone' },
  { name: 'inch worm', rgb: 0xB2EC5D, origin: './pantone' },
  { name: 'asparagus', rgb: 0x87A96B, origin: './pantone' },
  { name: 'granny smith apple', rgb: 0xA8E4A0, origin: './pantone' },
  { name: 'electric lime', rgb: 0x1DF914, origin: './pantone' },
  { name: 'screamin green', rgb: 0x76FF7A, origin: './pantone' },
  { name: 'fern', rgb: 0x71BC78, origin: './pantone' },
  { name: 'forest green', rgb: 0x6DAE81, origin: './pantone' },
  { name: 'sea green', rgb: 0x9FE2BF, origin: './pantone' },
  { name: 'green', rgb: 0x1CAC78, origin: './pantone' },
  { name: 'mountain meadow', rgb: 0x30BA8F, origin: './pantone' },
  { name: 'shamrock', rgb: 0x45CEA2, origin: './pantone' },
  { name: 'jungle green', rgb: 0x3BB08F, origin: './pantone' },
  { name: 'caribbean green', rgb: 0x1CD3A2, origin: './pantone' },
  { name: 'tropical rain forest', rgb: 0x17806D, origin: './pantone' },
  { name: 'pine green', rgb: 0x158078, origin: './pantone' },
  { name: 'robin egg blue', rgb: 0x1FCECB, origin: './pantone' },
  { name: 'aquamarine', rgb: 0x78DBE2, origin: './pantone' },
  { name: 'turquoise blue', rgb: 0x77DDE7, origin: './pantone' },
  { name: 'sky blue', rgb: 0x80DAEB, origin: './pantone' },
  { name: 'outer space', rgb: 0x414A4C, origin: './pantone' },
  { name: 'blue green', rgb: 0x199EBD, origin: './pantone' },
  { name: 'pacific blue', rgb: 0x1CA9C9, origin: './pantone' },
  { name: 'cerulean', rgb: 0x1DACD6, origin: './pantone' },
  { name: 'cornflower', rgb: 0x9ACEEB, origin: './pantone' },
  { name: 'midnight blue', rgb: 0x1A4876, origin: './pantone' },
  { name: 'navy blue', rgb: 0x1974D2, origin: './pantone' },
  { name: 'denim', rgb: 0x2B6CC4, origin: './pantone' },
  { name: 'blue', rgb: 0x1F75FE, origin: './pantone' },
  { name: 'periwinkle', rgb: 0xC5D0E6, origin: './pantone' },
  { name: 'cadet blue', rgb: 0xB0B7C6, origin: './pantone' },
  { name: 'indigo', rgb: 0x5D76CB, origin: './pantone' },
  { name: 'wild blue yonder', rgb: 0xA2ADD0, origin: './pantone' },
  { name: 'manatee', rgb: 0x979AAA, origin: './pantone' },
  { name: 'blue bell', rgb: 0xADADD6, origin: './pantone' },
  { name: 'blue violet', rgb: 0x7366BD, origin: './pantone' },
  { name: 'purple heart', rgb: 0x7442C8, origin: './pantone' },
  { name: 'royal purple', rgb: 0x7851A9, origin: './pantone' },
  { name: 'purple mountains’ majesty', rgb: 0x9D81BA, origin: './pantone' },
  { name: 'violet (purple)', rgb: 0x926EAE, origin: './pantone' },
  { name: 'wisteria', rgb: 0xCDA4DE, origin: './pantone' },
  { name: 'vivid violet', rgb: 0x8F509D, origin: './pantone' },
  { name: 'fuchsia', rgb: 0xC364C5, origin: './pantone' },
  { name: 'shocking pink', rgb: 0xFB7EFD, origin: './pantone' },
  { name: 'pink flamingo', rgb: 0xFC74FD, origin: './pantone' },
  { name: 'plum', rgb: 0x8E4585, origin: './pantone' },
  { name: 'hot magenta', rgb: 0xFF1DCE, origin: './pantone' },
  { name: 'purple pizzazz', rgb: 0xFF1DCE, origin: './pantone' },
  { name: 'razzle dazzle rose', rgb: 0xFF48D0, origin: './pantone' },
  { name: 'orchid', rgb: 0xE6A8D7, origin: './pantone' },
  { name: 'red violet', rgb: 0xC0448F, origin: './pantone' },
  { name: 'eggplant', rgb: 0x6E5160, origin: './pantone' },
  { name: 'cerise', rgb: 0xDD4492, origin: './pantone' },
  { name: 'wild strawberry', rgb: 0xFF43A4, origin: './pantone' },
  { name: 'magenta', rgb: 0xF664AF, origin: './pantone' },
  { name: 'lavender', rgb: 0xFCB4D5, origin: './pantone' },
  { name: 'cotton candy', rgb: 0xFFBCD9, origin: './pantone' },
  { name: 'violet red', rgb: 0xF75394, origin: './pantone' },
  { name: 'carnation pink', rgb: 0xFFAACC, origin: './pantone' },
  { name: 'razzmatazz', rgb: 0xE3256B, origin: './pantone' },
  { name: 'piggy pink', rgb: 0xFDD7E4, origin: './pantone' },
  { name: 'jazzberry jam', rgb: 0xCA3767, origin: './pantone' },
  { name: 'blush', rgb: 0xDE5D83, origin: './pantone' },
  { name: 'tickle me pink', rgb: 0xFC89AC, origin: './pantone' },
  { name: 'pink sherbet', rgb: 0xF780A1, origin: './pantone' },
  { name: 'maroon', rgb: 0xC8385A, origin: './pantone' },
  { name: 'red', rgb: 0xEE204D, origin: './pantone' },
  { name: 'radical red', rgb: 0xFF496C, origin: './pantone' },
  { name: 'mauvelous', rgb: 0xEF98AA, origin: './pantone' },
  { name: 'wild watermelon', rgb: 0xFC6C85, origin: './pantone' },
  { name: 'scarlet', rgb: 0xFC2847, origin: './pantone' },
  { name: 'salmon', rgb: 0xFF9BAA, origin: './pantone' },
  { name: 'brick red', rgb: 0xCB4154, origin: './pantone' },
  { name: 'white', rgb: 0xEDEDED, origin: './pantone' },
  { name: 'timberwolf', rgb: 0xDBD7D2, origin: './pantone' },
  { name: 'silver', rgb: 0xCDC5C2, origin: './pantone' },
  { name: 'gray', rgb: 0x95918C, origin: './pantone' },
  { name: 'black', rgb: 0x232323, origin: './pantone' },
  { name: 'red', rgb: 0xFF0000, origin: './roygbiv' },
  { name: 'orange', rgb: 0xFFA500, origin: './roygbiv' },
  { name: 'yellow', rgb: 0xFFFF00, origin: './roygbiv' },
  { name: 'green', rgb: 0x008000, origin: './roygbiv' },
  { name: 'blue', rgb: 0x0000FF, origin: './roygbiv' },
  { name: 'indigo', rgb: 0x4B0082, origin: './roygbiv' },
  { name: 'violet', rgb: 0xEE82EE, origin: './roygbiv' },
  { name: 'indigo', rgb: 0x4b0082, origin: './x11' },
  { name: 'gold', rgb: 0xffd700, origin: './x11' },
  { name: 'hotpink', rgb: 0xff69b4, origin: './x11' },
  { name: 'firebrick', rgb: 0xb22222, origin: './x11' },
  { name: 'indianred', rgb: 0xcd5c5c, origin: './x11' },
  { name: 'yellow', rgb: 0xffff00, origin: './x11' },
  { name: 'mistyrose', rgb: 0xffe4e1, origin: './x11' },
  { name: 'darkolivegreen', rgb: 0x556b2f, origin: './x11' },
  { name: 'olive', rgb: 0x808000, origin: './x11' },
  { name: 'darkseagreen', rgb: 0x8fbc8f, origin: './x11' },
  { name: 'pink', rgb: 0xffc0cb, origin: './x11' },
  { name: 'tomato', rgb: 0xff6347, origin: './x11' },
  { name: 'lightcoral', rgb: 0xf08080, origin: './x11' },
  { name: 'orangered', rgb: 0xff4500, origin: './x11' },
  { name: 'navajowhite', rgb: 0xffdead, origin: './x11' },
  { name: 'lime', rgb: 0x00ff00, origin: './x11' },
  { name: 'palegreen', rgb: 0x98fb98, origin: './x11' },
  { name: 'darkslategrey', rgb: 0x2f4f4f, origin: './x11' },
  { name: 'greenyellow', rgb: 0xadff2f, origin: './x11' },
  { name: 'burlywood', rgb: 0xdeb887, origin: './x11' },
  { name: 'seashell', rgb: 0xfff5ee, origin: './x11' },
  { name: 'mediumspringgreen', rgb: 0x00fa9a, origin: './x11' },
  { name: 'fuchsia', rgb: 0xff00ff, origin: './x11' },
  { name: 'papayawhip', rgb: 0xffefd5, origin: './x11' },
  { name: 'blanchedalmond', rgb: 0xffebcd, origin: './x11' },
  { name: 'chartreuse', rgb: 0x7fff00, origin: './x11' },
  { name: 'dimgray', rgb: 0x696969, origin: './x11' },
  { name: 'black', rgb: 0x000000, origin: './x11' },
  { name: 'peachpuff', rgb: 0xffdab9, origin: './x11' },
  { name: 'springgreen', rgb: 0x00ff7f, origin: './x11' },
  { name: 'aquamarine', rgb: 0x7fffd4, origin: './x11' },
  { name: 'white', rgb: 0xffffff, origin: './x11' },
  { name: 'orange', rgb: 0xffa500, origin: './x11' },
  { name: 'lightsalmon', rgb: 0xffa07a, origin: './x11' },
  { name: 'darkslategray', rgb: 0x2f4f4f, origin: './x11' },
  { name: 'brown', rgb: 0xa52a2a, origin: './x11' },
  { name: 'ivory', rgb: 0xfffff0, origin: './x11' },
  { name: 'dodgerblue', rgb: 0x1e90ff, origin: './x11' },
  { name: 'peru', rgb: 0xcd853f, origin: './x11' },
  { name: 'lawngreen', rgb: 0x7cfc00, origin: './x11' },
  { name: 'chocolate', rgb: 0xd2691e, origin: './x11' },
  { name: 'crimson', rgb: 0xdc143c, origin: './x11' },
  { name: 'forestgreen', rgb: 0x228b22, origin: './x11' },
  { name: 'darkgrey', rgb: 0xa9a9a9, origin: './x11' },
  { name: 'lightseagreen', rgb: 0x20b2aa, origin: './x11' },
  { name: 'cyan', rgb: 0x00ffff, origin: './x11' },
  { name: 'mintcream', rgb: 0xf5fffa, origin: './x11' },
  { name: 'silver', rgb: 0xc0c0c0, origin: './x11' },
  { name: 'antiquewhite', rgb: 0xfaebd7, origin: './x11' },
  { name: 'mediumorchid', rgb: 0xba55d3, origin: './x11' },
  { name: 'skyblue', rgb: 0x87ceeb, origin: './x11' },
  { name: 'gray', rgb: 0x808080, origin: './x11' },
  { name: 'darkturquoise', rgb: 0x00ced1, origin: './x11' },
  { name: 'goldenrod', rgb: 0xdaa520, origin: './x11' },
  { name: 'darkgreen', rgb: 0x006400, origin: './x11' },
  { name: 'floralwhite', rgb: 0xfffaf0, origin: './x11' },
  { name: 'darkviolet', rgb: 0x9400d3, origin: './x11' },
  { name: 'darkgray', rgb: 0xa9a9a9, origin: './x11' },
  { name: 'moccasin', rgb: 0xffe4b5, origin: './x11' },
  { name: 'saddlebrown', rgb: 0x8b4513, origin: './x11' },
  { name: 'grey', rgb: 0x808080, origin: './x11' },
  { name: 'darkslateblue', rgb: 0x483d8b, origin: './x11' },
  { name: 'lightskyblue', rgb: 0x87cefa, origin: './x11' },
  { name: 'lightpink', rgb: 0xffb6c1, origin: './x11' },
  { name: 'mediumvioletred', rgb: 0xc71585, origin: './x11' },
  { name: 'slategrey', rgb: 0x708090, origin: './x11' },
  { name: 'red', rgb: 0xff0000, origin: './x11' },
  { name: 'deeppink', rgb: 0xff1493, origin: './x11' },
  { name: 'limegreen', rgb: 0x32cd32, origin: './x11' },
  { name: 'darkmagenta', rgb: 0x8b008b, origin: './x11' },
  { name: 'palegoldenrod', rgb: 0xeee8aa, origin: './x11' },
  { name: 'plum', rgb: 0xdda0dd, origin: './x11' },
  { name: 'turquoise', rgb: 0x40e0d0, origin: './x11' },
  { name: 'lightgrey', rgb: 0xd3d3d3, origin: './x11' },
  { name: 'lightgoldenrodyellow', rgb: 0xfafad2, origin: './x11' },
  { name: 'darkgoldenrod', rgb: 0xb8860b, origin: './x11' },
  { name: 'lavender', rgb: 0xe6e6fa, origin: './x11' },
  { name: 'maroon', rgb: 0x800000, origin: './x11' },
  { name: 'yellowgreen', rgb: 0x9acd32, origin: './x11' },
  { name: 'sandybrown', rgb: 0xf4a460, origin: './x11' },
  { name: 'thistle', rgb: 0xd8bfd8, origin: './x11' },
  { name: 'violet', rgb: 0xee82ee, origin: './x11' },
  { name: 'navy', rgb: 0x000080, origin: './x11' },
  { name: 'magenta', rgb: 0xff00ff, origin: './x11' },
  { name: 'dimgrey', rgb: 0x696969, origin: './x11' },
  { name: 'tan', rgb: 0xd2b48c, origin: './x11' },
  { name: 'rosybrown', rgb: 0xbc8f8f, origin: './x11' },
  { name: 'olivedrab', rgb: 0x6b8e23, origin: './x11' },
  { name: 'blue', rgb: 0x0000ff, origin: './x11' },
  { name: 'lightblue', rgb: 0xadd8e6, origin: './x11' },
  { name: 'ghostwhite', rgb: 0xf8f8ff, origin: './x11' },
  { name: 'honeydew', rgb: 0xf0fff0, origin: './x11' },
  { name: 'cornflowerblue', rgb: 0x6495ed, origin: './x11' },
  { name: 'slateblue', rgb: 0x6a5acd, origin: './x11' },
  { name: 'linen', rgb: 0xfaf0e6, origin: './x11' },
  { name: 'darkblue', rgb: 0x00008b, origin: './x11' },
  { name: 'powderblue', rgb: 0xb0e0e6, origin: './x11' },
  { name: 'seagreen', rgb: 0x2e8b57, origin: './x11' },
  { name: 'darkkhaki', rgb: 0xbdb76b, origin: './x11' },
  { name: 'snow', rgb: 0xfffafa, origin: './x11' },
  { name: 'sienna', rgb: 0xa0522d, origin: './x11' },
  { name: 'mediumblue', rgb: 0x0000cd, origin: './x11' },
  { name: 'royalblue', rgb: 0x4169e1, origin: './x11' },
  { name: 'lightcyan', rgb: 0xe0ffff, origin: './x11' },
  { name: 'green', rgb: 0x008000, origin: './x11' },
  { name: 'mediumpurple', rgb: 0x9370db, origin: './x11' },
  { name: 'midnightblue', rgb: 0x191970, origin: './x11' },
  { name: 'cornsilk', rgb: 0xfff8dc, origin: './x11' },
  { name: 'paleturquoise', rgb: 0xafeeee, origin: './x11' },
  { name: 'bisque', rgb: 0xffe4c4, origin: './x11' },
  { name: 'slategray', rgb: 0x708090, origin: './x11' },
  { name: 'darkcyan', rgb: 0x008b8b, origin: './x11' },
  { name: 'khaki', rgb: 0xf0e68c, origin: './x11' },
  { name: 'wheat', rgb: 0xf5deb3, origin: './x11' },
  { name: 'teal', rgb: 0x008080, origin: './x11' },
  { name: 'darkorchid', rgb: 0x9932cc, origin: './x11' },
  { name: 'deepskyblue', rgb: 0x00bfff, origin: './x11' },
  { name: 'salmon', rgb: 0xfa8072, origin: './x11' },
  { name: 'darkred', rgb: 0x8b0000, origin: './x11' },
  { name: 'steelblue', rgb: 0x4682b4, origin: './x11' },
  { name: 'palevioletred', rgb: 0xdb7093, origin: './x11' },
  { name: 'lightslategray', rgb: 0x778899, origin: './x11' },
  { name: 'aliceblue', rgb: 0xf0f8ff, origin: './x11' },
  { name: 'lightslategrey', rgb: 0x778899, origin: './x11' },
  { name: 'lightgreen', rgb: 0x90ee90, origin: './x11' },
  { name: 'orchid', rgb: 0xda70d6, origin: './x11' },
  { name: 'gainsboro', rgb: 0xdcdcdc, origin: './x11' },
  { name: 'mediumseagreen', rgb: 0x3cb371, origin: './x11' },
  { name: 'lightgray', rgb: 0xd3d3d3, origin: './x11' },
  { name: 'mediumturquoise', rgb: 0x48d1cc, origin: './x11' },
  { name: 'lemonchiffon', rgb: 0xfffacd, origin: './x11' },
  { name: 'cadetblue', rgb: 0x5f9ea0, origin: './x11' },
  { name: 'lightyellow', rgb: 0xffffe0, origin: './x11' },
  { name: 'lavenderblush', rgb: 0xfff0f5, origin: './x11' },
  { name: 'coral', rgb: 0xff7f50, origin: './x11' },
  { name: 'purple', rgb: 0x800080, origin: './x11' },
  { name: 'aqua', rgb: 0x00ffff, origin: './x11' },
  { name: 'whitesmoke', rgb: 0xf5f5f5, origin: './x11' },
  { name: 'mediumslateblue', rgb: 0x7b68ee, origin: './x11' },
  { name: 'darkorange', rgb: 0xff8c00, origin: './x11' },
  { name: 'mediumaquamarine', rgb: 0x66cdaa, origin: './x11' },
  { name: 'darksalmon', rgb: 0xe9967a, origin: './x11' },
  { name: 'beige', rgb: 0xf5f5dc, origin: './x11' },
  { name: 'blueviolet', rgb: 0x8a2be2, origin: './x11' },
  { name: 'azure', rgb: 0xf0ffff, origin: './x11' },
  { name: 'lightsteelblue', rgb: 0xb0c4de, origin: './x11' },
  { name: 'oldlace', rgb: 0xfdf5e6, origin: './x11' }
];

const toChromaNameFromRgb = (rgb) => {
  const suffix = rgb.toString(16);
  const prefix = '#000000';
  return prefix.substring(0, 7 - suffix.length) + suffix;
};

const toEntryFromChromaName = (chromaName) => {
  let bestDistance = Infinity;
  let best;
  for (const entry of colors) {
    const distance = chroma.distance(chromaName, toChromaNameFromRgb(entry.rgb));
    if (distance < bestDistance) {
      best = entry;
      bestDistance = distance;
    }
  }
  return best;
};

const toTagFromChromaName = (name) => {
  const entry = toEntryFromChromaName(name);
  if (entry !== undefined) {
    return `color/${entry.name.toLowerCase()}`;
  }
  return `color/unknown`;
};

const toRgbFromChromaName = (name, defaultRgb = [0, 0, 0]) => {
  const entry = toEntryFromChromaName(name);
  if (entry !== undefined) {
    const { rgb } = entry;
    const result = [(rgb >> 16) & 0xFF,
                    (rgb >> 8) & 0xFF,
                    (rgb >> 0) & 0xFF];
    return result;
  }
  return defaultRgb;
};

const toRgbFromName = (name, defaultRgb = [0, 0, 0]) => {
  const normalizedName = name.toLowerCase();
  for (const { name, rgb } of colors) {
    if (normalizedName === name) {
      const result = [(rgb >> 16) & 0xFF,
                      (rgb >> 8) & 0xFF,
                      (rgb >> 0) & 0xFF];
      return result;
    }
  }
  return toRgbFromChromaName(name, defaultRgb);
};

const toTagFromRgbInt = (rgbInt, defaultTag = 'color/black') =>
  toTagFromChromaName(`rgb(${(rgbInt >> 16) & 0xFF},${(rgbInt >> 8) & 0xFF},${(rgbInt >> 0) & 0xFF})`);

const toTagFromRgb = ([r = 0, g = 0, b = 0], defaultTag = 'color/black') =>
  toTagFromChromaName(`rgb(${r},${g},${b})`);

const toRgb = (tags = [], defaultRgb = [0, 0, 0]) => {
  let rgb = defaultRgb;
  for (const tag of tags) {
    if (tag.startsWith('color/')) {
      let entry = toRgbFromName(tag.substring(6));
      if (entry !== undefined) {
        return entry;
      }
    }
  }
  return rgb;
};

const toTagFromName = (name) => {
  const tag = toTagFromRgb(toRgbFromName(name));
  return tag;
};

const toTagsFromName = (name) => {
  return [toTagFromName(name)];
};

export { toRgb, toTagFromName, toTagFromRgbInt, toTagsFromName };
