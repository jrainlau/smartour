(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Smartour = factory());
}(this, function () { 'use strict';

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

    var noop = function () { };
    var preventDefault = function (e) { e.preventDefault(); };
    var MASK_BASE_STYLE = "\n  position: fixed;\n  box-shadow: 0 0 0 9999px rgba(0, 0, 0, .5);\n  z-index: 9998;\n";
    var SLOT_BASE_STYLE = "\n  position: fixed;\n  z-index: 9999;\n";
    var PREVENT_LAYER_STYLE = "\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 9997;\n";
    var BASE_OPTIONS = {
        maskStyle: '',
        slotStyle: '',
        maskPadding: { vertical: 5, horizontal: 5 },
        slotPosition: 'bottom',
        maskEventType: 'click',
        maskEvent: noop
    };

    var Smartour = /** @class */ (function () {
        function Smartour(options) {
            if (options === void 0) { options = {}; }
            this.init(options);
        }
        Smartour.prototype.init = function (options) {
            options = __assign({}, BASE_OPTIONS, options);
            this.maskStyle = MASK_BASE_STYLE + options.maskStyle;
            this.slotStyle = SLOT_BASE_STYLE + options.slotStyle;
            this.maskPadding = options.maskPadding;
            this.slotPosition = options.slotPosition;
            this.maskEventType = options.maskEventType;
            this.maskEvent = options.maskEvent;
        };
        Smartour.prototype.createPreventLayer = function () {
            var _this = this;
            if (!this.preventLayer) {
                this.preventLayer = document.createElement('div');
                this.preventLayer.setAttribute('class', 'smartour-prevent');
                this.preventLayer.setAttribute('style', PREVENT_LAYER_STYLE);
                ['click', 'mouseon', 'mouseover', 'mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend'].forEach(function (event) {
                    _this.preventLayer.addEventListener(event, preventDefault);
                });
                this.preventLayer.addEventListener(this.maskEventType, this.maskEvent);
                document.body.appendChild(this.preventLayer);
            }
        };
        Smartour.prototype.createInstance = function () {
            if (!this.instance) {
                this.instance = document.createElement('div');
                this.instance.setAttribute('id', 'smartour-instance');
                document.body.appendChild(this.instance);
            }
        };
        Smartour.prototype.createSlot = function (html) {
            if (!this.slot) {
                this.slot = document.createElement('div');
                this.slot.setAttribute('id', 'smartour-slot');
                this.slot.style.position = 'fixed';
                document.body.appendChild(this.slot);
            }
            this.slot.innerHTML = html;
        };
        Smartour.prototype.getSlotPosition = function (instanceTop, instanceLeft, instanceWidth, instanceHeight) {
            var _a = this.slot.getBoundingClientRect(), height = _a.height, width = _a.width;
            var slotPos = "\n      top: " + (instanceTop - height) + "px;\n      left: " + instanceLeft + "px;\n    ";
            if (this.slotPosition === 'top-left') ;
            else if (this.slotPosition === 'top') {
                slotPos = "\n        top: " + (instanceTop - height) + "px;\n        left: " + (instanceLeft + instanceWidth / 2 - width / 2) + "px;\n      ";
            }
            else if (this.slotPosition === 'top-right') {
                slotPos = "\n        top: " + (instanceTop - height) + "px;\n        left: " + (instanceLeft + instanceWidth - width) + "px;\n      ";
            }
            else if (this.slotPosition === 'bottom') {
                slotPos = "\n        top: " + (instanceTop + instanceHeight) + "px;\n        left: " + (instanceLeft + instanceWidth / 2 - width / 2) + "px;\n      ";
            }
            else if (this.slotPosition === 'bottom-left') {
                slotPos = "\n        top: " + (instanceTop + instanceHeight) + "px;\n        left: " + instanceLeft + "px;\n      ";
            }
            else if (this.slotPosition === 'bottom-right') {
                slotPos = "\n        top: " + (instanceTop + instanceHeight) + "px;\n        left: " + (instanceLeft + instanceWidth - width) + "px;\n      ";
            }
            return slotPos;
        };
        Smartour.prototype.show = function (next) {
            if (next === void 0) { next = true; }
            next ? this.tourIndex++ : this.tourIndex--;
            if (this.tourIndex >= this.tourListLength || this.tourIndex < -1) {
                throw new Error("There has no more " + (next ? 'next' : 'prev') + " tour to show.");
            }
            var tour = this.tourList[this.tourIndex];
            this.createPreventLayer();
            this.createInstance();
            this.createSlot(tour.slot);
            var target = document.querySelector(tour.el);
            var _a = target.getBoundingClientRect(), width = _a.width, height = _a.height, top = _a.top, left = _a.left, right = _a.right, bottom = _a.bottom;
            var _b = [top - this.maskPadding.vertical, left - this.maskPadding.horizontal, width + 2 * this.maskPadding.horizontal, height + 2 * this.maskPadding.vertical], instanceTop = _b[0], instanceLeft = _b[1], instanceWidth = _b[2], instanceHeight = _b[3];
            this.instance.setAttribute('style', this.maskStyle + ("\n      top: " + instanceTop + "px;\n      left: " + instanceLeft + "px;\n      width: " + instanceWidth + "px;\n      height: " + instanceHeight + "px;\n    "));
            this.slot.setAttribute('style', this.slotStyle + this.getSlotPosition(instanceTop, instanceLeft, instanceWidth, instanceHeight));
            tour.keyNodes && tour.keyNodes.forEach(function (_a) {
                var el = _a.el, event = _a.event, _b = _a.eventType, eventType = _b === void 0 ? 'click' : _b;
                document.querySelector(el).addEventListener(eventType, event);
            });
        };
        Smartour.prototype.reset = function (options) {
            if (options === void 0) { options = {}; }
            this.init(options);
        };
        Smartour.prototype.queue = function (tourList) {
            this.tourList = tourList;
            this.tourListLength = tourList.length;
            this.tourIndex = -1;
            return this;
        };
        Smartour.prototype.next = function () {
            this.show(true);
            return Promise.resolve(this);
        };
        Smartour.prototype.prev = function () {
            this.show(false);
            return Promise.resolve(this);
        };
        Smartour.prototype.over = function (smartour) {
            document.body.removeChild(this.instance);
            document.body.removeChild(this.preventLayer);
            document.body.removeChild(this.slot);
        };
        return Smartour;
    }());

    return Smartour;

}));
