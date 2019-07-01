import {
  MASK_BASE_STYLE,
  SLOT_BASE_STYLE,
  PREVENT_LAYER_STYLE,
  BASE_OPTIONS,
  noop,
  preventDefault
} from './const.js'

export default class Smartour {
  constructor (options = {}) {
    this._init(options)

    this.preventLayer = null
    this.instance = null
    this.slot = null
  }

  _init (options) {
    options = { ...BASE_OPTIONS, ...options }
    this.maskStyle = MASK_BASE_STYLE + options.maskStyle
    this.slotStyle = SLOT_BASE_STYLE + options.slotStyle

    this.maskPadding = options.maskPadding
    this.slotPosition = options.slotPosition

    this.maskEventType = options.maskEventType
    this.maskEvent = options.maskEvent
  }

  _createPreventLayer () {
    if (!this.preventLayer) {
      this.preventLayer = document.createElement('div')
      this.preventLayer.setAttribute('class', 'smartour-prevent')
      this.preventLayer.setAttribute('style', PREVENT_LAYER_STYLE)
      ;['click', 'scroll', 'mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend'].forEach(event => {
        this.preventLayer.addEventListener(event, preventDefault)
      })
      this.preventLayer.addEventListener(this.maskEventType, this.maskEvent)
      document.body.appendChild(this.preventLayer)
    }
  }

  _createInstance () {
    if (!this.instance) {
      this.instance = document.createElement('div')
      this.instance.setAttribute('id', 'smartour-instance')
      document.body.appendChild(this.instance)
    }
  }

  _createSlot (html) {
    if (!this.slot) {
      this.slot = document.createElement('div')
      this.slot.setAttribute('id', 'smartour-slot')
      this.slot.style.position = 'fixed'
      document.body.appendChild(this.slot)
    }
    this.slot.innerHTML = html
  }

  _getSlotPosition (instanceTop, instanceLeft, instanceWidth, instanceHeight) {
    const { height, width } = this.slot.getBoundingClientRect()
    let slotPos = `
      top: ${instanceTop - height}px;
      left: ${instanceLeft}px;
    `
    if (this.slotPosition === 'top-left') {
      
    } else if (this.slotPosition === 'top') {
      slotPos = `
        top: ${instanceTop - height}px;
        left: ${instanceLeft + instanceWidth / 2 - width / 2}px;
      `
    } else if (this.slotPosition === 'top-right') {
      slotPos = `
        top: ${instanceTop - height}px;
        left: ${instanceLeft + instanceWidth - width}px;
      `
    } else if (this.slotPosition === 'bottom') {
      slotPos = `
        top: ${instanceTop + instanceHeight}px;
        left: ${instanceLeft + instanceWidth / 2 - width / 2}px;
      `
    } else if (this.slotPosition === 'bottom-left') {
      slotPos = `
        top: ${instanceTop + instanceHeight}px;
        left: ${instanceLeft}px;
      `
    } else if (this.slotPosition === 'bottom-right') {
      slotPos = `
        top: ${instanceTop + instanceHeight}px;
        left: ${instanceLeft + instanceWidth - width}px;
      `
    }
    return slotPos
  }

  _show (next = true) {
    next ? this.tourIndex++ : this.tourIndex--
    if (this.tourIndex >= this.tourListLength || this.tourIndex < -1) {
      throw new Error(`There has no more ${next ? 'next' : 'prev'} tour to show.`)
    }
    const tour =  this.tourList[this.tourIndex]

    this._createPreventLayer()
    this._createInstance()
    this._createSlot(tour.slot)

    const target = document.querySelector(tour.el)
    const { width, height, top, left, right, bottom } = target.getBoundingClientRect()
    const [instanceTop, instanceLeft, instanceWidth, instanceHeight] = [top - this.maskPadding.vertical, left - this.maskPadding.horizontal, width + 2 * this.maskPadding.horizontal, height + 2 * this.maskPadding.vertical]
    this.instance.setAttribute('style', this.maskStyle + `
      top: ${instanceTop}px;
      left: ${instanceLeft}px;
      width: ${instanceWidth}px;
      height: ${instanceHeight}px;
    `)
    this.slot.setAttribute('style', this.slotStyle + this._getSlotPosition(instanceTop, instanceLeft, instanceWidth, instanceHeight))

    tour.keyNodes.forEach(({ el, event, eventType = 'click' }) => {
      document.querySelector(el).addEventListener(eventType, event)
    })
  }

  reset (options = {}) {
    this._init(options)
  }

  queue (tourList) {
    this.tourList = tourList
    this.tourListLength = tourList.length
    this.tourIndex = -1

    return this
  }

  next () {
    this._show(true)
    return Promise.resolve(this)
  }

  prev () {
    this._show(false)
    return Promise.resolve(this)
  }

  over (smartour) {
    document.body.removeChild(this.instance)
    document.body.removeChild(this.preventLayer)
    document.body.removeChild(this.slot)

    smartour = null
  }
}
