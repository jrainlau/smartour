export const maskStyle = (maskColor: string) => `
position: absolute;
border-radius: 4px;
box-shadow: 0 0 0 9999px ${maskColor};
z-index: 10001 !important;
transition: all .3s;
`

export const slotStyle = () => `
position: absolute;
z-index: 10002 !important;
transition: all .3s;
`

export const layerStyle = () => `
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
z-index: 10000 !important;
`

export const noop = () => {}

export const preventDefault = (e: Event) => e.preventDefault
