export enum SlotPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right'
}

export interface Options {
  prefix?: string
  padding?: number
  maskColor?: string
  animate?: boolean
  slotPosition?: SlotPosition
  layerEvent?: EventListener
}

export interface HightlightElement {
  el: string
  slot: string
  options: Options
  keyNodes: Array<KeyNode>
}

export interface KeyNode {
  el: string
  event: EventListener
}
