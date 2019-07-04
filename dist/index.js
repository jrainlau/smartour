(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Smartour = factory());
}(this, function () { 'use strict';

  const maskStyle = (maskColor, animate) => `
position: absolute;
border-radius: 4px;
box-shadow: 0 0 0 9999px ${maskColor};
z-index: 10001 !important;
transition: all .3s;
`;

  const slotStyle = (animate) => `
position: absolute;
z-index: 10002 !important;
transition: all .3s;
`;

  const layerStyle = () => `
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
z-index: 10000 !important;
`;

  const noop = () => {};

  const defaultOptions = {
    prefix: 'smartour',
    padding: 5,
    maskColor: 'rgba(0, 0, 0, .5)',
    animate: true,
    slotPosition: 'top',
    layerEvent: noop
  };

  class Smartour {
    constructor (options = {}) {
      this.options = {
        ...defaultOptions,
        layerEvent: this.over.bind(this),
        ...options
      };

      this.mask = null;
      this.slot = null;
      this.layer = null;
    }

    _createMask () {
      if (!this.mask) {
        this.mask = document.createElement('div');
        this.mask.setAttribute('class', this.options.prefix + '-mask');
        this.mask.setAttribute('style', maskStyle(this.options.maskColor));
        document.body.appendChild(this.mask);
      }
    }

    _createSlot (html) {
      if (!this.slot) {
        this.slot = document.createElement('div');
        this.slot.setAttribute('style', slotStyle());
        document.body.appendChild(this.slot);
      }
      this.slot.setAttribute('class', `${this.options.prefix}-slot ${this.options.prefix}-slot_${this.options.slotPosition}`);
      this.slot.innerHTML = html;
    }

    _createLayer () {
      if (!this.layer) {
        this.layer = document.createElement('div');
        this.layer.setAttribute('class', this.options.prefix + '-layer');
        this.layer.setAttribute('style', layerStyle());
        this.layer.addEventListener('click', this.options.layerEvent);
        document.body.appendChild(this.layer);
      }
    }

    _setPosition (el, attrs) {
  ['top', 'left', 'width', 'height'].forEach((attr, index) => {
        if (attrs[index]) {
          if (attr === 'top' || attr === 'left') {
            const scrollDirection = `scroll${attr.charAt(0).toUpperCase() + attr.slice(1)}`;
            el.style[attr] = attrs[index] + document.documentElement[scrollDirection] + 'px';
          } else {
            el.style[attr] = attrs[index] + 'px';
          }
        }
      });
    }

    _show (targetSelector, slotHtml = '', keyNodes = []) {
      this._createMask();
      this._createSlot(slotHtml);
      this._createLayer();

      if (!this.options.animate) {
        this.mask.style.transition = null;
        this.slot.style.transition = null;
      }

      const target = document.querySelector(targetSelector);
      const { top, left, width, height } = target.getBoundingClientRect();
      const [maskTop, maskLeft, maskWidth, maskHeight] = [top - this.options.padding, left - this.options.padding, width + 2 * this.options.padding, height + 2 * this.options.padding];

      this._setPosition(this.mask, [maskTop, maskLeft, maskWidth, maskHeight]);

      const { width: slotWidth, height: slotHeight } = this.slot.getBoundingClientRect();
      const { slotPosition } = this.options;
      let [slotTop, slotLeft] = [0, 0];

      if (slotPosition === 'top') {
        [slotTop, slotLeft] = [maskTop - slotHeight, maskLeft + maskWidth / 2 - slotWidth / 2];
      } else if (slotPosition === 'bottom') {
        [slotTop, slotLeft] = [maskTop + maskHeight, maskLeft + maskWidth / 2 - slotWidth / 2];
      } else if (slotPosition === 'left') {
        [slotTop, slotLeft] = [maskTop - (slotHeight - maskHeight) / 2, maskLeft - slotWidth];
      } else if (slotPosition === 'right') {
        [slotTop, slotLeft] = [maskTop - (slotHeight - maskHeight) / 2, maskLeft + maskWidth];
      }

      this._setPosition(this.slot, [slotTop, slotLeft]);
      if (!slotHtml) {
        document.body.removeChild(this.slot);
        this.slot = null;
      }

      if (keyNodes.length) {
        keyNodes.forEach(({ el, event }) => {
          document.querySelector(el).addEventListener('click', event);
        });
      }
    }

    focus ({ el = '', slot = '', keyNodes = [], options = {}}) {
      if (Object.keys(options).length) {
        this.options = { ...this.options, ...options };
      }
      this._show(el, slot, keyNodes);
    }

    queue (tourList) {
      this.tourList = tourList;
      this.tourListLength = tourList.length;
      this.tourIndex = -1;

      return this
    }

    run (isNext = true) {
      if (this.tourListLength && this.tourIndex < this.tourListLength - 1) {
        isNext ? this.tourIndex++ : this.tourIndex--;
        const tour = this.tourList[this.tourIndex];
        if (tour.options) {
          this.options = { ...this.options, ...tour.options };
        }
        this._show(tour.el, tour.slot, tour.keyNodes);
      } else {
        this.over();
      }
    }

    next () {
      this.run(true);
    }

    prev () {
      this.run(false);
    }

    over () {
      this.mask && document.body.removeChild(this.mask);
      this.slot && document.body.removeChild(this.slot);
      this.layer && document.body.removeChild(this.layer)

      ;['mask', 'slot', 'layer'].forEach(attr => {
        this[attr] = null;
      });
    }
  }

  return Smartour;

}));
