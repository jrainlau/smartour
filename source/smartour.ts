import {
  Options,
  MaskPadding,
  SlotPosition,
  EventType,
  TourList
} from './d'

import {
  MASK_BASE_STYLE,
  SLOT_BASE_STYLE,
  PREVENT_LAYER_STYLE,
  BASE_OPTIONS,
  preventDefault
} from './const'

export default class Smartour {
  maskStyle: String
  slotStyle: String
  maskPadding: MaskPadding
  slotPosition: SlotPosition
  maskEventType: EventType
  maskEvent: EventListener

  preventLayer: HTMLElement
  instance: HTMLElement
  slot: HTMLElement

  tourIndex: number
  tourListLength: number
  tourList: TourList

  constructor (options: Options = {}) {
    this.init(options)
  }

  private init (options: Options) {
    options = { ...BASE_OPTIONS, ...options }
    this.maskStyle = MASK_BASE_STYLE + options.maskStyle
    this.slotStyle = SLOT_BASE_STYLE + options.slotStyle

    this.maskPadding = options.maskPadding
    this.slotPosition = options.slotPosition

    this.maskEventType = options.maskEventType
    this.maskEvent = options.maskEvent
  }

  private createPreventLayer () {
    if (!this.preventLayer) {
      this.preventLayer = document.createElement('div')
      this.preventLayer.setAttribute('class', 'smartour-prevent')
      this.preventLayer.setAttribute('style', PREVENT_LAYER_STYLE)
      ;['click', 'mouseon', 'mouseover', 'mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend'].forEach(event => {
        this.preventLayer.addEventListener(event, preventDefault)
      })
      this.preventLayer.addEventListener(this.maskEventType, this.maskEvent)
      document.body.appendChild(this.preventLayer)
    }
  }

  private createInstance () {
    if (!this.instance) {
      this.instance = document.createElement('div')
      this.instance.setAttribute('id', 'smartour-instance')
      document.body.appendChild(this.instance)
    }
  }

  private createSlot (html: string) {
    if (!this.slot) {
      this.slot = document.createElement('div')
      this.slot.setAttribute('id', 'smartour-slot')
      this.slot.style.position = 'fixed'
      document.body.appendChild(this.slot)
    }
    this.slot.innerHTML = html
  }

  private getSlotPosition (instanceTop: number, instanceLeft: number, instanceWidth: number, instanceHeight: number) {
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

  private show (next: Boolean = true) {
    next ? this.tourIndex++ : this.tourIndex--
    if (this.tourIndex >= this.tourListLength || this.tourIndex < -1) {
      throw new Error(`There has no more ${next ? 'next' : 'prev'} tour to show.`)
    }
    const tour =  this.tourList[this.tourIndex]

    this.createPreventLayer()
    this.createInstance()
    this.createSlot(tour.slot)

    const target = document.querySelector(tour.el)
    const { width, height, top, left, right, bottom } = target.getBoundingClientRect()
    const [instanceTop, instanceLeft, instanceWidth, instanceHeight] = [top - this.maskPadding.vertical, left - this.maskPadding.horizontal, width + 2 * this.maskPadding.horizontal, height + 2 * this.maskPadding.vertical]
    this.instance.setAttribute('style', this.maskStyle + `
      top: ${instanceTop}px;
      left: ${instanceLeft}px;
      width: ${instanceWidth}px;
      height: ${instanceHeight}px;
    `)
    this.slot.setAttribute('style', this.slotStyle + this.getSlotPosition(instanceTop, instanceLeft, instanceWidth, instanceHeight))

    tour.keyNodes && tour.keyNodes.forEach(({ el, event, eventType = 'click' }) => {
      document.querySelector(el).addEventListener(eventType, event)
    })
  }

  reset (options: Options = {}) {
    this.init(options)
  }

  queue (tourList: TourList) {
    this.tourList = tourList
    this.tourListLength = tourList.length
    this.tourIndex = -1

    return this
  }

  next () {
    this.show(true)
    return Promise.resolve(this)
  }

  prev () {
    this.show(false)
    return Promise.resolve(this)
  }

  over (smartour: Smartour) {
    document.body.removeChild(this.instance)
    document.body.removeChild(this.preventLayer)
    document.body.removeChild(this.slot)

    smartour = null
  }
}