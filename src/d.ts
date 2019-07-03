export interface MaskPadding {
  vertical: number
  horizontal: number
}

export type SlotPosition = 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left'
export type EventType = 'click' | 'mouseon' | 'mouseover' | 'mousedown' | 'mousemove' | 'mouseup' | 'touchstart' | 'touchmove' | 'touchend'

interface KeyNodes {
  el: string
  event: EventListener
  eventType: EventType
}

export interface TourListItem {
  el: string
  slot: string
  options: Options
  keyNodes: Array<KeyNodes>
}

export interface TourList extends Array<TourListItem> {}

export interface Options {
  maskStyle?: String
  slotStyle?: String
  maskPadding?: MaskPadding
  slotPosition?: SlotPosition
  maskEventType?: EventType
  maskEvent?: EventListener
}
