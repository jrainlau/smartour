/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var SlotPosition;
(function (SlotPosition) {
    SlotPosition["TOP"] = "top";
    SlotPosition["BOTTOM"] = "bottom";
    SlotPosition["LEFT"] = "left";
    SlotPosition["RIGHT"] = "right";
})(SlotPosition || (SlotPosition = {}));

var maskStyle = function (maskColor) { return "\nposition: absolute;\nborder-radius: 4px;\nbox-shadow: 0 0 0 9999px " + maskColor + ";\nz-index: 10001 !important;\ntransition: all .3s;\n"; };
var slotStyle = function () { return "\nposition: absolute;\nz-index: 10002 !important;\ntransition: all .3s;\n"; };
var layerStyle = function () { return "\nposition: fixed;\ntop: 0;\nleft: 0;\nright: 0;\nbottom: 0;\nz-index: 10000 !important;\n"; };

var defaultOptions = {
    prefix: 'smartour',
    padding: 5,
    maskColor: 'rgba(0, 0, 0, .5)',
    animate: true,
    slotPosition: SlotPosition.TOP
};
var Smartour = /** @class */ (function () {
    function Smartour(options) {
        if (options === void 0) { options = {}; }
        this.options = __assign({}, defaultOptions, { layerEvent: this.over.bind(this) }, options);
        this.mask = null;
        this.slot = null;
        this.layer = null;
    }
    Smartour.prototype._createMask = function () {
        if (!this.mask) {
            this.mask = document.createElement('div');
            this.mask.setAttribute('class', this.options.prefix + '-mask');
            this.mask.setAttribute('style', maskStyle(this.options.maskColor));
            document.body.appendChild(this.mask);
        }
    };
    Smartour.prototype._createSlot = function (html) {
        if (!this.slot) {
            this.slot = document.createElement('div');
            this.slot.setAttribute('style', slotStyle());
            document.body.appendChild(this.slot);
        }
        this.slot.setAttribute('class', this.options.prefix + "-slot " + this.options.prefix + "-slot_" + this.options.slotPosition);
        this.slot.innerHTML = html;
    };
    Smartour.prototype._createLayer = function () {
        if (!this.layer) {
            this.layer = document.createElement('div');
            this.layer.setAttribute('class', this.options.prefix + '-layer');
            this.layer.setAttribute('style', layerStyle());
            this.layer.addEventListener('click', this.options.layerEvent);
            document.body.appendChild(this.layer);
        }
    };
    Smartour.prototype._setPosition = function (el, attrs) {
        ['top', 'left', 'width', 'height'].forEach(function (attr, index) {
            if (attrs[index]) {
                if (attr === 'top' || attr === 'left') {
                    var scrollDirection = "scroll" + (attr.charAt(0).toUpperCase() + attr.slice(1));
                    var scrollDistance = 0;
                    if (document.documentElement && document.documentElement[scrollDirection]) {
                        scrollDistance = document.documentElement[scrollDirection];
                    }
                    else {
                        scrollDistance = document.body[scrollDirection];
                    }
                    el.style[attr] = attrs[index] + scrollDistance + 'px';
                }
                else {
                    el.style[attr] = attrs[index] + 'px';
                }
            }
        });
    };
    Smartour.prototype._show = function (targetSelector, slotHtml, keyNodes) {
        var _a, _b, _c, _d;
        if (slotHtml === void 0) { slotHtml = ''; }
        if (keyNodes === void 0) { keyNodes = []; }
        this._createMask();
        this._createSlot(slotHtml);
        this._createLayer();
        if (!this.options.animate) {
            this.mask.style.transition = null;
            this.slot.style.transition = null;
        }
        var target = document.querySelector(targetSelector);
        var _e = target.getBoundingClientRect(), top = _e.top, left = _e.left, width = _e.width, height = _e.height;
        var _f = [top - this.options.padding, left - this.options.padding, width + 2 * this.options.padding, height + 2 * this.options.padding], maskTop = _f[0], maskLeft = _f[1], maskWidth = _f[2], maskHeight = _f[3];
        this._setPosition(this.mask, [maskTop, maskLeft, maskWidth, maskHeight]);
        var _g = this.slot.getBoundingClientRect(), slotWidth = _g.width, slotHeight = _g.height;
        var slotPosition = this.options.slotPosition;
        var _h = [0, 0], slotTop = _h[0], slotLeft = _h[1];
        if (slotPosition === 'top') {
            _a = [maskTop - slotHeight, maskLeft + maskWidth / 2 - slotWidth / 2], slotTop = _a[0], slotLeft = _a[1];
        }
        else if (slotPosition === 'bottom') {
            _b = [maskTop + maskHeight, maskLeft + maskWidth / 2 - slotWidth / 2], slotTop = _b[0], slotLeft = _b[1];
        }
        else if (slotPosition === 'left') {
            _c = [maskTop - (slotHeight - maskHeight) / 2, maskLeft - slotWidth], slotTop = _c[0], slotLeft = _c[1];
        }
        else if (slotPosition === 'right') {
            _d = [maskTop - (slotHeight - maskHeight) / 2, maskLeft + maskWidth], slotTop = _d[0], slotLeft = _d[1];
        }
        this._setPosition(this.slot, [slotTop, slotLeft]);
        if (!slotHtml) {
            document.body.removeChild(this.slot);
            this.slot = null;
        }
        if (keyNodes.length) {
            keyNodes.forEach(function (_a) {
                var el = _a.el, event = _a.event;
                document.querySelector(el).addEventListener('click', event);
            });
        }
    };
    Smartour.prototype.focus = function (highlightElement) {
        if (highlightElement === void 0) { highlightElement = { el: '', slot: '', keyNodes: [], options: {} }; }
        if (highlightElement.options && Object.keys(highlightElement.options).length) {
            this.options = __assign({}, this.options, highlightElement.options);
        }
        this._show(highlightElement.el, highlightElement.slot, highlightElement.keyNodes);
    };
    Smartour.prototype.queue = function (tourList) {
        this.tourList = tourList;
        this.tourListLength = tourList.length;
        this.tourIndex = -1;
        return this;
    };
    Smartour.prototype.run = function (isNext) {
        if (isNext === void 0) { isNext = true; }
        if (this.tourListLength && this.tourIndex < this.tourListLength - 1) {
            isNext ? this.tourIndex++ : this.tourIndex--;
            var tour = this.tourList[this.tourIndex];
            if (tour.options) {
                this.options = __assign({}, this.options, tour.options);
            }
            this._show(tour.el, tour.slot, tour.keyNodes);
        }
        else {
            this.over();
        }
    };
    Smartour.prototype.next = function () {
        this.run(true);
    };
    Smartour.prototype.prev = function () {
        this.run(false);
    };
    Smartour.prototype.over = function () {
        var _this = this;
        this.mask && document.body.removeChild(this.mask);
        this.slot && document.body.removeChild(this.slot);
        this.layer && document.body.removeChild(this.layer);
        ['mask', 'slot', 'layer'].forEach(function (attr) {
            _this[attr] = null;
        });
    };
    return Smartour;
}());

export default Smartour;
