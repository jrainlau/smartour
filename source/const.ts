import {
  Options
} from './d'

export const noop: EventListener = () => {}

export const preventDefault: EventListener = (e: any) => { e.preventDefault() }

export const MASK_BASE_STYLE: string = `
  position: fixed;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, .5);
  z-index: 9998;
`

export const SLOT_BASE_STYLE: string = `
  position: fixed;
  z-index: 9999;
`

export const PREVENT_LAYER_STYLE: string = `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9997;
`
export const BASE_OPTIONS: Options = {
  maskStyle: '',
  slotStyle: '',
  maskPadding: { vertical: 5, horizontal: 5 },
  slotPosition: 'bottom',
  maskEventType: 'click',
  maskEvent: noop
}
